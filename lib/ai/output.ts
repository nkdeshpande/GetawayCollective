/**
 * THE GOVERNED OUTPUT — what an agent is allowed to hand a person
 *
 * Authority: constants/ai-contracts.ts · AI_LAWS.governedOutput · FIX-10
 *
 * ── WHY THE OBJECT COMES BEFORE THE MODEL ────────────────────────────
 * ai-contracts.ts states the rule and then declines to implement it:
 * "Wiring a model before the output object exists produces exactly the
 * failure the fix was written to prevent." This is that object.
 *
 * FIX-10 names the failure "invisible agent actions" — a recommendation
 * that arrives as a sentence in a panel, gets acted on, and leaves no
 * record that an agent produced it. Every property below exists to make
 * that impossible. An output must name the contract that permitted it,
 * the agent that produced it, every assertion it makes WITH provenance,
 * the human who owns the decision, and what it is asking that human to
 * do. An output that cannot supply those cannot be constructed.
 *
 * ── WHY THIS IS NOT A LANGUAGE MODEL, AND WHAT WOULD CHANGE ──────────
 * Nothing here calls one. Both engines are pure functions over the event
 * log and the approved corpus, which is what makes them testable, what
 * makes ADR-0007 hold, and what makes every figure traceable.
 *
 * That is not a placeholder for a model — it is the division of labour a
 * model would have to respect. When one is wired its job is to improve
 * MATCHING, which is understanding what a person asked, and RANKING,
 * which is deciding what to surface first. It never authors an assertion,
 * because an assertion here carries a confidence class and a source, and
 * a model cannot honestly supply either about this platform's own state.
 *
 * ── THE CLOCK IS AN ARGUMENT ─────────────────────────────────────────
 * `at` is passed in rather than read. A projection that reads the clock
 * is not a pure fold and two runs over the same events stop agreeing,
 * which is precisely what projectionIsDeterministic exists to catch.
 */

import type { AgentId, AiContract, MutationLevel } from "../../constants/ai-contracts";
import { contractById } from "../../constants/ai-contracts";
import type { Confidence, Provenanced } from "../provenance";
import { weakest } from "../provenance";

/**
 * What the output is asking for.
 *
 * There is no `approve`. AI_LAWS.escalationNeverApproval holds that
 * neither agent approves a fiduciary act, and the way to enforce that is
 * to leave the word out of the type rather than to check for it later.
 */
export type Disposition =
  /** Information. Nothing is being asked. */
  | "explain"
  /** A named human should look at this, with a deadline. */
  | "escalate"
  /** A draft exists and means nothing until a human confirms it. */
  | "propose"
  /** Nothing to report, said out loud — see the note on silence below. */
  | "clear";

export class ContractViolation extends Error {}

/** One thing the output claims, and where it came from. */
export interface Assertion {
  /** What is being claimed, in the words a person reads. */
  readonly claim: string;
  /** The provenanced figure or fact behind it, where there is one. */
  readonly evidence?: Provenanced<string>;
  /** Event ids, document versions or route paths a person can go and check. */
  readonly sources: readonly string[];
}

export interface GovernedOutput {
  /** Stable within a run: contract id, subject and ordinal. Never random. */
  readonly id: string;
  readonly contractId: string;
  readonly agent: AgentId;
  /** The named output object from the contract. Copied, never invented. */
  readonly outputObject: string;
  /** What this is about — a vehicle id, a member id, a question. */
  readonly subject: string;
  readonly disposition: Disposition;
  /** One line. What a person reads first and may be the only thing they read. */
  readonly headline: string;
  readonly assertions: readonly Assertion[];
  /**
   * The weakest confidence across every assertion.
   *
   * Weakest, not average. A recommendation is only as good as the softest
   * thing it rests on, and averaging is how a REPORTED figure gets
   * laundered by two VERIFIED ones sitting beside it.
   */
  readonly confidence: Confidence;
  /** The role that owns the decision. Never the agent. */
  readonly owner: string;
  /** What the owner is being asked to do. Absent only when explaining. */
  readonly askedOfOwner?: string;
  /** ISO date. Required whenever a human is being asked for something. */
  readonly dueBy?: string;
  /** What this output did NOT do, in the contract's own words. */
  readonly prohibited: string;
  readonly mayMutate: MutationLevel;
  readonly at: string;
}

/**
 * Build one, or refuse.
 *
 * Every check here is a clause of a contract that would otherwise be
 * enforced by review. AI_LAWS says the named negatives are "enforced by
 * review today, by code when wired" — this is the wiring.
 */
export function governedOutput(o: {
  contractId: string;
  subject: string;
  disposition: Disposition;
  headline: string;
  assertions: readonly Assertion[];
  owner: string;
  askedOfOwner?: string;
  dueBy?: string;
  at: string;
  ordinal?: number;
}): GovernedOutput {
  const contract: AiContract | undefined = contractById(o.contractId);
  if (!contract) {
    throw new ContractViolation(
      `no contract "${o.contractId}" exists. An output with no contract is the invisible agent ` +
        `action FIX-10 names — there would be nothing to audit it against.`,
    );
  }

  if (!o.owner?.trim()) {
    throw new ContractViolation(
      `${o.contractId} produced an output with no owner. Every contract names a human gate ` +
        `("${contract.humanGate}"), and an output addressed to nobody cannot pass through it.`,
    );
  }

  if (!o.headline?.trim()) {
    throw new ContractViolation(`${o.contractId}: an output must state its finding in one line.`);
  }

  /* An escalation that carries no deadline and no ask is a notification,
     and AI_LAWS.escalationNeverApproval is explicit that a notification
     is not a handoff. */
  if (o.disposition === "escalate" || o.disposition === "propose") {
    if (!o.askedOfOwner?.trim()) {
      throw new ContractViolation(
        `${o.contractId}: an output that escalates or proposes must say what it is asking of ` +
          `${o.owner}. Without it this is a notification, and a notification is not a handoff.`,
      );
    }
    if (!o.dueBy || !/^\d{4}-\d{2}-\d{2}/.test(o.dueBy)) {
      throw new ContractViolation(
        `${o.contractId}: an escalation must carry a deadline (WF-4). Received "${o.dueBy}".`,
      );
    }
  }

  /* Provenance is not optional — the contract says what its output must
     carry to be believable, and every contract in the registry says
     something. A claim with no source is the one kind of claim this
     platform cannot let a reader assess. */
  if (o.disposition !== "clear" && o.assertions.length === 0) {
    throw new ContractViolation(
      `${o.contractId}: an output that is not "clear" must assert something. ` +
        `Its contract requires ${contract.provenance}.`,
    );
  }
  for (const a of o.assertions) {
    if (a.sources.length === 0) {
      throw new ContractViolation(
        `${o.contractId}: the claim "${a.claim}" cites nothing. ` +
          `This contract's output must carry ${contract.provenance}.`,
      );
    }
  }

  const confidences = o.assertions
    .map((a) => a.evidence?.confidence)
    .filter((c): c is Confidence => c !== undefined);

  /* Where nothing is provenanced the output is still INFERRED rather than
     unclassified. An agent's reading of state is a derivation whatever it
     rests on, and leaving the field blank would let it read as fact. */
  const confidence: Confidence = confidences.length > 0 ? weakest(confidences) : "INFERRED";

  return Object.freeze({
    id: `${o.contractId}:${o.subject}:${o.ordinal ?? 0}`,
    contractId: contract.id,
    agent: contract.agent,
    outputObject: contract.outputObject,
    subject: o.subject,
    disposition: o.disposition,
    headline: o.headline,
    assertions: Object.freeze([...o.assertions]),
    confidence,
    owner: o.owner,
    askedOfOwner: o.askedOfOwner,
    dueBy: o.dueBy,
    prohibited: contract.prohibited,
    mayMutate: contract.mayMutate,
    at: o.at,
  });
}

/**
 * Say nothing, out loud.
 *
 * An agent that reports only when something is wrong is indistinguishable
 * from an agent that has stopped running. "Clear" is a finding: it states
 * what was checked, so silence can be told apart from failure.
 */
export function allClear(o: {
  contractId: string;
  subject: string;
  checked: readonly string[];
  owner: string;
  at: string;
}): GovernedOutput {
  return governedOutput({
    contractId: o.contractId,
    subject: o.subject,
    disposition: "clear",
    headline: `Nothing to raise across ${o.checked.length} check(s).`,
    assertions: [],
    owner: o.owner,
    at: o.at,
  });
}

/** Most consequential first, then weakest evidence first within that. */
const DISPOSITION_RANK: Record<Disposition, number> = {
  escalate: 0, propose: 1, explain: 2, clear: 3,
};

export function rank(outputs: readonly GovernedOutput[]): GovernedOutput[] {
  return [...outputs].sort(
    (a, b) =>
      DISPOSITION_RANK[a.disposition] - DISPOSITION_RANK[b.disposition] ||
      (a.dueBy ?? "9999").localeCompare(b.dueBy ?? "9999") ||
      a.id.localeCompare(b.id),
  );
}
