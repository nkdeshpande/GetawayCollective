/**
 * THE JOURNAL
 *
 * Wave 7 · Content
 *
 * The platform's written record. Not marketing, and not a blog: each
 * entry explains one decision that is already binding somewhere in the
 * constitution, the registries or the application, and says what it
 * costs.
 *
 * ── THE RULE THIS FILE IS ARRANGED AROUND ────────────────────────────
 * An entry may explain a rule. It may not create one. Where an entry
 * states a figure or a threshold, that figure is imported from the
 * canon rather than typed here — see the `cites` field, which is checked
 * at load. Prose that quietly disagreed with the registry would be the
 * most persuasive wrong number on the platform, because it would be the
 * one written to be readable.
 *
 * ── WHY NOT TESTIMONIALS ─────────────────────────────────────────────
 * Voices (AS-24) carries what partners say. The Journal carries what the
 * platform says about itself, which is a different kind of speech with
 * different obligations: a testimonial about returns is regulated, and
 * an explanation of a mechanism is not. Keeping them in separate files
 * keeps the two from drifting into one another.
 */

import { WATERFALL, inr } from "../app/_assemblies/data";
import { DSCR, UNIT, MY_YIELD_BPS, SITE, DEPOSIT } from "../app/_assemblies/slowspace";
import type { JournalMeta } from "../constants/journal-taxonomy";
import type { Graphic } from "./site/journal-extras";
/* 23 Oct 2026: each entry's long text lives in content/journal-long/ (founder: expand the Journal 5x). */
import { BODY as J01_BODY, MINUTES as J01_MINUTES } from "./journal-long/j01";
import { BODY as J02_BODY, MINUTES as J02_MINUTES } from "./journal-long/j02";
import { BODY as J03_BODY, MINUTES as J03_MINUTES } from "./journal-long/j03";
import { BODY as J04_BODY, MINUTES as J04_MINUTES } from "./journal-long/j04";
import { BODY as J05_BODY, MINUTES as J05_MINUTES } from "./journal-long/j05";
import { BODY as J06_BODY, MINUTES as J06_MINUTES } from "./journal-long/j06";
import { BODY as J07_BODY, MINUTES as J07_MINUTES } from "./journal-long/j07";
import { BODY as J08_BODY, MINUTES as J08_MINUTES } from "./journal-long/j08";
import { BODY as J09_BODY, MINUTES as J09_MINUTES } from "./journal-long/j09";
import { BODY as J10_BODY, MINUTES as J10_MINUTES } from "./journal-long/j10";
import { BODY as J11_BODY, MINUTES as J11_MINUTES } from "./journal-long/j11";
import { BODY as J12_BODY, MINUTES as J12_MINUTES } from "./journal-long/j12";
import { BODY as J13_BODY, MINUTES as J13_MINUTES } from "./journal-long/j13";
import { BODY as J14_BODY, MINUTES as J14_MINUTES } from "./journal-long/j14";

export type JournalKind =
  | "mechanism"   // how something works
  | "decision"    // why it was built this way, and what was given up
  | "record"      // what happened, dated
  | "ground";     // a place, and what is true about it

export interface Entry {
  id: string;
  slug: string;
  title: string;
  /** One sentence. Appears in the index and nowhere else. */
  standfirst: string;
  kind: JournalKind;
  published: string;
  minutes: number;
  /** Registry values this entry depends on. Checked at load. */
  cites?: readonly { what: string; value: string }[];
  body: readonly Block[];
  /** Where to go next, and why that one. */
  onward?: readonly { path: string; title: string; why: string }[];
  /**
   * The editorial axes — channel, distance from the Collection, franchise,
   * depth, reader and disclosure.
   *
   * Optional because the eight original entries predate it and are all
   * the same thing: the platform explaining a rule it already follows.
   * They are `collection` distance by definition, and backfilling that
   * would state the obvious in eight places.
   *
   * Required in spirit for anything new. journal-lint counts the
   * distribution rather than policing each entry, because the failure
   * this guards against is not one bad article — it is a Journal that
   * became a brochure one reasonable article at a time.
   */
  meta?: JournalMeta;
}

export type Block =
  | { t: "p"; x: string }
  | { t: "h"; x: string }
  | { t: "list"; x: readonly string[] }
  /** A claim set on paper. Reserved for assertions of fact. */
  | { t: "assert"; x: string }
  /** A figure and where it came from. Never a bare number in prose. */
  | { t: "figure"; label: string; value: string; source: string }
  /* ── Digital assemblies, 23 Oct 2026 (founder: "expand the Journal 5x
     through digital assemblies, narrative stories, comparisons and
     illustrations"). Each draws only what the entry states. ── */
  /** A drawing inline, any kind the Journal already draws (compare, timeline, ladder, waterfall…). */
  | { t: "graphic"; g: Graphic; caption?: string }
  /** A story told to illustrate the point. Always labelled as an illustration: never a testimonial. */
  | { t: "story"; title: string; x: readonly string[] }
  /** An estate's own picture (content/site/media.ts) or a drawn film, with a caption. */
  | { t: "illus"; plate?: string; film?: readonly [string, number]; caption: string }
  /** One sentence of the entry, set large. */
  | { t: "pull"; x: string }
  /** A strip of the entry's own figures, label and value. */
  | { t: "facts"; rows: readonly (readonly [string, string])[] };

/* Values read from the canon, so an entry cannot drift from it. */
const PARTNER_BPS = WATERFALL[WATERFALL.length - 1].bps;
const OPCO_BPS = WATERFALL[1].bps;

/* ═══════════════════════════════════════════════════════════════════ */

const J01: Entry = {
  id: "J-01",
  slug: "why-a-body-corporate",
  title: "Why an LLP, and not a share of a building",
  standfirst:
    "Each estate sits in its own LLP. The structure was chosen for the hard moments: a " +
    "disagreement, a sale, a partner's death.",
  kind: "decision",
  published: "2026-06-02",
  minutes: J01_MINUTES,
  body: J01_BODY,
  onward: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part A sets out the three parties and what each is responsible for." },
    { path: "/how-it-works", title: "Governance without ownership",
      why: "How a contested decision is resolved." },
  ],
};

const J02: Entry = {
  id: "J-02",
  slug: "the-waterfall-read-from-the-bottom",
  title: "The payment order, read from the bottom",
  standfirst:
    "Revenue is paid in six stages, in a fixed order. The stage that matters to a partner is " +
    "the last one, so read it first.",
  kind: "mechanism",
  published: "2026-06-14",
  minutes: J02_MINUTES,
  cites: [
    { what: "partner stage, basis points", value: String(PARTNER_BPS) },
    { what: "operating partner stage, basis points", value: String(OPCO_BPS) },
  ],
  body: J02_BODY,
  onward: [
    { path: "/collection/slowspace-coastal/investment", title: "How capital works",
      why: "The same six stages, with worked figures." },
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Part D, on what borrowing does to stage six." },
  ],
};

const J03: Entry = {
  id: "J-03",
  slug: "what-settlement-changes",
  title: "What settlement changes",
  standfirst:
    "You become a partner at one precise moment: when your cleared funds reach the estate's " +
    "LLP.",
  kind: "mechanism",
  published: "2026-06-25",
  minutes: J03_MINUTES,
  body: J03_BODY,
  onward: [
    { path: "/how-it-works", title: "The model, end to end",
      why: "Where this moment sits, and what comes before it." },
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part D states it as an obligation." },
  ],
};

const J04: Entry = {
  id: "J-04",
  slug: "governance-without-ownership",
  title: "Governance without ownership",
  standfirst:
    "The company that writes the rules holds no equity in the estates it governs. Its directors " +
    "invest as partners, in their own names.",
  kind: "decision",
  published: "2026-07-03",
  minutes: J04_MINUTES,
  body: J04_BODY,
  onward: [
    { path: "/legal/disclosures", title: "Standing Disclosures",
      why: "The same position, stated as a disclosure." },
  ],
};

const J05: Entry = {
  id: "J-05",
  slug: "reading-a-modelled-number",
  title: "Reading a modelled number",
  standfirst:
    "Every forward-looking figure here carries a label saying how it was reached. Here is what " +
    "each label tells you.",
  kind: "mechanism",
  published: "2026-07-11",
  minutes: J05_MINUTES,
  /* No `cites`: this entry quotes no figure. A citation list is for
     values the prose actually depends on, and padding it would make the
     load-time check meaningless. */
  body: J05_BODY,
  onward: [
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Part I, on what modelled means when it is your money." },
  ],
};

const J06: Entry = {
  id: "J-06",
  slug: "two-waters",
  title: "Two waters",
  standfirst:
    "A strip of land at Padubidri, with the Arabian Sea on one side and the Shambhavi estuary " +
    "on the other. What that gives an estate, and what it asks of the build.",
  kind: "ground",
  published: "2026-07-19",
  minutes: J06_MINUTES,
  cites: [{ what: "site keys", value: String(SITE.keys) }],
  body: J06_BODY,
  onward: [
    { path: "/collection/slowspace-coastal/investment", title: "Seaside Confluence",
      why: "The investment in this estate, with a confidence class on every figure." },
  ],
};

const J07: Entry = {
  id: "J-07",
  slug: "the-night-is-not-the-product",
  title: "The night is not the product",
  standfirst:
    "Nights come with a share of ownership; the ownership is what you buy. Keeping that order " +
    "is what keeps the platform honest.",
  kind: "decision",
  published: "2026-07-24",
  minutes: J07_MINUTES,
  cites: [
    { what: "unit share, basis points", value: String(UNIT.sharePct) },
    { what: "nights per year, minimum", value: String(UNIT.nights.min) },
  ],
  body: J07_BODY,
  onward: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part F, where nights are stated as an obligation." },
  ],
};

const J08: Entry = {
  id: "J-08",
  slug: "what-this-platform-does-not-do",
  title: "Five rules we keep, and why",
  standfirst:
    "Five rules, each first asked of us the other way round, with the reason we keep it.",
  kind: "decision",
  published: "2026-07-30",
  minutes: J08_MINUTES,
  cites: [
    { what: "worked example DSCR", value: DSCR.toFixed(2) },
    { what: "worked example yield, basis points", value: String(MY_YIELD_BPS) },
  ],
  body: J08_BODY,
  onward: [
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "The same ground, set out as risk factors." },
  ],
};

/* ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   THE OUTWARD JOURNAL

   Everything above explains a rule GC already follows. Everything below
   would be worth reading if GC sold nothing, which is the only test the
   strategy applies and the only one that matters at this distance.
   ═══════════════════════════════════════════════════════════════════ */

const J09: Entry = {
  id: "J-09",
  slug: "four-thousand-weekends",
  title: "The four thousand weekends problem",
  standfirst:
    "A life holds about four thousand Saturdays. Most people spend the middle third of them " +
    "within forty minutes of where they work.",
  kind: "ground",
  published: "2026-08-03",
  minutes: J09_MINUTES,
  meta: {
    channel: "time",
    distance: "culture",
    franchise: "the-value-of-time",
    depth: "deep",
    persona: "builder",
    alsoFor: ["escapist", "custodian"],
    disclosure: "independent",
  },
  body: J09_BODY,
  onward: [
    { path: "/collection", title: "The Collection",
      why: "Every place in it is inside the radius this argument is about." },
  ],
};

const J10: Entry = {
  id: "J-10",
  slug: "the-real-cost-of-thirty-days",
  title: "The real cost of a house you use thirty days a year",
  standfirst:
    "Second homes are judged on the purchase price. The costs that follow are where the trouble " +
    "usually lies.",
  kind: "mechanism",
  published: "2026-08-03",
  minutes: J10_MINUTES,
  meta: {
    channel: "capital",
    distance: "ownership",
    franchise: "the-second-home-question",
    depth: "deep",
    persona: "sceptic",
    alsoFor: ["investor", "builder"],
    /* Figures are structural rather than measured, and the strategy is
       explicit that this must be said rather than implied. */
    disclosure: "illustrative-figures",
  },
  body: J10_BODY,
  onward: [
    { path: "/how-it-works", title: "How it works",
      why: "The third answer in full, including what it costs." },
  ],
};

const J11: Entry = {
  id: "J-11",
  slug: "what-the-sea-does-to-time",
  title: "What the sea does to time",
  standfirst:
    "People call the coast relaxing. They usually mean it is loud enough to stop them thinking, " +
    "and slow enough that they notice.",
  kind: "ground",
  published: "2026-08-03",
  minutes: J11_MINUTES,
  meta: {
    channel: "place",
    distance: "culture",
    depth: "deep",
    persona: "escapist",
    alsoFor: ["collector"],
    disclosure: "gc-owns",
    elsewhere: [
      { label: "Rachel Carson, The Edge of the Sea",
        why: "The best account of a coastline as a place with its own time, rather than a view." },
    ],
  },
  body: J11_BODY,
  onward: [
    { path: "/collection/slowspace-coastal#site", title: "The place",
      why: "One stretch of this coast, described at length." },
  ],
};

const J12: Entry = {
  id: "J-12",
  slug: "houses-that-get-better-when-it-rains",
  title: "Houses that get better when it rains",
  standfirst:
    "Most buildings are photographed in sunshine and endure the rest. A few are designed the " +
    "other way round.",
  kind: "ground",
  published: "2026-08-03",
  minutes: J12_MINUTES,
  meta: {
    channel: "architecture",
    distance: "place",
    franchise: "places-worth-keeping",
    depth: "deep",
    persona: "collector",
    alsoFor: ["conscious"],
    disclosure: "independent",
  },
  body: J12_BODY,
  onward: [
    { path: "/collection", title: "The Collection",
      why: "Every place here sits in high rainfall, and is built for the wet half of the year." },
  ],
};

const J13: Entry = {
  id: "J-13",
  slug: "beautiful-assets-terrible-investments",
  title: "Why beautiful assets can still be terrible investments",
  standfirst:
    "Whether a place is beautiful and whether it pays are separate questions. Confusing them is " +
    "the commonest error in leisure property.",
  kind: "mechanism",
  published: "2026-08-03",
  minutes: J13_MINUTES,
  meta: {
    channel: "capital",
    distance: "ownership",
    franchise: "capital-in-the-real-world",
    depth: "deep",
    persona: "investor",
    alsoFor: ["builder", "sceptic"],
    disclosure: "illustrative-figures",
  },
  body: J13_BODY,
  onward: [
    { path: "/collection/slowspace-coastal/investment", title: "The Investment",
      why: "The same sequence for one estate, with a confidence class on every figure." },
    { path: "/legal/risk-disclosure", title: "Risk disclosure",
      why: "Each risk factor, set out before you commit." },
  ],
};

/* 15 Oct 2026. The platform explaining a rule it already follows, like the
   first eight, so it carries no editorial meta: it is collection distance
   by definition. Every fact in it is the live reserve flow's
   (lib/holds.ts, app/api/deposit) or a founder ruling (KYC before
   allotment, 8 Oct 2026); the amount and the refund term are read from
   the register. */
const J14: Entry = {
  id: "J-14",
  slug: "what-a-holding-deposit-is",
  title: "What a holding deposit does",
  standfirst:
    "A deposit holds your units while you read, ask and decide. What it does, who holds it, and " +
    "what comes after.",
  kind: "mechanism",
  published: "2026-10-15",
  minutes: J14_MINUTES,
  cites: [
    { what: "holding deposit", value: inr(DEPOSIT.amount) },
    { what: "refund term", value: DEPOSIT.refundable },
  ],
  body: J14_BODY,
  onward: [
    { path: "/how-it-works", title: "How it works",
      why: "Units, the payment order, decisions and nights, end to end." },
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Each factor to weigh before you commit." },
  ],
};

export const JOURNAL: readonly Entry[] = [
  J01, J02, J03, J04, J05, J06, J07, J08,
  J09, J10, J11, J12, J13, J14,
];

export const entryBySlug = (slug: string): Entry | undefined =>
  JOURNAL.find((e) => e.slug === slug);

export const JOURNAL_INTRO =
  "One decision an entry, with what it cost. Every figure quoted here is read from the same " +
  "register the platform reads, so each entry describes the platform as it is.";

export const KIND_LABEL: Record<JournalKind, string> = {
  mechanism: "How it works",
  decision: "Why it is built this way",
  record: "What happened",
  ground: "A place",
};

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  const slugs = JOURNAL.map((e) => e.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error("Journal has a duplicate slug");

  const ids = JOURNAL.map((e) => e.id);
  if (new Set(ids).size !== ids.length) throw new Error("Journal has a duplicate id");

  /*
   * Every cited value must be a real, non-empty reading from the canon.
   * The point of `cites` is that an entry quoting a threshold is quoting
   * the registry rather than a number someone typed while writing; a
   * cite that resolved to undefined would defeat exactly that, while
   * still looking like a citation.
   */
  for (const e of JOURNAL) {
    for (const c of e.cites ?? []) {
      if (!c.value || c.value === "undefined" || c.value === "NaN") {
        throw new Error(
          `${e.id} cites "${c.what}" but it resolved to "${c.value}". ` +
            `A citation that reads nothing is worse than no citation.`,
        );
      }
    }
    if (!e.body.length) throw new Error(`${e.id} has no body`);
  }

  /* Entries are listed newest last; the index reverses. A published date
     out of order would silently reorder the index. */
  const dates = JOURNAL.map((e) => e.published);
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] < dates[i - 1]) {
      throw new Error(`Journal is out of date order at ${JOURNAL[i].id} (${dates[i]})`);
    }
  }
}
