/**
 * THE DESK, AS A PIPELINE OF ACTS — 24 Sep 2026
 *
 * The desk's rule stands (contactdesk.tsx): it records what happened, never
 * what anyone concluded — no stage somebody assigned, no score, no note
 * about a person. What this adds is only a way to READ the acts: each
 * address is placed at the furthest thing it has actually done, and that
 * is computed from the recorded arrivals every time, so it cannot be set,
 * edited or argued with.
 *
 *   Reads the Signal → Asked for the pack / On a waitlist → Started a
 *   deposit → Paid a deposit
 *
 * The last two come from /api/deposit and its verified confirmations.
 */

"use client";

import { useMemo, useState } from "react";

export interface Arrival { readonly source: string; readonly vehicle: string | null; readonly at: string; readonly note: string | null }
export interface Person { readonly email: string; readonly name: string | null; readonly arrivals: readonly Arrival[]; readonly linked: boolean }

export const STEP: Readonly<Record<string, { readonly rank: number; readonly label: string }>> = {
  signal: { rank: 0, label: "Reads the Signal" },
  iris: { rank: 0, label: "Asked IRIS" },
  dossier: { rank: 1, label: "Asked for the pack" },
  waitlist: { rank: 1, label: "On a waitlist" },
  "deposit-intent": { rank: 2, label: "Started a deposit" },
  "deposit-paid": { rank: 3, label: "Paid a deposit" },
  "deposit-captured": { rank: 3, label: "Paid a deposit" },
};
const LANES = [
  { rank: 0, label: "Listening", sub: "The Signal or IRIS" },
  { rank: 1, label: "Asking", sub: "Pack requested or waitlisted" },
  { rank: 2, label: "Holding", sub: "Started a deposit" },
  { rank: 3, label: "Deposited", sub: "Paid, verified by Razorpay" },
] as const;

const furthest = (p: Person) => p.arrivals.reduce((best, a) => Math.max(best, STEP[a.source]?.rank ?? 0), 0);
const latest = (p: Person) => p.arrivals.reduce((t, a) => (a.at > t ? a.at : t), "");
const days = (iso: string) => {
  const d = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  return Number.isNaN(d) ? "—" : d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
};

export function DeskView({ people, arrivals, preview = false }: { people: readonly Person[]; arrivals: number; preview?: boolean }) {
  const [lane, setLane] = useState<number | null>(null);
  const [estate, setEstate] = useState<string>("all");
  const estates = useMemo(() => [...new Set(people.flatMap((p) => p.arrivals.map((a) => a.vehicle).filter(Boolean) as string[]))].sort(), [people]);
  const counts = LANES.map((l) => people.filter((p) => furthest(p) === l.rank).length);
  const shown = people
    .filter((p) => lane === null || furthest(p) === lane)
    .filter((p) => estate === "all" || p.arrivals.some((a) => a.vehicle === estate))
    .slice().sort((a, b) => furthest(b) - furthest(a) || latest(b).localeCompare(latest(a)));

  return (
    <div className="desk">
      <header className="ws-head">
        <div>
          <span className="eb">Contacts</span>
          <h1 className="ws-h1">Everyone who has <span>reached us.</span></h1>
          <p>Each address sits at the furthest thing it has actually done. Nothing here is a judgement about a person: no stage anyone set, no score, no private note.</p>
        </div>
        <div className="ws-figs">
          <div><b>{people.length}</b><span>People</span></div>
          <div><b>{arrivals}</b><span>Arrivals</span></div>
          <div><b>{people.filter((p) => !p.linked).length}</b><span>Not yet linked to an investor</span></div>
        </div>
      </header>

      <div className="desk-lanes" role="group" aria-label="Filter by furthest step">
        {LANES.map((l, i) => (
          <button key={l.rank} type="button" aria-pressed={lane === l.rank} onClick={() => setLane(lane === l.rank ? null : l.rank)}>
            <span>{String(i + 1).padStart(2, "0")}</span><b>{l.label}</b><em>{counts[i]}</em><small>{l.sub}</small>
          </button>
        ))}
      </div>

      {estates.length ? (
        <div className="desk-estates" role="group" aria-label="Filter by estate">
          <button type="button" aria-pressed={estate === "all"} onClick={() => setEstate("all")}>All estates</button>
          {estates.map((e) => <button key={e} type="button" aria-pressed={estate === e} onClick={() => setEstate(e)}>{e.replace(/-/g, " ")}</button>)}
        </div>
      ) : null}

      {people.length === 0 ? (
        <div className="ws-card desk-empty"><h2>Nothing has arrived yet.</h2><p>The Signal, the pack request, the waitlist and the deposit all write here. If you expected an arrival and see none, the database may not be connected to this deployment.</p></div>
      ) : (
        <div className="desk-list">
          {shown.map((p) => {
            const f = furthest(p);
            return (
              <article key={p.email} className={`ws-card desk-row r-${f}`}>
                <div className="desk-who"><b>{p.name ?? p.email}</b><span className="mono">{p.name ? p.email : ""}</span></div>
                <div className="desk-step"><i aria-hidden="true"><span style={{ width: `${(f + 1) * 25}%` }} /></i><b>{LANES[f].label}</b><span>{p.arrivals.length > 1 ? `${p.arrivals.length} arrivals` : "1 arrival"} · last {days(latest(p))}</span></div>
                <ol className="desk-trail">
                  {p.arrivals.slice().sort((a, b) => a.at.localeCompare(b.at)).map((a, i) => (
                    <li key={i}><b>{STEP[a.source]?.label ?? a.source}</b>{a.vehicle ? <span> · {a.vehicle.replace(/-/g, " ")}</span> : null}<em>{days(a.at)}</em></li>
                  ))}
                </ol>
                <div className="desk-link">{p.linked ? <span className="ok">Linked to an investor</span> : <span>Not linked</span>}</div>
              </article>
            );
          })}
        </div>
      )}
      <p className="ws-note">{preview ? "Example people, for the design preview only. " : ""}Linking a contact to an investor is a deliberate act by someone with authority, and it is recorded when it happens.</p>
    </div>
  );
}

/** Example people for the design preview. Plainly examples; never shown on a real route. */
export const EXAMPLE_PEOPLE: readonly Person[] = [
  { email: "a.rao@example.com", name: "Anika Rao", linked: false, arrivals: [
    { source: "signal", vehicle: null, at: "2026-09-02T09:00:00Z", note: null },
    { source: "dossier", vehicle: "coorg-coffee-creek", at: "2026-09-18T11:00:00Z", note: null },
    { source: "deposit-intent", vehicle: "coorg-coffee-creek", at: "2026-09-23T08:30:00Z", note: null },
    { source: "deposit-paid", vehicle: "coorg-coffee-creek", at: "2026-09-23T08:34:00Z", note: null }] },
  { email: "k.menon@example.com", name: "Kiran Menon", linked: false, arrivals: [
    { source: "dossier", vehicle: "coorg-coffee-creek", at: "2026-09-20T14:00:00Z", note: null },
    { source: "deposit-intent", vehicle: "coorg-coffee-creek", at: "2026-09-24T10:10:00Z", note: null }] },
  { email: "s.iyer@example.com", name: "Sana Iyer", linked: true, arrivals: [
    { source: "waitlist", vehicle: "slowspace-coastal", at: "2026-09-11T16:00:00Z", note: null }] },
  { email: "d.shetty@example.com", name: null, linked: false, arrivals: [
    { source: "signal", vehicle: null, at: "2026-09-21T07:00:00Z", note: null }] },
  { email: "m.kapoor@example.com", name: "Meera Kapoor", linked: false, arrivals: [
    { source: "dossier", vehicle: null, at: "2026-09-12T12:00:00Z", note: null },
    { source: "dossier", vehicle: "slowspace-solace", at: "2026-09-19T12:00:00Z", note: null }] },
];
