/**
 * THE STANDING DOCUMENTS
 *
 * Wave 7 · Content
 *
 * The legal corpus, as data. Every document here is rendered by AS-29,
 * so the prose lives in one place and the layout in another, and neither
 * can be edited by accident while working on the other.
 *
 * ── ON THE VOCABULARY ────────────────────────────────────────────────
 * §25 forbids sixteen terms, and four of them are load-bearing in
 * ordinary legal drafting. The four are named on the next line so this
 * note can be checked; the pragma is there because vocab-lint cannot
 * tell a use from a mention, and naming a term in order to forbid it is
 * a mention.
 * vocab-lint-ignore "User" "Customer" "Service" "Experience"
 *
 * This corpus therefore says "you", "the Platform", and "what the
 * Platform does". That is not a workaround. A document addressing the
 * reader by the first of those four would be the first place the
 * constitution stopped being true, and it would be the document people
 * quote back at us.
 *
 * ── ON THE STANDING DISCLOSURE ───────────────────────────────────────
 * The three paragraphs in STANDING_DISCLOSURE are stated ONCE, here, and
 * rendered in exactly two documents: the Terms and Conditions (Part L)
 * and the Risk Factors (Part A, first). Nothing else in the application
 * restates them. /legal/disclosures cites them and links; it does not
 * carry its own copy.
 *
 * That is a deliberate constraint and it is enforced by a check. Wording
 * repeated in five places becomes five wordings the moment one is
 * revised, and the one a reader was shown is then a question of which
 * screen they happened to be on. A disclosure that varies by screen is
 * not a disclosure.
 */

export type Confidence = "observed" | "verified" | "modelled" | "estimated" | "forecast" | "pending";

/** One numbered clause. `list` items are rendered as a set, not as prose. */
export interface Clause {
  n: string;
  h?: string;
  p?: readonly string[];
  list?: readonly string[];
  /** Rendered on paper — an assertion of fact rather than narrative. */
  assertion?: boolean;
}

export interface Part {
  ref: string;
  title: string;
  intro?: string;
  clauses: readonly Clause[];
}

export interface StandingDocument {
  id: string;
  path: string;
  title: string;
  /** What this document is for, in one sentence, before any clause. */
  purpose: string;
  version: string;
  effective: string;
  /** Reading time is computed, never typed. See READING_MINUTES below. */
  parts: readonly Part[];
  /** Documents that must be read alongside this one. */
  alongside?: readonly { path: string; title: string; why: string }[];
}

/* ═══════════════════════════════════════════════════════════════════
   THE STANDING DISCLOSURE

   Stated once. Rendered in the Terms and Conditions and in the Risk
   Factors, and nowhere else.
   ═══════════════════════════════════════════════════════════════════ */

export const STANDING_DISCLOSURE: readonly string[] = [
  "Capital is at risk. Investments of this kind are illiquid and are not traded on any public " +
    "exchange. You may lose some or all of the capital you commit.",

  "Past performance is not a guide to future performance. Yields shown anywhere on this platform " +
    "are modelled or estimated unless expressly marked otherwise, and no return is guaranteed by " +
    "any party.",

  "Nothing here is investment advice. Getaway Collective does not provide personalised financial " +
    "advice and is not a registered investment adviser.",
];

/** The two documents permitted to render STANDING_DISCLOSURE verbatim. */
export const DISCLOSURE_HOME = ["/legal/terms", "/legal/risk-disclosure"] as const;

/* ═══════════════════════════════════════════════════════════════════
   TERMS AND CONDITIONS
   ═══════════════════════════════════════════════════════════════════ */

const TERMS: StandingDocument = {
  id: "DOC-01",
  path: "/legal/terms",
  title: "Terms and Conditions",
  purpose:
    "What you are agreeing to when you commit capital through this platform, and what each of " +
    "the three entities involved is and is not responsible for.",
  version: "2.0",
  effective: "2026-07-31",
  alongside: [
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "The risks summarised in Part L are set out in full there. Part L is not a substitute for it." },
    { path: "/legal/privacy", title: "Privacy Notice",
      why: "What is collected about you, why, and how long it is held." },
  ],
  parts: [
    {
      ref: "A",
      title: "Who you are contracting with",
      intro:
        "Three entities appear throughout this document and they are not interchangeable. Most " +
        "misunderstandings about what this platform is come from collapsing them into one.",
      clauses: [
        { n: "A.1", h: "Getaway Collective",
          p: ["Getaway Collective operates this platform. It admits and verifies partners, it " +
              "administers the register, it publishes what each vehicle reports, and it enforces " +
              "the constitutional rules described in these terms.",
              "Getaway Collective does not hold equity in the vehicles it governs. It is not your " +
              "counterparty for the investment itself, it does not hold your capital, and it does " +
              "not own the underlying land or buildings."] },

        { n: "A.2", h: "The vehicle",
          p: ["Each property is held by its own body corporate — a Limited Liability Partnership " +
              "registered in India, unless the Board has approved a different structure for a " +
              "specific property under §24a.",
              "The vehicle owns the asset. You contract with the vehicle when you commit capital, " +
              "and your rights as a partner arise under its Agreement and the Limited Liability " +
              "Partnership Act 2008 — not under these terms."],
          assertion: true },

        { n: "A.3", h: "The operating partner",
          p: ["Day-to-day operation of a property is carried out by an operating partner under a " +
              "Commercial Services Agreement with the vehicle. The operating partner is measured " +
              "against a Service Level and is paid from stage one of the waterfall.",
              "The operating partner is not a party to these terms and owes you no duty under them. " +
              "Its obligations run to the vehicle."] },

        { n: "A.4", h: "Governance without ownership",
          p: ["Getaway Collective governs vehicles in which it holds no economic interest. This is " +
              "deliberate and it is entrenched: it cannot be changed except by unanimous resolution.",
              "The consequence for you is that the party setting the rules does not profit from the " +
              "outcome those rules produce. The consequence for us is that we cannot be outvoted " +
              "into abandoning them, and cannot quietly benefit from relaxing them."] },
      ],
    },

    {
      ref: "B",
      title: "Eligibility",
      clauses: [
        { n: "B.1", h: "Who may commit",
          p: ["You may commit capital only if you are at least eighteen years of age, have the legal " +
              "capacity to enter a binding agreement, and have completed accreditation."] },

        { n: "B.2", h: "Accreditation",
          p: ["Accreditation establishes identity, tax residency, source of funds, and that the " +
              "commitment is suitable given what you have told us about your circumstances.",
              "Accreditation is a check on eligibility. It is not an endorsement of the commitment, " +
              "and passing it is not a statement by anyone that the commitment is a good idea for you."] },

        { n: "B.3", h: "Jurisdiction and residence",
          p: ["The platform is operated from India and vehicles are Indian bodies corporate. If you " +
              "are resident, domiciled or a citizen elsewhere, whether you may lawfully commit is a " +
              "question of the law that applies to you, and it is yours to answer.",
              "Commitments from persons in jurisdictions where the offer would require a " +
              "registration that has not been made are declined."] },

        { n: "B.4", h: "Refusal",
          p: ["A commitment may be declined without a reason being given where giving one would " +
              "conflict with an obligation under anti-money-laundering or sanctions law. In every " +
              "other case a reason is recorded and available to you."] },
      ],
    },

    {
      ref: "C",
      title: "Your account and the passport",
      clauses: [
        { n: "C.1", h: "One identity",
          p: ["You hold one identity on this platform for as long as you have any relationship with " +
              "it. Becoming a partner is a change of state on that identity, never a second record."] },

        { n: "C.2", h: "Security",
          p: ["You are responsible for the security of the credentials that reach your identity, and " +
              "for anything done through it. Tell us as soon as you know or suspect it has been " +
              "reached by someone else.",
              "We will never ask you for a password, a one-time code, or the full number of any " +
              "payment instrument. A message that does is not from us."] },

        { n: "C.3", h: "Accuracy",
          p: ["Information you give during accreditation must be accurate and kept current. A " +
              "material change — residence, tax status, control of the funds committed — must be " +
              "reported within thirty days."] },
      ],
    },

    {
      ref: "D",
      title: "Commitment and settlement",
      intro:
        "This is the part of the document that describes the moment your position becomes real, " +
        "and it is the part most worth reading slowly.",
      clauses: [
        { n: "D.1", h: "A commitment is an offer",
          p: ["Confirming a commitment is an offer to contribute capital to a vehicle on the terms " +
              "shown at the moment you confirm. It binds you. It does not, by itself, make you a " +
              "partner."] },

        { n: "D.2", h: "Settlement is the event that matters",
          p: ["You become a partner when your capital settles — when cleared funds reach the " +
              "vehicle — and not before. Acceptance of your offer does not do it. Confirmation on " +
              "screen does not do it. Settlement does.",
              "This is not a formality. Governance rights, entitlement, and your position in the " +
              "register all begin at settlement. Before it you have an obligation and no rights."],
          assertion: true },

        { n: "D.3", h: "Settlement is irreversible",
          p: ["Once settled, the change of state cannot be undone by us, by you, or by agreement. " +
              "Exit is by transfer under Part G, and by nothing else.",
              "There is no cooling-off period after settlement. The deliberation is placed before " +
              "the commitment for that reason, and the commitment control is deliberately slow."] },

        { n: "D.4", h: "The completion window",
          p: ["Capital must settle within fifteen working days of the commitment. A commitment that " +
              "has not settled by then lapses, and any partial amount received is returned to the " +
              "account it came from, without interest."] },

        { n: "D.5", h: "Nothing new appears after commitment",
          p: ["Every term, fee, lock-in and risk that applies to a commitment is shown before the " +
              "commitment control, not after it. A term first disclosed on a confirmation screen " +
              "has not been disclosed; it has been sprung."] },
      ],
    },

    {
      ref: "E",
      title: "Money",
      clauses: [
        { n: "E.1", h: "The waterfall",
          p: ["Revenue at a property is applied in six stages, in order: the operating partner, " +
              "brand and platform, the administrative reserve, the sinking fund, debt service, and " +
              "then partners.",
              "Each stage is satisfied in full before the next receives anything. The six stages " +
              "always sum to the whole of revenue — there is no seventh stage and no residual that " +
              "leaves without appearing."],
          assertion: true },

        { n: "E.2", h: "Debt service is its own stage",
          p: ["Where a vehicle carries a facility, debt service is stated as a stage in its own " +
              "right and in its proper order — ahead of partners, because that is where it ranks.",
              "It is not netted inside the figure described as the partners' share. A document that " +
              "shows you a large percentage and mentions in a footnote that it services borrowing " +
              "is showing you a number you will not receive."] },

        { n: "E.3", h: "Distribution can be blocked",
          p: ["Stage six does not run if paying it would take the administrative reserve below its " +
              "floor, or if any earlier stage was unmet.",
              "A profitable quarter can therefore distribute nothing. That is the mechanism working " +
              "as designed, not a failure of it."] },

        { n: "E.4", h: "No preferred return",
          p: ["There is no preferred return, no catch-up, and no carried interest. Partners share " +
              "stage six in proportion to contribution."] },

        { n: "E.5", h: "Fees",
          p: ["The administrative reserve is 2.5% of revenue and the sinking fund is 2.5% of " +
              "revenue. Both are percentages of what the property earns, not of what your position " +
              "is worth.",
              "There is no fee on committed capital, no fee on assets under management, no exit " +
              "fee, and no performance fee. Where any charge is introduced it takes effect only for " +
              "commitments made after it is published."] },

        { n: "E.6", h: "Rounding",
          p: ["Amounts are held in whole minor units and allocated by largest remainder, so a split " +
              "sums exactly to the amount split. Where rounding produces a difference of one minor " +
              "unit between partners, it falls to the largest remainder and not to the vehicle."] },

        { n: "E.7", h: "Taxes",
          p: ["Tax on distributions and on any gain is yours. Withholding is applied where the law " +
              "requires it and is shown on the distribution record. Nothing on this platform is tax " +
              "advice."] },
      ],
    },

    {
      ref: "F",
      title: "Entitlement",
      clauses: [
        { n: "F.1", h: "What entitlement is",
          p: ["A partner in a vehicle is entitled to a number of nights each year at the property " +
              "that vehicle owns, in proportion to contribution.",
              "Entitlement is an incident of the position. It is not the reason the position exists " +
              "and it is not separately priced."] },

        { n: "F.2", h: "When it begins",
          p: ["Entitlement begins at handover. Before a property is built there is nothing to draw " +
              "against, and the entitlement shown for an unbuilt property is zero rather than a " +
              "promise."],
          assertion: true },

        { n: "F.3", h: "Unused nights",
          p: ["Nights not taken in a year do not carry forward and are not exchanged for money. " +
              "Where an unused night is released and taken by someone else, the revenue enters the " +
              "waterfall at stage one like any other."] },

        { n: "F.4", h: "Precedence",
          p: ["Where more partners seek the same dates than the property can hold, precedence runs " +
              "by nights already taken that year, ascending — the partner who has drawn least goes " +
              "first. Ties are resolved by the order the requests were recorded."] },
      ],
    },

    {
      ref: "G",
      title: "Lock-in and transfer",
      clauses: [
        { n: "G.1", h: "Lock-in",
          p: ["A position is locked for the period stated in the vehicle's Agreement — typically " +
              "thirty-six months from financial close. During lock-in a position cannot be " +
              "transferred except on death, or with the unanimous consent of the partners."] },

        { n: "G.2", h: "There is no market",
          p: ["Positions are not listed, quoted or traded on any exchange. There is no market maker " +
              "and no obligation on anyone to buy your position at any price.",
              "An internal register of partners willing to buy and sell is operated as a courtesy. " +
              "It is a noticeboard. It is not a market, it does not guarantee a counterparty, and " +
              "it does not establish a price."],
          assertion: true },

        { n: "G.3", h: "Transfer requires consent",
          p: ["After lock-in, a transfer to a person who is not already a partner requires the " +
              "consent of partners holding a majority of contribution, and the incoming partner " +
              "must complete accreditation before the transfer is registered."] },

        { n: "G.4", h: "Death and succession",
          p: ["On the death of a partner the position passes to the estate. The vehicle registers " +
              "the transmission on production of a grant, and the lock-in does not apply."] },
      ],
    },

    {
      ref: "H",
      title: "Governance",
      clauses: [
        { n: "H.1", h: "Voting is contribution-weighted",
          p: ["Votes are weighted by contribution and never counted per head. A partner holding ten " +
              "per cent casts ten per cent."],
          assertion: true },

        { n: "H.2", h: "Thresholds",
          list: ["Ordinary resolution — more than 50% of contribution present and voting.",
                 "Special resolution — at least 76% of total contribution.",
                 "Entrenched principles — 100%, unanimous.",
                 "A tie is not approval. Where a vote is exactly balanced the resolution fails."] },

        { n: "H.3", h: "What you can call",
          p: ["Partners holding at least 20% of contribution may requisition a meeting. The vehicle " +
              "must convene it within twenty-one days."] },

        { n: "H.4", h: "A minority position is a minority position",
          p: ["Weighted voting means a partner holding a small share can be outvoted on every " +
              "resolution that is not entrenched. Read Part D of the Risk Factors before assuming " +
              "influence proportionate to interest."] },
      ],
    },

    {
      ref: "I",
      title: "The platform itself",
      clauses: [
        { n: "I.1", h: "Availability",
          p: ["The platform is provided as it stands. It is not warranted to be uninterrupted or " +
              "error-free, and maintenance may make it unavailable.",
              "Unavailability does not suspend a settlement deadline, a lock-in, or any obligation " +
              "under a vehicle's Agreement. Where a deadline falls in a period of unavailability it " +
              "is extended by the length of that period."] },

        { n: "I.2", h: "Figures shown",
          p: ["Every forward-looking figure carries a confidence class stating how it was arrived " +
              "at — observed, verified, modelled, estimated, forecast or pending. A figure marked " +
              "provisional is marked so wherever it appears.",
              "Where a figure is corrected, the correction is published with the date and the " +
              "reason. Prior versions are retained."] },

        { n: "I.3", h: "What we publish is what we hold",
          p: ["Records shown to you are the records held. Where something has not been verified it " +
              "says so rather than being omitted, and an absent figure is shown as absent rather " +
              "than as zero."] },

        { n: "I.4", h: "Acceptable use",
          p: ["Do not attempt to reach data belonging to another person, probe the platform for " +
              "vulnerabilities without written permission, scrape it at a rate that degrades it for " +
              "others, or present its content as your own."] },

        { n: "I.5", h: "Intellectual property",
          p: ["The platform, its design system, its written content and its data belong to Getaway " +
              "Collective or its licensors. You may read, print and quote from the standing " +
              "documents for the purpose of taking advice on your own position."] },
      ],
    },

    {
      ref: "J",
      title: "Liability",
      clauses: [
        { n: "J.1", h: "What is never excluded",
          p: ["Nothing in these terms excludes liability for fraud, for fraudulent " +
              "misrepresentation, for death or personal injury caused by negligence, or for any " +
              "liability that cannot lawfully be excluded."] },

        { n: "J.2", h: "What is excluded",
          p: ["Subject to J.1, Getaway Collective is not liable for the performance of any vehicle, " +
              "for the acts of any operating partner, for loss of profit or anticipated return, or " +
              "for a fall in the value of a position."] },

        { n: "J.3", h: "Cap",
          p: ["Subject to J.1, total liability arising from the operation of the platform is capped " +
              "at the total of the administrative reserve charges attributable to your positions in " +
              "the twelve months before the claim.",
              "This cap is stated plainly because it is low. It reflects that Getaway Collective " +
              "does not hold your capital and takes no economic interest in the vehicles it " +
              "governs; it is not an attempt to disclaim what it does do."] },

        { n: "J.4", h: "Your own diligence",
          p: ["You commit on your own assessment, or on advice you have taken. Modelled figures on " +
              "this platform are inputs to that assessment and are not a substitute for it."] },
      ],
    },

    {
      ref: "K",
      title: "Changes, complaints and law",
      clauses: [
        { n: "K.1", h: "Changes to these terms",
          p: ["These terms are versioned. A change takes effect thirty days after publication and " +
              "applies to commitments made after that date. A change that would materially reduce " +
              "the rights of existing partners requires a special resolution of the vehicles " +
              "affected.",
              "Every version remains available at /legal/terms with the date it took effect and the " +
              "date it was replaced."] },

        { n: "K.2", h: "Complaints",
          p: ["The complaints procedure is at /legal/complaints. It states who will read a " +
              "complaint, how long each stage takes, and what to do if the answer is unsatisfactory."] },

        { n: "K.3", h: "Governing law",
          p: ["These terms are governed by the laws of India. The courts at Bengaluru have " +
              "exclusive jurisdiction, save that a claim may be brought in the courts of your place " +
              "of residence where the law of that place gives you that right and it cannot be " +
              "excluded by agreement."] },

        { n: "K.4", h: "If a clause fails",
          p: ["If any clause is held unenforceable it is severed and the rest continues. A clause " +
              "severed from Part D or Part E is reported to partners within thirty days, because " +
              "those parts describe how money moves."] },
      ],
    },

    /* Part L renders STANDING_DISCLOSURE. See the note at the head of
       this file: it appears here and in the Risk Factors, nowhere else. */
    {
      ref: "L",
      title: "Standing disclosure",
      intro:
        "The following applies to everything on this platform, at all times, and is not qualified " +
        "by anything written elsewhere in these terms.",
      clauses: [
        { n: "L.1", h: "Capital at risk, past performance, and advice",
          p: STANDING_DISCLOSURE, assertion: true },
        { n: "L.2", h: "This is a summary",
          p: ["Part L states the position shortly. The Risk Factors document sets out in full what " +
              "can go wrong, why, and what happens to your position when it does. Read it before " +
              "committing rather than after."] },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   RISK FACTORS
   ═══════════════════════════════════════════════════════════════════ */

const RISK_FACTORS: StandingDocument = {
  id: "DOC-02",
  path: "/legal/risk-disclosure",
  title: "Risk Factors",
  purpose:
    "What can go wrong with a commitment made through this platform, in the order of how much it " +
    "would cost you, and what happens to your position in each case.",
  version: "2.0",
  effective: "2026-07-31",
  alongside: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "The rights and obligations these risks act upon." },
    { path: "/how-capital-works", title: "How capital works",
      why: "The waterfall in full, with worked figures." },
  ],
  parts: [
    /* Part A renders STANDING_DISCLOSURE — first, before any specific
       risk, because a reader who stops after one screen should have read
       this one. */
    {
      ref: "A",
      title: "Read this first",
      clauses: [
        { n: "A.1", h: "Standing disclosure",
          p: STANDING_DISCLOSURE, assertion: true },
        { n: "A.2", h: "How this document is ordered",
          p: ["Risks are set out worst first, not in the order that flatters. Part B can cost you " +
              "everything. Part J costs you inconvenience. The ordering is the point.",
              "This document is not exhaustive. It describes the risks known at the version date. " +
              "A property may carry risks specific to it, and those are stated on the property's " +
              "own record and in the vehicle's Agreement."] },
      ],
    },

    {
      ref: "B",
      title: "You can lose everything",
      clauses: [
        { n: "B.1", h: "Total loss is possible",
          p: ["A commitment is a contribution to a body corporate that owns, or intends to own, a " +
              "single property. If that body corporate cannot meet its obligations, partners rank " +
              "last. You may receive nothing.",
              "There is no capital protection, no guarantee from Getaway Collective or from any " +
              "operating partner, and no compensation scheme standing behind a loss."],
          assertion: true },

        { n: "B.2", h: "One asset, one place",
          p: ["Each vehicle holds one property. There is no diversification inside a vehicle. A " +
              "fire, a title dispute, a change in coastal regulation, or a road that stops carrying " +
              "traffic can impair the whole of it.",
              "Holding positions in several vehicles reduces this. It does not remove it, because " +
              "properties in one region share weather, regulation and demand."] },

        { n: "B.3", h: "The asset may not exist yet",
          p: ["Many vehicles are formed before construction begins. Between formation and handover " +
              "the vehicle owns land and a plan, and has an obligation to build.",
              "Construction can overrun, cost more than budgeted, or fail approval. A delay past " +
              "the programmed handover means an asset that is not earning while its costs " +
              "continue."] },
      ],
    },

    {
      ref: "C",
      title: "You cannot get out",
      clauses: [
        { n: "C.1", h: "Illiquidity is structural, not temporary",
          p: ["These positions are not traded on any exchange. There is no daily price, no " +
              "redemption, and no obligation on anyone to buy from you.",
              "Do not commit capital you may need. Assume you cannot access it for the life of the " +
              "property, and treat any earlier exit as a fortunate outcome rather than a plan."],
          assertion: true },

        { n: "C.2", h: "Lock-in",
          p: ["A position is locked for the period in the vehicle's Agreement, typically " +
              "thirty-six months from financial close. During that period it cannot be transferred " +
              "except on death or by unanimous consent."] },

        { n: "C.3", h: "After lock-in it is still hard",
          p: ["A transfer needs a willing buyer, a price you both accept, and the consent of a " +
              "majority by contribution. The internal register makes finding a buyer possible. It " +
              "does not make it likely, and it establishes no price."] },

        { n: "C.4", h: "Valuation is not liquidity",
          p: ["A valuation shown against your position is an estimate of what the underlying asset " +
              "might be worth, not an amount anyone has offered. Valuations are periodic, are " +
              "modelled, and have been wrong before."] },
      ],
    },

    {
      ref: "D",
      title: "Debt",
      clauses: [
        { n: "D.1", h: "Leverage cuts both ways",
          p: ["Where a vehicle borrows, the lender ranks ahead of every partner. Debt service is " +
              "stage five of the waterfall and partners are stage six.",
              "Borrowing raises the return on equity when the property performs and destroys it " +
              "when the property does not. A property that covers its debt and nothing more " +
              "distributes nothing, indefinitely, while remaining solvent."],
          assertion: true },

        { n: "D.2", h: "Drawn against an asset that is not earning",
          p: ["Facilities are typically drawn during construction, when there is no revenue. " +
              "Interest accrues from drawdown. A moratorium defers the payment; it does not remove " +
              "the obligation."] },

        { n: "D.3", h: "Covenant breach",
          p: ["A facility carries covenants — cover ratios, valuation tests, completion dates. A " +
              "breach can accelerate the whole facility, force a sale at a time not of the " +
              "vehicle's choosing, and leave partners with the residue after the lender is paid.",
              "The residue after a forced sale is frequently nothing."] },

        { n: "D.4", h: "Refinancing is not assured",
          p: ["Where a facility matures before the property is sold it must be refinanced. The " +
              "terms available then depend on rates, on lender appetite, and on the property's " +
              "record. None of these can be fixed in advance."] },
      ],
    },

    {
      ref: "E",
      title: "Revenue",
      clauses: [
        { n: "E.1", h: "Occupancy is an assumption",
          p: ["Every modelled distribution rests on an assumed occupancy and an assumed rate. Both " +
              "are estimates made before the property has traded.",
              "A property that assumes fifty per cent blended occupancy and achieves forty " +
              "distributes materially less than modelled, and the shortfall lands entirely on stage " +
              "six because the stages above it are fixed or senior."] },

        { n: "E.2", h: "Seasonality",
          p: ["Annual figures average a peak and a trough. On the Karnataka coast the monsoon runs " +
              "far below the annual average, and a weak winter cannot be made up.",
              "A quarterly distribution will vary substantially through the year even where the " +
              "annual figure is met."] },

        { n: "E.3", h: "Demand can move",
          p: ["Demand depends on access, on the region remaining somewhere people wish to go, and " +
              "on competing supply. New supply nearby can take occupancy, rate, or both."] },

        { n: "E.4", h: "The operating partner",
          p: ["Revenue depends on how well the property is run, and it is not run by Getaway " +
              "Collective. A poor operating partner can be replaced, but replacement takes time and " +
              "the property earns less while it happens."] },
      ],
    },

    {
      ref: "F",
      title: "Distributions",
      clauses: [
        { n: "F.1", h: "Distribution is not automatic",
          p: ["Stage six runs only when the five stages above it are satisfied and the reserve is " +
              "at or above its floor. A quarter in which the property was profitable can still pay " +
              "nothing."],
          assertion: true },

        { n: "F.2", h: "Timing",
          p: ["Distributions follow stabilisation, which for a property under construction is years " +
              "after commitment. The first distribution date shown in a programme is a forecast."] },

        { n: "F.3", h: "Capital calls",
          p: ["Where a vehicle needs further capital its Agreement may permit a call on partners. A " +
              "partner who does not meet a call may be diluted, and dilution is permanent."] },
      ],
    },

    {
      ref: "G",
      title: "Regulation",
      clauses: [
        { n: "G.1", h: "Coastal regulation",
          p: ["Properties on the coast sit inside a Coastal Regulation Zone. Approvals held today " +
              "are not a forecast of approvals tomorrow, and an amendment can change what may be " +
              "built on land after the land has been bought."] },

        { n: "G.2", h: "The structure could be recharacterised",
          p: ["The structure is a body corporate holding a single asset, with partners holding " +
              "contribution-weighted interests. If a regulator were to treat an arrangement of this " +
              "kind as a collective investment scheme, compliance could become materially more " +
              "expensive or the structure could require alteration."] },

        { n: "G.3", h: "Tax law changes",
          p: ["The tax treatment of a Limited Liability Partnership, of distributions from one, and " +
              "of gains on transfer, can change. Changes are not always prospective."] },

        { n: "G.4", h: "Cross-border",
          p: ["Where you are not resident in India, exchange control, reporting obligations and " +
              "double-tax treatment apply to you and are yours to manage."] },
      ],
    },

    {
      ref: "H",
      title: "Governance and conflicts",
      clauses: [
        { n: "H.1", h: "You may be outvoted",
          p: ["Voting is weighted by contribution. A partner with a small share can be outvoted on " +
              "every resolution that is not entrenched, including on matters that affect the value " +
              "of the position."] },

        { n: "H.2", h: "Conflicts",
          p: ["Getaway Collective governs vehicles in which it holds no equity, which removes the " +
              "commonest conflict. It does not remove all of them: the same operating partner may " +
              "run several properties, and a person may be a partner in more than one vehicle.",
              "Conflicts are recorded on a register, and a conflicted party does not vote on the " +
              "matter concerned."] },

        { n: "H.3", h: "Key people",
          p: ["The platform depends on a small number of people. Their departure would be " +
              "disruptive, and continuity is not guaranteed by any contract."] },
      ],
    },

    {
      ref: "I",
      title: "Figures",
      clauses: [
        { n: "I.1", h: "Modelled means modelled",
          p: ["A figure marked modelled, estimated or forecast is the output of assumptions. It is " +
              "not a prediction, a target, or a commitment by anyone.",
              "Every such figure carries its confidence class wherever it appears. Where a figure " +
              "has no class it has not been assessed and should be treated as the weakest."],
          assertion: true },

        { n: "I.2", h: "Source documents can be inconsistent",
          p: ["Material prepared by a promoter or an operating partner can contain figures that " +
              "cannot all hold at once. Where such an inconsistency is found, the conservative " +
              "figure is carried, the inconsistency is stated on the property's record, and the " +
              "dependent figures are computed rather than restated so they cannot disagree again."] },

        { n: "I.3", h: "Valuations are periodic",
          p: ["A valuation is a point-in-time estimate on stated assumptions. Between valuations " +
              "the figure shown is the last one, not the current one."] },
      ],
    },

    {
      ref: "J",
      title: "The platform",
      clauses: [
        { n: "J.1", h: "Technology",
          p: ["The platform can be unavailable. Records are backed up and reconciled, and a period " +
              "of unavailability extends any deadline that falls inside it, but access to " +
              "information is not continuous."] },

        { n: "J.2", h: "Data",
          p: ["Accreditation requires identity documents and financial information. That data is " +
              "held under the Privacy Notice. No holder of personal data can promise it will never " +
              "be reached by someone who should not reach it."] },

        { n: "J.3", h: "Entitlement is not guaranteed on chosen dates",
          p: ["Entitlement is a number of nights, not particular nights. Popular dates are " +
              "allocated by the precedence rule in the Terms, and a partner may be unable to take " +
              "the dates preferred."] },
      ],
    },

    {
      ref: "K",
      title: "If you take one thing from this document",
      clauses: [
        { n: "K.1",
          p: ["Commit only capital you can lose in full and will not need back. Assume the money is " +
              "gone for the life of the property and treat every distribution as a surprise rather " +
              "than an income.",
              "If that framing makes the commitment unattractive, the commitment is not suitable, " +
              "and no figure elsewhere on this platform should change that conclusion."],
          assertion: true },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   THE REMAINING STANDING DOCUMENTS
   ═══════════════════════════════════════════════════════════════════ */

const PRIVACY: StandingDocument = {
  id: "DOC-03",
  path: "/legal/privacy",
  title: "Privacy Notice",
  purpose: "What is collected about you, why it is collected, who sees it, and how long it is kept.",
  version: "2.0",
  effective: "2026-07-31",
  parts: [
    {
      ref: "A", title: "What is collected",
      clauses: [
        { n: "A.1", h: "Identity and accreditation",
          list: ["Name, date of birth, nationality and tax residency.",
                 "Government identity documents and a photograph, for verification.",
                 "Address and proof of it.",
                 "Source of funds, and the evidence supporting what you have stated.",
                 "The answers you give to suitability questions."] },
        { n: "A.2", h: "Position and activity",
          list: ["Commitments, settlements, distributions and votes cast.",
                 "Entitlement drawn.",
                 "Documents you have acknowledged, and the version you acknowledged."] },
        { n: "A.3", h: "Technical",
          p: ["Sign-in times and the network address they came from, retained for security. There " +
              "is no advertising identifier and no third-party analytics on this platform."] },
      ],
    },
    {
      ref: "B", title: "Why",
      clauses: [
        { n: "B.1", h: "Legal obligation",
          p: ["Identity, source of funds and screening data are collected because " +
              "anti-money-laundering law requires it. This data cannot be deleted on request while " +
              "the retention period runs."] },
        { n: "B.2", h: "Performance of a contract",
          p: ["Position, distribution and governance data are processed to operate the register and " +
              "pay you what you are owed."] },
        { n: "B.3", h: "What is never done",
          list: ["Your data is not sold.",
                 "It is not used to train a model.",
                 "It is not shared with an advertiser.",
                 "It is not used to profile you for anything other than the suitability assessment " +
                 "you completed knowingly."] },
      ],
    },
    {
      ref: "C", title: "Who sees it",
      clauses: [
        { n: "C.1", p: ["Staff of Getaway Collective with a reason to, and the record of who looked " +
                        "is retained.",
                        "The vehicle you are a partner in, for its register and its filings.",
                        "Verification and screening providers, banks, auditors, and the Registrar of " +
                        "Companies where filing requires it."] },
        { n: "C.2", h: "Not the operating partner",
          p: ["An operating partner is told the number of nights a partner is entitled to and the " +
              "name for the arrival. It is not given your financial position."] },
      ],
    },
    {
      ref: "D", title: "How long",
      clauses: [
        { n: "D.1", list: [
          "Accreditation and screening records — eight years after the relationship ends, as required.",
          "Position and distribution records — the life of the vehicle, then eight years.",
          "Sign-in and security logs — thirteen months.",
          "Correspondence — three years."] },
      ],
    },
    {
      ref: "E", title: "Your rights",
      clauses: [
        { n: "E.1", p: ["You may ask what is held, ask for a correction, ask for a copy in a " +
                        "portable form, object to processing that rests on legitimate interests, and " +
                        "ask for erasure where no retention obligation applies.",
                        "Requests are answered within thirty days. Where a request is refused, the " +
                        "reason and the obligation relied on are given."] },
        { n: "E.2", h: "Complaints",
          p: ["A complaint about data handling goes first to the procedure at /legal/complaints, " +
              "and then to the supervisory authority, whose route is given there."] },
      ],
    },
  ],
};

const COOKIES: StandingDocument = {
  id: "DOC-04",
  path: "/legal/cookies",
  title: "Cookie Notice",
  purpose: "What is stored on your device, and why there is no consent banner.",
  version: "2.0",
  effective: "2026-07-31",
  parts: [
    {
      ref: "A", title: "What is stored",
      clauses: [
        { n: "A.1", h: "Three, all strictly necessary",
          list: ["A session token, so you remain signed in. Removed when you sign out.",
                 "A security token that prevents a request being forged from another site.",
                 "A preference for reduced motion, where you have set one, so the setting survives " +
                 "a reload."] },
        { n: "A.2", h: "Nothing else",
          p: ["There is no analytics cookie, no advertising cookie, no third-party tag, and no " +
              "pixel. Nothing on this platform reports your reading to another company."],
          assertion: true },
      ],
    },
    {
      ref: "B", title: "Why there is no banner",
      clauses: [
        { n: "B.1", p: ["Consent is required for cookies that are not strictly necessary. All three " +
                        "of ours are, so there is nothing to consent to.",
                        "A banner asking permission for cookies that need none would train you to " +
                        "dismiss a question without reading it. That habit is worth more to us " +
                        "unspent."] },
      ],
    },
  ],
};

const DISCLOSURES: StandingDocument = {
  id: "DOC-05",
  path: "/legal/disclosures",
  title: "Standing Disclosures",
  purpose: "The disclosures that apply to everything on this platform, and where each one lives.",
  version: "2.0",
  effective: "2026-07-31",
  alongside: [
    { path: "/legal/terms", title: "Terms and Conditions",
      why: "Part L carries the standing disclosure in full." },
    { path: "/legal/risk-disclosure", title: "Risk Factors",
      why: "Part A carries it, before any specific risk." },
  ],
  parts: [
    {
      ref: "A", title: "Where the standing disclosure lives",
      intro:
        "This page does not restate the standing disclosure. It tells you where it is stated, and " +
        "links there.",
      clauses: [
        { n: "A.1", h: "One wording, two documents",
          p: ["The standing disclosure on capital at risk, past performance and advice is stated in " +
              "the Terms and Conditions at Part L, and in the Risk Factors at Part A.",
              "It is deliberately not repeated here, or on a banner, or in a footer. Wording " +
              "repeated in five places becomes five wordings the moment one is revised, and which " +
              "one you were shown then depends on which screen you were on. It is stated once so " +
              "that it can be revised once."],
          assertion: true },
      ],
    },
    {
      ref: "B", title: "The other standing positions",
      clauses: [
        { n: "B.1", h: "Getaway Collective holds no equity",
          p: ["Getaway Collective holds no economic interest in any vehicle it governs. It is paid " +
              "from stage two of the waterfall for the platform it operates, and from nothing else."] },
        { n: "B.2", h: "No preferred return, no carry",
          p: ["There is no preferred return, no catch-up and no carried interest anywhere in the " +
              "structure."] },
        { n: "B.3", h: "Confidence classes",
          p: ["Every forward-looking figure carries a class stating how it was arrived at. A figure " +
              "without one has not been assessed."] },
        { n: "B.4", h: "Conflicts",
          p: ["A register of conflicts is maintained and a conflicted party does not vote on the " +
              "matter concerned."] },
      ],
    },
  ],
};

const COMPLAINTS: StandingDocument = {
  id: "DOC-06",
  path: "/legal/complaints",
  title: "Complaints Procedure",
  purpose: "Who reads a complaint, how long each stage takes, and what to do if the answer is wrong.",
  version: "2.0",
  effective: "2026-07-31",
  parts: [
    {
      ref: "A", title: "How to complain",
      clauses: [
        { n: "A.1", p: ["Write to complaints@getawaycollective.in, or through the platform. State " +
                        "what happened, when, and what you would like done.",
                        "A complaint is acknowledged within two working days with a reference and " +
                        "the name of the person handling it."] },
      ],
    },
    {
      ref: "B", title: "The stages",
      clauses: [
        { n: "B.1", h: "Stage one — the desk",
          p: ["Answered within ten working days by someone who was not involved in what you are " +
              "complaining about."] },
        { n: "B.2", h: "Stage two — review",
          p: ["If the answer is unsatisfactory, ask for a review within three months. A review is " +
              "carried out by a person senior to the first responder and is answered within twenty " +
              "working days."] },
        { n: "B.3", h: "Stage three — outside",
          p: ["A final response states that it is final and tells you which external route is open " +
              "to you and by when it must be used. Where the complaint concerns a vehicle rather " +
              "than the platform, the route runs through the vehicle's own dispute clause."] },
      ],
    },
    {
      ref: "C", title: "What is recorded",
      clauses: [
        { n: "C.1", p: ["Every complaint is recorded with its subject, the time taken at each " +
                        "stage, and the outcome. The totals are published at /status each quarter, " +
                        "including the ones upheld against us."],
          assertion: true },
      ],
    },
  ],
};

const ACCESSIBILITY: StandingDocument = {
  id: "DOC-07",
  path: "/legal/accessibility",
  title: "Accessibility Statement",
  purpose: "What has been tested, what has been found, and what has not been tested at all.",
  version: "2.0",
  effective: "2026-07-31",
  parts: [
    {
      ref: "A", title: "What has been done",
      clauses: [
        { n: "A.1", h: "Contrast is computed, not eyeballed",
          p: ["Every text element on every route is measured against the ground it actually renders " +
              "on, in both colour schemes, with translucent layers composited. The most recent " +
              "sweep covered 88 routes and 2,176 text elements with no result below the AA " +
              "threshold.",
              "The measurement runs against the built application rather than the stylesheet, " +
              "because the defect it exists to catch — a colour valid on one ground used on the " +
              "other — is invisible in the source."],
          assertion: true },
        { n: "A.2", h: "Structure",
          list: ["Headings are ordered and not skipped.",
                 "Keyboard focus is always visible.",
                 "Motion respects a reduced-motion preference.",
                 "No control depends on colour alone to carry its meaning.",
                 "Numeric columns are set in tabular figures so they align."] },
      ],
    },
    {
      ref: "B", title: "What has not been done",
      intro: "Stated because an accessibility statement that lists only successes is marketing.",
      clauses: [
        { n: "B.1", h: "No assistive-technology testing",
          p: ["The platform has not been tested with a screen reader by a person who uses one. " +
              "Semantics have been written with care and verified in an accessibility tree, which " +
              "is not the same thing and should not be reported as though it were."],
          assertion: true },
        { n: "B.2", h: "No audit by a third party",
          p: ["No independent accessibility audit has been commissioned. The results above are our " +
              "own measurements."] },
        { n: "B.3", h: "Known gaps",
          list: ["Long financial tables scroll horizontally on narrow screens; no alternative view " +
                 "is offered yet.",
                 "The commitment control requires a sustained press, which is a barrier for some " +
                 "motor impairments. A non-timed alternative is not yet built.",
                 "Documents are rendered as pages rather than offered as tagged files."] },
      ],
    },
    {
      ref: "C", title: "Telling us",
      clauses: [
        { n: "C.1", p: ["If something here blocks you, write to access@getawaycollective.in. A " +
                        "barrier reported is answered within five working days with either a fix or " +
                        "a date."] },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   THE CORPUS
   ═══════════════════════════════════════════════════════════════════ */

export const DOCUMENTS: readonly StandingDocument[] = [
  TERMS, RISK_FACTORS, PRIVACY, COOKIES, DISCLOSURES, COMPLAINTS, ACCESSIBILITY,
];

export const documentByPath = (path: string): StandingDocument | undefined =>
  DOCUMENTS.find((d) => d.path === path);

/** Words in a document, counted rather than guessed. */
export function wordCount(d: StandingDocument): number {
  let n = 0;
  for (const part of d.parts) {
    n += part.title.split(/\s+/).length;
    if (part.intro) n += part.intro.split(/\s+/).length;
    for (const c of part.clauses) {
      if (c.h) n += c.h.split(/\s+/).length;
      for (const p of c.p ?? []) n += p.split(/\s+/).length;
      for (const l of c.list ?? []) n += l.split(/\s+/).length;
    }
  }
  return n;
}

/** At 220 words a minute, rounded up, never shown as zero. */
export const readingMinutes = (d: StandingDocument): number =>
  Math.max(1, Math.ceil(wordCount(d) / 220));

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  /* The standing disclosure must appear in exactly the two documents
     declared, and in no others. This is the constraint the whole file is
     arranged around, so it is checked rather than trusted. */
  const carriers = DOCUMENTS.filter((d) =>
    d.parts.some((part) => part.clauses.some((c) => c.p === STANDING_DISCLOSURE)),
  ).map((d) => d.path);

  const expected = [...DISCLOSURE_HOME].sort();
  if (JSON.stringify([...carriers].sort()) !== JSON.stringify(expected)) {
    throw new Error(
      `The standing disclosure must be rendered by exactly ${expected.join(" and ")}. ` +
        `Found: ${carriers.length ? carriers.join(", ") : "nowhere"}.`,
    );
  }

  /* Clause numbers must be unique within a document, or a cross-reference
     to "D.2" means two things. */
  for (const d of DOCUMENTS) {
    const ns = d.parts.flatMap((p) => p.clauses.map((c) => c.n));
    if (new Set(ns).size !== ns.length) {
      throw new Error(`${d.title} has a duplicate clause number`);
    }
  }

  /* Every clause must say something. */
  for (const d of DOCUMENTS) {
    for (const part of d.parts) {
      for (const c of part.clauses) {
        if (!(c.p?.length || c.list?.length)) {
          throw new Error(`${d.title} clause ${c.n} is empty`);
        }
      }
    }
  }
}
