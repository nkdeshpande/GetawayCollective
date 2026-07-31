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

/* Line endings normalised at the read. A pattern ending `\n` silently
   stops matching the moment a `\r` appears before it, and the failure
   mode is a parser returning ZERO — which reads as "nothing to check"
   rather than "the check is broken". ufr-lint shipped exactly that bug. */

const ROOT = path.resolve(__dirname, "..");
const VOCAB_SRC = path.join(ROOT, "constants", "vocabulary.ts");

const SCAN_DIRS = ["app", "lib", "constants", "content", "types", "fixtures", "tests", "components", "packages", "apps"];

/*
 * Top-level directories that hold no member-facing prose, and why.
 *
 * SCAN_DIRS is an allowlist, which means a new directory is unscanned by
 * default and nothing says so. content/ was added carrying 5,154 words of
 * member-facing legal prose and this linter reported the same 183 files
 * as the run before it — a clean PASS that had read none of it.
 *
 * Every top-level directory must now appear in one list or the other, so
 * the next one is a build failure rather than a silent omission.
 */
const NOT_PROSE = {
  scripts: "The checkers themselves. Their output is read by developers, not partners.",
  constitution: "Source canon in Markdown. Scanned by its own tooling, and quoting a forbidden term is how it defines one.",
  docs: "Developer documentation.",
  generated: "Written from the registries; fix a violation at its generator.",
  migrations: "Database schema.",
};
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "scripts", ".turbo"]);
const IGNORE_PRAGMA = "vocab-lint-ignore";

/** CRLF to LF. Every read in this file goes through it — see the note above. */
const normalise = (text) => text.split("\r\n").join("\n");

/** The vocabulary module necessarily names the forbidden terms in order to forbid them. */
const SELF_REFERENTIAL = new Set([path.join("constants", "vocabulary.ts")]);

// ── Derive the forbidden list from the single source ──────────────────
function loadForbidden() {
  const src = fs.readFileSync(VOCAB_SRC, "utf8").replace(/\r\n/g, "\n");
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
  const src = fs.readFileSync(VOCAB_SRC, "utf8").replace(/\r\n/g, "\n");
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

/* No top-level source directory may be neither scanned nor excused. */
{
  const present = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name) && !e.name.startsWith("."))
    .map((e) => e.name);
  const unaccounted = present.filter(
    (d) => !SCAN_DIRS.includes(d) && !(d in NOT_PROSE) &&
           !SCAN_DIRS.some((s) => s.startsWith(d + "/")),
  );
  if (unaccounted.length) {
    console.error(
      `[vocab-lint] Unaccounted top-level director${unaccounted.length > 1 ? "ies" : "y"}: ` +
        `${unaccounted.join(", ")}.\n` +
        `  Add to SCAN_DIRS if it can hold member-facing prose, or to NOT_PROSE with a reason.\n` +
        `  Refusing to report a PASS over a directory nobody decided about.`,
    );
    process.exit(2);
  }
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (SELF_REFERENTIAL.has(rel)) continue;

  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
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

/* ═══════════════════════════════════════════════════════════════════
   THE STANDING DISCLOSURE APPEARS IN ONE PLACE

   The three paragraphs on capital at risk, past performance and advice
   are stated once, in content/legal.ts, and rendered by exactly two
   documents: the Terms and Conditions at Part L and the Risk Factors at
   Part A. Anything else restating them — a footer, a banner, a hero, a
   commitment screen — is a second wording waiting to drift from the
   first.

   That is not hypothetical. The footer carried the full text on all 25
   pages that render it, while a load-time check inside content/legal.ts
   reported the constraint satisfied, because that check could only see
   its own module. Only rendering the pages showed it.

   Detection is by distinctive phrase rather than by whole paragraph, so
   a near-copy with one word changed is caught too. A near-copy is the
   failure mode that matters; an exact copy at least stays consistent.
   ═══════════════════════════════════════════════════════════════════ */
{
  const HOME = path.join("content", "legal.ts");
  const PHRASES = [
    "lose some or all of the capital",
    "Past performance is not a guide to future performance",
    "is not a registered investment adviser",
  ];

  const homeAbs = path.join(ROOT, HOME);
  if (!fs.existsSync(homeAbs)) {
    console.error(`[vocab-lint] ${HOME} is missing. Refusing to police copies of a text with no original.`);
    process.exit(2);
  }
  const home = normalise(fs.readFileSync(homeAbs, "utf8"));
  const absent = PHRASES.filter((x) => !home.includes(x));
  if (absent.length) {
    console.error(
      `[vocab-lint] The standing disclosure is not in ${HOME}: "${absent[0]}" is missing.\n` +
        `  Refusing to police copies of a text that no longer has an original.`,
    );
    process.exit(2);
  }

  /*
   * Files outside the scanned tree that can still carry the wording.
   *
   * The first version of this check reused `files`, which is .ts/.tsx/
   * .js/.json inside SCAN_DIRS. GC-ASSEMBLIES.html is a root-level HTML
   * file, so a full copy of the disclosure sat in the reference footer
   * and this check reported PASS over it — the same blind spot as the
   * directory allowlist, one axis across.
   */
  const ALSO = ["GC-ASSEMBLIES.html"]
    .map((f) => path.join(ROOT, f))
    .filter((f) => fs.existsSync(f));

  for (const file of [...files, ...ALSO]) {
    const rel = path.relative(ROOT, file);
    if (rel === HOME) continue;
    const lines = normalise(fs.readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, idx) => {
      if (line.includes(IGNORE_PRAGMA)) return;
      for (const phrase of PHRASES) {
        const at = line.indexOf(phrase);
        if (at === -1) continue;
        violations.push({
          file: rel,
          line: idx + 1,
          column: at + 1,
          term: phrase,
          guidance:
            "Restates the standing disclosure. It is stated once in content/legal.ts and " +
            "rendered by the Terms and the Risk Factors. Link to one of them instead.",
        });
      }
    });
  }
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
