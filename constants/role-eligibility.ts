/**
 * THE ROLE ELIGIBILITY LAYER — v5 RBAC, as data
 *
 * Authority: GC-IA-V5 · RBAC sheet ("Vehicle-scoped access")
 *
 * ── WHAT THIS IS, AND WHAT IT IS NOT ─────────────────────────────────
 * Fourteen PRINCIPALS: the kinds of party that can hold authority here,
 * what each may see when it is scoped to a vehicle, and the boundary each
 * must not cross.
 *
 * It is not a permission table. The v5 sheet is explicit that permissions
 * are `principal × vehicle × object × command × state × authority × time`,
 * and six of those seven live elsewhere — Command Rights and SoD Controls
 * govern consequential commands, lib/authority.ts holds the rights, and
 * the grant carries the vehicle, the expiry and the reason. What this file
 * adds is the first term, and the DECLARATION of what each principal is
 * eligible for. Nothing here grants anything.
 *
 * ── WHY A SEPARATE FILE RATHER THAN MORE ROLES ───────────────────────
 * The obvious move was to widen the `Role` union in lib/authority.ts from
 * eight to fourteen. It would have been wrong twice over.
 *
 * The eight roles are OFFICES AND COMMITTEES — board, investment
 * committee, executive office. The v5 fourteen are PARTIES — a lender, an
 * auditor, an agent, a partner. Those are different axes, and collapsing
 * them would have made `Role` mean two things at once.
 *
 * Ten of the fourteen were already modelled, most of them as digital
 * profiles rather than roles. Adding them again as roles would have been
 * a second source of truth for the same party, and the two would have
 * disagreed the first time somebody edited one.
 *
 * ── THE VEHICLE TIER, AND WHY IT IS ALL ONE ROLE ─────────────────────
 * Designated Partner, Partner and Authorised Signatory all bind to
 * `member`. That is not a simplification — it is what the sheet says.
 *
 * On the Authorised Signatory it says so outright: "Signing authority is
 * a named, expiring grant per mandate — NOT a property of the role."
 * A role that conferred signing authority would survive the mandate that
 * justified it, which is the precise failure LAW 1 exists to prevent.
 *
 * The Designated Partner is the same shape from the other direction:
 * "DPIN + DSC holder; statutory duties attach to THE PERSON." A statutory
 * duty attaching to a person is an attribute of that person and their
 * mandate, not a tier of access.
 *
 * So both are `mandate: true` — the same role, distinguished by the scope,
 * reason and expiry on the grant. `scripts/grant.mjs` is how one is
 * issued, and the reason column is where the mandate is named.
 */

import type { Role } from "../lib/authority";
import type { DigitalProfileId } from "./digital-profiles";

/** The four tiers the sheet groups principals into. */
export type PrincipalTier = "gc_governance" | "vehicle" | "external" | "ai";

export interface Principal {
  id: string;
  /** The name as it appears in the v5 RBAC sheet. */
  name: string;
  tier: PrincipalTier;
  /** What this principal sees, scoped to one vehicle. Verbatim intent. */
  sees: string;
  /** What it must not do. Every principal has one; none is optional. */
  boundary: string;
  /**
   * The role a grant to this principal may name. Absent for the external
   * and AI tiers, which hold no role at all — an external specialist works
   * through a scoped engagement, and neither agent can hold authority by
   * construction (`requestableRoles: []` on both AI profiles).
   */
  role?: Role;
  /** The digital profiles that carry this principal's workspace access. */
  profiles: readonly DigitalProfileId[];
  /**
   * True where the principal is a MANDATE over its role rather than a
   * distinct role — the authority arrives on the grant, expires with it,
   * and leaves nothing behind.
   */
  mandate?: boolean;
}

export const PRINCIPALS: readonly Principal[] = [
  // ── GC Governance ───────────────────────────────────────────────────
  {
    id: "gc_executive", name: "GC Executive", tier: "gc_governance",
    role: "executive_office", profiles: ["shared_chief_executive"],
    sees: "Collection, every vehicle cockpit, Network",
    boundary:
      "Enterprise direction; must not decide reserved matters or §24a thresholds alone.",
  },
  {
    id: "gc_coo_vp", name: "GC COO / VP", tier: "gc_governance",
    role: "executive_office", profiles: ["vp_portfolio_platform"],
    sees: "Project super-workspace: timeline, budget, workstreams, consultants, risks, decisions",
    boundary:
      "Operational owner-side; no capital-execution + governance-review combination (GP-06).",
  },
  {
    id: "gc_investor_relations", name: "GC Investor Relations", tier: "gc_governance",
    role: "compliance_office", profiles: ["investor_relations"],
    sees: "Prospects, qualification, dossiers, partner profiles, enquiries",
    boundary:
      "Accreditation and commitment acceptance need distinct named grants — never implied by the role.",
  },

  // ── Vehicle ─────────────────────────────────────────────────────────
  {
    id: "designated_partner", name: "Designated Partner", tier: "vehicle",
    role: "member", profiles: ["member"], mandate: true,
    sees: "Full vehicle read; governance prepare; statutory sign-offs",
    boundary:
      "DPIN + DSC holder; statutory duties (DIR-3 KYC, Form 8/11 signatures) attach to the person.",
  },
  {
    id: "partner", name: "Partner", tier: "vehicle",
    role: "member", profiles: ["member"],
    sees:
      "Overview R · Space R · Capital: vehicle summary + OWN account only · Time: own allocation " +
      "+ pool summary · Project R · Partner register LIMITED · Constitution/Resolutions R + VOTE " +
      "where eligible · Documents classification-dependent",
    boundary:
      "Never another partner's capital account. Extraordinary transparency without inappropriate exposure.",
  },
  {
    id: "authorised_signatory", name: "Authorised Signatory", tier: "vehicle",
    role: "member", profiles: ["member"], mandate: true,
    sees: "Instruments awaiting signature; the records they bind",
    boundary:
      "Signing authority is a named, expiring grant per mandate — not a property of the role.",
  },

  // ── External ────────────────────────────────────────────────────────
  // No role. An external specialist works through a scoped engagement,
  // and capacity is never authority.
  {
    id: "legal_counsel", name: "Legal Counsel", tier: "external",
    profiles: ["legal_entity_advisory_partner"],
    sees: "Governance drafts, agreements, entity records in their engagement scope",
    boundary:
      "Drafts; putting a document in force is a constitutional act it cannot perform.",
  },
  {
    id: "ca_cs", name: "CA / CS", tier: "external",
    profiles: ["financial_compliance_partner"],
    sees: "Capital records, tax, statutory filings within scope",
    boundary: "Prepares and files; approves nothing, moves nothing.",
  },
  {
    id: "architect_pmc_qs", name: "Architect / PMC / QS", tier: "external",
    profiles: ["portfolio_technical_partner"],
    sees: "Project workstreams, milestones, evidence uploads in scope",
    boundary:
      "Docket contribute; an internal reviewer accepts every deliverable (no self-review).",
  },
  {
    id: "lender", name: "Lender", tier: "external",
    profiles: ["banking_debt_insurance_partner"],
    sees: "Facility terms, covenant reporting agreed in the facility",
    boundary: "Sees covenant data the agreement grants — never the partner register.",
  },
  {
    id: "valuer_auditor", name: "Valuer / Auditor", tier: "external",
    profiles: ["financial_compliance_partner"],
    sees: "The records their opinion covers, read-only",
    boundary:
      "Their output enters as EVIDENCE with named source; recording it is GC's act.",
  },
  {
    id: "operator_brand_co", name: "Operator / Brand Co", tier: "external",
    profiles: ["operating_partner", "brand_communications_partner"],
    sees: "LLP-scoped operating work queue and documents only",
    boundary:
      "Cannot alter ownership, capital terms or governance; its vocabulary never crosses §25.",
  },

  // ── AI ──────────────────────────────────────────────────────────────
  // Both hold `requestableRoles: []` in digital-profiles.ts, so neither
  // can hold a right by construction rather than by policy.
  {
    id: "atlas", name: "ATLAS (GC-01)", tier: "ai",
    profiles: ["gc_01_platform_operations_agent"],
    sees: "Everything the Office reads, for monitoring/drafting/routing",
    boundary:
      "Escalates, NEVER approves: capital, accreditation, binding agreements, grants, payments above threshold.",
  },
  {
    id: "iris", name: "IRIS (GC-02)", tier: "ai",
    profiles: ["gc_02_investor_intelligence_agent"],
    sees: "The relationship context a prospect/member consents to",
    boundary:
      "Explains, prepares, remembers, hands off to humans (UX-07); cannot accredit, recommend, accept, bind or decide.",
  },
];

/**
 * The three laws, stated where the principals are, because a law kept in
 * a spreadsheet is a law nobody runs.
 *
 * Each names the mechanism that enforces it, so a claim here can be
 * checked against code rather than believed.
 */
export const ELIGIBILITY_LAWS = {
  roleIsNotAccess:
    "A role makes grants ELIGIBLE; access exists only as a named, vehicle-scoped, expiring, " +
    "reasoned grant (WF-3). Enforced by the Grant shape in lib/authority.ts, by the NOT NULL on " +
    "auth_office_grant.reason, and by authorise() having no default-allow branch.",
  noSeparationTriad:
    "No identity may hold a GP-06 separation triad. requestGrant() refuses the completing grant, " +
    "completesSeparationTriad() refuses it on the role-grant path used by the CLI and the " +
    "bootstrap allowlist, and separationAlerts() is the second net.",
  truthNeverChangesWithVantage:
    "UX-02: the four apertures redact, they never re-state. Enforced by APERTURE_LAWS." +
    "lessNotDifferent and by aperture-lint check 2.",
} as const;

export const principalsIn = (tier: PrincipalTier): Principal[] =>
  PRINCIPALS.filter((p) => p.tier === tier);

export const principalById = (id: string): Principal | undefined =>
  PRINCIPALS.find((p) => p.id === id);

/* ── The layer checks itself at load, like every other registry here ── */
{
  const seen = new Set<string>();
  for (const p of PRINCIPALS) {
    if (seen.has(p.id)) throw new Error(`Duplicate principal id ${p.id}`);
    seen.add(p.id);

    if (p.profiles.length === 0) {
      throw new Error(
        `Principal ${p.id} names no digital profile. A principal nobody can be is a row in a ` +
          `spreadsheet, not a party to the system.`,
      );
    }
    if (!p.boundary) throw new Error(`Principal ${p.id} states no boundary.`);
    if (!p.sees) throw new Error(`Principal ${p.id} states nothing it sees.`);

    /* The external and AI tiers hold no role. That is the constitutional
       claim the whole tier rests on — capacity is never authority — so it
       is asserted rather than assumed. */
    if ((p.tier === "external" || p.tier === "ai") && p.role) {
      throw new Error(
        `Principal ${p.id} is ${p.tier} and names role "${p.role}". Neither tier may hold a role: ` +
          `an external specialist works through a scoped engagement, and an agent holds no ` +
          `authority by construction.`,
      );
    }
    if ((p.tier === "gc_governance" || p.tier === "vehicle") && !p.role) {
      throw new Error(`Principal ${p.id} is ${p.tier} and names no eligible role.`);
    }
  }

  if (PRINCIPALS.length !== 14) {
    throw new Error(
      `The v5 RBAC sheet declares 14 principals; this file has ${PRINCIPALS.length}. ` +
        `Adding a party to the system is a constitutional act, not a list edit.`,
    );
  }
}
