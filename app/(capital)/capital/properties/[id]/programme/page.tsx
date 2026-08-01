/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/properties/[id]/programme
 * Access    office   (derived from vantage)
 * Assembly  AS-11 · The Stage Progression
 * Rights    property.advance_lifecycle
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/properties/[id]/programme").ok;
  return {
    title: reachable ? "Programme · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_properties_id_programme(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <Composed path="/capital/properties/[id]/programme" param={params.id} />;
}
