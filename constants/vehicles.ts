/**
 * THE COLLECTION — the three vehicles, transcribed from the intake
 *
 * Source: GC-LLP-INTAKE-TEMPLATE.xlsx, saved 4 Aug 2026 16:21.
 * Sheets 1 Vehicle · 2 Property · 3 Capital stack · 4 Units & ladder ·
 * 5 Operating & waterfall · 6 Time · 7 Governance.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────
 * The Collection used to be three entries in app/_assemblies/data.ts, two
 * of which — Kyoto House and Oslo Base — were invented for the prototype.
 * They carried appraisal sources, valuation dates and yields that no
 * appraiser had ever produced. One of them, Swiss Vault, had already been
 * replaced for exactly that reason.
 *
 * These three are real, and the difference has to be visible in the
 * shape of the data rather than only in a comment. So every figure here
 * names where it came from, and everything the intake left blank is
 * `null` rather than zero. Zero is a number somebody can divide by.
 *
 * ── THE PART THAT MATTERS MOST: NOTHING IS RECONCILED SILENTLY ───────
 * Transcribing this raised nine conflicts. Two were flagged by the author
 * in the intake itself; four fell out of reading it against the canon and
 * against itself; three more came from the spatial ledger. One is now
 * settled. They are in CONFLICTS below, with a severity, and
 * `publishable()` refuses to put a vehicle on a public surface while a
 * blocking one stands.
 *
 * That refusal is the point. Every one of these conflicts is resolvable
 * in a minute by somebody who knows the answer, and not one of them is
 * resolvable by me. Guessing would produce a Collection that renders
 * beautifully and tells a prospective investor something untrue about an
 * offering — which is the failure this whole codebase is arranged to
 * prevent.
 *
 * ── MONEY ────────────────────────────────────────────────────────────
 * Rupees at SCALE 4, matching app/_assemblies/data.ts. ₹3.00 Cr is
 * 30000000_0000n. Basis points are plain numbers: 500 = 5.00%.
 */

/** What stands behind a figure. Narrower than the provenance axis: this
    describes the INTAKE row, not the platform's confidence in it. */
export type IntakeState =
  /** Stated in the intake, and consistent with everything else here. */
  | "stated"
  /** Stated, and contradicted by another stated figure. See CONFLICTS. */
  | "contested"
  /** The intake left it blank. Not zero — absent. */
  | "absent";

export type VehicleKey = "slowspace" | "solace" | "coorgcreek" | "wildwood";

/** Lifecycle, from sheet 1. The vehicle's own state, not the property's. */
/**
 * Lifecycle, from sheet 1. The vehicle's own state, not the property's.
 *
 * `funded` was added 20 Sep 2026 and is not cosmetic. Coastal and Solace
 * both closed their raise and began construction, and the type had no word
 * for that: `raising` was a lie the moment the last unit went, and `live`
 * claims a vehicle that is operating and distributing. A state that does
 * not exist gets rounded to the nearest one that does, and both neighbours
 * here are wrong in a way an investor could act on.
 */
export type VehicleLifecycle = "forming" | "raising" | "funded" | "live" | "dissolved";

/** What each lifecycle state may be SAID, in public, in full. */
export const LIFECYCLE_LABEL: Record<VehicleLifecycle, string> = {
  forming: "Forming",
  raising: "Open · raising",
  funded: "Fully subscribed · in construction",
  live: "Operating",
  dissolved: "Dissolved",
};

/**
 * What stage the BUILDING is at. Nothing about how the land is held.
 *
 * The intake calls this the property lifecycle and uses it for both, and
 * that conflation is what produced the defect: "acquired" was set because
 * the land was secured, and the hero rendered it as "Land acquired" over
 * a record stating title was unverified. One field answering two
 * questions will eventually answer one of them wrongly.
 */
export type BuildStage = "pre-construction" | "under-construction" | "stabilised";

/**
 * How the land is HELD. A separate axis, and a legal one.
 *
 * Ordered weakest to strongest. Each value is a position somebody can be
 * asked to stand behind, which is why none of them is "acquired" — that
 * word reads as settled title to almost everybody and means nothing
 * precise to anyone.
 *
 * Null where the record does not state a position. A public surface then
 * says nothing about tenure rather than inferring one, because inferring
 * tenure from an adjacent sentence is exactly how the last version went
 * wrong.
 */
export type Tenure =
  /** In possession. Nothing about title has been established. */
  | "possession"
  /** Diligence run and complete. Title work not necessarily concluded. */
  | "diligence-complete"
  /** Title established and verified. */
  | "title-verified"
  /** Conveyance executed and registered. */
  | "conveyance-complete";

/** What each tenure position may be SAID, in public, in full. */
export const TENURE_LABEL: Record<Tenure, string> = {
  possession: "In possession · title not yet established",
  "diligence-complete": "Diligence complete",
  "title-verified": "Title verified",
  "conveyance-complete": "Conveyance complete",
};

export const BUILD_LABEL: Record<BuildStage, string> = {
  "pre-construction": "Pre-construction",
  "under-construction": "Under construction",
  stabilised: "Stabilised",
};

export interface CapitalStack {
  readonly land: bigint;
  readonly formation: bigint;
  readonly facility: bigint;
  readonly equityLayer: bigint;
  readonly projectTotal: bigint;
  readonly moratorium: string;
  readonly covenant: string;
}

export interface Offering {
  /** The whole equity layer, per sheet 4. May differ from the stack. */
  readonly totalEquity: bigint;
  /** The sponsor's own money. The canon had no concept of this. */
  readonly promoter: bigint;
  /** What is actually offered to partners. promoter + offering = equity. */
  readonly offered: bigint;
  readonly units: number;
  readonly unitPrice: bigint;
  readonly subscribed: number;
  readonly available: number;
  /**
   * What is taken to hold a unit, on the platform.
   *
   * Nullable since 20 Sep 2026. Wildwood is raised as two 24% portions
   * against a valuation rather than as priced units off a ladder, and no
   * holding deposit is stated for that structure. The folder's
   * ₹2,25,000 belongs to a ₹22.50 L unit that this raise does not use, and
   * carrying it across would put a number on a page that no document
   * supports.
   */
  readonly deposit: bigint | null;
  readonly lockIn: string;
}

/**
 * The LLP's own capital, where it is not the same thing as the offering.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * The first three vehicles raise priced units off a ladder, and for them
 * "what an investor pays" and "what the LLP registers as capital" are the
 * same number. Wildwood is not built that way, and flattening it into the
 * same shape would misstate the instrument rather than simplify it.
 *
 * An LLP that registers ₹1.15 Cr as contribution pays MCA fees on ₹1.15 Cr
 * and triggers audit thresholds early. So the nominal capital on the filing
 * is kept deliberately small — ₹10,000 — and the rest of the money arrives
 * as premium credited to each partner's contribution account. The profit
 * share follows the nominal split, not the cash.
 *
 * That distinction is legal, not presentational: the MCA filing and the
 * supplementary agreement say different numbers ON PURPOSE, and a reader
 * who sees only one of them has been told half of what they are joining.
 */
export interface LlpCapital {
  /** What the MCA filing registers, in total. Small on purpose. */
  readonly nominalTotal: bigint;
  readonly nominalSponsor: bigint;
  readonly nominalPerInvestor: bigint;
  /** Credited to each investor's contribution account, above the nominal. */
  readonly premiumPerInvestor: bigint;
  /** Cash each investor actually sends: nominal + premium. */
  readonly cashPerInvestor: bigint;
  readonly preMoney: bigint;
  readonly postMoney: bigint;
  /** Profit- and loss-sharing ratio, in basis points. Follows the nominal. */
  readonly sponsorBps: number;
  readonly investorBps: number;
  readonly investors: number;
  /** Why the nominal is not the raise. Rendered, never assumed. */
  readonly why: string;
}

export interface Ladder {
  readonly minimumInvestmentBps: number;
  readonly minUnitBps: number;
  readonly stepBps: number;
  readonly ceilingBps: number;
}

/**
 * The six stages, in order, in basis points of gross.
 *
 * Every stage is individually nullable because a waterfall arrives in
 * pieces. Solace states four of six: the operator, brand, admin reserve
 * and sinking fund are settled, and the split of what remains between
 * debt service and the partners is not.
 *
 * Modelling that as `Waterfall | null` — which this was — forced a choice
 * between throwing away four real figures and inventing two. Nullable
 * stages let a partial waterfall be exactly what it is, and
 * `waterfallState()` below is what reads it.
 */
export interface Waterfall {
  readonly operator: number | null;
  readonly brand: number | null;
  readonly adminReserve: number | null;
  readonly sinkingFund: number | null;
  readonly debtService: number | null;
  readonly toPartners: number | null;
}

export const WATERFALL_STAGES = [
  ["operator", "1 Operator"], ["brand", "2 Brand"],
  ["adminReserve", "3 Admin reserve"], ["sinkingFund", "4 Sinking fund"],
  ["debtService", "5 Debt service"], ["toPartners", "6 To partners"],
] as const;

/** Basis points actually stated. Never treats a blank as a zero. */
export const statedBps = (w: Waterfall | null): number =>
  w === null ? 0 : WATERFALL_STAGES.reduce((n, [k]) => n + (w[k] ?? 0), 0);

export const statedStages = (w: Waterfall | null): number =>
  w === null ? 0 : WATERFALL_STAGES.filter(([k]) => w[k] !== null).length;

/**
 * How much of the waterfall is known.
 *
 * `complete` means all six are stated AND they close at 100% — a
 * waterfall that names every stage and sums to 96% is not complete, it is
 * wrong, and it gets its own answer so nobody reads "complete" as
 * "checked".
 */
export function waterfallState(w: Waterfall | null): {
  state: "absent" | "partial" | "complete" | "does-not-close";
  statedBps: number;
  outstandingBps: number;
  missing: string[];
} {
  const bps = statedBps(w);
  const missing = w === null
    ? WATERFALL_STAGES.map(([, label]) => label)
    : WATERFALL_STAGES.filter(([k]) => w[k] === null).map(([, label]) => label);

  const state =
    w === null || statedStages(w) === 0 ? "absent" as const
      : missing.length > 0 ? "partial" as const
      : bps === 10000 ? "complete" as const
      : "does-not-close" as const;

  return { state, statedBps: bps, outstandingBps: 10000 - bps, missing };
}

export interface Operating {
  readonly adr: bigint;
  readonly occupancyBps: number;
  readonly grossRevenue: bigint;
  readonly waterfall: Waterfall | null;
  readonly reserveFloor: bigint | null;
  readonly yieldConfidence: string | null;
  /**
   * What the modelled yield IS. PUBLIC.02: a percentage is the most
   * portable thing on a page — screenshotted and quoted without its
   * surroundings — so the basis travels with it everywhere it renders.
   *
   * Founder, 4 Aug 2026: eighteen per cent from year three, stabilised.
   * The denominator is the offering equity, which is what yieldOf()
   * actually divides by.
   */
  readonly yieldBasis: string | null;
}

export interface Entitlement {
  readonly nightPoolMin: number;
  readonly nightPoolMax: number;
  readonly reservedDays: number;
  readonly begins: string;
}

export interface Governance {
  readonly ordinaryBps: number;
  readonly specialBps: number;
  readonly quorumBps: number;
  readonly reservedMatters: string;
  readonly transferRule: string;
  readonly designatedPartners: string;
}

export interface Vehicle {
  readonly key: VehicleKey;
  /* llpCapital sits with the other optional blocks below. */
  /** Derived nowhere else: the URL segment every route resolves on. */
  readonly slug: string;
  readonly registeredName: string;
  readonly llpin: string | null;
  readonly incorporated: string | null;
  readonly agreementDated: string | null;
  readonly registeredOffice: string | null;
  readonly registrar: string;
  readonly lifecycle: VehicleLifecycle;
  readonly audited: boolean;

  readonly propertyName: string;
  readonly assetCode: string;
  readonly jurisdiction: string;
  readonly coordinates: string | null;
  readonly landArea: string;
  readonly keys: number;
  readonly buildStage: BuildStage;
  /** Null where the record states no tenure position. Never inferred. */
  readonly tenure: Tenure | null;
  readonly commitments: string;
  /** Plate hue. A design token index, not a colour literal (§29). */
  readonly hue: number;

  readonly stack: CapitalStack;
  readonly ladder: Ladder;
  readonly offering: Offering;
  readonly operating: Operating;
  readonly llpCapital: LlpCapital | null;
  readonly entitlement: Entitlement | null;
  readonly governance: Governance | null;
}

/* ── The three ───────────────────────────────────────────────────── */

const SLOWSPACE: Vehicle = {
  key: "slowspace",
  slug: "slowspace-coastal",
  registeredName: "SlowSpace Coastal LLP",
  llpin: "AAC-4471",
  incorporated: "2026-06-12",
  agreementDated: "2026-06-19",
  registeredOffice: "2nd Floor, Maruthi Arcade, Udupi 576101, Karnataka",
  registrar: "RoC Bangalore",
  lifecycle: "funded",
  audited: true,

  propertyName: "SlowSpace Coastal",
  assetCode: "PDB-01",
  jurisdiction: "Padubidri, Karnataka",
  coordinates: "13.117416°N · 74.765988°E",
  /* CONFLICT C-04. The intake says .3 acres; data.ts has carried 1.42
     acres since the dossier. Transcribed as the intake states it, and
     the conflict is registered rather than the figure quietly corrected. */
  landArea: ".3 acres · dual frontage",
  keys: 12,
  buildStage: "under-construction",
  /* The record states CRZ compliance and a frontage, and no tenure
     position. Null rather than a guess — see the note on Tenure. */
  tenure: null,
  commitments: "CRZ compliant · Blue Flag adjacent · modular assembly",
  hue: 198,

  stack: {
    land: 30000000_0000n,
    formation: 10000000_0000n,
    facility: 55000000_0000n,
    equityLayer: 40000000_0000n,
    projectTotal: 95000000_0000n,
    moratorium: "Interest-only during months 1–18",
    covenant: "DSCR 1.50x minimum",
  },
  ladder: { minimumInvestmentBps: 1000, minUnitBps: 500, stepBps: 500, ceilingBps: 5000 },
  offering: {
    totalEquity: 40000000_0000n,
    promoter: 16000000_0000n,
    offered: 24000000_0000n,
    units: 6,
    unitPrice: 4000000_0000n,
    subscribed: 6,
    available: 0,
    /* ₹1,00,000 from 24 Sep 2026, founder ruling: one flat deposit at every
       estate, refundable in full until the Vehicle Agreement is signed. */
    deposit: 100000_0000n,
    lockIn: "36 months from financial close",
  },
  operating: {
    adr: 15000_0000n,
    occupancyBps: 5000,
    grossRevenue: 32850000_0000n,
    waterfall: {
      operator: 3500, brand: 1500, adminReserve: 250,
      sinkingFund: 250, debtService: 2308, toPartners: 2192,
    },
    reserveFloor: 3960000_0000n,
    yieldConfidence: "modelled",
    yieldBasis: "on offering equity, from year 3 at stabilised occupancy",
  },

  /* No nominal/premium split is stated for this vehicle. */
  llpCapital: null,
  entitlement: {
    nightPoolMin: 180, nightPoolMax: 210, reservedDays: 0,
    begins: "Handover, Jan 2028",
  },
  governance: {
    ordinaryBps: 5001, specialBps: 7600, quorumBps: 6000,
    reservedMatters: "Disposing of the land, or borrowing beyond ₹6.0 Cr",
    transferRule: "Internal register first; external buyer needs consent",
    designatedPartners: "Getaway Collective (GP)",
  },
};

const SOLACE: Vehicle = {
  key: "solace",
  slug: "slowspace-solace",
  registeredName: "Solace Retreats LLP",
  /* Not incorporated yet — sheet 1 leaves the LLPIN, the dates and the
     office blank, and `forming` is the lifecycle that says so. */
  llpin: null,
  incorporated: null,
  agreementDated: null,
  registeredOffice: null,
  registrar: "RoC Bangalore",
  lifecycle: "funded",
  audited: false,

  /* The intake writes "Slowspace Solace " with a trailing space and a
     lower-case S in the brand. Trimmed and cased to match SlowSpace
     Coastal, because the slug and every heading derive from it. */
  propertyName: "Slowspace Solace",
  assetCode: "CKB-01",
  jurisdiction: "Chikkaballapur, Karnataka",
  coordinates: "13°24'40.5\"N 77°49'26.9\"E",
  landArea: "1.55 acres (0.20 owned + 1.35 leased)",
  keys: 6,
  buildStage: "under-construction",
  /* Part freehold, part leasehold — a description of holding rather than
     a diligence or title position. The commitments line states it in
     full; this axis stays null until somebody sets the position. */
  tenure: null,
  commitments:
    "8 guntas owned (freehold) + 1 acre 14 guntas leased (leasehold). PACK_ARID_HILL climate mutation.",
  hue: 35,

  stack: {
    land: 10000000_0000n,
    formation: 10000000_0000n,
    facility: 30000000_0000n,
    /* Was the C-03 conflict. Sheet 3's 2.00 Cr stands; the offering above
       was moved to agree with it rather than the other way round. */
    equityLayer: 20000000_0000n,
    projectTotal: 50000000_0000n,
    moratorium: "Interest-only during months 1–18",
    covenant: "DSCR 1.50x minimum",
  },
  ladder: { minimumInvestmentBps: 1000, minUnitBps: 500, stepBps: 500, ceilingBps: 5000 },
  offering: {
    /* C-03 settled by the founder, 20 Sep 2026, at the sheet-3 reading:
       equity 2.00 Cr, of which 1.00 Cr is the sponsor's and 1.00 Cr was
       offered as four units of 25 lakh. Sheet 4's 1.50 Cr offering was the
       figure left behind when the intake was cut from six units to four,
       and it never matched its own unit maths. These three now reconcile
       with each other AND with stack.equityLayer, which they did not. */
    totalEquity: 20000000_0000n,
    promoter: 10000000_0000n,
    offered: 10000000_0000n,
    units: 4,
    unitPrice: 2500000_0000n,
    subscribed: 4,
    available: 0,
    /* ₹1,00,000 from 24 Sep 2026, founder ruling: one flat deposit at every
       estate, refundable in full until the Vehicle Agreement is signed. */
    deposit: 100000_0000n,
    lockIn: "36 months from financial close",
  },
  operating: {
    adr: 12000_0000n,
    occupancyBps: 5000,
    grossRevenue: 13140000_0000n,
    /* Complete as of the 16:21 intake. The operator takes 4,000 bps here
       and on The Creek, against 3,500 on Confluence — a real difference
       between the vehicles, carried rather than smoothed. */
    waterfall: {
      operator: 4000, brand: 1500, adminReserve: 250,
      sinkingFund: 250, debtService: 2308, toPartners: 1692,
    },
    reserveFloor: null,
    /* The intake states no confidence WORD for this vehicle. That is a
       different field from the basis: confidence says how well-sourced
       the model is, the basis says what the number measures. */
    yieldConfidence: null,
    /* Same basis as the other two. Not a per-vehicle claim — it is the
       modelling convention the founder stated on 4 Aug, and yieldOf()
       divides by offering equity for all three identically. Solace's
       waterfall now closes, so it DOES render a yield, and a rendered
       yield without a basis is the whole of PUBLIC.02. */
    yieldBasis: "on offering equity, from year 3 at stabilised occupancy",
  },
  /* Sheet 6 and sheet 7 are empty for this vehicle. */

  /* No nominal/premium split is stated for this vehicle. */
  llpCapital: null,
  entitlement: null,
  governance: null,
};

const COORGCREEK: Vehicle = {
  key: "coorgcreek",
  slug: "coorg-coffee-creek",
  registeredName: "Coorg Coffee Creek LLP",
  llpin: null,
  incorporated: null,
  agreementDated: null,
  registeredOffice: null,
  registrar: "RoC Bangalore",
  lifecycle: "raising",
  audited: false,

  propertyName: "Coorg Coffee Creek",
  assetCode: "COG-03",
  jurisdiction: "Coorg, Karnataka",
  coordinates: "12°23'25.8\"N 75°49'15.2\"E",
  landArea: "10 acres (possession)",
  keys: 20,
  buildStage: "pre-construction",
  /* Founder, 4 Aug 2026: diligence completed. This replaces "acquired",
     which the hero was rendering as "Land acquired" over a record saying
     title and conversion status were unverified. */
  tenure: "diligence-complete",
  commitments:
    "SlowSpace brand. Land held under possession; title, Land Reforms Act and conversion status " +
    "unverified. Construction financed via a ₹5.0 Cr facility once the equity raise closes.",
  hue: 90,

  stack: {
    land: 60000000_0000n,
    formation: 40000000_0000n,
    facility: 50000000_0000n,
    equityLayer: 100000000_0000n,
    projectTotal: 150000000_0000n,
    moratorium: "Interest-only during months 1–18",
    covenant: "DSCR 1.50x minimum",
  },
  ladder: { minimumInvestmentBps: 1000, minUnitBps: 500, stepBps: 500, ceilingBps: 6000 },
  offering: {
    totalEquity: 100000000_0000n,
    promoter: 60000000_0000n,
    offered: 40000000_0000n,
    units: 4,
    unitPrice: 10000000_0000n,
    subscribed: 0,
    available: 4,
    /* ₹1,00,000 from 24 Sep 2026, founder ruling: one flat deposit at every
       estate, refundable in full until the Vehicle Agreement is signed. */
    deposit: 100000_0000n,
    lockIn: "36 months from financial close",
  },
  operating: {
    adr: 12000_0000n,
    occupancyBps: 5500,
    /* The intake carries 48180000.00000001 — a float artefact from a
       spreadsheet formula. Rounded to the rupee on transcription, because
       a fraction of a paisa in a canonical figure is noise that later
       reconciliation will chase. */
    grossRevenue: 48180000_0000n,
    waterfall: {
      operator: 4000, brand: 1500, adminReserve: 250,
      sinkingFund: 250, debtService: 1500, toPartners: 2500,
    },
    reserveFloor: 8700000_0000n,
    yieldConfidence: "estimated",
    yieldBasis: "on offering equity, from year 3 at stabilised occupancy",
  },

  /* No nominal/premium split is stated for this vehicle. */
  llpCapital: null,
  entitlement: {
    nightPoolMin: 300, nightPoolMax: 350, reservedDays: 0,
    begins: "Pending programme lock — construction has not started",
  },
  governance: {
    ordinaryBps: 5001, specialBps: 7600, quorumBps: 6000,
    reservedMatters: "Disposing of the land, or borrowing beyond ₹6.0 Cr",
    transferRule: "Internal register first; external buyer needs consent",
    designatedPartners: "Getaway Collective (GP)",
  },
};


/**
 * WILDWOOD · PV01 Aranthodu Water Estate
 *
 * Sources: the LLP intake (PV01_Aranthodu_Investor_Pitch_LLP, 11 Aug 2026,
 * row 8), the ratified financial model (WLD-09-CA-001 R0) and the design
 * canon (WLD-01-CN-001 R0, 18 Aug 2026). The capital structure is the
 * founder's, stated 20 Sep 2026, and it SUPERSEDES the 20-unit ₹22.50 L
 * ladder those documents carry: this is two portions of 24%, not a ladder.
 *
 * ⚠ THE SOURCE DOCUMENTS SAY DO NOT CLOSE EQUITY. The risk register reads
 * "OPEN — CP-1 / CP-2 · Do not close equity": the land is retained outside
 * the LLP and the registered long-term lease that gives the vehicle its
 * site control is not executed. Six conflicts are registered below and
 * every one of them is blocking, so `publishable()` refuses this vehicle a
 * public surface. That is the register doing its job, not a defect.
 */
const WILDWOOD: Vehicle = {
  key: "wildwood",
  slug: "wildwood",
  /* Proposed. Name approval has not been granted, so there is no LLPIN and
     no incorporation date to state. */
  registeredName: "PV01 Aranthodu Water Estate LLP",
  llpin: null,
  incorporated: null,
  agreementDated: null,
  registeredOffice: null,
  registrar: "RoC Bangalore",
  lifecycle: "forming",
  audited: false,

  propertyName: "Wildwood",
  assetCode: "ARA-01",
  jurisdiction: "Aranthodu, Dakshina Kannada, Karnataka",
  coordinates: "12.556617°N · 75.472709°E",
  landArea: "12 acres (sponsor's contribution)",
  keys: 12,
  buildStage: "pre-construction",
  /* Not a tenure position at all. The land is the sponsor's and is being
     deployed into the vehicle; what perfects that is a registered lease
     that does not yet exist. None of the four tenure words says that, and
     the nearest one would overstate it. */
  tenure: null,
  commitments:
    "The sponsor's stake is the land itself, deployed at ₹1.50 Cr rather than subscribed in " +
    "cash, which leaves the sponsor at 60% and in majority after the raise. That deployment is " +
    "perfected by a registered long-term lease (CP-1) and a clean title opinion (CP-2), both " +
    "pending. Six keys on water, six in the grove.",
  hue: 190,

  stack: {
    /* The sponsor's land, at the value its 60% is struck on. A contribution,
       not a purchase: no cash leaves the vehicle for it, which is why the
       same figure is `offering.promoter` rather than a stake on top of it.
       The financial model's ₹38 L/acre indicative figure values these same
       12 acres far higher — registered as C-16. */
    land: 15000000_0000n,
    formation: 20250000_0000n,
    facility: 39750000_0000n,
    equityLayer: 25000000_0000n,
    projectTotal: 64750000_0000n,
    moratorium: "Principal moratorium through construction plus a six-month operating ramp",
    covenant: "DSCR 1.50x minimum · debt ceiling ₹5.0 Cr",
  },

  /* Two portions of 20%. There is no ladder: the minimum, the step and the
     unit are the same 20%, and the ceiling is both portions together —
     which is the point, because 40% is what keeps the sponsor in majority. */
  ladder: { minimumInvestmentBps: 2000, minUnitBps: 2000, stepBps: 2000, ceilingBps: 4000 },

  offering: {
    totalEquity: 25000000_0000n,
    promoter: 15000000_0000n,
    offered: 10000000_0000n,
    units: 2,
    unitPrice: 5000000_0000n,
    subscribed: 0,
    available: 2,
    /* ₹1,00,000, founder ruling of 24 Sep 2026: one flat deposit at every
       estate. It was null here ("no holding deposit is stated for this
       structure") until that ruling stated one for all of them. The
       vehicle is still forming, so nothing can be reserved against it yet. */
    deposit: 100000_0000n,
    lockIn: "36 months from full launch",
  },

  /**
   * THE NOMINAL IS NOT THE RAISE.
   *
   * Founder, 20 Sep 2026. ₹50,00,000 buys 20%, which fixes the post-money
   * at ₹2.50 Cr and the sponsor's land at ₹1.50 Cr, or 60%. Both portions
   * together are 40%, so the sponsor keeps majority however the raise lands
   * — that is a structural property of the ceiling, not a hope about who
   * subscribes.
   *
   * The ₹10,000 nominal is an MCA filing mechanic, not a different
   * instrument: it is the same land-plus-cash equity the other three
   * vehicles use, filed so the vehicle is not charged on ₹1 Cr of
   * contribution and pulled into mandatory audit before it trades.
   */
  llpCapital: {
    nominalTotal: 10000_0000n,
    nominalSponsor: 6000_0000n,
    nominalPerInvestor: 2000_0000n,
    premiumPerInvestor: 4998000_0000n,
    cashPerInvestor: 5000000_0000n,
    preMoney: 15000000_0000n,
    postMoney: 25000000_0000n,
    sponsorBps: 6000,
    investorBps: 2000,
    investors: 2,
    why:
      "Registering ₹1 Cr as LLP contribution would be charged as such by the MCA and would pull " +
      "the vehicle into mandatory audit early. The filing registers ₹10,000 — ₹6,000 to the " +
      "sponsor, ₹2,000 to each investor — and the balance arrives as premium credited to each " +
      "partner's contribution account. Profit, loss and votes follow the nominal split, not the cash.",
  },

  operating: {
    adr: 22000_0000n,
    occupancyBps: 5000,
    /* Rooms only. The financial model builds a larger base that includes the
       café, estate experiences and buyouts, on 350 operating days rather
       than 365. Registered as C-15 — the two bases are not comparable. */
    grossRevenue: 48180000_0000n,
    waterfall: {
      operator: 5000, brand: 500, adminReserve: 300,
      sinkingFund: 300, debtService: 1500, toPartners: 2400,
    },
    reserveFloor: 4000000_0000n,
    yieldConfidence: "modelled",
    yieldBasis: "on offering equity, from year 3 at stabilised occupancy",
  },

  entitlement: {
    nightPoolMin: 40, nightPoolMax: 60, reservedDays: 0,
    begins: "After the full twelve-key launch and the reserve-floor test",
  },

  governance: {
    ordinaryBps: 5001, specialBps: 7600, quorumBps: 6000,
    reservedMatters:
      "Amending the lease or site control, borrowing beyond ₹5.0 Cr, spending beyond the ₹6.0 Cr " +
      "development cap, admitting a partner, selling substantially all project assets, or changing " +
      "the waterfall, the operator or the brand",
    transferRule: "Sponsor right of first refusal; investor tag-along; transferee subject to KYC",
    designatedPartners: "Two sponsor-side, at least one resident in India — not yet named",
  },
};


export const VEHICLES: readonly Vehicle[] = [SLOWSPACE, SOLACE, COORGCREEK, WILDWOOD];

/* ── The conflict register ───────────────────────────────────────── */

export type Severity =
  /** Stops the vehicle reaching a public surface until somebody decides. */
  | "blocking"
  /** Real, recorded, does not by itself mislead anybody. */
  | "advisory";

export interface Conflict {
  readonly id: string;
  readonly vehicle: VehicleKey;
  readonly severity: Severity;
  readonly what: string;
  readonly sides: readonly string[];
  readonly why: string;
  /** Who can settle it. Never "the platform". */
  readonly settledBy: string;
}

/**
 * Six, and not one of them is mine to resolve.
 *
 * C-01 and C-02 came flagged in the intake. C-03 to C-06 fell out of
 * reading the sheets against each other and against the existing canon.
 * Severity is about the reader, not about the size of the discrepancy: a
 * conflict is blocking when a prospective partner could act on the wrong
 * side of it.
 */
export const CONFLICTS: readonly Conflict[] = [
  /* ── Wildwood · registered 20 Sep 2026 ──────────────────────────────
     Six of these are blocking, which is why this vehicle has no public
     surface. Its own financial model says so first: the risk register
     reads "OPEN — CP-1 / CP-2 · Do not close equity". None of them is
     mine to settle and none should be settled quickly. */
  {
    id: "C-11", vehicle: "wildwood", severity: "blocking",
    what: "The estate costs half again what the cap allows.",
    sides: [
      "LLP intake, capital stack: development cap ₹6.00 Cr",
      "WLD-09-CA-001 R0 and the design canon: derived cost ₹9.89 Cr ex-land, +65%",
      "This stack, from the founder's structure: ₹2.50 Cr equity + ₹3.975 Cr facility = ₹6.475 Cr",
    ],
    why:
      "The model and the canon both call the overrun the governing finding, and spending beyond " +
      "the cap is a reserved matter. A partner subscribing today would be funding a scheme whose " +
      "own documents say it cannot be built for the money.",
    settledBy: "A scheme that fits ₹6 Cr, a raised cap, or a written decision to fund the gap",
  },
  {
    id: "C-12", vehicle: "wildwood", severity: "blocking",
    what: "The vehicle does not yet control the land it is being funded to build on.",
    sides: [
      "CP-1: registered long-term lease, mortgageable, ≥30 years, lender-consented — PENDING",
      "CP-2: title opinion and encumbrance certificate from counsel — PENDING",
      "WLD-09-CA-001 risk register: \"OPEN — CP-1 / CP-2 · Do not close equity\"",
    ],
    why:
      "The sponsor's 60% IS the land. Until the lease is registered the vehicle holds an " +
      "intention, and the one document that models this raise says in terms not to close equity " +
      "against it.",
    settledBy: "The registered lease and the title opinion, in that order",
  },
  {
    id: "C-13", vehicle: "wildwood", severity: "blocking",
    what: "The facility is two figures.",
    sides: [
      "LLP intake, capital stack: ₹3.975 Cr, noted as the planned initial draw",
      "WLD-09-CA-001: ₹5.0 Cr, the ratified sanction ceiling, drawn in full",
    ],
    why:
      "Debt service is stage 5 of the waterfall and it is senior to the partners. A ₹1.025 Cr " +
      "difference in the facility is a difference in what reaches stage 6, and no sanction letter " +
      "exists for either number.",
    settledBy: "The sanction letter",
  },
  {
    id: "C-14", vehicle: "wildwood", severity: "blocking",
    what: "Cost per key is over its own ratified cap on both key types.",
    sides: [
      "Ratified caps: ₹40.00 L per Water key, ₹35.00 L per Grove key",
      "Derived: ₹44.81 L and ₹38.87 L — the model marks this risk TRIGGERED",
    ],
    why:
      "The package reconciliation that produces the ₹6.00 Cr cap is built from the capped " +
      "figures. If the derived costs are right the cap cannot hold, which is C-11 arriving from " +
      "the other direction.",
    settledBy: "A priced tender against the frozen scheme",
  },
  {
    id: "C-15", vehicle: "wildwood", severity: "blocking",
    what: "The revenue this vehicle states and the revenue it was modelled on are different measurements.",
    sides: [
      "LLP intake: ₹4.818 Cr, rooms only, 365 operating days",
      "WLD-09-CA-001: rooms plus café, estate experiences and buyouts, on 350 days — the model " +
        "flags the 365-to-350 change as a correction to the pitch",
    ],
    why:
      "The waterfall runs on gross revenue, so the basis decides every stage below it. The two " +
      "bases are not comparable and the stated yield inherits whichever one is used.",
    settledBy: "Which base the waterfall runs on, and on how many operating days",
  },
  {
    id: "C-16", vehicle: "wildwood", severity: "blocking",
    what: "The land is deployed at a third of what the model values it at.",
    sides: [
      "Founder, 20 Sep 2026: ₹1.50 Cr, which is what the sponsor's 60% is struck on",
      "WLD-09-CA-001: ₹38 L per acre indicative, which is ₹4.56 Cr for the 12 acres",
    ],
    why:
      "The deployed value sets the sponsor's share and therefore every partner's. The model calls " +
      "its own figure indicative and not an appraisal, so this is not a contradiction of fact so " +
      "much as an unpriced asset — and the price is the whole cap table.",
    settledBy: "An independent valuation, which the model already lists as a formation cost",
  },
  {
    id: "C-17", vehicle: "wildwood", severity: "advisory",
    what: "Neither the brand nor the property code is ratified.",
    sides: [
      "Draft property canon cover: ESKAPE",
      "LLP intake: no brand recorded for this property",
      "The code WLD is on five filenames; the canon holds it open and asks for a ruling",
    ],
    why:
      "Advisory rather than blocking because no figure moves with it, and because changing the " +
      "operator or brand is already a reserved matter. It decides the design pack and the price " +
      "position, so it should not remain open long.",
    settledBy: "A ruling on the brand, and on whether WLD is the code",
  },
  {
    id: "C-01", vehicle: "solace", severity: "advisory",
    what: "Site area disagrees with the portfolio registry.",
    sides: [
      "Intake sheet 2: 1.55 acres (0.20 owned + 1.35 leased)",
      "Spatial ledger: site area 0.6 acres, buildable envelope 0.2 acres",
    ],
    why:
      "The ledger narrows this rather than settling it. Its 0.2-acre buildable envelope matches the " +
      "intake's 0.20 owned exactly, which suggests the registry measures the owned parcel and the " +
      "intake measures owned plus leased. That is a reading, not a confirmation, and the difference " +
      "decides what a partner is told they have a share of.",
    settledBy: "Confirmation that 0.6 acres is the owned parcel and 1.55 includes the lease",
  },
  {
    id: "C-02", vehicle: "coorgcreek", severity: "advisory",
    what: "The vehicle is The Creek. Its name says otherwise. — SETTLED 4 Aug 2026",
    sides: [
      "Intake: Coorg Coffee Creek LLP, 10 acres, 20 keys",
      "Spatial ledger: The Creek, Coorg, 10.0 acres, 5.0 buildable, 20 keys",
    ],
    why:
      "Founder confirmed the Coorg vehicle is The Creek, which the matching area and key count had " +
      "already suggested. What remains is only the name: 'Coorg Coffee Creek' borrows its middle " +
      "word from Coffee Fields Forever, a different estate three acres in size, and a reader " +
      "searching either name should not land on the wrong ground. Kept as advisory so the naming " +
      "is fixed deliberately rather than forgotten.",
    settledBy: "Settled. The registered name is the remaining tidy-up.",
  },
  {
    id: "C-03", vehicle: "solace", severity: "advisory",
    what: "The capital stack disagrees with the offering sheet. — SETTLED 20 Sep 2026",
    sides: [
      "Sheet 3 (Capital stack): equity ₹2.00 Cr, project ₹5.00 Cr",
      "Sheet 4 (Units & ladder): equity ₹2.50 Cr, offering ₹1.50 Cr, project ₹5.50 Cr",
      "Sheet 4 units: 4 × ₹25 lakh = ₹1.00 Cr, which is ₹50 lakh short of its own offering",
    ],
    why:
      "The 16:21 intake cut Solace from six units to four without moving the offering, so sheet 4 " +
      "now contradicts itself as well as sheet 3 — by the same ₹50 lakh. Both discrepancies " +
      "disappear if equity is ₹2.00 Cr with a ₹1.00 Cr promoter stake and a ₹1.00 Cr offering, " +
      "which is sheet 3 plus four units at their stated price. That reading is arithmetically " +
      "clean and it is not what sheet 4 says.",
    settledBy:
      "Settled 20 Sep 2026: the offering is ₹1.00 Cr, four units of ₹25 lakh, on sheet 3's ₹2.00 Cr equity with a ₹1.00 Cr sponsor stake. Sheet 4's ₹1.50 Cr was the figure left behind when the intake was cut from six units to four.",
  },
  {
    id: "C-04", vehicle: "slowspace", severity: "advisory",
    what: "Site area disagrees with the figure the platform has been showing. — SETTLED 20 Sep 2026",
    sides: [
      "Intake sheet 2: .3 acres · dual frontage",
      "Spatial ledger, genesis registry (16:20): Confluence 0.3",
      "Spatial ledger, land profile: Confluence site 4.4 acres, buildable 2.3 acres",
      "app/_assemblies/data.ts, from the site dossier: 1.42 acres",
    ],
    why:
      "The 16:20 ledger changed its registry row for Confluence from 4.4 acres to 0.3 and left its " +
      "own land-and-development profile at 4.4. Two of the four sources now say 0.3, which makes " +
      "that the likeliest figure and makes the ledger internally inconsistent. Still blocking, and " +
      "for the same reason as before: this is the vehicle with five of six units already " +
      "subscribed, and somebody has been shown one of these numbers.",
    settledBy:
      "Settled 20 Sep 2026: 0.3 acres, dual frontage, as the intake and the genesis registry both state. The ledger's land profile and the site dossier are the two that need correcting.",
  },
  {
    id: "C-05", vehicle: "solace", severity: "advisory",
    what: "The waterfall closes, but no reserve floor is set. — SETTLED 4 Aug 2026",
    sides: [
      "Waterfall: 4,000 · 1,500 · 250 · 250 · 2,308 · 1,692 = 10,000 bps",
      "Reserve floor: still blank, on both this vehicle and its sinking fund stage",
    ],
    why:
      "The six stages now close at 100%, so a partner share can finally be computed. What is still " +
      "absent is the floor stage 6 is tested against — L1-16 §2.6a stops a distribution that would " +
      "take the reserve below it, and with no floor that test cannot run at all.",
    settledBy: "The reserve floor for this vehicle",
  },
  {
    id: "C-06", vehicle: "slowspace", severity: "advisory",
    what: "The unit structure disagrees with the modelled canon. — SETTLED 20 Sep 2026",
    sides: [
      "Intake sheet 4: 6 units at ₹40,00,000, 5 subscribed, 1 available, plus a ₹1.6 Cr promoter stake",
      "app/_assemblies/slowspace.ts: 20 units at ₹20,00,000, 11 subscribed, 45% remaining, no promoter",
    ],
    why:
      "These are different instruments, not different roundings. The intake introduces a 40% " +
      "sponsor stake the canon does not model, and moves availability from 45% to 10%. The public " +
      "offering page currently reads from the canon.",
    settledBy:
      "Settled 20 Sep 2026: six units of ₹40,00,000 with the sponsor stake, per the intake. slowspace.ts published twenty units of ₹20,00,000 and no sponsor; it was the wrong one.",
  },
  {
    id: "C-07", vehicle: "coorgcreek", severity: "advisory",
    what: "The brand disagrees.",
    sides: [
      "Intake sheet 2: SlowSpace brand",
      "Spatial ledger: The Creek is ESKAPE",
    ],
    why:
      "Both Coorg estates in the ledger are ESKAPE and the intake puts this one under SlowSpace. " +
      "The brand decides which design pack, which price position and which name a partner is " +
      "buying into, so it is not a labelling detail.",
    settledBy: "Which brand The Creek is being developed under",
  },
  {
    id: "C-08", vehicle: "solace", severity: "advisory",
    what: "The studios exceed the platform's own maximum.",
    sides: [
      "Spatial ledger, SOLACE sheet: keys at 565 sqft",
      "Platform financial constitution: maximum standard key size 550 sqft",
    ],
    why:
      "Fifteen square feet, and the standard is stated in the same document. Either Solace is a " +
      "declared exception or the maximum has moved; leaving it unstated makes the constitution " +
      "decorative. constants/spatial.ts reports it on every render.",
    settledBy: "Whether Solace is an exception or the standard is now 565",
  },
  {
    id: "C-09", vehicle: "slowspace", severity: "advisory",
    what: "Entitlement begins five months after construction ends. — SETTLED 20 Sep 2026",
    sides: [
      "Intake sheet 6: entitlement begins at handover, Jan 2028",
      "Spatial ledger gantt: Confluence runs Sep 2026 – Aug 2027",
    ],
    why:
      "A partner subscribing today is told when they can first use the place. The two documents " +
      "disagree by five months, and the earlier date is the one in the construction programme " +
      "while the later one is in the document a partner reads.",
    settledBy:
      "Settled 20 Sep 2026: handover, Jan 2028. The date subscribers were given stands; the programme's Aug 2027 finish is the building, not the entitlement.",
  },
  {
    id: "C-10", vehicle: "coorgcreek", severity: "advisory",
    what: "The Creek is SlowSpace, not ESKAPE. — SETTLED 4 Aug 2026",
    sides: [
      "Spatial ledger registry and codex: The Creek is ESKAPE, T3 Flagship (ESKAPE-class)",
      "Founder, 4 Aug 2026: all three vehicles in scope are SlowSpace",
    ],
    why:
      "Scope resolves C-07 in the founder's favour, and the ledger has not caught up — its Creek " +
      "codex still reads T3 FLAGSHIP (ESKAPE-CLASS). Recorded rather than closed silently, because " +
      "the brand decides the design pack and the price position, and the ledger will be read again " +
      "by somebody who was not in this conversation.",
    settledBy: "Settled. The ledger needs updating to match.",
  },
];

/* ── Reading it ──────────────────────────────────────────────────── */

export const vehicleByKey = (k: VehicleKey): Vehicle | undefined =>
  VEHICLES.find((v) => v.key === k);

export const vehicleBySlug = (slug: string): Vehicle | undefined =>
  VEHICLES.find((v) => v.slug === slug);

export const conflictsFor = (k: VehicleKey): Conflict[] =>
  CONFLICTS.filter((c) => c.vehicle === k);

export const blockingFor = (k: VehicleKey): Conflict[] =>
  conflictsFor(k).filter((c) => c.severity === "blocking");

/**
 * Whether this vehicle may appear on a public surface.
 *
 * Not a display preference — a gate. Two of the three currently fail it,
 * and the third fails on its own site area. That is an uncomfortable
 * result and it is the correct one: every blocking conflict above is a
 * figure a prospective partner could act on.
 */
export function publishable(v: Vehicle): { ok: boolean; because: string[] } {
  const blocking = blockingFor(v.key);
  const because = blocking.map((c) => `${c.id}: ${c.what}`);

  /* Structural completeness, separately from the conflicts. A vehicle
     that cannot state what a partner receives should not have a public
     offering page, and a PARTIAL waterfall cannot state it — the
     outstanding stages are exactly the ones that decide the answer. */
  const wf = waterfallState(v.operating.waterfall);
  if (wf.state === "absent") {
    because.push("The waterfall is not stated.");
  } else if (wf.state === "partial") {
    because.push(
      `The waterfall states ${wf.statedBps.toLocaleString()} of 10,000 bps. ` +
      `Outstanding: ${wf.missing.join(", ")}.`,
    );
  } else if (wf.state === "does-not-close") {
    because.push(`The waterfall names every stage but sums to ${wf.statedBps} bps, not 10,000.`);
  }
  if (v.governance === null) because.push("Governance thresholds are not stated.");

  return { ok: because.length === 0, because };
}

/* ── What a reader may DO about a vehicle ────────────────────────────── */

/**
 * The stance is not the lifecycle, and the difference is the whole point.
 *
 * `lifecycle` is the vehicle's own state. The STANCE is what the person
 * reading the page is invited to do about it, and it has to be derived
 * from four separate facts rather than any one of them:
 *
 *   - the lifecycle, which says whether a raise is running at all
 *   - the remaining capacity, because a raise with nothing left is not open
 *   - `publishable()`, because a vehicle whose record contradicts itself
 *     may not take money on the strength of it
 *   - whether anything at all can be offered later, which is what separates
 *     a waitlist from a closed door
 *
 * Reading the lifecycle alone would have shown Coastal as open while its
 * last unit was gone, which is exactly the failure this replaces.
 */
export type OfferingStance =
  /** Units remain and the record supports an offering. Capital may be committed. */
  | { readonly kind: "open"; readonly unitsAvailable: number }
  /** Nothing left, but the vehicle is a going concern. Register interest only. */
  | { readonly kind: "waitlist"; readonly because: string }
  /** Nothing to join, now or by waiting. */
  | { readonly kind: "closed"; readonly because: string };

export function stanceFor(v: Vehicle): OfferingStance {
  const gate = publishable(v);

  if (v.lifecycle === "dissolved") {
    return { kind: "closed", because: "The vehicle is dissolved." };
  }

  /* Fully subscribed is a waitlist whether the raise formally closed or
     not: the honest offer is a place in a queue, and a queue commits
     nobody to anything, which is why an unsettled record does not bar it. */
  if (v.offering.available <= 0) {
    return {
      kind: "waitlist",
      because:
        `All ${v.offering.units} units are subscribed. A place on the waitlist is not an ` +
        `allocation, and it is not a commitment — it is how we reach you if a unit is ` +
        `transferred or a further vehicle opens.`,
    };
  }

  if (v.lifecycle === "funded" || v.lifecycle === "live") {
    return { kind: "waitlist", because: "The raise for this vehicle has closed." };
  }

  if (v.lifecycle === "forming") {
    return {
      kind: "waitlist",
      because: "The vehicle is still forming. There is nothing to subscribe to yet.",
    };
  }

  /* raising, with capacity — but the record still has to hold. A blocking
     conflict here is a figure somebody could commit capital against. */
  if (!gate.ok) {
    return {
      kind: "closed",
      because: `The record is not settled: ${gate.because.join(" ")}`,
    };
  }

  return { kind: "open", unitsAvailable: v.offering.available };
}

/** The one question most surfaces actually ask. */
export const isOpen = (v: Vehicle): boolean => stanceFor(v).kind === "open";

/** Every vehicle currently taking capital. Empty is a legitimate answer. */
export const openVehicles = (): Vehicle[] => VEHICLES.filter(isOpen);

/** What the offering sheet implies about the sponsor's own share. */
export const promoterBps = (v: Vehicle): number =>
  Number((v.offering.promoter * 10000n) / v.offering.totalEquity);

export const VEHICLE_LAWS = {
  absentIsNotZero:
    "Everything the intake left blank is null. Zero is a number somebody can divide by, and a " +
    "reserve floor of zero reads as a vehicle with no floor rather than one nobody has set.",
  conflictsAreRegistered:
    "Six conflicts, none of them resolvable from inside the codebase. Recording them is the only " +
    "honest option: picking a side would produce a Collection that renders perfectly and tells a " +
    "prospective partner something untrue.",
  publicationIsGated:
    "A vehicle with a blocking conflict does not reach a public surface. The gate is a function " +
    "rather than a convention, because a convention is what gets forgotten under a launch date.",
} as const;
