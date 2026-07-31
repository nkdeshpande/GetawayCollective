/**
 * VALIDATION MESSAGES — what a rejection says to a human
 *
 * Wave 4 · Primitive Surface
 *
 * ── THE SPLIT ────────────────────────────────────────────────────────
 * The generated Zod contracts own WHETHER a value is valid. This file owns
 * WHAT WE SAY when it is not.
 *
 * Keeping them apart matters because the two change for different reasons.
 * A field's type changes when the model changes; its error message changes
 * when someone reads it and does not understand what to do next.
 *
 * ── THREE STRINGS, NOT ONE ───────────────────────────────────────────
 * Every rule carries a message, a help text and accessible text.
 *
 *   message — after the mistake. States what is wrong and how to fix it.
 *   help    — before the mistake. Prevents it. Shown with the field.
 *   a11y    — announced. Names the field first, because a screen-reader
 *             Member hears the error without seeing which input it sits under.
 *
 * A message that only says "Invalid" has told the reader something they
 * already knew.
 */

export interface ValidationRule {
  /** Machine code for logs and API responses. Never shown to a person. */
  code: string;
  /** The rule, in engineering terms. */
  rule: string;
  /** After the mistake. What is wrong, and what to do. */
  message: string;
  /** Before the mistake. Shown alongside the field. */
  help: string;
  /** Announced by a screen reader. Names the field. */
  a11y: string;
}

const V = (code: string, rule: string, message: string, help: string, a11y: string): ValidationRule =>
  ({ code, rule, message, help, a11y });

export const VALIDATION: Record<string, ValidationRule> = {
  // ── Money ─────────────────────────────────────────────────────────
  "money.format": V(
    "money.format",
    "Decimal string, at most 4 places. Never a float.",
    "Enter an amount using digits and a decimal point, up to four decimal places.",
    "For example 1250000.00",
    "Amount field error: enter an amount using digits and a decimal point, up to four decimal places.",
  ),
  "money.negative": V(
    "money.negative",
    "amount >= 0 where a negative is meaningless",
    "This amount cannot be negative.",
    "To record a reduction, post an offsetting entry rather than a negative amount.",
    "Amount field error: this amount cannot be negative.",
  ),
  "money.precision": V(
    "money.precision",
    "at most 4 decimal places",
    "The ledger records four decimal places. Round to four before submitting.",
    "Four decimal places, for example 1250.5000",
    "Amount field error: the ledger records four decimal places. Round to four before submitting.",
  ),

  // ── Capital ───────────────────────────────────────────────────────
  "commitment.belowMinimum": V(
    "commitment.belowMinimum",
    "amount >= offering.minimum_subscription",
    "This commitment is below the minimum for this offering.",
    "The minimum subscription is shown on the offering.",
    "Commitment amount error: this commitment is below the minimum for this offering.",
  ),
  "commitment.accreditationExpired": V(
    "commitment.accreditationExpired",
    "accreditation valid AT ACCEPTANCE",
    "Accreditation was not valid when this commitment was accepted, so it has lapsed. A new accreditation is needed before committing again.",
    "Accreditation is valid for fifteen working days and covers one transaction.",
    "Commitment error: accreditation was not valid at acceptance, so the commitment has lapsed. A new accreditation is needed before committing again.",
  ),
  "capitalCall.purposeNotPermitted": V(
    "capitalCall.purposeNotPermitted",
    "F-16: post-stabilisation purpose must be a growth purpose",
    "Once a vehicle is stabilised, capital may be called only for acquisition, approved expansion, approved redevelopment, an extraordinary event, or an LLP Agreement provision.",
    "Investor capital is growth capital. Operating shortfalls are met by deferring expenditure.",
    "Capital call error: once a vehicle is stabilised, capital may be called only for growth purposes.",
  ),
  "capital.illegalTransition": V(
    "capital.illegalTransition",
    "F-03: transition must be in the state machine",
    "Capital cannot move between those two states.",
    "Capital moves committed to drawn to invested, then out through returned or distributed. It never reverts.",
    "Capital state error: capital cannot move between those two states.",
  ),

  // ── Distribution ──────────────────────────────────────────────────
  "distribution.reserveBelowFloor": V(
    "distribution.reserveBelowFloor",
    "F-06 prospective test",
    "This distribution would take the reserve below its floor, so it cannot proceed.",
    "The Reserve Floor is six months of non-operational fixed obligations, or the Board-approved minimum, whichever is higher.",
    "Distribution blocked: this distribution would take the reserve below its floor.",
  ),
  "distribution.debtServiceUnpaid": V(
    "distribution.debtServiceUnpaid",
    "F-05: stage 6 requires stage 5 settled",
    "Scheduled debt service has not been met, so partner distributions cannot run.",
    "Debt service is stage 5 of the waterfall and settles before partners.",
    "Distribution blocked: scheduled debt service has not been met, so partner distributions cannot run.",
  ),
  "distribution.suspendedByResolution": V(
    "distribution.suspendedByResolution",
    "L1-16 §2.6a",
    "Distributions are suspended by an Ordinary Resolution while the reserve is in breach.",
    "A breach alone does not suspend distributions; a resolution does.",
    "Distribution blocked: distributions are suspended by resolution while the reserve is in breach.",
  ),
  "ownership.notConserved": V(
    "ownership.notConserved",
    "F-02: sum(units_held) == total_units_issued",
    "The register does not balance against units issued, so no distribution can run.",
    "Every unit issued must be held by exactly one position.",
    "Distribution blocked: the register does not balance against units issued.",
  ),

  // ── Identity & governance ─────────────────────────────────────────
  "authority.unauthenticated": V(
    "authority.unauthenticated",
    "I-01",
    "You need to be signed in to do that.",
    "",
    "Error: you need to be signed in to do that.",
  ),
  "authority.notGranted": V(
    "authority.notGranted",
    "I-02: absence of a grant is a denial",
    "You do not have authority for this action in this scope.",
    "Authority is granted per role and per vehicle. Ask the Governance Office if you believe this is wrong.",
    "Error: you do not have authority for this action in this scope.",
  ),
  "reason.required": V(
    "reason.required",
    "E-02: decision commands require a recorded reason",
    "Record why you are doing this. It becomes part of the permanent decision record.",
    "One or two sentences. Future reviewers, including you, will read this.",
    "Reason field error: record why you are doing this. It becomes part of the permanent decision record.",
  ),
  "conflict.undisclosed": V(
    "conflict.undisclosed",
    "I-07: a known conflict must be disclosed before acting",
    "Disclose your conflict before taking this action. Conflicts are permitted; undisclosed conflicts are not.",
    "Disclosure goes in the Conflict Register and is visible to the Governance and Ethics Committee.",
    "Error: disclose your conflict before taking this action.",
  ),
  "vote.alreadyCast": V(
    "vote.alreadyCast",
    "one ballot per holder",
    "You have already voted on this resolution.",
    "Voting is equity-weighted. Your holding carries your full weight in a single ballot.",
    "Error: you have already voted on this resolution.",
  ),
  "vote.recused": V(
    "vote.recused",
    "I-07: a recused holder may not vote",
    "You recused on a disclosed conflict, so you cannot vote on this resolution.",
    "",
    "Error: you recused on a disclosed conflict, so you cannot vote on this resolution.",
  ),
  "vote.noEquity": V(
    "vote.noEquity",
    "voting is equity-weighted",
    "Voting rights come from units held, and this identity holds none.",
    "",
    "Error: voting rights come from units held, and this identity holds none.",
  ),

  // ── Records ───────────────────────────────────────────────────────
  "immutable.field": V(
    "immutable.field",
    "field absent from the Update contract",
    "That value cannot be changed after it is recorded.",
    "To correct it, post an amendment. The original stays visible.",
    "Error: that value cannot be changed after it is recorded.",
  ),
  "ledger.reversalMismatch": V(
    "ledger.reversalMismatch",
    "E-04: a reversal must exactly offset",
    "A reversal has to offset the original exactly. For a partial correction, post a new entry instead.",
    "",
    "Error: a reversal has to offset the original exactly.",
  ),
  "narrative.required": V(
    "narrative.required",
    "every posting is explained",
    "Every ledger posting needs a narrative.",
    "What this entry is for, in a sentence.",
    "Narrative field error: every ledger posting needs a narrative.",
  ),

  // ── Generic field rules ───────────────────────────────────────────
  "field.required": V(
    "field.required",
    "required: true in the registry",
    "This field is required.",
    "",
    "Field error: this field is required.",
  ),
  "field.enum": V(
    "field.enum",
    "value must be in the registry's closed set",
    "Choose one of the available options.",
    "",
    "Field error: choose one of the available options.",
  ),
  "field.uuid": V(
    "field.uuid",
    "uuid format",
    "That identifier is not in the expected format.",
    "",
    "Field error: that identifier is not in the expected format.",
  ),
  "field.date": V(
    "field.date",
    "YYYY-MM-DD",
    "Enter a date as YYYY-MM-DD.",
    "For example 2026-07-31",
    "Date field error: enter a date as YYYY-MM-DD.",
  ),
};

export const messageFor = (code: string): string =>
  VALIDATION[code]?.message ?? "That value could not be accepted.";

export const helpFor = (code: string): string => VALIDATION[code]?.help ?? "";

export const accessibleErrorFor = (code: string): string =>
  VALIDATION[code]?.a11y ?? messageFor(code);

/**
 * API error shape.
 *
 * A code AND a human message, always. The code is what a client branches
 * on; the message is what a person reads. Returning only one of the two
 * forces somebody to parse prose or to invent their own copy.
 */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  /** The invariant or constitutional section behind the refusal. */
  authority?: string;
}

export function apiError(code: string, field?: string, authority?: string): ApiError {
  const e: ApiError = { code, message: messageFor(code) };
  if (field) e.field = field;
  if (authority) e.authority = authority;
  return e;
}

/**
 * Copy rules, so a future message matches the ones above.
 *
 * These come from the Brand Constitution's Unvarnished principle and the
 * Addendum's Deterministic principle, which agree on this much even where
 * they differ on warmth.
 */
export const MESSAGE_RULES = [
  "Say what is wrong AND what to do. 'Invalid' tells the reader what they already knew.",
  "Name the constraint, not the code. 'Below the minimum for this offering', not 'ERR_MIN_SUB'.",
  "No blame. 'This commitment is below the minimum', never 'You entered too little'.",
  "No apology. 'Sorry' does not fix anything and delays the sentence that does.",
  "Accessible text names the field first — it is heard without the input being seen.",
  "Help text prevents; message text repairs. Do not use one for the other.",
] as const;
