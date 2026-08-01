/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /auth/verify
 * Access    public   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";

export const metadata: Metadata = {
  title: "Verify · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pauth_verify() {
  return <Composed path="/auth/verify" />;
}
