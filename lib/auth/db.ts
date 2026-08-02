/**
 * THE AUTH DATABASE HANDLE — absent by default, and that is not a bug
 *
 * ── IT RETURNS NULL RATHER THAN THROWING ─────────────────────────────
 * `DATABASE_URL` is unset in this repository today. A module that opened
 * a connection at import time would fail the build, break `next build`,
 * and take the entire public site down with it — a site that needs no
 * database at all to serve the Collection.
 *
 * So this returns `null` when there is no URL, every caller handles null,
 * and the failure mode of "no database" is "nobody is signed in" rather
 * than "nothing renders". That is the same fail-closed posture
 * lib/access.ts already takes: absent authentication denies, it does not
 * open, and it does not crash.
 *
 * ── ONE CLIENT, NOT ONE PER REQUEST ──────────────────────────────────
 * Cached on globalThis. Next.js reloads modules per request in dev, and a
 * fresh pool each time exhausts Postgres connections within a few minutes
 * of editing — a failure that looks like the database going down.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type AuthDb = ReturnType<typeof drizzle<typeof schema>>;

const g = globalThis as unknown as {
  __gcAuthSql?: ReturnType<typeof postgres>;
  __gcAuthDb?: AuthDb;
};

export function authDb(): AuthDb | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!g.__gcAuthDb) {
    /* prepare:false because Neon and most poolers run in transaction mode,
       where prepared statements do not survive between checkouts. */
    g.__gcAuthSql ??= postgres(url, { max: 5, prepare: false });
    g.__gcAuthDb = drizzle(g.__gcAuthSql, { schema });
  }
  return g.__gcAuthDb;
}

/** Whether persistence is available. Auth.js needs it for magic links. */
export const hasDatabase = (): boolean => Boolean(process.env.DATABASE_URL);
