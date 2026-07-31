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
  R("/", "Home", "gateway", "AS-23",
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
  R("/legal", "Legal", "gateway", null, { notes: "Index of the standing documents." }),
  R("/legal/terms", "Terms of Use", "gateway", null),
  R("/legal/privacy", "Privacy Notice", "gateway", null),
  R("/legal/cookies", "Cookie Notice", "gateway", null),
  R("/legal/risk-disclosure", "Risk Disclosure", "capital", "AS-14",
    { accessOverride: { access: "public", because:
        "It gates commitment, and it is also the document a prospective investor most needs to " +
        "read before deciding whether to start. Public to read; the ACKNOWLEDGEMENT still " +
        "requires identity and is recorded against a version." } }),
  R("/legal/disclosures", "Standing Disclosures", "gateway", null,
    { notes: "Capital at risk, past performance, no guarantee. Body size, reading tone." }),
  R("/legal/complaints", "Complaints Procedure", "gateway", null),
  R("/legal/accessibility", "Accessibility Statement", "gateway", null,
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
  R("/auth/sign-in", "Sign In", "gateway", null,
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
  R("/member/resolutions", "Resolutions", "member", "AS-27"),
  R("/member/resolutions/[ref]", "Ballot", "member", "AS-27", { params: ["ref"],
    notes: "Sealed at every vantage. The confirmation never echoes the choice." }),
  R("/member/documents", "Documents", "member", "AS-05"),
  R("/member/documents/[id]", "Document", "member", "AS-05", { params: ["id"] }),
  R("/member/reports", "Reports", "member", "AS-05"),
  R("/member/notifications", "Notifications", "member", null,
    { notes: "The alert centre. A system ticker (SIGNAL_APERTURE) never lands here; only things " +
             "asked of the member do." }),
  R("/member/profile", "Profile", "member", null),
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

export const ROUTES: readonly Route[] = [
  ...PUBLIC_ROUTES, ...LEGAL_ROUTES, ...AUTH_ROUTES,
  ...MEMBER_ROUTES, ...CAPITAL_ROUTES, ...ADMIN_ROUTES, ...SYSTEM_ROUTES,
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
