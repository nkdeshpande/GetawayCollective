/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/investors
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    investor.register
 * 
 */

import type { Metadata } from "next";
import { InvestorRegister } from "@/app/_assemblies/officerecords";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/investors", await currentSubject()).ok;
  return {
    title: reachable ? "Investors · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_investors() {
  return <InvestorRegister />;
}
