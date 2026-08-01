/**
 * DIGITAL PROFILES — web posture, never automatic authority
 *
 * A profile describes the work an identity may be invited to perform. It
 * does not itself grant a constitutional right. The Access Admin turns a
 * permitted request into a named, scoped, time-bound grant only after its
 * controls pass.
 */

import type { Access } from "./routes";
import type { RouteGroup } from "./layout";
import { ROLE_RIGHTS, type Right, type Role } from "../lib/authority";
import type { ConstitutionalFunction, Umbrella } from "./operating-model";

export type DigitalProfileId =
  | "public_visitor"
  | "identified_investor"
  | "accredited_investor"
  | "member"
  | "shared_chief_executive"
  | "vp_portfolio_platform"
  | "investor_relations"
  | "portfolio_controller"
  | "governance_administrator"
  | "compliance_reviewer"
  | "board_member"
  | "investment_committee_member"
  | "audit_risk_member"
  | "governance_ethics_member"
  | "financial_compliance_partner"
  | "legal_entity_advisory_partner"
  | "portfolio_technical_partner"
  | "banking_debt_insurance_partner"
  | "digital_platform_partner"
  | "brand_communications_partner"
  | "operating_partner"
  | "gc_01_platform_operations_agent"
  | "gc_02_investor_intelligence_agent";

export type ProfileKind = "investor" | "internal" | "partner" | "ai";
export type WorkspaceAccess = "none" | "read" | "contribute" | "review" | "decide";

export interface DigitalProfile {
  id: DigitalProfileId;
  name: string;
  kind: ProfileKind;
  baseAccess: Access;
  fn?: ConstitutionalFunction;
  umbrella?: Umbrella;
  /** Roles this profile may request for a named person. Never automatically granted. */
  requestableRoles: readonly Role[];
  /** Narrow exception path for a named external person; never a firm grant. */
  requestableRights?: readonly Right[];
  /** Declared web workspaces; route-level checks still require actual grants. */
  web: Readonly<Partial<Record<RouteGroup | "work_docket" | "ai_console", WorkspaceAccess>>>;
  boundary: string;
}

const noRights: readonly Right[] = [];

export const DIGITAL_PROFILES: readonly DigitalProfile[] = [
  {
    id: "public_visitor", name: "Public Visitor", kind: "investor", baseAccess: "public",
    requestableRoles: [], web: { gateway: "read", space: "read" },
    boundary: "May read public material only. It carries no identity, accreditation, membership, or authority.",
  },
  {
    id: "identified_investor", name: "Identified Investor", kind: "investor", baseAccess: "identified",
    requestableRoles: [], web: { gateway: "read", capital: "read" },
    boundary: "May progress through identity and document-collection steps; cannot self-accredit or accept a commitment.",
  },
  {
    id: "accredited_investor", name: "Accredited Investor", kind: "investor", baseAccess: "accredited",
    requestableRoles: [], web: { gateway: "read", capital: "contribute" },
    boundary: "May reach the commitment path; settlement, membership, and binding acceptance remain separate acts.",
  },
  {
    id: "member", name: "Member", kind: "investor", baseAccess: "member",
    requestableRoles: ["member"], web: { member: "contribute", capital: "read", time: "contribute" },
    boundary: "May see and act on their own settled position. A vote remains a named right and never becomes an office privilege.",
  },
  {
    id: "shared_chief_executive", name: "Shared Chief Executive", kind: "internal", baseAccess: "office",
    fn: "portfolio_office", requestableRoles: ["executive_office"], web: { admin: "review", capital: "review", gateway: "review" },
    boundary: "Enterprise direction does not replace Board, committee, or resolution authority.",
  },
  {
    id: "vp_portfolio_platform", name: "VP — Portfolio & Platform", kind: "internal", baseAccess: "office",
    fn: "portfolio_office", requestableRoles: ["executive_office"], web: { admin: "review", capital: "review", time: "review" },
    boundary: "Integrates work and accepts operating evidence; does not combine investment approval, financial execution, and governance review.",
  },
  {
    id: "investor_relations", name: "Investor Relations", kind: "internal", baseAccess: "office",
    fn: "investor_office", requestableRoles: ["compliance_office"], web: { gateway: "contribute", capital: "contribute", member: "read", work_docket: "contribute" },
    boundary: "Supports qualification and continuity. Accreditation and commitment acceptance require a distinct named grant and the applicable controls.",
  },
  {
    id: "portfolio_controller", name: "Portfolio Controller", kind: "internal", baseAccess: "office",
    fn: "portfolio_office", requestableRoles: ["executive_office", "investment_committee"], web: { admin: "review", capital: "review", time: "review", work_docket: "review" },
    boundary: "Coordinates LLP control and evidence; investment and financial powers remain separately granted and checked.",
  },
  {
    id: "governance_administrator", name: "Governance Administrator", kind: "internal", baseAccess: "office",
    fn: "governance_office", requestableRoles: ["governance_office"], web: { admin: "contribute", work_docket: "review" },
    boundary: "Maintains registers and authority records; does not resolve a resolution or approve policy without the required constitutional act.",
  },
  {
    id: "compliance_reviewer", name: "Compliance Reviewer", kind: "internal", baseAccess: "office",
    fn: "governance_office", requestableRoles: ["compliance_office", "audit_risk_committee"], web: { admin: "review", capital: "review", work_docket: "review" },
    boundary: "Records and reviews compliance evidence; does not publish binding content or move capital.",
  },
  {
    id: "board_member", name: "Board Member", kind: "internal", baseAccess: "office",
    fn: "governance_office", requestableRoles: ["board"], web: { admin: "decide", capital: "review", work_docket: "review" },
    boundary: "Acts through recorded quorum and resolution, never through a blanket elevated account.",
  },
  {
    id: "investment_committee_member", name: "Investment Committee Member", kind: "internal", baseAccess: "office",
    fn: "portfolio_office", requestableRoles: ["investment_committee"], web: { admin: "review", capital: "decide", work_docket: "review" },
    boundary: "Evaluates investment matters; cannot also hold the financial-execution and governance-review sides of a separation triad.",
  },
  {
    id: "audit_risk_member", name: "Audit & Risk Committee Member", kind: "internal", baseAccess: "office",
    fn: "governance_office", requestableRoles: ["audit_risk_committee"], web: { admin: "review", capital: "review", work_docket: "review" },
    boundary: "Reviews risk and compliance evidence; it is not an operating execution profile.",
  },
  {
    id: "governance_ethics_member", name: "Governance & Ethics Committee Member", kind: "internal", baseAccess: "office",
    fn: "governance_office", requestableRoles: ["governance_ethics_committee"], web: { admin: "review", work_docket: "review" },
    boundary: "Tables governance and ethics matters; it does not act as a substitute for the Board.",
  },
  {
    id: "financial_compliance_partner", name: "Governance & Financial Compliance Partner", kind: "partner", baseAccess: "office",
    umbrella: "governance_financial_compliance", requestableRoles: [], requestableRights: ["compliance.record"],
    web: { work_docket: "contribute" },
    boundary: "Named personnel may submit statutory evidence and may request compliance recording only under a narrow, vehicle-scoped grant. The firm has no authority.",
  },
  {
    id: "legal_entity_advisory_partner", name: "Legal & Entity Advisory Partner", kind: "partner", baseAccess: "office",
    umbrella: "legal_entity_advisory", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Drafts and advises in the assigned docket; cannot publish binding material, grant authority, or resolve governance.",
  },
  {
    id: "portfolio_technical_partner", name: "Portfolio & Technical Advisory Partner", kind: "partner", baseAccess: "office",
    umbrella: "portfolio_technical_advisory", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Supplies diligence and valuation evidence; cannot accept acquisition, deploy capital, or change the asset lifecycle.",
  },
  {
    id: "banking_debt_insurance_partner", name: "Banking, Debt & Insurance Partner", kind: "partner", baseAccess: "office",
    umbrella: "banking_debt_insurance", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Coordinates quotations and documents; cannot sign, draw, distribute, or alter capital records.",
  },
  {
    id: "digital_platform_partner", name: "Digital Platform Partner", kind: "partner", baseAccess: "office",
    umbrella: "digital_platform", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Uses a separate operational-access layer for maintenance, security, and releases. It has no constitutional rights by profile.",
  },
  {
    id: "brand_communications_partner", name: "Brand & Communications Partner", kind: "partner", baseAccess: "office",
    umbrella: "brand_communications", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Creates approved materials only; binding publication remains with the constitutional process.",
  },
  {
    id: "operating_partner", name: "Operating Partner", kind: "partner", baseAccess: "office",
    umbrella: "operating_partner", requestableRoles: [], web: { work_docket: "contribute" },
    boundary: "Executes assigned property work only; cannot alter ownership, capital terms, or governance.",
  },
  {
    id: "gc_01_platform_operations_agent", name: "GC-01 · Platform Operations Agent", kind: "ai", baseAccess: "office",
    fn: "ai_operating_layer", requestableRoles: [], web: { ai_console: "contribute", work_docket: "contribute" },
    boundary: "May monitor, draft, route, and escalate. It holds no constitutional right and never approves or executes a fiduciary act.",
  },
  {
    id: "gc_02_investor_intelligence_agent", name: "GC-02 · Investor Intelligence Agent", kind: "ai", baseAccess: "identified",
    fn: "ai_operating_layer", requestableRoles: [], web: { ai_console: "contribute", gateway: "contribute" },
    boundary: "May explain, collect, and escalate with consented context. It cannot accredit, recommend, accept, bind, or decide.",
  },
] as const;

export function profileById(id: DigitalProfileId): DigitalProfile {
  const profile = DIGITAL_PROFILES.find((entry) => entry.id === id);
  if (!profile) throw new Error(`Unknown digital profile: ${id}`);
  return profile;
}

/** Rights that a profile may ask the Access Admin to assess; never held by default. */
export function requestableRights(profile: DigitalProfile): readonly Right[] {
  return [...new Set([
    ...profile.requestableRoles.flatMap((role) => ROLE_RIGHTS[role]),
    ...(profile.requestableRights ?? noRights),
  ])];
}

export function profileMayRequest(profile: DigitalProfile, right: Right): boolean {
  return requestableRights(profile).includes(right);
}

