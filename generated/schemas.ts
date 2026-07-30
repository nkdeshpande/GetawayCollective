/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: constants/ufr.ts (the Unified Field Registry, L2.5)
 * Regenerate: npm run schemas
 * Verify:     npm run schemas:check
 *
 * Editing this file by hand breaks invariant E-06: a field would exist
 * in validation without existing in the registry. Add the field to the
 * UFR and regenerate instead.
 */

import { z } from "zod";

/** Present on every object. Declared once in the UFR, applied uniformly. */
export const SystemFields = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
  updated_at: z.string().datetime(),
  version: z.number().int().nonnegative(),
});

// ─── Acquisition ───────────────────────────────────────────────
export const AcquisitionSchema = SystemFields.extend({
  /** UFR-0080 — The Property acquired. */
  property_id: z.string().uuid(),
  /** UFR-0081 — Consideration paid, excluding transaction costs. Immutable — changes are recorded as amendment records, never edits. */
  acquisition_price: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0082 — Date legal title transferred. */
  completed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0083 — The thesis under which this acquisition was approved. Required — no Property enters the portfolio without one. */
  investment_thesis_id: z.string().uuid(),
});
export type Acquisition = z.infer<typeof AcquisitionSchema>;

export const AcquisitionCreateSchema = z.object({
  /** UFR-0080 — The Property acquired. */
  property_id: z.string().uuid(),
  /** UFR-0081 — Consideration paid, excluding transaction costs. Immutable — changes are recorded as amendment records, never edits. */
  acquisition_price: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0082 — Date legal title transferred. */
  completed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0083 — The thesis under which this acquisition was approved. Required — no Property enters the portfolio without one. */
  investment_thesis_id: z.string().uuid(),
});

/** Every field is immutable or computed: this object is append-only. */
export const AcquisitionUpdateSchema = z.object({}).strict();

// ─── Agreement ─────────────────────────────────────────────────
export const AgreementSchema = SystemFields.extend({
  /** UFR-0280 — Instrument type. 'operating_agreement' and 'commercial_services' are always material related-party transactions regardless of value. */
  agreement_type: z.enum(["subscription", "llp_agreement", "operating_agreement", "commercial_services", "share_purchase", "shareholders", "financing", "lease"]),
  /** UFR-0281 — The other party. Where this is an affiliated division, the agreement is a related-party transaction. */
  counterparty_id: z.string().uuid(),
  /** UFR-0282 — Annual consideration. Tested against the materiality threshold: 50 lakh, or 2 percent of vehicle operating expense. */
  annual_value: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float").optional(),
  /** UFR-0283 — Term length. Over 36 months is material regardless of value. */
  term_months: z.number().int().optional(),
  /** UFR-0284 — Derived: true when the counterparty is an affiliated division. Because GC holds no equity in the vehicles it governs, every GC economic relationship r */
  is_related_party: z.boolean(),
  /** UFR-0285 — Derived from the four materiality tests, plus the always-material carve-out for Operating and Commercial Services Agreements and their amendments. */
  is_material: z.boolean(),
});
export type Agreement = z.infer<typeof AgreementSchema>;

export const AgreementCreateSchema = z.object({
  /** UFR-0280 — Instrument type. 'operating_agreement' and 'commercial_services' are always material related-party transactions regardless of value. */
  agreement_type: z.enum(["subscription", "llp_agreement", "operating_agreement", "commercial_services", "share_purchase", "shareholders", "financing", "lease"]),
  /** UFR-0281 — The other party. Where this is an affiliated division, the agreement is a related-party transaction. */
  counterparty_id: z.string().uuid(),
  /** UFR-0282 — Annual consideration. Tested against the materiality threshold: 50 lakh, or 2 percent of vehicle operating expense. */
  annual_value: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float").optional(),
  /** UFR-0283 — Term length. Over 36 months is material regardless of value. */
  term_months: z.number().int().optional(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const AgreementUpdateSchema = z.object({
  /** UFR-0280 — Instrument type. 'operating_agreement' and 'commercial_services' are always material related-party transactions regardless of value. */
  agreement_type: z.enum(["subscription", "llp_agreement", "operating_agreement", "commercial_services", "share_purchase", "shareholders", "financing", "lease"]).optional(),
  /** UFR-0282 — Annual consideration. Tested against the materiality threshold: 50 lakh, or 2 percent of vehicle operating expense. */
  annual_value: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float").optional(),
  /** UFR-0283 — Term length. Over 36 months is material regardless of value. */
  term_months: z.number().int().optional(),
}).partial().strict();

// ─── Benchmark ─────────────────────────────────────────────────
export const BenchmarkSchema = SystemFields.extend({
  /** UFR-0400 — Name of the comparator: a market index, portfolio average, or peer fund. Must identify the source precisely enough to reproduce the figure. */
  benchmark_name: z.string().min(1),
  /** UFR-0401 — Comparator value for the period. */
  benchmark_value: z.number(),
  /** UFR-0402 — The vehicle this comparator is measured against. A benchmark with no subject is uninterpretable — it was previously unanchored in the graph. */
  vehicle_id: z.string().uuid(),
});
export type Benchmark = z.infer<typeof BenchmarkSchema>;

export const BenchmarkCreateSchema = z.object({
  /** UFR-0400 — Name of the comparator: a market index, portfolio average, or peer fund. Must identify the source precisely enough to reproduce the figure. */
  benchmark_name: z.string().min(1),
  /** UFR-0401 — Comparator value for the period. */
  benchmark_value: z.number(),
  /** UFR-0402 — The vehicle this comparator is measured against. A benchmark with no subject is uninterpretable — it was previously unanchored in the graph. */
  vehicle_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const BenchmarkUpdateSchema = z.object({
  /** UFR-0400 — Name of the comparator: a market index, portfolio average, or peer fund. Must identify the source precisely enough to reproduce the figure. */
  benchmark_name: z.string().min(1).optional(),
  /** UFR-0401 — Comparator value for the period. */
  benchmark_value: z.number().optional(),
}).partial().strict();

// ─── CapitalCall ───────────────────────────────────────────────
export const CapitalCallSchema = SystemFields.extend({
  /** UFR-0200 — The vehicle calling capital. */
  vehicle_id: z.string().uuid(),
  /** UFR-0201 — Total amount called across all committed holders. */
  called_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0202 — Date called funds are due from holders. Drives default tracking under the LLP Agreement. */
  due_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0203 — Why capital is being called. The closed set is the enforcement: post-stabilisation there is no value representing an operating deficit, routine mainte */
  purpose: z.enum(["acquisition", "approved_expansion", "approved_redevelopment", "extraordinary_event", "llp_agreement_provision"]),
});
export type CapitalCall = z.infer<typeof CapitalCallSchema>;

export const CapitalCallCreateSchema = z.object({
  /** UFR-0200 — The vehicle calling capital. */
  vehicle_id: z.string().uuid(),
  /** UFR-0201 — Total amount called across all committed holders. */
  called_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0202 — Date called funds are due from holders. Drives default tracking under the LLP Agreement. */
  due_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0203 — Why capital is being called. The closed set is the enforcement: post-stabilisation there is no value representing an operating deficit, routine mainte */
  purpose: z.enum(["acquisition", "approved_expansion", "approved_redevelopment", "extraordinary_event", "llp_agreement_provision"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const CapitalCallUpdateSchema = z.object({
  /** UFR-0202 — Date called funds are due from holders. Drives default tracking under the LLP Agreement. */
  due_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).partial().strict();

// ─── Commitment ────────────────────────────────────────────────
export const CommitmentSchema = SystemFields.extend({
  /** UFR-0180 — The committing identity. */
  investor_id: z.string().uuid(),
  /** UFR-0181 — The offering committed into. */
  offering_id: z.string().uuid(),
  /** UFR-0182 — Legally binding promise of capital. Precedes deployment; distinct from Investment. */
  committed_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0183 — When the enterprise formally accepted the commitment. This is the accreditation test point: a commitment accepted while accreditation was valid comple */
  accepted_at: z.string().datetime().optional(),
  /** UFR-0184 — Commitment lifecycle. 'lapsed' is the automatic outcome when accreditation expires before acceptance. */
  commitment_state: z.enum(["offered", "accepted", "settled", "lapsed", "withdrawn"]),
});
export type Commitment = z.infer<typeof CommitmentSchema>;

export const CommitmentCreateSchema = z.object({
  /** UFR-0180 — The committing identity. */
  investor_id: z.string().uuid(),
  /** UFR-0181 — The offering committed into. */
  offering_id: z.string().uuid(),
  /** UFR-0182 — Legally binding promise of capital. Precedes deployment; distinct from Investment. */
  committed_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0183 — When the enterprise formally accepted the commitment. This is the accreditation test point: a commitment accepted while accreditation was valid comple */
  accepted_at: z.string().datetime().optional(),
  /** UFR-0184 — Commitment lifecycle. 'lapsed' is the automatic outcome when accreditation expires before acceptance. */
  commitment_state: z.enum(["offered", "accepted", "settled", "lapsed", "withdrawn"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const CommitmentUpdateSchema = z.object({
  /** UFR-0184 — Commitment lifecycle. 'lapsed' is the automatic outcome when accreditation expires before acceptance. */
  commitment_state: z.enum(["offered", "accepted", "settled", "lapsed", "withdrawn"]).optional(),
}).partial().strict();

// ─── Committee ─────────────────────────────────────────────────
export const CommitteeSchema = SystemFields.extend({
  /** UFR-0340 — The governance bodies established by EP-01 §3.5, plus the Independent Constitutional Review Panel convened under L1-01 §31. */
  committee_name: z.enum(["board", "investment", "audit_risk", "governance_ethics", "brand_market", "operations_asset_performance", "independent_constitutional_review_panel"]),
  /** UFR-0341 — Matters this committee may decide versus merely recommend. Committees do not replace Board authority unless expressly delegated. */
  decision_authority: z.unknown(),
  /** UFR-0342 — The Organization this Committee serves. Anchors governance bodies to the enterprise root. */
  organization_id: z.string().uuid(),
});
export type Committee = z.infer<typeof CommitteeSchema>;

export const CommitteeCreateSchema = z.object({
  /** UFR-0340 — The governance bodies established by EP-01 §3.5, plus the Independent Constitutional Review Panel convened under L1-01 §31. */
  committee_name: z.enum(["board", "investment", "audit_risk", "governance_ethics", "brand_market", "operations_asset_performance", "independent_constitutional_review_panel"]),
  /** UFR-0341 — Matters this committee may decide versus merely recommend. Committees do not replace Board authority unless expressly delegated. */
  decision_authority: z.unknown(),
  /** UFR-0342 — The Organization this Committee serves. Anchors governance bodies to the enterprise root. */
  organization_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const CommitteeUpdateSchema = z.object({
  /** UFR-0340 — The governance bodies established by EP-01 §3.5, plus the Independent Constitutional Review Panel convened under L1-01 §31. */
  committee_name: z.enum(["board", "investment", "audit_risk", "governance_ethics", "brand_market", "operations_asset_performance", "independent_constitutional_review_panel"]).optional(),
  /** UFR-0341 — Matters this committee may decide versus merely recommend. Committees do not replace Board authority unless expressly delegated. */
  decision_authority: z.unknown().optional(),
}).partial().strict();

// ─── ComplianceEvent ───────────────────────────────────────────
export const ComplianceEventSchema = SystemFields.extend({
  /** UFR-0360 — Classification of the event. 'constitutional_failure' carries the CF-01 through CF-06 triggers and compels re-ratification. */
  event_type: z.enum(["audit_finding", "regulatory_notice", "policy_breach", "conflict_disclosure", "constitutional_failure", "operator_sla_breach", "reserve_breach"]),
  /** UFR-0361 — Severity band. constitutional_breach is reserved for the CF-01 through CF-06 triggers and compels re-ratification of the affected layer. */
  severity: z.enum(["advisory", "governance_alert", "material", "constitutional_breach"]),
  /** UFR-0362 — Who declared it. For constitutional failure this is the Governance and Ethics Committee, or the executive in the interim state, or the Independent Con */
  declared_by: z.string().uuid(),
  /** UFR-0363 — Whether this was disclosed to affected LLP Partners. Material failures affecting investor rights, reporting, distributions, ownership or governance mu */
  disclosed_to_partners: z.boolean(),
});
export type ComplianceEvent = z.infer<typeof ComplianceEventSchema>;

export const ComplianceEventCreateSchema = z.object({
  /** UFR-0360 — Classification of the event. 'constitutional_failure' carries the CF-01 through CF-06 triggers and compels re-ratification. */
  event_type: z.enum(["audit_finding", "regulatory_notice", "policy_breach", "conflict_disclosure", "constitutional_failure", "operator_sla_breach", "reserve_breach"]),
  /** UFR-0361 — Severity band. constitutional_breach is reserved for the CF-01 through CF-06 triggers and compels re-ratification of the affected layer. */
  severity: z.enum(["advisory", "governance_alert", "material", "constitutional_breach"]),
  /** UFR-0362 — Who declared it. For constitutional failure this is the Governance and Ethics Committee, or the executive in the interim state, or the Independent Con */
  declared_by: z.string().uuid(),
  /** UFR-0363 — Whether this was disclosed to affected LLP Partners. Material failures affecting investor rights, reporting, distributions, ownership or governance mu */
  disclosed_to_partners: z.boolean(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const ComplianceEventUpdateSchema = z.object({
  /** UFR-0360 — Classification of the event. 'constitutional_failure' carries the CF-01 through CF-06 triggers and compels re-ratification. */
  event_type: z.enum(["audit_finding", "regulatory_notice", "policy_breach", "conflict_disclosure", "constitutional_failure", "operator_sla_breach", "reserve_breach"]).optional(),
  /** UFR-0361 — Severity band. constitutional_breach is reserved for the CF-01 through CF-06 triggers and compels re-ratification of the affected layer. */
  severity: z.enum(["advisory", "governance_alert", "material", "constitutional_breach"]).optional(),
  /** UFR-0363 — Whether this was disclosed to affected LLP Partners. Material failures affecting investor rights, reporting, distributions, ownership or governance mu */
  disclosed_to_partners: z.boolean().optional(),
}).partial().strict();

// ─── Disposition ───────────────────────────────────────────────
export const DispositionSchema = SystemFields.extend({
  /** UFR-0120 — The Property exited. */
  property_id: z.string().uuid(),
  /** UFR-0121 — Gross consideration received. */
  disposal_price: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0122 — Date legal title transferred out. */
  completed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Disposition = z.infer<typeof DispositionSchema>;

export const DispositionCreateSchema = z.object({
  /** UFR-0120 — The Property exited. */
  property_id: z.string().uuid(),
  /** UFR-0121 — Gross consideration received. */
  disposal_price: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0122 — Date legal title transferred out. */
  completed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** Every field is immutable or computed: this object is append-only. */
export const DispositionUpdateSchema = z.object({}).strict();

// ─── Distribution ──────────────────────────────────────────────
export const DistributionSchema = SystemFields.extend({
  /** UFR-0260 — The distributing vehicle. */
  vehicle_id: z.string().uuid(),
  /** UFR-0261 — Which of the six waterfall stages this payment satisfies. Stage 6 cannot execute while any Stage 5 obligation is outstanding. */
  waterfall_stage: z.enum(["1_operating_company", "2_brand_digital", "3_admin_reserve", "4_sinking_fund", "5_debt_service", "6_partner_distribution"]),
  /** UFR-0262 — Amount distributed. Executed payouts cannot change; corrections post offsetting entries. */
  amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0263 — When the payment executed. */
  executed_at: z.string().datetime(),
  /** UFR-0264 — The Revenue Base this distribution was computed from: gross operating receipts less statutory taxes, booking platform fees, channel commissions, settl */
  revenue_base: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
});
export type Distribution = z.infer<typeof DistributionSchema>;

export const DistributionCreateSchema = z.object({
  /** UFR-0260 — The distributing vehicle. */
  vehicle_id: z.string().uuid(),
  /** UFR-0261 — Which of the six waterfall stages this payment satisfies. Stage 6 cannot execute while any Stage 5 obligation is outstanding. */
  waterfall_stage: z.enum(["1_operating_company", "2_brand_digital", "3_admin_reserve", "4_sinking_fund", "5_debt_service", "6_partner_distribution"]),
  /** UFR-0262 — Amount distributed. Executed payouts cannot change; corrections post offsetting entries. */
  amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0263 — When the payment executed. */
  executed_at: z.string().datetime(),
  /** UFR-0264 — The Revenue Base this distribution was computed from: gross operating receipts less statutory taxes, booking platform fees, channel commissions, settl */
  revenue_base: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
});

/** Every field is immutable or computed: this object is append-only. */
export const DistributionUpdateSchema = z.object({}).strict();

// ─── DueDiligence ──────────────────────────────────────────────
export const DueDiligenceSchema = SystemFields.extend({
  /** UFR-0460 — The Property investigated. */
  property_id: z.string().uuid(),
  /** UFR-0461 — Diligence workstream. All must complete before acquisition approval. */
  workstream: z.enum(["legal", "technical", "environmental", "financial", "commercial", "title"]),
  /** UFR-0462 — Workstream finding. An adverse outcome in any single workstream blocks acquisition approval until resolved or explicitly accepted by the Investment Co */
  outcome: z.enum(["clear", "clear_with_conditions", "adverse"]),
});
export type DueDiligence = z.infer<typeof DueDiligenceSchema>;

export const DueDiligenceCreateSchema = z.object({
  /** UFR-0460 — The Property investigated. */
  property_id: z.string().uuid(),
  /** UFR-0461 — Diligence workstream. All must complete before acquisition approval. */
  workstream: z.enum(["legal", "technical", "environmental", "financial", "commercial", "title"]),
  /** UFR-0462 — Workstream finding. An adverse outcome in any single workstream blocks acquisition approval until resolved or explicitly accepted by the Investment Co */
  outcome: z.enum(["clear", "clear_with_conditions", "adverse"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const DueDiligenceUpdateSchema = z.object({
  /** UFR-0461 — Diligence workstream. All must complete before acquisition approval. */
  workstream: z.enum(["legal", "technical", "environmental", "financial", "commercial", "title"]).optional(),
  /** UFR-0462 — Workstream finding. An adverse outcome in any single workstream blocks acquisition approval until resolved or explicitly accepted by the Investment Co */
  outcome: z.enum(["clear", "clear_with_conditions", "adverse"]).optional(),
}).partial().strict();

// ─── Forecast ──────────────────────────────────────────────────
export const ForecastSchema = SystemFields.extend({
  /** UFR-0420 — Forecast horizon in years. */
  horizon_years: z.number().int(),
  /** UFR-0421 — Scenario modelled. Every forecast declares its case; an undeclared forecast gets read as base and misleads. */
  scenario: z.enum(["base", "downside", "upside", "exit"]),
  /** UFR-0422 — The vehicle forecast. Required: a projection detached from what it projects cannot be reconciled against outcome. */
  vehicle_id: z.string().uuid(),
});
export type Forecast = z.infer<typeof ForecastSchema>;

export const ForecastCreateSchema = z.object({
  /** UFR-0420 — Forecast horizon in years. */
  horizon_years: z.number().int(),
  /** UFR-0421 — Scenario modelled. Every forecast declares its case; an undeclared forecast gets read as base and misleads. */
  scenario: z.enum(["base", "downside", "upside", "exit"]),
  /** UFR-0422 — The vehicle forecast. Required: a projection detached from what it projects cannot be reconciled against outcome. */
  vehicle_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const ForecastUpdateSchema = z.object({
  /** UFR-0420 — Forecast horizon in years. */
  horizon_years: z.number().int().optional(),
  /** UFR-0421 — Scenario modelled. Every forecast declares its case; an undeclared forecast gets read as base and misleads. */
  scenario: z.enum(["base", "downside", "upside", "exit"]).optional(),
}).partial().strict();

// ─── Investment ────────────────────────────────────────────────
export const InvestmentSchema = SystemFields.extend({
  /** UFR-0220 — The commitment this deployment draws against. */
  commitment_id: z.string().uuid(),
  /** UFR-0221 — Capital actually deployed. Immutable. Distinct from the commitment that authorised it. */
  deployed_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0222 — When the capital was deployed. */
  deployed_at: z.string().datetime(),
  /** UFR-0223 — Every unit of capital sits in exactly one of these states at all times. The sum across states must reconcile to total committed — no capital is ever u */
  capital_state: z.enum(["committed", "drawn", "invested", "returned", "distributed"]),
});
export type Investment = z.infer<typeof InvestmentSchema>;

export const InvestmentCreateSchema = z.object({
  /** UFR-0220 — The commitment this deployment draws against. */
  commitment_id: z.string().uuid(),
  /** UFR-0221 — Capital actually deployed. Immutable. Distinct from the commitment that authorised it. */
  deployed_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0222 — When the capital was deployed. */
  deployed_at: z.string().datetime(),
  /** UFR-0223 — Every unit of capital sits in exactly one of these states at all times. The sum across states must reconcile to total committed — no capital is ever u */
  capital_state: z.enum(["committed", "drawn", "invested", "returned", "distributed"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const InvestmentUpdateSchema = z.object({
  /** UFR-0223 — Every unit of capital sits in exactly one of these states at all times. The sum across states must reconcile to total committed — no capital is ever u */
  capital_state: z.enum(["committed", "drawn", "invested", "returned", "distributed"]).optional(),
}).partial().strict();

// ─── InvestmentOffering ────────────────────────────────────────
export const InvestmentOfferingSchema = SystemFields.extend({
  /** UFR-0140 — Name of the offering, e.g. Series A. */
  offering_name: z.string().min(1),
  /** UFR-0141 — The vehicle raising capital. */
  vehicle_id: z.string().uuid(),
  /** UFR-0142 — Total capital sought. */
  target_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0143 — Minimum commitment accepted. Set per offering by the Investment Committee — deliberately not a constitutional constant (L1-01 §27). */
  minimum_subscription: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0144 — Brand and Digital Company participation as a share of the Revenue Base, for the vehicle under this offering. Disclosed before subscription and fixed f */
  brand_participation_rate: z.number().min(0).optional(),
  /** UFR-0145 — Offering lifecycle. Commitments may be accepted only while state is open; closing is irreversible, and cancelled offerings retain their record rather  */
  offering_state: z.enum(["draft", "open", "closed", "cancelled"]),
});
export type InvestmentOffering = z.infer<typeof InvestmentOfferingSchema>;

export const InvestmentOfferingCreateSchema = z.object({
  /** UFR-0140 — Name of the offering, e.g. Series A. */
  offering_name: z.string().min(1),
  /** UFR-0141 — The vehicle raising capital. */
  vehicle_id: z.string().uuid(),
  /** UFR-0142 — Total capital sought. */
  target_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0143 — Minimum commitment accepted. Set per offering by the Investment Committee — deliberately not a constitutional constant (L1-01 §27). */
  minimum_subscription: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0144 — Brand and Digital Company participation as a share of the Revenue Base, for the vehicle under this offering. Disclosed before subscription and fixed f */
  brand_participation_rate: z.number().min(0).optional(),
  /** UFR-0145 — Offering lifecycle. Commitments may be accepted only while state is open; closing is irreversible, and cancelled offerings retain their record rather  */
  offering_state: z.enum(["draft", "open", "closed", "cancelled"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const InvestmentOfferingUpdateSchema = z.object({
  /** UFR-0140 — Name of the offering, e.g. Series A. */
  offering_name: z.string().min(1).optional(),
  /** UFR-0142 — Total capital sought. */
  target_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float").optional(),
  /** UFR-0143 — Minimum commitment accepted. Set per offering by the Investment Committee — deliberately not a constitutional constant (L1-01 §27). */
  minimum_subscription: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float").optional(),
  /** UFR-0144 — Brand and Digital Company participation as a share of the Revenue Base, for the vehicle under this offering. Disclosed before subscription and fixed f */
  brand_participation_rate: z.number().min(0).optional(),
  /** UFR-0145 — Offering lifecycle. Commitments may be accepted only while state is open; closing is irreversible, and cancelled offerings retain their record rather  */
  offering_state: z.enum(["draft", "open", "closed", "cancelled"]).optional(),
}).partial().strict();

// ─── InvestmentThesis ──────────────────────────────────────────
export const InvestmentThesisSchema = SystemFields.extend({
  /** UFR-0480 — Why this Property should outperform over twenty years. Immutable once versioned — edits create a new version so that what was believed at approval rem */
  thesis_statement: z.string(),
  /** UFR-0481 — Version number. Knowledge versions forward; prior versions remain accessible. */
  thesis_version: z.number().int(),
  /** UFR-0482 — Identified drivers of return. */
  return_drivers: z.unknown(),
  /** UFR-0483 — Identified risks and their mitigations. A thesis that names no risks is not a thesis. */
  risk_mitigants: z.unknown(),
  /** UFR-0484 — The Property this thesis concerns. Written while the Property is in prospecting state, before Acquisition references the thesis. */
  property_id: z.string().uuid(),
});
export type InvestmentThesis = z.infer<typeof InvestmentThesisSchema>;

export const InvestmentThesisCreateSchema = z.object({
  /** UFR-0480 — Why this Property should outperform over twenty years. Immutable once versioned — edits create a new version so that what was believed at approval rem */
  thesis_statement: z.string(),
  /** UFR-0481 — Version number. Knowledge versions forward; prior versions remain accessible. */
  thesis_version: z.number().int(),
  /** UFR-0482 — Identified drivers of return. */
  return_drivers: z.unknown(),
  /** UFR-0483 — Identified risks and their mitigations. A thesis that names no risks is not a thesis. */
  risk_mitigants: z.unknown(),
  /** UFR-0484 — The Property this thesis concerns. Written while the Property is in prospecting state, before Acquisition references the thesis. */
  property_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const InvestmentThesisUpdateSchema = z.object({
  /** UFR-0480 — Why this Property should outperform over twenty years. Immutable once versioned — edits create a new version so that what was believed at approval rem */
  thesis_statement: z.string().optional(),
  /** UFR-0481 — Version number. Knowledge versions forward; prior versions remain accessible. */
  thesis_version: z.number().int().optional(),
  /** UFR-0482 — Identified drivers of return. */
  return_drivers: z.unknown().optional(),
  /** UFR-0483 — Identified risks and their mitigations. A thesis that names no risks is not a thesis. */
  risk_mitigants: z.unknown().optional(),
}).partial().strict();

// ─── InvestmentVehicle ─────────────────────────────────────────
export const InvestmentVehicleSchema = SystemFields.extend({
  /** UFR-0020 — Name of the vehicle as it appears in subscription documents. */
  vehicle_name: z.string().min(1),
  /** UFR-0021 — Legal form. LLP is the constitutional default; anything else requires Board approval per L1-01 §24a. */
  vehicle_form: z.enum(["llp", "spv", "fund", "trust", "syndicate"]),
  /** UFR-0022 — The Organization that governs this vehicle. Always Getaway Collective. */
  governing_organization_id: z.string().uuid(),
  /** UFR-0023 — Total ownership units issued by this vehicle. The conservation target: sum of all Ownership Positions must equal this exactly. */
  total_units_issued: z.number().int(),
  /** UFR-0024 — Current Reserve Floor: the greater of six months of non-operational fixed obligations, or the Board-approved AAMP minimum. Recomputed on budget approv */
  reserve_floor_amount: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0025 — Current combined balance of the Enterprise Administration Reserve and the Property Sinking Fund for this vehicle. Per-vehicle; never pooled across veh */
  reserve_balance: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0026 — Maximum LTV approved for this vehicle in its Financing Plan. Hard limit once approved. No enterprise-wide default exists — L1-16 Part III sets limits  */
  approved_leverage_limit: z.number().min(0).optional(),
  /** UFR-0027 — Vehicle lifecycle. Reserve funding obligations become mandatory at 'stabilised' (L1-16 §2.8). */
  lifecycle_state: z.enum(["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"]),
});
export type InvestmentVehicle = z.infer<typeof InvestmentVehicleSchema>;

export const InvestmentVehicleCreateSchema = z.object({
  /** UFR-0020 — Name of the vehicle as it appears in subscription documents. */
  vehicle_name: z.string().min(1),
  /** UFR-0021 — Legal form. LLP is the constitutional default; anything else requires Board approval per L1-01 §24a. */
  vehicle_form: z.enum(["llp", "spv", "fund", "trust", "syndicate"]),
  /** UFR-0022 — The Organization that governs this vehicle. Always Getaway Collective. */
  governing_organization_id: z.string().uuid(),
  /** UFR-0023 — Total ownership units issued by this vehicle. The conservation target: sum of all Ownership Positions must equal this exactly. */
  total_units_issued: z.number().int(),
  /** UFR-0026 — Maximum LTV approved for this vehicle in its Financing Plan. Hard limit once approved. No enterprise-wide default exists — L1-16 Part III sets limits  */
  approved_leverage_limit: z.number().min(0).optional(),
  /** UFR-0027 — Vehicle lifecycle. Reserve funding obligations become mandatory at 'stabilised' (L1-16 §2.8). */
  lifecycle_state: z.enum(["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const InvestmentVehicleUpdateSchema = z.object({
  /** UFR-0020 — Name of the vehicle as it appears in subscription documents. */
  vehicle_name: z.string().min(1).optional(),
  /** UFR-0023 — Total ownership units issued by this vehicle. The conservation target: sum of all Ownership Positions must equal this exactly. */
  total_units_issued: z.number().int().optional(),
  /** UFR-0026 — Maximum LTV approved for this vehicle in its Financing Plan. Hard limit once approved. No enterprise-wide default exists — L1-16 Part III sets limits  */
  approved_leverage_limit: z.number().min(0).optional(),
  /** UFR-0027 — Vehicle lifecycle. Reserve funding obligations become mandatory at 'stabilised' (L1-16 §2.8). */
  lifecycle_state: z.enum(["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"]).optional(),
}).partial().strict();

// ─── Investor ──────────────────────────────────────────────────
export const InvestorSchema = SystemFields.extend({
  /** UFR-0160 — Legal name of the natural person or entity. */
  legal_name: z.string().min(1),
  /** UFR-0161 — The Member Law. One identity, two states. Investor pre-commitment; Member once first capital commitment settles. Irreversible — holdings falling to ze */
  member_state: z.enum(["investor", "member"]),
  /** UFR-0162 — Current accreditation status. Gates the ACCEPTANCE of new commitments only. Never gates voting, distribution, or information rights — those attach to  */
  accreditation_state: z.enum(["none", "in_review", "accredited", "expired"]),
  /** UFR-0163 — Expiry of the current accreditation. Validity is fifteen working days from approval — accreditation facilitates a specific transaction, not standing e */
  accreditation_expires_on: z.string().datetime().optional(),
  /** UFR-0164 — ISO 3166-2 code of tax residence. Drives withholding and reporting obligations. */
  tax_jurisdiction: z.string().min(1),
  /** UFR-0165 — When the first capital commitment settled and the identity became a Member. Set once, never cleared. */
  became_member_on: z.string().datetime().optional(),
});
export type Investor = z.infer<typeof InvestorSchema>;

export const InvestorCreateSchema = z.object({
  /** UFR-0160 — Legal name of the natural person or entity. */
  legal_name: z.string().min(1),
  /** UFR-0161 — The Member Law. One identity, two states. Investor pre-commitment; Member once first capital commitment settles. Irreversible — holdings falling to ze */
  member_state: z.enum(["investor", "member"]),
  /** UFR-0162 — Current accreditation status. Gates the ACCEPTANCE of new commitments only. Never gates voting, distribution, or information rights — those attach to  */
  accreditation_state: z.enum(["none", "in_review", "accredited", "expired"]),
  /** UFR-0163 — Expiry of the current accreditation. Validity is fifteen working days from approval — accreditation facilitates a specific transaction, not standing e */
  accreditation_expires_on: z.string().datetime().optional(),
  /** UFR-0164 — ISO 3166-2 code of tax residence. Drives withholding and reporting obligations. */
  tax_jurisdiction: z.string().min(1),
  /** UFR-0165 — When the first capital commitment settled and the identity became a Member. Set once, never cleared. */
  became_member_on: z.string().datetime().optional(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const InvestorUpdateSchema = z.object({
  /** UFR-0160 — Legal name of the natural person or entity. */
  legal_name: z.string().min(1).optional(),
  /** UFR-0161 — The Member Law. One identity, two states. Investor pre-commitment; Member once first capital commitment settles. Irreversible — holdings falling to ze */
  member_state: z.enum(["investor", "member"]).optional(),
  /** UFR-0162 — Current accreditation status. Gates the ACCEPTANCE of new commitments only. Never gates voting, distribution, or information rights — those attach to  */
  accreditation_state: z.enum(["none", "in_review", "accredited", "expired"]).optional(),
  /** UFR-0163 — Expiry of the current accreditation. Validity is fifteen working days from approval — accreditation facilitates a specific transaction, not standing e */
  accreditation_expires_on: z.string().datetime().optional(),
  /** UFR-0164 — ISO 3166-2 code of tax residence. Drives withholding and reporting obligations. */
  tax_jurisdiction: z.string().min(1).optional(),
}).partial().strict();

// ─── MarketIntelligence ────────────────────────────────────────
export const MarketIntelligenceSchema = SystemFields.extend({
  /** UFR-0500 — Geographic scope of the intelligence. */
  market_region: z.string().min(1),
  /** UFR-0501 — As-of date of the observation. */
  observed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type MarketIntelligence = z.infer<typeof MarketIntelligenceSchema>;

export const MarketIntelligenceCreateSchema = z.object({
  /** UFR-0500 — Geographic scope of the intelligence. */
  market_region: z.string().min(1),
  /** UFR-0501 — As-of date of the observation. */
  observed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const MarketIntelligenceUpdateSchema = z.object({
  /** UFR-0500 — Geographic scope of the intelligence. */
  market_region: z.string().min(1).optional(),
}).partial().strict();

// ─── Organization ──────────────────────────────────────────────
export const OrganizationSchema = SystemFields.extend({
  /** UFR-0001 — Registered legal name exactly as it appears on incorporation documents. Not a trading name. */
  legal_name: z.string().min(1),
  /** UFR-0002 — Legal form of the entity. */
  entity_type: z.enum(["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"]),
  /** UFR-0003 — ISO 3166-2 code of the jurisdiction of incorporation. Governs which regulatory rules apply. */
  jurisdiction: z.string().min(1),
  /** UFR-0004 — Government registration identifier (CIN, LLPIN, or jurisdictional equivalent). */
  registration_number: z.string().min(1),
  /** UFR-0005 — Date of incorporation. */
  incorporated_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0006 — Constitutional role per L1-01 §2. Determines which decision rights the entity may exercise. */
  role_in_enterprise: z.enum(["asset_platform", "operating_partner", "brand_partner", "investment_vehicle", "external_counterparty"]),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const OrganizationCreateSchema = z.object({
  /** UFR-0001 — Registered legal name exactly as it appears on incorporation documents. Not a trading name. */
  legal_name: z.string().min(1),
  /** UFR-0002 — Legal form of the entity. */
  entity_type: z.enum(["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"]),
  /** UFR-0003 — ISO 3166-2 code of the jurisdiction of incorporation. Governs which regulatory rules apply. */
  jurisdiction: z.string().min(1),
  /** UFR-0004 — Government registration identifier (CIN, LLPIN, or jurisdictional equivalent). */
  registration_number: z.string().min(1),
  /** UFR-0005 — Date of incorporation. */
  incorporated_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0006 — Constitutional role per L1-01 §2. Determines which decision rights the entity may exercise. */
  role_in_enterprise: z.enum(["asset_platform", "operating_partner", "brand_partner", "investment_vehicle", "external_counterparty"]),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const OrganizationUpdateSchema = z.object({
  /** UFR-0001 — Registered legal name exactly as it appears on incorporation documents. Not a trading name. */
  legal_name: z.string().min(1).optional(),
  /** UFR-0002 — Legal form of the entity. */
  entity_type: z.enum(["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"]).optional(),
  /** UFR-0003 — ISO 3166-2 code of the jurisdiction of incorporation. Governs which regulatory rules apply. */
  jurisdiction: z.string().min(1).optional(),
  /** UFR-0006 — Constitutional role per L1-01 §2. Determines which decision rights the entity may exercise. */
  role_in_enterprise: z.enum(["asset_platform", "operating_partner", "brand_partner", "investment_vehicle", "external_counterparty"]).optional(),
}).partial().strict();

// ─── OwnershipPosition ─────────────────────────────────────────
export const OwnershipPositionSchema = SystemFields.extend({
  /** UFR-0240 — The identity holding this position. Together with vehicle_id this pair is unique: one position per holder per vehicle. */
  investor_id: z.string().uuid(),
  /** UFR-0241 — The vehicle held in. */
  vehicle_id: z.string().uuid(),
  /** UFR-0242 — Ownership units held. The sum of this field across all positions in a vehicle must equal total_units_issued exactly. */
  units_held: z.number(),
  /** UFR-0243 — Share of the vehicle's voting rights, derived as units_held over total_units_issued. Voting is equity-weighted, never per-capita. Capped at 10 percent */
  voting_rights_percent: z.number().min(0),
  /** UFR-0244 — Ownership class. Partners within the same class hold identical rights per unit — an entrenched principle (L1-01 §32b). */
  ownership_class: z.string().min(1),
});
export type OwnershipPosition = z.infer<typeof OwnershipPositionSchema>;

export const OwnershipPositionCreateSchema = z.object({
  /** UFR-0240 — The identity holding this position. Together with vehicle_id this pair is unique: one position per holder per vehicle. */
  investor_id: z.string().uuid(),
  /** UFR-0241 — The vehicle held in. */
  vehicle_id: z.string().uuid(),
  /** UFR-0242 — Ownership units held. The sum of this field across all positions in a vehicle must equal total_units_issued exactly. */
  units_held: z.number(),
  /** UFR-0244 — Ownership class. Partners within the same class hold identical rights per unit — an entrenched principle (L1-01 §32b). */
  ownership_class: z.string().min(1),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const OwnershipPositionUpdateSchema = z.object({
  /** UFR-0242 — Ownership units held. The sum of this field across all positions in a vehicle must equal total_units_issued exactly. */
  units_held: z.number().optional(),
  /** UFR-0244 — Ownership class. Partners within the same class hold identical rights per unit — an entrenched principle (L1-01 §32b). */
  ownership_class: z.string().min(1).optional(),
}).partial().strict();

// ─── PerformanceReport ─────────────────────────────────────────
export const PerformanceReportSchema = SystemFields.extend({
  /** UFR-0380 — The vehicle reported on. */
  vehicle_id: z.string().uuid(),
  /** UFR-0381 — Reporting period end date. */
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0382 — Internal rate of return. One formula, defined once, applied identically across every vehicle. Not configurable per property or per manager. */
  irr: z.number().min(0),
  /** UFR-0383 — Multiple on invested capital. Same determinism requirement as IRR. */
  moic: z.number(),
  /** UFR-0384 — Net asset value, aggregated from Valuations as of specific dates. Never used to derive the Reserve Floor — NAV is a valuation metric and liquidity ris */
  nav: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0385 — Reserve balance as a percentage of Reserve Floor. Bands: 120 and above healthy, 110 to 119 advisory, 100 to 109 governance alert, below 100 constituti */
  reserve_coverage_ratio: z.number().min(0),
});
export type PerformanceReport = z.infer<typeof PerformanceReportSchema>;

export const PerformanceReportCreateSchema = z.object({
  /** UFR-0380 — The vehicle reported on. */
  vehicle_id: z.string().uuid(),
  /** UFR-0381 — Reporting period end date. */
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** Every field is immutable or computed: this object is append-only. */
export const PerformanceReportUpdateSchema = z.object({}).strict();

// ─── Policy ────────────────────────────────────────────────────
export const PolicySchema = SystemFields.extend({
  /** UFR-0320 — Policy identifier, e.g. EP-01. Permanent. */
  policy_id: z.string().min(1),
  /** UFR-0321 — Version number. Policies version forward; superseded versions remain permanently retrievable. */
  policy_version: z.number().int(),
  /** UFR-0322 — The Board resolution approving this version. Only the Board may approve policy amendments. */
  approved_by_resolution_id: z.string().uuid(),
});
export type Policy = z.infer<typeof PolicySchema>;

export const PolicyCreateSchema = z.object({
  /** UFR-0320 — Policy identifier, e.g. EP-01. Permanent. */
  policy_id: z.string().min(1),
  /** UFR-0321 — Version number. Policies version forward; superseded versions remain permanently retrievable. */
  policy_version: z.number().int(),
  /** UFR-0322 — The Board resolution approving this version. Only the Board may approve policy amendments. */
  approved_by_resolution_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const PolicyUpdateSchema = z.object({
  /** UFR-0321 — Version number. Policies version forward; superseded versions remain permanently retrievable. */
  policy_version: z.number().int().optional(),
}).partial().strict();

// ─── Portfolio ─────────────────────────────────────────────────
export const PortfolioSchema = SystemFields.extend({
  /** UFR-0040 — Name of the curated collection, e.g. Coastal Portfolio. */
  portfolio_name: z.string().min(1),
  /** UFR-0041 — The strategy binding these Properties together. Must be specific enough to exclude a Property that does not fit. */
  investment_strategy: z.string(),
  /** UFR-0042 — Maximum share of the portfolio a single holder may hold. Constitutional ceiling is 10 percent (L1-01 §27). */
  concentration_ceiling: z.number().min(0),
  /** UFR-0043 — The Organization that curates this Portfolio. Always Getaway Collective. Anchors the Portfolio to the enterprise root — without it a Portfolio floats  */
  organization_id: z.string().uuid(),
});
export type Portfolio = z.infer<typeof PortfolioSchema>;

export const PortfolioCreateSchema = z.object({
  /** UFR-0040 — Name of the curated collection, e.g. Coastal Portfolio. */
  portfolio_name: z.string().min(1),
  /** UFR-0041 — The strategy binding these Properties together. Must be specific enough to exclude a Property that does not fit. */
  investment_strategy: z.string(),
  /** UFR-0042 — Maximum share of the portfolio a single holder may hold. Constitutional ceiling is 10 percent (L1-01 §27). */
  concentration_ceiling: z.number().min(0),
  /** UFR-0043 — The Organization that curates this Portfolio. Always Getaway Collective. Anchors the Portfolio to the enterprise root — without it a Portfolio floats  */
  organization_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const PortfolioUpdateSchema = z.object({
  /** UFR-0040 — Name of the curated collection, e.g. Coastal Portfolio. */
  portfolio_name: z.string().min(1).optional(),
  /** UFR-0041 — The strategy binding these Properties together. Must be specific enough to exclude a Property that does not fit. */
  investment_strategy: z.string().optional(),
  /** UFR-0042 — Maximum share of the portfolio a single holder may hold. Constitutional ceiling is 10 percent (L1-01 §27). */
  concentration_ceiling: z.number().min(0).optional(),
}).partial().strict();

// ─── Property ──────────────────────────────────────────────────
export const PropertySchema = SystemFields.extend({
  /** UFR-0060 — Canonical name of the Property. The single spelling used across every surface. */
  property_name: z.string().min(1),
  /** UFR-0061 — The Investment Vehicle holding this Property. Exactly one, never null. Economic ownership exists only through a legal wrapper. */
  vehicle_id: z.string().uuid(),
  /** UFR-0062 — Portfolio this Property belongs to, if assigned. */
  portfolio_id: z.string().uuid().optional(),
  /** UFR-0063 — ISO 3166-2 code where the Property sits. Must satisfy the L1-01 §27 jurisdiction tests. */
  jurisdiction: z.string().min(1),
  /** UFR-0064 — Land title or registry reference. The link between the record and the legal asset. */
  title_reference: z.string().min(1),
  /** UFR-0065 — Total land area in square metres. One unit across the enterprise — never square feet, never acres. */
  land_area_sqm: z.number(),
  /** UFR-0066 — Asset lifecycle. Transitions are constrained by the state machine; illegal jumps are rejected. */
  lifecycle_state: z.enum(["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"]),
  /** UFR-0067 — Date of Operational Stabilisation. Sets the point at which the 2.5% + 2.5% reserve funding becomes mandatory and capital calls stop being available fo */
  stabilised_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** UFR-0068 — Environmental commitments made at acquisition (carbon, biodiversity, renewable targets). May be strengthened, never weakened. */
  environmental_commitments: z.unknown().optional(),
});
export type Property = z.infer<typeof PropertySchema>;

export const PropertyCreateSchema = z.object({
  /** UFR-0060 — Canonical name of the Property. The single spelling used across every surface. */
  property_name: z.string().min(1),
  /** UFR-0061 — The Investment Vehicle holding this Property. Exactly one, never null. Economic ownership exists only through a legal wrapper. */
  vehicle_id: z.string().uuid(),
  /** UFR-0062 — Portfolio this Property belongs to, if assigned. */
  portfolio_id: z.string().uuid().optional(),
  /** UFR-0063 — ISO 3166-2 code where the Property sits. Must satisfy the L1-01 §27 jurisdiction tests. */
  jurisdiction: z.string().min(1),
  /** UFR-0064 — Land title or registry reference. The link between the record and the legal asset. */
  title_reference: z.string().min(1),
  /** UFR-0065 — Total land area in square metres. One unit across the enterprise — never square feet, never acres. */
  land_area_sqm: z.number(),
  /** UFR-0066 — Asset lifecycle. Transitions are constrained by the state machine; illegal jumps are rejected. */
  lifecycle_state: z.enum(["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"]),
  /** UFR-0067 — Date of Operational Stabilisation. Sets the point at which the 2.5% + 2.5% reserve funding becomes mandatory and capital calls stop being available fo */
  stabilised_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** UFR-0068 — Environmental commitments made at acquisition (carbon, biodiversity, renewable targets). May be strengthened, never weakened. */
  environmental_commitments: z.unknown().optional(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const PropertyUpdateSchema = z.object({
  /** UFR-0060 — Canonical name of the Property. The single spelling used across every surface. */
  property_name: z.string().min(1).optional(),
  /** UFR-0062 — Portfolio this Property belongs to, if assigned. */
  portfolio_id: z.string().uuid().optional(),
  /** UFR-0065 — Total land area in square metres. One unit across the enterprise — never square feet, never acres. */
  land_area_sqm: z.number().optional(),
  /** UFR-0066 — Asset lifecycle. Transitions are constrained by the state machine; illegal jumps are rejected. */
  lifecycle_state: z.enum(["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"]).optional(),
  /** UFR-0067 — Date of Operational Stabilisation. Sets the point at which the 2.5% + 2.5% reserve funding becomes mandatory and capital calls stop being available fo */
  stabilised_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).partial().strict();

// ─── Research ──────────────────────────────────────────────────
export const ResearchSchema = SystemFields.extend({
  /** UFR-0520 — Research subject area. Determines which committee receives the output and how long it is retained. */
  research_topic: z.enum(["esg", "geographic", "asset_class", "economic", "regulatory"]),
  /** UFR-0521 — Version. Research is knowledge and versions forward rather than mutating. */
  research_version: z.number().int(),
});
export type Research = z.infer<typeof ResearchSchema>;

export const ResearchCreateSchema = z.object({
  /** UFR-0520 — Research subject area. Determines which committee receives the output and how long it is retained. */
  research_topic: z.enum(["esg", "geographic", "asset_class", "economic", "regulatory"]),
  /** UFR-0521 — Version. Research is knowledge and versions forward rather than mutating. */
  research_version: z.number().int(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const ResearchUpdateSchema = z.object({
  /** UFR-0520 — Research subject area. Determines which committee receives the output and how long it is retained. */
  research_topic: z.enum(["esg", "geographic", "asset_class", "economic", "regulatory"]).optional(),
  /** UFR-0521 — Version. Research is knowledge and versions forward rather than mutating. */
  research_version: z.number().int().optional(),
}).partial().strict();

// ─── Resolution ────────────────────────────────────────────────
export const ResolutionSchema = SystemFields.extend({
  /** UFR-0300 — The matter voted on. Determines the required threshold via the ordinary / special / unanimous classification. */
  matter: z.string().min(1),
  /** UFR-0301 — Threshold class. Ordinary is over 50 percent of equity present; special is at least 76 percent of total equity; unanimous is 100 percent of total equi */
  resolution_type: z.enum(["ordinary", "special", "unanimous"]),
  /** UFR-0302 — Equity voting in favour. An equity measure, never a headcount. */
  equity_for: z.number().min(0),
  /** UFR-0303 — Equity voting against. A tie is deemed NOT APPROVED — the burden of approval rests with the proposer. */
  equity_against: z.number().min(0),
  /** UFR-0304 — Equity present in person or by valid proxy. Quorum requires at least 60 percent of total equity. */
  equity_present: z.number().min(0),
  /** UFR-0305 — Derived automatically from the tally. No manual interpretation step exists between a vote and its resolution state. */
  outcome: z.enum(["approved", "rejected", "tied_not_approved", "inquorate", "entrenched_not_unanimous", "entrenched_rights_not_confirmed"]),
  /** UFR-0306 — Recorded reasoning. Every decision has provenance: who, when, why, what options were considered. */
  rationale: z.string(),
  /** UFR-0307 — The governance body that passed this Resolution. Required — a resolution with no issuing body cannot be checked against that body's decision authority */
  committee_id: z.string().uuid(),
  /** UFR-0308 — The vehicle this Resolution concerns, where it is vehicle-specific. Null for enterprise-level resolutions such as policy approval. */
  vehicle_id: z.string().uuid().optional(),
});
export type Resolution = z.infer<typeof ResolutionSchema>;

export const ResolutionCreateSchema = z.object({
  /** UFR-0300 — The matter voted on. Determines the required threshold via the ordinary / special / unanimous classification. */
  matter: z.string().min(1),
  /** UFR-0301 — Threshold class. Ordinary is over 50 percent of equity present; special is at least 76 percent of total equity; unanimous is 100 percent of total equi */
  resolution_type: z.enum(["ordinary", "special", "unanimous"]),
  /** UFR-0302 — Equity voting in favour. An equity measure, never a headcount. */
  equity_for: z.number().min(0),
  /** UFR-0303 — Equity voting against. A tie is deemed NOT APPROVED — the burden of approval rests with the proposer. */
  equity_against: z.number().min(0),
  /** UFR-0304 — Equity present in person or by valid proxy. Quorum requires at least 60 percent of total equity. */
  equity_present: z.number().min(0),
  /** UFR-0306 — Recorded reasoning. Every decision has provenance: who, when, why, what options were considered. */
  rationale: z.string(),
  /** UFR-0307 — The governance body that passed this Resolution. Required — a resolution with no issuing body cannot be checked against that body's decision authority */
  committee_id: z.string().uuid(),
  /** UFR-0308 — The vehicle this Resolution concerns, where it is vehicle-specific. Null for enterprise-level resolutions such as policy approval. */
  vehicle_id: z.string().uuid().optional(),
});

/** Every field is immutable or computed: this object is append-only. */
export const ResolutionUpdateSchema = z.object({}).strict();

// ─── Risk ──────────────────────────────────────────────────────
export const RiskSchema = SystemFields.extend({
  /** UFR-0440 — Risk register classification per EP-11. */
  risk_category: z.enum(["liquidity", "interest_rate", "operator", "market", "climate", "currency", "legal", "regulatory", "technology", "counterparty"]),
  /** UFR-0441 — Assessed likelihood. */
  likelihood: z.enum(["rare", "unlikely", "possible", "likely", "almost_certain"]),
  /** UFR-0442 — Assessed impact if the risk materialises. Combined with likelihood to place the risk on the register and set the escalation path. */
  impact: z.enum(["negligible", "minor", "moderate", "major", "severe"]),
  /** UFR-0443 — The vehicle exposed to this risk. The risk register is maintained per vehicle; an unattached risk entry cannot be escalated to anyone. */
  vehicle_id: z.string().uuid(),
});
export type Risk = z.infer<typeof RiskSchema>;

export const RiskCreateSchema = z.object({
  /** UFR-0440 — Risk register classification per EP-11. */
  risk_category: z.enum(["liquidity", "interest_rate", "operator", "market", "climate", "currency", "legal", "regulatory", "technology", "counterparty"]),
  /** UFR-0441 — Assessed likelihood. */
  likelihood: z.enum(["rare", "unlikely", "possible", "likely", "almost_certain"]),
  /** UFR-0442 — Assessed impact if the risk materialises. Combined with likelihood to place the risk on the register and set the escalation path. */
  impact: z.enum(["negligible", "minor", "moderate", "major", "severe"]),
  /** UFR-0443 — The vehicle exposed to this risk. The risk register is maintained per vehicle; an unattached risk entry cannot be escalated to anyone. */
  vehicle_id: z.string().uuid(),
});

/**
 * Immutable and computed fields are absent by construction — that is the
 * enforcement. .strict() makes their presence an ERROR rather than a silent
 * strip: without it, an update carrying an immutable field returns success
 * with that field quietly dropped, and the caller believes it was applied.
 */
export const RiskUpdateSchema = z.object({
  /** UFR-0440 — Risk register classification per EP-11. */
  risk_category: z.enum(["liquidity", "interest_rate", "operator", "market", "climate", "currency", "legal", "regulatory", "technology", "counterparty"]).optional(),
  /** UFR-0441 — Assessed likelihood. */
  likelihood: z.enum(["rare", "unlikely", "possible", "likely", "almost_certain"]).optional(),
  /** UFR-0442 — Assessed impact if the risk materialises. Combined with likelihood to place the risk on the register and set the escalation path. */
  impact: z.enum(["negligible", "minor", "moderate", "major", "severe"]).optional(),
}).partial().strict();

// ─── Valuation ─────────────────────────────────────────────────
export const ValuationSchema = SystemFields.extend({
  /** UFR-0100 — The Property valued. */
  property_id: z.string().uuid(),
  /** UFR-0101 — The as-of date of this valuation. There is no such thing as a current valuation — only valuations as of a date. */
  valued_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0102 — Assessed fair value as of valued_on. */
  value: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0103 — Whether an independent third party or GC management produced this figure. Regulatory filings may use 'independent' only. */
  source: z.enum(["independent", "management"]),
  /** UFR-0104 — Name of the independent valuation firm. Required when source is 'independent'. */
  valuer_name: z.string().min(1).optional(),
});
export type Valuation = z.infer<typeof ValuationSchema>;

export const ValuationCreateSchema = z.object({
  /** UFR-0100 — The Property valued. */
  property_id: z.string().uuid(),
  /** UFR-0101 — The as-of date of this valuation. There is no such thing as a current valuation — only valuations as of a date. */
  valued_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** UFR-0102 — Assessed fair value as of valued_on. */
  value: z.string().regex(/^-?\d+(\.\d{1,4})?$/, "money must be a decimal string, never a float"),
  /** UFR-0103 — Whether an independent third party or GC management produced this figure. Regulatory filings may use 'independent' only. */
  source: z.enum(["independent", "management"]),
  /** UFR-0104 — Name of the independent valuation firm. Required when source is 'independent'. */
  valuer_name: z.string().min(1).optional(),
});

/** Every field is immutable or computed: this object is append-only. */
export const ValuationUpdateSchema = z.object({}).strict();

export const SCHEMAS = {
  Acquisition: AcquisitionSchema,
  Agreement: AgreementSchema,
  Benchmark: BenchmarkSchema,
  CapitalCall: CapitalCallSchema,
  Commitment: CommitmentSchema,
  Committee: CommitteeSchema,
  ComplianceEvent: ComplianceEventSchema,
  Disposition: DispositionSchema,
  Distribution: DistributionSchema,
  DueDiligence: DueDiligenceSchema,
  Forecast: ForecastSchema,
  Investment: InvestmentSchema,
  InvestmentOffering: InvestmentOfferingSchema,
  InvestmentThesis: InvestmentThesisSchema,
  InvestmentVehicle: InvestmentVehicleSchema,
  Investor: InvestorSchema,
  MarketIntelligence: MarketIntelligenceSchema,
  Organization: OrganizationSchema,
  OwnershipPosition: OwnershipPositionSchema,
  PerformanceReport: PerformanceReportSchema,
  Policy: PolicySchema,
  Portfolio: PortfolioSchema,
  Property: PropertySchema,
  Research: ResearchSchema,
  Resolution: ResolutionSchema,
  Risk: RiskSchema,
  Valuation: ValuationSchema,
} as const;
