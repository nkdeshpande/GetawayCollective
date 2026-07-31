/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /gallery
 * Access    public   (derived from vantage)
 * Assembly  AS-09 · The Gallery Frame
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Gallery · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pgallery() {
  return (
    <Surface
      path="/gallery"
      assembly={"AS-09"}
    />
  );
}
