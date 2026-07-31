/**
 * ASSEMBLY ATOMS — the pieces every screen shares
 *
 * Wave 7 · Workspaces
 *
 * Ported from GC-ASSEMBLIES.html. Each carries the rule that produced it,
 * because these are the components most likely to be reused by someone
 * who has not read why they look the way they do.
 */

import Link from "next/link";
import {
  CONFIDENCE_LABEL, PROVISIONAL, type Confidence, plate,
} from "./data";

/**
 * A forward-looking figure rendered identically to a settled one is the
 * single easiest way to mislead without stating anything false.
 */
export function ConfidenceTag({ c }: { c: Confidence }) {
  return <span className={`conf ${c}`}>{CONFIDENCE_LABEL[c]}</span>;
}

/** A provisional percentage carries the mark. Trust it the same amount. */
export function Pct({ v, conf }: { v: number; conf: Confidence }) {
  return (
    <span className="pct">
      {PROVISIONAL.has(conf) ? <span className="prov">~</span> : null}
      {v.toFixed(1)}%
    </span>
  );
}

/**
 * The hero region (AS-23).
 *
 * NO FIGURE appears here. FB-1 bars full-bleed treatment wherever numeric
 * data is read: a number over an image is read against whatever pixels
 * sit behind it, and those differ per viewport and per crop.
 *
 * The scrim is structural, not decoration — type over an unscrimmed image
 * is legible only against the part of the image it happens to land on.
 */
export function Hero({
  eyebrow, claim, sup, go = [], hue = 158,
}: {
  eyebrow?: string;
  claim: React.ReactNode;
  sup?: string;
  go?: { t: string; to: string; primary?: boolean }[];
  hue?: number;
}) {
  return (
    <div className="hero">
      <span className="bed" style={plate(hue)} aria-hidden="true" />
      <span className="scrim" aria-hidden="true" />
      <div className="wrap in">
        {eyebrow ? <span className="t-micro label">{eyebrow}</span> : null}
        <h1 className="t-display-xl" style={{ marginTop: "var(--gc-sp-2xs)" }}>
          {claim}
        </h1>
        {sup ? <p className="sup t-body-l dim">{sup}</p> : null}
        {go.length ? (
          <div className="go">
            {go.map((g, i) => (
              <Link key={g.to} className={`btn ${i === 0 ? "primary" : ""}`} href={g.to}>
                {g.t}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The footer (AS-22).
 *
 * The standing disclosure renders at BODY size in the reading tone. A
 * disclosure set smaller than the claim it qualifies is a disclosure
 * designed not to be read — every prototype either omitted it or set it
 * in micro grey.
 *
 * All three entities are named wherever any one of them speaks.
 */
export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-ent">
          <div>
            <h3>Getaway Collective</h3>
            <p className="t-body-s dim">Governs the vehicles. Holds no equity in them.</p>
          </div>
          <div>
            <h3>Coastal Collection I LLP</h3>
            <p className="t-body-s dim">Holds the land title. Owned by its partners.</p>
          </div>
          <div>
            <h3>Sensory Getaways</h3>
            <p className="t-body-s dim">Operates the properties under contract.</p>
          </div>
        </div>

        {/*
          THE STANDING DISCLOSURE IS NOT REPEATED HERE.

          It used to be, in full, on all 25 pages that render this footer.
          It now lives in content/legal.ts and is rendered by exactly two
          documents: the Terms and Conditions at Part L, and the Risk
          Factors at Part A.

          The reason is not brevity. Wording repeated in twenty-five
          places becomes twenty-five wordings the moment one is revised,
          and which one a reader was shown then depends on which screen
          they happened to be on. A disclosure that varies by screen is
          not a disclosure. It is also the case that text appearing under
          every page is text nobody reads, so the repetition was buying
          the appearance of disclosure rather than the fact of it.

          A load-time check in content/legal.ts enforces the count, and a
          check in scripts/vocab-lint.js catches the wording reappearing
          anywhere outside those two documents.
        */}
        <div className="disclosure">
          <p>
            Capital is at risk and these positions are illiquid. What that means in full — including
            what happens to your position when things go wrong — is set out in the{" "}
            <Link href="/legal/risk-disclosure">Risk Factors</Link> and in Part L of the{" "}
            <Link href="/legal/terms">Terms and Conditions</Link>.
          </p>
          <p className="dim">
            Those two documents state it once, so that it can be revised once.
          </p>
        </div>

        <div className="foot-map">
          <div>
            <h4>Places</h4>
            <Link href="/collection">Collection</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/story">Story</Link>
          </div>
          <div>
            <h4>Capital</h4>
            <Link href="/how-capital-works">How it works</Link>
            <Link href="/legal/risk-disclosure">Risk disclosure</Link>
            <Link href="/answers">Answers</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/disclosures">Disclosures</Link>
          </div>
          <div>
            <h4>Collective</h4>
            <Link href="/voices">Voices</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/roles">Roles</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * The header (AS-20).
 *
 * NO FIGURE, at any vantage. This is the one component that renders on
 * every screen, so anything it shows it shows to whoever is looking — and
 * the narrowest vantage decides what is safe.
 */
export function Header({ vantage = "gateway" }: { vantage?: string }) {
  return (
    <header className="hud">
      <div className="hud-in">
        <Link href="/" className="brand t-micro" style={{ textDecoration: "none" }}>
          GC.SYSTEM
        </Link>
        <span className="t-micro label">{vantage} vantage</span>
        <nav aria-label="Main">
          <Link href="/collection">Collection</Link>
          <Link href="/how-capital-works">Capital</Link>
          <Link href="/voices">Voices</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/auth/sign-in">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
