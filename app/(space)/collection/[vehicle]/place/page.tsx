/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/place
 * Access    public   (derived from vantage)
 * Assembly  AS-12 · Location Intelligence
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "The Place · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_place(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/collection/[vehicle]/place"
      assembly={"AS-12"}
      params={params}
    />
  );
}
