/**
 * The three vehicles, and what a reader may do about each.
 *
 * Written 20 Sep 2026, when the founder settled C-03, C-04, C-06 and C-09
 * and closed two of the three raises. The arithmetic assertions matter most:
 * "fully subscribed" is only true if the offering reconciles, and before
 * this it did not — Solace's four units of 25 lakh summed to 1.00 Cr against
 * a stated 1.50 Cr offering.
 */
import { describe, it, expect } from "vitest";
import {
  CONFLICTS, VEHICLES, blockingFor, isOpen, openVehicles, publishable,
  stanceFor, vehicleByKey,
} from "../constants/vehicles";
import { dossierFor } from "../app/_assemblies/investordossier";
import {
  IS_FULLY_SUBSCRIBED, REMAINING_BPS, SITE, SUBSCRIBED_UNITS, UNITS_IN_VEHICLE,
} from "../app/_assemblies/slowspace";

const coastal = vehicleByKey("slowspace")!;
const solace = vehicleByKey("solace")!;
const creek = vehicleByKey("coorgcreek")!;

describe("exactly one vehicle is open", () => {
  it("is The Creek, and only The Creek", () => {
    expect(openVehicles().map((v) => v.key)).toEqual(["coorgcreek"]);
    expect(isOpen(creek)).toBe(true);
    expect(isOpen(coastal)).toBe(false);
    expect(isOpen(solace)).toBe(false);
  });

  it("puts the two closed vehicles on a waitlist, not behind a closed door", () => {
    for (const v of [coastal, solace]) {
      const s = stanceFor(v);
      expect(s.kind).toBe("waitlist");
      expect(v.lifecycle).toBe("funded");
      expect(v.buildStage).toBe("under-construction");
      expect(v.offering.available).toBe(0);
      expect(v.offering.subscribed).toBe(v.offering.units);
    }
  });

  it("states The Creek's remaining capacity rather than implying it", () => {
    const s = stanceFor(creek);
    expect(s).toEqual({ kind: "open", unitsAvailable: 4 });
    expect(creek.lifecycle).toBe("raising");
  });
});

describe("a closed vehicle's numbers reconcile, or it is not closed", () => {
  it("Coastal: six units of Rs 40L, plus the sponsor, is the whole equity layer", () => {
    const o = coastal.offering;
    expect(o.unitPrice * BigInt(o.units)).toBe(o.offered);
    expect(o.promoter + o.offered).toBe(o.totalEquity);
    expect(o.totalEquity).toBe(coastal.stack.equityLayer);
  });

  it("Solace: C-03 settled at the sheet-3 reading, and it now closes", () => {
    const o = solace.offering;
    expect(o.unitPrice * BigInt(o.units)).toBe(o.offered); // 4 x 25L = 1.00 Cr
    expect(o.promoter + o.offered).toBe(o.totalEquity);    // 1.00 + 1.00 = 2.00 Cr
    expect(o.totalEquity).toBe(solace.stack.equityLayer);  // agrees with sheet 3
  });

  it("every vehicle's equity plus facility is its project total", () => {
    for (const v of VEHICLES) {
      expect(v.stack.equityLayer + v.stack.facility).toBe(v.stack.projectTotal);
    }
  });
});

describe("the register is settled", () => {
  it("has no blocking conflict left on any vehicle", () => {
    expect(CONFLICTS.filter((c) => c.severity === "blocking")).toHaveLength(0);
    for (const v of VEHICLES) expect(blockingFor(v.key)).toHaveLength(0);
  });

  it("stamps each settled conflict with the date it was settled", () => {
    for (const id of ["C-03", "C-04", "C-06", "C-09"]) {
      const c = CONFLICTS.find((x) => x.id === id)!;
      expect(c.severity).toBe("advisory");
      expect(c.what).toContain("SETTLED 20 Sep 2026");
      expect(c.settledBy).toContain("Settled 20 Sep 2026");
    }
  });

  it("still refuses Solace a public offering, because governance is unstated", () => {
    // An absence, not a contradiction — and it is the one gap left.
    const gate = publishable(solace);
    expect(gate.ok).toBe(false);
    expect(gate.because.join(" ")).toContain("Governance");
    expect(solace.governance).toBeNull();
  });
});

describe("the commit page will not invite a commitment that cannot be made", () => {
  it("offers Coastal a waitlist and says what it is not", () => {
    const d = dossierFor(coastal, "commit")!;
    expect(d.action).toBe("Join the waitlist");
    expect(d.title).toContain("fully subscribed");
    expect(d.note).toContain("creates no commitment");
    expect(d.actionHref).toBe("/collection/slowspace-coastal/enquire");
    const body = JSON.stringify(d);
    expect(body).toContain("An allocation");   // stated as what it is NOT
    expect(body).toContain("Nothing");         // a waitlist place costs nothing
  });

  it("still asks The Creek's reader for the conditions of a real commitment", () => {
    const d = dossierFor(creek, "commit")!;
    expect(d.action).toBe("Speak with Investor Relations");
    expect(d.actionHref).toBeUndefined();   // an open vehicle walks on through diligence
    expect(d.note).toContain("Nothing on this page creates a commitment");
    expect(JSON.stringify(d)).toContain("4 of 4 units");
  });
});

describe("the public Coastal page agrees with the register", () => {
  it("is fully subscribed, with nothing remaining", () => {
    expect(SUBSCRIBED_UNITS).toBe(UNITS_IN_VEHICLE);
    expect(REMAINING_BPS).toBe(0);
    expect(IS_FULLY_SUBSCRIBED).toBe(true);
  });

  it("states the site area the register states", () => {
    expect(SITE.landArea).toBe(coastal.landArea);
    expect(SITE.landArea).toContain(".3 acres");
  });
});
