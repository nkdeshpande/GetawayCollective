/** POST /api/dossier — the intelligence-pack request on /communique/request. */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { DossierLead, sendLead } from "@/lib/leads";
/* Recorded, not published as an event. See the note in api/signal/route.ts:
   a stranger on a public form has no actorId and no right, so forcing the
   arrival through the capability machinery would weaken I-01 and E-01 to
   record something neither law was written for. */
import { recordContact } from "@/lib/events/store";
import { vehicleBySlug, stanceFor } from "@/constants/vehicles";

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
  const parsed = DossierLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { name, email, city, vehicle, note } = parsed.data;

  /* The stance is READ from the register, never taken from the request.
     A fully subscribed vehicle takes a waitlist; an open one takes an
     enquiry; and an unknown slug is simply not a vehicle, so it is
     recorded as a plain request rather than rejected — a stranger who
     mistypes a URL should still reach somebody. */
  const v = vehicle ? vehicleBySlug(vehicle) : undefined;
  const stance = v ? stanceFor(v) : undefined;
  const isWaitlist = stance?.kind === "waitlist";
  const subject = isWaitlist
    ? `Waitlist - ${v!.propertyName}`
    : v ? `Dossier request - ${v.propertyName}` : "Dossier request";

  const correlationId = crypto.randomUUID();
  await recordContact({
    email,
    name,
    note: [city ? `City: ${city}` : "", note ?? ""].filter(Boolean).join("\n") || undefined,
    source: isWaitlist ? "waitlist" : "dossier",
    correlationId,
  }).catch(() => false);

  const to = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  const result = await sendLead({
    to,
    subject,
    text:
      `Name: ${name}\nEmail: ${email}\nCity: ${city || "(not given)"}\n` +
      `Vehicle: ${v ? `${v.propertyName} (${v.slug})` : "(none named)"}\n` +
      `Stance: ${stance ? stance.kind : "(not a registered vehicle)"}` +
      (note ? `\n\nThey wrote:\n${note}` : "") +
      (isWaitlist
        ? "\n\nWAITLIST registration. No allocation exists and none is implied."
        : ""),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
