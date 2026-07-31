/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection
 * Access    public   (derived from vantage)
 * Assembly  AS-01 · The Gateway Grid
 * 
 */

import type { Metadata } from "next";
import { GatewayGrid } from "@/app/_assemblies/gateway";

export const metadata: Metadata = {
  title: "The Collection · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection() {
  return <GatewayGrid />;
}
