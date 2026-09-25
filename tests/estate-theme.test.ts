/**
 * Each estate in its own colours. 25 Sep 2026 (render.ts PROP, site.css .est).
 * The page is wrapped in its film's palette, so the theme can never drift
 * from the landscape it is drawn with, and its chapters are counted.
 */
import { describe, it, expect } from "vitest";
import { PROP } from "../app/_assemblies/site/render";
import { ESTATES } from "../content/site/estates";
import { read, vehicleOf } from "../app/_assemblies/site/registry";
import { SITE } from "../constants/tokens";

describe("an estate page", () => {
  for (const E of Object.values(ESTATES)) {
    const v = vehicleOf(E.vehicleKey);
    const h = PROP(E, v ? read(v) : undefined, "");
    it(`${E.name} wears its own palette`, () => expect(h.startsWith(`<div class="est" data-pal="${E.pal}">`)).toBe(true));
    it(`${E.name} counts its chapters`, () => {
      const n = String(E.chapters.length).padStart(2, "0");
      expect(h).toContain(`01 / ${n}`);
    });
  }
  it("has a night for the coast estates, taken from the coast film's own ground", () => expect(SITE.tide).toBe("#101C22"));
});
