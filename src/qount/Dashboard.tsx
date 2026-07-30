import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { CodeXml, ExternalLink } from "lucide-react";
import { CountUp } from "./CountUp";
import { EASE, SPRING, useCalm } from "./motion";

/**
 * Hero artwork, per the reference: internal + external data sources feed a
 * glowing hub node, which resolves into a relationship-risk read on the right —
 * risk card, Team/Level/Individual facts, a typing AI analysis, and three lime
 * outcome metrics. Framer Motion drives entrances and springs; GSAP drives the
 * conduit flow and the typewriter.
 *
 * The composition is authored at a fixed size, then uniformly scaled to fit
 * whatever column it lands in — connector coordinates stay hand-tunable px.
 */
const W = 880;
const H = 730;
const LIME = "#d6f462";

function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / designWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);
  return { ref, scale };
}

/* ------------------------------- shared bits ------------------------------ */

const cardBase =
  "rounded-2xl border border-white/[0.09] transition-colors duration-300 hover:border-white/[0.2]";
/* Card surfaces are lifted shades of the #00297B page navy, never gray. */
const cardBg = {
  background: "linear-gradient(180deg, #0d3f9f 0%, #062e80 100%)",
};

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-2.5 text-[14px] text-[#8fa6d9]">{children}</p>;
}

function Checkbox({ dim = false }: { dim?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="15"
        height="15"
        rx="3"
        fill="none"
        stroke={LIME}
        strokeWidth="1.8"
        opacity={dim ? 0.5 : 1}
      />
    </svg>
  );
}

/* ------------------------- left column: data sources ---------------------- */

const SOURCES = [
  {
    label: "Internal data",
    items: [
      { name: "Culture docs", dim: false },
      { name: "Assessments", dim: false },
      { name: "Strategy docs", dim: true },
    ],
  },
  {
    label: "External data",
    items: [
      { name: "Market data", dim: false },
      { name: "Analyst reports", dim: false },
      { name: "LinkedIn", dim: true },
    ],
  },
];

function SourceColumn() {
  const reduce = useCalm();
  let i = 0;
  return (
    <div className="w-[230px] shrink-0 self-center">
      {SOURCES.map(({ label, items }, s) => (
        <div key={label} className={s > 0 ? "mt-6" : undefined}>
          <SectionLabel>{label}</SectionLabel>
          <div className="flex flex-col gap-3">
            {items.map(({ name, dim }) => {
              const delay = 0.5 + i++ * 0.09;
              return (
                <motion.div
                  key={name}
                  initial={reduce ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: dim ? 0.45 : 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay }}
                  whileHover={reduce || dim ? undefined : { y: -3 }}
                  className={`${cardBase} flex h-[56px] items-center gap-3 px-4`}
                  style={cardBg}
                >
                  <Checkbox dim={dim} />
                  <span
                    className={`text-[15px] font-medium ${
                      dim ? "text-[#8fa6d9]" : "text-[#ededed]"
                    }`}
                  >
                    {name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- center hub node ---------------------------- */

function Hub() {
  const reduce = useCalm();
  const host = useRef<HTMLDivElement>(null);

  /* GSAP owns the conduit flow: dashes march along the arc continuously. */
  useEffect(() => {
    const el = host.current;
    if (!el || reduce) return;
    const ctx = gsap.context(() => {
      gsap.to(".q-arc", {
        strokeDashoffset: -44,
        duration: 3.2,
        ease: "none",
        repeat: -1,
      });
    }, el);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <motion.div
      ref={host}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 1.1 }}
      className="relative w-[110px] shrink-0"
      aria-hidden="true"
    >
      <svg
        width="110"
        height={H}
        className="absolute inset-0"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {/* Source arc: sweeps from the top sources, behind the hub, back to
            the bottom sources. */}
        <path
          className="q-arc"
          d="M 8 170 C 72 240, 72 490, 8 560"
          stroke="#4b6cb8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 8"
        />
        {/* Stub: hub → the read on the right. */}
        <path
          className="q-arc"
          d="M 70 365 H 110"
          stroke="#4b6cb8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 8"
        />
      </svg>

      {/* The hub: white tile, indigo mark, soft glow — the one non-navy accent,
          kept from the reference so the node reads as "the engine". */}
      <motion.div
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING, delay: 1.3 }}
        className="absolute left-[26px] top-[336px] flex h-[58px] w-[58px] items-center justify-center rounded-[16px] bg-white"
        style={{ boxShadow: "0 0 0 5px rgba(147,197,253,0.35), 0 0 34px rgba(99,102,241,0.55)" }}
      >
        <motion.span
          animate={reduce ? undefined : { scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-[16px] border border-[#93c5fd]"
        />
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#5b5bd6]">
          <CodeXml size={20} className="text-white" />
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------- white relationship card ------------------------ */

/* The status chip cycles through the workflow states. Colors are semantic on
   the white card: rising friction reads soft red, the follow-up state neutral
   warm gray, so the swap itself carries meaning. */
const STATUSES = [
  { label: "Friction rising", bg: "#fdecea", border: "#f5cfc9", text: "#b42318" },
  { label: "Action required", bg: "#f2f1ef", border: "#e5e3df", text: "#3f3f3f" },
];

function RiskCard() {
  const reduce = useCalm();

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    /* Hold the cycle while the tab is hidden — otherwise exits queue up and
       overlap when the user comes back. */
    const id = setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, 3200);
    return () => clearInterval(id);
  }, [reduce]);
  const status = STATUSES[tick % STATUSES.length];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 34, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay: 0.85 }}
      className="relative"
    >
      {/* stacked card peeking above */}
      <div className="absolute -top-[10px] left-5 right-5 h-6 rounded-t-2xl bg-[#4c68b4]" />
      {/* next card peeking off the right edge */}
      <div className="absolute -right-7 top-2 bottom-2 w-5 rounded-l-2xl bg-white/95" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="relative rounded-2xl bg-white p-5 text-[#111] shadow-[0_24px_60px_rgba(0,13,51,0.55)]"
      >
        <div className="flex items-start justify-between">
          <span className="flex items-center gap-2 rounded-md bg-[#e9fab4] px-2.5 py-1.5 text-[14px]">
            <span className="font-semibold tabular-nums">
              <CountUp to={82} delay={1.3} duration={1.2} />
            </span>
            <span className="text-[#2c2c2c]">Relationship Risk</span>
          </span>
          <span className="rounded-md bg-[#f1f1f1] px-2.5 py-1.5 text-[13px] text-[#444]">
            Wed, Jul 2
          </span>
        </div>

        <h3 className="mt-3.5 text-[22px] font-semibold tracking-[-0.01em]">
          Dept A <span className="text-[#666]">↔</span> Dept B
        </h3>
        <p className="mt-0.5 text-[14px] text-[#5a5a5a]">
          Cross-team collaboration
        </p>

        <div className="mt-3.5 rounded-lg border border-[#e6e6e6] px-3.5 py-2.5 text-center text-[14px] text-[#333]">
          Friction costs $310k / quarter if unresolved
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          {/* Cycling status chip: text slides through a mask while the chip
              re-tints and re-fits its width per state. */}
          <motion.span
            layout
            initial={false}
            animate={{
              backgroundColor: status.bg,
              borderColor: status.border,
            }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative overflow-hidden rounded-md border px-2.5 py-1.5 text-[13px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={status.label}
                initial={{ y: "130%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-130%", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="inline-block whitespace-nowrap"
                style={{ color: status.text }}
              >
                {status.label}
              </motion.span>
            </AnimatePresence>
          </motion.span>

          <motion.a
            href="#"
            whileHover={reduce ? undefined : { x: 2 }}
            className="flex items-center gap-1.5 text-[14px] font-medium text-[#111]"
          >
            Review{" "}
            {/* Arrow "sends" on each state change: exits up-right, re-enters
                from bottom-left. Re-keyed by tick so it replays per cycle. */}
            <motion.span
              key={tick}
              className="inline-flex"
              initial={false}
              animate={
                reduce
                  ? undefined
                  : {
                      x: [0, 10, -10, 0],
                      y: [0, -10, 10, 0],
                      opacity: [1, 0, 0, 1],
                    }
              }
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                times: [0, 0.45, 0.55, 1],
              }}
            >
              <ExternalLink size={14} />
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------ Team / Level / Individual ----------------------- */

const AVATARS = [
  { initials: "ZH", bg: "#7cc4f8" },
  { initials: "AK", bg: "#d6f462" },
  { initials: "SR", bg: "#5eead4" },
];

function FactCard({
  title,
  status,
  delay,
  children,
}: {
  title: string;
  status: string;
  delay: number;
  children: React.ReactNode;
}) {
  const reduce = useCalm();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={reduce ? undefined : { y: -3 }}
      className={`${cardBase} flex h-[172px] flex-col p-[18px]`}
      style={cardBg}
    >
      <p className="text-[15px] text-[#dbe6fb]">{title}</p>
      <div className="mt-3">{children}</div>
      <p className="mt-auto text-[13px] text-[#8fa6d9]">{status}</p>
    </motion.div>
  );
}

function IndividualValue({ delay }: { delay: number }) {
  const reduce = useCalm();
  return (
    <div>
      <p className="text-[26px] font-semibold leading-none text-white tabular-nums">
        <CountUp to={5} delay={delay + 0.25} duration={1} />
      </p>
      <div className="mt-2.5 flex">
        {AVATARS.map(({ initials, bg }, i) => (
          <motion.span
            key={initials}
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...SPRING, delay: delay + 0.35 + i * 0.1 }}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-[#0b2b66] ring-2 ring-[#062e80] ${
              i > 0 ? "-ml-1.5" : ""
            }`}
            style={{ backgroundColor: bg }}
          >
            {initials}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- AI analysis (GSAP) --------------------------- */

const AI_LINES = [
  "Platform team: strong growth momentum",
  "Early fixes saved $480k this year",
  "Recommend: expand mentorship",
];

function AiCard() {
  const reduce = useCalm();
  const host = useRef<HTMLDivElement>(null);

  /* GSAP typewriter: lines type in sequence; the CSS cursor rides whichever
     line is active and stays blinking on the last one. Layout effect so the
     initial full text (the calm/static render) never flashes first. */
  useLayoutEffect(() => {
    const el = host.current;
    if (!el || reduce) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".q-type"));
    spans.forEach((s) => {
      s.textContent = "";
    });
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2 });
      spans.forEach((s, i) => {
        const full = AI_LINES[i];
        const state = { n: 0 };
        tl.add(() => {
          spans.forEach((x, j) => x.classList.toggle("typing", j <= i && j === i));
        });
        tl.to(state, {
          n: full.length,
          duration: full.length * 0.03,
          ease: "none",
          onUpdate: () => {
            s.textContent = full.slice(0, Math.round(state.n));
          },
        });
        if (i < spans.length - 1) tl.to({}, { duration: 0.25 });
      });
    }, el);
    return () => {
      ctx.revert();
      spans.forEach((s, i) => {
        s.textContent = AI_LINES[i];
        s.classList.remove("typing");
      });
    };
  }, [reduce]);

  return (
    <motion.div
      ref={host}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 1.45 }}
      className={`${cardBase} p-[18px]`}
      style={cardBg}
    >
      <div className="flex items-center gap-2.5">
        <Checkbox />
        <span className="text-[15px] font-medium text-white">AI Analysis</span>
      </div>
      <ul className="mt-3.5 flex flex-col gap-2">
        {AI_LINES.map((line) => (
          <li
            key={line}
            className="flex items-baseline gap-2.5 text-[14px] text-[#c6d4f2]"
          >
            <span className="text-[11px] text-[#8fa6d9]">◇</span>
            <span className="q-type">{line}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ----------------------------- outcome metrics ---------------------------- */

function Metric({
  value,
  label,
  delay,
}: {
  value: React.ReactNode;
  label: string;
  delay: number;
}) {
  const reduce = useCalm();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={reduce ? undefined : { y: -3 }}
      className={`${cardBase} p-[18px]`}
      style={cardBg}
    >
      <p
        className="text-[24px] font-semibold leading-none tabular-nums"
        style={{ color: LIME }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.45] text-[#8fa6d9]">{label}</p>
    </motion.div>
  );
}

/* -------------------------------- assembly ------------------------------- */

export function Dashboard() {
  const { ref, scale } = useFitScale(W);

  return (
    <div ref={ref} className="w-full" style={{ height: H * scale }}>
      <div
        className="origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <div className="flex h-full">
          <SourceColumn />
          <Hub />

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <RiskCard />

            <div className="grid grid-cols-3 gap-4">
              <FactCard title="Team" status="At Risk" delay={1.2}>
                <p className="text-[26px] font-semibold leading-none text-white">
                  Marketing
                </p>
              </FactCard>
              <FactCard title="Level" status="Aligned this week" delay={1.3}>
                <p className="text-[26px] font-semibold leading-none text-white">
                  Manager's
                </p>
              </FactCard>
              <FactCard title="Individual" status="Growth signals" delay={1.4}>
                <IndividualValue delay={1.4} />
              </FactCard>
            </div>

            <AiCard />

            <div className="grid grid-cols-3 gap-4">
              <Metric
                delay={1.55}
                value={
                  <CountUp
                    to={480}
                    delay={1.8}
                    duration={1.5}
                    format={(v) => `$${Math.round(v)}k`}
                  />
                }
                label="Saved from resolved risks"
              />
              <Metric
                delay={1.63}
                value={
                  <CountUp
                    to={12}
                    delay={1.85}
                    duration={1.3}
                    format={(v) => `+${Math.round(v)}%`}
                  />
                }
                label="Innovation momentum"
              />
              <Metric
                delay={1.71}
                value={<CountUp to={14} delay={1.9} duration={1.3} />}
                label="Growth signals rising"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
