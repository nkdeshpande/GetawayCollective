/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /collective/gallery
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { Evidence } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "The Evidence Portfolio · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcollective_gallery() {
  return <Evidence />;
}
