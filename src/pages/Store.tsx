import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import PhoneField from '@/components/PhoneField';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Lock, ChevronLeft, ChevronRight, Copy, Upload, AlertTriangle, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { pdfjs, Document, Page } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import radikalVideo1 from '@/assets/Phone/radikal-1.mp4';
import radikalVideo2 from '@/assets/Phone/radikal-2.mp4';
import chinaFlag from '@/assets/Flag/china.svg';
import taiwanFlag from '@/assets/Flag/taiwan.svg';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// The store sells the SAME book in two character sets. Each variant maps to a
// product row by slug; compare-at + preview PDF live here (not in the DB) since
// they're just marketing copy. Sale price always comes from the DB (product.price).
type VersionKey = 'simplified' | 'traditional';
const VARIANTS: Record<VersionKey, {
  slug: string; label: string; sub: string; flag: string; accent: string;
  compareAt: number; preview: string; note: string;
}> = {
  simplified: {
    slug: 'test-ebook-qris',
    label: 'Simplified',
    sub: '简体字 · China',
    flag: chinaFlag,
    accent: 'hsl(var(--hsk))',
    compareAt: 75000,
    preview: '/Lingchinenese.pdf',
    note: 'Hanzi lebih sederhana (bentuk disederhanakan), dipakai di China, Singapura, Malaysia. Cocok untuk pemula, ujian HSK, dan bisnis.',
  },
  traditional: {
    slug: 'rahasia-huruf-mandarin-tw',
    label: 'Traditional',
    sub: '繁體字 · Taiwan',
    flag: taiwanFlag,
    accent: 'hsl(var(--tocfl))',
    compareAt: 85000,
    preview: '/Lingchinenese-tw-preview.pdf',
    note: 'Hanzi lebih rumit (goresan lebih banyak, bentuk asli), dipakai di Taiwan, Hong Kong, Makau. Cocok untuk ujian TOCFL dan budaya/literatur klasik.',
  },
};
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const ACCEPTED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};
// Fallback when the phone/file-manager reports an empty or generic MIME type —
// otherwise real photos got silently rejected and the submit button stayed
// stuck disabled (the "tombol gabisa diklik" bug).
const ACCEPTED_EXT = /\.(jpe?g|png|webp|heic|heif|gif|pdf)$/i;
const MAX_BYTES = 25 * 1024 * 1024; // phone photos & multi-page PDF scans
const COMPRESS_OVER = 2 * 1024 * 1024; // downscale images above this so upload stays fast
const MAX_DIMENSION = 1920;

// Downscale + re-encode large images so a 12 MP phone photo uploads in seconds,
// not a minute. Returns the original untouched if it can't be decoded (e.g. HEIC
// on a browser without a decoder) or isn't a raster image we want to re-encode.
async function maybeCompressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size <= COMPRESS_OVER) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
    return blob && blob.size < file.size ? blob : file; // keep original if bigger
  } catch {
    return file; // undecodable (HEIC etc.) — upload original as-is
  }
}

type QrisOrder = {
  orderRef: string;
  uploadUrl: string;
  baseAmount: number;
  serviceFee: number;
  uniqueCode: number;
  finalAmount: number;
  expiresAt: string;
  method: 'qris' | 'transfer';
};

// Tipe untuk data produk dari tabel public.products
type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  cover_url: string;
};

// Mock data untuk fallback jika tabel products kosong
const mockProduct: Product = {
  id: "mock-123",
  slug: "test-katalog",
  title: "E-Book: Rahasia Huruf Mandarin (Vol. 1)",
  description: "Buku panduan komprehensif menguasai dasar-dasar huruf Mandarin (Hanzi). Cocok pemula–menengah, 10 unsur radikal, Step menulis, Latihan soal + kunci.",
  price: 60000,
  cover_url: "/coverling.png"
};

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPage, setPreviewPage] = useState(1); // 1, 2, 3 = preview pages, 4 = locked purchase page
  const [videoIdx, setVideoIdx] = useState(0); // 0/1 = slideable radikal explainer videos in top phone
  const [version, setVersion] = useState<VersionKey>('simplified'); // Simplified (China) ↔ Traditional (Taiwan)

  // Checkout form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer'>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Explainer video: autoplay muted (no black screen), user unmutes via controls.
  // Only the active video plays; the other is paused so bandwidth stays lean.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === videoIdx) {
        v.muted = true;
        v.play().catch(() => {}); // autoplay may be blocked until interaction — safe to ignore
      } else {
        v.pause();
      }
    });
  }, [videoIdx]);

  // Inline QRIS payment popup (no page navigation, no re-entering data).
  const [qrisOrder, setQrisOrder] = useState<QrisOrder | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrisDynamic, setQrisDynamic] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [paidDone, setPaidDone] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, slug, title, description, price, cover_url')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Jika kosong, pakai mock untuk testing UI
          setProducts([mockProduct]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([mockProduct]); // Fallback ke mock
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Which product the toggle currently points at (fall back to first/mock if the
  // matching slug isn't in the DB yet, so the page never breaks).
  const variant = VARIANTS[version];
  const selected = products.find((p) => p.slug === variant.slug) || products[0] || mockProduct;
  const salePrice = selected.price;
  const compareAt = variant.compareAt;
  const discountPct = Math.round((1 - salePrice / compareAt) * 100);
  const previewFile = variant.preview;

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
    return formatted.replace(/^Rp\s?/, 'IDR ');
  };

  const handlePurchaseFromPreview = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('buyer-name');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 500);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      toast.error("Nama Lengkap wajib diisi");
      return;
    }
    if (!buyerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      toast.error("Email tidak valid");
      return;
    }
    const intlWhatsapp = (buyerWhatsapp || '').replace(/\D/g, '');
    if (intlWhatsapp.length < 9) {
      toast.error("Nomor WhatsApp tidak valid — pilih negara & isi nomor lengkap");
      return;
    }

    const targetProduct = selected;

    // Both methods create an awaiting_verification order and open the same popup
    // (exact nominal + unique code + upload proof) — no page hops, no WhatsApp
    // chat. QRIS additionally renders a QR; transfer shows the BCA account.
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/manual/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: targetProduct.id,
          buyerName,
          buyerEmail,
          buyerWhatsapp: intlWhatsapp,
          method: paymentMethod === 'qris' ? 'qris' : 'bca',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pesanan');

      if (paymentMethod === 'qris') {
        // Prefer the payload create() already returned (one round-trip). Fall
        // back to the standalone endpoint if it wasn't included.
        let payload: string | undefined = data.qrisPayload;
        let isDynamic = !!data.qrisIsDynamic;
        if (!payload) {
          const qres = await fetch(`/api/manual/qris?orderRef=${encodeURIComponent(data.orderRef)}`);
          const qdata = await qres.json();
          if (!qres.ok) throw new Error(qdata.error || 'Gagal memuat QRIS');
          payload = qdata.payload;
          isDynamic = !!qdata.isDynamic;
        }
        setQrDataUrl(await QRCode.toDataURL(payload, { width: 320, margin: 1 }));
        setQrisDynamic(isDynamic);
      } else {
        setQrDataUrl(null);
        setQrisDynamic(false);
      }

      setPaidDone(false);
      setProofFile(null);
      setProofPreview(null);
      setQrisOrder({
        orderRef: data.orderRef,
        uploadUrl: data.uploadUrl,
        baseAmount: data.baseAmount,
        serviceFee: data.serviceFee,
        uniqueCode: data.uniqueCode,
        finalAmount: data.finalAmount,
        expiresAt: data.expiresAt,
        method: paymentMethod === 'qris' ? 'qris' : 'transfer',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memproses pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyText = (text: string, label: string) =>
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} disalin`))
      .catch(() => toast.error('Gagal menyalin'));

  const onPickProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!(f.type in ACCEPTED) && !ACCEPTED_EXT.test(f.name)) {
      return toast.error('Format harus JPG, PNG, WEBP, HEIC, GIF, atau PDF.');
    }
    if (f.size > MAX_BYTES) return toast.error('Ukuran file maksimal 25 MB.');
    setProofFile(f);
    setProofPreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  };

  const uploadProof = async () => {
    if (!qrisOrder || !proofFile) return toast.error('Pilih file bukti pembayaran dulu.');
    try {
      setUploading(true);
      setUploadProgress(5);
      const body = await maybeCompressImage(proofFile);
      const contentType = body.type || proofFile.type || 'application/octet-stream';
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', qrisOrder.uploadUrl);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload gagal (${xhr.status})`)));
        xhr.onerror = () => reject(new Error('Upload gagal. Cek koneksi Anda.'));
        xhr.send(body);
      });
      setPaidDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah bukti');
    } finally {
      setUploading(false);
    }
  };

  const methodCard = (key: 'qris' | 'transfer', title: string) => {
    const active = paymentMethod === key;
    return (
      <button
        type="button"
        onClick={() => setPaymentMethod(key)}
        aria-pressed={active}
        className={`relative flex flex-col rounded-2xl border-2 p-4 text-left transition-colors sm:p-5 ${
          active ? 'border-maroon bg-maroon/[0.04]' : 'border-border bg-card hover:border-maroon/30'
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="font-bold text-ink">{title}</span>
          <span
            aria-hidden
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-maroon' : 'border-border'}`}
          >
            {active && <span className="h-2.5 w-2.5 rounded-full bg-maroon" />}
          </span>
        </span>
        <span className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-xs font-semibold text-muted-foreground line-through">{rp(compareAt)}</span>
          <span className="text-lg font-extrabold text-maroon">{rp(salePrice)}</span>
          <span className="text-[11px] text-muted-foreground">(+ kode unik 3 digit)</span>
        </span>
      </button>
    );
  };

  const phoneFrame =
    'relative flex h-[580px] w-[280px] select-none flex-col justify-between overflow-hidden rounded-[2.5rem] border-[8px] border-ink bg-ink shadow-lift';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header store */}
      <header className="relative overflow-hidden border-b border-border/70">
        <div aria-hidden className="paper-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-4 py-10 md:px-8 md:py-12">
          <div>
            <h1 className="font-display text-3xl font-bold text-maroon md:text-[2.75rem]">Official Store</h1>
            <p className="mt-1.5 text-base font-semibold text-muted-foreground md:text-lg">Ling Chinese Lab</p>
          </div>
          <span aria-hidden className="mizige hidden h-16 w-16 items-center justify-center rounded-xl border border-hsk/30 sm:flex">
            <span className="font-hanzi relative text-3xl font-semibold text-maroon">书</span>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        {/* Produk */}
        <section className="panel mb-12 grid items-center gap-10 p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Video penjelasan */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className={phoneFrame}>
              <div className="absolute inset-x-0 top-0 z-30 mx-auto h-6 w-32 rounded-b-xl bg-ink" />
              <div className="pointer-events-none absolute inset-x-0 top-8 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent px-5 py-2">
                <span className="text-[11px] font-semibold text-white/85">Video Penjelasan</span>
                <span className="text-[11px] font-semibold text-white/60">{videoIdx + 1} / 2</span>
              </div>

              {/* Video aktif autoplay (muted); yang non-aktif preload="none" biar hemat bandwidth */}
              <div className="h-full w-full bg-black">
                {[radikalVideo1, radikalVideo2].map((src, i) => (
                  <video
                    key={i}
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={src}
                    controls
                    playsInline
                    autoPlay={i === videoIdx}
                    muted
                    loop
                    preload={i === videoIdx ? 'auto' : 'none'}
                    className={`h-full w-full object-cover ${videoIdx === i ? 'block' : 'hidden'}`}
                  />
                ))}
              </div>

              {videoIdx > 0 && (
                <button
                  onClick={() => setVideoIdx((v) => v - 1)}
                  className="absolute left-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md hover:bg-black/65"
                  aria-label="Video sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {videoIdx < 1 && (
                <button
                  onClick={() => setVideoIdx((v) => v + 1)}
                  className="absolute right-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md hover:bg-black/65"
                  aria-label="Video berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}

              <div className="absolute inset-x-0 bottom-16 z-20 flex justify-center">
                <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-3 py-1 backdrop-blur-md">
                  {[0, 1].map((i) => (
                    <button key={i} onClick={() => setVideoIdx(i)} className="p-0.5" aria-label={`Video ${i + 1}`}>
                      <span className={`block h-1.5 rounded-full transition-all ${videoIdx === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info produk */}
          <div className="order-1 space-y-6 lg:order-2">
            {/* Pilih versi */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-muted-foreground">Pilih Versi E-Book</h3>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih Versi E-Book">
                {(['simplified', 'traditional'] as VersionKey[]).map((key) => {
                  const v = VARIANTS[key];
                  const active = version === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => { setVersion(key); setPreviewPage(1); }}
                      className={`flex min-w-0 items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-colors sm:gap-3 md:p-3.5 ${
                        active ? 'bg-paper' : 'border-border bg-card hover:border-maroon/25'
                      }`}
                      style={active ? { borderColor: v.accent } : undefined}
                    >
                      <img src={v.flag} alt={v.label} className="h-9 w-9 shrink-0 rounded-full md:h-10 md:w-10" />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-bold leading-tight text-ink">{v.label}</span>
                        <span className="font-hanzi truncate text-xs text-muted-foreground">{v.sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="seal">E-Book Terbaru</span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: variant.accent }}
                >
                  <img src={variant.flag} alt="" className="h-3.5 w-3.5 rounded-full" /> {variant.label}
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-[2.6rem]">
                Rahasia Huruf Mandarin <span className="text-maroon">(Vol. 1)</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold text-muted-foreground line-through">{rp(compareAt)}</span>
                <span className="text-3xl font-extrabold text-maroon">{rp(salePrice)}</span>
                <span className="rounded-md bg-gold px-2 py-1 text-xs font-extrabold text-maroon-deep">DISCOUNT {discountPct}%</span>
              </div>
            </div>

            <p className="leading-relaxed text-muted-foreground md:text-[1.05rem]">
              Buku panduan komprehensif menguasai dasar-dasar huruf Mandarin (Hanzi). Dirancang khusus dengan metode yang terstruktur agar proses belajar menjadi lebih mudah, cepat, dan menyenangkan.
            </p>

            <div className="flex items-start gap-3 rounded-2xl border-l-4 bg-paper p-4" style={{ borderColor: variant.accent }}>
              <img src={variant.flag} alt={variant.label} className="mt-0.5 h-7 w-7 shrink-0 rounded-full" />
              <p className="text-sm leading-relaxed text-foreground/85 md:text-[15px]">
                <strong style={{ color: variant.accent }}>{variant.label} ({variant.sub}):</strong> {variant.note}
              </p>
            </div>

            <ul className="divide-y divide-border rounded-2xl border border-border">
              {[
                '10 Unsur Radikal & Step Menulis (Guratan)',
                'Cocok untuk Pemula hingga Menengah',
                'Dilengkapi Latihan Soal + Kunci Jawaban Lengkap',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-maroon" />
                  <span className="font-semibold text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              onClick={handlePurchaseFromPreview}
              className="h-14 w-full rounded-full bg-maroon text-base font-extrabold text-white shadow-soft hover:bg-maroon-deep sm:w-auto sm:px-10"
            >
              Beli E-Book Sekarang
            </Button>
          </div>
        </section>

        {/* Checkout */}
        <section ref={checkoutRef} className="panel scroll-mt-24 p-6 md:p-10" aria-labelledby="checkout-title">
          <div className="mb-8 border-b border-border pb-6">
            <h3 id="checkout-title" className="font-display text-2xl font-bold md:text-3xl">Pembelian E-Book</h3>
            <p className="mt-2 text-muted-foreground">Isi detail Anda di bawah ini untuk mendapatkan akses e-book</p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={handleCheckout} className="space-y-7">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="buyer-name" className="text-sm font-semibold text-ink">
                    Nama Lengkap <span className="text-hsk">*</span>
                  </label>
                  <input
                    id="buyer-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="buyer-whatsapp" className="text-sm font-semibold text-ink">
                    Nomor WhatsApp <span className="text-hsk">*</span>
                  </label>
                  <PhoneField
                    id="buyer-whatsapp"
                    placeholder="Contoh: 0812 3456 789"
                    value={buyerWhatsapp}
                    onChange={setBuyerWhatsapp}
                    className="wa-phone-input w-full rounded-xl border border-input bg-paper px-4 py-3 text-foreground transition-colors focus-within:border-maroon focus-within:ring-2 focus-within:ring-maroon/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="buyer-email" className="text-sm font-semibold text-ink">
                  Alamat Email <span className="text-hsk">*</span>
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@contoh.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="field"
                  required
                />
                <p className="text-xs text-muted-foreground">E-book akan dikaitkan dengan email ini untuk akses membaca.</p>
              </div>

              <fieldset className="space-y-3">
                <legend className="mb-3 text-sm font-semibold text-ink">Pilih Metode Pembayaran</legend>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {methodCard('qris', 'Scan QRIS')}
                  {methodCard('transfer', 'Transfer Bank (Manual)')}
                </div>
                {paymentMethod === 'qris' && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Bayar via QRIS lalu unggah bukti. Link akses e-book dikirim ke WhatsApp Anda setelah diverifikasi (maks 1×24 jam).
                  </p>
                )}
                {paymentMethod === 'transfer' && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Transfer ke rekening BCA kami lalu unggah bukti. Nomor rekening &amp; nominal pas (termasuk kode unik) muncul di langkah berikutnya. Link akses e-book dikirim ke WhatsApp Anda setelah diverifikasi (maks 1×24 jam).
                  </p>
                )}
              </fieldset>

              <div className="space-y-2 rounded-2xl bg-paper p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Harga E-Book</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground line-through">{rp(compareAt)}</span>
                    <span className="font-semibold text-ink">{rp(salePrice)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-border pt-2.5 text-base font-bold text-maroon">
                  <span>Total Bayar</span>
                  <span>{rp(salePrice)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-maroon text-base font-extrabold text-white shadow-soft transition-colors hover:bg-maroon-deep"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </span>
                ) : paymentMethod === 'qris' ? (
                  'Lanjut ke Pembayaran QRIS'
                ) : (
                  'Lanjut ke Pembayaran Transfer'
                )}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-maroon" />
                <a href="/#terms-and-policies" className="underline-offset-2 hover:text-maroon hover:underline">Keamanan Pembayaran & Privasi</a>
              </p>
            </form>

            {/* Pratinjau e-book */}
            <div className="flex justify-center lg:sticky lg:top-28">
              <div className={phoneFrame}>
                <div className="absolute inset-x-0 top-0 z-30 mx-auto h-6 w-32 rounded-b-xl bg-ink" />
                <div className="absolute inset-x-0 top-8 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent px-5 py-2">
                  <span className="text-[11px] font-semibold text-white/85">Pratinjau E-Book</span>
                  <span className="text-[11px] font-semibold text-white/60">
                    {previewPage <= 3 ? `Hal ${previewPage} dari 3` : 'Selesai'}
                  </span>
                </div>

                <div className="relative flex h-full w-full flex-col justify-between pb-20 pt-14">
                  {previewPage <= 3 ? (
                    <div className="flex w-full flex-1 items-center justify-center overflow-hidden bg-white p-1">
                      <Document
                        file={previewFile}
                        loading={
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-maroon border-t-transparent" />
                            <p className="text-[11px] font-medium text-maroon/75">Memuat halaman...</p>
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center p-4 text-center text-hsk">
                            <p className="text-xs font-semibold">Gagal memuat pratinjau</p>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={previewPage}
                          width={250}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pointer-events-none shadow-sm"
                        />
                      </Document>
                    </div>
                  ) : (
                    <div className="mizige-dashed relative flex h-full w-full flex-col items-center justify-center bg-maroon-deep px-5 text-center text-white">
                      <div className="z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/15">
                        <Lock className="h-6 w-6 text-gold" />
                      </div>
                      <h4 className="z-10 mb-2 font-display text-lg font-bold text-gold">Ingin Lanjut Membaca?</h4>
                      <p className="z-10 mb-6 text-[11px] leading-relaxed text-white/75">
                        Miliki versi lengkap e-book <strong className="text-white">Rahasia Huruf Mandarin (Vol. 1)</strong> untuk membuka 10 radikal utama, langkah penulisan guratan, serta kuis latihan lengkap.
                      </p>
                      <Button
                        onClick={handlePurchaseFromPreview}
                        className="z-10 w-full rounded-full bg-gold py-5 text-xs font-extrabold text-maroon-deep hover:bg-[#D4A758]"
                      >
                        Beli E-Book Sekarang
                      </Button>
                    </div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-2 px-4">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-3 py-1 backdrop-blur-md">
                    {[1, 2, 3, 4].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPreviewPage(p)}
                        className="p-0.5"
                        aria-label={p === 4 ? 'Halaman terkunci' : `Halaman ${p}`}
                      >
                        {p === 4 ? (
                          <Lock className={`h-2.5 w-2.5 ${previewPage === 4 ? 'text-gold' : 'text-zinc-400 hover:text-zinc-300'}`} />
                        ) : (
                          <span className={`block h-1.5 rounded-full transition-all ${previewPage === p ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex w-full items-center justify-between px-2">
                    {previewPage > 1 ? (
                      <button
                        onClick={() => setPreviewPage((prev) => prev - 1)}
                        className="flex items-center gap-1 py-1 text-[11px] font-semibold text-white/80 hover:text-white"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Kembali
                      </button>
                    ) : (
                      <div />
                    )}
                    {previewPage < 4 ? (
                      <button
                        onClick={() => setPreviewPage((prev) => prev + 1)}
                        className="ml-auto flex items-center gap-1 py-1 text-[11px] font-semibold text-white/80 hover:text-white"
                      >
                        Lanjut <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Popup pembayaran — data sudah terisi, tanpa pindah halaman */}
      <Dialog open={!!qrisOrder} onOpenChange={(o) => { if (!o) { setQrisOrder(null); setPaidDone(false); } }}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-[1.5rem] border-border bg-card">
          {paidDone ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-maroon/[0.07]">
                <CheckCircle2 className="h-9 w-9 text-maroon" />
              </div>
              <DialogHeader><DialogTitle className="text-center font-display text-xl">Bukti Terkirim!</DialogTitle></DialogHeader>
              <p className="mt-3 text-sm text-muted-foreground">
                Kode pesanan: <span className="font-mono font-bold text-ink">{qrisOrder?.orderRef}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Kami verifikasi maks. 1×24 jam. <strong className="text-ink">Link akses e-book dikirim ke WhatsApp Anda</strong> setelah pembayaran diverifikasi.
              </p>
              <Button className="mt-6 h-12 w-full rounded-full bg-maroon font-bold text-white hover:bg-maroon-deep" onClick={() => setQrisOrder(null)}>Tutup</Button>
            </div>
          ) : qrisOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{qrisOrder.method === 'qris' ? 'Scan & Bayar QRIS' : 'Transfer Bank BCA'}</DialogTitle>
              </DialogHeader>
              <div className="text-center">
                {qrisOrder.method === 'qris' ? (
                  <>
                    {qrDataUrl && (
                      <div className="mx-auto w-fit rounded-2xl border border-border bg-white p-3">
                        <img src={qrDataUrl} alt="QRIS Ling Chinese Lab" className="mx-auto h-56 w-56" />
                      </div>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">QRIS · Ling Chinese Lab</p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-border bg-paper p-4 text-left">
                    <p className="text-xs font-semibold text-muted-foreground">BANK BCA</p>
                    <p className="mt-0.5 text-xl font-extrabold tracking-wide text-maroon">2160835373</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">a.n. Celine</p>
                    <Button variant="outline" size="sm" className="mt-3 rounded-full border-maroon/30 text-maroon hover:bg-maroon/5 hover:text-maroon" onClick={() => copyText('2160835373', 'Nomor rekening')}>
                      <Copy className="mr-1 h-4 w-4" /> Salin rekening
                    </Button>
                  </div>
                )}
                <div className="mt-3 rounded-2xl bg-paper p-4">
                  <p className="text-xs text-muted-foreground">Nominal</p>
                  <p className="text-2xl font-extrabold text-maroon">{formatPrice(qrisOrder.finalAmount)}</p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-full border-maroon/30 text-maroon hover:bg-maroon/5 hover:text-maroon" onClick={() => copyText(String(qrisOrder.finalAmount), 'Nominal')}>
                    <Copy className="mr-1 h-4 w-4" /> Salin nominal
                  </Button>
                </div>
                {qrisOrder.method === 'qris' && qrisDynamic ? (
                  <p className="mt-2 text-xs text-muted-foreground">Nominal terisi otomatis saat Anda scan.</p>
                ) : (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-hsk/30 bg-hsk-soft p-2.5 text-left text-xs text-hsk">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{qrisOrder.method === 'qris' ? 'Masukkan' : 'Transfer'} nominal <strong>persis sampai 3 angka terakhir</strong> — itu kode pesanan Anda.</span>
                  </div>
                )}
                <div className="mt-3 space-y-1 rounded-xl border border-border p-3 text-left text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Harga e-book</span><span>{formatPrice(qrisOrder.baseAmount - qrisOrder.serviceFee)}</span></div>
                  {qrisOrder.serviceFee > 0 && (
                    <div className="flex justify-between"><span>Biaya layanan</span><span>{formatPrice(qrisOrder.serviceFee)}</span></div>
                  )}
                  <div className="flex justify-between"><span>Kode unik</span><span>{formatPrice(qrisOrder.uniqueCode)}</span></div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold text-maroon"><span>Total</span><span>{formatPrice(qrisOrder.finalAmount)}</span></div>
                </div>
              </div>

              <div className="mt-1 border-t border-border pt-4">
                <p className="mb-2 text-sm font-semibold text-ink">Sudah bayar? Unggah bukti <span className="text-hsk">*</span></p>
                {/* Explicit ref.click() instead of a <label> wrapping the input:
                    inside a Radix Dialog the label click gets swallowed by the
                    focus-scope/scroll-lock on desktop, so no file was picked and
                    the send button stayed disabled ("gabisa diklik di tab"). */}
                <button
                  type="button"
                  onClick={() => proofInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-maroon/25 bg-paper p-4 transition-colors hover:border-maroon/45 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {proofPreview ? (
                    <img src={proofPreview} className="max-h-32 rounded" alt="Preview bukti" />
                  ) : proofFile ? (
                    <span className="text-sm font-medium text-ink">{proofFile.name}</span>
                  ) : (
                    <>
                      <Upload className="mb-1 h-6 w-6 text-maroon/50" />
                      <span className="text-center text-xs text-muted-foreground">Klik untuk unggah (JPG/PNG/WEBP/PDF · maks 25 MB)</span>
                    </>
                  )}
                </button>
                <input ref={proofInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onPickProof} disabled={uploading} />
                {uploading && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2 bg-secondary [&>div]:bg-maroon" />
                    <p className="mt-1 text-center text-xs text-muted-foreground">Mengunggah… {uploadProgress}%</p>
                  </div>
                )}
                <Button onClick={uploadProof} disabled={uploading || !proofFile} className="mt-3 h-12 w-full rounded-full bg-maroon font-bold text-white hover:bg-maroon-deep">
                  {uploading ? 'Mengunggah…' : 'Kirim Bukti Pembayaran'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
