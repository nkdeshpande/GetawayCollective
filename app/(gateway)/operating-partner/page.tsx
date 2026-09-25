/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /operating-partner
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteOperator } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/operating-partner", {}, "The Operating Partner · Getaway Collective");

export default async function Poperating_partner() {
  return <SiteOperator />;
}
