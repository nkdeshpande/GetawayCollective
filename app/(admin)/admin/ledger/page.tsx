/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/ledger
 * Access    office   (derived from vantage)
 * Assembly  none — shell only
 * Rights    capital.deploy
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/ledger").ok;
  return {
    title: reachable ? "Ledger · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_ledger() {
  return (
    <Surface
      path="/admin/ledger"
      assembly={null}
    />
  );
}
