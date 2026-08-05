/**
 * WHO GC SENDS AS
 *
 * These exist because the defect they guard against is invisible to the
 * person checking. Resend's sandbox sender delivers to the account
 * owner's own mailbox and rejects everybody else, so a founder testing
 * sign-in receives the link, sees it work, and ships a platform nobody
 * else can enter.
 */

import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { SENDER, senderAddress, isSandboxSender } from "../constants/sender";

const ROOT = path.join(__dirname, "..");
const original = process.env.RESEND_FROM;
afterEach(() => {
  if (original === undefined) delete process.env.RESEND_FROM;
  else process.env.RESEND_FROM = original;
});

describe("the sender", () => {
  it("is a real GC address on the verified domain", () => {
    expect(SENDER).toMatch(/@getawaycollective\.co>/);
    expect(SENDER).toMatch(/^Getaway Collective </);
  });

  it("never falls back to a sandbox sender", () => {
    delete process.env.RESEND_FROM;
    expect(senderAddress()).toBe(SENDER);
    expect(isSandboxSender()).toBe(false);
  });

  it("treats an empty or blank override as absent", () => {
    /* Vercel makes it easy to save a variable with nothing in it, and an
       empty string is not a sender. */
    for (const blank of ["", "   "]) {
      process.env.RESEND_FROM = blank;
      expect(senderAddress()).toBe(SENDER);
    }
  });

  it("lets a real override win", () => {
    process.env.RESEND_FROM = "Staging <staging@example.com>";
    expect(senderAddress()).toBe("Staging <staging@example.com>");
  });

  it("still reports a sandbox address if somebody sets one", () => {
    /* The constant removed the default, not the possibility. */
    process.env.RESEND_FROM = "Getaway Collective <onboarding@resend.dev>";
    expect(isSandboxSender()).toBe(true);
  });

  it("is resolved in one place, so three call sites cannot drift", () => {
    /* The sandbox default was copied into auth.ts, send.ts and leads.ts.
       A fourth copy is how it comes back. */
    for (const f of ["auth.ts", "lib/email/send.ts", "lib/leads.ts", "app/api/health/route.ts"]) {
      const src = fs.readFileSync(path.join(ROOT, f), "utf8");
      expect(src.includes("onboarding@resend.dev"), `${f} reintroduces the sandbox sender`).toBe(false);
      expect(
        /senderAddress\(\)|isSandboxSender\(\)/.test(src),
        `${f} should resolve the sender through constants/sender.ts`,
      ).toBe(true);
    }
  });
});
