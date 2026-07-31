/**
 * Waves 4-5 — enums, validation messages, addendum tokens, processes
 */

import { describe, it, expect } from "vitest";
import {
  ENUM_DISPLAY, displayFor, labelFor, accessibleTextFor, valuesWithTone,
  CRITICAL_TONE_BUDGET,
} from "../constants/enums";
import {
  VALIDATION, messageFor, accessibleErrorFor, apiError, MESSAGE_RULES,
} from "../constants/validation";
import {
  EASE, DURATION, REDUCED_MOTION, DISMISSAL, ESCALATION, CONFIDENCE_COLOUR,
  riskColour, RISK_COLOUR_FALLBACK, Z, FULL_BLEED_RULES, TRANSITION_PATTERNS,
} from "../constants/tokens-addendum";
import { COLOUR } from "../constants/tokens";
import {
  PROCESSES, ACCREDITATION_PROCESS, COMMITMENT_PROCESS, DISTRIBUTION_PROCESS,
  resumeFrom, expiringSteps, pointOfNoReturn, processById,
} from "../lib/processes";
import { CONFIDENCE_ORDER } from "../lib/provenance";

// ─────────────────────────────────────────────────────────────────────
describe("enum display", () => {
  it("covers 26 enum sets", () => {
    expect(Object.keys(ENUM_DISPLAY).length).toBe(26);
  });

  it("falls back to the raw value rather than rendering blank", () => {
    expect(labelFor("Nope.field", "whatever")).toBe("whatever");
  });

  it("keeps critical inside its budget", () => {
    // Spending it on ordinary states leaves nothing that still registers
    // when a real breach happens.
    expect(valuesWithTone("critical").length).toBeLessThanOrEqual(CRITICAL_TONE_BUDGET);
  });

  it("reserves critical for breach, denial and failure", () => {
    const labels = valuesWithTone("critical").map((v) => v.value);
    expect(labels).toContain("constitutional_failure");
    expect(labels).toContain("reserve_breach");
    expect(labels).toContain("adverse");
  });

  it("gives a management valuation an explicit screen-reader warning", () => {
    // The visible label says "Management". What matters — that it is not
    // fit for a filing — is only in the description, so a11y states it.
    const t = accessibleTextFor("Valuation.source", "management");
    expect(t).toContain("Not fit for regulatory filing");
    expect(t).toContain("F-13");
  });

  it("explains that an expired accreditation does NOT silence a holder", () => {
    const t = accessibleTextFor("Investor.accreditation_state", "expired");
    expect(t).toContain("voting, distribution and information rights are unaffected");
  });

  it("builds accessible text from label and description when no override exists", () => {
    const t = accessibleTextFor("Commitment.commitment_state", "offered");
    expect(t).toBe("Offered. Made, not yet accepted");
  });

  it("tones the six waterfall stages distinctly by role", () => {
    expect(displayFor("Distribution.waterfall_stage", "3_admin_reserve")!.tone).toBe("forest");
    expect(displayFor("Distribution.waterfall_stage", "6_partner_distribution")!.tone).toBe("copper");
    expect(displayFor("Distribution.waterfall_stage", "5_debt_service")!.tone).toBe("hazard");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("validation messages", () => {
  it("never says only 'invalid'", () => {
    for (const [code, r] of Object.entries(VALIDATION)) {
      expect(r.message.toLowerCase(), code).not.toBe("invalid");
      expect(r.message.length, code).toBeGreaterThan(15);
    }
  });

  it("names the field first in accessible text", () => {
    // A screen-reader listener hears the error without seeing which input it
    // sits under, so the field has to come first.
    expect(accessibleErrorFor("money.format")).toMatch(/^Amount field error:/);
    expect(accessibleErrorFor("reason.required")).toMatch(/^Reason field error:/);
  });

  it("blames the constraint, never the person", () => {
    for (const [code, r] of Object.entries(VALIDATION)) {
      expect(r.message, code).not.toMatch(/\byou entered\b|\byour mistake\b|\bsorry\b/i);
    }
  });

  it("explains what to do, not only what went wrong", () => {
    expect(messageFor("capitalCall.purposeNotPermitted")).toContain("only for");
    expect(messageFor("immutable.field")).toBeTruthy();
    expect(VALIDATION["immutable.field"].help).toContain("post an amendment");
  });

  it("returns a code AND a message from the API shape", () => {
    // A code alone forces a client to invent copy; a message alone forces
    // it to parse prose.
    const e = apiError("distribution.reserveBelowFloor", "amount", "F-06");
    expect(e.code).toBe("distribution.reserveBelowFloor");
    expect(e.message).toContain("below its floor");
    expect(e.authority).toBe("F-06");
  });

  it("degrades to a usable message for an unknown code", () => {
    expect(messageFor("no.such.rule")).toBe("That value could not be accepted.");
  });

  it("states its own copy rules", () => {
    expect(MESSAGE_RULES.length).toBeGreaterThanOrEqual(6);
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("Addendum A", () => {
  it("adds two curves without touching the original two", () => {
    expect(EASE.cinema).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(EASE.shutter).toBe("cubic-bezier(0.9, 0, 0.2, 1)");
    expect(EASE.settle).toBeTruthy();
    expect(EASE.alert).toBeTruthy();
  });

  it("keeps the Piston at full duration under reduced motion", () => {
    // Capital commitment is never shortened for anyone. Under reduced
    // motion the fill becomes a static countdown numeral instead.
    expect(REDUCED_MOTION.pistonDuration).toBe(DURATION.commit);
    expect(DURATION.commit).toBe("3000ms");
    expect(REDUCED_MOTION.pistonPresentation).toBe("static countdown numeral");
  });

  it("keeps the Piston linear — no easing toward completion", () => {
    expect(TRANSITION_PATTERNS["MT-04"].spec).toContain("NO easing");
  });

  it("keys overlay dismissal to reversibility", () => {
    expect(DISMISSAL.reversible.clickOutside).toBe(true);
    // A stray click must not discard a deliberate hold.
    expect(DISMISSAL.capitalMoving.clickOutside).toBe(false);
    expect(DISMISSAL.capitalMoving.note).toContain("FROM ZERO");
    expect(DISMISSAL.ceremony.escape).toBe(false);
  });

  it("never lets an error auto-dismiss", () => {
    expect(ESCALATION.error).toContain("NEVER a Toast alone");
  });

  it("maps confidence colours onto every provenance class", () => {
    for (const c of CONFIDENCE_ORDER) {
      expect(CONFIDENCE_COLOUR[c as keyof typeof CONFIDENCE_COLOUR], c).toBeTruthy();
    }
  });

  it("gives observed and verified the same colour, distinguished by label", () => {
    expect(CONFIDENCE_COLOUR.observed).toBe(CONFIDENCE_COLOUR.verified);
  });

  it("renders an unmapped risk category rather than crashing", () => {
    // The design document names 8 categories; the registry has 10.
    expect(riskColour("liquidity")).toBe("#2061DE");
    expect(riskColour("counterparty")).toBe(RISK_COLOUR_FALLBACK);
    expect(riskColour("technology")).toBe(COLOUR.steel);
  });

  it("orders the stacking scale strictly", () => {
    const vals = [Z.grid, Z.content, Z.hud, Z.overlay, Z.cursor];
    expect(vals).toEqual([...vals].sort((a, b) => a - b));
  });

  it("bars full-bleed wherever a figure is being read", () => {
    expect(FULL_BLEED_RULES["FB-1"]).toContain("ZERO numeric data");
  });
});

// ─────────────────────────────────────────────────────────────────────
describe("processes", () => {
  it("defines five", () => {
    expect(PROCESSES).toHaveLength(5);
    expect(processById("PR-01")).toBe(ACCREDITATION_PROCESS);
  });

  it("holds accreditation evidence but expires the decision", () => {
    // Re-verifying an unchanged passport helps nobody. The DECISION is what
    // is time-bound, not the evidence behind it.
    const expiring = expiringSteps(ACCREDITATION_PROCESS).map((s) => s.id);
    expect(expiring).toEqual(["A6"]);
    expect(ACCREDITATION_PROCESS.steps.find((s) => s.id === "A2")!.expiresAfter).toBeNull();
  });

  it("names acceptance as the commitment point of no return", () => {
    expect(pointOfNoReturn(COMMITMENT_PROCESS)!.id).toBe("C4");
    expect(pointOfNoReturn(COMMITMENT_PROCESS)!.name).toBe("Acceptance");
  });

  it("cannot resume past a non-resumable step", () => {
    expect(resumeFrom(COMMITMENT_PROCESS, "C2")!.id).toBe("C3");
    expect(resumeFrom(COMMITMENT_PROCESS, "C3")).toBeNull(); // C4 is the wall
  });

  it("returns null at the end of a process", () => {
    expect(resumeFrom(DISTRIBUTION_PROCESS, "D4")).toBeNull();
  });

  it("expires an acquisition approval faster than its valuation", () => {
    // A committee approved the asset AT A PRICE. After a quarter that is a
    // different decision.
    const e = Object.fromEntries(expiringSteps(PROCESSES[2]).map((s) => [s.id, s.expiresAfter]));
    expect(e.Q4).toBe("90 days");
    expect(e.Q3).toBe("365 days");
  });

  it("forbids concurrent runs where two would race the same read", () => {
    expect(DISTRIBUTION_PROCESS.concurrent).toBe(false);
    expect(DISTRIBUTION_PROCESS.concurrencyNote).toContain("before the other posted");
    expect(ACCREDITATION_PROCESS.concurrent).toBe(false);
  });

  it("permits concurrent commitments across offerings", () => {
    expect(COMMITMENT_PROCESS.concurrent).toBe(true);
  });

  it("states what an abandoned run leaves behind", () => {
    for (const p of PROCESSES) {
      expect(p.abandonment.length, p.id).toBeGreaterThan(40);
    }
  });

  it("every step declares an entry condition", () => {
    for (const p of PROCESSES) {
      for (const s of p.steps) expect(s.entry.length, `${p.id}.${s.id}`).toBeGreaterThan(5);
    }
  });
});
