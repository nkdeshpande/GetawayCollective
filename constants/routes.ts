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
  path: string, name: string, group: RouteGroup, assembly: string | null,
  extra: Partial<Route> = {},
): Route => ({ path, name, group, assembly, ...extra });

// ─────────────────────────────────────────────────────────────────────
// PUBLIC · the gateway
// ─────────────────────────────────────────────────────────────────────

export const PUBLIC_ROUTES: readonly Route[] = [
  R("/", "Home", "gateway", "AS-32",
    { notes: "Hero region, then routes into the collection. No figure above the fold." }),
  R("/collection", "The Collection", "gateway", "AS-01"),
  R("/collection/[property]", "Property", "space", "AS-03", { params: ["property"] }),
  R("/collection/[property]/space", "Space", "space", "AS-03", { params: ["property"] }),
  R("/collection/[property]/capital", "Capital", "space", "AS-03", { params: ["property"],
    notes: "The Capital LENS at the space vantage. Renders AP-03 and routes to the console; it " +
           "does not render console disclosure because a tab is labelled Capital." }),
  R("/collection/[property]/time", "Time", "space", "AS-03", { params: ["property"] }),
  R("/collection/[property]/location", "Location", "space", "AS-12", { params: ["property"] }),
  R("/collection/[property]/gallery", "Gallery", "space", "AS-10", { params: ["property"] }),
  R("/gallery", "Gallery", "gateway", "AS-09"),
  R("/story", "Story", "gateway", "AS-08"),
  R("/portfolio", "The Portfolio", "gateway", "AS-07"),
  R("/how-capital-works", "How Capital Works", "capital", "AS-04",
    { accessOverride: { access: "public", because:
        "The waterfall explainer is the single most important thing a prospective investor can " +
        "read before committing, and putting it behind a sign-in would mean the disclosure only " +
        "reaches people who have already decided." } }),
  R("/voices", "Voices", "gateway", "AS-24",
    { notes: "Testimonials. No figure, no return, no performance reference — regulated speech." }),
  R("/answers", "Answers", "gateway", "AS-17"),
  R("/status", "System Status", "gateway", "AS-15"),
  R("/roles", "Open Roles", "gateway", "AS-18"),
  R("/roles/[code]", "Role", "gateway", "AS-18", { params: ["code"] }),
];

// ─────────────────────────────────────────────────────────────────────
// LEGAL · the standing statements
//
// Every one is public and indexable. A legal document behind a sign-in
// is a legal document nobody can rely on before they sign in, which is
// exactly when they need it.
// ─────────────────────────────────────────────────────────────────────

export const LEGAL_ROUTES: readonly Route[] = [
  R("/legal", "Legal", "gateway", "AS-29", { notes: "Index of the standing documents." }),
  R("/legal/terms", "Terms and Conditions", "gateway", "AS-29"),
  R("/legal/privacy", "Privacy Notice", "gateway", "AS-29"),
  R("/legal/cookies", "Cookie Notice", "gateway", "AS-29"),
  R("/legal/risk-disclosure", "Risk Disclosure", "capital", "AS-14",
    { accessOverride: { access: "public", because:
        "It gates commitment, and it is also the document a prospective investor most needs to " +
        "read before deciding whether to start. Public to read; the ACKNOWLEDGEMENT still " +
        "requires identity and is recorded against a version." } }),
  R("/legal/disclosures", "Standing Disclosures", "gateway", "AS-29",
    { notes: "Capital at risk, past performance, no guarantee. Body size, reading tone." }),
  R("/legal/complaints", "Complaints Procedure", "gateway", "AS-29"),
  R("/legal/accessibility", "Accessibility Statement", "gateway", "AS-29",
    { notes: "States what has been tested and what has not. Currently: contrast computed, no " +
             "assistive-technology testing performed." }),
];

// ─────────────────────────────────────────────────────────────────────
// AUTH & THE PASSPORT
//
// Sixteen stages, resumable. Each is its own URL so a partial
// application can be returned to by link rather than by replay.
// ─────────────────────────────────────────────────────────────────────

export const PASSPORT_STAGES = [
  "discover", "eligibility", "profile", "identity", "address", "tax-residency",
  "screening", "accreditation", "suitability", "source-of-funds", "documents",
  "risk-profile", "review", "decision", "issued", "annual-review",
] as const;

/**
 * Why every passport stage admits someone who is not yet a member.
 *
 * The passport is how a person BECOMES a member. Requiring membership to
 * reach it would close the only door into the system.
 */
export const PASSPORT_ACCESS_REASON =
  "Accreditation is reached before membership exists, by definition — the Member Law fires on " +
  "settlement, and settlement cannot happen until accreditation has. Requiring member access " +
  "here would close the only door into the system.";

export const AUTH_ROUTES: readonly Route[] = [
  R("/auth/sign-in", "Identify", "gateway", "AS-32",
    { notes: "No password is ever handled by the design system. Delegated." }),
  R("/auth/verify", "Verify", "gateway", null,
    { notes:
        "The token arrives as a QUERY parameter, not a path segment, and it is not declared as " +
        "a param for that reason. It is in the URL at all only because an email link has no " +
        "other carrier — so it is single-use, short-lived, and stripped from the address bar on " +
        "arrival. A URL is written to server logs, browser history and referrer headers." }),
  R("/auth/sign-out", "Sign Out", "gateway", null),
  R("/passport", "Your Passport", "member", null,
    { accessOverride: { access: "identified", because:
        "The passport is how someone BECOMES a member. Requiring membership to reach it would " +
        "close the only door into the system." } }),
  /* The reason is identical for all sixteen, so it is one string rather
     than sixteen assembled ones — a computed reason is also a reason no
     static check can read. */
  ...PASSPORT_STAGES.map((st, i) =>
    R(`/passport/${st}`, `Passport · ${st.replace(/-/g, " ")}`, "member", "AS-06", {
      accessOverride: { access: "identified", because: PASSPORT_ACCESS_REASON },
      notes: i === 0
        ? "Stage 1 of 16. Resumable — each field autosaves on blur to a draft record, which is " +
          "what makes PR-01 genuinely resumable rather than a second mechanism."
        : undefined,
    })),
];

// ─────────────────────────────────────────────────────────────────────
// MEMBER · the workspace
// ─────────────────────────────────────────────────────────────────────

export const MEMBER_ROUTES: readonly Route[] = [
  R("/member", "Your Position", "member", "AS-05"),
  R("/member/position", "Position", "member", "AS-05"),
  R("/member/holdings", "Holdings", "member", "AS-10"),
  R("/member/holdings/[property]", "Holding", "member", "AS-03", { params: ["property"] }),
  R("/member/distributions", "Distributions", "member", "AS-05"),
  R("/member/distributions/[ref]", "Distribution", "member", "AS-05", { params: ["ref"] }),
  R("/member/calls", "Capital Calls", "member", "AS-26"),
  R("/member/calls/[ref]", "Capital Call", "member", "AS-26", { params: ["ref"],
    notes: "Default consequences render in full above the payment control." }),
  R("/member/entitlement", "Entitlement", "time", "AS-25"),
  R("/member/entitlement/[year]", "Entitlement Year", "time", "AS-25", { params: ["year"] }),
  R("/member/resolutions", "Resolutions", "member", "AS-33"),
  R("/member/resolutions/[ref]", "Ballot", "member", "AS-27", { params: ["ref"],
    notes: "Sealed at every vantage. The confirmation never echoes the choice." }),
  R("/member/documents", "Documents", "member", "AS-05"),
  R("/member/documents/[id]", "Document", "member", "AS-05", { params: ["id"] }),
  R("/member/reports", "Reports", "member", "AS-05"),
  R("/member/notifications", "Notifications", "member", null,
    { notes: "The alert centre. A system ticker (SIGNAL_APERTURE) never lands here; only things " +
             "asked of the member do." }),
  R("/member/profile", "Passport", "member", "AS-33"),
  /* MEM.05 through MEM.08. Member access: the guard fails closed, so
     these deny for anyone who has not settled a position. */
  R("/member/calibration", "Unit Calibration", "member", "AS-33",
    { notes: "MEM.05. Every control is real and none can be transmitted: the property is at " +
             "pre-construction, so there is no management system to reach." }),
  R("/member/signal", "The Signal", "member", "AS-33",
    { notes: "MEM.06. A written, asynchronous record with the operating partner. No presence " +
             "indicator and no typing state — both promise an immediacy the queue does not have." }),
  R("/member/codex", "The Codex", "member", "AS-33",
    { notes: "MEM.07. The manual for one property. The conduct-linked forced buyback the source " +
             "specifies is marked as not drafted and not in force." }),
  R("/member/pass", "Access Credentials", "member", "AS-33",
    { notes: "MEM.08. Issuing spends your nights and puts the visitor's conduct on your record." }),

  R("/member/settings", "Settings", "member", null),
  R("/member/settings/notifications", "Notification Settings", "member", null),
  R("/member/settings/security", "Security", "member", null),
  R("/member/settings/tax", "Tax Details", "member", null),
];

// ─────────────────────────────────────────────────────────────────────
// CAPITAL · the accountable workspace
// ─────────────────────────────────────────────────────────────────────

export const CAPITAL_ROUTES: readonly Route[] = [
  R("/capital", "Capital Console", "capital", "AS-02", { rights: ["portfolio.manage"] }),
  R("/capital/properties", "Properties", "capital", "AS-02", { rights: ["portfolio.manage"] }),
  R("/capital/properties/[id]", "Property Console", "capital", "AS-02",
    { params: ["id"], rights: ["portfolio.manage"] }),
  R("/capital/properties/[id]/programme", "Programme", "capital", "AS-11",
    { params: ["id"], rights: ["property.advance_lifecycle"] }),
  R("/capital/properties/[id]/valuations", "Valuations", "capital", "AS-02",
    { params: ["id"], rights: ["valuation.record"] }),
  R("/capital/waterfall", "Waterfall", "capital", "AS-04", { rights: ["distribution.execute"] }),
  R("/capital/distributions", "Distributions", "capital", "AS-02",
    { rights: ["distribution.execute"] }),
  R("/capital/distributions/[ref]", "Distribution", "capital", "AS-02",
    { params: ["ref"], rights: ["distribution.execute"] }),
  R("/capital/calls", "Capital Calls", "capital", "AS-26", { rights: ["capital.call"] }),
  R("/capital/risk", "Risk Register", "capital", "AS-28", { rights: ["compliance.record"] }),
  R("/capital/offerings", "Offerings", "capital", "AS-02", { rights: ["offering.open"] }),
  // The commitment path. Reached by an Investor who is not yet a Member.
  R("/commit/[offering]", "Commit", "capital", "AS-06", { params: ["offering"],
    accessOverride: { access: "accredited", because:
      "An Investor commits BEFORE membership exists — the Member Law fires on settlement, not " +
      "here. Requiring member access would make it unreachable by anyone who could use it." } }),
  R("/commit/[offering]/risk", "Risk Disclosure", "capital", "AS-14", { params: ["offering"],
    accessOverride: { access: "accredited", because:
      "The gate immediately before commitment, on the same path and for the same reason." } }),
  R("/commit/[offering]/execute", "Execute", "capital", "AS-19", { params: ["offering"],
    accessOverride: { access: "accredited", because:
      "The execution sequence for a commitment made before membership exists." } }),
];

// ─────────────────────────────────────────────────────────────────────
// ADMIN · the offices
//
// Every route names the RIGHT it requires, not a role. Rights are granted
// to offices and can be revoked; a route bound to a role would survive the
// revocation.
// ─────────────────────────────────────────────────────────────────────

export const ADMIN_ROUTES: readonly Route[] = [
  R("/admin", "Administration", "admin", null, { rights: ["organization.register"] }),
  R("/admin/vehicles", "Vehicles", "admin", "AS-13", { rights: ["vehicle.form"] }),
  R("/admin/vehicles/new", "Form a Vehicle", "admin", "AS-34",
    { rights: ["vehicle.form"],
      notes: "Eight stages. Two irreversible, two gated on Board approval. §24a: the LLP is the " +
             "default and any other legal form needs a resolution naming the specific property." }),

  /* Publishing. content.publish sits with the Governance Office and
     media.manage with the Executive Office — see lib/authority.ts. */
  R("/admin/content", "Content", "admin", "AS-34",
    { rights: ["content.publish"],
      notes: "Every content class, its source, whether it binds and whether it is versioned." }),
  R("/admin/media", "Media", "admin", "AS-34",
    { rights: ["media.manage"],
      notes: "Three kinds, required at registration with no default. A render registered as a " +
             "photograph is a misrepresentation that needs no words." }),
  R("/admin/vehicles/[llpin]", "Docket", "admin", "AS-13",
    { params: ["llpin"], rights: ["vehicle.form"] }),
  R("/admin/vehicles/[llpin]/formation", "Formation", "admin", "AS-13",
    { params: ["llpin"], rights: ["vehicle.form"] }),
  R("/admin/vehicles/[llpin]/partners", "Register of Partners", "admin", "AS-13",
    { params: ["llpin"], rights: ["vehicle.form"] }),
  R("/admin/vehicles/[llpin]/filings", "Statutory Calendar", "admin", "AS-13",
    { params: ["llpin"], rights: ["compliance.record"] }),
  R("/admin/vehicles/[llpin]/charges", "Charges", "admin", "AS-13",
    { params: ["llpin"], rights: ["vehicle.form"] }),
  R("/admin/vehicles/[llpin]/resolutions", "Resolutions", "admin", "AS-13",
    { params: ["llpin"], rights: ["resolution.table"] }),
  R("/admin/vehicles/[llpin]/audit", "Docket Audit", "admin", "AS-13",
    { params: ["llpin"], rights: ["compliance.record"] }),
  R("/admin/governance", "Governance", "admin", null, { rights: ["resolution.table"] }),
  R("/admin/governance/committees", "Committees", "admin", null,
    { rights: ["committee.constitute"] }),
  R("/admin/governance/resolutions", "Resolutions", "admin", "AS-27",
    { rights: ["resolution.table"] }),
  R("/admin/governance/resolutions/[ref]", "Resolution", "admin", "AS-27",
    { params: ["ref"], rights: ["resolution.resolve"],
      notes: "Results only. Admin is NOT an exception to I-05 — it is the vantage most likely to " +
             "assume it is." }),
  R("/admin/governance/policies", "Policies", "admin", null, { rights: ["policy.approve"] }),
  R("/admin/compliance", "Compliance", "admin", null, { rights: ["compliance.record"] }),
  R("/admin/compliance/events", "Compliance Events", "admin", null,
    { rights: ["compliance.record"] }),
  R("/admin/compliance/accreditation", "Accreditation Queue", "admin", null,
    { rights: ["accreditation.grant"] }),
  R("/admin/compliance/conflicts", "Conflict Register", "admin", null,
    { rights: ["conflict.disclose"] }),
  R("/admin/ledger", "Ledger", "admin", null, { rights: ["capital.deploy"] }),
  R("/admin/telemetry", "Telemetry", "admin", null, { rights: ["portfolio.manage"] }),
  R("/admin/authority", "Authority", "admin", null, { rights: ["authority.grant"] }),
  R("/admin/authority/grants", "Grants", "admin", null, { rights: ["authority.grant"] }),
  R("/admin/authority/revocations", "Revocations", "admin", null, { rights: ["authority.revoke"] }),
  R("/admin/reports", "Reports", "admin", null, { rights: ["report.publish"] }),
  R("/admin/research", "Research", "admin", null, { rights: ["diligence.complete"] }),
  R("/admin/failure", "Constitutional Failure", "admin", null,
    { rights: ["constitutional_failure.declare"],
      notes: "CF-01..CF-06. The gravest surface in the system and the least used. Declaring a " +
             "failure requires a resolution reference, not a role — there is no login that can " +
             "do this alone." }),
];

// ─────────────────────────────────────────────────────────────────────
// SYSTEM · states rather than places
// ─────────────────────────────────────────────────────────────────────

export const SYSTEM_ROUTES: readonly Route[] = [
  R("/404", "Not Found", "gateway", "AS-16",
    { notes: "No stack trace, no exception name, no auto-redirect." }),
  R("/403", "Not Permitted", "gateway", "AS-16",
    { notes: "Says the viewer may not see it. Never says whether it EXISTS — that distinction " +
             "leaks the shape of the system to anyone probing it." }),
  R("/500", "System Error", "gateway", "AS-16"),
  R("/maintenance", "Maintenance", "gateway", "AS-15"),
  R("/search", "Search", "gateway", null,
    { accessOverride: { access: "identified", because:
        "Results are scoped to what the viewer may see, which requires knowing who they are. An " +
        "anonymous search would either return nothing or leak the index." } }),
];

// ─────────────────────────────────────────────────────────────────────

// -----------------------------------------------------------------
// THE WORKED FLOW - SlowSpace Coastal LLP, Padubidri
//
// One offering walked end to end, so the arc from gateway to settled
// position can be seen rather than described. Public throughout: every
// step is what a prospective investor is shown BEFORE they have an
// identity, and the guard on the real member routes is unaffected.
// -----------------------------------------------------------------

/*
 * These render DEMONSTRATION components against illustrative data for a
 * fictional partner - not the registered assemblies against real records.
 * That distinction is what makes public acceptable, and it is why every
 * one declares `assembly: null`.
 *
 * route-lint caught the alternative. Claiming `assembly: "AS-05"` on the
 * settled step failed immediately: AS-05 renders AP-04 at the member
 * vantage, and an override may relax the route without relaxing the
 * disclosure model underneath it. The check was right and the first
 * version of this table was wrong.
 */
export const FLOW_REASON =
  "A worked demonstration of the whole arc, on illustrative data for a fictional partner rather " +
  "than a real position. Public because the point is that a prospective investor can see every " +
  "step - including the accreditation and disclosure they would meet later - before committing " +
  "to any of it.";

export const FLOW_ROUTES: readonly Route[] = [
  R("/flow", "SlowSpace Coastal", "space", null,
    { notes: "Step 1 of 5. The offering at the space vantage: capital stack, six-stage waterfall, " +
             "governance and programme, each carrying its confidence class." }),
  R("/flow/accreditation", "Accreditation", "member", null,
    { accessOverride: { access: "public", because: FLOW_REASON },
      notes: "Step 2. PR-01, resumable - each field saves on blur to a draft record." }),
  R("/flow/risk", "Risk Disclosure", "capital", null,
    { accessOverride: { access: "public", because: FLOW_REASON },
      notes: "Step 3. Seven clauses in severity order, on paper. The gate opens on reaching the " +
             "end by any route." }),
  R("/flow/commit", "Commit", "capital", null,
    { accessOverride: { access: "public", because: FLOW_REASON },
      notes: "Step 4. The piston, 3000ms linear. States Committed, never Member." }),
  R("/flow/settled", "Settled", "member", null,
    { accessOverride: { access: "public", because: FLOW_REASON },
      notes: "Step 5. The first screen where the Member Law has fired." }),
];

// -----------------------------------------------------------------
// THE JOURNAL
//
// What the platform says about itself, one binding decision at a time.
// Public, gateway vantage, and deliberately separate from /voices:
// what partners say about returns is regulated speech, and an
// explanation of a mechanism is not.
// -----------------------------------------------------------------

export const JOURNAL_ROUTES: readonly Route[] = [
  R("/journal", "The Journal", "gateway", "AS-30",
    { notes: "Index. Entries newest first; the order is checked at load." }),
  R("/journal/[slug]", "Journal Entry", "gateway", "AS-30",
    { params: ["slug"],
      notes: "One entry. Figures are read from the registries, never typed into the prose." }),
];

/**
 * WHAT A PAGE HOLDS, WHERE NO ASSEMBLY SAYS IT.
 *
 * Most routes render a registered assembly, and that assembly's sections
 * already state what is on the screen. Twenty-nine did not: they declare
 * `assembly: null`, so the information-architecture map had nothing to
 * report and listed them as URLs with no contents.
 *
 * A URL with no stated contents is a page nobody has described. It builds
 * anyway, renders a shell, and reads on the map as though the system were
 * smaller than it is.
 *
 * Each entry below is the page's parts, in the order they appear. This is
 * a DECLARATION, not documentation of something already built: several of
 * these pages are still shells, and what is written here is what they owe.
 *
 * Keyed by route path. gen-ia-map.js reads it, and reports any route that
 * has neither an assembly nor an entry here.
 */
export const PAGE_CONTENTS: Record<string, readonly { part: string; holds: string }[]> = {
  "/auth/verify": [
    { part: "Verifying", holds: "The state while a link is checked. No control, because there is nothing for the viewer to do." },
    { part: "Expired", holds: "What a stale link means and how to request another. Links are single-use and time-bound." },
    { part: "Wrong device", holds: "Stated plainly rather than treated as a failure — a link opened elsewhere is ordinary, not suspicious." },
  ],
  "/auth/sign-out": [
    { part: "Confirmation", holds: "That the session ended, and on which device." },
    { part: "Other sessions", holds: "Whether sessions remain elsewhere, and the control to end them." },
  ],
  "/passport": [
    { part: "Progress", holds: "The sixteen stages with the state of each: complete, in progress, not started." },
    { part: "Resume", holds: "A link to the furthest incomplete stage. The application is resumable by URL, so this is a shortcut and never the only way back." },
    { part: "What is held", holds: "Which documents have been received, and which are outstanding." },
    { part: "Decision", holds: "The standing decision and its date, once one exists." },
  ],
  "/member/notifications": [
    { part: "Unread", holds: "Events since last read, newest first, each naming the vehicle it concerns." },
    { part: "All", holds: "The full record. A notification is never deleted, only marked read." },
    { part: "Delivery", holds: "Which channels carried each one, so a missed notice can be traced rather than disputed." },
  ],
  "/member/profile": [
    { part: "Identity", holds: "Name, contact, and tax residency as recorded. Changes are proposed, not applied — an identity on a register is not edited in place." },
    { part: "Verification", holds: "What has been verified, when, and against which document." },
    { part: "Positions", holds: "Every vehicle this identity is a partner in, with the date settlement fired." },
  ],
  "/member/settings": [
    { part: "Index", holds: "Notifications, security and tax, each with the one line that says what it governs." },
  ],
  "/member/settings/notifications": [
    { part: "Channels", holds: "Email and in-platform, per event class." },
    { part: "Cannot be silenced", holds: "Capital calls, resolutions and distributions. Stated as unsilenceable rather than shown as a control that refuses to move." },
  ],
  "/member/settings/security": [
    { part: "Sessions", holds: "Where this identity is signed in, and the control to end each." },
    { part: "Second factor", holds: "State and enrolment. Required before any office right is granted." },
    { part: "Recent activity", holds: "Sign-ins with time and network address, retained thirteen months." },
  ],
  "/member/settings/tax": [
    { part: "Residency", holds: "Declared jurisdiction, and the date it was last confirmed." },
    { part: "Withholding", holds: "The rate applied to distributions and the basis for it." },
    { part: "Documents", holds: "Certificates held, with expiry. An expired certificate changes the rate, and says so before it does." },
  ],
  "/admin": [
    { part: "Standing", holds: "What is open, what is overdue and what is unassigned, across every vehicle." },
    { part: "By vehicle", holds: "One row per vehicle with its lifecycle state and open items." },
    { part: "Rights", holds: "Which rights the viewer holds, since every control here is gated on one." },
  ],
  "/admin/governance": [
    { part: "Committees", holds: "Standing committees, their remit and their membership." },
    { part: "Resolutions", holds: "Open ballots and their thresholds." },
    { part: "Policies", holds: "Instruments in force, with version and date." },
  ],
  "/admin/governance/committees": [
    { part: "Register", holds: "Each committee, its remit, its quorum and who sits on it." },
    { part: "Conflicts", holds: "Declared interests per member, and the matters they may not vote on." },
    { part: "Terms", holds: "When each appointment ends. A committee whose terms have lapsed is shown as lapsed, not as sitting." },
  ],
  "/admin/governance/policies": [
    { part: "In force", holds: "Every policy with its version, effective date and the resolution that ratified it." },
    { part: "Superseded", holds: "Prior versions, retained. A policy relied on in the past must remain retrievable." },
    { part: "Review", holds: "Next review date, and what is overdue." },
  ],
  "/admin/compliance": [
    { part: "Open events", holds: "Findings, notices and breaches, by severity." },
    { part: "Accreditation", holds: "Applications by state, and what each is waiting on." },
    { part: "Conflicts", holds: "The register, and matters currently constrained by it." },
  ],
  "/admin/compliance/events": [
    { part: "Register", holds: "Every compliance event with its class, the capability that raised it and the reason recorded." },
    { part: "Ageing", holds: "How long each has been open, against the period allowed for it." },
    { part: "Closure", holds: "What closed an event, by whom, and the reason. E-02 — a closure with no reason is not a closure." },
  ],
  "/admin/compliance/accreditation": [
    { part: "Queue", holds: "Applications awaiting a decision, oldest first." },
    { part: "Held", holds: "Applications waiting on the applicant, and what for." },
    { part: "Decisions", holds: "Granted and refused, each with its recorded reason and the person who made it." },
  ],
  "/admin/compliance/conflicts": [
    { part: "Declarations", holds: "Every declared interest, who declared it and when." },
    { part: "Constraints", holds: "The matters each declaration bars its holder from. I-07." },
    { part: "Unresolved", holds: "Interests declared with no constraint recorded — a declaration nobody acted on." },
  ],
  "/admin/ledger": [
    { part: "Entries", holds: "The append-only record. Nothing here is edited; a correction is a further entry." },
    { part: "Reconciliation", holds: "Where the ledger and the vehicle records last agreed, and any current difference." },
    { part: "Seal", holds: "The hash chain and its last verification. A ledger that cannot be verified is a spreadsheet." },
  ],
  "/admin/telemetry": [
    { part: "Health", holds: "What is running, what is degraded, and since when." },
    { part: "Volumes", holds: "Events by class over time, so an absence of events is visible as an absence." },
    { part: "Failures", holds: "Errors by surface, with the route that raised them." },
  ],
  "/admin/authority": [
    { part: "Rights", holds: "Every declared right and what it permits." },
    { part: "Holders", holds: "Who holds each right, and under which grant." },
    { part: "Unheld", holds: "Rights nobody holds. A right nobody holds is a capability nobody can exercise, and that is worth seeing." },
  ],
  "/admin/authority/grants": [
    { part: "Grants", holds: "Each grant with its right, its holder, its reason and its expiry." },
    { part: "Expiring", holds: "Grants ending within thirty days." },
    { part: "Standing", holds: "Grants with no expiry, listed separately because a permanent grant deserves to be looked at." },
  ],
  "/admin/authority/revocations": [
    { part: "Revocations", holds: "What was withdrawn, from whom, when and why." },
    { part: "Effect", holds: "What each holder could no longer do from the moment it took effect." },
    { part: "Pending", holds: "Revocations scheduled but not yet in force." },
  ],
  "/admin/reports": [
    { part: "Standing", holds: "Reports produced on a schedule, with the last run and the next." },
    { part: "Ad hoc", holds: "Reports built on request, with the parameters that produced them." },
    { part: "Provenance", holds: "For each report, which records it drew on and at what time — a report with no as-at time cannot be reconciled later." },
  ],
  "/admin/research": [
    { part: "Market intelligence", holds: "Records held, with source and confidence class." },
    { part: "Coverage", holds: "Which regions and asset classes are covered, and which are not." },
    { part: "Age", holds: "How old each record is. Research is treated as perishable and its age is shown, not buried." },
  ],
  "/admin/failure": [
    { part: "Constitutional failure", holds: "What rule was breached, when, and by which capability." },
    { part: "Containment", holds: "What was suspended automatically, and what remains running." },
    { part: "Record", holds: "The full event, unedited. This page exists so a failure cannot be quietly resolved." },
  ],
  "/search": [
    { part: "Query", holds: "One field. Results are scoped to what the viewer may already reach." },
    { part: "Results", holds: "Grouped by kind — vehicles, properties, documents, resolutions." },
    { part: "Absence", holds: "A result the viewer may not reach is not shown as withheld. It is not shown, because 'you may not see this' confirms it exists." },
  ],
  "/flow": [
    { part: "Masthead", holds: "The property, its jurisdiction and its coordinates." },
    { part: "The unit", holds: "Commitment, share, indicative distribution and entitlement, each with its confidence class." },
    { part: "Capital stack", holds: "Land, formation and facility, on the paper ground because it is an assertion." },
    { part: "The waterfall", holds: "Six stages in order, closing to 100%, with debt service stated as its own stage." },
    { part: "Returns", holds: "Cash yield, cover ratio, payback and exit, each classed. The dossier's inconsistency is stated here rather than resolved silently." },
    { part: "Governance", holds: "Voting basis and thresholds, read from the LLP Agreement." },
  ],
  "/flow/commit": [
    { part: "Review", holds: "Vehicle, property, share, amount, completion window and lock-in — every term that binds, before the control that binds it." },
    { part: "The piston", holds: "A three-second sustained press. The duration is the deliberation, and no undo follows." },
    { part: "Derivation", holds: "How the unit falls out of the equity layer, on paper." },
    { part: "Recorded", holds: "State becomes Committed, never Member. The Member Law fires on settlement." },
  ],
};

// -----------------------------------------------------------------
// THE PUBLIC SURFACE — PUB.01 through PUB.11
//
// From GC Collective Wireframes 2.0. Every one is public and
// indexable: these are the pages that exist to be found.
//
// /gallery, /portfolio, /story, /voices, /answers and /journal already
// serve PUB.03, PUB.04 and PUB.08, and are retained as they stand. The
// endpoints below are the ones the wireframes add.
// -----------------------------------------------------------------

export const COLLECTIVE_ROUTES: readonly Route[] = [
  R("/how-it-works", "How It Works", "gateway", "AS-32",
    { notes: "PUB.02 / PUB.11 — the doctrine, then a hard cut to the arithmetic. Distinct from " +
             "/how-capital-works, which is the waterfall itself rather than the argument for it." }),
  R("/collective/partners", "The Foundation", "gateway", "AS-32",
    { notes: "PUB.05 — the independent firms. Ships with functions stated and holders withheld " +
             "until each engagement is recorded against the vehicle it serves." }),
  R("/collective/operators", "The Operators", "gateway", "AS-32",
    { notes: "PUB.06 — what runs a property, and who is accountable when it does not." }),
  R("/collective/press", "The Wire", "gateway", "AS-32",
    { notes: "PUB.10 — external coverage. Ships empty and says so; the wireframe's six clippings " +
             "were quotes attributed to real publications that have not published them." }),
  R("/communique/request", "Request the Dossier", "gateway", "AS-32",
    { notes: "PUB.07 — the intelligence pack. What requesting it creates is stated above the form." }),
  R("/signal", "The Signal", "gateway", "AS-32",
    { notes: "PUB.09 — the weekly transmission. No tuner gate; the form is simply present." }),

  /* The triad. Capital is already public at /how-capital-works, which is
     the same page under an older name and is retained rather than
     duplicated — /capital belongs to the office workspace. */
  R("/space", "Space", "gateway", "AS-32",
    { notes: "The physical product: what is built, from what, and what it takes to keep standing." }),
  R("/time", "Time", "gateway", "AS-32",
    { notes: "Entitlement: what it is, what it is not, and when it begins. The wireframe's " +
             "exchange console is stated as unbuilt rather than described as though it exists." }),

  R("/collective/gallery", "The Evidence Portfolio", "gateway", "AS-32",
    { notes: "PUB.08. Ships empty: every plate must say whether it is a photograph, a render or " +
             "a drawing, and a portfolio of renders shown as photographs is the commonest " +
             "misrepresentation in this industry. /gallery (AS-09) is a property gallery and is " +
             "a different thing; both are retained." }),
  R("/structure", "The Vehicle", "gateway", "AS-32",
    { notes: "From the PUB.01 footer, which calls it SPV Structure. The constitutional default " +
             "is an LLP; an SPV needs Board approval per property, and the page says so." }),
];

export const ROUTES: readonly Route[] = [
  ...PUBLIC_ROUTES, ...LEGAL_ROUTES, ...AUTH_ROUTES,
  ...MEMBER_ROUTES, ...CAPITAL_ROUTES, ...ADMIN_ROUTES, ...SYSTEM_ROUTES,
  ...FLOW_ROUTES,
  ...JOURNAL_ROUTES,
  ...COLLECTIVE_ROUTES,
];

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
