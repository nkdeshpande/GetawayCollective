/**
 * ENUMERATION DISPLAY — labels, descriptions, semantic tone
 *
 * Wave 4 · Primitive Surface
 * Authority: constants/ufr.ts (the values) · GC-DesignSystem v3.0 §29 (the tones)
 *
 * ── THE SPLIT ────────────────────────────────────────────────────────
 * The REGISTRY owns which values exist. This file owns how they read.
 *
 * Keeping them apart matters: a value can be renamed in the UI without
 * touching the database, and a value can be added to the schema without
 * anyone inventing a label for it in passing. `enum-lint` checks the two
 * agree — every registry value has display metadata, and no metadata
 * describes a value that no longer exists.
 *
 * ── TONE IS SEMANTIC, NEVER DECORATIVE ───────────────────────────────
 * The palette carries fixed meaning (§29 Metric Grammar). `copper` is
 * currency and nothing else. `critical` is the rarest colour in the system
 * and is reserved for breach and denial — using it for "closed" would
 * spend the one signal that must still register when it matters.
 *
 * `steel` is the default. A value that is merely a fact, carrying no
 * judgement, should look like one.
 */

/** Semantic tones. Each maps to exactly one token. */
export type Tone =
  | "steel"     // neutral fact, metadata, no judgement
  | "electric"  // in motion: a state transition, an action, admin authority
  | "confirm"   // settled, live, complete, healthy
  | "hazard"    // risk, volatility, attention needed, winding down
  | "critical"  // breach, denial, failure. The rarest colour in the system.
  | "copper"    // currency, capital, yield
  | "forest";   // heritage, land, long-term holding

export interface EnumValueDisplay {
  label: string;
  /** Under 60 characters. It appears in a tooltip, not a paragraph. */
  description: string;
  tone: Tone;
  /** Screen-reader text, where the visible label alone is ambiguous. */
  a11y?: string;
}

export type EnumDisplay = Record<string, EnumValueDisplay>;

const D = (label: string, description: string, tone: Tone, a11y?: string): EnumValueDisplay =>
  a11y ? { label, description, tone, a11y } : { label, description, tone };

/**
 * Keyed `Object.field` to match the UFR exactly, so the linter can pair
 * them without a translation table in between.
 */
export const ENUM_DISPLAY: Record<string, EnumDisplay> = {

  // ── Enterprise ────────────────────────────────────────────────────
  "Organization.entity_type": {
    llp: D("LLP", "Limited Liability Partnership", "forest"),
    private_limited: D("Private Limited", "Private limited company", "steel"),
    trust: D("Trust", "Trust structure", "steel"),
    partnership: D("Partnership", "General partnership", "steel"),
    sole_proprietor: D("Sole Proprietor", "Single-owner entity", "steel"),
    foreign_entity: D("Foreign Entity", "Incorporated outside the jurisdiction", "hazard"),
  },
  "Organization.role_in_enterprise": {
    asset_platform: D("Asset Platform", "Getaway Collective. Owns capital and governance", "forest"),
    operating_partner: D("Operating Partner", "Runs the property under a Management Agreement", "electric"),
    brand_partner: D("Brand Partner", "Demand generation under a Services Agreement", "electric"),
    investment_vehicle: D("Investment Vehicle", "An LLP holding assets for investors", "copper"),
    external_counterparty: D("External Counterparty", "Third party outside the enterprise", "steel"),
  },
  "InvestmentVehicle.vehicle_form": {
    llp: D("LLP", "The constitutional default (§24a)", "forest"),
    spv: D("SPV", "Special purpose vehicle. Needs Board approval", "hazard"),
    fund: D("Fund", "Pooled fund. Needs Board approval", "hazard"),
    trust: D("Trust", "Trust. Needs Board approval", "hazard"),
    syndicate: D("Syndicate", "Syndicate. Needs Board approval", "hazard"),
  },
  "InvestmentVehicle.lifecycle_state": {
    forming: D("Forming", "Constituted, not yet raising", "steel"),
    raising: D("Raising", "Offering open to commitments", "electric"),
    deployed: D("Deployed", "Capital placed into assets", "electric"),
    stabilised: D("Stabilised", "Reserve funding mandatory. Growth calls only", "confirm",
      "Stabilised. Reserve funding is mandatory and capital calls are limited to growth purposes."),
    winding_down: D("Winding Down", "Final assets in disposition", "hazard"),
    dissolved: D("Dissolved", "Wound up. Records survive the entity", "steel"),
  },

  // ── Assets ────────────────────────────────────────────────────────
  "Property.lifecycle_state": {
    prospecting: D("Prospecting", "Under consideration. Nothing committed", "steel"),
    pending: D("Pending", "Terms agreed, diligence running", "electric"),
    acquired: D("Acquired", "Title transferred. Terms are now immutable", "confirm"),
    development: D("In Development", "Capital works under an approved budget", "electric"),
    stabilised: D("Stabilised", "Operating. Reserve funding mandatory", "confirm"),
    disposition_pending: D("Disposition Pending", "Sale approved, title not yet transferred", "hazard"),
    exited: D("Exited", "Sold. Record retained permanently", "steel"),
  },
  "Valuation.source": {
    independent: D("Independent", "Third-party valuer. Fit for filing", "confirm",
      "Independent valuation. Fit for regulatory filing."),
    management: D("Management", "Internal estimate. NOT fit for filing", "hazard",
      "Management estimate. Not fit for regulatory filing under F-13."),
  },

  // ── Capital ───────────────────────────────────────────────────────
  "InvestmentOffering.offering_state": {
    draft: D("Draft", "Terms not yet disclosed", "steel"),
    open: D("Open", "Accepting commitments on disclosed terms", "electric"),
    closed: D("Closed", "Raise complete. Cannot reopen", "confirm"),
    cancelled: D("Cancelled", "Abandoned before opening", "steel"),
  },
  "Investor.member_state": {
    investor: D("Investor", "Pre-commitment. Outside the vehicle", "steel"),
    member: D("Member", "Capital settled. Inside, with governance rights", "forest",
      "Member. Capital has settled and governance rights attach."),
  },
  "Investor.accreditation_state": {
    none: D("Not Accredited", "No accreditation on file", "steel"),
    in_review: D("In Review", "Compliance assessment under way", "electric"),
    accredited: D("Accredited", "Valid for fifteen working days", "confirm"),
    expired: D("Expired", "Blocks new commitments only. Voting survives", "hazard",
      "Accreditation expired. New commitments are blocked; voting, distribution and information rights are unaffected."),
  },
  "Commitment.commitment_state": {
    offered: D("Offered", "Made, not yet accepted", "steel"),
    accepted: D("Accepted", "Binding. Accreditation tested at this moment", "electric"),
    settled: D("Settled", "Funded. Triggers the Member Law", "confirm"),
    lapsed: D("Lapsed", "Accreditation expired before acceptance", "hazard"),
    withdrawn: D("Withdrawn", "Withdrawn in writing before acceptance", "steel"),
  },
  "CapitalCall.purpose": {
    acquisition: D("Acquisition", "New asset. Growth capital", "copper"),
    approved_expansion: D("Expansion", "Board-approved expansion", "copper"),
    approved_redevelopment: D("Redevelopment", "Board-approved redevelopment", "copper"),
    extraordinary_event: D("Extraordinary Event", "Outside the normal operating framework", "hazard"),
    llp_agreement_provision: D("LLP Provision", "Required under the LLP Agreement", "steel"),
  },
  "Investment.capital_state": {
    committed: D("Committed", "Promised, not yet drawn", "steel"),
    drawn: D("Drawn", "Called and received", "electric"),
    invested: D("Invested", "Deployed into an asset", "copper"),
    returned: D("Returned", "Capital returned. Terminal", "confirm"),
    distributed: D("Distributed", "Paid out to partners. Terminal", "confirm"),
  },
  "Distribution.waterfall_stage": {
    "1_operating_company": D("1 · Operating Company", "Consideration for services performed", "electric"),
    "2_brand_digital": D("2 · Brand & Digital", "Commercial participation. Never equity", "electric"),
    "3_admin_reserve": D("3 · Administration Reserve", "2.5% of Revenue Base", "forest"),
    "4_sinking_fund": D("4 · Property Sinking Fund", "2.5% of Revenue Base", "forest"),
    "5_debt_service": D("5 · Debt Service", "The Vehicle's own borrowing", "hazard"),
    "6_partner_distribution": D("6 · Partner Distribution", "The remainder, pro-rata by units", "copper"),
  },

  // ── Governance ────────────────────────────────────────────────────
  "Agreement.agreement_type": {
    subscription: D("Subscription", "Investor subscription into an offering", "copper"),
    llp_agreement: D("LLP Agreement", "Constitutional document of the vehicle", "forest"),
    operating_agreement: D("Operating Agreement", "ALWAYS material related-party", "hazard",
      "Operating Agreement. Always a material related-party transaction regardless of value."),
    commercial_services: D("Commercial Services", "ALWAYS material related-party", "hazard",
      "Commercial Services Agreement. Always a material related-party transaction regardless of value."),
    share_purchase: D("Share Purchase", "Share purchase agreement", "steel"),
    shareholders: D("Shareholders", "Shareholders agreement", "steel"),
    financing: D("Financing", "Debt facility documentation", "hazard"),
    lease: D("Lease", "Lease instrument", "steel"),
  },
  "Resolution.resolution_type": {
    ordinary: D("Ordinary", "Over 50% of equity present", "steel"),
    special: D("Special", "At least 76% of total equity", "electric"),
    unanimous: D("Unanimous", "100% of total equity. Entrenched matters only", "critical",
      "Unanimous resolution. Required for entrenched constitutional principles."),
  },
  "Resolution.outcome": {
    approved: D("Approved", "Threshold met", "confirm"),
    rejected: D("Rejected", "Threshold not met", "steel"),
    tied_not_approved: D("Tied — Not Approved", "A tie fails. The proposer carries the burden", "hazard",
      "Tied and therefore not approved. The burden of approval rests with the proposer."),
    inquorate: D("Inquorate", "Under 60% of equity present. No outcome", "hazard"),
    entrenched_not_unanimous: D("Not Unanimous", "Entrenched matter without full consent", "critical"),
    entrenched_rights_not_confirmed: D("Rights Not Confirmed", "Unanimity without the rights confirmation", "critical"),
  },
  "Committee.committee_name": {
    board: D("Board", "Highest governing authority", "forest"),
    investment: D("Investment Committee", "Capital deployment", "copper"),
    audit_risk: D("Audit & Risk", "Enterprise integrity, reserves, treasury", "hazard"),
    governance_ethics: D("Governance & Ethics", "Constitutional interpretation, conflicts", "electric"),
    brand_market: D("Brand & Market", "Brand and commercial growth", "steel"),
    operations_asset_performance: D("Operations & Asset Performance", "Operator performance oversight", "steel"),
    independent_constitutional_review_panel: D("Constitutional Review Panel", "Convened where the declaring authority is implicated", "critical"),
  },
  "ComplianceEvent.event_type": {
    audit_finding: D("Audit Finding", "Raised by internal or external audit", "hazard"),
    regulatory_notice: D("Regulatory Notice", "Received from a regulator", "hazard"),
    policy_breach: D("Policy Breach", "Enterprise policy not followed", "hazard"),
    conflict_disclosure: D("Conflict Disclosure", "Declared under I-07", "electric"),
    constitutional_failure: D("Constitutional Failure", "CF-01 to CF-06. Compels re-ratification", "critical",
      "Constitutional failure declared. Compels re-ratification of the affected layer within ninety days."),
    operator_sla_breach: D("Operator SLA Breach", "Service level not met", "hazard"),
    reserve_breach: D("Reserve Breach", "Balance below the Reserve Floor", "critical"),
  },
  "ComplianceEvent.severity": {
    advisory: D("Advisory", "Monitoring only", "steel"),
    governance_alert: D("Governance Alert", "Executive review required", "hazard"),
    material: D("Material", "Affects investor rights or reporting", "hazard"),
    constitutional_breach: D("Constitutional Breach", "A constitutional obligation was not met", "critical"),
  },

  // ── Performance ───────────────────────────────────────────────────
  "Forecast.scenario": {
    base: D("Base Case", "Expected outcome", "steel"),
    downside: D("Downside", "Adverse scenario", "hazard"),
    upside: D("Upside", "Favourable scenario", "confirm"),
    exit: D("Exit", "Disposition scenario", "copper"),
  },
  "Risk.risk_category": {
    liquidity: D("Liquidity", "Cash availability", "hazard"),
    interest_rate: D("Interest Rate", "Cost of debt movement", "hazard"),
    operator: D("Operator", "Operating partner performance", "hazard"),
    market: D("Market", "Demand and pricing", "hazard"),
    climate: D("Climate", "Physical and transition risk", "forest"),
    currency: D("Currency", "FX exposure", "hazard"),
    legal: D("Legal", "Title, contract, litigation", "hazard"),
    regulatory: D("Regulatory", "Compliance and licensing", "hazard"),
    technology: D("Technology", "Platform and data risk", "electric"),
    counterparty: D("Counterparty", "Third-party failure", "hazard"),
  },
  "Risk.likelihood": {
    rare: D("Rare", "Unlikely within the horizon", "steel"),
    unlikely: D("Unlikely", "Possible but not expected", "steel"),
    possible: D("Possible", "Could occur", "hazard"),
    likely: D("Likely", "Expected to occur", "hazard"),
    almost_certain: D("Almost Certain", "Expected within the horizon", "critical"),
  },
  "Risk.impact": {
    negligible: D("Negligible", "No material effect", "steel"),
    minor: D("Minor", "Absorbed within normal operations", "steel"),
    moderate: D("Moderate", "Noticeable effect on returns", "hazard"),
    major: D("Major", "Significant effect on returns", "hazard"),
    severe: D("Severe", "Threatens the vehicle", "critical"),
  },

  // ── Intelligence ──────────────────────────────────────────────────
  "DueDiligence.workstream": {
    legal: D("Legal", "Contract and corporate review", "steel"),
    technical: D("Technical", "Building and systems condition", "steel"),
    environmental: D("Environmental", "Contamination, climate, biodiversity", "forest"),
    financial: D("Financial", "Accounts, projections, tax", "copper"),
    commercial: D("Commercial", "Market and demand", "steel"),
    title: D("Title", "Land title and encumbrances", "steel"),
  },
  "DueDiligence.outcome": {
    clear: D("Clear", "No findings", "confirm"),
    clear_with_conditions: D("Clear with Conditions", "Proceed subject to conditions", "hazard"),
    adverse: D("Adverse", "Blocks approval until resolved", "critical",
      "Adverse finding. Blocks acquisition approval until resolved or explicitly accepted by the Investment Committee."),
  },
  "Research.research_topic": {
    esg: D("ESG", "Environmental, social, governance", "forest"),
    geographic: D("Geographic", "Region and location analysis", "steel"),
    asset_class: D("Asset Class", "Sector and asset type", "steel"),
    economic: D("Economic", "Macro and rates", "steel"),
    regulatory: D("Regulatory", "Rules and licensing", "steel"),
  },
};

// ─────────────────────────────────────────────────────────────────────

export function displayFor(objectField: string, value: string): EnumValueDisplay | undefined {
  return ENUM_DISPLAY[objectField]?.[value];
}

export function labelFor(objectField: string, value: string): string {
  return displayFor(objectField, value)?.label ?? value;
}

/** Screen-reader text: the explicit a11y string, or the label plus its meaning. */
export function accessibleTextFor(objectField: string, value: string): string {
  const d = displayFor(objectField, value);
  if (!d) return value;
  return d.a11y ?? `${d.label}. ${d.description}`;
}

/** Every value carrying a given tone. Used by the design reference. */
export function valuesWithTone(tone: Tone): { key: string; value: string; label: string }[] {
  const out: { key: string; value: string; label: string }[] = [];
  for (const [key, set] of Object.entries(ENUM_DISPLAY)) {
    for (const [value, d] of Object.entries(set)) {
      if (d.tone === tone) out.push({ key, value, label: d.label });
    }
  }
  return out;
}

/**
 * `critical` is the rarest colour in the system. Spending it on ordinary
 * states would leave nothing that still registers when a real breach
 * happens. This is the budget, asserted in a test.
 */
export const CRITICAL_TONE_BUDGET = 12;
