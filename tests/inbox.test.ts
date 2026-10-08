/**
 * THE INBOX — GC-08-DS-001, step 3
 *
 * 8 Oct 2026. What a person may decline, how a delivery reads to them, and
 * that with no database the inbox is empty and refuses honestly, never
 * throws.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { deliveryLog, tally, choicesFor, inboxFor, isOptional, markRead, optionalNotices, setChoice, stateLabel, unreadFor, when } from "../lib/notices/inbox";
import { MANDATORY } from "../lib/notices/outbox";
import { holdsOf, type Hold } from "../lib/holds";

describe("what a person may decline (NR-18)", () => {
  it("is, today, updates on identity checks and the acknowledgement of an enquiry", () =>
    expect(optionalNotices().map((o) => o.noticeId)).toEqual(["N-21", "N-23"]));
  it("is worded for the person, not the desk", () =>
    expect(optionalNotices().map((o) => o.label)).toEqual(["Updates when your identity checks are reviewed", "An acknowledgement when you enquire or join a waitlist"]));
  it("never includes a mandatory notice, the desk's mail, or a specimen", () => {
    for (const id of MANDATORY) expect(isOptional(id), id).toBe(false);
    expect(isOptional("N-17")).toBe(false);
    expect(isOptional("N-13")).toBe(false);
    expect(isOptional("N-99")).toBe(false);
  });
});

describe("your holds", () => {
  const H = (reference: string, email: string, status: "opened" | "paid", paidAt: string | null): Hold =>
    ({ reference, vehicleSlug: "coorg-coffee-creek", units: 1, status, orderId: null, paymentId: null, email, openedAt: null, paidAt });
  const all = [H("a", "asha@example.com", "paid", "2026-10-06T08:00:00Z"), H("b", "Asha@Example.com ", "paid", "2026-10-07T08:00:00Z"),
    H("c", "asha@example.com", "opened", null), H("d", "ravi@example.com", "paid", "2026-10-07T09:00:00Z")];
  it("are the paid holds opened under the signed-in address, newest first", () =>
    expect(holdsOf(all, "asha@example.com").map((h) => h.reference)).toEqual(["b", "a"]));
  it("never include somebody else's, an unpaid order, or anything for no address", () => {
    expect(holdsOf(all, "nobody@example.com")).toEqual([]);
    expect(holdsOf(all, "")).toEqual([]);
  });
});

describe("the tally the Office sees", () => {
  it("counts each state, and is empty with no database", async () => {
    const L = (state: "sent" | "queued" | "failed") => ({ id: state, noticeId: "N-23", recipient: "a@example.com", audience: "applicant", subject: "s", state, attempts: 1, lastError: null, at: "", read: false });
    expect(tally([L("sent"), L("sent"), L("failed"), L("queued")])).toEqual({ sent: 2, queued: 1, failed: 1 });
    const before = process.env.DATABASE_URL; delete process.env.DATABASE_URL;
    expect(await deliveryLog()).toEqual([]);
    if (before) process.env.DATABASE_URL = before;
  });
});

describe("how a delivery reads", () => {
  it("says what happened to the mail", () => {
    expect(stateLabel("sent")).toBe("Sent by email");
    expect(stateLabel("queued")).toBe("Being sent");
    expect(stateLabel("failed")).toContain("kept here");
  });
  it("gives the time as India reads it", () => expect(when("2026-10-06T08:32:00.000Z")).toBe("6 Oct 2026, 14:02"));
  it("gives nothing for a date that cannot be read", () => expect(when("soon")).toBe(""));
});

describe("with no database", () => {
  const env = { ...process.env };
  beforeEach(() => { delete process.env.DATABASE_URL; });
  afterEach(() => { process.env = { ...env }; });

  it("the inbox is empty and nothing is unread", async () => {
    expect(await inboxFor("a@example.com")).toEqual([]);
    expect(await unreadFor("a@example.com")).toBe(0);
    expect(await markRead("a@example.com")).toBe(0);
  });
  it("every optional notice reads as still received", async () =>
    expect((await choicesFor("a@example.com")).map((c) => [c.noticeId, c.allowed])).toEqual([["N-21", true], ["N-23", true]]));
  it("a choice is refused as unavailable, and a mandatory one as not optional", async () => {
    expect(await setChoice("a@example.com", "N-23", false)).toBe("unavailable");
    expect(await setChoice("a@example.com", "N-03", false)).toBe("not-optional");
  });
});
