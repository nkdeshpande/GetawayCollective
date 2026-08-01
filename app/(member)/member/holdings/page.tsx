/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/holdings
 * Access    public   (derived from vantage)
 * Assembly  AS-10 · The Gallery Strip
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";

export const metadata: Metadata = {
  title: "Holdings · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pmember_holdings() {
  return <Composed path="/member/holdings" />;
}
