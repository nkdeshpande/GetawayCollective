/**
 * The event → recipient → notice routing.
 *
 * These assertions exist because every reference here can rot silently: a
 * renamed EventType, a retired notice id, an audience that no longer
 * exists. None of those would fail a build — they would simply route a
 * real notice to nobody, and the first person to notice would be the one
 * who never received it.
 */
import { describe, it, expect } from "vitest";
import {
  NOTICE_BINDINGS, bindable, bindingsFor, bindingByGcEvent, audienceOf, BINDING_LAWS,
} from "../constants/notice-bindings";
import { NOTICES } from "../content/notifications";
import { EVENT_TYPES } from "../lib/events";

describe("the routing table", () => {
  it("carries the twelve operating-model rows", () => {
    expect(NOTICE_BINDINGS).toHaveLength(12);
  });

  it("names each GC event once", () => {
    const names = NOTICE_BINDINGS.map((b) => b.gcEvent);
    expect(new Set(names).size).toBe(names.length);
  });

  it("resolves a binding by its operating-model name", () => {
    expect(bindingByGcEvent("Distribution.Paid")?.noticeId).toBe("N-10");
    expect(bindingByGcEvent("Nothing.Happened")).toBeUndefined();
  });
});

describe("every reference resolves", () => {
  it("names only real EventTypes", () => {
    // A renamed event would leave a binding pointing at nothing, and the
    // notice would simply never send.
    const real = new Set<string>(EVENT_TYPES as readonly string[]);
    /* Guard the guard. An empty set would pass every membership check
       vacuously if the import ever broke — which is exactly how this
       assertion first failed, resolving to undefined and testing nothing. */
    expect(real.size).toBe(55);
    for (const b of NOTICE_BINDINGS) {
      if (b.eventType === null) continue;
      expect(real.has(b.eventType), `${b.gcEvent} -> ${b.eventType}`).toBe(true);
    }
  });

  it("names only notices that exist", () => {
    const ids = new Set(NOTICES.map((n) => n.id));
    for (const b of NOTICE_BINDINGS) {
      if (b.noticeId === null) continue;
      expect(ids.has(b.noticeId), `${b.gcEvent} -> ${b.noticeId}`).toBe(true);
    }
  });

  it("gives every bound notice a resolvable audience", () => {
    for (const b of NOTICE_BINDINGS) {
      if (!b.noticeId) continue;
      expect(audienceOf(b), b.gcEvent).toBeTruthy();
    }
  });
});

describe("what cannot fire says why", () => {
  it("explains every unbound row rather than leaving a hole", () => {
    for (const b of NOTICE_BINDINGS) {
      if (b.eventType && b.noticeId) continue;
      expect(b.blockedBy, `${b.gcEvent} is unbound and unexplained`).toBeTruthy();
      expect(b.blockedBy!.length, b.gcEvent).toBeGreaterThan(30);
    }
  });

  it("counts five bindable and seven blocked", () => {
    // Pinned so the number moving is deliberate. It should only ever fall.
    expect(bindable()).toHaveLength(5);
    expect(NOTICE_BINDINGS.length - bindable().length).toBe(7);
  });

  it("records that an enquiry currently tells the enquirer nothing", () => {
    // The sharpest finding the table exposes: N-17 fires on lead capture
    // and is addressed to the office, so the person who enquired receives
    // no acknowledgement at all.
    const b = bindingByGcEvent("Investor.Enquired")!;
    expect(b.noticeId).toBeNull();
    expect(b.blockedBy).toMatch(/told nothing|office/i);
  });

  it("records that the unit of exchange does not exist", () => {
    const b = bindingByGcEvent("Offering.Reserved")!;
    expect(b.eventType).toBeNull();
    expect(b.blockedBy).toMatch(/unit of exchange|not modelled/i);
  });
});

describe("silence is declared, not omitted", () => {
  it("binds Offering.Viewed to nobody, on purpose", () => {
    const b = bindingByGcEvent("Offering.Viewed")!;
    expect(b.recipients).toEqual([]);
    expect(b.noticeId).toBeNull();
    expect(b.blockedBy).toMatch(/deliberately|should not acquire/i);
  });
});

describe("routing is not audience", () => {
  it("sends a commitment to the investor AND to Investor Relations", () => {
    // The reason this registry exists: one audience field cannot express
    // two recipients.
    const b = bindingByGcEvent("Commitment.Made")!;
    expect(b.recipients).toContain("investor");
    expect(b.recipients).toContain("investor-relations");
    expect(b.recipients.length).toBeGreaterThan(1);
  });

  it("treats an admitted partner as a member, not a new party", () => {
    // One Investor identity before and after settlement (L2 sheet).
    const b = bindingByGcEvent("Partner.Admitted")!;
    expect(b.recipients).toEqual(["member"]);
  });

  it("returns every binding an event should fire", () => {
    expect(bindingsFor("DistributionExecuted").map((b) => b.gcEvent))
      .toEqual(["Distribution.Paid"]);
    expect(bindingsFor("OfferingOpened")).toEqual([]);
  });
});

describe("the laws", () => {
  it("records why routing is separate from audience", () => {
    expect(BINDING_LAWS.routingIsNotAudience).toMatch(/sent/i);
    expect(BINDING_LAWS.silenceIsDeclared).toMatch(/oversight/i);
    expect(BINDING_LAWS.onePersonThroughout).toMatch(/one identity/i);
  });
});
