/**
 * POST /api/office/records — the investor record's six acts, wired.
 *
 * 25 Sep 2026. The second route that writes (after /api/office/property)
 * and the first that writes the institutional tables. Everything that
 * decides lives in lib/office-records.ts: this file only identifies the
 * caller, routes the act, and reports the answer as written.
 *
 * Like the property route, it checks no right itself. `execute()` does,
 * inside the envelope, and a second check here would be a second place to
 * get it wrong.
 *
 * The response never echoes the body. A request carrying a PAN or an
 * account number gets back an id and event types, nothing else.
 */
import { NextResponse } from "next/server";
import {
  currentActor, formVehicle, recordBank, recordKyc, recordPosition, registerInvestor, registerOrganization, type ActResult,
} from "@/lib/office-records";

const ACTS = ["organization", "estate", "investor", "kyc", "bank", "position"] as const;
type Act = (typeof ACTS)[number];

export async function POST(req: Request) {
  const actor = await currentActor();
  /* I-01 before the body is read. */
  if (!actor) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { act?: string; investorId?: string } | null;
  const which = body?.act as Act | undefined;
  if (!body || !which || !ACTS.includes(which)) return NextResponse.json({ ok: false, error: "Unknown act." }, { status: 400 });
  const person = String(body.investorId ?? "");

  const result: ActResult =
    which === "organization" ? await registerOrganization(actor, body)
    : which === "estate" ? await formVehicle(actor, body)
    : which === "investor" ? await registerInvestor(actor, body)
    : which === "kyc" ? await recordKyc(actor, person, body)
    : which === "bank" ? await recordBank(actor, person, body)
    : await recordPosition(actor, person, body);

  return result.ok
    ? NextResponse.json({ ok: true, id: result.objectId, events: result.events })
    : NextResponse.json({ ok: false, error: result.error }, { status: result.status });
}
