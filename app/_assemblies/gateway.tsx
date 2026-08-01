/**
 * THE GATEWAY ASSEMBLIES — what a visitor actually sees
 *
 * Wave 7 · Workspaces
 *
 * AS-01 Gateway Grid · AS-03 Property Masthead · AS-04 Capital Explainer
 * AS-24 Testimonials
 *
 * Ported from GC-ASSEMBLIES.html. The corrections these carry are
 * recorded in constants/assemblies.ts; the ones that would be invisible
 * in the markup are noted where they apply.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PROPERTIES, RESERVE, WATERFALL, GROSS, VOICES,
  inr, rate, fractionPrice, toSlug, plate, type Property,
} from "./data";
import { ConfidenceTag, Pct, Hero, Footer } from "./atoms";

/* ═══════════════════════════════════════════════════════════════════
   AS-01 · THE GATEWAY GRID

   Three properties as photographs. A name in titan type. One figure,
   revealed on intent.

   The deferred row is revealed by hover, by keyboard focus, OR by tap,
   and it is in the DOM and the accessibility tree at all times. The
   source revealed it on hover alone, so on a phone it never appeared —
   a deferred field that is unreachable is not deferred, it is missing.
   ═══════════════════════════════════════════════════════════════════ */

function GatewayCard({ p }: { p: Property }) {
  const [open, setOpen] = useState(false);
  const [first, second] = p.ufr0060.split(" ");

  /*
   * A card with a built destination NAVIGATES; one without DISCLOSES.
   *
   * The figures are deferred either way — they reveal on hover and
   * focus, so the still image never carries a number without its
   * provenance (FB-1). What differs is what a click means, and it now
   * means the honest thing: where there is a page worth arriving at,
   * the card takes you; where the destination is thinner than the card,
   * clicking opens the figures in place rather than disappointing you.
   */
  const inner = (
    <>
      <span className="plate" style={plate(p.hue)} aria-hidden="true" />
      <span className="scrim" aria-hidden="true" />
      <span className="body">
        <span className="t-micro label" style={{ display: "block", marginBottom: "var(--gc-sp-2xs)" }}>
          {p.ufr0063}
        </span>
        <h3>
          {first}
          <br />
          {second}
        </h3>
        <span className="deferred">
          <span className="t-mono-s" style={{ color: "var(--gc-copper)" }}>
            YIELD <Pct v={p.yield.v} conf={p.yield.conf} />
          </span>
          <ConfidenceTag c={p.yield.conf} />
          <span className="rule-x" aria-hidden="true" />
          <span className="t-mono-s">{p.availability}</span>
        </span>
      </span>
    </>
  );

  const shared = {
    className: "ap-gateway",
    "data-open": open ? "1" : "0",
  } as const;

  return p.to ? (
    <Link
      {...shared}
      href={p.to}
      aria-label={`${p.ufr0060}, ${p.ufr0063}. Open the offering.`}
    >
      {inner}
    </Link>
  ) : (
    <button
      {...shared}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      aria-label={`${p.ufr0060}, ${p.ufr0063}. Show indicative figures.`}
    >
      {inner}
    </button>
  );
}

export function GatewayGrid() {
  return (
    <>
      <section data-sec="AS-01.a">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">AS-01</span>
            <span className="t-micro label">The Collection</span>
          </div>
          <h1 className="t-display-xl">The Collection</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Three properties, held in three vehicles. What you can see here is what can be said
            without a figure needing its provenance alongside it.
          </p>
        </div>
      </section>

      <section data-sec="AS-01.b">
        <div className="wrap">
          <div className="grid-3">
            {PROPERTIES.map((p) => (
              <GatewayCard key={p.assetId} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section data-sec="AS-01.c" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <p className="t-body measure dim" style={{ marginBottom: "var(--gc-sp-m)" }}>
            Valuation, valuation source, vehicle and lifecycle state are not withheld here because
            they are private. They are withheld because each one needs its provenance beside it,
            and a photograph has nowhere to put it. All of it is one navigation away.
          </p>
          <Link className="btn primary" href="/how-capital-works">
            How capital works →
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-03 · THE PROPERTY MASTHEAD + TRINITY LENS

   Space · Capital · Time as three lenses onto the same property. Lenses,
   not steps — tabs imply peers, and a numbered sequence would imply an
   order that does not exist.

   The Capital lens renders the SPACE aperture's capital fields and routes
   to the console for the rest. A visitor standing at the space vantage
   does not receive console disclosure because a tab happens to be
   labelled Capital.
   ═══════════════════════════════════════════════════════════════════ */

const LENSES = ["space", "capital", "time"] as const;
type Lens = (typeof LENSES)[number];

export function PropertyMasthead({ p }: { p: Property }) {
  const [lens, setLens] = useState<Lens>("space");

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = LENSES.indexOf(lens);
    const next = LENSES[(i + d + LENSES.length) % LENSES.length];
    setLens(next);
    document.getElementById(`lt-${next}`)?.focus();
  };

  return (
    <>
      <section data-sec="AS-03.a" style={{ paddingTop: 0 }}>
        <div
          style={{
            position: "relative", minHeight: "52vh", display: "flex",
            alignItems: "flex-end", ...plate(p.hue),
          }}
        >
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, var(--gc-void) 0%, transparent 60%)",
            }}
          />
          <div
            className="wrap"
            style={{
              position: "relative",
              paddingBottom: "var(--gc-sp-xl)",
              paddingTop: "var(--gc-sp-3xl)",
            }}
          >
            <span className="t-micro label">
              {p.ufr0063} · {p.assetId}
            </span>
            {/* One figure maximum over the image, and never the valuation. */}
            <h1 className="t-display-xl" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              {p.ufr0060}
            </h1>
          </div>
        </div>
      </section>

      <section data-sec="AS-03.b">
        <div className="wrap">
          <div className="lens" role="tablist" aria-label="Trinity Lens" onKeyDown={onKey}>
            {LENSES.map((l) => (
              <button
                key={l}
                role="tab"
                id={`lt-${l}`}
                aria-selected={lens === l}
                aria-controls={`lp-${l}`}
                tabIndex={lens === l ? 0 : -1}
                onClick={() => setLens(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="lp-space" aria-labelledby="lt-space" hidden={lens !== "space"}>
            <div className="spec">
              <Field k="Land area" v={p.ufr0065} />
              <Field k="Lifecycle" v={p.ufr0066} />
              <Field k="Stabilised" v={p.ufr0067 ?? "—"} />
              <Field k="Jurisdiction" v={p.ufr0063} />
              <Field k="Commitments" v={p.ufr0068} />
              <Field k="Vehicle" v={p.ufr0061} />
            </div>
          </div>

          <div role="tabpanel" id="lp-capital" aria-labelledby="lt-capital" hidden={lens !== "capital"}>
            <div className="spec">
              <div className="field">
                <span className="k t-micro">Valuation</span>
                <span className="v t-mono money">{inr(p.ufr0102)}</span>
                {/* Source directly beneath the figure. Never a tooltip. */}
                <span className="source t-mono-s">
                  {p.ufr0103} · {p.ufr0101}
                </span>
              </div>
              <div className="field">
                <span className="k t-micro">Fraction · 1 of {p.units}</span>
                <span className="v t-mono money">{inr(fractionPrice(p))}</span>
                <span className="source t-mono-s">Derived from valuation</span>
              </div>
              <div className="field">
                <span className="k t-micro">Indicative yield</span>
                <span className="v">
                  <Pct v={p.yield.v} conf={p.yield.conf} /> <ConfidenceTag c={p.yield.conf} />
                </span>
              </div>
            </div>
            <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
              Reserve position, waterfall detail, telemetry and the ledger sit at the capital
              vantage.
            </p>
            <Link className="btn" href="/capital" style={{ marginTop: "var(--gc-sp-s)" }}>
              Open the console →
            </Link>
          </div>

          <div role="tabpanel" id="lp-time" aria-labelledby="lt-time" hidden={lens !== "time"}>
            <p className="t-body-l measure">
              Entitlement begins at settlement, not at acceptance. A holder of one twelfth draws{" "}
              <strong>30 nights</strong> a year, scheduled from the member vantage.
            </p>
            <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
              Nothing is scheduled against this property from where you are standing, because
              nothing is held from here.
            </p>
          </div>
        </div>
      </section>

      <section data-sec="AS-03.c" style={{ borderBottom: "none" }}>
        <div className="wrap">
          {/* The one place editorial italic is permitted, once. */}
          <p className="t-editorial measure">
            A restored machiya on the quiet edge of Higashiyama, held in a vehicle that owns the
            land outright and answers to the people who funded it.
          </p>
          <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            Scarcity here is structural rather than manufactured: the ward permits no new
            construction on the lot line, and the restoration reused 78% of the original timber.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="field">
      <span className="k t-micro">{k}</span>
      <span className="v t-mono">{v}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-04 · THE CAPITAL EXPLAINER

   THE GROUND INVERSION. The page runs dark while it explains and flips to
   paper the moment it makes a financial claim. Light means audited.

   Six stages, in order, and the waterfall closes to 100% — checked in
   data.ts rather than assumed. The source had four stages and omitted the senior
   claim entirely, which shows a distributable figure that is not
   distributable.
   ═══════════════════════════════════════════════════════════════════ */

export function CapitalExplainer() {
  return (
    <>
      <section data-sec="AS-04.a">
        <div className="narrow">
          <span className="t-micro label">The Capital Explainer</span>
          <h1 className="t-display-xl" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Where the money goes,
            <br />
            and in what order.
          </h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            You are last in line behind five claims. Here they are, in order, with what each one
            takes.
          </p>
        </div>
      </section>

      <section data-sec="AS-04.b">
        <div className="narrow">
          <div className="sec-head">
            <span className="sec-ref">AS-04.b</span>
            <span className="t-micro label">The Structure</span>
          </div>
          <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            {[
              ["Getaway Collective", "Governs. Holds NO equity in the vehicles it governs."],
              ["The Vehicle", "Owns the land title. Funded and owned by its Members."],
              ["Sensory Getaways", "Operates under contract. Measured on SLA."],
            ].map(([h, b]) => (
              <div key={h} className="panel on-panel" style={{ flex: "1 1 240px" }}>
                <h3 className="t-subheading">{h}</h3>
                <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GROUND INVERSION — paper from here ══ */}
      <section data-sec="AS-04.c" className="on-paper">
        <div className="narrow">
          <div className="sec-head">
            <span className="sec-ref">AS-04.c</span>
            <span className="t-micro" style={{ color: "var(--gc-steel)" }}>
              The Waterfall · six stages
            </span>
            <span className="ground-note t-mono-s">Paper ground · assertion</span>
          </div>
          <div className="scroll-x">
            <div className="wf">
              {WATERFALL.map((s) => (
                <div key={s.k}>
                  <div className="wf-row">
                    <span className="k t-mono-s">{s.k}</span>
                    <div className="wf-track">
                      <div className={`wf-bar ${s.cls}`} style={{ width: `${s.bps / 100}%` }}>
                        <span className="t-mono-s">{(s.bps / 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="amt t-mono-s">{inr(rate(GROSS, s.bps))}</span>
                  </div>
                  <div className="wf-row">
                    <span />
                    <span className="wf-note t-body-s">{s.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-sec="AS-04.d" className="on-paper" style={{ borderBottom: "none" }}>
        <div className="narrow">
          <div className="sec-head">
            <span className="sec-ref">AS-04.d</span>
            <span className="t-micro" style={{ color: "var(--gc-steel)" }}>
              The Floor
            </span>
          </div>
          <div className="gauge">
            <span className="t-micro" style={{ color: "var(--gc-steel)" }}>
              Reserve against floor
            </span>
            <div className="gauge-track">
              <div className="gauge-fill" style={{ width: "60.8%" }} />
              <div className="gauge-floor" style={{ left: "50%" }} />
            </div>
            <div className="row" style={{ justifyContent: "space-between", gap: "var(--gc-sp-s)" }}>
              <span className="t-mono-s money">{inr(RESERVE.held)} held</span>
              <span className="t-mono-s" style={{ color: "var(--gc-steel)" }}>
                {inr(RESERVE.floor)} floor
              </span>
            </div>
            <p className="t-body-s" style={{ color: "var(--gc-steel)", marginTop: "var(--gc-sp-s)" }}>
              Stage 6 does not run if paying it would take the reserve below this line. The floor is
              the greater of {RESERVE.basis} or the Board minimum, and it is{" "}
              <strong>not NAV-linked</strong>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AS-24 · TESTIMONIALS — regulated speech

   SEBI's advertisement code bars testimonials in investment advisory
   contexts, and a member's remark about what they earned is a performance
   claim made by proxy. Every quote is about the PLACE. None names a
   figure, and route-lint plus assemblies.test.ts both check it.
   ═══════════════════════════════════════════════════════════════════ */

export function Testimonials() {
  return (
    <>
      <Hero
        eyebrow="Voices · AS-24"
        claim={
          <>
            What it is
            <br />
            actually like.
          </>
        }
        sup="Statements from partners about the properties. Not about the investment."
        hue={172}
      />
      <section data-sec="AS-24.a">
        <div className="wrap">
          <div className="subject-note">
            <p className="t-body-s dim">
              These describe time at the property, arranged by <strong>Sensory Getaways</strong>,
              the operating partner. They are not statements about the investment, and none of them
              names a figure — a partner&rsquo;s remark about what they earned is a performance
              claim by proxy, and it is barred whoever says it.
            </p>
          </div>

          <div className="quotes">
            {VOICES.map((v) => (
              <figure className="quote" key={v.who}>
                <blockquote>&ldquo;{v.q}&rdquo;</blockquote>
                <figcaption>
                  <span className="who">{v.who}</span>
                  <span className="meta">
                    {v.role} · {v.on}
                  </span>
                  <span className="basis">{v.basis}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export { toSlug };

/* ═══════════════════════════════════════════════════════════════════
   AS-23 · THE HERO VIEWPORT — the front door

   One claim. A hero carrying three is a contents list set in large type.
   No figure over it: FB-1 bars full-bleed treatment wherever numeric data
   is read, because a number over an image is read against whatever pixels
   sit behind it.
   ═══════════════════════════════════════════════════════════════════ */

export function Home() {
  return (
    <>
      <Hero
        eyebrow="Getaway Collective"
        claim={
          <>
            Own the land.
            <br />
            Not the brochure.
          </>
        }
        sup="An institutional platform for experiential real estate. You hold a share of a legal entity that owns the ground it stands on."
        go={[
          { t: "See the collection", to: "/collection" },
          { t: "How capital works", to: "/how-capital-works" },
        ]}
        hue={158}
      />

      <section data-sec="AS-23.c">
        <div className="wrap">
          <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            {[
              ["Governance without ownership",
               "The platform governs the vehicles and holds no equity in them. Your partners own the entity; it answers to them."],
              ["Six stages, in order",
               "Revenue passes through six claims before it reaches you, and you can see every one of them before committing."],
              ["Nothing is promised",
               "Every forward-looking figure carries its confidence class. A modelled yield is marked modelled, everywhere it appears."],
            ].map(([h, b]) => (
              <div key={h} className="panel on-panel" style={{ flex: "1 1 260px" }}>
                <h3 className="t-subheading">{h}</h3>
                <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
