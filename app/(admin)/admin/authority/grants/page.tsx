/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/authority/grants
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    authority.grant
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/authority/grants").ok;
  return {
    title: reachable ? "Grants · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_authority_grants() {
  return <Composed path="/admin/authority/grants" />;
}
