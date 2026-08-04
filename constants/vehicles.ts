/**
 * THE COLLECTION — the three vehicles, transcribed from the intake
 *
 * Source: GC-LLP-INTAKE-TEMPLATE.xlsx, saved 4 Aug 2026 07:31.
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

export type VehicleKey = "slowspace" | "solace" | "coorgcreek";

/** Lifecycle, from sheet 1. The vehicle's own state, not the property's. */
export type VehicleLifecycle = "forming" | "raising" | "live" | "dissolved";

/** Lifecycle, from sheet 2. What is true of the land and the building. */
export type PropertyLifecycle = "acquired" | "development" | "stabilised";

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
  readonly deposit: bigint;
  readonly lockIn: string;
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
  readonly propertyLifecycle: PropertyLifecycle;
  readonly commitments: string;
  /** Plate hue. A design token index, not a colour literal (§29). */
  readonly hue: number;

  readonly stack: CapitalStack;
  readonly ladder: Ladder;
  readonly offering: Offering;
  readonly operating: Operating;
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
  lifecycle: "forming",
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
  propertyLifecycle: "development",
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
    subscribed: 5,
    available: 1,
    deposit: 50000_0000n,
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
  },
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
  lifecycle: "forming",
  audited: false,

  /* The intake writes "Slowspace Solace " with a trailing space and a
     lower-case S in the brand. Trimmed and cased to match SlowSpace
     Coastal, because the slug and every heading derive from it. */
  propertyName: "Slowspace Solace",
  assetCode: "CKB-01",
  jurisdiction: "Chikkaballapur, Karnataka",
  coordinates: null,
  landArea: "1.55 acres (0.20 owned + 1.35 leased)",
  keys: 6,
  propertyLifecycle: "development",
  commitments:
    "8 guntas owned (freehold) + 1 acre 14 guntas leased (leasehold). PACK_ARID_HILL climate mutation.",
  hue: 35,

  stack: {
    land: 10000000_0000n,
    formation: 10000000_0000n,
    facility: 30000000_0000n,
    /* CONFLICT C-03: sheet 3 says ₹2.00 Cr, sheet 4 says ₹2.50 Cr. */
    equityLayer: 20000000_0000n,
    projectTotal: 50000000_0000n,
    moratorium: "Interest-only during months 1–18",
    covenant: "DSCR 1.50x minimum",
  },
  ladder: { minimumInvestmentBps: 1000, minUnitBps: 500, stepBps: 500, ceilingBps: 5000 },
  offering: {
    totalEquity: 25000000_0000n,
    promoter: 10000000_0000n,
    offered: 15000000_0000n,
    units: 6,
    unitPrice: 2500000_0000n,
    subscribed: 0,
    available: 6,
    deposit: 50000_0000n,
    lockIn: "36 months from financial close",
  },
  operating: {
    adr: 12000_0000n,
    occupancyBps: 5000,
    grossRevenue: 13140000_0000n,
    /*
     * Four of six, given by the founder on 4 Aug 2026 and superseding the
     * intake's blank row.
     *
     * The operator takes 4,000 bps here against 3,500 on both other
     * vehicles — a real difference, stated rather than smoothed. What is
     * still open is how the remaining 4,000 bps divide between the debt
     * and the partners. On a vehicle carrying a ₹3.0 Cr facility that
     * split is the whole of what a partner receives.
     */
    waterfall: {
      operator: 4000, brand: 1500, adminReserve: 250,
      sinkingFund: 250, debtService: null, toPartners: null,
    },
    reserveFloor: null,
    yieldConfidence: null,
  },
  /* Sheet 6 and sheet 7 are empty for this vehicle. */
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
  coordinates: null,
  landArea: "10 acres (possession)",
  keys: 20,
  propertyLifecycle: "acquired",
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
    deposit: 50000_0000n,
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
      operator: 3500, brand: 1500, adminReserve: 250,
      sinkingFund: 250, debtService: 1500, toPartners: 3000,
    },
    reserveFloor: 8700000_0000n,
    yieldConfidence: "estimated",
  },
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

export const VEHICLES: readonly Vehicle[] = [SLOWSPACE, SOLACE, COORGCREEK];

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
    id: "C-03", vehicle: "solace", severity: "blocking",
    what: "The capital stack disagrees with the offering sheet.",
    sides: [
      "Sheet 3 (Capital stack): equity ₹2.00 Cr, project ₹5.00 Cr",
      "Sheet 4 (Units & ladder): equity ₹2.50 Cr, project ₹5.50 Cr",
    ],
    why:
      "₹50 lakh of equity, and the two sheets are the two places the same number is stated. Every " +
      "unit price, share percentage and yield for this vehicle divides by it.",
    settledBy: "Whichever sheet is current",
  },
  {
    id: "C-04", vehicle: "slowspace", severity: "blocking",
    what: "Site area disagrees with the figure the platform has been showing.",
    sides: [
      "Intake sheet 2: .3 acres · dual frontage",
      "app/_assemblies/data.ts, from the site dossier: 1.42 acres · dual frontage",
      "Spatial ledger (Confluence): site 4.4 acres, buildable envelope 2.3 acres",
    ],
    why:
      "Three figures for one site, on the vehicle that is already public and already has five of " +
      "six units subscribed. The ledger's 2.3-acre buildable envelope is close enough to the " +
      "intake's '.3' to suggest a truncated 2.3 — which would make the site 4.4 acres and both " +
      "smaller figures wrong. Somebody who has committed money has been shown one of these.",
    settledBy: "The survey record, against the Confluence site dossier",
  },
  {
    id: "C-05", vehicle: "solace", severity: "blocking",
    what: "The waterfall states four stages of six. — PARTLY SETTLED 4 Aug 2026",
    sides: [
      "Stated: operator 4,000 · brand 1,500 · admin reserve 250 · sinking fund 250 = 6,000 bps",
      "Outstanding: debt service and to partners, together 4,000 bps",
    ],
    why:
      "The four settled stages supersede the intake's blank row. What remains is the one split a " +
      "partner actually cares about: on a vehicle carrying a ₹3.0 Cr facility, how 4,000 bps of " +
      "gross divides between servicing that debt and reaching the partners. Nothing downstream — " +
      "distribution, yield, reserve adequacy — can be computed until it is set.",
    settledBy: "The debt service and partner shares, which must total 4,000 bps",
  },
  {
    id: "C-06", vehicle: "slowspace", severity: "blocking",
    what: "The unit structure disagrees with the modelled canon.",
    sides: [
      "Intake sheet 4: 6 units at ₹40,00,000, 5 subscribed, 1 available, plus a ₹1.6 Cr promoter stake",
      "app/_assemblies/slowspace.ts: 20 units at ₹20,00,000, 11 subscribed, 45% remaining, no promoter",
    ],
    why:
      "These are different instruments, not different roundings. The intake introduces a 40% " +
      "sponsor stake the canon does not model, and moves availability from 45% to 10%. The public " +
      "offering page currently reads from the canon.",
    settledBy: "Whether the promoter stake is real, and which availability is current",
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
    id: "C-09", vehicle: "slowspace", severity: "blocking",
    what: "Entitlement begins five months after construction ends.",
    sides: [
      "Intake sheet 6: entitlement begins at handover, Jan 2028",
      "Spatial ledger gantt: Confluence runs Sep 2026 – Aug 2027",
    ],
    why:
      "A partner subscribing today is told when they can first use the place. The two documents " +
      "disagree by five months, and the earlier date is the one in the construction programme " +
      "while the later one is in the document a partner reads.",
    settledBy: "The programme date, against what subscribers have been told",
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
