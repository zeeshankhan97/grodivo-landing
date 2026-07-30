import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Releases the `.a-onscroll` idle state once an element enters the viewport.
 * Fires once, then disconnects — nothing re-animates on scroll-back.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);

    // Safety net: content must never be trapped at opacity 0. If the observer
    // has not fired by now — backgrounded tab, restored scroll position, an
    // engine that throttles callbacks — reveal it anyway.
    const failsafe = window.setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return { ref, shown };
}

/**
 * Counts a readout up to its final value. A measurement should arrive by
 * settling, not by appearing — this is the only number animation on the page.
 */
export function useCountUp(target: number, duration = 1200, delay = 500) {
  const [value, setValue] = useState(reducedMotion() ? target : 0);

  useEffect(() => {
    // A hidden tab never services rAF, which would strand the readout partway
    // and display a wrong measurement. Skip straight to the true value.
    if (reducedMotion() || document.hidden) {
      setValue(target);
      return;
    }

    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // Matches --ease-instrument closely enough for a numeric settle.
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Number((target * eased).toFixed(1)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    // Guarantee the final value on a timer as well as on rAF. If the tab is
    // backgrounded mid-count the frames stop, but this still lands the number.
    const settle = window.setTimeout(
      () => setValue(target),
      delay + duration + 80,
    );

    const onVisible = () => {
      if (!document.hidden) setValue(target);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [target, duration, delay]);

  return value;
}
