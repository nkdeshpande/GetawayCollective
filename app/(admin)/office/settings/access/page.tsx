/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/settings/access
 * Access    office   (derived from vantage)
 * Assembly  AS-34 · The Admin Surface
 * Rights    authority.grant
 * 
 */

import type { Metadata } from "next";
import { OfficeSurface } from "@/app/_assemblies/officepages";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/settings/access", await currentSubject()).ok;
  return {
    title: reachable ? "People & Access · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_settings_access() {
  return <OfficeSurface path="/office/settings/access" />;
}
