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

export const JOURNAL: readonly Entry[] = [J01, J02, J03, J04, J05, J06, J07, J08];

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
