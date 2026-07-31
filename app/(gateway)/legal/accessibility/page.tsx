/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal/accessibility
 * Access    public   (derived from vantage)
 * Assembly  AS-29 · The Standing Document
 * 
 */

import type { Metadata } from "next";
import { StandingDoc } from "@/app/_assemblies/documents";

export const metadata: Metadata = {
  title: "Accessibility Statement · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal_accessibility() {
  return <StandingDoc path="/legal/accessibility" />;
}
