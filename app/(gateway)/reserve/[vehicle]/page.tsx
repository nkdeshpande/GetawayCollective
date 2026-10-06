/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /reserve/[vehicle]
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteReserve } from "@/app/_assemblies/site/reserve";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ vehicle: string }> },
): Promise<Metadata> {
  return pageMeta("/reserve/[vehicle]", await props.params, "Reserve · Getaway Collective", false);
}

export default async function Preserve_vehicle(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return <SiteReserve vehicle={params.vehicle} />;
}
