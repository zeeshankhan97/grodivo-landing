/**
 * Nav on the reference layout: wordmark left, links right, two actions.
 * The wordmark itself stays the client's — diamond mark + serif grodivo.ai.
 */
const LINKS = ["Our Platform", "Mapping Alignment", "Solutions", "About"];

export function Nav() {
  return (
    <header className="relative">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-4 px-gutter py-6">
        <a
          href="#top"
          className="flex items-center gap-2 text-paper"
          aria-label="Grodivo, home"
        >
          {/* Diamond mark, redrawn from the client masthead. */}
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <rect
              x="6.2"
              y="6.2"
              width="11.6"
              height="11.6"
              transform="rotate(45 12 12)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <rect
              x="9.9"
              y="9.9"
              width="4.2"
              height="4.2"
              transform="rotate(45 12 12)"
              fill="currentColor"
            />
          </svg>
          <span className="font-serif text-logo tracking-tight">
            grodivo.ai
          </span>
          <span className="u-micro -mt-3 self-start text-frost-dim">™</span>
        </a>

        <div className="flex flex-wrap items-center gap-x-9 gap-y-3">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-9 gap-y-2">
              {LINKS.map((l) => (
                <li key={l}>
                  <a
                    href="#top"
                    className="trans-cta text-nav text-paper hover:text-cyan-soft"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#top"
              className="trans-cta rounded-control bg-paper px-5 py-2.5 text-nav font-medium text-navy hover:bg-frost"
            >
              Get Demo
            </a>
            <a
              href="mailto:hello@grodivo.com?subject=Demo%20request"
              className="trans-cta rounded-control bg-cyan px-5 py-2.5 text-nav font-medium text-ink-950 hover:bg-cyan-soft"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
