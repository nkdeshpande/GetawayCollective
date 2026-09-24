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

const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s)) as T[];
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);

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
