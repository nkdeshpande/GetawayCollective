#!/usr/bin/env node
/**
 * Gate Linter — a public link says what it will ask of you
 *
 * REM-009 · PUBLIC.09.
 *
 * ── THE DEFECT ───────────────────────────────────────────────────────
 * The footer linked `/portfolio`. Property pages linked `/invest/qualify`
 * and `/office`. Each of those routes correctly refuses a visitor who has
 * not signed in — `lib/access.ts` is fail-closed and works. What nothing
 * said was that a requirement existed, so the only way to find the
 * boundary was to walk into it.
 *
 * ── WHAT THIS CHECKS ─────────────────────────────────────────────────
 * Every literal internal link on a PUBLIC surface whose destination is not
 * public must go through `GatedLink`, which reads the requirement from the
 * route table. A hand-typed "sign-in required" beside a plain Link passes
 * nothing here, and that is deliberate: the acceptance criterion is that
 * the label derives from requiredAccess(), never that it exists.
 *
 * ── WHAT IT DOES NOT CHECK ───────────────────────────────────────────
 * Links built at runtime from a variable. A checker that pretended to
 * follow `href={x}` would report a confident zero on exactly the files
 * where it is blindest. Those are counted and printed instead.
 *
 * Zero dependencies. Line endings normalised at the read.
 */

const fs = require("node:fs");
const path = require("node:path");
const { accessResolver } = require("./lib/route-source-parser");

const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8").replace(/\r\n/g, "\n");
const PRAGMA = "gate-lint-ignore";

/**
 * The surfaces a visitor who has never signed in can reach.
 *
 * Enumerated rather than derived, and the reason is worth stating: the
 * renderer for a route is chosen in scripts/gen-app.js by path and by
 * assembly, and resolving that here would be a second copy of the
 * generator's own mapping. This list is short, it changes when a public
 * page is added, and a missing entry shows up as a checker that passes on
 * a file nobody checked — so the count is printed on every run.
 */
const PUBLIC_SURFACES = [
  "app/_assemblies/atoms.tsx",          // header and footer, on every public page
  "app/_assemblies/shell.tsx",          // the shared chrome
  "app/_assemblies/publicpages.tsx",    // PUB.01–PUB.11
  "app/_assemblies/gateway.tsx",        // the grid, the capital explainer, home
  "app/_assemblies/gatewaypages.tsx",   // the footer targets
  "app/_assemblies/property.tsx",       // /collection/[vehicle]
  "app/_assemblies/propertychapters.tsx", // the eight chapters
  "app/_assemblies/about.tsx",
  "app/_assemblies/documents.tsx",      // /legal, /journal
];

const resolve = accessResolver(read("constants/routes.ts"), read("constants/assemblies.ts"));

const fail = [];
const dynamic = [];
let checked = 0;
let gatedOk = 0;

for (const file of PUBLIC_SURFACES) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    fail.push(`${file} is listed as a public surface and does not exist. The list is stale.`);
    continue;
  }
  const src = read(file);
  const lines = src.split("\n");

  lines.forEach((line, i) => {
    if (line.includes(PRAGMA)) return;

    /* A link built from a variable. Counted, never guessed at. */
    if (/href=\{(?!`)/.test(line) && !/href=\{`\//.test(line)) dynamic.push(`${file}:${i + 1}`);

    for (const m of line.matchAll(/href="(\/[^"]*)"/g)) {
      const href = m[1];
      const access = resolve(href);
      if (access === null || access === "public") continue;
      checked++;

      /* The link element carrying this href. GatedLink may open on an
         earlier line, so look back a little rather than at this one. */
      const window = lines.slice(Math.max(0, i - 4), i + 1).join("\n");
      if (/<GatedLink\b/.test(window)) { gatedOk++; continue; }

      fail.push(
        `${file}:${i + 1} — links ${href} (${access}) from a public surface without stating the ` +
        `requirement. Use <GatedLink href="${href}">, which reads it from the route table.`,
      );
    }
  });
}

/* A checker that finds nothing to check is broken, not clean. */
if (checked === 0 && gatedOk === 0) {
  console.error(
    "\n[gate-lint] Found no links from a public surface into a gated route — not one, anywhere.\n" +
    "  That is far more likely to mean the scan is broken than that the defect is gone.\n",
  );
  process.exit(2);
}

console.log(`\n[gate-lint] ${PUBLIC_SURFACES.length} public surfaces · ${checked} link(s) into gated routes`);
console.log(`[gate-lint] ${gatedOk} state their requirement`);
if (dynamic.length) {
  console.log(`\n[gate-lint] ${dynamic.length} link(s) build their href at runtime and are NOT checked here:`);
  for (const d of dynamic.slice(0, 8)) console.log(`  ${d}`);
  if (dynamic.length > 8) console.log(`  …and ${dynamic.length - 8} more`);
  console.log("  Reported rather than guessed at. A checker that followed a variable would");
  console.log("  report a confident zero on the files where it is blindest.");
}

if (fail.length) {
  console.error(`\n[gate-lint] FAIL — ${fail.length} unmarked crossing(s)\n`);
  for (const f of fail) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}
console.log("\n[gate-lint] PASS — every public link into a gated route states its requirement\n");
