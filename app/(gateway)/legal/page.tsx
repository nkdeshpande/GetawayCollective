/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal
 * Access    public   (derived from vantage)
 * Assembly  AS-29 · The Standing Document
 * 
 */

import type { Metadata } from "next";
import { SiteLegalIndex } from "@/app/_assemblies/site/pages";

export const metadata: Metadata = {
  title: "Legal · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal() {
  return <SiteLegalIndex />;
}
