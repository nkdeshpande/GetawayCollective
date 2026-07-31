/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /how-it-works
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { HowItWorks } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "How It Works · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Phow_it_works() {
  return <HowItWorks />;
}
