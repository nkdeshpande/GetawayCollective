/**
 * AI OPERATING CONTRACTS — ATLAS and IRIS
 *
 * Authority: GC-IA-V5-OPERATING-CANON · AI Contracts, AI Layer · FIX-10
 *
 * ── THE THESIS ───────────────────────────────────────────────────────
 * Intelligence produces GOVERNED OUTPUTS, never invisible authority.
 *
 * The boundary was already right before this file existed: both agents
 * are declared in constants/digital-profiles.ts with `requestableRoles: []`,
 * so neither can hold a constitutional right by construction — not by
 * policy, not by review, by the shape of the type.
 *
 * What was missing is the other half. An agent that cannot act but can
 * still *say* things needs its sayings to be objects: typed, sourced,
 * addressed to a named human, and auditable after the fact. FIX-10 calls
 * the alternative "invisible agent actions" — a recommendation that
 * arrives as a sentence in a panel, gets acted on, and leaves no record
 * that an agent produced it.
 *
 * So every contract below names an OUTPUT OBJECT. That object is the unit
 * of governance. Wiring a model before the output object exists produces
 * exactly the failure the fix was written to prevent.
 *
 * ── WHAT THIS FILE IS AND IS NOT ─────────────────────────────────────
 * It is a declaration. There is no engine, no model call, no prompt.
 * `mayMutate` describes what a contract WOULD be permitted to change once
 * one exists — it grants nothing today, and nothing reads it to decide.
 *
 * Declaring first is deliberate. The contract is the thing reviewers can
 * argue with; the implementation is downstream of it.
 *
 * ── THE ONE RULE BOTH AGENTS SHARE ───────────────────────────────────
 * Escalation, never approval. Neither approves a fiduciary act. ATLAS
 * escalates to the named decision owner with sources, a summary, proposed
 * steps and a deadline (WF-4). IRIS escalates to a named human carrying
 * full context, so nobody is asked to repeat themselves (UX-07).
 */

import type { DigitalProfileId } from "./digital-profiles";

export type AgentId = "ATLAS" | "IRIS";

/**
 * How far a contract may write.
 *
 * Graded rather than boolean, because "may an agent mutate?" has no
 * useful single answer: saving a consented preference and drafting a
 * distribution are both writes and are not remotely the same act.
 *
 * Ordered least to most consequential. Nothing above `draft` exists.
 */
export type MutationLevel =
  /** Reads only. Produces an output object and nothing else. */
  | "none"
  /** Records that a notice was delivered, opened or acknowledged. */
  | "acknowledgement"
  /** Relationship memory, and ONLY with the member's consent. */
  | "consented-memory"
  /** Pre-authorised low-risk metadata. Never a figure, never a state. */
  | "metadata"
  /** A reminder or task in a human's queue. */
  | "task"
  /** A draft that a human must confirm before it means anything. */
  | "draft";

export interface AiContract {
  readonly id: string;
  readonly agent: AgentId;
  /** The event that starts it. */
  readonly trigger: string;
  /** The graph it may read. Never wider than the agent's own vantage. */
  readonly inputScope: string;
  readonly permittedReasoning: string;
  /** The governed artifact. The unit of audit — see the header. */
  readonly outputObject: string;
  readonly mayMutate: MutationLevel;
  /** What the mutation actually is, where one is permitted. */
  readonly mutationDetail?: string;
  /** The human who must act before anything becomes consequential. */
  readonly humanGate: string;
  /** How the other agent may receive any of this. */
  readonly crossAgentRule: string;
  /** What the output must carry to be believable. Never optional. */
  readonly provenance: string;
  /** Named negatives. Enforced by review today, by code when wired. */
  readonly prohibited: string;
  readonly workflow: string;
  readonly ia: string;
}

const C = (c: AiContract): AiContract => Object.freeze(c);

export const AI_CONTRACTS: readonly AiContract[] = [
  /* ── ATLAS · the Office agent ─────────────────────────────────── */
  C({
    id: "AI-001", agent: "ATLAS",
    trigger: "A vehicle event or change",
    inputScope: "The office-authorised vehicle graph",
    permittedReasoning: "Compare state, detect exceptions, calculate derived facts",
    outputObject: "ATLAS Recommendation",
    mayMutate: "metadata",
    mutationDetail: "Low-risk pre-authorised metadata only. Never a figure and never a lifecycle state.",
    humanGate: "Required for any consequential action",
    crossAgentRule: "IRIS receives approved facts only",
    provenance: "Source ids and a confidence class on every asserted fact",
    prohibited: "Approve · sign · vote · move money",
    workflow: "All", ia: "OFF-*",
  }),
  C({
    id: "AI-002", agent: "ATLAS",
    trigger: "Project variance detected",
    inputScope: "Project baseline and its evidence",
    permittedReasoning: "Schedule, cost and dependency reasoning",
    outputObject: "Project Risk / Recommendation",
    mayMutate: "draft",
    mutationDetail: "May open a draft Matter or Issue for a human to own.",
    humanGate: "Change approval is human",
    crossAgentRule: "Only approved member disclosure crosses",
    provenance: "Baseline VERSION and the evidence behind the variance",
    prohibited: "Rebaseline autonomously",
    workflow: "VW-06", ia: "PRJ-*",
  }),
  C({
    id: "AI-003", agent: "ATLAS",
    trigger: "Distribution period close",
    inputScope: "Capital ledgers, the waterfall and the governing agreements",
    permittedReasoning: "Apply the waterfall and run the reserve and solvency tests",
    outputObject: "Distribution Proposal",
    mayMutate: "draft",
    mutationDetail: "A proposal only. It is not a distribution until a human approves and executes.",
    humanGate: "Approval AND execution are both human, and are different humans (SOD-01)",
    crossAgentRule: "IRIS receives approved distribution facts",
    provenance: "Formula version and ledger references",
    prohibited: "Approve or execute a distribution",
    workflow: "VW-09", ia: "CAP-170",
  }),
  C({
    id: "AI-004", agent: "ATLAS",
    trigger: "A compliance obligation falls due or expires",
    inputScope: "The obligation register and its documents",
    permittedReasoning: "Deadline and completeness checks",
    outputObject: "Obligation Alert / Draft Filing Pack",
    mayMutate: "task",
    mutationDetail: "May raise a reminder or a task against a named owner.",
    humanGate: "Filing and signature are human",
    crossAgentRule: "IRIS is involved only where member disclosure is needed",
    provenance: "The source obligation and its due date",
    prohibited: "File or sign without a grant",
    workflow: "VW-02 · VW-10", ia: "GOV-150",
  }),
  C({
    id: "AI-005", agent: "ATLAS",
    trigger: "An agreement is executed",
    inputScope: "The executed agreement",
    permittedReasoning: "Extract obligations, fees, renewals and notice periods",
    outputObject: "Obligation Draft Set",
    mayMutate: "draft",
    mutationDetail: "Drafts remain drafts until a human confirms the material terms.",
    humanGate: "A human confirms the extraction",
    crossAgentRule: "IRIS receives only approved clauses",
    provenance: "Document version and clause references",
    prohibited: "Create a binding interpretation",
    workflow: "VW-02 · VW-08", ia: "GOV-140",
  }),
  C({
    id: "AI-006", agent: "ATLAS",
    trigger: "A question about authority",
    inputScope: "The governance graph",
    permittedReasoning: "Resolve a possible authority path",
    outputObject: "Authority Explanation",
    mayMutate: "none",
    humanGate: "The human remains the decision owner",
    crossAgentRule: "IRIS may receive a member-facing explanation if approved",
    provenance: "Rule and evidence citations",
    prohibited: "Grant authority",
    workflow: "VW-10", ia: "GOV-120",
  }),

  /* ── IRIS · the relationship agent ────────────────────────────── */
  C({
    id: "AI-101", agent: "IRIS",
    trigger: "A public question",
    inputScope: "The public approved projection",
    permittedReasoning: "Explain the place and the model, without investor-specific advice",
    outputObject: "Interaction + Answer",
    mayMutate: "consented-memory",
    mutationDetail: "Relationship memory, and only with consent.",
    humanGate: "Escalate on uncertainty",
    crossAgentRule: "Requests reach ATLAS through the policy gate, never directly",
    provenance: "Approved claims with their source context",
    prohibited: "Recommend an investment · invent a fact",
    workflow: "VW-03", ia: "GC-*",
  }),
  C({
    id: "AI-102", agent: "IRIS",
    trigger: "An investor diligence question",
    inputScope: "The investor projection and the relationship context",
    permittedReasoning: "Explain and compare disclosed facts; track unresolved questions",
    outputObject: "Investor Context Update",
    mayMutate: "consented-memory",
    mutationDetail: "May save consented context.",
    humanGate: "A human takes any legal or commercial judgement",
    crossAgentRule: "ATLAS facts arrive through the policy gate",
    provenance: "Source and effective date on every disclosed fact",
    prohibited: "Accredit · accept · negotiate binding terms",
    workflow: "VW-03 · VW-04", ia: "INV-*",
  }),
  C({
    id: "AI-103", agent: "IRIS",
    trigger: "Handoff to a human",
    inputScope: "The relationship context",
    permittedReasoning: "Summarise intent, questions, documents and commitments",
    outputObject: "Handoff Package",
    mayMutate: "none",
    humanGate: "A human accepts the handoff",
    crossAgentRule: "The human's outcome returns to IRIS context",
    provenance: "Source interaction ids",
    prohibited: "Hide material context",
    workflow: "VW-04", ia: "INV-170",
  }),
  C({
    id: "AI-104", agent: "IRIS",
    trigger: "A member question",
    inputScope: "The member and vehicle projections",
    permittedReasoning: "Explain the member's own position, vehicle state and governance actions",
    /* RENAMED from the canon, and vocab-lint is why.
       The AI Contracts sheet spells this output object with a word L1-01
       §25 forbids outright — one of the operating-company terms reserved
       to the Operating Partner. Two canons disagree here; §25 is the
       older and constitutional one, so the object is renamed rather than
       exempted with a pragma. "Assisted" carries the meaning intended:
       the agent acts for the member without deciding for them. */
    outputObject: "Member Answer / Assisted Action",
    mayMutate: "acknowledgement",
    mutationDetail: "Low-risk assisted actions only.",
    humanGate: "A human handles exceptions and anything fiduciary",
    crossAgentRule: "ATLAS facts arrive through the disclosure gate",
    provenance: "The member's own entitlement and source references",
    prohibited: "Expose another member · expose internal deliberation",
    workflow: "VW-08 · VW-09 · VW-10", ia: "MEM-*",
  }),
  C({
    id: "AI-105", agent: "IRIS",
    trigger: "A member action is required",
    inputScope: "The resolution or disclosure event",
    permittedReasoning: "Translate the consequence and the next step",
    outputObject: "Member Notification / Interaction",
    mayMutate: "acknowledgement",
    mutationDetail: "May record a read receipt or an acknowledgement.",
    humanGate: "A vote is always human",
    crossAgentRule: "ATLAS sends the approved event only",
    provenance: "Decision and evidence references",
    prohibited: "Cast a vote · waive a right",
    workflow: "VW-10", ia: "MEM-170",
  }),
];

/**
 * The two agents.
 *
 * `profile` binds each to the digital profile that already exists, which
 * is where the constitutional posture lives — `requestableRoles: []` on
 * both. This file describes what they DO; that file governs what they may
 * HOLD, and the answer there is nothing.
 */
export interface Agent {
  readonly id: AgentId;
  readonly code: string;
  readonly name: string;
  readonly profile: DigitalProfileId;
  readonly serves: string;
  readonly realm: string;
  readonly does: string;
  readonly never: string;
  readonly escalates: string;
  readonly health: string;
}

export const AGENTS: Record<AgentId, Agent> = {
  ATLAS: {
    id: "ATLAS", code: "GC-01", name: "ATLAS · Institutional Intelligence",
    profile: "gc_01_platform_operations_agent",
    serves: "GC Executive, COO, Investor Relations, Finance, Governance",
    realm: "/office/** — the cockpit, the four quadrants, project and partners",
    does:
      "Monitors vehicle health, drafts filings, routes dockets, assembles evidence, flags covenant " +
      "proximity (N-15)",
    never: "Approves capital · accepts commitments · grants authority · publishes binding content",
    escalates:
      "To the named decision owner with sources, a factual summary, proposed steps and a deadline (WF-4)",
    health: "Vehicle Health — the universal assessment across Space, Capital, Time, Governance and Project",
  },
  IRIS: {
    id: "IRIS", code: "GC-02", name: "IRIS · Relationship Intelligence",
    profile: "gc_02_investor_intelligence_agent",
    serves: "Prospect → Investor → Member, as one continuous memory",
    realm: "Public chapters, the dossier, member home and activity",
    does:
      "Answers 'why this place', prepares the dossier, explains economics and rights, drafts " +
      "enquiries, remembers preferences",
    never:
      "Accredits · recommends · accepts · binds · decides; never quotes another member's data",
    escalates:
      "To a named human (IR handoff, INV-170) carrying full context — the member is never asked to " +
      "repeat themselves (UX-07)",
    health: "Relationship health — unanswered questions, stalled stages, unacknowledged notices",
  },
};

/** Every distinct governed output. The units of audit. */
export const OUTPUT_OBJECTS: readonly string[] = [
  ...new Set(AI_CONTRACTS.map((c) => c.outputObject)),
];

export const contractsFor = (a: AgentId): AiContract[] =>
  AI_CONTRACTS.filter((c) => c.agent === a);

export const contractById = (id: string): AiContract | undefined =>
  AI_CONTRACTS.find((c) => c.id === id);

export const AI_LAWS = {
  escalationNeverApproval:
    "Neither agent approves a fiduciary act. Both escalate. The escalation carries sources, a " +
    "factual summary, proposed steps, an owner and a deadline — an escalation that carries less is " +
    "a notification, and a notification is not a handoff.",
  governedOutput:
    "Every consequential output is a typed object with provenance, not a sentence in a panel. The " +
    "object is what makes the agent auditable after the fact; without it a recommendation is acted " +
    "on and leaves no trace that an agent produced it (FIX-10).",
  noRightByConstruction:
    "Both agents carry requestableRoles: [] in constants/digital-profiles.ts, so neither can hold a " +
    "right. That is enforced by the shape of the type rather than by policy.",
  crossAgentThroughPolicy:
    "IRIS never reads the office graph and ATLAS never speaks to a member. Facts cross through a " +
    "disclosure gate, one direction at a time, and only once approved.",
  provenanceIsNotOptional:
    "Every contract states what its output must carry. An AI claim with no source is the one kind " +
    "of claim this platform cannot let a reader assess.",
} as const;
