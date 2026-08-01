/** POST /api/signal — the weekly transmission signup on the /signal page. */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SignalLead, sendLead } from "@/lib/leads";

export async function POST(req: Request) {
  /* G-10. Before the body is even read: a limited caller costs nothing. */
  const rl = rateLimit(clientKey(req));
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
