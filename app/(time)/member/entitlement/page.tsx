/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/entitlement
 * Access    member   (derived from vantage)
 * Assembly  AS-25 · The Time Ledger
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/entitlement").ok;
  return {
    title: reachable ? "Entitlement · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_entitlement() {
  return (
    <Surface
      path="/member/entitlement"
      assembly={"AS-25"}
    />
  );
}
