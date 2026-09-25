/**
 * STRUCTURED DATA AND llms.txt — what search and answer engines read
 *
 * 25 Sep 2026. Built from the same sources the pages render — the vehicle
 * register, the site's estates, the Journal, the answers and the glossary —
 * so nothing here is typed twice and nothing can say more than a page does.
 * No figure appears: the graph names places and publications, never prices.
 */

import { VEHICLES } from "@/constants/vehicles";
import { ESTATES } from "@/content/site/estates";
import { PAGES } from "@/content/site/pages";
import { JOURNAL, KIND_LABEL } from "@/content/journal";

export const SITE = "https://www.getawaycollective.co";
const ORG = `${SITE}/#org`;
export const DESCRIPTION =
  "An investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own LLP and owned by its partners. Getaway Collective governs each vehicle and holds no equity in it.";

const plain = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const rowsOf = (key: string): (readonly (string | number)[])[] =>
  (PAGES[key]?.blocks ?? []).flatMap((b) => (b.rows ? [...b.rows] : []));
const peopleOf = () => (PAGES.team?.blocks ?? []).flatMap((b) => (b.people ? [...b.people] : []));

/** The estates the site presents, each once: register name where it is a vehicle. */
function places() {
  return Object.values(ESTATES).map((e) => {
    const v = e.vehicleKey ? VEHICLES.find((x) => x.key === e.vehicleKey) : undefined;
    return {
      "@type": "Place", "@id": `${SITE}/collection/${e.slug}#place`, name: plain(e.name), url: `${SITE}/collection/${e.slug}`,
      description: plain(e.intro).slice(0, 300),
      address: { "@type": "PostalAddress", addressLocality: v?.jurisdiction ?? plain(e.eyebrow), addressCountry: "IN" },
    };
  });
}

export function siteGraph() {
  const founder = peopleOf().find((p) => p.lead);
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": ORG, name: "Getaway Collective", url: SITE, description: DESCRIPTION, logo: `${SITE}/icon`,
      ...(founder ? { founder: { "@type": "Person", name: plain(founder.name), jobTitle: plain(founder.role) } } : {}) },
    { "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "Getaway Collective", publisher: { "@id": ORG }, inLanguage: "en-IN" },
    ...places(),
    ...JOURNAL.map((e) => ({
      "@type": "Article", "@id": `${SITE}/journal/${e.slug}`, url: `${SITE}/journal/${e.slug}`, headline: e.title, description: e.standfirst,
      datePublished: e.published, articleSection: KIND_LABEL[e.kind], author: { "@id": ORG }, publisher: { "@id": ORG }, inLanguage: "en-IN",
    })),
  ];
  const qa = rowsOf("answers");
  if (qa.length) graph.push({ "@type": "FAQPage", "@id": `${SITE}/answers`, url: `${SITE}/answers`,
    mainEntity: qa.map((r) => ({ "@type": "Question", name: plain(r[0]), acceptedAnswer: { "@type": "Answer", text: plain(String(r[1]).replace(/Source ·.*$/, "")) } })) });
  const gl = rowsOf("glossary");
  if (gl.length) graph.push({ "@type": "DefinedTermSet", "@id": `${SITE}/glossary`, url: `${SITE}/glossary`, name: "Getaway Collective glossary",
    hasDefinedTerm: gl.map((r) => ({ "@type": "DefinedTerm", name: plain(r[0]), description: plain(r[1]) })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

/** JSON for a <script type="application/ld+json">, safe inside HTML. */
export const siteGraphJSON = () => JSON.stringify(siteGraph()).replace(/</g, "\\u003c");

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
    `- [How to qualify](${SITE}/how-to-qualify): the sixteen stages of accreditation, before you begin`,
    `- [The operating partner](${SITE}/operating-partner): who runs each estate and how it is measured`,
    `- [Press kit](${SITE}/press): boilerplates, fact sheet and usage`, "",
    "## The collection",
    ...places().map((p) => `- [${p.name}](${p.url}): ${p.description.slice(0, 160)}`), "",
    "## Answers",
    ...rowsOf("answers").map((r) => `- ${plain(r[0])} ${plain(String(r[1]).replace(/Source ·.*$/, ""))}`), "",
    "## Journal",
    ...JOURNAL.map((e) => `- [${e.title}](${SITE}/journal/${e.slug}): ${e.standfirst}`), "",
    "## Glossary",
    ...rowsOf("glossary").map((r) => `- ${plain(r[0])}: ${plain(r[1])}`), "",
    "## Optional",
    `- [Risk factors](${SITE}/legal/risk-disclosure)`, `- [Terms](${SITE}/legal/terms)`, `- [All documents](${SITE}/legal)`, "",
  ];
  return L.join("\n");
}
