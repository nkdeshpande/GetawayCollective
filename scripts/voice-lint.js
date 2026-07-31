#!/usr/bin/env node
/**
 * Voice Linter — enforces the ratified brand voice on member-facing strings
 *
 * Wave 5
 * Authority: L1-02 Part VII (ratified 31 Jul 2026)
 *
 * ── THE VOICE ────────────────────────────────────────────────────────
 * Warm · Confident · Assertive, with Pleasantness.
 *
 * ── WHY LINT IT ──────────────────────────────────────────────────────
 * Voice is the first thing to erode. Nobody sets out to write "Sorry,
 * something went wrong" — it arrives one string at a time, each added by
 * someone in a hurry who did not have the constitution open.
 *
 * The rules below are the mechanical half of the voice. They cannot check
 * whether a sentence is warm; they can check that it does not apologise,
 * hedge, blame, or trail off without saying what happens next.
 *
 * Prohibitions and softeners are PARSED from constants/tokens-addendum.ts,
 * for the same reason every other checker parses its canon.
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

/* Line endings normalised at the read. A pattern ending `\n` silently
   stops matching the moment a `\r` appears before it, and the failure
   mode is a parser returning ZERO — which reads as "nothing to check"
   rather than "the check is broken". ufr-lint shipped exactly that bug. */

const ROOT = path.resolve(__dirname, "..");
const ADDENDUM = path.join(ROOT, "constants", "tokens-addendum.ts");
const VALIDATION = path.join(ROOT, "constants", "validation.ts");
const ENUMS = path.join(ROOT, "constants", "enums.ts");

const fail = [];
const warn = [];

function listFrom(src, name) {
  const m = src.match(new RegExp(`${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
}

const addendum = fs.readFileSync(ADDENDUM, "utf8").replace(/\r\n/g, "\n");
const PROHIBITED = listFrom(addendum, "VOICE_PROHIBITIONS");
const SOFTENERS = listFrom(addendum, "VOICE_SOFTENERS");

if (PROHIBITED.length === 0) {
  console.error("[voice-lint] Could not parse VOICE_PROHIBITIONS. Refusing to run.");
  process.exit(2);
}

// ── Collect member-facing strings ─────────────────────────────────────
/** Validation messages: message, help and a11y are all read by a person. */
function validationStrings() {
  const src = fs.readFileSync(VALIDATION, "utf8").replace(/\r\n/g, "\n");
  const out = [];
  for (const m of src.matchAll(/V\(\s*"([^"]+)",\s*"(?:[^"\\]|\\.)*",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)"/g)) {
    out.push({ where: `VALIDATION.${m[1]}`, field: "message", text: m[2] });
    if (m[3]) out.push({ where: `VALIDATION.${m[1]}`, field: "help", text: m[3] });
    out.push({ where: `VALIDATION.${m[1]}`, field: "a11y", text: m[4] });
  }
  return out;
}

/** Enum labels and descriptions appear on screen. */
function enumStrings() {
  const src = fs.readFileSync(ENUMS, "utf8").replace(/\r\n/g, "\n");
  const out = [];
  for (const m of src.matchAll(/D\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"/g)) {
    out.push({ where: "ENUM_DISPLAY", field: "label", text: m[1] });
    out.push({ where: "ENUM_DISPLAY", field: "description", text: m[2] });
  }
  return out;
}

const STRINGS = [...validationStrings(), ...enumStrings()];

if (STRINGS.length === 0) {
  console.error("[voice-lint] Collected zero strings. Refusing to pass vacuously.");
  process.exit(2);
}

// ── Rules ─────────────────────────────────────────────────────────────
for (const s of STRINGS) {
  const lower = s.text.toLowerCase();

  // 1. Prohibited constructions — apology, hedging, blame.
  for (const p of PROHIBITED) {
    if (lower.includes(p.toLowerCase())) {
      fail.push(`${s.where}.${s.field}: contains "${p}". The voice does not apologise, hedge or blame.`);
    }
  }

  // 2. Softeners. "just" and "simply" tell a reader their difficulty was
  //    trivial, which is the opposite of warm.
  for (const soft of SOFTENERS) {
    if (lower.includes(soft.toLowerCase())) {
      fail.push(`${s.where}.${s.field}: contains "${soft.trim()}". A softener implies the difficulty was trivial.`);
    }
  }

  // 3. Exclamation marks. Confident is not loud.
  if (s.text.includes("!")) {
    fail.push(`${s.where}.${s.field}: contains an exclamation mark. Confident is not loud.`);
  }

  // 4. ALL-CAPS shouting (acronyms of 5 or fewer letters are fine).
  const shout = s.text.match(/\b[A-Z]{6,}\b/g);
  if (shout) {
    warn.push(`${s.where}.${s.field}: contains "${shout[0]}" in capitals. Emphasis comes from word order, not case.`);
  }
}

// ── Message-specific rules ────────────────────────────────────────────
for (const s of STRINGS.filter((x) => x.field === "message")) {
  // 5. A message must say more than that something is wrong.
  if (s.text.trim().length < 20) {
    fail.push(`${s.where}.message is ${s.text.trim().length} characters. Too short to say what happens next.`);
  }
  // 6. Assertive: a message should not end mid-thought.
  if (!/[.?]$/.test(s.text.trim())) {
    warn.push(`${s.where}.message does not end in a full stop.`);
  }
}

// 7. Accessible text names the field first, so it is intelligible when
//    heard without the input being seen.
for (const s of STRINGS.filter((x) => x.field === "a11y")) {
  if (!/(error|blocked|paused):/i.test(s.text)) {
    fail.push(`${s.where}.a11y does not name the field or state before the message. It is heard without the input being seen.`);
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log(
  `[voice-lint] ${STRINGS.length} member-facing strings · ` +
  `${PROHIBITED.length} prohibitions · ${SOFTENERS.length} softeners\n`,
);

if (warn.length) {
  console.log(`[voice-lint] ${warn.length} warning(s):`);
  for (const w of warn.slice(0, 12)) console.log(`  ! ${w}`);
  if (warn.length > 12) console.log(`  ... and ${warn.length - 12} more`);
  console.log("");
}

if (fail.length) {
  console.error(`[voice-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[voice-lint] PASS — Warm, Confident, Assertive, with Pleasantness (L1-02 Part VII)\n`);
process.exit(0);
