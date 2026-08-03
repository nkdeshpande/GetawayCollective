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
import { SystemSurface } from "@/app/_assemblies/systempages";

export const metadata: Metadata = {
  title: "Verify · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pverify() {
  return <SystemSurface path="/verify" />;
}
