/**
 * GET /api/cron/notices — the clock that works the outbox
 *
 * V2.0, 6 Oct 2026 · GC-08-DS-001, step 2. Sends what is queued and due
 * (lib/notices/outbox.ts): a message whose first send failed, and anything
 * held back for the morning.
 *
 * Called by Vercel Cron (vercel.json), which presents CRON_SECRET as a
 * bearer token. Without the secret set, or with the wrong one, it does
 * nothing and says so: an unauthenticated address that sends mail is not
 * something to leave on a public site.
 *
 * It reports counts and nothing else. No address and no subject leaves here.
 */
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { deliverDue } from "@/lib/notices/outbox";

export const dynamic = "force-dynamic";

const same = (a: string, b: string) => {
  const x = Buffer.from(a, "utf8"), y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  if (!same(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await deliverDue(50)) }, { headers: { "cache-control": "no-store" } });
  } catch {
    /* The table is not there yet, or the database is not reachable. */
    return NextResponse.json({ ok: false, error: "outbox-unavailable" }, { status: 503 });
  }
}
