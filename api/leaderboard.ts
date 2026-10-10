import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, withJsonErrors } from './_lib/supabaseAdmin.js';

/**
 * Leaderboard: rank buyers by total quiz score. Aggregation is done in JS
 * (volume is small — one row per buyer per quiz); swap for a Postgres view if it
 * ever grows large. Returns masked buyer names so the board is public-safe.
 */
function maskName(name: string | null): string {
  const n = (name || 'Anonim').trim();
  if (n.length <= 2) return n[0] + '*';
  return n.slice(0, Math.ceil(n.length / 2)) + '*'.repeat(Math.min(3, n.length - Math.ceil(n.length / 2)));
}

export default withJsonErrors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const supabase = getSupabaseAdmin();
  let query = supabase.from('quiz_results').select('order_ref, buyer_name, score, total');
  if (slug) query = query.eq('slug', slug);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Gagal memuat leaderboard.' });

  const byBuyer = new Map<string, { buyerName: string | null; score: number; total: number; quizzes: number }>();
  for (const r of data || []) {
    const cur = byBuyer.get(r.order_ref) || { buyerName: r.buyer_name, score: 0, total: 0, quizzes: 0 };
    cur.score += r.score || 0;
    cur.total += r.total || 0;
    cur.quizzes += 1;
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
    }));

  return res.status(200).json({ leaderboard: ranking });
});
