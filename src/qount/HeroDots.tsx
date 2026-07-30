import { useEffect, useRef } from "react";
import { useCalm } from "./motion";

/**
 * Cursor-spotlight halftone for the hero: a grid of tiny white dots that only
 * appear inside a soft spotlight around the pointer, shimmering on a slow
 * noise field as it moves. Nothing renders while the pointer is away, so the
 * copy always sits on clean navy. Calm mode paints one faint static spot.
 */
export function HeroDots({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const calm = useCalm();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * DPR;
      canvas.height = canvas.clientHeight * DPR;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Deterministic pseudo-noise from layered sines — no per-frame allocation. */
    const noise = (x: number, y: number, t: number) =>
      0.5 +
      0.28 * Math.sin(x * 0.09 + t * 0.7 + Math.sin(y * 0.11 + t * 0.4)) +
      0.22 * Math.sin(y * 0.13 - t * 0.5 + Math.sin(x * 0.07 + t * 0.3));

    const GAP = 13;
    const SIGMA = 120; // spotlight radius (soft gaussian falloff)

    /* Pointer state: target follows the mouse, spot lerps toward it so the
       light trails the cursor; intensity eases in/out on enter/leave. */
    const spot = { x: 0, y: 0, tx: 0, ty: 0, on: 0, want: 0 };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const inX = e.clientX >= r.left - 60 && e.clientX <= r.right + 60;
      const inY = e.clientY >= r.top - 60 && e.clientY <= r.bottom + 60;
      if (inX && inY) {
        spot.tx = e.clientX - r.left;
        spot.ty = e.clientY - r.top;
        if (spot.want === 0) {
          spot.x = spot.tx;
          spot.y = spot.ty;
        }
        spot.want = 1;
      } else {
        spot.want = 0;
      }
    };
    const onLeave = () => {
      spot.want = 0;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    const draw = (tms: number) => {
      const t = tms / 1000;
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (spot.on <= 0.01) return;
      ctx.fillStyle = "#fff";
      const s2 = 2 * SIGMA * SIGMA;
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - spot.x;
          const dy = y - spot.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > s2 * 4.5) continue;
          const mask = Math.exp(-d2 / s2);
          const a = noise(x / GAP, y / GAP, t) * mask * spot.on;
          if (a <= 0.03) continue;
          /* radius capped tiny — the field reads as fine grain, never blobs */
          ctx.globalAlpha = Math.min(0.75, a);
          ctx.beginPath();
          ctx.arc(x, y, 0.5 + 0.9 * Math.min(1, a), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    if (calm) {
      /* one faint static spot so the texture exists in stills */
      spot.x = canvas.clientWidth * 0.42;
      spot.y = canvas.clientHeight * 0.38;
      spot.on = 0.5;
      draw(4000);
      return () => {
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onLeave);
      };
    }

    let raf = 0;
    const loop = (t: number) => {
      spot.on += (spot.want - spot.on) * 0.08;
      spot.x += (spot.tx - spot.x) * 0.14;
      spot.y += (spot.ty - spot.y) * 0.14;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [calm]);

  /* A canvas is a replaced element — top/bottom insets don't stretch it the
     way they stretch a div, so the div carries the positioning and the canvas
     fills it. */
  return (
    <div className={className} aria-hidden="true">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
