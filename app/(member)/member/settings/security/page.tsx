/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/settings/security
 * Access    member   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/settings/security").ok;
  return {
    title: reachable ? "Security · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_settings_security() {
  return <Composed path="/member/settings/security" />;
}
