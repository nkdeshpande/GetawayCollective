/**
 * THE HOME AND THE COLLECTION — the two pages the prototype wrote by hand
 *
 * Ported 24 Sep 2026 from _DESIGN/gc/GC-Site.html, which stays the visual
 * reference and is not edited from here. Markup, because these two pages
 * are compositions rather than instances of a template; colours are
 * {ink:key}, links are routes, and the register's facts are {{TOKENS}}
 * filled by app/_assemblies/site/pages.tsx.
 */

/** The collection, in the order the prototype shows it. Price lines come from the register. */
export interface CollectionEstate {
  readonly name: string; readonly line: string; readonly spec: string;
  readonly region: "coast" | "hills" | "coffee"; readonly stage: "open" | "pipe";
  readonly pal: string; readonly hour: number; readonly href: string;
  /** The register's key, where the estate is a vehicle. */
  readonly vehicleKey: string | null;
  /** What to say when the register has no price to give. */
  readonly fallback: string;
}

export const COLLECTION: readonly CollectionEstate[] = [
  { name: "Solace", line: "A SlowSpace estate · Chikkaballapura", spec: "6 keys · 0.6 acre", region: "hills", stage: "open", pal: "solace", hour: 6.6, href: "/collection/slowspace-solace", vehicleKey: "solace", fallback: "" },
  { name: "Coffee Fields Forever", line: "An ESKAPE estate · Suntikoppa, Kodagu", spec: "20 keys · 3.0 acres", region: "coffee", stage: "open", pal: "cff", hour: 16.5, href: "/collection/coffee-fields-forever", vehicleKey: null, fallback: "Not yet a vehicle on this platform <span>· the offering letter will state the price</span>" },
  { name: "SlowSpace Creek", line: "A SlowSpace estate · Cherala, Kodagu", spec: "20 keys · five clusters · one bridge", region: "coffee", stage: "open", pal: "creek", hour: 13, href: "/collection/coorg-coffee-creek", vehicleKey: "coorgcreek", fallback: "" },
  { name: "Seaside Confluence", line: "A SlowSpace estate · Padubidri, Udupi", spec: "12 keys · one steel building", region: "coast", stage: "open", pal: "coast", hour: 18.6, href: "/collection/slowspace-coastal", vehicleKey: "slowspace", fallback: "" },
  { name: "Nine Hills", line: "A SlowSpace estate · Sakleshpur hills", spec: "12–20 keys · 5 acres", region: "hills", stage: "pipe", pal: "nine", hour: 9, href: "/collection/nine-hills", vehicleKey: null, fallback: "Pipeline <span>· not yet offered</span>" },
  { name: "Wildwood", line: "A SlowSpace estate · Aranthodu", spec: "12 keys · 12 acres", region: "hills", stage: "pipe", pal: "wild", hour: 19, href: "/collection/wildwood", vehicleKey: "wildwood", fallback: "" },
  { name: "Tidal Club", line: "An ESKAPE estate · Yermal, Udupi coast", spec: "40 keys · 16 villas and the Club", region: "coast", stage: "pipe", pal: "coast", hour: 7, href: "/collection/tidal-club", vehicleKey: null, fallback: "Pipeline <span>· not yet offered</span>" },
];

/** The four estates the home page scrolls through, each with its register key. */
export const HOME_STACK: readonly { readonly name: string; readonly line: string; readonly pal: string; readonly hour: number; readonly rain?: boolean; readonly href: string; readonly cta: string; readonly vehicleKey: string | null; readonly chip: string }[] = [
  { name: "Solace", line: "Located in Chikkaballapura, Karnataka | A SlowSpace estate", pal: "solace", hour: 6.6, href: "/collection/slowspace-solace", cta: "Discover Solace", vehicleKey: "solace", chip: "THE REFERENCE VEHICLE" },
  { name: "Coffee Fields", line: "Located in Suntikoppa, Kodagu | An ESKAPE estate", pal: "cff", hour: 16.5, href: "/collection/coffee-fields-forever", cta: "Discover Coffee Fields", vehicleKey: null, chip: "IN DELIVERY" },
  { name: "Creek", line: "Located in Cherala, Kodagu | A SlowSpace estate", pal: "creek", hour: 13, rain: true, href: "/collection/coorg-coffee-creek", cta: "Discover Creek", vehicleKey: "coorgcreek", chip: "THE RIVERINE FLAGSHIP" },
  { name: "Confluence", line: "Located in Padubidri, Udupi | A SlowSpace estate", pal: "coast", hour: 18.6, href: "/collection/slowspace-coastal", cta: "Discover Confluence", vehicleKey: "slowspace", chip: "WAITLIST OPEN" },
];

/** The three Journal entries the home page leads with, by slug. */
export const HOME_JOURNAL: readonly { readonly slug: string; readonly pal: string; readonly hour: number; readonly bp?: boolean }[] = [
  { slug: "houses-that-get-better-when-it-rains", pal: "solace", hour: 21 },
  { slug: "the-waterfall-read-from-the-bottom", pal: "cff", hour: 12, bp: true },
  { slug: "the-night-is-not-the-product", pal: "coast", hour: 10 },
];

export const MANIFESTO =
  "Modern luxury is the absence of noise. We build small places to one standard, hold each one in its own partnership, and govern it for the people who own it. We hold none of it ourselves.";

/** The three chassis, drawn. */
export const TRIO = [
  { name: "Ridge", sub: "38 m² + courtyard", svg: '<path d="M20 170H180" stroke="{ink:stone}"/><path d="M40 170V110H160V170" fill="{ink:moss}" fill-opacity=".25" stroke="{ink:bone}"/><path d="M40 110V96H160V110" fill="none" stroke="{ink:bone}"/><path d="M160 150H185V170" fill="none" stroke="{ink:stone2}" stroke-dasharray="3 3"/>' },
  { name: "Expanse", sub: "36 m² + deck · +3.8 m", svg: '<path d="M20 170H180" stroke="{ink:stone}"/><path d="M50 170V120H150V170" fill="none" stroke="{ink:stone2}"/><path d="M30 120V70H170V120" fill="{ink:slate}" fill-opacity=".3" stroke="{ink:bone}"/><path d="M170 106H190" stroke="{ink:bone}"/><text x="176" y="100" fill="{ink:stone2}" font-size="9" font-family="Space Mono">+3.8</text>' },
  { name: "Voyager", sub: "52 m² + porch", svg: '<path d="M20 170H180" stroke="{ink:stone}"/><path d="M40 170V100L100 40L160 100V170" fill="{ink:ember}" fill-opacity=".25" stroke="{ink:bone}"/><path d="M100 40V170" stroke="{ink:stone}" stroke-dasharray="3 4"/><text x="104" y="104" fill="{ink:stone2}" font-size="9" font-family="Space Mono">5.5 m void</text>' },
] as const;

export const NEXT_ESTATES = [
  { name: "Nine Hills", line: "Located in the Sakleshpur hills, Malnad | 5 acres · 12–20 keys · pipeline", pal: "nine", hour: 9, href: "/collection/nine-hills" },
  { name: "Wildwood", line: "Located at Aranthodu, Dakshina Kannada | 12 acres, the largest holding · pipeline", pal: "wild", hour: 19, href: "/collection/wildwood" },
  { name: "Tidal Club", line: "Located at Yermal, Udupi coast | 16 villas and the Club · pipeline", pal: "coast", hour: 7, href: "/collection/tidal-club" },
] as const;

/** Every estate page closes on these, then its own. */
export const FAQ: readonly (readonly [string, string, string])[] = [
  ["Is this a timeshare?", "No. A timeshare sells time. You hold units in the LLP that owns the estate, and time follows the position; it is never the product.", "L1-02 · public.ts 184"],
  ["Do I really own the property?", "You own a position in the LLP, and the LLP holds the title. Getaway Collective holds no equity in it; that clause can only change by a unanimous resolution.", "legal.ts 132–154"],
  ["What is a unit?", "A share of the estate's LLP, priced in its offering letter. A partner holds from one unit upward, to the ceiling the vehicle sets.", "constants/vehicles.ts"],
  ["How many nights come with a unit?", "Nights follow your share of the equity. The exact allocation rule is not yet decided, and each offering letter will state it. Until then, this page does not.", "DECISIONS.md D-08"],
  ["What does it cost to hold, year to year?", "Costs flow through a six-stage waterfall that closes to 10,000 basis points: the operator, brand and digital, a 2.5% admin reserve, a 2.5% sinking fund, debt service, then partners. There is no preferred return, no catch-up and no carry.", "L1-16 28–57"],
  ["Who maintains the estate?", "Sensory Getaways, the operating partner, under a Commercial Services Agreement measured on service levels. The sinking fund, stage four, pays for long-term renewal.", "L1-01 56"],
  ["Can partners change the buildings or interiors?", "Decisions about the estate are made by the partners, with votes weighted by equity, through resolutions recorded in the register.", "AGENTS.md 115"],
  ["How are disagreements between partners settled?", "Through the process the LLP agreement sets, administered by the Governance Office. The register is append-only, so every decision stays on record.", "admins.ts · Rule 11"],
  ["Can I sell my units?", "There is no public market for units. Partners can post interest on the internal register, which is a noticeboard; nothing guarantees a buyer.", "public.ts 330–333"],
  ["Can I let the estate out to others?", "The LLP agreement governs this. It is not stated here, and it will not be stated until it is in the agreement.", "—"],
  ["Is my capital at risk?", "Yes. Capital is at risk, and no return is guaranteed by anyone. Read the <a class=\"tx-u\" href=\"/legal/risk-disclosure\">Risk Factors</a> before committing.", "legal.ts 85–95"],
];
