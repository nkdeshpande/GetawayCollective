/**
 * THE ENTERPRISE OPERATING MODEL — v2.0, as canon
 *
 * Ratified by direction 1 Aug 2026, from the Enterprise Operating Model
 * sheet. This file is the model AS DATA: the constitutional functions,
 * the partner-firm umbrellas, the six Access-Admin record types, and
 * the four workflow architectures — each with its boundary stated, and
 * load-time checks that refuse the configurations the model forbids.
 *
 * ── THE OPERATING RULE ───────────────────────────────────────────────
 * Getaway Collective is a constitutional capital, governance and
 * portfolio platform. It does not become an operating company for
 * hospitality, construction, engineering, technology, tax or marketing
 * work. Humans make fiduciary decisions; AI manages information;
 * partner firms execute.
 *
 * ── THE AUTHORITY RULE ───────────────────────────────────────────────
 * A title, an employer, or a partner engagement NEVER creates
 * authority. Authority is always a named, time-bound grant to an
 * identity, with enterprise or LLP scope, a recorded reason, a grantor
 * and a review date. The Access Admin refuses a grant to anything that
 * is not a person — lib/access-admin.ts enforces it.
 */

import { type Right, ALL_RIGHTS, type Role } from "../lib/authority";

/* ═══════════════════════════════════════════════════════════════════
   CONSTITUTIONAL FUNCTIONS — internal, four plus two executives
   ═══════════════════════════════════════════════════════════════════ */

export type ConstitutionalFunction =
  | "investor_office"
  | "portfolio_office"
  | "governance_office"
  | "ai_operating_layer";

export interface FunctionSpec {
  fn: ConstitutionalFunction;
  name: string;
  purpose: string;
  /** What this function owns end-to-end. */
  owns: readonly string[];
  /** The role in lib/authority.ts its human appointments draw rights from. */
  authorityHome: Role | null;
  /** True only of the AI layer: it escalates, it never decides. */
  neverDecides: boolean;
}

export const FUNCTIONS: readonly FunctionSpec[] = [
  {
    fn: "investor_office", name: "Investor Office",
    purpose: "Capital relations and investor continuity.",
    owns: ["enquiry", "qualification", "accreditation intake", "commitment path", "investor record"],
    authorityHome: "compliance_office", neverDecides: false,
  },
  {
    fn: "portfolio_office", name: "Portfolio Office",
    purpose: "LLP and portfolio control.",
    owns: ["vehicle lifecycle", "acquisition programme", "operating oversight", "valuation cadence"],
    authorityHome: "executive_office", neverDecides: false,
  },
  {
    fn: "governance_office", name: "Governance Office",
    purpose: "Constitutional integrity.",
    owns: ["policy and version register", "resolution register", "engagement register", "conflict register"],
    authorityHome: "governance_office", neverDecides: false,
  },
  {
    fn: "ai_operating_layer", name: "AI Operating Layer",
    purpose: "Information coordination: monitoring, drafting, routing, task assembly (GC-01 / GC-02).",
    owns: ["work-item detection", "task routing", "reminder cadence", "escalation assembly"],
    authorityHome: null, neverDecides: true,
  },
] as const;

export interface ExecutiveSpec {
  title: string;
  accountableFor: string;
  mayDecide: readonly string[];
  mustNotDecideAlone: readonly string[];
}

export const EXECUTIVES: readonly ExecutiveSpec[] = [
  {
    title: "Shared Chief Executive",
    accountableFor: "Enterprise direction",
    mayDecide: ["strategy", "executive appointments", "enterprise commitments within policy"],
    mustNotDecideAlone: ["constitutional amendment", "reserved matters", "any §24a threshold decision"],
  },
  {
    title: "VP — Portfolio & Platform",
    accountableFor: "Enterprise integration",
    mayDecide: ["portfolio cadence", "platform release acceptance", "workflow ownership"],
    mustNotDecideAlone: ["capital allocation", "partner-firm engagement approval", "authority grants"],
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════
   PARTNER-FIRM UMBRELLAS — capacity, never authority

   A firm may supply several disciplines under one engagement, but
   neither the firm nor a discipline label receives a constitutional
   grant. `mayHoldRights` is therefore EMPTY on every umbrella, and a
   load-time check keeps it that way — the model's central rule made
   unrepresentable rather than merely stated.
   ═══════════════════════════════════════════════════════════════════ */

export type Umbrella =
  | "governance_financial_compliance"
  | "legal_entity_advisory"
  | "portfolio_technical_advisory"
  | "banking_debt_insurance"
  | "digital_platform"
  | "brand_communications"
  | "operating_partner";

export interface UmbrellaSpec {
  umbrella: Umbrella;
  name: string;
  bundles: readonly string[];
  /** What the firm can DO. */
  executes: string;
  /** What the firm can NEVER do, stated at the definition. */
  boundary: string;
  /** Constitutional rights an umbrella may hold: none, ever. */
  mayHoldRights: readonly Right[];
  /** Which internal function accepts its evidence. */
  reviewedBy: ConstitutionalFunction;
}

export const UMBRELLAS: readonly UmbrellaSpec[] = [
  {
    umbrella: "governance_financial_compliance",
    name: "Governance & Financial Compliance Partner",
    bundles: ["chartered accountancy", "tax", "company-secretarial", "audit coordination"],
    executes: "Statutory filings, accounts preparation, TDS/GST workpapers, audit support.",
    boundary: "Prepares and files; never approves a policy, accepts a commitment, or moves funds.",
    mayHoldRights: [], reviewedBy: "governance_office",
  },
  {
    umbrella: "legal_entity_advisory",
    name: "Legal & Entity Advisory Partner",
    bundles: ["legal counsel", "LLP formation support", "contract drafting"],
    executes: "Drafts instruments, verifies entity facts, advises on structure.",
    boundary: "Advises and drafts; putting a document in force is a constitutional act it cannot perform.",
    mayHoldRights: [], reviewedBy: "governance_office",
  },
  {
    umbrella: "portfolio_technical_advisory",
    name: "Portfolio & Technical Advisory Partner",
    bundles: ["valuation", "technical diligence", "project monitoring"],
    executes: "Produces valuations, diligence reports and programme monitoring evidence.",
    boundary: "Its valuation is a SOURCE the record names — recording it is the Portfolio Office's act.",
    mayHoldRights: [], reviewedBy: "portfolio_office",
  },
  {
    umbrella: "banking_debt_insurance",
    name: "Banking, Debt & Insurance Partner",
    bundles: ["debt advisory", "banking coordination", "insurance placement"],
    executes: "Negotiates facilities, places cover, coordinates bank operations.",
    boundary: "Arranges; never signs. Signing authority is a named grant to a person, per mandate.",
    mayHoldRights: [], reviewedBy: "portfolio_office",
  },
  {
    umbrella: "digital_platform",
    name: "Digital Platform Partner",
    bundles: ["web maintenance", "engineering", "security monitoring", "release operations"],
    executes: "Fixes, builds and operates the platform under a scoped operational-access layer.",
    boundary:
      "May fix the platform; cannot see or change capital, ownership, accreditation, legal " +
      "acknowledgement or resolution records without a separate, narrow, auditable approval.",
    mayHoldRights: [], reviewedBy: "portfolio_office",
  },
  {
    umbrella: "brand_communications",
    name: "Brand & Communications Partner",
    bundles: ["public copy production", "photography", "design production", "press coordination"],
    executes: "Creates materials in the asset and content workspaces.",
    boundary: "Creates; cannot put legal or binding content in force. Publication stays with the Governance Office.",
    mayHoldRights: [], reviewedBy: "governance_office",
  },
  {
    umbrella: "operating_partner",
    name: "Operating Partner",
    bundles: ["property operations under approved agreement"],
    executes: "Executes the contracted operating plan, LLP-scoped work queue and documents only.",
    boundary: "Cannot alter ownership, capital terms, or governance. Its vocabulary never crosses into ours (§25).",
    mayHoldRights: [], reviewedBy: "portfolio_office",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════
   THE SIX ACCESS-ADMIN RECORDS

   The Access Admin manages six distinct record types and never grants
   a constitutional right to a company record. Types are declared here;
   the lifecycle that enforces them is lib/access-admin.ts.
   ═══════════════════════════════════════════════════════════════════ */

export type Scope = { kind: "enterprise" } | { kind: "vehicle"; llpin: string };

export interface PartnerFirm {
  firmId: string;
  name: string;
  umbrella: Umbrella;
  status: "candidate" | "engaged" | "suspended" | "exited";
  conflicts: readonly string[];
  insuranceValidTo?: string;
}

export interface NamedIdentity {
  identityId: string;
  name: string;
  /** A person belongs to a firm OR an internal function, never neither. */
  firmId?: string;
  fn?: ConstitutionalFunction;
  verified: boolean;
}

export interface Engagement {
  engagementId: string;
  firmId: string;
  scope: Scope;
  mandate: string;
  start: string;
  end: string;
  owner: ConstitutionalFunction;
  status: "proposed" | "active" | "expired" | "terminated";
}

export interface ConstitutionalAppointment {
  appointmentId: string;
  identityId: string;
  fn: ConstitutionalFunction;
  role: Role;
  start: string;
  reviewOn: string;
}

export interface AuthorityGrant {
  grantId: string;
  identityId: string;
  right: Right;
  scope: Scope;
  grantor: string;
  reason: string;
  effective: string;
  expiry: string;
  revoked?: { on: string; by: string; reason: string };
}

export interface WorkflowAssignment {
  workId: string;
  item: string;
  accountable: ConstitutionalFunction;
  executingFirmId?: string;
  assigneeId: string;
  reviewerId: string;
  decisionOwnerId: string;
  deadline: string;
  state: "detected" | "owned" | "executing" | "evidence" | "review" | "decided" | "closed";
  evidence: readonly string[];
}

/* ═══════════════════════════════════════════════════════════════════
   THE FOUR WORKFLOWS — stated as sequences with named control points
   ═══════════════════════════════════════════════════════════════════ */

export interface Workflow {
  id: string;
  name: string;
  sequence: readonly string[];
  controls: readonly { point: string; owner: ConstitutionalFunction | "access_admin" | "grantor" }[];
}

export const WORKFLOWS: readonly Workflow[] = [
  {
    id: "WF-1", name: "Partner onboarding and renewal",
    sequence: [
      "candidate firm", "diligence", "conflict disclosure", "engagement approval",
      "named personnel", "identity verification", "scoped access request",
      "separation check", "grant", "periodic review", "renewal or revocation",
    ],
    controls: [
      { point: "Engagement register", owner: "governance_office" },
      { point: "Need confirmed by requesting function", owner: "portfolio_office" },
      { point: "Reason recorded with the grant (E-02)", owner: "grantor" },
      { point: "Missing LLP scope, missing expiry, or failed separation check → rejected", owner: "access_admin" },
    ],
  },
  {
    id: "WF-2", name: "LLP work docket",
    sequence: [
      "GC-01 detects or receives a work item", "constitutional function owns it",
      "executing partner firm receives the task", "named assignee submits evidence",
      "constitutional reviewer validates", "decision owner approves or escalates",
      "immutable record closes",
    ],
    controls: [
      { point: "Every task has a named assignee AND a distinct reviewer", owner: "access_admin" },
      { point: "No partner identity receives capital or governance authority", owner: "access_admin" },
      { point: "Release acceptance is internal, never the partner's own", owner: "portfolio_office" },
    ],
  },
  {
    id: "WF-3", name: "Authority lifecycle",
    sequence: [
      "request", "verify engagement or appointment", "define right + scope + expiry",
      "conflict and separation check", "grantor approval", "session logging",
      "30-day expiry review", "renew, reduce, or revoke",
    ],
    controls: [
      { point: "Grants only to verified named identities", owner: "access_admin" },
      { point: "Every grant expires; review at 30 days", owner: "governance_office" },
      { point: "No identity accumulates a separation triad", owner: "access_admin" },
    ],
  },
  {
    id: "WF-4", name: "AI escalation",
    sequence: [
      "GC-01/GC-02 drafts, classifies, monitors, routes, reminds, assembles",
      "matter crosses a fiduciary boundary", "escalation created — never an approval",
      "human decision owner decides by deadline", "outcome written back to the record",
    ],
    controls: [
      { point: "Escalation carries sources, factual summary, proposed steps, owner, deadline", owner: "ai_operating_layer" },
      { point: "The decision is human, always", owner: "governance_office" },
    ],
  },
] as const;

/** Matters the AI layer must escalate and can never approve. */
export const AI_ESCALATION_MATTERS: readonly string[] = [
  "investment or capital allocation",
  "investor accreditation, commitment acceptance, or binding agreement",
  "any legal, statutory, or regulator-facing matter",
  "authority grant or revocation, policy, resolution, conflict, or exception",
  "any payment or transfer above the approved threshold",
] as const;

/* ── Load-time checks — the model refuses its own violations ──────── */
{
  // 1 · No umbrella holds a constitutional right. The central rule.
  for (const u of UMBRELLAS) {
    if (u.mayHoldRights.length !== 0) {
      throw new Error(`${u.name} holds rights [${u.mayHoldRights.join(", ")}] — a firm is capacity, never authority.`);
    }
    if (!u.boundary || u.boundary.length < 20) {
      throw new Error(`${u.name} has no stated boundary.`);
    }
  }

  // 2 · Exactly one function never decides, and it is the AI layer.
  const nd = FUNCTIONS.filter((f) => f.neverDecides);
  if (nd.length !== 1 || nd[0].fn !== "ai_operating_layer") {
    throw new Error("Exactly one function never decides, and it is the AI Operating Layer.");
  }
  if (nd[0].authorityHome !== null) {
    throw new Error("The AI layer has no authority home — it holds no rights.");
  }

  // 3 · Every executive names what they must NOT decide alone.
  for (const e of EXECUTIVES) {
    if (e.mustNotDecideAlone.length === 0) {
      throw new Error(`${e.title} lists nothing it must not decide alone — that is a super-admin.`);
    }
  }

  // 4 · Every workflow has an access-admin or governance control point.
  for (const w of WORKFLOWS) {
    if (!w.controls.some((c) => c.owner === "access_admin" || c.owner === "governance_office" || c.owner === "ai_operating_layer")) {
      throw new Error(`${w.id} has no enforcing control point.`);
    }
  }

  // 5 · The rights referenced anywhere resolve against the authority canon.
  void ALL_RIGHTS;
}
