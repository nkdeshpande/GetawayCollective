/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/settings/notifications
 * Access    member   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/settings/notifications").ok;
  return {
    title: reachable ? "Notification Settings · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_settings_notifications() {
  return (
    <Surface
      path="/member/settings/notifications"
      assembly={null}
    />
  );
}
