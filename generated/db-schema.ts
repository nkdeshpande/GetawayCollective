/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: constants/ufr.ts (fields) + constants/relationships.ts (edges)
 * Regenerate: npm run db:schema
 * Verify:     npm run db:check
 *
 * Adding a column here without a UFR entry breaks E-06 at the layer that
 * holds the data. Add it to the registry and regenerate.
 *
 * Tables are emitted in topological order on required references, so every
 * parent is declared before its children.
 */

import {
  pgTable, pgEnum, uuid, varchar, text, integer, numeric,
  boolean, date, timestamp, jsonb,
} from "drizzle-orm/pg-core";

// ─── Enumerated types ───────────────────────────────────────────
export const investor_member_state_enum = pgEnum("investor_member_state_enum", ["investor", "member"]);
export const investor_accreditation_state_enum = pgEnum("investor_accreditation_state_enum", ["none", "in_review", "accredited", "expired"]);
export const organization_entity_type_enum = pgEnum("organization_entity_type_enum", ["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"]);
export const organization_role_in_enterprise_enum = pgEnum("organization_role_in_enterprise_enum", ["asset_platform", "operating_partner", "brand_partner", "investment_vehicle", "external_counterparty"]);
export const research_research_topic_enum = pgEnum("research_research_topic_enum", ["esg", "geographic", "asset_class", "economic", "regulatory"]);
export const agreement_agreement_type_enum = pgEnum("agreement_agreement_type_enum", ["subscription", "llp_agreement", "operating_agreement", "commercial_services", "share_purchase", "shareholders", "financing", "lease"]);
export const committee_committee_name_enum = pgEnum("committee_committee_name_enum", ["board", "investment", "audit_risk", "governance_ethics", "brand_market", "operations_asset_performance", "independent_constitutional_review_panel"]);
export const investment_vehicle_vehicle_form_enum = pgEnum("investment_vehicle_vehicle_form_enum", ["llp", "spv", "fund", "trust", "syndicate"]);
export const investment_vehicle_lifecycle_state_enum = pgEnum("investment_vehicle_lifecycle_state_enum", ["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"]);
export const capital_call_purpose_enum = pgEnum("capital_call_purpose_enum", ["acquisition", "approved_expansion", "approved_redevelopment", "extraordinary_event", "llp_agreement_provision"]);
export const compliance_event_event_type_enum = pgEnum("compliance_event_event_type_enum", ["audit_finding", "regulatory_notice", "policy_breach", "conflict_disclosure", "constitutional_failure", "operator_sla_breach", "reserve_breach"]);
export const compliance_event_severity_enum = pgEnum("compliance_event_severity_enum", ["advisory", "governance_alert", "material", "constitutional_breach"]);
export const distribution_waterfall_stage_enum = pgEnum("distribution_waterfall_stage_enum", ["1_operating_company", "2_brand_digital", "3_admin_reserve", "4_sinking_fund", "5_debt_service", "6_partner_distribution"]);
export const forecast_scenario_enum = pgEnum("forecast_scenario_enum", ["base", "downside", "upside", "exit"]);
export const investment_offering_offering_state_enum = pgEnum("investment_offering_offering_state_enum", ["draft", "open", "closed", "cancelled"]);
export const property_lifecycle_state_enum = pgEnum("property_lifecycle_state_enum", ["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"]);
export const resolution_resolution_type_enum = pgEnum("resolution_resolution_type_enum", ["ordinary", "special", "unanimous"]);
export const resolution_outcome_enum = pgEnum("resolution_outcome_enum", ["approved", "rejected", "tied_not_approved", "inquorate", "entrenched_not_unanimous", "entrenched_rights_not_confirmed"]);
export const risk_risk_category_enum = pgEnum("risk_risk_category_enum", ["liquidity", "interest_rate", "operator", "market", "climate", "currency", "legal", "regulatory", "technology", "counterparty"]);
export const risk_likelihood_enum = pgEnum("risk_likelihood_enum", ["rare", "unlikely", "possible", "likely", "almost_certain"]);
export const risk_impact_enum = pgEnum("risk_impact_enum", ["negligible", "minor", "moderate", "major", "severe"]);
export const commitment_commitment_state_enum = pgEnum("commitment_commitment_state_enum", ["offered", "accepted", "settled", "lapsed", "withdrawn"]);
export const due_diligence_workstream_enum = pgEnum("due_diligence_workstream_enum", ["legal", "technical", "environmental", "financial", "commercial", "title"]);
export const due_diligence_outcome_enum = pgEnum("due_diligence_outcome_enum", ["clear", "clear_with_conditions", "adverse"]);
export const valuation_source_enum = pgEnum("valuation_source_enum", ["independent", "management"]);
export const investment_capital_state_enum = pgEnum("investment_capital_state_enum", ["committed", "drawn", "invested", "returned", "distributed"]);

// ─── Investor ────────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   became_member_on
export const investor = pgTable("investor", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0160 */
  legal_name: varchar("legal_name", { length: 512 }).notNull(),
  /** UFR-0161 */
  member_state: investor_member_state_enum("member_state").notNull(),
  /** UFR-0162 */
  accreditation_state: investor_accreditation_state_enum("accreditation_state").notNull(),
  /** UFR-0163 */
  accreditation_expires_on: timestamp("accreditation_expires_on", { withTimezone: true }),
  /** UFR-0164 */
  tax_jurisdiction: varchar("tax_jurisdiction", { length: 512 }).notNull(),
  /** UFR-0165 */
  became_member_on: timestamp("became_member_on", { withTimezone: true }),
});

// ─── MarketIntelligence ──────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   observed_on
export const market_intelligence = pgTable("market_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0500 */
  market_region: varchar("market_region", { length: 512 }).notNull(),
  /** UFR-0501 */
  observed_on: date("observed_on").notNull(),
});

// ─── Organization ────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   registration_number, incorporated_on
export const organization = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0001 */
  legal_name: varchar("legal_name", { length: 512 }).notNull(),
  /** UFR-0002 */
  entity_type: organization_entity_type_enum("entity_type").notNull(),
  /** UFR-0003 */
  jurisdiction: varchar("jurisdiction", { length: 512 }).notNull(),
  /** UFR-0004 */
  registration_number: varchar("registration_number", { length: 512 }).notNull(),
  /** UFR-0005 */
  incorporated_on: date("incorporated_on").notNull(),
  /** UFR-0006 */
  role_in_enterprise: organization_role_in_enterprise_enum("role_in_enterprise").notNull(),
});

// ─── Research ────────────────────────────────────────────────
export const research = pgTable("research", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0520 */
  research_topic: research_research_topic_enum("research_topic").notNull(),
  /** UFR-0521 */
  research_version: integer("research_version").notNull(),
});

// ─── Agreement ───────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   counterparty_id
export const agreement = pgTable("agreement", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0280 */
  agreement_type: agreement_agreement_type_enum("agreement_type").notNull(),
  /** UFR-0281 */
  counterparty_id: uuid("counterparty_id").references(() => organization.id, { onDelete: "restrict" }).notNull(),  // REL-030 · onParentDelete: restrict
  /** UFR-0282 */
  annual_value: numeric("annual_value", { precision: 20, scale: 4 }),
  /** UFR-0283 */
  term_months: integer("term_months"),
  /** UFR-0284 */
  is_related_party: boolean("is_related_party").notNull(),
  /** UFR-0285 */
  is_material: boolean("is_material").notNull(),
});

// ─── Committee ───────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   organization_id
export const committee = pgTable("committee", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0340 */
  committee_name: committee_committee_name_enum("committee_name").notNull(),
  /** UFR-0341 */
  decision_authority: jsonb("decision_authority").notNull(),
  /** UFR-0342 */
  organization_id: uuid("organization_id").references(() => organization.id, { onDelete: "restrict" }).notNull(),  // REL-003 · onParentDelete: restrict
});

// ─── InvestmentVehicle ───────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_form, governing_organization_id
export const investment_vehicle = pgTable("investment_vehicle", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0020 */
  vehicle_name: varchar("vehicle_name", { length: 512 }).notNull(),
  /** UFR-0021 */
  vehicle_form: investment_vehicle_vehicle_form_enum("vehicle_form").notNull(),
  /** UFR-0022 */
  governing_organization_id: uuid("governing_organization_id").references(() => organization.id, { onDelete: "restrict" }).notNull(),  // REL-001 · onParentDelete: restrict
  /** UFR-0023 */
  total_units_issued: integer("total_units_issued").notNull(),
  /** UFR-0024 */
  reserve_floor_amount: numeric("reserve_floor_amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0025 */
  reserve_balance: numeric("reserve_balance", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0026 */
  approved_leverage_limit: numeric("approved_leverage_limit", { precision: 9, scale: 6 }),
  /** UFR-0027 */
  lifecycle_state: investment_vehicle_lifecycle_state_enum("lifecycle_state").notNull(),
});

// ─── Portfolio ───────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   organization_id
export const portfolio = pgTable("portfolio", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0040 */
  portfolio_name: varchar("portfolio_name", { length: 512 }).notNull(),
  /** UFR-0041 */
  investment_strategy: text("investment_strategy").notNull(),
  /** UFR-0042 */
  concentration_ceiling: numeric("concentration_ceiling", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0043 */
  organization_id: uuid("organization_id").references(() => organization.id, { onDelete: "restrict" }).notNull(),  // REL-002 · onParentDelete: restrict
});

// ─── Benchmark ───────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id
export const benchmark = pgTable("benchmark", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0400 */
  benchmark_name: varchar("benchmark_name", { length: 512 }).notNull(),
  /** UFR-0401 */
  benchmark_value: numeric("benchmark_value", { precision: 20, scale: 6 }).notNull(),
  /** UFR-0402 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-041 · onParentDelete: restrict
});

// ─── CapitalCall ─────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id, called_amount, purpose
export const capital_call = pgTable("capital_call", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0200 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-023 · onParentDelete: orphan-forbidden
  /** UFR-0201 */
  called_amount: numeric("called_amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0202 */
  due_on: date("due_on").notNull(),
  /** UFR-0203 */
  purpose: capital_call_purpose_enum("purpose").notNull(),
});

// ─── ComplianceEvent ─────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   declared_by
export const compliance_event = pgTable("compliance_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0360 */
  event_type: compliance_event_event_type_enum("event_type").notNull(),
  /** UFR-0361 */
  severity: compliance_event_severity_enum("severity").notNull(),
  /** UFR-0362 */
  declared_by: uuid("declared_by").references(() => committee.id, { onDelete: "restrict" }).notNull(),  // REL-034 · onParentDelete: orphan-forbidden
  /** UFR-0363 */
  disclosed_to_partners: boolean("disclosed_to_partners").notNull(),
});

// ─── Distribution ────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id, waterfall_stage, amount, executed_at, revenue_base
export const distribution = pgTable("distribution", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0260 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-027 · onParentDelete: orphan-forbidden
  /** UFR-0261 */
  waterfall_stage: distribution_waterfall_stage_enum("waterfall_stage").notNull(),
  /** UFR-0262 */
  amount: numeric("amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0263 */
  executed_at: timestamp("executed_at", { withTimezone: true }).notNull(),
  /** UFR-0264 */
  revenue_base: numeric("revenue_base", { precision: 20, scale: 4 }).notNull(),
});

// ─── Forecast ────────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id
export const forecast = pgTable("forecast", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0420 */
  horizon_years: integer("horizon_years").notNull(),
  /** UFR-0421 */
  scenario: forecast_scenario_enum("scenario").notNull(),
  /** UFR-0422 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-042 · onParentDelete: restrict
});

// ─── InvestmentOffering ──────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id
export const investment_offering = pgTable("investment_offering", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0140 */
  offering_name: varchar("offering_name", { length: 512 }).notNull(),
  /** UFR-0141 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-020 · onParentDelete: restrict
  /** UFR-0142 */
  target_amount: numeric("target_amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0143 */
  minimum_subscription: numeric("minimum_subscription", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0144 */
  brand_participation_rate: numeric("brand_participation_rate", { precision: 9, scale: 6 }),
  /** UFR-0145 */
  offering_state: investment_offering_offering_state_enum("offering_state").notNull(),
});

// ─── OwnershipPosition ───────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   investor_id, vehicle_id
export const ownership_position = pgTable("ownership_position", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0240 */
  investor_id: uuid("investor_id").references(() => investor.id, { onDelete: "restrict" }).notNull(),  // REL-025 · onParentDelete: orphan-forbidden
  /** UFR-0241 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-026 · onParentDelete: orphan-forbidden
  /** UFR-0242 */
  units_held: numeric("units_held", { precision: 20, scale: 6 }).notNull(),
  /** UFR-0243 */
  voting_rights_percent: numeric("voting_rights_percent", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0244 */
  ownership_class: varchar("ownership_class", { length: 512 }).notNull(),
});

// ─── PerformanceReport ───────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id, period_end
export const performance_report = pgTable("performance_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0380 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-040 · onParentDelete: orphan-forbidden
  /** UFR-0381 */
  period_end: date("period_end").notNull(),
  /** UFR-0382 */
  irr: numeric("irr", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0383 */
  moic: numeric("moic", { precision: 20, scale: 6 }).notNull(),
  /** UFR-0384 */
  nav: numeric("nav", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0385 */
  reserve_coverage_ratio: numeric("reserve_coverage_ratio", { precision: 9, scale: 6 }).notNull(),
});

// ─── Property ────────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id, jurisdiction, title_reference, environmental_commitments
export const property = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0060 */
  property_name: varchar("property_name", { length: 512 }).notNull(),
  /** UFR-0061 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-010 · onParentDelete: restrict
  /** UFR-0062 */
  portfolio_id: uuid("portfolio_id").references(() => portfolio.id, { onDelete: "restrict" }),  // REL-011 · onParentDelete: restrict
  /** UFR-0063 */
  jurisdiction: varchar("jurisdiction", { length: 512 }).notNull(),
  /** UFR-0064 */
  title_reference: varchar("title_reference", { length: 512 }).notNull(),
  /** UFR-0065 */
  land_area_sqm: numeric("land_area_sqm", { precision: 20, scale: 6 }).notNull(),
  /** UFR-0066 */
  lifecycle_state: property_lifecycle_state_enum("lifecycle_state").notNull(),
  /** UFR-0067 */
  stabilised_on: date("stabilised_on"),
  /** UFR-0068 */
  environmental_commitments: jsonb("environmental_commitments"),
});

// ─── Resolution ──────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   matter, resolution_type, equity_for, equity_against, equity_present, outcome, rationale, committee_id, vehicle_id
export const resolution = pgTable("resolution", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0300 */
  matter: varchar("matter", { length: 512 }).notNull(),
  /** UFR-0301 */
  resolution_type: resolution_resolution_type_enum("resolution_type").notNull(),
  /** UFR-0302 */
  equity_for: numeric("equity_for", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0303 */
  equity_against: numeric("equity_against", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0304 */
  equity_present: numeric("equity_present", { precision: 9, scale: 6 }).notNull(),
  /** UFR-0305 */
  outcome: resolution_outcome_enum("outcome").notNull(),
  /** UFR-0306 */
  rationale: text("rationale").notNull(),
  /** UFR-0307 */
  committee_id: uuid("committee_id").references(() => committee.id, { onDelete: "restrict" }).notNull(),  // REL-031 · onParentDelete: orphan-forbidden
  /** UFR-0308 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }),  // REL-032 · onParentDelete: restrict
});

// ─── Risk ────────────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   vehicle_id
export const risk = pgTable("risk", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0440 */
  risk_category: risk_risk_category_enum("risk_category").notNull(),
  /** UFR-0441 */
  likelihood: risk_likelihood_enum("likelihood").notNull(),
  /** UFR-0442 */
  impact: risk_impact_enum("impact").notNull(),
  /** UFR-0443 */
  vehicle_id: uuid("vehicle_id").references(() => investment_vehicle.id, { onDelete: "restrict" }).notNull(),  // REL-043 · onParentDelete: restrict
});

// ─── Commitment ──────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   investor_id, offering_id, committed_amount, accepted_at
export const commitment = pgTable("commitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0180 */
  investor_id: uuid("investor_id").references(() => investor.id, { onDelete: "restrict" }).notNull(),  // REL-021 · onParentDelete: orphan-forbidden
  /** UFR-0181 */
  offering_id: uuid("offering_id").references(() => investment_offering.id, { onDelete: "restrict" }).notNull(),  // REL-022 · onParentDelete: orphan-forbidden
  /** UFR-0182 */
  committed_amount: numeric("committed_amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0183 */
  accepted_at: timestamp("accepted_at", { withTimezone: true }),
  /** UFR-0184 */
  commitment_state: commitment_commitment_state_enum("commitment_state").notNull(),
});

// ─── Disposition ─────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   property_id, disposal_price, completed_on
export const disposition = pgTable("disposition", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0120 */
  property_id: uuid("property_id").references(() => property.id, { onDelete: "restrict" }).notNull(),  // REL-015 · onParentDelete: orphan-forbidden
  /** UFR-0121 */
  disposal_price: numeric("disposal_price", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0122 */
  completed_on: date("completed_on").notNull(),
});

// ─── DueDiligence ────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   property_id
export const due_diligence = pgTable("due_diligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0460 */
  property_id: uuid("property_id").references(() => property.id, { onDelete: "restrict" }).notNull(),  // REL-017 · onParentDelete: orphan-forbidden
  /** UFR-0461 */
  workstream: due_diligence_workstream_enum("workstream").notNull(),
  /** UFR-0462 */
  outcome: due_diligence_outcome_enum("outcome").notNull(),
});

// ─── InvestmentThesis ────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   property_id
export const investment_thesis = pgTable("investment_thesis", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0480 */
  thesis_statement: text("thesis_statement").notNull(),
  /** UFR-0481 */
  thesis_version: integer("thesis_version").notNull(),
  /** UFR-0482 */
  return_drivers: jsonb("return_drivers").notNull(),
  /** UFR-0483 */
  risk_mitigants: jsonb("risk_mitigants").notNull(),
  /** UFR-0484 */
  property_id: uuid("property_id").references(() => property.id, { onDelete: "restrict" }).notNull(),  // REL-016 · onParentDelete: orphan-forbidden
});

// ─── Policy ──────────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   policy_id, approved_by_resolution_id
export const policy = pgTable("policy", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0320 */
  policy_id: varchar("policy_id", { length: 512 }).notNull(),
  /** UFR-0321 */
  policy_version: integer("policy_version").notNull(),
  /** UFR-0322 */
  approved_by_resolution_id: uuid("approved_by_resolution_id").references(() => resolution.id, { onDelete: "restrict" }).notNull(),  // REL-033 · onParentDelete: orphan-forbidden
});

// ─── Valuation ───────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   property_id, valued_on, value, source, valuer_name
export const valuation = pgTable("valuation", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0100 */
  property_id: uuid("property_id").references(() => property.id, { onDelete: "restrict" }).notNull(),  // REL-014 · onParentDelete: orphan-forbidden
  /** UFR-0101 */
  valued_on: date("valued_on").notNull(),
  /** UFR-0102 */
  value: numeric("value", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0103 */
  source: valuation_source_enum("source").notNull(),
  /** UFR-0104 */
  valuer_name: varchar("valuer_name", { length: 512 }),
});

// ─── Acquisition ─────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   property_id, acquisition_price, completed_on, investment_thesis_id
export const acquisition = pgTable("acquisition", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0080 */
  property_id: uuid("property_id").references(() => property.id, { onDelete: "restrict" }).notNull(),  // REL-012 · onParentDelete: orphan-forbidden
  /** UFR-0081 */
  acquisition_price: numeric("acquisition_price", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0082 */
  completed_on: date("completed_on").notNull(),
  /** UFR-0083 */
  investment_thesis_id: uuid("investment_thesis_id").references(() => investment_thesis.id, { onDelete: "restrict" }).notNull(),  // REL-013 · onParentDelete: orphan-forbidden
});

// ─── Investment ──────────────────────────────────────────────
// Immutable after insert (absent from the generated Update contract):
//   commitment_id, deployed_amount, deployed_at
export const investment = pgTable("investment", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: uuid("created_by").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  version: integer("version").notNull().default(0),
  /** UFR-0220 */
  commitment_id: uuid("commitment_id").references(() => commitment.id, { onDelete: "restrict" }).notNull(),  // REL-024 · onParentDelete: orphan-forbidden
  /** UFR-0221 */
  deployed_amount: numeric("deployed_amount", { precision: 20, scale: 4 }).notNull(),
  /** UFR-0222 */
  deployed_at: timestamp("deployed_at", { withTimezone: true }).notNull(),
  /** UFR-0223 */
  capital_state: investment_capital_state_enum("capital_state").notNull(),
});

export const TABLES = {
  Investor: investor,
  MarketIntelligence: market_intelligence,
  Organization: organization,
  Research: research,
  Agreement: agreement,
  Committee: committee,
  InvestmentVehicle: investment_vehicle,
  Portfolio: portfolio,
  Benchmark: benchmark,
  CapitalCall: capital_call,
  ComplianceEvent: compliance_event,
  Distribution: distribution,
  Forecast: forecast,
  InvestmentOffering: investment_offering,
  OwnershipPosition: ownership_position,
  PerformanceReport: performance_report,
  Property: property,
  Resolution: resolution,
  Risk: risk,
  Commitment: commitment,
  Disposition: disposition,
  DueDiligence: due_diligence,
  InvestmentThesis: investment_thesis,
  Policy: policy,
  Valuation: valuation,
  Acquisition: acquisition,
  Investment: investment,
} as const;
