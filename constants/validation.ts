/**
 * VALIDATION MESSAGES — what a rejection says to a person
 *
 * Wave 4 · Primitive Surface
 * VOICE RATIFIED 31 Jul 2026 — L1-02 Part VII
 *
 * ── THE VOICE ────────────────────────────────────────────────────────
 * Warm · Confident · Assertive, with Pleasantness.
 *
 *   Warm       — we speak to a person, not to a form. "You", not a role name.
 *   Confident  — we state what is true. No "may", no "might", no hedging.
 *   Assertive  — every message says what happens next.
 *   Pleasant   — courteous without softeners. Never curt, never apologetic.
 *
 * **Warm is not soft. Assertive is not cold. Confident is not loud.**
 *
 * A rejection is the moment a person most needs to be spoken to well, not
 * least. There is no second voice for error states.
 *
 * ── THE SPLIT ────────────────────────────────────────────────────────
 * The generated Zod contracts own WHETHER a value is valid. This file owns
 * WHAT WE SAY when it is not. The two change for different reasons: a
 * field's type changes when the model changes; its message changes when
 * someone reads it and still does not know what to do.
 *
 * ── THREE STRINGS, NOT ONE ───────────────────────────────────────────
 *   message — after the mistake. What is wrong, and what to do next.
 *   help    — before it. Prevents it. Shown alongside the field.
 *   a11y    — announced. Names the field first, because it is heard
 *             without the input being seen.
 */

export interface ValidationRule {
  /** Machine code for logs and API responses. Never shown to a person. */
  code: string;
  /** The rule, in engineering terms. */
  rule: string;
  /** After the mistake. What is wrong, and what to do next. */
  message: string;
  /** Before the mistake. Shown alongside the field. */
  help: string;
  /** Announced by a screen reader. Names the field first. */
  a11y: string;
}

const V = (code: string, rule: string, message: string, help: string, a11y: string): ValidationRule =>
  ({ code, rule, message, help, a11y });

export const VALIDATION: Record<string, ValidationRule> = {
  // ── Money ─────────────────────────────────────────────────────────
  "money.format": V(
    "money.format",
    "Decimal string, at most 4 places. Never a float.",
    "Enter the amount in digits, with up to four decimal places.",
    "For example 12,50,000.00",
    "Amount field error: enter the amount in digits, with up to four decimal places.",
  ),
  "money.negative": V(
    "money.negative",
    "amount >= 0 where a negative is meaningless",
    "Amounts here are always positive. To record a reduction, post an offsetting entry — it keeps both the original and the correction visible.",
    "Reductions are posted as offsetting entries, never as negative amounts.",
    "Amount field error: amounts here are always positive. Record a reduction as an offsetting entry.",
  ),
  "money.precision": V(
    "money.precision",
    "at most 4 decimal places",
    "The ledger keeps four decimal places. Round to four and this will go through.",
    "Four decimal places — for example 1,250.5000",
    "Amount field error: the ledger keeps four decimal places. Round to four and this will go through.",
  ),

  // ── Capital ───────────────────────────────────────────────────────
  "commitment.belowMinimum": V(
    "commitment.belowMinimum",
    "amount >= offering.minimum_subscription",
    "This commitment is below the minimum for this offering. Raise it to the minimum shown and we'll take it from there.",
    "The minimum subscription is set per offering and shown on the offering itself.",
    "Commitment amount error: this commitment is below the minimum for this offering. Raise it to the minimum shown.",
  ),
  "commitment.accreditationExpired": V(
    "commitment.accreditationExpired",
    "accreditation valid AT ACCEPTANCE",
    "Your accreditation had expired when this commitment reached us, so it has lapsed. Renew it and the commitment can be made again — nothing else is affected.",
    "Accreditation runs for fifteen working days and covers one transaction. Your holdings and voting rights are never affected by it.",
    "Commitment error: your accreditation had expired when this commitment reached us, so it has lapsed. Renew it and the commitment can be made again.",
  ),
  "capitalCall.purposeNotPermitted": V(
    "capitalCall.purposeNotPermitted",
    "F-16: post-stabilisation purpose must be a growth purpose",
    "Once a vehicle is stabilised, capital is called for growth only — an acquisition, an approved expansion or redevelopment, an extraordinary event, or an LLP Agreement provision. Choose one of those, or meet the shortfall by deferring expenditure.",
    "Your capital is growth capital. Operating shortfalls are met from reserves and deferred spend, never from a call.",
    "Capital call error: once a vehicle is stabilised, capital is called for growth purposes only.",
  ),
  "capital.illegalTransition": V(
    "capital.illegalTransition",
    "F-03: transition must be in the state machine",
    "Capital does not move between those two states. It runs committed, drawn, invested, then out through returned or distributed — and it never runs backward.",
    "Capital moves in one direction. A correction is a new entry, not a reversal of state.",
    "Capital state error: capital does not move between those two states.",
  ),

  // ── Distribution ──────────────────────────────────────────────────
  "distribution.reserveBelowFloor": V(
    "distribution.reserveBelowFloor",
    "F-06 prospective test",
    "This distribution would take the reserve below its floor, so it stops here. Restore the reserve and it will run.",
    "The Reserve Floor is six months of non-operational fixed obligations, or the Board-approved minimum — whichever is higher.",
    "Distribution blocked: this distribution would take the reserve below its floor. Restore the reserve and it will run.",
  ),
  "distribution.debtServiceUnpaid": V(
    "distribution.debtServiceUnpaid",
    "F-05: stage 6 requires stage 5 settled",
    "Scheduled debt service is outstanding, so partner distributions wait. They run as soon as it settles.",
    "Debt service is stage 5 of the waterfall. Partners are stage 6.",
    "Distribution blocked: scheduled debt service is outstanding, so partner distributions wait until it settles.",
  ),
  "distribution.suspendedByResolution": V(
    "distribution.suspendedByResolution",
    "L1-16 §2.6a",
    "Partners resolved to pause distributions while the reserve is in breach. They resume when the reserve is restored, or when a further resolution lifts the pause.",
    "A breach alone does not pause distributions. Only a resolution does.",
    "Distribution paused: partners resolved to pause distributions while the reserve is in breach.",
  ),
  "ownership.notConserved": V(
    "ownership.notConserved",
    "F-02: sum(units_held) == total_units_issued",
    "The register does not balance against units issued, so nothing is distributed until it does. Every unit issued belongs to exactly one position.",
    "Units held across all positions must equal units issued, exactly.",
    "Distribution blocked: the register does not balance against units issued.",
  ),

  // ── Identity & governance ─────────────────────────────────────────
  "authority.unauthenticated": V(
    "authority.unauthenticated",
    "I-01",
    "Sign in to continue.",
    "",
    "Error: sign in to continue.",
  ),
  "authority.notGranted": V(
    "authority.notGranted",
    "I-02: absence of a grant is a denial",
    "You do not hold authority for this action here. The Governance Office grants it, per role and per vehicle — they can tell you what you hold.",
    "Authority is explicit and scoped. Holding it in one vehicle does not carry to another.",
    "Error: you do not hold authority for this action here. The Governance Office grants it, per role and per vehicle.",
  ),
  "reason.required": V(
    "reason.required",
    "E-02: decision commands require a recorded reason",
    "Record why. This becomes part of the permanent decision record, and it is what a future reviewer — quite possibly you — will read.",
    "A sentence or two is enough. Say what you weighed, not what you did.",
    "Reason field error: record why. This becomes part of the permanent decision record.",
  ),
  "conflict.undisclosed": V(
    "conflict.undisclosed",
    "I-07: a known conflict must be disclosed before acting",
    "Disclose your conflict first, then proceed. Conflicts are expected in an integrated enterprise and are never a barrier — undisclosed ones are.",
    "Disclosure goes to the Conflict Register and is visible to the Governance and Ethics Committee.",
    "Error: disclose your conflict first, then proceed.",
  ),
  "vote.alreadyCast": V(
    "vote.alreadyCast",
    "one ballot per holder",
    "You have voted on this resolution. Your holding carried its full weight in that single ballot.",
    "Voting is equity-weighted. One ballot carries everything you hold.",
    "Error: you have voted on this resolution. Your holding carried its full weight in that single ballot.",
  ),
  "vote.recused": V(
    "vote.recused",
    "I-07: a recused holder may not vote",
    "You recused on a disclosed conflict for this resolution, so your ballot is not taken. The disclosure stands to your credit.",
    "",
    "Error: you recused on a disclosed conflict for this resolution, so your ballot is not taken.",
  ),
  "vote.noEquity": V(
    "vote.noEquity",
    "voting is equity-weighted",
    "Voting weight comes from units held, and this identity holds none.",
    "",
    "Error: voting weight comes from units held, and this identity holds none.",
  ),

  // ── Records ───────────────────────────────────────────────────────
  "immutable.field": V(
    "immutable.field",
    "field absent from the Update contract",
    "This value is fixed once recorded. To change it, post an amendment — the original stays visible, which is the point.",
    "Immutable fields are corrected by amendment, never by edit. The history is the record.",
    "Error: this value is fixed once recorded. To change it, post an amendment.",
  ),
  "ledger.reversalMismatch": V(
    "ledger.reversalMismatch",
    "E-04: a reversal must exactly offset",
    "A reversal offsets its original exactly. For a partial correction, post a new entry instead.",
    "",
    "Error: a reversal offsets its original exactly. For a partial correction, post a new entry.",
  ),
  "narrative.required": V(
    "narrative.required",
    "every posting is explained",
    "Every posting carries a narrative. Say what this entry is for.",
    "One sentence. It is read by whoever reconciles this later.",
    "Narrative field error: every posting carries a narrative. Say what this entry is for.",
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
    "Choose one of the options shown.",
    "",
    "Field error: choose one of the options shown.",
  ),
  "field.uuid": V(
    "field.uuid",
    "uuid format",
    "That identifier is not in the expected format. Copy it again from the source record.",
    "",
    "Field error: that identifier is not in the expected format. Copy it again from the source record.",
  ),
  "field.date": V(
    "field.date",
    "YYYY-MM-DD",
    "Enter the date as YYYY-MM-DD.",
    "For example 2026-07-31",
    "Date field error: enter the date as YYYY-MM-DD.",
  ),
};

export const messageFor = (code: string): string =>
  VALIDATION[code]?.message ?? "That value could not be accepted. Check the field and try again.";

export const helpFor = (code: string): string => VALIDATION[code]?.help ?? "";

export const accessibleErrorFor = (code: string): string =>
  VALIDATION[code]?.a11y ?? messageFor(code);

/**
 * API error shape.
 *
 * A code AND a message, always. The code is what a client branches on; the
 * message is what a person reads. Returning one without the other forces
 * somebody to parse prose or to invent their own copy — and the copy they
 * invent will not be in this voice.
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
 * Copy rules, derived from L1-02 Part VII. Checked by `voice-lint`.
 */
export const MESSAGE_RULES = [
  "Say what is wrong AND what to do. 'Invalid' tells a reader what they already knew.",
  "Name the constraint, not the person. 'This commitment is below the minimum', never 'you entered too little'.",
  "No apology. 'Sorry' fixes nothing and delays the sentence that does.",
  "No hedging. 'Cannot', not 'may not be able to'.",
  "No softeners. Not 'just', 'simply', 'unfortunately' or 'please note'.",
  "Second person is welcome. Warmth lives in the pronoun.",
  "Accessible text names the field first — it is heard without the input being seen.",
  "Help text prevents; message text repairs. Do not use one for the other.",
] as const;
