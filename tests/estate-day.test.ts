/**
 * A PICTURE ESTATE WEARS THE DAY — 2 Oct 2026
 *
 * An estate with illustrations of its own is set on paper, not on night
 * (render.ts PROP and TXT, site.css .est-day and .tx-pic). The pairings
 * that makes are new: the estate's deep colour as ink, its accent on its
 * own paper, grey text on a tinted ground. Each is measured here from the
 * token values, for every palette and not only the one in use, so the next
 * estate to get pictures has its page proven before it is drawn.
 *
 * The palettes are read from the stylesheet, never restated: a palette
 * changed there is measured here on the next run.
 */

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { COLOUR, SITE } from "../constants/tokens";
import { PROP, TXT } from "../app/_assemblies/site/render";
import { ESTATES } from "../content/site/estates";
import { read, vehicleOf } from "../app/_assemblies/site/registry";
import type { SitePage } from "../app/_assemblies/site/types";

const CSS = fs.readFileSync(path.resolve(__dirname, "..", "app", "_assemblies", "site.css"), "utf8");
const DAY = CSS.slice(CSS.indexOf("A PICTURE ESTATE WEARS THE DAY"));

/** `--gc-s-ash-2` is SITE.ash2; `--gc-paper-panel` is COLOUR.paperPanel. */
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
function hex(token: string): string {
  const site = token.match(/^--gc-s-(.+)$/);
  const v = site ? (SITE as Record<string, string>)[camel(site[1])] : (COLOUR as Record<string, string>)[camel(token.replace(/^--gc-/, ""))];
  if (!v || !/^#[0-9A-F]{6}$/i.test(v)) throw new Error(`no solid colour for ${token}`);
  return v;
}
const lum = (h: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/** The three roles of each palette, as site.css states them. */
function palettes(): Record<string, { acc: string; deep: string; paper: string }> {
  const out: Record<string, { acc: string; deep: string; paper: string }> = {};
  const base: Record<string, string> = {};
  for (const m of CSS.matchAll(/\.site :is\(\.est,\.tx-pic\)([^{]*)\{([^}]*)\}/g)) {
    const roles = Object.fromEntries([...m[2].matchAll(/--est-(acc|deep|paper):var\((--gc-[a-z0-9-]+)\)/g)].map((r) => [r[1], r[2]]));
    const keys = [...m[1].matchAll(/data-pal=([a-z]+)/g)].map((k) => k[1]);
    if (!keys.length) Object.assign(base, roles);
    for (const k of keys) out[k] = { ...(base as { acc: string; deep: string; paper: string }), ...roles };
  }
  out.default = base as { acc: string; deep: string; paper: string };
  return out;
}

const AA = 4.5, LARGE = 3;
const light = hex("--gc-s-light"), panel = hex("--gc-paper-panel"), chip = hex("--gc-s-chip");

describe("the day palette", () => {
  const P = palettes();
  it("is read from the stylesheet for every palette the films use", () => {
    expect(Object.keys(P).sort()).toEqual(["cff", "coast", "creek", "default", "nine", "wild"]);
  });
  for (const [name, p] of Object.entries(P)) {
    const acc = hex(p.acc), deep = hex(p.deep), paper = hex(p.paper);
    describe(name, () => {
      it("sets its deep colour as ink on every paper", () => {
        for (const g of [light, paper, panel, chip]) expect(ratio(deep, g)).toBeGreaterThanOrEqual(AA);
      });
      it("keeps grey text readable on its own paper", () => {
        for (const t of ["--gc-s-stone", "--gc-s-ash"]) for (const g of [light, paper, panel]) expect(ratio(hex(t), g)).toBeGreaterThanOrEqual(AA);
      });
      it("carries paper text on its accent, for the chips", () => expect(ratio(panel, acc)).toBeGreaterThanOrEqual(AA));
      it("uses its accent on paper only where the type is large or it is a rule", () => {
        for (const g of [light, paper, panel]) expect(ratio(acc, g)).toBeGreaterThanOrEqual(LARGE);
      });
      it("carries the ledger's text on its deep colour", () => {
        for (const t of ["--gc-paper", "--gc-s-rule", "--gc-s-fog", "--gc-s-mute"]) expect(ratio(hex(t), deep)).toBeGreaterThanOrEqual(AA);
      });
    });
  }
});

describe("the day stylesheet", () => {
  it("never sets small text in the accent, nor in a grey too light for paper", () => {
    expect(DAY).not.toMatch(/[;{]color:var\(--est-acc/);
    expect(DAY).not.toMatch(/[;{]color:var\(--gc-s-(ash-2|mute)\)/);
  });
  it("lays no gradient under or over a picture", () => expect(DAY).not.toContain("gradient("));
  it("measures every ground and text one rule states together, in every palette", () => {
    /* On a day page the ink is the estate's deep colour (--ink), and the
       three roles are the palette's; everything else is a fixed token. */
    const pairs = [...DAY.matchAll(/\{([^}]*)\}/g)].map((m) => [
      m[1].match(/(?:^|;)background:var\((--[a-z0-9-]+)/)?.[1], m[1].match(/(?:^|;)color:var\((--[a-z0-9-]+)/)?.[1],
    ]).filter((x): x is [string, string] => !!x[0] && !!x[1]);
    expect(pairs.length).toBeGreaterThan(8);
    for (const [name, p] of Object.entries(palettes())) {
      const at = (t: string) => hex(t === "--ink" || t === "--est-deep" ? p.deep : t === "--est-paper" ? p.paper : t === "--est-acc" ? p.acc : t === "--paper" ? "--gc-paper" : t);
      for (const [bg, fg] of pairs) expect(ratio(at(fg), at(bg)), `${name}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(AA);
    }
  });
});

describe("the page of an estate with pictures", () => {
  const withPictures = Object.values(ESTATES).filter((E) => E.media);
  it("there is at least one", () => expect(withPictures.length).toBeGreaterThan(0));
  for (const E of Object.values(ESTATES)) {
    const v = vehicleOf(E.vehicleKey);
    const h = PROP(E, v ? read(v) : undefined, "");
    if (!E.media) {
      it(`${E.key} has none, and is rendered as before`, () => {
        expect(h).not.toContain("est-day");
        expect(h).not.toContain("phero-pic");
        expect(h).toContain('<div class="strip"><div class="strip-l">');
      });
      continue;
    }
    it(`${E.key} wears the day`, () => expect(h.startsWith(`<div class="est est-day" data-pal="${E.pal}">`)).toBe(true));
    it(`${E.key} lays no paragraph over a picture`, () => {
      /* The film layout sets the place's title and text in boxes on the
         canvas; a picture is shown whole, with the words beneath it. */
      expect(h).not.toMatch(/<div class="(tag|side)">/);
      expect(h).toContain('<figure class="chap-pic">');
      expect(h).toContain('<div class="phero-pic">');
    });
    it(`${E.key} says what each picture is`, () => {
      const pictures = (h.match(/class="film-img"/g) || []).length, said = (h.match(/alt="Illustration, unbuilt: /g) || []).length;
      expect(pictures).toBeGreaterThan(0);
      expect(said).toBe(pictures);
    });
  }
});

describe("a text page with a picture", () => {
  const P: SitePage = { key: "t", path: "/t", eyebrow: "E", title: "T", film: ["creek", 18], img: "creek/lake", blocks: [{ p: "x" }] };
  const h = TXT(P);
  it("is set on its estate's paper, with the picture standing alone", () => {
    expect(h).toContain('<section class="tx-hero lt tx-pic" data-pal="creek">');
    expect(h).toContain('<article class="tx-body lt tx-pic" data-pal="creek">');
  });
  it("is unchanged where there is no picture", () => {
    const plain = TXT({ ...P, img: undefined });
    expect(plain).toContain('<section class="tx-hero">');
    expect(plain).not.toContain("tx-pic");
  });
});
