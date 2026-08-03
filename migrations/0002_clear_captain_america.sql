CREATE TABLE "event_log" (
	"event_id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"actor_id" text NOT NULL,
	"object_type" text NOT NULL,
	"object_id" text NOT NULL,
	"caused_by_command" text NOT NULL,
	"correlation_id" text NOT NULL,
	"reason" text,
	"payload" jsonb NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbound_contact" (
	"contact_id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"note" text,
	"source" text NOT NULL,
	"vehicle_slug" text,
	"investor_id" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"correlation_id" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "event_log_object_idx" ON "event_log" USING btree ("object_type","object_id","occurred_at");--> statement-breakpoint
CREATE INDEX "event_log_actor_idx" ON "event_log" USING btree ("actor_id","occurred_at");--> statement-breakpoint
CREATE INDEX "event_log_correlation_idx" ON "event_log" USING btree ("correlation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_log_event_id_key" ON "event_log" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "inbound_contact_email_idx" ON "inbound_contact" USING btree ("email");--> statement-breakpoint
CREATE INDEX "inbound_contact_received_idx" ON "inbound_contact" USING btree ("received_at");