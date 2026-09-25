/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member-workspace-preview
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { MemberSurface } from "@/app/_assemblies/memberpages";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/member-workspace-preview", {}, "Member Workspace Preview · Getaway Collective", false);

export default async function Pmember_workspace_preview() {
  return <MemberSurface path="/member-workspace-preview" />;
}
