import { describe, expect, it } from "vitest";
import { DECISION_EVENTS, EVENT_TYPES } from "../lib/events";
import {
  EVENT_COMMUNICATIONS,
  communicationByEvent,
} from "../content/event-communications";

describe("event communication coverage", () => {
  it("maps every domain event exactly once", () => {
    expect(EVENT_COMMUNICATIONS).toHaveLength(EVENT_TYPES.length);
    expect(new Set(EVENT_COMMUNICATIONS.map((spec) => spec.event)).size).toBe(EVENT_TYPES.length);
    expect(EVENT_COMMUNICATIONS.map((spec) => spec.event)).toEqual(EVENT_TYPES);
  });

  it("assigns a complete in-product, interruption, email, and completion contract", () => {
    for (const spec of EVENT_COMMUNICATIONS) {
      expect(spec.product.title.length, spec.event).toBeGreaterThan(4);
      expect(spec.product.body.length, spec.event).toBeGreaterThan(12);
      expect(spec.product.cta.length, spec.event).toBeGreaterThan(2);
      expect(spec.interruption.trigger.length, spec.event).toBeGreaterThan(6);
      expect(spec.interruption.reason.length, spec.event).toBeGreaterThan(12);
      expect(spec.email.subject.length, spec.event).toBeGreaterThan(6);
      expect(spec.email.preheader.length, spec.event).toBeGreaterThan(10);
      expect(spec.email.heading.length, spec.event).toBeGreaterThan(4);
      expect(spec.email.body.length, spec.event).toBeGreaterThan(20);
      expect(spec.email.cta.length, spec.event).toBeGreaterThan(2);
      expect(spec.completion.length, spec.event).toBeGreaterThan(10);
    }
  });

  it("gives every decision event a deliberate interruption", () => {
    for (const event of DECISION_EVENTS) {
      expect(communicationByEvent(event).interruption.pattern, event).not.toBe("none");
    }
  });

  it("keeps critical notices persistent", () => {
    for (const spec of EVENT_COMMUNICATIONS.filter((item) => item.tone === "critical")) {
      expect(spec.product.surface, spec.event).toBe("critical-alert");
      expect(spec.product.persistent, spec.event).toBe(true);
      expect(spec.email.policy, spec.event).toBe("immediate");
    }
  });

  it("never reveals a ballot choice in the receipt", () => {
    const ballot = communicationByEvent("VoteCast");
    const copy = [
      ballot.product.title,
      ballot.product.body,
      ballot.email.subject,
      ballot.email.preheader,
      ballot.email.heading,
      ballot.email.body,
      ballot.completion,
    ].join(" ");
    expect(ballot.interruption.pattern).toBe("secret-ballot");
    expect(copy).toContain("sealed");
    expect(copy).not.toMatch(/voted (for|against|abstain)/i);
  });

  it("does not treat accreditation expiry as loss of existing rights", () => {
    const expiry = communicationByEvent("AccreditationExpired");
    const copy = `${expiry.product.body} ${expiry.email.body} ${expiry.completion}`;
    expect(copy).toContain("existing ownership rights remain");
    expect(copy).toContain("without changing existing holder rights");
  });

  it("uses digest delivery for routine ledger traffic", () => {
    const ledger = communicationByEvent("LedgerEntryPosted");
    expect(ledger.email.policy).toBe("digest");
    expect(ledger.product.surface).toBe("toast");
    expect(ledger.product.persistent).toBe(false);
  });
});

