/**
 * THE LOGO SYSTEM — GC.SYSTEM
 *
 * Authority: Addendum A · BR-01 … BR-04 (constants/tokens-addendum.ts BRAND),
 * as amended by L1-01 §29-0b on 24 Sep 2026.
 *
 * ── WHAT CHANGED ON 24 SEP 2026 ──────────────────────────────────────
 * Until that date there was no drawn logotype: the mark was the type
 * system set to spec — Outfit 200, uppercase, a copper square after it.
 * This file said so, and said that when a designed logotype existed it
 * would replace the type while the clearspace, floor and device rules
 * survived unchanged. That is what happened.
 *
 * The drawn mark is R5 · One angle: a box with a 1×2 chamfer at the top
 * left and the bottom right, and a skylight shaft cut through it that
 * rises straight and turns once, at the one angle the chamfers share.
 * Every point sits on an 11-unit module of a 100-unit square. The shaft is
 * the device, and it is the only non-financial use of copper.
 *
 * The lockup (02C) sets GETAWAY in Inter Tight 800 over COLLECTIVE in
 * Inter Tight 100, beside the mark. One line in chrome, two lines where
 * there is space.
 *
 * ── WHAT IS DERIVED, AND FROM WHAT ───────────────────────────────────
 *  - CAP_RATIO 0.727 is Inter's sCapHeight over its em (2048 / 2816 in
 *    the Inter 3.19 master Inter Tight is cut from). To be re-read from
 *    the shipped binary when one is vendored; next/font fetches it at
 *    build, so it is not in the repository to measure.
 *  - MIN_CAP_PX 20 is BR-02 verbatim.
 *  - The corners are cut, never rounded. RADIUS.none is invariant; the
 *    chamfer is how a zero-radius system softens a corner.
 */

import { COLOUR } from "./tokens";

/* ── The drawn mark ─────────────────────────────────────────────────── */

/** The box, chamfered top-left and bottom-right, on the 11-unit module. */
export const MARK_BOX = "M17 6H94V72L83 94H6V28Z";
/** The skylight: up from the floor, then one turn at the chamfers' angle. */
export const MARK_CUT = "M28 83V61L50 17H72L50 61V83Z";
/** The box with the cut taken out of it — what renders in ink. */
export const MARK_PATH = `${MARK_BOX} ${MARK_CUT}`;

/* ── Measured metrics ───────────────────────────────────────────────── */

/** Inter Tight cap-height as a fraction of font-size. */
export const CAP_RATIO = 0.727;

/** BR-02: the wordmark is never set smaller than a 20px cap-height. */
export const MIN_CAP_PX = 20;

/** The smallest font-size at which the wordmark clears BR-02. */
export const MIN_FONT_PX = Math.ceil((MIN_CAP_PX / CAP_RATIO) * 10) / 10;

/** The mark's edge, as a fraction of the cap-height it sits beside. */
export const DEVICE_RATIO = 1.25;

/** Clearspace on every side: the cap-height of the G (BR-02). */
export const clearspacePx = (fontPx: number): number => Math.round(fontPx * CAP_RATIO);

/** The drawn mark's edge beside type of a given size. Never under 2px. */
export const devicePx = (fontPx: number): number =>
  Math.max(2, Math.round(fontPx * CAP_RATIO * DEVICE_RATIO));

/** GETAWAY is set at 800 and COLLECTIVE at 100. Both must be loaded. */
export const MARK_WEIGHT = 800;
export const MARK_WEIGHT_THIN = 100;

/* ── The three marks ────────────────────────────────────────────────── */

export type MarkId = "GC-MARK-01" | "GC-MARK-02" | "GC-MARK-03";

export interface Mark {
  readonly id: MarkId;
  readonly name: string;
  readonly form: string;
  readonly use: readonly string[];
  readonly never: readonly string[];
  readonly floor: string;
  readonly authority: string;
}

export const MARKS: readonly Mark[] = [
  {
    id: "GC-MARK-01",
    name: "The Wordmark",
    form: "The drawn mark beside GETAWAY in Inter Tight 800 and COLLECTIVE in Inter Tight 100, uppercase. One line in chrome; two lines (02C) where there is space.",
    use: [
      "The primary mark. Anywhere it fits.",
      "The site bar, the signed-in chrome, documents, share cards and correspondence.",
    ],
    never: [
      "Below 20px cap-height. Use THE MONOGRAM.",
      "With both words at one weight. The contrast between 800 and 100 is the mark.",
      "Without the drawn mark beside it, where the mark fits.",
      "Over a photograph. The site carries no words on a picture (ruling of 21 Sep 2026).",
      "Letterspaced to fill a container. The tracking is part of the mark.",
    ],
    floor: "20px cap-height",
    authority: "BR-01 · BR-02",
  },
  {
    id: "GC-MARK-02",
    name: "The Monogram",
    form: "The drawn mark alone: the chamfered box with the skylight cut through it, the cut in copper.",
    use: [
      "Where the wordmark cannot fit but an identity is still required: favicon, iOS icon, avatar.",
      "On a map, as the estate's own pin.",
    ],
    never: [
      "As the primary mark on a page where the wordmark fits.",
      "With rounded corners. The chamfer is the only softening the system allows.",
      "Redrawn off the 11-unit module. Every point is on it.",
    ],
    floor: "16px edge — below that the cut closes up",
    authority: "BR-01 · BR-03",
  },
  {
    id: "GC-MARK-03",
    name: "The Device",
    form: "The copper skylight, the cut that rises straight and turns once.",
    use: [
      "Inside the mark, always.",
      "Alone only where the mark itself is too small to read: a state dot, a list bullet.",
    ],
    never: [
      "Beside the mark or the wordmark — they already contain it.",
      "In any colour but copper. A green or red shaft is a status indicator, not the brand.",
      "As a decorative motif repeated across a surface. One device, one place.",
    ],
    floor: "2px edge",
    authority: "BR-01 · BR-02",
  },
] as const;

/* ── Colour, by ground ──────────────────────────────────────────────── */

export const MARK_COLOUR = {
  onVoid: { type: COLOUR.inkInverse, device: COLOUR.copper },
  /* copperDeep: the same hue and saturation, lightness moved to clear AA on
     paper — tokens.ts already carries it for exactly this reason. */
  onPaper: { type: COLOUR.ink, device: COLOUR.copperDeep },
} as const;

export const COPPER_EXCEPTION =
  "Copper is reserved for currency. The brand device is the only non-financial use of it, " +
  "granted by BR-01 as amended: the skylight cut in the drawn mark is the only place copper " +
  "carries the brand.";

/* ── Misuse, recorded because each one happened or nearly did ───────── */

export interface Misuse {
  readonly id: string;
  readonly wrong: string;
  readonly why: string;
}

export const MISUSE: readonly Misuse[] = [
  { id: "MIS-01", wrong: "The wordmark in a serif.", why: "Georgia shipped on the favicon, the iOS icon and every share card until 20 Sep 2026. Inter Tight is the face." },
  { id: "MIS-02", wrong: "The wordmark without the drawn mark.", why: "Since 24 Sep 2026 the drawn mark is the logotype. The words alone are set type, not the brand." },
  { id: "MIS-03", wrong: "Both words at one weight.", why: "GETAWAY at 800 over COLLECTIVE at 100 is the lockup. At one weight it reads as a heading." },
  { id: "MIS-04", wrong: "A rounded corner on the mark.", why: "RADIUS.none is invariant. The mark softens by a chamfer, and only by a chamfer." },
  { id: "MIS-05", wrong: "The device in a signal colour.", why: "A green shaft is settlement and a red one is critical. Only copper is the brand." },
  { id: "MIS-06", wrong: "The mark laid over a photograph.", why: "The ruling of 21 Sep 2026 takes words off pictures. The mark sits on a solid bar above or below." },
  { id: "MIS-07", wrong: "The wordmark below 20px cap-height.", why: "BR-02 floor. Below it the lockup is illegible, and THE MONOGRAM is what exists for that case." },
  { id: "MIS-08", wrong: "Clearspace smaller than the cap-height of the G.", why: "BR-02. Computable: 0.727 x font-size, from Inter's own cap-height." },
] as const;

/** Faces that have carried, or nearly carried, the mark. Never again. */
export const FORBIDDEN_MARK_FACES = ["Georgia", "Times", "Arial", "Helvetica", "Outfit"] as const;

export const BRAND_LAWS = {
  oneMarkPerSurface:
    "One mark per surface. A page carries the wordmark or the monogram, never both — two marks " +
    "read as two organisations.",
  theCutIsTheDevice:
    "The copper skylight is not decoration. BR-01 as amended makes it the brand device, and it " +
    "is the only place copper carries the brand anywhere in the system.",
  drawnNotDerived:
    "The logotype is drawn: R5 · One angle, ratified 24 Sep 2026 under L1-01 §29-0b. It replaced " +
    "the set type exactly as this file said it would, and the clearspace, floor and device rules " +
    "survive unchanged.",
} as const;
