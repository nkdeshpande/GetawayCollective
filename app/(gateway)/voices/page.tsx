/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /voices
 * Access    public   (derived from vantage)
 * Assembly  AS-24 · Testimonials
 * 
 */

import type { Metadata } from "next";
import { Testimonials } from "@/app/_assemblies/gateway";

export const metadata: Metadata = {
  title: "Voices · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pvoices() {
  return <Testimonials />;
}
