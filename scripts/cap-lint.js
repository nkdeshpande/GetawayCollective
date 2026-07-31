#!/usr/bin/env node
/**
 * Capability Linter — enforces E-01 and the integrity of the L5 registry
 *
 * Wave 2 · Semantic Core
 *
 * Checks:
 *   1. Every capability emits at least one event (E-01)
 *   2. Every declared event exists in the EventType union
 *   3. Every required right exists in the Right union
 *   4. Every capability targets a ratified L2 object
 *   5. Capability names are unique
 *   6. Every decision event is emitted by at least one capability that
 *      requires a reason — otherwise E-02 is unreachable for that event
 *   7. No role holds a separation-of-powers triad (GP-06)
 *   8. Every right is reachable from at least one role, and every right is
 *      used by at least one capability — an unreachable right is a rule
 *      nobody can obey; an unused right is a rule nobody needs
 *
 * Zero dependencies. Parses source rather than importing, so it runs
 * without a TypeScript toolchain — same as the other gate checks.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const CMD = path.join(ROOT, "lib", "commands.ts");
const EV = path.join(ROOT, "lib", "events.ts");
const AUTH = path.join(ROOT, "lib", "authority.ts");
const BO = path.join(ROOT, "constants", "business-objects.ts");

const fail = [];
const warn = [];

/** Members of a union type declared as `| "x"` lines. */
function unionMembers(file, typeName) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(new RegExp(`export type ${typeName}\\s*=([\\s\\S]*?);`));
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function objects() {
  const src = fs.readFileSync(BO, "utf8");
  const block = src.match(/export enum BusinessObjectType \{([\s\S]*?)\n\}/);
  return block ? [...block[1].matchAll(/^\s*(\w+)\s*=\s*"/gm)].map((x) => x[1]) : [];
}

function capabilities() {
  const src = fs.readFileSync(CMD, "utf8");
  const out = [];
  for (const m of src.matchAll(/C\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const g = (k) => (b.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`)) || [])[1];
    const emits = (() => {
      const e = b.match(/emits:\s*\[([^\]]*)\]/);
      return e ? [...e[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
    })();
    out.push({
      name: g("name"),
      object: (b.match(/object:\s*BO\.(\w+)/) || [])[1],
      requiredRight: g("requiredRight"),
      scopeKind: g("scopeKind"),
      emits,
      requiresReason: /requiresReason:\s*true/.test(b),
      conflictSensitive: /conflictSensitive:\s*true/.test(b),
      description: g("description") || "",
    });
  }
  return out;
}

function decisionEvents() {
  const src = fs.readFileSync(EV, "utf8");
  const m = src.match(/DECISION_EVENTS[^=]*=\s*new Set<EventType>\(\[([\s\S]*?)\]\)/);
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
}

function roleRights() {
  const src = fs.readFileSync(AUTH, "utf8");
  const m = src.match(/ROLE_RIGHTS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!m) return {};
  const out = {};
  for (const r of m[1].matchAll(/(\w+):\s*\[([\s\S]*?)\]/g)) {
    out[r[1]] = [...r[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  }
  return out;
}

const SEPARATION_TRIADS = [
  ["capital.deploy", "distribution.execute", "resolution.resolve"],
  ["acquisition.complete", "distribution.execute", "policy.approve"],
];

// ── Run ───────────────────────────────────────────────────────────────
const EVENTS = unionMembers(EV, "EventType");
const RIGHTS = unionMembers(AUTH, "Right");
const OBJECTS = objects();
const CAPS = capabilities();
const DECISIONS = decisionEvents();
const ROLES = roleRights();

if (!EVENTS || !RIGHTS) {
  console.error("[cap-lint] Could not parse EventType or Right. Refusing to run.");
  process.exit(2);
}
if (CAPS.length === 0) {
  console.error("[cap-lint] Parsed zero capabilities. Refusing to pass vacuously.");
  process.exit(2);
}

// 1. E-01
for (const c of CAPS) {
  if (c.emits.length === 0) {
    fail.push(`${c.name} declares no events. A capability that changes state must publish at least one (E-01).`);
  }
}

// 2 + 3 + 4
for (const c of CAPS) {
  for (const e of c.emits) {
    if (!EVENTS.includes(e)) fail.push(`${c.name} emits "${e}", which is not in the EventType union`);
  }
  if (!RIGHTS.includes(c.requiredRight)) {
    fail.push(`${c.name} requires "${c.requiredRight}", which is not in the Right union`);
  }
  if (!OBJECTS.includes(c.object)) {
    fail.push(`${c.name} targets "${c.object}", which is not a ratified L2 object`);
  }
  if (!["enterprise", "vehicle"].includes(c.scopeKind)) {
    fail.push(`${c.name} has scopeKind "${c.scopeKind}"; expected enterprise or vehicle`);
  }
  if (!c.description || c.description.length < 25) {
    warn.push(`${c.name} has a thin description`);
  }
}

// 5. unique names
const seen = new Set();
for (const c of CAPS) {
  if (seen.has(c.name)) fail.push(`duplicate capability name ${c.name}`);
  seen.add(c.name);
}

// 6. every decision event must be reachable from a reason-carrying capability
for (const d of DECISIONS) {
  const emitters = CAPS.filter((c) => c.emits.includes(d));
  if (emitters.length === 0) {
    warn.push(`decision event "${d}" is emitted by no capability — E-02 is unreachable for it`);
  } else if (!emitters.some((c) => c.requiresReason)) {
    fail.push(
      `decision event "${d}" is only emitted by capabilities that do not require a reason ` +
        `(${emitters.map((c) => c.name).join(", ")}). E-02 cannot be satisfied.`,
    );
  }
}

// 7. GP-06 separation of powers
for (const [role, rights] of Object.entries(ROLES)) {
  for (const triad of SEPARATION_TRIADS) {
    if (triad.every((r) => rights.includes(r))) {
      fail.push(
        `role "${role}" holds ${triad.join(" + ")} simultaneously. No individual may hold investment approval, ` +
          `financial execution and governance review at once (GP-06, EP-01 §1.7).`,
      );
    }
  }
}

// 8. reachability both directions
const grantable = new Set(Object.values(ROLES).flat());
for (const r of RIGHTS) {
  if (!grantable.has(r)) {
    fail.push(`right "${r}" is carried by no role. It can never be granted, so any capability needing it is dead.`);
  }
}
const used = new Set(CAPS.map((c) => c.requiredRight));
for (const r of RIGHTS) {
  if (!used.has(r)) warn.push(`right "${r}" is required by no capability`);
}

// ── Report ────────────────────────────────────────────────────────────
console.log(
  `[cap-lint] ${CAPS.length} capabilities · ${EVENTS.length} event types · ` +
  `${RIGHTS.length} rights · ${Object.keys(ROLES).length} roles\n`,
);

if (warn.length) {
  console.log(`[cap-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[cap-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

const decisionCaps = CAPS.filter((c) => c.requiresReason).length;
const conflictCaps = CAPS.filter((c) => c.conflictSensitive).length;
console.log(`[cap-lint] PASS — every capability publishes events (E-01)`);
console.log(`  ${decisionCaps} require a recorded reason (E-02) · ${conflictCaps} are conflict-sensitive (I-07)\n`);
process.exit(0);
