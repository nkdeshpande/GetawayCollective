/**
 * THE CROSS-CUTTING TAXONOMIES — v5 controlled vocabularies
 *
 * Authority: GC-IA-V5-OPERATING-CANON · Taxonomies sheet
 *
 * ── WHY THESE CANNOT LIVE IN enums.ts ────────────────────────────────
 * `ENUM_DISPLAY` is keyed `"Object.field"` — deliberately, so `enum-lint`
 * can pair every entry against a field in the Unified Field Registry
 * without a translation table in between. That pairing is the check.
 *
 * These eight have no owning object. Disclosure Class applies to *all
 * records*, Operation Class to *commands*, Attention State to the AI
 * layer and the member home. Filing them under a fabricated
 * `"Something.disclosure_class"` key would invent a field the UFR does
 * not have, and `enum-lint` would correctly reject it. The mismatch is
 * structural, not a missing row.
 *
 * So they live here, under their own registry, with their own linter.
 *
 * ── THE TONE BUDGET IS GLOBAL, NOT PER FILE ──────────────────────────
 * `CRITICAL_TONE_BUDGET` in enums.ts is 12 and eleven are already spent.
 * The budget exists because a screen where everything is red says
 * nothing — and that is true of the whole product, not of one file. So
 * `taxonomy-lint` counts criticals across BOTH registries against the
 * one ceiling rather than opening a second allowance here.
 *
 * That left exactly one. It went to URGENT. BLOCKED wanted it too and
 * took hazard instead: "cannot proceed" is a hard stop that needs
 * attention, and "immediate, time-sensitive" is the only one of the two
 * that cannot wait for the next working day.
 *
 * ── ORDER IS SEMANTIC ────────────────────────────────────────────────
 * `order` is not display sequence. In Disclosure Class it is a
 * SENSITIVITY RANK — 6 is more restricted than 1, and `atLeastAsClosed()`
 * depends on that. In Operation Class it is an ESCALATION — EXECUTE
 * outranks WRITE, which is what makes PREPARE / APPROVE / EXECUTE
 * separable in the first place. Reordering a value silently changes a
 * permission decision, so the linter refuses a gap or a duplicate.
 */

import type { Tone } from "./enums";

export type TaxonomyId =
  | "domain_role"
  | "disclosure_class"
  | "operation_class"
  | "attention_state"
  | "confidence"
  | "qualification_state"
  | "project_control_state"
  | "evidence_state";

export interface TaxonomyValue {
  /** SCREAMING_CASE, exactly as the canon spells it. */
  readonly value: string;
  readonly meaning: string;
  /** Semantic rank, 1..n, contiguous. See the header. */
  readonly order: number;
  readonly tone: Tone;
  /** Where tone alone would carry the meaning for a sighted viewer. */
  readonly a11y?: string;
}

export interface Taxonomy {
  readonly id: TaxonomyId;
  readonly name: string;
  /** What the vocabulary governs. Prose, from the canon. */
  readonly appliesTo: string;
  /** Why it exists as its own vocabulary rather than a field enum. */
  readonly why: string;
  readonly values: readonly TaxonomyValue[];
}

const V = (value: string, meaning: string, order: number, tone: Tone, a11y?: string): TaxonomyValue =>
  a11y ? { value, meaning, order, tone, a11y } : { value, meaning, order, tone };

export const TAXONOMIES: Record<TaxonomyId, Taxonomy> = {
  /* ── Object classification ─────────────────────────────────────── */
  domain_role: {
    id: "domain_role",
    name: "Domain Role",
    appliesTo: "IA surfaces and L2 objects",
    why:
      "The CLASS axis, not the shelf. `Domain` in business-objects.ts says which of Space, Capital, " +
      "Time or Governance an object sits under; this says what KIND of thing it is within the model. " +
      "Both are needed and neither substitutes for the other.",
    values: [
      V("CONSTITUENT", "Space, Capital or Time — the three the vehicle holds", 1, "steel"),
      V("CONSTITUTIONAL", "The governance shell over the constituents", 2, "electric"),
      V("MANAGEMENT", "Project and Partners — how the vehicle is run", 3, "steel"),
      V("EVIDENCE", "Documents and Activity — what proves the rest", 4, "copper"),
      V("CROSS-CUTTING", "Global or shared across every vehicle", 5, "steel"),
    ],
  },

  /* ── The disclosure axis ───────────────────────────────────────── */
  disclosure_class: {
    id: "disclosure_class",
    name: "Disclosure Class",
    appliesTo: "All records",
    why:
      "How sensitive a RECORD is. This is a different axis from `Access` in routes.ts, which says who " +
      "may reach a SURFACE, and confusing the two is how a restricted figure ends up on a page whose " +
      "access class was correct. A public route can hold a restricted field; the route decides " +
      "reachability, this decides redaction.",
    values: [
      V("PUBLIC", "Approved for an anonymous visitor", 1, "confirm"),
      V("INVESTOR-CONFIDENTIAL", "Disclosed to a qualified investor", 2, "electric"),
      V("MEMBER-RESTRICTED", "An authenticated partner's own projection", 3, "electric"),
      V("INTERNAL", "GC and external mandate holders only", 4, "hazard"),
      V("RESTRICTED", "Sensitive financial, governance or personal data", 5, "hazard",
        "Restricted — sensitive financial, governance or personal data"),
      V("PRIVILEGED", "Legal, security or investigation material", 6, "copper",
        "Privileged — legal, security or investigation material"),
    ],
  },

  /* ── The command axis ──────────────────────────────────────────── */
  operation_class: {
    id: "operation_class",
    name: "Operation Class",
    appliesTo: "Commands",
    why:
      "The v5 Command Rights thesis in one field: 'manage' is never sufficient for a consequential " +
      "command. Splitting WRITE from APPROVE from EXECUTE is what makes separation of duties " +
      "expressible at all — SOD-01 and SOD-02 are unenforceable without it, because there is no way " +
      "to say that the identity who prepared a distribution may not also execute it.",
    values: [
      V("READ", "Retrieve. No state changes", 1, "steel"),
      V("WRITE", "Prepare or edit a draft", 2, "electric"),
      V("ATTEST", "Verify or accept evidence", 3, "copper"),
      V("APPROVE", "Exercise delegated or constitutional approval", 4, "hazard",
        "Approve — exercises constitutional authority"),
      V("EXECUTE", "Cause an external or state effect", 5, "hazard",
        "Execute — causes an irreversible effect"),
      V("PUBLISH", "Release into a disclosure aperture", 6, "hazard"),
    ],
  },

  /* ── What the surface is asking of the viewer ──────────────────── */
  attention_state: {
    id: "attention_state",
    name: "Attention State",
    appliesTo: "ATLAS, IRIS and the member home",
    why:
      "What a surface is asking of the person reading it. UX-12 puts intelligence before navigation, " +
      "which only works if the intelligence can say whether something needs reading, doing, or " +
      "deciding. Without this the home page is a list and the reader does the triage.",
    values: [
      V("INFORMATION", "No action. Stated because it is true", 1, "steel"),
      V("REVIEW", "Human awareness useful, nothing required", 2, "electric"),
      V("ACTION", "Action required, no authority needed", 3, "hazard"),
      V("DECISION", "Authority required — a named right must be exercised", 4, "hazard",
        "Decision — requires constitutional authority"),
      V("RISK", "A material exception is open", 5, "hazard",
        "Risk — a material exception is open"),
      /* The last critical in the global budget. See the header. */
      V("URGENT", "Immediate and time-sensitive", 6, "critical",
        "Urgent — immediate and time-sensitive"),
    ],
  },

  /* ── How much a claim is worth ─────────────────────────────────── */
  confidence: {
    id: "confidence",
    name: "Confidence",
    appliesTo: "AI output and any asserted claim",
    why:
      "Corroboration: how well-sourced a value is. lib/provenance.ts consumes this as its Confidence " +
      "type. Ordered weakest-last, so the weakest input to a derivation is the one with the highest " +
      "order — `derive()` depends on that direction.",
    values: [
      V("VERIFIED", "An authoritative direct source", 1, "confirm"),
      V("CORROBORATED", "Multiple consistent sources", 2, "confirm"),
      V("REPORTED", "A trusted party reported it", 3, "electric"),
      V("INFERRED", "Derived by the system or by an agent", 4, "copper",
        "Inferred — derived, not observed"),
      V("FORECAST", "A future estimate or model output", 5, "hazard",
        "Forecast — a modelled future value, not a fact"),
      V("UNKNOWN", "Insufficient evidence to classify", 6, "hazard",
        "Unknown — insufficient evidence"),
    ],
  },

  /* ── PR-01 ─────────────────────────────────────────────────────── */
  qualification_state: {
    id: "qualification_state",
    name: "Qualification State",
    appliesTo: "Investor",
    why:
      "PR-01 accreditation. Supersedes the four-value accreditation_state, which had no DECLINED — so " +
      "a refused applicant had no state to occupy and the decision could not be recorded at all.",
    values: [
      V("NOT_REQUESTED", "No process has started", 1, "steel"),
      V("REQUESTED", "Requested, not yet in review", 2, "electric"),
      V("UNDER_REVIEW", "With a human reviewer", 3, "electric"),
      V("VALID", "Approved, and within its validity window", 4, "confirm"),
      V("EXPIRED", "Validity has elapsed", 5, "hazard"),
      V("DECLINED", "Not approved", 6, "hazard", "Declined — the application was not approved"),
    ],
  },

  /* ── Project control ───────────────────────────────────────────── */
  project_control_state: {
    id: "project_control_state",
    name: "Project Control State",
    appliesTo: "Project baselines, changes and certifications",
    why:
      "FIX-05: budget and timeline had no approved-baseline semantics, so variance referenced nothing. " +
      "Every variance now references a baseline VERSION in a stated control state.",
    values: [
      V("DRAFT", "Not approved", 1, "steel"),
      V("EFFECTIVE", "The approved baseline", 2, "confirm"),
      V("PENDING_CHANGE", "A change is proposed against it", 3, "electric"),
      V("AT_RISK", "Variance threatens the approved outcome", 4, "hazard",
        "At risk — variance threatens the approved outcome"),
      /* Hazard rather than critical: the global budget held exactly one
         and URGENT needed it more. "Cannot proceed" demands attention;
         it is not the thing you wake somebody for. */
      V("BLOCKED", "Cannot proceed", 5, "hazard", "Blocked — cannot proceed"),
      V("COMPLETE", "Accepted as complete", 6, "confirm"),
    ],
  },

  /* ── Evidence lifecycle ────────────────────────────────────────── */
  evidence_state: {
    id: "evidence_state",
    name: "Evidence State",
    appliesTo: "Every document and evidence artifact",
    why:
      "FIX-09: Documents and Activity risked becoming page-owned stores. One canonical artifact moves " +
      "through these states and the pages are projections of it. Note SUPERSEDED rather than deleted — " +
      "evidence is replaced by a later version, never removed.",
    values: [
      V("RECEIVED", "The artifact arrived", 1, "steel"),
      V("CLASSIFIED", "Type and sensitivity are set", 2, "electric"),
      V("VERIFIED", "The source has been accepted", 3, "confirm"),
      V("EFFECTIVE", "The current authoritative version", 4, "confirm"),
      V("SUPERSEDED", "Replaced by a later valid version", 5, "steel",
        "Superseded — replaced by a later version, not deleted"),
      V("ARCHIVED", "Retained as history", 6, "steel"),
    ],
  },
};

/* ── The two the code consumes directly ──────────────────────────── */

export type DisclosureClass =
  | "PUBLIC" | "INVESTOR-CONFIDENTIAL" | "MEMBER-RESTRICTED"
  | "INTERNAL" | "RESTRICTED" | "PRIVILEGED";

export type OperationClass = "READ" | "WRITE" | "ATTEST" | "APPROVE" | "EXECUTE" | "PUBLISH";

export type ConfidenceClass =
  | "VERIFIED" | "CORROBORATED" | "REPORTED" | "INFERRED" | "FORECAST" | "UNKNOWN";

const rank = (id: TaxonomyId): Record<string, number> =>
  Object.fromEntries(TAXONOMIES[id].values.map((v) => [v.value, v.order]));

/** Sensitivity rank. Higher is more closed. */
export const DISCLOSURE_RANK = rank("disclosure_class") as Record<DisclosureClass, number>;

/** Escalation rank. Higher causes more. */
export const OPERATION_RANK = rank("operation_class") as Record<OperationClass, number>;

/** Corroboration rank. Higher is WEAKER — see `confidence` above. */
export const CONFIDENCE_RANK = rank("confidence") as Record<ConfidenceClass, number>;

/**
 * Is `a` at least as restricted as `b`?
 *
 * The question a projection asks before it renders a field: may this
 * aperture, cleared to `b`, be shown something classified `a`? It may not
 * if `a` is more closed.
 */
export const atLeastAsClosed = (a: DisclosureClass, b: DisclosureClass): boolean =>
  DISCLOSURE_RANK[a] >= DISCLOSURE_RANK[b];

/**
 * The weakest of a set of confidence classes.
 *
 * A derived value can be no better sourced than its worst input, which is
 * the rule `derive()` in lib/provenance.ts enforces.
 */
export function weakestConfidence(cs: readonly ConfidenceClass[]): ConfidenceClass {
  if (cs.length === 0) return "UNKNOWN";
  return cs.reduce((worst, c) => (CONFIDENCE_RANK[c] > CONFIDENCE_RANK[worst] ? c : worst));
}

/** Does this command class cause an effect that cannot be taken back? */
export const isConsequential = (c: OperationClass): boolean =>
  OPERATION_RANK[c] >= OPERATION_RANK.APPROVE;

export const taxonomyValues = (id: TaxonomyId): readonly string[] =>
  TAXONOMIES[id].values.map((v) => v.value);

export const ALL_TAXONOMIES = Object.values(TAXONOMIES);

export const TAXONOMY_LAWS = {
  ownAxis:
    "Disclosure Class is how sensitive a record is. Access is who may reach a surface. A public route " +
    "can hold a restricted field, and conflating the two puts a restricted figure on a page whose " +
    "access class was entirely correct.",
  operationClassEnablesSoD:
    "Separation of duties cannot be stated without an operation class. 'May manage distributions' " +
    "cannot express that the identity who prepared one may not execute it; PREPARE / APPROVE / " +
    "EXECUTE can.",
  orderIsSemantic:
    "Order is a rank, not a display sequence. Reordering a value silently changes a permission or a " +
    "redaction decision, so the linter refuses a gap or a duplicate.",
  oneToneBudget:
    "The critical-tone ceiling is global. A second allowance per registry would defeat the reason " +
    "there is a ceiling: a product where everything is red says nothing.",
} as const;
