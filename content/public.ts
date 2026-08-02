/**
 * THE PUBLIC PAGES
 *
 * Wave 8 · Content
 * Source: GC Collective Wireframes 2.0 — PUB.01 through PUB.11
 *
 * The copy for the public surface, as data, so the words and the layout
 * are never edited in the same operation.
 *
 * ── WHAT WAS CHANGED FROM THE WIREFRAMES, AND WHY ────────────────────
 *
 * 1. VOCABULARY. Six §25 terms appear in the source and are translated
 *    at the boundary, exactly as the SlowSpace dossier was. The wireframe
 *    may keep its own words; they do not cross into ours.
 *    vocab-lint-ignore "Concierge" "Invisible Service" "Guest Intent" "Studio OS" "Studios" "Terms of Service"
 *    Section 7 of PUB.01 carries two names in the source, one of them
 *    forbidden. The second — "The Signal" — is the one used here.
 *
 * 2. FIGURES. The wireframes carry indicative numbers: ₹89.0 lacs and
 *    16% on one property, ₹30L for 10% and 15% on another, a $4.2B
 *    combined AUM, 112 years of execution. None are in any registry.
 *
 *    Every figure rendered on these pages is read from the property
 *    records or from slowspace.ts instead. Where a wireframe number has
 *    no record behind it, the page does not show a number — it says what
 *    is true and links to where the figure lives. A headline figure with
 *    no source is the one thing on a public page most likely to be
 *    quoted back, and the least defensible when it is.
 *
 * 3. NAMED THIRD PARTIES. The partner grid names real firms — Trilegal,
 *    JLL, Deloitte, Mathew & Ghosh — and the press page names real
 *    publications with quotes attributed to them. Those are claims about
 *    other people, and none is evidenced anywhere in this repository.
 *    They are carried as clearly-marked PLACEHOLDERS with the real names
 *    removed, and each page states that its roster is unpopulated. An
 *    unverified endorsement rendered as a real one is a legal problem
 *    before it is a design problem.
 */

/* ═══════════════════════════════════════════════════════════════════
   FOUR SHAPES A PANE CAN TAKE

   Every public page was a stack of prose panes, because that is all the
   renderer could do. Four signed-off references arrange the same kinds
   of information differently, and each arrangement earns its keep:

     ledger   the syndicate row — who holds what, and its actual state
     sequence a numbered run where the ORDER is the information
     faq      questions, closed by default, opened one at a time
     plates   a media grid where every plate declares what it IS

   They are declared in the content, not built per page, so the remaining
   scaffolds become content entries rather than hand-written screens.
   Adding a fifth arrangement is a change here and in one renderer; it is
   not a change to eleven pages.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * A row in a ledger of engagements.
 *
 * From the_syndicate.html, with its verification theatre removed. The
 * source ran a 1.2-second delay and then printed VERIFIED plus a random
 * hex string as though a hash had been checked. Nothing was checked, and
 * a fabricated receipt beside a real firm's name is the single most
 * damaging thing on that page. `state` here is read from the record and
 * `Vacant` is a legitimate value.
 */
export interface LedgerRow {
  /** Stable reference. Displayed, so it can be quoted back. */
  ref: string;
  /** The function. Stated before anyone is named to it. */
  role: string;
  /** Withheld until the engagement is recorded. Absent is not a gap to fill with a plausible name. */
  holder?: string;
  what: string;
  state: "Vacant" | "Recorded" | "In appointment" | "Under contract";
  /** Only where `state` is not Vacant. */
  since?: string;
}

export interface SequenceStep {
  n: string;
  t: string;
  d: string;
  /** Sub-items, where the step has parts worth naming. */
  parts?: readonly string[];
}

export interface Question {
  q: string;
  a: string;
}

/**
 * A plate in a media grid.
 *
 * `kind` is required and has no default. A portfolio of renders shown as
 * photographs is the commonest misrepresentation in this industry, and
 * the type of the image is the one field that prevents it — so it cannot
 * be omitted.
 */
export interface Plate {
  id: string;
  kind: "Photograph" | "Render" | "Drawing" | "Diagram" | "Not yet made";
  what: string;
  spec: string;
}

export interface Pane {
  /** Two digits, as displayed. */
  n: string;
  eyebrow: string;
  title: string;
  /** Void is narrative; paper is an assertion the platform is held to. */
  ground: "void" | "paper";
  lede?: string;
  body?: readonly string[];
  list?: readonly { k: string; v: string }[];
  ledger?: readonly LedgerRow[];
  sequence?: readonly SequenceStep[];
  faq?: readonly Question[];
  plates?: readonly Plate[];
  /** Shown only where a registry stands behind it. */
  note?: string;
  cta?: { label: string; href: string };
}

export interface PublicPage {
  id: string;
  path: string;
  alias: string;
  title: string;
  standfirst: string;
  intent: string;
  panes: readonly Pane[];
  /** Stated on the page when its data is not yet real. */
  unpopulated?: string;
}

/* ═══════════════════════════════════════════════════════════════════
   PUB.01 · THE ROOT
   ═══════════════════════════════════════════════════════════════════ */

export const ROOT: PublicPage = {
  id: "PUB.01",
  path: "/",
  alias: "The Gateway",
  title: "Getaway Collective",
  standfirst: "We do not sell holidays.",
  intent: "Immersion, then the three levers, then the assets themselves.",
  panes: [
    {
      n: "01", eyebrow: "The Gateway", ground: "void",
      title: "We do not sell holidays.",
      lede:
        "We build infrastructure for people who want to own a place outright and never think " +
        "about running it. A capital position in a single property, and the nights that come " +
        "with it.",
      body: [
        "Two ways in, and they are not the same decision. Capital is an ownership interest in a " +
        "body corporate that holds one property. Space is the property itself — what was built, " +
        "where, and what it costs to keep standing.",
      ],
    },
    {
      n: "02", eyebrow: "The Manifesto", ground: "void",
      title: "Silence and time are the scarce resources.",
      body: [
        "Everything on this platform is arranged around returning two things that money buys " +
        "badly. A property you part-own does not need to be booked, negotiated for, or left in " +
        "the state the last person left it.",
        "The financial case is stated separately and in full, because a place you enjoy and an " +
        "asset that performs are two claims and each has to stand on its own.",
      ],
      cta: { label: "How capital works", href: "/collection/slowspace-coastal/investment" },
    },
    {
      n: "03", eyebrow: "The Triad", ground: "paper",
      title: "Space · Capital · Time",
      lede: "Three levers. Each is measured differently, and each can fail on its own.",
      list: [
        { k: "Space", v: "Architectural silence. One property, one body corporate, one title." },
        { k: "Capital", v: "A contribution-weighted interest. Six-stage waterfall, debt service stated as its own stage." },
        { k: "Time", v: "Nights in proportion to contribution. An incident of the position, never the product." },
      ],
      note: "Every figure behind these is on the property record and in the vehicle's Agreement.",
      cta: { label: "The collection", href: "/collection" },
    },
    {
      n: "04", eyebrow: "The Assets", ground: "void",
      title: "Three properties, at three stages.",
      lede:
        "Stage decides what can honestly be shown. A stabilised property has a trading record; " +
        "one in lease-up has a forecast; one that is not built has a programme.",
      note: "Valuations, yields and confidence classes are read from the property records.",
      cta: { label: "Open the collection", href: "/collection" },
    },
    {
      n: "05", eyebrow: "The Signal", ground: "void",
      title: "We appear when summoned.",
      body: [
        "Operation is carried out by an operating partner under contract to the vehicle, measured " +
        "against a Service Level. The intent is that nothing has to be asked for twice and " +
        "nobody is met at a desk.",
        "That is an operating promise, not a financial one. It is paid for at stage one of the " +
        "waterfall, before anything reaches partners, and it is stated there rather than here.",
      ],
    },
    {
      n: "06", eyebrow: "The Proof", ground: "void",
      title: "What partners say.",
      lede:
        "Held separately, because a partner talking about returns is regulated speech with " +
        "attribution and verification obligations attached.",
      cta: { label: "Voices", href: "/voices" },
    },
    {
      n: "07", eyebrow: "The Authority", ground: "void",
      title: "Builders, not brokers.",
      body: [
        "Getaway Collective operates the platform, admits and verifies partners, administers the " +
        "register and enforces the constitutional rules. It holds no equity in any vehicle it " +
        "governs, and that clause is entrenched.",
        "The consequence is that the party setting the rules does not profit from the outcome " +
        "those rules produce.",
      ],
      cta: { label: "The mesh behind the asset", href: "/collective/partners" },
    },
    {
      n: "08", eyebrow: "The Blueprint", ground: "paper",
      title: "The physics of restoration.",
      list: [
        { k: "Mass and acoustics", v: "Heavy wall sections, chosen for what they keep out." },
        { k: "Solar orientation", v: "Passive cooling before mechanical cooling." },
        { k: "View corridor", v: "Sightlines set so privacy does not depend on curtains." },
      ],
      cta: { label: "Read the manifesto", href: "/how-it-works" },
    },
    {
      n: "09", eyebrow: "The Signal", ground: "paper",
      title: "Weekly intelligence on solitude and assets.",
      lede: "One transmission a week. No tracking pixel, and the list is never sold.",
      cta: { label: "Tune in", href: "/signal" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.02 / PUB.11 · THE MANIFESTO
   ═══════════════════════════════════════════════════════════════════ */

export const MANIFESTO: PublicPage = {
  id: "PUB.02",
  path: "/how-it-works",
  alias: "The Mechanism",
  title: "Modern luxury is the absence of noise",
  standfirst: "The doctrine, then the arithmetic that has to survive it.",
  intent: "Philosophy in the void, then a hard cut to the numbers on paper.",
  panes: [
    {
      n: "01", eyebrow: "The Void", ground: "void",
      title: "You have conquered the market. Now the quiet.",
      body: [
        "The scarce thing is not another asset class. It is a place that is yours, that runs " +
        "without you, and that does not require a decision every time you want to be there.",
      ],
    },
    {
      n: "02", eyebrow: "The Conflict", ground: "void",
      title: "The friction is the product, elsewhere.",
      body: [
        "A second home is a staffing problem, a maintenance schedule and a caretaker you have " +
        "never met. A hotel is a transaction repeated forever, with nothing accruing.",
        "Fractional ownership without governance is the worst of both: ten people who must agree " +
        "unanimously on every act of management, and no mechanism when they do not.",
      ],
      cta: { label: "Why a body corporate", href: "/journal/why-a-body-corporate" },
    },
    {
      n: "03", eyebrow: "The Pivot", ground: "paper",
      title: "The mechanism, in order.",
      lede: "A hard cut, because this part is arithmetic and should not feel like atmosphere.",
      list: [
        { k: "The vehicle", v: "One property, one Limited Liability Partnership. It owns the asset; you contract with it." },
        { k: "The unit", v: "A contribution-weighted interest, taken in units of 5%. Twenty units are the whole equity layer, exactly, and a position is a whole number of them — from one to ten." },
        { k: "The waterfall", v: "Six stages in order, closing to 100%. Debt service is stage five and stands on its own." },
        { k: "The entitlement", v: "Nights in proportion to contribution, beginning at handover and not before." },
      ],
      cta: { label: "The waterfall in full", href: "/collection/slowspace-coastal/investment" },
    },
    {
      n: "04", eyebrow: "The Execution", ground: "paper",
      title: "What happens, and when.",
      lede:
        "Numbered because the order is the information — none of these can be taken out of " +
        "sequence, and the last one cannot be undone.",
      /* The sequence arrangement, from how_it_works.html. Its five steps
         were Discover / Understand / Become a Member / Reserve / Live,
         which is a marketing arc rather than a sequence of events: the
         moment a person becomes a partner is buried in the middle of it
         and "Live" is not a step, it is what follows the last one. These
         are the five events that actually occur, in the order they
         occur, and step five is where the Member Law fires. */
      sequence: [
        { n: "01", t: "Choose a size", d:
          "5% is the minimum and the increment, up to 50%. The figure you select carries through " +
          "every screen that follows and can be changed until the commitment.",
          parts: ["Commitment", "Distribution share", "Entitlement", "Voting weight"] },
        { n: "02", t: "Accreditation", d:
          "Identity, tax residency and source of funds. Fifteen working days from submission. " +
          "Every field saves as you leave it, so it does not have to be done in one sitting." },
        { n: "03", t: "The disclosure", d:
          "The Hospitality Asset Disclosure for the specific property, acknowledged with your " +
          "identity and the time. It states partial and total loss of capital in those words." },
        { n: "04", t: "Deposit and commitment", d:
          "A flat ₹50,000 holds the position — the same amount at every size. It buys nothing " +
          "and makes nobody a partner. The balance, the Agreement and the transfer of funds all " +
          "complete off the platform." },
        { n: "05", t: "Settlement", d:
          "The Member Law fires when cleared funds reach the vehicle — not on acceptance, not " +
          "on the commitment. Governance rights and entitlement begin at that moment, and it is " +
          "irreversible." },
      ],
      cta: { label: "Walk it end to end", href: "/flow" },
    },
    {
      n: "05", eyebrow: "The Exit", ground: "paper",
      title: "Liquidity, stated as it is.",
      body: [
        "There is no public market, no market maker, and no obligation on anyone to buy your " +
        "position at any price. A position is locked for the period in the vehicle's Agreement.",
        "An internal register of partners willing to buy and sell is operated as a courtesy. It " +
        "is a noticeboard. It does not guarantee a counterparty and it does not establish a price.",
      ],
      note: "This is the risk most often softened elsewhere. It is stated here at the same size as everything else.",
      cta: { label: "The full disclosure", href: "/legal/risk-disclosure" },
    },
    {
      n: "06", eyebrow: "The Pledge", ground: "void",
      title: "What we do not do.",
      list: [
        { k: "No advice", v: "Not a registered investment adviser. No personalised financial advice." },
        { k: "No guarantee", v: "No preferred return, no floor, no shortfall made up from elsewhere." },
        { k: "No market", v: "The internal register is a noticeboard, and calling it anything else would imply an obligation nobody has taken on." },
        { k: "No unclassed figure", v: "A forward-looking number appears with its confidence class or it does not appear." },
      ],
      cta: { label: "The whole list, with reasons", href: "/journal/what-this-platform-does-not-do" },
    },
    {
      n: "07", eyebrow: "Clarity", ground: "paper",
      title: "The questions that get asked.",
      /* The accordion, from how_it_works.html. That page listed ten
         questions and gave all ten the SAME answer — a paragraph saying
         the specifics are in the prospectus. Ten questions resolving to
         "it is written down elsewhere" is a page that looks like it
         answers things. Each of these has its own answer, and a question
         we cannot answer is not on the list. */
      faq: [
        { q: "What am I actually buying?",
          a: "A contribution-weighted interest in a Limited Liability Partnership that owns one " +
             "property. Not a share in Getaway Collective, and not a right to a specific key in " +
             "a specific building. The LLP holds the land title; you are one of its partners." },
        { q: "How small a position can I take?",
          a: "5% of the vehicle, which for SlowSpace Coastal is ₹20,00,000. Positions are taken " +
             "in whole 5% units up to a ceiling of 50%." },
        { q: "Why is 50% the ceiling?",
          a: "An ordinary resolution carries on more than half of contribution, so a partner " +
             "above 50% would carry every one of them alone and the rest of the register would " +
             "vote for the record only. At exactly 50% that partner can block anything and carry " +
             "nothing, which is the last point at which this is still a partnership." },
        { q: "Does a bigger position earn a better rate?",
          a: "No. Distribution and commitment scale by the same factor, so the rate is identical " +
             "at every size — a larger holding is a larger share of the same pool at the same " +
             "rate. Both figures are shown separately for exactly that reason." },
        { q: "How many nights does a position carry?",
          a: "Entitlement is a pool for the whole property, divided by contribution and rounded " +
             "down, so the sum of every partner's nights can never exceed what the property can " +
             "deliver. It begins at handover and not before — nothing is drawable against an " +
             "asset that has not been built." },
        { q: "Is the deposit a percentage of what I commit?",
          a: "No. It is a flat ₹50,000 and it does not move with the size of the position. It " +
             "reserves the position and is refundable in full until the Vehicle Agreement is " +
             "signed." },
        { q: "When do I become a partner?",
          a: "When cleared funds reach the vehicle. Not when an application is accepted, and not " +
             "when the commitment is made. Everything before that point says Committed, and the " +
             "screens are explicit about the difference because the difference is the whole of " +
             "it." },
        { q: "Can I sell?",
          a: "There is no public market, no market maker and no obligation on anyone to buy at " +
             "any price. A position is locked for the period stated in the vehicle's Agreement. " +
             "After that, an internal register of partners willing to buy and sell is operated " +
             "as a noticeboard — it does not guarantee a counterparty and it does not establish " +
             "a price." },
        { q: "Who decides how the property is run?",
          a: "The partners, weighted by contribution. More than 50% carries an ordinary " +
             "resolution and a tie is not approval; 76% carries a special resolution; a small " +
             "number of matters are entrenched and need all of it. Getaway Collective governs " +
             "the vehicle and holds no equity in it, so it casts no vote." },
        { q: "What happens if the property earns nothing?",
          a: "Partners are stage six of six. Operating costs, the brand licence, the admin " +
             "reserve, the sinking fund and debt service are all satisfied first, so a " +
             "profitable period can still distribute nothing if the reserves or the facility " +
             "require the cash to be retained. Capital is not protected by any guarantee, " +
             "insurance or compensation scheme." },
      ],
      cta: { label: "The full risk disclosure", href: "/legal/risk-disclosure" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.05 · THE PARTNERS
   ═══════════════════════════════════════════════════════════════════ */

export const PARTNERS: PublicPage = {
  id: "PUB.05",
  path: "/collective/partners",
  alias: "The Foundation",
  title: "The Foundation",
  standfirst:
    "We do not build in isolation. A mesh of independent firms holds the parts of this that " +
    "we should not be holding ourselves.",
  intent: "Credibility, by naming who is accountable for what — and for what they are not.",
  unpopulated:
    "This roster is not yet populated. The wireframe named six firms; naming a professional " +
    "adviser is a claim about them, not about us, and none of these appointments is evidenced " +
    "anywhere in this system yet. The structure is here and the names are withheld until each " +
    "engagement is recorded against the vehicle it serves.",
  panes: [
    {
      n: "01", eyebrow: "The Foundation", ground: "void",
      title: "Civilization is a pact between the architecture of space and the architecture of law.",
      body: [
        "Independence is the point. An architect who reports to the promoter is not a check on " +
        "the promoter, and an auditor engaged by the party being audited is a formality.",
        "Each appointment below runs to a vehicle rather than to Getaway Collective, and each is " +
        "recorded against that vehicle with the date it began.",
      ],
    },
    {
      n: "02", eyebrow: "The Mesh", ground: "paper",
      title: "Who holds what.",
      /* The ledger arrangement, from the_syndicate.html. Its three rows
         named Khaitan & Co, Khosla Associates and CBRE India and offered
         a button that printed VERIFIED plus a random hex string. The
         arrangement is right and is kept; the names and the receipt are
         not, and `state` below is the field that replaces them. */
      ledger: [
        { ref: "GC-ARC-01", role: "Architecture", state: "Vacant",
          what: "Design and specification. Signs the drawings that are built from." },
        { ref: "GC-SPA-02", role: "Spatial strategy", state: "Vacant",
          what: "Siting, orientation and view corridors, fixed before any structure is." },
        { ref: "GC-LEG-03", role: "Governance counsel", state: "Vacant",
          what: "The LLP Agreement and the constitutional instruments. Advises the vehicle, not the platform." },
        { ref: "GC-SUS-04", role: "Sustainability", state: "Vacant",
          what: "Material selection and lifecycle. Reports findings whether or not they are convenient." },
        { ref: "GC-OPS-05", role: "Facility operations", state: "Vacant",
          what: "Runs the property under contract to the vehicle, measured against a Service Level." },
        { ref: "GC-AUD-06", role: "Statutory audit", state: "Vacant",
          what: "Audits each vehicle. Appointed by the partners, not by us." },
      ],
      note: "Each row is a function, stated before anyone is named to it. Six functions, six vacancies — a function with no holder is shown rather than omitted, and none of these states is changed by anything you can press on this page.",
    },
    {
      n: "03", eyebrow: "The Seal", ground: "paper",
      title: "What a badge is worth.",
      body: [
        "A logo on a page is not a seal of approval, and a rail of them is a design device rather " +
        "than evidence. Where a firm is engaged, the engagement is recorded against the vehicle, " +
        "with its scope and its date, and that record is what a partner can rely on.",
      ],
      cta: { label: "Who runs the machine", href: "/collective/operators" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.06 · THE OPERATORS
   ═══════════════════════════════════════════════════════════════════ */

export const OPERATORS: PublicPage = {
  id: "PUB.06",
  path: "/collective/operators",
  /* The wireframe's alias for this page ends in a §25 forbidden noun.
     Shortened rather than paraphrased — the sense survives the cut. */
  alias: "The Engine",
  title: "The Invisible Hand",
  standfirst:
    "We removed the friction of the front desk to engineer the intimacy of the home.",
  intent: "Operational proof: what runs the property, and who is accountable when it does not.",
  panes: [
    {
      n: "01", eyebrow: "The System", ground: "void",
      title: "Four layers, one accountable party.",
      ledger: [
        { ref: "OPS-L1", role: "Intent", state: "Under contract", since: "2026-06-19",
          holder: "Sensory Getaways",
          what: "What is asked for, however it is asked — a message, a schedule, or nothing at all." },
        { ref: "OPS-L2", role: "Core", state: "Under contract", since: "2026-06-19",
          holder: "Sensory Getaways",
          what: "The logic that decides what that means for the property, and what it costs." },
        { ref: "OPS-L3", role: "Site", state: "Under contract", since: "2026-06-19",
          holder: "Sensory Getaways",
          what: "The building itself: light, heat, water, access." },
        { ref: "OPS-L4", role: "Dispatch", state: "Under contract", since: "2026-06-19",
          holder: "Sensory Getaways",
          what: "A person, sent only when the first three cannot resolve it." },
      ],
      note: "One holder across all four, which is the point: there is a single accountable party rather than a chain of them. Every layer runs under contract to the vehicle. Getaway Collective operates none of it and holds no equity in the vehicle it governs.",
    },
    {
      n: "02", eyebrow: "The Human Layer", ground: "void",
      title: "People, deployed on a rule.",
      body: [
        "The people who run a property are not a feature to be photographed. Each role has a " +
        "deployment rule — when it acts, and when it deliberately does not — and the rule is the " +
        "thing worth publishing.",
        "Discretion is a rule, not a manner. A role that only enters when the property is empty " +
        "is a rule; a promise to be discreet is a hope.",
      ],
    },
    {
      n: "03", eyebrow: "Accountability", ground: "paper",
      title: "What happens when it fails.",
      body: [
        "The operating partner is measured against a Service Level and is paid from stage one of " +
        "the waterfall — before the brand, before the reserves, before debt service and before " +
        "partners.",
        "It can be replaced. Replacement takes time, and the property earns less while it " +
        "happens; that cost falls on partners and is disclosed as a risk rather than described " +
        "as a safeguard.",
      ],
      cta: { label: "Where that sits in the waterfall", href: "/collection/slowspace-coastal/investment" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.07 · THE DOSSIER
   ═══════════════════════════════════════════════════════════════════ */

export const DOSSIER: PublicPage = {
  id: "PUB.07",
  path: "/communique/request",
  alias: "The Handshake",
  title: "Request the asset intelligence pack",
  standfirst: "One document, sent once. What requesting it does is stated before you request it.",
  intent: "Lead capture, with the consequence disclosed rather than concealed.",
  panes: [
    {
      n: "01", eyebrow: "What this is", ground: "void",
      title: "A dossier, not a brochure.",
      body: [
        "The pack carries the capital stack, the waterfall, the programme and the risks for the " +
        "properties currently open. It is the same material a partner sees, without the parts " +
        "that identify other partners.",
      ],
    },
    {
      n: "02", eyebrow: "What it does", ground: "paper",
      title: "Requesting this creates a record.",
      body: [
        "Your name and address are held from the moment you submit, under the Privacy Notice. A " +
        "candidate record is created, and it is a record of interest — not an application, not " +
        "accreditation, and not a commitment to anything.",
        "The wireframe for this page described the record as a trap and the request as covert. " +
        "It is neither. It is stated here, above the form, because a consequence disclosed after " +
        "the fact was not disclosed.",
      ],
      note: "Ask us to delete it at any time and it goes, unless an anti-money-laundering retention period has already started — which it has not, at this stage.",
      cta: { label: "What is held, and for how long", href: "/legal/privacy" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.09 · THE SIGNAL
   ═══════════════════════════════════════════════════════════════════ */

export const SIGNAL: PublicPage = {
  id: "PUB.09",
  path: "/signal",
  alias: "The Uplink",
  title: "The Signal",
  standfirst: "Weekly intelligence on solitude and assets. One transmission, no more.",
  intent: "Subscription, without the dark patterns that usually come with it.",
  panes: [
    {
      n: "01", eyebrow: "What arrives", ground: "void",
      title: "One a week, and it is mostly arithmetic.",
      list: [
        { k: "What changed", v: "Movements on the properties, with the confidence class of each figure." },
        { k: "What was decided", v: "Resolutions put and carried, and the thresholds they had to clear." },
        { k: "What was written", v: "New Journal entries, which are the same material at greater length." },
      ],
    },
    {
      n: "02", eyebrow: "The terms", ground: "paper",
      title: "What we will not do with your address.",
      list: [
        { k: "Not sold", v: "Ever, to anyone, including in an acquisition." },
        { k: "Not tracked", v: "No pixel, no open tracking, no click attribution." },
        { k: "One list", v: "Subscribing here does not enrol you in anything else." },
        { k: "One click out", v: "Unsubscribe is a link in every transmission and takes effect immediately." },
      ],
      note: "The tuner in the wireframe was a gate: the form appeared only once a control had been dragged into place. A subscription form that has to be earned is a puzzle, and it excludes anyone using a keyboard or a screen reader. The form is simply here.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.10 · THE WIRE
   ═══════════════════════════════════════════════════════════════════ */

export const WIRE: PublicPage = {
  id: "PUB.10",
  path: "/collective/press",
  alias: "The Evidence Board",
  title: "The Wire",
  standfirst: "External transmissions. What has been written about us, by people who are not us.",
  intent: "Validation, from sources that can be checked.",
  unpopulated:
    "Nothing here yet. The wireframe carried six clippings attributed to named publications, " +
    "with quotes. None of those has been published, and rendering an invented quotation under a " +
    "real masthead is a fabrication before it is a placeholder. The page ships empty and says " +
    "so, and each entry will carry its outlet, its date and a link to the original.",
  panes: [
    {
      n: "01", eyebrow: "The record", ground: "paper",
      title: "Every entry carries its source.",
      list: [
        { k: "Outlet", v: "Named, with the date of publication." },
        { k: "Link", v: "To the original, not to a copy hosted here." },
        { k: "Context", v: "Whether it was commissioned, briefed, or written independently." },
      ],
      note: "A clipping with no link is an assertion. The distinction between a commissioned piece and an independent one is stated because it changes what the piece is worth.",
    },
    {
      n: "02", eyebrow: "The Kit", ground: "paper",
      title: "What a desk can use today.",
      lede:
        "Three of these exist and are generated from the palette rather than drawn, so they " +
        "cannot drift from it. The rest are commissioned and are listed as absent.",
      plates: [
        { id: "GC/MARK-01", kind: "Diagram", what: "Monogram, for a favicon or a tab",
          spec: "PNG · 1:1 · 512 × 512 · generated from app/icon.tsx" },
        { id: "GC/MARK-02", kind: "Diagram", what: "Monogram, for a home-screen icon",
          spec: "PNG · 1:1 · 180 × 180 · generated from app/apple-icon.tsx" },
        { id: "GC/CARD-01", kind: "Diagram", what: "Share card, type only",
          spec: "PNG · 1.91:1 · 1200 × 630 · generated from app/opengraph-image.tsx" },
        { id: "GC/PORT-01", kind: "Not yet made", what: "Principals, for an editorial byline",
          spec: "Photograph · 4:5 · 4000 × 5000 · not commissioned" },
        { id: "GC/SITE-01", kind: "Not yet made", what: "The property, for a feature",
          spec: "Photograph · 3:2 · 6000 × 4000 · nothing is built" },
      ],
      note:
        "The media kit this was adapted from listed three 45 MB photographs at 8K and a secure " +
        "PDF behind a download that scrambled its own label for eight hundred milliseconds. None " +
        "of those files exists. What is here is what a desk can actually be sent.",
    },
  ],
};


/* ═══════════════════════════════════════════════════════════════════
   SPACE · THE PHYSICAL PRODUCT
   Wireframes 2.0 · "/space." — GC.WF.E + GC.WF.C
   ═══════════════════════════════════════════════════════════════════ */

export const SPACE: PublicPage = {
  id: "PUB.12",
  path: "/space",
  alias: "The Architecture of Silence",
  title: "The architecture of silence",
  standfirst: "We do not build villas. We build machines for restoration.",
  intent: "Define the physical product: what is built, from what, and what it costs to keep standing.",
  panes: [
    {
      n: "01", eyebrow: "The Definition", ground: "void",
      title: "Not a house. An instrument for looking at a place.",
      body: [
        "Every decision in the envelope is made against one test: does this reduce what reaches " +
        "the person inside. Mass, orientation, sightlines and acoustics are the whole of it, and " +
        "each is measurable.",
      ],
    },
    {
      n: "02", eyebrow: "The Equation", ground: "paper",
      title: "Land, envelope, operation.",
      lede: "Three inputs. Each is bought separately, and each fails separately.",
      list: [
        { k: "Land", v: "Held by the vehicle, on its own title. It is the part that does not depreciate and the part that cannot be moved if the market moves." },
        { k: "Envelope", v: "The built shell. Specified for mass and acoustics before finish, because finish is the part a visitor notices and the part that matters least in ten years." },
        { k: "Operation", v: "Carried out by an operating partner under contract to the vehicle, paid at stage one of the waterfall." },
      ],
      note:
        "The wireframe wrote a build area and a market into this section. Neither is in any " +
        "registry, and both differ per property. They are on the property record instead.",
      cta: { label: "The property records", href: "/collection" },
    },
    {
      n: "03", eyebrow: "The Materiality", ground: "paper",
      title: "What the specification is for.",
      list: [
        { k: "Mass", v: "Heavy wall sections. Chosen for what they keep out, and for a thermal lag that removes most of the mechanical cooling." },
        { k: "Orientation", v: "Set from the sun path before the plan is fixed, so shading is structural rather than added." },
        { k: "Water and power", v: "Off-grid capable, which is a resilience decision before it is an environmental one." },
        { k: "Sightlines", v: "Privacy that does not depend on curtains, because a curtain is a thing somebody has to remember." },
      ],
      note:
        "Specification is a claim that can be checked against a drawing. Adjectives are not, and " +
        "there are none here.",
    },
    {
      n: "04", eyebrow: "Operation", ground: "void",
      title: "The property runs without you, and without us.",
      body: [
        "Getaway Collective does not operate any property. An operating partner does, under a " +
        "Commercial Services Agreement with the vehicle, measured against a Service Level.",
        "The intent is that a partner arrives and finds the place as it should be, with nothing " +
        "asked of them and nobody met at a desk. That is an operating promise. It is paid for " +
        "before anything reaches partners, and it can fail.",
      ],
      cta: { label: "Who runs it, and who answers", href: "/collective/operators" },
    },
    {
      n: "05", eyebrow: "The Assets", ground: "void",
      title: "What exists, and at what stage.",
      lede:
        "Stage decides what can honestly be shown. A stabilised property has a record; one in " +
        "lease-up has a forecast; one that is not built has a programme and nothing else.",
      cta: { label: "Open the collection", href: "/collection" },
    },
    {
      n: "06", eyebrow: "The Triad", ground: "void",
      title: "Space is one of three.",
      list: [
        { k: "Capital", v: "What the position is, what it pays, and in what order." },
        { k: "Time", v: "Nights, how many, and when they begin." },
      ],
      cta: { label: "How capital works", href: "/collection/slowspace-coastal/investment" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   TIME · THE RETURN ON ATTENTION
   Wireframes 2.0 · "3.0 TIME PAGE"
   ═══════════════════════════════════════════════════════════════════ */

export const TIME: PublicPage = {
  id: "PUB.13",
  path: "/time",
  alias: "The Return on Attention",
  title: "Time as an asset",
  standfirst: "Nights in proportion to contribution. An incident of the position, never the product.",
  intent: "Define what entitlement is, what it is not, and when it begins.",
  panes: [
    {
      n: "01", eyebrow: "The Definition", ground: "void",
      title: "Not an escape. A recalibration.",
      body: [
        "The wireframe frames this as reclaiming attention, and that framing is kept. What is not " +
        "kept is any suggestion that the nights are what you are buying.",
      ],
    },
    {
      n: "02", eyebrow: "The Instrument", ground: "paper",
      title: "What entitlement actually is.",
      list: [
        { k: "Proportional", v: "Nights follow contribution. A ten per cent partner draws a tenth of the available span." },
        { k: "Not carried forward", v: "Nights untaken in a year do not accrue and are not exchanged for money." },
        { k: "Not separately priced", v: "Entitlement is an incident of the position. A position whose nights went untouched for a decade is worth exactly what it was worth the day it settled." },
        { k: "Begins at handover", v: "Nothing is drawable against an unbuilt asset, and the figure before then is zero rather than a promise." },
      ],
      note:
        "A released night is sold and its revenue enters the waterfall at stage one, like any " +
        "other. So a partner who draws nothing is paid slightly more, and one who draws their " +
        "full span slightly less. Neither is penalised; the arithmetic simply follows.",
    },
    {
      n: "03", eyebrow: "Precedence", ground: "paper",
      title: "Who gets the last weekend in December.",
      body: [
        "Where more partners want the same dates than the property can hold, the partner who has " +
        "drawn least that year goes first. Not the largest position, and not the earliest request.",
        "Weighted voting decides money. It does not decide dates, and a system in which the " +
        "largest holder always won would make the entitlement worth having only for the largest " +
        "holder.",
      ],
      cta: { label: "Stated as an obligation", href: "/legal/terms" },
    },
    {
      n: "04", eyebrow: "Liquidity", ground: "paper",
      title: "On exchanging time.",
      body: [
        "The wireframe specifies an exchange console — a market in nights, with a price. That is " +
        "not built, and it is not described here as though it were.",
        "Making entitlement tradeable would turn a night into an instrument with a price, which " +
        "changes what the position is and what regulates it. It is a decision for the partners of " +
        "a vehicle, by resolution, and not one to be announced on a public page first.",
      ],
      note: "Stated rather than omitted, because the wireframe promises it and a reader may have seen it.",
    },
    {
      n: "05", eyebrow: "The Triad", ground: "void",
      title: "Time is one of three.",
      list: [
        { k: "Space", v: "What is built, from what, and what it takes to keep standing." },
        { k: "Capital", v: "What the position pays, and in what order." },
      ],
      cta: { label: "The physical product", href: "/space" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   PUB.08 · THE EVIDENCE PORTFOLIO
   ═══════════════════════════════════════════════════════════════════ */

export const EVIDENCE: PublicPage = {
  id: "PUB.08",
  path: "/collective/gallery",
  alias: "The Proof",
  title: "The Evidence Portfolio",
  standfirst: "Heavy cardstock on an architect's desk, rather than an infinite feed.",
  intent: "Show what has been built, with the provenance of each image attached to it.",
  unpopulated:
    "No plates yet. Every property in the collection is at pre-construction, lease-up or " +
    "stabilised-without-a-photographic-record, and a portfolio filled with renders presented as " +
    "photographs is the single most common misrepresentation in this industry. Each plate will " +
    "carry what it is — photograph, render or drawing — and the date it was made.",
  panes: [
    {
      n: "01", eyebrow: "The Rule", ground: "paper",
      title: "Every plate says what it is.",
      list: [
        { k: "Photograph", v: "Of the thing as built, with the date taken." },
        { k: "Render", v: "Of a thing not yet built. Labelled on the plate itself, not in a caption below it." },
        { k: "Drawing", v: "A section or plan. The most honest of the three, and the least flattering." },
      ],
      note:
        "A render and a photograph are different claims. Rendering them identically is a lie that " +
        "requires no words, and it is the reason this page ships empty rather than full.",
    },
    {
      n: "02", eyebrow: "The Weight", ground: "paper",
      title: "Deliberate, not endless.",
      body: [
        "The wireframe asks for archival friction — plates that turn rather than slide, and a " +
        "scroll that resists. The friction is kept as restraint on quantity rather than as a " +
        "physics effect: a portfolio of twelve considered plates says more than a feed of two " +
        "hundred.",
      ],
      cta: { label: "The property records", href: "/collection" },
    },
    {
      n: "03", eyebrow: "The Manifest", ground: "paper",
      title: "What is required, and what exists.",
      lede:
        "The plate grid from the media kit, populated with the brief rather than with stock " +
        "photography. Every entry states its kind, and every kind here is the same one.",
      /* MediaKit.html rendered three Unsplash photographs as
         DRIFT_EXTERIOR_01.RAW at 45MB and 8K resolution. That asserts a
         photographic record of a built property. SlowSpace Coastal is at
         pre-construction; there is nothing to photograph. The grid is
         kept because a media kit is genuinely useful — but populated
         with what has to be made, at the specification it has to be made
         to, so the page is a commission rather than a claim. */
      plates: [
        { id: "PDB-01/EXT-01", kind: "Not yet made", what: "Approach from the sandbar, west elevation",
          spec: "Photograph · 3:2 · 6000 × 4000 · after handover, Jan 2028" },
        { id: "PDB-01/EXT-02", kind: "Not yet made", what: "Estuary frontage, east elevation at first light",
          spec: "Photograph · 3:2 · 6000 × 4000 · after handover" },
        { id: "PDB-01/INT-01", kind: "Not yet made", what: "A single key, interior, unstaged",
          spec: "Photograph · 4:5 · 4000 × 5000 · after handover" },
        { id: "PDB-01/PLN-01", kind: "Not yet made", what: "Site plan, 1.42 acres, dual frontage",
          spec: "Drawing · vector · from the approved CRZ submission" },
        { id: "PDB-01/SEC-01", kind: "Not yet made", what: "Long section through the modular grid",
          spec: "Drawing · vector · from the IDO model" },
        { id: "GC/WF-01", kind: "Diagram", what: "The six-stage waterfall, closing to 100%",
          spec: "Generated in the page from the vehicle record · /collection/slowspace-coastal/investment" },
      ],
      note:
        "Six required, one of which exists — and the one that exists is generated from the " +
        "record rather than drawn. Nothing is shown as a photograph until it is one.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   STRUCTURE · THE VEHICLE
   From the PUB.01 footer: "SPV STRUCTURE".
   ═══════════════════════════════════════════════════════════════════ */

export const STRUCTURE: PublicPage = {
  id: "PUB.14",
  path: "/structure",
  alias: "The Vehicle",
  title: "How the vehicle is structured",
  standfirst:
    "One property, one body corporate. What you contract with, what it owns, and what happens to " +
    "it if things go wrong.",
  intent: "Answer the structural question in public, before anyone has to ask for a document.",
  panes: [
    {
      n: "01", eyebrow: "The Default", ground: "paper",
      title: "A Limited Liability Partnership, not an SPV.",
      body: [
        "The footer of the original wireframe calls this page SPV Structure. The constitutional " +
        "default is a Limited Liability Partnership registered in India, and a special purpose " +
        "vehicle requires Board approval for the specific property.",
        "The difference is not cosmetic. Under an LLP a partner's exposure is limited to what " +
        "they contributed, votes are weighted by contribution rather than counted per head, and " +
        "the Agreement binds anyone who acquires a position whether or not they have read it.",
      ],
      cta: { label: "Why a body corporate", href: "/journal/why-a-body-corporate" },
    },
    {
      n: "02", eyebrow: "The Three Entities", ground: "paper",
      title: "Three parties, and they are not interchangeable.",
      list: [
        { k: "Getaway Collective", v: "Operates the platform, admits partners, administers the register, enforces the rules. Holds no equity in any vehicle it governs, and that clause is entrenched." },
        { k: "The vehicle", v: "Owns the asset. You contract with it, and your rights arise under its Agreement and the Limited Liability Partnership Act 2008." },
        { k: "The operating partner", v: "Runs the property under contract to the vehicle. Not a party to your agreement, and owes you no duty under it." },
      ],
      note: "Most misunderstandings about what this is come from collapsing these three into one.",
    },
    {
      n: "03", eyebrow: "Governance", ground: "paper",
      title: "Thresholds, and what a tie means.",
      list: [
        { k: "Ordinary resolution", v: "More than 50% of contribution present and voting." },
        { k: "Special resolution", v: "At least 76% of total contribution." },
        { k: "Entrenched principles", v: "100%. Unanimous, so the rule outlives the people who wrote it." },
        { k: "A tie", v: "Not approval. Where a vote is exactly balanced the resolution fails." },
      ],
      cta: { label: "The full terms", href: "/legal/terms" },
    },
    {
      n: "04", eyebrow: "Failure", ground: "paper",
      title: "What happens if the vehicle cannot meet its obligations.",
      body: [
        "Partners rank last. A lender takes priority over every partner, and the residue after a " +
        "forced sale is frequently nothing.",
        "Each vehicle holds one asset and is legally independent, so no property supports another " +
        "and no property is exposed to another's failure. That cuts both ways: there is no " +
        "diversification inside a vehicle either.",
      ],
      cta: { label: "The disclosure in full", href: "/legal/risk-disclosure" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   THE BRIDGE — the closer

   Wireframes 2.0 · GC.UX.05, "ENOUGH THINKING". It sits at the foot of
   /capital, /space and /how-it-works.

   The source frames it as a circuit breaker for analysis paralysis:
   text that slams into place and tells the reader they have thought
   enough. That is a page telling somebody to stop deliberating about an
   irreversible commitment, on a platform whose commitment control is
   deliberately slow BECAUSE the deliberation matters.

   The component is kept and its argument is inverted: it says what has
   been covered and what has not, and points at the two things that
   should be read before anyone commits rather than after.
   ═══════════════════════════════════════════════════════════════════ */

export const BRIDGE = {
  title: "You have not read enough yet.",
  body:
    "The wireframe puts a closer here reading ENOUGH THINKING, on the argument that complexity " +
    "is the enemy of execution. On an irreversible commitment that argument runs the wrong way. " +
    "The commitment control on this platform takes three seconds of sustained pressure for the " +
    "same reason.",
  before: [
    { k: "The Hospitality Asset Disclosure", v: "/legal/risk-disclosure" },
    { k: "The Terms and Conditions", v: "/legal/terms" },
  ],
  close:
    "The asset is finite and the queue is real, and neither is a reason to decide today.",
} as const;


/* ═══════════════════════════════════════════════════════════════════
   IDENTIFY · THE HANDSHAKE
   Wireframes 2.0 · "THE LOGIN" — Identity & Access Protocol
   ═══════════════════════════════════════════════════════════════════ */

export const IDENTIFY: PublicPage = {
  id: "PUB.15",
  path: "/auth/sign-in",
  alias: "The Handshake",
  title: "Identify",
  standfirst: "No password. A single-use link, and nothing to remember or lose.",
  intent: "Entry, without holding a secret we would then have to protect.",
  panes: [
    {
      n: "01", eyebrow: "Why no password", ground: "paper",
      title: "We do not hold one.",
      list: [
        { k: "Nothing to breach", v: "A platform that stores no password cannot leak one, and cannot leak one you also used elsewhere." },
        { k: "Nothing to reset", v: "There is no recovery flow to social-engineer, because there is nothing to recover." },
        { k: "Single use", v: "Each link works once and expires. A link forwarded or found later opens nothing." },
      ],
      note:
        "We will never ask you for a password, a one-time code, or the full number of any payment " +
        "instrument. A message that does is not from us.",
    },
    {
      n: "02", eyebrow: "What the response means", ground: "paper",
      title: "The same answer either way.",
      body: [
        "Submitting an address always produces the same confirmation, whether or not that address " +
        "is known to us. A different message for a known address would let anyone check who holds " +
        "a position here by typing addresses into a form.",
        "So the confirmation is not evidence that an account exists. If no link arrives, the " +
        "likeliest reasons are that the address is not registered or that the message was filtered.",
      ],
      note:
        "The wireframe calls this view Exclusion by Default and captions it Authorized Personnel " +
        "Only. Access is restricted, and it is enforced at the route rather than announced at the " +
        "door — a sign-in page that tells a stranger they are unwelcome achieves nothing except " +
        "telling them there is something behind it.",
    },
    {
      n: "03", eyebrow: "What happens next", ground: "void",
      title: "Where the link takes you.",
      list: [
        { k: "An accredited partner", v: "To your position, and to the vehicles you are a partner in." },
        { k: "An application in flight", v: "To the furthest incomplete stage. Nothing is lost by leaving it." },
        { k: "Neither", v: "To accreditation, which is where anyone starts." },
      ],
      cta: { label: "What accreditation asks for", href: "/flow/accreditation" },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════ */

export const PUBLIC_PAGES: readonly PublicPage[] = [
  ROOT, MANIFESTO, PARTNERS, OPERATORS, DOSSIER, SIGNAL, WIRE,
  SPACE, TIME, EVIDENCE, STRUCTURE, IDENTIFY,
];

export const pageByPath = (path: string): PublicPage | undefined =>
  PUBLIC_PAGES.find((p) => p.path === path);

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  const paths = PUBLIC_PAGES.map((p) => p.path);
  if (new Set(paths).size !== paths.length) throw new Error("Two public pages share a path");

  const ids = PUBLIC_PAGES.map((p) => p.id);
  if (new Set(ids).size !== ids.length) throw new Error("Two public pages share an id");

  for (const p of PUBLIC_PAGES) {
    if (!p.panes.length) throw new Error(`${p.id} has no panes`);

    /* Pane numbers are displayed. Duplicates would render twice and read
       as a mistake in the document rather than in the data. */
    const ns = p.panes.map((x) => x.n);
    if (new Set(ns).size !== ns.length) throw new Error(`${p.id} has a duplicate pane number`);

    for (const pane of p.panes) {
      /* Every arrangement counts as saying something, and each new one
         has to be added here. That is deliberate: an omission makes a
         populated pane throw at load rather than render empty, so the
         failure is loud and immediate instead of a blank section nobody
         notices. It caught the faq pane below on the first build. */
      const said = pane.lede || pane.body?.length || pane.list?.length ||
        pane.ledger?.length || pane.sequence?.length || pane.faq?.length || pane.plates?.length;
      if (!said) {
        throw new Error(`${p.id} pane ${pane.n} says nothing`);
      }
    }
  }
}
