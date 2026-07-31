#!/usr/bin/env node
/**
 * Route Linter — enforces the information architecture
 *
 * Wave 7 · Workspaces
 *
 * Checks:
 *   1. Every route's assembly exists in the registry.
 *   2. Every assembly is reachable by at least one route. An assembly
 *      nobody can navigate to is a screen that was built and lost.
 *   3. ACCESS IS NEVER WIDER THAN THE VANTAGE. The load-bearing check.
 *      A route may not admit someone the aperture tier would not show
 *      the content to — unless it overrides, with a reason.
 *   4. Every override states its reason. An override without one is a
 *      permission granted by whoever edited the file last.
 *   5. Paths are unique, lowercase, have no trailing slash, and every
 *      [param] in the path is declared and vice versa.
 *   6. Only public routes are indexable. An indexed URL behind auth
 *      leaks its existence and usually its title.
 *   7. Every right named by a route exists in lib/authority.ts.
 *   8. Every office route names at least one right — otherwise "office"
 *      means "signed in and hoping".
 *
 * Check 3 is the one that matters. Everything else is hygiene.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

/**
 * Line endings are normalised at the read.
 *
 * This file is edited on Windows and by tools that rewrite it, so it
 * flips between LF and CRLF. A pattern ending `\n` silently stops
 * matching the moment a `\r` appears before it — and the failure mode is
 * a parser that returns ZERO, which reads as "nothing to check" rather
 * than "the check is broken".
 *
 * ufr-lint had exactly this bug and reported a vacuous pass under CRLF.
 * The vacuous-pass guard below catches it now, but the correct fix is to
 * stop the difference existing at all.
 */
const read = (...p) =>
  fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const fail = [];
const warn = [];

const src = read("constants", "routes.ts");
const asmSrc = read("constants", "assemblies.ts");
const authSrc = read("lib", "authority.ts");

// ── Registries, parsed from their own canon ──────────────────────────
const assemblyVantage = new Map();
for (const m of asmSrc.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  const v = (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1];
  if (id) assemblyVantage.set(id, v);
}
/* Which apertures each assembly RENDERS. routesTo is deliberately excluded:
   routing to a wider aperture is the narrow one saying where the rest is
   kept, and it is checked at the destination. */
const assemblyApertures = new Map();
for (const m of asmSrc.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  if (!id) continue;
  const aps = new Set();
  for (const sec of m[1].matchAll(/S\([\s\S]*?\[([^\]]*)\]/g)) {
    for (const a of sec[1].matchAll(/"(AP-\d+)"/g)) aps.add(a[1]);
  }
  assemblyApertures.set(id, [...aps]);
}

/* The vantage each APERTURE sits at, from its own registry. */
const APERTURE_VANTAGE = new Map();
for (const m of read("constants", "apertures.ts")
  .matchAll(/export const \w+: Aperture = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  const v = (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1];
  if (id && v) APERTURE_VANTAGE.set(id, v);
}

const rights = new Set(
  [...(authSrc.match(/export type Right =([\s\S]*?);/) || [, ""])[1]
    .matchAll(/"([a-z_.]+)"/g)].map((m) => m[1]),
);
const ACCESS_RANK = { public: 0, identified: 1, accredited: 2, member: 3, office: 4 };
const ACCESS_FOR_VANTAGE = {
  gateway: "public", space: "public", time: "member",
  member: "member", capital: "office", admin: "office",
};
const GROUP_VANTAGE = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};

/**
 * Resolve `export const NAME = "..." + "..."` from the routes file.
 *
 * Returns "" when the name does not resolve, which the caller treats as a
 * missing reason — so a typo in the constant name fails the build rather
 * than silently passing an override with no justification.
 */
function resolveConst(name) {
  const m = src.match(
    new RegExp(`export const ${name}\\s*=\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+);`),
  );
  if (!m) return "";
  return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("");
}

// ── Parse routes ─────────────────────────────────────────────────────
function routes() {
  const out = [];
  // R("path", "name", "group", assembly, { ... })
  for (const m of src.matchAll(
    /R\(\s*(`[^`]*`|"[^"]*")\s*,\s*(`[^`]*`|"[^"]*")\s*,\s*"(\w+)"\s*,\s*(null|"[^"]*")([\s\S]*?)\n?\s*\),?\n/g,
  )) {
    const tail = m[5];
    const unq = (s) => s.replace(/^[`"]|[`"]$/g, "");
    out.push({
      path: unq(m[1]), name: unq(m[2]), group: m[3],
      assembly: m[4] === "null" ? null : unq(m[4]),
      dynamic: /^`/.test(m[1]),
      params: [...((tail.match(/params:\s*\[([^\]]*)\]/) || [, ""])[1])
        .matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      rightsCited: [...((tail.match(/rights:\s*\[([^\]]*)\]/) || [, ""])[1])
        .matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      override: (() => {
        const o = tail.match(
          /accessOverride:\s*\{\s*access:\s*"(\w+)"[\s\S]*?because:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+|[A-Z][A-Z0-9_]*)/,
        );
        if (!o) return null;
        // A reason may be an inline string OR a named constant declared in
        // the same file. Sixteen passport stages share one reason, and
        // writing it out sixteen times would make it sixteen things to
        // keep in step. Resolving the reference is cheaper than banning it.
        const why = /^[A-Z][A-Z0-9_]*$/.test(o[2].trim())
          ? resolveConst(o[2].trim())
          : [...o[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("");
        return { access: o[1], because: why };
      })(),
      hasOverrideKey: /accessOverride:/.test(tail),
      indexable: (tail.match(/indexable:\s*(true|false)/) || [])[1],
      raw: tail,
    });
  }
  return out;
}

const ROUTES = routes();

if (ROUTES.length === 0 || assemblyVantage.size === 0 || rights.size === 0) {
  console.error("[route-lint] Parsed zero routes, assemblies or rights. Refusing to pass vacuously.");
  process.exit(2);
}
// The template-literal passport stages are generated, not literal, so the
// static count is lower than the runtime count. Both are reported.
const STAGES = ((src.match(/export const PASSPORT_STAGES = \[([\s\S]*?)\] as const;/) || [, ""])[1]
  .match(/"/g) || []).length / 2;

const seen = new Map();
let overrides = 0;
let widenings = 0;

for (const r of ROUTES) {
  // 5. path hygiene
  if (seen.has(r.path)) fail.push(`Duplicate path ${r.path} (also ${seen.get(r.path)})`);
  seen.set(r.path, r.name);
  if (r.path !== r.path.toLowerCase()) fail.push(`${r.path} is not lowercase`);
  if (r.path.length > 1 && r.path.endsWith("/")) fail.push(`${r.path} has a trailing slash`);
  if (!r.path.startsWith("/")) fail.push(`${r.path} does not start with /`);

  const inPath = [...r.path.matchAll(/\[(\w+)\]/g)].map((m) => m[1]);
  if (!r.dynamic) {
    for (const p of inPath) {
      if (!r.params.includes(p)) fail.push(`${r.path} has [${p}] in the path but does not declare it`);
    }
    for (const p of r.params) {
      if (!inPath.includes(p)) fail.push(`${r.path} declares param "${p}" that is not in the path`);
    }
  }

  // 1. the assembly exists
  let vantage = GROUP_VANTAGE[r.group];
  if (r.assembly) {
    if (!assemblyVantage.has(r.assembly)) {
      fail.push(`${r.path} renders ${r.assembly}, which is not in the assembly registry`);
    } else {
      vantage = assemblyVantage.get(r.assembly);
    }
  }

  // 4. overrides state a reason
  if (r.hasOverrideKey && !r.override) {
    fail.push(`${r.path} declares accessOverride with no parsable reason.`);
    continue;
  }
  if (r.override) {
    overrides++;
    if (!r.override.because || r.override.because.length < 40) {
      fail.push(
        `${r.path} overrides access to "${r.override.access}" without a real reason. An override ` +
          `without one is a permission granted by whoever edited the file last.`,
      );
    }
  }

  const derived = ACCESS_FOR_VANTAGE[vantage];
  const access = r.override ? r.override.access : derived;

  // 3. THE LOAD-BEARING CHECK
  //
  // The first version of this compared `access` against `derived` when
  // there was no override — and with no override those are the same value
  // by construction, so it could never fire. Dead code wearing the name of
  // the most important rule in the file.
  //
  // What actually needs enforcing is the case an override creates: a route
  // widened to admit people the APERTURES it renders would never show
  // anything to. An override may relax the route. It may not relax the
  // disclosure model underneath it.
  if (r.override && r.assembly) {
    const widenedTo = ACCESS_RANK[r.override.access];
    for (const apId of assemblyApertures.get(r.assembly) ?? []) {
      const apVantage = APERTURE_VANTAGE.get(apId);
      if (!apVantage) continue;
      const apNeeds = ACCESS_FOR_VANTAGE[apVantage];
      if (widenedTo < ACCESS_RANK[apNeeds]) {
        fail.push(
          `${r.path} is widened to "${r.override.access}" but ${r.assembly} renders ${apId} at ` +
            `the "${apVantage}" vantage, which requires "${apNeeds}". An override may relax the ` +
            `route; it may not relax the disclosure model underneath it.`,
        );
      }
    }
    if (widenedTo < ACCESS_RANK[derived]) widenings++;
  }

  // 6. index only what is public
  const indexable = r.indexable !== undefined ? r.indexable === "true" : access === "public";
  if (indexable && access !== "public") {
    fail.push(
      `${r.path} is indexable but requires "${access}". An indexed URL behind authentication ` +
        `leaks its existence and usually its title.`,
    );
  }

  // 7 + 8. rights
  for (const right of r.rightsCited) {
    if (!rights.has(right)) fail.push(`${r.path} requires "${right}", which is not a declared Right`);
  }
  if (access === "office" && r.rightsCited.length === 0 && r.assembly !== null) {
    warn.push(`${r.path} is an office route naming no right — "office" then means "signed in and hoping".`);
  }
}

// 2. every assembly reachable
{
  const rendered = new Set(ROUTES.map((r) => r.assembly).filter(Boolean));
  const orphan = [...assemblyVantage.keys()].filter((id) => !rendered.has(id));
  // Chrome and regions are composed into other screens rather than routed.
  const COMPOSED = new Set(["AS-20", "AS-21", "AS-22"]);
  const real = orphan.filter((id) => !COMPOSED.has(id));
  if (real.length) {
    fail.push(
      `No route renders ${real.join(", ")}. An assembly nobody can navigate to is a screen that ` +
        `was built and lost.`,
    );
  }
}

// ── Report ────────────────────────────────────────────────────────────
const byAccess = {};
for (const r of ROUTES) {
  let v = GROUP_VANTAGE[r.group];
  if (r.assembly && assemblyVantage.has(r.assembly)) v = assemblyVantage.get(r.assembly);
  const a = r.override ? r.override.access : ACCESS_FOR_VANTAGE[v];
  byAccess[a] = (byAccess[a] || 0) + 1;
}

console.log(
  `[route-lint] ${ROUTES.length} literal routes (+${STAGES} generated passport stages) · ` +
    `${new Set(ROUTES.map((r) => r.group)).size} groups · ${overrides} access override(s)\n`,
);
console.log(
  "  " + Object.entries(byAccess).sort((a, b) => ACCESS_RANK[a[0]] - ACCESS_RANK[b[0]])
    .map(([k, v]) => `${k} ${v}`).join(" · ") + "\n",
);

if (warn.length) {
  console.log(`[route-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[route-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log("[route-lint] PASS — access derives from vantage, every override states its reason,");
console.log("  every assembly is reachable, and nothing behind auth is indexable\n");
process.exit(0);
