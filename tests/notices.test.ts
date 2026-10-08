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
  it("carries N-01 through N-17, N-21 and N-23, each once", () => {
    // 18 with N-23, 6 Oct 2026; 19 with N-21, the KYC review, 8 Oct 2026.
    expect(NOTICES).toHaveLength(19);
    const ids = NOTICES.map((n) => n.id);
    expect(new Set(ids).size).toBe(19);
    expect(ids).toContain("N-21");
    expect(ids).toContain("N-23");
    for (let i = 1; i <= 17; i++) {
      expect(ids).toContain("N-" + String(i).padStart(2, "0"));
    }
  });

  it("reserves critical for the Member Law and covenant proximity", () => {
    const crit = NOTICES.filter((n) => n.urgency === "critical").map((n) => n.id);
    expect(crit).toEqual(["N-05", "N-15"]);
  });

  it("has four wired notifications: the receipt, lead capture, the KYC review, and the acknowledgement", () => {
    // Adding a second means an event source exists — update this WITH it.
    expect(NOTICES.filter((n) => n.wired).map((n) => n.id)).toEqual(["N-03", "N-17", "N-21", "N-23"]);
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

  it("N-16 names a source and its class, and invents no figure or estate", () => {
    expect(words("N-16")).toContain("Source");
    expect(words("N-16")).toContain("none exists yet");
    expect(words("N-16")).not.toMatch(/Kyoto|Nomura|₹/);
  });
  it("N-12 gives one night a year for each 1% held (founder, 6 Oct 2026)", () => {
    const n = noticeById("N-12")!;
    expect(n.render({ ...SPECIMEN_CONTEXT, bps: 1000 }).title).toBe("Your 10 nights for the year can be drawn");
    expect(n.render({ ...SPECIMEN_CONTEXT, bps: 100 }).title).toBe("Your 1 night for the year can be drawn");
    expect(n.render({ ...SPECIMEN_CONTEXT, bps: 1250 }).facts?.[0].v).toBe("12 a year · 12.5% held");
  });
  it("N-03 is the receipt: the estate, the payee, the reference, a way back, and no amount in its title", () => {
    const r = noticeById("N-03")!.render({ ...SPECIMEN_CONTEXT, hold: { estate: "SlowSpace Creek", slug: "coorg-coffee-creek", payee: "SlowSpace Coorg Creek LLP", units: 2, payment: "pay_1", reference: "ref-1" } });
    expect(r.title).toBe("Your slot is reserved: SlowSpace Creek");
    expect(r.title).not.toMatch(/₹|\d{2,}/);
    expect(r.facts?.map((f) => f.v)).toEqual(["SlowSpace Creek", "SlowSpace Coorg Creek LLP", "2", "pay_1", "ref-1"]);
    expect(r.links?.[0].to).toBe("/reserve/coorg-coffee-creek#r=ref-1");
    expect(r.body.join(" ")).toContain("Capital is at risk");
  });
  it("links to no page that has been retired", () => {
    for (const n of NOTICES) for (const l of n.render(SPECIMEN_CONTEXT).links ?? []) {
      expect(l.to, `${n.id} -> ${l.to}`).not.toMatch(/^\/(flow|member|passport|capital)|kyoto/);
    }
  });

  it("forward-looking amounts carry a confidence class", () => {
    // N-09 and N-10 render pre-operation amounts; both must be marked.
    expect(noticeById("N-09")!.render(SPECIMEN_CONTEXT).conf).toBe("FORECAST");
    expect(noticeById("N-10")!.render(SPECIMEN_CONTEXT).conf).toBe("FORECAST");
  });
});
