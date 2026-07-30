/**
 * RESERVE FLOOR — bands, breach response, and the two distribution tests
 *
 * Wave 2 · packages/core/logic
 * Authority: L1-16 Part II · §2.6a
 * Serves: F-06 (Reserve Floor Enforced) · F-16 (Capital Call Purpose Gate)
 *         F-17 (Reserve Non-Pooling)
 *
 * ── THE FLOOR IS NOT NAV-LINKED ──────────────────────────────────────
 * NAV is a valuation metric; liquidity risk is a cash-flow problem. A
 * ₹50 Cr appreciating asset can still run out of cash if occupancy drops.
 * The floor is the greater of six months of NON-OPERATIONAL fixed
 * obligations, or the Board-approved minimum from the Annual Asset
 * Management Plan. The Operating Company's day-to-day expenses are funded
 * through the approved Operating Budget and are excluded here.
 *
 * ── THE TWO TESTS ARE DIFFERENT QUESTIONS ────────────────────────────
 * PROSPECTIVE — would this distribution take the reserve below floor?
 *   Rejected automatically. Not voteable. A floor that a single payment
 *   may cross at will is not a floor.
 *
 * EXISTING — the reserve is already below floor; do scheduled
 *   distributions continue? They do, unless suspended by Ordinary
 *   Resolution. That is a governance judgement, and the partners whose
 *   capital is at stake make it.
 *
 * The recorded tension (L1-16 §2.6a): partners voting on whether to pause
 * their own distributions are voting on their own cash. The prospective
 * test is what stops that incentive from draining the reserve outright.
 */

import { Money, ZERO, lt, gte, sub, max, applyRate, format } from "./money";

export enum ReserveBand {
  /** >= 120% of floor. */
  Healthy = "healthy",
  /** 110-119%. Management monitoring. */
  Advisory = "advisory",
  /** 100-109%. Executive review and corrective planning. */
  GovernanceAlert = "governance_alert",
  /** < 100%. Constitutional breach. */
  ConstitutionalBreach = "constitutional_breach",
}

export const BAND_THRESHOLD_BP: Record<Exclude<ReserveBand, ReserveBand.ConstitutionalBreach>, number> = {
  [ReserveBand.Healthy]: 12_000,
  [ReserveBand.Advisory]: 11_000,
  [ReserveBand.GovernanceAlert]: 10_000,
};

/**
 * Reserve Floor per L1-16 §2.3.
 *
 * `sixMonthNonOperationalObligations` covers governance, statutory,
 * insurance, financing and enterprise administration costs. It must NOT
 * include Operating Company day-to-day expenses — including them would
 * inflate the floor with costs that are already funded elsewhere, and
 * would make breaches routine rather than meaningful.
 */
export function reserveFloor(
  sixMonthNonOperationalObligations: Money,
  boardApprovedMinimum: Money,
): Money {
  return max(sixMonthNonOperationalObligations, boardApprovedMinimum);
}

export function band(balance: Money, floor: Money): ReserveBand {
  if (floor <= ZERO) return ReserveBand.Healthy;
  const healthy = applyRate(floor, BAND_THRESHOLD_BP[ReserveBand.Healthy]);
  const advisory = applyRate(floor, BAND_THRESHOLD_BP[ReserveBand.Advisory]);
  if (gte(balance, healthy)) return ReserveBand.Healthy;
  if (gte(balance, advisory)) return ReserveBand.Advisory;
  if (gte(balance, floor)) return ReserveBand.GovernanceAlert;
  return ReserveBand.ConstitutionalBreach;
}

export const isBreach = (balance: Money, floor: Money): boolean =>
  band(balance, floor) === ReserveBand.ConstitutionalBreach;

/**
 * THE PROSPECTIVE TEST — automatic, not voteable.
 *
 * Returns true when the distribution may proceed.
 */
export function mayDistribute(
  reserveBalanceAfterFunding: Money,
  floor: Money,
): { allowed: boolean; reason?: string } {
  if (lt(reserveBalanceAfterFunding, floor)) {
    return {
      allowed: false,
      reason:
        `Distribution rejected: reserve would sit at ${format(reserveBalanceAfterFunding)} ` +
        `against a floor of ${format(floor)}. The prospective test is not voteable (L1-16 §2.6a).`,
    };
  }
  return { allowed: true };
}

/**
 * Automatic response to a breach. Deliberately minimal.
 *
 * Note what is ABSENT: any capital call. Post-stabilisation, investor
 * capital is growth capital and may never fund an operating deficit,
 * routine maintenance, or reserve replenishment (F-16). A reserve
 * shortfall is solved by deferring spend, not by asking investors.
 */
export interface BreachResponse {
  broadcast: boolean;
  deferDiscretionaryExpenditure: boolean;
  /** Always false here. Suspension requires an Ordinary Resolution. */
  suspendDistributions: boolean;
  capitalCallPermitted: false;
  shortfall: Money;
}

export function breachResponse(balance: Money, floor: Money): BreachResponse | null {
  if (!isBreach(balance, floor)) return null;
  return {
    broadcast: true,
    deferDiscretionaryExpenditure: true,
    suspendDistributions: false,
    capitalCallPermitted: false,
    shortfall: sub(floor, balance),
  };
}

/**
 * F-16 — the closed purpose set IS the enforcement. There is deliberately
 * no value representing an operating deficit, routine maintenance, or
 * reserve replenishment, so a post-stabilisation call for those purposes
 * cannot be expressed, let alone approved.
 */
export const CAPITAL_CALL_PURPOSES = [
  "acquisition",
  "approved_expansion",
  "approved_redevelopment",
  "extraordinary_event",
  "llp_agreement_provision",
] as const;

export type CapitalCallPurpose = (typeof CAPITAL_CALL_PURPOSES)[number];

export function mayCallCapital(
  purpose: string,
  vehicleStabilised: boolean,
): { allowed: boolean; reason?: string } {
  if (!vehicleStabilised) return { allowed: true };
  if (!(CAPITAL_CALL_PURPOSES as readonly string[]).includes(purpose)) {
    return {
      allowed: false,
      reason:
        `"${purpose}" is not a permitted capital call purpose post-stabilisation. ` +
        `Investor capital is growth capital, never working capital (L1-16 §2.7, F-16).`,
    };
  }
  return { allowed: true };
}

/**
 * F-17 — reserves are held per vehicle and never pooled, absent Board
 * approval under an Enterprise Treasury Policy. Enterprise-level reserves
 * supplement an individual vehicle's obligation; they never replace it.
 */
export function mayTransferReserve(
  fromVehicleId: string,
  toVehicleId: string,
  boardApprovedUnderTreasuryPolicy: boolean,
): { allowed: boolean; reason?: string } {
  if (fromVehicleId === toVehicleId) return { allowed: true };
  if (!boardApprovedUnderTreasuryPolicy) {
    return {
      allowed: false,
      reason:
        `Reserve balances cannot move between vehicles without Board approval under an ` +
        `Enterprise Treasury Policy (F-17). Each vehicle carries its own floor.`,
    };
  }
  return { allowed: true };
}
