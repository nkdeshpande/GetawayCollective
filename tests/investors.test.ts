/**
 * The investor record, asserted.
 *
 * Founder rulings, 24 Sep 2026: the investor's KYC and bank account are held
 * on the platform, and a partner sees only the estates they hold. These pin
 * the parts that must not drift: personal numbers never round-trip without
 * the key, tampering is caught, accreditation lapses on its date, and the
 * estate gate opens only for a holding or the Office.
 */
import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { encryptPii, decryptPii, last4, masked } from "../lib/pii";
import { accreditationCurrent, mayOpenEstate } from "../lib/investors";

const k = randomBytes(32);

describe("personal numbers at rest", () => {
  it("round-trips under the same key", () => {
    const c = encryptPii("123456789012", k);
    expect(c.startsWith("v1:")).toBe(true);
    expect(c).not.toContain("123456789012");
    expect(decryptPii(c, k)).toBe("123456789012");
  });

  it("never encrypts the same number to the same text", () => {
    expect(encryptPii("ABCDE1234F", k)).not.toBe(encryptPii("ABCDE1234F", k));
  });

  it("refuses a different key and a tampered value", () => {
    const c = encryptPii("123456789012", k);
    expect(() => decryptPii(c, randomBytes(32))).toThrow();
    const [v, iv, tag, ct] = c.split(":");
    const flipped = Buffer.from(ct, "base64url"); flipped[0] ^= 1;
    expect(() => decryptPii([v, iv, tag, flipped.toString("base64url")].join(":"), k)).toThrow();
  });

  it("refuses to store anything without a key", () => {
    const was = process.env.PII_ENCRYPTION_KEY;
    delete process.env.PII_ENCRYPTION_KEY;
    try { expect(() => encryptPii("123456789012")).toThrow(/PII_ENCRYPTION_KEY/); }
    finally { if (was !== undefined) process.env.PII_ENCRYPTION_KEY = was; }
  });

  it("shows only the last four", () => {
    expect(last4("1234 5678 9012")).toBe("9012");
    expect(masked("9012")).toBe("•••• •••• 9012");
    expect(masked(null)).toBe("Not on record");
  });
});

describe("accreditation is current only until it lapses", () => {
  const now = new Date("2026-09-24T00:00:00Z");
  it("holds while unexpired", () => expect(accreditationCurrent("accredited", new Date("2027-01-01"), now)).toBe(true));
  it("lapses on expiry", () => expect(accreditationCurrent("accredited", new Date("2026-09-01"), now)).toBe(false));
  it("is never current in any other state", () => expect(accreditationCurrent("pending", null, now)).toBe(false));
});

describe("a partner opens only the estates they hold", () => {
  const holdings = [{ key: "slowspace", units: "2", votingPercent: "20" }];
  it("opens a held estate", () => expect(mayOpenEstate({ office: false, holdings }, "slowspace")).toBe(true));
  it("refuses one not held", () => expect(mayOpenEstate({ office: false, holdings }, "coorgcreek")).toBe(false));
  it("refuses everything to someone holding nothing", () => expect(mayOpenEstate({ office: false, holdings: [] }, "slowspace")).toBe(false));
  it("opens every estate to the Office", () => expect(mayOpenEstate({ office: true, holdings: [] }, "wildwood")).toBe(true));
});
