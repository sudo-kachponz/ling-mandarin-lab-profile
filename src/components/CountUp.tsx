import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from 0 when it scrolls into view. Keeps any non-numeric
 * prefix/suffix (e.g. "400K+", "100+", "14"). Dep-free; respects reduced-motion.
 */
export default function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const m = value.match(/^(\D*)(\d[\d.,]*)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(m ? `${m[1]}0${m[3]}` : value);

  useEffect(() => {
    if (!m) return;
    const el = ref.current;
    if (!el) return;
    const prefix = m[1];
    const target = parseInt(m[2].replace(/[.,]/g, ""), 10);
    const suffix = m[3];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const run = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(`${prefix}${Math.round(target * eased).toLocaleString("id-ID")}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          raf = requestAnimationFrame(run);
          io.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
