/**
 * J-03 · What settlement changes — the long form.
 * Journal 5x, 23 Oct 2026. Figures: the fifteen working days and the
 * three-second commit are this entry's own; the holding deposit is read
 * from DEPOSIT, as content/journal.ts does.
 */
import type { Block } from "../journal";
import { inr } from "../../app/_assemblies/data";
import { DEPOSIT } from "../../app/_assemblies/slowspace";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "On many platforms, pressing a button is the event. A screen congratulates you and calls " +
    "you an owner from that moment." },
  { t: "p", x:
    "It feels generous, and it is easy to build. It is also untrue for a few days, sometimes " +
    "for a few weeks. The money has left your account, travelled through banks, and reached the " +
    "vehicle only later." },
  { t: "assert", x:
    "Here, your position changes when cleared funds reach the LLP. Before settlement you have " +
    "an obligation. After it you have the rights of a partner, and the change is final, for " +
    "you, for us and for every other partner." },
  { t: "p", x:
    "This entry follows that moment closely. It sets out what comes before it, what changes at " +
    "it, and why the platform waits for it rather than rounding it forward." },
  { t: "p", x:
    "It may seem a small point, a matter of a few days and a change of label. In practice it " +
    "decides whether every vote, every distribution and every allocation of nights is counted " +
    "correctly. Small points that everything depends on deserve careful handling." },

  { t: "h", x: "The path, in the order you meet it" },
  { t: "p", x:
    "Becoming a partner happens in a few distinct steps. Each one carries a different set of " +
    "rights, and the screen names each one as you reach it." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Holding deposit", inr(DEPOSIT.amount) + " to NAVINA, as fiduciary; your units are held"],
    ["Vehicle Agreement signed", "The commitment becomes binding"],
    ["Committed", "Capital promised; up to fifteen working days to settle"],
    ["Settlement", "Cleared funds reach the estate's LLP"],
    ["Member", "Vote, distributions and nights, from here"],
  ], mark: 3, markLabel: "Final from here" },
    caption: "Five steps from interest to partnership. The register changes at one of them." },
  { t: "p", x:
    "The first step is the holding deposit. You choose how many units you intend to take and " +
    "pay " + inr(DEPOSIT.amount) + ". The same sum applies at every estate, whatever the number " +
    "of units." },
  { t: "p", x:
    "You pay it to NAVINA Structures Pvt Ltd, the company that forms each estate's LLP. NAVINA " +
    "holds it as a fiduciary until the partnership is formed and its partners are admitted. " +
    DEPOSIT.refundable },
  { t: "p", x:
    "Identity checks run alongside, at your own pace. They need only be complete before your " +
    "units are allotted. The deposit gives you time to read, ask and decide." },
  { t: "p", x:
    "This first step is deliberately light. It holds your place without asking you to commit " +
    "your whole sum. The next person to open the estate's page is offered the units that " +
    "remain. Your hold is real, and so is your freedom to change your mind." },
  { t: "p", x:
    "If you decide against going further before you sign, the deposit comes back in full. The " +
    "hold ends, the units are offered again, and you receive a receipt for the refund as you " +
    "did for the payment." },
  { t: "p", x:
    "Then you sign the Vehicle Agreement and commit. From this point you have an obligation: " +
    "capital promised to the estate. You also have a pending position, shown as pending, " +
    "everywhere it appears." },
  { t: "p", x:
    "Settlement follows. Your cleared funds reach the estate's LLP, your position enters the " +
    "register, and you become a partner. That last step is the subject of everything below." },

  { t: "h", x: "Why the gap is shown" },
  { t: "p", x:
    "Between commitment and settlement there is a window of up to fifteen working days. In it, " +
    "you have promised capital and your position is pending." },
  { t: "p", x:
    "The window exists because money takes time to move properly. A large transfer may pass " +
    "through more than one bank. Each bank runs its own checks. Funds from a matured deposit, a " +
    "sale of shares or an account abroad each arrive on their own timetable." },
  { t: "p", x:
    "Fifteen working days is the outer limit. Many settlements will take far less. The limit " +
    "gives every partner a fair, stated period, and gives the estate a date by which it knows " +
    "where it stands." },
  { t: "p", x:
    "During the window, the estate treats your commitment as exactly what it is. Your units " +
    "are set aside for you, so nobody else can take them. They are also kept off the register, " +
    "so nobody counts them yet." },
  { t: "p", x:
    "That double treatment is the heart of the design. Your place is protected, and the " +
    "register is protected. Neither is traded away to make the other look tidier." },
  { t: "p", x:
    "For most partners, the window passes quietly. The funds are sent, they clear, and the " +
    "screen changes. For a few, a bank asks a question or a transfer needs resending. The " +
    "window allows for that, without anyone else's count being disturbed." },
  { t: "story", title: "A transfer from Singapore", x: [
    "Picture an engineer from Pune who now lives in Singapore. She commits to units in an " +
    "estate near her parents' home on a Monday evening, after the children are asleep.",
    "Her money sits in a Singapore account. Her bank asks for a purpose code and a note on the " +
    "receiving entity. The Indian bank on the other side runs its own checks on the inward " +
    "remittance.",
    "Through all of this, her screen in the app reads Committed. It names the amount, the " +
    "estate and the date by which settlement is due. It tells her, plainly, that her vote and " +
    "her nights begin at settlement.",
    "On the ninth working day, the funds clear into the estate's LLP. The screen changes to " +
    "Member. Her parents, who have been asking all week, receive a photograph of it.",
    "Nothing about her position was ambiguous along the way. She always knew which state she " +
    "was in, and so did every other partner.",
  ] },
  { t: "p", x:
    "Calling you a partner early would make the register wrong. A register that lists people " +
    "whose money has not arrived is a register that cannot be used to compute a vote or a " +
    "distribution." },
  { t: "pull", x:
    "A register that lists people whose money has not arrived is a register that cannot be used to compute a vote or a distribution." },
  { t: "p", x:
    "A register is the list of who owns what. Everything an LLP does with its partners reads " +
    "from it. Votes are weighted by it. Distributions are divided by it. Nights are allocated " +
    "from it. Notices are sent to it." },
  { t: "p", x:
    "Each of those calculations assumes every name on the list has paid. Add one name early, " +
    "and every share on the list is slightly wrong. Every vote count and every distribution " +
    "built on it inherits the error." },
  { t: "story", title: "The vote that counted a promise", x: [
    "Picture an estate LLP with a decision to take in the same week a new partner commits. A " +
    "Bengaluru founder has signed for a sizeable position, and his funds are on their way from " +
    "a fixed deposit that matures on Friday.",
    "Suppose the platform listed him as a partner the moment he pressed the button. The vote " +
    "closes on Thursday. His units are counted, and they tip the result.",
    "On Friday his bank holds the transfer for a routine check. It clears a week later, then " +
    "fails on a mismatched account name. He fixes it and sends the money again.",
    "The decision has already been recorded. The partners who lost the vote ask a fair " +
    "question: were his units real on Thursday? The honest answer is that they were a promise.",
    "Now play the same week by the rule this platform follows. His position shows as " +
    "committed. The Thursday vote counts only settled units. His money arrives when it arrives, " +
    "and he votes on the next decision as a full partner.",
    "Nobody is wronged, and nobody has to revisit a result. The rule felt slower for one week " +
    "and saved everyone a dispute.",
  ] },
  { t: "graphic", g: { kind: "compare",
    head: ["Committed", "Member"],
    rows: [
      ["What you hold", "An obligation to pay", "A position on the register"],
      ["Your vote", "Begins at settlement", "Counted, weighted by share"],
      ["Distributions", "Begin at settlement", "Paid at stage six, by units held"],
      ["Nights", "Begin at settlement", "One night a year for each 1% held, from handover"],
      ["When it becomes final", "At settlement", "Final, for you and for every partner"],
    ] },
    caption: "Two states, side by side. The screen always tells you which one you are in." },

  { t: "h", x: "What you see on screen" },
  { t: "p", x:
    "After you commit, the screen says Committed. It states plainly that your vote and your " +
    "nights begin at settlement. The screen that says Member comes later, and reaching it is an " +
    "event." },
  { t: "p", x:
    "We designed it that way on purpose. Most investment screens reward the click, because the " +
    "click is what they measure. We reward the settlement, because the settlement is what " +
    "changes your rights." },
  { t: "p", x:
    "So the Committed screen is calm and factual. It shows the amount, the estate, the date and " +
    "the window. It tells you what happens next and what you need to do, if anything." },
  { t: "p", x:
    "The Member screen arrives once the funds clear. It names you as a partner and shows your " +
    "position as the register records it. From that moment your vote counts and your nights " +
    "are yours, from handover." },
  { t: "illus", plate: "confluence/veranda", caption:
    "A veranda at Seaside Confluence, drawn before construction: the place a settled position opens onto." },

  { t: "p", x:
    "Both screens carry the same facts in the same places. Only the state changes. That " +
    "consistency is intentional. You can always tell which state you are in from the facts on " +
    "the page, without reading its tone." },
  { t: "p", x:
    "We also chose words with care. Committed means what it says: you have made a binding " +
    "promise. Member means what it says: you are on the register. Neither word is used for the " +
    "other, anywhere on the platform." },
  { t: "p", x:
    "Some readers ask why there is no celebration at the commit step. The answer is that " +
    "celebrating a promise invites the reader to treat it as the finished thing. We save the " +
    "moment of arrival for the moment you actually arrive." },
  { t: "p", x:
    "When that moment comes, it is worth marking. The Member screen is the one partners " +
    "remember. It is the first time the platform calls you a partner, and it does so because " +
    "the register now agrees." },

  { t: "h", x: "What begins at settlement" },
  { t: "p", x:
    "Settlement is a single moment, and a surprising number of things begin at it. Each one " +
    "reads from the register, which is why each one waits for the register to be true." },
  { t: "list", x: [
    "Your name enters the register of partners, with the units you hold.",
    "Your vote counts, weighted by your share, on every matter put to partners.",
    "You share in stage six of the payment order, by units held.",
    "Your nights are yours: one a year for each 1% held, from handover.",
    "Your quarterly distributions begin, paid in the same order as every partner's.",
    "After the lock-in, you may offer units to others on the private noticeboard.",
  ] },
  { t: "p", x:
    "Before settlement, none of these apply, and the screen says so. After it, all of them " +
    "apply together. There is no partial membership, and no state in between." },
  { t: "p", x:
    "This all-at-once quality is a kindness to everyone who has to count. Those running the " +
    "votes, preparing the statements and allocating nights each read one list. They never have " +
    "to ask whether a name is real." },
  { t: "p", x:
    "It is also a kindness to you. On the day you settle, you can see exactly what you hold " +
    "and exactly what it entitles you to. Your rights arrive together, and they arrive in full." },

  { t: "h", x: "How other arrangements handle the moment" },
  { t: "p", x:
    "Every way of owning something has a moment of transfer. Comparing a few helps show why " +
    "this one is drawn so firmly." },
  { t: "list", x: [
    "Buying land: you pay, then the sale deed is registered. Ownership follows registration, " +
    "and the paper trail shows the date clearly.",
    "Buying shares on an exchange: the trade happens in a moment, and settlement follows a " +
    "short time later. The shares reach your account at settlement.",
    "Buying a concert ticket: the click is the event, because the seat is all you bought. " +
    "Nothing else depends on your name being on a list.",
    "Joining an estate LLP: you commit, then settle. Your name enters the register when the " +
    "funds clear, because votes and distributions depend on it.",
  ] },
  { t: "p", x:
    "The pattern is consistent. Wherever other people rely on the list of owners, the list " +
    "waits for the money. Settlement is the name for that wait." },
  { t: "graphic", g: { kind: "compare",
    head: ["A platform that counts the click", "A platform that counts settlement"],
    rows: [
      ["When you are called an owner", "The moment you press the button", "When cleared funds reach the LLP"],
      ["What the register shows", "Names, some with money still in transit", "Only names whose money has arrived"],
      ["A vote in the gap", "May count promises as units", "Counts settled units only"],
      ["If a transfer fails", "Results may need revisiting", "Nothing to revisit; the register was true"],
    ] },
    caption: "Two ways to mark the moment. Only one keeps every count on the register true." },
  { t: "p", x:
    "Land offers the closest parallel in Indian life. Many families have paid for a plot, " +
    "received a receipt, and waited for registration. Until the deed is registered, the receipt " +
    "is evidence of a promise. Registration is the event that makes you the owner." },
  { t: "p", x:
    "Settlement plays the same role here. The commitment is your receipt. Settlement is your " +
    "registration. The platform simply refuses to blur the two, because so much depends on the " +
    "difference." },

  { t: "h", x: "Why settlement is final" },
  { t: "p", x:
    "Other partners rely on your commitment. If a settled position could be unwound, every " +
    "quorum would be provisional, and every distribution would rest on a register that might " +
    "change." },
  { t: "p", x:
    "Think of a partner who settles, votes on a decision, and receives a distribution. A month " +
    "later he asks for his money back. If that were possible, the vote would need recounting " +
    "and the distribution recalculating, for everyone." },
  { t: "p", x:
    "Finality protects each partner from every other partner's change of heart. It is the same " +
    "promise, given by everyone, to everyone. Your position is safe from their second thoughts " +
    "because theirs is safe from yours." },
  { t: "p", x:
    "Imagine the alternative from the estate's side. A lender asks for the list of partners " +
    "and the capital they have contributed. If that list could shrink at any moment, the lender " +
    "would have to treat it as uncertain, and so would everyone relying on it." },
  { t: "p", x:
    "Finality lets the estate make commitments of its own. It can sign with contractors, draw " +
    "on its bank facility and plan its build, knowing the capital behind it is settled." },
  { t: "p", x:
    "There is a personal side to finality too. Once settled, your position does not depend on " +
    "anyone else's mood, timing or circumstances. A partner who later regrets their decision " +
    "cannot pull the estate's capital out from under you." },
  { t: "p", x:
    "In that sense, finality is less a restriction on you than a promise made to you. Every " +
    "other partner has given it. When you settle, you give it in return, and the register " +
    "becomes something all of you can build on." },
  { t: "p", x:
    "Leaving remains possible, by a different door. After the lock-in, a partner can offer " +
    "units on the private noticeboard, which fellow partners see first. That is a sale between " +
    "partners, and the register records it as one." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Before you sign", "Read, ask and decide; the deposit is refundable in full"],
    ["At commitment", "The obligation becomes binding"],
    ["At settlement", "You become a partner, and the change is final"],
    ["After the lock-in", "You may offer units to others on the noticeboard"],
  ] },
    caption: "Each door, and when it opens. The time to deliberate comes first." },

  { t: "h", x: "The moment to deliberate" },
  { t: "p", x:
    "So the moment to deliberate comes before you commit. The commit control takes three " +
    "seconds of steady pressure, and the amount remains on screen throughout." },
  { t: "p", x:
    "Three seconds is a small thing. It is long enough to read the figure once more, and short " +
    "enough to respect a decision already made. A tap can happen by accident. A held press " +
    "rarely does." },
  { t: "p", x:
    "The real deliberation happens long before those three seconds. The holding deposit gives " +
    "you time for it, and you can use that time however suits you. Many readers find a short " +
    "list helps." },
  { t: "list", x: [
    "Read the payment order from the bottom, and count what is paid before partners.",
    "Read the estate's figures with their confidence class, and note which are forecasts.",
    "Read the Vehicle Agreement, and ask Investor Relations about anything unclear.",
    "Decide how many units suit you, and check the amount against your own plans.",
    "Arrange the funds, so that settlement falls comfortably within the window.",
  ] },
  { t: "p", x:
    "When each of those is done, the commit screen holds no surprises. The three seconds become " +
    "a formality, a last look at a figure you already know." },
  { t: "p", x:
    "We designed the control with one more idea in mind. A decision of this size deserves a " +
    "physical gesture that matches it. Signing a deed takes a pen and a moment of attention. " +
    "Holding a press for three seconds is the digital equivalent." },
  { t: "p", x:
    "It also gives you a natural exit. If anything feels wrong while the ring fills, you lift " +
    "your thumb. The commitment is cancelled before it begins, and you can return to the " +
    "papers, the questions and the people who can answer them." },
  { t: "p", x:
    "Nothing about this is meant to slow down a reader who has decided. It is meant to give " +
    "every reader one clear, unhurried moment between deciding and doing." },
  { t: "story", title: "Three seconds in Mumbai", x: [
    "Imagine a family office in Mumbai committing on behalf of its principal. The analyst has " +
    "read the papers twice and briefed the family. The decision is made at a meeting on Tuesday.",
    "On Wednesday she opens the commit screen. The estate, the units and the amount sit in the " +
    "middle of the page. She presses and holds.",
    "As the ring fills, she reads the amount once more. It matches the note from Tuesday's " +
    "meeting, line for line. At three seconds the screen changes to Committed.",
    "Had the figure been wrong, she would have lifted her thumb and stopped. Nothing would have " +
    "been sent. The pause costs her three seconds and gives the family a last look.",
    "Fifteen working days later, at most, the funds clear. The screen changes again, this time " +
    "to Member, and the family's name enters the register.",
  ] },
  { t: "facts", rows: [
    [inr(DEPOSIT.amount), "holding deposit, held by NAVINA as fiduciary"],
    ["15", "working days, at most, between commitment and settlement"],
    ["3 s", "of steady pressure to commit"],
  ] },
  { t: "p", x:
    "Seen whole, the path has a simple shape. It is generous at the start and firm at the end. " +
    "The deposit is light and refundable. The commitment is binding. Settlement is final. Each " +
    "step asks a little more of you, and gives you a little more in return." },
  { t: "p", x:
    "That shape is what lets a group of people who may never meet rely on one another. Each of " +
    "them reached the register by the same path, past the same checks, at the same moment of " +
    "settlement. The register is the record of those moments, and every partner can trust it." },
  { t: "illus", plate: "creek/keys", caption:
    "Keys laid out at Streamside Creek, drawn before construction: what a settled position eventually opens." },
  { t: "p", x:
    "Measure twice, cut once, as the carpenters say. The platform gives you every chance to " +
    "measure before the cut. After it, the register is true, and everyone can rely on it." },
];
