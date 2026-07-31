/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/properties
 * Access    office   (derived from vantage)
 * Assembly  AS-02 · The Property Console
 * Rights    portfolio.manage
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/properties").ok;
  return {
    title: reachable ? "Properties · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_properties() {
  return (
    <Surface
      path="/capital/properties"
      assembly={"AS-02"}
    />
  );
}
