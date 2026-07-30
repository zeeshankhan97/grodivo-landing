# grodivo-landing-2

A self-contained static variant of the Grodivo landing page, added
alongside the existing project without touching it.

- **`index.html`** — white version. White nav, hero, and page background
  with the interactive diagram ("artwork") frame in `#002A80`.
- **`grodivo-dark.html`** — dark (navy) variant.

Both are single-file pages (no build step) and share the same content and
animations: an interactive Dot Field hero, ScrollReveal headline, and a
left-to-right mapping pipeline (sliding signal carousel → Execution
Readiness → TAP Insights → Alignment Mapping → dynamic outputs) plus a
trusted-by logo marquee.

Open `index.html` in any static server, e.g. `npx http-server -c-1`.
Assets live in `photos/`.
