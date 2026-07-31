/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /flow/commit
 * Access    public   (override — see constants/routes.ts)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Commit } from "@/app/_assemblies/flow";

export const metadata: Metadata = {
  title: "Commit · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pflow_commit() {
  return <Commit />;
}
