/**
 * ACCESS ADMIN — safe grant assessment for digital profiles
 *
 * This is deliberately an evaluator, not a grant writer. Persistence and
 * authentication arrive later; this layer makes the conditions for a valid
 * grant explicit now and rejects configurations that would be unsafe later.
 */

import { SEPARATION_TRIADS, type Right } from "./authority";
import {
  profileById, profileMayRequest, type DigitalProfileId,
} from "../constants/digital-profiles";
import type {
  AuthorityGrant, Engagement, NamedIdentity, PartnerFirm, Scope,
} from "../constants/operating-model";

export interface GrantAssessmentRequest {
  profileId: DigitalProfileId;
  identityId: string;
  right: Right;
  scope: Scope;
  grantor: string;
  reason: string;
  effective: string;
  expiry: string;
}

export type GrantAssessment =
  | { ok: true }
  | { ok: false; reason: "unknown-identity" | "unverified-identity" | "ai-cannot-hold-authority" | "profile-does-not-permit-right" | "missing-engagement" | "inactive-engagement" | "partner-must-be-vehicle-scoped" | "missing-grantor" | "missing-reason" | "invalid-expiry" | "separation-of-powers" };

function activeEngagement(identity: NamedIdentity, engagement: readonly Engagement[], at: string): Engagement | undefined {
  if (!identity.firmId) return undefined;
  return engagement.find((entry) =>
    entry.firmId === identity.firmId && entry.status === "active" && entry.start <= at && entry.end > at,
  );
}

function formsSeparationTriad(right: Right, identityId: string, grants: readonly AuthorityGrant[], at: string): boolean {
  const held = new Set(
    grants
      .filter((grant) => grant.identityId === identityId && grant.effective <= at && grant.expiry > at && !grant.revoked)
      .map((grant) => grant.right),
  );
  held.add(right);
  return SEPARATION_TRIADS.some((triad) => triad.every((candidate) => held.has(candidate)));
}

/**
 * Assess a proposed constitutional grant. A caller must persist a successful
 * request as an immutable grant record; this function has no side effects.
 */
export function assessGrant(
  request: GrantAssessmentRequest,
  identities: readonly NamedIdentity[],
  firms: readonly PartnerFirm[],
  engagements: readonly Engagement[],
  grants: readonly AuthorityGrant[],
): GrantAssessment {
  const profile = profileById(request.profileId);
  const identity = identities.find((entry) => entry.identityId === request.identityId);
  if (!identity) return { ok: false, reason: "unknown-identity" };
  if (!identity.verified) return { ok: false, reason: "unverified-identity" };
  if (profile.kind === "ai") return { ok: false, reason: "ai-cannot-hold-authority" };
  if (!profileMayRequest(profile, request.right)) return { ok: false, reason: "profile-does-not-permit-right" };
  if (!request.grantor) return { ok: false, reason: "missing-grantor" };
  if (!request.reason) return { ok: false, reason: "missing-reason" };
  if (request.expiry <= request.effective) return { ok: false, reason: "invalid-expiry" };

  if (profile.kind === "partner") {
    const firm = firms.find((entry) => entry.firmId === identity.firmId);
    if (!firm || firm.status !== "engaged") return { ok: false, reason: "inactive-engagement" };
    const engagement = activeEngagement(identity, engagements, request.effective);
    if (!engagement) return { ok: false, reason: "missing-engagement" };
    if (request.scope.kind !== "vehicle") return { ok: false, reason: "partner-must-be-vehicle-scoped" };
    if (engagement.scope.kind !== "vehicle" || engagement.scope.llpin !== request.scope.llpin) {
      return { ok: false, reason: "inactive-engagement" };
    }
  }

  if (formsSeparationTriad(request.right, request.identityId, grants, request.effective)) {
    return { ok: false, reason: "separation-of-powers" };
  }

  return { ok: true };
}

/** An identity must be reviewed before expiry; no external grant is standing by default. */
export function grantsExpiringWithin(
  grants: readonly AuthorityGrant[],
  at: string,
  days: number,
): AuthorityGrant[] {
  const until = new Date(at).getTime() + days * 24 * 60 * 60 * 1000;
  return grants.filter((grant) => !grant.revoked && grant.expiry > at && new Date(grant.expiry).getTime() <= until);
}



/* ===================================================================
   THE REGISTER LIFECYCLE — the second layer, beside assessGrant

   assessGrant() above answers "may this PROFILE even ask for this
   right?" — posture. The functions below answer "does this specific
   request survive the register?" — standing, scope, expiry, reason,
   separation — and they collect EVERY refusal rather than the first,
   because an operator fixing a grant one rejection at a time stops
   reading the reasons. Both layers run before a grant exists.
   =================================================================== */

import type { ConstitutionalAppointment, WorkflowAssignment } from "../constants/operating-model";

/**
 * Capital and governance rights are internal-only. A partner identity
 * can hold narrow operational rights under a scoped grant, but the
 * rights that move money, admit partners, or change the constitution
 * never leave the constitutional functions.
 */
export const INTERNAL_ONLY_RIGHTS: readonly Right[] = [
  "authority.grant", "authority.revoke", "committee.constitute", "organization.register",
  "vehicle.form", "vehicle.dissolve",
  "offering.open", "offering.close", "commitment.accept",
  "capital.call", "capital.deploy", "distribution.execute", "ownership.transfer",
  "accreditation.grant", "policy.approve", "resolution.table", "resolution.resolve",
  "constitutional_failure.declare",
] as const;

export interface Register {
  firms: readonly PartnerFirm[];
  identities: readonly NamedIdentity[];
  engagements: readonly Engagement[];
  appointments: readonly ConstitutionalAppointment[];
  grants: readonly AuthorityGrant[];
}

export const EMPTY_REGISTER: Register = {
  firms: [], identities: [], engagements: [], appointments: [], grants: [],
};

export interface GrantRequest {
  identityId: string;
  right: Right;
  scope: Scope;
  grantor: string;
  reason: string;
  effective: string;
  expiry: string;
}

export type GrantDecision =
  | { ok: true; grant: AuthorityGrant }
  | { ok: false; refusals: readonly string[] };

const activeGrants = (reg: Register, identityId: string, asOf: string): AuthorityGrant[] =>
  reg.grants.filter(
    (g) => g.identityId === identityId && !g.revoked && g.effective <= asOf && g.expiry > asOf,
  );

const scopesOverlap = (a: Scope, b: Scope): boolean =>
  a.kind === "enterprise" || b.kind === "enterprise" ||
  (a.kind === "vehicle" && b.kind === "vehicle" && a.llpin === b.llpin);

export function requestGrant(reg: Register, req: GrantRequest, asOf: string): GrantDecision {
  const refusals: string[] = [];

  const who = reg.identities.find((i) => i.identityId === req.identityId);
  if (!who) {
    refusals.push(
      reg.firms.some((f) => f.firmId === req.identityId)
        ? "The grantee is a FIRM record. Authority is granted to named identities, never to companies."
        : `No identity ${req.identityId} exists.`,
    );
  } else if (!who.verified) {
    refusals.push(`${who.name} is not identity-verified. Verification precedes any grant.`);
  }

  if (who) {
    if (who.firmId) {
      const firm = reg.firms.find((f) => f.firmId === who.firmId);
      if (!firm || firm.status !== "engaged") {
        refusals.push(`The firm behind ${who.name} is not in an engaged state.`);
      }
      const eng = reg.engagements.find(
        (e) => e.firmId === who.firmId && e.status === "active" &&
               e.start <= asOf && e.end >= asOf && scopesOverlap(e.scope, req.scope),
      );
      if (!eng) {
        refusals.push(
          `No active engagement covers this firm for this scope. ` +
          `An engagement per LLP scope is explicit, never assumed.`,
        );
      }
      if (INTERNAL_ONLY_RIGHTS.includes(req.right)) {
        refusals.push(
          `"${req.right}" is internal-only. No partner identity receives capital or ` +
          `governance authority — the firm is capacity, never authority.`,
        );
      }
    } else if (who.fn) {
      const app = reg.appointments.find((a) => a.identityId === who.identityId);
      if (!app) {
        refusals.push(`${who.name} holds no constitutional appointment. A function label is not standing.`);
      }
    } else {
      refusals.push(`${who.name} belongs to no firm and no function. Nobody stands nowhere.`);
    }
  }

  if (req.scope.kind === "vehicle" && !req.scope.llpin) {
    refusals.push("A vehicle scope must name its LLPIN. A scope of every vehicle is not a scope.");
  }

  if (!req.expiry) refusals.push("Every grant expires. A grant without an expiry is a super-admin on layaway.");
  else if (req.expiry <= asOf) refusals.push(`Expiry ${req.expiry} is not in the future.`);
  if (req.effective && req.expiry && req.effective >= req.expiry) {
    refusals.push("The grant expires before it takes effect.");
  }

  if (!req.reason || req.reason.trim().length < 8) {
    refusals.push("A reason is recorded with the grant (E-02) — and it has to say something.");
  }

  if (who) {
    const held = activeGrants(reg, who.identityId, asOf)
      .filter((g) => scopesOverlap(g.scope, req.scope))
      .map((g) => g.right);
    const would = new Set([...held, req.right]);
    for (const triad of SEPARATION_TRIADS) {
      if (triad.every((r) => would.has(r))) {
        refusals.push(
          `Granting "${req.right}" completes the separation triad [${triad.join(", ")}] on ` +
          `${who.name}. Investment approval, financial execution and governance review never ` +
          `sit in one pair of hands (GP-06).`,
        );
      }
    }
  }

  if (refusals.length) return { ok: false, refusals };

  return {
    ok: true,
    grant: {
      grantId: `AG-${reg.grants.length + 1}`.padStart(6, "0"),
      identityId: req.identityId, right: req.right, scope: req.scope,
      grantor: req.grantor, reason: req.reason.trim(),
      effective: req.effective || asOf, expiry: req.expiry,
    },
  };
}

/** Revocation never deletes. The grant keeps its history and gains an end. */
export function revokeGrant(
  g: AuthorityGrant, by: string, reason: string, on: string,
): AuthorityGrant {
  if (g.revoked) throw new Error(`${g.grantId} is already revoked.`);
  if (!reason || reason.trim().length < 8) {
    throw new Error("A revocation records its reason, exactly as the grant did.");
  }
  return { ...g, revoked: { on, by, reason: reason.trim() } };
}

/* -- The Access-Admin views (the WF-3 required views, as queries) --- */

export function expiring(reg: Register, asOf: string, withinDays = 30): AuthorityGrant[] {
  return grantsExpiringWithin(reg.grants, asOf, withinDays);
}

export function separationAlerts(reg: Register, asOf: string): { identityId: string; triad: Right[] }[] {
  const out: { identityId: string; triad: Right[] }[] = [];
  for (const who of reg.identities) {
    const held = new Set(activeGrants(reg, who.identityId, asOf).map((g) => g.right));
    for (const triad of SEPARATION_TRIADS) {
      if (triad.every((r) => held.has(r))) out.push({ identityId: who.identityId, triad: [...triad] });
    }
  }
  return out;
}

/** Rights nobody currently holds — work that cannot be performed. */
export function unassignedRights(reg: Register, all: readonly Right[], asOf: string): Right[] {
  const held = new Set(
    reg.grants.filter((g) => !g.revoked && g.expiry > asOf).map((g) => g.right),
  );
  return all.filter((r) => !held.has(r));
}

/* -- The work docket (WF-2), as a state machine --------------------- */

const NEXT: Record<WorkflowAssignment["state"], WorkflowAssignment["state"] | null> = {
  detected: "owned", owned: "executing", executing: "evidence",
  evidence: "review", review: "decided", decided: "closed", closed: null,
};

export function advanceWork(
  w: WorkflowAssignment, to: WorkflowAssignment["state"],
): WorkflowAssignment {
  if (NEXT[w.state] !== to) {
    throw new Error(`${w.workId}: ${w.state} -> ${to} is not the sequence. The docket has no shortcuts.`);
  }
  if (w.assigneeId === w.reviewerId) {
    throw new Error(`${w.workId}: assignee and reviewer are the same person. Evidence is never self-validated.`);
  }
  if (to === "review" && w.evidence.length === 0) {
    throw new Error(`${w.workId}: nothing reaches review without evidence.`);
  }
  return { ...w, state: to };
}
