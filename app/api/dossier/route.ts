/** POST /api/dossier — the intelligence-pack request on /communique/request. */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { DossierLead, sendLead } from "@/lib/leads";
/* Recorded, not published as an event. See the note in api/signal/route.ts:
   a stranger on a public form has no actorId and no right, so forcing the
   arrival through the capability machinery would weaken I-01 and E-01 to
   record something neither law was written for. */
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
  const parsed = DossierLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { name, email, city } = parsed.data;

  const correlationId = crypto.randomUUID();
  await recordContact({
    email,
    name,
    note: city ? `City: ${city}` : undefined,
    source: "dossier",
    correlationId,
  }).catch(() => false);

  const to = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  const result = await sendLead({
    to,
    subject: "Dossier request",
    text: `Name: ${name}\nEmail: ${email}\nCity: ${city || "(not given)"}`,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
