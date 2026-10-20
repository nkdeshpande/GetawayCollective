/**
 * STRUCTURED DATA AND llms.txt — what search and answer engines read
 *
 * 25 Sep 2026. Built from the same sources the pages render — the vehicle
 * register, the site's estates, the Journal, the answers and the glossary —
 * so nothing here is typed twice and nothing can say more than a page does.
 * No figure appears: the graph names places and publications, never prices.
 */

import { VEHICLES } from "@/constants/vehicles";
import { toPublic, toInternal } from "@/constants/estate-urls";
import { ESTATES } from "@/content/site/estates";
import { PAGES } from "@/content/site/pages";
import { JOURNAL, KIND_LABEL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";

export const SITE = "https://www.getawaycollective.co";
const ORG = `${SITE}/#org`;
export const DESCRIPTION =
  "An investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own LLP and owned by its partners. Getaway Collective governs each vehicle and holds no equity in it.";

const plain = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const rowsOf = (key: string): (readonly (string | number)[])[] =>
  (PAGES[key]?.blocks ?? []).flatMap((b) => (b.rows ? [...b.rows] : []));
const peopleOf = () => (PAGES.team?.blocks ?? []).flatMap((b) => (b.people ? [...b.people] : []));

/**
 * Coordinates as the register writes them — decimal ("12.385716°N
 * 75.836097°E") or degrees, minutes and seconds ("13°24'40.5"N
 * 77°49'26.9"E") — to numbers. Anything else yields nothing, not a guess.
 */
export function geoOf(coords: string | null | undefined): { latitude: number; longitude: number } | null {
  if (!coords) return null;
  const re = /(\d+(?:\.\d+)?)°\s*(?:(\d+(?:\.\d+)?)'\s*(?:(\d+(?:\.\d+)?)"?)?)?\s*([NSEW])/g;
  const hits = [...coords.matchAll(re)].map((m) => {
    const v = Number(m[1]) + Number(m[2] ?? 0) / 60 + Number(m[3] ?? 0) / 3600;
    return { v: m[4] === "S" || m[4] === "W" ? -v : v, h: m[4] };
  });
  const lat = hits.find((x) => x.h === "N" || x.h === "S"), lon = hits.find((x) => x.h === "E" || x.h === "W");
  return lat && lon ? { latitude: Number(lat.v.toFixed(6)), longitude: Number(lon.v.toFixed(6)) } : null;
}

/** The region an estate names above its title: "Kodagu" from "Getaway Collective · Kodagu". */
export const regionOf = (eyebrow: string) => plain(eyebrow).replace(/^Getaway Collective\s*·\s*/, "");

/** The estates the site presents, each once: register name where it is a vehicle. */
function places() {
  return Object.values(ESTATES).map((e) => {
    const v = e.vehicleKey ? VEHICLES.find((x) => x.key === e.vehicleKey) : undefined;
    const geo = geoOf(v?.coordinates ?? e.place?.coords);
    const juris = v?.jurisdiction ?? "";
    return {
      slug: e.slug,
      node: {
        "@type": "Place", "@id": `${SITE}/collection/${e.slug}#place`, name: plain(e.name), url: `${SITE}/collection/${e.slug}`,
        description: plain(e.intro).slice(0, 300),
        address: {
          "@type": "PostalAddress", addressLocality: juris.split(",")[0]?.trim() || regionOf(e.eyebrow),
          ...(/Karnataka/.test(juris) ? { addressRegion: "Karnataka" } : {}), addressCountry: "IN",
        },
        ...(geo ? { geo: { "@type": "GeoCoordinates", ...geo } } : {}),
        /* 20 Oct 2026 (LLM discovery): the facts an assistant is asked for,
           in its own terms, from the register. Not printed on the page,
           which keeps to narrative (audit ruling, 15 Oct). */
        ...(v ? { additionalProperty: [
          { "@type": "PropertyValue", name: "Keys", value: v.keys },
          { "@type": "PropertyValue", name: "Stage", value: v.buildStage.replace(/-/g, " ") },
          { "@type": "PropertyValue", name: "Ownership", value: "Held by its own LLP; investors become its partners. Getaway Collective holds no equity." },
        ] } : {}),
      },
    };
  });
}

const organization = () => {
  const founder = peopleOf().find((p) => p.lead);
  return {
    "@type": "Organization", "@id": ORG, name: "Getaway Collective", url: SITE, description: DESCRIPTION, logo: `${SITE}/icon`,
    /* 16 Oct 2026 (LLM discovery): answer engines confuse the name with
       unrelated US companies. This says which one we are, in their terms. */
    disambiguatingDescription: "The Indian platform at getawaycollective.co for owning a share of a retreat estate in Karnataka through its own LLP. Not affiliated with Getaway (getaway.house), Getaway Collection (getaway.co) or Collective Retreats.",
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: ["Collective ownership of retreat estates", "Limited liability partnerships (LLP) in India", "Boutique hospitality in Karnataka", "Kodagu (Coorg)", "Udupi coast", "Revenue waterfall", "Partner governance"],
    ...(founder ? { founder: { "@type": "Person", name: plain(founder.name), jobTitle: plain(founder.role) } } : {}),
  };
};
const website = () => ({ "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "Getaway Collective", publisher: { "@id": ORG }, inLanguage: "en-IN" });
const article = (e: (typeof JOURNAL)[number]) => ({
  "@type": "BlogPosting", "@id": `${SITE}/journal/${e.slug}#article`, url: `${SITE}/journal/${e.slug}`, headline: e.title,
  description: e.standfirst, datePublished: e.published, articleSection: KIND_LABEL[e.kind], author: { "@id": ORG },
  publisher: { "@id": ORG }, inLanguage: "en-IN", mainEntityOfPage: `${SITE}/journal/${e.slug}`,
});
const crumbs = (trail: readonly (readonly [string, string])[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Getaway Collective", ""] as const, ...trail].map(([name, path], i) =>
    ({ "@type": "ListItem", position: i + 1, name, item: `${SITE}${path}` })),
});

/**
 * The structured data for ONE page. 25 Sep 2026.
 *
 * It used to be one graph for the whole site, printed on every page: the
 * FAQ, all thirteen Journal articles and the glossary sat on the contact
 * page and on every estate. Search engines read markup as a claim about
 * the page it is on, and a question-and-answer block on a page that shows
 * no questions is the pattern they discount. Now the organisation and the
 * site appear everywhere, and everything else only where it is shown: an
 * estate on its own pages, an article on its entry, the answers on
 * /answers, the glossary on /glossary.
 */
export function pageGraph(path: string | null | undefined) {
  const p = toInternal((path ?? "/").replace(/\/+$/, "") || "/");
  const graph: Record<string, unknown>[] = [organization(), website()];
  const all = places();
  let m: RegExpMatchArray | null;

  if (p === "/" || p === "/collection") {
    graph.push({
      "@type": "ItemList", "@id": `${SITE}${p === "/" ? "" : p}#estates`, name: "The collection",
      itemListElement: all.map((x, i) => ({ "@type": "ListItem", position: i + 1, item: x.node })),
    });
  } else if ((m = p.match(/^\/collection\/([a-z0-9-]+)(?:\/[a-z-]+)?$/))) {
    const x = all.find((y) => y.slug === m![1]);
    if (x) graph.push(x.node, crumbs([["The collection", "/collection"], [String(x.node.name), `/collection/${x.slug}`]]));
  } else if (p === "/journal") {
    graph.push({
      "@type": "Blog", "@id": `${SITE}/journal#blog`, url: `${SITE}/journal`, name: "The Journal", publisher: { "@id": ORG },
      blogPost: JOURNAL.map((e) => ({ "@type": "BlogPosting", headline: e.title, url: `${SITE}/journal/${e.slug}`, datePublished: e.published })),
    });
  } else if ((m = p.match(/^\/journal\/([a-z0-9-]+)$/))) {
    const e = JOURNAL.find((y) => y.slug === m![1]);
    if (e) graph.push(article(e), crumbs([["The Journal", "/journal"], [e.title, `/journal/${e.slug}`]]));
  } else if (p === "/answers") {
    const qa = rowsOf("answers");
    if (qa.length) graph.push({
      "@type": "FAQPage", "@id": `${SITE}/answers#faq`, url: `${SITE}/answers`,
      mainEntity: qa.map((r) => ({ "@type": "Question", name: plain(r[0]), acceptedAnswer: { "@type": "Answer", text: plain(String(r[1]).replace(/Source ·.*$/, "")) } })),
    });
  } else if (p === "/glossary") {
    const gl = rowsOf("glossary");
    if (gl.length) graph.push({
      "@type": "DefinedTermSet", "@id": `${SITE}/glossary#terms`, url: `${SITE}/glossary`, name: "Getaway Collective glossary",
      hasDefinedTerm: gl.map((r) => ({ "@type": "DefinedTerm", name: plain(r[0]), description: plain(r[1]) })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** JSON for a <script type="application/ld+json">, safe inside HTML. */
export const pageGraphJSON = (path: string | null | undefined) => toPublic(JSON.stringify(pageGraph(path))).replace(/</g, "\\u003c");

/** The plain-text map an answer engine reads first. */
export function llmsTxt(): string {
  const L: string[] = [
    "# Getaway Collective", "", `> ${DESCRIPTION} Capital is at risk.`, "",
    "Figures on this site are read from each vehicle's register; the offering letter governs every one of them. No page states a return.", "",
    "## Company",
    `- [About](${SITE}/about): who we are and what we do not do`,
    `- [Team](${SITE}/team): founder, architect, structural, MEP and modelling practices`,
    `- [How we build](${SITE}/how-we-build): from a confirmed site record to one coordinated model`,
    `- [How it works](${SITE}/how-it-works): units, the waterfall, decisions, nights`,
    `- [How to qualify](${SITE}/how-to-qualify): three steps to owning, and a calculator comparing an estate with an apartment, a fixed deposit and an equity SIP`,
    `- [The operating partner](${SITE}/operating-partner): who runs each estate and how it is measured`,
    `- [Careers](${SITE}/careers): the company's two roles, capital and governance, operations and brand`,
    `- [Press kit](${SITE}/press): boilerplates, fact sheet and usage`, "",
    "## The collection",
    ...places().map(({ node: p }) => `- [${p.name}](${p.url}): ${p.description.slice(0, 160)}`), "",
    "## Answers",
    ...rowsOf("answers").map((r) => `- ${plain(r[0])} ${plain(String(r[1]).replace(/Source ·.*$/, ""))}`), "",
    "## Journal",
    ...JOURNAL.map((e) => `- [${e.title}](${SITE}/journal/${e.slug}): ${e.standfirst}`), "",
    "## Glossary",
    ...rowsOf("glossary").map((r) => `- ${plain(r[0])}: ${plain(r[1])}`), "",
    "## Optional",
    `- [Risk factors](${SITE}/legal/risk-disclosure)`, `- [Terms](${SITE}/legal/terms)`, `- [All documents](${SITE}/legal)`, "",
  ];
  return toPublic(L.join("\n"));
}

/* ── /llms-full.txt ────────────────────────────────────────────────────
   16 Oct 2026 (LLM discovery). The map above points; this is the text an
   answer engine can quote without crawling: the explanatory pages, every
   estate in full, and the Risk Factors as published. Read from the same
   content the pages render, so it cannot say something the site does not.
   Nothing here is new copy. */
type Blk = Readonly<Record<string, unknown>>;
const textOf = (b: Blk): string[] => {
  const out: string[] = [];
  const each = (v: unknown) => (Array.isArray(v) ? v : v == null ? [] : [v]);
  if (b.h) out.push("", `### ${plain(String(b.h).replace(/^<span[^>]*>([^<]*)<\/span>/, "$1: "))}`);
  for (const p of each(b.p)) out.push(plain(p));
  for (const r of each(b.rows)) if (Array.isArray(r)) out.push(`- ${plain(r[0])}: ${plain(String(r[1] ?? "").replace(/Source ·.*$/, ""))}`);
  for (const x of each(b.list)) out.push(`- ${plain(Array.isArray(x) ? x.join(": ") : x)}`);
  for (const s of each(b.steps)) out.push(`- ${plain(Array.isArray(s) ? s.join(": ") : s)}`);
  return out.filter((l, i) => l !== "" || i === 0);
};
const FULL_PAGES = ["/about", "/how-it-works", "/how-to-qualify", "/how-we-build", "/operating-partner"] as const;

export function llmsFullTxt(): string {
  const L: string[] = [llmsTxt(), "", "---", "", "# The full text", ""];
  for (const path of FULL_PAGES) {
    const P = Object.values(PAGES).find((x) => x.path === path);
    if (!P) continue;
    L.push(`## ${plain(P.title)}`, `Source: ${SITE}${path}`, "");
    if (P.lead) L.push(plain(P.lead), "");
    for (const b of P.blocks as readonly Blk[]) L.push(...textOf(b));
    L.push("");
  }
  L.push("## The estates", "");
  for (const { node: p } of places()) L.push(`### ${p.name}`, `Source: ${p.url}`, "", plain(p.description), "");
  const risk = DOCUMENTS.find((d) => d.path === "/legal/risk-disclosure");
  if (risk) {
    L.push(`## ${risk.title} (version ${risk.version}, effective ${risk.effective})`, `Source: ${SITE}${risk.path}`, "", plain(risk.purpose), "");
    for (const part of risk.parts) {
      L.push(`### ${part.ref}. ${plain(part.title)}`);
      if (part.intro) L.push(plain(part.intro));
      for (const c of part.clauses) {
        L.push(`${c.n}${c.h ? ` ${plain(c.h)}.` : ""} ${(c.p ?? []).map(plain).join(" ")}`.trim());
        for (const x of c.list ?? []) L.push(`- ${plain(x)}`);
      }
      L.push("");
    }
  }
  return toPublic(L.join("\n"));
}
