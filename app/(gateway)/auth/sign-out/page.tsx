/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /auth/sign-out
 * Access    public   (derived from vantage)
 * Assembly  none — shell only
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Sign Out · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pauth_sign_out() {
  return (
    <Surface
      path="/auth/sign-out"
      assembly={null}
    />
  );
}
