/**
 * THE INBOX — GC-08-DS-001, step 3
 *
 * 8 Oct 2026. What a person may decline, how a delivery reads to them, and
 * that with no database the inbox is empty and refuses honestly, never
 * throws.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { choicesFor, inboxFor, isOptional, markRead, optionalNotices, setChoice, stateLabel, unreadFor, when } from "../lib/notices/inbox";
import { MANDATORY } from "../lib/notices/outbox";

describe("what a person may decline (NR-18)", () => {
  it("is, today, the acknowledgement of an enquiry and nothing else", () =>
    expect(optionalNotices().map((o) => o.noticeId)).toEqual(["N-23"]));
  it("is worded for the person, not the desk", () =>
    expect(optionalNotices()[0].label).toBe("An acknowledgement when you enquire or join a waitlist"));
  it("never includes a mandatory notice, the desk's mail, or a specimen", () => {
    for (const id of MANDATORY) expect(isOptional(id), id).toBe(false);
    expect(isOptional("N-17")).toBe(false);
    expect(isOptional("N-13")).toBe(false);
    expect(isOptional("N-99")).toBe(false);
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
    expect(await choicesFor("a@example.com")).toEqual([{ noticeId: "N-23", label: "An acknowledgement when you enquire or join a waitlist", allowed: true }]));
  it("a choice is refused as unavailable, and a mandatory one as not optional", async () => {
    expect(await setChoice("a@example.com", "N-23", false)).toBe("unavailable");
    expect(await setChoice("a@example.com", "N-03", false)).toBe("not-optional");
  });
});
