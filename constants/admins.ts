/**
 * THE THREE ADMINS
 *
 * ── WHY THREE ────────────────────────────────────────────────────────
 * There are eight constitutional roles, and there will go on being eight —
 * they mirror the governance bodies in EP-01 §3.5 and nothing here alters
 * them. But eight roles is a description of a mature institution, not an
 * operating surface for the people actually running this. Asking a founding
 * team to reason about which of eight committees they are acting as, on a
 * Tuesday, is how a governance model gets quietly bypassed.
 *
 * So the roles remain and the SURFACE collapses. Three admins, each a bundle
 * of roles, covering seven of the eight. `member` is deliberately outside:
 * it is the partner-facing role, not an administrative one.
 *
 * ── THE PROPERTY THAT MAKES THIS SAFE ────────────────────────────────
 * Verified in tests/admins.test.ts against SEPARATION_TRIADS rather than
 * asserted here:
 *
 *   Each admin alone          — lawful
 *   ANY TWO in one identity   — lawful
 *   All three in one identity — REFUSED
 *
 * That last line is GP-06 doing its job: Capital carries `capital.deploy`,
 * Office carries `distribution.execute`, Governance carries
 * `resolution.resolve`, and those three together are a separation triad.
 *
 * Read practically: one person may hold two of these. The third has to
 * belong to somebody else. That is the smallest honest separation of powers
 * a three-person operation can run, and it is not a rule invented for
 * convenience — it falls out of the constitution that was already there.
 *
 * ── WHAT AN ADMIN IS NOT ─────────────────────────────────────────────
 * It is not a new authority layer. Granting an admin mints the underlying
 * role grants, and every authorisation decision is still made by
 * `authorise()` against those roles. Delete this file and the platform's
 * access control is unchanged — only the vocabulary for talking about it
 * goes away.
 */

import type { Role } from "../lib/authority";

export type AdminId = "office" | "governance" | "capital";

export interface Admin {
  readonly id: AdminId;
  readonly label: string;
  /** The constitutional roles this admin mints. */
  readonly roles: readonly Role[];
  /** What this admin is for, in the words the holder would use. */
  readonly remit: string;
  /** The thing it can do that the other two cannot — the reason it is separate. */
  readonly keystone: string;
}

export const ADMINS: readonly Admin[] = [
  {
    id: "office",
    label: "Office",
    roles: ["executive_office"],
    remit:
      "Runs the vehicles day to day — opens and closes offerings, accepts commitments, calls capital, " +
      "moves properties through their lifecycle, registers media and publishes performance.",
    keystone: "distribution.execute — the only admin that can pay partners.",
  },
  {
    id: "governance",
    label: "Governance",
    roles: ["board", "governance_office", "governance_ethics_committee"],
    remit:
      "Confers and withdraws authority, forms and dissolves vehicles, tables and resolves resolutions, " +
      "approves policy, publishes the standing documents partners rely on, and declares constitutional failure.",
    keystone: "authority.grant — the only admin that can create other admins.",
  },
  {
    id: "capital",
    label: "Capital",
    roles: ["investment_committee", "audit_risk_committee", "compliance_office"],
    remit:
      "Decides what the vehicles buy and at what value — registers properties, completes acquisitions and " +
      "disposals, records valuations, versions the thesis, completes diligence, and holds accreditation and compliance.",
    keystone: "capital.deploy — the only admin that can commit a vehicle's money to a counterparty.",
  },
];

export const ADMIN_BY_ID: Record<AdminId, Admin> = Object.fromEntries(
  ADMINS.map((a) => [a.id, a]),
) as Record<AdminId, Admin>;

/** Every role an admin set mints, deduplicated. */
export const rolesForAdmins = (ids: readonly AdminId[]): Role[] => [
  ...new Set(ids.flatMap((id) => ADMIN_BY_ID[id]?.roles ?? [])),
];

/**
 * The role held by partners rather than operators.
 *
 * Named here so that "not an admin" is a stated fact with somewhere to
 * point, rather than an absence somebody has to notice.
 */
export const NON_ADMIN_ROLE: Role = "member";
