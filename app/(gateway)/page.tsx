/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /
 * Access    public   (derived from vantage)
 * Assembly  AS-23 · The Hero Viewport
 * 
 */

import type { Metadata } from "next";
import { Home } from "@/app/_assemblies/gateway";

export const metadata: Metadata = {
  title: "Home · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function P() {
  return <Home />;
}
