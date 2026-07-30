import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Inbox,
  LayoutGrid,
  Gauge,
  Radar,
  DraftingCompass,
  Bell,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
  DIMENSIONS,
  compositeDelta,
  criticalCount,
  delta,
  isCritical,
} from "../data/detailed";
import { useEntranceGate, isStaticRender } from "../hooks/useEntranceGate";

/**
 * The working artwork on the reference layout: no frame, no scene — a collage
 * of product surfaces floating on the page ground, wired together by dashed
 * conduits that converge on the diamond node and fan out to the results.
 *
 *   left rail: what goes in (signals → the DETAILED™ core → the modules)
 *   node:      the platform
 *   right:     what comes out (the critical-gap alert, the readings, the cost)
 *
 * Every number is either derived from the shared DIMENSIONS dataset or is one
 * of the founder's own figures. Nothing here is invented.
 */

const MODULES = [
  {
    icon: Gauge,
    name: "Quality of Culture (QoC)™",
    sub: "Baseline both organizations",
  },
  {
    icon: Radar,
    name: "Culture Watch™",
    sub: "Track drift through integration",
  },
  {
    icon: DraftingCompass,
    name: "Culture By Design™",
    sub: "Close the gap on schedule",
  },
];

const worst = DIMENSIONS.reduce((a, b) => (delta(a) >= delta(b) ? a : b));

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="u-micro mb-2.5 text-frost-dim">{children}</div>;
}

function RailCard({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof Inbox;
  title: string;
  sub: string;
}) {
  return (
    <motion.div
      variants={rise}
      className="trans-tile flex items-start gap-3 rounded-card bg-ink-800/80 p-4 hover:bg-ink-700"
    >
      <Icon
        className="mt-0.5 size-4 shrink-0 text-cyan-soft"
        strokeWidth={1.8}
      />
      <div className="min-w-0">
        <div className="text-body font-medium leading-snug text-paper">
          {title}
        </div>
        <div className="text-label mt-1 leading-snug text-mist-dim">{sub}</div>
      </div>
    </motion.div>
  );
}

export function ArtCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const gate = useEntranceGate();

  useEffect(() => {
    const host = ref.current;
    if (!host || isStaticRender()) return;

    const ctx = gsap.context(() => {
      gsap.to(".collage-flow", {
        strokeDashoffset: -160,
        duration: 12,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".collage-node", {
        scale: 1.15,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center",
      });
    }, host);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="lg:flex lg:items-center"
      variants={stagger}
      initial={gate}
      animate="show"
    >
      {/* ---- Left rail: intake → core → modules ---- */}
      <div className="flex flex-col gap-6 lg:w-60 lg:shrink-0">
        <div>
          <GroupLabel>Signals</GroupLabel>
          <RailCard
            icon={Inbox}
            title="Deal Signals"
            sub="Docs · Comms · Systems"
          />
        </div>
        <div>
          <GroupLabel>The Measure</GroupLabel>
          <RailCard
            icon={LayoutGrid}
            title="DETAILED™ Composite"
            sub="8 dimensions · People · Purpose · Productivity"
          />
        </div>
        <div>
          <GroupLabel>Modules</GroupLabel>
          <div className="flex flex-col gap-2.5">
            {MODULES.map((m) => (
              <RailCard key={m.name} icon={m.icon} title={m.name} sub={m.sub} />
            ))}
          </div>
        </div>
      </div>

      {/* ---- Conduits + node (desktop only; stacks don't need wiring) ---- */}
      <div className="relative hidden self-stretch lg:block lg:w-16">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 64 640"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[
            "M0 70C26 70 26 320 30 320",
            "M0 200C26 200 26 320 30 320",
            "M0 470C26 470 26 320 30 320",
            "M34 320C40 320 40 110 64 110",
            "M34 320C40 320 40 540 64 540",
          ].map((d) => (
            <path
              key={d}
              className="collage-flow"
              d={d}
              fill="none"
              stroke="var(--color-frost-dim)"
              strokeOpacity={0.55}
              strokeWidth={1.3}
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {/* The platform node: the diamond mark itself. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className="collage-node text-cyan"
          >
            <rect
              x="5.5"
              y="5.5"
              width="13"
              height="13"
              transform="rotate(45 12 12)"
              fill="var(--color-ink-900)"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <rect
              x="9.6"
              y="9.6"
              width="4.8"
              height="4.8"
              transform="rotate(45 12 12)"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* ---- Right: the output ---- */}
      <div className="mt-8 flex min-w-0 flex-1 flex-col gap-3 lg:mt-0">
        {/* Critical-gap alert — the white card. */}
        <motion.div
          variants={rise}
          className="rounded-card bg-paper p-5 text-navy shadow-panel"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="u-micro whitespace-nowrap rounded-chip bg-amber/25 px-2 py-1 text-navy">
              Δ{delta(worst)} · Critical
            </span>
            <span className="u-micro whitespace-nowrap text-mist-dim">
              Diligence · Wk 3
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <div className="u-display-sm text-h3">
                {worst.name} ({worst.symbol})
              </div>
              <div className="mt-1 text-body text-mist-dim">
                {worst.group} · Acquirer {worst.acquirer} vs Target{" "}
                {worst.target}
              </div>
            </div>
            <Bell className="size-4 shrink-0 text-mist-dim" strokeWidth={1.8} />
          </div>
          <div className="mt-3 rounded-chip border border-frost bg-frost/30 px-3 py-2 text-body">
            App dev teams may not integrate for two years
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="u-micro rounded-chip bg-signal/10 px-2 py-1 text-signal">
              $100M at risk
            </span>
            <a
              href="#top"
              className="trans-cta flex items-center gap-1 text-body font-medium text-navy-lift hover:text-cyan"
            >
              Review <ArrowUpRight className="size-4" strokeWidth={2} />
            </a>
          </div>
        </motion.div>

        {/* Readings row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              t: "Composite",
              a: `${compositeDelta}`,
              as: "alignment delta",
              b: `${criticalCount}`,
              bs: "critical gaps",
            },
            { t: "Dimensions", a: "8", as: "measured", b: "3", bs: "groups" },
            {
              t: "Exposure",
              a: "20–40%",
              as: "growth shortfall",
              b: `Δ${delta(worst)}`,
              bs: worst.name.toLowerCase(),
            },
          ].map((m) => (
            <motion.div
              key={m.t}
              variants={rise}
              className="rounded-card bg-ink-800/80 p-4"
            >
              <div className="u-micro text-frost-dim">{m.t}</div>
              <div className="u-readout mt-2 whitespace-nowrap text-h3 font-semibold text-paper">
                {m.a}
              </div>
              <div className="text-label mt-0.5 leading-snug text-mist-dim">
                {m.as}
              </div>
              <div className="u-readout mt-2.5 whitespace-nowrap text-h3 font-semibold text-paper">
                {m.b}
              </div>
              <div className="text-label mt-0.5 leading-snug text-mist-dim">
                {m.bs}
              </div>
            </motion.div>
          ))}
        </div>

        {/* TAP analysis — the eight deltas as mini bars, critical in amber. */}
        <motion.div variants={rise} className="rounded-card bg-ink-800/80 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-cyan" strokeWidth={1.8} />
            <span className="text-body font-medium text-paper">
              TAP Analysis
            </span>
            <span className="u-micro text-mist-dim">· DETAILED™</span>
          </div>
          <div
            className="mt-3 flex h-14 items-end gap-1.5"
            role="img"
            aria-label={`Eight dimension deltas, largest ${delta(worst)} on ${worst.name}.`}
          >
            {DIMENSIONS.map((d) => (
              <div
                key={`${d.group}-${d.name}`}
                className={`min-w-0 flex-1 rounded-tile ${isCritical(d) ? "bg-amber" : "bg-cyan/60"}`}
                style={{ height: `${Math.max((delta(d) / 60) * 100, 8)}%` }}
                title={`${d.name} Δ${delta(d)}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Consequence row — the founder's numbers. */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: "6–12 mo", s: "Integration extended" },
            { n: "$100M", s: "Revenue at risk" },
            { n: "~$2T", s: "Unaddressed annually" },
          ].map((m) => (
            <motion.div
              key={m.n}
              variants={rise}
              className="rounded-card bg-ink-800/80 p-4"
            >
              <div className="u-readout whitespace-nowrap text-h3 font-semibold text-paper">
                {m.n}
              </div>
              <div className="text-label mt-1 leading-snug text-mist-dim">
                {m.s}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
