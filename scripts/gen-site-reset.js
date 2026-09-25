#!/usr/bin/env node
/**
 * SITE RESET GENERATOR — keeps the platform's global classes out of the site
 *
 * L1-01 §29-0b · 24 Sep 2026. The site (app/_assemblies/site.css) reuses
 * short class names the prototype chose — .btn, .hero, .mk, .foot, .map —
 * and several already mean something else in the platform's stylesheets:
 * .mk is a 9px marker chip there, .hero a flex column with a scrim. Every
 * such rule would leak into the site.
 *
 * This reads every other stylesheet the root layout imports, finds each rule
 * whose selector is made only of classes the site uses, and writes a
 * `revert` for every property it sets, scoped under .site. It is placed
 * BEFORE the ported rules, so the prototype's own declarations still win and
 * only what the platform set, and the site did not, is rolled back.
 *
 * Usage:
 *   node scripts/gen-site-reset.js           write the reset
 *   node scripts/gen-site-reset.js --check   fail if it has drifted
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const CHECK = process.argv.includes("--check");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8").replace(/\r\n/g, "\n");

/* The classes the site's markup uses, read from the files that write it. */
const SOURCES = [
  "app/_assemblies/site/render.ts", "app/_assemblies/site/pages.tsx", "app/_assemblies/site/chrome.tsx",
  "app/_assemblies/site/infographics.ts", "app/_assemblies/site/identity.tsx",
  "app/_assemblies/site/docket.ts", "app/_assemblies/site/system.tsx", "app/_assemblies/site/lost.tsx",
  "app/_assemblies/site/search.tsx", "app/_assemblies/site/gallery.ts",
  "content/site/estates.ts", "content/site/pages.ts", "content/site/home.ts",
];
const siteClasses = new Set();
for (const f of SOURCES) {
  const src = read(f);
  for (const m of src.matchAll(/class(?:Name)?=\\?["'`]([^"'`\\$]+)/g)) {
    for (const c of m[1].split(/\s+/)) if (/^[a-z][\w-]*$/.test(c) && !c.startsWith("gc-")) siteClasses.add(c);
  }
}
if (siteClasses.size < 40) {
  console.error(`[site-reset] read only ${siteClasses.size} site classes. Refusing to run on a parse that small.`);
  process.exit(2);
}

/* Every stylesheet globals.css imports, except the site's own. */
const globals = read("app/globals.css");
const sheets = [...globals.matchAll(/@import url\("\.\/(_assemblies\/[\w.-]+\.css)"\)/g)]
  .map((m) => "app/" + m[1]).filter((f) => !f.endsWith("site.css"));
if (sheets.length < 5) {
  console.error(`[site-reset] found ${sheets.length} stylesheets in globals.css. Refusing to run.`);
  process.exit(2);
}

function rules(css) {
  const out = [];
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  while (i < css.length) {
    const j = css.indexOf("{", i);
    if (j < 0) break;
    const head = css.slice(i, j).trim();
    if (head.startsWith("@")) {
      let depth = 1, k = j + 1;
      while (depth && k < css.length) { if (css[k] === "{") depth++; else if (css[k] === "}") depth--; k++; }
      if (/^@media/.test(head)) out.push(...rules(css.slice(j + 1, k - 1)));
      i = k;
    } else {
      const k = css.indexOf("}", j);
      out.push({ sel: head, body: css.slice(j + 1, k) });
      i = k + 1;
    }
  }
  return out;
}

const SIMPLE = /^(?:[a-z0-9]+)?(?:\.[\w-]+)+(?:\s*(?:>\s*)?(?:[a-z0-9]+|(?:[a-z0-9]+)?(?:\.[\w-]+)+))*(?::{1,2}[\w-]+(?:\([^)]*\))?)*$/;
const reset = new Map();
for (const f of sheets) {
  for (const r of rules(read(f))) {
    for (const raw of r.sel.split(",")) {
      const sel = raw.trim().replace(/\s+/g, " ");
      if (!SIMPLE.test(sel) || sel.startsWith(".site")) continue;
      const classes = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
      if (!classes.length || !classes.every((c) => siteClasses.has(c))) continue;
      const props = [...r.body.matchAll(/(^|;)\s*([a-z-]+)\s*:/g)].map((m) => m[2]).filter((p) => !p.startsWith("--"));
      if (!props.length) continue;
      const key = ".site " + sel;
      const set = reset.get(key) || new Set();
      props.forEach((p) => set.add(p));
      reset.set(key, set);
    }
  }
}

const body = [...reset.entries()].sort(([a], [b]) => a.localeCompare(b))
  .map(([sel, props]) => `${sel}{${[...props].sort().map((p) => `${p}:revert`).join(";")}}`).join("\n");
const START = "/* ── GENERATED RESET — scripts/gen-site-reset.js, do not edit by hand ── */";
const END = "/* ── END GENERATED RESET ── */";
const block = `${START}\n${body}\n${END}`;

const cssPath = path.join(ROOT, "app/_assemblies/site.css");
const css = fs.readFileSync(cssPath, "utf8").replace(/\r\n/g, "\n");
const anchor = css.indexOf(".site *{box-sizing:border-box}");
if (anchor < 0) { console.error("[site-reset] could not find the anchor in site.css."); process.exit(2); }
const cleaned = css.includes(START) ? css.slice(0, css.indexOf(START)) + css.slice(css.indexOf(END) + END.length + 1) : css;
const at = cleaned.indexOf(".site *{box-sizing:border-box}");
const next = cleaned.slice(0, at) + block + "\n" + cleaned.slice(at);

if (CHECK) {
  if (next !== css) { console.error("[site-reset] STALE — run node scripts/gen-site-reset.js"); process.exit(1); }
  console.log(`[site-reset] OK — ${reset.size} leaking rule(s) reverted under .site, from ${sheets.length} stylesheets`);
  process.exit(0);
}
fs.writeFileSync(cssPath, next);
console.log(`[site-reset] wrote ${reset.size} reset rule(s) from ${sheets.length} stylesheets · ${siteClasses.size} site classes`);
