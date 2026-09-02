import type { VercelRequest, VercelResponse } from '@vercel/node';
import { approveOrder, rejectOrder, createManualPaidOrder } from '../_lib/approveOrder.js';
import { getSupabaseAdmin, withJsonErrors } from '../_lib/supabaseAdmin.js';
import { proofUploaded } from '../_lib/proof.js';

/**
 * Admin recap dashboard, gated by a simple username/password sent in headers.
 *
 * SECURITY NOTE: this is intentionally weak auth (owner's insistence). Anyone
 * with the password can approve orders (= grant irrevocable paid access) and
 * read every buyer's PII + proof. Change ADMIN_USER / ADMIN_PASSWORD in Vercel
 * away from the defaults before going live. The approve/reject logic is shared
 * with /api/admin/verify via approveOrder.ts so the two paths can't drift.
 */
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const PROOF_URL_TTL = 60 * 15; // 15 minutes

export default withJsonErrors(async function handler(req: VercelRequest, res: VercelResponse) {
  const user = String(req.headers['x-admin-user'] || '');
  const pass = String(req.headers['x-admin-password'] || '');
  // Fail closed: no password configured → nobody gets in (never default to admin123).
  if (!ADMIN_PASSWORD || user !== ADMIN_USER || pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  // Approve / reject — same grant path as /api/admin/verify.
  if (req.method === 'POST') {
    const body = (req.body || {}) as {
      orderRef?: string;
      action?: string;
      note?: string;
      phone?: string;
      buyerName?: string;
      buyerWhatsapp?: string;
      amount?: number | string;
      method?: string;
      hasProof?: boolean;
    };
    const { orderRef, action, note, phone } = body;

    // Manual over-the-counter sale — no orderRef; we mint one and settle it.
    if (action === 'manual_create') {
      const name = String(body.buyerName || '').trim();
      const wa = String(body.buyerWhatsapp || '').replace(/[^\d+]/g, '');
      const amount = Math.trunc(Number(body.amount));
      const method = body.method === 'bca' ? 'bca' : body.method === 'qris' ? 'qris' : null;
      if (name.length < 2) return res.status(400).json({ error: 'Nama pembeli tidak valid.' });
      if (wa.replace(/\D/g, '').length < 9) {
        return res.status(400).json({ error: 'Nomor WhatsApp tidak valid (min. 9 digit).' });
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Nominal tidak valid.' });
      }
      if (!method) return res.status(400).json({ error: 'Pilih metode QRIS atau BCA.' });
      try {
        const r = await createManualPaidOrder({
          buyerName: name,
          buyerWhatsapp: wa,
          amount,
          method,
          hasProof: body.hasProof === true,
          actor: 'dashboard:' + user,
        });
        if (!r.ok) {
          const f = r as { status: number; error: string };
          return res.status(f.status).json({ error: f.error });
        }
        return res.status(200).json({ ok: true, action: 'manual_create', accessUrl: r.accessUrl, uploadUrl: r.uploadUrl });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        console.error('[admin/dashboard] manual_create error:', error);
        return res.status(500).json({ error: message });
      }
    }

    if (
      !orderRef ||
      (action !== 'approve' && action !== 'reject' && action !== 'update_phone' && action !== 'delete')
    ) {
      return res.status(400).json({ error: 'Permintaan tidak valid.' });
    }
    try {
      if (action === 'delete') {
        // Hard-delete an order; the entitlements FK is ON DELETE CASCADE, so the
        // buyer's access row goes with it (used to clear test/mistake entries).
        const { error } = await getSupabaseAdmin().from('orders').delete().eq('order_ref', orderRef);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ ok: true, action: 'delete' });
      }
      if (action === 'update_phone') {
        // Fix a buyer's mistyped WhatsApp number so the access link reaches them.
        const clean = String(phone || '').replace(/[^\d+]/g, '');
        if (clean.replace(/\D/g, '').length < 9) {
          return res.status(400).json({ error: 'Nomor WhatsApp tidak valid (min. 9 digit).' });
        }
        const { error } = await getSupabaseAdmin()
          .from('orders')
          .update({ buyer_whatsapp: clean })
          .eq('order_ref', orderRef);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ ok: true, action: 'update_phone', phone: clean });
      }
      if (action === 'reject') {
        const r = await rejectOrder(orderRef, 'dashboard:' + user, note);
        if (!r.ok) {
          const f = r as { status: number; error: string };
          return res.status(f.status).json({ error: f.error });
        }
        return res.status(200).json({ ok: true, action: 'reject' });
      }
      const r = await approveOrder(orderRef, 'dashboard:' + user);
      if (!r.ok) {
        const f = r as { status: number; error: string };
        return res.status(f.status).json({ error: f.error });
      }
      return res.status(200).json({ ok: true, action: 'approve', accessUrl: r.accessUrl, alreadyPaid: r.alreadyPaid });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error('[admin/dashboard] action error:', error);
      return res.status(500).json({ error: message });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = getSupabaseAdmin();
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        'order_ref, buyer_email, buyer_name, buyer_whatsapp, amount, final_amount, unique_code, status, payment_method, proof_path, created_at, product:products(title)'
      )
      .in('status', ['awaiting_verification', 'paid', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(300);
    if (error) throw error;

    const result = (await Promise.all(
      (orders || []).map(async (o) => {
        // An awaiting order without an uploaded proof only generated a QR and
        // never paid — keep it out of the queue. Paid/rejected stay for audit.
        if (o.status === 'awaiting_verification' && !(await proofUploaded(o.proof_path))) {
          return null;
        }
        let proofUrl: string | null = null;
        if (o.proof_path) {
          const { data: signed } = await supabase.storage
            .from('payment-proofs')
            .createSignedUrl(o.proof_path, PROOF_URL_TTL);
          proofUrl = signed?.signedUrl ?? null;
        }
        return {
          orderRef: o.order_ref,
          buyerEmail: o.buyer_email,
          buyerName: o.buyer_name,
          buyerWhatsapp: o.buyer_whatsapp,
          amount: o.final_amount ?? o.amount,
          uniqueCode: o.unique_code,
          status: o.status,
          paymentMethod: o.payment_method,
          productTitle: (o.product as unknown as { title: string } | null)?.title ?? '(produk tidak ditemukan)',
          proofUrl,
          createdAt: o.created_at,
        };
      })
    )).filter((o): o is NonNullable<typeof o> => o !== null);

    // Today's settled revenue, counted at FIRST approval (paid_at is written once
    // and never overwritten on resend), split by payment method. Day boundary is
    // Asia/Jakarta (WIB, UTC+7, no DST) since that's the owner's timezone.
    const jkt = 7 * 60 * 60 * 1000;
    const j = new Date(Date.now() + jkt);
    const startUtc = new Date(
      Date.UTC(j.getUTCFullYear(), j.getUTCMonth(), j.getUTCDate()) - jkt
    ).toISOString();
    const { data: todayPaid } = await supabase
      .from('orders')
      .select('payment_method, final_amount, amount')
      .eq('status', 'paid')
      .gte('paid_at', startUtc);
    const today = { qris: 0, bca: 0, qrisCount: 0, bcaCount: 0 };
    for (const o of todayPaid || []) {
      const amt = (o.final_amount ?? o.amount ?? 0) as number;
      if (o.payment_method === 'qris') { today.qris += amt; today.qrisCount++; }
      else if (o.payment_method === 'bca') { today.bca += amt; today.bcaCount++; }
    }

    return res.status(200).json({ orders: result, today });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[admin/dashboard] error:', error);
    return res.status(500).json({ error: message });
  }
});
