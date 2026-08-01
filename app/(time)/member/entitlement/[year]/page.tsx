/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/entitlement/[year]
 * Access    member   (derived from vantage)
 * Assembly  AS-25 · The Time Ledger
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/entitlement/[year]").ok;
  return {
    title: reachable ? "Entitlement Year · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_entitlement_year(props: { params: Promise<{ year: string }> }) {
  const params = await props.params;
  return <Composed path="/member/entitlement/[year]" param={params.year} />;
}
