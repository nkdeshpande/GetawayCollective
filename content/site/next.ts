/**
 * THE NEXT STEP — one card at the foot of each text page
 *
 * 25 Sep 2026 (Next Actions d01, d03). Chosen by where the reader is on the
 * path the site is built around, so a page never simply ends:
 *
 *   Discover → Understand → Examine → Qualify → Commit → Hold
 *
 * The stage names the card; the card names one page, never a menu. Pages
 * that end on their own action (contact, the Signal, an estate, a pipeline
 * estate, status) carry none. A Journal entry's card is chosen in
 * app/_assemblies/site/pages.tsx: the estate the entry leads to, if any.
 */

import type { NextStep } from "@/app/_assemblies/site/types";

export const STAGES = ["Discover", "Understand", "Examine", "Qualify", "Commit", "Hold"] as const;

const COLLECTION: NextStep = { stage: "Examine", title: "The estates", text: "Every estate, where it stands, side by side.", href: "/collection" };
const HOW: NextStep = { stage: "Understand", title: "How it works", text: "Units, the waterfall, decisions and nights, end to end.", href: "/how-it-works" };
const ANSWERS: NextStep = { stage: "Understand", title: "Answers", text: "The questions people ask most, each with its source.", href: "/answers" };

export const NEXT: Readonly<Record<string, NextStep>> = {
  "/about": COLLECTION,
  "/team": { stage: "Discover", title: "How we build", text: "From a confirmed site record to one coordinated model.", href: "/how-we-build" },
  "/how-we-build": COLLECTION,
  "/press": { stage: "Discover", title: "About Getaway Collective", text: "Who we are, and what we do not do.", href: "/about" },
  "/journal": COLLECTION,
  "/how-it-works": { stage: "Qualify", title: "How to qualify", text: "Three steps to owning, and what the same sum does four ways.", href: "/how-to-qualify" },
  "/how-to-qualify": { stage: "Qualify", title: "Questions before you begin", text: "Investor Relations replies on working days, in writing.", href: "/contact" },
  "/operating-partner": HOW,
  "/careers": { stage: "Discover", title: "About Getaway Collective", text: "Who we are, and what we do not do.", href: "/about" },
  "/answers": HOW,
  "/glossary": ANSWERS,
  "/legal": ANSWERS,
};

/** Legal documents all lead to the answers; everything else is listed above or has no card. */
export const nextFor = (path: string): NextStep | undefined =>
  NEXT[path] ?? (path.startsWith("/legal/") ? ANSWERS : undefined);

/**
 * Which stage of the path a page belongs to, for the marker in the site bar
 * (d03). Pages outside the path — contact, status, a 404 — have none.
 * "Hold" is the partner's workspace, which wears the rails, not this bar.
 */
export function stageOf(path: string): { n: number; name: (typeof STAGES)[number] } | undefined {
  const at = (name: (typeof STAGES)[number]) => ({ n: STAGES.indexOf(name) + 1, name });
  if (/^\/collection\/[a-z0-9-]+\/enquire$/.test(path)) return at("Commit");
  if (/^\/collection(\/|$)/.test(path)) return at("Examine");
  if (/^\/(how-to-qualify|sign-in|verify)$/.test(path)) return at("Qualify");
  if (/^\/(how-it-works|answers|glossary|operating-partner)$/.test(path) || /^\/legal(\/|$)/.test(path)) return at("Understand");
  if (/^\/($|about$|team$|press$|how-we-build$|signal$|journal(\/|$))/.test(path)) return at("Discover");
  return undefined;
}
