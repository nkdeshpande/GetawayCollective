/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/risk
 * Access    public   (override — see constants/routes.ts)
 * Assembly  AS-14 · The Risk Disclosure
 * 
 */

import type { Metadata } from "next";
import { SiteChapter } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ vehicle: string }> },
): Promise<Metadata> {
  return pageMeta("/collection/[vehicle]/risk", await props.params, "Risk · Getaway Collective");
}

export default async function Pcollection_vehicle_risk(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteChapter path="/collection/[vehicle]/risk" param={params.vehicle} />;
}
