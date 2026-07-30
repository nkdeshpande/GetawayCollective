/**
 * Constitutional Invariants (Wave 1, locked)
 * Rules that can never be violated, enforced at all layers
 *
 * These are the immutable laws of the enterprise.
 * Every layer (L1–L12) and every module enforces these.
 * If code violates an invariant, the build fails.
 *
 * Source: Invariant Register, Wave 1 Gate
 */

export interface Invariant {
  id: string;
  title: string;
  description: string;
  owningLayer: string;
  testName: string;
  enforcementPoints: string[];
  severity: "critical" | "major" | "minor";
  status: "implemented" | "planned" | "not-started";
}

export const INVARIANTS: Record<string, Invariant> = {
  // ── Founding Invariants ──────────────────────────────────────────
  // RETIRED: the pre-pivot inhabitable-unit invariant. // vocab-lint-ignore
  // The investment platform does not model inhabitable units. That hierarchy
  // belongs to Sensory Getaways (Operating Company). L1-01 §33 excludes it.
  // Replaced by the institutional analogue below.
  PROPERTY_REQUIRES_VEHICLE: {
    id: "inv-001",
    title: "Property requires Investment Vehicle",
    description:
      "A Property cannot exist without a governing Investment Vehicle. Every Property is held by exactly one Vehicle. Economic ownership exists only through a legal wrapper.",
    owningLayer: "L3 (Relationships & Graph)",
    testName: "test_property_requires_vehicle",
    enforcementPoints: [
      "API: CreateProperty precondition checks Investment Vehicle exists",
      "Database: Foreign key constraint vehicle_id NOT NULL",
      "Orphan audit: detect any Property with a missing or invalid vehicle_id",
    ],
    severity: "critical",
    status: "planned",
  },

  LEDGER_APPEND_ONLY: {
    id: "inv-002",
    title: "Ledger is append-only",
    description:
      "Financial Ledger entries are immutable. No deletion, no update. All corrections post an offsetting entry.",
    owningLayer: "L4 (State & Lifecycle)",
    testName: "test_ledger_immutable",
    enforcementPoints: [
      "Database: Ledger table has no UPDATE or DELETE triggers",
      "API: LedgerEntry.update and .delete commands do not exist",
      "Business logic: Corrections emit new LedgerEntryPosted event",
    ],
    severity: "critical",
    status: "planned",
  },

  KNOWLEDGE_IMMUTABLE: {
    id: "inv-003",
    title: "Knowledge is immutable",
    description:
      "Knowledge objects are immutable. Edits create new versioned entries. All prior versions remain accessible.",
    owningLayer: "L4 (State & Lifecycle)",
    testName: "test_knowledge_versioned",
    enforcementPoints: [
      "Database: Knowledge table has no UPDATE or DELETE",
      "API: Knowledge.update creates new version with version number",
      "UI: Knowledge display shows current version, links to history",
    ],
    severity: "critical",
    status: "planned",
  },

  CAPABILITY_PUBLISHES_EVENT: {
    id: "inv-004",
    title: "Every capability publishes events",
    description:
      "If a capability (command) changes state, it must emit at least one domain event. Events are the nervous system.",
    owningLayer: "L5 (Capabilities) + L9 (Events)",
    testName: "test_command_emits_event",
    enforcementPoints: [
      "Code linter: detects commands with no event.publish() call",
      "Tests: every command test asserts event emission",
      "Event log: missing event triggers auditor alert",
    ],
    severity: "critical",
    status: "planned",
  },

  DECISION_HAS_PROVENANCE: {
    id: "inv-005",
    title: "Every decision has provenance",
    description:
      "Every significant decision is recorded with context: who, when, why, options considered, decision made. Audit trail is immutable.",
    owningLayer: "L8 (Intelligence) + L10 (Data)",
    testName: "test_decision_recorded",
    enforcementPoints: [
      "API: Decision endpoint requires context fields (actor, reason, options, decision)",
      "Database: DecisionRecord table is append-only",
      "UI: Every significant action prompts for reason (approval, rejection, etc.)",
    ],
    severity: "major",
    status: "planned",
  },

  // ── Derived Invariants (from policy & design) ────────────────────
  NO_ORPHAN_OBJECT: {
    id: "inv-006",
    title: "No orphan object",
    description:
      "Every object (except roots) has a path to a root object. Dangling objects violate graph integrity.",
    owningLayer: "L3 (Relationships & Graph)",
    testName: "test_graph_connected",
    enforcementPoints: [
      "Database: Referential integrity via foreign keys",
      "Data migrations: orphan scan on every deploy",
      "Audits: quarterly orphan detection",
    ],
    severity: "critical",
    status: "planned",
  },

  NO_UNDECLARED_RELATIONSHIP: {
    id: "inv-007",
    title: "No undeclared relationship",
    description:
      "Only relationships defined in BO-REL-01…12 may exist. Ad-hoc joins are forbidden.",
    owningLayer: "L3 (Relationships & Graph)",
    testName: "test_schema_matches_rels",
    enforcementPoints: [
      "Database: only declared foreign keys allowed",
      "API linter: cross-object references must be declared",
      "GraphQL schema: restricted to defined relationships",
    ],
    severity: "critical",
    status: "planned",
  },

  // ── Data & Privacy ───────────────────────────────────────────────
  PII_IS_ENCRYPTED: {
    id: "inv-008",
    title: "PII is encrypted at rest",
    description:
      "Personally identifiable information (email, phone, name, address) is encrypted at rest and in transit.",
    owningLayer: "L12 (Governance)",
    testName: "test_pii_encrypted",
    enforcementPoints: [
      "Database: PII columns use encrypted type",
      "API: TLS 1.2+ required for all endpoints",
      "Audit: quarterly encryption key rotation",
    ],
    severity: "critical",
    status: "planned",
  },

  // ── State Machine ────────────────────────────────────────────────
  ONLY_LEGAL_TRANSITIONS: {
    id: "inv-009",
    title: "Only legal state transitions are allowed",
    description:
      "State machines define the legal transitions per object. Illegal transitions are impossible, not merely discouraged.",
    owningLayer: "L4 (State & Lifecycle)",
    testName: "test_state_machine_enforced",
    enforcementPoints: [
      "API: transition validation rejects illegal moves",
      "Database: state column constrained to legal enum",
      "Tests: every illegal transition explicitly tested and rejected",
    ],
    severity: "critical",
    status: "planned",
  },

  // ── Design System ────────────────────────────────────────────────
  NO_LITERAL_TOKENS: {
    id: "inv-010",
    title: "No literal design tokens in code",
    description:
      "All colour, spacing, duration, and radius values must come from the token package. No hardcoded hex, px, or ms.",
    owningLayer: "L7 (Applications & Surface)",
    testName: "test_no_literal_tokens",
    enforcementPoints: [
      "Build linter: detects hardcoded #HEX, #RRGGBB patterns",
      "Build linter: detects hardcoded px, ms, ms values outside token definitions",
      "Code review: manual check on CSS/styled-components",
    ],
    severity: "major",
    status: "planned",
  },

  NO_FORBIDDEN_TERMS: {
    id: "inv-011",
    title: "No forbidden terms in shipped code or UI",
    description:
      "Vocabulary is enforced by linter. The canonical mapping lives in constants/vocabulary.ts " +
      "and is the single source; it is deliberately not duplicated here.",
    owningLayer: "L1 (Enterprise Constitution)",
    testName: "test_vocab_lint_passes",
    enforcementPoints: [
      "Pre-commit: vocab-lint blocks forbidden terms",
      "CI: vocab-lint runs and fails build if violations found",
      "UI strings: Member-facing text reviewed for forbidden terms",
    ],
    severity: "major",
    status: "planned",
  },

  SINGLE_ACTOR: {
    id: "inv-013",
    title: "Single Actor — one identity spans Investor and Member states",
    description:
      "Investor and Member are two lifecycle states of ONE identity, not two entities. " +
      "The transition is a state change on an existing record, never the creation of a " +
      "second one. Triggered only by first capital commitment settling. Irreversible — " +
      "membership records history, not balance.",
    owningLayer: "L1 (Constitution) + L4 (State & Lifecycle)",
    testName: "test_single_actor_transition",
    enforcementPoints: [
      "Database: IDENTITY_ROOT carries member_state; there is no second identity table",
      "API: no CreateMember command exists — only PromoteToMember state transition",
      "Tests: asserting identity id is unchanged across the transition",
      "Tests: asserting holdings falling to zero does not revert member_state",
    ],
    severity: "critical",
    status: "planned",
  },

  // ── API & Data Consistency ───────────────────────────────────────
  API_COMMANDS_ONLY: {
    id: "inv-012",
    title: "API mutations via commands only",
    description:
      "All state changes go through commands (imperative verbs). No direct mutations, no free-form updates.",
    owningLayer: "L5 (Capabilities) + L10 (Data)",
    testName: "test_mutation_via_command",
    enforcementPoints: [
      "API design: no PATCH or PUT on domain objects, only POST to commands",
      "GraphQL schema: domain objects are read-only, mutations are commands",
      "Tests: any direct write to database outside command path fails test",
    ],
    severity: "critical",
    status: "planned",
  },
};

export const INVARIANT_LIST = Object.values(INVARIANTS);

/**
 * Get an invariant by ID
 */
export function getInvariant(id: string): Invariant | null {
  return INVARIANTS[Object.keys(INVARIANTS).find(
    (k) => INVARIANTS[k].id === id
  ) as keyof typeof INVARIANTS] || null;
}

/**
 * Get all unimplemented invariants (test not yet written)
 */
export function getUnimplementedInvariants(): Invariant[] {
  return INVARIANT_LIST.filter((inv) => inv.status !== "implemented");
}

/**
 * Get critical invariants (must not be violated)
 */
export function getCriticalInvariants(): Invariant[] {
  return INVARIANT_LIST.filter((inv) => inv.severity === "critical");
}
