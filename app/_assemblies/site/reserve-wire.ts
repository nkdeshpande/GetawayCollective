/**
 * THE RESERVE PAGE, WIRED — V2.0, 6 Oct 2026
 *
 * ./reserve.tsx renders the slots, the allocation and the deposit form
 * complete on the server, for one unit. This makes the unit count a control:
 * the stepper and the form's own select move together, and the tiles and the
 * slot bar follow from the rows the server already computed. No figure is
 * calculated in the browser.
 *
 * It also shows where a hold stands: straight after a payment, and
 * whenever the page is opened with `#r=<reference>` (the link in the
 * receipt). The status is read from /api/deposit/status and written with
 * textContent only.
 */

interface Row { u: number; capital: string; share: string; nights: string; balance: string }
interface Data { slug?: string; estate?: string; payee?: string; deposit?: string; taken?: number; held?: number; rows?: Row[] }
interface Status { ok: boolean; reference?: string; status?: "opened" | "paid"; units?: number; estate?: string | null; payee?: string | null; email?: string; paidAt?: string | null }

const REF = /^[0-9a-f-]{36}$/i;
const el = (tag: string, cls: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const day = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export function wireReserve(root: HTMLElement): () => void {
  const box = root.querySelector<HTMLElement>(".rsv[data-rsv]");
  if (!box) return () => {};
  let data: Data = {};
  try { data = JSON.parse(box.dataset.rsv || "{}") as Data; } catch { /* the page still reads without it */ }
  const rows = data.rows ?? [];
  const off: (() => void)[] = [];
  const on = (t: EventTarget, ev: string, fn: EventListener) => { t.addEventListener(ev, fn); off.push(() => t.removeEventListener(ev, fn)); };
  const set = (k: string, v: string) => box.querySelectorAll<HTMLElement>(`[data-rsv-f="${k}"]`).forEach((n) => { n.textContent = v; });
  const select = root.querySelector<HTMLSelectElement>('form[data-to="deposit"] select[name="units"]');
  const cells = Array.from(box.querySelectorAll<HTMLElement>(".rsv-bar i"));
  const start = (data.taken ?? 0) + (data.held ?? 0);

  const show = (u: number) => {
    const r = rows.find((x) => x.u === u);
    if (!r) return;
    set("u", String(r.u)); set("uw", r.u === 1 ? "unit" : "units");
    set("capital", r.capital); set("share", r.share); set("nights", r.nights); set("balance", r.balance);
    cells.forEach((c, i) => { if (i >= start) c.className = i < start + r.u ? "you" : "free"; });
    if (select && select.value !== String(r.u)) select.value = String(r.u);
    box.querySelectorAll<HTMLButtonElement>("[data-rsv-d]").forEach((b) => {
      const next = r.u + Number(b.dataset.rsvD);
      b.disabled = !rows.some((x) => x.u === next);
    });
  };
  const current = () => Number(box.querySelector<HTMLElement>('[data-rsv-f="u"]')?.textContent || 1);
  if (rows.length) {
    box.querySelectorAll<HTMLButtonElement>("[data-rsv-d]").forEach((b) => on(b, "click", () => show(current() + Number(b.dataset.rsvD))));
    if (select) on(select, "change", () => show(Number(select.value)));
    show(select ? Number(select.value) || 1 : 1);
  }

  /* ── where a hold stands ── */
  const panel = box.querySelector<HTMLElement>("[data-rsv-status]");
  const paint = (s: Status | null, reference: string, fresh: boolean) => {
    if (!panel) return;
    panel.replaceChildren();
    const paid = !!s?.ok && s.status === "paid";
    panel.dataset.state = paid ? "paid" : s?.ok ? "opened" : "unknown";
    panel.append(el("span", "eb", paid ? "Reserved" : s?.ok ? "Payment not yet seen" : "Your hold"));
    panel.append(el("b", "rsv-st-h", paid ? "Your slot is reserved." : s?.ok ? "This order was opened, and no payment has reached it yet." : "This reference could not be read just now."));
    const dl = el("dl", "rsv-st-rows");
    const row = (k: string, v: string) => { if (!v) return; dl.append(el("dt", "", k), el("dd", "", v)); };
    if (s?.ok) {
      row("Units", s.units ? `${s.units} unit${s.units === 1 ? "" : "s"}` : "");
      row("Paid to", s.payee ?? "");
      row("On", day(s.paidAt));
      row("Receipt sent to", s.email ?? "");
    }
    row("Reference", reference);
    panel.append(dl);
    panel.append(el("p", "rsv-st-p", paid
      ? "Investor Relations will write to you about identity checks, the balance and the Vehicle Agreement. The deposit is refundable in full until that agreement is signed. Keep this page's link: it always shows where your hold stands."
      : s?.ok
        ? "If you have paid, it can take a minute to arrive: reload this page. If nothing was taken, you can reserve again below."
        : "Keep the reference and write to ir@getawaycollective.co; Investor Relations can find it from that."));
    panel.hidden = false;
    if (fresh) { panel.scrollIntoView({ block: "center", behavior: "smooth" }); panel.focus({ preventScroll: true }); }
  };
  const load = async (reference: string, fresh: boolean) => {
    if (!REF.test(reference)) return;
    try {
      const r = await fetch(`/api/deposit/status?reference=${encodeURIComponent(reference)}`, { cache: "no-store" });
      paint((await r.json().catch(() => null)) as Status | null, reference, fresh);
    } catch { paint(null, reference, fresh); }
  };
  const fromHash = () => { const m = location.hash.match(/^#r=([0-9a-f-]{36})$/i); if (m) void load(m[1], false); };
  on(window, "hashchange", fromHash);
  on(document, "gc:reserved", ((ev: Event) => {
    const reference = String((ev as CustomEvent<{ reference?: string }>).detail?.reference ?? "");
    if (!REF.test(reference)) return;
    history.replaceState(null, "", `#r=${reference}`);
    void load(reference, true);
  }) as EventListener);
  fromHash();
  return () => off.forEach((f) => f());
}
