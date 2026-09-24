/**
 * OFF-095 · THE DESK — hand-written, not generated
 *
 * The one Office surface about people who do not yet have a vehicle.
 *
 * ── WHY THIS IS NOT A CRM IN THE USUAL SENSE ─────────────────────────
 * A conventional CRM stores opinions about people: a stage somebody
 * assigned, a score somebody computed, a note somebody typed after a call.
 * Those are judgements, they are rarely revisited, and they are exactly
 * what UX-08 exists to keep away from the person they describe.
 *
 * This stores ACTS. Every row is something that demonstrably happened —
 * an address arrived, from a named surface, at a recorded time. There is
 * no stage field, no score and no free-text opinion.
 *
 * ── 24 SEP 2026: READ AS A PIPELINE OF ACTS ──────────────────────────
 * The workspace redesign groups arrivals by address and places each person
 * at the furthest act they have taken (workspace/desk.tsx) — computed from
 * the rows every time, never stored, so it is a reading of the record and
 * not a new field on a person.
 *
 * ── AND NOT AN INVESTOR EITHER ───────────────────────────────────────
 * A contact is not an Investor. The link is made deliberately, by somebody
 * with authority, and that act is an event.
 */

import { recentContacts, contactCount } from "@/lib/events/store";
import { WsFrame, OFFICE_TABS } from "./workspace/frame";
import { DeskView, type Person } from "./workspace/desk";

export async function ContactDesk() {
  const [rows] = await Promise.all([recentContacts(500), contactCount()]);

  const byEmail = new Map<string, { name: string | null; linked: boolean; arrivals: Person["arrivals"][number][] }>();
  for (const r of rows) {
    const p = byEmail.get(r.email) ?? { name: null, linked: false, arrivals: [] };
    p.name = p.name ?? r.name;
    p.linked = p.linked || !!r.investorId;
    p.arrivals.push({ source: r.source, vehicle: r.vehicleSlug, at: r.receivedAt, note: r.note });
    byEmail.set(r.email, p);
  }
  const people: Person[] = [...byEmail.entries()].map(([email, p]) => ({ email, ...p }));

  return (
    <main className="p-hero-own">
      <WsFrame opening="office" tabs={OFFICE_TABS}>
        <DeskView people={people} arrivals={rows.length} />
      </WsFrame>
    </main>
  );
}
