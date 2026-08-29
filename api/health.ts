import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const names = [
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'QRIS_STATIC_PAYLOAD',
    'ADMIN_EMAILS', 'PUBLIC_BASE_URL', 'CRON_SECRET',
  ];
  // HANYA melaporkan ada/tidak. JANGAN pernah mengembalikan nilainya.
  const env = Object.fromEntries(
    names.map((n) => [n, Boolean((process.env[n] || '').trim())])
  );
  return res.status(200).json({ ok: true, env });
}
