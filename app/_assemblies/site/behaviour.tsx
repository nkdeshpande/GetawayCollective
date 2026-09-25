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
  const pop = document.createElement("div");
  pop.className = "gl-pop"; pop.hidden = true; pop.setAttribute("role", "dialog");
  root.appendChild(pop);
  let openBtn: HTMLButtonElement | null = null;
  const close = () => { pop.hidden = true; openBtn?.setAttribute("aria-expanded", "false"); openBtn = null; };
  const show = (btn: HTMLButtonElement) => {
    const [t, d] = list[Number(btn.dataset.g)];
    pop.replaceChildren();
    const h = document.createElement("b"); h.textContent = t;
    const p = document.createElement("p"); p.textContent = d;
    const a = document.createElement("a"); a.href = "/glossary"; a.textContent = "Every term, defined once";
    pop.append(h, p, a);
    pop.setAttribute("aria-label", `${t}: definition`);
    pop.hidden = false;
    const r = btn.getBoundingClientRect(), w = Math.min(320, innerWidth - 32);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(16, Math.min(r.left + scrollX, scrollX + innerWidth - w - 16))}px`;
    pop.style.top = `${r.bottom + scrollY + 8}px`;
    openBtn?.setAttribute("aria-expanded", "false");
    openBtn = btn; btn.setAttribute("aria-expanded", "true");
  };
  const onClick = (ev: Event) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>(".gl-t");
    if (btn) { ev.preventDefault(); if (openBtn === btn) close(); else show(btn); return; }
    if (!(ev.target as HTMLElement).closest(".gl-pop")) close();
  };
  const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape" && openBtn) { const b = openBtn; close(); b.focus(); } };
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); pop.remove(); };
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
        const note = [topics.length ? `About: ${topics.join(", ")}` : "", val("note")].filter(Boolean).join("\n").slice(0, 2000);
        const body = to === "signal"
          ? { email }
          : { name: val("name") || email, email, vehicle: f.dataset.vehicle || val("vehicle") || undefined, city: val("city") || undefined, note: note || undefined };
        if (btn) btn.disabled = true;
        if (ok) ok.hidden = true; if (err) err.hidden = true;
        try {
          const r = await fetch(`/api/${to}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
          if (r.ok) { if (ok) ok.hidden = false; f.reset(); } else if (err) err.hidden = false;
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
