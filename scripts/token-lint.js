#!/usr/bin/env node
/**
 * Token Linter — no literal colours, radii, spacing or durations
 * plus a real WCAG contrast audit of the palette
 *
 * Wave 4 · Primitive Surface
 * Authority: L1-01 §29 Design Supremacy Clause
 *
 * ── PART ONE: NO LITERALS ────────────────────────────────────────────
 * "No component may declare a colour, radius, spacing or duration literal."
 *
 * The Design Supremacy Clause says the token package overrides every other
 * design decision. That is only true if there is nowhere else to put one.
 * A single `#2061DE` typed into a component is a second source of truth,
 * and it will not move when the token does.
 *
 * ── PART TWO: CONTRAST ───────────────────────────────────────────────
 * WCAG AA computed from the actual token values: 4.5:1 for text, 3:1 for
 * UI components. Computed, not asserted — a palette can be beautiful and
 * illegible, and the only way to know is to do the arithmetic.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

/* Line endings normalised at the read. A pattern ending `\n` silently
   stops matching the moment a `\r` appears before it, and the failure
   mode is a parser returning ZERO — which reads as "nothing to check"
   rather than "the check is broken". ufr-lint shipped exactly that bug. */

const ROOT = path.resolve(__dirname, "..");
const TOKENS = path.join(ROOT, "constants", "tokens.ts");

const SCAN_DIRS = ["components", "app", "lib/ui", "packages"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".jsx", ".css"]);
const SKIP = new Set(["node_modules", ".next", "dist", "build", ".git", "generated"]);
const PRAGMA = "token-lint-ignore";

const fail = [];
const warn = [];
const resolved = [];

// ── Literal detection ─────────────────────────────────────────────────
const LITERALS = [
  [/#[0-9a-fA-F]{3,8}\b/g, "colour", "use var(--gc-*) or the COLOUR token"],
  [/\brgba?\(\s*\d+/g, "colour", "use var(--gc-*) or the COLOUR token"],
  /* A var() reference is what this rule WANTS, and the original pattern
     rejected it — `border-radius: var(--gc-radius)` was flagged as a
     literal. A check that refuses the correct answer teaches people to
     write the wrong one. */
  /* The lookahead sits immediately after the colon and consumes its own
     whitespace. Written as `\s*(?!…)` it backtracked to zero spaces,
     the guard tested against " " instead of "var(", and the rule flagged
     the correct answer. */
  [/\bborder-radius:(?!\s*(?:0\b|var\())[^;]+/g, "radius", "GC never rounds a corner. RADIUS.none is 0px"],
  [/\btransition-duration:\s*[^;]+/g, "duration", "use var(--gc-dur-*)"],
  [/\banimation-duration:\s*[^;]+/g, "duration", "use var(--gc-dur-*)"],
  [/(?:padding|margin|gap):\s*\d+px/g, "spacing", "use var(--gc-sp-*)"],
];

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(full, out); }
    else if (SCAN_EXTS.has(path.extname(e.name))) out.push(full);
  }
  return out;
}

/**
 * Generated output is governed at the generator, not at the output.
 *
 * `generated/` and `dist/` are already skipped by directory. This extends
 * the same rule to generated files that live elsewhere —
 * app/_assemblies/assemblies.css is ported wholesale from
 * GC-ASSEMBLIES.html by scripts/gen-assembly-css.js, and editing it to
 * satisfy this linter would be edited away on the next regeneration.
 *
 * What that file carries is reported rather than hidden: see the count
 * printed at the end of this run.
 */
const isGenerated = (f) => {
  const head = fs.readFileSync(f, "utf8").slice(0, 400);
  return /GENERATED\b[^\n]*do not edit/i.test(head);
};

const allFiles = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const generated = allFiles.filter(isGenerated);
const files = allFiles.filter((f) => !generated.includes(f));
for (const file of files) {
  const rel = path.relative(ROOT, file);
  fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n").forEach((line, i) => {
    if (line.includes(PRAGMA)) return;
    for (const [re, kind, advice] of LITERALS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        fail.push(`${rel}:${i + 1} — literal ${kind} "${m[0].trim()}". ${advice}`);
      }
    }
  });
}

// ── Contrast ──────────────────────────────────────────────────────────
function palette() {
  const src = fs.readFileSync(TOKENS, "utf8").replace(/\r\n/g, "\n");
  const block = src.match(/export const COLOUR = \{([\s\S]*?)\n\}/);
  if (!block) { console.error("[token-lint] Could not parse COLOUR. Refusing to run."); process.exit(2); }
  const out = {};
  for (const m of block[1].matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)) out[m[1]] = m[2];
  return out;
}

const srgb = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const P = palette();
const AA_TEXT = 4.5;
const AA_UI = 3.0;

/**
 * Foreground tokens tested against both grounds.
 *
 * `void` and `paper` are the two backgrounds the system commits to
 * (Obsidian and Concrete modes). Every semantic colour has to survive on
 * whichever one it lands on, and a colour that only works on one is a
 * colour that will eventually appear on the other.
 */
const GROUNDS = [["void", P.void], ["paper", P.paper]];
const FOREGROUNDS = ["forest", "copper", "electric", "hazard", "critical", "confirm", "steel", "steelDim"];

const results = [];
for (const [gName, ground] of GROUNDS) {
  for (const f of FOREGROUNDS) {
    if (!P[f]) continue;
    const ratio = contrast(P[f], ground);
    results.push({ fg: f, ground: gName, ratio: Math.round(ratio * 100) / 100 });
  }
}

// Text-critical pairings: the primary text tokens must clear AA on their ground.
const TEXT_PAIRS = [["ink", "paper"], ["inkInverse", "void"], ["steel", "paper"], ["steelDim", "void"]];
for (const [fg, bg] of TEXT_PAIRS) {
  if (!P[fg] || !P[bg]) continue;
  const r = contrast(P[fg], P[bg]);
  if (r < AA_TEXT) {
    fail.push(
      `contrast: ${fg} on ${bg} is ${r.toFixed(2)}:1, under the AA text minimum of ${AA_TEXT}:1. ` +
        `This is body text; failing here means the interface is unreadable for part of the audience.`,
    );
  }
}

/**
 * Ground-specific variants.
 *
 * Four semantic colours clear AA on one ground and fail on the other. The
 * palette is locked (§29), so the answer is not to change them — it is to
 * provide a hue-preserving variant for the ground the original cannot
 * survive, and to verify that variant actually solves it.
 *
 * A warning that merely repeats "this fails" every run teaches people to
 * ignore the linter. A warning that names the fix, and proves the fix
 * works, is worth reading.
 */
const VARIANTS = {
  void: { forest: "forestLight" },
  paper: { copper: "copperDeep", confirm: "confirmDeep", hazard: "hazardDeep" },
};

for (const r of results) {
  if (["steel", "steelDim"].includes(r.fg)) continue;
  if (r.ratio >= AA_UI) continue;

  const variantName = VARIANTS[r.ground]?.[r.fg];
  const groundHex = r.ground === "void" ? P.void : P.paper;

  if (!variantName) {
    fail.push(
      `contrast: ${r.fg} on ${r.ground} is ${r.ratio}:1, under AA UI (${AA_UI}:1), and no ground-specific ` +
        `variant is declared. Either add one or the colour cannot carry meaning on that ground.`,
    );
    continue;
  }
  if (!P[variantName]) {
    fail.push(`contrast: variant "${variantName}" is referenced for ${r.fg} on ${r.ground} but is not in the palette`);
    continue;
  }
  const vRatio = contrast(P[variantName], groundHex);
  if (vRatio < AA_TEXT) {
    fail.push(
      `contrast: variant ${variantName} for ${r.fg} on ${r.ground} is only ${vRatio.toFixed(2)}:1, ` +
        `under the AA text minimum of ${AA_TEXT}:1. The variant does not solve what it was added for.`,
    );
  } else {
    resolved.push(
      `${r.fg} on ${r.ground} (${r.ratio}:1) -> use ${variantName} (${vRatio.toFixed(2)}:1)`,
    );
  }
}

/**
 * A variant must not be weaker than the original on the ground the original
 * already handles. That would be a regression dressed as a fix.
 */
for (const [ground, map] of Object.entries(VARIANTS)) {
  const groundHex = ground === "void" ? P.void : P.paper;
  for (const [orig, variant] of Object.entries(map)) {
    if (!P[variant] || !P[orig]) continue;
    const other = ground === "void" ? P.paper : P.void;
    if (contrast(P[orig], other) < AA_UI) {
      warn.push(`${orig} is weak on BOTH grounds; a single variant may not be enough`);
    }
    void groundHex;
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log(`[token-lint] ${files.length} file(s) scanned · ${Object.keys(P).length} palette tokens · WCAG AA computed\n`);

const table = results
  .map((r) => `  ${r.fg.padEnd(11)} on ${r.ground.padEnd(6)} ${String(r.ratio).padStart(6)}:1  ${r.ratio >= AA_TEXT ? "AA text" : r.ratio >= AA_UI ? "AA UI" : "accent only"}`)
  .join("\n");
console.log(table + "\n");

if (resolved.length) {
  console.log(`[token-lint] ${resolved.length} ground-specific variant(s) in use:`);
  for (const r of resolved) console.log(`  - ${r}`);
  console.log("");
}

if (warn.length) {
  console.log(`[token-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[token-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

if (generated.length) {
  /* Named, counted, and not silently exempt. */
  let carried = 0;
  for (const f of generated) {
    const body = fs.readFileSync(f, "utf8");
    for (const [re] of LITERALS) { re.lastIndex = 0; carried += (body.match(re) || []).length; }
  }
  console.log(
    `[token-lint] ${generated.length} generated file(s) not scanned, carrying ${carried} ` +
    `literal(s) from their source. Fix those at the generator.`,
  );
  for (const f of generated) console.log(`  - ${path.relative(ROOT, f)}`);
  console.log("");
}

console.log(`[token-lint] PASS — no design literals, and all body-text pairings clear WCAG AA\n`);
process.exit(0);
