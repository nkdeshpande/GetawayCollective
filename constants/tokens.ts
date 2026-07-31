/**
 * GC Design System Tokens — v3.0 LOCKED
 *
 * SOLE SOURCE: GC-DesignSystem.html ("GC.SYSTEM — Canonical Design System v3.0 LOCKED")
 *
 * DESIGN SUPREMACY CLAUSE (L1 §29, ratified 30 Jul 2026):
 * That file overrides every design decision in every other document, without exception.
 * Where any brief, draft or future input conflicts with it, this file wins and the
 * other source is void on that point. Self-executing; no adjudication required.
 *
 * DEPRECATED — must never appear as token names, aliases or comments:
 *   Bone · Vantablack · Lichen · Cinnabar        (from "The Architecture of Silence")
 *   paper = #F4F4F0                              (void; paper is #F2F2F2)
 *
 * Immutable. Change requires constitutional amendment.
 */

// ── Colour Ontology ──────────────────────────────────────────────────
export const COLOUR = {
  // Permanent surfaces
  void: "#0A0A0A",        // Obsidian mode background
  voidPanel: "#121212",   // Obsidian panel
  paper: "#F2F2F2",       // Concrete mode background
  paperPanel: "#FFFFFF",  // Concrete panel
  mist: "#E8E8E6",        // Neutral surface

  // Text & hierarchy
  ink: "#0A0A0A",         // Primary text (light mode)
  inkInverse: "#F2F2F2",  // Primary text (dark mode)
  steel: "#6B6B6B",       // Dimmed text
  steelDim: "#9A9A9A",    // Further dimmed

  // Semantic bands (tied to business meaning, not UX preference)
  forest: "#0C3024",      // Heritage asset class, long-term holdings
  copper: "#C79F6B",      // Currency, capital, revenue, yield (NEVER elsewhere)
  electric: "#2061DE",    // Action, state transition, admin authority
  hazard: "#E8672E",      // Risk, warning, volatility, covenant proximity
  critical: "#FF3B30",    // System-critical alert ONLY (rarest colour)
  confirm: "#1FAA59",     // Settlement, success

  // ── Ground-specific variants — ADDITIVE, added 31 Jul 2026 ─────────
  //
  // NOT a change to any value above. Every original token keeps its exact
  // hex, so §29 Design Supremacy is intact: nothing was overridden, four
  // things were added.
  //
  // Why: a computed WCAG audit (scripts/token-lint.js) found four semantic
  // colours falling below AA on ONE of the two grounds, while clearing it
  // comfortably on the other. The worst was `forest` on `void` at 1.38:1 —
  // a dark green on near-black, effectively invisible in Obsidian mode.
  //
  // Each variant holds the original's HUE and SATURATION and moves only
  // lightness, to the first value clearing 4.5:1. They are the same colour,
  // legible on the ground the original could not survive.
  //
  // Use the original on its good ground and the variant on the other. The
  // rule that colour is never the only carrier of meaning still stands —
  // this widens where a signal can be seen, it does not license relying on
  // it alone.
  forestLight: "#228A68",   // forest on void:    1.38:1 -> 4.62:1
  copperDeep: "#8C6635",    // copper on paper:   2.18:1 -> 4.61:1
  confirmDeep: "#177F43",   // confirm on paper:  2.70:1 -> 4.52:1
  hazardDeep: "#BE4915",    // hazard on paper:   2.93:1 -> 4.52:1

  // Strokes & hairlines
  hairline: "rgba(10,10,10,0.12)",     // Light mode hairline
  hairlineInv: "rgba(242,242,242,0.14)", // Dark mode hairline
  strokeIdle: "1px",
  strokeActive: "2px",
} as const;

/**
 * Which token to use for a semantic colour on a given ground.
 *
 * Callers should reach for this rather than picking a hex, so the
 * ground-specific choice is made once here instead of remembered
 * everywhere.
 */
export const ON_GROUND = {
  void: { forest: "forestLight", copper: "copper", confirm: "confirm", hazard: "hazard" },
  paper: { forest: "forest", copper: "copperDeep", confirm: "confirmDeep", hazard: "hazardDeep" },
} as const;

// ── Typography ──────────────────────────────────────────────────────
export const FONT = {
  display: "'Outfit', 'Segoe UI Variable Display', -apple-system, sans-serif",
  body: "'Inter', 'Segoe UI Variable', -apple-system, sans-serif",
  mono: "'Space Mono', ui-monospace, 'Consolas', 'SFMono-Regular', monospace",
  editorial: "'Playfair Display', Georgia, serif",
} as const;

// ── Spacing (4px base unit) ──────────────────────────────────────────
export const SPACE = {
  "3xs": "4px",
  "2xs": "8px",
  xs: "12px",
  s: "16px",
  m: "24px",
  l: "32px",
  xl: "48px",
  "2xl": "64px",
  "3xl": "96px",
  "4xl": "128px",
} as const;

// ── Motion ──────────────────────────────────────────────────────────
export const MOTION = {
  ease: {
    cinema: "cubic-bezier(0.16, 1, 0.3, 1)",    // reveals, scroll-triggered
    shutter: "cubic-bezier(0.9, 0, 0.2, 1)",    // hard interruptions
  },
  duration: {
    instant: "120ms",
    fast: "240ms",
    cinema: "600ms",
    commit: "3000ms", // hold-to-confirm for capital-moving actions
  },
} as const;

// ── Radius ──────────────────────────────────────────────────────────
export const RADIUS = {
  none: "0px", // GC never rounds a corner; circles permitted only for status LEDs & Trinity Lens
} as const;

// ── Information Hierarchy (IL-1…IL-6) ───────────────────────────────
export const IL = {
  1: { weight: 700, opacity: 1.0 },      // Critical Decision
  2: { weight: 500, opacity: 1.0 },      // Primary Metric
  3: { weight: 400, opacity: 0.85 },     // Supporting Metric
  4: { weight: 400, opacity: 0.65 },     // Context
  5: { weight: 400, opacity: 0.45 },     // Metadata
  6: { weight: 400, opacity: 0.3 },      // Audit
} as const;

// ── Metric Grammar (semantic colour for numeric types) ───────────────
export const METRIC_COLOUR = {
  currency: COLOUR.copper,        // Revenue, cash, NPV, debt
  percentage: COLOUR.inkInverse,  // Occupancy, IRR, yield (on void)
  ratio: COLOUR.steel,            // Multiples, LTV, DSCR
  forecast: COLOUR.electric,      // Modeled/forward-looking figures
  risk: COLOUR.hazard,            // ADR volatility, covenant proximity
  loss: COLOUR.critical,          // Negative delta, impairment
} as const;

// ── Density Modes ────────────────────────────────────────────────────
export const DENSITY = {
  compact: "12px base, 8px spacing",      // Power users
  comfortable: "15px base, 16px spacing", // Default
  audit: "13px mono, 8px spacing",        // Data entry
  presentation: "18px base, 24px spacing", // Slides & reports
} as const;

// ── Visual Modes ─────────────────────────────────────────────────────
export const MODE = {
  concrete: "Light mode (paper bg, ink fg)",
  obsidian: "Dark mode (void bg, ink-inverse fg)",
  immersive: "Full-bleed mode (if used)",
} as const;

// ── Export as CSS custom properties (for runtime use) ──────────────────
export const CSS_VARS = `
:root {
  --gc-void: ${COLOUR.void};
  --gc-void-panel: ${COLOUR.voidPanel};
  --gc-paper: ${COLOUR.paper};
  --gc-paper-panel: ${COLOUR.paperPanel};
  --gc-mist: ${COLOUR.mist};

  --gc-ink: ${COLOUR.ink};
  --gc-ink-inverse: ${COLOUR.inkInverse};
  --gc-steel: ${COLOUR.steel};
  --gc-steel-dim: ${COLOUR.steelDim};

  --gc-forest: ${COLOUR.forest};
  --gc-copper: ${COLOUR.copper};
  --gc-electric: ${COLOUR.electric};
  --gc-hazard: ${COLOUR.hazard};
  --gc-critical: ${COLOUR.critical};
  --gc-confirm: ${COLOUR.confirm};

  --gc-forest-light: ${COLOUR.forestLight};
  --gc-copper-deep: ${COLOUR.copperDeep};
  --gc-confirm-deep: ${COLOUR.confirmDeep};
  --gc-hazard-deep: ${COLOUR.hazardDeep};

  --gc-hairline: ${COLOUR.hairline};
  --gc-hairline-inv: ${COLOUR.hairlineInv};

  --gc-f-display: ${FONT.display};
  --gc-f-body: ${FONT.body};
  --gc-f-mono: ${FONT.mono};
  --gc-f-editorial: ${FONT.editorial};

  --gc-sp-3xs: ${SPACE["3xs"]};
  --gc-sp-2xs: ${SPACE["2xs"]};
  --gc-sp-xs: ${SPACE.xs};
  --gc-sp-s: ${SPACE.s};
  --gc-sp-m: ${SPACE.m};
  --gc-sp-l: ${SPACE.l};
  --gc-sp-xl: ${SPACE.xl};
  --gc-sp-2xl: ${SPACE["2xl"]};
  --gc-sp-3xl: ${SPACE["3xl"]};
  --gc-sp-4xl: ${SPACE["4xl"]};

  --gc-stroke-idle: 1px;
  --gc-stroke-active: 2px;
  --gc-radius: ${RADIUS.none};

  --gc-ease-cinema: ${MOTION.ease.cinema};
  --gc-ease-shutter: ${MOTION.ease.shutter};
  --gc-dur-instant: ${MOTION.duration.instant};
  --gc-dur-fast: ${MOTION.duration.fast};
  --gc-dur-cinema: ${MOTION.duration.cinema};
  --gc-dur-commit: ${MOTION.duration.commit};
}

@media (prefers-color-scheme: dark) {
  :root {
    --gc-bg: var(--gc-void);
    --gc-bg-panel: var(--gc-void-panel);
    --gc-fg: var(--gc-ink-inverse);
    --gc-fg-dim: var(--gc-steel-dim);

    /* Ground-aware semantic aliases. A component uses --gc-currency and is
       legible on whichever ground it lands on, without choosing a hex. */
    --gc-heritage: var(--gc-forest-light);
    --gc-currency: var(--gc-copper);
    --gc-settled: var(--gc-confirm);
    --gc-risk: var(--gc-hazard);
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --gc-bg: var(--gc-paper);
    --gc-bg-panel: var(--gc-paper-panel);
    --gc-fg: var(--gc-ink);
    --gc-fg-dim: var(--gc-steel);

    --gc-heritage: var(--gc-forest);
    --gc-currency: var(--gc-copper-deep);
    --gc-settled: var(--gc-confirm-deep);
    --gc-risk: var(--gc-hazard-deep);
  }
}
`;
