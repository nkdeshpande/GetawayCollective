/**
 * AUTHORITY, PERSISTED — reading grants for an authenticated identity
 *
 * lib/authority.ts already decides everything that matters: `authorise()`
 * takes a list of grants and answers yes or no. It takes that list as an
 * ARGUMENT rather than fetching it, which is what makes it testable and
 * what keeps the constitution independent of the database. This file is
 * the only thing that turns rows into that list.
 *
 * ── ROLE IS NOT ACCESS ───────────────────────────────────────────────
 * RBAC LAW 1: a role makes grants ELIGIBLE; access exists only as a
 * named, scoped, expiring, reasoned grant. So there is no `role` column
 * on the identity. An identity with no row in `auth_office_grant` holds
 * no right, whatever their title, and the only way to acquire one is a
 * grant that records who gave it and why.
 *
 * ── THE BOOTSTRAP PROBLEM ────────────────────────────────────────────
 * `authority.grant` is itself a right, so on an empty database nobody can
 * grant anything and the Office is unreachable forever.
 *
 * The escape is an environment allowlist, and it is deliberately the
 * narrowest one that works: it can only mint a grant for an address the
 * deployment operator has already written into the environment, it names
 * itself as the grantor so the row is still auditable, and it never
 * upgrades or re-grants an identity that already has a row. Anyone with
 * the power to edit production environment variables can already deploy
 * arbitrary code, so this widens no boundary that was previously closed.
 *
 * Remove the variable once real grants exist. Nothing depends on it.
 */

import { and, eq, isNull } from "drizzle-orm";
import { authDb } from "./db";
import { officeGrants, users } from "./schema";
import { ROLE_RIGHTS, SEPARATION_TRIADS } from "../authority";
import type { Grant, Right, Role } from "../authority";
import type { TokenAccess } from "../../auth.config";

const VALID_ROLES = Object.keys(ROLE_RIGHTS) as Role[];

/** Rows → the exact `Grant` shape lib/authority.ts already reasons about. */
export async function grantsFor(identityId: string): Promise<Grant[]> {
  const db = authDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(officeGrants)
    .where(and(eq(officeGrants.identityId, identityId), isNull(officeGrants.revokedAt)));

  return rows.map((r) => ({
    grantId: r.grantId,
    identityId: r.identityId,
    role: r.role as Role,
    scope:
      r.scopeKind === "vehicle" && r.scopeVehicleId
        ? ({ kind: "vehicle", vehicleId: r.scopeVehicleId } as const)
        : ({ kind: "enterprise" } as const),
    grantedBy: r.grantedBy,
    grantedAt: r.grantedAt,
    expiresAt: r.expiresAt ?? undefined,
    revokedAt: r.revokedAt ?? undefined,
  }));
}

/** Every right an identity actually holds right now, expiry applied. */
export function rightsFrom(grants: readonly Grant[], atIso = new Date().toISOString()): Right[] {
  const out = new Set<Right>();
  for (const g of grants) {
    if (g.revokedAt) continue;
    if (g.expiresAt && g.expiresAt <= atIso) continue;
    for (const r of ROLE_RIGHTS[g.role] ?? []) out.add(r);
  }
  return [...out];
}

/**
 * LAW 2 — would this grant complete a GP-06 separation triad?
 *
 * `requestGrant()` in lib/access-admin.ts already refuses the completing
 * grant, but it reasons over the operating-model register and takes a
 * single RIGHT. A role grant confers many rights at once, so the same law
 * has to be applied to their union, and by every path that writes to the
 * table — the CLI and the environment allowlist both insert directly and
 * would otherwise walk straight past it.
 *
 * The test is on the RESULT, not the increment. A triad is dangerous
 * however it was assembled, so an identity holding two thirds of one must
 * not be handed the third by any route.
 *
 * Returns the triad it would complete, or null.
 */
export function completesSeparationTriad(
  held: readonly Grant[],
  proposed: Role,
  atIso = new Date().toISOString(),
): Right[] | null {
  const after = new Set(rightsFrom(held, atIso));
  for (const r of ROLE_RIGHTS[proposed] ?? []) after.add(r);

  for (const triad of SEPARATION_TRIADS) {
    if (triad.every((r) => after.has(r))) return [...triad];
  }
  return null;
}

/**
 * The coarse class the token carries.
 *
 * Only two outcomes are provable at sign-in. `accredited` and `member`
 * belong to institutional records that do not exist yet — see the note in
 * the jwt callback in auth.ts.
 */
export function accessFromGrants(grants: readonly Grant[]): TokenAccess {
  return rightsFrom(grants).length > 0 ? "office" : "identified";
}

/**
 * Mint the allowlisted grant if this identity has none.
 *
 * Format: `GC_OFFICE_BOOTSTRAP="ops@example.com:executive_office,chair@example.com:board"`.
 * An unknown role is skipped loudly rather than silently downgraded — a
 * typo that quietly granted nothing would look identical to a working
 * configuration until somebody needed the authority.
 */
export async function ensureBootstrapGrant(identityId: string, email: string | null | undefined) {
  const raw = process.env.GC_OFFICE_BOOTSTRAP;
  if (!raw || !email) return;

  const db = authDb();
  if (!db) return;

  const wanted = raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [addr, role] = pair.split(":").map((s) => s?.trim());
      return { addr: (addr ?? "").toLowerCase(), role: role as Role };
    })
    .find((e) => e.addr === email.toLowerCase());

  if (!wanted) return;

  if (!VALID_ROLES.includes(wanted.role)) {
    console.error(
      `[auth] GC_OFFICE_BOOTSTRAP names role "${wanted.role}" for ${email}, which is not a Role in ` +
        `lib/authority.ts. No grant was created. Valid roles: ${VALID_ROLES.join(", ")}`,
    );
    return;
  }

  const existing = await db
    .select({ id: officeGrants.grantId })
    .from(officeGrants)
    .where(eq(officeGrants.identityId, identityId))
    .limit(1);

  /* Never re-grant. If a row exists — even a revoked one — the allowlist
     stays out of it. Re-minting past a revocation would make the
     environment variable a way to undo a constitutional act. */
  if (existing.length > 0) return;

  /* LAW 2 applies to the allowlist too. It is the one path that runs
     without a human in the loop, so it is the last one that should be
     allowed to assemble a triad. */
  const triad = completesSeparationTriad(await grantsFor(identityId), wanted.role);
  if (triad) {
    console.error(
      `[auth] GC_OFFICE_BOOTSTRAP refused for ${email}: granting ${wanted.role} would complete the ` +
        `separation triad ${triad.join(" + ")} (GP-06). No grant was created.`,
    );
    return;
  }

  await db.insert(officeGrants).values({
    identityId,
    role: wanted.role,
    scopeKind: "enterprise",
    grantedBy: "bootstrap:GC_OFFICE_BOOTSTRAP",
    reason:
      "Bootstrap grant from the deployment environment allowlist. Created because authority.grant " +
      "is itself a right and an empty grant table can never issue the first one. Replace with a " +
      "grant issued under WF-3 and remove the variable.",
  });

  console.warn(
    `[auth] bootstrap grant issued: ${email} -> ${wanted.role} (enterprise). ` +
      `Remove GC_OFFICE_BOOTSTRAP once real grants exist.`,
  );
}

/** Look up an identity by address — used by the grant CLI and by tests. */
export async function identityByEmail(email: string): Promise<string | null> {
  const db = authDb();
  if (!db) return null;
  const row = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row[0]?.id ?? null;
}
