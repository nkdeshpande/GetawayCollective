/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/codex
 * Access    member   (derived from vantage)
 * Assembly  AS-33 · The Member Surface
 * 
 */

import type { Metadata } from "next";
import { Codex } from "@/app/_assemblies/memberpages";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/codex").ok;
  return {
    title: reachable ? "The Codex · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_codex() {
  return <Codex />;
}
