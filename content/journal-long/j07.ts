/* J-07 · The night is not the product — the long form (Journal 5x, 23 Oct 2026).
   The entitlement rule (one night a year for each 1% held, from handover) is
   the entry's own. The worked holding is read from the canon, so the example
   moves if the canon does. */
import type { Block } from "../journal";
import { UNIT } from "../../app/_assemblies/slowspace";

/* The worked holding, as a percentage, and the nights it carries at one per 1%. */
const PCT = UNIT.sharePct / 100;
const NIGHTS = Math.floor(PCT);

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "Each partner has nights at the estate every year: one night for each 1% held, from " +
    "handover. The easy description is buying time somewhere pleasant. That description is " +
    "wrong, and the error matters." },
  { t: "p", x:
    `A partner with a ${PCT}% holding has ${NIGHTS} nights a year at the estate. Those nights are ` +
    "real and they are theirs. They are also a consequence of the holding, rather than its " +
    "purpose. This entry explains why we keep that order, and what it protects." },
  { t: "assert", x:
    "Nights come with the position. They carry no separate price, cannot be exchanged for money " +
    "and are used within their year. A position whose nights went unused for a decade would be " +
    "worth exactly what it was worth on the day it settled." },
  { t: "facts", rows: [
    ["Nights a year", "One for each 1% held"],
    ["From", "Handover"],
    [`A ${PCT}% holding`, `${NIGHTS} nights a year`],
    ["Separate price", "None: they come with the position"],
  ] },

  { t: "p", x:
    "The distinction can sound like a lawyer's point. It is a practical one. It decides how the " +
    "estate is run and how partners relate to each other. It decides how the position is taxed " +
    "and regulated, and what a partner can sell when life changes." },
  { t: "p", x:
    "It also decides what the platform is tempted to promise. A business that sells nights is " +
    "always tempted to sell more of them. A business that sells shares of an estate is tempted to " +
    "make the estate earn. We chose the second temptation deliberately." },
  { t: "h", x: "Two descriptions of one holding" },
  { t: "p", x:
    "Imagine two people describing the same position at a dinner. The first says: I bought ten " +
    "nights a year at a beautiful place, forever. The second says: I own a tenth of a business " +
    "that runs a beautiful place, and I can visit it." },
  { t: "p", x:
    "Both are describing the same document. Only the second is accurate, and the difference " +
    "shows up the moment something changes. Ask each of them what happens if the estate has a " +
    "poor year, or if they stop visiting, or if they want to sell." },
  { t: "graphic", g: { kind: "compare", head: ["Buying nights", "Owning a share"], rows: [
    ["What you hold", "A right to use the place", "A share of the LLP that owns it"],
    ["What sets its value", "How many nights, and how good", "What the estate earns"],
    ["If you never visit", "You have wasted what you paid for", "Your share is worth the same"],
    ["What you sell, later", "Leftover nights, if anyone wants them", "Units, on the partners' noticeboard"],
  ] }, caption: "One document, read two ways. Only one reading survives a change in circumstances." },
  { t: "p", x:
    "The first description makes the holding sound like a holiday paid in advance. The second " +
    "makes it sound like an investment that happens to come with a key. We write and build for " +
    "the second, because that is what the partner actually owns." },
  { t: "pull", x:
    "Weighted voting decides money; it does not decide who gets the last weekend in December." },

  { t: "h", x: "What goes wrong if nights are the product" },
  { t: "p", x:
    "If nights were what is sold, the number of nights would be the thing to maximise. Every " +
    "night a partner took would be a night the estate could not let. Partners and the estate " +
    "would pull in opposite directions." },
  { t: "p", x:
    "Picture the incentives running wrong. A platform selling nights would want to promise as " +
    "many as possible, to make each sale look generous. The estate's revenue would shrink with " +
    "every promise. The partners who bought most nights would drain the earnings of the rest." },
  { t: "p", x:
    "It would also turn the position into a prepayment. A prepayment for accommodation is " +
    "regulated differently from a contribution to an LLP, with other protections and other tax. " +
    "Calling one the other changes nothing." },
  { t: "p", x:
    "Consider how differently the two are treated. A prepayment for accommodation is a purchase " +
    "of something to be consumed. A contribution to an LLP buys a share of a business, with a " +
    "partner's rights and a partner's risks. Each has its own rules, written for its own purpose." },
  { t: "p", x:
    "That last sentence carries weight. A regulator, a tax officer or a court reads what a thing " +
    "does, rather than what it is called. A share sold mainly for its nights behaves like " +
    "prepaid accommodation, and the law would treat it so. Keeping the order straight keeps the " +
    "partnership a partnership." },
  { t: "story", title: "A tale of two promises", x: [
    "Imagine two estates on the same coast, side by side, built to the same plan. The first sells " +
      "nights. Its brochure leads with a calendar and a number: so many nights a year, for life. " +
      "Its owners compete to sell more nights to more people.",
    "The second sells shares of the estate. Its documents lead with the payment order, and nights " +
      "appear on page four as a consequence of holding. Its partners care mainly about how full " +
      "the estate is in an ordinary week.",
    "In the first estate, every partner's visit is a cost the others feel. A family that comes " +
      "often is quietly resented. In the busy season, the estate is full of people who paid years " +
      "ago, and those nights earn nothing new.",
    "In the second, a partner's visit is a pleasure the arithmetic already allows for. A partner " +
      "who comes less leaves a night the estate can let, and everyone shares that revenue. Nobody " +
      "is counting anyone else's visits.",
    "Both estates are equally beautiful. Only one has its partners pulling in the same direction.",
  ] },
  { t: "p", x:
    "The opposite design aligns everyone. When the position is the product, every partner wants " +
    "the same thing: an estate that is well run, well known and full on ordinary weeks. A " +
    "partner's visit is welcome, and a released night is welcome too." },
  { t: "story", title: "A first question at the table", x: [
    "Imagine a new partner at her first partners' meeting, a doctor from Hyderabad with a small " +
      "holding. She arrives expecting to hear about her nights: how to request them, which " +
      "weekends are free, whether she can bring her parents.",
    "The meeting spends ten minutes on dates and an hour on the estate's quarter. Occupancy, the " +
      "operator's report, the sinking fund, a repair to the deck. She is surprised, then " +
      "interested. These are the numbers her holding actually rests on.",
    "By the end she has asked more questions about the payment order than about the calendar. " +
      "She leaves with a clear picture of what she owns. The nights, it turns out, are the easy " +
      "part.",
    "Driving home, she explains it to her husband in one line. They bought a share of a place " +
      "that earns, and the place lets them visit. He asks whether that means they should care how " +
      "full it is in July. She says yes, and that this is rather the point.",
  ] },
  { t: "story", title: "What is a night worth?", x: [
    "Picture an analyst at a Mumbai family office building a spreadsheet for a position. She adds " +
      "a column for the nights, multiplies them by a nightly rate, and adds the result to the " +
      "yield. The position suddenly looks much better.",
    "Her principal asks one question. Can the nights be sold? She checks the terms. They carry no " +
      "separate price, cannot be exchanged for money and are used within their year. The column " +
      "is measuring something real, but it is measuring enjoyment, rather than return.",
    "She deletes the column and writes a note instead. The nights are a benefit of the holding, " +
      "valued by whoever uses them. The return is what the estate earns, at the end of the payment " +
      "order. Mixing the two would flatter the position and confuse the decision.",
    "Her principal agrees, and adds a line of his own. If the investment only works with the " +
      "nights counted as money, it does not work. That sentence is the whole of this entry, said " +
      "in a meeting.",
  ] },
  { t: "illus", plate: "creek/lamps", caption:
    "Lamps along the path at dusk, drawn: a night belongs to the estate until someone takes it." },

  { t: "h", x: "How it compares" },
  { t: "p", x:
    "Several familiar arrangements give someone time at a place they like. Comparing their " +
    "structure, rather than their brochures, shows what an LLP position is and is not." },
  { t: "graphic", g: { kind: "compare", head: ["A timeshare week", "An LLP position"], rows: [
    ["What you buy", "The right to use a period of time", "A share of the LLP that owns the estate"],
    ["Who owns the asset", "The operator, typically", "The partners, exclusively"],
    ["How you are paid", "Usually you pay to use it", "From the last stage of the payment order"],
    ["Unused time", "Lost, or traded inside a scheme", "Let by the estate, revenue shared"],
  ] }, caption: "A timeshare sells time; a position is a share of the thing that earns." },
  { t: "graphic", g: { kind: "compare", head: ["A holiday home of your own", "An LLP position"], rows: [
    ["Nights a year", "As many as you like", "One for each 1% held"],
    ["Who runs it", "You, or someone you hire and manage", "Sensory Getaways, under contract"],
    ["Empty weeks", "Cost you and earn nothing", "Are let, and the revenue is shared"],
    ["How you leave", "Sell the whole house", "Offer units on the partners' noticeboard"],
  ] }, caption: "A house of your own gives more nights; a position gives a share of an estate that earns." },
  { t: "p", x:
    "The holiday home comparison deserves a closer look, because it is the one most readers " +
    "consider. A house of your own gives freedom over dates and a place to leave your things. It " +
    "also gives you every bill, every repair and every empty week, with nobody to share them." },
  { t: "p", x:
    "A position trades some of that freedom for a share of a professionally run estate. You visit " +
    "on a proportionate basis. Someone else handles the repairs. The empty weeks become someone " +
    "else's visit, and their revenue reaches you." },
  { t: "p", x:
    "Each arrangement suits someone. A holiday home suits a family that wants to be in one place " +
    "for many weeks and can carry the house when it is empty. A timeshare suits someone who wants " +
    "the time and nothing else." },
  { t: "graphic", g: { kind: "compare", head: ["Co-owning with friends", "An LLP position"], rows: [
    ["Who decides dates", "Whoever asks first, or argues best", "Fewest nights used this year goes first"],
    ["Who decides money", "Everyone, unanimously", "A vote, weighted by holding"],
    ["Who runs the place", "Whichever friend has time", "Sensory Getaways, under contract"],
    ["If a friend wants out", "A difficult conversation", "Units offered on the noticeboard"],
  ] }, caption: "Friends sharing a house share its arguments too; a partnership writes the rules first." },
  { t: "p", x:
    "Co-owning a house with friends is the arrangement many people try first. It begins warmly " +
    "and often strains at the calendar. Two families want the same festival week, and nothing " +
    "but goodwill decides between them. Goodwill is a fine thing to keep in reserve." },
  { t: "p", x:
    "An LLP position suits someone who wants to own a share of an estate that earns, with a " +
    "proportionate right to visit it. The nights are generous for the size of the holding. They " +
    "are designed to sit alongside the estate's earnings rather than compete with them." },

  { t: "h", x: "How the mechanism keeps it honest" },
  { t: "p", x:
    "A night released rather than taken is let, and its revenue enters the payment order at " +
    "stage one like any other. A partner who takes fewer nights is paid slightly more; one who " +
    "takes all of them, slightly less. Neither is penalised; the arithmetic simply follows." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Released", "A partner lets a night go"],
    ["Let", "The estate offers it to visitors"],
    ["Stage one", "Its revenue enters the payment order"],
    ["Down the order", "Operator, brand, reserves, debt"],
    ["To partners", "What remains is shared by holding"],
  ], mark: 4, markLabel: "Every partner shares here" }, caption:
    "The path of a released night, from a partner's calendar to every partner's share." },
  { t: "p", x:
    "Follow one night through. A partner decides to visit in March and releases a night in " +
    "October. The estate lets that October night to visitors. Their payment joins the estate's " +
    "revenue for the quarter and runs down the payment order with everything else." },
  { t: "graphic", g: { kind: "waterfall" }, caption:
    "A released night enters at the top like any other revenue, and reaches partners at the bottom." },
  { t: "p", x:
    "At the bottom, partners share what remains in proportion to their holdings. The partner who " +
    "released the night receives a share of its revenue, as does every other partner. The " +
    "partner who took all their nights receives the same share of a slightly smaller total." },
  { t: "story", title: "A Pune family and a calendar", x: [
    "Picture a Pune family with a position at a coastal estate. In the first year after handover " +
      "they use every night they hold. The children are young, the drive is easy, and the estate " +
      "becomes their place.",
    "A few years later the eldest starts university abroad, and the family travels less. They use " +
      "half their nights and release the rest. Nobody asks them to justify it. Their nights " +
      "simply return to the estate.",
    "Their released nights are let to visitors in the ordinary way. The revenue joins the estate's " +
      "earnings and reaches all the partners at the end of the payment order. The family's share " +
      "of that revenue arrives with their quarterly distribution.",
    "Later still, grandchildren arrive, and the family's nights fill again. Their holding is the " +
      "same size throughout, and worth the same throughout. Only their use of it changed, and " +
      "the arithmetic followed quietly behind. Nobody had to approve any of it.",
  ] },
  { t: "p", x:
    "The effect on any one partner's distribution is small, which is why the entry calls it " +
    "slight. One partner's released nights spread across every holding. The design asks nobody " +
    "to calculate the value of a night before deciding whether to take it." },
  { t: "p", x:
    "That matters for how partners feel at the estate. A partner who arrives for a weekend should " +
    "enjoy it without weighing what it costs the others. The arithmetic handles fairness in the " +
    "background, so the visit can simply be a visit." },
  { t: "p", x:
    "This is the design working. A partner's nights flex with their life. The estate's " +
    "earnings flex with how many nights are taken. The two adjust to each other, and nobody needs " +
    "a rule to referee them." },

  { t: "h", x: "Why each year's nights belong to that year" },
  { t: "p", x:
    "Three features of the nights can look like restrictions at first reading. Each one protects " +
    "the partnership, and each follows from the same principle: the nights serve the holding, " +
    "rather than the other way round." },
  { t: "graphic", g: { kind: "compare", head: ["What it means", "What it protects"], rows: [
    ["No separate price", "Nights are part of the position", "The holding remains an investment, priced as one"],
    ["Cannot be exchanged for money", "A night is used or released", "The estate's revenue, which every partner shares"],
    ["Used within their year", "Each year starts fresh", "The calendar, from a backlog of owed nights"],
  ] }, caption: "Three features of the nights, and what each one keeps safe." },
  { t: "p", x:
    "<b class=\"tx-strong\">No separate price.</b> If nights carried a price of their own, the " +
    "position would become two things sold together: an investment and a block of accommodation. " +
    "The second would draw the regulation and tax of accommodation. Keeping one price keeps one " +
    "instrument." },
  { t: "p", x:
    "<b class=\"tx-strong\">Cannot be exchanged for money.</b> A night that could be cashed " +
    "would become a claim on the estate's revenue ahead of the payment order. Partners who cashed " +
    "their nights would be paid before the bank, the reserves and everyone else. The order exists " +
    "to prevent exactly that." },
  { t: "p", x:
    "<b class=\"tx-strong\">Used within their year.</b> Nights that rolled forward would pile " +
    "up. After a few quiet years, partners together could hold more owed nights than the estate " +
    "has to give in a season. A fresh calendar each year keeps the promise the size of the place." },
  { t: "story", title: "The partner who rarely came", x: [
    "Picture an NRI in Singapore who takes a position in a coastal estate the year it opens. He " +
      "means to visit often. Work intervenes, then a move to another continent, and for most of a " +
      "decade he comes once or twice.",
    "His nights lapse each year, unused. He feels faintly guilty about it, as people do about a " +
      "gym membership. Then he reads his statements properly and notices something.",
    "Every night he left was let to visitors. Its revenue joined the estate's earnings and reached " +
      "him, in proportion to his holding, at the end of the payment order. His absence was paid " +
      "for, quietly, every quarter.",
    "Later he offers his units on the noticeboard. Their value rests on the estate's " +
      "record, exactly as it would for a partner who came every month. Nobody discounts his units " +
      "for the visits he missed. The nights were his to enjoy, and the holding was his to own.",
  ] },
  { t: "h", x: "Precedence" },
  { t: "p", x:
    "Where more partners want the same dates than the estate can hold, whoever has used the " +
    "fewest nights that year goes first. Holding size and request order play no part. Weighted " +
    "voting decides money; it does not decide who gets the last weekend in December." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Fewest nights used this year", "Goes first"],
    ["Next fewest", "Goes next"],
    ["Most nights used this year", "Goes last for contested dates"],
    ["Holding size", "Plays no part in precedence"],
    ["Order of request", "Plays no part in precedence"],
  ] }, caption: "How contested dates are decided: by nights already used, and by nothing else." },
  { t: "p", x:
    "The rule is deliberately simple. Larger holdings already carry more nights and more votes. " +
    "Letting size also decide contested dates would give the largest holders the best weekends " +
    "every year, on top of everything else." },
  { t: "p", x:
    "Votes and nights answer different questions. A vote decides what the estate does with money: " +
    "whether to borrow, what to spend, when to sell. Those decisions bear on capital, so capital " +
    "weighs them. Dates bear on enjoyment, and enjoyment is shared more evenly." },
  { t: "p", x:
    "Nights still scale with holding, through the entitlement itself. A partner with twice the " +
    "holding has twice the nights. The precedence rule decides only the contested dates, where " +
    "fairness between people matters more than fairness between rupees." },
  { t: "p", x:
    "Request order would reward whoever watches the calendar most closely. It would turn the " +
    "festive season into a race at midnight. Fewest-used-first rewards something fairer: the " +
    "partner who has had least of the estate this year." },
  { t: "story", title: "Three requests for one weekend", x: [
    "Imagine three partners who all want the last weekend in December. The first is a family " +
      "office in Mumbai with a large holding, which asked in January. The second is an NRI in " +
      "Singapore with a small holding, who asked in November.",
    "The third is a Bengaluru architect with a middling holding. She asked last, in early " +
      "December, after a busy year in which she visited only once.",
    "Under a size rule, the family office would win. Under a first-come rule, the family office " +
      "would win again. Under this estate's rule, the architect goes first, because she has used " +
      "the fewest nights that year.",
    "The family office does not lose money by this. Its larger holding still carries its larger " +
      "share of every distribution, and its larger vote on every decision about money. It simply " +
      "has no special claim on the last weekend in December. Next year, the order may well " +
      "favour someone else.",
  ] },
  { t: "p", x:
    "The rule also resets each year. A partner who had the December weekend last year starts the " +
    "new year level with everyone else. Over a run of years, the busiest dates move around the " +
    "register rather than settling on the same few names." },
  { t: "illus", plate: "creek/night", caption:
    "An estate at night, drawn: the busiest weekend of the year goes to whoever has had least of it." },

  { t: "h", x: "A simple test of the order" },
  { t: "p", x:
    "There is a test anyone can apply to a position like this. Ask what it would be worth if every " +
    "night went unused. If the answer is nothing, you have bought a holiday. If the " +
    "answer is a share of what the estate earns, you have bought an investment." },
  { t: "p", x:
    "Our positions pass that test by design. A position whose nights went unused for a decade " +
    "would be worth exactly what it was worth on the day it settled. Only the estate's own " +
    "performance moves it. The nights are a pleasure layered on top." },
  { t: "p", x:
    "The test is worth applying before signing anything, ours included. Read the documents and " +
    "find where the nights appear. If they lead, ask what the holding is worth without them. If " +
    "they follow, as ours do, the answer is already on the page." },
  { t: "p", x:
    "Apply the same test to the arrangements compared above. A timeshare week that goes unused " +
    "is simply lost. A holiday home left empty still costs its owner. A position whose nights go " +
    "unused still earns its share of the estate's revenue, including the revenue from those nights." },
  { t: "illus", plate: "confluence/veranda-rain", caption:
    "Rain beside the plaza's deck, drawn: a quiet night at the estate still earns for its partners." },
  { t: "p", x:
    "That is why we describe the holding the way we do, in every document. The partner owns a " +
    "share of an estate. The nights come with it. Keeping that order is what keeps the platform " +
    "honest, and it is what keeps every partner pulling in the same direction." },
];
