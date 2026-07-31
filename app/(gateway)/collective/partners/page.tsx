/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collective/partners
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { Partners } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "The Foundation · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollective_partners() {
  return <Partners />;
}
