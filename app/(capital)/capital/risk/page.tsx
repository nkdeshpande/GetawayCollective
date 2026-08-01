/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/risk
 * Access    office   (derived from vantage)
 * Assembly  AS-28 · The Risk Register
 * Rights    compliance.record
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/risk").ok;
  return {
    title: reachable ? "Risk Register · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_risk() {
  return <Composed path="/capital/risk" />;
}
