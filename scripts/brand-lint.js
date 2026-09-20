#!/usr/bin/env node
/**
 * Brand Linter — the mark is specified in one place and drawn in one place
 *
 * Authority: Addendum A · BR-01 … BR-04 · constants/brand-system.ts
 *
 * ── WHAT WENT WRONG WITHOUT THIS ─────────────────────────────────────
 * BR-01 ratified the wordmark as Outfit 200 uppercase with a trailing
 * copper period. Nothing checked it, so on 20 Sep 2026 all four brand
 * surfaces disagreed with it and with each other:
 *
 *   app/icon.tsx              "GC" in Georgia bold        (the favicon)
 *   app/apple-icon.tsx        "GC" in Georgia bold        (the iOS icon)
 *   app/opengraph-image.tsx   every line in Georgia       (every share card)
 *   app/api/brochure/…        body in Georgia serif       (the investor brief)
 *   .sysmark                  weight 500, and no square   (all signed-in chrome)
 *
 * And the weight the mark requires was not loaded at all: fonts.ts asked
 * Outfit for 300-700, so a wordmark set at 200 fell silently to 300.
 *
 * Every rule below exists because one of those was true. A brand rule with
 * no gate is a preference, and this is the gate.
 *
 * Zero dependencies. Line endings normalised at every read — a pattern
 * ending \n stops matching the moment a \r arrives, and the failure mode is
 * a checker reporting zero findings rather than reporting that it is broken.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8").replace(/\r\n/g, "\n");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const fail = [];
const note = [];

/* ── Sources ─────────────────────────────────────────────────────────── */

const REGISTRY = "constants/brand-system.ts";
const COMPONENT = "app/_assemblies/brandmark.tsx";
const STYLES = "app/_assemblies/brandmark.css";
const FONTS = "app/_system/fonts.ts";

for (const f of [REGISTRY, COMPONENT, STYLES, FONTS]) {
  if (!exists(f)) fail.push(`${f} is missing — the mark has no ${f === REGISTRY ? "specification" : "renderer"}.`);
}
if (fail.length) {
  console.error("\n[brand-lint] FAIL\n");
  for (const f of fail) console.error(`  ${f}`);
  process.exit(1);
}

const registry = read(REGISTRY);
const component = read(COMPONENT);
const styles = read(STYLES);
const fonts = read(FONTS);

/* ── 1 · BR-01: the mark weight is 200, and it is actually loaded ─────── */

const MARK_WEIGHT = Number((registry.match(/MARK_WEIGHT\s*=\s*(\d+)/) || [])[1]);
if (MARK_WEIGHT !== 200) {
  fail.push(`BR-01 sets the wordmark at Outfit 200; the registry says ${MARK_WEIGHT || "nothing"}.`);
}

const outfitBlock = (fonts.match(/Outfit\(\{[\s\S]*?\}\)/) || [""])[0];
const loadedWeights = [...outfitBlock.matchAll(/"(\d{3})"/g)].map((m) => Number(m[1]));
if (!loadedWeights.includes(MARK_WEIGHT)) {
  fail.push(
    `Outfit is loaded at [${loadedWeights.join(", ") || "none"}] and the mark needs ${MARK_WEIGHT}. ` +
    `A wordmark asking for an unloaded weight falls to the nearest one SILENTLY — ` +
    `this is the defect that shipped, and it is invisible on screen.`,
  );
}

/* Anything in the type scale that asks for a weight the face does not carry
   has the same silent failure. Reported, because the scale is ratified too. */
if (exists("constants/typography.ts")) {
  const scale = read("constants/typography.ts");
  const asked = new Set(
    [...scale.matchAll(/T\("display",[^)]*?,\s*(\d{3}),\s*(?:true|false)/g)].map((m) => Number(m[1])),
  );
  const missing = [...asked].filter((w) => !loadedWeights.includes(w)).sort();
  if (missing.length) {
    fail.push(`constants/typography.ts sets display roles at weight ${missing.join(", ")}, which Outfit is not loaded at.`);
  }
}

/* ── 2 · BR-01: the wordmark carries its copper square ───────────────── */

if (!/gc-device/.test(component)) {
  fail.push("The wordmark renderer does not include the device. BR-01 makes the trailing square the mark.");
}
if (!/background:\s*var\(--gc-copper\)/.test(styles)) {
  fail.push("The device is not copper. BR-01 grants copper's only non-financial use to this one element.");
}

/* ── 3 · The device is square. RADIUS.none is invariant ─────────────── */

const radius = styles.match(/\.gc-device\s*\{[^}]*\}/);
if (radius && !/border-radius:\s*var\(--gc-radius\)/.test(radius[0])) {
  fail.push("The device must take var(--gc-radius). A round dot is the only curve in a zero-radius system.");
}
/* The lookahead sits immediately after the colon and consumes its own
   whitespace. Written as `\s*(?!…)` it backtracks to zero spaces, tests
   the guard against " " instead of "var(", and flags the correct answer —
   which is exactly what it did on its first run. scripts/token-lint.js
   carries the same note about the same trap; the hazard is documented in
   this repo and still caught me. */
for (const m of styles.matchAll(/border-radius:(?!\s*(?:0\b|var\(--gc-radius\)))([^;]+);/g)) {
  fail.push(`brandmark.css rounds a corner: "${m[1].trim()}". GC never rounds a corner.`);
}

/* ── 4 · The mark is never set in a face the system does not have ────── */

const FORBIDDEN = [...registry.matchAll(/FORBIDDEN_MARK_FACES\s*=\s*\[([^\]]*)\]/g)]
  .flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
if (!FORBIDDEN.length) fail.push("FORBIDDEN_MARK_FACES is empty — nothing bars the next Georgia.");

/* Brand surfaces only. A comment naming Georgia is the record of the defect,
   so only real declarations count: fontFamily:, font:, font-family:. */
const BRAND_SURFACES = [
  "app/icon.tsx", "app/apple-icon.tsx", "app/opengraph-image.tsx",
  "app/_assemblies/brandmark.tsx", "app/_assemblies/brandmark.css",
  "app/_assemblies/systempages.css",
];
for (const surface of BRAND_SURFACES) {
  if (!exists(surface)) continue;
  const src = read(surface);
  src.split("\n").forEach((line, i) => {
    if (!/font(?:-family|Family)?\s*[:=]/.test(line)) return;
    for (const face of FORBIDDEN) {
      if (new RegExp(`\\b${face}\\b`).test(line)) {
        fail.push(`${surface}:${i + 1} — the mark is set in ${face}. ${FORBIDDEN.join(" · ")} may never carry it.`);
      }
    }
  });
}

/* ── 5 · One renderer. Nobody hand-sets the wordmark again ───────────── */

const WORDMARK_TEXT = /GETAWAY\s+COLLECTIVE/;
const walk = (dir, out = []) => {
  let entries;
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["node_modules", ".next", "dist"].includes(e.name)) walk(rel, out); }
    else if (/\.(tsx|jsx)$/.test(e.name)) out.push(rel);
  }
  return out;
};
const generated = (src) => /GENERATED\b[^\n]*do not edit/i.test(src.slice(0, 400));
let handSet = 0;
for (const f of walk("app")) {
  if (f === COMPONENT) continue;
  const src = read(f);
  if (generated(src)) continue;
  src.split("\n").forEach((line, i) => {
    /* The uppercase string inside a JSX text position is the mark being
       typed by hand. In a comment or an aria-label it is prose. */
    if (!WORDMARK_TEXT.test(line)) return;
    if (/^\s*(\*|\/\/)/.test(line)) return;
    if (/aria-label|alt=|title>|"Getaway Collective"/.test(line)) return;
    if (/>\s*GETAWAY\s+COLLECTIVE\s*</.test(line)) {
      handSet++;
      fail.push(`${f}:${i + 1} — the wordmark is typed by hand. Import { Wordmark } from _assemblies/brandmark.`);
    }
  });
}

/* ── 6 · BR-02: the clearspace arithmetic holds ──────────────────────── */

const num = (name) => Number((registry.match(new RegExp(`${name}\\s*=\\s*([\\d.]+)`)) || [])[1]);
const CAP_RATIO = num("CAP_RATIO");
const MIN_CAP_PX = num("MIN_CAP_PX");
if (!(CAP_RATIO > 0 && CAP_RATIO < 1)) {
  fail.push(`CAP_RATIO is ${CAP_RATIO}; it is a fraction of the em and must sit between 0 and 1.`);
} else {
  const minFont = Math.ceil((MIN_CAP_PX / CAP_RATIO) * 10) / 10;
  const capAtFloor = minFont * CAP_RATIO;
  if (capAtFloor < MIN_CAP_PX) {
    fail.push(`The floor does not clear BR-02: ${minFont}px font-size gives ${capAtFloor.toFixed(2)}px cap-height, under ${MIN_CAP_PX}.`);
  }
  note.push(`clearspace = ${CAP_RATIO} x font-size (Outfit sCapHeight 676 / upem 1000)`);
  note.push(`wordmark floor = ${minFont}px font-size for a ${MIN_CAP_PX}px cap-height`);
}

/* ── 7 · Every mark and every misuse states itself fully ─────────────── */

const marks = [...registry.matchAll(/id:\s*"(GC-MARK-\d+)"/g)].map((m) => m[1]);
if (marks.length !== 3) fail.push(`The system has three marks; the registry declares ${marks.length}.`);
for (const field of ["form", "use", "never", "floor", "authority"]) {
  const n = (registry.match(new RegExp(`\\b${field}:`, "g")) || []).length;
  if (n < marks.length) fail.push(`Only ${n} of ${marks.length} marks state "${field}". A rule with no stated limit is decoration.`);
}
const misuse = [...registry.matchAll(/id:\s*"(MIS-\d+)"/g)].map((m) => m[1]);
if (misuse.length < 6) fail.push(`Only ${misuse.length} misuses are recorded. The ones already made are the ones worth writing down.`);
const misuseWhy = (registry.match(/why:/g) || []).length;
if (misuseWhy < misuse.length) fail.push(`${misuse.length - misuseWhy} misuse(s) do not say why. "Do not" without "because" is folklore.`);

/* ── Report ──────────────────────────────────────────────────────────── */

console.log(`\n[brand-lint] ${marks.length} marks · ${misuse.length} recorded misuses · ${FORBIDDEN.length} barred faces`);
console.log(`[brand-lint] Outfit loaded at ${loadedWeights.join(", ")} · mark weight ${MARK_WEIGHT}`);
for (const n of note) console.log(`  ${n}`);
if (handSet === 0) console.log("  one renderer: no surface sets the wordmark by hand");

if (fail.length) {
  console.error(`\n[brand-lint] FAIL — ${fail.length} violation(s)\n`);
  for (const f of fail) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}
console.log("\n[brand-lint] PASS — one specification, one renderer, and the ratified weight is loaded\n");
