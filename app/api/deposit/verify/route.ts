/**
 * POST /api/deposit/verify — the browser's word that a deposit was paid.
 *
 * Checked against Razorpay's checkout signature (HMAC of order|payment with
 * the account secret) before anything is recorded; an unsigned claim is
 * refused. The webhook (./webhook) is the second, independent record, so a
 * closed tab after payment still reaches Investor Relations.
 *
 * V2.0, 6 Oct 2026: the proof is also bound to the order this site opened.
 * The reference names an intent row; the order id in that row must be the
 * order that was paid. The estate, the units and the address are then read
 * from that row, never from the browser, so a valid payment cannot be
 * attached to somebody else's hold or to a different estate. The
 * payer is sent a receipt with a link to the hold's status.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { dedupeKey, dispatch } from "@/lib/notices/outbox";
import { renderForSend } from "@/lib/email/send";
import { SPECIMEN_CONTEXT } from "@/content/notifications";
import { recordContact, depositRowsByReference } from "@/lib/events/store";
import { DepositProof, checkoutSignatureValid, razorpayKeys } from "@/lib/deposit";
import { holdsFrom } from "@/lib/holds";
import { vehicleBySlug } from "@/constants/vehicles";


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

  const claimed = typeof body?.reference === "string" ? body.reference.slice(0, 64) : "";
  const rows = claimed ? await depositRowsByReference(claimed).catch(() => []) : [];
  const known = holdsFrom(rows)[0];
  /* The intent is the authority where it can be read. A reference whose
     order is not the one paid is refused the binding, not the payment: the
     money is real, so it is recorded under its own reference for the desk. */
  const bound = !!known && known.orderId === orderId;
  const reference = bound ? known.reference : crypto.randomUUID();
  const email = bound ? known.email : typeof body?.email === "string" ? body.email.slice(0, 200) : "unknown@deposit";
  const vehicle = bound ? known.vehicleSlug ?? undefined : typeof body?.vehicle === "string" ? body.vehicle.slice(0, 64) : undefined;
  const units = bound ? known.units : 0;
  /* A second call with the same proof records nothing and sends nothing. */
  if (bound && known.status === "paid") return NextResponse.json({ ok: true, reference });

  await recordContact({
    email, vehicleSlug: vehicle, correlationId: reference, source: "deposit-paid",
    note:
      `Order: ${orderId}\nPayment: ${paymentId}${units ? `\nUnits: ${units}` : ""}\nConfirmed by checkout signature` +
      (bound ? "" : "\nNot matched to an order opened on the site: reconcile by hand"),
  }).catch(() => false);
  const desk = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  await dispatch({
    /* O-02 where the payment matched no order: the desk must reconcile it. */
    key: dedupeKey(bound ? "O-01" : "O-02", paymentId, desk), noticeId: bound ? "O-01" : "O-02", to: desk,
    audience: "office", urgency: bound ? "high" : "critical", transactional: true,
    subject: `Deposit paid - ${vehicle ?? "vehicle not named"}`,
    text:
      `A holding deposit was paid and its checkout signature verified.\n\nEmail: ${email}\n` +
      `Vehicle: ${vehicle ?? "(not named)"}\nUnits: ${units || "?"}\nOrder: ${orderId}\nPayment: ${paymentId}\nReference: ${reference}\n` +
      (bound ? "" : "\nThis payment could not be matched to an order opened on the site. Reconcile it by hand.\n") +
      "\nReconcile against the Razorpay dashboard. The deposit buys nothing and makes nobody a partner; " +
      "the balance, KYC and the Vehicle Agreement continue offline.",
  }).catch(() => undefined);

  /* The payer's own receipt, sent only to the address on the opened order. */
  const v = vehicle ? vehicleBySlug(vehicle) : undefined;
  if (bound && v) {
    /* N-03, the payer's receipt, in the catalogue's words (content/notifications.ts).
       One for each reference, however often the proof arrives. */
    const receipt = renderForSend("N-03", {
      ...SPECIMEN_CONTEXT,
      hold: { estate: v.propertyName, slug: v.slug, payee: v.registeredName, units: Number(units) || 1, payment: paymentId, reference },
    });
    if (receipt.ok) {
      await dispatch({
        key: dedupeKey("N-03", reference, email), noticeId: "N-03", to: email,
        audience: receipt.audience, urgency: receipt.urgency, transactional: true,
        subject: receipt.subject, text: receipt.text, html: receipt.html, replyTo: receipt.replyTo,
      }).catch(() => undefined);
    }
  }
  return NextResponse.json({ ok: true, reference });
}
