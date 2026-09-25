/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]
 * Access    public   (derived from vantage)
 * Assembly  AS-03 · The Property Masthead
 * 
 */

import type { Metadata } from "next";
import { SiteEstate } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ vehicle: string }> },
): Promise<Metadata> {
  return pageMeta("/collection/[vehicle]", await props.params, "Opportunity · Getaway Collective");
}

export default async function Pcollection_vehicle(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteEstate slug={params.vehicle} />;
}
