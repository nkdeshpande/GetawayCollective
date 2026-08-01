/**
 * G-10 — the throttle on the public endpoints.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, clientKey, __resetRateLimit } from "../lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("admits ten in a window and refuses the eleventh with a Retry-After", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 10; i++) expect(rateLimit("a", t0 + i).ok, `req ${i + 1}`).toBe(true);
    const v = rateLimit("a", t0 + 10);
    expect(v.ok).toBe(false);
    expect(v.retryAfter).toBeGreaterThan(0);
    expect(v.retryAfter).toBeLessThanOrEqual(60);
  });

  it("opens a fresh window after 60 seconds", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 11; i++) rateLimit("a", t0);
    expect(rateLimit("a", t0).ok).toBe(false);
    expect(rateLimit("a", t0 + 60_001).ok).toBe(true);
  });

  it("buckets keys independently — one abuser never throttles another caller", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 20; i++) rateLimit("abuser", t0);
    expect(rateLimit("someone-else", t0).ok).toBe(true);
  });

  it("keys on the FIRST x-forwarded-for address — the client, not the proxies", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1, 10.0.0.2" },
    });
    expect(clientKey(req)).toBe("203.0.113.7");
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });
});
