/**
 * NOT FOUND AND ERROR, IN THE SITE'S OWN FRAME — 25 Sep 2026
 *
 * Client components: the 404 echoes the path that was asked for, and the
 * error page needs reset(). See ./system.tsx for why these moved.
 *
 * The error itself is never rendered: a stack trace or an exception name
 * tells someone probing the site what the stack is (AS-16's correction).
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { wearsSite } from "../shell";

/** Inside the rails (a private route that called notFound) the site's styles need their own root. */
function Frame({ children }: { children: React.ReactNode }) {
  const p = usePathname() || "/";
  const page = <div className="pg pg-col">{children}</div>;
  return wearsSite(p) ? page : <div className="site">{page}</div>;
}

export function SiteNotFound() {
  const asked = usePathname() || "/";
  return (
    <Frame>
      <section className="tx-hero lt">
        <div className="tx-head">
          <span className="eb">404 · Not found</span>
          <h1 className="tx-h1">Nothing <span>at this address.</span></h1>
          <p className="tx-lead">The link may be mistyped, or the page may have moved. Nothing you were entitled to see has been lost.</p>
          <p className="mono tx-meta lost-path">{asked}</p>
        </div>
      </section>
      <article className="tx-body lt">
        <div className="lost-ways">
          <Link href="/collection"><span className="eb">01</span><b>The collection</b><em>Every estate, its figures and its documents</em></Link>
          <Link href="/answers"><span className="eb">02</span><b>Answers</b><em>The questions people ask most, with sources</em></Link>
          <Link href="/contact"><span className="eb">03</span><b>Write to us</b><em>Investor Relations replies on working days, in writing</em></Link>
        </div>
      </article>
    </Frame>
  );
}

export function SiteError({ reset }: { reset: () => void }) {
  return (
    <Frame>
      <section className="tx-hero lt">
        <div className="tx-head">
          <span className="eb">Something went wrong</span>
          <h1 className="tx-h1">This page <span>did not load.</span></h1>
          <p className="tx-lead">Nothing you submitted has been changed by this. Try again; if it happens twice, the collection and the enquiry desk are still open.</p>
        </div>
      </section>
      <article className="tx-body lt">
        <div className="tx-links">
          <button className="btn dark" type="button" onClick={reset}>Try again</button>
          <Link className="btn gray" href="/collection">The collection</Link>
          <Link className="btn gray" href="/contact">Write to us</Link>
        </div>
      </article>
    </Frame>
  );
}
