/**
 * GETAWAY COLLECTIVE — GOVERNANCE VOTING THRESHOLDS
 *
 * Single source of truth. Ratified 30 Jul 2026.
 * Authority: L1-01 §24a (thresholds) · §32b (entrenched principles)
 *            L1-13 EP-01 §3.8 Voting Framework
 *
 * These are the ONLY voting thresholds in the system.
 * Adding a threshold here requires a Constitutional Amendment (Special Resolution, ≥76%)
 * — except for ENTRENCHED matters, which require unanimity (§32b).
 */

/** Ordinary Resolution: strictly greater than 50% of voting rights PRESENT. */
export const ORDINARY_THRESHOLD = 0.5 as const;

/** Special Resolution: at least 76% of TOTAL voting rights. */
export const SPECIAL_THRESHOLD = 0.76 as const;

/** Quorum: at least 60% of TOTAL voting rights, present in person or by valid proxy. */
export const QUORUM_THRESHOLD = 0.6 as const;

/**
 * Entrenched matters: 100% of ALL voting LLP Partners. Not "all present" — ALL.
 * A 76% majority is constitutionally insufficient to alter these.
 */
export const UNANIMOUS_THRESHOLD = 1.0 as const;

export enum ResolutionType {
  Ordinary = 'ORDINARY',
  Special = 'SPECIAL',
  Unanimous = 'UNANIMOUS',
}

/**
 * L1-01 §32b — The constitutional identity of Getaway Collective.
 * Amending any of these requires unanimity PLUS written confirmation that the
 * amendment does not diminish existing investor rights.
 */
export const ENTRENCHED_PRINCIPLES = [
  'FIDUCIARY_PRIMACY',
  'INVESTOR_OWNERSHIP_RIGHTS',
  'SEPARATION_OF_OWNERSHIP_GOVERNANCE_SERVICE',
  'RELATED_PARTY_TRANSPARENCY',
  'PARTNER_EQUALITY_WITHIN_CLASS',
] as const;

export type EntrenchedPrinciple = (typeof ENTRENCHED_PRINCIPLES)[number];

/**
 * Matters requiring a Special Resolution (≥76%).
 * Anything not listed here is an Ordinary Resolution.
 */
export const SPECIAL_RESOLUTION_MATTERS = [
  'CONSTITUTIONAL_AMENDMENT',
  'MATERIAL_ASSET_ACQUISITION',
  'MATERIAL_ASSET_DISPOSAL',
  'ADMIT_PARTNER',
  'REMOVE_DESIGNATED_PARTNER',
  'OWNERSHIP_STRUCTURE_CHANGE',
  'BORROWING_BEYOND_LEVERAGE_LIMIT',
  'LLP_MERGER',
  'LLP_DISSOLUTION',
  'LLP_RESTRUCTURE',
  'MATERIAL_RELATED_PARTY_TRANSACTION',
  'MANAGEMENT_AGREEMENT_AMENDMENT',
  'OPERATING_AGREEMENT_AMENDMENT',
  'BRAND_PARTICIPATION_AGREEMENT_AMENDMENT',
] as const;

export type SpecialResolutionMatter = (typeof SPECIAL_RESOLUTION_MATTERS)[number];

/**
 * Named Ordinary Resolution matters (>50% of equity PRESENT).
 * Not exhaustive — anything absent from SPECIAL and ENTRENCHED is ordinary.
 * Listed where the classification is load-bearing enough to be explicit.
 */
export const SUSPEND_DISTRIBUTIONS = "SUSPEND_DISTRIBUTIONS" as const;

/**
 * Suspending distributions during a reserve breach (L1-16 §2.6a).
 *
 * Requires BOTH an active breach AND an Ordinary Resolution. A breach alone
 * does not suspend anything.
 *
 * Note what this does NOT govern: a distribution that would ITSELF take the
 * reserve below floor is rejected by F-06 and is not voteable. That check
 * lives in the distribution command, not here. Partners may vote on how to
 * respond to a breach; they may not vote to cause one.
 */
export function mayFreezeDistributions(
  reserveBreachActive: boolean,
  tally: VoteTally,
): boolean {
  if (!reserveBreachActive) return false;
  return resolveVote(SUSPEND_DISTRIBUTIONS, tally).approved;
}

export function resolutionTypeFor(matter: string): ResolutionType {
  if ((ENTRENCHED_PRINCIPLES as readonly string[]).includes(matter)) {
    return ResolutionType.Unanimous;
  }
  return (SPECIAL_RESOLUTION_MATTERS as readonly string[]).includes(matter)
    ? ResolutionType.Special
    : ResolutionType.Ordinary;
}

/**
 * A meeting is quorate only where partners representing ≥60% of TOTAL voting
 * rights are present in person or by valid proxy. Failure requires adjournment.
 */
export function isQuorate(presentRights: number, totalRights: number): boolean {
  if (totalRights <= 0) return false;
  return presentRights / totalRights >= QUORUM_THRESHOLD;
}

/**
 * VOTING RIGHTS ARE EQUITY-WEIGHTED (L1-01 §24a).
 *
 * Every figure below is a measure of EQUITY, not a headcount. A partner holding
 * 7% of the LLP casts 7% of its voting rights. There is no per-capita vote at
 * any threshold — do not implement one.
 *
 * Because no holder may exceed 10% of a property or of the aggregate portfolio
 * (§27), no single holder can command more than 10% of the vote.
 */
export interface VoteTally {
  /** Equity voting for. */
  for: number;
  /** Equity voting against. */
  against: number;
  /** Equity abstaining. */
  abstain: number;
  /** Equity present at the meeting, in person or by valid proxy. */
  present: number;
  /** Total equity in the LLP. */
  total: number;
}

export interface VoteOutcome {
  approved: boolean;
  resolutionType: ResolutionType;
  quorate: boolean;
  reason:
    | 'APPROVED'
    | 'REJECTED'
    | 'TIED_NOT_APPROVED'
    | 'INQUORATE'
    | 'ENTRENCHED_NOT_UNANIMOUS'
    | 'ENTRENCHED_RIGHTS_NOT_CONFIRMED';
}

export interface VoteContext {
  /**
   * Required for entrenched matters (§32b): written confirmation that the
   * amendment does not diminish existing investor rights. Unanimity alone is
   * not sufficient.
   */
  investorRightsUndiminishedConfirmed?: boolean;
}

/**
 * Resolve a vote.
 *
 * Ordinary:  > 50% of rights PRESENT.
 * Special:   >= 76% of TOTAL rights.
 * Unanimous: 100% of TOTAL rights, plus investor-rights confirmation (§32b).
 *
 * A tied resolution is deemed NOT APPROVED — the burden of approval rests with
 * the proposer. No casting vote exists for matters affecting investor rights,
 * capital allocation, or governance.
 */
export function resolveVote(
  matter: string,
  tally: VoteTally,
  context: VoteContext = {},
): VoteOutcome {
  const resolutionType = resolutionTypeFor(matter);
  const quorate = isQuorate(tally.present, tally.total);

  if (!quorate) {
    return { approved: false, resolutionType, quorate: false, reason: 'INQUORATE' };
  }

  if (resolutionType === ResolutionType.Unanimous) {
    // Unanimity is measured against TOTAL rights, not those present. An absent
    // partner is a missing consent, not an abstention.
    if (tally.total <= 0 || tally.for / tally.total < UNANIMOUS_THRESHOLD) {
      return { approved: false, resolutionType, quorate: true, reason: 'ENTRENCHED_NOT_UNANIMOUS' };
    }
    if (!context.investorRightsUndiminishedConfirmed) {
      return {
        approved: false,
        resolutionType,
        quorate: true,
        reason: 'ENTRENCHED_RIGHTS_NOT_CONFIRMED',
      };
    }
    return { approved: true, resolutionType, quorate: true, reason: 'APPROVED' };
  }

  if (tally.for === tally.against) {
    return { approved: false, resolutionType, quorate: true, reason: 'TIED_NOT_APPROVED' };
  }

  const approved =
    resolutionType === ResolutionType.Special
      ? tally.total > 0 && tally.for / tally.total >= SPECIAL_THRESHOLD
      : tally.present > 0 && tally.for / tally.present > ORDINARY_THRESHOLD;

  return {
    approved,
    resolutionType,
    quorate: true,
    reason: approved ? 'APPROVED' : 'REJECTED',
  };
}
