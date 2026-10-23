/* J-13 · Why beautiful assets can still be terrible investments — long form,
   23 Oct 2026. The hundred-rupee example is invented, as the entry has always
   said, and every passage that uses it says so again. The "fifth off" column
   is that same invented example recomputed. The platform's own payment order
   is read from WATERFALL, as content/journal.ts reads it; nothing else here
   is a market figure. */
import type { Block } from "../journal";
import { WATERFALL } from "../../app/_assemblies/data";

const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1") + "%";
const OPERATOR = pct(WATERFALL[1].bps);
const BRAND = pct(WATERFALL[2].bps);
const ADMIN = pct(WATERFALL[3].bps);
const SINKING = pct(WATERFALL[4].bps);
const DEBT = pct(WATERFALL[5].bps);
const PARTNERS = pct(WATERFALL[WATERFALL.length - 1].bps);

export const MINUTES = 24;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "Someone walks into a house on a hillside and knows within a minute that they want it. That " +
    "reaction is real information: other people will likely react the same way. It says almost " +
    "nothing about whether owning it will make money." },
  { t: "p", x:
    "The two questions run on different variables. The first is answered instantly; the second " +
    "takes a fortnight of work. Whichever is answered first tends to become the conclusion." },
  { t: "p", x:
    "The first answer arrives with force. Light, proportion, the smell of timber, the sound of " +
    "water below: the whole body agrees at once. By the time the spreadsheet opens, the decision " +
    "already feels made, and the numbers are read to confirm it." },
  { t: "p", x:
    "That is a natural way to choose a home. It is a risky way to choose an investment. A home " +
    "is judged by how it feels to live in. An investment is judged by what it returns to its " +
    "owner, and the two answers can point in opposite directions." },
  { t: "p", x:
    "This entry is about keeping the two questions apart. It walks through what decides an " +
    "owner's income, follows a hundred rupees of revenue to the end, and looks at the reserve " +
    "and the exit. Then it sets six ways of owning a beautiful place side by side." },
  { t: "p", x:
    "Its subject is risk, so it speaks about risk plainly. The worked example in the middle is " +
    "invented, and it says so each time it appears. The shape of the example is real." },
  { t: "graphic", g: { kind: "compare", head: ["Is it beautiful?", "Does it pay?"], rows: [
    ["Time to answer", "About a minute", "About a fortnight of work"],
    ["Who can answer", "Anyone who walks in", "Someone with the contracts and a model"],
    ["What it rests on", "Light, view, materials, proportion", "Land, build cost, nights, fees, debt, reserve"],
    ["Where the evidence sits", "On the veranda", "In the documents"],
    ["What it tells you", "Others will likely want it too", "What an owner keeps"],
  ] }, caption: "Two honest questions about the same building, answered from different evidence." },
  { t: "story", title: "The house on the ridge", x: [
    "A Bengaluru architect, newly retired, was shown a villa on a ridge above a valley in the " +
      "Ghats. Teak doors, a lap pool on the edge, a view that ran forty kilometres on a clear day.",
    "She knew in a minute. She had designed houses for thirty years and this one was right. The " +
      "proportions were generous. The light moved through it beautifully. She could picture her " +
      "grandchildren on the steps.",
    "The seller's agent offered a share of the villa, run as a holiday rental. The brochure showed " +
      "the pool at dusk and a projected income. She asked for the operating contract, the cost " +
      "sheet and the occupancy by month.",
    "The papers took three weeks to arrive. When they did, the picture changed. The land had been " +
      "bought at a hill-station price. The build had overrun. The operator took its fee on revenue. " +
      "The ridge road closed for part of every monsoon. Nobody had funded a reserve.",
    "She still loved the house. She also saw clearly that she would be buying the house, and the " +
      "income would follow only in good years. She kept the two answers on separate pages.",
    "That habit, two answers on two pages, is the whole subject of this entry.",
  ] },

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
  { t: "p", x:
    "Take the land first. Land in a beautiful place is priced on its beauty. That price is paid " +
    "once and carried for ever. A useful test is to ask what the land would be worth with the " +
    "building removed. The gap between that figure and the price paid is a bet on the building." },
  { t: "story", title: "The land under the view", x: [
    "A Chennai entrepreneur was offered a share of a cliff-top retreat. The land, he was told, " +
      "had cost a great deal because of the view. The brochure called that a strength.",
    "He asked a simple question. What would the same land fetch as a plain plot, with no " +
      "building and no plan? A local surveyor gave him a figure, and it was a fraction of the " +
      "price paid.",
    "The difference was a bet: that the finished retreat would earn " +
      "enough, for long enough, to justify a hill-station price for the soil beneath it.",
    "He kept the bet in view and wrote it down as a bet, with its own line in his " +
      "notes. Then he asked what would have to be true, year after year, for it to pay off.",
    "The answer became his checklist: the nights, the rates, the fee, the debt, the reserve. " +
      "The view was where the bet began. The checklist was how it would be settled.",
  ] },
  { t: "p", x:
    "Build cost comes next. Remote, steep and wet sites cost more to build on, and they tend to " +
    "overrun. Materials travel further. Crews travel further. The monsoon stops work for months. " +
    "Each rupee of overrun is capital that earns nothing extra, because the building it pays for " +
    "earns the same either way." },
  { t: "p", x:
    "Then nights. A night is earned when someone wants to be there and can reach the place. " +
    "Climate and distance set the first limit. Marketing works within that limit and moves it " +
    "very little." },
  { t: "p", x:
    "The operator's share is the fourth term. Most operators charge on revenue. That aligns them " +
    "with filling the calendar, and leaves the owner to carry the costs below the line." },
  { t: "p", x:
    "Debt magnifies everything above it. In a good year it lifts what an owner keeps. In a lean " +
    "month it is paid in full while revenue falls. Lenders rank ahead of owners, so the owner " +
    "absorbs the difference." },
  { t: "p", x:
    "Notice how little of this the visit reveals. A site visit shows the building and the view. " +
    "The land price sits in a sale deed, the overrun in a contractor's accounts, the fee in an " +
    "operating contract. The debt sits in a loan agreement." },
  { t: "p", x:
    "Last comes the reserve, the money set aside for roofs, pumps and plant. It is the line most " +
    "often left at zero, and the one with the longest memory." },
  { t: "assert", x:
    "Six terms decide what an owner earns. The view affects one of them, partly." },
  { t: "p", x:
    "It helps to see why leisure property behaves differently from other property. Compare it " +
    "with a leased office. The two can cost similar sums and sit in the same portfolio. Their " +
    "income works in opposite ways." },
  { t: "graphic", g: { kind: "compare", head: ["A leased office", "An operated leisure asset"], rows: [
    ["Where income comes from", "Rent from a tenant, under a lease", "Revenue from visitors, night by night"],
    ["How often it is decided", "Once, for the length of the lease", "Every night, all year"],
    ["Who carries running costs", "Often largely the tenant", "The owner, before anything is paid out"],
    ["What a quiet month does", "Little, while the lease runs", "Cuts revenue while costs continue"],
    ["Who runs the building day to day", "The tenant, mostly", "An operator, for a share of revenue"],
  ] }, caption: "Two kinds of property, compared on how their income is earned." },
  { t: "p", x:
    "An office owner sells space once, for years at a time. A leisure owner sells nights, one at " +
    "a time, every night of the year. Every one of those nights carries a cost whether it sells " +
    "or not." },
  { t: "p", x:
    "That makes a leisure asset closer to a business than to a building. Its value rests on how " +
    "well it is run, how full it is, and how carefully its costs are held. The building is the " +
    "stage. The business is the play, and owners are paid from the play." },

  { t: "h", x: "Seasonality is the term people underestimate" },
  { t: "p", x:
    "A place that is extraordinary for five months and unreachable for two has an occupancy " +
    "ceiling set by weather. Marketing and photography leave that ceiling where it is." },
  { t: "p", x:
    "The common mistake is to model an annual average. Costs are monthly and revenue is " +
    "seasonal. So the question is whether the reserve carries the lean months, rather than " +
    "whether the year works." },
  { t: "p", x:
    "Picture a year as twelve buckets. Costs pour into each bucket at almost the same rate: " +
    "salaries, power, insurance, upkeep, interest. Revenue pours unevenly. It fills some buckets " +
    "to the brim and leaves others nearly dry." },
  { t: "p", x:
    "An annual average pours all the revenue into one big bucket and compares it with all the " +
    "cost. The result can look healthy. Month by month, the same business may run short for a " +
    "third of the year. Something has to fund those months." },
  { t: "p", x:
    "A better picture is a calendar shaded by month. Dark months earn well. Pale months earn " +
    "little. Run a finger along it and the lean stretch shows at once, along with how long it " +
    "lasts and what follows it. A model should read like that calendar." },
  { t: "graphic", g: { kind: "compare", head: ["Modelled as an annual average", "Modelled month by month"], rows: [
    ["The question it answers", "Does the year cover its costs?", "Does each month cover its costs?"],
    ["How the lean months appear", "Hidden inside the total", "Visible, one by one"],
    ["What funds a shortfall", "Rarely asked", "A named reserve, sized in advance"],
    ["What a bad monsoon does", "Lowers the average a little", "Extends the lean stretch by weeks"],
    ["Who it reassures", "The person selling", "The person holding"],
  ] }, caption: "The same business, modelled two ways; only the second shows where the strain falls." },
  { t: "p", x:
    "The weather that sets the ceiling also sets the timing. Rain closes roads in the same weeks " +
    "every year. Heat empties the plains in the same weeks every year. A seasonal place earns on " +
    "the calendar, and the calendar repeats." },
  { t: "p", x:
    "Shoulder months deserve their own attention. They sit between the strong season and the " +
    "lean one, and they decide how long the lean stretch really lasts. A place that fills its " +
    "shoulders well has a short winter, whatever the weather." },
  { t: "p", x:
    "Shoulders fill for reasons a brochure rarely mentions. Long weekends. School holidays in a " +
    "nearby city. A festival in the district. A model that names these reasons, month by month, " +
    "is more credible than one that assumes an even spread." },
  { t: "p", x:
    "Distance works the same way. A place within a short drive of a large city fills more " +
    "weekends than one that needs a flight. Every hour of travel narrows the pool of people who " +
    "can come on a Friday evening." },
  { t: "story", title: "The monsoon that ran long", x: [
    "A family office in Mumbai held a stake in a coastal retreat. The model assumed an annual " +
      "occupancy, spread evenly across the year. The first two years ran close to plan.",
    "In the third year the rains arrived early and left late. The coast road flooded twice. The " +
      "lean stretch, normally a few months, ran several weeks longer.",
    "Revenue for the year fell by a modest fraction. On the annual model it looked like a soft " +
      "year. In the bank account it looked very different. Salaries and interest went out every " +
      "month. Revenue arrived in a rush in the final quarter.",
    "For four months the retreat drew down cash. The operator asked the owners to fund the gap. " +
      "One owner could, one could only partly, and one asked to defer. Meetings that had been " +
      "pleasant became tense.",
    "The retreat recovered the next year. The family office kept one lesson from it, and wrote " +
      "it into every later review: show the months, and show what funds the worst run of them.",
  ] },
  { t: "assert", x:
    "Costs are monthly and revenue is seasonal. A model that shows only the year has hidden the " +
    "months that decide it." },
  { t: "p", x:
    "Seasonality is a fact of place, and good planning works with it. There are a handful of " +
    "honest ways to carry the lean months. Each one is a design or financing decision made long " +
    "before the first lean month arrives." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["A funded reserve", "Cash set aside in good months to carry the lean ones"],
    ["Measured debt", "Less borrowing means a smaller fixed payment in a quiet month"],
    ["A second season", "A site that offers something different in the wet or hot months"],
    ["A short drive", "Distance from a large city widens the weekends that can fill"],
    ["Flexible running costs", "Staffing and supplies planned to flex with the calendar"],
  ] }, caption: "Five ways to carry the lean months, each decided before they arrive." },
  { t: "p", x:
    "The third of those is the most elegant, because it changes the ceiling itself. A coastal " +
    "site with both sea and estuary can offer surf in one season and still water in another. A " +
    "hill estate can make the monsoon its main event, with streams, fog and fire." },
  { t: "p", x:
    "None of these removes seasonality. Together they shape it. A reader assessing a leisure " +
    "asset should ask which of them the plan uses, and how far each one reaches." },

  { t: "h", x: "A hundred rupees, followed to the end" },
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
    "Walk through the arithmetic once, still inside the invented example. If the asset cost " +
    "twenty-five times its revenue, a hundred rupees of revenue sits on two thousand five hundred " +
    "rupees of cost. Twenty-six on two thousand five hundred is just over one per cent." },
  { t: "p", x:
    "The brochure shows the hundred. The owner lives on the twenty-six. The investment case " +
    "rests on the one per cent. Three numbers describe one building, and each sounds different." },
  { t: "p", x:
    "Each line in the invented list hides a decision worth understanding. Take the operator's " +
    "fee. Charged on revenue, it rewards a full calendar, at any price. Charged on profit, it " +
    "rewards a well-run house. Many contracts blend the two." },
  { t: "p", x:
    "A fee on revenue ranks very high. It is paid before the building's own costs are fully met, " +
    "and before any lender or owner. In a lean year the operator is paid in full on what came in, " +
    "and the owner absorbs the rest." },
  { t: "p", x:
    "Sales and distribution is the toll for being found. Listing platforms, agents and" +
    "advertising each take a share of what they bring. A place with loyal returning visitors pays " +
    "less of this toll than one that must be rediscovered every season." },
  { t: "p", x:
    "Interest is the most rigid line of all. It is fixed by the loan, payable every month, and " +
    "indifferent to the weather. It is also senior: lenders are paid before owners, and they can " +
    "act if they are not." },
  { t: "p", x:
    "The reserve, finally, is the only line that serves the owner directly. It protects the " +
    "building the owner holds. That makes it the easiest line to cut and the costliest one to " +
    "have cut." },
  { t: "p", x:
    "Now move one variable. Cut occupancy by a fifth: one bad monsoon, one closed road, one " +
    "year of expensive flights. Revenue falls to 80. Operating cost barely moves, because a " +
    "building costs almost the same to keep whether or not anyone is in it. The operator's fee " +
    "falls with revenue; interest stays put. What was 26 becomes single digits, and the reserve " +
    "is the first line anyone proposes to skip." },
  { t: "graphic", g: { kind: "compare", head: ["A normal year (invented)", "A fifth off revenue (invented)"], rows: [
    ["Revenue", "100", "80"],
    ["Operating cost", "38", "38, barely moved"],
    ["Operator's fee", "10", "8, falls with revenue"],
    ["Sales and distribution", "6", "About 5"],
    ["Interest", "12", "12, unchanged"],
    ["Reserve", "8", "8, if it is kept"],
    ["Left before tax", "26", "About 9"],
  ] }, caption: "The invented example again: a fifth off the top takes about two-thirds off the bottom." },
  { t: "assert", x:
    "Leisure assets are operationally geared. A fifth off revenue takes most of what the owner " +
    "earns, because the costs are annual and the revenue is seasonal." },
  { t: "p", x:
    "This is the mechanism to understand above all others. Fixed costs sit between revenue and " +
    "the owner like a lever. A small move at the top becomes a large move at the bottom, in both " +
    "directions." },
  { t: "p", x:
    "In a strong year the lever works for the owner. A fifth more revenue, with costs nearly " +
    "fixed, lifts what remains sharply. That is why leisure property attracts optimists. The " +
    "lever is real, and it is symmetrical." },
  { t: "p", x:
    "Run the invented example upward to see it. Revenue rises to 120. Operating cost holds near " +
    "38. The operator's fee rises to 12, distribution to about 7, and interest and reserve hold " +
    "level. What remains climbs from 26 to about 43." },
  { t: "p", x:
    "So in this invented case, a fifth more revenue adds about two-thirds to what the owner keeps. " +
    "A fifth less removes about two-thirds. The same lever, pulled both ways, with the owner at " +
    "the far end of it." },
  { t: "p", x:
    "The honest model shows both directions. It sets out the normal year, then a weaker year, " +
    "then a stronger one, with the same costs. A model that shows only one year has chosen which " +
    "direction to show." },
  { t: "pull", x: "Would this be a sound position if it were ugly?" },
  { t: "p", x:
    "So how does this platform answer the hundred-rupee question for its own estates? Each " +
    "estate publishes its payment order as six stages, in fixed order, closing to the whole of " +
    "revenue. The shares below are the modelled order on the register." },
  { t: "graphic", g: { kind: "waterfall" }, caption:
    "The modelled payment order on the register: six stages, paid in sequence, closing to the whole." },
  { t: "p", x:
    "Read it the same way as the invented list. The operator takes " + OPERATOR + ". The brand " +
    "takes " + BRAND + ". The admin reserve and the sinking fund take " + ADMIN + " and " +
    SINKING + ". Debt service takes " + DEBT + ". Partners receive the final " + PARTNERS + "." },
  { t: "p", x:
    "Two lines deserve a second look. The sinking fund is a stage of the order, paid from revenue " +
    "ahead of debt and partners. So the reserve is planned rather than hoped for. And NAVINA " +
    "Structures, which governs each estate as Getaway Collective, holds no equity and is paid " +
    "from one disclosed stage." },
  { t: "p", x:
    "The figures are modelled, and an owner should read them as modelled. The point of showing " +
    "them is the shape: every stage named, in order, with its share. That is the answer an owner " +
    "should expect from any operated property." },

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
  { t: "p", x:
    "Every car owner knows the logic. A car comes with a maintenance schedule: tyres at one " +
    "distance, brakes at another, a timing belt further on. A careful owner budgets for each " +
    "before it is due. A building has the same kind of schedule, written in longer intervals." },
  { t: "p", x:
    "The difference is visibility. A car's schedule is printed in its manual. A building's is " +
    "rarely written down, and its parts fail out of sight: under tiles, inside walls, below the " +
    "pool deck. A reserve plan is that missing manual, with a sum beside each line." },
  { t: "p", x:
    "Think of a reserve as a slow invoice. Every year the roof, the pumps and the decks wear a " +
    "little. The cost of that wear is real from the first day, whether anyone writes it down or " +
    "not. A reserve simply pays the invoice as it accrues." },
  { t: "p", x:
    "Leaving the reserve at zero improves the early years on paper. Distributions look larger. " +
    "The yield looks better. Then the invoice arrives all at once, usually in a year that is " +
    "already difficult." },
  { t: "story", title: "Year seven", x: [
    "Four friends from Pune bought a villa near the Goa coast together. They split the cost " +
      "evenly and let it through an agency when none of them were using it.",
    "The agency sent a statement each quarter. Revenue less costs, split four ways. Nobody " +
      "suggested holding anything back, and the early statements were cheerful.",
    "In the seventh monsoon the roof failed above the main bedroom. The same season, the pool " +
      "pump gave out and the timber deck began to rot at the edges. The agency's estimate for " +
      "all three ran to a sum larger than two years of distributions.",
    "Each friend now had to find a quarter of it. One had just paid a child's college fees. One " +
      "was abroad and slow to reply. One proposed patching the roof and leaving the deck. One " +
      "wanted to sell.",
    "The repairs were done in the end, a season late, and the friendship survived with some " +
      "strain. The villa had cost exactly what it was always going to cost. The friends had " +
      "simply paid for seven years of wear in one.",
  ] },
  { t: "graphic", g: { kind: "compare", head: ["Reserve left at zero", "Reserve funded from revenue"], rows: [
    ["Early distributions", "Larger", "Smaller, by the reserve"],
    ["When the roof fails", "A capital call, in a hard year", "Paid from money already set aside"],
    ["Who decides the timing", "The weather", "A plan, made in advance"],
    ["How owners meet it", "Each finds their share, or cannot", "Already met, through the payment order"],
    ["How the asset looks in year fifteen", "Patched, in the order things broke", "Renewed, in the order planned"],
  ] }, caption: "The same wear, paid for in two ways." },
  { t: "p", x:
    "The third question, who decides when the reserve is spent, is about governance. A reserve " +
    "controlled by the operator alone can drift towards the operator's priorities. A reserve " +
    "controlled by owners, with a plan, is spent on the building they own." },
  { t: "p", x:
    "In an estate LLP, partners vote on the estate's decisions, weighted by what they hold. The " +
    "sinking fund sits in the payment order as its own stage, funding replacement before failure. " +
    "Its spending is a partners' matter, made against a plan." },
  { t: "assert", x:
    "A reserve is the cost of wear, paid as it happens. Leaving it unfunded moves the cost to a " +
    "later, harder year." },

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
  { t: "graphic", g: { kind: "compare", head: ["The exit done the usual way", "The exit done properly"], rows: [
    ["The buyer", "Unnamed: 'the market'", "Named: who, and why they would buy"],
    ["The price", "Purchase price, grown at a chosen rate", "A multiple of earnings, a rate per area, or a comparable sale"],
    ["When it happens", "The final year of the model", "When a buyer exists at that price"],
    ["What a bad year does", "Nothing, in the spreadsheet", "Shrinks the pool of buyers"],
    ["What it asks of the holder", "Faith", "Evidence"],
  ] }, caption: "An exit assumption is a claim about a buyer; the right column makes the claim checkable." },
  { t: "p", x:
    "Each price basis asks a different question. A multiple of earnings asks what the asset " +
    "actually distributes, and what a buyer would pay for that stream. It ties the exit to the " +
    "operating record, good or bad." },
  { t: "p", x:
    "A price per square foot asks what similar space sells for nearby. It is simple, and in a " +
    "remote place it can mislead, because there may be few similar buildings and fewer sales. A " +
    "comparable sale asks what a real buyer paid for a real asset like this one." },
  { t: "p", x:
    "A grown purchase price asks nothing at all. It assumes the market will pay what was paid, " +
    "plus a chosen rate. That figure measures the seller's hope rather than any buyer's appetite." },
  { t: "p", x:
    "Consider who actually buys a share of a leisure property. Usually it is someone who wants " +
    "that place, at that time, with spare capital. All three conditions have to hold together. " +
    "In a weak economy, the third one fails first." },
  { t: "p", x:
    "Timing matters as much as the buyer. A model usually sells in a chosen year, say year ten, " +
    "as an illustration. Real sales happen when a willing buyer and a willing seller meet. That " +
    "meeting can arrive early, late, or at a price the model never considered." },
  { t: "p", x:
    "Consider also who sells. Holders tend to sell when they need cash, when the asset has " +
    "disappointed, or when the group has fallen out. Each of those moments is a poor one to " +
    "negotiate in." },
  { t: "story", title: "Selling from Singapore", x: [
    "An NRI engineer in Singapore owned a fifth of a hill villa with four relatives. When his " +
      "company relocated him, he decided to sell his share and simplify.",
    "The co-ownership deed said nothing about how a share would be valued or sold. His relatives " +
      "had first refusal by family custom, but none had the cash. Outsiders were wary of buying " +
      "into a family house.",
    "He tried a local broker. The broker found two interested buyers, each of whom wanted the " +
      "whole villa, and neither wanted a fifth of it. One relative offered to buy over three " +
      "years, at a price well below the figure in the original projection.",
    "Two years later he accepted that offer. He had bought a beautiful place and sold a " +
      "difficult share of it. The projection's exit value had assumed a buyer who was never " +
      "named, for a share that came with four co-owners attached.",
  ] },
  { t: "p", x:
    "Real assets are slow to sell, and this is usually presented as a cost. Sometimes it is. It " +
    "is also why they are not repriced by sentiment every afternoon, and why a holder's " +
    "conviction is not tested weekly." },
  { t: "p", x:
    "The real defect is illiquidity left unpriced: a position bought at a valuation that " +
    "assumed an exit nobody had modelled." },
  { t: "p", x:
    "Priced honestly, illiquidity becomes a feature an owner can choose. A holder who plans to " +
    "keep a position for years gains from the calm. A holder who may need the money soon should " +
    "know that in advance, and size the position to match." },
  { t: "p", x:
    "Think about who would naturally buy a share of a particular estate. Often it is someone who " +
    "already knows it: a visitor who returns every year, a friend of a partner, a partner wanting " +
    "more. The pool is small, and it is real. It grows with the estate's reputation." },
  { t: "p", x:
    "That is a reason to care how a place is run long before anyone wants to sell. A " +
    "well-kept estate with a good name builds its own pool of buyers. A neglected one has to find " +
    "strangers, at a discount." },
  { t: "p", x:
    "Structure helps here. A share of a building held under a family deed has no agreed route to " +
    "a sale. A unit in a partnership is transferable under the agreement that created it, after " +
    "its lock-in, to a buyer who takes on the same terms. The route is written down." },
  { t: "assert", x:
    "An exit is a buyer, a price basis and a route. A projection that names none of the three " +
    "has assumed all of them." },

  { t: "h", x: "Six ways to own a beautiful place" },
  { t: "p", x:
    "Someone drawn to a beautiful place has several ways to own a piece of it, or something like " +
    "it. They differ less in the view than in structure. Who decides? Who pays for upkeep? How " +
    "far does liability reach? How do you leave? What can you visit?" },
  { t: "p", x:
    "The comparisons below are about structure and terms only. They say nothing about which " +
    "earns more, because that depends on the particular asset and the particular terms." },
  { t: "graphic", g: { kind: "compare", head: ["A holiday home of your own", "Co-owning with friends"], rows: [
    ["Who decides", "You, alone", "Every co-owner, usually unanimously"],
    ["Who pays for upkeep", "You, as bills arrive", "Each co-owner, by agreement or by asking"],
    ["Liability", "Yours, in full", "Exposure beyond what each put in"],
    ["How you exit", "Sell the whole house", "Sell a share, if a buyer will take it"],
    ["What you can visit", "Whenever you like", "By arrangement among friends"],
  ] }, caption: "The two most familiar ways to own a place, compared on structure." },
  { t: "p", x:
    "A holiday home is the simplest. It is entirely yours: the decisions, the bills and the " +
    "empty months. It suits someone who will use it often and enjoys running a house at a " +
    "distance." },
  { t: "p", x:
    "Co-owning with friends spreads the cost and multiplies the decisions. It works beautifully " +
    "while everyone agrees. It strains at the first disagreement, the first large repair, or the " +
    "first person who wants to leave." },
  { t: "graphic", g: { kind: "compare", head: ["A timeshare", "A unit in an estate LLP"], rows: [
    ["What you hold", "Usually a right to use set weeks", "A share of the partnership that owns the estate"],
    ["Who decides", "The operator", "Partners, by a vote weighted by equity"],
    ["Who pays for upkeep", "You, through an annual fee", "The estate, through a sinking fund in its payment order"],
    ["Liability", "Set by the contract", "Limited to what you contributed"],
    ["How you exit", "Resale, often hard to arrange", "Transfer under the agreement, after the lock-in"],
    ["What you can visit", "Your weeks", "One night a year for each 1% held, from handover"],
  ] }, caption: "Two ways to hold part of a leisure place, compared on structure." },
  { t: "p", x:
    "A timeshare sells use. The holder buys time in a place and pays a fee to keep it. The " +
    "building and its decisions remain with the operator." },
  { t: "p", x:
    "A unit in an estate LLP sells ownership. Each estate is a single asset in its own " +
    "partnership, and its partners own it exclusively. Units are shares of ownership; the " +
    "estate's keys are where visitors sleep. Partners vote on decisions in proportion to what " +
    "they hold." },
  { t: "p", x:
    "The partnership form matters most in the hard moments. A disagreement goes to a vote. A " +
    "partner who leaves transfers a unit under the agreement, and the buyer takes it on the same " +
    "terms. A partner's liability is limited to what they contributed." },
  { t: "p", x:
    "The upkeep question is answered inside the structure too. Running costs, the operator, the " +
    "brand, the reserves and any debt are paid from revenue in a fixed order. Partners receive " +
    "the final stage. The building's wear is funded before anyone is paid out." },
  { t: "p", x:
    "Two further comparisons are useful precisely because they are so different. Neither is a " +
    "beautiful place at all. They are the alternatives the same money could sit in, and every " +
    "leisure position should be weighed against them." },
  { t: "list", x: [
    "A fixed deposit with a bank: a set term and a rate agreed at the start. Nothing to decide, " +
      "nothing to maintain, and nothing to visit.",
    "A listed real estate investment trust: units traded on an exchange, in a portfolio of " +
      "income property. You can sell on any trading day. Decisions sit with its manager. You " +
      "visit only as a member of the public.",
    "An estate LLP unit: a share of one named place, with a vote, limited liability, a written " +
      "route to exit and nights at the estate.",
  ] },
  { t: "p", x:
    "A fixed deposit is the plainest benchmark. Its terms are set at the start and its upkeep " +
    "is nil. Any leisure position should be able to explain, in its own terms, why it deserves " +
    "money that could have sat there." },
  { t: "p", x:
    "A listed trust is the liquid benchmark. It holds income property at scale and trades every " +
    "day. A single-estate position gives up that liquidity. In return it offers a named place, a " +
    "vote on its decisions, and nights there. The reader decides whether that exchange suits them." },
  { t: "p", x:
    "Set side by side, the choice becomes clearer. Each structure trades something for something " +
    "else: control for simplicity, liquidity for presence, use for ownership. None of them makes " +
    "a poorly bought asset sound. Each simply decides who carries what when things go wrong." },
  { t: "story", title: "A decision in Hyderabad", x: [
    "A doctor couple in Hyderabad had saved for years to own something in the hills. They " +
      "listed four options on a single sheet of paper.",
    "A holiday home of their own appealed most at first. Then they counted the weekends they " +
      "could actually spare, and the calls they would take about leaks and staff.",
    "Co-owning with two other couples looked cheaper. They imagined the first argument about the " +
      "roof, and the first time one couple needed their money back.",
    "A timeshare gave them the weeks without the ownership. A listed trust gave them easy sale, " +
      "with nothing to visit.",
    "In the end they wrote one line under each option: who decides, who pays, how we leave, " +
      "what we can visit. The line made the decision theirs, whichever way it went.",
  ] },

  { t: "h", x: "The test worth applying" },
  { t: "p", x:
    "Would this be a sound position if it were ugly? If the numbers work only when the building " +
    "is beautiful, what is being bought is the building. That is a legitimate purchase. It is a " +
    "purchase rather than an investment, and it should be judged as one." },
  { t: "p", x:
    "The test works because it removes the one variable that clouds the rest. Strip away the " +
    "view and the teak, and look at what remains. Land price, build cost, nights, fees, debt, " +
    "reserve, exit. If those still describe a sound position, the beauty is a bonus." },
  { t: "p", x:
    "Beauty earns its place in the model in one way. It may help fill nights, and it may help " +
    "hold a price. That is real, and it belongs in the occupancy and the exit, stated and " +
    "tested. It should be priced once, in those lines, rather than everywhere." },
  { t: "p", x:
    "Beauty also earns something a model leaves out. It is the reason to visit. For someone who " +
    "holds nights at a place, the pleasure of being there is a real part of what they own. That " +
    "value is genuine. It is simply paid in evenings rather than rupees." },
  { t: "p", x:
    "The trouble begins only when the two currencies are mixed. An owner who expects evenings and " +
    "income from the same rupee should see each priced separately. Then they can judge whether " +
    "the combination is worth it to them." },
  { t: "p", x:
    "A practical way to apply the test is to ask for two models. The first is the one offered. " +
    "The second assumes an ordinary building of the same size, in the same place, with the same " +
    "costs. The difference between them is what the beauty is being asked to earn." },
  { t: "story", title: "The ugly twin", x: [
    "An analyst at a Mumbai family office had a habit her colleagues found odd. For every leisure " +
      "asset on her desk, she built a second model for an imaginary twin.",
    "The twin sat on the same land, with the same keys, the same operator and the same debt. It " +
      "was plain: a sensible box with a tin roof. Its occupancy was set a little lower, its rates " +
      "a little lower, and its build cost a good deal lower.",
    "Then she compared the two. Sometimes the beautiful asset won clearly. Its higher rates and " +
      "fuller calendar more than repaid its cost, and the evidence for both was solid. She " +
      "recommended those with confidence.",
    "Sometimes the twin won. The beautiful asset had spent so much on teak and glass that no " +
      "plausible rate could recover it. Its whole case rested on a sale price nobody had tested.",
    "Her recommendation on those was always the same. Buy it if you love it, and call it a " +
      "purchase. Keep the investment budget for something that would work if it were plain.",
  ] },
  { t: "list", x: [
    "Can someone state the payment order for this property, stage by stage, with a share at " +
      "each stage?",
    "Is the model monthly, and what funds the leanest run of months?",
    "What happens to what the owner keeps if revenue falls by a fifth?",
    "What is in the reserve, what is it planned against, and who decides when it is spent?",
    "Who is the buyer at exit, why would they buy, and on what basis would they price it?",
    "Who decides, who pays, how far does liability reach, and how does an owner leave?",
  ] },
  { t: "p", x:
    "Six questions, each answerable in a sentence or two. A seller who can answer them all has " +
    "done the fortnight of work. A seller who answers with photographs has answered the first " +
    "question twice." },
  { t: "assert", x:
    "Beauty and return are separate questions. Answer the second one before the first one " +
    "answers it for you." },
  { t: "p", x:
    "Use the questions in any order, but use all of them. Each one closes a door the photograph " +
    "leaves open. Answered together, they turn a feeling about a place into a view about a " +
    "position. That view can then sit beside the feeling, each on its own page." },
  { t: "p", x:
    "Some positions pass every question and are beautiful too. Those are the rare ones worth " +
    "waiting for. Others pass the questions and are plain, and they may be the sounder holding. " +
    "Others fail the questions and are lovely, and they are honest purchases for those who want " +
    "them." },
  { t: "p", x:
    "Go back to the architect on the ridge. She loved the house in a minute and read its papers " +
    "for three weeks. Both answers were true. The wise decision came from keeping them apart." },
];
