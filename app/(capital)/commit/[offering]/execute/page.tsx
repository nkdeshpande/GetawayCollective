/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /commit/[offering]/execute
 * Access    accredited   (override — see constants/routes.ts)
 * Assembly  AS-19 · The Ledger Lock
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/commit/[offering]/execute").ok;
  return {
    title: reachable ? "Execute · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcommit_offering_execute(props: { params: Promise<{ offering: string }> }) {
  const params = await props.params;
  return <Composed path="/commit/[offering]/execute" param={params.offering} />;
}
