/**
 * PROJECTIONS — read models folded from the event log
 *
 * Wave 2 · L6 Data Authority
 * Serves: E-01 (Every Capability Publishes Events) · E-02 (Provenance)
 *         F-02 (Ownership Conservation) · F-03 (Capital Is Accounted)
 *
 * ── PROJECTIONS ARE DERIVED, NEVER AUTHORITATIVE ─────────────────────
 * The event log is the truth. Everything here is a fold over it and can be
 * discarded and rebuilt at any moment without losing anything.
 *
 * That property is the whole point. A read model that cannot be rebuilt has
 * quietly become a second source of truth, and the first time it disagrees
 * with the log nobody can say which is right. Every projection below is a
 * pure function of `readonly EventEnvelope[]` — there is no incremental
 * mutation path, so there is nothing to drift.
 *
 * ── WHY THIS IS THE LAYER THAT PROVES E-01 WAS WORTH IT ──────────────
 * Every figure a member sees — their position, the vehicle's reserve
 * coverage, why last quarter's distribution did not land — is reconstructed
 * here from events alone. If a capability had changed state silently, the
 * projection would be wrong and nothing would say so. E-01 is what makes
 * this layer possible rather than merely plausible.
 */

import { EventEnvelope, EventType } from "./events";
import { Money, ZERO, add, format, money } from "./money";
import { Position } from "./capital";
import { CashFlow } from "./metrics";
import { BusinessObjectType as BO } from "./../constants/business-objects";

const amountOf = (e: EventEnvelope, key = "amount"): Money => {
  const v = e.payload[key];
  return typeof v === "string" ? money(v) : ZERO;
};

// ─────────────────────────────────────────────────────────────────────
// Vehicle
// ─────────────────────────────────────────────────────────────────────

export interface VehicleProjection {
  vehicleId: string;
  formed: boolean;
  stabilised: boolean;
  dissolved: boolean;
  /** Sum of admin reserve + sinking fund postings. */
  reserveFunded: Money;
  capitalCalled: Money;
  capitalDeployed: Money;
  distributedToPartners: Money;
  distributionsBlocked: number;
  lastBlockReasons: string[];
  eventCount: number;
}

export function projectVehicle(events: readonly EventEnvelope[], vehicleId: string): VehicleProjection {
  const p: VehicleProjection = {
    vehicleId, formed: false, stabilised: false, dissolved: false,
    reserveFunded: ZERO, capitalCalled: ZERO, capitalDeployed: ZERO,
    distributedToPartners: ZERO, distributionsBlocked: 0, lastBlockReasons: [],
    eventCount: 0,
  };

  for (const e of events) {
    switch (e.type) {
      case "InvestmentVehicleFormed":
        if (e.objectId === vehicleId) { p.formed = true; p.eventCount++; }
        break;
      case "InvestmentVehicleStabilised":
        if (e.objectId === vehicleId) { p.stabilised = true; p.eventCount++; }
        break;
      case "InvestmentVehicleDissolved":
        if (e.objectId === vehicleId) { p.dissolved = true; p.eventCount++; }
        break;
      case "CapitalCalled":
        p.capitalCalled = add(p.capitalCalled, amountOf(e));
        p.eventCount++;
        break;
      case "CapitalDeployed":
        p.capitalDeployed = add(p.capitalDeployed, amountOf(e));
        p.eventCount++;
        break;
      case "LedgerEntryPosted": {
        const acct = e.payload.account as string;
        if (acct === "admin_reserve" || acct === "sinking_fund") {
          p.reserveFunded = add(p.reserveFunded, amountOf(e));
        }
        p.eventCount++;
        break;
      }
      case "DistributionExecuted":
        p.distributedToPartners = add(p.distributedToPartners, amountOf(e));
        p.eventCount++;
        break;
      case "DistributionBlocked":
        p.distributionsBlocked++;
        p.lastBlockReasons = (e.payload.blockedBy as string[]) ?? [];
        p.eventCount++;
        break;
      default:
        break;
    }
  }
  return p;
}

// ─────────────────────────────────────────────────────────────────────
// Capital table
// ─────────────────────────────────────────────────────────────────────

export interface CapitalTableProjection {
  positions: Position[];
  totalUnits: bigint;
  /** True when the folded table conserves against units issued (F-02). */
  conserves: boolean;
  unitsIssued: bigint;
}

/**
 * Rebuild the register from ownership events.
 *
 * Transfers are ADDITIVE (F-12): each is a new record, never an edit. The
 * fold therefore replays them in order rather than looking up and mutating,
 * which is also why a transfer can never silently lose units — the arithmetic
 * is visible in the sequence.
 */
export function projectCapitalTable(
  events: readonly EventEnvelope[],
  vehicleId: string,
  unitsIssued: bigint,
): CapitalTableProjection {
  const held = new Map<string, bigint>();
  const classOf = new Map<string, string>();

  for (const e of events) {
    if (e.payload.vehicleId && e.payload.vehicleId !== vehicleId) continue;

    if (e.type === "OwnershipPositionOpened") {
      const inv = e.payload.investorId as string;
      const units = BigInt((e.payload.units as string | number) ?? 0);
      held.set(inv, (held.get(inv) ?? 0n) + units);
      classOf.set(inv, (e.payload.ownershipClass as string) ?? "A");
    }

    if (e.type === "OwnershipTransferred") {
      const from = e.payload.from as string;
      const to = e.payload.to as string;
      const units = BigInt((e.payload.units as string | number) ?? 0);
      held.set(from, (held.get(from) ?? 0n) - units);
      held.set(to, (held.get(to) ?? 0n) + units);
      if (!classOf.has(to)) classOf.set(to, classOf.get(from) ?? "A");
    }
  }

  const positions: Position[] = [...held.entries()]
    .filter(([, u]) => u !== 0n)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([investorId, units]) => ({
      investorId, units, ownershipClass: classOf.get(investorId) ?? "A",
    }));

  const totalUnits = positions.reduce((a, p) => a + p.units, 0n);
  return { positions, totalUnits, unitsIssued, conserves: totalUnits === unitsIssued };
}

// ─────────────────────────────────────────────────────────────────────
// Member registry — I-08
// ─────────────────────────────────────────────────────────────────────

export interface MemberProjection {
  identityId: string;
  isMember: boolean;
  becameMemberAt: string | null;
  accreditationGrantedAt: string | null;
  commitmentsAccepted: number;
}

/**
 * I-08 — one identity, two states, irreversible.
 *
 * The fold sets `isMember` and never clears it. That is not an oversight:
 * membership records history, not balance. Someone who has exited remains a
 * Member, because the governance record of what they voted on does not
 * disappear when their holdings reach zero.
 */
export function projectMembers(events: readonly EventEnvelope[]): Map<string, MemberProjection> {
  const out = new Map<string, MemberProjection>();
  const get = (id: string): MemberProjection => {
    if (!out.has(id)) {
      out.set(id, {
        identityId: id, isMember: false, becameMemberAt: null,
        accreditationGrantedAt: null, commitmentsAccepted: 0,
      });
    }
    return out.get(id)!;
  };

  for (const e of events) {
    if (e.type === "AccreditationGranted") {
      get(e.objectId).accreditationGrantedAt = e.occurredAt;
    }
    if (e.type === "CommitmentAccepted") {
      const inv = (e.payload.investorId as string) ?? e.objectId;
      const m = get(inv);
      m.commitmentsAccepted++;
      if (!m.isMember) {
        m.isMember = true;
        m.becameMemberAt = e.occurredAt;
      }
    }
    if (e.type === "MemberStatePromoted") {
      const m = get(e.objectId);
      if (!m.isMember) { m.isMember = true; m.becameMemberAt = e.occurredAt; }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// Cash flows for IRR
// ─────────────────────────────────────────────────────────────────────

/**
 * Build the cash-flow series a metric report discounts.
 *
 * Deployments are outflows, distributions are inflows. Periods are derived
 * from the caller's boundary list rather than from the clock, so the same
 * log always yields the same series — an IRR that shifts because the report
 * ran on a different day is not a return figure, it is a timestamp.
 */
export function projectCashFlows(
  events: readonly EventEnvelope[],
  periodBoundaries: readonly string[],
): CashFlow[] {
  const periodOf = (iso: string): number => {
    let i = 0;
    while (i < periodBoundaries.length && iso >= periodBoundaries[i]) i++;
    return Math.max(0, i - 1);
  };

  const byPeriod = new Map<number, Money>();
  const addTo = (p: number, m: Money) => byPeriod.set(p, add(byPeriod.get(p) ?? ZERO, m));

  for (const e of events) {
    if (e.type === "CapitalDeployed") addTo(periodOf(e.occurredAt), -amountOf(e));
    if (e.type === "DistributionExecuted") addTo(periodOf(e.occurredAt), amountOf(e));
  }

  return [...byPeriod.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([period, amount]) => ({ period, amount }));
}

// ─────────────────────────────────────────────────────────────────────
// Provenance — E-02
// ─────────────────────────────────────────────────────────────────────

export interface ProvenanceEntry {
  at: string;
  event: EventType;
  actor: string;
  command: string;
  reason?: string;
  correlationId: string;
}

/**
 * The full attributable history of one object.
 *
 * E-02 asks "who changed this, when, and why?" and this is the function
 * that answers it. It returns every event touching the object, in order,
 * with actor and causing command attached — which is only possible because
 * the envelope refuses to accept an event lacking either.
 */
export function provenanceOf(
  events: readonly EventEnvelope[],
  objectType: BO,
  objectId: string,
): ProvenanceEntry[] {
  return events
    .filter((e) => e.objectType === objectType && e.objectId === objectId)
    .map((e) => ({
      at: e.occurredAt,
      event: e.type,
      actor: e.actorId,
      command: e.causedByCommand,
      reason: e.reason,
      correlationId: e.correlationId,
    }));
}

/** Everything one command invocation produced, in order. */
export function transactionOf(
  events: readonly EventEnvelope[],
  correlationId: string,
): EventEnvelope[] {
  return events.filter((e) => e.correlationId === correlationId);
}

/**
 * Every action taken by an identity. The question an investigation asks
 * first, and one the log can answer without any additional index.
 */
export function actorHistory(events: readonly EventEnvelope[], actorId: string): ProvenanceEntry[] {
  return events
    .filter((e) => e.actorId === actorId)
    .map((e) => ({
      at: e.occurredAt, event: e.type, actor: e.actorId,
      command: e.causedByCommand, reason: e.reason, correlationId: e.correlationId,
    }));
}

// ─────────────────────────────────────────────────────────────────────
// Rebuild guarantee
// ─────────────────────────────────────────────────────────────────────

/**
 * Folding the same log twice must give the same answer.
 *
 * Trivially true for a pure function — which is exactly why it is worth
 * asserting. The moment someone adds an incremental update path for
 * performance, this stops holding, and it is far better for a test to say
 * so than for a member to notice their position drifting.
 */
export function projectionIsDeterministic(
  events: readonly EventEnvelope[],
  vehicleId: string,
): boolean {
  const a = projectVehicle(events, vehicleId);
  const b = projectVehicle([...events], vehicleId);
  return JSON.stringify(a, (_, v) => (typeof v === "bigint" ? v.toString() : v)) ===
         JSON.stringify(b, (_, v) => (typeof v === "bigint" ? v.toString() : v));
}

export function explainVehicle(p: VehicleProjection): string {
  return [
    `Vehicle ${p.vehicleId}`,
    `  lifecycle        ${p.dissolved ? "dissolved" : p.stabilised ? "stabilised" : p.formed ? "formed" : "unknown"}`,
    `  capital called   ${format(p.capitalCalled)}`,
    `  capital deployed ${format(p.capitalDeployed)}`,
    `  reserve funded   ${format(p.reserveFunded)}`,
    `  distributed      ${format(p.distributedToPartners)}`,
    p.distributionsBlocked
      ? `  blocked          ${p.distributionsBlocked} (last: ${p.lastBlockReasons.join(", ")})`
      : `  blocked          none`,
    `  events folded    ${p.eventCount}`,
  ].join("\n");
}
