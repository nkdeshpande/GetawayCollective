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

import { Surface } from "@/app/_system/surface";

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <Surface path="/500" assembly={"AS-16"} />
      <div className="surface" style={{ paddingTop: 0 }}>
        <button className="btn primary" onClick={reset}>Try again</button>
      </div>
    </>
  );
}
