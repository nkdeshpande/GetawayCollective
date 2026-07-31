#!/usr/bin/env node
/**
 * ASSEMBLY REFERENCE — the screens, and every place a prototype and the
 * canon disagreed.
 *
 * Generated, never written. Parses constants/assemblies.ts, and refuses
 * to write an empty page.
 */
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "constants", "assemblies.ts"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const code = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const unesc = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const joined = (chunk) =>
  unesc([...chunk.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join(""));

const str = (b, k) => {
  const m = b.match(new RegExp(`\\b${k}:\\s*\\n?\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+)`));
  return m ? joined(m[1]) : "";
};

const items = [];
for (const m of src.matchAll(/export const (\w+): Assembly = \{([\s\S]*?)\n\};/g)) {
  const b = m[2];

  const sections = [...b.matchAll(
    /S\(\s*"([^"]+)",\s*"([^"]+)",\s*"(\w+)",\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+),\s*\[([^\]]*)\]([\s\S]*?)(?=\n\s*(?:S\(|\],))/g,
  )].map((s) => {
    const tail = s[6];
    const ruleKeyed = tail.match(/rule:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)/);
    const ruleBare = tail.match(/^\s*,\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)\)/);
    return {
      ref: s[1], name: s[2], kind: s[3],
      purpose: joined(s[4]),
      contains: [...s[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      routesTo: [...((tail.match(/routesTo:\s*\[([^\]]*)\]/) || [, ""])[1]).matchAll(/"([^"]+)"/g)]
        .map((x) => x[1]),
      rule: ruleKeyed ? joined(ruleKeyed[1]) : ruleBare ? joined(ruleBare[1]) : "",
    };
  });

  const corrections = [...b.matchAll(/\{\s*\n\s*source:([\s\S]*?)kind:\s*"(\w+)",\s*\n\s*\}/g)]
    .map((c) => {
      const body = "source:" + c[1];
      return {
        source: str(body, "source"), was: str(body, "was"), now: str(body, "now"),
        because: str(body, "because"), kind: c[2],
      };
    });

  items.push({
    id: str(b, "id"), name: str(b, "name"), route: str(b, "route"), vantage: str(b, "vantage"),
    intent: str(b, "intent"), answers: str(b, "answers"), notes: str(b, "notes"),
    sections, corrections,
  });
}

if (!items.length || !items.every((a) => a.sections.length)) {
  console.error("[assembly-ref] Parsed zero assemblies or a sectionless one. Refusing to write.");
  process.exit(2);
}

const all = items.flatMap((a) => a.corrections.map((c) => ({ ...c, assembly: a.id })));
const byKind = {};
for (const c of all) (byKind[c.kind] ??= []).push(c);
const ORDER = ["constitutional", "accessibility", "numeric", "vocabulary", "interaction"];
const TONE = {
  constitutional: "#E8672E", accessibility: "#C9A227", numeric: "#4F8A6B",
  vocabulary: "#8E8E8E", interaction: "#6B6B6B",
};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM &middot; Assembly Reference</title><style>
:root{--void:#0A0A0A;--panel:#141414;--paper:#F4F1EA;--ink:#0A0A0A;--steel:#6B6B6B;
--dim:#8E8E8E;--copper:#C9A227;--hair:rgba(255,255,255,.10)}
*{box-sizing:border-box;margin:0}
body{background:var(--void);color:#EDEDED;font:15px/1.55 ui-sans-serif,-apple-system,"Segoe UI",sans-serif;
-webkit-font-smoothing:antialiased}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px 120px}
header{padding:80px 0 48px;border-bottom:1px solid var(--hair)}
h1{font:600 40px/1.05 ui-sans-serif,sans-serif;letter-spacing:-.03em;text-wrap:balance}
.eyebrow{font:400 11px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--dim)}
.lede{margin-top:20px;max-width:64ch;color:#CFCFCF}
.stats{display:flex;flex-wrap:wrap;gap:36px;margin-top:36px}
.stat b{display:block;font:600 28px/1 ui-monospace,monospace;font-variant-numeric:tabular-nums}
.stat span{font:400 11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
h2{font:600 13px/1 ui-sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);
margin:72px 0 20px;padding-bottom:12px;border-bottom:1px solid var(--hair)}
.as{border:1px solid var(--hair);margin-bottom:20px;background:var(--panel)}
.as-h{padding:24px 28px;border-bottom:1px solid var(--hair);display:flex;gap:18px;align-items:baseline;flex-wrap:wrap}
.as-h .id{font-family:ui-monospace,monospace;font-size:12px;color:var(--copper);letter-spacing:.06em}
.as-h h3{font:600 22px/1.2 ui-sans-serif;letter-spacing:-.02em}
.tag{font:400 10px/1 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;
border:1px solid var(--hair);padding:4px 8px;color:var(--dim)}
.as-b{padding:24px 28px;overflow-x:auto}
.q{color:var(--paper);font-size:16px;margin-bottom:6px}
.i{color:var(--dim);font-size:14px;margin-bottom:24px;max-width:72ch}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;font:400 10px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;
color:var(--steel);padding:0 12px 8px 0;border-bottom:1px solid var(--hair)}
td{padding:12px 12px 12px 0;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}
td.r{font-family:ui-monospace,monospace;font-size:11px;color:var(--steel);white-space:nowrap}
.k{font-family:ui-monospace,monospace;font-size:11px;color:var(--steel)}
.rule{display:block;margin-top:7px;color:var(--dim);font-size:12.5px;max-width:70ch}
.refs{font-family:ui-monospace,monospace;font-size:11px;color:var(--copper);white-space:nowrap}
.refs .to{color:var(--steel)}
.c{border-left:2px solid var(--t);padding:18px 0 20px 20px;margin-bottom:2px;
border-bottom:1px solid rgba(255,255,255,.05)}
.c-h{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;margin-bottom:12px}
.c-k{font:400 10px/1 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--t)}
.c-s{font-family:ui-monospace,monospace;font-size:11px;color:var(--steel)}
.wn{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:13px}
@media(max-width:760px){.wn{grid-template-columns:1fr}}
.wn div{padding:13px 15px;background:rgba(255,255,255,.03);font-size:13px}
.wn div:first-child{color:var(--dim)}
.wn b{display:block;font:400 9px/1 ui-monospace,monospace;letter-spacing:.16em;
text-transform:uppercase;color:var(--steel);margin-bottom:8px}
.bc{font-size:13.5px;color:#D8D8D8;max-width:74ch}
code{font-family:ui-monospace,monospace;font-size:.88em;background:rgba(255,255,255,.07);padding:1px 5px}
.note{margin-top:20px;padding:16px 18px;border:1px solid var(--hair);color:var(--dim);font-size:13px;max-width:74ch}
.ground{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--hair);margin-top:10px}
@media(max-width:640px){.ground{grid-template-columns:1fr}}
.ground>div{padding:34px 28px;font-size:14px}
.ground .lt{background:var(--paper);color:var(--ink)}
.ground b{display:block;font:400 10px/1 ui-monospace,monospace;letter-spacing:.16em;
text-transform:uppercase;margin-bottom:11px;opacity:.55}
</style></head><body><div class="wrap">

<header>
<div class="eyebrow">GC.SYSTEM &middot; Tier 05/06 &middot; Wave 6.5</div>
<h1>Assembly Reference</h1>
<p class="lede">Whole screens, adapted from the Kyoto prototype set. Each assembly names its sections
in order, what each one is for, and every place the source prototype and the canon disagreed &mdash;
recorded rather than silently resolved, because a silent resolution is a decision nobody can review.</p>
<div class="stats">
<div class="stat"><b>${items.length}</b><span>Assemblies</span></div>
<div class="stat"><b>${items.reduce((n, a) => n + a.sections.length, 0)}</b><span>Sections</span></div>
<div class="stat"><b>${all.length}</b><span>Corrections</span></div>
<div class="stat"><b>${(byKind.accessibility || []).length}</b><span>Accessibility</span></div>
<div class="stat"><b>${(byKind.constitutional || []).length}</b><span>Constitutional</span></div>
</div>
</header>

<h2>The Ground Inversion</h2>
<p class="i">The strongest idea in the source set. The page runs dark while it explains, and flips to
paper the moment it makes a financial claim. Nothing announces the switch &mdash; you simply arrive
somewhere that feels audited. It works because it maps a real distinction onto the one property of a
screen nobody can miss, which is what makes it a rule rather than a treatment.</p>
<div class="ground">
<div><b>Void &middot; narrative</b>Explaining, persuading, setting scene. A figure here reads as context.</div>
<div class="lt"><b>Paper &middot; assertion</b>Making a financial claim. Light means audited.</div>
</div>

<h2>The Assemblies</h2>
${items.map((a) => `<article class="as">
<div class="as-h"><span class="id">${esc(a.id)}</span><h3>${esc(a.name)}</h3>
<span class="tag">${esc(a.route)}</span><span class="tag">${esc(a.vantage)} vantage</span></div>
<div class="as-b">
<p class="q">${esc(a.answers)}</p>
<p class="i">${esc(a.intent)}</p>
<table><thead><tr><th style="width:80px">Ref</th><th>Section</th><th style="width:140px">Renders</th></tr></thead>
<tbody>${a.sections.map((s) => `<tr><td class="r">${esc(s.ref)}</td>
<td><strong>${esc(s.name)}</strong> <span class="k">${esc(s.kind)}</span><br>${esc(s.purpose)}
${s.rule ? `<span class="rule">${code(s.rule)}</span>` : ""}</td>
<td class="refs">${s.contains.map(esc).join("<br>") || "&mdash;"}
${s.routesTo.length ? `<br><span class="to">&rarr; ${s.routesTo.map(esc).join(" ")}</span>` : ""}</td></tr>`).join("")}
</tbody></table>
${a.notes ? `<p class="note">${code(a.notes)}</p>` : ""}
</div></article>`).join("")}

<h2>Corrections &mdash; ${all.length} across ${items.length} screens</h2>
${ORDER.map((k) => `
<h2 style="color:${TONE[k]}">${k} &mdash; ${(byKind[k] || []).length}</h2>
${(byKind[k] || []).map((c) => `<div class="c" style="--t:${TONE[k]}">
<div class="c-h"><span class="c-k">${esc(c.assembly)}</span><span class="c-s">${esc(c.source)}</span></div>
<div class="wn"><div><b>Was</b>${c.was ? code(c.was) : "&mdash; not stated"}</div>
<div><b>Now</b>${code(c.now)}</div></div>
<p class="bc">${code(c.because)}</p></div>`).join("")}`).join("")}

</div></body></html>`;

fs.writeFileSync(path.join(ROOT, "ASSEMBLY-REFERENCE.html"), html);
console.log("[assembly-ref] wrote ASSEMBLY-REFERENCE.html");
console.log(`  ${items.length} assemblies · ${items.reduce((n, a) => n + a.sections.length, 0)} sections · ${all.length} corrections`);
console.log(`  ${ORDER.map((k) => `${k} ${(byKind[k] || []).length}`).join(" · ")}`);
