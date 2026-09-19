/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/register
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    property.register
 * 
 */

import type { Metadata } from "next";
import { PropertyRegister } from "@/app/_assemblies/propertyregister";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/register", await currentSubject()).ok;
  return {
    title: reachable ? "Property Register · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_register() {
  return <PropertyRegister />;
}
