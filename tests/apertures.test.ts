/**
 * The Aperture system — one object, many vantages
 *
 * Wave 6.5 · from GC_CardAperture (signed off)
 */

import { describe, it, expect } from "vitest";
import {
  APERTURES, APERTURE_LAWS, PROPERTY_GATEWAY, PROPERTY_CONSOLE,
  PROPERTY_SPACE, PROPERTY_MEMBER, DISTRIBUTION_MEMBER, RESOLUTION_MEMBER,
  aperturesFor, apertureAt, sharedFields, OPENING_RANK, VANTAGE_ROUTE,
  APERTURE_RING, VALUE_TRANSITION, SIGNAL_APERTURE,
} from "../constants/apertures";
import { BusinessObjectType as BO } from "../constants/business-objects";
import { COLOUR } from "../constants/tokens";

describe("the aperture system", () => {
  it("renders one object at several vantages", () => {
    const property = aperturesFor(BO.Property);
    expect(property.length).toBeGreaterThanOrEqual(4);
    expect(new Set(property.map((a) => a.vantage)).size).toBe(property.length);
  });

  it("widens as the vantage becomes more accountable", () => {
    expect(OPENING_RANK[PROPERTY_GATEWAY.opening]).toBeLessThan(OPENING_RANK[PROPERTY_SPACE.opening]);
    expect(OPENING_RANK[PROPERTY_SPACE.opening]).toBeLessThan(OPENING_RANK[PROPERTY_CONSOLE.opening]);
  });

  it("shows LESS, never DIFFERENT — shared fields carry the same id", () => {
    // The whole constraint. An aperture showing less is a design decision;
    // one showing different is a second source of truth wearing a layout.
    const shared = sharedFields(PROPERTY_GATEWAY, PROPERTY_CONSOLE);
    expect(shared).toContain("UFR-0060");   // property_name, at both
    for (const s of shared) {
      const g = PROPERTY_GATEWAY.fields.find((f) => f.source === s)!;
      const c = PROPERTY_CONSOLE.fields.find((f) => f.source === s)!;
      expect(g.source).toBe(c.source);
    }
  });

  it("never omits from the widest aperture what a narrower one shows", () => {
    const wide = new Set(PROPERTY_CONSOLE.fields.map((f) => f.source));
    for (const narrower of [PROPERTY_GATEWAY, PROPERTY_SPACE]) {
      const missing = narrower.fields
        .map((f) => f.source)
        .filter((s) => s.startsWith("UFR-") && !wide.has(s));
      expect(missing, narrower.id).toEqual([]);
    }
  });

  it("withholds the valuation at the gateway, and says why", () => {
    // Not secrecy — a figure shown without its provenance invites a
    // decision it cannot support.
    const sources = PROPERTY_GATEWAY.fields.map((f) => f.source);
    expect(sources).not.toContain("UFR-0102");
    expect(PROPERTY_GATEWAY.withholds).toContain("provenance");
  });

  it("keeps valuation source beside the figure in the console", () => {
    const i = PROPERTY_CONSOLE.fields.findIndex((f) => f.source === "UFR-0102");
    const j = PROPERTY_CONSOLE.fields.findIndex((f) => f.source === "UFR-0103");
    expect(j).toBe(i + 1);
  });

  it("defers only in narrow apertures", () => {
    // Deferring a field from the person accountable for it is hiding data.
    for (const a of APERTURES) {
      if (a.opening === "narrow") continue;
      expect(a.fields.filter((f) => f.deferred), a.id).toEqual([]);
    }
  });

  it("still defers something at the gateway — that is what narrow means", () => {
    expect(PROPERTY_GATEWAY.fields.some((f) => f.deferred)).toBe(true);
  });

  it("declares composition rather than smuggling another object's fields", () => {
    // A member's property card is genuinely "this property, and my position
    // in it". Declaring it keeps the linter honest about what is missing.
    expect(PROPERTY_MEMBER.composes).toContain(BO.OwnershipPosition);
    expect(PROPERTY_MEMBER.fields.map((f) => f.source)).toContain("UFR-0242");
  });

  it("never opens onto a sealed ballot at ANY vantage", () => {
    // Not a presentation choice. I-05.
    for (const a of APERTURES) {
      const leak = a.fields.filter((f) => /voter|ballot|votedBy|voteChoice/i.test(f.source));
      expect(leak, a.id).toEqual([]);
    }
    expect(RESOLUTION_MEMBER.withholds).toContain("sealed");
  });

  it("shows a member their own allocation and no one else's", () => {
    expect(DISTRIBUTION_MEMBER.withholds).toContain("never another");
    expect(DISTRIBUTION_MEMBER.actions).toEqual([]);
  });

  it("makes a blocked distribution as prominent as a paid one", () => {
    // A member whose distribution did not land is owed the reason at the
    // same weight as the amount.
    const f = DISTRIBUTION_MEMBER.fields;
    const paid = f.find((x) => x.source === "derived.myAllocation")!;
    const blocked = f.find((x) => x.source === "derived.blockedReason")!;
    expect(blocked.il).toBe(paid.il);
  });

  it("states an intent and a withholding for every aperture", () => {
    for (const a of APERTURES) {
      expect(a.intent.length, a.id).toBeGreaterThan(20);
      expect(a.withholds.length, a.id).toBeGreaterThan(10);
    }
  });

  it("maps every vantage to a route group", () => {
    for (const a of APERTURES) expect(VANTAGE_ROUTE[a.vantage], a.id).toBeDefined();
  });

  it("finds an aperture by object and vantage", () => {
    expect(apertureAt(BO.Property, "capital")).toBe(PROPERTY_CONSOLE);
    expect(apertureAt(BO.Property, "admin")).toBeUndefined();
  });

  it("states its laws", () => {
    expect(APERTURE_LAWS.lessNotDifferent).toContain("never show different");
    expect(APERTURE_LAWS.deferredIsNotHidden).toContain("keyboard");
    expect(Object.keys(APERTURE_LAWS)).toHaveLength(5);
  });
});

describe("aperture atoms", () => {
  it("uses forestLight for the idle ring, not forest", () => {
    // The prototype used forest, which is 1.38:1 on void — effectively
    // invisible. forestLight is the ground variant added for this case.
    expect(APERTURE_RING.idle.tone).toBe("forestLight");
    expect(COLOUR.forestLight).toBeTruthy();
  });

  it("expands the ring over an aperture", () => {
    expect(APERTURE_RING.overAperture.size).toBeGreaterThan(APERTURE_RING.idle.size);
    expect(APERTURE_RING.overAperture.tone).toBe("copper");
  });

  it("falls back to a native cursor on coarse pointers", () => {
    expect(APERTURE_RING.pointerFallback).toContain("coarse");
  });

  it("BARS scramble on money", () => {
    // A scramble renders random digits in a currency field for ~400ms —
    // a figure that was never the value, in the currency tone, and
    // indistinguishable from one that is.
    expect(VALUE_TRANSITION.money.scramblePermitted).toBe(false);
    expect(VALUE_TRANSITION.money.effect).toBe("count");
    expect(VALUE_TRANSITION.percentage.scramblePermitted).toBe(false);
  });

  it("permits scramble on an identifier, which has no magnitude to misread", () => {
    expect(VALUE_TRANSITION.identifier.effect).toBe("scramble");
  });

  it("flashes on settle rather than animating the figure", () => {
    expect(VALUE_TRANSITION.settle.duration).toBe("120ms");
  });

  it("keeps the signal ticker distinct from a toast", () => {
    // The ticker reports what the SYSTEM did; a toast reports what the
    // MEMBER did. A system line may auto-dismiss because nothing was asked.
    expect(SIGNAL_APERTURE.entersAlertCenter).toBe(false);
    expect(SIGNAL_APERTURE.distinctFrom).toContain("NT-01");
  });

  it("tones the ticker from the locked semantic palette", () => {
    for (const t of Object.values(SIGNAL_APERTURE.tones)) {
      expect(["steel", "confirm", "critical"]).toContain(t);
    }
  });
});
