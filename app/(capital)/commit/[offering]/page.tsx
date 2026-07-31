/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /commit/[offering]
 * Access    accredited   (override — see constants/routes.ts)
 * Assembly  AS-06 · The Commitment Flow
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/commit/[offering]").ok;
  return {
    title: reachable ? "Commit · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pcommit_offering(props: { params: Promise<{ offering: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/commit/[offering]"
      assembly={"AS-06"}
      params={params}
    />
  );
}
