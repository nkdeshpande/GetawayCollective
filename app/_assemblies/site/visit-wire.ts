/**
 * ONE PAGE WAS READ — the browser's half of the visit count
 *
 * V2.0, 9 Oct 2026 (lib/visits.ts). Sent once for each page, after it has
 * drawn, and never waited on. It carries the path, and for the first page
 * of this tab's visit where the reader came from. "First page" is kept in
 * sessionStorage: one flag, in this tab only, gone when the tab closes. It
 * is not a cookie, holds no identifier and is never sent anywhere.
 *
 * A browser that asks not to be tracked sends nothing at all.
 */
const SEEN = "gc-visit";

export function wireVisit(): () => void {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return () => undefined;
    let landing = false;
    try { landing = !sessionStorage.getItem(SEEN); sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: every page counts as internal */ }
    const u = landing ? new URLSearchParams(location.search).get("utm_source") : null;
    const body = JSON.stringify({ p: location.pathname, l: landing, r: landing ? document.referrer : "", u: u ?? undefined });
    const send = () => { void fetch("/api/visit", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => undefined); };
    const t = window.setTimeout(send, 1200);   // a page left at once was not read
    return () => window.clearTimeout(t);
  } catch { return () => undefined; }
}
