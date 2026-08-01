/**
 * The notification catalogue — N-01 through N-17
 *
 * The words are data, so the rules about the words are testable. These
 * hold the catalogue to the constraints the workbook rows stated.
 */

import { describe, it, expect } from "vitest";
import { NOTICES, SPECIMEN_CONTEXT, noticeById } from "../content/notifications";

const words = (id: string) => {
  const n = noticeById(id)!;
  const r = n.render(SPECIMEN_CONTEXT);
  return [r.title, ...r.body, ...(r.facts ?? []).map((f) => f.k + " " + f.v)].join(" ");
};

describe("the catalogue", () => {
  it("carries N-01 through N-17, each once", () => {
    expect(NOTICES).toHaveLength(17);
    const ids = NOTICES.map((n) => n.id);
    expect(new Set(ids).size).toBe(17);
    for (let i = 1; i <= 17; i++) {
      expect(ids).toContain("N-" + String(i).padStart(2, "0"));
    }
  });

  it("reserves critical for the Member Law and covenant proximity", () => {
    const crit = NOTICES.filter((n) => n.urgency === "critical").map((n) => n.id);
    expect(crit).toEqual(["N-05", "N-15"]);
  });

  it("has exactly one wired notification, and it is lead capture", () => {
    // Adding a second means an event source exists — update this WITH it.
    expect(NOTICES.filter((n) => n.wired).map((n) => n.id)).toEqual(["N-17"]);
  });

  it("renders every specimen without throwing, with a title and body", () => {
    for (const n of NOTICES) {
      const r = n.render(SPECIMEN_CONTEXT);
      expect(r.title.length, n.id).toBeGreaterThan(4);
      expect(r.body.length, n.id).toBeGreaterThan(0);
    }
  });
});

describe("the wordings hold their law", () => {
  it("N-03 repeats the Member Law — a deposit is not a purchase", () => {
    expect(words("N-03")).toContain("not a partner");
    expect(words("N-03")).toContain("settlement");
  });

  it("N-05 states settlement, irreversibility, and Form 4", () => {
    const w = words("N-05");
    expect(w).toContain("irreversible");
    expect(w).toContain("settlement");
    expect(w).toContain("Form 4");
  });

  it("N-06 and N-07 state the threshold and that a tie is not approval", () => {
    expect(words("N-06")).toContain("tie is not approval");
    expect(words("N-07")).toContain("tie is not approval");
    expect(words("N-06")).toContain("50%");
  });

  it("N-08 publishes a tally and seals the ballot", () => {
    const w = words("N-08");
    expect(w).toContain("secret");
    expect(w).toContain("%");
    // No individual is named. The specimen carries no name, and the rule
    // is stated in the body.
    expect(w).toContain("sealed");
    expect(w).not.toMatch(/voted (for|against) by [A-Z]/);
  });

  it("N-11 explains a blocked distribution as design, naming the floor", () => {
    const w = words("N-11");
    expect(w).toContain("floor");
    expect(w).toContain("not a failure");
    expect(w).toContain("retained");
  });

  it("N-13 admits it is blocked on the lapse policy (D-07)", () => {
    expect(words("N-13")).toContain("D-07");
  });

  it("N-15 is office-only and never member-facing", () => {
    const n = noticeById("N-15")!;
    expect(n.audience).toBe("office");
    expect(words("N-15")).toContain("Board sign-off");
  });

  it("N-16 names the valuation source", () => {
    expect(words("N-16")).toContain("Nomura");
  });

  it("forward-looking amounts carry a confidence class", () => {
    // N-09 and N-10 render pre-operation amounts; both must be marked.
    expect(noticeById("N-09")!.render(SPECIMEN_CONTEXT).conf).toBe("forecast");
    expect(noticeById("N-10")!.render(SPECIMEN_CONTEXT).conf).toBe("forecast");
  });
});
