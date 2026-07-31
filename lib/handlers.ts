/**
 * HANDLERS — capabilities wired to domain logic
 *
 * Wave 2 · L5
 *
 * ── WHAT THIS FILE PROVES ────────────────────────────────────────────
 * Until now the layers existed separately: an envelope that enforces
 * authority and events, domain functions that compute exactly, a ledger
 * that refuses to forget. This is where they meet.
 *
 * The load-bearing claim of the whole architecture is that a distribution
 * cannot be executed by an unauthorised actor, cannot skip a waterfall
 * stage, cannot breach the reserve floor, cannot lose a rupee across a
 * capital table, and cannot happen silently. That claim is only true if
 * one function does all five. This is that function.
 *
 * ── ORDER MATTERS ────────────────────────────────────────────────────
 * Compute first, then post, then emit. Nothing is written until the whole
 * computation succeeds, so a rejected distribution leaves no partial
 * ledger trail — which would otherwise be indistinguishable from a
 * completed one that lost its later entries.
 */

import { Money, ZERO, format, sum } from "./money";
import { runWaterfall, WaterfallInput, WaterfallResult, Stage, conserves } from "./waterfall";
import { band, ReserveBand, breachResponse, mayCallCapital } from "./reserve";
import {
  Position, distributePro, distributionConserves,
  conservationError, CapitalState, mayTransition, nextMemberState, MemberState,
} from "./capital";
import { Ledger, LedgerEntry, LedgerAccount } from "./ledger";
import { EventLog } from "./events";
import { SessionAudit } from "./authority";
import { execute, CommandContext, CommandResult } from "./commands";

// ─────────────────────────────────────────────────────────────────────
// ExecuteDistribution — the integration point
// ─────────────────────────────────────────────────────────────────────

export interface DistributionInput extends WaterfallInput {
  distributionId: string;
  vehicleId: string;
  /** The capital table. Must satisfy F-02 before a rupee moves. */
  positions: Position[];
  totalUnitsIssued: bigint;
  /** Deterministic ids for the ledger postings this produces. */
  entryIdPrefix: string;
}

export interface DistributionOutcome {
  waterfall: WaterfallResult;
  /** Per-holder allocations. Empty when stage 6 was blocked. */
  allocations: { investorId: string; amount: Money }[];
  ledgerEntries: LedgerEntry[];
  reserveBand: ReserveBand;
}

const STAGE_ACCOUNT: Record<Stage, LedgerAccount> = {
  [Stage.OperatingCompany]: "operating_company_share",
  [Stage.BrandDigital]: "brand_participation",
  [Stage.AdminReserve]: "admin_reserve",
  [Stage.SinkingFund]: "sinking_fund",
  [Stage.DebtService]: "debt_service",
  [Stage.PartnerDistribution]: "partner_distribution",
};

/**
 * Run a distribution end to end.
 *
 * Refuses before computing anything if the capital table does not conserve
 * (F-02). Distributing across a table whose units do not sum to units
 * issued would allocate a share of the money to nobody, or twice to
 * somebody, and the ledger would balance while the register lied.
 */
export function executeDistribution(
  ctx: CommandContext,
  input: DistributionInput,
  log: EventLog,
  audit: SessionAudit,
  ledger: Ledger,
): CommandResult<DistributionOutcome> {
  return execute("ExecuteDistribution", ctx, log, audit, (emit) => {
    // F-02 first. A distribution over a broken register is worse than no
    // distribution, because it looks correct afterwards.
    const err = conservationError(input.positions, input.totalUnitsIssued);
    if (err) throw new Error(`refusing to distribute: ${err}`);

    const waterfall = runWaterfall(input);
    if (!conserves(input, waterfall)) {
      throw new Error("waterfall did not conserve the Revenue Base; refusing to post");
    }

    const reserveBand = band(waterfall.reserveBalanceAfter, input.reserveFloor);

    // Allocate stage 6 across holders BEFORE posting anything.
    const allocations =
      waterfall.partnerDistribution > ZERO
        ? distributePro(waterfall.partnerDistribution, input.positions)
        : [];

    if (allocations.length && !distributionConserves(waterfall.partnerDistribution, allocations)) {
      throw new Error("pro-rata allocation did not sum to the distributable amount; refusing to post");
    }

    // Post one ledger entry per stage that actually moved money.
    const ledgerEntries: LedgerEntry[] = [];
    for (const s of waterfall.stages) {
      if (s.amount === ZERO) continue;
      const entry: LedgerEntry = {
        entryId: `${input.entryIdPrefix}-s${s.stage}`,
        vehicleId: input.vehicleId,
        account: STAGE_ACCOUNT[s.stage as Stage],
        amount: s.amount,
        postedAt: ctx.now,
        postedBy: ctx.identityId!,
        narrative: `Waterfall stage ${s.stage} (${s.name}) for distribution ${input.distributionId}`,
      };
      ledger.post(entry);
      ledgerEntries.push(entry);
      emit("LedgerEntryPosted", entry.entryId, {
        account: entry.account,
        amount: format(entry.amount),
        stage: s.stage,
      });
    }

    if (waterfall.blockedBy.length) {
      // A block is a state change: the money stayed put, and a member whose
      // expected distribution did not land is owed the reason.
      emit("DistributionBlocked", input.distributionId, {
        blockedBy: waterfall.blockedBy,
        retained: format(waterfall.retained),
        reserveBand,
        reserveBalanceAfter: format(waterfall.reserveBalanceAfter),
      });
    } else {
      emit("DistributionExecuted", input.distributionId, {
        amount: format(waterfall.partnerDistribution),
        holders: allocations.length,
        revenueBase: format(input.revenueBase),
        reserveBand,
      });
    }

    return { waterfall, allocations, ledgerEntries, reserveBand };
  });
}

// ─────────────────────────────────────────────────────────────────────
// CallCapital — F-16 enforced at the capability boundary
// ─────────────────────────────────────────────────────────────────────

export interface CapitalCallInput {
  capitalCallId: string;
  vehicleId: string;
  amount: Money;
  purpose: string;
  vehicleStabilised: boolean;
  dueOn: string;
}

export function callCapital(
  ctx: CommandContext,
  input: CapitalCallInput,
  log: EventLog,
  audit: SessionAudit,
): CommandResult<{ amount: Money }> {
  return execute("CallCapital", ctx, log, audit, (emit) => {
    const gate = mayCallCapital(input.purpose, input.vehicleStabilised);
    if (!gate.allowed) throw new Error(gate.reason!);
    emit("CapitalCalled", input.capitalCallId, {
      amount: format(input.amount),
      purpose: input.purpose,
      dueOn: input.dueOn,
    });
    return { amount: input.amount };
  });
}

// ─────────────────────────────────────────────────────────────────────
// AcceptCommitment — the accreditation test point (L1-01 §24b)
// ─────────────────────────────────────────────────────────────────────

export interface CommitmentInput {
  commitmentId: string;
  investorId: string;
  offeringId: string;
  amount: Money;
  minimumSubscription: Money;
  accreditationValid: boolean;
  currentMemberState: MemberState;
  isFirstCommitment: boolean;
}

export function acceptCommitment(
  ctx: CommandContext,
  input: CommitmentInput,
  log: EventLog,
  audit: SessionAudit,
): CommandResult<{ memberState: MemberState }> {
  return execute("AcceptCommitment", ctx, log, audit, (emit) => {
    // THIS is the accreditation test point. Valid here means the commitment
    // completes even if accreditation later expires — expiry after lawful
    // acceptance does not invalidate an otherwise valid commitment.
    if (!input.accreditationValid) {
      throw new Error(
        `accreditation is not valid at acceptance; the commitment lapses (L1-01 §24b, F-10)`,
      );
    }
    if (input.amount < input.minimumSubscription) {
      throw new Error(
        `commitment of ${format(input.amount)} is below the offering minimum of ${format(input.minimumSubscription)}`,
      );
    }

    emit("CommitmentAccepted", input.commitmentId, {
      investorId: input.investorId,
      offeringId: input.offeringId,
      amount: format(input.amount),
    });

    // I-08 — the Member Law. A state change on the existing identity, never
    // a second record. Irreversible.
    const next = nextMemberState(input.currentMemberState, input.isFirstCommitment);
    return { memberState: next };
  });
}

// ─────────────────────────────────────────────────────────────────────
// DeployCapital — F-03 state transitions
// ─────────────────────────────────────────────────────────────────────

export interface DeploymentInput {
  investmentId: string;
  vehicleId: string;
  commitmentId: string;
  amount: Money;
  from: CapitalState;
  to: CapitalState;
  entryId: string;
}

export function deployCapital(
  ctx: CommandContext,
  input: DeploymentInput,
  log: EventLog,
  audit: SessionAudit,
  ledger: Ledger,
): CommandResult<{ state: CapitalState }> {
  return execute("DeployCapital", ctx, log, audit, (emit) => {
    if (!mayTransition(input.from, input.to)) {
      throw new Error(
        `capital cannot move from ${input.from} to ${input.to}. ` +
          `Capital never reverts to Committed once drawn — the commitment was consumed (F-03).`,
      );
    }

    const entry: LedgerEntry = {
      entryId: input.entryId,
      vehicleId: input.vehicleId,
      account: `capital_${input.to}` as LedgerAccount,
      amount: input.amount,
      postedAt: ctx.now,
      postedBy: ctx.identityId!,
      narrative: `Capital ${input.from} -> ${input.to} against commitment ${input.commitmentId}`,
    };
    ledger.post(entry);

    emit("LedgerEntryPosted", entry.entryId, { account: entry.account, amount: format(entry.amount) });
    emit("CapitalDeployed", input.investmentId, {
      amount: format(input.amount),
      from: input.from,
      to: input.to,
    });
    return { state: input.to };
  });
}

// ─────────────────────────────────────────────────────────────────────
// DeclareReserveBreach
// ─────────────────────────────────────────────────────────────────────

export function declareReserveBreach(
  ctx: CommandContext,
  vehicleId: string,
  balance: Money,
  floor: Money,
  log: EventLog,
  audit: SessionAudit,
): CommandResult<{ shortfall: Money }> {
  return execute("DeclareReserveBreach", ctx, log, audit, (emit) => {
    const response = breachResponse(balance, floor);
    if (!response) throw new Error(`reserve is not in breach: ${format(balance)} against floor ${format(floor)}`);

    emit("ReserveBreachDeclared", vehicleId, {
      shortfall: format(response.shortfall),
      broadcast: response.broadcast,
      deferDiscretionaryExpenditure: response.deferDiscretionaryExpenditure,
      // Both false by construction. A breach never suspends distributions on
      // its own (that needs an Ordinary Resolution) and never authorises a
      // capital call at all (F-16).
      suspendDistributions: response.suspendDistributions,
      capitalCallPermitted: response.capitalCallPermitted,
    });
    return { shortfall: response.shortfall };
  });
}

// ─────────────────────────────────────────────────────────────────────
// Reconciliation
// ─────────────────────────────────────────────────────────────────────

/**
 * Cross-check the ledger against what the waterfall claimed to move.
 *
 * Run after any distribution. If these disagree, one of the two is wrong
 * and neither can be trusted until it is known which — which is precisely
 * the state a reconciliation exists to detect rather than to assume away.
 */
export function reconcileDistribution(
  ledger: Ledger,
  vehicleId: string,
  outcome: DistributionOutcome,
): { ok: boolean; detail: string } {
  const posted = sum(outcome.ledgerEntries.map((e) => e.amount));
  const moved = sum(outcome.waterfall.stages.map((s) => s.amount));
  if (posted !== moved) {
    return {
      ok: false,
      detail: `ledger posted ${format(posted)} but the waterfall moved ${format(moved)}`,
    };
  }
  const allocated = sum(outcome.allocations.map((a) => a.amount));
  if (allocated !== outcome.waterfall.partnerDistribution) {
    return {
      ok: false,
      detail:
        `allocations sum to ${format(allocated)} but stage 6 was ` +
        `${format(outcome.waterfall.partnerDistribution)}`,
    };
  }
  const stage6 = ledger.balance(vehicleId, "partner_distribution");
  return {
    ok: true,
    detail: `reconciled: ${format(moved)} moved, stage 6 balance ${format(stage6)}`,
  };
}
