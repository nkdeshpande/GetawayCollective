/**
 * PROCESSES — multi-step enterprise flows
 *
 * Wave 5 · Capability & Nervous System
 *
 * ── ON THE NAME ──────────────────────────────────────────────────────
 * The intake calls these "Journeys". That word is forbidden (§25 — it
 * belongs to the Operating Company, and the Member Law replaced it with
 * Investor Lifecycle). They are Processes here.
 *
 * ── PROCESS vs STATE MACHINE ─────────────────────────────────────────
 * A state machine governs ONE object. A process spans several, and its
 * steps are things a person does rather than states a record occupies.
 *
 * Accreditation touches Investor, ComplianceEvent and Agreement. No single
 * object's lifecycle describes it, which is exactly why it needs saying
 * somewhere — otherwise it exists only as an order of operations somebody
 * remembers.
 *
 * ── RESUMABILITY IS THE POINT ────────────────────────────────────────
 * Real processes are abandoned halfway. A model that assumes completion
 * produces a system where an abandoned accreditation is indistinguishable
 * from one that never started, and the second attempt begins from zero.
 * Every step below declares whether it can be resumed and what expires.
 */

import type { CommandName } from "./commands";

export interface ProcessStep {
  id: string;
  name: string;
  /** What the actor is actually doing. */
  description: string;
  /** The capability that advances it, where one exists. */
  via?: CommandName;
  /** True when returning later can pick up here. */
  resumable: boolean;
  /** How long this step's output stays good. Null means indefinitely. */
  expiresAfter: string | null;
  /** What must be true to enter. */
  entry: string;
}

export interface Process {
  id: string;
  name: string;
  actor: string;
  mission: string;
  steps: readonly ProcessStep[];
  terminal: readonly string[];
  /** May one actor run several of these at once? */
  concurrent: boolean;
  concurrencyNote: string;
  /** What happens to a half-finished run. */
  abandonment: string;
}

const S = (s: ProcessStep) => s;

// ─────────────────────────────────────────────────────────────────────

export const ACCREDITATION_PROCESS: Process = {
  id: "PR-01",
  name: "Accreditation",
  actor: "Investor, assisted by the Compliance Office",
  mission:
    "Establish that a legal person may enter capital formation for a SPECIFIC opportunity. " +
    "Not standing eligibility — accreditation is transaction-scoped and short-lived by design.",
  steps: [
    S({ id: "A1", name: "Eligibility", description: "Confirm the person may invest at all in their jurisdiction.",
        resumable: true, expiresAfter: null, entry: "Identity has expressed interest." }),
    S({ id: "A2", name: "Identity", description: "Verify who they are against government identification.",
        resumable: true, expiresAfter: null, entry: "Eligibility clear." }),
    S({ id: "A3", name: "Address & tax residency", description: "Establish where they are resident for tax.",
        resumable: true, expiresAfter: null, entry: "Identity verified." }),
    S({ id: "A4", name: "AML & source of funds", description: "Anti-money-laundering screening and provenance of capital.",
        resumable: true, expiresAfter: null, entry: "Tax residency established." }),
    S({ id: "A5", name: "Suitability", description: "Assess whether the opportunity is appropriate for them.",
        resumable: true, expiresAfter: null, entry: "AML clear." }),
    S({ id: "A6", name: "Decision", description: "Compliance grants or declines accreditation.",
        via: "GrantAccreditation", resumable: false, expiresAfter: "15 working days",
        entry: "All prior steps clear." }),
    S({ id: "A7", name: "Expiry", description: "Accreditation lapses. New commitments blocked; ownership rights untouched.",
        via: "ExpireAccreditation", resumable: true, expiresAfter: null,
        entry: "Fifteen working days elapsed since grant." }),
  ],
  terminal: ["A7"],
  concurrent: false,
  concurrencyNote:
    "One accreditation process per identity at a time. Two in flight would let a decline in one " +
    "and a grant in the other exist simultaneously, and nothing would say which governs.",
  abandonment:
    "Steps A1-A5 hold indefinitely and resume where they stopped — re-verifying an unchanged " +
    "passport helps nobody. Only A6 expires, because the DECISION is what is time-bound, not the " +
    "evidence behind it.",
};

export const COMMITMENT_PROCESS: Process = {
  id: "PR-02",
  name: "Commitment",
  actor: "Investor, with the Executive Office accepting",
  mission: "Take a legal person from interest to settled capital inside a vehicle.",
  steps: [
    S({ id: "C1", name: "Discover", description: "Review the offering, its terms and its Investment Thesis.",
        resumable: true, expiresAfter: null, entry: "Offering state is open." }),
    S({ id: "C2", name: "Compare", description: "Weigh this offering against others held or considered.",
        resumable: true, expiresAfter: null, entry: "Offering reviewed." }),
    S({ id: "C3", name: "Commit", description: "Make a binding promise of capital at or above the minimum.",
        resumable: true, expiresAfter: null, entry: "Accreditation valid." }),
    S({ id: "C4", name: "Acceptance", description: "The enterprise formally accepts. Accreditation is tested HERE.",
        via: "AcceptCommitment", resumable: false, expiresAfter: null,
        entry: "Accreditation valid AT THIS MOMENT. Amount at or above the minimum." }),
    S({ id: "C5", name: "Documents", description: "Subscription agreement and LLP Agreement executed.",
        resumable: true, expiresAfter: null, entry: "Commitment accepted." }),
    S({ id: "C6", name: "Settlement", description: "Funds received. Triggers the Member Law promotion.",
        via: "DeployCapital", resumable: false, expiresAfter: null, entry: "Documents executed." }),
  ],
  terminal: ["C6"],
  concurrent: true,
  concurrencyNote:
    "An Investor may run several commitment processes at once, across different offerings. " +
    "One OFFERING may not run two processes for the same investor — that would double-count " +
    "their position in the same vehicle.",
  abandonment:
    "Abandoned before C4, the commitment simply lapses and nothing is owed. Abandoned between " +
    "C4 and C6, it does NOT lapse: the commitment is already binding, and non-settlement is a " +
    "default under the LLP Agreement rather than a change of mind.",
};

export const ACQUISITION_PROCESS: Process = {
  id: "PR-03",
  name: "Acquisition",
  actor: "Investment Committee",
  mission: "Take a candidate property from prospect to held asset, with the reasoning preserved.",
  steps: [
    S({ id: "Q1", name: "Thesis", description: "Write why this property should outperform over twenty years.",
        via: "VersionInvestmentThesis", resumable: true, expiresAfter: null,
        entry: "Property registered in prospecting." }),
    S({ id: "Q2", name: "Diligence", description: "Six workstreams: legal, technical, environmental, financial, commercial, title.",
        via: "CompleteDueDiligence", resumable: true, expiresAfter: "180 days",
        entry: "Thesis versioned." }),
    S({ id: "Q3", name: "Valuation", description: "Independent valuation obtained.",
        via: "RecordValuation", resumable: true, expiresAfter: "365 days", entry: "Diligence clear." }),
    S({ id: "Q4", name: "Approval", description: "Investment Committee resolves to acquire.",
        via: "ResolveResolution", resumable: false, expiresAfter: "90 days", entry: "Valuation current." }),
    S({ id: "Q5", name: "Completion", description: "Title transfers. Terms become immutable.",
        via: "CompleteAcquisition", resumable: false, expiresAfter: null, entry: "Approval current." }),
  ],
  terminal: ["Q5"],
  concurrent: true,
  concurrencyNote: "Several acquisitions may run at once. One property may not — two parallel runs could reach two different approvals.",
  abandonment:
    "Diligence expires at 180 days and valuation at 365 because both describe a world that moves. " +
    "Approval expires at 90 days: a committee approved the asset AT A PRICE, and after a quarter " +
    "that is a different decision.",
};

export const DISTRIBUTION_PROCESS: Process = {
  id: "PR-04",
  name: "Distribution",
  actor: "Executive Office",
  mission: "Move a period's Revenue Base through the six-stage waterfall to partners.",
  steps: [
    S({ id: "D1", name: "Close the period", description: "Establish the Revenue Base under the constitutional definition.",
        resumable: true, expiresAfter: null, entry: "Period ended." }),
    S({ id: "D2", name: "Reconcile", description: "Confirm the capital table conserves against units issued.",
        resumable: true, expiresAfter: null, entry: "Revenue Base fixed." }),
    S({ id: "D3", name: "Run the waterfall", description: "Six stages in order. Stage 6 is subject to three hard stops.",
        via: "ExecuteDistribution", resumable: false, expiresAfter: null,
        entry: "Register conserves (F-02)." }),
    S({ id: "D4", name: "Report", description: "Publish the outcome, including why stage 6 was blocked if it was.",
        via: "PublishPerformanceReport", resumable: true, expiresAfter: null, entry: "Waterfall run." }),
  ],
  terminal: ["D4"],
  concurrent: false,
  concurrencyNote:
    "One distribution per vehicle per period. Two in flight could each read the reserve balance " +
    "before the other posted, and both would pass the floor check.",
  abandonment:
    "D3 is atomic: it either posts every stage or none. A refused run leaves no partial ledger " +
    "trail, because a partial trail is indistinguishable from a completed run that lost its later entries.",
};

export const GOVERNANCE_PROCESS: Process = {
  id: "PR-05",
  name: "Resolution",
  actor: "The tabling body and the voting partners",
  mission: "Take a matter from proposal to a recorded, computed outcome.",
  steps: [
    S({ id: "G1", name: "Table", description: "A body within its mandate proposes the matter and its options.",
        via: "TableResolution", resumable: true, expiresAfter: null, entry: "Proposer holds resolution.table." }),
    S({ id: "G2", name: "Notice", description: "Circulation before the vote. Thirty days for a constitutional amendment.",
        resumable: true, expiresAfter: null, entry: "Matter tabled." }),
    S({ id: "G3", name: "Disclose", description: "Conflicts declared BEFORE deliberation.",
        via: "DiscloseConflict", resumable: true, expiresAfter: null, entry: "Notice period running." }),
    S({ id: "G4", name: "Vote", description: "Equity-weighted ballots, sealed.",
        via: "CastVote", resumable: false, expiresAfter: null, entry: "Notice period elapsed." }),
    S({ id: "G5", name: "Resolve", description: "Outcome computed from the tally. No interpretation step.",
        via: "ResolveResolution", resumable: false, expiresAfter: null, entry: "Ballot closed." }),
  ],
  terminal: ["G5"],
  concurrent: true,
  concurrencyNote: "Several resolutions may be open at once. A holder casts one ballot in each.",
  abandonment:
    "A resolution abandoned before G4 lapses with no record beyond the tabling. Once ANY ballot " +
    "is cast it must be resolved, even if the outcome is inquorate — a vote that was cast and " +
    "never counted is worse than one that failed.",
};

export const PROCESSES: readonly Process[] = [
  ACCREDITATION_PROCESS, COMMITMENT_PROCESS, ACQUISITION_PROCESS,
  DISTRIBUTION_PROCESS, GOVERNANCE_PROCESS,
];

// ─────────────────────────────────────────────────────────────────────

export const processById = (id: string): Process | undefined => PROCESSES.find((p) => p.id === id);

export function stepsOf(p: Process): readonly ProcessStep[] {
  return p.steps;
}

/** Where a run may resume from, given the last step completed. */
export function resumeFrom(p: Process, lastCompleted: string): ProcessStep | null {
  const i = p.steps.findIndex((s) => s.id === lastCompleted);
  if (i === -1 || i === p.steps.length - 1) return null;
  const next = p.steps[i + 1];
  return next.resumable ? next : null;
}

/** Steps whose output goes stale, and how fast. */
export function expiringSteps(p: Process): { id: string; name: string; expiresAfter: string }[] {
  return p.steps
    .filter((s) => s.expiresAfter !== null)
    .map((s) => ({ id: s.id, name: s.name, expiresAfter: s.expiresAfter! }));
}

/**
 * The point of no return: the first non-resumable step.
 *
 * Worth naming explicitly, because it is where a process stops being an
 * enquiry and starts being a commitment — and interfaces should say so
 * before the reader crosses it, not after.
 */
export function pointOfNoReturn(p: Process): ProcessStep | undefined {
  return p.steps.find((s) => !s.resumable);
}
