/**
 * DISTRIBUTION WATERFALL — the six-stage engine
 *
 * Wave 2 · packages/core/logic
 * Authority: L1-16 Part I · L1-01 §23
 * Serves: F-05 (Waterfall Determinism) · F-06 (Reserve Floor Enforced)
 *         F-15 (Revenue Base Determinism) · F-18 (Brand Participation Is Not Equity)
 *
 * ── THE SIX STAGES ───────────────────────────────────────────────────
 *   1 Operating Company        Operating Agreement
 *   2 Brand & Digital Company  Commercial Services Agreement
 *   3 Enterprise Admin Reserve 2.5% of Revenue Base   (constitutional)
 *   4 Property Sinking Fund    2.5% of Revenue Base   (constitutional)
 *   5 Debt Service             financing documents
 *   6 LLP Partner Distribution remainder
 *
 * There is no preferred return, no catch-up, and no carried interest tier.
 * Getaway Collective holds no equity in the vehicles it governs (L1-01 §27)
 * and therefore has no promote to earn.
 *
 * ── TWO THINGS THIS ENGINE REFUSES TO DO ─────────────────────────────
 * It will not run stage 6 while stage 5 is unpaid, and it will not run
 * stage 6 while the reserve would sit below its floor. Both are hard stops
 * rather than warnings, because a waterfall that can be persuaded to skip
 * a stage is a suggestion, not a waterfall.
 *
 * Stages 3 and 4 are percentages of the REVENUE BASE, not of whatever
 * survives stages 1 and 2. A generous operating share therefore cannot
 * quietly shrink the reserve contribution.
 */

import {
  Money,
  ZERO,
  add,
  sub,
  sum,
  draw,
  applyRate,
  format,
  lt,
} from "./money";

/** Constitutional reserve rates, in basis points. 2.5% each. */
export const ADMIN_RESERVE_BP = 250;
export const SINKING_FUND_BP = 250;

export enum Stage {
  OperatingCompany = 1,
  BrandDigital = 2,
  AdminReserve = 3,
  SinkingFund = 4,
  DebtService = 5,
  PartnerDistribution = 6,
}

export const STAGE_NAME: Record<Stage, string> = {
  [Stage.OperatingCompany]: "1_operating_company",
  [Stage.BrandDigital]: "2_brand_digital",
  [Stage.AdminReserve]: "3_admin_reserve",
  [Stage.SinkingFund]: "4_sinking_fund",
  [Stage.DebtService]: "5_debt_service",
  [Stage.PartnerDistribution]: "6_partner_distribution",
};

export interface WaterfallInput {
  /**
   * Gross operating receipts less ONLY: statutory taxes, booking platform
   * fees, channel commissions, settlement charges, refunds and chargebacks.
   * No fee payable to GC or an affiliated division is deductible here
   * (F-15) — doing so would rank GC's own compensation ahead of both
   * reserves, debt service and every partner distribution.
   */
  revenueBase: Money;
  /** Stage 1, per the Operating Agreement. */
  operatingCompanyShare: Money;
  /** Stage 2 rate in basis points, per the Commercial Services Agreement. */
  brandParticipationBp: number;
  /** Stage 5, scheduled principal + interest + financing obligations. */
  debtServiceDue: Money;
  /** Reserve balance before this run. */
  reserveBalanceBefore: Money;
  /** Reserve Floor per L1-16 §2.3. NOT NAV-linked. */
  reserveFloor: Money;
  /**
   * Whether an Ordinary Resolution has suspended distributions during an
   * existing breach (L1-16 §2.6a). Absent a resolution, an existing breach
   * does NOT by itself suspend anything.
   */
  distributionsSuspendedByResolution?: boolean;
}

export interface StageResult {
  stage: Stage;
  name: string;
  /** What this stage actually received. */
  amount: Money;
  /** What it was entitled to. Differs from `amount` on a shortfall. */
  entitlement: Money;
  shortfall: Money;
}

export type BlockReason =
  | "DEBT_SERVICE_UNPAID"
  | "RESERVE_BELOW_FLOOR"
  | "SUSPENDED_BY_RESOLUTION";

export interface WaterfallResult {
  stages: StageResult[];
  /** Amount available to LLP Partners at stage 6. Zero when blocked. */
  partnerDistribution: Money;
  /** Populated when stage 6 did not execute. Empty means it ran. */
  blockedBy: BlockReason[];
  reserveBalanceAfter: Money;
  /** True when the reserve sits below floor after this run. */
  reserveBreach: boolean;
  /** Unallocated remainder. Non-zero only when stage 6 is blocked. */
  retained: Money;
}

/**
 * Run the waterfall. Pure: no clock, no IO, no randomness.
 *
 * Deterministic by construction — the same inputs must produce a
 * byte-identical result on every run, or reconciliation cannot mean
 * anything.
 */
export function runWaterfall(input: WaterfallInput): WaterfallResult {
  const {
    revenueBase,
    operatingCompanyShare,
    brandParticipationBp,
    debtServiceDue,
    reserveBalanceBefore,
    reserveFloor,
    distributionsSuspendedByResolution = false,
  } = input;

  if (revenueBase < ZERO) {
    throw new RangeError("Revenue Base cannot be negative.");
  }

  let pool = revenueBase;
  const stages: StageResult[] = [];

  const consume = (stage: Stage, entitlement: Money): void => {
    const { taken, remaining } = draw(pool, entitlement);
    pool = remaining;
    stages.push({
      stage,
      name: STAGE_NAME[stage],
      amount: taken,
      entitlement,
      shortfall: sub(entitlement, taken),
    });
  };

  // Stage 1 — Operating Company
  consume(Stage.OperatingCompany, operatingCompanyShare);

  // Stage 2 — Brand & Digital. A share of the Revenue Base, never equity.
  consume(Stage.BrandDigital, applyRate(revenueBase, brandParticipationBp));

  // Stages 3 and 4 — constitutional reserves, both measured against the
  // Revenue Base rather than the surviving pool.
  consume(Stage.AdminReserve, applyRate(revenueBase, ADMIN_RESERVE_BP));
  consume(Stage.SinkingFund, applyRate(revenueBase, SINKING_FUND_BP));

  // Stage 5 — Debt service.
  consume(Stage.DebtService, debtServiceDue);

  const reserveContribution = add(
    stages[Stage.AdminReserve - 1].amount,
    stages[Stage.SinkingFund - 1].amount,
  );
  const reserveBalanceAfter = add(reserveBalanceBefore, reserveContribution);
  const reserveBreach = lt(reserveBalanceAfter, reserveFloor);

  // Stage 6 — Partner distributions, subject to three hard stops.
  const blockedBy: BlockReason[] = [];
  if (stages[Stage.DebtService - 1].shortfall > ZERO) blockedBy.push("DEBT_SERVICE_UNPAID");
  if (reserveBreach) blockedBy.push("RESERVE_BELOW_FLOOR");
  if (distributionsSuspendedByResolution) blockedBy.push("SUSPENDED_BY_RESOLUTION");

  const partnerDistribution = blockedBy.length === 0 ? pool : ZERO;
  stages.push({
    stage: Stage.PartnerDistribution,
    name: STAGE_NAME[Stage.PartnerDistribution],
    amount: partnerDistribution,
    entitlement: pool,
    shortfall: sub(pool, partnerDistribution),
  });

  return {
    stages,
    partnerDistribution,
    blockedBy,
    reserveBalanceAfter,
    reserveBreach,
    retained: blockedBy.length === 0 ? ZERO : pool,
  };
}

/**
 * Conservation check: every minor unit of the Revenue Base is either
 * allocated to a stage or explicitly retained. Nothing evaporates.
 *
 * This is the assertion that makes F-03 (Capital Is Accounted) checkable
 * rather than merely stated.
 */
export function conserves(input: WaterfallInput, result: WaterfallResult): boolean {
  const allocated = sum(result.stages.map((s) => s.amount));
  return add(allocated, result.retained) === input.revenueBase;
}

/** Human-readable trace. Used in Performance Reports and audit output. */
export function explain(result: WaterfallResult): string {
  const lines = result.stages.map((s) => {
    const short = s.shortfall > ZERO ? `   SHORTFALL ${format(s.shortfall)}` : "";
    return `  ${s.name.padEnd(24)} ${format(s.amount).padStart(18)}${short}`;
  });
  if (result.blockedBy.length) {
    lines.push(`  -- stage 6 blocked: ${result.blockedBy.join(", ")}`);
    lines.push(`  -- retained:        ${format(result.retained)}`);
  }
  return lines.join("\n");
}
