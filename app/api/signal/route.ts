/** POST /api/signal — the weekly transmission signup on the /signal page. */
import { NextResponse } from "next/server";
import { SignalLead, sendLead } from "@/lib/leads";

export async function POST(req: Request) {
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
