/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/analytics
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    investor.register
 * 
 */

import type { Metadata } from "next";
import { OfficeAnalytics } from "@/app/_assemblies/officerecords";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/analytics", await currentSubject()).ok;
  return {
    title: reachable ? "Analytics · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_analytics() {
  return <OfficeAnalytics />;
}
