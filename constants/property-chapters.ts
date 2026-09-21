/**
 * THE EIGHT CHAPTERS — how one property is read, in order
 *
 * Authority: constants/routes.ts GC-110 … GC-160, which already declared
 * this structure as "the vehicle, publicly: eight chapters (§8)" and gave
 * each route a note saying what it holds. Nothing here is invented; this
 * file makes the declared order navigable.
 *
 * ── WHY IT EXISTS, AND WHY IT IS FOUR AND NOT TEN ────────────────────
 * Ten routes per property were defined and reachable, and none of them led
 * anywhere: `/idea`, `/asset` and `/ownership` each rendered the SAME full
 * property page, and `/place`, `/life` and `/progress` rendered the generic
 * assembly stub. Wiring all ten made them navigable and made a second
 * problem obvious — six of them were a second telling of what
 * /collection/[vehicle] already says, under different names. "The Place"
 * beside a Place section. "Ownership" beside Vehicle.
 *
 * Retired by founder instruction, 21 Sep 2026. What is left is the
 * property itself and the three surfaces that are NOT on it: the
 * economics, the risk, and the way in. Four tabs, under the five-tab rule,
 * and each one somewhere a reader cannot already be.
 *
 * ── THE ORDER IS THE ARGUMENT ────────────────────────────────────────
 * The property, then the economics, then the risk, then the way in. Risk
 * sits before Enquire on purpose: a reader meets how this loses money
 * before they are asked for anything. That sequence is a position about
 * how an offering should be read, and reordering the tabs would quietly
 * change it, which is why the order lives in one place.
 */

import { ROUTES } from "./routes";

export type ChapterId = "opportunity" | "investment" | "risk" | "enquire";

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
  C("opportunity", "00", "The Property", "", "GC-110",
    "The place, the architecture, the specification and the vehicle — the whole property."),
  C("investment", "01", "The Investment", "/investment", "GC-140",
    "The six-stage waterfall and what actually arrives, every figure with its confidence."),
  C("risk", "02", "Risk", "/risk", "GC-145",
    "How this loses money, stated before anyone is asked for anything."),
  C("enquire", "03", "Enquire", "/enquire", "GC-160",
    "What an enquiry creates, stated before it asks for anything."),
] as const;

/**
 * THE FIVE-TAB CEILING — founder instruction, 21 Sep 2026.
 *
 * It was met once by GROUPING ten chapters into five parts, each named by
 * its first chapter and showing the span it covered: "00–02 Opportunity",
 * "03–05 The Idea". That worked, and it was solving the wrong problem.
 * The tabs were crowded because six of the chapters repeated what
 * /collection/[vehicle] already said, and grouping hid the repetition
 * instead of removing it.
 *
 * The six are retired. Four chapters remain, each one somewhere a reader
 * cannot already be, and the ceiling is met by there being less rather
 * than by the labels doing arithmetic.
 */
export const MAX_TABS = 5;

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

/*
 * Asserted at module load, for the same reason the route check below is:
 * a tab bar that is wrong still renders, is still clickable, and nothing
 * else notices.
 */
{
  if (CHAPTERS.length > MAX_TABS) {
    throw new Error(
      `${CHAPTERS.length} chapters, and the instruction is no more than ${MAX_TABS} tabs.`,
    );
  }
  /* Risk before Enquire. The whole point of the order is that a reader
     meets how this loses money before they are asked for anything. */
  const order = CHAPTERS.map((c) => c.id);
  if (order.indexOf("risk") > order.indexOf("enquire")) {
    throw new Error("Risk must come before Enquire. That ordering is the argument, not a layout.");
  }
}

const CANONICAL = new Set(ROUTES.map((r) => r.ia));
for (const c of CHAPTERS) {
  if (!CANONICAL.has(c.ia)) {
    throw new Error(
      `Chapter "${c.id}" names route ${c.ia}, which is not in constants/routes.ts. ` +
      `Either the route was removed or the chapter is wrong; the navigation cannot point at both.`,
    );
  }
}
