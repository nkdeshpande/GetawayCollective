/**
 * METRICS — IRR, MOIC, NAV, reserve coverage
 *
 * Wave 2 · L9 Analytics
 * Serves: F-14 (Metric Determinism) · F-13 (Valuation Is Independent)
 *         F-06 (Reserve Floor Enforced)
 *
 * ── F-14 ─────────────────────────────────────────────────────────────
 * "IRR and MOIC follow one formula, defined once, not configurable per
 * property or per manager."
 *
 * That invariant exists because the alternative is worse than inconsistency:
 * it is plausible inconsistency. Two vehicles reporting 14% IRR under
 * different conventions look comparable and are not, and nobody discovers
 * it until an investor compares them. The formula lives here, once.
 *
 * ── NO FLOATS ────────────────────────────────────────────────────────
 * IRR is a rate, so it is tempting to reach for `number`. This module does
 * not. Rates are integers in basis points and discounting runs in a scaled
 * bigint domain, because an IRR that differs in the last place between two
 * runs cannot be reconciled — and reconciliation is the only reason to
 * compute it.
 */

import { Money, ZERO, sum, format, isZero } from "./money";

/** Internal precision for discount factors: 12 decimal places. */
const PRECISION = 10n ** 12n;
const BP = 10_000n;

export interface CashFlow {
  /** Whole periods from the start. Period 0 is the first outflow. */
  period: number;
  /** Negative for capital deployed, positive for capital returned. */
  amount: Money;
}

/**
 * Present value of `amount` discounted `periods` at `rateBp`, in the scaled
 * integer domain. Never touches floating point.
 */
function discount(amount: Money, periods: number, rateBp: number): bigint {
  const denomBase = BP + BigInt(rateBp);
  if (denomBase <= 0n) throw new RangeError("discount rate below -100%");
  // factor = (BP / denomBase)^periods, held at PRECISION
  let factor = PRECISION;
  for (let i = 0; i < periods; i++) {
    factor = (factor * BP) / denomBase;
  }
  return (amount * factor) / PRECISION;
}

export function npv(flows: readonly CashFlow[], rateBp: number): Money {
  return flows.reduce((a, f) => a + discount(f.amount, f.period, rateBp), 0n);
}

export interface IrrResult {
  /** Basis points. 1450 = 14.50%. */
  bp: number | null;
  /** Why no rate was produced, when bp is null. */
  reason?: string;
}

const IRR_LOWER_BP = -9_900; // -99%
const IRR_UPPER_BP = 1_000_000; // 10,000%

/**
 * IRR by bisection over basis points.
 *
 * Bisection rather than Newton-Raphson deliberately: it cannot diverge, it
 * needs no derivative, and it converges to the same answer from the same
 * inputs every time. Newton is faster and occasionally shoots off into a
 * different root, which for a reported return figure is not a trade worth
 * making.
 *
 * Returns null rather than a number when the series has no sign change.
 * A cash-flow series that never goes positive has no internal rate of
 * return, and inventing one — 0, or -100% — would put a figure in a report
 * that means nothing.
 */
export function irr(flows: readonly CashFlow[]): IrrResult {
  if (flows.length === 0) return { bp: null, reason: "no cash flows" };
  const hasOutflow = flows.some((f) => f.amount < ZERO);
  const hasInflow = flows.some((f) => f.amount > ZERO);
  if (!hasOutflow || !hasInflow) {
    return {
      bp: null,
      reason: "series has no sign change; an internal rate of return is undefined for it",
    };
  }

  let lo = IRR_LOWER_BP;
  let hi = IRR_UPPER_BP;
  const nLo = npv(flows, lo);
  const nHi = npv(flows, hi);
  if ((nLo > ZERO) === (nHi > ZERO)) {
    return { bp: null, reason: "no rate within the searched range produces a zero NPV" };
  }

  // Converge to a single basis point. 27 halvings covers the full range.
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    const n = npv(flows, mid);
    if (isZero(n)) return { bp: mid };
    if ((n > ZERO) === (nLo > ZERO)) lo = mid;
    else hi = mid;
  }
  return { bp: lo };
}

/**
 * MOIC — total returned over total invested.
 *
 * Returned in basis points of a multiple: 25000 = 2.5x. Integer, for the
 * same reason IRR is.
 */
export function moic(invested: Money, returned: Money): number | null {
  if (invested <= ZERO) return null;
  return Number((returned * BP) / invested);
}

/**
 * NAV from dated valuations.
 *
 * F-13: regulatory filings use independent valuations only. This takes the
 * most recent INDEPENDENT valuation per property and sums them. A
 * management estimate is never silently substituted, because a NAV that
 * mixes sources is not a NAV, it is an opinion with a number on it.
 */
export interface DatedValuation {
  propertyId: string;
  valuedOn: string;
  value: Money;
  source: "independent" | "management";
}

export interface NavResult {
  nav: Money;
  /** Properties with no independent valuation. NAV excludes them. */
  missing: string[];
  asOf: string | null;
}

export function nav(valuations: readonly DatedValuation[], propertyIds: readonly string[]): NavResult {
  const latest = new Map<string, DatedValuation>();
  for (const v of valuations) {
    if (v.source !== "independent") continue;
    const cur = latest.get(v.propertyId);
    if (!cur || v.valuedOn > cur.valuedOn) latest.set(v.propertyId, v);
  }
  const missing = propertyIds.filter((p) => !latest.has(p));
  const picked = [...latest.values()];
  return {
    nav: sum(picked.map((v) => v.value)),
    missing,
    asOf: picked.length ? picked.map((v) => v.valuedOn).sort().slice(-1)[0] : null,
  };
}

/** Reserve balance as basis points of the floor. 12000 = 120%. */
export function reserveCoverageBp(balance: Money, floor: Money): number | null {
  if (floor <= ZERO) return null;
  return Number((balance * BP) / floor);
}

// ─── Formatting ──────────────────────────────────────────────────────

export const formatBpAsPercent = (bp: number): string => `${(bp / 100).toFixed(2)}%`;
export const formatBpAsMultiple = (bp: number): string => `${(bp / 10_000).toFixed(2)}x`;

/**
 * A metric report is only comparable if it says which formula produced it.
 * Carrying the convention alongside the figure is what stops two vehicles
 * reporting incomparable numbers that look alike.
 */
export const METRIC_CONVENTION = {
  irr: "Bisection to 1bp over periodic cash flows. Period 0 is the first outflow. F-14.",
  moic: "Total returned / total invested, in basis points of a multiple. F-14.",
  nav: "Sum of the latest INDEPENDENT valuation per property. Management estimates excluded. F-13.",
  reserveCoverage: "Reserve balance / Reserve Floor. Floor is not NAV-linked. F-06.",
} as const;

export interface MetricReport {
  vehicleId: string;
  periodEnd: string;
  irrBp: number | null;
  irrNote?: string;
  moicBp: number | null;
  nav: Money;
  navMissing: string[];
  reserveCoverageBp: number | null;
  convention: typeof METRIC_CONVENTION;
}

export function buildMetricReport(input: {
  vehicleId: string;
  periodEnd: string;
  flows: readonly CashFlow[];
  invested: Money;
  returned: Money;
  valuations: readonly DatedValuation[];
  propertyIds: readonly string[];
  reserveBalance: Money;
  reserveFloor: Money;
}): MetricReport {
  const r = irr(input.flows);
  const n = nav(input.valuations, input.propertyIds);
  return {
    vehicleId: input.vehicleId,
    periodEnd: input.periodEnd,
    irrBp: r.bp,
    irrNote: r.reason,
    moicBp: moic(input.invested, input.returned),
    nav: n.nav,
    navMissing: n.missing,
    reserveCoverageBp: reserveCoverageBp(input.reserveBalance, input.reserveFloor),
    convention: METRIC_CONVENTION,
  };
}

export function explainReport(r: MetricReport): string {
  const lines = [
    `Vehicle ${r.vehicleId} — period ending ${r.periodEnd}`,
    `  IRR              ${r.irrBp === null ? `n/a (${r.irrNote})` : formatBpAsPercent(r.irrBp)}`,
    `  MOIC             ${r.moicBp === null ? "n/a" : formatBpAsMultiple(r.moicBp)}`,
    `  NAV              ${format(r.nav)}`,
    `  Reserve coverage ${r.reserveCoverageBp === null ? "n/a" : formatBpAsPercent(r.reserveCoverageBp)}`,
  ];
  if (r.navMissing.length) {
    lines.push(`  ! NAV excludes ${r.navMissing.length} propert${r.navMissing.length === 1 ? "y" : "ies"} with no independent valuation`);
  }
  return lines.join("\n");
}
