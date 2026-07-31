/**
 * PROVENANCE SPINE — every value carries how much it can be trusted
 *
 * Wave 3 · Graph & Lifecycle
 * Serves: E-02 (Every Decision Has Provenance) · F-13 (Valuation Is Independent)
 *         F-14 (Metric Determinism)
 *
 * ── THE PROBLEM ──────────────────────────────────────────────────────
 * A number in a report tells you what it is and nothing about where it
 * came from. "NAV ₹42 Cr" reads identically whether it is an independent
 * valuation from last week or a management estimate from a spreadsheet
 * eighteen months ago. The reader cannot tell, and so treats both the same.
 *
 * A confidence class travels WITH the value. It cannot be dropped by a
 * formatting layer or lost in a join, because it is part of the value.
 *
 * ── THE CLASSES ARE ORDERED ──────────────────────────────────────────
 * observed > verified > modelled > estimated > forecast > pending
 *
 * The ordering matters more than the labels: it means a derived value can
 * be given the confidence of its WEAKEST input automatically. A NAV built
 * from one independent valuation and one management estimate is not
 * "mostly independent" — it is an estimate, and the arithmetic should say
 * so without anyone remembering to.
 */

export type Confidence =
  /** Directly measured. A bank balance, a settled payment. */
  | "observed"
  /** Independently confirmed by a third party. An independent valuation. */
  | "verified"
  /** Computed from other values by a defined formula. IRR, NAV, coverage. */
  | "modelled"
  /** Judgement by a party with an interest. A management valuation. */
  | "estimated"
  /** About the future. Necessarily unverifiable today. */
  | "forecast"
  /** Not yet available. Distinct from zero, and from unknown. */
  | "pending";

/** Strongest first. Index is the rank; higher index is weaker. */
export const CONFIDENCE_ORDER: readonly Confidence[] = [
  "observed", "verified", "modelled", "estimated", "forecast", "pending",
] as const;

export const rankOf = (c: Confidence): number => CONFIDENCE_ORDER.indexOf(c);
export const isWeaker = (a: Confidence, b: Confidence): boolean => rankOf(a) > rankOf(b);

/**
 * The weakest of several classes.
 *
 * This is the function that keeps a derived figure honest: combine an
 * independent valuation with a management estimate and the result is an
 * estimate, because that is what it is.
 */
export function weakest(cs: readonly Confidence[]): Confidence {
  if (cs.length === 0) return "pending";
  return cs.reduce((a, b) => (isWeaker(b, a) ? b : a));
}

export interface Provenanced<T> {
  value: T;
  confidence: Confidence;
  /** When the underlying fact was true. Not when the row was written. */
  observedAt: string;
  /** When a third party confirmed it. Absent unless confidence is verified. */
  verifiedAt?: string;
  /** Where it came from: a valuer's name, a bank feed, a model id. */
  source: string;
  /** The identity that recorded it. */
  observer: string;
  /** For modelled values: what produced them. */
  derivedFrom?: string[];
}

export class ProvenanceError extends Error {}

export function provenance<T>(p: Provenanced<T>): Provenanced<T> {
  if (!p.source?.trim()) {
    throw new ProvenanceError("a provenanced value must name its source; 'unknown' is a source, blank is not");
  }
  if (!p.observer?.trim()) {
    throw new ProvenanceError("a provenanced value must name who recorded it (E-02)");
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(p.observedAt)) {
    throw new ProvenanceError(`observedAt must be an ISO date, received "${p.observedAt}"`);
  }
  if (p.confidence === "verified" && !p.verifiedAt) {
    throw new ProvenanceError(
      "a value claiming 'verified' must say when it was verified. Verification without a date " +
        "cannot be aged, and an unaged verification is indistinguishable from an old one.",
    );
  }
  if (p.confidence !== "verified" && p.verifiedAt) {
    throw new ProvenanceError(
      `confidence is "${p.confidence}" but a verifiedAt is present. Either it was verified or it was not.`,
    );
  }
  if (p.confidence === "modelled" && (!p.derivedFrom || p.derivedFrom.length === 0)) {
    throw new ProvenanceError(
      "a modelled value must name its inputs. A model whose inputs are unknown cannot be re-run, " +
        "and a figure that cannot be re-run cannot be reconciled (F-14).",
    );
  }
  return Object.freeze({ ...p });
}

/**
 * Derive a value from provenanced inputs.
 *
 * The result is `modelled`, inherits the WEAKEST input confidence when that
 * is weaker than modelled, and records what it was built from. Nobody has
 * to remember to downgrade it — the arithmetic does.
 */
export function derive<T>(
  value: T,
  inputs: readonly Provenanced<unknown>[],
  opts: { source: string; observer: string; observedAt: string },
): Provenanced<T> {
  const inherited = weakest(inputs.map((i) => i.confidence));
  const confidence: Confidence = isWeaker(inherited, "modelled") ? inherited : "modelled";
  return provenance({
    value,
    confidence,
    observedAt: opts.observedAt,
    source: opts.source,
    observer: opts.observer,
    derivedFrom: inputs.map((i) => i.source),
  });
}

/**
 * Whether a value is fit for a regulatory filing.
 *
 * F-13: filings use INDEPENDENT valuations only. `estimated` is where a
 * management valuation lands, and this is the gate that stops one reaching
 * a filing by being formatted the same as an independent one.
 */
export function fitForFiling(p: Provenanced<unknown>): { ok: boolean; reason?: string } {
  if (p.confidence === "observed" || p.confidence === "verified") return { ok: true };
  if (p.confidence === "modelled") {
    return { ok: true, reason: "modelled from filing-fit inputs; the derivation must be disclosed" };
  }
  return {
    ok: false,
    reason:
      `confidence "${p.confidence}" is not fit for a regulatory filing. ` +
      `Filings use independent valuations only (F-13); a management estimate is not one.`,
  };
}

/** Age in whole days at a given instant. Staleness is a confidence question. */
export function ageInDays(p: Provenanced<unknown>, atIso: string): number {
  const then = Date.parse(p.observedAt);
  const now = Date.parse(atIso);
  if (Number.isNaN(then) || Number.isNaN(now)) return NaN;
  return Math.floor((now - then) / 86_400_000);
}

/**
 * A value can decay in confidence without anyone touching it.
 *
 * An independent valuation is `verified` on the day it is signed. Twelve
 * months later the property has not been revalued and nothing has changed
 * in the record — but the number is no longer a verified statement about
 * today. It has become an estimate, and saying so is more honest than
 * letting it keep a badge it has outgrown.
 */
export function decayed(
  p: Provenanced<unknown>,
  atIso: string,
  staleAfterDays: number,
): Confidence {
  if (p.confidence !== "verified" && p.confidence !== "observed") return p.confidence;
  const age = ageInDays(p, atIso);
  return Number.isNaN(age) || age <= staleAfterDays ? p.confidence : "estimated";
}

/** Constitutional staleness windows. */
export const STALENESS_DAYS = {
  /** Independent valuations are required at least annually (EP-01 §5.14). */
  valuation: 365,
  /** Accreditation is fifteen WORKING days; twenty-one calendar is the outer bound. */
  accreditation: 21,
  /** Reserve balances move continuously; a month-old figure is not today's. */
  reserveBalance: 31,
} as const;

export function explain<T>(p: Provenanced<T>): string {
  const bits = [`${String(p.value)}`, `[${p.confidence}]`, `source: ${p.source}`, `observed: ${p.observedAt}`];
  if (p.verifiedAt) bits.push(`verified: ${p.verifiedAt}`);
  if (p.derivedFrom?.length) bits.push(`from: ${p.derivedFrom.join(" + ")}`);
  return bits.join(" · ");
}
