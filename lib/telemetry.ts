/**
 * TELEMETRY — signals about the system, never about a person
 *
 * Wave 6 · Composite Surface
 *
 * ── THREE RULES, AND ONE OF THEM IS HARD ─────────────────────────────
 *   1. Telemetry never blocks business logic. Fire and forget, always.
 *   2. Telemetry is privacy-respecting. No PII, no financial values.
 *   3. Sensitive actions are flagged so they can be permission-checked.
 *
 * Rule 2 is the hard one, because the useful signal and the forbidden
 * signal look identical at the call site. "Distribution executed:
 * ₹8,28,000 to 4 holders" is exactly what an analyst wants and exactly
 * what must never leave the system.
 *
 * The answer here is structural rather than procedural: a Signal payload
 * accepts only primitives that have been through `scrub()`, and `scrub()`
 * rejects anything shaped like money, an email, a name, or an identifier
 * that could be joined back to a person.
 *
 * ── WHY NOT JUST REUSE EVENTS ────────────────────────────────────────
 * Domain events (`lib/events.ts`) are the opposite of this: they carry
 * full context, name the actor, and are kept forever. That is what makes
 * them useful for audit and impossible for analytics. Two systems,
 * deliberately, with no shared payload type between them.
 */

export type SignalType =
  | "UserAction"    // a deliberate interaction
  | "StateChange"   // something moved, without saying what it was worth
  | "Performance"   // timings
  | "Error";        // something failed

export type Sensitivity = "open" | "admin" | "audit";

export interface Signal {
  type: SignalType;
  /** Dotted name, e.g. "distribution.executed". Never contains a value. */
  name: string;
  /** Scrubbed primitives only. */
  payload: Record<string, string | number | boolean>;
  /** Supplied by the caller. This module reads no clock. */
  at: string;
  /**
   * Sensitivity gate. `admin` and `audit` signals are permission-checked
   * before they reach any sink.
   */
  sensitivity: Sensitivity;
  /** Emitted 0..n times, or exactly once per transaction. */
  cardinality: "once-per-transaction" | "many";
}

export class TelemetryError extends Error {}

// ── Privacy ───────────────────────────────────────────────────────────

/** Keys that must never appear in a payload, whatever their value. */
const FORBIDDEN_KEYS = [
  "email", "phone", "name", "legalname", "legal_name", "address",
  "pan", "aadhaar", "passport", "taxid", "tax_id", "registration_number",
  "amount", "value", "price", "balance", "nav", "revenue", "distribution",
  "investorid", "investor_id", "memberid", "member_id", "identityid", "identity_id",
];

/** Value shapes that betray something even under an innocent key. */
const FORBIDDEN_SHAPES: [RegExp, string][] = [
  [/^-?\d+\.\d{4}$/, "looks like a money value (4dp decimal string)"],
  [/@/, "looks like an email address"],
  [/^[A-Z]{5}\d{4}[A-Z]$/, "looks like a PAN"],
  [/^\d{12}$/, "looks like an Aadhaar number"],
  [/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "looks like an identity uuid"],
];

/**
 * Reject anything that could identify a person or reveal a financial value.
 *
 * Throws rather than silently dropping the field. A silent drop teaches
 * nobody, and the next caller writes the same line.
 */
export function scrub(payload: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload)) {
    const key = k.toLowerCase().replace(/[^a-z_]/g, "");
    if (FORBIDDEN_KEYS.includes(key)) {
      throw new TelemetryError(
        `Telemetry payload key "${k}" is forbidden. Telemetry describes the system, not the person ` +
          `or the amount. Emit a bucket or a boolean instead.`,
      );
    }
    if (v === null || v === undefined) continue;
    if (typeof v === "object") {
      throw new TelemetryError(
        `Telemetry payload "${k}" is an object. Only primitives are permitted — a nested object ` +
          `is where PII arrives unnoticed.`,
      );
    }
    const s = String(v);
    for (const [shape, why] of FORBIDDEN_SHAPES) {
      if (shape.test(s)) {
        throw new TelemetryError(`Telemetry payload "${k}" ${why}. Bucket it or drop it.`);
      }
    }
    out[k] = v as string | number | boolean;
  }
  return out;
}

/**
 * Buckets, for the case an analyst genuinely needs magnitude.
 *
 * A bucket answers "was this large?" without answering "how much?". That
 * is almost always the actual question, and it is the only version of it
 * that may leave the system.
 */
export function magnitudeBucket(minorUnits: bigint): string {
  const abs = minorUnits < 0n ? -minorUnits : minorUnits;
  const rupees = abs / 10_000n;
  // 1 lakh = 1e5. 1 crore = 1e7. An earlier version had every threshold a
  // factor of ten low, which labelled 1.25 crore as "10Cr+" — a bucket is
  // worse than no bucket if it is confidently wrong.
  if (rupees >= 100_000_000n) return "10Cr+";      // 10 crore
  if (rupees >= 10_000_000n) return "1Cr-10Cr";    // 1 crore
  if (rupees >= 1_000_000n) return "10L-1Cr";      // 10 lakh
  if (rupees >= 100_000n) return "1L-10L";         // 1 lakh
  if (rupees > 0n) return "under-1L";
  return "zero";
}

export function durationBucket(ms: number): string {
  if (ms < 100) return "under-100ms";
  if (ms < 500) return "100-500ms";
  if (ms < 2000) return "500ms-2s";
  if (ms < 10_000) return "2s-10s";
  return "over-10s";
}

// ── Emission ──────────────────────────────────────────────────────────

export function signal(
  type: SignalType,
  name: string,
  payload: Record<string, unknown>,
  at: string,
  opts: { sensitivity?: Sensitivity; cardinality?: Signal["cardinality"] } = {},
): Signal {
  if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/.test(name)) {
    throw new TelemetryError(`Signal name "${name}" must be dotted lowercase, e.g. "distribution.executed".`);
  }
  return {
    type,
    name,
    payload: scrub(payload),
    at,
    sensitivity: opts.sensitivity ?? "open",
    cardinality: opts.cardinality ?? "many",
  };
}

/**
 * A sink that never throws into business logic.
 *
 * Rule 1 exists because the alternative is a distribution failing because
 * an analytics endpoint was slow. Telemetry is the least important thing
 * in the system and must behave like it.
 */
export class TelemetrySink {
  private readonly signals: Signal[] = [];
  private readonly dropped: { name: string; reason: string }[] = [];

  emit(s: Signal): void {
    try {
      this.signals.push(Object.freeze({ ...s }));
    } catch (e) {
      this.dropped.push({ name: s.name, reason: (e as Error).message });
    }
  }

  /** Safe wrapper. Never throws, whatever the payload. */
  tryEmit(
    type: SignalType, name: string, payload: Record<string, unknown>, at: string,
    opts: { sensitivity?: Sensitivity; cardinality?: Signal["cardinality"] } = {},
  ): boolean {
    try {
      this.emit(signal(type, name, payload, at, opts));
      return true;
    } catch (e) {
      this.dropped.push({ name, reason: (e as Error).message });
      return false;
    }
  }

  all(): readonly Signal[] { return [...this.signals]; }
  ofType(t: SignalType): Signal[] { return this.signals.filter((s) => s.type === t); }

  /** Signals refused, and why. Read in development, never shipped. */
  rejections(): readonly { name: string; reason: string }[] { return [...this.dropped]; }

  /** Requires a permission check before reaching a sink. */
  sensitive(): Signal[] { return this.signals.filter((s) => s.sensitivity !== "open"); }

  get size(): number { return this.signals.length; }
}

/** Retention, by type. Telemetry is not a record and does not survive like one. */
export const RETENTION_DAYS: Record<SignalType, number> = {
  UserAction: 90,
  StateChange: 180,
  Performance: 30,
  Error: 365,
};

export const TELEMETRY_RULES = [
  "Telemetry never blocks business logic. Use tryEmit; it cannot throw.",
  "No PII and no financial values. Emit a bucket or a boolean.",
  "Sensitive signals are flagged and permission-checked before any sink.",
  "Telemetry is not an audit trail. Domain events are — they carry the actor, and they are kept forever.",
  "A rejected signal is reported in development, never silently dropped in the dark.",
] as const;
