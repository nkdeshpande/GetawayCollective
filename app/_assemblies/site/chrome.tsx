/**
 * THE SITE CHROME — the bar, the foot, and the symbols both draw with
 *
 * L1-01 §29-0b · 24 Sep 2026. The public surface's own frame, in place of
 * the rails the signed-in surfaces keep (app/_assemblies/shell.tsx picks
 * one or the other by route).
 *
 * The foot carries the same three-entity statement the old footer did, and
 * for the same reason it carries no disclosure text: a paraphrase of a
 * binding document is a second wording that drifts from the first. It
 * links to the documents instead.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { accountLabel } from "@/lib/account-label";
import { usePathname } from "next/navigation";
import { MARK_CUT, MARK_PATH } from "@/constants/brand-system";
import { Mark } from "../brandmark";
import { SiteSearch } from "./search";
import { STAGES, stageOf } from "@/content/site/next";

/** Symbols the rendered markup refers to by id: the mark, the arrow, three glyphs. */
export function SiteSymbols() {
  return (
    <svg width="0" height="0" className="site-symbols" aria-hidden="true" focusable="false">
      <symbol id="gcm" viewBox="0 0 100 100"><path fillRule="evenodd" d={MARK_PATH} /></symbol>
      <symbol id="gcc" viewBox="0 0 100 100"><path d={MARK_CUT} /></symbol>
      <symbol id="ne" viewBox="0 0 24 24"><path d="M7 21L15 5M9 5H15L18 11" fill="none" stroke="currentColor" strokeWidth="1.8" /></symbol>
      <symbol id="i-unit" viewBox="0 0 24 24"><path d="M5 5H8V8H5ZM10.5 5H13.5V8H10.5ZM16 5H19V8H16ZM5 10.5H8V13.5H5ZM10.5 10.5H13.5V13.5H10.5ZM16 10.5H19V13.5H16ZM5 16H8V19H5ZM10.5 16H13.5V19H10.5ZM16 16H19V19H16Z" fill="none" stroke="currentColor" strokeWidth="1.4" /></symbol>
      <symbol id="i-gov" viewBox="0 0 24 24"><path d="M4 20H20M6 17V9M12 17V9M18 17V9M3 6H21" fill="none" stroke="currentColor" strokeWidth="1.6" /></symbol>
      <symbol id="i-net" viewBox="0 0 24 24"><path d="M4 6H10V12H4ZM14 12H20V18H14ZM10 9H17V12" fill="none" stroke="currentColor" strokeWidth="1.6" /></symbol>
    </svg>
  );
}

const NAV = [
  ["/collection", "Collection"], ["/how-it-works", "How it works"], ["/journal", "Journal"], ["/team", "Team"], ["/about", "About"],
] as const;

/**
 * The way in, or back. 25 Sep 2026: the bar had no sign-in at all, and a
 * signed-in partner saw nothing that led to their holdings. Signed out it
 * reads "Sign in"; signed in it names the person's own place and goes to
 * /start, which sends them there (lib/landing.ts). The session is read
 * once, after the page has drawn, so the bar never waits on it.
 */
function AccountLink() {
  const [access, setAccess] = useState<string | null>(null);
  const [known, setKnown] = useState(false);
  useEffect(() => {
    let live = true;
    fetch("/api/auth/session").then((r) => (r.ok ? r.json() : null)).catch(() => null).then((sess) => {
      if (!live) return;
      const u = (sess as { user?: { access?: string } } | null)?.user; // vocab-lint-ignore — Auth.js field name
      setAccess(u ? u.access ?? "identified" : null);
      setKnown(true);
    });
    return () => { live = false; };
  }, []);
  return <Link className={`nav-acct${known ? " on" : ""}`} href={access ? "/start" : "/sign-in"}>{accountLabel(access)}</Link>;
}

/**
 * The bar steps aside as a reader goes down the page. 25 Sep 2026, founder:
 * a slow disappearing motion on scroll. How far it has gone is tied to how
 * far the reader has scrolled (--nav-p, 0 to 1 over the first 280px after
 * the top 40px), eased by a transition, so it recedes rather than snaps.
 * Scrolling up, or tabbing into it, brings it straight back. A reader who
 * asks for reduced motion keeps a still bar.
 */
function useReceding(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = window.scrollY, raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY, dy = y - last;
      last = y;
      if (y < 40) setP(0);
      else if (dy < -6) setP(0);
      else if (dy > 0) setP((q) => Math.max(q, Math.min(1, (y - 40) / 280)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return p;
}

export function SiteNav() {
  const pathname = usePathname() || "/";
  const here = (p: string) => pathname === p || pathname.startsWith(p + "/");
  const stage = stageOf(pathname);
  const p = useReceding();
  return (
    <header className={`nav${p >= 1 ? " away" : ""}`} style={{ "--nav-p": p.toFixed(3) } as React.CSSProperties}>
      {/* 25 Sep 2026, founder: the mark alone, without the name beside it.
          The name stays the link's accessible label. */}
      <Link className="brand" href="/" aria-label="Getaway Collective, home"><Mark size={30} /></Link>
      {/* Where this page sits on the path (d03): Discover to Hold, quietly. */}
      {stage ? (
        <span className="nav-path" title={STAGES.join(" → ")}>
          <span className="nav-path-bar" aria-hidden="true">{STAGES.map((s, i) => <i key={s} className={i < stage.n ? "on" : undefined} />)}</span>
          <span className="nav-path-l"><span className="sr">Stage {stage.n} of {STAGES.length}: </span>{stage.name}</span>
        </span>
      ) : null}
      <nav className="links" aria-label="Main">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} aria-current={here(href) ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <SiteSearch />
      <span className="lang">EN</span>
      <AccountLink />
      <Link className="btn btn-s" href="/contact">Enquire</Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="cols">
        <div>
          <span className="eb">Company</span>
          <Link href="/about">About us</Link><Link href="/team">Team</Link><Link href="/how-we-build">How we build</Link>
          <Link href="/how-it-works">How it works</Link><Link href="/journal">Journal</Link><Link href="/press">Press kit</Link>
          <Link href="/how-to-qualify">How to qualify</Link><Link href="/operating-partner">Operating partner</Link><Link href="/careers">Careers</Link>
          <Link href="/answers">Answers</Link><Link href="/glossary">Glossary</Link>
        </div>
        <div>
          <span className="eb">Estates</span>
          <Link href="/collection/slowspace-solace">Solace</Link><Link href="/collection/slowspace-coastal">Seaside Confluence</Link>
          <Link href="/collection/coorg-coffee-creek">SlowSpace Creek</Link><Link href="/collection/coffee-fields-forever">Coffee Fields Forever</Link>
          <Link href="/collection">The collection</Link>
        </div>
        <div>
          <span className="eb">Contact</span>
          <Link href="/contact">Enquire</Link><Link href="/collection/slowspace-coastal#waitlist">Confluence waitlist</Link>
          <Link href="/sign-in">Sign in</Link>
          <span className="mono sel foot-addr">ir@getawaycollective.co</span>
        </div>
        <div className="sub">
          <span className="eb">The Signal</span>
          <p className="para foot-p">A weekly note. No tracking pixel, and the list is never sold.</p>
          <div><Link className="btn" href="/signal">Subscribe</Link></div>
        </div>
      </div>
      <div className="base">
        <Mark size={34} />
        <div>
          <div className="triad">
            <span><b>Getaway Collective</b> governs the vehicles and holds no equity in them.</span>
            <span><b>One LLP per property</b>, owned by its partners.</span>
            <span><b>Sensory Getaways</b> operates the properties under contract.</span>
          </div>
          <div className="legal">
            <span>© 2026 Getaway Collective. Satoshi by Indian Type Foundry.</span>
            <Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/risk-disclosure">Risk factors</Link><Link href="/legal/disclosures">Disclosures</Link><Link href="/legal">All documents</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
