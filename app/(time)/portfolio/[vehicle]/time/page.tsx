/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /portfolio/[vehicle]/time
 * Access    member   (derived from vantage)
 * Assembly  AS-25 · The Time Ledger
 * 
 */

import type { Metadata } from "next";
import { MemberSurface } from "@/app/_assemblies/memberpages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/portfolio/[vehicle]/time", await currentSubject()).ok;
  return {
    title: reachable ? "Time · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pportfolio_vehicle_time(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <MemberSurface path="/portfolio/[vehicle]/time" param={params.vehicle} />;
}
