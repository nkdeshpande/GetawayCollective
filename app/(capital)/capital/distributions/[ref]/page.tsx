/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/distributions/[ref]
 * Access    office   (derived from vantage)
 * Assembly  AS-02 · The Property Console
 * Rights    distribution.execute
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/distributions/[ref]").ok;
  return {
    title: reachable ? "Distribution · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_distributions_ref(props: { params: Promise<{ ref: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/capital/distributions/[ref]"
      assembly={"AS-02"}
      params={params}
    />
  );
}
