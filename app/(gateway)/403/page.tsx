/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /403
 * Access    public   (derived from vantage)
 * Assembly  AS-16 · Signal Lost
 * 
 */

import type { Metadata } from "next";
import { SystemSurface } from "@/app/_assemblies/systempages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/403", {}, "Not Permitted · Getaway Collective");

export default async function P403() {
  return <SystemSurface path="/403" />;
}
