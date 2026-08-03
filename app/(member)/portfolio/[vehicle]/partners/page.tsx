/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /portfolio/[vehicle]/partners
 * Access    member   (derived from vantage)
 * Assembly  AS-05 · The Member Console
 * 
 */

import type { Metadata } from "next";
import { MemberSurface } from "@/app/_assemblies/memberpages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/portfolio/[vehicle]/partners", await currentSubject()).ok;
  return {
    title: reachable ? "Partners · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pportfolio_vehicle_partners(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <MemberSurface path="/portfolio/[vehicle]/partners" param={params.vehicle} />;
}
