/**
 * RATE LIMITING — G-10, the abuse gate on the public endpoints
 *
 * A fixed-window counter per client key, durable across instances when
 * Upstash is configured and in instance memory when it is not.
 *
 * ── WHY THIS STOPPED BEING IN-MEMORY ONLY ────────────────────────────
 * On serverless, instance memory is per-instance. A caller spread across
 * instances saw a ceiling multiplied by however many instances Vercel
 * happened to be running, and a cold start reset the window. The two
 * endpoints behind this are the ONLY unauthenticated write paths in the
 * system, so that ceiling was the whole of G-10's enforcement.
 *
 * Upstash is a fixed window in Redis: one INCR, one EXPIRE on first
 * write, one TTL read, in a single round trip. Every instance counts into
 * the same key, so the limit is the limit.
 *
 * ── WHAT HAPPENS WHEN REDIS IS UNREACHABLE ───────────────────────────
 * It falls back to the in-memory counter. Neither of the obvious choices
 * is right: failing OPEN turns an outage into an open door on the only
 * unauthenticated endpoints, and failing CLOSED turns it into a total
 * loss of legitimate leads. Degrading to the per-instance throttle keeps
 * a real limit in force — the one this file enforced until today — and
 * the request still completes.
 *
 * The failure is logged once per occurrence rather than swallowed. A
 * limiter that silently stops limiting is worse than one that never did,
 * because nobody goes looking for it.
 *
 * ── THE SIGNATURE CHANGED, DELIBERATELY ──────────────────────────────
 * This used to be synchronous. A network round trip cannot be, so it now
 * returns a promise and its two callers await it. The previous version of
 * this comment promised the routes would never change; that promise could
 * not survive the requirement, and pretending otherwise would have meant
 * a synchronous wrapper polling a promise.
 *
 * The limits are deliberately generous. These endpoints receive a human
 * filling a form; ten requests a minute from one address is not a human,
 * and rejecting request eleven loses no legitimate lead.
 */

const WINDOW_MS = 60_000;
const WINDOW_S = 60;
const LIMIT = 10;

/** Namespaced so this cannot collide with anything else in the same Redis. */
const PREFIX = "gc:rl:";

const hits = new Map<string, { count: number; windowStart: number }>();

/** Prevent unbounded growth if a caller rotates keys. */
const MAX_KEYS = 10_000;

export interface RateVerdict {
  ok: boolean;
  /** Seconds until the window resets — the Retry-After header. */
  retryAfter: number;
  /** Which counter decided. Surfaced so a degradation is observable. */
  backend: "redis" | "memory";
}

const upstash = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
};

/** The in-memory fixed window. Also the fallback when Redis is unreachable. */
function memoryLimit(key: string, now: number): RateVerdict {
  if (hits.size > MAX_KEYS) hits.clear();

  const h = hits.get(key);
  if (!h || now - h.windowStart >= WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return { ok: true, retryAfter: 0, backend: "memory" };
  }
  h.count += 1;
  if (h.count > LIMIT) {
    return {
      ok: false,
      retryAfter: Math.ceil((h.windowStart + WINDOW_MS - now) / 1000),
      backend: "memory",
    };
  }
  return { ok: true, retryAfter: 0, backend: "memory" };
}

/**
 * INCR, set the expiry only on the first write of a window, read the TTL —
 * one pipeline, one round trip.
 *
 * `EXPIRE … NX` is what makes it a FIXED window rather than a sliding one:
 * without NX every request would push the expiry out and a steady caller
 * would never reset. The window starts at the first request and ends 60
 * seconds later regardless of what arrives in between.
 */
async function redisLimit(key: string, cfg: { url: string; token: string }): Promise<RateVerdict> {
  const k = PREFIX + key;
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", k],
      ["EXPIRE", k, String(WINDOW_S), "NX"],
      ["TTL", k],
    ]),
    /* A hung limiter must not become a hung endpoint. Two seconds is far
       beyond a healthy Upstash round trip and far below any timeout a
       person would notice. */
    signal: AbortSignal.timeout(2000),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`upstash ${res.status}`);

  const body = (await res.json()) as { result?: number; error?: string }[];
  const count = body[0]?.result;
  if (typeof count !== "number") throw new Error("upstash: no count");

  const ttl = typeof body[2]?.result === "number" ? body[2].result : WINDOW_S;

  if (count > LIMIT) {
    /* TTL is -1 (no expiry) or -2 (no key) in the races where the key was
       evicted between INCR and TTL. Never hand the caller a negative
       Retry-After — it reads as "retry immediately". */
    return { ok: false, retryAfter: ttl > 0 ? ttl : WINDOW_S, backend: "redis" };
  }
  return { ok: true, retryAfter: 0, backend: "redis" };
}

let degradedLogged = false;

export async function rateLimit(key: string, now = Date.now()): Promise<RateVerdict> {
  const cfg = upstash();
  if (!cfg) return memoryLimit(key, now);

  try {
    const v = await redisLimit(key, cfg);
    degradedLogged = false;
    return v;
  } catch (err) {
    /* Logged once per degradation episode, not once per request — an
       outage would otherwise write a line per hit and bury itself. */
    if (!degradedLogged) {
      degradedLogged = true;
      console.error(
        `[rate-limit] Upstash unreachable, degrading to per-instance memory: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    return memoryLimit(key, now);
  }
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
  degradedLogged = false;
}
