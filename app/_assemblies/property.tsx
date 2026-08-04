/**
 * AS-PROP · THE PROPERTY PAGE
 *
 * Authority: the GC property page wireframe · constants/property-page.ts
 *
 * ── ONE COMPONENT, THREE PLACES ──────────────────────────────────────
 * Solace, Confluence and The Creek render through this. Everything that
 * differs between them is a row in the registry; everything that is the
 * same is here. Three hand-built pages would have diverged by the second
 * edit, and the divergence would have been invisible until somebody
 * compared them side by side.
 *
 * ── EVERY FIGURE IS READ, NONE IS TYPED ──────────────────────────────
 * The vehicle strip, the ownership basis, the entitlement, the unit
 * price — all of it comes from constants/vehicles.ts at render. That is
 * the same rule the Journal follows, and for the same reason: a page
 * that types its own numbers can describe a vehicle that does not exist.
 *
 * ── THE PAGE STATES WHAT IT CANNOT SHOW ──────────────────────────────
 * Two things are missing and both are declared rather than hidden.
 *
 * Media: every frame is a declared slot with a subject and a kind, and
 * renders as a labelled placeholder until an asset is registered. The
 * page footer counts them, so "we need photography" is a numbered brief
 * rather than an intention.
 *
 * Publication: two of the three vehicles carry blocking conflicts, and a
 * page for one of those does not show a yield, a unit price or a
 * subscription state. It shows what is settled and says the rest is being
 * reconciled. That is `publishable()` reaching the surface, which is the
 * only place a gate of that kind is worth anything.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROPERTY_PAGES, SPINE, EVIDENCE_TIERS, mediaGap,
  type MediaSlot, type PropertyPage,
} from "@/constants/property-page";
import { vehicleByKey, publishable, waterfallState } from "@/constants/vehicles";
import { estateOf, ARCHITECTURAL_LANGUAGE } from "@/constants/spatial";
import { IrisPanel } from "./iris";
import { Footer } from "./atoms";

/* ── A declared frame ─────────────────────────────────────────────── */
/**
 * The placeholder is deliberately plain and deliberately labelled.
 *
 * A blurred stock image or a gradient would read as a design choice and
 * quietly become permanent. A box that says what belongs there, what kind
 * of image it is and that it has not been made yet stays uncomfortable,
 * which is the correct amount of comfortable.
 */
function Frame({ m, className = "" }: { m: MediaSlot; className?: string }) {
  if (m.asset) {
    return (
      <figure className={`pf ${className}`} data-aspect={m.aspect}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.asset} alt={m.subject} />
        <figcaption className="t-micro dim">
          {m.kind}{m.taken ? ` · ${m.taken}` : ""}
        </figcaption>
      </figure>
    );
  }
  return (
    <div className={`pf pf-empty ${className}`} data-aspect={m.aspect} role="img"
         aria-label={`Not yet produced: ${m.subject}`}>
      <span className="t-micro label">{m.kind} · not yet produced</span>
      <p className="t-body-s">{m.subject}</p>
    </div>
  );
}

export function PropertySurface({ slug }: { slug: string }) {
  const page: PropertyPage | undefined = PROPERTY_PAGES.find(
    (p) => vehicleByKey(p.vehicle)?.slug === slug,
  );
  if (!page) notFound();

  const v = vehicleByKey(page.vehicle)!;
  const estate = estateOf(page.vehicle);
  const gate = publishable(v);
  const wf = waterfallState(v.operating.waterfall);
  const gap = mediaGap(page);

  const inr = (n: bigint) => `₹${(Number(n) / 10000).toLocaleString("en-IN")}`;

  return (
    /*
     * A div, not a main. The shell already renders <main class="rail-main">
     * around every page, and a nested <main> is invalid and gives a screen
     * reader two document bodies to choose between.
     *
     * `p-hero-own` on the opening section is the seam the shell publishes
     * for a page that titles itself — without it the shell would print
     * "space vantage / Opportunity" above this hero, which is exactly the
     * double-title defect assemblies.css was written to stop.
     */
    <div className="prop">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="prop-hero p-hero-own" data-sec="AS-PROP.hero">
        <Frame m={page.hero} className="prop-hero-img" />
        <div className="prop-hero-in">
          <span className="t-micro label">{page.eyebrow}</span>
          <h1 className="t-display-l">{page.headline}</h1>
          <p className="t-body-l dim">
            {v.jurisdiction} · {v.propertyLifecycle === "development"
              ? "In development"
              : v.propertyLifecycle === "acquired" ? "Land acquired" : "Stabilised"}
          </p>
          <div className="row">
            <Link className="btn" href="#opening">Explore the property ↓</Link>
            <Link className="btn primary" href="/contact">Request materials</Link>
          </div>
        </div>
      </section>

      {/* ── SPINE ──────────────────────────────────────────────── */}
      <nav className="prop-spine" aria-label="This property">
        <div className="wrap">
          <ul>
            {SPINE.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="t-micro">{s.label}</a></li>
            ))}
          </ul>
          <Link className="btn" href="/contact">Request introduction</Link>
        </div>
      </nav>

      {/* ── OPENING NOTE ───────────────────────────────────────── */}
      <section id="opening" className="prop-sec" data-sec="AS-PROP.opening">
        <div className="wrap">
          <h2 className="t-display-m">
            {page.openingTitle[0]}<br />
            <em>{page.openingTitle[1]}</em>
          </h2>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-m)" }}>{page.opening}</p>

          <div className="prop-strip">
            <div>
              <span className="t-micro label">Place</span>
              <p className="t-body">{estate?.region ?? v.jurisdiction}</p>
            </div>
            <div>
              <span className="t-micro label">Asset stage</span>
              <p className="t-body">{v.propertyLifecycle}</p>
            </div>
            <div>
              <span className="t-micro label">Ownership basis</span>
              <p className="t-body">Contribution-weighted interest in one vehicle</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE BEHIND IT ───────────────────────────────── */}
      <section className="prop-sec on-panel" data-sec="AS-PROP.authors">
        <div className="wrap">
          <h2 className="t-display-s">
            A property is a series of decisions.<br />
            <em>The authors of those decisions should be visible.</em>
          </h2>
          <div className="prop-authors">
            {["Architectural author", "Land and delivery author"].map((role) => (
              <article key={role} className="panel on-paper">
                <div className="pf pf-empty" data-aspect="portrait" role="img"
                     aria-label={`No portrait: ${role} is not yet appointed`}>
                  <span className="t-micro label">portrait · not yet produced</span>
                </div>
                <span className="t-micro label" style={{ marginTop: "var(--gc-sp-2xs)" }}>{role}</span>
                {/* Withheld rather than invented. An appointment is a
                    recorded act, and naming somebody before it exists
                    would be the same failure as an unappraised valuation. */}
                <p className="t-body-s dim">Named once the appointment is recorded.</p>
              </article>
            ))}
          </div>
          <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            Authorship is not branding. It is accountability for the brief.
          </p>
        </div>
      </section>

      {/* ── THE SITE ───────────────────────────────────────────── */}
      <section id="site" className="prop-sec" data-sec="AS-PROP.site">
        <div className="wrap">
          <Frame m={page.siteImage} />
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-l)" }}>
            The landscape sets the terms.
          </h2>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-s)" }}>{page.siteNote}</p>

          <div className="prop-strip">
            <div>
              <span className="t-micro label">Access</span>
              <p className="t-body">{page.access}</p>
            </div>
            <div>
              <span className="t-micro label">Ecological context</span>
              <p className="t-body">{estate?.ecology ?? "Not surveyed"}</p>
            </div>
            <div>
              <span className="t-micro label">Protection</span>
              <p className="t-body">{page.protection}</p>
            </div>
          </div>

          <div className="kv" style={{ marginTop: "var(--gc-sp-m)" }}>
            <span className="label t-micro">Land</span>
            <span className="v t-mono-s">{v.landArea}</span>
          </div>
          {v.coordinates ? (
            <div className="kv">
              <span className="label t-micro">Coordinates</span>
              <span className="v t-mono-s">{v.coordinates}</span>
            </div>
          ) : null}
          <div className="kv">
            <span className="label t-micro">Keys</span>
            <span className="v t-mono-s">{v.keys}</span>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURAL INTENT ───────────────────────────────── */}
      <section id="architecture" className="prop-sec on-panel" data-sec="AS-PROP.architecture">
        <div className="wrap">
          <div className="prop-intent">
            <Frame m={page.exterior} />
            <div>
              <span className="t-micro label">Mass</span>
              <p className="t-body measure">{page.mass}</p>
              <span className="t-micro label" style={{ marginTop: "var(--gc-sp-m)", display: "block" }}>
                Light
              </span>
              <p className="t-body measure">{page.light}</p>
            </div>
          </div>
          <div className="prop-pair">
            {page.architectureFrames.map((m) => <Frame key={m.id} m={m} />)}
          </div>
          <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)" }}>
            Image kind and date remain attached to every frame.
          </p>
        </div>
      </section>

      {/* ── THE SPACES ─────────────────────────────────────────── */}
      <section id="spaces" className="prop-sec" data-sec="AS-PROP.spaces">
        <div className="wrap">
          <h2 className="t-display-s">
            Each space has a job.<br />
            <em>Each job has a relationship to the landscape.</em>
          </h2>
        </div>

        {page.chapters.map((c, i) => (
          <article key={c.name} className="prop-chapter">
            <div className="wrap">
              <Frame m={c.dominant} />
              <div className="prop-chapter-head">
                <div>
                  <span className="t-micro label">{c.name}</span>
                  <p className="t-body-l measure">{c.statement}</p>
                </div>
                <span className="t-mono-s dim">
                  {String(i + 1).padStart(2, "0")} / {String(page.chapters.length).padStart(2, "0")}
                </span>
              </div>
              <div className="prop-triad">
                {c.supporting.map((m) => <Frame key={m.id} m={m} />)}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── MATERIAL PALETTE ───────────────────────────────────── */}
      <section id="materials" className="prop-sec on-panel" data-sec="AS-PROP.materials">
        <div className="wrap">
          <h2 className="t-display-s">The house is composed, not decorated.</h2>
          <div className="prop-palette">
            {page.palette.map((m) => (
              <article key={m.material}>
                <Frame m={m.slot} />
                <span className="t-micro label" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  {m.material}
                </span>
                <p className="t-body-s dim">{m.role}</p>
              </article>
            ))}
          </div>

          <div className="panel on-paper" style={{ marginTop: "var(--gc-sp-l)" }}>
            <span className="t-micro label">One system, three climates</span>
            <ul className="t-body-s" style={{ marginTop: "var(--gc-sp-2xs)", paddingLeft: "1.1em" }}>
              {ARCHITECTURAL_LANGUAGE.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>

          <p className="t-body dim" style={{ marginTop: "var(--gc-sp-m)" }}>
            Material specification is released with the private materials.
          </p>
          <Link className="btn" href="/contact">Request the design materials →</Link>
        </div>
      </section>

      {/* ── THE VEHICLE ────────────────────────────────────────── */}
      <section id="vehicle" className="prop-sec" data-sec="AS-PROP.vehicle">
        <div className="wrap">
          <h2 className="t-display-s">
            Beauty is not the whole proposition.<br />
            <em>The property must also have a clear legal and financial home.</em>
          </h2>

          <div className="prop-grid" style={{ marginTop: "var(--gc-sp-m)" }}>
            <div>
              <span className="t-micro label">One property</span>
              <p className="t-body">{v.propertyName} · {v.assetCode}</p>
            </div>
            <div>
              <span className="t-micro label">One investment vehicle</span>
              <p className="t-body">{v.registeredName}</p>
              <p className="t-body-s dim">
                {v.llpin ? `LLPIN ${v.llpin}` : "Not yet incorporated"} · {v.registrar}
              </p>
            </div>
            <div>
              <span className="t-micro label">Ownership interest</span>
              <p className="t-body">
                Contribution-weighted, from {v.ladder.minimumInvestmentBps / 100}% in{" "}
                {v.ladder.stepBps / 100}% steps
              </p>
            </div>
            <div>
              <span className="t-micro label">Time entitlement</span>
              <p className="t-body">
                {v.entitlement
                  ? `${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} nights a year across the vehicle`
                  : "Not yet set for this vehicle"}
              </p>
            </div>
            <div>
              <span className="t-micro label">Decision rights</span>
              <p className="t-body">
                {v.governance
                  ? `An ordinary resolution needs more than ${v.governance.ordinaryBps / 100}%. A tie is not approval.`
                  : "Not yet set for this vehicle"}
              </p>
            </div>
            <div>
              <span className="t-micro label">Evidence</span>
              <p className="t-body">Reports, documents and resolutions, at the vantage you hold</p>
            </div>
          </div>

          {/*
            The figures, and only where the vehicle clears its gate.
            Two of the three do not. Showing a unit price for a vehicle
            whose equity is contested by ₹50 lakh would be the exact
            failure publishable() exists to prevent — so the section
            states what is being reconciled instead.
          */}
          {gate.ok ? (
            <div className="prop-figures">
              <div className="kv">
                <span className="label t-micro">Project total</span>
                <span className="v t-mono-s money">{inr(v.stack.projectTotal)}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Unit</span>
                <span className="v t-mono-s money">{inr(v.offering.unitPrice)}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Available</span>
                <span className="v t-mono-s">
                  {v.offering.available} of {v.offering.units}
                </span>
              </div>
              {wf.state === "complete" ? (
                <div className="kv">
                  <span className="label t-micro">To partners</span>
                  <span className="v t-mono-s">
                    {(v.operating.waterfall!.toPartners! / 100).toFixed(2)}% of gross · forecast
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="panel on-panel prop-hold" style={{ marginTop: "var(--gc-sp-m)" }}>
              <span className="t-micro label">Figures are being reconciled</span>
              <p className="t-body measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                This vehicle&rsquo;s source documents disagree on the points below. Nothing
                financial is shown here until they agree, because a figure that renders cleanly
                is the hardest kind to doubt.
              </p>
              <ul className="t-body-s" style={{ marginTop: "var(--gc-sp-2xs)", paddingLeft: "1.1em" }}>
                {gate.because.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          )}

          <Link className="btn" href="/how-it-works" style={{ marginTop: "var(--gc-sp-m)" }}>
            Understand space, time, capital and governance →
          </Link>
        </div>
      </section>

      {/* ── EVIDENCE ───────────────────────────────────────────── */}
      <section id="evidence" className="prop-sec on-panel" data-sec="AS-PROP.evidence">
        <div className="wrap">
          <h2 className="t-display-s">What can be read now?</h2>
          <div className="stack" style={{ marginTop: "var(--gc-sp-m)" }}>
            {EVIDENCE_TIERS.map((t) => (
              <div key={t.tier} className="panel on-paper prop-tier">
                <div>
                  <span className="t-micro label">{t.tier}</span>
                  <p className="t-body">{t.holds}</p>
                </div>
                {t.to ? (
                  <Link className="btn" href={t.to}>{t.action} →</Link>
                ) : (
                  <span className="t-mono-s dim">You are reading it</span>
                )}
              </div>
            ))}
          </div>

          {/* The brochure. Generated from the same registries as this page,
              so a downloaded document and the page cannot disagree. */}
          <div className="panel on-paper" style={{ marginTop: "var(--gc-sp-m)" }}>
            <span className="t-micro label">Take it with you</span>
            <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-3xs)" }}>
              A one-page summary, generated from the same records this page reads. It carries the
              same reconciliation notes.
            </p>
            <a className="btn" href={`/api/brochure/${v.slug}`}>Download the brief</a>
          </div>
        </div>
      </section>

      {/* ── INVITATION ─────────────────────────────────────────── */}
      <section className="prop-sec" data-sec="AS-PROP.invitation">
        <div className="wrap">
          <h2 className="t-display-m">
            If the place holds your attention,<br />
            <em>the material should hold up.</em>
          </h2>
          <div className="row" style={{ marginTop: "var(--gc-sp-m)" }}>
            <Link className="btn primary" href="/contact">Request private materials</Link>
            <Link className="btn" href="/invest/qualify">Speak with the Collective</Link>
          </div>
          <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            Capital is at risk. Any specific opportunity is governed by its applicable private
            materials, not by this public property page.
          </p>

          {/* The shot list, stated. See PROPERTY_PAGE_LAWS. */}
          <p className="t-mono-s dim" style={{ marginTop: "var(--gc-sp-l)" }}>
            {gap.filled} of {gap.declared} frames on this page have been produced.
          </p>
        </div>
      </section>

      <Footer />
      <IrisPanel vehicleSlug={v.slug} />
    </div>
  );
}
