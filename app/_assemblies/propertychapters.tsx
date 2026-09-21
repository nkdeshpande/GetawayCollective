/**
 * ONE PROPERTY, NINE SURFACES — the chapter nav and the chapter page.
 *
 * `ChapterNav` is the navigation the property pages never had. `ChapterSurface`
 * is what the eight non-opening chapters render: a header that says which
 * property you are on, the nav, the chapter's own content read from the
 * vehicle record, and one onward control.
 *
 * The opening chapter (`/collection/[vehicle]`) keeps its existing full
 * property page and takes only the nav — replacing it would have thrown
 * away a built wireframe to make the tabs uniform, which is the wrong
 * trade.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CHAPTERS, PARTS, chapterHref, nextChapter, partHead, partSpan,
  type Chapter, type ChapterId,
} from "@/constants/property-chapters";
import { LIFECYCLE_LABEL, stanceFor, vehicleBySlug } from "@/constants/vehicles";
import { chapterContent } from "./propertychapter";
import { UnitSet } from "./unitplate";

/** Which chapter a generated page is, from the path it was generated for. */
function chapterForPath(path: string): Chapter | undefined {
  const suffix = path.replace("/collection/[vehicle]", "");
  return CHAPTERS.find((c) => c.suffix === suffix);
}

export function ChapterNav({ slug, current }: { slug: string; current: ChapterId }) {
  /*
   * FIVE TABS, NOT TEN — founder instruction, 21 Sep 2026.
   *
   * Each tab is a PART: a contiguous run of chapters, named by its first
   * chapter and linking to it (constants/property-chapters.ts holds the
   * grouping and the three rules it keeps). The chapters inside a part are
   * reached by the onward control at the foot of each page, as they always
   * were — so the argument is still read in order, and Risk is still a tab
   * of its own that sits before Enquire.
   */
  return (
    <nav className="chapter-nav" aria-label="This property">
      <ul>
        {PARTS.map((p) => {
          const head = partHead(p);
          const inPart = p.chapters.includes(current);
          const span = partSpan(p);
          return (
            <li key={head.id}>
              <Link
                href={chapterHref(slug, head)}
                className={inPart ? "active" : undefined}
                /* "page" only when the tab IS this page. Inside a part, on
                   one of its later chapters, the tab is the current ITEM in
                   the set and not a link to the current page. */
                aria-current={head.id === current ? "page" : inPart ? "true" : undefined}
              >
                {/* The number carries the order, so it is shown rather than
                    implied by position — a reader who lands on 06 from a
                    search result should see there are five before it. A
                    part shows the span it covers: 02 lives under 00–02. */}
                {span && <b>{span}</b>}
                <span>{head.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ChapterSurface({ path, param }: { path: string; param: string }) {
  const chapter = chapterForPath(path);
  const v = vehicleBySlug(param);
  if (!chapter || !v) notFound();

  const c = chapterContent(v, chapter.id);
  const next = nextChapter(chapter.id);
  const stance = stanceFor(v);

  return (
    <main className="chapter" data-chapter={chapter.id}>
      <header className="chapter-head">
        <div className="wrap">
          <p className="chapter-crumb t-micro">
            <Link href="/collection">The Collection</Link>
            <span aria-hidden="true"> / </span>
            {v.propertyName}
          </p>
          {/* Not an h1. The group layout already gives the page one — the
              chapter's own name — and a second would leave the document with
              two, which is the kind of defect that only shows up in a
              screen reader and never on screen. This is the subject the
              chapter is about, so it labels the section rather than
              competing to head the page. */}
          <p className="chapter-property t-display-m">{v.propertyName}</p>
          <p className="chapter-facts t-micro">
            <span>{v.jurisdiction}</span>
            <span>{v.keys} keys</span>
            <span className={stance.kind === "open" ? "chapter-open" : undefined}>
              {LIFECYCLE_LABEL[v.lifecycle]}
            </span>
          </p>
        </div>
      </header>

      <ChapterNav slug={v.slug} current={chapter.id} />

      <section className="chapter-body">
        <div className="wrap">
          <p className="eyebrow t-micro">{c.eyebrow}</p>
          <h2 className="t-display-m">{c.title}</h2>
          <p className="chapter-lead t-body-l">{c.lead}</p>

          {/* The keys come BEFORE the ledger rows. On a chapter about what
              is being built, the thing being built leads and the table
              supports it — the other way round is a spreadsheet with a
              picture attached. */}
          {c.units && c.units.length > 0 && <UnitSet units={c.units} />}

          {c.intent && c.intent.length > 0 && (
            <div className="intent">
              {c.intent.map((i) => (
                <div className="intent-block" key={i.label}>
                  <p className="t-micro">{i.label}</p>
                  <p className="t-body-l">{i.text}</p>
                </div>
              ))}
            </div>
          )}

          {c.palette && c.palette.length > 0 && (
            <div className="intent">
              <div className="intent-block">
                <p className="t-micro">MATERIAL</p>
                <div className="palette">
                  {c.palette.map((m) => (
                    <article key={m.material}>
                      <h4>{m.material}</h4>
                      <p className="t-body-s">{m.role}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          <dl className="chapter-rows">
            {c.rows.map((r) => (
              <div key={r.label}>
                <dt className="t-micro">{r.label}</dt>
                <dd className="chapter-value">{r.value}</dd>
                <dd className="chapter-basis t-body-s">{r.basis}</dd>
              </div>
            ))}
          </dl>

          {c.withheld.length > 0 && (
            <aside className="chapter-withheld">
              <p className="t-micro">WHY FIGURES ARE NOT SHOWN HERE</p>
              <ul>
                {c.withheld.map((w) => (
                  <li key={w} className="t-body-s">{w}</li>
                ))}
              </ul>
            </aside>
          )}

          {next && (
            <p className="chapter-onward">
              <Link className="btn" href={chapterHref(v.slug, next)}>
                {next.n ? `${next.n} · ` : ""}{next.label} &rarr;
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
