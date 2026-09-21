/**
 * WHAT A LINK MUST SAY BEFORE IT SENDS SOMEBODY SOMEWHERE THEY CANNOT GO
 *
 * REM-009 · PUBLIC.09.
 *
 * ── THE DEFECT ───────────────────────────────────────────────────────
 * The footer linked `/portfolio`; property pages linked `/invest/qualify`
 * and `/office`. Every one of those routes correctly refuses a visitor who
 * has not signed in — `lib/access.ts` is fail-closed and works. What
 * nothing said was that a requirement existed, so the only way to find the
 * boundary was to walk into it.
 *
 * A door that is locked is fine. A door that is locked, unmarked, and
 * offered to you in a footer is a small breach of trust, repeated on every
 * page.
 *
 * ── DERIVED, NEVER TYPED ─────────────────────────────────────────────
 * The label comes from the route table's own access class. Nobody writes
 * "sign-in required" beside a link, because the person who moves a route
 * between access classes will not remember to update the prose — and a
 * stale requirement label is worse than none, since it is now confidently
 * wrong.
 *
 * The phrasing follows VOICE: it states what is true and what happens
 * next, without apology and without softening. "Sign-in required", not
 * "you may not be able to view this".
 */

import type { Access } from "./routes";

/**
 * What each access class asks of a reader, in the reader's terms.
 *
 * `public` is null rather than an empty string: there is no requirement to
 * state, and a component branches on absence rather than on a blank.
 */
export const ACCESS_REQUIREMENT: Record<Access, string | null> = {
  public: null,
  identified: "Sign-in required",
  accredited: "Accreditation required",
  member: "Members only",
  /* Not "office" — that is the platform's word for itself. A visitor who
     is not staff does not know what an office vantage is, and does not
     need to. */
  office: "Staff only",
};

/** True where a route asks something of the reader before it will open. */
export const isGated = (a: Access): boolean => ACCESS_REQUIREMENT[a] !== null;

/**
 * The full sentence, for a link that has space for one.
 *
 * Used by the enquiry and evidence rails, where a bare two-word chip would
 * read as a badge rather than as an explanation.
 */
export const ACCESS_EXPLANATION: Record<Access, string | null> = {
  public: null,
  identified: "Sign in to continue. Anyone may create an account.",
  accredited: "Open once accreditation is recorded. Qualification is a separate, resumable process.",
  member: "Open to partners with a settled position in a vehicle.",
  office: "Open to Getaway Collective staff holding the named right.",
};
