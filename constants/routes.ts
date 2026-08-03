/**
 * THE INFORMATION ARCHITECTURE — every URL in the system
 *
 * Wave 7 · Workspaces
 * Authority: L1-01 §24a (authority), §25 (vocabulary), §29 (design)
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────
 * One declaration per addressable surface: its path, the assembly that
 * renders it, who may reach it, and what it requires. Nothing else in the
 * system holds a URL, so a path that is not here does not exist.
 *
 * ── ACCESS IS DERIVED, NOT DECLARED ──────────────────────────────────
 * A route's access class comes from its assembly's VANTAGE. The aperture
 * tier already decided what each vantage may see; letting each route
 * restate that would create a second source of truth, and the two would
 * drift the first time somebody edited one.
 *
 * Where a route genuinely needs different access from its vantage, it
 * declares an override WITH A REASON, and route-lint refuses an override
 * that does not state one. There are three, and all three are the same
 * case: an Investor must be able to reach the commitment path before they
 * are a Member, or nobody would ever become one.
 *
 * ── ON "SUPER ADMIN" ─────────────────────────────────────────────────
 * There isn't one, and adding one would break the model rather than
 * extend it.
 *
 * The eight roles are OFFICES and COMMITTEES, not permission tiers. They
 * are constituted, they hold specific rights, and `separationViolations()`
 * in lib/authority.ts exists to prove no single role holds a dangerous
 * triad. A super-admin is by definition a role that holds every right,
 * which is the exact condition that function is written to detect.
 *
 * The closest real thing is the Board, and the Board is a quorum rather
 * than a login: it acts by resolution at a declared threshold, never as a
 * person with a password. Where an operation genuinely needs the highest
 * authority, the route requires a RESOLUTION reference, not a role.
 */

import type { RouteGroup } from "./layout";
import type { Vantage } from "./apertures";

/**
 * Who can reach a surface.
 *
 * Ordered from least to most privileged. `office` is not "more" than
 * `member` in a general sense — an office-holder is often also a member —
 * but for reachability it sits above, because office routes carry
 * operational data about other people.
 */
export type Access =
  /** Anyone, signed in or not. Indexable. */
  | "public"
  /** Signed in. Any lifecycle state, including Prospect. */
  | "identified"
  /** Passed PR-01 accreditation. */
  | "accredited"
  /** Holds a settled position. The Member Law has fired. */
  | "member"
  /** Holds a named right from lib/authority.ts. */
  | "office";

export const ACCESS_RANK: Record<Access, number> = {
  public: 0, identified: 1, accredited: 2, member: 3, office: 4,
};

/**
 * The vantage → access mapping. This is the derivation.
 *
 * gateway and space are public because they are marketing surfaces that
 * already withhold everything needing provenance. time and member require
 * a settled position. capital and admin are operational and carry data
 * about people other than the viewer.
 */
export const ACCESS_FOR_VANTAGE: Record<Vantage, Access> = {
  gateway: "public",
  space: "public",
  time: "member",
  member: "member",
  capital: "office",
  admin: "office",
};

export interface Route {
  /**
   * THE PERMANENT IDENTIFIER — v4.0.
   *
   * IA IDs are never recycled, even when a page is retired, and they
   * advance in tens so a later insertion can take a five without
   * renumbering anything. THE ID IS PERMANENT; THE URL IS NOT THE ID —
   * requirements, analytics, permissions, tests and documentation bind
   * to this, so a route can move without breaking a single reference.
   *
   * That is not a nicety here. This table replaced a 135-route IA whose
   * URLs almost all changed; every one of those moves was safe to make
   * precisely because nothing downstream had been keyed to a URL.
   */
  ia: string;
  /** The URL. Lowercase, no trailing slash, params as [name]. */
  path: string;
  /** What it is called in navigation and in the title. */
  name: string;
  group: RouteGroup;
  /** The assembly that renders it, or null for a redirect or a shell. */
  assembly: string | null;
  /**
   * Present ONLY where access differs from the vantage's derivation, and
   * route-lint requires the reason.
   */
  accessOverride?: { access: Access; because: string };
  /** Rights required, from lib/authority.ts. Office routes only. */
  rights?: readonly string[];
  /** Dynamic segments, named. */
  params?: readonly string[];
  /** Additional IA records deliberately rendered at this same canonical URL. */
  coLocatedIa?: readonly string[];
  /**
   * Whether search engines may index it.
   *
   * Defaults to true for public and false for everything else, and
   * route-lint refuses an indexable route that is not public — an
   * indexed URL behind auth leaks its existence and often its title.
   */
  indexable?: boolean;
  notes?: string;
}

const R = (
  ia: string, path: string, name: string, group: RouteGroup, assembly: string | null,
  extra: Partial<Route> = {},
): Route => ({ ia, path, name, group, assembly, ...extra });

/* The four apertures. One canonical Investment Vehicle, four ways in —
   never four versions of it. Stated once so no route invents a fifth. */
export const APERTURE = {
  public: "/collection/[vehicle]",
  investor: "/invest/[vehicle]",
  member: "/portfolio/[vehicle]",
  office: "/office/collection/[vehicle]",
} as const;

/* Reasons an override exists. Written once because the same reason
   governs a whole realm, and a reason copied per route is a reason
   nobody reads by the fourth copy. */
export const INVESTOR_REASON =
  "An Investor must be able to reach the diligence path before they hold a position, or nobody " +
  "would ever become a Member. The capital vantage governs what is SHOWN; this override governs " +
  "who may arrive.";
export const PUBLIC_DOCTRINE_REASON =
  "Doctrine a prospective investor most needs before deciding anything. The assembly's vantage " +
  "still decides what appears; the override only decides who may reach it.";



// ─────────────────────────────────────────────────────────────────────
// WORLD I · DESIRE — the public realm  (GC-*)
//
// Public navigation stays restrained: Collection, Journal, How It Works,
// About, and one Enquire. Capital, Governance, LLP, Portfolio, Reports,
// Documents and dashboards are NOT exposed here — those concepts belong
// deeper in the relationship (v4.0 §6).
//
// The Collection is not an inventory grid. It is the desire engine, and
// every property is presented as a world: place, life, idea, asset —
// then ownership, economics and risk, in that order (§7, §8).
// ─────────────────────────────────────────────────────────────────────

export const PUBLIC_ROUTES: readonly Route[] = [
  R("GC-000", "/", "Getaway Collective", "gateway", "AS-32",
    { notes: "What is GC? Hero, then the Collection. No figure above the fold (FB-1)." }),
  /* The three design-review previews are PUBLIC but NOT INDEXABLE, and
     the distinction is the whole point of `indexable` existing.

     They must remain reachable: their job is to be opened by a reviewer
     on a phone, without a login, during a call. But they render a drawing of
     the Office — a control console with health scores, exception counts
     and the module map — and an indexed "Office Workspace Preview" is
     administrative machinery published to anyone who searches the brand.
     UX-08 bars exactly that, and the placeholder data does not make the
     shape of the operation less legible.

     Setting it here rather than in robots.ts is deliberate: this one flag
     drives the page's own robots meta AND its absence from sitemap.ts,
     because both read isIndexable(). A rule kept in one place cannot be
     half-applied. */
  R("GC-005", "/investor-workspace-preview", "Investor Workspace Preview", "gateway", "AS-32",
    { indexable: false,
      notes: "Design-review surface only. Uses labelled placeholder material and does not disclose a vehicle, offering, eligibility decision or private record." }),
  R("GC-006", "/member-workspace-preview", "Member Workspace Preview", "gateway", "AS-32",
    { indexable: false,
      notes: "Design-review surface only. Placeholder relationship material; never member-restricted records." }),
  R("GC-007", "/office-workspace-preview", "Office Workspace Preview", "gateway", "AS-32",
    { indexable: false,
      notes: "Design-review surface only. Placeholder operational material; never internal or restricted records." }),

  R("GC-100", "/collection", "The Collection", "gateway", "AS-01",
    { notes: "Places worth returning to. Photography and editorial lead; financial information " +
             "is available but never leads." }),
  // ── The vehicle, publicly: eight chapters (§8) ────────────────────
  R("GC-110", "/collection/[vehicle]", "Opportunity", "space", "AS-03", { params: ["vehicle"],
    notes: "Chapter 00. Why this investment, why this place. The public aperture onto the vehicle." }),
  R("GC-112", "/collection/[vehicle]/place", "The Place", "space", "AS-12", { params: ["vehicle"],
    notes: "Chapter 01. Land, water, light, approach — the place before the proposition." }),
  R("GC-114", "/collection/[vehicle]/life", "The Life", "space", "AS-10", { params: ["vehicle"],
    notes: "Chapter 02. What it is to return here. Imagery, each plate labelled for what it is." }),
  R("GC-116", "/collection/[vehicle]/idea", "The Idea", "space", "AS-03", { params: ["vehicle"],
    notes: "Chapter 03. The investment thesis, in plain words, before any figure." }),
  R("GC-120", "/collection/[vehicle]/asset", "The Asset", "space", "AS-03", { params: ["vehicle"],
    notes: "Chapter 04. What is owned: land, build, fittings — the Space quadrant, publicly." }),
  R("GC-130", "/collection/[vehicle]/ownership", "Ownership", "space", "AS-03", { params: ["vehicle"],
    notes: "Chapter 05. How participation works: the LLP, the unit, the ladder, the ceiling." }),
  R("GC-140", "/collection/[vehicle]/investment", "The Investment", "capital", "AS-04",
    { params: ["vehicle"],
      accessOverride: { access: "public", because: PUBLIC_DOCTRINE_REASON },
      notes: "Chapter 06. The six-stage waterfall and what actually arrives. Every figure carries " +
             "its confidence class." }),
  R("GC-145", "/collection/[vehicle]/risk", "Risk", "capital", "AS-14", { params: ["vehicle"],
    accessOverride: { access: "public", because: PUBLIC_DOCTRINE_REASON },
    notes: "Chapter 07. How this loses money, stated before anyone is asked for anything." }),
  R("GC-150", "/collection/[vehicle]/progress", "Progress", "space", "AS-11", { params: ["vehicle"],
    accessOverride: { access: "public", because: PUBLIC_DOCTRINE_REASON },
    notes: "What exists TODAY. Evidence, not a render of the finished thing." }),
  R("GC-160", "/collection/[vehicle]/enquire", "Enquire", "gateway", "AS-32", { params: ["vehicle"],
    notes: "Chapter 08 — Consider. Vehicle-scoped, and it states what an enquiry creates before " +
           "it asks for anything." }),

  // ── Journal ───────────────────────────────────────────────────────
  R("GC-200", "/journal", "The Journal", "gateway", "AS-30",
    { notes: "What GC is thinking about. Distinct from testimonials: an explanation of a " +
             "mechanism is not regulated speech; a claim about returns is." }),
  R("GC-210", "/journal/[story]", "Story", "gateway", "AS-30", { params: ["story"] }),
  // ── Doctrine ──────────────────────────────────────────────────────
  R("GC-300", "/how-it-works", "How It Works", "gateway", "AS-32",
    { notes: "The model: three entities, governance without ownership, the waterfall, the " +
             "Member Law." }),
  // ── About ─────────────────────────────────────────────────────────
  R("GC-400", "/about", "About", "gateway", "AS-32",
    { notes: "Who is behind GC, and which of the three entities is speaking." }),
  /* GC-440, not GC-410. The Numbering Law never recycles an id, and
     410/420/430 were spent on the v4 About sub-pages (story, people,
     voices) before they were consolidated into GC-400.

     A general contact is NOT the vehicle-scoped enquiry. GC-160 exists so
     an INVESTMENT enquiry is anchored to the vehicle it concerns, and
     INV-170 carries a qualified investor to a named human. Press, a
     prospective operating partner and a supplier have none of those, and
     routing them through a vehicle enquiry would file them against an
     offering they are not asking about. */
  R("GC-440", "/contact", "Contact", "gateway", "AS-32",
    { notes: "The general channel. Investment enquiries belong to a vehicle (GC-160) and a " +
             "qualified investor reaches a person through INV-170; this is for everything else." }),
  // ── The legal corpus ──────────────────────────────────────────────
  R("GC-500", "/legal", "Legal", "gateway", "AS-29",
    { notes: "Seven standing documents, versioned, with effective dates. Nothing on this " +
             "platform paraphrases them." }),
];

export const LEGAL_ROUTES: readonly Route[] = [
  R("GC-510", "/legal/[document]", "Legal Document", "gateway", "AS-29",
    { params: ["document"],
      notes: "One canonical renderer selects the governed standing instrument and its effective version." }),
];

// ─────────────────────────────────────────────────────────────────────
// WORLD II · CONVICTION — the investor realm  (INV-*)
//
// Public → Known Prospect → Qualified Investor → Diligence → Commitment.
// Everything here sits behind qualification, and the commitment is a
// private transaction record rather than a checkout (§19).
// ─────────────────────────────────────────────────────────────────────

export const INVESTOR_ROUTES: readonly Route[] = [
  R("INV-090", "/invest/qualify", "Qualification", "capital", "AS-06",
    { accessOverride: { access: "identified", because: INVESTOR_REASON },
      notes: "PR-01. Sixteen stages, resumable at every one; a decision within 15 working days. " +
             "An application in flight completes before any suspension applies (§24b)." }),
  R("INV-100", "/invest/[vehicle]", "Private Overview", "capital", "AS-35", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "The dossier. Should I examine this?" }),
  R("INV-110", "/invest/[vehicle]/asset", "Asset", "capital", "AS-35", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "What asset backs this?" }),
  R("INV-120", "/invest/[vehicle]/financials", "Financials", "capital", "AS-04", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "The economics, with the derivation beside every figure." }),
  R("INV-130", "/invest/[vehicle]/structure", "Structure", "capital", "AS-35", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "What am I legally joining?" }),
  R("INV-140", "/invest/[vehicle]/risks", "Risk", "capital", "AS-14", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "How can I lose money? Acknowledgement is recorded with identity, version and time." }),
  R("INV-150", "/invest/[vehicle]/dataroom", "Dataroom", "capital", "AS-35", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "The evidence itself. Every document states its custody and its version." }),
  R("INV-160", "/invest/[vehicle]/commit", "Commit", "capital", "AS-19", { params: ["vehicle"],
    accessOverride: { access: "accredited", because: INVESTOR_REASON },
    notes: "The private transaction record. The piston is the only control that moves capital, and " +
           "nothing new appears after the review." }),
  R("INV-170", "/invest/[vehicle]/speak", "Speak to Us", "gateway", "AS-32", { params: ["vehicle"],
    accessOverride: { access: "identified", because: INVESTOR_REASON },
    notes: "The human handoff. Context carries over — nobody is asked to repeat themselves (UX-07)." }),
];

// ─────────────────────────────────────────────────────────────────────
// WORLD III · MEMBERSHIP — the member realm  (MEM-*)
//
// Navigation stops being sales-oriented. HOME, PORTFOLIO, COLLECTION,
// ACTIVITY — documents, reporting, voting and statements appear
// CONTEXTUALLY rather than becoming a maze of top-level destinations.
// ─────────────────────────────────────────────────────────────────────

export const MEMBER_ROUTES: readonly Route[] = [
  R("MEM-000", "/home", "Member Home", "member", "AS-33",
    { notes: "Closer to a private-bank relationship than a property dashboard. Stewardship " +
             "leads; discovery continues but never pushes (UX-10)." }),
  R("MEM-100", "/portfolio", "My Portfolio", "member", "AS-05",
    { notes: "What do I own? Every position, across every vehicle." }),
  R("MEM-110", "/portfolio/[vehicle]", "Vehicle", "member", "AS-05", { params: ["vehicle"],
    notes: "The member aperture onto the vehicle. Same record the Office reads, redacted — never " +
           "restated (UX-02)." }),
  R("MEM-120", "/portfolio/[vehicle]/space", "Space", "space", "AS-03",
    { params: ["vehicle"],
      accessOverride: { access: "member", because:
        "The shared Space assembly is public at the property aperture. This route adds the settled holder's vehicle record and therefore requires membership." },
      notes: "What does our LLP own?" }),
  R("MEM-130", "/portfolio/[vehicle]/capital", "Capital", "member", "AS-26",
    { params: ["vehicle"], notes: "What is its financial position?" }),
  R("MEM-140", "/portfolio/[vehicle]/time", "Time", "time", "AS-25",
    { params: ["vehicle"], notes: "What time rights do I have?" }),
  R("MEM-150", "/portfolio/[vehicle]/project", "Project", "member", "AS-05",
    { params: ["vehicle"], notes: "How is development progressing?" }),
  R("MEM-160", "/portfolio/[vehicle]/partners", "Partners", "member", "AS-05",
    { params: ["vehicle"], notes: "Who participates?" }),
  R("MEM-170", "/portfolio/[vehicle]/governance", "Governance", "member", "AS-27",
    { params: ["vehicle"], notes: "How is our LLP governed?" }),
  R("MEM-180", "/portfolio/[vehicle]/documents", "Documents", "member", "AS-05",
    { params: ["vehicle"], notes: "Show me the records." }),
  R("MEM-190", "/portfolio/[vehicle]/activity", "Activity", "member", "AS-05",
    { params: ["vehicle"], notes: "What has changed?" }),

  R("MEM-200", "/activity", "Activity", "member", "AS-05",
    { notes: "One private ledger of the relationship, across every vehicle." }),
  R("MEM-210", "/profile", "Profile", "member", "AS-33",
    { notes: "The account, never the position. Nothing here can touch the register." }),
];

// ─────────────────────────────────────────────────────────────────────
// THE GC OFFICE — one protected namespace  (OFF-* and the quadrants)
//
// Enter GC → choose the Investment Vehicle → understand its Space,
// Capital, Time and Governance → manage its Project and Partners →
// verify through Documents → understand change through Activity.
//
// There is deliberately NO /office/partners, /office/capital or
// /office/assets as a primary destination. Those concepts only mean
// something scoped to a vehicle, and a second object hierarchy would
// compete with the one that matters. Cross-vehicle analysis lives in
// Collection and Network.
// ─────────────────────────────────────────────────────────────────────

const V = "/office/collection/[vehicle]";

/* Rights, not roles. A route bound to a role would survive the role's
   revocation; a route bound to a right cannot. */
export const OFFICE_ROUTES: readonly Route[] = [
  R("OFF-090", "/office", "Lifecycle Board", "admin", "AS-13",
    { rights: ["portfolio.manage"],
      notes: "Every vehicle against the fifteen-state lifecycle. Where does each investment sit?" }),
  R("OFF-100", "/office/collection", "Collection", "admin", "AS-13",
    { rights: ["portfolio.manage"],
      notes: "What is happening across GC? The master workspace." }),
  R("OFF-110", V, "Vehicle Overview", "capital", "AS-02", { params: ["vehicle"],
    rights: ["vehicle.form"],
    notes: "The cockpit. Vehicle Health across Space, Capital, Time, Governance and Project." }),

  R("OFF-120", `${V}/space`, "Space", "space", "AS-03", { params: ["vehicle"],
    accessOverride: { access: "office", because:
      "The space vantage governs what a PROSPECT sees. Inside the Office the same records carry " +
      "title references, valuations and protection state, so the route is raised to office." },
    rights: ["property.register"],
    notes: "Quadrant I. Everything the LLP legally owns, controls, protects and transfers." }),
  R("SPA-100", `${V}/space/property`, "Property", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "What property is owned?" }),
  R("SPA-110", `${V}/space/land`, "Land", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "What land rights exist?" }),
  R("SPA-120", `${V}/space/buildings`, "Buildings", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "What has been built?" }),
  R("SPA-130", `${V}/space/assets`, "Fixed Assets", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "What material assets exist?" }),
  R("SPA-140", `${V}/space/improvements`, "Improvements", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "What capital improvements exist?" }),
  R("SPA-150", `${V}/space/protection`, "Protection", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.register"], notes: "Is the asset protected?" }),

  R("OFF-130", `${V}/capital`, "Capital", "capital", "AS-02", { params: ["vehicle"],
    rights: ["capital.deploy"],
    notes: "Quadrant II. Everything the LLP receives, owes, earns, preserves and distributes." }),
  R("CAP-100", `${V}/capital/structure`, "Structure", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "How is it funded?" }),
  R("CAP-110", `${V}/capital/accounts`, "Capital Accounts", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What has each Partner contributed?" }),
  R("CAP-120", `${V}/capital/contributions`, "Contributions", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What capital entered?" }),
  R("CAP-130", `${V}/capital/debt`, "Debt", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What does the LLP owe?" }),
  R("CAP-140", `${V}/capital/income`, "Income", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What is it earning?" }),
  R("CAP-150", `${V}/capital/expenses`, "Expenses", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "Where is money going?" }),
  R("CAP-160", `${V}/capital/reserves`, "Reserves", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What is being preserved?" }),
  R("CAP-170", `${V}/capital/distributions`, "Distributions", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What has been distributed?" }),
  R("CAP-180", `${V}/capital/valuation`, "Valuation", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What is it worth?" }),
  R("CAP-190", `${V}/capital/reports`, "Reports", "capital", "AS-02",
    { params: ["vehicle"], rights: ["capital.deploy"], notes: "What is the financial truth?" }),

  R("OFF-140", `${V}/time`, "Time", "time", "AS-25", { params: ["vehicle"],
    accessOverride: { access: "office", because:
      "The time vantage is a MEMBER's own entitlement. The Office sees the whole pool and every " +
      "partner's share of it, which is a different disclosure and a higher one." },
    rights: ["policy.approve"],
    notes: "Quadrant III. Time is ownership: a static yearly allocation multiplied by the stake." }),
  R("TIM-100", `${V}/time/policy`, "Time Policy", "admin", "AS-13", { params: ["vehicle"],
    rights: ["policy.approve"], notes: "What governs time?" }),
  R("TIM-110", `${V}/time/[year]`, "Allocation Year", "time", "AS-25",
    { params: ["vehicle", "year"],
      accessOverride: { access: "office", because:
        "The vehicle's whole pool for a year, not one partner's slice of it." },
      rights: ["policy.approve"], notes: "What is this year's pool?" }),
  R("TIM-120", `${V}/time/[year]/allocations`, "Partner Allocations", "time", "AS-25",
    { params: ["vehicle", "year"],
      accessOverride: { access: "office", because:
        "Every partner's allocation side by side. A member sees only their own." },
      rights: ["policy.approve"], notes: "Who controls how much time?" }),

  R("OFF-150", `${V}/project`, "Project", "admin", "AS-11", { params: ["vehicle"],
    rights: ["property.advance_lifecycle"],
    notes: "Development oversight. Rich, because GC oversees delivery." }),
  R("PRJ-100", `${V}/project/timeline`, "Timeline", "admin", "AS-11",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "Where are we?" }),
  R("PRJ-110", `${V}/project/milestones`, "Milestones", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "What must happen?" }),
  R("PRJ-120", `${V}/project/workstreams`, "Workstreams", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "What work is underway?" }),
  R("PRJ-130", `${V}/project/budget`, "Budget", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "Are we on budget?" }),
  R("PRJ-140", `${V}/project/commitments`, "Commitments", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "What have we committed?" }),
  R("PRJ-150", `${V}/project/consultants`, "Consultants", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "Who is responsible?" }),
  R("PRJ-160", `${V}/project/risks`, "Risks", "capital", "AS-28",
    { params: ["vehicle"], rights: ["compliance.record"], notes: "What threatens delivery?" }),
  R("PRJ-170", `${V}/project/decisions`, "Decisions", "admin", "AS-13",
    { params: ["vehicle"], rights: ["property.advance_lifecycle"], notes: "What decisions are blocked?" }),

  R("OFF-160", `${V}/partners`, "Partners", "admin", "AS-13", { params: ["vehicle"],
    coLocatedIa: ["PAR-100"], rights: ["ownership.transfer"],
    notes: "The Partners module and its Register are co-located at one canonical URL. Who owns and participates?" }),
  R("PAR-110", `${V}/partners/[partner]`, "Partner", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"],
      notes: "A Partner is a constitutional record, not a CRM row." }),
  R("PAR-120", `${V}/partners/[partner]/ownership`, "Ownership", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"], notes: "What do they own?" }),
  R("PAR-130", `${V}/partners/[partner]/capital`, "Capital", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"], notes: "What is their capital position?" }),
  R("PAR-140", `${V}/partners/[partner]/time`, "Time", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"], notes: "What is their allocation?" }),
  R("PAR-150", `${V}/partners/[partner]/distributions`, "Distributions", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"], notes: "What have they received?" }),
  R("PAR-160", `${V}/partners/[partner]/governance`, "Governance", "admin", "AS-13",
    { params: ["vehicle", "partner"], rights: ["ownership.transfer"], notes: "What can they vote or approve?" }),

  R("OFF-170", `${V}/governance`, "Governance", "admin", "AS-13", { params: ["vehicle"],
    rights: ["resolution.resolve"],
    notes: "Quadrant IV. Not a fourth business function: the operating law of the other three." }),
  R("GOV-100", `${V}/governance/entity`, "Entity", "admin", "AS-13",
    { params: ["vehicle"], rights: ["resolution.resolve"], notes: "What is the legal entity?" }),
  R("GOV-110", `${V}/governance/constitution`, "Constitution", "admin", "AS-13",
    { params: ["vehicle"], rights: ["resolution.resolve"], notes: "What is its operating law?" }),
  R("GOV-120", `${V}/governance/authority`, "Authority", "admin", "AS-13",
    { params: ["vehicle"], rights: ["authority.grant"], notes: "Who may do what?" }),
  R("GOV-130", `${V}/governance/resolutions`, "Resolutions", "admin", "AS-27",
    { params: ["vehicle"],
      accessOverride: { access: "office", because:
        "The Ballot assembly normally shows a Member's own vote. The Office route prepares and resolves the complete vehicle record, so it requires Office authority." },
      rights: ["resolution.resolve"], notes: "What has been decided?" }),
  R("GOV-140", `${V}/governance/agreements`, "Agreements", "admin", "AS-13",
    { params: ["vehicle"], rights: ["resolution.resolve"], notes: "What contracts bind it?" }),
  R("GOV-150", `${V}/governance/compliance`, "Compliance", "admin", "AS-13",
    { params: ["vehicle"], rights: ["compliance.record"], notes: "Are obligations current?" }),
  R("GOV-160", `${V}/governance/tax`, "Tax", "admin", "AS-13",
    { params: ["vehicle"], rights: ["compliance.record"], notes: "Is tax current?" }),
  R("GOV-170", `${V}/governance/conflicts`, "Conflicts", "admin", "AS-13",
    { params: ["vehicle"], rights: ["resolution.resolve"], notes: "What conflicts exist?" }),
  R("GOV-180", `${V}/governance/audit`, "Audit", "admin", "AS-13",
    { params: ["vehicle"], rights: ["resolution.resolve"], notes: "Can governance be proven?" }),

  R("OFF-180", `${V}/documents`, "Documents", "admin", "AS-34", { params: ["vehicle"],
    rights: ["content.publish"], notes: "What evidence exists, and in whose custody?" }),
  R("DOC-100", `${V}/documents/[document]`, "Document", "admin", "AS-34",
    { params: ["vehicle", "document"], rights: ["content.publish"],
      notes: "The instrument, its versions and its custody." }),
  R("OFF-190", `${V}/activity`, "Activity", "admin", "AS-13", { params: ["vehicle"],
    rights: ["compliance.record"], notes: "What changed, by whom, on what authority?" }),
  R("ACT-100", `${V}/activity/[event]`, "Event", "admin", "AS-13",
    { params: ["vehicle", "event"], rights: ["compliance.record"],
      notes: "Append-only. An event is never edited, only superseded." }),

  R("NET-100", "/office/network", "Network", "admin", "AS-13",
    { rights: ["portfolio.manage"], notes: "How is everything connected?" }),
  R("NET-110", "/office/network/[vehicle]", "Vehicle Network", "admin", "AS-13",
    { params: ["vehicle"], rights: ["portfolio.manage"],
      notes: "What surrounds this investment?" }),

  R("SYS-100", "/office/settings", "Settings", "admin", "AS-34",
    { rights: ["organization.register"], notes: "Configure GC." }),
  R("SYS-110", "/office/settings/access", "People & Access", "admin", "AS-34",
    { rights: ["authority.grant"],
      notes: "Grants, expiries, revocations, unassigned rights and separation alerts. A role " +
             "makes a grant ELIGIBLE; it never confers access." }),
  R("SYS-120", "/office/settings/integrations", "Integrations", "admin", "AS-34",
    { rights: ["organization.register"], notes: "What systems connect?" }),
];

// ─────────────────────────────────────────────────────────────────────
// SYSTEM STATES  (GC-9xx)
// ─────────────────────────────────────────────────────────────────────

export const SYSTEM_ROUTES: readonly Route[] = [
  R("GC-900", "/sign-in", "Sign In", "gateway", "AS-32"),
  R("GC-910", "/verify", "Verify", "gateway", "AS-32",
    { notes: "The code remains single-use and outside the path. The page is public; the pending identity and token govern the write." }),
  R("GC-920", "/status", "System Status", "gateway", "AS-15"),
  R("GC-930", "/403", "Not Permitted", "gateway", "AS-16",
    { notes: "Says the viewer may not see it. Never says whether it EXISTS — that difference is " +
             "the shape of the system, handed to anyone probing it." }),

  /* /404 and /500 are FRAMEWORK CONVENTIONS, not pages. Next.js owns both
     paths: in the App Router they compile to not-found.tsx and error.tsx
     at the root, which is why gen-app.js routes them through CONVENTIONS
     rather than emitting a page.tsx.

     They remain in this table because they ARE addressable states the
     architecture has to describe — with an access class and an assembly,
     like anything else. Only the file they compile to differs. Dropping
     them removed both files as orphans and handed production Next's stock
     pages, which is the one place a stack trace can still surface. */
  R("GC-940", "/404", "Not Found", "gateway", "AS-16",
    { notes: "No stack trace, no exception name, no auto-redirect. The middleware rewrites an " +
             "unknown route and a missing right here, so this page must never confirm whether " +
             "the surface exists." }),
  R("GC-950", "/500", "System Error", "gateway", "AS-16",
    { notes: "Renders the failure without rendering the error. An exception name or a stack tells " +
             "anyone probing the site what the stack is." }),
];

export const ROUTES: readonly Route[] = [
  ...PUBLIC_ROUTES, ...LEGAL_ROUTES,
  ...INVESTOR_ROUTES, ...MEMBER_ROUTES, ...OFFICE_ROUTES,
  ...SYSTEM_ROUTES,
];

/* ── The IA IDs are the spine, so they are checked like one ──────── */
{
  const seen = new Map<string, string>();
  for (const r of ROUTES) {
    if (!r.ia) throw new Error(`${r.path} carries no IA ID. The ID is the permanent reference.`);
    for (const ia of [r.ia, ...(r.coLocatedIa ?? [])]) {
      const prior = seen.get(ia);
      if (prior) {
        throw new Error(
          `IA ${ia} is claimed by both ${prior} and ${r.path}. IDs are permanent and unique — ` +
          `recycling one silently repoints every requirement, test and analytics event bound to it.`,
        );
      }
      seen.set(ia, r.path);
    }
  }
  const paths = new Set<string>();
  for (const r of ROUTES) {
    if (paths.has(r.path)) throw new Error(`Duplicate route path ${r.path}`);
    paths.add(r.path);
  }
}

/** The permanent identifier for a live path, or undefined. */
export const iaOf = (path: string): string | undefined =>
  ROUTES.find((r) => r.path === path)?.ia;

export const routeByIA = (ia: string): Route | undefined =>
  ROUTES.find((r) => r.ia === ia || r.coLocatedIa?.includes(ia));

/**
 * The access class of a route: derived from its assembly's vantage, or
 * from the route group where it renders no assembly, unless overridden.
 */
export const GROUP_VANTAGE: Record<RouteGroup, Vantage> = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};

export function accessOf(r: Route, vantageOfAssembly?: Vantage): Access {
  if (r.accessOverride) return r.accessOverride.access;
  const v = vantageOfAssembly ?? GROUP_VANTAGE[r.group];
  return ACCESS_FOR_VANTAGE[v];
}

/** Indexable defaults to true for public routes and false for everything else. */
export function isIndexable(r: Route, access: Access): boolean {
  if (r.indexable !== undefined) return r.indexable;
  return access === "public";
}

export const routeByPath = (p: string): Route | undefined =>
  ROUTES.find((r) => r.path === p);

export const routesFor = (g: RouteGroup): Route[] =>
  ROUTES.filter((r) => r.group === g);

/** Every dynamic segment used anywhere, for the param registry. */
export function allParams(): string[] {
  return [...new Set(ROUTES.flatMap((r) => r.params ?? []))].sort();
}

export const IA_LAWS = {
  accessIsDerived:
    "A route's access comes from its assembly's vantage. The aperture tier already decided what " +
    "each vantage may see, and a route restating it would be a second source of truth.",
  overridesStateTheirReason:
    "An override without a reason is a permission granted by whoever edited the file last.",
  noSuperAdmin:
    "The eight roles are offices and committees, not tiers. A super-admin holds every right, " +
    "which is the exact condition separationViolations() exists to detect. Where the highest " +
    "authority is genuinely needed, the route requires a resolution reference rather than a role.",
  rightsNotRoles:
    "Admin routes name the RIGHT they require, never the role that holds it. Rights are granted " +
    "and revoked; a route bound to a role would survive the revocation.",
  indexOnlyPublic:
    "An indexed URL behind authentication leaks its existence and usually its title. Only public " +
    "routes are indexable, and the linter enforces it rather than trusting the default.",
  notFoundNeverConfirms:
    "403 says the viewer may not see it and never says whether it exists. The difference between " +
    "'no' and 'not for you' is the shape of the system, handed to anyone probing it.",
} as const;
