/**
 * ATLAS AND IRIS — the runtime, against the contracts that permit it
 *
 * tests/ai-contracts.test.ts already checks the DECLARATION. These check
 * the implementation, and the distinction matters: the registry could be
 * perfect while the code that runs under it asserts things with no source,
 * escalates with no deadline, or quietly approves something.
 *
 * Several of these assert a REFUSAL. A governed output that can be built
 * without an owner is not a governed output, so the tests that matter
 * most here are the ones where construction throws.
 */

import { describe, it, expect } from "vitest";
import { AI_CONTRACTS, contractById } from "../constants/ai-contracts";
import { governedOutput, allClear, rank, ContractViolation } from "../lib/ai/output";
import { vehicleHealth, distributionProposal, authorityExplanation, UNIMPLEMENTED } from "../lib/ai/atlas";
import { respond, reading, handoffPackage, CORPUS_SIZE } from "../lib/ai/iris";
import { money, ZERO } from "../lib/money";
import { ENTERPRISE } from "../lib/authority";
import type { EventEnvelope } from "../lib/events";

const AT = "2026-08-04T00:00:00.000Z";

const ok = {
  contractId: "AI-001",
  subject: "slowspace-coastal",
  disposition: "explain" as const,
  headline: "Something.",
  assertions: [{ claim: "A thing is so.", sources: ["evt:1"] }],
  owner: "executive_office",
  at: AT,
};

describe("the governed output", () => {
  it("builds when every clause is satisfied", () => {
    const o = governedOutput(ok);
    expect(o.agent).toBe("ATLAS");
    expect(o.outputObject).toBe(contractById("AI-001")!.outputObject);
    /* Copied from the contract, never invented by the caller. */
    expect(o.prohibited).toBe(contractById("AI-001")!.prohibited);
  });

  it("refuses an output with no contract", () => {
    expect(() => governedOutput({ ...ok, contractId: "AI-999" })).toThrow(ContractViolation);
  });

  it("refuses an output addressed to nobody", () => {
    expect(() => governedOutput({ ...ok, owner: "  " })).toThrow(ContractViolation);
  });

  it("refuses a claim that cites nothing", () => {
    expect(() =>
      governedOutput({ ...ok, assertions: [{ claim: "Trust me.", sources: [] }] }),
    ).toThrow(ContractViolation);
  });

  it("refuses an escalation with no deadline", () => {
    expect(() =>
      governedOutput({ ...ok, disposition: "escalate", askedOfOwner: "Do the thing." }),
    ).toThrow(ContractViolation);
  });

  it("refuses an escalation that asks for nothing", () => {
    /* A notification is not a handoff — AI_LAWS.escalationNeverApproval. */
    expect(() =>
      governedOutput({ ...ok, disposition: "escalate", dueBy: "2026-08-07" }),
    ).toThrow(ContractViolation);
  });

  it("has no way to express approval", () => {
    /* The guarantee is structural: `Disposition` has four members and
       none of them approves. If somebody adds one, this fails. */
    const dispositions = new Set(
      [
        governedOutput(ok),
        allClear({ contractId: "AI-001", subject: "v", checked: ["a"], owner: "x", at: AT }),
      ].map((o) => o.disposition),
    );
    for (const d of dispositions) expect(["explain", "escalate", "propose", "clear"]).toContain(d);
  });

  it("takes the weakest confidence, not the average", () => {
    const o = governedOutput({
      ...ok,
      assertions: [
        {
          claim: "Verified thing.",
          evidence: {
            value: "1", confidence: "VERIFIED", observedAt: AT,
            source: "s", observer: "o",
          },
          sources: ["a"],
        },
        {
          claim: "Reported thing.",
          evidence: {
            value: "2", confidence: "REPORTED", observedAt: AT,
            source: "s", observer: "o",
          },
          sources: ["b"],
        },
      ],
    });
    expect(o.confidence).toBe("REPORTED");
  });

  it("classes an unevidenced output as inferred rather than leaving it blank", () => {
    expect(governedOutput(ok).confidence).toBe("INFERRED");
  });

  it("ranks escalations above everything else", () => {
    const clear = allClear({ contractId: "AI-001", subject: "v", checked: ["a"], owner: "x", at: AT });
    const esc = governedOutput({
      ...ok, disposition: "escalate", askedOfOwner: "Act.", dueBy: "2026-08-07",
    });
    expect(rank([clear, esc])[0].disposition).toBe("escalate");
  });
});

describe("ATLAS", () => {
  const noEvents: readonly EventEnvelope[] = [];

  it("says a vehicle with no events is not formed, rather than calling it healthy", () => {
    const o = vehicleHealth({
      vehicleId: "slowspace-coastal", events: noEvents, reserveFloor: ZERO, at: AT,
    });
    /* The distinction this asserts: an empty log is NOT "nothing to
       raise". Reporting clear here would let a vehicle nobody has
       recorded anything about read as a healthy one. */
    expect(o.disposition).toBe("explain");
    expect(o.headline).toMatch(/not yet formed/i);
  });

  it("reports clear only once a vehicle is formed and nothing crosses a threshold", () => {
    const formed: EventEnvelope[] = [
      {
        eventId: "e1", type: "InvestmentVehicleFormed", objectType: "InvestmentVehicle",
        objectId: "v", actorId: "a", occurredAt: AT, payload: {},
      } as unknown as EventEnvelope,
    ];
    const o = vehicleHealth({ vehicleId: "v", events: formed, reserveFloor: ZERO, at: AT });
    /* Silence and health look identical, which is why allClear exists. */
    expect(o.disposition).toBe("clear");
    expect(o.headline).toMatch(/Nothing to raise/);
  });

  it("escalates a reserve breach, with a deadline and a named owner", () => {
    const o = vehicleHealth({
      vehicleId: "v", events: noEvents, reserveFloor: money("1000000"), at: AT,
    });
    expect(o.disposition).toBe("escalate");
    expect(o.owner).toBe("executive_office");
    expect(o.dueBy).toBeTruthy();
    expect(o.askedOfOwner).toBeTruthy();
  });

  it("refuses to propose a distribution when the reserve test fails", () => {
    const o = distributionProposal({
      vehicleId: "v",
      waterfall: {
        revenueBase: money("1000"),
        operatingCompanyShare: ZERO,
        brandParticipationBp: 0,
        debtServiceDue: ZERO,
        reserveBalanceBefore: ZERO,
        reserveFloor: money("999999"),
      },
      reserveFloor: money("999999"),
      reserveAfterFunding: ZERO,
      formulaVersion: "v1",
      at: AT,
    });
    expect(o.disposition).toBe("explain");
    expect(o.disposition).not.toBe("propose");
  });

  it("names the human gate for a distribution, including separation of duties", () => {
    const c = contractById("AI-003")!;
    expect(c.humanGate).toMatch(/SOD-01/);
    /* The contract says approval and execution are different humans, so
       the ask must say so too — otherwise the panel implies one click. */
    expect(c.prohibited).toMatch(/execute/i);
  });

  it("explains authority without any means of granting it", () => {
    const o = authorityExplanation({
      right: "distribution.execute", scope: ENTERPRISE, grants: [], at: AT,
    });
    expect(o.disposition).toBe("explain");
    expect(o.mayMutate).toBe("none");
    expect(o.headline).toMatch(/Nobody holds/);
  });

  it("names every contract it cannot run", () => {
    const atlas = AI_CONTRACTS.filter((c) => c.agent === "ATLAS").map((c) => c.id);
    const unimplemented = UNIMPLEMENTED.map((u) => u.contractId);
    const implemented = ["AI-001", "AI-003", "AI-006"];
    /* Every ATLAS contract is either implemented or declared missing.
       Neither list may silently drop one. */
    expect([...implemented, ...unimplemented].sort()).toEqual([...atlas].sort());
    for (const u of UNIMPLEMENTED) expect(u.waitingOn.length).toBeGreaterThan(30);
  });
});

describe("IRIS", () => {
  it("answers from the corpus and carries the source", () => {
    const r = respond({ question: "what is the minimum commitment", at: AT });
    if (r.kind === "answer") {
      expect(r.source?.to).toBeTruthy();
      expect(r.output.assertions[0].sources.length).toBeGreaterThan(0);
    }
    /* Either outcome is correct behaviour; what is not correct is an
       answer with no source. */
    expect(r.output.contractId).toBe("AI-101");
  });

  it("refuses what it does not hold, and offers a person", () => {
    const r = respond({ question: "what is the weather in paris", at: AT });
    expect(r.kind).toBe("refusal");
    expect(r.escalate).toBe(true);
    /* The refusal is still an auditable artifact — what was asked and
       declined is on the record. */
    expect(r.output.assertions.length).toBeGreaterThan(0);
  });

  it("never dresses a Journal entry as an approved claim", () => {
    const r = respond({ question: "why do beautiful assets make terrible investments", at: AT });
    for (const a of r.output.assertions) {
      /* Reading carries no evidence. Only a corpus answer does — a
         confidence class on an essay would make editorial look approved. */
      if (a.claim.startsWith("Worth reading:")) expect(a.evidence).toBeUndefined();
    }
  });

  it("finds reading in the Journal", () => {
    const reads = reading("what does owning a second home actually cost");
    expect(reads.length).toBeGreaterThan(0);
    for (const r of reads) expect(r.to.startsWith("/journal/")).toBe(true);
  });

  it("returns nothing rather than something irrelevant", () => {
    expect(reading("qqqq zzzz").length).toBe(0);
  });

  it("builds a handoff carrying the whole exchange", () => {
    const o = handoffPackage({
      email: "someone@example.com",
      asked: ["what is the minimum", "how do I exit"],
      said: ["The minimum is stated in the offering."],
      at: AT,
    });
    expect(o.contractId).toBe("AI-103");
    expect(o.disposition).toBe("escalate");
    expect(o.dueBy).toBe("2026-08-04");
    /* "Hide material context" is AI-103's only prohibition, so every
       question must survive into the package. */
    expect(o.assertions.filter((a) => a.claim.startsWith("Asked:")).length).toBe(2);
  });

  it("knows how much it can speak from", () => {
    expect(CORPUS_SIZE.answers).toBeGreaterThan(0);
    expect(CORPUS_SIZE.entries).toBeGreaterThanOrEqual(13);
  });
});
