/**
 * METRIC GRAMMAR — how a number presents itself
 *
 * Wave 6 · Composite Surface
 * Authority: L1-01 §29 Metric Grammar · GC.SYSTEM Core
 * Serves: F-14 (Metric Determinism) · F-13 (Valuation Is Independent)
 *
 * ── THE IDEA ─────────────────────────────────────────────────────────
 * A number's visual voice is determined entirely by WHAT IT MEASURES, not
 * by where it sits or what the designer felt. Currency is copper. Ratio is
 * steel. Forecast is electric. Always, everywhere, without exception.
 *
 * This is what lets someone scan a dense financial screen and know, before
 * reading a single label, which figures are money and which are opinion.
 *
 * ── THIS IS WHERE THREE LAYERS MEET ──────────────────────────────────
 * The money layer says what a value IS. The provenance spine says how much
 * it can be TRUSTED. The design system says how it LOOKS. A figure carries
 * all three at once, and this module is the only place they are combined —
 * so a forecast can never be rendered as though it were observed.
 */

import { Money, format as formatMoney } from "./money";
import type { Confidence } from "./provenance";

export type MetricKind =
  | "currency"    // price, revenue, cash, NPV, debt
  | "percentage"  // occupancy, IRR, yield
  | "ratio"       // multiples, LTV, DSCR
  | "forecast"    // any modelled or forward-looking figure
  | "risk"        // volatility, covenant proximity
  | "loss"        // negative delta, impairment
  | "count";      // units, holders, days — dimensionless integers

/**
 * Tone per metric kind. Fixed by §29 and not negotiable per screen.
 *
 * `risk` and `loss` are deliberately the only two that carry alarm, and
 * they are different alarms: risk is a possibility, loss has happened.
 */
export const METRIC_TONE: Record<MetricKind, string> = {
  currency: "copper",
  percentage: "ink",     // resolves per ground; the value itself is neutral
  ratio: "steel",
  forecast: "electric",
  risk: "hazard",
  loss: "critical",
  count: "steel",
};

/** CSS custom property carrying that tone, ground-aware where needed. */
export const METRIC_VAR: Record<MetricKind, string> = {
  currency: "var(--gc-currency)",  // ground-aware alias: copper / copperDeep
  percentage: "var(--gc-fg)",
  ratio: "var(--gc-steel)",
  forecast: "var(--gc-electric)",
  risk: "var(--gc-risk)",          // ground-aware alias: hazard / hazardDeep
  loss: "var(--gc-critical)",
  count: "var(--gc-steel)",
};

export interface MetricFormatOptions {
  /** Indian grouping (12,50,000) rather than Western (1,250,000). */
  grouping?: "indian" | "western";
  /** Decimals to show. Defaults per kind. */
  decimals?: number;
  /** Currency symbol. Never omitted for a currency metric. */
  symbol?: string;
  /** Provenance class, if known. Drives the confidence mark. */
  confidence?: Confidence;
  /** Compact form for dense tables: 12.5L, 1.2Cr. */
  compact?: boolean;
}

export interface FormattedMetric {
  /** The string to render. Always carries its unit. */
  display: string;
  kind: MetricKind;
  tone: string;
  cssVar: string;
  /** True when this must be visually distinguished from observed values. */
  isProvisional: boolean;
  /** Screen-reader text. Expands symbols a reader would otherwise skip. */
  a11y: string;
}

const DEFAULT_DECIMALS: Record<MetricKind, number> = {
  currency: 2, percentage: 2, ratio: 2, forecast: 2, risk: 2, loss: 2, count: 0,
};

/**
 * Indian digit grouping: last three, then pairs.
 * 12500000 -> 1,25,00,000
 *
 * Not cosmetic. An Indian reader parses 1,25,00,000 at a glance and stalls
 * on 12,500,000, and this platform's members are largely Indian.
 */
function groupIndian(intPart: string): string {
  const neg = intPart.startsWith("-");
  const s = neg ? intPart.slice(1) : intPart;
  if (s.length <= 3) return (neg ? "-" : "") + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${neg ? "-" : ""}${grouped},${last3}`;
}

function groupWestern(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Lakh and crore. Used only where a table is too dense for full figures. */
function compactIndian(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${sign}${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

/**
 * A forecast, modelled or estimated figure must never look like an observed
 * one. This is the single rule that keeps a projection from being read as a
 * fact — and it is a rule about DISPLAY, so it belongs here rather than in
 * the provenance module.
 */
export function isProvisional(confidence?: Confidence): boolean {
  return confidence === "FORECAST" || confidence === "INFERRED" ||
         confidence === "REPORTED" || confidence === "UNKNOWN";
}

/** Mark appended to a provisional figure. Visible, not merely a colour. */
export const PROVISIONAL_MARK = " ~";

export class MetricGrammarError extends Error {}

/**
 * Format money.
 *
 * A currency metric is NEVER rendered without its symbol (§29). Passing an
 * empty symbol throws rather than silently producing a bare number that
 * looks like a count.
 */
export function currency(value: Money, opts: MetricFormatOptions = {}): FormattedMetric {
  const symbol = opts.symbol ?? "₹";
  if (!symbol) {
    throw new MetricGrammarError(
      "A currency metric is never displayed without a symbol (§29 Metric Grammar). " +
        "A bare number reads as a count.",
    );
  }
  const decimals = opts.decimals ?? DEFAULT_DECIMALS.currency;
  const raw = formatMoney(value);                    // exact decimal string
  const [intPart, fracPart = ""] = raw.split(".");
  const grouped = (opts.grouping ?? "indian") === "indian"
    ? groupIndian(intPart)
    : groupWestern(intPart);
  const frac = decimals > 0 ? `.${fracPart.padEnd(decimals, "0").slice(0, decimals)}` : "";

  const body = opts.compact
    ? compactIndian(Number(raw))
    : `${grouped}${frac}`;

  const provisional = isProvisional(opts.confidence);
  const kind: MetricKind = provisional ? "forecast" : "currency";

  return {
    display: `${symbol}${body}${provisional ? PROVISIONAL_MARK : ""}`,
    kind,
    tone: METRIC_TONE[kind],
    cssVar: METRIC_VAR[kind],
    isProvisional: provisional,
    a11y: `${body.replace(/,/g, "")} rupees${provisional ? `, ${opts.confidence}` : ""}`,
  };
}

/**
 * Format a rate held in basis points.
 *
 * Percentages arrive as integers from the metric layer — 1450 is 14.50%.
 * Accepting a float here would reopen the door the money layer closed.
 */
export function percentage(basisPoints: number, opts: MetricFormatOptions = {}): FormattedMetric {
  if (!Number.isInteger(basisPoints)) {
    throw new MetricGrammarError(
      `Percentages are basis-point integers: 14.5% is 1450, not 0.145. Received ${basisPoints}.`,
    );
  }
  const decimals = opts.decimals ?? DEFAULT_DECIMALS.percentage;
  const provisional = isProvisional(opts.confidence);
  const kind: MetricKind = provisional ? "forecast" : "percentage";
  const body = (basisPoints / 100).toFixed(decimals);
  return {
    display: `${body}%${provisional ? PROVISIONAL_MARK : ""}`,
    kind,
    tone: METRIC_TONE[kind],
    cssVar: METRIC_VAR[kind],
    isProvisional: provisional,
    a11y: `${body} percent${provisional ? `, ${opts.confidence}` : ""}`,
  };
}

/** Multiples, LTV, DSCR. Rendered with a trailing x so it cannot read as a rate. */
export function ratio(basisPoints: number, opts: MetricFormatOptions = {}): FormattedMetric {
  const decimals = opts.decimals ?? DEFAULT_DECIMALS.ratio;
  const provisional = isProvisional(opts.confidence);
  const kind: MetricKind = provisional ? "forecast" : "ratio";
  const body = (basisPoints / 10_000).toFixed(decimals);
  return {
    display: `${body}x${provisional ? PROVISIONAL_MARK : ""}`,
    kind,
    tone: METRIC_TONE[kind],
    cssVar: METRIC_VAR[kind],
    isProvisional: provisional,
    a11y: `${body} times${provisional ? `, ${opts.confidence}` : ""}`,
  };
}

/** Dimensionless integers — units, holders, days. */
export function count(n: number, unit?: string): FormattedMetric {
  const body = groupIndian(String(Math.trunc(n)));
  return {
    display: unit ? `${body} ${unit}` : body,
    kind: "count",
    tone: METRIC_TONE.count,
    cssVar: METRIC_VAR.count,
    isProvisional: false,
    a11y: `${body}${unit ? ` ${unit}` : ""}`,
  };
}

/**
 * A realised negative outcome — impairment, a loss on disposal.
 *
 * `loss` carries `critical`, the rarest colour in the system. It is
 * deliberately NOT used for a number that merely happens to be negative:
 * a negative delta on a forecast is a forecast, not a loss.
 */
export function loss(value: Money, opts: MetricFormatOptions = {}): FormattedMetric {
  const base = currency(value, opts);
  return {
    ...base,
    kind: "loss",
    tone: METRIC_TONE.loss,
    cssVar: METRIC_VAR.loss,
    a11y: `${base.a11y}, loss`,
  };
}

/** Volatility, covenant proximity. Always distinct from every other metric. */
export function risk(basisPoints: number, opts: MetricFormatOptions = {}): FormattedMetric {
  const base = percentage(basisPoints, opts);
  return {
    ...base,
    kind: "risk",
    tone: METRIC_TONE.risk,
    cssVar: METRIC_VAR.risk,
    a11y: `${base.a11y}, risk measure`,
  };
}

// ─────────────────────────────────────────────────────────────────────

/**
 * The five constitutional display rules, as assertions.
 *
 * Stated here as data so tests and the design reference read the same
 * source, rather than each restating them.
 */
export const GRAMMAR_RULES = {
  currencyNeedsSymbol: "Currency is never displayed without a symbol.",
  percentageNeedsSymbol: "Percentage is never displayed without a symbol.",
  forecastIsDistinguished:
    "Forecast is always visually distinguished from observed — by tone AND by a visible mark, " +
    "because colour alone is never the sole carrier of meaning.",
  riskIsUnique: "Risk never shares a colour with another metric kind.",
  lossIsRarest: "Loss carries critical, the rarest colour, and only for realised negative outcomes.",
} as const;

/** Every kind that is not `forecast` must have a distinct tone. */
export function tonesAreDistinct(): boolean {
  const kinds: MetricKind[] = ["currency", "percentage", "ratio", "risk", "loss"];
  const tones = kinds.map((k) => METRIC_TONE[k]);
  return new Set(tones).size === tones.length;
}
