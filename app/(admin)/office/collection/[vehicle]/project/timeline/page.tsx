/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/collection/[vehicle]/project/timeline
 * Access    office   (derived from vantage)
 * Assembly  AS-11 · The Stage Progression
 * Rights    property.advance_lifecycle
 * 
 */

import type { Metadata } from "next";
import { OfficeSurface } from "@/app/_assemblies/officepages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/collection/[vehicle]/project/timeline", await currentSubject()).ok;
  return {
    title: reachable ? "Timeline · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_collection_vehicle_project_timeline(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <OfficeSurface path="/office/collection/[vehicle]/project/timeline" params={params} />;
}
