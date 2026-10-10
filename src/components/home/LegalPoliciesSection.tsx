import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, RefreshCw, FileText, Lock, HelpCircle } from "lucide-react";
import { whatsappUrl } from "@/data/stats";

const LegalPoliciesSection: React.FC = () => {
  return (
    <section id="terms-and-policies" className="section border-t border-border/70 bg-paper">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Section Header */}
        <div className="mb-10 space-y-4 text-center">
          <div className="seal">
            <ShieldCheck className="w-4 h-4" />
            <span>Syarat, Ketentuan & Kebijakan Transaksi</span>
          </div>
          <h2 className="section-title">
            Syarat Layanan & Kebijakan Pembelian E-Book
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Transparansi dan keamanan Anda adalah prioritas kami. Harap pelajari syarat penggunaan dan kebijakan pengembalian sebelum melakukan transaksi.
          </p>
        </div>

        {/* Policy Tabs */}
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="mb-6 grid h-auto w-full grid-cols-1 gap-1 rounded-2xl border border-border bg-card p-1.5 sm:grid-cols-3">
            <TabsTrigger
              value="terms"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors data-[state=active]:bg-maroon data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-gold sm:text-sm"
            >
              <FileText className="w-4 h-4 text-maroon" />
              <span>Syarat & Ketentuan</span>
            </TabsTrigger>
            <TabsTrigger
              value="refund"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors data-[state=active]:bg-maroon data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-gold sm:text-sm"
            >
              <RefreshCw className="w-4 h-4 text-maroon" />
              <span>Kebijakan Refund</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors data-[state=active]:bg-maroon data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-gold sm:text-sm"
            >
              <Lock className="w-4 h-4 text-maroon" />
              <span>Privasi & Keamanan</span>
            </TabsTrigger>
          </TabsList>

          {/* Terms & Conditions Content */}
          <TabsContent value="terms">
            <Card className="panel border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-maroon" />
                  Syarat & Ketentuan Layanan (Terms of Service)
                </CardTitle>
                <CardDescription>
                  Ketentuan lisensi penggunaan produk E-Book dan layanan platform Ling Chinese Lab.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">1. Lisensi Produk Digital</h4>
                  <p>
                    Setiap pembelian E-Book di Ling Chinese Lab memberikan hak akses lisensi pribadi, non-eksklusif, dan tidak dapat dipindahtangankan kepada pengguna terdaftar.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">2. Hak Cipta & Larangan Distribusi</h4>
                  <p>
                    Seluruh isi materi, desain, audio, dan modul E-Book terlindungi oleh hak cipta. Dilarang keras menggandakan, mendistribusikan ulang, menjual kembali, atau mempublikasikan materi tanpa izin tertulis dari Ling Chinese Lab.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">3. Pemrosesan Pembayaran</h4>
                  <p>
                    Pembayaran transaksi dilakukan melalui Payment Gateway terenkripsi resmi (QRIS, Transfer Bank/VA, E-Wallet, Kartu Kredit). Transaksi dinyatakan berhasil setelah dikonfirmasi oleh sistem Payment Gateway secara otomatis.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">4. Perubahan Materi & Akses</h4>
                  <p>
                    Ling Chinese Lab berhak melakukan pembaruan konten E-Book atau penyesuaian sistem pembaca E-Book untuk meningkatkan kualitas pembelajaran tanpa biaya tambahan bagi pengguna yang telah membeli.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refund Policy Content */}
          <TabsContent value="refund">
            <Card className="panel border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-foreground">
                  <RefreshCw className="w-5 h-5 text-maroon" />
                  Kebijakan Pengembalian Dana & Pembatalan (Refund Policy)
                </CardTitle>
                <CardDescription>
                  Kebijakan pengembalian dana untuk pembelian produk digital E-Book.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div className="rounded-xl border border-gold/50 bg-gold/15 p-3.5 text-xs font-medium text-ink">
                  <strong>Penting:</strong> Karena E-Book merupakan produk digital dengan akses langsung seketika (instant digital delivery), secara umum pembelian yang telah berhasil dikonfirmasi tidak dapat dibatalkan atau dikembalikan.
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">1. Syarat Kriteria Refund yang Diterima</h4>
                  <p>Pengembalian dana (refund) hanya dapat disetujui apabila memenuhi salah satu kondisi berikut:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Terjadi transaksi ganda (double charge) untuk nomor pesanan/produk yang sama akibat kendala sistem.</li>
                    <li>Sistem mengalami gangguan teknis permanen yang menyebabkan akses E-Book tidak dapat dibuka sama sekali dan tidak dapat diperbaiki oleh tim teknis kami dalam <strong>3 x 24 jam</strong> sejak pelaporan resmi.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">2. Kriteria yang Tidak Dapat Di-Refund</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Perubahan keputusan atau kesalahan pemilihan produk E-Book oleh pembeli setelah akses diberikan.</li>
                    <li>Kendala perangkat pribadi pembeli (misal: koneksi internet tidak stabil) yang tidak bersumber dari server kami.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">3. Prosedur & Jangka Waktu Pengajuan Refund</h4>
                  <p>
                    Pengajuan komplain dapat dilakukan maksimal <strong>7 hari</strong> setelah tanggal transaksi dengan menghubungi CS via WhatsApp (+62 858-5221-5079) atau email resmi dengan melampirkan Bukti Transfer dan Order ID. Proses pengembalian dana yang disetujui akan diproses dalam <strong>3–7 hari kerja</strong> ke rekening/metode pembayaran asal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Payment Security Content */}
          <TabsContent value="privacy">
            <Card className="panel border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-foreground">
                  <Lock className="w-5 h-5 text-maroon" />
                  Kebijakan Privasi & Keamanan Pembayaran
                </CardTitle>
                <CardDescription>
                  Jaminan perlindungan data pribadi dan enkripsi transaksi pelanggan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">1. Pengumpulan Data Pengguna</h4>
                  <p>
                    Data pribadi seperti Nama, Email, dan Nomor Telepon yang dikumpulkan saat transaksi hanya digunakan untuk kepentingan pengiriman akses produk E-Book, verifikasi pembayaran, dan dukungan pelanggan.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">2. Keamanan Pembayaran SSL / Payment Gateway</h4>
                  <p>
                    Seluruh transaksi diproses langsung oleh mitra Payment Gateway resmi yang berlisensi Bank Indonesia (termasuk iPaymu/Doku) menggunakan enkripsi data terstandarisasi SSL/TLS. Ling Chinese Lab tidak pernah menyimpan data sensitif seperti CVV kartu atau PIN akun perbankan Anda.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">3. Kerahasiaan Data</h4>
                  <p>
                    Kami menjamin kerahasiaan data Anda dan tidak akan pernah menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga manapun untuk tujuan komersial di luar pemrosesan pesanan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Support Footer Box */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-maroon/15 bg-maroon/[0.04] p-5 sm:flex-row">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="shrink-0 rounded-full bg-maroon/10 p-2.5 text-maroon">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm sm:text-base">Ada Pertanyaan Mengenai Syarat & Kebijakan?</h4>
              <p className="text-xs text-muted-foreground">Tim Helpdesk Ling Chinese Lab siap membantu Anda 24/7.</p>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-maroon px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-maroon-deep sm:text-sm"
          >
            Hubungi CS WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default LegalPoliciesSection;
