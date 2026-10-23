/**
 * J-10 · The real cost of a house you use thirty days a year — long form
 * (Journal 5x, 23 Oct 2026).
 *
 * Expands the entry in content/journal.ts. The entry's disclosure is
 * "illustrative-figures": its one worked sum (₹1 L a month, 24 nights,
 * ₹50,000 a night) is structural, and every further division of it below
 * says it is an illustration in the same sentence. The payment-order
 * shares are read from WATERFALL, as content/journal.ts does; the deposit
 * from DEPOSIT. No market price, rent or return is stated.
 */
import type { Block } from "../journal";
import { WATERFALL, inr } from "../../app/_assemblies/data";
import { DEPOSIT } from "../../app/_assemblies/slowspace";

const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
const stage = (i: number) => pct(WATERFALL[i].bps);
const ADMIN = stage(3);
const SINKING = stage(4);
const PARTNERS = stage(WATERFALL.length - 1);
const DEPOSIT_INR = inr(DEPOSIT.amount);

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "A second house is bought on one number everybody discusses and held on several nobody " +
    "does. The purchase is negotiated hard, checked by a lawyer and slept on. What follows " +
    "arrives a line at a time, and by the time it is visible it feels normal." },
  { t: "p", x:
    "This entry is about those later lines. It is also about the one division that turns them " +
    "into a number you can judge. At the end, it sets three ways of holding a place side by " +
    "side." },
  { t: "p", x:
    "Those three are owning a house, renting a retreat, and holding a unit in an estate's LLP. " +
    "Each answers the same wish differently. Each suits a different person." },
  { t: "p", x:
    "The comparison is of structure and terms. Who decides, who pays, who carries the risk, how " +
    "you leave. It quotes no market prices, because those belong to a particular house in a " +
    "particular year. Where a sum appears, it is labelled as an illustration." },
  { t: "illus", film: ["creek", 17], caption:
    "A house in late afternoon, drawn empty, as most second houses are on most days." },

  { t: "h", x: "The costs that arrive after the decision" },
  { t: "p", x:
    "Start with the lines themselves. Each is familiar to anyone who has held a house they " +
    "visit. Few of them appear in the conversation that leads to buying one." },
  { t: "list", x: [
    "Someone local who holds the keys, paid whether anyone comes or not.",
    "The garden, which keeps growing between visits.",
    "Municipal dues, insurance and the annual bill nobody predicted.",
    "The repair that is small when found early and structural when found late.",
    "The drive itself: the cost most often left out, and paid every single time.",
  ] },
  { t: "p", x:
    "The caretaker comes first because the caretaker is the clearest case. Their wage is fixed. " +
    "It is the same in a month with eight visits and a month with none. The house needs someone " +
    "nearby, and that someone needs paying on the first of every month." },
  { t: "p", x:
    "The garden is the gentlest cost and the most persistent. It grows at the speed of the " +
    "climate, and in much of India the climate is generous. Left for a season, a garden becomes " +
    "a clearing job." },
  { t: "p", x:
    "Dues and insurance are predictable in kind and unpredictable in amount. The annual bill " +
    "nobody predicted is the pump, the roof sheet, the water tank, the gate motor. Every house " +
    "produces one a year. Its name changes; its arrival is reliable." },
  { t: "p", x:
    "The repair that grows is the expensive one. A damp patch found in July is a plastering job. " +
    "The same patch found the following March is a beam. The difference is who was there to " +
    "see it, and a house visited rarely is a house seen rarely." },
  { t: "p", x:
    "Then there is the drive. Fuel, tolls, a day of the weekend, the tiredness on arrival. It is " +
    "paid per visit, so it feels like part of the trip. It is really part of the house, because " +
    "the house decided where you would have to drive." },
  { t: "p", x:
    "The drive also has a cost that never shows on a statement. It is the visits it quietly " +
    "prevents. Every hour on the road makes the next trip a little harder to agree to. Over a " +
    "decade, that friction removes more nights than any bill." },
  { t: "p", x:
    "Notice what the five lines share. Four of them are paid on the calendar, by the month or by " +
    "the year. One is paid per visit. The calendar costs ignore how often you came. The visit " +
    "cost discourages you from coming more." },
  { t: "p", x:
    "Set the purchase and the holding side by side and the imbalance is plain. The purchase gets " +
    "weeks of attention, professional advice and a signature. The holding gets a standing " +
    "instruction at the bank and an occasional sigh." },
  { t: "graphic", g: { kind: "compare", head: ["What gets negotiated", "What arrives afterwards"], rows: [
      ["When it is discussed", "Before signing, at length", "After moving in, a line at a time"],
      ["Who checks it", "A lawyer and a valuer", "Usually nobody"],
      ["How often it is paid", "Once", "Every month, every year"],
      ["Whether it falls when the house is empty", "It is already paid", "It keeps running at the same rate"],
    ] },
    caption: "The purchase and the holding, set side by side. Only one of them gets a lawyer." },
  { t: "p", x:
    "Each is minor alone. Together they behave like a subscription to a house, and the " +
    "subscription runs at full rate when the house is empty. Cost follows the calendar; use " +
    "follows the distance." },
  { t: "pull", x: "Cost follows the calendar; use follows the distance." },

  { t: "h", x: "Divide by the nights, rather than by the year" },
  { t: "p", x:
    "The figure worth knowing is annual cost divided by the nights someone actually slept " +
    "there." },
  { t: "p", x:
    "Almost nobody does this division. The answer tends to be a number people would rather not " +
    "carry, and owning a house never forces the calculation. Annual cost is a figure people " +
    "know. Cost per night is a figure they avoid." },
  { t: "p", x:
    "The avoidance is understandable. A house is bought with feeling, and the feeling is real. " +
    "Dividing it into nights feels like reducing a memory to an invoice. So the annual figure is " +
    "paid, filed and quietly accepted as the price of having somewhere." },
  { t: "p", x:
    "There is a second reason. Once a house is owned, its purchase price is spent. The standing " +
    "costs feel small beside it, the way a tip feels small beside a meal. Yet the " +
    "standing costs are the part still open to decision." },
  { t: "p", x:
    "Do it anyway. If a house costs a lakh a month to hold and is used twenty-four nights, each " +
    "night cost fifty thousand rupees before anyone ate anything. That is an argument for " +
    "knowing the number, rather than against the house." },
  { t: "facts", rows: [
      ["₹1 L", "a month to hold, as an illustration"],
      ["24", "nights used in a year"],
      ["₹50,000", "per night, before anybody ate anything"],
    ] },
  { t: "p", x:
    "Now move the nights and watch the answer move. The sums below keep the entry's illustrative " +
    "lakh a month, which is twelve lakh a year. Only the number of nights changes." },
  { t: "graphic", g: { kind: "ladder", steps: [
      ["48 nights", "₹25,000 a night: a house used most weekends of the year"],
      ["30 nights", "₹40,000 a night: the thirty days in this entry's title"],
      ["24 nights", "₹50,000 a night: the entry's own worked example"],
      ["12 nights", "₹1,00,000 a night: one weekend a month, for a single night"],
      ["6 nights", "₹2,00,000 a night: the house visited for Diwali and one summer week"],
    ] },
    caption: "The same illustrative ₹12 L a year, divided by five honest counts of nights." },
  { t: "p", x:
    "The ladder holds no market data. It is arithmetic on one illustrative figure. Its use is " +
    "the shape: halve the nights and the cost of each one doubles. The standing cost has no idea " +
    "how often you came." },
  { t: "story", title: "The spreadsheet in Singapore", x: [
    "Picture an engineer working in Singapore, with a house in the hills of his home state. He " +
    "bought it in his thirties, imagining long summers there with his parents and children.",
    "One December, on a quiet evening, he opened a spreadsheet. He listed the caretaker, the " +
    "dues, the insurance, the repairs and the two flights home that each visit needed.",
    "Then he did what almost nobody does. He opened the family calendar and counted the nights " +
    "anyone had actually slept in the house that year. His parents had gone twice. He had gone " +
    "once.",
    "The answer surprised him less than the fact that he had never asked. He had always known " +
    "the annual figure. He had never put it over the nights.",
    "He kept the house. He also changed two things. He started letting his cousins use it " +
    "freely, and he started visiting in the monsoon as well as in May. The cost per night fell " +
    "because the nights rose. The house itself was unchanged.",
  ] },

  { t: "h", x: "The part that arrives ten years later" },
  { t: "p", x:
    "The surprise is generational. A house bought for a young family is used most while the " +
    "children are small. Use falls as they grow, and then the house passes to people who did " +
    "not choose it." },
  { t: "graphic", g: { kind: "timeline", steps: [
      ["The early years", "Bought for a young family; visited often, with energy"],
      ["The busy years", "School calendars and careers; visits thin to the holidays"],
      ["The empty years", "Children leave; the house is held for the memory of it"],
      ["The next generation", "Inherited by people who did not choose it, often jointly"],
    ], mark: 3, markLabel: "The decision passes to someone else" },
    caption: "A second house across a generation, drawn without figures, as most families live it." },
  { t: "p", x:
    "Sometimes they love it. Often they inherit upkeep tied to someone else's memory of a " +
    "place, somewhere they would not have picked. And it is held between siblings who disagree " +
    "and cannot easily sell." },
  { t: "p", x:
    "The pattern is common enough to have a shape. In the early years, the house is full and its " +
    "costs feel like the price of joy. In the busy years, visits thin to the school holidays. " +
    "The costs carry on at the same rate." },
  { t: "p", x:
    "In the empty years, the house is kept for what it meant. The caretaker opens it, airs it " +
    "and closes it again. The cost per night, if anyone divided it, would be at its highest " +
    "exactly when the family is least able to use the place." },
  { t: "p", x:
    "Then the decision passes on. The new owners inherit the costs, the caretaker and the roof. " +
    "They also inherit a structure built for one owner, now held by several." },
  { t: "story", title: "Three siblings and a veranda", x: [
    "Imagine three siblings, one in Bengaluru, one in Pune and one in Dubai. Their father's " +
    "coastal house came to them jointly. All three have warm memories of its veranda.",
    "The sibling in Bengaluru would like to keep it and use it. The one in Pune would like to " +
    "sell and divide the proceeds. The one in Dubai would like to rent it out, and has opinions " +
    "about which agent.",
    "Every decision needs all three. The roof needs repair, and the repair waits on a call that " +
    "keeps being moved. The caretaker asks who is paying this month. Each sibling assumes " +
    "another has handled it.",
    "Nobody in this story is unreasonable. The structure simply gives three equal owners no way " +
    "to decide anything without unanimity. The house becomes the subject of family calls, " +
    "rather than the place the family goes.",
    "This is the generational cost in its plainest form. It never appeared in the purchase " +
    "price, and it arrives thirty years after the purchase was made.",
  ] },
  { t: "assert", x:
    "The failure of a second house is rarely the house. It is the gap between how often someone " +
    "imagined being there and how often they went, compounded by a cost that never noticed the " +
    "difference." },

  { t: "h", x: "Three structures, side by side" },
  { t: "p", x:
    "Here is the careful comparison, of three ways to hold a place to return to. The first is " +
    "owning a holiday home outright. The second is renting a retreat when you want one. The " +
    "third is holding a unit in an estate's limited liability partnership. Each is compared on " +
    "terms, in pairs." },
  { t: "graphic", g: { kind: "compare", head: ["Owning a holiday home", "A unit in an estate's LLP"], rows: [
      ["What you own", "A whole house, and every task it creates", "A share of one estate, held in its own LLP"],
      ["Who runs it", "You, or a caretaker you supervise", "Sensory Getaways, measured against a Service Level Agreement"],
      ["Who decides", "You, or your family by agreement", "Partners, by a vote weighted by holding"],
      ["Who pays the standing costs", "You, from your own pocket, every month", "The estate, from its revenue, in a fixed order"],
      ["The empty nights", "Cost you the full rate", "Are let; their revenue enters the payment order"],
      ["Your liability", "Without limit", "Limited to what you contributed"],
      ["How you leave", "A sale of the whole house", "A sale of the position, after the lock-in"],
      ["What you can visit", "The house, whenever you can reach it", "One night a year for each 1% held, from handover"],
    ] },
    caption: "The first pair. The comparison is of structure, and states no price or return." },
  { t: "p", x:
    "The difference that matters most is the fourth row. A holiday home's standing costs land on " +
    "you directly, whether you came or not. An estate's standing costs are paid from the estate's " +
    "own revenue, before anything reaches partners." },
  { t: "graphic", g: { kind: "waterfall" },
    caption: "The payment order: six stages, paid in sequence. Partners are paid last, after running costs, reserves and debt." },
  { t: "p", x:
    `Two of those stages answer the costs in the list above. The administration reserve takes ` +
    `${ADMIN} of revenue and keeps a bad quarter from becoming an emergency. The sinking fund ` +
    `takes ${SINKING} and replaces things before they fail.` },
  { t: "p", x:
    "The sinking fund is the structural answer to the repair that grows. A house visited rarely " +
    "finds its damp patch late. An estate with a funded renewal line and a team on the ground " +
    `finds it early. Partners receive the last stage, ${PARTNERS} of revenue, with renewal ` +
    "already paid for." },
  { t: "graphic", g: { kind: "compare", head: ["Renting a retreat", "A unit in an estate's LLP"], rows: [
      ["What you own", "Nothing; you pay for each visit", "A share of one estate"],
      ["Who pays when you are away", "Nobody", "The estate, from its revenue"],
      ["Choice of place", "A different place each time, if you like", "One estate, the same each visit"],
      ["Commitment", "None beyond each visit", "Capital, held for at least the lock-in"],
      ["Your voice", "None in how the place is run", "A vote, weighted by holding"],
      ["How you leave", "You stop going", "A sale of the position, after the lock-in"],
    ] },
    caption: "The second pair. Renting wins on freedom; the unit trades some of it for a stake." },
  { t: "p", x:
    "Renting deserves its due here. It asks for no capital and ends with no paperwork. It lets " +
    "you try a coast in January and a forest in August. For someone who wants a handful of " +
    "nights a year, it is the cleanest structure of the three." },
  { t: "p", x:
    "The unit asks for more and gives something different. It asks for capital and patience. It " +
    "gives a share of an asset, a vote on how that asset is run, and nights in a place that " +
    "becomes familiar." },
  { t: "graphic", g: { kind: "compare", head: ["Owning a holiday home", "Renting a retreat"], rows: [
      ["Capital tied up", "The whole price of a house", "None"],
      ["Standing cost", "Full, every month", "None between visits"],
      ["Who handles the roof", "You", "The owner"],
      ["What you inherit to your children", "A house, and its decisions", "Memories, and no paperwork"],
    ] },
    caption: "The third pair, completing the triangle. Each structure is best at one thing." },
  { t: "p", x:
    "Read together, the three pairs say something simple. Owning outright gives total control " +
    "and total cost. Renting gives total freedom and no stake. The LLP unit sits between. It " +
    "gives a share of the asset and a share of the decisions. Its standing cost is paid from " +
    "the estate's revenue." },
  { t: "p", x:
    "The LLP also answers the siblings on the veranda. A partnership interest is held under an " +
    "agreement that sets the rules in advance. Anyone who acquires a position takes it subject " +
    "to that agreement. A contested decision becomes a vote rather than a family call that keeps " +
    "being moved." },
  { t: "p", x:
    `The way in is deliberately simple. A holding deposit of ${DEPOSIT_INR} reserves units. ` +
    "NAVINA Structures Pvt Ltd, which forms each LLP, holds it as a fiduciary until partners are " +
    "admitted. It is refundable in full until you sign." },
  { t: "h", x: "Who governs, and how they are paid" },
  { t: "p", x:
    "A shared structure raises a fair question. If the standing costs are paid from the estate, " +
    "who decides what they are? In an estate's LLP, three parties each hold one job." },
  { t: "graphic", g: { kind: "triad" },
    caption: "The three parties to an estate, each with one job and one way of being paid." },
  { t: "p", x:
    "The partners own the estate, exclusively, through its LLP. Sensory Getaways runs it, under " +
    "a contract measured against a Service Level Agreement. NAVINA Structures Pvt Ltd forms each " +
    "LLP and governs it as Getaway Collective, its brand." },
  { t: "p", x:
    "NAVINA holds no equity in any estate. It is paid from one disclosed stage of revenue. That " +
    "separation is deliberate: the party that governs has no stake in holding costs high or " +
    "assets at a flattering value." },
  { t: "p", x:
    "The promoters, Nikhil Deshpande and Shirisha Avanchi, are NAVINA's directors and " +
    "shareholders. They invest in their own names, on the same terms as other partners. Their " +
    "units sit in the same payment order as everyone else's." },
  { t: "p", x:
    "Compare that with the holiday home. There, one person governs, runs and owns, all at once, " +
    "usually in their spare time. The structure works while that person has the energy. It " +
    "strains the moment they do not, and it passes on with the house." },
  { t: "story", title: "A family office weighs the three", x: [
    "Picture a family office in Mumbai, advising one family across three generations. The " +
    "grandparents want a place in the hills. The parents want it close enough to use. The " +
    "grandchildren want it to be somewhere they choose themselves.",
    "The adviser lays the three structures on one table. A house in the family's name gives the " +
    "grandparents certainty and gives the grandchildren, eventually, a joint decision. Renting " +
    "keeps everyone free and builds nothing to hand on.",
    "The LLP unit is the option she spends longest on. It gives the family a share of an " +
    "estate and a vote weighted by what they hold. It gives nights each year in a place run by " +
    "people whose job is running it. The standing costs are paid from the estate's revenue.",
    "She is careful in her note. She records that a unit is capital held for a lock-in, and " +
    "that the payment order pays partners last. She records that the family's nights come from " +
    "its holding, one a year for each 1% held.",
    "The family's choice is theirs. What changed is the table. For the first time, the standing " +
    "cost, the decision rule and the exit sat on the same page as the view.",
  ] },

  { t: "h", x: "The friends' version" },
  { t: "p", x:
    "Many families arrive at sharing on their own. Four friends from college buy a house in the " +
    "hills together. Each pays a quarter, each gets a quarter of the weekends. The standing cost " +
    "is divided four ways, and the division is the whole attraction." },
  { t: "p", x:
    "The sums do improve. Take the entry's illustrative lakh a month: shared four ways, it is a " +
    "quarter of a lakh each, as an illustration. The cost per night falls with it. On the " +
    "arithmetic alone, friends sharing a house beat one family holding it." },
  { t: "p", x:
    "The structure is where it strains. Four co-owners of a building must agree, unanimously, on " +
    "every act of management. A decision three want and one refuses has nowhere to go. A side " +
    "agreement helps only until one friend sells to someone who never signed it." },
  { t: "graphic", g: { kind: "compare", head: ["Co-owning with friends", "A unit in an estate's LLP"], rows: [
      ["A decision", "Needs every co-owner, unanimously", "Is a vote, weighted by holding"],
      ["Someone who buys in", "Is free of the friends' side agreement", "Takes the position subject to the LLP agreement"],
      ["Who runs the house", "Whichever friend has the time", "Sensory Getaways, under contract"],
      ["Who gets the long weekend", "Whoever asked first, or argued hardest", "Whoever has used the fewest nights that year"],
      ["If it goes wrong", "Exposure without limit", "Exposure limited to what was contributed"],
    ] },
    caption: "The friends' house and the LLP share the arithmetic of sharing. They differ in the rules." },
  { t: "p", x:
    "The LLP keeps the arithmetic of sharing and adds rules made in advance. That is its whole " +
    "case against the friends' house. Friendships are worth more than houses, and a structure " +
    "that settles disputes by vote protects both." },
  { t: "p", x:
    "The precedence rule deserves a word. Where more partners want the same dates than the " +
    "estate can hold, whoever has used the fewest nights that year goes first. Holding size and " +
    "request order play no part. Weighted voting decides money; the calendar is shared by use." },

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
  { t: "p", x:
    "The order of those answers is the point. An entry that led with the third would be selling. " +
    "Renting really is the right answer for most people who want a few nights a year. Owning " +
    "really does work for a house close enough to use often." },
  { t: "p", x:
    "Collective ownership earns its place in a narrower case. It suits someone who wants a stake " +
    "in a real asset, a voice in how it is run, and a place to return to. It suits someone " +
    "willing to share the place, the decisions and the standing cost with others." },
  { t: "illus", plate: "creek/table", caption:
    "A long table set for a shared evening, drawn for an estate held by many partners." },
  { t: "p", x:
    "Whichever answer fits, do the division first. Write down the annual cost. Write down the " +
    "nights you expect, honestly. Put one over the other. The number that comes out is the real " +
    "cost of a house you use thirty days a year." },
];
