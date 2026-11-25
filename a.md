Bangun POC web demo untuk e-book pelafalan Mandarin "Ling Chinese Lab" (Vol 2).
Dua fitur: (1) tombol TTS "Dengar AI" untuk bagian penjelasan, (2) loop latihan
pelafalan di mana user mengucapkan satu suku kata lalu dapat ✅/❎ dan bisa
memutar ulang suara AI untuk menirukan sampai benar.

=== BATASAN KERAS (tidak boleh dilanggar) ===
- 100% GRATIS. Tanpa API berbayar (TIDAK pakai Azure). Core demo harus jalan
  TANPA API key sama sekali.
- Harus deploy di VERCEL, serverless-first. TIDAK boleh: model self-host, GPU,
  server always-on, atau VPS. Jadi TTS & STT wajib berbasis browser-native
  ATAU HTTP API gratis yang dipanggil dari Vercel serverless function.

=== STACK ===
Vite + React + TypeScript + Tailwind. Serverless function di /api (@vercel/node)
biar cocok sama repo yang sudah ada. Bungkus TTS & STT di balik interface kecil
(ttsProvider / sttProvider) supaya gampang di-swap nanti.

=== FITUR 1 — TTS "Dengar AI" ===
- Pakai Web Speech API SpeechSynthesis, lang "zh-CN", pilih voice zh, rate ~0.9.
- Bisa diputar ulang tanpa batas.
- Tombol play bergaya MEGAPHONE (ide tim desain): klik → suara keluar.
- Sisakan komentar cara swap ke mp3 pre-generated (Supabase signed URL) untuk
  produksi, tapi demo ini cukup pakai SpeechSynthesis.

=== FITUR 2 — Loop latihan (alur "che") ===
Tiap item: { hanzi, pinyin, initial, final, tone }.
Alur: tampilkan item → user klik "Rekam" → tangkap mic → kenali ucapan →
bandingkan dengan target → ✅ lolos / ❎ belum tepat. Saat ❎, user bisa klik
ulang suara AI untuk menirukan lalu coba lagi, berulang sampai ✅.

STT provider (gratis & serverless):
- UTAMA: Web Speech API browser (webkitSpeechRecognition), lang "zh-CN". Nol
  backend, nol key.
- CADANGAN (di balik env flag VITE_USE_GROQ + GROQ_API_KEY): /api/stt serverless
  function yang memanggil Groq Whisper gratis (whisper-large-v3) — murni fetch
  HTTP, pas untuk serverless. Hanya aktif kalau env di-set.

Logika pencocokan (PENTING, tangani jujur):
- Ubah teks hasil kenalan → pinyin pakai library `pinyin-pro`.
- Suku kata TUNGGAL tidak reliable di ASR (sering "dikoreksi" otomatis). Jadi
  cocokkan secara LONGGAR: bandingkan initial+final dulu (abaikan nada) untuk ✅;
  nada jadi cek sekunder/opsional. Sediakan parameter strictness yang bisa diatur.
- Kalau hasil kosong / confidence rendah / tidak terdeteksi → tampilkan
  "nggak kedengaran, coba lagi", JANGAN kasih ✅/❎ palsu.

=== NADA (opsional, nilai plus) ===
Deteksi pitch F0 di browser (autocorrelation) untuk mengklasifikasi Nada 1–4
pada item yang fokus nada. Nol backend.

=== DATA ===
Item dalam array TS/JSON. Isi awal: contoh "che" (ce/che/chi), 妈/麻/马/骂
(ma1–4), dan 你好. Gampang ditambah.

=== UI ===
Semua teks bahasa Indonesia. Kartu suku kata, tombol megaphone, Rekam/Stop,
verdikt ✅/❎, tombol coba-lagi & putar-ulang. Tailwind bersih, MOBILE-FIRST
(pembeli buka di HP).

=== NON-GOAL ===
Tanpa Azure. Tanpa model self-host (FunASR/sherpa/Whisper lokal). Tanpa VPS.
Tanpa database/auth (ini POC).

=== KRITERIA LOLOS ===
- `npm run dev` jalan lokal; deploy ke Vercel TANPA env var apa pun (pakai
  provider browser).
- "Dengar AI" memutar suara zh-CN dan bisa diulang.
- Latihan: ucap benar → ✅; jelas salah → ❎ + bisa coba lagi & putar ulang;
  tidak jelas → "coba lagi".
- Tidak ada layanan berbayar yang dipanggil.

=== DELIVERABLE ===
Struktur file, komponen React, interface provider, function /api/stt Groq
(opsional, di balik flag), dan README berisi langkah deploy + catatan swap ke mp3.  ini btw di taruh di route yang /admin yaaa
