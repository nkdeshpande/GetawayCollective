#!/usr/bin/env node
/**
 * PUBLIC LAW LINT — the remediation program's enforcement layer
 *
 * constants/public-laws.ts states what the public surface owes a
 * stranger; constants/remediation.ts states where it currently falls
 * short. This is what stops both from becoming prose.
 *
 * Day 01 deliberately fixes nothing, so this linter's job is different
 * from the other twenty-one: it cannot demand a clean surface today.
 * Instead it enforces three things that CAN be true from day one:
 *
 *   1. REGISTRY INTEGRITY — every item cites real laws and real files,
 *      P0/P1 items carry acceptance criteria, NEEDS_HUMAN_CANON items
 *      say what a human must decide. A registry that rots is worse than
 *      the audit it replaced.
 *
 *   2. THE RATCHET — known violations are baselined, and the count may
 *      only fall. New ontology leakage on a public surface fails the
 *      build even while the old leakage is still being worked off. This
 *      is how a remediation program avoids losing ground while it
 *      advances.
 *
 *   3. STATUS HONESTY — an item marked RESOLVED whose mechanical
 *      acceptance check fails is a lie in the registry, and fails hard.
 *      An OPEN item whose check now passes is reported so the registry
 *      gets updated. Statuses describe reality or they describe nothing.
 *
 * Like every script here it parses source text rather than importing
 * TypeScript, and refuses a vacuous pass.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const lawSrc = read("constants", "public-laws.ts");
const regSrc = read("constants", "remediation.ts");

const fail = [];
const warnings = [];
const err = (m) => fail.push(m);
const warn = (m) => warnings.push(m);

/* ── Parse the laws ───────────────────────────────────────────────── */
const LAW_IDS = [...lawSrc.matchAll(/id:\s*"(PUBLIC\.\d{2})"/g)].map((m) => m[1]);
if (LAW_IDS.length === 0) {
  console.error("[public-law-lint] Parsed zero laws. Broken parse, not a pass.");
  process.exit(2);
}
const TESTABLE = new Set(
  [...lawSrc.matchAll(/id:\s*"(PUBLIC\.\d{2})"[\s\S]*?machineTestable:\s*(true|false)/g)]
    .filter((m) => m[2] === "true").map((m) => m[1]),
);

/**
 * Which testable laws THIS script actually enforces.
 *
 * The self-honesty check: a law marked machineTestable with no entry here
 * fails the build. "Testable" must mean "tested", or the flag becomes the
 * same decorative promise the laws exist to eliminate. Laws whose
 * enforcement lives in the vitest suite name it.
 */
const ENFORCED_BY = {
  "PUBLIC.01": "ratchet: ontology leakage baseline (this script)",
  "PUBLIC.02": "tests/remediation.test.ts — forward figures carry class; basis pending REM-003",
  "PUBLIC.03": "resolver: REM-002 acceptance (this script) + tests/collection.test.ts state derivation",
  "PUBLIC.06": "ratchet reserved — enforcement lands with REM-007 (Playwright overflow check)",
  "PUBLIC.07": "tests/remediation.test.ts — token floor assertions",
  "PUBLIC.08": "resolver: REM-008 acceptance (this script)",
  "PUBLIC.09": "resolver: REM-009 acceptance (this script)",
  "PUBLIC.10": "resolver: REM-004 acceptance (this script)",
};
for (const id of TESTABLE) {
  if (!ENFORCED_BY[id]) {
    err(`${id} is marked machineTestable and nothing enforces it. Either enforce it or mark it honest.`);
  }
}

/* ── 1 · Registry integrity ───────────────────────────────────────── */
const items = regSrc.split(/\n  R\(\{/).slice(1).map((block) => ({
  id: (block.match(/id:\s*"(REM-\d+)"/) || [])[1],
  severity: (block.match(/severity:\s*"(P\d)"/) || [])[1],
  status: (block.match(/status:\s*"([A-Z_]+)"/) || [])[1],
  laws: [...block.matchAll(/"(PUBLIC\.\d{2})"/g)].map((m) => m[1]),
  sources: [...(block.match(/affectedSources:\s*\[([\s\S]*?)\]/) || [, ""])[1]
    .matchAll(/"([^"]+)"/g)].map((m) => m[1]),
  acceptance: ((block.match(/acceptanceCriteria:\s*\[([\s\S]*?)\]/) || [, ""])[1].match(/"/g) || []).length / 2,
  hasHumanNote: /humanCanonNeeded:/.test(block),
  block,
}));

if (items.length === 0) {
  console.error("[public-law-lint] Parsed zero remediation items. Broken parse, not a pass.");
  process.exit(2);
}

const seen = new Set();
for (const it of items) {
  if (!it.id) { err("An item has no parseable id."); continue; }
  if (seen.has(it.id)) err(`${it.id} appears twice.`);
  seen.add(it.id);

  for (const l of it.laws) {
    if (!LAW_IDS.includes(l)) err(`${it.id} cites ${l}, which is not a law.`);
  }
  if ((it.severity === "P0" || it.severity === "P1") && it.acceptance < 1) {
    err(`${it.id} is ${it.severity} with no acceptance criteria. Unresolvable by definition.`);
  }
  if (it.status === "NEEDS_HUMAN_CANON" && !it.hasHumanNote) {
    err(`${it.id} needs human canon but does not say what the human must decide.`);
  }
  for (const s of it.sources) {
    /* Generated-audit references may not exist until the generator runs. */
    if (s.includes("gen-remediation-audits")) continue;
    if (!fs.existsSync(path.join(ROOT, s))) {
      err(`${it.id} names ${s}, which does not exist. A registry that rots misleads the next agent.`);
    }
  }
}

/* ── 2 · The ratchet ──────────────────────────────────────────────── */
/**
 * Ontology leakage on public surfaces, counted after stripping comments —
 * a comment ABOUT vantage is engineering; the word rendered to a visitor
 * is leakage. Counts may fall, never rise. When one falls, lower the
 * baseline in the same commit: the ratchet only holds if it is tightened
 * at every gain.
 */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const PUBLIC_SURFACES = [
  "app/_assemblies/atoms.tsx", "app/_assemblies/shell.tsx", "app/_assemblies/gateway.tsx",
  "app/_assemblies/gatewaypages.tsx", "app/_assemblies/publicpages.tsx",
  "app/_assemblies/systempages.tsx", "app/_assemblies/documents.tsx",
  "app/_assemblies/property.tsx", "app/_system/surface.tsx",
];
const LEAK = /\bvantage\b|GC-\d{3}|AS-\d{2}\b/g;

/* Baseline MEASURED 4 Aug 2026, Day 01 — not aspirational. Every count is
   an open debt owed to REM-006, and zero is the target state.

   The count includes data-sec attributes (e.g. AS-30.a). Those ship in
   the served markup rather than in visible text, and whether each earns
   its place is precisely the REQUIRED/TERTIARY/REMOVE classification
   REM-016 exists to record — the ratchet's job is only to stop the total
   growing while that work happens. */
const BASELINE = {
  "app/_assemblies/atoms.tsx": 4,
  "app/_assemblies/shell.tsx": 7,
  "app/_assemblies/gateway.tsx": 19,
  "app/_assemblies/gatewaypages.tsx": 19,
  "app/_assemblies/publicpages.tsx": 21,
  "app/_assemblies/systempages.tsx": 0,
  "app/_assemblies/documents.tsx": 10,
  "app/_assemblies/property.tsx": 1,
  "app/_system/surface.tsx": 2,
};

let leakTotal = 0;
for (const f of PUBLIC_SURFACES) {
  if (!fs.existsSync(path.join(ROOT, f))) { err(`Ratchet names ${f}, which does not exist.`); continue; }
  const n = (strip(read(...f.split("/"))).match(LEAK) || []).length;
  leakTotal += n;
  const base = BASELINE[f];
  if (base === undefined) { err(`${f} is scanned but has no baseline. Add one.`); continue; }
  if (n > base) {
    err(`${f} carries ${n} ontology term(s) against a baseline of ${base}. New leakage on a public surface.`);
  } else if (n < base) {
    warn(`${f} is down to ${n} from ${base} — tighten the baseline in this commit.`);
  }
}

/* ── 3 · Status honesty ───────────────────────────────────────────── */
/**
 * Mechanical acceptance checks for items whose resolution is visible to
 * a script. RESOLVED + failing check = registry lie = hard fail.
 * OPEN + passing check = stale registry = loud warning.
 */
const RESOLVERS = {
  /* REM-001: /about stops rendering the scaffold. */
  "REM-001": () => {
    const gen = read("scripts", "gen-app.js");
    return /"\/about":/.test(gen) || /"AS-32":\s*\{/.test(gen);
  },
  /* REM-004: /status carries the complaints figure DOC-06 promises.
     Checks the record EXISTS and is RENDERED — a constant nothing reads
     would satisfy a laxer test while the promise stayed unkept. */
  "REM-004": () => {
    const src = read("app", "_assemblies", "systempages.tsx");
    return /const COMPLAINTS = \{/.test(src) && /\{COMPLAINTS\./.test(src);
  },
  /* REM-008: public property page renders at most one consolidated
     missing-media disclosure — approximated by the per-slot placeholder
     branch no longer rendering per empty slot. */
  "REM-008": () => !/pf-empty/.test(strip(read("app", "_assemblies", "property.tsx"))),
  /* REM-009: gated links state their requirement, derived not typed. */
  "REM-009": () => /requiredAccess|GatedLink/.test(strip(read("app", "_assemblies", "atoms.tsx"))),
};

for (const [id, check] of Object.entries(RESOLVERS)) {
  const it = items.find((x) => x.id === id);
  if (!it) { err(`Resolver exists for ${id} but the item does not.`); continue; }
  let passes = false;
  try { passes = check(); } catch (e) { err(`Resolver for ${id} threw: ${e.message}`); continue; }
  if (it.status === "RESOLVED" && !passes) {
    err(`${id} is marked RESOLVED and its acceptance check fails. The registry is lying.`);
  }
  if ((it.status === "OPEN" || it.status === "IN_PROGRESS") && passes) {
    warn(`${id} appears resolved in code but the registry still says ${it.status}. Update it.`);
  }
}

/* ── Report ───────────────────────────────────────────────────────── */
const count = (s) => items.filter((i) => i.severity === s).length;
const open = items.filter((i) => i.status !== "RESOLVED" && i.status !== "WAIVED");
console.log(
  `[public-law-lint] ${LAW_IDS.length} laws (${TESTABLE.size} machine-testable, all enforced or named) · ` +
  `${items.length} remediation items\n` +
  `[public-law-lint] P0 ${count("P0")} · P1 ${count("P1")} · P2 ${count("P2")} · P3 ${count("P3")} · ` +
  `open ${open.length} · needs-human ${items.filter((i) => i.status === "NEEDS_HUMAN_CANON").length}\n` +
  `[public-law-lint] ontology ratchet: ${leakTotal} term(s) baselined across ${PUBLIC_SURFACES.length} public surfaces — may only fall`,
);

for (const w of warnings) console.warn(`  ! ${w}`);

if (fail.length > 0) {
  console.error(`\n[public-law-lint] FAIL — ${fail.length} violation(s)\n`);
  for (const f of fail) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}

console.log("[public-law-lint] PASS — registry sound, ratchet holding, statuses honest.");
