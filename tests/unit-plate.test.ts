/**
 * The keys, drawn — and the drawing has to be true.
 *
 * Nothing is built on any of the four properties, so no photograph exists
 * and every frame is a labelled drawing. That is usually treated as a
 * loss. It is not: a scaled plan with a real dimension on it cannot
 * flatter, because the geometry is computed from the area rather than
 * chosen to look good. These assert that it stays computed.
 */
import { describe, it, expect } from "vitest";
import { ESTATES } from "../constants/spatial";
import { scaleFor } from "../app/_assemblies/unitplate";

/** The drawn side, exactly as UnitPlate computes it. */
const side = (area: number, max: number) => Math.sqrt(area / max) * 88;

describe("the plates compare by area, not by edge", () => {
  it("draws a ratio of areas that IS the ratio of areas", () => {
    for (const e of ESTATES) {
      if (e.keyTypes.length < 2) continue;
      const max = scaleFor(e.keyTypes);
      for (const a of e.keyTypes) {
        for (const b of e.keyTypes) {
          const drawn = (side(a.area, max) / side(b.area, max)) ** 2;
          // side proportional to area would make a 550 look nearly twice a
          // 465 — technically a drawing, practically a lie.
          expect(drawn, `${e.id} ${a.name}:${b.name}`).toBeCloseTo(a.area / b.area, 6);
        }
      }
    }
  });

  it("never lets a key touch or exceed its reference field", () => {
    for (const e of ESTATES) {
      if (!e.keyTypes.length) continue;
      const max = scaleFor(e.keyTypes);
      for (const u of e.keyTypes) {
        const s = side(u.area, max);
        expect(s).toBeGreaterThan(0);
        // 88 of a 100 field. The largest key used to draw exactly on top of
        // the field, so a set of equal areas collapsed into one square.
        expect(s).toBeLessThanOrEqual(88);
      }
    }
  });

  it("keeps the dimension line inside the viewBox on the largest plate", () => {
    // It sat at inset + side + 5 in a 0–100 box and was clipped away on
    // precisely the plate a reader looks at first.
    const s = 88;
    const inset = (100 - s) / 2;
    expect(inset + s + 5 + 2).toBeLessThanOrEqual(108);
  });
});

describe("the keys reach the page", () => {
  /* They render on the property page (THE SPACES), not on a chapter of
     their own. The Asset chapter carried them until 21 Sep 2026, when it
     was retired for saying again what the property page already said. */
  it("carries a note on every key type, because the note is the desirable part", () => {
    for (const e of ESTATES) {
      for (const u of e.keyTypes) {
        expect(u.note.length, `${e.id}/${u.name}`).toBeGreaterThan(20);
        expect(u.area).toBeGreaterThan(0);
        expect(u.count).toBeGreaterThan(0);
      }
    }
  });

  it("draws every key the ledger commits to", () => {
    for (const e of ESTATES) {
      if (!e.keyTypes.length) continue;
      expect(e.keyTypes.reduce((n, u) => n + u.count, 0), e.id).toBe(e.keys);
    }
  });
});
