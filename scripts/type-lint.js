#!/usr/bin/env node
/**
 * Type Linter — the rendered scale must be the ratified scale
 *
 * Authority: constants/typography.ts TYPE · L1-01 §29 Design Supremacy
 *
 * ── WHAT WENT WRONG WITHOUT THIS ─────────────────────────────────────
 * typography.ts ratifies display-xl and display-l at weight 200,
 * display-m and heading at 300, subheading at 400. Every one of those
 * roles rendered at 600 (subheading at 500), and had since the scale was
 * written. Nothing compared the two, so the design system said one thing
 * and the product showed another for the whole of its life so far.
 *
 * It survived because it is invisible in the way that matters: the page
 * looks deliberate at 600. You cannot see a weight that disagrees with a
 * constant in another file — you can only check it.
 *
 * ── ERROR AND OPEN, KEPT APART ───────────────────────────────────────
 * Two classes of finding, and they are not the same thing:
 *
 *   ERROR  a `.t-<role>` class whose WEIGHT contradicts TYPE. Fatal. This
 *          is the axis that has been corrected, so it stays corrected.
 *
 *   OPEN   size, line-height, letter-spacing and case, which still drift,
 *          and display-face weights elsewhere in the app that are not a
 *          ratified display weight. Printed every run, never fatal.
 *
 * The split is deliberate and borrowed from _CANON/build.py: a checker
 * that fails on everything at once gets muted, and a muted checker is the
 * same as no checker. What is fixed is enforced; what is open is stated
 * every single run so nobody can claim it was hidden.
 *
 * Zero dependencies. Line endings normalised at the read.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8").replace(/\r\n/g, "\n");

/* Directory walkers, declared before anything reaches for them — a `const`
   arrow function used above its own definition is a temporal-dead-zone
   ReferenceError, which is how the first version of this file died. */
const walk = (dir, out = []) => {
  let entries;
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["node_modules", ".next", "dist"].includes(e.name)) walk(rel, out); }
    else if (e.name.endsWith(".css")) out.push(rel);
  }
  return out;
};

const tsxFiles = (dir, out = []) => {
  let entries;
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["node_modules", ".next", "dist"].includes(e.name)) tsxFiles(rel, out); }
    else if (/\.(tsx|jsx)$/.test(e.name)) out.push(rel);
  }
  return out;
};

const SCALE_SRC = "constants/typography.ts";
const RENDERED = "app/_assemblies/assemblies.css";
const SOURCE_DOC = "GC-ASSEMBLIES.html";

const errors = [];
const open = [];

/* ── The ratified scale ──────────────────────────────────────────────── */

const scale = read(SCALE_SRC);
const TYPE = {};
for (const m of scale.matchAll(
  /"?([\w-]+)"?:\s*T\("(\w+)",\s*([\d.]+),\s*([\d.]+),\s*(-?[\d.]+),\s*(\d+),\s*(true|false)/g,
)) {
  TYPE[m[1]] = {
    family: m[2], size: Number(m[3]), lineHeight: Number(m[4]),
    letterSpacing: Number(m[5]), weight: Number(m[6]), uppercase: m[7] === "true",
  };
}
if (!Object.keys(TYPE).length) {
  console.error("[type-lint] could not parse TYPE from constants/typography.ts — the checker is broken, not the scale.");
  process.exit(1);
}

const DISPLAY_ROLES = Object.keys(TYPE).filter((r) => TYPE[r].family === "display");
const RATIFIED_DISPLAY_WEIGHTS = new Set(DISPLAY_ROLES.map((r) => TYPE[r].weight));

/* ── What the stylesheet actually renders ────────────────────────────── */

const css = read(RENDERED);

/** `.t-heading{font:300 24px/1.2 var(--gc-font-display);letter-spacing:-0.02em}` */
const ruleFor = (role) => {
  const m = css.match(new RegExp(`\\.t-${role}\\s*\\{([^}]*)\\}`));
  if (!m) return null;
  const body = m[1];
  const font = body.match(/font:\s*(\d{3})\s+([^/]+)\/\s*([\d.]+)\s+var\(--gc-font-display\)/);
  if (!font) return null;
  const ls = body.match(/letter-spacing:\s*(-?[\d.]+)em/);
  const maxSize = font[2].match(/clamp\([^,]+,[^,]+,\s*(\d+)px\s*\)/) || font[2].match(/(\d+)px/);
  return {
    weight: Number(font[1]),
    size: maxSize ? Number(maxSize[1]) : null,
    lineHeight: Number(font[3]),
    letterSpacing: ls ? Number(ls[1]) : 0,
    uppercase: /text-transform:\s*uppercase/.test(body),
  };
};

let checked = 0;
for (const role of DISPLAY_ROLES) {
  const got = ruleFor(role);
  if (!got) { open.push(`.t-${role} has no display-face rule in ${RENDERED} — not checked.`); continue; }
  const want = TYPE[role];
  checked++;

  /* ERROR — the corrected axis */
  if (got.weight !== want.weight) {
    errors.push(
      `.t-${role} renders at weight ${got.weight}; typography.ts ratifies ${want.weight}. ` +
      `Correct it in ${SOURCE_DOC} and run \`npm run assembly:css\` — ${RENDERED} is generated.`,
    );
  }

  /* OPEN — the axes that still disagree */
  if (got.size !== null && got.size !== want.size) {
    open.push(`.t-${role} size ${got.size}px vs ratified ${want.size}px`);
  }
  if (got.lineHeight !== want.lineHeight) {
    open.push(`.t-${role} line-height ${got.lineHeight} vs ratified ${want.lineHeight}`);
  }
  if (got.letterSpacing !== want.letterSpacing) {
    open.push(`.t-${role} letter-spacing ${got.letterSpacing}em vs ratified ${want.letterSpacing}em`);
  }
  if (got.uppercase !== want.uppercase) {
    open.push(`.t-${role} ${got.uppercase ? "is" : "is not"} uppercase; ratified ${want.uppercase ? "uppercase" : "sentence case"}`);
  }
}

/* ── Every `t-<role>` class used in a component must exist ───────────── */

/*
 * The check that was missing, and the reason it was missing: every rule
 * above starts from the ratified scale and looks for its class. A class
 * that is used but has NO rule is invisible to that direction of search.
 *
 * `t-display-s` was used at 23 call sites across 9 files — more than
 * t-display-l, t-subheading, t-display-xl and t-heading combined — and was
 * defined in no stylesheet and named no role in TYPE. Those headings fell
 * through to the browser default: bold 700 at 1.5em, heavier than anything
 * in a scale whose display roles top out at 400, and a size nobody chose.
 *
 * Nothing looked broken, which is the whole problem: an unstyled <h2> looks
 * like a styled <h2> to everyone except the person who wrote the rule that
 * is not being applied.
 */


const definedClasses = new Set();
for (const file of walk("app")) {
  for (const m of read(file).matchAll(/\.(t-[a-z0-9-]+)\s*\{/g)) definedClasses.add(m[1]);
}

const usedClasses = new Map();
for (const file of tsxFiles("app")) {
  for (const m of read(file).matchAll(/\b(t-(?:display|heading|subheading|body|caption|micro|mono|editorial)[a-z0-9-]*)\b/g)) {
    if (!usedClasses.has(m[1])) usedClasses.set(m[1], new Set());
    usedClasses.get(m[1]).add(file);
  }
}

for (const [cls, files] of [...usedClasses].sort()) {
  if (definedClasses.has(cls)) continue;
  errors.push(
    `${cls} is used in ${files.size} file(s) and defined in no stylesheet. ` +
    `It falls through to the browser default — bold, at a size nobody chose. ` +
    `Point it at a ratified role, or ratify the role in ${SCALE_SRC}.`,
  );
}

/* ── Display weights elsewhere in the app ────────────────────────────── */


const stray = new Map();
for (const file of walk("app")) {
  for (const m of read(file).matchAll(/font:\s*(\d{3})[^;}]*var\(--gc-font-display\)/g)) {
    const w = Number(m[1]);
    if (RATIFIED_DISPLAY_WEIGHTS.has(w)) continue;
    const key = `${file} · weight ${w}`;
    stray.set(key, (stray.get(key) || 0) + 1);
  }
}

/* ── Report ──────────────────────────────────────────────────────────── */

console.log(`\n[type-lint] ${checked}/${DISPLAY_ROLES.length} display roles checked · ratified weights ${[...RATIFIED_DISPLAY_WEIGHTS].sort((a, b) => a - b).join(", ")}`);

if (stray.size) {
  const total = [...stray.values()].reduce((a, b) => a + b, 0);
  console.log(`\n[type-lint] OPEN — ${total} display-face rule(s) outside the scale carry an unratified weight:`);
  for (const [k, n] of [...stray].sort()) console.log(`  ${k} · ${n} rule(s)`);
  console.log("  These are hand-written stylesheets, not generated. Correcting them restyles live");
  console.log("  public pages, so they are reported rather than swept.");
}

if (open.length) {
  console.log(`\n[type-lint] OPEN — ${open.length} scale disagreement(s) on axes other than weight:`);
  for (const o of open) console.log(`  ${o}`);
  console.log("  Size, line-height, tracking and case move layout, not just colour of the page.");
  console.log("  Left for a decision rather than taken silently.");
}

if (errors.length) {
  console.error(`\n[type-lint] FAIL — ${errors.length} finding(s) contradict the ratified scale\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

console.log("\n[type-lint] PASS — every display role renders at the weight typography.ts ratifies\n");
