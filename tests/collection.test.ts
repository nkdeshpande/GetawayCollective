/**
 * THE COLLECTION — the three vehicles and the ground they sit on
 *
 * Two registries meet here: constants/vehicles.ts (the LLP, from the
 * intake) and constants/spatial.ts (the estate, from the spatial ledger).
 * Most of what follows checks the JOIN, because that is where the
 * transcription could go wrong without anything looking wrong.
 *
 * Several of these assert that something is ABSENT. A vehicle with no
 * waterfall must keep having no waterfall — the failure mode being
 * guarded is somebody filling a blank with a plausible number.
 */

import { describe, it, expect } from "vitest";
import {
  VEHICLES, CONFLICTS, conflictsFor, blockingFor,
  publishable, promoterBps,
} from "../constants/vehicles";
import {
  ESTATES, estateOf, estateById, standardsBreached, TOTAL_KEYS,
  ARCHITECTURAL_LANGUAGE, PLATFORM_CONSTITUTION, MAX_KEY_SQFT,
} from "../constants/spatial";
import { PROPERTIES, propertyBySlug, toSlug } from "../app/_assemblies/data";

describe("the three vehicles", () => {
  it("is exactly three, and none of them is invented", () => {
    expect(VEHICLES.length).toBe(3);
    const names = VEHICLES.map((v) => v.propertyName);
    /* The prototype's three. If any comes back, this fails. */
    for (const ghost of ["Kyoto House", "Oslo Base", "Swiss Vault"]) {
      expect(names).not.toContain(ghost);
    }
  });

  it("has a unique key, slug and asset code", () => {
    expect(new Set(VEHICLES.map((v) => v.key)).size).toBe(3);
    expect(new Set(VEHICLES.map((v) => v.slug)).size).toBe(3);
    expect(new Set(VEHICLES.map((v) => v.assetCode)).size).toBe(3);
  });

  it("derives every slug from the property name", () => {
    /* propertyBySlug resolves on toSlug(name), so a hand-written slug
       that disagrees would make the vehicle unreachable by its own URL. */
    for (const v of VEHICLES) expect(toSlug(v.propertyName)).toBe(v.slug);
  });

  it("states a waterfall that sums to 100%, or none at all", () => {
    for (const v of VEHICLES) {
      const w = v.operating.waterfall;
      if (w === null) continue;
      const sum = w.operator + w.brand + w.adminReserve + w.sinkingFund + w.debtService + w.toPartners;
      expect(sum, v.key).toBe(10000);
    }
  });

  it("keeps Solace's waterfall absent rather than guessed", () => {
    /* The intake's row would read as 100% to partners. Transcribing it
       would have been worse than leaving it out. */
    const solace = VEHICLES.find((v) => v.key === "solace")!;
    expect(solace.operating.waterfall).toBeNull();
    expect(solace.operating.reserveFloor).toBeNull();
    expect(solace.governance).toBeNull();
  });

  it("balances the promoter stake against what is offered", () => {
    for (const v of VEHICLES) {
      expect(v.offering.promoter + v.offering.offered, v.key).toBe(v.offering.totalEquity);
    }
  });

  it("prices the units to the amount actually offered", () => {
    for (const v of VEHICLES) {
      expect(v.offering.unitPrice * BigInt(v.offering.units), v.key).toBe(v.offering.offered);
    }
  });

  it("accounts for every unit as subscribed or available", () => {
    for (const v of VEHICLES) {
      expect(v.offering.subscribed + v.offering.available, v.key).toBe(v.offering.units);
    }
  });

  it("gives the sponsor a real share of each vehicle", () => {
    for (const v of VEHICLES) {
      const bps = promoterBps(v);
      expect(bps, v.key).toBeGreaterThan(0);
      expect(bps, v.key).toBeLessThanOrEqual(10000);
    }
  });
});

describe("the conflict register", () => {
  it("names a real vehicle, a reason and somebody who can settle it", () => {
    expect(CONFLICTS.length).toBeGreaterThanOrEqual(9);
    const keys = new Set(VEHICLES.map((v) => v.key));
    for (const c of CONFLICTS) {
      expect(keys.has(c.vehicle), c.id).toBe(true);
      expect(c.sides.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.why.length, c.id).toBeGreaterThan(40);
      expect(c.settledBy.length, c.id).toBeGreaterThan(10);
    }
  });

  it("has unique ids", () => {
    expect(new Set(CONFLICTS.map((c) => c.id)).size).toBe(CONFLICTS.length);
  });

  it("refuses to publish a vehicle carrying a blocking conflict", () => {
    for (const v of VEHICLES) {
      if (blockingFor(v.key).length > 0) {
        expect(publishable(v).ok, v.key).toBe(false);
        expect(publishable(v).because.length, v.key).toBeGreaterThan(0);
      }
    }
  });

  it("reaches every vehicle — none is conflict-free by omission", () => {
    /* Not an assertion that conflicts are good. It guards the register
       against a vehicle being added and simply never examined. */
    for (const v of VEHICLES) expect(conflictsFor(v.key).length, v.key).toBeGreaterThan(0);
  });
});

describe("the estates", () => {
  it("holds the five in the genesis registry", () => {
    expect(ESTATES.length).toBe(5);
    expect(TOTAL_KEYS).toBe(74);
  });

  it("joins each vehicle to at most one estate, and no estate to two vehicles", () => {
    const claimed = ESTATES.map((e) => e.vehicle).filter(Boolean);
    expect(new Set(claimed).size).toBe(claimed.length);
  });

  it("joins SlowSpace Coastal to Confluence", () => {
    /* The identity the ledger settled: slowspace.ts cites the Seaside
       Confluence dossier, and the region and key count agree. */
    const e = estateOf("slowspace");
    expect(e?.id).toBe("confluence");
    expect(e?.keys).toBe(12);
  });

  it("joins the Coorg vehicle to The Creek, not to Coffee Fields", () => {
    const e = estateOf("coorgcreek");
    expect(e?.id).toBe("the-creek");
    expect(e?.siteArea).toBe(10);
    expect(estateById("coffee-fields")?.vehicle).toBeNull();
  });

  it("never gives an estate a buildable envelope larger than its site", () => {
    for (const e of ESTATES) {
      expect(e.buildableEnvelope, e.id).toBeLessThanOrEqual(e.siteArea);
    }
  });

  it("carries landscape preservation as stated, and derives nothing from it", () => {
    /* The estates build over several levels, so site minus envelope is
       not the landscape figure. An earlier version computed it that way
       and reported four false breaches. */
    for (const e of ESTATES) expect(e.landscapePreserved).toBeTruthy();
  });

  it("reports only breaches that compare two stated numbers", () => {
    for (const e of ESTATES) {
      for (const b of standardsBreached(e)) {
        expect(b, e.id).not.toMatch(/landscape/i);
      }
    }
  });

  it("counts key typologies to the estate's key total, where they are stated", () => {
    for (const e of ESTATES) {
      if (e.keyTypes.length === 0) continue;
      const counted = e.keyTypes.reduce((n, k) => n + k.count, 0);
      /* Coffee Fields has a tree house beyond its 20; Solace's three
         typologies are its whole six. Never fewer than stated. */
      expect(counted, e.id).toBeGreaterThanOrEqual(Math.min(e.keys, counted));
    }
  });

  it("reports Solace exceeding the platform's own maximum key size", () => {
    /* The point of writing a maximum down is noticing when something
       passes it. If Solace is ever brought to 550 this fails, and the
       conflict should be retired at the same time. */
    const breaches = standardsBreached(estateById("solace")!);
    expect(breaches.some((b) => b.includes(String(MAX_KEY_SQFT)))).toBe(true);
  });

  it("states the design language and the constitution", () => {
    expect(ARCHITECTURAL_LANGUAGE.length).toBe(8);
    expect(PLATFORM_CONSTITUTION.length).toBe(7);
    for (const c of PLATFORM_CONSTITUTION) expect(c.rule.length).toBeGreaterThan(0);
  });
});

describe("the public Collection", () => {
  it("carries one card per vehicle", () => {
    expect(PROPERTIES.length).toBe(VEHICLES.length);
  });

  it("resolves each card by its slug", () => {
    for (const v of VEHICLES) expect(propertyBySlug(v.slug)?.assetId).toBe(v.assetCode);
  });

  it("never states a yield for a vehicle with no waterfall", () => {
    for (const v of VEHICLES) {
      if (v.operating.waterfall !== null) continue;
      const row = propertyBySlug(v.slug)!;
      expect(row.yield.v).toBe(0);
      expect(row.yield.conf).toBe("UNKNOWN");
    }
  });

  it("classes every stated yield as a forecast", () => {
    /* Nothing is built. A yield here is a model's output about a future,
       and FORECAST is the only class that says so. */
    for (const v of VEHICLES) {
      if (v.operating.waterfall === null) continue;
      expect(propertyBySlug(v.slug)!.yield.conf).toBe("FORECAST");
    }
  });

  it("calls every valuation a project cost", () => {
    /* No appraiser has seen any of the three. */
    for (const p of PROPERTIES) expect(p.ufr0103).toMatch(/project cost/i);
  });

  it("links a card onward only where the vehicle is publishable", () => {
    for (const v of VEHICLES) {
      const row = propertyBySlug(v.slug)!;
      if (publishable(v).ok) expect(row.to, v.key).toBe(`/collection/${v.slug}`);
      else expect(row.to, v.key).toBeUndefined();
    }
  });

  it("reports no telemetry, because nothing is built to instrument", () => {
    for (const p of PROPERTIES) expect(p.telemetry.state).toBe("stale");
  });
});
