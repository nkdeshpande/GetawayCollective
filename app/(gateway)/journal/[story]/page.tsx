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
import { SiteJournalEntry } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ story: string }> },
): Promise<Metadata> {
  return pageMeta("/journal/[story]", await props.params, "Story · Getaway Collective");
}

export default async function Pjournal_story(props: { params: Promise<{ story: string }> }) {
  const params = await props.params;
  return <SiteJournalEntry slug={params.story} />;
}
