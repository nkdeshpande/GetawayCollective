#!/usr/bin/env node
/**
 * State Machine Linter — enforces A-05 and lifecycle integrity
 *
 * Wave 3 · Graph & Lifecycle
 *
 * Checks:
 *   1. Every state is reachable from `initial` — a dead state is a rule
 *      nobody can ever satisfy
 *   2. Terminal states have no outgoing transitions
 *   3. Non-terminal states have at least one way out
 *   4. Every `via` names a capability that exists in the L5 registry
 *   5. Every `emits` names an event in the EventType union
 *   6. The named capability actually DECLARES that event — otherwise the
 *      transition would fire an event the command refuses to emit
 *   7. Irreversible transitions are PROVEN irreversible by graph walk, not
 *      trusted. This is the check that matters: a declared-irreversible
 *      transition with a route home does not fail in testing, it fails in
 *      an audit years later
 *   8. No duplicate (from, to) pairs
 *   9. Every guard is stated
 *
 * Zero dependencies. Parses source, like the other gate checks.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SM = path.join(ROOT, "lib", "state-machines.ts");
const CMD = path.join(ROOT, "lib", "commands.ts");
const EV = path.join(ROOT, "lib", "events.ts");

const fail = [];
const warn = [];

function unionMembers(file, typeName) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(new RegExp(`export type ${typeName}\\s*=([\\s\\S]*?);`));
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : null;
}

/** Capability name -> declared events. */
function capabilities() {
  const src = fs.readFileSync(CMD, "utf8");
  const out = new Map();
  for (const m of src.matchAll(/C\(\{([\s\S]*?)\}\),/g)) {
    const b = m[1];
    const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
    const e = b.match(/emits:\s*\[([^\]]*)\]/);
    out.set(name, e ? [...e[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []);
  }
  return out;
}

function machines() {
  const src = fs.readFileSync(SM, "utf8");
  const out = [];
  // Each machine is `export const X: StateMachine = { ... };`
  for (const m of src.matchAll(/export const (\w+): StateMachine = \{([\s\S]*?)\n\};/g)) {
    const body = m[2];
    const name = (body.match(/name:\s*"([^"]+)"/) || [])[1];
    const initial = (body.match(/initial:\s*"([^"]+)"/) || [])[1];
    const states = (() => {
      const s = body.match(/states:\s*\[([^\]]*)\]/);
      return s ? [...s[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
    })();
    const terminal = (() => {
      const s = body.match(/terminal:\s*\[([^\]]*)\]/);
      return s ? [...s[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
    })();
    const transitions = [...body.matchAll(/T\(\{([\s\S]*?)\}\)/g)].map((t) => {
      const tb = t[1];
      const g = (k) => (tb.match(new RegExp(`\\b${k}:\\s*"([^"]*)"`)) || [])[1];
      return {
        from: g("from"), to: g("to"), via: g("via"), emits: g("emits"),
        reversible: /reversible:\s*true/.test(tb),
        guard: (tb.match(/guard:\s*\n?\s*"([\s\S]*?)"\s*\}/) || tb.match(/guard:\s*"([^"]*)"/) || [])[1] || "",
      };
    });
    out.push({ constName: m[1], name, initial, states, terminal, transitions });
  }
  return out;
}

const reachable = (m) => {
  const seen = new Set([m.initial]);
  const q = [m.initial];
  while (q.length) {
    const cur = q.shift();
    for (const t of m.transitions.filter((x) => x.from === cur)) {
      if (!seen.has(t.to)) { seen.add(t.to); q.push(t.to); }
    }
  }
  return seen;
};

/** Can `target` be reached walking forward from `from`? */
const reaches = (m, from, target) => {
  const seen = new Set();
  const q = [from];
  while (q.length) {
    const cur = q.shift();
    for (const t of m.transitions.filter((x) => x.from === cur)) {
      if (t.to === target) return true;
      if (!seen.has(t.to)) { seen.add(t.to); q.push(t.to); }
    }
  }
  return false;
};

// ── Run ───────────────────────────────────────────────────────────────
const EVENTS = unionMembers(EV, "EventType");
const CAPS = capabilities();
const MACHINES = machines();

if (!EVENTS || CAPS.size === 0) {
  console.error("[sm-lint] Could not parse EventType or the capability registry. Refusing to run.");
  process.exit(2);
}
if (MACHINES.length === 0) {
  console.error("[sm-lint] Parsed zero state machines. Refusing to pass vacuously.");
  process.exit(2);
}

let totalTransitions = 0;
let irreversibleCount = 0;

for (const m of MACHINES) {
  const label = m.name || m.constName;
  totalTransitions += m.transitions.length;

  if (!m.initial) fail.push(`${label}: no initial state`);
  if (!m.states.includes(m.initial)) fail.push(`${label}: initial "${m.initial}" is not in states`);

  // 1. reachability
  const seen = reachable(m);
  for (const s of m.states) {
    if (!seen.has(s)) {
      fail.push(`${label}: state "${s}" is unreachable from "${m.initial}". A dead state is a rule nobody can satisfy.`);
    }
  }

  for (const s of m.terminal) {
    if (!m.states.includes(s)) fail.push(`${label}: terminal "${s}" is not in states`);
    // 2. terminal means terminal
    const out = m.transitions.filter((t) => t.from === s);
    if (out.length) {
      fail.push(`${label}: "${s}" is declared terminal but has ${out.length} outgoing transition(s) to ${out.map((t) => t.to).join(", ")}`);
    }
  }

  // 3. non-terminal states need a way out
  for (const s of m.states) {
    if (m.terminal.includes(s)) continue;
    if (!m.transitions.some((t) => t.from === s)) {
      fail.push(`${label}: "${s}" has no outgoing transition but is not declared terminal. Either it is a dead end or the declaration is wrong.`);
    }
  }

  const pairs = new Set();
  for (const t of m.transitions) {
    const key = `${t.from}->${t.to}`;
    // 8. duplicates
    if (pairs.has(key)) fail.push(`${label}: duplicate transition ${key}`);
    pairs.add(key);

    if (!m.states.includes(t.from)) fail.push(`${label}: transition from unknown state "${t.from}"`);
    if (!m.states.includes(t.to)) fail.push(`${label}: transition to unknown state "${t.to}"`);

    // 4. capability exists
    if (!CAPS.has(t.via)) {
      fail.push(`${label}: ${key} names capability "${t.via}", which is not in the L5 registry`);
      continue;
    }
    // 5. event exists
    if (!EVENTS.includes(t.emits)) {
      fail.push(`${label}: ${key} emits "${t.emits}", which is not in the EventType union`);
      continue;
    }
    // 6. the capability declares it
    if (!CAPS.get(t.via).includes(t.emits)) {
      fail.push(
        `${label}: ${key} emits "${t.emits}" via ${t.via}, but ${t.via} declares only ` +
          `[${CAPS.get(t.via).join(", ")}]. The transition would fire an event the command refuses to emit.`,
      );
    }

    // 9. guards stated
    if (!t.guard || t.guard.length < 15) {
      warn.push(`${label}: ${key} has a thin or missing guard`);
    }

    // 7. PROVE irreversibility
    if (!t.reversible) {
      irreversibleCount++;
      if (reaches(m, t.to, t.from)) {
        fail.push(
          `${label}: ${key} is declared IRREVERSIBLE but "${t.from}" is reachable again from "${t.to}". ` +
            `A declared-irreversible transition with a route home does not fail in testing; it fails in an audit.`,
        );
      }
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────
console.log(
  `[sm-lint] ${MACHINES.length} machines · ${totalTransitions} transitions · ` +
  `${irreversibleCount} irreversible\n`,
);

if (warn.length) {
  console.log(`[sm-lint] ${warn.length} warning(s):`);
  for (const w of warn) console.log(`  ! ${w}`);
  console.log("");
}

if (fail.length) {
  console.error(`[sm-lint] FAIL — ${fail.length} error(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`[sm-lint] PASS — every state reachable, every terminal state terminal,`);
console.log(`  every transition bound to a capability that declares its event,`);
console.log(`  and all ${irreversibleCount} irreversible transitions proven by graph walk\n`);
process.exit(0);
