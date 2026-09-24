/**
 * POST /api/deposit/verify — the browser's word that a deposit was paid.
 *
 * Checked against Razorpay's checkout signature (HMAC of order|payment with
 * the account secret) before anything is recorded; an unsigned claim is
 * refused. The webhook (./webhook) is the second, independent record, so a
 * closed tab after payment still reaches Investor Relations.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sendLead } from "@/lib/leads";
import { recordContact } from "@/lib/events/store";
import { DepositProof, checkoutSignatureValid, razorpayKeys } from "@/lib/deposit";

export async function POST(req: Request) {
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = DepositProof.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const { orderId, paymentId, signature } = parsed.data;
  if (!checkoutSignatureValid(orderId, paymentId, signature, keys.keySecret)) {
    return NextResponse.json({ ok: false, error: "signature" }, { status: 400 });
  }
  const email = typeof body?.email === "string" ? body.email.slice(0, 200) : "unknown@deposit";
  const vehicle = typeof body?.vehicle === "string" ? body.vehicle.slice(0, 64) : undefined;
  const reference = typeof body?.reference === "string" ? body.reference.slice(0, 64) : crypto.randomUUID();
  await recordContact({
    email, vehicleSlug: vehicle, correlationId: reference, source: "deposit-paid",
    note: `Order: ${orderId}\nPayment: ${paymentId}\nConfirmed by checkout signature`,
  }).catch(() => false);
  await sendLead({
    to: process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co",
    subject: `Deposit paid - ${vehicle ?? "vehicle not named"}`,
    text:
      `A holding deposit was paid and its checkout signature verified.\n\nEmail: ${email}\n` +
      `Vehicle: ${vehicle ?? "(not named)"}\nOrder: ${orderId}\nPayment: ${paymentId}\nReference: ${reference}\n\n` +
      "Reconcile against the Razorpay dashboard. The deposit buys nothing and makes nobody a partner; " +
      "the balance, KYC and the Vehicle Agreement continue offline.",
  }).catch(() => undefined);
  return NextResponse.json({ ok: true, reference });
}
