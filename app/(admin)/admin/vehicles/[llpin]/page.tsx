/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/vehicles/[llpin]
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    vehicle.form
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/vehicles/[llpin]").ok;
  return {
    title: reachable ? "Docket · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_vehicles_llpin(props: { params: Promise<{ llpin: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/admin/vehicles/[llpin]"
      assembly={"AS-13"}
      params={params}
    />
  );
}
