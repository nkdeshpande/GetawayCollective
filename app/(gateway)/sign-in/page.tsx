/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /sign-in
 * Access    public   (derived from vantage)
 * Assembly  AS-32 · The Public Surface
 * 
 */

import type { Metadata } from "next";
import { SiteSignIn } from "@/app/_assemblies/site/identity";
import { pageMeta } from "@/app/_system/meta";

export const metadata: Metadata = pageMeta("/sign-in", {}, "Sign In · Getaway Collective", false);

export default async function Psign_in() {
  return <SiteSignIn />;
}
