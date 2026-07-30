/**
 * The DETAILED™ Composite — 8 dimensions in 3 groups.
 *
 * One dataset, two renderings. The hero instrument plots these as an unlabelled
 * profile; Section 2 names the same eight stations as a periodic table. Sharing
 * the source is the point: the reader is looking at the same measurement twice,
 * so the second section resolves the first rather than restating it.
 *
 * Scores model the brief's anchor scenario: an acquirer with strong Thinking and
 * Execution absorbing a target that is weak in both — misaligned infrastructure,
 * app dev and CIO leadership. Those two deltas are the $100M at risk.
 */

export type Group = "People" | "Purpose" | "Productivity";

export interface Dimension {
  /** Periodic-table symbol, as used in the existing brand artifact. */
  symbol: string;
  name: string;
  group: Group;
  /** Composite score, 0–100. */
  acquirer: number;
  target: number;
}

export const CRITICAL_DELTA = 30;

export const DIMENSIONS: Dimension[] = [
  {
    symbol: "D",
    name: "Differentiation",
    group: "People",
    acquirer: 84,
    target: 71,
  },
  { symbol: "E", name: "Ecosystem", group: "People", acquirer: 79, target: 62 },
  {
    symbol: "I",
    name: "Interpersonal",
    group: "People",
    acquirer: 88,
    target: 80,
  },
  {
    symbol: "D",
    name: "Discovery",
    group: "Purpose",
    acquirer: 82,
    target: 66,
  },
  {
    symbol: "L",
    name: "Leadership",
    group: "Purpose",
    acquirer: 91,
    target: 65,
  },
  {
    symbol: "A",
    name: "Achievement",
    group: "Purpose",
    acquirer: 86,
    target: 74,
  },
  {
    symbol: "T",
    name: "Thinking",
    group: "Productivity",
    acquirer: 93,
    target: 41,
  },
  {
    symbol: "E",
    name: "Execution",
    group: "Productivity",
    acquirer: 89,
    target: 44,
  },
];

export const GROUP_ORDER: Group[] = ["People", "Purpose", "Productivity"];

export const delta = (d: Dimension) => d.acquirer - d.target;

export const isCritical = (d: Dimension) => delta(d) >= CRITICAL_DELTA;

/** Mean absolute gap across all eight dimensions — the headline readout. */
export const compositeDelta = Number(
  (
    DIMENSIONS.reduce((sum, d) => sum + delta(d), 0) / DIMENSIONS.length
  ).toFixed(1),
);

export const criticalCount = DIMENSIONS.filter(isCritical).length;

/** The group carrying the critical deltas, named in the readout. */
export const criticalGroup =
  DIMENSIONS.filter(isCritical)[0]?.group ?? "Productivity";
