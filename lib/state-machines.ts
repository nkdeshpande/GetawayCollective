/**
 * STATE MACHINES — object lifecycles with guards
 *
 * Wave 3 · Graph & Lifecycle
 * Serves: A-05 (Asset Lifecycle Is Legal) · A-01 (Asset Identity Never Changes)
 *         F-03 (Capital Is Accounted) · I-03 (Accreditation) · I-08 (Single Actor)
 *
 * ── WHY DECLARE RATHER THAN CODE ─────────────────────────────────────
 * A lifecycle expressed as `if (state === "acquired" && ...)` scattered
 * across handlers is a lifecycle nobody can read. Declared as data it can
 * be linted: every state reachable, every terminal state genuinely
 * terminal, every transition naming a capability that exists, and no
 * irreversible transition quietly acquiring a way back.
 *
 * `sm-lint` checks all of those. The most valuable is the last: an
 * irreversible transition with a reverse path is not a bug that shows up
 * in testing, it is a bug that shows up in an audit years later.
 *
 * ── GUARDS NAME A CAPABILITY, NOT A ROLE ─────────────────────────────
 * Each transition names the COMMAND that may perform it. The command in
 * turn names the right, and the right is carried by roles. Naming the role
 * here would duplicate that chain and let the two drift — the same mistake
 * the vocabulary linter made before it started parsing vocabulary.ts.
 */

import { BusinessObjectType as BO } from "../constants/business-objects";
import type { CommandName } from "./commands";
import type { EventType } from "./events";

export interface Transition {
  from: string;
  to: string;
  /** The capability that performs it. Authority resolves through the registry. */
  via: CommandName;
  emits: EventType;
  /**
   * False when the transition cannot be undone by any path. sm-lint proves
   * the claim rather than trusting it.
   */
  reversible: boolean;
  /** Precondition in prose. What must be true beyond holding the right. */
  guard: string;
}

export interface StateMachine {
  object: BO;
  name: string;
  states: readonly string[];
  initial: string;
  terminal: readonly string[];
  transitions: readonly Transition[];
  /** Why this object has a lifecycle at all. */
  rationale: string;
}

const T = (t: Transition) => t;

// ─────────────────────────────────────────────────────────────────────

export const PROPERTY_LIFECYCLE: StateMachine = {
  object: BO.Property,
  name: "Property",
  rationale:
    "A-05. An asset moves through legally distinct states, each with different governance. " +
    "Jumping from prospecting to exited would skip acquisition terms (A-04) and every diligence gate.",
  states: ["prospecting", "pending", "acquired", "development", "stabilised", "disposition_pending", "exited"],
  initial: "prospecting",
  terminal: ["exited"],
  transitions: [
    T({ from: "prospecting", to: "pending", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "An Investment Thesis exists for the Property (REL-016)." }),
    T({ from: "pending", to: "prospecting", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "Diligence returned adverse, or terms lapsed. Nothing has been acquired." }),
    T({ from: "pending", to: "acquired", via: "CompleteAcquisition", emits: "AcquisitionCompleted",
        reversible: false,
        guard: "Every diligence workstream is clear or clear-with-conditions, and legal title has transferred. " +
               "Irreversible: an Acquisition record is immutable (A-04) and the asset now sits in the portfolio." }),
    T({ from: "acquired", to: "development", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "A capital budget is approved. Reserve funding is met from project capital, not operations." }),
    T({ from: "acquired", to: "stabilised", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: false,
        guard: "Operational Stabilisation. Irreversible: it makes 2.5%+2.5% reserve funding mandatory and closes " +
               "capital calls to growth purposes only (F-16). Un-stabilising would reopen working-capital calls." }),
    T({ from: "development", to: "stabilised", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: false, guard: "As above. Development complete and the asset is operating." }),
    T({ from: "stabilised", to: "disposition_pending", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "Disposition approved by the Investment Committee. Reversible until title transfers." }),
    T({ from: "disposition_pending", to: "stabilised", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "Sale withdrawn or fell through. The asset returns to operation." }),
    T({ from: "disposition_pending", to: "exited", via: "CompleteDisposition", emits: "DispositionCompleted",
        reversible: false, guard: "Legal title has transferred out. The record is retained permanently (REL-015)." }),
  ],
};

export const VEHICLE_LIFECYCLE: StateMachine = {
  object: BO.InvestmentVehicle,
  name: "InvestmentVehicle",
  rationale:
    "Reserve obligations and capital-call rules both key off 'stabilised'. Without a lifecycle " +
    "there is no moment at which F-16 begins to bite.",
  states: ["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"],
  initial: "forming",
  terminal: ["dissolved"],
  transitions: [
    T({ from: "forming", to: "raising", via: "OpenOffering", emits: "OfferingOpened",
        reversible: true, guard: "The LLP is constituted and an offering is open." }),
    T({ from: "raising", to: "forming", via: "CloseOffering", emits: "OfferingClosed",
        reversible: true, guard: "Raise closed without reaching viability. No capital was deployed." }),
    T({ from: "raising", to: "deployed", via: "DeployCapital", emits: "CapitalDeployed",
        reversible: false, guard: "Capital has been deployed into an asset. Irreversible: deployed capital cannot revert to committed (F-03)." }),
    T({ from: "deployed", to: "stabilised", via: "StabiliseVehicle", emits: "InvestmentVehicleStabilised",
        reversible: false,
        guard: "Operational Stabilisation declared. Irreversible for the same reason as the Property transition: " +
               "it permanently narrows what a capital call may fund." }),
    T({ from: "stabilised", to: "winding_down", via: "CompleteDisposition", emits: "DispositionCompleted",
        reversible: true, guard: "Final asset entering disposition. Reversible while any asset is still held." }),
    T({ from: "winding_down", to: "stabilised", via: "AdvancePropertyLifecycle", emits: "PropertyLifecycleAdvanced",
        reversible: true, guard: "A disposition was withdrawn and the vehicle still holds assets." }),
    T({ from: "winding_down", to: "dissolved", via: "DissolveVehicle", emits: "InvestmentVehicleDissolved",
        reversible: false,
        guard: "A Special Resolution (>=76%) has passed and all obligations are settled. " +
               "Records survive dissolution; the entity does not." }),
  ],
};

export const COMMITMENT_LIFECYCLE: StateMachine = {
  object: BO.Commitment,
  name: "Commitment",
  rationale:
    "L1-01 §24b. Acceptance is the accreditation test point, so the lifecycle must distinguish " +
    "'offered' from 'accepted' — the whole COMPLETE-THEN-SUSPEND ruling turns on that boundary.",
  states: ["offered", "accepted", "settled", "lapsed", "withdrawn"],
  initial: "offered",
  terminal: ["settled", "lapsed", "withdrawn"],
  transitions: [
    T({ from: "offered", to: "accepted", via: "AcceptCommitment", emits: "CommitmentAccepted",
        reversible: false,
        guard: "Accreditation is VALID AT THIS MOMENT and the amount meets the offering minimum. " +
               "Irreversible: expiry after lawful acceptance does not invalidate the commitment (F-10)." }),
    T({ from: "offered", to: "lapsed", via: "AcceptCommitment", emits: "CommitmentLapsed",
        reversible: false, guard: "Accreditation expired before acceptance. Lapse is automatic, not discretionary." }),
    T({ from: "offered", to: "withdrawn", via: "AcceptCommitment", emits: "CommitmentWithdrawn",
        reversible: false, guard: "Withdrawn in writing by the investor before acceptance." }),
    T({ from: "accepted", to: "settled", via: "DeployCapital", emits: "CommitmentSettled",
        reversible: false, guard: "Funds received. Settlement triggers the Member Law promotion (I-08)." }),
  ],
};

export const OFFERING_LIFECYCLE: StateMachine = {
  object: BO.InvestmentOffering,
  name: "InvestmentOffering",
  rationale: "Terms disclosed at open are the terms commitments are made on. Reopening would change them retroactively.",
  states: ["draft", "open", "closed", "cancelled"],
  initial: "draft",
  terminal: ["closed", "cancelled"],
  transitions: [
    T({ from: "draft", to: "open", via: "OpenOffering", emits: "OfferingOpened",
        reversible: true, guard: "Minimum subscription and brand participation rate are disclosed." }),
    T({ from: "open", to: "draft", via: "CloseOffering", emits: "OfferingClosed",
        reversible: true, guard: "Pulled before any commitment was accepted." }),
    T({ from: "open", to: "closed", via: "CloseOffering", emits: "OfferingClosed",
        reversible: false, guard: "Raise complete. Irreversible: reopening would let later commitments join on stale disclosed terms." }),
    T({ from: "draft", to: "cancelled", via: "CloseOffering", emits: "OfferingClosed",
        reversible: false, guard: "Abandoned before opening." }),
  ],
};

export const ACCREDITATION_LIFECYCLE: StateMachine = {
  object: BO.Investor,
  name: "Accreditation",
  rationale:
    "L1-01 §24b. Validity is fifteen WORKING DAYS — accreditation facilitates a specific transaction, " +
    "not standing eligibility. Expiry is normal, not exceptional, so the cycle is deliberately re-enterable.",
  states: ["none", "in_review", "accredited", "expired"],
  initial: "none",
  terminal: [],
  transitions: [
    T({ from: "none", to: "in_review", via: "GrantAccreditation", emits: "AccreditationGranted",
        reversible: true, guard: "Offline compliance process initiated by the Compliance Office." }),
    T({ from: "in_review", to: "accredited", via: "GrantAccreditation", emits: "AccreditationGranted",
        reversible: true, guard: "KYC, AML, suitability and source-of-funds satisfied for this opportunity." }),
    T({ from: "in_review", to: "none", via: "ExpireAccreditation", emits: "AccreditationExpired",
        reversible: true, guard: "Review closed without granting." }),
    T({ from: "accredited", to: "expired", via: "ExpireAccreditation", emits: "AccreditationExpired",
        reversible: true,
        guard: "Fifteen working days elapsed. Blocks NEW commitments only — voting, distribution and " +
               "information rights survive, because they attach to ownership (§24b)." }),
    T({ from: "expired", to: "in_review", via: "GrantAccreditation", emits: "AccreditationGranted",
        reversible: true, guard: "Re-accreditation sought for a further transaction." }),
  ],
};

export const MEMBER_LIFECYCLE: StateMachine = {
  object: BO.Investor,
  name: "MemberState",
  rationale:
    "I-08. One identity, two states. The transition is a state change on an existing record, " +
    "never a second record. Membership records history, not balance.",
  states: ["investor", "member"],
  initial: "investor",
  terminal: ["member"],
  transitions: [
    T({ from: "investor", to: "member", via: "DeployCapital", emits: "MemberStatePromoted",
        reversible: false,
        guard: "First capital commitment SETTLED. Irreversible: holdings falling to zero does not revert it, " +
               "because the governance record of what they voted on does not disappear when they exit." }),
  ],
};

export const MACHINES: readonly StateMachine[] = [
  PROPERTY_LIFECYCLE, VEHICLE_LIFECYCLE, COMMITMENT_LIFECYCLE,
  OFFERING_LIFECYCLE, ACCREDITATION_LIFECYCLE, MEMBER_LIFECYCLE,
];

// ─────────────────────────────────────────────────────────────────────

export class TransitionError extends Error {}

export function machineFor(name: string): StateMachine | undefined {
  return MACHINES.find((m) => m.name === name);
}

export function legalTransitions(m: StateMachine, from: string): Transition[] {
  return m.transitions.filter((t) => t.from === from);
}

export function mayTransition(m: StateMachine, from: string, to: string): boolean {
  return m.transitions.some((t) => t.from === from && t.to === to);
}

/**
 * Assert a transition, or explain precisely why not.
 *
 * The error names the legal moves rather than only refusing. A rejection
 * that does not say what WOULD have worked sends the reader to the source,
 * and the source is this file — so it may as well answer here.
 */
export function assertTransition(m: StateMachine, from: string, to: string): Transition {
  if (!m.states.includes(from)) {
    throw new TransitionError(`${m.name}: "${from}" is not a state of this machine`);
  }
  if (!m.states.includes(to)) {
    throw new TransitionError(`${m.name}: "${to}" is not a state of this machine`);
  }
  const t = m.transitions.find((x) => x.from === from && x.to === to);
  if (!t) {
    const legal = legalTransitions(m, from).map((x) => x.to);
    throw new TransitionError(
      `${m.name}: ${from} -> ${to} is not a legal transition. ` +
        (legal.length ? `From "${from}" you may go to: ${legal.join(", ")}.` : `"${from}" is terminal.`),
    );
  }
  return t;
}

/** States reachable from `initial`. Used by sm-lint to find dead states. */
export function reachableStates(m: StateMachine): Set<string> {
  const seen = new Set<string>([m.initial]);
  const queue = [m.initial];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const t of m.transitions.filter((x) => x.from === cur)) {
      if (!seen.has(t.to)) { seen.add(t.to); queue.push(t.to); }
    }
  }
  return seen;
}

/**
 * Prove an irreversible transition really is.
 *
 * Walks forward from the destination looking for any path back to the
 * origin. A declared-irreversible transition with a route home is the
 * failure this exists to catch — and it is not the kind that surfaces in
 * testing, it is the kind that surfaces in an audit years later.
 */
export function reachesFrom(m: StateMachine, from: string, target: string): boolean {
  const seen = new Set<string>();
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const t of m.transitions.filter((x) => x.from === cur)) {
      if (t.to === target) return true;
      if (!seen.has(t.to)) { seen.add(t.to); queue.push(t.to); }
    }
  }
  return false;
}

export function explainMachine(m: StateMachine): string {
  const lines = [`${m.name} (${m.object})`, `  initial: ${m.initial}`,
    `  terminal: ${m.terminal.length ? m.terminal.join(", ") : "none — this cycle is re-enterable"}`, ""];
  for (const t of m.transitions) {
    lines.push(`  ${t.from} -> ${t.to}${t.reversible ? "" : "   [irreversible]"}`);
    lines.push(`      via ${t.via}, emits ${t.emits}`);
    lines.push(`      ${t.guard}`);
  }
  return lines.join("\n");
}
