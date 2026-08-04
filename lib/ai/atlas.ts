/**
 * ATLAS · INSTITUTIONAL INTELLIGENCE — the runtime
 *
 * Authority: constants/ai-contracts.ts AI-001 · AI-003 · AI-006 · WF-4
 *
 * ── WHAT ATLAS ACTUALLY IS ───────────────────────────────────────────
 * A pure fold over the event log that produces governed outputs. Nothing
 * here is probabilistic and nothing here calls a model, and that is not a
 * compromise — it is the only shape that satisfies the contracts.
 *
 * AI-001 requires "source ids and a confidence class on every asserted
 * fact". AI-003 requires "formula version and ledger references". A model
 * asked for a vehicle's reserve position can produce a number that reads
 * correctly and is not the number, and it cannot supply either of those
 * things honestly, because it did not compute the figure — it recalled
 * something shaped like one.
 *
 * The waterfall, the reserve bands and the projections already exist and
 * are already tested. ATLAS's job is to READ them, notice what crosses a
 * threshold, and hand a named human a finding they can check. That is the
 * whole of it, and it is worth more than a chat interface over the same
 * data because it runs whether or not anybody thought to ask.
 *
 * ── WHAT ATLAS MAY NOT DO, ENFORCED RATHER THAN PROMISED ─────────────
 * "Approve · sign · vote · move money." None of those is reachable from
 * this module: it imports no command, no handler and no write path. It
 * returns objects. Somebody else decides what to do with them, and the
 * type has no `approve` disposition to express otherwise.
 *
 * ── THREE OF SIX CONTRACTS, AND THE OTHER THREE SAID OUT LOUD ────────
 * AI-002, AI-004 and AI-005 need a project baseline, an obligation
 * register and executed-agreement extraction. None of those objects
 * exists yet. UNIMPLEMENTED names them with the reason, because a runtime
 * that silently covers half its contracts looks complete, and the half it
 * skipped is the half nobody remembers.
 */

import type { EventEnvelope } from "../events";
import { projectVehicle, type VehicleProjection } from "../projections";
import { ReserveBand, band, breachResponse, mayDistribute } from "../reserve";
import { runWaterfall, type WaterfallInput, type WaterfallResult } from "../waterfall";
import { type Money, format, isZero } from "../money";
import { provenance } from "../provenance";
import { whoCan, type Grant, type Right, type Role, type Scope } from "../authority";
import {
  governedOutput, allClear, rank, type Assertion, type GovernedOutput,
} from "./output";

/**
 * Who owns each finding.
 *
 * Roles, not people. A named individual in a constant would rot the first
 * time somebody changed job, and RBAC LAW 1 holds that access exists as a
 * grant rather than as an identity written into a file. The office
 * resolves the role to a person through the grant table at the moment the
 * output is read.
 */
const OWNER: Record<string, Role> = {
  "AI-001": "executive_office",
  "AI-003": "investment_committee",
  "AI-006": "governance_office",
};

/** Contracts with no runtime, and the object each is waiting on. */
export const UNIMPLEMENTED: readonly { contractId: string; waitingOn: string }[] = [
  { contractId: "AI-002", waitingOn:
    "A project baseline with versioned milestones. Variance is the difference from a baseline, " +
    "and there is nothing to difference against." },
  { contractId: "AI-004", waitingOn:
    "The obligation register. constants/notice-bindings.ts already records that Compliance.Due is " +
    "blocked for exactly this reason." },
  { contractId: "AI-005", waitingOn:
    "Executed-agreement extraction. There is no execution event — ContentVersionPublished is " +
    "publishing, which is a different act." },
];

/**
 * How long a human gets.
 *
 * Stated as an interval added to the run date rather than a fixed date,
 * and short enough that a deadline means something. WF-4 requires a
 * deadline without setting one; these are the operating choice, in one
 * place, so they can be argued with.
 */
const DUE_DAYS: Record<string, number> = {
  breach: 3,          // a constitutional breach is not a fortnight's work
  governanceAlert: 7,
  advisory: 21,
  proposal: 14,
};

const addDays = (iso: string, days: number): string => {
  /* Date arithmetic on the passed clock only. Nothing reads the real one
     — see the note on determinism in output.ts. */
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Every ATLAS assertion is a derivation, and says so. */
const asserts = (
  claim: string,
  value: string,
  sources: readonly string[],
  at: string,
): Assertion => ({
  claim,
  evidence: provenance({
    value,
    /* INFERRED, always. ATLAS computes from recorded events rather than
       observing anything, and F-13 holds that a derived figure never
       outranks what it was derived from. */
    confidence: "INFERRED",
    observedAt: at,
    source: "ATLAS · fold over the event log",
    observer: "ATLAS",
    derivedFrom: [...sources],
  }),
  sources,
});

// ─────────────────────────────────────────────────────────────────────
// AI-001 · Vehicle Health
// ─────────────────────────────────────────────────────────────────────

export interface HealthInput {
  readonly vehicleId: string;
  readonly events: readonly EventEnvelope[];
  /** The reserve floor for this vehicle, per L1-16 §2.3. */
  readonly reserveFloor: Money;
  /** ISO date. The clock, passed rather than read. */
  readonly at: string;
}

/**
 * The universal assessment, across the dimensions the agent registry
 * names: Space, Capital, Time, Governance, Project.
 *
 * Only the ones the event log can answer are asserted. A health report
 * that scores five dimensions when it can compute two is worse than one
 * that reports two, because the three invented scores are indistinguishable
 * from the real ones.
 */
export function vehicleHealth(input: HealthInput): GovernedOutput {
  const p: VehicleProjection = projectVehicle(input.events, input.vehicleId);
  const owner = OWNER["AI-001"];
  const evidence = [`vehicle:${input.vehicleId}`, `events:${p.eventCount}`];

  const reserveBand = band(p.reserveFunded, input.reserveFloor);
  const breach = breachResponse(p.reserveFunded, input.reserveFloor);

  const assertions: Assertion[] = [
    asserts(
      `Reserve stands at ${format(p.reserveFunded)} against a floor of ${format(input.reserveFloor)}.`,
      format(p.reserveFunded),
      [...evidence, "L1-16 §2.3"],
      input.at,
    ),
  ];

  if (p.distributionsBlocked > 0) {
    assertions.push(
      asserts(
        `${p.distributionsBlocked} distribution(s) blocked. Most recent reason: ` +
          `${p.lastBlockReasons[p.lastBlockReasons.length - 1] ?? "not recorded"}.`,
        String(p.distributionsBlocked),
        [...evidence, "projectVehicle.lastBlockReasons"],
        input.at,
      ),
    );
  }

  if (!isZero(p.capitalCalled)) {
    assertions.push(
      asserts(
        `${format(p.capitalDeployed)} deployed of ${format(p.capitalCalled)} called.`,
        format(p.capitalDeployed),
        [...evidence, "projectCapitalTable"],
        input.at,
      ),
    );
  }

  /* A dissolved vehicle still reports, because "nothing to raise" on a
     vehicle that no longer exists would read as health. */
  if (p.dissolved) {
    return governedOutput({
      contractId: "AI-001", subject: input.vehicleId, disposition: "explain",
      headline: "Vehicle is dissolved. Health assessment does not apply.",
      assertions, owner, at: input.at,
    });
  }

  if (breach) {
    return governedOutput({
      contractId: "AI-001", subject: input.vehicleId, disposition: "escalate",
      headline:
        `Constitutional breach: reserve is ${format(breach.shortfall)} below floor.`,
      assertions: [
        ...assertions,
        asserts(
          "Discretionary expenditure must be deferred. Investor capital may NOT fund the " +
            "shortfall — a post-stabilisation call for reserve replenishment is not an " +
            "expressible purpose (F-16).",
          format(breach.shortfall),
          [...evidence, "L1-16 §2.6a", "F-16"],
          input.at,
        ),
      ],
      owner,
      askedOfOwner:
        "Convene on the shortfall and record the deferral decision. Suspension of distributions " +
        "requires an Ordinary Resolution and is not ATLAS's to propose.",
      dueBy: addDays(input.at, DUE_DAYS.breach),
      at: input.at,
    });
  }

  if (reserveBand === ReserveBand.GovernanceAlert) {
    return governedOutput({
      contractId: "AI-001", subject: input.vehicleId, disposition: "escalate",
      headline: "Reserve is within 10% of floor. Executive review and a corrective plan are due.",
      assertions, owner,
      askedOfOwner: "Record a corrective plan against the reserve position.",
      dueBy: addDays(input.at, DUE_DAYS.governanceAlert),
      at: input.at,
    });
  }

  if (reserveBand === ReserveBand.Advisory) {
    return governedOutput({
      contractId: "AI-001", subject: input.vehicleId, disposition: "escalate",
      headline: "Reserve is in the advisory band. Management monitoring applies.",
      assertions, owner,
      askedOfOwner: "Acknowledge, and state whether the trajectory needs action.",
      dueBy: addDays(input.at, DUE_DAYS.advisory),
      at: input.at,
    });
  }

  if (!p.formed) {
    return governedOutput({
      contractId: "AI-001", subject: input.vehicleId, disposition: "explain",
      headline: "Vehicle is not yet formed. Only capital and reserve are assessable.",
      assertions, owner, at: input.at,
    });
  }

  return allClear({
    contractId: "AI-001", subject: input.vehicleId,
    checked: ["reserve band", "distribution blocks", "capital deployment", "lifecycle state"],
    owner, at: input.at,
  });
}

// ─────────────────────────────────────────────────────────────────────
// AI-003 · Distribution Proposal
// ─────────────────────────────────────────────────────────────────────

export interface DistributionInput {
  readonly vehicleId: string;
  readonly waterfall: WaterfallInput;
  readonly reserveFloor: Money;
  readonly reserveAfterFunding: Money;
  /** Which version of the formula produced this. AI-003 requires it. */
  readonly formulaVersion: string;
  readonly at: string;
}

/**
 * Run the waterfall and propose. Never execute.
 *
 * The contract's human gate is the sharpest in the registry: "Approval
 * AND execution are both human, and are different humans (SOD-01)." So
 * this returns a proposal addressed to the approver, and says in the ask
 * that the executor must be somebody else. ATLAS cannot enforce SOD-01 —
 * the grant table does — but it can refuse to pretend the question does
 * not exist.
 */
export function distributionProposal(input: DistributionInput): GovernedOutput {
  const owner = OWNER["AI-003"];
  const result: WaterfallResult = runWaterfall(input.waterfall);
  const gate = mayDistribute(input.reserveAfterFunding, input.reserveFloor);

  const ledgerRefs = [
    `vehicle:${input.vehicleId}`,
    `waterfall:${input.formulaVersion}`,
    "L1-16 §2.6a",
  ];

  const stages: Assertion[] = result.stages.map((s) =>
    asserts(
      `${s.name}: ${format(s.amount)}` +
        (isZero(s.shortfall) ? "." : ` (short by ${format(s.shortfall)}).`),
      format(s.amount),
      [...ledgerRefs, `stage:${s.stage}`],
      input.at,
    ),
  );

  if (!gate.allowed) {
    return governedOutput({
      contractId: "AI-003", subject: input.vehicleId, disposition: "explain",
      headline: "No distribution may be proposed: the prospective reserve test fails.",
      assertions: [
        asserts(
          gate.reason ?? "The prospective test fails.",
          format(input.reserveAfterFunding),
          [...ledgerRefs],
          input.at,
        ),
        ...stages,
      ],
      owner, at: input.at,
    });
  }

  if (result.blockedBy.length > 0) {
    return governedOutput({
      contractId: "AI-003", subject: input.vehicleId, disposition: "explain",
      headline: `Waterfall blocked at ${result.blockedBy.length} point(s). No proposal follows.`,
      assertions: [
        ...result.blockedBy.map((b: string) =>
          asserts(`Blocked: ${b}.`, String(b), [...ledgerRefs], input.at),
        ),
        ...stages,
      ],
      owner, at: input.at,
    });
  }

  return governedOutput({
    contractId: "AI-003", subject: input.vehicleId, disposition: "propose",
    headline:
      `Distribution proposal: ${format(result.partnerDistribution)} to partners, ` +
      `across ${result.stages.length} stages.`,
    assertions: stages,
    owner,
    askedOfOwner:
      "Approve or reject this proposal. Execution must be carried out by a different identity — " +
      "approval and execution may not be held by the same person (SOD-01).",
    dueBy: addDays(input.at, DUE_DAYS.proposal),
    at: input.at,
  });
}

// ─────────────────────────────────────────────────────────────────────
// AI-006 · Authority Explanation
// ─────────────────────────────────────────────────────────────────────

/**
 * Who could do this, and under what.
 *
 * mayMutate is "none" and the disposition is always "explain". The
 * contract's prohibition is one word — "Grant authority" — and the way to
 * honour it is for this function to have no way of expressing a grant.
 * It reads whoCan and reports. That is all it does.
 */
export function authorityExplanation(input: {
  readonly right: Right;
  readonly scope: Scope;
  readonly grants: readonly Grant[];
  readonly at: string;
}): GovernedOutput {
  const owner = OWNER["AI-006"];
  /* whoCan is the same function the authorisation path uses. Explaining
     authority from a second implementation is how an explanation and a
     decision come to disagree. */
  const holders = whoCan(input.right, input.scope, input.grants, input.at);

  const where =
    input.scope.kind === "vehicle" ? `for ${input.scope.vehicleId}` : "enterprise-wide";

  const assertions: Assertion[] =
    holders.length === 0
      ? [
          asserts(
            `No live grant carries "${input.right}" ${where}. Nobody holds it.`,
            "0",
            ["lib/authority.ts whoCan", "auth_office_grant"],
            input.at,
          ),
        ]
      : holders.map((h) =>
          asserts(
            `${h.identityId} holds "${input.right}" ${where}, as ${h.role}.`,
            h.role,
            ["lib/authority.ts whoCan", `grant:${h.grantId}`],
            input.at,
          ),
        );

  return governedOutput({
    contractId: "AI-006",
    subject: `${input.right}@${input.scope.kind === "vehicle" ? input.scope.vehicleId : "enterprise"}`,
    disposition: "explain",
    headline:
      holders.length === 0
        ? `Nobody holds "${input.right}" ${where}.`
        : `${holders.length} identity(ies) hold "${input.right}" ${where}.`,
    assertions,
    owner,
    at: input.at,
  });
}

// ─────────────────────────────────────────────────────────────────────
// The desk
// ─────────────────────────────────────────────────────────────────────

/**
 * Everything ATLAS has to say about one vehicle, most consequential
 * first. What the office cockpit reads.
 */
export function atlasDesk(input: {
  readonly vehicleId: string;
  readonly events: readonly EventEnvelope[];
  readonly reserveFloor: Money;
  readonly distribution?: Omit<DistributionInput, "vehicleId" | "at">;
  readonly at: string;
}): GovernedOutput[] {
  const out: GovernedOutput[] = [
    vehicleHealth({
      vehicleId: input.vehicleId, events: input.events,
      reserveFloor: input.reserveFloor, at: input.at,
    }),
  ];

  if (input.distribution) {
    out.push(distributionProposal({
      ...input.distribution, vehicleId: input.vehicleId, at: input.at,
    }));
  }

  return rank(out);
}
