/**
 * The investor record's rules, asserted.
 *
 * 25 Sep 2026. The Office now writes investors, KYC, payment accounts and
 * holdings (lib/office-records.ts). These pin the rules those acts rest on,
 * and the constitutional wiring that decides who may perform them.
 */
import { describe, it, expect } from "vitest";
import {
  RecordBankBody, RecordKycBody, RegisterInvestorBody,
  aboveVotingCap, conservationRefusal, kycRefusal, microUnits, fromMicro, suggestedVehicleState, votingPercent, rupeesFromMinor,
} from "../lib/office-rules";
import { ROLE_RIGHTS, authorise, ENTERPRISE, type Grant } from "../lib/authority";
import { CAPABILITY_BY_NAME } from "../lib/commands";
import { DECISION_EVENTS } from "../lib/events";
import { INTERNAL_ONLY_RIGHTS } from "../lib/access-admin";

const STAGES_VERIFIED = { identity: "verified", address: "verified", tax_residency: "verified", source_of_funds: "verified", suitability: "verified", screening: "verified" } as const;

describe("voting share is derived from units", () => {
  it("divides units held by units issued", () => {
    expect(votingPercent("1", 4)).toBe("25");
    expect(votingPercent("1", 6)).toBe("16.666666");
    expect(votingPercent("2", 6)).toBe("33.333333");
  });
  it("keeps six decimals of units exactly", () => {
    expect(fromMicro(microUnits("0.1") + microUnits("0.2"))).toBe("0.3");
    expect(microUnits("2.000000")).toBe(2_000_000n);
  });
  it("flags, but does not refuse, a holding above the 10% cap", () => {
    expect(aboveVotingCap("16.666666")).toBe(true);
    expect(aboveVotingCap("10")).toBe(false);
  });
});

describe("the units recorded never exceed the units issued", () => {
  it("allows a register that is not yet complete", () => expect(conservationRefusal(["1", "2"], "1", 6)).toBeNull());
  it("allows filling it exactly", () => expect(conservationRefusal(["1", "2"], "3", 6)).toBeNull());
  it("refuses going past it, and says how many remain", () => {
    expect(conservationRefusal(["1", "2"], "4", 6)).toMatch(/7 units in a vehicle that issued 6\. 3 remain/);
  });
  it("refuses a holding of nothing", () => expect(conservationRefusal([], "0", 6)).toMatch(/more than zero/));
});

describe("KYC reads verified only when every stage is", () => {
  it("accepts verified with every stage and a date", () =>
    expect(kycRefusal({ kycState: "verified", stages: STAGES_VERIFIED, verifiedOn: "2026-09-25" })).toBeNull());
  it("names the stages still open", () =>
    expect(kycRefusal({ kycState: "verified", stages: { ...STAGES_VERIFIED, screening: "in_progress" }, verifiedOn: "2026-09-25" })).toMatch(/Screening is not/));
  it("needs the date", () => expect(kycRefusal({ kycState: "verified", stages: STAGES_VERIFIED })).toMatch(/date/));
  it("leaves any other state alone", () => expect(kycRefusal({ kycState: "in_progress", stages: { ...STAGES_VERIFIED, identity: "not_started" } })).toBeNull());
  it("refuses a malformed PAN", () =>
    expect(RecordKycBody.safeParse({ kycState: "in_progress", stages: STAGES_VERIFIED, pan: "ABC123", reason: "Documents received by IR" }).success).toBe(false));
});

describe("the payment account", () => {
  const base = { holder: "Anika Rao", bankName: "HDFC Bank", ifsc: "hdfc0001234", method: "penny_drop", reason: "Instruction from the partner" };
  it("accepts a number typed twice, ignoring spaces", () => {
    const r = RecordBankBody.safeParse({ ...base, account: "5010 0123 4567", accountAgain: "501001234567" });
    expect(r.success).toBe(true);
    if (r.success) { expect(r.data.account).toBe("501001234567"); expect(r.data.ifsc).toBe("HDFC0001234"); }
  });
  it("refuses two numbers that differ", () =>
    expect(RecordBankBody.safeParse({ ...base, account: "501001234567", accountAgain: "501001234568" }).success).toBe(false));
  it("refuses a malformed IFSC", () =>
    expect(RecordBankBody.safeParse({ ...base, ifsc: "HDFC1234", account: "501001234567", accountAgain: "501001234567" }).success).toBe(false));
});

describe("registration", () => {
  it("normalises the address and the jurisdiction", () => {
    const r = RegisterInvestorBody.safeParse({ legalName: "Anika Rao", email: " Anika@Example.com ", taxJurisdiction: "in-ka" });
    expect(r.success && r.data.email).toBe("anika@example.com");
    expect(r.success && r.data.taxJurisdiction).toBe("IN-KA");
  });
});

describe("the register's words, mapped only where they mean the same", () => {
  it("maps forming, raising and dissolved", () => expect(["forming", "raising", "dissolved"].map(suggestedVehicleState)).toEqual(["forming", "raising", "dissolved"]));
  it("leaves funded and live to the Office", () => expect([suggestedVehicleState("funded"), suggestedVehicleState("live")]).toEqual([null, null]));
  it("reads register rupees", () => expect(rupeesFromMinor(3960000_0000n)).toBe("3960000"));
});

describe("who may perform each act", () => {
  it("gives the record's rights to the Compliance Office and the Board only", () => {
    const holders = (r: string) => Object.entries(ROLE_RIGHTS).filter(([, rs]) => (rs as readonly string[]).includes(r)).map(([role]) => role);
    expect(holders("investor.register")).toEqual(["compliance_office"]);
    expect(holders("kyc.record")).toEqual(["compliance_office"]);
    expect(holders("bank.record")).toEqual(["compliance_office"]);
    expect(holders("position.record")).toEqual(["board"]);
  });
  it("never lets the office that pays also change where it pays", () => {
    const payer = Object.entries(ROLE_RIGHTS).filter(([, rs]) => rs.includes("distribution.execute")).map(([r]) => r);
    for (const role of payer) expect(ROLE_RIGHTS[role as keyof typeof ROLE_RIGHTS]).not.toContain("bank.record");
  });
  it("keeps all four internal-only", () => {
    for (const r of ["investor.register", "kyc.record", "bank.record", "position.record"] as const) expect(INTERNAL_ONLY_RIGHTS).toContain(r);
  });
  it("requires a reason for KYC, the account and a holding, and keeps it on the event", () => {
    for (const n of ["RecordKyc", "RecordBankAccount", "RecordRegisterEntry"]) expect(CAPABILITY_BY_NAME[n].requiresReason, n).toBe(true);
    expect(DECISION_EVENTS.has("KycRecorded")).toBe(true);
    expect(DECISION_EVENTS.has("BankAccountRecorded")).toBe(true);
  });
  it("refuses a member, and admits the compliance office", () => {
    const at = "2026-09-25T00:00:00.000Z";
    const g = (role: Grant["role"]): Grant[] => [{ grantId: "g1", identityId: "p1", role, scope: ENTERPRISE, grantedBy: "b", grantedAt: at }];
    expect(authorise("p1", "bank.record", ENTERPRISE, g("member"), at).allowed).toBe(false);
    expect(authorise("p1", "bank.record", ENTERPRISE, g("compliance_office"), at).allowed).toBe(true);
  });
});
