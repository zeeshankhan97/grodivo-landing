import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { EASE, useCalm } from "./motion";

type Props = {
  to: number;
  delay?: number;
  duration?: number;
  /** Optional formatter, e.g. clock or percent readouts. */
  format?: (v: number) => string;
};

/**
 * Imperative count-up written straight to the DOM node so React never
 * re-renders 60×/s. Falls back to the final value under reduced motion.
 */
export function CountUp({
  to,
  delay = 0,
  duration = 1.4,
  format = (v) => String(Math.round(v)),
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useCalm();

  /* Read the formatter through a ref so an inline lambda doesn't retrigger the
     effect on re-render — that would replay the whole delay and reset the
     readout to 0 (visible after e.g. a window resize). */
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = formatRef.current(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = formatRef.current(v);
      },
    });
    return () => controls.stop();
  }, [to, delay, duration, reduce]);

  return <span ref={ref}>{format(0)}</span>;
}
