/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/governance
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    resolution.table
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/governance").ok;
  return {
    title: reachable ? "Governance · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_governance() {
  return (
    <Surface
      path="/admin/governance"
      assembly={null}
    />
  );
}
