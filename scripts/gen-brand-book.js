#!/usr/bin/env node
/**
 * Brand book generator — emits GC-BRAND-SYSTEM.html
 *
 * ── WHY GENERATED ────────────────────────────────────────────────────
 * A brand book maintained by hand is the document people trust over the
 * code, and it goes stale first. Every mark, size, colour, rule and misuse
 * here is read from constants/brand-system.ts and constants/tokens.ts at
 * generation time, so the picture cannot disagree with the build.
 *
 * The misuse panels are the point of the document: each one RENDERS the
 * wrong thing beside the right thing. A brand book that only says "do not
 * use a serif" is describing a mistake nobody can see.
 *
 * ── ONE DELIBERATE DIFFERENCE FROM THE APP ───────────────────────────
 * The app self-hosts its faces on purpose — no CDN, no third party seeing
 * who reads a site whose audience is a list of investors. This document
 * links Google Fonts instead, because it has to render Inter Tight 800/100 on a
 * machine that has never run the app, and because an internal reference is
 * not the public surface that rule protects.
 *
 * `--check` verifies the file on disk is in step, like the other generators.
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "GC-BRAND-SYSTEM.html");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8").replace(/\r\n/g, "\n");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const brandTs = read("constants/brand-system.ts");
const tokensTs = read("constants/tokens.ts");
const addendumTs = read("constants/tokens-addendum.ts");

/* ── Parse ───────────────────────────────────────────────────────────── */

const block = (src, name) => {
  const m = src.match(new RegExp(`export const ${name}[^=]*= \\{([\\s\\S]*?)\\n\\} as const`));
  return m ? m[1] : "";
};
const pairs = (b) => [...b.matchAll(/["']?([\w"-]+)["']?:\s*"([^"]+)"/g)].map((m) => [m[1].replace(/"/g, ""), m[2]]);
const COLOUR = Object.fromEntries(pairs(block(tokensTs, "COLOUR")));

const num = (name) => Number((brandTs.match(new RegExp(`export const ${name} = ([\\d.]+)`)) || [])[1]);
const CAP_RATIO = num("CAP_RATIO");
const MIN_CAP_PX = num("MIN_CAP_PX");
const DEVICE_RATIO = num("DEVICE_RATIO");
const MARK_WEIGHT = num("MARK_WEIGHT");
const MIN_FONT_PX = Math.ceil((MIN_CAP_PX / CAP_RATIO) * 10) / 10;
const MARK_WEIGHT_THIN = num("MARK_WEIGHT_THIN");
const str = (name) => (brandTs.match(new RegExp(`export const ${name} = "([^"]+)"`)) || [])[1] || "";
const MARK_BOX = str("MARK_BOX");
const MARK_CUT = str("MARK_CUT");
if (!MARK_BOX || !MARK_CUT) {
  console.error("[brand-book] could not read MARK_BOX / MARK_CUT from the registry.");
  process.exit(1);
}
/** The drawn mark (L1-01 §29-0b), as inline SVG. */
const markSvg = (px, ground = "void", device = null, radius = 0) => {
  const col = ground === "paper" ? COLOUR.ink : COLOUR.inkInverse;
  const dev = device || (ground === "paper" ? COLOUR.copperDeep : COLOUR.copper);
  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" style="flex:none;border-radius:${radius}px" aria-hidden="true">` +
    `<path fill-rule="evenodd" d="${MARK_BOX} ${MARK_CUT}" fill="${col}"/><path d="${MARK_CUT}" fill="${dev}"/></svg>`;
};

const clearspace = (px) => Math.round(px * CAP_RATIO);
const device = (px) => Math.max(2, Math.round(px * CAP_RATIO * DEVICE_RATIO));

/** MARKS[] — each object parsed from its own braces. */
const marks = [...brandTs.matchAll(/\{\s*id:\s*"(GC-MARK-\d+)",\s*name:\s*"([^"]+)",\s*form:\s*"([^"]+)",\s*use:\s*\[([\s\S]*?)\],\s*never:\s*\[([\s\S]*?)\],\s*floor:\s*"([^"]+)",\s*authority:\s*"([^"]+)",/g)]
  .map((m) => ({
    id: m[1], name: m[2], form: m[3],
    use: [...m[4].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    never: [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    floor: m[6], authority: m[7],
  }));

const misuse = [...brandTs.matchAll(/\{\s*id:\s*"(MIS-\d+)",\s*wrong:\s*"([^"]+)",\s*why:\s*"([^"]+)"\s*\}/g)]
  .map((m) => ({ id: m[1], wrong: m[2], why: m[3] }));

/* BRAND_LAWS values are concatenated strings, so join the fragments. */
const lawEntries = [...block(brandTs, "BRAND_LAWS").matchAll(/(\w+):\s*([\s\S]*?),\n(?=\s*\w+:|\s*$)/g)]
  .map(([, k, v]) => [k, [...v.matchAll(/"([^"]*)"/g)].map((x) => x[1]).join("")]);

const voice = [...block(addendumTs, "VOICE").matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]);
const brandRules = [...addendumTs.matchAll(/(wordmark|clearspace|iconography|imagery):\s*\{([\s\S]*?)\n  \}/g)]
  .map(([, k, body]) => [k, [...body.matchAll(/(spec|rule|minimum|minSize):\s*\n?\s*((?:"[^"]*"(?:\s*\+\s*\n?\s*)?)+)/g)]
    .map(([, f, v]) => [f, [...v.matchAll(/"([^"]*)"/g)].map((x) => x[1]).join("")])]);

if (marks.length !== 3) {
  console.error(`[brand-book] parsed ${marks.length} marks, expected 3. The registry's shape changed.`);
  process.exit(1);
}

/* ── Render helpers ──────────────────────────────────────────────────── */

/** The wordmark, as the document's own HTML. Same geometry as the component. */
const wordmark = (px, opts = {}) => {
  const { weight = MARK_WEIGHT, thin = MARK_WEIGHT_THIN, face = "Inter Tight", square = true, ground = "void",
          tracking = 0.07, fluid = false, device = null } = opts;
  const col = ground === "paper" ? COLOUR.ink : COLOUR.inkInverse;
  /* Fluid marks size everything in em so one font-size governs the whole
     lockup. Fixed-px worked until the 56px hero met an 800px viewport and
     the type ran past both edges while the mark stayed put — found by
     looking at the rendered page, which is the only way this kind of thing
     is ever found. */
  const m = Math.round(px * CAP_RATIO * DEVICE_RATIO);
  const gap = fluid ? `${(CAP_RATIO * 0.5).toFixed(3)}em` : `${Math.round(px * CAP_RATIO * 0.5)}px`;
  const fontSize = fluid ? `clamp(${Math.min(18, px)}px, 6.2vw, ${px}px)` : `${px}px`;
  return `<span style="display:inline-flex;align-items:center;gap:${gap};
    font-family:'${face}',sans-serif;font-weight:${thin};font-size:${fontSize};line-height:1;
    text-transform:uppercase;letter-spacing:${tracking}em;color:${col};white-space:nowrap">${
    square ? markSvg(m, ground, device) : ""}<span><b style="font-weight:${weight}">Getaway</b> Collective</span></span>`;
};

const monogram = (size, opts = {}) => {
  const { ground = "void", radius = 0 } = opts;
  return markSvg(size, ground, null, radius);
};

/* ── The misuse panels: each renders the wrong thing ─────────────────── */

const WRONG_RENDER = {
  "MIS-01": () => wordmark(28, { face: "Georgia", fluid: true }),
  "MIS-02": () => wordmark(28, { square: false, fluid: true }),
  "MIS-03": () => wordmark(28, { weight: 600, thin: 600, fluid: true }),
  "MIS-04": () => monogram(56, { radius: 12 }),
  "MIS-05": () => wordmark(28, { device: COLOUR.confirm, fluid: true }),
  "MIS-06": () => `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:64px;
      background:linear-gradient(115deg,#6b7f6a,#c9c0a8 40%,#8a8f76 70%,#e8e4d6)">${wordmark(24, { fluid: true })}</span>`,
  "MIS-07": () => wordmark(14),
  "MIS-08": () => `<span style="display:inline-block;padding:1px;outline:1px dashed ${COLOUR.hazard}">${wordmark(28, { fluid: true })}</span>`,
};

const misusePanel = (m) => `
  <article class="mis">
    <header><b>${esc(m.id)}</b><span>${esc(m.wrong)}</span></header>
    <div class="mis-pair">
      <div class="mis-cell wrong"><span class="tag">NEVER</span>${WRONG_RENDER[m.id] ? WRONG_RENDER[m.id]() : ""}</div>
      <div class="mis-cell right"><span class="tag">ALWAYS</span>${
        m.id === "MIS-04" ? monogram(56) : m.id === "MIS-06"
          ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:64px;background:linear-gradient(115deg,#6b7f6a,#c9c0a8 40%,#8a8f76 70%,#e8e4d6)"><span style="display:inline-flex;padding:12px 16px;background:rgba(10,10,10,.7)">${wordmark(24)}</span></span>`
          : m.id === "MIS-07" ? `<i style="width:10px;height:10px;background:${COLOUR.copper};display:inline-block"></i>`
          : wordmark(28, { fluid: true })}</div>
    </div>
    <p>${esc(m.why)}</p>
  </article>`;

/* ── Clearspace diagram ─────────────────────────────────────────────── */

const DIAGRAM_PX = 44;
const clearDiagram = `
  <div class="diagram">
    <div class="clear-outer" style="padding:${clearspace(DIAGRAM_PX)}px">
      <div class="clear-inner">${wordmark(DIAGRAM_PX, { fluid: true })}</div>
    </div>
    <ul class="dim">
      <li><b>${CAP_RATIO}</b> cap-height as a fraction of font-size — Inter <code>sCapHeight 2048</code> / <code>unitsPerEm 2816</code>, the master Inter Tight is cut from</li>
      <li><b>${clearspace(DIAGRAM_PX)}px</b> clearspace at ${DIAGRAM_PX}px font-size — the cap-height of the G, per BR-02</li>
      <li><b>${MIN_CAP_PX}px</b> minimum cap-height, which is <b>${MIN_FONT_PX}px</b> font-size. Below it the wordmark is barred and the device is the only mark</li>
      <li><b>${DEVICE_RATIO}</b> device edge as a fraction of cap-height — ${device(DIAGRAM_PX)}px here</li>
    </ul>
  </div>`;

/* ── Document ────────────────────────────────────────────────────────── */

const scaleRow = (px) => `
  <tr>
    <td class="mono">${px}px</td>
    <td class="mono">${clearspace(px)}px</td>
    <td class="mono">${device(px)}px</td>
    <td>${px < MIN_FONT_PX ? '<span class="bad">barred — use the device</span>' : wordmark(px)}</td>
  </tr>`;

const html = `<!doctype html>
<html lang="en-IN"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM — Brand &amp; Logo System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100;200;300;400;600;800&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  :root{
    --void:${COLOUR.void}; --void-panel:${COLOUR.voidPanel}; --paper:${COLOUR.paper};
    --ink:${COLOUR.ink}; --ink-inv:${COLOUR.inkInverse};
    --steel:${COLOUR.steel}; --steel-dim:${COLOUR.steelDim};
    --copper:${COLOUR.copper}; --copper-deep:${COLOUR.copperDeep};
    --hazard:${COLOUR.hazard}; --confirm:${COLOUR.confirm}; --critical:${COLOUR.critical};
    --hair:${COLOUR.hairlineInv};
    --display:'Inter Tight',sans-serif; --body:'Inter Tight',sans-serif; --mono:'Space Mono',monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--void);color:var(--ink-inv);font:400 15px/1.6 var(--body);
       -webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:64px 32px 120px}
  .eyebrow{font:400 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--steel-dim);
           margin:0 0 12px}
  h1{font:200 44px/1.05 var(--display);letter-spacing:-.01em;margin:0 0 16px;text-transform:uppercase}
  h2{font:300 28px/1.15 var(--display);margin:96px 0 8px;letter-spacing:-.01em}
  h3{font:400 17px/1.3 var(--display);margin:40px 0 8px}
  p{max-width:68ch;color:#d4d4d2}
  .lede{font-size:17px;color:var(--steel-dim);max-width:68ch}
  section{border-top:1px solid var(--hair);padding-top:4px}
  code{font:400 12px/1.4 var(--mono);color:var(--copper)}
  .mono{font:400 12px/1.4 var(--mono);color:var(--steel-dim);white-space:nowrap}
  .rule{border-left:1px solid var(--copper);padding:2px 0 2px 16px;margin:24px 0;color:var(--steel-dim);
        font-size:14px;max-width:64ch}
  .rule b{color:var(--ink-inv);font-weight:400}

  .stage{background:var(--void-panel);border:1px solid var(--hair);padding:56px 40px;margin:24px 0 8px;
         display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:40px;
         overflow:hidden;max-width:100%}
  .stage.on-paper{background:var(--paper)}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);margin:24px 0}
  .grid2>div{background:var(--void-panel);padding:44px 24px;display:flex;align-items:center;justify-content:center}
  .grid2>div.paper{background:var(--paper)}

  .markcard{border:1px solid var(--hair);margin:24px 0;background:var(--void-panel)}
  .markcard>header{display:flex;gap:16px;align-items:baseline;padding:16px 24px;border-bottom:1px solid var(--hair)}
  .markcard>header b{font:400 11px/1 var(--mono);color:var(--copper);letter-spacing:.08em}
  .markcard>header span{font:400 17px/1 var(--display)}
  .markcard>header em{margin-left:auto;font:400 10px/1 var(--mono);font-style:normal;color:var(--steel-dim);
                      letter-spacing:.08em;text-transform:uppercase}
  .markcard .body{padding:24px}
  .markcard .form{color:var(--steel-dim);font-size:14px;margin:0 0 20px}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:32px}
  .cols h4{font:400 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
  .cols .use h4{color:var(--confirm)}
  .cols .never h4{color:var(--critical)}
  ul{margin:0;padding-left:18px}
  li{font-size:13.5px;line-height:1.55;color:#cfcfcd;margin-bottom:6px}
  .floor{margin:20px 0 0;padding-top:14px;border-top:1px solid var(--hair);
         font:400 11px/1.5 var(--mono);color:var(--steel-dim)}

  .diagram{display:grid;grid-template-columns:auto 1fr;gap:48px;align-items:center;
           background:var(--void-panel);border:1px solid var(--hair);padding:40px;margin:24px 0}
  .clear-outer{outline:1px dashed var(--copper);outline-offset:0}
  .clear-inner{outline:1px solid var(--hair)}
  ul.dim{padding-left:0;list-style:none}
  ul.dim li{border-bottom:1px solid var(--hair);padding:9px 0;font-size:13px}
  ul.dim b{color:var(--copper);font-family:var(--mono);font-weight:400;font-size:12px}

  table{width:100%;border-collapse:collapse;margin:24px 0}
  /* The size table carries the mark at its real px, so it is legitimately
     wider than a narrow viewport. It scrolls itself rather than making the
     whole document scroll sideways. */
  .scroll-x{overflow-x:auto;max-width:100%}
  .scroll-x table{min-width:560px}
  th{text-align:left;font:400 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;
     color:var(--steel-dim);padding:0 16px 10px 0;border-bottom:1px solid var(--hair);font-weight:400}
  td{padding:14px 16px 14px 0;border-bottom:1px solid var(--hair);vertical-align:middle}
  .bad{font:400 11px/1 var(--mono);color:var(--critical);letter-spacing:.06em}

  .mis{border:1px solid var(--hair);margin:24px 0;background:var(--void-panel)}
  .mis>header{display:flex;gap:14px;align-items:baseline;padding:14px 20px;border-bottom:1px solid var(--hair)}
  .mis>header b{font:400 11px/1 var(--mono);color:var(--critical);letter-spacing:.08em}
  .mis>header span{font:400 15px/1.2 var(--display)}
  .mis-pair{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair)}
  .mis-cell{background:var(--void);padding:32px 20px;display:flex;flex-direction:column;
            align-items:center;justify-content:center;gap:16px;min-height:132px}
  .mis-cell .tag{font:400 9px/1 var(--mono);letter-spacing:.14em}
  .mis-cell.wrong .tag{color:var(--critical)}
  .mis-cell.right .tag{color:var(--confirm)}
  .mis p{margin:0;padding:16px 20px;border-top:1px solid var(--hair);font-size:13.5px;color:var(--steel-dim);max-width:none}

  .open{border:1px solid var(--hazard);padding:24px;margin:24px 0}
  .open h3{margin-top:0;color:var(--hazard)}
  footer{margin-top:96px;padding-top:24px;border-top:1px solid var(--hair);
         font:400 11px/1.7 var(--mono);color:var(--steel-dim)}
  @media (max-width:820px){.cols,.mis-pair,.grid2{grid-template-columns:1fr}.diagram{grid-template-columns:1fr}}
</style></head>
<body><div class="wrap">

<p class="eyebrow">GC.SYSTEM · Addendum A · BR-01 … BR-04</p>
<h1>Brand &amp; Logo System</h1>
<p class="lede">Three marks, one specification, one renderer. Every number on this page is read from
<code>constants/brand-system.ts</code> at generation time, and every rule traces to a ratified BR clause.</p>

<div class="rule"><b>Generated.</b> Do not edit this file. <code>npm run brandbook</code> rewrites it;
<code>npm run lint:brand</code> is the gate that keeps the build in step with it.</div>

<section>
<h2>The mark</h2>
<p>The logotype is drawn. R5 · One angle — a box chamfered at the top left and bottom right, with a skylight
cut through it that rises straight and turns once, every point on an 11-unit module — replaced the set type on
24 September 2026 (L1-01 §29-0b), exactly as this document said a designed logotype would. GETAWAY is set at
${MARK_WEIGHT} and COLLECTIVE at ${MARK_WEIGHT_THIN}. The clearspace, the floor and the device survive unchanged.</p>

<div class="stage">${wordmark(56, { fluid: true })}</div>
<div class="grid2">
  <div>${wordmark(32)}</div>
  <div class="paper">${wordmark(32, { ground: "paper" })}</div>
</div>
<p class="mono">On void, and on paper — where <code>copperDeep</code> replaces copper. 2.18:1 becomes 4.61:1;
the same hue and saturation, moved in lightness only, which is why the skylight is still the same skylight.</p>

<div class="rule"><b>Why the corners are cut.</b> <code>RADIUS.none</code> is invariant in this system.
A rounded corner would be the only curve in it, on the one element that appears on every page. The chamfer is
how a zero-radius system softens a corner, and the mark carries two of them.</div>

${marks.map((m) => `
<div class="markcard">
  <header><b>${esc(m.id)}</b><span>${esc(m.name)}</span><em>${esc(m.authority)}</em></header>
  <div class="body">
    <p class="form">${esc(m.form)}</p>
    <div class="stage" style="margin:0 0 24px;padding:40px 24px">${
      m.id === "GC-MARK-01" ? wordmark(36, { fluid: true })
        : m.id === "GC-MARK-02" ? `${monogram(96)}${monogram(56)}${monogram(32)}`
        : `<i style="width:24px;height:24px;background:${COLOUR.copper};display:inline-block"></i>
           <i style="width:12px;height:12px;background:${COLOUR.copper};display:inline-block"></i>
           <i style="width:6px;height:6px;background:${COLOUR.copper};display:inline-block"></i>`}</div>
    <div class="cols">
      <div class="use"><h4>Use</h4><ul>${m.use.map((u) => `<li>${esc(u)}</li>`).join("")}</ul></div>
      <div class="never"><h4>Never</h4><ul>${m.never.map((u) => `<li>${esc(u)}</li>`).join("")}</ul></div>
    </div>
    <p class="floor">FLOOR · ${esc(m.floor)}</p>
  </div>
</div>`).join("")}
</section>

<section>
<h2>Clearspace and the floor</h2>
<p>BR-02 defines clearspace as the cap-height of the G. That is only a rule if the cap-height is a number,
so it was measured from the font binary this application ships rather than estimated from the drawing.</p>
${clearDiagram}
<h3>Every size, with its geometry</h3>
<div class="scroll-x"><table>
  <thead><tr><th>Font-size</th><th>Clearspace</th><th>Device</th><th>Renders as</th></tr></thead>
  <tbody>${[14, 20, 29.6, 36, 56].map(scaleRow).join("")}</tbody>
</table></div>
<p class="mono">14px and 20px are below the BR-02 floor and are shown barred, not shown small.</p>
</section>

<section>
<h2>Misuse</h2>
<p>Each panel renders the wrong mark beside the right one. Eight of them, and the first three are not
hypothetical — they were live on this platform until 20 September 2026.</p>
${misuse.map(misusePanel).join("")}
</section>

<section>
<h2>Iconography and imagery</h2>
${brandRules.filter(([k]) => k === "iconography" || k === "imagery").map(([k, fields]) => `
  <h3>${k[0].toUpperCase()}${k.slice(1)}</h3>
  ${fields.map(([f, v]) => `<p><span class="mono">${f.toUpperCase()}</span> &nbsp;${esc(v)}</p>`).join("")}
`).join("")}
<div class="stage" style="gap:28px">
  ${["₹", "%", "↗", "⌘"].map((g) => `<span style="display:inline-flex;align-items:center;justify-content:center;
    width:44px;height:44px;border:1px solid ${COLOUR.hairlineInv};font:400 18px var(--mono);color:${COLOUR.inkInverse}">${g}</span>`).join("")}
</div>
<p class="mono">BR-03: 1px stroke, square frame, no fills, no two-tone. Glyphs come from the mono set rather
than an icon font, which is why these are characters and not drawings.</p>
</section>

<section>
<h2>Voice</h2>
<div class="rule"><b>${esc((addendumTs.match(/VOICE_PRINCIPLE = "([^"]+)"/) || [])[1] || "")}</b></div>
<table>
  <thead><tr><th>Principle</th><th>What it means in practice</th></tr></thead>
  <tbody>${voice.map(([k, v]) => `<tr><td class="mono">${esc(k.toUpperCase())}</td><td>${esc(v)}</td></tr>`).join("")}</tbody>
</table>
</section>

<section>
<h2>The laws</h2>
<table><tbody>${lawEntries.map(([k, v]) => `
  <tr><td class="mono" style="width:180px;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}
</tbody></table>
</section>

<section>
<h2>What is still open</h2>
<div class="open">
  <h3>The share card's letters are approximate</h3>
  <p>The favicon and the iOS icon are now pure geometry, so Satori renders them exactly. The share card also
  sets the name, and Satori cannot load Inter Tight unless a font file is passed to <code>ImageResponse</code>;
  none is, so its letters are Satori's default sans. Shipping the binary closes it.</p>
  <h3>CAP_RATIO is quoted, not measured</h3>
  <p>next/font fetches Inter Tight at build, so no binary sits in the repository to read. 0.727 is Inter's
  published ratio; re-read it when a binary is vendored.</p>
  <h3>The display scale and the stylesheet disagree</h3>
  <p><code>constants/typography.ts</code> sets <code>display-xl</code> and <code>display-l</code> at weight
  ${MARK_WEIGHT} and <code>display-m</code> and <code>heading</code> at 300.
  <code>app/_assemblies/assemblies.css</code> renders all four at 600. That file is generated from
  <code>GC-ASSEMBLIES.html</code>, so the drift is in the source document, and correcting it restyles every
  heading on a live platform. Reported, not swept.</p>
</div>
</section>

<footer>
GENERATED — scripts/gen-brand-book.js<br>
Sources: constants/brand-system.ts · constants/tokens.ts · constants/tokens-addendum.ts<br>
${marks.length} marks · ${misuse.length} recorded misuses · cap-height ratio ${CAP_RATIO} · floor ${MIN_FONT_PX}px<br>
Gate: npm run lint:brand
</footer>

</div></body></html>
`;

/* ── Write or check ──────────────────────────────────────────────────── */

const check = process.argv.includes("--check");
if (check) {
  /* Normalised before comparing, exactly as the other generators do: with
     core.autocrlf=true the file is checked out with CRLF while this emits LF,
     and a raw compare would report STALE on every Windows machine forever. */
  const current = fs.existsSync(OUT) ? read("GC-BRAND-SYSTEM.html") : null;
  if (current !== html.replace(/\r\n/g, "\n")) {
    console.error("[brand-book] STALE — run npm run brandbook");
    process.exit(1);
  }
  console.log(`[brand-book] OK — ${marks.length} marks, ${misuse.length} misuses in step`);
} else {
  fs.writeFileSync(OUT, html, "utf8");
  console.log(`[brand-book] wrote GC-BRAND-SYSTEM.html — ${marks.length} marks, ${misuse.length} misuses, floor ${MIN_FONT_PX}px`);
}
