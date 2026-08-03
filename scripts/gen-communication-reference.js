#!/usr/bin/env node
/*
 * Builds GC-COMMUNICATION-SYSTEM.html from the typed event communication
 * registry. The HTML is a review artefact; content/event-communications.ts
 * remains the source of truth.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "GC-COMMUNICATION-SYSTEM.html");

function loadTypeScript(relativePath, resolveImport) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const moduleRecord = { exports: {} };
  vm.runInNewContext(javascript, {
    module: moduleRecord,
    exports: moduleRecord.exports,
    require: resolveImport,
    Set,
    Error,
    Object,
  });
  return moduleRecord.exports;
}

const events = loadTypeScript("lib/events.ts", () => ({}));
const communications = loadTypeScript(
  "content/event-communications.ts",
  (request) => request === "../lib/events" ? events : {},
);

const data = communications.EVENT_COMMUNICATIONS;
const dataJson = JSON.stringify(data).replace(/</g, "\\u003c");

const template = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · Communication System</title>
<link rel="stylesheet" href="dist/tokens.css">
<style>
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
html{background:var(--gc-void);scroll-behavior:smooth}
body{min-height:100vh;background:var(--gc-void);color:var(--gc-ink-inverse);font:400 15px/1.55 var(--gc-f-body);-webkit-font-smoothing:antialiased}
button,input,select{font:inherit}
button,a{cursor:pointer}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--gc-electric);outline-offset:2px}
.mono{font-family:var(--gc-f-mono);font-variant-numeric:tabular-nums}
.micro{font:400 11px/1.3 var(--gc-f-mono);letter-spacing:.13em;text-transform:uppercase}
.dim{color:var(--gc-steel-dim)}
.topbar{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:minmax(250px,1fr) auto minmax(180px,1fr);align-items:stretch;min-height:76px;background:var(--gc-void);border-bottom:1px solid var(--gc-hairline-inv)}
.brand{display:flex;align-items:center;gap:14px;padding:0 28px;border-right:1px solid var(--gc-hairline-inv)}
.brand-mark{width:30px;height:30px;border:1px solid var(--gc-copper);display:grid;place-items:center;font:600 10px/1 var(--gc-f-mono);color:var(--gc-copper)}
.brand strong{display:block;font:600 15px/1 var(--gc-f-display);letter-spacing:-.01em}
.brand span{display:block;margin-top:5px;color:var(--gc-steel-dim)}
.tabs{display:flex;align-items:stretch;overflow:auto}
.tab{min-width:max-content;padding:0 18px;border:0;border-right:1px solid var(--gc-hairline-inv);background:transparent;color:var(--gc-steel-dim);font:500 11px/1 var(--gc-f-mono);letter-spacing:.09em;text-transform:uppercase}
.tab[aria-selected="true"]{background:var(--gc-paper);color:var(--gc-ink);box-shadow:inset 0 -3px 0 var(--gc-copper-deep)}
.status{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:0 28px;color:var(--gc-steel-dim)}
.status i{width:8px;height:8px;background:var(--gc-confirm);display:block}
.view{display:none}.view.active{display:block}
.wrap{width:min(1440px,100%);margin:0 auto;padding:72px 40px 104px}
.hero{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(320px,.55fr);gap:56px;align-items:end;padding-bottom:64px;border-bottom:1px solid var(--gc-hairline-inv)}
.eyebrow{color:var(--gc-copper);margin-bottom:18px}
h1{max-width:900px;font:600 clamp(44px,7vw,92px)/.9 var(--gc-f-display);letter-spacing:-.055em;text-wrap:balance}
.lede{max-width:720px;margin-top:28px;color:var(--gc-steel-dim);font-size:18px;line-height:1.6}
.coverage{border-top:1px solid var(--gc-hairline-inv)}
.metric{display:grid;grid-template-columns:92px 1fr;gap:18px;padding:18px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.metric strong{font:500 30px/1 var(--gc-f-mono);color:var(--gc-copper)}
.metric span{align-self:center;color:var(--gc-steel-dim)}
.section{padding:72px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.section-head{display:grid;grid-template-columns:180px minmax(0,1fr);gap:32px;margin-bottom:38px}
.section-head h2{font:600 clamp(30px,4vw,54px)/1 var(--gc-f-display);letter-spacing:-.04em}
.section-head p{max-width:680px;margin-top:14px;color:var(--gc-steel-dim);font-size:16px}
.rules{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.rule{min-height:230px;padding:26px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.rule .num{color:var(--gc-copper);margin-bottom:50px}
.rule h3{font:600 20px/1.15 var(--gc-f-display);margin-bottom:12px}
.rule p{color:var(--gc-steel-dim);font-size:13px}
.flow{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--gc-hairline-inv)}
.flow-step{position:relative;padding:26px;min-height:148px;border-right:1px solid var(--gc-hairline-inv)}
.flow-step:last-child{border-right:0}
.flow-step .micro{color:var(--gc-copper)}
.flow-step strong{display:block;margin:18px 0 7px;font:600 17px/1.2 var(--gc-f-display)}
.flow-step p{color:var(--gc-steel-dim);font-size:13px}
.surface-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.surface-card{min-height:180px;padding:22px;background:var(--gc-void-panel);border:1px solid var(--gc-hairline-inv)}
.surface-card .signal{width:34px;height:3px;margin-bottom:38px;background:var(--gc-steel-dim)}
.surface-card:nth-child(2) .signal{background:var(--gc-electric)}
.surface-card:nth-child(3) .signal{background:var(--gc-hazard)}
.surface-card:nth-child(4) .signal{background:var(--gc-critical)}
.surface-card h3{font:600 18px/1.2 var(--gc-f-display)}
.surface-card p{margin-top:10px;color:var(--gc-steel-dim);font-size:13px}
.catalogue{display:grid;grid-template-columns:340px minmax(0,1fr);min-height:720px;border:1px solid var(--gc-hairline-inv)}
.catalogue-side{border-right:1px solid var(--gc-hairline-inv);background:var(--gc-void-panel)}
.side-head{padding:20px;border-bottom:1px solid var(--gc-hairline-inv)}
.search{width:100%;margin-top:12px;padding:11px 12px;background:var(--gc-void);border:1px solid var(--gc-hairline-inv);color:var(--gc-ink-inverse)}
.event-list{max-height:656px;overflow:auto}
.event-button{display:grid;grid-template-columns:58px 1fr;width:100%;padding:15px 18px;border:0;border-bottom:1px solid var(--gc-hairline-inv);background:transparent;color:var(--gc-ink-inverse);text-align:left}
.event-button:hover{background:color-mix(in srgb,var(--gc-paper) 5%,transparent)}
.event-button.active{background:var(--gc-paper);color:var(--gc-ink)}
.event-button .event-id{font:400 10px/1.4 var(--gc-f-mono);color:var(--gc-copper)}
.event-button.active .event-id{color:var(--gc-copper-deep)}
.event-button strong{display:block;font:500 13px/1.2 var(--gc-f-body);overflow-wrap:anywhere}
.event-button small{display:block;margin-top:5px;color:var(--gc-steel-dim);font-size:11px}
.catalogue-main{padding:38px;min-width:0}
.detail-head{display:flex;justify-content:space-between;gap:24px;padding-bottom:26px;border-bottom:1px solid var(--gc-hairline-inv)}
.detail-head h2{margin-top:7px;font:600 clamp(28px,4vw,48px)/1 var(--gc-f-display);letter-spacing:-.035em;overflow-wrap:anywhere}
.pills{display:flex;align-items:flex-start;justify-content:flex-end;gap:7px;flex-wrap:wrap}
.pill{padding:6px 8px;border:1px solid var(--gc-hairline-inv);font:400 10px/1 var(--gc-f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--gc-steel-dim)}
.pill.success{border-color:var(--gc-confirm);color:var(--gc-confirm)}
.pill.warning{border-color:var(--gc-hazard);color:var(--gc-hazard)}
.pill.critical{border-color:var(--gc-critical);color:var(--gc-critical)}
.preview-label{display:flex;justify-content:space-between;gap:20px;margin:30px 0 12px}
.notice-preview{position:relative;padding:24px;background:var(--gc-void-panel);border:1px solid var(--gc-hairline-inv);border-left:4px solid var(--gc-electric)}
.notice-preview.success{border-left-color:var(--gc-confirm)}
.notice-preview.warning{border-left-color:var(--gc-hazard)}
.notice-preview.critical{border-left-color:var(--gc-critical)}
.notice-preview.toast{max-width:520px;margin-left:auto}
.notice-preview.banner{width:100%}
.notice-preview h3{font:600 22px/1.2 var(--gc-f-display)}
.notice-preview p{max-width:680px;margin-top:10px;color:var(--gc-steel-dim)}
.notice-actions{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid var(--gc-hairline-inv)}
.btn{padding:10px 15px;border:1px solid var(--gc-hairline-inv);background:transparent;color:inherit;font:500 11px/1 var(--gc-f-mono);letter-spacing:.04em;text-transform:uppercase}
.btn.primary{background:var(--gc-paper);color:var(--gc-ink);border-color:var(--gc-paper)}
.btn:disabled{opacity:.42;cursor:not-allowed}
.completion{display:grid;grid-template-columns:150px 1fr;gap:20px;margin-top:12px;padding:18px 20px;background:color-mix(in srgb,var(--gc-confirm) 12%,transparent);border-left:4px solid var(--gc-confirm)}
.completion strong{font:500 11px/1.3 var(--gc-f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--gc-confirm)}
.facts{display:grid;grid-template-columns:repeat(3,1fr);margin-top:30px;border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.fact{padding:18px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.fact span{display:block;color:var(--gc-steel-dim)}
.fact strong{display:block;margin-top:9px;font:500 13px/1.45 var(--gc-f-mono)}
.pattern-grid{display:grid;grid-template-columns:repeat(4,1fr);margin-bottom:32px;border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.pattern-card{min-height:180px;padding:22px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.pattern-card strong{display:block;margin:34px 0 10px;font:600 17px/1.15 var(--gc-f-display)}
.pattern-card p{color:var(--gc-steel-dim);font-size:12px}
.dialog-spec{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.55fr);gap:30px;margin-top:30px}
.dialog-window{background:var(--gc-paper);color:var(--gc-ink);border-top:5px solid var(--gc-copper-deep);min-height:390px;padding:30px}
.dialog-window.none{background:var(--gc-void-panel);color:var(--gc-ink-inverse);border:1px dashed var(--gc-hairline-inv)}
.dialog-window h3{font:600 30px/1.05 var(--gc-f-display);letter-spacing:-.025em}
.dialog-window p{margin-top:18px;max-width:600px;color:var(--gc-steel)}
.dialog-window.none p{color:var(--gc-steel-dim)}
.dialog-foot{display:flex;justify-content:flex-end;gap:10px;margin-top:34px;padding-top:20px;border-top:1px solid var(--gc-hairline)}
.dialog-window.none .dialog-foot{border-color:var(--gc-hairline-inv)}
.on-paper-btn{padding:11px 15px;background:transparent;border:1px solid var(--gc-hairline);color:var(--gc-ink);font:500 11px/1 var(--gc-f-mono);text-transform:uppercase}
.on-paper-btn.primary{background:var(--gc-ink);color:var(--gc-ink-inverse)}
.dialog-notes{border-top:1px solid var(--gc-hairline-inv)}
.note-row{padding:18px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.note-row strong{display:block;margin-top:8px;font-weight:500}
.email-stage{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:34px;margin-top:30px}
.email-frame{max-width:680px;margin:auto;background:var(--gc-paper);color:var(--gc-ink);box-shadow:0 18px 80px color-mix(in srgb,var(--gc-void) 65%,transparent)}
.email-mast{display:flex;justify-content:space-between;align-items:center;padding:24px 30px;background:var(--gc-ink);color:var(--gc-ink-inverse)}
.email-mast strong{font:600 15px/1 var(--gc-f-display)}
.email-mast span{color:var(--gc-copper)}
.email-body{padding:48px 46px}
.email-body .email-kicker{color:var(--gc-copper-deep)}
.email-body h3{margin-top:24px;font:600 clamp(30px,4vw,48px)/1 var(--gc-f-display);letter-spacing:-.04em}
.email-body p{margin-top:20px;color:var(--gc-steel);font-size:15px;line-height:1.7}
.email-cta{display:inline-block;margin-top:30px;padding:13px 18px;background:var(--gc-ink);color:var(--gc-ink-inverse);text-decoration:none;font:500 11px/1 var(--gc-f-mono);letter-spacing:.05em;text-transform:uppercase}
.email-rule{margin-top:42px;padding-top:18px;border-top:1px solid var(--gc-hairline);color:var(--gc-steel);font-size:11px}
.email-foot{padding:24px 30px;background:var(--gc-mist);color:var(--gc-steel);font-size:11px}
.email-meta{border-top:1px solid var(--gc-hairline-inv)}
.subject-card{padding:18px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.subject-card strong{display:block;margin-top:8px;font-weight:500}
.matrix-tools{display:grid;grid-template-columns:1fr 220px;gap:12px;margin-bottom:18px}
.select{width:100%;padding:11px 12px;background:var(--gc-void-panel);color:var(--gc-ink-inverse);border:1px solid var(--gc-hairline-inv)}
.table-wrap{overflow:auto;border:1px solid var(--gc-hairline-inv)}
table{width:100%;min-width:1280px;border-collapse:collapse}
th{position:sticky;top:76px;z-index:2;padding:13px 14px;background:var(--gc-paper);color:var(--gc-ink);text-align:left;font:500 10px/1.2 var(--gc-f-mono);letter-spacing:.08em;text-transform:uppercase}
td{padding:14px;border-top:1px solid var(--gc-hairline-inv);vertical-align:top;font-size:12px}
td.event-cell{font-family:var(--gc-f-mono);overflow-wrap:anywhere}
td:last-child{min-width:280px;color:var(--gc-steel-dim)}
.matrix-count{align-self:center;text-align:right;color:var(--gc-steel-dim)}
.empty{padding:40px;color:var(--gc-steel-dim)}
.modal-back{position:fixed;inset:0;z-index:100;display:none;place-items:center;padding:24px;background:color-mix(in srgb,var(--gc-void) 78%,transparent)}
.modal-back.open{display:grid}
.modal{width:min(720px,100%);max-height:90vh;overflow:auto;background:var(--gc-paper);color:var(--gc-ink);border-top:5px solid var(--gc-copper-deep)}
.modal-head{display:flex;justify-content:space-between;gap:24px;padding:26px 30px;border-bottom:1px solid var(--gc-hairline)}
.modal-head h2{margin-top:7px;font:600 30px/1 var(--gc-f-display)}
.modal-content{padding:30px}.modal-content p{color:var(--gc-steel);margin-top:14px}
.modal-content .completion{color:var(--gc-ink)}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;padding:22px 30px;border-top:1px solid var(--gc-hairline)}
.footer{display:flex;justify-content:space-between;gap:30px;padding:34px 40px;border-top:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim)}
@media(max-width:1100px){.topbar{grid-template-columns:1fr}.brand,.status{display:none}.hero,.catalogue,.email-stage,.dialog-spec{grid-template-columns:1fr}.catalogue-side{border-right:0;border-bottom:1px solid var(--gc-hairline-inv)}.event-list{max-height:310px}.rules,.pattern-grid,.surface-grid{grid-template-columns:repeat(2,1fr)}.flow{grid-template-columns:repeat(2,1fr)}.flow-step:nth-child(2){border-right:0}.flow-step:nth-child(-n+2){border-bottom:1px solid var(--gc-hairline-inv)}}
@media(max-width:700px){.wrap{padding:48px 18px 72px}.hero{gap:34px}.section-head{grid-template-columns:1fr}.rules,.pattern-grid,.surface-grid,.flow,.facts{grid-template-columns:1fr}.flow-step{border-right:0;border-bottom:1px solid var(--gc-hairline-inv)}.catalogue-main{padding:22px}.detail-head{display:block}.pills{justify-content:flex-start;margin-top:16px}.completion{grid-template-columns:1fr}.email-body{padding:36px 24px}.matrix-tools{grid-template-columns:1fr}.matrix-count{text-align:left}.footer{display:block;padding:30px 18px}.footer span{display:block;margin-top:8px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand"><span class="brand-mark">GC</span><div><strong>Communication System</strong><span class="micro">Event-complete reference</span></div></div>
  <nav class="tabs" role="tablist" aria-label="Communication system sections">
    <button class="tab" role="tab" aria-selected="true" data-tab="system">System</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="notifications">Notifications</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="popups">Pop-ups</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="emails">Emails</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="matrix">Event matrix</button>
  </nav>
  <div class="status micro"><i></i><span>55 / 55 mapped</span></div>
</header>

<main>
<div class="view active" data-view="system"><div class="wrap">
  <section class="hero">
    <div><p class="eyebrow micro">GC.SYSTEM · Governed communications</p><h1>Every event knows what to say next.</h1><p class="lede">One communication contract connects each recorded event to an in-product notice, a deliberate interruption rule, a complete email, and an unambiguous completion receipt.</p></div>
    <div class="coverage" aria-label="Coverage summary">
      <div class="metric"><strong>55</strong><span>domain events mapped exactly once</span></div>
      <div class="metric"><strong>4</strong><span>in-product notification surfaces</span></div>
      <div class="metric"><strong>7+1</strong><span>controlled pop-up patterns, including no interruption</span></div>
      <div class="metric"><strong>0</strong><span>events without a designed email contract</span></div>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><span class="micro dim">01 · Operating rule</span><div><h2>One fact. Four expressions.</h2><p>The event remains the permanent fact. Product, pop-up, email, and completion copy are projections of that fact, never parallel records.</p></div></div>
    <div class="flow">
      <div class="flow-step"><span class="micro">Command</span><strong>Intent is reviewed</strong><p>Authority, evidence, scope, money, and consequence are shown before the act.</p></div>
      <div class="flow-step"><span class="micro">Interruption</span><strong>Friction is earned</strong><p>Only risk, irreversibility, missing evidence, or required acknowledgement opens a pop-up.</p></div>
      <div class="flow-step"><span class="micro">Event</span><strong>The fact is recorded</strong><p>Past tense, attributable, timestamped, and linked to the causing command.</p></div>
      <div class="flow-step"><span class="micro">Delivery</span><strong>The right audience knows</strong><p>The notice persists, emails, or enters a digest according to consequence.</p></div>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><span class="micro dim">02 · Channel law</span><div><h2>What each channel is allowed to do.</h2><p>Channel choice follows consequence and actionability. It is not a stylistic decision made independently on each page.</p></div></div>
    <div class="rules">
      <article class="rule"><div class="num micro">NT-01</div><h3>Toast</h3><p>Confirms the actor’s reversible or routine action. It can dismiss because the permanent record lives elsewhere.</p></article>
      <article class="rule"><div class="num micro">NT-02</div><h3>Banner</h3><p>Explains a temporary page-wide condition with a clear path forward. It never conceals content.</p></article>
      <article class="rule"><div class="num micro">NT-03</div><h3>Alert centre</h3><p>Holds durable updates, decisions, documents, and completed state changes until read.</p></article>
      <article class="rule"><div class="num micro">NT-04</div><h3>Critical alert</h3><p>Persists for money due, lapsed eligibility, blocked capital, authority loss, breach, or constitutional failure.</p></article>
    </div>
  </section>
  <section class="section">
    <div class="section-head"><span class="micro dim">03 · Surface anatomy</span><div><h2>Urgency is structure, not colour alone.</h2><p>Every state combines a named tone, visible edge, durable label, direct copy, and a single next action.</p></div></div>
    <div class="surface-grid">
      <article class="surface-card"><div class="signal"></div><span class="micro dim">Info</span><h3>Position changed</h3><p>Neutral facts, reports, valuations, and lifecycle progress.</p></article>
      <article class="surface-card"><div class="signal"></div><span class="micro dim">Success</span><h3>Completion recorded</h3><p>Receipts, settled positions, opened ownership, and passed gates.</p></article>
      <article class="surface-card"><div class="signal"></div><span class="micro dim">Warning</span><h3>Attention required</h3><p>Deadlines, withdrawals, changed authority, conflicts, and held actions.</p></article>
      <article class="surface-card"><div class="signal"></div><span class="micro dim">Critical</span><h3>Protection active</h3><p>Breach, dissolution, constitutional failure, and capital actions that cannot proceed.</p></article>
    </div>
  </section>
</div></div>

<div class="view" data-view="notifications"><div class="wrap">
  <div class="section-head"><span class="micro dim">Notifications · 55 contracts</span><div><h2>In-product notice catalogue</h2><p>Select any event to inspect its exact surface, recipients, persistence, call to action, and explicit completion state.</p></div></div>
  <section class="catalogue"><aside class="catalogue-side"><div class="side-head"><label class="micro dim" for="notice-search">Find an event</label><input class="search" id="notice-search" type="search" placeholder="Search event or domain"></div><div class="event-list" id="notice-list"></div></aside><div class="catalogue-main" id="notice-detail"></div></section>
</div></div>

<div class="view" data-view="popups"><div class="wrap">
  <div class="section-head"><span class="micro dim">Pop-ups · controlled friction</span><div><h2>Interrupt only when the act earns it.</h2><p>The registry maps every event to a pre-action pattern or to “none”. Completed events never ask for confirmation after the fact.</p></div></div>
  <div class="pattern-grid">
    <article class="pattern-card"><span class="micro dim">P-01</span><strong>Review + confirm</strong><p>Final summary for a consequential but reversible governed act.</p></article>
    <article class="pattern-card"><span class="micro dim">P-02</span><strong>Evidence gate</strong><p>Submit remains unavailable until required authority and evidence are present.</p></article>
    <article class="pattern-card"><span class="micro dim">P-03</span><strong>Piston</strong><p>Three-second sustained press for capital-moving or legal completion.</p></article>
    <article class="pattern-card"><span class="micro dim">P-04</span><strong>Secret ballot</strong><p>Shows weight, choice, threshold, and sealing before an irreversible cast.</p></article>
    <article class="pattern-card"><span class="micro dim">P-05</span><strong>Typed confirmation</strong><p>Exact object identity and a reason are required for terminal or rights-changing acts.</p></article>
    <article class="pattern-card"><span class="micro dim">P-06</span><strong>Acknowledgement</strong><p>Records that an accountable office has seen and contained an exception.</p></article>
    <article class="pattern-card"><span class="micro dim">P-07</span><strong>Session warning</strong><p>Warns before inactivity closure and makes extension explicit.</p></article>
    <article class="pattern-card"><span class="micro dim">Ø</span><strong>No interruption</strong><p>Routine completion, timed outcomes, and normal access continue without redundant friction.</p></article>
  </div>
  <section class="catalogue"><aside class="catalogue-side"><div class="side-head"><label class="micro dim" for="popup-search">Find an event</label><input class="search" id="popup-search" type="search" placeholder="Search event or pattern"></div><div class="event-list" id="popup-list"></div></aside><div class="catalogue-main" id="popup-detail"></div></section>
</div></div>

<div class="view" data-view="emails"><div class="wrap">
  <div class="section-head"><span class="micro dim">Email · 55 contracts</span><div><h2>One shell, event-specific substance.</h2><p>Every event has a complete subject, preheader, heading, body, action, and delivery policy. Routine operations enter a digest; urgent positions leave immediately.</p></div></div>
  <section class="catalogue"><aside class="catalogue-side"><div class="side-head"><label class="micro dim" for="email-search">Find an email</label><input class="search" id="email-search" type="search" placeholder="Search subject, event, or policy"></div><div class="event-list" id="email-list"></div></aside><div class="catalogue-main" id="email-detail"></div></section>
</div></div>

<div class="view" data-view="matrix"><div class="wrap">
  <div class="section-head"><span class="micro dim">Assurance · Complete map</span><div><h2>Every event, channel, and completion state.</h2><p>This matrix is the implementation hand-off: one row per domain event, with no implied or unassigned communication behaviour.</p></div></div>
  <div class="matrix-tools"><input class="search" id="matrix-search" type="search" placeholder="Search any field"><select class="select" id="matrix-domain" aria-label="Filter by domain"><option value="all">All domains</option></select><span class="matrix-count micro" id="matrix-count"></span></div>
  <div class="table-wrap"><table><thead><tr><th>ID</th><th>Event</th><th>Domain</th><th>Recipients</th><th>Product</th><th>Pop-up</th><th>Email</th><th>Tone</th><th>Completion</th></tr></thead><tbody id="matrix-body"></tbody></table></div>
</div></div>
</main>

<div class="modal-back" id="modal-back" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><div class="modal-head"><div><span class="micro dim" id="modal-kicker"></span><h2 id="modal-title"></h2></div><button class="on-paper-btn" id="modal-close">Close</button></div><div class="modal-content" id="modal-content"></div><div class="modal-actions"><button class="on-paper-btn" id="modal-cancel">Cancel</button><button class="on-paper-btn primary" id="modal-confirm">Confirm</button></div></div></div>

<footer class="footer"><strong>GETAWAY COLLECTIVE</strong><span class="micro">Communication System · generated from the 55-event registry</span><span>Reference specimen only · no message is sent from this file</span></footer>

<script>
const DATA=__COMMUNICATION_DATA__;
let selectedEvent=DATA[0].event;
const byEvent=(event)=>DATA.find((item)=>item.event===event)||DATA[0];
const esc=(value)=>String(value).replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
const human=(value)=>String(value).replace(/-/g," ").replace(/\b\w/g,(char)=>char.toUpperCase());

function activateTab(name){
  document.querySelectorAll(".tab").forEach((button)=>button.setAttribute("aria-selected",String(button.dataset.tab===name)));
  document.querySelectorAll(".view").forEach((view)=>view.classList.toggle("active",view.dataset.view===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".tab").forEach((button)=>button.addEventListener("click",()=>activateTab(button.dataset.tab)));

function eventButton(item,kind){
  const sub=kind==="email"?human(item.email.policy):kind==="popup"?human(item.interruption.pattern):item.domain+" · "+human(item.product.surface);
  return '<button class="event-button '+(item.event===selectedEvent?'active':'')+'" data-event="'+esc(item.event)+'" data-kind="'+kind+'"><span class="event-id">'+esc(item.id)+'</span><span><strong>'+esc(item.event)+'</strong><small>'+esc(sub)+'</small></span></button>';
}
function filterData(query,kind){
  const q=query.trim().toLowerCase();
  if(!q)return DATA;
  return DATA.filter((item)=>{
    const extra=kind==="email"?Object.values(item.email).join(" "):kind==="popup"?Object.values(item.interruption).join(" "):Object.values(item.product).join(" ");
    return (item.event+" "+item.domain+" "+item.recipients.join(" ")+" "+extra).toLowerCase().includes(q);
  });
}
function bindList(listId,searchId,kind,render){
  const list=document.getElementById(listId),search=document.getElementById(searchId);
  const paint=()=>{
    const rows=filterData(search.value,kind);
    list.innerHTML=rows.length?rows.map((item)=>eventButton(item,kind)).join(""):'<p class="empty">No matching event.</p>';
    list.querySelectorAll("button").forEach((button)=>button.addEventListener("click",()=>{selectedEvent=button.dataset.event; paintAll();}));
  };
  search.addEventListener("input",paint);
  paint();render();
  return paint;
}

function detailHead(item,label){return '<div class="detail-head"><div><span class="micro dim">'+esc(item.id)+' · '+esc(label)+'</span><h2>'+esc(item.event)+'</h2></div><div class="pills"><span class="pill '+esc(item.tone)+'">'+esc(item.tone)+'</span><span class="pill">'+esc(item.domain)+'</span></div></div>';}
function renderNotice(){
  const item=byEvent(selectedEvent),p=item.product;
  document.getElementById("notice-detail").innerHTML=detailHead(item,"In-product")+
    '<div class="preview-label"><span class="micro dim">Rendered '+esc(human(p.surface))+'</span><span class="micro dim">'+(p.persistent?'Persists until read':'Dismisses after confirmation')+'</span></div>'+
    '<article class="notice-preview '+esc(item.tone)+' '+esc(p.surface)+'"><span class="micro dim">'+esc(item.domain)+' · '+esc(item.event)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.body)+'</p><div class="notice-actions"><span class="micro dim">'+esc(item.recipients.join(" · "))+'</span><button class="btn primary">'+esc(p.cta)+'</button></div></article>'+
    '<div class="completion"><strong>Completion state</strong><span>'+esc(item.completion)+'</span></div>'+
    '<div class="facts"><div class="fact"><span class="micro">Surface</span><strong>'+esc(human(p.surface))+'</strong></div><div class="fact"><span class="micro">Persistence</span><strong>'+(p.persistent?'Durable':'Transient')+'</strong></div><div class="fact"><span class="micro">Email</span><strong>'+esc(human(item.email.policy))+'</strong></div></div>';
}
function renderPopup(){
  const item=byEvent(selectedEvent),x=item.interruption,isNone=x.pattern==="none";
  document.getElementById("popup-detail").innerHTML=detailHead(item,"Pre-action interruption")+
    '<div class="dialog-spec"><div class="dialog-window '+(isNone?'none':'')+'"><span class="micro dim">'+esc(isNone?'No pop-up by design':human(x.pattern))+'</span><h3>'+esc(isNone?'Continue without interruption':item.product.title.replace(/ed$/,""))+'</h3><p>'+esc(x.trigger)+'. '+esc(x.reason)+'</p><div class="dialog-foot">'+(isNone?'<button class="btn" disabled>No interruption</button>':'<button class="on-paper-btn">Cancel</button><button class="on-paper-btn primary" id="open-specimen">Open specimen</button>')+'</div></div><aside class="dialog-notes"><div class="note-row"><span class="micro dim">Pattern</span><strong>'+esc(human(x.pattern))+'</strong></div><div class="note-row"><span class="micro dim">Trigger</span><strong>'+esc(x.trigger)+'</strong></div><div class="note-row"><span class="micro dim">Why</span><strong>'+esc(x.reason)+'</strong></div><div class="note-row"><span class="micro dim">After success</span><strong>'+esc(item.completion)+'</strong></div></aside></div>';
  const open=document.getElementById("open-specimen");if(open)open.addEventListener("click",()=>openModal(item));
}
function renderEmail(){
  const item=byEvent(selectedEvent),e=item.email;
  document.getElementById("email-detail").innerHTML=detailHead(item,"Email contract")+
    '<div class="email-stage"><article class="email-frame"><header class="email-mast"><strong>GETAWAY COLLECTIVE</strong><span class="micro">'+esc(item.domain)+'</span></header><div class="email-body"><span class="email-kicker micro">'+esc(item.event)+' · '+esc(human(e.policy))+'</span><h3>'+esc(e.heading)+'</h3><p>'+esc(e.body)+'</p><a class="email-cta" href="#">'+esc(e.cta)+'</a><div class="email-rule">Permanent records, source evidence, and current authority remain in the governed workspace. This email is a notice, not the record itself.</div></div><footer class="email-foot">Getaway Collective · Governed communication · Preferences apply except where a required notice cannot be disabled.</footer></article><aside class="email-meta"><div class="subject-card"><span class="micro dim">Subject</span><strong>'+esc(e.subject)+'</strong></div><div class="subject-card"><span class="micro dim">Preheader</span><strong>'+esc(e.preheader)+'</strong></div><div class="subject-card"><span class="micro dim">Delivery</span><strong>'+esc(human(e.policy))+'</strong></div><div class="subject-card"><span class="micro dim">Recipients</span><strong>'+esc(item.recipients.join(" · "))+'</strong></div><div class="subject-card"><span class="micro dim">Product companion</span><strong>'+esc(human(item.product.surface))+' · '+(item.product.persistent?'durable':'transient')+'</strong></div></aside></div>';
}

function openModal(item){
  const x=item.interruption,back=document.getElementById("modal-back");
  document.getElementById("modal-kicker").textContent=human(x.pattern)+" · "+item.id;
  document.getElementById("modal-title").textContent=item.product.title;
  document.getElementById("modal-content").innerHTML='<p>'+esc(x.trigger)+'.</p><p>'+esc(x.reason)+'</p><div class="completion"><strong>On success</strong><span>'+esc(item.completion)+'</span></div>';
  document.getElementById("modal-confirm").textContent=x.pattern==="piston"?"Hold to confirm":x.pattern==="secret-ballot"?"Hold to cast":"Confirm";
  back.classList.add("open");back.querySelector(".modal").focus();
}
function closeModal(){document.getElementById("modal-back").classList.remove("open")}
document.getElementById("modal-close").addEventListener("click",closeModal);
document.getElementById("modal-cancel").addEventListener("click",closeModal);
document.getElementById("modal-confirm").addEventListener("click",closeModal);
document.getElementById("modal-back").addEventListener("click",(event)=>{if(event.target===event.currentTarget)closeModal()});
document.addEventListener("keydown",(event)=>{if(event.key==="Escape")closeModal()});

const domains=[...new Set(DATA.map((item)=>item.domain))];
const domainSelect=document.getElementById("matrix-domain");
domains.forEach((domain)=>{const option=document.createElement("option");option.value=domain;option.textContent=domain;domainSelect.appendChild(option)});
function renderMatrix(){
  const query=document.getElementById("matrix-search").value.trim().toLowerCase(),domain=domainSelect.value;
  const rows=DATA.filter((item)=>(domain==="all"||item.domain===domain)&&(!query||JSON.stringify(item).toLowerCase().includes(query)));
  document.getElementById("matrix-count").textContent=rows.length+" of "+DATA.length+" events";
  document.getElementById("matrix-body").innerHTML=rows.map((item)=>'<tr><td class="mono">'+esc(item.id)+'</td><td class="event-cell">'+esc(item.event)+'</td><td>'+esc(item.domain)+'</td><td>'+esc(item.recipients.join(" · "))+'</td><td>'+esc(human(item.product.surface))+(item.product.persistent?' · durable':' · transient')+'</td><td>'+esc(human(item.interruption.pattern))+'</td><td>'+esc(human(item.email.policy))+'</td><td><span class="pill '+esc(item.tone)+'">'+esc(item.tone)+'</span></td><td>'+esc(item.completion)+'</td></tr>').join("");
}
document.getElementById("matrix-search").addEventListener("input",renderMatrix);
domainSelect.addEventListener("change",renderMatrix);

let paintNotice,paintPopup,paintEmail;
function paintAll(){paintNotice();paintPopup();paintEmail();renderNotice();renderPopup();renderEmail();}
paintNotice=bindList("notice-list","notice-search","notice",renderNotice);
paintPopup=bindList("popup-list","popup-search","popup",renderPopup);
paintEmail=bindList("email-list","email-search","email",renderEmail);
renderMatrix();
</script>
</body>
</html>`;

const html = template.replace("__COMMUNICATION_DATA__", dataJson);
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (inlineScripts.length !== 1) {
  throw new Error(`Expected one inline script, found ${inlineScripts.length}`);
}
// Compile without executing: malformed interactions must fail generation.
new Function(inlineScripts[0][1]);
const check = process.argv.includes("--check");
if (check) {
  /* Normalise \r\n before comparing, exactly as gen-assembly-css.js does.
     With core.autocrlf=true — the Windows default — git checks this file
     out with CRLF while the generator emits LF, so a raw string compare
     reports STALE on every Windows machine forever and `npm run verify`
     can never pass there. CI runs on Linux and never saw it.

     This is the same \r\n hazard the parsing scripts warn about in ten
     places, arriving from the other direction: there a stray \r makes a
     check silently pass, here it makes one permanently fail. Loud is the
     better failure of the two, but it is still wrong. */
  const current = fs.existsSync(OUT)
    ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n")
    : null;
  if (current !== html.replace(/\r\n/g, "\n")) {
    console.error("[communication-reference] STALE — run npm run communications");
    process.exit(1);
  }
  console.log(`[communication-reference] OK — ${data.length} event contracts in step`);
} else {
  fs.writeFileSync(OUT, html, "utf8");
  console.log(`[communication-reference] wrote ${path.basename(OUT)} — ${data.length} event contracts`);
}
