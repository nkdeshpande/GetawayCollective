/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /maintenance
 * Access    public   (derived from vantage)
 * Assembly  AS-15 · System Status
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";

export const metadata: Metadata = {
  title: "Maintenance · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pmaintenance() {
  return <Composed path="/maintenance" />;
}
