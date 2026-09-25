/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /legal/[document]
 * Access    public   (derived from vantage)
 * Assembly  AS-29 · The Standing Document
 * 
 */

import type { Metadata } from "next";
import { SiteLegalDoc } from "@/app/_assemblies/site/pages";
import { pageMeta } from "@/app/_system/meta";

export async function generateMetadata(
  props: { params: Promise<{ document: string }> },
): Promise<Metadata> {
  return pageMeta("/legal/[document]", await props.params, "Legal Document · Getaway Collective");
}

export default async function Plegal_document(props: { params: Promise<{ document: string }> }) {
  const params = await props.params;
  return <SiteLegalDoc document={params.document} />;
}
