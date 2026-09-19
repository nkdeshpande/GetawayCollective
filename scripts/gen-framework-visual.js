#!/usr/bin/env node
/**
 * FRAMEWORK VISUAL — builds GC-FRAMEWORK-VISUAL.html
 *
 * ── WHY A SECOND DOCUMENT ────────────────────────────────────────────
 * GC-OPERATING-FRAMEWORK.html answers "what are the rules" and answers it
 * in tables, which is the right shape for a reference somebody consults.
 * It is the wrong shape for the one thing about this model that is hard to
 * hold in the head: that eighteen kinds of file fan into eight queues, and
 * which file reaches which desk.
 *
 * A routing table with thirty-three edges is a list you read serially. The
 * same thirty-three edges drawn are a shape you see at once. This document
 * is that shape, and it draws nothing the framework does not already say.
 *
 * ── THE GEOMETRY IS COMPUTED, NOT DRAWN ──────────────────────────────
 * Every node position, every curve and every count comes out of the same
 * registries the framework document reads. Nobody nudges a box. Adding a
 * document kind moves the layout and redraws the edges, which is the only
 * way a diagram of a live system stays honest — a hand-placed one is wrong
 * the first time the system changes and looks authoritative while wrong.
 *
 *   node scripts/gen-framework-visual.js
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "GC-FRAMEWORK-VISUAL.html");
const die = (m) => { console.error(`[framework-visual] ${m}`); process.exit(2); };

function loadTypeScript(rel, resolveImport = () => ({})) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, { module: mod, exports: mod.exports, require: resolveImport, Set, Map, Error, Object, Array, JSON, console, Date });
  return mod.exports;
}

const authority = loadTypeScript("lib/authority.ts");
const businessObjects = loadTypeScript("constants/business-objects.ts");
const voting = loadTypeScript("constants/voting.ts");
const events = loadTypeScript("lib/events.ts", (r) => r.includes("business-objects") ? businessObjects : {});
const governance = loadTypeScript("lib/governance.ts", (r) =>
  r.includes("voting") ? voting : r.includes("events") ? events : r.includes("authority") ? authority : businessObjects);
const commands = loadTypeScript("lib/commands.ts", (r) =>
  r.includes("business-objects") ? businessObjects : r.includes("events") ? events
    : r.includes("authority") ? authority : r.includes("governance") ? governance : {});
const intake = loadTypeScript("constants/intake.ts");

const { ROLE_RIGHTS } = authority;
const CAPABILITIES = commands.CAPABILITIES;
const ROLES = Object.keys(ROLE_RIGHTS);
const { DOCUMENT_KINDS, DECLARED_ACTS, PIPELINE } = intake;

if (!DOCUMENT_KINDS?.length || !ROLES.length || !CAPABILITIES?.length) die("Recovered an empty registry.");

const adminSrc = fs.readFileSync(path.join(ROOT, "lib/access-admin.ts"), "utf8");
const INTERNAL_ONLY = [...(adminSrc.match(/INTERNAL_ONLY_RIGHTS[^=]*=\s*\[([\s\S]*?)\]\s*as const;/) || [, ""])[1]
  .matchAll(/"([a-z_.]+)"/g)].map((m) => m[1]);
if (!INTERNAL_ONLY.length) die("INTERNAL_ONLY_RIGHTS parsed empty.");

const TOKENS_PATH = path.join(ROOT, "dist", "tokens.css");
if (!fs.existsSync(TOKENS_PATH)) die("dist/tokens.css is missing. Run `npm run tokens` first.");
const TOKENS = fs.readFileSync(TOKENS_PATH, "utf8");
for (const need of ["--gc-void", "--gc-copper", "--gc-hairline-inv", "--gc-f-display"]) {
  if (!TOKENS.includes(need)) die(`dist/tokens.css does not define ${need}.`);
}

/* ── Derived ──────────────────────────────────────────────────────── */

const DECLARED = DECLARED_ACTS.map((a) => a.command);
const FILE_BORNE = [...new Set(DOCUMENT_KINDS.flatMap((d) => d.proposes))];
const capByName = (n) => CAPABILITIES.find((c) => c.name === n);
const rolesFor = (cmdName) => {
  const c = capByName(cmdName);
  return c ? ROLES.filter((r) => ROLE_RIGHTS[r].includes(c.requiredRight)) : [];
};

/** kind → role edges, deduplicated. The shape this document exists to show. */
const EDGES = [];
for (const d of DOCUMENT_KINDS) {
  const reach = new Set(d.proposes.flatMap(rolesFor));
  for (const role of reach) EDGES.push({ kind: d.id, role });
}
if (EDGES.length === 0) die("Zero routing edges. A diagram of nothing must not render.");

const queueOf = (role) => {
  const rights = ROLE_RIGHTS[role];
  const disposes = CAPABILITIES.filter((c) => rights.includes(c.requiredRight));
  return {
    role,
    total: disposes.length,
    borne: disposes.filter((c) => !DECLARED.includes(c.name)).length,
    declared: disposes.filter((c) => DECLARED.includes(c.name)).length,
    locked: disposes.filter((c) => INTERNAL_ONLY.includes(c.requiredRight)).length,
  };
};
const QUEUES = ROLES.map(queueOf);

const CONF_ORDER = ["VERIFIED", "CORROBORATED", "REPORTED", "INFERRED", "FORECAST", "UNKNOWN"];
const BY_CEILING = CONF_ORDER.map((c) => ({ ceiling: c, kinds: DOCUMENT_KINDS.filter((d) => d.ceiling === c) }));

/* ── Geometry ─────────────────────────────────────────────────────── */
/* Computed from the counts. Nothing is positioned by hand, so adding a
   document kind or a role redraws the diagram rather than breaking it. */

const VB = { w: 1240, h: 1020 };
const L = { x: 16, w: 300, h: 40, gap: 13 };
const R = { x: 924, w: 300, h: 72, gap: 38 };
const SPINE = { x: 582, w: 76 };

const lSpan = DOCUMENT_KINDS.length * L.h + (DOCUMENT_KINDS.length - 1) * L.gap;
const rSpan = ROLES.length * R.h + (ROLES.length - 1) * R.gap;

/* Checked against the SPAN, before clamping. Writing this as
   `Math.max(20, …) < 20` reads like a guard and is dead code — the clamp
   has already made the condition unreachable, so a column that outgrew the
   canvas would render silently off the bottom edge. */
const MARGIN = 20;
for (const [what, span, n] of [["kind", lSpan, DOCUMENT_KINDS.length], ["role", rSpan, ROLES.length]]) {
  if (span + MARGIN * 2 > VB.h) {
    die(`${n} ${what} nodes need ${Math.ceil(span + MARGIN * 2)}px but the canvas is ${VB.h}px. Raise VB.h or tighten the gap — nodes would render off the edge.`);
  }
}

const lTop = (VB.h - lSpan) / 2;
const kindNode = (i) => ({ y: lTop + i * (L.h + L.gap), cy: lTop + i * (L.h + L.gap) + L.h / 2 });

const rTop = (VB.h - rSpan) / 2;
const roleNode = (j) => ({ y: rTop + j * (R.h + R.gap), cy: rTop + j * (R.h + R.gap) + R.h / 2 });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const roleLabel = (r) => r.replace(/_/g, " ");

/* Labels are drawn as SVG text, so an over-long one silently overflows its
   box rather than wrapping. Checked rather than trusted. */
const MAX_KIND = 40, MAX_ROLE = 30;
for (const d of DOCUMENT_KINDS) if (d.label.length > MAX_KIND) die(`Kind label "${d.label}" exceeds ${MAX_KIND} chars and would overflow its node.`);
for (const r of ROLES) if (roleLabel(r).length > MAX_ROLE) die(`Role label "${roleLabel(r)}" exceeds ${MAX_ROLE} chars.`);

function edgePaths() {
  return EDGES.map(({ kind, role }) => {
    const i = DOCUMENT_KINDS.findIndex((d) => d.id === kind);
    const j = ROLES.indexOf(role);
    const a = kindNode(i).cy, b = roleNode(j).cy;
    const x1 = L.x + L.w, x2 = R.x;
    /* Control points pull each curve through the spine, so the eye reads
       every route as passing through the same gate. */
    return `<path class="edge" data-kind="${esc(kind)}" data-role="${esc(role)}"
      d="M${x1},${a} C${SPINE.x - 90},${a} ${SPINE.x + SPINE.w + 90},${b} ${x2},${b}" />`;
  }).join("");
}

function kindNodes() {
  return DOCUMENT_KINDS.map((d, i) => {
    const { y } = kindNode(i);
    const reach = new Set(d.proposes.flatMap(rolesFor)).size;
    return `<g class="node kind" data-kind="${esc(d.id)}" tabindex="0" role="button"
        aria-label="${esc(d.label)} — reaches ${reach} queue${reach === 1 ? "" : "s"}">
      <rect x="${L.x}" y="${y}" width="${L.w}" height="${L.h}" />
      <text class="n-label" x="${L.x + 14}" y="${y + 25}">${esc(d.label)}</text>
      <text class="n-meta" x="${L.x + L.w - 14}" y="${y + 25}" text-anchor="end">${reach || "—"}</text>
    </g>`;
  }).join("");
}

function roleNodes() {
  return QUEUES.map((q, j) => {
    const { y } = roleNode(j);
    return `<g class="node queue" data-role="${esc(q.role)}" tabindex="0" role="button"
        aria-label="${esc(roleLabel(q.role))} queue — disposes ${q.total}">
      <rect x="${R.x}" y="${y}" width="${R.w}" height="${R.h}" />
      <text class="q-label" x="${R.x + 16}" y="${y + 30}">${esc(roleLabel(q.role))}</text>
      <text class="q-meta" x="${R.x + 16}" y="${y + 52}">${q.borne} borne · ${q.declared} declared · ${q.locked} locked</text>
      <text class="q-num" x="${R.x + R.w - 16}" y="${y + 44}" text-anchor="end">${q.total}</text>
    </g>`;
  }).join("");
}

/* ── Page ─────────────────────────────────────────────────────────── */

const stamp = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const maxCeil = Math.max(...BY_CEILING.map((b) => b.kinds.length), 1);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · Framework, drawn</title>
<style>
${TOKENS}
</style>
<style>
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
html{background:var(--gc-void)}
body{background:var(--gc-void);color:var(--gc-ink-inverse);font:400 15px/1.55 var(--gc-f-body);-webkit-font-smoothing:antialiased}
.micro{font:400 11px/1.3 var(--gc-f-mono);letter-spacing:.13em;text-transform:uppercase}
.mono{font-family:var(--gc-f-mono);font-variant-numeric:tabular-nums}
.dim{color:var(--gc-steel-dim)}
code{font:500 12px/1.4 var(--gc-f-mono);color:var(--gc-copper)}
.wrap{width:min(1400px,100%);margin:0 auto;padding:64px 32px 110px}
.eyebrow{color:var(--gc-copper);margin-bottom:16px}

.head{padding-bottom:52px;border-bottom:1px solid var(--gc-hairline-inv)}
h1{font:600 clamp(40px,6.5vw,84px)/.92 var(--gc-f-display);letter-spacing:-.05em;max-width:1000px;text-wrap:balance}
.head p{max-width:760px;margin-top:24px;color:var(--gc-steel-dim);font-size:17px}

.sec{padding:76px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.sec:last-of-type{border-bottom:0}
.sec-head{margin-bottom:40px;max-width:820px}
.sec-head h2{font:600 clamp(28px,3.6vw,46px)/1 var(--gc-f-display);letter-spacing:-.04em;margin-bottom:14px}
.sec-head p{color:var(--gc-steel-dim);font-size:15px}

/* ── 1 · Before / after ── */
.swap{display:grid;grid-template-columns:1fr 72px 1fr;align-items:center}
.pane{padding:34px;border:1px solid var(--gc-hairline-inv);min-height:400px}
.pane.after{border-color:var(--gc-copper)}
.pane h3{font:600 20px/1.2 var(--gc-f-display);margin:14px 0 6px}
.pane>.micro{color:var(--gc-steel-dim)}
.pane.after>.micro{color:var(--gc-copper)}
.pane .cap{color:var(--gc-steel-dim);font-size:13px;margin-bottom:24px}
.forms{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.forms i{display:block;aspect-ratio:1;border:1px solid var(--gc-hairline-inv);opacity:.55}
.drop{border:1px dashed var(--gc-copper);padding:30px;text-align:center;margin-bottom:20px}
.drop b{display:block;font:500 30px/1 var(--gc-f-mono);color:var(--gc-copper)}
.drop span{display:block;margin-top:9px;color:var(--gc-steel-dim);font-size:12.5px}
.qbars{display:grid;gap:6px}
.qbar{display:grid;grid-template-columns:150px 1fr 26px;gap:10px;align-items:center;font-size:12px}
.qbar span{color:var(--gc-steel-dim);text-transform:capitalize}
.qbar u{display:block;height:11px;background:var(--gc-copper);text-decoration:none}
.qbar b{color:var(--gc-copper);font-family:var(--gc-f-mono);text-align:right}
.swap-arrow{display:grid;place-items:center;color:var(--gc-copper);font:500 26px/1 var(--gc-f-mono)}

/* ── 2 · Routing ── */
.routing{border:1px solid var(--gc-hairline-inv);padding:8px;position:relative}
.routing svg{display:block;width:100%;height:auto}
.rk{display:flex;flex-wrap:wrap;gap:22px;margin-top:18px;padding-top:18px;border-top:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font-size:12px}
.rk b{color:var(--gc-ink-inverse);font-weight:500}
.hint{position:absolute;top:16px;left:50%;transform:translateX(-50%);padding:7px 14px;border:1px solid var(--gc-hairline-inv);background:var(--gc-void);color:var(--gc-steel-dim);pointer-events:none;transition:opacity .25s}
.routing.touched .hint{opacity:0}

svg .edge{fill:none;stroke:var(--gc-steel-dim);stroke-width:1;opacity:.20;transition:opacity .18s,stroke .18s,stroke-width .18s}
svg.lit .edge{opacity:.05}
svg .edge.on{stroke:var(--gc-copper);stroke-width:1.8;opacity:.95}
svg .node rect{fill:var(--gc-void);stroke:var(--gc-hairline-inv);stroke-width:1;transition:stroke .18s,fill .18s}
svg .node{cursor:pointer}
svg .node:focus{outline:none}
svg .node:focus rect{stroke:var(--gc-electric);stroke-width:2}
svg.lit .node rect{opacity:.34}
svg .node.on rect{opacity:1;stroke:var(--gc-copper);stroke-width:1.6}
svg .node.src rect{fill:var(--gc-copper);stroke:var(--gc-copper)}
svg text{pointer-events:none}
svg .n-label{fill:var(--gc-ink-inverse);font:400 13px var(--gc-f-body)}
svg .n-meta{fill:var(--gc-steel-dim);font:500 12px var(--gc-f-mono)}
svg .node.src .n-label,svg .node.src .n-meta{fill:var(--gc-void)}
svg .q-label{fill:var(--gc-ink-inverse);font:600 16px var(--gc-f-display);text-transform:capitalize}
svg .q-meta{fill:var(--gc-steel-dim);font:400 10.5px var(--gc-f-mono)}
svg .q-num{fill:var(--gc-copper);font:500 26px var(--gc-f-mono)}
svg .spine rect{fill:var(--gc-copper-deep);stroke:none;opacity:.14}
svg .spine line{stroke:var(--gc-copper);stroke-width:1;opacity:.5}
svg .spine text{fill:var(--gc-copper);font:500 11px var(--gc-f-mono);letter-spacing:.16em}
svg .colhead{fill:var(--gc-steel-dim);font:500 11px var(--gc-f-mono);letter-spacing:.13em}

/* ── 3 · Pipeline ── */
.pipe{display:grid;grid-template-columns:repeat(${PIPELINE.length},1fr);border:1px solid var(--gc-hairline-inv)}
.pstep{padding:26px 20px 0;border-right:1px solid var(--gc-hairline-inv);display:flex;flex-direction:column}
.pstep:last-child{border-right:0}
.pstep .micro{color:var(--gc-copper)}
.pstep h4{margin:14px 0 8px;font:600 18px/1.15 var(--gc-f-display)}
.pstep .who{align-self:flex-start;margin-bottom:14px;padding:2px 6px;border:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font:400 9px/1.5 var(--gc-f-mono);letter-spacing:.1em;text-transform:uppercase}
.pstep .who.h{border-color:var(--gc-copper);color:var(--gc-copper)}
.pstep>p{color:var(--gc-steel-dim);font-size:12.5px;margin-bottom:22px}
.reject{margin:auto -20px 0;padding:16px 20px;border-top:1px solid var(--gc-alert,#c05046);background:rgba(192,80,70,.07)}
.reject .micro{color:var(--gc-alert,#c05046);display:block;margin-bottom:7px}
.reject p{color:var(--gc-steel-dim);font-size:11.5px;line-height:1.45}

/* ── 4 · Lanes ── */
.lanes{display:grid;grid-template-columns:220px 1fr;gap:0;border:1px solid var(--gc-hairline-inv)}
.lanes-in{display:grid;place-items:center;padding:30px;border-right:1px solid var(--gc-hairline-inv);text-align:center}
.lanes-in b{display:block;font:500 56px/1 var(--gc-f-mono);color:var(--gc-copper)}
.lanes-in span{display:block;margin-top:10px;color:var(--gc-steel-dim);font-size:12.5px}
.lane{padding:28px 32px;border-bottom:1px solid var(--gc-hairline-inv)}
.lane:last-child{border-bottom:0}
.lane-top{display:flex;align-items:baseline;gap:16px;margin-bottom:8px}
.lane-top b{font:500 34px/1 var(--gc-f-mono)}
.lane-top h4{font:600 20px/1 var(--gc-f-display)}
.lane.borne .lane-top b,.lane.borne .micro{color:var(--gc-copper)}
.lane.act .lane-top b,.lane.act .micro{color:var(--gc-alert,#c05046)}
.lane>p{max-width:760px;color:var(--gc-steel-dim);font-size:13.5px;margin-bottom:16px}
.chips{display:flex;flex-wrap:wrap;gap:5px}
.chip2{padding:4px 8px;border:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font:400 10.5px/1.4 var(--gc-f-mono)}
.lane.act .chip2{border-color:var(--gc-alert,#c05046);color:var(--gc-alert,#c05046)}

/* ── 5 · Ceilings ── */
.ladder{border:1px solid var(--gc-hairline-inv)}
.rung{display:grid;grid-template-columns:190px 60px 1fr;gap:20px;align-items:center;padding:20px 24px;border-bottom:1px solid var(--gc-hairline-inv)}
.rung:last-child{border-bottom:0}
.rung.empty{opacity:.42}
.rung .cname{font:500 13px var(--gc-f-mono);letter-spacing:.09em}
.rung.vf .cname{color:var(--gc-confirm)}.rung.cb .cname{color:var(--gc-electric)}
.rung.rp .cname{color:var(--gc-caution,#c8862b)}
.rung .cn{font:500 22px var(--gc-f-mono);color:var(--gc-copper);text-align:right}
.rung .bar{display:flex;flex-wrap:wrap;gap:5px}
.rung.empty .cn{color:var(--gc-steel-dim)}
.rung .none{color:var(--gc-steel-dim);font-size:12.5px}

.note{margin-top:30px;padding:22px 24px;border:1px solid var(--gc-hairline-inv);border-left:3px solid var(--gc-copper);color:var(--gc-steel-dim);font-size:14px;max-width:940px}
.note strong{color:var(--gc-ink-inverse)}
.foot{padding:40px 0 0;color:var(--gc-steel-dim);font-size:12px}

@media (max-width:1000px){
  .wrap{padding:36px 18px 72px}
  .swap,.lanes{grid-template-columns:1fr}
  .swap-arrow{padding:16px 0;transform:rotate(90deg)}
  .pipe{grid-template-columns:1fr}
  .pstep{border-right:0;border-bottom:1px solid var(--gc-hairline-inv)}
  .lanes-in{border-right:0;border-bottom:1px solid var(--gc-hairline-inv)}
  .rung{grid-template-columns:1fr;gap:10px}
  .rung .cn{text-align:left}
  .routing{overflow-x:auto}
  .routing svg{min-width:860px}
  .hint{display:none}
}
@media print{
  html,body{background:#fff;color:#111}
  .sec{break-inside:avoid}
}
</style>
</head>
<body>
<div class="wrap">

  <header class="head">
    <p class="eyebrow micro">Getaway Collective · the operating model, drawn</p>
    <h1>Eighteen kinds of file.<br>Eight desks.</h1>
    <p>The framework document states the rules in tables, which is the right shape for something you consult.
      This is the shape that is hard to hold in the head: which file reaches which desk, what falls out on the way,
      and how strongly anything may be claimed once it arrives. Nothing here is drawn by hand —
      every position, curve and count is computed from the same registries.</p>
  </header>

  <!-- ═══ 1 · THE SWAP ═══ -->
  <section class="sec">
    <div class="sec-head">
      <h2>What changed.</h2>
      <p>Not the authority model — that is untouched. What changed is the surface: ${CAPABILITIES.length} forms,
        each reached by navigating to it, become one place to drop a file and ${ROLES.length} queues that fill themselves.</p>
    </div>
    <div class="swap">
      <div class="pane">
        <span class="micro">Before · keying</span>
        <h3>${CAPABILITIES.length} forms</h3>
        <p class="cap">One per capability. You go to the work, find the right screen, and transcribe.
          Every transcribed field arrives without a source.</p>
        <div class="forms">${CAPABILITIES.map(() => "<i></i>").join("")}</div>
      </div>
      <div class="swap-arrow" aria-hidden="true">→</div>
      <div class="pane after">
        <span class="micro">After · depositing</span>
        <h3>One deposit, ${ROLES.length} queues</h3>
        <p class="cap">Work comes to you, already addressed, already cited.
          Queue sizes below are derived from the rights each role holds — not assigned by anybody.</p>
        <div class="drop"><b>${DOCUMENT_KINDS.length}</b><span>document kinds accepted · ${EDGES.length} routes</span></div>
        <div class="qbars">
          ${QUEUES.map((q) => `<div class="qbar"><span>${esc(roleLabel(q.role))}</span>
            <u style="width:${Math.round((q.total / Math.max(...QUEUES.map((x) => x.total))) * 100)}%"></u>
            <b>${q.total}</b></div>`).join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ 2 · ROUTING ═══ -->
  <section class="sec">
    <div class="sec-head">
      <h2>Every route, at once.</h2>
      <p>${EDGES.length} routes from ${DOCUMENT_KINDS.length} document kinds to ${ROLES.length} queues, all passing through
        the same gate. Hover or tap any node to trace it. A route exists because the capabilities that kind proposes
        need a right that role carries — which means this picture cannot drift from the authority model,
        because it <em>is</em> the authority model.</p>
    </div>
    <div class="routing" id="routing">
      <span class="hint micro">Hover a node to trace its routes</span>
      <svg id="rsvg" viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="Routing diagram: ${DOCUMENT_KINDS.length} document kinds to ${ROLES.length} role queues, ${EDGES.length} routes">
        <text class="colhead" x="${L.x}" y="${Math.max(18, lTop - 16)}">DEPOSITED</text>
        <text class="colhead" x="${R.x}" y="${Math.max(18, rTop - 20)}">DISPOSED BY</text>
        <g class="spine">
          <rect x="${SPINE.x}" y="14" width="${SPINE.w}" height="${VB.h - 28}" />
          <line x1="${SPINE.x}" y1="14" x2="${SPINE.x}" y2="${VB.h - 14}" />
          <line x1="${SPINE.x + SPINE.w}" y1="14" x2="${SPINE.x + SPINE.w}" y2="${VB.h - 14}" />
          <text x="${SPINE.x + SPINE.w / 2}" y="${VB.h / 2}" text-anchor="middle"
            transform="rotate(-90 ${SPINE.x + SPINE.w / 2} ${VB.h / 2})">CLASSIFY · EXTRACT · RECONCILE · PROPOSE</text>
        </g>
        <g id="edges">${edgePaths()}</g>
        ${kindNodes()}
        ${roleNodes()}
      </svg>
      <div class="rk">
        <span><b>Number on a file</b> — queues it can reach</span>
        <span><b>Number on a queue</b> — capabilities it disposes</span>
        <span><b>borne</b> — arrives as a proposal</span>
        <span><b>declared</b> — never proposed; a person goes looking for it</span>
        <span><b>locked</b> — internal-only right, disposed one at a time</span>
      </div>
    </div>
    <div class="note">
      <p><strong>One kind has no routes at all.</strong> The bank and capital account statement is deposited for
        reconciliation only — it evidences that money moved, which is the opposite of authorising it. Everything it
        finds unmatched, in either direction, becomes an escalation rather than a proposal.</p>
    </div>
  </section>

  <!-- ═══ 3 · PIPELINE ═══ -->
  <section class="sec">
    <div class="sec-head">
      <h2>What falls out on the way.</h2>
      <p>Six stages between a file landing and a command running. What each stage does matters less than what it
        refuses — the refusals in red are where a document-led system either keeps its provenance or quietly
        becomes a faster way to produce unsourced figures.</p>
    </div>
    <div class="pipe">
      ${PIPELINE.map((s) => `<div class="pstep">
        <span class="micro">${esc(s.n)}</span>
        <h4>${esc(s.name)}</h4>
        <span class="who${s.actor === "grant-holder" || s.actor === "depositor" ? " h" : ""}">${esc(s.actor.replace("-", " "))}</span>
        <p>${esc(s.does)}</p>
        <div class="reject"><span class="micro">Refuses</span><p>${esc(s.refuses)}</p></div>
      </div>`).join("")}
    </div>
  </section>

  <!-- ═══ 4 · LANES ═══ -->
  <section class="sec">
    <div class="sec-head">
      <h2>Evidenced, or decided.</h2>
      <p>Every capability is reachable by exactly one lane. That closure is the property that makes this a framework
        rather than a diagram of one — a capability in neither is unreachable and nobody would notice; one in both
        resolves differently depending on who is looking.</p>
    </div>
    <div class="lanes">
      <div class="lanes-in">
        <div><b>${CAPABILITIES.length}</b><span>capabilities<br>${FILE_BORNE.length} + ${DECLARED.length}, no overlap</span></div>
      </div>
      <div>
        <div class="lane borne">
          <div class="lane-top"><b>${FILE_BORNE.length}</b><h4>Borne by a file</h4><span class="micro">evidenced</span></div>
          <p>A document exists saying the thing happened, and the system's job is to read it faithfully.
            The intelligence proposes; a grant-holder disposes.</p>
          <div class="chips">${FILE_BORNE.map((c) => `<span class="chip2">${esc(c)}</span>`).join("")}</div>
        </div>
        <div class="lane act">
          <div class="lane-top"><b>${DECLARED.length}</b><h4>Declared</h4><span class="micro">decided</span></div>
          <p>No document precedes these, because the decision <em>is</em> the event. Asking an agent to propose one
            would be asking it to author the judgement the grant exists to place with a person. Every capital
            movement and every conferral of authority sits here.</p>
          <div class="chips">${DECLARED.map((c) => `<span class="chip2">${esc(c)}</span>`).join("")}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ 5 · CEILINGS ═══ -->
  <section class="sec">
    <div class="sec-head">
      <h2>How strongly a file may speak.</h2>
      <p>A document kind caps the confidence of anything extracted from it. A sponsor's own workbook cannot yield a
        VERIFIED figure however cleanly it parses — cleanliness is not corroboration. The ceiling travels with the
        assertion, so a derived figure resting on one workbook cell can never present as stronger than that cell.</p>
    </div>
    <div class="ladder">
      ${BY_CEILING.map((b) => `<div class="rung ${{ VERIFIED: "vf", CORROBORATED: "cb", REPORTED: "rp" }[b.ceiling] || ""}${b.kinds.length ? "" : " empty"}">
        <span class="cname">${esc(b.ceiling)}</span>
        <span class="cn">${b.kinds.length}</span>
        <div class="bar">${b.kinds.length
          ? b.kinds.map((k) => `<span class="chip2" title="${esc(k.ceilingWhy)}">${esc(k.label)}</span>`).join("")
          : `<span class="none">Nothing is deposited at this level. These classes arise from derivation, never from a document.</span>`}</div>
      </div>`).join("")}
    </div>
    <div class="note">
      <p><strong>Nothing sits on the bottom three rungs.</strong> INFERRED, FORECAST and UNKNOWN are what happens to a
        figure after it is combined with another — they are produced by arithmetic, not deposited. A document that
        arrived claiming to be a forecast would still be REPORTED: it reports somebody's forecast.</p>
    </div>
  </section>

  <p class="foot">Generated ${esc(stamp)} from <code>constants/intake.ts</code>, <code>lib/authority.ts</code> and
    <code>lib/commands.ts</code>. Regenerate rather than edit — this file is output.
    The rules behind it are in GC-OPERATING-FRAMEWORK.html.</p>
</div>

<script>
(function(){
  var svg=document.getElementById('rsvg'), box=document.getElementById('routing');
  var edges=[].slice.call(svg.querySelectorAll('.edge'));
  var nodes=[].slice.call(svg.querySelectorAll('.node'));

  function clear(){
    svg.classList.remove('lit');
    edges.forEach(function(e){e.classList.remove('on');});
    nodes.forEach(function(n){n.classList.remove('on','src');});
  }

  /* Lighting both ends of every matching edge, rather than only the hovered
     node, is the whole point — the question a reader has is "and where does
     it go", which a highlighted source alone does not answer. */
  function lite(node){
    var kind=node.dataset.kind, role=node.dataset.role;
    var hits=edges.filter(function(e){
      return kind ? e.dataset.kind===kind : e.dataset.role===role;
    });
    if(!hits.length){ clear(); svg.classList.add('lit'); node.classList.add('src'); return; }
    clear();
    svg.classList.add('lit');
    node.classList.add('src');
    hits.forEach(function(e){
      e.classList.add('on');
      var other=svg.querySelector(kind
        ? '.node[data-role="'+e.dataset.role+'"]'
        : '.node[data-kind="'+e.dataset.kind+'"]');
      if(other)other.classList.add('on');
    });
    box.classList.add('touched');
  }

  nodes.forEach(function(n){
    n.addEventListener('mouseenter',function(){lite(n);});
    n.addEventListener('focus',function(){lite(n);});
    n.addEventListener('click',function(){lite(n);});
    n.addEventListener('blur',clear);
  });
  svg.addEventListener('mouseleave',clear);
})();
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html, "utf8");
console.log(
  `[framework-visual] ${DOCUMENT_KINDS.length} kinds · ${ROLES.length} queues · ${EDGES.length} routes drawn\n` +
  `[framework-visual] lanes ${FILE_BORNE.length} borne + ${DECLARED.length} declared = ${CAPABILITIES.length}\n` +
  `[framework-visual] ceilings ${BY_CEILING.filter((b) => b.kinds.length).map((b) => `${b.ceiling}=${b.kinds.length}`).join(" ")}\n` +
  `[framework-visual] wrote ${path.relative(ROOT, OUT)}`,
);
