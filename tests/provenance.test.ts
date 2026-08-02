/**
 * Provenance spine — Wave 3, migrated to the v5 confidence axis (R2)
 *
 * The classes moved from measuring HOW A VALUE WAS PRODUCED
 * (observed / verified / modelled / estimated / forecast / pending) to
 * measuring HOW WELL SOURCED IT IS
 * (VERIFIED / CORROBORATED / REPORTED / INFERRED / FORECAST / UNKNOWN).
 *
 * The behaviour under test is unchanged: a derivation still inherits its
 * weakest input, a management assertion still cannot reach a filing, and
 * a stale confirmation still decays. Only the vocabulary moved.
 *
 * One consequence is worth stating where it is tested rather than only in
 * the header of lib/provenance.ts: `verifiedAt` pairs with CORROBORATED,
 * not with VERIFIED. VERIFIED means the source is authoritative in itself
 * and has no second confirmation to date.
 */

import { describe, it, expect } from "vitest";
import {
  provenance, derive, weakest, isWeaker, fitForFiling, ageInDays,
  decayed, STALENESS_DAYS, explain, ProvenanceError, CONFIDENCE_ORDER,
} from "../lib/provenance";

const base = {
  observedAt: "2026-06-01T00:00:00.000Z",
  source: "Knight Frank India",
  observer: "ic-chair",
};

describe("a provenanced value must account for itself", () => {
  it("refuses a blank source", () => {
    expect(() => provenance({ ...base, value: 1, confidence: "VERIFIED", source: "  " }))
      .toThrow(ProvenanceError);
  });

  it("refuses an unattributed value (E-02)", () => {
    expect(() => provenance({ ...base, value: 1, confidence: "VERIFIED", observer: "" }))
      .toThrow(/who recorded it/);
  });

  it("refuses CORROBORATED with no confirmation date", () => {
    // Confirmation without a date cannot be aged, and an unaged
    // confirmation is indistinguishable from an old one.
    expect(() => provenance({ ...base, value: 1, confidence: "CORROBORATED" }))
      .toThrow(/when it was confirmed/);
  });

  it("refuses a confirmation date on something nobody confirmed", () => {
    expect(() => provenance({
      ...base, value: 1, confidence: "REPORTED", verifiedAt: "2026-06-02T00:00:00.000Z",
    })).toThrow(/Either a second party confirmed it or none did/);
  });

  it("does NOT require a confirmation date on VERIFIED", () => {
    // The wart R2 introduces, pinned so nobody "fixes" it by hand: an
    // authoritative direct source is established at observedAt by the
    // source itself. There is no second party to date.
    const p = provenance({ ...base, value: 42, confidence: "VERIFIED" });
    expect(p.confidence).toBe("VERIFIED");
    expect(p.verifiedAt).toBeUndefined();
  });

  it("refuses an inferred value with no named inputs", () => {
    // A derivation whose inputs are unknown cannot be re-run, and a figure
    // that cannot be re-run cannot be reconciled (F-14).
    expect(() => provenance({ ...base, value: 1, confidence: "INFERRED" }))
      .toThrow(/must name its inputs/);
  });

  it("accepts a well-formed corroborated value", () => {
    const p = provenance({
      ...base, value: 42, confidence: "CORROBORATED", verifiedAt: "2026-06-02T00:00:00.000Z",
    });
    expect(p.confidence).toBe("CORROBORATED");
  });

  it("is frozen once constructed", () => {
    const p = provenance({ ...base, value: 42, confidence: "VERIFIED" });
    expect(Object.isFrozen(p)).toBe(true);
  });
});

describe("confidence is ordered", () => {
  it("reads its order from the taxonomy, strongest first", () => {
    expect(CONFIDENCE_ORDER).toEqual([
      "VERIFIED", "CORROBORATED", "REPORTED", "INFERRED", "FORECAST", "UNKNOWN",
    ]);
  });

  it("ranks strongest to weakest", () => {
    expect(isWeaker("REPORTED", "CORROBORATED")).toBe(true);
    expect(isWeaker("CORROBORATED", "REPORTED")).toBe(false);
    expect(isWeaker("UNKNOWN", "FORECAST")).toBe(true);
  });

  it("takes the weakest of a set", () => {
    expect(weakest(["VERIFIED", "CORROBORATED", "REPORTED"])).toBe("REPORTED");
    expect(weakest(["VERIFIED", "CORROBORATED"])).toBe("CORROBORATED");
  });

  it("treats an empty set as UNKNOWN, not as strong", () => {
    expect(weakest([])).toBe("UNKNOWN");
  });
});

describe("derived values inherit their weakest input", () => {
  const independent = provenance({
    ...base, value: 1000, confidence: "CORROBORATED", verifiedAt: "2026-06-02T00:00:00.000Z",
  });
  const management = provenance({
    ...base, value: 500, confidence: "REPORTED", source: "internal desktop review",
  });

  it("is INFERRED when every input is strong", () => {
    const d = derive(1500, [independent], { source: "NAV model", observer: "coo", observedAt: base.observedAt });
    expect(d.confidence).toBe("INFERRED");
    expect(d.derivedFrom).toEqual(["Knight Frank India"]);
  });

  it("DOWNGRADES automatically when any input is weaker", () => {
    // A NAV built from one independent valuation and one management
    // assertion is not "mostly independent". It is REPORTED, and the
    // arithmetic says so without anyone remembering to.
    const d = derive(1500, [independent, management], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    expect(d.confidence).toBe("REPORTED");
  });

  it("records every input so the figure can be re-run", () => {
    const d = derive(1500, [independent, management], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    expect(d.derivedFrom).toHaveLength(2);
  });
});

describe("fitness for a regulatory filing (F-13)", () => {
  it("admits VERIFIED and CORROBORATED", () => {
    expect(fitForFiling({ ...base, value: 1, confidence: "VERIFIED" } as any).ok).toBe(true);
    expect(fitForFiling({ ...base, value: 1, confidence: "CORROBORATED" } as any).ok).toBe(true);
  });

  it("REFUSES a management assertion", () => {
    // The failure this prevents: a management valuation reaching a filing
    // because it was formatted identically to an independent one.
    const r = fitForFiling({ ...base, value: 1, confidence: "REPORTED" } as any);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("F-13");
  });

  it("refuses a forecast", () => {
    expect(fitForFiling({ ...base, value: 1, confidence: "FORECAST" } as any).ok).toBe(false);
  });

  it("refuses UNKNOWN", () => {
    expect(fitForFiling({ ...base, value: 1, confidence: "UNKNOWN" } as any).ok).toBe(false);
  });

  it("admits an inferred value but requires the derivation be disclosed", () => {
    const r = fitForFiling({ ...base, value: 1, confidence: "INFERRED" } as any);
    expect(r.ok).toBe(true);
    expect(r.reason).toContain("disclosed");
  });
});

describe("confidence decays with age", () => {
  const valuation = provenance({
    value: 50_000_000, confidence: "CORROBORATED",
    observedAt: "2025-06-01T00:00:00.000Z", verifiedAt: "2025-06-02T00:00:00.000Z",
    source: "Knight Frank India", observer: "ic-chair",
  });

  it("measures age in whole days", () => {
    expect(ageInDays(valuation, "2025-06-11T00:00:00.000Z")).toBe(10);
  });

  it("keeps its class inside the window", () => {
    expect(decayed(valuation, "2025-12-01T00:00:00.000Z", STALENESS_DAYS.valuation)).toBe("CORROBORATED");
  });

  it("DECAYS to REPORTED past the window", () => {
    // Nothing in the record changed. The property simply has not been
    // revalued, so the number is no longer a well-sourced statement about
    // today — and saying so beats letting it keep a badge it outgrew.
    expect(decayed(valuation, "2027-01-01T00:00:00.000Z", STALENESS_DAYS.valuation)).toBe("REPORTED");
  });

  it("does not promote a weak value by aging it", () => {
    const est = provenance({ ...base, value: 1, confidence: "REPORTED" });
    expect(decayed(est, "2030-01-01T00:00:00.000Z", 1)).toBe("REPORTED");
  });

  it("uses the constitutional windows", () => {
    expect(STALENESS_DAYS.valuation).toBe(365);   // EP-01 §5.14, annual minimum
    expect(STALENESS_DAYS.accreditation).toBe(21); // 15 working days, outer bound
  });
});

describe("explains itself", () => {
  it("shows value, class, source and derivation together", () => {
    const d = derive(1500, [provenance({ ...base, value: 1, confidence: "VERIFIED" })], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    const s = explain(d);
    expect(s).toContain("[INFERRED]");
    expect(s).toContain("from:");
  });
});
