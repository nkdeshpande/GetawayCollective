/**
 * Domain logic tests — Wave 2
 *
 * These test the properties the constitution asserts, not merely that the
 * functions run. Where a test exists to catch a specific failure mode, the
 * comment names it.
 */

import { describe, it, expect } from "vitest";
import {
  money, format, add, sum, applyRate, allocate, ZERO,
} from "../lib/money";
import {
  runWaterfall, conserves, Stage, ADMIN_RESERVE_BP, SINKING_FUND_BP,
} from "../lib/waterfall";
import {
  reserveFloor, band, ReserveBand, mayDistribute,
  breachResponse, mayCallCapital, mayTransferReserve,
} from "../lib/reserve";
import {
  CapitalState, emptyLedger, capitalIsAccounted, mayTransition,
  ownershipConserved, votingRightsBp, concentrationBreaches,
  distributePro, distributionConserves, MemberState, nextMemberState,
  mayVote, mayReceiveDistribution, Position,
} from "../lib/capital";

// ─────────────────────────────────────────────────────────────────────
describe("money is exact", () => {
  it("round-trips decimal strings", () => {
    for (const s of ["0.0000", "1.0000", "12500000.5000", "-42.7500", "0.0001"]) {
      expect(format(money(s))).toBe(s);
    }
  });

  it("refuses JS numbers at the door", () => {
    // @ts-expect-error deliberate: numbers must never enter the money layer
    expect(() => money(12.5)).toThrow(TypeError);
  });

  it("refuses precision the ledger cannot carry", () => {
    expect(() => money("1.00005")).toThrow(RangeError);
  });

  it("survives the case float arithmetic fails", () => {
    // 0.1 + 0.2 === 0.30000000000000004 in IEEE-754.
    expect(format(add(money("0.1000"), money("0.2000")))).toBe("0.3000");
  });

  it("sums a long series without drift", () => {
    const xs = Array.from({ length: 10_000 }, () => money("0.0001"));
    expect(format(sum(xs))).toBe("1.0000");
  });

  it("rejects float rates — 2.5% is 250bp, not 0.025", () => {
    expect(() => applyRate(money("100.0000"), 0.025)).toThrow(TypeError);
  });

  it("applies basis-point rates exactly", () => {
    expect(format(applyRate(money("1000.0000"), 250))).toBe("25.0000");
  });
});

describe("allocate never loses a minor unit", () => {
  it("splits an indivisible amount so the parts still sum exactly", () => {
    // 100 / 3 has no exact decimal representation. Naive pro-rata pays out
    // 99.9999 and orphans the last unit.
    const parts = allocate(money("100.0000"), [1n, 1n, 1n]);
    expect(sum(parts)).toBe(money("100.0000"));
    expect(parts.map(format)).toEqual(["33.3334", "33.3333", "33.3333"]);
  });

  it("holds across awkward weights", () => {
    const cases: [string, bigint[]][] = [
      ["1.0000", [1n, 1n, 1n, 1n, 1n, 1n, 1n]],
      ["999999.9999", [17n, 3n, 5n, 11n]],
      ["0.0003", [1n, 1n, 1n, 1n, 1n]],
      ["12345.6789", [1n]],
    ];
    for (const [amount, weights] of cases) {
      expect(sum(allocate(money(amount), weights))).toBe(money(amount));
    }
  });

  it("is deterministic — two runs are identical", () => {
    const a = allocate(money("777.7777"), [3n, 5n, 7n, 11n]);
    const b = allocate(money("777.7777"), [3n, 5n, 7n, 11n]);
    expect(a.map(format)).toEqual(b.map(format));
  });

  it("refuses a zero total weight rather than dividing by zero", () => {
    expect(() => allocate(money("1.0000"), [0n, 0n])).toThrow(RangeError);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("waterfall (F-05)", () => {
  const base = {
    revenueBase: money("1000000.0000"),
    operatingCompanyShare: money("400000.0000"),
    brandParticipationBp: 800, // 8%
    debtServiceDue: money("150000.0000"),
    reserveBalanceBefore: money("500000.0000"),
    reserveFloor: money("300000.0000"),
  };

  it("runs all six stages in order", () => {
    const r = runWaterfall(base);
    expect(r.stages.map((s) => s.stage)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("conserves every minor unit", () => {
    expect(conserves(base, runWaterfall(base))).toBe(true);
  });

  it("takes reserves from the Revenue Base, not the surviving pool", () => {
    const r = runWaterfall(base);
    // 2.5% of 1,000,000 regardless of what stages 1-2 consumed.
    expect(format(r.stages[Stage.AdminReserve - 1].amount)).toBe("25000.0000");
    expect(format(r.stages[Stage.SinkingFund - 1].amount)).toBe("25000.0000");
    expect(ADMIN_RESERVE_BP + SINKING_FUND_BP).toBe(500);
  });

  it("a generous operating share cannot shrink the reserve ENTITLEMENT", () => {
    const greedy = runWaterfall({ ...base, operatingCompanyShare: money("900000.0000") });
    // The entitlement stays 2.5% of the Revenue Base regardless of stage 1.
    expect(format(greedy.stages[Stage.AdminReserve - 1].entitlement)).toBe("25000.0000");
  });

  it("but a large operating share CAN starve the reserve in practice", () => {
    // RATIFIED behaviour, not a defect (L1-16 §1.1a, BLANK-28 closed).
    //
    // Debt is owned by the Investment Vehicle; the Operating Company has
    // nothing to do with it. The operator's share is consideration for
    // services performed, so it ranks ahead of the Vehicle's own
    // obligations — its borrowing and its reserve provisioning alike.
    //
    // The residual risk is real and deliberately uncapped in the
    // constitution. The control is the Management Agreement, which is an
    // always-material related-party transaction (EP-01 §4.10a) and cannot
    // be set or amended without Board approval.
    //
    // This test exists so the behaviour cannot change silently.
    const greedy = runWaterfall({ ...base, operatingCompanyShare: money("900000.0000") });
    expect(format(greedy.stages[Stage.AdminReserve - 1].amount)).toBe("20000.0000");
    expect(format(greedy.stages[Stage.SinkingFund - 1].amount)).toBe("0.0000");
    expect(format(greedy.stages[Stage.DebtService - 1].amount)).toBe("0.0000");
    // Conservation still holds — nothing evaporates, it simply never arrives.
    expect(conserves({ ...base, operatingCompanyShare: money("900000.0000") }, greedy)).toBe(true);
  });

  it("pays partners the remainder when nothing blocks", () => {
    const r = runWaterfall(base);
    // 1,000,000 - 400,000 - 80,000 - 25,000 - 25,000 - 150,000
    expect(format(r.partnerDistribution)).toBe("320000.0000");
    expect(r.blockedBy).toEqual([]);
  });

  it("BLOCKS stage 6 while debt service is unpaid", () => {
    const r = runWaterfall({ ...base, debtServiceDue: money("999000.0000") });
    expect(r.blockedBy).toContain("DEBT_SERVICE_UNPAID");
    expect(r.partnerDistribution).toBe(ZERO);
  });

  it("BLOCKS stage 6 when the reserve would sit below floor (F-06)", () => {
    const r = runWaterfall({
      ...base,
      reserveBalanceBefore: money("0.0000"),
      reserveFloor: money("300000.0000"),
    });
    expect(r.blockedBy).toContain("RESERVE_BELOW_FLOOR");
    expect(r.partnerDistribution).toBe(ZERO);
  });

  it("BLOCKS stage 6 when an Ordinary Resolution has suspended it", () => {
    const r = runWaterfall({ ...base, distributionsSuspendedByResolution: true });
    expect(r.blockedBy).toContain("SUSPENDED_BY_RESOLUTION");
  });

  it("retains rather than evaporates when blocked", () => {
    const r = runWaterfall({ ...base, distributionsSuspendedByResolution: true });
    expect(format(r.retained)).toBe("320000.0000");
    expect(conserves({ ...base }, r)).toBe(true);
  });

  it("conserves even on a total shortfall", () => {
    const thin = { ...base, revenueBase: money("1000.0000") };
    const r = runWaterfall(thin);
    expect(conserves(thin, r)).toBe(true);
    expect(r.stages[Stage.DebtService - 1].shortfall > ZERO).toBe(true);
  });

  it("refuses a negative Revenue Base", () => {
    expect(() => runWaterfall({ ...base, revenueBase: money("-1.0000") })).toThrow(RangeError);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("reserve floor (F-06)", () => {
  const floor = reserveFloor(money("600000.0000"), money("450000.0000"));

  it("takes the greater of the two limbs", () => {
    expect(format(floor)).toBe("600000.0000");
  });

  it("bands correctly at each boundary", () => {
    expect(band(money("720000.0000"), floor)).toBe(ReserveBand.Healthy);
    expect(band(money("660000.0000"), floor)).toBe(ReserveBand.Advisory);
    expect(band(money("600000.0000"), floor)).toBe(ReserveBand.GovernanceAlert);
    expect(band(money("599999.9999"), floor)).toBe(ReserveBand.ConstitutionalBreach);
  });

  it("the prospective test is automatic and not voteable", () => {
    expect(mayDistribute(money("599999.9999"), floor).allowed).toBe(false);
    expect(mayDistribute(money("600000.0000"), floor).allowed).toBe(true);
  });

  it("breach response never permits a capital call (F-16)", () => {
    const r = breachResponse(money("100.0000"), floor);
    expect(r).not.toBeNull();
    expect(r!.capitalCallPermitted).toBe(false);
    expect(r!.broadcast).toBe(true);
    expect(r!.deferDiscretionaryExpenditure).toBe(true);
    // Suspension requires an Ordinary Resolution; a breach alone does not.
    expect(r!.suspendDistributions).toBe(false);
  });

  it("returns no response when there is no breach", () => {
    expect(breachResponse(money("700000.0000"), floor)).toBeNull();
  });
});

describe("capital call purpose gate (F-16)", () => {
  it("permits growth purposes post-stabilisation", () => {
    expect(mayCallCapital("acquisition", true).allowed).toBe(true);
    expect(mayCallCapital("approved_expansion", true).allowed).toBe(true);
  });

  it("refuses working-capital purposes post-stabilisation", () => {
    for (const p of ["operating_deficit", "routine_maintenance", "reserve_replenishment"]) {
      expect(mayCallCapital(p, true).allowed).toBe(false);
    }
  });

  it("does not gate pre-stabilisation", () => {
    expect(mayCallCapital("operating_deficit", false).allowed).toBe(true);
  });
});

describe("reserve non-pooling (F-17)", () => {
  it("refuses cross-vehicle transfer without Board approval", () => {
    expect(mayTransferReserve("v1", "v2", false).allowed).toBe(false);
  });
  it("permits it under an Enterprise Treasury Policy", () => {
    expect(mayTransferReserve("v1", "v2", true).allowed).toBe(true);
  });
  it("does not restrict movement within one vehicle", () => {
    expect(mayTransferReserve("v1", "v1", false).allowed).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("capital accounting (F-03)", () => {
  it("detects a leak", () => {
    const l = emptyLedger();
    l[CapitalState.Committed] = money("900.0000");
    expect(capitalIsAccounted(l, money("1000.0000"))).toBe(false);
  });

  it("balances when every state is accounted", () => {
    const l = emptyLedger();
    l[CapitalState.Committed] = money("400.0000");
    l[CapitalState.Invested] = money("500.0000");
    l[CapitalState.Distributed] = money("100.0000");
    expect(capitalIsAccounted(l, money("1000.0000"))).toBe(true);
  });

  it("forbids capital reverting to Committed once drawn", () => {
    expect(mayTransition(CapitalState.Drawn, CapitalState.Committed)).toBe(false);
    expect(mayTransition(CapitalState.Committed, CapitalState.Drawn)).toBe(true);
  });

  it("treats Returned and Distributed as terminal", () => {
    expect(mayTransition(CapitalState.Returned, CapitalState.Invested)).toBe(false);
    expect(mayTransition(CapitalState.Distributed, CapitalState.Invested)).toBe(false);
  });
});

describe("ownership conservation (F-02)", () => {
  const positions: Position[] = [
    { investorId: "a", units: 500n, ownershipClass: "A" },
    { investorId: "b", units: 300n, ownershipClass: "A" },
    { investorId: "c", units: 200n, ownershipClass: "A" },
  ];

  it("holds when units sum to units issued", () => {
    expect(ownershipConserved(positions, 1000n)).toBe(true);
  });

  it("fails when they do not", () => {
    expect(ownershipConserved(positions, 1001n)).toBe(false);
  });

  it("derives voting rights from equity, not headcount", () => {
    expect(votingRightsBp(positions[0], 1000n)).toBe(5000); // 50%
    expect(votingRightsBp(positions[2], 1000n)).toBe(2000); // 20%
  });

  it("flags concentration above the 10% ceiling", () => {
    const breaches = concentrationBreaches(positions, 1000n);
    expect(breaches.map((b) => b.investorId)).toEqual(["a", "b", "c"]);
  });

  it("passes a well-diversified table", () => {
    const many: Position[] = Array.from({ length: 20 }, (_, i) => ({
      investorId: `i${i}`, units: 50n, ownershipClass: "A",
    }));
    expect(concentrationBreaches(many, 1000n)).toEqual([]);
  });
});

describe("pro-rata distribution is exact", () => {
  it("sums to the input across an awkward capital table", () => {
    const positions: Position[] = [
      { investorId: "a", units: 333n, ownershipClass: "A" },
      { investorId: "b", units: 333n, ownershipClass: "A" },
      { investorId: "c", units: 334n, ownershipClass: "A" },
    ];
    const amount = money("100000.0001");
    const allocs = distributePro(amount, positions);
    expect(distributionConserves(amount, allocs)).toBe(true);
  });

  it("stays exact over many quarters", () => {
    const positions: Position[] = Array.from({ length: 37 }, (_, i) => ({
      investorId: `i${i}`, units: BigInt(i + 1), ownershipClass: "A",
    }));
    let paid = ZERO;
    const quarter = money("77777.7777");
    for (let q = 0; q < 40; q++) {
      const allocs = distributePro(quarter, positions);
      expect(distributionConserves(quarter, allocs)).toBe(true);
      paid = add(paid, sum(allocs.map((a) => a.amount)));
    }
    // 40 quarters, no drift.
    expect(format(paid)).toBe("3111111.1080");
  });
});

describe("the Member Law (I-08)", () => {
  it("promotes on first settled commitment", () => {
    expect(nextMemberState(MemberState.Investor, true)).toBe(MemberState.Member);
  });

  it("does not promote without one", () => {
    expect(nextMemberState(MemberState.Investor, false)).toBe(MemberState.Investor);
  });

  it("is irreversible — membership records history, not balance", () => {
    expect(nextMemberState(MemberState.Member, false)).toBe(MemberState.Member);
  });
});

describe("rights attach to ownership, not accreditation (§24b)", () => {
  const holder: Position = { investorId: "a", units: 100n, ownershipClass: "A" };

  // The intuitive implementation checks accreditation on every endpoint and
  // silently disenfranchises expired members. These assert it does not.
  it("an expired holder still votes", () => {
    expect(mayVote(holder, true)).toBe(true);
  });

  it("an expired holder still receives distributions", () => {
    expect(mayReceiveDistribution(holder, true)).toBe(true);
  });

  it("a zero-unit identity does neither", () => {
    const exited: Position = { investorId: "b", units: 0n, ownershipClass: "A" };
    expect(mayVote(exited, false)).toBe(false);
  });
});
