#!/usr/bin/env node
/**
 * UFR Linter — enforces invariant E-06 ("No field exists without a Registry ID")
 * and the internal consistency of the registry itself.
 *
 * Wave 2 · Semantic Core
 *
 * Checks:
 *   1. UFR ids are unique                    — reuse repoints history at a new meaning
 *   2. (object, field_name) pairs are unique — two definitions of one field is the
 *                                              exact failure the registry exists to stop
 *   3. Every ratified L2 object has coverage — an object with no fields is undeclared
 *   4. Every reference points at a real object
 *   5. Every cited invariant exists in the constitution
 *   6. enum fields declare values; reference fields declare a target
 *   7. Field names are snake_case
 *   8. Computed fields are not also required-on-write
 *
 * Invariant ids are PARSED from L1-01, not duplicated here — the same reason
 * vocab-lint parses vocabulary.ts. A checker with its own copy of the canon
 * becomes a second canon and drifts.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const UFR_SRC = path.join(ROOT, "constants", "ufr.ts");
const BO_SRC = path.join(ROOT, "constants", "business-objects.ts");
const L1 = path.join(ROOT, "constitution", "L1-01-ENTERPRISE-CONSTITUTION.md");

const fail = [];
const warn = [];

// ── Parse the constitution for canonical invariant ids ────────────────
function canonicalInvariants() {
  const src = fs.readFileSync(L1, "utf8");
  const ids = new Set();
  const re = /^\|\s*\*{0,2}([EAIF]-\d{2})\*{0,2}\s*\|/gm;
  let m;
  while ((m = re.exec(src)) !== null) ids.add(m[1]);
  return ids;
}

// ── Parse the ratified object enum ────────────────────────────────────
function ratifiedObjects() {
  const src = fs.readFileSync(BO_SRC, "utf8");
  const block = src.match(/export enum BusinessObjectType \{([\s\S]*?)\n\}/);
  if (!block) {
    console.error("[ufr-lint] Could not parse BusinessObjectType. Refusing to run.");
    process.exit(2);
  }
  const out = new Map();
  const re = /^\s*(\w+)\s*=\s*"([^"]+)"/gm;
  let m;
  while ((m = re.exec(block[1])) !== null) out.set(m[1], m[2]);
  return out;
}

// ── Parse the registry ────────────────────────────────────────────────
function parseRegistry() {
  const src = fs.readFileSync(UFR_SRC, "utf8");
  const entries = [];
  // Each entry is an F({ ... }) call. Line-ending agnostic on purpose:
  // an earlier version anchored on "}),\n" and silently parsed zero entries
  // the moment the file was rewritten with CRLF.
  const re = /F\(\{([\s\S]*?)\}\),/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    const get = (k) => {
      const s = body.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`));
      return s ? s[1] : undefined;
    };
    const getBool = (k) => new RegExp(`\\b${k}:\\s*true`).test(body);
    const getObj = () => {
      const s = body.match(/object:\s*BusinessObjectType\.(\w+)/);
      return s ? s[1] : undefined;
    };
    const getRef = () => {
      const s = body.match(/references:\s*BusinessObjectType\.(\w+)/);
      return s ? s[1] : undefined;
    };
    const getInvs = () => {
      const s = body.match(/invariants:\s*\[([^\]]*)\]/);
      if (!s) return [];
      return [...s[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    };
    const hasValues = /values:\s*\[/.test(body);

    entries.push({
      ufr: get("ufr"),
      name: get("name"),
      object: getObj(),
      type: get("type"),
      required: getBool("required"),
      computed: getBool("computed"),
      references: getRef(),
      invariants: getInvs(),
      hasValues,
      description: get("description") || "",
    });
  }
  return entries;
}

// ── Run ───────────────────────────────────────────────────────────────
const INVARIANTS = canonicalInvariants();
const OBJECTS = ratifiedObjects();
const REG = parseRegistry();

if (REG.length === 0) {
  console.error("[ufr-lint] Parsed zero registry entries. Refusing to pass vacuously.");
  process.exit(2);
}

// 1. unique ids
const seenId = new Map();
for (const e of REG) {
  if (!e.ufr) { fail.push(`entry for "${e.name}" has no UFR id`); continue; }
  if (seenId.has(e.ufr)) {
    fail.push(`duplicate UFR id ${e.ufr} — "${e.name}" and "${seenId.get(e.ufr)}". Ids are permanent and never reused.`);
  }
  seenId.set(e.ufr, e.name);
}

// 2. unique (object, name)
const seenPair = new Map();
for (const e of REG) {
  const key = `${e.object}.${e.name}`;
  if (seenPair.has(key)) {
    fail.push(`duplicate field ${key} — defined at ${seenPair.get(key)} and ${e.ufr}. One concept, one definition.`);
  }
  seenPair.set(key, e.ufr);
}

// 3. every ratified object covered
const covered = new Set(REG.map((e) => e.object));
for (const [name] of OBJECTS) {
  if (!covered.has(name)) {
    fail.push(`L2 object "${name}" is ratified but has no UFR fields. Every object must be declared before implementation.`);
  }
}

// 4. references resolve
for (const e of REG) {
  if (e.type === "reference" && !e.references) {
    fail.push(`${e.ufr} "${e.name}" is type reference but declares no target object`);
  }
  if (e.references && !OBJECTS.has(e.references)) {
    fail.push(`${e.ufr} "${e.name}" references "${e.references}", which is not a ratified L2 object`);
  }
}

// 5. cited invariants exist
for (const e of REG) {
  for (const inv of e.invariants) {
    if (!INVARIANTS.has(inv)) {
      fail.push(`${e.ufr} "${e.name}" cites invariant ${inv}, which does not exist in L1-01`);
    }
  }
}

// 6. enums declare values
for (const e of REG) {
  if (e.type === "enum" && !e.hasValues) {
    fail.push(`${e.ufr} "${e.name}" is type enum but declares no closed value set`);
  }
}

// 7. snake_case
for (const e of REG) {
  if (e.name && !/^[a-z][a-z0-9_]*$/.test(e.name)) {
    fail.push(`${e.ufr} "${e.name}" is not snake_case`);
  }
}

// 8. computed fields should not be written
for (const e of REG) {
  if (e.computed && e.type === "reference") {
    warn.push(`${e.ufr} "${e.name}" is computed AND a reference — confirm it is derived, not written`);
  }
}

// 9. description quality
for (const e of REG) {
  if (!e.description || e.description.length < 20) {
    warn.push(`${e.ufr} "${e.name}" has a thin description. If two people could read it differently, rewrite it.`);
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log(`[ufr-lint] ${REG.length} fields · ${covered.size}/${OBJECTS.size} objects covered · ${INVARIANTS.size} canonical invariants\n`);

if (warn.length) {
  console.log(`[ufr-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[ufr-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

const byInv = {};
for (const e of REG) for (const i of e.invariants) byInv[i] = (byInv[i] || 0) + 1;
const enforced = Object.keys(byInv).sort();
console.log(`[ufr-lint] PASS — invariant coverage: ${enforced.length} invariants have field-level enforcement`);
console.log(`  ${enforced.join(" ")}\n`);
process.exit(0);
