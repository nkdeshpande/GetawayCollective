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

  /*
   * THE NEUTRALS ALSO NEED A GROUND.
   *
   * ON_GROUND below remaps the ACCENTS for paper and always has. The
   * neutrals were left alone, on the assumption that a mid-grey is
   * safe against anything. It is not: steelDim is 7.04:1 on void and
   * 2.51:1 on paper, and every `.sec-ref` and table header on a paper
   * section was rendering at that second number.
   *
   * It was found by measuring a rendered page, not by reading the CSS.
   * The CSS looked right — .on-paper remapped .dim, .label, .il-5,
   * .il-6 and .conf one class at a time, and .sec-ref simply was not
   * on the list. An enumerated list is the wrong mechanism: it fails
   * silently every time a new class reaches for a neutral, and it will
   * keep doing so. These are redefined at the VARIABLE inside the
   * paper scope instead, so the ground fixes the value once and no
   * caller has to know which ground it is standing on.
   *
   * steel darkens further than it strictly needs to (it already passes
   * at 4.76:1) so that two distinct levels survive. Pulling steelDim
   * up to the threshold alone would have collapsed both to the same
   * grey — passing the check and losing the hierarchy it exists for.
   */
  steelOnPaper: "#565656",     // steel on paper:    4.76:1 -> 6.55:1
  steelDimOnPaper: "#6C6C6C",  // steelDim on paper: 2.51:1 -> 4.69:1

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

  // ── FIFTH VARIANT — added 31 Jul 2026 ─────────────────────────────
  //
  // Same construction, same reason, same guarantee: nothing above changed.
  //
  // The original four came from an audit of the semantic bands on both
  // grounds. `critical` was missed because it is the rarest colour in the
  // system and, at the time, appeared on no paper surface at all. The LLP
  // docket (AS-13) renders entirely on paper, and "Overdue" is the single
  // word on that screen most likely to be the reason someone opened it.
  //
  // 3.17:1 is below AA at any size. Hue (3.2°) and saturation (100%) held;
  // lightness moved 59% → 43.4%, the first value clearing 4.5 — exactly how
  // the other four were derived.
  criticalDeep: "#DD0C00",  // critical on paper: 3.17:1 -> 4.55:1

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
/*
 * These hold the COLOUR members themselves rather than their names as
 * strings. A mistyped name used to be `undefined` at runtime; now it
 * does not compile.
 */
export const ON_GROUND = {
  void: {
    forest: COLOUR.forestLight, copper: COLOUR.copper, confirm: COLOUR.confirm,
    hazard: COLOUR.hazard, critical: COLOUR.critical,
    steel: COLOUR.steel, steelDim: COLOUR.steelDim,
  },
  paper: {
    forest: COLOUR.forest, copper: COLOUR.copperDeep, confirm: COLOUR.confirmDeep,
    hazard: COLOUR.hazardDeep, critical: COLOUR.criticalDeep,
    steel: COLOUR.steelOnPaper, steelDim: COLOUR.steelDimOnPaper,
  },
} as const;

/**
 * WHICH NEUTRALS MAY SET TYPE, ON WHICH GROUND.
 *
 * steel is 3.72:1 on void — above the 3:1 a border or a rule needs, and
 * below the 4.5:1 type needs. That single fact was already governing the
 * stylesheet: on void, steel draws hairlines, waterfall bars, dividers
 * and disabled outlines, and never sets text. It was a convention held
 * in someone's head. A sweep of all 88 rendered routes confirms it is
 * kept everywhere, which is exactly why it was worth writing down before
 * it stopped being kept.
 *
 * On paper the same token resolves to steelOnPaper (#565656, 6.55:1) via
 * ON_GROUND, so there it may set type freely.
 *
 * token-lint reads this: "text" is held to 4.5:1, "non-text" to 3:1.
 * Promoting a pairing to "text" without giving it a variant that earns
 * the ratio is a build failure, not a judgement call.
 */
export const NEUTRAL_ROLE = {
  void: { steel: "non-text", steelDim: "text" },
  paper: { steel: "text", steelDim: "text" },
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

/**
 * The paper neutrals and accents, as CSS declarations.
 *
 * Emitted in TWO places below — the `.on-paper` scope, and the light
 * colour-scheme root — because a ground arrives by both routes and each
 * one needs the same remap. Built once here so they cannot drift.
 */
/* No type annotation: scripts/export-tokens.js evaluates this file as
   plain JS, stripping only `export` and `as const`. An annotation here
   is a syntax error there, and the failure is at generation time rather
   than compile time. */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
// @ts-expect-error - untyped on purpose; see the note above.
const scopeVars = (ground) =>
  Object.entries(ground)
    .map(([semantic, hex]) =>
      `  --gc-${semantic.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}: ${hex};`)
    .join("\n");

/**
 * The VOID scope, for a dark panel nested inside a paper section.
 *
 * .on-paper re-points the neutrals and accents for a light ground, and
 * that scope inherits into everything beneath it — including a panel
 * that is deliberately dark. The undrafted-clause panel on the Codex
 * rendered ink on void-panel at 1.06:1, and its critical accent came out
 * as the paper variant at 3.68:1.
 *
 * This is the exact mirror of the .panel.on-paper defect, and it is
 * fixed the same way: the ground restores its own values, so nesting
 * either way round is correct by construction rather than by the author
 * remembering which way round they are.
 */
const VOID_SCOPE_VARS = scopeVars(ON_GROUND.void);

const PAPER_SCOPE_VARS = scopeVars(ON_GROUND.paper);

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

  /* The paper scope re-points these; see steelOnPaper. It is emitted
     from ON_GROUND.paper at the end of this template, so the table
     stays the single place the mapping is stated. */

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
  --gc-critical-deep: ${COLOUR.criticalDeep};

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

  /* FONT was declared in this file and never emitted to CSS.
     Every \`var(--gc-font-*)\` therefore resolved to nothing, and an
     undefined value inside a \`font:\` shorthand invalidates the WHOLE
     declaration — so the application rendered in Times New Roman at
     16px with every type role collapsed. Nothing reported it, because
     no check reads a rendered page. */
  --gc-font-display: var(--font-display), ${FONT.display};
  --gc-font-body: var(--font-body), ${FONT.body};
  --gc-font-mono: var(--font-mono), ${FONT.mono};
  --gc-font-editorial: var(--font-editorial), ${FONT.editorial};

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

    /*
     * THE PAPER NEUTRALS DELIBERATELY DO NOT APPEAR HERE.
     *
     * They were added, and it broke 254 elements across 12 routes.
     * This block does not make the document paper — body stays void
     * under every colour scheme, because ground is decided per SECTION
     * by .on-paper, not per viewer by a media query. Re-pointing the
     * neutrals at root therefore painted the paper greys onto the void
     * ground everywhere the page was still dark: #6C6C6C on #0A0A0A is
     * 2.14:1.
     *
     * The aliases above are safe because each is already ground-aware
     * by construction. A raw neutral is not, and only the .on-paper
     * scope knows enough to re-point it.
     */
  }
}

/* ── The paper scope ───────────────────────────────────────────────
   Ground inversion is not a media query. A single screen carries both
   grounds at once — void for narrative, paper for financial assertion
   — so the paper neutrals have to travel with the SECTION, not with
   the viewer's colour-scheme preference.

   Generated from ON_GROUND.paper. Adding a token to that table is the
   whole of adding it here. */
.on-paper {
${PAPER_SCOPE_VARS}
}

/* A dark panel inside a paper section restores the dark ground.
   See the note beside VOID_SCOPE_VARS: without this the paper scope
   inherits into it and puts ink on a void panel at 1.06:1. */
.on-paper .on-panel {
  background: ${COLOUR.voidPanel};
  color: ${COLOUR.inkInverse};
${VOID_SCOPE_VARS}
}
`;
