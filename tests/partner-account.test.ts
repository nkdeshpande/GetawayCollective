/**
 * THE PARTNER'S RELATIONSHIP SUMMARY — V2.0, the first partner module
 *
 * 8 Oct 2026. What the summary is built from, and that with nothing on
 * record it is empty and never an example.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { EMPTY_ACCOUNT, accountFrom, activityFrom, partnerAccount } from "../lib/partner-account";
import type { Hold } from "../lib/holds";
import type { InboxItem } from "../lib/notices/inbox";

const hold = (reference: string, slug: string | null, units: number): Hold =>
  ({ reference, vehicleSlug: slug, units, status: "paid", orderId: null, paymentId: null, email: "a@example.com", openedAt: null, paidAt: "2026-10-06T08:32:00.000Z" });
const note = (id: string, unread: boolean): InboxItem =>
  ({ id, noticeId: "N-23", subject: `Subject ${id}`, text: "body", state: "sent", at: "2026-10-06T08:32:00.000Z", unread });

describe("the relationship summary", () => {
  it("names each hold by its estate, with the way back to where it stands", () => {
    const a = accountFrom([hold("ref-1", "coorg-coffee-creek", 2)], [], 0);
    expect(a.holds).toHaveLength(1);
    expect(a.holds[0]).toMatchObject({ slug: "coorg-coffee-creek", units: 2, paid: "6 Oct 2026, 14:02", href: "/reserve/coorg-coffee-creek#r=ref-1" });
    expect(a.holds[0].estate).not.toBe("An estate");
  });
  it("does not invent a link for a hold whose estate it cannot name", () =>
    expect(accountFrom([hold("ref-2", "no-such-estate", 1)], [], 0).holds[0]).toMatchObject({ estate: "An estate", href: null }));
  it("shows the three latest notices by subject, never their words", () => {
    const a = accountFrom([], [note("1", true), note("2", false), note("3", false), note("4", false)], 1);
    expect(a.notices.map((n) => n.subject)).toEqual(["Subject 1", "Subject 2", "Subject 3"]);
    expect(a.notices[0]).toEqual({ at: "6 Oct 2026, 14:02", subject: "Subject 1", unread: true });
    expect(JSON.stringify(a)).not.toContain("body");
    expect(a.unread).toBe(1);
  });
});

describe("the ledger", () => {
  const ev = (type: string, at: string, payload: Record<string, unknown> = {}) => ({ type, at, payload });
  it("is one list, newest first, across deposits, the record and notices", () => {
    const opened: Hold = { ...hold("ref-1", "coorg-coffee-creek", 1), openedAt: "2026-10-06T08:00:00.000Z" };
    const a = activityFrom(
      [ev("KycRecorded", "2026-10-07T05:00:00.000Z", { state: "in_progress" }), ev("OwnershipPositionOpened", "2026-07-14T06:00:00.000Z", { estate: "slowspace", units: "2" })],
      [opened], [note("1", false)]);
    expect(a.map((l) => l.what)).toEqual([
      "Your identity checks were reviewed", "Your holding deposit was paid", "We sent you a notice", "You opened a holding deposit", "Your position was entered on the register",
    ]);
    expect(a[0]).toMatchObject({ what: "Your identity checks were reviewed", detail: "Now: in progress" });
    expect(a.at(-1)!.detail).toContain("2 units");
    for (let i = 1; i < a.length; i++) expect(Date.parse(a[i - 1].at)).toBeGreaterThanOrEqual(Date.parse(a[i].at));
  });
  it("never shows an act it has no words for, the reason for one, or who did it", () => {
    const a = activityFrom([ev("GrantIssued", "2026-10-07T05:00:00.000Z", { reason: "internal note", actorId: "u-1" }),
      ev("KycRecorded", "2026-10-07T06:00:00.000Z", { state: "verified", reason: "internal note" })], [], []);
    expect(a).toHaveLength(1);
    expect(JSON.stringify(a)).not.toMatch(/internal note|u-1|GrantIssued/);
  });
  it("tells the person to write at once when their payment account is recorded", () =>
    expect(activityFrom([ev("BankAccountRecorded", "2026-10-07T05:00:00.000Z", { method: "penny_drop" })], [], [])[0].detail).toContain("write to ir@getawaycollective.co at once"));
});

describe("with nothing to read from", () => {
  const env = { ...process.env };
  beforeEach(() => { delete process.env.DATABASE_URL; });
  afterEach(() => { process.env = { ...env }; });
  it("is empty for nobody, and empty without a database", async () => {
    expect(await partnerAccount(null)).toEqual(EMPTY_ACCOUNT);
    expect(await partnerAccount("a@example.com")).toEqual(EMPTY_ACCOUNT);
    expect((await partnerAccount("a@example.com", { activity: true })).activity).toEqual([]);
  });
});
