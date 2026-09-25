/**
 * THE DOCKET AND THE GATES — two assemblies for papers and processes
 *
 * 25 Sep 2026, from the founder's references (folder tabs over a paper
 * folder; the StageGate accordion). Server-rendered markup, wired in
 * ./behaviour.tsx; every tab and every stage is in the page, so a reader
 * without script, and a search engine, still gets all of it.
 *
 * THE DOCKET. A file of documents as a row of numbered tabs over one paper
 * folder, each tab its own paper colour so position is remembered by hue.
 * Two instances:
 *   - rulebookDocket()  the seven standing documents, from content/legal.ts
 *   - estateDocket(v)   one estate's papers, each status read from the
 *                       vehicle register; nothing is marked held that the
 *                       register does not hold, and a gap says what it is.
 * Tabs are cut, never rounded (RADIUS.none), and every stamp is a word.
 *
 * THE GATES. A sequence as a row of cards, one open at a time, the open one
 * given the width. Content comes from the page that uses it.
 */

import { DOCUMENTS, readingMinutes } from "@/content/legal";
import { TENURE_LABEL, BUILD_LABEL, type Vehicle } from "@/constants/vehicles";
import { plainTerms } from "@/lib/plain";
/* Local, not imported from ./render, which imports this file. */
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The papers a tab can be, in the order a docket cycles through them. */
const PAPERS = ["kraft", "sage", "haze", "clay"] as const;

export interface DocketTab {
  readonly label: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly meta?: string;
  /** One word, stamped on the folder: PUBLIC, ON RECORD, ON REQUEST, NOT YET. */
  readonly stamp: string;
  readonly stampTone?: "ok" | "wait" | "open";
  readonly purpose: string;
  readonly lists?: readonly { readonly h: string; readonly items: readonly string[] }[];
  readonly links?: readonly (readonly [label: string, href: string])[];
}

const dt = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
};
const pct = (bps: number) => `${(bps / 100).toFixed(bps % 100 ? 2 : 0)}%`;

export function DOCKET(id: string, label: string, tabs: readonly DocketTab[]): string {
  const paper = (i: number) => `var(--gc-s-${PAPERS[i % PAPERS.length]})`;
  return `<div class="dkt" data-dkt><div class="dkt-tabs" role="tablist" aria-label="${esc(label)}">` +
    tabs.map((t, i) => `<button type="button" role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--t:${paper(i)}">` +
      `<span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(t.label)}</b></button>`).join("") +
    "</div>" +
    tabs.map((t, i) => `<section class="dkt-p" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}" tabindex="0" style="--t:${paper(i)}"${i ? " hidden" : ""}>` +
      `<header><span class="eb">${esc(t.eyebrow)} · ${String(i + 1).padStart(2, "0")} of ${String(tabs.length).padStart(2, "0")}</span>` +
      `<span class="dkt-stamp${t.stampTone ? ` ${t.stampTone}` : ""}">${esc(t.stamp)}</span></header>` +
      `<h3>${esc(t.title)}</h3>${t.meta ? `<p class="mono dkt-meta">${esc(t.meta)}</p>` : ""}<p class="dkt-purpose">${esc(t.purpose)}</p>` +
      (t.lists?.length ? `<div class="dkt-lists">${t.lists.map((l) => `<div><span class="eb">${esc(l.h)}</span><ul>${l.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>` : "") +
      (t.links?.length ? `<footer>${t.links.map((l, j) => `<a class="btn ${j ? "gray" : "dark"}" href="${l[1]}">${esc(l[0])}</a>`).join("")}</footer>` : "") +
      "</section>").join("") +
    "</div>";
}

const TAB_NAME: Readonly<Record<string, string>> = {
  terms: "Terms", "risk-disclosure": "Risk", privacy: "Privacy", cookies: "Cookies",
  disclosures: "Disclosures", complaints: "Complaints", accessibility: "Accessibility",
};

/** The seven standing documents, as one docket. */
export function rulebookDocket(): string {
  return DOCKET("rules", "The standing documents", DOCUMENTS.map((d) => ({
    /* A tab is named by the document's address, so two titles that share a word never share a tab name. */
    label: TAB_NAME[d.path.replace("/legal/", "")] ?? d.title,
    eyebrow: "Standing document",
    title: d.title,
    meta: `Version ${d.version} · effective ${dt(d.effective)} · ${readingMinutes(d)} min read`,
    stamp: "Public",
    stampTone: "ok",
    purpose: d.purpose,
    lists: [
      { h: `What it covers · ${d.parts.length} parts`, items: d.parts.map((p) => `${p.ref} · ${p.title}`) },
      ...(d.alongside?.length ? [{ h: "Read alongside", items: d.alongside.map((a) => `${a.title}: ${a.why}`) }] : []),
    ],
    links: [["Read it in full", d.path], ...(d.alongside?.[0] ? [[d.alongside[0].title, d.alongside[0].path] as const] : [])],
  })));
}

/**
 * One estate's papers. Each tab's stamp is decided by the register field
 * behind it, so a paper the register does not hold can never read as held.
 */
export function estateDocket(v: Vehicle, name: string, publishable: boolean): string {
  const g = v.governance;
  const titled = v.tenure === "title-verified" || v.tenure === "conveyance-complete";
  const tabs: DocketTab[] = [
    {
      label: "The LLP", eyebrow: "The vehicle", title: v.registeredName,
      meta: v.incorporated ? `Incorporated ${dt(v.incorporated)} · ${v.registrar}` : `Registrar · ${v.registrar}`,
      stamp: v.llpin ? "On record" : "Not yet", stampTone: v.llpin ? "ok" : "open",
      purpose: v.llpin
        ? `The partnership that holds ${name}. Its LLP identification number (LLPIN) is ${v.llpin}.`
        : `The partnership that will hold ${name}. It is not yet incorporated, so it has no LLP identification number yet.`,
      lists: v.registeredOffice ? [{ h: "Registered office", items: [v.registeredOffice] }] : [],
    },
    {
      label: "Agreement", eyebrow: "The LLP agreement", title: "LLP agreement",
      meta: v.agreementDated ? `Dated ${dt(v.agreementDated)}` : undefined,
      stamp: v.agreementDated ? "On record" : "Not yet", stampTone: v.agreementDated ? "ok" : "open",
      purpose: v.agreementDated
        ? "The agreement every partner signs. Where it and this site differ, the agreement governs."
        : "Not yet executed. Until it is, nothing on this page is a term of partnership.",
      lists: g ? [{ h: "How the partners decide", items: [
        `Ordinary resolution · ${pct(g.ordinaryBps)} of voting interest`,
        `Special resolution · ${pct(g.specialBps)} of voting interest`,
        `Quorum · ${pct(g.quorumBps)}`,
        `Transfers · ${plainTerms(g.transferRule)}`,
      ] }] : [],
    },
    {
      label: "Offering", eyebrow: "The offering pack", title: `The ${name} offering pack`,
      stamp: publishable ? "On request" : "Not yet", stampTone: publishable ? "wait" : "open",
      purpose: publishable
        ? "The drawings, the structure of the LLP, the waterfall and the risk disclosure, in one document. Sent after a short qualification."
        : "Not yet published: the figures it would be priced from are still being confirmed.",
      links: publishable ? [["Request the pack", `/collection/${v.slug}/enquire`], ["How to qualify", "/how-to-qualify"]] : [],
    },
    {
      label: "Land", eyebrow: "Land and title", title: v.landArea,
      meta: `${v.jurisdiction} · ${BUILD_LABEL[v.buildStage]}`,
      stamp: titled ? "On record" : v.tenure ? "In progress" : "Not on file",
      stampTone: titled ? "ok" : v.tenure ? "wait" : "open",
      purpose: v.tenure ? TENURE_LABEL[v.tenure] + "." : "How the land is held is not yet on file, so this page does not guess at it.",
    },
    {
      label: "Accounts", eyebrow: "The accounts", title: v.audited ? "Audited accounts" : "Accounts",
      stamp: v.audited ? "On record" : "Not yet", stampTone: v.audited ? "ok" : "open",
      purpose: v.audited
        ? "This partnership's accounts are audited. They are not published on this site."
        : "No audited accounts exist yet for a vehicle that has not yet traded.",
    },
    ...DOCUMENTS.filter((d) => d.path === "/legal/risk-disclosure" || d.path === "/legal/terms").map((d): DocketTab => ({
      label: d.path.endsWith("terms") ? "Terms" : "Risk", eyebrow: "Standing document", title: d.title,
      meta: `Version ${d.version} · ${readingMinutes(d)} min read`, stamp: "Public", stampTone: "ok",
      purpose: d.purpose, links: [["Read it in full", d.path]],
    })),
  ];
  return DOCKET(`dk-${v.slug}`, `${name}: the papers`, tabs);
}

/* ── THE GATES ─────────────────────────────────────────────────────── */
export interface Gate { readonly t: string; readonly sub?: string; readonly text?: string; readonly items?: readonly (readonly [string, string])[] }

export function GATES(id: string, label: string, gates: readonly Gate[]): string {
  return `<div class="stgs" data-gates role="tablist" aria-label="${esc(label)}">` +
    gates.map((g, i) => `<button type="button" class="stg${i === 0 ? " on" : ""}" role="tab" id="${id}-g${i}" aria-selected="${i === 0}" aria-controls="${id}-d${i}" tabindex="${i === 0 ? 0 : -1}">` +
      `<span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(g.t)}</b>${g.sub ? `<em>${esc(g.sub)}</em>` : ""}</button>`).join("") +
    "</div>" +
    `<div class="stgs-d">${gates.map((g, i) => `<div class="stg-d" role="tabpanel" id="${id}-d${i}" aria-labelledby="${id}-g${i}"${i ? " hidden" : ""}>` +
      `<span class="eb">${String(i + 1).padStart(2, "0")} of ${String(gates.length).padStart(2, "0")}</span><h3>${esc(g.t)}</h3>` +
      (g.text ? `<p>${esc(g.text)}</p>` : "") +
      (g.items?.length ? `<ol>${g.items.map((x) => `<li><b>${esc(x[0])}</b><span>${esc(x[1])}</span></li>`).join("")}</ol>` : "") +
      "</div>").join("")}</div>`;
}
