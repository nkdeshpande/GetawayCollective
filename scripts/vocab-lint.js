#!/usr/bin/env node
/**
 * Vocabulary Linter — enforces L1-01 §25 + §25a (The Member Law)
 *
 * The forbidden list is PARSED FROM constants/vocabulary.ts at runtime.
 * It is deliberately NOT duplicated here.
 *
 * Why: this linter previously carried its own hardcoded list of six terms while
 * vocabulary.ts forbade fifteen. The two drifted after the Investment Platform
 * pivot, and the linter went on passing files that contained Studio, Journey,
 * Experience and Service as enum members. Worse, its replacement advice pointed
 * at terms that had themselves become forbidden ("room -> Studio").
 *
 * A linter with its own copy of the canon is a second canon. There is one now.
 *
 * Zero dependencies: node:fs and node:path only.
 *
 * Escape hatch: append `// vocab-lint-ignore` to a line that must legitimately
 * name a forbidden term (an external API field, or a list of rejected nouns).
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const VOCAB_SRC = path.join(ROOT, "constants", "vocabulary.ts");

const SCAN_DIRS = ["app", "lib", "constants", "types", "fixtures", "tests", "components", "packages", "apps"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "scripts", ".turbo"]);
const IGNORE_PRAGMA = "vocab-lint-ignore";

/** The vocabulary module necessarily names the forbidden terms in order to forbid them. */
const SELF_REFERENTIAL = new Set([path.join("constants", "vocabulary.ts")]);

// ── Derive the forbidden list from the single source ──────────────────
function loadForbidden() {
  const src = fs.readFileSync(VOCAB_SRC, "utf8");
  const block = src.match(/forbidden:\s*\{([\s\S]*?)\n\s*\},/);
  if (!block) {
    console.error(`[vocab-lint] Could not parse the 'forbidden' block in ${path.relative(ROOT, VOCAB_SRC)}.`);
    console.error("The linter derives its rules from that file and will not fall back to a copy.");
    process.exit(2);
  }
  const rules = [];
  const entry = /"([^"]+)"\s*:\s*"([^"]*)"/g;
  let m;
  while ((m = entry.exec(block[1])) !== null) {
    rules.push({
      term: m[1],
      guidance: m[2],
      pattern: new RegExp(`\\b${m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
    });
  }
  if (rules.length === 0) {
    console.error("[vocab-lint] Parsed the forbidden block but found no terms. Refusing to pass vacuously.");
    process.exit(2);
  }
  return rules;
}

/**
 * Declared compounds: phrases in which a forbidden word carries a different,
 * constitutionally sanctioned meaning ("Debt Service", "Commercial Services
 * Agreement"). Parsed from the same single source as the forbidden list.
 */
function loadCompounds() {
  const src = fs.readFileSync(VOCAB_SRC, "utf8");
  const block = src.match(/ALLOWED_COMPOUNDS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return [];
  return [...block[1].matchAll(/"([^"]+)"\s*:/g)].map((m) => m[1]);
}

/**
 * True when the match at `index` sits inside a declared compound.
 * Compared case-insensitively so "debt service" and "Debt Service" behave
 * identically — a linter that depends on capitalisation is a coin toss.
 */
function insideCompound(line, index, matchLen, compounds) {
  const lower = line.toLowerCase();
  for (const c of compounds) {
    const cl = c.toLowerCase();
    let from = 0;
    for (;;) {
      const at = lower.indexOf(cl, from);
      if (at === -1) break;
      if (index >= at && index + matchLen <= at + cl.length) return true;
      from = at + 1;
    }
  }
  return false;
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(full, out);
    } else if (SCAN_EXTS.has(path.extname(e.name))) {
      out.push(full);
    }
  }
  return out;
}

// ── Run ───────────────────────────────────────────────────────────────
const FORBIDDEN = loadForbidden();
const COMPOUNDS = loadCompounds();
console.log(
  `[vocab-lint] Enforcing ${FORBIDDEN.length} forbidden terms ` +
  `(${COMPOUNDS.length} declared compounds) from constants/vocabulary.ts\n`,
);

/**
 * Is this occurrence inside a `backtick-quoted` span?
 *
 * The assemblies registry has to be able to record what a prototype
 * ACTUALLY said in order to correct it — a correction reading "the source
 * used a forbidden word" is not reviewable. Quoting the violation is the
 * point of the record.
 *
 * Backticks are the narrow form of that permission. Everywhere in this
 * codebase a backtick span is either quoted source material or a code
 * token (`user-scalable=no` is a CSS attribute, not the actor noun). Prose
 * outside them stays governed, which is the part that matters.
 */
function insideQuotation(line, index) {
  let ticks = 0;
  for (let i = 0; i < index; i++) if (line[i] === "`") ticks++;
  return ticks % 2 === 1;
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (SELF_REFERENTIAL.has(rel)) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (line.includes(IGNORE_PRAGMA)) return;
    for (const rule of FORBIDDEN) {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        if (insideCompound(line, match.index, match[0].length, COMPOUNDS)) continue;
        if (insideQuotation(line, match.index)) continue;
        violations.push({
          file: rel,
          line: idx + 1,
          column: match.index + 1,
          term: match[0],
          guidance: rule.guidance,
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`[vocab-lint] FAIL — ${violations.length} violation(s) across ${new Set(violations.map((v) => v.file)).size} file(s)\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.column}`);
    console.error(`    "${v.term}" — ${v.guidance}\n`);
  }
  process.exit(1);
}

console.log(`[vocab-lint] PASS — ${files.length} file(s) clean.\n`);
process.exit(0);
