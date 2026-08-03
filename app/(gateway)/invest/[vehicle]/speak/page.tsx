/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /invest/[vehicle]/speak
 * Access    identified   (override — see constants/routes.ts)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { InvestorSurface } from "@/app/_assemblies/investorpages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/invest/[vehicle]/speak", await currentSubject()).ok;
  return {
    title: reachable ? "Speak to Us · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pinvest_vehicle_speak(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <InvestorSurface path="/invest/[vehicle]/speak" param={params.vehicle} />;
}
