import { describe, it, expect } from "vitest";
import { VEHICLES, vehicleBySlug, publishable } from "../constants/vehicles";
import { dossierFor, inr, modelledYield, type DossierKey } from "../app/_assemblies/investordossier";

const KEYS: DossierKey[] = ["overview", "asset", "financials", "structure", "risks", "dataroom", "commit"];
const creek = vehicleBySlug("coorg-coffee-creek")!;

describe("investor dossier", () => {
  it("formats rupees in the units investors read", () => {
    expect(inr(60000000_0000n)).toBe("₹6.00 Cr");
    expect(inr(8700000_0000n)).toBe("₹87.00 L");
    expect(inr(50000_0000n)).toBe("₹50,000");
  });

  it("gives every tab to a publishable vehicle, and only to one", () => {
    expect(publishable(creek).ok).toBe(true);
    for (const k of KEYS) expect(dossierFor(creek, k)).not.toBeNull();
    for (const v of VEHICLES.filter((x) => !publishable(x).ok)) {
      for (const k of KEYS) expect(dossierFor(v, k)).toBeNull();
    }
  });

  it("derives the yield from the record, on its stated basis", () => {
    const y = modelledYield(creek)!;
    expect(y.bps).toBe(1204); // 25% of ₹4.818 Cr over the ₹10 Cr equity layer
    const fin = dossierFor(creek, "financials")!;
    expect(JSON.stringify(fin)).toContain("12.04%");
    expect(JSON.stringify(fin)).toContain(creek.operating.yieldBasis!);
  });

  it("reconciles the capital stack it prints", () => {
    expect(creek.stack.equityLayer + creek.stack.facility).toBe(creek.stack.projectTotal);
    expect(JSON.stringify(dossierFor(creek, "financials"))).toContain("reconciles");
    expect(JSON.stringify(dossierFor(creek, "financials"))).not.toContain("DOES NOT");
  });

  it("renders an absent field as absent, never as zero", () => {
    const s = JSON.stringify(dossierFor(creek, "structure"));
    expect(creek.llpin).toBeNull();
    expect(s).toContain("Not yet stated");
  });

  it("never claims title is verified, and every row states its basis", () => {
    expect(JSON.stringify(dossierFor(creek, "asset"))).toContain("not been verified");
    for (const k of KEYS) {
      for (const sec of dossierFor(creek, k)!.sections) {
        for (const r of sec.rows) expect(r.basis.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not let the commit page create or imply a commitment", () => {
    expect(dossierFor(creek, "commit")!.note).toContain("Nothing on this page creates a commitment");
  });
});
