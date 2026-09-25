/**
 * THE SITE'S OWN INDEX — what search and the glossary popovers read
 *
 * 25 Sep 2026. One static JSON file, built from the same content the pages
 * render: the estates, the pipeline, the text pages, the Journal, the legal
 * documents, the answers and the glossary. Fetched once, on first use, so
 * no page carries it in its HTML.
 *
 * Titles and summaries only, and nothing behind sign-in: every entry is a
 * page a stranger can already read. No figure is copied here; a result
 * leads to the page that states it.
 */
import { ESTATES } from "@/content/site/estates";
import { PAGES } from "@/content/site/pages";
import { COLLECTION } from "@/content/site/home";
import { JOURNAL, KIND_LABEL } from "@/content/journal";
import { DOCUMENTS } from "@/content/legal";
import { OPERATORS } from "@/content/public";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-static";

const plain = (s: unknown) =>
  String(s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const cut = (s: string, n = 180) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)) + "…");
const rowsOf = (key: string) => (PAGES[key]?.blocks ?? []).flatMap((b) => (b.rows ? [...b.rows] : []));

/** [kind, title, summary, href] */
type Item = readonly [string, string, string, string];

export function GET() {
  const nameOf = (path: string, fallback: string) => ROUTES.find((r) => r.path === path)?.name ?? fallback;
  const items: Item[] = [];
  const seen = new Set<string>();
  const add = (i: Item) => { const k = i[3] + "|" + i[1]; if (!seen.has(k)) { seen.add(k); items.push(i); } };

  /* One entry per estate: the collection's full name ("SlowSpace Creek"),
     the estate page's own introduction where it has one. */
  const intro = new Map(Object.values(ESTATES).map((e) => [`/collection/${e.slug}`, cut(plain(e.intro))]));
  const hrefs = new Set<string>();
  for (const c of COLLECTION) {
    hrefs.add(c.href);
    add([c.stage === "pipe" ? "Pipeline" : "Estate", plain(c.name), intro.get(c.href) ?? plain(`${c.line} · ${c.spec}`), c.href]);
  }
  for (const e of Object.values(ESTATES)) if (!hrefs.has(`/collection/${e.slug}`)) add(["Estate", plain(e.name), cut(plain(e.intro)), `/collection/${e.slug}`]);
  for (const p of Object.values(PAGES)) {
    if (hrefs.has(p.path)) continue;
    if (p.path.startsWith("/collection/")) add(["Pipeline", plain(p.title).replace(/\.$/, ""), cut(plain(p.lead)), p.path]);
    /* A page is found by its name ("Press Kit"), and its headline is the summary. */
    else add(["Page", nameOf(p.path, plain(p.eyebrow)), cut(`${plain(p.title)} ${plain(p.lead)}`), p.path]);
  }
  add(["Page", nameOf("/how-to-qualify", "How to qualify"), "Three steps to owning a retreat, and what the same sum does four ways.", "/how-to-qualify"]);
  add(["Page", nameOf("/operating-partner", "The operating partner"), cut(plain(OPERATORS.standfirst)), "/operating-partner"]);
  add(["Page", nameOf("/careers", "Careers"), "Two roles: the master developer and asset manager, and the operating and brand partner.", "/careers"]);
  add(["Page", nameOf("/collection", "The collection"), "Every estate, where it stands, side by side.", "/collection"]);
  add(["Page", nameOf("/journal", "The Journal"), "One decision an entry, with what it cost.", "/journal"]);
  for (const j of JOURNAL) add([`Journal · ${KIND_LABEL[j.kind]}`, j.title, j.standfirst, `/journal/${j.slug}`]);
  for (const d of DOCUMENTS) add(["Legal", d.title, d.purpose, d.path]);
  for (const r of rowsOf("answers")) add(["Answer", plain(r[0]), cut(plain(String(r[1]).replace(/Source ·.*$/, ""))), "/answers"]);

  const glossary = rowsOf("glossary").map((r) => [plain(r[0]), plain(r[1])] as const);
  for (const [t, d] of glossary) add(["Glossary", t, d, "/glossary"]);

  return Response.json({ v: 1, items, glossary }, { headers: { "cache-control": "public, max-age=3600, s-maxage=86400" } });
}
