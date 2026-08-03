/**
 * THE PERSISTENT EVENT LOG
 *
 * SERVER ONLY.
 *
 * `EventLog` in lib/events.ts is an in-memory array and remains exactly
 * that — it is the right thing for a test, where a fold should see only
 * the events the test wrote. This is its durable sibling, and it takes
 * the same envelope through the same `validateEvent()` so a row can never
 * exist that the in-memory log would have refused.
 *
 * ── APPEND-ONLY, AND IDEMPOTENT ──────────────────────────────────────
 * `append()` writes once and does nothing on a repeat. That is not
 * defensive tidiness: a retried request, a double-submitted form or a
 * replayed webhook must not produce two facts from one act. The eventId
 * is supplied by the caller and is the idempotency key, which is why
 * lib/events.ts calls it permanent and never reused.
 *
 * ── IT DEGRADES TO SILENCE, NOT TO FAILURE ───────────────────────────
 * With no DATABASE_URL, `append()` returns false rather than throwing.
 * The public lead forms publish events, and a person filling in their
 * address should not see a 500 because the platform has no database
 * configured yet. The caller decides whether losing the event matters;
 * for a consequential command it will, and that command must check the
 * return value rather than assume.
 */

import { and, desc, eq, or, sql as raw } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eventLog, inboundContact } from "./schema";
import { validateEvent } from "../events";
import type { EventEnvelope } from "../events";

const g = globalThis as unknown as {
  __gcEventSql?: ReturnType<typeof postgres>;
  __gcEventDb?: ReturnType<typeof drizzle>;
};

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!g.__gcEventDb) {
    g.__gcEventSql ??= postgres(url, { max: 5, prepare: false });
    g.__gcEventDb = drizzle(g.__gcEventSql);
  }
  return g.__gcEventDb;
}

/**
 * Append one event. Returns whether it was durably stored.
 *
 * Validated BEFORE the write, so an envelope missing an actor, a causing
 * command or a decision's reason is refused here exactly as it would be
 * refused in memory. A store that accepted what the domain rejects would
 * make the log the weakest link in E-02 rather than its record.
 */
export async function appendEvent(e: EventEnvelope): Promise<boolean> {
  validateEvent(e);

  const d = db();
  if (!d) return false;

  await d
    .insert(eventLog)
    .values({
      eventId: e.eventId,
      type: e.type,
      occurredAt: e.occurredAt,
      actorId: e.actorId,
      objectType: e.objectType,
      objectId: e.objectId,
      causedByCommand: e.causedByCommand,
      correlationId: e.correlationId,
      reason: e.reason ?? null,
      payload: e.payload as Record<string, unknown>,
    })
    /* Idempotent. One act, one fact, however many times it is retried. */
    .onConflictDoNothing({ target: eventLog.eventId });

  return true;
}

/** Every event touching one object, oldest first — the shape a fold wants. */
export async function eventsForObject(
  objectType: string,
  objectId: string,
): Promise<EventEnvelope[]> {
  const d = db();
  if (!d) return [];
  const rows = await d
    .select()
    .from(eventLog)
    .where(and(eq(eventLog.objectType, objectType), eq(eventLog.objectId, objectId)))
    .orderBy(eventLog.occurredAt);
  return rows.map(toEnvelope);
}

/**
 * Every event where this identity acted OR was the subject.
 *
 * Both directions matter for a relationship. "They asked us something" and
 * "we sent them something" are the same conversation, and a log filtered
 * only by actor shows one side of it.
 */
export async function eventsForIdentity(identityId: string): Promise<EventEnvelope[]> {
  const d = db();
  if (!d) return [];
  const rows = await d
    .select()
    .from(eventLog)
    .where(or(eq(eventLog.actorId, identityId), eq(eventLog.objectId, identityId)))
    .orderBy(eventLog.occurredAt);
  return rows.map(toEnvelope);
}

/** Everything from one command invocation. What an audit reads. */
export async function eventsForCorrelation(correlationId: string): Promise<EventEnvelope[]> {
  const d = db();
  if (!d) return [];
  const rows = await d
    .select()
    .from(eventLog)
    .where(eq(eventLog.correlationId, correlationId))
    .orderBy(eventLog.occurredAt);
  return rows.map(toEnvelope);
}

/* ── Inbound contacts ─────────────────────────────────────────────── */

export interface InboundContactInput {
  email: string;
  name?: string;
  note?: string;
  /** "signal" · "dossier" · "iris" */
  source: string;
  vehicleSlug?: string;
  correlationId: string;
}

/**
 * Record an inbound contact.
 *
 * Deliberately does NOT create an Investor. A person who filled a public
 * form is not yet one, and manufacturing the ratified object that carries
 * `member_state` from an unverified address would put a stranger inside
 * the institutional record. Somebody with authority links them later, and
 * that linking is itself an act with an event.
 */
export async function recordContact(c: InboundContactInput): Promise<boolean> {
  const d = db();
  if (!d) return false;
  await d.insert(inboundContact).values({
    email: c.email.toLowerCase().trim(),
    name: c.name ?? null,
    note: c.note ?? null,
    source: c.source,
    vehicleSlug: c.vehicleSlug ?? null,
    correlationId: c.correlationId,
  });
  return true;
}

export interface ContactRow {
  contactId: string;
  email: string;
  name: string | null;
  note: string | null;
  source: string;
  vehicleSlug: string | null;
  investorId: string | null;
  receivedAt: string;
  correlationId: string;
}

/** Newest first — the order a desk works through them. */
export async function recentContacts(limit = 100): Promise<ContactRow[]> {
  const d = db();
  if (!d) return [];
  return (await d
    .select()
    .from(inboundContact)
    .orderBy(desc(inboundContact.receivedAt))
    .limit(limit)) as ContactRow[];
}

/** Every contact from one address. One person can arrive more than once. */
export async function contactsByEmail(email: string): Promise<ContactRow[]> {
  const d = db();
  if (!d) return [];
  return (await d
    .select()
    .from(inboundContact)
    .where(eq(inboundContact.email, email.toLowerCase().trim()))
    .orderBy(desc(inboundContact.receivedAt))) as ContactRow[];
}

/** How many distinct addresses have arrived. For the desk's header. */
export async function contactCount(): Promise<number> {
  const d = db();
  if (!d) return 0;
  const [r] = await d
    .select({ n: raw<number>`count(distinct ${inboundContact.email})::int` })
    .from(inboundContact);
  return r?.n ?? 0;
}

function toEnvelope(r: typeof eventLog.$inferSelect): EventEnvelope {
  return {
    eventId: r.eventId,
    type: r.type as EventEnvelope["type"],
    occurredAt: r.occurredAt,
    actorId: r.actorId,
    objectType: r.objectType as EventEnvelope["objectType"],
    objectId: r.objectId,
    causedByCommand: r.causedByCommand,
    correlationId: r.correlationId,
    reason: r.reason ?? undefined,
    payload: (r.payload ?? {}) as Record<string, unknown>,
  };
}
