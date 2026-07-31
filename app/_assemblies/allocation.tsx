/**
 * THE ALLOCATION MATRIX — choosing the size of a position
 *
 * Source interaction: AllocateCapital1.html (signed off). Adapted, not
 * ported. Four things in that file do not survive the design system, and
 * each is worth naming because each was doing work:
 *
 * 1. THREE TILES BECOME TEN. The source offered 10 / 20 / 50%. The
 *    instrument is a 5% minimum unit in 5% steps, so the control has to
 *    be able to express every legal selection. Three tiles would be a
 *    price list; the ladder is the instrument.
 *
 * 2. THE SCRAMBLE IS GONE. Values in the source resolve through a
 *    character-scramble animation on every change. It reads as the
 *    system computing — but the figure is already known, and staging a
 *    delay in front of it is a claim about work that is not happening.
 *    The figures here change on the frame. What is worth animating is
 *    the SELECTION moving, and that is what moves.
 *
 * 3. GOLD AS THE SELECTED STATE BECOMES A MARK PLUS A WEIGHT. Copper is
 *    reserved for money alone (§L1-02), so it cannot double as "this one
 *    is chosen" — and a state carried by colour alone is not a state
 *    everyone can see.
 *
 * 4. THE YIELD FIGURE NO LONGER MOVES WITH THE TILE. The source showed
 *    "10% / 20% / 50% OF PROFIT POOL" against each fraction, which reads
 *    as a better return for a larger cheque. It is the same return on a
 *    larger base. Both numbers are shown, separately labelled.
 *
 * The commitment button and the readout panel are kept exactly as the
 * source arranged them, because that arrangement is right: what is
 * payable today sits beside the total, immediately above the control
 * that acts.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LLP, ALLOCATION, LADDER, MIN_UNIT, UNITS_IN_VEHICLE,
  SUBSCRIBED_UNITS, REMAINING_BPS, DEPOSIT, EQUITY,
  position, toLadder, type Position,
} from "./slowspace";
import { inr } from "./data";
import { ConfidenceTag } from "./atoms";

export const pctOf = (bps: number) => (bps / 100).toFixed(0) + "%";

/* ═══════════════════════════════════════════════════════════════════
   THE LADDER

   A radiogroup, not a row of buttons. Arrow keys move between tiles and
   Tab leaves the group — which is what a person expects of a set of
   mutually exclusive choices, and is not what ten sequential buttons do.
   ═══════════════════════════════════════════════════════════════════ */

function Ladder({
  bps, onPick,
}: {
  bps: number;
  onPick: (bps: number) => void;
}) {
  const move = (dir: number) => {
    const i = LADDER.indexOf(bps);
    const next = LADDER[Math.min(LADDER.length - 1, Math.max(0, i + dir))];
    if (next !== undefined) onPick(next);
  };

  return (
    <div
      className="alloc-ladder"
      role="radiogroup"
      aria-label="Size of position, as a share of the vehicle"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); }
        if (e.key === "Home") { e.preventDefault(); onPick(LADDER[0]); }
        if (e.key === "End") { e.preventDefault(); onPick(LADDER[LADDER.length - 1]); }
      }}
    >
      {LADDER.map((b) => {
        const p = position(b);
        const off = !p.available;
        return (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={b === bps}
            aria-disabled={off}
            tabIndex={b === bps ? 0 : -1}
            className={"alloc-tile" + (b === bps ? " on" : "") + (off ? " off" : "")}
            onClick={() => { if (!off) onPick(b); }}
          >
            {/* The selected state is a filled rule AND a weight change AND
                the aria state. Never the fill alone. */}
            <span className="mark" aria-hidden="true" />
            <span className="p">{pctOf(b)}</span>
            <span className="u t-mono-s">
              {b / ALLOCATION.minBps}&thinsp;&times;&thinsp;{inr(MIN_UNIT)}
            </span>
            {off ? <span className="x t-mono-s">Unavailable</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THE READOUT
   ═══════════════════════════════════════════════════════════════════ */

function Readout({ p }: { p: Position }) {
  return (
    <div className="alloc-read">
      <div className="lead">
        <span className="t-micro label">Total commitment</span>
        <div className="t-display-l money">{inr(p.commitment)}</div>
        <span className="t-body-s dim">
          {p.units} unit{p.units === 1 ? "" : "s"} of {inr(MIN_UNIT)} &middot;{" "}
          {pctOf(p.bps)} of {LLP.name}
        </span>
      </div>

      <div className="kv">
        <span className="label t-micro">Payable on the platform today</span>
        <span className="v money">{inr(p.deposit)}</span>
      </div>
      <div className="kv">
        <span className="label t-micro">Balance, completed off the platform</span>
        <span className="v money">{inr(p.balance)}</span>
      </div>
      <div className="kv">
        <span className="label t-micro">Share of the partner distribution</span>
        <span className="v">{pctOf(p.bps)}</span>
      </div>
      <div className="kv">
        <span className="label t-micro">
          Indicative annual distribution
          <span className="alloc-conf"><ConfidenceTag c="modelled" /></span>
        </span>
        <span className="v money">{inr(p.distribution)}</span>
      </div>
      <div className="kv">
        <span className="label t-micro">Return on the commitment</span>
        <span className="v">
          <span className="prov">~</span>{(p.yieldBps / 100).toFixed(2)}%
        </span>
      </div>
      <div className="kv">
        <span className="label t-micro">Entitlement, from handover</span>
        <span className="v nights">{p.nights.min}&ndash;{p.nights.max} nights</span>
      </div>
      <div className="kv">
        <span className="label t-micro">Voting weight</span>
        <span className="v">{pctOf(p.bps)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THE MATRIX
   ═══════════════════════════════════════════════════════════════════ */

export function AllocationMatrix({
  bps, onPick, go,
}: {
  bps: number;
  onPick: (bps: number) => void;
  /** Where the chosen size is carried to. Omitted where the size is being reviewed rather than chosen. */
  go?: { t: string; to: string };
}) {
  const p = position(bps);

  return (
    <div className="alloc">
      <div className="alloc-head">
        <div>
          <span className="t-micro label">Size of position</span>
          <p className="t-body dim" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "58ch" }}>
            {pctOf(ALLOCATION.minBps)} is the minimum unit and the increment. The equity layer of{" "}
            <span className="money">{inr(EQUITY)}</span> is {UNITS_IN_VEHICLE} of them, so a
            selection is a whole number of units and nothing is left over.
          </p>
        </div>
        <div className="alloc-cap">
          <span className="t-mono-s dim">
            {SUBSCRIBED_UNITS} of {UNITS_IN_VEHICLE} units subscribed
          </span>
          <div className="alloc-bar" aria-hidden="true">
            <span style={{ width: `${100 - REMAINING_BPS / 100}%` }} />
          </div>
          <span className="t-mono-s dim">{pctOf(REMAINING_BPS)} remains</span>
        </div>
      </div>

      <Ladder bps={p.bps} onPick={onPick} />

      {/* TWO CEILINGS, TWO REASONS.
          A tile can be off because the vehicle has none left, or absent
          because the constitution does not permit it. Collapsing them
          into one greyed-out row would tell a reader the wrong thing
          about which one they are up against. */}
      <div className="alloc-limits">
        <p className="t-body-s dim">
          <strong>{pctOf(REMAINING_BPS)} remains unsubscribed.</strong> Larger selections are shown
          and disabled rather than hidden — what the vehicle has left is a fact about today, and it
          changes.
        </p>
        <p className="t-body-s dim">
          <strong>{pctOf(ALLOCATION.maxBps)} is the ceiling.</strong> Above it a single partner
          carries every ordinary resolution alone (&sect;24a needs more than half), and the register
          votes for the record only. At exactly {pctOf(ALLOCATION.maxBps)} that partner can block
          anything and carry nothing.
        </p>
      </div>

      <div className="alloc-body">
        <Readout p={p} />

        <div className="alloc-side">
          <div className="alloc-gov">
            <span className="t-micro label">What this holding can do</span>
            {p.control.map((c) => (
              <div className={"g " + c.kind} key={c.t}>
                <span className="t-body-s">{c.t}</span>
              </div>
            ))}
            <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              Derived from the thresholds in &sect;24a, not written per size. Ordinary carries above
              50%, special at 76% — so a special resolution is blocked from above 24%.
            </p>
          </div>

          <p className="t-body-s dim">
            The {inr(DEPOSIT.amount)} is flat. It holds a {pctOf(ALLOCATION.minBps)} position and a{" "}
            {pctOf(ALLOCATION.maxBps)} position alike, and it does not scale with what you select.
          </p>
          <p className="t-body-s dim">
            The return on the commitment does not improve with size. A larger selection is a larger
            share of the same pool at the same rate.
          </p>

          {go ? (
            <Link
              className="btn primary"
              href={`${go.to}?share=${p.bps}`}
              aria-disabled={!p.available}
              style={p.available ? undefined : { pointerEvents: "none", opacity: 0.45 }}
            >
              {go.t}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THE BAR — the same choice, on the screens that are not about choosing

   The offering page is where a size is picked. Accreditation and the
   risk disclosure are about something else, and putting the full matrix
   on them would say otherwise.

   But the copy on the offering page promises the size can be changed at
   any point before the commitment, and a promise the interface does not
   keep is worse than one it never made. So the ladder is here, closed —
   one line stating what is selected, opening to the same control.
   ═══════════════════════════════════════════════════════════════════ */

export function AllocationBar({
  bps, onPick, locked = false,
}: {
  bps: number;
  onPick: (bps: number) => void;
  /** Past the point of change. States why rather than vanishing. */
  locked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const p = position(bps);

  return (
    <div className="alloc-bar-row">
      <div className="in">
        <span className="t-micro label">Position</span>
        <span className="t-mono">{pctOf(p.bps)}</span>
        <span className="money">{inr(p.commitment)}</span>
        <span className="t-mono-s dim">
          {p.units} &times; {inr(MIN_UNIT)} &middot; {inr(p.deposit)} today
        </span>
        {locked ? (
          <span className="t-mono-s dim">Fixed at this step</span>
        ) : (
          <button
            type="button"
            className="btn"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Change size"}
          </button>
        )}
      </div>
      {open && !locked ? (
        <>
          <Ladder bps={p.bps} onPick={onPick} />
          <p className="t-body-s dim" style={{ padding: "var(--gc-sp-s) var(--gc-sp-m)" }}>
            Changing the size here changes every figure on this page. Nothing has been committed —
            the commitment is the last screen, and it is the only one that moves capital.
          </p>
        </>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARRYING THE SELECTION BETWEEN SCREENS

   A query parameter, not a store. The flow is four pages and a person
   who sends someone the second one should be sending them the size they
   were looking at — a client-side store makes that link mean something
   different for the sender and the receiver.

   `useSearchParams` is deliberately NOT used: it opts the whole route
   out of static rendering, and these pages are otherwise static. Reading
   the value on mount costs one frame of the default, which is the right
   trade for four public pages that are then served from the edge.
   ═══════════════════════════════════════════════════════════════════ */

export function useShare(): [number, (bps: number) => void] {
  /* Explicitly `number`. ALLOCATION is `as const`, so the inferred state
     type would be the literal 1000 and every other rung on the ladder
     would fail to assign. */
  const [bps, setBps] = useState<number>(ALLOCATION.defaultBps);
  const [read, setRead] = useState(false);

  if (!read && typeof window !== "undefined") {
    setRead(true);
    const q = new URLSearchParams(window.location.search).get("share");
    if (q !== null) setBps(toLadder(q));
  }

  /* The URL follows the selection so a reload, a share or a back button
     lands on the same size. replaceState, not push: ten tiles would
     otherwise put ten entries in history between two pages. */
  const pick = (next: number) => {
    const b = toLadder(next);
    setBps(b);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("share", String(b));
      window.history.replaceState(null, "", url);
    }
  };

  return [bps, pick];
}

/** Append the chosen size to a flow link. One place, so no link forgets. */
export const withShare = (to: string, bps: number) => `${to}?share=${bps}`;
