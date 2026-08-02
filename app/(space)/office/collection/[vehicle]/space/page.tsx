/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/collection/[vehicle]/space
 * Access    office   (override — see constants/routes.ts)
 * Assembly  AS-03 · The Property Masthead
 * Rights    property.register
 * 
 */

import type { Metadata } from "next";
import { PropertyMasthead } from "@/app/_assemblies/gateway";
import { propertyBySlug } from "@/app/_assemblies/data";
import { notFound } from "next/navigation";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/collection/[vehicle]/space", await currentSubject()).ok;
  return {
    title: reachable ? "Space · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_collection_vehicle_space(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  const property = propertyBySlug(params.vehicle);
  if (!property) notFound();
  return <PropertyMasthead p={property} />;
}
