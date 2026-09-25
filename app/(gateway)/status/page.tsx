/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /status
 * Access    public   (derived from vantage)
 * Assembly  AS-15 · System Status
 * 
 */

import type { Metadata } from "next";
import { SiteStatus } from "@/app/_assemblies/site/system";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/status", {}, "System Status · Getaway Collective");

export default async function Pstatus() {
  return <SiteStatus />;
}
