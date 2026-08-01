/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /member/documents/[id]
 * Access    member   (derived from vantage)
 * Assembly  AS-05 · The Member Console
 * 
 */

import type { Metadata } from "next";
import { Composed } from "@/app/_assemblies/compose";
import { canReach } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/member/documents/[id]").ok;
  return {
    title: reachable ? "Document · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Pmember_documents_id(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <Composed path="/member/documents/[id]" param={params.id} />;
}
