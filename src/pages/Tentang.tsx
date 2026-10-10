import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherCard from "@/components/about/TeacherCard";
import SectionHeading from "@/components/SectionHeading";
import { teachers } from "@/data/teachers";
import { CheckCircle } from "lucide-react";
import logoPandaOnly from "@/assets/logoPandaOnly.png";

const facts = [
  { label: "Penutur global", value: "1,1M+", note: "Ethnologue, 2023" },
  { label: "Lowongan Eropa", value: "1-2%", note: "Butuh kandidat Mandarin (OECD)" },
  { label: "Potensi gaji", value: "Rp10 jt+", note: "Teknologi & perdagangan (Suara.com)" },
];

const helps = [
  { title: "Skill siap pakai", body: "Latihan berbicara, presentasi, dan meeting langsung dengan laoshi berpengalaman." },
  { title: "Kurikulum relevan kerja", body: "Materi terstruktur untuk interview, bisnis, dan kolaborasi internasional." },
  { title: "Pendampingan personal", body: "Kelas fleksibel online atau offline dengan feedback rutin supaya progres terasa." },
  { title: "Jalur cepat karier", body: "Siap dipakai untuk negosiasi, meeting, dan peluang kerja internasional." },
];

const Tentang = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden py-16 md:py-20">
          <div aria-hidden className="paper-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              char="关"
              title="Tentang Ling Chinese Lab"
              lead="Tempat belajar Mandarin yang menyenangkan dan efektif untuk semua kalangan"
              className="rise"
            />
          </div>
        </section>

        {/* Brand story */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-10">
              <div className="panel overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[1fr_1.15fr]">
                  <div className="border-b border-border p-7 sm:p-9 lg:border-b-0 lg:border-r">
                    <h2 className="text-2xl font-bold md:text-[1.75rem]">Kenapa harus Ling Chinese Lab?</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      Lebih dari <span className="font-semibold text-ink">1,1 miliar orang</span> berbicara Mandarin (Ethnologue, 2023). Belajar di sini berarti membuka jalur baru untuk bisnis, karier, beasiswa, dan koneksi internasional.
                    </p>
                    <dl className="mt-7 grid grid-cols-3 gap-3">
                      {facts.map((f) => (
                        <div key={f.label} className="rounded-2xl bg-paper p-3 sm:p-4">
                          <dt className="text-xs font-semibold text-muted-foreground">{f.label}</dt>
                          <dd className="mt-1 font-display text-xl font-bold text-maroon sm:text-2xl">{f.value}</dd>
                          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{f.note}</p>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="p-7 sm:p-9">
                    <h3 className="text-lg font-bold">Cara kami membantu</h3>
                    <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                      {helps.map((h) => (
                        <li key={h.title} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-maroon" />
                          <div>
                            <p className="font-bold text-ink">{h.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Motto */}
              <figure className="mizige-dashed relative overflow-hidden rounded-[1.75rem] border border-hsk/20 bg-paper px-6 py-12 text-center sm:px-12">
                <img src={logoPandaOnly} alt="" className="mx-auto mb-5 h-16 w-auto" loading="lazy" />
                <blockquote className="relative mx-auto max-w-2xl font-display text-2xl font-bold leading-snug text-ink md:text-[2rem]">
                  <span aria-hidden className="font-hanzi mr-1 text-maroon/50">「</span>
                  Membawa bahasa Mandarin jadi dekat dan menyenangkan untuk semua
                  <span aria-hidden className="font-hanzi ml-1 text-maroon/50">」</span>
                </blockquote>
              </figure>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="section bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              char="师"
              title="Para Laoshi Kami"
              lead="Tim mentor profesional dengan pengalaman dan sertifikasi internasional"
              className="mb-12"
            />

            {/* Flex + justify-center: baris terakhir yang ganjil (mis. 3 atas, 2 bawah)
                otomatis ketengah supaya simetris, nggak kerasa kosong di kanan. */}
            <div className="mb-12 flex flex-wrap justify-center gap-6 lg:gap-7">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="reveal reveal-zoom w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.167rem)]"
                >
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>

            <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-maroon/15 bg-card p-7 text-center sm:p-8">
              <p className="leading-relaxed text-muted-foreground">
                <span className="font-semibold text-ink">Ling Chinese Lab</span> dibangun
                oleh para alumni <span className="font-semibold text-ink">Xin Zhong School </span>
                dan kampus mitra seperti <span className="font-semibold text-ink">NTCUST, Petra Christian University, Taichung Chung Hsing University</span>, dan <span className="font-semibold text-ink">China Medical University</span>.
                Kami memahami tantangan belajar Mandarin dan berkomitmen untuk membuat proses belajar
                menjadi lebih mudah, efektif, dan menyenangkan untuk semua kalangan.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tentang;
