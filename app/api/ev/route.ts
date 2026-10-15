/**
 * POST /api/ev — one step of a visit, forwarded to PostHog (lib/posthog.ts)
 *
 * 15 Oct 2026. Same stance as /api/visit: always 204, says nothing, never
 * waited on. Only the events and properties lib/posthog.ts allows pass; a
 * crawler, a browser asking not to be tracked and anything over the rate
 * limit are dropped, and with no POSTHOG_KEY nothing is sent at all.
 */
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { isBot } from "@/lib/visits";
import { capture, sending, shape } from "@/lib/posthog";

export const dynamic = "force-dynamic";
const done = () => new Response(null, { status: 204, headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  if (!sending()) return done();
  if (isBot(req.headers.get("user-agent"))) return done(); // vocab-lint-ignore — the HTTP header name
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") return done();
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return done();
  const b = (await req.json().catch(() => null)) as { e?: unknown; p?: unknown; t?: unknown; path?: unknown } | null;
  if (b) await capture(shape(b.e, b.p, b.t, { path: b.path, country: req.headers.get("x-vercel-ip-country") }));
  return done();
}
