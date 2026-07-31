/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /admin/media
 * Access    office   (derived from vantage)
 * Assembly  AS-34 · The Admin Surface
 * Rights    media.manage
 * 
 */

import type { Metadata } from "next";
import { MediaAdmin } from "@/app/_assemblies/adminpages";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/admin/media").ok;
  return {
    title: reachable ? "Media · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Padmin_media() {
  return <MediaAdmin />;
}
