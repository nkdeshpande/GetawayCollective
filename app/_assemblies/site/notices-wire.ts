/**
 * THE NOTICES PAGE, IN THE BROWSER — reading, and the choices
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001, step 3. Wires ./notices.tsx.
 *
 * Two things only. Once the page has drawn with something new on it, the
 * browser says the notices were read, and the bar's count is told to look
 * again. And a choice ticked or cleared is saved at once; if it cannot be
 * saved the tick goes back and the page says so beside it (NR-12), because
 * a setting that looks changed and is not is worse than one that refuses.
 */
import { toast } from "./notify";

/** Fired when the count of unread notices may have changed. The bar listens. */
export const NOTICES_CHANGED = "gc-notices";

const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => r.ok, () => false);

export function wireNotices(root: HTMLElement): () => void {
  const panel = root.querySelector<HTMLElement>("[data-ntc]");
  if (!panel) return () => undefined;

  if (Number(panel.dataset.ntc) > 0) {
    void post("/api/notices", { read: true }).then((ok) => { if (ok) window.dispatchEvent(new Event(NOTICES_CHANGED)); });
  }

  const said = panel.querySelector<HTMLElement>("[data-ntc-said]");
  const onChange = (ev: Event) => {
    const box = (ev.target as HTMLElement).closest<HTMLInputElement>("input[data-ntc-pref]");
    if (!box) return;
    const want = box.checked;
    if (said) said.textContent = "";
    box.disabled = true;
    void post("/api/notices/preference", { notice: box.dataset.ntcPref, allowed: want }).then((ok) => {
      box.disabled = false;
      if (ok) { toast(want ? "You will receive this." : "You will no longer receive this."); return; }
      box.checked = !want;
      if (said) said.textContent = "That could not be saved, and nothing has changed. Try again, or write to ir@getawaycollective.co.";
    });
  };
  panel.addEventListener("change", onChange);
  return () => panel.removeEventListener("change", onChange);
}
