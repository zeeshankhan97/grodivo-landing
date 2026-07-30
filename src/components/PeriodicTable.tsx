import {
  DIMENSIONS,
  GROUP_ORDER,
  type Dimension,
  delta,
  isCritical,
} from "../data/detailed";

/**
 * The DETAILED™ Composite as a periodic table.
 *
 * Groups are columns, elements stack inside them — the arrangement an actual
 * periodic table uses, and the one that lets a dimension carry its full name at
 * a readable size. An 8-across row was tried first and forced "DIFFERENTIATION"
 * to either break mid-word or drop to 9px; neither is worth the symmetry.
 *
 * Productivity holding only two elements is left visible rather than padded.
 * The framework is 3/3/2 and the table should say so.
 */
export function PeriodicTable() {
  return (
    <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {GROUP_ORDER.map((group) => {
        const members = DIMENSIONS.filter((d) => d.group === group);
        const groupCritical = members.some(isCritical);

        return (
          <section key={group}>
            <header className="mb-2.5 flex items-center gap-3">
              <span
                aria-hidden
                className={`h-px w-6 flex-none ${groupCritical ? "bg-signal" : "bg-navy-lift"}`}
              />
              <h4
                className={`u-micro ${groupCritical ? "text-signal" : "text-mist-dim"}`}
              >
                {group}
              </h4>
              <span aria-hidden className="h-px flex-1 bg-rule" />
            </header>

            <div className="flex flex-col gap-2">
              {members.map((d) => (
                <Tile
                  key={`${d.group}-${d.name}`}
                  d={d}
                  index={DIMENSIONS.indexOf(d)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Tile({ d, index }: { d: Dimension; index: number }) {
  const gap = delta(d);
  const critical = isCritical(d);

  return (
    /* Reveal and hover live on separate elements on purpose: `.a-onscroll` sets
       a transition shorthand that would otherwise clobber the tile's own hover
       transition, since the plain rule outranks the utility layer. */
    <div
      className="a-onscroll"
      style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}
    >
      <article
        className={`trans-tile group relative block overflow-hidden rounded-tile border bg-tile px-3.5 py-3 hover:-translate-y-0.5 hover:bg-tile-hover ${
          critical
            ? "border-signal/45 hover:border-signal"
            : "border-rule hover:border-navy-lift"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="u-readout text-micro w-4 flex-none text-mist-dim">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`u-display-sm text-symbol w-7 flex-none ${critical ? "text-signal" : "text-paper"}`}
          >
            {d.symbol}
          </span>

          <span className="u-label min-w-0 flex-1 truncate text-mist">
            {d.name}
          </span>

          <span
            className={`u-readout text-label flex-none font-semibold ${critical ? "text-signal" : "text-cyan"}`}
          >
            Δ{gap}
          </span>
        </div>

        {/* The same delta the hero instrument drew, now under its own name. */}
        <div aria-hidden className="mt-2.5 h-0.5 w-full bg-rule">
          <div
            className={`h-full ${critical ? "bg-signal" : "bg-cyan"}`}
            style={{ width: `${Math.min((gap / 60) * 100, 100)}%` }}
          />
        </div>

        <span className="sr-only">
          {d.name}, {d.group}. Acquirer {d.acquirer}, target {d.target}, gap{" "}
          {gap}
          {critical ? ", critical" : ""}.
        </span>
      </article>
    </div>
  );
}
