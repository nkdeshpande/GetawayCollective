/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal
 * Access    public   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Legal · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal() {
  return (
    <Surface
      path="/legal"
      assembly={null}
    />
  );
}
