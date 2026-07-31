/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    organization.register
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin").ok;
  return {
    title: reachable ? "Administration · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin() {
  return (
    <Surface
      path="/admin"
      assembly={null}
    />
  );
}
