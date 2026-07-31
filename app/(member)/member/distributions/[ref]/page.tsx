/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/distributions/[ref]
 * Access    member   (derived from vantage)
 * Assembly  AS-05 · The Member Console
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/distributions/[ref]").ok;
  return {
    title: reachable ? "Distribution · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_distributions_ref(props: { params: Promise<{ ref: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/member/distributions/[ref]"
      assembly={"AS-05"}
      params={params}
    />
  );
}
