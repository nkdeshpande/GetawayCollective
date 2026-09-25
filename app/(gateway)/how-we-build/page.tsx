/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /how-we-build
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteText } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/how-we-build", {}, "How We Build · Getaway Collective");

export default async function Phow_we_build() {
  return <SiteText path="/how-we-build" />;
}
