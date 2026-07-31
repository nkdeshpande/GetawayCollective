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
      cta: { label: "How capital works", href: "/how-capital-works" },
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
        { k: "The unit", v: "A contribution-weighted interest. Ten units are the whole equity layer, exactly." },
        { k: "The waterfall", v: "Six stages in order, closing to 100%. Debt service is stage five and stands on its own." },
        { k: "The entitlement", v: "Nights in proportion to contribution, beginning at handover and not before." },
      ],
      cta: { label: "The waterfall in full", href: "/how-capital-works" },
    },
    {
      n: "04", eyebrow: "The Execution", ground: "paper",
      title: "What happens, and when.",
      list: [
        { k: "Accreditation", v: "Identity, tax residency, source of funds. Fifteen working days, resumable." },
        { k: "Deposit", v: "A fixed amount holds a unit. It buys nothing and makes nobody a partner." },
        { k: "Completion", v: "The balance, the Agreement and the transfer complete off the platform." },
        { k: "Settlement", v: "The Member Law fires when cleared funds reach the vehicle. Irreversible." },
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
      list: [
        { k: "Principal architect", v: "Design and specification. Signs the drawings that are built from." },
        { k: "Spatial strategy", v: "Siting, orientation and view corridors, before any structure is fixed." },
        { k: "Governance counsel", v: "The LLP Agreement and the constitutional instruments. Advises the vehicle, not the platform." },
        { k: "Sustainability", v: "Material selection and lifecycle. Reports findings whether or not they are convenient." },
        { k: "Facility operations", v: "The operating partner, measured against a Service Level." },
        { k: "Audit", v: "Statutory audit of each vehicle. Appointed by the partners, not by us." },
      ],
      note: "Each role is a function, stated before anyone is named to it. A function with no holder is shown as vacant rather than omitted.",
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
      title: "Three layers, one accountable party.",
      list: [
        { k: "Intent", v: "What is asked for, however it is asked — a message, a schedule, or nothing at all." },
        { k: "Core", v: "The logic that decides what that means for the property, and what it costs." },
        { k: "Site", v: "The building itself: light, heat, water, access." },
        { k: "Dispatch", v: "A person, sent only when the first three cannot resolve it." },
      ],
      note: "Every layer is operated by the operating partner under contract to the vehicle. Getaway Collective operates none of it.",
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
      cta: { label: "Where that sits in the waterfall", href: "/how-capital-works" },
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
  ],
};

/* ═══════════════════════════════════════════════════════════════════ */

export const PUBLIC_PAGES: readonly PublicPage[] = [
  ROOT, MANIFESTO, PARTNERS, OPERATORS, DOSSIER, SIGNAL, WIRE,
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
      if (!(pane.lede || pane.body?.length || pane.list?.length)) {
        throw new Error(`${p.id} pane ${pane.n} says nothing`);
      }
    }
  }
}
