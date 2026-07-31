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

import { inr, rate, allocate, type Confidence } from "./data";

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
export const DSCR = Number((INVESTOR_SHARE * 100n) / DEBT_SERVICE) / 100;

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

/* ── The risk disclosure, specific to this offering ───────────────── */
export const RISKS_SLOWSPACE = [
  { sev: 1, t: "You can lose the whole of it",
    p: "This is contribution to an LLP that will own a building that does not exist yet. Construction " +
       "has not started. If the vehicle cannot meet its obligations, partners are paid last and may " +
       "be paid nothing. There is no capital protection and no compensation scheme behind this." },
  { sev: 1, t: "The asset is unbuilt, and the debt is real",
    p: "₹5.5 Cr of facility is drawn during construction against an asset that is not yet earning. " +
       "A delay past January 2028 means servicing that debt from a property with no revenue, and " +
       "the reserve is sized for six months, not for an open-ended overrun.",
    terms: ["debt", "moratorium"] },
  { sev: 1, t: "You cannot get out for three years, and possibly longer",
    p: "There is no public market. Your position is locked for 36 months from financial close, and " +
       "after that a transfer needs a buyer and consent. An internal register is operated, not " +
       "guaranteed.",
    terms: ["lockIn"] },
  { sev: 2, t: "The yield depends on a coastal season",
    p: "The model assumes 50% blended occupancy at ₹15,000. Monsoon months on this coast run far " +
       "below that, and the annual figure carries a peak season that has not happened yet. A weak " +
       "winter takes the distribution down with it.",
    terms: ["occupancy"] },
  { sev: 2, t: "Distribution can be blocked while the vehicle is healthy",
    p: "Stage six does not run if paying it would take the reserve below its floor, or if stage five " +
       "was unmet. That is the mechanism working as designed, and it means a profitable quarter can " +
       "still pay you nothing." },
  { sev: 2, t: "Coastal regulation can change what can be built",
    p: "The site sits inside a Coastal Regulation Zone. Approvals held today are not a forecast of " +
       "approvals tomorrow, and a CRZ amendment can alter what is permitted on the land after the " +
       "land has been bought." },
  { sev: 3, t: "The returns shown are modelled, and one of them was inconsistent",
    p: "Every forward figure here carries its confidence class. The source dossier claimed both a " +
       "2.4x debt service cover and an 18% cash yield; computed from its own inputs those cannot " +
       "both hold. The conservative one is carried and the cover ratio is stated as what falls out." },
];

/** Read from the vehicle record. Never retyped into the prose above. */
export const RISK_TERMS: Record<string, string> = {
  debt: "₹5,50,00,000 facility · drawn during construction only",
  moratorium: "Interest-only for months 1–18",
  lockIn: UNIT.lockIn,
  occupancy: "50% blended occupancy assumed · ₹15,000 ADR",
};

export const DISCLOSURE = { version: "1.0", dated: "2026-07-24" };

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
