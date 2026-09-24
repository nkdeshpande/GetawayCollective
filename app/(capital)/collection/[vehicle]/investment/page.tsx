/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/investment
 * Access    public   (override — see constants/routes.ts)
 * Assembly  AS-04 · The Capital Explainer
 * 
 */

import type { Metadata } from "next";
import { SiteChapter } from "@/app/_assemblies/site/pages";

export const metadata: Metadata = {
  title: "The Investment · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_investment(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteChapter path="/collection/[vehicle]/investment" param={params.vehicle} />;
}
