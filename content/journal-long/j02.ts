/**
 * J-02 · The payment order, read from the bottom — the long form.
 * Journal 5x, 23 Oct 2026. Every stage figure is read from WATERFALL,
 * as content/journal.ts does, so the prose cannot drift from the register.
 */
import type { Block } from "../journal";
import { WATERFALL } from "../../app/_assemblies/data";

const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
/** Rupees out of an illustrative ₹100 of revenue. */
const of100 = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "").replace(/\.50$/, ".5");

const OPCO = WATERFALL[1].bps;
const BRAND = WATERFALL[2].bps;
const ADMIN = WATERFALL[3].bps;
const SINK = WATERFALL[4].bps;
const DEBT = WATERFALL[5].bps;
const PARTNERS = WATERFALL[6].bps;
const ABOVE_PARTNERS = OPCO + BRAND + ADMIN + SINK + DEBT;
const SHARE_STAGES = OPCO + BRAND + ADMIN + SINK;

/* An illustrative quiet quarter: ₹70 of revenue against the same fixed
   instalment. Labelled as illustrative wherever it appears. */
const THIN = 70;
const fmt = (n: number) => n.toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
const thinShare = fmt((THIN * SHARE_STAGES) / 10000);
const thinPartners = fmt(THIN - (THIN * SHARE_STAGES) / 10000 - DEBT / 100);

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "Revenue reaches an estate as one number and leaves as six. This sequence is the payment " +
    "order, also called the waterfall. Each stage is paid in full before the next, and the six " +
    "add up to the whole. There is no seventh stage." },
  { t: "figure", label: "To partners", value: pct(PARTNERS),
    source: "Stage six, read directly from the payment-order register." },
  { t: "p", x:
    "Most readers start at the top of a payment order and read down, the way the page is " +
    "printed. This entry asks you to do the opposite. Start at the last line, your own, and " +
    "look up at everything that is paid before you." },
  { t: "p", x:
    "The reason is simple. Every stage above yours is a claim on the same rupee you hope to " +
    "receive. The order in which those claims are met decides what reaches you. A partner who " +
    "understands the order understands the investment." },
  { t: "p", x:
    "This is also the page most often skimmed. It looks like accounting, and it sits deep in " +
    "the papers. We put it near the front, and we wrote this entry, because it repays ten " +
    "minutes of attention more than any other page." },
  { t: "graphic", g: { kind: "waterfall" },
    caption: "The six stages, drawn from the register, in the order they are paid." },

  { t: "h", x: "The order is the disclosure" },
  { t: "p", x:
    "A document can list the six stages honestly and still mislead, by showing them as a set " +
    "rather than a sequence. Percentages that add up to a hundred look like a division of the " +
    "whole. They are a queue, and where you stand in it decides whether you are paid at all in " +
    "a bad year." },
  { t: "pull", x:
    "They are a queue, and where you stand in it decides whether you are paid at all in a bad year." },
  { t: "p", x:
    "A pie chart says everyone eats at once. A queue says some people eat first. Both can carry " +
    "the same six numbers. Only one of them tells you what happens when there is less food." },
  { t: "p", x:
    "Think of a wedding lunch in a family home. The elders are served first, then the bride's party, " +
    "then everyone else, and the cooks eat last. In a year with plenty, nobody " +
    "notices the order. In a lean one, the order is all that matters." },
  { t: "story", title: "Two ways to read one page", x: [
    "Picture a family in Pune reading an estate's papers at the dining table. The father is a " +
    "retired engineer. The daughter works in a Mumbai bank's credit team. The page in front of " +
    "them lists six stages with their percentages.",
    "The father reads it as a pie. He sees " + pct(PARTNERS) + " to partners and divides it by " +
    "the units. He likes the size of the slice, and he says so.",
    "The daughter reads it as a queue. Her job is lending, and lenders always ask who is paid " +
    "first. She points to stage five, Debt Service, sitting above the partners. She asks what " +
    "the estate owes the bank each quarter, in rupees.",
    "Neither of them has misread the numbers. They have read two different shapes. Hers is the " +
    "shape the money actually takes. His is the shape it takes only in a year when everything " +
    "goes to plan.",
    "They agree to read it her way first, and his way second. That is the method this entry " +
    "recommends to every reader.",
  ] },
  { t: "graphic", g: { kind: "compare",
    head: ["Read as a set", "Read as a queue"],
    rows: [
      ["What it suggests", "Everyone shares the whole at once", "Each stage is paid in full before the next"],
      ["In a strong year", "Every share looks as printed", "Every stage is paid, down to the last"],
      ["In a thin year", "Every share looks smaller, equally", "The early stages are paid; the last waits"],
      ["The question it answers", "How big is my slice?", "What must be paid before me?"],
    ] },
    caption: "The same six figures, in two shapes. The second is how the money moves." },
  { t: "assert", x:
    "A share described as the partners', with a note that it also repays borrowing, belongs " +
    "partly to the bank. And the bank is paid first." },

  { t: "h", x: "Walking a hundred rupees down the stages" },
  { t: "p", x:
    "The clearest way to see a queue is to follow one sum through it. Take ₹100 of revenue, as " +
    "an illustration, and walk it down the six stages in the worked example." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["₹100 arrives", "Operating revenue for the period, before any claim"],
    ["1 · Operating Partner · ₹" + of100(OPCO), "Sensory Getaways, contracted to run the estate and measured on Service Level"],
    ["2 · Brand · ₹" + of100(BRAND), "NAVINA Structures, which governs each LLP as Getaway Collective"],
    ["3 · Admin reserve · ₹" + of100(ADMIN), "Filings, audit and administration, with a floor"],
    ["4 · Sinking fund · ₹" + of100(SINK), "Renewal paid for before anything fails"],
    ["5 · Debt Service · ₹" + of100(DEBT), "The bank, which is paid before partners"],
    ["6 · To partners · ₹" + of100(PARTNERS), "What remains, shared by units held"],
  ] },
    caption: "An illustrative ₹100 through the worked example's payment order." },
  { t: "p", x:
    "Stage one pays the people who run the estate. That is the largest claim, at " + pct(OPCO) +
    ". It pays for the work that produces revenue in the first place, so it sits first." },
  { t: "p", x:
    "Stage two is the brand, at " + pct(BRAND) + ". It pays NAVINA Structures Pvt Ltd, which " +
    "forms and governs each estate's LLP as Getaway Collective, its brand. NAVINA holds no " +
    "equity, so this one stage is the whole of what it earns from an estate." },
  { t: "p", x:
    "Stages three and four are the quiet ones, at " + pct(ADMIN) + " each. They come back later " +
    "in this entry, because they matter more than their size suggests." },
  { t: "p", x:
    "Notice what the first two stages have in common. Each pays a party for work done for the " +
    "estate, and each is a share of revenue. When revenue rises, both rise with it. When it " +
    "falls, both fall. Their interests move in step with the partners' own." },
  { t: "p", x:
    "That is deliberate. A fixed fee would pay the operator and the governor the same in a " +
    "poor year as in a good one. A share of revenue asks them to earn more by making the " +
    "estate earn more." },
  { t: "p", x:
    "Stage five is Debt Service, at " + pct(DEBT) + " in the worked example. Stage six is what " +
    "partners share, at " + pct(PARTNERS) + ". Together the six close to exactly one hundred " +
    "per cent. The register checks that sum every time it loads." },
  { t: "p", x:
    "That check matters more than it sounds. A payment order whose stages add to more than the " +
    "whole promises money that does not exist. One whose stages add to less leaves a gap that " +
    "someone, somewhere, quietly fills. Ours closes exactly, by design and by test." },
  { t: "p", x:
    "Read top to bottom, the ladder tells a story about priorities. People first, then the rules, " +
    "then the buildings, then the bank, then the owners. Every stage above the owners exists " +
    "so that the owners have something to own." },

  { t: "h", x: "Why this order, and not another" },
  { t: "p", x:
    "Every stage could, in principle, sit somewhere else. Each sits where it does for a reason " +
    "that can be stated in a sentence. Reading those reasons is the best way to judge whether " +
    "the order is fair." },
  { t: "list", x: [
    "The operating partner is paid first because its work produces the revenue. An estate that " +
    "stops paying the people running it soon has nothing to divide.",
    "The brand is paid second because governance has to continue in every season. NAVINA holds " +
    "no equity, so it has no other source of income from the estate.",
    "The admin reserve comes third so that filings, audit and administration are met before " +
    "any surplus is counted.",
    "The sinking fund comes fourth so that renewal is paid for before income is declared.",
    "Debt service comes fifth because a lender requires it. Banks lend to estates on the " +
    "condition that they are repaid ahead of the owners.",
    "Partners come last because partners own the estate. Ownership means sharing what is left " +
    "after every claim, with the upside and the swings that brings.",
  ] },
  { t: "p", x:
    "Seen this way, the order is less a hierarchy of importance than a sequence of " +
    "dependencies. Each stage protects the ones below it. Partners at the bottom are the reason " +
    "the other five exist." },
  { t: "p", x:
    "Some structures place an extra claim above partners, often called a preferred return or a " +
    "carry. Ours has neither. Stage six is shared by units held, with no catch-up and nothing " +
    "taken off the top by the governor." },

  { t: "h", x: "The senior claim sits just above you" },
  { t: "p", x:
    "Stage five deserves its own section, because it sits directly above the partners. A " +
    "senior claim is one that is paid before others. Here, the bank's instalment is senior to " +
    "everything partners receive." },
  { t: "p", x:
    "The worked example shows Debt Service as a share of revenue, for ease of reading. A loan " +
    "instalment is a sum owed under the bank facility. So read stage five as a claim in rupees, " +
    "and stage six as whatever revenue leaves after it." },
  { t: "p", x:
    "That is why the daughter in the story asked her question in rupees. In a strong year, the " +
    "instalment is a modest part of revenue and partners receive a full share. In a thinner " +
    "year, the same instalment takes a larger part, and stage six absorbs the difference." },
  { t: "p", x:
    "Work it through with round numbers, as an illustration only. In a strong quarter, say " +
    "revenue is ₹100. The first four stages take ₹" + of100(SHARE_STAGES) + ", the bank takes " +
    "₹" + of100(DEBT) + ", and partners share ₹" + of100(PARTNERS) + "." },
  { t: "p", x:
    "Now say a quiet quarter brings ₹" + THIN + " instead. The first four stages, being shares " +
    "of revenue, fall with it to ₹" + thinShare + ". The bank's instalment is unchanged at ₹" +
    of100(DEBT) + ". Partners share ₹" + thinPartners + "." },
  { t: "graphic", g: { kind: "compare",
    head: ["A strong quarter", "A quiet quarter"],
    rows: [
      ["Revenue, illustrative", "₹100", "₹" + THIN],
      ["Stages one to four", "₹" + of100(SHARE_STAGES), "₹" + thinShare],
      ["Debt Service, a sum owed", "₹" + of100(DEBT), "₹" + of100(DEBT)],
      ["To partners", "₹" + of100(PARTNERS), "₹" + thinPartners],
    ] },
    caption: "Illustrative figures only. Revenue falls by " + (100 - THIN) + "%; the partners' line falls by more." },
  { t: "p", x:
    "Revenue fell by " + (100 - THIN) + " per cent in that example. The partners' line fell by " +
    "more, because the bank's sum held fixed above it. That is what standing last means, in " +
    "one table. The same arithmetic runs in reverse when revenue rises." },
  { t: "graphic", g: { kind: "compare",
    head: ["A bank depositor", "A partner in an estate LLP"],
    rows: [
      ["Where you stand", "First: the bank owes you a stated sum", "Last: you share what remains"],
      ["In a strong year", "The same stated sum", "A larger share, as revenue rises"],
      ["In a thin year", "The same stated sum", "A smaller share, after every stage above"],
      ["What you own", "A claim on the bank", "Part of a real estate, through the LLP"],
    ] },
    caption: "Standing first in a queue and standing last are different kinds of position." },
  { t: "p", x:
    "Neither position is better in itself. Standing first buys certainty and caps what you can " +
    "receive. Standing last carries the swings, and shares in the upside. The payment order " +
    "simply tells you which one you hold." },
  { t: "story", title: "Two estates, one question", x: [
    "Imagine a family office in Mumbai comparing two hospitality offers. Both show a share to " +
    "investors that looks generous. Both list their stages neatly, adding to a hundred.",
    "The analyst does the exercise this entry describes. She finds the investors' line on each " +
    "page and counts upward. On the first, Debt Service sits above investors in plain view.",
    "On the second, she cannot find Debt Service at all. After some reading, she finds a " +
    "footnote. The investors' share, it says, is also used to repay the loan.",
    "So the second offer's generous line is partly the bank's. The two pages showed the same " +
    "headline percentage, and described quite different positions.",
    "She writes one line in her note to the family. Ask every sponsor where the bank sits, and " +
    "ask to see it as its own stage.",
  ] },

  { t: "h", x: "The two stages worth understanding" },
  { t: "p", x:
    "The administration reserve and the sinking fund each take two and a half per cent of " +
    "revenue. They are the quietest stages, and the most worth understanding." },
  { t: "p", x:
    "The reserve keeps a bad quarter from becoming an emergency. It has a floor, and stage six " +
    "pays only once the floor is met. So a partner can have a profitable quarter and receive " +
    "nothing. That is the reserve protecting the position, as designed." },
  { t: "story", title: "A quiet monsoon quarter", x: [
    "Imagine an NRI partner in Singapore opening her quarterly statement. The estate traded " +
    "well. Revenue covered every stage above hers, and the quarter shows a profit.",
    "The distribution line reads zero. Her first reaction is surprise, and her second is to " +
    "read the note beside it.",
    "Two quarters earlier, the estate drew on its reserve to repair storm damage to a " +
    "boardwalk. The reserve fell below its floor. This quarter's surplus went to refill it, " +
    "before anything reached stage six.",
    "She thinks about her own household. She keeps an emergency fund, and after a hospital " +
    "bill she refills it before planning a holiday. The estate is doing the same thing, by a " +
    "written rule rather than by willpower.",
    "The next quarter, with the reserve back above its floor, stage six pays again. Her " +
    "position is intact, and the boardwalk is mended.",
  ] },
  { t: "p", x:
    "A zero in a profitable quarter can feel like a failure. Read the other way, it is the " +
    "reserve doing its job. The money has remained inside the estate, in a buffer that protects " +
    "every partner's position, including yours." },
  { t: "p", x:
    "The floor also works in your favour in a way that is easy to miss. It stops any one " +
    "season from draining the buffer to pay a distribution. A partner who joins later inherits " +
    "an estate with its cushion intact." },
  { t: "p", x:
    "The sinking fund replaces things before they fail. It keeps distributions honest: what " +
    "partners receive is income, with renewal already paid for." },
  { t: "p", x:
    "Every building wears out on a timetable. Mattresses, pumps, decks, roofs and kitchens each " +
    "have a life. An owner who ignores that timetable reports a fine income until the day the " +
    "roof goes. Then years of income turn out to have been borrowed from the roof." },
  { t: "p", x:
    "A sinking fund spreads that cost across the years that wear the roof out. Each quarter " +
    "pays a small, steady share. When the replacement falls due, the money is already there, " +
    "and partners' income in that year is untouched." },
  { t: "p", x:
    "There is a fairness point too. Partners come and go over an estate's life. Without a " +
    "sinking fund, whoever holds units in the year of a big repair pays for wear that earlier " +
    "partners enjoyed. With one, each year pays for its own share of wear." },
  { t: "graphic", g: { kind: "compare",
    head: ["A holiday home", "An estate with a sinking fund"],
    rows: [
      ["When the roof wears out", "The owner pays from savings, that year", "The fund pays, from years of small set-asides"],
      ["What the income figure means", "Income, before the roof", "Income, with renewal already paid for"],
      ["Who decides when to replace", "Whoever notices the leak", "A schedule, funded in advance"],
    ] },
    caption: "Two ways to pay for a roof. One shows up in the income as it is earned." },
  { t: "facts", rows: [
    ["6", "stages, paid in a fixed order"],
    [pct(ADMIN), "to the admin reserve"],
    [pct(SINK), "to the sinking fund"],
    [pct(DEBT), "to Debt Service, in the worked example"],
    [pct(PARTNERS), "to partners, at stage six"],
  ] },

  { t: "h", x: "One quarter, start to finish" },
  { t: "p", x:
    "Put the stages together and a quarter reads like a short sequence of checks. Each check " +
    "happens in the same order every time, whoever is reading and whatever the result." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Revenue arrives", "The quarter's operating revenue, before any claim"],
    ["Stages one to four", "Operator, brand, admin reserve and sinking fund"],
    ["Stage five", "Debt service, paid to the bank in full"],
    ["The floor check", "Is the reserve at or above its floor?"],
    ["Stage six", "What remains is shared by units held"],
  ] , mark: 3, markLabel: "Stage six pays only past this check" },
    caption: "The order of a quarter. The floor check is where a profitable quarter can still pay nothing." },
  { t: "p", x:
    "Each quarter pays what it earns. A quarter that earns less pays less. Smoothing good and " +
    "bad quarters together would make the record look calmer and read less true." },
  { t: "p", x:
    "The reserve is kept for capital events, such as a storm repair or a lean season. It is " +
    "a buffer for the estate, rather than a tool for evening out distributions. That keeps " +
    "each quarter's statement a faithful picture of that quarter." },
  { t: "p", x:
    "A partner who wants a smooth income can build one at home, by setting aside part of a " +
    "strong quarter for a quiet one. The estate leaves that choice with each partner, rather " +
    "than making it for all of them at once." },
  { t: "p", x:
    "Expect, then, a pattern that follows the seasons. Busy months tend to pay more, and quiet " +
    "months less. Over a year, the statements read like the estate's own diary, quarter by " +
    "quarter." },

  { t: "h", x: "Reading it backwards" },
  { t: "p", x:
    "Read any payment order from the bottom. Start at your own stage, then count what must be " +
    "paid above you. For a partner in an estate carrying debt, five stages come first." },
  { t: "p", x:
    "In the worked example, those five stages take " + pct(ABOVE_PARTNERS) + " of revenue " +
    "before partners see any. Knowing that number is the first step. Knowing which of the five " +
    "are fixed sums, and which move with revenue, is the second." },
  { t: "p", x:
    "The method works on any document, not only ours. Take it to a REIT's prospectus, a " +
    "restaurant partnership or a family business. The questions are the same, and they take a " +
    "few minutes." },
  { t: "p", x:
    "You already use it at home, without the name. A salaried household pays tax first, then " +
    "the loan instalment, then the bills, then savings. What remains is the family's to spend. " +
    "Nobody plans a holiday from gross salary." },
  { t: "p", x:
    "An estate is no different. Gross revenue is the salary. The payment order is the list of " +
    "what must be met first. Stage six is what remains for the owners, and it is the only line " +
    "a partner can actually receive." },
  { t: "p", x:
    "The comparison also explains why gross revenue makes a poor headline. A busy estate with " +
    "heavy claims above partners can pay its owners less than a quieter one with lighter " +
    "claims. Revenue tells you how the estate trades. Stage six tells you what it means for you." },
  { t: "list", x: [
    "Where is my stage in the order, counting from the top?",
    "Which stages above me are a share of revenue, and which are sums owed?",
    "Is there a floor, a reserve or a test that must be met before my stage pays?",
    "What pays for renewal, and is it set aside before my share is counted?",
    "Does the order add up to exactly the whole, with nothing paid outside it?",
  ] },
  { t: "p", x:
    "If a document answers all five plainly, you can read its percentages with confidence. If " +
    "it answers them only when asked, read it again, slowly." },
  { t: "p", x:
    "Here are our own answers, for reference. Partners are at stage six, the last. Above them, " +
    "Debt Service is a sum owed to the bank; the other four are shares of revenue. The reserve " +
    "has a floor that must be met first. The sinking fund pays for renewal before partners' " +
    "share is counted. And the six stages close to exactly the whole." },
  { t: "illus", film: ["coast", 7], caption:
    "Morning on the coast: revenue arrives as one number, and the payment order decides where it goes." },
  { t: "p", x:
    "The payment order is the most important page in any estate's papers. It is short, it is " +
    "fixed, and it holds in every season. Read it from the bottom, once, and the rest of " +
    "the papers become easier to read." },
  { t: "p", x:
    "A last thought, for readers comparing estates. Two estates can share the same six " +
    "stages and still differ in what reaches partners. The difference usually lies in stage " +
    "five: how much the estate borrowed, and on what terms. Ask about that stage first." },
  { t: "p", x:
    "An estate with less borrowing has a lighter claim above partners, and a steadier last " +
    "line. An estate with more borrowing can build sooner or larger, with a heavier claim to " +
    "carry. Neither is right for everyone. The payment order shows you which one you are " +
    "reading, and that is all a page can honestly do." },
];
