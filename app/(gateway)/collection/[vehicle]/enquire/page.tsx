/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/enquire
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteChapter } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ vehicle: string }> },
): Promise<Metadata> {
  return pageMeta("/collection/[vehicle]/enquire", await props.params, "Enquire · Getaway Collective");
}

export default async function Pcollection_vehicle_enquire(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteChapter path="/collection/[vehicle]/enquire" param={params.vehicle} />;
}
