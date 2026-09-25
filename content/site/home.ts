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
  { name: "Coffee Fields Forever", line: "An ESKAPE estate · Suntikoppa, Kodagu", spec: "20 keys · 3.0 acres", region: "coffee", stage: "open", pal: "cff", hour: 16.5, href: "/collection/coffee-fields-forever", vehicleKey: null, fallback: "Not yet open for investment here <span>· its offering letter will set the price</span>" },
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
  ["Is this a timeshare?", "No. A timeshare sells you weeks of use and nothing else. Here you buy units in the limited liability partnership (LLP) that holds the estate, so you own part of the partnership that holds the land and buildings, vote on its decisions in proportion to your holding, and share in its distributions when there are any. Nights at the estate come with that share. They are a benefit of owning, not the thing you are buying, and they are not priced or sold separately.", "legal.ts A.2, F.1 · public.ts 184"],
  ["Do I really own the property?", "You own part of the partnership that holds it. Each estate sits in its own LLP; the LLP holds the estate, and its partners own the LLP in proportion to their units. Getaway Collective governs the partnership but holds no equity and no economic interest in it, and that rule is entrenched: it can change only by a unanimous vote of the partners. How each estate's land is held, whether owned, leased or still in title work, is stated on that estate's own page.", "legal.ts A.2, A.4"],
  ["What is a unit?", "A unit is a fixed share of one estate's LLP, sold at the price set in that estate's offering letter. Each estate sets its own unit size, its price and the most any one partner may hold, and its page shows how many units remain. The number of units you hold decides three things together: your share of distributions, the weight of your vote, and your share of the estate's nights once it is built.", "constants/vehicles.ts · legal.ts F.1, H.1"],
  ["How many nights come with a unit?", "Nights are shared in proportion to what each partner holds, and they begin at handover, once the estate is built; an unbuilt estate carries no nights. The exact number of nights per unit is still being decided and will be set in each estate's offering letter, so no figure is given here. Nights not used in a year do not carry forward and cannot be exchanged for money. When partners want the same dates, the one who has used the fewest nights that year goes first.", "legal.ts F.1–F.4 · DECISIONS.md D-08"],
  ["What does it cost to hold, year to year?", "An estate's running costs are paid from its own revenue, in six fixed stages, before anything reaches partners: the operating partner, brand and platform, an administration reserve (2.5%), a sinking fund for long-term renewal (2.5%), and repayments on any bank loan. Partners receive what remains. Each estate's page shows its own shares. There is no preferred return, no catch-up and no carried interest, so no one takes a performance share ahead of you. Any other charge would have to appear in the offering letter before you commit.", "legal.ts D.5, E.1 · L1-16 28–57"],
  ["Who maintains the estate?", "Sensory Getaways, the operating partner, runs and maintains each estate day to day under a Commercial Services Agreement with that estate's LLP. Its work is measured against agreed Service Levels, it is paid from the first stage of the waterfall, and its duties run to the partnership. Long-term renewal, as the buildings age, is paid for from the sinking fund: 2.5% of the estate's revenue set aside every year for exactly that.", "legal.ts A.3 · L1-01 56"],
  ["Can partners change the buildings or interiors?", "Yes, together, and never one partner alone. Changes to an estate are decided by resolution of the partners, in a vote weighted by how much each holds: an ordinary resolution needs more than 50% of the holdings voting, and a special resolution at least 76% of all holdings. Some decisions, such as selling the land or borrowing beyond the agreed limit, are reserved to the partners by the LLP agreement. Every resolution is kept on the partnership's permanent record.", "legal.ts H.1–H.2 · constants/vehicles.ts governance"],
  ["How are disagreements between partners settled?", "Most disagreements are settled by vote: decisions are resolutions of the partners, weighted by holding, and a tied vote fails rather than passing. Partners holding at least 20% can call a meeting, which must be held within 21 days. A dispute a vote cannot settle follows the dispute clause in the estate's LLP agreement, administered by the Governance Office. A complaint about the platform itself has its own three-stage route, set out in the <a class=\"tx-u\" href=\"/legal/disclosures\">Disclosures</a>.", "legal.ts H.2–H.3 · complaints B.1–B.3"],
  ["Can I sell my units?", "Yes, after the lock-in, but there is no public market and no guaranteed buyer. Units are locked for the period in the estate's LLP agreement, typically 36 months from financial close. After that you can post your units on a noticeboard that other partners see first. A sale to someone outside the partnership needs the consent of partners holding a majority, and the buyer must complete the same identity checks. On a partner's death, the units pass to their estate and the lock-in does not apply.", "legal.ts G.1–G.4"],
  ["Can I let the estate out to others?", "Nights are not a letting right. What is settled is this: a night you release unused can be let by the estate, and that income joins the estate's revenue and is shared through the waterfall like any other, so every partner benefits from it. Unused nights never turn into cash for the partner who released them. Whether a partner may give nights to family or friends is for each estate's LLP agreement to state, and until it does, this page does not promise it.", "legal.ts F.1, F.3"],
  ["Is my capital at risk?", "Yes. Capital is at risk, and no one, including Getaway Collective, the operating partner or the sponsor, guarantees a return or the value of your units. The estates are unbuilt or being built, their income depends on occupancy that has not yet been observed, bank debt is repaid before partners, and units cannot be sold quickly. Read the <a class=\"tx-u\" href=\"/legal/risk-disclosure\">Risk Factors</a> in full before committing.", "legal.ts 85–95"],
];
