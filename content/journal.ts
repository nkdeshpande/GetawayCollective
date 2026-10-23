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
const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";

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
  minutes: 6,
  body: [
    { t: "p", x:
      "There are simpler ways to sell a tenth of a property than forming a limited liability " +
      "partnership (LLP) for it. A co-ownership deed is shorter. A fractional title is easier to " +
      "explain. We weighed both and chose the LLP, for one reason." },
    { t: "h", x: "Co-ownership stalls at the first disagreement" },
    { t: "p", x:
      "Ten co-owners of a building must agree, unanimously, on every act of management. A " +
      "decision nine want and one refuses has nowhere to go. A decision needed this week has no " +
      "route at all." },
    { t: "p", x:
      "The usual fix is a side agreement on how the co-owners will vote. It binds only the people " +
      "who signed it. A person who buys from one of them is free of it, and enforcing it means " +
      "suing a co-owner." },
    { t: "assert", x:
      "An LLP makes the rules part of the asset. Anyone who acquires a position takes it subject " +
      "to the LLP agreement. The mechanism for a contested decision is a vote rather than a " +
      "lawsuit." },
    { t: "h", x: "Your liability stops at the LLP" },
    { t: "p", x:
      "A co-owner of a building carries whatever happens there, without limit. A partner in an " +
      "LLP carries what they agreed to contribute. When an estate carries a bank facility of " +
      "several crore, that difference is the whole of the downside." },
    { t: "h", x: "What it costs" },
    { t: "p", x:
      "Formation takes money and time. Every LLP files its accounts, is audited and is " +
      "administered, whether the estate earns or not. That cost is paid from the administration " +
      "reserve." },
    { t: "p", x:
      "A partnership interest is also taxed differently from an interest in land, and is harder " +
      "to pledge to a lender. We accepted both costs deliberately." },
    { t: "h", x: "Where the exception lives" },
    { t: "p", x:
      "The LLP is the default. A different structure for a specific estate needs Board approval. " +
      "It is written as a default with an exception, because a rule with no exception gets broken " +
      "quietly the first time it fails to fit." },
  ],
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
  minutes: 7,
  cites: [
    { what: "partner stage, basis points", value: String(PARTNER_BPS) },
    { what: "operating partner stage, basis points", value: String(OPCO_BPS) },
  ],
  body: [
    { t: "p", x:
      "Revenue reaches an estate as one number and leaves as six. This sequence is the payment " +
      "order, also called the waterfall. Each stage is paid in full before the next, and the six " +
      "add up to the whole. There is no seventh stage." },
    { t: "figure", label: "To partners", value: pct(PARTNER_BPS),
      source: "Stage six, read directly from the payment-order register." },
    { t: "h", x: "The order is the disclosure" },
    { t: "p", x:
      "A document can list the six stages honestly and still mislead, by showing them as a set " +
      "rather than a sequence. Percentages that add up to a hundred look like a division of the " +
      "whole. They are a queue, and where you stand in it decides whether you are paid at all in " +
      "a bad year." },
    { t: "assert", x:
      "A share described as the partners', with a note that it also repays borrowing, belongs " +
      "partly to the bank. And the bank is paid first." },
    { t: "h", x: "The two stages worth understanding" },
    { t: "p", x:
      "The administration reserve and the sinking fund each take two and a half per cent of " +
      "revenue. They are the quietest stages, and the most worth understanding." },
    { t: "p", x:
      "The reserve keeps a bad quarter from becoming an emergency. It has a floor, and stage six " +
      "pays only once the floor is met. So a partner can have a profitable quarter and receive " +
      "nothing. That is the reserve protecting the position, as designed." },
    { t: "p", x:
      "The sinking fund replaces things before they fail. It keeps distributions honest: what " +
      "partners receive is income, with renewal already paid for." },
    { t: "h", x: "Reading it backwards" },
    { t: "p", x:
      "Read any payment order from the bottom. Start at your own stage, then count what must be " +
      "paid above you. For a partner in an estate carrying debt, five stages come first." },
  ],
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
  minutes: 5,
  body: [
    { t: "p", x:
      "On many platforms, pressing a button is the event. A screen congratulates you and calls " +
      "you an owner from that moment." },
    { t: "assert", x:
      "Here, your position changes when cleared funds reach the LLP. Before settlement you have " +
      "an obligation. After it you have the rights of a partner, and the change is final, for " +
      "you, for us and for every other partner." },
    { t: "h", x: "Why the gap is shown" },
    { t: "p", x:
      "Between commitment and settlement there is a window of up to fifteen working days. In it, " +
      "you have promised capital and your position is pending." },
    { t: "p", x:
      "Calling you a partner early would make the register wrong. A register that lists people " +
      "whose money has not arrived is a register that cannot be used to compute a vote or a " +
      "distribution." },
    { t: "h", x: "What you see on screen" },
    { t: "p", x:
      "After you commit, the screen says Committed. It states plainly that your vote and your " +
      "nights begin at settlement. The screen that says Member comes later, and reaching it is an " +
      "event." },
    { t: "h", x: "Why settlement is final" },
    { t: "p", x:
      "Other partners rely on your commitment. If a settled position could be unwound, every " +
      "quorum would be provisional, and every distribution would rest on a register that might " +
      "change." },
    { t: "p", x:
      "So the moment to deliberate comes before you commit. The commit control takes three " +
      "seconds of steady pressure, and the amount stays on screen throughout." },
  ],
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
  minutes: 6,
  body: [
    { t: "p", x:
      "The usual arrangement gives a manager a stake in what it manages, on the view that shared " +
      "exposure aligns everyone. It does align some things. It also gives the party interpreting " +
      "the rules a position that one reading would improve." },
    { t: "assert", x:
      "Getaway Collective is a brand of NAVINA Structures Pvt Ltd, which forms and governs each " +
      "estate's LLP. NAVINA holds no equity in any of them. It is paid from stage two of the " +
      "payment order, and from nothing else. The rule is entrenched: changing it takes every " +
      "partner." },
    { t: "h", x: "What this buys" },
    { t: "list", x: [
      "Valuations are free of our interest: NAVINA holds no position to mark up.",
      "The reserve floor is applied as written: NAVINA has no stake in whether stage six pays.",
      "Control of the rules stays with the partners: NAVINA holds no units anyone could buy.",
      "A partner can ask what NAVINA gains from any rule, and the answer is the same every time.",
    ] },
    { t: "h", x: "What it costs" },
    { t: "p", x:
      "It costs NAVINA the upside. A platform taking ten per cent of every LLP would be worth far " +
      "more if the estates do well. Its people would be paid in that growth, rather than from one " +
      "stage of revenue." },
    { t: "p", x:
      "Alignment comes from the promoters instead. Nikhil Deshpande and Shirisha Avanchi, " +
      "NAVINA's directors and shareholders, invest in each estate in their own names. They hold " +
      "the same units, on the same terms, paid at the same stage. The company is separated; its " +
      "owners are aligned." },
    { t: "h", x: "Why entrenched" },
    { t: "p", x:
      "A clause a majority can amend lasts until it becomes inconvenient. Unanimity means the " +
      "rule outlives the people who wrote it, including on the day they would most like it gone." },
  ],
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
  minutes: 5,
  /* No `cites`: this entry quotes no figure. A citation list is for
     values the prose actually depends on, and padding it would make the
     load-time check meaningless. */
  body: [
    { t: "p", x:
      "A number on a screen carries no sign of where it came from. The same typeface shows a " +
      "figure counted yesterday and one assumed for 2031. You can tell them apart only if you are " +
      "told." },
    { t: "h", x: "The six classes" },
    { t: "list", x: [
      "Observed: counted or measured. A night taken, a payment received.",
      "Verified: stated by someone and checked against a source document.",
      "Modelled: computed from stated assumptions. The arithmetic is exact; the inputs may be " +
        "wrong.",
      "Estimated: a person's judgement on incomplete information.",
      "Forecast: a modelled figure about a period still to come.",
      "Pending: expected and still to arrive. Shown as absent, never as zero.",
    ] },
    { t: "assert", x:
      "The classes are ranked, and the rank is the point. A figure never carries a stronger class " +
      "than the weakest input behind it." },
    { t: "h", x: "Why a modelled yield needs its label" },
    { t: "p", x:
      "A modelled distribution comes from three assumptions, for occupancy, rate and cost, run " +
      "through the payment order. The arithmetic can be flawless while all three are wrong. The " +
      "result would look exactly the same." },
    { t: "p", x:
      "So a modelled figure carries its label everywhere it appears, as well as where it was " +
      "first computed. A number quoted without its class has been laundered by being moved." },
    { t: "h", x: "When sources disagree" },
    { t: "p", x:
      "Source documents sometimes contain figures that cannot all be true at once. The rule is to " +
      "carry the conservative figure, record the inconsistency, and compute the dependent figures " +
      "from it. Then the two can never disagree again." },
  ],
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
  minutes: 6,
  cites: [{ what: "site keys", value: String(SITE.keys) }],
  body: [
    { t: "p", x:
      "The land lies between an open sea and a river mouth. On the western edge the water is " +
      "surf. On the eastern edge, four hundred metres away, it is still enough to hold a " +
      "reflection. Little of the Karnataka coast offers both." },
    { t: "figure", label: "Studios", value: String(SITE.keys),
      source: "Read from the estate record." },
    { t: "h", x: "What two waterfronts are worth" },
    { t: "p", x:
      "They are worth demand across the year. The sea frontage sells the winter; the estuary is " +
      "calm in months when the surf is too rough to use. An estate with one waterfront has one " +
      "season." },
    { t: "h", x: "What it asks of the build" },
    { t: "p", x:
      "Two waters mean two edges to hold: salt from one side, humidity from the other, on ground " +
      "that was recently river silt. Each of its studios costs more to build than it would inland." },
    { t: "assert", x:
      "India's Coastal Regulation Zone (CRZ) rules apply on both edges. Building positions are " +
      "fixed once the CRZ line is read from the survey plan. Drawings are then issued for " +
      "construction." },
    { t: "h", x: "Access" },
    { t: "p", x:
      "The site is 1.5 km from NH-66, the coast highway, and about 31 km from Mangaluru airport: " +
      "32 to 46 minutes by road. Access is the strongest fact about the estate, and the one least " +
      "likely to change." },
    { t: "h", x: "Where it stands" },
    { t: "p", x:
      "Construction comes first. The programme runs to a handover in early 2028. The bank " +
      "facility is drawn during the build, and revenue begins when the estate opens. Until then, " +
      "every revenue figure for it is a forecast." },
  ],
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
  minutes: 5,
  cites: [
    { what: "unit share, basis points", value: String(UNIT.sharePct) },
    { what: "nights per year, minimum", value: String(UNIT.nights.min) },
  ],
  body: [
    { t: "p", x:
      "Each partner has nights at the estate every year: one night for each 1% held, from " +
      "handover. The easy description is buying time somewhere pleasant. That description is " +
      "wrong, and the error matters." },
    { t: "assert", x:
      "Nights come with the position. They carry no separate price, cannot be exchanged for money " +
      "and are used within their year. A position whose nights went unused for a decade would be " +
      "worth exactly what it was worth on the day it settled." },
    { t: "h", x: "What goes wrong if nights are the product" },
    { t: "p", x:
      "If nights were what is sold, the number of nights would be the thing to maximise. Every " +
      "night a partner took would be a night the estate could not let. Partners and the estate " +
      "would pull in opposite directions." },
    { t: "p", x:
      "It would also turn the position into a prepayment. A prepayment for accommodation is " +
      "regulated differently from a contribution to an LLP, with other protections and other tax. " +
      "Calling one the other changes nothing." },
    { t: "h", x: "How the mechanism keeps it honest" },
    { t: "p", x:
      "A night released rather than taken is let, and its revenue enters the payment order at " +
      "stage one like any other. A partner who takes fewer nights is paid slightly more; one who " +
      "takes all of them, slightly less. Neither is penalised; the arithmetic simply follows." },
    { t: "h", x: "Precedence" },
    { t: "p", x:
      "Where more partners want the same dates than the estate can hold, whoever has used the " +
      "fewest nights that year goes first. Holding size and request order play no part. Weighted " +
      "voting decides money; it does not decide who gets the last weekend in December." },
  ],
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
  minutes: 4,
  cites: [
    { what: "worked example DSCR", value: DSCR.toFixed(2) },
    { what: "worked example yield, basis points", value: String(MY_YIELD_BPS) },
  ],
  body: [
    { t: "p", x:
      "Each rule began as a request from someone reasonable, for a reason that made sense at the " +
      "time." },
    { t: "h", x: "We inform; you decide" },
    { t: "p", x:
      "Getaway Collective gives no personalised financial advice, and is not registered to. Its " +
      "figures are inputs to a decision that stays yours. Part L of the Terms and Conditions " +
      "states this formally, and that is where it binds." },
    { t: "h", x: "Partners share what the estate earns" },
    { t: "p", x:
      "Partners share what remains at the last stage of the payment order. There is no minimum " +
      "payout and no top-up from elsewhere. What the estate earns is what partners share." },
    { t: "h", x: "Partners trade on a noticeboard" },
    { t: "p", x:
      "After the lock-in, partners can offer units on a private noticeboard, which fellow " +
      "partners see first. Buyer and seller agree the price between them. It is a noticeboard " +
      "rather than a market: it matches no one and sets no price." },
    { t: "h", x: "Each quarter pays what it earns" },
    { t: "p", x:
      "A quarter that earns less pays less. Holding money back in good quarters to top up bad " +
      "ones would make the figures smoother and the record less true. The reserve is kept for " +
      "capital events." },
    { t: "h", x: "Every figure carries its class" },
    { t: "p", x:
      "A forward-looking number appears with its confidence class, every time. It can be awkward " +
      "in a headline, and it can make our material look less confident than others'. It keeps it " +
      "accurate." },
    { t: "assert", x:
      "Where a source contains figures that cannot all hold at once, we carry the conservative " +
      "one and publish the inconsistency. The worked example here arrived claiming a cover ratio " +
      "and a modelled cash yield its own inputs could not both support. We show the conservative " +
      "figure and compute the ratio from it." },
  ],
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
  minutes: 6,
  meta: {
    channel: "time",
    distance: "culture",
    franchise: "the-value-of-time",
    depth: "story",
    persona: "builder",
    alsoFor: ["escapist", "custodian"],
    disclosure: "independent",
  },
  body: [
    { t: "p", x:
      "Someone who lives to eighty gets a little over four thousand Saturdays. The number is " +
      "small enough to picture, which is why it is worth stating. People change decisions over " +
      "figures they can picture." },
    { t: "p", x:
      "The arithmetic that follows is less comfortable. Give the first twenty years to childhood " +
      "and the last ten to a slower kind of time. That leaves about two and a half thousand in " +
      "the middle, where the work is. Take out the ones already spoken for, by obligation, travel " +
      "and recovering from the week. A few hundred remain that are truly yours to place." },
    { t: "h", x: "Distance is what spends them" },
    { t: "p", x:
      "The usual assumption is that people go away less because they are busy. Distance predicts " +
      "it better." },
    { t: "p", x:
      "A place ninety minutes from home is a Friday-evening decision. A place four hours away is " +
      "a plan, and a plan needs a reason and a long weekend. The first gets used thirty times a " +
      "year without anyone deciding to. The second gets used four times, and twice because " +
      "someone else was coming." },
    { t: "p", x:
      "This is why proximity behaves like a luxury rather than a convenience. It does not make an " +
      "hour better. It converts hours that would not otherwise have existed." },
    { t: "h", x: "The summers version" },
    { t: "p", x:
      "Parents recognise a harder form of the same arithmetic. A child is eight for one year. If " +
      "a place takes a full day to reach, you might be there together three times that year. If " +
      "it takes two hours, perhaps twelve." },
    { t: "p", x:
      "The place stays the same. What changes is how often a family gathers in it, and that is " +
      "what a family remembers." },
    { t: "assert", x:
      "Frequency is a function of distance. Size, finish and view change how good one visit is. " +
      "Distance changes how many visits there are." },
    { t: "h", x: "The narrower point" },
    { t: "p", x:
      "This is an argument about distance, and it holds for renting too. A rented house ninety " +
      "minutes away beats an owned one four hours away on this measure. We say so plainly, " +
      "because the opposite conclusion would suit us." },
    { t: "p", x:
      "The point is narrower. When people choose somewhere to go regularly, they weigh the place " +
      "and rarely the distance. Distance decides how much of the place they actually get." },
  ],
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
  minutes: 8,
  meta: {
    channel: "capital",
    distance: "ownership",
    franchise: "the-second-home-question",
    depth: "story",
    persona: "sceptic",
    alsoFor: ["investor", "builder"],
    /* Figures are structural rather than measured, and the strategy is
       explicit that this must be said rather than implied. */
    disclosure: "illustrative-figures",
  },
  body: [
    { t: "p", x:
      "A second house is bought on one number everybody discusses and held on several nobody " +
      "does. The purchase is negotiated hard, checked by a lawyer and slept on. What follows " +
      "arrives a line at a time, and by the time it is visible it feels normal." },
    { t: "h", x: "The costs that never reach the decision" },
    { t: "list", x: [
      "Someone local who holds the keys, paid whether anyone comes or not.",
      "The garden, which keeps growing between visits.",
      "Municipal dues, insurance and the annual bill nobody predicted.",
      "The repair that is small when found early and structural when found late.",
      "The drive itself: the cost most often left out, and paid every single time.",
    ] },
    { t: "p", x:
      "Each is minor alone. Together they behave like a subscription to a house, and the " +
      "subscription does not scale down when the house is empty. Cost follows the calendar; use " +
      "follows the distance." },
    { t: "h", x: "Divide by the nights, not by the year" },
    { t: "p", x:
      "The figure worth knowing is annual cost divided by the nights someone actually slept " +
      "there." },
    { t: "p", x:
      "Almost nobody does this division. The answer tends to be a number people would rather not " +
      "carry, and nothing in owning a house forces the calculation." },
    { t: "p", x:
      "Do it anyway. If a house costs a lakh a month to hold and is used twenty-four nights, each " +
      "night cost fifty thousand rupees before anyone ate anything. That is an argument for " +
      "knowing the number, rather than against the house." },
    { t: "h", x: "The part that arrives ten years later" },
    { t: "p", x:
      "The surprise is generational. A house bought for a young family is used most while the " +
      "children are small. Use falls as they grow, and then the house passes to people who did " +
      "not choose it." },
    { t: "p", x:
      "Sometimes they love it. Often they inherit upkeep tied to someone else's memory of a " +
      "place, somewhere they would not have picked. And it is held between siblings who disagree " +
      "and cannot easily sell." },
    { t: "assert", x:
      "The failure of a second house is rarely the house. It is the gap between how often someone " +
      "imagined being there and how often they went, compounded by a cost that never noticed the " +
      "difference." },
    { t: "h", x: "Three honest answers" },
    { t: "p", x:
      "Rent. If you want a handful of nights a year, renting is cheaper, more varied and ends " +
      "cleanly. Most people asking this question should rent, and we say so." },
    { t: "p", x:
      "Buy, and use it properly. Buying works when the house is close enough to use without a " +
      "plan, and when its cost is divided by a realistic number of nights." },
    { t: "p", x:
      "Or own part of something better. Collective ownership exists because the sums above " +
      "improve with a smaller share of the standing cost, rather than with a nicer house. We " +
      "build one of those, which is why the first answer had to come first." },
  ],
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
  minutes: 5,
  meta: {
    channel: "place",
    distance: "culture",
    depth: "story",
    persona: "escapist",
    alsoFor: ["collector"],
    disclosure: "gc-owns",
    elsewhere: [
      { label: "Rachel Carson, The Edge of the Sea",
        why: "The best account of a coastline as a place with its own time, rather than a view." },
    ],
  },
  body: [
    { t: "p", x:
      "A coast keeps time out loud. Mountains are older and say nothing about it. Forests move on " +
      "a scale nobody watches. The sea arrives every few seconds, all day, and has done so for " +
      "longer than there have been people to hear it." },
    { t: "p", x:
      "So it is hard to be efficient beside one. Efficiency asks you to believe the next hour " +
      "matters more than this one. A tide is a standing argument against that." },
    { t: "h", x: "Why the first evening is always long" },
    { t: "p", x:
      "Almost everyone reports the same thing. The first evening by the sea feels long, and the " +
      "last morning disappears." },
    { t: "p", x:
      "The likeliest explanation is plain. Time feels long when there is much to notice and " +
      "nothing to anticipate. On arrival everything is new and nothing is scheduled. By the last " +
      "morning the light and the sound are background, and the drive home has already begun." },
    { t: "p", x:
      "That is the case for going more often rather than for longer. Two nights taken twelve " +
      "times a year contain twelve first evenings. Two weeks taken once contains one." },
    { t: "h", x: "What it asks of a building" },
    { t: "p", x:
      "Coastal architecture is mostly an argument with salt, and the buildings that last are the " +
      "ones that stopped resisting. Salt finds fixings. Wind finds anything cantilevered for a " +
      "photograph. The monsoon tests every surface." },
    { t: "p", x:
      "The houses that age well on this coast tend to be low, deeply shaded and built of local " +
      "things. They were designed by someone who had been there in July as well as in January." },
    { t: "assert", x:
      "A coastal building is judged by how it looks after its fifth monsoon. The first year " +
      "predicts little." },
  ],
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
  minutes: 7,
  meta: {
    channel: "architecture",
    distance: "place",
    franchise: "places-worth-keeping",
    depth: "story",
    persona: "collector",
    alsoFor: ["conscious"],
    disclosure: "independent",
  },
  body: [
    { t: "p", x:
      "The Western Ghats receive two to seven metres of rain a year, mostly within four months. " +
      "Any building there is a proposition about water, whatever else its architect intended." },
    { t: "p", x:
      "Most new houses in the region seal themselves against the rain. The older ones were " +
      "designed for that season, and the difference shows in about six years." },
    { t: "h", x: "What the traditional answer got right" },
    { t: "list", x: [
      "Deep overhangs, so water leaves the wall before it reaches the ground.",
      "Raised plinths, because the ground itself moves water sideways for months.",
      "Courtyards that collect rain deliberately rather than shedding it by accident.",
      "Roofs steep enough that water never sits still long enough to find a way in.",
      "Materials that darken and remain sound, rather than materials that hold their colour and " +
        "fail.",
    ] },
    { t: "p", x:
      "This is engineering rather than nostalgia. Each answer responds to a measured quantity of " +
      "water. People worked it out by rebuilding after getting it wrong, and they lived with the " +
      "result." },
    { t: "h", x: "The photograph problem" },
    { t: "p", x:
      "A deep veranda is the least photogenic thing in architecture. It is dark, it hides the " +
      "facade and it turns the interior into shadow. It also decides, more than anything, whether " +
      "a house is pleasant through the four months of rain." },
    { t: "p", x:
      "Buildings designed for one image tend to lose it. Think of glass to the floor, flat " +
      "parapets, flush details, or a white wall meeting the ground without a plinth. Each " +
      "photographs beautifully in February and explains itself by the third monsoon." },
    { t: "assert", x:
      "A house in high rainfall should be judged in July. Any assessment made in January is an " +
      "assessment of the photograph." },
    { t: "h", x: "What ageing well looks like" },
    { t: "p", x:
      "Laterite darkens. Timber silvers. Copper turns and then stops. Lime absorbs and releases, " +
      "and keeps a wall breathing. These materials have a second appearance, and the building " +
      "spends its life in the second one." },
    { t: "p", x:
      "The opposite is a surface with one good state, kept up against the weather at rising cost " +
      "until replacing it is easier. That building was built well, for a photograph, and the " +
      "photograph was taken." },
  ],
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
  minutes: 16,
  meta: {
    channel: "capital",
    distance: "ownership",
    franchise: "capital-in-the-real-world",
    depth: "deep",
    persona: "investor",
    alsoFor: ["builder", "sceptic"],
    disclosure: "illustrative-figures",
  },
  body: [
    { t: "p", x:
      "Someone walks into a house on a hillside and knows within a minute that they want it. That " +
      "reaction is real information: other people will likely react the same way. It says almost " +
      "nothing about whether owning it will make money." },
    { t: "p", x:
      "The two questions run on different variables. The first is answered instantly; the second " +
      "takes a fortnight of work. Whichever is answered first tends to become the conclusion." },
    { t: "h", x: "What decides what an owner earns" },
    { t: "list", x: [
      "What was paid for the land, against what the land is worth without the building.",
      "The cost to build, and how far it ran past the estimate.",
      "How many nights a year it earns: a climate and distance question before a marketing one.",
      "What the operator takes before anything reaches an owner.",
      "Debt, and what it costs in the months nothing is earned.",
      "The reserve, and whether anyone funded one.",
    ] },
    { t: "p", x:
      "None of these is visible from the veranda. Some are hidden by it. A building that cost far " +
      "too much is often the most impressive one on the site, because that is where the money " +
      "went." },
    { t: "h", x: "Seasonality is the term people underestimate" },
    { t: "p", x:
      "A place that is extraordinary for five months and unreachable for two has an occupancy " +
      "ceiling set by weather. Marketing and photography leave that ceiling where it is." },
    { t: "p", x:
      "The common mistake is to model an annual average. Costs are monthly and revenue is " +
      "seasonal. So the question is whether the reserve carries the lean months, rather than " +
      "whether the year works." },
    { t: "h", x: "Where the money goes before it reaches an owner" },
    { t: "p", x:
      "In any operated property, revenue passes through a sequence before it becomes a " +
      "distribution. Operating costs, the operator's share, debt, tax and the reserve come first, " +
      "and the owner receives what remains. Each stage is contractual, and each ranks ahead of " +
      "the owner." },
    { t: "p", x:
      "An owner weighing a leisure asset should be able to state that sequence for the property, " +
      "in order, with the percentage at each stage. If nobody can produce it, the person offering " +
      "the position does not understand it." },
    { t: "assert", x:
      "Ask what happens to every hundred rupees of revenue. It is a simple, answerable question. " +
      "How often it goes unanswered is itself the finding." },
    { t: "h", x: "A hundred rupees, followed to the end" },
    { t: "p", x:
      "The figures below are invented; the shape is real. Each stage is a contractual claim found " +
      "in most operated leisure assets, in the order it is paid." },
    { t: "list", x: [
      "100 arrives as revenue. This is the number in the brochure.",
      "38 leaves as operating cost: people, power, water, supplies and upkeep. It is largely " +
        "fixed, which is why occupancy matters so much.",
      "10 leaves as the operator's fee, usually charged on revenue rather than profit. It is " +
        "taken whether or not anything is earned below it.",
      "6 leaves as sales and distribution: the platforms that fill the calendar take a percentage " +
        "of what they fill it with.",
      "12 leaves as interest, if the asset carries debt at a typical loan-to-value.",
      "8 leaves as the reserve for major repair, if someone funded one. Where nobody did, this " +
        "line reads zero and comes back as a capital call in year seven.",
      "That leaves 26 before tax, on an asset that may have cost twenty-five times its annual " +
        "revenue.",
    ] },
    { t: "p", x:
      "Twenty-six per cent of revenue sounds healthy. Against the purchase cost it is an " +
      "estimated one per cent yield before tax. That is the number to compare with every other " +
      "place the money could sit." },
    { t: "p", x:
      "Now move one variable. Cut occupancy by a fifth: one bad monsoon, one closed road, one " +
      "year of expensive flights. Revenue falls to 80. Operating cost barely moves, because a " +
      "building costs almost the same to keep whether or not anyone is in it. The operator's fee " +
      "falls with revenue; interest stays put. What was 26 becomes single digits, and the reserve " +
      "is the first line anyone proposes to skip." },
    { t: "assert", x:
      "Leisure assets are operationally geared. A fifth off revenue takes most of what the owner " +
      "earns, because the costs are annual and the revenue is seasonal." },
    { t: "h", x: "What the reserve really is" },
    { t: "p", x:
      "The eight in that list is the least discussed line, and it decides how the asset looks in " +
      "year fifteen. Roofs, plant, pumps, waterproofing and vehicles all have replacement cycles " +
      "measured in years, and none of them announce themselves." },
    { t: "p", x:
      "An asset without a funded reserve only looks cheaper to hold. It has pushed a known cost " +
      "into an unknown year. That year is likely to be poor for revenue too, because the weather " +
      "that emptied the calendar is the weather that found the roof." },
    { t: "p", x:
      "So ask of any operated property: what is in the reserve, what is it planned against, and " +
      "who decides when it is spent? The answer is usually either precise or absent, and both " +
      "tell you something." },
    { t: "h", x: "The exit nobody modelled" },
    { t: "p", x:
      "Almost every projection for a leisure asset ends with a sale. Almost none explain who the " +
      "buyer is." },
    { t: "p", x:
      "That matters more here than in most asset classes. The pool of people who want one " +
      "particular building in one particular place, at the price the model needs, is small and " +
      "grows unevenly. It also tends to thin out in the same conditions that make a holder want " +
      "to sell." },
    { t: "p", x:
      "An exit assumption is a claim about a buyer. Done properly, it names the likely buyer, why " +
      "they would buy and what they would pay on. That might be a multiple of earnings, a price " +
      "per square foot or a comparable sale. Done the usual way, it is a terminal value in a " +
      "spreadsheet: the purchase price, grown at an assumed rate and called a market." },
    { t: "h", x: "Illiquidity can be a strength" },
    { t: "p", x:
      "Real assets are slow to sell, and this is usually presented as a cost. Sometimes it is. It " +
      "is also why they are not repriced by sentiment every afternoon, and why a holder's " +
      "conviction is not tested weekly." },
    { t: "p", x:
      "The real defect is illiquidity left unpriced: a position bought at a valuation that " +
      "assumed an exit nobody had modelled." },
    { t: "h", x: "The test worth applying" },
    { t: "p", x:
      "Would this be a sound position if it were ugly? If the numbers work only when the building " +
      "is beautiful, what is being bought is the building. That is a legitimate purchase. It is a " +
      "purchase rather than an investment, and it should be judged as one." },
  ],
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
  minutes: 3,
  cites: [
    { what: "holding deposit", value: inr(DEPOSIT.amount) },
    { what: "refund term", value: DEPOSIT.refundable },
  ],
  body: [
    { t: "p", x:
      "A deposit is the first step. Here is what it does, and what follows, in the order you meet " +
      "them." },
    { t: "h", x: "It holds your units" },
    { t: "p", x:
      "When you hold units, you choose how many you intend to take and pay one holding deposit. " +
      "It is the same at every estate, whatever the number of units. From that moment your units " +
      "are held: the next person to open the page is offered the rest." },
    { t: "figure", label: "Holding deposit", value: inr(DEPOSIT.amount),
      source: "the vehicle register; the same at every estate, whatever the number of units" },
    { t: "h", x: "NAVINA holds it, as a fiduciary" },
    { t: "p", x:
      "You pay the deposit to NAVINA Structures Pvt Ltd, the company that forms the estate's LLP. " +
      "NAVINA holds it as a fiduciary until the partnership is formed and its partners are " +
      "admitted. Your receipt names the payee, so you can see where the money went." },
    { t: "h", x: "Settlement makes you a partner" },
    { t: "p", x:
      "The deposit holds your place. You become a partner when the balance is settled under the " +
      "Vehicle Agreement and your position is entered on the register. Settlement is what makes a " +
      "partner." },
    { t: "h", x: "It is refundable" },
    { t: "p", x:
      DEPOSIT.refundable + " If it is refunded, the hold ends: the units are offered again, the page records the refund, and you receive a receipt for that too." },
    { t: "h", x: "What comes next" },
    { t: "p", x:
      "You complete the balance, at the estate's published unit price, and the Vehicle Agreement " +
      "with Investor Relations. Identity checks run alongside, at your own pace. They need only " +
      "be complete before your units are allotted." },
    { t: "assert", x:
      "A deposit holds your place while you read, ask and decide." },
  ],
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
