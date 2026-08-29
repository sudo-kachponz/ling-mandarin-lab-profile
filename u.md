# Prompt Perbaikan — FUNCTION_INVOCATION_FAILED di semua endpoint

Gejala: `/api/manual/create` dan `/api/admin/*` membalas teks mentah
`A server error has occurred` alih-alih JSON, sehingga frontend melempar
`Unexpected token 'A', "A server e"... is not valid JSON`.

Penyebab: `createClient()` dipanggil di **module scope** — di luar handler, jalan
saat file di-load. Sudah diverifikasi terhadap `@supabase/supabase-js@2.111`:

```
createClient('', 'key')        -> THROW: supabaseUrl is required.
createClient('https://…', '')  -> THROW: supabaseKey is required.
```

Karena polanya `process.env.SUPABASE_URL || ''`, env yang tidak terbaca menjadi
string kosong dan `createClient` melempar error sebelum handler jalan. Function
mati tanpa sempat mengembalikan JSON, jadi Vercel membalas teks mentah.

Ini bukan masalah arsitektur serverless. Serverless di Vercel sudah tepat.

---

## TUGAS 1 — Helper terpusat

File baru: `api/_lib/supabaseAdmin.ts`

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
  handler: (req: any, res: any) => Promise<unknown>
) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (err) {
      if (err instanceof MissingEnvError) {
        console.error('[config]', err.message);
        return res.status(500).json({
          error: 'Konfigurasi server belum lengkap.',
          missing: err.names,   // aman: nama variabel saja, bukan nilainya
        });
      }
      console.error('[unhandled]', err);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  };
}
```

---

## TUGAS 2 — Ganti semua pemanggilan module-scope

Sembilan file ini punya `const supabase = createClient(...)` di module scope:

```
api/order-status.ts:4
api/admin/orders.ts:5
api/admin/verify.ts:8
api/get-reader-url.ts:5
api/cron/expire-orders.ts:4
api/checkout.ts:8
api/manual/create.ts:7
api/manual/qris.ts:5
api/ipaymu-notify.ts:7
```

Ditambah `api/_lib/guards.ts:11` — **jangan sampai terlewat**. File ini di-import
oleh banyak endpoint, jadi selama ia masih module-scope, memperbaiki yang lain
tidak menyelesaikan apa pun.

Di setiap file: hapus deklarasi module-scope, lalu panggil
`const supabase = getSupabaseAdmin();` sebagai baris pertama di dalam handler
(atau di dalam fungsi yang membutuhkannya, untuk `guards.ts`).

Bungkus juga setiap `export default` dengan `withJsonErrors(...)`:

```ts
export default withJsonErrors(async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  // …
});
```

`api/_lib/adminAuth.ts`, `approveOrder.ts`, dan `grantEntitlement.ts` sudah
membuat klien di dalam fungsi — cukup arahkan ke `getSupabaseAdmin()` supaya
seragam dan ikut terlindungi pengecekan env.

Setelah selesai:

```bash
grep -rn "^const supabase = createClient" api/   # harus nihil
```

---

## TUGAS 3 — Endpoint diagnostik

File baru: `api/health.ts`

```ts
export default async function handler(req: any, res: any) {
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
```

Buka `/api/health` setelah deploy. Kalau ada yang `false`, env itulah yang tidak
terbaca Vercel — tidak perlu menebak lagi.

---

## TUGAS 4 — Ganti password admin

`.env` sekarang berisi `ADMIN_PASSWORD=admin123`. Panel admin adalah tempat akses
e-book diberikan, dan pemberian akses tidak bisa ditarik kembali. `admin123` ada
di daftar password pertama yang dicoba bot mana pun.

Ganti dengan `openssl rand -base64 24`. Pastikan juga `/api/admin/*` punya
pembatasan percobaan login — tanpa itu, password apa pun bisa ditebak dengan
percobaan berulang tanpa hambatan.

---

## TUGAS 5 — `IPAYMU_IS_PRODUCTION` kembalikan ke false

`.env` sekarang `IPAYMU_IS_PRODUCTION=true`. Memang tidak berpengaruh selama
`IPAYMU_MODE=disabled`, tapi begitu mode diubah ke `live` untuk demo, kredensial
yang belum dipastikan sandbox atau produksi itu akan langsung dipakai ke
`my.ipaymu.com`. Set `false` sampai akun benar-benar disetujui.

---

## TUGAS 6 — Perhatikan batas jumlah function

Sekarang ada **11** serverless function. Batas paket Vercel Hobby adalah **12**.
`api/health.ts` menjadikannya 12 — tepat di batas. Menambah
`api/admin/reset-devices.ts` akan menembusnya dan **build gagal**.

Kalau perlu ruang, gabungkan endpoint admin di bawah satu file dengan parameter
`action` (`orders`, `verify`, `reset-devices`, `dashboard`).

---

## TUGAS 7 — Verifikasi

```bash
npx tsc --noEmit && npm test && npm run build
grep -rn "^const supabase = createClient" api/    # harus nihil
```

Setelah deploy:

1. `/api/health` → semua env `true`.
2. Coba bayar QRIS → JSON yang terbaca, bukan teks mentah.
3. Buka `/admin` → dashboard muncul.
4. Kalau masih gagal: `vercel logs <url> --since 30m` dan baca pesan aslinya.

Kalau `/api/health` menunjukkan env `false` padahal sudah di-set di Vercel:
periksa Settings → Environment Variables, pastikan tiap baris tercentang untuk
**Production** (sering hanya Preview yang aktif), dan tidak ada spasi ikut
ter-paste di nama variabelnya. Setelah mengubah env, wajib Redeploy.
