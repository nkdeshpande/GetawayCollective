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
import { JOURNAL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";
import { vehicleBySlug } from "@/constants/vehicles";

const BRAND = "Getaway Collective";
const DEFAULT =
  "An investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own LLP and owned by its partners. Capital is at risk.";

const plain = (s: string | undefined) =>
  (s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
/** Search results show about 160 characters; cut at a word. */
const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:·]$/, "") + "…");

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
    if (CHAPTER[chapter]) return { title: `${name} · ${CHAPTER[chapter]}`, description: `${CHAPTER[chapter]} for ${name}, read from the vehicle register. Capital is at risk.` };
    return { title: name, description: plain(e?.intro) || plain(page?.lead) };
  }
  const page = Object.values(PAGES).find((x) => x.path === pattern);
  return page ? { description: plain(page.lead) } : {};
}

export function pageMeta(pattern: string, params: Readonly<Record<string, string>>, fallbackTitle: string): Metadata {
  const path = pattern.replace(/\[(\w+)\]/g, (_, k: string) => params[k] ?? k);
  const r = resolve(pattern, params);
  const title = r.title ? `${r.title} · ${BRAND}` : fallbackTitle;
  const description = clip(plain(r.description) || DEFAULT);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: BRAND, type: pattern.startsWith("/journal/") ? "article" : "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
