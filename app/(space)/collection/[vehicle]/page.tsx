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
import { siteTitle } from "@/app/_assemblies/site/pages";

export async function generateMetadata(
  props: { params: Promise<{ vehicle: string }> },
): Promise<Metadata> {
  const params = await props.params;
  const name = siteTitle(params.vehicle);
  return {
    title: name ?? "Opportunity · Getaway Collective",
    robots: { index: true, follow: true },
  };
}

export default async function Pcollection_vehicle(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteEstate slug={params.vehicle} />;
}
