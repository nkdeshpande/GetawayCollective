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
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/distributions").ok;
  return {
    title: reachable ? "Distributions · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_distributions() {
  return (
    <Surface
      path="/capital/distributions"
      assembly={"AS-02"}
    />
  );
}
