# Grodivo — landing page concept

Two sections. Hero + narrative. Vite + React + TypeScript + Tailwind v4.

```bash
npm install
npm run dev      # http://localhost:5175
npm run build
```

- `src/styles/tokens.css` — the only file permitted to hold a raw value
- `src/data/detailed.ts` — one dataset, rendered twice
- `CUTS.md` — what we removed from the current site and why

---

## The idea in one line

The brief says the page must read AI-native **through visual language, not adjectives**.
So the page is built as a measurement instrument, not as a SaaS landing page. There is no
photography, no gradient, no icon grid. The hero shows a reading; the second section shows
the scale that reading was taken against.

**The hero poses the gap. The narrative names its axes.** That relationship is the whole
structure, and it is why two sections are enough.

---

## Section 1 — Hero

| Brief line | What we did |
| --- | --- |
| "Headline names the M&A problem, not the product category" | **"The deal closes. The companies don't."** Names the failure, never says "platform", "AI" or "culture analytics". |
| "'M&A' or 'integration' must appear above the fold" | "post-merger **integration**" is in the subhead; "**M&A** advisory" in the audience strip; "**M&A**'s biggest blind spots" in the Forbes badge. Three times, above the fold. |
| "Hard cap: 25 words of body copy" | Subhead is **20 words**. |
| "One subhead. One primary CTA. Forbes badge. Nothing else." | Exactly that. The masthead carries no nav links and no second CTA — with two sections there is nothing to navigate to. |
| "Must read AI-native / deep tech through visual language" | The gap instrument: two scored profiles, eight measured stations, a live composite readout, a single calibration sweep on load. Deep tech is demonstrated, not claimed. |
| Reuse brand assets | Wordmark `grodivo` lowercase white; **Map Your Gap™** is the CTA — their own words, and already an imperative; "The TAP Platform™" is the product label. |
| Audience — exactly three | Private equity · M&A advisory · Corporate development, set as a label strip. Naming the buyer costs zero body copy this way. |

**Numbers used:** 6–12 months, tens of millions. Both are the founder's own.

---

## Section 2 — Narrative

Walks the five-step hierarchy in the required order, on a labelled spine:
**Problem → Applied → Insight → Modules → Return.**

| # | Brief's step | On the page |
| --- | --- | --- |
| 1 | We fix these problems | **"$100M of business case revenue at risk."** Set at headline scale — the number does the job a section title would. |
| 2 | Use cases in the platform | "The TAP Platform™ runs pre-LOI, through diligence, and across the first 100 days." |
| 3 | Insights you don't have | The NASDAQ client whose growth plan wasn't shared three levels down — **20–40% shortfall** — followed by the DETAILED™ Composite artifact. |
| 4 | Produced through these modules | QoC™ · Culture Watch™ · Culture By Design™. Three, on one track, one line each. |
| 5 | Economic benefit | Balance sheet · Income statement · Cash flow, then **~$2T** unaddressed per year. |

- **Anchor scenario:** the mid-market software roll-up — infrastructure, app dev and CIO
  leadership misaligned, teams that may not integrate for two years.
- **Word count: 88 of the 120 allowed** — all visible copy, including module names
  and ledger labels. Prose alone is 73.
- **DETAILED™ rendered as an artifact, not prose:** a periodic table where groups are
  columns (People 3 / Purpose 3 / Productivity 2) and every tile carries its live delta.

---

## Why the two sections are provably the same measurement

`src/data/detailed.ts` holds one array of eight dimensions with acquirer and target scores.
The hero instrument plots it; the periodic table names it. The composite readout (**23.6**),
the two critical bars (**Δ52 Thinking**, **Δ45 Execution**) and the red group label
(**Productivity**) are all derived — nothing is typed twice, so nothing can drift.

Those two critical deltas are the anchor scenario: Thinking and Execution are exactly
"infrastructure, app dev and CIO leadership". The chart is the story.

---

## Design system

**Colour** — sampled from grodivo.com, not invented. Navy `#002774`, cyan `#009ADE`,
red `#E7222E`. The dark ground is derived *from* the navy rather than being neutral black,
so the surface reads as owned. Red is reserved for one meaning: a gap at or above the
critical threshold. It appears in exactly four places.

**Type** — three roles, deliberately paired:
- *Archivo* on its width axis for display — institutional and engineered, and the extra
  width performs the brief's own subject.
- *Inter* for body — the incumbent brand face, kept on purpose.
- *IBM Plex Mono* for every readout, label and axis — the research-lab register that
  matches the Grodivo Labs / peer-reviewed claim.

**Structure** — the spine labels are semantic (Problem / Applied / Insight / Modules /
Return), not numbered. The hero already owns 01–08 for the dimensions; a second numeric
system would read as decoration rather than as structure.

**Motion** — one orchestrated load sequence and one scroll reveal. Nothing loops. The
calibration sweep fires once, because ambient motion would undercut the claim that this
is a real measurement.

**Radius** — near-square throughout. A caliper has corners.

---

## Quality floor

- Responsive 320px → 2560px. The display ceiling (`2.9rem`) is set by measurement: at this
  face and tracking "THE COMPANIES DON'T." costs ~13.8× its font-size, and the hero column
  tops out near 669px — so the headline holds two lines at every width.
- Keyboard focus visible throughout; skip link to the composite.
- `prefers-reduced-motion` fully respected.
- **Nothing on this page depends on an animation in order to be seen.** Reveal states use
  `backwards` fill and a `.js` guard, so a throttled tab, a blocked bundle or disabled
  animations all degrade to a readable page.
- The instrument carries an `aria-label` summary; each tile has a screen-reader line with
  its real acquirer/target scores. Acquirer and target are distinguished by *shape* as well
  as colour, so the chart survives colour-blindness.

---

## Token discipline

Every value lives in `tokens.css`. Components use named utilities (`px-gutter`,
`measure-body`, `trans-cta`, `grid-beat`) rather than arbitrary Tailwind brackets — there
are zero `[...]` values and zero raw hex outside the token file.
