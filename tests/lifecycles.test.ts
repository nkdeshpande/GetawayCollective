/**
 * State machines — Wave 3 · Graph & Lifecycle
 *
 * A-05: asset lifecycle is legal. These assert the machine refuses illegal
 * moves and, where a transition claims to be irreversible, that no path home
 * exists — the failure that surfaces in an audit rather than in testing.
 */

import { describe, it, expect } from "vitest";
import {
  MACHINES, PROPERTY_LIFECYCLE, VEHICLE_LIFECYCLE, COMMITMENT_LIFECYCLE,
  OFFERING_LIFECYCLE, ACCREDITATION_LIFECYCLE, MEMBER_LIFECYCLE,
  assertTransition, mayTransition, legalTransitions, reachableStates,
  reachesFrom, machineFor, TransitionError, explainMachine,
} from "../lib/state-machines";

describe("Property lifecycle (A-05)", () => {
  const m = PROPERTY_LIFECYCLE;

  it("permits the ordinary path", () => {
    expect(mayTransition(m, "prospecting", "pending")).toBe(true);
    expect(mayTransition(m, "pending", "acquired")).toBe(true);
    expect(mayTransition(m, "acquired", "stabilised")).toBe(true);
  });

  it("REFUSES a jump that would skip acquisition terms", () => {
    // prospecting -> exited would skip A-04 acquisition terms and every
    // diligence gate, and leave an asset in the portfolio with no record
    // of what was paid or why.
    expect(() => assertTransition(m, "prospecting", "exited")).toThrow(TransitionError);
  });

  it("names the legal moves when it refuses", () => {
    try {
      assertTransition(m, "acquired", "exited");
      throw new Error("should have thrown");
    } catch (e) {
      expect((e as Error).message).toContain("you may go to");
      expect((e as Error).message).toContain("development");
    }
  });

  it("treats exited as terminal", () => {
    expect(legalTransitions(m, "exited")).toEqual([]);
    expect(() => assertTransition(m, "exited", "stabilised")).toThrow(/terminal/);
  });

  it("allows a pending property back to prospecting — nothing was acquired", () => {
    expect(mayTransition(m, "pending", "prospecting")).toBe(true);
  });

  it("does NOT allow an acquired property back to pending", () => {
    // The Acquisition record is immutable (A-04). Reversing would leave it
    // describing an acquisition that, on the record, never happened.
    expect(mayTransition(m, "acquired", "pending")).toBe(false);
    expect(reachesFrom(m, "acquired", "pending")).toBe(false);
  });

  it("cannot un-stabilise", () => {
    // Stabilisation permanently narrows what a capital call may fund (F-16).
    // A route back would reopen working-capital calls.
    expect(reachesFrom(m, "stabilised", "acquired")).toBe(false);
  });

  it("allows a withdrawn sale to return to operation", () => {
    expect(mayTransition(m, "disposition_pending", "stabilised")).toBe(true);
  });

  it("rejects states that are not part of the machine", () => {
    expect(() => assertTransition(m, "prospecting", "demolished")).toThrow(/not a state/);
  });
});

describe("Vehicle lifecycle", () => {
  const m = VEHICLE_LIFECYCLE;

  it("cannot return to raising once capital is deployed", () => {
    // F-03: deployed capital never reverts to committed.
    expect(reachesFrom(m, "deployed", "raising")).toBe(false);
  });

  it("dissolution is terminal", () => {
    expect(legalTransitions(m, "dissolved")).toEqual([]);
  });

  it("permits winding down to reverse while assets are still held", () => {
    expect(mayTransition(m, "winding_down", "stabilised")).toBe(true);
  });
});

describe("Commitment lifecycle (L1-01 §24b)", () => {
  const m = COMMITMENT_LIFECYCLE;

  it("distinguishes offered from accepted — the whole ruling turns on it", () => {
    expect(m.states).toContain("offered");
    expect(m.states).toContain("accepted");
  });

  it("has three terminal outcomes", () => {
    expect([...m.terminal].sort()).toEqual(["lapsed", "settled", "withdrawn"]);
  });

  it("cannot un-accept a commitment", () => {
    // Expiry after lawful acceptance does not invalidate it (F-10).
    expect(reachesFrom(m, "accepted", "offered")).toBe(false);
  });

  it("lapse and withdrawal are both reachable from offered", () => {
    expect(mayTransition(m, "offered", "lapsed")).toBe(true);
    expect(mayTransition(m, "offered", "withdrawn")).toBe(true);
  });

  it("settlement comes only from acceptance", () => {
    expect(mayTransition(m, "offered", "settled")).toBe(false);
    expect(mayTransition(m, "accepted", "settled")).toBe(true);
  });
});

describe("Member Law (I-08)", () => {
  const m = MEMBER_LIFECYCLE;

  it("promotes via settlement, not acceptance", () => {
    // A commitment can be accepted and never funded. Promoting at
    // acceptance would make a Member of someone who never paid.
    const t = m.transitions.find((x) => x.to === "member")!;
    expect(t.via).toBe("DeployCapital");
    expect(t.guard).toContain("SETTLED");
  });

  it("is irreversible — membership records history, not balance", () => {
    expect(reachesFrom(m, "member", "investor")).toBe(false);
    expect(m.transitions.find((t) => t.to === "member")!.reversible).toBe(false);
  });

  it("has member as terminal", () => {
    expect(legalTransitions(m, "member")).toEqual([]);
  });
});

describe("Accreditation lifecycle", () => {
  const m = ACCREDITATION_LIFECYCLE;

  it("is deliberately re-enterable — expiry is normal, not exceptional", () => {
    // Fifteen working days. Expiry is the usual case, not a failure state.
    expect(m.terminal).toEqual([]);
    expect(mayTransition(m, "expired", "in_review")).toBe(true);
  });

  it("cannot go straight from none to accredited", () => {
    expect(mayTransition(m, "none", "accredited")).toBe(false);
  });
});

describe("Offering lifecycle", () => {
  const m = OFFERING_LIFECYCLE;

  it("cannot reopen a closed offering", () => {
    // Reopening would let later commitments join on stale disclosed terms.
    expect(reachesFrom(m, "closed", "open")).toBe(false);
  });

  it("can be pulled back to draft before any commitment is accepted", () => {
    expect(mayTransition(m, "open", "draft")).toBe(true);
  });
});

describe("every machine is structurally sound", () => {
  for (const m of MACHINES) {
    it(`${m.name}: every state is reachable from ${m.initial}`, () => {
      const seen = reachableStates(m);
      const dead = m.states.filter((s) => !seen.has(s));
      expect(dead).toEqual([]);
    });

    it(`${m.name}: terminal states have no way out`, () => {
      for (const s of m.terminal) expect(legalTransitions(m, s)).toEqual([]);
    });

    it(`${m.name}: every non-terminal state has a way out`, () => {
      const stuck = m.states.filter(
        (s) => !m.terminal.includes(s) && legalTransitions(m, s).length === 0,
      );
      expect(stuck).toEqual([]);
    });

    it(`${m.name}: irreversible transitions have no path home`, () => {
      const broken = m.transitions
        .filter((t) => !t.reversible && reachesFrom(m, t.to, t.from))
        .map((t) => `${t.from}->${t.to}`);
      expect(broken).toEqual([]);
    });

    it(`${m.name}: every transition states a guard`, () => {
      const thin = m.transitions.filter((t) => !t.guard || t.guard.length < 15);
      expect(thin).toEqual([]);
    });
  }

  it("machines are addressable by name", () => {
    expect(machineFor("Property")).toBe(PROPERTY_LIFECYCLE);
    expect(machineFor("Nonexistent")).toBeUndefined();
  });

  it("explains itself readably", () => {
    const s = explainMachine(MEMBER_LIFECYCLE);
    expect(s).toContain("irreversible");
    expect(s).toContain("investor -> member");
  });
});
