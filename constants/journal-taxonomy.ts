/**
 * THE JOURNAL TAXONOMY — channels, franchises, distance and depth
 *
 * Authority: GC Journal Strategy v1.0
 *
 * ── WHY THE JOURNAL NEEDED A TAXONOMY AT ALL ─────────────────────────
 * It had four kinds — mechanism, decision, record, ground — and every one
 * describes the platform explaining itself. That is a perfectly good
 * publication and it is not the one the strategy asks for.
 *
 * The strategy's test is the sharpest line in it: *would we publish this
 * if Getaway Collective had nothing to sell?* Nothing in the old four
 * could pass that, because all four exist to explain something GC does.
 *
 * So this adds the outward axes and leaves the inward ones alone. One
 * Journal, one Entry type, two vocabularies that do not compete: `kind`
 * still says what a piece IS, and `channel` and `distance` say who it is
 * for and how far it sits from the Collection.
 *
 * ── DISTANCE IS THE LOAD-BEARING ONE ─────────────────────────────────
 * CULTURE → LIFE → PLACE → OWNERSHIP → COLLECTION.
 *
 * It exists to be counted. A Journal that drifts to mostly-COLLECTION has
 * quietly become a brochure, and nobody notices from inside a single
 * article — every individual piece looks reasonable. Measured across the
 * whole, the drift is obvious.
 *
 * scripts/journal-lint.js is where that becomes mechanical rather than
 * remembered: it computes the mean distance across every entry carrying
 * meta and refuses a Journal whose centre of gravity has moved past
 * OWNERSHIP. It also refuses an entry that declares independence and then
 * links into something GC sells, which is the same drift at article scale.
 */

/** The twelve channels. Related to GC's domains without being product docs. */
export type Channel =
  | "place" | "time" | "capital" | "architecture"
  | "land" | "life" | "family" | "design"
  | "food" | "people" | "ideas" | "collection";

export const CHANNELS: readonly { id: Channel; name: string; remit: string }[] = [
  { id: "place", name: "Place", remit: "Where somewhere is, and what that does to it." },
  { id: "time", name: "Time", remit: "The scarcest asset, and what proximity buys back." },
  { id: "capital", name: "Capital", remit: "Real assets explained without persuasion." },
  { id: "architecture", name: "Architecture", remit: "Buildings worth keeping, and why." },
  { id: "land", name: "Land", remit: "Ground, water, climate, approach." },
  { id: "life", name: "Life", remit: "How people actually live, not how they are sold to." },
  { id: "family", name: "Family", remit: "What is kept, and what is remembered." },
  { id: "design", name: "Design", remit: "Material, craft and the long view." },
  { id: "food", name: "Food", remit: "Where a region tastes of itself." },
  { id: "people", name: "People", remit: "Architects, founders, collectors, craftspeople, owners." },
  { id: "ideas", name: "Ideas", remit: "Arguments worth disagreeing with." },
  { id: "collection", name: "Collection", remit: "GC's own places and thinking. The near end." },
];

/**
 * Distance from the Collection. The funnel, as a measurable property.
 *
 * Ordered deliberately: index 0 is furthest from anything GC sells.
 */
export type Distance = "culture" | "life" | "place" | "ownership" | "collection";

export const DISTANCES: readonly Distance[] = [
  "culture", "life", "place", "ownership", "collection",
];

export const DISTANCE_RANK: Record<Distance, number> = {
  culture: 0, life: 1, place: 2, ownership: 3, collection: 4,
};

/**
 * Recurring franchises. Readers return to a name, not to a category.
 *
 * Deliberately fewer than the strategy lists. A franchise nobody has
 * written twice is a title, and a masthead of titles is how a publication
 * looks larger than it is.
 */
export type Franchise =
  | "two-hours-from-here"
  | "the-second-home-question"
  | "places-worth-keeping"
  | "the-value-of-time"
  | "own-less-own-better"
  | "what-we-leave-behind"
  | "capital-in-the-real-world"
  | "one-place"
  | "how-it-ages"
  | "field-notes";

export const FRANCHISES: readonly { id: Franchise; name: string; premise: string }[] = [
  { id: "two-hours-from-here", name: "Two Hours From Here",
    premise: "Geography at the radius where a weekend actually works." },
  { id: "the-second-home-question", name: "The Second Home Question",
    premise: "Whether to own one at all, argued honestly against our own interest." },
  { id: "places-worth-keeping", name: "Places Worth Keeping",
    premise: "Architecture that earns a long owner." },
  { id: "the-value-of-time", name: "The Value of Time",
    premise: "The arithmetic of weekends, summers and distance." },
  { id: "own-less-own-better", name: "Own Less. Own Better.",
    premise: "When access beats ownership, and when it does not." },
  { id: "what-we-leave-behind", name: "What We Leave Behind",
    premise: "Family, memory and the places children return to." },
  { id: "capital-in-the-real-world", name: "Capital in the Real World",
    premise: "Leisure real-estate economics, stated plainly." },
  { id: "one-place", name: "One Place",
    premise: "A single extraordinary place, at length." },
  { id: "how-it-ages", name: "How It Ages",
    premise: "The same building, revisited at five, ten and fifty years." },
  { id: "field-notes", name: "Field Notes",
    premise: "Short observations from looking at land." },
];

/**
 * How long a piece asks for. Attention states, not word counts.
 *
 * Stated so the Journal can be short on purpose. Without it every piece
 * drifts toward the same middling length, which serves nobody: the reader
 * with two minutes gets nothing, and the one with twenty gets an article
 * that stopped early.
 */
export type Depth = "glimpse" | "note" | "story" | "deep" | "film";

export const DEPTHS: readonly { id: Depth; name: string; minutes: string }[] = [
  { id: "glimpse", name: "Glimpse", minutes: "under 1" },
  { id: "note", name: "Note", minutes: "1–2" },
  { id: "story", name: "Story", minutes: "5–8" },
  { id: "deep", name: "Deep read", minutes: "15–25" },
  { id: "film", name: "Film or conversation", minutes: "10–60" },
];

/**
 * Who a piece is written for. Not a segment to be targeted — a reader to
 * be served. The distinction shows up in the writing: a segment gets copy
 * aimed at it, a reader gets something worth their time.
 */
/**
 * Note on the fourth: the strategy names this reader with a word §25
 * forbids as an actor noun — stewardship is philosophy here and never a
 * party. The reader is `custodian` instead, so the forbidden term does not
 * enter the codebase. The persona is unchanged; only its name is.
 */
export type Persona =
  | "builder" | "collector" | "sceptic" | "custodian"
  | "investor" | "escapist" | "explorer" | "conscious";

export const PERSONAS: readonly { id: Persona; name: string; wants: string }[] = [
  { id: "builder", name: "The Builder", wants: "To turn what they built into a better life." },
  { id: "collector", name: "The Architectural Collector", wants: "To take part in architecture worth preserving." },
  { id: "sceptic", name: "The Second-Home Sceptic", wants: "Extraordinary places without inheriting a job." },
  { id: "custodian", name: "The Family Custodian", wants: "Wealth turned into what a family remembers." },
  { id: "investor", name: "The Private Investor", wants: "Real assets they can understand." },
  { id: "escapist", name: "The Escapist", wants: "Somewhere that changes how they feel." },
  { id: "explorer", name: "The Explorer", wants: "To know what is actually two hours away." },
  { id: "conscious", name: "The Conscious Owner", wants: "Beauty without pointless consumption." },
];

/**
 * Editorial disclosure. Section 29 of the strategy, as a required field.
 *
 * `independent` is the default and it is a claim, not an absence — it
 * asserts GC has no interest in what is being discussed. Where GC owns,
 * is evaluating, or stands to gain, the piece says so. A Journal that
 * earns desire through credibility cannot leave this optional, because
 * the one time it matters is the one time somebody would rather not.
 */
export type EditorialDisclosure =
  | "independent"
  | "gc-owns"
  | "gc-evaluating"
  | "sponsored"
  | "illustrative-figures";

export const DISCLOSURE_TEXT: Record<EditorialDisclosure, string> = {
  independent:
    "Getaway Collective has no ownership or commercial interest in what is discussed here.",
  "gc-owns":
    "Getaway Collective owns or holds an interest in a place discussed here. Read it accordingly.",
  "gc-evaluating":
    "Getaway Collective is evaluating a place discussed here and may come to hold an interest in it.",
  sponsored:
    "This was commissioned or paid for. It is marked because you should know before you read it.",
  "illustrative-figures":
    "Figures here are illustrative. They describe how something works, not what any place has returned.",
};

/** Every field the strategy's data model asks a story to carry. */
export interface JournalMeta {
  readonly channel: Channel;
  readonly distance: Distance;
  readonly franchise?: Franchise;
  readonly depth: Depth;
  readonly persona: Persona;
  readonly alsoFor?: readonly Persona[];
  readonly disclosure: EditorialDisclosure;
  /** Somewhere else worth going, including off this site. */
  readonly elsewhere?: readonly { label: string; why: string; href?: string }[];
}

export const channelById = (id: Channel) => CHANNELS.find((c) => c.id === id);
export const franchiseById = (id: Franchise) => FRANCHISES.find((f) => f.id === id);

export const JOURNAL_LAWS = {
  theTest:
    "Would we publish this if Getaway Collective had nothing to sell? If not, it is marketing, and " +
    "it belongs somewhere the reader expects to be sold to.",
  distanceIsCounted:
    "A Journal that drifts to mostly-COLLECTION has become a brochure, and no single article ever " +
    "looks like the problem. Only the distribution shows it, so the distribution is checked.",
  disclosureIsMandatory:
    "Independence is a claim, not an absence. The one occasion it matters is the one occasion " +
    "somebody would rather not state it, which is why the field cannot be omitted.",
  figuresComeFromTheCanon:
    "An entry may explain a rule. It may not create one. A figure typed into prose would be the " +
    "most persuasive wrong number on the platform, because it is the one written to be readable.",
} as const;
