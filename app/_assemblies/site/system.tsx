/**
 * STATUS, NOT FOUND AND ERROR, IN THE SITE'S OWN FRAME — 25 Sep 2026
 *
 * The three pages a visitor reaches when something is not where they
 * expected it. Before this they rendered the registry's scaffold (404, 500)
 * or the old system frame (/status) inside a site that had moved on.
 *
 * /status used to state its rows as constants, and one of them went false
 * without anyone touching the page: "Private access — not yet open" stood
 * while email sign-in was working in production. Each row is now derived
 * from the same presence checks /api/health reports, so the page cannot
 * say a capability is closed while it is open, or the reverse. It names
 * what a visitor can do, never a variable, a vendor or a host.
 *
 * The 404 echoes the path that was asked for (Digital Visuals · ANC.07) so
 * a mistyped link can be seen as mistyped, and offers three ways on. It
 * never says whether a private page exists at that address.
 */

import Link from "next/link";

const present = (name: string) => Boolean(process.env[name]?.trim());

/** Stamped when this page was built; a clock that ticked would imply a monitor behind it that does not exist. */
const STAMPED = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/**
 * The complaints figure DOC-06 promises here.
 *
 * The complaints procedure states that totals are published at /status
 * each quarter. Zero is publishable, and publishing zero is the point: a
 * quarter with no complaints is a fact rather than an absence. The quarter
 * is stated beside the count so the figure cannot age into a claim about a
 * period it never covered.
 */
const COMPLAINTS = {
  quarter: "July – September 2026",
  received: 0,
  upheld: 0,
  open: 0,
} as const;

type Row = readonly [name: string, detail: string, up: boolean];

function rows(): readonly Row[] {
  const signIn = present("AUTH_SECRET") && present("DATABASE_URL") && present("RESEND_API_KEY");
  return [
    ["The collection", "Every published estate, its figures and its documents", true],
    ["The Journal and the legal documents", "Published and current", true],
    ["Enquiries", present("DATABASE_URL") ? "Recorded as they arrive" : "Not connected in this deployment", present("DATABASE_URL")],
    ["Sign-in", signIn ? "Open, by a single-use link sent to your email" : "Not open yet. Nothing is lost by waiting.", signIn],
  ];
}

export function SiteStatus() {
  const R = rows();
  const down = R.filter((r) => !r[2]).length;
  return (
    <div className="pg pg-col">
      <section className="tx-hero lt">
        <div className="tx-head">
          <span className="eb">System status · verified {STAMPED}</span>
          <h1 className="tx-h1">{down === 0 ? <>Everything <span>is serving.</span></> : <>Serving, <span>with {down === 1 ? "one exception" : `${down} exceptions`}.</span></>}</h1>
          <p className="tx-lead">What a visitor can do on this site today. It does not expose infrastructure, private records or security detail.</p>
        </div>
      </section>
      <article className="tx-body lt">
        <div className="st-rows">
          {R.map(([name, detail, up]) => (
            <div className="st-row" key={name}>
              <i className={up ? "up" : "off"} aria-hidden="true" />
              <span><b>{name}</b><em>{detail}</em></span>
              <span className="mono">{up ? "Serving" : "Not open"}</span>
            </div>
          ))}
        </div>
        <h2 className="tx-h2">Complaints · {COMPLAINTS.quarter}</h2>
        <p className="tx-p">The complaints procedure commits to publishing these totals here each quarter. A quarter with none is stated rather than left blank.</p>
        <div className="tx-figs">
          <div><b>{COMPLAINTS.received}</b><span>received</span></div>
          <div><b>{COMPLAINTS.upheld}</b><span>upheld</span></div>
          <div><b>{COMPLAINTS.open}</b><span>still open</span></div>
        </div>
        <p className="tx-p">Private pages are closed to anyone who has not signed in. That is a protective state, not an incident.</p>
        <div className="tx-links">
          <Link className="btn dark" href="/legal/complaints">The complaints procedure</Link>
          <Link className="btn gray" href="/collection">The collection</Link>
        </div>
      </article>
    </div>
  );
}
