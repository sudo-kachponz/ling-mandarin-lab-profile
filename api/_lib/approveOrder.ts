import { randomUUID } from 'crypto';
import { settlePayment } from './grantEntitlement.js';
import { notifyTelegram, formatIDR } from './telegram.js';
import { getSupabaseAdmin } from './supabaseAdmin.js';
import { proofUploaded } from './proof.js';

/**
 * Shared approve/reject for a manual order. Used by BOTH /api/admin/verify
 * (Supabase-admin auth) and /api/admin/dashboard (password auth) so the two
 * paths can never grant access differently.
 */

function baseUrl() {
  return (process.env.PUBLIC_BASE_URL || 'https://www.lingchineselab.com').replace(/\/$/, '');
}

export type ApproveResult =
  | { ok: true; accessUrl: string; alreadyPaid: boolean }
  | { ok: false; status: number; error: string };

/** Approve an order: settle → mint access token → return the reader link. */
export async function approveOrder(orderRef: string, actor: string): Promise<ApproveResult> {
  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select('amount, access_token, status, proof_path, product:products(title, slug)')
    .eq('order_ref', orderRef)
    .single();
  if (!order) return { ok: false, status: 404, error: 'Order tidak ditemukan.' };

  // Never grant access to an order whose buyer never uploaded a proof. The order
  // enters 'awaiting_verification' at QRIS-generation time, so this — not the
  // status — is the real gate. Skip for already-paid orders (idempotent re-approve).
  if (order.status !== 'paid' && !(await proofUploaded(order.proof_path as string | null))) {
    return { ok: false, status: 400, error: 'Belum bisa disetujui: pembeli belum mengunggah bukti pembayaran.' };
  }

  const product = (order as unknown as { product: { title: string; slug: string } | null }).product;
  const productTitle = product?.title ?? 'E-Book';
  const productSlug = product?.slug ?? '';

  const result = await settlePayment({ orderRef, source: 'manual' });
  if (!result.ok && !result.alreadyPaid) {
    return { ok: false, status: 500, error: `Gagal menyetujui: ${result.reason}` };
  }

  // Mint a no-email access token once (idempotent — reuse if already set).
  let accessToken = order.access_token as string | null;
  if (!accessToken) {
    accessToken = randomUUID();
    await supabase.from('orders').update({ access_token: accessToken }).eq('order_ref', orderRef);
  }
  await supabase
    .from('orders')
    .update({ verified_by: actor, verified_at: new Date().toISOString() })
    .eq('order_ref', orderRef);

  const accessUrl = `${baseUrl()}/read/${productSlug}?t=${accessToken}`;

  if (!result.alreadyPaid) {
    await notifyTelegram(
      `✅ <b>Pembayaran disetujui</b>\n` +
        `Ref: <code>${orderRef}</code>\n` +
        `${productTitle} — ${formatIDR(order.amount)}\n` +
        `Oleh: ${actor}\n` +
        `➡️ Kirim link akses ke WhatsApp pembeli.`
    );
  }

  return { ok: true, accessUrl, alreadyPaid: !!result.alreadyPaid };
}

/**
 * Log a manual over-the-counter sale: buyer paid (QRIS/BCA) but their proof
 * upload failed, so the admin records name + WhatsApp + nominal + method by hand.
 * Creates the order, settles it (counts toward revenue + grants entitlement),
 * and returns the reader link to send via WhatsApp. No email is collected —
 * access is by token, so a unique placeholder satisfies the NOT NULL + the
 * (buyer_email, product_id) entitlement key.
 */
export async function createManualPaidOrder(input: {
  buyerName: string;
  buyerWhatsapp: string;
  amount: number;
  method: 'qris' | 'bca';
  actor: string;
  /** Admin optionally attaches a proof image — if so, we return an upload URL. */
  hasProof?: boolean;
}): Promise<
  | { ok: true; accessUrl: string; alreadyPaid: boolean; uploadUrl?: string }
  | { ok: false; status: number; error: string }
> {
  const supabase = getSupabaseAdmin();
  // Single-product store — Store.tsx sells products[0]; mirror that here.
  const { data: product } = await supabase
    .from('products')
    .select('id, slug, title')
    .limit(1)
    .maybeSingle();
  if (!product) return { ok: false, status: 500, error: 'Produk belum tersedia.' };

  const orderRef = `LCL-MP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const accessToken = randomUUID();
  const buyerEmail = `manual-${orderRef.toLowerCase()}@lingchineselab.com`;
  // Proof is optional; only reserve a path when the admin actually attached one.
  const proofPath = input.hasProof ? `proofs/${orderRef}` : null;

  // final_amount left null so this row stays out of the active-order unique
  // nominal index; the dashboard reads `final_amount ?? amount` anyway.
  const { error: insErr } = await supabase.from('orders').insert({
    order_ref: orderRef,
    product_id: product.id,
    buyer_email: buyerEmail,
    buyer_name: input.buyerName,
    buyer_whatsapp: input.buyerWhatsapp,
    amount: input.amount,
    payment_method: input.method,
    status: 'awaiting_verification',
    access_token: accessToken,
    proof_path: proofPath,
    verified_by: input.actor,
    verified_at: new Date().toISOString(),
  });
  if (insErr) return { ok: false, status: 500, error: insErr.message };

  // Settle from awaiting_verification (not 'paid') so the entitlement is granted.
  const result = await settlePayment({ orderRef, source: 'manual' });
  if (!result.ok) return { ok: false, status: 500, error: `Gagal mencatat: ${result.reason}` };

  let uploadUrl: string | undefined;
  if (proofPath) {
    const { data: signed } = await supabase.storage
      .from('payment-proofs')
      .createSignedUploadUrl(proofPath);
    uploadUrl = signed?.signedUrl;
  }

  const accessUrl = `${baseUrl()}/read/${product.slug ?? ''}?t=${accessToken}`;
  await notifyTelegram(
    `🧾 <b>Pesanan manual dicatat (${input.method === 'bca' ? 'Transfer BCA' : 'QRIS'})</b>\n` +
      `Ref: <code>${orderRef}</code>\n` +
      `${product.title} — ${formatIDR(input.amount)}\n` +
      `${input.buyerName} · WA: ${input.buyerWhatsapp}\n` +
      `Oleh: ${input.actor}`
  );
  return { ok: true, accessUrl, alreadyPaid: false, uploadUrl };
}

/** Reject an order: flip status + keep the proof for the audit trail. */
export async function rejectOrder(
  orderRef: string,
  actor: string,
  note?: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'rejected',
      rejection_note: note || null,
      verified_by: actor,
      verified_at: new Date().toISOString(),
    })
    .eq('order_ref', orderRef);
  if (error) return { ok: false, status: 500, error: error.message };
  return { ok: true };
}
