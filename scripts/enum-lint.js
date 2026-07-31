#!/usr/bin/env node
/**
 * Enum Display Linter — ties display metadata to the field registry
 *
 * Wave 4 · Primitive Surface
 *
 * Checks:
 *   1. Every enum value in the UFR has display metadata
 *   2. No display metadata describes a value the registry no longer has
 *   3. Every tone is a real semantic token
 *   4. Descriptions are present and short enough for a tooltip
 *   5. `critical` stays inside its budget — it is the rarest colour in the
 *      system, and spending it on ordinary states leaves nothing that still
 *      registers when a real breach happens
 *   6. No two values in one enum share a label — a UI that renders two
 *      states identically is a UI that lies
 *
 * Check 2 is the one that catches the slow failure: a value gets removed
 * from the schema, its label stays behind, and a year later someone assumes
 * the state still exists because the label is right there.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const UFR = path.join(ROOT, "constants", "ufr.ts");
const ENUMS = path.join(ROOT, "constants", "enums.ts");

const fail = [];
const warn = [];

const TONES = ["steel", "electric", "confirm", "hazard", "critical", "copper", "forest"];
const MAX_DESCRIPTION = 60;

/** `Object.field` -> [values] from the registry. */
function registryEnums() {
  const src = fs.readFileSync(UFR, "utf8");
  const out = new Map();
  for (const m of src.matchAll(/F\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const v = b.match(/values:\s*\[([^\]]*)\]/);
    if (!v) continue;
    const obj = (b.match(/object:\s*BusinessObjectType\.(\w+)/) || [])[1];
    const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
    out.set(`${obj}.${name}`, [...v[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
  }
  return out;
}

/** `Object.field` -> { value: {label, description, tone} } from the display file. */
function displayEnums() {
  const src = fs.readFileSync(ENUMS, "utf8");
  const block = src.match(/export const ENUM_DISPLAY[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) {
    console.error("[enum-lint] Could not parse ENUM_DISPLAY. Refusing to run.");
    process.exit(2);
  }
  const out = new Map();
  // Each group is  "Object.field": { ... },
  //
  // The empty-group alternative is not decoration. A stray `"X": {},` has
  // no closing "\n  }," of its own, so a pattern without it scans forward
  // to the NEXT group's close and swallows that group's key whole — which
  // is exactly what happened here, and it surfaced as a missing label on a
  // completely unrelated enum.
  const groupRe = /"([\w.]+)":\s*\{\s*\}|"([\w.]+)":\s*\{([\s\S]*?)\n\s{2}\},/g;
  let g;
  while ((g = groupRe.exec(block[1])) !== null) {
    const key = g[1] ?? g[2];
    const body = g[3] ?? "";
    const values = new Map();
    const entryRe = /(?:"([^"]+)"|(\w+)):\s*D\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"(\w+)"/g;
    let e;
    while ((e = entryRe.exec(body)) !== null) {
      values.set(e[1] ?? e[2], { label: e[3], description: e[4], tone: e[5] });
    }
    out.set(key, values);
  }
  return out;
}

// ── Run ───────────────────────────────────────────────────────────────
const REG = registryEnums();
const DISP = displayEnums();

if (REG.size === 0 || DISP.size === 0) {
  console.error("[enum-lint] Parsed zero enums on one side. Refusing to pass vacuously.");
  process.exit(2);
}

let totalValues = 0;
let criticalCount = 0;

// 1. every registry value has display metadata
for (const [key, values] of REG) {
  const d = DISP.get(key);
  if (!d) {
    fail.push(`${key} is an enum in the registry with no display metadata. Every value a user can see needs a label.`);
    continue;
  }
  for (const v of values) {
    totalValues++;
    if (!d.has(v)) {
      fail.push(`${key}."${v}" exists in the registry but has no display metadata`);
    }
  }
}

// 2. no orphan metadata
for (const [key, values] of DISP) {
  const r = REG.get(key);
  if (!r) {
    if (values.size === 0) continue; // deliberately empty placeholder
    fail.push(
      `${key} has display metadata but is not an enum in the registry. ` +
        `A stale label outlives the value it described, and the next reader assumes the state still exists.`,
    );
    continue;
  }
  for (const v of values.keys()) {
    if (!r.includes(v)) {
      fail.push(`${key}."${v}" has display metadata but was removed from the registry`);
    }
  }
}

// 3-6. metadata quality
for (const [key, values] of DISP) {
  const labels = new Map();
  for (const [v, d] of values) {
    if (!TONES.includes(d.tone)) {
      fail.push(`${key}."${v}" has tone "${d.tone}", which is not a semantic token`);
    }
    if (d.tone === "critical") criticalCount++;
    if (!d.description || d.description.length === 0) {
      fail.push(`${key}."${v}" has no description`);
    } else if (d.description.length > MAX_DESCRIPTION) {
      warn.push(`${key}."${v}" description is ${d.description.length} chars; it appears in a tooltip, not a paragraph`);
    }
    if (!d.label) fail.push(`${key}."${v}" has no label`);
    // 6. duplicate labels within one enum
    if (labels.has(d.label)) {
      fail.push(
        `${key}: "${v}" and "${labels.get(d.label)}" both render as "${d.label}". ` +
          `A UI that shows two states identically is a UI that lies.`,
      );
    }
    labels.set(d.label, v);
  }
}

// 5. critical budget
const BUDGET = (() => {
  const m = fs.readFileSync(ENUMS, "utf8").match(/CRITICAL_TONE_BUDGET\s*=\s*(\d+)/);
  return m ? Number(m[1]) : 12;
})();
if (criticalCount > BUDGET) {
  fail.push(
    `${criticalCount} values carry the "critical" tone, over the budget of ${BUDGET}. ` +
      `It is the rarest colour in the system; spending it on ordinary states leaves nothing ` +
      `that still registers when a real breach happens.`,
  );
}

// ── Report ────────────────────────────────────────────────────────────
console.log(`[enum-lint] ${REG.size} enums · ${totalValues} values · ${criticalCount}/${BUDGET} critical tone\n`);

if (warn.length) {
  console.log(`[enum-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[enum-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[enum-lint] PASS — every registry value has a label, no label outlives its value\n`);
process.exit(0);
