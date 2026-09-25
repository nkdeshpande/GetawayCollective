/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office-workspace-preview
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { OfficeSurface } from "@/app/_assemblies/officepages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/office-workspace-preview", {}, "Office Workspace Preview · Getaway Collective");

export default async function Poffice_workspace_preview() {
  return <OfficeSurface path="/office-workspace-preview" />;
}
