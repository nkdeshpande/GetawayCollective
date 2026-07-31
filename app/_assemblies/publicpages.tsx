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

import { useState } from "react";
import Link from "next/link";
import { pageByPath, BRIDGE, type PublicPage, type Pane } from "@/content/public";
import { PROPERTIES, inr } from "./data";
import { ConfidenceTag, Footer } from "./atoms";

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
