/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /about
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { About } from "@/app/_assemblies/about";

export const metadata: Metadata = {
  title: "About · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pabout() {
  return <About />;
}
