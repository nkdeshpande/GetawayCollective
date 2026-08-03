/**
 * THE EVENT STORE — append-only, and deliberately outside the UFR
 *
 * ── WHY THIS TABLE DID NOT EXIST ─────────────────────────────────────
 * `EventLog` in lib/events.ts is an in-memory array. Every capability
 * dutifully published its event, into a list that died with the request.
 * E-01 held — commands did emit — but nothing could ever be read back,
 * so no projection could be folded, no relationship reconstructed and no
 * audit answered. The spine existed and had no vertebrae.
 *
 * ── WHY IT IS NOT A BUSINESS OBJECT ──────────────────────────────────
 * The v5 L2 Lifecycle Alignment sheet rules on exactly this:
 *
 *   "Task / notice / activity — capability/event artifact, not L2 object.
 *    Must publish an event against a named object and governed command."
 *
 * So an event is not a twenty-eighth object. It is the record OF acts on
 * the twenty-seven, and it lives here beside the auth tables for the same
 * reason those do: infrastructure that the Unified Field Registry was not
 * written to govern. `generated/db-schema.ts` stays generated and stays
 * exactly the ratified objects.
 *
 * ── APPEND-ONLY IS ENFORCED, NOT REQUESTED ───────────────────────────
 * There is no updated_at, no soft-delete flag and no revision column,
 * because none of those can exist on a record that is never edited. An
 * event is superseded by a later event, never amended. The absence of the
 * columns is the enforcement — a schema that cannot express a correction
 * cannot receive one by accident.
 */

import {
  pgTable, text, timestamp, jsonb, index, uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * One row per published event. Mirrors `EventEnvelope` field for field.
 *
 * Every column is NOT NULL except `reason`, which is mandatory only for
 * the decision events listed in lib/events.ts — a constraint the database
 * cannot express conditionally, so `validateEvent()` holds it and this
 * table records the outcome.
 */
export const eventLog = pgTable(
  "event_log",
  {
    /** Permanent, never reused. Supplied by the caller, not the database. */
    eventId: text("event_id").primaryKey(),
    type: text("type").notNull(),
    /** When the fact occurred. Not when the row was written. */
    occurredAt: timestamp("occurred_at", { mode: "string", withTimezone: true }).notNull(),
    /** The authenticated identity responsible. Never null (I-01). */
    actorId: text("actor_id").notNull(),
    objectType: text("object_type").notNull(),
    objectId: text("object_id").notNull(),
    /** With actorId, this is what makes E-02 answerable (E-02). */
    causedByCommand: text("caused_by_command").notNull(),
    /** Groups every event produced by one command invocation. */
    correlationId: text("correlation_id").notNull(),
    /** Required for decision events. See DECISION_EVENTS in lib/events.ts. */
    reason: text("reason"),
    payload: jsonb("payload").notNull(),
    /** When the row landed. Distinct from occurredAt, and only ever for
        diagnosing a late or replayed write. Never used as the fact's time. */
    recordedAt: timestamp("recorded_at", { mode: "string", withTimezone: true })
      .notNull().defaultNow(),
  },
  (t) => ({
    /* The three reads that exist. A projection folds by object, a
       relationship folds by actor, and an audit folds by correlation. */
    byObject: index("event_log_object_idx").on(t.objectType, t.objectId, t.occurredAt),
    byActor: index("event_log_actor_idx").on(t.actorId, t.occurredAt),
    byCorrelation: index("event_log_correlation_idx").on(t.correlationId),
    /* Belt and braces on the primary key: a replayed append must collide
       rather than duplicate a fact. */
    idOnce: uniqueIndex("event_log_event_id_key").on(t.eventId),
  }),
);

/**
 * INBOUND CONTACT — the first turn of the flywheel
 *
 * A person who fills a public form is not yet an Investor. Creating one
 * would put an unqualified stranger into the ratified object that carries
 * `member_state`, and the L2 sheet is explicit that there is one Investor
 * identity before and after settlement — not one that starts as a guess.
 *
 * So an inbound contact is recorded here, against nothing, until somebody
 * with authority decides it is a person worth qualifying. At that point it
 * is linked to an Investor and the link is itself an event.
 *
 * This is the only table in the system that holds a personal detail with
 * no institutional record behind it, which is why it carries its own
 * disclosure class and its own retention question.
 */
export const inboundContact = pgTable(
  "inbound_contact",
  {
    contactId: text("contact_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    name: text("name"),
    /** Free text the person supplied. Never interpreted, only stored. */
    note: text("note"),
    /** Which surface took it: "signal", "dossier", "iris". */
    source: text("source").notNull(),
    /** The vehicle they were looking at, when the surface knew one. */
    vehicleSlug: text("vehicle_slug"),
    /** Set once someone qualifies them. Until then the contact stands alone. */
    investorId: text("investor_id"),
    receivedAt: timestamp("received_at", { mode: "string", withTimezone: true })
      .notNull().defaultNow(),
    /** The correlationId of the event that recorded this arrival, so the
        contact and its event are joinable in both directions. */
    correlationId: text("correlation_id").notNull(),
  },
  (t) => ({
    byEmail: index("inbound_contact_email_idx").on(t.email),
    byReceived: index("inbound_contact_received_idx").on(t.receivedAt),
  }),
);
