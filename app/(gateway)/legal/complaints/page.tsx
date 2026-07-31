/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal/complaints
 * Access    public   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Complaints Procedure · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal_complaints() {
  return (
    <Surface
      path="/legal/complaints"
      assembly={null}
    />
  );
}
