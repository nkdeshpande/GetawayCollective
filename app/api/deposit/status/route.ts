/**
 * GET /api/deposit/status?reference=… — where one hold stands
 *
 * V2.0, 6 Oct 2026. The reference is the unguessable id given to the payer
 * on screen and in their receipt; holding it is what entitles someone to
 * read this. It returns no name, no phone and no full address: the estate,
 * the units, the state and a masked address, which is enough for the payer
 * to recognise their own hold and no use to anyone else.
 */
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { depositRowsByReference } from "@/lib/events/store";
import { maskEmail, holdsFrom } from "@/lib/holds";
import { vehicleBySlug } from "@/constants/vehicles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  const reference = new URL(req.url).searchParams.get("reference") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(reference)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const r = holdsFrom(await depositRowsByReference(reference).catch(() => []))[0];
  if (!r) return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
  const v = r.vehicleSlug ? vehicleBySlug(r.vehicleSlug) : undefined;
  return NextResponse.json({
    ok: true,
    reference: r.reference,
    status: r.status,
    units: r.units,
    estate: v?.slug ?? null,
    payee: v?.registeredName ?? null,
    email: maskEmail(r.email),
    openedAt: r.openedAt,
    paidAt: r.paidAt,
  }, { headers: { "cache-control": "no-store" } });
}
