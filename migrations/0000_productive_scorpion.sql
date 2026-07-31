CREATE TYPE "public"."agreement_agreement_type_enum" AS ENUM('subscription', 'llp_agreement', 'operating_agreement', 'commercial_services', 'share_purchase', 'shareholders', 'financing', 'lease');--> statement-breakpoint
CREATE TYPE "public"."capital_call_purpose_enum" AS ENUM('acquisition', 'approved_expansion', 'approved_redevelopment', 'extraordinary_event', 'llp_agreement_provision');--> statement-breakpoint
CREATE TYPE "public"."commitment_commitment_state_enum" AS ENUM('offered', 'accepted', 'settled', 'lapsed', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."committee_committee_name_enum" AS ENUM('board', 'investment', 'audit_risk', 'governance_ethics', 'brand_market', 'operations_asset_performance', 'independent_constitutional_review_panel');--> statement-breakpoint
CREATE TYPE "public"."compliance_event_event_type_enum" AS ENUM('audit_finding', 'regulatory_notice', 'policy_breach', 'conflict_disclosure', 'constitutional_failure', 'operator_sla_breach', 'reserve_breach');--> statement-breakpoint
CREATE TYPE "public"."compliance_event_severity_enum" AS ENUM('advisory', 'governance_alert', 'material', 'constitutional_breach');--> statement-breakpoint
CREATE TYPE "public"."distribution_waterfall_stage_enum" AS ENUM('1_operating_company', '2_brand_digital', '3_admin_reserve', '4_sinking_fund', '5_debt_service', '6_partner_distribution');--> statement-breakpoint
CREATE TYPE "public"."due_diligence_outcome_enum" AS ENUM('clear', 'clear_with_conditions', 'adverse');--> statement-breakpoint
CREATE TYPE "public"."due_diligence_workstream_enum" AS ENUM('legal', 'technical', 'environmental', 'financial', 'commercial', 'title');--> statement-breakpoint
CREATE TYPE "public"."forecast_scenario_enum" AS ENUM('base', 'downside', 'upside', 'exit');--> statement-breakpoint
CREATE TYPE "public"."investment_capital_state_enum" AS ENUM('committed', 'drawn', 'invested', 'returned', 'distributed');--> statement-breakpoint
CREATE TYPE "public"."investment_offering_offering_state_enum" AS ENUM('draft', 'open', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."investment_vehicle_lifecycle_state_enum" AS ENUM('forming', 'raising', 'deployed', 'stabilised', 'winding_down', 'dissolved');--> statement-breakpoint
CREATE TYPE "public"."investment_vehicle_vehicle_form_enum" AS ENUM('llp', 'spv', 'fund', 'trust', 'syndicate');--> statement-breakpoint
CREATE TYPE "public"."investor_accreditation_state_enum" AS ENUM('none', 'in_review', 'accredited', 'expired');--> statement-breakpoint
CREATE TYPE "public"."investor_member_state_enum" AS ENUM('investor', 'member');--> statement-breakpoint
CREATE TYPE "public"."organization_entity_type_enum" AS ENUM('llp', 'private_limited', 'trust', 'partnership', 'sole_proprietor', 'foreign_entity');--> statement-breakpoint
CREATE TYPE "public"."organization_role_in_enterprise_enum" AS ENUM('asset_platform', 'operating_partner', 'brand_partner', 'investment_vehicle', 'external_counterparty');--> statement-breakpoint
CREATE TYPE "public"."property_lifecycle_state_enum" AS ENUM('prospecting', 'pending', 'acquired', 'development', 'stabilised', 'disposition_pending', 'exited');--> statement-breakpoint
CREATE TYPE "public"."research_research_topic_enum" AS ENUM('esg', 'geographic', 'asset_class', 'economic', 'regulatory');--> statement-breakpoint
CREATE TYPE "public"."resolution_outcome_enum" AS ENUM('approved', 'rejected', 'tied_not_approved', 'inquorate', 'entrenched_not_unanimous', 'entrenched_rights_not_confirmed');--> statement-breakpoint
CREATE TYPE "public"."resolution_resolution_type_enum" AS ENUM('ordinary', 'special', 'unanimous');--> statement-breakpoint
CREATE TYPE "public"."risk_impact_enum" AS ENUM('negligible', 'minor', 'moderate', 'major', 'severe');--> statement-breakpoint
CREATE TYPE "public"."risk_likelihood_enum" AS ENUM('rare', 'unlikely', 'possible', 'likely', 'almost_certain');--> statement-breakpoint
CREATE TYPE "public"."risk_risk_category_enum" AS ENUM('liquidity', 'interest_rate', 'operator', 'market', 'climate', 'currency', 'legal', 'regulatory', 'technology', 'counterparty');--> statement-breakpoint
CREATE TYPE "public"."valuation_source_enum" AS ENUM('independent', 'management');--> statement-breakpoint
CREATE TABLE "acquisition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"property_id" uuid NOT NULL,
	"acquisition_price" numeric(20, 4) NOT NULL,
	"completed_on" date NOT NULL,
	"investment_thesis_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agreement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"agreement_type" "agreement_agreement_type_enum" NOT NULL,
	"counterparty_id" uuid NOT NULL,
	"annual_value" numeric(20, 4),
	"term_months" integer,
	"is_related_party" boolean NOT NULL,
	"is_material" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"benchmark_name" varchar(512) NOT NULL,
	"benchmark_value" numeric(20, 6) NOT NULL,
	"vehicle_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capital_call" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"called_amount" numeric(20, 4) NOT NULL,
	"due_on" date NOT NULL,
	"purpose" "capital_call_purpose_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commitment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"investor_id" uuid NOT NULL,
	"offering_id" uuid NOT NULL,
	"committed_amount" numeric(20, 4) NOT NULL,
	"accepted_at" timestamp with time zone,
	"commitment_state" "commitment_commitment_state_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "committee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"committee_name" "committee_committee_name_enum" NOT NULL,
	"decision_authority" jsonb NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"event_type" "compliance_event_event_type_enum" NOT NULL,
	"severity" "compliance_event_severity_enum" NOT NULL,
	"declared_by" uuid NOT NULL,
	"disclosed_to_partners" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disposition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"property_id" uuid NOT NULL,
	"disposal_price" numeric(20, 4) NOT NULL,
	"completed_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distribution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"waterfall_stage" "distribution_waterfall_stage_enum" NOT NULL,
	"amount" numeric(20, 4) NOT NULL,
	"executed_at" timestamp with time zone NOT NULL,
	"revenue_base" numeric(20, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "due_diligence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"property_id" uuid NOT NULL,
	"workstream" "due_diligence_workstream_enum" NOT NULL,
	"outcome" "due_diligence_outcome_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forecast" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"horizon_years" integer NOT NULL,
	"scenario" "forecast_scenario_enum" NOT NULL,
	"vehicle_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"commitment_id" uuid NOT NULL,
	"deployed_amount" numeric(20, 4) NOT NULL,
	"deployed_at" timestamp with time zone NOT NULL,
	"capital_state" "investment_capital_state_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_offering" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"offering_name" varchar(512) NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"target_amount" numeric(20, 4) NOT NULL,
	"minimum_subscription" numeric(20, 4) NOT NULL,
	"brand_participation_rate" numeric(9, 6),
	"offering_state" "investment_offering_offering_state_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_thesis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"thesis_statement" text NOT NULL,
	"thesis_version" integer NOT NULL,
	"return_drivers" jsonb NOT NULL,
	"risk_mitigants" jsonb NOT NULL,
	"property_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_vehicle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"vehicle_name" varchar(512) NOT NULL,
	"vehicle_form" "investment_vehicle_vehicle_form_enum" NOT NULL,
	"governing_organization_id" uuid NOT NULL,
	"total_units_issued" integer NOT NULL,
	"reserve_floor_amount" numeric(20, 4) NOT NULL,
	"reserve_balance" numeric(20, 4) NOT NULL,
	"approved_leverage_limit" numeric(9, 6),
	"lifecycle_state" "investment_vehicle_lifecycle_state_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"legal_name" varchar(512) NOT NULL,
	"member_state" "investor_member_state_enum" NOT NULL,
	"accreditation_state" "investor_accreditation_state_enum" NOT NULL,
	"accreditation_expires_on" timestamp with time zone,
	"tax_jurisdiction" varchar(512) NOT NULL,
	"became_member_on" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "market_intelligence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"market_region" varchar(512) NOT NULL,
	"observed_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"legal_name" varchar(512) NOT NULL,
	"entity_type" "organization_entity_type_enum" NOT NULL,
	"jurisdiction" varchar(512) NOT NULL,
	"registration_number" varchar(512) NOT NULL,
	"incorporated_on" date NOT NULL,
	"role_in_enterprise" "organization_role_in_enterprise_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ownership_position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"investor_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"units_held" numeric(20, 6) NOT NULL,
	"voting_rights_percent" numeric(9, 6) NOT NULL,
	"ownership_class" varchar(512) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performance_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"period_end" date NOT NULL,
	"irr" numeric(9, 6) NOT NULL,
	"moic" numeric(20, 6) NOT NULL,
	"nav" numeric(20, 4) NOT NULL,
	"reserve_coverage_ratio" numeric(9, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"policy_id" varchar(512) NOT NULL,
	"policy_version" integer NOT NULL,
	"approved_by_resolution_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"portfolio_name" varchar(512) NOT NULL,
	"investment_strategy" text NOT NULL,
	"concentration_ceiling" numeric(9, 6) NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"property_name" varchar(512) NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"portfolio_id" uuid,
	"jurisdiction" varchar(512) NOT NULL,
	"title_reference" varchar(512) NOT NULL,
	"land_area_sqm" numeric(20, 6) NOT NULL,
	"lifecycle_state" "property_lifecycle_state_enum" NOT NULL,
	"stabilised_on" date,
	"environmental_commitments" jsonb
);
--> statement-breakpoint
CREATE TABLE "research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"research_topic" "research_research_topic_enum" NOT NULL,
	"research_version" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resolution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"matter" varchar(512) NOT NULL,
	"resolution_type" "resolution_resolution_type_enum" NOT NULL,
	"equity_for" numeric(9, 6) NOT NULL,
	"equity_against" numeric(9, 6) NOT NULL,
	"equity_present" numeric(9, 6) NOT NULL,
	"outcome" "resolution_outcome_enum" NOT NULL,
	"rationale" text NOT NULL,
	"committee_id" uuid NOT NULL,
	"vehicle_id" uuid
);
--> statement-breakpoint
CREATE TABLE "risk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"risk_category" "risk_risk_category_enum" NOT NULL,
	"likelihood" "risk_likelihood_enum" NOT NULL,
	"impact" "risk_impact_enum" NOT NULL,
	"vehicle_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "valuation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"property_id" uuid NOT NULL,
	"valued_on" date NOT NULL,
	"value" numeric(20, 4) NOT NULL,
	"source" "valuation_source_enum" NOT NULL,
	"valuer_name" varchar(512)
);
--> statement-breakpoint
ALTER TABLE "acquisition" ADD CONSTRAINT "acquisition_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisition" ADD CONSTRAINT "acquisition_investment_thesis_id_investment_thesis_id_fk" FOREIGN KEY ("investment_thesis_id") REFERENCES "public"."investment_thesis"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreement" ADD CONSTRAINT "agreement_counterparty_id_organization_id_fk" FOREIGN KEY ("counterparty_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "benchmark" ADD CONSTRAINT "benchmark_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_call" ADD CONSTRAINT "capital_call_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commitment" ADD CONSTRAINT "commitment_investor_id_investor_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investor"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commitment" ADD CONSTRAINT "commitment_offering_id_investment_offering_id_fk" FOREIGN KEY ("offering_id") REFERENCES "public"."investment_offering"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_event" ADD CONSTRAINT "compliance_event_declared_by_committee_id_fk" FOREIGN KEY ("declared_by") REFERENCES "public"."committee"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disposition" ADD CONSTRAINT "disposition_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution" ADD CONSTRAINT "distribution_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "due_diligence" ADD CONSTRAINT "due_diligence_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forecast" ADD CONSTRAINT "forecast_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_commitment_id_commitment_id_fk" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitment"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_offering" ADD CONSTRAINT "investment_offering_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_thesis" ADD CONSTRAINT "investment_thesis_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_vehicle" ADD CONSTRAINT "investment_vehicle_governing_organization_id_organization_id_fk" FOREIGN KEY ("governing_organization_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownership_position" ADD CONSTRAINT "ownership_position_investor_id_investor_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investor"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownership_position" ADD CONSTRAINT "ownership_position_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_report" ADD CONSTRAINT "performance_report_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy" ADD CONSTRAINT "policy_approved_by_resolution_id_resolution_id_fk" FOREIGN KEY ("approved_by_resolution_id") REFERENCES "public"."resolution"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution" ADD CONSTRAINT "resolution_committee_id_committee_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committee"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution" ADD CONSTRAINT "resolution_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk" ADD CONSTRAINT "risk_vehicle_id_investment_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."investment_vehicle"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuation" ADD CONSTRAINT "valuation_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE restrict ON UPDATE no action;