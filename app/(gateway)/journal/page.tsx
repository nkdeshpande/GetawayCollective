/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /journal
 * Access    public   (derived from vantage)
 * Assembly  AS-30 · The Journal
 * 
 */

import type { Metadata } from "next";
import { SiteJournalIndex } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/journal", {}, "The Journal · Getaway Collective");

export default async function Pjournal() {
  return <SiteJournalIndex />;
}
