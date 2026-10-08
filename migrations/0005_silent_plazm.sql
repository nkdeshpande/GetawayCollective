CREATE TABLE "site_visit_daily" (
	"day" text NOT NULL,
	"path" text NOT NULL,
	"source" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"landings" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "site_visit_daily_day_path_source_pk" PRIMARY KEY("day","path","source")
);
--> statement-breakpoint
CREATE INDEX "site_visit_daily_day_idx" ON "site_visit_daily" USING btree ("day");