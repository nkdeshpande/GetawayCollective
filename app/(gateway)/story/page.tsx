/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /story
 * Access    public   (derived from vantage)
 * Assembly  AS-08 · The Story Playback
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Story · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pstory() {
  return (
    <Surface
      path="/story"
      assembly={"AS-08"}
    />
  );
}
