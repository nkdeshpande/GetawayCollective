/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /investor-workspace-preview
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { InvestorSurface } from "@/app/_assemblies/investorpages";

export const metadata: Metadata = {
  title: "Investor Workspace Preview · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pinvestor_workspace_preview() {
  return <InvestorSurface path="/investor-workspace-preview" />;
}
