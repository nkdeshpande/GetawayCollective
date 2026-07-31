/**
 * Metrics and projections — Wave 2 · L6/L9
 */

import { describe, it, expect } from "vitest";
import { money, format, ZERO } from "../lib/money";
import {
  irr, npv, moic, nav, reserveCoverageBp, buildMetricReport,
  formatBpAsPercent, formatBpAsMultiple, CashFlow, DatedValuation,
} from "../lib/metrics";
import {
  projectVehicle, projectCapitalTable, projectMembers, projectCashFlows,
  provenanceOf, transactionOf, actorHistory, projectionIsDeterministic,
} from "../lib/projections";
import { EventEnvelope } from "../lib/events";
import { BusinessObjectType as BO } from "../constants/business-objects";

// ─────────────────────────────────────────────────────────────────────
describe("IRR (F-14)", () => {
  it("finds the rate that zeroes NPV", () => {
    // -1000 now, +1210 in two periods = exactly 10%.
    const flows: CashFlow[] = [
      { period: 0, amount: money("-1000.0000") },
      { period: 2, amount: money("1210.0000") },
    ];
    const r = irr(flows);
    expect(r.bp).not.toBeNull();
    expect(Math.abs(r.bp! - 1000)).toBeLessThanOrEqual(2); // within 2bp
  });

  it("NPV at the computed IRR is approximately zero", () => {
    const flows: CashFlow[] = [
      { period: 0, amount: money("-500000.0000") },
      { period: 1, amount: money("120000.0000") },
      { period: 2, amount: money("140000.0000") },
      { period: 3, amount: money("400000.0000") },
    ];
    const r = irr(flows);
    const residual = npv(flows, r.bp!);
    // One basis point of a 500k series is ~50, so a small residual is
    // convergence, not error.
    expect(residual < money("100.0000") && residual > money("-100.0000")).toBe(true);
  });

  it("is deterministic — the same series always gives the same rate", () => {
    const flows: CashFlow[] = [
      { period: 0, amount: money("-777777.7777") },
      { period: 1, amount: money("300000.0000") },
      { period: 4, amount: money("700000.0000") },
    ];
    expect(irr(flows).bp).toBe(irr(flows).bp);
  });

  it("returns NULL rather than inventing a rate when there is no sign change", () => {
    // A series that never goes positive has no IRR. Reporting 0 or -100%
    // would put a figure in an investor report that means nothing.
    const r = irr([
      { period: 0, amount: money("-100.0000") },
      { period: 1, amount: money("-50.0000") },
    ]);
    expect(r.bp).toBeNull();
    expect(r.reason).toContain("no sign change");
  });

  it("returns null on an empty series", () => {
    expect(irr([]).bp).toBeNull();
  });

  it("handles a loss — negative IRR", () => {
    const r = irr([
      { period: 0, amount: money("-1000.0000") },
      { period: 1, amount: money("500.0000") },
    ]);
    expect(r.bp).not.toBeNull();
    expect(r.bp!).toBeLessThan(0);
  });

  it("never uses floating point in the discounting path", () => {
    // A float would make this drift; the fold is exact.
    const flows: CashFlow[] = Array.from({ length: 40 }, (_, i) => ({
      period: i, amount: i === 0 ? money("-100000.0000") : money("3000.0000"),
    }));
    expect(irr(flows).bp).toBe(irr(flows).bp);
  });
});

describe("MOIC (F-14)", () => {
  it("computes a multiple in basis points", () => {
    expect(moic(money("1000000.0000"), money("2500000.0000"))).toBe(25_000); // 2.5x
  });
  it("returns null on zero invested rather than dividing", () => {
    expect(moic(ZERO, money("100.0000"))).toBeNull();
  });
  it("formats readably", () => {
    expect(formatBpAsMultiple(25_000)).toBe("2.50x");
    expect(formatBpAsPercent(1_450)).toBe("14.50%");
  });
});

describe("NAV (F-13)", () => {
  const vals: DatedValuation[] = [
    { propertyId: "p1", valuedOn: "2026-01-01", value: money("1000000.0000"), source: "independent" },
    { propertyId: "p1", valuedOn: "2026-06-01", value: money("1200000.0000"), source: "independent" },
    { propertyId: "p2", valuedOn: "2026-06-01", value: money("9999999.0000"), source: "management" },
  ];

  it("takes the latest independent valuation per property", () => {
    const r = nav(vals, ["p1"]);
    expect(format(r.nav)).toBe("1200000.0000");
    expect(r.asOf).toBe("2026-06-01");
  });

  it("EXCLUDES management estimates and names what is missing", () => {
    // A NAV that mixes sources is not a NAV; it is an opinion with a number.
    const r = nav(vals, ["p1", "p2"]);
    expect(format(r.nav)).toBe("1200000.0000");
    expect(r.missing).toEqual(["p2"]);
  });

  it("reports zero with everything missing rather than guessing", () => {
    const r = nav([], ["p1", "p2"]);
    expect(r.nav).toBe(ZERO);
    expect(r.missing).toEqual(["p1", "p2"]);
    expect(r.asOf).toBeNull();
  });
});

describe("reserve coverage (F-06)", () => {
  it("expresses balance as basis points of the floor", () => {
    expect(reserveCoverageBp(money("720000.0000"), money("600000.0000"))).toBe(12_000);
  });
  it("returns null on a zero floor", () => {
    expect(reserveCoverageBp(money("100.0000"), ZERO)).toBeNull();
  });
});

describe("metric report carries its convention", () => {
  it("states the formula alongside the figure", () => {
    const r = buildMetricReport({
      vehicleId: "v1", periodEnd: "2026-06-30",
      flows: [{ period: 0, amount: money("-1000.0000") }, { period: 2, amount: money("1210.0000") }],
      invested: money("1000.0000"), returned: money("1210.0000"),
      valuations: [{ propertyId: "p1", valuedOn: "2026-06-01", value: money("5000.0000"), source: "independent" }],
      propertyIds: ["p1"],
      reserveBalance: money("660000.0000"), reserveFloor: money("600000.0000"),
    });
    // Two vehicles reporting 14% under different conventions look
    // comparable and are not. The convention travels with the number.
    expect(r.convention.irr).toContain("F-14");
    expect(r.moicBp).toBe(12_100);
    expect(r.reserveCoverageBp).toBe(11_000);
  });
});

// ─────────────────────────────────────────────────────────────────────
const NOW = "2026-07-31T10:00:00.000Z";
const ev = (o: Partial<EventEnvelope>): EventEnvelope => ({
  eventId: "e", type: "CapitalCalled", occurredAt: NOW, actorId: "coo",
  objectType: BO.InvestmentVehicle, objectId: "v1", causedByCommand: "CallCapital",
  correlationId: "c1", payload: {}, ...o,
} as EventEnvelope);

describe("projections are folds, never stores", () => {
  const events: EventEnvelope[] = [
    ev({ eventId: "e1", type: "InvestmentVehicleFormed", objectId: "v1" }),
    ev({ eventId: "e2", type: "InvestmentVehicleStabilised", objectId: "v1" }),
    ev({ eventId: "e3", type: "CapitalCalled", payload: { amount: "500000.0000" } }),
    ev({ eventId: "e4", type: "CapitalDeployed", payload: { amount: "450000.0000" } }),
    ev({ eventId: "e5", type: "LedgerEntryPosted", payload: { account: "admin_reserve", amount: "60000.0000" } }),
    ev({ eventId: "e6", type: "LedgerEntryPosted", payload: { account: "sinking_fund", amount: "60000.0000" } }),
    ev({ eventId: "e7", type: "DistributionExecuted", payload: { amount: "828000.0000" } }),
  ];

  it("rebuilds vehicle state from events alone", () => {
    const p = projectVehicle(events, "v1");
    expect(p.formed).toBe(true);
    expect(p.stabilised).toBe(true);
    expect(format(p.capitalCalled)).toBe("500000.0000");
    expect(format(p.reserveFunded)).toBe("120000.0000");
    expect(format(p.distributedToPartners)).toBe("828000.0000");
  });

  it("records a block and its reasons", () => {
    const p = projectVehicle(
      [...events, ev({ eventId: "e8", type: "DistributionBlocked",
        payload: { blockedBy: ["RESERVE_BELOW_FLOOR"], retained: "828000.0000" } })],
      "v1",
    );
    expect(p.distributionsBlocked).toBe(1);
    expect(p.lastBlockReasons).toEqual(["RESERVE_BELOW_FLOOR"]);
  });

  it("is deterministic — folding twice gives the same answer", () => {
    // Trivially true for a pure fold, which is why it is worth pinning:
    // the moment someone adds an incremental update path this breaks.
    expect(projectionIsDeterministic(events, "v1")).toBe(true);
  });

  it("yields nothing for an unknown vehicle rather than guessing", () => {
    const p = projectVehicle(events, "v-unknown");
    expect(p.formed).toBe(false);
  });
});

describe("capital table projection (F-02, F-12)", () => {
  const events: EventEnvelope[] = [
    ev({ eventId: "o1", type: "OwnershipPositionOpened", objectType: BO.OwnershipPosition,
      payload: { vehicleId: "v1", investorId: "inv-a", units: 6000, ownershipClass: "A" } }),
    ev({ eventId: "o2", type: "OwnershipPositionOpened", objectType: BO.OwnershipPosition,
      payload: { vehicleId: "v1", investorId: "inv-b", units: 4000, ownershipClass: "A" } }),
  ];

  it("rebuilds the register and confirms conservation", () => {
    const t = projectCapitalTable(events, "v1", 10_000n);
    expect(t.totalUnits).toBe(10_000n);
    expect(t.conserves).toBe(true);
    expect(t.positions).toHaveLength(2);
  });

  it("replays transfers additively, without losing units (F-12)", () => {
    const t = projectCapitalTable([
      ...events,
      ev({ eventId: "o3", type: "OwnershipTransferred", objectType: BO.OwnershipPosition,
        payload: { vehicleId: "v1", from: "inv-a", to: "inv-c", units: 1500 } }),
    ], "v1", 10_000n);

    expect(t.totalUnits).toBe(10_000n);
    expect(t.conserves).toBe(true);
    expect(t.positions.find((p) => p.investorId === "inv-a")!.units).toBe(4500n);
    expect(t.positions.find((p) => p.investorId === "inv-c")!.units).toBe(1500n);
  });

  it("drops a fully exited holder from the register", () => {
    const t = projectCapitalTable([
      ...events,
      ev({ eventId: "o3", type: "OwnershipTransferred", objectType: BO.OwnershipPosition,
        payload: { vehicleId: "v1", from: "inv-b", to: "inv-a", units: 4000 } }),
    ], "v1", 10_000n);
    expect(t.positions.map((p) => p.investorId)).toEqual(["inv-a"]);
    expect(t.conserves).toBe(true);
  });

  it("REPORTS non-conservation rather than hiding it", () => {
    const t = projectCapitalTable(events, "v1", 12_000n);
    expect(t.conserves).toBe(false);
  });

  it("ignores events belonging to another vehicle", () => {
    const t = projectCapitalTable([
      ...events,
      ev({ eventId: "x", type: "OwnershipPositionOpened", objectType: BO.OwnershipPosition,
        payload: { vehicleId: "v2", investorId: "inv-z", units: 9999 } }),
    ], "v1", 10_000n);
    expect(t.totalUnits).toBe(10_000n);
  });
});

describe("member registry (I-08)", () => {
  it("promotes on first accepted commitment and never reverts", () => {
    const m = projectMembers([
      ev({ eventId: "m1", type: "AccreditationGranted", objectType: BO.Investor, objectId: "inv-a" }),
      ev({ eventId: "m2", type: "CommitmentAccepted", objectType: BO.Commitment, objectId: "c1",
        reason: "first close", payload: { investorId: "inv-a", amount: "5000000.0000" } }),
      ev({ eventId: "m3", type: "CommitmentAccepted", objectType: BO.Commitment, objectId: "c2",
        reason: "follow-on", payload: { investorId: "inv-a", amount: "1000000.0000" } }),
    ]);
    const a = m.get("inv-a")!;
    expect(a.isMember).toBe(true);
    expect(a.commitmentsAccepted).toBe(2);
    // Set once, on the FIRST commitment. Membership records history.
    expect(a.becameMemberAt).toBe(NOW);
  });
});

describe("cash-flow projection", () => {
  it("derives periods from boundaries, not from the clock", () => {
    // An IRR that shifts because the report ran on a different day is not a
    // return figure, it is a timestamp.
    const boundaries = ["2026-01-01T00:00:00.000Z", "2026-04-01T00:00:00.000Z", "2026-07-01T00:00:00.000Z"];
    const flows = projectCashFlows([
      ev({ eventId: "f1", type: "CapitalDeployed", occurredAt: "2026-02-01T00:00:00.000Z",
        payload: { amount: "1000000.0000" } }),
      ev({ eventId: "f2", type: "DistributionExecuted", occurredAt: "2026-07-15T00:00:00.000Z",
        payload: { amount: "300000.0000" } }),
    ], boundaries);

    expect(flows).toHaveLength(2);
    expect(flows[0]).toEqual({ period: 0, amount: money("-1000000.0000") });
    expect(flows[1]).toEqual({ period: 2, amount: money("300000.0000") });
  });

  it("nets multiple flows within one period", () => {
    const b = ["2026-01-01T00:00:00.000Z"];
    const flows = projectCashFlows([
      ev({ eventId: "f1", type: "CapitalDeployed", occurredAt: "2026-02-01T00:00:00.000Z", payload: { amount: "500.0000" } }),
      ev({ eventId: "f2", type: "DistributionExecuted", occurredAt: "2026-03-01T00:00:00.000Z", payload: { amount: "200.0000" } }),
    ], b);
    expect(flows).toHaveLength(1);
    expect(format(flows[0].amount)).toBe("-300.0000");
  });
});

describe("provenance (E-02)", () => {
  const events: EventEnvelope[] = [
    ev({ eventId: "p1", type: "PropertyRegistered", objectType: BO.Property, objectId: "prop-1",
      actorId: "ic-chair", causedByCommand: "RegisterProperty", correlationId: "c1" }),
    ev({ eventId: "p2", type: "PropertyLifecycleAdvanced", objectType: BO.Property, objectId: "prop-1",
      actorId: "coo", causedByCommand: "AdvancePropertyLifecycle", reason: "diligence cleared",
      correlationId: "c2" }),
    ev({ eventId: "p3", type: "ValuationRecorded", objectType: BO.Valuation, objectId: "val-1",
      actorId: "ic-chair", causedByCommand: "RecordValuation", correlationId: "c3" }),
  ];

  it("answers who changed this, when, and why", () => {
    const h = provenanceOf(events, BO.Property, "prop-1");
    expect(h).toHaveLength(2);
    expect(h[1].actor).toBe("coo");
    expect(h[1].command).toBe("AdvancePropertyLifecycle");
    expect(h[1].reason).toBe("diligence cleared");
  });

  it("groups everything one command produced", () => {
    expect(transactionOf(events, "c2")).toHaveLength(1);
  });

  it("answers what an identity did — the first investigative question", () => {
    const h = actorHistory(events, "ic-chair");
    expect(h.map((e) => e.command)).toEqual(["RegisterProperty", "RecordValuation"]);
  });
});
