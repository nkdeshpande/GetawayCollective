/**
 * G-10 — the throttle on the public endpoints.
 *
 * These exercise the in-memory path, which is both the unconfigured
 * default and the fallback when Upstash is unreachable. No test here
 * reaches the network: a limiter test that needed a live Redis would be
 * skipped in CI, and a skipped test on the only unauthenticated write
 * path is worse than none.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit, clientKey, __resetRateLimit } from "../lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("admits ten in a window and refuses the eleventh with a Retry-After", async () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 10; i++) {
      expect((await rateLimit("a", t0 + i)).ok, `req ${i + 1}`).toBe(true);
    }
    const v = await rateLimit("a", t0 + 10);
    expect(v.ok).toBe(false);
    expect(v.retryAfter).toBeGreaterThan(0);
    expect(v.retryAfter).toBeLessThanOrEqual(60);
  });

  it("opens a fresh window after 60 seconds", async () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 11; i++) await rateLimit("a", t0);
    expect((await rateLimit("a", t0)).ok).toBe(false);
    expect((await rateLimit("a", t0 + 60_001)).ok).toBe(true);
  });

  it("buckets keys independently — one abuser never throttles another caller", async () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 20; i++) await rateLimit("abuser", t0);
    expect((await rateLimit("someone-else", t0)).ok).toBe(true);
  });

  it("keys on the FIRST x-forwarded-for address — the client, not the proxies", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1, 10.0.0.2" },
    });
    expect(clientKey(req)).toBe("203.0.113.7");
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });

  it("reports the memory backend when Upstash is not configured", async () => {
    expect((await rateLimit("k", 1_000_000)).backend).toBe("memory");
  });
});

/**
 * The degradation path. This is the branch that decides what happens
 * during a Redis outage, and it is the one most likely to be written
 * wrong — failing open would turn an outage into an open door.
 */
describe("rateLimit · Upstash unreachable", () => {
  const OLD = { ...process.env };

  beforeEach(() => {
    __resetRateLimit();
    process.env.UPSTASH_REDIS_REST_URL = "https://example.invalid";
    process.env.UPSTASH_REDIS_REST_TOKEN = "t";
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...OLD };
    vi.restoreAllMocks();
  });

  it("degrades to the in-memory counter rather than failing open or closed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    /* Still admits the legitimate caller — not failing closed. */
    const first = await rateLimit("degraded", 1_000_000);
    expect(first.ok).toBe(true);
    expect(first.backend).toBe("memory");

    /* Still enforces a limit — not failing open. */
    for (let i = 0; i < 10; i++) await rateLimit("degraded", 1_000_000);
    expect((await rateLimit("degraded", 1_000_000)).ok).toBe(false);
  });

  it("logs the degradation once, not once per request", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    for (let i = 0; i < 5; i++) await rateLimit("noisy", 1_000_000);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("refuses over the limit using the TTL Redis reports", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ result: 11 }, { result: 0 }, { result: 42 }],
      }),
    );
    const v = await rateLimit("over", 1_000_000);
    expect(v.ok).toBe(false);
    expect(v.backend).toBe("redis");
    expect(v.retryAfter).toBe(42);
  });

  it("never returns a negative Retry-After when the key vanished mid-pipeline", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ result: 11 }, { result: 0 }, { result: -2 }],
      }),
    );
    const v = await rateLimit("evicted", 1_000_000);
    expect(v.ok).toBe(false);
    expect(v.retryAfter).toBeGreaterThan(0);
  });
});
