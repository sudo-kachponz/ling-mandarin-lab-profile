import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, withJsonErrors } from './_lib/supabaseAdmin.js';

/**
 * Record a quiz result for the leaderboard. Identity comes from the order's
 * access_token (same token the reader uses) so only a real paid buyer can post,
 * and every score is attributed to them. Keeps the BEST score per (order, quiz).
 *
 * ponytail: the score is still client-reported, so a determined buyer could
 * inflate their own number. Fine for a friendly leaderboard; server-side grading
 * is the upgrade path if it ever needs to be tamper-proof.
 */
export default withJsonErrors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, slug, pageId, score, total } = req.body || {};
  if (!token || !slug || pageId == null) {
    return res.status(400).json({ error: 'token, slug, dan pageId wajib diisi.' });
  }
  const page = Number(pageId);
  const sc = Math.max(0, Number(score) || 0);
  const tot = Math.max(0, Number(total) || 0);
  if (!Number.isFinite(page) || sc > tot) {
    return res.status(400).json({ error: 'Data skor tidak valid.' });
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select('order_ref, buyer_name, status')
    .eq('access_token', token)
    .maybeSingle();
  if (!order || order.status !== 'paid') {
    return res.status(403).json({ error: 'Link tidak valid atau pembayaran belum diverifikasi.' });
  }

  // Keep the best score per quiz: only overwrite if this attempt is higher.
  const { data: existing } = await supabase
    .from('quiz_results')
    .select('id, score')
    .eq('order_ref', order.order_ref)
    .eq('slug', slug)
    .eq('page_id', page)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from('quiz_results').insert({
      order_ref: order.order_ref,
      buyer_name: order.buyer_name,
      slug,
      page_id: page,
      score: sc,
      total: tot,
    });
    if (error) return res.status(500).json({ error: 'Gagal menyimpan skor.' });
  } else if (sc > (existing.score ?? 0)) {
    const { error } = await supabase
      .from('quiz_results')
      .update({ score: sc, total: tot, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) return res.status(500).json({ error: 'Gagal memperbarui skor.' });
  }

  return res.status(200).json({ ok: true });
});
