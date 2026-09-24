/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /contact
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteText } from "@/app/_assemblies/site/pages";

export const metadata: Metadata = {
  title: "Contact · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcontact() {
  return <SiteText path="/contact" />;
}
