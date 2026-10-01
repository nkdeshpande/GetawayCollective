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

import { VEHICLES, BUILD_LABEL, stanceFor, publishable, type Vehicle } from "@/constants/vehicles";
import { COLLECTION } from "@/content/site/home";

/**
 * ONE NAME FOR ONE ESTATE — 28 Sep 2026
 *
 * The site said Creek, SlowSpace Creek and Coorg Coffee Creek for one
 * estate, and Confluence, Seaside Confluence and SlowSpace Coastal for
 * another. The public name is the collection's, which is the canon's
 * (_CANON/facts/properties.yaml); the register's propertyName is the LLP
 * intake's own label and is never printed as the estate's name. The legal
 * entity is named separately, as the entity. tests/estate-record.test.ts
 * holds every other surface to this.
 */
export const publicName = (v: Vehicle): string =>
  COLLECTION.find((c) => c.vehicleKey === v.key)?.name.replace(/<[^>]+>/g, "") ?? v.propertyName;

/**
 * FUNDING COMPLETE — founder ruling, 28 Sep 2026
 *
 * Where the collection marks an estate's funding complete, the site says
 * "Funding complete" and shows no units, equity, price or waitlist for it.
 * Read from the collection because Coffee Fields Forever has no register
 * record to carry the fact.
 */
export const fundingComplete = (slug: string): boolean =>
  COLLECTION.some((c) => c.funding === "complete" && c.href === `/collection/${slug}`);

/**
 * The bank loan, said as it stands. A loan that is applied for is called
 * that on every surface; nobody is told it is in place before a sanction
 * letter says so (constants/vehicles.ts, CapitalStack.facilityStatus).
 */
export const loanLine = (v: Vehicle): string => {
  const s = v.stack;
  return rupees(s.facility) + (s.facilityLimit ? ` of a ${rupees(s.facilityLimit)} limit` : "") +
    (s.facilityStatus === "applied-for" ? " · applied for, not sanctioned" : "");
};
const loanRow = (v: Vehicle, p: Prov): readonly [string, string, number?, Prov?] =>
  [v.stack.facilityStatus === "applied-for" ? "Bank loan" : "Bank facility", loanLine(v), undefined, p];

/** Who holds the estate, or will: an LLP not yet incorporated does not hold anything yet. */
export const heldBy = (v: Vehicle): { label: string; value: string } =>
  v.llpin
    ? { label: "Held by", value: v.registeredName }
    : { label: "To be held by", value: `${v.registeredName}, not yet incorporated` };
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
  const intake = v.key === "wildwood" ? "The LLP intake, 11 Aug 2026, with the founder's structure of 20 Sep 2026"
    : v.key === "coorgcreek" ? "The estate's capital structure and cost plan of 2 Oct 2026, as proposed; the term sheets are a draft for counsel"
    : "The vehicle's LLP intake sheet, 4 Aug 2026";
  return {
    intake: [intake, "REPORTED"] as Prov,
    deposit: ["Founder ruling, 24 Sep 2026: one flat holding deposit at every open estate", "REPORTED"] as Prov,
    ruling: ["Founder ruling, 28 Sep 2026: funding for this estate is complete", "REPORTED"] as Prov,
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
  /** The public name (see publicName). */
  readonly name: string;
  /** Whether units can be had: two different questions from delivery, answered separately. */
  readonly availability: string;
  /** Where the building stands. "Fully subscribed" and "Under construction" can both be true. */
  readonly delivery: string;
  /** The next step this estate's state allows: [label, href]. */
  readonly action: readonly [string, string];
  /** Funding complete (fundingComplete): nothing about the offering is shown. */
  readonly complete: boolean;
}

export function read(v: Vehicle): Reading {
  const o = v.offering;
  const stance = stanceFor(v);
  const ok = publishable(v).ok;
  const unitsTotal = o.unitPrice > 0n ? Number(o.totalEquity / o.unitPrice) : o.units;
  const promoterUnits = o.unitPrice > 0n ? Number(o.promoter / o.unitPrice) : 0;
  const full = o.available <= 0 && o.subscribed > 0;
  const complete = fundingComplete(v.slug);
  const status = complete ? "FUNDING COMPLETE" : full ? "FULLY SUBSCRIBED" : v.lifecycle === "raising" ? "RAISING" : v.lifecycle === "forming" ? "PIPELINE" : v.lifecycle.toUpperCase();
  const price: readonly [string, string] = complete
    ? ["Funding complete", BUILD_LABEL[v.buildStage].toLowerCase()]
    : v.lifecycle === "forming"
    ? ["In the pipeline", "not yet open for subscription"]
    : !ok
    ? ["Offering not yet published", "its figures are still being confirmed"]
    : full
      ? [`Fully subscribed · ${o.subscribed} of ${o.units} units offered`, `${rupees(o.unitPrice)} a unit · waitlist open`]
      : [`${o.available} of ${o.units} units available`, `${rupees(o.unitPrice)} a unit`];
  /* A lock-in is a period ("36 months from…"); where the record states none, the sentence says so. */
  const locked = /^\d/.test(o.lockIn);
  const offer = complete
    ? "Funding for this estate is complete."
    : ok
    ? `${o.units} units are offered to partners at ${rupees(o.unitPrice)} each, ${rupees(o.offered)} in all; ` +
      `the sponsor holds ${rupees(o.promoter)} of the ${rupees(o.totalEquity)} equity${o.promoterIs ? `, as ${o.promoterIs}` : ""}. ` +
      `${o.available ? `${o.available} remain available.` : "All are subscribed."}` +
      (o.deposit !== null ? ` A position is held online with a ${rupeesFull(o.deposit)} deposit, refundable in full until the Vehicle Agreement is signed.` : "") +
      (locked ? ` Units are then locked in for ${o.lockIn}.` : " The transfer terms are not yet set; the LLP agreement will state them.") +
      " The offering letter governs every figure."
    : "The offering is not yet published: its figures are still being confirmed, and none is estimated in the meantime.";
  const tokens = {
    vehicle: v.registeredName,
    LAND: v.landArea,
    KEYS: String(v.keys),
    OFFER: offer,
  };
  const P = provFor(v);
  const held = heldBy(v);
  const details: (readonly [string, string, number?, Prov?])[] = [
    [held.label, held.value + (v.llpin ? ` · LLPIN ${v.llpin}` : ""), undefined, P.intake],
    ["Place", v.jurisdiction, undefined, P.intake],
    ["Coordinates", v.coordinates ? `<span class="mono">${v.coordinates}</span>` : "Not yet recorded", v.coordinates ? undefined : 1],
    ["Land", v.landArea, undefined, P.intake],
    ["Keys", String(v.keys), undefined, P.intake],
  ];
  if (complete) {
    details.push(["Funding", "Complete", undefined, P.ruling]);
  } else if (ok) {
    details.push(
      ["Units offered", `${o.units} at ${rupees(o.unitPrice)} · ${o.subscribed} subscribed`, undefined, P.intake],
      ["Equity", `${rupees(o.totalEquity)} · sponsor ${rupees(o.promoter)}${o.promoterIs ? ", land in kind" : ""}`, undefined, P.intake],
      loanRow(v, P.intake),
      ["Project cost", rupees(v.stack.projectTotal), undefined, P.intake],
      ["Lock-in", o.lockIn, undefined, P.intake],
    );
  } else {
    details.push(["Offering", "Not yet published", 1]);
  }
  const availability = complete ? "Funding complete"
    : v.lifecycle === "forming" ? "Not yet offered"
    : full ? "Fully subscribed"
    : ok && o.available > 0 ? `${o.available} of ${o.units} units available`
    : "Offering not yet published";
  const delivery = v.lifecycle === "forming" ? "Pipeline" : v.lifecycle === "live" ? "Operating" : BUILD_LABEL[v.buildStage];
  /* The brief's table: raising → the offering; subscribed with a waitlist →
     the waitlist; in delivery with nothing open → its progress; pipeline →
     the concept. */
  const action: readonly [string, string] = complete ? ["View estate progress", `/collection/${v.slug}`]
    : v.lifecycle === "forming" ? ["Explore the concept", `/collection/${v.slug}`]
    : ok && o.available > 0 && v.lifecycle === "raising" ? ["Explore the offering", `/collection/${v.slug}/investment`]
    : full && stance.kind === "waitlist" ? ["Join the waitlist", `/collection/${v.slug}/enquire`]
    : ["View estate progress", `/collection/${v.slug}`];
  return { vehicle: v, stance, publishable: ok, unitsTotal, promoterUnits, status, price, tokens, details, prov: P,
    name: publicName(v), availability, delivery, action, complete };
}

/**
 * A unit, estate by estate. The generic "one unit is 5%, twenty make the
 * whole" was Seaside Confluence's own ladder stated as if it were every
 * estate's; SlowSpace Creek's unit is 10% of ten. Read per estate instead.
 */
export function unitsByEstate(): readonly { name: string; share: string; units: number; ceiling: number | null; price: string }[] {
  return VEHICLES.filter((v) => publishable(v).ok && v.offering.unitPrice > 0n && v.offering.totalEquity > 0n).map((v) => {
    const o = v.offering;
    const shareBps = Number((o.unitPrice * 10000n) / o.totalEquity);
    return {
      name: publicName(v),
      share: `${(shareBps / 100).toFixed(shareBps % 100 ? 1 : 0)}%`,
      units: Number(o.totalEquity / o.unitPrice),
      ceiling: v.ladder.ceilingBps > 0 && shareBps > 0 ? Math.floor(v.ladder.ceilingBps / shareBps) : null,
      price: rupees(o.unitPrice),
    };
  });
}

/** The first vehicle still taking capital, for the home page's pack. */
export const openReading = (): Reading | undefined => {
  const v = VEHICLES.find((x) => stanceFor(x).kind === "open");
  return v ? read(v) : undefined;
};
