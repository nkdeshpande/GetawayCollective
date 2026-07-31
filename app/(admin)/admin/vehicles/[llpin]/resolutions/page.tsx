/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/vehicles/[llpin]/resolutions
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    resolution.table
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/vehicles/[llpin]/resolutions").ok;
  return {
    title: reachable ? "Resolutions · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_vehicles_llpin_resolutions(props: { params: Promise<{ llpin: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/admin/vehicles/[llpin]/resolutions"
      assembly={"AS-13"}
      params={params}
    />
  );
}
