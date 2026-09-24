/**
 * THE HOLDING DEPOSIT — taken online, everything after it offline
 *
 * Founder ruling, 24 Sep 2026: a flat ₹1,00,000 holds a position in an open
 * offering. It is paid online through Razorpay; the balance, KYC, the Vehicle
 * Agreement and the transfer of funds all complete off the platform, exactly
 * as content/public.ts step 04 already said they would.
 *
 * ── WHOSE MONEY, IN WHOSE ACCOUNT ────────────────────────────────────
 * Getaway Collective holds no investor capital (Terms, Part A). The
 * Razorpay account whose keys are configured here must therefore belong to
 * the VEHICLE — the LLP taking the deposit — never to the platform. The keys
 * are environment variables set by the founder in Vercel; nothing in this
 * repository holds or logs one.
 *
 * ── WHAT A DEPOSIT IS NOT ────────────────────────────────────────────
 * It buys nothing and makes nobody a partner. Settlement is when cleared
 * funds for the whole commitment reach the vehicle (the Member Law), not
 * this. So a paid deposit is recorded as an inbound contact with source
 * "deposit" and announced to Investor Relations; it creates no Investor, no
 * Commitment and no position. Somebody with authority does that, offline.
 *
 * ── THE AMOUNT IS THE REGISTER'S ─────────────────────────────────────
 * Read from constants/vehicles.ts on the server at the moment the order is
 * created. The browser names a vehicle and a unit count; it never names a
 * price, so no client can pay a different amount than the register states.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { vehicleBySlug, stanceFor, type Vehicle } from "../constants/vehicles";

export const DepositRequest = z.object({
  vehicle: z.string().trim().min(1).max(64),
  units: z.number().int().min(1).max(20),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().min(1).email(),
  phone: z.string().trim().min(8).max(20).regex(/^[+\d][\d\s-]+$/),
  city: z.string().trim().max(120).optional(),
  /** The person read the Risk Factors and the refund rule before paying. */
  acknowledged: z.literal(true),
});
export type DepositRequestInput = z.infer<typeof DepositRequest>;

export const DepositProof = z.object({
  orderId: z.string().trim().min(1).max(64),
  paymentId: z.string().trim().min(1).max(64),
  signature: z.string().trim().min(1).max(256),
});

/** Minor units (SCALE 4) to paise, for Razorpay. Integer arithmetic only. */
export const paiseOf = (minor: bigint): number => Number(minor / 100n);

export type Eligibility =
  | { ok: true; vehicle: Vehicle; amountPaise: number }
  | { ok: false; reason: "unknown-vehicle" | "not-open" | "no-deposit" | "too-many-units"; detail?: string };

/** Whether this vehicle can take a deposit for this many units, right now. */
export function eligibility(slug: string, units: number): Eligibility {
  const v = vehicleBySlug(slug);
  if (!v) return { ok: false, reason: "unknown-vehicle" };
  const stance = stanceFor(v);
  if (stance.kind !== "open") return { ok: false, reason: "not-open", detail: stance.because };
  if (v.offering.deposit === null) return { ok: false, reason: "no-deposit" };
  if (units > stance.unitsAvailable) return { ok: false, reason: "too-many-units", detail: `${stance.unitsAvailable} available` };
  return { ok: true, vehicle: v, amountPaise: paiseOf(v.offering.deposit) };
}

export interface RazorpayKeys { keyId: string; keySecret: string }

/** Null when the account is not configured — the flow says so rather than failing. */
export function razorpayKeys(): RazorpayKeys | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, keySecret } : null;
}

/** Razorpay's checkout signature: HMAC-SHA256 of "order_id|payment_id". */
export function checkoutSignatureValid(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

/** Razorpay's webhook signature: HMAC-SHA256 of the raw body. */
export function webhookSignatureValid(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8"), y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Create the order at Razorpay. The amount is the register's, never the caller's. */
export async function createOrder(keys: RazorpayKeys, opts: { amountPaise: number; receipt: string; notes: Record<string, string> }) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Basic " + Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString("base64"),
    },
    body: JSON.stringify({ amount: opts.amountPaise, currency: "INR", receipt: opts.receipt, notes: opts.notes }),
  });
  if (!res.ok) return null;
  const body = (await res.json().catch(() => null)) as { id?: string; amount?: number } | null;
  return body?.id ? { id: body.id, amount: body.amount ?? opts.amountPaise } : null;
}
