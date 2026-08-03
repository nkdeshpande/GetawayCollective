/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /invest/[vehicle]/risks
 * Access    accredited   (override — see constants/routes.ts)
 * Assembly  AS-14 · The Risk Disclosure
 * 
 */

import type { Metadata } from "next";
import { InvestorSurface } from "@/app/_assemblies/investorpages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/invest/[vehicle]/risks", await currentSubject()).ok;
  return {
    title: reachable ? "Risk · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pinvest_vehicle_risks(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <InvestorSurface path="/invest/[vehicle]/risks" param={params.vehicle} />;
}
