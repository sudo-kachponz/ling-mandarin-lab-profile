import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherCard from "@/components/about/TeacherCard";
import { teachers } from "@/data/teachers";
import { Lightbulb, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Tentang = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Tentang Ling Chinese Lab
              </h1>
              <p className="text-lg text-muted-foreground">
                Tempat belajar Mandarin yang menyenangkan dan efektif untuk semua kalangan
              </p>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Logo Brief */}
              <Card className="relative overflow-hidden border border-primary/20 bg-card shadow-lg">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                <CardContent className="relative p-8 space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Insight
                      </span>
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Future-ready
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      Kenapa harus Ling Chinese Lab?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Lebih dari <span className="font-semibold text-foreground">1,1 miliar orang</span> berbicara Mandarin (Ethnologue, 2023). Belajar di sini berarti membuka jalur baru untuk bisnis, karier, beasiswa, dan koneksi internasional.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-muted-foreground">Penutur global</p>
                      <p className="text-2xl font-bold text-foreground">1,1M+</p>
                      <p className="text-xs text-muted-foreground">Ethnologue, 2023</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-muted-foreground">Lowongan Eropa</p>
                      <p className="text-2xl font-bold text-foreground">1-2%</p>
                      <p className="text-xs text-muted-foreground">Butuh kandidat Mandarin (OECD)</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-muted-foreground">Potensi gaji</p>
                      <p className="text-2xl font-bold text-foreground">Rp10 jt+</p>
                      <p className="text-xs text-muted-foreground">Teknologi & perdagangan (Suara.com)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Cara kami membantu
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      <li className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Skill siap pakai</p>
                          <p className="text-sm text-muted-foreground">
                            Latihan berbicara, presentasi, dan meeting langsung dengan laoshi berpengalaman.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Kurikulum relevan kerja</p>
                          <p className="text-sm text-muted-foreground">
                            Materi terstruktur untuk interview, bisnis, dan kolaborasi internasional.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Pendampingan personal</p>
                          <p className="text-sm text-muted-foreground">
                            Kelas fleksibel online atau offline dengan feedback rutin supaya progres terasa.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Jalur cepat karier</p>
                          <p className="text-sm text-muted-foreground">
                            Siap dipakai untuk negosiasi, meeting, dan peluang kerja internasional.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Motto */}
              <div className="text-center py-12 px-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <blockquote className="text-2xl md:text-3xl font-semibold text-foreground italic">
                  "Membawa bahasa Mandarin jadi dekat dan menyenangkan untuk semua"
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Para Laoshi Kami
              </h2>
              <p className="text-lg text-muted-foreground">
                Tim mentor profesional dengan pengalaman dan sertifikasi internasional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {teachers.map((teacher, index, arr) => (
                <div 
                  key={teacher.id} 
                  className={index === arr.length - 1 && arr.length % 3 === 1 ? "lg:col-start-2" : ""}
                >
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>

            {/* Xin Zhong School Note */}
            <Card className="max-w-3xl mx-auto border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Ling Chinese Lab</span> dibangun
                  oleh para alumni <span className="font-semibold text-foreground">Xin Zhong School </span>
                  dan kampus mitra seperti <span className="font-semibold text-foreground">NTCUST, Petra Christian University, Taichung Chung Hsing University</span>, dan <span className="font-semibold text-foreground">China Medical University</span>.
                  Kami memahami tantangan belajar Mandarin dan berkomitmen untuk membuat proses belajar
                  menjadi lebih mudah, efektif, dan menyenangkan untuk semua kalangan.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tentang;
