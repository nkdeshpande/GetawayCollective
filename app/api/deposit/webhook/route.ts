/**
 * POST /api/deposit/webhook — Razorpay's own record of a captured payment.
 *
 * The independent path: it does not depend on the payer's browser staying
 * open. Verified against RAZORPAY_WEBHOOK_SECRET over the raw body; anything
 * unsigned is refused. Configure it in the Razorpay dashboard for the event
 * payment.captured (and, since 15 Oct 2026, refund.processed), pointing at https://www.getawaycollective.co/api/deposit/webhook (the bare domain answers 308, and a webhook sender need not follow it).
 */
import { NextResponse } from "next/server";
import { dedupeKey, dispatch } from "@/lib/notices/outbox";
import { recordContact } from "@/lib/events/store";
import { webhookSignatureValid } from "@/lib/deposit";
import { depositRows } from "@/lib/events/store";
import { holdsFrom } from "@/lib/holds";
import { vehicleBySlug } from "@/constants/vehicles";
import { publicName } from "@/app/_assemblies/site/registry";
import { renderForSend } from "@/lib/email/send";
import { SPECIMEN_CONTEXT } from "@/content/notifications";

/**
 * refund.processed (15 Oct 2026): the deposit went back to the payer. The
 * refund is written against the hold's reference, which ends the hold and
 * offers its units again (lib/holds.ts), and the payer is told (N-20) at
 * the address on the opened order. Only a full refund of a paid hold ends
 * it; anything else goes to the desk to reconcile by hand.
 */
async function refunded(evt: Captured) {
  const rf = evt.payload?.refund?.entity ?? {};
  const pay = evt.payload?.payment?.entity ?? {};
  const paymentId = rf.payment_id ?? pay.id ?? "";
  const holds = holdsFrom(await depositRows().catch(() => []));
  const hold = holds.find((h) => (pay.notes?.reference && h.reference === pay.notes.reference) || (paymentId && h.paymentId === paymentId));
  const desk = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  const full = !!hold && typeof rf.amount === "number" && typeof pay.amount === "number" ? rf.amount >= pay.amount : !!hold && rf.amount === undefined;
  if (!hold || hold.status !== "paid" || !full) {
    await dispatch({
      key: dedupeKey("O-08", `refund:${rf.id ?? paymentId}`, desk), noticeId: "O-08", to: desk,
      audience: "office", urgency: "critical", transactional: true,
      subject: "Refund to reconcile by hand",
      text: `Razorpay reports a refund that does not end a paid hold on its own.\n\nRefund: ${rf.id ?? "?"}\nPayment: ${paymentId || "?"}\n` +
        `Amount: ${rf.amount ?? "?"} paise of ${pay.amount ?? "?"}\nHold found: ${hold ? `${hold.reference} (${hold.status})` : "no"}\n\nNothing was changed on the site.`,
    }).catch(() => undefined);
    return NextResponse.json({ ok: true, reconcile: true });
  }
  await recordContact({
    email: hold.email, vehicleSlug: hold.vehicleSlug ?? undefined, correlationId: hold.reference, source: "deposit-refunded",
    note: `Refund: ${rf.id ?? "?"}\nPayment: ${paymentId}\nAmount: ${rf.amount ?? "?"}`,
  }).catch(() => false);
  const v = hold.vehicleSlug ? vehicleBySlug(hold.vehicleSlug) : undefined;
  if (v) {
    const mail = renderForSend("N-20", { ...SPECIMEN_CONTEXT, hold: { estate: publicName(v), slug: v.slug, payee: v.registeredName, units: hold.units, payment: paymentId, reference: hold.reference } });
    if (mail.ok) await dispatch({
      key: dedupeKey("N-20", hold.reference, hold.email), noticeId: "N-20", to: hold.email,
      audience: mail.audience, urgency: mail.urgency, transactional: true,
      subject: mail.subject, text: mail.text, html: mail.html, replyTo: mail.replyTo,
    }).catch(() => undefined);
  }
  await dispatch({
    key: dedupeKey("O-08", `refund:${rf.id ?? paymentId}`, desk), noticeId: "O-08", to: desk,
    audience: "office", urgency: "high", transactional: true,
    subject: `Deposit refunded - ${v?.propertyName ?? hold.vehicleSlug ?? "estate not named"}`,
    text: `A holding deposit was refunded in full and its hold has ended.\n\nReference: ${hold.reference}\nUnits released: ${hold.units}\nPayment: ${paymentId}\nRefund: ${rf.id ?? "?"}`,
  }).catch(() => undefined);
  return NextResponse.json({ ok: true, refunded: hold.reference });
}

interface Captured {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; amount?: number; email?: string; notes?: Record<string, string> } };
    refund?: { entity?: { id?: string; payment_id?: string; amount?: number; status?: string } };
  };
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
  if (evt.event === "refund.processed") return refunded(evt);
  if (evt.event !== "payment.captured") return NextResponse.json({ ok: true, ignored: evt.event ?? "unknown" });

  const p = evt.payload?.payment?.entity ?? {};
  const notes = p.notes ?? {};
  const amount = `₹${((p.amount ?? 0) / 100).toLocaleString("en-IN")}`;
  await recordContact({
    email: (notes.email || p.email || "unknown@deposit").slice(0, 200), name: notes.name,
    vehicleSlug: notes.vehicle, correlationId: notes.reference || p.id || crypto.randomUUID(), source: "deposit-captured",
    note: `Payment: ${p.id}\nOrder: ${p.order_id}\nAmount: ${amount}\nUnits: ${notes.units ?? "?"}`,
  }).catch(() => false);
  const desk = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  await dispatch({
    /* O-01 (GC-08-DS-001), keyed on the payment: Razorpay may deliver one event more than once. */
    key: dedupeKey("O-01", `captured:${p.id ?? notes.reference ?? "unknown"}`, desk), noticeId: "O-01", to: desk,
    audience: "office", urgency: "high", transactional: true,
    subject: `Deposit captured - ${notes.vehicle ?? "vehicle not named"}`,
    text:
      `Razorpay reports a captured holding deposit.\n\nName: ${notes.name ?? "?"}\nEmail: ${notes.email ?? p.email ?? "?"}\n` +
      `Vehicle: ${notes.vehicle ?? "?"}\nUnits: ${notes.units ?? "?"}\nAmount: ${amount}\nPayment: ${p.id}\n` +
      `Order: ${p.order_id}\nReference: ${notes.reference ?? "?"}`,
  }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
