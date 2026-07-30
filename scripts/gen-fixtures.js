#!/usr/bin/env node
/**
 * Fixture generator — one valid instance per L2 object, built from the UFR.
 *
 * Wave 2 · Semantic Core
 *
 * These exist so the generated contracts are EXERCISED, not merely emitted.
 * A schema file that has never parsed a value is an assertion, not a check.
 *
 * Values are deterministic: no random data, no timestamps read from the
 * clock. A fixture that changes between runs turns a failing test into a
 * question about which run you are looking at.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const UFR_SRC = path.join(ROOT, "constants", "ufr.ts");
const OUT = path.join(ROOT, "generated", "fixtures.ts");
const CHECK = process.argv.includes("--check");

/** Deterministic UUID from a seed — stable across runs and machines. */
function uuidFor(seed) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const hex = (n) => n.toString(16).padStart(8, "0");
  const a = hex(h);
  const b = hex(Math.imul(h, 31) >>> 0);
  const c = hex(Math.imul(h, 131) >>> 0);
  const d = hex(Math.imul(h, 7919) >>> 0);
  // Version 4, variant 8 — shaped to satisfy strict uuid validators.
  return `${a}-${b.slice(0, 4)}-4${b.slice(4, 7)}-8${c.slice(0, 3)}-${c.slice(3, 8)}${d.slice(0, 7)}`;
}

function parseUFR() {
  const src = fs.readFileSync(UFR_SRC, "utf8");
  const out = [];
  for (const m of src.matchAll(/F\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`)) || [])[1];
    const flag = (k) => new RegExp(`\\b${k}:\\s*true`).test(b);
    const v = b.match(/values:\s*\[([^\]]*)\]/);
    out.push({
      ufr: g("ufr"), name: g("name"), type: g("type"),
      object: (b.match(/object:\s*BusinessObjectType\.(\w+)/) || [])[1],
      references: (b.match(/references:\s*BusinessObjectType\.(\w+)/) || [])[1],
      required: flag("required"), computed: flag("computed"),
      values: v ? [...v[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : null,
    });
  }
  return out.filter((f) => f.ufr && f.object);
}

function valueFor(f) {
  switch (f.type) {
    case "uuid": return JSON.stringify(uuidFor(`${f.object}.${f.name}`));
    case "reference": return JSON.stringify(uuidFor(`${f.references}.id`));
    case "string": return JSON.stringify(`Sample ${f.name.replace(/_/g, " ")}`);
    case "text": return JSON.stringify(`Sample ${f.name.replace(/_/g, " ")} content for fixture purposes.`);
    case "integer": return "100";
    case "decimal": return "1.5";
    case "money": return '"1000.0000"'; // decimal string, never a float
    case "percent": return "0.1";
    case "boolean": return "true";
    case "date": return '"2026-01-15"';
    case "timestamp": return '"2026-01-15T10:00:00.000Z"';
    case "enum": return JSON.stringify(f.values[0]);
    case "json": return "{}";
    default: throw new Error(`unmapped type ${f.type}`);
  }
}

function build() {
  const fields = parseUFR();
  const byObject = new Map();
  for (const f of fields) {
    if (!byObject.has(f.object)) byObject.set(f.object, []);
    byObject.get(f.object).push(f);
  }
  const names = [...byObject.keys()].sort();

  const L = [];
  L.push("/**");
  L.push(" * GENERATED FILE — DO NOT EDIT.");
  L.push(" *");
  L.push(" * Source: constants/ufr.ts");
  L.push(" * Regenerate: npm run fixtures");
  L.push(" *");
  L.push(" * One valid instance per L2 object. Deterministic by construction: no");
  L.push(" * randomness, no clock reads. A fixture that differs between runs turns a");
  L.push(" * failing test into a question about which run you are looking at.");
  L.push(" */");
  L.push("");
  L.push("const SYSTEM = {");
  L.push(`  id: ${JSON.stringify(uuidFor("system.id"))},`);
  L.push(`  created_at: "2026-01-01T00:00:00.000Z",`);
  L.push(`  created_by: ${JSON.stringify(uuidFor("system.created_by"))},`);
  L.push(`  updated_at: "2026-01-01T00:00:00.000Z",`);
  L.push("  version: 0,");
  L.push("};");
  L.push("");

  for (const obj of names) {
    const fs_ = byObject.get(obj).slice().sort((a, b) => a.ufr.localeCompare(b.ufr));
    L.push(`export const ${obj}Fixture = {`);
    L.push("  ...SYSTEM,");
    for (const f of fs_) L.push(`  ${f.name}: ${valueFor(f)},`);
    L.push("};");
    L.push("");
  }

  L.push("export const FIXTURES = {");
  for (const obj of names) L.push(`  ${obj}: ${obj}Fixture,`);
  L.push("} as const;");
  L.push("");
  return { text: L.join("\n"), objects: names.length };
}

const { text, objects } = build();

if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
  if (cur === null || cur.replace(/\r\n/g, "\n") !== text.replace(/\r\n/g, "\n")) {
    console.error("[gen-fixtures] FAIL — generated/fixtures.ts is missing, stale, or hand-edited. Run: npm run fixtures");
    process.exit(1);
  }
  console.log(`[gen-fixtures] OK — fixtures match the registry (${objects} objects)\n`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, text, "utf8");
console.log(`[gen-fixtures] wrote generated/fixtures.ts — ${objects} objects\n`);
