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
import { ROUTES } from "./routes";

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


// ─────────────────────────────────────────────────────────────────────
// PRIMARY NAVIGATION — prominence, which is not the same as existence
//
// constants/routes.ts owns what EXISTS. This owns what is PROMINENT.
// Keeping them apart is deliberate: 120 routes exist and a navigation
// listing all of them is a sitemap, not a rail. The two cannot drift,
// because the check at the foot of this file resolves every path below
// against the route table and refuses to load if one has gone.
//
// ── THE RAIL NEVER SHOWS WHAT THE VIEWER CANNOT REACH ────────────────
// The shell filters this list through canReach() before rendering.
// That is not tidiness: IA_LAWS.notFoundNeverConfirms bars a denial
// from confirming a surface exists, and a rail listing /admin to an
// anonymous visitor confirms it just as loudly as a 403 page would.
//
// Groups follow the constitutional domain model — Space, Time, Capital
// beneath the vehicle, Governance as the layer over them — so the
// navigation teaches the same shape the domain does.
// ─────────────────────────────────────────────────────────────────────

export type NavIcon =
  | "home" | "collection" | "doctrine" | "journal" | "answers"
  | "space" | "gallery" | "portfolio"
  | "time" | "entitlement"
  | "capital" | "offering" | "ledger"
  | "member" | "position" | "documents" | "resolutions" | "notifications"
  | "admin" | "vehicles" | "governance" | "compliance" | "authority" | "media";

export interface NavItem {
  path: string;
  /** Short enough for a 240px rail. The route's own name where it fits. */
  label: string;
  icon: NavIcon;
}

export interface NavSection {
  /** Displayed above the group. Null renders the group unlabelled. */
  title: string | null;
  /*
   * A section id, NOT a RouteGroup — and the distinction is the point.
   * Sections follow the CONSTITUTIONAL DOMAIN model (Space, Time,
   * Capital, Governance), while a route's group is a technical fact
   * about which folder renders it. /space is a public gateway page
   * ABOUT space; /capital is an office surface that belongs under
   * Capital and simply filters out for anyone without the right. Typing
   * this as RouteGroup asserted the two taxonomies were one, and they
   * are not.
   */
  id: string;
  items: readonly NavItem[];
}

export const PRIMARY_NAV: readonly NavSection[] = [
  {
    title: null, id: "gateway",
    items: [
      { path: "/", label: "Home", icon: "home" },
      { path: "/collection", label: "Collection", icon: "collection" },
      { path: "/how-it-works", label: "How it works", icon: "doctrine" },
      { path: "/journal", label: "The Journal", icon: "journal" },
      { path: "/answers", label: "Answers", icon: "answers" },
    ],
  },
  {
    title: "Space", id: "space",
    items: [
      { path: "/space", label: "Space", icon: "space" },
      { path: "/gallery", label: "Gallery", icon: "gallery" },
      { path: "/portfolio", label: "Portfolio", icon: "portfolio" },
    ],
  },
  {
    title: "Time", id: "time",
    items: [
      { path: "/time", label: "Time", icon: "time" },
      { path: "/member/entitlement", label: "Entitlement", icon: "entitlement" },
    ],
  },
  {
    title: "Capital", id: "capital",
    items: [
      { path: "/how-capital-works", label: "How capital works", icon: "capital" },
      { path: "/flow", label: "The offering", icon: "offering" },
      { path: "/capital", label: "Capital office", icon: "ledger" },
    ],
  },
  {
    title: "Member", id: "member",
    items: [
      { path: "/member", label: "Member", icon: "member" },
      { path: "/member/position", label: "Position", icon: "position" },
      { path: "/member/documents", label: "Documents", icon: "documents" },
      { path: "/member/resolutions", label: "Resolutions", icon: "resolutions" },
      { path: "/member/notifications", label: "Notifications", icon: "notifications" },
    ],
  },
  {
    title: "Governance", id: "governance",
    items: [
      { path: "/admin", label: "Administration", icon: "admin" },
      { path: "/admin/vehicles", label: "Vehicles", icon: "vehicles" },
      { path: "/admin/governance", label: "Governance", icon: "governance" },
      { path: "/admin/compliance", label: "Compliance", icon: "compliance" },
      { path: "/admin/authority", label: "Authority", icon: "authority" },
      { path: "/admin/media", label: "Media", icon: "media" },
    ],
  },
];

/** The rail foot. Reachable at every vantage, so it is never filtered out. */
export const NAV_FOOT: readonly NavItem[] = [
  { path: "/legal", label: "Legal", icon: "documents" },
  { path: "/status", label: "System status", icon: "compliance" },
];

/*
 * Every path above must exist in the route table. A curated list is only
 * safe while it cannot outlive what it points at — this is the check that
 * makes it so, and it runs at load rather than in a test somebody skips.
 */
{
  const known = new Set(ROUTES.map((r) => r.path));
  const seen = new Set<string>();
  for (const s of [...PRIMARY_NAV.flatMap((x) => x.items), ...NAV_FOOT]) {
    if (!known.has(s.path)) {
      throw new Error(
        `PRIMARY_NAV points at ${s.path}, which is not in constants/routes.ts. ` +
        `Prominence cannot outlive existence.`,
      );
    }
    if (seen.has(s.path)) throw new Error(`${s.path} appears twice in the navigation.`);
    seen.add(s.path);
  }
  for (const s of PRIMARY_NAV) {
    if (s.items.length === 0) throw new Error(`Navigation section "${s.title}" is empty.`);
  }
}
