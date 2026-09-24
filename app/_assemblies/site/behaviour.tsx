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
