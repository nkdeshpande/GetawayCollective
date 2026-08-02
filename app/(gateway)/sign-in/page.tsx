/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /sign-in
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SystemSurface } from "@/app/_assemblies/systempages";

export const metadata: Metadata = {
  title: "Sign In · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Psign_in() {
  return <SystemSurface path="/sign-in" />;
}
