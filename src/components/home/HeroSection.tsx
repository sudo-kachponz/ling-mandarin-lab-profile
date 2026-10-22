import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { whatsappUrl } from "@/data/stats";
import logoFull from "@/assets/LOGO.svg";
import panda1 from "@/assets/PandaDialog/1.svg";
import panda2 from "@/assets/PandaDialog/2.svg";
import panda3 from "@/assets/PandaDialog/3.svg";
import panda4 from "@/assets/PandaDialog/4.svg";
import flagChina from "@/assets/Flag/china.svg";
import flagTaiwan from "@/assets/Flag/taiwan.svg";
import flagIndonesia from "@/assets/Flag/indonesia.svg";
import schoolHsing from "@/assets/School/hsing.svg";
import schoolMedical from "@/assets/School/medical.svg";
import schoolNtcust from "@/assets/School/ntcust_long.svg";
import schoolPetra from "@/assets/School/petra.svg";
import schoolXinZhong from "@/assets/School/xin_zhong.svg";
import schoolFengchia from "@/assets/School/fengchia.svg";
import schoolMntnu from "@/assets/School/mntnu.svg";
import schoolNkust from "@/assets/School/science.svg";
import schoolRitsumeikan from "@/assets/School/ritsumeikan.svg";
import whatsappIcon from "@/assets/Medsos/wa.svg";

const highlightPoints = [
  "Yuk, belajar online group dan private dengan para laoshi penyabar dan bersertifikasi HSK & TOCFL dengan pengalaman studi dan magang di Taiwan!",
];

const schoolLogos = [
  { src: schoolXinZhong, alt: "Xin Zhong School" },
  { src: schoolNtcust, alt: "NTCUST" },
  { src: schoolPetra, alt: "Petra Christian University" },
  { src: schoolHsing, alt: "Taichung Chung Hsing University" },
  { src: schoolMedical, alt: "China Medical University, Taichung" },
  { src: schoolFengchia, alt: "Taichung Fengchia University" },
  { src: schoolMntnu, alt: "Mandarin Training Center of National Taiwan Normal University" },
  { src: schoolNkust, alt: "National Kaohsiung University of Science and Technology" },
  { src: schoolRitsumeikan, alt: "Ritsumeikan Asia Pacific University" },
];

const flagList = [
  { src: flagTaiwan, alt: "Taiwan Flag" },
  { src: flagChina, alt: "China Flag" },
  { src: flagIndonesia, alt: "Indonesia Flag" },
];

const pandaSlides = [
  { src: panda1, alt: "Panda dialog 1" },
  { src: panda2, alt: "Panda dialog 2" },
  { src: panda3, alt: "Panda dialog 3" },
  { src: panda4, alt: "Panda dialog 4" },
];

const typewriterPhrases = [
  "Lebih dari 1,1 miliar orang bisa berbahasa Mandarin (Ethnologue, 2023).",
  "1-2% lowongan kerja di Eropa mensyaratkan kemampuan Mandarin (OECD, 2023).",
  "40% alumni yang menembus perusahaan asing terkait Tiongkok/Asia Timur berasal dari jurusan Mandarin (Times Indonesia).",
  "Kemampuan Mandarin bisa membawa gaji di atas Rp10 juta per bulan di sektor teknologi, perdagangan internasional, dan perusahaan multinasional (Suara.com).",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToTeachers = () => {
    document.getElementById("teachers-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsappClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const slideCount = pandaSlides.length;

  // Dialog panda: tempo sedikit diperlambat supaya teks di balon sempat terbaca.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const rotation = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 1600);
    return () => clearInterval(rotation);
  }, [slideCount]);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[typewriterIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (prefersReducedMotion()) {
      setDisplayedText(currentPhrase);
      timeout = setTimeout(() => setTypewriterIndex((prev) => (prev + 1) % typewriterPhrases.length), 5000);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 40);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 22);
      } else {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, typewriterIndex]);

  return (
    <section className="relative overflow-hidden">
      {/* latar kertas bertitik, memudar ke bawah */}
      <div aria-hidden className="paper-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="container mx-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Panda di atas kertas latihan 米字格 */}
          <div className="rise relative mx-auto w-full max-w-[560px]">
            <div className="mizige absolute inset-x-[6%] bottom-[2%] top-[10%] rounded-[2.25rem] border border-hsk/25 shadow-soft" aria-hidden />
            <div className="relative grid w-full items-start" aria-live="off">
              {pandaSlides.map((panda, index) => (
                <img
                  key={panda.alt}
                  src={panda.src}
                  alt={panda.alt}
                  width={700}
                  height={523}
                  className={`col-start-1 row-start-1 w-full transition-[opacity,transform] duration-300 ease-out ${
                    activeSlide === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Teks & aksi */}
          <div className="space-y-6">
            <div className="rise rise-1 space-y-4">
              <img src={logoFull} alt="Ling Chinese Lab" className="h-auto w-full max-w-[22rem]" />
              <h1 className="font-display text-[2.15rem] font-bold leading-[1.12] text-ink sm:text-5xl lg:text-[3.4rem]">
                Crafting cozy journeys in Mandarin
              </h1>
              <p className="min-h-[4.5rem] max-w-xl text-base leading-relaxed text-muted-foreground sm:min-h-[3.75rem] sm:text-lg">
                <span>{displayedText}</span>
                <span aria-hidden className="caret-blink ml-1 inline-block h-[1.1em] w-[2px] translate-y-[3px] rounded bg-maroon/70" />
              </p>
            </div>

            <div className="rise rise-2 space-y-3">
              {highlightPoints.map((text, index) => (
                <p
                  key={`highlight-${index}`}
                  className="max-w-xl border-l-[3px] border-maroon/70 pl-4 text-[1.05rem] font-semibold leading-relaxed text-ink sm:text-lg"
                >
                  {text}
                </p>
              ))}
            </div>

            <div className="rise rise-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleWhatsappClick}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-maroon px-7 text-base font-bold text-white shadow-soft transition-colors hover:bg-maroon-deep sm:text-[1.05rem]"
              >
                <img src={whatsappIcon} alt="" className="size-7" />
                Chat WA: Harga & Jadwal
              </button>
              <button
                type="button"
                onClick={scrollToTeachers}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-maroon/30 bg-card px-7 text-base font-bold text-maroon transition-colors hover:border-maroon/60 hover:bg-maroon/5 sm:text-[1.05rem]"
              >
                <ArrowDown className="size-5" />
                Lihat Profil Laoshi
              </button>
            </div>

            {/* E-book promo */}
            <button
              onClick={() => navigate("/store")}
              className="group flex w-full max-w-2xl items-center gap-4 rounded-[1.5rem] bg-maroon p-4 text-left text-white shadow-lift transition-colors hover:bg-maroon-deep sm:gap-5 sm:p-5"
            >
              {/* Mobile: cover tunggal yang ringkas */}
              <img
                src="/ebook-cover.webp"
                alt="Cover Rahasia Huruf Mandarin"
                loading="lazy"
                className="block h-[88px] w-auto shrink-0 rounded-lg shadow-lg ring-1 ring-black/20 sm:hidden"
              />
              {/* Desktop: cover + intip halaman (fanned) */}
              <div className="relative hidden h-[124px] w-[112px] shrink-0 sm:block">
                <img src="/ebook-inside-1.webp" alt="" loading="lazy" className="absolute left-9 top-4 w-16 rotate-[8deg] rounded shadow-lg ring-1 ring-black/10 transition-transform duration-300 group-hover:rotate-[12deg]" />
                <img src="/ebook-inside-2.webp" alt="" loading="lazy" className="absolute left-1 top-3 w-16 -rotate-[8deg] rounded shadow-lg ring-1 ring-black/10 transition-transform duration-300 group-hover:-rotate-[12deg]" />
                <img src="/ebook-cover.webp" alt="Cover Rahasia Huruf Mandarin" loading="lazy" className="absolute left-5 top-0 w-[70px] rounded shadow-xl ring-1 ring-black/20" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <span className="inline-block rounded-md border border-gold/40 px-2 py-0.5 text-[11px] font-bold text-gold sm:text-xs">
                  E-Book Ling Chinese Lab
                </span>
                <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-2xl">
                  Rahasia Huruf Mandarin <span className="text-gold">(Vol. 1)</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/85 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5"><img src={flagChina} alt="" className="h-4 w-4 rounded-full" /> Simplified</span>
                  <span className="inline-flex items-center gap-1.5"><img src={flagTaiwan} alt="" className="h-4 w-4 rounded-full" /> Traditional</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-white/55 line-through sm:text-sm">Rp 85.000</span>
                  <span className="text-lg font-extrabold text-gold sm:text-xl">mulai Rp 60.000</span>
                </div>
              </div>
              <span className="hidden shrink-0 items-center rounded-full bg-gold px-5 py-3 text-sm font-extrabold text-maroon-deep transition-colors group-hover:bg-[#D4A758] sm:inline-flex">
                Lihat E-Book
              </span>
            </button>
          </div>
        </div>

        {/* Pita kepercayaan: asal mentor & almamater */}
        <div className="mt-12 rounded-[1.75rem] border border-border/80 bg-card/80 p-5 backdrop-blur-sm sm:p-6 lg:mt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex shrink-0 items-center gap-3 lg:border-r lg:border-border lg:pr-6">
              <span className="text-sm font-semibold text-muted-foreground">Mentors from</span>
              <div className="flex -space-x-2">
                {flagList.map((flag) => (
                  <span key={flag.alt} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-card shadow-sm">
                    <img src={flag.src} alt={flag.alt} className="h-8 w-8 object-contain" />
                  </span>
                ))}
              </div>
            </div>
            <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-4">
              {schoolLogos.map((school) => (
                <li key={school.alt} className="flex h-14 basis-[calc(25%-0.75rem)] items-center justify-center sm:h-16 lg:basis-[calc(11.111%-0.889rem)]" title={school.alt}>
                  <img src={school.src} alt={school.alt} loading="lazy" className="max-h-full w-full object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
