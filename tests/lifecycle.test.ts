/**
 * LIFECYCLE — end-to-end integration
 *
 * Wave 2
 *
 * Every other test file checks one layer. This one checks that they compose:
 * that a distribution genuinely cannot be executed by an unauthorised actor,
 * cannot skip a waterfall stage, cannot breach the reserve floor, cannot
 * lose a rupee across a capital table, and cannot happen silently.
 *
 * Those five claims are the architecture. Individually they are each
 * already tested; the question here is whether they still hold when a
 * single command has to satisfy all of them at once.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { money, format, sum } from "../lib/money";
import { Position, CapitalState, MemberState } from "../lib/capital";
import { ReserveBand } from "../lib/reserve";
import { EventLog } from "../lib/events";
import { SessionAudit, Grant, ENTERPRISE, vehicleScope } from "../lib/authority";
import { Ledger } from "../lib/ledger";
import { __resetEventSeq } from "../lib/commands";
import {
  executeDistribution, callCapital, acceptCommitment, deployCapital,
  declareReserveBreach, reconcileDistribution,
} from "../lib/handlers";

const NOW = "2026-07-31T10:00:00.000Z";
const V1 = "llp-coastal-01";

/** Distinct identities per role — GP-06 is about separation, so the test separates. */
const grants: Grant[] = [
  { grantId: "g-board", identityId: "board-chair", role: "board", scope: ENTERPRISE,
    grantedBy: "founding", grantedAt: "2026-01-01T00:00:00.000Z" },
  { grantId: "g-ic", identityId: "ic-chair", role: "investment_committee", scope: vehicleScope(V1),
    grantedBy: "board-chair", grantedAt: "2026-01-01T00:00:00.000Z" },
  { grantId: "g-exec", identityId: "coo", role: "executive_office", scope: ENTERPRISE,
    grantedBy: "board-chair", grantedAt: "2026-01-01T00:00:00.000Z" },
  { grantId: "g-audit", identityId: "audit-chair", role: "audit_risk_committee", scope: ENTERPRISE,
    grantedBy: "board-chair", grantedAt: "2026-01-01T00:00:00.000Z" },
];

const ctx = (identityId: string, o: Record<string, unknown> = {}) => ({
  identityId, sessionId: `s-${identityId}`, now: NOW,
  correlationId: "corr-1", vehicleId: V1, grants, ...o,
}) as any;

/** A capital table that conserves: 10,000 units across four holders. */
const positions: Position[] = [
  { investorId: "inv-a", units: 3333n, ownershipClass: "A" },
  { investorId: "inv-b", units: 2500n, ownershipClass: "A" },
  { investorId: "inv-c", units: 2500n, ownershipClass: "A" },
  { investorId: "inv-d", units: 1667n, ownershipClass: "A" },
];
const TOTAL_UNITS = 10_000n;

const distributionInput = (o: Record<string, unknown> = {}) => ({
  distributionId: "dist-2026-Q3",
  vehicleId: V1,
  entryIdPrefix: "le-q3",
  positions,
  totalUnitsIssued: TOTAL_UNITS,
  revenueBase: money("2400000.0000"),
  operatingCompanyShare: money("960000.0000"), // 40%
  brandParticipationBp: 800,                    // 8%
  debtServiceDue: money("300000.0000"),
  reserveBalanceBefore: money("800000.0000"),
  reserveFloor: money("600000.0000"),
  ...o,
});

describe("full lifecycle", () => {
  let log: EventLog, audit: SessionAudit, ledger: Ledger;

  beforeEach(() => {
    log = new EventLog();
    ledger = new Ledger();
    audit = new SessionAudit();
    for (const g of grants) audit.open(`s-${g.identityId}`, g.identityId, NOW);
    __resetEventSeq();
  });

  it("accepts a commitment and promotes the identity (I-08)", () => {
    const r = acceptCommitment(ctx("coo", { reason: "Coastal Fund I, first close" }), {
      commitmentId: "c-1", investorId: "inv-a", offeringId: "off-1",
      amount: money("5000000.0000"), minimumSubscription: money("2500000.0000"),
      accreditationValid: true, currentMemberState: MemberState.Investor,
      isFirstCommitment: true,
    }, log, audit);

    expect(r.ok).toBe(true);
    expect(r.value!.memberState).toBe(MemberState.Member);
    expect(log.ofType("CommitmentAccepted")).toHaveLength(1);
    // Decision event: the reason must have travelled with it (E-02).
    expect(log.ofType("CommitmentAccepted")[0].reason).toContain("first close");
  });

  it("lapses a commitment when accreditation was invalid at acceptance", () => {
    const r = acceptCommitment(ctx("coo", { reason: "attempt" }), {
      commitmentId: "c-2", investorId: "inv-b", offeringId: "off-1",
      amount: money("5000000.0000"), minimumSubscription: money("2500000.0000"),
      accreditationValid: false, currentMemberState: MemberState.Investor,
      isFirstCommitment: true,
    }, log, audit);

    expect(r.ok).toBe(false);
    expect(r.error).toContain("§24b");
    expect(log.size).toBe(0);
  });

  it("refuses a capital call for working capital once stabilised (F-16)", () => {
    const r = callCapital(ctx("coo", { reason: "cover Q3 shortfall" }), {
      capitalCallId: "cc-1", vehicleId: V1, amount: money("500000.0000"),
      purpose: "operating_deficit", vehicleStabilised: true, dueOn: "2026-09-01",
    }, log, audit);

    expect(r.ok).toBe(false);
    expect(r.error).toContain("growth capital");
    expect(log.size).toBe(0);
  });

  it("permits a capital call for an acquisition", () => {
    const r = callCapital(ctx("coo", { reason: "Property P-14 acquisition" }), {
      capitalCallId: "cc-2", vehicleId: V1, amount: money("500000.0000"),
      purpose: "acquisition", vehicleStabilised: true, dueOn: "2026-09-01",
    }, log, audit);
    expect(r.ok).toBe(true);
  });

  it("refuses capital reverting to Committed once drawn (F-03)", () => {
    const r = deployCapital(ctx("ic-chair", { reason: "reverse" }), {
      investmentId: "i-1", vehicleId: V1, commitmentId: "c-1",
      amount: money("100.0000"), from: CapitalState.Drawn, to: CapitalState.Committed,
      entryId: "le-bad",
    }, log, audit, ledger);

    expect(r.ok).toBe(false);
    expect(ledger.size).toBe(0);
  });

  it("runs a distribution end to end and reconciles", () => {
    const input = distributionInput();
    const r = executeDistribution(ctx("coo", { reason: "Q3 2026 distribution" }), input, log, audit, ledger);

    expect(r.ok).toBe(true);
    const out = r.value!;

    // 2,400,000 - 960,000 - 192,000 - 60,000 - 60,000 - 300,000
    expect(format(out.waterfall.partnerDistribution)).toBe("828000.0000");
    expect(out.waterfall.blockedBy).toEqual([]);
    expect(out.reserveBand).toBe(ReserveBand.Healthy);

    // Every rupee reached a holder.
    expect(sum(out.allocations.map((a) => a.amount))).toBe(out.waterfall.partnerDistribution);
    expect(out.allocations).toHaveLength(4);

    // Six ledger postings, one per stage that moved money.
    expect(out.ledgerEntries).toHaveLength(6);
    expect(format(ledger.balance(V1, "admin_reserve"))).toBe("60000.0000");
    expect(format(ledger.balance(V1, "sinking_fund"))).toBe("60000.0000");

    expect(reconcileDistribution(ledger, V1, out).ok).toBe(true);
  });

  it("emits both the ledger trail and the outcome, never silently (E-01)", () => {
    executeDistribution(ctx("coo", { reason: "Q3 2026" }), distributionInput(), log, audit, ledger);
    expect(log.ofType("LedgerEntryPosted")).toHaveLength(6);
    expect(log.ofType("DistributionExecuted")).toHaveLength(1);
    // One command, one correlation id across everything it produced.
    expect(new Set(log.all().map((e) => e.correlationId)).size).toBe(1);
  });

  it("blocks and says why when the reserve would sit below floor (F-06)", () => {
    const input = distributionInput({
      reserveBalanceBefore: money("100000.0000"),
      reserveFloor: money("600000.0000"),
    });
    const r = executeDistribution(ctx("coo", { reason: "Q3 2026" }), input, log, audit, ledger);

    expect(r.ok).toBe(true); // the command succeeded; the payout did not
    expect(r.value!.waterfall.blockedBy).toContain("RESERVE_BELOW_FLOOR");
    expect(r.value!.allocations).toEqual([]);
    expect(r.value!.reserveBand).toBe(ReserveBand.ConstitutionalBreach);

    const blocked = log.ofType("DistributionBlocked");
    expect(blocked).toHaveLength(1);
    expect(blocked[0].payload.blockedBy).toContain("RESERVE_BELOW_FLOOR");
    // The money stayed in the vehicle, and the record says so.
    expect(format(ledger.balance(V1, "partner_distribution"))).toBe("0.0000");
    expect(blocked[0].payload.retained).toBe("828000.0000");
  });

  it("blocks while debt service is unpaid (F-05)", () => {
    const input = distributionInput({ debtServiceDue: money("2000000.0000") });
    const r = executeDistribution(ctx("coo", { reason: "Q3 2026" }), input, log, audit, ledger);
    expect(r.value!.waterfall.blockedBy).toContain("DEBT_SERVICE_UNPAID");
    expect(log.ofType("DistributionExecuted")).toHaveLength(0);
  });

  it("REFUSES to distribute across a capital table that does not conserve (F-02)", () => {
    // The failure this prevents: allocating a share of the money to nobody,
    // or twice to somebody, while the ledger balances and the register lies.
    const input = distributionInput({ totalUnitsIssued: 12_000n });
    const r = executeDistribution(ctx("coo", { reason: "Q3 2026" }), input, log, audit, ledger);

    expect(r.ok).toBe(false);
    expect(r.error).toContain("F-02 violated");
    expect(ledger.size).toBe(0);
    expect(log.size).toBe(0);
  });

  it("leaves NO partial ledger trail when it refuses", () => {
    executeDistribution(ctx("coo", { reason: "Q3" }), distributionInput({ totalUnitsIssued: 12_000n }),
      log, audit, ledger);
    // A partial trail would be indistinguishable from a completed
    // distribution that lost its later entries.
    expect(ledger.all()).toEqual([]);
  });
});

describe("authority holds across the lifecycle", () => {
  let log: EventLog, audit: SessionAudit, ledger: Ledger;
  beforeEach(() => {
    log = new EventLog(); ledger = new Ledger(); audit = new SessionAudit();
    for (const g of grants) audit.open(`s-${g.identityId}`, g.identityId, NOW);
    audit.open("s-stranger", "stranger", NOW);
    __resetEventSeq();
  });

  it("an ungranted identity cannot distribute", () => {
    const r = executeDistribution(ctx("stranger", { reason: "Q3" }), distributionInput(), log, audit, ledger);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("I-02");
    expect(ledger.size).toBe(0);
  });

  it("the Investment Committee cannot execute a distribution (GP-06)", () => {
    // IC holds capital.deploy. It does not hold distribution.execute.
    // Investment approval and financial execution sit in different hands.
    const r = executeDistribution(ctx("ic-chair", { reason: "Q3" }), distributionInput(), log, audit, ledger);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("do not carry");
  });

  it("the Executive Office cannot deploy capital (GP-06)", () => {
    const r = deployCapital(ctx("coo", { reason: "deploy" }), {
      investmentId: "i-1", vehicleId: V1, commitmentId: "c-1", amount: money("100.0000"),
      from: CapitalState.Drawn, to: CapitalState.Invested, entryId: "le-1",
    }, log, audit, ledger);
    expect(r.ok).toBe(false);
  });

  it("records every denied attempt against the session (I-04)", () => {
    executeDistribution(ctx("stranger", { reason: "Q3" }), distributionInput(), log, audit, ledger);
    expect(audit.deniedAttempts("stranger")).toHaveLength(1);
  });

  it("a vehicle-scoped grant does not reach another vehicle", () => {
    const r = deployCapital(ctx("ic-chair", { reason: "deploy", vehicleId: "llp-other-02" }), {
      investmentId: "i-1", vehicleId: "llp-other-02", commitmentId: "c-1",
      amount: money("100.0000"), from: CapitalState.Drawn, to: CapitalState.Invested,
      entryId: "le-1",
    }, log, audit, ledger);
    expect(r.ok).toBe(false);
  });
});

describe("reserve breach declaration", () => {
  let log: EventLog, audit: SessionAudit;
  beforeEach(() => {
    log = new EventLog(); audit = new SessionAudit();
    for (const g of grants) audit.open(`s-${g.identityId}`, g.identityId, NOW);
    __resetEventSeq();
  });

  // Declared by AUDIT & RISK, not the Executive Office. EP-01 §3.5 gives that
  // committee reserves and treasury oversight, and the separation is the
  // point: the Executive Office controls the discretionary expenditure that a
  // breach freezes. Letting it declare whether a breach exists would let it
  // decide whether its own spending has triggered a constraint on its own
  // spending.
  it("the Executive Office cannot declare a breach", () => {
    const r = declareReserveBreach(
      ctx("coo", { reason: "Q3 occupancy shortfall" }),
      V1, money("400000.0000"), money("600000.0000"), log, audit,
    );
    expect(r.ok).toBe(false);
    expect(r.error).toContain("compliance.record");
  });

  it("declares, and structurally cannot authorise a capital call (F-16)", () => {
    const r = declareReserveBreach(
      ctx("audit-chair", { reason: "Q3 occupancy shortfall" }),
      V1, money("400000.0000"), money("600000.0000"), log, audit,
    );
    expect(r.ok).toBe(true);
    expect(format(r.value!.shortfall)).toBe("200000.0000");

    const e = log.ofType("ReserveBreachDeclared")[0];
    expect(e.payload.capitalCallPermitted).toBe(false);
    // A breach alone never suspends distributions — that needs an
    // Ordinary Resolution (L1-16 §2.6a).
    expect(e.payload.suspendDistributions).toBe(false);
    expect(e.payload.broadcast).toBe(true);
  });

  it("refuses to declare a breach that is not one", () => {
    const r = declareReserveBreach(
      ctx("audit-chair", { reason: "precaution" }),
      V1, money("900000.0000"), money("600000.0000"), log, audit,
    );
    expect(r.ok).toBe(false);
    expect(log.size).toBe(0);
  });
});
