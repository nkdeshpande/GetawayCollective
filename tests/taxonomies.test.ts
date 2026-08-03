/**
 * The eight cross-cutting taxonomies.
 *
 * The ranks here are not display order — they decide redaction and
 * permission. `atLeastAsClosed` gates what an aperture may render and
 * `isConsequential` decides which commands need approval, so a silent
 * reordering is a security change. These pin the direction.
 */
import { describe, it, expect } from "vitest";
import {
  TAXONOMIES,
  ALL_TAXONOMIES,
  DISCLOSURE_RANK,
  OPERATION_RANK,
  CONFIDENCE_RANK,
  atLeastAsClosed,
  weakestConfidence,
  isConsequential,
  taxonomyValues,
  TAXONOMY_LAWS,
} from "../constants/taxonomies";

describe("the taxonomy registry", () => {
  it("declares eight vocabularies over 47 values", () => {
    expect(ALL_TAXONOMIES).toHaveLength(8);
    expect(ALL_TAXONOMIES.reduce((n, t) => n + t.values.length, 0)).toBe(47);
  });

  it("keys every taxonomy by its own id", () => {
    for (const [key, t] of Object.entries(TAXONOMIES)) expect(t.id).toBe(key);
  });

  it("states what each vocabulary governs and why it exists", () => {
    for (const t of ALL_TAXONOMIES) {
      expect(t.appliesTo, t.id).toBeTruthy();
      expect(t.why.length, t.id).toBeGreaterThan(40);
    }
  });

  it("orders every taxonomy contiguously from 1", () => {
    for (const t of ALL_TAXONOMIES) {
      const orders = t.values.map((v) => v.order).sort((a, b) => a - b);
      expect(orders, t.id).toEqual(t.values.map((_, i) => i + 1));
    }
  });

  it("spells every value in SCREAMING_CASE, as the canon does", () => {
    for (const t of ALL_TAXONOMIES) {
      for (const v of t.values) expect(v.value, `${t.id}.${v.value}`).toMatch(/^[A-Z][A-Z0-9_-]*$/);
    }
  });
});

describe("disclosure class — the redaction axis", () => {
  it("ranks from public to privileged", () => {
    expect(DISCLOSURE_RANK.PUBLIC).toBe(1);
    expect(DISCLOSURE_RANK.PRIVILEGED).toBe(6);
    expect(DISCLOSURE_RANK.RESTRICTED).toBeGreaterThan(DISCLOSURE_RANK["MEMBER-RESTRICTED"]);
  });

  it("refuses to show a more closed record to a less cleared aperture", () => {
    expect(atLeastAsClosed("RESTRICTED", "PUBLIC")).toBe(true);
    expect(atLeastAsClosed("PUBLIC", "RESTRICTED")).toBe(false);
    /* Equal is still "at least as closed" — a public aperture may render
       a public record. */
    expect(atLeastAsClosed("PUBLIC", "PUBLIC")).toBe(true);
  });

  it("puts investor disclosure below member and above public", () => {
    expect(DISCLOSURE_RANK["INVESTOR-CONFIDENTIAL"]).toBeGreaterThan(DISCLOSURE_RANK.PUBLIC);
    expect(DISCLOSURE_RANK["INVESTOR-CONFIDENTIAL"]).toBeLessThan(DISCLOSURE_RANK.INTERNAL);
  });
});

describe("operation class — what makes separation of duties expressible", () => {
  it("escalates from read to publish", () => {
    expect(OPERATION_RANK.READ).toBe(1);
    expect(OPERATION_RANK.EXECUTE).toBeGreaterThan(OPERATION_RANK.WRITE);
    expect(OPERATION_RANK.APPROVE).toBeGreaterThan(OPERATION_RANK.ATTEST);
  });

  it("treats approve and above as consequential, write and below as not", () => {
    expect(isConsequential("READ")).toBe(false);
    expect(isConsequential("WRITE")).toBe(false);
    expect(isConsequential("ATTEST")).toBe(false);
    expect(isConsequential("APPROVE")).toBe(true);
    expect(isConsequential("EXECUTE")).toBe(true);
    expect(isConsequential("PUBLISH")).toBe(true);
  });

  it("separates prepare from execute, which is the point of the axis", () => {
    /* SOD-01 cannot be stated without these being distinct values. */
    expect(OPERATION_RANK.WRITE).not.toBe(OPERATION_RANK.EXECUTE);
  });
});

describe("confidence — ordered weakest-last", () => {
  it("ranks a verified source strongest and unknown weakest", () => {
    expect(CONFIDENCE_RANK.VERIFIED).toBe(1);
    expect(CONFIDENCE_RANK.UNKNOWN).toBe(6);
  });

  it("takes the weakest input, because a derivation is no better than its worst source", () => {
    expect(weakestConfidence(["VERIFIED", "REPORTED"])).toBe("REPORTED");
    expect(weakestConfidence(["VERIFIED", "CORROBORATED"])).toBe("CORROBORATED");
    expect(weakestConfidence(["FORECAST", "VERIFIED", "INFERRED"])).toBe("FORECAST");
    expect(weakestConfidence(["VERIFIED"])).toBe("VERIFIED");
  });

  it("treats an empty derivation as unknown, never as verified", () => {
    /* Deriving from nothing must not manufacture confidence. */
    expect(weakestConfidence([])).toBe("UNKNOWN");
  });
});

describe("qualification state", () => {
  it("carries DECLINED, which the four-value accreditation state could not", () => {
    expect(taxonomyValues("qualification_state")).toContain("DECLINED");
    expect(taxonomyValues("qualification_state")).toHaveLength(6);
  });
});

describe("the laws", () => {
  it("records why disclosure and access are different axes", () => {
    expect(TAXONOMY_LAWS.ownAxis).toMatch(/sensitive/i);
    expect(TAXONOMY_LAWS.operationClassEnablesSoD).toMatch(/separation/i);
    expect(TAXONOMY_LAWS.orderIsSemantic).toMatch(/rank/i);
  });
});
