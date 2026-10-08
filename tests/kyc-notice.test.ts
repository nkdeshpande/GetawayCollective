/**
 * N-21, THE KYC REVIEW — GC-08-DS-001
 *
 * 8 Oct 2026. When a review is worth telling the person about, and what the
 * notice then says. It never carries the Office's reason, never promises a
 * time, and is silent for a save that changed nothing the person can see.
 */
import { describe, it, expect } from "vitest";
import { kycChange } from "../lib/notices/kyc";
import { noticeById, SPECIMEN_CONTEXT } from "../content/notifications";
import { renderForSend } from "../lib/email/send";

const none = { identity: "not_started", address: "not_started", tax_residency: "not_started", source_of_funds: "not_started", suitability: "not_started", screening: "not_started" };
const all = Object.fromEntries(Object.keys(none).map((k) => [k, "verified"]));

describe("what a review changed", () => {
  it("is nothing for a first save that only starts the checks", () =>
    expect(kycChange({ state: null, stages: null }, { state: "in_progress", stages: { ...none, identity: "in_progress" } })).toBeNull());
  it("is nothing when the same record is saved again", () =>
    expect(kycChange({ state: "verified", stages: all }, { state: "verified", stages: all })).toBeNull());
  it("names the checks accepted in this review, and only those", () => {
    const before = { state: "in_progress", stages: { ...none, identity: "verified" } };
    const after = { state: "in_progress", stages: { ...none, identity: "verified", address: "verified", tax_residency: "verified" } };
    expect(kycChange(before, after)).toEqual({ accepted: ["Address", "Tax residency and PAN"], needed: [], complete: false, review: false });
  });
  it("names the checks that need something", () =>
    expect(kycChange({ state: "in_progress", stages: none }, { state: "in_progress", stages: { ...none, source_of_funds: "needs_update" } }))
      .toEqual({ accepted: [], needed: ["Source of funds"], complete: false, review: false }));
  it("says the record is complete when it becomes verified", () =>
    expect(kycChange({ state: "in_progress", stages: { ...all, screening: "in_progress" } }, { state: "verified", stages: all }))
      .toEqual({ accepted: ["Screening"], needed: [], complete: true, review: false }));
  it("says the record needs bringing up to date when no single check is named", () =>
    expect(kycChange({ state: "verified", stages: all }, { state: "needs_update", stages: all }))
      .toEqual({ accepted: [], needed: [], complete: false, review: true }));
});

describe("what N-21 says", () => {
  const spec = noticeById("N-21")!;
  const say = (kyc: NonNullable<typeof SPECIMEN_CONTEXT.kyc>) => {
    const r = spec.render({ ...SPECIMEN_CONTEXT, kyc });
    return { title: r.title, words: [r.title, ...r.body, ...(r.facts ?? []).map((f) => `${f.k}: ${f.v}`)].join(" ") };
  };

  it("goes to the person by email and to their notices, and is live", () => {
    expect(spec).toMatchObject({ audience: "investor", urgency: "high", wired: true });
    expect(spec.channels).toEqual(["email", "product"]);
    expect(renderForSend("N-21").ok).toBe(true);
  });
  it("leads with what is needed when something is", () => {
    const s = say({ accepted: ["Identity"], needed: ["Source of funds"], complete: false, review: false });
    expect(s.title).toBe("Something is needed for your identity checks");
    expect(s.words).toContain("Needs something more from you: Source of funds.");
    expect(s.words).toContain("Reviewed and accepted: Identity.");
    expect(s.words).toContain("Investor Relations will tell you exactly what to send");
  });
  it("says so plainly when every check is complete", () => {
    const s = say({ accepted: ["Screening"], needed: [], complete: true, review: false });
    expect(s.title).toBe("Your identity checks are complete");
    expect(s.words).toContain("Nothing further is needed from you");
  });
  it("reports progress without asking for anything", () => {
    const s = say({ accepted: ["Address"], needed: [], complete: false, review: false });
    expect(s.title).toBe("Your identity checks have moved on");
    expect(s.words).not.toContain("Reply to this message");
  });
  it("never promises a time, never decides about an estate, and asks for no documents by email", () => {
    for (const kyc of [
      { accepted: ["Identity"], needed: ["Address"], complete: false, review: false },
      { accepted: [], needed: [], complete: false, review: true },
      { accepted: ["Screening"], needed: [], complete: true, review: false },
    ]) {
      const w = say(kyc).words;
      expect(w).not.toMatch(/\b(within|hours?|working days?|shortly|soon)\b/i);
      expect(w).toContain("commit you to nothing");
    }
    expect(say({ accepted: [], needed: [], complete: false, review: true }).words).toContain("do not send documents by email");
  });
});
