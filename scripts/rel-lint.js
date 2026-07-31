#!/usr/bin/env node
/**
 * Relationship Linter — enforces invariant E-05
 * "No orphan object; no undeclared relationship."
 *
 * Wave 2 · Semantic Core
 *
 * Checks:
 *   1. Every UFR reference field has exactly one declared relationship
 *   2. Every declared relationship points at a real UFR reference field,
 *      and its from/to agree with that field's object/references
 *   3. Every non-root object reaches a declared root
 *   4. No required-reference cycles — a cycle makes its members mutually
 *      uncreatable, which is a defect no test would otherwise surface until
 *      the first insert
 *   5. Roots are declared, never inferred
 *   6. Delete semantics are declared on every edge
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
const UFR_SRC = path.join(ROOT, "constants", "ufr.ts");
const REL_SRC = path.join(ROOT, "constants", "relationships.ts");
const BO_SRC = path.join(ROOT, "constants", "business-objects.ts");

const fail = [];
const warn = [];

function objects() {
  const src = fs.readFileSync(BO_SRC, "utf8").replace(/\r\n/g, "\n");
  const block = src.match(/export enum BusinessObjectType \{([\s\S]*?)\n\}/);
  if (!block) { console.error("[rel-lint] cannot parse BusinessObjectType"); process.exit(2); }
  return [...block[1].matchAll(/^\s*(\w+)\s*=\s*"/gm)].map((m) => m[1]);
}

/** Reference fields declared in the UFR. */
function ufrReferences() {
  const src = fs.readFileSync(UFR_SRC, "utf8").replace(/\r\n/g, "\n");
  const out = [];
  for (const m of src.matchAll(/F\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const ref = b.match(/references:\s*BusinessObjectType\.(\w+)/);
    if (!ref) continue;
    out.push({
      ufr: (b.match(/ufr:\s*"([^"]+)"/) || [])[1],
      name: (b.match(/name:\s*"([^"]+)"/) || [])[1],
      from: (b.match(/object:\s*BusinessObjectType\.(\w+)/) || [])[1],
      to: ref[1],
      required: /required:\s*true/.test(b),
    });
  }
  return out;
}

function relationships() {
  const src = fs.readFileSync(REL_SRC, "utf8").replace(/\r\n/g, "\n");
  const out = [];
  for (const m of src.matchAll(/R\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    out.push({
      id: (b.match(/id:\s*"([^"]+)"/) || [])[1],
      from: (b.match(/from:\s*BO\.(\w+)/) || [])[1],
      to: (b.match(/to:\s*BO\.(\w+)/) || [])[1],
      via: (b.match(/via:\s*"([^"]+)"/) || [])[1],
      required: /required:\s*true/.test(b),
      onParentDelete: (b.match(/onParentDelete:\s*"([^"]+)"/) || [])[1],
      rationale: (b.match(/rationale:\s*"([^"]*)"/) || [])[1] || "",
    });
  }
  return out;
}

function roots() {
  const src = fs.readFileSync(REL_SRC, "utf8").replace(/\r\n/g, "\n");
  const block = src.match(/ROOT_OBJECTS[^=]*=\s*\[([\s\S]*?)\]/);
  if (!block) { console.error("[rel-lint] cannot parse ROOT_OBJECTS"); process.exit(2); }
  return [...block[1].matchAll(/BO\.(\w+)/g)].map((m) => m[1]);
}

// ── Run ───────────────────────────────────────────────────────────────
const OBJECTS = objects();
const REFS = ufrReferences();
const RELS = relationships();
const ROOTS = roots();

if (RELS.length === 0) {
  console.error("[rel-lint] Parsed zero relationships. Refusing to pass vacuously.");
  process.exit(2);
}

// 1 + 2. reference fields <-> relationships, bijective
const byVia = new Map();
for (const r of RELS) {
  if (byVia.has(r.via)) {
    fail.push(`${r.id} and ${byVia.get(r.via).id} both claim field ${r.via}. One edge per field.`);
  }
  byVia.set(r.via, r);
}

for (const f of REFS) {
  const r = byVia.get(f.ufr);
  if (!r) {
    fail.push(`UNDECLARED RELATIONSHIP: ${f.from}.${f.name} (${f.ufr}) references ${f.to} but no relationship declares it. A foreign key nobody declared is a relationship nobody governs.`);
    continue;
  }
  if (r.from !== f.from) fail.push(`${r.id} declares from=${r.from} but ${f.ufr} sits on ${f.from}`);
  if (r.to !== f.to) fail.push(`${r.id} declares to=${r.to} but ${f.ufr} references ${f.to}`);
  if (r.required !== f.required) {
    fail.push(`${r.id} required=${r.required} but ${f.ufr} required=${f.required}. Optionality must agree between the field and the edge.`);
  }
}

for (const r of RELS) {
  if (!REFS.some((f) => f.ufr === r.via)) {
    fail.push(`${r.id} declares via=${r.via}, which is not a UFR reference field`);
  }
  if (!OBJECTS.includes(r.from)) fail.push(`${r.id} from=${r.from} is not a ratified object`);
  if (!OBJECTS.includes(r.to)) fail.push(`${r.id} to=${r.to} is not a ratified object`);
  if (!r.onParentDelete) fail.push(`${r.id} declares no onParentDelete. Unspecified delete semantics become whatever the ORM defaults to.`);
  if (!r.rationale || r.rationale.length < 20) warn.push(`${r.id} has a thin rationale`);
}

// 5. roots are real objects
for (const rt of ROOTS) {
  if (!OBJECTS.includes(rt)) fail.push(`declared root "${rt}" is not a ratified object`);
}

// 3. every non-root reaches a root
const parents = new Map(OBJECTS.map((o) => [o, []]));
for (const r of RELS) parents.get(r.from)?.push(r.to);

function reachesRoot(o, seen = new Set()) {
  if (ROOTS.includes(o)) return true;
  if (seen.has(o)) return false;
  seen.add(o);
  return (parents.get(o) || []).some((p) => reachesRoot(p, seen));
}

for (const o of OBJECTS) {
  if (ROOTS.includes(o)) continue;
  const edges = (parents.get(o) || []).length + RELS.filter((r) => r.to === o).length;
  if (edges === 0) {
    fail.push(`ORPHAN: ${o} has no edges in either direction and is not a declared root.`);
  } else if (!reachesRoot(o)) {
    fail.push(`ORPHAN: ${o} has edges but no path to any declared root (${ROOTS.join(", ")}).`);
  }
}

// 4. no required-reference cycles
const reqParents = new Map(OBJECTS.map((o) => [o, []]));
for (const r of RELS) if (r.required && r.from !== r.to) reqParents.get(r.from)?.push(r.to);

const done = new Set();
let remaining = [...OBJECTS];
let order = [];
for (;;) {
  const ready = remaining.filter((o) => (reqParents.get(o) || []).every((p) => done.has(p)));
  if (ready.length === 0) break;
  for (const o of ready) { order.push(o); done.add(o); }
  remaining = remaining.filter((o) => !done.has(o));
  if (remaining.length === 0) break;
}
if (remaining.length) {
  fail.push(`REQUIRED-REFERENCE CYCLE among: ${remaining.join(", ")}. These objects each require one of the others to exist first, so none can ever be created.`);
}

// ── Report ────────────────────────────────────────────────────────────
console.log(`[rel-lint] ${RELS.length} relationships · ${REFS.length} reference fields · ${ROOTS.length} declared roots\n`);

if (warn.length) {
  console.log(`[rel-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[rel-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[rel-lint] PASS — graph connected, no undeclared edges, no required cycles`);
console.log(`  roots: ${ROOTS.join(", ")}`);
console.log(`  creation order: ${order.slice(0, 8).join(" -> ")} -> ...\n`);
process.exit(0);
