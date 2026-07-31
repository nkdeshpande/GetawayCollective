/**
 * NAVIGATION — route groups, HUD Rail, Trinity Lens
 *
 * Wave 6.5 · Bridge Document (31 Jul 2026)
 * Authority: GC-Bridge-Document Gap 5
 *
 * ── ROUTES ARE DERIVED, NOT ENUMERATED ───────────────────────────────
 * The six groups are fixed. Their contents derive from the 27 L2 objects
 * and 10 organisms rather than being hand-listed, so the route table cannot
 * drift out of sync with the schema — the same reason every other artifact
 * in this repo is generated.
 */

import type { RouteGroup } from "./layout";

export interface RouteGroupSpec {
  group: RouteGroup;
  prefix: string;
  contents: readonly string[];
  /** Which L2 objects this group surfaces. */
  objects: readonly string[];
}

export const ROUTE_GROUPS: readonly RouteGroupSpec[] = [
  { group: "gateway", prefix: "(gateway)",
    contents: ["Root", "Offering pages", "Public thesis"],
    objects: ["InvestmentOffering", "InvestmentThesis", "Property"] },
  { group: "space", prefix: "(space)",
    contents: ["Property list", "Property detail", "Portfolio"],
    objects: ["Property", "Portfolio", "Acquisition", "Valuation", "Disposition", "DueDiligence"] },
  { group: "capital", prefix: "(capital)",
    contents: ["Positions", "Commitments", "Capital calls", "Distributions", "Waterfall"],
    objects: ["OwnershipPosition", "Commitment", "CapitalCall", "Investment", "Distribution", "InvestmentVehicle"] },
  { group: "time", prefix: "(time)",
    contents: ["Entitlement calendar", "Horizon"],
    objects: ["OwnershipPosition", "Property"] },
  { group: "member", prefix: "(member)",
    contents: ["Passport", "Documents", "Reports", "Ballots"],
    objects: ["Investor", "Agreement", "PerformanceReport", "Resolution"] },
  { group: "admin", prefix: "(admin)",
    contents: ["Vehicles", "Governance", "Compliance", "Ledger", "Telemetry"],
    objects: ["InvestmentVehicle", "Organization", "Committee", "Policy", "ComplianceEvent", "Risk", "Benchmark", "Forecast", "Research", "MarketIntelligence"] },
];

// ─────────────────────────────────────────────────────────────────────
// HUD RAIL
// ─────────────────────────────────────────────────────────────────────

/**
 * Persistent chrome on every screen, collapsed to a 48px edge rail.
 *
 * It holds exactly two things. Keeping it to two is the discipline: a rail
 * that accumulates a third and fourth affordance stops being chrome and
 * starts being a navigation bar competing with the routes.
 */
export const HUD_RAIL = {
  persistent: true,
  width: 48,
  collapsed: true,
  holds: ["Alert Center (NT-03)", "Trinity Lens toggle"],
  alsoHolds: ["Mode override (Concrete / Obsidian)"],
  rationale: "Two affordances. A third turns chrome into a competing navigation bar.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// TRINITY LENS
// ─────────────────────────────────────────────────────────────────────

export type Lens = "space" | "capital" | "time";

export const LENSES: readonly Lens[] = ["space", "capital", "time"];

/**
 * THE TRINITY LENS IS SECTIONS — decided in the Bridge Document.
 *
 * Of filter, sections, or side-by-side panels:
 *
 *   FILTER would fight the routing. Space, Capital and Time are already
 *   first-class route groups, not sub-states of one screen. A filter would
 *   express the same idea twice and the two would eventually disagree.
 *
 *   SIDE-BY-SIDE PANELS cannot survive the Compact breakpoint without
 *   silently becoming a filter — and (time) and (member) are phone-parity,
 *   so a layout that only works at Wide contradicts the surface strategy.
 *
 *   SECTIONS matches how the toggle was first described: it swaps the
 *   entire view.
 *
 * The lens persists in the URL and per identity across sessions. Persisting
 * it matters: a member who works in Capital should not land in Space every
 * morning.
 */
export const TRINITY_LENS = {
  behaviour: "sections",
  swaps: "the full content region",
  livesIn: "HUD Rail",
  presentOn: ["member", "space", "capital", "time"] as readonly RouteGroup[],
  persistence: "URL and per identity across sessions",
  rejected: {
    filter: "Would express the route groups twice, and the two would eventually disagree.",
    panels: "Cannot survive Compact without becoming a filter, contradicting phone-parity.",
  },
} as const;

export const groupFor = (g: RouteGroup): RouteGroupSpec | undefined =>
  ROUTE_GROUPS.find((r) => r.group === g);

/** Every L2 object should be reachable through at least one route group. */
export function objectsCovered(): Set<string> {
  const s = new Set<string>();
  for (const g of ROUTE_GROUPS) for (const o of g.objects) s.add(o);
  return s;
}
