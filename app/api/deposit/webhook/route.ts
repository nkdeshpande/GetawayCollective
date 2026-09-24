/**
 * POST /api/deposit/webhook — Razorpay's own record of a captured payment.
 *
 * The independent path: it does not depend on the payer's browser staying
 * open. Verified against RAZORPAY_WEBHOOK_SECRET over the raw body; anything
 * unsigned is refused. Configure it in the Razorpay dashboard for the event
 * payment.captured, pointing at https://getawaycollective.co/api/deposit/webhook.
 */
import { NextResponse } from "next/server";
import { sendLead } from "@/lib/leads";
import { recordContact } from "@/lib/events/store";
import { webhookSignatureValid } from "@/lib/deposit";

interface Captured {
  event?: string;
  payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; email?: string; notes?: Record<string, string> } } };
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!sig || !webhookSignatureValid(raw, sig, secret)) {
    return NextResponse.json({ ok: false, error: "signature" }, { status: 400 });
  }
  let evt: Captured;
  try { evt = JSON.parse(raw) as Captured; } catch { return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 }); }
  if (evt.event !== "payment.captured") return NextResponse.json({ ok: true, ignored: evt.event ?? "unknown" });

  const p = evt.payload?.payment?.entity ?? {};
  const notes = p.notes ?? {};
  const amount = `₹${((p.amount ?? 0) / 100).toLocaleString("en-IN")}`;
  await recordContact({
    email: (notes.email || p.email || "unknown@deposit").slice(0, 200), name: notes.name,
    vehicleSlug: notes.vehicle, correlationId: notes.reference || p.id || crypto.randomUUID(), source: "deposit-captured",
    note: `Payment: ${p.id}\nOrder: ${p.order_id}\nAmount: ${amount}\nUnits: ${notes.units ?? "?"}`,
  }).catch(() => false);
  await sendLead({
    to: process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co",
    subject: `Deposit captured - ${notes.vehicle ?? "vehicle not named"}`,
    text:
      `Razorpay reports a captured holding deposit.\n\nName: ${notes.name ?? "?"}\nEmail: ${notes.email ?? p.email ?? "?"}\n` +
      `Vehicle: ${notes.vehicle ?? "?"}\nUnits: ${notes.units ?? "?"}\nAmount: ${amount}\nPayment: ${p.id}\n` +
      `Order: ${p.order_id}\nReference: ${notes.reference ?? "?"}`,
  }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
