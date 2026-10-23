/* J-08 · Five rules we keep, and why — the long form (Journal 5x, 23 Oct 2026).
   The five rules and the conservative-figure assertion are the entry's own.
   The transfer rule is read from the estate record (constants/vehicles.ts).
   Every amount in a story is labelled as an illustration in its sentence. */
import type { Block } from "../journal";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "Each rule began as a request from someone reasonable, for a reason that made sense at the " +
    "time." },
  { t: "p", x:
    "A prospective partner asked us to tell them what to do. Another asked for a minimum payout. " +
    "A third wanted a market for units, with a price on a screen. A fourth wanted smoother " +
    "quarters. A fifth wanted cleaner headlines." },
  { t: "p", x:
    "Each request was sensible on its own terms. Each would have made the platform easier to " +
    "sell. We kept the opposite rule in all five cases. This entry gives the reason for each, " +
    "with a story to show the rule at work." },
  { t: "p", x:
    "\"The other way round\" is the key phrase. Every rule here was first proposed in reverse by " +
    "someone with a good reason. Seeing the request alongside the rule shows what each rule costs, " +
    "and who bears that cost. Usually it is us, in a less polished pitch." },
  { t: "pull", x:
    "Each rule began as a request from someone reasonable, for a reason that made sense at the " +
    "time." },
  { t: "graphic", g: { kind: "compare", head: ["What was asked", "The rule we keep"], rows: [
    ["Advice", "Tell me what to do", "We inform; you decide"],
    ["Payouts", "Promise a minimum payout", "Partners share what the estate earns"],
    ["Selling", "Give units a market price", "Partners trade on a noticeboard"],
    ["Quarters", "Smooth the quarters", "Each quarter pays what it earns"],
    ["Figures", "Make the headline cleaner", "Every figure carries its class"],
  ] }, caption:
    "Five requests, and the five rules each one turned into." },

  { t: "h", x: "We inform; you decide" },
  { t: "p", x:
    "Getaway Collective gives no personalised financial advice, and is not registered to. Its " +
    "figures are inputs to a decision that stays yours. Part L of the Terms and Conditions " +
    "states this formally, and that is where it binds." },
  { t: "p", x:
    "The request behind this rule is understandable. A careful reader works through the pages, " +
    "the waterfall and the risk factors, and then asks the natural question: so, should I? It " +
    "feels unhelpful to answer with anything other than yes or no." },
  { t: "p", x:
    "Yet a fair answer to that question depends on things we cannot see. Your other holdings, " +
    "your income, your family's needs, your tax position and your horizon all shape it. An " +
    "adviser who knows those things can answer. A platform presenting an estate can only inform." },
  { t: "p", x:
    "What we provide instead is a complete record. Each estate carries its capital stack, its " +
    "payment order, its risk factors and its governance, with a confidence class on every " +
    "forward-looking figure. The record is built to be handed to an adviser intact." },
  { t: "p", x:
    "The line between the two jobs is also a protection for the reader. A platform that both " +
    "presents an estate and advises on it is advising on its own product. Keeping the jobs apart " +
    "keeps the advice, when you take it, independent of the estate." },
  { t: "graphic", g: { kind: "compare", head: ["A registered adviser", "This platform"], rows: [
    ["What it knows", "Your whole financial picture", "The estate, in full detail"],
    ["What it offers", "A recommendation for you", "Figures, terms and risks, for anyone"],
    ["Whose interest it weighs", "Yours, across everything you hold", "The estate's partners, together"],
    ["Where the decision sits", "With you, informed by advice", "With you, informed by the record"],
  ] }, caption: "Two different jobs. We do the second, thoroughly, and leave the first to people registered for it." },
  { t: "p", x:
    "Part L of the Terms and Conditions sets this out in legal language. The plain version is " +
    "short. We tell you everything we know about the estate, labelled by how firmly we know it. " +
    "You, and your advisers, decide what it means for you." },
  { t: "story", title: "The question at the end of the call", x: [
    "Picture a family office in Mumbai at the end of a long diligence call. The analyst has read " +
      "everything: the payment order, the capital stack, the risk factors. Her principal joins for " +
      "the last ten minutes and asks one thing. Would you put your own money in?",
    "The honest answer has two parts. The promoters, Nikhil Deshpande and Shirisha Avanchi, invest " +
      "in their own names on the same terms as other partners. That is a fact about them, and it is " +
      "on the record.",
    "Whether the family office should follow is a different question. It depends on what else the " +
      "family holds, how much of its capital it can leave in one estate, and how long it can wait. " +
      "Those are matters for its own advisers.",
    "The principal is mildly frustrated, then satisfied. He has a complete record of the estate and " +
      "a clear line between information and advice. His own adviser can now do her job with " +
      "better material than she usually gets.",
  ] },

  { t: "h", x: "Partners share what the estate earns" },
  { t: "p", x:
    "Partners share what remains at the last stage of the payment order. There is no minimum " +
    "payout and no top-up from elsewhere. What the estate earns is what partners share." },
  { t: "graphic", g: { kind: "waterfall" }, caption:
    "Partners stand at the last stage. What reaches it is what they share." },
  { t: "p", x:
    "The request here usually comes from people planning around an income. A retired couple, " +
    "say, wants to know the least they can expect each quarter. A floor would let them plan. It " +
    "is a fair thing to want." },
  { t: "story", title: "A floor, and where it would come from", x: [
    "Picture a retired couple in Pune planning their income for the next decade. They like the " +
      "estate and understand the payment order. They ask a reasonable question: could the " +
      "estate promise a minimum each quarter, so they can budget?",
    "Imagine it did. In the first good years, the floor costs nothing; earnings sit comfortably " +
      "above it. Then comes a weak season, a long monsoon and a repair. Earnings dip below the " +
      "promised figure.",
    "The difference has to come from somewhere. The reserve could pay it, leaving less for the " +
      "repair. New partners' money could pay it, which would mean newcomers funding the old. Or " +
      "the promise could quietly bend.",
    "The couple, walking through it, change their question. They ask instead how much of their " +
      "savings should sit in an estate whose payments rise and fall. That question has a good " +
      "answer, and their adviser can give it. It is a better question than the first.",
  ] },
  { t: "p", x:
    "A floor has to be paid from somewhere, though. In a good year it costs nothing. In a poor " +
    "year it must come from the reserve, from new money, or from a promise someone cannot keep. " +
    "Each of those moves risk from one place to another and hides where it went." },
  { t: "graphic", g: { kind: "compare", head: ["A promised minimum", "What the estate earns"], rows: [
    ["In a good year", "Looks the same as earnings", "Partners share the full surplus"],
    ["In a poor year", "Paid from reserves or new money", "Partners share a smaller surplus"],
    ["Where the risk sits", "Moved somewhere harder to see", "With the estate, in plain view"],
    ["What the record shows", "A smooth line, partly borrowed", "The estate's actual performance"],
  ] }, caption: "A floor changes where risk sits, rather than how much of it there is." },
  { t: "p", x:
    "The payment order itself explains why partners stand last. Revenue pays the operator who " +
    "runs the estate, then the brand, then the administration reserve and the sinking fund, then " +
    "the bank. Partners share what remains. Every claim ahead of theirs keeps the estate alive." },
  { t: "graphic", g: { kind: "compare", head: ["A fixed deposit", "An LLP position"], rows: [
    ["What you are", "A lender to the bank", "A partner in the estate"],
    ["What you are promised", "A stated rate of interest", "A share of what remains, whatever it is"],
    ["What you own", "A claim for your money back", "A share of the land, the building and the business"],
    ["What a good year brings", "The same stated interest", "A larger share of a larger surplus"],
  ] }, caption: "A deposit promises a rate and owns nothing; a position promises nothing fixed and owns a share." },
  { t: "p", x:
    "Neither is better in the abstract. They are different instruments for different purposes. " +
    "A deposit suits money that must be there on a known date. A position suits money that can " +
    "share in an estate's fortunes over years, through good seasons and weak ones." },
  { t: "p", x:
    "Some readers want both at once: the promise of a deposit and the ownership of a position. " +
    "That combination exists only by moving risk somewhere unseen. We prefer each instrument to " +
    "be what it says it is." },
  { t: "p", x:
    "Partners in our estates hold real equity in a real business. Their share rises and falls " +
    "with that business. We think stating that plainly is better than offering a floor that " +
    "would have to be propped up in exactly the years it matters." },

  { t: "h", x: "Partners trade on a noticeboard" },
  { t: "p", x:
    "After the lock-in, partners can offer units on a private noticeboard, which fellow " +
    "partners see first. Buyer and seller agree the price between them. It is a noticeboard " +
    "rather than a market: it matches no one and sets no price." },
  { t: "p", x:
    "The estate record states the transfer rule in one line: the internal register first, and an " +
    "external buyer needs consent. The noticeboard is how that line works in practice." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["The lock-in ends", "Units may now be offered"],
    ["A partner posts an offer", "Units and an asking price, on the noticeboard"],
    ["Fellow partners see it first", "The internal register has the first look"],
    ["Buyer and seller agree", "The price is theirs to set"],
    ["Transfer recorded", "An outside buyer needs consent"],
  ], mark: 2, markLabel: "Partners first" }, caption:
    "How a unit changes hands: through the partners first, at a price two people agree." },
  { t: "p", x:
    "Fellow partners see an offer first for a reason. They already know the estate, its record " +
    "and its people. They are the buyers most able to judge a fair price quickly. They also have " +
    "the strongest interest in who joins the register." },
  { t: "p", x:
    "The lock-in has its own purpose. An estate is built and opened over several years, and its " +
    "early register carries it through that stretch. A register that could empty in the first " +
    "difficult season would make the estate harder to build and harder to finance." },
  { t: "p", x:
    "The request was for something more liquid: a live market with a price on screen, updated " +
    "daily. It sounds like an improvement. For a single estate with a handful of partners, it " +
    "would produce a price set by whoever happened to trade last." },
  { t: "graphic", g: { kind: "compare", head: ["A live market", "A partners' noticeboard"], rows: [
    ["Who sets the price", "The last trade, however small", "The buyer and seller, together"],
    ["Who sees an offer first", "Anyone", "Fellow partners"],
    ["Who can buy in", "Anyone with an account", "Partners first; others with consent"],
    ["What it suits", "Thousands of holders, daily trading", "A small register of partners"],
  ] }, caption: "A market suits many holders trading often; a noticeboard suits a few partners who know each other." },
  { t: "p", x:
    "A noticeboard asks more of the seller than a market does. There is no instant price and no " +
    "instant buyer. In exchange, the price reflects two informed people agreeing, and the register " +
    "changes only when the partnership is content with who joins it." },
  { t: "p", x:
    "The platform's part is deliberately small. It hosts the noticeboard, shows offers to fellow " +
    "partners first, and records a completed transfer on the register. It recommends no price, " +
    "matches no buyer and takes no side in the conversation." },
  { t: "story", title: "A unit on the board", x: [
    "Imagine an NRI in Singapore whose plans have changed. The lock-in on his position has ended, " +
      "and he decides to sell part of it. He posts an offer on the noticeboard: one unit, at " +
      "an asking price he has thought through.",
    "Fellow partners see it first. A Bengaluru architect who already holds a unit asks a few " +
      "questions about his reasons and the estate's recent quarters. Both have read the same " +
      "record, so the conversation is short.",
    "They settle on a price between them. The transfer is recorded on the internal register, and " +
      "the register still lists people who chose this estate deliberately. Nobody outside the " +
      "partnership arrived through a screen.",
    "Had no partner wanted the unit, he could have found an outside buyer, subject to consent. " +
      "That route takes longer. It also keeps the register made of people the partnership has " +
      "agreed to admit. Either way, the price is the one two people chose.",
  ] },
  { t: "illus", plate: "creek/table", caption:
    "A long table at the estate, drawn: a small register of partners who chose to be there." },

  { t: "h", x: "Each quarter pays what it earns" },
  { t: "p", x:
    "A quarter that earns less pays less. Holding money back in good quarters to top up bad " +
    "ones would make the figures smoother and the record less true. The reserve is kept for " +
    "capital events." },
  { t: "p", x:
    "Hospitality earns unevenly by nature. Festivals, school holidays and the weather all move " +
    "demand from one quarter to the next. An estate's payments that follow its earnings will rise " +
    "and fall with those seasons, and partners can see why each time." },
  { t: "p", x:
    "Smoothing is a common request, and a gentle one. Nobody enjoys a quarter that pays half the " +
    "one before. A steady figure feels calmer, plans more easily and looks better on a summary." },
  { t: "p", x:
    "The cost is information. A smoothed distribution tells partners less about how the estate " +
    "is actually doing. A weak season disappears into an average. A pattern that should prompt a " +
    "question at the next meeting remains out of sight until the buffer runs out." },
  { t: "graphic", g: { kind: "compare", head: ["Smoothed quarters", "Quarters as earned"], rows: [
    ["What each payment shows", "An average of good and bad", "That quarter's actual result"],
    ["A weak season", "Hidden inside the average", "Visible, and open to questions"],
    ["What the reserve is for", "Topping up bad quarters", "Capital events: repairs, replacement"],
    ["What partners learn", "That payments are steady", "How the estate is really doing"],
  ] }, caption: "Smoothing buys a calmer line at the cost of a truer record." },
  { t: "p", x:
    "Distributions that follow the estate also make partners' meetings more useful. A weak " +
    "quarter on the page is a reason to ask the operator what happened and what changes next. " +
    "That conversation is how partners govern. A smoothed figure would leave them nothing to ask." },
  { t: "p", x:
    "The reserve has a job already. The estate sets money aside for capital events: a roof, a " +
    "pump, the replacement of things that wear. Using that money to flatter a quarter would leave " +
    "it short in the year the roof needs it." },
  { t: "facts", rows: [
    ["To the administration reserve", "2.5% of revenue"],
    ["To the sinking fund", "2.5% of revenue"],
    ["Paid in", "A fixed order, every quarter"],
  ] },
  { t: "p", x:
    "Both reserves are taken as shares of revenue, in their fixed place in the payment order. They " +
    "grow with the estate's earnings and are kept for their stated jobs. Neither is a cushion for " +
    "distributions, and both appear on the partners' statements." },
  { t: "story", title: "Two quarters, read honestly", x: [
    "Picture a Pune couple with a position at a hill estate. Their first monsoon quarter pays " +
      "noticeably less than the winter quarter before it. They had read that it might. Seeing it " +
      "arrive is still a small jolt.",
    "At the partners' meeting, the operator explains the season: fewer visitors in the heaviest " +
      "rain, and two weeks of planned repairs. The figures are on the page, quarter by quarter, " +
      "with nothing averaged away.",
    "The couple leave the meeting understanding their estate better than any smooth line could " +
      "have taught them. They know which months carry the year. They know what the reserve is " +
      "holding, and why.",
    "The following winter pays well, as winters there tend to. Their annual total is what the " +
      "estate earned, and they watched it being earned. That is the record they bought into. " +
      "At the next meeting, they are the ones asking the operator about next monsoon's repairs.",
  ] },

  { t: "h", x: "Every figure carries its class" },
  { t: "p", x:
    "A forward-looking number appears with its confidence class, every time. It can be awkward " +
    "in a headline, and it can make our material look less confident than others'. It keeps it " +
    "accurate." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Observed", "Counted or measured"],
    ["Verified", "Checked against a source document"],
    ["Modelled", "Computed from stated assumptions"],
    ["Estimated", "A judgement on incomplete information"],
    ["Forecast", "About a period still to come"],
    ["Pending", "Expected, and shown as absent until it arrives"],
  ] }, caption: "The six classes. Every forward-looking figure carries one of them, wherever it appears." },
  { t: "p", x:
    "The request was for cleaner presentation. A headline figure reads better alone. A label " +
    "such as modelled beside it looks hesitant, and a competitor's page without labels can look " +
    "more certain by comparison." },
  { t: "story", title: "Two pages, one lender", x: [
    "Imagine a lender's credit officer in Bengaluru reviewing two estates on the same morning. " +
      "The first sponsor's pack leads with a single clean yield figure in large type. The second " +
      "pack shows a similar figure with the word modelled beside it and its assumptions below.",
    "At first glance the first pack reads as more confident. Then the officer starts asking her " +
      "usual questions. What occupancy? What rate? From which year? The first pack answers on page " +
      "twelve, in a footnote, with assumptions more generous than the headline suggested.",
    "The second pack has already answered, on the same page as the figure. Her questions take " +
      "five minutes instead of an afternoon. Her note to the credit committee calls the second " +
      "pack conservative, and in her trade that word is praise. She reads the rest of the second " +
      "pack more quickly, because its first page has earned her trust. The label cost the sponsor " +
      "a headline and bought a shorter credit process.",
  ] },
  { t: "p", x:
    "We accept looking less certain in exchange for being more accurate. A reader who sees the " +
    "class knows how much weight the figure can bear. The entry <a class=\"tx-u\" " +
    "href=\"/journal/reading-a-modelled-number\">Reading a modelled number</a> explains each " +
    "class in full." },
  { t: "p", x:
    "The class also travels. A figure copied from our page into a note, a slide or a message " +
    "carries its label with it. The label is printed beside the figure, at the same size. " +
    "A partner forwarding a page forwards its honesty too." },
  { t: "p", x:
    "Where we expect a figure and do not hold it yet, the page shows it as pending, with a reason. " +
    "A blank with a reason tells the reader something true. A plausible number in its place " +
    "would tell them something false, very convincingly." },
  { t: "assert", x:
    "Where a source contains figures that cannot all hold at once, we carry the conservative " +
    "one and publish the inconsistency. The worked example here arrived claiming a cover ratio " +
    "and a modelled cash yield its own inputs could not both support. We show the conservative " +
    "figure and compute the ratio from it." },
  { t: "p", x:
    "That example is the rule under pressure. The flattering pair of figures was available, in " +
    "our own source material. We published the pair the inputs could support, and said why. " +
    "That choice costs a better headline, and buys a page that holds up in front of a lender." },

  { t: "h", x: "Why five rules, kept together" },
  { t: "p", x:
    "Read together, the five rules share one idea. Each keeps the record true when a softer " +
    "version would be easier to sell. Each places risk where partners can see it, rather than " +
    "where it is comfortable." },
  { t: "p", x:
    "The structure behind the estates points the same way. NAVINA Structures Pvt Ltd forms each " +
    "LLP and governs it as Getaway Collective, its brand. It holds no equity in any estate and is " +
    "paid from one disclosed stage of revenue." },
  { t: "p", x:
    "That one stage is disclosed in the payment order, at its stated share. NAVINA earns more " +
    "when the estate earns more and less when it earns less. Its income moves in the same " +
    "direction as every partner's." },
  { t: "p", x:
    "Its promoters invest in their own names, on the same terms as every other partner. When the " +
    "estate earns less, they share less, alongside everyone else. That alignment is what makes " +
    "the five rules natural to keep rather than costly to enforce." },
  { t: "p", x:
    "These rules also make the estates easier to compare with anything else a reader might hold. " +
    "A partner can read a quarter's payment beside a deposit's interest or a rent cheque and know " +
    "exactly what each one is. Nothing in ours is smoothed, propped or blended." },
  { t: "facts", rows: [
    ["Personalised advice", "Left to registered advisers"],
    ["Distributions", "What the estate earns, at the last stage"],
    ["Selling units", "A noticeboard, partners first, after the lock-in"],
    ["Quarters", "Each pays what it earned"],
    ["Figures", "Each carries its confidence class"],
  ] },
  { t: "p", x:
    "Each rule can also be tested from outside. A reader can check that the figures carry " +
    "classes, that the payment order ends with partners, and that quarterly payments vary with " +
    "the estate. A partner can check that the noticeboard shows offers to partners first. None " +
    "of it rests on our word alone." },
  { t: "p", x:
    "The rules will be tested again by new requests, made for new and reasonable reasons. Each " +
    "time, the question is the same one. Does the softer version keep the record true? So far " +
    "the answer has been the rule." },
  { t: "p", x:
    "Five rules is a small number. We keep the list short on purpose, so each rule can be stated " +
    "plainly and checked against what the platform actually does. A rule you can check is worth " +
    "more than a promise you have to take on trust." },
  { t: "illus", plate: "confluence/dock", caption:
    "The walk to the dock on the river at slack tide, drawn: a still surface shows what is really there." },
  { t: "p", x:
    "Each rule began as a request, and each request had a good reason behind it. We kept the " +
    "rule because its reason runs deeper: a partnership is only as strong as the record its " +
    "partners can trust." },
];
