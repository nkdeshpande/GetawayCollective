/**
 * HOLDS — a held slot is the deposit rows, read together
 *
 * V2.0, 6 Oct 2026. lib/holds.ts keeps no state of its own, so these
 * hold it to the three things a payer and the next visitor depend on: a
 * payment is what makes a slot held, a unit is never counted twice, and the
 * status that anyone holding a reference can read gives away no address.
 */
import { describe, it, expect } from "vitest";
import { heldUnits, maskEmail, nightsFor, holdsFrom, type DepositRow } from "../lib/holds";

const row = (source: string, correlationId: string, note: string, at: string, vehicleSlug = "coorg-coffee-creek", email = "asha@example.com"): DepositRow =>
  ({ source, correlationId, note, receivedAt: at, vehicleSlug, email });

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";

describe("one hold for each reference", () => {
  it("reads an opened order as opened, with its units and its order", () => {
    const [r] = holdsFrom([row("deposit-intent", A, "Phone: 98\nUnits: 2\nOrder: order_1", "2026-10-06T10:00:00Z")]);
    expect(r).toMatchObject({ reference: A, status: "opened", units: 2, orderId: "order_1", paidAt: null });
  });

  it("reads it as paid once the signature is verified, and keeps the units from the order", () => {
    const [r] = holdsFrom([
      row("deposit-paid", A, "Order: order_1\nPayment: pay_1", "2026-10-06T10:02:00Z"),
      row("deposit-intent", A, "Phone: 98\nUnits: 2\nOrder: order_1", "2026-10-06T10:00:00Z"),
    ]);
    expect(r).toMatchObject({ status: "paid", units: 2, paymentId: "pay_1", openedAt: "2026-10-06T10:00:00Z", paidAt: "2026-10-06T10:02:00Z" });
  });

  it("counts the checkout proof and the webhook as one payment, not two", () => {
    const rs = holdsFrom([
      row("deposit-intent", A, "Units: 1\nOrder: order_1", "2026-10-06T10:00:00Z"),
      row("deposit-paid", A, "Order: order_1\nPayment: pay_1\nUnits: 1", "2026-10-06T10:02:00Z"),
      row("deposit-captured", A, "Payment: pay_1\nOrder: order_1\nUnits: 1", "2026-10-06T10:02:05Z"),
    ]);
    expect(rs).toHaveLength(1);
    expect(heldUnits(rs, "coorg-coffee-creek")).toBe(1);
  });

  it("ignores rows that are not deposits", () => {
    expect(holdsFrom([row("dossier", A, "Units: 4", "2026-10-06T10:00:00Z")])).toHaveLength(0);
  });
});

describe("what is held", () => {
  const rs = holdsFrom([
    row("deposit-intent", A, "Units: 2\nOrder: order_1", "2026-10-06T10:00:00Z"),
    row("deposit-paid", A, "Order: order_1\nPayment: pay_1", "2026-10-06T10:02:00Z"),
    row("deposit-intent", B, "Units: 3\nOrder: order_2", "2026-10-06T11:00:00Z"),
  ]);
  it("holds only what has been paid for: an opened order holds nothing", () => expect(heldUnits(rs, "coorg-coffee-creek")).toBe(2));
  it("holds it at its own estate and nowhere else", () => expect(heldUnits(rs, "slowspace-coastal")).toBe(0));
});

describe("what a reference may show", () => {
  it("masks the address", () => {
    expect(maskEmail("asha@example.com")).toBe("a•••@example.com");
    expect(maskEmail("asha@example.com")).not.toContain("asha");
  });
  it("returns nothing for something that is not an address", () => expect(maskEmail("nobody")).toBe(""));
});

describe("nights follow the share (founder, 6 Oct 2026)", () => {
  it("is one night a year for each 1% held", () => {
    expect(nightsFor(10)).toBe(10);
    expect(nightsFor(5)).toBe(5);
    expect(nightsFor(12.5)).toBe(12);
  });
});
