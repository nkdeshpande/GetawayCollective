/**
 * INSTRUMENTATION — Next.js calls onRequestError for every failed request
 *
 * 25 Sep 2026. The server half of the error alerts (lib/alerts.ts). Only
 * the path is passed on, never the query string, which can carry a
 * sign-in token. Alerts are emailed from the Node runtime only; a failure
 * in the edge middleware is logged, since the mail client does not run
 * there.
 */
import type { Instrumentation } from "next";

export function register() {}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const e = err as { message?: string; digest?: string };
  const where = `${request.method} ${request.path.split("?")[0]} (${context.routeType})`;
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    console.error(`[alert] edge ${where}: ${String(e?.message ?? err).slice(0, 200)}`);
    return;
  }
  const { reportError } = await import("./lib/alerts");
  await reportError({ kind: "server", where, message: String(e?.message ?? err), digest: e?.digest });
};
