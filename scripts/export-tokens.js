#!/usr/bin/env node
/**
 * Token Package export — GC Design System v3.0 LOCKED
 *
 * Single source: constants/tokens.ts (which is itself downstream of
 * GC-DesignSystem.html under the Design Supremacy Clause, L1-01 §29).
 *
 * Emits:
 *   dist/tokens.json  — for design tools, docs, and non-TS consumers
 *   dist/tokens.css   — custom properties for runtime
 *
 * Zero dependencies. Node >= 18.
 *
 * Also runs a DRIFT CHECK: every COLOUR, FONT, SPACE and MOTION token defined
 * in TypeScript must appear in CSS_VARS. Without this, a token added to TS but
 * forgotten in the CSS block silently exists in one half of the system only —
 * exactly the divergence the Design Supremacy Clause exists to prevent.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'constants', 'tokens.ts');
const OUT_DIR = path.join(ROOT, 'dist');

function loadTokens() {
  const raw = fs.readFileSync(SRC, 'utf8');
  // tokens.ts is plain object literals plus `export` and `as const`.
  // Strip both and evaluate; no transpiler needed.
  const js = raw.replace(/\bexport\s+/g, '').replace(/\s+as\s+const/g, '');
  const names = [
    'COLOUR', 'FONT', 'SPACE', 'MOTION', 'RADIUS',
    'IL', 'METRIC_COLOUR', 'DENSITY', 'MODE', 'CSS_VARS',
  ];
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${js}\nreturn {${names.join(',')}};`);
  return fn();
}

/** Every token that must be reachable from CSS. */
function expectedCssVars(t) {
  const expect = [];
  const skip = new Set(['strokeIdle', 'strokeActive']); // emitted as literals
  for (const k of Object.keys(t.COLOUR)) {
    if (!skip.has(k)) expect.push({ group: 'COLOUR', key: k, value: t.COLOUR[k] });
  }
  for (const k of Object.keys(t.FONT)) expect.push({ group: 'FONT', key: k, value: t.FONT[k] });
  for (const k of Object.keys(t.SPACE)) expect.push({ group: 'SPACE', key: k, value: t.SPACE[k] });
  for (const k of Object.keys(t.MOTION.ease)) {
    expect.push({ group: 'MOTION.ease', key: k, value: t.MOTION.ease[k] });
  }
  for (const k of Object.keys(t.MOTION.duration)) {
    expect.push({ group: 'MOTION.duration', key: k, value: t.MOTION.duration[k] });
  }
  return expect;
}

function driftCheck(t) {
  const css = t.CSS_VARS;
  // A token is present if its resolved VALUE appears in the generated CSS.
  // Value-matching rather than name-matching: it catches a var that was wired
  // to the wrong token, which a name check would pass.
  const missing = expectedCssVars(t).filter((e) => !css.includes(String(e.value)));
  return missing;
}

function main() {
  const t = loadTokens();

  const missing = driftCheck(t);
  if (missing.length) {
    console.error('[export-tokens] DRIFT — tokens defined in TypeScript but absent from CSS_VARS:\n');
    for (const m of missing) {
      console.error(`  ${m.group}.${m.key}  =  ${m.value}`);
    }
    console.error('\nAdd them to CSS_VARS in constants/tokens.ts, then re-run.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const json = {
    $schema: 'https://design-tokens.org/schema.json',
    name: 'GC Design System',
    version: '3.0-LOCKED',
    source: 'GC-DesignSystem.html via constants/tokens.ts',
    authority: 'L1-01 §29 Design Supremacy Clause',
    generated: 'run scripts/export-tokens.js to regenerate — do not edit by hand',
    colour: t.COLOUR,
    font: t.FONT,
    space: t.SPACE,
    motion: t.MOTION,
    radius: t.RADIUS,
    informationHierarchy: t.IL,
    metricColour: t.METRIC_COLOUR,
    density: t.DENSITY,
    mode: t.MODE,
  };

  fs.writeFileSync(path.join(OUT_DIR, 'tokens.json'), `${JSON.stringify(json, null, 2)}\n`, 'utf8');

  const header = [
    '/* GC Design System — v3.0 LOCKED',
    ' * GENERATED FILE — do not edit.',
    ' * Source: constants/tokens.ts · regenerate with `npm run tokens`',
    ' * Authority: L1-01 §29 Design Supremacy Clause',
    ' */',
    '',
  ].join('\n');

  // ── Addendum A ──────────────────────────────────────────────────────
  // Appends; never shadows a core token. The core module does not import
  // the addendum, so precedence cannot be reversed by accident — which is
  // the structural version of "COMPLEMENTARY, NON-BREAKING".
  let addendumCss = '';
  const ADDENDUM = path.join(ROOT, 'constants', 'tokens-addendum.ts');
  if (fs.existsSync(ADDENDUM)) {
    const raw = fs.readFileSync(ADDENDUM, 'utf8');
    const js = raw
      // Anchored to line start. Unanchored, this matched inside the word
      // "important" in a doc comment and ate everything to the next
      // semicolon — which happened to be most of the CSS block.
      .replace(/^\s*import\s[^;]+;/gm, '')      // COLOUR is injected below
      .replace(/^\s*export\s+/gm, '')
      .replace(/\s+as\s+const/g, '')
      .replace(/:\s*Record<[^>]+>/g, '')
      .replace(/\(category:\s*string\):\s*string/g, '(category)');
    // eslint-disable-next-line no-new-func
    const fn = new Function('COLOUR', `${js}\nreturn ADDENDUM_CSS_VARS;`);
    addendumCss =
      '\n/* ── ADDENDUM A · motion · overlays · notifications · brand ── */\n' +
      fn(t.COLOUR).trimStart();
  }

  // ── Bridge Document: type scale and layout grid ─────────────────────
  //
  // PARSED, not evaluated. An earlier attempt stripped TypeScript and ran
  // the result through `new Function` — that works for the addendum, whose
  // exports are plain objects, but typography.ts and layout.ts carry union
  // types and generics that a regex strip mangles. Parsing the values
  // directly is duller and cannot break on a type annotation.
  let bridgeCss = '';

  const typoSrc = path.join(ROOT, 'constants', 'typography.ts');
  if (fs.existsSync(typoSrc)) {
    const raw = fs.readFileSync(typoSrc, 'utf8');
    const block = raw.match(/export const TYPE:[^=]*=\s*\{([\s\S]*?)\n\};/);
    const measure = (raw.match(/MEASURE_CH\s*=\s*(\d+)/) || [, '65'])[1];
    const rows = [];
    if (block) {
      const re = /"([\w-]+)":\s*T\(\s*"(\w+)"\s*,\s*(\d+)\s*,\s*([\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(\d+)/g;
      let m;
      while ((m = re.exec(block[1])) !== null) {
        rows.push(
          `  --gc-t-${m[1]}-size: ${m[3]}px;`,
          `  --gc-t-${m[1]}-lh: ${m[4]};`,
          `  --gc-t-${m[1]}-ls: ${m[5]}em;`,
          `  --gc-t-${m[1]}-weight: ${m[6]};`,
        );
      }
    }
    if (rows.length === 0) {
      console.error('[export-tokens] parsed zero type roles from typography.ts');
      process.exit(1);
    }
    bridgeCss += '\n/* -- TYPE SCALE -- */\n:root {\n' + rows.join('\n') +
                 '\n\n  --gc-measure: ' + measure + 'ch;\n}\n';
  }

  const layoutSrc = path.join(ROOT, 'constants', 'layout.ts');
  if (fs.existsSync(layoutSrc)) {
    const raw = fs.readFileSync(layoutSrc, 'utf8');
    const block = raw.match(/export const BREAKPOINTS:[^=]*=\s*\{([\s\S]*?)\n\};/);
    const maxW = (raw.match(/MAX_CONTENT_WIDTH\s*=\s*(\d+)/) || [, '1600'])[1];
    const rows = ['  --gc-max-width: ' + maxW + 'px;'];
    if (block) {
      const re = /(\w+):\s*\{\s*minWidth:\s*(\d+),\s*columns:\s*(\d+),\s*gutter:\s*(\d+)/g;
      let m;
      while ((m = re.exec(block[1])) !== null) {
        rows.push(
          `  --gc-bp-${m[1]}: ${m[2]}px;`,
          `  --gc-cols-${m[1]}: ${m[3]};`,
          `  --gc-gutter-${m[1]}: ${m[4]}px;`,
        );
      }
    }
    if (rows.length <= 1) {
      console.error('[export-tokens] parsed zero breakpoints from layout.ts');
      process.exit(1);
    }
    bridgeCss += '\n/* -- GRID & BREAKPOINTS -- */\n:root {\n' + rows.join('\n') + '\n}\n';
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'tokens.css'),
    header + t.CSS_VARS.trimStart() + addendumCss + bridgeCss,
    'utf8',
  );

  const n = expectedCssVars(t).length;
  console.log(`[export-tokens] OK — ${n} tokens verified in both formats`);
  console.log('  dist/tokens.json');
  console.log('  dist/tokens.css');
}

main();
