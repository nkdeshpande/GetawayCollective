/**
 * THE SITE RENDERER — one property template, one text-page template
 *
 * L1-01 §29-0b · 24 Sep 2026. A port of the prototype's engine
 * (_DESIGN/gc/site/engine.js), kept deliberately close to it so the pages
 * read exactly as the prototype does. It returns markup; the page mounts it
 * and app/_assemblies/site/behaviour.tsx brings it to life.
 *
 * Every colour is read from constants/tokens.ts (FILM, SITE). Content names
 * a colour as {ink:key}; inkify() resolves it here, once.
 */

import { FILM, SITE } from "@/constants/tokens";
import type { Block, Card, Concept, FilmRef, FormSpec, MapSpec, NextStep, SiteEstate, SitePage, Volume } from "./types";
import { nextFor } from "@/content/site/next";
import { GATES, estateDocket } from "./docket";
import type { Reading } from "./registry";
import { rupees, rupeesFull, src, type Prov } from "./registry";
import { daHTML, type DAKind } from "../da/render";

const INK = FILM.ink as Readonly<Record<string, string>>;

export const esc = (s: unknown) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** {ink:key} → the token's hex. An unknown key is left visible, never guessed. */
export const inkify = (s: string) => s.replace(/\{ink:(\w+)\}/g, (m, k: string) => INK[k] ?? m);

/** {{TOKEN}} → the register's reading. A token with no reading stays visible. */
export const fill = (s: string, t: Readonly<Record<string, string>> = {}) =>
  s.replace(/\{\{(\w+)\}\}/g, (m, k: string) => t[k] ?? m);

export const NE = '<svg aria-hidden="true"><use href="#ne"/></svg>';

export function film(pal: string, hour: number, o: { rain?: unknown; bp?: unknown; label?: string } = {}) {
  return `<canvas class="film" data-pal="${pal}" data-hour="${hour}"${o.rain ? ' data-rain="1"' : ""}${o.bp ? ' data-bp="1"' : ""}` +
    `${o.label ? ` role="img" aria-label="${esc(o.label)}"` : ' aria-hidden="true"'}></canvas>`;
}
const fr = (f: FilmRef, o: { bp?: boolean } = {}) => film(f[0], f[1], { rain: f[2], bp: o.bp ? f[2] : f[3] });

function card(c: Card) {
  return c.film
    ? `<div class="pcard">${film(c.film[0], c.film[1], { rain: c.film[2] })}<div class="lb"><b>${c.b}</b><span>${c.s}</span></div></div>`
    : `<div class="pcard solid"><span class="k">${c.k}</span><span class="v">${c.v}</span></div>`;
}

// ── isometric volumes for the concept drawing ──
const iso = (x: number, y: number, z: number) => [380 + (x - y) * 0.866, 250 + (x + y) * 0.5 - z];
const face = (pts: readonly (readonly number[])[]) =>
  pts.map((p) => { const q = iso(p[0], p[1], p[2] ?? 0); return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ");
function vbox(v: Volume) {
  const { x, y } = v, z = v.z || 0, dx = v.dx, dy = v.dy, dz = v.dz ?? 0;
  return [face([[x, y + dy, z + dz], [x + dx, y + dy, z + dz], [x + dx, y + dy, z], [x, y + dy, z]]),
    face([[x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x + dx, y + dy, z], [x + dx, y, z]]),
    face([[x, y, z + dz], [x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]])];
}
function vgable(v: Volume) {
  const { x, y, dx, dy } = v, dz = v.dz ?? 0, rz = v.rz ?? 0;
  return [face([[x, y + dy, 0], [x + dx, y + dy, 0], [x + dx, y + dy, dz], [x + dx / 2, y + dy, dz + rz], [x, y + dy, dz]]),
    face([[x + dx, y, 0], [x + dx, y + dy, 0], [x + dx, y + dy, dz], [x + dx, y, dz]]),
    face([[x + dx / 2, y, dz + rz], [x + dx / 2, y + dy, dz + rz], [x + dx, y + dy, dz], [x + dx, y, dz]])];
}
const vwater = (v: Volume) => [face([[v.x, v.y, 0], [v.x + v.dx, v.y, 0], [v.x + v.dx, v.y + v.dy, 0], [v.x, v.y + v.dy, 0]])];

function axoSVG(C: Concept) {
  let sv = `<g stroke="${SITE.line}" stroke-width=".6">`;
  for (let g = -320; g <= 320; g += 40) {
    sv += `<polyline fill="none" points="${face([[g, -320, 0], [g, 320, 0]])}"/><polyline fill="none" points="${face([[-320, g, 0], [320, g, 0]])}"/>`;
  }
  sv += "</g>";
  (C.ground || []).forEach((gd) => {
    sv += `<polyline fill="none" stroke="${inkify(gd.c)}" stroke-width="${gd.w || 2}" stroke-dasharray="${gd.dash || ""}" points="${face(gd.pts)}"/>`;
  });
  C.zones.forEach((z) => {
    sv += `<g class="z" data-z="${z.k}">`;
    z.vols.forEach((v) => {
      const fs = v.t === "gable" ? vgable(v) : v.t === "water" ? vwater(v) : vbox(v);
      fs.forEach((pts, i) => {
        sv += `<polygon points="${pts}" fill="${inkify(z.c)}" fill-opacity="${v.t === "water" ? 0.45 : i === 2 ? 0.95 : i === 1 ? 0.7 : 0.5}"/>`;
      });
    });
    sv += "</g>";
  });
  sv += `<g font-family="Space Mono" font-size="11" fill="${SITE.mute}">` +
    (C.labels || []).map((l) => `<text x="${l[0]}" y="${l[1]}">${l[2]}</text>`).join("") +
    '<text x="30" y="500">ILLUSTRATIVE DRAWING · NOT TO SCALE</text></g>';
  return sv;
}

function mapSVG(M: MapSpec) {
  const b = M.bounds, W = 700, H = 520;
  const P = (lat: number, lng: number) => [60 + (lng - b[1]) / (b[3] - b[1]) * (W - 120), H - 50 - (lat - b[0]) / (b[2] - b[0]) * (H - 100)];
  let s = "";
  for (let gx = 20; gx < W; gx += 18) for (let gy = 20; gy < H; gy += 18) {
    const d = Math.sin(gx * 0.013 + b[1]) * Math.cos(gy * 0.017 + b[0]);
    s += `<rect x="${gx}" y="${gy}" width="${d > 0.35 ? 3 : 1.6}" height="${d > 0.35 ? 3 : 1.6}" fill="${d > 0.35 ? SITE.line2 : SITE.panel}"/>`;
  }
  const ps = M.pts.map((p) => P(Number(p[0]), Number(p[1])));
  if (M.route) s += `<polyline points="${M.route.map((i) => ps[i].join(",")).join(" ")}" fill="none" stroke="${INK.paper}" stroke-width="1.5" stroke-dasharray="6 5"/>`;
  M.pts.forEach((p, i) => {
    const q = ps[i];
    if (p[3]) {
      s += `<g transform="translate(${q[0] - 14},${q[1] - 14}) scale(.28)"><use href="#gcm" width="100" height="100" fill="${INK.paper}"/><use href="#gcc" width="100" height="100" fill="${INK.copper}"/></g>` +
        `<text x="${q[0] + 22}" y="${q[1] + 6}" fill="${INK.paper}" font-family="Inter Tight" font-weight="700" font-size="18">${p[2]}</text>`;
    } else {
      s += `<rect x="${q[0] - 5}" y="${q[1] - 5}" width="10" height="10" fill="${SITE.mute}"/><text x="${q[0] + 12}" y="${q[1] + 4}" fill="${SITE.fog}" font-family="Satoshi" font-size="14">${p[2]}</text>`;
    }
  });
  if (M.tag) {
    const a = ps[Number(M.tag[0])], c = ps[Number(M.tag[1])], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2;
    s += `<rect x="${mx - 30}" y="${my - 36}" width="60" height="24" fill="${INK.paper}"/><text x="${mx}" y="${my - 19}" text-anchor="middle" font-family="Space Mono" font-size="13" fill="${SITE.night}">${M.tag[2]}</text>`;
  }
  return s + `<text x="24" y="${H - 12}" font-family="Space Mono" font-size="10" fill="${SITE.ash2}">THE ROUTE IS ILLUSTRATIVE</text>`;
}

/* ── the estate select on the enquiry form names estates; the API takes slugs ── */
const OPTION_SLUG: Readonly<Record<string, string>> = {
  "Any estate": "", Solace: "slowspace-solace", "Seaside Confluence": "slowspace-coastal",
  "SlowSpace Creek": "coorg-coffee-creek", "Coffee Fields Forever": "coffee-fields-forever",
};
const fieldName = (label: string) =>
  /^name$/i.test(label) ? "name" : /email/i.test(label) ? "email" : /estate/i.test(label) ? "vehicle" : /city/i.test(label) ? "city" : "note";

export function FORM(f: FormSpec, plain = false) {
  const field = (fd: FormSpec["fields"][number], i: number) => {
    const id = `${f.id}-${i}`, label = String(fd[0]), kind = fd[1], name = fieldName(label);
    const input = kind === "area"
      ? `<textarea id="${id}" name="${name}" rows="3" maxlength="2000"></textarea>`
      : kind === "select"
        ? `<select id="${id}" name="${name}">${(fd[2] as readonly string[]).map((o) => `<option value="${OPTION_SLUG[o] ?? ""}">${o}</option>`).join("")}</select>`
        : `<input id="${id}" name="${name}" type="${kind}" autocomplete="${fd[2] || "off"}"${name === "email" || name === "name" ? " required" : ""}>`;
    return `<label class="fld" for="${id}"><span>${label}</span>${input}</label>`;
  };
  const chips = f.chips ? `<span class="eb">${f.chipsLabel}</span><div class="chips-row">${f.chips.map((c, i) => `<button class="chip" type="button" aria-pressed="${i === 0}">${c}</button>`).join("")}</div>` : "";
  const submit = `<button class="btn lead" type="submit">${f.submit} ${NE}</button>`;
  /* Two steps: what the question is, then who is asking. The second step
     names the first, so nothing typed is out of sight when it is sent. */
  const who = (fd: FormSpec["fields"][number]) => ["name", "email", "city"].includes(fieldName(String(fd[0])));
  const body = f.steps
    ? `<fieldset class="fstep" data-step="1"><legend class="eb">Step 1 of 2 · What you are asking about</legend>${chips}` +
      f.fields.map((fd, i) => (who(fd) ? "" : field(fd, i))).join("") +
      '<div class="fstep-short" data-short hidden></div>' +
      `<div><button class="btn lead" type="button" data-next>Continue ${NE}</button></div></fieldset>` +
      '<fieldset class="fstep" data-step="2" hidden><legend class="eb">Step 2 of 2 · Who you are</legend>' +
      '<p class="fstep-sum" data-sum></p>' +
      f.fields.map((fd, i) => (who(fd) ? field(fd, i) : "")).join("") +
      `<div class="fstep-act">${submit}<button class="btn gray" type="button" data-back>Back</button></div></fieldset>`
    : chips + f.fields.map(field).join("") + '<div class="fstep-short" data-short hidden></div>' + `<div>${submit}</div>`;
  return `<form class="tx-form${plain ? " tx-form-plain" : ""}${f.steps ? " tx-form-steps" : ""}" novalidate data-form data-to="${f.to || "dossier"}"${f.vehicle ? ` data-vehicle="${f.vehicle}"` : ""}>` +
    `<div class="direct-row"><span class="eb">Or write directly</span><span class="mono sel">${f.addr}</span></div>` +
    body +
    `<p class="tx-ok" hidden>${f.ok}</p><p class="tx-err" hidden>That did not go through. Write to <span class="mono sel">${f.addr}</span> and it will reach the same desk.</p>` +
    `<p class="tx-src">${f.note}</p></form>`;
}

// ── capital, read from the register ──
export function FIN(E: SiteEstate, R: Reading) {
  const v = R.vehicle, o = v.offering, k = E.key;
  const full = o.available <= 0;
  let h = `<section class="fin" id="${k}-capital"><span class="eb">Capital</span>` +
    `<h2 class="h2">${o.units} units offered. <span>${full ? "All held." : `${o.available} available.`}</span></h2>` +
    `<p class="para fin-lead">${esc(v.registeredName)} holds ${esc(E.name)}. The offering letter governs every figure below.</p>`;
  /* The capital, drawn: what the estate is spent on beside where the money
     comes from, every unit and who holds it, the waterfall on this
     vehicle's own stages, and a position built from its own unit price. */
  h += `<div class="fin-da">${daHTML("stack", { vehicle: v.key })}${daHTML("units", { vehicle: v.key })}</div>`;
  h += `<div class="fin-da">${daHTML("waterfall", { vehicle: v.key, money: true })}${daHTML("position", { vehicle: v.key })}</div>`;
  h += `<p class="note">DEPOSIT ${o.deposit ? rupees(o.deposit) : "NOT STATED"} · LOCK-IN ${esc(o.lockIn.toUpperCase())} · ` +
    `${esc(v.stack.moratorium.toUpperCase())} · CAPITAL IS AT RISK · NOTHING HERE FORECASTS A RETURN</p></section>`;
  return h;
}

export function WAIT(E: SiteEstate, R: Reading | undefined) {
  const W = E.waitlist!, t = R?.tokens ?? {};
  return `<section class="mk mk-wait" id="waitlist">${film(E.pal, E.enquireHour || 18)}<div class="cap cap-wait">` +
    `<span class="sold-chip">${W.chip}</span><h2 class="h2">${W.title}</h2><p class="para dim">${fill(W.text, t)}</p>` +
    FORM({ id: `${E.key}-wl`, addr: "ir@getawaycollective.co", chipsLabel: "Units you would take", chips: W.chips,
      fields: [["Name", "text", "name"], ["Email", "email", "email"], ["Anything we should know", "area"]],
      submit: "Join the waitlist", ok: W.ok, note: W.note, to: "dossier", vehicle: E.slug }, true) +
    "</div></section>";
}

// ── the property template ──
export function PROP(E: SiteEstate, R: Reading | undefined, faq: string) {
  const k = E.key, t = R?.tokens ?? {};
  const F = (s: string) => inkify(fill(s, t));
  const waitlist = !!E.waitlist && (!R || R.stance.kind === "waitlist");
  const capital = !!R && R.publishable;
  const secs = ["hero", "place", "concept", ...E.chapters.map((c) => c.id), "materials", "day", "getting", "plan", "details",
    ...(R ? ["papers"] : []), ...(capital ? ["capital"] : []), waitlist ? "waitlist" : "enquire"];
  const idOf = (s: string) => (s === "waitlist" ? "waitlist" : s === "concept" ? "concept" : `${k}-${s}`);
  let h = `<nav class="pager" aria-label="Sections">${secs.map((s) => `<a href="#${idOf(s)}" aria-label="${s}"></a>`).join("")}</nav>`;
  const price = R ? R.price : ["Per unit, stated in the offering letter", "not yet a vehicle on this platform"];
  /* An estate that is not yet a vehicle has no enquiry route of its own;
     its questions go to the general desk. */
  const ask = R ? `/collection/${E.slug}/enquire` : "/contact";
  const open = !!R && R.stance.kind === "open" && R.vehicle.offering.deposit !== null;
  const cta = waitlist ? ["Join the waitlist", "#waitlist"]
    : open ? [`Hold a position · ${rupeesFull(R!.vehicle.offering.deposit!)} deposit`, `${ask}#hold`]
    : [R ? "Get the offering pack" : "Ask about this estate", ask];
  h += `<section class="phero" id="${k}-hero">${film(E.pal, E.hour, { label: E.heroLabel, rain: E.heroRain })}` +
    `<div class="top"><div><span class="eb">${E.eyebrow}</span><h1>${E.name}</h1><span class="credit">${E.credit}</span></div></div>` +
    `<div class="strip"><div class="pr"${R?.publishable ? src(R.prov.intake) : ""}>${price[0]} <span>· ${price[1]}</span></div><div class="sp">${F(E.spec)}</div>` +
    (R ? `<span class="sold-chip">${R.status}</span>` : "") +
    /* The shortlist (Next Actions d09): kept in this browser only, and sent
       with an enquiry only if the reader leaves it ticked. */
    `<button type="button" class="btn gray save" data-save="${E.slug}" data-name="${esc(E.name.replace(/<[^>]+>/g, ""))}" aria-pressed="false">Save</button>` +
    `<a class="btn lead" href="${cta[1]}">${cta[0]} ${NE}</a></div></section>`;
  /* The estate bar (Next Actions d02): once the hero has scrolled away, the
     name, where it stands and the same one action remain in reach — under the
     site bar on a wide screen, along the bottom on a phone. Hidden until
     SiteBehaviour sees the hero leave, so a reader who never scrolls never
     sees it. */
  h += `<div class="ebar" data-ebar aria-hidden="true"><div class="ebar-in"><b>${E.name}</b>` +
    (R ? `<span class="ebar-st">${R.status}</span>` : "") +
    `<span class="ebar-pr">${price[0]}</span><a class="btn lead btn-s" href="${cta[1]}" tabindex="-1">${cta[0]}</a></div></div>`;
  h += `<section class="intro"><p class="para center narrow intro-p">${F(E.intro)}</p></section>`;
  h += `<section class="chap" id="${k}-place"><div class="film">${fr(E.place.film)}<div class="tag"><h3>${E.place.title}</h3></div>` +
    `<div class="side"><p class="para">${F(E.place.text)}</p><p class="mono coords">${R?.vehicle.coordinates || E.place.coords}</p></div></div></section>`;
  const C = E.concept;
  h += `<section class="concept" id="concept"><span class="eb">Concept</span><h2 class="h2">${C.title}</h2>` +
    (C.lead ? `<p class="para concept-lead">${F(C.lead)}</p>` : "") +
    `<div class="axo"><svg viewBox="0 0 760 520" class="axo-svg" role="img" aria-label="Axonometric drawing of ${esc(E.name)}">${axoSVG(C)}</svg><div class="zl">` +
    C.zones.map((z) => `<button type="button" aria-pressed="true" data-z="${z.k}"><i style="background:${inkify(z.c)}"></i><b>${z.name}</b><span>${z.sub}</span><p>${F(z.text)}</p></button>`).join("") +
    "</div></div></section>";
  E.chapters.forEach((c) => {
    h += `<section class="chamber" id="${k}-${c.id}"><div class="ttl"><h3>${c.title}</h3></div><div class="film">${fr(c.film)}</div>` +
      `<p class="para">${F(c.para)}</p><div class="meta">${c.meta.map((m) => `<span>${F(m)}</span>`).join("")}</div>` +
      `<div class="pc-rail">${c.cards.map((x) => card({ ...x, s: x.s && F(x.s), v: x.v && F(x.v) })).join("")}</div></section>`;
  });
  h += `<section class="coll" id="${k}-materials"><span class="eb">Materials</span><h2 class="h2">What ${E.name} <span>is made of</span></h2><div class="cgr">` +
    E.materials.map((m, i) => {
      let bars = "";
      for (let j = 0; j < 18; j++) {
        const hh = 18 + ((i * 7 + j * 13) % 37);
        bars += `<rect x="${j * 22 + 6}" y="${120 - hh}" width="14" height="${hh}" fill="${inkify(m[3])}" opacity="${0.35 + ((j * 5 + i) % 6) * 0.1}"/>`;
      }
      return `<div><div class="t"><span>${m[0]}</span><b>${m[1]}</b><p>${F(m[2])}</p></div><svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">${bars}</svg></div>`;
    }).join("") + "</div></section>";
  h += `<section class="day" id="${k}-day"><span class="eb">${E.day.eyebrow}</span><h2 class="h2">${E.day.title}</h2><div class="clock">` +
    E.day.items.map((d) => `<div><b>${d[0]}</b><h4>${d[1]}</h4><p>${F(d[2])}</p></div>`).join("") +
    `</div><p class="para day-note">${F(E.day.note)}</p></section>`;
  const G = E.getting;
  h += `<section class="getting" id="${k}-getting"><div><span class="eb">Getting there</span><h2 class="h2">${G.title}</h2><p class="para dim">${F(G.sub)}</p><div class="tcards">` +
    G.cards.map((c, i) => `<button type="button" aria-pressed="${i === 0}"><b>${c[0]}</b><em>${c[1]}</em><span>${F(c[2])}</span></button>`).join("") +
    `</div></div><div class="map"><svg viewBox="0 0 700 520" role="img" aria-label="Map of the way to ${esc(E.name)}">${mapSVG(G.map)}</svg></div></section>`;
  h += `<section class="plan" id="${k}-plan"><span class="eb">Masterplan</span><h2 class="h2">${E.plan.title}</h2><div class="bar" role="tablist">` +
    E.plan.tabs.map((tb, i) => `<button role="tab" aria-selected="${i === 0}" data-p="${i}">${tb.tab}</button>`).join("") +
    '</div><div class="pv"><div class="dw">' +
    E.plan.tabs.map((tb, i) => `<svg viewBox="0 0 600 420" class="pdraw" data-p="${i}"${i ? " hidden" : ""} role="img" aria-label="Schematic plan: ${esc(tb.tab)}">${inkify(tb.svg)}</svg>`).join("") +
    '</div><div class="info">' +
    E.plan.tabs.map((tb, i) => `<div class="pinfo" data-p="${i}"${i ? " hidden" : ""}><h4>${tb.t}</h4>${tb.rows.map((r) => `<div><span>${r[0]}</span><span${r[2] ? ' class="ab"' : ""}>${F(String(r[1]))}</span></div>`).join("")}</div>`).join("") +
    `</div></div><p class="mono plan-note">${F(E.plan.note)}</p></section>`;
  const rows = [...(R ? R.details : []), ...E.details];
  h += `<section class="details" id="${k}-details"><span class="eb">Property details</span><h2 class="h2">Everything <span>on record.</span></h2><div class="dt">` +
    rows.map((d) => `<div><span>${d[0]}</span><span${d[2] ? ' class="ab"' : ""}${Array.isArray(d[3]) ? src(d[3] as unknown as Prov) : ""}>${F(String(d[1]))}</span></div>`).join("") + "</div>" +
    (E.detailsNote ? `<p class="mono plan-note">${F(E.detailsNote)}</p>` : "") + "</section>";
  /* The estate's papers, as a docket: each status read from the register. */
  if (R) h += `<section class="dkt-sec" id="${k}-papers"><span class="eb">The papers</span><h2 class="h2">What is <span>on file.</span></h2>` +
    `<p class="para dkt-lead">Each paper says whether it exists, where it can be read, and what is still to come. Nothing is shown as held that the register does not hold.</p>` +
    `${estateDocket(R.vehicle, E.name.replace(/<[^>]+>/g, ""), R.publishable)}</section>`;
  if (capital) h += FIN(E, R!);
  h += '<section class="own"><div><b>01</b><h4>Qualify</h4><p>Sixteen stages from Discover to Issued, about fifteen working days from a complete file. <a class="tx-u" href="/how-to-qualify">Read them first</a>.</p></div>' +
    '<div><b>02</b><h4>Commit</h4><p>Read the offering letter, the LLP agreement and the risk disclosure. Commit by holding, never by clicking.</p></div>' +
    `<div><b>03</b><h4>Hold</h4><p>On settlement you are a partner of ${esc(R ? R.vehicle.registeredName : fill(E.vehicle, t))}. Your units are on the register; your first vote opens in Member Home.</p></div></section>`;
  h += `<section class="faq dk faq-estate" id="${k}-faq"><h2 class="h2">Questions about <span>${E.name}</span></h2>${faq}</section>`;
  if (waitlist) h += WAIT(E, R);
  else h += `<section class="mk" id="${k}-enquire">${film(E.pal, E.enquireHour || 18)}<div class="cap"><span class="eb">Take the next step</span>` +
    `<h2 class="h2">Make ${E.name} <span>yours.</span></h2><p class="para dim">Request the offering pack, or write to Investor Relations at ` +
    '<span class="mono sel">ir@getawaycollective.co</span>. Capital is at risk: read the <a class="tx-u" href="/legal/risk-disclosure">Risk Factors</a> before committing.</p>' +
    `<div class="row-btns"><a class="btn lead" href="${ask}">${R ? "Request the offering pack" : "Ask about this estate"} ${NE}</a><a class="btn gray" href="/collection">Other estates</a></div></div></section>`;
  return h;
}

/* ── the holding deposit: stated in full before the button, paid online,
   everything after it offline (founder ruling, 24 Sep 2026) ── */
export function DEPOSIT(d: NonNullable<Block["deposit"]>) {
  const units = Array.from({ length: Math.max(1, d.available) }, (_, i) => i + 1);
  return `<form class="tx-form dep" id="hold" novalidate data-form data-to="deposit" data-vehicle="${d.vehicle}" data-theme-hex="${INK.ink}">` +
    `<div class="dep-terms"><div><span class="eb">Holding deposit</span><b>${d.amount}</b><span>Flat, whatever size you take</span></div>` +
    `<ul><li>Paid online, to <b>${esc(d.payee)}</b>, the partnership that owns the estate. Getaway Collective holds none of it.</li>` +
    "<li>Refundable in full until the Vehicle Agreement is signed.</li>" +
    "<li>It holds your position; it buys nothing and makes nobody a partner.</li>" +
    `<li>Identity checks, the balance at ${d.unitPrice} a unit and the Agreement all complete offline, with Investor Relations.</li></ul></div>` +
    `<label class="fld" for="dep-u"><span>Units you intend to take</span><select id="dep-u" name="units">${units.map((u) => `<option value="${u}">${u} unit${u === 1 ? "" : "s"}</option>`).join("")}</select></label>` +
    '<label class="fld" for="dep-n"><span>Name</span><input id="dep-n" name="name" type="text" autocomplete="name" required></label>' +
    '<label class="fld" for="dep-e"><span>Email</span><input id="dep-e" name="email" type="email" autocomplete="email" required></label>' +
    '<label class="fld" for="dep-p"><span>Mobile</span><input id="dep-p" name="phone" type="tel" autocomplete="tel" required></label>' +
    '<label class="fld" for="dep-c"><span>City</span><input id="dep-c" name="city" type="text" autocomplete="address-level2"></label>' +
    '<label class="ack"><input type="checkbox" name="acknowledged" required> <span>I have read the <a class="tx-u" href="/legal/risk-disclosure">Risk Factors</a> and the <a class="tx-u" href="/legal/terms">Terms</a>. Capital is at risk.</span></label>' +
    `<div><button class="btn lead" type="submit">Pay the ${d.amount} deposit ${NE}</button></div>` +
    '<p class="tx-ok" hidden></p><p class="tx-err" hidden></p>' +
    '<p class="tx-src">Payments are taken by Razorpay. Card, UPI and netbanking details never reach this site.</p></form>';
}

export function faqHTML(list: readonly (readonly string[])[], t: Readonly<Record<string, string>> = {}) {
  return list.map((f) => `<details><summary>${f[0]}<i aria-hidden="true">+</i></summary><p>${fill(f[1], t)}</p></details>`).join("");
}

// ── the text-page template ──
export function TXT(P: SitePage, faqs: Readonly<Record<string, string>> = {}) {
  const lt = !!P.light;
  let h = `<section class="tx-hero${lt ? " lt" : ""}">${P.film ? `<div class="tx-film">${film(P.film[0], P.film[1], { rain: P.film[2], bp: P.film[3] })}</div>` : ""}` +
    `<div class="tx-head"><span class="eb">${P.eyebrow}</span><h1 class="tx-h1">${P.title}</h1>${P.lead ? `<p class="tx-lead">${P.lead}</p>` : ""}${P.meta ? `<p class="mono tx-meta">${P.meta}</p>` : ""}</div></section>` +
    `<article class="tx-body${lt ? " lt" : ""}">`;
  P.blocks.forEach((b: Block) => {
    if (b.toc) h += `<nav class="tx-toc" aria-label="In this piece"><span class="eb">In this piece</span>${b.toc.map((t) => `<a href="#${t[0]}">${t[1]}</a>`).join("")}</nav>`;
    if (b.lede) h += `<p class="tx-p tx-lede">${b.lede}</p>`;
    if (b.h) h += `<h2 class="tx-h2"${b.id ? ` id="${b.id}"` : ""}>${b.h}</h2>`;
    if (b.p) h += `<p class="tx-p">${b.p}</p>`;
    if (b.pull) h += `<blockquote class="tx-pull"><p>${b.pull}</p></blockquote>`;
    if (b.html) h += b.html;
    if (b.inspire) h += `<figure class="tx-inspire"><blockquote>${esc(b.inspire.text)}</blockquote><figcaption><b>${esc(b.inspire.who)}</b><span>${esc(b.inspire.where)}</span></figcaption></figure>`;
    if (b.q) h += `<blockquote class="tx-q">${b.q}</blockquote>`;
    /* Sources are kept in the content for whoever maintains it, and never
       printed: a file name or a clause number is our filing, not the reader's. */
    if (b.list) h += `<ul class="tx-list">${b.list.map((li) => `<li>${li}</li>`).join("")}</ul>`;
    if (b.figs) h += `<div class="tx-figs">${b.figs.map((f) => `<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}</div>`;
    if (b.steps && b.stepsAs === "gates") h += GATES(`g-${P.key}`, b.h || P.eyebrow, b.steps.map((s) => ({ t: String(s[0]), text: String(s[1]) })));
    else if (b.gates) h += GATES(`g-${P.key}-${b.gates.id}`, b.gates.label, b.gates.items);
    else if (b.steps) h += `<ol class="tx-steps">${b.steps.map((s, i) => `<li><em>${String(i + (b.stepsFrom ?? 1)).padStart(2, "0")}</em><div><h3>${s[0]}</h3><p>${s[1]}</p></div></li>`).join("")}</ol>`;
    if (b.rows) h += `<div class="tx-rows">${b.rows.map((r) => `<div><span>${r[0]}</span><span${r[2] ? ' class="ab"' : ""}>${r[1]}</span></div>`).join("")}</div>`;
    if (b.legal) h += `<div class="tx-legal${b.assertion ? " tx-legal-assert" : ""}"${b.anchor ? ` id="${b.anchor}"` : ""}>${b.legal}</div>`;
    if (b.assets) h += `<div class="tx-assets">${b.assets.map((a) => { const ext = (a[1].split(".").pop() || "").toUpperCase(); const n = Number(a[3]);
      return `<a class="tx-asset" href="${a[1]}" download><span class="tx-asset-n"><b>${a[0]}</b><em>${a[2] ?? ""}</em></span><span class="mono">${ext}${n ? ` · ${n < 1024 ? `${n} B` : `${Math.round(n / 1024)} KB`}` : ""}</span><span class="tx-asset-d" aria-hidden="true">↓</span></a>`; }).join("")}</div>`;
    if (b.links) h += `<div class="tx-links">${b.links.map((l) => `<a class="btn ${l[2] || "gray"}" href="${l[1]}">${l[0]}</a>`).join("")}</div>`;
    if (b.cards) h += `<div class="tx-cards">${b.cards.map((c) => `<a class="tx-card" href="${c.href}"><div class="im">${film(c.film[0], c.film[1], { bp: c.film[2] })}</div><span class="eb">${c.eb}</span><h3>${c.t}</h3><p>${c.p}</p></a>`).join("")}</div>`;
    if (b.form) h += FORM(b.form);
    if (b.assert) h += `<p class="tx-assert">${b.assert}</p>`;
    if (b.people) h += `<div class="tx-people">${b.people.map((p) => `<article class="person${p.lead ? " lead" : ""}"><div class="pm"><span>${p.initials}</span></div><div class="pt"><span class="eb">${p.role}</span><h3>${p.name}</h3><p>${p.line}</p>` +
      (p.does ? `<ul>${p.does.map((d) => `<li>${d}</li>`).join("")}</ul>` : "") +
      `<div class="tx-rows">${p.rows.map((r) => `<div><span>${r[0]}</span><span${r[2] ? ' class="ab"' : ""}>${r[1]}</span></div>`).join("")}</div></div></article>`).join("")}</div>`;
    if (b.copy) h += `<div class="tx-copy"><div class="hd"><span class="eb">${b.copy[0]}</span><span class="mono cc"></span><button class="btn gray cpy" type="button">Copy</button></div><p class="ct">${b.copy[1]}</p></div>`;
    if (b.jcards && b.kinds) {
      const K = b.kinds, J = b.jcards;
      h += `<div class="jchips" role="group" aria-label="Filter the Journal"><button class="chip" type="button" aria-pressed="true" data-k="all">All ${J.length}</button>` +
        Object.keys(K).map((kk) => { const n = J.filter((e) => e.kind === kk).length; return n ? `<button class="chip" type="button" aria-pressed="false" data-k="${kk}">${K[kk]} ${n}</button>` : ""; }).join("") +
        `</div><div class="jlist">${J.map((e) => `<a class="jrow" data-k="${e.kind}" href="/journal/${e.key}"><span class="mono">${e.dateLabel}</span><span><b>${e.title}</b><em>${e.standfirst}</em></span><span class="mono">${K[e.kind]}<br>${e.minutes} min read</span></a>`).join("")}</div>`;
    }
    if (b.faq) h += `<div class="faq ${lt ? "" : "dk"} faq-inline">${faqs[b.faq] ?? ""}</div>`;
    if (b.da) h += daHTML(b.da as DAKind, { vehicle: b.vehicle, money: b.money });
    if (b.deposit) h += DEPOSIT(b.deposit);
  });
  const nx = P.next === undefined ? nextFor(P.path) : P.next;
  return h + "</article>" + (nx ? NEXTCARD(nx) : "");
}

/** The next step, as one wide link. The stage is named so the reader can see the path. */
export function NEXTCARD(n: NextStep) {
  return `<aside class="nxt" aria-label="Next step"><a href="${n.href}"><span class="eb">Next · ${esc(n.stage)}</span>` +
    `<b>${esc(n.title)}</b><em>${esc(n.text)}</em><span class="nxt-go" aria-hidden="true">${NE}</span></a></aside>`;
}
