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
 * ── THE CLASSES CHANGED AXIS (v5 · decision R2) ──────────────────────
 * This file used to declare its own six classes measuring HOW A VALUE WAS
 * PRODUCED:
 *
 *   observed > verified > modelled > estimated > forecast > pending
 *
 * The v5 canon declares six measuring HOW WELL SOURCED IT IS:
 *
 *   VERIFIED > CORROBORATED > REPORTED > INFERRED > FORECAST > UNKNOWN
 *
 * Six values each, one shared name, two different questions. They were
 * reconciled onto the v5 set, which is now the single definition in
 * constants/taxonomies.ts — this file imports it rather than restating it.
 * Two further copies existed in app/_assemblies/data.ts and content/legal.ts;
 * both now re-export from here. Three copies of a constitutional type is
 * three chances to disagree.
 *
 * The mapping applied:
 *
 *   observed   -> VERIFIED       an authoritative direct source
 *   verified   -> CORROBORATED   a second party independently agreed
 *   modelled   -> INFERRED       derived by a defined formula
 *   estimated  -> REPORTED       asserted by a party with an interest
 *   forecast   -> FORECAST       unchanged
 *   pending    -> UNKNOWN        insufficient evidence
 *
 * ── ONE WART THIS CREATES, STATED PLAINLY ────────────────────────────
 * `verifiedAt` now pairs with CORROBORATED, not with VERIFIED.
 *
 * That reads backwards and it is not a mistake. The field records when a
 * SECOND party confirmed something, which was the old `verified` and is
 * now CORROBORATED. VERIFIED means the source is authoritative in itself —
 * a bank feed, a registry extract — and it is established at `observedAt`
 * by the source, with no separate confirmation to date.
 *
 * The ordering is what the arithmetic depends on: a derived value takes
 * the confidence of its WEAKEST input automatically. A NAV built from one
 * authoritative valuation and one management assertion is not "mostly
 * authoritative" — it is REPORTED, and the arithmetic says so without
 * anyone remembering to.
 */

import { weakestConfidence, CONFIDENCE_RANK, taxonomyValues } from "../constants/taxonomies";
import type { ConfidenceClass } from "../constants/taxonomies";

/**
 * The corroboration class of a value.
 *
 * Defined in constants/taxonomies.ts, aliased here because this is where
 * the domain reads it from and the name `Confidence` is what fifty call
 * sites already say.
 */
export type Confidence = ConfidenceClass;

/** Strongest first. Index is the rank; higher index is weaker. */
export const CONFIDENCE_ORDER = taxonomyValues("confidence") as readonly Confidence[];

export const rankOf = (c: Confidence): number => CONFIDENCE_RANK[c];
export const isWeaker = (a: Confidence, b: Confidence): boolean => rankOf(a) > rankOf(b);

/**
 * The weakest of several classes.
 *
 * Keeps a derived figure honest: combine an authoritative valuation with a
 * management assertion and the result is REPORTED, because that is what it
 * is. Delegates to the taxonomy so the ordering has exactly one definition.
 */
export const weakest = weakestConfidence;

export interface Provenanced<T> {
  value: T;
  confidence: Confidence;
  /** When the underlying fact was true. Not when the row was written. */
  observedAt: string;
  /** When a SECOND party confirmed it. Pairs with CORROBORATED — see the header. */
  verifiedAt?: string;
  /** Where it came from: a valuer's name, a bank feed, a model id. */
  source: string;
  /** The identity that recorded it. */
  observer: string;
  /** For INFERRED values: what produced them. */
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
  /* CORROBORATED, not VERIFIED. The field dates a second party's
     confirmation, and VERIFIED is authoritative without one. The header
     explains why that reads backwards. */
  if (p.confidence === "CORROBORATED" && !p.verifiedAt) {
    throw new ProvenanceError(
      "a value claiming 'CORROBORATED' must say when it was confirmed. Confirmation without a date " +
        "cannot be aged, and an unaged confirmation is indistinguishable from an old one.",
    );
  }
  if (p.confidence !== "CORROBORATED" && p.verifiedAt) {
    throw new ProvenanceError(
      `confidence is "${p.confidence}" but a verifiedAt is present. Either a second party confirmed ` +
        `it or none did.`,
    );
  }
  if (p.confidence === "INFERRED" && (!p.derivedFrom || p.derivedFrom.length === 0)) {
    throw new ProvenanceError(
      "an inferred value must name its inputs. A derivation whose inputs are unknown cannot be " +
        "re-run, and a figure that cannot be re-run cannot be reconciled (F-14).",
    );
  }
  return Object.freeze({ ...p });
}

/**
 * Derive a value from provenanced inputs.
 *
 * The result is INFERRED, inherits the WEAKEST input confidence when that
 * is weaker than INFERRED, and records what it was built from. Nobody has
 * to remember to downgrade it — the arithmetic does.
 */
export function derive<T>(
  value: T,
  inputs: readonly Provenanced<unknown>[],
  opts: { source: string; observer: string; observedAt: string },
): Provenanced<T> {
  const inherited = weakest(inputs.map((i) => i.confidence));

  /* NOT simply the weaker of the two — and this is the one place the v5
     axis change would have quietly broken a regulatory gate.

     On the old axis `modelled` ranked STRONGER than `estimated`, so
     taking the weaker of the two downgraded a NAV built from a management
     estimate to `estimated`, which fitForFiling() refuses.

     On the v5 axis INFERRED ranks WEAKER than REPORTED — inference is
     less well-sourced than a direct report — so the same "take the
     weaker" rule now returns INFERRED, which fitForFiling() ADMITS with
     disclosure. The migration would have turned a refused figure into an
     admitted one without a single test noticing.

     So the rule is stated in terms of filing-fitness rather than rank: a
     derivation from filing-fit inputs is INFERRED, and a derivation
     touching anything weaker keeps that weaker class. F-13 survives the
     change of axis. */
  const confidence: Confidence = FILING_FIT.has(inherited) ? "INFERRED" : inherited;
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
 * F-13: filings use INDEPENDENT valuations only. REPORTED is where a
 * management valuation lands, and this is the gate that stops one reaching
 * a filing by being formatted the same as an independent one.
 */
/**
 * The classes an independent source stands behind.
 *
 * F-13's gate, named once so `derive()` and `fitForFiling()` cannot drift
 * apart — which is exactly what the v5 axis change nearly caused.
 */
export const FILING_FIT: ReadonlySet<Confidence> = new Set<Confidence>(["VERIFIED", "CORROBORATED"]);

export function fitForFiling(p: Provenanced<unknown>): { ok: boolean; reason?: string } {
  if (FILING_FIT.has(p.confidence)) return { ok: true };
  if (p.confidence === "INFERRED") {
    return { ok: true, reason: "inferred from filing-fit inputs; the derivation must be disclosed" };
  }
  return {
    ok: false,
    reason:
      `confidence "${p.confidence}" is not fit for a regulatory filing. ` +
      `Filings use independent valuations only (F-13); a management assertion is not one.`,
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
 * An independent valuation is CORROBORATED on the day it is signed. Twelve
 * months later the property has not been revalued and nothing has changed
 * in the record — but the number is no longer a well-sourced statement
 * about today. It has become REPORTED, and saying so is more honest than
 * letting it keep a badge it has outgrown.
 */
export function decayed(
  p: Provenanced<unknown>,
  atIso: string,
  staleAfterDays: number,
): Confidence {
  if (p.confidence !== "CORROBORATED" && p.confidence !== "VERIFIED") return p.confidence;
  const age = ageInDays(p, atIso);
  return Number.isNaN(age) || age <= staleAfterDays ? p.confidence : "REPORTED";
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
