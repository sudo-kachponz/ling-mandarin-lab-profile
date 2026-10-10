import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/stats";
import CountUp from "@/components/CountUp";
import { TrendingUp, Users, Award, ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import hskLogo from "@/assets/LogoSertifikat/HSK.svg";
import tocflLogo from "@/assets/LogoSertifikat/TOCFL.svg";
import videoOne from "@/assets/Phone/video1.mp4";
import videoTwo from "@/assets/Phone/Video 2.mp4";
import igIcon from "@/assets/Medsos/ig.svg";
import tiktokIcon from "@/assets/Medsos/tiktok.svg";
import celineHSK from "@/assets/Laoshi/Celine/Celine HSK.pdf";
import celineHSKPreview from "@/assets/Laoshi/Celine/celine-hsk-1.webp";
import celineTOCFL from "@/assets/Laoshi/Celine/Celine TOCFL.jpg";
import michelleHSK from "@/assets/Laoshi/MichellePutri/Michelle P HSK.pdf";
import michelleHSKPreview from "@/assets/Laoshi/MichellePutri/michelle-hsk-1.webp";
import tasyaHSK from "@/assets/Laoshi/Tasya/Tasya HSK.pdf";
import tasyaHSKPreview from "@/assets/Laoshi/Tasya/tasya-hsk-1.webp";
import triveraCertificate from "@/assets/Laoshi/Trivera/trivera_certificate.pdf";
import graciaCertificate from "@/assets/Laoshi/Gracia/gracia.pdf";
import rachelHsk from "@/assets/Laoshi/Rachel/HSK.pdf";
import rachelTocfl from "@/assets/Laoshi/Rachel/TOCFL.pdf";
import aureliaCertificate from "@/assets/Laoshi/Aurelia/CamScanner 24-11-2025 06.20.pdf";
import ellenCertificate from "@/assets/Laoshi/Ellen/ellen_certificate.pdf";
import jaxineTocfl from "@/assets/Laoshi/Jaxine/JAXINE - Chinese Language Proficiency - TOCFL.pdf";
import oliviaTocfl1 from "@/assets/Laoshi/Olivia/olivia_tocfl_1.jpeg";
import oliviaTocfl2 from "@/assets/Laoshi/Olivia/olivia_tocfl_2.jpeg";
import audreyHsk from "@/assets/Laoshi/Audrey/audreyHSK5.pdf";
import audreyTocfl from "@/assets/Laoshi/Audrey/audreytocfl.jpeg";
import liaTocfl1 from "@/assets/Laoshi/Lia/lia_tocfl_1.jpg";
import liaTocfl2 from "@/assets/Laoshi/Lia/lia_tocfl_2.jpg";


const icons = {
  0: TrendingUp,
  1: Users,
  2: Award
};

type CertificateType = "HSK" | "TOCFL";

const certificateLogos: Record<CertificateType, string> = {
  HSK: hskLogo,
  TOCFL: tocflLogo
};

const videos = [
  { src: videoOne, title: "Video 1" },
  { src: videoTwo, title: "Video 2" }
];

type Certificate = {
  src: string;
  preview: string;
  mentor: string;
  description: string;
  type: CertificateType;
  previewType?: "image" | "pdf";
};

const certificates: Certificate[] = [
  {
    src: celineHSK,
    preview: celineHSKPreview,
    mentor: "Laoshi Celine",
    description: "HSK Certificate",
    type: "HSK" as CertificateType
  },
  {
    src: celineTOCFL,
    preview: celineTOCFL,
    mentor: "Laoshi Celine",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType
  },
  {
    src: michelleHSK,
    preview: michelleHSKPreview,
    mentor: "Laoshi Michelle Putri",
    description: "HSK Certificate",
    type: "HSK" as CertificateType
  },
  {
    src: tasyaHSK,
    preview: tasyaHSKPreview,
    mentor: "Laoshi Tasya",
    description: "HSK Certificate",
    type: "HSK" as CertificateType
  },
  {
    src: triveraCertificate,
    preview: triveraCertificate,
    mentor: "Laoshi Trivera",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: graciaCertificate,
    preview: graciaCertificate,
    mentor: "Laoshi Gracia",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: rachelHsk,
    preview: rachelHsk,
    mentor: "Laoshi Rachel",
    description: "HSK Certificate",
    type: "HSK" as CertificateType,
    previewType: "pdf"
  },
  {
    src: rachelTocfl,
    preview: rachelTocfl,
    mentor: "Laoshi Rachel",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: aureliaCertificate,
    preview: aureliaCertificate,
    mentor: "Laoshi Aurelia Kelly",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: ellenCertificate,
    preview: ellenCertificate,
    mentor: "Laoshi Ellen",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: jaxineTocfl,
    preview: jaxineTocfl,
    mentor: "Ms. Jaxine",
    description: "TOCFL Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "pdf"
  },
  {
    src: oliviaTocfl1,
    preview: oliviaTocfl1,
    mentor: "Laoshi Olivia",
    description: "TOCFL Certificate 1",
    type: "TOCFL" as CertificateType,
    previewType: "image"
  },
  {
    src: oliviaTocfl2,
    preview: oliviaTocfl2,
    mentor: "Laoshi Olivia",
    description: "TOCFL Certificate 2",
    type: "TOCFL" as CertificateType,
    previewType: "image"
  },
  {
    src: audreyHsk,
    preview: audreyHsk,
    mentor: "Audrey Laoshi",
    description: "HSK 5 Certificate",
    type: "HSK" as CertificateType,
    previewType: "pdf"
  },
  {
    src: audreyTocfl,
    preview: audreyTocfl,
    mentor: "Audrey Laoshi",
    description: "TOCFL B1 Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "image"
  },
  {
    src: liaTocfl1,
    preview: liaTocfl1,
    mentor: "Laoshi Lia Angeline",
    description: "TOCFL Level 3 Certificate",
    type: "TOCFL" as CertificateType,
    previewType: "image"
  },
  {
    src: liaTocfl2,
    preview: liaTocfl2,
    mentor: "Laoshi Lia Angeline",
    description: "TOCFL Level 3 Score Report",
    type: "TOCFL" as CertificateType,
    previewType: "image"
  }
];

const TikTokSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalCertificates = certificates.length;
  const totalVideos = videos.length;

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      vid.muted = isVideoMuted;
      if (idx !== activeVideo) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    const current = videoRefs.current[activeVideo];
    if (current) {
      current.muted = isVideoMuted;
      const playPromise = current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(!current.paused))
          .catch(() => setIsVideoPlaying(false));
      } else {
        setIsVideoPlaying(!current.paused);
      }
    }
  }, [activeVideo, isVideoMuted]);

  useEffect(() => {
    if (isPaused || totalCertificates <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveCertificate((prev) => (prev + 1) % totalCertificates);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, totalCertificates]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayPauseVideo = () => {
    const current = videoRefs.current[activeVideo];
    if (!current) return;

    if (current.paused) {
      const playPromise = current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
      } else {
        setIsVideoPlaying(true);
      }
    } else {
      current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    setIsVideoMuted((prev) => !prev);
  };

  const showPrevVideo = () => {
    setActiveVideo((prev) => (prev - 1 + totalVideos) % totalVideos);
  };

  const showNextVideo = () => {
    setActiveVideo((prev) => (prev + 1) % totalVideos);
  };

  const pauseSlider = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const resumeSliderAfterDelay = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimeoutRef.current = null;
    }, 5000);
  };

  const handleHoverStart = () => {
    pauseSlider();
  };

  const handleHoverEnd = () => {
    resumeSliderAfterDelay();
  };

  const handleClickPause = () => {
    pauseSlider();
    resumeSliderAfterDelay();
  };

  const selectCertificate = (index: number) => {
    setActiveCertificate(index);
    pauseSlider();
    resumeSliderAfterDelay();
  };

  const showPrev = () => {
    setActiveCertificate((prev) => (prev - 1 + totalCertificates) % totalCertificates);
    pauseSlider();
    resumeSliderAfterDelay();
  };

  const showNext = () => {
    setActiveCertificate((prev) => (prev + 1) % totalCertificates);
    pauseSlider();
    resumeSliderAfterDelay();
  };

  return (
    <section className="section bg-paper">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Video */}
          <div className="reveal reveal-left mx-auto w-full max-w-md lg:sticky lg:top-28">
            {/* Video sudah punya casing panda sendiri — jangan kasih border/bingkai lagi */}
            <div className="relative">
              {videos.map((video, index) => (
                <video
                  key={video.title}
                  ref={(el) => {
                    if (el) {
                      videoRefs.current[index] = el;
                    }
                  }}
                  src={video.src}
                  muted={isVideoMuted}
                  playsInline
                  loop
                  preload={index === 0 ? "metadata" : "none"}
                  className={`h-full w-full object-contain ${activeVideo === index ? "block" : "hidden"}`}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                />
              ))}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-3">
                <button
                  type="button"
                  onClick={showPrevVideo}
                  className="pointer-events-auto rounded-full bg-paper/85 p-2 text-ink shadow-sm backdrop-blur transition-colors hover:bg-paper"
                  aria-label="Video sebelumnya"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={showNextVideo}
                  className="pointer-events-auto rounded-full bg-paper/85 p-2 text-ink shadow-sm backdrop-blur transition-colors hover:bg-paper"
                  aria-label="Video selanjutnya"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayPauseVideo}
                  className="flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur"
                  aria-label={isVideoPlaying ? "Jeda video" : "Putar video"}
                >
                  {isVideoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {isVideoPlaying ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={toggleVideoMute}
                  className="flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur"
                  aria-label={isVideoMuted ? "Aktifkan suara" : "Matikan suara"}
                >
                  {isVideoMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {isVideoMuted ? "Sound off" : "Sound on"}
                </button>
                <span className="ml-auto rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                  {activeVideo + 1} / {totalVideos}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href="https://www.instagram.com/lingchineselab?igsh=MXNmMnBscmR6aHFlaw==" target="_blank" rel="noopener noreferrer" className="chip">
                <img src={igIcon} alt="Instagram" className="h-4 w-4" />
                <span>@lingchineselab</span>
              </a>
              <a href="https://www.tiktok.com/@lingchineselab?_r=1&_t=ZS-93rcJMWKTLg" target="_blank" rel="noopener noreferrer" className="chip">
                <img src={tiktokIcon} alt="TikTok" className="h-4 w-4" />
                <span>@lingchineselab</span>
              </a>
            </div>
          </div>

          {/* Alasan, angka, dan sertifikat */}
          <div className="space-y-10">
            <div className="reveal">
              <span aria-hidden className="mizige mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] border border-hsk/40 font-hanzi text-2xl font-semibold leading-none text-maroon">选</span>
              <h2 className="section-title">Kenapa Pilih Ling Chinese Lab?</h2>
              <p className="mt-3 font-display text-xl font-bold leading-snug text-maroon md:text-2xl">
                Belajar dengan metode yang terbukti efektif dan menyenangkan
              </p>
              <p className="section-lead">
                Dibimbing langsung oleh laoshi yang aktif membagikan ilmu lewat video pembelajaran dan
                pengalaman mengajar privat dari berbagai level HSK dan TOCFL.
              </p>
            </div>

            <dl className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-[1.5rem] border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat, index) => {
                const Icon = icons[index as keyof typeof icons];
                return (
                  <div key={stat.id} className={`reveal reveal-zoom reveal-d${index + 1} flex gap-4 p-5 sm:flex-col sm:gap-3`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-maroon/[0.07]">
                      <Icon className="h-5 w-5 text-maroon" />
                    </span>
                    <div>
                      <dd className="font-display text-3xl font-bold leading-none text-ink"><CountUp value={stat.value} /></dd>
                      <dt className="mt-2 text-sm font-bold leading-snug text-foreground">{stat.label}</dt>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                );
              })}
            </dl>

            <div className="panel p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Sertifikat HSK & TOCFL</p>
                  <h3 className="mt-1 text-xl font-bold">Bukti kompetensi para laoshi bersertifikat</h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={showPrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper text-ink transition-colors hover:border-maroon/40 hover:bg-maroon/5"
                    aria-label="Sertifikat sebelumnya"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper text-ink transition-colors hover:border-maroon/40 hover:bg-maroon/5"
                    aria-label="Sertifikat selanjutnya"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                className="relative mt-5 h-[380px] overflow-hidden rounded-2xl bg-secondary/60 sm:h-[440px]"
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                onClick={handleClickPause}
                onFocus={handleHoverStart}
                onBlur={handleHoverEnd}
                tabIndex={0}
                role="region"
                aria-roledescription="Sertifikat laoshi"
              >
                {certificates.map((certificate, index) => {
                  const isActive = activeCertificate === index;
                  return (
                    <div
                      key={`${certificate.mentor}-${certificate.type}-${index}`}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 p-3 transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <div className="flex h-full flex-col gap-3 rounded-xl bg-card p-3 shadow-sm">
                        <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-paper">
                          <div className="absolute right-2.5 top-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card/95 shadow-sm">
                            <img src={certificateLogos[certificate.type]} alt={`Logo sertifikat ${certificate.type}`} className="h-7 w-7" loading="lazy" />
                          </div>
                          {/* Hanya slide aktif yang memuat PDF — hemat memori & bandwidth */}
                          {certificate.previewType === "pdf" ? (
                            isActive ? (
                              <object
                                data={certificate.preview}
                                type="application/pdf"
                                className="h-full w-full"
                                aria-label={`Preview PDF sertifikat ${certificate.mentor}`}
                              >
                                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                                  Preview PDF tidak dapat dimuat. Klik tombol di bawah untuk membuka berkas.
                                </div>
                              </object>
                            ) : null
                          ) : (
                            <img
                              src={certificate.preview}
                              alt={`Preview sertifikat ${certificate.mentor}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
                          <div className="text-center sm:text-left">
                            <p className="font-display text-base font-bold text-ink">{certificate.mentor}</p>
                            <p className="text-xs text-muted-foreground">{certificate.description}</p>
                          </div>
                          <a
                            href={certificate.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isActive ? 0 : -1}
                            className="shrink-0 rounded-full border border-maroon/30 px-4 py-2 text-sm font-semibold text-maroon transition-colors hover:bg-maroon/5"
                          >
                            Lihat sertifikat asli
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {certificates.map((certificate, index) => (
                  <button
                    key={`${certificate.mentor}-${certificate.type}-dot-${index}`}
                    type="button"
                    onClick={() => selectCertificate(index)}
                    className={`h-1.5 rounded-full transition-all ${activeCertificate === index ? "w-6 bg-maroon" : "w-1.5 bg-maroon/20 hover:bg-maroon/40"}`}
                    aria-label={`Tampilkan sertifikat ${certificate.mentor}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Slider berhenti ketika disentuh atau diarahkan kursor, dan akan berjalan lagi otomatis setelah 5
                detik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TikTokSection;
