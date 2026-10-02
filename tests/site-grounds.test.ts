/**
 * THE GREYS FOLLOW THE GROUND — 2 Oct 2026
 *
 * The site sets its eyebrows, labels and meta in one grey (--mute) and draws
 * its rules in another (--line). Both are the night's unless a ground says
 * otherwise, and the night's grey does not carry small text on paper: 3.02:1
 * on the light ground, 2.78:1 on manila, where text this size needs 4.5:1.
 *
 * It was found on the rendered pages, not in the stylesheet. The stylesheet
 * looked right: each paper section of the home page and of an estate restated
 * the greys. The wrappers of the light text pages were simply not on that
 * list, so the press kit, the legal documents and the Journal's index drew
 * their labels in the night's grey. The same finding, and the same remedy,
 * as NEUTRAL_ROLE in constants/tokens.ts: the ground fixes the value once,
 * and nothing set on it has to know which ground that is.
 *
 * So this reads the stylesheet for the grounds themselves, and measures the
 * greys from the token values, never from a number typed here.
 */

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { COLOUR, SITE } from "../constants/tokens";
import { TXT } from "../app/_assemblies/site/render";
import type { FormSpec, SitePage } from "../app/_assemblies/site/types";

const CSS = fs.readFileSync(path.resolve(__dirname, "..", "app", "_assemblies", "site.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Each rule as its selectors and its declarations. A comma inside :is() does not begin a new selector. */
const RULES = [...CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sels: m[1].split(/,(?![^()]*\))/).map((s) => s.trim()), body: m[2] }));
/** Everything the stylesheet declares for exactly this selector, across all of its rules. */
const decls = (sel: string) => RULES.filter((r) => r.sels.includes(sel)).map((r) => r.body).join(";");

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

const AA = 4.5;
const DAY = ["--mute:var(--gc-s-ash)", "--line:var(--gc-hairline)"] as const;
const NIGHT = ["--mute:var(--gc-s-mute)", "--line:var(--gc-s-line)"] as const;

/* The grounds a label can be set on. White is here because a clause, a
   boilerplate box and a way on from a lost page are all white cards. */
const PAPERS = ["--gc-s-light", "--gc-s-manila", "--gc-s-kraft", "--gc-s-sage", "--gc-s-haze", "--gc-s-clay", "--gc-paper-panel"];
const NIGHTS = ["--gc-s-night", "--gc-s-coal", "--gc-s-rim", "--gc-s-panel", "--gc-s-umber", "--gc-s-pine", "--gc-s-tide", "--gc-ink"];

describe("the two greys, measured", () => {
  const ash = hex("--gc-s-ash"), mute = hex("--gc-s-mute");
  for (const p of PAPERS) {
    it(`the day's grey carries small text on ${p}`, () => expect(ratio(ash, hex(p))).toBeGreaterThanOrEqual(AA));
    /* Pinned so the remap is not taken for decoration: if this ever passes, the night's grey has changed and the grounds below can be thought about again. */
    it(`the night's grey does not carry it on ${p}`, () => expect(ratio(mute, hex(p))).toBeLessThan(AA));
  }
  for (const n of NIGHTS) it(`the night's grey carries small text on ${n}`, () => expect(ratio(mute, hex(n))).toBeGreaterThanOrEqual(AA));
});

describe("a light ground restates the greys in the rule that paints it", () => {
  /* The page that is light all the way down, the three wrappers of a light
     text page, the sign-in panel, the form card, an estate that wears the
     day and a text page with its picture; and the one paper card that sits
     on a night film inside such an estate. */
  const GROUNDS = [
    ".site .pg-col", ".site .tx-hero.lt", ".site .tx-body.lt", ".site .tx-split.lt", ".site .idn-panel",
    ".site .tx-formcard", ".site .est.est-day", ".site .tx-pic", ".site .est.est-day .mk .cap",
  ];
  for (const g of GROUNDS) it(g, () => { for (const d of DAY) expect(decls(g), `${g} should declare ${d}`).toContain(d); });

  /* Read from the template, so a wrapper it gains is a wrapper this asks about. */
  const page: SitePage = { key: "t", path: "/t", light: 1, eyebrow: "E", title: "T", blocks: [{ p: "x" }] };
  const form: FormSpec = { id: "f", addr: "a@b.co", fields: [["Email", "email"]], submit: "Send", ok: "ok", note: "n" };
  const html = TXT(page) + TXT({ ...page, blocks: [{ rows: [["a", "b"]] }, { form }, { p: "after" }] });
  const wrappers = [...new Set([...html.matchAll(/class="([a-z-]+) lt"/g)].map((m) => m[1]))].sort();
  it("which are the wrappers the text template gives a light page", () => {
    expect(wrappers).toEqual(["tx-body", "tx-hero", "tx-split"]);
    for (const w of wrappers) expect(GROUNDS).toContain(`.site .${w}.lt`);
  });
});

describe("a night panel set inside a light ground restates the night's", () => {
  /* Each of these paints a night ground and can stand on paper: the film at
     the foot of the collection, the ink half of its three differences, an
     assertion and a legal assertion on a light page, a person's card, the
     deposit's terms inside the form card, the next step, a quotation and a
     drawing in the Journal, a materials card, the three chassis on sage, the
     ledger of an estate that wears the day, and a download under the pointer. */
  const PANELS = [
    ".site .mk", ".site .ben .l", ".site .lt .tx-assert", ".site .lt .tx-legal-assert", ".site .person", ".site .dep-terms",
    ".site .nxt a", ".site .tx-inspire", ".site .ig", ".site .cgr div", ".site .makers .trio figure", ".site .est.est-day .fin",
    ".site .tx-asset:hover",
  ];
  for (const p of PANELS) it(p, () => { for (const d of NIGHT) expect(decls(p), `${p} should declare ${d}`).toContain(d); });
});

describe("the stylesheet as a whole", () => {
  it("never restates one grey without the other, nor mixes two grounds in one rule", () => {
    const restating = RULES.filter((r) => /(^|;)--(mute|line):/.test(r.body));
    /* The site's own rule and the grounds above; fewer than that and the stylesheet was not read. */
    expect(restating.length).toBeGreaterThan(10);
    for (const r of restating) {
      const day = DAY.every((d) => r.body.includes(d)), night = NIGHT.every((d) => r.body.includes(d));
      expect(day !== night, `${r.sels.join(", ")} should state both greys, for one ground`).toBe(true);
    }
  });
  it("sets no label in the night's grey by name, except where the ground is always night", () => {
    /* A label takes var(--mute), and its ground decides. These three sit in
       the bar and in the gallery's full-screen viewer, which are night on
       every page. A fourth belongs here only if the same is true of it. */
    const named = RULES.filter((r) => /(^|;)color:var\(--gc-s-mute\)/.test(r.body)).flatMap((r) => r.sels).sort();
    expect(named).toEqual([".site .gal-f figcaption .mono", ".site .gal-x .mono", ".site .nav-path-l"]);
  });
});
