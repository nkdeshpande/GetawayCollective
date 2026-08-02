#!/usr/bin/env node
/**
 * TAXONOMY LINT — the cross-cutting vocabularies
 *
 * constants/taxonomies.ts holds the eight v5 controlled vocabularies.
 * They cannot be checked by enum-lint, which pairs `"Object.field"` keys
 * against the UFR: these have no owning object, which is the whole reason
 * they live in their own registry.
 *
 * Checks:
 *   1. Every taxonomy declares a name, appliesTo and why.
 *   2. Values are unique within a taxonomy.
 *   3. `order` is contiguous 1..n with no gap and no duplicate.
 *   4. Every value has a meaning and a real tone token.
 *   5. The critical-tone budget is respected ACROSS enums.ts AND this
 *      file — one global ceiling, not one per registry.
 *   6. Values are SCREAMING_CASE, matching the canon's spelling.
 *   7. The three exported unions match their registry entries exactly.
 *
 * Check 5 is the one worth explaining. `CRITICAL_TONE_BUDGET` exists
 * because a screen where everything is red says nothing, and that is a
 * property of the product rather than of a file. Counting each registry
 * separately would let the ceiling be doubled by adding a file, which is
 * not a rule — it is a formality.
 *
 * Like every script here this parses source text rather than importing
 * TypeScript, and refuses a vacuous pass: a parse that finds nothing
 * reports a broken parser, not a clean bill.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
/* \r\n normalised at read. A pattern ending \n silently stops matching
   the moment a \r appears before it, and the failure mode is a parser
   returning ZERO — which reads as "nothing to check" rather than "the
   check is broken". ufr-lint shipped exactly that bug. */
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const src = read("constants", "taxonomies.ts");
const enumSrc = read("constants", "enums.ts");

const fail = [];
const err = (m) => fail.push(m);

/* ── Parse the tone union so a typo in a tone is caught here ─────── */
const toneBlock = enumSrc.match(/export type Tone =([\s\S]*?);/);
const TONES = toneBlock ? [...toneBlock[1].matchAll(/"([a-z]+)"/g)].map((m) => m[1]) : [];
if (TONES.length === 0) {
  console.error("[taxonomy-lint] Parsed zero tones from constants/enums.ts. Broken parse, not a pass.");
  process.exit(2);
}

const budgetMatch = enumSrc.match(/export const CRITICAL_TONE_BUDGET\s*=\s*(\d+)/);
if (!budgetMatch) {
  console.error("[taxonomy-lint] Could not find CRITICAL_TONE_BUDGET in constants/enums.ts.");
  process.exit(2);
}
const BUDGET = Number(budgetMatch[1]);

/* ── Parse the taxonomies ────────────────────────────────────────── */
const body = src.match(/export const TAXONOMIES: Record<TaxonomyId, Taxonomy> = \{([\s\S]*?)\n\};/);
if (!body) {
  console.error("[taxonomy-lint] Could not find the TAXONOMIES registry. Refusing to guess.");
  process.exit(2);
}

const taxonomies = [];
for (const m of body[1].matchAll(
  /\n {2}([a-z_]+): \{\s*\n\s*id: "([a-z_]+)",\s*\n\s*name: "([^"]+)",\s*\n\s*appliesTo: "([^"]+)",([\s\S]*?)\n {2}\},/g,
)) {
  const [, key, id, name, appliesTo, rest] = m;
  const values = [...rest.matchAll(/V\("([^"]+)",\s*"((?:[^"\\]|\\.)*)",\s*(\d+),\s*"([a-z]+)"/g)].map(
    (v) => ({ value: v[1], meaning: v[2], order: Number(v[3]), tone: v[4] }),
  );
  taxonomies.push({ key, id, name, appliesTo, hasWhy: /\n\s*why:\s*\n?\s*"/.test(rest), values });
}

if (taxonomies.length === 0) {
  console.error("[taxonomy-lint] Parsed zero taxonomies. Broken parse, not a pass.");
  process.exit(2);
}

let totalValues = 0;

for (const t of taxonomies) {
  const where = `${t.id}`;

  if (t.key !== t.id) err(`${where}: registry key "${t.key}" does not match its id "${t.id}".`);
  if (!t.name) err(`${where}: no name.`);
  if (!t.appliesTo) err(`${where}: no appliesTo — a vocabulary that does not say what it governs.`);
  if (!t.hasWhy) err(`${where}: no "why". A controlled vocabulary with no stated reason is a list.`);
  if (t.values.length === 0) {
    err(`${where}: zero values parsed.`);
    continue;
  }

  totalValues += t.values.length;

  const seen = new Set();
  for (const v of t.values) {
    if (seen.has(v.value)) err(`${where}: "${v.value}" appears twice.`);
    seen.add(v.value);

    if (!/^[A-Z][A-Z0-9_-]*$/.test(v.value)) {
      err(`${where}: "${v.value}" is not SCREAMING_CASE. The canon spells these in caps.`);
    }
    if (!v.meaning || v.meaning.length < 4) {
      err(`${where}: "${v.value}" has no meaning.`);
    }
    if (!TONES.includes(v.tone)) {
      err(`${where}: "${v.value}" has tone "${v.tone}", which is not in the Tone union.`);
    }
  }

  /* Order is a rank that permission and redaction decisions read. A gap
     or a duplicate silently changes one of those decisions. */
  const orders = t.values.map((v) => v.order).sort((a, b) => a - b);
  const expected = Array.from({ length: t.values.length }, (_, i) => i + 1);
  if (orders.join(",") !== expected.join(",")) {
    err(`${where}: order is ${orders.join(",")}, expected ${expected.join(",")} — contiguous from 1.`);
  }
}

/* ── The global critical budget ──────────────────────────────────── */
const criticalsHere = taxonomies.reduce(
  (n, t) => n + t.values.filter((v) => v.tone === "critical").length,
  0,
);
/* Count only tones inside D(...) display entries, not the type union. */
const criticalsInEnums = [...enumSrc.matchAll(/D\(\s*"(?:[^"\\]|\\.)*",\s*"(?:[^"\\]|\\.)*",\s*"critical"/g)].length;
const totalCriticals = criticalsHere + criticalsInEnums;

if (totalCriticals > BUDGET) {
  err(
    `critical tone budget: ${totalCriticals} used against a ceiling of ${BUDGET} ` +
      `(${criticalsInEnums} in enums.ts, ${criticalsHere} in taxonomies.ts). ` +
      `The ceiling is global — a screen where everything is red says nothing. ` +
      `Demote one to hazard, or amend CRITICAL_TONE_BUDGET deliberately.`,
  );
}

/* ── The exported unions must match the registry ─────────────────── */
const unionCheck = [
  ["DisclosureClass", "disclosure_class"],
  ["OperationClass", "operation_class"],
  ["ConfidenceClass", "confidence"],
];
for (const [typeName, id] of unionCheck) {
  const m = src.match(new RegExp(`export type ${typeName} =([\\s\\S]*?);`));
  if (!m) {
    err(`${typeName}: union not found, but the registry declares ${id}.`);
    continue;
  }
  const declared = [...m[1].matchAll(/"([A-Z][A-Z0-9_-]*)"/g)].map((x) => x[1]).sort();
  const actual = (taxonomies.find((t) => t.id === id)?.values ?? []).map((v) => v.value).sort();
  if (declared.join("|") !== actual.join("|")) {
    err(
      `${typeName} does not match ${id}.\n` +
        `      union:    ${declared.join(", ")}\n` +
        `      registry: ${actual.join(", ")}`,
    );
  }
}

/* ── Report ──────────────────────────────────────────────────────── */
if (fail.length) {
  console.error(`\n[taxonomy-lint] FAIL — ${fail.length} finding(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(
  `[taxonomy-lint] OK — ${taxonomies.length} taxonomies, ${totalValues} values, ` +
    `${totalCriticals}/${BUDGET} critical tones used`,
);
