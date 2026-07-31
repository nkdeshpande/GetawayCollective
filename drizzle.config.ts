import type { Config } from "drizzle-kit";

/**
 * Drizzle configuration.
 *
 * `schema` points at a GENERATED file. Do not edit it — add the field to
 * constants/ufr.ts and run `npm run db:schema`. The migration SQL is
 * therefore downstream of the Unified Field Registry, which is what keeps
 * E-06 true at the database.
 */
export default {
  schema: "./generated/db-schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/gc",
  },
  verbose: true,
  strict: true,
} satisfies Config;
