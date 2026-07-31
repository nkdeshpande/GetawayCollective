/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /answers
 * Access    public   (derived from vantage)
 * Assembly  AS-17 · The Knowledge Base
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Answers · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Panswers() {
  return (
    <Surface
      path="/answers"
      assembly={"AS-17"}
    />
  );
}
