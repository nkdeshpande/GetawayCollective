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
  readonly details: readonly (readonly [string, string, number?])[];
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
  const details: (readonly [string, string, number?])[] = [
    ["Held by", v.registeredName + (v.llpin ? ` · LLPIN ${v.llpin}` : "")],
    ["Place", v.jurisdiction],
    ["Coordinates", v.coordinates ? `<span class="mono">${v.coordinates}</span>` : "Not yet recorded", v.coordinates ? undefined : 1],
    ["Land", v.landArea],
    ["Keys", String(v.keys)],
  ];
  if (ok) {
    details.push(
      ["Units offered", `${o.units} at ${rupees(o.unitPrice)} · ${o.subscribed} subscribed`],
      ["Equity", `${rupees(o.totalEquity)} · sponsor ${rupees(o.promoter)}`],
      ["Bank facility", rupees(v.stack.facility)],
      ["Project cost", rupees(v.stack.projectTotal)],
      ["Lock-in", o.lockIn],
    );
  } else {
    details.push(["Offering", "Not yet published", 1]);
  }
  return { vehicle: v, stance, publishable: ok, unitsTotal, promoterUnits, status, price, tokens, details };
}

/** The first vehicle still taking capital, for the home page's pack. */
export const openReading = (): Reading | undefined => {
  const v = VEHICLES.find((x) => stanceFor(x).kind === "open");
  return v ? read(v) : undefined;
};
