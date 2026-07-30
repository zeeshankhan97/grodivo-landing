import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DIMENSIONS, delta, isCritical } from "../data/detailed";

/**
 * The working artwork: one continuous apparatus, read left to right.
 *
 *   INTAKE → THE MEASURE → THE READING → THE APPLICATION → THE CONSEQUENCE
 *
 * Raw signal enters, passes through the eight-cell lattice core, exits as
 * stratified vectors whose drift is measured, is applied to two merging
 * lattices whose misregistration fractures, and resolves into three ledger
 * columns and a value curve. The curve is the output of the entire machine.
 *
 * The lattice core is not decoration — its three bands are People/Purpose/
 * Productivity and its eight cells are lit from the same DIMENSIONS array the
 * rest of the site reads. Cyan means order; amber means measured disorder.
 *
 * `?static` in the URL renders the finished drawing with no animation — the
 * page must never depend on GSAP to be seen, and the agency gets clean stills.
 */

/* Deterministic pseudo-random. Math.random would re-scatter the intake cloud
   on every render and make hydration/screenshots unstable. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const rnd = seeded(7);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ---- FAR LEFT — intake cloud ------------------------------------------- */
const FRAGS = range(30).map((i) => ({
  x: 8 + rnd() * 142,
  y: 110 + rnd() * 470,
  kind: i % 4, // 0 document plane, 1 severed thread, 2 ticker dash, 3 particulate
  o: 0.3 + rnd() * 0.4,
  r: rnd() * 44 - 22,
}));

const INTAKE_CONDUITS = [
  "M26 150C96 190 138 300 188 352",
  "M14 300C84 310 138 340 188 358",
  "M20 452C92 430 140 392 188 364",
  "M40 580C110 512 146 420 188 368",
];

/* ---- LEFT-CENTER — the eight-cell lattice core ------------------------- */
const BANDS = [
  DIMENSIONS.slice(0, 3),
  DIMENSIONS.slice(3, 6),
  DIMENSIONS.slice(6, 8),
];

/* ---- CENTER — the reading: four stratified tiers ----------------------- */
const TIERS = [
  {
    y: 158,
    count: 3,
    len: 100,
    w: 3,
    spread: 0,
    color: "var(--color-cyan)",
    o: 1,
    glow: true,
  },
  {
    y: 238,
    count: 7,
    len: 60,
    w: 2,
    spread: 14,
    color: "var(--color-cyan-soft)",
    o: 0.9,
    glow: false,
  },
  {
    y: 312,
    count: 13,
    len: 40,
    w: 1.6,
    spread: 30,
    color: "var(--color-mist)",
    o: 0.75,
    glow: false,
  },
  {
    y: 396,
    count: 24,
    len: 24,
    w: 1.3,
    spread: 58,
    color: "var(--color-amber)",
    o: 0.85,
    glow: false,
  },
];

const VECTORS = TIERS.flatMap((t, ti) =>
  range(t.count).map((i) => {
    const f = t.count === 1 ? 0.5 : i / (t.count - 1);
    return {
      ti,
      x: 350 + f * (202 - t.len),
      y: t.y,
      len: t.len,
      w: t.w,
      color: t.color,
      o: t.o,
      glow: t.glow,
      // Fan symmetric about true; lower tiers pick up jitter on top of spread.
      deg:
        t.spread * (2 * f - 1) +
        (t.spread ? (rnd() - 0.5) * t.spread * 0.3 : 0),
    };
  }),
);

const polar = (cx: number, cy: number, r: number, deg: number) =>
  `${cx + r * Math.cos((deg * Math.PI) / 180)} ${cy + r * Math.sin((deg * Math.PI) / 180)}`;

/* ---- RIGHT-CENTER — two lattices, misregistered ------------------------ */
const gridPath = (cols: number, rows: number, s: number) => {
  let d = "";
  for (const c of range(cols + 1)) d += `M${c * s} 0V${rows * s}`;
  for (const r of range(rows + 1)) d += `M0 ${r * s}H${cols * s}`;
  return d;
};

const SEAMS = [
  "M664 252l7 15-9 17 8 18-6 17 9 18-7 16",
  "M676 268l-6 14 8 16-9 17 7 18-5 15",
];

/* ---- FAR RIGHT — ledger + value curve ---------------------------------- */
const LEDGER = [
  { x: 788, t: "BS" },
  { x: 846, t: "IS" },
  { x: 904, t: "CF" },
].map((c) => ({
  ...c,
  rows: range(7).map(() => Math.floor(1000 + rnd() * 9000)),
}));

const CURVE =
  "M778 466C795 468 801 538 817 543C833 548 840 486 862 470C888 451 918 445 950 441";
const CURVE_DIP = "M797 500C804 528 810 540 819 543";

const ZONES = [
  { x: 82, t: "01 · INTAKE" },
  { x: 266, t: "02 · THE MEASURE" },
  { x: 452, t: "03 · THE READING" },
  { x: 668, t: "04 · APPLICATION" },
  { x: 864, t: "05 · CONSEQUENCE" },
];

const isStatic = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  new URLSearchParams(window.location.search).has("static");

export function ApparatusArt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || isStatic()) return;

    const ctx = gsap.context(() => {
      // Stroke-draw setup. Only applied when animating, so the static render
      // is always the finished drawing.
      host.querySelectorAll<SVGPathElement>(".draw").forEach((p) => {
        const L = p.getTotalLength();
        p.style.strokeDasharray = `${L}`;
        p.style.strokeDashoffset = `${L}`;
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".zone", { opacity: 0, y: 14, duration: 0.7, stagger: 0.16 }, 0)
        .to(".draw", { strokeDashoffset: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .from(".cell", { opacity: 0, duration: 0.5, stagger: 0.06 }, 0.45)
        .from(
          ".vec",
          {
            rotation: 0,
            opacity: 0,
            duration: 0.9,
            stagger: 0.012,
            ease: "power3.out",
          },
          0.7,
        );

      // Ambient life, all sub-perceptual-slow: signal flowing along conduits,
      // the intake cloud being drawn inward, critical cells breathing.
      gsap.to(".flow", {
        strokeDashoffset: -340,
        duration: 16,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".frag", {
        x: "+=7",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.13, from: "random" },
      });
      gsap.to(".pulse", {
        opacity: 0.15,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }, host);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-panel bg-ink-950 shadow-panel"
    >
      <svg
        viewBox="0 0 960 680"
        className="block w-full"
        role="img"
        aria-label="One continuous instrument: raw signal enters an eight-cell DETAILED lattice core, exits as stratified vectors drifting from cyan order into amber disorder, is applied to two merging lattices that fracture along amber fault seams, and resolves into three ledger columns and a value curve that dips where the fractures were densest."
      >
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Backdrop: faint bench grid so the dark space has structure. */}
        <g stroke="var(--color-ink-700)" strokeOpacity={0.5}>
          {range(15).map((i) => (
            <path key={`v${i}`} d={`M${(i + 1) * 60} 0V680`} />
          ))}
          {range(10).map((i) => (
            <path key={`h${i}`} d={`M0 ${(i + 1) * 62}H960`} />
          ))}
        </g>

        {/* ---- Spine conduit: the whole machine on one line ---- */}
        <path
          d="M0 360H960"
          stroke="var(--color-mist-dim)"
          strokeOpacity={0.3}
        />
        <path
          className="flow"
          d="M188 360H960"
          stroke="var(--color-cyan)"
          strokeOpacity={0.75}
          strokeWidth={1.5}
          strokeDasharray="3 14"
          fill="none"
        />
        {[196, 338, 566, 770].map((x) => (
          <rect
            key={x}
            x={x - 3}
            y={357}
            width={6}
            height={6}
            fill="var(--color-mist)"
          />
        ))}

        {/* ================= 01 — INTAKE ================= */}
        <g className="zone">
          {FRAGS.map((f, i) => (
            <g
              key={i}
              className="frag"
              transform={`translate(${f.x} ${f.y}) rotate(${f.r})`}
              opacity={f.o}
            >
              {f.kind === 0 && (
                <g stroke="var(--color-mist)" fill="none" strokeWidth={1.1}>
                  <rect width={13} height={16} />
                  <path d="M3 4h7M3 8h7M3 12h4" strokeOpacity={0.7} />
                </g>
              )}
              {f.kind === 1 && (
                <path
                  d="M0 0l5 3 5-3 5 3M22 5l4 2"
                  stroke="var(--color-mist)"
                  fill="none"
                  strokeWidth={1.1}
                />
              )}
              {f.kind === 2 && (
                <path
                  d="M0 0h9M12 0h4M19 0h6"
                  stroke="var(--color-mist)"
                  strokeWidth={1.6}
                />
              )}
              {f.kind === 3 && <circle r={1.8} fill="var(--color-mist)" />}
            </g>
          ))}
          {INTAKE_CONDUITS.map((d) => (
            <g key={d}>
              <path
                d={d}
                stroke="var(--color-mist-dim)"
                strokeOpacity={0.6}
                strokeWidth={1.2}
                fill="none"
              />
              <path
                className="flow"
                d={d}
                stroke="var(--color-cyan-soft)"
                strokeOpacity={0.7}
                strokeWidth={1.2}
                strokeDasharray="2 12"
                fill="none"
              />
            </g>
          ))}
        </g>

        {/* ================= 02 — THE MEASURE ================= */}
        <g className="zone">
          <g transform="translate(206 240) skewY(-4)">
            <rect
              width={124}
              height={170}
              fill="var(--color-ink-800)"
              stroke="var(--color-navy-lift)"
              strokeOpacity={0.8}
              rx={3}
            />
            {BANDS.map((band, b) =>
              band.map((d, j) => {
                const critical = isCritical(d);
                const cx = 10 + b * 38;
                const cy = 10 + j * 52;
                return (
                  <g key={`${b}-${j}`}>
                    <rect
                      className="cell"
                      x={cx}
                      y={cy}
                      width={30}
                      height={44}
                      rx={2}
                      fill={
                        critical ? "var(--color-amber)" : "var(--color-cyan)"
                      }
                      fillOpacity={0.2 + 0.68 * (d.acquirer / 100)}
                      stroke={
                        critical
                          ? "var(--color-amber)"
                          : "var(--color-cyan-soft)"
                      }
                      strokeOpacity={0.9}
                      strokeWidth={1}
                    />
                    {critical && (
                      <rect
                        className="pulse"
                        x={cx - 2.5}
                        y={cy - 2.5}
                        width={35}
                        height={49}
                        rx={3}
                        fill="none"
                        stroke="var(--color-amber)"
                        strokeWidth={1.4}
                        opacity={0.65}
                        filter="url(#glow)"
                      />
                    )}
                    <text
                      x={cx + 26}
                      y={cy + 39}
                      textAnchor="end"
                      fontSize={7}
                      fontWeight={600}
                      fontFamily="var(--font-mono)"
                      fill="var(--color-ink-950)"
                    >
                      Δ{delta(d)}
                    </text>
                  </g>
                );
              }),
            )}
          </g>
          <text
            x={268}
            y={216}
            textAnchor="middle"
            fontSize={9}
            letterSpacing={2}
            fontFamily="var(--font-mono)"
            fill="var(--color-mist)"
          >
            DETAILED™ CORE · 8
          </text>
        </g>

        {/* ================= 03 — THE READING ================= */}
        <g className="zone">
          {VECTORS.map((v, i) => (
            <g key={i} transform={`translate(${v.x} ${v.y})`} opacity={v.o}>
              <g className="vec" style={{ transform: `rotate(${v.deg}deg)` }}>
                <path
                  d={`M0 0H${v.len}M${v.len - 6} -4L${v.len} 0l-6 4`}
                  stroke={v.color}
                  strokeWidth={v.w}
                  fill="none"
                  filter={v.glow ? "url(#glow)" : undefined}
                />
              </g>
            </g>
          ))}

          {/* Deviation instrumentation: an arc per drifted tier, one summary
              readout under the scale. Per-tier labels collided with the core
              plate at this pitch, and the summary says the same thing once. */}
          {TIERS.filter((t) => t.spread > 0).map((t) => (
            <path
              key={t.y}
              d={`M${polar(346, t.y, 26, -t.spread)}A26 26 0 0 1 ${polar(346, t.y, 26, t.spread)}`}
              stroke="var(--color-mist-dim)"
              strokeOpacity={0.7}
              strokeDasharray="2 3"
              fill="none"
            />
          ))}

          {/* Tick scale under the field, with the drift summary */}
          <g stroke="var(--color-mist-dim)" strokeOpacity={0.55}>
            <path d="M350 432H556" />
            {range(11).map((i) => (
              <path
                key={i}
                d={`M${350 + i * 20.6} 432v${i % 5 === 0 ? 6 : 3.5}`}
              />
            ))}
          </g>
          <text
            x={453}
            y={452}
            textAnchor="middle"
            fontSize={8}
            letterSpacing={1.5}
            fontFamily="var(--font-mono)"
            fill="var(--color-mist-dim)"
          >
            ANGULAR DRIFT 0° → ±58°
          </text>
        </g>

        {/* ================= 04 — THE APPLICATION ================= */}
        <g className="zone">
          {/* Intended merge: a faint cyan wireframe hovering above the actual */}
          <g
            transform="translate(572 246)"
            stroke="var(--color-cyan)"
            strokeOpacity={0.4}
            fill="none"
            strokeDasharray="4 6"
          >
            <rect width={176} height={136} />
            <path d="M88 0V136M0 68H176" />
          </g>

          <path
            d={gridPath(5, 6, 16)}
            transform="translate(580 268) rotate(-3)"
            stroke="var(--color-cyan-soft)"
            strokeOpacity={0.75}
            strokeWidth={1.1}
            fill="none"
          />
          <path
            d={gridPath(5, 6, 16)}
            transform="translate(664 282) rotate(3.5)"
            stroke="var(--color-mist)"
            strokeOpacity={0.65}
            strokeWidth={1.1}
            fill="none"
          />

          {SEAMS.map((d) => (
            <path
              key={d}
              className="draw"
              d={d}
              stroke="var(--color-amber)"
              strokeWidth={2}
              fill="none"
              filter="url(#glow)"
            />
          ))}
        </g>

        {/* ================= 05 — THE CONSEQUENCE ================= */}
        <g className="zone">
          {LEDGER.map((col) => (
            <g key={col.t} fontFamily="var(--font-mono)">
              <text
                x={col.x + 24}
                y={238}
                textAnchor="middle"
                fontSize={9}
                letterSpacing={2}
                fill="var(--color-frost)"
              >
                {col.t}
              </text>
              <path
                d={`M${col.x} 246h48`}
                stroke="var(--color-mist-dim)"
                strokeOpacity={0.6}
              />
              {col.rows.map((n, i) => (
                <text
                  key={i}
                  x={col.x + 48}
                  y={262 + i * 15}
                  textAnchor="end"
                  fontSize={8}
                  fill="var(--color-mist)"
                  fillOpacity={0.85}
                >
                  {n.toLocaleString("en-US")}
                </text>
              ))}
            </g>
          ))}

          {/* The value curve — the output of the entire machine. */}
          <g>
            <path
              d="M778 560H952"
              stroke="var(--color-mist-dim)"
              strokeOpacity={0.55}
            />
            {range(7).map((i) => (
              <path
                key={i}
                d={`M${778 + i * 29} 560v4`}
                stroke="var(--color-mist-dim)"
                strokeOpacity={0.55}
              />
            ))}
            <path
              className="draw"
              d={CURVE}
              stroke="var(--color-cyan)"
              strokeWidth={2.5}
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="draw"
              d={CURVE_DIP}
              stroke="var(--color-amber)"
              strokeWidth={2.5}
              fill="none"
            />
            <circle
              cx={950}
              cy={441}
              r={3.5}
              fill="var(--color-cyan)"
              filter="url(#glow)"
            />
          </g>
        </g>

        {/* ---- Zone register ---- */}
        {ZONES.map((z) => (
          <text
            key={z.t}
            x={z.x}
            y={646}
            textAnchor="middle"
            fontSize={9}
            letterSpacing={2}
            fontFamily="var(--font-mono)"
            fill="var(--color-mist)"
            fillOpacity={0.8}
          >
            {z.t}
          </text>
        ))}
      </svg>
    </div>
  );
}
