/**
 * AS-32 · THE PUBLIC PAGE
 *
 * Wave 8 · Public surface
 * Source: GC Collective Wireframes 2.0 — PUB.01 through PUB.11
 *
 * One renderer for the public pages. The copy lives in content/public.ts;
 * this decides only how a pane sits and which ground it sits on.
 *
 * ── ON THE GROUND ────────────────────────────────────────────────────
 * The wireframes call the same move a hard cut to paper mode, meant to
 * wake the reader up, and use it for the sections carrying arithmetic.
 * That is
 * the ground inversion this system already has: void is narrative, paper
 * is an assertion the platform will be held to. Each pane declares its
 * ground in the content, so the cut is a property of what is being said
 * rather than a rhythm applied to the page.
 *
 * ── WHAT THE WIREFRAMES ASKED FOR AND DOES NOT APPEAR ────────────────
 * Video loops behind the hero, a breathing monogram, pulse packets
 * travelling along an SVG nervous system, a radio tuner that gates the
 * subscription form until a knob is dragged into place, audio static.
 *
 * The tuner is the one worth naming: it made the form unreachable by
 * keyboard and invisible to a screen reader, in exchange for atmosphere.
 * The rest are absent because there is no asset for them yet and a
 * placeholder video is worse than none. Where the wireframe's motion
 * carried meaning, it is kept — the hard cut between grounds is the
 * whole of it.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  pageByPath, BRIDGE,
  type PublicPage, type Pane, type LedgerRow, type SequenceStep, type Question, type Plate,
} from "@/content/public";
import { PROPERTIES, inr } from "./data";
import { ConfidenceTag, Footer } from "./atoms";

/* ═══════════════════════════════════════════════════════════════════
   FOUR ARRANGEMENTS

   Adapted from the signed-off references. What each one dropped on the
   way in is recorded at the component, because the dropped part is
   usually the part someone will ask for again.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * THE LEDGER — the_syndicate.html
 *
 * Kept: the three-column row (function · what · state) and the reference
 * in the left column, so a row can be quoted back.
 *
 * CHANGED: the source isolated a row by dimming every other one to 40%.
 * Measured on the rendered page, that puts five of six rows at 2.87:1
 * whenever a pointer rests anywhere on the list — and the rows are the
 * whole of the page. The hovered row is lifted instead, which takes
 * nothing away from the others.
 *
 * DROPPED: the verification button and its receipt. The source waited
 * 1.2 seconds and printed "VERIFIED // 0xA3F19C" from Math.random(). It
 * is a fabricated audit trail rendered beside a real firm's name, and it
 * is the reason this page ships with the names withheld rather than with
 * the source's six.
 *
 * DROPPED: the hover image bleeding in behind the entity name. There is
 * no photography, and a stock office interior behind an unfilled role
 * would be inventing atmosphere for something that does not exist yet.
 */
function LedgerBlock({ rows }: { rows: readonly LedgerRow[] }) {
  return (
    <div className="ledger" style={{ marginTop: "var(--gc-sp-l)" }}>
      {rows.map((r) => (
        <div className="ledger-row" key={r.ref} data-state={r.state.toLowerCase().replace(/ /g, "-")}>
          <div className="cell-meta">
            <span className="a-pill t-mono-s">{r.role}</span>
            <span className="t-mono-s dim">{r.ref}</span>
          </div>
          <div className="cell-entity">
            {/* A vacant function still gets a heading. Rendering the role
                as the name where no holder exists is how a placeholder
                becomes a claim. */}
            <h3 className="t-subheading">{r.holder ?? "Not yet appointed"}</h3>
            <p className="t-body dim" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "52ch" }}>
              {r.what}
            </p>
          </div>
          <div className="cell-state">
            <span className={`state ${r.state === "Vacant" ? "vacant" : "held"}`}>{r.state}</span>
            <span className="t-mono-s dim">
              {r.since ? `Since ${r.since}` : "No engagement recorded"}
            </span>
          </div>
        </div>
      ))}
      <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "70ch" }}>
        State is read from the vehicle record. Nothing on this page is confirmed by pressing
        anything on this page.
      </p>
    </div>
  );
}

/**
 * THE SEQUENCE — how_it_works.html
 *
 * Kept: the numbered spine with a fill that tracks reading position, and
 * the node that fills as its step is reached. The order is the
 * information here — these steps happen in sequence and cannot be taken
 * out of it — which is the test for whether numbering is structure or
 * decoration.
 *
 * The fill is driven by IntersectionObserver rather than a scroll
 * handler doing getBoundingClientRect on every step on every frame,
 * which is what the source did. Same result, without laying out the
 * document sixty times a second.
 */
function SequenceBlock({ steps }: { steps: readonly SequenceStep[] }) {
  const [reached, setReached] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  /*
   * ONE observer, in an effect, disconnected on unmount.
   *
   * The first version built an IntersectionObserver inside the ref
   * callback. React invokes an inline ref with null and then the element
   * on every render, and every state change here causes a render — so
   * each step accumulated a fresh observer per frame of reading, none of
   * them disconnected. It worked, which is the problem with it.
   *
   * The fill is decoration and the nodes only change weight, so nothing
   * on this page is hidden until it is observed. If IntersectionObserver
   * never runs at all, every step is still legible in its resting state.
   */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = items.current.indexOf(e.target as HTMLLIElement);
        if (i >= 0) setReached((n) => Math.max(n, i + 1));
      }),
      { rootMargin: "0px 0px -40% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps]);

  return (
    <div className="seq" style={{ marginTop: "var(--gc-sp-l)" }}>
      <div className="seq-spine" aria-hidden="true">
        <span className="seq-fill"
              style={{ transform: `scaleY(${steps.length ? reached / steps.length : 0})` }} />
      </div>
      <ol className="seq-steps">
        {steps.map((s, i) => (
          <li
            key={s.n}
            className="seq-step"
            data-on={i < reached ? "1" : "0"}
            ref={(el) => { items.current[i] = el; }}
          >
            <span className="seq-node t-mono-s">{s.n}</span>
            <div className="seq-body">
              <h3 className="t-subheading">{s.t}</h3>
              <p className="t-body dim" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "52ch" }}>
                {s.d}
              </p>
              {s.parts ? (
                <ul className="seq-parts">
                  {s.parts.map((x) => <li key={x} className="t-mono-s">{x}</li>)}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * THE QUESTIONS — how_it_works.html
 *
 * The source generated ten questions and gave every one of them the
 * SAME answer: a paragraph saying the specifics are in the prospectus.
 * Ten questions that resolve to "it is written down somewhere else" is
 * a page that looks like it answers things.
 *
 * Every question here has its own answer or it is not on the page.
 * <details>/<summary>, so it opens without JavaScript, is searchable by
 * the browser's own find, and needs no aria wiring to be correct.
 */
function FaqBlock({ qs }: { qs: readonly Question[] }) {
  return (
    <div className="qa-set" style={{ marginTop: "var(--gc-sp-l)" }}>
      {qs.map((q) => (
        <details key={q.q}>
          <summary className="t-body-l">{q.q}</summary>
          <p className="t-body dim measure">{q.a}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * THE PLATES — MediaKit.html
 *
 * Kept: the grid, the reference, and the specification beneath each
 * plate — a media kit is used by someone who needs to know the file
 * before they need to see it.
 *
 * CHANGED: `kind` is mandatory and is rendered ON the plate rather than
 * in a caption. The source's grid was three stock photographs labelled
 * DRIFT_EXTERIOR_01.RAW at 45MB and 8K, which asserts that photography
 * of a built property exists. None does — the asset is at
 * pre-construction — so every plate here states what it actually is, and
 * "Not yet made" is a value.
 */
function PlateBlock({ plates }: { plates: readonly Plate[] }) {
  return (
    <div className="plates" style={{ marginTop: "var(--gc-sp-l)" }}>
      {plates.map((pl) => (
        <figure className="plate" key={pl.id} data-kind={pl.kind === "Not yet made" ? "absent" : "present"}>
          <div className="plate-bed" aria-hidden="true">
            <span className="t-micro">{pl.kind}</span>
          </div>
          <figcaption>
            <span className="t-mono-s">{pl.id}</span>
            <span className="t-body-s">{pl.what}</span>
            <span className="t-mono-s dim">{pl.spec}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ── One pane ─────────────────────────────────────────────────────── */

function PaneBlock({ p }: { p: Pane }) {
  const paper = p.ground === "paper";
  return (
    <section data-sec={`AS-32.${p.n}`} className={paper ? "on-paper" : undefined}>
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-ref">{p.n}</span>
          <span className="t-micro label">{p.eyebrow}</span>
          {paper ? <span className="ground-note t-mono-s">Paper ground · assertion</span> : null}
        </div>

        <h2 className="t-display-m measure">{p.title}</h2>

        {p.lede ? (
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>{p.lede}</p>
        ) : null}

        {(p.body ?? []).map((para, i) => (
          <p key={i} className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{para}</p>
        ))}

        {p.list ? (
          <div className="stack" style={{ marginTop: "var(--gc-sp-l)" }}>
            {p.list.map((row) => (
              <div key={row.k} className={paper ? "panel on-paper" : "panel on-panel"}>
                <span className="t-micro label">{row.k}</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "72ch" }}>
                  {row.v}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {p.ledger ? <LedgerBlock rows={p.ledger} /> : null}
        {p.sequence ? <SequenceBlock steps={p.sequence} /> : null}
        {p.faq ? <FaqBlock qs={p.faq} /> : null}
        {p.plates ? <PlateBlock plates={p.plates} /> : null}

        {p.note ? (
          <p className="t-body-s dim measure"
             style={{ marginTop: "var(--gc-sp-m)", borderLeft: "2px solid var(--gc-hairline)",
                      paddingLeft: "var(--gc-sp-s)" }}>
            {p.note}
          </p>
        ) : null}

        {p.cta ? (
          <Link className="btn" href={p.cta.href} style={{ marginTop: "var(--gc-sp-m)" }}>
            {p.cta.label} →
          </Link>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The collection, read from the property records.
 *
 * PUB.01 sections 4-6 are three named properties with figures written
 * into the wireframe — a valuation, a yield, an entry price. None of
 * those numbers is in any registry. These are the records that exist,
 * with their real valuations and confidence classes, because a headline
 * figure with no source is the first thing quoted back and the last
 * thing defensible.
 */
function AssetRow() {
  return (
    <section data-sec="AS-32.assets">
      <div className="wrap">
        <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
          {PROPERTIES.map((prop) => (
            <div key={prop.assetId} className="panel on-panel" style={{ flex: "1 1 300px" }}>
              <span className="t-mono-s dim">{prop.assetId} · {prop.ufr0063}</span>
              <h3 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>
                {prop.ufr0060}
              </h3>
              <div className="kv" style={{ marginTop: "var(--gc-sp-s)" }}>
                <span className="label t-micro">Stage</span>
                <span className="v t-body-s">{prop.ufr0066}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Valuation</span>
                <span className="v money">{inr(prop.ufr0102)}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Basis</span>
                <span className="v t-body-s">{prop.ufr0103}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Indicative yield</span>
                <span className="v">
                  {prop.yield.v}% <ConfidenceTag c={prop.yield.conf} />
                </span>
              </div>
              <Link className="btn" href="/collection" style={{ marginTop: "var(--gc-sp-s)" }}>
                Open the record →
              </Link>
            </div>
          ))}
        </div>
        <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
          Valuations carry the basis that produced them and forward figures carry their confidence
          class. A management estimate and an independent appraisal are not the same claim, and
          they are not rendered as though they were.
        </p>
      </div>
    </section>
  );
}

/** The subscription form. Plain, and reachable. */
/**
 * Both forms below share one submission shape: idle → sending → sent, or
 * idle → sending → failed. Failure is shown as failure — see lib/leads.ts
 * — never as a success screen over a message that was actually dropped.
 */
type Phase = "idle" | "sending" | "sent" | "failed";

function SignalForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("sending");
    try {
      const res = await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setPhase(res.ok ? "sent" : "failed");
    } catch {
      setPhase("failed");
    }
  };

  return (
    <section data-sec="AS-32.signal" className="on-paper">
      <div className="wrap">
        <div className="panel on-paper" style={{ maxWidth: "560px" }}>
          <span className="t-micro label">The Signal</span>
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>
            One transmission a week
          </h2>

          {phase === "sent" ? (
            <p className="t-body" role="status" style={{ marginTop: "var(--gc-sp-m)" }}>
              Received. The first transmission arrives within a week.
            </p>
          ) : (
            <form
              onSubmit={submit}
              style={{ marginTop: "var(--gc-sp-m)", display: "flex", gap: "var(--gc-sp-2xs)", flexWrap: "wrap" }}
            >
              <label htmlFor="sig-email" className="t-micro label" style={{ flexBasis: "100%" }}>
                Email address
              </label>
              <input id="sig-email" name="email" type="email" autoComplete="email" required
                     value={email} onChange={(e) => setEmail(e.target.value)}
                     disabled={phase === "sending"} style={{ flex: "1 1 260px" }} />
              <button className="btn primary" type="submit" disabled={phase === "sending"}>
                {phase === "sending" ? "Sending…" : "Tune in"}
              </button>
            </form>
          )}

          {phase === "failed" ? (
            <p className="t-body-s" role="status" style={{ marginTop: "var(--gc-sp-s)", color: "var(--gc-hazard)" }}>
              This has not reached us. Write to{" "}
              <a href="mailto:signal@getawaycollective.in">signal@getawaycollective.in</a> directly
              and it reaches the same place.
            </p>
          ) : null}

          <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "56ch" }}>
            Not sold, not tracked, one click out. The unsubscribe link is in every transmission and
            takes effect immediately.
          </p>
        </div>
      </div>
    </section>
  );
}

/** The dossier request. The consequence is stated above the form, not below it. */
function DossierForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [vals, setVals] = useState({ name: "", email: "", city: "" });
  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVals((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("sending");
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      });
      setPhase(res.ok ? "sent" : "failed");
    } catch {
      setPhase("failed");
    }
  };

  return (
    <section data-sec="AS-32.dossier" className="on-paper">
      <div className="wrap">
        <div className="panel on-paper" style={{ maxWidth: "620px" }}>
          <span className="t-micro label">Request transmission</span>

          {phase === "sent" ? (
            <p className="t-body" role="status" style={{ marginTop: "var(--gc-sp-m)" }}>
              Received. The pack is sent to the address given, usually within one working day.
            </p>
          ) : (
            <form className="fields" style={{ marginTop: "var(--gc-sp-m)" }} onSubmit={submit}>
              <div className="f full">
                <label htmlFor="d-name">Full name</label>
                <input id="d-name" name="name" type="text" autoComplete="name" required
                       value={vals.name} onChange={set("name")} disabled={phase === "sending"} />
              </div>
              <div className="f full">
                <label htmlFor="d-email">Email address</label>
                <input id="d-email" name="email" type="email" autoComplete="email" required
                       value={vals.email} onChange={set("email")} disabled={phase === "sending"} />
              </div>
              <div className="f full">
                <label htmlFor="d-city">City</label>
                <input id="d-city" name="city" type="text" autoComplete="address-level2"
                       value={vals.city} onChange={set("city")} disabled={phase === "sending"} />
                <span className="help t-body-s">
                  Used to say which properties are within reach of you. Optional.
                </span>
              </div>
              <button className="btn primary" type="submit" disabled={phase === "sending"}
                      style={{ marginTop: "var(--gc-sp-m)" }}>
                {phase === "sending" ? "Sending…" : "Send the pack"}
              </button>
            </form>
          )}

          {phase === "failed" ? (
            <p className="t-body-s" role="status" style={{ marginTop: "var(--gc-sp-s)", color: "var(--gc-hazard)" }}>
              This has not reached us. Write to{" "}
              <a href="mailto:communique@getawaycollective.in">communique@getawaycollective.in</a>{" "}
              directly and it reaches the same place.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}


/**
 * THE BRIDGE — the closer, argued the other way.
 *
 * GC.UX.05 in the wireframes reads "ENOUGH THINKING", slammed into place
 * at 6rem, on the reasoning that complexity is the enemy of execution.
 *
 * On an irreversible commitment that reasoning runs backwards. The
 * commitment control on this platform takes three seconds of sustained
 * pressure precisely because the deliberation is the point, and a page
 * telling someone they have deliberated enough is the same pattern as a
 * countdown timer, wearing better typography.
 *
 * The component is kept — a closer at the foot of the argument pages is
 * right — and it points at the two documents that should be read before
 * committing rather than after.
 */
function Bridge() {
  return (
    <section data-sec="AS-32.bridge" className="on-paper">
      <div className="wrap">
        <h2 className="t-display-m measure">{BRIDGE.title}</h2>
        <p className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{BRIDGE.body}</p>
        <div className="row" style={{ marginTop: "var(--gc-sp-m)", gap: "var(--gc-sp-s)" }}>
          {BRIDGE.before.map((b) => (
            <Link key={b.v} href={b.v} className="panel on-paper"
                  style={{ flex: "1 1 280px", textDecoration: "none" }}>
              <span className="t-body-l" style={{ fontWeight: 600 }}>{b.k}</span>
            </Link>
          ))}
        </div>
        <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>{BRIDGE.close}</p>
      </div>
    </section>
  );
}

/* The pages the wireframes place the closer on. */
const BRIDGED = new Set(["/space", "/time", "/how-it-works"]);


/**
 * The identify form. One field, and the same answer either way.
 *
 * The wireframe's second state is a six-box OTP grid. Six separate inputs
 * are a well-known accessibility trap — a screen reader announces six
 * unlabelled fields, paste rarely works, and focus management has to be
 * hand-built and usually is not. A single field labelled with what to
 * paste does the same job, so that is what is here.
 */
function IdentifyForm() {
  return (
    <section data-sec="AS-32.identify">
      <div className="wrap">
        <div className="panel on-panel" style={{ maxWidth: "560px" }}>
          <span className="t-micro label">Identify</span>
          <form style={{ marginTop: "var(--gc-sp-m)" }} className="fields" action="/auth/verify">
            <div className="f full">
              <label htmlFor="id-email">Email address</label>
              <input id="id-email" name="email" type="email" autoComplete="email" required
                     aria-describedby="id-help" />
              <span className="help t-body-s" id="id-help">
                A single-use link is sent here. It works once and then expires.
              </span>
            </div>
          </form>
          <button className="btn primary" type="submit" style={{ marginTop: "var(--gc-sp-m)" }}>
            Send the link
          </button>
          <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "56ch" }}>
            The confirmation you see next is identical whether or not this address is known to us.
            That is deliberate, and it is explained above.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── The page ─────────────────────────────────────────────────────── */

export function PublicSurface({ path }: { path: string }) {
  const page: PublicPage | undefined = pageByPath(path);
  if (!page) return null;

  return (
    <>
      <section data-sec="AS-32.a" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <span className="sec-ref">{page.id} · {page.alias}</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>{page.title}</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            {page.standfirst}
          </p>
        </div>
      </section>

      {/* Said before the content, not after it. A page whose roster is
          empty and does not say so reads as a page with nothing in it. */}
      {page.unpopulated ? (
        <section data-sec="AS-32.absent" style={{ paddingTop: "var(--gc-sp-l)" }}>
          <div className="wrap">
            <div className="panel on-panel"
                 style={{ borderLeft: "2px solid var(--gc-hazard)", maxWidth: "74ch" }}>
              <span className="t-micro label">Not yet populated</span>
              <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>{page.unpopulated}</p>
            </div>
          </div>
        </section>
      ) : null}

      {page.panes.map((p) => <PaneBlock key={p.n} p={p} />)}

      {page.path === "/" || page.path === "/space" ? <AssetRow /> : null}
      {BRIDGED.has(page.path) ? <Bridge /> : null}
      {page.path === "/signal" ? <SignalForm /> : null}
      {page.path === "/communique/request" ? <DossierForm /> : null}
      {page.path === "/auth/sign-in" ? <IdentifyForm /> : null}

      <Footer />
    </>
  );
}

/* Thin wrappers, so gen-app emits one component per route. */
export const Root = () => <PublicSurface path="/" />;
export const HowItWorks = () => <PublicSurface path="/how-it-works" />;
export const Partners = () => <PublicSurface path="/collective/partners" />;
export const Operators = () => <PublicSurface path="/collective/operators" />;
export const Dossier = () => <PublicSurface path="/communique/request" />;
export const Signal = () => <PublicSurface path="/signal" />;
export const Wire = () => <PublicSurface path="/collective/press" />;
export const Space = () => <PublicSurface path="/space" />;
export const Time = () => <PublicSurface path="/time" />;
export const Evidence = () => <PublicSurface path="/collective/gallery" />;
export const Structure = () => <PublicSurface path="/structure" />;
export const Identify = () => <PublicSurface path="/auth/sign-in" />;
