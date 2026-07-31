/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/governance/resolutions
 * Access    member   (derived from vantage)
 * Assembly  AS-27 · The Ballot
 * Rights    resolution.table
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/governance/resolutions").ok;
  return {
    title: reachable ? "Resolutions · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_governance_resolutions() {
  return (
    <Surface
      path="/admin/governance/resolutions"
      assembly={"AS-27"}
    />
  );
}
