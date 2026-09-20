/**
 * The logo system, asserted.
 *
 * These exist because the mark was ratified in prose and rendered four
 * different ways. The arithmetic tests are the ones that matter: BR-02's
 * clearspace is only a rule if it is computable, and it is only computable
 * because CAP_RATIO is a measurement.
 */
import { describe, it, expect } from "vitest";
import {
  BRAND_LAWS, CAP_RATIO, COPPER_EXCEPTION, DEVICE_RATIO, FORBIDDEN_MARK_FACES,
  MARKS, MARK_COLOUR, MARK_WEIGHT, MIN_CAP_PX, MIN_FONT_PX, MISUSE,
  clearspacePx, devicePx,
} from "../constants/brand-system";
import { BRAND } from "../constants/tokens-addendum";
import { COLOUR, RADIUS } from "../constants/tokens";

describe("the mark implements the ratified spec", () => {
  it("is set at the weight BR-01 states", () => {
    expect(MARK_WEIGHT).toBe(200);
    expect(BRAND.wordmark.spec).toContain("Outfit 200");
  });

  it("keeps the trailing period as the brand device, and only there", () => {
    expect(BRAND.wordmark.rule).toContain("only place a full stop");
    expect(COPPER_EXCEPTION).toContain("only place a full stop");
  });

  it("declares exactly three marks, each with a floor and an authority", () => {
    expect(MARKS).toHaveLength(3);
    for (const m of MARKS) {
      expect(m.floor.length).toBeGreaterThan(0);
      expect(m.authority).toMatch(/BR-0\d/);
      expect(m.use.length).toBeGreaterThan(0);
      expect(m.never.length).toBeGreaterThan(0);
    }
  });
});

describe("BR-02 clearspace is arithmetic, not a wish", () => {
  it("derives the floor from the measured cap-height", () => {
    // 20px cap-height / 0.676 = 29.59 -> 29.6
    expect(MIN_FONT_PX).toBe(29.6);
    expect(MIN_FONT_PX * CAP_RATIO).toBeGreaterThanOrEqual(MIN_CAP_PX);
  });

  it("uses Outfit's own cap-height, not a guess", () => {
    // OS/2.sCapHeight 676 over head.unitsPerEm 1000, read from the shipped woff2
    expect(CAP_RATIO).toBeCloseTo(676 / 1000, 5);
  });

  it("gives clearspace equal to the cap-height of the G", () => {
    expect(clearspacePx(100)).toBe(68); // 0.676 * 100, rounded
    expect(clearspacePx(MIN_FONT_PX)).toBe(MIN_CAP_PX);
  });

  it("never lets the device round to nothing at the floor", () => {
    expect(devicePx(MIN_FONT_PX)).toBeGreaterThanOrEqual(2);
    expect(devicePx(8)).toBeGreaterThanOrEqual(2);
    expect(devicePx(200)).toBe(Math.round(200 * CAP_RATIO * DEVICE_RATIO));
  });
});

describe("the mark obeys the rest of the system", () => {
  it("is square, because RADIUS.none is invariant", () => {
    expect(RADIUS.none).toBe("0px");
    expect(MISUSE.map((m) => m.wrong)).toContain("A round device.");
  });

  it("takes copper on void and the AA-clearing copper on paper", () => {
    expect(MARK_COLOUR.onVoid.device).toBe(COLOUR.copper);
    expect(MARK_COLOUR.onPaper.device).toBe(COLOUR.copperDeep);
    expect(MARK_COLOUR.onVoid.type).toBe(COLOUR.inkInverse);
    expect(MARK_COLOUR.onPaper.type).toBe(COLOUR.ink);
  });

  it("bars the faces that actually shipped on the mark", () => {
    expect(FORBIDDEN_MARK_FACES).toContain("Georgia");
  });
});

describe("every recorded misuse says why", () => {
  it("has a reason on each one", () => {
    expect(MISUSE.length).toBeGreaterThanOrEqual(6);
    for (const m of MISUSE) {
      expect(m.id).toMatch(/^MIS-\d{2}$/);
      expect(m.why.length).toBeGreaterThan(20);
    }
  });

  it("admits there is no drawn logotype", () => {
    expect(BRAND_LAWS.derivedNotDrawn).toContain("no drawn logotype");
  });
});
