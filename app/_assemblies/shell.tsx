/**
 * AS-37 · THE SHELL — top rail and collapsible left rail
 *
 * Wave 9 · Chrome
 *
 * Adapted from gc_enterprise_knowledge_workspace.html. That file had the
 * shape right and already respected two house rules by name — the active
 * state is PAPER not copper, and the avatar is a square — so what
 * follows keeps its geometry and replaces its contents.
 *
 * ── FOUR THINGS THE REFERENCE COULD NOT KNOW ─────────────────────────
 *
 * 1. THE RAIL NEVER SHOWS WHAT THE VIEWER CANNOT REACH.
 *    The reference hard-codes two items. This filters PRIMARY_NAV
 *    through canReach() on every render, so an anonymous visitor sees
 *    the public rail and nothing else. That is not tidiness:
 *    IA_LAWS.notFoundNeverConfirms bars a denial from confirming a
 *    surface exists, and a rail listing "Administration" to a stranger
 *    confirms it just as loudly as a 403 page would. A section whose
 *    every item is unreachable does not render its heading either — an
 *    empty "Governance" group would leak the same fact more quietly.
 *
 * 2. THE BREADCRUMB READS THE ROUTE TABLE, NOT THE URL.
 *    Splitting a pathname gives you "how-it-works"; the route table gives
 *    you "How It Works", which is what the page is
 *    called. It also gives the vantage, which is the more useful fact:
 *    a person should be able to see which aperture they are looking
 *    through without inferring it from the address.
 *
 * 3. IT DOES NOT TRAP THE SCROLL.
 *    The reference sets `html, body { overflow: hidden }` and scrolls an
 *    inner pane. That breaks browser find-on-page position, breaks
 *    restore-on-back, and breaks the legal corpus — /legal/terms is
 *    nine thousand words and belongs in the document scroll, not in a
 *    div. The rail is sticky at viewport height instead; the document
 *    scrolls as a document.
 *
 * 4. IT SURVIVES BOTH GROUNDS.
 *    The reference is void-only. Ground inversion means a page can hand
 *    the shell a paper section at any point, so every rail value is a
 *    token with an .on-paper counterpart.
 *
 * ── WHY THE COLLAPSE IS NOT ANIMATED WIDTH ───────────────────────────
 * Transitioning a grid column re-lays-out the document on every frame
 * and drags the whole page with it. The rail switches width in one
 * step and the LABELS fade — motion where it costs nothing, none where
 * it would cost a reflow per frame.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, NAV_FOOT, type NavIcon } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { signOut } from "next-auth/react";
import { canReach, ANONYMOUS } from "@/lib/access";
import type { Subject } from "@/lib/access";

/**
 * What the rail calls the viewer's vantage.
 *
 * Names the highest class the subject actually satisfies. It never says
 * "office" on the strength of a session alone — that word requires a
 * live grant, which is what `rights` being non-empty means.
 */
function vantageLabel(s: Subject): string {
  if (s.rights.length > 0) return "Office vantage";
  if (s.member) return "Member vantage";
  if (s.accredited) return "Accredited vantage";
  if (s.identified) return "Identified vantage";
  return "Public vantage";
}
import { plate } from "./data";
import { hueOf } from "./compose";

/* ── Icons ───────────────────────────────────────────────────────────
   Square and line geometry only. The Zero Radius Doctrine permits a
   circle for a status LED and the Trinity Lens; a navigation glyph is
   neither, so nothing here is round. */

const ICON: Record<NavIcon, React.ReactNode> = {
  home:          <><rect x="4" y="10" width="16" height="10" /><path d="M2 11 12 3l10 8" /></>,
  collection:    <><rect x="3" y="4" width="18" height="16" /><path d="M3 10h18M9 10v10" /></>,
  doctrine:      <><rect x="4" y="3" width="16" height="18" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  journal:       <><path d="M5 3h14v18l-7-4-7 4z" /><path d="M9 8h6" /></>,
  answers:       <><rect x="3" y="4" width="18" height="14" /><path d="M8 21h8M12 18v3M8 9h8M8 13h4" /></>,
  space:         <><path d="M3 20h18" /><path d="M6 20V9l6-5 6 5v11" /><path d="M10 20v-6h4v6" /></>,
  gallery:       <><rect x="3" y="5" width="18" height="14" /><path d="M3 15l5-4 4 3 3-2 6 4" /></>,
  portfolio:     <><rect x="3" y="7" width="18" height="13" /><path d="M8 7V4h8v3" /><path d="M3 12h18" /></>,
  time:          <><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  entitlement:   <><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18" /><rect x="7" y="13" width="4" height="4" /></>,
  capital:       <><path d="M3 20h18" /><rect x="4" y="12" width="4" height="8" /><rect x="10" y="8" width="4" height="12" /><rect x="16" y="4" width="4" height="16" /></>,
  offering:      <><rect x="3" y="4" width="18" height="16" /><path d="M7 9h10M7 13h10M7 17h6" /></>,
  ledger:        <><rect x="3" y="4" width="18" height="16" /><path d="M9 4v16M3 9h6M3 14h6" /></>,
  member:        <><rect x="4" y="4" width="16" height="16" /><path d="M8 15h8M9 9h6" /></>,
  position:      <><path d="M3 20h18" /><path d="M5 20V6h6v14M13 20v-9h6v9" /></>,
  documents:     <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" /></>,
  resolutions:   <><rect x="3" y="4" width="18" height="16" /><path d="M7 12l3 3 7-7" /></>,
  notifications: <><path d="M5 18V10a7 7 0 0 1 14 0v8z" /><path d="M3 18h18M10 21h4" /></>,
  admin:         <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  vehicles:      <><rect x="3" y="8" width="18" height="12" /><path d="M7 8V4h10v4M3 14h18" /></>,
  governance:    <><path d="M3 20h18M12 3v17" /><path d="M5 9h14M7 9l-3 6h6zM17 9l-3 6h6z" /></>,
  compliance:    <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  authority:     <><rect x="5" y="10" width="14" height="10" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></>,
  media:         <><rect x="3" y="5" width="18" height="14" /><path d="M10 9l5 3-5 3z" /></>,
};

function Glyph({ icon }: { icon: NavIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICON[icon]}
    </svg>
  );
}

/* ── Route lookup ────────────────────────────────────────────────── */

const routeByPath = (p: string) => ROUTES.find((r) => r.path === p);

/**
 * Resolve a live pathname to its declared route, matching a dynamic
 * segment where the literal is absent — /collection/kyoto-house has no
 * literal entry, /collection/[property] does.
 */
function resolve(pathname: string) {
  const exact = routeByPath(pathname);
  if (exact) return exact;
  const parts = pathname.split("/").filter(Boolean);
  return ROUTES.find((r) => {
    const rp = r.path.split("/").filter(Boolean);
    if (rp.length !== parts.length) return false;
    return rp.every((seg, i) => (seg.startsWith("[") ? true : seg === parts[i]));
  });
}

const STORE = "gc-rail-collapsed";

export function Shell({
  children,
  subject = ANONYMOUS,
}: {
  children: React.ReactNode;
  /**
   * Resolved by the root layout, which is a Server Component and can
   * therefore await the session. This is a Client Component and cannot,
   * so the subject arrives as a prop.
   *
   * It DEFAULTS to anonymous rather than to a permissive value. If a
   * future caller forgets to pass it, the rail shows only public
   * surfaces — the failure is a rail that is too small, never one that
   * advertises a surface the viewer cannot open.
   */
  subject?: Subject;
}) {
  const pathname = usePathname() || "/";
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  /* The header is transparent over a hero and opaque once the hero has
     scrolled past. A sentinel is used rather than a scroll listener:
     one observer callback per crossing instead of one per frame. */
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(STORE) === "1"); } catch { /* storage denied */ }
    setReady(true);
  }, []);

  /*
   * A PASSIVE SCROLL LISTENER, NOT AN INTERSECTION OBSERVER.
   *
   * An IntersectionObserver on a top sentinel was the first choice —
   * one callback per crossing rather than one per scroll. Two things
   * decided against it. Its rootMargin was subtly wrong: the sentinel
   * sits at y=0 and a -56px top margin puts it permanently OUTSIDE the
   * observed box, so the header would have been solid from the first
   * paint and never transparent at all. And it needed a sentinel
   * element in the DOM to observe, which this does not.
   *
   * NEITHER MECHANISM COULD BE VERIFIED IN THE TEST BROWSER: scroll
   * events, rAF and IntersectionObserver callbacks all fail to fire in
   * that evaluation context, though scrollY changes correctly. That is
   * a property of the harness, not of either approach — recorded here
   * so the next person does not re-derive it, and so it is plain that
   * this specific behaviour was reasoned about rather than watched.
   *
   * This reads scrollY, which does not force layout, coalesces through
   * one rAF, and sets state only when the boolean actually flips — so
   * the render count is the number of crossings either way.
   */
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setSolid((was) => {
        const now = window.scrollY > 8;
        return now === was ? was : now;
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORE, next ? "1" : "0"); } catch { /* nothing to persist into */ }
  };

  const here = resolve(pathname);

  /* Filtered on every render, never cached: reachability is a property
     of the viewer, and a cached rail would outlive a revocation. */
  const sections = PRIMARY_NAV
    .map((s) => ({ ...s, items: s.items.filter((i) => canReach(i.path, subject).ok) }))
    .filter((s) => s.items.length > 0);
  const foot = NAV_FOOT.filter((i) => canReach(i.path, subject).ok);

  const isCurrent = (p: string) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");

  const item = (i: { path: string; label: string; icon: NavIcon }) => (
    <Link
      key={i.path}
      href={i.path}
      className="rail-item"
      aria-current={isCurrent(i.path) ? "page" : undefined}
      /* The label is the accessible name whether or not it is visible,
         so a collapsed rail is not a row of unnamed glyphs. */
      title={collapsed ? i.label : undefined}
      aria-label={collapsed ? i.label : undefined}
    >
      <Glyph icon={i.icon} />
      <span className="lbl">{i.label}</span>
    </Link>
  );

  return (
    <div className={"shell" + (collapsed ? " is-collapsed" : "")}>
      <a className="skip" href="#main">Skip to content</a>

      <header className="rail-top" data-solid={solid ? "1" : "0"}>
        <Link href="/" className="brand" aria-label="Getaway Collective, home">
          GC<span className="dot">.</span>
        </Link>

        {/* Names the page and the aperture it is seen through. Both come
            from the route table; neither is parsed out of the URL. */}
        <nav className="crumbs" aria-label="Breadcrumb">
          {/* The route GROUP is an internal partition, not a place the
              reader has been. Shown to the office, hidden from everyone
              else — the page's own name is the whole breadcrumb. */}
          {subject.rights.length > 0 ? (
            <>
              <span className="v">{here ? here.group : "—"}</span>
              <span className="sep" aria-hidden="true">/</span>
            </>
          ) : null}
          <span className="now">{here ? here.name : "Not a declared surface"}</span>
        </nav>

        <span className="rail-spacer" />

        {/*
          PUBLIC.01. This said "gateway vantage" to every visitor on every
          page — our filing word for an aperture, given the same weight as
          the page's own name. It is genuinely useful to somebody holding
          office rights, who needs to know which aperture they are looking
          through, and meaningless to everybody else.

          So it survives where it earns its place and goes where it does not.
        */}
        {subject.rights.length > 0 ? (
          <span className="vantage t-mono-s" title="The aperture this surface is seen through">
            {here ? here.group : "—"} vantage
          </span>
        ) : null}
      </header>

      <nav className="rail-left" data-solid={solid ? "1" : "0"} aria-label="Main">
        <div className="rail-scroll" id="rail-nav">
          {sections.map((s) => (
            <div className="rail-group" key={s.id}>
              {s.title ? <span className="rail-head t-micro">{s.title}</span> : null}
              {s.items.map(item)}
            </div>
          ))}
        </div>

        <div className="rail-foot">
          {/* A CHEVRON, NOT A BUTTON WITH A BOX.
              It sits above the foot links because that is the quiet end
              of the rail — a control that changes the furniture belongs
              beside the other furniture, not at the head where it reads
              as the first destination. It points where the rail will GO,
              never where it is. */}
          <button
            className="rail-collapse"
            type="button"
            onClick={toggle}
            aria-expanded={ready ? !collapsed : undefined}
            aria-controls="rail-nav"
            aria-label={collapsed ? "Expand the navigation" : "Collapse the navigation"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {collapsed ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
            </svg>
          </button>
          {foot.map(item)}
          {/* The block states the real vantage. A shell that shows a
              signed-in person when nobody is signed in is the first lie a
              product tells — and the inverse, hiding a live session,
              hides the one control that ends it. */}
          <div className="rail-who">
            <span className="sq" aria-hidden="true">{subject.identified ? "•" : "—"}</span>
            <span className="who-meta">
              <span className="nm">{subject.identified ? "Signed in" : "Not signed in"}</span>
              <span className="rl t-mono-s">{vantageLabel(subject)}</span>
            </span>
          </div>
          {/* A button, not a link. Sign-out is a state change, and a GET
              that ends a session can be fired by any image tag on any
              page — signOut() posts with the CSRF token. */}
          {subject.identified
            ? <button className="rail-signout t-mono-s" type="button" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
            : <Link className="rail-signout t-mono-s" href="/sign-in">Sign in</Link>}
        </div>
      </nav>

      {/* The hue travels as a custom property so CSS can bed a page
          that supplies its own opening section — no component needs
          to know it, and no page needs editing to receive one. */}
      <main
        className="rail-main"
        id="main"
        style={{ "--page-hue": hueOf(pathname) } as React.CSSProperties}
      >
        {/*
          EVERY PAGE HAS A HERO, STRUCTURALLY.
          Twenty-five components would otherwise each need one added,
          and the twenty-sixth would be written without. So the shell
          supplies one from the route table for every surface, and a
          page that has its own suppresses this by rendering .p-hero-own
          or the .hero atom — one CSS rule, no per-page flag to forget.
          A route with no declared name gets no invented one; it gets
          the honest statement that it is not a declared surface.
        */}
        <header className="p-hero p-hero-shell">
          <span className="bed" style={plate(hueOf(pathname))} aria-hidden="true" />
          <span className="sc" aria-hidden="true" />
          <div className="wrap in">
            <span className="t-micro eyebrow">
              {/* Was "{group} vantage" over the title of every page. An
                  eyebrow carries the brand; it does not carry our filing
                  partition. */}
              {here ? "Getaway Collective" : "Not a declared surface"}
            </span>
            <h1 className="t-display-l">{here ? here.name : "Not a declared surface"}</h1>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
