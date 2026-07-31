/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /space
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { Space } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "Space · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pspace() {
  return <Space />;
}
