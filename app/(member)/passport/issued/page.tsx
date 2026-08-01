/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /passport/issued
 * Access    identified   (override — see constants/routes.ts)
 * Assembly  AS-06 · The Commitment Flow
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/passport/issued").ok;
  return {
    title: reachable ? "Passport · issued · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Ppassport_issued() {
  return <Composed path="/passport/issued" />;
}
