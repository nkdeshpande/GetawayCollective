/**
 * POST /api/office/property — RegisterProperty, wired.
 *
 * ── WHY THIS ROUTE EXISTS ────────────────────────────────────────────
 * The capability layer has been complete and tested for a long time and
 * nothing called it. Thirty-five commands, an authority model governing
 * them, an event store underneath — and no page or route invoked
 * `execute()` even once. A command layer nothing calls is a library, not a
 * system, and every document describing its governance was describing
 * something unreachable.
 *
 * This is one capability wired from a form to a durable row. It is
 * deliberately the least consequential real one: vehicle-scoped, no reason
 * required, no conflict gate, one event. If the stack carries this, the
 * next capability is a copy of this file with a different name in it.
 *
 * ── WHAT IT DOES NOT DO ──────────────────────────────────────────────
 * It does not check the right itself. `execute()` runs the whole envelope —
 * authenticate, authorise, reason, conflict, handler, emit, audit — and a
 * second check here would be a second place to get it wrong, and the place
 * somebody would eventually update instead of the first.
 *
 * It also does not decide the scope. RegisterProperty is vehicle-scoped, so
 * a grant covering one vehicle cannot register a property in another. That
 * is `covers()` in lib/authority.ts, not a condition written here.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { grantsFor } from "@/lib/auth/grants";
import { execute } from "@/lib/commands";
import { EventLog } from "@/lib/events";
import { SessionAudit } from "@/lib/authority";
import { appendEvent } from "@/lib/events/store";
import { VEHICLES } from "@/constants/vehicles";

const Body = z.object({
  /* Constrained to vehicles that exist. A free-text id would let a typo
     create a property against a vehicle nobody can ever look at. */
  vehicleId: z.string().refine((v) => VEHICLES.some((x) => x.slug === v), "unknown vehicle"),
  propertyId: z.string().trim().min(3).max(64).regex(/^[a-z0-9-]+$/, "lowercase, digits and hyphens"),
  label: z.string().trim().min(3).max(120),
});

export async function POST(req: Request) {
  const session = await auth().catch(() => null);
  const identityId = session?.user?.id ?? null; // vocab-lint-ignore — Auth.js field name

  /* I-01 answered before the body is read. An unidentified caller costs
     nothing and learns nothing about what the payload should look like. */
  if (!identityId) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" },
      { status: 400 },
    );
  }
  const { vehicleId, propertyId, label } = parsed.data;

  const log = new EventLog();
  const audit = new SessionAudit();
  const now = new Date().toISOString();
  /* The audit wants an open session to record against. This one covers a
     single request, which is what a stateless route actually has. */
  const sessionId = `req-${propertyId}-${now}`;
  audit.open(sessionId, identityId, now);

  const result = execute(
    "RegisterProperty",
    {
      identityId,
      sessionId,
      vehicleId,
      grants: await grantsFor(identityId),
      correlationId: `register-property-${propertyId}`,
      now,
    },
    log,
    audit,
    (emit) => {
      emit("PropertyRegistered", propertyId, { vehicleId, label });
      return { propertyId };
    },
  );

  if (!result.ok) {
    /* The envelope's refusal text is written for the person reading it and
       names the law it rests on. Replacing it with "forbidden" would throw
       away the only part of the denial that helps anybody. */
    return NextResponse.json({ ok: false, error: result.error }, { status: 403 });
  }

  /* Durability is reported, never assumed. `appendEvent` returns false when
     DATABASE_URL is absent, and a caller told "ok" over an in-memory log
     that vanished at the end of the request would have no way to find out. */
  const stored = await Promise.all(result.events.map(appendEvent));
  const durable = stored.every(Boolean);

  return NextResponse.json({
    ok: true,
    durable,
    events: result.events.map((e) => ({ eventId: e.eventId, type: e.type, occurredAt: e.occurredAt })),
    ...(durable ? {} : { warning: "Accepted, but no event store is configured — this was not persisted." }),
  });
}
