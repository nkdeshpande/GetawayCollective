/**
 * /api/notices — the signed-in person's own count, and reading
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001, step 3.
 *
 *   GET   how many notices are unread, for the bar. Signed out, or with no
 *         database, the answer is 0: there is nothing to point at.
 *   POST  { read: true } marks everything unread as read.
 *
 * Both act only on the address of the session that asks. Neither takes an
 * address, a reference or an id from the request, so there is nothing to
 * guess. A count is all that leaves here.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { markRead, unreadFor } from "@/lib/notices/inbox";
import { currentAddress } from "@/lib/session";

export const dynamic = "force-dynamic";
const fresh = { "cache-control": "no-store" };

export async function GET() {
  const address = await currentAddress();
  if (!address) return NextResponse.json({ ok: true, unread: 0 }, { headers: fresh });
  const unread = await unreadFor(address).catch(() => 0);
  return NextResponse.json({ ok: true, unread }, { headers: fresh });
}

export async function POST(req: Request) {
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  /* JSON only: a form on another site cannot send it without asking first. */
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { read?: unknown } | null;
  if (body?.read !== true) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const address = await currentAddress();
  if (!address) return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, read: await markRead(address) }, { headers: fresh });
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
