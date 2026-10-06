/**
 * THE STANDING NOTICE AND THE ACKNOWLEDGEMENT — GC-08-DS-001, step 1
 *
 * 6 Oct 2026. Two small things a reader meets without asking: the banner the
 * site may raise across every page (S-10), and the mail a person receives
 * when they write in (N-23). Each is held to what its rule says.
 */
import { describe, it, expect } from "vitest";
import { SITE_NOTICE, noticeStands, type SiteNotice } from "../content/site/notice";
import { noticeById, SPECIMEN_CONTEXT } from "../content/notifications";
import { preview } from "../lib/email/send";

const N: SiteNotice = { text: "Payments are paused until 14:00.", tone: "hazard", from: "2026-10-06T08:00:00+05:30", until: "2026-10-06T14:00:00+05:30" };

describe("the standing notice", () => {
  it("is silent by default: a banner that is always there is not read", () => expect(SITE_NOTICE).toBeNull());
  it("stands from its start", () => expect(noticeStands(N, new Date("2026-10-06T08:00:00+05:30"))).toBe(true));
  it("does not stand before it", () => expect(noticeStands(N, new Date("2026-10-06T07:59:59+05:30"))).toBe(false));
  it("ends at its end, whatever else is true", () => expect(noticeStands(N, new Date("2026-10-06T14:00:00+05:30"))).toBe(false));
  it("is not in force with a date that cannot be read", () => expect(noticeStands({ ...N, until: "soon" }, new Date("2026-10-06T09:00:00+05:30"))).toBe(false));
});

describe("N-23, the acknowledgement of an enquiry", () => {
  const spec = noticeById("N-23")!;
  const words = (ctx: Parameters<typeof spec.render>[0]) => { const r = spec.render(ctx); return [r.title, ...r.body].join(" "); };

  it("goes to the person by email, and is live", () => {
    expect(spec).toMatchObject({ audience: "applicant", urgency: "normal", wired: true });
    expect(spec.channels).toEqual(["email"]);
  });
  it("names the estate asked about, and links to it", () => {
    const r = spec.render({ ...SPECIMEN_CONTEXT, estate: "SlowSpace Creek", estateSlug: "coorg-coffee-creek" });
    expect(r.title).toBe("We have your enquiry about SlowSpace Creek");
    expect(r.links?.map((l) => l.to)).toEqual(["/collection/coorg-coffee-creek", "/legal/risk-disclosure"]);
  });
  it("still reads where no estate was named", () => expect(spec.render(SPECIMEN_CONTEXT).title).toBe("We have your enquiry"));
  it("says a waitlist place is not an offer", () => {
    const w = words({ ...SPECIMEN_CONTEXT, estate: "Seaside Confluence", estateSlug: "slowspace-coastal", waitlist: true });
    expect(w).toContain("waitlist for Seaside Confluence");
    expect(w).toContain("not an offer");
  });
  it("promises a reply and never a time, and says capital is at risk", () => {
    for (const ctx of [SPECIMEN_CONTEXT, { ...SPECIMEN_CONTEXT, estate: "X", waitlist: true }]) {
      const w = words(ctx);
      expect(w).toContain("Capital is at risk");
      expect(w).not.toMatch(/\b(within|hours?|working days?|shortly|soon)\b/i);
    }
  });
  it("renders to a mail with a subject and a plain-text body", () => {
    const m = preview("N-23", { ...SPECIMEN_CONTEXT, estate: "SlowSpace Creek", estateSlug: "coorg-coffee-creek" })!;
    expect(m.subject).toContain("We have your enquiry about SlowSpace Creek");
    expect(m.text).toContain("Investor Relations");
  });
});
