/**
 * THE SITE'S STANDING NOTICE — one line, across every page, while it is true
 *
 * V2.0, 6 Oct 2026 · GC-08-DS-001, trigger S-10.
 *
 * For a condition that affects everyone and has an end: payments paused for
 * maintenance, sign-in links delayed. It is shown as the banner
 * (app/_assemblies/site/notify.ts) on every public page between `from` and
 * `until`, and at no other time. Leave it null when there is nothing to say,
 * which is nearly always.
 *
 * It is not for news, offers or reminders. A banner that is always there is
 * a banner nobody reads, and then the one that matters is not read either.
 *
 * Changing it is a change to the public surface: it ships like any other
 * commit, through the same checks.
 */
export interface SiteNotice {
  /** What is affected and until when, in one sentence. */
  readonly text: string;
  /** hazard: something is limited. critical: something a reader relies on is down. */
  readonly tone: "hazard" | "critical";
  /** ISO times. Outside them the notice does not show, whatever else is true. */
  readonly from: string;
  readonly until: string;
  /** One way forward, on this site: [label, path]. */
  readonly action?: readonly [string, string];
}

export const SITE_NOTICE: SiteNotice | null = null;

/** Whether a notice is in force at a given moment. An unreadable date is not in force. */
export function noticeStands(n: SiteNotice, now: Date): boolean {
  const from = Date.parse(n.from), until = Date.parse(n.until), t = now.getTime();
  return Number.isFinite(from) && Number.isFinite(until) && t >= from && t < until;
}
