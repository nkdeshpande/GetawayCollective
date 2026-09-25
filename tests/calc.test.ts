/**
 * The returns calculator, asserted. 25 Sep 2026 (app/_assemblies/site/calc.ts).
 *
 * The arithmetic, and the things it must never say: that an estate's
 * capital is protected, that its value grows, or that it pays before the
 * year its basis names.
 */
import { describe, it, expect } from "vitest";
import { simulate, inr, chartSVG, calcHTML, COMPARE, DEFAULTS, type CalcEstate } from "../app/_assemblies/site/calc";

const CREEK: CalcEstate = {
  key: "coorgcreek", name: "Creek", unitPrice: 1_00_00_000, maxUnits: 4, yieldPct: 12.04, yieldClass: "FORECAST",
  basis: "on offering equity, from year 3 at stabilised occupancy", fromYear: 3, equity: 10_00_00_000,
  poolMin: 300, poolMax: 350, nightly: 12_000, status: "open, raising",
};
const run = (over: Partial<Parameters<typeof simulate>[0]> = {}) =>
  simulate({ estate: CREEK, units: 1, ...DEFAULTS, countNights: true, ...over });

describe("the estate", () => {
  it("pays nothing before the year its basis names", () => {
    const r = run();
    expect(r.estate[1]).toBe(r.amount);
    expect(r.estate[2]).toBe(r.amount);
    expect(r.estate[3]).toBeCloseTo(r.amount * 1.1204, 0);
  });
  it("holds its value flat: no appreciation is invented", () => {
    const r = run({ countNights: false });
    expect(r.estate[10] - r.amount).toBeCloseTo(r.amount * 0.1204 * 8, 0);
  });
  it("shares the night pool by equity", () => {
    expect(run().nightsPerYear).toEqual([30, 35]);
    expect(run({ units: 2 }).nightsPerYear).toEqual([60, 70]);
  });
  it("adds nights only when asked, at the estate's own nightly rate", () => {
    const r = run();
    expect(r.estateWithNights[10] - r.estate[10]).toBe(8 * 32.5 * 12_000);
    expect(run({ countNights: false }).estateWithNights[10]).toBe(r.estate[10]);
  });
});

describe("the other three", () => {
  it("compounds a fixed deposit quarterly", () => expect(run().fd[1]).toBeCloseTo(1_00_00_000 * Math.pow(1.01625, 4), 0));
  it("invests a SIP over twelve months, so year one grows by less than the full rate", () => {
    const r = run();
    expect(r.sip[1]).toBeGreaterThan(r.amount);
    expect(r.sip[1]).toBeLessThan(r.amount * 1.12);
  });
  it("gives an apartment its growth and its rent", () => {
    const r = run({ growth: 0 });
    expect(r.apartment[10]).toBeCloseTo(r.amount * (1 + 0.03 * 10), 0);
  });
});

describe("what it says", () => {
  it("writes rupees in crore and lakh", () => {
    expect(inr(2_28_00_000)).toBe("₹2.28 Cr");
    expect(inr(3_90_000)).toBe("₹3.9 L");
  });
  it("never says an estate's capital is protected", () => {
    const estateCapital = COMPARE[1][1];
    expect(estateCapital).toMatch(/^At risk/);
    expect(JSON.stringify(COMPARE)).not.toMatch(/guarantee|protected/i);
    expect(COMPARE[1][3]).toMatch(/DICGC/);
  });
  it("carries the estate's basis and 'not promised' beside its number", () => {
    const h = calcHTML([CREEK]);
    expect(h).toContain("12.04% a year, forecast, on offering equity, from year 3 at stabilised occupancy. Not promised.");
    expect(h).toContain("Your capital is at risk.");
  });
  it("draws one line per option, and the nights line only when counted", () => {
    expect((chartSVG(run(), true).match(/<polyline/g) ?? []).length).toBe(5);
    expect((chartSVG(run({ countNights: false }), false).match(/<polyline/g) ?? []).length).toBe(4);
  });
  it("renders nothing without an estate whose yield is published", () => expect(calcHTML([])).toBe(""));
});
