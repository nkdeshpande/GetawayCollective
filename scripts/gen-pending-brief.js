#!/usr/bin/env node
/**
 * PENDING ASSEMBLY BRIEF
 *
 * The assemblies that are registered and not built, with the design for
 * each one.
 *
 * Generated. The registry facts — sections, rules, corrections — are
 * parsed from constants/assemblies.ts so this document cannot drift from
 * it. The DESIGN block below is the only authored part, and it is keyed
 * by id so a missing entry fails loudly rather than rendering blank.
 */

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "constants", "assemblies.ts"), "utf8");
const built = fs.readFileSync(path.join(ROOT, "GC-ASSEMBLIES.html"), "utf8");

// ── Which are actually pending ───────────────────────────────────────
// A screen ships as an A["AS-nn"] entry; chrome and regions ship as
// helper functions. Counting only the former is what produced the wrong
// figure in the exit assessment, so both are checked here.
const HELPERS = { "AS-20": /class="hud"/, "AS-21": /function spine\(/,
                  "AS-22": /function footer\(/, "AS-23": /function hero\(/ };
const shipped = new Set([...built.matchAll(/A\["(AS-\d+)"\]\s*=/g)].map((m) => m[1]));
for (const [id, re] of Object.entries(HELPERS)) if (re.test(built)) shipped.add(id);

const join = (c) => [...c.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("");

function parse() {
  const out = [];
  for (const m of src.matchAll(/export const (\w+): Assembly = \{([\s\S]*?)\n\};/g)) {
    const b = m[2];
    const g = (k) => {
      const r = b.match(new RegExp(`\\b${k}:\\s*\\n?\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+)`));
      return r ? join(r[1]) : "";
    };
    const sections = [...b.matchAll(
      /S\(\s*"([^"]+)",\s*"([^"]+)",\s*"(\w+)",\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+),\s*\[([^\]]*)\]([\s\S]*?)(?=\n\s*(?:S\(|\],))/g,
    )].map((s) => {
      const tail = s[6];
      const k = tail.match(/rule:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)/);
      const ba = tail.match(/^\s*,\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+)\)/);
      return { ref: s[1], name: s[2], kind: s[3], purpose: join(s[4]),
               contains: [...s[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
               rule: k ? join(k[1]) : ba ? join(ba[1]) : "" };
    });
    const corrections = [...b.matchAll(/\{\s*\n\s*source:([\s\S]*?)kind:\s*"(\w+)",\s*\n\s*\}/g)]
      .map((c) => {
        const body = "source:" + c[1];
        const f = (k) => {
          const r = body.match(new RegExp(`\\b${k}:\\s*\\n?\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+)`));
          return r ? join(r[1]) : "";
        };
        return { source: f("source"), was: f("was"), now: f("now"), because: f("because"), kind: c[2] };
      });
    out.push({ id: g("id"), name: g("name"), scope: g("scope") || "screen",
               route: g("route"), vantage: g("vantage"), intent: g("intent"),
               answers: g("answers"), notes: g("notes"), sections, corrections });
  }
  return out;
}

// ── The authored half ────────────────────────────────────────────────
const DESIGN = {
  "AS-14": {
    rank: 1, blocks: "AS-06 Commitment Flow",
    why: "It is the gate before commitment, and commitment is already built. Right now someone can " +
         "reach the piston without ever having been shown how this loses money.",
    ground: "Paper throughout — every sentence on the screen is an assertion, so the ground never leaves it.",
    shape:
      "A single reading column at 65ch on paper, capped at 720px. The statement runs top to bottom in " +
      "severity order with no accordion and no tabs: a risk behind a click is a risk somebody skipped. " +
      "Each clause takes a left rule in hazard-deep and a heading in display-m. The acknowledgement " +
      "sits in a bar fixed to the bottom of the viewport, visible from the first scroll, disabled with " +
      "its reason stated in words rather than implied by opacity.",
    behaviour:
      "The gate opens when the end of the statement has been reached by ANY means — scroll, keyboard, " +
      "or a Skip to acknowledgement control that jumps there and is itself a legitimate route. The " +
      "acknowledgement records the disclosure VERSION alongside the timestamp and the identity.",
    dataNeeded: "Risk register entries (AS-28) for the vehicle · disclosure document version · " +
      "commercial terms read from the vehicle record, never typed into prose.",
    open: "Does an acknowledgement of v2.4 survive a v3.0 amendment, or does the platform re-gate " +
      "everyone mid-offering? The registry says record the version; it does not yet say what to do " +
      "when the version moves.",
  },
  "AS-26": {
    rank: 2, blocks: "nothing — but nothing reaches members without it",
    why: "The single most consequential message the platform sends. A declared lifecycle with no surface.",
    ground: "Void for the explanation, paper for the amount and its derivation.",
    shape:
      "Two-column on desktop, stacked on phone with the amount first. Left: the call — amount in " +
      "display-xl copper, due date in display-m beside it at equal weight, and the consequence in the " +
      "same block rather than below the fold. Right: the derivation table on paper, showing commitment, " +
      "drawn to date, this call, and remaining, each line reconstructible by hand.",
    behaviour:
      "Default provisions render in full ABOVE the payment control, never after it. The payment control " +
      "is the piston at 3000ms, because this moves capital. A call that has been met shows the " +
      "settlement record in place, not a redirect.",
    dataNeeded: "Commitment · drawn-to-date ledger · call schedule · default provisions from the LLP " +
      "Agreement · the vehicle's bank instruction.",
    open: "Partial payment. The registry describes a call as met or unmet, and real calls get met " +
      "partially. That is a lifecycle question before it is a design one.",
  },
  "AS-27": {
    rank: 3, blocks: "nothing built — but governance rights are currently unexercisable",
    why: "Governance is the substance of the Member Law. The system can display results (AS-13) and " +
         "nobody can produce one.",
    ground: "Void. A ballot persuades nobody and asserts nothing; it asks.",
    shape:
      "Single column, narrow. The resolution text renders VERBATIM as it will be minuted, in body-l at " +
      "65ch — not a summary, because the minute records the text and a summary is a different document. " +
      "Below it: threshold, closing time as a countdown in mono, and the viewer's own weight with its " +
      "derivation. The three choices are radio inputs at equal visual weight, in a fixed order, with no " +
      "default selected.",
    behaviour:
      "Casting is a two-step: choose, then confirm in a dialog naming the resolution and the fact that " +
      "it cannot be changed. The confirmation afterwards says a vote was recorded and NEVER which — it " +
      "would otherwise sit in a screenshot, a cache and a support transcript. Once closed, the screen " +
      "becomes the outcome: aggregate for/against/abstain by weight, and a tie renders NOT APPROVED " +
      "with no deferral offered anywhere.",
    dataNeeded: "Resolution text · threshold · window · the viewer's contribution weight · " +
      "aggregate tallies after close. Never an individual ballot, at any vantage.",
    open: "Proxy and abstention weight. Does an abstention count toward quorum but not the threshold? " +
      "§24a sets the thresholds and is silent on how an abstention is treated in each.",
  },
  "AS-19": {
    rank: 4, blocks: "nothing — AS-06 currently ends at its own piston",
    why: "Completes the commitment chain. AS-06 fires and then the flow stops; this is what happens next.",
    ground: "Void, flipping to paper for the recorded ledger entry.",
    shape:
      "A narrow terminal, 480px, centred — the one place in the system where a constrained column is " +
      "right, because the whole screen is a single sequence. Telemetry header with the asset, then " +
      "stages that replace one another in place rather than scrolling.",
    behaviour:
      "Acknowledgements are real checkboxes with real labels, each a separate fact — bundling them into " +
      "one control makes the bundle the thing acknowledged. The piston is 3000ms linear. Confirmation is " +
      "the 120ms data flash, never a white flash. Focus moves to the new stage heading on each " +
      "transition, which the source never did.",
    dataNeeded: "Commitment record · the invariants list for this vehicle · reference generator.",
    open: "What happens on failure mid-sequence — a payment that neither succeeds nor fails inside the " +
      "window. The screen currently has no third state and real payment rails have one.",
  },
  "AS-28": {
    rank: 5, blocks: "AS-14 draws its content from here",
    why: "O-09 Risk Register Row exists as an organism with nowhere to appear, and Risk is a declared " +
         "root object.",
    ground: "Paper. A register is assertion end to end.",
    shape:
      "A dense sortable table, the second-densest surface after AS-11. Columns: category, likelihood, " +
      "impact, computed severity, owner, mitigation, last review, next review. Severity renders as a " +
      "figure AND a band, because a 4×4 matrix reduced to colour alone is unreadable to a large minority.",
    behaviour:
      "Severity is COMPUTED from likelihood × impact and cannot be typed — a hand-set severity drifts " +
      "from its own inputs the moment either changes. Rows past their review date render their " +
      "staleness in hazard; an unreviewed register is more dangerous than none because it looks like " +
      "oversight.",
    dataNeeded: "Risk entries · the ten risk categories from the enum registry · owner assignments · " +
      "review cadence.",
    open: "Who owns a risk that spans vehicles? The register is per-vehicle and climate and regulatory " +
      "risk are not.",
  },
  "AS-16": {
    rank: 6, blocks: "every route — a 404 is reachable from everywhere",
    why: "Cheapest to build, reachable from every route, and currently absent. Any wrong URL today " +
         "produces a framework default.",
    ground: "Void.",
    shape:
      "One screen, no scroll. Display-xl statement, the requested path in mono at body size, and three " +
      "routes out as real links. That is the whole design and it should stay that way.",
    behaviour:
      "Static. No parallax, no glitch, no noise overlay, no timer. Nothing redirects on its own — WCAG " +
      "2.2.1, and someone reading the routes out should not have the page pulled away mid-sentence.",
    dataNeeded: "The requested path, escaped. Nothing else.",
    open: "None. This one is fully specified.",
  },
  "AS-17": {
    rank: 7, blocks: "nothing",
    why: "It is where the fourth drifted copy of the waterfall lived. Building it correctly removes a " +
         "standing source of contradiction.",
    ground: "Paper for answers that cite a document; void for the search surface.",
    shape:
      "Search at the top with a real label, then grouped questions. Each answer carries the clause it " +
      "is based on as a link, not a decoration — an uncited answer on a regulated platform is a claim " +
      "with nothing behind it.",
    behaviour:
      "Accordions are real buttons with aria-expanded and no height cap. Filtering announces its result " +
      "count in a live region: a list that silently empties reads as a broken page.",
    dataNeeded: "Question set · the governing clause reference per answer · the canonical waterfall, " +
      "cited rather than restated.",
    open: "Who owns the answers? A FAQ on a regulated platform is a published statement and needs a " +
      "review owner and a review cadence, which nothing currently declares.",
  },
  "AS-15": {
    rank: 8, blocks: "nothing",
    why: "Low risk, low effort, and it answers the one question support cannot answer at scale.",
    ground: "Void.",
    shape:
      "A headline word — operational, degraded, or down — at display-xl, then a component list, then " +
      "incidents. The headline is a word and not a dashboard, because someone arriving has a yes/no " +
      "question.",
    behaviour:
      "A component nobody has heard from renders UNKNOWN, never healthy: silence is not health. Failure " +
      "states are static, in critical, with a text label — animating a failure makes the one word that " +
      "must be read the hardest to read. NO physical access control appears here at any point.",
    dataNeeded: "Component health checks with last-confirmed timestamps · incident log.",
    open: "What is in scope. The source listed door locks; the boundary between platform status and " +
      "operating-partner status has not been drawn.",
  },
  "AS-07": {
    rank: 9, blocks: "nothing",
    why: "Marketing narrative. Real work, no dependency, and nothing downstream waits on it.",
    ground: "Void throughout — it persuades and asserts nothing.",
    shape:
      "Hero (AS-23), then one section per operating brand: name, position, media, two paragraphs, and a " +
      "three-cell attribute grid in hairline. Attributes are descriptive; no figure enters that grid, " +
      "because a grid of figures is a comparison table and this is not one.",
    behaviour: "Scroll-reveal under prefers-reduced-motion. Scramble permitted on attribute LABELS only.",
    dataNeeded: "Brand copy, rewritten in the platform voice · imagery.",
    open: "Whose voice. These are the operating partner's brands described on the platform's surface, " +
      "and the boundary that AS-11 solved by translation has not been drawn for prose.",
  },
  "AS-18": {
    rank: 10, blocks: "nothing",
    why: "Standalone. The most valuable part is already recorded — the voice correction.",
    ground: "Void.",
    shape:
      "Two or three claims about the work, each falsifiable, then a role table: role, what it owns, " +
      "open or filled. A filled role stays fully legible, because someone reading it is deciding " +
      "whether to watch for the next one.",
    behaviour: "A real file input. A drop zone alone cannot be reached from a keyboard, and a CV is accepted.",
    dataNeeded: "Open roles · what each owns · application destination.",
    open: "None material.",
  },
  "AS-08": {
    rank: 11, blocks: "nothing",
    why: "Highest effort, lowest consequence, and the format is the most constrained in the system.",
    ground: "Void.",
    shape: "A tile grid that opens a full-screen sequential player. Gateway only.",
    behaviour:
      "A visible pause control, Escape to exit, arrow keys to advance, and auto-advance off entirely " +
      "under prefers-reduced-motion. NO FIGURE appears in the player at any point — a number on a card " +
      "that advances in four seconds cannot be read, checked, or returned to.",
    dataNeeded: "Sequenced media with captions.",
    open: "Whether it earns its place at all. AS-09 Gallery Frame already covers most of this ground " +
      "with far fewer constraints, and two cinematic formats at one vantage may be one too many.",
  },
};

// ── Build ────────────────────────────────────────────────────────────
const all = parse();
const pending = all.filter((a) => !shipped.has(a.id));

if (pending.length === 0) {
  console.error("[pending-brief] Parsed zero pending assemblies. Refusing to write an empty brief.");
  process.exit(2);
}
const missing = pending.filter((p) => !DESIGN[p.id]).map((p) => p.id);
if (missing.length) {
  console.error(`[pending-brief] No design authored for ${missing.join(", ")}. Refusing to render blanks.`);
  process.exit(2);
}
pending.sort((a, b) => DESIGN[a.id].rank - DESIGN[b.id].rank);

const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const code = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

const TONE = { constitutional: "#E8672E", accessibility: "#C9A227", numeric: "#4F8A6B",
               vocabulary: "#9A9A9A", interaction: "#7FA4EE" };
const byV = {};
for (const p of pending) (byV[p.vantage] ??= []).push(p.id);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · The ${pending.length} Pending Assemblies</title><style>
:root{--void:#0A0A0A;--panel:#121212;--panel2:#171717;--paper:#F2F2F2;--ink:#0A0A0A;
--inv:#F2F2F2;--dim:#9A9A9A;--steel:#6B6B6B;--copper:#C79F6B;--confirm:#1FAA59;
--hazard:#E8672E;--critical:#FF3B30;--blue:#7FA4EE;--hair:rgba(242,242,242,.10);
--fd:'Outfit','Segoe UI Variable Display',-apple-system,system-ui,sans-serif;
--fb:'Inter','Segoe UI Variable',-apple-system,system-ui,sans-serif;
--fm:'Space Mono',ui-monospace,Consolas,'SFMono-Regular',monospace}
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
body{background:var(--void);color:var(--inv);font:400 15px/1.6 var(--fb);-webkit-font-smoothing:antialiased}
.w{max-width:1180px;margin:0 auto;padding:0 24px 120px}
header{padding:72px 0 36px;border-bottom:1px solid var(--hair)}
.eb{font:400 11px/1 var(--fm);letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
h1{font:600 clamp(36px,5.6vw,58px)/1 var(--fd);letter-spacing:-.035em;margin:14px 0 0;text-wrap:balance}
.lede{margin-top:22px;max-width:74ch;font-size:17px;color:#D8D8D8}
.lede strong{color:var(--inv)}
.tally{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;
background:var(--hair);border:1px solid var(--hair);margin-top:34px}
.tally div{background:var(--panel);padding:18px}
.tally b{display:block;font:600 27px/1 var(--fm);font-variant-numeric:tabular-nums}
.tally span{display:block;font:400 10px/1.4 var(--fm);letter-spacing:.14em;
text-transform:uppercase;color:var(--dim);margin-top:6px}
.order{margin-top:52px;border:1px solid var(--hair)}
.order-h{padding:16px 20px;border-bottom:1px solid var(--hair);background:var(--panel)}
.order-h h2{font:600 17px/1.2 var(--fd);letter-spacing:-.02em}
.order-h p{font-size:13px;color:var(--dim);margin-top:4px;max-width:80ch}
.ord{display:grid;grid-template-columns:44px 1fr 96px 1fr;gap:16px;padding:13px 20px;
border-bottom:1px solid rgba(242,242,242,.05);align-items:baseline;font-size:13.5px}
.ord:last-child{border-bottom:none}
.ord:hover{background:var(--panel)}
.ord .r{font:600 15px/1 var(--fm);color:var(--copper)}
.ord .id{font:400 11px/1 var(--fm);color:var(--dim)}
.ord .nm{font-weight:500}
.ord .wy{color:var(--dim);font-size:12.5px}
@media(max-width:820px){.ord{grid-template-columns:40px 1fr;gap:6px}.ord .id,.ord .wy{grid-column:2}}
.a{margin-top:64px;border:1px solid var(--hair);background:var(--panel)}
.a-h{padding:26px 28px;border-bottom:1px solid var(--hair);display:flex;gap:18px;
align-items:baseline;flex-wrap:wrap}
.a-h .r{font:600 26px/1 var(--fm);color:var(--copper)}
.a-h .id{font:400 12px/1 var(--fm);color:var(--dim);letter-spacing:.08em}
.a-h h3{font:600 25px/1.15 var(--fd);letter-spacing:-.025em}
.tag{font:400 10px/1 var(--fm);letter-spacing:.12em;text-transform:uppercase;
border:1px solid var(--hair);padding:4px 8px;color:var(--dim)}
.a-b{padding:26px 28px}
.q{color:var(--paper);font-size:16.5px;margin-bottom:5px}
.i{color:var(--dim);font-size:14px;max-width:74ch}
.blk{margin-top:26px}
.blk h4{font:400 10px/1 var(--fm);letter-spacing:.16em;text-transform:uppercase;
color:var(--copper);margin-bottom:9px}
.blk p{max-width:78ch;color:#D6D6D6}
.sec{display:grid;grid-template-columns:78px 1fr;gap:14px;padding:12px 0;
border-bottom:1px solid rgba(242,242,242,.06)}
.sec:last-child{border-bottom:none}
.sec .rf{font:400 11px/1.5 var(--fm);color:var(--dim)}
.sec .nm{font-weight:500;font-size:14px}
.sec .pu{color:var(--dim);font-size:13.5px;margin-top:2px}
.sec .ru{margin-top:7px;padding-left:11px;border-left:2px solid var(--hazard);
color:#CFCFCF;font-size:13px;max-width:74ch}
.sec .ct{font:400 11px/1 var(--fm);color:var(--copper);margin-top:6px;display:block}
.cx{border-left:2px solid var(--t);padding:11px 0 11px 15px;margin-bottom:10px}
.cx .k{font:400 9.5px/1 var(--fm);letter-spacing:.14em;text-transform:uppercase;color:var(--t)}
.cx .n{display:block;margin-top:5px;font-size:13.5px}
.cx .b{display:block;margin-top:4px;color:var(--dim);font-size:12.5px;max-width:76ch}
.open{border-left:2px solid var(--blue);padding-left:15px}
.open p{color:#CFCFCF}
.need{font:400 12.5px/1.7 var(--fm);color:var(--dim);background:rgba(242,242,242,.04);
padding:12px 15px;max-width:80ch}
code{font-family:var(--fm);font-size:.88em;background:rgba(242,242,242,.07);padding:1px 5px}
footer{margin-top:80px;padding-top:26px;border-top:1px solid var(--hair);
color:var(--dim);font:400 12px/1.7 var(--fm)}
</style></head><body><div class="w">

<header>
<div class="eb">GC.SYSTEM · Build brief · ${pending.length} pending assemblies</div>
<h1>Registered, specified,<br>and not yet built.</h1>
<p class="lede">
Twenty-eight assemblies are registered. <strong>Seventeen ship</strong> — thirteen screens, three
chrome components and one region. These <strong>${pending.length} do not</strong>. Between them they
carry ${pending.reduce((n, p) => n + p.sections.length, 0)} specified sections and
${pending.reduce((n, p) => n + p.corrections.length, 0)} corrections already recorded against the
source prototypes, so none of this is a blank page — the argument is settled and the build is not.
Ordered by consequence, not by effort.
</p>
<div class="tally">
<div><b>${pending.length}</b><span>Pending</span></div>
<div><b>${pending.reduce((n, p) => n + p.sections.length, 0)}</b><span>Sections specified</span></div>
<div><b>${pending.reduce((n, p) => n + p.corrections.length, 0)}</b><span>Corrections recorded</span></div>
${Object.entries(byV).map(([v, ids]) => `<div><b>${ids.length}</b><span>${v} vantage</span></div>`).join("")}
</div>
</header>

<section class="order">
<div class="order-h"><h2>Build order</h2>
<p>By consequence. The first four all sit on capital-moving or governance paths that are already
half-built; the last three are gateway narrative with nothing downstream waiting on them.</p></div>
${pending.map((p) => `<div class="ord">
<span class="r">${DESIGN[p.id].rank}</span>
<span><span class="nm">${esc(p.name)}</span><br><span class="id">${esc(p.id)} · ${esc(p.vantage)}</span></span>
<span class="id">${p.sections.length} sec · ${p.corrections.length} cor</span>
<span class="wy">${esc(DESIGN[p.id].why)}</span>
</div>`).join("")}
</section>

${pending.map((p) => { const d = DESIGN[p.id]; return `
<article class="a">
<div class="a-h"><span class="r">${d.rank}</span><span class="id">${esc(p.id)}</span>
<h3>${esc(p.name)}</h3>
<span class="tag">${esc(p.route)}</span><span class="tag">${esc(p.vantage)} vantage</span>
<span class="tag">${esc(p.scope)}</span></div>
<div class="a-b">
<p class="q">${esc(p.answers)}</p>
<p class="i">${esc(p.intent)}</p>

<div class="blk"><h4>Why here in the order</h4><p>${esc(d.why)}</p></div>
<div class="blk"><h4>Ground</h4><p>${esc(d.ground)}</p></div>
<div class="blk"><h4>Shape</h4><p>${code(d.shape)}</p></div>
<div class="blk"><h4>Behaviour</h4><p>${code(d.behaviour)}</p></div>

<div class="blk"><h4>Sections · ${p.sections.length} specified</h4>
${p.sections.map((s) => `<div class="sec">
<span class="rf">${esc(s.ref)}<br>${esc(s.kind)}</span>
<span><span class="nm">${esc(s.name)}</span>
<span class="pu">${esc(s.purpose)}</span>
${s.contains.length ? `<span class="ct">${s.contains.map(esc).join(" · ")}</span>` : ""}
${s.rule ? `<span class="ru">${code(s.rule)}</span>` : ""}</span>
</div>`).join("")}
</div>

<div class="blk"><h4>Corrections already recorded · ${p.corrections.length}</h4>
${p.corrections.map((c) => `<div class="cx" style="--t:${TONE[c.kind]}">
<span class="k">${esc(c.kind)} · ${esc(c.source)}</span>
<span class="n">${c.was ? `<em style="color:var(--dim)">was</em> ${code(c.was)} &rarr; ` : ""}${code(c.now)}</span>
<span class="b">${code(c.because)}</span>
</div>`).join("")}
</div>

<div class="blk"><h4>Data it needs</h4><p class="need">${code(d.dataNeeded)}</p></div>
<div class="blk"><h4>Open question</h4><div class="open"><p>${code(d.open)}</p></div></div>
${p.notes ? `<div class="blk"><h4>Note</h4><p class="i">${code(p.notes)}</p></div>` : ""}
</div></article>`; }).join("")}

<footer>
Generated from constants/assemblies.ts · sections, rules and corrections are parsed, not retyped.<br>
Ground, shape, behaviour, data and open questions are authored, and the generator refuses to run if
any pending assembly has no design entry.<br>
Pending is computed by checking both screen entries and chrome/region helpers in GC-ASSEMBLIES.html —
counting only the former is what produced the wrong figure in the exit assessment.
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(ROOT, "PENDING-ASSEMBLIES.html"), html);
console.log(`[pending-brief] wrote PENDING-ASSEMBLIES.html`);
console.log(`  ${pending.length} pending · ${pending.reduce((n, p) => n + p.sections.length, 0)} sections · ` +
  `${pending.reduce((n, p) => n + p.corrections.length, 0)} corrections`);
console.log(`  order: ${pending.map((p) => p.id).join(" ")}`);
