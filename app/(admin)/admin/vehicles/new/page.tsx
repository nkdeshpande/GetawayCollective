/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/vehicles/new
 * Access    office   (derived from vantage)
 * Assembly  AS-34 · The Admin Surface
 * Rights    vehicle.form
 * 
 */

import type { Metadata } from "next";
import { VehicleFormation } from "@/app/_assemblies/adminpages";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/vehicles/new").ok;
  return {
    title: reachable ? "Form a Vehicle · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_vehicles_new() {
  return <VehicleFormation />;
}
