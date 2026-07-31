/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[property]/capital
 * Access    public   (derived from vantage)
 * Assembly  AS-03 · The Property Masthead
 * 
 */

import type { Metadata } from "next";
import { PropertyMasthead } from "@/app/_assemblies/gateway";
import { propertyBySlug } from "@/app/_assemblies/data";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Capital · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_property_capital(props: { params: Promise<{ property: string }> }) {
  const params = await props.params;
  const property = propertyBySlug(params.property);
  if (!property) notFound();
  return <PropertyMasthead p={property} />;
}
