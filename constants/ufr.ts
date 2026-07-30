/**
 * UNIFIED FIELD REGISTRY (UFR) — L2.5
 *
 * Wave 2 · Semantic Core
 * Authority: L1-01 §33 (the 27 L2 Business Objects) · invariant E-06
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * E-06: "No field exists without a Registry ID."
 *
 * Without a registry, fields proliferate with overlapping meanings.
 * `asset_id`, `property_id`, and `getaway_id` become three names for one
 * concept, and nobody can say which is authoritative. The registry is the
 * point at which a field is NAMED — before it is implemented anywhere.
 *
 * ── THE RULE ─────────────────────────────────────────────────────────
 * Declaration order is: L2 business object → UFR entry → schema.
 * Implementation never precedes declaration.
 *
 * A field that appears in a database schema, API response, or type
 * definition without a UFR entry is a build failure (scripts/ufr-lint.js).
 *
 * ── IDENTIFIERS ──────────────────────────────────────────────────────
 * UFR ids are sequential and PERMANENT. A retired field keeps its id
 * forever; ids are never reused. Reuse would silently repoint historical
 * audit records at a different meaning.
 */

import { BusinessObjectType } from "./business-objects";

export type FieldType =
  | "uuid"
  | "string"
  | "text"
  | "integer"
  | "decimal"
  | "money"
  | "percent"
  | "boolean"
  | "date"
  | "timestamp"
  | "enum"
  | "json"
  | "reference";

/** Who may read a field. Drives API shaping and export redaction. */
export type Sensitivity =
  | "public" // may appear on unauthenticated surfaces
  | "member" // visible to any authenticated Member
  | "holder" // visible only to holders of the relevant position
  | "internal" // GC staff only
  | "restricted"; // named roles only; PII or regulated data

export interface FieldDefinition {
  /** Permanent. Never reused, even after retirement. */
  ufr: string;
  /** snake_case canonical name. The ONE spelling of this concept. */
  name: string;
  object: BusinessObjectType;
  type: FieldType;
  required: boolean;
  /** Prose definition. If two people could read this differently, rewrite it. */
  description: string;
  sensitivity: Sensitivity;
  /** Invariants this field participates in enforcing. */
  invariants?: string[];
  /** For type: "reference" — the object pointed at. */
  references?: BusinessObjectType;
  /** For type: "enum" — the closed value set. */
  values?: readonly string[];
  /** True when the value is derived, never written directly. */
  computed?: boolean;
  /** True when the value cannot change after creation. */
  immutable?: boolean;
  /** Set when superseded. The field keeps its id and stops being valid. */
  retired?: { on: string; reason: string; supersededBy?: string };
}

// ─────────────────────────────────────────────────────────────────────
// SYSTEM FIELDS — present on every object
//
// Declared ONCE. Every object inherits them by identity, not by copy.
// This is the registry's primary defence against divergence: there is
// exactly one `id`, one `created_at`, one `version` in the enterprise.
// ─────────────────────────────────────────────────────────────────────
export const SYSTEM_FIELD_SHAPE = [
  { suffix: "id", type: "uuid" as FieldType, immutable: true, description: "Primary identifier. Immutable for the life of the record." },
  { suffix: "created_at", type: "timestamp" as FieldType, immutable: true, description: "Creation timestamp, UTC. Immutable." },
  { suffix: "created_by", type: "reference" as FieldType, immutable: true, description: "Identity that created the record. Immutable. Serves E-02." },
  { suffix: "updated_at", type: "timestamp" as FieldType, immutable: false, description: "Last modification timestamp, UTC." },
  { suffix: "version", type: "integer" as FieldType, immutable: false, description: "Optimistic-concurrency version. Increments on every write." },
] as const;

// ─────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────
const F = (d: FieldDefinition) => d;

export const UFR: FieldDefinition[] = [
  // ═══ ENTERPRISE DOMAIN ═════════════════════════════════════════════

  // ── Organization ──────────────────────────────────────────────────
  F({ ufr: "UFR-0001", name: "legal_name", object: BusinessObjectType.Organization, type: "string", required: true,
      description: "Registered legal name exactly as it appears on incorporation documents. Not a trading name.", sensitivity: "public" }),
  F({ ufr: "UFR-0002", name: "entity_type", object: BusinessObjectType.Organization, type: "enum", required: true,
      values: ["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"],
      description: "Legal form of the entity.", sensitivity: "public" }),
  F({ ufr: "UFR-0003", name: "jurisdiction", object: BusinessObjectType.Organization, type: "string", required: true,
      description: "ISO 3166-2 code of the jurisdiction of incorporation. Governs which regulatory rules apply.", sensitivity: "public" }),
  F({ ufr: "UFR-0004", name: "registration_number", object: BusinessObjectType.Organization, type: "string", required: true,
      description: "Government registration identifier (CIN, LLPIN, or jurisdictional equivalent).", sensitivity: "internal", immutable: true }),
  F({ ufr: "UFR-0005", name: "incorporated_on", object: BusinessObjectType.Organization, type: "date", required: true,
      description: "Date of incorporation.", sensitivity: "public", immutable: true }),
  F({ ufr: "UFR-0006", name: "role_in_enterprise", object: BusinessObjectType.Organization, type: "enum", required: true,
      values: ["asset_platform", "operating_partner", "brand_partner", "investment_vehicle", "external_counterparty"],
      description: "Constitutional role per L1-01 §2. Determines which decision rights the entity may exercise.", sensitivity: "public",
      invariants: ["E-07"] }),

  // ── Investment Vehicle ────────────────────────────────────────────
  F({ ufr: "UFR-0020", name: "vehicle_name", object: BusinessObjectType.InvestmentVehicle, type: "string", required: true,
      description: "Name of the vehicle as it appears in subscription documents.", sensitivity: "member" }),
  F({ ufr: "UFR-0021", name: "vehicle_form", object: BusinessObjectType.InvestmentVehicle, type: "enum", required: true,
      values: ["llp", "spv", "fund", "trust", "syndicate"],
      description: "Legal form. LLP is the constitutional default; anything else requires Board approval per L1-01 §24a.", sensitivity: "member", immutable: true }),
  F({ ufr: "UFR-0022", name: "governing_organization_id", object: BusinessObjectType.InvestmentVehicle, type: "reference", required: true,
      references: BusinessObjectType.Organization,
      description: "The Organization that governs this vehicle. Always Getaway Collective.", sensitivity: "member", immutable: true }),
  F({ ufr: "UFR-0023", name: "total_units_issued", object: BusinessObjectType.InvestmentVehicle, type: "integer", required: true,
      description: "Total ownership units issued by this vehicle. The conservation target: sum of all Ownership Positions must equal this exactly.", sensitivity: "member",
      invariants: ["F-02"] }),
  F({ ufr: "UFR-0024", name: "reserve_floor_amount", object: BusinessObjectType.InvestmentVehicle, type: "money", required: true, computed: true,
      description: "Current Reserve Floor: the greater of six months of non-operational fixed obligations, or the Board-approved AAMP minimum. Recomputed on budget approval. NOT NAV-linked.", sensitivity: "member",
      invariants: ["F-06"] }),
  F({ ufr: "UFR-0025", name: "reserve_balance", object: BusinessObjectType.InvestmentVehicle, type: "money", required: true, computed: true,
      description: "Current combined balance of the Enterprise Administration Reserve and the Property Sinking Fund for this vehicle. Per-vehicle; never pooled across vehicles.", sensitivity: "member",
      invariants: ["F-06", "F-17"] }),
  F({ ufr: "UFR-0026", name: "approved_leverage_limit", object: BusinessObjectType.InvestmentVehicle, type: "percent", required: false,
      description: "Maximum LTV approved for this vehicle in its Financing Plan. Hard limit once approved. No enterprise-wide default exists — L1-16 Part III sets limits per vehicle.", sensitivity: "member" }),
  F({ ufr: "UFR-0027", name: "lifecycle_state", object: BusinessObjectType.InvestmentVehicle, type: "enum", required: true,
      values: ["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"],
      description: "Vehicle lifecycle. Reserve funding obligations become mandatory at 'stabilised' (L1-16 §2.8).", sensitivity: "member" }),

  // ── Portfolio ─────────────────────────────────────────────────────
  F({ ufr: "UFR-0040", name: "portfolio_name", object: BusinessObjectType.Portfolio, type: "string", required: true,
      description: "Name of the curated collection, e.g. Coastal Portfolio.", sensitivity: "public" }),
  F({ ufr: "UFR-0041", name: "investment_strategy", object: BusinessObjectType.Portfolio, type: "text", required: true,
      description: "The strategy binding these Properties together. Must be specific enough to exclude a Property that does not fit.", sensitivity: "member" }),
  F({ ufr: "UFR-0042", name: "concentration_ceiling", object: BusinessObjectType.Portfolio, type: "percent", required: true,
      description: "Maximum share of the portfolio a single holder may hold. Constitutional ceiling is 10 percent (L1-01 §27).", sensitivity: "member" }),
  F({ ufr: "UFR-0043", name: "organization_id", object: BusinessObjectType.Portfolio, type: "reference", required: true,
      references: BusinessObjectType.Organization, immutable: true,
      description: "The Organization that curates this Portfolio. Always Getaway Collective. Anchors the Portfolio to the enterprise root — without it a Portfolio floats unowned.", sensitivity: "member",
      invariants: ["E-05"] }),

  // ═══ ASSETS DOMAIN ═════════════════════════════════════════════════

  // ── Property ──────────────────────────────────────────────────────
  F({ ufr: "UFR-0060", name: "property_name", object: BusinessObjectType.Property, type: "string", required: true,
      description: "Canonical name of the Property. The single spelling used across every surface.", sensitivity: "public" }),
  F({ ufr: "UFR-0061", name: "vehicle_id", object: BusinessObjectType.Property, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The Investment Vehicle holding this Property. Exactly one, never null. Economic ownership exists only through a legal wrapper.", sensitivity: "member",
      invariants: ["F-01", "A-02"] }),
  F({ ufr: "UFR-0062", name: "portfolio_id", object: BusinessObjectType.Property, type: "reference", required: false,
      references: BusinessObjectType.Portfolio,
      description: "Portfolio this Property belongs to, if assigned.", sensitivity: "member" }),
  F({ ufr: "UFR-0063", name: "jurisdiction", object: BusinessObjectType.Property, type: "string", required: true,
      description: "ISO 3166-2 code where the Property sits. Must satisfy the L1-01 §27 jurisdiction tests.", sensitivity: "public", immutable: true }),
  F({ ufr: "UFR-0064", name: "title_reference", object: BusinessObjectType.Property, type: "string", required: true,
      description: "Land title or registry reference. The link between the record and the legal asset.", sensitivity: "internal", immutable: true }),
  F({ ufr: "UFR-0065", name: "land_area_sqm", object: BusinessObjectType.Property, type: "decimal", required: true,
      description: "Total land area in square metres. One unit across the enterprise — never square feet, never acres.", sensitivity: "member" }),
  F({ ufr: "UFR-0066", name: "lifecycle_state", object: BusinessObjectType.Property, type: "enum", required: true,
      values: ["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"],
      description: "Asset lifecycle. Transitions are constrained by the state machine; illegal jumps are rejected.", sensitivity: "member",
      invariants: ["A-05"] }),
  F({ ufr: "UFR-0067", name: "stabilised_on", object: BusinessObjectType.Property, type: "date", required: false,
      description: "Date of Operational Stabilisation. Sets the point at which the 2.5% + 2.5% reserve funding becomes mandatory and capital calls stop being available for operating deficits.", sensitivity: "member",
      invariants: ["F-16"] }),
  F({ ufr: "UFR-0068", name: "environmental_commitments", object: BusinessObjectType.Property, type: "json", required: false, immutable: true,
      description: "Environmental commitments made at acquisition (carbon, biodiversity, renewable targets). May be strengthened, never weakened.", sensitivity: "public",
      invariants: ["A-07"] }),

  // ── Acquisition ───────────────────────────────────────────────────
  F({ ufr: "UFR-0080", name: "property_id", object: BusinessObjectType.Acquisition, type: "reference", required: true,
      references: BusinessObjectType.Property, immutable: true,
      description: "The Property acquired.", sensitivity: "member" }),
  F({ ufr: "UFR-0081", name: "acquisition_price", object: BusinessObjectType.Acquisition, type: "money", required: true, immutable: true,
      description: "Consideration paid, excluding transaction costs. Immutable — changes are recorded as amendment records, never edits.", sensitivity: "member",
      invariants: ["A-04"] }),
  F({ ufr: "UFR-0082", name: "completed_on", object: BusinessObjectType.Acquisition, type: "date", required: true, immutable: true,
      description: "Date legal title transferred.", sensitivity: "member", invariants: ["A-04"] }),
  F({ ufr: "UFR-0083", name: "investment_thesis_id", object: BusinessObjectType.Acquisition, type: "reference", required: true,
      references: BusinessObjectType.InvestmentThesis, immutable: true,
      description: "The thesis under which this acquisition was approved. Required — no Property enters the portfolio without one.", sensitivity: "member" }),

  // ── Valuation ─────────────────────────────────────────────────────
  F({ ufr: "UFR-0100", name: "property_id", object: BusinessObjectType.Valuation, type: "reference", required: true,
      references: BusinessObjectType.Property, immutable: true,
      description: "The Property valued.", sensitivity: "member" }),
  F({ ufr: "UFR-0101", name: "valued_on", object: BusinessObjectType.Valuation, type: "date", required: true, immutable: true,
      description: "The as-of date of this valuation. There is no such thing as a current valuation — only valuations as of a date.", sensitivity: "member",
      invariants: ["A-03"] }),
  F({ ufr: "UFR-0102", name: "value", object: BusinessObjectType.Valuation, type: "money", required: true, immutable: true,
      description: "Assessed fair value as of valued_on.", sensitivity: "member", invariants: ["A-03"] }),
  F({ ufr: "UFR-0103", name: "source", object: BusinessObjectType.Valuation, type: "enum", required: true, immutable: true,
      values: ["independent", "management"],
      description: "Whether an independent third party or GC management produced this figure. Regulatory filings may use 'independent' only.", sensitivity: "member",
      invariants: ["F-13"] }),
  F({ ufr: "UFR-0104", name: "valuer_name", object: BusinessObjectType.Valuation, type: "string", required: false, immutable: true,
      description: "Name of the independent valuation firm. Required when source is 'independent'.", sensitivity: "member",
      invariants: ["F-13"] }),

  // ── Disposition ───────────────────────────────────────────────────
  F({ ufr: "UFR-0120", name: "property_id", object: BusinessObjectType.Disposition, type: "reference", required: true,
      references: BusinessObjectType.Property, immutable: true,
      description: "The Property exited.", sensitivity: "member" }),
  F({ ufr: "UFR-0121", name: "disposal_price", object: BusinessObjectType.Disposition, type: "money", required: true, immutable: true,
      description: "Gross consideration received.", sensitivity: "member" }),
  F({ ufr: "UFR-0122", name: "completed_on", object: BusinessObjectType.Disposition, type: "date", required: true, immutable: true,
      description: "Date legal title transferred out.", sensitivity: "member" }),

  // ═══ CAPITAL DOMAIN ════════════════════════════════════════════════

  // ── Investment Offering ───────────────────────────────────────────
  F({ ufr: "UFR-0140", name: "offering_name", object: BusinessObjectType.InvestmentOffering, type: "string", required: true,
      description: "Name of the offering, e.g. Series A.", sensitivity: "member" }),
  F({ ufr: "UFR-0141", name: "vehicle_id", object: BusinessObjectType.InvestmentOffering, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle raising capital.", sensitivity: "member" }),
  F({ ufr: "UFR-0142", name: "target_amount", object: BusinessObjectType.InvestmentOffering, type: "money", required: true,
      description: "Total capital sought.", sensitivity: "member" }),
  F({ ufr: "UFR-0143", name: "minimum_subscription", object: BusinessObjectType.InvestmentOffering, type: "money", required: true,
      description: "Minimum commitment accepted. Set per offering by the Investment Committee — deliberately not a constitutional constant (L1-01 §27).", sensitivity: "member" }),
  F({ ufr: "UFR-0144", name: "brand_participation_rate", object: BusinessObjectType.InvestmentOffering, type: "percent", required: false,
      description: "Brand and Digital Company participation as a share of the Revenue Base, for the vehicle under this offering. Disclosed before subscription and fixed for the term.", sensitivity: "member",
      invariants: ["F-18"] }),
  F({ ufr: "UFR-0145", name: "offering_state", object: BusinessObjectType.InvestmentOffering, type: "enum", required: true,
      values: ["draft", "open", "closed", "cancelled"],
      description: "Offering lifecycle. Commitments may be accepted only while state is open; closing is irreversible, and cancelled offerings retain their record rather than being deleted.", sensitivity: "member" }),

  // ── Investor ──────────────────────────────────────────────────────
  F({ ufr: "UFR-0160", name: "legal_name", object: BusinessObjectType.Investor, type: "string", required: true,
      description: "Legal name of the natural person or entity.", sensitivity: "restricted" }),
  F({ ufr: "UFR-0161", name: "member_state", object: BusinessObjectType.Investor, type: "enum", required: true,
      values: ["investor", "member"],
      description: "The Member Law. One identity, two states. Investor pre-commitment; Member once first capital commitment settles. Irreversible — holdings falling to zero does not revert it.", sensitivity: "internal",
      invariants: ["I-08", "A-08"] }),
  F({ ufr: "UFR-0162", name: "accreditation_state", object: BusinessObjectType.Investor, type: "enum", required: true,
      values: ["none", "in_review", "accredited", "expired"],
      description: "Current accreditation status. Gates the ACCEPTANCE of new commitments only. Never gates voting, distribution, or information rights — those attach to ownership.", sensitivity: "internal",
      invariants: ["I-03", "F-10"] }),
  F({ ufr: "UFR-0163", name: "accreditation_expires_on", object: BusinessObjectType.Investor, type: "timestamp", required: false,
      description: "Expiry of the current accreditation. Validity is fifteen working days from approval — accreditation facilitates a specific transaction, not standing eligibility.", sensitivity: "internal",
      invariants: ["I-03"] }),
  F({ ufr: "UFR-0164", name: "tax_jurisdiction", object: BusinessObjectType.Investor, type: "string", required: true,
      description: "ISO 3166-2 code of tax residence. Drives withholding and reporting obligations.", sensitivity: "restricted" }),
  F({ ufr: "UFR-0165", name: "became_member_on", object: BusinessObjectType.Investor, type: "timestamp", required: false, immutable: true,
      description: "When the first capital commitment settled and the identity became a Member. Set once, never cleared.", sensitivity: "internal",
      invariants: ["I-08"] }),

  // ── Commitment ────────────────────────────────────────────────────
  F({ ufr: "UFR-0180", name: "investor_id", object: BusinessObjectType.Commitment, type: "reference", required: true,
      references: BusinessObjectType.Investor, immutable: true,
      description: "The committing identity.", sensitivity: "holder" }),
  F({ ufr: "UFR-0181", name: "offering_id", object: BusinessObjectType.Commitment, type: "reference", required: true,
      references: BusinessObjectType.InvestmentOffering, immutable: true,
      description: "The offering committed into.", sensitivity: "holder" }),
  F({ ufr: "UFR-0182", name: "committed_amount", object: BusinessObjectType.Commitment, type: "money", required: true, immutable: true,
      description: "Legally binding promise of capital. Precedes deployment; distinct from Investment.", sensitivity: "holder",
      invariants: ["F-03"] }),
  F({ ufr: "UFR-0183", name: "accepted_at", object: BusinessObjectType.Commitment, type: "timestamp", required: false, immutable: true,
      description: "When the enterprise formally accepted the commitment. This is the accreditation test point: a commitment accepted while accreditation was valid completes even if accreditation later expires.", sensitivity: "holder",
      invariants: ["I-03", "F-10"] }),
  F({ ufr: "UFR-0184", name: "commitment_state", object: BusinessObjectType.Commitment, type: "enum", required: true,
      values: ["offered", "accepted", "settled", "lapsed", "withdrawn"],
      description: "Commitment lifecycle. 'lapsed' is the automatic outcome when accreditation expires before acceptance.", sensitivity: "holder",
      invariants: ["I-03"] }),

  // ── Capital Call ──────────────────────────────────────────────────
  F({ ufr: "UFR-0200", name: "vehicle_id", object: BusinessObjectType.CapitalCall, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle calling capital.", sensitivity: "holder" }),
  F({ ufr: "UFR-0201", name: "called_amount", object: BusinessObjectType.CapitalCall, type: "money", required: true, immutable: true,
      description: "Total amount called across all committed holders.", sensitivity: "holder" }),
  F({ ufr: "UFR-0202", name: "due_on", object: BusinessObjectType.CapitalCall, type: "date", required: true,
      description: "Date called funds are due from holders. Drives default tracking under the LLP Agreement.", sensitivity: "holder" }),
  F({ ufr: "UFR-0203", name: "purpose", object: BusinessObjectType.CapitalCall, type: "enum", required: true, immutable: true,
      values: ["acquisition", "approved_expansion", "approved_redevelopment", "extraordinary_event", "llp_agreement_provision"],
      description: "Why capital is being called. The closed set is the enforcement: post-stabilisation there is no value representing an operating deficit, routine maintenance, or reserve replenishment. Investor capital is growth capital.", sensitivity: "holder",
      invariants: ["F-16"] }),

  // ── Investment ────────────────────────────────────────────────────
  F({ ufr: "UFR-0220", name: "commitment_id", object: BusinessObjectType.Investment, type: "reference", required: true,
      references: BusinessObjectType.Commitment, immutable: true,
      description: "The commitment this deployment draws against.", sensitivity: "holder" }),
  F({ ufr: "UFR-0221", name: "deployed_amount", object: BusinessObjectType.Investment, type: "money", required: true, immutable: true,
      description: "Capital actually deployed. Immutable. Distinct from the commitment that authorised it.", sensitivity: "holder",
      invariants: ["F-03"] }),
  F({ ufr: "UFR-0222", name: "deployed_at", object: BusinessObjectType.Investment, type: "timestamp", required: true, immutable: true,
      description: "When the capital was deployed.", sensitivity: "holder" }),
  F({ ufr: "UFR-0223", name: "capital_state", object: BusinessObjectType.Investment, type: "enum", required: true,
      values: ["committed", "drawn", "invested", "returned", "distributed"],
      description: "Every unit of capital sits in exactly one of these states at all times. The sum across states must reconcile to total committed — no capital is ever unaccounted.", sensitivity: "holder",
      invariants: ["F-03"] }),

  // ── Ownership Position ────────────────────────────────────────────
  F({ ufr: "UFR-0240", name: "investor_id", object: BusinessObjectType.OwnershipPosition, type: "reference", required: true,
      references: BusinessObjectType.Investor, immutable: true,
      description: "The identity holding this position. Together with vehicle_id this pair is unique: one position per holder per vehicle.", sensitivity: "holder" }),
  F({ ufr: "UFR-0241", name: "vehicle_id", object: BusinessObjectType.OwnershipPosition, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle held in.", sensitivity: "holder" }),
  F({ ufr: "UFR-0242", name: "units_held", object: BusinessObjectType.OwnershipPosition, type: "decimal", required: true,
      description: "Ownership units held. The sum of this field across all positions in a vehicle must equal total_units_issued exactly.", sensitivity: "holder",
      invariants: ["F-02"] }),
  F({ ufr: "UFR-0243", name: "voting_rights_percent", object: BusinessObjectType.OwnershipPosition, type: "percent", required: true, computed: true,
      description: "Share of the vehicle's voting rights, derived as units_held over total_units_issued. Voting is equity-weighted, never per-capita. Capped at 10 percent absent Board approval.", sensitivity: "holder",
      invariants: ["F-02"] }),
  F({ ufr: "UFR-0244", name: "ownership_class", object: BusinessObjectType.OwnershipPosition, type: "string", required: true,
      description: "Ownership class. Partners within the same class hold identical rights per unit — an entrenched principle (L1-01 §32b).", sensitivity: "holder" }),

  // ── Distribution ──────────────────────────────────────────────────
  F({ ufr: "UFR-0260", name: "vehicle_id", object: BusinessObjectType.Distribution, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The distributing vehicle.", sensitivity: "holder" }),
  F({ ufr: "UFR-0261", name: "waterfall_stage", object: BusinessObjectType.Distribution, type: "enum", required: true, immutable: true,
      values: ["1_operating_company", "2_brand_digital", "3_admin_reserve", "4_sinking_fund", "5_debt_service", "6_partner_distribution"],
      description: "Which of the six waterfall stages this payment satisfies. Stage 6 cannot execute while any Stage 5 obligation is outstanding.", sensitivity: "holder",
      invariants: ["F-05"] }),
  F({ ufr: "UFR-0262", name: "amount", object: BusinessObjectType.Distribution, type: "money", required: true, immutable: true,
      description: "Amount distributed. Executed payouts cannot change; corrections post offsetting entries.", sensitivity: "holder",
      invariants: ["F-07", "F-04"] }),
  F({ ufr: "UFR-0263", name: "executed_at", object: BusinessObjectType.Distribution, type: "timestamp", required: true, immutable: true,
      description: "When the payment executed.", sensitivity: "holder", invariants: ["F-07"] }),
  F({ ufr: "UFR-0264", name: "revenue_base", object: BusinessObjectType.Distribution, type: "money", required: true, immutable: true,
      // The term below names a THIRD PARTY's fee (the OTA or channel that took the
      // sale), quoted verbatim from the constitutional Revenue Base definition in
      // L1-16 §1.2. Renaming it would break the tie to the instrument defining it,
      // so the line carries an explicit exemption rather than a paraphrase.
      description: "The Revenue Base this distribution was computed from: gross operating receipts less statutory taxes, booking platform fees, channel commissions, settlement charges, and refunds. No GC or affiliate fee is deductible in arriving at this figure.", // vocab-lint-ignore
      sensitivity: "holder",
      invariants: ["F-15"] }),

  // ═══ GOVERNANCE DOMAIN ═════════════════════════════════════════════

  // ── Agreement ─────────────────────────────────────────────────────
  F({ ufr: "UFR-0280", name: "agreement_type", object: BusinessObjectType.Agreement, type: "enum", required: true,
      values: ["subscription", "llp_agreement", "operating_agreement", "commercial_services", "share_purchase", "shareholders", "financing", "lease"],
      description: "Instrument type. 'operating_agreement' and 'commercial_services' are always material related-party transactions regardless of value.", sensitivity: "member",
      invariants: ["I-07"] }),
  F({ ufr: "UFR-0281", name: "counterparty_id", object: BusinessObjectType.Agreement, type: "reference", required: true,
      references: BusinessObjectType.Organization, immutable: true,
      description: "The other party. Where this is an affiliated division, the agreement is a related-party transaction.", sensitivity: "member",
      invariants: ["I-07"] }),
  F({ ufr: "UFR-0282", name: "annual_value", object: BusinessObjectType.Agreement, type: "money", required: false,
      description: "Annual consideration. Tested against the materiality threshold: 50 lakh, or 2 percent of vehicle operating expense.", sensitivity: "member",
      invariants: ["I-07"] }),
  F({ ufr: "UFR-0283", name: "term_months", object: BusinessObjectType.Agreement, type: "integer", required: false,
      description: "Term length. Over 36 months is material regardless of value.", sensitivity: "member", invariants: ["I-07"] }),
  F({ ufr: "UFR-0284", name: "is_related_party", object: BusinessObjectType.Agreement, type: "boolean", required: true, computed: true,
      description: "Derived: true when the counterparty is an affiliated division. Because GC holds no equity in the vehicles it governs, every GC economic relationship runs through an agreement — so this is frequently true and is not an edge case.", sensitivity: "member",
      invariants: ["I-07"] }),
  F({ ufr: "UFR-0285", name: "is_material", object: BusinessObjectType.Agreement, type: "boolean", required: true, computed: true,
      description: "Derived from the four materiality tests, plus the always-material carve-out for Operating and Commercial Services Agreements and their amendments.", sensitivity: "member",
      invariants: ["I-07"] }),

  // ── Resolution ────────────────────────────────────────────────────
  F({ ufr: "UFR-0300", name: "matter", object: BusinessObjectType.Resolution, type: "string", required: true, immutable: true,
      description: "The matter voted on. Determines the required threshold via the ordinary / special / unanimous classification.", sensitivity: "member",
      invariants: ["F-09"] }),
  F({ ufr: "UFR-0301", name: "resolution_type", object: BusinessObjectType.Resolution, type: "enum", required: true, immutable: true,
      values: ["ordinary", "special", "unanimous"],
      description: "Threshold class. Ordinary is over 50 percent of equity present; special is at least 76 percent of total equity; unanimous is 100 percent of total equity and applies only to entrenched principles.", sensitivity: "member",
      invariants: ["F-09"] }),
  F({ ufr: "UFR-0302", name: "equity_for", object: BusinessObjectType.Resolution, type: "percent", required: true, immutable: true,
      description: "Equity voting in favour. An equity measure, never a headcount.", sensitivity: "member", invariants: ["F-09"] }),
  F({ ufr: "UFR-0303", name: "equity_against", object: BusinessObjectType.Resolution, type: "percent", required: true, immutable: true,
      description: "Equity voting against. A tie is deemed NOT APPROVED — the burden of approval rests with the proposer.", sensitivity: "member",
      invariants: ["F-09"] }),
  F({ ufr: "UFR-0304", name: "equity_present", object: BusinessObjectType.Resolution, type: "percent", required: true, immutable: true,
      description: "Equity present in person or by valid proxy. Quorum requires at least 60 percent of total equity.", sensitivity: "member",
      invariants: ["F-09"] }),
  F({ ufr: "UFR-0305", name: "outcome", object: BusinessObjectType.Resolution, type: "enum", required: true, computed: true, immutable: true,
      values: ["approved", "rejected", "tied_not_approved", "inquorate", "entrenched_not_unanimous", "entrenched_rights_not_confirmed"],
      description: "Derived automatically from the tally. No manual interpretation step exists between a vote and its resolution state.", sensitivity: "member",
      invariants: ["F-09"] }),
  F({ ufr: "UFR-0306", name: "rationale", object: BusinessObjectType.Resolution, type: "text", required: true, immutable: true,
      description: "Recorded reasoning. Every decision has provenance: who, when, why, what options were considered.", sensitivity: "member",
      invariants: ["E-02", "I-06"] }),
  F({ ufr: "UFR-0307", name: "committee_id", object: BusinessObjectType.Resolution, type: "reference", required: true,
      references: BusinessObjectType.Committee, immutable: true,
      description: "The governance body that passed this Resolution. Required — a resolution with no issuing body cannot be checked against that body's decision authority.", sensitivity: "member",
      invariants: ["E-05", "I-02"] }),
  F({ ufr: "UFR-0308", name: "vehicle_id", object: BusinessObjectType.Resolution, type: "reference", required: false,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle this Resolution concerns, where it is vehicle-specific. Null for enterprise-level resolutions such as policy approval.", sensitivity: "member" }),

  // ── Policy ────────────────────────────────────────────────────────
  F({ ufr: "UFR-0320", name: "policy_id", object: BusinessObjectType.Policy, type: "string", required: true, immutable: true,
      description: "Policy identifier, e.g. EP-01. Permanent.", sensitivity: "public" }),
  F({ ufr: "UFR-0321", name: "policy_version", object: BusinessObjectType.Policy, type: "integer", required: true,
      description: "Version number. Policies version forward; superseded versions remain permanently retrievable.", sensitivity: "public",
      invariants: ["E-03"] }),
  F({ ufr: "UFR-0322", name: "approved_by_resolution_id", object: BusinessObjectType.Policy, type: "reference", required: true,
      references: BusinessObjectType.Resolution, immutable: true,
      description: "The Board resolution approving this version. Only the Board may approve policy amendments.", sensitivity: "member",
      invariants: ["E-02"] }),

  // ── Committee ─────────────────────────────────────────────────────
  F({ ufr: "UFR-0340", name: "committee_name", object: BusinessObjectType.Committee, type: "enum", required: true,
      values: ["board", "investment", "audit_risk", "governance_ethics", "brand_market", "operations_asset_performance", "independent_constitutional_review_panel"],
      description: "The governance bodies established by EP-01 §3.5, plus the Independent Constitutional Review Panel convened under L1-01 §31.", sensitivity: "public" }),
  F({ ufr: "UFR-0341", name: "decision_authority", object: BusinessObjectType.Committee, type: "json", required: true,
      description: "Matters this committee may decide versus merely recommend. Committees do not replace Board authority unless expressly delegated.", sensitivity: "member",
      invariants: ["E-07", "I-02"] }),
  F({ ufr: "UFR-0342", name: "organization_id", object: BusinessObjectType.Committee, type: "reference", required: true,
      references: BusinessObjectType.Organization, immutable: true,
      description: "The Organization this Committee serves. Anchors governance bodies to the enterprise root.", sensitivity: "public",
      invariants: ["E-05"] }),

  // ── Compliance Event ──────────────────────────────────────────────
  F({ ufr: "UFR-0360", name: "event_type", object: BusinessObjectType.ComplianceEvent, type: "enum", required: true,
      values: ["audit_finding", "regulatory_notice", "policy_breach", "conflict_disclosure", "constitutional_failure", "operator_sla_breach", "reserve_breach"],
      description: "Classification of the event. 'constitutional_failure' carries the CF-01 through CF-06 triggers and compels re-ratification.", sensitivity: "internal" }),
  F({ ufr: "UFR-0361", name: "severity", object: BusinessObjectType.ComplianceEvent, type: "enum", required: true,
      values: ["advisory", "governance_alert", "material", "constitutional_breach"],
      description: "Severity band. constitutional_breach is reserved for the CF-01 through CF-06 triggers and compels re-ratification of the affected layer.", sensitivity: "internal" }),
  F({ ufr: "UFR-0362", name: "declared_by", object: BusinessObjectType.ComplianceEvent, type: "reference", required: true,
      references: BusinessObjectType.Committee, immutable: true,
      description: "Who declared it. For constitutional failure this is the Governance and Ethics Committee, or the executive in the interim state, or the Independent Constitutional Review Panel where the declaring authority is itself implicated.", sensitivity: "internal",
      invariants: ["E-02"] }),
  F({ ufr: "UFR-0363", name: "disclosed_to_partners", object: BusinessObjectType.ComplianceEvent, type: "boolean", required: true,
      description: "Whether this was disclosed to affected LLP Partners. Material failures affecting investor rights, reporting, distributions, ownership or governance must be.", sensitivity: "internal" }),

  // ═══ PERFORMANCE DOMAIN ════════════════════════════════════════════

  F({ ufr: "UFR-0380", name: "vehicle_id", object: BusinessObjectType.PerformanceReport, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle reported on.", sensitivity: "holder" }),
  F({ ufr: "UFR-0381", name: "period_end", object: BusinessObjectType.PerformanceReport, type: "date", required: true, immutable: true,
      description: "Reporting period end date.", sensitivity: "holder" }),
  F({ ufr: "UFR-0382", name: "irr", object: BusinessObjectType.PerformanceReport, type: "percent", required: true, computed: true,
      description: "Internal rate of return. One formula, defined once, applied identically across every vehicle. Not configurable per property or per manager.", sensitivity: "holder",
      invariants: ["F-14"] }),
  F({ ufr: "UFR-0383", name: "moic", object: BusinessObjectType.PerformanceReport, type: "decimal", required: true, computed: true,
      description: "Multiple on invested capital. Same determinism requirement as IRR.", sensitivity: "holder",
      invariants: ["F-14"] }),
  F({ ufr: "UFR-0384", name: "nav", object: BusinessObjectType.PerformanceReport, type: "money", required: true, computed: true,
      description: "Net asset value, aggregated from Valuations as of specific dates. Never used to derive the Reserve Floor — NAV is a valuation metric and liquidity risk is a cash-flow problem.", sensitivity: "holder",
      invariants: ["A-03"] }),
  F({ ufr: "UFR-0385", name: "reserve_coverage_ratio", object: BusinessObjectType.PerformanceReport, type: "percent", required: true, computed: true,
      description: "Reserve balance as a percentage of Reserve Floor. Bands: 120 and above healthy, 110 to 119 advisory, 100 to 109 governance alert, below 100 constitutional breach.", sensitivity: "holder",
      invariants: ["F-06"] }),

  F({ ufr: "UFR-0400", name: "benchmark_name", object: BusinessObjectType.Benchmark, type: "string", required: true,
      description: "Name of the comparator: a market index, portfolio average, or peer fund. Must identify the source precisely enough to reproduce the figure.", sensitivity: "member" }),
  F({ ufr: "UFR-0401", name: "benchmark_value", object: BusinessObjectType.Benchmark, type: "decimal", required: true,
      description: "Comparator value for the period.", sensitivity: "member" }),
  F({ ufr: "UFR-0402", name: "vehicle_id", object: BusinessObjectType.Benchmark, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle this comparator is measured against. A benchmark with no subject is uninterpretable — it was previously unanchored in the graph.", sensitivity: "member",
      invariants: ["E-05"] }),

  F({ ufr: "UFR-0420", name: "horizon_years", object: BusinessObjectType.Forecast, type: "integer", required: true,
      description: "Forecast horizon in years.", sensitivity: "member" }),
  F({ ufr: "UFR-0421", name: "scenario", object: BusinessObjectType.Forecast, type: "enum", required: true,
      values: ["base", "downside", "upside", "exit"],
      description: "Scenario modelled. Every forecast declares its case; an undeclared forecast gets read as base and misleads.", sensitivity: "member" }),
  F({ ufr: "UFR-0422", name: "vehicle_id", object: BusinessObjectType.Forecast, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle forecast. Required: a projection detached from what it projects cannot be reconciled against outcome.", sensitivity: "member",
      invariants: ["E-05"] }),

  F({ ufr: "UFR-0440", name: "risk_category", object: BusinessObjectType.Risk, type: "enum", required: true,
      values: ["liquidity", "interest_rate", "operator", "market", "climate", "currency", "legal", "regulatory", "technology", "counterparty"],
      description: "Risk register classification per EP-11.", sensitivity: "member" }),
  F({ ufr: "UFR-0441", name: "likelihood", object: BusinessObjectType.Risk, type: "enum", required: true,
      values: ["rare", "unlikely", "possible", "likely", "almost_certain"],
      description: "Assessed likelihood.", sensitivity: "member" }),
  F({ ufr: "UFR-0442", name: "impact", object: BusinessObjectType.Risk, type: "enum", required: true,
      values: ["negligible", "minor", "moderate", "major", "severe"],
      description: "Assessed impact if the risk materialises. Combined with likelihood to place the risk on the register and set the escalation path.", sensitivity: "member" }),
  F({ ufr: "UFR-0443", name: "vehicle_id", object: BusinessObjectType.Risk, type: "reference", required: true,
      references: BusinessObjectType.InvestmentVehicle, immutable: true,
      description: "The vehicle exposed to this risk. The risk register is maintained per vehicle; an unattached risk entry cannot be escalated to anyone.", sensitivity: "member",
      invariants: ["E-05"] }),

  // ═══ INTELLIGENCE DOMAIN ═══════════════════════════════════════════

  F({ ufr: "UFR-0460", name: "property_id", object: BusinessObjectType.DueDiligence, type: "reference", required: true,
      references: BusinessObjectType.Property, immutable: true,
      description: "The Property investigated.", sensitivity: "internal" }),
  F({ ufr: "UFR-0461", name: "workstream", object: BusinessObjectType.DueDiligence, type: "enum", required: true,
      values: ["legal", "technical", "environmental", "financial", "commercial", "title"],
      description: "Diligence workstream. All must complete before acquisition approval.", sensitivity: "internal" }),
  F({ ufr: "UFR-0462", name: "outcome", object: BusinessObjectType.DueDiligence, type: "enum", required: true,
      values: ["clear", "clear_with_conditions", "adverse"],
      description: "Workstream finding. An adverse outcome in any single workstream blocks acquisition approval until resolved or explicitly accepted by the Investment Committee.", sensitivity: "internal" }),

  F({ ufr: "UFR-0480", name: "thesis_statement", object: BusinessObjectType.InvestmentThesis, type: "text", required: true,
      description: "Why this Property should outperform over twenty years. Immutable once versioned — edits create a new version so that what was believed at approval remains auditable.", sensitivity: "member",
      invariants: ["E-03"] }),
  F({ ufr: "UFR-0481", name: "thesis_version", object: BusinessObjectType.InvestmentThesis, type: "integer", required: true,
      description: "Version number. Knowledge versions forward; prior versions remain accessible.", sensitivity: "member",
      invariants: ["E-03"] }),
  F({ ufr: "UFR-0482", name: "return_drivers", object: BusinessObjectType.InvestmentThesis, type: "json", required: true,
      description: "Identified drivers of return.", sensitivity: "member" }),
  F({ ufr: "UFR-0483", name: "risk_mitigants", object: BusinessObjectType.InvestmentThesis, type: "json", required: true,
      description: "Identified risks and their mitigations. A thesis that names no risks is not a thesis.", sensitivity: "member" }),
  F({ ufr: "UFR-0484", name: "property_id", object: BusinessObjectType.InvestmentThesis, type: "reference", required: true,
      references: BusinessObjectType.Property, immutable: true,
      description: "The Property this thesis concerns. Written while the Property is in prospecting state, before Acquisition references the thesis.", sensitivity: "member",
      invariants: ["E-05"] }),

  F({ ufr: "UFR-0500", name: "market_region", object: BusinessObjectType.MarketIntelligence, type: "string", required: true,
      description: "Geographic scope of the intelligence.", sensitivity: "internal" }),
  F({ ufr: "UFR-0501", name: "observed_on", object: BusinessObjectType.MarketIntelligence, type: "date", required: true, immutable: true,
      description: "As-of date of the observation.", sensitivity: "internal" }),

  F({ ufr: "UFR-0520", name: "research_topic", object: BusinessObjectType.Research, type: "enum", required: true,
      values: ["esg", "geographic", "asset_class", "economic", "regulatory"],
      description: "Research subject area. Determines which committee receives the output and how long it is retained.", sensitivity: "internal" }),
  F({ ufr: "UFR-0521", name: "research_version", object: BusinessObjectType.Research, type: "integer", required: true,
      description: "Version. Research is knowledge and versions forward rather than mutating.", sensitivity: "internal",
      invariants: ["E-03"] }),
];

// ─────────────────────────────────────────────────────────────────────
// LOOKUPS
// ─────────────────────────────────────────────────────────────────────

export const UFR_BY_ID: Record<string, FieldDefinition> = Object.fromEntries(
  UFR.map((f) => [f.ufr, f]),
);

export function fieldsFor(object: BusinessObjectType): FieldDefinition[] {
  return UFR.filter((f) => f.object === object && !f.retired);
}

export function isRegistered(object: BusinessObjectType, fieldName: string): boolean {
  return UFR.some((f) => f.object === object && f.name === fieldName && !f.retired);
}

/** Fields enforcing a given invariant — used to prove coverage. */
export function fieldsEnforcing(invariant: string): FieldDefinition[] {
  return UFR.filter((f) => f.invariants?.includes(invariant));
}

/** Fields requiring redaction on member-facing exports. */
export function restrictedFields(): FieldDefinition[] {
  return UFR.filter((f) => f.sensitivity === "restricted" || f.sensitivity === "internal");
}
