/**
 * Enterprise Vocabulary (Wave 1, locked)
 * Mandatory terminology across UX, APIs, documentation, and code
 *
 * This is not optional. Every teammate must use these terms.
 * Violations are caught by vocab-lint and CI will reject commits.
 *
 * Source: Enterprise Vocabulary, L1 Constitution, Wave 1 Gate
 */

// ── Forbidden → Approved ─────────────────────────────────────────────
export const VOCABULARY_MAP = {
  forbidden: {
    "Room": "Never. Investment platform has no rooms.",
    "Studio": "Never. Operating company concern, not investment platform.",
    "Customer": "Never. Say Investor or Member.",
    "Consumer": "Never. Say Investor or Member. A Member owns; they do not consume.",
    "User": "Never. Say Investor or Member.",
    "Booking": "Never. Operating company concern.",
    "Journey": "Never. Say Investor Lifecycle.",
    "Experience": "Never. Say Investment Thesis.",
    "Stay": "Never. Operating company concern.",
    "Reservation": "Never. Operating company concern.",
    "Guest": "Never. Shareholder register has no guests.",
    "Concierge": "Never. Operating company concern.",
    "Housekeeping": "Never. Operating company concern.",
    "Service": "Never. Say Operating Partner.",
    "Wellness": "Never. Operating company concern.",
    "Steward": "Never as an actor noun or schema type. 'Stewardship' is philosophy only.",
  },
  approved: {
    "Investor": "Legal entity at pre-commitment state — outside the investment vehicle. Completes KYC and accreditation.",
    "Member": "The same entity at post-commitment state — capital committed, inside the vehicle, with governance rights.",
    "Investment Vehicle": "Legal container (Fund, SPV, Trust, Syndicate, LLP, REIT).",
    "Fund": "A specific type of Investment Vehicle (e.g., Fund I, Evergreen).",
    "Property": "Investment-grade real estate asset acquired by the platform.",
    "Portfolio": "Collection of Properties organized by investment strategy (e.g., Coastal Collection).",
    "Offering": "Regulated capital opportunity presented to investors (Series A, Growth Round, Rights Issue).",
    "Commitment": "Investor's legally binding promise of capital. Precedes deployment.",
    "Capital Call": "Request: 'We need ₹X by Date Y.'",
    "Investment": "Actual deployed capital. Immutable. Different from commitment.",
    "Ownership Position": "Investor's current economic stake. Computed; changes with distributions and NAV.",
    "Distribution": "Cash to investors (Dividend, Return of Capital, Profit Share, Exit Proceeds).",
    "Valuation": "Fair value assessment (independent appraisal, NAV, cap rate, appreciation).",
    "Acquisition": "Process of acquiring a Property.",
    "Disposition": "Process of exiting or selling a Property.",
    "Agreement": "Legal instrument (SPA, SHA, Subscription Agreement, Operating Agreement, Management Agreement).",
    "Operating Partner": "Contracted operator (Sensory Getaways or equivalent). Measured on SLA and performance.",
    "Investor Lifecycle": "States an Investor transitions through (Prospect → Qualified → Accredited → Committed → Invested → Holding → Distributed → Exited).",
    "Investment Thesis": "Why this Property should outperform over 20 years (return drivers, risk mitigants).",
    "Due Diligence": "Pre-acquisition investigation and documentation.",
    "Market Intelligence": "Market data, trends, competitive position.",
    "Risk": "Risk register entry (Liquidity, Interest Rate, Operator, Market, Climate, Currency, Legal).",
    "Performance": "Investment-level metrics (IRR, MOIC, Equity Multiple, NAV, Cash Yield, Benchmark).",
    "Governance": "Institutional decision-making structure (Board, Committee, Voting, Policy).",
    "Compliance Event": "Audit finding, regulatory notice, or policy breach.",
    "Stewardship": "Fiduciary duty to preserve and enhance assets for long-term value creation.",
  },
} as const;

// ── The Member Law (§25a, ratified 30 Jul 2026) ──────────────────────
/**
 * One identity. Two lifecycle states.
 * The transition is a state change on an existing record — never a second record.
 * Triggered only by first capital commitment settling. Irreversible.
 * Enforces invariant I-08 (Single Actor).
 */
export enum MemberState {
  /** Pre-commitment. Outside the system. */
  Investor = "investor",
  /** Post-commitment. Capital committed, inside the system. */
  Member = "member",
}

/** Membership records history, not balance. Holdings falling to zero does not revert state. */
export function canTransitionToMember(
  current: MemberState,
  firstCommitmentSettled: boolean
): boolean {
  return current === MemberState.Investor && firstCommitmentSettled;
}

/**
 * Lookup: is this term approved or forbidden?
 */
export function isApprovedTerm(term: string): boolean {
  const lower = term.toLowerCase();
  return (
    Object.keys(VOCABULARY_MAP.approved).some(
      (t) => t.toLowerCase() === lower
    ) &&
    !Object.keys(VOCABULARY_MAP.forbidden).some(
      (t) => t.toLowerCase() === lower
    )
  );
}

/**
 * Get the replacement for a forbidden term
 */
export function getForbiddenReplacement(term: string): string | null {
  const match = Object.entries(VOCABULARY_MAP.forbidden).find(
    ([forbidden, _]) => forbidden.toLowerCase() === term.toLowerCase()
  );
  return match ? match[1] : null;
}

/**
 * Get the definition of an approved term
 */
export function getTermDefinition(term: string): string | null {
  const match = Object.entries(VOCABULARY_MAP.approved).find(
    ([approved, _]) => approved.toLowerCase() === term.toLowerCase()
  );
  return match ? match[1] : null;
}

/**
 * Glossary export (for docs)
 */
export const GLOSSARY = Object.entries(VOCABULARY_MAP.approved).reduce(
  (acc, [term, def]) => {
    acc[term] = def;
    return acc;
  },
  {} as Record<string, string>
);
