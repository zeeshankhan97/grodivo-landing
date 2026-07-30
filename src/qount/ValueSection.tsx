import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EASE, useCalm } from "./motion";
import logoIcon from "../assets/photos/logo-icon.png";

/**
 * "Measure what your strategy can't see" — white value section under the logo
 * band, laid out like the reference: eyebrow + H2 left, paragraph + CTA right,
 * then three light cards whose artworks animate on scroll:
 *   1. Accelerate Execution   — node → chips → task-list flow
 *   2. Quantify the Alignment Tax — stat card + drawing area chart
 *   3. De-risk Transformation — trust gauge sweeping amber → lime
 */

const VIEWPORT = { once: true, amount: 0.35 } as const;

function Diamond({ size = 22, color = "#00297b" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="6.2"
        y="6.2"
        width="11.6"
        height="11.6"
        transform="rotate(45 12 12)"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <rect
        x="9.9"
        y="9.9"
        width="4.2"
        height="4.2"
        transform="rotate(45 12 12)"
        fill={color}
      />
    </svg>
  );
}

/* Count-up that waits for the viewport, honoring calm mode. */
function Ticker({ to, prefix = "$", suffix = "k" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm) {
      el.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => c.stop();
  }, [inView, calm, to, prefix, suffix]);
  return <span ref={ref}>{calm ? `${prefix}${to}${suffix}` : `${prefix}0${suffix}`}</span>;
}

/* ---------------- card 1 — flow artwork ---------------- */

function FlowArt() {
  const calm = useCalm();
  const draw = {
    initial: calm ? false : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: VIEWPORT,
  };
  const pop = (delay: number) => ({
    initial: calm ? false : { opacity: 0, scale: 0.9, y: 8 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: VIEWPORT,
    transition: { duration: 0.55, ease: EASE, delay },
  });
  const rows = [
    { title: "Owner sync", time: "10:00 AM", bar: "#00297b" },
    { title: "Gap review", time: "01:00 PM", bar: "#9ecbf2" },
    { title: "Alignment pulse", time: "03:30 PM - 04:00 PM", bar: "#b5d334" },
  ];
  return (
    <div className="relative mt-7 h-[270px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 340 270"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          {...draw}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          d="M64 128C92 128 92 62 116 62"
          stroke="#d4d4d0"
          strokeWidth="1.5"
        />
        <motion.path
          {...draw}
          transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          d="M64 148C96 148 96 212 116 212"
          stroke="#d4d4d0"
          strokeWidth="1.5"
        />
        <motion.path
          {...draw}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          d="M64 138C118 138 124 138 170 138"
          stroke="#d4d4d0"
          strokeWidth="1.5"
        />
      </svg>

      {/* TAP node — the brand icon on a navy tile, breathing with a ping ring */}
      <motion.div
        {...pop(0)}
        className="absolute left-0 top-1/2 flex h-[58px] w-[58px] -translate-y-1/2 items-center justify-center rounded-2xl bg-[#00297b] shadow-[0_10px_28px_rgba(0,41,123,0.35)]"
      >
        <motion.span
          animate={calm ? undefined : { scale: [1, 1.4], opacity: [0.45, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-2xl border-2 border-[#00297b]"
        />
        <motion.img
          src={logoIcon}
          alt=""
          className="w-[30px]"
          animate={calm ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        {...pop(0.35)}
        className="absolute left-[30%] top-[4%] flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.09)]"
      >
        <Diamond size={16} />
        <span className="text-[13px] text-[#111]">
          <span className="font-semibold">Align roadmap owners</span>
          <span className="block text-[#7a7a76]">across 4 teams?</span>
        </span>
      </motion.div>

      <motion.div
        {...pop(0.5)}
        className="absolute bottom-[4%] left-[28%] flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.09)]"
      >
        <Diamond size={16} />
        <span className="text-[13px] text-[#111]">
          <span className="text-[#7a7a76]">Generate</span>
          <span className="block font-semibold">Alignment Recap</span>
        </span>
      </motion.div>

      {/* task list */}
      <motion.div
        {...pop(0.65)}
        className="absolute right-0 top-[10%] w-[46%] rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(0,0,0,0.1)]"
      >
        {rows.map(({ title, time, bar }, i) => (
          <motion.div
            key={title}
            initial={calm ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: 0.75 + i * 0.12 }}
            className={`flex gap-2.5 ${i > 0 ? "mt-3.5" : ""}`}
          >
            <span
              className="w-[3px] self-stretch rounded-full"
              style={{ backgroundColor: bar }}
            />
            <span>
              <span className="block text-[14px] font-semibold leading-tight text-[#111]">
                {title}
              </span>
              <span className="mt-0.5 block text-[12px] text-[#8a8a86]">
                {time}
              </span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- card 2 — tax artwork ---------------- */

function TaxArt() {
  const calm = useCalm();
  return (
    <div className="relative mt-7 h-[270px]">
      {/* app panel */}
      <motion.div
        initial={calm ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-x-2 bottom-0 top-3 overflow-hidden rounded-t-2xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="flex items-center gap-2">
            <Diamond size={20} />
            <span className="text-[16px] font-bold tracking-[-0.01em] text-[#111]">
              TAP
            </span>
          </span>
          <span className="flex gap-2">
            <span className="h-2.5 w-14 rounded-full bg-[#ececea]" />
            <span className="h-2.5 w-9 rounded-full bg-[#ececea]" />
          </span>
        </div>
        {/* area chart */}
        <svg
          className="absolute bottom-0 left-0 h-[46%] w-full"
          viewBox="0 0 340 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            initial={calm ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            d="M0 92L55 68L105 84L160 44L215 66L265 28L340 52L340 120L0 120Z"
            fill="#dae6fa"
          />
          <motion.path
            initial={calm ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
            d="M0 92L55 68L105 84L160 44L215 66L265 28L340 52"
            stroke="#6d96e0"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* data-point readouts so the chart reads as real numbers */}
        <div className="absolute bottom-0 left-0 h-[46%] w-full" aria-hidden="true">
          {[
            { x: "16%", y: "57%", v: "$120k", neg: false },
            { x: "47%", y: "37%", v: "$185k", neg: false },
            { x: "78%", y: "23%", v: "-$310k", neg: true },
          ].map(({ x, y, v, neg }, i) => (
            <motion.span
              key={v}
              initial={calm ? false : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EASE, delay: 0.9 + i * 0.15 }}
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: x, top: y }}
            >
              <span
                className={`block rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.12)] ${
                  neg ? "text-[#e0764f]" : "text-[#444]"
                }`}
              >
                {v}
              </span>
              <span className="mt-1 block h-[7px] w-[7px] rounded-full bg-[#6d96e0] ring-2 ring-white" />
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* floating stat card */}
      <motion.div
        initial={calm ? false : { opacity: 0, y: 18, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
        className="absolute left-0 top-[26%] rounded-2xl bg-white p-4 shadow-[0_18px_44px_rgba(0,0,0,0.14)]"
      >
        <p className="text-[12.5px] text-[#6f6f6b]">Quarterly alignment tax</p>
        <p className="mt-1 flex items-baseline gap-1.5 text-[27px] font-bold tracking-[-0.02em] text-[#e0764f]">
          <Ticker to={310} prefix="-$" />
          <span className="text-[13px] font-semibold text-[#e0764f]">▲</span>
        </p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#f1f5d8] px-2 py-1 text-[11px] font-medium text-[#3a3a10]">
          <ArrowUpRight size={11} strokeWidth={2.5} /> $480k recoverable
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------- card 3 — trust gauge artwork ---------------- */

function GaugeArt() {
  const calm = useCalm();
  return (
    <div className="relative mt-7 h-[270px]">
      <motion.div
        initial={calm ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-x-3 bottom-3 top-3 flex flex-col items-center justify-center rounded-2xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.1)]"
      >
        <div className="relative">
          <svg width="210" height="122" viewBox="0 0 210 122" aria-hidden="true">
            <defs>
              <linearGradient id="vs-gauge" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#f0997b" />
                <stop offset="55%" stopColor="#e8d75a" />
                <stop offset="100%" stopColor="#b5d334" />
              </linearGradient>
            </defs>
            {/* tick ring so the dial reads as a calibrated instrument */}
            {Array.from({ length: 11 }, (_, i) => {
              const a = Math.PI - (i * Math.PI) / 10;
              const major = i % 5 === 0;
              const r1 = major ? 90 : 92;
              return (
                <line
                  key={i}
                  x1={105 + r1 * Math.cos(a)}
                  y1={112 - r1 * Math.sin(a)}
                  x2={105 + 98 * Math.cos(a)}
                  y2={112 - 98 * Math.sin(a)}
                  stroke="#d8d8d4"
                  strokeWidth={major ? 2 : 1.2}
                />
              );
            })}
            <text x="18" y="121" fontSize="9" fill="#a0a09a">
              0
            </text>
            <text x="178" y="121" fontSize="9" fill="#a0a09a">
              100
            </text>
            <path
              d="M25 112A80 80 0 0 1 185 112"
              stroke="#efefec"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              initial={calm ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 0.78 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              d="M25 112A80 80 0 0 1 185 112"
              stroke="url(#vs-gauge)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* needle sweeps from the amber zone into lime, then keeps a live
                wobble so the gauge is always working */}
            <motion.g
              style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
              initial={calm ? false : { rotate: -96 }}
              whileInView={{ rotate: 40 }}
              viewport={VIEWPORT}
              transition={{
                type: "spring",
                stiffness: 55,
                damping: 11,
                delay: 0.45,
              }}
            >
              <motion.g
                style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
                animate={
                  calm ? undefined : { rotate: [0, 3.5, -2.5, 1.5, 0] }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <path
                  d="M105 112L105 44"
                  stroke="#111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="105" cy="112" r="7" fill="#111" />
              </motion.g>
            </motion.g>
          </svg>
          {/* live readout inside the dial */}
          <span className="pointer-events-none absolute inset-x-0 bottom-[38px] text-center text-[24px] font-bold tracking-[-0.02em] text-[#111]">
            <Ticker to={72} prefix="" suffix="" />
          </span>
        </div>
        <p className="mt-2 text-[13px] text-[#8a8a86]">Trust index</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#e3f5d8] px-2 py-1 text-[11.5px] font-medium text-[#1e3a10]">
          <ArrowUpRight size={11} strokeWidth={2.5} /> +8% after culture reset
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------- section ---------------- */

const CARDS = [
  {
    title: "Accelerate Execution",
    sub: "Close the gap between strategy and daily reality, so change moves at the speed you planned for.",
    Art: FlowArt,
  },
  {
    title: "Quantify the Alignment Tax",
    sub: "Put a number on margin erosion and revenue-per-employee volatility before it becomes attrition cost.",
    Art: TaxArt,
  },
  {
    title: "De-risk Transformation",
    sub: "Spot trust gaps and alignment fractures early and protect your synergies before integration slips.",
    Art: GaugeArt,
  },
];

export function ValueSection() {
  const calm = useCalm();
  const rise = (delay = 0) => ({
    initial: calm ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1640px] px-6 pb-24 pt-4 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div {...rise(0)}>
            <h2 className="max-w-[560px] text-[clamp(1.9rem,2.9vw,2.85rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#111]">
              Measure what your strategy can't see.
            </h2>
          </motion.div>
          <motion.div {...rise(0.15)} className="max-w-[540px]">
            <p className="text-[15.5px] leading-[1.65] text-[#6b6b6b]">
              Misalignment doesn't show on an org chart — it shows up in the
              P&amp;L, in stalled projects, and in quiet exits. TAP turns that
              invisible friction into decision-grade data.
            </p>
            <motion.a
              href="#"
              whileHover={calm ? undefined : { y: -2 }}
              whileTap={calm ? undefined : { scale: 0.97 }}
              className="group mt-5 inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#111] px-5 py-2.5 text-[15px] font-medium text-[#111] transition-colors duration-200 hover:bg-black/[0.05]"
            >
              See how alignment works
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </motion.a>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {CARDS.map(({ title, sub, Art }, i) => (
            <motion.div
              key={title}
              {...rise(0.1 + i * 0.12)}
              className="rounded-[20px] border border-[#ececea] bg-[#f5f5f3] p-7"
            >
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-[#111]">
                {title}
              </h3>
              <p className="mt-2 max-w-[400px] text-[14px] leading-[1.6] text-[#6f6f6b]">
                {sub}
              </p>
              <Art />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
