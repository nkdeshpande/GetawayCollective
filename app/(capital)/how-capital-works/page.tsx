/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /how-capital-works
 * Access    public   (override — see constants/routes.ts)
 * Assembly  AS-04 · The Capital Explainer
 * 
 */

import type { Metadata } from "next";
import { CapitalExplainer } from "@/app/_assemblies/gateway";

export const metadata: Metadata = {
  title: "How Capital Works · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Phow_capital_works() {
  return <CapitalExplainer />;
}
