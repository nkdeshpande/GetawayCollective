/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /home
 * Access    member   (derived from vantage)
 * Assembly  AS-33 · The Member Surface
 * 
 */

import type { Metadata } from "next";
import { PartnerSurface } from "@/app/_assemblies/partner";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/home", await currentSubject()).ok;
  return {
    title: reachable ? "Member Home · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Phome() {
  return <PartnerSurface path="/home" />;
}
