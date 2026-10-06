CREATE TABLE "notice_delivery" (
	"delivery_id" text PRIMARY KEY NOT NULL,
	"dedupe_key" text NOT NULL,
	"notice_id" text NOT NULL,
	"recipient" text NOT NULL,
	"audience" text NOT NULL,
	"channel" text NOT NULL,
	"urgency" text NOT NULL,
	"subject" text NOT NULL,
	"body_text" text NOT NULL,
	"body_html" text,
	"reply_to" text,
	"state" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"last_error" text
);
--> statement-breakpoint
CREATE TABLE "notice_preference" (
	"recipient" text NOT NULL,
	"notice_class" text NOT NULL,
	"channel" text NOT NULL,
	"allowed" boolean NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notice_preference_recipient_notice_class_channel_pk" PRIMARY KEY("recipient","notice_class","channel")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "notice_delivery_dedupe_key" ON "notice_delivery" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "notice_delivery_due_idx" ON "notice_delivery" USING btree ("state","due_at");--> statement-breakpoint
CREATE INDEX "notice_delivery_recipient_idx" ON "notice_delivery" USING btree ("recipient","created_at");