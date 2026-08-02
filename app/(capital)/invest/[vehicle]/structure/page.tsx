/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /invest/[vehicle]/structure
 * Access    accredited   (override — see constants/routes.ts)
 * Assembly  AS-35 · The Investor Dossier
 * 
 */

import type { Metadata } from "next";
import { InvestorSurface } from "@/app/_assemblies/investorpages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/invest/[vehicle]/structure", await currentSubject()).ok;
  return {
    title: reachable ? "Structure · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pinvest_vehicle_structure(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <InvestorSurface path="/invest/[vehicle]/structure" param={params.vehicle} />;
}
