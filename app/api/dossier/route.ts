/** POST /api/dossier — the intelligence-pack request on /communique/request. */
import { NextResponse } from "next/server";
import { DossierLead, sendLead } from "@/lib/leads";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = DossierLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { name, email, city } = parsed.data;
  const to = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.in";
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
