import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import flagChina from "@/assets/Flag/china.svg";
import flagTaiwan from "@/assets/Flag/taiwan.svg";

/**
 * Leaderboard publik "Balapan Bambu" — memakai endpoint yang SAMA dengan
 * leaderboard admin (GET /api/quiz, logika ranking identik dengan
 * api/admin/dashboard.ts). Bedanya cuma: nama sudah disamarkan oleh server.
 *
 * Tiap buku punya papan sendiri (per slug): Mandarin (Simplified) dan
 * Taiwan (Tradisional). Ganti tab → ambil data slug itu & balapan ulang.
 * Peringkat: jawaban benar terbanyak dulu, lalu yang paling cepat per soal.
 *
 * Motion (sekali jalan saat section terlihat, ±5,5 detik):
 *   1. countdown 三 二 一 开始!
 *   2. balapan: kecepatan naik-turun → saling salip, skor count-up, daun bergoyang
 *   3. finis: confetti saat pemimpin menyentuh garis
 *   4. podium: juara 3 → 2 → 1 loncat ke batang bambu, medali memantul
 * Frame balapan digerakkan lewat ref (tanpa re-render React per frame),
 * hanya transform/clip-path. prefers-reduced-motion → langsung tampil akhir.
 */

type LeaderRow = {
  rank: number;
  name: string;
  score: number;
  total: number;
  quizzes: number;
  avgSecondsPerQuestion: number | null;
  variants: string[];
};

type Phase = "idle" | "countdown" | "racing" | "podium" | "done";

const PANDA = "/panda-racer.webp";

const VARIANT_FLAG: Record<string, string> = { simplified: flagChina, traditional: flagTaiwan };

// 冠军 / 亚军 / 季军 — sekalian belajar kosakata juara 1–3.
// `order` = urutan loncat ke podium (juara 3 duluan, juara 1 terakhir).
const PODIUM = [
  { rank: 2, order: 2, hanzi: "亚军", pinyin: "yàjūn", height: "h-24 sm:h-28", medal: "bg-[#C9CDD3] text-[#4A4F57]" },
  { rank: 1, order: 3, hanzi: "冠军", pinyin: "guànjūn", height: "h-32 sm:h-40", medal: "bg-gold text-maroon-deep" },
  { rank: 3, order: 1, hanzi: "季军", pinyin: "jìjūn", height: "h-16 sm:h-20", medal: "bg-[#D29A6A] text-[#4E2A12]" },
] as const;

const COUNTDOWN = [
  { hanzi: "三", pinyin: "sān" },
  { hanzi: "二", pinyin: "èr" },
  { hanzi: "一", pinyin: "yī" },
  { hanzi: "开始!", pinyin: "kāishǐ" },
];

const T = {
  countStep: 450,
  afterGo: 400,
  raceBase: 1900, // juara 1 finis duluan, lalu tiap peringkat +110ms
  raceStep: 110,
  beforePodium: 350,
  podiumStep: 420,
  podiumSettle: 700,
};

const medalFor = (rank: number) => PODIUM.find((p) => p.rank === rank)?.medal;

type LeaderData = { leaderboard: LeaderRow[]; totalReaders: number };

async function fetchLeaderboard(): Promise<LeaderData> {
  const res = await fetch("/api/quiz?limit=10");
  if (!res.ok) throw new Error("leaderboard");
  const data = (await res.json()) as { leaderboard?: LeaderRow[]; totalReaders?: number };
  return { leaderboard: data.leaderboard ?? [], totalReaders: data.totalReaders ?? 0 };
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Angka semu-acak yang stabil per peserta (supaya gaya lari tiap panda konsisten). */
const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Profil kemajuan monoton 0→1 dengan kecepatan naik-turun:
 * f(τ) = τ + a·(sin(2πmτ+φ) − sin φ)/(2πm), turunannya 1 + a·cos(…) ≥ 0 karena |a| < 1.
 * Beda a/m/φ tiap panda → posisi saling salip di tengah, tapi tetap berakhir tepat di skornya.
 */
function makeProfile(i: number) {
  const a = 0.55 + seeded(i + 1) * 0.4;
  const m = seeded(i + 7) > 0.5 ? 2 : 1;
  const phi = seeded(i + 13) * Math.PI * 2;
  return (tau: number) => {
    const f = tau + (a * (Math.sin(2 * Math.PI * m * tau + phi) - Math.sin(phi))) / (2 * Math.PI * m);
    return Math.min(1, Math.max(0, f));
  };
}
const easeInOut = (x: number) => 0.5 - Math.cos(Math.PI * x) / 2;

/** Mulai saat lintasan masuk layar, sekali saja. */
function useVisibleOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);
  return { ref, visible };
}

// Confetti marun–emas–hijau bambu, posisi tetap supaya ringan
const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  dx: Math.round(-90 + seeded(i + 31) * 110),
  dy: Math.round(-80 + seeded(i + 41) * 50),
  r: Math.round(-200 + seeded(i + 51) * 400),
  color: ["hsl(var(--maroon))", "hsl(var(--gold))", "#8EAA66", "hsl(var(--hsk))"][i % 4],
  delay: Math.round(seeded(i + 61) * 120),
}));

const QuizLeaderboardSection = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-leaderboard-public"],
    queryFn: fetchLeaderboard,
    staleTime: 60_000,
    retry: 1,
  });
  const { ref: trackRef, visible } = useVisibleOnce<HTMLDivElement>();
  const [reduced] = useState(prefersReducedMotion);

  const [phase, setPhase] = useState<Phase>("idle");
  const [countStep, setCountStep] = useState(0);
  const [podiumStep, setPodiumStep] = useState(0);
  const [burst, setBurst] = useState(0); // >0 = tampilkan confetti (nilai = key untuk replay)

  const rows = (data?.leaderboard ?? []).slice(0, 10);
  const totalReaders = data?.totalReaders ?? 0;
  const leaderScore = Math.max(1, ...rows.map((r) => r.score));
  const byRank = new Map(rows.map((r) => [r.rank, r]));
  const targetPct = (r: LeaderRow) => Math.max(4, (r.score / leaderScore) * 100);

  // Ref DOM per lintasan — digerakkan langsung oleh requestAnimationFrame
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pandaRefs = useRef<(HTMLImageElement | null)[]>([]);
  const leafRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scoreRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const settled = phase === "podium" || phase === "done";

  const reset = useCallback(() => {
    pandaRefs.current.forEach((el) => el?.classList.remove("panda-run", "panda-land"));
    leafRefs.current.forEach((el) => el?.classList.remove("leaf-rustle"));
    setBurst(0);
    setPodiumStep(0);
    setCountStep(0);
    setPhase("idle");
  }, []);

  // Mulai otomatis saat terlihat dan data sudah ada
  useEffect(() => {
    if (phase !== "idle" || !visible || rows.length === 0) return;
    if (reduced) {
      setPodiumStep(3);
      setPhase("done");
    } else {
      setPhase("countdown");
    }
  }, [phase, visible, rows.length, reduced]);

  // 1) Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    const timers = COUNTDOWN.map((_, i) => setTimeout(() => setCountStep(i), i * T.countStep));
    timers.push(setTimeout(() => setPhase("racing"), (COUNTDOWN.length - 1) * T.countStep + T.afterGo));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // 2) Balapan — loop rAF
  useEffect(() => {
    if (phase !== "racing") return;
    const profiles = rows.map((_, i) => makeProfile(i));
    const targets = rows.map(targetPct);
    const durations = rows.map((r) => T.raceBase + (r.rank - 1) * T.raceStep);
    const leafPos = rows.map((_, i) => 25 + seeded(i + 91) * 45);
    const finished = rows.map(() => false);
    const leafDone = rows.map(() => false);

    pandaRefs.current.forEach((el) => {
      el?.classList.remove("panda-land");
      el?.classList.add("panda-run");
    });

    let raf = 0;
    let podiumTimer: ReturnType<typeof setTimeout> | undefined;
    const t0 = performance.now();

    const frame = (now: number) => {
      const elapsed = now - t0;
      let allDone = true;
      rows.forEach((r, i) => {
        const tau = Math.min(1, elapsed / durations[i]);
        const prog = easeInOut(profiles[i](tau));
        const pos = targets[i] * prog;

        const fill = fillRefs.current[i];
        if (fill) fill.style.clipPath = `inset(0 ${100 - pos}% 0 0 round 9999px)`;
        const runner = runnerRefs.current[i];
        if (runner) runner.style.transform = `translateX(${pos}%)`;
        const scoreNode = scoreRefs.current[i]?.firstChild;
        if (scoreNode) scoreNode.nodeValue = String(Math.round(r.score * prog));

        const leaf = leafRefs.current[i];
        if (leaf && !leafDone[i] && pos >= leafPos[i]) {
          leafDone[i] = true;
          leaf.classList.add("leaf-rustle");
        }

        if (tau >= 1 && !finished[i]) {
          finished[i] = true;
          const panda = pandaRefs.current[i];
          panda?.classList.remove("panda-run");
          panda?.classList.add("panda-land");
          if (i === 0) setBurst((b) => b + 1);
        }
        if (tau < 1) allDone = false;
      });

      if (allDone) {
        podiumTimer = setTimeout(() => setPhase("podium"), T.beforePodium);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (podiumTimer) clearTimeout(podiumTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // 4) Podium: juara 3 → 2 → 1
  useEffect(() => {
    if (phase !== "podium") return;
    const timers = [1, 2, 3].map((step, i) => setTimeout(() => setPodiumStep(step), i * T.podiumStep));
    timers.push(setTimeout(() => setPhase("done"), 2 * T.podiumStep + T.podiumSettle));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Jangan merusak beranda kalau API sedang bermasalah.
  if (isError) return null;

  return (
    <section id="leaderboard" className="section relative overflow-hidden !pt-6 md:!pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          char="竹"
          className="max-w-3xl"
          title="Balapan Bambu"
          lead={<>Yuk, ikutan <em>Bamboo Race</em> untuk buktikan kemampuan Mandarin dalam series e-book Rahasia Huruf Mandarin!{totalReaders > 0 && <span className="mt-1 block text-xs text-muted-foreground">Top {rows.length} dari {totalReaders} pembaca</span>}</>}
        />


        <div className="reveal mx-auto mt-8 max-w-6xl rounded-[2rem] border border-border/80 bg-card p-5 shadow-soft sm:p-8">
          <p className="mx-auto mb-6 w-fit rounded-full border border-maroon/25 bg-maroon/5 px-4 py-1.5 text-center text-sm font-bold text-maroon">
            🏁 Balapan dimulai 1 November 2026
          </p>
          {/* Desktop: podium kiri, lintasan kanan (hemat tempat). HP: tetap tumpuk. */}
          <div className="lg:grid lg:grid-cols-[22rem_1fr] lg:items-center lg:gap-10">
          {/* Podium tiga besar: potongan batang bambu */}
          <div className="mx-auto grid max-w-xl grid-cols-3 items-end gap-3 sm:gap-6">
            {PODIUM.map((slot) => {
              const row = byRank.get(slot.rank);
              const shown = !!row && podiumStep >= slot.order;
              const animate = shown && !reduced;
              return (
                <div key={slot.rank} className="flex min-w-0 flex-col items-center overflow-hidden">
                  <div className="relative z-10 mb-[-6px]">
                    {/* bayangan panda: kursi menunggu juaranya */}
                    <img
                      src={PANDA}
                      alt=""
                      width={192}
                      height={163}
                      className={cn(
                        "h-auto opacity-15 grayscale",
                        slot.rank === 1 ? "w-20 sm:w-24" : "w-14 sm:w-[4.5rem]",
                        shown && "invisible"
                      )}
                    />
                    {shown && (
                      <div key={`p-${burst}`} className={cn("absolute inset-0", animate && "podium-jump")}>
                        <img src={PANDA} alt="" width={192} height={163} className="h-auto w-full drop-shadow-sm" />
                        <span
                          className={cn(
                            "absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card text-sm font-extrabold shadow-sm",
                            slot.medal,
                            animate && "medal-pop"
                          )}
                        >
                          {slot.rank}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "bamboo-stump flex w-full flex-col items-center justify-center rounded-t-[0.9rem]",
                      slot.height,
                      slot.rank === 1 && shown && !reduced && "stump-glow"
                    )}
                  >
                    <span className="font-hanzi text-base font-bold leading-none text-white [text-shadow:0_1px_2px_rgba(40,55,25,.55)] sm:text-xl">
                      {slot.hanzi}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold text-white [text-shadow:0_1px_1px_rgba(40,55,25,.5)] sm:text-xs">
                      {slot.pinyin}
                    </span>
                  </div>
                  <div className="mt-3 min-h-[2.75rem] w-full min-w-0 overflow-hidden text-center">
                    {isLoading ? (
                      <span className="mx-auto block h-4 w-16 animate-pulse rounded bg-muted" />
                    ) : shown ? (
                      <div className={cn("min-w-0", animate && "podium-label")}>
                        <p className="line-clamp-2 text-[11px] font-bold leading-tight text-ink sm:text-sm">{row.name}</p>
                        <div className="mt-0.5 flex justify-center gap-1">{row.variants?.map((v) => VARIANT_FLAG[v] ? <img key={v} src={VARIANT_FLAG[v]} alt={v} className="h-3 w-3 rounded-full object-cover" /> : null)}</div>
                        <p className="text-[10px] font-semibold text-maroon sm:text-sm">{row.score} poin</p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">{row ? "Menunggu juara…" : "Kursi kosong"}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lintasan top 10 */}
          <div ref={trackRef} className="mt-10 border-t border-border pt-6 lg:mt-0 lg:border-t-0 lg:pt-0">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-bold text-ink sm:text-xl">Lintasan 10 besar</h3>
              <span className="text-xs text-muted-foreground sm:text-sm">Garis finis = skor pemimpin</span>
            </div>

            {isLoading ? (
              <ol className="space-y-4" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="h-10 animate-pulse rounded-full bg-muted/70" />
                ))}
              </ol>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
                <div className="flex -space-x-3">
                  {[0, 1, 2].map((i) => (
                    <img key={i} src={PANDA} alt="" className="w-12 opacity-40" />
                  ))}
                </div>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Para panda masih menunggu di garis start. Selesaikan kuis di dalam e-book dan jadilah pembalap pertama.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Countdown 三 二 一 开始! */}
                {phase === "countdown" && (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center sm:top-10">
                    <div
                      key={countStep}
                      className="count-pop mizige flex min-h-24 min-w-24 flex-col items-center justify-center rounded-2xl border border-hsk/40 px-5 shadow-lift"
                    >
                      <span className="font-hanzi text-5xl font-bold leading-none text-maroon">{COUNTDOWN[countStep].hanzi}</span>
                      <span className="mt-1.5 text-xs font-semibold text-muted-foreground">{COUNTDOWN[countStep].pinyin}</span>
                    </div>
                  </div>
                )}

                <ol className={cn("space-y-3 transition-opacity duration-300 sm:space-y-2.5", phase === "countdown" && "opacity-60")}>
                  {rows.map((r, i) => {
                    const final = settled ? targetPct(r) : 0;
                    const medal = medalFor(r.rank);
                    return (
                      <li
                        key={`${r.rank}-${r.name}`}
                        className="grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[2rem_8.5rem_1fr_4.75rem]"
                      >
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full text-sm font-extrabold",
                            medal ?? "bg-secondary text-muted-foreground"
                          )}
                        >
                          {r.rank}
                        </span>
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-ink">{r.name}</span>
                          {r.variants?.map((v) => VARIANT_FLAG[v] ? <img key={v} src={VARIANT_FLAG[v]} alt={v} className="h-3.5 w-3.5 shrink-0 rounded-full object-cover" /> : null)}
                        </span>

                        {/* batang bambu + panda */}
                        <div
                          className="bamboo-lane relative col-span-3 h-7 sm:col-span-1"
                          role="img"
                          aria-label={`${r.name}: ${r.score} poin dari ${r.quizzes} kuis`}
                        >
                          <span aria-hidden className="bamboo-start" />
                          <span aria-hidden className="bamboo-finish" />
                          <div className="absolute inset-y-0 left-4 right-5">
                            <div
                              ref={(el) => (fillRefs.current[i] = el)}
                              className="bamboo-fill absolute inset-0"
                              style={{ clipPath: `inset(0 ${100 - final}% 0 0 round 9999px)` }}
                            />
                            <span
                              ref={(el) => (leafRefs.current[i] = el)}
                              aria-hidden
                              className="bamboo-leaf"
                              style={{ left: `${25 + seeded(i + 91) * 45}%` }}
                            />
                            <div
                              ref={(el) => (runnerRefs.current[i] = el)}
                              className="pointer-events-none absolute inset-0"
                              style={{ transform: `translateX(${final}%)` }}
                            >
                              <div className="absolute left-0 top-1/2 w-10 -translate-x-[60%] -translate-y-1/2">
                                <img
                                  ref={(el) => (pandaRefs.current[i] = el)}
                                  src={PANDA}
                                  alt=""
                                  width={192}
                                  height={163}
                                  className="h-auto w-full origin-bottom drop-shadow"
                                />
                              </div>
                            </div>
                          </div>

                          {/* confetti di garis finis saat pemimpin tiba */}
                          {i === 0 && burst > 0 && !reduced && (
                            <div key={burst} aria-hidden className="pointer-events-none absolute right-1 top-1/2 z-10">
                              {CONFETTI.map((c, k) => (
                                <span
                                  key={k}
                                  className="confetti-bit"
                                  style={
                                    {
                                      background: c.color,
                                      animationDelay: `${c.delay}ms`,
                                      "--dx": `${c.dx}px`,
                                      "--dy": `${c.dy}px`,
                                      "--r": `${c.r}deg`,
                                    } as React.CSSProperties
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="col-start-3 row-start-1 text-right sm:col-start-auto sm:row-start-auto">
                          <span ref={(el) => (scoreRefs.current[i] = el)} className="block text-sm font-extrabold tabular-nums text-maroon">
                            {settled ? r.score : 0}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {r.quizzes} kuis{r.avgSecondsPerQuestion != null ? ` · ${r.avgSecondsPerQuestion}s/soal` : ""}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>

          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-secondary/60 p-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              <strong className="text-ink">Objektif balapan:</strong> peringkat dihitung dari jumlah jawaban benar di seluruh kuis e-book; bila seri, pemenang ditentukan dari rata-rata waktu tercepat per soal. Skor diambil dari nilai terbaik tiap kuis.
            </p>
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
              {phase === "done" && !reduced && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-maroon/30 bg-card px-5 text-sm font-bold text-maroon transition-colors hover:border-maroon/60 hover:bg-maroon/5"
                >
                  <RotateCcw className="size-4" />
                  Ulangi balapan
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/store")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-maroon px-6 text-sm font-bold text-white transition-colors hover:bg-maroon-deep"
              >
                Ikut balapan lewat e-book
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizLeaderboardSection;
