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

import Link from "next/link";
import { pageByPath, type PublicPage, type Pane } from "@/content/public";
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
function SignalForm() {
  return (
    <section data-sec="AS-32.signal" className="on-paper">
      <div className="wrap">
        <div className="panel on-paper" style={{ maxWidth: "560px" }}>
          <span className="t-micro label">The Signal</span>
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>
            One transmission a week
          </h2>
          <form
            style={{ marginTop: "var(--gc-sp-m)", display: "flex", gap: "var(--gc-sp-2xs)", flexWrap: "wrap" }}
            action="/signal"
          >
            <label htmlFor="sig-email" className="t-micro label" style={{ flexBasis: "100%" }}>
              Email address
            </label>
            <input id="sig-email" name="email" type="email" autoComplete="email" required
                   style={{ flex: "1 1 260px" }} />
            <button className="btn primary" type="submit">Tune in</button>
          </form>
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
  return (
    <section data-sec="AS-32.dossier" className="on-paper">
      <div className="wrap">
        <div className="panel on-paper" style={{ maxWidth: "620px" }}>
          <span className="t-micro label">Request transmission</span>
          <form className="fields" style={{ marginTop: "var(--gc-sp-m)" }}>
            <div className="f full">
              <label htmlFor="d-name">Full name</label>
              <input id="d-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="f full">
              <label htmlFor="d-email">Email address</label>
              <input id="d-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="f full">
              <label htmlFor="d-city">City</label>
              <input id="d-city" name="city" type="text" autoComplete="address-level2" />
              <span className="help t-body-s">
                Used to say which properties are within reach of you. Optional.
              </span>
            </div>
          </form>
          <button className="btn primary" type="submit" style={{ marginTop: "var(--gc-sp-m)" }}>
            Send the pack
          </button>
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

      {page.path === "/" ? <AssetRow /> : null}
      {page.path === "/signal" ? <SignalForm /> : null}
      {page.path === "/communique/request" ? <DossierForm /> : null}

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
