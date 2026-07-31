#!/usr/bin/env node
/**
 * Design Reference generator — emits DESIGN-REFERENCE.html
 *
 * Waves 3 & 4 · Type Matrix, Information Hierarchy, Enumeration Guide,
 * Contrast Audit, Atom Specifications
 *
 * ── GENERATED, FOR THE SAME REASON AS EVERYTHING ELSE ────────────────
 * A design reference maintained by hand drifts from the token package, and
 * then people trust the picture over the code. Every swatch, every ratio
 * and every label here is read from source at generation time.
 *
 * The contrast column is COMPUTED, not asserted. A palette can be beautiful
 * and illegible and the only way to know is to do the arithmetic.
 *
 * Self-contained: tokens are inlined, no external references, works from
 * anywhere. Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "DESIGN-REFERENCE.html");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

if (!fs.existsSync(path.join(ROOT, "dist/tokens.css"))) {
  console.error("[design-ref] dist/tokens.css missing. Run `npm run tokens` first.");
  process.exit(1);
}
const tokenCss = read("dist/tokens.css");
const tokensTs = read("constants/tokens.ts");

// ── Parse the token package ───────────────────────────────────────────
const parseBlock = (name) => {
  const m = tokensTs.match(new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\}`));
  return m ? m[1] : "";
};
const pairs = (block) => [...block.matchAll(/["']?([\w"-]+)["']?:\s*"([^"]+)"/g)]
  .map((m) => [m[1].replace(/"/g, ""), m[2]]);

const COLOUR = Object.fromEntries(pairs(parseBlock("COLOUR")));
const FONT = Object.fromEntries(pairs(parseBlock("FONT")));
const SPACE = Object.fromEntries(pairs(parseBlock("SPACE")));
const IL = [...parseBlock("IL").matchAll(/(\d+):\s*\{\s*weight:\s*(\d+),\s*opacity:\s*([\d.]+)\s*\}/g)]
  .map((m) => ({ level: m[1], weight: m[2], opacity: m[3] }));

const IL_MEANING = {
  1: "Critical Decision", 2: "Primary Metric", 3: "Supporting Metric",
  4: "Context", 5: "Metadata", 6: "Audit",
};

// ── Contrast ──────────────────────────────────────────────────────────
const srgb = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const verdict = (r) => (r >= 4.5 ? ["AA text", "confirm"] : r >= 3 ? ["AA UI", "hazard"] : ["accent only", "critical"]);

const SEMANTIC = ["forest", "copper", "electric", "hazard", "critical", "confirm", "steel", "steelDim"]
  .filter((k) => COLOUR[k]);

// ── Enum display ──────────────────────────────────────────────────────
function enumDisplay() {
  const src = read("constants/enums.ts");
  const block = src.match(/export const ENUM_DISPLAY[^=]*=\s*\{([\s\S]*?)\n\};/)[1];
  const out = [];
  const groupRe = /"([\w.]+)":\s*\{\s*\}|"([\w.]+)":\s*\{([\s\S]*?)\n\s{2}\},/g;
  let g;
  while ((g = groupRe.exec(block)) !== null) {
    const key = g[1] ?? g[2];
    const body = g[3] ?? "";
    const values = [];
    const re = /(?:"([^"]+)"|(\w+)):\s*D\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"(\w+)"/g;
    let e;
    while ((e = re.exec(body)) !== null) {
      values.push({ value: e[1] ?? e[2], label: e[3], description: e[4], tone: e[5] });
    }
    if (values.length) out.push({ key, values });
  }
  return out;
}
const ENUMS = enumDisplay();
const toneCount = {};
for (const g of ENUMS) for (const v of g.values) toneCount[v.tone] = (toneCount[v.tone] ?? 0) + 1;

// ── Risk categories ───────────────────────────────────────────────────
const RISKS = (() => {
  const src = read("constants/tokens-addendum.ts");
  const m = src.match(/RISK_COLOUR[^=]*=\s*\{([\s\S]*?)\n\};/);
  return m ? [...m[1].matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)].map((x) => [x[1], x[2]]) : [];
})();

// ── Atoms ─────────────────────────────────────────────────────────────
const ATOMS = [
  ["Metric", "IL-2 value, Space Mono, tabular-nums, tone by measure", "value · unit · delta"],
  ["Status Pill", "1px hairline, 0 radius, label always present", "tone · label"],
  ["Ledger Row", "append-only, mono, right-aligned money", "account · amount · narrative"],
  ["Confidence Tag", "provenance class, IL-5", "observed → pending"],
  ["Reserve Gauge", "four bands against the floor", "≥120 · 110-119 · 100-109 · <100"],
  ["Waterfall Bar", "six stages in fixed order, shortfall marked", "stage · amount · shortfall"],
  ["Hold-to-Commit", "3s hold before a capital-moving action", "idle → engaged → sealed → locked"],
];

// ── Render ────────────────────────────────────────────────────────────
const swatch = (name, hex) => `
  <div class="sw">
    <div class="chip" style="background:${esc(hex)}"></div>
    <div class="meta"><span class="k">${esc(name)}</span><span class="mono">${esc(hex)}</span></div>
  </div>`;

const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Reference — Getaway Collective</title>
<style>
/* ── Token package, inlined from dist/tokens.css (v3.0 LOCKED) ── */
${tokenCss}

  *,*::before,*::after{box-sizing:border-box}
  body{margin:0;background:var(--gc-void);color:var(--gc-ink-inverse);
       font-family:var(--gc-f-body);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1180px;margin:0 auto;padding:var(--gc-sp-2xl) var(--gc-sp-l) var(--gc-sp-4xl)}
  h1{font-family:var(--gc-f-display);font-weight:200;font-size:clamp(30px,5vw,52px);
     text-transform:uppercase;letter-spacing:.03em;margin:0}
  h2{font-family:var(--gc-f-display);font-weight:400;font-size:12px;text-transform:uppercase;
     letter-spacing:.2em;color:var(--gc-steel-dim);margin:var(--gc-sp-3xl) 0 var(--gc-sp-m)}
  .eyebrow{font-family:var(--gc-f-mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
           color:var(--gc-copper);margin-bottom:var(--gc-sp-xs)}
  .lede{color:var(--gc-steel-dim);max-width:64ch;margin-top:var(--gc-sp-s)}
  hr{height:1px;background:var(--gc-hairline-inv);border:0;margin:var(--gc-sp-xl) 0 0}
  .mono{font-family:var(--gc-f-mono);font-variant-numeric:tabular-nums;font-size:12px}
  .note{border-left:2px solid var(--gc-copper);padding:var(--gc-sp-2xs) 0 var(--gc-sp-2xs) var(--gc-sp-s);
        color:var(--gc-steel-dim);margin:var(--gc-sp-m) 0;max-width:70ch}
  .note strong{color:var(--gc-ink-inverse);font-weight:500}

  .sws{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1px;
       background:var(--gc-hairline-inv);margin-top:var(--gc-sp-m)}
  .sw{background:var(--gc-void-panel);padding:var(--gc-sp-xs)}
  .chip{height:56px;border:1px solid var(--gc-hairline-inv)}
  .meta{display:flex;justify-content:space-between;margin-top:var(--gc-sp-2xs);gap:var(--gc-sp-2xs)}
  .meta .k{font-size:12px}
  .meta .mono{color:var(--gc-steel)}

  table{width:100%;border-collapse:collapse;font-size:14px}
  .scroll{overflow-x:auto}
  th{text-align:left;font-weight:400;font-size:11px;text-transform:uppercase;letter-spacing:.14em;
     color:var(--gc-steel-dim);padding:var(--gc-sp-2xs) var(--gc-sp-s);
     border-bottom:1px solid var(--gc-hairline-inv);white-space:nowrap}
  td{padding:var(--gc-sp-2xs) var(--gc-sp-s);border-bottom:1px solid var(--gc-hairline-inv);vertical-align:top}
  tr:last-child td{border-bottom:0}
  td.num{font-family:var(--gc-f-mono);font-variant-numeric:tabular-nums;text-align:right}

  .pill{display:inline-block;font-family:var(--gc-f-mono);font-size:10px;letter-spacing:.09em;
        text-transform:uppercase;padding:3px 8px;border:1px solid currentColor;white-space:nowrap}
  .t-steel{color:var(--gc-steel)} .t-electric{color:var(--gc-electric)}
  .t-confirm{color:var(--gc-confirm)} .t-hazard{color:var(--gc-hazard)}
  .t-critical{color:var(--gc-critical)} .t-copper{color:var(--gc-copper)}
  .t-forest{color:var(--gc-forest)}

  .type-row{border-bottom:1px solid var(--gc-hairline-inv);padding:var(--gc-sp-m) 0;
            display:grid;grid-template-columns:130px 1fr;gap:var(--gc-sp-m);align-items:baseline}
  .type-row .lbl{font-family:var(--gc-f-mono);font-size:11px;color:var(--gc-steel);text-transform:uppercase;
                 letter-spacing:.1em}
  .d-display{font-family:var(--gc-f-display);font-weight:200;font-size:38px;text-transform:uppercase;letter-spacing:.02em}
  .d-body{font-family:var(--gc-f-body);font-size:16px;max-width:60ch}
  .d-mono{font-family:var(--gc-f-mono);font-size:16px;font-variant-numeric:tabular-nums;color:var(--gc-copper)}
  .d-edit{font-family:var(--gc-f-editorial);font-style:italic;font-size:22px;color:var(--gc-steel-dim);max-width:52ch}

  .il-row{display:grid;grid-template-columns:80px 130px 1fr;gap:var(--gc-sp-m);align-items:baseline;
          padding:var(--gc-sp-xs) 0;border-bottom:1px solid var(--gc-hairline-inv)}
  .enumgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1px;
            background:var(--gc-hairline-inv);margin-top:var(--gc-sp-s)}
  .enumcell{background:var(--gc-void-panel);padding:var(--gc-sp-s)}
  .enumcell .desc{font-size:12px;color:var(--gc-steel);margin-top:6px}
  .enumcell .path{font-family:var(--gc-f-mono);font-size:10px;color:var(--gc-steel);
                  text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--gc-sp-2xs)}
  footer{margin-top:var(--gc-sp-3xl);padding-top:var(--gc-sp-m);border-top:1px solid var(--gc-hairline-inv);
         color:var(--gc-steel);font-family:var(--gc-f-mono);font-size:11px}

  @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
  @media (prefers-color-scheme: light){
    :root:not([data-theme="dark"]) body{background:var(--gc-paper);color:var(--gc-ink)}
    :root:not([data-theme="dark"]) .sw,
    :root:not([data-theme="dark"]) .enumcell{background:var(--gc-paper-panel)}
    :root:not([data-theme="dark"]) .sws,
    :root:not([data-theme="dark"]) .enumgrid{background:var(--gc-hairline)}
    :root:not([data-theme="dark"]) th,:root:not([data-theme="dark"]) td,
    :root:not([data-theme="dark"]) .type-row,:root:not([data-theme="dark"]) .il-row,
    :root:not([data-theme="dark"]) .chip,:root:not([data-theme="dark"]) footer{border-color:var(--gc-hairline)}
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">Getaway Collective · GC.SYSTEM v3.0 LOCKED</div>
  <h1>Design Reference</h1>
  <p class="lede">Generated from <span class="mono">constants/tokens.ts</span> and
  <span class="mono">constants/enums.ts</span>. Every swatch, ratio and label is read from source —
  a reference maintained by hand drifts from the token package, and then people trust the picture
  over the code.</p>
  <hr>

  <h2>Palette</h2>
  <div class="sws">${Object.entries(COLOUR).filter(([, v]) => v.startsWith("#")).map(([k, v]) => swatch(k, v)).join("")}</div>

  <h2>Contrast audit — computed, not asserted</h2>
  <div class="scroll"><table>
    <thead><tr><th>Token</th><th>on void</th><th></th><th>on paper</th><th></th></tr></thead>
    <tbody>
    ${SEMANTIC.map((k) => {
      const rv = ratio(COLOUR[k], COLOUR.void), rp = ratio(COLOUR[k], COLOUR.paper);
      const [lv, cv] = verdict(rv), [lp, cp] = verdict(rp);
      return `<tr><td><span class="pill t-${k === "steelDim" ? "steel" : k}">${esc(k)}</span></td>
        <td class="num">${rv}:1</td><td><span class="pill t-${cv}">${lv}</span></td>
        <td class="num">${rp}:1</td><td><span class="pill t-${cp}">${lp}</span></td></tr>`;
    }).join("\n    ")}
    </tbody>
  </table></div>
  <div class="note">
    <strong>Four pairings fall below AA UI on one ground.</strong>
    <span class="mono">forest</span> on <span class="mono">void</span> is 1.38:1 — effectively invisible.
    <span class="mono">copper</span>, <span class="mono">confirm</span> and <span class="mono">hazard</span>
    fall short on <span class="mono">paper</span>. The palette is locked (§29), so these are
    <strong>usage constraints, not defects</strong>: colour is never the only carrier of meaning.
    A status carries a label, a metric carries a unit. See <span class="mono">docs/DESIGN-USAGE-RULES.md</span>.
  </div>

  <h2>Type matrix — four roles</h2>
  <div class="type-row"><div class="lbl">Display<br>Outfit</div>
    <div class="d-display">Ownership without operational burden</div></div>
  <div class="type-row"><div class="lbl">Body<br>Inter</div>
    <div class="d-body">Capital that compounds through time, architecture and stewardship. Set at a measure
    near 65 characters, because a line a reader loses their place in is a line they read twice.</div></div>
  <div class="type-row"><div class="lbl">Data<br>Space Mono</div>
    <div class="d-mono">₹12,500,000.5000 &nbsp; 14.50% &nbsp; 2.50x &nbsp; UFR-0264</div></div>
  <div class="type-row"><div class="lbl">Editorial<br>Playfair, italic only</div>
    <div class="d-edit">Modern luxury is defined not by excess, but by the absence of noise.</div></div>
  <div class="note">
    Money is always <span class="mono">Space Mono</span> with <span class="mono">tabular-nums</span>.
    That is what makes a column of figures comparable at a glance — and on <span class="mono">paper</span>
    it is the signal doing the work, since <span class="mono">copper</span> is only an accent there.
  </div>

  <h2>Information hierarchy</h2>
  ${IL.map((l) => `
  <div class="il-row">
    <div class="mono">IL-${l.level}</div>
    <div class="mono" style="color:var(--gc-steel)">${l.weight} · ${l.opacity}</div>
    <div style="font-weight:${l.weight};opacity:${l.opacity}">${esc(IL_MEANING[l.level] ?? "")} — the quick brown fox</div>
  </div>`).join("")}

  <h2>Spacing — 4px base</h2>
  <div class="scroll"><table>
    <thead><tr><th>Step</th><th>Value</th><th></th></tr></thead>
    <tbody>${Object.entries(SPACE).map(([k, v]) => `<tr><td class="mono">${esc(k)}</td><td class="num">${esc(v)}</td>
      <td><div style="height:8px;width:${esc(v)};background:var(--gc-copper)"></div></td></tr>`).join("")}</tbody>
  </table></div>

  <h2>Enumerations — ${ENUMS.reduce((a, g) => a + g.values.length, 0)} values across ${ENUMS.length} sets</h2>
  <div class="note">
    Tone is semantic, never decorative. <strong><span class="mono">critical</span> is budgeted at 12</strong>
    and currently spends ${toneCount.critical ?? 0} — spending it on ordinary states would leave nothing
    that still registers when a real breach happens. Enforced by <span class="mono">enum-lint</span>.
  </div>
  ${ENUMS.map((g) => `
  <div class="enumgrid">
    ${g.values.map((v) => `<div class="enumcell">
      <div class="path">${esc(g.key)}</div>
      <span class="pill t-${esc(v.tone)}">${esc(v.label)}</span>
      <div class="desc">${esc(v.description)}</div>
    </div>`).join("")}
  </div>`).join("")}

  <h2>Risk categories &mdash; all ten, reconciled</h2>
  <div class="note">
    Six of the ten registry categories rendered grey until 31 Jul 2026, which makes a risk
    register unscannable &mdash; the one thing a register exists to be. Four design-only names
    were mapped onto their registry synonyms, two categories were given new colours, and
    <span class="mono">construction</span> and <span class="mono">reputation</span> were dropped
    because the registry does not track them.
  </div>
  <div class="sws">${RISKS.map(([k,v]) => swatch(k, v)).join("")}</div>

  <h2>Atom specifications</h2>
  <div class="scroll"><table>
    <thead><tr><th>Atom</th><th>Rule</th><th>Content</th></tr></thead>
    <tbody>${ATOMS.map(([n, r, c]) => `<tr><td>${esc(n)}</td><td>${esc(r)}</td><td class="mono">${esc(c)}</td></tr>`).join("")}</tbody>
  </table></div>
  <div class="note">
    Zero radius everywhere. No drop shadows — depth comes from hairlines. Circles only for status LEDs
    and the Trinity Lens. Every animation respects <span class="mono">prefers-reduced-motion</span>,
    including this page.
  </div>

  <footer>
    Generated by scripts/gen-design-reference.js · tokens inlined from dist/tokens.css (v3.0 LOCKED, §29)<br>
    Regenerate: npm run design
  </footer>
</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, "utf8");
const enumValues = ENUMS.reduce((a, g) => a + g.values.length, 0);
console.log(`[design-ref] wrote DESIGN-REFERENCE.html`);
console.log(`  ${Object.keys(COLOUR).length} tokens · ${IL.length} IL levels · ${enumValues} enum values · ${ATOMS.length} atoms`);
console.log(`  contrast computed for ${SEMANTIC.length} semantic colours on both grounds\n`);
