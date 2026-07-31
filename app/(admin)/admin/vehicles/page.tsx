/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/vehicles
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    vehicle.form
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/vehicles").ok;
  return {
    title: reachable ? "Vehicles · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_vehicles() {
  return (
    <Surface
      path="/admin/vehicles"
      assembly={"AS-13"}
    />
  );
}
