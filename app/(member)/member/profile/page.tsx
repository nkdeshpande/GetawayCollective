/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/profile
 * Access    member   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/profile").ok;
  return {
    title: reachable ? "Profile · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_profile() {
  return (
    <Surface
      path="/member/profile"
      assembly={null}
    />
  );
}
