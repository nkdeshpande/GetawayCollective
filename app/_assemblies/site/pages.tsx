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
import { vehicleBySlug } from "@/constants/vehicles";
import { chapterContent } from "../propertychapter";
import type { ChapterId } from "@/constants/property-chapters";
import { daHTML } from "../da/render";
import { FORM, NE, PROP, TXT, esc, faqHTML, film, fill, inkify } from "./render";
import { graphicHTML } from "./infographics";
import { JOURNAL_EXTRAS } from "@/content/site/journal-extras";
import { openReading, read, rupees, rupeesFull, vehicleOf } from "./registry";
import type { Block, NextStep, SitePage } from "./types";
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
function compareHTML(): string {
  const cols = COLLECTION.flatMap((e) => {
    const v = vehicleOf(e.vehicleKey);
    return v ? [{ e, v, R: read(v) }] : [];
  });
  if (cols.length < 2) return "";
  const gap = (s: string) => `<span class="ab">${s}</span>`;
  const rows: [string, (c: (typeof cols)[number]) => string][] = [
    ["Place", (c) => esc(c.v.jurisdiction)],
    ["Keys", (c) => String(c.v.keys)],
    ["Land", (c) => esc(c.v.landArea)],
    ["Stage", (c) => c.R.status.charAt(0) + c.R.status.slice(1).toLowerCase()],
    ["Units", (c) => (c.R.publishable ? `${c.v.offering.available} of ${c.v.offering.units} available` : gap("Record still being settled"))],
    ["A unit", (c) => (c.R.publishable ? rupees(c.v.offering.unitPrice) : gap("Not yet priced"))],
    ["Lock-in", (c) => (c.R.publishable ? esc(c.v.offering.lockIn) : gap("Stated in the offering letter"))],
    ["Held by", (c) => esc(c.v.registeredName)],
  ];
  return '<section class="cmp" id="compare"><span class="eb">Compare</span><h2 class="h2">The estates, <span>side by side.</span></h2>' +
    '<p class="para dim">Every figure is read from each estate\'s own register. Capital is at risk; the offering letter governs.</p>' +
    `<div class="cmp-wrap" tabindex="0" role="region" aria-label="The estates compared"><table class="cmp-t"><thead><tr><th scope="col"><span class="sr">Measure</span></th>${cols.map((c) => `<th scope="col"><a href="${c.e.href}">${c.e.name}</a></th>`).join("")}</tr></thead>` +
    `<tbody>${rows.map(([k, f]) => `<tr><th scope="row">${k}</th>${cols.map((c) => `<td>${f(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
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
  const html =
    '<div class="col-head"><h1>Our estates</h1></div>' +
    '<div class="filters"><div class="fl" role="group" aria-label="Filter"><span class="fl-l">Filters:</span><button type="button" aria-pressed="true" data-f="all">All</button><button type="button" aria-pressed="false" data-f="coast">Coast</button><button type="button" aria-pressed="false" data-f="hills">Hills</button><button type="button" aria-pressed="false" data-f="coffee">Coffee country</button></div><span class="fl-sort">Sort: by stage</span></div>' +
    '<div class="subtabs" role="tablist"><button role="tab" aria-selected="true" data-s="open">In delivery</button><button role="tab" aria-selected="false" data-s="pipe">Pipeline</button></div>' +
    '<div class="cgrid" id="cgrid">' + COLLECTION.map((e) => {
      const st = stage(e.vehicleKey, e.stage);
      const stageOf = e.vehicleKey === "wildwood" ? "pipe" : e.stage;
      return `<a class="cc" href="${e.href}" data-f="${e.region}" data-s="${stageOf}"><div class="im">${film(e.pal, e.hour)}<span class="st${st === "PIPELINE" || st === "FORMING" ? " dk" : ""}">${st}</span></div>` +
        `<h3>${e.name}</h3><p>${e.line}</p><p>${e.spec}</p><p class="pr">${price(e.vehicleKey, e.fallback)}</p></a>`;
    }).join("") + "</div>" +
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
    const faq = faqHTML([...FAQ, ...(FAQX[E.key] ?? [])], R?.tokens);
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

// ── how to qualify: the sixteen stages, read from the passport's own table ──
/**
 * 25 Sep 2026. The passport's sixteen stages existed only as unrouted
 * compositions, so a stranger could not see what accreditation asks until
 * they had signed in to start it. This reads the same rows the stage pages
 * are built from, so the two cannot describe different processes. It starts
 * nothing and collects nothing. The accreditation criteria are not stated:
 * they are shown in full at review, and the threshold is the founder's.
 */
const PHASES: readonly (readonly [string, number, number])[] = [
  ["Before you begin", 1, 2], ["Who you are", 3, 6], ["Whether it fits", 7, 11], ["The decision, and after", 12, 16],
];
export function SiteQualify() {
  const S = PASSPORT_STAGES;
  const blocks: Block[] = [
    { figs: [[String(S.length), "stages, in order"], ["0", "commitments made by qualifying"], ["15", "working days to a decision, from submission"]] },
    { p: "Every stage saves as you leave it, so nothing has to be done in one sitting. Qualifying lets you examine an offering in full; it buys nothing and commits you to nothing." },
  ];
  for (const [h, a, z] of PHASES) {
    const rows = S.filter((r) => r.n >= a && r.n <= z);
    blocks.push({ h }, { steps: rows.map((r) => [r.t, r.what]), stepsFrom: a });
    for (const r of rows) if (r.note) blocks.push({ assert: r.note });
  }
  blocks.push(
    { h: "What happens to what you enter" },
    { p: "The Privacy Notice states what is collected, why, who sees it and how long it is kept. Accreditation and screening records, for example, are kept for eight years after the relationship ends, as the law requires." },
    { links: [["Begin qualification", "/invest/qualify", "lead"], ["Privacy Notice", "/legal/privacy"], ["Risk factors", "/legal/risk-disclosure"], ["Answers", "/answers"]] },
  );
  const P: SitePage = {
    key: "qualify", path: "/how-to-qualify", light: 1, eyebrow: "How to qualify",
    title: "Sixteen stages, <span>readable before you begin.</span>",
    lead: "What accreditation asks, in the order it asks it. Anyone may read this; nothing on this page starts an application.",
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
    blocks: [{ rows: DOCUMENTS.map((d) => [`<a class="tx-u tx-strong" href="${d.path}">${esc(d.title)}</a>`, `${esc(d.purpose)}<span class="tx-src tx-src-in">Version ${d.version} · effective ${d.effective}</span>`]) }],
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
