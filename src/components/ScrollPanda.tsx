import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import panda from "@/assets/scroll-panda.webp";

/**
 * Panda mascot that scrolls down the page with you — a flowy motion-graphics
 * companion. Memory/bandwidth-mindful: one tiny webp (~5KB), a single passive
 * scroll listener throttled with requestAnimationFrame, transform-only (no
 * layout/paint), no React re-renders per frame. Hidden on mobile and when the
 * user prefers reduced motion. Skipped on the reader/admin views.
 */
export default function ScrollPanda() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const hidden = pathname.startsWith("/read") || pathname.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max)); // 0..1 page progress
      const travel = window.innerHeight - 180; // keep the panda inside the viewport
      const y = p * travel;
      const sway = Math.sin(p * Math.PI * 4) * 16; // gentle flowy drift
      const rot = Math.sin(p * Math.PI * 4) * 7;
      el.style.transform = `translate3d(${sway}px, ${y}px, 0) rotate(${rot}deg)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-1 top-2 z-30 hidden w-20 drop-shadow-md will-change-transform lg:block"
    >
      <div ref={ref} className="will-change-transform">
        <img src={panda} alt="" className="w-full animate-[chat-wave_6s_ease-in-out_infinite] select-none" />
      </div>
    </div>
  );
}
