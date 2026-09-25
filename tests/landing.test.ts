/**
 * One sign-in for everyone; the record decides where it lands. 25 Sep 2026.
 * KYC decides none of it: it is a parallel process that completes before
 * the LLP agreement is signed, never a gate on looking or holding.
 */
import { describe, it, expect } from "vitest";
import { landingFor, raisingSlug, accountLabel } from "../lib/landing";

const who = (o: Partial<{ identified: boolean; accredited: boolean; member: boolean; office: boolean }>) =>
  ({ identified: true, accredited: false, member: false, office: false, ...o });

describe("where a sign-in lands", () => {
  it("sends the Office to the Office, whatever else they are", () => expect(landingFor(who({ office: true, member: true }), "x")).toBe("/office"));
  it("sends a partner to their holdings", () => expect(landingFor(who({ member: true, accredited: true }), "x")).toBe("/home"));
  it("sends an accredited investor to the full offering raising now", () => expect(landingFor(who({ accredited: true }), "coorg-coffee-creek")).toBe("/invest/coorg-coffee-creek"));
  it("sends anyone else straight to the estate raising now, with no check first", () =>
    expect(landingFor(who({}), "coorg-coffee-creek")).toBe("/collection/coorg-coffee-creek"));
  it("falls back to the collection when nothing is raising", () => expect(landingFor(who({}), null)).toBe("/collection"));
  it("asks a visitor who is not signed in to sign in", () => expect(landingFor(who({ identified: false }), "x")).toBe("/sign-in"));
  it("reads the estate raising now from the register", () => expect(raisingSlug()).toBe("coorg-coffee-creek"));
});

describe("the site bar", () => {
  it("names each person's own place", () => {
    expect(accountLabel(null)).toBe("Sign in");
    expect(accountLabel("office")).toBe("Office");
    expect(accountLabel("member")).toBe("Your holdings");
    expect(accountLabel("identified")).toBe("Your account");
    expect(accountLabel("accredited")).toBe("Your account");
  });
});
