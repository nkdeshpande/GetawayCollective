/**
 * POST /api/notices/preference — a person switches one notice off, or on
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001, step 3 (NR-18).
 *
 * { notice: "N-23", allowed: false }. It acts on the address of the session
 * that asks and on no other. A notice that is mandatory, or not one a person
 * may decline, is refused with a reason: the page never shows a switch for
 * one, so a request for one did not come from the page.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { setChoice } from "@/lib/notices/inbox";
import { currentAddress } from "@/lib/session";

export const dynamic = "force-dynamic";

const Body = z.object({ notice: z.string().regex(/^[NO]-\d{2}$/), allowed: z.boolean() });

export async function POST(req: Request) {
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const address = await currentAddress();
  if (!address) return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  try {
    const out = await setChoice(address, parsed.data.notice, parsed.data.allowed);
    if (out === "not-optional") return NextResponse.json({ ok: false, error: "not-optional" }, { status: 422 });
    if (out === "unavailable") return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
