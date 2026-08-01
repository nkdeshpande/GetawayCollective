/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /commit/[offering]/risk
 * Access    accredited   (override — see constants/routes.ts)
 * Assembly  AS-14 · The Risk Disclosure
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/commit/[offering]/risk").ok;
  return {
    title: reachable ? "Risk Disclosure · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcommit_offering_risk(props: { params: Promise<{ offering: string }> }) {
  const params = await props.params;
  return <Composed path="/commit/[offering]/risk" param={params.offering} />;
}
