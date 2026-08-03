/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/collection/[vehicle]/time/[year]/allocations
 * Access    office   (override — see constants/routes.ts)
 * Assembly  AS-25 · The Time Ledger
 * Rights    policy.approve
 * 
 */

import type { Metadata } from "next";
import { OfficeSurface } from "@/app/_assemblies/officepages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/collection/[vehicle]/time/[year]/allocations", await currentSubject()).ok;
  return {
    title: reachable ? "Partner Allocations · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_collection_vehicle_time_year_allocations(props: { params: Promise<{ vehicle: string; year: string }> }) {
  const params = await props.params;
  return <OfficeSurface path="/office/collection/[vehicle]/time/[year]/allocations" params={params} />;
}
