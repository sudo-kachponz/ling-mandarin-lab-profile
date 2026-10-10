import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle, Mail, Clock } from 'lucide-react';
import { whatsappUrl } from '@/data/stats';
import SectionHeading from '@/components/SectionHeading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Bagaimana cara membeli e-book?',
    a: 'Buka halaman E-Book, pilih produk, lalu klik Beli. Isi data pembeli dan selesaikan pembayaran. Setelah pembayaran terkonfirmasi, akses e-book otomatis aktif di halaman Library menggunakan email Anda.',
  },
  {
    q: 'Metode pembayaran apa saja yang tersedia?',
    a: 'Ada dua jalur. (1) Bayar Online — QRIS, Virtual Account, dan e-Wallet, akses langsung terbuka setelah bayar. (2) Scan QRIS — scan kode QR memakai aplikasi bank atau e-wallet apa saja, bayar sesuai nominal yang tertera, lalu unggah bukti. Diverifikasi tim kami maksimal 1×24 jam.',
  },
  {
    q: 'Berapa lama akses saya aktif setelah membayar?',
    a: 'Akses bersifat permanen untuk akun email yang Anda gunakan saat membeli. Selama akun tersebut aktif, Anda bisa membuka e-book kapan saja di halaman Library.',
  },
  {
    q: 'Bagaimana kalau sudah transfer tapi akses belum terbuka?',
    a: 'Untuk transfer manual, verifikasi dilakukan maksimal 1×24 jam. Jika lewat dari itu, hubungi kami via WhatsApp dengan menyertakan kode pesanan (diawali LCL-) dan bukti transfer, dan kami akan segera memeriksanya.',
  },
  {
    q: 'Apakah e-book bisa diunduh atau dicetak?',
    a: 'Tidak. E-book hanya bisa dibaca di dalam website dan diberi watermark sesuai akun Anda. Ini untuk melindungi karya penulis dari penyebaran ulang.',
  },
  {
    q: 'Bagaimana kebijakan pengembalian dana?',
    a: (
      <>
        Karena produk bersifat digital dan akses langsung diberikan, pembelian pada dasarnya tidak dapat direfund. Rincian
        selengkapnya ada di{' '}
        <Link to="/refund-policy" className="text-maroon underline underline-offset-2">
          Kebijakan Pengembalian Dana
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Saya tidak menerima kode OTP, apa yang harus dilakukan?',
    a: 'Periksa folder Spam/Promosi di email Anda, dan pastikan email yang dimasukkan sama persis dengan email saat membeli. Tunggu 1–2 menit lalu coba kirim ulang. Jika tetap tidak masuk, hubungi kami via WhatsApp.',
  },
  {
    q: 'Bisakah akun saya dipakai di beberapa perangkat?',
    a: 'Bisa, selama Anda masuk dengan email yang sama. Namun akun bersifat pribadi — membagikan akses ke orang lain melanggar ketentuan dan dapat menyebabkan akun ditutup.',
  },
  {
    q: 'Apakah ada versi cetak?',
    a: 'Saat ini kami hanya menyediakan versi digital (e-book) yang dibaca di dalam website. Belum ada versi cetak.',
  },
  {
    q: 'Bagaimana cara menghubungi customer service?',
    a: 'Hubungi kami melalui WhatsApp atau email yang tercantum di bagian bawah halaman ini pada jam operasional. Kami akan membalas secepatnya.',
  },
];

const Faq = () => {
  return (
    <div className="min-h-screen bg-background w-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 pb-6 pt-8 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-maroon">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">FAQ</span>
          </nav>

          <SectionHeading as="h1" align="left" char="问" title="Pertanyaan yang Sering Diajukan" className="mb-8" />

          <Accordion type="single" collapsible className="panel w-full divide-y divide-border overflow-hidden px-2 sm:px-4">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b-0 px-3">
                <AccordionTrigger className="py-5 text-left font-display text-[1.02rem] font-bold text-ink hover:no-underline [&[data-state=open]]:text-maroon [&>svg]:text-maroon">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mizige-dashed mt-10 rounded-[1.75rem] border border-hsk/20 bg-paper p-6 md:p-8">
            <h2 className="mb-5 text-xl font-bold">Masih butuh bantuan?</h2>
            <ul className="space-y-3.5 text-sm text-foreground">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card"><MessageCircle className="h-4 w-4 text-maroon" /></span>
                <span>
                  WhatsApp:{' '}
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-maroon underline underline-offset-2">
                    +62 851-0019-5519
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card"><Mail className="h-4 w-4 text-maroon" /></span>
                <span>Email: <strong className="text-ink">lingchineselab@gmail.com</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card"><Clock className="h-4 w-4 text-maroon" /></span>
                <span>Jam operasional: Senin–Jumat, 09.00–17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
