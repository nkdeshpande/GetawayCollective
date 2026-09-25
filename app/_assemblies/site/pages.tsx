/**
 * THE SITE'S PAGES — what scripts/gen-app.js points the public routes at
 *
 * L1-01 §29-0b · 24 Sep 2026. Each export is one route's component. They
 * compose the templates in ./render.ts from three sources and nothing else:
 *
 *   content/site/*           the site's own copy, ported from the prototype
 *   content/journal, legal   gc-app's Journal and legal corpus, verbatim
 *   constants/vehicles       every figure about a vehicle
 *
 * Markup is rendered on the server and mounted whole; SiteBehaviour wires
 * it after each navigation. The markup is authored in this repository and
 * never carries visitor input, which is what makes mounting it safe.
 */

import { notFound } from "next/navigation";
import { ESTATES, FAQX } from "@/content/site/estates";
import { PAGES } from "@/content/site/pages";
import { COLLECTION, FAQ, HOME_JOURNAL, HOME_STACK, MANIFESTO, NEXT_ESTATES, TRIO } from "@/content/site/home";
import { JOURNAL, KIND_LABEL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";
import { VEHICLES, vehicleBySlug } from "@/constants/vehicles";
import { PROPERTIES } from "../data";
import { calcHTML, compareHTML as fourWaysHTML, simulate, DEFAULTS as CALC_DEFAULTS, type CalcEstate } from "./calc";
import { chapterContent } from "../propertychapter";
import type { ChapterId } from "@/constants/property-chapters";
import { daHTML } from "../da/render";
import { FORM, NE, PROP, TXT, esc, faqHTML, film, fill, inkify } from "./render";
import { graphicHTML } from "./infographics";
import { JOURNAL_EXTRAS } from "@/content/site/journal-extras";
import { openReading, read, rupees, rupeesFull, src, vehicleOf, type Prov } from "./registry";
import type { Block, NextStep, SitePage } from "./types";
import { DOCKET, rulebookDocket } from "./docket";
import { APPLY, ROLES, WHY } from "@/content/site/careers";
import { GALLERY } from "./gallery";
import { PASSPORT_STAGES } from "@/content/compositions/passport";
import { OPERATORS } from "@/content/public";

function Mount({ html, light = false }: { html: string; light?: boolean }) {
  return <div className={`pg${light ? " pg-col" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 2026-08-03 → 3 Aug 2026. */
const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
};

const estateBySlug = (slug: string) => Object.values(ESTATES).find((e) => e.slug === slug);
const pageByPath = (path: string) => Object.values(PAGES).find((p) => p.path === path);

/** Names a page by what it is. Read by gen-app's generateMetadata. */
export function siteTitle(slug: string): string | undefined {
  const e = estateBySlug(slug);
  if (e) return `${e.name.replace(/<[^>]+>/g, "")} · Getaway Collective`;
  const p = pageByPath(`/collection/${slug}`);
  return p ? `${p.title.replace(/<[^>]+>/g, "").replace(/\.$/, "")} · Getaway Collective` : undefined;
}

/** The hero counts the collection rather than stating a number that goes stale. */
const COUNT: Readonly<Record<number, string>> = { 4: "FOUR", 5: "FIVE", 6: "SIX", 7: "SEVEN", 8: "EIGHT", 9: "NINE", 10: "TEN" };

// ── home ──
export function SiteHome() {
  const pack = openReading();
  const journal = HOME_JOURNAL.map((j) => ({ ...j, e: JOURNAL.find((x) => x.slug === j.slug) })).filter((j) => j.e);
  const chip = (key: string | null, fallback: string) => {
    const R = key ? read(vehicleOf(key)!) : undefined;
    return R ? `${R.status} · ${fallback}` : `IN DELIVERY · ${fallback}`;
  };
  const html =
    `<section class="hero">${film("coast", 18.4, { label: "Drawn film: laterite cliffs and the Arabian Sea at dusk" })}` +
    '<h1 class="wm" aria-label="Getaway Collective">GETAWAY <span>COLLECTIVE</span></h1>' +
    `<p class="tl">Sensory Retreat,<br><span>Capital Meets Curation.</span></p><span class="scroll">SCROLL · ${COUNT[COLLECTION.length] ?? COLLECTION.length} ESTATES</span></section>` +
    `<section class="mani"><p id="mani">${MANIFESTO.split(" ").map((w) => `<span>${w}</span>`).join(" ")}</p></section>` +
    '<div class="explore-h"><span class="eb">The collection</span><h2 class="h2">Explore our <span>estates</span></h2></div>' +
    '<div class="stackfilm">' + HOME_STACK.map((s) =>
      `<section class="sf">${film(s.pal, s.hour, { rain: s.rain })}<div class="ov"><div><h3>${s.name}</h3><p>${s.line}</p><span class="chip">${chip(s.vehicleKey, s.chip)}</span></div></div>` +
      `<a class="btn go" href="${s.href}">${s.cta} ${NE}</a></section>`).join("") + "</div>" +
    `<section class="ref"><div>${film("solace", 7)}</div><div>${film("creek", 11)}</div><div>${film("cff", 17)}</div>` +
    '<div class="mid"><div><span class="eb">Getaway Collective</span><b>ONE STANDARD</b><p class="para para-s">Every estate held in its own LLP, drawn to one standard, run by one operator.</p><a class="btn" href="/collection">See all</a></div></div></section>' +
    /* The collection, in frames (./gallery.ts): the fan opens the full-screen viewer, one estate a frame. */
    `<section class="gal-sec"><div class="gal-head"><span class="eb">The collection, in frames</span>` +
    `<h2 class="h2">${(COUNT[COLLECTION.length] ?? String(COLLECTION.length)).charAt(0)}${(COUNT[COLLECTION.length] ?? "").slice(1).toLowerCase()} estates, <span>drawn.</span></h2>` +
    '<p class="para">Open the frames and move through them: swipe, drag, or use the arrow keys. Every frame leads to its estate.</p></div>' +
    GALLERY("gal-home", "The collection, in frames", COLLECTION.map((c) => ({ pal: c.pal, hour: c.hour, t: c.name.replace(/<[^>]+>/g, ""), line: `${c.line} · ${c.spec}`, href: c.href }))) +
    "</section>" +
    '<section class="next"><div class="center gut"><h2 class="h2">Next <span>estates</span></h2><p class="para mute">Named, surveyed, not yet open. Each will arrive with its own offering letter.</p></div><div class="rail">' +
    NEXT_ESTATES.map((n) => `${n.href ? `<a class="nc" href="${n.href}">` : '<article class="nc">'}<div class="im">${film(n.pal, n.hour)}</div><h4>${n.name}</h4><p>${n.line}</p>${n.href ? "</a>" : "</article>"}`).join("") + "</div></section>" +
    '<section class="makers"><div class="trio">' +
    TRIO.map((t) => `<figure><svg viewBox="0 0 200 200" aria-hidden="true">${inkify(t.svg)}</svg><figcaption><b>${t.name}</b><span>${t.sub}</span></figcaption></figure>`).join("") +
    '</div><div><span class="eb">Built as a system</span><h2 class="h2">Three chassis. <span>Every estate.</span></h2></div>' +
    '<div><p class="para">Each estate is assembled from the same three architectural systems: one on the ground, one lifted to the horizon, one opened into volume. The land changes; the standard does not. That is how a small place can be built as carefully the tenth time as the first.</p>' +
    '<a class="btn gray" href="/collection/slowspace-solace#concept">See them at Solace</a></div></section>' +
    `<section class="fullbleed">${film("creek", 20.5, { rain: true })}<div class="cap"><span class="eb">Run by our operating partner</span>` +
    '<h2 class="h2">You own it. <span>Nobody asks you to run it.</span></h2><p class="para">Sensory Getaways operates every estate under a Commercial Services Agreement, measured on service levels and paid from the first stage of the waterfall. Partners decide; the operator delivers.</p>' +
    '<a class="btn" href="/how-it-works">How it works</a></div></section>' +
    '<section class="news"><div class="center gut"><h2 class="h2">From the <span>Journal</span></h2></div><div class="rail">' +
    journal.map((j) => `<article class="nw"><h4>${j.e!.title}</h4><div class="im">${film(j.pal, j.hour, { bp: j.bp })}</div><div class="ft"><span class="eb">${KIND_LABEL[j.e!.kind]} · ${j.e!.minutes} min</span><a class="btn gray" href="/journal/${j.slug}">Read</a></div></article>`).join("") +
    "</div></section>" +
    (pack
      ? `<section class="pack"><div class="col">${film("creek", 12, { bp: true })}</div><div class="tx"><span class="eb">The offering pack</span>` +
        `<h2 class="h2 h2-s">Get the <span>${esc(pack.vehicle.propertyName)} offering pack</span></h2>` +
        `<p class="para dim">The drawings, the structure of ${esc(pack.vehicle.registeredName)}, the waterfall and the risk disclosure, in one document. Sent after a short qualification.</p>` +
        `<div><a class="btn lead" href="/collection/${pack.vehicle.slug}/enquire">Request the pack ${NE}</a></div></div></section>`
      : "") +
    '<section class="who"><div><span class="eb">Who we are</span><p class="q"><b>You own.</b> We steward.<br>You decide.</p></div>' + // vocab-lint-ignore — ratified brand line, L1-02 §514
    '<div><p class="para">Getaway Collective is an investment platform for collective ownership of exceptional retreats in India. We structure each estate as its own LLP, govern it on behalf of its partners, and hold no equity in any of them. We are builders, not brokers.</p><a class="btn dark" href="/about">Learn more</a></div></section>';
  return <Mount html={html} />;
}

/**
 * THE ESTATES SIDE BY SIDE — Digital Visuals · Capital_portfolio, 25 Sep 2026
 *
 * The draft's comparison matrix, kept; its figures, not. Every cell is read
 * from the vehicle register through read(), so a column says exactly what
 * that estate's own page says, and an offering that is not yet published
 * says so rather than showing a number. No return, yield or rate appears.
 */
type Group = "raising" | "subscribed" | "later";
const GROUP_ORDER: Readonly<Record<Group, number>> = { raising: 0, subscribed: 1, later: 2 };
/** Where an estate stands, for grouping: the register's status where it is a vehicle. */
function groupOf(key: string | null): Group {
  const v = vehicleOf(key);
  if (!v) return "later";
  const st = read(v).status;
  return st === "RAISING" ? "raising" : st === "FULLY SUBSCRIBED" ? "subscribed" : "later";
}
const enquireHref = (slug: string) => `/collection/${slug}/enquire`;
const NEXT_STEP: Readonly<Record<Group, string>> = { raising: "Hold a unit", subscribed: "Join the waitlist", later: "Register interest" };

function compareHTML(): string {
  const cols = COLLECTION.flatMap((e) => {
    const v = vehicleOf(e.vehicleKey);
    return v ? [{ e, v, R: read(v), g: groupOf(e.vehicleKey) }] : [];
  }).sort((a, b) => GROUP_ORDER[a.g] - GROUP_ORDER[b.g]);
  if (cols.length < 2) return "";
  const gap = (s: string) => `<span class="ab">${s}</span>`;
  type Col = (typeof cols)[number];
  /* [measure, cell, where the cell's figure comes from] — see registry.ts src(). */
  const rows: [string, (c: Col) => string, (c: Col) => Prov | undefined][] = [
    ["Place", (c) => esc(c.v.jurisdiction), (c) => c.R.prov.intake],
    ["Keys", (c) => String(c.v.keys), (c) => c.R.prov.intake],
    ["Land", (c) => esc(c.v.landArea), (c) => c.R.prov.intake],
    ["Stage", (c) => c.R.status.charAt(0) + c.R.status.slice(1).toLowerCase(), (c) => c.R.prov.derived],
    ["Units", (c) => (c.R.publishable ? `${c.v.offering.available} of ${c.v.offering.units} available` : gap("Figures being confirmed")), (c) => (c.R.publishable ? c.R.prov.derived : undefined)],
    ["A unit", (c) => (c.R.publishable ? rupees(c.v.offering.unitPrice) : gap("Not yet priced")), (c) => (c.R.publishable ? c.R.prov.intake : undefined)],
    ["Lock-in", (c) => (c.R.publishable ? esc(c.v.offering.lockIn) : gap("Set in the offering letter")), (c) => (c.R.publishable ? c.R.prov.intake : undefined)],
    ["Held by", (c) => esc(c.v.registeredName), (c) => c.R.prov.intake],
  ];
  return '<section class="cmp" id="compare"><span class="eb">Compare</span><h2 class="h2">The estates, <span>side by side.</span></h2>' +
    '<p class="para dim">Every figure is read from each estate\'s own record. Capital is at risk; the offering letter governs.</p>' +
    `<div class="cmp-wrap" tabindex="0" role="region" aria-label="The estates compared"><table class="cmp-t"><thead><tr><th scope="col"><span class="sr">Measure</span></th>${cols.map((c) =>
      `<th scope="col" class="g-${c.g}"><span class="cmp-st">${c.R.status.charAt(0) + c.R.status.slice(1).toLowerCase()}</span><a href="${c.e.href}">${c.e.name}</a></th>`).join("")}</tr></thead>` +
    `<tbody>${rows.map(([k, f, p]) => `<tr><th scope="row">${k}</th>${cols.map((c) => `<td class="g-${c.g}"><span${src(p(c))}>${f(c)}</span></td>`).join("")}</tr>`).join("")}` +
    `<tr class="cmp-go"><th scope="row">Next step</th>${cols.map((c) => `<td class="g-${c.g}"><a class="btn ${c.g === "raising" ? "lead" : "gray"}" href="${enquireHref(c.v.slug)}${c.g === "raising" ? "#hold" : ""}">${NEXT_STEP[c.g]}</a></td>`).join("")}</tr>` +
    `</tbody></table></div>` +
    '<p class="mono cmp-note">Tap a figure for where it comes from and how far it can be relied on.</p></section>';
}

// ── the collection ──
export function SiteCollection() {
  const price = (key: string | null, fallback: string) => {
    const v = vehicleOf(key);
    if (!v) return fallback;
    const R = read(v);
    return `${R.price[0]} <span>· ${R.price[1]}</span>`;
  };
  const stage = (key: string | null, s: "open" | "pipe") => {
    const v = vehicleOf(key);
    return v ? read(v).status : s === "pipe" ? "PIPELINE" : "IN DELIVERY";
  };
  /* 25 Sep 2026, founder: "how to see the properties that are the only
     ones raising funds; completed ones should be separate too". The grid
     now opens on what is raising, with the subscribed and the not-yet-open
     each on their own tab, counted. Where an estate stands comes from the
     register (read().status), never from the card's own copy. */
  const counts = { raising: 0, subscribed: 0, later: 0 };
  const cards = COLLECTION.map((e) => {
    const g = groupOf(e.vehicleKey);
    counts[g]++;
    return { e, g, st: stage(e.vehicleKey, e.stage) };
  });
  const tabs: readonly (readonly [Group | "all", string])[] = [
    ["raising", "Raising now"], ["subscribed", "Fully subscribed"], ["later", "Not yet open"], ["all", "All"],
  ];
  const open: Group | "all" = counts.raising ? "raising" : "all";
  const html =
    '<div class="col-head"><h1>Our estates</h1></div>' +
    '<div class="filters"><div class="fl" role="group" aria-label="Filter"><span class="fl-l">Filters:</span><button type="button" aria-pressed="true" data-f="all">All</button><button type="button" aria-pressed="false" data-f="coast">Coast</button><button type="button" aria-pressed="false" data-f="hills">Hills</button><button type="button" aria-pressed="false" data-f="coffee">Coffee country</button></div><span class="fl-sort">Sort: by stage</span></div>' +
    `<div class="subtabs" role="tablist" aria-label="Where each estate stands">${tabs.map(([k, label]) => {
      const n = k === "all" ? cards.length : counts[k];
      return `<button role="tab" aria-selected="${k === open}" data-s="${k}"${n ? "" : " disabled"}>${label} <span class="n">${n}</span></button>`;
    }).join("")}</div>` +
    '<section class="short" data-shortlist hidden aria-label="Your shortlist"></section>' +
    '<div class="cgrid" id="cgrid">' + cards.map(({ e, g, st }) =>
      `<a class="cc cc-${g}" href="${e.href}" data-f="${e.region}" data-s="${g}"${open !== "all" && g !== open ? " hidden" : ""}><div class="im">${film(e.pal, e.hour)}<span class="st st-${g}">${st}</span></div>` +
      `<h3>${e.name}</h3><p>${e.line}</p><p>${e.spec}</p><p class="pr">${price(e.vehicleKey, e.fallback)}</p></a>`,
    ).join("") + "</div>" +
    `<section class="mk">${film("solace", 17.8)}<div class="cap"><span class="eb">Take the next step</span><h2 class="h2">Make one <span>yours.</span></h2><p class="para dim">Talk to Investor Relations, or start qualification. Every conversation about capital continues in writing.</p><div><a class="btn" href="/contact">Make an enquiry</a></div></div></section>` +
    '<section class="ben"><div class="l"><h2 class="h2 h2-s">Three things <span>that are different here</span></h2><p class="para dim">Most ways to own a retreat sell nights. This one governs an asset.</p><div><a class="btn" href="#faq">Read the questions</a></div></div>' +
    '<div class="r"><div><span class="sq"><svg aria-hidden="true"><use href="#i-unit"/></svg></span><div><h4>Hold only what you need</h4><p>Each estate is divided into units in its own LLP, priced in its offering letter. A partner holds from one unit upward.</p></div></div>' +
    '<div><span class="sq"><svg aria-hidden="true"><use href="#i-gov"/></svg></span><div><h4>Governed, never held</h4><p>Getaway Collective holds no equity in any estate and is paid from one disclosed stage of the waterfall.</p></div></div>' +
    '<div><span class="sq"><svg aria-hidden="true"><use href="#i-net"/></svg></span><div><h4>One standard, many estates</h4><p>Every estate is built from the same three chassis and run by the same operating partner.</p></div></div></div></section>' +
    `<section class="col-stages"><span class="eb">Where each estate stands</span><h2 class="h2">One track, <span>every estate.</span></h2>${daHTML("stages")}</section>` +
    compareHTML() +
    `<section class="faq" id="faq"><h2 class="h2">Frequently asked <span>questions</span></h2>${faqHTML(FAQ)}</section>`;
  return <Mount html={html} light />;
}

// ── an estate, or a pipeline page, at /collection/[vehicle] ──
export function SiteEstate({ slug }: { slug: string }) {
  const E = estateBySlug(slug);
  if (E) {
    const v = vehicleOf(E.vehicleKey);
    const R = v ? read(v) : undefined;
    const faq = faqHTML([...(FAQX[E.key] ?? []), ...FAQ], R?.tokens);
    return <Mount html={PROP(E, R, faq)} />;
  }
  const P = pageByPath(`/collection/${slug}`);
  if (P) return <Mount html={TXT(P)} light={!!P.light} />;
  notFound();
}

// ── a text page chosen by path ──
export function SiteText({ path }: { path: string }) {
  const P = pageByPath(path);
  if (!P) notFound();
  return <Mount html={TXT(P)} light={!!P.light} />;
}

// ── the Journal, from content/journal.ts ──
const FILMS: Readonly<Record<string, readonly [string, number, number?, number?][]>> = {
  ground: [["coast", 17], ["creek", 12, 1], ["solace", 20]], mechanism: [["cff", 12, 0, 1], ["nine", 9]],
  decision: [["solace", 8], ["wild", 19]], record: [["coast", 9]],
};
const kindOrder = new Map<string, number>();
const filmFor = (slug: string, kind: string) => {
  const list = FILMS[kind] ?? FILMS.decision;
  const i = JOURNAL.filter((e) => e.kind === kind).findIndex((e) => e.slug === slug);
  void kindOrder;
  return list[Math.max(0, i) % list.length];
};
function route(p: string) {
  const m = p.match(/journal\/([a-z0-9-]+)/);
  if (m) return `/journal/${m[1]}`;
  if (/^\/legal\//.test(p)) return p.replace(/#.*$/, "");
  if (/how-it-works|structure|time|space/.test(p)) return "/how-it-works";
  const v = p.match(/collection\/([a-z0-9-]+)/);
  if (v) return `/collection/${v[1]}`;
  return /collection|invest/.test(p) ? "/collection" : "/journal";
}

export function SiteJournalIndex() {
  const cards = JOURNAL.slice().reverse().map((e) => ({ id: e.id, key: e.slug, kind: e.kind, title: e.title, standfirst: e.standfirst, date: e.published, dateLabel: longDate(e.published), minutes: e.minutes }));
  const P: SitePage = {
    key: "journal", path: "/journal", light: 1, eyebrow: "The Journal", title: "Notes from <span>the collective.</span>", lead: "One decision an entry, with what it cost. Every figure quoted here comes from the same record the platform itself runs on.",
    blocks: [
      { jcards: cards, kinds: KIND_LABEL },
      { h: "The Signal" }, { p: "The Journal arrives once a week as The Signal. No tracking pixel, and the list is never sold." },
      { links: [["Subscribe to The Signal", "/signal", "dark"]] },
    ],
  };
  return <Mount html={TXT(P)} light />;
}

export function SiteJournalEntry({ slug }: { slug: string }) {
  const e = JOURNAL.find((x) => x.slug === slug);
  if (!e) notFound();
  /* The entry's own text, in its own order, with the site's reading aids
     laid around it (content/site/journal-extras.ts): a contents strip, a
     lede, its figures pulled out, one sentence of its own set large, a
     drawing of numbers it states, and one line from somebody else. */
  const x = JOURNAL_EXTRAS[e.slug];
  const headings = e.body.filter((b) => b.t === "h").map((b) => (b as { x: string }).x);
  const anchor = (i: number) => `s-${i + 1}`;
  const blocks: Block[] = [];
  if (headings.length > 1) blocks.push({ toc: headings.map((t, i) => [anchor(i), t]) });
  if (x?.facts) blocks.push({ figs: x.facts });
  let hi = -1, pulled = false, drawn = false, firstP = true;
  const place = () => {
    if (x && !drawn && hi === x.graphicAfter) { blocks.push({ html: graphicHTML(x.graphic, headings) }); drawn = true; }
  };
  if (x && x.graphicAfter === -1 && x.graphic.kind !== "weekends" && x.graphic.kind !== "rain" && x.graphic.kind !== "nots") place();
  for (const b of e.body) {
    if (b.t === "p") {
      blocks.push(firstP ? { lede: b.x } : { p: b.x });
      firstP = false;
      if (x?.graphic.kind === "nots" && !drawn) { blocks.push({ html: graphicHTML(x.graphic, headings) }); drawn = true; }
    } else if (b.t === "h") {
      place();
      hi++;
      if (x && !pulled && hi === Math.max(1, Math.floor(headings.length / 2))) { blocks.push({ pull: x.pull }); pulled = true; }
      blocks.push({ h: b.x, id: anchor(hi) });
    }
    else if (b.t === "list") blocks.push({ list: b.x });
    else if (b.t === "assert") blocks.push({ assert: b.x });
    else if (b.t === "figure") blocks.push({ rows: [[b.label, b.value]] });
    if (x && !drawn && x.graphicAfter === -1 && (x.graphic.kind === "weekends" || x.graphic.kind === "rain") && b.t === "p" && blocks.filter((k) => k.p || k.lede).length === 2) {
      blocks.push({ html: graphicHTML(x.graphic, headings) }); drawn = true;
    }
  }
  place();
  if (x && !drawn) blocks.push({ html: graphicHTML(x.graphic, headings) });
  if (x && !pulled) blocks.push({ pull: x.pull });
  if (x) blocks.push({ inspire: x.quote });
  if (e.onward?.length) {
    blocks.push({ h: "Read next" });
    blocks.push({ rows: e.onward.map((o) => [`<a class="tx-u" href="${route(o.path)}">${o.title}</a>`, o.why]) });
  }
  blocks.push({ links: [["Back to the Journal", "/journal"], ["Subscribe to The Signal", "/signal", "lead"]] });
  const f = filmFor(e.slug, e.kind);
  /* The estate this entry leads to, when its onward list names one; the
     collection otherwise. Read from the entry, never assigned by hand. */
  const toEstate = (e.onward ?? []).map((o) => o.path.match(/^\/collection\/([a-z0-9-]+)/)?.[1]).find(Boolean);
  const est = toEstate ? estateBySlug(toEstate) : undefined;
  const next: NextStep = est
    ? { stage: "Examine", title: est.name.replace(/<[^>]+>/g, ""), text: "The estate this entry is about: its place, its drawings and its offering.", href: `/collection/${est.slug}` }
    : { stage: "Examine", title: "The estates", text: "Every estate, where it stands, side by side.", href: "/collection" };
  const P: SitePage = {
    key: `j-${e.slug}`, path: `/journal/${e.slug}`, eyebrow: `Journal · ${KIND_LABEL[e.kind]} · ${e.minutes} min`, title: e.title,
    film: [f[0], f[1], f[2], f[3]], meta: `PUBLISHED ${longDate(e.published).toUpperCase()}`, lead: e.standfirst, blocks, next,
  };
  return <Mount html={TXT(P)} />;
}

// ── how to qualify: what you get, three steps, and the same sum four ways ──
/**
 * 25 Sep 2026, rewritten the same day on the founder's brief: the page read
 * as a list of hurdles ("Sixteen stages, readable before you begin") when
 * what a reader wants first is what ownership gives them and how little
 * stands in the way. It now leads with that, in three steps, and puts the
 * returns calculator (./calc.ts) where the decision is made.
 *
 * Nothing was taken away. The sixteen stages are still here, folded, read
 * from the passport's own table so the page and the stage pages cannot
 * describe different processes. The accreditation criteria are still not
 * stated: they are shown in full at review, and the threshold is the
 * founder's. Every estate figure is the register's, with its basis.
 */
/* 25 Sep 2026, founder: KYC is a parallel process, the last step of becoming
   a partner, never a hurdle. So the stages are shown as two tracks: the path
   (which opens the offering) and KYC alongside it, completing before the LLP
   agreement is signed. The stage table itself is unchanged. */
const KYC_STAGES = new Set(["identity", "address", "tax-residency", "source-of-funds", "documents", "screening"]);

/** The estates the calculator can show: those whose yield the site already publishes, open ones first. */
function calcEstates(): CalcEstate[] {
  const R = (m: bigint) => Number(m / 10000n);
  return VEHICLES.map((v, n) => ({ v, p: PROPERTIES[n] }))
    .filter(({ p }) => p.yield.conf !== "UNKNOWN" && p.yield.v > 0 && p.yieldBasis)
    .map(({ v, p }) => ({
      key: v.key,
      name: plainName(Object.values(ESTATES).find((e) => e.vehicleKey === v.key)?.name) || v.propertyName,
      unitPrice: R(v.offering.unitPrice),
      maxUnits: v.offering.available > 0 ? v.offering.available : v.offering.units,
      yieldPct: p.yield.v, yieldClass: String(p.yield.conf), basis: p.yieldBasis!, fromYear: 3,
      equity: R(v.offering.totalEquity),
      poolMin: v.entitlement?.nightPoolMin ?? 0, poolMax: v.entitlement?.nightPoolMax ?? 0,
      nightly: R(v.operating.adr),
      status: v.offering.available > 0 ? "open, raising" : "fully subscribed, waitlist",
    }))
    .sort((a, b) => Number(b.status.startsWith("open")) - Number(a.status.startsWith("open")));
}
const plainName = (s: string | undefined) => (s ?? "").replace(/<[^>]+>/g, "").trim();

export function SiteQualify() {
  const S = PASSPORT_STAGES;
  const estates = calcEstates();
  const lead = estates[0];
  const one = lead ? simulate({ estate: lead, units: 1, ...CALC_DEFAULTS, countNights: true }) : null;
  const deposit = VEHICLES.find((v) => v.offering.available > 0 && v.offering.deposit)?.offering.deposit;
  const hold = deposit ? rupeesFull(deposit) : null;

  const tile = (t: string, p: string) => `<div class="own-tile"><h3>${t}</h3><p>${p}</p></div>`;
  const track = (rows: typeof S, mark: (i: number) => string) => `<ol class="tx-steps">${rows.map((r, i) =>
    `<li><em>${mark(i)}</em><div><h3>${esc(r.t)}</h3><p>${esc(r.what)}</p>${r.note ? `<p class="tx-assert">${esc(r.note)}</p>` : ""}</div></li>`).join("")}</ol>`;
  const stagesHTML =
    `<h3 class="tx-h3">The path, in order</h3>${track(S.filter((r) => !KYC_STAGES.has(r.slug)), (i) => String(i + 1).padStart(2, "0"))}` +
    `<h3 class="tx-h3">KYC, alongside: any time, complete before you sign</h3>${track(S.filter((r) => KYC_STAGES.has(r.slug)), (i) => `K${i + 1}`)}`;

  const blocks: Block[] = [
    { figs: [["0", "documents needed to sign in"], ["3", "steps from here to owning"], ["0", "commitments made by signing in"], ...(hold ? [[hold, "holds your units, refundable until you sign"]] : [])] },
    { h: "What you own" },
    { html: `<div class="own-tiles">` +
      tile("A share of a real place", "Your units are a share of the partnership that holds the land and the buildings, registered in its own name.") +
      tile("Nights of your own", lead && one ? `The estate's nights each year are shared by equity. One unit at ${esc(lead.name)} is about ${one.nightsPerYear[0]} to ${one.nightsPerYear[1]} nights a year, from handover.` : "The estate's nights each year are shared among its partners by equity, from handover.") +
      tile("Income, modelled", lead ? `Distributions follow the waterfall. At ${esc(lead.name)} the modelled yield is ${lead.yieldPct}% a year, ${lead.yieldClass.toLowerCase()}, ${esc(lead.basis)}. Not promised.` : "Distributions follow the waterfall, from stabilised occupancy. Not promised.") +
      tile("Nothing to run", "The operating partner runs every estate day to day, measured on service levels and paid from the waterfall. You decide; it delivers.") +
      tile("A vote", "The partners decide the matters that matter, each vote weighted by equity.") +
      `</div>` },
    { h: "Three steps" },
    { steps: [
      ["Sign in, and look", "One email address: no password, no documents, nothing to pass. Every estate, its drawings and its figures are open to you. A short suitability questionnaire opens the full offering documents, with a decision within 15 working days."],
      ["Hold your units", `Hold your units online${hold ? ` with a ${hold} deposit` : ""}. It is refundable in full until you sign the LLP agreement.`],
      ["KYC alongside, then sign", "Identity checks run in parallel, at your pace, from the day you sign in. They complete before you sign the LLP agreement and settle your units. Then you are a partner: you vote, you receive distributions when there are any, and your nights begin at handover."],
    ] },
    { p: "Why there are checks at all: partners own real land together, and the law requires the partnership to know who each of them is before they become one. That is why KYC is the last step, not the first. It never stands between you and the estates." },
    { links: [["Sign in or begin", "/sign-in", "lead"], ["See the collection", "/collection"]] },
    { h: "What your money does, <span>four ways</span>", id: "calculator" },
    { p: "The same sum, over the same years, in an estate, an apartment you let out, a fixed deposit and an equity SIP. Move the sliders; change the assumptions to your own. Only one of the four is also a place you can spend your time." },
    { html: calcHTML(estates) },
    { html: fourWaysHTML() },
    { assert: "An estate is not a deposit. Your capital is at risk and no return is guaranteed by any party; every estate figure here is modelled from its register and stated with its basis. Figures are before tax. Read the Risk Factors before you decide." },
    { h: "Every stage, in full" },
    { html: `<details class="tx-fold"><summary>Read every stage: the path, and KYC alongside it</summary>${stagesHTML}</details>` },
    { h: "What happens to what you enter" },
    { p: "The Privacy Notice states what is collected, why, who sees it and how long it is kept. Accreditation and screening records, for example, are kept for eight years after the relationship ends, as the law requires." },
    { links: [["Sign in or begin", "/sign-in", "lead"], ["Risk factors", "/legal/risk-disclosure"], ["Privacy Notice", "/legal/privacy"], ["Answers", "/answers"]] },
  ];
  const P: SitePage = {
    key: "qualify", path: "/how-to-qualify", light: 1, eyebrow: "How to qualify",
    title: "Own a retreat <span>in three steps.</span>",
    lead: "Sign in with one email and look at everything. Hold your units with a refundable deposit. KYC runs alongside and completes before you sign; then a share of the place is yours, with nights of your own every year.",
    blocks,
  };
  return <Mount html={TXT(P)} light />;
}

// ── careers: the two roles, as a docket (content/site/careers.ts) ──
export function SiteCareers() {
  const blocks: Block[] = [
    { lede: "Getaway Collective runs as two roles, kept apart on purpose. One holds the capital and governs; the other runs the estates and carries the brands. Everything the company does belongs to one of them." },
    { h: "The two roles" },
    { html: DOCKET("roles", "The two roles", ROLES.map((r) => ({
      label: r.label, eyebrow: r.holder, title: r.title, stamp: r.stamp, purpose: r.purpose,
      lists: [{ h: "What the role holds", items: r.holds }, { h: "Orientation", items: [r.orientation] }],
    }))) },
    { h: "Why two, and not one" },
    { gates: { id: "why", label: "Why the company is two roles", items: WHY.map((w) => ({ t: w.t, sub: w.sub, text: w.text })) } },
    { links: [["The Terms", "/legal/terms"], ["The operating partner", "/operating-partner"]] },
    { h: "How to apply" },
    { p: `Write to <span class="mono sel">${esc(APPLY.address)}</span>. ${esc(APPLY.ask)}` },
  ];
  const P: SitePage = {
    key: "careers", path: "/careers", light: 1, eyebrow: "Careers",
    title: "Two roles. <span>One company.</span>",
    lead: "The work of Getaway Collective, divided the way the company is: capital and governance on one side, operations and brand on the other.",
    blocks,
  };
  return <Mount html={TXT(P)} light />;
}

// ── the operating partner, from content/public.ts (PUB.06) ──
/**
 * 25 Sep 2026. "The Invisible Hand" was written, ratified and never given
 * a route. Rendered from its record, so a holder or a date changes in one
 * place. The ledger names the holder only where the engagement is recorded.
 */
const DAY = (iso: string) => longDate(iso);
export function SiteOperator() {
  const O = OPERATORS;
  const blocks: Block[] = [{ lede: O.standfirst }];
  for (const pane of O.panes) {
    blocks.push({ h: pane.title });
    if (pane.lede) blocks.push({ p: pane.lede });
    for (const b of pane.body ?? []) blocks.push({ p: b });
    if (pane.ledger) blocks.push({ rows: pane.ledger.map((l) => [
      `<span class="mono">${esc(l.ref)}</span> · ${esc(l.role)}`,
      `${esc(l.what)}<span class="tx-src tx-src-in">${l.holder ? `${esc(l.holder)} · ` : ""}${esc(l.state)}${l.since ? ` since ${DAY(l.since)}` : ""}</span>`,
      l.holder ? "" : 1,
    ]) });
    if (pane.note) blocks.push({ p: pane.note });
    if (pane.cta) blocks.push({ links: [[pane.cta.label, pane.cta.href, "dark"]] });
  }
  blocks.push({ links: [["How it works", "/how-it-works"], ["The collection", "/collection"]] });
  const P: SitePage = {
    key: "operator", path: "/operating-partner", light: 1, eyebrow: "The operating partner",
    title: "The invisible <span>hand.</span>",
    lead: "Who runs each estate day to day, how that is measured and paid, and what happens when it fails.",
    blocks,
  };
  return <Mount html={TXT(P)} light />;
}

// ── the legal corpus, from content/legal.ts, in full ──
export function SiteLegalIndex() {
  const P: SitePage = {
    key: "legal", path: "/legal", light: 1, eyebrow: "Legal", title: "The documents, <span>in full.</span>",
    lead: "Every standing document this platform publishes. Each is stated once, here, and nothing else on the site paraphrases it.",
    /* The standing documents as one docket (./docket.ts): a tab each, its parts listed, the full text a click away. */
    blocks: [{ html: rulebookDocket() }],
  };
  return <Mount html={TXT(P)} light />;
}

export function SiteLegalDoc({ document }: { document: string }) {
  const d = DOCUMENTS.find((x) => x.path === `/legal/${document}`);
  if (!d) notFound();
  const blocks: Block[] = [];
  for (const part of d.parts) {
    blocks.push({ h: `Part ${esc(part.ref)} · ${esc(part.title)}` });
    if (part.intro) blocks.push({ p: esc(part.intro) });
    for (const c of part.clauses ?? []) {
      const body = [...(c.p ?? []).map((x) => `<p>${esc(x)}</p>`), c.list ? `<ul>${c.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""].join("");
      blocks.push({ legal: `<span class="mono cl-n">${esc(c.n)}</span>${c.h ? `<h3>${esc(c.h)}</h3>` : ""}${body}`, assertion: !!c.assertion, anchor: `c-${c.n}` });
    }
  }
  if (d.alongside?.length) {
    blocks.push({ h: "Read alongside" });
    blocks.push({ rows: d.alongside.map((x) => [`<a class="tx-u tx-strong" href="${x.path}">${esc(x.title)}</a>`, esc(x.why)]) });
  }
  blocks.push({ links: [["All documents", "/legal"], ["Enquire", "/contact"]] });
  const P: SitePage = {
    key: `legal-${document}`, path: d.path, light: 1, eyebrow: `Legal · version ${d.version} · effective ${d.effective}`, title: esc(d.title), lead: esc(d.purpose), blocks,
  };
  return <Mount html={TXT(P)} light />;
}

// ── /collection/[vehicle]/investment · /risk · /enquire ──
export function SiteChapter({ path, param }: { path: string; param: string }) {
  const v = vehicleBySlug(param);
  const E = estateBySlug(param);
  if (!v) notFound();
  const id = path.split("/").pop() as ChapterId;
  const c = chapterContent(v, id);
  /* The chapter copy cites its conflict register ("C-02: ...") for the
     office; a reader needs the sentence, not the filing number. */
  const plain = (t: string) => {
    const s = t.replace(/\b[A-Z]{1,3}-\d{2}[a-z]?:\s*/g, "").replace(/\s*\((?:[A-Z]{1,3}-\d{2}[a-z]?(?:,\s*)?)+\)/g, "");
    return /^(?:\s*[A-Z]{1,3}-\d{2}[a-z]?\s*·?)+$/.test(s) ? "Each is on the estate's record, with what will close it." : s;
  };
  const name = E?.name ?? v.propertyName;
  const blocks: Block[] = [];
  if (c.rows.length) blocks.push({ rows: c.rows.map((r) => [esc(plain(r.label)), `${esc(plain(r.value))}${r.basis ? `<span class="tx-note">${esc(plain(r.basis))}</span>` : ""}`]) });
  if (c.withheld.length) { blocks.push({ h: "Withheld, and why" }); blocks.push({ list: c.withheld.map((w) => esc(plain(w))) }); }
  if (id === "enquire") {
    const R = read(v);
    if (R.stance.kind === "open" && v.offering.deposit !== null) {
      blocks.push({ h: "Hold a position" });
      blocks.push({ deposit: { vehicle: v.slug, payee: v.registeredName, amount: rupeesFull(v.offering.deposit), available: R.stance.unitsAvailable, unitPrice: rupees(v.offering.unitPrice) } });
      blocks.push({ h: "Or ask first" });
    }
    blocks.push({ h: R.stance.kind === "waitlist" ? "Join the waitlist" : "Request the offering pack" });
    blocks.push({ form: {
      id: `${v.key}-enq`, addr: "ir@getawaycollective.co",
      fields: [["Name", "text", "name"], ["Email", "email", "email"], ["City", "text", "address-level2"], ["Anything we should know", "area"]],
      submit: R.stance.kind === "waitlist" ? "Join the waitlist" : "Request the pack",
      ok: "Received. Investor Relations will write to you on the next working day. Nothing about capital is decided by email alone.",
      note: "Capital is at risk. Read the Risk Factors before committing.", to: "dossier", vehicle: v.slug,
    } });
  }
  blocks.push({ links: [[`Back to ${name}`, `/collection/${v.slug}`], ["Investment", `/collection/${v.slug}/investment`], ["Risk", `/collection/${v.slug}/risk`], ["Enquire", `/collection/${v.slug}/enquire`, "lead"]] });
  const P: SitePage = {
    key: `${v.key}-${id}`, path, eyebrow: `${esc(name)} · ${esc(c.eyebrow.replace(/^CHAPTER \d+ · /, ""))}`, title: esc(plain(c.title)), lead: esc(plain(c.lead)),
    film: E ? [E.pal, E.enquireHour || 18] : undefined, blocks,
  };
  return <Mount html={fill(TXT(P))} />;
}

/** The enquiry desk at /contact, with the prototype's form. */
export function SiteContact() {
  return <SiteText path="/contact" />;
}

export { FORM };
