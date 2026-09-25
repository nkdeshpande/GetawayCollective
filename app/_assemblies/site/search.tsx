/**
 * SEARCH THE SITE — one box, from the bar or ⌘K / Ctrl K
 *
 * 25 Sep 2026 (Next Actions d06). Searches what a stranger can already read
 * — estates, the pipeline, the text pages, the Journal, the legal documents,
 * the answers and the glossary — from /api/site-index, fetched the first
 * time the box opens. A question the site does not answer is sent to
 * Investor Relations rather than to an empty list.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface SiteIndex {
  readonly v: number;
  /** [kind, title, summary, href] */
  readonly items: readonly (readonly [string, string, string, string])[];
  /** [term, definition] */
  readonly glossary: readonly (readonly [string, string])[];
}

let cache: Promise<SiteIndex | null> | null = null;
/** Fetched once per visit, shared by search and the glossary popovers. */
export function loadIndex(): Promise<SiteIndex | null> {
  if (!cache) cache = fetch("/api/site-index").then((r) => (r.ok ? r.json() : null)).catch(() => { cache = null; return null; });
  return cache;
}

const SUGGEST = ["/collection", "/how-it-works", "/how-to-qualify", "/answers", "/journal"];

function rank(idx: SiteIndex, q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return SUGGEST.map((h) => idx.items.find((i) => i[3] === h && i[0] === "Page")).filter((i): i is SiteIndex["items"][number] => !!i);
  return idx.items
    .map((i) => {
      const t = i[1].toLowerCase(), hay = `${t} ${i[2].toLowerCase()} ${i[0].toLowerCase()}`;
      if (!words.every((w) => hay.includes(w))) return null;
      let s = 0;
      if (t.startsWith(words[0])) s += 60;
      for (const w of words) s += t.includes(w) ? 25 : 4;
      if (i[0] === "Estate" || i[0] === "Pipeline") s += 6;
      return [s, i] as const;
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 12)
    .map((x) => x[1]);
}

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState<SiteIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [sel, setSel] = useState(0);
  const [mac, setMac] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); opener.current = document.activeElement as HTMLElement; setOpen((o) => !o); }
      else if (e.key === "/" && !typing(e.target)) { e.preventDefault(); opener.current = document.activeElement as HTMLElement; setOpen(true); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) { opener.current?.focus?.(); return; }
    setQ(""); setSel(0);
    loadIndex().then((i) => { setIdx(i); setFailed(!i); });
    const t = requestAnimationFrame(() => input.current?.focus());
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { cancelAnimationFrame(t); html.style.overflow = prev; };
  }, [open]);

  const results = useMemo(() => (idx ? rank(idx, q) : []), [idx, q]);
  useEffect(() => { setSel(0); }, [q]);

  const go = (href: string) => { setOpen(false); router.push(href); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel][3]); }
  };

  return (
    <>
      <button type="button" className="nav-srch" onClick={(e) => { opener.current = e.currentTarget; setOpen(true); }} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM15.5 15.5 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        <span className="nav-srch-l">Search</span>
        <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      {open ? (
        <div className="srch" role="dialog" aria-modal="true" aria-label="Search the site" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="srch-panel">
            <div className="srch-box">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM15.5 15.5 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
              <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Estates, answers, terms, the Journal" aria-label="Search the site" role="combobox"
                aria-expanded={results.length > 0} aria-controls="srch-list" aria-autocomplete="list"
                aria-activedescendant={results[sel] ? `srch-${sel}` : undefined} autoComplete="off" spellCheck={false} />
              <button type="button" className="srch-esc" onClick={() => setOpen(false)} aria-label="Close search">Esc</button>
            </div>
            {!idx && !failed ? <p className="srch-note">Loading…</p> : null}
            {failed ? <p className="srch-note">Search could not load. The <Link href="/collection">collection</Link> and the <Link href="/answers">answers</Link> are a click away.</p> : null}
            {idx ? (
              results.length ? (
                <>
                  {!q.trim() ? <p className="srch-note">Start here, or type a word.</p> : null}
                  <ul id="srch-list" role="listbox" className="srch-list">
                    {results.map((r, i) => (
                      <li key={r[3] + r[1]} id={`srch-${i}`} role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)}>
                        <a href={r[3]} onClick={(e) => { e.preventDefault(); go(r[3]); }}>
                          <span className="srch-k">{r[0]}</span><b>{r[1]}</b><em>{r[2]}</em>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="srch-none">Nothing on the site answers “{q.trim()}”. <Link href="/contact">Ask Investor Relations</Link>; they reply on working days, in writing.</p>
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
