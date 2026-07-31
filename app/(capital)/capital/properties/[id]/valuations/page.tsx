/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/properties/[id]/valuations
 * Access    office   (derived from vantage)
 * Assembly  AS-02 · The Property Console
 * Rights    valuation.record
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/properties/[id]/valuations").ok;
  return {
    title: reachable ? "Valuations · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_properties_id_valuations(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/capital/properties/[id]/valuations"
      assembly={"AS-02"}
      params={params}
    />
  );
}
