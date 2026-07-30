/**
 * L3 RELATIONSHIP MODEL — the enterprise graph
 *
 * Wave 2 · Semantic Core
 * Authority: L1-01 §33 · invariant E-05
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * E-05: "No orphan object; no undeclared relationship."
 *
 * Two halves, and both matter:
 *
 *   NO ORPHAN — every object except a declared root has a path to a root.
 *   An object floating with no edges cannot be reached, cannot be
 *   authorised against, and cannot be reasoned about. Building this model
 *   found five: Benchmark, Forecast, Risk, MarketIntelligence and Research
 *   had no edges in either direction. Three were given anchors; two were
 *   ruled legitimate roots.
 *
 *   NO UNDECLARED RELATIONSHIP — an edge exists only if it appears below.
 *   A foreign key nobody declared is a relationship nobody governs.
 *
 * ── ROOTS ────────────────────────────────────────────────────────────
 * A root is an object that legitimately needs no parent. Roots are
 * DECLARED, never inferred — otherwise "I forgot the parent reference"
 * and "this is a root" are indistinguishable, which is exactly how
 * orphans survive review.
 */

import { BusinessObjectType as BO } from "./business-objects";

export type Cardinality = "one-to-one" | "one-to-many" | "many-to-one";

/**
 * What happens to the child when the parent is removed.
 *
 * Note that most of the enterprise is append-only, so `cascade` is rare
 * and `restrict` is the norm: you cannot delete a Vehicle that holds
 * Property, because the Property record is the asset's history.
 */
export type OnParentDelete =
  | "restrict" // refuse the delete while children exist
  | "cascade" // remove children too — only where the child is meaningless alone
  | "orphan-forbidden"; // parent is immutable and cannot be deleted at all

export interface Relationship {
  id: string;
  /** The object holding the reference field (the child). */
  from: BO;
  /** The object pointed at (the parent). */
  to: BO;
  /** The UFR id of the field implementing this edge. */
  via: string;
  cardinality: Cardinality;
  required: boolean;
  onParentDelete: OnParentDelete;
  /** Why this edge exists. Not decoration — it is what review reads. */
  rationale: string;
}

/**
 * DECLARED ROOTS — objects that need no parent.
 *
 * Organization is the enterprise root; everything ultimately reaches it.
 * Investor is a root because a legal person exists independently of this
 * platform and predates any relationship with it.
 * MarketIntelligence and Research are enterprise-level knowledge: they
 * describe the world, not a holding, and attaching them to a vehicle
 * would falsely imply the knowledge is owned by that vehicle.
 */
export const ROOT_OBJECTS: readonly BO[] = [
  BO.Organization,
  BO.Investor,
  BO.MarketIntelligence,
  BO.Research,
] as const;

const R = (r: Relationship) => r;

export const RELATIONSHIPS: Relationship[] = [
  // ── Enterprise spine ──────────────────────────────────────────────
  R({ id: "REL-001", from: BO.InvestmentVehicle, to: BO.Organization, via: "UFR-0022",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "Every vehicle is governed by exactly one Organization. This is the edge that makes Organization the enterprise root." }),
  R({ id: "REL-002", from: BO.Portfolio, to: BO.Organization, via: "UFR-0043",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "A Portfolio is a curatorial construct of the enterprise. Added in Wave 2 — the Portfolio was previously unanchored." }),
  R({ id: "REL-003", from: BO.Committee, to: BO.Organization, via: "UFR-0342",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "Governance bodies belong to the entity they govern. Anchors the governance subgraph to the enterprise root." }),

  // ── Assets ────────────────────────────────────────────────────────
  R({ id: "REL-010", from: BO.Property, to: BO.InvestmentVehicle, via: "UFR-0061",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "F-01 and A-02: economic ownership exists only through a legal wrapper. A Property with no Vehicle has no owner of record." }),
  R({ id: "REL-011", from: BO.Property, to: BO.Portfolio, via: "UFR-0062",
      cardinality: "many-to-one", required: false, onParentDelete: "restrict",
      rationale: "Portfolio membership is curatorial and optional. A Property is legally whole without one." }),
  R({ id: "REL-012", from: BO.Acquisition, to: BO.Property, via: "UFR-0080",
      cardinality: "one-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "A-04: the acquisition record is the terms on which the asset entered the portfolio. It outlives any later state." }),
  R({ id: "REL-013", from: BO.Acquisition, to: BO.InvestmentThesis, via: "UFR-0083",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "No Property enters the portfolio without a thesis. The link is what makes the thesis auditable against outcome." }),
  R({ id: "REL-014", from: BO.Valuation, to: BO.Property, via: "UFR-0100",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "A-03: valuations are dated snapshots and accumulate. The series is the asset's price history." }),
  R({ id: "REL-015", from: BO.Disposition, to: BO.Property, via: "UFR-0120",
      cardinality: "one-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "Exit terms are permanent record, retained after the asset leaves the portfolio." }),
  R({ id: "REL-016", from: BO.InvestmentThesis, to: BO.Property, via: "UFR-0484",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "A thesis concerns a specific candidate Property, written while it is in prospecting state — before Acquisition exists to reference it." }),
  R({ id: "REL-017", from: BO.DueDiligence, to: BO.Property, via: "UFR-0460",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "Diligence findings are evidence for an approval decision and must remain retrievable after it." }),

  // ── Capital chain ─────────────────────────────────────────────────
  R({ id: "REL-020", from: BO.InvestmentOffering, to: BO.InvestmentVehicle, via: "UFR-0141",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "An offering raises capital into exactly one vehicle." }),
  R({ id: "REL-021", from: BO.Commitment, to: BO.Investor, via: "UFR-0180",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "The binding promise attaches to an identity. Deleting the identity would erase the obligation." }),
  R({ id: "REL-022", from: BO.Commitment, to: BO.InvestmentOffering, via: "UFR-0181",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "A commitment is made into a specific offering on that offering's disclosed terms." }),
  R({ id: "REL-023", from: BO.CapitalCall, to: BO.InvestmentVehicle, via: "UFR-0200",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "F-16: the call's purpose is tested against the vehicle's lifecycle state, so the edge must exist to evaluate the gate." }),
  R({ id: "REL-024", from: BO.Investment, to: BO.Commitment, via: "UFR-0220",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "F-03: deployed capital draws against a commitment. The edge is how capital stays accounted across its five states." }),
  R({ id: "REL-025", from: BO.OwnershipPosition, to: BO.Investor, via: "UFR-0240",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "Ownership attaches to an identity. Also the edge that carries voting rights, which are equity-weighted." }),
  R({ id: "REL-026", from: BO.OwnershipPosition, to: BO.InvestmentVehicle, via: "UFR-0241",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "F-02: units held must sum to units issued per vehicle. Conservation is checked across this edge." }),
  R({ id: "REL-027", from: BO.Distribution, to: BO.InvestmentVehicle, via: "UFR-0260",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "F-05 and F-07: the waterfall runs per vehicle, and executed payouts are immutable history." }),

  // ── Governance ────────────────────────────────────────────────────
  R({ id: "REL-030", from: BO.Agreement, to: BO.Organization, via: "UFR-0281",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "I-07: whether an agreement is related-party is determined by who the counterparty is. The edge IS the test." }),
  R({ id: "REL-031", from: BO.Resolution, to: BO.Committee, via: "UFR-0307",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "I-02: authority is explicit. A resolution must name the body that passed it, or its authority cannot be checked." }),
  R({ id: "REL-032", from: BO.Resolution, to: BO.InvestmentVehicle, via: "UFR-0308",
      cardinality: "many-to-one", required: false, onParentDelete: "restrict",
      rationale: "Optional by design: policy approvals and constitutional amendments are enterprise-level and concern no single vehicle." }),
  R({ id: "REL-033", from: BO.Policy, to: BO.Resolution, via: "UFR-0322",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "Only the Board may approve policy. The edge to the approving resolution is the proof, and E-02 requires it." }),
  R({ id: "REL-034", from: BO.ComplianceEvent, to: BO.Committee, via: "UFR-0362",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "A constitutional failure declaration is only meaningful with its declaring authority attached (L1-01 §31)." }),

  // ── Performance ───────────────────────────────────────────────────
  R({ id: "REL-040", from: BO.PerformanceReport, to: BO.InvestmentVehicle, via: "UFR-0380",
      cardinality: "many-to-one", required: true, onParentDelete: "orphan-forbidden",
      rationale: "Reports are the investor-facing record and are retained beyond the vehicle's active life." }),
  R({ id: "REL-041", from: BO.Benchmark, to: BO.InvestmentVehicle, via: "UFR-0402",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "Added in Wave 2. A comparator with no subject is uninterpretable; Benchmark was previously isolated in the graph." }),
  R({ id: "REL-042", from: BO.Forecast, to: BO.InvestmentVehicle, via: "UFR-0422",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "Added in Wave 2. A projection detached from what it projects cannot be reconciled against outcome." }),
  R({ id: "REL-043", from: BO.Risk, to: BO.InvestmentVehicle, via: "UFR-0443",
      cardinality: "many-to-one", required: true, onParentDelete: "restrict",
      rationale: "Added in Wave 2. The risk register is per vehicle; an unattached entry cannot be escalated to anyone." }),
];

// ─────────────────────────────────────────────────────────────────────
// LOOKUPS
// ─────────────────────────────────────────────────────────────────────

export function isRoot(o: BO): boolean {
  return ROOT_OBJECTS.includes(o);
}

export function parentsOf(o: BO): Relationship[] {
  return RELATIONSHIPS.filter((r) => r.from === o);
}

export function childrenOf(o: BO): Relationship[] {
  return RELATIONSHIPS.filter((r) => r.to === o);
}

/** Objects that must exist before `o` can be created. */
export function requiredParentsOf(o: BO): BO[] {
  return parentsOf(o).filter((r) => r.required).map((r) => r.to);
}

/**
 * Creation order satisfying every required edge — a topological sort.
 * Returns null if a required-reference cycle exists, which would make the
 * objects in that cycle mutually uncreatable.
 */
export function creationOrder(all: BO[]): BO[] | null {
  const order: BO[] = [];
  const done = new Set<BO>();
  let remaining = [...all];
  while (remaining.length) {
    const ready = remaining.filter((o) =>
      requiredParentsOf(o).every((p) => done.has(p) || p === o),
    );
    if (ready.length === 0) return null; // cycle
    for (const o of ready) {
      order.push(o);
      done.add(o);
    }
    remaining = remaining.filter((o) => !done.has(o));
  }
  return order;
}
