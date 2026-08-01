/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/vehicles/[llpin]/audit
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    compliance.record
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/vehicles/[llpin]/audit").ok;
  return {
    title: reachable ? "Docket Audit · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_vehicles_llpin_audit(props: { params: Promise<{ llpin: string }> }) {
  const params = await props.params;
  return <Composed path="/admin/vehicles/[llpin]/audit" param={params.llpin} />;
}
