/**
 * COMMANDS — the capability layer (L5)
 *
 * Wave 2
 * Serves: E-01 (Every Capability Publishes Events) · E-02 (Provenance)
 *         I-01 (Authentication) · I-02 (Explicit Authority)
 *         I-04 (Sessions Audited) · I-07 (Conflicts Disclosed)
 *
 * ── WHAT A CAPABILITY IS ─────────────────────────────────────────────
 * A command is the ONLY way state changes. It declares, up front and in
 * data: the right it needs, the events it emits, whether it is a decision,
 * and whether it is conflict-sensitive.
 *
 * Declaring these as data rather than burying them in handler code is what
 * makes them lintable. `cap-lint` reads this registry and refuses a command
 * that emits nothing (E-01) or names a right that does not exist. A rule
 * that lives only inside a function body is a rule that is checked only
 * when someone remembers to look.
 *
 * ── THE ENVELOPE RUNS IN ONE ORDER, ALWAYS ───────────────────────────
 *   authenticate -> authorise -> conflict gate -> handler -> emit
 *
 * Authority is evaluated BEFORE the handler, so a handler never runs for an
 * actor who may not invoke it. Events are emitted AFTER the handler, so no
 * event claims a change that did not happen. Both orderings are load-bearing.
 */

import { BusinessObjectType as BO } from "../constants/business-objects";
import { EventType, EventEnvelope, EventLog, DECISION_EVENTS } from "./events";
import {
  Right, Scope, Grant, authorise, SessionAudit, ENTERPRISE, vehicleScope,
} from "./authority";
import { ConflictDisclosure, conflictGate } from "./governance";

export type CommandName =
  | "RegisterOrganization"
  | "ConstituteCommittee"
  | "GrantAuthority"
  | "RevokeAuthority"
  | "FormInvestmentVehicle"
  | "StabiliseVehicle"
  | "CreatePortfolio"
  | "RegisterProperty"
  | "AdvancePropertyLifecycle"
  | "CompleteAcquisition"
  | "RecordValuation"
  | "CompleteDisposition"
  | "OpenOffering"
  | "CloseOffering"
  | "AcceptCommitment"
  | "CallCapital"
  | "DeployCapital"
  | "ExecuteDistribution"
  | "TransferOwnership"
  | "DissolveVehicle"
  | "DiscloseConflict"
  | "CastVote"
  | "GrantAccreditation"
  | "ExpireAccreditation"
  | "TableResolution"
  | "ResolveResolution"
  | "ApprovePolicyVersion"
  | "RecordComplianceEvent"
  | "DeclareConstitutionalFailure"
  | "DeclareReserveBreach"
  | "PublishPerformanceReport"
  | "VersionInvestmentThesis"
  | "CompleteDueDiligence";

export interface CapabilityDefinition {
  name: CommandName;
  object: BO;
  requiredRight: Right;
  /** Scope the right is evaluated in. */
  scopeKind: "enterprise" | "vehicle";
  /** E-01 — at least one. A command emitting nothing is a silent state change. */
  emits: readonly EventType[];
  /** E-02 — the invocation must carry a reason. */
  requiresReason: boolean;
  /** I-07 — a known conflict must be disclosed before invoking. */
  conflictSensitive: boolean;
  description: string;
}

const C = (d: CapabilityDefinition) => d;

export const CAPABILITIES: readonly CapabilityDefinition[] = [
  // ── Enterprise ────────────────────────────────────────────────────
  C({ name: "RegisterOrganization", object: BO.Organization, requiredRight: "organization.register",
      scopeKind: "enterprise", emits: ["OrganizationRegistered"], requiresReason: false,
      conflictSensitive: false,
      description: "Register a legal entity and its constitutional role (L1-01 §2)." }),
  C({ name: "ConstituteCommittee", object: BO.Committee, requiredRight: "committee.constitute",
      scopeKind: "enterprise", emits: ["CommitteeConstituted", "CommitteeAuthorityDelegated"],
      requiresReason: true, conflictSensitive: false,
      description: "Stand up a governance body and record what it may decide versus recommend (EP-01 §3.5)." }),
  C({ name: "GrantAuthority", object: BO.Committee, requiredRight: "authority.grant",
      scopeKind: "enterprise", emits: ["AuthorityGranted"], requiresReason: true,
      conflictSensitive: true,
      description: "Delegate a role within a scope. Conflict-sensitive: granting authority to a related party is the classic self-dealing route." }),
  C({ name: "RevokeAuthority", object: BO.Committee, requiredRight: "authority.revoke",
      scopeKind: "enterprise", emits: ["AuthorityRevoked"], requiresReason: true,
      conflictSensitive: false,
      description: "Withdraw a grant. Revocation is immediate; historical actions taken under it remain valid." }),

  // ── Vehicles & portfolio ──────────────────────────────────────────
  C({ name: "FormInvestmentVehicle", object: BO.InvestmentVehicle, requiredRight: "vehicle.form",
      scopeKind: "enterprise", emits: ["InvestmentVehicleFormed"], requiresReason: true,
      conflictSensitive: false,
      description: "Constitute an LLP. Anything other than an LLP requires Board approval (L1-01 §24a)." }),
  C({ name: "StabiliseVehicle", object: BO.InvestmentVehicle, requiredRight: "vehicle.stabilise",
      scopeKind: "vehicle", emits: ["InvestmentVehicleStabilised"], requiresReason: true,
      conflictSensitive: false,
      description: "Declare Operational Stabilisation. Makes the 2.5%+2.5% reserve funding mandatory and closes capital calls to growth purposes only (F-16)." }),
  C({ name: "CreatePortfolio", object: BO.Portfolio, requiredRight: "portfolio.manage",
      scopeKind: "enterprise", emits: ["PortfolioCreated"], requiresReason: false,
      conflictSensitive: false,
      description: "Create a curated collection under a stated investment strategy." }),

  // ── Assets ────────────────────────────────────────────────────────
  C({ name: "RegisterProperty", object: BO.Property, requiredRight: "property.register",
      scopeKind: "vehicle", emits: ["PropertyRegistered"], requiresReason: false,
      conflictSensitive: false,
      description: "Register a Property against exactly one Investment Vehicle (F-01, A-02)." }),
  C({ name: "AdvancePropertyLifecycle", object: BO.Property, requiredRight: "property.advance_lifecycle",
      scopeKind: "vehicle", emits: ["PropertyLifecycleAdvanced"], requiresReason: true,
      conflictSensitive: false,
      description: "Move a Property through the legal state machine. Illegal transitions are rejected (A-05)." }),
  C({ name: "CompleteAcquisition", object: BO.Acquisition, requiredRight: "acquisition.complete",
      scopeKind: "vehicle", emits: ["AcquisitionCompleted", "LedgerEntryPosted"], requiresReason: true,
      conflictSensitive: true,
      description: "Record acquisition terms. Immutable thereafter; changes are amendment records (A-04)." }),
  C({ name: "RecordValuation", object: BO.Valuation, requiredRight: "valuation.record",
      scopeKind: "vehicle", emits: ["ValuationRecorded"], requiresReason: true,
      conflictSensitive: true,
      // requiresReason raised to true: posting a MANAGEMENT valuation where an
      // independent one could have been obtained is a judgement, and a
      // conflict-sensitive one. Disclosing the conflict and then saying
      // nothing about why you proceeded is half a record.
      description: "Post a dated valuation. Source must state independent or management (F-13, A-03)." }),
  C({ name: "CompleteDisposition", object: BO.Disposition, requiredRight: "disposition.complete",
      scopeKind: "vehicle", emits: ["DispositionCompleted", "LedgerEntryPosted"], requiresReason: true,
      conflictSensitive: true,
      description: "Record an exit. Permanent record retained after the asset leaves the portfolio." }),

  // ── Capital ───────────────────────────────────────────────────────
  C({ name: "OpenOffering", object: BO.InvestmentOffering, requiredRight: "offering.open",
      scopeKind: "vehicle", emits: ["OfferingOpened"], requiresReason: false,
      conflictSensitive: false,
      description: "Open a capital raise with disclosed minimum subscription and brand participation rate." }),
  C({ name: "CloseOffering", object: BO.InvestmentOffering, requiredRight: "offering.close",
      scopeKind: "vehicle", emits: ["OfferingClosed"], requiresReason: false,
      conflictSensitive: false,
      description: "Close a raise. Irreversible." }),
  C({ name: "AcceptCommitment", object: BO.Commitment, requiredRight: "commitment.accept",
      scopeKind: "vehicle",
      // Three outcomes of one command. Lapse and withdrawal are not failures
      // of the command; they are results of it, and both change state.
      emits: ["CommitmentAccepted", "CommitmentLapsed", "CommitmentWithdrawn"],
      requiresReason: true,
      conflictSensitive: false,
      description: "Accept a binding commitment. THIS is the accreditation test point: valid here means the commitment completes even if accreditation later expires (L1-01 §24b, F-10)." }),
  C({ name: "CallCapital", object: BO.CapitalCall, requiredRight: "capital.call",
      scopeKind: "vehicle", emits: ["CapitalCalled"], requiresReason: true,
      conflictSensitive: false,
      description: "Call committed capital. Post-stabilisation the purpose must be a growth purpose (F-16)." }),
  C({ name: "DeployCapital", object: BO.Investment, requiredRight: "capital.deploy",
      scopeKind: "vehicle",
      // MemberStatePromoted fires HERE, not at acceptance. The Member Law is
      // triggered by the first commitment SETTLING - a commitment can be
      // accepted and then never funded, and promoting at acceptance would
      // make a Member of someone who never paid.
      emits: ["CapitalDeployed", "LedgerEntryPosted", "CommitmentSettled", "MemberStatePromoted"],
      requiresReason: true,
      conflictSensitive: true,
      description: "Deploy drawn capital. Moves it between accounted states (F-03)." }),
  C({ name: "ExecuteDistribution", object: BO.Distribution, requiredRight: "distribution.execute",
      scopeKind: "vehicle",
      // DistributionBlocked is emitted when a hard stop fires. A block is a
      // state change too — the money stayed put, and the record of WHY is
      // what a member is owed when a distribution they expected did not land.
      emits: ["DistributionExecuted", "DistributionBlocked", "LedgerEntryPosted"],
      requiresReason: true, conflictSensitive: false,
      description: "Run the six-stage waterfall and pay stage 6. Blocked by unpaid debt service, reserve below floor, or suspension by resolution (F-05, F-06)." }),
  C({ name: "TransferOwnership", object: BO.OwnershipPosition, requiredRight: "ownership.transfer",
      scopeKind: "vehicle", emits: ["OwnershipTransferred"], requiresReason: true,
      conflictSensitive: true,
      description: "Transfer units. Additive: creates new records, never edits history (F-12)." }),

  // ── Identity & compliance ─────────────────────────────────────────
  C({ name: "GrantAccreditation", object: BO.Investor, requiredRight: "accreditation.grant",
      scopeKind: "enterprise", emits: ["AccreditationGranted"], requiresReason: false,
      conflictSensitive: false,
      description: "Grant accreditation valid for fifteen working days. Transaction-specific, not standing eligibility (L1-01 §24b)." }),
  C({ name: "ExpireAccreditation", object: BO.Investor, requiredRight: "accreditation.grant",
      scopeKind: "enterprise", emits: ["AccreditationExpired"], requiresReason: false,
      conflictSensitive: false,
      // Separate from GrantAccreditation because it is a different act with a
      // different consequence. Expiry blocks NEW commitments and nothing else -
      // voting, distribution and information rights survive it (§24b).
      description: "Record accreditation expiry after fifteen working days, or closure of a review without grant." }),
  C({ name: "RecordComplianceEvent", object: BO.ComplianceEvent, requiredRight: "compliance.record",
      scopeKind: "enterprise", emits: ["ComplianceEventRecorded"], requiresReason: true,
      conflictSensitive: false,
      description: "Record an audit finding, regulatory notice, breach, or operator SLA failure." }),
  C({ name: "DeclareConstitutionalFailure", object: BO.ComplianceEvent,
      requiredRight: "constitutional_failure.declare", scopeKind: "enterprise",
      emits: ["ConstitutionalFailureDeclared", "ComplianceEventRecorded"], requiresReason: true,
      conflictSensitive: true,
      description: "Declare CF-01..CF-06. Cannot be vetoed. Conflict-sensitive because the declaring authority may be implicated (L1-01 §31)." }),
  C({ name: "DeclareReserveBreach", object: BO.InvestmentVehicle, requiredRight: "compliance.record",
      scopeKind: "vehicle", emits: ["ReserveBreachDeclared"], requiresReason: true,
      conflictSensitive: false,
      description: "Broadcast a reserve breach and defer discretionary expenditure. Never triggers a capital call (F-16)." }),

  C({ name: "DissolveVehicle", object: BO.InvestmentVehicle, requiredRight: "vehicle.dissolve",
      scopeKind: "vehicle", emits: ["InvestmentVehicleDissolved"], requiresReason: true,
      conflictSensitive: false,
      description: "Wind up an LLP. A Special Resolution matter (§24a); the records survive dissolution." }),

  // ── Governance ────────────────────────────────────────────────────
  C({ name: "DiscloseConflict", object: BO.ComplianceEvent, requiredRight: "conflict.disclose",
      scopeKind: "enterprise", emits: ["ConflictDisclosed"], requiresReason: true,
      conflictSensitive: false,
      // Every role carries conflict.disclose. Disclosure is a DUTY, not a
      // privilege — gating it behind a scarce right would mean the people
      // most likely to hold a conflict are least able to declare it.
      // Not itself conflict-sensitive: requiring prior disclosure in order
      // to disclose would be circular.
      description: "Declare a conflict before deliberation or voting. Conflicts are permitted; undisclosed conflicts are not (EP-01 §4.6, I-07)." }),
  C({ name: "CastVote", object: BO.Resolution, requiredRight: "vote.cast",
      scopeKind: "vehicle", emits: ["VoteCast"], requiresReason: false,
      conflictSensitive: true,
      // requiresReason is FALSE deliberately: I-05 makes the ballot secret,
      // and a mandatory per-voter rationale would be a record of how each
      // holder voted by another name. The RESOLUTION carries the reasoning;
      // the ballot does not.
      description: "Cast an equity-weighted ballot. The vote is sealed (I-05); only the aggregate is published." }),
  C({ name: "TableResolution", object: BO.Resolution, requiredRight: "resolution.table",
      scopeKind: "enterprise", emits: ["ResolutionTabled"], requiresReason: true,
      conflictSensitive: false,
      description: "Table a matter for vote. Constitutional amendments require 30 days notice (L1-01 §32a)." }),
  C({ name: "ResolveResolution", object: BO.Resolution, requiredRight: "resolution.resolve",
      scopeKind: "enterprise", emits: ["ResolutionResolved"], requiresReason: true,
      conflictSensitive: true,
      description: "Compute and publish the outcome. Derived from the tally with no interpretation step (F-09)." }),
  C({ name: "ApprovePolicyVersion", object: BO.Policy, requiredRight: "policy.approve",
      scopeKind: "enterprise", emits: ["PolicyVersionApproved"], requiresReason: true,
      conflictSensitive: false,
      description: "Approve an Enterprise Policy version. Board only (EP-01 §5.11)." }),

  // ── Reporting & knowledge ─────────────────────────────────────────
  C({ name: "PublishPerformanceReport", object: BO.PerformanceReport, requiredRight: "report.publish",
      scopeKind: "vehicle", emits: ["PerformanceReportPublished"], requiresReason: false,
      conflictSensitive: false,
      description: "Publish IRR, MOIC, NAV and reserve coverage. Metrics use one formula everywhere (F-14)." }),
  C({ name: "VersionInvestmentThesis", object: BO.InvestmentThesis, requiredRight: "thesis.version",
      scopeKind: "vehicle", emits: ["InvestmentThesisVersioned"], requiresReason: true,
      conflictSensitive: false,
      description: "Version a thesis. Knowledge versions forward; prior versions remain retrievable (E-03)." }),
  C({ name: "CompleteDueDiligence", object: BO.DueDiligence, requiredRight: "diligence.complete",
      scopeKind: "vehicle", emits: ["DueDiligenceCompleted"], requiresReason: false,
      conflictSensitive: false,
      description: "Close a diligence workstream. An adverse finding blocks acquisition approval." }),
];

export const CAPABILITY_BY_NAME: Record<string, CapabilityDefinition> = Object.fromEntries(
  CAPABILITIES.map((c) => [c.name, c]),
);

// ─── Execution envelope ──────────────────────────────────────────────

export interface CommandContext {
  identityId: string | null;
  sessionId: string;
  /** ISO-8601 UTC. Supplied, never read from a clock — replayability. */
  now: string;
  correlationId: string;
  vehicleId?: string;
  reason?: string;
  actorHasKnownConflict?: boolean;
  disclosures?: readonly ConflictDisclosure[];
  grants: readonly Grant[];
}

export interface CommandResult<T = unknown> {
  ok: boolean;
  value?: T;
  error?: string;
  events: EventEnvelope[];
}

export class CapabilityError extends Error {}

let seq = 0;
const nextEventId = (correlationId: string) => `${correlationId}-e${++seq}`;
/** Test seam. Production ids come from the persistence layer. */
export const __resetEventSeq = () => { seq = 0; };

/**
 * Run a capability with the constitutional envelope around it.
 *
 * The handler receives an `emit` function and MUST use it. If it returns
 * having emitted nothing, this throws — E-01 is enforced at runtime, not
 * merely documented. A command that changes state silently is the one
 * failure the whole event architecture exists to prevent, so it is not
 * left to review.
 */
export function execute<T>(
  name: CommandName,
  ctx: CommandContext,
  log: EventLog,
  audit: SessionAudit,
  handler: (emit: (type: EventType, objectId: string, payload: Record<string, unknown>) => void) => T,
): CommandResult<T> {
  const cap = CAPABILITY_BY_NAME[name];
  if (!cap) throw new CapabilityError(`unknown capability "${name}"`);

  const scope: Scope =
    cap.scopeKind === "vehicle"
      ? (() => {
          if (!ctx.vehicleId) {
            throw new CapabilityError(`${name} is vehicle-scoped but no vehicleId was supplied`);
          }
          return vehicleScope(ctx.vehicleId);
        })()
      : ENTERPRISE;

  const deny = (reason: string): CommandResult<T> => {
    if (ctx.identityId) audit.record(ctx.sessionId, name, ctx.now, false);
    return { ok: false, error: reason, events: [] };
  };

  // 1. Authentication + 2. Authority (I-01, I-02)
  const decision = authorise(ctx.identityId, cap.requiredRight, scope, ctx.grants, ctx.now);
  if (!decision.allowed) return deny(decision.reason);

  // 3. Provenance (E-02)
  if (cap.requiresReason && !ctx.reason?.trim()) {
    return deny(`${name} requires a recorded reason (E-02). A decision without reasoning cannot be reviewed.`);
  }

  // 4. Conflicts (I-07)
  if (cap.conflictSensitive) {
    const gate = conflictGate(ctx.identityId!, ctx.actorHasKnownConflict ?? false, ctx.disclosures ?? []);
    if (!gate.allowed) return deny(gate.reason);
  }

  // 5. Handler, collecting events
  const events: EventEnvelope[] = [];
  const emit = (type: EventType, objectId: string, payload: Record<string, unknown>): void => {
    if (!cap.emits.includes(type)) {
      throw new CapabilityError(
        `${name} emitted "${type}", which it does not declare. The registry is the contract; ` +
          `an undeclared event cannot be subscribed to by anything that read the registry.`,
      );
    }
    events.push({
      eventId: nextEventId(ctx.correlationId),
      type,
      occurredAt: ctx.now,
      actorId: ctx.identityId!,
      objectType: cap.object,
      objectId,
      causedByCommand: name,
      correlationId: ctx.correlationId,
      reason: DECISION_EVENTS.has(type) ? ctx.reason : undefined,
      payload,
    });
  };

  let value: T;
  try {
    value = handler(emit);
  } catch (e) {
    audit.record(ctx.sessionId, name, ctx.now, false);
    // A CapabilityError is a DEFECT in the calling code — an undeclared
    // event, a broken contract with the registry. Returning it as a soft
    // failure would let a mis-wired command look identical to a legitimate
    // domain refusal, and it would ship. Domain errors become {ok:false};
    // contract violations propagate and stop the build.
    if (e instanceof CapabilityError) throw e;
    return { ok: false, error: (e as Error).message, events: [] };
  }

  // 6. E-01 — a state-changing capability that emitted nothing is a defect.
  if (events.length === 0) {
    throw new CapabilityError(
      `${name} completed without emitting an event (E-01). If a capability changes state it must say so; ` +
        `if it changes nothing it is a query and does not belong in the command registry.`,
    );
  }

  for (const e of events) log.append(e);
  audit.record(ctx.sessionId, name, ctx.now, true);
  return { ok: true, value, events };
}
