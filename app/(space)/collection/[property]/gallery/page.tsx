/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[property]/gallery
 * Access    public   (derived from vantage)
 * Assembly  AS-10 · The Gallery Strip
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";

export const metadata: Metadata = {
  title: "Gallery · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_property_gallery(props: { params: Promise<{ property: string }> }) {
  const params = await props.params;
  return <Composed path="/collection/[property]/gallery" param={params.property} />;
}
