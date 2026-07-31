/**
 * AS-29 · THE STANDING DOCUMENT
 * AS-30 · THE JOURNAL
 *
 * Two renderers. The prose lives in content/, so editing a clause and
 * editing a layout are never the same operation.
 *
 * ── GROUND ───────────────────────────────────────────────────────────
 * Void is narrative; paper is an assertion the platform will be held to.
 * A clause marked `assertion` renders on paper, and so does a Journal
 * `assert` block. That is the ground inversion carrying meaning rather
 * than decorating a page.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DOCUMENTS, documentByPath, readingMinutes, wordCount,
  type StandingDocument, type Clause,
} from "@/content/legal";
import { JOURNAL, entryBySlug, JOURNAL_INTRO, KIND_LABEL, type Entry, type Block } from "@/content/journal";
import { Footer } from "./atoms";

/* ── Shared ───────────────────────────────────────────────────────── */

function DocHead({ d }: { d: StandingDocument }) {
  return (
    <div className="sec-head" style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--gc-sp-2xs)" }}>
      <span className="sec-ref">
        {d.id} · Version {d.version} · In force from {d.effective}
      </span>
      <h1 className="t-display-l">{d.title}</h1>
      <p className="t-body-l dim measure">{d.purpose}</p>
      <span className="t-mono-s dim">
        {wordCount(d).toLocaleString("en-IN")} words · about {readingMinutes(d)} minutes
      </span>
    </div>
  );
}

function ClauseBody({ c }: { c: Clause }) {
  return (
    <>
      {(c.p ?? []).map((para, i) => (
        <p key={i} className="t-body measure" style={{ marginTop: i ? "var(--gc-sp-s)" : 0 }}>
          {para}
        </p>
      ))}
      {c.list ? (
        <ul className="t-body measure" style={{ marginTop: "var(--gc-sp-s)", paddingLeft: "1.1em" }}>
          {c.list.map((item, i) => (
            <li key={i} style={{ marginBottom: "var(--gc-sp-2xs)" }}>{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-29 · A STANDING DOCUMENT
   ═══════════════════════════════════════════════════════════════════ */

export function StandingDoc({ path }: { path: string }) {
  const d = documentByPath(path);
  /* notFound(), not a fallback render. Returning the index for an
     unrecognised path answers a request for a document that does not
     exist with HTTP 200 and a page of other documents, which tells a
     crawler the URL is real and tells a reader they found something. */
  if (!d) notFound();

  return (
    <>
      <section data-sec="AS-29.a">
        <div className="wrap">
          <DocHead d={d} />
        </div>
      </section>

      {/* AS-29.b — contents. An anchor list, so a reader can return to
          one clause rather than re-reading to find it. */}
      <section data-sec="AS-29.b">
        <div className="wrap">
          <span className="t-micro label">Contents</span>
          <ol style={{ marginTop: "var(--gc-sp-s)", paddingLeft: 0, listStyle: "none" }}>
            {d.parts.map((part) => (
              <li key={part.ref} style={{ marginBottom: "var(--gc-sp-2xs)" }}>
                <a href={`#part-${part.ref}`} className="t-body">
                  <span className="t-mono-s dim" style={{ marginRight: "var(--gc-sp-xs)" }}>
                    {part.ref}
                  </span>
                  {part.title}
                </a>
                <span className="t-mono-s dim" style={{ marginLeft: "var(--gc-sp-2xs)" }}>
                  {part.clauses.length} {part.clauses.length === 1 ? "clause" : "clauses"}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AS-29.c / AS-29.d — body, with assertions on paper. */}
      {d.parts.map((part) => (
        <section key={part.ref} data-sec="AS-29.c" id={`part-${part.ref}`}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-ref">Part {part.ref}</span>
              <h2 className="t-display-s">{part.title}</h2>
            </div>
            {part.intro ? (
              <p className="t-body-l dim measure" style={{ marginBottom: "var(--gc-sp-l)" }}>
                {part.intro}
              </p>
            ) : null}

            {part.clauses.map((c) =>
              c.assertion ? (
                <div key={c.n} id={`c-${c.n}`} className="panel on-paper"
                     style={{ marginBottom: "var(--gc-sp-m)" }}>
                  <span className="t-mono-s label">{c.n}</span>
                  {c.h ? (
                    <h3 className="t-body-l" style={{ marginTop: "var(--gc-sp-3xs)", fontWeight: 600 }}>
                      {c.h}
                    </h3>
                  ) : null}
                  <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ClauseBody c={c} /></div>
                </div>
              ) : (
                <div key={c.n} id={`c-${c.n}`} style={{ marginBottom: "var(--gc-sp-m)" }}>
                  <span className="t-mono-s dim">{c.n}</span>
                  {c.h ? (
                    <h3 className="t-body-l" style={{ marginTop: "var(--gc-sp-3xs)", fontWeight: 600 }}>
                      {c.h}
                    </h3>
                  ) : null}
                  <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ClauseBody c={c} /></div>
                </div>
              ),
            )}
          </div>
        </section>
      ))}

      {/* AS-29.e — every link states what the other document adds. */}
      {d.alongside?.length ? (
        <section data-sec="AS-29.e">
          <div className="wrap">
            <span className="t-micro label">Read alongside</span>
            <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-s)" }}>
              {d.alongside.map((a) => (
                <Link key={a.path} href={a.path} className="panel on-panel"
                      style={{ flex: "1 1 300px", textDecoration: "none" }}>
                  <span className="t-body-l" style={{ fontWeight: 600 }}>{a.title}</span>
                  <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-3xs)" }}>{a.why}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </>
  );
}

/* The /legal index. */
export function DocumentIndex() {
  return (
    <>
      <section data-sec="AS-29.a">
        <div className="wrap">
          <span className="sec-ref">Standing documents</span>
          <h1 className="t-display-l">Legal</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Every document that binds, with its version, when it took force, and how long it takes
            to read. Nothing here is summarised elsewhere in a friendlier form.
          </p>
        </div>
      </section>

      <section data-sec="AS-29.b">
        <div className="wrap">
          <div className="row" style={{ gap: "var(--gc-sp-s)" }}>
            {DOCUMENTS.map((d) => (
              <Link key={d.path} href={d.path} className="panel on-panel"
                    style={{ flex: "1 1 340px", textDecoration: "none" }}>
                <span className="t-mono-s dim">{d.id} · v{d.version}</span>
                <h2 className="t-body-l" style={{ marginTop: "var(--gc-sp-3xs)", fontWeight: 600 }}>
                  {d.title}
                </h2>
                <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{d.purpose}</p>
                <span className="t-mono-s dim" style={{ display: "block", marginTop: "var(--gc-sp-2xs)" }}>
                  {readingMinutes(d)} min · in force from {d.effective}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-30 · THE JOURNAL
   ═══════════════════════════════════════════════════════════════════ */

function JournalBlock({ b }: { b: Block }) {
  switch (b.t) {
    case "h":
      return (
        <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-xl)" }}>{b.x}</h2>
      );
    case "p":
      return <p className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{b.x}</p>;
    case "list":
      return (
        <ul className="t-body measure" style={{ marginTop: "var(--gc-sp-s)", paddingLeft: "1.1em" }}>
          {b.x.map((item, i) => (
            <li key={i} style={{ marginBottom: "var(--gc-sp-2xs)" }}>{item}</li>
          ))}
        </ul>
      );
    case "assert":
      return (
        <div className="panel on-paper" style={{ marginTop: "var(--gc-sp-m)" }}>
          <span className="t-micro label">Assertion</span>
          <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)" }}>{b.x}</p>
        </div>
      );
    case "figure":
      return (
        <div className="panel on-panel" style={{ marginTop: "var(--gc-sp-m)", maxWidth: "420px" }}>
          <span className="t-micro label">{b.label}</span>
          <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-3xs)" }}>{b.value}</div>
          <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{b.source}</p>
        </div>
      );
  }
}

export function JournalEntry({ slug }: { slug: string }) {
  const e = entryBySlug(slug);
  /* The slug comes from the URL, so this is reachable by typing. */
  if (!e) notFound();

  return (
    <>
      <section data-sec="AS-30.b">
        <div className="wrap">
          <div className="sec-head" style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--gc-sp-2xs)" }}>
            <span className="sec-ref">
              {e.id} · {KIND_LABEL[e.kind]} · {e.published}
            </span>
            <h1 className="t-display-l">{e.title}</h1>
            <p className="t-body-l dim measure">{e.standfirst}</p>
            <span className="t-mono-s dim">about {e.minutes} minutes</span>
          </div>

          {e.body.map((b, i) => <JournalBlock key={i} b={b} />)}

          {/* AS-30.c — what this entry depends on, and where it was read. */}
          {e.cites?.length ? (
            <div className="panel on-panel" style={{ marginTop: "var(--gc-sp-xl)" }}>
              <span className="t-micro label">Figures in this entry are read from</span>
              <div style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {e.cites.map((c) => (
                  <div key={c.what} className="kv">
                    <span className="label t-micro">{c.what}</span>
                    <span className="v t-mono-s">{c.value}</span>
                  </div>
                ))}
              </div>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                Read from the registry when this page rendered, not typed into the text. An entry
                cannot describe a platform that does not exist.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {e.onward?.length ? (
        <section data-sec="AS-30.d">
          <div className="wrap">
            <span className="t-micro label">Onward</span>
            <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-s)" }}>
              {e.onward.map((o) => (
                <Link key={o.path} href={o.path} className="panel on-panel"
                      style={{ flex: "1 1 300px", textDecoration: "none" }}>
                  <span className="t-body-l" style={{ fontWeight: 600 }}>{o.title}</span>
                  <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-3xs)" }}>{o.why}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  );
}

export function JournalIndex() {
  /* Newest first. The source is ordered oldest first and checked at load,
     so this reverse is the only place the display order is decided. */
  const entries: Entry[] = [...JOURNAL].reverse();

  return (
    <>
      <section data-sec="AS-30.a">
        <div className="wrap">
          <span className="sec-ref">The Journal</span>
          <h1 className="t-display-l">One decision at a time</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            {JOURNAL_INTRO}
          </p>
        </div>
      </section>

      <section data-sec="AS-30.a">
        <div className="wrap">
          <div className="stack">
            {entries.map((e) => (
              <Link key={e.slug} href={`/journal/${e.slug}`} className="panel on-panel"
                    style={{ textDecoration: "none" }}>
                <div className="kv" style={{ borderBottom: "none", paddingBottom: 0 }}>
                  <span className="t-mono-s dim">{e.id} · {KIND_LABEL[e.kind]}</span>
                  <span className="t-mono-s dim">{e.published} · {e.minutes} min</span>
                </div>
                <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-2xs)" }}>{e.title}</h2>
                <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  {e.standfirst}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
