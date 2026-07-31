/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/compliance/conflicts
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    conflict.disclose
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/compliance/conflicts").ok;
  return {
    title: reachable ? "Conflict Register · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_compliance_conflicts() {
  return (
    <Surface
      path="/admin/compliance/conflicts"
      assembly={null}
    />
  );
}
