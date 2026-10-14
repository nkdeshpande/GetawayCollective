/**
 * REFUNDS AND THE MORNING CLOCK — 15 Oct 2026
 *
 * A refund ends a hold and gives its units back; the reminder for an
 * unpaid order goes once, the morning after, and never for an old order;
 * the desk hears once about a hold paid three weeks ago.
 */
import { describe, it, expect } from "vitest";
import { heldUnits, holdsFrom, holdsOf } from "../lib/holds";
import { dueOnTheClock } from "../lib/notices/clock";
import { activityFrom } from "../lib/partner-account";
import { noticeById, SPECIMEN_CONTEXT } from "../content/notifications";
import { MANDATORY } from "../lib/notices/outbox";
import { isOptional } from "../lib/notices/inbox";

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const row = (source: string, ref: string, note: string, at: string) =>
  ({ source, note, email: "a@example.com", vehicleSlug: "coorg-coffee-creek", correlationId: ref, receivedAt: at });

describe("a refund", () => {
  const rows = [
    row("deposit-intent", A, "Order: order_1\nUnits: 2", "2026-10-06T10:00:00Z"),
    row("deposit-paid", A, "Order: order_1\nPayment: pay_1\nUnits: 2", "2026-10-06T10:02:00Z"),
    row("deposit-refunded", A, "Refund: rfnd_1\nPayment: pay_1", "2026-10-10T09:00:00Z"),
    row("deposit-intent", B, "Order: order_2\nUnits: 1", "2026-10-07T10:00:00Z"),
    row("deposit-paid", B, "Order: order_2\nPayment: pay_2\nUnits: 1", "2026-10-07T10:02:00Z"),
  ];
  const holds = holdsFrom(rows);
  it("ends the hold, and keeps when it was paid and refunded", () =>
    expect(holds.find((h) => h.reference === A)).toMatchObject({ status: "refunded", paidAt: "2026-10-06T10:02:00Z", refundedAt: "2026-10-10T09:00:00Z" }));
  it("gives its units back to the next visitor", () => expect(heldUnits(holds, "coorg-coffee-creek")).toBe(1));
  it("drops out of the person's own holds", () => expect(holdsOf(holds, "a@example.com").map((h) => h.reference)).toEqual([B]));
  it("is a line in the ledger", () =>
    expect(activityFrom([], holds.filter((h) => h.reference === A), []).map((l) => l.what)).toContain("Your holding deposit was refunded"));
});

describe("the morning clock", () => {
  const now = new Date("2026-10-15T02:30:00Z");
  const H = (reference: string, status: "opened" | "paid", openedAt: string | null, paidAt: string | null) =>
    ({ reference, vehicleSlug: "coorg-coffee-creek", units: 1, status, orderId: null, paymentId: null, email: "a@example.com", openedAt, paidAt });
  it("reminds about an order opened last night and never paid", () =>
    expect(dueOnTheClock([H("a", "opened", "2026-10-14T12:00:00Z", null)], now).unpaid).toHaveLength(1));
  it("leaves an order opened under twelve hours ago, a paid one, and one older than a week", () =>
    expect(dueOnTheClock([H("b", "opened", "2026-10-14T20:00:00Z", null), H("c", "paid", "2026-10-14T12:00:00Z", "2026-10-14T12:05:00Z"), H("d", "opened", "2026-10-01T12:00:00Z", null)], now).unpaid).toEqual([]));
  it("tells the desk about a hold paid three weeks ago, and not one paid last week", () => {
    const s = dueOnTheClock([H("e", "paid", null, "2026-09-20T10:00:00Z"), H("f", "paid", null, "2026-10-09T10:00:00Z")], now).stalled;
    expect(s.map((h) => h.reference)).toEqual(["e"]);
  });
});

describe("N-18 and N-20", () => {
  const hold = { estate: "Streamside Creek", slug: "coorg-coffee-creek", payee: "SlowSpace Coorg Creek LLP", units: 2, payment: "pay_1", reference: A };
  it("N-18 says nothing was taken, sells nothing, and can be switched off", () => {
    const r = noticeById("N-18")!.render({ ...SPECIMEN_CONTEXT, hold });
    const w = [r.title, ...r.body].join(" ");
    expect(w).toContain("Nothing was taken");
    expect(w).not.toMatch(/only \d|hurry|last chance|before they go|KYC|identity/i);
    expect(isOptional("N-18")).toBe(true);
  });
  it("N-20 is a receipt that cannot be switched off and promises no date", () => {
    const r = noticeById("N-20")!.render({ ...SPECIMEN_CONTEXT, hold });
    const w = [r.title, ...r.body].join(" ");
    expect(r.title).toBe("Your deposit was refunded: Streamside Creek");
    expect(w).toContain("refunded in full");
    expect(w).not.toMatch(/\b(within|working days?|shortly|soon)\b/i);
    expect(MANDATORY.has("N-20")).toBe(true);
  });
});
