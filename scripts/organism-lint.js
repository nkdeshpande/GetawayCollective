#!/usr/bin/env node
/**
 * Organism Linter — composite surface integrity
 *
 * Wave 6 · Composite Surface
 *
 * Checks:
 *   1. Every UFR source cited by an organism exists in the registry
 *   2. Every enumKey cited has display metadata
 *   3. Every metric kind is real
 *   4. Every organism has hierarchy — not all fields at one IL level
 *   5. Every organism survives compact density: its highest-priority field
 *      is among the dense ones
 *   6. Every organism states the one question it answers
 *   7. No organism exposes a field that could map a holder to a ballot (I-05)
 *   8. IL levels are 1-6
 *
 * Check 1 is the one that rots quietly: a card cites UFR-0102, the field is
 * later renamed in the registry, and the card goes on citing an id that no
 * longer resolves — rendering blank rather than failing.
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
const ORG = path.join(ROOT, "constants", "organisms.ts");
const UFR = path.join(ROOT, "constants", "ufr.ts");
const ENUMS = path.join(ROOT, "constants", "enums.ts");
const GRAMMAR = path.join(ROOT, "lib", "metric-grammar.ts");

const fail = [];
const warn = [];

const ufrIds = new Set(
  [...fs.readFileSync(UFR, "utf8").replace(/\r\n/g, "\n").matchAll(/ufr:\s*"([^"]+)"/g)].map((m) => m[1]),
);
const enumKeys = new Set(
  [...fs.readFileSync(ENUMS, "utf8").replace(/\r\n/g, "\n").matchAll(/"([\w]+\.[\w]+)":\s*\{/g)].map((m) => m[1]),
);
const metricKinds = new Set(
  (fs.readFileSync(GRAMMAR, "utf8").replace(/\r\n/g, "\n").match(/export type MetricKind\s*=([\s\S]*?);/) || [, ""])[1]
    .match(/"[^"]+"/g)?.map((s) => s.replace(/"/g, "")) ?? [],
);

/** Parse organisms. Each is an object literal with a fields array of F(...) calls. */
function organisms() {
  const src = fs.readFileSync(ORG, "utf8").replace(/\r\n/g, "\n");
  const block = src.match(/export const ORGANISMS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) { console.error("[organism-lint] Could not parse ORGANISMS. Refusing to run."); process.exit(2); }
  const out = [];
  for (const m of block[1].matchAll(/\{\s*\n\s*id:\s*"([^"]+)"([\s\S]*?)\n  \},/g)) {
    const body = m[2];
    const g = (k) => (body.match(new RegExp(`\\b${k}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1];
    const fields = [...body.matchAll(
      /F\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*(\d)\s*,\s*(true|false)\s*(?:,\s*\{([^}]*)\})?\s*\)/g,
    )].map((f) => ({
      source: f[1], label: f[2], il: Number(f[3]), dense: f[4] === "true",
      metric: (f[5]?.match(/metric:\s*"(\w+)"/) || [])[1],
      enumKey: (f[5]?.match(/enumKey:\s*"([\w.]+)"/) || [])[1],
    }));
    out.push({ id: m[1], name: g("name"), answers: g("answers"), fields });
  }
  return out;
}

const ORGANISMS = organisms();
if (ORGANISMS.length === 0 || ufrIds.size === 0) {
  console.error("[organism-lint] Parsed zero organisms or zero UFR ids. Refusing to pass vacuously.");
  process.exit(2);
}

let totalFields = 0;

for (const o of ORGANISMS) {
  totalFields += o.fields.length;

  // 6. states its question
  if (!o.answers || !o.answers.includes("?")) {
    fail.push(`${o.id} does not state the one question it answers. A card without a question is a list.`);
  }
  if (o.fields.length === 0) {
    fail.push(`${o.id} has no fields`);
    continue;
  }

  // 4. hierarchy
  if (new Set(o.fields.map((f) => f.il)).size < 2) {
    fail.push(`${o.id}: every field is at IL-${o.fields[0].il}. A card with no hierarchy reads as noise.`);
  }

  // 5. survives compact
  const dense = o.fields.filter((f) => f.dense);
  const bestIl = Math.min(...o.fields.map((f) => f.il));
  if (dense.length === 0) {
    fail.push(`${o.id} has no dense fields and disappears in compact density`);
  } else if (!dense.some((f) => f.il === bestIl)) {
    fail.push(
      `${o.id}: its highest-priority field (IL-${bestIl}) is not among the dense ones, so the card ` +
        `stops answering its question when the table tightens.`,
    );
  }

  for (const f of o.fields) {
    // 8. IL range
    if (f.il < 1 || f.il > 6) fail.push(`${o.id}.${f.source}: IL-${f.il} is outside 1-6`);

    // 1. UFR sources resolve
    if (/^UFR-\d+$/.test(f.source) && !ufrIds.has(f.source)) {
      fail.push(
        `${o.id} cites ${f.source}, which is not in the registry. A card citing a dead id renders ` +
          `blank rather than failing, so nobody finds out.`,
      );
    }
    if (!/^UFR-\d+$/.test(f.source) && !f.source.startsWith("derived.")) {
      warn.push(`${o.id}.${f.source} is neither a UFR id nor prefixed "derived."`);
    }

    // 2. enum keys resolve
    if (f.enumKey && !enumKeys.has(f.enumKey)) {
      fail.push(`${o.id}.${f.source} cites enum "${f.enumKey}", which has no display metadata`);
    }
    // 3. metric kinds real
    if (f.metric && !metricKinds.has(f.metric)) {
      fail.push(`${o.id}.${f.source} declares metric kind "${f.metric}", which is not in MetricKind`);
    }
    if (!f.label) fail.push(`${o.id}.${f.source} has no label`);
  }

  // 7. I-05 — no field may map a holder to a ballot
  const leak = o.fields.filter((f) => /voter|ballot|votedby|whovoted|votechoice/i.test(f.source + f.label));
  if (leak.length) {
    fail.push(
      `${o.id} exposes ${leak.map((f) => f.source).join(", ")}, which could map a holder to a ballot. ` +
        `The ballot is sealed (I-05); only aggregates are published.`,
    );
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log(
  `[organism-lint] ${ORGANISMS.length} organisms · ${totalFields} fields · ` +
  `${ufrIds.size} registry ids · ${enumKeys.size} enum sets\n`,
);

if (warn.length) {
  console.log(`[organism-lint] ${warn.length} warning(s):`);
  for (const w of warn.slice(0, 10)) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[organism-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[organism-lint] PASS — every source resolves, every card has hierarchy and survives compact\n`);
process.exit(0);
