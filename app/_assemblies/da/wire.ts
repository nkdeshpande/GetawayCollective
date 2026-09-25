/**
 * DIGITAL ASSEMBLIES — the wiring
 *
 * Finds every [data-da] under a root and brings it to life. Pure DOM, so the
 * site's SiteBehaviour and the workspaces' <DA> both call it. It changes what
 * is shown, never a figure: every figure arrived as a string in data-json,
 * rendered on the server from the vehicle register.
 *
 * Returns a function that removes every listener it added.
 */

const q = <T extends Element = HTMLElement>(s: string, r: ParentNode) => r.querySelector<T>(s);
const qa = <T extends Element = HTMLElement>(s: string, r: ParentNode) => Array.from(r.querySelectorAll<T>(s));
const f = (el: ParentNode, name: string) => q<HTMLElement>(`[data-f="${name}"]`, el);
const setText = (el: ParentNode, name: string, v: string) => { const n = f(el, name); if (n) n.textContent = v; };

/* The three entities and what passes between them. Positions are the
   drawing's own; labels are the platform's words. */
const N: Record<string, [number, number, string, string]> = {
  gc: [110, 70, "Getaway Collective", "Governs · holds no equity"], llp: [320, 190, "The estate's LLP", "Owns the land and buildings"],
  sg: [530, 70, "Sensory Getaways", "Operates under contract"], p: [220, 320, "Partners", "Own the LLP"], b: [420, 320, "The bank", "Lends to the LLP"],
};
const E: Record<string, [string, string, string][]> = {
  Governance: [["gc", "llp", "governs"], ["p", "llp", "votes, by equity"]],
  Capital: [["p", "llp", "equity"], ["b", "llp", "facility"], ["llp", "p", "stage 6"], ["llp", "b", "stage 5"]],
  Operations: [["sg", "llp", "operates"], ["llp", "sg", "stage 1"], ["llp", "gc", "one disclosed stage"]],
};

export function wireDA(root: ParentNode): () => void {
  const off: (() => void)[] = [];
  const on = (el: EventTarget, ev: string, fn: EventListener) => { el.addEventListener(ev, fn); off.push(() => el.removeEventListener(ev, fn)); };
  const press = (group: HTMLElement[], b: HTMLElement) => group.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));

  qa("[data-da]", root).forEach((el) => {
    if (el.dataset.wired) return;
    el.dataset.wired = "1";
    const kind = el.dataset.da;
    const data = el.dataset.json ? JSON.parse(el.dataset.json) : {};
    const pills = qa<HTMLButtonElement>(".da-pick .da-pill", el);

    if (kind === "waterfall") {
      pills.forEach((b) => on(b, "click", () => {
        press(pills, b);
        const d = data.set.find((x: { key: string }) => x.key === b.dataset.k); if (!d) return;
        setText(el, "partners", d.partners); setText(el, "gross", d.gross);
        const rows = f(el, "rows"); if (rows) rows.innerHTML = d.html;
      }));
    }

    if (kind === "position") {
      let set = data.set[0];
      const r = q<HTMLInputElement>("input[type=range]", el)!;
      const draw = () => {
        const row = set.rows[Math.min(+r.value, set.rows.length) - 1];
        setText(el, "cap", row.cap); setText(el, "share", row.share); setText(el, "vote", row.share);
        setText(el, "nights", row.nights); setText(el, "u", String(row.u)); setText(el, "uw", row.u === 1 ? "unit" : "units");
        setText(el, "begins", set.begins);
      };
      pills.forEach((b) => on(b, "click", () => { press(pills, b); set = data.set.find((x: { key: string }) => x.key === b.dataset.k) ?? set; r.max = String(set.rows.length); if (+r.value > set.rows.length) r.value = "1"; draw(); }));
      on(r, "input", draw); draw();
    }

    if (kind === "entities") {
      const svg = q<SVGSVGElement>(".da-te", el)!, mid = "da-ah-" + Math.random().toString(36).slice(2, 8);
      const draw = (mode: string) => {
        let s = "";
        const live: Record<string, boolean> = {};
        E[mode].forEach(([a0, b0, label], i) => {
          const a = N[a0], b = N[b0], off2 = i % 2 ? 10 : -10, mx = (a[0] + b[0]) / 2 + off2, my = (a[1] + b[1]) / 2 + off2;
          live[a0] = live[b0] = true;
          s += `<path class="da-te-e" d="M${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}" marker-end="url(#${mid})"/><text class="da-te-l" x="${mx}" y="${my - 8}" text-anchor="middle">${label}</text>`;
        });
        Object.entries(N).forEach(([k, n]) => {
          s += `<g class="da-te-n${live[k] ? " on" : ""}"><rect x="${n[0] - 88}" y="${n[1] - 26}" width="176" height="52"/><text x="${n[0]}" y="${n[1] - 2}" text-anchor="middle" class="t">${n[2]}</text><text x="${n[0]}" y="${n[1] + 15}" text-anchor="middle" class="s">${n[3]}</text></g>`;
        });
        svg.innerHTML = `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="da-te-a"/></marker></defs>${s}`;
      };
      const modes = qa<HTMLButtonElement>(".da-pill[data-m]", el);
      modes.forEach((b) => on(b, "click", () => { press(modes, b); draw(b.dataset.m!); }));
      draw("Governance");
    }

    if (kind === "vote") {
      const r = q<HTMLInputElement>("input[type=range]", el)!, svg = q<SVGSVGElement>(".da-vt", el)!;
      const arc = (p: number) => { const a = Math.PI * (1 - p); return [160 + 130 * Math.cos(a), 160 - 130 * Math.sin(a)]; };
      const draw = () => {
        const v = +r.value / 100, e = arc(v);
        let s = '<path d="M30 160 A130 130 0 0 1 290 160" class="bg"/>' + `<path d="M30 160 A130 130 0 0 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}" class="fg"/>`;
        ([data.ordinary, data.quorum, data.special, data.unanimous] as number[]).forEach((t) => {
          const a = arc(t), b = [160 + (a[0] - 160) * 1.13, 160 + (a[1] - 160) * 1.13], c = [160 + (a[0] - 160) * 1.27, 160 + (a[1] - 160) * 1.27 + 4];
          s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="tk"/><text x="${c[0]}" y="${c[1]}" text-anchor="middle" class="tl">${Math.round(t * 100)}</text>`;
        });
        svg.innerHTML = s; setText(el, "v", `${Math.round(v * 100)}%`);
        const res = f(el, "res");
        if (res) res.innerHTML = ([["Ordinary", v > data.ordinary], ["Special", v >= data.special], ["Entrenched", v >= data.unanimous]] as [string, boolean][])
          .map(([n, ok]) => `<span class="da-tag ${ok ? "ok" : ""}">${n} · ${ok ? "carries" : "fails"}</span>`).join("");
      };
      on(r, "input", draw); draw();
    }

    if (kind === "path") {
      let cur = 0; const S: string[] = data.stages, bars = qa("i", q(".da-ap", el)!), items = qa("li", el);
      const draw = () => {
        setText(el, "i", String(cur + 1)); setText(el, "n", S[cur]);
        bars.forEach((b, i) => { b.className = i < cur ? "done" : i === cur ? "now" : ""; });
        items.forEach((b, i) => { b.className = i < cur ? "done" : i === cur ? "now" : ""; });
      };
      const go = q(".da-go", el); if (go) on(go, "click", () => { cur = (cur + 1) % S.length; draw(); });
      items.forEach((li, i) => on(li, "click", () => { cur = i; draw(); }));
    }

    if (kind === "lockin") {
      const r = q<HTMLInputElement>("input[type=range]", el)!, lock = data.lock, fill = q<HTMLElement>(".da-lk i", el)!;
      const draw = () => {
        const m = +r.value, left = lock - m;
        fill.style.width = `${((m + 2) / (lock + 8)) * 100}%`;
        setText(el, "s", m < 0 ? "Before settlement" : left > 0 ? "Months until a unit can move" : "The unit can be offered to other partners");
        setText(el, "v", m < 0 ? "Deposit" : left > 0 ? `${left} mo` : "Open");
        const t = f(el, "t"); if (t) { t.textContent = m < 0 ? "Refundable" : left > 0 ? "Locked" : "Register"; t.className = `da-tag ${m < 0 ? "" : left > 0 ? "warn" : "ok"}`; }
      };
      on(r, "input", draw); draw();
    }

    if (kind === "formation") {
      const btns = qa<HTMLButtonElement>(".da-fm-l button", el), fg = q<SVGCircleElement>(".da-fm-ring .fg", el)!, L = 2 * Math.PI * 50;
      fg.style.strokeDasharray = String(L);
      const draw = (cur: number) => {
        fg.style.strokeDashoffset = String(L * (1 - (cur + 1) / data.n)); setText(el, "n", String(cur + 1));
        btns.forEach((b, i) => { b.className = i < cur ? "done" : i === cur ? "now" : ""; });
      };
      btns.forEach((b) => on(b, "click", () => draw(+b.dataset.i!))); draw(0);
    }

    if (kind === "chassis") {
      const btns = qa<HTMLButtonElement>(".da-ch-l button", el), svgs = qa<SVGSVGElement>(".da-ch-d svg", el);
      const show = (b: HTMLButtonElement) => { press(btns, b); svgs.forEach((s) => s.toggleAttribute("hidden", s.dataset.i !== b.dataset.i)); };
      btns.forEach((b) => { on(b, "click", () => show(b)); on(b, "mouseenter", () => show(b)); });
    }

    if (kind === "search") {
      const inp = q<HTMLInputElement>("input", el)!;
      const rows = () => { let n = el.nextElementSibling; while (n && !n.matches(".tx-rows, .da-rows")) n = n.nextElementSibling; return n ? qa(":scope > div", n) : []; };
      const draw = () => {
        const t = inp.value.trim().toLowerCase(), rs = rows(); let shown = 0;
        rs.forEach((r) => { const hit = !t || (r.textContent || "").toLowerCase().includes(t); (r as HTMLElement).hidden = !hit; if (hit) shown++; });
        setText(el, "n", t ? (shown ? `${shown} of ${rs.length}` : "No ratified answer. Ask Investor Relations.") : "");
      };
      on(inp, "input", draw);
    }
  });
  return () => off.forEach((x) => x());
}
