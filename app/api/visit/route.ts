/**
 * POST /api/visit — one page was read
 *
 * V2.0, 9 Oct 2026 (lib/visits.ts). The browser sends the page and, for the
 * first page of a tab's visit, where it came from. The answer is always 204
 * and says nothing: a reader's page never waits on, or learns from, the
 * count. Nothing about the request is stored: not its address, not its
 * device, not a cookie. A crawler, a browser asking not to be tracked, and
 * anything over the rate limit are simply not counted.
 */
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { countVisit, isBot, sourceOf } from "@/lib/visits";
import { capture, shape } from "@/lib/posthog";

export const dynamic = "force-dynamic";
const done = () => new Response(null, { status: 204, headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  if (isBot(req.headers.get("user-agent"))) return done(); // vocab-lint-ignore — the HTTP header name
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") return done();
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return done();
  const b = (await req.json().catch(() => null)) as { p?: unknown; l?: unknown; r?: unknown; u?: unknown; t?: unknown } | null;
  /* 15 Oct 2026: the same page, as a step on its path (lib/posthog.ts; dormant without POSTHOG_KEY). */
  if (b) await Promise.all([countVisit({ path: b.p, landing: b.l === true, referrer: b.r, utm: b.u }),
    capture(shape("$pageview", { landing: b.l === true, source: sourceOf(b.l === true, b.r, b.u) }, b.t, { path: b.p, country: req.headers.get("x-vercel-ip-country") }))]);
  return done();
}
