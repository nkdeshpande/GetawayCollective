/**
 * DIGITAL ASSEMBLIES — pictures of the record, drawn from the record
 *
 * 24 Sep 2026. The interfaces explored in _DESIGN/gc/GC-Digital-Assemblies.html,
 * assimilated: the public site mounts this markup inside its pages, and the
 * workspaces mount it through <DA>. One renderer for both, so a waterfall on
 * the site and a waterfall in the partner's capital view cannot disagree.
 *
 * Every figure is read from constants/vehicles.ts here and formatted with
 * bigint arithmetic; the browser receives strings, never money to compute.
 * No capital figure appears for a vehicle publishable() does not clear.
 * Every colour is a token; wire.ts brings the markup to life.
 */

import {
  VEHICLES, WATERFALL_STAGES, LIFECYCLE_LABEL, publishable, stanceFor, type Vehicle,
} from "@/constants/vehicles";
import { ORDINARY_THRESHOLD, QUORUM_THRESHOLD, SPECIAL_THRESHOLD, UNANIMOUS_THRESHOLD } from "@/constants/voting";
import { FORMATION } from "@/content/admin";
import { PASSPORT_PAGES } from "@/content/compositions/passport";
import { rupees, rupeesFull } from "../site/registry";

export type DAKind =
  | "waterfall" | "stack" | "units" | "position" | "entities" | "vote"
  | "path" | "lockin" | "stages" | "formation" | "chassis" | "search";

const esc = (s: unknown) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (o: unknown) => esc(JSON.stringify(o));
const pct = (bps: number) => `${(bps / 100).toFixed(bps % 100 ? (bps % 10 ? 2 : 1) : 0)}%`;
const STAGE_TONE = ["t1", "t2", "t3", "t4", "t5", "t6"];

/** The vehicles whose figures may be shown: the record holds. */
export const shown = (): Vehicle[] => VEHICLES.filter((v) => publishable(v).ok);
const byKey = (k?: string) => (k ? VEHICLES.find((v) => v.key === k || v.slug === k) : undefined);
const pick = (vs: Vehicle[], cur: string) => vs.length < 2 ? "" :
  `<div class="da-pick" role="group" aria-label="Estate">${vs.map((v) => `<button type="button" class="da-pill" data-k="${v.key}" aria-pressed="${v.key === cur}">${esc(v.propertyName)}</button>`).join("")}</div>`;
const shell = (kind: DAKind, body: string, data?: unknown, cls = "") =>
  `<div class="da da-${kind}${cls ? " " + cls : ""}" data-da="${kind}"${data === undefined ? "" : ` data-json="${json(data)}"`}>${body}</div>`;

// ── the waterfall ──
function waterfallData(v: Vehicle) {
  const w = v.operating.waterfall!, gross = v.operating.grossRevenue;
  return {
    key: v.key, gross: rupees(gross),
    rows: WATERFALL_STAGES.map(([k, n], i) => {
      const b = w[k] ?? 0;
      return { n: n.replace(/^\d /, ""), bps: b, pct: pct(b), amt: rupees((gross * BigInt(b)) / 10000n), tone: STAGE_TONE[i] };
    }),
    partners: pct(w.toPartners ?? 0),
  };
}
function waterfall(o: { vehicle?: string; money?: boolean }) {
  const vs = (o.vehicle ? [byKey(o.vehicle)!] : shown()).filter((v) => v && v.operating.waterfall && publishable(v).ok);
  if (!vs.length) return shell("waterfall", '<p class="da-none">The waterfall is not yet stated for this vehicle.</p>');
  const data = vs.map(waterfallData), d = data[0];
  const rows = (x: typeof d) => { let run = 0; return x.rows.map((r) => { const left = run; run += r.bps;
    return `<div class="da-wf-row"><span class="da-wf-n">${r.n}</span><span class="da-wf-t"><i class="${r.tone}" style="left:${left / 100}%;width:${r.bps / 100}%"></i></span><span class="da-mono">${r.pct}</span>${o.money ? `<span class="da-mono da-cu">${r.amt}</span>` : ""}</div>`; }).join(""); };
  return shell("waterfall",
    pick(vs, d.key) +
    `<div class="da-top"><div><span class="da-lbl">Reaches partners</span><div class="da-big" data-f="partners">${d.partners}</div></div>${o.money ? '<span class="da-chip">Forecast</span>' : ""}</div>` +
    `<div class="da-wf" data-f="rows">${rows(d)}</div>` +
    (o.money ? `<p class="da-note">On a modelled gross revenue of <b data-f="gross">${d.gross}</b> a year. The offering letter governs.</p>` : ""),
    { money: !!o.money, set: data.map((x) => ({ ...x, html: rows(x) })) });
}

// ── the capital stack: what it is spent on, beside where it comes from ──
function stack(o: { vehicle?: string }) {
  const v = byKey(o.vehicle) ?? shown()[0];
  if (!v || !publishable(v).ok) return shell("stack", '<p class="da-none">The capital stack is not yet published for this vehicle.</p>');
  const s = v.stack, T = s.projectTotal, rest = T - s.land - s.formation > 0n ? T - s.land - s.formation : 0n;
  const share = (x: bigint) => T > 0n ? Number((x * 1000n) / T) / 10 : 0;
  const U: [string, bigint, string][] = [["Land", s.land, "t1"], ["Formation", s.formation, "t2"], ["Balance of the project", rest, "t0"]];
  const S: [string, bigint, string][] = [["Equity", s.equityLayer, "t6"], ["Bank facility", s.facility, "t3"]];
  const col = (L: typeof U) => L.map(([n, x, t]) => `<i class="${t}" style="flex:${share(x)}" title="${n}"></i>`).join("");
  return shell("stack",
    `<div class="da-cs"><div class="da-cs-cols"><div><div class="da-cs-bar">${col(U)}</div><span class="da-hint">Uses</span></div><div><div class="da-cs-bar">${col(S)}</div><span class="da-hint">Sources</span></div></div>` +
    `<div class="da-cs-side"><span class="da-lbl">Project cost</span><div class="da-big">${rupees(T)}</div><div class="da-leg">` +
    [...U, ...S].map(([n, x, t]) => `<div><i class="${t}"></i><span>${n}</span><b class="da-mono">${rupees(x)}</b></div>`).join("") + "</div></div></div>");
}

// ── every unit, and who holds it ──
function units(o: { vehicle?: string }) {
  const v = byKey(o.vehicle) ?? shown()[0];
  if (!v || !publishable(v).ok) return shell("units", '<p class="da-none">The units are not yet published for this vehicle.</p>');
  const of = v.offering, total = of.unitPrice > 0n ? Number(of.totalEquity / of.unitPrice) : of.units;
  const sp = of.unitPrice > 0n ? Number(of.promoter / of.unitPrice) : 0, cells: string[] = [];
  for (let i = 0; i < total; i++) cells.push(i < sp ? "t0" : i < sp + of.subscribed ? "ink" : "t6");
  const held = of.units ? Math.round((of.subscribed / of.units) * 100) : 0;
  return shell("units",
    `<div class="da-top"><div><span class="da-lbl">Offered units held</span><div class="da-big">${held}%</div></div><span class="da-tag ${of.available ? "hot" : "ok"}">${of.available ? `${of.available} available` : "Fully subscribed"}</span></div>` +
    `<div class="da-ub">${cells.map((c) => `<i class="${c}"></i>`).join("")}</div>` +
    `<div class="da-leg da-leg-row"><span><i class="t0"></i>Sponsor · ${sp}</span><span><i class="ink"></i>Subscribed · ${of.subscribed}</span><span><i class="t6"></i>Available · ${of.available}</span></div>` +
    `<p class="da-note">${of.units} offered at ${rupees(of.unitPrice)} each · the sponsor holds ${rupees(of.promoter)} of ${rupees(of.totalEquity)}.</p>`);
}

// ── units in; capital, share, vote and nights out ──
function positionData(v: Vehicle) {
  const of = v.offering, e = v.entitlement, total = of.unitPrice > 0n ? Number(of.totalEquity / of.unitPrice) : 1;
  const rows = [];
  for (let u = 1; u <= Math.max(1, of.units); u++) {
    const share = u / total;
    rows.push({ u, cap: rupees(of.unitPrice * BigInt(u)), share: `${(share * 100).toFixed(1)}%`,
      nights: e ? `${Math.floor(e.nightPoolMin * share)}–${Math.floor(e.nightPoolMax * share)}` : "Not yet set" });
  }
  return { key: v.key, rows, begins: e ? e.begins : "The allocation rule is not yet set for this estate" };
}
function position(o: { vehicle?: string }) {
  const vs = (o.vehicle ? [byKey(o.vehicle)!] : shown()).filter((v) => v && publishable(v).ok);
  if (!vs.length) return shell("position", '<p class="da-none">Positions are not yet published for this vehicle.</p>');
  const data = vs.map(positionData), d = data[0], r = d.rows[0];
  return shell("position",
    pick(vs, d.key) +
    `<div class="da-pb"><div class="da-tile"><span class="da-lbl">Capital</span><b data-f="cap">${r.cap}</b></div><div class="da-tile"><span class="da-lbl">Share of equity</span><b data-f="share">${r.share}</b></div>` +
    `<div class="da-tile"><span class="da-lbl">Vote weight</span><b data-f="vote">${r.share}</b></div><div class="da-tile"><span class="da-lbl">Nights a year</span><b data-f="nights">${r.nights}</b></div></div>` +
    `<label class="da-range"><span class="da-lbl"><b data-f="u">1</b> <span data-f="uw">unit</span></span><input type="range" min="1" max="${d.rows.length}" value="1" aria-label="Units held"></label>` +
    `<p class="da-note">Nights follow the share of equity, beginning: <span data-f="begins">${esc(d.begins)}</span>. Illustration only; the offering letter governs.</p>`,
    { set: data });
}

// ── three entities ──
function entities() {
  return shell("entities",
    '<div class="da-pick" role="group" aria-label="View"><button type="button" class="da-pill" data-m="Governance" aria-pressed="true">Governance</button><button type="button" class="da-pill" data-m="Capital" aria-pressed="false">Capital</button><button type="button" class="da-pill" data-m="Operations" aria-pressed="false">Operations</button></div>' +
    '<svg class="da-te" viewBox="0 0 640 380" role="img" aria-label="Getaway Collective, the estate\'s LLP and Sensory Getaways, and what passes between them"></svg>');
}

// ── the vote ──
function vote(o: { vehicle?: string }) {
  const g = byKey(o.vehicle)?.governance;
  const t = g ? { ordinary: g.ordinaryBps / 10000, special: g.specialBps / 10000, quorum: g.quorumBps / 10000 }
    : { ordinary: ORDINARY_THRESHOLD, special: SPECIAL_THRESHOLD, quorum: QUORUM_THRESHOLD };
  return shell("vote",
    '<svg class="da-vt" viewBox="0 0 320 180" aria-hidden="true"></svg>' +
    '<div class="da-top"><div><span class="da-lbl">Equity voting for</span><div class="da-big" data-f="v">68%</div></div><div class="da-res" data-f="res"></div></div>' +
    '<label class="da-range"><input type="range" min="0" max="100" value="68" aria-label="Equity voting for"></label>' +
    '<p class="da-note">Votes are weighted by equity, never one partner, one vote.</p>',
    { ...t, unanimous: UNANIMOUS_THRESHOLD });
}

// ── the path to becoming a partner ──
function path() {
  const S = Object.entries(PASSPORT_PAGES).filter(([p, e]) => p.startsWith("/passport/") && typeof e !== "function")
    .map(([p, e]) => (typeof e === "function" ? p : e.title).replace(/^\d+\s*·\s*/, ""));
  return shell("path",
    `<div class="da-top"><div><span class="da-lbl">Stage <b data-f="i">1</b> of ${S.length}</span><div class="da-big-s" data-f="n">${esc(S[0])}</div></div><button type="button" class="da-pill da-go">Next</button></div>` +
    `<div class="da-ap">${S.map((_, i) => `<i class="${i === 0 ? "now" : ""}"></i>`).join("")}</div>` +
    `<ol class="da-ap-l">${S.map((s, i) => `<li class="${i === 0 ? "now" : ""}"><i></i>${esc(s)}</li>`).join("")}</ol>` +
    '<p class="da-note">About fifteen working days from a complete file. Resumable at every stage.</p>',
    { stages: S });
}

// ── from deposit to the first day a unit can move ──
function lockin(o: { vehicle?: string }) {
  const v = byKey(o.vehicle) ?? VEHICLES.find((x) => stanceFor(x).kind === "open") ?? VEHICLES[0];
  const lock = parseInt(v.offering.lockIn, 10) || 36;
  return shell("lockin",
    '<div class="da-top"><div><span class="da-lbl" data-f="s">Months until a unit can move</span><div class="da-big" data-f="v"></div></div><span class="da-tag" data-f="t"></span></div>' +
    `<div class="da-lk"><i></i></div><div class="da-lk-m"><span>Deposit</span><span>Settlement</span><span>Transfer opens</span></div>` +
    `<label class="da-range"><input type="range" min="-2" max="${lock + 6}" value="12" aria-label="Months since settlement"></label>` +
    `<p class="da-note">Deposit ${v.offering.deposit === null ? "not yet set" : rupeesFull(v.offering.deposit)}, refundable in full until the Vehicle Agreement is signed · lock-in ${esc(v.offering.lockIn)}.</p>`,
    { lock });
}

// ── every estate on one track ──
function stages() {
  const ST = ["Pipeline", "Forming", "Design", "Pre-construction", "Construction", "Operating"];
  const at = (v: Vehicle) => v.lifecycle === "live" || v.buildStage === "stabilised" ? 5 : v.buildStage === "under-construction" ? 4 : v.lifecycle === "forming" ? 1 : 3;
  const rows: [string, number | null, string][] = VEHICLES.map((v) => [v.propertyName, at(v), LIFECYCLE_LABEL[v.lifecycle]]);
  rows.push(["Coffee Fields Forever", null, "Not yet open for investment"], ["Nine Hills", 0, "Pipeline · not yet offered"]);
  return shell("stages",
    `<div class="da-es-h"><span></span>${ST.map((s, i) => `<span class="da-mono">${String(i + 1).padStart(2, "0")} ${s}</span>`).join("")}</div>` +
    rows.map(([n, s, l]) => `<div class="da-es-r"><span class="da-es-n">${esc(n)}</span>${s === null ? `<span class="da-hint da-es-x">${esc(l)}</span>`
      : ST.map((_, i) => `<i class="${i < s ? "done" : i === s ? "now" : ""}"></i>`).join("")}<span class="da-hint da-es-l">${esc(l)}</span></div>`).join(""));
}

// ── the eight steps that let an LLP take capital ──
function formation() {
  const F = FORMATION;
  return shell("formation",
    `<div class="da-fm"><div class="da-fm-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="bg"/><circle cx="60" cy="60" r="50" class="fg"/></svg><div><b class="da-big-s" data-f="n">1</b><span class="da-hint">of ${F.length}</span></div></div>` +
    `<ol class="da-fm-l">${F.map((f, i) => `<li><button type="button" class="${i === 0 ? "now" : ""}" data-i="${i}"><span class="da-mono">${esc(f.n)}</span><b>${esc(f.title)}</b><span class="da-hint">${esc(f.writes.join(" · "))}</span></button></li>`).join("")}</ol></div>`,
    { n: F.length });
}

// ── one system, assembled three ways ──
function chassis() {
  const C = [["Ridge", "38 m² + courtyard", "On the ground", '<path d="M20 150H180"/><path class="t4f" d="M40 150V100H160V150Z"/><path d="M40 100V88H160V100"/>'],
    ["Expanse", "36 m² + deck", "Lifted 3.8 m", '<path d="M20 150H180"/><path d="M50 150V110H150V150"/><path class="t3f" d="M30 110V64H170V110Z"/>'],
    ["Voyager", "52 m² + porch", "Opened into volume", '<path d="M20 150H180"/><path class="t5f" d="M40 150V96L100 40L160 96V150Z"/><path d="M100 40V150" stroke-dasharray="3 4"/>']];
  return shell("chassis",
    `<div class="da-ch"><div class="da-ch-d">${C.map((c, i) => `<svg viewBox="0 0 200 170" aria-hidden="true" data-i="${i}"${i ? " hidden" : ""}>${c[3]}</svg>`).join("")}</div>` +
    `<div class="da-ch-l">${C.map((c, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}"><b>${c[0]}</b><span class="da-lbl">${c[1]}</span><span class="da-hint">${c[2]}</span></button>`).join("")}</div></div>`);
}

// ── a search box for the rows that follow it ──
function search() {
  return shell("search", '<label class="da-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search the answers: timeshare, units, risk" aria-label="Search the answers"></label><p class="da-hint" data-f="n"></p>');
}

export function daHTML(kind: DAKind, o: { vehicle?: string; money?: boolean } = {}): string {
  switch (kind) {
    case "waterfall": return waterfall(o);
    case "stack": return stack(o);
    case "units": return units(o);
    case "position": return position(o);
    case "entities": return entities();
    case "vote": return vote(o);
    case "path": return path();
    case "lockin": return lockin(o);
    case "stages": return stages();
    case "formation": return formation();
    case "chassis": return chassis();
    case "search": return search();
  }
}
