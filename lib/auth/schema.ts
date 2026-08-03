/**
 * AUTH TABLES — hand-written, and deliberately NOT under the UFR
 *
 * ── WHY THIS FILE EXISTS SEPARATELY ──────────────────────────────────
 * `generated/db-schema.ts` is written by scripts/gen-db.js from
 * constants/ufr.ts, and `npm run db:check` fails the gate if a column
 * appears there without a registry entry. That rule is right, and these
 * tables must not break it.
 *
 * They are not business objects. A session row is not an institutional
 * record — it is transport for a browser tab, it carries no provenance,
 * nobody files it, and it is deleted rather than superseded. Registering
 * it in the UFR would put a cookie on the same shelf as a Distribution.
 *
 * So: session mechanics live here, institutional truth lives there, and
 * `drizzle.config.ts` reads both. The one place they meet is
 * `identityId` — the `auth_user.id` that grants and events refer to.
 *
 * ── THE GRANT TABLE IS THE EXCEPTION ─────────────────────────────────
 * `auth_office_grant` is institutional. It mirrors the `Grant` interface
 * in lib/authority.ts field for field, because that interface is already
 * the constitutional shape and a second shape would be a second truth.
 * It lives here rather than in the UFR only because authority is granted
 * to an AUTHENTICATED IDENTITY, and the identity lives in this file. When
 * the UFR grows a Party object (v5 OBJ-014), this table should move.
 */

import {
  pgTable, text, timestamp, primaryKey, integer, index,
} from "drizzle-orm/pg-core";

/* Auth.js owns the shape of the next four tables. They match the
   @auth/drizzle-adapter Postgres schema exactly — a renamed column here
   is a runtime failure inside the adapter, not a compile error. Only the
   `auth_` prefix is ours, so nothing collides with a generated table. */

export const users = pgTable("auth_user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "auth_account",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<"oauth" | "oidc" | "email" | "webauthn">().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) }),
);

export const sessions = pgTable("auth_session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "auth_verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.identifier, t.token] }) }),
);

/**
 * AUTHORITY — the constitutional table.
 *
 * Mirrors `Grant` in lib/authority.ts. Every column there is here, and
 * nothing is added: `authorise()` already decides from this shape, and a
 * column it cannot see would be a permission nobody evaluates.
 *
 * ── WHY ROWS ARE NEVER DELETED ───────────────────────────────────────
 * Revocation writes `revoked_at`. It does not DELETE. A deleted grant
 * cannot answer "who could do this on the day it happened?", which is the
 * only question an audit asks. E-02 requires the answer to survive.
 *
 * ── SCOPE ────────────────────────────────────────────────────────────
 * Stored as two columns rather than JSON so the database can index the
 * vehicle. `scope_vehicle_id` NULL means enterprise scope. Authority
 * flows downward only (E-07): enterprise reaches into a vehicle, vehicle
 * never reaches out — and that direction is enforced in `covers()` in
 * lib/authority.ts, not here. The table stores; the constitution decides.
 */
export const officeGrants = pgTable(
  "auth_office_grant",
  {
    grantId: text("grant_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    identityId: text("identity_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** A Role from lib/authority.ts. Text, not an enum: the role list is
        constitutional and changing it must be a code amendment reviewed by
        cap-lint, not a silent ALTER TYPE. */
    role: text("role").notNull(),
    scopeKind: text("scope_kind").$type<"enterprise" | "vehicle">().notNull(),
    scopeVehicleId: text("scope_vehicle_id"),
    /** Who granted it. A grant with no grantor cannot be audited (E-02). */
    grantedBy: text("granted_by").notNull(),
    grantedAt: timestamp("granted_at", { mode: "string" }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    revokedAt: timestamp("revoked_at", { mode: "string" }),
    /** WF-3 refuses a grant with no reason. The column is NOT NULL so the
        database refuses one too, rather than trusting the caller. */
    reason: text("reason").notNull(),
  },
  (t) => ({ byIdentity: index("auth_office_grant_identity_idx").on(t.identityId) }),
);
