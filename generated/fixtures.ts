/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: constants/ufr.ts
 * Regenerate: npm run fixtures
 *
 * One valid instance per L2 object. Deterministic by construction: no
 * randomness, no clock reads. A fixture that differs between runs turns a
 * failing test into a question about which run you are looking at.
 */

const SYSTEM = {
  id: "9799c3cb-5b9e-4b59-893a-f30e18d7f948",
  created_at: "2026-01-01T00:00:00.000Z",
  created_by: "a62ae7d2-1f32-4126-807f-4a0762939090",
  updated_at: "2026-01-01T00:00:00.000Z",
  version: 0,
};

export const AcquisitionFixture = {
  ...SYSTEM,
  property_id: "27e30dbf-d47e-4aa2-8693-008bdd896375",
  acquisition_price: "1000.0000",
  completed_on: "2026-01-15",
  investment_thesis_id: "5caf1edb-3934-4bc8-86d9-cca110d1b787",
};

export const AgreementFixture = {
  ...SYSTEM,
  agreement_type: "subscription",
  counterparty_id: "f2c63ca1-6601-4577-83b7-10663e22d784",
  annual_value: "1000.0000",
  term_months: 100,
  is_related_party: true,
  is_material: true,
};

export const BenchmarkFixture = {
  ...SYSTEM,
  benchmark_name: "Sample benchmark name",
  benchmark_value: 1.5,
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
};

export const CapitalCallFixture = {
  ...SYSTEM,
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  called_amount: "1000.0000",
  due_on: "2026-01-15",
  purpose: "acquisition",
};

export const CommitmentFixture = {
  ...SYSTEM,
  investor_id: "6c443a04-1c43-4067-866e-9b00c127ea1b",
  offering_id: "563f0e15-71a2-4b48-8224-434bfe8849b9",
  committed_amount: "1000.0000",
  accepted_at: "2026-01-15T10:00:00.000Z",
  commitment_state: "offered",
};

export const CommitteeFixture = {
  ...SYSTEM,
  committee_name: "board",
  decision_authority: {},
  organization_id: "f2c63ca1-6601-4577-83b7-10663e22d784",
};

export const ComplianceEventFixture = {
  ...SYSTEM,
  event_type: "audit_finding",
  severity: "advisory",
  declared_by: "cee22385-0d62-44d1-8ddb-82d0fa548bf2",
  disclosed_to_partners: true,
};

export const DispositionFixture = {
  ...SYSTEM,
  property_id: "27e30dbf-d47e-4aa2-8693-008bdd896375",
  disposal_price: "1000.0000",
  completed_on: "2026-01-15",
};

export const DistributionFixture = {
  ...SYSTEM,
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  waterfall_stage: "1_operating_company",
  amount: "1000.0000",
  executed_at: "2026-01-15T10:00:00.000Z",
  revenue_base: "1000.0000",
};

export const DueDiligenceFixture = {
  ...SYSTEM,
  property_id: "27e30dbf-d47e-4aa2-8693-008bdd896375",
  workstream: "legal",
  outcome: "clear",
};

export const ForecastFixture = {
  ...SYSTEM,
  horizon_years: 100,
  scenario: "base",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
};

export const InvestmentFixture = {
  ...SYSTEM,
  commitment_id: "b5c90407-0357-47cd-805d-d0f954523948",
  deployed_amount: "1000.0000",
  deployed_at: "2026-01-15T10:00:00.000Z",
  capital_state: "committed",
};

export const InvestmentOfferingFixture = {
  ...SYSTEM,
  offering_name: "Sample offering name",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  target_amount: "1000.0000",
  minimum_subscription: "1000.0000",
  brand_participation_rate: 0.1,
  offering_state: "draft",
};

export const InvestmentThesisFixture = {
  ...SYSTEM,
  thesis_statement: "Sample thesis statement content for fixture purposes.",
  thesis_version: 100,
  return_drivers: {},
  risk_mitigants: {},
  property_id: "27e30dbf-d47e-4aa2-8693-008bdd896375",
};

export const InvestmentVehicleFixture = {
  ...SYSTEM,
  vehicle_name: "Sample vehicle name",
  vehicle_form: "llp",
  governing_organization_id: "f2c63ca1-6601-4577-83b7-10663e22d784",
  total_units_issued: 100,
  reserve_floor_amount: "1000.0000",
  reserve_balance: "1000.0000",
  approved_leverage_limit: 0.1,
  lifecycle_state: "forming",
};

export const InvestorFixture = {
  ...SYSTEM,
  legal_name: "Sample legal name",
  member_state: "investor",
  accreditation_state: "none",
  accreditation_expires_on: "2026-01-15T10:00:00.000Z",
  tax_jurisdiction: "Sample tax jurisdiction",
  became_member_on: "2026-01-15T10:00:00.000Z",
};

export const MarketIntelligenceFixture = {
  ...SYSTEM,
  market_region: "Sample market region",
  observed_on: "2026-01-15",
};

export const OrganizationFixture = {
  ...SYSTEM,
  legal_name: "Sample legal name",
  entity_type: "llp",
  jurisdiction: "Sample jurisdiction",
  registration_number: "Sample registration number",
  incorporated_on: "2026-01-15",
  role_in_enterprise: "asset_platform",
};

export const OwnershipPositionFixture = {
  ...SYSTEM,
  investor_id: "6c443a04-1c43-4067-866e-9b00c127ea1b",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  units_held: 1.5,
  voting_rights_percent: 0.1,
  ownership_class: "Sample ownership class",
};

export const PerformanceReportFixture = {
  ...SYSTEM,
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  period_end: "2026-01-15",
  irr: 0.1,
  moic: 1.5,
  nav: "1000.0000",
  reserve_coverage_ratio: 0.1,
};

export const PolicyFixture = {
  ...SYSTEM,
  policy_id: "Sample policy id",
  policy_version: 100,
  approved_by_resolution_id: "700731de-90df-409e-853a-e849a6e8f924",
};

export const PortfolioFixture = {
  ...SYSTEM,
  portfolio_name: "Sample portfolio name",
  investment_strategy: "Sample investment strategy content for fixture purposes.",
  concentration_ceiling: 0.1,
  organization_id: "f2c63ca1-6601-4577-83b7-10663e22d784",
};

export const PropertyFixture = {
  ...SYSTEM,
  property_name: "Sample property name",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
  portfolio_id: "257bf1da-8a02-4496-82e6-cc28e850e568",
  jurisdiction: "Sample jurisdiction",
  title_reference: "Sample title reference",
  land_area_sqm: 1.5,
  lifecycle_state: "prospecting",
  stabilised_on: "2026-01-15",
  environmental_commitments: {},
};

export const ResearchFixture = {
  ...SYSTEM,
  research_topic: "esg",
  research_version: 100,
};

export const ResolutionFixture = {
  ...SYSTEM,
  matter: "Sample matter",
  resolution_type: "ordinary",
  equity_for: 0.1,
  equity_against: 0.1,
  equity_present: 0.1,
  outcome: "approved",
  rationale: "Sample rationale content for fixture purposes.",
  committee_id: "cee22385-0d62-44d1-8ddb-82d0fa548bf2",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
};

export const RiskFixture = {
  ...SYSTEM,
  risk_category: "liquidity",
  likelihood: "rare",
  impact: "negligible",
  vehicle_id: "731c63b3-f070-412a-8e78-70499cb300e1",
};

export const ValuationFixture = {
  ...SYSTEM,
  property_id: "27e30dbf-d47e-4aa2-8693-008bdd896375",
  valued_on: "2026-01-15",
  value: "1000.0000",
  source: "independent",
  valuer_name: "Sample valuer name",
};

export const FIXTURES = {
  Acquisition: AcquisitionFixture,
  Agreement: AgreementFixture,
  Benchmark: BenchmarkFixture,
  CapitalCall: CapitalCallFixture,
  Commitment: CommitmentFixture,
  Committee: CommitteeFixture,
  ComplianceEvent: ComplianceEventFixture,
  Disposition: DispositionFixture,
  Distribution: DistributionFixture,
  DueDiligence: DueDiligenceFixture,
  Forecast: ForecastFixture,
  Investment: InvestmentFixture,
  InvestmentOffering: InvestmentOfferingFixture,
  InvestmentThesis: InvestmentThesisFixture,
  InvestmentVehicle: InvestmentVehicleFixture,
  Investor: InvestorFixture,
  MarketIntelligence: MarketIntelligenceFixture,
  Organization: OrganizationFixture,
  OwnershipPosition: OwnershipPositionFixture,
  PerformanceReport: PerformanceReportFixture,
  Policy: PolicyFixture,
  Portfolio: PortfolioFixture,
  Property: PropertyFixture,
  Research: ResearchFixture,
  Resolution: ResolutionFixture,
  Risk: RiskFixture,
  Valuation: ValuationFixture,
} as const;
