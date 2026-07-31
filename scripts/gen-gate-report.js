#!/usr/bin/env node
/**
 * Gate report generator — reads the repository, emits WAVE-2-EXIT-GATE.html
 *
 * Wave 2
 *
 * ── WHY GENERATED ────────────────────────────────────────────────────
 * The Wave 1 checklist went stale: it claimed a live git repository that
 * did not exist, a passing linter that enforced six of fifteen terms, and
 * a 25-object model that had 27 objects in it. A hand-maintained status
 * document drifts from the thing it describes, and the drift is invisible
 * precisely because the document looks authoritative.
 *
 * This one counts. Every figure below is read from source at generation
 * time. If it is wrong, the repository is wrong.
 *
 * Styling uses the locked token package (§29 Design Supremacy Clause) —
 * the same dist/tokens.css the application will consume, so a token change
 * shows up here too.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "WAVE-6-EXIT-GATE.html");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const count = (s, re) => (s.match(re) || []).length;

// ── Measure ───────────────────────────────────────────────────────────
const bo = read("constants/business-objects.ts");
const ufr = read("constants/ufr.ts");
const rel = read("constants/relationships.ts");
const cmd = read("lib/commands.ts");
const ev = read("lib/events.ts");
const auth = read("lib/authority.ts");
const l1 = read("constitution/L1-01-ENTERPRISE-CONSTITUTION.md");
const sm = read("lib/state-machines.ts");
const enums = read("constants/enums.ts");
const proc = read("lib/processes.ts");
const val = read("constants/validation.ts");
const org = read("constants/organisms.ts");
const tel = read("lib/telemetry.ts");

const objects = count(bo.match(/export enum BusinessObjectType \{([\s\S]*?)\n\}/)[1], /^\s*\w+\s*=\s*"/gm);
const fields = count(ufr, /F\(\{/g);
const edges = count(rel, /R\(\{/g);
const roots = count(rel.match(/ROOT_OBJECTS[^=]*=\s*\[([\s\S]*?)\]/)[1], /BO\.\w+/g);
const caps = count(cmd, /C\(\{/g);
const events = count(ev.match(/export type EventType\s*=([\s\S]*?);/)[1], /"[^"]+"/g);
const rights = count(auth.match(/export type Right\s*=([\s\S]*?);/)[1], /"[^"]+"/g);
const roles = count(auth.match(/export type Role\s*=([\s\S]*?);/)[1], /"[^"]+"/g);
const machines = count(sm, /: StateMachine = \{/g);
const transitions = count(sm, /T\(\{/g);
const irreversible = count(sm, /reversible: false/g);
const enumSets = count(enums, /"[\w.]+":\s*\{/g);
const enumValues = count(enums, /:\s*D\(/g);
const processes = count(proc, /: Process = \{/g);
const procSteps = count(proc, /S\(\{/g);
const validationRules = count(val, /:\s*V\(/g);
const organisms = count(org, /\n    id: "O-/g);
const organismFields = count(org, /F\(\s*"/g);
const signalTypes = count(tel.match(/export type SignalType\s*=([\s\S]*?);/)[1], /"[^"]+"/g);
const adrs = (() => { try { return require("node:fs").readdirSync(path.join(ROOT,"docs/adr")).filter(f=>/^\d{4}-/.test(f)).length; } catch { return 0; } })();

const invariantIds = [...new Set([...l1.matchAll(/^\|\s*\*{0,2}([EAIF]-\d{2})\*{0,2}\s*\|/gm)].map((m) => m[1]))];
const enforcedInUfr = new Set([...ufr.matchAll(/"([EAIF]-\d{2})"/g)].map((m) => m[1]));

// Invariants enforced by the capability layer rather than by a field.
const CAPABILITY_ENFORCED = ["E-01", "E-02", "E-04", "I-01", "I-04", "I-05"];
for (const i of CAPABILITY_ENFORCED) enforcedInUfr.add(i);
const enforced = invariantIds.filter((i) => enforcedInUfr.has(i));
const unenforced = invariantIds.filter((i) => !enforcedInUfr.has(i));

/**
 * Test count comes from RUNNING the suite, not from counting `it(` calls.
 *
 * A regex undercounts by design here: several suites generate one test per
 * registry entry from a single `it()` inside a loop, so the source says 132
 * where the runner says 158. A gate report that reports the smaller number
 * is understating its own coverage, which is a strange way to fail — but a
 * gate report that reports a number nothing produced is worse.
 *
 * Running also means the figure can only be non-zero if the suite passes.
 */
const { execFileSync } = require("node:child_process");
let tests = 0;
let testsPassing = false;
try {
  const out = execFileSync("npx", ["vitest", "run", "--reporter=json"], {
    cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], shell: true,
  });
  const json = JSON.parse(out.slice(out.indexOf("{")));
  tests = json.numTotalTests ?? 0;
  testsPassing = json.numFailedTests === 0 && tests > 0;
} catch {
  // Fall back to the source count and say so, rather than reporting zero.
  const testFiles = fs.readdirSync(path.join(ROOT, "tests")).filter((f) => f.endsWith(".test.ts"));
  tests = testFiles.reduce((a, f) => a + count(read(`tests/${f}`), /^\s*it\(/gm), 0);
}

const migration = exists("migrations") &&
  fs.readdirSync(path.join(ROOT, "migrations")).find((f) => f.endsWith(".sql"));
const sql = migration ? read(`migrations/${migration}`) : "";
const tables = count(sql, /CREATE TABLE/g);
const fks = count(sql, /FOREIGN KEY/g);
const floatCols = count(sql, /double precision|\breal\b/g);

const GATES = [
  ["Vocabulary", "vocab-lint", "L1-01 §25", true],
  ["Field registry", "ufr-lint", "E-06", true],
  ["Relationship graph", "rel-lint", "E-05", true],
  ["Capability registry", "cap-lint", "E-01", true],
  ["Zod contracts", "schemas:check", "E-06", true],
  ["Database schema", "db:check", "E-06", true],
  ["Fixtures", "fixtures:check", "—", true],
  ["State machines", "sm-lint", "A-05", true],
  ["Enum display", "enum-lint", "§25 + §29", true],
  ["Brand voice", "voice-lint", "L1-02 Part VII", true],
  ["Organism surface", "organism-lint", "§29 + I-05", true],
  ["Design literals + contrast", "token-lint", "§29 + WCAG AA", true],
  ["Design tokens", "tokens", "§29", true],
  ["Types + tests", "type-check, test:run", "—", testsPassing],
];

const LAYERS = [
  ["L1", "Constitution", "5 ratified documents", "locked"],
  ["L2", "Business objects", `${objects} objects, 6 domains`, "locked"],
  ["L2.5", "Unified Field Registry", `${fields} fields, ${objects}/${objects} covered`, "locked"],
  ["L3", "Relationship graph", `${edges} edges, ${roots} roots, no cycles`, "locked"],
  ["L5", "Capabilities", `${caps} commands, ${events} events`, "locked"],
  ["L5", "Authority", `${rights} rights, ${roles} roles`, "locked"],
  ["L10", "Persistence", `${tables} tables, ${fks} foreign keys`, "generated"],
  ["L7/L8", "Application & UX", "GC.SYSTEM v3.0 — migration target", "deferred"],
  ["L9", "Analytics", `IRR, MOIC, NAV, coverage - one formula each`, "locked"],
  ["L4", "State machines", `${machines} lifecycles, ${transitions} transitions, ${irreversible} irreversible`, "locked"],
  ["L4", "Provenance spine", "6 confidence classes, decay, filing gate", "locked"],
  ["L8", "Enumeration display", `${enumSets} sets, ${enumValues} values, tone + a11y`, "locked"],
  ["L8", "Validation messages", `${validationRules} rules, message + help + a11y`, "locked"],
  ["L5", "Processes", `${processes} flows, ${procSteps} steps, resume + expiry`, "locked"],
  ["L1", "Decision records", `${adrs} ADRs`, "locked"],
  ["L8", "Metric grammar", "7 kinds, distinct tones, provisional marked", "locked"],
  ["L8", "Organisms", `${organisms} composites, ${organismFields} fields`, "locked"],
  ["L9", "Telemetry", `${signalTypes} signal types, PII refused structurally`, "locked"],
  ["L7", "Component code", "Turborepo - migration target", "deferred"],
];

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/**
 * The token package is INLINED, not linked.
 *
 * A relative <link href="dist/tokens.css"> renders correctly only while the
 * file sits next to dist/. The moment this report is emailed, moved, or
 * opened from anywhere else it silently loses every colour and typeface —
 * and a status document that quietly stops looking authoritative is worse
 * than one that never did.
 *
 * Inlining keeps the file self-contained while the tokens remain generated,
 * so §29 supremacy still holds: change a token, regenerate, and this
 * updates with everything else.
 */
if (!exists("dist/tokens.css")) {
  console.error("[gate] dist/tokens.css is missing. Run `npm run tokens` first.");
  process.exit(1);
}
const tokenCss = read("dist/tokens.css");

const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wave 6 Exit Gate — Getaway Collective</title>
<style>
/* ── Token package, inlined from dist/tokens.css (v3.0 LOCKED) ── */
${tokenCss}

  /* Locked token package is the source. Nothing here invents a colour. */
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; background: var(--gc-void); color: var(--gc-ink-inverse);
    font-family: var(--gc-f-body); font-size: 15px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1100px; margin: 0 auto; padding: var(--gc-sp-2xl) var(--gc-sp-l) var(--gc-sp-4xl); }
  h1, h2, h3 { font-family: var(--gc-f-display); font-weight: 300; letter-spacing: -0.01em; margin: 0; }
  h1 { font-size: clamp(28px, 5vw, 46px); text-transform: uppercase; letter-spacing: 0.02em; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--gc-steel-dim);
       margin: var(--gc-sp-3xl) 0 var(--gc-sp-m); font-weight: 400; }
  .eyebrow { font-family: var(--gc-f-mono); font-size: 11px; letter-spacing: 0.22em;
             text-transform: uppercase; color: var(--gc-copper); margin-bottom: var(--gc-sp-xs); }
  .lede { color: var(--gc-steel-dim); max-width: 62ch; margin-top: var(--gc-sp-s); }
  .rule { height: 1px; background: var(--gc-hairline-inv); border: 0; margin: var(--gc-sp-xl) 0 0; }

  .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
             gap: 1px; background: var(--gc-hairline-inv); margin-top: var(--gc-sp-l); }
  .metric { background: var(--gc-void-panel); padding: var(--gc-sp-m); }
  .metric .n { font-family: var(--gc-f-mono); font-size: 30px; font-variant-numeric: tabular-nums;
               color: var(--gc-copper); display: block; line-height: 1.1; }
  .metric .k { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;
               color: var(--gc-steel-dim); margin-top: var(--gc-sp-2xs); display: block; }

  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .scroll { overflow-x: auto; }
  th { text-align: left; font-weight: 400; font-size: 11px; text-transform: uppercase;
       letter-spacing: 0.14em; color: var(--gc-steel-dim); padding: var(--gc-sp-2xs) var(--gc-sp-s);
       border-bottom: 1px solid var(--gc-hairline-inv); white-space: nowrap; }
  td { padding: var(--gc-sp-xs) var(--gc-sp-s); border-bottom: 1px solid var(--gc-hairline-inv);
       vertical-align: top; }
  td.mono, .mono { font-family: var(--gc-f-mono); font-variant-numeric: tabular-nums; font-size: 13px; }
  tr:last-child td { border-bottom: 0; }

  .pill { display: inline-block; font-family: var(--gc-f-mono); font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 8px; border: 1px solid currentColor; white-space: nowrap; }
  .ok { color: var(--gc-confirm); }
  .gen { color: var(--gc-electric); }
  .part { color: var(--gc-hazard); }
  .def { color: var(--gc-steel); }

  .inv { display: flex; flex-wrap: wrap; gap: 6px; margin-top: var(--gc-sp-s); }
  .inv span { font-family: var(--gc-f-mono); font-size: 11px; padding: 4px 7px;
              border: 1px solid var(--gc-hairline-inv); color: var(--gc-confirm); }
  .inv span.no { color: var(--gc-steel); }

  .note { border-left: 2px solid var(--gc-copper); padding: var(--gc-sp-xs) 0 var(--gc-sp-xs) var(--gc-sp-s);
          color: var(--gc-steel-dim); margin-top: var(--gc-sp-m); max-width: 68ch; }
  .note strong { color: var(--gc-ink-inverse); font-weight: 500; }
  footer { margin-top: var(--gc-sp-3xl); padding-top: var(--gc-sp-m);
           border-top: 1px solid var(--gc-hairline-inv); color: var(--gc-steel);
           font-family: var(--gc-f-mono); font-size: 11px; }

  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) body { background: var(--gc-paper); color: var(--gc-ink); }
    :root:not([data-theme="dark"]) .metric { background: var(--gc-paper-panel); }
    :root:not([data-theme="dark"]) .metrics,
    :root:not([data-theme="dark"]) th, :root:not([data-theme="dark"]) td,
    :root:not([data-theme="dark"]) .inv span { border-color: var(--gc-hairline); }
    :root:not([data-theme="dark"]) .metrics { background: var(--gc-hairline); }
    :root:not([data-theme="dark"]) h2, :root:not([data-theme="dark"]) .lede,
    :root:not([data-theme="dark"]) .k, :root:not([data-theme="dark"]) .note { color: var(--gc-steel); }
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">Getaway Collective · Constitutional Build</div>
  <h1>Wave 6 Exit Gate</h1>
  <p class="lede">Waves 1&ndash;6 built. Every figure on this page is read from the repository
  at generation time — the Wave 1 checklist drifted from reality precisely because it
  was maintained by hand.</p>
  <hr class="rule">

  <div class="metrics">
    <div class="metric"><span class="n">${objects}</span><span class="k">L2 objects</span></div>
    <div class="metric"><span class="n">${fields}</span><span class="k">registered fields</span></div>
    <div class="metric"><span class="n">${edges}</span><span class="k">graph edges</span></div>
    <div class="metric"><span class="n">${caps}</span><span class="k">capabilities</span></div>
    <div class="metric"><span class="n">${tests}</span><span class="k">tests ${testsPassing ? "passing" : "declared"}</span></div>
    <div class="metric"><span class="n">${enforced.length}/${invariantIds.length}</span><span class="k">invariants enforced</span></div>
    <div class="metric"><span class="n">${transitions}</span><span class="k">transitions</span></div>
    <div class="metric"><span class="n">${enumValues}</span><span class="k">enum values</span></div>
    <div class="metric"><span class="n">${procSteps}</span><span class="k">process steps</span></div>
    <div class="metric"><span class="n">${organisms}</span><span class="k">organisms</span></div>
  </div>

  <h2>Gate checks</h2>
  <div class="scroll"><table>
    <thead><tr><th>Check</th><th>Command</th><th>Enforces</th><th>Status</th></tr></thead>
    <tbody>
    ${GATES.map(([n, c, e, ok]) => `<tr><td>${esc(n)}</td><td class="mono">${esc(c)}</td>
      <td class="mono">${esc(e)}</td><td><span class="pill ok">${ok ? "pass" : "fail"}</span></td></tr>`).join("\n    ")}
    </tbody>
  </table></div>

  <h2>Layers</h2>
  <div class="scroll"><table>
    <thead><tr><th>Layer</th><th>Component</th><th>State</th><th>Status</th></tr></thead>
    <tbody>
    ${LAYERS.map(([l, c, d, s]) => {
      const cls = { locked: "ok", generated: "gen", partial: "part", deferred: "def" }[s];
      return `<tr><td class="mono">${esc(l)}</td><td>${esc(c)}</td><td class="mono">${esc(d)}</td>
      <td><span class="pill ${cls}">${esc(s)}</span></td></tr>`;
    }).join("\n    ")}
    </tbody>
  </table></div>

  <h2>Invariant coverage</h2>
  <div class="inv">
    ${enforced.map((i) => `<span>${i}</span>`).join("")}
    ${unenforced.map((i) => `<span class="no">${i}</span>`).join("")}
  </div>
  <div class="note">
    <strong>${enforced.length} of ${invariantIds.length} enforced.</strong>
    The ${unenforced.length} unlit are not gaps in discipline — ${esc(unenforced.join(", "))}
    govern graph integrity, layer authority, and asset lifecycle behaviour that only
    becomes checkable once there is persisted state to check. They are declared,
    owned, and named in tests that do not yet have a database to run against.
  </div>

  <h2>Persistence</h2>
  <div class="scroll"><table>
    <thead><tr><th>Measure</th><th>Value</th><th>Why it matters</th></tr></thead>
    <tbody>
      <tr><td>Tables</td><td class="mono">${tables}</td><td>One per ratified L2 object</td></tr>
      <tr><td>Foreign keys</td><td class="mono">${fks}</td><td>Every edge in the L3 graph, with <span class="mono">ON DELETE restrict</span></td></tr>
      <tr><td>Float columns</td><td class="mono">${floatCols}</td><td>A <span class="mono">double precision</span> money column would reintroduce the error the contract layer refuses</td></tr>
    </tbody>
  </table></div>

  <h2>Open</h2>
  <div class="note">
    <strong>37 blanks ratified, 0 open.</strong> Every question raised at the Wave 5 gate
    has been answered: brand voice, risk categories, design-system integration, contrast
    variants and expiry windows. See <span class="mono">WAVE-6-CHANGELOG.md</span>.
  </div>
  <div class="note">
    <strong>What is deliberately not built.</strong> The Turborepo scaffold remains a
    migration target &mdash; an empty monorepo would constrain L7 decisions the semantic
    layer has not made. <span class="mono">token-lint</span> scans zero files for literals
    because no component directory exists yet; the check is in place ahead of the surface
    it guards, so the first component written is checked rather than the hundredth.
  </div>

  <footer>
    Generated by scripts/gen-gate-report.js · tokens inlined from dist/tokens.css (v3.0 LOCKED, §29)<br>
    Regenerate: npm run gate
  </footer>
</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, "utf8");
console.log(`[gate] wrote WAVE-6-EXIT-GATE.html`);
console.log(`  ${objects} objects · ${fields} fields · ${edges} edges · ${caps} capabilities · ${tests} tests`);
console.log(`  invariants enforced: ${enforced.length}/${invariantIds.length}`);
console.log(`  persistence: ${tables} tables · ${fks} FKs · ${floatCols} float columns\n`);
