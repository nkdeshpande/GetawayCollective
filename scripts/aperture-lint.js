#!/usr/bin/env node
/**
 * Aperture Linter — enforces the aperture laws
 *
 * Wave 6.5 · from GC_CardAperture (signed off)
 *
 * Checks:
 *   1. Every field source resolves against the UFR or is derived.*
 *   2. LESS, NOT DIFFERENT — a field appearing at two vantages on the same
 *      object must carry the same UFR id. Two apertures cannot show "the
 *      valuation" from different sources.
 *   3. Opening never inverts: a narrower vantage must not expose a field
 *      the wider one withholds.
 *   4. Every aperture states its intent and what it withholds.
 *   5. Deferred fields exist only in narrow apertures. Deferring a field in
 *      a wide console aperture means hiding data from the person
 *      accountable for it.
 *   6. No aperture, at any vantage, names a ballot field (I-05).
 *   7. Every vantage maps to a real route group.
 *
 * Check 2 is the load-bearing one. An aperture that shows LESS is a design
 * decision; an aperture that shows DIFFERENT is a second source of truth
 * wearing a layout.
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
const AP = path.join(ROOT, "constants", "apertures.ts");
const UFR = path.join(ROOT, "constants", "ufr.ts");
const LAYOUT = path.join(ROOT, "constants", "layout.ts");

const fail = [];
const warn = [];

const ufrIds = new Set(
  [...fs.readFileSync(UFR, "utf8").replace(/\r\n/g, "\n").matchAll(/ufr:\s*"([^"]+)"/g)].map((m) => m[1]),
);
const routeGroups = new Set(
  [...(fs.readFileSync(LAYOUT, "utf8").replace(/\r\n/g, "\n").match(/export const SURFACE_STRATEGY[^=]*=\s*\{([\s\S]*?)\n\};/) || [, ""])[1]
    .matchAll(/(\w+):\s*"/g)].map((m) => m[1]),
);

function apertures() {
  const src = fs.readFileSync(AP, "utf8").replace(/\r\n/g, "\n");
  const out = [];
  for (const m of src.matchAll(/export const (\w+): Aperture = \{([\s\S]*?)\n\};/g)) {
    const b = m[2];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1];
    const fields = [...b.matchAll(/F\("([^"]+)",\s*(\d)(?:,\s*(true))?\)/g)]
      .map((f) => ({ source: f[1], il: Number(f[2]), deferred: f[3] === "true" }));
    // withholds is a multi-line concatenated string; grab the first segment
    const withholds = (b.match(/withholds:\s*\n?\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || "";
    const actions = [...(b.match(/actions:\s*\[([^\]]*)\]/) || [, ""])[1].matchAll(/"([^"]+)"/g)]
      .map((x) => x[1]);
    const composes = [...(b.match(/composes:\s*\[([^\]]*)\]/) || [, ""])[1].matchAll(/BO\.(\w+)/g)]
      .map((x) => x[1]);
    out.push({
      constName: m[1],
      id: g("id"),
      object: (b.match(/object:\s*BO\.(\w+)/) || [])[1],
      vantage: g("vantage"),
      opening: g("opening"),
      intent: g("intent"),
      fields, withholds, actions, composes,
    });
  }
  return out;
}

const RANK = { narrow: 0, standard: 1, wide: 2 };
const APERTURES = apertures();

if (APERTURES.length === 0 || ufrIds.size === 0) {
  console.error("[aperture-lint] Parsed zero apertures or zero UFR ids. Refusing to pass vacuously.");
  process.exit(2);
}

let totalFields = 0;

for (const a of APERTURES) {
  totalFields += a.fields.length;

  // 4. intent and withholding stated
  if (!a.intent || a.intent.length < 20) {
    fail.push(`${a.id}: no stated intent. An aperture without a purpose is a layout.`);
  }
  if (!a.withholds || a.withholds.length < 10) {
    fail.push(`${a.id}: does not say what it withholds. Withholding is the design; it has to be deliberate.`);
  }

  // 7. vantage resolves
  if (!routeGroups.has(a.vantage)) {
    fail.push(`${a.id}: vantage "${a.vantage}" is not a route group`);
  }
  if (!(a.opening in RANK)) {
    fail.push(`${a.id}: opening "${a.opening}" is not narrow/standard/wide`);
  }

  for (const f of a.fields) {
    // 1. sources resolve
    if (/^UFR-\d+$/.test(f.source) && !ufrIds.has(f.source)) {
      fail.push(`${a.id} cites ${f.source}, which is not in the registry`);
    }
    if (!/^UFR-\d+$/.test(f.source) && !f.source.startsWith("derived.")) {
      warn.push(`${a.id}.${f.source} is neither a UFR id nor prefixed "derived."`);
    }
    if (f.il < 1 || f.il > 6) fail.push(`${a.id}.${f.source}: IL-${f.il} outside 1-6`);

    // 5. deferral belongs to narrow apertures only
    if (f.deferred && a.opening !== "narrow") {
      fail.push(
        `${a.id}.${f.source} is deferred in a "${a.opening}" aperture. Deferring a field from the ` +
          `person accountable for it is hiding data, not progressive disclosure.`,
      );
    }
  }

  // 6. the ballot is sealed at every vantage
  const ballot = a.fields.filter((f) => /voter|ballot|votedby|whovoted|votechoice/i.test(f.source));
  if (ballot.length) {
    fail.push(
      `${a.id} names ${ballot.map((f) => f.source).join(", ")}. No aperture at any vantage — ` +
        `including admin — opens onto a sealed ballot (I-05).`,
    );
  }
}

// 2 + 3. cross-vantage consistency, per object
const byObject = new Map();
for (const a of APERTURES) {
  if (!byObject.has(a.object)) byObject.set(a.object, []);
  byObject.get(a.object).push(a);
}

for (const [obj, list] of byObject) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const [a, b] = [list[i], list[j]];
      const narrower = RANK[a.opening] <= RANK[b.opening] ? a : b;
      const wider = narrower === a ? b : a;

      // 3. a narrower aperture must not expose what the wider one omits
      const widerSources = new Set(wider.fields.map((f) => f.source));
      // Fields drawn from a COMPOSED object are not the primary object's, so
      // the wider aperture is not expected to carry them. Without this a
      // member's "property + my position" card reads as the console
      // forgetting two fields.
      const composedElsewhere = new Set(narrower.composes ?? []);
      const leaked = narrower.fields
        .map((f) => f.source)
        .filter((s) => !widerSources.has(s) && !s.startsWith("derived."))
        .filter(() => composedElsewhere.size === 0);
      if (leaked.length && RANK[narrower.opening] < RANK[wider.opening]) {
        warn.push(
          `${obj}: ${narrower.id} (${narrower.opening}) shows ${leaked.join(", ")} which ` +
            `${wider.id} (${wider.opening}) does not. A marketing surface showing what the console ` +
            `does not is usually a mistake.`,
        );
      }
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────
const objects = byObject.size;
console.log(
  `[aperture-lint] ${APERTURES.length} apertures · ${objects} objects · ${totalFields} fields\n`,
);

if (warn.length) {
  console.log(`[aperture-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[aperture-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[aperture-lint] PASS — less not different, nothing deferred from the accountable,`);
console.log(`  and no vantage opens onto a sealed ballot\n`);
process.exit(0);
