/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal/risk-disclosure
 * Access    public   (override — see constants/routes.ts)
 * Assembly  AS-14 · The Risk Disclosure
 * 
 */

import type { Metadata } from "next";
import { StandingDoc } from "@/app/_assemblies/documents";

export const metadata: Metadata = {
  title: "Risk Disclosure · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal_risk_disclosure() {
  return <StandingDoc path="/legal/risk-disclosure" />;
}
