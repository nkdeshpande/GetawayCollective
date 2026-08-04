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

        {/*
          Repointed at the v5 IA, on the route table's own authority.

          Seven of these twelve links pointed at v4 paths that the v5
          migration retired. They kept compiling — `href` takes a string —
          and 404'd for every person who used the footer, which is the
          part of a page people reach for when they are already lost.

          Where each went: constants/routes.ts records that story, people
          and voices were consolidated into GC-400, so those go to /about.
          Answers is doctrine, which is GC-300. There is no gallery route
          in v5 and inventing one here would be inventing IA in a footer —
          the Collection is where places are seen, so Places holds the two
          surfaces that exist.

          The Capital column linked "How it works" to one named vehicle.
          That is a nav pointing at a single item of inventory, and it
          breaks the moment that vehicle is not the one being raised.
        */}
        <div className="foot-map">
          <div>
            <h4>Places</h4>
            <Link href="/collection">Collection</Link>
            <Link href="/journal">Journal</Link>
          </div>
          <div>
            <h4>Capital</h4>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/legal/risk-disclosure">Risk disclosure</Link>
            <Link href="/invest/qualify">Qualification</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/disclosures">Disclosures</Link>
          </div>
          <div>
            <h4>Collective</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {/* States the gate at the link. Following this used to end in
                a bare refusal — correct behaviour, discovered the wrong
                way round. */}
            <Link href="/portfolio">Portfolio · private</Link>
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
        {/*
          Three of these five were v4 paths. `/auth/sign-in` is the one
          that mattered most: the sign-in link in the header of every
          page on the platform went to a route that does not exist, so
          the only way in was to type /sign-in.
        */}
        <nav aria-label="Main">
          <Link href="/collection">Collection</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          {/* "Private access", not "Sign in".
              PUBLIC.09: an affordance names what is behind it rather than
              promising an action the deployment may not be able to
              complete. When identity is connected this destination signs
              somebody in; until then it explains itself, and either way
              the label was true. */}
          <Link href="/sign-in">Private access</Link>
        </nav>
      </div>
    </header>
  );
}
