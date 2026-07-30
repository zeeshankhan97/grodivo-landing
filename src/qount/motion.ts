import type { Transition } from "framer-motion";
import { useReducedMotion } from "framer-motion";

/* One easing voice for the whole page — a soft exponential-out that reads as
   "expensive product site", never bouncy unless a spring is explicitly asked for. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SPRING: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/* Shared entrance used by cards: rise + fade, delay injected per-instance. */
export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export const riseX = (delay = 0) => ({
  initial: { opacity: 0, x: -22 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.65, ease: EASE, delay },
});

/**
 * True when the page should render finished with no animation: the user asked
 * for reduced motion, or `?static` is in the URL (same convention as the
 * original ApparatusArt — screenshots and previews must never depend on the
 * animation loop running).
 */
export function useCalm(): boolean {
  const reduce = useReducedMotion();
  return (
    Boolean(reduce) ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("static"))
  );
}
