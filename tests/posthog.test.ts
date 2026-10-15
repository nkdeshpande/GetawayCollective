/**
 * POSTHOG — lib/posthog.ts, 15 Oct 2026
 *
 * What may leave this server for PostHog, and that nothing leaves it while
 * the key is unset. The allowlist is the privacy promise; these pin it.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { capture, EVENTS, visitPaths, missing, sending, shape, tabId, viewing } from "../lib/posthog";

const T = "abc123def456ghi7";

describe("what may be sent", () => {
  it("is six named events and nothing else", () =>
    expect(Object.keys(EVENTS)).toEqual(["$pageview", "cta", "enquiry_sent", "deposit_opened", "deposit_paid", "hero_film"]));
  it("refuses an event not on the list, and any event without a tab id", () => {
    expect(shape("identify", {}, T)).toBeNull();
    expect(shape("cta", {}, "")).toBeNull();
    expect(shape("cta", {}, "x")).toBeNull();
    expect(tabId("bad id!")).toBeNull();
  });
  it("carries only the allowed properties, with no person and no geo lookup", () => {
    const e = shape("cta", { label: "Review the offering", href: "/collection/x/investment", email: "a@b.co", name: "Asha" }, T, { path: "/collection/x", country: "IN" })!;
    expect(e.distinct_id).toBe(T);
    expect(e.properties).toMatchObject({ label: "Review the offering", href: "/collection/x/investment", $process_person_profile: false, $geoip_disable: true, country: "IN", $pathname: "/collection/x" });
    expect(e.properties).not.toHaveProperty("email");
    expect(e.properties).not.toHaveProperty("name");
  });
  it("drops anything that looks like an email or a phone number, even in an allowed field", () => {
    const e = shape("cta", { label: "write to a@b.co", href: "+91 98450 12345" }, T)!;
    expect(e.properties).not.toHaveProperty("label");
    expect(e.properties).not.toHaveProperty("href");
  });
  it("never sends an Office or API path", () => {
    expect(shape("$pageview", {}, T, { path: "/office/analytics" })!.properties).not.toHaveProperty("$pathname");
    expect(shape("$pageview", {}, T, { path: "/journal/2026-10-15-notes" })!.properties.$pathname).toBe("/journal/2026-10-15-notes");
  });
});

describe("with no keys", () => {
  const env = { ...process.env };
  beforeEach(() => { for (const k of ["POSTHOG_KEY", "POSTHOG_PROJECT_ID", "POSTHOG_PERSONAL_API_KEY"]) delete process.env[k]; });
  afterEach(() => { process.env = { ...env }; });
  it("sends nothing and says what is missing, by name", async () => {
    expect(sending()).toBe(false);
    expect(viewing()).toBe(false);
    expect(await capture(shape("cta", {}, T))).toBe(false);
    expect(missing()).toEqual({ send: ["POSTHOG_KEY"], view: ["POSTHOG_PROJECT_ID", "POSTHOG_PERSONAL_API_KEY"] });
  });
  it("the Office view explains its absence instead of showing zeros", async () =>
    expect(await visitPaths()).toEqual({ ready: false, why: "Waiting on POSTHOG_PROJECT_ID and POSTHOG_PERSONAL_API_KEY." }));
});
