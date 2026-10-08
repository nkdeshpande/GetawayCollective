/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /notices
 * Access    identified   (override — see constants/routes.ts)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteNotices } from "@/app/_assemblies/site/notices";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/notices", await currentSubject()).ok;
  return {
    title: reachable ? "Notices · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pnotices() {
  return <SiteNotices />;
}
