import { useState } from "react";

/**
 * Decides whether an entrance animation may run at all.
 *
 * Returns `"hidden"` (play the entrance) only when the document is actually
 * visible at mount and nothing asked for a static render. In every other case
 * — background tab, prerender, `?static`, reduced motion — returns `false`,
 * which tells framer-motion to render the final state immediately.
 *
 * Rule this enforces: nothing on the page may depend on an animation in order
 * to be seen.
 */
export function useEntranceGate(): "hidden" | false {
  const [gate] = useState<"hidden" | false>(() => {
    if (typeof document === "undefined") return false;
    if (document.visibilityState !== "visible") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    if (new URLSearchParams(window.location.search).has("static")) return false;
    return "hidden";
  });
  return gate;
}

/** Shared check for imperative (GSAP) animation code. */
export const isStaticRender = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  new URLSearchParams(window.location.search).has("static");
