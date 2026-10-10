import { CheckCircle, ArrowDown, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { programs } from "@/data/programs";
import { whatsappUrl } from "@/data/stats";
import whatsappIcon from "@/assets/Medsos/wa.svg";
import SectionHeading from "@/components/SectionHeading";

import chinaFlag from "@/assets/Flag/china.svg";
import taiwanFlag from "@/assets/Flag/taiwan.svg";

const simplifiedChars = ["学习", "让", "汉语", "门", "头"];
const traditionalChars = ["學習", "讓", "漢語", "門", "頭"];

type Script = {
  key: "hsk" | "tocfl";
  flag: string;
  flagAlt: string;
  title: string;
  sub: string;
  traits: React.ReactNode[];
  chars: string[];
  flow: [string, string, string];
  fits: string[];
};

const scripts: Script[] = [
  {
    key: "hsk",
    flag: chinaFlag,
    flagAlt: "China",
    title: "HSK (China)",
    sub: "Simplified / 简体字 (jiǎn tǐ zì)",
    traits: [
      <>Bentuk tulisan yang <strong>disederhanakan</strong></>,
      <>Lebih mudah dipahami untuk pemula</>,
      <>Digunakan di: <strong>China, Singapura, Malaysia</strong></>,
    ],
    chars: simplifiedChars,
    flow: ["Mau China?", "Ujian HSK", "Berbisnis"],
    fits: [
      "Ujian HSK (Sertifikasi Internasional)",
      "Keperluan bisnis & pekerjaan profesional",
      "Belajar lebih cepat untuk tingkat pemula",
    ],
  },
  {
    key: "tocfl",
    flag: taiwanFlag,
    flagAlt: "Taiwan",
    title: "TOCFL (Taiwan)",
    sub: "Traditional / 繁體字 (fán tǐ zì)",
    traits: [
      <>Bentuk asli dengan <strong>goresan lebih banyak (rumit)</strong></>,
      <>Banyak dipakai dalam budaya & literatur klasik</>,
      <>Digunakan di: <strong>Taiwan, Hong Kong, Makau</strong></>,
    ],
    chars: traditionalChars,
    flow: ["Mau Taiwan?", "Ujian TOCFL", "Keseharian Taiwan"],
    fits: [
      "Persiapan sekolah/kerja di Taiwan/HK",
      "Minat pada budaya atau literatur klasik",
      "Mempelajari karakter asli yang lebih lengkap",
    ],
  },
];

const tone = {
  hsk: { text: "text-hsk", bg: "bg-hsk-soft", border: "border-hsk/25", dot: "bg-hsk" },
  tocfl: { text: "text-tocfl", bg: "bg-tocfl-soft", border: "border-tocfl/25", dot: "bg-tocfl" },
};

const levels = [
  { cefr: "C2", desc: "Sangat Mahir / Mastery", hsk: "HSK 9", tocfl: "Level 6 (Band C)", tocflSub: "精通級 (Mastery)" },
  { cefr: "C1", desc: "Mahir / Advanced", hsk: "HSK 7 - 8", tocfl: "Level 5 (Band C)", tocflSub: "流利級 (Fluent)" },
  { cefr: "B2", desc: "Menengah Atas / Upper-Inter", hsk: "HSK 6", tocfl: "Level 4 (Band B)", tocflSub: "高階級 (Advanced)" },
  { cefr: "B1", desc: "Menengah / Intermediate", hsk: "HSK 4 - 5", tocfl: "Level 3 (Band B)", tocflSub: "進階級 (Vantage)" },
  { cefr: "A2", desc: "Dasar / Elementary", hsk: "HSK 2 - 3", tocfl: "Level 2 (Band A)", tocflSub: "基礎級 (Waystage)" },
  { cefr: "A1", desc: "Pemula / Beginner", hsk: "HSK 1", tocfl: "Level 1 (Band A)", tocflSub: "入門級 (Breakthrough)" },
];

const ProgramsSection = () => {
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharIndex((prev) => (prev + 1) % simplifiedChars.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsappClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="section">
      <div className="container mx-auto flex flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          char="级"
          title="Program Ling Chinese Lab"
          lead="Pilih level yang sesuai dengan kemampuan Anda. Setiap program dirancang untuk hasil maksimal bagi kebutuhan dan masa depan Anda!"
        >
          <p className="mt-5 flex flex-wrap items-center justify-center gap-3 font-display text-lg font-bold text-ink md:text-xl">
            <span className="flex items-center gap-2">
              <img src={chinaFlag} alt="Bendera China" className="h-6 w-6 rounded-full" />
              Simplified
            </span>
            <span className="text-muted-foreground">&</span>
            <span className="flex items-center gap-2">
              <img src={taiwanFlag} alt="Bendera Taiwan" className="h-6 w-6 rounded-full" />
              Traditional
            </span>
          </p>
        </SectionHeading>

        {/* Simplified vs Traditional */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {scripts.map((s) => {
            const t = tone[s.key];
            return (
              <article key={s.key} className="panel flex flex-col overflow-hidden">
                <header className={`flex items-center gap-4 border-b ${t.border} ${t.bg} px-6 py-5`}>
                  <img src={s.flag} alt={s.flagAlt} className="h-11 w-11 rounded-full ring-2 ring-card" />
                  <div>
                    <h3 className={`text-xl font-bold ${t.text}`}>{s.title}</h3>
                    <p className="text-sm font-semibold text-foreground/75">{s.sub}</p>
                  </div>
                </header>

                <div className="flex flex-1 flex-col gap-7 p-6">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-muted-foreground">Karakteristik Utama</h4>
                    <ul className="space-y-2.5 text-[0.95rem] text-foreground/90">
                      {s.traits.map((trait, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} />
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Goresan: karakter di atas kotak 米字格 */}
                    <div className="flex flex-col items-center gap-2">
                      <h4 className={`text-xs font-bold ${t.text}`}>Goresan</h4>
                      <div className={`mizige flex aspect-square w-full max-w-[150px] items-center justify-center overflow-hidden rounded-2xl border ${t.border}`}>
                        <span
                          key={`${s.key}-${charIndex}`}
                          className="font-hanzi relative text-[2.6rem] font-semibold leading-none text-ink animate-in fade-in zoom-in-95 duration-500 sm:text-5xl"
                        >
                          {s.chars[charIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Alur */}
                    <div className="flex flex-col items-center gap-2">
                      <h4 className={`text-xs font-bold ${t.text}`}>Alur</h4>
                      <div className={`flex w-full flex-1 flex-col items-center justify-center rounded-2xl border ${t.border} ${t.bg} px-3 py-4 text-center`}>
                        <p className="text-sm font-semibold text-foreground/80">{s.flow[0]}</p>
                        <ArrowDown className={`my-1 h-4 w-4 ${t.text} opacity-60`} />
                        <p className={`text-sm font-bold ${t.text}`}>{s.flow[1]}</p>
                        <ArrowDown className={`my-1 h-4 w-4 ${t.text} opacity-60`} />
                        <p className="text-sm font-bold text-ink">{s.flow[2]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-border pt-6">
                    <h4 className="mb-3 text-sm font-bold text-muted-foreground">Sangat Cocok Untuk:</h4>
                    <ul className="space-y-2.5 text-[0.95rem] text-foreground/90">
                      {s.fits.map((f) => (
                        <li key={f} className="flex items-center gap-3">
                          <CheckCircle className={`h-5 w-5 shrink-0 ${t.text}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Perbandingan level */}
        <div className="panel overflow-hidden">
          <div className="border-b border-border bg-secondary/50 px-6 py-4 text-center">
            <h3 className="text-lg font-bold md:text-xl">Perbandingan Level</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-20 p-4 text-center text-sm font-semibold text-muted-foreground">CEFR</th>
                  <th scope="col" className="p-4 text-sm font-semibold text-muted-foreground">Keterangan</th>
                  <th scope="col" className="bg-hsk-soft/70 p-4 text-center text-hsk">
                    <div className="text-base font-bold">HSK (China)</div>
                    <div className="font-hanzi text-xs font-normal opacity-90">简体字 jiǎn tǐ zì</div>
                  </th>
                  <th scope="col" className="bg-tocfl-soft/70 p-4 text-center text-tocfl">
                    <div className="text-base font-bold">TOCFL (Taiwan)</div>
                    <div className="font-hanzi text-xs font-normal opacity-90">繁體字 fán tǐ zì</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {levels.map((l) => (
                  <tr key={l.cefr} className="transition-colors hover:bg-secondary/40">
                    <td className="p-4 text-center">
                      <span className="inline-flex h-8 w-10 items-center justify-center rounded-md bg-maroon/[0.07] font-bold text-maroon">{l.cefr}</span>
                    </td>
                    <td className="p-4 font-medium text-foreground">{l.desc}</td>
                    <td className="bg-hsk-soft/30 p-4 text-center font-bold text-ink">{l.hsk}</td>
                    <td className="bg-tocfl-soft/30 p-4 text-center text-ink">
                      {l.tocfl}
                      <br />
                      <span className="font-hanzi text-xs text-muted-foreground">{l.tocflSub}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tingkatan program: Basic → Medium → Advance */}
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {programs.map((program, i) => (
            <li key={program.id} className="panel relative flex flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-maroon px-3 py-1 text-xs font-bold text-white">{program.level}</span>
                <span aria-hidden className="flex gap-1">
                  {programs.map((_, j) => (
                    <span key={j} className={`h-1.5 w-5 rounded-full ${j <= i ? "bg-maroon/70" : "bg-maroon/15"}`} />
                  ))}
                </span>
              </div>
              <h3 className="text-xl font-bold leading-snug">{program.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{program.description}</p>
              <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-primary" />
                    <span className="text-sm text-foreground/85">{feature}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-[1.75rem] border border-maroon/15 bg-maroon/[0.04] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="flex items-center gap-3 text-sm text-foreground/80 sm:text-base">
            <MessageCircle className="hidden h-5 w-5 shrink-0 text-maroon sm:block" />
            Info: Harga dan jadwal dikirimkan secara personal via WhatsApp
          </p>
          <button
            type="button"
            onClick={handleWhatsappClick}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-maroon px-6 text-sm font-bold text-white transition-colors hover:bg-maroon-deep sm:text-base"
          >
            <img src={whatsappIcon} alt="" className="size-6" />
            Tanya Program via WA
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
