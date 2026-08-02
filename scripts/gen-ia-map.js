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
const { parseRoutesSource } = require("./lib/route-source-parser");
const ROOT = path.resolve(__dirname, "..");
const read = (...p) =>
  fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const src = read("constants", "routes.ts");
const asmSrc = read("constants", "assemblies.ts");

const asmName = new Map();
const asmVantage = new Map();
const asmScope = new Map();
const asmIntent = new Map();
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
/**
 * Decode the escapes a TypeScript string literal may carry.
 *
 * The parser lifts source text, so "\u2014" arrived as six characters and
 * rendered as `\u2014` in the middle of a sentence. Anything written as
 * an escape in the canon has to be decoded before it is displayed, or the
 * map shows the source rather than the string.
 */
const unescapeTs = (s) =>
  s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
   .replace(/\\n/g, " ")
   .replace(/\\(["'\\])/g, "$1");

const join = (c) =>
  unescapeTs([...c.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join(""));
const SECTIONS = [
  ["public", "Public", "The gateway and public vehicle story. Anyone, indexable."],
  ["legal", "Legal", "One governed document renderer, selected by document slug."],
  ["investor", "Investor", "Qualification, private diligence and commitment for the permitted relationship state."],
  ["member", "Member", "A settled holder's portfolio and vehicle-scoped records."],
  ["office", "Office", "Investment-vehicle operating control. Every write is gated by a named right."],
  ["system", "System", "Sign in, verification, health and non-disclosing denial."],
];

const officePrefixes = new Set(["OFF", "SPA", "CAP", "TIM", "PRJ", "PAR", "GOV", "DOC", "ACT", "NET", "SYS"]);
const sectionOf = (route) => {
  const prefix = route.ia.split("-")[0];
  if (/^GC-9/.test(route.ia)) return "system";
  if (route.ia === "GC-510") return "legal";
  if (prefix === "INV") return "investor";
  if (prefix === "MEM") return "member";
  if (officePrefixes.has(prefix)) return "office";
  return "public";
};
const parsedRoutes = parseRoutesSource(src).map((route) => ({
  ...route,
  override: route.override ? { access: route.override, because: route.overrideBecause } : null,
}));
const groups = SECTIONS.map(([k, title, blurb]) => ({
  k, title, blurb, routes: parsedRoutes.filter((route) => sectionOf(route) === k),
}));
const all = groups.flatMap((g) => g.routes);

if (all.length === 0 || all.length !== parsedRoutes.length) {
  console.error("[ia-map] Parsed zero routes or failed to classify every route. Refusing to write.");
  process.exit(2);
}

const accessOf = (r) => {
  if (r.override) return r.override.access;
  const v = r.assembly && asmVantage.has(r.assembly) ? asmVantage.get(r.assembly) : GROUP_VANTAGE[r.group];
  return ACCESS_FOR_VANTAGE[v];
};

/* ═══════════════════════════════════════════════════════════════════
   WHAT IS ON EACH PAGE

   A map of URLs is a table of contents with the contents left out. Each
   of these is parsed from the registry that owns it, so a page's entry
   here cannot describe something the application does not render.
   ═══════════════════════════════════════════════════════════════════ */

/** Assembly → its sections. What the screen is made of. */
const asmSections = new Map();
for (const m of asmSrc.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  if (!id) continue;
  const secs = [...m[1].matchAll(
    /S\(\s*"([^"]+)",\s*"([^"]+)",\s*"(\w+)",\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+),\s*\[([^\]]*)\]/g,
  )].map((x) => ({
    ref: x[1], name: x[2], kind: x[3],
    purpose: join(x[4]),
    contains: [...x[5].matchAll(/"([^"]+)"/g)].map((y) => y[1]),
  }));
  asmSections.set(id, secs);
  asmScope.set(id, (m[1].match(/\bscope:\s*"([^"]+)"/) || [])[1] || "screen");
  asmIntent.set(id, (m[1].match(/\bintent:\s*\n?\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || "");
}

/** The public surface: path → its panes, from content/public.ts. */
const publicSrc = read("content", "public.ts");
const publicPages = new Map();
for (const m of publicSrc.matchAll(/export const \w+: PublicPage = \{([\s\S]*?)\n\};/g)) {
  const b = m[1];
  const ppath = (b.match(/\bpath:\s*"([^"]+)"/) || [])[1];
  if (!ppath) continue;
  const panes = [...b.matchAll(
    /n:\s*"(\d\d)",\s*eyebrow:\s*"([^"]*)",\s*ground:\s*"(\w+)",\s*\n?\s*title:\s*"((?:[^"\\]|\\.)*)"/g,
  )].map((x) => ({ n: x[1], eyebrow: unescapeTs(x[2]), ground: x[3], title: unescapeTs(x[4]) }));
  publicPages.set(ppath, {
    id: (b.match(/\bid:\s*"([^"]+)"/) || [])[1],
    alias: (b.match(/\balias:\s*"([^"]*)"/) || [])[1],
    unpopulated: /\bunpopulated:/.test(b),
    panes,
  });
}
if (publicPages.size === 0) {
  console.error("[ia-map] Parsed zero public pages. Refusing to write with the public surface missing.");
  process.exit(2);
}

/** The member surfaces: path -> its blocks, from content/member.ts. */
const memberSrc = read("content", "member.ts");
const memberSurfaces = new Map();
for (const m of memberSrc.matchAll(/export const \w+: MemberSurface = \{([\s\S]*?)\n\};/g)) {
  const b = m[1];
  const mpath = (b.match(/\bpath:\s*"([^"]+)"/) || [])[1];
  if (!mpath) continue;
  const blocks = [...b.matchAll(/ref:\s*"(\d\d)",\s*title:\s*"([^"]*)",\s*ground:\s*"(\w+)"/g)]
    .map((x) => ({ ref: x[1], title: unescapeTs(x[2]), ground: x[3] }));
  memberSurfaces.set(mpath, {
    id: (b.match(/\bid:\s*"([^"]+)"/) || [])[1],
    alias: (b.match(/\balias:\s*"([^"]*)"/) || [])[1],
    undrafted: /\bundrafted:/.test(b),
    blocks,
  });
}
if (memberSurfaces.size === 0) {
  console.error("[ia-map] Parsed zero member surfaces. Refusing to write with them missing.");
  process.exit(2);
}

/** Declared contents for routes that render no assembly. */
const pageContents = new Map();
{
  const block = src.match(/export const PAGE_CONTENTS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (block) {
    for (const m of block[1].matchAll(/"([^"]+)":\s*\[([\s\S]*?)\n  \],/g)) {
      const items = [...m[2].matchAll(
        /\{\s*part:\s*"((?:[^"\\]|\\.)*)",\s*holds:\s*"((?:[^"\\]|\\.)*)"\s*\}/g,
      )].map((x) => ({ part: unescapeTs(x[1]), holds: unescapeTs(x[2]) }));
      if (items.length) pageContents.set(m[1], items);
    }
  }
}

/** The legal corpus: path → document, its parts and its clause headings. */
const legalSrc = read("content", "legal.ts");
const documents = new Map();
for (const m of legalSrc.matchAll(/const (\w+): StandingDocument = \{([\s\S]*?)\n\};/g)) {
  const b = m[2];
  const dpath = (b.match(/\bpath:\s*"([^"]+)"/) || [])[1];
  if (!dpath) continue;
  const parts = [];
  for (const pm of b.matchAll(/\{\s*\n\s*ref:\s*"(\w+)",\s*\n\s*title:\s*"([^"]*)",([\s\S]*?)\n    \},/g)) {
    const clauses = [...pm[3].matchAll(/\{\s*n:\s*"([^"]+)"(?:,\s*h:\s*"((?:[^"\\]|\\.)*)")?/g)]
      .map((c) => ({ n: c[1], h: c[2] || "" }));
    parts.push({ ref: pm[1], title: pm[2], clauses });
  }
  documents.set(dpath, {
    id: (b.match(/\bid:\s*"([^"]+)"/) || [])[1],
    title: (b.match(/\btitle:\s*"([^"]*)"/) || [])[1],
    version: (b.match(/\bversion:\s*"([^"]*)"/) || [])[1],
    effective: (b.match(/\beffective:\s*"([^"]*)"/) || [])[1],
    purpose: join((b.match(/\bpurpose:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)/) || [, ""])[1]),
    parts,
  });
}

/** The Journal. */
const journalSrc = read("content", "journal.ts");
const entries = [...journalSrc.matchAll(
  /const J\d+: Entry = \{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)",\s*\n\s*title:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g,
)].map((m) => ({ id: m[1], slug: m[2], title: m[3] }));

/** The vehicle console's panels (AS-31). */
const consoleSrc = read("app", "_assemblies", "console.tsx");
const panels = [...consoleSrc.matchAll(/\{ id: "(\w+)", label: "([^"]+)", note: "([^"]*)" \}/g)]
  .map((m) => ({ id: m[1], label: m[2], note: m[3] }));

/** The accreditation steps inside the worked flow. */
const flowSrc = read("app", "_assemblies", "flow.tsx");
const flowSteps = [...flowSrc.matchAll(/\{ id: "(\w+)", t: "([^"]+)", d: "([^"]*)" \}/g)]
  .map((m) => ({ id: m[1], t: m[2], d: m[3] }));

/** The property Asset Disclosure sections. */
const ssSrc = read("app", "_assemblies", "slowspace.ts");
const disclosureItems = [...ssSrc.matchAll(/\n    n: "(\d\d)",\s*\n\s*t: "([^"]+)",/g)]
  .map((m) => ({ n: m[1], t: m[2] }));

if (documents.size === 0 || entries.length === 0 || panels.length === 0 ||
    flowSteps.length === 0 || disclosureItems.length === 0) {
  console.error(
    "[ia-map] A contents registry parsed as empty " +
      `(documents ${documents.size}, journal ${entries.length}, panels ${panels.length}, ` +
      `flow steps ${flowSteps.length}, disclosure ${disclosureItems.length}). ` +
      "Refusing to write an architecture with the contents missing.",
  );
  process.exit(2);
}

/**
 * What a page contains, as a list of lines.
 *
 * Order matters: the most specific source wins. A legal route describes
 * its own parts rather than AS-29's generic five sections, because the
 * question "what is on /legal/terms" is answered by the document, not by
 * the renderer.
 */
function contentsOf(r) {
  const out = [];

  const doc = documents.get(r.path);
  if (doc) {
    out.push({ h: `${doc.id} · v${doc.version} · in force ${doc.effective}`, t: doc.purpose });
    for (const part of doc.parts) {
      out.push({
        h: `Part ${part.ref} — ${part.title}`,
        t: part.clauses.map((c) => (c.h ? `${c.n} ${c.h}` : c.n)).join(" · "),
      });
    }
    return out;
  }

  if (r.path === "/journal") {
    out.push({ h: `${entries.length} entries, newest first`,
               t: entries.map((e) => `${e.id} ${e.title}`).join(" · ") });
    return out;
  }
  if (r.path === "/journal/[slug]") {
    for (const e of entries) out.push({ h: `/journal/${e.slug}`, t: `${e.id} — ${e.title}` });
    return out;
  }

  if (r.path === "/flow/accreditation") {
    for (const st of flowSteps) out.push({ h: st.t, t: st.d });
    out.push({ h: "Terms dialog", t: "The Terms and Conditions rendered over the form. The agree control is disabled until the document has been opened." });
    return out;
  }
  if (r.path === "/flow/risk") {
    for (const it of disclosureItems) out.push({ h: it.n, t: it.t });
    out.push({ h: "Important Investment Risk", t: "Stated outside the numbered sequence. Reduced, delayed, lower value, partial loss, total loss." });
    out.push({ h: "Acknowledgement", t: "Recorded against a version, enabled on reaching the end by any route." });
    return out;
  }
  if (r.path === "/flow/settled") {
    out.push({ h: "AS-31 The Vehicle Console",
               t: panels.map((x) => x.label).join(" · ") });
    for (const x of panels) out.push({ h: `— ${x.label}`, t: x.note });
    return out;
  }

  const pub = publicPages.get(r.path);
  if (pub && pub.panes.length) {
    out.push({ h: `${pub.id} · ${pub.alias}`,
               t: `${pub.panes.length} panes · ` +
                  `${pub.panes.filter((x) => x.ground === "paper").length} on paper` +
                  (pub.unpopulated ? " · states that it is not yet populated" : "") });
    for (const pane of pub.panes) {
      out.push({ h: `${pane.n} ${pane.eyebrow}`, t: `${pane.title}  ⟨${pane.ground}⟩` });
    }
    return out;
  }

  const mem = memberSurfaces.get(r.path);
  if (mem && mem.blocks.length) {
    out.push({ h: `${mem.id} · ${mem.alias}`,
               t: `${mem.blocks.length} blocks · ` +
                  `${mem.blocks.filter((x) => x.ground === "paper").length} on paper` +
                  (mem.undrafted ? " · carries a capability marked NOT IN FORCE" : "") });
    for (const bl of mem.blocks) out.push({ h: `${bl.ref} ${bl.title}`, t: `⟨${bl.ground}⟩` });
    return out;
  }

  const declared = pageContents.get(r.path);
  if (declared) {
    for (const d of declared) out.push({ h: d.part, t: d.holds });
    return out;
  }

  const secs = r.assembly ? asmSections.get(r.assembly) : null;
  if (secs && secs.length) {
    for (const sec of secs) {
      out.push({
        h: `${sec.ref} ${sec.name}`,
        t: sec.purpose + (sec.contains.length ? `  ⟨renders ${sec.contains.join(", ")}⟩` : ""),
      });
    }
    return out;
  }

  return out;
}

const TONE = { public: "#1FAA59", identified: "#7FA4EE", accredited: "#C79F6B",
               member: "#E8672E", office: "#FF3B30" };
/**
 * The page ending: the last segment of the URL.
 *
 * It is what people type, quote and mistype, so it is shown on its own
 * rather than left to be read off the end of the full path. The root is
 * "/" and has no ending; a dynamic segment keeps its brackets, because
 * the ending of that page is a shape rather than a word.
 */
const ending = (p) => {
  if (p === "/") return "/";
  const seg = p.split("/").filter(Boolean);
  return "/" + seg[seg.length - 1];
};

const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const code = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

const tally = {};
for (const r of all) tally[accessOf(r)] = (tally[accessOf(r)] || 0) + 1;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · Information Architecture</title><style>
:root{--void:#0A0A0A;--panel:#121212;--paper:#F2F2F2;--inv:#F2F2F2;--dim:#9A9A9A;
/* --steel is 3.72:1 on void and 3.52:1 on the panel. It is a NON-TEXT
   colour here exactly as it is in the application, and it is kept only
   for rules and borders. Two labels used it as text — the route count
   and the passport stage index — which is the same defect the palette
   fixed in the app, reappearing in a standalone document that carries
   its own copy of the palette and that no checker reads. */
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
.grp-h .n{float:right;font:400 11px/1 var(--fm);color:var(--dim)}
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
.stages .i{font:400 10px/1 var(--fm);color:var(--dim)}
.stages .t{display:block;font-size:13px;margin-top:5px;text-transform:capitalize}
.cts{grid-column:1/-1;margin-top:10px;padding:12px 14px;background:rgba(242,242,242,.035);
border-left:2px solid var(--copper)}
.cts>b{display:block;font:400 9.5px/1.6 var(--fm);letter-spacing:.14em;text-transform:uppercase;
color:var(--copper);margin-bottom:8px}
.cts>b code{font-family:var(--fm);color:var(--inv);letter-spacing:0;text-transform:none;font-size:11px}
.ct{display:grid;grid-template-columns:minmax(150px,270px) 1fr;gap:14px;padding:4px 0;
border-top:1px solid rgba(242,242,242,.05)}
.ct:first-of-type{border-top:0}
@media(max-width:900px){.ct{grid-template-columns:1fr;gap:2px;padding:7px 0}}
.ch{font:400 11.5px/1.5 var(--fm);color:#D8D8D8}
.cp{font-size:12.5px;color:var(--dim);max-width:86ch}
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
<strong>${all.length} routes</strong> across six canonical realms. Access is
<strong>derived from the assembly's vantage</strong> rather than declared — the
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
${(() => { const c = contentsOf(r); if (!c.length) return ""; return `<div class="cts">
<b>Ending <code>${esc(ending(r.path))}</code> &middot; contents</b>
${c.map((x) => `<div class="ct"><span class="ch">${esc(x.h)}</span><span class="cp">${esc(x.t)}</span></div>`).join("")}
</div>`; })()}
</div>`; }).join("")}
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

/*
 * Coverage, reported rather than assumed.
 *
 * A route with no contents is a page whose registry says nothing about
 * what is on it. That is sometimes correct — a system state is a state —
 * but it should be VISIBLE, because a map that silently omits half its
 * pages reads as a map of a smaller system.
 */
{
  const withContents = all.filter((r) => contentsOf(r).length);
  const without = all.filter((r) => !contentsOf(r).length);
  console.log(
    `[ia-map] contents: ${withContents.length}/${all.length} routes describe what they hold`,
  );
  if (without.length) {
    console.error(
      `[ia-map] ${without.length} route(s) describe no contents: ` +
        `${without.map((r) => r.path).join(", ")}.\n` +
        `  Give each an assembly or a governed contents description.\n` +
        `  A URL with no stated contents is a page nobody has described, and a map that ` +
        `lists it silently reads as a map of a smaller system.`,
    );
    process.exit(2);
  }
}

fs.writeFileSync(path.join(ROOT, "INFORMATION-ARCHITECTURE.html"), html);
console.log("[ia-map] wrote INFORMATION-ARCHITECTURE.html");
console.log(`  ${all.length} routes · ` +
  `${all.filter((r) => r.override).length} overrides`);
console.log("  " + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(" · "));
