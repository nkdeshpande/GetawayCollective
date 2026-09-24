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
  MARKS, MARK_COLOUR, MARK_PATH, MARK_WEIGHT, MARK_WEIGHT_THIN, MIN_CAP_PX, MIN_FONT_PX, MISUSE,
  clearspacePx, devicePx,
} from "../constants/brand-system";
import { BRAND } from "../constants/tokens-addendum";
import { COLOUR, RADIUS } from "../constants/tokens";

describe("the mark implements the ratified spec", () => {
  /* Amended 24 Sep 2026 (L1-01 §29-0b): the drawn mark replaced the set
     type, exactly as BRAND_LAWS said it would. GETAWAY at 800 over
     COLLECTIVE at 100; the device is the copper skylight in the mark. */
  it("is set at the weights BR-01 states, as amended", () => {
    expect(MARK_WEIGHT).toBe(800);
    expect(MARK_WEIGHT_THIN).toBe(100);
    expect(BRAND.wordmark.spec).toContain("Inter Tight 800");
    expect(BRAND.wordmark.spec).toContain("Inter Tight 100");
  });

  it("keeps copper for the skylight, and only there", () => {
    expect(BRAND.wordmark.rule).toContain("only place copper carries the brand");
    expect(COPPER_EXCEPTION).toContain("only place copper carries the brand");
  });

  it("draws every point of the mark on the 11-unit module", () => {
    const pts = [...MARK_PATH.matchAll(/(\d+)/g)].map((m) => Number(m[1]));
    expect(pts.length).toBeGreaterThan(0);
    for (const p of pts) expect((p - 6) % 11).toBe(0);
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
    // 20px cap-height / 0.727 = 27.51 -> 27.6
    expect(MIN_FONT_PX).toBe(27.6);
    expect(MIN_FONT_PX * CAP_RATIO).toBeGreaterThanOrEqual(MIN_CAP_PX);
  });

  it("uses Inter's own cap-height, not a guess", () => {
    // sCapHeight 2048 over unitsPerEm 2816 in the Inter master Inter Tight is cut from
    expect(CAP_RATIO).toBeCloseTo(2048 / 2816, 3);
  });

  it("gives clearspace equal to the cap-height of the G", () => {
    expect(clearspacePx(100)).toBe(73); // 0.727 * 100, rounded
    expect(clearspacePx(MIN_FONT_PX)).toBe(MIN_CAP_PX);
  });

  it("never lets the device round to nothing at the floor", () => {
    expect(devicePx(MIN_FONT_PX)).toBeGreaterThanOrEqual(2);
    expect(devicePx(8)).toBeGreaterThanOrEqual(2);
    expect(devicePx(200)).toBe(Math.round(200 * CAP_RATIO * DEVICE_RATIO));
  });
});

describe("the mark obeys the rest of the system", () => {
  it("is chamfered, never rounded, because RADIUS.none is invariant", () => {
    expect(RADIUS.none).toBe("0px");
    expect(MISUSE.map((m) => m.wrong)).toContain("A rounded corner on the mark.");
  });

  it("takes copper on void and the AA-clearing copper on paper", () => {
    expect(MARK_COLOUR.onVoid.device).toBe(COLOUR.copper);
    expect(MARK_COLOUR.onPaper.device).toBe(COLOUR.copperDeep);
    expect(MARK_COLOUR.onVoid.type).toBe(COLOUR.inkInverse);
    expect(MARK_COLOUR.onPaper.type).toBe(COLOUR.ink);
  });

  it("bars the faces that actually shipped on the mark", () => {
    expect(FORBIDDEN_MARK_FACES).toContain("Georgia");
    expect(FORBIDDEN_MARK_FACES).toContain("Outfit"); // retired 24 Sep 2026
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

  it("records that the logotype is now drawn", () => {
    expect(BRAND_LAWS.drawnNotDerived).toContain("R5");
  });
});
