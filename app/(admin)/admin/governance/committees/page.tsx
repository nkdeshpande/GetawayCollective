/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/governance/committees
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    committee.constitute
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/governance/committees").ok;
  return {
    title: reachable ? "Committees · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_governance_committees() {
  return <Composed path="/admin/governance/committees" />;
}
