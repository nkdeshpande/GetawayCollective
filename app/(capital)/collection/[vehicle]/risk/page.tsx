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
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Risk · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollection_vehicle_risk(props: { params: Promise<{ vehicle: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/collection/[vehicle]/risk"
      assembly={"AS-14"}
      params={params}
    />
  );
}
