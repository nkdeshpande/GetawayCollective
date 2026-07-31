/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /passport/eligibility
 * Access    identified   (override — see constants/routes.ts)
 * Assembly  AS-06 · The Commitment Flow
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/passport/eligibility").ok;
  return {
    title: reachable ? "Passport · eligibility · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Ppassport_eligibility() {
  return (
    <Surface
      path="/passport/eligibility"
      assembly={"AS-06"}
    />
  );
}
