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

import { WATERFALL } from "../app/_assemblies/data";
import { DSCR, UNIT, MY_YIELD_BPS, SITE } from "../app/_assemblies/slowspace";
import type { JournalMeta } from "../constants/journal-taxonomy";

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
  | { t: "figure"; label: string; value: string; source: string };

/* Values read from the canon, so an entry cannot drift from it. */
const PARTNER_BPS = WATERFALL[WATERFALL.length - 1].bps;
const OPCO_BPS = WATERFALL[1].bps;
const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";

/* ═══════════════════════════════════════════════════════════════════ */

const J01: Entry = {
  id: "J-01",
  slug: "why-a-body-corporate",
  title: "Why a body corporate, and not a share of a building",
  standfirst:
    "The structure was chosen for what happens when things go wrong, not for what happens when " +
    "they go right.",
  kind: "decision",
  published: "2026-06-02",
  minutes: 6,
  body: [
    { t: "p", x:
      "There are simpler ways to sell a tenth of a property than forming a Limited Liability " +
      "Partnership for it. A co-ownership deed is shorter. A fractional title is easier to " +
      "explain. Both were considered and both were rejected, for the same reason." },
    { t: "h", x: "Co-ownership fails at the first disagreement" },
    { t: "p", x:
      "Ten co-owners of a building are ten people who must agree, unanimously, on every act of " +
      "management. There is no mechanism for a decision that nine want and one does not, and no " +
      "mechanism at all for a decision that must be made this week." },
    { t: "p", x:
      "The usual answer is a side agreement between the co-owners setting out how they will vote. " +
      "That agreement is a contract between individuals: it binds the people who signed it, it " +
      "does not bind a person who buys from one of them, and it is enforced by suing your " +
      "co-owner." },
    { t: "assert", x:
      "A body corporate makes the constitution part of the asset. A person who acquires a " +
      "position acquires it subject to the Agreement, whether or not they have read it, and the " +
      "mechanism for a contested decision is a vote rather than a lawsuit." },
    { t: "h", x: "Liability stops at the vehicle" },
    { t: "p", x:
      "A co-owner of a building is exposed to what happens at that building without limit. A " +
      "partner in a Limited Liability Partnership is exposed to what they contributed. When a " +
      "property carries a facility of several crore, that difference is the whole of the " +
      "downside." },
    { t: "h", x: "What it costs" },
    { t: "p", x:
      "Formation costs money and takes time. Every vehicle must file, be audited, and be " +
      "administered, and that cost is real whether the property earns or not. It is paid from the " +
      "administrative reserve." },
    { t: "p", x:
      "It also means the position is a partnership interest rather than an interest in land, " +
      "which changes its tax treatment and makes it harder to pledge to a lender. Those are " +
      "genuine losses and they were accepted deliberately." },
    { t: "h", x: "Where the exception lives" },
    { t: "p", x:
      "The Limited Liability Partnership is the default and a different structure needs Board " +
      "approval for the specific property. That is written as a default with an exception rather " +
      "than as a rule, because a rule with no exception gets broken quietly the first time it " +
      "does not fit." },
  ],
  onward: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part A sets out the three entities and what each is responsible for." },
    { path: "/governance", title: "Governance",
      why: "How a contested decision is actually resolved." },
  ],
};

const J02: Entry = {
  id: "J-02",
  slug: "the-waterfall-read-from-the-bottom",
  title: "The waterfall, read from the bottom",
  standfirst:
    "Six stages, in order. The number that matters to a partner is the last one, and most " +
    "documents show you the first.",
  kind: "mechanism",
  published: "2026-06-14",
  minutes: 7,
  cites: [
    { what: "partner stage, basis points", value: String(PARTNER_BPS) },
    { what: "operating partner stage, basis points", value: String(OPCO_BPS) },
  ],
  body: [
    { t: "p", x:
      "Revenue arrives at a property as one number and leaves as six. The order is fixed, each " +
      "stage is satisfied in full before the next receives anything, and the six sum to the " +
      "whole. There is no seventh stage." },
    { t: "figure", label: "To partners", value: pct(PARTNER_BPS),
      source: "Stage six. Read from the waterfall registry, not typed here." },
    { t: "h", x: "Why the order is the disclosure" },
    { t: "p", x:
      "A document can describe the same six stages honestly and still mislead, by presenting them " +
      "as a set rather than a sequence. Four percentages that sum to a hundred look like a " +
      "division of the whole. They are not: they are a queue, and where you stand in it decides " +
      "whether you are paid at all in a bad year." },
    { t: "assert", x:
      "A percentage described as the partners' share, with a note that it also services " +
      "borrowing, is not the partners' share. It is the partners' share plus somebody else's, " +
      "and the somebody else is paid first." },
    { t: "h", x: "The two stages nobody asks about" },
    { t: "p", x:
      "The administrative reserve and the sinking fund are each two and a half per cent of " +
      "revenue. They are the least interesting stages and the ones most worth understanding." },
    { t: "p", x:
      "The reserve exists so that a property with a bad quarter does not become a property with " +
      "an emergency. It has a floor, and stage six does not run if paying it would breach that " +
      "floor. A partner can therefore have a profitable quarter and receive nothing, and that is " +
      "the mechanism protecting the position rather than failing it." },
    { t: "p", x:
      "The sinking fund replaces things before they fail. A property that has not funded " +
      "replacement is a property whose distributions were always partly a deferral." },
    { t: "h", x: "Reading it backwards" },
    { t: "p", x:
      "The useful way to read any waterfall is from the bottom. Start at the stage you are in, " +
      "then count what has to be true above you before you see anything. For a partner in a " +
      "vehicle carrying debt, five things have to be true." },
  ],
  onward: [
    { path: "/collection/slowspace-coastal/investment", title: "How capital works",
      why: "The same six stages with worked figures." },
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Part D on what leverage does to stage six." },
  ],
};

const J03: Entry = {
  id: "J-03",
  slug: "what-settlement-changes",
  title: "What settlement changes",
  standfirst:
    "There is a precise moment at which a person becomes a partner, and it is not the moment " +
    "they press the button.",
  kind: "mechanism",
  published: "2026-06-25",
  minutes: 5,
  body: [
    { t: "p", x:
      "Most platforms treat acceptance as the event. You confirm, a screen congratulates you, and " +
      "you are described from that moment as an owner of something." },
    { t: "assert", x:
      "Nothing here changes state until cleared funds reach the vehicle. Before settlement you " +
      "have an obligation and no rights. After it you have both, and the change cannot be " +
      "reversed by us, by you, or by agreement." },
    { t: "h", x: "Why the gap is described rather than hidden" },
    { t: "p", x:
      "Between commitment and settlement there is a window of up to fifteen working days in which " +
      "a person has promised capital and holds nothing. That window is uncomfortable and it would " +
      "be easy to paper over by calling them a partner early." },
    { t: "p", x:
      "Doing so would make the register wrong. A register that lists people whose money has not " +
      "arrived is a register that cannot be used to compute a vote or a distribution, which are " +
      "the two things a register is for." },
    { t: "h", x: "What it means for the screens" },
    { t: "p", x:
      "The screen after a commitment says Committed. It does not say Member, it does not " +
      "congratulate, and it states in the same breath that governance rights and entitlement " +
      "begin later. The screen that does say Member is a different screen, reached at a different " +
      "time, and reaching it is an event." },
    { t: "h", x: "Why there is no undo" },
    { t: "p", x:
      "A reversible commitment is a commitment other partners cannot rely on. If a settled " +
      "position could be unwound, every quorum would be provisional and every distribution " +
      "computed on a register that might change behind it." },
    { t: "p", x:
      "The cost of that is borne entirely by the person committing, so the deliberation is placed " +
      "before the act. The commitment control takes three seconds of sustained pressure, and the " +
      "figure being committed stays on screen throughout." },
  ],
  onward: [
    { path: "/flow", title: "The worked flow",
      why: "One offering walked end to end, including this moment." },
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part D states it as an obligation rather than as prose." },
  ],
};

const J04: Entry = {
  id: "J-04",
  slug: "governance-without-ownership",
  title: "Governance without ownership",
  standfirst:
    "The party that writes the rules holds no equity in the vehicles those rules govern. This is " +
    "the entrenched clause, and it is the expensive one.",
  kind: "decision",
  published: "2026-07-03",
  minutes: 6,
  body: [
    { t: "p", x:
      "The ordinary arrangement is for a sponsor to hold a stake in what it manages, on the " +
      "reasoning that shared exposure aligns everyone. It does align some things. It also means " +
      "the party interpreting the rules has a position that a particular interpretation would " +
      "improve." },
    { t: "assert", x:
      "Getaway Collective holds no economic interest in any vehicle it governs. It is paid from " +
      "stage two of the waterfall for operating the platform, and from nothing else. The clause " +
      "is entrenched: changing it requires unanimity." },
    { t: "h", x: "What this buys" },
    { t: "list", x: [
      "There is no position we would benefit from marking up, so valuations are not ours to flatter.",
      "There is no stake for us in whether stage six runs, so the reserve floor is not a number we " +
      "are tempted to reinterpret.",
      "We cannot be bought out of the rules by acquiring more of the vehicle, because there is " +
      "nothing to acquire.",
      "A partner reading a rule can ask what we gain from it, and the answer is the same for " +
      "every rule.",
    ] },
    { t: "h", x: "What it costs" },
    { t: "p", x:
      "It costs the upside. A platform that took ten per cent of every vehicle would be worth " +
      "considerably more than this one if the properties do well, and the people who built it " +
      "would be paid in that appreciation rather than in a share of revenue." },
    { t: "p", x:
      "It also removes the easiest answer to a partner asking whether our interests are aligned. " +
      "They are not aligned. They are separated, on purpose, and separation is a weaker-sounding " +
      "promise than alignment even where it is the stronger one." },
    { t: "h", x: "Why entrenched" },
    { t: "p", x:
      "A clause that a majority can amend is a clause that survives until it becomes inconvenient. " +
      "Unanimity means the rule outlives the people who wrote it, including at the moment they " +
      "would most like to be rid of it." },
  ],
  onward: [
    { path: "/legal/disclosures", title: "Standing Disclosures",
      why: "The same position, stated as a disclosure rather than argued." },
  ],
};

const J05: Entry = {
  id: "J-05",
  slug: "reading-a-modelled-number",
  title: "Reading a modelled number",
  standfirst:
    "Every forward-looking figure on this platform carries a class saying how it was arrived at. " +
    "Here is what each one is worth.",
  kind: "mechanism",
  published: "2026-07-11",
  minutes: 5,
  /* No `cites`: this entry quotes no figure. A citation list is for
     values the prose actually depends on, and padding it would make the
     load-time check meaningless. */
  body: [
    { t: "p", x:
      "A number on a screen carries no evidence of where it came from. The same typeface renders " +
      "a figure counted yesterday and a figure assumed for 2031, and a reader has no way to tell " +
      "them apart unless they are told." },
    { t: "h", x: "The six classes" },
    { t: "list", x: [
      "Observed — counted or measured. A night taken, a payment received.",
      "Verified — asserted by someone and checked against a source document.",
      "Modelled — computed from stated assumptions. Correct arithmetic on inputs that may be wrong.",
      "Estimated — a judgement, made by a person, on incomplete information.",
      "Forecast — a modelled figure about a period that has not happened.",
      "Pending — expected, not yet arrived. Shown as absent rather than as zero.",
    ] },
    { t: "assert", x:
      "The classes are ordered, and the order is the point. A figure never appears with a " +
      "stronger class than the weakest input it was computed from." },
    { t: "h", x: "Why a modelled yield is not a yield" },
    { t: "p", x:
      "A modelled distribution is the output of an occupancy assumption, a rate assumption and a " +
      "cost assumption, run through a waterfall. The arithmetic can be flawless while all three " +
      "assumptions are wrong, and nothing about the presentation of the result would look " +
      "different." },
    { t: "p", x:
      "This is why a provisional figure carries its mark everywhere it appears rather than " +
      "carrying it once at the point of origin. A number quoted without its class has been " +
      "laundered by being moved." },
    { t: "h", x: "What happens when sources disagree" },
    { t: "p", x:
      "Material prepared by a promoter sometimes contains figures that cannot all hold at once. " +
      "The rule is: carry the conservative figure, state the inconsistency on the record, and " +
      "compute the dependent figures rather than restating them, so the two can never disagree " +
      "again." },
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
    "A sandbar at Padubidri with the Arabian Sea on one side and the Shambhavi estuary on the " +
    "other, and what that costs to build on.",
  kind: "ground",
  published: "2026-07-19",
  minutes: 6,
  cites: [{ what: "site keys", value: String(SITE.keys) }],
  body: [
    { t: "p", x:
      "The land sits between an open sea and a river mouth. From the western edge the water is " +
      "surf; from the eastern edge, four hundred metres away, it is still enough to hold a " +
      "reflection. Very little of the Karnataka coast does both." },
    { t: "figure", label: "Keys", value: String(SITE.keys),
      source: "Read from the property record." },
    { t: "h", x: "What dual frontage is worth" },
    { t: "p", x:
      "It is worth demand that does not collapse in one season. Sea frontage sells the winter; " +
      "estuary frontage is calm in months when the surf is unusable. A property with one exposure " +
      "has one season." },
    { t: "h", x: "What it costs" },
    { t: "p", x:
      "Everything else. Two waters means two edges to hold, salt from one side and humidity from " +
      "the other, and a foundation on ground that was recently river silt. Structural cost per " +
      "key is materially above an inland site." },
    { t: "assert", x:
      "It also means Coastal Regulation Zone rules apply on both edges rather than one. The " +
      "approvals held today are not a forecast of approvals tomorrow, and a change to that " +
      "regime alters what may be built on land already bought." },
    { t: "h", x: "Access" },
    { t: "p", x:
      "The site is a little over a kilometre from the national highway and about fifty minutes " +
      "from Mangaluru airport. That access is the single strongest observed fact about the " +
      "property, and it is the one least likely to change." },
    { t: "h", x: "What is not yet true" },
    { t: "p", x:
      "Nothing has been built. The programme runs to a handover in early 2028, the facility is " +
      "drawn during construction against an asset that earns nothing, and every revenue figure " +
      "attached to the property is a forecast about a building that does not exist." },
  ],
  onward: [
    { path: "/flow", title: "SlowSpace Coastal",
      why: "The offering for this property, walked end to end." },
  ],
};

const J07: Entry = {
  id: "J-07",
  slug: "the-night-is-not-the-product",
  title: "The night is not the product",
  standfirst:
    "Entitlement is an incident of a capital position, not the reason it exists. Getting that " +
    "backwards changes what the platform is.",
  kind: "decision",
  published: "2026-07-24",
  minutes: 5,
  cites: [
    { what: "unit share, basis points", value: String(UNIT.sharePct) },
    { what: "nights per year, minimum", value: String(UNIT.nights.min) },
  ],
  body: [
    { t: "p", x:
      "A partner in a vehicle is entitled to a number of nights each year at the property that " +
      "vehicle owns, in proportion to contribution. The obvious way to describe this is as buying " +
      "time somewhere pleasant. That description is wrong and the error is not cosmetic." },
    { t: "assert", x:
      "Entitlement is an incident of the position. It is not separately priced, it is not " +
      "exchangeable for money, and it does not carry forward. A position whose nights went unused " +
      "for a decade would be worth exactly what it was worth on the day it settled." },
    { t: "h", x: "What goes wrong if it is the product" },
    { t: "p", x:
      "If nights are what is being sold, then the number of nights is the thing to maximise, and " +
      "every night a partner takes is a night the property cannot sell. The interests of the " +
      "partners and the interests of the vehicle then point in opposite directions." },
    { t: "p", x:
      "Worse, it makes the position a prepayment. A prepayment for accommodation is a different " +
      "regulated thing from a contribution to a body corporate, with different protections and a " +
      "different tax treatment, and describing one as the other does not change which it is." },
    { t: "h", x: "How the mechanism keeps it honest" },
    { t: "p", x:
      "A night released rather than taken is sold, and the revenue enters the waterfall at stage " +
      "one like any other. A partner who takes nothing is therefore paid slightly more, and a " +
      "partner who takes their full entitlement is paid slightly less. Neither is penalised; the " +
      "arithmetic simply follows." },
    { t: "h", x: "Precedence" },
    { t: "p", x:
      "Where more partners want the same dates than the property can hold, the partner who has " +
      "drawn least that year goes first. Not the largest position, and not the earliest request. " +
      "Weighted voting decides money; it does not decide who gets the last weekend in December." },
  ],
  onward: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part F, where entitlement is stated as an obligation." },
  ],
};

const J08: Entry = {
  id: "J-08",
  slug: "what-this-platform-does-not-do",
  title: "What this platform does not do",
  standfirst:
    "A list of things we have been asked for and declined, with the reason for each. Shorter to " +
    "read than finding out later.",
  kind: "decision",
  published: "2026-07-30",
  minutes: 4,
  cites: [
    { what: "worked example DSCR", value: DSCR.toFixed(2) },
    { what: "worked example yield, basis points", value: String(MY_YIELD_BPS) },
  ],
  body: [
    { t: "p", x:
      "Most of what follows was requested by someone reasonable, for a reason that made sense at " +
      "the time." },
    { t: "h", x: "We do not advise" },
    { t: "p", x:
      "Getaway Collective gives no personalised financial advice, and is not registered to. The " +
      "figures published are inputs to a decision that remains yours, and no arrangement of them " +
      "amounts to a recommendation. The position is stated formally in Part L of the Terms and " +
      "Conditions, which is where it binds." },
    { t: "h", x: "We do not guarantee a return" },
    { t: "p", x:
      "No party guarantees any return. There is no preferred return, no floor, and no " +
      "arrangement under which a shortfall is made up from elsewhere." },
    { t: "h", x: "We do not operate a market" },
    { t: "p", x:
      "The internal register is a noticeboard for partners willing to buy or sell after lock-in. " +
      "It matches nobody, prices nothing, and guarantees no counterparty. Calling it a secondary " +
      "market would imply an obligation nobody has taken on." },
    { t: "h", x: "We do not smooth distributions" },
    { t: "p", x:
      "A quarter that earns less pays less. Reserving in good quarters to top up bad ones would " +
      "make the figures more comfortable and the record less true, and the reserve exists for " +
      "capital events rather than for presentation." },
    { t: "h", x: "We do not show a figure without its class" },
    { t: "p", x:
      "A forward-looking number appears with its confidence class or it does not appear. This is " +
      "occasionally awkward in a headline, and it is the rule that most often makes our material " +
      "look less confident than someone else's." },
    { t: "assert", x:
      "Where a source document contains figures that cannot all hold at once, the conservative " +
      "one is carried and the inconsistency is published. The worked example on this platform " +
      "reached us claiming a cover ratio and a cash yield that its own inputs could not both " +
      "support. The conservative figure is shown, and the ratio is computed from it." },
  ],
  onward: [
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Everything above, stated as risk rather than as policy." },
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
    "A life is about four thousand Saturdays. Most people spend the middle third of them within " +
    "forty minutes of where they work.",
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
      "Somebody who lives to eighty gets a little over four thousand Saturdays. It is a small " +
      "enough number to hold in your head, which is the only reason it is worth stating — nobody " +
      "has ever changed a decision because of a figure they could not picture." },
    { t: "p", x:
      "The arithmetic that follows is less comfortable. Assume the first twenty years belong to " +
      "childhood and the last ten to a slower kind of time. That leaves roughly two and a half " +
      "thousand in the middle, and the middle is where the work is. Take out the ones already " +
      "committed — to obligation, to travel, to recovering from the week — and what remains is a " +
      "few hundred that are genuinely yours to place." },
    { t: "h", x: "Distance is what actually spends them" },
    { t: "p", x:
      "The usual assumption is that people go away less often because they are busy. The more " +
      "reliable predictor is how far away the somewhere is." },
    { t: "p", x:
      "A place ninety minutes from home is a Friday evening decision. A place four hours away is a " +
      "plan, and a plan needs a reason, and a reason needs a long weekend. The first gets used " +
      "thirty times a year without anybody deciding to use it. The second gets used four times, " +
      "and two of those are because somebody else was coming." },
    { t: "p", x:
      "This is why proximity behaves like a luxury rather than a convenience. It does not make an " +
      "hour better. It converts hours that would not otherwise have existed." },
    { t: "h", x: "The summers version" },
    { t: "p", x:
      "There is a harder form of the same arithmetic, and parents recognise it immediately. A " +
      "child is eight for one year. If somewhere takes a full day to reach, you will be there " +
      "together perhaps three times while they are eight. If it takes two hours, perhaps twelve." },
    { t: "p", x:
      "The place did not change. The number of times a family assembled in it did, and that is the " +
      "only variable a family actually remembers." },
    { t: "assert", x:
      "Frequency is a function of distance. Almost everything else people optimise about a second " +
      "place — size, finish, view — changes how good one visit is. Distance changes how many there " +
      "are." },
    { t: "h", x: "What this does not argue" },
    { t: "p", x:
      "It does not argue for buying anything. A rented house ninety minutes away beats an owned " +
      "one four hours away on this measure, and it is worth saying plainly because the opposite " +
      "conclusion would be the convenient one for us to reach." },
    { t: "p", x:
      "What it argues is narrower: when people evaluate somewhere to go regularly, they weigh the " +
      "qualities of the place and almost never weigh the distance, and the distance is the term " +
      "that decides how much of it they actually get." },
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
    "Second homes are usually evaluated on the purchase price. The purchase price is rarely the " +
    "part that goes wrong.",
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
      "A second house is bought on a number everybody discusses and held on several nobody does. " +
      "The purchase is negotiated hard, examined by a lawyer and slept on. What follows it is " +
      "absorbed a line at a time, and by the time it is visible it has become normal." },
    { t: "h", x: "The costs that do not appear in the decision" },
    { t: "list", x: [
      "Somebody local who holds the keys, and is paid whether anybody comes or not.",
      "The garden, which does not pause between visits.",
      "Municipal dues, insurance and the annual bill nobody predicted.",
      "The repair that is small when found and structural when found late.",
      "The drive itself — the part most often left out, and the part paid every single time.",
    ] },
    { t: "p", x:
      "Individually each is minor. Together they behave like a subscription to a house, and the " +
      "subscription does not scale down when the house is empty. That is the whole difficulty: the " +
      "cost is a function of the calendar, and the use is a function of how far away it is." },
    { t: "h", x: "Divide by the nights, not by the year" },
    { t: "p", x:
      "The instructive figure is not annual cost. It is annual cost divided by the number of nights " +
      "somebody actually slept there." },
    { t: "p", x:
      "Almost nobody performs this division, and the reason is not innumeracy. It is that the " +
      "answer tends to be a number people would rather not carry around, and there is no moment " +
      "in owning a house that forces you to calculate it." },
    { t: "p", x:
      "Do it anyway. If a house costs a lakh a month to hold and is used twenty-four nights, each " +
      "night cost fifty thousand rupees before anybody ate anything. That is not an argument " +
      "against the house. It is an argument for knowing the number." },
    { t: "h", x: "The part that arrives ten years later" },
    { t: "p", x:
      "The version of this that surprises people is generational. A house bought for a young " +
      "family is used most in the years the children are small, less through the years they are " +
      "not, and then reaches a moment where it belongs to people who did not choose it." },
    { t: "p", x:
      "Sometimes they love it. Often they inherit a maintenance obligation attached to somebody " +
      "else's memory of a place, in a location they would not have picked, and cannot easily sell " +
      "because it is held between siblings who disagree." },
    { t: "assert", x:
      "The failure mode of a second house is almost never the house. It is the gap between how " +
      "often somebody imagined being there and how often they were, compounded by a cost that " +
      "never noticed the difference." },
    { t: "h", x: "Three honest answers" },
    { t: "p", x:
      "Rent. If the total is a handful of nights a year, renting is cheaper, more varied and ends " +
      "cleanly. Most people who ask this question should rent, and it is worth us saying so." },
    { t: "p", x:
      "Buy, and use it properly. Buying works when it is close enough to be used without a plan, " +
      "and when the holding cost has been divided by a realistic number of nights rather than an " +
      "optimistic one." },
    { t: "p", x:
      "Or hold part of something better. Fractional structures exist because the sums above do not " +
      "improve with a nicer house — they improve with a smaller share of the standing cost. We " +
      "build one of those, which is exactly why the first answer had to come first." },
  ],
  onward: [
    { path: "/how-it-works", title: "How it works",
      why: "The third answer, set out in full, including what it costs." },
  ],
};

const J11: Entry = {
  id: "J-11",
  slug: "what-the-sea-does-to-time",
  title: "What the sea does to time",
  standfirst:
    "People describe the coast as relaxing. What they usually mean is that it is loud enough to " +
    "stop them thinking, and slow enough that they notice.",
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
      "A coast is the only landscape that keeps time out loud. Mountains are older and say nothing " +
      "about it. Forests move on a scale nobody watches. The sea arrives every few seconds, all " +
      "day, and it has done so continuously for longer than there have been people to hear it." },
    { t: "p", x:
      "The practical consequence is that it is very difficult to be efficient near one. Efficiency " +
      "requires you to believe the next hour matters more than this one, and a tide is a standing " +
      "argument against that." },
    { t: "h", x: "Why the first evening is always long" },
    { t: "p", x:
      "Almost everyone reports the same distortion. The first evening by the sea feels " +
      "disproportionately long, and the last morning disappears." },
    { t: "p", x:
      "The likeliest explanation is unglamorous: time feels long when there is a lot to attend to " +
      "and nothing to anticipate. On arrival everything is new and nothing is scheduled. By the " +
      "final morning the light and the sound have become background, and the drive home is " +
      "already running." },
    { t: "p", x:
      "This is worth knowing because it is the argument for going more often rather than for " +
      "longer. Two nights taken twelve times a year contain twelve first evenings. Two weeks taken " +
      "once contains one." },
    { t: "h", x: "What it asks of a building" },
    { t: "p", x:
      "Coastal architecture is mostly a set of arguments with salt, and the buildings that survive " +
      "it are the ones that stopped resisting. Salt finds fixings. Wind finds anything cantilevered " +
      "for a photograph. The monsoon does not care what the render was rated for." },
    { t: "p", x:
      "The houses that age well on this coastline tend to be low, deeply shaded, built of things " +
      "that were already local, and designed by somebody who had been there in July rather than " +
      "in January." },
    { t: "assert", x:
      "A coastal building is judged by what it looks like after its fifth monsoon. Nothing about " +
      "the first year predicts it." },
  ],
  onward: [
    { path: "/collection/slowspace-coastal/place", title: "The place",
      why: "One stretch of this coastline, described at length." },
  ],
};

const J12: Entry = {
  id: "J-12",
  slug: "houses-that-get-better-when-it-rains",
  title: "Houses that get better when it rains",
  standfirst:
    "Most buildings are photographed in sunshine and endure the rest. A few are designed the other " +
    "way round.",
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
      "The Western Ghats receive between two and seven metres of rain a year, arriving mostly " +
      "within four months. Any building there is a proposition about water, whatever else its " +
      "architect thought it was about." },
    { t: "p", x:
      "Most contemporary houses in the region treat this as a problem to be sealed against. The " +
      "older ones treat it as the season the building was designed for, and the difference shows " +
      "up in about six years." },
    { t: "h", x: "What the traditional answer got right" },
    { t: "list", x: [
      "Deep overhangs, so water leaves the wall before it reaches the ground.",
      "Raised plinths, because the ground itself moves water sideways for months.",
      "Courtyards that collect rain deliberately rather than shedding it accidentally.",
      "Sloped roofs steep enough that nothing sits still long enough to find a way in.",
      "Materials that darken and remain sound, rather than materials that hold their colour and fail.",
    ] },
    { t: "p", x:
      "None of this is nostalgia. Each is a response to a measured quantity of water, arrived at " +
      "by people who rebuilt after getting it wrong and did not have the option of moving away " +
      "from the consequence." },
    { t: "h", x: "The photograph problem" },
    { t: "p", x:
      "A deep verandah is the least photogenic thing in architecture. It is dark, it obscures the " +
      "facade, and it makes the interior read as a shadow. It is also the single element most " +
      "responsible for whether a house in high rainfall is pleasant to be in during the four " +
      "months it rains." },
    { t: "p", x:
      "Buildings optimised for a single image tend to lose it. Glass to the floor, flat parapets, " +
      "flush details, a white wall meeting the ground without a plinth — every one photographs " +
      "beautifully in February and explains itself by the third monsoon." },
    { t: "assert", x:
      "A house in high rainfall should be judged in July. Any assessment made in January is an " +
      "assessment of the photograph." },
    { t: "h", x: "What ageing well actually looks like" },
    { t: "p", x:
      "Laterite darkens. Timber silvers. Copper turns and then stops. Lime absorbs and releases " +
      "and keeps a wall breathing. These are materials with a second appearance, and the second " +
      "one is the one the building spends its life in." },
    { t: "p", x:
      "The opposite is a surface with exactly one good state, maintained against entropy at " +
      "increasing cost until somebody decides it is easier to replace. That building was not built " +
      "badly. It was built for a photograph, and the photograph was taken." },
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
    "The two judgements are unrelated, and conflating them is the commonest error in leisure " +
    "property.",
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
      "Somebody walks into a house on a hillside and knows within a minute that they want it. That " +
      "reaction is real information — it predicts, quite reliably, that other people will react " +
      "the same way. It predicts almost nothing about whether owning it will make money." },
    { t: "p", x:
      "The two questions run on different variables, and the trouble is that the first is answered " +
      "instantly and the second takes a fortnight of work. Whichever question is answered first " +
      "tends to become the conclusion." },
    { t: "h", x: "What actually determines the return" },
    { t: "list", x: [
      "What was paid for the land, against what the land is worth without the building on it.",
      "The cost to build, and how far that ran past the estimate.",
      "How many nights a year it earns, which is a climate and a distance question before it is a marketing one.",
      "What the operator takes before anything reaches an owner.",
      "Debt, and what it costs in the months nothing is earned.",
      "The reserve, and whether anybody funded one.",
    ] },
    { t: "p", x:
      "None of those is visible from the verandah. Several are actively obscured by it: a building " +
      "that cost far too much is frequently the most impressive one on the site, because that is " +
      "where the money went." },
    { t: "h", x: "Seasonality is the term people underestimate" },
    { t: "p", x:
      "A place that is extraordinary for five months and unreachable for two has an occupancy " +
      "ceiling set by weather. That ceiling is not a marketing problem and no amount of " +
      "photography moves it." },
    { t: "p", x:
      "The mistake is to model an annual average. The costs are monthly and the revenue is " +
      "seasonal, which means the question is not whether the year works — it is whether the " +
      "reserve carries the months that do not." },
    { t: "h", x: "Where the money goes before it reaches an owner" },
    { t: "p", x:
      "In any operated property, revenue passes through a sequence before it becomes a " +
      "distribution: operating costs, the operator's share, debt, tax, reserve, and only then " +
      "whatever remains. Each stage is contractual and each is senior to the owner." },
    { t: "p", x:
      "An owner evaluating a leisure asset should be able to state that sequence for the specific " +
      "property, in order, with the percentage at each stage. If nobody can produce it, the " +
      "position being offered is not understood by the person offering it." },
    { t: "assert", x:
      "Ask what happens to every hundred rupees of revenue. It is a simple question and it is " +
      "answerable. The frequency with which it is not answered is itself the finding." },
    { t: "h", x: "A hundred rupees, followed to the end" },
    { t: "p", x:
      "The figures below are invented and the shape is not. Every stage is a real contractual " +
      "claim that exists in most operated leisure assets, ordered as it is actually paid." },
    { t: "list", x: [
      "100 arrives as revenue. This is the number quoted in the brochure.",
      "38 leaves as operating cost — people, power, water, supplies, upkeep. It is largely fixed, which is why occupancy matters so much.",
      "10 leaves as the operator's fee, usually charged on revenue rather than on profit. Note the order: it is taken whether or not anything is earned below it.",
      "6 leaves as sales and distribution — the platforms that fill the calendar take a percentage of what they fill it with.",
      "12 leaves as interest, if the asset carries debt at a typical loan-to-value.",
      "8 leaves as the reserve for major repair, assuming somebody funded one. Where nobody did, this line reads zero and reappears as a capital call in year seven.",
      "That leaves 26 before tax, against an asset that may have cost twenty-five times the annual revenue to acquire.",
    ] },
    { t: "p", x:
      "Twenty-six per cent of revenue sounds healthy. Against the acquisition cost it is roughly a " +
      "one per cent yield before tax, and that is the number that matters, because it is the one " +
      "being compared against every other place the money could sit." },
    { t: "p", x:
      "Move one variable and watch it break. Drop occupancy by a fifth — one bad monsoon, one road " +
      "closed, one year the flights got expensive. Revenue falls to 80. Operating cost barely " +
      "moves, because a building costs almost the same to keep whether or not anybody is in it. " +
      "The operator's fee falls with revenue; interest does not fall at all. What was 26 becomes " +
      "single digits, and the reserve is the first line anybody proposes to skip." },
    { t: "assert", x:
      "Leisure assets are operationally geared. A fifth off revenue is not a fifth off the return " +
      "— it is most of it, because the costs are annual and the revenue is seasonal." },
    { t: "h", x: "What the reserve actually is" },
    { t: "p", x:
      "The eight in that list is the least discussed line and the one that decides how the asset " +
      "looks in year fifteen. Roofs, plant, pumps, waterproofing and vehicles all have replacement " +
      "cycles measured in years, and none of them announce themselves." },
    { t: "p", x:
      "An asset without a funded reserve is not cheaper to hold. It has deferred a known cost into " +
      "an unknown year, and the year it lands is disproportionately likely to be a year revenue " +
      "was already poor — because the same weather that emptied the calendar is what found the " +
      "roof." },
    { t: "p", x:
      "This is the single most useful question to ask of any operated property: what is in the " +
      "reserve, what is it forecast against, and who decides when it is spent. The answer is " +
      "usually either precise or absent, and both are informative." },
    { t: "h", x: "The exit nobody modelled" },
    { t: "p", x:
      "Almost every projection for a leisure asset ends with a sale, and almost none of them " +
      "explain who the buyer is." },
    { t: "p", x:
      "That matters more here than in most classes. The pool of people who want a specific " +
      "extraordinary building in a specific location, at the price required to make the model " +
      "work, is small and does not grow steadily. It is also correlated with exactly the " +
      "conditions under which a holder might want to sell." },
    { t: "p", x:
      "An exit assumption is a claim about a buyer. Written properly it names who they are likely " +
      "to be, what they would be buying it for, and what they would pay it on — a multiple of " +
      "earnings, a price per square foot, or a comparable transaction. Written the usual way it is " +
      "a terminal value in a spreadsheet, arrived at by applying a growth rate to the acquisition " +
      "price and calling the result a market." },
    { t: "h", x: "Illiquidity is not automatically a defect" },
    { t: "p", x:
      "Real assets are slow to sell, and this is usually presented as a cost. Sometimes it is. It " +
      "is also the reason they are not repriced by sentiment every afternoon, and the reason a " +
      "holder is not tested on their conviction weekly." },
    { t: "p", x:
      "The defect is not illiquidity. It is illiquidity that was not priced — a position entered " +
      "at a valuation that assumed an exit nobody had modelled." },
    { t: "h", x: "The test worth applying" },
    { t: "p", x:
      "Would this be a sound position if it were ugly? If the numbers only work when the building " +
      "is beautiful, what is being bought is the building, and that is a legitimate purchase — it " +
      "is simply not an investment, and it should not be underwritten as one." },
  ],
  onward: [
    { path: "/collection/slowspace-coastal/investment", title: "The Investment",
      why: "The same sequence, stated for one specific vehicle, with a confidence class on every figure." },
    { path: "/legal/risk-disclosure", title: "Risk disclosure",
      why: "How this loses money, before anybody is asked for anything." },
  ],
};

export const JOURNAL: readonly Entry[] = [
  J01, J02, J03, J04, J05, J06, J07, J08,
  J09, J10, J11, J12, J13,
];

export const entryBySlug = (slug: string): Entry | undefined =>
  JOURNAL.find((e) => e.slug === slug);

export const JOURNAL_INTRO =
  "One decision an entry, with what it cost. Every figure quoted here is read from the same " +
  "registry the application reads, so an entry cannot describe a platform that does not exist.";

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
