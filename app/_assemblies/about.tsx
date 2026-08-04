/**
 * AS-32.about · ABOUT
 *
 * Replaces the registry scaffold that was serving this route. Anybody
 * arriving at /about got "AS-32 · gateway vantage · public" and a list of
 * declared section slots — the filing system, published.
 *
 * ── WHAT THIS PAGE OWES ──────────────────────────────────────────────
 * constants/route-contracts.ts states it: what GC is, why it exists, who
 * is responsible, how it is structurally different. In that order,
 * because that is the order a stranger asks them.
 *
 * ── THE STRUCTURE IS THE ARGUMENT ────────────────────────────────────
 * The three-entity separation is not a footnote here, it is the answer to
 * "how is this different". Most fractional-ownership arrangements have
 * the party writing the rules also holding the equity and taking the
 * operating margin. GC's rule-writer holds no equity in the vehicles it
 * governs, and that is checkable rather than claimed — which is why the
 * entities are named with what each may and may not do.
 *
 * ── WHAT IT DOES NOT DO ──────────────────────────────────────────────
 * No figures. Not one. A number here would need PUBLIC.02 semantics and
 * a basis, and every number GC has belongs to a vehicle rather than to
 * the company. The Collection is where figures live.
 *
 * People are named where an appointment is recorded and not before —
 * same rule as the property pages. The section says so rather than
 * omitting itself, because a missing "who is responsible" reads worse
 * than an honest one.
 */

import Link from "next/link";
import { Footer } from "./atoms";
import { VEHICLES } from "@/constants/vehicles";
import { ESTATES } from "@/constants/spatial";

/** What each entity may do, and — the load-bearing half — may not. */
const ENTITIES = [
  {
    name: "Getaway Collective",
    role: "Governance",
    does:
      "Writes the constitution every vehicle runs on, sets the rules for how capital, time and " +
      "decisions move, and publishes the record.",
    doesNot:
      "Holds no equity in the vehicles it governs and takes no share of what a property earns.",
  },
  {
    name: "The vehicle",
    role: "Ownership",
    does:
      "One LLP per property. It owns the land and the building, holds the agreements, and its " +
      "partners hold contribution-weighted interests in it.",
    doesNot:
      "Owns nothing else. A vehicle never holds two properties, and a property is never split " +
      "across two vehicles.",
  },
  {
    name: "Sensory Getaways",
    role: "Operating",
    does:
      "Runs the properties day to day under a management agreement, and is paid first out of " +
      "revenue for doing it.",
    doesNot:
      "Owns no part of the vehicle and casts no vote in it. It can be measured against the " +
      "agreement and replaced.",
  },
];

const DOES_NOT = [
  "Pool capital across properties. One property, one vehicle, one set of partners.",
  "Promise a return. Every forward figure is a model's output and is labelled as one.",
  "Sell time. Entitlement is an incident of a capital position, not the thing being bought.",
  "Take a share of what a property earns. The rule-writer earning from the outcome is the " +
    "conflict this structure exists to remove.",
];

export function About() {
  /* Read, not typed — the page cannot claim a portfolio that does not
     exist, and it stays true the day a fourth vehicle is formed. */
  const vehicles = VEHICLES.length;
  const keys = ESTATES.reduce((n, e) => n + e.keys, 0);
  const regions = new Set(ESTATES.map((e) => e.region)).size;

  return (
    <div className="about">
      <section className="about-hero p-hero-own" data-sec="AS-32.about.open">
        <div className="wrap">
          <span className="t-micro label">About</span>
          <h1 className="t-display-l">
            Somewhere worth returning to,<br />
            <em>owned in a way you can check.</em>
          </h1>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            Getaway Collective builds remarkable places in India and puts each one inside its own
            company, so that owning a share of a house is an ordinary, inspectable thing rather
            than an arrangement you have to take on trust.
          </p>
        </div>
      </section>

      <section className="about-sec" data-sec="AS-32.about.why">
        <div className="wrap">
          <h2 className="t-display-s">Why it exists</h2>
          <div className="about-cols">
            <p className="t-body-l measure">
              A second home is bought on one number and held on several nobody discusses. It is
              used a few weeks a year, costs the same in the weeks it is empty, and eventually
              becomes a maintenance obligation attached to somebody else&rsquo;s memory of a place.
            </p>
            <p className="t-body measure">
              The alternative most people are offered solves the cost and introduces a worse
              problem: capital pooled across assets you did not choose, run by a company that also
              wrote the rules and also takes a cut. You end up owning a position you cannot
              examine.
            </p>
          </div>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            We think the fix is structural rather than commercial. One property. One company that
            owns it. A share you hold in that company, with the economics, the votes and the time
            all stated in the same document — and a rule-writer with nothing to gain from how it
            turns out.
          </p>
        </div>
      </section>

      <section className="about-sec on-panel" data-sec="AS-32.about.what">
        <div className="wrap">
          <h2 className="t-display-s">What it is</h2>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Three companies, kept deliberately apart. The separation is the product — everything
            else follows from it.
          </p>

          <div className="about-entities">
            {ENTITIES.map((e, i) => (
              <article key={e.name}>
                <span className="t-mono-s dim">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-body-l" style={{ fontWeight: 600 }}>{e.name}</h3>
                <span className="t-micro label">{e.role}</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>{e.does}</p>
                {/* The half that matters. Anybody can list what they do. */}
                <p className="t-body-s about-not">{e.doesNot}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-sec" data-sec="AS-32.about.different">
        <div className="wrap">
          <h2 className="t-display-s">How it is different</h2>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Four things we will not do. Each one is a thing the standard version of this business
            does, and each is written into the constitution rather than into a promise.
          </p>
          <ul className="about-not-list t-body measure">
            {DOES_NOT.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <Link className="btn" href="/how-it-works" style={{ marginTop: "var(--gc-sp-m)" }}>
            How ownership actually works →
          </Link>
        </div>
      </section>

      <section className="about-sec on-panel" data-sec="AS-32.about.who">
        <div className="wrap">
          <h2 className="t-display-s">Who is responsible</h2>
          <p className="t-body-l measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Every vehicle has a designated partner who answers for it, named in its own
            constitution and on its property record. Getaway Collective is the general partner
            across all three.
          </p>
          {/*
            No names until appointments are recorded — the same rule the
            property pages apply to their architectural authors. Stated
            rather than skipped: a missing "who" reads worse than an
            honest one, and this is a page about accountability.
          */}
          <p className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Individual appointments — the architectural author and the land and delivery author on
            each property — are named here once each appointment is recorded, and not before.
            Naming somebody ahead of the record would be the same failure as quoting a valuation
            nobody has produced.
          </p>

          <div className="about-count">
            <div>
              <span className="t-display-m">{vehicles}</span>
              <span className="t-micro label">vehicles</span>
            </div>
            <div>
              <span className="t-display-m">{keys}</span>
              <span className="t-micro label">keys across the three</span>
            </div>
            <div>
              <span className="t-display-m">{regions}</span>
              <span className="t-micro label">regions in Karnataka</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-sec" data-sec="AS-32.about.invite">
        <div className="wrap">
          <h2 className="t-display-m">
            The material should hold up<br />
            <em>to whatever you bring to it.</em>
          </h2>
          <div className="row" style={{ marginTop: "var(--gc-sp-m)" }}>
            <Link className="btn primary" href="/collection">See the Collection</Link>
            <Link className="btn" href="/contact">Speak to somebody</Link>
          </div>
          <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
            Capital is at risk. Any specific opportunity is governed by its own private materials,
            not by this page.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
