/**
 * RATE LIMITING — G-10, the abuse gate on the public endpoints
 *
 * A fixed-window counter per client key, in instance memory.
 *
 * ── WHAT THIS IS AND IS NOT ──────────────────────────────────────────
 * On serverless, instance memory is per-instance: a determined attacker
 * spread across instances sees a higher effective ceiling, and a cold
 * start resets the window. This is therefore a THROTTLE that stops the
 * cheap abuse — a loop hammering one endpoint from one place — and an
 * honest one: the durable, cross-instance limiter arrives with the
 * database (a table or Upstash), behind this same function signature so
 * the routes never change.
 *
 * The limits are deliberately generous. These endpoints receive a human
 * filling a form; ten requests a minute from one address is not a
 * human, and rejecting request eleven loses no legitimate lead.
 */

const WINDOW_MS = 60_000;
const LIMIT = 10;

const hits = new Map<string, { count: number; windowStart: number }>();

/** Prevent unbounded growth if an attacker rotates keys. */
const MAX_KEYS = 10_000;

export interface RateVerdict {
  ok: boolean;
  /** Seconds until the window resets — the Retry-After header. */
  retryAfter: number;
}

export function rateLimit(key: string, now = Date.now()): RateVerdict {
  if (hits.size > MAX_KEYS) hits.clear();

  const h = hits.get(key);
  if (!h || now - h.windowStart >= WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return { ok: true, retryAfter: 0 };
  }
  h.count += 1;
  if (h.count > LIMIT) {
    return { ok: false, retryAfter: Math.ceil((h.windowStart + WINDOW_MS - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * The client key. x-forwarded-for's FIRST address is the client as the
 * edge saw it; everything after is proxies. Absent the header (local
 * dev), everything shares one bucket — which in dev is fine and in
 * production does not happen behind Vercel's proxy.
 */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "").trim() || "unknown";
}

/** Test hook. Never called by application code. */
export function __resetRateLimit(): void {
  hits.clear();
}
