import { ArrowRight } from "lucide-react";
import { PeriodicTable } from "./PeriodicTable";
import { useReveal } from "../hooks/useReveal";

/* The three modules the brief permits — nothing else. Rendered on a single
   track so sequence (baseline → monitor → act) is carried by the layout rather
   than by words we don't have the budget to write. */
const MODULES = [
  { name: "Quality of Culture (QoC)™", line: "Baseline both organizations." },
  { name: "Culture Watch™", line: "Track drift through integration." },
  { name: "Culture By Design™", line: "Close the gap on schedule." },
];

const LEDGER = ["Balance sheet", "Income statement", "Cash flow"];

export function Narrative() {
  return (
    <section
      id="composite"
      className="relative border-t border-rule py-section"
    >
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-beat flex items-center gap-3">
          {/* Cyan, not red. Red carries exactly one meaning on this page — a
              gap at or above the critical threshold — and a scenario marker is
              not that. */}
          <span aria-hidden className="size-1.5 bg-cyan" />
          <h2 className="u-micro text-mist-dim">
            Scenario — mid-market software roll-up
          </h2>
        </div>

        {/* Beat 1 — the problem, at headline scale. The $100M is the hook, so it
            does the job a section title would otherwise do. */}
        <Beat label="Problem">
          <p className="u-display-sm text-h2 measure-headline text-balance text-paper">
            $100M of business case revenue at risk.
          </p>
          <p className="text-lead measure-body mt-4 text-mist">
            Infrastructure, app dev and CIO leadership misaligned — teams that
            may not integrate for two years.
          </p>
        </Beat>

        {/* Beat 2 — where it applies inside the platform. */}
        <Beat label="Applied">
          <p className="text-lead measure-body text-mist">
            <strong className="font-medium text-paper">
              The TAP Platform™
            </strong>{" "}
            runs pre-LOI, through diligence, and across the first 100 days.
          </p>
        </Beat>

        {/* Beat 3 — the insight, then the artifact that produces it. */}
        <Beat label="Insight">
          <p className="text-lead measure-body text-mist">
            Eight dimensions, acquirer scored against target. One NASDAQ
            client&rsquo;s growth plan wasn&rsquo;t shared three levels down.{" "}
            <strong className="font-medium text-signal">
              Estimated 20&ndash;40% shortfall.
            </strong>
          </p>

          <div className="mt-8">
            <PeriodicTable />
          </div>
        </Beat>

        {/* Beat 4 — the modules that produce it. */}
        <Beat label="Modules">
          <ol className="grid gap-px overflow-hidden rounded-panel bg-rule sm:grid-cols-3">
            {MODULES.map((m) => (
              <li
                key={m.name}
                className="trans-tile group bg-ink-800 p-5 hover:bg-ink-700"
              >
                <span
                  aria-hidden
                  className="trans-rule block h-px w-8 bg-navy-lift group-hover:w-14 group-hover:bg-cyan"
                />
                <h3 className="u-display-sm text-h3 mt-4 text-paper">
                  {m.name}
                </h3>
                <p className="mt-1.5 text-mist">{m.line}</p>
              </li>
            ))}
          </ol>
        </Beat>

        {/* Beat 5 — where it lands financially. Last beat, largest number. */}
        <Beat label="Return" last>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
            <ul className="flex flex-col gap-2.5">
              {LEDGER.map((l) => (
                <li key={l} className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-5 bg-cyan" />
                  <span className="u-label text-paper">{l}</span>
                </li>
              ))}
            </ul>

            <p className="measure-narrow">
              <span className="u-readout u-display-sm text-readout block text-cyan">
                ~$2T
              </span>
              <span className="mt-2 block text-mist">
                of economic value goes unaddressed every year.
              </span>
            </p>
          </div>

          <a
            href="mailto:hello@grodivo.com?subject=Map%20Your%20Gap"
            className="trans-cta group mt-10 inline-flex items-center gap-2.5 rounded-control border border-cyan px-6 py-3.5 text-cyan hover:bg-cyan hover:text-ink-950"
          >
            <span className="u-display-sm text-h3">Map Your Gap™</span>
            <ArrowRight
              className="size-4 transition-transform dur-hover group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </a>
        </Beat>
      </div>
    </section>
  );
}

/**
 * A beat in the argument. The label column is the spine: five semantic markers
 * descending in the founder's stated order. Deliberately not numbered — the
 * hero already owns 01–08 for the dimensions, and a second numeric system would
 * read as decoration rather than as structure.
 */
function Beat({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`grid-beat ${last ? "" : "pb-beat"}`}>
      <div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-2">
        <span className="u-micro text-cyan">{label}</span>
        <span
          aria-hidden
          className={`h-px flex-1 bg-rule lg:h-full lg:w-px lg:flex-none ${last ? "lg:hidden" : ""}`}
        />
      </div>

      {/* One observer per beat. `is-in` releases both this wrapper and any
          nested .a-onscroll tiles, each on its own --delay. */}
      <div className={`a-onscroll ${shown ? "is-in" : ""}`}>{children}</div>
    </div>
  );
}
