/**
 * THE JOURNAL, MADE READABLE — what the site lays around each entry
 *
 * 24 Sep 2026, on the founder's note that the Journal read as a wall of
 * text. content/journal.ts stays the text of record and is not touched;
 * this adds, per entry:
 *
 *   pull     one sentence lifted VERBATIM from the entry, set large
 *   graphic  a drawing of numbers the entry itself states — never a new figure
 *   facts    the entry's own figures, pulled out to be seen at a glance
 *   quote    one line from somebody else, attributed to a named work
 *
 * The outside quotations are short, public and attributed to where they
 * were said or written. Where the exact wording is disputed the attribution
 * says so rather than tidying it.
 */

export type Graphic =
  | { kind: "compare"; head: readonly [string, string]; rows: readonly (readonly [string, string, string])[] }
  | { kind: "waterfall" }
  | { kind: "timeline"; steps: readonly (readonly [string, string])[]; mark: number; markLabel: string }
  | { kind: "triad" }
  | { kind: "ladder"; steps: readonly (readonly [string, string])[] }
  | { kind: "nots" }
  | { kind: "weekends" }
  | { kind: "pernight" }
  | { kind: "evenings" }
  | { kind: "rain" }
  | { kind: "hundred" }
  | { kind: "twowaters" }
  | { kind: "nights" };

export interface JournalExtra {
  readonly pull: string;
  readonly graphic: Graphic;
  /** After which heading (0-based) the drawing sits. */
  readonly graphicAfter: number;
  readonly facts?: readonly (readonly [string, string])[];
  readonly quote: { readonly text: string; readonly who: string; readonly where: string };
}

export const JOURNAL_EXTRAS: Readonly<Record<string, JournalExtra>> = {
  "why-a-body-corporate": {
    pull: "The mechanism for a contested decision is a vote rather than a lawsuit.",
    graphic: { kind: "compare", head: ["A share of a building", "A partnership in the vehicle"], rows: [
      ["A decision", "Needs every co-owner, unanimously", "Is a vote, weighted by equity"],
      ["Someone who buys in", "Is not bound by the side agreement", "Takes the position subject to the Agreement"],
      ["If it goes wrong", "Exposure without limit", "Exposure limited to what was contributed"],
      ["What it costs", "Less, at the start", "Formation, filings and an audit, every year"],
    ] },
    graphicAfter: 0,
    quote: { text: "That which is common to the greatest number has the least care bestowed upon it.", who: "Aristotle", where: "Politics, Book II" },
  },
  "the-waterfall-read-from-the-bottom": {
    pull: "They are a queue, and where you stand in it decides whether you are paid at all in a bad year.",
    graphic: { kind: "waterfall" },
    graphicAfter: 0,
    facts: [["6", "stages, paid in a fixed order"], ["2.5%", "to the admin reserve"], ["2.5%", "to the sinking fund"]],
    quote: { text: "You only find out who is swimming naked when the tide goes out.", who: "Warren Buffett", where: "Letter to Berkshire Hathaway shareholders, 2001" },
  },
  "what-settlement-changes": {
    pull: "A register that lists people whose money has not arrived is a register that cannot be used to compute a vote or a distribution.",
    graphic: { kind: "timeline", steps: [["Commit", "An obligation, and no rights"], ["Up to 15 working days", "Capital promised, nothing held"], ["Cleared funds reach the vehicle", "Settlement"], ["Member", "Rights and entitlement begin"]], mark: 2, markLabel: "Irreversible from here" },
    graphicAfter: 0,
    facts: [["15", "working days, at most, between commitment and settlement"], ["3 s", "of sustained pressure to commit"]],
    quote: { text: "Measure twice, cut once.", who: "A carpenter's proverb", where: "traditional" },
  },
  "governance-without-ownership": {
    pull: "They are not aligned. They are separated, on purpose.",
    graphic: { kind: "triad" },
    graphicAfter: 0,
    facts: [["0%", "Getaway Collective's equity in any vehicle"], ["1", "stage of the waterfall it is paid from"], ["100%", "of partners to change that clause"]],
    quote: { text: "Show me the incentive and I will show you the outcome.", who: "Charlie Munger", where: "as he often said it" },
  },
  "reading-a-modelled-number": {
    pull: "A number quoted without its class has been laundered by being moved.",
    graphic: { kind: "ladder", steps: [["Observed", "Counted or measured"], ["Verified", "Checked against a source document"], ["Modelled", "Computed from stated assumptions"], ["Estimated", "A judgement on incomplete information"], ["Forecast", "About a period that has not happened"], ["Pending", "Expected, shown as absent, never as zero"]] },
    graphicAfter: 0,
    quote: { text: "All models are wrong, but some are useful.", who: "George E. P. Box", where: "Robustness in the Strategy of Scientific Model Building, 1979" },
  },
  "two-waters": {
    pull: "Sea frontage sells the winter; estuary frontage is calm in months when the surf is unusable.",
    graphic: { kind: "twowaters" },
    graphicAfter: 0,
    facts: [["400 m", "between the surf and the still water"], ["12", "keys"], ["~50 min", "to Mangaluru airport"], ["2028", "handover, early in the year"]],
    quote: { text: "The edge of the sea is a strange and beautiful place.", who: "Rachel Carson", where: "The Edge of the Sea, 1955" },
  },
  "the-night-is-not-the-product": {
    pull: "Weighted voting decides money; it does not decide who gets the last weekend in December.",
    graphic: { kind: "nights" },
    graphicAfter: 2,
    quote: { text: "Nowadays people know the price of everything and the value of nothing.", who: "Oscar Wilde", where: "The Picture of Dorian Gray, 1890" },
  },
  "what-this-platform-does-not-do": {
    pull: "Most of what follows was requested by someone reasonable, for a reason that made sense at the time.",
    graphic: { kind: "nots" },
    graphicAfter: -1,
    quote: { text: "Less, but better.", who: "Dieter Rams", where: "his ten principles for good design" },
  },
  "four-thousand-weekends": {
    pull: "It does not make an hour better. It converts hours that would not otherwise have existed.",
    graphic: { kind: "weekends" },
    graphicAfter: -1,
    facts: [["~4,000", "Saturdays in an eighty-year life"], ["~2,500", "of them in the working middle"], ["30", "visits a year to a place 90 minutes away; 4 to one four hours away"]],
    quote: { text: "It is not that we have a short time to live, but that we waste a lot of it.", who: "Seneca", where: "On the Shortness of Life" },
  },
  "the-real-cost-of-thirty-days": {
    pull: "Together they behave like a subscription to a house, and the subscription does not scale down when the house is empty.",
    graphic: { kind: "pernight" },
    graphicAfter: 1,
    facts: [["₹1 L", "a month to hold"], ["24", "nights used in a year"], ["₹50,000", "per night, before anybody ate anything"]],
    quote: { text: "The cost of a thing is the amount of what I will call life which is required to be exchanged for it.", who: "Henry David Thoreau", where: "Walden, 1854" },
  },
  "what-the-sea-does-to-time": {
    pull: "Two nights taken twelve times a year contain twelve first evenings. Two weeks taken once contains one.",
    graphic: { kind: "evenings" },
    graphicAfter: 0,
    quote: { text: "Time is but the stream I go a-fishing in.", who: "Henry David Thoreau", where: "Walden, 1854" },
  },
  "houses-that-get-better-when-it-rains": {
    pull: "Laterite darkens. Timber silvers. Copper turns and then stops.",
    graphic: { kind: "rain" },
    graphicAfter: -1,
    facts: [["2–7 m", "of rain a year in the Western Ghats"], ["4", "months it mostly arrives in"], ["~6", "years before the difference shows"]],
    quote: { text: "When we build, let us think that we build for ever.", who: "John Ruskin", where: "The Seven Lamps of Architecture, 1849" },
  },
  "beautiful-assets-terrible-investments": {
    pull: "Would this be a sound position if it were ugly?",
    graphic: { kind: "hundred" },
    graphicAfter: 3,
    facts: [["100", "rupees of revenue in"], ["26", "left before tax"], ["~1%", "yield on an asset costing 25 times revenue"]],
    quote: { text: "Price is what you pay; value is what you get.", who: "Warren Buffett, quoting Benjamin Graham", where: "Letter to Berkshire Hathaway shareholders, 2008" },
  },
};
