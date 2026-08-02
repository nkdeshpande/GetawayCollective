/**
 * Wave 6 — metric grammar, organisms, telemetry
 */

import { describe, it, expect } from "vitest";
import { money } from "../lib/money";
import {
  currency, percentage, ratio, count, loss, risk,
  METRIC_TONE, tonesAreDistinct, isProvisional, PROVISIONAL_MARK,
  GRAMMAR_RULES, MetricGrammarError,
} from "../lib/metric-grammar";
import {
  ORGANISMS, organismById, denseFields, survivesCompact, DENSITY_MODES,
} from "../constants/organisms";
import {
  signal, scrub, magnitudeBucket, durationBucket, TelemetrySink,
  TelemetryError, RETENTION_DAYS, TELEMETRY_RULES,
} from "../lib/telemetry";

const AT = "2026-07-31T10:00:00.000Z";

// ─────────────────────────────────────────────────────────────────────
describe("metric grammar (§29)", () => {
  it("groups rupees the Indian way", () => {
    // An Indian reader parses 1,25,00,000 at a glance and stalls on
    // 12,500,000. Most members here are Indian.
    expect(currency(money("12500000.0000")).display).toBe("₹1,25,00,000.00");
    expect(currency(money("1000.0000")).display).toBe("₹1,000.00");
    expect(currency(money("999.0000")).display).toBe("₹999.00");
  });

  it("groups the Western way on request", () => {
    expect(currency(money("12500000.0000"), { grouping: "western" }).display).toBe("₹12,500,000.00");
  });

  it("NEVER renders currency without a symbol", () => {
    // A bare number reads as a count.
    expect(() => currency(money("100.0000"), { symbol: "" })).toThrow(MetricGrammarError);
  });

  it("renders percentages from basis points, never floats", () => {
    expect(percentage(1450).display).toBe("14.50%");
    expect(() => percentage(0.145)).toThrow(/basis-point integers/);
  });

  it("renders a ratio with a trailing x so it cannot read as a rate", () => {
    expect(ratio(25_000).display).toBe("2.50x");
  });

  it("gives every metric kind a distinct tone", () => {
    expect(tonesAreDistinct()).toBe(true);
    expect(METRIC_TONE.risk).toBe("hazard");
    expect(METRIC_TONE.loss).toBe("critical");
    expect(METRIC_TONE.currency).toBe("copper");
  });

  it("marks a provisional figure visibly, not only by colour", () => {
    // Colour is never the sole carrier of meaning. A forecast has to survive
    // being printed in black and white.
    const f = currency(money("1000.0000"), { confidence: "FORECAST" });
    expect(f.isProvisional).toBe(true);
    expect(f.display).toContain(PROVISIONAL_MARK.trim());
    /* "forecast" here is the MetricKind, not the confidence class. The two
       share a spelling and are different axes — the migration to the v5
       confidence vocabulary deliberately left the metric kind alone. */
    expect(f.kind).toBe("forecast");
    expect(f.tone).toBe("electric");
  });

  it("treats inferred and reported as provisional too", () => {
    expect(isProvisional("INFERRED")).toBe(true);
    expect(isProvisional("REPORTED")).toBe(true);
    expect(isProvisional("UNKNOWN")).toBe(true);
    expect(isProvisional("VERIFIED")).toBe(false);
    expect(isProvisional("CORROBORATED")).toBe(false);
  });

  it("does not mark a verified figure", () => {
    const o = currency(money("1000.0000"), { confidence: "VERIFIED" });
    expect(o.isProvisional).toBe(false);
    expect(o.display).not.toContain("~");
    expect(o.kind).toBe("currency");
  });

  it("reserves loss for realised negatives, distinct from a negative forecast", () => {
    // A negative delta on a forecast is a forecast, not a loss.
    expect(loss(money("-50000.0000")).kind).toBe("loss");
    expect(loss(money("-50000.0000")).tone).toBe("critical");
    expect(currency(money("-50000.0000"), { confidence: "FORECAST" }).kind).toBe("forecast");
  });

  it("keeps risk visually unique", () => {
    const r = risk(920);
    expect(r.kind).toBe("risk");
    expect(r.tone).toBe("hazard");
    expect(r.tone).not.toBe(METRIC_TONE.currency);
    expect(r.tone).not.toBe(METRIC_TONE.loss);
  });

  it("compacts to lakh and crore for dense tables", () => {
    expect(currency(money("12500000.0000"), { compact: true }).display).toBe("₹1.25Cr");
    expect(currency(money("250000.0000"), { compact: true }).display).toBe("₹2.50L");
  });

  it("expands symbols for a screen reader", () => {
    expect(currency(money("1000.0000")).a11y).toContain("rupees");
    expect(percentage(1450).a11y).toContain("percent");
    expect(ratio(25_000).a11y).toContain("times");
    expect(loss(money("-1.0000")).a11y).toContain("loss");
  });

  it("states its own rules", () => {
    expect(GRAMMAR_RULES.forecastIsDistinguished).toContain("colour alone is never");
    expect(Object.keys(GRAMMAR_RULES)).toHaveLength(5);
  });

  it("counts have no unit unless given one", () => {
    expect(count(4).display).toBe("4");
    expect(count(1250, "units").display).toBe("1,250 units");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("organisms", () => {
  it("defines ten", () => {
    expect(ORGANISMS).toHaveLength(10);
    expect(organismById("O-01")!.name).toBe("Property Card");
  });

  it("every organism states the one question it answers", () => {
    for (const o of ORGANISMS) {
      expect(o.answers.length, o.id).toBeGreaterThan(15);
      expect(o.answers, o.id).toContain("?");
    }
  });

  it("every organism has hierarchy — not everything at one level", () => {
    // A card where everything is IL-2 has no hierarchy and reads as noise.
    for (const o of ORGANISMS) {
      const levels = new Set(o.fields.map((f) => f.il));
      expect(levels.size, o.id).toBeGreaterThan(1);
    }
  });

  it("every organism survives compact density", () => {
    // Its highest-priority field must be among the dense ones, or the card
    // stops answering its question when the table tightens.
    for (const o of ORGANISMS) {
      expect(survivesCompact(o), o.id).toBe(true);
    }
  });

  it("puts valuation source beside the valuation figure", () => {
    // A number whose provenance is a scroll away gets read as independent
    // when it is not.
    const p = organismById("O-01")!;
    const iVal = p.fields.findIndex((f) => f.source === "UFR-0102");
    const iSrc = p.fields.findIndex((f) => f.source === "UFR-0103");
    expect(iSrc).toBe(iVal + 1);
  });

  it("makes reserve coverage the highest level in the system", () => {
    // It is the single figure that decides whether a distribution runs.
    const g = organismById("O-04")!;
    expect(g.fields.find((f) => f.source === "UFR-0385")!.il).toBe(1);
  });

  it("renders a waterfall shortfall as LOSS, not negative currency", () => {
    const w = organismById("O-03")!;
    expect(w.fields.find((f) => f.source === "derived.shortfall")!.metric).toBe("loss");
  });

  it("exposes no field mapping a holder to a ballot (I-05)", () => {
    const r = organismById("O-06")!;
    const suspicious = r.fields.filter((f) => /voter|ballot|votedBy|whoVoted/i.test(f.source + f.label));
    expect(suspicious).toEqual([]);
  });

  it("carries the basis of a decision, not only its result (I-06)", () => {
    const r = organismById("O-06")!;
    const sources = r.fields.map((f) => f.source);
    expect(sources).toContain("UFR-0306");             // rationale
    expect(sources).toContain("derived.options");      // options considered
    expect(sources).toContain("derived.conflicts");    // conflicts disclosed
  });

  it("shows the point of no return before it is reached", () => {
    const t = organismById("O-07")!;
    expect(t.fields.map((f) => f.source)).toContain("derived.pointOfNoReturn");
  });

  it("never lets a confidence tag outrank the figure it qualifies", () => {
    const c = organismById("O-10")!;
    expect(Math.min(...c.fields.map((f) => f.il))).toBeGreaterThanOrEqual(5);
  });

  it("declares four density modes", () => {
    expect(DENSITY_MODES).toEqual(["compact", "comfortable", "audit", "presentation"]);
  });

  it("keeps dense field sets genuinely smaller", () => {
    for (const o of ORGANISMS) {
      expect(denseFields(o).length, o.id).toBeLessThanOrEqual(o.fields.length);
      expect(denseFields(o).length, o.id).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("telemetry", () => {
  it("accepts an ordinary system signal", () => {
    const s = signal("UserAction", "distribution.opened", { vehicleForm: "llp", stage: 6 }, AT);
    expect(s.payload.stage).toBe(6);
    expect(s.sensitivity).toBe("open");
  });

  it("REFUSES a money value, even under an innocent key", () => {
    // "Distribution executed: 828000.0000" is exactly what an analyst wants
    // and exactly what must never leave the system.
    expect(() => scrub({ total: "828000.0000" })).toThrow(/money value/);
  });

  it("refuses a forbidden key outright", () => {
    expect(() => scrub({ email: "x" })).toThrow(/forbidden/);
    expect(() => scrub({ investor_id: "abc" })).toThrow(/forbidden/);
    expect(() => scrub({ amount: 5 })).toThrow(/forbidden/);
  });

  it("refuses an identity uuid", () => {
    expect(() => scrub({ ref: "3f2504e0-4f89-41d3-9a0c-0305e82c3301" })).toThrow(/identity uuid/);
  });

  it("refuses a nested object — where PII arrives unnoticed", () => {
    expect(() => scrub({ meta: { email: "x" } })).toThrow(/[Oo]nly primitives/);
  });

  it("throws rather than silently dropping — a silent drop teaches nobody", () => {
    expect(() => scrub({ email: "a@b.c" })).toThrow(TelemetryError);
  });

  it("offers buckets so magnitude can be reported without the amount", () => {
    // 1 lakh = 1e5, 1 crore = 1e7. An earlier version had every threshold a
    // factor of ten low and labelled 1.25 crore as "10Cr+".
    expect(magnitudeBucket(money("125000000.0000"))).toBe("10Cr+");
    expect(magnitudeBucket(money("12500000.0000"))).toBe("1Cr-10Cr");
    expect(magnitudeBucket(money("5000000.0000"))).toBe("10L-1Cr");
    expect(magnitudeBucket(money("250000.0000"))).toBe("1L-10L");
    expect(magnitudeBucket(money("50000.0000"))).toBe("under-1L");
    expect(magnitudeBucket(money("0.0000"))).toBe("zero");
    expect(durationBucket(50)).toBe("under-100ms");
    expect(durationBucket(30_000)).toBe("over-10s");
  });

  it("NEVER throws into business logic", () => {
    // The alternative is a distribution failing because an analytics
    // endpoint was slow. Telemetry is the least important thing here.
    const sink = new TelemetrySink();
    expect(() => sink.tryEmit("StateChange", "x.y", { email: "a@b.c" }, AT)).not.toThrow();
    expect(sink.tryEmit("StateChange", "x.y", { email: "a@b.c" }, AT)).toBe(false);
    expect(sink.size).toBe(0);
  });

  it("reports what it refused rather than dropping it in the dark", () => {
    const sink = new TelemetrySink();
    sink.tryEmit("StateChange", "x.y", { amount: 1 }, AT);
    expect(sink.rejections()).toHaveLength(1);
    expect(sink.rejections()[0].reason).toContain("forbidden");
  });

  it("enforces a dotted lowercase name", () => {
    expect(() => signal("UserAction", "BadName", {}, AT)).toThrow(/dotted lowercase/);
    expect(() => signal("UserAction", "nodots", {}, AT)).toThrow();
  });

  it("flags sensitive signals for a permission check", () => {
    const sink = new TelemetrySink();
    sink.emit(signal("StateChange", "governance.resolved", {}, AT, { sensitivity: "audit" }));
    sink.emit(signal("UserAction", "page.viewed", {}, AT));
    expect(sink.sensitive()).toHaveLength(1);
  });

  it("keeps errors longest and performance shortest", () => {
    expect(RETENTION_DAYS.Error).toBeGreaterThan(RETENTION_DAYS.UserAction);
    expect(RETENTION_DAYS.Performance).toBeLessThan(RETENTION_DAYS.UserAction);
  });

  it("says telemetry is not an audit trail", () => {
    expect(TELEMETRY_RULES.join(" ")).toContain("not an audit trail");
  });
});
