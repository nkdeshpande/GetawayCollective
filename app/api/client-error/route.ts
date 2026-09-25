/**
 * POST /api/client-error — a page crashed in someone's browser.
 *
 * 25 Sep 2026. The browser half of the error alerts (lib/alerts.ts),
 * called by the error page (app/_system/report.ts) for failures that
 * happened in the browser. A failure that happened on the server carries a
 * digest and has already been reported by instrumentation.ts, so the page
 * does not send those twice.
 *
 * Public by necessity: a crash can happen before anyone signs in. So it is
 * rate-limited, it accepts only a short message and a same-site path, and
 * it answers 204 whatever happens, so it tells a caller nothing.
 */
import { z } from "zod";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { reportError } from "@/lib/alerts";

const Body = z.object({
  path: z.string().max(200).regex(/^\/[^\s?#]*$/, "a path on this site"),
  message: z.string().max(300),
});

export async function POST(req: Request) {
  const verdict = await rateLimit(`client-error:${clientKey(req)}`);
  if (verdict.ok) {
    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (parsed.success) await reportError({ kind: "client", where: parsed.data.path, message: parsed.data.message });
  }
  return new Response(null, { status: 204 });
}
