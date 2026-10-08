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
import { useEffect, useRef, useState } from "react";
import { accountLabel } from "@/lib/account-label";
import { usePathname } from "next/navigation";
import { MARK_CUT, MARK_PATH } from "@/constants/brand-system";
import { Mark } from "../brandmark";
import { OPEN_SEARCH, SiteSearch } from "./search";
import { STAGES, stageOf } from "@/content/site/next";
import { NOTICES_CHANGED } from "./notices-wire";

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
 * Who is reading, read once. 25 Sep 2026: the bar had no sign-in at all,
 * and a signed-in partner saw nothing that led to their holdings. Signed
 * out it reads "Sign in"; signed in it names the person's own place and
 * goes to /start, which sends them there (lib/landing.ts). The session is
 * read once, after the page has drawn, so the bar never waits on it, and
 * the bar and the menu share the one answer.
 */
/**
 * How many notices the signed-in person has not read (GC-08-DS-001, step 3).
 * Asked once the session is known, and again when the notices page says it
 * has read them. Signed out it is never asked. A count that cannot be had
 * is 0: the bar points at nothing rather than at a guess.
 */
function useUnread(signedIn: boolean): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!signedIn) { setN(0); return; }
    let live = true;
    const ask = () => fetch("/api/notices").then((r) => (r.ok ? r.json() : null)).catch(() => null).then((j) => {
      if (live) setN(Number((j as { unread?: number } | null)?.unread) || 0);
    });
    void ask();
    window.addEventListener(NOTICES_CHANGED, ask);
    return () => { live = false; window.removeEventListener(NOTICES_CHANGED, ask); };
  }, [signedIn]);
  return n;
}

function useAccess(): [string | null, boolean] {
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
  return [access, known];
}

/**
 * The bar steps aside as a reader goes down the page. 25 Sep 2026, founder:
 * a disappearing motion on scroll; 28 Sep, the brief's motion budget: it
 * eases over 300ms rather than 900. How far it has gone is tied to how far
 * the reader has scrolled (--nav-p, 0 to 1 over the first 280px after the
 * top 40px), set on the document so the estate bar below can follow it.
 * Scrolling up, tabbing into it, or opening the menu brings it straight
 * back. A reader who asks for reduced motion keeps a still bar.
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
  useEffect(() => { document.documentElement.style.setProperty("--nav-p", p.toFixed(3)); }, [p]);
  return p;
}

/**
 * THE BAR — 28 Sep 2026
 *
 * Wide: the mark, the five places, then Enquire, which is the one filled
 * button; search and the way in sit quietly between. Where a page sits on
 * the path is one lit mark beside its name, the current stage only: a row
 * of filled bars read as progress through something nobody had begun.
 * The language mark is gone: there is one language, and a selector that
 * selects nothing is a promise.
 *
 * Narrow: the mark, a Menu, and Enquire. The menu is a disclosure, not a
 * dialog: it opens under the bar, Escape or a second tap closes it and
 * returns focus to the button, and it closes on its own when the page
 * changes.
 */
export function SiteNav() {
  const pathname = usePathname() || "/";
  const here = (p: string) => pathname === p || pathname.startsWith(p + "/");
  const stage = stageOf(pathname);
  const p = useReceding();
  const [access, known] = useAccess();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    const onWide = () => { if (window.innerWidth > 900) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onWide);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onWide); };
  }, [open]);
  const unread = useUnread(!!access);
  const acct = (
    <>
      {access ? (
        <Link className="nav-acct nav-ntc on" href="/notices" aria-label={unread ? `Notices, ${unread} new` : "Notices"}>
          Notices{unread ? <b aria-hidden="true">{unread}</b> : null}
        </Link>
      ) : null}
      <Link className={`nav-acct${known ? " on" : ""}`} href={access ? "/start" : "/sign-in"}>{accountLabel(access)}</Link>
    </>
  );
  return (
    <header className={`nav${p >= 1 && !open ? " away" : ""}${open ? " menu-open" : ""}`} style={{ "--nav-p": open ? "0" : p.toFixed(3) } as React.CSSProperties}>
      {/* 25 Sep 2026, founder: the mark alone, without the name beside it.
          The name stays the link's accessible label. */}
      <Link className="brand" href="/" aria-label="Getaway Collective, home"><Mark size={30} /></Link>
      {/* Where this page sits on the path (d03): Discover to Hold, quietly. */}
      {stage ? (
        <span className="nav-path" title={`Where this page sits: ${STAGES.join(" · ")}`}>
          <span className="nav-path-bar" aria-hidden="true">{STAGES.map((s, i) => <i key={s} className={i === stage.n - 1 ? "on" : undefined} />)}</span>
          <span className="nav-path-l"><span className="sr">Where this page sits on the path: </span>{stage.name}</span>
        </span>
      ) : null}
      <nav className="links" aria-label="Main">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} aria-current={here(href) ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <SiteSearch />
      {acct}
      <button ref={btn} type="button" className="nav-menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <Link className="btn btn-s nav-enq" href="/contact">Enquire</Link>
      <div ref={panel} id="site-menu" className="nav-panel" hidden={!open}>
        <nav aria-label="Menu">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={here(href) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="nav-panel-foot">
          <button type="button" className="nav-panel-srch" onClick={() => { setOpen(false); window.dispatchEvent(new Event(OPEN_SEARCH)); }}>Search the site</button>
          {acct}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      {/* 28 Sep 2026: five short columns instead of one of eleven links and
          three of four; what a reader looks for is grouped by what it is. */}
      <div className="cols">
        <div>
          <span className="eb">Ownership</span>
          <Link href="/how-it-works">How it works</Link><Link href="/how-to-qualify">How to qualify</Link>
          <Link href="/operating-partner">Operating partner</Link><Link href="/answers">Answers</Link><Link href="/glossary">Glossary</Link>
        </div>
        <div>
          <span className="eb">Estates</span>
          <Link href="/collection/slowspace-solace">Solace</Link><Link href="/collection/slowspace-coastal">Seaside Confluence</Link>
          <Link href="/collection/coorg-coffee-creek">SlowSpace Creek</Link><Link href="/collection/coffee-fields-forever">Coffee Fields Forever</Link>
          <Link href="/collection">All seven estates</Link>
        </div>
        <div>
          <span className="eb">Company</span>
          <Link href="/about">About us</Link><Link href="/team">Team</Link><Link href="/how-we-build">How we build</Link>
          <Link href="/journal">Journal</Link><Link href="/press">Press kit</Link><Link href="/careers">Careers</Link>
        </div>
        <div>
          <span className="eb">Contact</span>
          <Link href="/contact">Enquire</Link><Link href="/collection/slowspace-coastal#waitlist">Seaside Confluence waitlist</Link>
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
