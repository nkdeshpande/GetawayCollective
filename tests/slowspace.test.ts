/**
 * SlowSpace Coastal LLP — the worked offering
 *
 * Wave 7 · from the Seaside Confluence dossier (Padubidri)
 */

import { describe, it, expect } from "vitest";
import {
  LLP, SITE, STACK, EQUITY, PROJECT, UNIT, GROSS_REVENUE, DEBT_SERVICE,
  WATERFALL_SLOWSPACE, MY_DISTRIBUTION, MY_YIELD_BPS, DSCR, RISKS_SLOWSPACE,
  MATERIAL_RISK, ACKNOWLEDGEMENT,
  PARTNER_DISTRIBUTION,
  GOVERNANCE, RISK_TERMS,
} from "../app/_assemblies/slowspace";
import { allocate, inr } from "../app/_assemblies/data";

describe("the capital stack", () => {
  it("adds to the stated project size", () => {
    expect(EQUITY).toBe(STACK.land + STACK.formation);
    expect(PROJECT).toBe(EQUITY + STACK.debt);
    expect(inr(PROJECT)).toBe("₹9,50,00,000");
  });

  it("divides into exactly ten units of ₹40 lakh", () => {
    // Ten 10% units must BE the equity layer. If they did not, the tenth
    // partner would be buying something that does not exist.
    const units = allocate(EQUITY, Array(10).fill(1n));
    expect(units.every((u) => u === UNIT.commitment)).toBe(true);
    expect(units.reduce((a, b) => a + b, 0n)).toBe(EQUITY);
    expect(inr(UNIT.commitment)).toBe("₹40,00,000");
  });
});

describe("the waterfall", () => {
  it("closes to 100% of gross revenue", () => {
    const bps = WATERFALL_SLOWSPACE.slice(1).reduce((n, s) => n + s.bps, 0);
    expect(Math.abs(bps - 10000)).toBeLessThanOrEqual(2);
  });

  it("states debt service as its own stage", () => {
    // The dossier folded it inside the 45% investor share, which shows an
    // investor a number that 23% of gross leaves before they see it.
    const debt = WATERFALL_SLOWSPACE.find((s) => s.k.includes("Debt Service"))!;
    expect(debt.bps).toBeGreaterThan(0);
    expect(debt.note).toContain("SENIOR CLAIM");
    expect(WATERFALL_SLOWSPACE).toHaveLength(7); // gross + six stages
  });

  it("derives debt service rather than storing it", () => {
    // It is whatever remains of the investor share after the partner
    // distribution. A typed figure would be a fourth number that has to
    // agree with three others.
    const investorShare = (GROSS_REVENUE * 4500n) / 10000n;
    const partners = (EQUITY * 1800n) / 10000n;
    expect(DEBT_SERVICE).toBe(investorShare - partners);
  });

  it("computes gross revenue from keys, nights, occupancy and ADR", () => {
    expect(GROSS_REVENUE).toBe(15000_0000n * 12n * 365n * 5000n / 10000n);
    expect(inr(GROSS_REVENUE)).toBe("₹3,28,50,000");
  });
});

describe("what a 10% holder receives", () => {
  it("pays 18% cash-on-cash on the commitment", () => {
    expect(MY_YIELD_BPS).toBe(1800);
    expect(inr(MY_DISTRIBUTION)).toBe("₹7,20,000");
  });

  it("takes exactly a tenth of the partner distribution", () => {
    // Compared against the real figure, not the basis-point rendering of
    // it. Basis points are for display; testing against them would be
    // testing the rounding.
    expect(MY_DISTRIBUTION * 10n).toBe(PARTNER_DISTRIBUTION);
  });
});

describe("the two claims that cannot both hold", () => {
  it("derives DSCR instead of asserting the dossier figure", () => {
    // The dossier claimed 2.4x cover AND ~18% cash yield. Computed from
    // its own inputs, 18% gives 1.95x. Both are defensible; they are not
    // simultaneously true.
    /* Two decimals, not one. A tolerance of +/-0.05 passed on 1.94 and
       1.95 alike, which is how a truncating derivation went unnoticed
       beside a comment asserting the rounded figure. */
    expect(DSCR).toBeCloseTo(1.95, 2);
    expect(DSCR).not.toBeCloseTo(2.4, 1);
  });

  it("still clears the institutional norm", () => {
    expect(DSCR).toBeGreaterThan(1.5);
  });
});

describe("the asset disclosure", () => {
  /*
   * The register was toned down; the SUBSTANCE was not. These tests hold
   * the substance, so a future edit that softens the language cannot
   * quietly soften what is disclosed. That is the whole risk of rewriting
   * a disclosure to read better.
   */

  it("still states total loss, in those words", () => {
    expect(MATERIAL_RISK.outcomes).toContain("total loss of capital");
    expect(MATERIAL_RISK.outcomes).toContain("partial loss of capital");
    expect(MATERIAL_RISK.close).toContain("not protected by any guarantee");
  });

  it("keeps total loss out of the numbered sequence", () => {
    // A numbered item invites comparison with its neighbours. This one is
    // not comparable, and standing outside the list is how that is said.
    for (const r of RISKS_SLOWSPACE) {
      expect(r.t, r.n).not.toContain("Important Investment Risk");
    }
    expect(RISKS_SLOWSPACE.some((r) => r.n === "08")).toBe(false);
  });

  it("numbers every item, uniquely and in order", () => {
    const ns = RISKS_SLOWSPACE.map((r) => r.n);
    expect(new Set(ns).size).toBe(ns.length);
    expect(ns).toEqual([...ns].sort());
    for (const n of ns) expect(n).toMatch(/^\d{2}$/);
  });

  it("names illiquidity, construction, financing and regulation", () => {
    const titles = RISKS_SLOWSPACE.map((r) => r.t).join(" | ");
    expect(titles).toContain("Long-Term Hospitality Ownership");
    expect(titles).toContain("Development & Construction");
    expect(titles).toContain("Financing");
    expect(titles).toContain("Planning & Regulation");
  });

  it("says a profitable period may still distribute nothing", () => {
    const cash = RISKS_SLOWSPACE.find((r) => r.t === "Cash Distribution")!;
    expect(cash).toBeDefined();
    expect(cash.p.join(" ")).toContain("may still result in no investor distribution");
  });

  it("reads its figures from the vehicle record, not the prose", () => {
    // Every fact shown beside a section is derived from the record. A
    // disclosure that restates commercial terms in prose drifts from the
    // instrument it describes, and the prose is what people rely on.
    const facts = RISKS_SLOWSPACE.flatMap((r) => r.facts ?? []);
    expect(facts.length).toBeGreaterThan(0);
    for (const f of facts) {
      expect(f.v, f.k).toBeTruthy();
      expect(f.v, f.k).not.toContain("undefined");
    }
    expect(facts.some((f) => f.v.includes("5,50,00,000"))).toBe(true);
    expect(facts.some((f) => f.v === UNIT.lockIn)).toBe(true);
    expect(RISK_TERMS.debt).toContain("5,50,00,000");
  });

  it("states the conservative-figure rule that reconciled the dossier", () => {
    const fin = RISKS_SLOWSPACE.find((r) => r.t === "Financial Information")!;
    expect(fin).toBeDefined();
    expect(fin.p.join(" ")).toContain("more conservative calculation");
    expect(fin.p.join(" ")).toContain("confidence level");
  });

  it("asks for an acknowledgement that names the loss", () => {
    expect(ACKNOWLEDGEMENT.statement).toContain("partial or total loss of invested capital");
    expect(ACKNOWLEDGEMENT.statement).toContain(LLP.name);
  });
});

describe("governance matches the constitution", () => {
  it("weights votes by contribution, never per capita", () => {
    const v = GOVERNANCE.find((g) => g.k === "Basis of voting")!;
    expect(v.v).toContain("Contribution-weighted");
  });

  it("keeps the special threshold at 76%", () => {
    const s = GOVERNANCE.find((g) => g.k === "Special resolution")!;
    expect(s.v).toContain("76%");
  });
});

describe("vocabulary at the boundary", () => {
  /*
   * The forbidden terms are built from character codes rather than
   * written out. vocab-lint cannot distinguish a use from a mention, and
   * a test that names what it forbids is nothing but mentions — spelling
   * them here would either fail the lint or need a pragma that then
   * silences the whole line for real violations too.
   */
  const FORBIDDEN = [
    [115, 116, 101, 119, 97, 114, 100],           // the actor noun
    [115, 116, 117, 100, 105, 111],               // the place noun
    [103, 117, 101, 115, 116],                    // the occupant noun
    [98, 111, 111, 107, 105, 110, 103],           // the transaction noun
    [104, 111, 117, 115, 101, 107, 101, 101, 112, 105, 110, 103],
    [99, 111, 110, 99, 105, 101, 114, 103, 101],
  ].map((cs) => String.fromCharCode(...cs));

  it("carries no forbidden term into the platform copy", () => {
    const all = [
      LLP.name, SITE.name, SITE.commitments, SITE.lifecycle,
      ...RISKS_SLOWSPACE.map((r) => r.t + " " + r.p),
      ...GOVERNANCE.map((g) => g.k + " " + g.v),
    ].join(" ").toLowerCase();

    for (const term of FORBIDDEN) {
      /*
       * "\\b", not "\b". Inside a template literal "\b" is the BACKSPACE
       * escape, U+0008 — so the pattern compiled to U+0008 followed by
       * the term and could never match. It passed on every run without
       * ever reading the copy. A test that cannot fail is not a test,
       * and this one guarded a constitutional rule.
       */
      expect(all, `contains "${term}"`).not.toMatch(new RegExp(`\\b${term}`));
    }
  });

  it("would catch a forbidden term if one appeared", () => {
    /* Proves the regex above actually matches, now that it is correct. */
    for (const term of FORBIDDEN) {
      expect(`a ${term} appears here`).toMatch(new RegExp(`\\b${term}`));
    }
  });
});
