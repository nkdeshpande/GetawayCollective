/**
 * THE SITE, BROUGHT TO LIFE — every interaction the prototype had, once
 *
 * L1-01 §29-0b · 24 Sep 2026. The pages render complete markup on the
 * server; this runs after each navigation and wires what the markup
 * declares: films, the manifesto fill, filters, the concept drawing, the
 * plan viewer, the section pager, copy buttons, the Journal chips, and the
 * forms — which post to the platform's real endpoints, /api/signal and
 * /api/dossier, and say plainly when a send did not go through.
 *
 * Nothing here decides content. A page without a given element simply has
 * nothing for that handler to find.
 */

"use client";

import { useEffect } from "react";
import { wireCalc } from "./calc";
import { usePathname, useRouter } from "next/navigation";
import { Film } from "./film";
import { wireDA } from "../da/wire";
import { loadIndex } from "./search";

const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s)) as T[];
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);

/* ── THE HOLDING DEPOSIT ─────────────────────────────────────────────
   The server names the amount and opens the order; Razorpay's own checkout
   takes the card, UPI or netbanking details, which never touch this site;
   the server then checks Razorpay's signature before recording anything.
   Every outcome is said in words, including "nothing was taken". */
type Rzp = new (o: Record<string, unknown>) => { open: () => void; on: (e: string, f: (r: unknown) => void) => void };
function loadCheckout(): Promise<Rzp | null> {
  const w = window as unknown as { Razorpay?: Rzp };
  if (w.Razorpay) return Promise.resolve(w.Razorpay);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve((window as unknown as { Razorpay?: Rzp }).Razorpay ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}
async function payDeposit(f: HTMLFormElement) {
  const ok = f.querySelector<HTMLElement>(".tx-ok"), err = f.querySelector<HTMLElement>(".tx-err");
  const btn = f.querySelector<HTMLButtonElement>("button[type=submit]");
  const say = (el: HTMLElement | null, text: string) => { if (ok) ok.hidden = true; if (err) err.hidden = true; if (el) { el.textContent = text; el.hidden = false; } };
  const val = (n: string) => (f.querySelector<HTMLInputElement>(`[name="${n}"]`)?.value || "").trim();
  const ack = f.querySelector<HTMLInputElement>('[name="acknowledged"]');
  if (!val("name") || !/.+@.+\..+/.test(val("email")) || val("phone").length < 8) { say(err, "Add your name, email and mobile number."); return; }
  if (!ack?.checked) { say(err, "Confirm you have read the Risk Factors and the Terms."); ack?.focus(); return; }
  const vehicle = f.dataset.vehicle || "";
  const body = { vehicle, units: Number(val("units") || 1), name: val("name"), email: val("email"), phone: val("phone"), city: val("city") || undefined, acknowledged: true };
  if (btn) btn.disabled = true;
  try {
    const r = await fetch("/api/deposit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (r.status === 503 && j.error === "not-configured") {
      say(ok, `Online payment is not open yet, so nothing was taken. Your request is recorded (reference ${String(j.reference).slice(0, 8)}) and Investor Relations will send payment details.`);
      return;
    }
    if (!r.ok || !j.ok) { say(err, j.detail ? `This offering cannot take a deposit right now: ${j.detail}` : "That did not go through, and nothing was taken. Write to ir@getawaycollective.co."); return; }
    const Razorpay = await loadCheckout();
    if (!Razorpay) { say(err, "The payment window could not load, and nothing was taken. Try again, or write to ir@getawaycollective.co."); return; }
    const rz = new Razorpay({
      key: j.keyId, amount: j.order.amount, currency: j.order.currency, order_id: j.order.id,
      name: j.payee, description: j.description, prefill: j.prefill, theme: { color: f.dataset.themeHex },
      handler: async (res: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const v = await fetch("/api/deposit/verify", { method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: res.razorpay_order_id, paymentId: res.razorpay_payment_id, signature: res.razorpay_signature, email: body.email, vehicle, reference: j.reference }) });
        if (v.ok) say(ok, `Deposit received. Your position is held; reference ${String(j.reference).slice(0, 8)}. Investor Relations will write within one working day about identity checks, the balance and the Vehicle Agreement.`);
        else say(err, `Razorpay took the payment (${res.razorpay_payment_id}) but this site could not confirm it. Keep that id; Investor Relations will reconcile it.`);
        f.reset();
      },
      modal: { ondismiss: () => say(err, "Payment window closed. Nothing was taken.") },
    });
    rz.on("payment.failed", () => say(err, "The payment did not go through, and nothing was taken."));
    rz.open();
  } catch { say(err, "That did not go through, and nothing was taken. Write to ir@getawaycollective.co."); }
  finally { if (btn) btn.disabled = false; }
}

/* ── THE GLOSSARY, IN CONTEXT ────────────────────────────────────────
   Walks the prose of the page (never headings, links, buttons or figures)
   and marks the first use of each defined term. A tap opens one small
   card with the definition and a way to the whole glossary. */
const PROSE = ".tx-body .tx-p, .tx-body .tx-lede, .tx-body .tx-list li, .tx-body .tx-steps p, .intro-p, .chamber > .para, .chap .side .para, .concept-lead, .fin-lead";
const SKIP = "a, button, b, strong, code, h1, h2, h3, h4, .mono, .gl-t";
function glossary(root: HTMLElement, terms: readonly (readonly [string, string])[]): () => void {
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const list = [...terms].sort((a, b) => b[0].length - a[0].length);
  const used = new Set<number>();
  const marks: HTMLButtonElement[] = [];
  for (const el of $$(PROSE, root)) {
    if (used.size === list.length || marks.length >= 8) break;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => ((n.parentElement?.closest(SKIP) && n.parentElement.closest(SKIP) !== el) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
    for (let node of nodes) {
      for (;;) {
        let best: { i: number; at: number; len: number } | null = null;
        list.forEach(([t], i) => {
          if (used.has(i)) return;
          const m = new RegExp(`\\b${esc(t)}s?\\b`, "i").exec(node.data);
          if (m && (!best || m.index < best.at)) best = { i, at: m.index, len: m[0].length };
        });
        if (!best || marks.length >= 8) break;
        const b = best as { i: number; at: number; len: number };
        used.add(b.i);
        const rest = node.splitText(b.at);
        const after = rest.splitText(b.len);
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "gl-t"; btn.dataset.g = String(b.i);
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = rest.data;
        rest.replaceWith(btn);
        marks.push(btn);
        node = after;
      }
    }
  }
  if (!marks.length) return () => {};
  return popover(root, ".gl-t", (btn) => {
    const [t, d] = list[Number(btn.dataset.g)];
    return [`${t}: definition`, el("b", t), el("p", d), link("/glossary", "Every term, defined once")];
  });
}

const el = (tag: string, text: string) => { const e = document.createElement(tag); e.textContent = text; return e; };
const link = (href: string, text: string) => { const a = document.createElement("a"); a.href = href; a.textContent = text; return a; };

/* ── ONE SMALL CARD, OPENED FROM THE WORD OR FIGURE IT EXPLAINS ─────
   Shared by the glossary and the figure sources. One card per kind, placed
   under its trigger, closed by a second tap, a tap elsewhere or Escape,
   which returns focus to the trigger. */
function popover(root: HTMLElement, trigger: string, content: (t: HTMLElement) => [string, ...HTMLElement[]]): () => void {
  const pop = document.createElement("div");
  pop.className = "gl-pop"; pop.hidden = true; pop.setAttribute("role", "dialog");
  root.appendChild(pop);
  let openBtn: HTMLElement | null = null;
  const close = () => { pop.hidden = true; openBtn?.setAttribute("aria-expanded", "false"); openBtn = null; };
  const show = (btn: HTMLElement) => {
    const [label, ...nodes] = content(btn);
    pop.replaceChildren(...nodes);
    pop.setAttribute("aria-label", label);
    pop.hidden = false;
    const r = btn.getBoundingClientRect(), w = Math.min(320, innerWidth - 32);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(16, Math.min(r.left + scrollX, scrollX + innerWidth - w - 16))}px`;
    pop.style.top = `${r.bottom + scrollY + 8}px`;
    openBtn?.setAttribute("aria-expanded", "false");
    openBtn = btn; btn.setAttribute("aria-expanded", "true");
  };
  const toggle = (btn: HTMLElement) => { if (openBtn === btn) close(); else show(btn); };
  const onClick = (ev: Event) => {
    const btn = (ev.target as HTMLElement).closest<HTMLElement>(trigger);
    if (btn && root.contains(btn)) { ev.preventDefault(); toggle(btn); return; }
    if (!pop.contains(ev.target as Node)) close();
  };
  const onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && openBtn) { const b = openBtn; close(); b.focus(); return; }
    const t = ev.target as HTMLElement;
    /* A figure is a span made focusable, so Enter and Space are wired here; a glossary term is a real button. */
    if ((ev.key === "Enter" || ev.key === " ") && t.matches?.(trigger) && t.tagName !== "BUTTON") { ev.preventDefault(); toggle(t); }
  };
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); pop.remove(); };
}

/* ── WHERE A FIGURE COMES FROM (d05) ─────────────────────────────────
   Every register figure the server tagged with data-src opens its source
   and its confidence class. The tags are written in registry.ts. */
function figures(root: HTMLElement): () => void {
  const figs = $$("[data-src]", root);
  if (!figs.length) return () => {};
  figs.forEach((f) => {
    f.classList.add("fig-s"); f.tabIndex = 0; f.setAttribute("role", "button");
    f.setAttribute("aria-haspopup", "dialog"); f.setAttribute("aria-expanded", "false");
  });
  return popover(root, "[data-src]", (f) => [
    "Where this figure comes from",
    el("span", "Source"), el("p", f.dataset.src || ""),
    el("span", `Confidence · ${f.dataset.cls || ""}`), el("p", f.dataset.clm || ""),
    link("/glossary", "What the confidence classes mean"),
  ]);
}

/* ── THE SHORTLIST (d09) ──────────────────────────────────────────────
   Estates a reader saves, kept in this browser and nowhere else. It is
   shown on the collection, and offered — ticked, removable — on an
   enquiry, so Investor Relations knows what someone is weighing only if
   they choose to say. */
type Saved = { slug: string; name: string };
const SHORT = "gc-shortlist";
function readShort(): Saved[] {
  try {
    const x = JSON.parse(localStorage.getItem(SHORT) || "[]");
    return Array.isArray(x) ? x.filter((i) => i && typeof i.slug === "string" && typeof i.name === "string").slice(0, 12) : [];
  } catch { return []; }
}
function writeShort(l: Saved[]) {
  try { localStorage.setItem(SHORT, JSON.stringify(l)); } catch { /* private mode: the shortlist lasts the page */ }
  window.dispatchEvent(new Event(SHORT));
}
function shortlist(root: HTMLElement): () => void {
  const paint = () => {
    const l = readShort(), has = (s: string) => l.some((i) => i.slug === s);
    $$<HTMLButtonElement>("[data-save]", root).forEach((b) => {
      const on = has(b.dataset.save || "");
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "Saved" : "Save";
      b.setAttribute("aria-label", on ? `Remove ${b.dataset.name} from your shortlist` : `Save ${b.dataset.name} to your shortlist`);
    });
    $$<HTMLAnchorElement>(".cc", root).forEach((c) => c.classList.toggle("cc-saved", has((c.getAttribute("href") || "").replace("/collection/", ""))));
    $$("[data-shortlist]", root).forEach((p) => {
      p.hidden = !l.length;
      p.replaceChildren();
      if (!l.length) return;
      const row = document.createElement("div"); row.className = "short-row";
      l.forEach((i) => {
        const chip = document.createElement("span"); chip.className = "short-chip";
        const x = document.createElement("button"); x.type = "button"; x.dataset.drop = i.slug; x.textContent = "×";
        x.setAttribute("aria-label", `Remove ${i.name}`);
        chip.append(link(`/collection/${i.slug}`, i.name), x);
        row.append(chip);
      });
      const ask = link("/contact", "Ask about these"); ask.className = "btn btn-s";
      p.append(el("span", `Your shortlist · ${l.length}`), row, ask, el("p", "Kept in this browser only."));
      p.firstElementChild!.className = "eb";
      p.lastElementChild!.className = "short-note";
    });
    $$("form[data-form] [data-short]", root).forEach((s) => {
      const f = s.closest("form")!;
      const eligible = f.dataset.to !== "signal" && f.dataset.to !== "deposit";
      s.hidden = !eligible || !l.length;
      s.replaceChildren();
      if (s.hidden) return;
      const names = l.map((i) => i.name).join(", ");
      const lab = document.createElement("label"); lab.className = "ack";
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = true; cb.name = "shortlist";
      lab.append(cb, el("span", ` Include my shortlist: ${names}`));
      s.dataset.names = names;
      s.append(lab);
    });
  };
  const onClick = (ev: Event) => {
    const t = ev.target as HTMLElement;
    const save = t.closest<HTMLButtonElement>("[data-save]");
    if (save) {
      const l = readShort(), s = save.dataset.save || "";
      writeShort(l.some((i) => i.slug === s) ? l.filter((i) => i.slug !== s) : [...l, { slug: s, name: save.dataset.name || s }]);
      return;
    }
    const drop = t.closest<HTMLButtonElement>("[data-drop]");
    if (drop) writeShort(readShort().filter((i) => i.slug !== drop.dataset.drop));
  };
  root.addEventListener("click", onClick);
  window.addEventListener(SHORT, paint);
  window.addEventListener("storage", paint);
  paint();
  return () => { root.removeEventListener("click", onClick); window.removeEventListener(SHORT, paint); window.removeEventListener("storage", paint); };
}

/* ── THE DOCKET AND THE GATES (./docket.ts) ───────────────────────────
   Both are tab sets: one tab open, its panel shown, arrow keys and Home
   and End moving between tabs as the ARIA tabs pattern expects. */
function tabsets(root: HTMLElement): () => void {
  const off: (() => void)[] = [];
  const wire = (tabs: HTMLElement[], panelOf: (t: HTMLElement) => HTMLElement | null) => {
    const select = (t: HTMLElement, focus = false) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; x.classList.toggle("on", on);
        const p = panelOf(x); if (p) p.hidden = !on;
      });

      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      const click = () => select(t);
      const key = (e: KeyboardEvent) => {
        const n = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
        if (n === null) return;
        e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true);
      };
      t.addEventListener("click", click); t.addEventListener("keydown", key);
      off.push(() => { t.removeEventListener("click", click); t.removeEventListener("keydown", key); });
    });
  };
  /* Each folder carries its own tab's paper (--t, set in the markup), so a tab and its folder read as one sheet. */
  $$("[data-dkt]", root).forEach((d) => {
    wire($$<HTMLElement>('[role="tab"]', d), (t) => document.getElementById(t.getAttribute("aria-controls") || ""));
  });
  $$("[data-gates]", root).forEach((g) => {
    wire($$<HTMLElement>(".stg", g), (t) => document.getElementById(t.getAttribute("aria-controls") || ""));
  });
  return () => off.forEach((x) => x());
}

/* ── THE GALLERY AND THE PROJECTOR (./gallery.ts) ─────────────────────
   The gallery: the fan opens a full-screen viewer that scrolls a frame at
   a time (swipe, wheel, mouse drag, arrow keys), traps focus while open,
   and gives focus back to the fan when closed. The projector: one estate,
   centred, stepped with a hard shutter cut, never advancing by itself. */
const two = (n: number) => String(n).padStart(2, "0");
function galleries(root: HTMLElement, still: boolean): () => void {
  const off: (() => void)[] = [];
  const on = (el: EventTarget, ev: string, fn: EventListener, opt?: AddEventListenerOptions) => { el.addEventListener(ev, fn, opt); off.push(() => el.removeEventListener(ev, fn)); };
  $$("[data-gal]", root).forEach((g) => {
    const ov = $<HTMLElement>(".gal-ov", g), vp = $<HTMLElement>("[data-gal-vp]", g), opener = $<HTMLButtonElement>("[data-gal-open]", g);
    if (!ov || !vp || !opener) return;
    const frames = $$<HTMLElement>(".gal-f", vp), idx = $(".gal-idx", g), bar = $<HTMLElement>(".gal-bar i", g);
    let cur = 0, raf = 0;
    const mark = () => {
      const c = vp.scrollLeft + vp.clientWidth / 2;
      let best = 0, bd = Infinity;
      frames.forEach((f, i) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
      cur = best;
      frames.forEach((f, i) => f.classList.toggle("on", i === cur));
      if (idx) idx.textContent = `${two(cur + 1)} / ${two(frames.length)}`;
      if (bar) bar.style.transform = `scaleX(${(cur + 1) / frames.length})`;
    };
    const go = (i: number, smooth = true) => {
      const f = frames[Math.max(0, Math.min(frames.length - 1, i))];
      if (f) vp.scrollTo({ left: f.offsetLeft - (vp.clientWidth - f.offsetWidth) / 2, behavior: smooth && !still ? "smooth" : "auto" });
    };
    const open = () => {
      ov.hidden = false; opener.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => { go(0, false); mark(); $<HTMLElement>(".gal-x", ov)?.focus(); });
    };
    const close = () => {
      ov.hidden = true; opener.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      opener.focus();
    };
    on(opener, "click", open);
    $$("[data-gal-close]", ov).forEach((b) => on(b, "click", close));
    const prev = $("[data-gal-prev]", ov), next = $("[data-gal-next]", ov);
    if (prev) on(prev, "click", () => go(cur - 1));
    if (next) on(next, "click", () => go(cur + 1));
    on(vp, "scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    on(ov, "keydown", ((e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
      else if (e.key === "Tab") {
        const f = $$<HTMLElement>('button, a[href], [tabindex="0"]', ov).filter((x) => !x.closest("[hidden]"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }) as EventListener);
    /* A mouse can drag the frames as a finger swipes them; snapping resumes on release. */
    let down = false, sx = 0, sl = 0, moved = false;
    on(vp, "pointerdown", ((e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = vp.scrollLeft; vp.style.scrollSnapType = "none"; vp.classList.add("drag");
    }) as EventListener);
    on(window, "pointermove", ((e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true;
      vp.scrollLeft = sl - dx;
    }) as EventListener);
    on(window, "pointerup", () => {
      if (!down) return;
      down = false; vp.classList.remove("drag"); vp.style.scrollSnapType = "";
      mark(); go(cur);
    });
    /* A drag that moved is not a click on the link beneath it. */
    on(vp, "click", ((e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }) as EventListener, { capture: true });
  });
  return () => { off.forEach((x) => x()); document.documentElement.style.overflow = ""; };
}

function projectors(root: HTMLElement, still: boolean): () => void {
  const off: (() => void)[] = [];
  $$("[data-proj]", root).forEach((p) => {
    const figs = $$<HTMLElement>(".proj-f", p), idx = $(".proj-idx", p), scr = $<HTMLElement>(".proj-screen", p);
    let cur = 0, t = 0;
    const show = (i: number) => {
      const n = (i + figs.length) % figs.length;
      if (n === cur) return;
      const swap = () => { figs.forEach((f, k) => { f.hidden = k !== n; }); cur = n; if (idx) idx.textContent = `${two(n + 1)} / ${two(figs.length)}`; };
      if (still || !scr) { swap(); return; }
      /* The shutter: black for a beat, then the next frame, whole. No fade. */
      scr.classList.add("cut");
      clearTimeout(t);
      t = window.setTimeout(() => { swap(); scr.classList.remove("cut"); }, 110);
    };
    const prev = $("[data-proj-prev]", p), next = $("[data-proj-next]", p);
    const a = () => show(cur - 1), b = () => show(cur + 1);
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); a(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); b(); }
    };
    prev?.addEventListener("click", a); next?.addEventListener("click", b); p.addEventListener("keydown", key);
    off.push(() => { prev?.removeEventListener("click", a); next?.removeEventListener("click", b); p.removeEventListener("keydown", key); clearTimeout(t); });
  });
  return () => off.forEach((x) => x());
}

/* ── AN ENQUIRY IN TWO STEPS (d11) ────────────────────────────────────
   What the question is, then who is asking. The second step shows the
   first back in one line, with a way to change it. */
function steps(root: HTMLElement): () => void {
  const off: (() => void)[] = [];
  $$<HTMLFormElement>("form.tx-form-steps", root).forEach((f) => {
    const s1 = $<HTMLFieldSetElement>('[data-step="1"]', f)!, s2 = $<HTMLFieldSetElement>('[data-step="2"]', f)!;
    const go = (n: 1 | 2) => {
      s1.hidden = n !== 1; s2.hidden = n !== 2;
      if (n === 2) {
        const topics = $$<HTMLButtonElement>('.chip[aria-pressed="true"]', f).map((c) => c.textContent || "").filter(Boolean);
        const sel = $<HTMLSelectElement>("select", f);
        const est = sel && sel.value ? sel.options[sel.selectedIndex].text : "";
        const q = ($<HTMLTextAreaElement>("textarea", f)?.value || "").trim();
        const sum = $("[data-sum]", f);
        if (sum) sum.textContent = [topics.join(", ") || "A general question", est, q ? `“${q.length > 90 ? q.slice(0, 90) + "…" : q}”` : ""].filter(Boolean).join(" · ");
        $<HTMLInputElement>("input", s2)?.focus();
      } else $<HTMLElement>(".chip, select, textarea", s1)?.focus();
    };
    const n = $("[data-next]", f), b = $("[data-back]", f);
    const next = () => go(2), back = () => go(1);
    n?.addEventListener("click", next); b?.addEventListener("click", back);
    off.push(() => { n?.removeEventListener("click", next); b?.removeEventListener("click", back); });
  });
  return () => off.forEach((x) => x());
}

export function SiteBehaviour() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".site");
    if (!root) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off: (() => void)[] = [];
    const on = (el: EventTarget, ev: string, fn: EventListener, opt?: AddEventListenerOptions) => {
      el.addEventListener(ev, fn, opt); off.push(() => el.removeEventListener(ev, fn));
    };

    /* the digital assemblies the pages carry */
    off.push(wireDA(root));

    /* the returns calculator (./calc.ts), where a page carries one */
    off.push(wireCalc(root));

    /* films */
    $$<HTMLCanvasElement>("canvas.film", root).forEach((c, i) => {
      off.push(Film(c, { pal: c.dataset.pal || "coast", hour: Number(c.dataset.hour || 18), rain: !!c.dataset.rain, bp: !!c.dataset.bp, seed: 17 + i * 13, still }));
    });

    /* internal links travel without a reload */
    on(root, "click", ((ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest("a");
      if (!a || ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || a.target) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/")) return;
      ev.preventDefault();
      router.push(href);
    }) as EventListener);

    /* manifesto: words fill as you scroll */
    const man = $("#mani", root);
    if (man) {
      const ws = $$("span", man);
      const fill = () => {
        if (still) { ws.forEach((s) => s.classList.add("on")); return; }
        const r = man.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3)));
        const n = Math.round(k * ws.length);
        ws.forEach((s, i) => s.classList.toggle("on", i < n));
      };
      on(window, "scroll", fill, { passive: true }); fill();
    }

    /* collection filters */
    const cg = $("#cgrid", root);
    if (cg) {
      let cf = "all", cs = "open";
      const apply = () => $$<HTMLElement>(".cc", cg).forEach((c) => { c.hidden = !((cf === "all" || c.dataset.f === cf) && c.dataset.s === cs); });
      $$<HTMLButtonElement>(".fl button", root).forEach((b, _, all) => on(b, "click", () => { all.forEach((x) => x.setAttribute("aria-pressed", String(x === b))); cf = b.dataset.f || "all"; apply(); }));
      $$<HTMLButtonElement>(".subtabs button", root).forEach((b, _, all) => on(b, "click", () => { all.forEach((x) => x.setAttribute("aria-selected", String(x === b))); cs = b.dataset.s || "open"; apply(); }));
      apply();
    }

    /* the concept drawing: a zone lights when named */
    $$(".axo", root).forEach((ax) => {
      const zs = $$<HTMLButtonElement>(".zl button", ax), gs = $$<SVGGElement>(".z", ax);
      const paint = (only?: string) => gs.forEach((g) => {
        const btn = $(`.zl button[data-z="${g.dataset.z}"]`, ax);
        const lit = only ? g.dataset.z === only : btn?.getAttribute("aria-pressed") === "true";
        g.style.opacity = lit ? "1" : "0.12";
      });
      zs.forEach((b) => {
        on(b, "click", () => {
          const all = zs.every((x) => x.getAttribute("aria-pressed") === "true");
          zs.forEach((x) => x.setAttribute("aria-pressed", all ? String(x === b) : "true")); paint();
        });
        on(b, "mouseenter", () => paint(b.dataset.z)); on(b, "mouseleave", () => paint());
      });
    });

    /* travel cards */
    $$(".tcards", root).forEach((t) => {
      const bs = $$<HTMLButtonElement>("button", t);
      bs.forEach((b) => on(b, "click", () => bs.forEach((x) => x.setAttribute("aria-pressed", String(x === b)))));
    });

    /* the plan viewer */
    $$(".plan", root).forEach((pl) => {
      const bs = $$<HTMLButtonElement>(".bar button", pl);
      bs.forEach((b) => on(b, "click", () => {
        bs.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
        $$<HTMLElement>("[data-p]", pl).forEach((el) => { if (el.tagName !== "BUTTON") el.toggleAttribute("hidden", el.dataset.p !== b.dataset.p); });
      }));
    });

    /* the section pager */
    const pager = $$<HTMLAnchorElement>(".pager a", root);
    if (pager.length && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting) pager.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
      }), { rootMargin: "-45% 0px -50% 0px" });
      pager.forEach((a) => { const t = document.getElementById((a.getAttribute("href") || "#").slice(1)); if (t) io.observe(t); });
      off.push(() => io.disconnect());
    }

    /* a long read: how far through, and which part (Digital Visuals · Journal) */
    const toc = $(".tx-toc", root), body = $(".tx-body", root);
    if (toc && body) {
      const bar = document.createElement("div");
      bar.className = "readbar"; bar.setAttribute("aria-hidden", "true");
      root.appendChild(bar); off.push(() => bar.remove());
      const links = $$<HTMLAnchorElement>("a", toc);
      const heads = links.map((a) => document.getElementById((a.getAttribute("href") || "#").slice(1))).filter(Boolean) as HTMLElement[];
      const tick = () => {
        const r = body.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        bar.style.transform = `scaleX(${k})`;
        let cur = -1;
        heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
        links.forEach((a, i) => a.classList.toggle("on", i === cur));
      };
      on(window, "scroll", tick, { passive: true }); tick();
    }

    /* the estate bar: shown once the hero has gone, hidden again at the enquiry */
    const ebar = $("[data-ebar]", root), hero = $(".phero", root);
    if (ebar && hero && typeof IntersectionObserver !== "undefined") {
      const cta = $<HTMLAnchorElement>("a", ebar);
      let past = false, atEnd = false;
      const set = () => {
        const on = past && !atEnd;
        ebar.classList.toggle("on", on);
        ebar.setAttribute("aria-hidden", String(!on));
        if (cta) cta.tabIndex = on ? 0 : -1;
      };
      const io = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.target === hero) past = !en.isIntersecting && en.boundingClientRect.top < 0;
        else atEnd = en.isIntersecting;
        set();
      }));
      io.observe(hero);
      $$(".mk, .mk-wait", root).forEach((m) => io.observe(m));
      off.push(() => io.disconnect());
    }

    /* the glossary, in context: a defined word opens its definition where it
       is read (Next Actions d04). Each term once per page, prose only. */
    let alive = true;
    off.push(() => { alive = false; });
    if (pathname !== "/glossary") {
      loadIndex().then((idx) => { if (alive && idx?.glossary.length) off.push(glossary(root, idx.glossary)); });
    }

    /* figure sources, the shortlist and the two-step enquiry */
    off.push(figures(root), shortlist(root), steps(root), tabsets(root), galleries(root, still), projectors(root, still));

    /* copy buttons: clipboard where it is allowed, a selection where it is not */
    $$(".tx-copy", root).forEach((c) => {
      const t = $(".ct", c), b = $<HTMLButtonElement>(".cpy", c), cc = $(".cc", c);
      if (!t || !b) return;
      if (cc) cc.textContent = (t.textContent || "").split(/\s+/).filter(Boolean).length + " words";
      on(b, "click", () => {
        const select = () => { const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); b.textContent = "Selected"; };
        try { navigator.clipboard.writeText(t.textContent || "").then(() => { b.textContent = "Copied"; }, select); } catch { select(); }
        window.setTimeout(() => { b.textContent = "Copy"; }, 1800);
      });
    });

    /* Journal chips */
    $$(".jchips", root).forEach((g) => {
      const list = g.nextElementSibling;
      const chips = $$<HTMLButtonElement>(".chip", g);
      chips.forEach((b) => on(b, "click", () => {
        chips.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        if (list) $$<HTMLElement>(".jrow", list).forEach((r) => { r.hidden = !(b.dataset.k === "all" || r.dataset.k === b.dataset.k); });
      }));
    });

    /* forms: the platform's own endpoints */
    $$<HTMLFormElement>("form[data-form]", root).forEach((f) => {
      $$<HTMLButtonElement>(".chip", f).forEach((c) => on(c, "click", () => c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true"))));
      on(f, "submit", (async (ev: Event) => {
        ev.preventDefault();
        if (f.dataset.to === "deposit") { await payDeposit(f); return; }
        const ok = $<HTMLElement>(".tx-ok", f), err = $<HTMLElement>(".tx-err", f);
        const btn = $<HTMLButtonElement>("button[type=submit]", f);
        const val = (n: string) => ($<HTMLInputElement>(`[name="${n}"]`, f)?.value || "").trim();
        const email = val("email");
        if (!email || !/.+@.+\..+/.test(email)) { $<HTMLInputElement>('[name="email"]', f)?.focus(); return; }
        const to = f.dataset.to === "signal" ? "signal" : "dossier";
        const topics = $$<HTMLButtonElement>('.chip[aria-pressed="true"]', f).map((c) => c.textContent || "").filter(Boolean);
        const shortBox = $<HTMLElement>("[data-short]", f);
        const short = shortBox && !shortBox.hidden && $<HTMLInputElement>('input[name="shortlist"]', shortBox)?.checked ? shortBox.dataset.names || "" : "";
        const note = [topics.length ? `About: ${topics.join(", ")}` : "", short ? `Shortlist: ${short}` : "", val("note")].filter(Boolean).join("\n").slice(0, 2000);
        const body = to === "signal"
          ? { email }
          : { name: val("name") || email, email, vehicle: f.dataset.vehicle || val("vehicle") || undefined, city: val("city") || undefined, note: note || undefined };
        if (btn) btn.disabled = true;
        if (ok) ok.hidden = true; if (err) err.hidden = true;
        try {
          const r = await fetch(`/api/${to}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
          if (r.ok) {
            if (ok) ok.hidden = false;
            f.reset();
            /* A stepped enquiry that has gone says so and nothing else. */
            $$<HTMLElement>(".fstep", f).forEach((s) => { s.hidden = true; });
          } else if (err) err.hidden = false;
        } catch { if (err) err.hidden = false; }
        if (btn) btn.disabled = false;
      }) as EventListener);
    });

    /* a hash on arrival scrolls to its section once the page has laid out */
    if (location.hash.length > 1) {
      const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) requestAnimationFrame(() => t.scrollIntoView());
    }

    return () => off.forEach((f) => f());
  }, [pathname, router]);

  return null;
}
