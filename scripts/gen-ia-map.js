#!/usr/bin/env node
/**
 * THE INFORMATION ARCHITECTURE MAP
 *
 * Every URL in the system, grouped, with its access class, the assembly
 * that renders it and the rights it requires.
 *
 * Generated from constants/routes.ts. Nothing here is retyped.
 */

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const read = (...p) =>
  fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const src = read("constants", "routes.ts");
const asmSrc = read("constants", "assemblies.ts");

const asmName = new Map();
const asmVantage = new Map();
for (const m of asmSrc.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  if (!id) continue;
  asmName.set(id, (m[1].match(/\bname:\s*"([^"]+)"/) || [])[1]);
  asmVantage.set(id, (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1]);
}

const ACCESS_FOR_VANTAGE = {
  gateway: "public", space: "public", time: "member",
  member: "member", capital: "office", admin: "office",
};
const GROUP_VANTAGE = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};
const join = (c) => [...c.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("");
const resolveConst = (n) => {
  const m = src.match(new RegExp(`export const ${n}\\s*=\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+);`));
  return m ? join(m[1]) : "";
};

const SECTIONS = [
  ["PUBLIC_ROUTES", "Public", "The gateway. Anyone, indexable."],
  ["LEGAL_ROUTES", "Legal", "Standing statements. All public — a document behind a sign-in is one nobody can rely on before they sign in."],
  ["AUTH_ROUTES", "Identity & Passport", "Sixteen accreditation stages, each its own URL so a partial application is returnable by link."],
  ["MEMBER_ROUTES", "Member Workspace", "Requires a settled position. The Member Law has fired."],
  ["CAPITAL_ROUTES", "Capital Workspace", "Operational. Carries data about people other than the viewer."],
  ["ADMIN_ROUTES", "Administration", "Every route names the RIGHT it requires, never the role that holds it."],
  ["SYSTEM_ROUTES", "System States", "Places that are really states."],
];

function parseSection(name) {
  const block = src.match(new RegExp(`export const ${name}: readonly Route\\[\\] = \\[([\\s\\S]*?)\\n\\];`));
  if (!block) return [];
  const out = [];
  // The trailing "\n" matters. The block capture stops at "\n];", so the
  // newline the route pattern needs after ")," belongs to the terminator
  // rather than the content — and the LAST route of every section was
  // silently dropped. Seven sections, seven missing routes, no error.
  for (const m of (block[1] + "\n").matchAll(
    /R\(\s*(`[^`]*`|"[^"]*")\s*,\s*(`[^`]*`|"[^"]*")\s*,\s*"(\w+)"\s*,\s*(null|"[^"]*")([\s\S]*?)\n?\s*\),?\n/g,
  )) {
    const tail = m[5];
    const unq = (s) => s.replace(/^[`"]|[`"]$/g, "");
    const o = tail.match(/accessOverride:\s*\{\s*access:\s*"(\w+)"[\s\S]*?because:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+|[A-Z][A-Z0-9_]*)/);
    const nt = tail.match(/notes:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)/);
    out.push({
      path: unq(m[1]), name: unq(m[2]), group: m[3],
      assembly: m[4] === "null" ? null : unq(m[4]),
      rights: [...((tail.match(/rights:\s*\[([^\]]*)\]/) || [, ""])[1]).matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      override: o ? {
        access: o[1],
        because: /^[A-Z][A-Z0-9_]*$/.test(o[2].trim()) ? resolveConst(o[2].trim()) : join(o[2]),
      } : null,
      notes: nt ? join(nt[1]) : "",
    });
  }
  return out;
}

const STAGES = [...((src.match(/export const PASSPORT_STAGES = \[([\s\S]*?)\] as const;/) || [, ""])[1])
  .matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const groups = SECTIONS.map(([k, title, blurb]) => ({ k, title, blurb, routes: parseSection(k) }));
const all = groups.flatMap((g) => g.routes);

if (all.length === 0 || STAGES.length === 0) {
  console.error("[ia-map] Parsed zero routes or zero passport stages. Refusing to write.");
  process.exit(2);
}

/**
 * Reconciliation. The section-by-section parse must account for every
 * route a whole-file parse finds.
 *
 * This is here because it caught a real drop: the section capture stops
 * at "\n];", which swallowed the newline the route pattern needs, and the
 * LAST route of all seven sections vanished from the map. Seven routes,
 * no error, a document that looked complete. A partial map is worse than
 * no map, because it gets trusted.
 */
{
  const WHOLE = /R\(\s*(`[^`]*`|"[^"]*")\s*,\s*(`[^`]*`|"[^"]*")\s*,\s*"(\w+)"\s*,\s*(null|"[^"]*")([\s\S]*?)\n?\s*\),?\n/g;
  const whole = [...src.matchAll(WHOLE)].map((m) => m[1].replace(/^[`"]|[`"]$/g, ""));
  const mine = new Set(all.map((r) => r.path));
  const dropped = whole.filter((p) => !mine.has(p));
  if (dropped.length) {
    console.error(
      `[ia-map] ${dropped.length} route(s) present in the file but missing from the map: ` +
        `${dropped.join(", ")}. Refusing to write a partial architecture.`,
    );
    process.exit(2);
  }
}

const accessOf = (r) => {
  if (r.override) return r.override.access;
  const v = r.assembly && asmVantage.has(r.assembly) ? asmVantage.get(r.assembly) : GROUP_VANTAGE[r.group];
  return ACCESS_FOR_VANTAGE[v];
};
const TONE = { public: "#1FAA59", identified: "#7FA4EE", accredited: "#C79F6B",
               member: "#E8672E", office: "#FF3B30" };
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const code = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

const tally = {};
for (const r of all) tally[accessOf(r)] = (tally[accessOf(r)] || 0) + 1;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · Information Architecture</title><style>
:root{--void:#0A0A0A;--panel:#121212;--paper:#F2F2F2;--inv:#F2F2F2;--dim:#9A9A9A;
--steel:#6B6B6B;--copper:#C79F6B;--confirm:#1FAA59;--hazard:#E8672E;--critical:#FF3B30;
--blue:#7FA4EE;--hair:rgba(242,242,242,.10);
--fd:'Outfit','Segoe UI Variable Display',-apple-system,system-ui,sans-serif;
--fb:'Inter','Segoe UI Variable',-apple-system,system-ui,sans-serif;
--fm:'Space Mono',ui-monospace,Consolas,'SFMono-Regular',monospace}
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
body{background:var(--void);color:var(--inv);font:400 15px/1.6 var(--fb);-webkit-font-smoothing:antialiased}
.w{max-width:1240px;margin:0 auto;padding:0 24px 120px}
header{padding:72px 0 36px;border-bottom:1px solid var(--hair)}
.eb{font:400 11px/1 var(--fm);letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
h1{font:600 clamp(36px,5.6vw,58px)/1 var(--fd);letter-spacing:-.035em;margin:14px 0 0;text-wrap:balance}
.lede{margin-top:22px;max-width:76ch;font-size:17px;color:#D8D8D8}
.lede strong{color:var(--inv)}
.tally{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:1px;
background:var(--hair);border:1px solid var(--hair);margin-top:34px}
.tally div{background:var(--panel);padding:18px}
.tally b{display:block;font:600 27px/1 var(--fm);font-variant-numeric:tabular-nums}
.tally span{display:block;font:400 10px/1.4 var(--fm);letter-spacing:.14em;
text-transform:uppercase;color:var(--dim);margin-top:6px}
.grp{margin-top:56px}
.grp-h{padding-bottom:14px;border-bottom:1px solid var(--hair);margin-bottom:4px}
.grp-h h2{font:600 21px/1.2 var(--fd);letter-spacing:-.02em}
.grp-h p{font-size:13.5px;color:var(--dim);margin-top:6px;max-width:82ch}
.grp-h .n{float:right;font:400 11px/1 var(--fm);color:var(--steel)}
.rt{display:grid;grid-template-columns:minmax(240px,1.3fr) 1fr 96px 190px;gap:16px;
padding:13px 0;border-bottom:1px solid rgba(242,242,242,.055);align-items:baseline}
@media(max-width:900px){.rt{grid-template-columns:1fr;gap:5px;padding:16px 0}}
.rt:hover{background:rgba(242,242,242,.03)}
.pth{font:400 13.5px/1.5 var(--fm);word-break:break-all}
.pth em{color:var(--copper);font-style:normal}
.nm{font-size:14px}
.asm{font:400 11.5px/1.5 var(--fm);color:var(--dim)}
.ac{font:400 10px/1 var(--fm);letter-spacing:.12em;text-transform:uppercase;
border:1px solid currentColor;padding:4px 8px;white-space:nowrap;justify-self:start}
.rg{font:400 11px/1.5 var(--fm);color:var(--copper)}
.nt{grid-column:1/-1;font-size:12.5px;color:var(--dim);padding-left:14px;
border-left:2px solid var(--hair);max-width:88ch;margin-top:2px}
.ov{grid-column:1/-1;font-size:12.5px;color:#CFCFCF;padding-left:14px;
border-left:2px solid var(--hazard);max-width:88ch;margin-top:2px}
.ov b{color:var(--hazard);font:400 9.5px/1.6 var(--fm);letter-spacing:.14em;text-transform:uppercase;
display:block;margin-bottom:3px}
.stages{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:1px;
background:var(--hair);border:1px solid var(--hair);margin-top:14px}
.stages div{background:var(--panel);padding:12px 14px}
.stages .i{font:400 10px/1 var(--fm);color:var(--steel)}
.stages .t{display:block;font-size:13px;margin-top:5px;text-transform:capitalize}
.laws{margin-top:64px;padding-top:36px;border-top:1px solid var(--hair)}
.law{border-left:2px solid var(--copper);padding-left:18px;margin-bottom:22px;max-width:84ch}
.law b{display:block;font:400 10px/1 var(--fm);letter-spacing:.16em;text-transform:uppercase;
color:var(--copper);margin-bottom:7px}
.law p{color:#D6D6D6}
footer{margin-top:72px;padding-top:26px;border-top:1px solid var(--hair);
color:var(--dim);font:400 12px/1.7 var(--fm)}
code{font-family:var(--fm);font-size:.88em;background:rgba(242,242,242,.07);padding:1px 5px}
</style></head><body><div class="w">

<header>
<div class="eb">GC.SYSTEM · Wave 7 · Information Architecture</div>
<h1>Every URL<br>in the system.</h1>
<p class="lede">
<strong>${all.length} routes</strong> across seven sections, plus ${STAGES.length} generated passport
stages. Access is <strong>derived from the assembly's vantage</strong> rather than declared — the
aperture tier already decided what each vantage may see, and a route restating it would be a second
source of truth. ${all.filter((r) => r.override).length} routes override that derivation, and every
one states why.
</p>
<div class="tally">
${["public", "identified", "accredited", "member", "office"].map((k) =>
  `<div><b style="color:${TONE[k]}">${tally[k] || 0}</b><span>${k}</span></div>`).join("")}
<div><b>${all.filter((r) => r.override).length}</b><span>Overrides</span></div>
<div><b>${new Set(all.flatMap((r) => r.rights)).size}</b><span>Rights used</span></div>
</div>
</header>

${groups.map((g) => `<section class="grp">
<div class="grp-h"><span class="n">${g.routes.length} routes</span>
<h2>${esc(g.title)}</h2><p>${esc(g.blurb)}</p></div>
${g.routes.map((r) => { const a = accessOf(r); return `<div class="rt">
<span class="pth">${esc(r.path).replace(/\[(\w+)\]/g, "<em>[$1]</em>")}</span>
<span><span class="nm">${esc(r.name)}</span>${r.assembly
  ? `<br><span class="asm">${esc(r.assembly)} · ${esc(asmName.get(r.assembly) || "")}</span>` : ""}</span>
<span class="ac" style="color:${TONE[a]}">${a}</span>
<span class="rg">${r.rights.map(esc).join("<br>") || ""}</span>
${r.override ? `<span class="ov"><b>Override → ${esc(r.override.access)}</b>${esc(r.override.because)}</span>` : ""}
${r.notes ? `<span class="nt">${code(r.notes)}</span>` : ""}
</div>`; }).join("")}
${g.k === "AUTH_ROUTES" ? `<div class="stages">
${STAGES.map((s, i) => `<div><span class="i">${String(i + 1).padStart(2, "0")}</span>
<span class="t">${esc(s.replace(/-/g, " "))}</span></div>`).join("")}
</div>` : ""}
</section>`).join("")}

<section class="laws">
<div class="eb">The rules this table runs on</div>
<h1 style="font-size:clamp(28px,4vw,40px);margin:12px 0 32px">Six laws.</h1>
${[...src.matchAll(/^\s{2}(\w+):\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+),\s*$/gm)]
  .filter((m) => /^(accessIsDerived|overridesStateTheirReason|noSuperAdmin|rightsNotRoles|indexOnlyPublic|notFoundNeverConfirms)$/.test(m[1]))
  .map((m) => `<div class="law"><b>${m[1].replace(/([A-Z])/g, " $1").trim()}</b>
<p>${code(join(m[2]))}</p></div>`).join("")}
</section>

<footer>
Generated from constants/routes.ts · paths, access, assemblies, rights and reasons are parsed, not retyped.<br>
route-lint enforces nine checks over this table, each proven to fire against a deliberately broken copy.<br>
There is no super-admin. The eight roles are offices and committees; a role holding every right is
the condition separationViolations() exists to detect.
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(ROOT, "INFORMATION-ARCHITECTURE.html"), html);
console.log("[ia-map] wrote INFORMATION-ARCHITECTURE.html");
console.log(`  ${all.length} routes · ${STAGES.length} passport stages · ` +
  `${all.filter((r) => r.override).length} overrides`);
console.log("  " + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(" · "));
