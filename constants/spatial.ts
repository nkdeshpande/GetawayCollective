/**
 * THE GENESIS PORTFOLIO — where the places are, and how they are built
 *
 * Source: GETAWAYS SPATIAL LEDGER.xlsx
 *   ALL ESTATES · Coorg Coffee Fields · SOLACE · CONFLUENCE · Timelines
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────
 * constants/vehicles.ts holds the LLP: who owns the land, what it cost,
 * who gets what. This holds the PLACE: where it is, what the ground is
 * like, and what is built on it.
 *
 * They are deliberately separate files. A vehicle is a legal instrument
 * that could in principle be re-papered around the same site; an estate
 * is a piece of ground. `estateOf()` joins them, and the join is
 * incomplete on purpose — two estates in this registry have no vehicle,
 * and one vehicle points at an estate whose identity is unsettled.
 *
 * ── THE LEDGER'S VOCABULARY DOES NOT CROSS ───────────────────────────
 * The ledger is written in operating-company language, and five of its
 * recurring nouns are on the §25 forbidden list — the words for a lettable
 * unit, for the person occupying it, for what that is like, for the
 * enclosed part of one, and for the things built beside them.
 *
 * They are translated at this boundary rather than exempted with a
 * pragma, which is the same treatment slowspace.ts gave the site dossier.
 * A pragma is for a third-party identifier that cannot be renamed; this
 * is our own prose, and our own prose can just use our own words.
 *
 * So the ledger's phrase for what a place is like becomes `character`,
 * its built-area column becomes `lodgingBuilt`, and its word for a
 * lettable unit becomes `key` — which is the intake's own column header.
 * The operating partner may keep its vocabulary in its own documents.
 * It stops here.
 *
 * ── WHAT THE LEDGER SETTLED, AND WHAT IT BROKE ───────────────────────
 * It resolves the identity question the intake could not: SlowSpace
 * Coastal is Confluence — slowspace.ts already cites the "Seaside
 * Confluence site dossier (Padubidri)", and the ledger puts Confluence at
 * Mangaluru–Udupi with 12 studios, which is exactly the intake's key
 * count.
 *
 * It also makes two conflicts worse rather than better, and both are
 * registered in vehicles.ts rather than smoothed over here. See C-02 and
 * C-04, and the three new ones this file adds.
 */

import type { VehicleKey } from "./vehicles";

/**
 * The climate mutation packs.
 *
 * The ledger's central claim is that these five estates are one building
 * system deployed five times, differing only by pack. That is a strong
 * claim and it is the reason the portfolio can standardise construction —
 * so the pack is a first-class value here rather than a description.
 */
export type ClimatePack =
  | "PACK_ARID_HILL"
  | "PACK_DENSE_FOREST"
  | "PACK_COASTAL_ESTUARY"
  | "PACK_RIPARIAN_FOREST"
  | "PACK_MOUNTAIN_RIDGE";

/**
 * One brand in scope.
 *
 * The ledger marks The Creek ESKAPE and describes it as "T3 Flagship
 * (ESKAPE-class)". The founder placed all three in-scope vehicles under
 * SlowSpace on 4 Aug 2026, which settles it — see C-10, kept as an
 * advisory so the ledger gets corrected rather than quietly diverging.
 */
export type Brand = "SlowSpace";

export type DevelopmentStatus = "confirmed" | "in-progress";

/**
 * Three, not five.
 *
 * The Genesis Portfolio registry lists five estates. Scope as of 4 Aug
 * 2026 is the three SlowSpace ones — Solace, Confluence and The Creek —
 * and each has a vehicle. Coffee Fields Forever and Nine Hills are real
 * and are not in scope, so they are not modelled here: an estate in this
 * registry is one the platform can be asked about, and carrying two it
 * cannot answer for would be the same mistake as Kyoto House.
 */
export type EstateId = "solace" | "confluence" | "the-creek";

/**
 * One key typology on one estate. The unit the whole system repeats.
 *
 * The ledger calls these studios. §25 forbids the word outright — it is an
 * operating-company concern — and the intake's own column header is
 * "Keys", so that is the term that crosses. The typology names lose the
 * noun with it: the ledger's "Earth Studios" is simply Earth here.
 */
export interface KeyType {
  readonly name: string;
  readonly count: number;
  /** Square feet per key. */
  readonly area: number;
  readonly note: string;
}

/**
 * Built area, in square feet.
 *
 * `lodging` and `working` are separated because the ledger's own
 * discipline turns on it — the working half is meant to be invisible, and
 * a single "built area" figure would hide whether that held.
 */
export interface Footprint {
  readonly lodgingBuilt: number;
  readonly workingBuilt: number;
  readonly hardscape: number;
  /** Null where the ledger states it in square metres rather than feet. */
  readonly softscape: number | null;
}

export interface Estate {
  readonly id: EstateId;
  readonly name: string;
  /** Other names the same ground travels under. See The Creek. */
  readonly alsoKnownAs?: readonly string[];
  readonly brand: Brand;
  readonly region: string;
  readonly pack: ClimatePack;
  /** Acres, as the ledger states them. */
  readonly siteArea: number;
  /**
   * Acres the building may sit within. NOT the ground it covers — the
   * estates build over several levels, so this is a planning zone rather
   * than a footprint, and subtracting it from the site does not give the
   * landscape figure.
   */
  readonly buildableEnvelope: number;
  /** Landscape held, as the ledger states it. Never computed here. */
  readonly landscapePreserved: string;
  readonly keys: number;
  readonly status: DevelopmentStatus;
  /** Why this estate exists in the portfolio, in the ledger's words. */
  readonly strategicRole: string;
  readonly ecology: string;
  /** What it is like to be there. The ledger states this in nouns §25
      forbids; this is the same fact in the platform's own words. */
  readonly character: string;
  /** The vehicle that owns it, where one has been formed. */
  readonly vehicle: VehicleKey | null;
  /** Present only for the three estates with a footprint matrix. */
  readonly footprint: Footprint | null;
  readonly keyTypes: readonly KeyType[];
  /** Construction window from the deployment gantt. */
  readonly programme: { readonly start: string; readonly end: string } | null;
}

export const ESTATES: readonly Estate[] = [
  {
    id: "solace",
    name: "Solace",
    brand: "SlowSpace",
    region: "Chikkaballapur",
    pack: "PACK_ARID_HILL",
    siteArea: 0.6,
    buildableEnvelope: 0.2,
    landscapePreserved: "≥65%",
    keys: 6,
    status: "confirmed",
    strategicRole: "Prove the complete SGDS reference implementation at small scale",
    ecology: "Rocky plateau and dry landscape",
    character: "Minimalism, silence and expansive horizons",
    vehicle: "solace",
    footprint: { lodgingBuilt: 5020, workingBuilt: 2992, hardscape: 6942, softscape: null },
    keyTypes: [
      { name: "Earth", count: 2, area: 565,
        note: "Grounded, inward-looking courtyard suites. Heavy, shaded, cell-like enclosures." },
      { name: "Sky Canopies", count: 2, area: 565,
        note: "Cantilevered floor plates and a horizon visor canopy that blocks peering from above." },
      { name: "Gabled Twin Pods", count: 2, area: 565,
        note: "Double-height lounges with private backyard onsens, under 5.5m gabled voids." },
    ],
    programme: { start: "2026-07", end: "2027-06" },
  },
  {
    id: "confluence",
    name: "Confluence",
    brand: "SlowSpace",
    region: "Mangaluru–Udupi",
    pack: "PACK_COASTAL_ESTUARY",
    /* The 16:20 registry changed this from 4.4 to 0.3, while the same
       workbook's land profile still reads 4.4. Carried as the registry
       states it and registered as C-04, unresolved. */
    siteArea: 0.3,
    buildableEnvelope: 2.3,
    landscapePreserved: "≥65%",
    keys: 12,
    status: "in-progress",
    strategicRole: "Validate coastal deployment and LLP ownership structures",
    ecology: "Coastal estuary and backwaters",
    character: "Water, breeze and tidal rhythm",
    /* The one settled join. slowspace.ts cites the "Seaside Confluence
       site dossier (Padubidri)", the region matches, and 12 studios is
       exactly the intake's key count. */
    vehicle: "slowspace",
    footprint: { lodgingBuilt: 7700, workingBuilt: 3300, hardscape: 8617, softscape: null },
    keyTypes: [
      { name: "Earth", count: 6, area: 500,
        note: "Grounded, shaded, inward-looking cells opening to private courtyards." },
      { name: "Sky", count: 6, area: 500,
        note: "Post-tensioned cantilevered view-visor decks." },
    ],
    programme: { start: "2026-09", end: "2027-08" },
  },
  {
    id: "the-creek",
    name: "The Creek",
    brand: "SlowSpace",
    region: "Coorg",
    pack: "PACK_RIPARIAN_FOREST",
    siteArea: 10.0,
    buildableEnvelope: 5.0,
    landscapePreserved: "≥65%",
    keys: 20,
    status: "in-progress",
    strategicRole: "Demonstrate premium riverine destination economics",
    ecology: "River forest and natural stream",
    character: "Flow, wilderness and secluded luxury",
    /*
     * The intake's Coorg vehicle. Confirmed by the founder on 4 Aug 2026,
     * which settles C-02: the 10 acres and 20 studios that looked like a
     * collision were the same estate all along.
     *
     * The intake calls it "Coorg Coffee Creek LLP". That is not this
     * estate's name in the ledger, and the middle word belongs to a
     * different estate three acres away — which is exactly why it read as
     * a duplicate. `alsoKnownAs` carries it so a search for either name
     * finds this one.
     */
    vehicle: "coorgcreek",
    alsoKnownAs: ["Coorg Coffee Creek"],
    /* The 16:20 ledger adds The Creek's codex — Sheet2, DOS-004 — which
       is where this comes from. It was genuinely absent before. */
    footprint: { lodgingBuilt: 11690, workingBuilt: 4060, hardscape: 15600, softscape: null },
    keyTypes: [
      { name: "Upper Escarpment · Ridge", count: 16, area: 465,
        note: "ARC-CH-02. Four clusters of four, on a pier field among the trees so the ground " +
              "stays unsealed and monsoon runoff is unimpeded. View cones angled outward at 15°." },
      { name: "Stream-Side · Summit", count: 4, area: 550,
        note: "ARC-CH-05. One linear cluster on tension piles above the 100-year flood band, with " +
              "no wet concrete near the water. The stream is the acoustic masking." },
    ],
    programme: { start: "2027-10", end: "2028-09" },
  },
];

/* ── The design system itself ────────────────────────────────────── */

/**
 * One vocabulary across every climate pack.
 *
 * This is the ledger's actual thesis: the estates are not five identities
 * but one system in five landscapes. Held as data because the Collection
 * should be able to state it on any place page without retyping it.
 */
export const ARCHITECTURAL_LANGUAGE: readonly string[] = [
  "Floating horizontal canopy architecture",
  "Deep protective overhangs",
  "Key-first planning",
  "Native ecological restoration",
  "Passive environmental performance",
  "Minimal and tactile material palettes",
  "Framed landscape views",
  "Invisible operational infrastructure",
];

export interface ConstitutionalStandard {
  readonly standard: string;
  readonly rule: string;
}

/**
 * The platform's capital discipline, as the ledger states it.
 *
 * Held here rather than in vehicles.ts because these bind the DESIGN, not
 * the LLP — a key over 550 sqft breaks the system whichever entity
 * owns it. `standardsBreached()` below checks the estates against them,
 * and one estate currently fails.
 */
export const PLATFORM_CONSTITUTION: readonly ConstitutionalStandard[] = [
  { standard: "Maximum standard key size", rule: "550 sqft" },
  { standard: "Maximum key development cost", rule: "₹50 lakh" },
  { standard: "Commons investment envelope", rule: "₹1.0 Cr – ₹3.5 Cr" },
  { standard: "Minimum landscape preservation", rule: "65% of site area" },
  { standard: "Revenue priority", rule: "Keys before anything built beside them" },
  { standard: "Design reuse target", rule: "Above 90%" },
  { standard: "Component standardisation", rule: "Above 95%" },
];

export const MAX_KEY_SQFT = 550;
/** The stated minimum. Reported alongside each estate, never derived. */
export const MIN_LANDSCAPE_RATIO = 0.65;

/**
 * The deployment phases, filtered to what is in scope.
 *
 * `alsoInPhase` names the out-of-scope estates rather than dropping them,
 * because the phase is a construction sequence and a single Mivan
 * formwork set moves between all five. Omitting two would make the
 * staggered start dates look arbitrary.
 */
export const ROADMAP: readonly {
  phase: string;
  estates: readonly EstateId[];
  alsoInPhase: readonly string[];
  objective: string;
}[] = [
  { phase: "Phase I", estates: ["solace", "confluence"],
    alsoInPhase: ["Coffee Fields Forever"],
    objective: "Validate the SGDS reference architecture" },
  { phase: "Phase 1.5", estates: ["the-creek"],
    alsoInPhase: ["Nine Hills"],
    objective: "Complete the climate mutation library" },
];

/* ── Reading it ──────────────────────────────────────────────────── */

export const estateById = (id: EstateId): Estate | undefined =>
  ESTATES.find((e) => e.id === id);

export const estateOf = (v: VehicleKey): Estate | undefined =>
  ESTATES.find((e) => e.vehicle === v);

/** Keys the ledger commits to across the whole portfolio. */
export const TOTAL_KEYS = ESTATES.reduce((n, e) => n + e.keys, 0);

/**
 * Where an estate breaks the platform's own standards.
 *
 * Solace fails the first one: its keys are 565 sqft against a stated
 * maximum of 550. Fifteen square feet is not a scandal, and reporting it
 * is still right — a constitution nobody checks is a paragraph, and the
 * point of writing the maximum down was to notice when something exceeds
 * it rather than to discover later that nothing ever did.
 */
export function standardsBreached(e: Estate): string[] {
  const out: string[] = [];

  for (const s of e.keyTypes) {
    if (s.area > MAX_KEY_SQFT) {
      out.push(
        `${s.name} is ${s.area} sqft against a maximum standard key size of ${MAX_KEY_SQFT}.`,
      );
    }
  }

  /*
   * NO LANDSCAPE CHECK HERE, DELIBERATELY.
   *
   * An earlier version computed it as site minus buildable envelope and
   * reported four of five estates in breach. That was wrong, and wrong in
   * the way this codebase is least willing to be: it invented a formula
   * and then published a compliance conclusion from it.
   *
   * The estates build vertically — the footprint sheets carry L-1, L0 and
   * L1 levels — so built area is not ground area, and an envelope is the
   * zone a building may sit within rather than the ground it covers.
   * Neither number in this registry is the one that measure needs.
   *
   * The ledger states preservation per estate and that stated figure is
   * carried on the estate as `landscapePreserved`. It is reported, not
   * recomputed. Where the platform wants to verify it, the input is a
   * survey, not a division.
   */
  return out;
}

export const SPATIAL_LAWS = {
  oneSystemManyClimates:
    "Five estates, one building system, differing only by climate pack. That is the ledger's claim " +
    "and the reason construction can standardise — so the pack is a value, not a description.",
  placeIsNotVehicle:
    "An estate is ground; a vehicle is a legal instrument. Two estates have no vehicle and one " +
    "vehicle points at an estate whose identity is unsettled. Joining them by name would invent " +
    "the very fact that is in question.",
  vocabularyStopsHere:
    "The ledger is written in operating-company language. Five of its recurring nouns are §25 " +
    "forbidden and are translated at this boundary rather than exempted with a pragma.",
  standardsAreChecked:
    "A maximum key size nobody measures against is a paragraph. standardsBreached() compares two " +
    "stated numbers and reports the one estate that exceeds it.",
  statedIsNotDerived:
    "Landscape preservation is carried as the ledger states it and never recomputed. Site minus " +
    "buildable envelope is not that figure — the estates build over several levels — and deriving " +
    "a compliance verdict from a formula nobody agreed to is worse than not checking at all.",
} as const;
