/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /capital/calls
 * Access    member   (derived from vantage)
 * Assembly  AS-26 · The Capital Call
 * Rights    capital.call
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/capital/calls").ok;
  return {
    title: reachable ? "Capital Calls · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcapital_calls() {
  return <Composed path="/capital/calls" />;
}
