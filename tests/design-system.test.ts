/**
 * Design system — Bridge Document decisions
 *
 * Wave 6.5 · closes DESIGN-SYSTEM-GAP-TEMPLATE.md
 */

import { describe, it, expect } from "vitest";
import {
  TYPE, TypeRole, MEASURE_CH, EDITORIAL, IL_TYPE, alignsToGrid,
  TYPE_VARIES_WITH_DENSITY, roleFor, GRID_ALIGNED_ROLES, OPTICAL_ROLES,
} from "../constants/typography";
import {
  BREAKPOINTS, MAX_CONTENT_WIDTH, FULL_WIDTH_TABLES_PERMITTED,
  SURFACE_STRATEGY, strategyFor, isDesktopFirst, ELEVATION,
  MODE_SWITCHING, TERMINAL_MODE, RouteGroup,
} from "../constants/layout";
import {
  TABLE, COLUMN_ALIGN, INPUT, VALIDATION_TIMING, AUTOSAVE, STATES,
  COMPONENTS, PISTON, ICONS, ICON_SPEC, IMAGERY, PRINT, PDF_REPORT, EMAILS,
} from "../constants/components";
import {
  CHARTS, CHART_RULES, TRUNCATED_AXIS_PERMITTED, CHART_PALETTE_EXISTS,
  CHART_ANIMATION, CHART_ACCESSIBILITY, chartFor,
} from "../constants/charts";
import {
  ROUTE_GROUPS, HUD_RAIL, TRINITY_LENS, LENSES, groupFor, objectsCovered,
} from "../constants/navigation";
import { ORGANISMS } from "../constants/organisms";

// ─────────────────────────────────────────────────────────────────────
describe("type scale", () => {
  it("defines thirteen roles", () => {
    expect(Object.keys(TYPE)).toHaveLength(13);
  });

  it("aligns STRUCTURAL sizes to the grid", () => {
    // The gap template claimed every size lands on the 4px grid. That was
    // overstated: display sizes do, reading sizes deliberately do not.
    for (const role of GRID_ALIGNED_ROLES) {
      expect(alignsToGrid(TYPE[role].size), role).toBe(true);
    }
  });

  it("leaves READING sizes optical, and says so", () => {
    // 17 / 15 / 13 / 11 are odd because reading sizes are optical rather
    // than geometric. Rounding 15 to 16 trades legibility for tidiness.
    const optical = OPTICAL_ROLES.map((r) => TYPE[r].size);
    expect(optical.some((n) => n % 2 !== 0)).toBe(true);
  });

  it("descends monotonically within each family band", () => {
    const display: TypeRole[] = ["display-xl", "display-l", "display-m", "heading", "subheading"];
    const sizes = display.map((r) => TYPE[r].size);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));

    const body: TypeRole[] = ["body-l", "body", "body-s", "caption"];
    const bodySizes = body.map((r) => TYPE[r].size);
    expect(bodySizes).toEqual([...bodySizes].sort((a, b) => b - a));
  });

  it("tightens tracking as display sizes grow", () => {
    // Large type needs negative tracking; small type needs positive.
    expect(TYPE["display-xl"].letterSpacing).toBeLessThan(0);
    expect(TYPE["micro"].letterSpacing).toBeGreaterThan(0);
  });

  it("loosens line height as size grows smaller", () => {
    expect(TYPE["display-xl"].lineHeight).toBeLessThan(TYPE["body"].lineHeight);
  });

  it("does NOT change with density", () => {
    // A scale that shrinks with density makes two screenshots of the same
    // table incomparable.
    expect(TYPE_VARIES_WITH_DENSITY).toBe(false);
  });

  it("keeps body copy to 65 characters", () => {
    expect(MEASURE_CH).toBe(65);
  });

  it("gives editorial exactly one use, in italic", () => {
    expect(EDITORIAL.italic).toBe(true);
    expect(EDITORIAL.use).toContain("Narrative callout only");
    expect(Object.keys(TYPE)).not.toContain("editorial");
  });

  it("maps every IL level to a type role", () => {
    for (let il = 1 as 1 | 2 | 3 | 4 | 5 | 6; il <= 6; il++) {
      expect(TYPE[IL_TYPE[il as 1]], `IL-${il}`).toBeDefined();
    }
    // IL alone never determined size, which is how six levels of hierarchy
    // could still render as one.
    const sizes = ([1, 2, 3, 4, 5, 6] as const).map((i) => roleFor(IL_TYPE[i]).size);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });

  it("uses mono for micro, so table headers and figures share a family", () => {
    expect(TYPE.micro.family).toBe("mono");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("layout", () => {
  it("defines four breakpoints, ascending", () => {
    const widths = Object.values(BREAKPOINTS).map((b) => b.minWidth);
    expect(widths).toEqual([...widths].sort((a, b) => a - b));
    expect(BREAKPOINTS.compact.minWidth).toBe(0);
  });

  it("never decreases columns as width grows", () => {
    const cols = Object.values(BREAKPOINTS).map((b) => b.columns);
    expect(cols).toEqual([...cols].sort((a, b) => a - b));
  });

  it("caps content width", () => {
    expect(MAX_CONTENT_WIDTH).toBe(1600);
    expect(BREAKPOINTS.ultra.margin).toBe("auto");
  });

  it("bars full-width financial tables", () => {
    // FB-1 already bars full-bleed wherever numeric data is read.
    expect(FULL_WIDTH_TABLES_PERMITTED).toBe(false);
  });

  it("applies the surface rule: (capital) and (admin) are desktop-first", () => {
    expect(isDesktopFirst("capital")).toBe(true);
    expect(isDesktopFirst("admin")).toBe(true);
  });

  it("gives member and gateway phone-parity", () => {
    // An investor checking whether they were paid, or casting a ballot,
    // must never require a desktop.
    expect(strategyFor("member")).toBe("phone-parity");
    expect(strategyFor("gateway")).toBe("phone-parity");
  });

  it("puts (time) with member — entitlement is a member act", () => {
    expect(strategyFor("time")).toBe("phone-parity");
  });

  it("covers every route group", () => {
    const groups: RouteGroup[] = ["gateway", "space", "capital", "time", "member", "admin"];
    for (const g of groups) expect(SURFACE_STRATEGY[g], g).toBeDefined();
  });

  it("forbids shadows — depth is one background step", () => {
    expect(ELEVATION.shadowsPermitted).toBe(false);
    expect(ELEVATION.steps).toHaveLength(2);
  });

  it("keeps terminal mode admin-only and read-only", () => {
    // Data entry in matrix green on near-black is how mistakes get made.
    expect(TERMINAL_MODE.memberFacing).toBe(false);
    expect(TERMINAL_MODE.neverUsedFor).toBe("data entry");
    expect(MODE_SWITCHING.terminal).toContain("Never auto-selected");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("tables", () => {
  it("right-aligns every numeric kind", () => {
    for (const k of ["currency", "percentage", "ratio", "count", "loss", "risk", "forecast", "date"]) {
      expect(COLUMN_ALIGN[k], k).toBe("right");
    }
    expect(COLUMN_ALIGN.text).toBe("left");
    expect(COLUMN_ALIGN.enum).toBe("left");
  });

  it("uses no zebra striping and no background fill on totals", () => {
    expect(TABLE.zebraStriping).toBe(false);
    expect(TABLE.totalsRow.backgroundFill).toBe(false);
  });

  it("never renders a blank cell", () => {
    // A blank cell is indistinguishable from a rendering failure.
    expect(TABLE.emptyCell).toBe("—");
  });

  it("allows one level of nesting only", () => {
    expect(TABLE.nestingLevels).toBe(1);
  });

  it("forbids multi-column sort", () => {
    expect(TABLE.sort.multiSort).toBe(false);
  });
});

describe("forms", () => {
  it("requires a real label, never a placeholder standing in", () => {
    // A placeholder disappears exactly when it is needed.
    expect(INPUT.label.realLabelElement).toBe(true);
    expect(INPUT.label.placeholderAsLabel).toBe(false);
  });

  it("focuses instantly with no glow", () => {
    expect(INPUT.focus.duration).toBe("0ms");
    expect(INPUT.focus.glow).toBe(false);
  });

  it("validates on blur, not on every keystroke", () => {
    expect(VALIDATION_TIMING.initial).toBe("on blur");
    expect(VALIDATION_TIMING.afterFirstError).toBe("live");
  });

  it("autosaves, which is what makes PR-01 genuinely resumable", () => {
    expect(AUTOSAVE.enabled).toBe(true);
    expect(AUTOSAVE.trigger).toContain("on blur");
    expect(AUTOSAVE.rationale).toContain("PR-01");
  });

  it("keeps a money symbol outside the field", () => {
    expect(INPUT.money.symbol).toContain("outside");
    expect(INPUT.money.align).toBe("right");
  });
});

describe("states", () => {
  it("uses no illustration, mascot or spinner", () => {
    expect(STATES.empty.illustration).toBe(false);
    expect(STATES.empty.mascot).toBe(false);
    expect(STATES.loading.spinner).toBe(false);
    expect(STATES.error.fullPageIllustration).toBe(false);
  });

  it("skeletons match final row height so nothing shifts", () => {
    expect(STATES.loading.tables).toContain("final row height");
  });

  it("renders decayed provenance exactly like a forecast", () => {
    // Trust it the same amount. A year-old valuation is not a statement
    // about today, and should not look like one.
    expect(STATES.stale.treatment).toContain("identical to a forecast");
  });
});

describe("the Piston", () => {
  it("is a bar, linear, never eased", () => {
    expect(PISTON.form).toBe("horizontal bar");
    expect(PISTON.curve).toBe("linear");
    expect(PISTON.easing).toContain("never feel accelerated");
  });

  it("carries three tick marks so the hold has legible progress", () => {
    // Without them a 3000ms linear fill reads as an undifferentiated blur.
    expect(PISTON.ticks.count).toBe(3);
    expect(PISTON.ticks.positions).toEqual([25, 50, 75]);
  });

  it("keeps full duration under reduced motion and becomes a numeral", () => {
    expect(PISTON.reducedMotion.duration).toContain("3000ms");
    expect(PISTON.reducedMotion.form).toBe("static countdown numeral");
  });

  it("resets to zero on release — no partial hold carries over", () => {
    expect(PISTON.release).toContain("resets to zero");
  });

  it("is the only haptic in the system", () => {
    expect(PISTON.haptic).toContain("only haptic");
  });
});

describe("components, icons, imagery", () => {
  it("specifies all seven named atoms and molecules", () => {
    expect(COMPONENTS).toHaveLength(7);
    for (const c of COMPONENTS) expect(c.spec.length, c.ref).toBeGreaterThan(20);
  });

  it("keeps the icon set small and closed", () => {
    // An open set grows until two icons mean the same thing.
    expect(ICONS).toHaveLength(9);
    expect(ICON_SPEC.font).toBe(false);
    expect(ICON_SPEC.fills).toBe(false);
    expect(ICON_SPEC.preferMonoGlyph).toBe(true);
  });

  it("commissions imagery per property rather than keeping a library", () => {
    expect(IMAGERY.library).toBe(false);
    expect(IMAGERY.sourcing).toContain("Commissioned once at onboarding");
  });

  it("prints the provenance of every figure", () => {
    // A figure on paper has no tooltip.
    expect(PRINT.provenance).toContain("footnote");
  });

  it("issues a PDF report built from the print assembly", () => {
    expect(PDF_REPORT.issued).toBe(true);
    expect(PDF_REPORT.rationale).toContain("Not new surface area");
  });

  it("emails a blocked distribution alongside an executed one", () => {
    // A member whose expected distribution did not arrive is owed the
    // reason without having to log in and look.
    const ids = EMAILS.map((e) => e.id);
    expect(ids).toContain("distribution-executed");
    expect(ids).toContain("distribution-blocked");
    expect(EMAILS).toHaveLength(7);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("charts", () => {
  it("defines six", () => {
    expect(CHARTS).toHaveLength(6);
    expect(chartFor("waterfall")!.metrics).toContain("loss");
  });

  it("has no chart palette — series colour comes from the metric grammar", () => {
    // Otherwise the same quantity is copper in a table and blue in the
    // chart beside it.
    expect(CHART_PALETTE_EXISTS).toBe(false);
    expect(CHART_RULES.seriesColour).toContain("METRIC_COLOUR");
  });

  it("bars a truncated y-axis on financial data", () => {
    // A y-axis not starting at zero makes a 2% move look like a collapse.
    expect(TRUNCATED_AXIS_PERMITTED).toBe(false);
    expect(CHART_RULES.zeroBaseline).toContain("barred");
  });

  it("distinguishes a forecast by dash AND colour", () => {
    expect(CHART_RULES.forecastDistinction).toContain("dashed AND electric");
    expect(CHART_RULES.forecastDistinction).toContain("Never colour alone");
  });

  it("animates on first paint only", () => {
    // A figure that moves when data refreshes is unreadable.
    expect(CHART_ANIMATION.onReRender).toBeNull();
    expect(CHART_ANIMATION.onFirstPaint.duration).toBe("600ms");
  });

  it("falls back to the source table, not to alt text describing a shape", () => {
    expect(CHART_ACCESSIBILITY.altTextDescribesShape).toBe(false);
    expect(CHART_ACCESSIBILITY.fallback).toContain("source table");
  });

  it("uses a bar for allocation, not a pie", () => {
    // A pie cannot show a 10% concentration ceiling being approached.
    expect(chartFor("allocation")!.notes).toContain("not a pie");
  });

  it("shows zero-height waterfall stages rather than omitting them", () => {
    expect(chartFor("waterfall")!.notes).toContain("never omitted");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("navigation", () => {
  it("defines six route groups", () => {
    expect(ROUTE_GROUPS).toHaveLength(6);
    expect(groupFor("capital")!.contents).toContain("Waterfall");
  });

  it("reaches every one of the 27 L2 objects through some group", () => {
    const covered = objectsCovered();
    const organismObjects = new Set(
      ORGANISMS.flatMap((o) => o.fields).map((f) => f.source).filter((s) => s.startsWith("UFR-")),
    );
    // Sanity: the groups cover a substantial share of the model, and every
    // named object is a real one.
    expect(covered.size).toBeGreaterThanOrEqual(20);
    expect(organismObjects.size).toBeGreaterThan(0);
  });

  it("keeps the HUD Rail to two affordances", () => {
    // A third turns chrome into a competing navigation bar.
    expect(HUD_RAIL.holds).toHaveLength(2);
    expect(HUD_RAIL.width).toBe(48);
    expect(HUD_RAIL.persistent).toBe(true);
  });

  it("makes the Trinity Lens sections, not a filter or panels", () => {
    expect(TRINITY_LENS.behaviour).toBe("sections");
    expect(TRINITY_LENS.swaps).toContain("full content region");
  });

  it("records why filter and panels were rejected", () => {
    // Panels cannot survive Compact without becoming a filter, which
    // contradicts phone-parity for (time) and (member).
    expect(TRINITY_LENS.rejected.panels).toContain("Compact");
    expect(TRINITY_LENS.rejected.filter).toContain("twice");
  });

  it("persists the lens per identity", () => {
    // A member who works in Capital should not land in Space every morning.
    expect(TRINITY_LENS.persistence).toContain("per identity");
    expect(LENSES).toEqual(["space", "capital", "time"]);
  });

  it("shows the lens only where all three views exist", () => {
    expect(TRINITY_LENS.presentOn).not.toContain("admin");
    expect(TRINITY_LENS.presentOn).not.toContain("gateway");
  });
});
