/**
 * THE RETURNS CALCULATOR — the same sum, four ways
 *
 * 25 Sep 2026, founder brief of the same date: show what an estate does
 * for your money against an apartment let out, a fixed deposit and an
 * equity SIP, and what only the estate gives you: a place you can use.
 *
 * What the calculator will and will not say, and why:
 *
 *  - THE ESTATE'S FIGURES ARE THE REGISTER'S. The yield is the one the
 *    estate's own investment page already publishes (app/_assemblies/
 *    data.ts yieldOf), with its class and basis beside it (PUBLIC.02):
 *    modelled, on offering equity, from year 3 at stabilised occupancy.
 *    Years 1 and 2 pay nothing here, because the basis says year 3.
 *  - THE ESTATE'S VALUE IS HELD FLAT. The site states no appreciation for
 *    any estate, so the calculator does not invent one. The apartment's
 *    growth is the viewer's own assumption, and is shown as such.
 *  - NIGHTS ARE COUNTED, AND VALUED ONLY IF ASKED. Your share of the
 *    estate's equity, applied to its yearly night pool, from year 3; their
 *    worth is the estate's own modelled nightly rate. That is the one thing
 *    none of the other three can give, and it is drawn as its own line.
 *  - CAPITAL IS AT RISK, and the page says so. An estate is not a deposit:
 *    of the four, only the fixed deposit carries deposit insurance. What
 *    stands behind an estate is land and buildings your partnership holds,
 *    run by a professional operator. That is said plainly; protection is
 *    not claimed, because the Terms and the Risk Factors say the opposite.
 *  - THE OTHER THREE RATES ARE ASSUMPTIONS, the viewer's to change. The
 *    defaults are round, illustrative figures, labelled as such, and are
 *    not forecasts by anyone.
 *
 * Pure functions first (tested in tests/calc.test.ts), then the markup the
 * server renders at rest, then the wiring behaviour.tsx calls.
 */

export interface CalcEstate {
  readonly key: string;
  readonly name: string;
  /** Rupees. */
  readonly unitPrice: number;
  readonly maxUnits: number;
  /** Percent a year, from `fromYear`. */
  readonly yieldPct: number;
  readonly yieldClass: string;
  readonly basis: string;
  readonly fromYear: number;
  /** Rupees: the whole equity layer, which the night pool follows. */
  readonly equity: number;
  readonly poolMin: number;
  readonly poolMax: number;
  /** Rupees: the estate's modelled average nightly rate. */
  readonly nightly: number;
  readonly status: string;
}

export interface CalcInputs {
  readonly estate: CalcEstate;
  readonly units: number;
  readonly years: number;
  /** Percent a year. */
  readonly fd: number;
  readonly sip: number;
  readonly rent: number;
  readonly growth: number;
  readonly countNights: boolean;
}

export interface CalcResult {
  readonly amount: number;
  /** Index 0 is today; index y is the end of year y. Rupees. */
  readonly estate: readonly number[];
  readonly estateWithNights: readonly number[];
  readonly fd: readonly number[];
  readonly sip: readonly number[];
  readonly apartment: readonly number[];
  readonly nightsPerYear: readonly [number, number];
  readonly share: number;
}

export const DEFAULTS = { years: 10, fd: 6.5, sip: 12, rent: 3, growth: 5 } as const;

/** The same sum in each, every year to `years`. Before tax and costs. */
export function simulate(i: CalcInputs): CalcResult {
  const amount = i.estate.unitPrice * i.units;
  const share = i.estate.equity > 0 ? amount / i.estate.equity : 0;
  const nights: [number, number] = [Math.round(i.estate.poolMin * share), Math.round(i.estate.poolMax * share)];
  const nightValue = ((nights[0] + nights[1]) / 2) * i.estate.nightly;
  const r = { fd: i.fd / 100, sip: i.sip / 100, rent: i.rent / 100, g: i.growth / 100, y: i.estate.yieldPct / 100 };

  const estate: number[] = [], withNights: number[] = [], fd: number[] = [], sip: number[] = [], apt: number[] = [];
  let paid = 0, used = 0, rent = 0;
  for (let y = 0; y <= i.years; y++) {
    if (y >= i.estate.fromYear) { paid += amount * r.y; used += nightValue; }
    estate.push(amount + paid);
    withNights.push(amount + paid + (i.countNights ? used : 0));
    /* A fixed deposit compounds quarterly in India. */
    fd.push(amount * Math.pow(1 + r.fd / 4, 4 * y));
    /* A SIP: the same sum in twelve monthly instalments, each growing from its month. */
    let s = 0;
    for (let m = 0; m < 12; m++) {
      const months = 12 * y - m;
      s += months > 0 ? (amount / 12) * Math.pow(1 + r.sip, months / 12) : months === 0 ? amount / 12 : 0;
    }
    sip.push(y === 0 ? amount : s);
    /* An apartment: its price moves with the growth assumption; rent is a
       share of the price at the start of each year, and is not reinvested. */
    if (y >= 1) rent += amount * Math.pow(1 + r.g, y - 1) * r.rent;
    apt.push(amount * Math.pow(1 + r.g, y) + rent);
  }
  return { amount, estate, estateWithNights: withNights, fd, sip, apartment: apt, nightsPerYear: nights, share };
}

/** ₹ in the Indian way: crore and lakh, never millions. */
export function inr(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/* ── the chart ──────────────────────────────────────────────────────── */

const W = 640, H = 300, L = 64, R = 16, T = 16, B = 34;

/** A round step for the value axis, so every tick is a figure the chart reaches. */
function niceStep(span: number): number {
  const raw = span / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

export const SERIES = [
  ["estateWithNights", "s-nights", "Estate, with your nights"],
  ["estate", "s-est", "Estate"],
  ["apartment", "s-apt", "Apartment, let out"],
  ["sip", "s-sip", "Equity SIP"],
  ["fd", "s-fd", "Fixed deposit"],
] as const;

export function chartSVG(res: CalcResult, countNights: boolean): string {
  const shown = SERIES.filter(([k]) => countNights || k !== "estateWithNights");
  const all = shown.flatMap(([k]) => res[k] as readonly number[]);
  const min = 0, top = Math.max(...all);
  const step = niceStep(top - min), max = Math.ceil(top / step) * step;
  const n = res.fd.length - 1;
  const x = (y: number) => L + ((W - L - R) * y) / n;
  const yv = (v: number) => T + (H - T - B) * (1 - (v - min) / (max - min));
  let g = "";
  for (let v = min; v <= max + 1; v += step) g += `<line class="c-grid" x1="${L}" x2="${W - R}" y1="${yv(v)}" y2="${yv(v)}"/><text class="c-ax" x="${L - 8}" y="${yv(v) + 4}" text-anchor="end">${inr(v)}</text>`;
  for (let y = 0; y <= n; y += n > 10 ? 5 : n > 6 ? 2 : 1) g += `<text class="c-ax" x="${x(y)}" y="${H - 10}" text-anchor="middle">${y === 0 ? "Today" : `Yr ${y}`}</text>`;
  const lines = shown.map(([k, cls]) => {
    const pts = (res[k] as readonly number[]).map((v, y) => `${x(y).toFixed(1)},${yv(v).toFixed(1)}`).join(" ");
    return `<polyline class="c-line ${cls}" points="${pts}"/>`;
  }).join("");
  return `<svg class="calc-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Value of the same sum in each of the four, year by year">${g}${lines}</svg>`;
}

/* ── the markup the server renders at rest ─────────────────────────── */

const pct = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)}%`;

function cards(res: CalcResult, i: CalcInputs): string {
  const y = i.years, last = (a: readonly number[]) => a[y];
  const card = (cls: string, name: string, value: number, line: string) =>
    `<div class="calc-card ${cls}"><span class="eb">${name}</span><b class="mono">${inr(value)}</b><small>${line}</small></div>`;
  const est = i.estate;
  return card("s-est", `${est.name}, after ${y} years`, last(i.countNights ? res.estateWithNights : res.estate),
      `${inr(res.amount)} held, ${inr(last(res.estate) - res.amount)} in modelled distributions` +
      (i.countNights ? `, and ${inr(last(res.estateWithNights) - last(res.estate))} of nights at the estate's own nightly rate` : "") + ". Your capital is at risk.") +
    card("s-apt", "Apartment, let out", last(res.apartment), `${pct(i.rent)} rent a year and ${pct(i.growth)} price growth, both your assumptions, before vacancy, upkeep and stamp duty.`) +
    card("s-sip", "Equity SIP", last(res.sip), `${pct(i.sip)} a year, your assumption. Markets can fall as well as rise.`) +
    card("s-fd", "Fixed deposit", last(res.fd), `${pct(i.fd)} a year, compounded quarterly, your assumption.`);
}

export function readout(res: CalcResult, i: CalcInputs): string {
  return `<div class="calc-cards">${cards(res, i)}</div>${chartSVG(res, i.countNights)}` +
    `<p class="calc-nights"><b class="mono">${res.nightsPerYear[0]}–${res.nightsPerYear[1]}</b> nights a year at ${i.estate.name}, yours to spend, from year ${i.estate.fromYear}. ` +
    `No deposit, fund or flat you let out gives you that.</p>`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

export function calcHTML(estates: readonly CalcEstate[]): string {
  if (!estates.length) return "";
  const e = estates[0];
  const i: CalcInputs = { estate: e, units: 1, ...DEFAULTS, countNights: true };
  const res = simulate(i);
  const num = (name: string, label: string, v: number, hint: string) =>
    `<label class="calc-f"><span>${label}</span><span class="calc-pct"><input type="number" name="${name}" value="${v}" min="0" max="30" step="0.25" inputmode="decimal">%</span><small>${hint}</small></label>`;
  return `<section class="calc" data-calc="${esc(JSON.stringify(estates))}">` +
    `<div class="calc-in">` +
      `<label class="calc-f"><span>Estate</span><select name="estate">${estates.map((x) => `<option value="${x.key}">${esc(x.name)} · ${esc(x.status)}</option>`).join("")}</select></label>` +
      `<label class="calc-f"><span>Units</span><input type="range" name="units" min="1" max="${e.maxUnits}" value="1"><output class="mono" data-o="units">1 unit · ${inr(e.unitPrice)}</output></label>` +
      `<label class="calc-f"><span>Years</span><input type="range" name="years" min="5" max="15" value="${DEFAULTS.years}"><output class="mono" data-o="years">${DEFAULTS.years} years</output></label>` +
      `<label class="calc-chk"><input type="checkbox" name="nights" checked><span>Count your nights at the estate's own nightly rate</span></label>` +
      `<p class="calc-basis" data-o="basis">${esc(e.name)}: ${pct(e.yieldPct)} a year, ${esc(e.yieldClass.toLowerCase())}, ${esc(e.basis)}. Not promised.</p>` +
      `<details class="calc-asm"><summary>Your assumptions for the other three</summary>` +
        num("fd", "Fixed deposit", DEFAULTS.fd, "Check your bank's current rate.") +
        num("sip", "Equity SIP", DEFAULTS.sip, "A long-run figure; any year can be negative.") +
        num("rent", "Apartment rent", DEFAULTS.rent, "Rent a year, as a share of the price.") +
        num("growth", "Apartment price growth", DEFAULTS.growth, "A year. The estate's value is held flat.") +
        `<p class="calc-basis">The defaults are round, illustrative figures, not forecasts. Change them to your own.</p>` +
      `</details>` +
    `</div>` +
    `<div class="calc-out" aria-live="polite">${readout(res, i)}</div>` +
    `</section>`;
}

/** Four answers to the same five questions, written once. */
export const COMPARE: readonly (readonly [string, string, string, string, string])[] = [
  ["", "An estate", "An apartment, let out", "A fixed deposit", "An equity SIP"],
  ["Your capital", "At risk. Behind it: land and buildings your partnership holds.", "At risk. Behind it: the flat.", "Insured by DICGC up to a limit per depositor per bank.", "At risk. It moves with the market."],
  ["Can you use it?", "Yes. Nights of your own every year, from handover.", "Only if you do not let it.", "No.", "No."],
  ["Who runs it", "The operating partner, measured and paid from the waterfall.", "You, or an agent you pay.", "The bank.", "A fund manager."],
  ["Income", "Modelled distributions from year 3. Not promised.", "Rent, less vacancy and upkeep.", "Fixed interest.", "None until you sell."],
  ["Getting out", "No public market. Partners may post interest on the internal register.", "Months, with brokerage and stamp duty.", "Break it early, with a penalty.", "Redeem in days."],
];

export const compareHTML = () =>
  `<div class="calc-cmp" role="table" aria-label="The four, compared">${COMPARE.map((r, n) =>
    `<div role="row" class="${n === 0 ? "hd" : ""}">${r.map((c, k) => `<span role="${n === 0 || k === 0 ? "columnheader" : "cell"}">${c}</span>`).join("")}</div>`).join("")}</div>`;

/* ── the wiring (behaviour.tsx) ────────────────────────────────────── */

export function wireCalc(root: HTMLElement): () => void {
  const off: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>(".calc").forEach((box) => {
    let estates: CalcEstate[] = [];
    try { estates = JSON.parse(box.dataset.calc || "[]"); } catch { return; }
    if (!estates.length) return;
    const q = <T extends Element>(s: string) => box.querySelector<T>(s);
    const out = q<HTMLElement>(".calc-out"), units = q<HTMLInputElement>('[name="units"]');
    const num = (n: string, d: number) => { const v = Number(q<HTMLInputElement>(`[name="${n}"]`)?.value); return Number.isFinite(v) && v >= 0 && v <= 30 ? v : d; };
    const draw = () => {
      const e = estates.find((x) => x.key === q<HTMLSelectElement>('[name="estate"]')?.value) ?? estates[0];
      if (units && Number(units.max) !== e.maxUnits) { units.max = String(e.maxUnits); if (Number(units.value) > e.maxUnits) units.value = String(e.maxUnits); }
      const i: CalcInputs = {
        estate: e, units: Math.max(1, Number(units?.value) || 1),
        years: Number(q<HTMLInputElement>('[name="years"]')?.value) || DEFAULTS.years,
        fd: num("fd", DEFAULTS.fd), sip: num("sip", DEFAULTS.sip), rent: num("rent", DEFAULTS.rent), growth: num("growth", DEFAULTS.growth),
        countNights: !!q<HTMLInputElement>('[name="nights"]')?.checked,
      };
      const res = simulate(i);
      const o = (k: string, t: string) => { const el = q<HTMLElement>(`[data-o="${k}"]`); if (el) el.textContent = t; };
      o("units", `${i.units} ${i.units === 1 ? "unit" : "units"} · ${inr(res.amount)}`);
      o("years", `${i.years} years`);
      o("basis", `${e.name}: ${pct(e.yieldPct)} a year, ${e.yieldClass.toLowerCase()}, ${e.basis}. Not promised.`);
      if (out) out.innerHTML = readout(res, i);
    };
    const h = () => draw();
    box.addEventListener("input", h);
    box.addEventListener("change", h);
    off.push(() => { box.removeEventListener("input", h); box.removeEventListener("change", h); });
  });
  return () => off.forEach((f) => f());
}
