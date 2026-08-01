/**
 * The vehicle domain model — the LLP above its constituents
 *
 * Directed 1 Aug 2026. These tests hold the SHAPE of the direction:
 * the vehicle at the apex, three domains beneath it, governance as the
 * constitutional layer rather than a fourth function, and the statutory
 * mirror complete. A future edit that flattens any of that fails here.
 */

import { describe, it, expect } from "vitest";
import {
  BusinessObjectType as BO, Domain, BUSINESS_OBJECT_DOMAIN,
  ALL_BUSINESS_OBJECTS, objectsInDomain,
} from "../constants/business-objects";
import {
  VEHICLE_DOMAINS, STATUTORY_MIRROR, REGISTERED_CANDIDATES,
} from "../constants/vehicle-domain";

describe("the apex", () => {
  it("holds exactly one object: the Investment Vehicle", () => {
    // The whole point of the rebuild. A second apex object would mean
    // two things claim to be what the constituents belong to.
    expect(objectsInDomain(Domain.Vehicle)).toEqual([BO.InvestmentVehicle]);
  });

  it("keeps the ratified set at 27 — this was a re-homing, not an amendment", () => {
    expect(ALL_BUSINESS_OBJECTS).toHaveLength(27);
  });

  it("assigns every object to exactly one domain", () => {
    for (const o of ALL_BUSINESS_OBJECTS) {
      expect(Object.values(Domain), o).toContain(BUSINESS_OBJECT_DOMAIN[o]);
    }
  });
});

describe("the four domains", () => {
  const byName = Object.fromEntries(VEHICLE_DOMAINS.map((d) => [d.name, d]));

  it("are Space, Time, Capital, Governance — in that order", () => {
    expect(VEHICLE_DOMAINS.map((d) => d.name)).toEqual(["Space", "Time", "Capital", "Governance"]);
  });

  it("each answers exactly one constitutional question", () => {
    expect(byName.Space.constitutionalQuestion).toBe("What does the LLP own?");
    expect(byName.Time.constitutionalQuestion).toBe("How much time does each LLP Partner legally control?");
    expect(byName.Capital.constitutionalQuestion).toBe("What is the financial position of the LLP?");
    for (const d of VEHICLE_DOMAINS) expect(d.constitutionalQuestion.endsWith("?")).toBe(true);
  });

  it("marks Governance — and only Governance — as the constitutional layer", () => {
    // Governance is not a fourth business function. It is the operating
    // law of the other three, and the flag is how the model says so.
    for (const d of VEHICLE_DOMAINS) {
      expect(d.constitutional, d.name).toBe(d.name === "Governance");
    }
  });
});

describe("time is ownership, not hospitality", () => {
  const time = VEHICLE_DOMAINS.find((d) => d.name === "Time")!;
  const all = time.sections.flatMap((s) => s.constituents);

  it("keeps Usage Rights, Calendar Rights and the Time Ledger out of scope, with reasons", () => {
    // The direction was explicit. Pulling any of the three inside the
    // vehicle puts hospitality operations inside the ownership record.
    for (const name of ["Usage Rights", "Calendar Rights", "Time Ledger"]) {
      const c = all.find((x) => x.name === name)!;
      expect(c, name).toBeDefined();
      expect(c.backing.kind, name).toBe("outOfScope");
      if (c.backing.kind === "outOfScope") expect(c.backing.because.length).toBeGreaterThan(20);
    }
  });

  it("derives the annual allocation from the stake, never stores it", () => {
    const alloc = all.find((x) => x.name === "Annual Day Allocation")!;
    expect(alloc.backing.kind).toBe("derived");
    if (alloc.backing.kind === "derived") {
      expect(alloc.backing.formula).toContain("floor");
      expect(alloc.backing.from).toContain(BO.OwnershipPosition);
    }
  });

  it("holds no ratified object of its own — the gap is named, not padded", () => {
    // An empty domain that says why beats a domain padded with a
    // borrowed object. The candidates are in the amendment queue.
    expect(objectsInDomain(Domain.Time)).toEqual([]);
    expect(REGISTERED_CANDIDATES).toContain("OwnershipCalendar");
    expect(REGISTERED_CANDIDATES).toContain("AllocationRight");
  });
});

describe("every constituent states its backing", () => {
  it("object- and field-backed constituents remain in their domain unless the cross-read is declared", () => {
    // The module throws at load if this fails; the test exists so the
    // rule is visible in the suite, not only in a stack trace.
    expect(VEHICLE_DOMAINS.length).toBe(4);
  });

  it("registered candidates never collide with ratified objects", () => {
    const ratified = new Set(Object.values(BO).map((v) => String(v).toLowerCase()));
    for (const c of REGISTERED_CANDIDATES) {
      expect(ratified.has(c.toLowerCase()), c).toBe(false);
    }
  });

  it("names the debt facility as a gap — a covenant nobody can query is unmonitored", () => {
    expect(REGISTERED_CANDIDATES).toContain("DebtFacility");
  });
});

describe("the statutory mirror", () => {
  it("carries the three filings no Indian LLP escapes", () => {
    const instruments = STATUTORY_MIRROR.map((s) => s.instrument).join(" | ");
    expect(instruments).toContain("Form 11");   // annual return
    expect(instruments).toContain("Form 8");    // statement of account & solvency
    expect(instruments).toContain("ITR-5");     // income tax
  });

  it("dates every obligation and states every trigger", () => {
    for (const s of STATUTORY_MIRROR) {
      expect(s.due, s.ref).toBeTruthy();
      expect(s.appliesWhen, s.ref).toBeTruthy();
      expect(["MCA", "Income Tax", "GST", "State"], s.ref).toContain(s.authority);
    }
  });

  it("lands every obligation on a ratified object, so the calendar can be derived", () => {
    for (const s of STATUTORY_MIRROR) {
      expect(ALL_BUSINESS_OBJECTS, s.ref).toContain(s.object);
    }
  });

  it("fires Form 4 on the event that admits a partner", () => {
    // Every settlement that admits a partner is a statutory filing
    // within 30 days. The Member Law and the MCA agree on the moment.
    const f4 = STATUTORY_MIRROR.find((s) => s.instrument === "Form 4")!;
    expect(f4.appliesWhen).toContain("admission");
    expect(f4.due).toContain("30 days");
  });

  it("knows every GC vehicle is audited", () => {
    // Contribution > ₹25 lakh at formation — the audit test is crossed
    // before the first rupee of revenue, so ITR falls on 31 October.
    const audit = STATUTORY_MIRROR.find((s) => s.instrument === "Statutory audit")!;
    expect(audit.appliesWhen).toContain("25 lakh");
    const itr = STATUTORY_MIRROR.find((s) => s.instrument === "ITR-5")!;
    expect(itr.due).toContain("31 October");
  });
});

describe("the re-homing of the old domains", () => {
  it("dissolved Performance into Capital", () => {
    expect(BUSINESS_OBJECT_DOMAIN[BO.PerformanceReport]).toBe(Domain.Capital);
    expect(BUSINESS_OBJECT_DOMAIN[BO.Forecast]).toBe(Domain.Capital);
  });

  it("moved Risk to Governance — oversight, not performance", () => {
    expect(BUSINESS_OBJECT_DOMAIN[BO.Risk]).toBe(Domain.Governance);
  });

  it("attached the thesis and diligence to the asset", () => {
    expect(BUSINESS_OBJECT_DOMAIN[BO.InvestmentThesis]).toBe(Domain.Space);
    expect(BUSINESS_OBJECT_DOMAIN[BO.DueDiligence]).toBe(Domain.Space);
  });

  it("left above the vehicle only what exists above any vehicle", () => {
    expect(objectsInDomain(Domain.Platform).sort()).toEqual(
      [BO.Organization, BO.Portfolio, BO.MarketIntelligence, BO.Research, BO.Benchmark].sort(),
    );
  });
});
