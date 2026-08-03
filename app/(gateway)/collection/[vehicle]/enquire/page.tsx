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
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Enquire · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_enquire(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/collection/[vehicle]/enquire"
      assembly={"AS-32"}
      params={params}
    />
  );
}
