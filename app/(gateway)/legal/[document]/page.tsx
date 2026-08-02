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
import { StandingDocBySlug } from "@/app/_assemblies/documents";

export const metadata: Metadata = {
  title: "Legal Document · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Plegal_document(props: { params: Promise<{ document: string }> }) {
  const params = await props.params;
  return <StandingDocBySlug document={params.document} />;
}
