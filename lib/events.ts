/**
 * EVENTS — the enterprise nervous system
 *
 * Wave 2 · L5 Capabilities · L9 Events & Automation
 * Serves: E-01 (Every Capability Publishes Events)
 *         E-02 (Every Decision Has Provenance)
 *
 * ── WHY ──────────────────────────────────────────────────────────────
 * E-01: if a capability changes state, it emits at least one domain event.
 * Without events there is no audit trail, no automation, and no way to
 * react to what happened. A silent state change is a ghost: something is
 * different and nobody can say when, why, or at whose instruction.
 *
 * ── NAMING ───────────────────────────────────────────────────────────
 * Events are PAST TENSE and name a fact, not an intention. `PropertyAcquired`,
 * never `AcquireProperty`. An event that reads like a command is usually a
 * command that leaked into the log, and it will eventually be replayed as
 * though it were history.
 *
 * ── THE ENVELOPE IS NOT OPTIONAL ─────────────────────────────────────
 * Every event carries actor, timestamp, and the command that caused it.
 * That triple is what makes E-02 checkable: given any state, you can ask
 * who changed it and under what instruction, and get an answer rather than
 * an inference.
 */

import { BusinessObjectType } from "../constants/business-objects";

export type EventType =
  // Enterprise
  | "OrganizationRegistered"
  | "CommitteeConstituted"
  | "CommitteeAuthorityDelegated"
  // Publishing
  | "ContentVersionPublished"
  | "ContentVersionWithdrawn"
  | "MediaAssetRegistered"
  | "MediaAssetReclassified"
  // Vehicles & portfolio
  | "InvestmentVehicleFormed"
  | "InvestmentVehicleStabilised"
  | "InvestmentVehicleDissolved"
  | "PortfolioCreated"
  | "PropertyAssignedToPortfolio"
  // Assets
  | "PropertyRegistered"
  | "PropertyLifecycleAdvanced"
  | "AcquisitionCompleted"
  | "ValuationRecorded"
  | "DispositionCompleted"
  | "EnvironmentalCommitmentStrengthened"
  // Capital
  | "OfferingOpened"
  | "OfferingClosed"
  | "CommitmentOffered"
  | "CommitmentAccepted"
  | "CommitmentLapsed"
  | "CommitmentWithdrawn"
  | "CommitmentSettled"
  | "CapitalCalled"
  | "CapitalDrawn"
  | "CapitalDeployed"
  | "CapitalReturned"
  | "OwnershipPositionOpened"
  | "OwnershipTransferred"
  | "DistributionExecuted"
  | "DistributionBlocked"
  // Identity
  | "IdentityAuthenticated"
  | "AccreditationGranted"
  | "AccreditationExpired"
  | "MemberStatePromoted"
  | "SessionOpened"
  | "SessionClosed"
  // Governance
  | "ResolutionTabled"
  | "VoteCast"
  | "ResolutionResolved"
  | "PolicyVersionApproved"
  | "ConflictDisclosed"
  | "AuthorityGranted"
  | "AuthorityRevoked"
  // Compliance & reserves
  | "ReserveFunded"
  | "ReserveBreachDeclared"
  | "ReserveBreachCleared"
  | "ComplianceEventRecorded"
  | "ConstitutionalFailureDeclared"
  // Knowledge
  | "InvestmentThesisVersioned"
  | "DueDiligenceCompleted"
  | "PerformanceReportPublished"
  | "LedgerEntryPosted";

/**
 * Runtime mirror of the union. Downstream catalogues use this to prove exact
 * coverage while the source-parsing gates continue to read the declared type.
 */
export const EVENT_TYPES = [
  "OrganizationRegistered",
  "CommitteeConstituted",
  "CommitteeAuthorityDelegated",
  "ContentVersionPublished",
  "ContentVersionWithdrawn",
  "MediaAssetRegistered",
  "MediaAssetReclassified",
  "InvestmentVehicleFormed",
  "InvestmentVehicleStabilised",
  "InvestmentVehicleDissolved",
  "PortfolioCreated",
  "PropertyAssignedToPortfolio",
  "PropertyRegistered",
  "PropertyLifecycleAdvanced",
  "AcquisitionCompleted",
  "ValuationRecorded",
  "DispositionCompleted",
  "EnvironmentalCommitmentStrengthened",
  "OfferingOpened",
  "OfferingClosed",
  "CommitmentOffered",
  "CommitmentAccepted",
  "CommitmentLapsed",
  "CommitmentWithdrawn",
  "CommitmentSettled",
  "CapitalCalled",
  "CapitalDrawn",
  "CapitalDeployed",
  "CapitalReturned",
  "OwnershipPositionOpened",
  "OwnershipTransferred",
  "DistributionExecuted",
  "DistributionBlocked",
  "IdentityAuthenticated",
  "AccreditationGranted",
  "AccreditationExpired",
  "MemberStatePromoted",
  "SessionOpened",
  "SessionClosed",
  "ResolutionTabled",
  "VoteCast",
  "ResolutionResolved",
  "PolicyVersionApproved",
  "ConflictDisclosed",
  "AuthorityGranted",
  "AuthorityRevoked",
  "ReserveFunded",
  "ReserveBreachDeclared",
  "ReserveBreachCleared",
  "ComplianceEventRecorded",
  "ConstitutionalFailureDeclared",
  "InvestmentThesisVersioned",
  "DueDiligenceCompleted",
  "PerformanceReportPublished",
  "LedgerEntryPosted",
] as const satisfies readonly EventType[];

export interface EventEnvelope<P = Record<string, unknown>> {
  /** Permanent. Never reused. */
  eventId: string;
  type: EventType;
  /** ISO-8601 UTC. Supplied by the caller — this module reads no clock. */
  occurredAt: string;
  /** The authenticated identity responsible. Never null (I-01). */
  actorId: string;
  objectType: BusinessObjectType;
  objectId: string;
  /**
   * The command that caused this event. Together with actorId this is what
   * makes E-02 answerable rather than merely asserted.
   */
  causedByCommand: string;
  /** Groups every event produced by one command invocation. */
  correlationId: string;
  /**
   * Why. Required for events flagged as decisions — see DECISION_EVENTS.
   * A decision recorded without reasoning is a fact without provenance.
   */
  reason?: string;
  payload: P;
}

/**
 * Events representing a DECISION rather than a mechanical state change.
 * These carry a mandatory `reason` (E-02).
 *
 * The distinction matters: `CapitalDrawn` is bookkeeping and needs no essay.
 * `ResolutionResolved` and `ConstitutionalFailureDeclared` are judgements,
 * and a judgement with no recorded reasoning cannot be reviewed later by
 * anyone — including the person who made it.
 */
export const DECISION_EVENTS: ReadonlySet<EventType> = new Set<EventType>([
  "ResolutionResolved",
  "PolicyVersionApproved",
  "ConstitutionalFailureDeclared",
  "ComplianceEventRecorded",
  "DistributionBlocked",
  "ReserveBreachDeclared",
  "AuthorityGranted",
  "AuthorityRevoked",
  "CommitmentAccepted",
  "AcquisitionCompleted",
  "DispositionCompleted",
  "ConflictDisclosed",
]);

export class EventValidationError extends Error {}

/**
 * Validate an envelope before it reaches the log.
 *
 * Rejecting here rather than at read time is deliberate: an event log is
 * append-only, so a malformed event is permanent. The cheapest moment to
 * refuse one is the only moment.
 */
export function validateEvent(e: EventEnvelope): void {
  if (!e.eventId) throw new EventValidationError("event has no eventId");
  if (!e.actorId) {
    throw new EventValidationError(
      `${e.type}: no actorId. Every state change is attributable to an authenticated identity (I-01).`,
    );
  }
  if (!e.causedByCommand) {
    throw new EventValidationError(
      `${e.type}: no causedByCommand. Without it the event cannot be traced to an instruction (E-02).`,
    );
  }
  if (!e.correlationId) throw new EventValidationError(`${e.type}: no correlationId`);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(e.occurredAt)) {
    throw new EventValidationError(`${e.type}: occurredAt must be ISO-8601 UTC, received "${e.occurredAt}"`);
  }
  if (DECISION_EVENTS.has(e.type) && !e.reason?.trim()) {
    throw new EventValidationError(
      `${e.type} is a decision event and requires a recorded reason (E-02). ` +
        `A decision without reasoning cannot be reviewed by anyone, including its author.`,
    );
  }
}

/**
 * An append-only event log.
 *
 * There is no delete and no update, by construction rather than by
 * convention — the array is never exposed for mutation. Corrections are
 * new events, which is the same rule the financial ledger follows and for
 * the same reason.
 */
export class EventLog {
  private readonly events: EventEnvelope[] = [];

  append(e: EventEnvelope): void {
    validateEvent(e);
    this.events.push(Object.freeze({ ...e }));
  }

  /** Everything, in append order. A copy — callers cannot mutate history. */
  all(): readonly EventEnvelope[] {
    return [...this.events];
  }

  forObject(objectType: BusinessObjectType, objectId: string): EventEnvelope[] {
    return this.events.filter((e) => e.objectType === objectType && e.objectId === objectId);
  }

  byCorrelation(correlationId: string): EventEnvelope[] {
    return this.events.filter((e) => e.correlationId === correlationId);
  }

  ofType(type: EventType): EventEnvelope[] {
    return this.events.filter((e) => e.type === type);
  }

  get size(): number {
    return this.events.length;
  }
}
