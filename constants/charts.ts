/**
 * CHARTS — data visualisation
 *
 * Wave 6.5 · Bridge Document (31 Jul 2026)
 * Authority: GC-Bridge-Document Gap 6 · L1-01 §29 Metric Grammar
 *
 * ── SERIES COLOURS COME FROM THE METRIC GRAMMAR ──────────────────────
 * There is no chart palette. A series is coloured by WHAT IT MEASURES,
 * exactly as a figure in a table is. Introducing a separate palette would
 * mean the same quantity is copper in a table and blue in a chart beside
 * it, and the reader has to relearn the system per component.
 *
 * ── THE TRUNCATED AXIS BAN ───────────────────────────────────────────
 * A y-axis that does not start at zero makes a 2% move look like a
 * collapse. On financial data that is not a styling choice, it is a
 * misrepresentation, and it is barred.
 */

import type { MetricKind } from "../lib/metric-grammar";

export type ChartKind =
  | "waterfall" | "nav-over-time" | "irr-curve"
  | "allocation" | "reserve-gauge" | "sparkline";

export interface ChartSpec {
  kind: ChartKind;
  name: string;
  for: string;
  metrics: readonly MetricKind[];
  notes?: string;
}

export const CHARTS: readonly ChartSpec[] = [
  { kind: "waterfall", name: "Waterfall Bar", for: "The six distribution stages",
    metrics: ["currency", "loss"],
    notes: "Stages receiving nothing are shown at zero height with a label, never omitted. " +
           "A missing bar reads as a stage that does not exist." },
  { kind: "nav-over-time", name: "NAV Over Time", for: "Valuation history per property or vehicle",
    metrics: ["currency", "forecast"],
    notes: "Independent valuations are points; the line between them is interpolation and is " +
           "drawn dashed, because no valuation exists between two valuations." },
  { kind: "irr-curve", name: "IRR Curve", for: "Cash flows and return",
    metrics: ["percentage", "forecast"],
    notes: "Outflows below the axis, inflows above. Period 0 is the first outflow." },
  { kind: "allocation", name: "Allocation Bar", for: "Capital table by holder",
    metrics: ["percentage"],
    notes: "Horizontal stacked bar, not a pie. A pie cannot show a 10% concentration ceiling " +
           "being approached; a bar with a rule at 10% can." },
  { kind: "reserve-gauge", name: "Reserve Gauge", for: "Balance against floor",
    metrics: ["percentage"],
    notes: "Four bands from the constitutional thresholds: 120+, 110-119, 100-109, below 100. " +
           "The floor line is always drawn, never implied." },
  { kind: "sparkline", name: "Sparkline", for: "Inline trend in a table row",
    metrics: ["currency", "percentage", "ratio"],
    notes: "No axes, no labels. It shows direction, not value — the value is in the cell beside it." },
];

/**
 * Rules, as data so tests and the design reference read one source.
 */
export const CHART_RULES = {
  noDecoration: "No 3D, no gradients, no drop shadows. Consistent with §29.",
  axes: "Axis lines are hairlines. Gridlines only where a value must be read off the chart.",
  seriesColour: "From METRIC_COLOUR. There is no chart palette.",
  forecastDistinction:
    "A forecast segment is dashed AND electric. Never colour alone — a projection has to " +
    "survive being printed in black and white.",
  zeroBaseline:
    "Zero baseline always shown. A truncated y-axis on financial data makes a 2% move look " +
    "like a collapse, and is barred.",
  animation:
    "600ms ease-cinema on FIRST PAINT ONLY. Never on re-render — a figure that moves when " +
    "data refreshes is unreadable.",
} as const;

export const TRUNCATED_AXIS_PERMITTED = false;
export const CHART_PALETTE_EXISTS = false;

/** Animation is entrance only. */
export const CHART_ANIMATION = {
  onFirstPaint: { duration: "600ms", curve: "ease-cinema" },
  onReRender: null,
  reducedMotion: "No entrance animation. The chart is simply present.",
} as const;

/**
 * A chart's accessible fallback is the table it was drawn from.
 *
 * Not alt text describing the shape — the actual figures. A screen-reader
 * listener needs the numbers, not a description of a line going up.
 */
export const CHART_ACCESSIBILITY = {
  fallback: "The source table, marked up and reachable.",
  altTextDescribesShape: false,
  rationale: "A listener needs the figures, not a description of a line going up.",
} as const;

export const chartFor = (kind: ChartKind): ChartSpec | undefined =>
  CHARTS.find((c) => c.kind === kind);
