#!/usr/bin/env node
/**
 * JOURNAL LINT — the editorial discipline, made mechanical
 *
 * constants/journal-taxonomy.ts states four laws. Three of them are the
 * kind a person keeps for a while and then stops keeping, because the
 * violation never looks like one from inside a single article.
 *
 * That is the whole reason this file exists. Nobody writes a brochure on
 * purpose. They write eleven reasonable pieces about the thing they know
 * best, and the eleventh is indistinguishable from the first — the drift
 * is only ever visible in the distribution, and nothing renders the
 * distribution.
 *
 * Checks:
 *   1. Every meta block uses real values from the taxonomy unions.
 *   2. `disclosure` is present on every entry that carries meta.
 *   3. Depth and stated minutes agree.
 *   4. No entry claims `independent` while pointing into /collection.
 *   5. The Journal's centre of gravity has not moved to the near end.
 *
 * Check 4 is the one with teeth. An entry that discloses independence and
 * then sends the reader to something GC sells has made the disclosure
 * false in the only way that matters, and it is exactly the edit somebody
 * makes at the end of a good article without noticing.
 *
 * Check 5 needs a stated threshold rather than a feeling. Mean distance
 * across the outward Journal must sit at or below OWNERSHIP — meaning at
 * least as much of the publication lives in culture, life and place as in
 * ownership and the Collection.
 *
 * Like every script here this parses source text rather than importing
 * TypeScript, and refuses a vacuous pass: a parse that finds nothing
 * reports a broken parser, not a clean bill.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
/* \r\n normalised at read — see the note in taxonomy-lint.js. */
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const taxSrc = read("constants", "journal-taxonomy.ts");
const src = read("content", "journal.ts");

const fail = [];
const err = (m) => fail.push(m);

/* ── The unions, read from the taxonomy rather than restated here ─── */
const union = (name) => {
  const m = taxSrc.match(new RegExp(`export type ${name} =([\\s\\S]*?);`));
  return m ? [...m[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1]) : [];
};

const CHANNELS = union("Channel");
const DISTANCES = union("Distance");
const FRANCHISES = union("Franchise");
const DEPTHS = union("Depth");
const PERSONAS = union("Persona");
const DISCLOSURES = union("EditorialDisclosure");

for (const [name, list] of Object.entries({
  Channel: CHANNELS, Distance: DISTANCES, Franchise: FRANCHISES,
  Depth: DEPTHS, Persona: PERSONAS, EditorialDisclosure: DISCLOSURES,
})) {
  if (list.length === 0) {
    console.error(`[journal-lint] Parsed zero ${name} values. Broken parse, not a pass.`);
    process.exit(2);
  }
}

/* DISTANCE_RANK, read rather than assumed — the ordering is the measure,
   so hardcoding it here would let the two disagree silently. */
const rankBlock = taxSrc.match(/DISTANCE_RANK: Record<Distance, number> = \{([\s\S]*?)\}/);
const RANK = {};
if (rankBlock) {
  for (const m of rankBlock[1].matchAll(/(\w+):\s*(\d+)/g)) RANK[m[1]] = Number(m[2]);
}
if (Object.keys(RANK).length !== DISTANCES.length) {
  console.error("[journal-lint] DISTANCE_RANK does not cover every Distance. Broken parse or a real gap.");
  process.exit(2);
}

/* Minutes each depth may claim. The taxonomy states these as prose for a
   reader; the numbers are the same statement for a machine. */
const DEPTH_MINUTES = {
  glimpse: [0, 1], note: [1, 3], story: [4, 9], deep: [12, 30], film: [10, 60],
};

/* ── Parse the entries ────────────────────────────────────────────── */
/* One const per entry, so the block for each runs to the next `const J`
   or to the JOURNAL export. */
const entries = [];
const decl = /const (J\d+): Entry = \{([\s\S]*?)\n\};/g;
for (const m of src.matchAll(decl)) entries.push({ name: m[1], block: m[2] });

if (entries.length === 0) {
  console.error("[journal-lint] Parsed zero entries from content/journal.ts. Broken parse, not a pass.");
  process.exit(2);
}

const field = (block, key) => {
  const m = block.match(new RegExp(`\\n  ${key}:\\s*"([^"]*)"`));
  return m ? m[1] : null;
};

let withMeta = 0;
const distanceCount = Object.fromEntries(DISTANCES.map((d) => [d, 0]));
let distanceSum = 0;

for (const e of entries) {
  const slug = field(e.block, "slug") ?? e.name;
  const metaM = e.block.match(/\n  meta: \{([\s\S]*?)\n  \},/);
  if (!metaM) continue;
  withMeta += 1;
  const meta = metaM[1];

  const val = (key) => {
    const m = meta.match(new RegExp(`${key}:\\s*"([a-z-]+)"`));
    return m ? m[1] : null;
  };

  const checks = [
    ["channel", val("channel"), CHANNELS, true],
    ["distance", val("distance"), DISTANCES, true],
    ["franchise", val("franchise"), FRANCHISES, false],
    ["depth", val("depth"), DEPTHS, true],
    ["persona", val("persona"), PERSONAS, true],
    ["disclosure", val("disclosure"), DISCLOSURES, true],
  ];

  for (const [key, v, list, required] of checks) {
    if (v === null) {
      if (required) err(`${slug}: meta is missing \`${key}\`.`);
      continue;
    }
    if (!list.includes(v)) err(`${slug}: \`${key}: "${v}"\` is not a value in the taxonomy.`);
  }

  /* alsoFor is an array, so it is read separately. */
  const alsoM = meta.match(/alsoFor:\s*\[([^\]]*)\]/);
  if (alsoM) {
    for (const p of [...alsoM[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1])) {
      if (!PERSONAS.includes(p)) err(`${slug}: \`alsoFor\` names "${p}", which is not a persona.`);
    }
  }

  /* 3 · Depth and minutes agree. A "deep read" billed at six minutes has
     mis-set the reader's expectation before the first sentence. */
  const depth = val("depth");
  const minutesM = e.block.match(/\n  minutes: (\d+)/);
  if (depth && DEPTH_MINUTES[depth] && minutesM) {
    const [lo, hi] = DEPTH_MINUTES[depth];
    const mins = Number(minutesM[1]);
    if (mins < lo || mins > hi) {
      err(`${slug}: depth "${depth}" expects ${lo}–${hi} minutes; the entry claims ${mins}.`);
    }
  }

  /* 4 · Independence that points at the shop is not independence. */
  const disclosure = val("disclosure");
  if (disclosure === "independent") {
    const onward = e.block.match(/onward: \[([\s\S]*?)\n  \]/);
    const paths = onward ? [...onward[1].matchAll(/path:\s*"([^"]+)"/g)].map((x) => x[1]) : [];
    const sells = paths.filter((p) => p.startsWith("/collection/") && p.split("/").length > 3);
    if (sells.length > 0) {
      err(
        `${slug}: declares \`independent\` and then sends the reader to ${sells.join(", ")}. ` +
        `Use "gc-owns" or point somewhere GC does not sell.`,
      );
    }
  }

  const distance = val("distance");
  if (distance && distance in RANK) {
    distanceCount[distance] += 1;
    distanceSum += RANK[distance];
  }
}

/* ── 5 · The distribution ─────────────────────────────────────────── */
/* Measured only across entries that carry meta. The eight originals
   predate the axis and are all the platform explaining itself; counting
   them would fail the check permanently and for the wrong reason. */
const CEILING = RANK.ownership;
let mean = 0;
if (withMeta > 0) {
  mean = distanceSum / withMeta;
  if (mean > CEILING) {
    err(
      `The Journal's centre of gravity is ${mean.toFixed(2)}, past OWNERSHIP (${CEILING}). ` +
      `It has drifted toward the Collection. Publish something further out before adding more near it.`,
    );
  }
}

/* ── Report ───────────────────────────────────────────────────────── */
const label = DISTANCES.map((d) => `${d} ${distanceCount[d]}`).join(" · ");
console.log(
  `[journal-lint] ${entries.length} entries · ${withMeta} carry editorial meta\n` +
  `[journal-lint] distance: ${label}` +
  (withMeta ? ` · mean ${mean.toFixed(2)} (ceiling ${CEILING})` : ""),
);

if (fail.length > 0) {
  console.error(`\n[journal-lint] FAIL — ${fail.length} violation(s)\n`);
  for (const f of fail) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}

console.log("[journal-lint] PASS — every entry declares its axes; the distribution holds.");
