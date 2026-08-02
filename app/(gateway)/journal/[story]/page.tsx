/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /journal/[story]
 * Access    public   (derived from vantage)
 * Assembly  AS-30 · The Journal
 * 
 */

import type { Metadata } from "next";
import { JournalEntry } from "@/app/_assemblies/documents";

export const metadata: Metadata = {
  title: "Story · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pjournal_story(props: { params: Promise<{ story: string }> }) {
  const params = await props.params;
  return <JournalEntry slug={params.story} />;
}
