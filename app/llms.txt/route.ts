/**
 * /llms.txt — the plain-text map answer engines read first.
 * Built from the register and the site's content (app/_system/ld.ts); a
 * route handler, not a page, so it carries no layout and no guard.
 */
import { llmsTxt } from "@/app/_system/ld";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
