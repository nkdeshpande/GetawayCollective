/**
 * Provenance spine — Wave 3
 */

import { describe, it, expect } from "vitest";
import {
  provenance, derive, weakest, isWeaker, fitForFiling, ageInDays,
  decayed, STALENESS_DAYS, explain, ProvenanceError,
} from "../lib/provenance";

const base = {
  observedAt: "2026-06-01T00:00:00.000Z",
  source: "Knight Frank India",
  observer: "ic-chair",
};

describe("a provenanced value must account for itself", () => {
  it("refuses a blank source", () => {
    expect(() => provenance({ ...base, value: 1, confidence: "observed", source: "  " }))
      .toThrow(ProvenanceError);
  });

  it("refuses an unattributed value (E-02)", () => {
    expect(() => provenance({ ...base, value: 1, confidence: "observed", observer: "" }))
      .toThrow(/who recorded it/);
  });

  it("refuses 'verified' with no verification date", () => {
    // Verification without a date cannot be aged, and an unaged
    // verification is indistinguishable from an old one.
    expect(() => provenance({ ...base, value: 1, confidence: "verified" }))
      .toThrow(/when it was verified/);
  });

  it("refuses a verification date on something not verified", () => {
    expect(() => provenance({
      ...base, value: 1, confidence: "estimated", verifiedAt: "2026-06-02T00:00:00.000Z",
    })).toThrow(/Either it was verified or it was not/);
  });

  it("refuses a modelled value with no named inputs", () => {
    // A model whose inputs are unknown cannot be re-run, and a figure that
    // cannot be re-run cannot be reconciled (F-14).
    expect(() => provenance({ ...base, value: 1, confidence: "modelled" }))
      .toThrow(/must name its inputs/);
  });

  it("accepts a well-formed verified value", () => {
    const p = provenance({
      ...base, value: 42, confidence: "verified", verifiedAt: "2026-06-02T00:00:00.000Z",
    });
    expect(p.confidence).toBe("verified");
  });

  it("is frozen once constructed", () => {
    const p = provenance({ ...base, value: 42, confidence: "observed" });
    expect(Object.isFrozen(p)).toBe(true);
  });
});

describe("confidence is ordered", () => {
  it("ranks strongest to weakest", () => {
    expect(isWeaker("estimated", "verified")).toBe(true);
    expect(isWeaker("verified", "estimated")).toBe(false);
    expect(isWeaker("pending", "forecast")).toBe(true);
  });

  it("takes the weakest of a set", () => {
    expect(weakest(["observed", "verified", "estimated"])).toBe("estimated");
    expect(weakest(["observed", "verified"])).toBe("verified");
  });

  it("treats an empty set as pending, not as strong", () => {
    expect(weakest([])).toBe("pending");
  });
});

describe("derived values inherit their weakest input", () => {
  const independent = provenance({
    ...base, value: 1000, confidence: "verified", verifiedAt: "2026-06-02T00:00:00.000Z",
  });
  const management = provenance({
    ...base, value: 500, confidence: "estimated", source: "internal desktop review",
  });

  it("is modelled when every input is strong", () => {
    const d = derive(1500, [independent], { source: "NAV model", observer: "coo", observedAt: base.observedAt });
    expect(d.confidence).toBe("modelled");
    expect(d.derivedFrom).toEqual(["Knight Frank India"]);
  });

  it("DOWNGRADES automatically when any input is weaker", () => {
    // A NAV built from one independent valuation and one management
    // estimate is not "mostly independent". It is an estimate, and the
    // arithmetic says so without anyone remembering to.
    const d = derive(1500, [independent, management], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    expect(d.confidence).toBe("estimated");
  });

  it("records every input so the figure can be re-run", () => {
    const d = derive(1500, [independent, management], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    expect(d.derivedFrom).toHaveLength(2);
  });
});

describe("fitness for a regulatory filing (F-13)", () => {
  it("admits observed and verified", () => {
    expect(fitForFiling({ ...base, value: 1, confidence: "observed" } as any).ok).toBe(true);
    expect(fitForFiling({ ...base, value: 1, confidence: "verified" } as any).ok).toBe(true);
  });

  it("REFUSES a management estimate", () => {
    // The failure this prevents: a management valuation reaching a filing
    // because it was formatted identically to an independent one.
    const r = fitForFiling({ ...base, value: 1, confidence: "estimated" } as any);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("F-13");
  });

  it("refuses a forecast", () => {
    expect(fitForFiling({ ...base, value: 1, confidence: "forecast" } as any).ok).toBe(false);
  });

  it("admits a modelled value but requires the derivation be disclosed", () => {
    const r = fitForFiling({ ...base, value: 1, confidence: "modelled" } as any);
    expect(r.ok).toBe(true);
    expect(r.reason).toContain("disclosed");
  });
});

describe("confidence decays with age", () => {
  const valuation = provenance({
    value: 50_000_000, confidence: "verified",
    observedAt: "2025-06-01T00:00:00.000Z", verifiedAt: "2025-06-02T00:00:00.000Z",
    source: "Knight Frank India", observer: "ic-chair",
  });

  it("measures age in whole days", () => {
    expect(ageInDays(valuation, "2025-06-11T00:00:00.000Z")).toBe(10);
  });

  it("keeps its class inside the window", () => {
    expect(decayed(valuation, "2025-12-01T00:00:00.000Z", STALENESS_DAYS.valuation)).toBe("verified");
  });

  it("DECAYS to estimated past the window", () => {
    // Nothing in the record changed. The property simply has not been
    // revalued, so the number is no longer a verified statement about
    // today — and saying so beats letting it keep a badge it outgrew.
    expect(decayed(valuation, "2027-01-01T00:00:00.000Z", STALENESS_DAYS.valuation)).toBe("estimated");
  });

  it("does not promote a weak value by aging it", () => {
    const est = provenance({ ...base, value: 1, confidence: "estimated" });
    expect(decayed(est, "2030-01-01T00:00:00.000Z", 1)).toBe("estimated");
  });

  it("uses the constitutional windows", () => {
    expect(STALENESS_DAYS.valuation).toBe(365);   // EP-01 §5.14, annual minimum
    expect(STALENESS_DAYS.accreditation).toBe(21); // 15 working days, outer bound
  });
});

describe("explains itself", () => {
  it("shows value, class, source and derivation together", () => {
    const d = derive(1500, [provenance({ ...base, value: 1, confidence: "observed" })], {
      source: "NAV model", observer: "coo", observedAt: base.observedAt,
    });
    const s = explain(d);
    expect(s).toContain("[modelled]");
    expect(s).toContain("from:");
  });
});
