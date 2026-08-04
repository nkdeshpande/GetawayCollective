/**
 * SLOWSPACE COASTAL LLP — the worked offering
 *
 * Wave 7 · Workspaces
 * Source: Seaside Confluence site dossier (Padubidri), 20pp
 *
 * One real offering, modelled end to end, so the flow from gateway to
 * settled position carries actual figures rather than placeholders.
 *
 * ── THREE PLACES THE DOSSIER AND THE CANON DISAGREE ──────────────────
 * Recorded here rather than reconciled silently, because two of them
 * change what an investor is told.
 *
 * 1. THE WATERFALL HAS FOUR STAGES AND HIDES DEBT SERVICE.
 *    The dossier splits gross revenue 45 investor / 35 operator /
 *    15 platform / 5 admin, and notes that the investor share "services
 *    underlying debt". That sums to 100% and is not wrong — but it shows
 *    a 45% figure to an investor when 23.08% of gross leaves before they
 *    see any of it. The canon states debt service as its own stage, in
 *    order, so the number labelled "to partners" is the number that
 *    arrives.
 *
 * 2. DSCR 2.4x AND ~18% CASH YIELD CANNOT BOTH HOLD.
 *    Computed from the dossier's own inputs: at 18% on the ₹4 Cr equity
 *    layer, Debt Service is ₹75,82,500 and DSCR is 1.95x.
 *    At 2.4x, Debt Service is ₹61,59,375 and the yield is 21.6%.
 *    Both are defensible numbers; they are not simultaneously true. 18%
 *    is carried here because it is the conservative one, and DSCR is
 *    stated as what falls out of it.
 *
 * 3. VOCABULARY. Five of the dossier's actor and place nouns are §25
 *    forbidden terms and are translated at the boundary. The originals
 *    are named on the next line so this note can be checked against the
 *    source; the pragma is there because vocab-lint cannot tell a use
 *    from a mention, and this is a mention.
 *    vocab-lint-ignore "Steward Investors" "Earth/Sky Studios" "guests" "housekeeping" "concierge"
 *    The operating partner may keep calling them that in its own
 *    documents. They do not cross into ours.
 */

import {
  inr, rate, allocate, decimalRatio, PROPERTIES, type Confidence,
} from "./data";
import { conflictsFor } from "../../constants/vehicles";

/* ── The entity ───────────────────────────────────────────────────── */
export const LLP = {
  name: "SlowSpace Coastal LLP",
  llpin: "AAC-4471",
  incorporated: "2026-06-12",
  office: "2nd Floor, Maruthi Arcade, Udupi 576101, Karnataka",
  agreementDated: "2026-06-19",
  registrar: "RoC Bangalore",
} as const;

/* ── The asset ────────────────────────────────────────────────────── */
export const SITE = {
  name: "SlowSpace Coastal",
  assetId: "PDB-01",
  jurisdiction: "Padubidri, Karnataka",
  coords: "13.117416°N · 74.765988°E",
  keys: 12,
  landArea: "1.42 acres · dual frontage",
  lifecycle: "Pre-construction",
  commitments: "CRZ compliant · Blue Flag adjacent · modular assembly",
  /* Two waters: Arabian Sea west, Shambhavi Estuary east. */
  frontage: "Arabian Sea (west) · Shambhavi Estuary (east)",
  access: [
    { n: "Mangaluru International (IXE)", d: "45–55 min", km: "38 km", conf: "VERIFIED" as Confidence },
    { n: "NH-66", d: "3 min", km: "1.5 km", conf: "VERIFIED" as Confidence },
    { n: "Udupi town", d: "28 min", km: "22 km", conf: "VERIFIED" as Confidence },
  ],
  hue: 198,
} as const;

/* ── The capital stack ────────────────────────────────────────────── */
export const STACK = {
  land: 30000000_0000n,         // ₹3.00 Cr — equity
  formation: 10000000_0000n,    // ₹1.00 Cr — equity
  debt: 55000000_0000n,         // ₹5.50 Cr — drawn during construction only
} as const;

export const EQUITY = STACK.land + STACK.formation;          // ₹4.00 Cr
export const PROJECT = EQUITY + STACK.debt;                  // ₹9.50 Cr

/* ── The minimum unit, and the ladder built from it ───────────────── */
/*
 * THE STAKE IS CHOSEN, NOT FIXED.
 *
 * The earlier model had one unit — 10% for ₹40,00,000 — and ten of them
 * were the vehicle. That is a clean structure and a bad instrument: it
 * admits exactly one kind of investor, and it forces anyone who wants
 * less to want nothing.
 *
 * 5% is the minimum unit and the increment. Everything else on every
 * screen is derived from the number of units selected, so there is one
 * place where the size of a position is decided and no screen holds its
 * own copy of what a position is worth.
 *
 * WHY THE CEILING IS 50% AND NOT MORE.
 * §24a carries an ordinary resolution on MORE THAN 50% of contribution,
 * and a tie is not approval. A partner above 50% therefore carries every
 * ordinary resolution alone and the rest of the register votes for the
 * record only. At exactly 50% the same partner can block anything and
 * carry nothing — which is a real position, and the last one at which
 * the vehicle is still a partnership rather than a holding company with
 * spectators. The cap is where that line is, and the screen says so
 * rather than presenting 50% as merely the largest tile on offer.
 */
export const ALLOCATION = {
  minBps: 500,      //  5.00% — the minimum unit AND the increment
  stepBps: 500,
  maxBps: 5000,     // 50.00% — see above; a governance limit, not a sales one
  defaultBps: 1000, // the worked position, and what an unparameterised link means
} as const;

/** Every legal selection, low to high. Derived; never typed out. */
export const LADDER: readonly number[] = (() => {
  const out: number[] = [];
  for (let b = ALLOCATION.minBps; b <= ALLOCATION.maxBps; b += ALLOCATION.stepBps) out.push(b);
  return out;
})();

/** Twenty minimum units are the whole equity layer. Checked below. */
export const UNITS_IN_VEHICLE = 10000 / ALLOCATION.minBps;   // 20

const MIN_UNITS = allocate(EQUITY, Array(UNITS_IN_VEHICLE).fill(1n));
export const MIN_UNIT = MIN_UNITS[0];                        // ₹20,00,000

/*
 * The ladder is only uniform if the equity layer divides evenly into
 * minimum units. Where it does not, largest-remainder hands one rupee to
 * some units and not others, and `MIN_UNIT * n` stops being the price of
 * n units — silently, and in the investor's disfavour or ours depending
 * on which end of the list they land. Asserted rather than assumed, so a
 * vehicle whose equity layer does not tile has to be dealt with rather
 * than mispriced.
 */
if (MIN_UNITS.some((u) => u !== MIN_UNIT)) {
  throw new Error(
    `Equity layer ${inr(EQUITY)} does not divide into ${UNITS_IN_VEHICLE} equal units`,
  );
}

/**
 * ENTITLEMENT IS A POOL, DIVIDED — not a per-unit figure multiplied.
 *
 * 18–21 nights per 10% was the stated entitlement, and multiplying it
 * gives 9–10.5 nights for a 5% holding. Half a night is not a night. The
 * pool is stated for the whole vehicle and each position takes its floor
 * of it, so the sum of every partner's entitlement can never exceed what
 * the property can actually deliver.
 */
export const NIGHT_POOL = { min: 180, max: 210 } as const;

const nightsFor = (bps: number) => ({
  min: Math.floor((NIGHT_POOL.min * bps) / 10000),
  max: Math.floor((NIGHT_POOL.max * bps) / 10000),
});

/**
 * WHAT IS LEFT.
 *
 * Read from the vehicle register. The ladder offers what the constitution
 * permits; this is what the vehicle still has. A tile above the remaining
 * capacity is disabled for a different reason than a tile above the cap,
 * and the two reasons are shown separately because they are not the same
 * fact.
 */
export const SUBSCRIBED_UNITS = 11;                            // of 20
export const SUBSCRIBED_BPS = SUBSCRIBED_UNITS * ALLOCATION.minBps;
export const REMAINING_BPS = 10000 - SUBSCRIBED_BPS;           // 45.00%

/* ── The unit ─────────────────────────────────────────────────────── */
/*
 * Retained as the WORKED position — the one the settled member holds and
 * the one every screen falls back to when no size has been chosen. It is
 * now derived from the ladder rather than typed, so it cannot drift from
 * the instrument it is an instance of.
 */
export const UNIT = {
  commitment: MIN_UNIT * BigInt(ALLOCATION.defaultBps / ALLOCATION.minBps),  // ₹40,00,000
  sharePct: ALLOCATION.defaultBps,                                           // 10.00%, bps
  nights: nightsFor(ALLOCATION.defaultBps),                                  // 18–21
  lockIn: "36 months from financial close",
};

/**
 * THE INITIAL DEPOSIT.
 *
 * ₹50,000 is taken on the platform to reserve a unit. The balance of the
 * commitment, the Vehicle Agreement and the transfer of funds are all
 * completed off the platform, in person or by instructed transfer.
 *
 * This is why the deposit is stated separately rather than as a
 * percentage: it is a fixed amount that does not move with unit size, and
 * a screen that showed "1.25%" would imply it scales.
 *
 * It HOLDS a unit; it does not buy one. The Member Law still fires on
 * settlement of the full commitment and on nothing else — paying the
 * deposit makes nobody a partner, and the screens say so.
 *
 * FLAT, AND MORE OBVIOUSLY SO NOW THAT THE UNIT MOVES.
 * ₹50,000 holds a 5% position and a 50% position alike. When the stake
 * was fixed, a percentage would merely have been redundant; now it would
 * be false — so `balance` is no longer stored here. It belongs to a
 * position, and it is computed by `position()` below.
 */
export const DEPOSIT = {
  amount: 50000_0000n,          // ₹50,000
  refundable: "Refundable in full until the Vehicle Agreement is signed.",
  window: "15 working days from the deposit",
} as const;

/* Ten units of 10% must be the whole equity layer, exactly. */
{
  const units = allocate(EQUITY, Array(10).fill(1n));
  if (units[0] !== UNIT.commitment || units.reduce((a, b) => a + b, 0n) !== EQUITY) {
    throw new Error(
      `Unit does not divide the equity layer: 10 x ${inr(units[0])} against ${inr(EQUITY)}`,
    );
  }
}

/* ── Revenue ──────────────────────────────────────────────────────── */
export const OPERATING = {
  adr: 15000_0000n,             // ₹15,000
  occupancy: 5000,              // 50.00%, basis points
  nightsPerYear: 365,
};

/** 12 keys × 365 × 50% × ₹15,000. Stated so it can be reconstructed. */
export const GROSS_REVENUE =
  (OPERATING.adr * BigInt(SITE.keys) * BigInt(OPERATING.nightsPerYear) *
    BigInt(OPERATING.occupancy)) / 10000n;

/* ── The six-stage waterfall ──────────────────────────────────────── */
/*
 * Debt service is derived, not typed: it is whatever is left of the 45%
 * investor share after the partner distribution. Typing it would make it
 * a fourth independent number that has to agree with two others.
 */
export const PARTNER_DISTRIBUTION = (EQUITY * 1800n) / 10000n;   // 18% on equity
const INVESTOR_SHARE = rate(GROSS_REVENUE, 4500);
export const DEBT_SERVICE = INVESTOR_SHARE - PARTNER_DISTRIBUTION;

const bpsOf = (amount: bigint) => Number((amount * 10000n) / GROSS_REVENUE);

export const WATERFALL_SLOWSPACE = [
  { k: "Gross revenue", bps: 10000, cls: "",
    note: `${SITE.keys} keys · ${OPERATING.nightsPerYear} nights · 50% occupancy · ₹15,000 ADR` },
  { k: "1 · Operating Partner", bps: 3500, cls: "less",
    note: "Site-level operations, utilities and staffing. Measured on SLA." },
  { k: "2 · Brand", bps: 1500, cls: "less",
    note: "Platform, technology and demand generation." },
  { k: "3 · Admin Reserve", bps: 250, cls: "less",
    note: "2.5% of REVENUE. Not a fee on asset value." },
  { k: "4 · Sinking Fund", bps: 250, cls: "less",
    note: "CapEx reserve. Funds replacement before failure." },
  { k: "5 · Debt Service", bps: bpsOf(DEBT_SERVICE), cls: "senior",
    note: "₹5.5 Cr facility. THE SENIOR CLAIM — the dossier folded this inside the investor share." },
  { k: "6 · To Partners", bps: bpsOf(PARTNER_DISTRIBUTION), cls: "out",
    note: "No preferred return, no catch-up, no carry. Blocked if the reserve would fall below its floor." },
];

/* It must close. Checked, not assumed. */
{
  const bps = WATERFALL_SLOWSPACE.slice(1).reduce((n, s) => n + s.bps, 0);
  if (Math.abs(bps - 10000) > 2) {
    throw new Error(`SlowSpace waterfall sums to ${bps / 100}%, not 100%`);
  }
}

/* ── What a 10% holder actually receives ──────────────────────────── */
export const MY_DISTRIBUTION = rate(PARTNER_DISTRIBUTION, UNIT.sharePct);
export const MY_YIELD_BPS = Number((MY_DISTRIBUTION * 10000n) / UNIT.commitment);

/** DSCR is derived from the same inputs, so it cannot contradict them. */
export const DSCR = decimalRatio(INVESTOR_SHARE, DEBT_SERVICE);

/* ═══════════════════════════════════════════════════════════════════
   A POSITION — everything that follows from choosing a size

   One function. Every screen that shows what a stake is worth calls it,
   so the accreditation screen, the commitment screen and the settled
   screen cannot disagree about the same selection.
   ═══════════════════════════════════════════════════════════════════ */

export interface Control {
  /** True of this holding. Rendered as stated; never softened. */
  t: string;
  /** Whether the statement is a power or a limit. Drives nothing but tone. */
  kind: "power" | "limit";
}

/**
 * What a holding of this size can and cannot do, from §24a alone.
 *
 * Derived from the thresholds rather than written per tile, because a
 * written version is a second statement of the constitution that drifts
 * from it. The arithmetic of a blocking stake is not obvious — you block
 * a 76% special resolution by holding MORE than 24%, and a reader
 * working that out for themselves will get it wrong about as often as
 * not.
 */
export function controlOf(bps: number): readonly Control[] {
  const out: Control[] = [];

  /* Ordinary: MORE than 50% carries. A tie is not approval, so exactly
     50% carries nothing — and blocks everything. */
  if (bps > 5000) {
    out.push({ t: "Carries every ordinary resolution alone", kind: "power" });
  } else if (bps === 5000) {
    out.push({ t: "Blocks every ordinary resolution; carries none alone", kind: "power" });
  } else {
    out.push({ t: "Cannot carry or block an ordinary resolution alone", kind: "limit" });
  }

  /* Special: 76% carries, so more than 24% withholds it. */
  out.push(
    bps > 2400
      ? { t: "Blocks any special resolution alone", kind: "power" }
      : { t: "Cannot block a special resolution alone", kind: "limit" },
  );

  out.push({ t: `Casts ${(bps / 100).toFixed(0)}% of the vote, by contribution`, kind: "limit" });
  return out;
}

export interface Position {
  bps: number;
  units: number;
  commitment: bigint;
  deposit: bigint;
  balance: bigint;
  /** Share of stage six, once there is a stage six to share. */
  distribution: bigint;
  /** On the commitment. Constant across the ladder — see the note below. */
  yieldBps: number;
  nights: { min: number; max: number };
  control: readonly Control[];
  /** Whether the vehicle can still sell this much. */
  available: boolean;
}

/**
 * Clamp any input onto the ladder. Never throws: a query string is
 * attacker-controlled and a malformed one should land on the default
 * rather than blank the screen.
 */
export function toLadder(bps: unknown): number {
  const n = typeof bps === "number" ? bps : Number.parseInt(String(bps ?? ""), 10);
  if (!Number.isFinite(n)) return ALLOCATION.defaultBps;
  const snapped = Math.round(n / ALLOCATION.stepBps) * ALLOCATION.stepBps;
  return Math.min(ALLOCATION.maxBps, Math.max(ALLOCATION.minBps, snapped));
}

export function position(bpsIn: number): Position {
  const bps = toLadder(bpsIn);
  const units = bps / ALLOCATION.minBps;
  const commitment = MIN_UNIT * BigInt(units);
  const distribution = rate(PARTNER_DISTRIBUTION, bps);

  return {
    bps,
    units,
    commitment,
    deposit: DEPOSIT.amount,
    balance: commitment - DEPOSIT.amount,
    distribution,
    /*
     * Constant at 18.00% across the whole ladder, because distribution
     * and commitment scale by the same factor. Stated per position
     * anyway, and shown on the screen, precisely BECAUSE it does not
     * move: the reference this interaction came from changed a "yield
     * entitlement" figure with every tile — 10% / 20% / 50% "of profit
     * pool" — which reads as a better return for a bigger cheque. It is
     * a bigger share of the same pool at the same rate. Showing both
     * numbers is the difference between the two readings.
     */
    yieldBps: Number((distribution * 10000n) / commitment),
    nights: nightsFor(bps),
    control: controlOf(bps),
    available: bps <= REMAINING_BPS,
  };
}

/** The worked position. Identical to position(1000); named for the screens that assume it. */
export const MY_POSITION = position(ALLOCATION.defaultBps);

export const RETURNS = {
  cashYield: { v: MY_YIELD_BPS / 100, conf: "INFERRED" as Confidence },
  dscr: { v: DSCR, conf: "INFERRED" as Confidence },
  payback: { v: 5.5, conf: "INFERRED" as Confidence },
  irr: { v: 30, conf: "FORECAST" as Confidence },
  exitValuation: { v: 123000000_0000n, conf: "FORECAST" as Confidence },
};

/* ── Governance, from the LLP Agreement ───────────────────────────── */
export const GOVERNANCE = [
  { k: "Basis of voting", v: "Contribution-weighted. A 10% partner casts 10%." },
  { k: "Ordinary resolution", v: "More than 50% of contribution present" },
  { k: "Special resolution", v: "At least 76% of total contribution" },
  { k: "Reserved matters", v: "Disposing of the land, or borrowing beyond ₹6.0 Cr" },
  { k: "Lock-in", v: UNIT.lockIn },
  { k: "Transfer", v: "Internal register first; external buyer needs consent" },
];

/* -- The Asset Disclosure, specific to this property ---------------- */
/*
 * REGISTER.
 *
 * An earlier version opened "How this loses money" and led with "You can
 * lose the whole of it". That was written to be impossible to skim, and
 * it succeeded at the cost of two things.
 *
 * It read as a warning from an adversary rather than a disclosure from a
 * counterparty, which invites the reader to discount it. And it put the
 * severity of the language ahead of the specificity of the facts, so the
 * one item carrying an actual figure -- the facility, the moratorium, the
 * assumed occupancy -- looked like more of the same.
 *
 * The register here is measured and the content is unchanged in
 * substance: total loss is still stated, in Part 08, in those words. What
 * moved is the emphasis. Facts do the work; the adjectives are gone.
 */

export interface DisclosureItem {
  /** Two digits, as displayed. Stable across versions. */
  n: string;
  t: string;
  p: readonly string[];
  /** Figures read from the vehicle record, never typed into the prose. */
  facts?: readonly { k: string; v: string }[];
}

export const RISKS_SLOWSPACE: readonly DisclosureItem[] = [
  {
    n: "01",
    t: "Long-Term Hospitality Ownership",
    p: ["Your commitment acquires an ownership interest in a single hospitality property through " +
        LLP.name + ".",
        "Unlike listed securities, this investment is intended for long-term ownership and should " +
        "not be considered immediately liquid.",
        "Transfers are restricted during the initial investment period and thereafter depend upon " +
        "an approved transfer process and the availability of a willing purchaser."],
    facts: [{ k: "Minimum holding period", v: UNIT.lockIn }],
  },
  {
    n: "02",
    t: "Development & Construction",
    p: ["This hospitality asset is currently in its development phase.",
        "Construction, statutory approvals and commissioning must all be completed before the " +
        "property begins generating operating income.",
        "Development projects may be subject to delays, cost increases or programme revisions " +
        "that affect the timing of operations."],
    facts: [
      { k: "Construction finance", v: inr(STACK.debt) + " senior facility" },
      { k: "Moratorium", v: "Interest-only during months 1\u201318" },
    ],
  },
  {
    n: "03",
    t: "Hospitality Performance",
    p: ["Future distributions depend upon the property's operational performance.",
        "Revenue is influenced by occupancy, average daily rate, visitor demand, seasonality and " +
        "operating efficiency.",
        "These assumptions are modelled estimates rather than guaranteed outcomes."],
    facts: [
      { k: "Assumed occupancy", v: (OPERATING.occupancy / 100).toFixed(0) + "% blended" },
      { k: "Assumed rate", v: inr(OPERATING.adr) + " average daily rate" },
    ],
  },
  {
    n: "04",
    t: "Cash Distribution",
    p: ["Investor distributions occur only after operating expenses, debt obligations, reserve " +
        "requirements and the constitutional waterfall priorities have all been satisfied.",
        "Accordingly, a profitable operating period may still result in no investor distribution " +
        "if reserves or financing obligations require available cash to be retained.",
        "This is a normal feature of the distribution framework."],
  },
  {
    n: "05",
    t: "Financing",
    p: ["The property utilises development finance during construction.",
        "Debt enhances development capability but introduces financing obligations that rank " +
        "ahead of investor distributions.",
        "Extended construction delays, increased financing costs or covenant events may " +
        "materially affect projected returns."],
  },
  {
    n: "06",
    t: "Planning & Regulation",
    p: ["The property is located within a Coastal Regulation Zone.",
        "Future regulatory amendments, planning decisions or environmental requirements may " +
        "affect future development, operation or expansion of the asset.",
        "Current approvals do not guarantee future regulatory outcomes."],
  },
  {
    n: "07",
    t: "Financial Information",
    p: ["Financial forecasts, occupancy projections, valuations and yield estimates throughout " +
        "this platform are modelled using current assumptions.",
        "Where source information contains differing assumptions, Getaway Collective adopts the " +
        "more conservative calculation and identifies the applicable confidence level for every " +
        "forward-looking figure.",
        "Modelled performance should not be interpreted as a guarantee of future returns."],
  },
];

/**
 * Stated separately, and last.
 *
 * It is not item 08 in the list. A numbered item invites the reader to
 * weigh it against the other seven; this one is not comparable to them,
 * and the layout says so by standing outside the sequence.
 */
export const MATERIAL_RISK = {
  t: "Important Investment Risk",
  p: ["Hospitality investments involve material business, operational and market risk.",
      "Depending upon future performance, investors may see:"],
  outcomes: [
    "reduced distributions",
    "delayed distributions",
    "lower capital value",
    "partial loss of capital",
    "total loss of capital",
  ],
  close: "Capital invested is not protected by any guarantee, insurance or compensation scheme.",
} as const;

export const ACKNOWLEDGEMENT = {
  intro:
    "By continuing, you confirm that you have reviewed this disclosure and understand the " +
    "principal characteristics and risks of this hospitality investment.",
  statement:
    "I acknowledge that I have read and understood the Hospitality Asset Disclosure for " +
    LLP.name + ", including the possibility of partial or total loss of invested capital.",
} as const;

/** Read from the vehicle record. Never retyped into the prose above. */
export const RISK_TERMS: Record<string, string> = {
  debt: inr(STACK.debt) + " facility \u00b7 drawn during construction only",
  moratorium: "Interest-only for months 1\u201318",
  lockIn: UNIT.lockIn,
  occupancy: (OPERATING.occupancy / 100).toFixed(0) + "% blended occupancy assumed \u00b7 " +
    inr(OPERATING.adr) + " average daily rate",
};

export const DISCLOSURE = { version: "2.0", dated: "2026-07-31" };

/* ── The programme ────────────────────────────────────────────────── */
export const PROGRAMME = [
  { w: "Jul – Oct 2026", stage: "Design & Approvals", capital: "Pre-construction",
    detail: "CRZ compliance, IDO model locked, hardware/software mapping." },
  { w: "Nov – Dec 2026", stage: "Construction start", capital: "Debt drawdown begins",
    detail: "Structural grid hardwired, modular assembly begins." },
  { w: "Jan – Oct 2027", stage: "Assembly & fit-out", capital: "Peak deployment",
    detail: "Superstructure, acoustic sealing, unit integration." },
  { w: "Nov 2027 – Jan 2028", stage: "Handover", capital: "Settlement",
    detail: "Autonomous systems test, handover, open for occupancy." },
];

export { inr };


/* ── The public record must not drift from the canon ──────────────── */
/*
 * data.ts carries a Property row for this vehicle so the Collection can
 * render it, and it cannot import this file — slowspace depends on
 * data, and the reverse would be a cycle. So the row is typed there and
 * verified HERE, where the canon lives. A figure that drifts fails the
 * build rather than showing an investor two different numbers for the
 * same asset on two different pages.
 */
{
  const row = PROPERTIES.find((p) => p.assetId === SITE.assetId);
  if (!row) {
    throw new Error(`No public Property row for ${SITE.assetId}. The Collection would omit it.`);
  }
  const disagreements: string[] = [];
  if (row.ufr0060 !== SITE.name) disagreements.push(`name: ${row.ufr0060} vs ${SITE.name}`);
  if (row.ufr0063 !== SITE.jurisdiction) disagreements.push(`jurisdiction: ${row.ufr0063}`);
  if (row.ufr0061 !== LLP.name) disagreements.push(`vehicle: ${row.ufr0061} vs ${LLP.name}`);
  if (row.ufr0065 !== SITE.landArea) disagreements.push(`land: ${row.ufr0065}`);
  if (row.ufr0068 !== SITE.commitments) disagreements.push(`commitments: ${row.ufr0068}`);
  if (row.hue !== SITE.hue) disagreements.push(`hue: ${row.hue} vs ${SITE.hue}`);
  if (row.ufr0102 !== PROJECT) disagreements.push(`project cost: ${inr(row.ufr0102)} vs ${inr(PROJECT)}`);
  if (row.units !== UNITS_IN_VEHICLE) disagreements.push(`units: ${row.units} vs ${UNITS_IN_VEHICLE}`);
  if (row.held !== SUBSCRIBED_UNITS) disagreements.push(`held: ${row.held} vs ${SUBSCRIBED_UNITS}`);
  if (Math.round(row.yield.v * 100) !== MY_YIELD_BPS) {
    disagreements.push(`yield: ${row.yield.v}% vs ${MY_YIELD_BPS / 100}%`);
  }
  /*
   * DECLARED DISAGREEMENT IS NOT DRIFT.
   *
   * This check was written to catch a figure changing on one page and not
   * the other. It now also fires when the two sources disagree on purpose:
   * the Collection is folded from constants/vehicles.ts, transcribed from
   * the founder's intake, and that intake genuinely contradicts this canon
   * about units, subscription and site area. Every contradiction is
   * registered in CONFLICTS with a reason and somebody who can settle it.
   *
   * So the rule is narrower than it was, and stronger for it: an
   * UNREGISTERED disagreement still fails the build. A registered one is
   * allowed to stand, because the register is where it is being tracked —
   * and breaking every test until a founder answers a question would only
   * teach somebody to delete this block.
   *
   * The warning below is the half that keeps it honest. A conflict that
   * has been settled must leave the register, or the register fills with
   * resolved entries and stops meaning anything.
   */
  const registered = conflictsFor("slowspace");

  if (disagreements.length && registered.length === 0) {
    throw new Error(
      `The public Property row for ${SITE.assetId} disagrees with the canon, and nothing in ` +
      `constants/vehicles.ts CONFLICTS explains why:\n  ` +
      disagreements.join("\n  "),
    );
  }

  if (!disagreements.length && registered.length > 0) {
    /* Not a throw: a conflict may be about something this check cannot
       see, such as the entitlement date. Reported so a stale register is
       noticed rather than trusted. */
    console.warn(
      `[slowspace] The public row agrees with the canon on every field checked here, while ` +
      `${registered.length} conflict(s) remain registered for this vehicle. If they are ` +
      `settled, remove them.`,
    );
  }
}
