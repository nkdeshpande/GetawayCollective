/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/telemetry
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    portfolio.manage
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/telemetry").ok;
  return {
    title: reachable ? "Telemetry · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_telemetry() {
  return <Composed path="/admin/telemetry" />;
}
