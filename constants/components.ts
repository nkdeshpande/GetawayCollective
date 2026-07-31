/**
 * COMPONENTS — tables, forms, states, atoms and molecules
 *
 * Wave 6.5 · Bridge Document (31 Jul 2026)
 * Authority: GC-Bridge-Document Gaps 3, 4, 7, 8
 */

import { DENSITY_ROW } from "./tokens-addendum";

// ─────────────────────────────────────────────────────────────────────
// TABLES — the densest surface in the product
// ─────────────────────────────────────────────────────────────────────

export type ColumnAlign = "left" | "right";

/**
 * Alignment by content type, not by preference.
 *
 * Figures right so decimal points line up down a column — with
 * `tabular-nums` that makes magnitude readable without reading digits.
 * Dates right for the same reason: they are ordered data.
 */
export const COLUMN_ALIGN: Record<string, ColumnAlign> = {
  currency: "right",
  percentage: "right",
  ratio: "right",
  count: "right",
  loss: "right",
  risk: "right",
  forecast: "right",
  date: "right",
  text: "left",
  enum: "left",
};

export const TABLE = {
  header: { type: "micro", uppercase: true, tone: "steel", rule: "1px bottom hairline" },
  rowSeparator: "1px hairline",
  zebraStriping: false,
  rowHeight: DENSITY_ROW,
  hover: { effect: "background lifts one step to panel", duration: "120ms", curve: "linear" },
  sort: { columns: 1, trigger: "click header", indicator: "arrow in micro", multiSort: false },
  pinning: "First column pins on horizontal scroll.",
  totalsRow: { weight: "IL-2", rule: "2px top", backgroundFill: false },
  /** Never blank. A blank cell is indistinguishable from a rendering failure. */
  emptyCell: "—",
  longText: "Truncate with ellipsis; full value in title attribute.",
  maxRowsBeforePagination: 100,
  pagination: "cursor",
  /** One level. A distribution expanding into its six waterfall stages. */
  nestingLevels: 1,
} as const;

// ─────────────────────────────────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────────────────────────────────

export const INPUT = {
  height: { comfortable: 40, compact: 32 },
  border: "1px hairline",
  radius: 0,
  /** Per MICRO.focus: instant, no glow, no colour shift. */
  focus: { border: "1px to 2px electric", glow: false, duration: "0ms" },
  label: {
    position: "above",
    type: "caption",
    /** A placeholder standing in for a label disappears exactly when needed. */
    realLabelElement: true,
    placeholderAsLabel: false,
  },
  help: { position: "below field", type: "caption", tone: "steel" },
  error: { position: "below help", type: "caption", tone: "critical", rule: "2px left" },
  required: { marker: "asterisk after label", tone: "hazard" },
  money: { family: "mono", align: "right", symbol: "fixed prefix outside the field" },
  disabled: { opacity: 0.45, pointer: "none", colourChange: false },
  readonly: { border: "none", family: "mono where a figure" },
} as const;

/**
 * Validate on blur, then live once a field has errored.
 *
 * Validating from the first keystroke tells someone their half-typed entry
 * is wrong, which it always is. Waiting until submit makes them hunt. Blur
 * is the moment they have finished with the field and not yet moved on.
 */
export const VALIDATION_TIMING = {
  initial: "on blur",
  afterFirstError: "live",
  never: "on every keystroke before the field has been left once",
} as const;

/**
 * AUTOSAVE — decided in the Bridge Document.
 *
 * Every multi-step form autosaves per field on blur to a draft record.
 *
 * This is what makes PR-01 Accreditation actually resumable. The process
 * spec declares steps A1–A5 resumable; without autosave that declaration
 * would require a bespoke draft mechanism to be built and maintained
 * separately. A draft table and a debounce is the smaller thing.
 */
export const AUTOSAVE = {
  enabled: true,
  trigger: "per field, on blur",
  target: "draft record",
  indicator: { text: "Draft saved", type: "caption", tone: "steel", position: "beside the field group heading" },
  rationale:
    "PR-01 declares its steps resumable. Autosave is how that is free rather than a second system.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// STATES
// ─────────────────────────────────────────────────────────────────────

export const STATES = {
  empty: {
    content: "One line in body, steel, plus the action that would fill it.",
    illustration: false,
    mascot: false,
  },
  loading: {
    indicator: "mono ellipsis cycle",
    spinner: false,
    tables: "Skeleton rows at final row height, so nothing shifts when data arrives.",
  },
  error: {
    field: "Validation message layer (constants/validation.ts).",
    page: "Banner, NT-02.",
    fullPageIllustration: false,
  },
  /**
   * A figure whose provenance has decayed past its verified window renders
   * exactly like a forecast — the provisional mark plus the confidence tag.
   *
   * That is the correct signal rather than a shortcut: trust it the same
   * amount. A year-old valuation is not a statement about today, and it
   * should not look like one.
   */
  stale: {
    treatment: "provisional mark (~) plus confidence tag, identical to a forecast",
    rationale: "Trust it the same amount. A decayed verification is an estimate.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// ATOMS & MOLECULES
// ─────────────────────────────────────────────────────────────────────

export interface ComponentSpec {
  ref: string;
  name: string;
  tier: "atom" | "molecule";
  spec: string;
  rule?: string;
}

export const COMPONENTS: readonly ComponentSpec[] = [
  { ref: "A-01", name: "Tag Pill", tier: "atom",
    spec: "1px hairline border, 0 radius, micro type, uppercase, tone from the enum's semantic tone.",
    rule: "Always carries a label. Colour is never the only carrier of meaning." },
  { ref: "A-03", name: "Mono Input Field", tier: "atom",
    spec: "Per INPUT above. Space Mono, right-aligned for figures, symbol as a fixed prefix outside the field." },
  { ref: "A-10", name: "Confidence Tag", tier: "atom",
    spec: "micro type, tone from CONFIDENCE_COLOUR, IL-5 or lower.",
    rule: "Never outranks the figure it qualifies." },
  { ref: "A-11", name: "Health Score Ring", tier: "atom",
    spec: "0–100, four bands from HEALTH_COLOUR. One of only two places a circle is permitted.",
    rule: "Circles are permitted only for status LEDs and this." },
  { ref: "M-04", name: "The Piston", tier: "molecule",
    spec: "Horizontal bar, linear 3000ms fill, tick marks at 25/50/75%. Full spec in PISTON below.",
    rule: "The only control that moves capital. Linear, 3000ms, never eased." },
  { ref: "M-06", name: "Recovery Strip", tier: "molecule",
    spec: "Persistent strip offering reversal of a reversible action within its window.",
    rule: "Only ever offered for genuinely reversible actions. Never shown after a capital move." },
  { ref: "M-16", name: "Ledger Row", tier: "molecule",
    spec: "Per organism O-08. Append-only; a reversed entry stays visible with its reversal linked." },
];

/**
 * THE PISTON — decided in the Bridge Document.
 *
 * A bar, not a ring and not filling text.
 *
 *   A ring implies a duration that loops or repeats. This control fires
 *   exactly once per commitment.
 *
 *   Filling text is illegible at a glance during a three-second hold, and
 *   §29b reserves italic and serif for narrative — text-as-progress fights
 *   the type system.
 *
 *   A horizontal bar filling left to right reads instantly as "how far
 *   along", and matches the linear no-easing motion already locked.
 *
 * The tick marks are the refinement that matters: without them a 3000ms
 * linear fill reads as an undifferentiated blur, and the member cannot tell
 * whether they are one second in or two.
 */
export const PISTON = {
  form: "horizontal bar",
  fill: "left to right",
  duration: "3000ms",
  curve: "linear",
  easing: "none — a commitment must never feel accelerated toward completion",
  ticks: { count: 3, positions: [25, 50, 75], tone: "rgba(255,255,255,0.15)",
           why: "Without them a linear fill reads as a blur and the hold has no legible progress." },
  label: { family: "mono", blendMode: "difference", example: "HOLD TO COMMIT — 1.7s" },
  reducedMotion: { form: "static countdown numeral", sequence: "3 → 2 → 1", duration: "3000ms unchanged" },
  release: "Releasing before completion resets to zero. No partial hold carries over.",
  haptic: "Single confirm pulse at completion. The only haptic in the system.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// ICONOGRAPHY
// ─────────────────────────────────────────────────────────────────────

/**
 * No icon font. Space Mono glyphs wherever they can carry the meaning, and
 * a small set of hand-drawn 1px SVGs for what mono cannot express.
 *
 * Keeping the set small and closed is the point. An open icon set grows
 * until two icons mean the same thing.
 */
export const ICONS = [
  "chevron", "close", "filter", "sort", "download",
  "external", "lock", "check", "alert",
] as const;

export const ICON_SPEC = {
  stroke: "1px",
  frame: "square",
  fills: false,
  twoTone: false,
  font: false,
  preferMonoGlyph: true,
} as const;

// ─────────────────────────────────────────────────────────────────────
// IMAGERY
// ─────────────────────────────────────────────────────────────────────

export const IMAGERY = {
  ratios: { card: "3:2", hero: "16:9", thumbnail: "1:1" },
  treatment: "Architectural. Desaturated 20–30%. Contrast slightly high.",
  prohibited: "Lifestyle stock. No toasting glasses, no staged laughter.",
  reads: "Documentation of a place, not an advertisement for one.",
  /**
   * Commissioned per property, not drawn from a shared library.
   *
   * A shared library trends toward generic over time as properties arrive
   * from different photographers — which is exactly the drift the imagery
   * direction exists to prevent.
   */
  sourcing: "Commissioned once at onboarding. Re-commissioned only on material renovation.",
  library: false,
} as const;

// ─────────────────────────────────────────────────────────────────────
// PRINT & EMAIL
// ─────────────────────────────────────────────────────────────────────

export const PRINT = {
  mode: "Forces Concrete (paper ground).",
  chrome: "Dropped.",
  truncation: "Every truncation expanded.",
  /** The reason print exists at all: a figure on paper has no tooltip. */
  provenance: "Every figure's provenance printed as a footnote.",
} as const;

export const PDF_REPORT = {
  issued: true,
  basis: "The Executive Print Mode assembly, given a cover and running heads.",
  cover: "Masthead built from the vehicle object card.",
  runningHead: "Vehicle name and reporting period.",
  footer: "Page number and the same footnoted provenance as print.",
  rationale: "Not new surface area — the minimum that makes print a mailable document.",
} as const;

/**
 * Seven transactional emails, all rendered from the notification escalation
 * ladder so email tone matches in-app tone exactly.
 *
 * Note what is in the list: `distributionBlocked` sits beside
 * `distributionExecuted`. A member whose expected distribution did not
 * arrive is owed the reason, by email, without having to log in and look.
 */
export const EMAILS = [
  { id: "capital-call", subject: "Capital call notice", escalation: "warning" },
  { id: "distribution-executed", subject: "Distribution executed", escalation: "success" },
  { id: "distribution-blocked", subject: "Distribution held, and why", escalation: "warning" },
  { id: "accreditation-expiring", subject: "Accreditation expiring", escalation: "warning" },
  { id: "ballot-open", subject: "Ballot open", escalation: "info" },
  { id: "resolution-published", subject: "Resolution published", escalation: "info" },
  { id: "reserve-breach", subject: "Reserve breach broadcast", escalation: "critical" },
] as const;
