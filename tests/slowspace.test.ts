/**
 * SlowSpace Coastal LLP — the worked offering
 *
 * Wave 7 · from the Seaside Confluence dossier (Padubidri)
 */

import { describe, it, expect } from "vitest";
import {
  LLP, SITE, STACK, EQUITY, PROJECT, UNIT, GROSS_REVENUE, DEBT_SERVICE,
  WATERFALL_SLOWSPACE, MY_DISTRIBUTION, MY_YIELD_BPS, DSCR, RISKS_SLOWSPACE,
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
    expect(DSCR).toBeCloseTo(1.95, 1);
    expect(DSCR).not.toBeCloseTo(2.4, 1);
  });

  it("still clears the institutional norm", () => {
    expect(DSCR).toBeGreaterThan(1.5);
  });
});

describe("the risk disclosure", () => {
  it("leads with total loss and an unbuilt asset", () => {
    expect(RISKS_SLOWSPACE[0].sev).toBe(1);
    expect(RISKS_SLOWSPACE[0].t).toContain("lose");
    expect(RISKS_SLOWSPACE[0].p).toContain("does not exist yet");
    expect(RISKS_SLOWSPACE[1].t).toContain("unbuilt");
  });

  it("reads commercial terms from the vehicle record, not the prose", () => {
    // A disclosure that restates terms in prose drifts from the
    // instrument it describes, and the prose is what people rely on.
    for (const r of RISKS_SLOWSPACE) {
      for (const t of r.terms ?? []) expect(RISK_TERMS[t], t).toBeDefined();
    }
    expect(RISK_TERMS.debt).toContain("5,50,00,000");
  });

  it("discloses its own inconsistency rather than hiding it", () => {
    const r = RISKS_SLOWSPACE.find((x) => x.p.includes("2.4x"))!;
    expect(r).toBeDefined();
    expect(r.p).toContain("cannot");
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
