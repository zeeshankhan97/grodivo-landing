import {
  DIMENSIONS,
  compositeDelta,
  criticalCount,
  criticalGroup,
  delta,
  isCritical,
} from "../data/detailed";
import { useCountUp } from "../hooks/useReveal";

/* Plot geometry. Fixed viewBox, fluid render — the instrument keeps its
   proportions at every breakpoint rather than reflowing into a different chart. */
const W = 640;
const H = 340;
const X0 = 48;
const X1 = 608;
const Y_TOP = 48;
const Y_BASE = 262;
const AXIS_Y = 292;

/* The plot is framed to the readings, not to zero. No score falls below 40 and
   there is no y-axis, so a zero baseline would only buy empty panel — every
   delta still scales identically, which is the only comparison being made. */
const DOMAIN_MIN = 32;
const DOMAIN_MAX = 100;

const stationX = (i: number) => X0 + (i * (X1 - X0)) / (DIMENSIONS.length - 1);
const scoreY = (score: number) =>
  Y_BASE -
  ((score - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * (Y_BASE - Y_TOP);

const points = (key: "acquirer" | "target") =>
  DIMENSIONS.map((d, i) => `${stationX(i)},${scoreY(d[key])}`).join(" ");

/** Closed band between the two profiles — the gap rendered as area, not lines. */
const gapArea = () => {
  const top = DIMENSIONS.map((d, i) => `${stationX(i)},${scoreY(d.acquirer)}`);
  const bottom = DIMENSIONS.map(
    (d, i) => `${stationX(i)},${scoreY(d.target)}`,
  ).reverse();
  return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
};

export function GapInstrument() {
  const readout = useCountUp(compositeDelta);

  return (
    <figure
      className="u-panel relative overflow-hidden p-4 sm:p-5"
      aria-label={`Alignment scan. Composite delta ${compositeDelta} across eight DETAILED dimensions. ${criticalCount} critical gaps, both in ${criticalGroup}.`}
    >
      {/* Single calibration sweep on load. Fires once, never loops — ambient
          motion would undercut the claim that this is a real measurement. */}
      <div
        aria-hidden
        className="a-sweep pointer-events-none absolute inset-y-0 left-0 w-1/4"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--instrument-scan), transparent)",
        }}
      />

      {/* Readout header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Legend swatch="acquirer" label="Acquirer" />
          <Legend swatch="target" label="Target" />
        </div>

        <div className="text-right">
          <div className="u-micro text-mist-dim">Alignment delta</div>
          <div className="u-readout text-readout mt-1 text-signal">
            {readout.toFixed(1)}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full"
        role="presentation"
        focusable="false"
      >
        {/* Station rules — the eight measurement axes, named in Section 2. */}
        {DIMENSIONS.map((_, i) => (
          <line
            key={i}
            x1={stationX(i)}
            x2={stationX(i)}
            y1={Y_TOP - 12}
            y2={AXIS_Y - 12}
            stroke="var(--grid-line)"
            strokeWidth={1}
          />
        ))}

        <line
          x1={X0 - 16}
          x2={X1 + 16}
          y1={AXIS_Y - 12}
          y2={AXIS_Y - 12}
          stroke="var(--color-rule)"
          strokeWidth={1}
        />

        {/* Gap as filled area. Uses fill-opacity, not opacity: the `a-rise`
            keyframe animates `opacity` to 1 and would otherwise flood the plot. */}
        <path
          d={gapArea()}
          fill="var(--color-signal)"
          fillOpacity={0.13}
          className="a-rise"
          style={{ "--delay": "900ms" } as React.CSSProperties}
        />

        {/* Per-station measure bars. Critical gaps go red; the rest stay cyan.
            Colour here is a threshold, not decoration. */}
        {DIMENSIONS.map((d, i) => {
          const x = stationX(i);
          const yA = scoreY(d.acquirer);
          const yT = scoreY(d.target);
          const critical = isCritical(d);
          return (
            <g
              key={`gap-${i}`}
              className="a-measure"
              style={
                {
                  "--delay": `${760 + i * 45}ms`,
                  "--origin": `${x}px ${yA}px`,
                } as React.CSSProperties
              }
            >
              <rect
                x={x - (critical ? 3 : 1)}
                y={yA}
                width={critical ? 6 : 2}
                height={Math.max(yT - yA, 0)}
                fill={critical ? "var(--color-signal)" : "var(--color-cyan)"}
                fillOpacity={critical ? 0.9 : 0.4}
                rx="var(--radius-tile)"
              />
              {critical && (
                <text
                  x={x}
                  y={yT + 22}
                  textAnchor="middle"
                  fill="var(--color-signal)"
                  fontFamily="var(--font-mono)"
                  fontSize={13}
                  fontWeight={600}
                >
                  {delta(d)}
                </text>
              )}
            </g>
          );
        })}

        {/* Target profile — drawn first so the acquirer reads as the reference. */}
        <polyline
          points={points("target")}
          fill="none"
          stroke="var(--color-mist-dim)"
          strokeWidth={2}
          strokeDasharray="0"
          strokeLinejoin="round"
          className="a-draw"
          style={{ "--len": 1400, "--delay": "260ms" } as React.CSSProperties}
        />
        <polyline
          points={points("acquirer")}
          fill="none"
          stroke="var(--color-cyan)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          className="a-draw"
          style={{ "--len": 1400, "--delay": "120ms" } as React.CSSProperties}
        />

        {/* Nodes: acquirer squares, target hollow circles. Shape carries the
            distinction as well as colour, so the chart survives colour-blindness. */}
        {DIMENSIONS.map((d, i) => (
          <g
            key={`node-${i}`}
            className="a-rise"
            style={{ "--delay": `${640 + i * 40}ms` } as React.CSSProperties}
          >
            <rect
              x={stationX(i) - 3.5}
              y={scoreY(d.acquirer) - 3.5}
              width={7}
              height={7}
              fill="var(--color-cyan)"
            />
            <circle
              cx={stationX(i)}
              cy={scoreY(d.target)}
              r={3.5}
              fill="var(--color-ink-800)"
              stroke="var(--color-mist-dim)"
              strokeWidth={1.5}
            />
          </g>
        ))}

        {/* Axis is numbered, not named. Section 2 supplies the names — the
            reader earns the vocabulary by scrolling. */}
        {DIMENSIONS.map((_, i) => (
          <text
            key={`tick-${i}`}
            x={stationX(i)}
            y={AXIS_Y + 10}
            textAnchor="middle"
            fill="var(--color-mist-dim)"
            fontFamily="var(--font-mono)"
            fontSize={11}
            letterSpacing="0.08em"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        ))}
      </svg>

      <figcaption className="relative mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-rule pt-3">
        <span className="u-micro text-mist-dim">
          DETAILED™ Composite · 8 dimensions
        </span>
        <span className="u-micro text-signal">
          {criticalCount} critical · {criticalGroup}
        </span>
      </figcaption>
    </figure>
  );
}

function Legend({
  swatch,
  label,
}: {
  swatch: "acquirer" | "target";
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      {swatch === "acquirer" ? (
        <span className="size-2 bg-cyan" />
      ) : (
        <span className="size-2 rounded-pill border-2 border-mist-dim" />
      )}
      <span className="u-micro text-mist">{label}</span>
    </span>
  );
}
