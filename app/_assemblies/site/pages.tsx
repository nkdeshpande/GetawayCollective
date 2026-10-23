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
import { COLLECTION, FAQ, HOME_JOURNAL, HOME_STACK, MANIFESTO, NEXT_ESTATES, TRIO, type CollectionEstate } from "@/content/site/home";
import { JOURNAL, KIND_LABEL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";
import { VEHICLES, vehicleBySlug } from "@/constants/vehicles";
import { PROPERTIES } from "../data";
import { type CalcEstate } from "./calc";
import { chapterContent } from "../propertychapter";
import type { ChapterId } from "@/constants/property-chapters";
import { daHTML } from "../da/render";
import { FORM, NE, PROP, TXT, esc, faqHTML, film, fill, inkify, plate } from "./render";
import { graphicHTML } from "./infographics";
import { JOURNAL_EXTRAS } from "@/content/site/journal-extras";
import { fundingComplete, heldBy, landPublic, openReading, ownershipPrivate, publicName, read, rupees, rupeesFull, src, vehicleOf, type Prov } from "./registry";
import type { Block, NextStep, SitePage } from "./types";
import { DOCKET, rulebookDocket } from "./docket";
import { APPLY, ROLES, WHY } from "@/content/site/careers";
import { PASSPORT_STAGES } from "@/content/compositions/passport";
import { OPERATORS } from "@/content/public";
import { toPublic } from "@/constants/estate-urls";

function Mount({ html, light = false }: { html: string; light?: boolean }) {
  return <div className={`pg${light ? " pg-col" : ""}`} dangerouslySetInnerHTML={{ __html: toPublic(html) }} />;
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
/**
 * THE HOME PAGE, IN ORDER — 28 Sep 2026
 *
 * One rhythm, top to bottom: who we are, what owning means, four estates
 * up close, all seven in frames, the three still to come, how the estates
 * are built and run, then the Journal and the offering pack. The hero now
 * says what is being offered in one line and gives one action, with a
 * quieter second for someone who wants the mechanics first.
 *
 * The four featured estates no longer pin to the screen one over another:
 * a pinned sequence holds the reader in place until it has played.
 */
export function SiteHome() {
  const pack = openReading();
  const journal = HOME_JOURNAL.map((j) => ({ ...j, e: JOURNAL.find((x) => x.slug === j.slug) })).filter((j) => j.e);
  const N = COUNT[COLLECTION.length] ?? String(COLLECTION.length);
  const Nw = N.charAt(0) + N.slice(1).toLowerCase();
  /* Where an estate stands: availability and delivery, the register's where
     it is a vehicle. The featured estate that is not a vehicle is in
     delivery by the canon (_CANON/facts/properties.yaml, in_delivery). */
  const state = (key: string | null, href: string) => {
    const v = vehicleOf(key);
    if (!v) return `${fundingComplete(href.replace("/collection/", "")) ? "Funding complete" : "Not yet open for investment"} · In delivery`;
    const R = read(v);
    return `${R.availability} · ${R.delivery}`;
  };
  /* An estate's own picture, where it has one (content/site/media.ts); its drawn film otherwise. */
  const imgOf = (href: string) => COLLECTION.find((c) => c.href === href)?.img;
  /* Wave 1: the promoters' money in each estate, from its register; private estates omitted. */
  const stakes = VEHICLES.filter((v) => v.lifecycle !== "forming" && v.offering.promoter > 0n && !ownershipPrivate(v.slug)).map((v) =>
    `${esc(publicName(v))}: ${rupees(v.offering.promoter)} of ${rupees(v.offering.totalEquity)} of equity${v.offering.promoterIs ? ", as the land they bring" : ""}`).join("; ");
  const html =
    // ── who we are, and what is offered ──
    /* 15 Oct 2026 (audit, section 5): the first thing a visitor reads is what
       is offered, not the name, which the bar already carries. */
    /* 15 Oct 2026: the hero is a drawn film of one day on the coast, dusk to
       dusk, rendered to video (GC-14-FM-002). The poster is its first frame;
       behaviour.tsx loads and plays it only where motion is welcome and data
       is not being saved, so a still, a slow line or no script all see the
       poster. Drawn, not photographed, and tagged so. */
    '<section class="hero"><video class="film-vid" muted loop playsinline preload="none" poster="/images/site/hero/coast-day-poster.webp" ' +
    'data-film="/images/site/hero/coast-day-1280.mp4" data-film-wide="/images/site/hero/coast-day-1920.mp4" ' +
    'aria-label="Drawn film: one day on the coast, the sun crossing laterite cliffs above the Arabian Sea, and the lights of an unbuilt building at night"></video>' +
    '<span class="plate-tag hero-tag">Illustration · unbuilt</span>' +
    '<h1 class="hp">Own a share of <span>a retreat in India.</span></h1>' +
    '<div class="hero-foot"><span></span>' +
    '<div class="hero-own"><p>Each retreat is a single asset, held in its own LLP, and you are invited to join it as a partner. An operating partner runs the place. All of it belongs to its partners.</p>' +
    `<div class="hero-act"><a class="btn lead" href="/collection">Explore the collection ${NE}</a><a class="hero-link" href="/how-it-works">How ownership works</a><button type="button" class="hero-link hero-play" hidden>Play the film</button></div>` +
    '</div></div></section>' +
    /* The manifesto is read, not revealed a word at a time. */
    `<section class="mani mani-still"><p>${MANIFESTO}</p></section>` +
    /* The estate open now, told in a sentence or two, with where to read the rest. */
    /* Copy review R1, 20 Oct 2026: studios are where guests sleep and units are
       shares of ownership, so the line counts each once, from the register. */
    (pack ? (() => {
      const o = pack.vehicle.offering;
      const total = o.unitPrice > 0n ? Number(o.totalEquity / o.unitPrice) : o.units;
      const pct = total ? Math.round(10000 / total) / 100 : 0;
      const founders = o.promoterIs ? total - o.units : 0;
      const nowLine = COLLECTION.find((c) => c.href === `/collection/${pack.vehicle.slug}`)?.now;
      return `<section class="now"><div><span class="eb">Open now</span><h2 class="h2">${esc(pack.name)}</h2>` +
        `<p class="para">${esc(pack.name)} is open now${nowLine ? `: ${esc(nowLine)}` : ""}. Its LLP, ${esc(pack.vehicle.registeredName)}, is divided into ${total} units of ${pct}% each.` +
        `${founders > 0 ? ` The founders hold ${founders}, for the land they bring.` : ""} ${o.available} units are offered to new partners, at ${rupees(o.unitPrice)} each.` +
        `${pack.vehicle.llpin ? "" : " The LLP will be formed once all investment commitments are received."}</p>` +
        `<p class="now-act"><a class="btn lead" href="/collection/${pack.vehicle.slug}">Read about ${esc(pack.name)} ${NE}</a></p></div></section>`;
    })() : "") +
    // ── what owning means ──
    /* 15 Oct 2026: the estates' own pictures, where there were three drawn films. */
    `<section class="ref"><div>${plate("solace/mist", { sizes: "(max-width: 700px) 100vw, 34vw", tag: "none" })}</div><div>${plate("creek/water", { sizes: "(max-width: 700px) 100vw, 34vw", tag: "none" })}</div><div>${plate("cff/fire", { sizes: "(max-width: 700px) 100vw, 34vw", tag: "none" })}</div>` +
    '<div class="mid"><div><span class="eb">What you own</span><b>ONE ESTATE, ONE LLP</b><p class="para para-s">Units in the partnership that owns the land and the buildings. Partners decide together, each vote weighted by what they hold. One operating partner runs every estate.</p><a class="btn" href="/how-it-works">How ownership works</a></div></div></section>' +
    /* Copy review R1: the structure the whole site rests on, stated once. */
    '<section class="spv"><div class="center gut"><span class="eb">The structure</span><h2 class="h2">One asset. <span>Its own LLP.</span></h2>' +
    '<p class="para">Each estate is a single asset held in its own special purpose vehicle (SPV): an entity formed for that one estate and nothing else. The SPV takes the form of a limited liability partnership (LLP), and the LLP gives its partners four things. It is a legal entity in its own right. It owns the land and the buildings in its own name, signs its own contracts and keeps its own accounts. Each partner&rsquo;s liability is limited to what they agreed to contribute. It continues unchanged as partners join or leave. And because it holds one estate only, that estate&rsquo;s money and obligations remain inside it.</p>' +
    '<p class="para">The LLP is owned exclusively by its partners, a small circle of individuals invited to join. You join by buying units; each unit is a fixed share of the LLP, and of everything it owns.</p></div></section>' +
    /* Wave 1, GC-19-CT-001 R4 (founder, 23 Oct 2026): who it suits and who is
       behind it, in the investor's words. Figures from the register; Solace's
       remain private (6 Oct ruling). */
    '<section class="fit"><div class="fit-h"><span class="eb">Who it suits</span><h2 class="h2">Ownership for people who want <span>to hold something real.</span></h2></div><dl class="fit-grid">' +
    '<div><dt>Capital you can set aside</dt><dd>Units are held for the estate&rsquo;s lock-in, 36 months at most estates, and then offered to fellow partners first.</dd></div>' +
    '<div><dt>One place, not a portfolio</dt><dd>You own a share of one estate you can visit, with its own accounts.</dd></div>' +
    '<div><dt>A say in it</dt><dd>Partners decide together, each vote weighted by what they hold.</dd></div>' +
    '<div><dt>Nights of your own</dt><dd>One night a year for each 1% you hold, from handover.</dd></div>' +
    '</dl><p class="para para-s">Investing from outside India, or for a family office? <a class="tx-u" href="/answers">The answers</a> cover who can invest and how much one partner may hold.</p></section>' +
    '<section class="parties"><div class="fit-h"><span class="eb">Who is behind it</span><h2 class="h2">Three parties, <span>each with one job.</span></h2></div><dl>' +
    '<div><dt>NAVINA Structures Pvt Ltd</dt><dd>Forms each estate&rsquo;s LLP and governs it, as Getaway Collective, its brand. It holds your deposit as a fiduciary until you are admitted, keeps the register, runs the votes and reports to partners. It holds no equity, and is paid from one disclosed stage of revenue.</dd></div>' +
    `<div><dt>The promoters</dt><dd>Nikhil Deshpande and Shirisha Avanchi, NAVINA&rsquo;s directors and shareholders, invest alongside you in their own names: the same units, on the same terms, paid at the same stage, so their money rises and falls with yours.${stakes ? ` ${stakes}.` : ""}</dd></div>` +
    '<div><dt>Sensory Getaways</dt><dd>Runs each estate: the guests, the staff and the upkeep. It is measured on agreed service levels and answers to the partners&rsquo; vote.</dd></div>' +
    '</dl></section>' +
    // ── four estates, up close ──
    '<div class="explore-h"><span class="eb">The collection</span><h2 class="h2">Seven estates, <span>and where each one stands.</span></h2></div>' +
    '<div class="stackfilm">' + HOME_STACK.map((s) =>
      `<section class="sf${imgOf(s.href) ? " sf-img" : ""}">${imgOf(s.href) ? plate(imgOf(s.href)!, { tag: "tl" }) : film(s.pal, s.hour, { rain: s.rain })}<div class="ov"><div><h3>${s.name}</h3><p>${s.line}</p>${s.chip ? `<p class="sf-d">${s.chip}</p>` : ""}<span class="chip">${esc(state(s.vehicleKey, s.href))}</span></div></div>` +
      `<a class="btn go" href="${s.href}">${s.cta} ${NE}</a></section>`).join("") + "</div>" +
    /* 15 Oct 2026 (audit, section 5): the frames repeated the list above; one way to browse. */
    `<p class="explore-all"><a class="tx-u" href="/collection">All ${Nw.toLowerCase()} estates, side by side</a></p>` +
    // ── still to come ──
    '<section class="next"><div class="center gut"><h2 class="h2">Next <span>estates</span></h2><p class="para mute">Named, surveyed, not yet open. Each will arrive with its own offering letter.</p></div><div class="rail">' +
    NEXT_ESTATES.map((n) => `${n.href ? `<a class="nc" href="${n.href}">` : '<article class="nc">'}<div class="im">${film(n.pal, n.hour)}</div><h4>${n.name}</h4><p>${n.line}</p>${n.href ? "</a>" : "</article>"}`).join("") + "</div></section>" +
    // ── how they are built, and who runs them ──
    '<section class="makers"><div class="trio">' +
    TRIO.map((t) => `<figure><svg viewBox="0 0 200 200" aria-hidden="true">${inkify(t.svg)}</svg><figcaption><b>${t.name}</b><span>${t.sub}</span></figcaption></figure>`).join("") +
    '</div><div><span class="eb">Built as a system</span><h2 class="h2">Three chassis. <span>Every estate.</span></h2></div>' +
    '<div><p class="para">Each estate is assembled from the same three architectural systems: one on the ground, one lifted to the horizon, one opened into volume. The land changes; the standard does not. That is how a small place can be built as carefully the tenth time as the first.</p>' +
    '<a class="btn gray" href="/collection/slowspace-solace#concept">See them at Solace</a></div></section>' +
    `<section class="fullbleed">${plate("creek/night")}<div class="cap"><span class="eb">Run by our operating partner</span>` +
    '<h2 class="h2">You own it. <span>Nobody asks you to run it.</span></h2><p class="para">Sensory Getaways operates every estate under a Commercial Services Agreement, measured on service levels and paid from the first stage of the waterfall. Partners decide; the operator delivers.</p>' +
    '<a class="btn" href="/operating-partner">The operating partner</a></div></section>' +
    // ── the Journal, and the pack ──
    '<section class="news"><div class="center gut"><h2 class="h2">From the <span>Journal</span></h2></div><div class="rail">' +
    journal.map((j) => `<article class="nw"><h4>${j.e!.title}</h4><div class="im">${film(j.pal, j.hour, { bp: j.bp })}</div><div class="ft"><span class="eb">${KIND_LABEL[j.e!.kind]} · ${j.e!.minutes} min</span><a class="btn gray" href="/journal/${j.slug}">Read</a></div></article>`).join("") +
    "</div></section>" +
    (pack
      ? `<section class="pack"><div class="col">${imgOf(`/collection/${pack.vehicle.slug}`) ? plate(imgOf(`/collection/${pack.vehicle.slug}`)!, { sizes: "(max-width: 900px) 100vw, 52vw" }) : film("creek", 12, { bp: true })}</div><div class="tx"><span class="eb">The offering pack</span>` +
        `<h2 class="h2 h2-s">Get the <span>${esc(pack.name)} offering pack</span></h2>` +
        `<p class="para dim">The drawings, the structure of ${esc(pack.vehicle.registeredName)}, ${pack.vehicle.operating.cascade?.length ? "the order of payment" : "the waterfall"} and the risk disclosure, in one document. Sent after a short qualification.</p>` +
        `<div><a class="btn lead" href="/collection/${pack.vehicle.slug}/enquire?about=pack">Request the pack ${NE}</a></div></div></section>`
      : "") +
    '<section class="who"><div><span class="eb">Who we are</span><p class="q"><b>You own.</b> We steward.<br>You decide.</p></div>' + // vocab-lint-ignore — ratified brand line, L1-02 §514
    '<div><p class="para">Getaway Collective forms each retreat as its own LLP, invites its partners and governs it for them. All the equity belongs to the partners. We are paid from one disclosed stage of the estate&rsquo;s revenue.</p><a class="btn dark" href="/about">Learn more</a></div></section>';
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
/** Where an estate stands, for grouping: the register's status where it is a vehicle; a funded estate with the funded. */
function groupOf(e: CollectionEstate): Group {
  if (e.funding === "complete") return "subscribed";
  const v = vehicleOf(e.vehicleKey);
  if (!v) return "later";
  const st = read(v).status;
  return st === "RAISING" ? "raising" : st === "FULLY SUBSCRIBED" ? "subscribed" : "later";
}

function compareHTML(): string {
  const cols = COLLECTION.flatMap((e) => {
    const v = vehicleOf(e.vehicleKey);
    return v ? [{ e, v, R: read(v), g: groupOf(e) }] : [];
  }).sort((a, b) => GROUP_ORDER[a.g] - GROUP_ORDER[b.g]);
  if (cols.length < 2) return "";
  const gap = (s: string) => `<span class="ab">${s}</span>`;
  type Col = (typeof cols)[number];
  /* [measure, cell, where the cell's figure comes from] — see registry.ts src(). */
  const rows: [string, (c: Col) => string, (c: Col) => Prov | undefined][] = [
    ["Place", (c) => esc(c.v.jurisdiction), (c) => c.R.prov.intake],
    ["Keys", (c) => String(c.v.keys), (c) => c.R.prov.intake],
    ["Land", (c) => esc(landPublic(c.v)), (c) => c.R.prov.intake],
    ["Availability", (c) => esc(c.R.availability), (c) => c.R.prov.derived],
    ["Delivery", (c) => esc(c.R.delivery), (c) => c.R.prov.intake],
    ["Units", (c) => (c.R.complete ? gap("Funding complete") : c.R.publishable ? `${c.v.offering.available} of ${c.v.offering.units} available` : gap("Figures being confirmed")), (c) => (c.R.publishable && !c.R.complete ? c.R.prov.derived : undefined)],
    ["A unit", (c) => (c.R.complete ? gap("Funding complete") : c.R.publishable ? rupees(c.v.offering.unitPrice) : gap("Not yet priced")), (c) => (c.R.publishable && !c.R.complete ? c.R.prov.intake : undefined)],
    ["Lock-in", (c) => (c.R.complete ? gap("Funding complete") : c.R.publishable ? esc(c.v.offering.lockIn) : gap("Set in the offering letter")), (c) => (c.R.publishable && !c.R.complete ? c.R.prov.intake : undefined)],
    ["Held by", (c) => (ownershipPrivate(c.v.slug) ? gap("Not published") : esc(heldBy(c.v).value)), (c) => (ownershipPrivate(c.v.slug) ? undefined : c.R.prov.intake)],
  ];
  return '<section class="cmp" id="compare"><span class="eb">Compare</span><h2 class="h2">The estates, <span>side by side.</span></h2>' +
    '<p class="para dim">Every figure is read from each estate\'s own record. Capital is at risk; the offering letter governs.</p>' +
    `<div class="cmp-wrap" tabindex="0" role="region" aria-label="The estates compared"><table class="cmp-t"><thead><tr><th scope="col"><span class="sr">Measure</span></th>${cols.map((c) =>
      `<th scope="col" class="g-${c.g}"><span class="cmp-st">${esc(c.R.availability)}</span><a href="${c.e.href}">${c.e.name}</a></th>`).join("")}</tr></thead>` +
    `<tbody>${rows.map(([k, f, p]) => `<tr><th scope="row">${k}</th>${cols.map((c) => `<td class="g-${c.g}"><span${src(p(c))}>${f(c)}</span></td>`).join("")}</tr>`).join("")}` +
    /* The same next step the estate's card and page offer (registry.ts read().action). */
    `<tr class="cmp-go"><th scope="row">Next step</th>${cols.map((c) => `<td class="g-${c.g}"><a class="btn ${c.g === "raising" ? "lead" : "gray"}" href="${c.R.action[1]}">${esc(c.R.action[0])}</a></td>`).join("")}</tr>` +
    `</tbody></table></div>` +
    /* 15 Oct 2026 (audit GC-10): on a phone the same comparison is one estate
       at a time, top to bottom, instead of a table that scrolls sideways. */
    `<div class="cmp-m">${cols.map((c) => `<article class="g-${c.g}"><span class="cmp-st">${esc(c.R.availability)}</span><h3><a href="${c.e.href}">${c.e.name}</a></h3>` +
      `<dl>${rows.map(([k, f, p]) => `<div><dt>${k}</dt><dd><span${src(p(c))}>${f(c)}</span></dd></div>`).join("")}</dl>` +
      `<a class="btn ${c.g === "raising" ? "lead" : "gray"}" href="${c.R.action[1]}">${esc(c.R.action[0])}</a></article>`).join("")}</div>` +
    '<p class="cmp-note">Tap a figure for where it comes from and how far it can be relied on.</p></section>';
}

// ── the collection ──
export function SiteCollection() {
  const stage = (e: CollectionEstate) => {
    const v = vehicleOf(e.vehicleKey);
    return v ? read(v).status : e.funding === "complete" ? "FUNDING COMPLETE" : e.stage === "pipe" ? "PIPELINE" : "IN DELIVERY";
  };
  /* 25 Sep 2026, founder: "how to see the properties that are the only
     ones raising funds; completed ones should be separate too". The grid
     now opens on what is raising, with the subscribed and the not-yet-open
     each on their own tab, counted. Where an estate stands comes from the
     register (read().status), never from the card's own copy. */
  const counts = { raising: 0, subscribed: 0, later: 0 };
  /* A card answers six questions in the same order every time (brief of
     28 Sep): name and place, character, keys and land, availability,
     delivery, and what to do next. Keys, land, availability and delivery
     are the register's wherever the estate is a vehicle. */
  const cards = COLLECTION.map((e) => {
    const g = groupOf(e);
    counts[g]++;
    const v = vehicleOf(e.vehicleKey);
    const R = v ? read(v) : undefined;
    const done = e.funding === "complete";
    return {
      e, g, st: stage(e), slug: e.href.replace("/collection/", ""),
      /* Wave 1: studios are where guests sleep; units are shares of ownership. */
      facts: v ? `${v.keys} studios · ${landPublic(v)}` : e.spec.replace(/\bkeys\b/g, "studios"),
      availability: R ? R.availability + (R.publishable && !R.complete && v!.offering.unitPrice > 0n ? ` · ${rupees(v!.offering.unitPrice)} a unit` : "")
        : done ? "Funding complete" : e.stage === "pipe" ? "Not yet offered" : "Not yet open for investment",
      delivery: R ? R.delivery : e.stage === "pipe" ? "Pipeline" : "In delivery",
      action: R ? R.action : e.stage === "pipe" ? (["Get updates", "/signal"] as const) : (["View progress", e.href] as const),
    };
  });
  const tabs: readonly (readonly [Group | "all", string])[] = [
    ["raising", "Raising now"], ["subscribed", "Funding complete"], ["later", "Not yet open"], ["all", "All"],
  ];
  const open: Group | "all" = counts.raising ? "raising" : "all";
  const html =
    '<div class="col-head"><h1>Our estates</h1><p class="para col-lead">Seven estates in Karnataka, each a single asset in its own LLP. One is open to new partners today.</p></div>' +
    '<div class="filters"><div class="fl" role="group" aria-label="Filter"><span class="fl-l">Filters:</span><button type="button" aria-pressed="true" data-f="all">All</button><button type="button" aria-pressed="false" data-f="coast">Coast</button><button type="button" aria-pressed="false" data-f="hills">Hills</button><button type="button" aria-pressed="false" data-f="coffee">Coffee country</button></div><span class="fl-sort">Sort: by stage</span></div>' +
    `<div class="subtabs" role="tablist" aria-label="Where each estate stands">${tabs.map(([k, label]) => {
      const n = k === "all" ? cards.length : counts[k];
      return `<button role="tab" aria-selected="${k === open}" data-s="${k}"${n ? "" : " disabled"}>${label} <span class="n">${n}</span></button>`;
    }).join("")}</div>` +
    '<section class="short" data-shortlist hidden aria-label="Your shortlist"></section>' +
    '<div class="cgrid" id="cgrid">' + cards.map(({ e, g, st, slug, facts, availability, delivery, action }) =>
      `<article class="cc cc-${g}" data-f="${e.region}" data-s="${g}" data-slug="${slug}"${open !== "all" && g !== open ? " hidden" : ""}>` +
      `<a class="cc-main" href="${e.href}"><div class="im">${e.img ? plate(e.img, { sizes: "(max-width: 900px) 100vw, 46vw", tag: "tl" }) : film(e.pal, e.hour)}<span class="st st-${g}">${st}</span></div>` +
      `<h3>${e.name}</h3><p class="cc-loc">${e.line}</p><p class="cc-char">${esc(e.character)}</p>` +
      `<dl class="cc-facts"><div><dt>Studios and land</dt><dd>${esc(facts)}</dd></div><div><dt>Availability</dt><dd>${esc(availability)}</dd></div><div><dt>Delivery</dt><dd>${esc(delivery)}</dd></div></dl></a>` +
      `<a class="cc-act" href="${action[1]}">${esc(action[0])} ${NE}</a></article>`,
    ).join("") + "</div>" +
    `<section class="mk">${film("solace", 17.8)}<div class="cap"><span class="eb">Take the next step</span><h2 class="h2">Become <span>a partner.</span></h2><p class="para dim">Talk to Investor Relations, or begin with one email.</p><div><a class="btn" href="/contact">Make an enquiry</a></div></div></section>` +
    '<section class="ben"><div class="l"><h2 class="h2 h2-s">Why own <span>this way</span></h2><p class="para dim">You own a share of the asset itself, and nights come with it.</p><div><a class="btn" href="#faq">Read the questions</a></div></div>' +
    '<div class="r"><div><span class="sq"><svg aria-hidden="true"><use href="#i-unit"/></svg></span><div><h4>Own a share, sized to you</h4><p>Each estate is divided into units, priced in its offering letter. A partner holds from one unit upward.</p></div></div>' +
    '<div><span class="sq"><svg aria-hidden="true"><use href="#i-gov"/></svg></span><div><h4>Governed for its partners</h4><p>Getaway Collective keeps the records and runs the votes. The equity belongs to the partners.</p></div></div>' +
    '<div><span class="sq"><svg aria-hidden="true"><use href="#i-net"/></svg></span><div><h4>One standard, many estates</h4><p>Every estate is built to the same standard and run by the same operating partner.</p></div></div></div></section>' +
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
    /* A funded estate answers its own questions only: the general ones are about investing, and it takes none. */
    const faq = faqHTML([...(FAQX[E.key] ?? []), ...(fundingComplete(E.slug) || E.ownAnswers ? [] : FAQ)], R?.tokens);
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
    /* Digital assemblies (23 Oct 2026): drawings, stories, pictures, pull lines and fact strips inline. */
    else if (b.t === "graphic") blocks.push({ html: `<figure class="j-fig">${graphicHTML(b.g, headings)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>` });
    else if (b.t === "story") blocks.push({ html: `<aside class="j-story"><span class="eb">A story, to illustrate</span><h3>${esc(b.title)}</h3>${b.x.map((p) => `<p>${p}</p>`).join("")}</aside>` });
    else if (b.t === "illus") blocks.push({ html: `<figure class="j-illus"><div class="j-illus-im">${b.plate ? plate(b.plate, { sizes: "(max-width: 900px) 100vw, 760px", tag: "tl" }) : film(b.film?.[0] ?? "coast", b.film?.[1] ?? 17)}</div><figcaption>${esc(b.caption)}</figcaption></figure>` });
    else if (b.t === "pull") blocks.push({ pull: b.x });
    else if (b.t === "facts") blocks.push({ figs: b.rows });
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
    .filter(({ v, p }) => !fundingComplete(v.slug) && p.yield.conf !== "UNKNOWN" && p.yield.v > 0 && p.yieldBasis)
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
  const openV = VEHICLES.find((v) => v.offering.available > 0 && v.offering.deposit);
  const deposit = openV?.offering.deposit;
  const openPct = openV ? Number((openV.offering.unitPrice * 1000n) / openV.offering.totalEquity) / 10 : 0;
  const hold = deposit ? rupeesFull(deposit) : null;

  const tile = (t: string, p: string) => `<div class="own-tile"><h3>${t}</h3><p>${p}</p></div>`;
  const track = (rows: typeof S, mark: (i: number) => string) => `<ol class="tx-steps">${rows.map((r, i) =>
    `<li><em>${mark(i)}</em><div><h3>${esc(r.t)}</h3><p>${esc(r.what)}</p>${r.note ? `<p class="tx-assert">${esc(r.note)}</p>` : ""}</div></li>`).join("")}</ol>`;
  const stagesHTML =
    `<h3 class="tx-h3">The path, in order</h3>${track(S.filter((r) => !KYC_STAGES.has(r.slug)), (i) => String(i + 1).padStart(2, "0"))}` +
    `<h3 class="tx-h3">KYC, alongside: any time, complete before you sign</h3>${track(S.filter((r) => KYC_STAGES.has(r.slug)), (i) => `K${i + 1}`)}`;

  const blocks: Block[] = [
    { h: "What you own" },
    { html: `<div class="own-tiles">` +
      tile("A share of a real place", "Your units are a share of the LLP that owns the land and the buildings.") +
      /* 15 Oct 2026 (audit GC-02): one rule everywhere, the founder's of 6 Oct. */
      tile("Nights of your own", openV ? `One night a year for each 1% of an estate you hold, from handover. At ${esc(publicName(openV))}, open now, one unit is ${openPct}% of the equity, so ${Math.floor(openPct + 1e-9)} nights a year.` : "One night a year for each 1% of an estate you hold, from handover.") +
      tile("Modelled income", lead ? `Distributions follow the payment order. At ${esc(lead.name)} the modelled base-case yield is ${lead.yieldPct}% a year, ${esc(lead.basis)}.` : "Distributions follow the payment order, from stabilised occupancy.") +
      tile("Run for you", "Sensory Getaways runs every estate day to day, measured on agreed service levels.") +
      tile("A vote", "Partners decide together, each vote weighted by holding.") +
      `</div>` },
    { h: "Three steps" },
    { steps: [
      ["Sign in and read", "One email address opens every estate, its drawings and its figures. A short suitability questionnaire opens the full offering documents, with a decision within 15 working days."],
      ["Hold your units", `Hold your units online${hold ? ` with a ${hold} deposit` : ""}. It is paid to NAVINA Structures Pvt Ltd, the company forming the estate's LLP, which holds it as a fiduciary until partners are admitted. It is refundable in full until you sign the LLP agreement.`],
      ["Sign, and become a partner", "Identity checks complete alongside your reading, at your pace. You sign the LLP agreement and settle your units; from then you vote, receive distributions and, from handover, your nights."],
    ] },
    { p: "Why identity checks: partners own real land together, and the law asks the partnership to know each partner before admitting them. That is why the checks come last." },
    { links: [["Sign in or begin", "/sign-in", "lead"], ["See the collection", "/collection"]] },
    /* 15 Oct 2026 (audit, section 6): the four-way calculator added an
       estate's value, its distributions and the worth of its nights into one
       headline, against comparators on different terms. It is withdrawn until
       it compares like with like; calc.ts is kept. */
    { h: "What your money does", id: "calculator" },
    /* Wave 1 (founder, 20 Oct): the one risk line lives in the footer; this states what each part is. */
    { p: "Three things come with a share of an estate, each measured on its own. The value of the share itself, which moves with the estate. Distributions, paid from what remains after the estate's costs and any loan, in the order its agreement sets. And nights, a benefit of owning. Each estate's investment page sets out its own figures, modelled from its register, before tax, with the basis for each." },
    { h: "Every stage, in full" },
    { html: `<details class="tx-fold"><summary>Read every stage: the path, and KYC alongside it</summary>${stagesHTML}</details>` },
    { h: "What happens to what you enter" },
    { p: "The Privacy Notice states what is collected, why, who sees it and how long it is kept. Accreditation and screening records, for example, are kept for eight years after the relationship ends, as the law requires." },
    { links: [["Sign in or begin", "/sign-in", "lead"], ["Risk factors", "/legal/risk-disclosure"], ["Privacy Notice", "/legal/privacy"], ["Answers", "/answers"]] },
  ];
  const P: SitePage = {
    key: "qualify", path: "/how-to-qualify", light: 1, eyebrow: "How to join",
    title: "Become a partner <span>in three steps.</span>",
    lead: "Sign in with one email and read everything. Hold your units with a refundable deposit. Identity checks run alongside and complete before you sign; then you are a partner, with nights of your own each year from handover.",
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
  /* Wave 2 (founder, 23 Oct 2026): the page opens on what the operator does, not a standfirst. */
  const blocks: Block[] = [];
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
    title: "Sensory Getaways runs every estate, <span>measured and paid for one job.</span>",
    lead: "Each estate is a single asset in its own limited liability partnership (LLP). Sensory Getaways runs it day to day, under contract to that LLP. This page sets out what it does, how it is measured and how it is paid.",
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
  if (fundingComplete(v.slug)) {
    const R = read(v), plainName = name.replace(/<[^>]+>/g, "");
    const done: SitePage = {
      key: `${v.key}-${id}`, path, eyebrow: `${esc(plainName)} · Funding complete`, title: "Funding <span>complete.</span>",
      lead: `${esc(plainName)} is funded and ${esc(R.delivery.toLowerCase())}.`,
      film: E ? [E.pal, E.enquireHour || 18] : undefined,
      blocks: [{ links: [[`Back to ${plainName}`, `/collection/${v.slug}`], ["Explore the collection", "/collection", "lead"], ["Ask Investor Relations", `/contact?estate=${v.slug}&about=estate`]] }],
    };
    return <Mount html={TXT(done)} />;
  }
  const blocks: Block[] = [];
  if (c.rows.length) blocks.push({ rows: c.rows.map((r) => [esc(plain(r.label)), `${esc(plain(r.value))}${r.basis ? `<span class="tx-note">${esc(plain(r.basis))}</span>` : ""}`]) });
  if (c.withheld.length) { blocks.push({ h: "Withheld, and why" }); blocks.push({ list: c.withheld.map((w) => esc(plain(w))) }); }
  /* 15 Oct 2026 (audit GC-07): the offering is read before anything is paid,
     so reserving is offered at the foot of the investment page. */
  if (id === "investment") {
    const R = read(v);
    if (R.stance.kind === "open" && v.offering.deposit !== null) {
      /* Wave 2, GC-19-CT-002 R0 (founder, 23 Oct 2026). */
      blocks.push({ p: `Hold your units while you decide. A ${rupeesFull(v.offering.deposit)} deposit, paid to NAVINA Structures Pvt Ltd as a fiduciary, holds your units. It is refundable in full until you sign.` });
      blocks.push({ links: [[`Hold your units · ${rupeesFull(v.offering.deposit)} deposit`, `/reserve/${v.slug}`, "lead"], ["Read the risks first", `/collection/${v.slug}/risk`]] });
    }
  }
  if (id === "enquire") {
    const R = read(v);
    if (R.stance.kind === "open" && v.offering.deposit !== null) {
      /* V2.0, 6 Oct 2026: reserving has its own page (./reserve.tsx); this
         one is for asking. One link, said before the form. */
      blocks.push({ links: [[`Hold your units · ${rupeesFull(v.offering.deposit)} deposit`, `/reserve/${v.slug}`, "lead"]] });
    }
    blocks.push({ h: R.stance.kind === "waitlist" ? "Join the waitlist" : "Request the offering pack" });
    blocks.push({ form: {
      id: `${v.key}-enq`, addr: "ir@getawaycollective.co",
      about: `${esc(name.replace(/<[^>]+>/g, ""))} · ${R.stance.kind === "waitlist" ? "joining the waitlist" : "the offering pack"}`,
      fields: [["Name", "text", "name"], ["Email", "email", "email"], ["City", "text", "address-level2"], ["Anything we should know", "area"]],
      submit: R.stance.kind === "waitlist" ? "Join the waitlist" : "Request the pack",
      ok: "Received. Investor Relations will reply to you in writing. Nothing about capital is decided by email alone.",
      note: "Capital is at risk. Read the Risk Factors before committing.", to: "dossier", vehicle: v.slug,
    } });
  }
  blocks.push({ links: [[`Back to ${name}`, `/collection/${v.slug}`], ["Investment", `/collection/${v.slug}/investment`], ["Risk", `/collection/${v.slug}/risk`], ["Enquire", `/collection/${v.slug}/enquire`, "lead"]] });
  const P: SitePage = {
    key: `${v.key}-${id}`, path, eyebrow: `${esc(name)} · ${esc(c.eyebrow.replace(/^CHAPTER \d+ · /, ""))}`, title: esc(plain(c.title)), lead: esc(plain(c.lead)),
    film: E ? [E.pal, E.enquireHour || 18] : undefined, img: E?.media?.enquire, blocks,
  };
  return <Mount html={fill(TXT(P))} light={!!P.img} />;
}

/** The enquiry desk at /contact, with the prototype's form. */
export function SiteContact() {
  return <SiteText path="/contact" />;
}

export { FORM };
