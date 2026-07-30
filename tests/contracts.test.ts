/**
 * Contract tests — Wave 2 Semantic Core
 *
 * Proves the generated Zod contracts actually parse, and that the structural
 * enforcement claimed by the constitution is real rather than asserted.
 *
 * These test GENERATED artifacts against the registry that produced them.
 * That is deliberate: the generators are the mechanism by which E-06 holds,
 * so the generators are what needs proving.
 */

import { describe, it, expect } from "vitest";
import { SCHEMAS } from "../generated/schemas";
import { FIXTURES } from "../generated/fixtures";
import {
  AcquisitionUpdateSchema,
  DistributionUpdateSchema,
  AgreementUpdateSchema,
  ValuationUpdateSchema,
  PropertyUpdateSchema,
  AcquisitionSchema,
  ResolutionSchema,
} from "../generated/schemas";

describe("generated contracts parse", () => {
  const objects = Object.keys(SCHEMAS) as (keyof typeof SCHEMAS)[];

  it("covers every L2 object", () => {
    expect(objects.length).toBe(27);
  });

  for (const name of Object.keys(SCHEMAS) as (keyof typeof SCHEMAS)[]) {
    it(`${name}: valid fixture parses`, () => {
      const result = SCHEMAS[name].safeParse(FIXTURES[name as keyof typeof FIXTURES]);
      if (!result.success) {
        throw new Error(
          `${name} fixture rejected:\n` +
            result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n"),
        );
      }
      expect(result.success).toBe(true);
    });
  }
});

describe("immutability is structural, not aspirational", () => {
  // A-04: acquisition terms are the investment thesis of record.
  it("Acquisition rejects edits to acquisition_price (A-04)", () => {
    const r = AcquisitionUpdateSchema.safeParse({ acquisition_price: "999.0000" });
    expect(r.success).toBe(false);
  });

  // I-07: editing the counterparty would reclassify a related-party
  // agreement as arm's-length after the fact.
  //
  // This asserts LOUD rejection, not merely that the value is absent from the
  // output. A non-strict schema returns success with the field silently
  // stripped — the caller gets 200 OK and believes the change was applied.
  // Silent data loss on the field that decides related-party status is worse
  // than an error, because nothing surfaces it until an audit.
  it("Agreement REJECTS an update carrying counterparty_id (I-07)", () => {
    const r = AgreementUpdateSchema.safeParse({
      counterparty_id: "00000000-0000-4000-8000-000000000000",
    });
    expect(r.success).toBe(false);
  });

  it("Agreement rejects even when the immutable field rides along with a legal one", () => {
    const r = AgreementUpdateSchema.safeParse({
      agreement_type: "lease",
      counterparty_id: "00000000-0000-4000-8000-000000000000",
    });
    expect(r.success).toBe(false);
  });

  it("Agreement still accepts a legal update on its own", () => {
    expect(AgreementUpdateSchema.safeParse({ agreement_type: "lease" }).success).toBe(true);
  });

  it("Property REJECTS an update carrying vehicle_id (F-01)", () => {
    const r = PropertyUpdateSchema.safeParse({
      property_name: "Renamed",
      vehicle_id: "00000000-0000-4000-8000-000000000000",
    });
    expect(r.success).toBe(false);
  });

  // F-07: executed payouts cannot change. Corrections post offsetting entries.
  it("Distribution is append-only — no field is updatable (F-07)", () => {
    const r = DistributionUpdateSchema.safeParse({ amount: "1.0000" });
    expect(r.success).toBe(false);
  });

  // A-03: valuations are dated snapshots and accumulate.
  it("Valuation is append-only (A-03)", () => {
    const r = ValuationUpdateSchema.safeParse({ value: "1.0000" });
    expect(r.success).toBe(false);
  });
});

describe("money never becomes a float", () => {
  const base = FIXTURES.Acquisition;

  it("accepts a decimal string", () => {
    expect(AcquisitionSchema.safeParse({ ...base, acquisition_price: "12500000.5000" }).success).toBe(true);
  });

  it("rejects a JS number", () => {
    // The failure this prevents: a six-stage waterfall plus two 2.5% reserve
    // transfers over the same figure accumulates IEEE-754 error until F-02
    // and F-03 fail by pennies, then by more.
    expect(AcquisitionSchema.safeParse({ ...base, acquisition_price: 12500000.5 }).success).toBe(false);
  });

  it("rejects more precision than the ledger carries", () => {
    expect(AcquisitionSchema.safeParse({ ...base, acquisition_price: "1.000005" }).success).toBe(false);
  });
});

describe("closed value sets remain closed", () => {
  it("Resolution rejects an undeclared resolution_type", () => {
    const r = ResolutionSchema.safeParse({ ...FIXTURES.Resolution, resolution_type: "simple" });
    expect(r.success).toBe(false);
  });

  it("Resolution accepts the three constitutional thresholds", () => {
    for (const t of ["ordinary", "special", "unanimous"]) {
      expect(ResolutionSchema.safeParse({ ...FIXTURES.Resolution, resolution_type: t }).success).toBe(true);
    }
  });
});

describe("required fields are required", () => {
  it("Property without vehicle_id is rejected (F-01, A-02)", () => {
    const { vehicle_id, ...withoutVehicle } = FIXTURES.Property as Record<string, unknown>;
    expect(SCHEMAS.Property.safeParse(withoutVehicle).success).toBe(false);
  });
});
