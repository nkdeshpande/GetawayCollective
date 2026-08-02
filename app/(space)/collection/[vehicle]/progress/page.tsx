/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collection/[vehicle]/progress
 * Access    public   (override — see constants/routes.ts)
 * Assembly  AS-11 · The Stage Progression
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Progress · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_progress(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/collection/[vehicle]/progress"
      assembly={"AS-11"}
      params={params}
    />
  );
}
