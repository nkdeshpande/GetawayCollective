#!/usr/bin/env node
/**
 * ASSEMBLY CSS — ported from the prototype into the application
 *
 * Wave 7 · Workspaces
 *
 * GC-ASSEMBLIES.html carries the real interface for all 28 assemblies:
 * 63 KB of CSS across 294 classes, every value already audited against
 * the locked palette. This lifts it into app/ and renames its local
 * custom properties to the generated `--gc-` names.
 *
 * Renaming rather than rewriting is deliberate. The prototype CSS has
 * been through five contrast sweeps and a dozen corrections; retyping it
 * by hand would discard that and introduce a new set of literals for
 * token-lint to find. The :root block is dropped because dist/tokens.css
 * already declares every one of those values.
 *
 * Regenerate with `npm run assembly:css`, verify with `--check`.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const CHECK = process.argv.includes("--check");
const OUT = path.join(ROOT, "app", "_assemblies", "assemblies.css");

const html = fs
  .readFileSync(path.join(ROOT, "GC-ASSEMBLIES.html"), "utf8")
  .replace(/\r\n/g, "\n");

let css = html.slice(html.indexOf("<style>") + 7, html.indexOf("</style>"));

/* Drop the :root block — dist/tokens.css declares all of it, generated
   from constants/tokens.ts and verified by export-tokens. Two copies of
   a palette is how a palette drifts. */
css = css.replace(/:root\s*\{[\s\S]*?\n\}/, "");

/* Local name → generated token. Ordered longest-first so `--steel-dim`
   is rewritten before `--steel`, and `--copper-deep` before `--copper`. */
const MAP = {
  "--void-panel": "--gc-void-panel",
  "--void": "--gc-void",
  "--paper-panel": "--gc-paper-panel",
  "--paper": "--gc-paper",
  "--mist": "--gc-mist",
  "--ink-inv": "--gc-ink-inverse",
  "--ink": "--gc-ink",
  "--steel-dim": "--gc-steel-dim",
  "--steel": "--gc-steel",
  "--forest-light": "--gc-forest-light",
  "--forest": "--gc-forest",
  "--copper-deep": "--gc-copper-deep",
  "--copper": "--gc-copper",
  "--confirm-deep": "--gc-confirm-deep",
  "--confirm": "--gc-confirm",
  "--hazard-deep": "--gc-hazard-deep",
  "--hazard": "--gc-hazard",
  "--critical-deep": "--gc-critical-deep",
  "--critical": "--gc-critical",
  "--electric": "--gc-electric",
  "--hair-lt": "--gc-hairline",
  "--hair": "--gc-hairline-inv",
  "--f-display": "--gc-font-display",
  "--f-body": "--gc-font-body",
  "--f-mono": "--gc-font-mono",
  "--f-editorial": "--gc-font-editorial",
  "--e-cinema": "--gc-ease-cinema",
  "--e-shutter": "--gc-ease-shutter",
  "--d-instant": "--gc-dur-instant",
  "--d-fast": "--gc-dur-fast",
  "--d-cinema": "--gc-dur-cinema",
  "--d-commit": "--gc-dur-commit",
  "--s-3xs": "--gc-sp-3xs",
  "--s-2xs": "--gc-sp-2xs",
  "--s-xs": "--gc-sp-xs",
  "--s-s": "--gc-sp-s",
  "--s-m": "--gc-sp-m",
  "--s-l": "--gc-sp-l",
  "--s-xl": "--gc-sp-xl",
  "--s-2xl": "--gc-sp-2xl",
  "--s-3xl": "--gc-sp-3xl",
  "--s-4xl": "--gc-sp-4xl",
};

for (const [from, to] of Object.entries(MAP).sort((a, b) => b[0].length - a[0].length)) {
  css = css.split(from + ")").join(to + ")").split(from + ":").join(to + ":");
}

/* Everything the prototype scoped to the document now scopes to the
   assembly root, so the application shell keeps its own base styles. */
css = css.replace(/^body\{/gm, ".gc-assembly{").replace(/^html\{/gm, ".gc-assembly{");

/*
 * WHAT THIS CHECK IS ACTUALLY FOR.
 *
 * A `var(--x)` that resolves to nothing renders as an empty value —
 * silently, with no error anywhere. That is the defect worth catching,
 * and the first version of this check caught it by flagging every
 * custom property outside the `--gc-` namespace.
 *
 * Too broad. A stylesheet may legitimately declare its own LOCAL
 * variable for layout — `.shell { --rail: 240px }` consumed two rules
 * later is not a missing token, it is how a collapsible grid column is
 * written. Flagging it forced a choice between bypassing the check and
 * putting a layout value in the token namespace, where it would be a
 * lie.
 *
 * So the check now asks the precise question: is this property
 * CONSUMED but never DECLARED anywhere in the sheet? A local variable
 * declares itself and passes; a mistyped or retired token does not and
 * still fails.
 */
const declared = new Set(
  [...css.matchAll(/(^|[;{]\s*)(--[a-z0-9-]+)\s*:/g)].map((m) => m[2]),
);
const leftover = [...new Set(
  [...css.matchAll(/var\((--[a-z0-9-]+)/g)]
    .map((m) => m[1])
    .filter((v) => !v.startsWith("--gc-") && !declared.has(v)),
)];

const banner =
  `/* GENERATED — do not edit.\n` +
  ` *\n` +
  ` * Ported from GC-ASSEMBLIES.html by scripts/gen-assembly-css.js.\n` +
  ` * Local custom properties are renamed to the generated --gc- tokens;\n` +
  ` * the prototype's :root block is dropped because dist/tokens.css\n` +
  ` * already declares every value in it.\n` +
  ` *\n` +
  ` * Regenerate: npm run assembly:css\n` +
  ` */\n\n`;

const body = banner + css.trim() + "\n";

if (leftover.length) {
  console.error(`[assembly-css] ${leftover.length} custom propert(ies) did not map: ${leftover.join(", ")}`);
  console.error("  Every one would resolve to nothing at runtime. Add them to MAP and re-run.");
  process.exit(2);
}

if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : null;
  if (cur !== body) {
    console.error("[assembly-css] DRIFT — app/_assemblies/assemblies.css differs from the prototype.");
    console.error("  Run: npm run assembly:css");
    process.exit(1);
  }
  console.log(`[assembly-css] OK — ${(body.length / 1024).toFixed(0)} KB in step with GC-ASSEMBLIES.html`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body);
const classes = new Set([...body.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1])).size;
console.log(`[assembly-css] wrote ${(body.length / 1024).toFixed(0)} KB · ${classes} classes · all tokens mapped`);
