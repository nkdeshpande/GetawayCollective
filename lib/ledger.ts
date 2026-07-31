/**
 * LEDGER — append-only financial record
 *
 * Wave 2 · L5 Capabilities · L10 Persistence
 * Serves: E-04 / F-04 (Ledger Is Append-Only) · F-07 (Distribution Immutability)
 *         F-03 (Capital Is Accounted)
 *
 * ── THE RULE ─────────────────────────────────────────────────────────
 * No deletion. No update. A wrong entry is corrected by posting an
 * offsetting entry that references it, so the mistake and its remedy are
 * both visible.
 *
 * The alternative — editing the original — leaves a record that is correct
 * and a history that is a lie. An auditor asking "was this always 40,000?"
 * would get yes, and yes would be false.
 *
 * ── WHY REVERSALS REFERENCE THEIR TARGET ─────────────────────────────
 * A bare offsetting entry balances the books but explains nothing. Carrying
 * `reverses` means the ledger can answer "what was corrected, and why?"
 * without anyone reconstructing it from timestamps and amounts.
 */

import { Money, sum, format, isZero } from "./money";

export type LedgerAccount =
  | "capital_committed"
  | "capital_drawn"
  | "capital_invested"
  | "capital_returned"
  | "capital_distributed"
  | "revenue_base"
  | "operating_company_share"
  | "brand_participation"
  | "admin_reserve"
  | "sinking_fund"
  | "debt_service"
  | "partner_distribution";

export interface LedgerEntry {
  readonly entryId: string;
  readonly vehicleId: string;
  readonly account: LedgerAccount;
  /** Signed. Credits positive, debits negative. */
  readonly amount: Money;
  readonly postedAt: string;
  readonly postedBy: string;
  readonly narrative: string;
  /** Set only on a correcting entry: the entryId being reversed. */
  readonly reverses?: string;
}

export class LedgerError extends Error {}

/**
 * Append-only ledger.
 *
 * The entries array is private and every accessor returns a copy. That is
 * the enforcement: there is no method that mutates or removes an entry, so
 * E-04 cannot be violated by forgetting a check — only by editing this file.
 */
export class Ledger {
  private readonly entries: LedgerEntry[] = [];
  private readonly byId = new Map<string, LedgerEntry>();
  /** entryId -> the reversal that already cancelled it. */
  private readonly reversedBy = new Map<string, string>();

  post(entry: LedgerEntry): void {
    if (this.byId.has(entry.entryId)) {
      throw new LedgerError(`entry ${entry.entryId} already posted; ids are permanent and never reused`);
    }
    if (!entry.postedBy) {
      throw new LedgerError(`entry ${entry.entryId} has no postedBy — every posting is attributable (E-02)`);
    }
    if (!entry.narrative?.trim()) {
      throw new LedgerError(`entry ${entry.entryId} has no narrative; an unexplained posting cannot be audited`);
    }
    if (entry.reverses) {
      const target = this.byId.get(entry.reverses);
      if (!target) {
        throw new LedgerError(`entry ${entry.entryId} reverses ${entry.reverses}, which does not exist`);
      }
      if (this.reversedBy.has(entry.reverses)) {
        throw new LedgerError(
          `entry ${entry.reverses} was already reversed by ${this.reversedBy.get(entry.reverses)}. ` +
            `Reversing twice would credit the correction itself.`,
        );
      }
      if (entry.amount !== -target.amount) {
        throw new LedgerError(
          `reversal ${entry.entryId} posts ${format(entry.amount)} against a target of ${format(target.amount)}. ` +
            `A reversal must exactly offset; a partial correction is a new entry, not a reversal.`,
        );
      }
      if (entry.account !== target.account || entry.vehicleId !== target.vehicleId) {
        throw new LedgerError(`reversal ${entry.entryId} must target the same account and vehicle as ${entry.reverses}`);
      }
      this.reversedBy.set(entry.reverses, entry.entryId);
    }

    const frozen = Object.freeze({ ...entry });
    this.entries.push(frozen);
    this.byId.set(frozen.entryId, frozen);
  }

  /**
   * Build the offsetting entry for a mistaken posting. Does not post it —
   * the caller still needs authority and a reason, and silently posting
   * from a helper would bypass both.
   */
  reversalFor(
    entryId: string,
    newEntryId: string,
    postedBy: string,
    postedAt: string,
    narrative: string,
  ): LedgerEntry {
    const target = this.byId.get(entryId);
    if (!target) throw new LedgerError(`cannot reverse unknown entry ${entryId}`);
    return {
      entryId: newEntryId,
      vehicleId: target.vehicleId,
      account: target.account,
      amount: -target.amount,
      postedAt,
      postedBy,
      narrative,
      reverses: entryId,
    };
  }

  all(): readonly LedgerEntry[] {
    return [...this.entries];
  }

  forVehicle(vehicleId: string): LedgerEntry[] {
    return this.entries.filter((e) => e.vehicleId === vehicleId);
  }

  /** Net balance, reversals included. */
  balance(vehicleId: string, account: LedgerAccount): Money {
    return sum(
      this.entries.filter((e) => e.vehicleId === vehicleId && e.account === account).map((e) => e.amount),
    );
  }

  /** Entries that have been cancelled by a later reversal. */
  reversedEntries(): { original: LedgerEntry; reversal: LedgerEntry }[] {
    return [...this.reversedBy.entries()].map(([origId, revId]) => ({
      original: this.byId.get(origId)!,
      reversal: this.byId.get(revId)!,
    }));
  }

  /**
   * A reversed entry and its reversal must net to zero. If this ever fails,
   * a correction has itself introduced an error — which is the failure mode
   * that makes people distrust corrections and start editing originals.
   */
  reversalsNet(): boolean {
    return this.reversedEntries().every((p) => isZero(p.original.amount + p.reversal.amount));
  }

  get size(): number {
    return this.entries.length;
  }
}

/**
 * There is deliberately no `delete`, `update`, or `void` on Ledger.
 * This constant exists so the omission reads as a decision rather than an
 * oversight to the next person who goes looking for one.
 */
export const LEDGER_MUTATION_METHODS: readonly string[] = [];
