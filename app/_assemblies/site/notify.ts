/**
 * TOASTS AND BANNERS — the two quiet ways the site speaks
 *
 * V2.0, 6 Oct 2026 · GC-08-DS-001 (the alerts and notices specification).
 *
 * A TOAST confirms something the reader just did that needs no decision:
 * saved, removed, copied (S-03). It is never an error: an error stays beside
 * its cause until it is read (NR-12), and a toast leaves by itself.
 *
 *   - 5 seconds, 8 where it offers Undo; the clock stops under the pointer
 *     or the keyboard, so nobody loses an Undo by reading slowly
 *   - three at most, newest last; a fourth retires the oldest (NR-11)
 *   - announced politely (role="status"); Escape retires the newest
 *   - a short rise, and none where the reader asked for reduced motion
 *
 * A BANNER states a condition that is true of the whole page until it ends:
 * the connection has dropped (S-09), or the site has something standing to
 * say (S-10, content/site/notice.ts). One at a time; the more urgent wins.
 * It cannot be dismissed, because closing it would not make it untrue; it
 * goes when the condition does.
 *
 * Everything is written with textContent. Nothing here renders markup from
 * a string, and nothing decides content: callers pass the words.
 */
import { SITE_NOTICE, noticeStands } from "@/content/site/notice";

export interface ToastOptions {
  /** Offered where the act can be undone. The toast then stays 8 seconds. */
  readonly undo?: () => void;
}

const MAX = 3;
const host = (): HTMLElement | null => {
  const site = document.querySelector<HTMLElement>(".site");
  if (!site) return null;
  let h = site.querySelector<HTMLElement>(":scope > .toasts");
  if (!h) {
    h = document.createElement("div");
    h.className = "toasts";
    h.setAttribute("role", "status");
    h.setAttribute("aria-live", "polite");
    site.append(h);
  }
  return h;
};

/** Say one line, quietly, and take it away again. */
export function toast(text: string, opts: ToastOptions = {}): void {
  const h = host();
  if (!h) return;
  while (h.children.length >= MAX) h.firstElementChild?.remove();
  const t = document.createElement("div");
  t.className = "toast";
  const words = document.createElement("span");
  words.textContent = text;
  t.append(words);
  let timer = 0;
  const retire = () => { window.clearTimeout(timer); t.remove(); };
  const run = () => { window.clearTimeout(timer); timer = window.setTimeout(retire, opts.undo ? 8000 : 5000); };
  if (opts.undo) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Undo";
    b.addEventListener("click", () => { opts.undo?.(); retire(); });
    t.append(b);
  }
  /* The clock stops while the toast is being read or reached. */
  t.addEventListener("pointerenter", () => window.clearTimeout(timer));
  t.addEventListener("pointerleave", run);
  t.addEventListener("focusin", () => window.clearTimeout(timer));
  t.addEventListener("focusout", run);
  h.append(t);
  run();
}

type Tone = "hazard" | "critical";
interface Standing { readonly key: string; readonly tone: Tone; readonly text: string; readonly action?: readonly [string, string] }

/** The banner, and the conditions that can raise it. Returns its own undoing. */
export function wireNotify(root: HTMLElement): () => void {
  const standing = new Map<string, Standing>();
  let bar: HTMLElement | null = null;
  const paint = () => {
    /* One banner: critical before hazard, and the newest of equals. */
    const all = [...standing.values()];
    const s = all.find((x) => x.tone === "critical") ?? all[all.length - 1];
    if (!s) { bar?.remove(); bar = null; return; }
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "banner";
      root.append(bar);
    }
    bar.dataset.tone = s.tone;
    bar.setAttribute("role", s.tone === "critical" ? "alert" : "status");
    bar.replaceChildren();
    const words = document.createElement("span");
    words.textContent = s.text;
    bar.append(words);
    if (s.action) {
      const a = document.createElement("a");
      a.href = s.action[1];
      a.textContent = s.action[0];
      bar.append(a);
    }
  };
  const raise = (s: Standing) => { standing.set(s.key, s); paint(); };
  const lower = (key: string) => { if (standing.delete(key)) paint(); };

  /* S-10: what the site itself has standing to say, while it stands. */
  if (SITE_NOTICE && noticeStands(SITE_NOTICE, new Date())) {
    raise({ key: "site", tone: SITE_NOTICE.tone, text: SITE_NOTICE.text, action: SITE_NOTICE.action });
  }

  /* S-09: the connection. Said when it drops, withdrawn when it returns. */
  const offline = () => raise({ key: "offline", tone: "hazard", text: "You are offline. What you have typed is kept on this page; send it when the connection returns." });
  const online = () => { if (standing.has("offline")) { lower("offline"); toast("You are back online."); } };
  if (navigator.onLine === false) offline();
  window.addEventListener("offline", offline);
  window.addEventListener("online", online);

  /* Escape retires the newest toast, unless a field or a dialog wants the key. */
  const key = (ev: KeyboardEvent) => {
    if (ev.key !== "Escape" || ev.defaultPrevented) return;
    root.querySelector(":scope > .toasts > .toast:last-child")?.remove();
  };
  document.addEventListener("keydown", key);

  return () => {
    window.removeEventListener("offline", offline);
    window.removeEventListener("online", online);
    document.removeEventListener("keydown", key);
    bar?.remove();
    root.querySelector(":scope > .toasts")?.remove();
  };
}
