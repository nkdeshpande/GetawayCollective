/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /verify
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteVerify } from "@/app/_assemblies/site/identity";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/verify", {}, "Verify · Getaway Collective");

export default async function Pverify() {
  return <SiteVerify />;
}
