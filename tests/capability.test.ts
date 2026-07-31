/**
 * Capability layer tests — Wave 2 · L5
 *
 * These assert the constitutional envelope actually closes: that authority
 * is required rather than assumed, that silence is impossible, and that the
 * secrecy/transparency split holds in both directions.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  authorise, whoCan, separationViolations, SessionAudit,
  ENTERPRISE, vehicleScope, Grant,
} from "../lib/authority";
import { EventLog, validateEvent, EventEnvelope, EventValidationError } from "../lib/events";
import { Ledger, LedgerError, LedgerEntry } from "../lib/ledger";
import { Ballot_Box, publish, conflictGate, GovernanceError } from "../lib/governance";
import { execute, CAPABILITIES, CapabilityError, __resetEventSeq } from "../lib/commands";
import { BusinessObjectType as BO } from "../constants/business-objects";
import { money, format } from "../lib/money";

const NOW = "2026-07-31T10:00:00.000Z";
const V1 = "vehicle-1";

const grant = (o: Partial<Grant> = {}): Grant => ({
  grantId: "g1", identityId: "alice", role: "executive_office",
  scope: ENTERPRISE, grantedBy: "board", grantedAt: "2026-01-01T00:00:00.000Z", ...o,
});

// ─────────────────────────────────────────────────────────────────────
describe("authority (I-01, I-02)", () => {
  it("denies an unauthenticated actor, and says so specifically", () => {
    const d = authorise(null, "capital.call", ENTERPRISE, [grant()], NOW);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("Unauthenticated");
  });

  it("denies an authenticated actor with no grant — absence is a denial", () => {
    const d = authorise("bob", "capital.call", ENTERPRISE, [grant()], NOW);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("I-02");
  });

  it("allows only via an explicit grant, and names it", () => {
    const d = authorise("alice", "capital.call", ENTERPRISE, [grant()], NOW);
    expect(d.allowed).toBe(true);
    expect(d.viaGrant).toBe("g1");
  });

  it("denies a right the granted role does not carry", () => {
    const d = authorise("alice", "policy.approve", ENTERPRISE, [grant()], NOW);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("do not carry");
  });

  it("enterprise scope reaches INTO a vehicle", () => {
    expect(authorise("alice", "capital.call", vehicleScope(V1), [grant()], NOW).allowed).toBe(true);
  });

  it("vehicle scope does NOT reach out to the enterprise (E-07)", () => {
    const g = grant({ scope: vehicleScope(V1) });
    expect(authorise("alice", "capital.call", ENTERPRISE, [g], NOW).allowed).toBe(false);
  });

  it("a vehicle grant does not leak into another vehicle", () => {
    const g = grant({ scope: vehicleScope(V1) });
    expect(authorise("alice", "capital.call", vehicleScope("vehicle-2"), [g], NOW).allowed).toBe(false);
  });

  it("respects expiry and revocation", () => {
    expect(authorise("alice", "capital.call", ENTERPRISE, [grant({ expiresAt: "2026-01-02T00:00:00.000Z" })], NOW).allowed).toBe(false);
    expect(authorise("alice", "capital.call", ENTERPRISE, [grant({ revokedAt: "2026-06-01T00:00:00.000Z" })], NOW).allowed).toBe(false);
  });

  it("answers the audit question: who can do X here?", () => {
    const who = whoCan("capital.call", vehicleScope(V1), [grant(), grant({ grantId: "g2", identityId: "carol" })], NOW);
    expect(who.map((w) => w.identityId).sort()).toEqual(["alice", "carol"]);
  });

  it("no role holds a separation-of-powers triad (GP-06)", () => {
    expect(separationViolations()).toEqual([]);
  });
});

describe("session audit (I-04)", () => {
  let audit: SessionAudit;
  beforeEach(() => { audit = new SessionAudit(); });

  it("records denied attempts, not only successes", () => {
    audit.open("s1", "alice", NOW);
    audit.record("s1", "CallCapital", NOW, false);
    audit.record("s1", "OpenOffering", NOW, true);
    // A log of only successes cannot answer "did someone repeatedly try
    // something they could not do?" — the question a review actually asks.
    expect(audit.deniedAttempts("alice")).toEqual([{ command: "CallCapital", at: NOW }]);
  });

  it("freezes the record once the session closes", () => {
    audit.open("s1", "alice", NOW);
    audit.close("s1", NOW);
    expect(() => audit.record("s1", "CallCapital", NOW, true)).toThrow(/immutable/);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("events (E-01, E-02)", () => {
  const base = (o: Partial<EventEnvelope> = {}): EventEnvelope => ({
    eventId: "e1", type: "PropertyRegistered", occurredAt: NOW, actorId: "alice",
    objectType: BO.Property, objectId: "p1", causedByCommand: "RegisterProperty",
    correlationId: "c1", payload: {}, ...o,
  });

  it("refuses an event with no actor (I-01)", () => {
    expect(() => validateEvent(base({ actorId: "" }))).toThrow(EventValidationError);
  });

  it("refuses an event with no causing command (E-02)", () => {
    expect(() => validateEvent(base({ causedByCommand: "" }))).toThrow(/causedByCommand/);
  });

  it("refuses a DECISION event with no reason (E-02)", () => {
    expect(() => validateEvent(base({ type: "ResolutionResolved" }))).toThrow(/requires a recorded reason/);
  });

  it("accepts a decision event that carries one", () => {
    expect(() => validateEvent(base({ type: "ResolutionResolved", reason: "quorate, 82% for" }))).not.toThrow();
  });

  it("the log is append-only — history cannot be mutated through it", () => {
    const log = new EventLog();
    log.append(base());
    const copy = log.all() as EventEnvelope[];
    copy.push(base({ eventId: "forged" }));
    expect(log.size).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("command envelope", () => {
  let log: EventLog, audit: SessionAudit;
  const ctx = (o: Record<string, unknown> = {}) => ({
    identityId: "alice", sessionId: "s1", now: NOW, correlationId: "c1",
    vehicleId: V1, grants: [grant()], ...o,
  }) as any;

  beforeEach(() => {
    log = new EventLog(); audit = new SessionAudit();
    audit.open("s1", "alice", NOW); __resetEventSeq();
  });

  it("runs authority BEFORE the handler — a denied handler never executes", () => {
    let ran = false;
    const r = execute("ApprovePolicyVersion", ctx({ reason: "x" }), log, audit,
      () => { ran = true; });
    expect(r.ok).toBe(false);
    expect(ran).toBe(false);
  });

  it("THROWS when a capability emits nothing (E-01)", () => {
    // The one failure the whole event architecture exists to prevent.
    expect(() =>
      execute("OpenOffering", ctx(), log, audit, () => undefined),
    ).toThrow(CapabilityError);
  });

  it("throws when a capability emits an event it did not declare", () => {
    expect(() =>
      execute("OpenOffering", ctx(), log, audit, (emit) => {
        emit("DistributionExecuted" as any, "o1", {});
      }),
    ).toThrow(/does not declare/);
  });

  it("refuses to run a reason-requiring capability without one (E-02)", () => {
    const r = execute("CallCapital", ctx(), log, audit, (emit) => emit("CapitalCalled", "cc1", {}));
    expect(r.ok).toBe(false);
    expect(r.error).toContain("E-02");
  });

  it("emits, logs and stamps provenance on success", () => {
    const r = execute("CallCapital", ctx({ reason: "Acquisition of Property P-14" }), log, audit,
      (emit) => emit("CapitalCalled", "cc1", { amount: "500000.0000" }));
    expect(r.ok).toBe(true);
    expect(log.size).toBe(1);
    const e = log.all()[0];
    expect(e.actorId).toBe("alice");
    expect(e.causedByCommand).toBe("CallCapital");
    expect(e.correlationId).toBe("c1");
  });

  it("records the invocation in the session either way (I-04)", () => {
    execute("CallCapital", ctx(), log, audit, (emit) => emit("CapitalCalled", "cc1", {}));
    expect(audit.deniedAttempts("alice").length).toBe(1);
  });

  it("refuses a vehicle-scoped capability with no vehicleId", () => {
    expect(() =>
      execute("OpenOffering", ctx({ vehicleId: undefined }), log, audit, (emit) => emit("OfferingOpened", "o1", {})),
    ).toThrow(/vehicle-scoped/);
  });

  it("blocks a conflict-sensitive capability when the conflict is undisclosed (I-07)", () => {
    const g = grant({ role: "board", identityId: "alice" });
    const r = execute("GrantAuthority", ctx({ grants: [g], reason: "delegate", actorHasKnownConflict: true }),
      log, audit, (emit) => emit("AuthorityGranted", "g9", {}));
    expect(r.ok).toBe(false);
    expect(r.error).toContain("I-07");
  });

  it("permits it once disclosed — conflicts are allowed, concealment is not", () => {
    const g = grant({ role: "board", identityId: "alice" });
    const r = execute("GrantAuthority", ctx({
      grants: [g], reason: "delegate", actorHasKnownConflict: true,
      disclosures: [{ identityId: "alice", nature: "related party", disclosedAt: NOW, recused: false }],
    }), log, audit, (emit) => emit("AuthorityGranted", "g9", {}));
    expect(r.ok).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("ledger (E-04)", () => {
  let led: Ledger;
  const entry = (o: Partial<LedgerEntry> = {}): LedgerEntry => ({
    entryId: "l1", vehicleId: V1, account: "partner_distribution",
    amount: money("40000.0000"), postedAt: NOW, postedBy: "alice",
    narrative: "Q3 partner distribution", ...o,
  });

  beforeEach(() => { led = new Ledger(); });

  it("exposes no method that deletes or updates an entry", () => {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(led));
    expect(names.filter((n) => /delete|update|remove|void|edit/i.test(n))).toEqual([]);
  });

  it("refuses a duplicate entry id", () => {
    led.post(entry());
    expect(() => led.post(entry())).toThrow(/already posted/);
  });

  it("refuses an unexplained posting", () => {
    expect(() => led.post(entry({ narrative: "  " }))).toThrow(/narrative/);
  });

  it("corrects by offsetting, leaving both the error and the remedy visible", () => {
    led.post(entry());
    led.post(led.reversalFor("l1", "l2", "alice", NOW, "Reversal: wrong amount"));
    expect(format(led.balance(V1, "partner_distribution"))).toBe("0.0000");
    expect(led.size).toBe(2); // the mistake is still there
    expect(led.reversalsNet()).toBe(true);
  });

  it("refuses a partial reversal — that is a new entry, not a correction", () => {
    led.post(entry());
    expect(() =>
      led.post(entry({ entryId: "l2", amount: money("-10000.0000"), reverses: "l1" })),
    ).toThrow(/must exactly offset/);
  });

  it("refuses to reverse the same entry twice", () => {
    led.post(entry());
    led.post(led.reversalFor("l1", "l2", "alice", NOW, "reversal"));
    expect(() => led.post(led.reversalFor("l1", "l3", "alice", NOW, "again"))).toThrow(/already reversed/);
  });

  it("refuses to reverse an entry that does not exist", () => {
    expect(() => led.post(entry({ entryId: "l2", reverses: "nope" }))).toThrow(LedgerError);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("governance: secret ballot, transparent outcome (I-05, I-06)", () => {
  const record = {
    resolutionId: "r1", matter: "ANNUAL_BUDGET", resolutionType: "ordinary" as any,
    tabledBy: "governance_office", tabledAt: NOW,
    optionsConsidered: ["approve as tabled", "defer to Q4", "reject"],
    committeeId: "board",
  };

  it("exposes NO method returning an individual ballot (I-05)", () => {
    const box = new Ballot_Box(record);
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(box));
    // participants() returns WHO voted, never HOW.
    expect(names.filter((n) => /ballotOf|voteOf|howVoted|votes/i.test(n))).toEqual([]);
  });

  it("publishes aggregates and reasoning, and no per-voter mapping (I-06)", () => {
    const box = new Ballot_Box(record);
    box.cast("a", "for", 4000, NOW);
    box.cast("b", "for", 2500, NOW);
    box.cast("c", "against", 1500, NOW);
    const d = publish(box, "Budget approved; capex deferred pending Q3 valuation.");
    expect(d.equityFor).toBe(6500);
    expect(d.approved).toBe(true);
    expect(d.participantCount).toBe(3);
    expect(d.optionsConsidered).toHaveLength(3);
    expect(JSON.stringify(d)).not.toMatch(/"a".*"for"/);
  });

  it("refuses to publish without reasoning (E-02)", () => {
    const box = new Ballot_Box(record);
    box.cast("a", "for", 6000, NOW);
    expect(() => publish(box, "   ")).toThrow(GovernanceError);
  });

  it("refuses a second ballot from the same holder", () => {
    const box = new Ballot_Box(record);
    box.cast("a", "for", 4000, NOW);
    expect(() => box.cast("a", "against", 4000, NOW)).toThrow(/already voted/);
  });

  it("refuses a ballot from a holder with no equity", () => {
    const box = new Ballot_Box(record);
    expect(() => box.cast("z", "for", 0, NOW)).toThrow(/no equity/);
  });

  it("requires disclosure BEFORE voting, not after (I-07)", () => {
    const box = new Ballot_Box(record);
    box.cast("a", "for", 4000, NOW);
    expect(() =>
      box.discloseConflict({ identityId: "a", nature: "related party", disclosedAt: NOW, recused: false }),
    ).toThrow(/must precede/);
  });

  it("bars a recused holder from voting", () => {
    const box = new Ballot_Box(record);
    box.discloseConflict({ identityId: "a", nature: "related party", disclosedAt: NOW, recused: true });
    expect(() => box.cast("a", "for", 4000, NOW)).toThrow(/recused/);
  });

  it("marks an inquorate election rather than guessing", () => {
    const box = new Ballot_Box(record);
    box.cast("a", "for", 3000, NOW); // 30% < 60% quorum
    const d = publish(box, "insufficient participation");
    expect(d.quorate).toBe(false);
    expect(d.outcome).toBe("INQUORATE");
    expect(d.approved).toBe(false);
  });

  it("entrenched matters need unanimity AND the rights confirmation (§32b)", () => {
    const box = new Ballot_Box({ ...record, matter: "FIDUCIARY_PRIMACY" });
    box.cast("a", "for", 10000, NOW);
    expect(publish(box, "unanimous").outcome).toBe("ENTRENCHED_RIGHTS_NOT_CONFIRMED");
  });
});

describe("conflict gate (I-07)", () => {
  it("permits an actor with no conflict", () => {
    expect(conflictGate("a", false, []).allowed).toBe(true);
  });
  it("blocks a known undisclosed conflict", () => {
    expect(conflictGate("a", true, []).allowed).toBe(false);
  });
  it("permits a known DISCLOSED conflict", () => {
    expect(conflictGate("a", true, [{ identityId: "a", nature: "x", disclosedAt: NOW, recused: false }]).allowed).toBe(true);
  });
});

describe("capability registry integrity", () => {
  it("every capability declares at least one event (E-01)", () => {
    expect(CAPABILITIES.filter((c) => c.emits.length === 0)).toEqual([]);
  });
  it("every conflict-sensitive capability also requires a reason", () => {
    // A conflict-sensitive action without recorded reasoning would disclose
    // the conflict and then say nothing about why the actor proceeded anyway.
    const gap = CAPABILITIES.filter((c) => c.conflictSensitive && !c.requiresReason).map((c) => c.name);
    expect(gap).toEqual(["CastVote"]); // deliberate: I-05 keeps the ballot silent
  });
});
