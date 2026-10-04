/**
 * AN ESTATE'S OWN PICTURES — 2 Oct 2026
 *
 * SlowSpace Creek is the first estate to show illustrations of its own in
 * place of drawn films. Three things have to agree, and each can drift
 * alone: the names a page refers to (content), the list that describes
 * them (content/site/media.ts), and the files that are served
 * (public/images/site, cut by scripts/gen-site-media.js). A name that
 * resolves to nothing throws at render, so it is caught here first.
 */

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { MEDIA, plateOf } from "../content/site/media";
import { ESTATES } from "../content/site/estates";
import { COLLECTION } from "../content/site/home";
import { plate } from "../app/_assemblies/site/render";

const ROOT = path.resolve(__dirname, "..");
const file = (estate: string, name: string, w: number) => path.join(ROOT, "public", "images", "site", estate, `${name}-${w}.webp`);

/** Every "<estate>/<name>" a page asks for, wherever in the content it sits. */
function refs(x: unknown, out: string[] = []): string[] {
  if (typeof x === "string") { if (/^[a-z]+\/[a-z][a-z-]*$/.test(x)) out.push(x); }
  else if (Array.isArray(x)) x.forEach((y) => refs(y, out));
  else if (x && typeof x === "object") Object.values(x).forEach((y) => refs(y, out));
  return out;
}

describe("an estate's own pictures", () => {
  it("serves both widths of every picture it lists, at a weight a page can carry", () => {
    let total = 0;
    for (const [estate, plates] of Object.entries(MEDIA)) {
      for (const [name, p] of Object.entries(plates)) {
        for (const w of [p.w, p.small]) {
          const f = file(estate, name, w);
          expect(fs.existsSync(f), `${estate}/${name}-${w}.webp`).toBe(true);
          const size = fs.statSync(f).size;
          expect(size, `${estate}/${name}-${w}.webp`).toBeLessThan(450 * 1024);
          total += size;
        }
      }
      /* per estate: a second estate with pictures is not a reason to starve the first */
      expect(total, estate).toBeLessThan(8 * 1024 * 1024);
      total = 0;
    }
  });

  it("lists every file that is served, and cuts every picture it lists", () => {
    const script = fs.readFileSync(path.join(ROOT, "scripts", "gen-site-media.js"), "utf8");
    expect(Object.keys(MEDIA).length).toBeGreaterThanOrEqual(2);
    for (const estate of Object.keys(MEDIA)) {
      /* the script's own map for this estate: const CREEK = { ... }; */
      const block = script.match(new RegExp(`const ${estate.toUpperCase()} = \\{([\\s\\S]*?)\\n\\};`));
      expect(block, `gen-site-media.js has no map for ${estate}`).not.toBeNull();
      const cut = [...block![1].matchAll(/^\s+"([a-z][a-z-]*)": \["/gm)].map((m) => m[1]).sort();
      expect(cut, estate).toEqual(Object.keys(MEDIA[estate]).sort());
      const served = new Set(fs.readdirSync(path.join(ROOT, "public", "images", "site", estate)).map((f) => f.replace(/-\d+\.webp$/, "")));
      expect([...served].sort(), estate).toEqual(Object.keys(MEDIA[estate]).sort());
    }
  });

  it("resolves every picture a page asks for", () => {
    const asked = [...refs(ESTATES), ...refs(COLLECTION)];
    expect(asked.length).toBeGreaterThan(20);
    for (const r of asked) expect(plateOf(r), r).toBeDefined();
    expect(() => plate("creek/no-such-picture")).toThrow(/no such picture/);
  });

  it("says, on the picture and in its words, that it is an illustration of something unbuilt", () => {
    const html = plate("creek/hero", { eager: true, tall: "creek/hero-tall", tag: "tl" });
    expect(html).toContain('alt="Illustration, unbuilt: ');
    expect(html).toContain("Illustration · unbuilt");
    expect(html).toMatch(/width="1800" height="1013"/);          // the page does not jump as it loads
    expect(html).toContain('<source media="(max-width: 700px)"'); // a portrait cut for a narrow screen
    expect(html).toContain('loading="eager"');
    expect(plate("creek/lake")).toContain('loading="lazy"');
  });

  it("describes what is drawn in the platform's own words", () => {
    for (const plates of Object.values(MEDIA)) {
      for (const p of Object.values(plates)) {
        expect(p.alt.length).toBeGreaterThan(12);
        expect(p.alt).not.toMatch(/photo/i);
      }
    }
  });
});
