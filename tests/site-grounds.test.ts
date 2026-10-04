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
import { PROP, TXT } from "../app/_assemblies/site/render";
import { DOCKET } from "../app/_assemblies/site/docket";
import { read, vehicleOf } from "../app/_assemblies/site/registry";
import { ESTATES } from "../content/site/estates";
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

const AA = 4.5, LARGE = 3;
const DAY =["--mute:var(--gc-s-ash)", "--line:var(--gc-hairline)"] as const;
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
     day and a text page with its picture; the one paper card that sits on a
     night film inside such an estate; and two controls that turn into paper
     on a night page: the way to an estate that has been chosen, and Close in
     the gallery's viewer under the pointer or the keyboard (4 Oct 2026). */
  const GROUNDS = [
    ".site .pg-col", ".site .tx-hero.lt", ".site .tx-body.lt", ".site .tx-split.lt", ".site .idn-panel",
    ".site .tx-formcard", ".site .est.est-day", ".site .tx-pic", ".site .est.est-day .mk .cap",
    ".site .tcards button[aria-pressed=true]", ".site .gal-x:hover", ".site .gal-x:focus-visible",
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
     ledger of an estate that wears the day, a download under the pointer, and
     the chosen way to a day estate, which is its deep colour (4 Oct 2026). */
  const PANELS = [
    ".site .mk", ".site .ben .l", ".site .lt .tx-assert", ".site .lt .tx-legal-assert", ".site .person", ".site .dep-terms",
    ".site .nxt a", ".site .tx-inspire", ".site .ig", ".site .cgr div", ".site .makers .trio figure", ".site .est.est-day .fin",
    ".site .tx-asset:hover", ".site .est.est-day .tcards button[aria-pressed=true]",
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
    /* A label takes var(--mute), and its ground decides. These two sit in
       the bar and under a frame of the gallery's full-screen viewer, which
       are night on every page. A third belongs here only if the same is true
       of it. There were three until 4 Oct 2026: the hint on the viewer's
       Close button was the third, and that button is paper under the pointer
       or the keyboard, where the hint was 2.97:1. */
    const named = RULES.filter((r) => /(^|;)color:var\(--gc-s-mute\)/.test(r.body)).flatMap((r) => r.sels).sort();
    expect(named).toEqual([".site .gal-f figcaption .mono", ".site .nav-path-l"]);
  });
});

/* ── WHAT WAS LEFT — 4 Oct 2026 ─────────────────────────────────────────
 *
 * The greys above took the failing text on the rendered site from 581
 * elements to 149. What was left had other causes, and each is a way for a
 * colour to arrive on a ground it was not chosen for while the stylesheet
 * goes on looking right: a platform rule that reaches the site unnamed, a
 * fade, a card that turns into the other ground, a state colour on a paper
 * darker than the one it was derived for, a rule keyed to the page where the
 * ground had changed. Each is held here at the place it enters, not at the
 * class it was found on.
 */

/** A colour at this opacity over a ground: what a fade actually draws. */
const fade = (fg: string, a: number, bg: string) => "#" + [1, 3, 5].map((i) =>
  Math.round(parseInt(fg.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a)).toString(16).padStart(2, "0")).join("").toUpperCase();
const ROOT = path.resolve(__dirname, "..");
const sheet = (f: string) => fs.readFileSync(path.join(ROOT, "app", f), "utf8").replace(/\r\n/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
const rulesOf = (css: string) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sels: m[1].split(/,(?![^()]*\))/).map((x) => x.trim().replace(/\s+/g, " ")), body: m[2] }));
/** The colour a selector's own rules give it: the last one stated. */
const colourOf = (sel: string) => [...decls(sel).matchAll(/(?:^|;)color:var\((--[a-z0-9-]+)\)/g)].pop()?.[1];

describe("the platform's rules that reach the site without naming it", () => {
  /* scripts/gen-site-reset.js reverts a platform rule made of the site's own
     class names. Two kinds slipped past it, and were found on the rendered
     pages: a rule on an ELEMENT (the platform's dim grey on every th, 2.35:1
     at the head of the comparison on /collection), and a rule on the ROOT'S
     OWN NAME (the platform has a .site too, a map marker filled copper, and
     fill is inherited: every plan label that states no fill was copper,
     2.22:1 on the light panel it is drawn on). They are read here from the
     platform's stylesheets, not restated, so a third is asked about on the
     day it is written. */
  const OWN = ["site.css", "da.css"];
  const names = [...fs.readFileSync(path.join(ROOT, "app", "globals.css"), "utf8").matchAll(/@import url\("\.\/(_assemblies\/[\w.-]+\.css)"\)/g)]
    .map((m) => m[1]).filter((f) => !OWN.some((o) => f.endsWith("/" + o)));
  const platform = [...names, "globals.css"].flatMap((f) => rulesOf(sheet(f)));
  it("is read from every stylesheet the layout imports", () => {
    expect(names.length).toBeGreaterThanOrEqual(15);
    expect(platform.length).toBeGreaterThan(1000);
  });

  /* The colour of type, set on an element that can stand inside the site. A
     value of inherit sets nothing of its own. */
  const onElements = [...new Set(platform.flatMap((r) => r.sels.filter((x) => /^[a-z][a-z0-9]*$/.test(x) && !["html", "body"].includes(x))
    .flatMap((el) => [...r.body.matchAll(/(?:^|;)\s*(color|fill)\s*:\s*([^;]+)/g)].filter((m) => !/^(inherit|currentcolor)$/i.test(m[2].trim())).map((m) => `${el} ${m[1]}`))))].sort();
  const onRoot = [...new Set(platform.filter((r) => r.sels.includes(".site")).flatMap((r) => [...r.body.matchAll(/(?:^|;)\s*([a-z-]+)\s*:/g)].map((m) => m[1])))].sort();
  it("which rules those are", () => {
    expect(onElements).toEqual(["th color"]);
    expect(onRoot).toEqual(["fill"]);
  });
  for (const x of onElements) {
    const [el, prop] = x.split(" ");
    it(`the site takes back the ${prop} of every ${el}`, () => expect(decls(`.site ${el}`)).toContain(`${prop}:revert`));
  }
  for (const prop of onRoot) it(`the site's root takes back its ${prop}`, () => expect(decls(".site")).toContain(`${prop}:revert`));

  it("and no revert weighs more than the rule the site wrote for the same element", () => {
    /* `.site .btn:hover{color:revert}` out-ranked `.site .btn`, and revert
       goes back to the browser, not to the site: under the pointer a plain
       button lost its fill and became link-coloured text, 2.39:1 on a white
       card. A state is written in :where(), which weighs nothing. */
    const raw = fs.readFileSync(path.join(ROOT, "app", "_assemblies", "site.css"), "utf8").replace(/\r\n/g, "\n");
    const block = raw.slice(raw.indexOf("GENERATED RESET"), raw.indexOf("END GENERATED RESET"));
    const sels = [...block.matchAll(/^([^{\n]+)\{[^}]*\}$/gm)].map((m) => m[1]);
    expect(sels.length).toBeGreaterThan(10);
    const states = sels.filter((x) => /:/.test(x));
    expect(states).toEqual([".site .btn:where(:hover)"]);
    for (const x of states) expect(x.replace(/:where\(:[\w-]+(\([^)]*\))?\)/g, "").replace(/::?(before|after|first-letter|first-line)/g, "")).not.toContain(":");
    /* so the button's own fill and ink, stated after the reset, hold under the pointer */
    expect(raw.indexOf(".site .btn{--c:7px")).toBeGreaterThan(raw.indexOf("END GENERATED RESET"));
    expect(decls(".site .btn")).toContain("background:var(--paper);color:var(--ink)");
  });

  it("so the head of the comparison is the ground's ink, and the estate not yet open its column's stone", () => {
    /* The comparison stands in .cmp, a paper section: manila, the light
       ground under every other row, and white under the estate raising. */
    expect(decls(".site .cmp-t :is(th,td).g-later")).toContain("color:var(--gc-s-stone)");
    for (const g of ["--gc-s-manila", "--gc-s-light", "--gc-paper-panel"]) {
      expect(ratio(hex("--gc-ink"), hex(g))).toBeGreaterThanOrEqual(AA);
      expect(ratio(hex("--gc-s-stone"), hex(g))).toBeGreaterThanOrEqual(AA);
    }
  });

  it("and the platform's skip link keeps its own ink on its own paper", () => {
    /* It is the platform's on purpose: a paper tile with ink on it. `.site a`
       takes every link's colour from the page, which left this one paper on
       paper, 1:1, with the keyboard on it, on every page of the site. */
    const skip = platform.filter((r) => r.sels.includes(".skip")).map((r) => r.body).join(";");
    expect(skip).toMatch(/background:var\(--gc-paper\)/);
    expect(decls(".site a")).toContain("color:inherit");
    expect(decls(".site .skip")).toContain("color:var(--gc-ink)");
    expect(ratio(hex("--gc-ink"), hex("--gc-paper"))).toBeGreaterThanOrEqual(AA);
  });
});

describe("type is greyed by its ground's grey, never by fading it", () => {
  /* opacity greys a word by an amount no token states and no linter can
     measure, and what it draws depends on the ground: the path marker's
     label was 4.28:1, a place name 4.46:1 on a white card, the last rungs of
     a ladder 3.31:1, a caption beside the frame on show 1.73:1, a zone not
     selected 2.6:1. So every fade in the stylesheet is named here, with what
     it fades. One that fades type is measured, through the fade, on every
     ground it can stand on. */
  const faded = RULES.filter((r) => { const o = r.body.match(/(?:^|;)opacity:([^;]+)/)?.[1].trim(); return o !== undefined && o !== "0" && o !== "1"; });
  const NOT_TYPE: Readonly<Record<string, string>> = {
    ".site .gal-f": "a frame beside the one on show, which is a picture only (below)",
    ".site .nav-path-bar": "the ticks of the path marker",
    ".site .zl button[aria-pressed=false] i": "the swatch of a zone not selected",
    ".site .tx-split>.tx-film": "a film",
    ".site .tx-form button[disabled]": "a control that cannot be pressed",
    ".site .subtabs button:disabled": "a control that cannot be pressed",
    ".site .nav": "the bar as it leaves the screen on a phone; whole at rest, in focus and with its menu open",
  };
  /* [selector, the fade, the pairs of ink and ground it is drawn in]. */
  const deeps = [...new Set([...CSS.matchAll(/--est-deep:var\((--gc-[a-z0-9-]+)\)/g)].map((m) => m[1]))];
  const TYPE: readonly (readonly [string, number, readonly (readonly [string, string])[]])[] = [
    [".site .foot .cols a", 0.72, [["--gc-paper", "--gc-s-night"]]],
    /* A way to an estate: the night card and the paper one it turns into;
       and on a day estate the white card and the deep one. */
    [".site .tcards span", 0.75, [["--gc-paper", "--gc-s-panel"], ["--gc-ink", "--gc-paper"],
      ...deeps.flatMap((d): [string, string][] => [[d, "--gc-paper-panel"], ["--gc-paper", d]])]],
  ];
  it("every fade is one of these", () => {
    expect(faded.length).toBeGreaterThan(5);
    expect(faded.flatMap((r) => r.sels).sort()).toEqual([...Object.keys(NOT_TYPE), ...TYPE.map((t) => t[0])].sort());
  });
  it("a day estate has more than one deep colour to measure", () => expect(deeps.length).toBeGreaterThan(1));
  for (const [sel, a, pairs] of TYPE) it(`${sel} still reads through its fade`, () => {
    expect(decls(sel)).toMatch(new RegExp(`(^|;)opacity:0?\\.${String(a).split(".")[1]}(;|$)`));
    for (const [fg, bg] of pairs) expect(ratio(fade(hex(fg), a, hex(bg)), hex(bg)), `${fg} at ${a} on ${bg}`).toBeGreaterThanOrEqual(AA);
  });
  it("a frame beside the one on show has no caption to read", () =>
    expect(decls(".site .gal-f:not(.on) figcaption")).toContain("visibility:hidden"));
  it("what a fade used to grey takes the ground's grey", () => {
    for (const sel of [".site .tcards em", ".site .zl button[aria-pressed=false] :is(b,p)", ".site .nav-srch kbd", ".site .srch-box input::placeholder"])
      expect(colourOf(sel), sel).toBe("--mute");
  });
});

describe("the state colours, on the papers", () => {
  /* COLOUR's variants were derived for paper (#F2F2F2). The papers a docket
     is filed on are darker, and a stamp is 11px: confirm-deep was 3.66:1 on
     kraft and electric 3.97:1. SITE carries a variant of each, measured on
     kraft, the darkest. The papers are read from the docket itself. */
  const tab = { label: "L", eyebrow: "E", title: "T", stamp: "S", purpose: "P" };
  const papers = [...new Set([...DOCKET("d", "D", Array.from({ length: 9 }, () => tab)).matchAll(/--t:var\((--gc-s-[a-z0-9-]+)\)/g)].map((m) => m[1]))].sort();
  it("which papers a docket is filed on", () => expect(papers).toEqual(["--gc-s-clay", "--gc-s-haze", "--gc-s-kraft", "--gc-s-sage"]));
  const TONES = [".site .dkt-stamp", ".site .dkt-stamp.ok", ".site .dkt-stamp.wait"];
  for (const t of TONES) for (const p of papers) it(`${t} reads on ${p}`, () => {
    const c = colourOf(t);
    expect(c, `${t} should state its colour as a token`).toBeTruthy();
    expect(ratio(hex(c!), hex(p))).toBeGreaterThanOrEqual(AA);
  });
  /* Pinned so the variants are not taken for decoration: if either of these
     ever passes, the papers or the palette have changed. */
  it("the palette's own two do not carry a stamp on kraft", () => {
    expect(ratio(hex("--gc-confirm-deep"), hex("--gc-s-kraft"))).toBeLessThan(AA);
    expect(ratio(hex("--gc-electric"), hex("--gc-s-kraft"))).toBeLessThan(AA);
  });
  it("and kraft is the darkest paper there is, so what holds on it holds on all", () => {
    for (const p of PAPERS) expect(lum(hex(p)), p).toBeGreaterThanOrEqual(lum(hex("--gc-s-kraft")));
  });
});

describe("a card that turns into the other ground restates the greys", () => {
  /* The digital assemblies (da.css) fill a pressed tile, and the entity a
     drawing is about, with the page's ink: a light tile on a night page, a
     night tile on a light one. What was set on one kept the page's greys,
     2.97:1 on the light tile of /how-we-build. */
  const DA = rulesOf(sheet("_assemblies/da.css").replace(/\s*([:;{},])\s*/g, "$1"));
  const da = (sel: string) => DA.filter((r) => r.sels.includes(sel)).map((r) => r.body).join(";");
  const token = (body: string, name: string) => body.match(new RegExp(`(?:^|;)${name}:var\\((--[a-z0-9-]+)\\)`))?.[1];
  const TILES = ['.da-ch-l button[aria-pressed="true"]', ".da-te-n.on"];
  const SCOPES = ["", ".pg-col ", ".lt ", ".on-paper "] as const;
  it("the page's ink is read from the assemblies' own scopes", () => {
    expect(token(da(".da"), "--da-ink")).toBe("--gc-ink-inverse");
    expect(token(da(".pg-col .da"), "--da-ink")).toBe("--gc-ink");
  });
  for (const tile of TILES) for (const scope of SCOPES) it(`${scope}${tile}`, () => {
    const body = da(scope + tile);
    const ground = hex(token(da(scope ? ".pg-col .da" : ".da"), "--da-ink")!);
    for (const grey of ["--da-dim", "--da-mute"]) {
      const t = token(body, grey);
      expect(t, `${scope}${tile} should restate ${grey}`).toBeTruthy();
      expect(ratio(hex(t!), ground), `${t} on the tile`).toBeGreaterThanOrEqual(AA);
    }
  });
});

describe("a day estate stands on a night page", () => {
  /* Its .pg is not .pg-col, so a rule keyed to the night PAGE reaches into
     it. The form's did: the address to write to, on the waiting list of an
     estate with pictures, was the estate's ink on a night panel, 1.02:1.
     Every such rule that paints is answered for the day estate. */
  const NIGHT_PAGE = ".site .pg:not(.pg-col) .tx-form ";
  const parts = RULES.filter((r) => /(^|;)(background|color):/.test(r.body))
    .flatMap((r) => r.sels.filter((x) => x.startsWith(NIGHT_PAGE)).map((x) => x.slice(NIGHT_PAGE.length))).sort();
  it("which parts of a form the night page paints", () => expect(parts).toEqual([".chip", ".chip[aria-pressed=true]", ".direct-row"]));
  for (const part of parts) it(`the day estate paints its own ${part}`, () => {
    expect(decls(`.site .est.est-day .tx-form ${part}`)).toMatch(/(^|;)background:var\(--(gc-s-chip|ink)\)/);
    /* and after the night page's rule, since the two are of one weight */
    expect(CSS.indexOf(`.site .est.est-day .tx-form ${part}{`)).toBeGreaterThan(CSS.indexOf(`${NIGHT_PAGE}${part}{`));
  });
});

describe("copper and the day's label grey, as type", () => {
  it("sets type in the night's copper only where the ground is night", () => {
    /* Copper is 2.2:1 on a light page. Each of these stands on a night
       ground by its own rule, except the capital of a lede, which a light
       page re-inks below. */
    const named = RULES.filter((r) => /(^|;)color:var\(--copper\)/.test(r.body)).flatMap((r) => r.sels).sort();
    expect(named).toEqual([
      ".site .dep-terms b", ".site .fin .stack4 b", ".site .gl-pop a", ".site .hero-link:hover", ".site .ig-compare .hd b.on", ".site .ig-sum .on b",
      ".site .ig-time li em", ".site .nav-panel nav a[aria-current=page]", ".site .nxt .eb", ".site .ref .mid b", ".site .tx-body:not(.lt) .tx-ch",
      ".site .tx-inspire:before", ".site .tx-lede::first-letter",
    ]);
  });
  it("on a light page the capital of a lede is the day's copper, and large enough for it", () => {
    expect(colourOf(".site :is(.lt,.pg-col) .tx-lede::first-letter")).toBe("--cd");
    expect(decls(".site")).toContain("--cd:var(--gc-copper-deep)");
    /* 56px and up, at weight 800: large type, on every paper a light page is set on. */
    expect(decls(".site .tx-lede::first-letter")).toMatch(/font:800 clamp\(56px/);
    for (const p of PAPERS) expect(ratio(hex("--gc-copper-deep"), hex(p)), p).toBeGreaterThanOrEqual(LARGE);
  });
  it("and a contents strip there is the day's text", () => {
    const toc: SitePage = { key: "t", path: "/t", light: 1, eyebrow: "E", title: "T", blocks: [{ toc: [["a", "A"]] }, { p: "x" }] };
    expect(TXT(toc)).toMatch(/class="tx-body lt"[\s\S]*class="tx-toc"/);
    expect(colourOf(".site :is(.lt,.pg-col) .tx-toc a")).toBe("--gc-s-stone");
    for (const p of PAPERS) expect(ratio(hex("--gc-s-stone"), hex(p)), p).toBeGreaterThanOrEqual(AA);
  });
  it("sets no type in the day's label grey by name, except on a ground that is always light", () => {
    /* It is under 4:1 on night. The manifesto is manila, where its type is
       large; `.who` is the light ground, on every page they appear. */
    const named = RULES.filter((r) => /(^|;)color:var\(--gc-s-ash-2\)/.test(r.body)).flatMap((r) => r.sels).sort();
    expect(named).toEqual([".site .mani p span", ".site .who .eb"]);
    expect(ratio(hex("--gc-s-ash-2"), hex("--gc-s-night"))).toBeLessThan(AA);
  });
});

describe("what is drawn, not typed", () => {
  /* A label inside a drawing takes its fill from the markup, where no ground
     can restate it. The map is drawn on a night ground on every estate. */
  const maps = Object.values(ESTATES).map((E) => { const v = vehicleOf(E.vehicleKey); return PROP(E, v ? read(v) : undefined, "").match(/<div class="map">[\s\S]*?<\/svg>/)?.[0]; }).filter((m): m is string => !!m);
  it("there are maps to read", () => expect(maps.length).toBeGreaterThan(1));
  it("the note under a map is the night's grey", () => {
    for (const m of maps) expect(m).toContain(`fill="${SITE.mute}">THE ROUTE IS ILLUSTRATIVE`);
  });
  it("and no label on a map is one of the day's greys", () => {
    for (const m of maps) for (const t of m.matchAll(/<text[^>]*fill="(#[0-9A-Fa-f]{6})"/g))
      expect([SITE.ash, SITE.ash2, SITE.stone] as string[]).not.toContain(t[1]);
  });
});
