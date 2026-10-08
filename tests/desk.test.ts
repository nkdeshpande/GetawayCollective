/**
 * VISITS, THE FUNNEL AND N-26 — V2.0, 9 Oct 2026
 *
 * What is counted and what is refused, that a count never carries a person,
 * that the funnel is read from records that already exist, and that the
 * payment-account notice says only the last four digits.
 */
import { describe, it, expect } from "vitest";
import { countablePath, isBot, istDay, reportFrom, sourceOf, countVisit } from "../lib/visits";
import { funnelFrom } from "../lib/desk";
import { noticeById, SPECIMEN_CONTEXT } from "../content/notifications";
import { MANDATORY } from "../lib/notices/outbox";
import { isOptional } from "../lib/notices/inbox";
import type { Hold } from "../lib/holds";

describe("what is counted", () => {
  it("counts a public page, without its query or a trailing slash", () => {
    expect(countablePath("/collection/coorg-coffee-creek?utm_source=x#a")).toBe("/collection/coorg-coffee-creek");
    expect(countablePath("/journal/")).toBe("/journal");
    expect(countablePath("/")).toBe("/");
  });
  it("never counts the Office, an API, or something that is not a path", () => {
    for (const p of ["/office/investors", "/api/visit", "/_next/x.js", "https://evil.example/", "/a b", "", 7, null, "/" + "a".repeat(300)]) expect(countablePath(p), String(p)).toBeNull();
  });
  it("is not counted for a crawler or a missing device string", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot(null)).toBe(true);
    expect(isBot("Mozilla/5.0 (Linux; Android 14) Chrome/126 Mobile Safari/537.36")).toBe(false);
  });
  it("files the day as India reads it", () => expect(istDay(new Date("2026-10-08T19:00:00Z"))).toBe("2026-10-09"));
});

describe("where a visit came from", () => {
  it("is internal for anything but the first page", () => expect(sourceOf(false, "https://google.com/", "x")).toBe("internal"));
  it("is the campaign where the link names one", () => expect(sourceOf(true, "https://t.co/x", "Newsletter_Oct")).toBe("utm:newsletter_oct"));
  it("is the referring host, without www", () => expect(sourceOf(true, "https://www.google.com/search?q=secret", undefined)).toBe("google.com"));
  it("is direct with no referrer, an unreadable one, or the site itself", () => {
    expect(sourceOf(true, "", undefined)).toBe("direct");
    expect(sourceOf(true, "not a url", undefined)).toBe("direct");
    expect(sourceOf(true, "https://www.getawaycollective.co/collection", undefined)).toBe("direct");
  });
  it("never keeps a search query or a campaign value that is not a plain word", () => {
    expect(sourceOf(true, "https://www.google.com/search?q=secret", undefined)).not.toContain("secret");
    expect(sourceOf(true, "", "<script>")).toBe("direct");
  });
});

describe("the report", () => {
  const rows = [
    { day: "2026-10-09", path: "/", source: "google.com", views: 5, landings: 4 },
    { day: "2026-10-09", path: "/collection", source: "internal", views: 7, landings: 0 },
    { day: "2026-10-08", path: "/", source: "direct", views: 3, landings: 3 },
  ];
  it("totals visits as landings, newest day first, and leaves internal out of the sources", () => {
    const r = reportFrom(rows);
    expect(r).toMatchObject({ views: 15, visits: 7 });
    expect(r.days.map((d) => [d.day, d.visits, d.views])).toEqual([["2026-10-09", 4, 12], ["2026-10-08", 3, 3]]);
    expect(r.sources).toEqual([{ source: "google.com", visits: 4 }, { source: "direct", visits: 3 }]);
    expect(r.pages[0]).toEqual({ path: "/", views: 8, visits: 7 });
  });
  it("counts nothing, and never throws, with no database", async () => {
    const before = process.env.DATABASE_URL; delete process.env.DATABASE_URL;
    expect(await countVisit({ path: "/", landing: true })).toBe(false);
    if (before) process.env.DATABASE_URL = before;
  });
});

describe("the funnel", () => {
  const H = (slug: string, status: "opened" | "paid"): Hold => ({ reference: Math.random().toString(), vehicleSlug: slug, units: 1, status, orderId: null, paymentId: null, email: "a@example.com", openedAt: null, paidAt: null });
  it("counts enquiries, waitlist, orders opened and deposits paid for each estate", () => {
    const f = funnelFrom(
      [{ source: "dossier", vehicleSlug: "coorg-coffee-creek" }, { source: "dossier", vehicleSlug: "coorg-coffee-creek" }, { source: "waitlist", vehicleSlug: "slowspace-coastal" }, { source: "signal", vehicleSlug: null }],
      [H("coorg-coffee-creek", "paid"), H("coorg-coffee-creek", "opened")]);
    const creek = f[0];
    expect(creek).toMatchObject({ enquiries: 2, waitlist: 0, opened: 2, paid: 1 });
    expect(f.find((l) => l.waitlist === 1)).toBeTruthy();
    expect(f).toHaveLength(2);   // a Signal sign-up belongs to no estate
  });
});

describe("N-26, the payment account", () => {
  const n = noticeById("N-26")!;
  it("is live, goes to the person, and cannot be switched off", () => {
    expect(n).toMatchObject({ audience: "investor", wired: true });
    expect(MANDATORY.has("N-26")).toBe(true);
    expect(isOptional("N-26")).toBe(false);
  });
  it("says the last four digits and how to object, and nothing else about the account", () => {
    const r = n.render({ ...SPECIMEN_CONTEXT, bank: { last4: "4321" } });
    const w = [r.title, ...r.body].join(" ");
    expect(r.title).not.toMatch(/\d/);
    expect(w).toContain("ending 4321");
    expect(w).toContain("at once");
    expect(w).not.toMatch(/IFSC|holder|\d{5,}/);
  });
});
