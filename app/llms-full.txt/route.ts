/**
 * /llms-full.txt — the site's explanatory text in one file, for answer
 * engines that read rather than crawl (app/_system/ld.ts, llmsFullTxt).
 * 16 Oct 2026. A route handler like /llms.txt: no layout, no guard.
 */
import { llmsFullTxt } from "@/app/_system/ld";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
