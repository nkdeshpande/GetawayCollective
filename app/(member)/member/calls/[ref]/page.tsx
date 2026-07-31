/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/calls/[ref]
 * Access    member   (derived from vantage)
 * Assembly  AS-26 · The Capital Call
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/calls/[ref]").ok;
  return {
    title: reachable ? "Capital Call · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_calls_ref(props: { params: Promise<{ ref: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/member/calls/[ref]"
      assembly={"AS-26"}
      params={params}
    />
  );
}
