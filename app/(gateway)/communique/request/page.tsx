/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /communique/request
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { Dossier } from "@/app/_assemblies/publicpages";

export const metadata: Metadata = {
  title: "Request the Dossier · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pcommunique_request() {
  return <Dossier />;
}
