#!/usr/bin/env node
/**
 * ELIGIBILITY LINT — the v5 role layer must bind to things that exist
 *
 * constants/role-eligibility.ts declares fourteen principals and, for
 * each, the role it may be granted and the digital profiles that carry
 * its workspace access. Those are claims about two other registries, and
 * a claim nobody checks is a comment.
 *
 * The load-time block in role-eligibility.ts already catches what it can
 * see from inside itself — duplicate ids, a missing boundary, an external
 * tier that named a role. It cannot check the other two files without
 * importing them at module load and coupling the registries together.
 * That is this file's job.
 *
 * ── THE CHECK THAT EARNS ITS KEEP IS 3 ───────────────────────────────
 * A principal can name a real role and real profiles and still be
 * unreachable, because a grant is only issuable to an identity whose
 * profile lists that role as requestable. Declaring GC Executive eligible
 * for `executive_office` means nothing if no profile can ask for it.
 * Check 3 is the difference between a declaration and a working one.
 *
 * Every parse refuses to pass on zero results. A regex that silently
 * matches nothing reads as "all clear" and is the failure this repo has
 * already shipped once — see the \r\n note in ufr-lint.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const eligSrc = read("constants", "role-eligibility.ts");
const authSrc = read("lib", "authority.ts");
const profSrc = read("constants", "digital-profiles.ts");

const fail = [];
const die = (msg) => {
  console.error(`[eligibility-lint] ${msg}`);
  process.exit(2);
};

// ── Registries ───────────────────────────────────────────────────────

const roleBlock = authSrc.match(/export type Role =([\s\S]*?);/);
if (!roleBlock) die("Could not find the Role union in lib/authority.ts.");
const ROLES = new Set([...roleBlock[1].matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
if (ROLES.size === 0) die("Parsed zero roles from lib/authority.ts. Broken parse, not an empty list.");

const profIdBlock = profSrc.match(/export type DigitalProfileId =([\s\S]*?);/);
if (!profIdBlock) die("Could not find the DigitalProfileId union in constants/digital-profiles.ts.");
const PROFILE_IDS = new Set([...profIdBlock[1].matchAll(/"([a-z_0-9]+)"/g)].map((m) => m[1]));
if (PROFILE_IDS.size === 0) die("Parsed zero digital profile ids. Broken parse.");

/** profile id -> the roles it may request. */
const REQUESTABLE = new Map();
for (const m of profSrc.matchAll(
  /id:\s*"([a-z_0-9]+)"[\s\S]{0,400}?requestableRoles:\s*\[([^\]]*)\]/g,
)) {
  REQUESTABLE.set(m[1], [...m[2].matchAll(/"([a-z_]+)"/g)].map((x) => x[1]));
}
if (REQUESTABLE.size === 0) die("Parsed zero requestableRoles entries. Broken parse.");

// ── The principals ───────────────────────────────────────────────────

const principals = [];
for (const m of eligSrc.matchAll(
  /\{\s*\n?\s*id:\s*"([a-z_0-9]+)",\s*name:\s*"([^"]+)",\s*tier:\s*"([a-z_]+)",([\s\S]*?)\n\s{2}\},/g,
)) {
  const [, id, name, tier, body] = m;
  const role = (body.match(/\brole:\s*"([a-z_]+)"/) || [])[1];
  const profiles = [...(body.match(/profiles:\s*\[([^\]]*)\]/) || [, ""])[1].matchAll(/"([a-z_0-9]+)"/g)]
    .map((x) => x[1]);
  principals.push({
    id, name, tier, role, profiles,
    mandate: /\bmandate:\s*true/.test(body),
    sees: (body.match(/sees:\s*\n?\s*"/) || body.match(/sees:/)) ? true : false,
    boundary: /boundary:/.test(body),
  });
}

if (principals.length === 0) {
  die("Parsed zero principals from constants/role-eligibility.ts. That is a broken parse.");
}

console.log(
  `[eligibility-lint] ${principals.length} principals · ${ROLES.size} roles · ` +
    `${PROFILE_IDS.size} profiles`,
);

// ── Checks ───────────────────────────────────────────────────────────

for (const p of principals) {
  // 1. The role exists.
  if (p.role && !ROLES.has(p.role)) {
    fail.push(`${p.id} names role "${p.role}", which is not in the Role union in lib/authority.ts.`);
  }

  // 2. Every profile exists.
  for (const prof of p.profiles) {
    if (!PROFILE_IDS.has(prof)) {
      fail.push(`${p.id} names profile "${prof}", which is not a DigitalProfileId.`);
    }
  }
  if (p.profiles.length === 0) fail.push(`${p.id} names no profile.`);

  // 3. The eligibility is actually reachable.
  if (p.role) {
    const reachable = p.profiles.some((prof) => (REQUESTABLE.get(prof) ?? []).includes(p.role));
    if (!reachable) {
      fail.push(
        `${p.id} is declared eligible for "${p.role}", but none of its profiles ` +
          `(${p.profiles.join(", ")}) lists that role in requestableRoles. The eligibility cannot ` +
          `be exercised — no grant to it could ever be issued.`,
      );
    }
  }

  // 4. External and AI hold no role, in the declaration AND in the profile.
  if (p.tier === "external" || p.tier === "ai") {
    if (p.role) fail.push(`${p.id} is ${p.tier} and must not name a role.`);
    for (const prof of p.profiles) {
      const rr = REQUESTABLE.get(prof) ?? [];
      if (rr.length > 0) {
        fail.push(
          `${p.id} is ${p.tier}, but its profile "${prof}" can request ${rr.join(", ")}. ` +
            `Capacity is never authority, and an agent holds none by construction.`,
        );
      }
    }
  }

  // 5. Both narrative fields are present.
  if (!p.boundary) fail.push(`${p.id} states no boundary.`);
  if (!p.sees) fail.push(`${p.id} states nothing it sees.`);
}

// 6. The vehicle tier is one role wearing three mandates.
const vehicle = principals.filter((p) => p.tier === "vehicle");
const vehicleRoles = new Set(vehicle.map((p) => p.role));
if (vehicleRoles.size > 1) {
  fail.push(
    `The vehicle tier names ${vehicleRoles.size} roles (${[...vehicleRoles].join(", ")}). ` +
      `Designated Partner and Authorised Signatory are MANDATES over the partner role — the ` +
      `sheet is explicit that signing authority is "a named, expiring grant per mandate, not a ` +
      `property of the role". A separate role would survive the mandate that justified it.`,
  );
}
for (const p of vehicle) {
  if (p.id !== "partner" && !p.mandate) {
    fail.push(`${p.id} is a vehicle principal other than Partner and must be marked mandate: true.`);
  }
}

// ── Report ───────────────────────────────────────────────────────────

if (fail.length) {
  console.error(`\n[eligibility-lint] FAIL — ${fail.length} finding(s)\n`);
  for (const f of fail) console.error(`  x ${f}`);
  process.exit(1);
}

const byTier = principals.reduce((a, p) => ((a[p.tier] = (a[p.tier] ?? 0) + 1), a), {});
console.log(
  `[eligibility-lint] OK — ` +
    Object.entries(byTier).map(([t, n]) => `${t} ${n}`).join(" · ") +
    ` · ${principals.filter((p) => p.mandate).length} mandate(s)`,
);
