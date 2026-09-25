/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /start
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteStart } from "@/app/_assemblies/site/start";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/start", {}, "Where Next · Getaway Collective", false);

export default async function Pstart() {
  return <SiteStart />;
}
