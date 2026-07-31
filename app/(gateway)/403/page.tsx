/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /403
 * Access    public   (derived from vantage)
 * Assembly  AS-16 · Signal Lost
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Not Permitted · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function P403() {
  return (
    <Surface
      path="/403"
      assembly={"AS-16"}
    />
  );
}
