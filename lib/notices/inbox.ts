/**
 * THE INBOX — what a signed-in person was sent, read from the outbox
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001, step 3.
 *
 * The outbox (./outbox.ts) writes every message down before it is sent.
 * This reads those rows back for the address a person has signed in with,
 * so a notice exists in their account whether or not the mail arrived.
 *
 * ── WHOSE ROWS ───────────────────────────────────────────────────────
 * A sign-in link proves an address, and the rows are matched on that
 * address and nothing else. Mail to the desk (audience "office") is never
 * shown here, even to somebody who signs in with the desk's address: the
 * desk's list belongs in the Office.
 *
 * ── WHAT CAN BE SWITCHED OFF (NR-18) ─────────────────────────────────
 * Only a notice that is live, goes by email, is not the desk's and is not
 * mandatory. Today that is two: updates on identity checks, and the
 * acknowledgement of an enquiry. The
 * list is derived from the catalogue, so it grows as notices are switched
 * on and never offers a choice about one that does not exist.
 */
import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";
import { NOTICES } from "../../content/notifications";
import { noticeDelivery, noticePreference } from "../events/schema";
import { eventDb } from "../events/store";
import { MANDATORY } from "./outbox";

export interface InboxItem {
  readonly id: string;
  readonly noticeId: string;
  readonly subject: string;
  readonly text: string;
  readonly state: "queued" | "sent" | "failed";
  readonly at: string;
  readonly unread: boolean;
}

export interface Choice { readonly noticeId: string; readonly label: string; readonly allowed: boolean }

const norm = (address: string) => address.toLowerCase().trim();
const mine = (address: string) => and(eq(noticeDelivery.recipient, norm(address)), ne(noticeDelivery.audience, "office"));

/** In a person's words, where the catalogue's event name is the desk's. */
const LABELS: Readonly<Record<string, string>> = {
  "N-21": "Updates when your identity checks are reviewed",
  "N-26": "A notice when your payment account is recorded",
  "N-23": "An acknowledgement when you enquire or join a waitlist",
};

/** The notices a person may decline, from the catalogue. */
export function optionalNotices(): readonly { noticeId: string; label: string }[] {
  return NOTICES
    .filter((n) => n.wired && n.channels.includes("email") && n.audience !== "office" && !MANDATORY.has(n.id))
    .map((n) => ({ noticeId: n.id, label: LABELS[n.id] ?? n.event }));
}

export const isOptional = (noticeId: string): boolean => optionalNotices().some((o) => o.noticeId === noticeId);

/** How a delivery reads to the person it was for. */
export function stateLabel(state: string): string {
  return state === "sent" ? "Sent by email" : state === "failed" ? "Could not be delivered by email; it is kept here" : "Being sent";
}

/** A moment, as India reads it: 6 Oct 2026, 14:02. */
export function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(d).reduce<Record<string, string>>((a, x) => ({ ...a, [x.type]: x.value }), {});
  return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute}`;
}

/** Newest first. Empty where there is no database, or no table yet. */
export async function inboxFor(address: string, limit = 50): Promise<readonly InboxItem[]> {
  const d = eventDb();
  if (!d) return [];
  const rows = await d.select().from(noticeDelivery).where(mine(address)).orderBy(desc(noticeDelivery.createdAt)).limit(limit);
  return rows.map((r) => ({
    id: r.deliveryId, noticeId: r.noticeId, subject: r.subject, text: r.bodyText,
    state: (r.state === "sent" || r.state === "failed" ? r.state : "queued") as InboxItem["state"],
    at: r.sentAt ?? r.createdAt, unread: r.readAt === null,
  }));
}

export async function unreadFor(address: string): Promise<number> {
  const d = eventDb();
  if (!d) return 0;
  const rows = await d.select({ n: sql<number>`count(*)::int` }).from(noticeDelivery).where(and(mine(address), isNull(noticeDelivery.readAt)));
  return rows[0]?.n ?? 0;
}

/** Everything unread becomes read, as of now. Returns how many. */
export async function markRead(address: string, now: Date = new Date()): Promise<number> {
  const d = eventDb();
  if (!d) return 0;
  const rows = await d.update(noticeDelivery).set({ readAt: now.toISOString() })
    .where(and(mine(address), isNull(noticeDelivery.readAt))).returning({ id: noticeDelivery.deliveryId });
  return rows.length;
}

/** Each optional notice, and whether this person still receives it. No row means yes. */
export async function choicesFor(address: string): Promise<readonly Choice[]> {
  const options = optionalNotices();
  const d = eventDb();
  const rows = d ? await d.select().from(noticePreference).where(and(eq(noticePreference.recipient, norm(address)), eq(noticePreference.channel, "email"))) : [];
  return options.map((o) => ({ ...o, allowed: rows.find((r) => r.noticeClass === o.noticeId)?.allowed ?? true }));
}

/** Record a choice. A mandatory or unknown notice is refused, not ignored. */
export async function setChoice(address: string, noticeId: string, allowed: boolean, now: Date = new Date()): Promise<"saved" | "not-optional" | "unavailable"> {
  if (!isOptional(noticeId)) return "not-optional";
  const d = eventDb();
  if (!d) return "unavailable";
  await d.insert(noticePreference)
    .values({ recipient: norm(address), noticeClass: noticeId, channel: "email", allowed, updatedAt: now.toISOString() })
    .onConflictDoUpdate({ target: [noticePreference.recipient, noticePreference.noticeClass, noticePreference.channel], set: { allowed, updatedAt: now.toISOString() } });
  return "saved";
}

/* ── the view from the Office: every delivery, whoever it was for ──── */

export interface DeliveryLine {
  readonly id: string;
  readonly noticeId: string;
  readonly recipient: string;
  readonly audience: string;
  readonly subject: string;
  readonly state: "queued" | "sent" | "failed";
  readonly attempts: number;
  readonly lastError: string | null;
  readonly at: string;
  readonly read: boolean;
}

/**
 * The most recent deliveries, for /office/notices (GC-08-DS-001, O-07). The
 * subject and the address, never the body: the desk needs to see that a
 * message went or failed, not to re-read what a person was told.
 */
export async function deliveryLog(limit = 200): Promise<readonly DeliveryLine[]> {
  const d = eventDb();
  if (!d) return [];
  const rows = await d.select().from(noticeDelivery).orderBy(desc(noticeDelivery.createdAt)).limit(limit);
  return rows.map((r) => ({
    id: r.deliveryId, noticeId: r.noticeId, recipient: r.recipient, audience: r.audience, subject: r.subject,
    state: (r.state === "sent" || r.state === "failed" ? r.state : "queued") as DeliveryLine["state"],
    attempts: r.attempts, lastError: r.lastError, at: r.sentAt ?? r.createdAt, read: r.readAt !== null,
  }));
}

/** How many of each state, for the head of the page. */
export function tally(lines: readonly DeliveryLine[]): { sent: number; queued: number; failed: number } {
  const n = { sent: 0, queued: 0, failed: 0 };
  for (const l of lines) n[l.state]++;
  return n;
}
