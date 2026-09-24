CREATE TYPE "public"."investor_kyc_state_enum" AS ENUM('not_started', 'in_progress', 'verified', 'needs_update');--> statement-breakpoint
ALTER TABLE "investment_vehicle" ADD COLUMN "register_key" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "email" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "kyc_state" "investor_kyc_state_enum";--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "kyc_stages" jsonb;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "kyc_verified_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "kyc_review_due_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "pan_last4" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "pan_ciphertext" text;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_account_holder" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_name" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_ifsc" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_account_last4" varchar(512);--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_account_ciphertext" text;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_verified_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "investor" ADD COLUMN "bank_verification_method" varchar(512);