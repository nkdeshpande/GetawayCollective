/**
 * POST /api/deposit — open a holding deposit for an open offering.
 *
 * Founder ruling, 24 Sep 2026: a flat ₹1,00,000, paid online, holds a
 * position; everything after it completes offline. See lib/deposit.ts for
 * why the amount is read here rather than sent by the browser, and why the
 * Razorpay account must be the vehicle's.
 *
 * Records the intent as an inbound contact (source "deposit-intent") the
 * same way /api/dossier records an enquiry, for the reason /api/signal
 * gives: a stranger has no actor, so nothing here is an event yet.
 *
 * When the account is not configured it says so (503 not-configured) and
 * still records the request, so a person who wanted to pay is never lost.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sendLead } from "@/lib/leads";
import { recordContact } from "@/lib/events/store";
import { DepositRequest, createOrder, eligibility, razorpayKeys } from "@/lib/deposit";

export async function POST(req: Request) {
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }
  const parsed = DepositRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const d = parsed.data;

  const e = eligibility(d.vehicle, d.units);
  if (!e.ok) return NextResponse.json({ ok: false, error: e.reason, detail: e.detail }, { status: 409 });
  const v = e.vehicle;

  const correlationId = crypto.randomUUID();
  const summary =
    `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCity: ${d.city || "(not given)"}\n` +
    `Vehicle: ${v.propertyName} (${v.slug}) · ${v.registeredName}\nUnits: ${d.units}\n` +
    `Deposit: ₹${(e.amountPaise / 100).toLocaleString("en-IN")} · reference ${correlationId}`;

  const keys = razorpayKeys();
  const order = keys
    ? await createOrder(keys, {
        amountPaise: e.amountPaise,
        receipt: correlationId.slice(0, 40),
        notes: { vehicle: v.slug, units: String(d.units), email: d.email, name: d.name.slice(0, 200), reference: correlationId },
      })
    : null;

  await recordContact({
    email: d.email, name: d.name, vehicleSlug: v.slug, correlationId,
    source: "deposit-intent",
    note: `Phone: ${d.phone}\nUnits: ${d.units}${d.city ? `\nCity: ${d.city}` : ""}${order ? `\nOrder: ${order.id}` : "\nOnline deposit not configured"}`,
  }).catch(() => false);

  if (!order) {
    await sendLead({
      to: process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co",
      subject: `Deposit requested (online payment unavailable) - ${v.propertyName}`,
      text: summary + "\n\nThe online deposit could not be opened, so no payment was taken. Send payment details.",
    }).catch(() => undefined);
    return NextResponse.json({ ok: false, error: "not-configured", reference: correlationId }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    reference: correlationId,
    order: { id: order.id, amount: order.amount, currency: "INR" },
    keyId: keys!.keyId,
    payee: v.registeredName,
    description: `Holding deposit · ${v.propertyName} · ${d.units} unit${d.units === 1 ? "" : "s"}`,
    prefill: { name: d.name, email: d.email, contact: d.phone },
  });
}
