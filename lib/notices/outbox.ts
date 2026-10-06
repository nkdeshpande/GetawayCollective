/**
 * THE OUTBOX — every message is written down before it is sent
 *
 * V2.0, 6 Oct 2026 · GC-08-DS-001, step 2.
 *
 * Until now a message was sent from inside the request that caused it and
 * then forgotten: nothing recorded what was said to whom, so nothing could
 * be retried, counted, or shown to the person later. The catalogue's sender
 * says as much about itself (lib/email/send.ts): "delivery is recorded, or
 * the send did not happen".
 *
 * So a message is now a ROW first (lib/events/schema.ts, notice_delivery):
 *
 *   dispatch()     write the row under a key that can exist only once, then
 *                  send it if it is due; record what happened
 *   deliverDue()   send whatever is queued and due: the retries, and
 *                  anything held back for quiet hours. Run by the clock
 *                  (app/api/cron/notices)
 *
 * ── NEVER TWICE (NR-16) ──────────────────────────────────────────────
 * The key is what the message is, what it is about and who it is for. The
 * database refuses a second row with the same key, so a trigger that fires
 * twice — a double submit, a webhook replayed — sends once.
 *
 * ── IT MUST NOT MAKE MAIL LESS RELIABLE THAN IT WAS ──────────────────
 * If the table cannot be reached (no database, or the migration not yet
 * applied), dispatch() sends the message directly, exactly as before, and
 * says so in its result. A new record-keeping layer that could lose a
 * receipt would be a worse system than the one it replaces.
 *
 * ── QUIET HOURS (NR-15) ARE PROPOSED, NOT RULED ──────────────────────
 * The specification proposes holding non-critical mail between 21:00 and
 * 08:00 India time (D-02, open with the founder). The arithmetic is here
 * and tested, and it applies to nothing yet: every message sent today
 * answers something the person just did, and an answer is never held.
 */
import { and, asc, eq, lte, lt } from "drizzle-orm";
import { noticeDelivery, noticePreference } from "../events/schema";
import { eventDb } from "../events/store";
import { sendLead } from "../leads";

export type Urgency = "low" | "normal" | "high" | "critical";

export interface Outgoing {
  /** What it is, what it is about, who it is for. One row can exist per key. */
  readonly key: string;
  /** The catalogue or specification id: N-03, N-23, O-01… */
  readonly noticeId: string;
  readonly to: string;
  readonly audience: "applicant" | "investor" | "member" | "office";
  readonly urgency: Urgency;
  readonly subject: string;
  readonly text: string;
  readonly html?: string;
  readonly replyTo?: string;
  /** An answer to something the person just did. Never held for quiet hours. */
  readonly transactional?: boolean;
}

export type DispatchResult =
  | { readonly outcome: "sent" | "queued" | "duplicate" | "failed" | "declined"; readonly recorded: true }
  | { readonly outcome: "sent" | "failed"; readonly recorded: false };

/** The key, built one way everywhere so the same message always collides with itself. */
export const dedupeKey = (noticeId: string, about: string, recipient: string): string =>
  `${noticeId}|${about}|${recipient.toLowerCase().trim()}`;

/* ── when a message is due ───────────────────────────────────────── */

const IST_OFFSET_MIN = 330;
const QUIET_FROM = 21, QUIET_UNTIL = 8;

/** The hour of the day in India, 0–23, for an instant. */
const istHour = (at: Date): number => new Date(at.getTime() + IST_OFFSET_MIN * 60_000).getUTCHours();

/**
 * When a message may go. Critical and transactional messages go at once.
 * Anything else that falls in quiet hours waits for 08:00 India time.
 */
export function dueFor(urgency: Urgency, transactional: boolean, now: Date): Date {
  if (urgency === "critical" || transactional) return now;
  const h = istHour(now);
  if (h < QUIET_FROM && h >= QUIET_UNTIL) return now;
  const ist = new Date(now.getTime() + IST_OFFSET_MIN * 60_000);
  const morning = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + (h >= QUIET_FROM ? 1 : 0), QUIET_UNTIL, 0, 0);
  return new Date(morning - IST_OFFSET_MIN * 60_000);
}

/** A failed send is tried again after 1, 5 and 30 minutes, and then not again. */
export const RETRY_AFTER_MIN = [1, 5, 30] as const;
export const MAX_ATTEMPTS = RETRY_AFTER_MIN.length + 1;
export function retryAt(attempts: number, now: Date): Date | null {
  const wait = RETRY_AFTER_MIN[attempts - 1];
  return wait === undefined ? null : new Date(now.getTime() + wait * 60_000);
}

/* ── what a person may switch off (NR-18) ────────────────────────── */

/** Required by the law or the agreement, or by security. No preference reaches these. */
export const MANDATORY: ReadonlySet<string> = new Set(["N-03", "N-05", "N-06", "N-09", "N-10", "N-11", "N-14", "N-20", "N-22", "N-26"]);

async function allowed(noticeId: string, to: string, audience: Outgoing["audience"]): Promise<boolean> {
  if (audience === "office" || MANDATORY.has(noticeId)) return true;
  const d = eventDb();
  if (!d) return true;
  const rows = await d.select().from(noticePreference)
    .where(and(eq(noticePreference.recipient, to.toLowerCase().trim()), eq(noticePreference.noticeClass, noticeId), eq(noticePreference.channel, "email")));
  return rows.length === 0 || rows[0].allowed;
}

/* ── sending, and writing down what happened ─────────────────────── */

async function send(o: Pick<Outgoing, "to" | "subject" | "text" | "html" | "replyTo">) {
  return sendLead({ to: o.to, subject: o.subject, text: o.text, html: o.html, replyTo: o.replyTo });
}

async function attempt(deliveryId: string, o: Pick<Outgoing, "to" | "subject" | "text" | "html" | "replyTo">, attemptsSoFar: number): Promise<"sent" | "queued" | "failed"> {
  const d = eventDb()!;
  const now = new Date();
  const r = await send(o);
  if (r.ok) {
    await d.update(noticeDelivery).set({ state: "sent", attempts: attemptsSoFar + 1, sentAt: now.toISOString(), lastError: null }).where(eq(noticeDelivery.deliveryId, deliveryId));
    return "sent";
  }
  const again = retryAt(attemptsSoFar + 1, now);
  await d.update(noticeDelivery).set({
    state: again ? "queued" : "failed", attempts: attemptsSoFar + 1,
    dueAt: (again ?? now).toISOString(), lastError: r.reason,
  }).where(eq(noticeDelivery.deliveryId, deliveryId));
  return again ? "queued" : "failed";
}

/** Write the message down, and send it if it is due. */
export async function dispatch(o: Outgoing, now: Date = new Date()): Promise<DispatchResult> {
  const direct = async (): Promise<DispatchResult> => ({ outcome: (await send(o)).ok ? "sent" : "failed", recorded: false });
  const d = eventDb();
  if (!d) return direct();
  let deliveryId: string;
  let due: Date;
  try {
    if (!(await allowed(o.noticeId, o.to, o.audience))) return { outcome: "declined", recorded: true };
    due = dueFor(o.urgency, !!o.transactional, now);
    const inserted = await d.insert(noticeDelivery).values({
      dedupeKey: o.key, noticeId: o.noticeId, recipient: o.to.toLowerCase().trim(), audience: o.audience,
      channel: "email", urgency: o.urgency, subject: o.subject, bodyText: o.text, bodyHtml: o.html ?? null,
      replyTo: o.replyTo ?? null, state: "queued", dueAt: due.toISOString(),
    }).onConflictDoNothing({ target: noticeDelivery.dedupeKey }).returning({ deliveryId: noticeDelivery.deliveryId });
    if (inserted.length === 0) return { outcome: "duplicate", recorded: true };
    deliveryId = inserted[0].deliveryId;
  } catch (err) {
    /* The table is not there, or not reachable. The message still goes. */
    console.error(`[outbox] could not record ${o.noticeId}; sending directly:`, err instanceof Error ? err.message : err);
    return direct();
  }
  if (due.getTime() > now.getTime()) return { outcome: "queued", recorded: true };
  try {
    return { outcome: await attempt(deliveryId, o, 0), recorded: true };
  } catch (err) {
    console.error(`[outbox] ${o.noticeId} was recorded but its send could not be written down:`, err instanceof Error ? err.message : err);
    return { outcome: "queued", recorded: true };
  }
}

export interface DeliverySummary { readonly due: number; readonly sent: number; readonly requeued: number; readonly failed: number }

/** Send what is queued and due. The retries, and anything that waited for morning. */
export async function deliverDue(limit = 25, now: Date = new Date()): Promise<DeliverySummary> {
  const d = eventDb();
  if (!d) return { due: 0, sent: 0, requeued: 0, failed: 0 };
  const rows = await d.select().from(noticeDelivery)
    .where(and(eq(noticeDelivery.state, "queued"), lte(noticeDelivery.dueAt, now.toISOString()), lt(noticeDelivery.attempts, MAX_ATTEMPTS)))
    .orderBy(asc(noticeDelivery.dueAt)).limit(limit);
  let sent = 0, requeued = 0, failed = 0;
  for (const r of rows) {
    const out = await attempt(r.deliveryId, { to: r.recipient, subject: r.subject, text: r.bodyText, html: r.bodyHtml ?? undefined, replyTo: r.replyTo ?? undefined }, r.attempts)
      .catch(() => "queued" as const);
    if (out === "sent") sent++; else if (out === "failed") failed++; else requeued++;
  }
  return { due: rows.length, sent, requeued, failed };
}
