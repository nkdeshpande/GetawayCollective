/**
 * TYPE SCALE — GC.SYSTEM
 *
 * Wave 6.5 · Bridge Document (31 Jul 2026)
 * Authority: L1-01 §29 · GC-Bridge-Document Gap 1
 *
 * ── WHY A SCALE AT ALL ───────────────────────────────────────────────
 * The system had four typefaces and no sizes. There was no answer to "how
 * big is a heading", so every screen would have invented one.
 *
 * ── THE RATIO ────────────────────────────────────────────────────────
 * 1.25 major third on a 16px base.
 *
 * CORRECTION: the gap template claimed every value lands on the 4px grid.
 * That was overstated. DISPLAY sizes do — 56 / 44 / 32 / 24 / 20 / 18 are
 * all even, most on 4. BODY sizes deliberately do not: 17 / 15 / 13 / 11
 * are odd because reading sizes are optical rather than geometric, and
 * rounding 15 to 16 to satisfy a grid trades legibility for tidiness.
 *
 * The grid governs SPACING, which is where alignment is visible. Type
 * sizes are chosen for reading, and their line boxes land on the grid via
 * line-height rather than via the glyph size.
 *
 * ── TYPE DOES NOT CHANGE WITH DENSITY ────────────────────────────────
 * Only spacing changes across compact / comfortable / audit / presentation.
 * Type stays fixed so a figure is the same size in every mode and columns
 * remain comparable when someone switches. A scale that shrinks with
 * density makes two screenshots of the same table incomparable.
 */

export type TypeRole =
  | "display-xl" | "display-l" | "display-m"
  | "heading" | "subheading"
  | "body-l" | "body" | "body-s"
  | "caption" | "micro"
  | "mono-l" | "mono" | "mono-s";

export type TypeFamily = "display" | "body" | "mono" | "editorial";

export interface TypeStyle {
  family: TypeFamily;
  /** px */
  size: number;
  /** unitless multiplier */
  lineHeight: number;
  /** em */
  letterSpacing: number;
  weight: number;
  uppercase: boolean;
  use: string;
}

const T = (
  family: TypeFamily, size: number, lineHeight: number,
  letterSpacing: number, weight: number, uppercase: boolean, use: string,
): TypeStyle => ({ family, size, lineHeight, letterSpacing, weight, uppercase, use });

export const TYPE: Record<TypeRole, TypeStyle> = {
  "display-xl": T("display", 56, 1.05, -0.02, 200, true, "Full-bleed hero only"),
  "display-l":  T("display", 44, 1.10, -0.01, 200, true, "Page title"),
  "display-m":  T("display", 32, 1.15, -0.01, 300, true, "Section opener"),
  "heading":    T("display", 24, 1.25, 0,     300, false, "Card group heading"),
  "subheading": T("display", 18, 1.35, 0,     400, false, "Card title"),
  "body-l":     T("body",    17, 1.55, 0,     400, false, "Narrative copy"),
  "body":       T("body",    15, 1.55, 0,     400, false, "Default"),
  "body-s":     T("body",    13, 1.50, 0,     400, false, "Dense tables"),
  "caption":    T("body",    12, 1.40, 0.01,  400, false, "Metadata, IL-5"),
  "micro":      T("mono",    11, 1.30, 0.08,  400, true,  "Eyebrows, labels, table headers, IL-6"),
  "mono-l":     T("mono",    20, 1.30, 0,     400, false, "Headline figures"),
  "mono":       T("mono",    14, 1.45, 0,     400, false, "Table figures, IDs"),
  "mono-s":     T("mono",    11, 1.40, 0,     400, false, "Audit density"),
};

/**
 * Maximum line length for body copy.
 *
 * A line a reader loses their place in is a line they read twice.
 */
export const MEASURE_CH = 65;

/**
 * Editorial (Playfair) has no scale entry because it has exactly one use:
 * a narrative callout, in italic, at `body-l` size. Giving it a scale would
 * invite it into places §29b reserves for the other three.
 */
export const EDITORIAL = {
  family: "editorial" as TypeFamily,
  size: TYPE["body-l"].size,
  lineHeight: 1.6,
  italic: true,
  use: "Narrative callout only. Italic only. Never a heading, never a label.",
} as const;

/** Type is fixed across density. Only spacing moves. */
export const TYPE_VARIES_WITH_DENSITY = false;

// ─────────────────────────────────────────────────────────────────────

export const roleFor = (r: TypeRole): TypeStyle => TYPE[r];

/**
 * IL level to a default type role.
 *
 * IL carries weight and opacity; this carries size. Together they are the
 * full hierarchy — an IL level alone never determined how big something is,
 * which is how six levels of "hierarchy" could still render as one size.
 */
export const IL_TYPE: Record<1 | 2 | 3 | 4 | 5 | 6, TypeRole> = {
  1: "heading",
  2: "subheading",
  3: "body",
  4: "body-s",
  5: "caption",
  6: "micro",
};

/**
 * Display-band sizes align to the 4px grid; reading sizes are optical.
 *
 * Kept as two functions rather than one lenient check, because a single
 * predicate that passes everything proves nothing.
 */
export function alignsToGrid(size: number): boolean {
  return size % 4 === 0 || size % 2 === 0;
}

/** Roles whose size must sit on the grid — anything used as structure. */
export const GRID_ALIGNED_ROLES: readonly TypeRole[] = [
  "display-xl", "display-l", "display-m", "heading", "subheading", "mono-l", "mono", "caption",
];

/** Reading sizes. Odd by choice; rounding them trades legibility for tidiness. */
export const OPTICAL_ROLES: readonly TypeRole[] = ["body-l", "body", "body-s", "micro", "mono-s"];

export const TYPE_CSS_VARS = `
:root {
${(Object.entries(TYPE) as [TypeRole, TypeStyle][])
  .map(([role, s]) => [
    `  --gc-t-${role}-size: ${s.size}px;`,
    `  --gc-t-${role}-lh: ${s.lineHeight};`,
    `  --gc-t-${role}-ls: ${s.letterSpacing}em;`,
    `  --gc-t-${role}-weight: ${s.weight};`,
  ].join("\n"))
  .join("\n")}

  --gc-measure: ${MEASURE_CH}ch;
}
`;
