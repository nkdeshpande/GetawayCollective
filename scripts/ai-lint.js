#!/usr/bin/env node
/**
 * AI LINT — the agents may not outgrow their contracts
 *
 * constants/ai-contracts.ts is a declaration, and until this session it
 * was only a declaration. Now there is a runtime, and a declaration with
 * a runtime underneath it has a new failure mode: the two drift, the
 * registry keeps saying the right thing, and the code stops doing it.
 *
 * Checks:
 *   1. Every contract is either implemented or declared unimplemented.
 *      Neither list may silently drop one.
 *   2. Every contractId the runtime constructs is a real contract.
 *   3. The agent modules import no write path. ATLAS "never moves money";
 *      the way that holds is that it cannot reach anything that does.
 *   4. No approval disposition exists.
 *   5. Every unimplemented contract states what it is waiting on.
 *
 * Check 3 is the one worth explaining. Every other guarantee here is a
 * property of what the code says; this one is a property of what it can
 * REACH. An agent module that imports a command handler is one edit away
 * from acting, whatever its comments claim, and the import list is the
 * only place that is visible.
 *
 * Like every script here this parses source text rather than importing
 * TypeScript, and refuses a vacuous pass: a parse that finds nothing
 * reports a broken parser, not a clean bill.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
/* \r\n normalised at read — see the note in taxonomy-lint.js. */
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const contractSrc = read("constants", "ai-contracts.ts");
const outputSrc = read("lib", "ai", "output.ts");
const atlasSrc = read("lib", "ai", "atlas.ts");
const irisSrc = read("lib", "ai", "iris.ts");

const fail = [];
const err = (m) => fail.push(m);

/* ── Every declared contract ──────────────────────────────────────── */
const CONTRACTS = [...contractSrc.matchAll(/id:\s*"(AI-\d+)",\s*agent:\s*"(ATLAS|IRIS)"/g)]
  .map((m) => ({ id: m[1], agent: m[2] }));

if (CONTRACTS.length === 0) {
  console.error("[ai-lint] Parsed zero contracts. Broken parse, not a pass.");
  process.exit(2);
}

/* ── 1 & 2 · what the runtime claims ──────────────────────────────── */
const runtime = `${atlasSrc}\n${irisSrc}`;
const used = new Set([...runtime.matchAll(/contractId:\s*"(AI-\d+)"/g)].map((m) => m[1]));
/**
 * Both agents declare their own gaps, so both files are read.
 *
 * The UNIMPLEMENTED rows use the same `contractId:` key as a real output,
 * which means a naive scan counts a declared gap as an implementation and
 * passes. It did exactly that on the first run. `waitingOn` on the same
 * row is what tells them apart, and the two sets are made disjoint below
 * before anything is counted.
 */
const declaredMissing = new Set(
  [...runtime.matchAll(/contractId:\s*"(AI-\d+)",\s*waitingOn:/g)].map((m) => m[1]),
);

if (used.size === 0) {
  console.error("[ai-lint] The runtime constructs zero outputs. Broken parse, not a pass.");
  process.exit(2);
}

/* A contract named in UNIMPLEMENTED is not "used" — strip those out so
   the two sets stay disjoint and the coverage sum below is honest. */
const implemented = [...used].filter((id) => !declaredMissing.has(id));

/* Guards the guard. If the waitingOn regex ever stops matching, every
   declared gap silently becomes an implementation and this file reports
   full coverage — which is precisely the failure it exists to catch. Any
   file declaring UNIMPLEMENTED must yield at least one parsed row. */
const declaringFiles = [["atlas.ts", atlasSrc], ["iris.ts", irisSrc]]
  .filter(([, src]) => /UNIMPLEMENTED/.test(src));
if (declaringFiles.length > 0 && declaredMissing.size === 0) {
  console.error(
    "[ai-lint] Found UNIMPLEMENTED declarations but parsed zero of them. " +
    "Broken parse, not a pass — every gap would read as covered.",
  );
  process.exit(2);
}

for (const id of used) {
  if (!CONTRACTS.some((c) => c.id === id)) {
    err(`The runtime builds an output for "${id}", which is not a contract in the registry.`);
  }
}

for (const c of CONTRACTS) {
  const isImplemented = implemented.includes(c.id);
  const isDeclared = declaredMissing.has(c.id);
  if (!isImplemented && !isDeclared) {
    err(
      `${c.id} (${c.agent}) is neither implemented nor declared unimplemented. ` +
        `A contract nobody has decided about reads as covered.`,
    );
  }
  if (isImplemented && isDeclared) {
    err(`${c.id} is both implemented and declared unimplemented. One of the two is wrong.`);
  }
}

/* ── 5 · a reason, not just a name ────────────────────────────────── */
for (const m of runtime.matchAll(/contractId:\s*"(AI-\d+)",\s*waitingOn:\s*\n?\s*"([^"]*)"/g)) {
  if (m[2].trim().length < 30) {
    err(`${m[1]} is declared unimplemented with no real reason: "${m[2]}".`);
  }
}

/* ── 3 · what the agents can reach ────────────────────────────────── */
/**
 * Modules an agent may not import.
 *
 * Named by what they DO rather than by path fragment: `commands` and
 * `handlers` are the write path, `events/store` appends to the log. An
 * agent that can append an event can manufacture the history it then
 * reports on.
 */
const FORBIDDEN_IMPORTS = [
  { pattern: /from\s+"[^"]*\/commands"/, why: "commands are the write path" },
  { pattern: /from\s+"[^"]*\/handlers"/, why: "handlers execute capabilities" },
  { pattern: /from\s+"[^"]*events\/store"/, why: "appending events would let an agent author the history it reports on" },
  { pattern: /from\s+"[^"]*\/ledger"/, why: "the ledger is money moving" },
];

for (const [name, src] of [["atlas.ts", atlasSrc], ["iris.ts", irisSrc]]) {
  for (const f of FORBIDDEN_IMPORTS) {
    if (f.pattern.test(src)) {
      err(`lib/ai/${name} imports something it may not reach — ${f.why}.`);
    }
  }
}

/* ── 4 · no approval, structurally ────────────────────────────────── */
const dispositionBlock = outputSrc.match(/export type Disposition =([\s\S]*?);/);
if (!dispositionBlock) {
  console.error("[ai-lint] Could not find the Disposition union. Broken parse, not a pass.");
  process.exit(2);
}
const dispositions = [...dispositionBlock[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
if (dispositions.length === 0) {
  console.error("[ai-lint] Parsed zero dispositions. Broken parse, not a pass.");
  process.exit(2);
}
for (const d of dispositions) {
  if (/approv|sign|execut|authoris|authoriz|grant/i.test(d)) {
    err(
      `Disposition "${d}" lets an agent express an act it may not perform. ` +
        `AI_LAWS.escalationNeverApproval holds that both agents escalate and neither approves.`,
    );
  }
}

/* ── Report ───────────────────────────────────────────────────────── */
const byAgent = (a) => CONTRACTS.filter((c) => c.agent === a).length;
console.log(
  `[ai-lint] ${CONTRACTS.length} contracts (ATLAS ${byAgent("ATLAS")} · IRIS ${byAgent("IRIS")}) · ` +
  `${implemented.length} implemented · ${declaredMissing.size} declared unimplemented\n` +
  `[ai-lint] dispositions: ${dispositions.join(" · ")} — none of them acts`,
);

if (fail.length > 0) {
  console.error(`\n[ai-lint] FAIL — ${fail.length} violation(s)\n`);
  for (const f of fail) console.error(`  ${f}`);
  console.error("");
  process.exit(1);
}

console.log("[ai-lint] PASS — every contract is accounted for, and neither agent can reach a write path.");
