/**
 * The holding deposit, asserted.
 *
 * Founder ruling, 24 Sep 2026: a flat ₹1,00,000 holds a position in an open
 * offering, paid online through Razorpay. These pin the parts that must not
 * drift: the amount comes from the register and nowhere else, only an open
 * offering can take one, and nothing is recorded on an unsigned claim.
 */
import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { VEHICLES, stanceFor } from "../constants/vehicles";
import { DepositRequest, checkoutSignatureValid, eligibility, paiseOf, webhookSignatureValid } from "../lib/deposit";

describe("the amount is the register's", () => {
  it("is ₹1,00,000 at every estate", () => {
    for (const v of VEHICLES) expect(v.offering.deposit, v.key).toBe(100000_0000n);
  });

  it("converts minor units to paise without floating point", () => {
    expect(paiseOf(100000_0000n)).toBe(10_000_000);
  });

  it("never takes a price from the browser", () => {
    const shape = Object.keys(DepositRequest.shape);
    expect(shape).not.toContain("amount");
    expect(shape).not.toContain("price");
  });
});

describe("only an open offering takes a deposit", () => {
  it("opens for every open vehicle, at the register's amount", () => {
    for (const v of VEHICLES.filter((x) => stanceFor(x).kind === "open")) {
      const e = eligibility(v.slug, 1);
      expect(e.ok, v.key).toBe(true);
      if (e.ok) expect(e.amountPaise).toBe(paiseOf(v.offering.deposit!));
    }
  });

  it("refuses a vehicle that is subscribed, forming or unknown", () => {
    for (const v of VEHICLES.filter((x) => stanceFor(x).kind !== "open")) {
      expect(eligibility(v.slug, 1).ok, v.key).toBe(false);
    }
    expect(eligibility("no-such-estate", 1)).toEqual({ ok: false, reason: "unknown-vehicle" });
  });

  it("refuses more units than remain", () => {
    const open = VEHICLES.find((x) => stanceFor(x).kind === "open");
    if (!open) return;
    const e = eligibility(open.slug, open.offering.available + 1);
    expect(e.ok).toBe(false);
  });

  it("requires the risk acknowledgement", () => {
    const base = { vehicle: "coorg-coffee-creek", units: 1, name: "A", email: "a@b.co", phone: "+91 98450 00000" };
    expect(DepositRequest.safeParse(base).success).toBe(false);
    expect(DepositRequest.safeParse({ ...base, acknowledged: true }).success).toBe(true);
  });
});

describe("nothing is recorded on an unsigned claim", () => {
  const secret = "test-secret";
  it("accepts Razorpay's checkout signature and nothing else", () => {
    const sig = createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
    expect(checkoutSignatureValid("order_1", "pay_1", sig, secret)).toBe(true);
    expect(checkoutSignatureValid("order_1", "pay_2", sig, secret)).toBe(false);
    expect(checkoutSignatureValid("order_1", "pay_1", "0".repeat(64), secret)).toBe(false);
  });

  it("verifies the webhook over the raw body", () => {
    const raw = JSON.stringify({ event: "payment.captured" });
    const sig = createHmac("sha256", secret).update(raw).digest("hex");
    expect(webhookSignatureValid(raw, sig, secret)).toBe(true);
    expect(webhookSignatureValid(raw + " ", sig, secret)).toBe(false);
  });
});
