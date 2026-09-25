/**
 * ERROR ALERTS — somebody hears when the live site fails
 *
 * SERVER ONLY. 25 Sep 2026.
 *
 * Until today a failure on the live site went to a log nobody watched: no
 * monitoring provider, no alert, nothing that told anyone a partner had hit
 * an error page. This is the smallest thing that closes that gap without a
 * new account: every server failure (instrumentation.ts) and every page
 * that crashes in a browser (/api/client-error) is written as one line to
 * the deployment log and, at most once per kind of failure per half hour,
 * emailed through the Resend account the site already uses.
 *
 * Nothing personal travels. The message is cut to 300 characters and
 * anything shaped like an address, a PAN or a long number is replaced
 * before it reaches the log or the inbox; request bodies and query strings
 * are never read. An alert says where it broke and how, not whose it was.
 *
 * The throttle is per server instance. Two instances may each send one
 * alert for the same failure; that is the right side of the trade for a
 * signal whose whole job is to be noticed.
 */

import { sendLead } from "./leads";

export interface ErrorReport {
  readonly kind: "server" | "client";
  /** A method and path, or a page path. Never a query string. */
  readonly where: string;
  readonly message: string;
  readonly digest?: string;
}

const WINDOW_MS = 30 * 60 * 1000;
const PER_HOUR = 12;

/** Where alerts go: ALERT_EMAIL when set, else the inbox deposits already reach. */
const alertTo = () => process.env.ALERT_EMAIL ?? process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";

/** Out of every message before it is stored or sent. */
export function redact(s: string): string {
  return String(s ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[address]")
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, "[pan]")
    .replace(/\b\d{6,}\b/g, "[number]")
    .replace(/(token|key|secret|password|signature)=[^\s&]+/gi, "$1=[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

/** The same failure at the same place, however the numbers in it vary. */
export const fingerprint = (r: ErrorReport): string =>
  `${r.kind}|${r.where.replace(/\/[0-9a-f-]{8,}/gi, "/:id")}|${redact(r.message).replace(/\d+/g, "#").slice(0, 120)}`;

const g = globalThis as unknown as { __gcAlerts?: { last: Map<string, number>; hour: number[] } };
const state = () => (g.__gcAlerts ??= { last: new Map(), hour: [] });

/** Whether this report should become an email now. Records the send if so. */
export function shouldEmail(r: ErrorReport, now = Date.now()): boolean {
  const s = state();
  const key = fingerprint(r);
  const prev = s.last.get(key);
  s.hour = s.hour.filter((t) => now - t < 60 * 60 * 1000);
  if ((prev !== undefined && now - prev < WINDOW_MS) || s.hour.length >= PER_HOUR) return false;
  if (s.last.size > 500) s.last.clear();
  s.last.set(key, now);
  s.hour.push(now);
  return true;
}

export async function reportError(r: ErrorReport): Promise<void> {
  const clean: ErrorReport = { kind: r.kind, where: redact(r.where).slice(0, 200), message: redact(r.message), digest: r.digest?.slice(0, 40) };
  console.error(`[alert] ${JSON.stringify(clean)}`);
  if (!shouldEmail(clean)) return;
  await sendLead({
    to: alertTo(),
    subject: `[Getaway Collective] ${clean.kind === "server" ? "Server" : "Page"} error at ${clean.where}`.slice(0, 180),
    text: [
      `A ${clean.kind === "server" ? "request failed on the server" : "page crashed in a browser"}.`,
      "",
      `Where:   ${clean.where}`,
      `What:    ${clean.message || "(no message)"}`,
      ...(clean.digest ? [`Digest:  ${clean.digest}  (search the Vercel logs for it)`] : []),
      `When:    ${new Date().toISOString()}`,
      "",
      "Further reports of this same failure are held for 30 minutes. Personal details are removed before this is sent.",
    ].join("\n"),
  }).catch(() => undefined);
}
