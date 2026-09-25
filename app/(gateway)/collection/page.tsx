/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection
 * Access    public   (derived from vantage)
 * Assembly  AS-01 · The Gateway Grid
 * 
 */

import type { Metadata } from "next";
import { SiteCollection } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/collection", {}, "The Collection · Getaway Collective");

export default async function Pcollection() {
  return <SiteCollection />;
}
