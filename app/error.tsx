/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route      /500
 * Convention error.tsx — Next.js owns this path; it is not a page.
 * Assembly   AS-16 · Signal Lost
 * 
 */

"use client";

import { SiteError } from "@/app/_assemblies/site/lost";
import { useReportError } from "@/app/_system/report";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useReportError(error);
  return <SiteError reset={reset} />;
}
