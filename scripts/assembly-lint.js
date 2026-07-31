#!/usr/bin/env node
/**
 * Assembly Linter — enforces the assembly laws
 *
 * Wave 6.5 · from the Kyoto prototype set
 *
 * Checks:
 *   1. Every organism (O-nn), aperture (AP-nn) and component (A-nn/M-nn)
 *      reference resolves against its own registry.
 *   2. Every assembly states an intent AND what it answers in five seconds.
 *   3. An assembly never composes an aperture from a WIDER vantage than
 *      its own. A screen cannot show more than its vantage permits.
 *   4. Section refs are prefixed by their assembly id, so a section is
 *      addressable from a changelog without ambiguity.
 *   5. Every correction states a source, a canonical position, a reason
 *      and a kind. "For consistency" is not a reason.
 *   6. GROUND_INVERSION points at section refs that exist.
 *   7. No assembly declares a surface strategy — it is derived from the
 *      route, and a second declaration is a second source of truth.
 *
 * Check 3 is the load-bearing one. Everything else is hygiene; that one
 * is the reason the aperture tier exists at all.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");

const fail = [];
const warn = [];

const src = read("constants", "assemblies.ts");

// ── Registries, parsed from their own canon ──────────────────────────
const organismIds = new Set(
  [...read("constants", "organisms.ts").matchAll(/id:\s*"(O-\d+)"/g)].map((m) => m[1]),
);
const componentIds = new Set(
  [...read("constants", "components.ts").matchAll(/ref:\s*"([AM]-\d+)"/g)].map((m) => m[1]),
);
const apertureVantage = new Map();
{
  const ap = read("constants", "apertures.ts");
  for (const m of ap.matchAll(/export const \w+: Aperture = \{([\s\S]*?)\n\};/g)) {
    const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
    const vantage = (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1];
    if (id) apertureVantage.set(id, vantage);
  }
}

/**
 * How much a vantage is permitted to see, ordered.
 *
 * gateway sees least. admin sees most. An assembly at a narrow vantage
 * composing an aperture from a wider one is the failure this catches:
 * a marketing page reaching into the console's disclosure.
 */
const VANTAGE_RANK = { gateway: 0, space: 1, time: 1, member: 2, capital: 3, admin: 4 };

// ── Parse assemblies ─────────────────────────────────────────────────
function assemblies() {
  const out = [];
  for (const m of src.matchAll(/export const (\w+): Assembly = \{([\s\S]*?)\n\};/g)) {
    const b = m[2];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1];
    const sections = [...b.matchAll(
      /S\(\s*"([^"]+)",\s*"([^"]+)",\s*"(\w+)",[\s\S]*?\[([^\]]*)\]([\s\S]*?)(?=\n\s*(?:S\(|\],))/g,
    )].map((s) => ({
      ref: s[1], name: s[2], kind: s[3],
      contains: [...s[4].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      routesTo: [...((s[5].match(/routesTo:\s*\[([^\]]*)\]/) || [, ""])[1])
        .matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    }));
    const corrections = [...b.matchAll(/\{\s*\n\s*source:[\s\S]*?kind:\s*"(\w+)",\s*\n\s*\}/g)]
      .map((c) => ({ kind: c[1], body: c[0] }));
    out.push({
      constName: m[1], id: g("id"), name: g("name"),
      route: g("route"), vantage: g("vantage"),
      intent: g("intent"), answers: g("answers"),
      sections, corrections,
      declaresStrategy: /^\s*strategy:/m.test(b),
    });
  }
  return out;
}

const ASSEMBLIES = assemblies();

if (ASSEMBLIES.length === 0 || organismIds.size === 0 || apertureVantage.size === 0) {
  console.error("[assembly-lint] Parsed zero assemblies, organisms or apertures. Refusing to pass vacuously.");
  process.exit(2);
}

let totalSections = 0;
let totalRefs = 0;
let totalRoutes = 0;

for (const a of ASSEMBLIES) {
  totalSections += a.sections.length;

  // 2. purpose stated, both halves
  if (!a.intent || a.intent.length < 20) {
    fail.push(`${a.id}: no stated intent.`);
  }
  if (!a.answers || a.answers.length < 15) {
    fail.push(
      `${a.id}: does not say what it answers in five seconds. A screen that cannot state that ` +
        `does not have a purpose, it has contents.`,
    );
  }

  // 7. strategy is derived, never declared
  if (a.declaresStrategy) {
    fail.push(`${a.id} declares a surface strategy. It is derived from the route (layout.ts).`);
  }

  if (!(a.vantage in VANTAGE_RANK)) {
    fail.push(`${a.id}: vantage "${a.vantage}" is not a known vantage`);
    continue;
  }

  for (const s of a.sections) {
    // 4. section refs addressable
    if (!s.ref.startsWith(`${a.id}.`)) {
      fail.push(`${a.id}: section "${s.ref}" is not prefixed by its assembly id.`);
    }

    for (const ref of s.contains) {
      totalRefs++;

      if (/^O-\d+$/.test(ref)) {
        if (!organismIds.has(ref)) fail.push(`${s.ref} cites ${ref}, not in the organism registry`);
      } else if (/^[AM]-\d+$/.test(ref)) {
        if (!componentIds.has(ref)) fail.push(`${s.ref} cites ${ref}, not in the component registry`);
      } else if (/^AP-\d+$/.test(ref)) {
        const v = apertureVantage.get(ref);
        if (!v) {
          fail.push(`${s.ref} cites ${ref}, not in the aperture registry`);
          continue;
        }
        // 3. THE LOAD-BEARING CHECK
        if (VANTAGE_RANK[v] > VANTAGE_RANK[a.vantage]) {
          fail.push(
            `${s.ref} composes ${ref}, which sits at the "${v}" vantage, into an assembly at ` +
              `"${a.vantage}". An assembly may compose an aperture; it may never widen one.`,
          );
        }
      } else {
        warn.push(`${s.ref} cites "${ref}", which matches no registry pattern`);
      }
    }

    // A ROUTE to a wider aperture is the opposite of a widening: it is the
    // narrow aperture saying where the rest is kept. It still has to point
    // at a real aperture.
    for (const ref of s.routesTo) {
      totalRoutes++;
      if (!apertureVantage.has(ref)) {
        fail.push(`${s.ref} routes to ${ref}, not in the aperture registry`);
      }
    }
    if (s.routesTo.length && s.contains.some((r) => s.routesTo.includes(r))) {
      fail.push(
        `${s.ref} both renders and routes to the same aperture. One of the two is wrong — a ` +
          `section that already shows it has nowhere to send anyone.`,
      );
    }
  }

  // 5. corrections are arguments, not notes
  for (const c of a.corrections) {
    if (!/because:/.test(c.body)) {
      fail.push(`${a.id}: a correction states no reason.`);
    }
    if (/because:\s*\n?\s*"(?:For consistency|Consistency|To match)/i.test(c.body)) {
      fail.push(
        `${a.id}: a correction gives "consistency" as its reason. Consistency is the result, ` +
          `not the argument.`,
      );
    }
    if (!/^(constitutional|accessibility|vocabulary|numeric|interaction)$/.test(c.kind)) {
      fail.push(`${a.id}: correction kind "${c.kind}" is not one of the five.`);
    }
  }
}

// 8. the working implementation ships only locked tokens
//
// GC-ASSEMBLIES.html is the built form of this registry, so it is subject
// to the same rule as the registry: no design literals. The scan covers
// the stylesheet and inline styles only — a hex quoted in a correction is
// DOCUMENTING a defect ("the source used #4A4A4A at 2.25:1"), which is
// the opposite of committing one.
{
  const BUILT = path.join(ROOT, "GC-ASSEMBLIES.html");
  if (fs.existsSync(BUILT)) {
    const h = fs.readFileSync(BUILT, "utf8");
    const locked = new Set(
      [...read("constants", "tokens.ts").matchAll(/"(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1].toUpperCase()),
    );
    if (locked.size === 0) {
      fail.push("Parsed zero locked colours from tokens.ts. Refusing to check vacuously.");
    } else {
      // Strip CSS and HTML comments first. A hex inside a comment is
      // DOCUMENTING a defect — "opacity .5 on steel renders #3B3B3B at
      // 1.77:1" — which is the opposite of committing one. This is the
      // same distinction the vocabulary linter draws with backtick spans,
      // and the third place it has been needed, so it is worth naming:
      // a check that cannot tell a record from a use will always flag the
      // record, because the record is where the defect is written down.
      const css = h
        .slice(h.indexOf("<style>"), h.indexOf("</style>"))
        .replace(/\/\*[\s\S]*?\*\//g, " ");
      const inline = (h.replace(/<!--[\s\S]*?-->/g, " ").match(/style="[^"]*"/g) || []).join(" ");
      const used = new Set(
        ((css + inline).match(/#[0-9A-Fa-f]{6}\b/g) || []).map((c) => c.toUpperCase()),
      );
      const literals = [...used].filter((c) => !locked.has(c));
      if (literals.length) {
        fail.push(
          `GC-ASSEMBLIES.html styles with ${literals.join(", ")} — not in the locked palette. ` +
            `The built form is subject to the same rule as the registry.`,
        );
      }
    }
    // The waterfall in the built form must account for all of gross revenue.
    const bps = [...h.matchAll(/\{\s*k:"\d+\s*·[^"]*",\s*bps:(\d+)/g)].map((m) => Number(m[1]));
    if (bps.length !== 6) {
      fail.push(`GC-ASSEMBLIES.html declares ${bps.length} waterfall stages, not 6.`);
    } else if (bps.reduce((a, b) => a + b, 0) !== 10000) {
      fail.push(
        `GC-ASSEMBLIES.html waterfall sums to ${bps.reduce((a, b) => a + b, 0) / 100}%. Revenue ` +
          `going somewhere the waterfall does not name is the same defect as omitting a stage, ` +
          `only harder to see.`,
      );
    }
  }
}

// 6. the ground inversion points at real sections
{
  const allRefs = new Set(ASSEMBLIES.flatMap((a) => a.sections.map((s) => s.ref)));
  const block = (src.match(/appliesTo:\s*\[([^\]]*)\]/) || [, ""])[1];
  const cited = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (cited.length === 0) {
    fail.push("GROUND_INVERSION applies to nothing. A rule with no application is a preference.");
  }
  for (const ref of cited) {
    if (!allRefs.has(ref)) fail.push(`GROUND_INVERSION cites section ${ref}, which does not exist`);
  }
}

// ── Report ────────────────────────────────────────────────────────────
const totalCorrections = ASSEMBLIES.reduce((n, a) => n + a.corrections.length, 0);

console.log(
  `[assembly-lint] ${ASSEMBLIES.length} assemblies · ${totalSections} sections · ` +
    `${totalRefs} rendered · ${totalRoutes} routed · ${totalCorrections} corrections\n`,
);

if (warn.length) {
  console.log(`[assembly-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[assembly-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log("[assembly-lint] PASS — every reference resolves, no assembly widens an aperture,");
console.log("  and every correction states a reason\n");
process.exit(0);
