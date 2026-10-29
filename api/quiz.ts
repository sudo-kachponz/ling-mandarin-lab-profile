import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, withJsonErrors } from './_lib/supabaseAdmin.js';

/**
 * Quiz leaderboard — one function, two methods (Hobby plan caps functions at 12):
 *   POST → record a buyer's score for a quiz (identity from the order access_token)
 *   GET  → ranking of buyers by total score
 *
 * ponytail: POST score is client-reported, so a buyer could inflate their own
 * number. Fine for a friendly leaderboard; server-side grading is the upgrade
 * path if it ever needs to be tamper-proof.
 */

function maskName(name: string | null): string {
  const n = (name || 'Anonim').trim();
  if (n.length <= 2) return n[0] + '*';
  const keep = Math.ceil(n.length / 2);
  return n.slice(0, keep) + '*'.repeat(Math.min(3, n.length - keep));
}

async function submit(req: VercelRequest, res: VercelResponse) {
  const { token, slug, pageId, score, total, durationSeconds } = req.body || {};
  if (!token || !slug || pageId == null) {
    return res.status(400).json({ error: 'token, slug, dan pageId wajib diisi.' });
  }
  const page = Number(pageId);
  const sc = Math.max(0, Number(score) || 0);
  const tot = Math.max(0, Number(total) || 0);
  const dur = Math.max(0, Math.round(Number(durationSeconds) || 0));
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

  // Keep the best score per quiz: only overwrite when this attempt is higher.
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
      duration_seconds: dur || null,
    });
    if (error) return res.status(500).json({ error: 'Gagal menyimpan skor.' });
  } else if (sc > (existing.score ?? 0)) {
    const { error } = await supabase
      .from('quiz_results')
      .update({ score: sc, total: tot, duration_seconds: dur || null, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) return res.status(500).json({ error: 'Gagal memperbarui skor.' });
  }

  return res.status(200).json({ ok: true });
}

async function leaderboard(req: VercelRequest, res: VercelResponse) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const supabase = getSupabaseAdmin();
  let query = supabase.from('quiz_results').select('order_ref, buyer_name, score, total, duration_seconds');
  if (slug) query = query.eq('slug', slug);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Gagal memuat leaderboard.' });

  const byBuyer = new Map<string, { buyerName: string | null; score: number; total: number; quizzes: number; totalDuration: number; timedQuizzes: number }>();
  for (const r of data || []) {
    const cur = byBuyer.get(r.order_ref) || { buyerName: r.buyer_name, score: 0, total: 0, quizzes: 0, totalDuration: 0, timedQuizzes: 0 };
    cur.score += r.score || 0;
    cur.total += r.total || 0;
    cur.quizzes += 1;
    if (r.duration_seconds) { cur.totalDuration += r.duration_seconds; cur.timedQuizzes += 1; }
    byBuyer.set(r.order_ref, cur);
  }

  const ranking = [...byBuyer.values()]
    .sort((a, b) => b.score - a.score || b.quizzes - a.quizzes)
    .slice(0, limit)
    .map((e, i) => ({
      rank: i + 1,
      name: maskName(e.buyerName),
      score: e.score,
      total: e.total,
      quizzes: e.quizzes,
      avgSecondsPerQuestion: e.timedQuizzes > 0 ? Math.round(e.totalDuration / e.total) : null,
    }));

  return res.status(200).json({ leaderboard: ranking });
}

export default withJsonErrors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') return submit(req, res);
  if (req.method === 'GET') return leaderboard(req, res);
  return res.status(405).json({ error: 'Method Not Allowed' });
});
