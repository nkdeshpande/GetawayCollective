/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /portfolio
 * Access    public   (derived from vantage)
 * Assembly  AS-07 · The Portfolio Narrative
 * 
 */

import type { Metadata } from "next";
import { Portfolio } from "@/app/_assemblies/gatewaypages";

export const metadata: Metadata = {
  title: "The Portfolio · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pportfolio() {
  return <Portfolio />;
}
