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

export const PROPERTIES: readonly Property[] = [
  {
    ufr0060: "Kyoto House", assetId: "KYO-01", ufr0063: "Kyoto, Japan",
    ufr0102: 124000000_0000n,
    ufr0103: "Independent appraisal · Nomura Real Estate",
    ufr0101: "2026-06-30", ufr0061: "Coastal Collection SPV I",
    ufr0065: "110 m²", ufr0066: "Stabilised", ufr0067: "2025-11-14",
    ufr0068: "Machiya restoration · timber reuse 78%",
    yield: { v: 8.4, conf: "INFERRED" }, availability: "Q3 2026",
    telemetry: { state: "live", at: "2026-07-31 09:12" },
    units: 12, held: 1, hue: 158,
  },
  /*
   * THE ONE REAL ONE.
   *
   * Replaces an invented "Swiss Vault" that claimed an independent
   * Swiss appraisal and a 2024 stabilisation date, neither of which
   * existed. Every value below belongs to the vehicle modelled end to
   * end in slowspace.ts.
   *
   * WHY THE FIGURES ARE TYPED HERE RATHER THAN IMPORTED.
   * slowspace.ts imports inr/rate/allocate FROM THIS FILE, so importing
   * it back would be a cycle — the class of defect that resolves to
   * `undefined` at module-eval and takes an afternoon to find. Instead
   * slowspace.ts, which already depends on this file, CHECKS these
   * values against its own canon at load and throws if they drift.
   * Derive where you can; where a cycle prevents it, check rather than
   * duplicate silently.
   */
  {
    ufr0060: "SlowSpace Coastal", assetId: "PDB-01", ufr0063: "Padubidri, Karnataka",
    /* Project cost, NOT a valuation. Nothing is built, so no appraiser
       has seen it, and the source says exactly that. */
    ufr0102: 95000000_0000n,
    ufr0103: "Project cost — no appraisal exists at pre-construction",
    ufr0101: "2026-06-19", ufr0061: "SlowSpace Coastal LLP",
    ufr0065: "1.42 acres · dual frontage", ufr0066: "Pre-construction", ufr0067: null,
    ufr0068: "CRZ compliant · Blue Flag adjacent · modular assembly",
    yield: { v: 18, conf: "INFERRED" }, availability: "45% remaining",
    /* No feed: there is nothing built to instrument. Saying "stale"
       would imply one existed and stopped. */
    telemetry: { state: "stale", at: "no feed — pre-construction" },
    units: 20, held: 11, hue: 198,
    /* The only property with a fully built destination, so the card
       navigates instead of merely disclosing. */
    to: "/flow",
  },
  {
    ufr0060: "Oslo Base", assetId: "NOR-03", ufr0063: "Vestland, Norway",
    ufr0102: 98200000_0000n,
    /* A weaker source, and it SAYS so — the prototype rendered every
       valuation identically regardless of who produced it. */
    ufr0103: "Management estimate",
    ufr0101: "2026-07-15", ufr0061: "Nordic Collection SPV I",
    ufr0065: "140 m²", ufr0066: "Lease-up", ufr0067: null,
    ufr0068: "Mass timber · district heat",
    yield: { v: 9.7, conf: "REPORTED" }, availability: "Q1 2027",
    telemetry: { state: "live", at: "2026-07-31 09:08" },
    units: 12, held: 0, hue: 24,
  },
];

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
