/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /roles
 * Access    public   (derived from vantage)
 * Assembly  AS-18 · Recruitment
 * 
 */

import type { Metadata } from "next";
import { Roles } from "@/app/_assemblies/gatewaypages";

export const metadata: Metadata = {
  title: "Open Roles · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Proles() {
  return <Roles />;
}
