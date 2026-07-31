/**
 * LAYOUT — grid, breakpoints, surface strategy, elevation
 *
 * Wave 6.5 · Bridge Document (31 Jul 2026)
 * Authority: GC-Bridge-Document Gaps 2, 5 and Part 3
 *
 * ── THE RULE THAT DECIDES EVERY SCREEN ───────────────────────────────
 * "If the route starts with (capital) or (admin), design desktop-first;
 *  otherwise design phone-parity."
 *
 * A single blanket answer would have misdesigned one of two products. A
 * capital allocation terminal assumes a wide screen and a practised
 * operator. A member checking whether they were paid, or casting a ballot,
 * must never require a desktop — that is a governance right reached through
 * a device, and the device is usually a phone.
 */

export type Breakpoint = "compact" | "medium" | "wide" | "ultra";

export interface BreakpointSpec {
  minWidth: number;
  columns: number;
  /** px */
  gutter: number;
  /** px, or "auto" where the container centres within a max width */
  margin: number | "auto";
  note: string;
}

export const BREAKPOINTS: Record<Breakpoint, BreakpointSpec> = {
  compact: { minWidth: 0,    columns: 4,  gutter: 16, margin: 16,
             note: "Phone. Tables become stacked cards." },
  medium:  { minWidth: 768,  columns: 8,  gutter: 24, margin: 32,
             note: "Tablet." },
  wide:    { minWidth: 1180, columns: 12, gutter: 24, margin: 48,
             note: "Default desktop." },
  ultra:   { minWidth: 1680, columns: 12, gutter: 32, margin: "auto",
             note: "Trading-desk width. Container centres at max width." },
};

export const MAX_CONTENT_WIDTH = 1600;

/**
 * A financial table never runs edge-to-edge.
 *
 * FB-1 already bars full-bleed wherever numeric data is being read; this
 * states the same rule from the layout side so it is enforceable here too.
 */
export const FULL_WIDTH_TABLES_PERMITTED = false;

// ─────────────────────────────────────────────────────────────────────
// Surface strategy
// ─────────────────────────────────────────────────────────────────────

export type RouteGroup = "gateway" | "space" | "capital" | "time" | "member" | "admin";
export type SurfaceStrategy = "desktop-first" | "phone-parity";

/**
 * Desktop-first groups assume Wide/Ultra and degrade to stacked cards at
 * Compact. They are not optimised there and are not expected to be.
 *
 * Phone-parity groups are designed first-class at Compact.
 */
export const SURFACE_STRATEGY: Record<RouteGroup, SurfaceStrategy> = {
  capital: "desktop-first",
  admin: "desktop-first",
  space: "desktop-first",
  member: "phone-parity",
  gateway: "phone-parity",
  time: "phone-parity",
};

/**
 * `time` is phone-parity, which the Bridge Document did not name explicitly.
 *
 * Reasoning: the (time) group holds entitlement calendars and horizon views
 * — a member checking which nights they hold. That is the same class of act
 * as checking whether they were paid, and it fails the same way if it needs
 * a desktop. The two named desktop-first groups are both operator surfaces;
 * (time) is not one.
 */
export const TIME_GROUP_RATIONALE =
  "Entitlement views are a member act, not an operator act, so (time) follows (member).";

export const strategyFor = (group: RouteGroup): SurfaceStrategy => SURFACE_STRATEGY[group];

export const isDesktopFirst = (group: RouteGroup): boolean =>
  SURFACE_STRATEGY[group] === "desktop-first";

// ─────────────────────────────────────────────────────────────────────
// Elevation
// ─────────────────────────────────────────────────────────────────────

/**
 * Depth comes from z-index and backdrop blur. Never from a shadow.
 *
 * A panel lifts by ONE step of background — void to voidPanel, paper to
 * paperPanel. That is the whole elevation system, and it is deliberately
 * shallow: a system with five shadow levels ends up using four of them
 * arbitrarily.
 */
export const ELEVATION = {
  method: "background-step + z-index + backdrop-blur",
  shadowsPermitted: false,
  steps: [
    { level: 0, surface: "ground", note: "void / paper" },
    { level: 1, surface: "panel", note: "voidPanel / paperPanel. One step, no more." },
  ],
  overlayBackdrop: "dim 55% + blur 10px",
} as const;

// ─────────────────────────────────────────────────────────────────────
// Mode switching
// ─────────────────────────────────────────────────────────────────────

export const MODE_SWITCHING = {
  default: "Follows the operating system preference.",
  override: "Manual toggle in the HUD Rail. Persists per identity across sessions.",
  terminal: "Admin only. Never auto-selected, never offered to a Member.",
} as const;

/**
 * Terminal mode finally has a purpose.
 *
 * It had a colour pair (#05100A ground, #39FF6A matrix) and no home. It is
 * the Admin Ops and Audit console: raw telemetry, the immutable ledger
 * feed, and the audit trail behind any figure someone drills into.
 *
 * The constraint matters more than the permission: the moment an admin
 * needs to EDIT rather than OBSERVE, the screen drops back to Concrete or
 * Obsidian. Terminal is a reading mode. Data entry in matrix green on near
 * black is how mistakes get made.
 */
export const TERMINAL_MODE = {
  purpose: "Admin Ops and Audit console",
  shows: ["system telemetry", "immutable ledger feed", "provenance drill-down"],
  neverUsedFor: "data entry",
  onEdit: "Drops back to Concrete or Obsidian.",
  memberFacing: false,
} as const;

export const LAYOUT_CSS_VARS = `
:root {
  --gc-max-width: ${MAX_CONTENT_WIDTH}px;
${(Object.entries(BREAKPOINTS) as [Breakpoint, BreakpointSpec][])
  .map(([k, b]) => [
    `  --gc-bp-${k}: ${b.minWidth}px;`,
    `  --gc-cols-${k}: ${b.columns};`,
    `  --gc-gutter-${k}: ${b.gutter}px;`,
  ].join("\n"))
  .join("\n")}
}
`;
