/**
 * THE EIGHT CHAPTERS — how one property is read, in order
 *
 * Authority: constants/routes.ts GC-110 … GC-160, which already declared
 * this structure as "the vehicle, publicly: eight chapters (§8)" and gave
 * each route a note saying what it holds. Nothing here is invented; this
 * file makes the declared order navigable.
 *
 * ── WHY IT EXISTS ────────────────────────────────────────────────────
 * Ten routes per property were defined and reachable, and none of them led
 * anywhere. `/idea`, `/asset` and `/ownership` each rendered the SAME full
 * property page, so three URLs showed one page; `/place`, `/life` and
 * `/progress` rendered the generic assembly stub. The only navigation on
 * the property page was a spine of in-page anchors, which is a table of
 * contents for one page rather than a way between nine.
 *
 * So the information architecture existed on paper, in the route table,
 * and a reader could not walk it.
 *
 * ── THE ORDER IS THE ARGUMENT ────────────────────────────────────────
 * Place and Life come before The Idea, and The Idea comes before any
 * figure. Risk sits at 07, before Enquire at 08 — a reader meets how this
 * loses money before they are asked for anything. That sequence is a
 * position about how an offering should be read, and reordering the tabs
 * would quietly change it, which is why the order lives in one place.
 */

import { ROUTES } from "./routes";

export type ChapterId =
  | "opportunity" | "place" | "life" | "idea" | "asset"
  | "ownership" | "investment" | "risk" | "progress" | "enquire";

export interface Chapter {
  readonly id: ChapterId;
  /** The chapter number §8 gives it. `null` for the one surface outside the sequence. */
  readonly n: string | null;
  readonly label: string;
  /** Appended to `/collection/[vehicle]`. Empty string for the opening chapter. */
  readonly suffix: string;
  /** The permanent IA id of the route this is. Checked, not assumed. */
  readonly ia: string;
  /** What it holds — taken from the route's own note. */
  readonly holds: string;
}

const C = (
  id: ChapterId, n: string | null, label: string, suffix: string,
  ia: string, holds: string,
): Chapter => ({ id, n, label, suffix, ia, holds });

export const CHAPTERS: readonly Chapter[] = [
  C("opportunity", "00", "Opportunity", "", "GC-110",
    "Why this investment, why this place. The public aperture onto the vehicle."),
  C("place", "01", "The Place", "/place", "GC-112",
    "Land, water, light, approach — the place before the proposition."),
  C("life", "02", "The Life", "/life", "GC-114",
    "What it is to return here."),
  C("idea", "03", "The Idea", "/idea", "GC-116",
    "The investment thesis, in plain words, before any figure."),
  C("asset", "04", "The Asset", "/asset", "GC-120",
    "What is owned: land, build, fittings."),
  C("ownership", "05", "Ownership", "/ownership", "GC-130",
    "How participation works: the LLP, the unit, the ladder, the ceiling."),
  C("investment", "06", "The Investment", "/investment", "GC-140",
    "The six-stage waterfall and what actually arrives, every figure with its confidence."),
  C("risk", "07", "Risk", "/risk", "GC-145",
    "How this loses money, stated before anyone is asked for anything."),
  /* Outside the numbered sequence on purpose. The eight chapters are an
     argument; Progress is a report, and it is true on the day it is read
     rather than in the order it is read. */
  C("progress", null, "Progress", "/progress", "GC-150",
    "What exists today. Evidence, not a render of the finished thing."),
  C("enquire", "08", "Enquire", "/enquire", "GC-160",
    "What an enquiry creates, stated before it asks for anything."),
] as const;

/** The numbered argument, in order. Progress is deliberately not in it. */
export const NUMBERED = CHAPTERS.filter((c) => c.n !== null);

/* ── THE TABS: FIVE PARTS, NOT TEN CHAPTERS ──────────────────────────
 * Founder instruction, 21 Sep 2026: no more than five tabs.
 *
 * Ten tabs in a row is a filing system, and on a phone it is a row that
 * scrolls off the screen before a reader has seen where it ends. So the
 * TABS are five parts. The CHAPTERS are still ten, in the same order, at
 * the same URLs, with the same numbers — nothing about the argument moved.
 *
 * Three rules, each one asserted below and again in the tests:
 *
 *   1. A part is a CONTIGUOUS run of chapters, so reading the tabs left to
 *      right is still reading the argument in order.
 *   2. A part is named by its FIRST chapter and links to it. No label was
 *      invented for a group; every word on a tab is a chapter's own.
 *   3. RISK OPENS ITS OWN PART. The whole point of the order is that a
 *      reader meets how this loses money before they are asked for
 *      anything, and a Risk folded inside "The Investment" is a Risk
 *      nobody is shown. It stays a tab, and it stays before Enquire.
 *
 * The chapters inside a part are reached the way they always were: by the
 * onward control at the foot of each one. Nothing is orphaned — nextChapter
 * still walks all ten.
 */
export const MAX_TABS = 5;

export interface Part {
  /** The chapters it holds, in order. The first one names and opens it. */
  readonly chapters: readonly ChapterId[];
}

export const PARTS: readonly Part[] = [
  { chapters: ["opportunity", "place", "life"] },
  { chapters: ["idea", "asset", "ownership"] },
  { chapters: ["investment"] },
  { chapters: ["risk", "progress"] },
  { chapters: ["enquire"] },
];

export const chapterById = (id: ChapterId): Chapter =>
  CHAPTERS.find((c) => c.id === id)!;

/** Where a chapter lives for one property. The only place this is built. */
export const chapterHref = (slug: string, c: Chapter): string =>
  `/collection/${slug}${c.suffix}`;

/**
 * The next chapter, for the onward control at the foot of each one.
 * Returns null at the end rather than wrapping — a reader who has reached
 * Enquire is not sent back to Opportunity.
 */
export function nextChapter(id: ChapterId): Chapter | null {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return i >= 0 && i + 1 < CHAPTERS.length ? CHAPTERS[i + 1] : null;
}

/** The part a chapter belongs to. Every chapter has exactly one. */
export const partOf = (id: ChapterId): Part =>
  PARTS.find((p) => p.chapters.includes(id))!;

/** The chapter that names a part and that its tab links to. */
export const partHead = (p: Part): Chapter => chapterById(p.chapters[0]);

/**
 * The number a tab shows: the first chapter's, or the numbered span the
 * part covers. A reader landing on 02 should still be able to see that the
 * first tab is where 02 lives.
 */
export function partSpan(p: Part): string {
  const ns = p.chapters.map((id) => chapterById(id).n).filter((n): n is string => n !== null);
  if (ns.length === 0) return "";
  return ns.length === 1 ? ns[0] : `${ns[0]}–${ns[ns.length - 1]}`;
}

/*
 * The three rules, asserted at module load for the same reason the route
 * check below is: a tab bar that is wrong still renders, is still
 * clickable, and nothing else notices.
 */
{
  if (PARTS.length > MAX_TABS) {
    throw new Error(`${PARTS.length} parts, and the instruction is no more than ${MAX_TABS} tabs.`);
  }
  const flat = PARTS.flatMap((p) => p.chapters);
  const order = CHAPTERS.map((c) => c.id);
  if (flat.length !== order.length || flat.some((id, i) => id !== order[i])) {
    throw new Error(
      "PARTS must hold every chapter exactly once, as contiguous runs in chapter order. " +
      "Anything else reorders the argument without saying so.",
    );
  }
  if (partOf("risk").chapters[0] !== "risk") {
    throw new Error("Risk must open its own part. Folded inside another tab, it is a Risk nobody is shown.");
  }
}

/**
 * Every chapter names a route that exists.
 *
 * Asserted at module load rather than in a test, because the failure mode
 * is a navigation bar pointing at a 404 and nothing else notices: the tab
 * renders, it is clickable, and it is wrong.
 */
const CANONICAL = new Set(ROUTES.map((r) => r.ia));
for (const c of CHAPTERS) {
  if (!CANONICAL.has(c.ia)) {
    throw new Error(
      `Chapter "${c.id}" names route ${c.ia}, which is not in constants/routes.ts. ` +
      `Either the route was removed or the chapter is wrong; the navigation cannot point at both.`,
    );
  }
}
