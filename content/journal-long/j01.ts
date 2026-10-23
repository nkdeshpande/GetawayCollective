/**
 * J-01 · Why an LLP, and not a share of a building — the long form.
 * Journal 5x, 23 Oct 2026. Every figure here is already stated in
 * content/journal.ts; nothing new is introduced.
 */
import type { Block } from "../journal";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "There are simpler ways to sell a tenth of a property than forming a limited liability " +
    "partnership (LLP) for it. A co-ownership deed is shorter. A fractional title is easier to " +
    "explain. We weighed both and chose the LLP, for one reason." },
  { t: "p", x:
    "The reason is the hard moments. Most of the life of a shared property is quiet. The roof " +
    "holds, the accounts balance, and everyone agrees. A structure earns its keep on the few days " +
    "when that stops: a disagreement, a sale, a partner's death." },
  { t: "p", x:
    "So we chose the structure by asking how each option behaves on its worst day. The answer " +
    "decided everything else in this entry." },
  { t: "p", x:
    "It is a slightly unusual way to choose. Most people compare structures on their best day. " +
    "They ask how quickly each can be set up, how cheaply, and how easily it can be explained at " +
    "dinner. On those tests the co-ownership deed wins comfortably." },
  { t: "p", x:
    "But a shared estate is held for many years. Over that time, every partner's life will " +
    "change in ways nobody can predict at signing. A structure that only works while life holds " +
    "still is a structure built for a few good seasons." },
  { t: "p", x:
    "We wanted one built for decades. That meant planning for the moments everyone would rather " +
    "skip, and writing down in advance what happens in each of them." },
  { t: "illus", plate: "creek/court", caption:
    "A shared court at Streamside Creek, drawn before the first brick: one place, many owners, one set of rules." },

  { t: "h", x: "Co-ownership stalls at the first disagreement" },
  { t: "p", x:
    "Ten co-owners of a building must agree, unanimously, on every act of management. A " +
    "decision nine want and one refuses has nowhere to go. A decision needed this week has no " +
    "route at all." },
  { t: "p", x:
    "Unanimity sounds fair when everyone sits at the same table in the same mood. It reads " +
    "differently a few years on. People move cities, change jobs, marry, divorce and fall out. " +
    "Each change hands one more person a veto over everyone else." },
  { t: "p", x:
    "Many Indian families already know how this ends. A house is inherited by several siblings, " +
    "each with an equal claim. One wants to sell, one wants to live there, and one wants to " +
    "wait. The house sits locked for years while the family argues." },
  { t: "p", x:
    "Often the only exit is a partition suit, asking a court to divide the property. Courts " +
    "move slowly, and a building rarely divides neatly. Meanwhile the roof ages, the garden goes " +
    "wild, and relationships harden." },
  { t: "p", x:
    "Nobody in those stories set out to fight. The structure simply offered them no other way " +
    "to decide. Unanimity turned every difference of opinion into a standstill." },
  { t: "story", title: "Ten friends and a house in the hills", x: [
    "Picture ten friends from a Bengaluru architecture class. In their thirties they pool " +
    "savings and buy a hill house together, each named on the deed. The first two years are " +
    "easy. Weekends are planned on a group chat, and costs are split evenly.",
    "In the third monsoon the roof leaks over the main hall. Eight friends want to replace it " +
    "properly. One wants a cheaper patch. One has moved to Singapore and stops answering. The " +
    "roofer needs a decision and an advance by Friday.",
    "Nothing in the deed tells them how to decide. The eight pay for a patch from their own " +
    "pockets, to stop the damage, and keep a list of who owes whom. The list becomes the main " +
    "topic of the group chat.",
    "A year later one friend wants to sell her tenth. A buyer appears. He asks what he is " +
    "joining, and the honest answer is a deed, a spreadsheet of debts and nine strangers. He " +
    "offers far less, or walks away.",
    "Every one of the ten acted reasonably. The structure simply gave their disagreements " +
    "nowhere to go except into the friendship.",
  ] },
  { t: "p", x:
    "The usual fix is a side agreement on how the co-owners will vote. It binds only the people " +
    "who signed it. A person who buys from one of them is free of it, and enforcing it means " +
    "suing a co-owner." },
  { t: "p", x:
    "That is the weakness in one sentence. The rules sit beside the asset, in a separate " +
    "paper, held together by goodwill. When goodwill runs out, the paper runs out with it." },
  { t: "assert", x:
    "An LLP makes the rules part of the asset. Anyone who acquires a position takes it subject " +
    "to the LLP agreement. The mechanism for a contested decision is a vote rather than a " +
    "lawsuit." },
  { t: "pull", x: "The mechanism for a contested decision is a vote rather than a lawsuit." },

  { t: "h", x: "The rules travel with the position" },
  { t: "p", x:
    "In an LLP, the partners do not own the building directly. The LLP owns it, as a single " +
    "asset in its own vehicle. Each partner owns a share of the LLP, and the LLP agreement says " +
    "how that share behaves." },
  { t: "p", x:
    "This turns a crowd of owners into one owner with a constitution. The estate has one name " +
    "on its title, one bank account and one set of accounts. Decisions are taken by vote, " +
    "weighted by each partner's share, under rules everyone accepted on the way in." },
  { t: "p", x:
    "Think of the LLP agreement as the estate's constitution. It is long, and most partners " +
    "read it once with care and then consult it when a question arises. It answers the " +
    "questions a co-ownership deed leaves open." },
  { t: "list", x: [
    "Which decisions need a vote, and which are left to those running the estate.",
    "How each vote is weighted, by the share each partner holds.",
    "How the six stages of the payment order are paid, and in what order.",
    "How nights are allocated: one a year for each 1% held, from handover.",
    "How a partner may offer units to someone else, and on what terms the buyer joins.",
    "What happens to a position when a partner dies.",
  ] },
  { t: "p", x:
    "Every partner signs the same agreement. Every future partner signs it too, by taking a " +
    "position. So the rules hold steady while the people holding the estate change around them." },
  { t: "p", x:
    "The three hard moments then look very different. Each one already has a written route, " +
    "agreed before anyone needed it." },
  { t: "graphic", g: { kind: "compare",
    head: ["Ten names on a deed", "Ten partners in an LLP"],
    rows: [
      ["A disagreement", "Waits for every owner to agree", "Goes to a vote, weighted by share"],
      ["A sale", "The buyer is free of any side agreement", "The buyer takes the position subject to the LLP agreement"],
      ["A death", "An heir joins a deed with no rules for decisions", "An heir inherits a position whose rules are already written"],
      ["A bank facility", "Each owner carries it without limit", "Each partner carries what they agreed to contribute"],
    ] },
    caption: "The same three hard moments, met by two structures." },
  { t: "p", x:
    "Take the sale first. A partner who wants to leave offers units to someone else. The " +
    "newcomer reads the LLP agreement before buying, and joins on exactly the terms the others " +
    "hold. Nobody has to renegotiate anything." },
  { t: "p", x:
    "On Getaway Collective, that sale happens on a private noticeboard after the lock-in. " +
    "Fellow partners see an offer first. Buyer and seller agree the price between them, and the " +
    "LLP agreement carries on unchanged." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["A partner decides to sell", "Units are offered on the private noticeboard, after the lock-in"],
    ["Fellow partners see it first", "The people already inside have the first look"],
    ["Buyer and seller agree a price", "Between them; the noticeboard sets no price"],
    ["The buyer joins on the same terms", "The position arrives with the LLP agreement attached"],
    ["The estate carries on", "Same title, same accounts, same rules"],
  ] },
    caption: "A sale, step by step. At no point do the remaining partners have to sign anything new." },
  { t: "p", x:
    "Now take a death. In a co-owned house, an heir arrives as a co-owner with a veto and no " +
    "rulebook. Families are rarely at their best in that season. In an LLP, the heir inherits a " +
    "position whose rights, votes and nights are already written down." },
  { t: "p", x:
    "Last, a disagreement. A vote settles it, by share. The minority keeps every right it " +
    "had, including the right to argue its case next time. What it gives up is the power to " +
    "stop everyone else indefinitely." },
  { t: "story", title: "The same leak, the second time", x: [
    "Return to the hill house, and replay its third monsoon inside an LLP. The roof leaks over " +
    "the main hall. Those running the estate report it, with two quotes: a proper replacement " +
    "and a cheaper patch.",
    "The sinking fund has been set aside from revenue for exactly this. The question for " +
    "partners is narrow: which repair, and when. A vote is called, with the papers attached.",
    "Most partners vote for the proper roof. One prefers the patch and says why, in a note the " +
    "others can read. The partner in Singapore votes from her phone on a Sunday morning.",
    "The result is recorded. The roofer is paid from the fund, and the work begins the " +
    "following week. Nobody has advanced money from their own pocket, and nobody keeps a list " +
    "of debts.",
    "The partner who preferred the patch is still a partner, on the same terms. Next season she " +
    "may be in the majority. The friendship, where there is one, has been spared the argument.",
  ] },

  { t: "h", x: "Your liability stops at the LLP" },
  { t: "p", x:
    "A co-owner of a building carries whatever happens there, without limit. A partner in an " +
    "LLP carries what they agreed to contribute. When an estate carries a bank facility of " +
    "several crore, that difference is the whole of the downside." },
  { t: "p", x:
    "It helps to think about who the bank is lending to. In a co-owned house, the lender looks " +
    "at the owners. In an LLP, the lender lends to the LLP and looks at the estate. The estate's " +
    "revenue repays it, through a stage of the payment order set aside for that purpose." },
  { t: "story", title: "Two neighbours, one valley", x: [
    "Imagine two families from Pune, each with a share in a retreat in the same valley. The " +
    "first family co-owns a house with four others. The second holds units in an LLP that owns " +
    "the estate next door.",
    "A hard season comes to both. An access road washes out, repairs run long, and both " +
    "properties close for months. Each has a bank loan to keep paying.",
    "The first family's lender writes to all five co-owners. Each of them is answerable for the " +
    "loan. The family's own savings, and in the worst case their other assets, stand behind it.",
    "The second family's lender writes to the LLP. The LLP draws on its reserve and talks to " +
    "the bank. The family's exposure is the capital they contributed, and the agreement says so " +
    "in plain words.",
    "The road is the same road, and the rain is the same rain. The difference lies entirely in " +
    "the paper each family signed years earlier.",
  ] },
  { t: "p", x:
    "Put a number on it to see the shape. Say a partner contributes ₹50 L, as an illustration. " +
    "In an LLP, that ₹50 L is the measure of what they can lose. Their home, their savings " +
    "and their other investments sit outside the estate." },
  { t: "p", x:
    "In a co-owned building, the same ₹50 L is only the entry price. Whatever the building " +
    "later owes, to a bank, a contractor or an injured visitor, can reach each co-owner " +
    "personally. The cap is whatever they happen to own." },
  { t: "p", x:
    "Limited liability does not make an estate safer to run. It makes the edge of your " +
    "exposure visible. You can read it, measure it and decide whether it suits you before you " +
    "commit." },

  { t: "h", x: "Six ways to hold a place, side by side" },
  { t: "p", x:
    "Most people reading this have met at least one other way to own part of a getaway. The " +
    "differences that matter are about structure: who decides, who pays, how far your liability " +
    "runs, how you leave, and what you can visit." },
  { t: "graphic", g: { kind: "compare",
    head: ["A holiday home of your own", "A unit in an estate LLP"],
    rows: [
      ["Who decides", "You, alone", "Partners, by vote weighted by share"],
      ["Who runs it", "You, or whoever you hire", "Sensory Getaways, the operating partner"],
      ["Who pays for repairs", "You, when they happen", "A sinking fund, set aside from revenue in advance"],
      ["Empty nights", "Cost you and earn nothing", "Are let, and revenue enters the payment order"],
      ["What you can visit", "Every night, if you go", "One night a year for each 1% held, from handover"],
    ] },
    caption: "Owning a whole house against owning part of an estate. Structure and terms only." },
  { t: "graphic", g: { kind: "compare",
    head: ["Co-owning with friends", "A unit in an estate LLP"],
    rows: [
      ["Who decides", "Everyone, unanimously", "A vote, weighted by share"],
      ["The rules", "A side agreement, if anyone wrote one", "The LLP agreement, binding on every holder"],
      ["Liability", "Without limit, for each owner", "What each partner agreed to contribute"],
      ["Leaving", "Find a buyer who accepts the others", "Offer units on the noticeboard, after the lock-in"],
    ] },
    caption: "The friendship remains a friendship when the rules live somewhere else." },
  { t: "p", x:
    "Three other comparisons come up often. Each is a different kind of thing, and the " +
    "difference is easier to see in a list than in a table." },
  { t: "list", x: [
    "A timeshare sells the right to use certain weeks. You hold no share of the building and " +
    "no vote on how it is run. In an LLP the share of ownership comes first, and the nights " +
    "follow from it.",
    "A REIT pools many buildings and lists its units on an exchange. You can sell on a trading " +
    "day, and you have no say in any single property. An LLP is one estate, and partners vote " +
    "on it.",
    "A fixed deposit is a loan you make to a bank. The bank owes you a stated sum, and you own " +
    "nothing physical. An LLP partner owns part of a real estate and shares what it earns, at " +
    "the last stage of the payment order.",
  ] },
  { t: "p", x:
    "A useful way to sort them is by two questions. First, do you own part of a real place? " +
    "Second, do you have a say in how it is run? A holiday home answers yes to both, and " +
    "leaves all the work and all the cost with you." },
  { t: "p", x:
    "A timeshare answers no to both: you hold the use of time, without ownership or a vote. A " +
    "REIT answers yes to the first, spread across many buildings, and no to the second. A fixed " +
    "deposit answers no to both, and offers a stated sum instead." },
  { t: "p", x:
    "Co-owning with friends answers yes to both, and then asks everyone to agree on everything. " +
    "The LLP also answers yes to both. It differs in how the say is exercised: by a vote, " +
    "under rules that bind every holder." },
  { t: "p", x:
    "None of these is wrong. Each suits a different purpose. The LLP suits someone who wants " +
    "to own a specific place with others, on written rules, with a known edge to their " +
    "exposure." },

  { t: "h", x: "What a partner holds, day to day" },
  { t: "p", x:
    "Structure can sound abstract, so it helps to describe an ordinary year as a partner. Most " +
    "of it involves very little effort, which is part of the design." },
  { t: "p", x:
    "Each quarter, the estate pays what it earns, through the six stages of the payment " +
    "order. What reaches the last stage is shared among partners. Your share follows from the " +
    "units you hold." },
  { t: "p", x:
    "From time to time, a decision comes to a vote. The papers explain the question, the " +
    "options and who proposes what. You vote, or you let the date pass, and the result is " +
    "recorded either way." },
  { t: "p", x:
    "From handover, you have nights at the estate: one a year for each 1% held. You choose " +
    "dates, and where several partners want the same weekend, whoever has used the fewest " +
    "nights that year goes first." },
  { t: "p", x:
    "The roof, the pumps, the staff rota and the linen are handled by Sensory Getaways, the " +
    "operating partner. Its fee sits in the first stage of the payment order, and its work is " +
    "measured on Service Level." },
  { t: "p", x:
    "So a partner owns, votes, visits and reads. They do not manage. A co-owner of a hill house " +
    "does all of that and the managing too, usually on weekends meant for rest." },
  { t: "illus", plate: "creek/lamps", caption:
    "Lamps along a path at Streamside Creek, drawn before construction: the estate partners visit and others run." },

  { t: "h", x: "What it costs" },
  { t: "p", x:
    "Formation takes money and time. Every LLP files its accounts, is audited and is " +
    "administered, whether the estate earns or not. That cost is paid from the administration " +
    "reserve." },
  { t: "p", x:
    "In practice that means an annual round of work that a co-owned house simply skips. There " +
    "are statutory filings, an auditor's fee, a register to keep and minutes to write. Each is " +
    "small. Together they are a standing cost, every year, in good years and lean ones." },
  { t: "p", x:
    "A partnership interest is also taxed differently from an interest in land, and is harder " +
    "to pledge to a lender. We accepted both costs deliberately." },
  { t: "p", x:
    "The tax point deserves care. A partner's share of the LLP is a different asset, in the " +
    "eyes of the tax law, from a slice of land. Its treatment on income and on sale follows " +
    "partnership rules. Each partner should take their own tax advice on it." },
  { t: "p", x:
    "The pledging point is practical. A bank understands a flat or a plot as security. A " +
    "partnership interest in an estate LLP is less familiar, so borrowing against it is harder. " +
    "We would rather say so here than leave you to discover it." },
  { t: "p", x:
    "There is a third cost, less visible than the other two. A partner gives up the power to " +
    "decide alone. In an LLP your view counts in proportion to your share, and a majority can " +
    "outvote you on matters the agreement puts to a vote." },
  { t: "p", x:
    "For someone used to owning outright, that takes adjustment. It is also the same rule that " +
    "protects you from any one partner's veto. You give up a veto, and so does everyone else." },
  { t: "p", x:
    "We think the trade is a good one for an estate held by many people over many years. We " +
    "also think each reader should weigh it for themselves, with these costs in plain view." },
  { t: "facts", rows: [
    ["1", "estate in each LLP, as a single asset"],
    ["1 night", "a year for each 1% held, from handover"],
    ["Every year", "accounts filed and audited, earning or not"],
  ] },

  { t: "h", x: "Where the exception lives" },
  { t: "p", x:
    "The LLP is the default. A different structure for a specific estate needs Board approval. " +
    "It is written as a default with an exception, because a rule with no exception gets broken " +
    "quietly the first time it fails to fit." },
  { t: "p", x:
    "That last line carries a lesson about rules in general. A rule that admits no exception " +
    "invites people to work around it in private. A rule with a stated exception, and a stated " +
    "route to it, keeps every departure in the open." },
  { t: "p", x:
    "So if an estate ever needs a different structure, the decision will be taken by a named " +
    "body, for stated reasons, and recorded. Partners in that estate will read it before they " +
    "commit, as they read everything else." },
  { t: "p", x:
    "Those reasons might be practical. A site's land might be held in a way that suits a " +
    "different vehicle. A lender might require a particular form. Whatever the case, the " +
    "departure is argued for, approved and disclosed." },
  { t: "p", x:
    "Either way, it happens in the open. A partner can read, for any estate, which structure it " +
    "uses and why. The default makes that easy: for every estate today, the answer is an LLP of " +
    "its own, holding a single asset." },
  { t: "illus", film: ["creek", 18], caption:
    "Evening over the creek: the place partners own together, held in one vehicle with one set of rules." },
  { t: "p", x:
    "Shared ownership works best when the rules are boring, written early and binding on " +
    "everyone. The LLP is how we make them so. It costs more at the start, and it pays for " +
    "itself on the days that matter." },
];
