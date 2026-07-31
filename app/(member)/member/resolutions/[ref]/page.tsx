/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/resolutions/[ref]
 * Access    member   (derived from vantage)
 * Assembly  AS-27 · The Ballot
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/resolutions/[ref]").ok;
  return {
    title: reachable ? "Ballot · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_resolutions_ref(props: { params: Promise<{ ref: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/member/resolutions/[ref]"
      assembly={"AS-27"}
      params={params}
    />
  );
}
