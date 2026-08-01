/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/governance/policies
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    policy.approve
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/governance/policies").ok;
  return {
    title: reachable ? "Policies · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_governance_policies() {
  return <Composed path="/admin/governance/policies" />;
}
