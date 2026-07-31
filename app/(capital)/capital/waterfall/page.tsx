/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/waterfall
 * Access    office   (derived from vantage)
 * Assembly  AS-04 · The Capital Explainer
 * Rights    distribution.execute
 * 
 */

import type { Metadata } from "next";
import { CapitalExplainer } from "@/app/_assemblies/gateway";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/waterfall").ok;
  return {
    title: reachable ? "Waterfall · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_waterfall() {
  return <CapitalExplainer />;
}
