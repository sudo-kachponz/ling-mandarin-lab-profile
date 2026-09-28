import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Klien Supabase yang dibuat MALAS (lazy), bukan di module scope.
 *
 * createClient() melempar error kalau url atau key kosong. Kalau dipanggil di
 * module scope, error itu terjadi sebelum handler jalan, sehingga function mati
 * tanpa bisa mengembalikan JSON dan Vercel membalas teks mentah
 * "A server error has occurred" (FUNCTION_INVOCATION_FAILED).
 *
 * Dengan lazy init, env yang hilang menghasilkan pesan JSON yang terbaca.
 */

let cached: SupabaseClient | null = null;

export class MissingEnvError extends Error {
  constructor(public readonly names: string[]) {
    super(`Missing env: ${names.join(', ')}`);
    this.name = 'MissingEnvError';
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  const missing: string[] = [];
  if (!url) missing.push('SUPABASE_URL');
  if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (missing.length) throw new MissingEnvError(missing);

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

/**
 * Bungkus handler supaya error apa pun tetap keluar sebagai JSON.
 * Tanpa ini, exception yang tidak tertangkap menghasilkan teks mentah lagi.
 */
export function withJsonErrors(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<unknown>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      return await handler(req, res);
    } catch (err) {
      if (err instanceof MissingEnvError) {
        console.error('[config]', err.message);
        return res.status(500).json({
          error: 'Konfigurasi server belum lengkap.',
          missing: err.names, // aman: nama variabel saja, bukan nilainya
        });
      }
      console.error('[unhandled]', err);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  };
}
