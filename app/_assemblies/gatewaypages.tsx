/**
 * THE REMAINING GATEWAY SURFACES
 *
 * Wave 8 · AS-07, AS-08, AS-09, AS-17, AS-18
 *
 * Five pages linked from the footer that rendered the registry scaffold.
 * Copy lives in content/gateway.ts; the rules each of these has to obey
 * are already declared on the assemblies, and are quoted where they
 * decided something here.
 */

"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  BRANDS, FRAMES, FRAMES_NOTE, ANSWERS, HOW_WE_WORK, ROLES, APPLYING,
  type Frame,
} from "@/content/gateway";
import { plate } from "./data";
import { Footer } from "./atoms";

/* ═══════════════════════════════════════════════════════════════════
   AS-07 · THE PORTFOLIO NARRATIVE
   ═══════════════════════════════════════════════════════════════════ */

export function Portfolio() {
  return (
    <>
      <section data-sec="AS-07.a">
        <div className="wrap">
          <span className="sec-ref">AS-07 · The Portfolio Narrative</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            What actually gets built
          </h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Three brands. They differ in where they can be sited and in what the site does to the
            specification, which is a more useful distinction than a difference in styling.
          </p>
        </div>
      </section>

      {BRANDS.map((b) => (
        <section key={b.name} data-sec="AS-07.b">
          <div className="wrap">
            <div style={{ ...plate(b.hue), height: "180px", marginBottom: "var(--gc-sp-m)" }} />
            <div className="sec-head">
              <span className="sec-ref">{b.name}</span>
              <span className="t-micro label">{b.position}</span>
            </div>
            {b.body.map((p, i) => (
              <p key={i} className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{p}</p>
            ))}

            {/* AS-07.c — descriptive only. No figure appears in this grid;
                it is not a comparison table, and a load-time check in
                content/gateway.ts refuses one. */}
            <div className="row" style={{ marginTop: "var(--gc-sp-l)", gap: "var(--gc-sp-s)" }}>
              {b.attributes.map((a) => (
                <div key={a.k} className="panel on-panel" style={{ flex: "1 1 240px" }}>
                  <span className="t-micro label">{a.k}</span>
                  <p className="t-body-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>{a.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section data-sec="AS-07.d">
        <div className="wrap">
          <span className="t-micro label">Onward</span>
          <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-2xs)" }}>
            <Link className="btn" href="/collection">The collection</Link>
            <Link className="btn" href="/space">The physical product</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-09 · THE GALLERY FRAME

   AS-09.a: "Advances only on intent. Nothing auto-plays, so no pause
   control is owed and none is faked."
   AS-09.b: "Every frame is reachable without passing through the others."
   ═══════════════════════════════════════════════════════════════════ */

function FramePlate({ f }: { f: Frame }) {
  return (
    <div style={{ ...plate(f.hue), height: "min(58vh, 460px)", position: "relative" }}>
      {/* The kind is on the frame, not in a caption underneath it. A
          label that can be scrolled away from the image it qualifies is
          not a label. */}
      <span className="t-mono-s"
            style={{ position: "absolute", top: "var(--gc-sp-s)", left: "var(--gc-sp-s)",
                     background: "var(--gc-void)", color: "var(--gc-ink-inverse)",
                     padding: "var(--gc-sp-3xs) var(--gc-sp-2xs)", textTransform: "uppercase",
                     letterSpacing: ".14em" }}>
        {f.kind} · {f.taken}
      </span>
    </div>
  );
}

export function Gallery() {
  const [i, setI] = useState(0);
  const rail = useRef<(HTMLButtonElement | null)[]>([]);
  const f = FRAMES[i];

  const go = (n: number) => setI(((n % FRAMES.length) + FRAMES.length) % FRAMES.length);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(FRAMES.length - 1); }
  };

  return (
    <>
      <section data-sec="AS-09.a">
        <div className="wrap">
          <span className="sec-ref">AS-09 · The Gallery Frame</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Gallery</h1>

          <div
            role="group"
            aria-roledescription="gallery"
            aria-label={`Frame ${i + 1} of ${FRAMES.length}`}
            tabIndex={0}
            onKeyDown={onKey}
            style={{ marginTop: "var(--gc-sp-l)", outlineOffset: "2px" }}
          >
            <FramePlate f={f} />
            <div className="kv" style={{ marginTop: "var(--gc-sp-s)" }}>
              <span className="label t-micro">{f.place}</span>
              <span className="v t-body-s">{f.caption}</span>
            </div>
          </div>

          {/* Advances only on intent. No autoplay, so no pause control
              is owed and none is faked. */}
          <div className="row" style={{ marginTop: "var(--gc-sp-m)", gap: "var(--gc-sp-2xs)" }}>
            <button className="btn" onClick={() => go(i - 1)}>← Previous</button>
            <button className="btn" onClick={() => go(i + 1)}>Next →</button>
            <span className="t-mono-s dim" style={{ alignSelf: "center" }}>
              {i + 1} / {FRAMES.length}
            </span>
          </div>
        </div>
      </section>

      {/* AS-09.b — every frame directly reachable. */}
      <section data-sec="AS-09.b">
        <div className="wrap">
          <span className="t-micro label">Every frame</span>
          <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-2xs)" }}>
            {FRAMES.map((x, n) => (
              <button
                key={x.ref}
                ref={(el) => { rail.current[n] = el; }}
                className={"btn" + (n === i ? " primary" : "")}
                aria-current={n === i ? "true" : undefined}
                onClick={() => go(n)}
              >
                {x.ref}
              </button>
            ))}
          </div>
          <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            {FRAMES_NOTE}
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-08 · THE STORY PLAYBACK

   AS-08.b: "NO FIGURE APPEARS IN THE PLAYER."
   AS-08.c: "Exit always visible, always reachable by Escape."
   ═══════════════════════════════════════════════════════════════════ */

export function Story() {
  const [open, setOpen] = useState<number | null>(null);

  const close = () => setOpen(null);
  const step = (d: number) =>
    setOpen((n) => (n === null ? null : ((n + d) % FRAMES.length + FRAMES.length) % FRAMES.length));

  return (
    <>
      <section data-sec="AS-08.a">
        <div className="wrap">
          <span className="sec-ref">AS-08 · The Story Playback</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Story</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            A place in sequence. Each tile opens the sequence at its own index, so nobody has to
            watch four frames to reach the fifth.
          </p>

          <div className="row" style={{ marginTop: "var(--gc-sp-l)", gap: "var(--gc-sp-s)" }}>
            {FRAMES.map((x, n) => (
              <button key={x.ref} className="panel on-panel"
                      onClick={() => setOpen(n)}
                      style={{ flex: "1 1 220px", textAlign: "left", cursor: "pointer",
                               border: "1px solid var(--gc-hairline-inv)" }}>
                <div style={{ ...plate(x.hue), aspectRatio: "4 / 5" }} />
                <span className="t-mono-s dim" style={{ display: "block", marginTop: "var(--gc-sp-2xs)" }}>
                  {x.ref} · {x.kind}
                </span>
                <span className="t-body-s" style={{ display: "block" }}>{x.place}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open !== null ? (
        <div className="modal-back" role="presentation"
             onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="modal" role="dialog" aria-modal="true"
               aria-label={`Frame ${open + 1} of ${FRAMES.length}`}
               onKeyDown={(e) => {
                 if (e.key === "Escape") close();
                 else if (e.key === "ArrowRight") step(1);
                 else if (e.key === "ArrowLeft") step(-1);
               }}
               style={{ background: "var(--gc-void)", color: "var(--gc-ink-inverse)" }}>
            <div className="modal-head">
              <span className="t-mono-s dim">
                {FRAMES[open].ref} · {FRAMES[open].kind} · {open + 1} of {FRAMES.length}
              </span>
              {/* Always visible. Not revealed on hover, not in a corner
                  that disappears. */}
              <button className="btn" onClick={close} autoFocus>Close</button>
            </div>
            <div className="modal-body">
              <FramePlate f={FRAMES[open]} />
              {/* AS-08.b — no figure in the player. A number on a card in
                  a sequence cannot be read, checked or disputed. */}
              <p className="t-body" style={{ marginTop: "var(--gc-sp-s)" }}>
                {FRAMES[open].caption}
              </p>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {FRAMES[open].place}
              </p>
            </div>
            <div className="modal-foot">
              <span className="t-body-s dim">Arrow keys move. Escape closes.</span>
              <span style={{ display: "flex", gap: "var(--gc-sp-2xs)" }}>
                <button className="btn" onClick={() => step(-1)}>← Previous</button>
                <button className="btn" onClick={() => step(1)}>Next →</button>
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-17 · THE KNOWLEDGE BASE

   AS-17.a: "A real label, and results announced."
   AS-17.b: "Every answer cites a document."
   ═══════════════════════════════════════════════════════════════════ */

export function Answers() {
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ANSWERS;
    return ANSWERS.filter((a) =>
      (a.q + " " + a.a + " " + a.group).toLowerCase().includes(t));
  }, [q]);

  const groups = useMemo(
    () => [...new Set(hits.map((a) => a.group))],
    [hits],
  );

  return (
    <>
      <section data-sec="AS-17.a">
        <div className="wrap">
          <span className="sec-ref">AS-17 · The Knowledge Base</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Answers</h1>

          <div className="f full" style={{ marginTop: "var(--gc-sp-l)", maxWidth: "520px" }}>
            {/* A real label, not a placeholder. A placeholder disappears
                the moment somebody types, taking the only description of
                the field with it. */}
            <label htmlFor="kb">Filter the answers</label>
            <input id="kb" type="search" value={q} onChange={(e) => setQ(e.target.value)}
                   aria-describedby="kb-count" />
          </div>

          {/* Results announced. Filtering that silently empties a list
              reads as a broken page. */}
          <p className="t-body-s dim" id="kb-count" role="status" aria-live="polite"
             style={{ marginTop: "var(--gc-sp-2xs)" }}>
            {hits.length === 0
              ? `Nothing matches “${q}”. Every answer here cites a document — try the document instead.`
              : `${hits.length} of ${ANSWERS.length} answers${q.trim() ? ` matching “${q}”` : ""}.`}
          </p>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g} data-sec="AS-17.b" className="on-paper">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-ref">{g}</span>
            </div>
            {hits.filter((a) => a.group === g).map((a) => (
              <div key={a.q} className="panel on-paper" style={{ marginBottom: "var(--gc-sp-s)" }}>
                <h3 className="t-body-l" style={{ fontWeight: 600 }}>{a.q}</h3>
                <p className="t-body measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>{a.a}</p>
                {/* AS-17.b — an uncited answer on a regulated platform is
                    a claim with nothing behind it. */}
                <Link className="btn" href={a.cite.href} style={{ marginTop: "var(--gc-sp-s)" }}>
                  {a.cite.label} →
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-18 · RECRUITMENT
   ═══════════════════════════════════════════════════════════════════ */

export function Roles() {
  return (
    <>
      <section data-sec="AS-18.a">
        <div className="wrap">
          <span className="sec-ref">AS-18 · Recruitment</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Open roles</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            What the work is actually like, in three claims you could check against this codebase.
          </p>

          <div className="stack" style={{ marginTop: "var(--gc-sp-l)" }}>
            {HOW_WE_WORK.map((c) => (
              <div key={c.k} className="panel on-panel">
                <span className="t-micro label">{c.k}</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "72ch" }}>
                  {c.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-sec="AS-18.b" className="on-paper">
        <div className="wrap">
          <div className="sec-head"><span className="sec-ref">The roles</span></div>
          {ROLES.map((r) => (
            <div key={r.code} className="panel on-paper" style={{ marginBottom: "var(--gc-sp-s)" }}>
              <div className="kv" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <span className="t-mono-s dim">{r.code}</span>
                <span className="t-mono-s dim">{r.open ? "Open" : "Filled"}</span>
              </div>
              <h3 className="t-display-s" style={{ marginTop: "var(--gc-sp-2xs)" }}>{r.title}</h3>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-3xs)" }}>Owns: {r.owns}</p>
              {r.detail.map((d, i) => (
                <p key={i} className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{d}</p>
              ))}
              {/* A filled role stays fully legible — AS-18.b. Someone
                  reading it is deciding whether to watch for the next one. */}
              {!r.open && r.closedNote ? (
                <p className="t-body-s dim measure"
                   style={{ marginTop: "var(--gc-sp-s)", borderLeft: "2px solid var(--gc-hairline)",
                            paddingLeft: "var(--gc-sp-s)" }}>
                  {r.closedNote}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section data-sec="AS-18.c">
        <div className="wrap">
          <span className="t-micro label">Applying</span>
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>
            One route: {APPLYING.where}
          </h2>
          <ul className="t-body measure" style={{ marginTop: "var(--gc-sp-s)", paddingLeft: "1.1em" }}>
            {APPLYING.send.map((s, i) => (
              <li key={i} style={{ marginBottom: "var(--gc-sp-2xs)" }}>{s}</li>
            ))}
          </ul>

          {/* A real file input. A drop zone alone cannot be reached from a
              keyboard — AS-18.c. */}
          <div className="f full" style={{ marginTop: "var(--gc-sp-m)", maxWidth: "520px" }}>
            <label htmlFor="cv">Attach your work</label>
            <input id="cv" type="file" name="work" accept=".pdf,.md,.txt,.zip"
                   aria-describedby="cv-help" />
            <span className="help t-body-s" id="cv-help">
              PDF, Markdown, plain text or a zip. Or send a link — a link is usually better.
            </span>
          </div>

          <p className="t-body measure" style={{ marginTop: "var(--gc-sp-m)" }}>{APPLYING.next}</p>
        </div>
      </section>
      <Footer />
    </>
  );
}

/**
 * One role, addressable by its code.
 *
 * The index is scannable; this is what someone sends to a friend. An
 * unknown code renders the index rather than a 404, because a stale
 * link to a role that has been filled should land somewhere useful —
 * and the roles that are filled are still listed there.
 */
export function RoleDetail({ code }: { code: string }) {
  const r = ROLES.find((x) => x.code.toLowerCase() === code.toLowerCase());
  if (!r) return <Roles />;

  return (
    <>
      <section data-sec="AS-18.b">
        <div className="wrap">
          <span className="sec-ref">AS-18 · {r.code}</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>{r.title}</h1>
          <span className="t-mono-s dim">{r.open ? "Open" : "Filled"}</span>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Owns: {r.owns}
          </p>
          {r.detail.map((d, i) => (
            <p key={i} className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{d}</p>
          ))}
          {!r.open && r.closedNote ? (
            <p className="t-body-s dim measure"
               style={{ marginTop: "var(--gc-sp-m)", borderLeft: "2px solid var(--gc-hairline)",
                        paddingLeft: "var(--gc-sp-s)" }}>
              {r.closedNote}
            </p>
          ) : null}
        </div>
      </section>

      <section data-sec="AS-18.c" className="on-paper">
        <div className="wrap">
          <span className="t-micro label">Applying</span>
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>{APPLYING.where}</h2>
          <p className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{APPLYING.next}</p>
          <div className="row" style={{ marginTop: "var(--gc-sp-m)", gap: "var(--gc-sp-2xs)" }}>
            <Link className="btn" href="/roles">Every role</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
