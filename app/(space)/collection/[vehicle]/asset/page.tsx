/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/asset
 * Access    public   (derived from vantage)
 * Assembly  AS-03 · The Property Masthead
 * 
 */

import type { Metadata } from "next";
import { ChapterSurface } from "@/app/_assemblies/propertychapters";

export const metadata: Metadata = {
  title: "The Asset · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_asset(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <ChapterSurface path="/collection/[vehicle]/asset" param={params.vehicle} />;
}
