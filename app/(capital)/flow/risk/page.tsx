/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /flow/risk
 * Access    public   (override — see constants/routes.ts)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { RiskDisclosure } from "@/app/_assemblies/flow";

export const metadata: Metadata = {
  title: "Risk Disclosure · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pflow_risk() {
  return <RiskDisclosure />;
}
