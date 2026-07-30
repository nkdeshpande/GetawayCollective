#!/usr/bin/env node
/**
 * Drizzle schema generator — UFR + L3 relationships → PostgreSQL tables
 *
 * Wave 2 · Semantic Core
 *
 * ── WHY GENERATED ────────────────────────────────────────────────────
 * Same reason as the Zod contracts: a hand-written schema can grow a column
 * the registry never declared, and E-06 stops being true at the layer where
 * it matters most — the one holding the actual data.
 *
 * ── WHAT THIS ADDS OVER THE ZOD PASS ─────────────────────────────────
 * The L3 relationship model declares `onParentDelete` for every edge. Here
 * that becomes an actual foreign-key constraint. Until now it was a stated
 * intention; in the database it is enforced by the engine whether or not
 * application code remembers to check.
 *
 * `orphan-forbidden` emits RESTRICT plus a comment: those parents are
 * append-only records that are never deleted at all, so the constraint is a
 * backstop rather than the primary control.
 *
 * Run with --check in CI to fail on stale or hand-edited output.
 *
 * Zero dependencies at generation time.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const UFR_SRC = path.join(ROOT, "constants", "ufr.ts");
const REL_SRC = path.join(ROOT, "constants", "relationships.ts");
const OUT = path.join(ROOT, "generated", "db-schema.ts");
const CHECK = process.argv.includes("--check");

// ── snake_case from PascalCase ────────────────────────────────────────
const snake = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

function parseUFR() {
  const src = fs.readFileSync(UFR_SRC, "utf8");
  const out = [];
  for (const m of src.matchAll(/F\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`)) || [])[1];
    const flag = (k) => new RegExp(`\\b${k}:\\s*true`).test(b);
    const v = b.match(/values:\s*\[([^\]]*)\]/);
    out.push({
      ufr: g("ufr"), name: g("name"), type: g("type"),
      object: (b.match(/object:\s*BusinessObjectType\.(\w+)/) || [])[1],
      references: (b.match(/references:\s*BusinessObjectType\.(\w+)/) || [])[1],
      required: flag("required"), computed: flag("computed"), immutable: flag("immutable"),
      values: v ? [...v[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : null,
      description: g("description") || "",
    });
  }
  return out.filter((f) => f.ufr && f.object);
}

function parseRels() {
  const src = fs.readFileSync(REL_SRC, "utf8");
  const out = new Map();
  for (const m of src.matchAll(/R\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const via = (b.match(/via:\s*"([^"]+)"/) || [])[1];
    out.set(via, {
      id: (b.match(/id:\s*"([^"]+)"/) || [])[1],
      from: (b.match(/from:\s*BO\.(\w+)/) || [])[1],
      to: (b.match(/to:\s*BO\.(\w+)/) || [])[1],
      required: /required:\s*true/.test(b),
      onParentDelete: (b.match(/onParentDelete:\s*"([^"]+)"/) || [])[1],
    });
  }
  return out;
}

/**
 * money -> numeric(20,4), never a float column.
 * The Zod layer already refuses float money; a `double precision` column
 * here would reintroduce the same error one layer down.
 */
function column(f, rels) {
  const n = JSON.stringify(f.name);
  switch (f.type) {
    case "uuid": return `uuid(${n})`;
    case "reference": {
      const rel = rels.get(f.ufr);
      const target = `${snake(f.references)}`;
      const mode = rel && rel.onParentDelete === "cascade" ? "cascade" : "restrict";
      return `uuid(${n}).references(() => ${target}.id, { onDelete: ${JSON.stringify(mode)} })`;
    }
    case "string": return `varchar(${n}, { length: 512 })`;
    case "text": return `text(${n})`;
    case "integer": return `integer(${n})`;
    case "decimal": return `numeric(${n}, { precision: 20, scale: 6 })`;
    case "money": return `numeric(${n}, { precision: 20, scale: 4 })`;
    case "percent": return `numeric(${n}, { precision: 9, scale: 6 })`;
    case "boolean": return `boolean(${n})`;
    case "date": return `date(${n})`;
    case "timestamp": return `timestamp(${n}, { withTimezone: true })`;
    case "enum": return `${enumName(f)}(${n})`;
    case "json": return `jsonb(${n})`;
    default: throw new Error(`unmapped type ${f.type}`);
  }
}

const enumName = (f) => `${snake(f.object)}_${f.name}_enum`;

function build() {
  const fields = parseUFR();
  const rels = parseRels();

  const byObject = new Map();
  for (const f of fields) {
    if (!byObject.has(f.object)) byObject.set(f.object, []);
    byObject.get(f.object).push(f);
  }

  // Topological order on REQUIRED edges so parents declare before children.
  const objs = [...byObject.keys()];
  const reqParents = new Map(objs.map((o) => [o, []]));
  for (const r of rels.values()) {
    if (r.required && r.from !== r.to) reqParents.get(r.from)?.push(r.to);
  }
  const done = new Set();
  const order = [];
  let remaining = [...objs];
  while (remaining.length) {
    const ready = remaining.filter((o) => (reqParents.get(o) || []).every((p) => done.has(p)));
    if (!ready.length) { order.push(...remaining); break; }
    ready.sort();
    for (const o of ready) { order.push(o); done.add(o); }
    remaining = remaining.filter((o) => !done.has(o));
  }

  const L = [];
  L.push("/**");
  L.push(" * GENERATED FILE — DO NOT EDIT.");
  L.push(" *");
  L.push(" * Source: constants/ufr.ts (fields) + constants/relationships.ts (edges)");
  L.push(" * Regenerate: npm run db:schema");
  L.push(" * Verify:     npm run db:check");
  L.push(" *");
  L.push(" * Adding a column here without a UFR entry breaks E-06 at the layer that");
  L.push(" * holds the data. Add it to the registry and regenerate.");
  L.push(" *");
  L.push(" * Tables are emitted in topological order on required references, so every");
  L.push(" * parent is declared before its children.");
  L.push(" */");
  L.push("");
  L.push('import {');
  L.push('  pgTable, pgEnum, uuid, varchar, text, integer, numeric,');
  L.push('  boolean, date, timestamp, jsonb,');
  L.push('} from "drizzle-orm/pg-core";');
  L.push("");

  // Enums first — Postgres requires the type before the column.
  L.push("// ─── Enumerated types ───────────────────────────────────────────");
  for (const obj of order) {
    for (const f of byObject.get(obj).filter((x) => x.type === "enum")) {
      L.push(`export const ${enumName(f)} = pgEnum(${JSON.stringify(enumName(f))}, [${f.values.map((v) => JSON.stringify(v)).join(", ")}]);`);
    }
  }
  L.push("");

  for (const obj of order) {
    const table = snake(obj);
    const fs_ = byObject.get(obj).slice().sort((a, b) => a.ufr.localeCompare(b.ufr));
    const immutableCols = fs_.filter((f) => f.immutable).map((f) => f.name);

    L.push(`// ─── ${obj} ${"─".repeat(Math.max(0, 56 - obj.length))}`);
    if (immutableCols.length) {
      L.push(`// Immutable after insert (absent from the generated Update contract):`);
      L.push(`//   ${immutableCols.join(", ")}`);
    }
    L.push(`export const ${table} = pgTable(${JSON.stringify(table)}, {`);
    // System columns — declared once in the UFR, applied identically everywhere.
    L.push(`  id: uuid("id").primaryKey().defaultRandom(),`);
    L.push(`  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),`);
    L.push(`  created_by: uuid("created_by").notNull(),`);
    L.push(`  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),`);
    L.push(`  version: integer("version").notNull().default(0),`);
    for (const f of fs_) {
      const rel = rels.get(f.ufr);
      const notNull = f.required ? ".notNull()" : "";
      const tag = rel ? `  // ${rel.id} · onParentDelete: ${rel.onParentDelete}` : "";
      L.push(`  /** ${f.ufr} */`);
      L.push(`  ${f.name}: ${column(f, rels)}${notNull},${tag}`);
    }
    L.push("});");
    L.push("");
  }

  L.push("export const TABLES = {");
  for (const obj of order) L.push(`  ${obj}: ${snake(obj)},`);
  L.push("} as const;");
  L.push("");

  return { text: L.join("\n").replace(/\n{3,}/g, "\n\n"), tables: order.length, fields: fields.length };
}

const { text, tables, fields } = build();

if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
  if (cur === null) {
    console.error("[gen-db] FAIL — generated/db-schema.ts is missing. Run: npm run db:schema");
    process.exit(1);
  }
  if (cur.replace(/\r\n/g, "\n") !== text.replace(/\r\n/g, "\n")) {
    console.error("[gen-db] FAIL — generated/db-schema.ts is stale or was hand-edited.");
    console.error("  The registry and the database schema have diverged. Fix in constants/ufr.ts, then regenerate.");
    process.exit(1);
  }
  console.log(`[gen-db] OK — schema matches the registry (${tables} tables, ${fields} fields)\n`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, text, "utf8");
console.log(`[gen-db] wrote generated/db-schema.ts — ${tables} tables, ${fields} registered fields\n`);
