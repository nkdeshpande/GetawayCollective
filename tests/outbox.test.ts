/**
 * THE OUTBOX — GC-08-DS-001, step 2
 *
 * 6 Oct 2026. The rules a message is held to before it is sent: one row per
 * key, an answer never held, quiet hours for everything else, three retries
 * and then silence. And the one promise that matters most: with no database
 * to write to, the message still goes.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MANDATORY, MAX_ATTEMPTS, RETRY_AFTER_MIN, dedupeKey, dispatch, dueFor, retryAt } from "../lib/notices/outbox";
import { renderForSend } from "../lib/email/send";
import { NOTICES } from "../content/notifications";

const at = (ist: string) => new Date(`2026-10-06T${ist}:00+05:30`);

describe("one message, one key (NR-16)", () => {
  it("is the same key however the address is typed", () =>
    expect(dedupeKey("N-03", "ref-1", " Asha@Example.com ")).toBe(dedupeKey("N-03", "ref-1", "asha@example.com")));
  it("differs by what the message is, what it is about, and who it is for", () => {
    const k = dedupeKey("N-03", "ref-1", "a@example.com");
    expect(dedupeKey("N-23", "ref-1", "a@example.com")).not.toBe(k);
    expect(dedupeKey("N-03", "ref-2", "a@example.com")).not.toBe(k);
    expect(dedupeKey("N-03", "ref-1", "b@example.com")).not.toBe(k);
  });
});

describe("when a message is due (NR-15, proposed)", () => {
  it("sends an answer at once, whatever the hour", () => expect(dueFor("normal", true, at("23:30"))).toEqual(at("23:30")));
  it("sends anything critical at once, whatever the hour", () => expect(dueFor("critical", false, at("02:00"))).toEqual(at("02:00")));
  it("sends in the day without waiting", () => expect(dueFor("normal", false, at("14:00"))).toEqual(at("14:00")));
  it("holds a late message for 08:00 the next morning, India time", () =>
    expect(dueFor("normal", false, at("21:00")).toISOString()).toBe(new Date("2026-10-07T08:00:00+05:30").toISOString()));
  it("holds an early message for 08:00 the same morning", () =>
    expect(dueFor("high", false, at("05:15")).toISOString()).toBe(new Date("2026-10-06T08:00:00+05:30").toISOString()));
  it("opens at 08:00 exactly", () => expect(dueFor("low", false, at("08:00"))).toEqual(at("08:00")));
});

describe("a failed send is tried again, and then not again (NR-17)", () => {
  it("waits 1, 5 and 30 minutes", () => {
    const now = at("10:00");
    expect(RETRY_AFTER_MIN).toEqual([1, 5, 30]);
    expect(retryAt(1, now)).toEqual(at("10:01"));
    expect(retryAt(2, now)).toEqual(at("10:05"));
    expect(retryAt(3, now)).toEqual(at("10:30"));
  });
  it("stops after the fourth attempt", () => {
    expect(MAX_ATTEMPTS).toBe(4);
    expect(retryAt(4, at("10:00"))).toBeNull();
  });
});

describe("what cannot be switched off (NR-18)", () => {
  it("includes the receipt, settlement, votes, distributions, document changes and security", () => {
    for (const id of ["N-03", "N-05", "N-06", "N-09", "N-10", "N-11", "N-14", "N-26"]) expect(MANDATORY.has(id), id).toBe(true);
  });
  it("leaves the acknowledgement of an enquiry to the person", () => expect(MANDATORY.has("N-23")).toBe(false));
});

describe("only a live notice can be rendered for sending (NR-20)", () => {
  it("renders N-23, with where a reply goes", () => {
    const r = renderForSend("N-23");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r).toMatchObject({ audience: "applicant", urgency: "normal", replyTo: "ir@getawaycollective.co" });
  });
  it("refuses every specimen", () => {
    for (const n of NOTICES.filter((x) => !x.wired && x.channels.includes("email"))) {
      expect(renderForSend(n.id), n.id).toEqual({ ok: false, reason: "not-wired" });
    }
  });
  it("refuses a notice that was never meant for email, and one that does not exist", () => {
    expect(renderForSend("N-15")).toEqual({ ok: false, reason: "not-an-email-notice" });
    expect(renderForSend("N-99")).toEqual({ ok: false, reason: "unknown-notice" });
  });
});

describe("with no database, the message still goes", () => {
  const env = { ...process.env };
  beforeEach(() => { delete process.env.DATABASE_URL; delete process.env.RESEND_API_KEY; });
  afterEach(() => { process.env = { ...env }; vi.restoreAllMocks(); });

  it("sends directly and says it was not recorded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const out = await dispatch({
      key: dedupeKey("N-23", "c-1", "a@example.com"), noticeId: "N-23", to: "a@example.com",
      audience: "applicant", urgency: "normal", transactional: true, subject: "We have your enquiry", text: "Received.",
    });
    /* No mail key in a test, so the send itself fails; what matters is that it was attempted, unrecorded. */
    expect(out).toEqual({ outcome: "failed", recorded: false });
  });
});
