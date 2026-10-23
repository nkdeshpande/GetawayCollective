/**
 * J-04 · Governance without ownership — the long form.
 * Journal 5x, 23 Oct 2026. Figures: NAVINA's equity (none), the one stage
 * it is paid from (stage two, read from WATERFALL), and the entrenchment
 * (every partner). Nothing else is stated as a number.
 */
import type { Block } from "../journal";
import { WATERFALL } from "../../app/_assemblies/data";

const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";
const BRAND = WATERFALL[2].bps;

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "The usual arrangement gives a manager a stake in what it manages, on the view that shared " +
    "exposure aligns everyone. It does align some things. It also gives the party interpreting " +
    "the rules a position that one reading would improve." },
  { t: "p", x:
    "That last sentence is the whole of this entry, so it is worth slowing down. A manager " +
    "interprets rules every week. Most of those readings are routine. A few are close calls, " +
    "and close calls are where incentives do their work." },
  { t: "p", x:
    "Shared estates are full of close calls. When should the reserve be drawn? Is a repair " +
    "urgent or can it wait a season? What is the estate worth this year? Should the operator's " +
    "contract be renewed? Each question has more than one defensible answer." },
  { t: "p", x:
    "Whoever answers them shapes what partners receive. So the question of who answers, and " +
    "what that party stands to gain, sits at the centre of any shared investment. Getaway " +
    "Collective answers it in an unusual way." },
  { t: "assert", x:
    "Getaway Collective is a brand of NAVINA Structures Pvt Ltd, which forms and governs each " +
    "estate's LLP. NAVINA holds no equity in any of them. It is paid from stage two of the " +
    "payment order, and from nothing else. The rule is entrenched: changing it takes every " +
    "partner." },
  { t: "graphic", g: { kind: "triad" },
    caption: "Three parties, three roles: the partners own, NAVINA governs, Sensory Getaways runs the estate." },

  { t: "h", x: "Three parties, each with one job" },
  { t: "p", x:
    "Each estate is a single asset in its own LLP. The partners own it, and only they do. " +
    "Their units are shares of ownership, entered on the register at settlement." },
  { t: "p", x:
    "NAVINA Structures forms each LLP and governs it as Getaway Collective, its brand. It interprets " +
    "and applies the rules each LLP agreement sets out, and reports to partners. It holds " +
    "the holding deposit as a fiduciary until partners are admitted." },
  { t: "p", x:
    "Sensory Getaways runs the estates, under its house brands, SlowSpace and ESKAPE. It is the " +
    "operating partner, paid at stage one and measured on Service Level." },
  { t: "p", x:
    "Each party is paid in its own way, from its own place in the payment order. The operating " +
    "partner at stage one, NAVINA at stage two, and the partners at stage six. Nobody is paid " +
    "twice, and nobody is paid from outside the order." },
  { t: "p", x:
    "The separation is the design. The party that owns, the party that governs and the party " +
    "that operates each answer a different question. None of them marks its own homework." },
  { t: "p", x:
    "Think of a housing society. The flat owners own the building. An elected committee " +
    "applies the bye-laws. A facility manager keeps the lifts running. Trouble starts when one " +
    "party quietly takes on another's role, such as a manager who also owns half the flats." },
  { t: "p", x:
    "Our arrangement keeps the three roles in three hands, and writes the boundary between " +
    "them into each LLP agreement. A partner can always see which party made a decision, and " +
    "under which rule." },

  { t: "h", x: "Where a stake bends a judgement" },
  { t: "p", x:
    "A stake rarely corrupts anyone in a dramatic way. It tilts close calls, gently and " +
    "repeatedly, in one direction. Over years the tilt adds up." },
  { t: "p", x:
    "Consider four decisions a manager makes in an ordinary year. In each, a stake would point " +
    "one way, and the partners' interest might point another." },
  { t: "list", x: [
    "Timing a repair. A manager holding units might delay it to lift this year's distribution. " +
    "The sinking fund and a neutral governor take that temptation away.",
    "Applying the reserve floor. A manager holding units is paid sooner if the floor bends. A " +
    "governor paid at stage two gains nothing from bending it.",
    "Valuing the estate. A manager holding units gains from a higher mark. A governor holding " +
    "none has no mark to lift.",
    "Proposing a rule change. A manager holding units can vote its own proposal through. A " +
    "governor holding none must persuade the partners.",
  ] },
  { t: "p", x:
    "None of these needs bad faith to go wrong. Each needs only a reasonable person, a close " +
    "call and a quiet reason to prefer one answer. Remove the reason, and the close call is " +
    "decided on its merits." },
  { t: "story", title: "The valuation in the spring", x: [
    "Picture a family office in Mumbai holding units in a hill estate run by a manager that " +
    "also owns a tenth of it. Each spring the manager publishes a valuation for the year.",
    "This spring the estate traded unevenly. One reading of the year supports a higher value. " +
    "Another, equally defensible, supports a lower one.",
    "The manager is honest and careful. It also knows that a higher value lifts its own stake, " +
    "its fee base and its next raise. It picks the higher reading, with good arguments.",
    "Nobody has broken a rule. Yet every partner now holds a figure chosen by a party with a " +
    "reason to prefer it. The analyst at the family office cannot tell how much of the number is " +
    "the estate and how much is the manager.",
    "Now replay the spring with a governor that holds nothing. The same two readings sit on the " +
    "table. The governor gains nothing from either. Its choice can be argued with, but it " +
    "cannot be suspected of self-interest.",
  ] },
  { t: "graphic", g: { kind: "compare",
    head: ["A manager with a stake", "A governor with none"],
    rows: [
      ["A valuation", "One reading lifts its own position", "Neither reading changes what it holds"],
      ["The reserve floor", "Waiving it pays its own units sooner", "It applies the floor as written"],
      ["A vote on the rules", "Its units can tip the result", "It holds no units to cast"],
      ["How it is paid", "In growth, alongside a fee", "From one disclosed stage of revenue"],
    ] },
    caption: "The same close calls, met by two kinds of manager." },
  { t: "p", x:
    "The table is about structure, and about the people inside it only indirectly. Good people " +
    "inside a tilted structure still drift with the tilt. Removing the tilt is simpler than " +
    "relying on good people forever." },

  { t: "h", x: "What this buys" },
  { t: "list", x: [
    "Valuations are free of our interest: NAVINA holds no position to mark up.",
    "The reserve floor is applied as written: NAVINA has no stake in whether stage six pays.",
    "Control of the rules remains with the partners: NAVINA holds no units anyone could buy.",
    "A partner can ask what NAVINA gains from any rule, and the answer is the same every time.",
  ] },
  { t: "p", x:
    "Take the four in turn. The first is valuations. A valuation feeds every later figure. It " +
    "shapes what a unit is said to be worth, how a noticeboard sale compares with it, and how " +
    "an estate reports its year. NAVINA holds no position that any valuation moves." },
  { t: "p", x:
    "The second is the reserve floor. Stage six pays only once the reserve is at or above its " +
    "floor. A manager holding units would be paid sooner by a softer floor. NAVINA is paid at " +
    "stage two either way, so it applies the floor as written." },
  { t: "p", x:
    "The third is control. In many structures, whoever gathers enough units can change the " +
    "rules. NAVINA holds none, so control of an estate's rules can only ever sit with its " +
    "partners. Nobody can buy the governor's vote, because it has none to sell." },
  { t: "p", x:
    "The fourth is the simplest, and perhaps the most useful. Ask what NAVINA gains from any " +
    "rule, any decision or any reading of the agreement. The answer is always the same: its " +
    "one stage of revenue, unchanged." },
  { t: "story", title: "The quarter the floor held", x: [
    "Imagine a Pune family holding units in a coastal estate. A cyclone season damages a jetty " +
    "and part of a boardwalk. The repairs draw the reserve down below its floor.",
    "The next quarter trades well. Revenue covers every stage, and there is a surplus. Under " +
    "the rule, that surplus goes to refill the reserve before stage six pays.",
    "Some partners would prefer a distribution now and a slower refill. It is a reasonable " +
    "wish, and one partner writes to say so, politely.",
    "NAVINA reads the agreement. The floor is the floor. Its own income, at stage two, is the " +
    "same whichever way the quarter goes. So it has no reason to soften the rule, and none to " +
    "harden it. It applies the floor as written and explains why.",
    "The family receives nothing that quarter, and a full distribution the next. More " +
    "importantly, they never wonder whose interest the decision served. The answer is in the " +
    "payment order, in one line.",
  ] },
  { t: "p", x:
    "Decisions like that one are where the arrangement earns its keep. In an easy year, almost " +
    "any structure looks fair. In a hard one, partners want to know that the rules were applied " +
    "by someone with nothing to gain from bending them." },
  { t: "p", x:
    "Together, the four add up to something larger than any one of them. A partner can read " +
    "every decision NAVINA makes as a reading of the rules, and only that. There is no second " +
    "agenda to look for, because there is nothing for a second agenda to serve." },
  { t: "p", x:
    "That saves partners real effort. In many shared investments, investors spend time and " +
    "money checking whether the manager is serving itself. Here, the check is built into the " +
    "structure, and it costs nothing to run." },
  { t: "figure", label: "NAVINA's stage of the payment order", value: "Stage two · " + pct(BRAND),
    source: "The payment-order register; NAVINA is paid from this stage and from nothing else." },

  { t: "h", x: "What it costs" },
  { t: "p", x:
    "It costs NAVINA the upside. A platform taking ten per cent of every LLP would be worth far " +
    "more if the estates do well. Its people would be paid in that growth, rather than from one " +
    "stage of revenue." },
  { t: "p", x:
    "That is a real price, and it is paid by NAVINA's owners. A company that holds equity in " +
    "every estate builds a portfolio of its own. A company paid from one stage builds a record " +
    "of governing well, and nothing else." },
  { t: "p", x:
    "It also costs NAVINA a kind of comfort. A governor with a stake can point to it when " +
    "challenged: we lose too, if this goes badly. NAVINA cannot make that argument as a " +
    "company. It has to rest its case on the rules, the record and the promoters' own units." },
  { t: "graphic", g: { kind: "compare",
    head: ["A platform holding equity", "NAVINA, holding none"],
    rows: [
      ["What it owns", "A slice of every estate", "No units in any estate"],
      ["How its value grows", "With the estates' value", "With the number of estates it governs well"],
      ["Where its income sits", "Fee plus a share of profits", "One disclosed stage of revenue"],
      ["What partners must trust", "That it reads rules against its own interest", "That it reads rules as written"],
    ] },
    caption: "The upside a governor gives up, and what partners receive in exchange." },
  { t: "p", x:
    "Some readers find the trade odd at first. Why would a company give up the most valuable " +
    "thing a platform can own? The answer is that the thing it gives up is the very thing that " +
    "would make its rulings suspect." },
  { t: "p", x:
    "There is a commercial logic too. NAVINA grows by governing more estates, and it governs " +
    "more estates by earning the trust of more partners. Its asset is its record. A record of " +
    "reading rules straight is worth more to it than a slice of any one estate." },
  { t: "p", x:
    "That makes NAVINA's incentive simple to state. It is paid more when estates earn more, " +
    "because stage two is a share of revenue. It is paid nothing extra for any particular " +
    "reading of the rules. So it has every reason to run good estates and no reason to bend." },

  { t: "h", x: "Alignment through the promoters" },
  { t: "p", x:
    "Alignment comes from the promoters instead. Nikhil Deshpande and Shirisha Avanchi, " +
    "NAVINA's directors and shareholders, invest in each estate in their own names. They hold " +
    "the same units, on the same terms, paid at the same stage. The company is separated; its " +
    "owners are aligned." },
  { t: "pull", x: "The company is separated; its owners are aligned." },
  { t: "p", x:
    "This solves a problem that a no-equity rule could create on its own. A governor with no " +
    "exposure could, in theory, be careless. The promoters' own money sits in the estate, at " +
    "stage six, beside everyone else's." },
  { t: "p", x:
    "The way they hold it matters as much as the fact that they do. They invest as individuals, " +
    "on the published terms. They receive no preferred return, no catch-up and no carry. In the " +
    "register they look exactly like any other partner." },
  { t: "p", x:
    "This matters for the hard years as much as the good ones. If an estate has a thin " +
    "quarter, the promoters' distribution is thin too. If the reserve floor blocks stage six, " +
    "it blocks theirs. They feel each decision exactly as every partner does." },
  { t: "p", x:
    "It also answers a fair question from new readers: do the people behind this believe in " +
    "it? The answer is written in the register, in their own names, on the same terms as " +
    "yours." },
  { t: "graphic", g: { kind: "compare",
    head: ["NAVINA, the company", "Nikhil and Shirisha, as partners"],
    rows: [
      ["Equity in the estate", "None", "Units in their own names"],
      ["Paid from", "Stage two, the brand stage", "Stage six, with every partner"],
      ["Terms", "Set out in the disclosed payment order", "The same terms as other partners"],
      ["Role", "Forms and governs the LLP", "Owns, votes and visits, like any partner"],
    ] },
    caption: "One company kept apart from the estate; its two owners inside it, on equal terms." },
  { t: "p", x:
    "Separating the company from its owners in this way is unusual, and it is worth naming " +
    "why it works. The company makes rulings. Its owners hold positions. The rulings come " +
    "from a party with no position; the positions sit with people who make no rulings alone." },
  { t: "p", x:
    "Nikhil and Shirisha vote as partners, with the weight of their units, like everyone " +
    "else. Their votes count for exactly what their units count for. They gain no extra say " +
    "from being NAVINA's directors." },
  { t: "story", title: "A question at the partners' meeting", x: [
    "Imagine an architect from Bengaluru at her first partners' meeting. A proposal is on the " +
    "table to change the date that distributions are paid each quarter.",
    "She asks the question this entry invites. What does NAVINA gain from the change? The answer " +
    "is nothing: it is paid from stage two, and stage two is unaffected.",
    "She asks a second question. What do the promoters gain? The answer is whatever every " +
    "partner gains, in proportion to their units, because they hold units on the same terms.",
    "She finds she can stop worrying about motives and think about the proposal itself. That " +
    "is the point of the arrangement. It clears the table of hidden interests, so the real " +
    "question can be discussed.",
  ] },

  { t: "h", x: "Why entrenched" },
  { t: "p", x:
    "A clause a majority can amend lasts until it becomes inconvenient. Unanimity means the " +
    "rule outlives the people who wrote it, including on the day they would most like it gone." },
  { t: "p", x:
    "Most rules are tested on the day someone wants them gone. The people who wrote this one " +
    "are the people with the most to gain from removing it. So it had to be written to survive " +
    "its own authors." },
  { t: "p", x:
    "Picture the day that test arrives. An estate does very well. A future board at NAVINA " +
    "looks at the growth and wishes it held a share. A rule changeable by majority would be in " +
    "play that week." },
  { t: "p", x:
    "Under entrenchment, that board would have to write to every partner and win every one " +
    "of them over. The proposal would be seen by all, argued in the open, and stopped by any " +
    "single partner who preferred the rule. That is the protection working as intended." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["The rule is written", "NAVINA holds no equity and is paid from one stage"],
    ["The estates do well", "Holding a share starts to look attractive"],
    ["A change is proposed", "The rule is entrenched, so it needs every partner"],
    ["One partner declines", "The rule holds, as written"],
  ] },
    caption: "How an entrenched rule meets the day someone would like it gone." },
  { t: "p", x:
    "Entrenchment hands that decision to every partner, each holding a veto over this one " +
    "rule. A single partner who prefers the arrangement as written keeps it in place. That is " +
    "a strong protection, given on purpose." },
  { t: "p", x:
    "India's own constitutional history offers a parallel. In 1973 the Supreme Court held that " +
    "Parliament may amend the Constitution, but may not alter its basic structure. Some " +
    "principles were placed beyond the reach of any ordinary majority." },
  { t: "p", x:
    "This rule plays a similar part in each estate. Most of an LLP agreement can be amended by " +
    "the partners in the usual way. The separation of governance from ownership sits deeper, " +
    "where only every partner together can reach it." },
  { t: "p", x:
    "We chose this deliberately, knowing it binds us too. The founders of NAVINA cannot " +
    "change their minds about it later, however attractive the estates become. That is " +
    "exactly why a partner can rely on it today." },
  { t: "p", x:
    "Entrenchment has a cost of its own, and it is fair to name it. If circumstances ever " +
    "made a change genuinely wise, it would need every partner to agree. That is a high bar. " +
    "We set it high on purpose, because this is the one rule where a low bar would invite the " +
    "wrong kind of change." },

  { t: "h", x: "How a partner can check" },
  { t: "p", x:
    "A rule is only as useful as a partner's ability to see it being followed. This one is " +
    "easy to check, because it leaves the same marks in the same places." },
  { t: "list", x: [
    "The payment order shows NAVINA's stage, and its share, in every estate's papers.",
    "Each quarter, stage two is paid at its stated share and in its stated place, like every other stage.",
    "The Standing Disclosures state NAVINA's position: no equity in any estate.",
    "The promoters' units sit on the register in their own names, on the published terms.",
    "Any change to the rule needs every partner, so each partner would see it proposed.",
  ] },
  { t: "p", x:
    "None of this requires trust in anyone's character. It requires reading a few pages, " +
    "once, and glancing at a statement each quarter. That is the kind of trust we think an " +
    "investor should be asked for: the kind that can be checked." },
  { t: "facts", rows: [
    ["0%", "NAVINA's equity in any estate"],
    ["1", "stage of the payment order it is paid from"],
    ["100%", "of partners to change that rule"],
  ] },
  { t: "illus", plate: "cff/fog", caption:
    "Morning fog at Coffee Fields Forever, drawn before construction: one estate, owned by its partners alone." },
  { t: "p", x:
    "Separation of this kind is common in other fields. An auditor is barred from holding " +
    "shares in the company it audits. A judge steps aside from a case involving family. A " +
    "referee does not bet on the match. Each rule protects a judgement by removing a stake." },
  { t: "p", x:
    "Governing a shared estate is a judgement of the same kind. It deserves the same " +
    "protection, and it receives it here, in writing, for the life of every estate." },
  { t: "p", x:
    "Show me the incentive and I will show you the outcome, as Charlie Munger often said. " +
    "Here the incentive is written down, disclosed and fixed. Partners can read it in one line " +
    "and rely on it for the life of the estate." },
];
