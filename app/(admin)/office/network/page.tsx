/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/network
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    portfolio.manage
 * 
 */

import type { Metadata } from "next";
import { OfficeSurface } from "@/app/_assemblies/officepages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/network", await currentSubject()).ok;
  return {
    title: reachable ? "Network · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_network() {
  return <OfficeSurface path="/office/network" />;
}
