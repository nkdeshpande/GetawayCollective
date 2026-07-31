/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/reports
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    report.publish
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/reports").ok;
  return {
    title: reachable ? "Reports · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_reports() {
  return (
    <Surface
      path="/admin/reports"
      assembly={null}
    />
  );
}
