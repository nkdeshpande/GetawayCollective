/**
 * PAGE METADATA — one title, one description, one canonical per public page
 *
 * 25 Sep 2026. Read from the same content the page renders, so a browser
 * tab, a search result and a shared link describe the page they lead to.
 * Before this, every Journal entry was titled "Story" and every standing
 * document "Legal Document" — the route table's name for the template, not
 * the page's own — and no page declared a canonical URL.
 *
 * Called by the pages scripts/gen-app.js writes, for public routes only.
 * Private routes keep their subject-checked generic title (IA_LAWS).
 */

import type { Metadata } from "next";
import { ESTATES } from "@/content/site/estates";
import { PAGES } from "@/content/site/pages";
import { JOURNAL, KIND_LABEL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";
import { VEHICLES, vehicleBySlug } from "@/constants/vehicles";
import { ROUTES } from "@/constants/routes";

const BRAND = "Getaway Collective";
/**
 * Each page's share card is drawn from its own title (app/api/og). The home
 * page keeps the brand card app/opengraph-image.tsx draws.
 */
const shareFor = (path: string, alt: string) => ({
  url: path === "/" ? "/opengraph-image" : `/api/og?p=${encodeURIComponent(path)}`, width: 1200, height: 630, alt,
});
const DEFAULT =
  "An investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own LLP and owned by its partners. Capital is at risk.";

const plain = (s: string | undefined) =>
  (s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
/** Search results show about 160 characters; cut at a word. */
const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:·]$/, "") + "…");

/**
 * Where an estate is, in the words people search with. 25 Sep 2026.
 *
 * Titles used to be the estate's name alone ("Creek"), which nobody
 * searching for a retreat in Coorg would ever type. The place comes from
 * the region the estate already names above its title and the state on
 * its register record, so nothing new is claimed; Kodagu also carries
 * Coorg, the name most people use for it.
 */
export function placeOf(eyebrow: string | undefined, jurisdiction: string | undefined): string {
  let region = plain(eyebrow).replace(/^Getaway Collective\s*·\s*/, "") || (jurisdiction ?? "");
  if (/Kodagu/i.test(region) && !/Coorg/i.test(region)) region = region.replace(/Kodagu/i, "Kodagu (Coorg)");
  const state = /Karnataka/.test(jurisdiction ?? "") && !/Karnataka/.test(region) ? ", Karnataka" : "";
  return region ? region + state : "";
}

/** "Karnataka, India" while every estate is there; "India" once one is not. */
const WHERE = VEHICLES.every((v) => /Karnataka/.test(v.jurisdiction)) ? "Karnataka, India" : "India";

/**
 * Two pages whose titles are written out in full: the home page leads with
 * the brand, and the collection says what and where it is. The words are
 * the site's own description, not new claims.
 */
/* 16 Oct 2026 (SEO audit): titles carry the words people search with, own
   a share of a retreat, through an LLP, in Coorg and Karnataka, and still
   only what the site already says. */
const FULL_TITLE: Readonly<Record<string, string>> = {
  "/": `${BRAND} · Own a share of a retreat in India, through an LLP`,
  "/collection": `Retreat estates to co-own in ${WHERE} · The Collection · ${BRAND}`,
  "/how-it-works": `How co-owning a retreat works · LLP partnership, fees and exit · ${BRAND}`,
  "/how-to-qualify": `How to own a share of a retreat · Three steps · ${BRAND}`,
  "/journal": `The Journal · Owning a retreat in India, explained · ${BRAND}`,
};

/* 16 Oct 2026 (SEO audit): four pages shared the default description. */
const DESCRIPTION: Readonly<Record<string, string>> = {
  "/": "Own units in the LLP that holds a retreat estate in Coorg or on the Karnataka coast. We govern each partnership and hold none of it; an operating partner runs it. Capital is at risk.",
  "/collection": `Every estate in the collection, in ${WHERE}: which is open, which is funded and in delivery, and which is still forming, with keys, land and where each one stands.`,
  "/journal": "Notes on owning a share of a retreat in India: why an LLP, what a partner holds, how the nights work, and the record of each estate as it is built.",
  "/legal": "The standing documents of Getaway Collective: Terms, Risk Factors, Privacy, Cookies and Disclosures, each versioned and dated.",
};

const CHAPTER: Readonly<Record<string, string>> = { investment: "The investment", risk: "Risk", enquire: "Enquire" };

function resolve(pattern: string, p: Readonly<Record<string, string>>): { title?: string; description?: string } {
  if (pattern === "/journal/[story]") {
    const e = JOURNAL.find((x) => x.slug === p.story);
    return e ? { title: e.title, description: e.standfirst } : {};
  }
  if (pattern === "/legal/[document]") {
    const d = DOCUMENTS.find((x) => x.path === `/legal/${p.document}`);
    return d ? { title: d.title, description: d.purpose } : {};
  }
  if (pattern.startsWith("/collection/[vehicle]")) {
    const e = Object.values(ESTATES).find((x) => x.slug === p.vehicle);
    const v = vehicleBySlug(p.vehicle);
    const page = Object.values(PAGES).find((x) => x.path === `/collection/${p.vehicle}`);
    const name = plain(e?.name) || plain(page?.title).replace(/\.$/, "") || v?.propertyName;
    if (!name) return {};
    const chapter = pattern.split("/").pop()!;
    const where = placeOf(e?.eyebrow ?? page?.eyebrow, v?.jurisdiction);
    const at = where ? ` (${where})` : "";
    if (chapter === "investment") return { title: `Invest in ${name} · Units, price and returns`, description: `The investment in ${name}${at}: how many units, what one costs, how the capital is raised, and the order in which revenue is paid out to partners. Capital is at risk.` };
    if (chapter === "risk") return { title: `${name} · Risk factors before you invest`, description: `What could go wrong at ${name}${at}, stated before anyone is asked for anything: building, demand, the operator, liquidity and the partnership itself.` };
    if (CHAPTER[chapter]) return { title: `${name} · ${CHAPTER[chapter]}`, description: `${CHAPTER[chapter]} for ${name}${at}. Capital is at risk.` };
    return { title: where ? `${name}, ${where} · Own a share of a retreat` : name, description: plain(e?.intro) || plain(page?.lead) };
  }
  if (pattern === "/how-to-qualify") return { description: "Own a share of a retreat in three steps: sign in with one email, hold your units with a refundable deposit, and sign, with KYC alongside rather than in the way. And what the same sum does four ways." };
  if (pattern === "/careers") return { description: "Getaway Collective runs as two roles: the master developer and asset manager, who holds the capital and governs; and the operating and brand partner, who runs the estates." };
  if (pattern === "/operating-partner") return { description: "Who runs each Getaway Collective estate day to day, how the operating partner is measured and paid, and what happens when it fails." };
  if (DESCRIPTION[pattern]) return { description: DESCRIPTION[pattern] };
  const page = Object.values(PAGES).find((x) => x.path === pattern);
  return page ? { description: plain(page.lead) } : {};
}

/**
 * What a concrete public path is, for its share card: a title and the one
 * line above it. Read from the same content as the page, and undefined for
 * a path the site does not publish — so the card can never carry text that
 * arrived in a URL.
 */
export function describePath(path: string): { title: string; kicker: string } | undefined {
  let m: RegExpMatchArray | null;
  if ((m = path.match(/^\/journal\/([a-z0-9-]+)$/))) {
    const e = JOURNAL.find((x) => x.slug === m![1]);
    return e ? { title: e.title, kicker: `Journal · ${KIND_LABEL[e.kind]}` } : undefined;
  }
  if ((m = path.match(/^\/legal\/([a-z0-9-]+)$/))) {
    const d = DOCUMENTS.find((x) => x.path === path);
    return d ? { title: d.title, kicker: `Legal · version ${d.version}` } : undefined;
  }
  if ((m = path.match(/^\/collection\/([a-z0-9-]+)(?:\/(investment|risk|enquire))?$/))) {
    const r = resolve(m[2] ? `/collection/[vehicle]/${m[2]}` : "/collection/[vehicle]", { vehicle: m[1] });
    if (!r.title) return undefined;
    const e = Object.values(ESTATES).find((x) => x.slug === m![1]);
    const page = Object.values(PAGES).find((x) => x.path === `/collection/${m![1]}`);
    return { title: r.title, kicker: e ? plain(e.eyebrow) : plain(page?.eyebrow) || "The collection" };
  }
  const page = Object.values(PAGES).find((x) => x.path === path);
  if (page) return { title: plain(page.title), kicker: plain(page.eyebrow) };
  const route = ROUTES.find((r) => r.path === path);
  return route ? { title: route.name, kicker: BRAND } : undefined;
}

/**
 * `index` is false for a public page the route table keeps out of search
 * (sign-in, the previews, the error states): it keeps its title and
 * canonical, and says noindex.
 */
export function pageMeta(pattern: string, params: Readonly<Record<string, string>>, fallbackTitle: string, index = true): Metadata {
  const path = pattern.replace(/\[(\w+)\]/g, (_, k: string) => params[k] ?? k);
  const r = resolve(pattern, params);
  const title = FULL_TITLE[pattern] ?? (r.title ? `${r.title} · ${BRAND}` : fallbackTitle);
  const description = clip(plain(r.description) || DEFAULT);
  return {
    title,
    description,
    alternates: { canonical: path },
    /* Setting openGraph here replaces the one app/opengraph-image.tsx would
       have supplied rather than merging with it, so the image is named
       again — without this line no public page carried a share image. */
    openGraph: { title, description, url: path, siteName: BRAND, type: pattern.startsWith("/journal/") ? "article" : "website", images: [shareFor(path, title)] },
    twitter: { card: "summary_large_image", title, description, images: [shareFor(path, title).url] },
    robots: { index, follow: true },
  };
}
