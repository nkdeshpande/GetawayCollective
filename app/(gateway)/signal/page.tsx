/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /signal
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { Signal } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "The Signal · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Psignal() {
  return <Signal />;
}
