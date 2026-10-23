/* J-05 · Reading a modelled number — the long form (Journal 5x, 23 Oct 2026).
   Every figure below is read from the estate record (constants/vehicles.ts,
   through app/_assemblies/slowspace.ts) or stated as an illustration in the
   same sentence. */
import type { Block } from "../journal";
import { inr, rate } from "../../app/_assemblies/data";
import { OPERATING, GROSS_REVENUE, SITE } from "../../app/_assemblies/slowspace";

const OCC = `${OPERATING.occupancy / 100}%`;
const ADR = inr(OPERATING.adr);
const GROSS = inr(GROSS_REVENUE);
/* The illustration: the same estate at ten points lower occupancy. Arithmetic on stated inputs. */
const GROSS_LOW = inr(rate(GROSS_REVENUE, 8000));

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "A number on a screen carries no sign of where it came from. The same typeface shows a " +
    "figure counted yesterday and one assumed for 2031. You can tell them apart only if you are " +
    "told." },
  { t: "p", x:
    "This entry is about that telling. Every forward-looking figure on this platform carries a " +
    "label saying how it was reached. The label is short, often a single word. It is also the " +
    "most useful word on the page, because it tells you how much weight the figure can bear." },
  { t: "p", x:
    "Modelled numbers are a real risk, and this entry treats them as one. A model can be " +
    "careful, clear and honest and still describe a year that turns out differently. Reading the " +
    "label well is how you keep that possibility in view while you decide." },

  { t: "h", x: "Same typeface, different truths" },
  { t: "p", x:
    "Think of two figures on one line of a page. One is the rent a tenant paid last month, read " +
    "from a bank statement. The other is the rent a building is expected to earn in five years. " +
    "On paper they look identical: the same digits, the same rupee mark, the same weight of ink." },
  { t: "p", x:
    "Yet they are different kinds of thing. The first is a record of something that happened. " +
    "The second is a sentence about the future, written in numbers. Its accuracy depends entirely " +
    "on assumptions that sit somewhere else, often on another page, sometimes in nobody's view." },
  { t: "p", x:
    "Weather forecasts solved this problem long ago. A forecaster says seventy per cent chance of " +
    "rain, and the percentage is part of the forecast. Nobody hears it as a promise of rain. " +
    "Financial pages rarely carry that kind of honesty, so we built it into ours." },
  { t: "p", x:
    "Property is especially prone to this. A brochure shows a rental yield beside a carpet area " +
    "and a price per square foot. The area was measured. The price was agreed. The yield was " +
    "assumed. All three sit in the same bold type, and they invite the same trust." },
  { t: "graphic", g: { kind: "compare", head: ["A counted figure", "A modelled figure"], rows: [
    ["Where it comes from", "A bank statement, a register, a meter", "Assumptions run through arithmetic"],
    ["What could make it wrong", "A clerical slip, caught by checking", "Any one of its inputs"],
    ["How it ages", "It stays true about its period", "It is replaced by what actually happens"],
    ["What you do with it", "Rely on it, once checked", "Test it: change an input and watch it move"],
  ] }, caption: "Two figures can share a typeface and differ in everything that matters." },

  { t: "h", x: "The six classes" },
  { t: "p", x:
    "Every figure here falls into one of six classes. They run from the most solid to the least, " +
    "and the order matters as much as the names." },
  { t: "list", x: [
    "Observed: counted or measured. A night taken, a payment received.",
    "Verified: stated by someone and checked against a source document.",
    "Modelled: computed from stated assumptions. The arithmetic is exact; the inputs may be " +
      "wrong.",
    "Estimated: a person's judgement on incomplete information.",
    "Forecast: a modelled figure about a period still to come.",
    "Pending: expected and still to arrive. Shown as absent, with its reason, rather than as zero.",
  ] },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Observed", "Counted or measured"],
    ["Verified", "Checked against a source document"],
    ["Modelled", "Computed from stated assumptions"],
    ["Estimated", "A judgement on incomplete information"],
    ["Forecast", "About a period still to come"],
    ["Pending", "Expected, and shown as absent until it arrives"],
  ] }, caption: "The six classes, from the firmest footing to the lightest." },
  { t: "p", x:
    "<b class=\"tx-strong\">Observed</b> is the firmest ground. A payment that cleared into the " +
    "LLP's account is observed. So is a night a partner actually spent at the estate. Someone " +
    "counted it, and the count can be repeated." },
  { t: "p", x:
    "<b class=\"tx-strong\">Verified</b> sits one step down. Someone stated the figure, and we " +
    "checked it against a document that stands on its own. A survey plan, a registered deed and " +
    "a bank sanction letter are all such documents. The check is what earns the class." },
  { t: "p", x:
    "<b class=\"tx-strong\">Modelled</b> is where most forward-looking figures live. The " +
    "arithmetic is exact and repeatable. Anyone with the same inputs would reach the same answer " +
    "to the rupee. The inputs themselves are assumptions, and assumptions can be wrong." },
  { t: "p", x:
    "<b class=\"tx-strong\">Estimated</b> means a person's judgement. A contractor's view of a " +
    "build cost before drawings are final is an estimate. It may be very good judgement. It is " +
    "still judgement, and it is labelled as such." },
  { t: "p", x:
    "<b class=\"tx-strong\">Forecast</b> is a modelled figure about a period still to come. " +
    "Revenue for an estate that opens in 2028 is a forecast today, however careful the model " +
    "behind it." },
  { t: "p", x:
    "<b class=\"tx-strong\">Pending</b> is the honest blank. A figure we expect and do not yet " +
    "hold appears as absent, with a line explaining why. A zero would be a claim. A blank with a " +
    "reason is a fact about what we know." },
  { t: "p", x:
    "An estate moves through these classes over its life. Before construction, almost every " +
    "operating figure is a forecast. After opening, nights and payments become observed, quarter " +
    "by quarter. The record firms up as the estate earns it." },
  { t: "assert", x:
    "The classes are ranked, and the rank is the point. A figure carries the class of the weakest " +
    "input behind it, and nothing stronger." },

  { t: "story", title: "The electricity bill", x: [
    "Picture a Pune household opening two electricity bills, a month apart. They look the same: " +
      "the same logo, the same table, a total in bold. One small word differs in a corner.",
    "The first bill says actual reading. Someone came to the meter, read the dial and wrote down " +
      "the number. That bill is observed. If it looks wrong, the household can walk to the meter " +
      "and check.",
    "The second bill says estimated reading. Nobody came that month, so the company assumed the " +
      "household used about what it used before. The total is computed exactly from that " +
      "assumption. The assumption may be wrong.",
    "Most households learn to look for that word. A large estimated bill prompts a call and a " +
      "photograph of the meter. A large actual bill prompts a look at the air conditioner. The " +
      "same number calls for different actions, and the word tells you which.",
    "Our labels do the same job for an estate. They sit in the corner of every figure and tell you " +
      "whether someone read the meter, or assumed the reading.",
  ] },
  { t: "h", x: "The weakest input sets the class" },
  { t: "p", x:
    "The rule sounds technical. It is the same rule a careful cook follows. A dish made with nine " +
    "fresh ingredients and one doubtful one is a doubtful dish. The good ingredients cannot vouch " +
    "for the bad one." },
  { t: "p", x:
    "Numbers work the same way. Take a verified land price, a verified build contract and an " +
    "estimated occupancy. Combine them into a yield, and the yield is estimated. The two verified " +
    "inputs make the estimate better informed. They cannot lift its class." },
  { t: "pull", x:
    "The good ingredients cannot vouch for the bad one." },
  { t: "p", x:
    "This is why we label the output, rather than only the inputs. A reader should be able to see " +
    "the class of a yield without tracing it back through every assumption. The label does that " +
    "tracing in advance and states the result in one word." },
  { t: "story", title: "The spreadsheet that went up a class", x: [
    "Picture a Bengaluru architect, partway through her first private investment. She has built " +
      "a careful spreadsheet. The land cost comes from a registered sale deed. The build cost comes " +
      "from a signed contract. Both are verified, and she has the documents in a folder.",
    "The third input is the rate visitors will pay per night. She took it from a friend who runs " +
      "a homestay two valleys over. It is a good guess from someone who knows the market. It is " +
      "still a guess.",
    "Her spreadsheet produces a yield, and she colours it green. Two firm inputs out of three feel " +
      "like a firm answer. Over a month, in conversation, the yield becomes \"what the place " +
      "makes\". By the time she explains it to her brother, it sounds like a record.",
    "Nothing in the arithmetic changed. What changed was the class she gave it in her head. One " +
      "estimated input had quietly set the class of the whole figure, and the green cell hid that.",
    "A label on that cell would have kept the truth in view. Estimated, because the rate is a " +
      "judgement. Her brother would have heard the same number and asked the right question: whose " +
      "judgement, and based on what?",
  ] },

  { t: "h", x: "Why a modelled yield needs its label" },
  { t: "p", x:
    "A modelled distribution comes from three assumptions, for occupancy, rate and cost, run " +
    "through the payment order. The arithmetic can be flawless while all three are wrong. The " +
    "result would look exactly the same." },
  { t: "p", x:
    `Here is a real one, read from the estate record for Seaside Confluence. The model assumes ` +
    `${SITE.keys} keys, open every night of the year, filled on half of them, at an average rate ` +
    `of ${ADR} a night. Multiply those through and gross revenue is ${GROSS} a year.` },
  { t: "facts", rows: [
    ["Keys", String(SITE.keys)],
    ["Nights in the year", String(OPERATING.nightsPerYear)],
    ["Occupancy, assumed", OCC],
    ["Average nightly rate, assumed", ADR],
    ["Gross revenue, modelled", GROSS],
  ] },
  { t: "p", x:
    "Every step of that sum is exact. Two of its inputs are assumptions: the occupancy and the " +
    "rate. So the result is modelled. The estate record says so, and it adds the basis: on " +
    "offering equity, from year three, at stabilised occupancy." },
  { t: "p", x:
    "Notice what the label does and does not say. It says the arithmetic is sound and the inputs " +
    "are stated. It says nothing about whether visitors will fill half the nights at that rate. " +
    "That question belongs to you, and the label hands it over openly." },
  { t: "p", x:
    "Occupancy and rate also lean on each other. A higher rate often fills fewer nights; a lower " +
    "rate often fills more. A model holds each at one value. The real year will find its own " +
    "balance between them, and the model is a reasoned starting point." },
  { t: "p", x:
    "That basis is part of the figure. From year three means the first two years are expected to " +
    "be different. Stabilised occupancy means the estate has found its level. Drop either phrase " +
    "and the same number describes a different, easier world." },
  { t: "p", x:
    `The best way to read a modelled figure is to move one input and watch. Lower occupancy by ` +
    `ten points, as an illustration, and gross revenue falls by a fifth, to ${GROSS_LOW}.` },
  { t: "p", x:
    "The fall at the bottom of the payment order is larger, and the reason is structural. The " +
    "operator, the brand and the two reserves take shares of revenue, so they shrink in step. The " +
    "bank's repayment stays the same size, whatever the year brings." },
  { t: "p", x:
    "So partners absorb the difference. In this illustration, a fifth less revenue leaves " +
    "partners with roughly two fifths less to share. That gearing is the honest shape of any " +
    "estate that borrows, and the label is your cue to look for it." },
  { t: "graphic", g: { kind: "waterfall" }, caption:
    "Shares of revenue shrink with revenue; the bank's repayment holds its size, so the last stage moves most." },
  { t: "p", x:
    "The same gearing works upwards too. A better year at the top produces a proportionally " +
    "better year at the bottom, because the bank's payment does not grow with revenue. A label " +
    "that says modelled invites you to test both directions." },
  { t: "p", x:
    "None of this makes a model useless. A good model is a map of how the parts connect. It shows " +
    "which input matters most and how far the result moves when that input moves. Read that way, " +
    "a modelled figure is a tool. Read as a record, it misleads." },

  { t: "h", x: "How a number gets laundered" },
  { t: "p", x:
    "So a modelled figure carries its label everywhere it appears, as well as where it was " +
    "first computed. A number quoted without its class has been laundered by being moved." },
  { t: "p", x:
    "Laundering rarely needs bad intent. It happens in small, reasonable steps. A figure is " +
    "computed on page nine with its assumptions beside it. It is copied to a summary, then to a " +
    "slide, then to a message. Each copy is shorter than the last." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["The model", "The figure, its three assumptions, its class"],
    ["The summary", "The figure and its class; assumptions one click away"],
    ["The slide", "The figure, large; the class in small type"],
    ["The message", "The figure alone, now sounding like a record"],
  ], mark: 3, markLabel: "Laundered here" }, caption:
    "Each copy is shorter than the last, and the class is the first thing to fall away." },
  { t: "story", title: "A screenshot on a family group", x: [
    "An NRI in Singapore is weighing a position for his parents' retirement. He reads an estate " +
      "page carefully, labels and all. He takes a screenshot of the headline figure and sends it to " +
      "the family group in Pune.",
    "His screenshot crops the figure tight, and the word modelled sits just outside the frame. His " +
      "father reads the number as income the estate already earns. His sister reads it as a promise. " +
      "His mother asks when the first payment arrives.",
    "Nobody in the family did anything wrong. The figure simply travelled without its passport. By " +
      "the time it reached the people deciding, it had shed the one word that said how to read it.",
    "That is why our pages print the class beside the number, at the size of the number, wherever " +
      "it appears. A screenshot of the figure is then a screenshot of its class too. The passport " +
      "travels with the traveller.",
  ] },
  { t: "p", x:
    "Laundering can also run in time. A forecast made in one year is still on a page two years " +
    "later. By then some of its period has happened. The honest move is to replace the forecast " +
    "with what was observed, and to show both side by side." },
  { t: "p", x:
    "That side-by-side view is one of the most useful things a partner can ask for. It shows how " +
    "well the model read the estate. A model that tracked closely earns more trust for its next " +
    "forecast. One that drifted tells you which input to watch." },
  { t: "p", x:
    "We hold ourselves to the same rule internally. A figure in a draft carries its class from the " +
    "first keystroke. A reviewer who sees a bare number asks for its class before reading on. " +
    "The habit costs a few seconds a figure and saves the whole page from drift." },

  { t: "h", x: "When sources disagree" },
  { t: "p", x:
    "Source documents sometimes contain figures that cannot all be true at once. The rule is to " +
    "carry the conservative figure, record the inconsistency, and compute the dependent figures " +
    "from it. Then the two can never disagree again." },
  { t: "p", x:
    "Disagreement is normal in early documents. A site survey, a feasibility study and a bank " +
    "submission are written months apart, by different people, for different readers. Each may " +
    "carry its own version of the same quantity." },
  { t: "p", x:
    "The tempting fix is to pick the figure that reads best. The second temptation is to average " +
    "them. Both hide the disagreement, and a hidden disagreement surfaces later, at the worst " +
    "moment, usually in front of a lender." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Find it", "Two sources state one quantity two ways"],
    ["Carry the conservative figure", "The one that makes the estate look less attractive"],
    ["Record the inconsistency", "Both figures, both sources, dated, in the register"],
    ["Compute from one place", "Every dependent figure reads the carried value"],
    ["Settle it", "A ruling closes the entry, with its reason"],
  ] }, caption: "What happens to a disagreement, in order, from the moment it is found." },
  { t: "story", title: "Two documents, one area", x: [
    "Imagine a family office in Mumbai reviewing an estate for the first time. Their analyst reads " +
      "two source documents side by side. One states a built area. The other, prepared a month " +
      "later, states a larger one, say a third larger, as an illustration.",
    "Every cost in the model follows from that area. The larger figure makes the build look " +
      "generous and the cost per square foot look modest. The smaller one makes the estate look " +
      "tighter and dearer.",
    "The analyst expects to see the larger figure on the page, because it flatters. Instead the " +
      "page carries the smaller one, with a note naming both documents and the gap between them. " +
      "Every dependent cost reads from the carried figure.",
    "The family office now knows three things. A disagreement exists. It cuts in a known " +
      "direction. And the platform chose the reading that costs it something. The third tells " +
      "them most about the rest of the page.",
  ] },
  { t: "p", x:
    "Why the conservative figure, rather than the likeliest? Because the cost of error is lopsided. " +
    "A partner who plans on the cautious number and meets the generous one has a pleasant " +
    "surprise. A partner who plans on the generous number and meets the cautious one has a problem." },
  { t: "p", x:
    "Carrying the cautious figure also keeps the platform's incentives straight. A presenter who " +
    "may choose freely between two numbers will drift, over time, towards the kinder one. A rule " +
    "that removes the choice removes the drift." },
  { t: "p", x:
    "Recording the inconsistency matters as much as choosing well. A reader who sees only the " +
    "carried figure cannot judge how firm it is. A reader who sees both figures, their sources and " +
    "the gap, can judge for themselves and ask better questions." },
  { t: "p", x:
    "Computing from one place is the quiet part of the rule. If the carried figure is stated once " +
    "and every other figure reads from it, a later correction moves everything together. Two " +
    "copies of a number can drift apart. One copy cannot." },

  { t: "h", x: "Reading a page in four questions" },
  { t: "p", x:
    "You can carry this entry with you as four questions. They work on our pages, and they work " +
    "on anyone's." },
  { t: "list", x: [
    "What class is this figure? If the page leaves it unsaid, treat it as the weakest class.",
    "Which inputs set that class? Find the assumption, and ask whose judgement it is.",
    "What happens if one input moves? Ask for the figure at a lower rate or a lower occupancy.",
    "Where else does this quantity appear? If two pages disagree, ask which one is carried, and why.",
  ] },
  { t: "p", x:
    "None of these questions is hostile. A good sponsor welcomes them, because each one shows the " +
    "reader engaging with how the estate actually works. A page that answers all four easily is " +
    "a page built to be read closely." },
  { t: "p", x:
    "Ask them of a figure in a newspaper, a fund factsheet or a friend's spreadsheet, and the " +
    "results are often revealing. Many figures in circulation carry no class at all. The four " +
    "questions supply one, and usually it is the modest one." },
  { t: "p", x:
    "The labels will change as the estates mature. Forecasts will give way to observed quarters. " +
    "Estimates will be replaced by contracts and invoices. Pending lines will fill in. Each change " +
    "is recorded, so a partner can watch the record firm up over the years." },
  { t: "illus", plate: "confluence/key-section", caption:
    "A drawing is a modelled picture too: every line is exact, and the building it shows is still to be built." },
  { t: "p", x:
    "A labelled figure asks a little more of the reader. In return it gives a fair account of how " +
    "much the figure knows. We think that is the better bargain, and it is the one this platform " +
    "offers on every page." },
];
