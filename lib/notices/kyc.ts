/**
 * N-21 — what a KYC review changed, as the person it is about should hear it
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001. Fired by RecordKyc (lib/office-records.ts).
 *
 * The Office records six checks and an overall state. A person is told when
 * a review moved something they can see: a check accepted, a check that
 * needs something from them, or the whole record complete. One message for
 * each review, never one for each check, and none at all for a save that
 * changed nothing of that kind (a check moving to "in progress", a PAN
 * re-entered, a review date set).
 *
 * The Office's own reason for the act is an audit note and is never sent.
 * So the notice names WHICH checks need something and says who will say
 * exactly what: it does not guess at the why.
 */
import { KYC_STAGE_KEYS, KYC_STAGE_LABEL, type KycState } from "../office-rules";

export interface KycReading {
  readonly state: KycState | string | null;
  readonly stages: Readonly<Record<string, string>> | null;
}

export interface KycChange {
  /** Checks that became verified in this review, by their public label. */
  readonly accepted: readonly string[];
  /** Checks that now need something from the person. */
  readonly needed: readonly string[];
  /** The whole record became verified in this review. */
  readonly complete: boolean;
  /** The record as a whole was marked as needing an update, with no single check named. */
  readonly review: boolean;
}

/** What a review changed that the person should hear, or null where nothing did. */
export function kycChange(before: KycReading, after: KycReading): KycChange | null {
  const was = (k: string) => before.stages?.[k] ?? "not_started";
  const is = (k: string) => after.stages?.[k] ?? "not_started";
  const moved = (to: KycState) => KYC_STAGE_KEYS.filter((k) => is(k) === to && was(k) !== to).map((k) => KYC_STAGE_LABEL[k]);
  const accepted = moved("verified"), needed = moved("needs_update");
  const complete = after.state === "verified" && before.state !== "verified";
  const review = after.state === "needs_update" && before.state !== "needs_update" && needed.length === 0;
  return accepted.length || needed.length || complete || review ? { accepted, needed, complete, review } : null;
}
