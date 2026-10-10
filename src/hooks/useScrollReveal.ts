import { useEffect } from "react";

/**
 * Scroll-triggered motion for anything with the `.reveal` class.
 *
 * One IntersectionObserver reveals elements as they scroll into view; a
 * MutationObserver re-scans when route changes mount new nodes. Dep-free
 * (no framer-motion) and respects prefers-reduced-motion by showing everything
 * immediately. Call once at the app root.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
        if (reduce) el.classList.add("is-visible");
        else io.observe(el);
      });
    };

    scan();
    // Catch sections mounted after navigation.
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
