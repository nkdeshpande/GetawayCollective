/**
 * PII AT REST — AES-256-GCM, for the numbers that must never be read back
 *
 * 24 Sep 2026. The first code to meet inv-008 (PII_IS_ENCRYPTED), for the
 * two fields where a leak costs most: the distribution bank account and the
 * PAN (UFR-0172, UFR-0177). Each is stored as
 *
 *     v1:<iv>:<auth tag>:<ciphertext>        (all base64url)
 *
 * beside its last four characters, which is all any screen ever shows. The
 * version prefix names the key, so a rotated key can decrypt the old values
 * while writing new ones under the new one.
 *
 * The key is PII_ENCRYPTION_KEY: 32 random bytes, base64. It lives only in
 * the deployment's environment, set by the founder; nothing in this
 * repository holds or logs it. Without it, encryptPii() throws rather than
 * store a number in the clear, and nothing degrades silently.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = "v1";
const b64u = (b: Buffer) => b.toString("base64url");

function key(): Buffer {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (!raw) throw new Error("PII_ENCRYPTION_KEY is not set. Refusing to store a personal number unencrypted.");
  const k = Buffer.from(raw, "base64");
  if (k.length !== 32) throw new Error("PII_ENCRYPTION_KEY must be 32 bytes, base64-encoded.");
  return k;
}

/** Whether this deployment can encrypt. Screens use it to say so honestly. */
export const piiReady = (): boolean => {
  try { key(); return true; } catch { return false; }
};

export function encryptPii(plain: string, k: Buffer = key()): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", k, iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [VERSION, b64u(iv), b64u(c.getAuthTag()), b64u(ct)].join(":");
}

/** For making a payment, never for display. Throws on tampering. */
export function decryptPii(stored: string, k: Buffer = key()): string {
  const [v, iv, tag, ct] = stored.split(":");
  if (v !== VERSION || !iv || !tag || !ct) throw new Error("Unrecognised ciphertext.");
  const d = createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(ct, "base64url")), d.final()]).toString("utf8");
}

/** The last four characters, for recognition. Spaces and dashes ignored. */
export const last4 = (value: string): string => value.replace(/[\s-]/g, "").slice(-4);

/** How a masked number is written on a screen. */
export const masked = (l4: string | null | undefined): string => (l4 ? `•••• •••• ${l4}` : "Not on record");
