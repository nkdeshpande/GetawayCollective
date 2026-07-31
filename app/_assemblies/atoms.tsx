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
 * It carries NO disclosure text of any kind — see the note in the body.
 * The original argument for putting it here was that a disclosure set
 * smaller than the claim it qualifies is designed not to be read, and
 * that holds; the error was concluding it should therefore appear under
 * every page. Set at any size, under every page, it is furniture.
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
          NO DISCLOSURE BLOCK HERE, IN ANY FORM.

          This footer carried the standing disclosure in full on all 25
          pages that render it. That was replaced with a two-sentence
          summary pointing at the documents, and the summary has now been
          removed too.

          Both were the same mistake at different lengths. Text under
          every page is text nobody reads, so it bought the APPEARANCE of
          disclosure rather than the fact of it — and a summary that
          paraphrases a binding document is a second wording that drifts
          from the first the moment either is revised.

          The disclosure lives in the standing documents, which are
          linked from the map below like everything else. Nothing on this
          platform paraphrases them.
        */}

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
