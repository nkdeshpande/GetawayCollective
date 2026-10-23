/* J-14 · What a holding deposit does — long form, 23 Oct 2026.
   The amount, the refund term and the completion window are read from the
   register (DEPOSIT), as content/journal.ts reads them. Everything else is
   the live reserve flow or a founder ruling: NAVINA as fiduciary (15 Oct),
   KYC before allotment (8 Oct), nights per 1% (6 Oct). */
import type { Block } from "../journal";
import { inr } from "../../app/_assemblies/data";
import { DEPOSIT } from "../../app/_assemblies/slowspace";

const AMOUNT = inr(DEPOSIT.amount);

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "A deposit is the first step. Here is what it does, and what follows, in the order you meet " +
    "them." },
  { t: "p", x:
    "It is a small step on purpose. Deciding to become a partner in an estate takes time: to " +
    "read the documents, to ask questions, to talk it over at home. The deposit holds your units " +
    "while you do all three." },
  { t: "p", x:
    "This entry follows the deposit from the moment you pay it to the moment it becomes part of " +
    "a partnership, or comes back to you. It compares it with other first payments you may know. " +
    "And it tells two short stories, one for each way it can end." },
  { t: "facts", rows: [
    ["Holding deposit", AMOUNT],
    ["Paid to", "NAVINA Structures Pvt Ltd, as fiduciary"],
    ["Refund", DEPOSIT.refundable],
    ["Completion window", DEPOSIT.window],
  ] },

  { t: "h", x: "Why hold units at all" },
  { t: "p", x:
    "Each estate has a fixed number of units. Several people may be reading about the same " +
    "estate in the same week. Each of them deserves to know, accurately, what is still on offer " +
    "while they decide." },
  { t: "p", x:
    "A hold answers that. The moment you pay the deposit, the units you chose are set aside. The " +
    "offer shrinks by exactly that number, for everyone, at once. Order is kept by the simplest " +
    "rule there is: first to hold, first held." },
  { t: "p", x:
    "The hold also changes the pace for you. Before it, a careful reader might feel a quiet " +
    "pressure to commit before the units go. After it, that pressure lifts. You can take the time " +
    "a real decision deserves." },
  { t: "p", x:
    "Seen this way, the deposit protects two things at once. It protects the offer, so every " +
    "reader sees a true count. And it protects your time, so the decision you make is a " +
    "considered one." },

  { t: "h", x: "It holds your units" },
  { t: "p", x:
    "When you hold units, you choose how many you intend to take and pay one holding deposit. " +
    "It is the same at every estate, whatever the number of units. From that moment your units " +
    "are held: the next person to open the page is offered the rest." },
  { t: "figure", label: "Holding deposit", value: AMOUNT,
    source: "the vehicle register; the same at every estate, whatever the number of units" },
  { t: "p", x:
    "A word on that word, units. An estate's units are shares of its ownership. The estate's " +
    "keys are where visitors sleep. When this entry says your units are held, it means a share " +
    "of the partnership is set aside in your name." },
  { t: "p", x:
    "The deposit is a flat amount, " + AMOUNT + ", for a small position and a large one alike. It " +
    "is a fixed sum rather than a percentage of anything. A percentage would suggest the deposit " +
    "grows with the position. A single sum keeps its purpose clear: it holds a place." },
  { t: "p", x:
    "Think of a library book placed on hold. The hold sets the book aside under your name. It " +
    "keeps it off the shelf for others. It gives you time to come in and collect it. The book " +
    "becomes yours to take home only at the desk." },
  { t: "p", x:
    "A holding deposit works the same way. Your units come off the offer while you read. The " +
    "page shows them as held. Everyone else sees what remains, and the count remains honest for " +
    "every reader." },
  { t: "p", x:
    "Choosing how many units to hold is the one decision the deposit asks of you at the start. " +
    "It is a statement of intent: the number you expect to take. The deposit is the same " +
    "whichever number you choose, so the choice can follow your plans rather than the fee." },
  { t: "p", x:
    "It is worth choosing with the end in mind. Your units decide your share of the final stage " +
    "of the payment order, your weight in a vote and your nights each year. A few minutes with " +
    "those three in view makes the number easier to pick." },
  { t: "illus", plate: "creek/keys-plan", caption:
    "Four keys at Streamside Creek, drawn from above with their roof removed." },
  { t: "story", title: "Three weeks in Singapore", x: [
    "An NRI in Singapore, a software lead with family in Mysuru, had followed an estate in Coorg " +
      "for months. One evening she decided to look properly. She chose the number of units she " +
      "had in mind and paid the holding deposit.",
    "Her receipt arrived the same evening. It named the payee, NAVINA Structures Pvt Ltd, and " +
      "the units held in her name. The page now showed her units as held.",
    "Then she slowed down. She read the Vehicle Agreement on two flights and one long Sunday. She " +
      "wrote to Investor Relations with eleven questions, most about decisions and nights. She " +
      "called her brother in Bengaluru, who reads contracts for a living.",
    "The answers came back plainly. Partners vote in proportion to what they hold. Nights follow " +
      "the share: one night a year for each 1% held, from handover. Her identity checks could run " +
      "alongside, at her own pace.",
    "Three weeks after the deposit, she settled the balance and signed. Her position was entered " +
      "on the register. The deposit had done exactly one job: it had held her place while she " +
      "made up her mind.",
  ] },

  { t: "h", x: "NAVINA holds it, as a fiduciary" },
  { t: "p", x:
    "You pay the deposit to NAVINA Structures Pvt Ltd, the company that forms the estate's LLP. " +
    "NAVINA holds it as a fiduciary until the partnership is formed and its partners are " +
    "admitted. Your receipt names the payee, so you can see where the money went." },
  { t: "p", x:
    "A fiduciary holds money for someone else's benefit. The money is yours in purpose, held by " +
    "NAVINA for the reason you paid it. That reason is narrow: to hold your units until you " +
    "become a partner, or to come back to you in full." },
  { t: "p", x:
    "The receipt is the first document in your file. It names NAVINA Structures Pvt Ltd as the " +
    "payee, the estate and the units held in your name. It carries a payment reference, so any " +
    "later question about the money starts from a shared record." },
  { t: "p", x:
    "Naming the payee matters more than it might seem. Money paid to an unnamed or unclear party " +
    "is hard to follow. Money paid to a named company, for a stated purpose, can be traced from " +
    "the first rupee." },
  { t: "p", x:
    "Why NAVINA, and not the estate itself? Because each estate is a single asset in its own " +
    "LLP, and NAVINA is the company that forms it. Until that partnership is formed and its " +
    "partners admitted, NAVINA is the right party to hold the deposit on their behalf." },
  { t: "p", x:
    "NAVINA's position is worth stating fully. It forms each LLP and governs it as Getaway " +
    "Collective, its brand. It holds no equity in any estate. It is paid from one disclosed stage " +
    "of revenue, and from nowhere else." },
  { t: "p", x:
    "Its directors and shareholders are Nikhil Deshpande and Shirisha Avanchi, the promoters. " +
    "They invest in their own names, on the same terms as every other partner. The estate " +
    "belongs to its partners, exclusively." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["You", "Choose your units and pay one holding deposit"],
    ["NAVINA Structures Pvt Ltd", "Holds the deposit as fiduciary and issues your receipt"],
    ["The estate's LLP", "Formed by NAVINA; receives your capital at settlement"],
    ["The register", "Records your position once the balance is settled"],
    ["Sensory Getaways", "Runs the estate; your nights begin at handover"],
  ] }, caption: "Who does what with your money, from the deposit to the estate." },
  { t: "p", x:
    "Each party in that ladder has one role. You decide. NAVINA holds and forms. The LLP owns. " +
    "The register records. Sensory Getaways runs the estate. Keeping the roles separate makes " +
    "each one easy to check." },
  { t: "p", x:
    "The same clarity applies to how NAVINA itself is paid. Its pay comes from one disclosed " +
    "stage of the estate's revenue, once the estate is running. It sits in the published order, " +
    "where every partner can see it." },

  { t: "h", x: "Settlement makes you a partner" },
  { t: "p", x:
    "The deposit holds your place. You become a partner when the balance is settled under the " +
    "Vehicle Agreement and your position is entered on the register. Settlement is what makes a " +
    "partner." },
  { t: "pull", x: "Settlement is what makes a partner." },
  { t: "p", x:
    "This is the most important line in the entry, and the commonest misreading of any deposit. " +
    "A deposit can feel like a purchase. Money has moved and a receipt has arrived. The purchase " +
    "itself happens at settlement." },
  { t: "p", x:
    "Settlement has three parts. You pay the balance of your commitment, at the estate's " +
    "published unit price. You sign the Vehicle Agreement. And your position is entered on the " +
    "register. From that entry, you are a partner, with a partner's rights." },
  { t: "p", x:
    "Those rights are specific. You vote on the estate's decisions, weighted by what you hold. " +
    "You receive your share of the final stage of the payment order. Your liability is limited to " +
    "what you contributed. And from handover, you hold one night a year for each 1% you own." },
  { t: "p", x:
    "Why draw the line so firmly? Because a register is used to count votes and compute " +
    "distributions. Each name on it represents capital that has arrived. A clean register keeps " +
    "every partner's share exact." },
  { t: "p", x:
    "Imagine the alternative. A register that counted held units as owned would mix two kinds of " +
    "name: those whose capital has arrived and those whose capital is still a plan. Every vote " +
    "and every distribution computed from it would carry that blur." },
  { t: "p", x:
    "So the line falls at settlement, for everyone, including the promoters. Their units are " +
    "entered on the same register, on the same terms, when their capital arrives. One rule, one " +
    "register, one moment of becoming a partner." },
  { t: "graphic", g: { kind: "compare", head: ["Holding a deposit", "Holding a position"], rows: [
    ["What it is", "One payment that holds your units", "Units entered on the register"],
    ["Who holds the money", "NAVINA Structures Pvt Ltd, as fiduciary", "The estate's LLP"],
    ["A vote", "Begins at settlement", "Weighted by what you hold"],
    ["A share of the payment order", "Begins at settlement", "The final stage, in proportion"],
    ["Nights", "Begin at handover, after settlement", "One a year for each 1% held"],
    ["Coming back", "In full, until you sign", "By transfer, after the lock-in"],
  ] }, caption: "Before and after settlement: the deposit holds a place, the position holds the rights." },
  { t: "illus", plate: "creek/commons", caption:
    "The commons at Streamside Creek, drawn with its pavilion beside the arrival court." },

  { t: "h", x: "It is refundable" },
  { t: "p", x:
    DEPOSIT.refundable + " If it is refunded, the hold ends: the units are offered again, the " +
    "page records the refund, and you receive a receipt for that too." },
  { t: "p", x:
    "The refund line is plain because the decision it protects is yours. Until you sign the " +
    "Vehicle Agreement, you can change your mind for any reason. The deposit comes back in full." },
  { t: "p", x:
    "That freedom is the point of the design. A deposit that could be lost would press you to " +
    "decide quickly. A deposit that comes back in full lets you decide well. The estate gains " +
    "partners who chose it with care." },
  { t: "list", x: [
    "When can I ask for a refund? At any point until you sign the Vehicle Agreement.",
    "How much comes back? The full deposit, " + AMOUNT + ".",
    "Do I need to give a reason? The refund term asks for none.",
    "What happens to my units? The hold ends and they are offered again.",
    "What record do I receive? The page records the refund, and you receive a receipt.",
  ] },
  { t: "story", title: "A family in Pune changes course", x: [
    "A family in Pune held units in an estate after a long dinner-table conversation. The " +
      "father, a civil engineer, wanted to read the documents first. The deposit gave him the " +
      "time.",
    "Over the next fortnight, their plans shifted. Their son's admission came through at a " +
      "university abroad, with fees due sooner than expected. The family decided to keep their " +
      "savings liquid for a while.",
    "They wrote to Investor Relations to say so. The deposit came back in full. The page recorded " +
      "the refund, and they received a receipt for that too. Their units were offered again to " +
      "the next reader.",
    "A year later, with the fees settled, they looked again. The process was the same, and so " +
      "was the deposit. Their first refund had cost them nothing but a fortnight of reading.",
  ] },
  { t: "p", x:
    "Every refund leaves a record. The page notes it, and you receive a receipt. The units return " +
    "to the offer, so the count everyone sees remains accurate." },

  { t: "p", x:
    "The refund and the hold are two sides of one design. The hold gives you certainty that your " +
    "units are kept. The refund gives you freedom to let them go. Together they make the first " +
    "step safe to take early, while you are still deciding." },

  { t: "h", x: "How it compares" },
  { t: "p", x:
    "Most people have paid a first payment of some kind before. A token on a flat. Earnest money " +
    "on a plot. A security deposit on a rented home. Each holds something while the larger " +
    "transaction is arranged. The terms differ in ways worth seeing side by side." },
  { t: "graphic", g: { kind: "compare", head: ["A token on a flat", "This holding deposit"], rows: [
    ["Who receives it", "Usually the seller or developer", "NAVINA Structures Pvt Ltd, as fiduciary"],
    ["The amount", "Often a share of the price", AMOUNT + ", whatever the number of units"],
    ["If you withdraw", "Set by the seller's terms", "Refundable in full until you sign"],
    ["What it makes you", "A buyer in waiting", "A holder in waiting; settlement makes a partner"],
    ["The record", "A receipt from the seller", "A receipt naming the payee, and the page updated"],
  ] }, caption: "Two first payments, compared on terms." },
  { t: "p", x:
    "The comparison is about structure. A token on a flat is a promise between a buyer and a " +
    "seller, and its terms are whatever the two agree. This holding deposit has one set of " +
    "terms, the same for every reader at every estate." },
  { t: "p", x:
    "A security deposit on a rented home is a closer cousin in one respect. It is held against a " +
    "purpose and comes back when that purpose is met. A holding deposit is held for one purpose, " +
    "holding your units, and comes back in full if you choose to withdraw before signing." },
  { t: "p", x:
    "Earnest money on a plot of land sits close to a token on a flat. It signals seriousness to a " +
    "seller and holds the plot while papers are checked. Its terms, again, are whatever the " +
    "buyer and seller write down between them." },
  { t: "p", x:
    "The holding deposit takes the best idea from each of these. It holds something real, as a " +
    "token does. It is held for a purpose, as a security deposit is. And its terms are published " +
    "once, for every reader, so nobody negotiates their way to a better or worse version." },
  { t: "p", x:
    "Compare it, too, with putting money into a fixed deposit at a bank. A fixed deposit is the " +
    "investment itself, earning from the day it is placed. A holding deposit is a step before an " +
    "investment, holding a place while you decide." },

  { t: "h", x: "What comes next" },
  { t: "p", x:
    "You complete the balance, at the estate's published unit price, and the Vehicle Agreement " +
    "with Investor Relations. Identity checks run alongside, at your own pace. They need only " +
    "be complete before your units are allotted." },
  { t: "p", x:
    "The register sets a completion window of " + DEPOSIT.window + ". Within it, the balance, " +
    "the Vehicle Agreement and the transfer of funds are completed off the platform, with " +
    "Investor Relations." },
  { t: "p", x:
    "Investor Relations is your point of contact through all of this. It answers questions about " +
    "the estate, the documents and the process. It sends the Vehicle Agreement and receives it " +
    "signed. It confirms when your position is on the register." },
  { t: "p", x:
    "Three documents repay a careful reading before you sign. The Vehicle Agreement sets out " +
    "your rights and obligations as a partner. The estate's investment page sets out the " +
    "payment order, stage by stage. The Risk Factors set out each risk to weigh." },
  { t: "p", x:
    "Read them in that order, with a pen. Note every question, however small, and send them " +
    "together. A good answer to a small question is often the most reassuring thing in the whole " +
    "process." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Deposit", "One payment of " + AMOUNT + " holds your units"],
    ["Read, ask, decide", "Documents, questions and a conversation at home"],
    ["Sign and settle", "The balance and the Vehicle Agreement, with Investor Relations"],
    ["On the register", "Your position is entered; you are a partner"],
    ["Allotment", "Identity checks complete; your units are allotted"],
    ["Handover", "Nights begin: one a year for each 1% held"],
  ], mark: 2, markLabel: "Refundable in full until signing" }, caption:
    "The deposit's path, from the first payment to the first night." },
  { t: "story", title: "The architect who had already decided", x: [
    "A Bengaluru architect had visited the creek country many times. She knew the hills in every " +
      "season, including July. When an estate there opened its units, she had read most of the " +
      "material within a week.",
    "She paid the holding deposit on a Saturday morning. Her receipt named NAVINA Structures Pvt " +
      "Ltd as the payee and listed her units. On Monday she wrote to Investor Relations with two " +
      "questions about the payment order.",
    "The answers arrived that week. She read the Vehicle Agreement over two evenings, signed it, " +
      "and settled the balance within the completion window. Her position was entered on the " +
      "register, and she was a partner.",
    "Her identity checks were already done; she liked to finish paperwork early. Allotment " +
      "followed. For her, the deposit had held her place for a little over a week.",
    "Her pace was quick and the Singapore reader's was slower. The deposit served both equally. " +
      "It held each place for exactly as long as each decision took.",
  ] },
  { t: "p", x:
    "Identity checks deserve a note of their own. They run in parallel with everything else, at " +
    "the pace that suits you. Some readers complete them early, to have them done. Others complete " +
    "them close to allotment. Either way suits the process." },
  { t: "p", x:
    "After allotment, the estate moves towards handover. From handover, your nights begin: one " +
    "night a year for each 1% you hold. Sensory Getaways runs the estate, under the house brands " +
    "SlowSpace and ESKAPE." },
  { t: "p", x:
    "Nights follow your share directly. Hold 5%, as an illustration, and you hold five nights a " +
    "year. Hold 10%, and you hold ten. The nights are part of what settlement brings, and they " +
    "begin when the estate is handed over." },
  { t: "illus", film: ["creek", 18], caption:
    "A drawn film of the creek country at six in the evening." },
  { t: "p", x:
    "Seen whole, the path is short and orderly. One payment holds a place. Time to read follows. " +
    "Settlement makes a partner. Allotment completes the record. Handover opens the estate." },
  { t: "assert", x:
    "A deposit holds your place while you read, ask and decide." },
  { t: "p", x:
    "It helps to remember what each step is for. The deposit is for holding. The reading is for " +
    "understanding. Settlement is for joining. Allotment is for completing the record. Handover " +
    "is for arriving. Each step does one thing, in its turn." },
  { t: "p", x:
    "A good first step is one you can take calmly. This one is small, fixed and refundable in " +
    "full until you sign. It is held by a named company, for a narrow purpose, with a receipt " +
    "at each end." },
  { t: "p", x:
    "That is the whole of its job. It holds, it is held with care, and it comes back in full if " +
    "you choose. Everything that makes you a partner happens at settlement, when you are ready." },
];
