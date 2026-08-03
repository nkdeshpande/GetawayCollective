/**
 * POST /api/signal — the transmission signup.
 *
 * ── WHY THIS RECORDS A CONTACT AND PUBLISHES NO EVENT ────────────────
 * An event needs an `actorId` — "every state change is attributable to an
 * authenticated identity (I-01)" — and an EventType that some declared
 * capability emits, which cap-lint enforces as E-01. A stranger filling a
 * public form has neither: no identity, and no right that could make the
 * act a capability.
 *
 * Manufacturing one would mean a sentinel actor and a capability with no
 * required right, which weakens both laws to record something neither was
 * written for. An inbound contact is a thing that happened TO the
 * platform, not an authorised act within it.
 *
 * So it lands in `inbound_contact` and becomes constitutional the moment
 * somebody with authority acts on it — qualifying, declining or linking
 * it to an Investor. That act has a real actor and a real command, and it
 * publishes a real event.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SignalLead, sendLead } from "@/lib/leads";
import { recordContact } from "@/lib/events/store";

export async function POST(req: Request) {
  /* G-10. Before the body is even read: a limited caller costs nothing. */
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = SignalLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  /* Recorded BEFORE the send. An address captured and not emailed is a
     lead somebody can still work; an address emailed and not captured is
     gone the moment the inbox is cleared. Failure here never blocks the
     person — recordContact returns false without a database rather than
     throwing, because a stranger should not meet a 500 over infrastructure
     that is not their concern. */
  const correlationId = crypto.randomUUID();
  await recordContact({
    email: parsed.data.email,
    source: "signal",
    correlationId,
  }).catch(() => false);

  const to = process.env.SIGNAL_LEAD_EMAIL ?? "signal@getawaycollective.co";
  const result = await sendLead({
    to,
    subject: "New Signal subscriber",
    text: `Email: ${parsed.data.email}`,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
