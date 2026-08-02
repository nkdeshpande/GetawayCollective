/**
 * THE SUBJECT, RESOLVED — the authoritative read
 *
 * SERVER ONLY. This reaches Postgres; importing it from a Client
 * Component will fail the build, and that failure is the intended guard
 * rather than an inconvenience.
 *
 * ── WHY THIS IS NOT `resolveSubject()` ───────────────────────────────
 * `resolveSubject()` in lib/access.ts is synchronous, and it is called
 * from places that cannot await: the client shell, and `canReach()`
 * itself, whose signature the whole route table depends on. Making it
 * async would ripple into every one of those call sites.
 *
 * `canReach(pathname, subject)` already takes the subject as an optional
 * ARGUMENT. That is the seam. Everything that CAN await resolves the real
 * subject here and passes it in; everything that cannot keeps the
 * anonymous default and therefore keeps failing closed. Nothing had to
 * change shape, and nothing silently became permissive.
 *
 * ── IT RE-READS AUTHORITY EVERY TIME ─────────────────────────────────
 * The JWT carries a coarse class stamped when it was issued. This does
 * not trust it. Grants are read from the database on every server render,
 * so a revocation takes effect on the next request rather than when the
 * token happens to expire.
 *
 * That costs one indexed query per render. A cached authority is an
 * authority that outlives its revocation, which is the failure this
 * platform can least afford.
 */

import { auth } from "../auth";
import { ANONYMOUS } from "./access";
import type { Subject } from "./access";
import { grantsFor, rightsFrom } from "./auth/grants";

/**
 * Who is asking, according to the session and the grant table.
 *
 * `accredited` and `member` are hard-coded false and that is honest, not
 * unfinished-in-a-dangerous-way. Accreditation is the recorded outcome of
 * PR-01; the Member Law fires on SETTLEMENT. Both are institutional
 * records that do not exist yet, and inferring either from "this person
 * signed in" would put a stranger on a member surface. When the investor
 * record lands, this is the single function that changes.
 */
export async function currentSubject(): Promise<Subject> {
  const session = await auth().catch(() => null);
  const id = session?.user?.id; // vocab-lint-ignore — Auth.js field name, not ours to rename
  if (!id) return ANONYMOUS;

  const rights = rightsFrom(await grantsFor(id));

  return Object.freeze({
    identified: true,
    accredited: false,
    member: false,
    rights: Object.freeze(rights) as readonly Subject["rights"][number][],
  });
}

/** The signed-in identity, or null. For attribution on a write. */
export async function currentIdentityId(): Promise<string | null> {
  const session = await auth().catch(() => null);
  return session?.user?.id ?? null; // vocab-lint-ignore — Auth.js field name
}
