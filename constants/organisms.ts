/**
 * ORGANISMS — composite interface modules
 *
 * Wave 6 · Composite Surface
 * Authority: GC.SYSTEM Tier 04 · L1-01 §29
 *
 * ── WHAT AN ORGANISM DECLARES ────────────────────────────────────────
 * Which fields, in what order, at what information level, in which metric
 * kind. Declared as data so the ordering can be reviewed and linted rather
 * than discovered by reading JSX.
 *
 * ── FIELD ORDER IS THE DESIGN ────────────────────────────────────────
 * On a dense financial screen, order is what a reader actually uses. The
 * first field is what they look for; the last is what they scroll past.
 * Getting it wrong is not a styling problem — it is the difference between
 * a card that answers a question and one that has to be read.
 *
 * IL levels do the rest: IL-1 for the decision, IL-6 for the audit trail.
 * A card where everything is IL-2 has no hierarchy and reads as noise.
 */

import type { MetricKind } from "../lib/metric-grammar";

export type ILLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface OrganismField {
  /** UFR id where the value comes from, or a derived name. */
  source: string;
  label: string;
  il: ILLevel;
  /** Present when the field renders a number. */
  metric?: MetricKind;
  /** Present when the field renders an enum. Keyed Object.field. */
  enumKey?: string;
  /** Shown in compact and audit density. Everything else is hidden there. */
  dense: boolean;
}

export interface Organism {
  id: string;
  name: string;
  purpose: string;
  /** The one question this answers at a glance. */
  answers: string;
  fields: readonly OrganismField[];
  /** Actions offered, if any. */
  actions?: readonly string[];
  notes?: string;
}

const F = (
  source: string, label: string, il: ILLevel, dense: boolean,
  extra: { metric?: MetricKind; enumKey?: string } = {},
): OrganismField => ({ source, label, il, dense, ...extra });

export const ORGANISMS: readonly Organism[] = [
  {
    id: "O-01",
    name: "Property Card",
    purpose: "Summarise one Property in a portfolio list.",
    answers: "Is this asset healthy, and where is it in its life?",
    fields: [
      F("UFR-0060", "Property", 2, true),
      F("UFR-0066", "Lifecycle", 3, true, { enumKey: "Property.lifecycle_state" }),
      F("UFR-0102", "Latest valuation", 2, true, { metric: "currency" }),
      F("UFR-0103", "Valuation source", 5, false, { enumKey: "Valuation.source" }),
      F("UFR-0101", "Valued on", 5, false),
      F("UFR-0063", "Jurisdiction", 4, false),
      F("UFR-0065", "Land area", 4, false, { metric: "count" }),
      F("UFR-0061", "Vehicle", 4, true),
      F("UFR-0067", "Stabilised", 5, false),
    ],
    actions: ["Open", "View thesis"],
    notes:
      "Valuation SOURCE sits directly under the figure, never elsewhere. A number whose " +
      "provenance is a scroll away is a number that will be read as independent when it is not.",
  },
  {
    id: "O-02",
    name: "Position Card",
    purpose: "One holder's stake in one vehicle.",
    answers: "What do I own here, and what does it carry?",
    fields: [
      F("UFR-0241", "Vehicle", 2, true),
      F("UFR-0242", "Units held", 2, true, { metric: "count" }),
      F("UFR-0243", "Voting rights", 3, true, { metric: "percentage" }),
      F("UFR-0244", "Class", 4, false),
      F("UFR-0161", "Member state", 5, false, { enumKey: "Investor.member_state" }),
    ],
    notes:
      "Voting rights are shown as a percentage beside units, because equity-weighted voting " +
      "is not obvious from a unit count alone and members routinely assume one-vote-per-holder.",
  },
  {
    id: "O-03",
    name: "Waterfall Bar",
    purpose: "One distribution run, all six stages.",
    answers: "Where did the money go, and what did not get paid?",
    fields: [
      F("UFR-0264", "Revenue Base", 2, true, { metric: "currency" }),
      F("UFR-0261", "Stage", 3, true, { enumKey: "Distribution.waterfall_stage" }),
      F("UFR-0262", "Amount", 2, true, { metric: "currency" }),
      F("derived.shortfall", "Shortfall", 3, true, { metric: "loss" }),
      F("UFR-0263", "Executed", 5, false),
    ],
    notes:
      "A shortfall renders as LOSS, not as a negative currency. It is a realised failure to " +
      "pay a stage, and the rarest colour is the correct one. Stages that received nothing " +
      "are shown, never omitted — an absent row reads as a stage that did not exist.",
  },
  {
    id: "O-04",
    name: "Reserve Gauge",
    purpose: "Reserve balance against its floor.",
    answers: "Are we above the floor, and by how much?",
    fields: [
      F("UFR-0025", "Reserve balance", 2, true, { metric: "currency" }),
      F("UFR-0024", "Reserve floor", 3, true, { metric: "currency" }),
      F("UFR-0385", "Coverage", 1, true, { metric: "percentage" }),
      F("derived.band", "Band", 2, true),
    ],
    notes:
      "Coverage is IL-1 — the highest level in the system — because it is the single figure " +
      "that decides whether a distribution runs. The floor is shown beside it so the ratio " +
      "is never taken on trust.",
  },
  {
    id: "O-05",
    name: "Performance Summary",
    purpose: "Vehicle performance for a period.",
    answers: "What did this return, and how much of that is measured rather than modelled?",
    fields: [
      F("UFR-0382", "IRR", 1, true, { metric: "percentage" }),
      F("UFR-0383", "MOIC", 2, true, { metric: "ratio" }),
      F("UFR-0384", "NAV", 2, true, { metric: "currency" }),
      F("UFR-0385", "Reserve coverage", 3, true, { metric: "percentage" }),
      F("derived.navMissing", "Properties without independent valuation", 4, false, { metric: "count" }),
      F("UFR-0381", "Period end", 5, true),
      F("derived.convention", "Formula", 6, false),
    ],
    notes:
      "The count of properties lacking an independent valuation is shown on the same card as " +
      "NAV. A NAV that silently excludes assets is worse than one that says so.",
  },
  {
    id: "O-06",
    name: "Resolution Card",
    purpose: "One governance decision, published.",
    answers: "What was decided, on what basis, and who took part?",
    fields: [
      F("UFR-0300", "Matter", 1, true),
      F("UFR-0305", "Outcome", 1, true, { enumKey: "Resolution.outcome" }),
      F("UFR-0301", "Threshold", 3, true, { enumKey: "Resolution.resolution_type" }),
      F("UFR-0302", "For", 2, true, { metric: "percentage" }),
      F("UFR-0303", "Against", 2, true, { metric: "percentage" }),
      F("UFR-0304", "Present", 3, true, { metric: "percentage" }),
      F("UFR-0306", "Rationale", 3, false),
      F("derived.options", "Options considered", 4, false),
      F("derived.conflicts", "Conflicts disclosed", 4, false),
    ],
    notes:
      "Aggregates only. There is no field here, and no field anywhere, that maps a holder to " +
      "a ballot (I-05). Options considered and conflicts disclosed are present because I-06 " +
      "asks for the basis of a decision, not only its result.",
  },
  {
    id: "O-07",
    name: "Process Timeline",
    purpose: "A multi-step process and where it has reached.",
    answers: "What is done, what is next, and what has gone stale?",
    fields: [
      F("derived.processId", "Process", 3, true),
      F("derived.currentStep", "Current step", 1, true),
      F("derived.completed", "Steps complete", 2, true, { metric: "count" }),
      F("derived.expiring", "Expiring soon", 2, false),
      F("derived.pointOfNoReturn", "Point of no return", 3, false),
      F("derived.resumable", "Resumable", 5, false),
    ],
    notes:
      "The point of no return is shown BEFORE the reader reaches it. An interface that reveals " +
      "irreversibility afterwards has told them something they can no longer act on.",
  },
  {
    id: "O-08",
    name: "Ledger Row",
    purpose: "One posting in the append-only ledger.",
    answers: "What moved, when, on whose instruction, and was it corrected?",
    fields: [
      F("derived.postedAt", "Posted", 4, true),
      F("derived.account", "Account", 3, true),
      F("derived.amount", "Amount", 2, true, { metric: "currency" }),
      F("derived.narrative", "Narrative", 3, true),
      F("derived.postedBy", "Posted by", 5, true),
      F("derived.reverses", "Reverses", 5, false),
      F("derived.entryId", "Entry", 6, false),
    ],
    notes:
      "A reversed entry stays visible with its reversal linked. Hiding it would make the ledger " +
      "read correctly and the history read falsely.",
  },
  {
    id: "O-09",
    name: "Risk Register Row",
    purpose: "One risk on a vehicle's register.",
    answers: "What could go wrong, how likely, how bad?",
    fields: [
      F("UFR-0440", "Category", 2, true, { enumKey: "Risk.risk_category" }),
      F("UFR-0441", "Likelihood", 3, true, { enumKey: "Risk.likelihood" }),
      F("UFR-0442", "Impact", 3, true, { enumKey: "Risk.impact" }),
      F("UFR-0443", "Vehicle", 4, false),
    ],
    notes:
      "Category colour comes from RISK_COLOUR — all ten registry categories are distinct as of " +
      "31 Jul 2026. Before that six rendered grey, which made the register unscannable.",
  },
  {
    id: "O-10",
    name: "Confidence Tag",
    purpose: "The provenance class of a single value.",
    answers: "How much can I trust this number?",
    fields: [
      F("derived.confidence", "Class", 5, true),
      F("derived.source", "Source", 6, false),
      F("derived.observedAt", "Observed", 6, false),
      F("derived.age", "Age", 6, false),
    ],
    notes:
      "IL-5 and IL-6 deliberately — a confidence tag must never outrank the figure it qualifies. " +
      "It is there to be checked, not read first.",
  },
];

// ─────────────────────────────────────────────────────────────────────

export const organismById = (id: string): Organism | undefined =>
  ORGANISMS.find((o) => o.id === id);

/** Fields kept in compact and audit density. */
export const denseFields = (o: Organism): OrganismField[] => o.fields.filter((f) => f.dense);

/**
 * Density row heights, from Addendum A. Every organism must render in all
 * four without a layout break — which in practice means no organism may
 * depend on more than its dense fields to remain intelligible.
 */
export const DENSITY_MODES = ["compact", "comfortable", "audit", "presentation"] as const;
export type DensityMode = (typeof DENSITY_MODES)[number];

/**
 * An organism is intelligible in compact density only if its dense fields
 * still answer the question it exists to answer. The test for that is
 * crude but useful: the highest-priority field must survive.
 */
export function survivesCompact(o: Organism): boolean {
  const dense = denseFields(o);
  if (dense.length === 0) return false;
  const bestIl = Math.min(...o.fields.map((f) => f.il));
  return dense.some((f) => f.il === bestIl);
}
