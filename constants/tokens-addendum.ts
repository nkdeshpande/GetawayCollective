/**
 * GC.SYSTEM — ADDENDUM A
 * Motion · Overlays · Notifications · Brand · Full-Bleed
 *
 * Wave 4 · Primitive Surface
 * SOURCE: GC-DesignSystem-Canonical.html + GC-DesignSystem-Addendum-Motion-Brand.html
 *
 * ── WHY A SEPARATE FILE ──────────────────────────────────────────────
 * Both source documents declare themselves "COMPLEMENTARY — NON-BREAKING.
 * NO PRIOR RULE ALTERED." Keeping them in a separate module makes that
 * relationship structural rather than a claim in a comment: nothing here
 * can shadow a core token, because the core file does not import this one.
 *
 * The canonical document was checked value-by-value against
 * `constants/tokens.ts` before any of this was written. **Zero drift** —
 * all 17 core colours, 4 typefaces, 10 spacing steps, 2 curves and 4
 * durations matched exactly. §29 supremacy is intact and untouched.
 *
 * What follows is what the core file referenced but never specified.
 */

import { COLOUR } from "./tokens";

// ─────────────────────────────────────────────────────────────────────
// A · MOTION — the four curves
// ─────────────────────────────────────────────────────────────────────

/**
 * Cinema and Shutter are unchanged from Tier 01. Settle and Alert are new.
 *
 * Note what Alert is for and what it is barred from: it carries the only
 * overshoot permitted anywhere in GC, and it is **never used on financial
 * data**. A number that bounces reads as a number that is still deciding.
 */
export const EASE = {
  cinema: "cubic-bezier(0.16, 1, 0.3, 1)",      // 600ms · scroll reveals, entrances
  shutter: "cubic-bezier(0.9, 0, 0.2, 1)",      // 240ms · hard interruptions
  settle: "cubic-bezier(0.22, 1, 0.36, 1)",     // 320ms · drawers, dropdowns. Arrives and stops
  alert: "cubic-bezier(0.68, -0.4, 0.32, 1.4)", // 280ms · NOTIFICATIONS ONLY. Never on money
} as const;

export const DURATION = {
  instant: "120ms",
  press: "80ms",
  fast: "240ms",
  alert: "280ms",
  settle: "320ms",
  cinema: "600ms",
  toast: "4200ms",
  commit: "3000ms", // The Piston. Never shortened, not even under reduced motion.
} as const;

/** Named transition patterns. Two engineers must not invent two page wipes. */
export const TRANSITION_PATTERNS = {
  "MT-01": {
    name: "Shutter Wipe",
    use: "Full route change between Visual Modes",
    spec: "Hard horizontal wipe, ease-shutter, 240ms",
    rule: "Never a cross-fade.",
  },
  "MT-02": {
    name: "Cinema Reveal",
    use: "Scroll-triggered entrance for hero copy, Decision Cards, Narrative Panels",
    spec: "Fields reveal top-to-bottom, 80ms stagger, ease-cinema",
    rule: "Entrance only. Never on re-render.",
  },
  "MT-03": {
    name: "Lens Cross-fade",
    use: "Switching Trinity Lens tabs (Space / Capital / Time)",
    spec: "Cross-fade 160ms, no movement",
    rule: "Content changes in place. Chrome never moves.",
  },
  "MT-04": {
    name: "Piston Commit",
    use: "Capital commitment hold",
    spec: "Linear fill, 3000ms, NO easing",
    rule:
      "The one deliberately linear motion in GC. A capital commitment must never feel " +
      "accelerated or eased toward completion — easing would make the last second feel " +
      "shorter than the first, and the whole point of the hold is that it does not.",
  },
} as const;

/** Micro-interaction choreography. */
export const MICRO = {
  hover: { duration: "120ms", curve: "linear", note: "Instant inversion. GC reacts, it does not ease into hover." },
  focus: { duration: "0ms", curve: "none", note: "Border thickens 1px to 2px immediately. No glow, no colour shift." },
  press: { duration: "80ms", curve: EASE.shutter, note: "Slight inset. Never a scale-down bounce." },
  loading: { duration: "continuous", curve: "linear", note: "Mono ellipsis cycle. Never a spinner graphic." },
  success: { duration: "240ms", curve: EASE.settle, note: "Confirm fill, settles once, does not pulse." },
  error: { duration: "280ms", curve: EASE.alert, note: "The only place overshoot is permitted." },
} as const;

/**
 * REDUCED MOTION CONTRACT
 *
 * All four curves collapse to a one-frame opacity cross-fade — except the
 * Piston, which keeps its full 3000ms. Capital commitment is never
 * shortened for anyone. Under reduced motion the fill becomes a static
 * countdown numeral instead of an animated bar: same deliberation, no
 * movement.
 */
export const REDUCED_MOTION = {
  collapseTo: "1-frame opacity cross-fade",
  pistonDuration: DURATION.commit,
  pistonPresentation: "static countdown numeral",
  rationale: "Capital commitment is never shortened. The deliberation is the point, not the animation.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// B · OVERLAYS
// ─────────────────────────────────────────────────────────────────────

export const BACKDROP = {
  dim: "rgba(10,10,10,0.55)",
  blur: "10px",
  glassBlur: "12px",
} as const;

/**
 * Dismissal is keyed to how REVERSIBLE the action underneath is.
 *
 * That is the whole design: a filter can be dismissed by clicking away
 * because nothing is lost; a capital commitment cannot, because a stray
 * click would discard a deliberate hold.
 */
export const OVERLAYS = {
  "OV-01": {
    name: "Decision Modal",
    spec: "Copper top-border marks a Decision surface. Backdrop dims 55%, blurs 10px.",
    why: "Enough to signal interruption without hiding page state entirely.",
  },
  "OV-02": {
    name: "Drawer",
    spec: "Slides from the right, ease-settle, 320ms.",
    why: "Filters and secondary detail. The page beneath stays interactive.",
  },
  "OV-03": {
    name: "Full-Bleed Takeover",
    spec: "Entire viewport, no visible backdrop.",
    why: "Governance and AGM only. Ceremony-weight moments.",
  },
} as const;

export const DISMISSAL = {
  reversible: {
    clickOutside: true, escape: true,
    example: "A filter Drawer. Nothing is lost by dismissing it.",
  },
  capitalMoving: {
    clickOutside: false, escape: true,
    note: "Escape dismisses but requires re-arming the Piston FROM ZERO. No partial hold carries over.",
  },
  ceremony: {
    clickOutside: false, escape: false,
    note: "Dismissal only via an explicit Abstain or Close Ballot action inside the takeover.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// C · NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────

/** Four classes, escalating by how much of the interface they may claim. */
export const NOTIFICATIONS = {
  "NT-01": { name: "Toast", spec: "Bottom-right, ease-alert entry, auto-dismiss 4200ms unless hovered.",
             rule: "Never stacks more than 3. The fourth replaces the oldest." },
  "NT-02": { name: "Banner", spec: "Persistent, top-of-page, full-width.",
             rule: "Coloured by Semantic State ONLY, never by Signal colour." },
  "NT-03": { name: "Alert Center", spec: "Persistent log in the HUD Rail.",
             rule: "Every Toast and Banner also lands a row here, so nothing is missed by dismissing it." },
  "NT-04": { name: "Critical Alert", spec: "Full-width, non-dismissible until the condition clears.",
             rule: "Escalates from Banner when a Sovereign Override is in progress." },
} as const;

/**
 * Escalation ladder.
 *
 * Note the asymmetry: errors never get a Toast alone, because a Toast
 * auto-dismisses and an error that vanishes on a timer was never really
 * reported.
 */
export const ESCALATION = {
  info: "Toast only. No Alert Center row required unless the Member was offline when it fired.",
  success: "Toast only.",
  warning: "Toast + Alert Center row. Escalates to Banner if unacknowledged for 10 minutes.",
  error: "Banner + Alert Center row immediately. NEVER a Toast alone — errors do not get to auto-dismiss.",
  critical: "Critical Alert + forced Alert Center focus. May trigger Incident Command if 2 or more domains are affected.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// SEMANTIC LAYERS from the canonical document
// ─────────────────────────────────────────────────────────────────────

/** Semantic STATE — distinct from Signal colour. Notifications use these. */
export const STATE_COLOUR = {
  error: COLOUR.critical,
  success: COLOUR.confirm,
  info: COLOUR.electric,
  warning: "#D9A15C",  // Sand. Softer than hazard; warning is not risk.
  matrix: "#39FF6A",   // Terminal mode only.
} as const;

export const SURFACE = {
  quiet: COLOUR.paper,
  neutral: COLOUR.mist,
  decision: COLOUR.paperPanel,
  alert: "#FBEAE3",
} as const;

/**
 * Confidence colours map onto the provenance spine (`lib/provenance.ts`).
 *
 * Note `observed` and `verified` share a colour: both are facts about the
 * world rather than judgements, and the distinction between them is
 * carried by the label, not the hue.
 */
export const CONFIDENCE_COLOUR = {
  observed: COLOUR.confirm,
  verified: COLOUR.confirm,
  modelled: COLOUR.copper,
  estimated: COLOUR.electric,
  forecast: COLOUR.electric,
  pending: COLOUR.steel,
} as const;

export const HEALTH_COLOUR = {
  strong: COLOUR.confirm,
  adequate: COLOUR.copper,
  weak: COLOUR.hazard,
  critical: COLOUR.critical,
} as const;

/**
 * Risk category colours from the canonical document.
 *
 * ⚠️ These EIGHT do not match the TEN in `Risk.risk_category` (UFR-0440).
 * Overlapping: liquidity, legal, market, climate. Design-only: construction,
 * operational, reputation, compliance. Registry-only: interest_rate,
 * operator, currency, regulatory, technology, counterparty.
 *
 * Not reconciled here — the registry is ratified and the design document is
 * locked, so aligning them is a decision, not a refactor. Logged as an open
 * question. `RISK_COLOUR_FALLBACK` keeps the unmapped six rendering rather
 * than crashing.
 */
export const RISK_COLOUR: Record<string, string> = {
  liquidity: "#2061DE",
  construction: "#C79F6B",
  legal: "#6B6B6B",
  operational: "#E8672E",
  market: "#0C3024",
  reputation: "#8B5FBF",
  compliance: "#1FAA59",
  climate: "#2E8B7A",
};
export const RISK_COLOUR_FALLBACK = COLOUR.steel;

export const riskColour = (category: string): string => RISK_COLOUR[category] ?? RISK_COLOUR_FALLBACK;

/** Row heights per density mode. */
export const DENSITY_ROW = {
  compact: "28px",
  comfortable: "40px",
  presentation: "64px",
  audit: "22px",
} as const;
export const DENSITY_AUDIT_SIZE = "10px";

/** Visual modes, including the two the core file named but never valued. */
export const MODE_GROUND = {
  concrete: { bg: COLOUR.paperPanel, fg: COLOUR.ink },
  obsidian: { bg: COLOUR.void, fg: COLOUR.paper },
  immersive: { bg: "#000000", fg: "#FFFFFF" },
  terminal: { bg: "#05100A", fg: STATE_COLOUR.matrix },
} as const;

/** Stacking order. Declared once so no component invents a z-index. */
export const Z = {
  grid: 1,
  content: 10,
  hud: 100,
  overlay: 500,
  cursor: 999,
} as const;

// ─────────────────────────────────────────────────────────────────────
// D · BRAND
// ─────────────────────────────────────────────────────────────────────

export const BRAND = {
  wordmark: {
    spec: "Outfit 200, uppercase. The trailing period always rendered in Copper.",
    rule: "The only place a full stop is permitted as a brand device.",
  },
  clearspace: {
    minimum: "Equal to the cap-height of the G on all sides",
    minSize: "20px cap-height",
    rule: "Never on a photographic background without a solid or 70%-dim scrim.",
  },
  iconography: {
    spec: "1px stroke, square frame, no fills, no two-tone.",
    rule: "Glyphs come from the mono type set wherever possible, rather than a separate icon font.",
  },
  imagery: {
    spec: "Architectural. Desaturated 20-30%. Contrast pushed slightly high.",
    rule:
      "No lifestyle-stock cliches — no toasting glasses, no staged laughter. Imagery reads " +
      "like documentation of a place, not an advertisement for one.",
  },
} as const;

/**
 * ⚠️ VOICE CONFLICT — see the open questions list.
 *
 * Addendum A states: Sovereign ("never persuades"), Deterministic,
 * Unadorned.
 *
 * L1-02 Brand Constitution states: Intelligent, **Warm**, Unvarnished,
 * Collaborative, Patient.
 *
 * "Never persuades or hedges with marketing softeners" and "Warm" are not
 * obviously the same instruction. Both are ratified documents. Recorded
 * rather than silently reconciled — picking one would quietly overrule a
 * constitutional document.
 */
export const VOICE_ADDENDUM = {
  sovereign: "Copy states facts and terms. It never persuades or hedges with marketing softeners.",
  deterministic: "Every label describes exactly what happens next. No 'magic', no 'smart', no vague verbs.",
  unadorned:
    "One idea per sentence. Editorial italic is reserved for the rare moment of narrative warmth; " +
    "everywhere else, plain declarative sentences.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// E · FULL-BLEED
// ─────────────────────────────────────────────────────────────────────

export const FULL_BLEED = {
  "FB-01": { name: "Full-Bleed Hero", use: "The Root and Evidence Portfolio openers",
             spec: "Chrome reduced to a single top strip: wordmark and one wayfinding label only." },
  "FB-02": { name: "Full-Bleed Gallery Scroll", use: "Property Gallery and Space Hub only",
             spec: "Horizontal, edge-to-edge, no gutters.",
             rule: "Never used for a list of financial objects." },
  "FB-03": { name: "Full-Bleed Ceremony", use: "Governance and AGM",
             spec: "Reuses OV-03. The only case where full-bleed and an interruption overlay are the same surface." },
} as const;

/**
 * The two rules that stop full-bleed spreading into data-dense screens.
 *
 * FB-1 is the important one, and it is checkable: immersion and reading a
 * figure are different activities, and a layout that tries to do both does
 * neither.
 */
export const FULL_BLEED_RULES = {
  "FB-1":
    "Full-bleed is permitted only where ZERO numeric data is being read at that moment. " +
    "The instant a figure, table or Piston appears, the layout returns to Concrete or " +
    "Obsidian with normal margins.",
  "FB-2":
    "A full-bleed screen never scrolls past 3 viewport-heights before returning to a " +
    "bounded layout. Immersion is a threshold, not the whole of a screen.",
} as const;

// ─────────────────────────────────────────────────────────────────────

export const ADDENDUM_CSS_VARS = `
:root {
  /* A · Motion */
  --gc-ease-settle: ${EASE.settle};
  --gc-ease-alert: ${EASE.alert};
  --gc-dur-press: ${DURATION.press};
  --gc-dur-alert: ${DURATION.alert};
  --gc-dur-settle: ${DURATION.settle};
  --gc-dur-toast: ${DURATION.toast};

  /* B · Overlays */
  --gc-backdrop-dim: ${BACKDROP.dim};
  --gc-backdrop-blur: ${BACKDROP.blur};
  --gc-blur-glass: ${BACKDROP.glassBlur};

  /* Semantic state — notifications use these, never Signal colours */
  --state-error: ${STATE_COLOUR.error};
  --state-success: ${STATE_COLOUR.success};
  --state-info: ${STATE_COLOUR.info};
  --state-warning: ${STATE_COLOUR.warning};
  --state-matrix: ${STATE_COLOUR.matrix};

  --surface-quiet: ${SURFACE.quiet};
  --surface-neutral: ${SURFACE.neutral};
  --surface-decision: ${SURFACE.decision};
  --surface-alert: ${SURFACE.alert};

  /* Provenance */
  --conf-observed: ${CONFIDENCE_COLOUR.observed};
  --conf-verified: ${CONFIDENCE_COLOUR.verified};
  --conf-modelled: ${CONFIDENCE_COLOUR.modelled};
  --conf-estimated: ${CONFIDENCE_COLOUR.estimated};
  --conf-forecast: ${CONFIDENCE_COLOUR.forecast};
  --conf-pending: ${CONFIDENCE_COLOUR.pending};

  --health-strong: ${HEALTH_COLOUR.strong};
  --health-adequate: ${HEALTH_COLOUR.adequate};
  --health-weak: ${HEALTH_COLOUR.weak};
  --health-critical: ${HEALTH_COLOUR.critical};

  /* Density */
  --density-compact-row: ${DENSITY_ROW.compact};
  --density-comfortable-row: ${DENSITY_ROW.comfortable};
  --density-presentation-row: ${DENSITY_ROW.presentation};
  --density-audit-row: ${DENSITY_ROW.audit};
  --density-audit-size: ${DENSITY_AUDIT_SIZE};

  /* Stacking */
  --z-grid: ${Z.grid};
  --z-content: ${Z.content};
  --z-hud: ${Z.hud};
  --z-overlay: ${Z.overlay};
  --z-cursor: ${Z.cursor};
}

/* The Piston keeps its full duration. Capital commitment is never shortened. */
@media (prefers-reduced-motion: reduce) {
  :root {
    --gc-ease-cinema: linear;
    --gc-ease-shutter: linear;
    --gc-ease-settle: linear;
    --gc-ease-alert: linear;
    --gc-dur-instant: 1ms;
    --gc-dur-fast: 1ms;
    --gc-dur-settle: 1ms;
    --gc-dur-alert: 1ms;
    --gc-dur-cinema: 1ms;
    --gc-dur-commit: ${DURATION.commit};
  }
}
`;
