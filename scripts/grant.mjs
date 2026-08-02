#!/usr/bin/env node
/**
 * THE GRANT TOOL — issue, list and revoke office authority
 *
 * RBAC LAW 1: a role makes grants ELIGIBLE; access exists only as a
 * named, scoped, expiring, reasoned grant. There is no role column on the
 * user, so this is the only way authority enters the system apart from
 * the one-time GC_OFFICE_BOOTSTRAP allowlist.
 *
 *   node scripts/grant.mjs list [email]
 *   node scripts/grant.mjs add <email> <role> --reason "..." [--expires 2027-03-31] [--vehicle slug]
 *   node scripts/grant.mjs revoke <grantId> --reason "..."
 *
 * ── WHY A REASON IS MANDATORY ────────────────────────────────────────
 * WF-3 refuses a grant with no reason, and so does the NOT NULL on the
 * column. An authority nobody can explain is one nobody can review, and
 * the review is the only thing standing between a grant and a habit.
 *
 * ── WHY REVOKE DOES NOT DELETE ───────────────────────────────────────
 * It stamps revoked_at. An audit asks "who could do this on the day it
 * happened?", and a deleted row cannot answer. E-02 needs the answer to
 * survive the revocation.
 *
 * Roles are parsed out of lib/authority.ts rather than duplicated here,
 * for the same reason every other script in this repo parses its source:
 * a second copy of a constitutional list is a second thing to forget.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Authority lives in the database; there is nowhere to write.");
  process.exit(2);
}

/* Parse the Role union from the constitution rather than restating it. */
const authoritySrc = fs.readFileSync(path.join(ROOT, "lib", "authority.ts"), "utf8").replace(/\r\n/g, "\n");
const roleBlock = authoritySrc.match(/export type Role =([\s\S]*?);/);
if (!roleBlock) {
  console.error("Could not find the Role union in lib/authority.ts. Refusing to guess.");
  process.exit(2);
}
const ROLES = [...roleBlock[1].matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
if (ROLES.length === 0) {
  console.error("Parsed zero roles from lib/authority.ts. That is a broken parse, not an empty list.");
  process.exit(2);
}

/* ROLE_RIGHTS and SEPARATION_TRIADS, parsed rather than restated. A
   zero-length parse here would silently disable the LAW 2 check below,
   so both refuse to continue empty — the failure mode this repo's own
   linters warn about in ten separate files. */
const rightsBlock = authoritySrc.match(/export const ROLE_RIGHTS[\s\S]*?\n};/);
const ROLE_RIGHTS = {};
if (rightsBlock) {
  for (const m of rightsBlock[0].matchAll(/^\s{2}"?([a-z_]+)"?:\s*\[([\s\S]*?)\],?$/gm)) {
    ROLE_RIGHTS[m[1]] = [...m[2].matchAll(/"([a-z_.]+)"/g)].map((x) => x[1]);
  }
}
const triadBlock = authoritySrc.match(/export const SEPARATION_TRIADS[\s\S]*?\n\];/);
const TRIADS = triadBlock
  ? [...triadBlock[0].matchAll(/\[([^\]]*?)\]/g)]
      .map((m) => [...m[1].matchAll(/"([a-z_.]+)"/g)].map((x) => x[1]))
      .filter((t) => t.length === 3)
  : [];

if (Object.keys(ROLE_RIGHTS).length === 0 || TRIADS.length === 0) {
  console.error("Parsed zero role-rights or zero separation triads from lib/authority.ts.");
  console.error("That disables the LAW 2 check rather than passing it. Refusing to run.");
  process.exit(2);
}

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const sql = postgres(url, { max: 1, prepare: false });
const actor = process.env.GC_GRANT_ACTOR ?? `cli:${process.env.USERNAME ?? process.env.USER ?? "unknown"}`;

try {
  if (cmd === "list") {
    const email = argv[1];
    const rows = email
      ? await sql`SELECT g.*, u.email FROM auth_office_grant g JOIN auth_user u ON u.id = g.identity_id
                  WHERE lower(u.email) = ${email.toLowerCase()} ORDER BY g.granted_at DESC`
      : await sql`SELECT g.*, u.email FROM auth_office_grant g JOIN auth_user u ON u.id = g.identity_id
                  ORDER BY g.granted_at DESC`;
    if (rows.length === 0) {
      console.log("No grants. The Office is unreachable until one exists.");
    } else {
      for (const r of rows) {
        const state = r.revoked_at ? "REVOKED" : r.expires_at && new Date(r.expires_at) <= new Date() ? "EXPIRED" : "ACTIVE";
        const scope = r.scope_kind === "vehicle" ? `vehicle:${r.scope_vehicle_id}` : "enterprise";
        console.log(`${state.padEnd(8)} ${r.grant_id}  ${String(r.email).padEnd(32)} ${r.role.padEnd(26)} ${scope}`);
        console.log(`         by ${r.granted_by} · ${r.reason}`);
      }
    }
  } else if (cmd === "add") {
    const [, email, role] = argv;
    const reason = flag("reason");
    if (!email || !role || !reason) {
      console.error('Usage: add <email> <role> --reason "..." [--expires YYYY-MM-DD] [--vehicle slug]');
      process.exit(2);
    }
    if (!ROLES.includes(role)) {
      console.error(`"${role}" is not a Role in lib/authority.ts.\nValid: ${ROLES.join(", ")}`);
      process.exit(2);
    }
    const user = await sql`SELECT id FROM auth_user WHERE lower(email) = ${email.toLowerCase()} LIMIT 1`;
    if (user.length === 0) {
      console.error(`No identity for ${email}. They must sign in once before authority can be granted to them.`);
      process.exit(1);
    }
    /* LAW 2 · No identity may hold a GP-06 separation triad. The check
       lives here as well as in requestGrant() because this tool writes
       SQL directly, and a law enforced only on the path people do not
       use is not enforced. Parsed from lib/authority.ts for the same
       reason the roles are — one copy, not two. */
    const heldRows = await sql`
      SELECT role FROM auth_office_grant
      WHERE identity_id = ${user[0].id} AND revoked_at IS NULL
        AND (expires_at IS NULL OR expires_at > now())`;
    const after = new Set([...heldRows.map((r) => r.role), role].flatMap((r) => ROLE_RIGHTS[r] ?? []));
    const triad = TRIADS.find((t) => t.every((r) => after.has(r)));
    if (triad) {
      console.error(`Refused: granting ${role} to ${email} would complete the separation triad`);
      console.error(`  ${triad.join(" + ")}`);
      console.error("GP-06 forbids one identity holding all three. Split the authority or revoke first.");
      process.exit(1);
    }

    const vehicle = flag("vehicle");
    const [row] = await sql`
      INSERT INTO auth_office_grant
        (identity_id, role, scope_kind, scope_vehicle_id, granted_by, expires_at, reason)
      VALUES (${user[0].id}, ${role}, ${vehicle ? "vehicle" : "enterprise"}, ${vehicle ?? null},
              ${actor}, ${flag("expires") ?? null}, ${reason})
      RETURNING grant_id`;
    console.log(`Granted ${role} to ${email} — ${row.grant_id}`);
    console.log("They must sign out and in again, or wait up to 30 minutes, for the token to carry it.");
  } else if (cmd === "revoke") {
    const id = argv[1];
    const reason = flag("reason");
    if (!id || !reason) {
      console.error('Usage: revoke <grantId> --reason "..."');
      process.exit(2);
    }
    const rows = await sql`
      UPDATE auth_office_grant
      SET revoked_at = now(), reason = reason || ' | REVOKED: ' || ${reason}
      WHERE grant_id = ${id} AND revoked_at IS NULL
      RETURNING grant_id`;
    if (rows.length === 0) {
      console.error("No active grant with that id. Nothing changed.");
      process.exit(1);
    }
    console.log(`Revoked ${id}. Effective on their next server render — lib/session.ts re-reads grants every time.`);
  } else {
    console.log("Commands: list [email] · add <email> <role> --reason … · revoke <grantId> --reason …");
    console.log(`Roles: ${ROLES.join(", ")}`);
  }
} finally {
  await sql.end();
}
