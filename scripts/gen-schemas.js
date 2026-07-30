#!/usr/bin/env node
/**
 * Zod contract generator — UFR → validation schemas
 *
 * Wave 2 · Semantic Core
 *
 * ── WHY GENERATED, NOT WRITTEN ───────────────────────────────────────
 * If schemas are hand-authored, the registry becomes documentation and
 * E-06 quietly stops being true: a field can exist in validation without
 * existing in the registry, which is precisely the divergence the UFR was
 * built to prevent. Generating them makes the registry the only place a
 * field can be born.
 *
 * Run with --check in CI to fail when the generated file is stale or was
 * hand-edited.
 *
 * ── THREE SCHEMAS PER OBJECT ─────────────────────────────────────────
 *   XSchema        full read shape
 *   XCreateSchema  writable-at-creation fields (computed omitted)
 *   XUpdateSchema  computed AND immutable omitted
 *
 * The Update schema is where immutability becomes enforceable rather than
 * aspirational: A-04 (acquisition terms), F-07 (executed payouts), E-03
 * (knowledge) all reduce to "this field is absent from the update contract".
 *
 * Zero dependencies at generation time. Output requires `zod` at runtime.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const UFR_SRC = path.join(ROOT, "constants", "ufr.ts");
const OUT = path.join(ROOT, "generated", "schemas.ts");
const CHECK = process.argv.includes("--check");

function parseUFR() {
  const src = fs.readFileSync(UFR_SRC, "utf8");
  const out = [];
  for (const m of src.matchAll(/F\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`)) || [])[1];
    const flag = (k) => new RegExp(`\\b${k}:\\s*true`).test(b);
    const values = (() => {
      const v = b.match(/values:\s*\[([^\]]*)\]/);
      return v ? [...v[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : null;
    })();
    out.push({
      ufr: g("ufr"), name: g("name"), type: g("type"),
      object: (b.match(/object:\s*BusinessObjectType\.(\w+)/) || [])[1],
      required: flag("required"), computed: flag("computed"), immutable: flag("immutable"),
      sensitivity: g("sensitivity"), values,
      description: g("description") || "",
    });
  }
  return out.filter((f) => f.ufr && f.object);
}

/**
 * MONEY IS A STRING, DELIBERATELY.
 *
 * IEEE-754 doubles cannot represent 0.1 exactly. On a platform that
 * computes a six-stage waterfall, two 2.5% reserve transfers and a
 * reserve floor comparison over the same figure, accumulated float error
 * is not hypothetical — it is the mechanism by which F-02 (ownership
 * conservation) and F-03 (capital accounted) start failing by pennies and
 * then by more. Decimal strings in, decimal arithmetic in the money layer.
 */
function zodFor(f) {
  switch (f.type) {
    case "uuid":
    case "reference":
      return "z.string().uuid()";
    case "string":
      return "z.string().min(1)";
    case "text":
      return "z.string()";
    case "integer":
      return "z.number().int()";
    case "decimal":
      return "z.number()";
    case "money":
      return 'z.string().regex(/^-?\\d+(\\.\\d{1,4})?$/, "money must be a decimal string, never a float")';
    case "percent":
      return "z.number().min(0)";
    case "boolean":
      return "z.boolean()";
    case "date":
      return "z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/)";
    case "timestamp":
      return "z.string().datetime()";
    case "enum":
      return `z.enum([${f.values.map((v) => JSON.stringify(v)).join(", ")}])`;
    case "json":
      return "z.unknown()";
    default:
      throw new Error(`unmapped field type: ${f.type}`);
  }
}

function line(f) {
  const base = zodFor(f);
  const opt = f.required ? "" : ".optional()";
  const doc = f.description.replace(/\s+/g, " ").slice(0, 150);
  return `  /** ${f.ufr} — ${doc} */\n  ${f.name}: ${base}${opt},`;
}

function build() {
  const fields = parseUFR();
  const byObject = new Map();
  for (const f of fields) {
    if (!byObject.has(f.object)) byObject.set(f.object, []);
    byObject.get(f.object).push(f);
  }

  const L = [];
  L.push("/**");
  L.push(" * GENERATED FILE — DO NOT EDIT.");
  L.push(" *");
  L.push(" * Source: constants/ufr.ts (the Unified Field Registry, L2.5)");
  L.push(" * Regenerate: npm run schemas");
  L.push(" * Verify:     npm run schemas:check");
  L.push(" *");
  L.push(" * Editing this file by hand breaks invariant E-06: a field would exist");
  L.push(" * in validation without existing in the registry. Add the field to the");
  L.push(" * UFR and regenerate instead.");
  L.push(" */");
  L.push("");
  L.push('import { z } from "zod";');
  L.push("");
  L.push("/** Present on every object. Declared once in the UFR, applied uniformly. */");
  L.push("export const SystemFields = z.object({");
  L.push("  id: z.string().uuid(),");
  L.push("  created_at: z.string().datetime(),");
  L.push("  created_by: z.string().uuid(),");
  L.push("  updated_at: z.string().datetime(),");
  L.push("  version: z.number().int().nonnegative(),");
  L.push("});");
  L.push("");

  const names = [...byObject.keys()].sort();
  for (const obj of names) {
    const fs_ = byObject.get(obj).slice().sort((a, b) => a.ufr.localeCompare(b.ufr));
    const creatable = fs_.filter((f) => !f.computed);
    const updatable = fs_.filter((f) => !f.computed && !f.immutable);

    L.push(`// ─── ${obj} ${"─".repeat(Math.max(0, 58 - obj.length))}`);
    L.push(`export const ${obj}Schema = SystemFields.extend({`);
    for (const f of fs_) L.push(line(f));
    L.push("});");
    L.push(`export type ${obj} = z.infer<typeof ${obj}Schema>;`);
    L.push("");

    L.push(`export const ${obj}CreateSchema = z.object({`);
    for (const f of creatable) L.push(line(f));
    L.push("});");
    L.push("");

    if (updatable.length) {
      L.push(`/**`);
      L.push(` * Immutable and computed fields are absent by construction — that is the`);
      L.push(` * enforcement. .strict() makes their presence an ERROR rather than a silent`);
      L.push(` * strip: without it, an update carrying an immutable field returns success`);
      L.push(` * with that field quietly dropped, and the caller believes it was applied.`);
      L.push(` */`);
      L.push(`export const ${obj}UpdateSchema = z.object({`);
      for (const f of updatable) L.push(line({ ...f, required: false }));
      L.push("}).partial().strict();");
    } else {
      L.push(`/** Every field is immutable or computed: this object is append-only. */`);
      L.push(`export const ${obj}UpdateSchema = z.object({}).strict();`);
    }
    L.push("");
  }

  L.push("export const SCHEMAS = {");
  for (const obj of names) L.push(`  ${obj}: ${obj}Schema,`);
  L.push("} as const;");
  L.push("");

  return { text: L.join("\n"), count: fields.length, objects: names.length };
}

const { text, count, objects: objCount } = build();

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
  if (current === null) {
    console.error("[gen-schemas] FAIL — generated/schemas.ts is missing. Run: npm run schemas");
    process.exit(1);
  }
  if (current.replace(/\r\n/g, "\n") !== text.replace(/\r\n/g, "\n")) {
    console.error("[gen-schemas] FAIL — generated/schemas.ts is stale or was hand-edited.");
    console.error("  The registry and the contracts have diverged, which is exactly what E-06 forbids.");
    console.error("  Fix: add the field to constants/ufr.ts, then run `npm run schemas`.");
    process.exit(1);
  }
  console.log(`[gen-schemas] OK — contracts match the registry (${count} fields, ${objCount} objects)\n`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, text, "utf8");
console.log(`[gen-schemas] wrote generated/schemas.ts — ${count} fields across ${objCount} objects\n`);
