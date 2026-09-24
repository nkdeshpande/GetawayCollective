/**
 * THE JOURNAL'S DRAWINGS — each one a picture of numbers the entry states
 *
 * 24 Sep 2026. content/site/journal-extras.ts names which drawing sits in
 * which entry; this draws it. No drawing introduces a figure the entry does
 * not already state; where a shape is illustrative (the monsoon months) the
 * drawing says so on its face. Colours are tokens (SITE, FILM.ink), never
 * literals.
 */

import { FILM, SITE } from "@/constants/tokens";
import { WATERFALL } from "../data";
import type { Graphic } from "@/content/site/journal-extras";
import { esc } from "./render";

const INK = FILM.ink;
const MONO = 'font-family="Space Mono"';
const TEXT = 'font-family="Satoshi"';
const cap = (s: string) => `<p class="ig-cap">${s}</p>`;
const frame = (inner: string, caption: string) => `<figure class="ig">${inner}${cap(caption)}</figure>`;

function waterfall() {
  const rows = WATERFALL.slice(1);
  let x = 0, y = 34, svg = "";
  const W = 560, L = 190;
  svg += `<text x="0" y="18" ${MONO} font-size="11" fill="${SITE.mute}">GROSS REVENUE · 100%</text>`;
  svg += `<rect x="${L}" y="6" width="${W}" height="16" fill="${SITE.line2}"/>`;
  for (const r of rows) {
    const w = (r.bps / 10000) * W, last = r.cls === "out";
    svg += `<text x="0" y="${y + 12}" ${TEXT} font-size="13" fill="${last ? INK.paper : SITE.fog}">${esc(r.k.replace(/\s*·\s*/, " · "))}</text>`;
    svg += `<rect x="${L + x}" y="${y}" width="${w}" height="16" fill="${last ? INK.copper : r.cls === "senior" ? SITE.ember : SITE.ash}"/>`;
    svg += `<text x="${L + x + w + 6}" y="${y + 12}" ${MONO} font-size="11" fill="${last ? INK.copper : SITE.mute}">${(r.bps / 100).toFixed(r.bps % 100 ? 1 : 0)}%</text>`;
    if (!last) svg += `<line x1="${L + x + w}" y1="${y + 16}" x2="${L + x + w}" y2="${y + 34}" stroke="${SITE.line2}" stroke-dasharray="2 3"/>`;
    x += w; y += 34;
  }
  return frame(`<svg viewBox="0 0 800 ${y + 6}" class="ig-svg" role="img" aria-label="The six stages of the waterfall, each paid in full before the next">${svg}</svg>`,
    "Each stage is paid in full before the next receives anything. The platform's worked example: the partners' stage is last, and it is 38%.");
}

function timeline(steps: readonly (readonly [string, string])[], mark: number, markLabel: string) {
  return frame(`<ol class="ig-time">${steps.map((s, i) => `<li${i >= mark ? ' class="on"' : ""}>${i === mark ? `<em>${esc(markLabel)}</em>` : ""}<b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>`).join("")}</ol>`,
    "Nothing changes state until cleared funds reach the vehicle.");
}

function triad() {
  const c = (h: string, b: string, t: string, lead = false) => `<div class="ig-tri${lead ? " lead" : ""}"><span class="eb">${h}</span><b>${b}</b><p>${t}</p></div>`;
  return frame(`<div class="ig-triad">${c("Governs", "Getaway Collective", "Writes and keeps the rules. Paid from stage two. Holds no equity.")}` +
    c("Owns", "One LLP per estate", "Its partners hold it and decide, with votes weighted by equity.", true) +
    c("Runs", "The operating partner", "Operates the estate under contract, measured on service levels.") + "</div>",
    "Separated on purpose: the party that interprets the rules has nothing an interpretation could improve.");
}

function ladder(steps: readonly (readonly [string, string])[]) {
  return frame(`<ol class="ig-ladder">${steps.map((s, i) => `<li style="--k:${i}"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>`).join("")}</ol>`,
    "Strongest first. A figure never carries a stronger class than the weakest input it was computed from.");
}

function nots(headings: readonly string[]) {
  const list = headings.filter((h) => /^We do not/i.test(h));
  return frame(`<ul class="ig-nots">${list.map((h) => `<li><i aria-hidden="true"></i>${esc(h)}</li>`).join("")}</ul>`, "Five things asked for, and declined, with the reason for each below.");
}

function weekends() {
  /* 80 years of 52 Saturdays: 20 of childhood, 50 of the working middle, 10 after. */
  const s = 7, cols = 80, rows = 52, W = cols * s, H = rows * s;
  const pat = (id: string, c: string) => `<pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="${s - 2}" height="${s - 2}" fill="${c}"/></pattern>`;
  const svg = `<defs>${pat("wk-a", SITE.line2)}${pat("wk-b", INK.copper)}${pat("wk-c", SITE.line2)}</defs>` +
    `<rect x="0" y="0" width="${20 * s}" height="${H}" fill="url(#wk-a)"/>` +
    `<rect x="${20 * s}" y="0" width="${50 * s}" height="${H}" fill="url(#wk-b)"/>` +
    `<rect x="${70 * s}" y="0" width="${10 * s}" height="${H}" fill="url(#wk-c)"/>` +
    `<text x="0" y="${H + 18}" ${MONO} font-size="11" fill="${SITE.mute}">0</text>` +
    `<text x="${20 * s}" y="${H + 18}" ${MONO} font-size="11" fill="${SITE.mute}">20</text>` +
    `<text x="${70 * s}" y="${H + 18}" ${MONO} font-size="11" fill="${SITE.mute}">70</text>` +
    `<text x="${W - 16}" y="${H + 18}" ${MONO} font-size="11" fill="${SITE.mute}">80</text>`;
  return frame(`<svg viewBox="0 0 ${W} ${H + 26}" class="ig-svg" role="img" aria-label="About four thousand Saturdays in an eighty-year life, with the working middle highlighted">${svg}</svg>`,
    "One square is one Saturday; one column is one year. The copper middle is roughly two and a half thousand, and a few hundred of them are genuinely yours to place.");
}

function pernight() {
  const s = 12, W = 28 * s, rows = 14;
  let cells = "";
  for (let i = 0; i < 365; i++) {
    const on = i % 15 === 7 && i < 360;
    cells += `<rect x="${(i % 28) * s + 1}" y="${Math.floor(i / 28) * s + 1}" width="${s - 2}" height="${s - 2}" fill="${on ? INK.copper : SITE.line}"/>`;
  }
  const svg = `<g>${cells}</g>`;
  return frame(`<div class="ig-split"><svg viewBox="0 0 ${W} ${rows * s}" class="ig-svg" role="img" aria-label="A year of 365 nights with 24 used">${svg}</svg>` +
    '<div class="ig-sum"><div><b>₹12,00,000</b><span>to hold, a year</span></div><div><i>÷</i><b>24</b><span>nights used</span></div><div class="on"><i>=</i><b>₹50,000</b><span>a night</span></div></div></div>',
    "A lakh a month, divided by the nights somebody actually slept there. Every square is a night the house was paid for.");
}

function evenings() {
  const row = (label: string, trips: number, nights: number) => {
    let r = "";
    for (let t = 0; t < trips; t++) for (let n = 0; n < nights; n++) r += `<i class="${n === 0 ? "first" : ""}"></i>`;
    return `<div class="ig-ev"><span>${label}</span><div>${r}</div></div>`;
  };
  return frame(`<div class="ig-evs">${row("Two nights, twelve times", 12, 2)}${row("Two weeks, once", 1, 14)}</div>`,
    "Copper marks a first evening, the long one. Twelve short trips hold twelve of them; one long trip holds one.");
}

function rain() {
  /* Illustrative shape only: the entry states two to seven metres, mostly in four months. */
  const shape = [1, 1, 2, 6, 12, 90, 100, 80, 45, 20, 6, 2];
  const m = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const W = 38, H = 180;
  const svg = shape.map((v, i) => {
    const h = (v / 100) * H, wet = i >= 5 && i <= 8;
    return `<rect x="${i * W + 6}" y="${H - h}" width="${W - 12}" height="${h}" fill="${wet ? INK.river : SITE.line2}"/>` +
      `<text x="${i * W + W / 2}" y="${H + 18}" text-anchor="middle" ${MONO} font-size="11" fill="${wet ? INK.paper : SITE.mute}">${m[i]}</text>`;
  }).join("");
  return frame(`<svg viewBox="0 0 ${12 * W} ${H + 26}" class="ig-svg ig-narrow" role="img" aria-label="Rain in the Western Ghats arrives mostly in four months">${svg}</svg>`,
    "The shape, not a measurement: two to seven metres a year, most of it between June and September. A house here is a proposition about those four months.");
}

function hundred() {
  const steps: readonly [string, number][] = [["Revenue", 100], ["Operating cost", -38], ["Operator's fee", -10], ["Sales and distribution", -6], ["Interest", -12], ["Reserve for repair", -8]];
  const W = 5.2, L = 170;
  let level = 0, y = 0, svg = "";
  for (const [k, v] of steps) {
    const from = v > 0 ? 0 : level + v, w = Math.abs(v) * W;
    svg += `<text x="0" y="${y + 14}" ${TEXT} font-size="13" fill="${SITE.fog}">${esc(k)}</text>`;
    svg += `<rect x="${L + from * W}" y="${y}" width="${w}" height="18" fill="${v > 0 ? SITE.ash : SITE.ember}"/>`;
    svg += `<text x="${L + (from + Math.abs(v)) * W + 6}" y="${y + 14}" ${MONO} font-size="11" fill="${SITE.mute}">${v > 0 ? v : "−" + Math.abs(v)}</text>`;
    level += v; y += 30;
  }
  svg += `<text x="0" y="${y + 14}" ${TEXT} font-size="13" font-weight="600" fill="${INK.paper}">Left before tax</text>`;
  svg += `<rect x="${L}" y="${y}" width="${level * W}" height="18" fill="${INK.copper}"/>`;
  svg += `<text x="${L + level * W + 6}" y="${y + 14}" ${MONO} font-size="11" fill="${INK.copper}">${level}</text>`;
  return frame(`<svg viewBox="0 0 740 ${y + 26}" class="ig-svg" role="img" aria-label="A hundred rupees of revenue, followed to the twenty-six left before tax">${svg}</svg>`,
    "The entry's own illustration: the figures are invented and the order is not. Against an asset costing twenty-five times revenue, 26 is roughly a one per cent yield.");
}

function twowaters() {
  const W = 760, H = 220;
  const svg =
    `<rect x="0" y="0" width="${W}" height="${H}" fill="${SITE.coal}"/>` +
    `<rect x="0" y="0" width="250" height="${H}" fill="${INK.sea3}"/>` +
    Array.from({ length: 8 }, (_, i) => `<path d="M10 ${24 + i * 26} q 25 -10 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke="${INK.sea2}" stroke-width="1.4" opacity=".7"/>`).join("") +
    `<rect x="250" y="0" width="260" height="${H}" fill="${INK.sand}" opacity=".85"/>` +
    `<rect x="510" y="0" width="${W - 510}" height="${H}" fill="${INK.river}" opacity=".55"/>` +
    `<g transform="translate(355 86) scale(.5)"><use href="#gcm" width="100" height="100" fill="${INK.ink}"/><use href="#gcc" width="100" height="100" fill="${INK.copper}"/></g>` +
    `<line x1="250" y1="${H - 26}" x2="510" y2="${H - 26}" stroke="${INK.ink}"/><line x1="250" y1="${H - 32}" x2="250" y2="${H - 20}" stroke="${INK.ink}"/><line x1="510" y1="${H - 32}" x2="510" y2="${H - 20}" stroke="${INK.ink}"/>` +
    `<text x="380" y="${H - 34}" text-anchor="middle" ${MONO} font-size="12" fill="${INK.ink}">~400 m</text>` +
    `<text x="20" y="${H - 14}" ${MONO} font-size="11" fill="${INK.paper}">THE ARABIAN SEA · SURF</text>` +
    `<text x="${W - 20}" y="${H - 14}" text-anchor="end" ${MONO} font-size="11" fill="${INK.ink}">THE ESTUARY · STILL</text>`;
  return frame(`<svg viewBox="0 0 ${W} ${H}" class="ig-svg" role="img" aria-label="The estate on a strip of land between the open sea and a still estuary, about 400 metres apart">${svg}</svg>`,
    "Surf on the western edge, still water on the eastern, about four hundred metres apart. A schematic, not a survey.");
}

function nights() {
  return frame('<div class="ig-paths"><div><span class="eb">A night taken</span><b>Used by the partner</b><p>Nothing is sold, and nothing enters the waterfall.</p></div>' +
    '<div class="on"><span class="eb">A night released</span><b>Sold, like any other</b><p>The revenue enters the waterfall at stage one, so the partner who took less is paid slightly more.</p></div></div>',
    "Neither is penalised; the arithmetic simply follows.");
}

function compare(head: readonly [string, string], rows: readonly (readonly [string, string, string])[]) {
  return frame(`<div class="ig-compare"><div class="hd"><span></span><b>${esc(head[0])}</b><b class="on">${esc(head[1])}</b></div>` +
    rows.map((r) => `<div><span>${esc(r[0])}</span><p>${esc(r[1])}</p><p class="on">${esc(r[2])}</p></div>`).join("") + "</div>",
    "Both were considered. The partnership was chosen for what happens when things go wrong.");
}

export function graphicHTML(g: Graphic, headings: readonly string[]): string {
  switch (g.kind) {
    case "compare": return compare(g.head, g.rows);
    case "waterfall": return waterfall();
    case "timeline": return timeline(g.steps, g.mark, g.markLabel);
    case "triad": return triad();
    case "ladder": return ladder(g.steps);
    case "nots": return nots(headings);
    case "weekends": return weekends();
    case "pernight": return pernight();
    case "evenings": return evenings();
    case "rain": return rain();
    case "hundred": return hundred();
    case "twowaters": return twowaters();
    case "nights": return nights();
  }
}
