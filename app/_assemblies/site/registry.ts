/**
 * THE SITE READS THE REGISTER — nothing here is a figure, only a reading
 *
 * L1-01 §29-0b · 24 Sep 2026. Founder ruling, same date: the public site
 * shows the register's figures, not the prototype's. Every number a page
 * states about a vehicle is read from constants/vehicles.ts here, and the
 * capital section appears only where publishable() says the record holds.
 *
 * Money arrives as bigint minor units (SCALE 4). It is divided for display
 * and never added: the register already states each total it needs.
 */

import { VEHICLES, stanceFor, publishable, type Vehicle } from "@/constants/vehicles";
import { TAXONOMIES } from "@/constants/taxonomies";

/* ── WHERE A FIGURE COMES FROM (Next Actions d05, 25 Sep 2026) ────────
   Every register figure the site prints can be opened to its source and
   its confidence class, in the platform's own taxonomy
   (constants/taxonomies.ts). Two classes are used, and no stronger one:
     REPORTED  the offering's terms as the sponsor stated them in the LLP
               intake — a trusted party, but not an independent check;
     INFERRED  what the site computes from those (totals, what remains).
   Nothing here is VERIFIED: no figure on the public site has been checked
   against an independent source by the platform, and saying so is the
   point of the tag. Sources follow constants/vehicles.ts's own notes. */
export type Prov = readonly [source: string, cls: "REPORTED" | "INFERRED"];
const MEANING: Readonly<Record<string, string>> = Object.fromEntries(
  TAXONOMIES.confidence.values.map((x) => [x.value, x.meaning]),
);
const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
/** The attributes that make a printed figure open its source. */
export const src = (p: Prov | undefined) =>
  p ? ` data-src="${attr(p[0])}" data-cls="${p[1]}" data-clm="${attr(MEANING[p[1]] ?? "")}"` : "";
const provFor = (v: Vehicle) => {
  const intake = v.key === "wildwood" ? "The LLP intake, 11 Aug 2026, with the founder's structure of 20 Sep 2026" : "The vehicle's LLP intake sheet, 4 Aug 2026";
  return {
    intake: [intake, "REPORTED"] as Prov,
    deposit: ["Founder ruling, 24 Sep 2026: one flat holding deposit at every open estate", "REPORTED"] as Prov,
    derived: [`Computed by this site from the units offered and subscribed, as stated in ${intake.replace(/^The /, "the ")}`, "INFERRED"] as Prov,
  };
};

const FACTOR = 10_000n;
const CRORE = 10_000_000n;
const LAKH = 100_000n;

/** ₹9.50 Cr / ₹40 L — the way an Indian offering letter writes it. */
export function rupees(minor: bigint): string {
  const r = minor / FACTOR;
  if (r >= CRORE) {
    const hundredths = (r * 100n) / CRORE;
    const whole = hundredths / 100n;
    const frac = (hundredths % 100n).toString().padStart(2, "0").replace(/0$/, "");
    return `₹${whole}${frac ? "." + frac : ""} Cr`;
  }
  if (r >= LAKH) {
    const tenths = (r * 10n) / LAKH;
    const whole = tenths / 10n;
    const frac = tenths % 10n;
    return `₹${whole}${frac ? "." + frac : ""} L`;
  }
  return `₹${r.toLocaleString("en-IN")}`;
}

/** ₹1,00,000 — every digit, Indian grouping, for a sum someone is about to pay. */
export const rupeesFull = (minor: bigint): string => `₹${(minor / FACTOR).toLocaleString("en-IN")}`;

export const vehicleOf = (key: string | null): Vehicle | undefined =>
  key ? VEHICLES.find((v) => v.key === key) : undefined;

export interface Reading {
  readonly vehicle: Vehicle;
  readonly stance: ReturnType<typeof stanceFor>;
  readonly publishable: boolean;
  readonly unitsTotal: number;
  readonly promoterUnits: number;
  readonly status: string;
  readonly price: readonly [string, string];
  readonly tokens: Readonly<Record<string, string>>;
  readonly details: readonly (readonly [string, string, number?, Prov?])[];
  readonly prov: ReturnType<typeof provFor>;
}

export function read(v: Vehicle): Reading {
  const o = v.offering;
  const stance = stanceFor(v);
  const ok = publishable(v).ok;
  const unitsTotal = o.unitPrice > 0n ? Number(o.totalEquity / o.unitPrice) : o.units;
  const promoterUnits = o.unitPrice > 0n ? Number(o.promoter / o.unitPrice) : 0;
  const full = o.available <= 0 && o.subscribed > 0;
  const status = full ? "FULLY SUBSCRIBED" : v.lifecycle === "raising" ? "RAISING" : v.lifecycle === "forming" ? "PIPELINE" : v.lifecycle.toUpperCase();
  const price: readonly [string, string] = v.lifecycle === "forming"
    ? ["In the pipeline", "not yet open for subscription"]
    : !ok
    ? ["Offering not yet published", "the record is still being settled"]
    : full
      ? [`Fully subscribed · ${o.subscribed} of ${o.units} units offered`, `${rupees(o.unitPrice)} a unit · waitlist open`]
      : [`${o.available} of ${o.units} units available`, `${rupees(o.unitPrice)} a unit`];
  const offer = ok
    ? `${o.units} units are offered to partners at ${rupees(o.unitPrice)} each, ${rupees(o.offered)} in all; ` +
      `the sponsor holds ${rupees(o.promoter)} of the ${rupees(o.totalEquity)} equity. ` +
      `${o.available ? `${o.available} remain available.` : "All are subscribed."}`
    : "The offering is not yet published: the record it would be priced from is still being settled.";
  const tokens = {
    vehicle: v.registeredName,
    LAND: v.landArea.toUpperCase(),
    KEYS: String(v.keys),
    OFFER: offer,
  };
  const P = provFor(v);
  const details: (readonly [string, string, number?, Prov?])[] = [
    ["Held by", v.registeredName + (v.llpin ? ` · LLPIN ${v.llpin}` : ""), undefined, P.intake],
    ["Place", v.jurisdiction, undefined, P.intake],
    ["Coordinates", v.coordinates ? `<span class="mono">${v.coordinates}</span>` : "Not yet recorded", v.coordinates ? undefined : 1],
    ["Land", v.landArea, undefined, P.intake],
    ["Keys", String(v.keys), undefined, P.intake],
  ];
  if (ok) {
    details.push(
      ["Units offered", `${o.units} at ${rupees(o.unitPrice)} · ${o.subscribed} subscribed`, undefined, P.intake],
      ["Equity", `${rupees(o.totalEquity)} · sponsor ${rupees(o.promoter)}`, undefined, P.intake],
      ["Bank facility", rupees(v.stack.facility), undefined, P.intake],
      ["Project cost", rupees(v.stack.projectTotal), undefined, P.intake],
      ["Lock-in", o.lockIn, undefined, P.intake],
    );
  } else {
    details.push(["Offering", "Not yet published", 1]);
  }
  return { vehicle: v, stance, publishable: ok, unitsTotal, promoterUnits, status, price, tokens, details, prov: P };
}

/** The first vehicle still taking capital, for the home page's pack. */
export const openReading = (): Reading | undefined => {
  const v = VEHICLES.find((x) => stanceFor(x).kind === "open");
  return v ? read(v) : undefined;
};
