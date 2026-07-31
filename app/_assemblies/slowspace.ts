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

import { inr, rate, allocate, decimalRatio, type Confidence } from "./data";

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
    { n: "Mangaluru International (IXE)", d: "45–55 min", km: "38 km", conf: "observed" as Confidence },
    { n: "NH-66", d: "3 min", km: "1.5 km", conf: "observed" as Confidence },
    { n: "Udupi town", d: "28 min", km: "22 km", conf: "observed" as Confidence },
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

/* ── The unit ─────────────────────────────────────────────────────── */
export const UNIT = {
  commitment: 4000000_0000n,    // ₹40,00,000
  sharePct: 1000,               // 10.00%, in basis points
  nights: { min: 18, max: 21 },
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
 */
export const DEPOSIT = {
  amount: 50000_0000n,          // ₹50,000
  refundable: "Refundable in full until the Vehicle Agreement is signed.",
  balance: UNIT.commitment - 50000_0000n,
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

export const RETURNS = {
  cashYield: { v: MY_YIELD_BPS / 100, conf: "modelled" as Confidence },
  dscr: { v: DSCR, conf: "modelled" as Confidence },
  payback: { v: 5.5, conf: "modelled" as Confidence },
  irr: { v: 30, conf: "forecast" as Confidence },
  exitValuation: { v: 123000000_0000n, conf: "forecast" as Confidence },
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
