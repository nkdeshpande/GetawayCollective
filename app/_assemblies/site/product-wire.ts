/**
 * ONE STEP OF A VISIT — the browser's half of the Office's path view
 *
 * 15 Oct 2026 (lib/posthog.ts). The page names a few steps (an action
 * pressed, an enquiry sent, a deposit opened or paid, the hero film playing)
 * and posts them to this site, which forwards them to PostHog when that is
 * switched on. No PostHog script, no cookie. The one identifier is a random
 * id for this tab, kept in sessionStorage and gone when the tab closes; it
 * is never joined to a name or an address, and none is ever sent.
 *
 * A browser that asks not to be tracked sends nothing at all.
 */
const TAB = "gc-tab";

const quiet = () => {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || !!nav.globalPrivacyControl;
};

/** This tab's random id, made once. Null where storage is refused. */
export function tab(): string | null {
  try {
    let t = sessionStorage.getItem(TAB);
    if (!t) { t = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(36).padStart(2, "0")).join(""); sessionStorage.setItem(TAB, t); }
    return t;
  } catch { return null; }
}

export function track(e: string, p: Record<string, string | number | boolean | undefined> = {}): void {
  try {
    if (quiet()) return;
    const t = tab();
    if (!t) return;
    void fetch("/api/ev", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ e, p, t, path: location.pathname }), keepalive: true }).catch(() => undefined);
  } catch { /* a step not counted is never an error the reader sees */ }
}

/** The actions worth counting: the lead buttons and the links into an offering. */
const CTA = 'a.btn.lead, a.hero-link, a[href^="/reserve/"], a[href$="/investment"], a[href$="/enquire"], a[href="/signal"]';

export function wireProduct(root: HTMLElement): () => void {
  const onClick = (ev: MouseEvent) => {
    const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>(CTA);
    if (a && root.contains(a)) track("cta", { label: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60), href: a.getAttribute("href") || "" });
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
