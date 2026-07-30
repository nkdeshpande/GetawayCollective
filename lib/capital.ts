/**
 * CAPITAL — ownership conservation, state accounting, pro-rata distribution
 *
 * Wave 2 · packages/core/logic
 * Authority: L1-01 §23, §24a, §27
 * Serves: F-02 (Ownership Conservation) · F-03 (Capital Is Accounted)
 *         F-12 (Transfer Is Additive) · I-08 (Single Actor)
 */

import { Money, ZERO, sum, allocate, format } from "./money";

/**
 * F-03 — every unit of capital sits in exactly one of five states at all
 * times. There is no sixth state and no "in transit": a value that is
 * temporarily nowhere is a value nobody is accountable for.
 */
export enum CapitalState {
  Committed = "committed",
  Drawn = "drawn",
  Invested = "invested",
  Returned = "returned",
  Distributed = "distributed",
}

export const CAPITAL_STATES = Object.values(CapitalState);

/**
 * Legal transitions. Capital moves forward through deployment and back out
 * through return or distribution; it never reverts to Committed, because
 * the commitment was already consumed when it was drawn.
 */
const LEGAL_TRANSITIONS: Record<CapitalState, CapitalState[]> = {
  [CapitalState.Committed]: [CapitalState.Drawn],
  [CapitalState.Drawn]: [CapitalState.Invested, CapitalState.Returned],
  [CapitalState.Invested]: [CapitalState.Returned, CapitalState.Distributed],
  [CapitalState.Returned]: [],
  [CapitalState.Distributed]: [],
};

export function mayTransition(from: CapitalState, to: CapitalState): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

export type CapitalLedger = Record<CapitalState, Money>;

export const emptyLedger = (): CapitalLedger => ({
  [CapitalState.Committed]: ZERO,
  [CapitalState.Drawn]: ZERO,
  [CapitalState.Invested]: ZERO,
  [CapitalState.Returned]: ZERO,
  [CapitalState.Distributed]: ZERO,
});

/**
 * F-03 — the sum across states must equal total committed. Failure means
 * capital has leaked, and the answer to "where is every rupee?" has
 * stopped existing.
 */
export function capitalIsAccounted(ledger: CapitalLedger, totalCommitted: Money): boolean {
  return sum(CAPITAL_STATES.map((s) => ledger[s])) === totalCommitted;
}

export function accountingError(ledger: CapitalLedger, totalCommitted: Money): string | null {
  const total = sum(CAPITAL_STATES.map((s) => ledger[s]));
  if (total === totalCommitted) return null;
  return (
    `F-03 violated: states sum to ${format(total)} against ${format(totalCommitted)} committed ` +
    `(difference ${format(total - totalCommitted)}). Capital has leaked.`
  );
}

// ─── Ownership ───────────────────────────────────────────────────────

export interface Position {
  investorId: string;
  /** Units held. Integer — units are not divisible below one. */
  units: bigint;
  ownershipClass: string;
}

/**
 * F-02 — units held must sum to units issued, exactly. Units are neither
 * created nor destroyed outside issuance events.
 */
export function ownershipConserved(positions: Position[], totalUnitsIssued: bigint): boolean {
  return positions.reduce((a, p) => a + p.units, 0n) === totalUnitsIssued;
}

export function conservationError(positions: Position[], totalUnitsIssued: bigint): string | null {
  const held = positions.reduce((a, p) => a + p.units, 0n);
  if (held === totalUnitsIssued) return null;
  return (
    `F-02 violated: ${held} units held against ${totalUnitsIssued} issued ` +
    `(difference ${held - totalUnitsIssued}).`
  );
}

/**
 * Voting rights in basis points. EQUITY-WEIGHTED, never per-capita
 * (L1-01 §24a). A holder of 7% casts 7% of the vote.
 */
export function votingRightsBp(position: Position, totalUnitsIssued: bigint): number {
  if (totalUnitsIssued === 0n) return 0;
  return Number((position.units * 10_000n) / totalUnitsIssued);
}

/** Constitutional concentration ceiling: 10% (L1-01 §27). */
export const CONCENTRATION_CEILING_BP = 1_000;

export function concentrationBreaches(
  positions: Position[],
  totalUnitsIssued: bigint,
): { investorId: string; bp: number }[] {
  return positions
    .map((p) => ({ investorId: p.investorId, bp: votingRightsBp(p, totalUnitsIssued) }))
    .filter((x) => x.bp > CONCENTRATION_CEILING_BP);
}

// ─── Distribution ────────────────────────────────────────────────────

export interface Allocation {
  investorId: string;
  amount: Money;
}

/**
 * Split a partner distribution pro-rata by units held.
 *
 * Uses largest-remainder allocation, so the parts sum to the input EXACTLY.
 * Naive pro-rata (amount * units / total, floored per holder) loses the
 * remainder — ₹100 across three equal holders pays out ₹99.9999 and the
 * missing unit is unaccounted. Over a quarterly distribution across a full
 * capital table that is how F-02 and F-03 begin failing by pennies.
 *
 * Deterministic: ties break toward the earlier position, so two runs over
 * the same table produce identical output. Reconciliation depends on it.
 */
export function distributePro(amount: Money, positions: Position[]): Allocation[] {
  if (positions.length === 0) return [];
  const parts = allocate(amount, positions.map((p) => p.units));
  return positions.map((p, i) => ({ investorId: p.investorId, amount: parts[i] }));
}

/** The property that makes the above provable rather than plausible. */
export function distributionConserves(amount: Money, allocations: Allocation[]): boolean {
  return sum(allocations.map((a) => a.amount)) === amount;
}

// ─── The Member Law ──────────────────────────────────────────────────

export enum MemberState {
  Investor = "investor",
  Member = "member",
}

/**
 * I-08 — one identity, two states. The transition is a state change on an
 * existing record, never a second record. Triggered only by the first
 * capital commitment settling. Irreversible.
 *
 * Membership records history, not balance: holdings falling to zero does
 * NOT revert the state. Someone who was once inside the vehicle remains a
 * Member, because the governance record of what they voted on does not
 * disappear when they exit.
 */
export function nextMemberState(
  current: MemberState,
  firstCommitmentSettled: boolean,
): MemberState {
  if (current === MemberState.Member) return MemberState.Member;
  return firstCommitmentSettled ? MemberState.Member : MemberState.Investor;
}

/**
 * Voting and distribution rights attach to OWNERSHIP, not to accreditation
 * (L1-01 §24b). An expired accreditation blocks new commitments; it never
 * silences an existing holder.
 *
 * The intuitive implementation checks accreditation on every endpoint and
 * quietly disenfranchises expired members. It is wrong.
 */
export function mayVote(position: Position, _accreditationExpired: boolean): boolean {
  return position.units > 0n;
}

export function mayReceiveDistribution(position: Position, _accreditationExpired: boolean): boolean {
  return position.units > 0n;
}

/** Accreditation gates the ACCEPTANCE of a new commitment, and only that. */
export function mayAcceptCommitment(accreditationValid: boolean): boolean {
  return accreditationValid;
}
