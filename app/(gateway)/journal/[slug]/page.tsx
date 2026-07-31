/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /journal/[slug]
 * Access    public   (derived from vantage)
 * Assembly  AS-30 · The Journal
 * 
 */

import type { Metadata } from "next";
import { JournalEntry } from "@/app/_assemblies/documents";

export const metadata: Metadata = {
  title: "Journal Entry · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Pjournal_slug(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <JournalEntry slug={params.slug} />;
}
