#!/usr/bin/env node
/**
 * APPLY MIGRATIONS — because `drizzle-kit migrate` fails silently here
 *
 * On Windows the drizzle-kit CLI renders a spinner, swallows any driver
 * error, and exits 1 with no message at all:
 *
 *   [⣷] applying migrations...
 *   exit 1
 *
 * That is unusable for the one command in the repository that must either
 * work or explain itself. This runs the same migrator underneath — the
 * identical `drizzle-orm/postgres-js/migrator` drizzle-kit calls — and
 * lets the exception through with its code, detail, hint and query.
 *
 * It reads .env.local when DATABASE_URL is not already set, for the same
 * reason scripts/grant.mjs does: Next.js loads that file automatically and
 * a standalone script does not, so the tool would otherwise report a
 * missing variable on a machine where the application connects fine.
 * A real environment variable always wins, so CI and production are
 * unaffected by a developer's local file.
 *
 * ── USE THE DIRECT ENDPOINT ──────────────────────────────────────────
 * Migrations are one long-lived connection issuing DDL. Run them against
 * the DIRECT Neon endpoint, not the pooled one — a transaction-mode
 * pooler can choke on multi-statement DDL. The application is the
 * opposite case and must use the pooler. See docs/SETUP-CREDENTIALS.md.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.DATABASE_URL) {
  const file = path.join(ROOT, ".env.local");
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set, and no .env.local supplied one.");
  process.exit(2);
}

/* Never print the credential. The host is enough to tell you which
   database you just changed, and which endpoint you used. */
const host = url.replace(/^.*@/, "").replace(/[/?].*$/, "");
console.log(`[migrate] host   ${host}`);
console.log(`[migrate] pooled ${host.includes("-pooler") ? "yes — prefer the DIRECT endpoint for DDL" : "no (direct) — correct for migrations"}`);

/* Swallow benign NOTICEs. A re-run emits "schema drizzle already exists,
   skipping" and the same for __drizzle_migrations, both of which
   postgres.js prints as a formatted object that reads exactly like a
   stack trace. A tool that appears to fail on success gets misread, and
   the next person stops trusting the one command that must be trusted.
   Anything above NOTICE still comes through. */
const sql = postgres(url, {
  prepare: false,
  max: 1,
  connect_timeout: 30,
  onnotice: (n) => {
    if (n.severity && n.severity !== "NOTICE") console.warn(`[migrate] ${n.severity}: ${n.message}`);
  },
});
const db = drizzle(sql);

try {
  await migrate(db, { migrationsFolder: path.join(ROOT, "migrations") });
  const t = await sql`select tablename from pg_tables where schemaname='public' order by 1`;
  const auth = t.filter((x) => x.tablename.startsWith("auth_")).length;
  console.log(`[migrate] OK — ${t.length} tables (${auth} auth, ${t.length - auth} institutional)`);
} catch (e) {
  console.error("[migrate] FAILED");
  console.error("  message:", e.message);
  for (const k of ["code", "detail", "hint", "position"]) {
    if (e[k]) console.error(`  ${k.padEnd(7)}:`, e[k]);
  }
  if (e.query) console.error("  query  :", String(e.query).slice(0, 400));
  if (e.cause) console.error("  cause  :", e.cause?.message ?? e.cause);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
