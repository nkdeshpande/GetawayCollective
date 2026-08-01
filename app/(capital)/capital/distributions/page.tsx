/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/distributions
 * Access    office   (derived from vantage)
 * Assembly  AS-02 · The Property Console
 * Rights    distribution.execute
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/distributions").ok;
  return {
    title: reachable ? "Distributions · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_distributions() {
  return <Composed path="/capital/distributions" />;
}
