/**
 * THE VEHICLE DOMAIN MODEL — the LLP and its constituents
 *
 * Directed 1 Aug 2026. Supersedes the flat six-domain taxonomy.
 *
 * ── THE SHAPE ────────────────────────────────────────────────────────
 *
 *                     LLP
 *            (Constitutional Vehicle)
 *                      │
 *         ┌────────────┼────────────┐
 *       SPACE        TIME        CAPITAL
 *         └────────────┼────────────┘
 *                 GOVERNANCE
 *
 * Governance is drawn BELOW the three, not beside them, because it is
 * not a fourth business function. It owns no asset, allocates no time,
 * holds no capital. It is the operating law the other three exist
 * inside — and it mirrors the statutory obligations of the LLP Act 2008
 * so that every government compliance has a named counterpart here.
 *
 * ── WHAT A CONSTITUENT IS BACKED BY ──────────────────────────────────
 * Every named thing in this model states what stands behind it. There
 * are exactly six answers, and "nothing, but it sounds right" is not
 * one of them:
 *
 *   object      one of the 27 ratified L2 objects (§33)
 *   field       a named UFR field on one of those objects
 *   derived     computed from ratified data; the formula is stated
 *   code        lives as executable law (the waterfall, the authority
 *               matrix) rather than as a record
 *   registered  a NAMED GAP — the model needs it, no object exists,
 *               and ratifying one is a §33 amendment awaiting the Board
 *   outOfScope  excluded by direction, with the reason recorded
 *
 * The distinction the last two carry: `registered` is work the model is
 * waiting for; `outOfScope` is work the model REFUSES — usage, calendar
 * operations and the time ledger belong to the Operating Company, and
 * pulling them in here would put hospitality inside the vehicle.
 */

import { BusinessObjectType as BO, Domain, BUSINESS_OBJECT_DOMAIN } from "./business-objects";

/* ── Backing ─────────────────────────────────────────────────────── */

export type Backing =
  | { kind: "object"; object: BO }
  | { kind: "field"; ufr: string; object: BO }
  | { kind: "derived"; formula: string; from: readonly BO[] }
  | { kind: "code"; module: string }
  | { kind: "registered"; candidate: string; needs: string }
  | { kind: "outOfScope"; because: string };

export interface Constituent {
  name: string;
  backing: Backing;
  note?: string;
}

export interface Section {
  ref: string;
  name: string;
  constituents: readonly Constituent[];
}

export interface VehicleDomainSpec {
  domain: Domain;
  name: string;
  /** The one question the domain exists to answer. */
  constitutionalQuestion: string;
  charge: string;
  /** True only of Governance: it governs the other three. */
  constitutional: boolean;
  sections: readonly Section[];
}

const obj = (object: BO): Backing => ({ kind: "object", object });
const field = (ufr: string, object: BO): Backing => ({ kind: "field", ufr, object });
const reg = (candidate: string, needs: string): Backing => ({ kind: "registered", candidate, needs });
const out = (because: string): Backing => ({ kind: "outOfScope", because });

/* ═══════════════════════════════════════════════════════════════════
   DOMAIN I · SPACE
   ═══════════════════════════════════════════════════════════════════ */

const SPACE: VehicleDomainSpec = {
  domain: Domain.Space,
  name: "Space",
  constitutionalQuestion: "What does the LLP own?",
  charge:
    "Everything the LLP legally owns, controls, protects and ultimately transfers. " +
    "The constitutional record of every tangible asset forming part of the LLP's ownership: " +
    "the land, the build, the furniture and the fittings.",
  constitutional: false,
  sections: [
    {
      ref: "SP.1",
      name: "Property",
      constituents: [
        { name: "Property Code", backing: obj(BO.Property),
          note: "The asset code (PDB-01) is carried on the record today; a dedicated UFR entry is the E-06 gap to close when the field is next touched." },
        { name: "Property Name", backing: field("UFR-0060", BO.Property) },
        { name: "Property Type", backing: obj(BO.Property),
          note: "Carried on the Property record; the closed type set is an enum question, not a new object." },
        { name: "Investment Thesis", backing: obj(BO.InvestmentThesis),
          note: "An attribute of the asset, constitutionally: the thesis names why THIS property. It moved from Intelligence to Space for that reason." },
        { name: "Asset Status", backing: field("UFR-0066", BO.Property),
          note: "The lifecycle field. Pre-construction → construction → stabilised → disposition." },
        { name: "Documents Folder", backing: reg("PropertyDocument",
          "One object per instrument with kind, custody and hash — a folder is not a record.") },
      ],
    },
    {
      ref: "SP.2",
      name: "Fixed Assets",
      constituents: [
        { name: "Furniture & Fixtures", backing: reg("FixedAsset",
          "Asset register entries with cost, life, and depreciation basis. Required before the first fit-out invoice lands.") },
        { name: "Plant & Machinery", backing: reg("FixedAsset", "Same object, classed plant_machinery.") },
        { name: "Renewable Systems", backing: reg("FixedAsset", "Same object, classed renewable.") },
        { name: "Capital Improvements", backing: reg("FixedAsset",
          "Same object, classed improvement — funded from the Sinking Fund, which is why the class must be distinguishable.") },
      ],
    },
    {
      ref: "SP.3",
      name: "Asset Protection",
      constituents: [
        { name: "Insurance", backing: reg("InsurancePolicy",
          "Policy, insurer, sum insured, expiry. The governance calendar needs the expiry date to fire a compliance event.") },
        { name: "Valuation", backing: obj(BO.Valuation),
          note: "Already ratified. Carries its source and confidence class — a management estimate is not an appraisal." },
      ],
    },
    {
      ref: "SP.4",
      name: "Property Documents",
      constituents: [
        { name: "Drawings", backing: reg("PropertyDocument", "kind: drawing") },
        { name: "Approvals", backing: reg("PropertyDocument",
          "kind: approval. CRZ clearance lives here — the compliance mirror in Governance references it.") },
        { name: "Manuals", backing: reg("PropertyDocument", "kind: manual") },
        { name: "Warranties", backing: reg("PropertyDocument",
          "kind: warranty. Expiry-bearing, like insurance — feeds the governance calendar.") },
        { name: "Asset Registers", backing: reg("FixedAsset",
          "The register IS the set of FixedAsset records; a separate register document would be a copy that drifts.") },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   DOMAIN II · TIME
   ═══════════════════════════════════════════════════════════════════ */

const TIME: VehicleDomainSpec = {
  domain: Domain.Time,
  name: "Time",
  constitutionalQuestion: "How much time does each LLP Partner legally control?",
  charge:
    "Everything the LLP allocates but never creates. Time is not hospitality. Time is " +
    "ownership — an economic right attached to it, a static yearly allocation multiplied " +
    "by the stake. Nothing in this domain is operated; operation belongs to the Operating Company.",
  constitutional: false,
  sections: [
    {
      ref: "TM.1",
      name: "Ownership Calendar",
      constituents: [
        { name: "Calendar Year", backing: reg("OwnershipCalendar",
          "One record per vehicle per year. The vehicle-level pool the allocations divide.") },
        { name: "Allocation Year", backing: reg("OwnershipCalendar",
          "The year an allocation belongs to — distinct from the calendar year it is used in only once rollover policy exists, which is Decision D-07.") },
        { name: "Available Days", backing: {
          kind: "derived",
          formula: "NIGHT_POOL stated per vehicle per year; each position takes floor(pool × stake)",
          from: [BO.InvestmentVehicle, BO.OwnershipPosition],
        }, note: "The pool is stated for the whole vehicle and each position takes its floor, so the sum of every partner's entitlement can never exceed what the property delivers. Multiplying a per-unit figure would invent nights." },
      ],
    },
    {
      ref: "TM.2",
      name: "Allocation Rights",
      constituents: [
        { name: "Ownership Percentage", backing: field("UFR-0242", BO.OwnershipPosition),
          note: "units_held over total_units_issued. The stake is the input; time is one of its outputs." },
        { name: "Annual Day Allocation", backing: {
          kind: "derived",
          formula: "floor(available_days × ownership_percentage)",
          from: [BO.OwnershipPosition],
        }, note: "STATIC. It does not vary with usage, season or behaviour — a right attached to ownership, not a reward attached to conduct." },
        { name: "Reserved Days", backing: reg("AllocationRight",
          "Days the vehicle withholds from the pool before division — maintenance closures, statutory closures.") },
        { name: "Blackout Rules", backing: reg("AllocationRight",
          "Vehicle-level rules constraining when allocation may be drawn. Rules, never individual draws.") },
      ],
    },
    {
      ref: "TM.3",
      name: "Usage Rights",
      constituents: [
        { name: "Usage Rights", backing: out(
          "Directed out of scope, 1 Aug 2026. Usage is operation, and operation belongs to the " +
          "Operating Company. The vehicle records who CONTROLS time, never who USED it.") },
      ],
    },
    {
      ref: "TM.4",
      name: "Calendar Rights",
      constituents: [
        { name: "Calendar Rights", backing: out(
          "Directed out of scope, 1 Aug 2026. Same boundary as Usage Rights.") },
      ],
    },
    {
      ref: "TM.5",
      name: "Time Ledger",
      constituents: [
        { name: "Time Ledger", backing: out(
          "Directed out of scope, 1 Aug 2026. A ledger of draws is an operating record. If it is " +
          "ever pulled inside the vehicle, it enters as a §33 amendment — not as a quiet table.") },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   DOMAIN III · CAPITAL
   ═══════════════════════════════════════════════════════════════════ */

const CAPITAL: VehicleDomainSpec = {
  domain: Domain.Capital,
  name: "Capital",
  constitutionalQuestion: "What is the financial position of the LLP?",
  charge:
    "Everything the LLP receives, owes, earns, preserves and distributes. " +
    "The complete financial position of the vehicle.",
  constitutional: false,
  sections: [
    {
      ref: "CP.1",
      name: "Investors",
      constituents: [
        { name: "Partner Register", backing: obj(BO.Investor) },
        { name: "Ownership Register", backing: obj(BO.OwnershipPosition),
          note: "The same record Time reads its stake from. One register, two domains reading it — never two registers." },
        { name: "Capital Accounts", backing: reg("CapitalAccount",
          "Per-partner: contributed, share of profit, drawings, closing balance. The LLP Act requires it and Schedule-form accounts assume it.") },
      ],
    },
    {
      ref: "CP.2",
      name: "Capital Formation",
      constituents: [
        { name: "Investment Offering", backing: obj(BO.InvestmentOffering) },
        { name: "Commitments", backing: obj(BO.Commitment) },
        { name: "Contributions", backing: obj(BO.Investment),
          note: "A settled contribution. The Member Law fires here and nowhere else." },
        { name: "Capital Calls", backing: obj(BO.CapitalCall) },
      ],
    },
    {
      ref: "CP.3",
      name: "Finance",
      constituents: [
        { name: "Debt", backing: reg("DebtFacility",
          "Lender, principal, rate, moratorium, covenants. The ₹5.5 Cr facility currently lives as prose in slowspace.ts — a covenant nobody can query is a covenant nobody monitors.") },
        { name: "Interest", backing: reg("DebtFacility", "Schedule rows on the facility.") },
        { name: "Repayments", backing: reg("DebtFacility", "Schedule rows on the facility.") },
        { name: "Banking", backing: reg("BankAccount",
          "Account, bank, signatories. Signing authority itself is Governance — the account is Capital, the authority over it is law.") },
      ],
    },
    {
      ref: "CP.4",
      name: "Revenue",
      constituents: [
        { name: "Revenue", backing: reg("LedgerEntry", "Recognised revenue, by period and class.") },
        { name: "Operating Income", backing: reg("LedgerEntry", "class: operating") },
        { name: "Brand Income", backing: reg("LedgerEntry", "class: brand") },
        { name: "Other Income", backing: reg("LedgerEntry", "class: other") },
      ],
    },
    {
      ref: "CP.5",
      name: "Expenses",
      constituents: [
        { name: "Operating Costs", backing: reg("LedgerEntry", "class: operating_cost") },
        { name: "Asset Management", backing: reg("LedgerEntry", "class: asset_management") },
        { name: "Administration", backing: reg("LedgerEntry", "class: administration") },
        { name: "Insurance", backing: reg("LedgerEntry",
          "class: insurance — the premium is an expense here; the policy is Space (SP.3).") },
        { name: "Professional Fees", backing: reg("LedgerEntry", "class: professional_fees") },
      ],
    },
    {
      ref: "CP.6",
      name: "Reserves",
      constituents: [
        { name: "Sinking Fund", backing: { kind: "code", module: "lib/domain.ts — waterfall stage 4, floor rule F-06" },
          note: "The reserve exists as executable law: 2.5% of revenue in, distribution blocked if paying would breach the floor. A Reserve record joins when persistence exists." },
      ],
    },
    {
      ref: "CP.7",
      name: "Valuation",
      constituents: [
        { name: "NAV", backing: {
          kind: "derived",
          formula: "asset valuations (Space) − debt outstanding + reserves + net working capital",
          from: [BO.Valuation, BO.PerformanceReport],
        }, note: "Derived, never typed. The prototype carried four different valuations of one house because each screen held its own copy." },
      ],
    },
    {
      ref: "CP.8",
      name: "Distribution",
      constituents: [
        { name: "Waterfall", backing: { kind: "code", module: "lib/domain.ts — six stages, closes to 100%, F-05" } },
        { name: "Debt Service", backing: { kind: "derived",
          formula: "investor share − partner distribution; stage 5, the senior claim",
          from: [BO.Distribution] } },
        { name: "Partner Distributions", backing: obj(BO.Distribution) },
        { name: "Retained Earnings", backing: { kind: "derived",
          formula: "what stage 6 withholds when blocked — retained, never evaporated",
          from: [BO.Distribution] } },
      ],
    },
    {
      ref: "CP.9",
      name: "Reporting",
      constituents: [
        { name: "Balance Sheet", backing: obj(BO.PerformanceReport),
          note: "Statement kinds on the report object; the statutory filing of them is Governance (Form 8)." },
        { name: "Profit & Loss", backing: obj(BO.PerformanceReport) },
        { name: "Cash Flow", backing: obj(BO.PerformanceReport) },
        { name: "Capital Accounts", backing: reg("CapitalAccount", "Reported per partner, per period — same object as CP.1.") },
        { name: "Forecasts", backing: obj(BO.Forecast),
          note: "Forward-looking, so every figure carries its confidence class." },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   DOMAIN IV · GOVERNANCE — the constitutional layer
   ═══════════════════════════════════════════════════════════════════ */

const GOVERNANCE: VehicleDomainSpec = {
  domain: Domain.Governance,
  name: "Governance",
  constitutionalQuestion: "Under what law does the LLP act, and can it prove compliance?",
  charge:
    "Everything the LLP must govern, record, comply with, report and legally maintain. " +
    "Not a fourth business function: it owns no asset, allocates no time, holds no capital. " +
    "It is the operating law of the other three domains, and it mirrors the vehicle's " +
    "statutory obligations so that every government compliance has a named counterpart here.",
  constitutional: true,
  sections: [
    {
      ref: "GV.1",
      name: "LLP Governance",
      constituents: [
        { name: "LLP Agreement", backing: obj(BO.Agreement),
          note: "The constitutional instrument. Filed as Form 3 within 30 days of incorporation — the statutory mirror row references this record." },
        { name: "Partner & Designated Partner Register", backing: obj(BO.Investor),
          note: "The register read here is the same Investor set Capital holds — annotated with designated-partner status, never duplicated." },
        { name: "Authority Matrix", backing: { kind: "code", module: "lib/authority.ts — rights, roles, separationViolations()" },
          note: "Executable, and checked: no role may hold a dangerous triad. A matrix kept as a document is a matrix nobody enforces." },
        { name: "Board / Partner Meeting Records", backing: obj(BO.Committee) },
        { name: "Resolution Register", backing: obj(BO.Resolution) },
        { name: "Voting Register", backing: { kind: "code", module: "constants/voting.ts — thresholds; ADR-0008 secret ballot, transparent outcome" },
          note: "Contribution-weighted per §24a. Ordinary carries above 50% — a tie is not approval. Special at 76%. Tallies are published; who voted how never is." },
        { name: "Constitutional Amendments", backing: obj(BO.Policy),
          note: "Including §33 amendments — which is how every `registered` candidate in this file becomes real." },
        { name: "All Agreements", backing: obj(BO.Agreement),
          note: "Operator agreement, brand licence, facility agreement — one object, kinds distinguished. Every contract the vehicle signs lands here or does not bind it." },
      ],
    },
    {
      ref: "GV.2",
      name: "Corporate Administration",
      constituents: [
        { name: "Incorporation Documents", backing: reg("StatutoryRecord", "kind: incorporation — certificate, LLPIN, Form 2.") },
        { name: "PAN", backing: reg("StatutoryRecord", "kind: pan") },
        { name: "TAN", backing: reg("StatutoryRecord", "kind: tan — required the day the first salary or contractor payment is made, for TDS.") },
        { name: "Registered Office", backing: reg("StatutoryRecord",
          "kind: registered_office. No UFR field carries it today — LLP.office in slowspace.ts is prose. A change of registered office is Form 15; the mirror row exists below.") },
        { name: "Statutory Registers", backing: reg("StatutoryRecord", "kind: register") },
        { name: "Digital Signatures", backing: reg("StatutoryRecord",
          "kind: dsc — every designated partner needs one before any MCA filing can be made.") },
        { name: "Banking Authorities", backing: reg("StatutoryRecord",
          "kind: banking_authority — WHO may operate the account. The account itself is Capital (CP.3).") },
        { name: "Authorised Signatories", backing: reg("StatutoryRecord", "kind: signatory") },
        { name: "Enterprise Policies", backing: obj(BO.Policy) },
        { name: "Governance Calendar", backing: { kind: "derived",
          formula: "union of every statutory due date below + every expiry-bearing record (insurance, warranties, DSC)",
          from: [BO.ComplianceEvent] },
          note: "Derived from the obligations, never kept by hand. A hand-kept calendar is the one document guaranteed to be wrong the year it matters." },
      ],
    },
  ],
};

export const VEHICLE_DOMAINS: readonly VehicleDomainSpec[] = [SPACE, TIME, CAPITAL, GOVERNANCE];

/* ═══════════════════════════════════════════════════════════════════
   THE STATUTORY MIRROR

   "The business objects of the LLP mimic the government regulations,
   so that every compliance is mimicked in the domain as well."

   One row per obligation of an Indian LLP. Every row lands on the
   ComplianceEvent object, so the governance calendar can be DERIVED
   from this table — and a new obligation added here is automatically a
   calendar entry, a filing record and a breach condition, with no
   second list to update.
   ═══════════════════════════════════════════════════════════════════ */

export interface StatutoryObligation {
  ref: string;
  /** The instrument, as the regulator names it. */
  instrument: string;
  authority: "MCA" | "Income Tax" | "GST" | "State";
  what: string;
  due: string;
  /** Conditional obligations state their trigger; unconditional say "always". */
  appliesWhen: string;
  object: BO;
}

export const STATUTORY_MIRROR: readonly StatutoryObligation[] = [
  { ref: "ST-01", instrument: "Form 3", authority: "MCA",
    what: "File the LLP Agreement and any change to it.",
    due: "Within 30 days of incorporation or of the change",
    appliesWhen: "always", object: BO.Agreement },
  { ref: "ST-02", instrument: "Form 11", authority: "MCA",
    what: "Annual Return — partners, contributions, changes in the year.",
    due: "Within 60 days of financial year end (by 30 May)",
    appliesWhen: "always", object: BO.ComplianceEvent },
  { ref: "ST-03", instrument: "Form 8", authority: "MCA",
    what: "Statement of Account & Solvency — the accounts CP.9 produces, filed.",
    due: "By 30 October each year",
    appliesWhen: "always", object: BO.ComplianceEvent },
  { ref: "ST-04", instrument: "Statutory audit", authority: "MCA",
    what: "Audit of the accounts.",
    due: "Before Form 8",
    appliesWhen: "turnover > ₹40 lakh OR contribution > ₹25 lakh — every GC vehicle crosses the second test at formation",
    object: BO.ComplianceEvent },
  { ref: "ST-05", instrument: "ITR-5", authority: "Income Tax",
    what: "Income tax return of the LLP.",
    due: "31 July, or 31 October when audited — GC vehicles are audited, so 31 October",
    appliesWhen: "always", object: BO.ComplianceEvent },
  { ref: "ST-06", instrument: "TDS returns (24Q/26Q)", authority: "Income Tax",
    what: "Quarterly deduction returns against the TAN.",
    due: "Quarterly",
    appliesWhen: "any payment attracting TDS — contractor, professional fees, interest",
    object: BO.ComplianceEvent },
  { ref: "ST-07", instrument: "GST returns", authority: "GST",
    what: "Registration and periodic returns.",
    due: "Monthly/quarterly per registration",
    appliesWhen: "taxable supplies exceed the threshold — expected once operations begin",
    object: BO.ComplianceEvent },
  { ref: "ST-08", instrument: "Form 4", authority: "MCA",
    what: "Change of partner or designated partner.",
    due: "Within 30 days of the change",
    appliesWhen: "on every admission, resignation or transfer — every settlement that admits a partner fires this",
    object: BO.ComplianceEvent },
  { ref: "ST-09", instrument: "Form 15", authority: "MCA",
    what: "Change of registered office.",
    due: "Within 30 days",
    appliesWhen: "on relocation", object: BO.ComplianceEvent },
  { ref: "ST-10", instrument: "DIR-3 KYC", authority: "MCA",
    what: "Annual KYC of every designated partner's DPIN.",
    due: "By 30 September each year",
    appliesWhen: "always", object: BO.ComplianceEvent },
  { ref: "ST-11", instrument: "CRZ clearance conditions", authority: "State",
    what: "Conditions attached to the Coastal Regulation Zone approval — the approval itself is a Property Document (SP.4).",
    due: "As conditioned",
    appliesWhen: "coastal properties — SlowSpace Coastal is one",
    object: BO.ComplianceEvent },
];

/* ═══════════════════════════════════════════════════════════════════
   REGISTERED CANDIDATES — the named gaps, collected

   Derived from the model, not maintained beside it. This is the §33
   amendment queue: each name appears because some constituent above
   needs it, and ratifying one moves those constituents from
   `registered` to `object` without restructuring anything.
   ═══════════════════════════════════════════════════════════════════ */

export const REGISTERED_CANDIDATES: readonly string[] = (() => {
  const names = new Set<string>();
  for (const d of VEHICLE_DOMAINS)
    for (const s of d.sections)
      for (const c of s.constituents)
        if (c.backing.kind === "registered") names.add(c.backing.candidate);
  return [...names].sort();
})();

/* ── Load-time checks — the model proves itself or refuses to load ── */

{
  // 1 · Governance is the only constitutional layer, and it is one.
  const constitutional = VEHICLE_DOMAINS.filter((d) => d.constitutional);
  if (constitutional.length !== 1 || constitutional[0].domain !== Domain.Governance) {
    throw new Error("Exactly one domain is constitutional, and it is Governance.");
  }

  // 2 · Every object-backed constituent names an object whose domain
  //     agrees with where it is filed — with the two deliberate
  //     cross-domain reads called out rather than smuggled.
  const CROSS_READS = new Set([
    "TM.2:Ownership Percentage",   // Time reads the Capital register
    "GV.1:Partner & Designated Partner Register", // Governance annotates it
  ]);
  for (const d of VEHICLE_DOMAINS)
    for (const s of d.sections)
      for (const c of s.constituents) {
        if (c.backing.kind !== "object" && c.backing.kind !== "field") continue;
        const o = c.backing.kind === "object" ? c.backing.object : c.backing.object;
        const home = BUSINESS_OBJECT_DOMAIN[o];
        const key = `${s.ref}:${c.name}`;
        if (home !== d.domain && home !== Domain.Vehicle && !CROSS_READS.has(key)) {
          throw new Error(
            `${key} is backed by ${o}, which lives in ${home}, not ${d.domain}. ` +
            `A cross-domain read must be declared in CROSS_READS with its reason beside it.`,
          );
        }
      }

  // 3 · No registered candidate collides with a ratified object name.
  const ratified = new Set(Object.values(BO).map((v) => v.toLowerCase()));
  for (const cand of REGISTERED_CANDIDATES) {
    if (ratified.has(cand.toLowerCase())) {
      throw new Error(`Registered candidate "${cand}" is already a ratified object.`);
    }
  }

  // 4 · Every out-of-scope entry states why, and only Time has any —
  //     the exclusions were a direction about Time, not a habit.
  for (const d of VEHICLE_DOMAINS)
    for (const s of d.sections)
      for (const c of s.constituents)
        if (c.backing.kind === "outOfScope") {
          if (!c.backing.because) throw new Error(`${s.ref}:${c.name} is out of scope with no reason.`);
          if (d.domain !== Domain.Time) {
            throw new Error(`Out-of-scope entries exist only in Time; found one in ${d.name}.`);
          }
        }

  // 5 · The statutory mirror is complete in form: unique refs, every row
  //     dated, every row landing on a ratified object.
  const refs = new Set<string>();
  for (const s of STATUTORY_MIRROR) {
    if (refs.has(s.ref)) throw new Error(`Duplicate statutory ref ${s.ref}`);
    refs.add(s.ref);
    if (!s.due || !s.appliesWhen) throw new Error(`${s.ref} is missing its due date or trigger.`);
  }
}
