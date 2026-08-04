/**
 * GET /api/atlas?vehicle=… — ATLAS findings for one vehicle
 *
 * ── WHY AN ENDPOINT AND NOT A SERVER RENDER ──────────────────────────
 * The office workspace is a client component — it reads search params and
 * holds view state — so it cannot await a database read inline. The
 * findings are computed on the server and fetched, which keeps the event
 * log where it belongs and sends only the governed objects.
 *
 * ── IT AUTHORISES ITSELF ─────────────────────────────────────────────
 * The route-table guard covers pages. The middleware matcher excludes
 * /api, so every endpoint is responsible for its own gate, and this one
 * needs a real gate: ATLAS findings quote reserve positions, blocked
 * distributions and grant holders. UX-08 forbids administrative leakage,
 * and a finding is administrative by definition.
 *
 * The check is `accessOfSubject`, the same resolver every office page
 * gates on, rather than a right invented for this endpoint. RBAC LAW 1
 * holds that a role only makes a grant eligible — office access is
 * derived from holding at least one live grant, and reproducing that
 * derivation here with a second rule is how an endpoint and a page come
 * to disagree about who may look.
 *
 * ── NOTHING HERE WRITES ──────────────────────────────────────────────
 * GET, and the module imports no command and no handler. ATLAS's whole
 * posture is that it returns objects and somebody else decides. An
 * endpoint that could act on its own findings would be the invisible
 * agent action FIX-10 names, with a URL.
 */

import { NextResponse } from "next/server";
import { currentSubject } from "@/lib/session";
import { accessOfSubject } from "@/lib/access";
import { eventsForObject } from "@/lib/events/store";
import { atlasDesk } from "@/lib/ai/atlas";
import { money } from "@/lib/money";

export const runtime = "nodejs";
/* Never cached. A cached finding reports the vehicle as it was when the
   cache was written, and the one thing a finding must be is current. */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const subject = await currentSubject();
  /* Fails closed: an unresolved subject is anonymous and holds nothing. */
  if (accessOfSubject(subject) !== "office") {
    return NextResponse.json({ ok: false, error: "not-permitted" }, { status: 403 });
  }

  const vehicle = new URL(req.url).searchParams.get("vehicle")?.trim();
  if (!vehicle) {
    return NextResponse.json({ ok: false, error: "vehicle-required" }, { status: 400 });
  }

  const events = await eventsForObject("InvestmentVehicle", vehicle).catch(() => []);

  /*
   * The reserve floor is L1-16 §2.3 — the greater of six months of
   * non-operational obligations and the board-approved minimum. Neither
   * is modelled yet, so there is nothing honest to read.
   *
   * Zero is the deliberate choice rather than a guess at a real floor. A
   * floor of zero makes `band()` return Healthy and `breachResponse()`
   * return null, so ATLAS reports the reserve position as a fact and
   * raises no breach it cannot substantiate. Inventing a plausible floor
   * would manufacture escalations — or worse, silence a real one.
   */
  const reserveFloor = money("0");

  const findings = atlasDesk({
    vehicleId: vehicle,
    events,
    reserveFloor,
    at: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      ok: true,
      vehicle,
      eventCount: events.length,
      /* Said out loud, because "nothing to raise" over an empty log and
         "nothing to raise" over a healthy vehicle are different findings
         and look identical. */
      note:
        events.length === 0
          ? "No events are recorded for this vehicle. Findings are computed over an empty log."
          : undefined,
      reserveFloorModelled: false,
      findings,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
