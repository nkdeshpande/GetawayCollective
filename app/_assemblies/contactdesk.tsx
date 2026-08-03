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
 * no stage field, no score and no free-text opinion, because the moment
 * one exists the desk becomes a private file on a person rather than a
 * record of what passed between them and GC.
 *
 * ── AND NOT AN INVESTOR EITHER ───────────────────────────────────────
 * A contact is not an Investor. The L2 sheet holds that there is ONE
 * Investor identity before and after settlement, and manufacturing one
 * from an unverified address would put a stranger inside the ratified
 * object that carries `member_state`. The link is made deliberately, by
 * somebody with authority, and that act is an event.
 *
 * ── WHAT A JUNIOR DESK NEEDS AND GETS ────────────────────────────────
 * Who arrived, from where, how long ago, and whether they have come back.
 * A repeat address is the single most useful signal on this page: it is
 * someone asking twice, which is the closest thing to intent that an
 * anonymous form can honestly produce.
 */

import { recentContacts, contactCount } from "@/lib/events/store";
import type { ContactRow } from "@/lib/events/store";

const SOURCE_LABEL: Record<string, string> = {
  signal: "The Signal",
  dossier: "Dossier request",
  iris: "IRIS",
};

/** Whole days since arrival. Age is the only urgency this page asserts. */
function ageDays(iso: string): number {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return NaN;
  return Math.floor((Date.now() - then) / 86_400_000);
}

function ageLabel(n: number): string {
  if (Number.isNaN(n)) return "—";
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  return `${n} days ago`;
}

export async function ContactDesk() {
  const [rows, distinct] = await Promise.all([recentContacts(200), contactCount()]);

  /* Repeats are counted here rather than queried, because the desk reads
     at most a couple of hundred rows and a second round trip to learn
     something already in hand is a round trip for nothing. */
  const byEmail = new Map<string, number>();
  for (const r of rows) byEmail.set(r.email, (byEmail.get(r.email) ?? 0) + 1);

  const unlinked = rows.filter((r) => !r.investorId).length;

  return (
    <main className="system-page">
      <header className="desk-head">
        <span className="eyebrow">OFF-095 · Office</span>
        <h1>The Desk</h1>
        <p className="lede">
          Everyone who has reached Getaway Collective and does not yet hold a position. A contact is
          not an Investor — the link is made deliberately, by somebody with the authority to make it.
        </p>
      </header>

      <section className="desk-figures">
        <Figure n={distinct} label="Distinct addresses" />
        <Figure n={rows.length} label="Arrivals recorded" />
        <Figure n={unlinked} label="Not yet linked" />
      </section>

      {rows.length === 0 ? (
        <section className="desk-empty">
          <h2>Nothing has arrived yet.</h2>
          <p>
            The Signal and the dossier request both write here. If you expected an arrival and see
            none, check that <code>DATABASE_URL</code> is set — the forms record before they send,
            so a contact survives a mail failure but not a missing database.
          </p>
        </section>
      ) : (
        <section className="desk-list">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Name</th>
                <th>Came from</th>
                <th>Arrived</th>
                <th>Times</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Row key={r.contactId} r={r} times={byEmail.get(r.email) ?? 1} />
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="desk-note">
        This page records what happened, not what anyone concluded. There is no stage, no score and
        no note field — a judgement about a person, stored where they cannot see it and nobody
        revisits it, is the thing UX-08 exists to prevent.
      </p>
    </main>
  );
}

function Figure({ n, label }: { n: number; label: string }) {
  return (
    <div className="desk-figure">
      <b>{n}</b>
      <span>{label}</span>
    </div>
  );
}

function Row({ r, times }: { r: ContactRow; times: number }) {
  const days = ageDays(r.receivedAt);
  return (
    <tr>
      <td className="mono">{r.email}</td>
      <td>{r.name ?? <span className="dim">—</span>}</td>
      <td>
        {SOURCE_LABEL[r.source] ?? r.source}
        {r.vehicleSlug ? <span className="dim"> · {r.vehicleSlug}</span> : null}
        {r.note ? <span className="dim"> · {r.note}</span> : null}
      </td>
      <td className="mono">{ageLabel(days)}</td>
      <td className="mono">
        {/* The one signal an anonymous form can honestly produce: they
            came back. Stated as a count, never as a score. */}
        {times > 1 ? <strong>{times}×</strong> : <span className="dim">1</span>}
      </td>
    </tr>
  );
}
