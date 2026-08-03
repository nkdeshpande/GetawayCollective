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

export const metadata: Metadata = {
  title: "Member Workspace Preview · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pmember_workspace_preview() {
  return <MemberSurface path="/member-workspace-preview" />;
}
