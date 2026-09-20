/**
 * THE LOGO SYSTEM — GC.SYSTEM
 *
 * Authority: Addendum A · BR-01 … BR-04 (constants/tokens-addendum.ts BRAND).
 * This file does not amend those rules. It makes them buildable.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────
 * Addendum A specified the brand mark in prose and nothing rendered it.
 * `app/icon.tsx` opened by saying so — "There is no logo file in this
 * repository yet" — and then drew "GC" in Georgia, a serif that is not one
 * of the system's four typefaces, on the favicon, the iOS icon and the
 * share card of a live investment platform. `.sysmark`, the wordmark on
 * every signed-in page, rendered at weight 500 with no trailing period.
 *
 * So three brand surfaces disagreed with the ratified mark and with each
 * other, because the mark existed only as a sentence. A rule with no
 * artefact and no gate is a preference.
 *
 * ── WHAT IS DERIVED, AND FROM WHAT ───────────────────────────────────
 * Every number here comes from a measurement or a ratified rule. The one
 * free decision is DEVICE_RATIO, and it states its reasoning.
 *
 *  - CAP_RATIO 0.676 is Outfit's own OS/2.sCapHeight (676) over its
 *    head.unitsPerEm (1000), read from the font binary this app ships,
 *    not assumed. BR-02 defines clearspace as the cap-height of the G, so
 *    clearspace is only computable once this number is real.
 *  - MIN_CAP_PX 20 is BR-02 verbatim.
 *  - The square is not a stylistic choice. RADIUS.none is invariant in
 *    this system, so the full stop BR-01 makes the brand device cannot be
 *    a round dot. A zero-radius system has square punctuation or it has an
 *    exception, and nobody ratified an exception.
 */

import { COLOUR } from "./tokens";

/* ── Measured metrics ───────────────────────────────────────────────── */

/**
 * Outfit cap-height as a fraction of font-size.
 *
 * Source: OS/2.sCapHeight 676 / head.unitsPerEm 1000, read from the woff2
 * this app serves. Stable across weights — cap-height is a family metric,
 * not a weight metric.
 */
export const CAP_RATIO = 0.676;

/** BR-02, verbatim: minimum reproduction size is 20px cap-height. */
export const MIN_CAP_PX = 20;

/**
 * The smallest font-size at which the wordmark may be set. Derived rather
 * than chosen: 20 / 0.676. Below this the wordmark is barred and THE DEVICE
 * is the only permitted mark.
 */
export const MIN_FONT_PX = Math.ceil((MIN_CAP_PX / CAP_RATIO) * 10) / 10;

/**
 * The device square, as a fraction of cap-height.
 *
 * THE ONE FREE DECISION IN THIS FILE, and it is not a taste call. A true
 * Outfit-200 period is close to a hairline; reproduced at the BR-02 floor
 * of 20px cap-height it reads as dirt on the screen rather than as the
 * brand device BR-01 says it is. Specified as a fraction of cap-height so
 * it scales with the mark rather than with the stem weight, and set large
 * enough to survive the floor.
 */
export const DEVICE_RATIO = 0.25;

/** Clearspace in px for a given font-size. BR-02: the cap-height of the G. */
export const clearspacePx = (fontPx: number): number => Math.round(fontPx * CAP_RATIO);

/** Device edge in px for a given font-size. */
export const devicePx = (fontPx: number): number =>
  Math.max(2, Math.round(fontPx * CAP_RATIO * DEVICE_RATIO));

/** The ratified weight of the wordmark. BR-01. */
export const MARK_WEIGHT = 200;

/* ── The three marks ────────────────────────────────────────────────── */

export type MarkId = "GC-MARK-01" | "GC-MARK-02" | "GC-MARK-03";

export interface Mark {
  readonly id: MarkId;
  readonly name: string;
  /** What it renders. */
  readonly form: string;
  /** Where it is the correct choice. */
  readonly use: readonly string[];
  /** Where it is the wrong choice. */
  readonly never: readonly string[];
  /** Smallest permitted size, in the unit that governs this mark. */
  readonly floor: string;
  /** The ratified rule it implements. */
  readonly authority: string;
}

export const MARKS: readonly Mark[] = [
  {
    id: "GC-MARK-01",
    name: "The Wordmark",
    form: "GETAWAY COLLECTIVE followed by the copper square. Outfit 200, uppercase.",
    use: [
      "The primary mark. Anywhere it fits.",
      "Signed-in chrome — the sysbar, the office spine, the investor header.",
      "The full-bleed hero strip (FB-01), where it is the only chrome permitted beside one wayfinding label.",
      "Documents, share cards and correspondence.",
    ],
    never: [
      "Below 20px cap-height. Use THE DEVICE.",
      "In any weight but 200. Bolding the wordmark makes it a heading.",
      "Without the copper square. The square is the mark, not decoration.",
      "On photography without a solid or 70%-dim scrim (BR-02).",
      "Letterspaced to fill a container. The tracking is part of the mark.",
    ],
    floor: "20px cap-height",
    authority: "BR-01 · BR-02",
  },
  {
    id: "GC-MARK-02",
    name: "The Monogram",
    form: "GC followed by the copper square, inside a 1px square frame. Outfit 200, uppercase.",
    use: [
      "Where the wordmark cannot fit but an identity is still required: favicon, iOS icon, avatar.",
      "The frame is BR-03 icon geometry — 1px stroke, square, no fill, no second colour.",
    ],
    never: [
      "As the primary mark on a page where the wordmark fits.",
      "With a filled frame, a rounded frame, or a second colour in the frame.",
      "In any face other than Outfit. It was Georgia until 20 Sep 2026.",
    ],
    floor: "16px frame — below that the frame and the square collide",
    authority: "BR-01 · BR-03",
  },
  {
    id: "GC-MARK-03",
    name: "The Device",
    form: "The copper square alone.",
    use: [
      "Only where BR-02 bars the wordmark: below 20px cap-height.",
      "As a list bullet, a state dot, or the mark on a surface too small for type.",
    ],
    never: [
      "Beside the wordmark or the monogram — they already contain it.",
      "In any colour but copper. A green or red square is a status indicator, not the brand.",
      "As a decorative motif repeated across a surface. One device, one place.",
    ],
    floor: "2px edge",
    authority: "BR-01 · BR-02",
  },
] as const;

/* ── Colour: the mark has exactly two ────────────────────────────────── */

/**
 * The wordmark takes the ground's own ink; the square is always copper.
 *
 * Copper is reserved by the colour ontology for "currency, capital,
 * revenue, yield (NEVER elsewhere)". The brand device is the single
 * ratified exception, declared by BR-01 rather than taken here — which is
 * why it is recorded as an exception instead of quietly widening the rule.
 */
export const MARK_COLOUR = {
  onVoid: { type: COLOUR.inkInverse, device: COLOUR.copper },
  /* copperDeep on paper: the original copper is 2.18:1 there. Same hue,
     same saturation, lightness moved to clear AA — tokens.ts already
     carries it for exactly this reason. */
  onPaper: { type: COLOUR.ink, device: COLOUR.copperDeep },
} as const;

export const COPPER_EXCEPTION =
  "Copper is reserved for currency. The brand device is the only non-financial use of it, " +
  "granted by BR-01, and the trailing period is the only place a full stop is permitted as " +
  "a brand device.";

/* ── Misuse, as a checkable list ─────────────────────────────────────── */

export interface Misuse {
  readonly id: string;
  readonly wrong: string;
  readonly why: string;
}

export const MISUSE: readonly Misuse[] = [
  { id: "MIS-01", wrong: "The wordmark in a serif.", why: "Georgia shipped on the favicon, the iOS icon and every share card until 20 Sep 2026. Outfit is the face." },
  { id: "MIS-02", wrong: "The wordmark without its square.", why: "BR-01 makes the trailing period the mark. Dropping it leaves set type, not a logo." },
  { id: "MIS-03", wrong: "The wordmark at weight 500, 600 or 700.", why: ".sysmark rendered at 500. At 600 the wordmark is indistinguishable from a page heading." },
  { id: "MIS-04", wrong: "A round device.", why: "RADIUS.none is invariant. A circle in this system is an exception nobody ratified." },
  { id: "MIS-05", wrong: "The device in a signal colour.", why: "A green square is settlement and a red square is critical. Only copper is the brand." },
  { id: "MIS-06", wrong: "The mark on photography without a scrim.", why: "BR-02 requires a solid or 70%-dim scrim. Contrast over a photograph is not predictable." },
  { id: "MIS-07", wrong: "The wordmark below 20px cap-height.", why: "BR-02 floor. Below it the mark is illegible, and THE DEVICE is what exists for that case." },
  { id: "MIS-08", wrong: "Clearspace smaller than the cap-height of the G.", why: "BR-02. Measured, now computable: 0.676 x font-size." },
] as const;

/** Faces that may never carry the mark. Checked by scripts/brand-lint.js. */
export const FORBIDDEN_MARK_FACES = ["Georgia", "Times", "Arial", "Helvetica"] as const;

export const BRAND_LAWS = {
  oneMarkPerSurface:
    "One mark per surface. A page carries the wordmark or the monogram, never both — two marks " +
    "read as two organisations.",
  theSquareIsTheMark:
    "The copper square is not punctuation and not decoration. BR-01 makes it the brand device, and " +
    "it is the only full stop permitted as one anywhere in the system.",
  derivedNotDrawn:
    "There is still no drawn logotype and this file does not pretend otherwise. The mark is the " +
    "type system set to the ratified spec. When a designed logotype exists it replaces the type, " +
    "and the clearspace, floor and device rules here survive unchanged.",
} as const;
