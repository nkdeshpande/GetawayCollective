/**
 * GOVERNANCE — ballots, outcomes, conflicts
 *
 * Wave 2 · L5 Capabilities
 * Serves: I-05 (Governance Voting Is Secret) · I-06 (Decisions Are Transparent)
 *         I-07 (Conflicts Are Disclosed) · F-09 (Governance Determinism)
 *
 * ── THE TENSION THIS MODULE HOLDS ────────────────────────────────────
 * I-05 says individual votes are secret. I-06 says decisions are transparent.
 * Both are true at once because they describe different objects: the BALLOT
 * is secret, the OUTCOME is public.
 *
 * A member may see that a resolution passed with 82% of equity, who tabled
 * it, what the options were, and why. They may not see how any named holder
 * voted. Secrecy protects the vote from social pressure; transparency
 * protects the decision from suspicion. Collapsing either into the other
 * loses something the other cannot supply.
 *
 * ── SEALED BALLOTS ───────────────────────────────────────────────────
 * Cast votes are held sealed and are never returned individually by any
 * method on this class. Only the tally leaves. In production the seal is a
 * per-election encryption key; here the boundary is enforced structurally so
 * that a later persistence layer inherits a shape it cannot casually widen.
 */

import { VoteTally, VoteOutcome, resolveVote, ResolutionType, resolutionTypeFor } from "../constants/voting";

export type Ballot = "for" | "against" | "abstain";

interface SealedVote {
  readonly voterId: string;
  readonly ballot: Ballot;
  /** Equity-weighted voting rights in basis points (L1-01 §24a). */
  readonly weightBp: number;
  readonly castAt: string;
}

export class GovernanceError extends Error {}

/** Conflict disclosed by a participant, per I-07 and EP-01 §4.8. */
export interface ConflictDisclosure {
  identityId: string;
  nature: string;
  disclosedAt: string;
  recused: boolean;
}

export interface ResolutionRecord {
  resolutionId: string;
  matter: string;
  resolutionType: ResolutionType;
  tabledBy: string;
  tabledAt: string;
  /** Options considered. Recorded so I-06 can answer "what else was on the table?" */
  optionsConsidered: string[];
  committeeId: string;
  vehicleId?: string;
}

/**
 * One election. Ballots go in; only aggregates come out.
 */
export class Ballot_Box {
  private readonly votes = new Map<string, SealedVote>();
  private readonly conflicts: ConflictDisclosure[] = [];
  private closed = false;

  constructor(
    readonly record: ResolutionRecord,
    /** Total equity in the vehicle, in basis points. Always 10000. */
    private readonly totalWeightBp: number = 10_000,
  ) {}

  /**
   * I-07 — disclosure happens BEFORE deliberation and voting, not after.
   * Disclosing once the result is known is not disclosure, it is commentary.
   */
  discloseConflict(d: ConflictDisclosure): void {
    if (this.closed) throw new GovernanceError("conflicts must be disclosed before the ballot closes (I-07)");
    if (this.votes.has(d.identityId)) {
      throw new GovernanceError(
        `${d.identityId} has already voted. Disclosure must precede deliberation and voting (EP-01 §4.8).`,
      );
    }
    this.conflicts.push({ ...d });
  }

  cast(voterId: string, ballot: Ballot, weightBp: number, castAt: string): void {
    if (this.closed) throw new GovernanceError("ballot is closed");
    if (this.votes.has(voterId)) {
      throw new GovernanceError(`${voterId} has already voted; a second ballot would double-count their equity`);
    }
    if (weightBp <= 0) {
      throw new GovernanceError(`${voterId} holds no equity. Voting is equity-weighted (L1-01 §24a).`);
    }
    const recused = this.conflicts.find((c) => c.identityId === voterId && c.recused);
    if (recused) {
      throw new GovernanceError(`${voterId} recused on a disclosed conflict and may not vote (I-07)`);
    }
    this.votes.set(voterId, { voterId, ballot, weightBp, castAt });
  }

  /** Who participated. Not how they voted — that never leaves this object. */
  participants(): string[] {
    return [...this.votes.keys()].sort();
  }

  disclosedConflicts(): readonly ConflictDisclosure[] {
    return this.conflicts.map((c) => ({ ...c }));
  }

  /** Aggregate only (I-05). */
  tally(): VoteTally {
    const w = (b: Ballot) =>
      [...this.votes.values()].filter((v) => v.ballot === b).reduce((a, v) => a + v.weightBp, 0);
    const present = [...this.votes.values()].reduce((a, v) => a + v.weightBp, 0);
    return {
      for: w("for"),
      against: w("against"),
      abstain: w("abstain"),
      present,
      total: this.totalWeightBp,
    };
  }

  close(): void {
    this.closed = true;
  }

  get isClosed(): boolean {
    return this.closed;
  }
}

/**
 * The transparent half (I-06). Everything here is publishable to members.
 *
 * Note what is present and what is not: counts, threshold, outcome,
 * reasoning, options, participants, disclosed conflicts — and no mapping
 * from any name to any ballot.
 */
export interface PublishedDecision {
  resolutionId: string;
  matter: string;
  resolutionType: ResolutionType;
  tabledBy: string;
  optionsConsidered: string[];
  /** Aggregate basis points. */
  equityFor: number;
  equityAgainst: number;
  equityAbstain: number;
  equityPresent: number;
  equityTotal: number;
  outcome: VoteOutcome["reason"];
  approved: boolean;
  quorate: boolean;
  participantCount: number;
  disclosedConflicts: { identityId: string; nature: string; recused: boolean }[];
  /** Mandatory. A decision published without reasoning fails E-02. */
  rationale: string;
}

/**
 * F-09 — the outcome is COMPUTED from the tally. There is no manual
 * interpretation step between a vote and its resolution state, which is
 * what stops "the Board considered the result to mean..." from ever
 * appearing in a governance record.
 */
export function publish(
  box: Ballot_Box,
  rationale: string,
  investorRightsUndiminishedConfirmed?: boolean,
): PublishedDecision {
  if (!rationale?.trim()) {
    throw new GovernanceError(
      "a published decision requires recorded reasoning (E-02, I-06); an outcome without a rationale cannot be reviewed",
    );
  }
  box.close();
  const tally = box.tally();
  const outcome = resolveVote(box.record.matter, tally, { investorRightsUndiminishedConfirmed });

  return {
    resolutionId: box.record.resolutionId,
    matter: box.record.matter,
    resolutionType: outcome.resolutionType,
    tabledBy: box.record.tabledBy,
    optionsConsidered: [...box.record.optionsConsidered],
    equityFor: tally.for,
    equityAgainst: tally.against,
    equityAbstain: tally.abstain,
    equityPresent: tally.present,
    equityTotal: tally.total,
    outcome: outcome.reason,
    approved: outcome.approved,
    quorate: outcome.quorate,
    participantCount: box.participants().length,
    disclosedConflicts: box.disclosedConflicts().map((c) => ({
      identityId: c.identityId,
      nature: c.nature,
      recused: c.recused,
    })),
    rationale,
  };
}

/**
 * I-07 gate for commands that are conflict-sensitive.
 *
 * Non-disclosure of a KNOWN conflict is the violation — not the conflict
 * itself. EP-01 §4.6: conflicts are inherent to an integrated enterprise
 * and are not prohibited; undisclosed or unmanaged conflicts are.
 */
export function conflictGate(
  actorId: string,
  actorHasKnownConflict: boolean,
  disclosures: readonly ConflictDisclosure[],
): { allowed: boolean; reason: string } {
  if (!actorHasKnownConflict) return { allowed: true, reason: "no known conflict" };
  const disclosed = disclosures.some((d) => d.identityId === actorId);
  return disclosed
    ? { allowed: true, reason: "conflict disclosed and recorded in the Conflict Register (I-07)" }
    : {
        allowed: false,
        reason:
          `${actorId} holds a known conflict that has not been disclosed. ` +
          `Conflicts are permitted; undisclosed conflicts are not (EP-01 §4.6, I-07).`,
      };
}

/** Convenience for callers classifying a matter before opening a ballot. */
export const classify = resolutionTypeFor;
