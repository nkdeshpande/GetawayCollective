/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/signal
 * Access    member   (derived from vantage)
 * Assembly  AS-33 · The Member Surface
 * 
 */

import type { Metadata } from "next";
import { SignalLog } from "@/app/_assemblies/memberpages";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/signal").ok;
  return {
    title: reachable ? "The Signal · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_signal() {
  return <SignalLog />;
}
