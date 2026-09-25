"use client";

/**
 * The error page's report. 25 Sep 2026 (lib/alerts.ts).
 *
 * Sends only failures that happened in the browser. A server failure
 * arrives here with a digest and has already been reported by
 * instrumentation.ts; sending it again would double every alert. The
 * path goes without its query string, and the message is cut short; the
 * server redacts it again before anyone sees it.
 */
import { useEffect } from "react";

export function useReportError(error: Error & { digest?: string }) {
  useEffect(() => {
    if (error?.digest) return;
    try {
      void fetch("/api/client-error", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: window.location.pathname.slice(0, 200), message: String(error?.message ?? "").slice(0, 300) }),
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      /* Reporting never adds a second failure to the first. */
    }
  }, [error]);
}
