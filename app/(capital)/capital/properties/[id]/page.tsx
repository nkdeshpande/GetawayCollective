/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/properties/[id]
 * Access    office   (derived from vantage)
 * Assembly  AS-02 · The Property Console
 * Rights    portfolio.manage
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/properties/[id]").ok;
  return {
    title: reachable ? "Property Console · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_properties_id(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <Composed path="/capital/properties/[id]" param={params.id} />;
}
