/**
 * AUTHORITY — who may do what, and by what grant
 *
 * Wave 2 · L5 Capabilities
 * Serves: I-01 (Authentication Required) · I-02 (Authority Is Explicit)
 *         I-04 (Sessions Are Audited) · E-07 (Authority Flows Downward Only)
 *
 * ── THE RULE ─────────────────────────────────────────────────────────
 * I-02: no identity has implicit authority. Absence of an explicit grant is
 * a denial, not a question. This module is deliberately built so that the
 * only way to say yes is to find a grant — there is no default-allow branch
 * to forget to close.
 *
 * ── SCOPE ────────────────────────────────────────────────────────────
 * A grant applies either enterprise-wide or to one vehicle. Vehicle scope
 * exists because the platform runs many LLPs: a committee member of one
 * vehicle has no standing in another, and a model without scope would give
 * them standing in all of them.
 *
 * ── WHAT THIS MODULE WILL NOT DO ─────────────────────────────────────
 * It never widens a grant, never infers one from a role name, and never
 * treats "the actor created the record" as authority to act on it. Each of
 * those is a convenience that quietly becomes a privilege-escalation path.
 */

export type Right =
  // Enterprise
  | "organization.register"
  | "committee.constitute"
  | "authority.grant"
  | "authority.revoke"
  /* Publishing. Content and media change what the public is shown, which
     is an act of the Organization rather than of any vehicle. Both are
     enterprise-scoped and both require a reason: a document revised with
     no recorded reason cannot be explained to the person who relied on
     the version it replaced. */
  | "content.publish"
  | "media.manage"
  // Vehicles
  | "vehicle.form"
  | "vehicle.stabilise"
  | "vehicle.dissolve"
  | "portfolio.manage"
  // Assets
  | "property.register"
  | "property.advance_lifecycle"
  | "acquisition.complete"
  | "valuation.record"
  | "disposition.complete"
  // Capital
  | "offering.open"
  | "offering.close"
  | "commitment.accept"
  | "capital.call"
  | "capital.deploy"
  | "distribution.execute"
  | "ownership.transfer"
  // Identity & compliance
  | "accreditation.grant"
  | "compliance.record"
  | "constitutional_failure.declare"
  // Governance
  | "conflict.disclose"
  | "resolution.table"
  | "resolution.resolve"
  | "vote.cast"
  | "policy.approve"
  // Reporting
  | "report.publish"
  | "thesis.version"
  | "diligence.complete";

export const ALL_RIGHTS: readonly Right[] = [
  "organization.register", "committee.constitute", "authority.grant", "authority.revoke",
  "content.publish", "media.manage",
  "vehicle.form", "vehicle.stabilise", "vehicle.dissolve", "portfolio.manage",
  "property.register", "property.advance_lifecycle", "acquisition.complete",
  "valuation.record", "disposition.complete",
  "offering.open", "offering.close", "commitment.accept", "capital.call",
  "capital.deploy", "distribution.execute", "ownership.transfer",
  "accreditation.grant", "compliance.record", "constitutional_failure.declare",
  "conflict.disclose", "resolution.table", "resolution.resolve", "vote.cast", "policy.approve",
  "report.publish", "thesis.version", "diligence.complete",
] as const;

/**
 * Roles mirror the governance bodies in EP-01 §3.5, plus the two executive
 * offices and the member role.
 *
 * GP-06 (Separation of Powers) is enforced by what these bundles OMIT.
 * No role holds `capital.deploy` together with `distribution.execute` and
 * `resolution.resolve` — investment approval, financial execution, and
 * governance review never sit in one pair of hands.
 */
export type Role =
  | "board"
  | "investment_committee"
  | "audit_risk_committee"
  | "governance_ethics_committee"
  | "executive_office"
  | "governance_office"
  | "compliance_office"
  | "member";

export const ROLE_RIGHTS: Record<Role, readonly Right[]> = {
  board: [
    "organization.register", "committee.constitute", "authority.grant", "authority.revoke",
    "vehicle.form", "vehicle.dissolve", "policy.approve", "resolution.resolve",
    // L1-01 §27: secondary transfers occur only through approved governance
    // mechanisms. Ownership does not move on an operator's say-so.
    "ownership.transfer",
    "conflict.disclose",
  ],
  investment_committee: [
    "property.register", "acquisition.complete", "disposition.complete",
    "valuation.record", "capital.deploy", "thesis.version", "diligence.complete",
    "portfolio.manage",
   "conflict.disclose",
  ],
  audit_risk_committee: [
    "compliance.record", "report.publish", "valuation.record", "conflict.disclose",
  ],
  governance_ethics_committee: [
    "constitutional_failure.declare", "compliance.record", "resolution.table",
   "conflict.disclose",
  ],
  executive_office: [
    "vehicle.stabilise", "offering.open", "offering.close", "capital.call",
    "distribution.execute", "property.advance_lifecycle", "report.publish",
    // Capital formation sits with the Executive Office (EP-01 §2.5).
    "commitment.accept",
    /* Media, but NOT content. Registering an asset and stating its kind
       is operational. Putting a standing document in force is not, and
       it sits with the Governance Office below — a page that binds
       should not be publishable by whoever commissioned the photograph
       on it. */
    "media.manage",
    "conflict.disclose",
  ],
  /* content.publish sits here rather than with the Executive Office.
     The standing documents are the instruments a partner relies on, and
     the office that tables resolutions is the one accountable for what
     they say. */
  governance_office: [
    "resolution.table", "authority.grant", "authority.revoke",
    "content.publish", "conflict.disclose",
  ],
  compliance_office: ["accreditation.grant", "compliance.record", "conflict.disclose"],
  member: ["vote.cast", "conflict.disclose"],
};

export type Scope = { kind: "enterprise" } | { kind: "vehicle"; vehicleId: string };

export const ENTERPRISE: Scope = { kind: "enterprise" };
export const vehicleScope = (vehicleId: string): Scope => ({ kind: "vehicle", vehicleId });

export interface Grant {
  grantId: string;
  identityId: string;
  role: Role;
  scope: Scope;
  /** Who granted it. A grant with no grantor cannot be audited (E-02). */
  grantedBy: string;
  grantedAt: string;
  /** ISO-8601. Absent means open-ended. */
  expiresAt?: string;
  revokedAt?: string;
}

export interface AuthorityDecision {
  allowed: boolean;
  /** The grant relied upon. Present only when allowed. */
  viaGrant?: string;
  reason: string;
}

/**
 * A grant covers a scope if it is enterprise-wide, or vehicle-scoped to the
 * same vehicle.
 *
 * Note the direction: enterprise authority reaches into a vehicle, but
 * vehicle authority never reaches out to the enterprise. That is E-07
 * (authority flows downward only) expressed at the grant level.
 */
function covers(grant: Grant, required: Scope): boolean {
  if (grant.scope.kind === "enterprise") return true;
  if (required.kind === "vehicle") return grant.scope.vehicleId === required.vehicleId;
  return false;
}

function isLive(grant: Grant, atIso: string): boolean {
  if (grant.revokedAt && grant.revokedAt <= atIso) return false;
  if (grant.expiresAt && grant.expiresAt <= atIso) return false;
  return true;
}

/**
 * The single authorisation entry point.
 *
 * `authenticated` is a separate parameter rather than an assumption: I-01
 * and I-02 are different failures and deserve different messages. "You are
 * not signed in" and "you are signed in but may not do this" send an
 * operator to two different places.
 */
export function authorise(
  identityId: string | null,
  right: Right,
  scope: Scope,
  grants: readonly Grant[],
  atIso: string,
): AuthorityDecision {
  if (!identityId) {
    return { allowed: false, reason: "Unauthenticated. No action may be taken by an unidentified actor (I-01)." };
  }

  const live = grants.filter(
    (g) => g.identityId === identityId && isLive(g, atIso) && covers(g, scope),
  );

  for (const g of live) {
    if (ROLE_RIGHTS[g.role].includes(right)) {
      return {
        allowed: true,
        viaGrant: g.grantId,
        reason: `Granted by ${g.grantId}: role "${g.role}" carries "${right}".`,
      };
    }
  }

  const held = [...new Set(live.map((g) => g.role))];
  return {
    allowed: false,
    reason:
      held.length === 0
        ? `No live grant for ${identityId} in this scope. Absence of an explicit grant is a denial (I-02).`
        : `Roles held here (${held.join(", ")}) do not carry "${right}". Authority is never implied (I-02).`,
  };
}

/** Answers "who can do X here, and by what grant?" — the audit question. */
export function whoCan(
  right: Right,
  scope: Scope,
  grants: readonly Grant[],
  atIso: string,
): { identityId: string; role: Role; grantId: string }[] {
  return grants
    .filter((g) => isLive(g, atIso) && covers(g, scope) && ROLE_RIGHTS[g.role].includes(right))
    .map((g) => ({ identityId: g.identityId, role: g.role, grantId: g.grantId }));
}

/**
 * GP-06 — no single role may hold investment approval, financial execution,
 * and governance review at once. Checked as a property of the role table
 * rather than trusted, so a future edit that merges two roles fails loudly.
 */
export const SEPARATION_TRIADS: readonly [Right, Right, Right][] = [
  ["capital.deploy", "distribution.execute", "resolution.resolve"],
  ["acquisition.complete", "distribution.execute", "policy.approve"],
];

export function separationViolations(): { role: Role; triad: Right[] }[] {
  const out: { role: Role; triad: Right[] }[] = [];
  for (const [role, rights] of Object.entries(ROLE_RIGHTS) as [Role, readonly Right[]][]) {
    for (const triad of SEPARATION_TRIADS) {
      if (triad.every((r) => rights.includes(r))) out.push({ role, triad: [...triad] });
    }
  }
  return out;
}

// ─── Sessions (I-04) ─────────────────────────────────────────────────

export interface Session {
  sessionId: string;
  identityId: string;
  openedAt: string;
  closedAt?: string;
  /** Commands invoked during the session. Append-only. */
  actions: { command: string; at: string; allowed: boolean }[];
}

/**
 * I-04 — every authenticated session is logged with identity, timestamps and
 * actions taken, and the record is immutable once closed.
 *
 * Denied attempts are recorded too. A log of only successful actions cannot
 * answer "did someone repeatedly try to do something they could not?", which
 * is the question a security review actually asks.
 */
export class SessionAudit {
  private readonly sessions = new Map<string, Session>();

  open(sessionId: string, identityId: string, atIso: string): Session {
    if (this.sessions.has(sessionId)) throw new Error(`session ${sessionId} already exists`);
    const s: Session = { sessionId, identityId, openedAt: atIso, actions: [] };
    this.sessions.set(sessionId, s);
    return s;
  }

  record(sessionId: string, command: string, atIso: string, allowed: boolean): void {
    const s = this.sessions.get(sessionId);
    if (!s) throw new Error(`unknown session ${sessionId}`);
    if (s.closedAt) throw new Error(`session ${sessionId} is closed; its record is immutable (I-04)`);
    s.actions.push({ command, at: atIso, allowed });
  }

  close(sessionId: string, atIso: string): Session {
    const s = this.sessions.get(sessionId);
    if (!s) throw new Error(`unknown session ${sessionId}`);
    if (s.closedAt) throw new Error(`session ${sessionId} already closed`);
    s.closedAt = atIso;
    Object.freeze(s.actions);
    return s;
  }

  get(sessionId: string): Session | undefined {
    const s = this.sessions.get(sessionId);
    return s ? { ...s, actions: [...s.actions] } : undefined;
  }

  deniedAttempts(identityId: string): { command: string; at: string }[] {
    return [...this.sessions.values()]
      .filter((s) => s.identityId === identityId)
      .flatMap((s) => s.actions.filter((a) => !a.allowed).map((a) => ({ command: a.command, at: a.at })));
  }
}
