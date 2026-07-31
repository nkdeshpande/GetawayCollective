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
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Gallery · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_property_gallery(props: { params: Promise<{ property: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/collection/[property]/gallery"
      assembly={"AS-10"}
      params={params}
    />
  );
}
