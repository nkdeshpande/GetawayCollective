/**
 * ASSEMBLY DATA — the one Property record, and the money that formats it
 *
 * Wave 7 · Workspaces
 *
 * Lifted from GC-ASSEMBLIES.html unchanged in substance. There is exactly
 * ONE record per object here, and every screen reads from it — which is
 * the whole claim of the aperture system, and the reason the prototypes
 * ended up with four different valuations for one house.
 */

export const SCALE = 4n;
const FACTOR = 10n ** SCALE;

/**
 * Indian digit grouping. Money is a bigint in minor units scaled 10^4,
 * never a float, and never rendered without its currency mark.
 */
export function inr(minor: bigint, opts: { paise?: boolean } = {}): string {
  const neg = minor < 0n;
  const n = neg ? -minor : minor;
  const whole = n / FACTOR;
  const frac = n % FACTOR;

  let s = whole.toString();
  if (s.length > 3) {
    const last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    const out: string[] = [];
    while (rest.length > 2) {
      out.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) out.unshift(rest);
    s = out.join(",") + "," + last3;
  }

  let str = "₹" + s;
  if (opts.paise) str += "." + frac.toString().padStart(4, "0").slice(0, 2);
  return (neg ? "−" : "") + str;
}

export const rate = (minor: bigint, basisPoints: number): bigint =>
  (minor * BigInt(basisPoints)) / 10000n;

/**
 * A ratio of two money amounts, to two decimals, rounded half away from
 * zero. Bigint until the last step.
 *
 * The obvious spelling — Number((a * 100n) / b) / 100 — TRUNCATES,
 * because bigint division does. A cover ratio of 1.9496 came out as 1.94
 * while the comment three lines above it said 1.95, and the test that
 * guarded the figure used toBeCloseTo(1.95, 1), a tolerance of ±0.05,
 * which cannot tell the two apart.
 *
 * Understating a cover ratio is the safe direction, which is exactly why
 * it survived: nobody looking at 1.94 would think it wrong. The next
 * figure to use the same spelling might not be one where truncation is
 * conservative.
 */
export function decimalRatio(numerator: bigint, denominator: bigint): number {
  if (denominator === 0n) throw new Error("decimalRatio: denominator is zero");
  const tenths = (numerator * 1000n) / denominator;      // one guard digit
  const half = tenths >= 0n ? 5n : -5n;
  return Number((tenths + half) / 10n) / 100;
}

/**
 * Largest-remainder allocation, so a split sums EXACTLY to the total.
 *
 * The prototype stated a fraction price separately at ₹1,03,33,333 beside
 * a ₹12,40,00,000 valuation; twelve of those is four rupees short.
 */
export function allocate(total: bigint, weights: bigint[]): bigint[] {
  const sum = weights.reduce((a, b) => a + b, 0n);
  if (sum === 0n) return weights.map(() => 0n);
  const base = weights.map((w) => (total * w) / sum);
  let rem = total - base.reduce((a, b) => a + b, 0n);
  const order = weights
    .map((w, i) => ({ i, r: (total * w) % sum }))
    .sort((a, b) => (a.r < b.r ? 1 : a.r > b.r ? -1 : 0));
  for (let k = 0; rem > 0n; k++, rem--) base[order[k % order.length].i] += 1n;
  return base;
}

/**
 * Re-exported, not redeclared.
 *
 * This file used to hold its own copy of the six classes, identical to the
 * one in lib/provenance.ts and to a third in content/legal.ts. Three
 * copies of a constitutional type are three chances to disagree, and they
 * disagreed the moment v5 changed the axis. One definition now, in
 * constants/taxonomies.ts, read through the domain layer.
 */
export type { Confidence } from "@/lib/provenance";
import { VEHICLES, publishable, waterfallState } from "../../constants/vehicles";
import { estateOf } from "../../constants/spatial";
import type { Confidence } from "@/lib/provenance";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  VERIFIED: "Verified",
  CORROBORATED: "Corroborated",
  REPORTED: "Reported",
  INFERRED: "Inferred",
  FORECAST: "Forecast",
  UNKNOWN: "Unknown",
};

/**
 * A provisional figure carries the mark. Trust it the same amount.
 *
 * Everything weaker than CORROBORATED. REPORTED is included deliberately:
 * a management assertion is exactly the figure a reader would otherwise
 * mistake for an independent one.
 */
export const PROVISIONAL = new Set<Confidence>([
  "REPORTED", "INFERRED", "FORECAST", "UNKNOWN",
]);

export interface Property {
  ufr0060: string;   // property_name
  assetId: string;
  ufr0063: string;   // jurisdiction
  ufr0102: bigint;   // valuation
  ufr0103: string;   // valuation source
  ufr0101: string;   // valued on
  ufr0061: string;   // vehicle
  ufr0065: string;   // land area
  ufr0066: string;   // lifecycle
  ufr0067: string | null;
  ufr0068: string;   // commitments
  yield: { v: number; conf: Confidence };
  /**
   * What the yield IS, in words, beside the number.
   *
   * PUBLIC.02: a percentage is the most portable thing on a page. This
   * travels with it so "~18.0%" cannot be read as a return, a share of
   * gross or an ownership stake by three different people.
   */
  yieldBasis: string | null;
  availability: string;
  telemetry: { state: "live" | "stale"; at: string };
  units: number;
  held: number;
  hue: number;
  /**
   * Where the card goes. Present only where a destination is genuinely
   * built — a card that navigates to a thinner page than the one it
   * left is worse than a card that discloses in place.
   */
  to?: string;
}

/**
 * The Collection — derived from constants/vehicles.ts, not typed here.
 *
 * ── WHAT CHANGED, AND WHY IT MATTERS ─────────────────────────────────
 * This list used to hold Kyoto House and Oslo Base beside SlowSpace.
 * Both were invented for the prototype, and both carried the furniture of
 * a real asset: an appraiser's name, a valuation date, a yield with a
 * confidence class. Swiss Vault had already been removed for exactly that
 * reason and two of the same kind were left standing.
 *
 * They are replaced by the two real vehicles from the intake. Nothing on
 * this list is now imaginary.
 *
 * ── DERIVED, SO IT CANNOT DRIFT ──────────────────────────────────────
 * The previous entries were typed by hand, which is how data.ts and
 * slowspace.ts came to disagree about how many units SlowSpace has
 * (C-06). These are folded out of the registry, so there is one place a
 * vehicle's facts live and this is not it.
 *
 * The one thing NOT derived is the valuation: a project cost and an
 * appraised value are different claims, and only the registry's own
 * source string can say which one a number is.
 */
/**
 * The intake's lifecycle words, in the platform's own vocabulary.
 *
 * Declared ABOVE the map that reads it. `const` is not hoisted, so with
 * this below PROPERTIES the module threw at evaluation — the class of
 * defect that only appears once something imports the file for real.
 */
const LIFECYCLE_LABEL: Record<string, string> = {
  "pre-construction": "Pre-construction",
  "under-construction": "Under construction",
  stabilised: "Stabilised",
};

export const PROPERTIES: readonly Property[] = VEHICLES.map((v): Property => {
  /* A vehicle with no waterfall cannot state a yield, and a placeholder
     yield on a card is the invented figure this replacement removed. */
  const yieldOf = (): { v: number; conf: Confidence } => {
    /* A COMPLETE waterfall, not merely a present one. Solace states four
       of six stages and the partner share is one of the two missing, so
       there is nothing to compute a yield from — and a partial waterfall
       is exactly the case where a plausible number would slip through. */
    const wf = waterfallState(v.operating.waterfall);
    if (wf.state !== "complete" || v.operating.waterfall?.toPartners == null) {
      return { v: 0, conf: "UNKNOWN" };
    }
    const toPartners = (v.operating.grossRevenue * BigInt(v.operating.waterfall.toPartners)) / 10000n;
    const bps = Number((toPartners * 10000n) / v.offering.totalEquity);
    return {
      v: Math.round(bps) / 100,
      /* FORECAST, not INFERRED. The intake calls these "modelled" and
         "estimated"; both are a future value from a model on an asset
         that does not exist yet. INFERRED would say it was derived from
         something observed, and nothing here has been observed. */
      conf: "FORECAST",
    };
  };

  const gate = publishable(v);
  /* The ground, where the spatial ledger and the vehicle have been
     joined. Two of the three are joined; the estate is undefined for the
     one that is not, and every use below tolerates that. */
  const estate = estateOf(v.key);

  return {
    ufr0060: v.propertyName,
    assetId: v.assetCode,
    /* The intake's district, widened to the ledger's region where the two
       estates are joined. "Padubidri, Karnataka" is where the site is;
       "Mangaluru–Udupi" is the coastline it sits on, and the second is
       the one somebody works out the drive from. */
    ufr0063: estate ? `${v.jurisdiction} · ${estate.region}` : v.jurisdiction,
    /* Project cost, NOT a valuation. Nothing is built on any of the three,
       so no appraiser has seen any of them, and the source says so. */
    ufr0102: v.stack.projectTotal,
    ufr0103: "Project cost — no appraisal exists at pre-construction",
    ufr0101: v.agreementDated ?? v.incorporated ?? "not incorporated",
    ufr0061: v.registeredName,
    ufr0065: v.landArea,
    ufr0066: LIFECYCLE_LABEL[v.buildStage],
    ufr0067: null,
    /* What is committed on this ground, and what is built on it. The
       ledger's ecological character is the more useful half for a reader
       and the intake's commitments are the more consequential, so both
       run — the character first, because it says what the place is. */
    ufr0068: estate
      ? `${estate.ecology} · ${estate.keys} keys · ${v.commitments}`
      : v.commitments,
    yield: yieldOf(),
    yieldBasis: v.operating.yieldBasis,
    /* Units, not a season. "Q3 2026" on the old entries implied a date
       somebody had committed to. */
    availability: v.offering.available === 0
      ? "Fully subscribed"
      : `${v.offering.available} of ${v.offering.units} units available`,
    /* None of the three is built, so none is instrumented. Saying "stale"
       would imply a feed existed and stopped. */
    telemetry: { state: "stale", at: "no feed — pre-construction" },
    units: v.offering.units,
    held: v.offering.subscribed,
    hue: v.hue,
    /* A card only navigates where the destination is real AND the vehicle
       clears its conflicts. Two of the three do not, so their cards
       disclose in place rather than opening an offering that carries a
       figure nobody has settled. */
    to: gate.ok ? `/collection/${v.slug}` : undefined,
  };
});


export const propertyBySlug = (slug: string): Property | undefined =>
  PROPERTIES.find((p) => toSlug(p.ufr0060) === slug || p.assetId.toLowerCase() === slug.toLowerCase());

export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const fractionPrice = (p: Property): bigint =>
  allocate(p.ufr0102, Array(p.units).fill(1n))[0];

/**
 * The six-stage waterfall. It must account for ALL of gross revenue —
 * revenue going somewhere the waterfall does not name is the same defect
 * as omitting a stage, only harder to see.
 */
export const GROSS = 4000000_0000n;

export const WATERFALL = [
  { k: "Gross revenue", bps: 10000, cls: "",
    note: "Operating revenue for the period, before any claim." },
  { k: "1 · Operating Partner", bps: 3500, cls: "less",
    note: "Contracted operator. Measured on SLA." },
  { k: "2 · Brand", bps: 1000, cls: "less",
    note: "Brand & Digital Co. licence." },
  { k: "3 · Admin Reserve", bps: 250, cls: "less",
    note: "2.5% OF REVENUE — not a fee on asset value. A fee on asset value rewards holding assets at a high mark." },
  { k: "4 · Sinking Fund", bps: 250, cls: "less",
    note: "CapEx reserve. Funds replacement before failure." },
  { k: "5 · Debt Service", bps: 1200, cls: "senior",
    note: "THE SENIOR CLAIM. Absent entirely from the source prototype." },
  { k: "6 · To Partners", bps: 3800, cls: "out",
    note: "No preferred return, no catch-up, no carry. Blocked if the reserve would fall below its floor." },
] as const;

/* Checked here rather than assumed. */
{
  const bps = WATERFALL.slice(1).reduce((n, s) => n + s.bps, 0);
  const rupees = WATERFALL.slice(1).reduce((n, s) => n + rate(GROSS, s.bps), 0n);
  if (bps !== 10000 || rupees !== GROSS) {
    throw new Error(`Waterfall does not close: ${bps}bps, ${rupees} of ${GROSS}`);
  }
}

export const RESERVE = {
  held: 4820000_0000n,
  floor: 3960000_0000n,
  basis: "6 months non-operational fixed obligations",
};

/**
 * Testimonials. Regulated speech.
 *
 * SEBI's advertisement code bars testimonials in investment advisory
 * contexts, and a member's remark about what they earned is a performance
 * claim made by proxy. Every quote here is about the PLACE. None names a
 * figure, a yield or a return, and `assemblies.test.ts` checks it.
 */
export const VOICES = [
  { q: "The first morning I woke up before the alarm and then realised I had not set one.",
    who: "R. Menon", role: "Partner since 2024", on: "2026-03-11",
    basis: "Written consent · renewable annually" },
  { q: "Four hours from the office and the phone had nothing to say to me. That was the whole point and I did not expect it to work.",
    who: "A. D'Souza", role: "Partner since 2025", on: "2026-05-02",
    basis: "Written consent · renewable annually" },
  { q: "My daughter learned to identify six birds. I learned that the roof is made from the trees they cleared to build it.",
    who: "S. Kulkarni", role: "Partner since 2024", on: "2026-06-19",
    basis: "Written consent · renewable annually" },
] as const;

/** Placeholder imagery, derived from the forest token rather than picked. */
export const plate = (hue: number): React.CSSProperties => ({
  background:
    `linear-gradient(145deg, hsl(${hue} 34% 26%) 0%, hsl(${hue} 30% 13%) 55%, var(--gc-void) 100%)`,
});
