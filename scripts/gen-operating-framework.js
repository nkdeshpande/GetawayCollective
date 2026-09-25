#!/usr/bin/env node
/**
 * OPERATING FRAMEWORK — builds GC-OPERATING-FRAMEWORK.html
 *
 * ── WHY THIS IS GENERATED AND NOT DRAWN ──────────────────────────────
 * An access-control document is exactly the kind of thing that gets made
 * once, pinned somewhere, and quietly stops being true. The moment a right
 * is added to ROLE_RIGHTS the hand-drawn version is wrong, and it is wrong
 * in the direction that matters: it under-states who can do what.
 *
 * So every tick, queue and count here is read out of lib/authority.ts,
 * lib/commands.ts and constants/intake.ts by transpiling and executing
 * them. Nothing is typed by hand. Re-run and it is current, or it fails.
 *
 * ── WHAT IT REFUSES ──────────────────────────────────────────────────
 * Same discipline as the linters: a parse that recovers nothing is a broken
 * parser, not an empty system. This exits non-zero if the rights, roles,
 * capabilities or triads come back empty, if any right falls outside a
 * domain band, if the internal-only list names a right that does not exist,
 * or — the load-bearing one — if the intake framework does not close.
 *
 * CLOSURE is the property that makes this a framework rather than a
 * diagram: every capability must be reachable by exactly ONE lane, either
 * borne by a document kind or declared as an act. A capability in neither
 * is unreachable and nobody would notice. A capability in both is an
 * ambiguity that resolves differently depending on who is looking.
 *
 * ── THE OPTIONAL LIVE READ ───────────────────────────────────────────
 * `--register` additionally queries the grant tables so the last tab shows
 * the real register rather than only its shape. Without the flag the tab
 * says so plainly rather than implying an empty database.
 *
 *   node scripts/gen-operating-framework.js
 *   node scripts/gen-operating-framework.js --register
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "GC-OPERATING-FRAMEWORK.html");
const WANT_REGISTER = process.argv.includes("--register");

const die = (msg) => { console.error(`[framework] ${msg}`); process.exit(2); };

/* ── Load the real modules ────────────────────────────────────────── */

function loadTypeScript(relativePath, resolveImport = () => ({})) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const moduleRecord = { exports: {} };
  vm.runInNewContext(javascript, {
    module: moduleRecord, exports: moduleRecord.exports, require: resolveImport,
    Set, Map, Error, Object, Array, JSON, console, Date,
  });
  return moduleRecord.exports;
}

const authority = loadTypeScript("lib/authority.ts");
const businessObjects = loadTypeScript("constants/business-objects.ts");
const voting = loadTypeScript("constants/voting.ts");
const events = loadTypeScript("lib/events.ts", (r) =>
  r.includes("business-objects") ? businessObjects : {});
const governance = loadTypeScript("lib/governance.ts", (r) => {
  if (r.includes("voting")) return voting;
  if (r.includes("events")) return events;
  if (r.includes("authority")) return authority;
  if (r.includes("business-objects")) return businessObjects;
  return {};
});
const commands = loadTypeScript("lib/commands.ts", (r) => {
  if (r.includes("business-objects")) return businessObjects;
  if (r.includes("events")) return events;
  if (r.includes("authority")) return authority;
  if (r.includes("governance")) return governance;
  return {};
});

/* constants/intake.ts imports only TYPES, which transpile away entirely —
   so it loads against a no-op require rather than the whole graph. */
const intake = loadTypeScript("constants/intake.ts");

const { ALL_RIGHTS, ROLE_RIGHTS, SEPARATION_TRIADS, separationViolations } = authority;
const CAPABILITIES = commands.CAPABILITIES;
const ROLES = Object.keys(ROLE_RIGHTS);
const { DOCUMENT_KINDS, DECLARED_ACTS, PIPELINE, ESCALATION_TRIGGERS, BULK_RULES } = intake;

if (!Array.isArray(ALL_RIGHTS) || ALL_RIGHTS.length === 0) die("Recovered zero rights.");
if (ROLES.length === 0) die("Recovered zero roles.");
if (!Array.isArray(CAPABILITIES) || CAPABILITIES.length === 0) die("Recovered zero capabilities.");
if (!Array.isArray(SEPARATION_TRIADS) || SEPARATION_TRIADS.length === 0) die("Recovered zero separation triads.");
for (const [name, arr] of [["DOCUMENT_KINDS", DOCUMENT_KINDS], ["DECLARED_ACTS", DECLARED_ACTS],
  ["PIPELINE", PIPELINE], ["ESCALATION_TRIGGERS", ESCALATION_TRIGGERS], ["BULK_RULES", BULK_RULES]]) {
  if (!Array.isArray(arr) || arr.length === 0) die(`Recovered zero ${name}.`);
}

/* ── CLOSURE ──────────────────────────────────────────────────────────
   The check that makes this a framework rather than a picture of one.
   Every capability reachable by exactly one lane — no orphans (unreachable
   and unnoticed), no capability in both lanes (resolves differently
   depending on who is looking), no lane naming a command that does not
   exist (a registry that rots misleads the next agent). */
const CAP_NAMES = CAPABILITIES.map((c) => c.name);
const FILE_BORNE = [...new Set(DOCUMENT_KINDS.flatMap((d) => d.proposes))];
const DECLARED = DECLARED_ACTS.map((a) => a.command);

const orphans = CAP_NAMES.filter((c) => !FILE_BORNE.includes(c) && !DECLARED.includes(c));
const bothLanes = CAP_NAMES.filter((c) => FILE_BORNE.includes(c) && DECLARED.includes(c));
const ghosts = [...FILE_BORNE, ...DECLARED].filter((c) => !CAP_NAMES.includes(c));

/* Ghosts first. A mistyped command name orphans the real capability AND
   invents a fake one, and reporting the orphan would send the reader
   looking for a missing lane rather than at the typo that caused it. */
if (ghosts.length) die(`Intake names ${ghosts.join(", ")}, which ${ghosts.length === 1 ? "is not a capability" : "are not capabilities"}. Check the spelling before looking for a missing lane.`);
if (orphans.length) die(`${orphans.length} capability reachable by no lane: ${orphans.join(", ")}. Unreachable and nobody would notice.`);
if (bothLanes.length) die(`${bothLanes.length} capability in both lanes: ${bothLanes.join(", ")}. Evidenced and decided are not both true.`);

const CONFIDENCE_RANK = ["VERIFIED", "CORROBORATED", "REPORTED", "INFERRED", "FORECAST", "UNKNOWN"];
for (const d of DOCUMENT_KINDS) {
  if (!CONFIDENCE_RANK.includes(d.ceiling)) die(`Document kind "${d.id}" declares ceiling "${d.ceiling}", which is not a confidence class.`);
  if (d.citation === "file" && d.proposes.some((p) => {
    const c = CAPABILITIES.find((x) => x.name === p);
    return c && !/Media/.test(c.name);
  })) die(`"${d.id}" cites at file level but proposes a capability carrying figures. File-level citation is metadata only.`);
}

/**
 * INTERNAL_ONLY_RIGHTS by source extraction rather than module load.
 *
 * lib/access-admin.ts pulls in the whole partner-firm and operating-model
 * graph for one flat array of strings. The regex is checked hard below —
 * every name must be a real right — so a drifting extraction fails rather
 * than silently marking nothing internal.
 */
const adminSrc = fs.readFileSync(path.join(ROOT, "lib/access-admin.ts"), "utf8").replace(/\r\n/g, "\n");
const internalBlock = adminSrc.match(/INTERNAL_ONLY_RIGHTS[^=]*=\s*\[([\s\S]*?)\]\s*as const;/);
if (!internalBlock) die("Could not locate INTERNAL_ONLY_RIGHTS.");
const INTERNAL_ONLY = [...internalBlock[1].matchAll(/"([a-z_.]+)"/g)].map((m) => m[1]);
if (INTERNAL_ONLY.length === 0) die("INTERNAL_ONLY_RIGHTS parsed empty.");
for (const r of INTERNAL_ONLY) {
  if (!ALL_RIGHTS.includes(r)) die(`INTERNAL_ONLY_RIGHTS names "${r}", which is not a right.`);
}

/* ── Domain bands ─────────────────────────────────────────────────── */
/* The groupings the Right union is written in. Asserted below to cover
   every right exactly once, so a new right cannot slip in unbanded and
   render outside the table. */
const DOMAINS = [
  { key: "enterprise", label: "Enterprise", note: "Acts of the Organization itself. Enterprise scope only.",
    rights: ["organization.register", "committee.constitute", "authority.grant", "authority.revoke", "content.publish", "media.manage"] },
  { key: "vehicles", label: "Vehicles", note: "Standing up, stabilising and winding down an LLP.",
    rights: ["vehicle.form", "vehicle.stabilise", "vehicle.dissolve", "portfolio.manage"] },
  { key: "assets", label: "Assets", note: "The estate itself — registration through disposal.",
    rights: ["property.register", "property.advance_lifecycle", "acquisition.complete", "valuation.record", "disposition.complete"] },
  { key: "capital", label: "Capital", note: "Money in, money out. The densest concentration of internal-only rights.",
    rights: ["offering.open", "offering.close", "commitment.accept", "capital.call", "capital.deploy", "distribution.execute", "ownership.transfer", "position.record"] },
  { key: "compliance", label: "Identity & compliance", note: "Who is eligible, what was recorded, and when the constitution has failed.",
    rights: ["accreditation.grant", "compliance.record", "constitutional_failure.declare", "investor.register", "kyc.record", "bank.record"] },
  { key: "governance", label: "Governance", note: "Tabling, resolving, voting and approving policy.",
    rights: ["conflict.disclose", "resolution.table", "resolution.resolve", "vote.cast", "policy.approve"] },
  { key: "reporting", label: "Reporting", note: "What is published outward and what is versioned inward.",
    rights: ["report.publish", "thesis.version", "diligence.complete"] },
];

const banded = DOMAINS.flatMap((d) => d.rights);
for (const r of ALL_RIGHTS) if (!banded.includes(r)) die(`Right "${r}" belongs to no domain band. Add it.`);
for (const r of banded) if (!ALL_RIGHTS.includes(r)) die(`Domain band names "${r}", which is not a right.`);
if (banded.length !== new Set(banded).size) die("A right appears in two domain bands.");

/* ── Derived facts ────────────────────────────────────────────────── */

const holders = (right) => ROLES.filter((role) => ROLE_RIGHTS[role].includes(right));
const capsFor = (right) => CAPABILITIES.filter((c) => c.requiredRight === right);

const UNHELD = ALL_RIGHTS.filter((r) => holders(r).length === 0);
const SOLE = ALL_RIGHTS.filter((r) => holders(r).length === 1);
const UNIVERSAL = ALL_RIGHTS.filter((r) => holders(r).length === ROLES.length);
const TRIAD_RIGHTS = new Set(SEPARATION_TRIADS.flat());
const RIGHTS_WITHOUT_CAPABILITY = ALL_RIGHTS.filter((r) => capsFor(r).length === 0);

/* Which role SETS complete a triad. Every subset is checked rather than
   pairs alone: GP-06 is a property of the union of rights an identity
   holds, and an identity may hold several grants at once. */
const completesTriad = (roleSet) => {
  const held = new Set(roleSet.flatMap((r) => ROLE_RIGHTS[r]));
  return SEPARATION_TRIADS.find((t) => t.every((x) => held.has(x))) || null;
};

const refusedSets = [];
let maximalLawful = [];
for (let mask = 1; mask < (1 << ROLES.length); mask++) {
  const set = ROLES.filter((_, i) => mask & (1 << i));
  const triad = completesTriad(set);
  if (triad) {
    /* Only MINIMAL refused sets are interesting — a refused set with a
       refused subset tells the reader nothing new. */
    const minimal = set.every((role) => !completesTriad(set.filter((x) => x !== role)));
    if (minimal) refusedSets.push({ set, triad: [...triad] });
  } else if (set.length > maximalLawful.length) {
    maximalLawful = set;
  }
}

const violations = typeof separationViolations === "function" ? separationViolations() : [];

/* ── The consolidation ────────────────────────────────────────────────
   Eight queues, derived rather than assigned. A role's queue is exactly
   the capabilities its rights carry — which means the queue cannot drift
   from the authority model, because it IS the authority model read from
   the other end. Nobody maintains a routing table. */
const QUEUES = ROLES.map((role) => {
  const rights = ROLE_RIGHTS[role];
  const disposes = CAPABILITIES.filter((c) => rights.includes(c.requiredRight));
  const kinds = DOCUMENT_KINDS.filter((d) => d.proposes.some((p) => disposes.some((c) => c.name === p)));
  const declared = disposes.filter((c) => DECLARED.includes(c.name));
  const borne = disposes.filter((c) => !DECLARED.includes(c.name));
  return {
    role, disposes, kinds, declared, borne,
    /* Bulk-eligible: file-borne, and not requiring an internal-only right. */
    bulkable: borne.filter((c) => !INTERNAL_ONLY.includes(c.requiredRight)),
  };
});

/** Which roles a document kind can reach. The other end of the same join. */
const kindReaches = (kind) => ROLES.filter((role) =>
  kind.proposes.some((p) => {
    const c = CAPABILITIES.find((x) => x.name === p);
    return c && ROLE_RIGHTS[role].includes(c.requiredRight);
  }));

for (const d of DOCUMENT_KINDS) {
  if (d.proposes.length > 0 && kindReaches(d).length === 0) {
    die(`Document kind "${d.id}" proposes capabilities no role can dispose of. Its uploads would queue to nobody.`);
  }
}

/* The token sheet, read rather than restated. Refused if empty or if the
   custom properties this document actually paints with are missing — an
   unstyled matrix is worse than none, because it still looks authoritative. */
const TOKENS_PATH = path.join(ROOT, "dist", "tokens.css");
if (!fs.existsSync(TOKENS_PATH)) die("dist/tokens.css is missing. Run `npm run tokens` first.");
const TOKENS = fs.readFileSync(TOKENS_PATH, "utf8");
for (const need of ["--gc-void", "--gc-copper", "--gc-hairline-inv", "--gc-f-mono", "--gc-f-display", "--gc-steel-dim", "--gc-ink-inverse"]) {
  if (!TOKENS.includes(need)) die(`dist/tokens.css does not define ${need}. The document would render unstyled.`);
}

/* ── Optional live register read ──────────────────────────────────── */

async function readRegister() {
  if (!WANT_REGISTER) return { read: false };
  try {
    const envPath = path.join(ROOT, ".env.local");
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
    if (!process.env.DATABASE_URL) return { read: false, why: "DATABASE_URL is not set." };
    const postgres = require("postgres");
    const sql = postgres(process.env.DATABASE_URL, { prepare: false, ssl: "require", max: 1 });
    const identities = await sql`SELECT count(*)::int AS n FROM auth_user`;
    const grants = await sql`
      SELECT role, scope_kind, count(*)::int AS n
      FROM auth_office_grant WHERE revoked_at IS NULL GROUP BY role, scope_kind`;
    await sql.end();
    return { read: true, identities: identities[0].n, grants, at: new Date().toISOString() };
  } catch (e) {
    return { read: false, why: e.message };
  }
}

/* ── Render ───────────────────────────────────────────────────────── */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const roleLabel = (r) => r.replace(/_/g, " ");
const tick = (on) => on
  ? `<span class="bx on" title="held"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 6.4 4.4 9.2 10.5 2.8"/></svg><b class="sr">held</b></span>`
  : `<span class="bx" title="not held"><b class="sr">not held</b></span>`;

function matrixRows() {
  return DOMAINS.map((d) => {
    const head = `<tr class="band"><th colspan="${ROLES.length + 4}" scope="colgroup">
      <span class="micro">${esc(d.label)}</span><span class="band-note">${esc(d.note)}</span>
      <span class="band-count mono">${d.rights.length}</span></th></tr>`;
    const rows = d.rights.map((right) => {
      const h = holders(right);
      const caps = capsFor(right);
      const flags = [];
      if (INTERNAL_ONLY.includes(right)) flags.push(`<i class="fl int" title="Internal only — never grantable to a partner identity">INT</i>`);
      if (TRIAD_RIGHTS.has(right)) flags.push(`<i class="fl tri" title="Named in a GP-06 separation triad">SEP</i>`);
      if (caps.some((c) => c.requiresReason)) flags.push(`<i class="fl rsn" title="Invocation must carry a written reason (E-02)">RSN</i>`);
      if (caps.some((c) => c.conflictSensitive)) flags.push(`<i class="fl cnf" title="A known conflict must be disclosed first (I-07)">CNF</i>`);
      const scope = [...new Set(caps.map((c) => c.scopeKind))].join(" / ") || "—";
      return `<tr data-right="${esc(right)}" data-holders="${h.length}"
        data-internal="${INTERNAL_ONLY.includes(right)}" data-triad="${TRIAD_RIGHTS.has(right)}"
        class="${h.length === 0 ? "unheld" : ""}${h.length === 1 ? " sole" : ""}">
        <th scope="row"><code>${esc(right)}</code>${flags.join("")}</th>
        <td class="cnum mono">${h.length}</td>
        <td class="cscope micro">${esc(scope)}</td>
        ${ROLES.map((role) => `<td class="cell${ROLE_RIGHTS[role].includes(right) ? " y" : ""}" data-role="${esc(role)}">${tick(ROLE_RIGHTS[role].includes(right))}</td>`).join("")}
        <td class="ccap">${caps.length === 0
          ? `<span class="dim micro">no command</span>`
          : caps.map((c) => `<span class="cap-chip">${esc(c.name)}</span>`).join("")}</td>
      </tr>`;
    }).join("");
    return head + rows;
  }).join("");
}

function capabilityRows() {
  return CAPABILITIES.map((c) => {
    const h = holders(c.requiredRight);
    return `<tr data-cap="${esc(c.name)}" data-conflict="${c.conflictSensitive}" data-reason="${c.requiresReason}">
      <th scope="row"><strong>${esc(c.name)}</strong><span class="capdesc">${esc(c.description)}</span></th>
      <td><code class="rt">${esc(c.requiredRight)}</code></td>
      <td class="micro">${esc(c.scopeKind)}</td>
      <td class="ctr">${tick(c.requiresReason)}</td>
      <td class="ctr">${tick(c.conflictSensitive)}</td>
      ${ROLES.map((role) => `<td class="cell${h.includes(role) ? " y" : ""}" data-role="${esc(role)}">${tick(h.includes(role))}</td>`).join("")}
      <td class="cev">${c.emits.map((e) => `<span class="ev-chip">${esc(e)}</span>`).join("")}</td>
    </tr>`;
  }).join("");
}

const CONF_TONE = { VERIFIED: "vf", CORROBORATED: "cb", REPORTED: "rp", INFERRED: "inf", FORECAST: "fc", UNKNOWN: "unk" };

function intakeRows() {
  return DOCUMENT_KINDS.map((d) => {
    const reaches = kindReaches(d);
    return `<tr data-kind="${esc(d.id)}" data-ceiling="${esc(d.ceiling)}" data-citation="${esc(d.citation)}">
      <th scope="row"><strong>${esc(d.label)}</strong>
        <span class="capdesc">${esc(d.description)}</span>
        <span class="fmts">${d.formats.map((f) => `<span class="fmt">.${esc(f)}</span>`).join("")}</span></th>
      <td class="micro">${esc(d.citation)}</td>
      <td><span class="conf ${CONF_TONE[d.ceiling]}">${esc(d.ceiling)}</span>
        <span class="capdesc" style="max-width:340px">${esc(d.ceilingWhy)}</span></td>
      <td class="ccap">${d.proposes.length === 0
        ? `<span class="dim micro">reconciles only — proposes nothing</span>`
        : d.proposes.map((p) => `<span class="cap-chip">${esc(p)}</span>`).join("")}</td>
      <td class="ccap">${reaches.length === 0
        ? `<span class="dim micro">—</span>`
        : reaches.map((r) => `<span class="role-chip">${esc(roleLabel(r))}</span>`).join("")}</td>
    </tr>`;
  }).join("");
}

function queueCards() {
  return QUEUES.map((q) => `
    <article class="queue">
      <header class="queue-head">
        <div><span class="micro">Queue</span><h3>${esc(roleLabel(q.role))}</h3></div>
        <div class="queue-nums">
          <span><b class="mono">${q.disposes.length}</b><i class="micro">disposes</i></span>
          <span><b class="mono">${q.kinds.length}</b><i class="micro">file kinds</i></span>
          <span><b class="mono">${q.declared.length}</b><i class="micro">declared</i></span>
          <span><b class="mono">${q.bulkable.length}</b><i class="micro">bulk-eligible</i></span>
        </div>
      </header>
      <div class="queue-body">
        <div class="queue-col">
          <p class="micro dim">Arrives as a file</p>
          ${q.borne.length === 0 ? `<p class="dim" style="font-size:13px">Nothing. This queue is declaration-only.</p>`
            : q.borne.map((c) => `<span class="cap-chip${INTERNAL_ONLY.includes(c.requiredRight) ? " locked" : ""}"
                title="${INTERNAL_ONLY.includes(c.requiredRight) ? "Internal-only right — never bulk-approved" : "Bulk-eligible when disposed clear"}">${esc(c.name)}</span>`).join("")}
        </div>
        <div class="queue-col">
          <p class="micro dim">Declared, never proposed</p>
          ${q.declared.length === 0 ? `<p class="dim" style="font-size:13px">None.</p>`
            : q.declared.map((c) => `<span class="cap-chip act">${esc(c.name)}</span>`).join("")}
        </div>
        <div class="queue-col">
          <p class="micro dim">Fed by</p>
          ${q.kinds.length === 0 ? `<p class="dim" style="font-size:13px">No document kind reaches this queue.</p>`
            : q.kinds.map((k) => `<span class="kind-chip">${esc(k.label)}</span>`).join("")}
        </div>
      </div>
    </article>`).join("");
}

function separationBlocks() {
  return SEPARATION_TRIADS.map((triad, i) => `
    <article class="triad">
      <span class="micro">Triad ${String(i + 1).padStart(2, "0")}</span>
      <div class="triad-legs">
        ${triad.map((leg, k) => `
          <div class="leg">
            <code>${esc(leg)}</code>
            <p class="dim micro">${holders(leg).map(roleLabel).map(esc).join(", ") || "unheld"}</p>
          </div>
          ${k < triad.length - 1 ? `<span class="plus" aria-hidden="true">+</span>` : ""}`).join("")}
      </div>
      <p class="triad-say">No identity may hold all three. Holding any two is permitted and expected.</p>
    </article>`).join("");
}

const REGISTER_FIELDS = [
  ["grantId", "The handle every allowed decision cites. An action with no grant id cannot be explained later."],
  ["identityId", "Points at a real signed-in identity. A grant cannot be minted against an address that has never signed in."],
  ["role", "One of the eight. The role makes rights eligible; it is not itself the authority."],
  ["scope", "Enterprise, or one named vehicle. Vehicle scope is why a committee member of one LLP has no standing in another."],
  ["grantedBy", "Who issued it. A grant with no grantor cannot be audited (E-02)."],
  ["grantedAt", "When authority began. Actions before this timestamp were not covered by it."],
  ["expiresAt", "Optional. Absent means open-ended — which is a decision, not a default."],
  ["revokedAt", "Withdrawal is immediate. Actions already taken under the grant remain valid; that is the point of recording the id."],
];

const GATES = [
  ["01", "Authenticated?", "A null identity is refused before anything else is read. I-01 and I-02 are different failures and get different messages — “not signed in” and “signed in but may not” send an operator to two different places."],
  ["02", "Grant live?", "Revoked at or before now, or expired at or before now, and the grant is invisible. Time is passed in rather than read from the clock, so the same question can be asked about any past moment."],
  ["03", "Scope covers?", "Enterprise authority reaches into a vehicle. Vehicle authority never reaches out to the enterprise. That direction is E-07 expressed at the grant level."],
  ["04", "Role carries right?", "The last check, and the only one that can say yes. There is no default-allow branch to forget to close — the sole way to return allowed is to find a grant that carries the right."],
];

const MONITORS = [
  ["Every session is recorded", "Identity, opened, closed, and every command attempted. The record freezes when the session closes — I-04 makes it immutable rather than merely append-only."],
  ["Denied attempts are kept too", "A log of successes alone cannot answer “did somebody repeatedly try to do something they could not”, which is the question a security review actually asks."],
  ["Every capability publishes events", "E-01: a command that emits nothing is a silent state change. The registry refuses one, so the event stream is complete by construction rather than by diligence."],
  ["Reasons are structural", "Where a capability is marked RSN, the invocation carries a written reason or it does not run. Six months later the question is always “why did this change”."],
  ["Conflicts gate the call", "Where a capability is marked CNF, an undisclosed conflict stops it before the handler. Granting authority to a related party is the classic self-dealing route, so GrantAuthority itself is conflict-sensitive."],
  ["Expiry is surfaced, not awaited", "Grants inside their last thirty days are listed so authority lapses on purpose rather than by surprise."],
];

function page(register) {
  const stamp = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM · Operating Framework</title>
<style>
/* Design tokens inlined from dist/tokens.css at generation time.

   The sibling reference documents link to it, which works while the file
   sits in the repository beside dist/ and fails the moment anybody moves
   or sends it — unstyled, and unstyled in a way that looks like a bug in
   the document rather than a missing relative path. This one is meant to
   be opened by whoever is reviewing access, wherever they keep it, so it
   carries its own tokens. Regenerating re-reads them; they cannot drift. */
${TOKENS}
</style>
<style>
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}
html{background:var(--gc-void);scroll-behavior:smooth}
body{min-height:100vh;background:var(--gc-void);color:var(--gc-ink-inverse);font:400 15px/1.55 var(--gc-f-body);-webkit-font-smoothing:antialiased}
button,input{font:inherit}button,a{cursor:pointer}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--gc-electric);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.mono{font-family:var(--gc-f-mono);font-variant-numeric:tabular-nums}
.micro{font:400 11px/1.3 var(--gc-f-mono);letter-spacing:.13em;text-transform:uppercase}
.dim{color:var(--gc-steel-dim)}
code{font:500 12px/1.4 var(--gc-f-mono)}

.topbar{position:sticky;top:0;z-index:60;display:grid;grid-template-columns:minmax(240px,1fr) auto minmax(160px,1fr);align-items:stretch;min-height:76px;background:var(--gc-void);border-bottom:1px solid var(--gc-hairline-inv)}
.brand{display:flex;align-items:center;gap:14px;padding:0 28px;border-right:1px solid var(--gc-hairline-inv)}
.brand-mark{width:30px;height:30px;border:1px solid var(--gc-copper);display:grid;place-items:center;font:600 10px/1 var(--gc-f-mono);color:var(--gc-copper)}
.brand strong{display:block;font:600 15px/1 var(--gc-f-display);letter-spacing:-.01em}
.brand span{display:block;margin-top:5px;color:var(--gc-steel-dim)}
.tabs{display:flex;align-items:stretch;overflow:auto}
.tab{min-width:max-content;padding:0 18px;border:0;border-right:1px solid var(--gc-hairline-inv);background:transparent;color:var(--gc-steel-dim);font:500 11px/1 var(--gc-f-mono);letter-spacing:.09em;text-transform:uppercase}
.tab[aria-selected="true"]{background:var(--gc-paper);color:var(--gc-ink);box-shadow:inset 0 -3px 0 var(--gc-copper-deep)}
.status{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:0 28px;color:var(--gc-steel-dim)}
.status i{width:8px;height:8px;background:var(--gc-confirm);display:block}
.view{display:none}.view.active{display:block}
.wrap{width:min(1680px,100%);margin:0 auto;padding:56px 32px 104px}

.hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(300px,.6fr);gap:56px;align-items:end;padding-bottom:52px;border-bottom:1px solid var(--gc-hairline-inv)}
.eyebrow{color:var(--gc-copper);margin-bottom:18px}
h1{max-width:900px;font:600 clamp(38px,6vw,76px)/.92 var(--gc-f-display);letter-spacing:-.05em;text-wrap:balance}
.lede{max-width:760px;margin-top:24px;color:var(--gc-steel-dim);font-size:17px;line-height:1.6}
.coverage{border-top:1px solid var(--gc-hairline-inv)}
.metric{display:grid;grid-template-columns:84px 1fr;gap:18px;padding:15px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.metric strong{font:500 27px/1 var(--gc-f-mono);color:var(--gc-copper)}
.metric span{align-self:center;color:var(--gc-steel-dim);font-size:13px}

.section{padding:56px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.section-head{display:grid;grid-template-columns:170px minmax(0,1fr);gap:32px;margin-bottom:32px}
.section-head h2{font:600 clamp(26px,3.4vw,44px)/1 var(--gc-f-display);letter-spacing:-.04em}
.section-head p{max-width:720px;margin-top:12px;color:var(--gc-steel-dim);font-size:15px}

.law{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.law-cell{min-height:210px;padding:24px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.law-cell .num{color:var(--gc-copper);margin-bottom:42px}
.law-cell h3{font:600 19px/1.15 var(--gc-f-display);margin-bottom:10px}
.law-cell p{color:var(--gc-steel-dim);font-size:13px}

.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:20px;padding:14px 16px;border:1px solid var(--gc-hairline-inv)}
.controls input[type=search]{flex:1 1 240px;min-width:200px;padding:9px 12px;background:transparent;border:1px solid var(--gc-hairline-inv);color:var(--gc-ink-inverse);font:400 13px/1 var(--gc-f-mono)}
.chip{padding:8px 13px;border:1px solid var(--gc-hairline-inv);background:transparent;color:var(--gc-steel-dim);font:500 11px/1 var(--gc-f-mono);letter-spacing:.08em;text-transform:uppercase}
.chip[aria-pressed="true"]{border-color:var(--gc-copper);color:var(--gc-copper)}
.count-live{margin-left:auto;color:var(--gc-steel-dim)}

.tscroll{overflow:auto;border:1px solid var(--gc-hairline-inv)}
table{border-collapse:separate;border-spacing:0;width:100%;min-width:1180px}
thead th{position:sticky;top:0;z-index:20;background:var(--gc-void);border-bottom:1px solid var(--gc-hairline-inv);padding:14px 10px;text-align:center;vertical-align:bottom;font:500 11px/1.25 var(--gc-f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--gc-steel-dim)}
thead th.rolecol{cursor:pointer;min-width:74px;max-width:96px}
thead th.rolecol span{display:block;color:var(--gc-ink-inverse)}
thead th.rolecol b{display:block;margin-top:7px;color:var(--gc-copper);font:500 15px/1 var(--gc-f-mono)}
thead th.rolecol.iso{background:var(--gc-copper-deep);color:var(--gc-ink-inverse)}
thead th.lead{text-align:left;min-width:300px;left:0;z-index:30}
tbody th[scope=row]{position:sticky;left:0;z-index:10;background:var(--gc-void);text-align:left;padding:11px 12px;border-bottom:1px solid var(--gc-hairline-inv);font-weight:400}
tbody td{padding:9px 10px;border-bottom:1px solid var(--gc-hairline-inv);text-align:center;vertical-align:middle}
tbody tr:hover th[scope=row],tbody tr:hover td{background:var(--gc-graphite,#141414)}
tr.band th{position:sticky;left:0;background:var(--gc-copper-deep);color:var(--gc-ink-inverse);text-align:left;padding:11px 14px;border-bottom:1px solid var(--gc-hairline-inv);display:flex;gap:16px;align-items:baseline}
tr.band .band-note{color:rgba(255,255,255,.66);font-size:12px;font-weight:400;text-transform:none;letter-spacing:0}
tr.band .band-count{margin-left:auto}
tr.unheld th[scope=row]{box-shadow:inset 3px 0 0 var(--gc-caution,#c8862b)}
tr.sole th[scope=row]{box-shadow:inset 3px 0 0 var(--gc-copper)}

.bx{display:inline-grid;place-items:center;width:19px;height:19px;border:1px solid var(--gc-hairline-inv)}
.bx.on{border-color:var(--gc-copper);background:var(--gc-copper)}
.bx svg{width:12px;height:12px;fill:none;stroke:var(--gc-void);stroke-width:2.1;stroke-linecap:square}
td.cell.dimmed .bx{opacity:.16}
.fl{display:inline-block;margin-left:7px;padding:2px 5px;font:500 9px/1.2 var(--gc-f-mono);letter-spacing:.1em;font-style:normal;border:1px solid currentColor}
.fl.int{color:var(--gc-caution,#c8862b)}.fl.tri{color:var(--gc-alert,#c05046)}
.fl.rsn{color:var(--gc-steel-dim)}.fl.cnf{color:var(--gc-electric)}
.cap-chip,.ev-chip{display:inline-block;margin:2px 3px 2px 0;padding:3px 6px;border:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font:400 10px/1.3 var(--gc-f-mono)}
.ccap,.cev{text-align:left;min-width:230px}
.cnum{color:var(--gc-copper)}
.cscope{color:var(--gc-steel-dim)}
.capdesc{display:block;margin-top:5px;max-width:420px;color:var(--gc-steel-dim);font-size:12px;font-weight:400;line-height:1.45}
code.rt{color:var(--gc-copper)}
.ctr{text-align:center}

.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:0;margin-top:22px;border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.legend div{padding:14px 16px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.legend p{margin-top:6px;color:var(--gc-steel-dim);font-size:12px}

.triad{padding:26px;border:1px solid var(--gc-hairline-inv);margin-bottom:14px}
.triad .micro{color:var(--gc-copper)}
.triad-legs{display:flex;flex-wrap:wrap;align-items:stretch;gap:12px;margin:18px 0 14px}
.leg{flex:1 1 220px;padding:16px;border:1px solid var(--gc-hairline-inv)}
.leg code{color:var(--gc-ink-inverse);display:block;margin-bottom:8px}
.plus{display:grid;place-items:center;color:var(--gc-copper);font:500 20px/1 var(--gc-f-mono)}
.triad-say{color:var(--gc-steel-dim);font-size:13px}

.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));border-top:1px solid var(--gc-hairline-inv);border-left:1px solid var(--gc-hairline-inv)}
.card{padding:22px;border-right:1px solid var(--gc-hairline-inv);border-bottom:1px solid var(--gc-hairline-inv)}
.card h3{font:600 16px/1.2 var(--gc-f-display);margin-bottom:9px}
.card code{color:var(--gc-copper);display:block;margin-bottom:9px}
.card p{color:var(--gc-steel-dim);font-size:13px}

.envelope{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--gc-hairline-inv);margin-bottom:20px}
.env-step{padding:22px;border-right:1px solid var(--gc-hairline-inv);min-height:140px}
.env-step:last-child{border-right:0}
.env-step .micro{color:var(--gc-copper)}
.env-step strong{display:block;margin:16px 0 6px;font:600 16px/1.2 var(--gc-f-display)}
.env-step p{color:var(--gc-steel-dim);font-size:12px}

.note{padding:20px 22px;border:1px solid var(--gc-hairline-inv);border-left:3px solid var(--gc-copper);color:var(--gc-steel-dim);font-size:14px;max-width:900px}
.note strong{color:var(--gc-ink-inverse)}
.empty{padding:36px;border:1px dashed var(--gc-hairline-inv);text-align:center;color:var(--gc-steel-dim)}
.empty b{display:block;margin-bottom:10px;color:var(--gc-ink-inverse);font:600 20px/1.2 var(--gc-f-display)}
.foot{padding:34px 0;color:var(--gc-steel-dim);font-size:12px}

/* ── Framework, intake and queues ── */
.lawblock{padding:40px;border:1px solid var(--gc-copper);margin-bottom:40px}
.lawblock .micro{color:var(--gc-copper)}
.lawblock h2{margin:16px 0 18px;font:600 clamp(28px,4vw,52px)/1 var(--gc-f-display);letter-spacing:-.04em}
.lawblock p{max-width:820px;color:var(--gc-steel-dim);font-size:15px;margin-bottom:12px}
.lawblock p:last-child{margin-bottom:0}
.lawblock strong{color:var(--gc-ink-inverse)}

.beforeafter{display:grid;grid-template-columns:1fr 56px 1fr;align-items:stretch;margin-bottom:40px}
.ba{padding:28px;border:1px solid var(--gc-hairline-inv)}
.ba.now{border-color:var(--gc-copper)}
.ba .micro{color:var(--gc-steel-dim);margin-bottom:16px;display:block}
.ba.now .micro{color:var(--gc-copper)}
.ba h3{font:600 21px/1.15 var(--gc-f-display);margin-bottom:14px}
.ba li{list-style:none;padding:9px 0 9px 20px;position:relative;color:var(--gc-steel-dim);font-size:13px;border-bottom:1px solid var(--gc-hairline-inv)}
.ba li:last-child{border-bottom:0}
.ba li:before{content:"—";position:absolute;left:0;color:var(--gc-steel-dim)}
.ba.now li:before{content:"→";color:var(--gc-copper)}
.ba-arrow{display:grid;place-items:center;color:var(--gc-copper);font:500 24px/1 var(--gc-f-mono)}

.stages{display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--gc-hairline-inv)}
.stage{padding:22px 18px;border-right:1px solid var(--gc-hairline-inv);min-height:270px;display:flex;flex-direction:column}
.stage:last-child{border-right:0}
.stage .micro{color:var(--gc-copper)}
.stage strong{display:block;margin:14px 0 4px;font:600 17px/1.2 var(--gc-f-display)}
.stage .who{display:inline-block;margin-bottom:12px;padding:2px 6px;border:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font:400 9px/1.4 var(--gc-f-mono);letter-spacing:.1em;text-transform:uppercase}
.stage .who.human{border-color:var(--gc-copper);color:var(--gc-copper)}
.stage p{color:var(--gc-steel-dim);font-size:12px;margin-bottom:12px}
.stage .no{margin-top:auto;padding-top:12px;border-top:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font-size:11.5px;font-style:italic}

.conf{display:inline-block;padding:3px 7px;font:500 10px/1.3 var(--gc-f-mono);letter-spacing:.09em;border:1px solid currentColor}
.conf.vf{color:var(--gc-confirm)}.conf.cb{color:var(--gc-electric)}
.conf.rp{color:var(--gc-caution,#c8862b)}.conf.inf,.conf.fc,.conf.unk{color:var(--gc-steel-dim)}
.fmts{display:block;margin-top:7px}
.fmt{display:inline-block;margin-right:4px;padding:2px 5px;border:1px solid var(--gc-hairline-inv);color:var(--gc-steel-dim);font:400 9.5px/1.3 var(--gc-f-mono)}
.role-chip{display:inline-block;margin:2px 3px 2px 0;padding:3px 7px;border:1px solid var(--gc-copper);color:var(--gc-copper);font:400 10px/1.3 var(--gc-f-mono)}
.kind-chip{display:inline-block;margin:2px 3px 2px 0;padding:3px 7px;border:1px solid var(--gc-hairline-inv);color:var(--gc-ink-inverse);font:400 10px/1.3 var(--gc-f-mono)}
.cap-chip.locked{border-color:var(--gc-caution,#c8862b);color:var(--gc-caution,#c8862b)}
.cap-chip.act{border-color:var(--gc-alert,#c05046);color:var(--gc-alert,#c05046)}

.queue{border:1px solid var(--gc-hairline-inv);margin-bottom:14px}
.queue-head{display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--gc-hairline-inv);background:var(--gc-graphite,#141414)}
.queue-head .micro{color:var(--gc-copper)}
.queue-head h3{margin-top:5px;font:600 22px/1 var(--gc-f-display);text-transform:capitalize}
.queue-nums{display:flex;gap:26px}
.queue-nums span{text-align:right}
.queue-nums b{display:block;font-size:22px;color:var(--gc-copper)}
.queue-nums i{color:var(--gc-steel-dim);font-style:normal}
.queue-body{display:grid;grid-template-columns:1.4fr 1fr 1fr}
.queue-col{padding:20px 24px;border-right:1px solid var(--gc-hairline-inv)}
.queue-col:last-child{border-right:0}
.queue-col .micro{display:block;margin-bottom:12px}

.trigger{display:grid;grid-template-columns:78px 1fr;gap:20px;padding:18px 0;border-bottom:1px solid var(--gc-hairline-inv)}
.trigger .micro{color:var(--gc-copper)}
.trigger strong{display:block;font:500 15px/1.4 var(--gc-f-body);margin-bottom:6px}
.trigger p{color:var(--gc-steel-dim);font-size:13px}

@media (max-width:900px){
  .hero{grid-template-columns:1fr;gap:34px}
  .section-head{grid-template-columns:1fr;gap:12px}
  .law,.envelope,.stages,.queue-body{grid-template-columns:1fr}
  .beforeafter{grid-template-columns:1fr}
  .ba-arrow{padding:14px 0;transform:rotate(90deg)}
  .queue-nums{gap:16px}
  .lawblock{padding:24px}
  .wrap{padding:36px 18px 72px}
  .topbar{grid-template-columns:1fr;min-height:0}
  .brand{border-right:0;border-bottom:1px solid var(--gc-hairline-inv)}
  .status{display:none}
}
@media print{
  html,body{background:#fff;color:#111}
  .topbar,.controls{display:none}
  .view{display:block!important}
  .tscroll{overflow:visible}
  table{min-width:0;font-size:10px}
}
</style>
</head>
<body>

<header class="topbar">
  <div class="brand">
    <span class="brand-mark">GC</span>
    <span><strong>Operating Framework</strong><span class="micro">Generated ${esc(stamp)}</span></span>
  </div>
  <nav class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true" data-view="framework">Framework</button>
    <button class="tab" role="tab" aria-selected="false" data-view="intake">Intake</button>
    <button class="tab" role="tab" aria-selected="false" data-view="queues">Role queues</button>
    <button class="tab" role="tab" aria-selected="false" data-view="matrix">Rights matrix</button>
    <button class="tab" role="tab" aria-selected="false" data-view="caps">Capabilities</button>
    <button class="tab" role="tab" aria-selected="false" data-view="sep">Separation</button>
    <button class="tab" role="tab" aria-selected="false" data-view="control">Control &amp; monitoring</button>
    <button class="tab" role="tab" aria-selected="false" data-view="reg">Register</button>
  </nav>
  <div class="status"><i></i><span class="micro">Read from source</span></div>
</header>

<!-- ═══ FRAMEWORK ════════════════════════════════════════════════ -->
<section class="view active" id="v-framework">
<div class="wrap">
  <div class="hero">
    <div>
      <p class="eyebrow micro">The operating model</p>
      <h1>The file is the record.<br>The field is derived.</h1>
      <p class="lede">Nothing in this system is keyed in. Every figure traces to a cell, a row or a page region
        in a document somebody deposited — and to correct a figure you deposit a corrected document rather than
        edit a field, because editing a field severs it from its source and there is no way to sever it back.</p>
      <p class="lede">The intelligence classifies, extracts, reconciles and proposes. It never approves.
        <code>Disposition</code> has no <code>approve</code> member, so that is a property of the type rather than
        a rule somebody remembers to check.</p>
    </div>
    <div class="coverage">
      <div class="metric"><strong>${DOCUMENT_KINDS.length}</strong><span>document kinds replace the forms</span></div>
      <div class="metric"><strong>${FILE_BORNE.length}</strong><span>capabilities reached by depositing a file</span></div>
      <div class="metric"><strong>${DECLARED.length}</strong><span>declared acts no file may propose</span></div>
      <div class="metric"><strong>${ROLES.length}</strong><span>queues — the whole operating surface</span></div>
      <div class="metric"><strong>0</strong><span>capabilities unreachable or ambiguous</span></div>
    </div>
  </div>

  <div class="section">
    <div class="lawblock">
      <p class="micro">The defect this replaces</p>
      <h2>A figure whose source is somebody's memory.</h2>
      <p>Thirty-five capabilities, each with arguments, reached through forms. Somebody opens the vehicle screen
        and keys in forty-seven fields off a workbook sitting open beside them. Every one of those fields is a
        transcription, and a transcription has no source — six months later the figure is in the system and the
        only answer to <strong>“where did this come from”</strong> is a person's recollection of a spreadsheet.</p>
      <p>That is the same defect FIX-10 names for agents — the invisible action, acted on, leaving no record of
        what produced it — committed by a human with a keyboard. It is the one kind of figure this platform
        cannot let a partner assess, and it is the failure mode a fractional-ownership record can least afford.</p>
    </div>

    <div class="beforeafter">
      <div class="ba">
        <span class="micro">Keying</span>
        <h3>What it looked like</h3>
        <ul>
          <li>Navigate to the capability, then fill its arguments</li>
          <li>${CAPABILITIES.length} commands, each its own form</li>
          <li>Provenance is whatever the typist remembers</li>
          <li>Two sources disagreeing is resolved silently, by whoever typed last</li>
          <li>Correcting a figure overwrites it, and the prior basis is gone</li>
          <li>Bulk work means repeating the same click forty times</li>
        </ul>
      </div>
      <div class="ba-arrow" aria-hidden="true">→</div>
      <div class="ba now">
        <span class="micro">Depositing</span>
        <h3>What it looks like</h3>
        <ul>
          <li>Drop the file. It routes itself</li>
          <li>${DOCUMENT_KINDS.length} document kinds, each declaring what it may yield</li>
          <li>Every value cites a cell, row or page region</li>
          <li>Disagreement raises a conflict showing both sources, and waits</li>
          <li>A correction is a new deposit; the prior basis remains retrievable</li>
          <li>Clear proposals dispose as one batch, under one recorded reason</li>
        </ul>
      </div>
    </div>

    <div class="section-head">
      <p class="eyebrow micro">Six stages</p>
      <div><h2>Deposit to disposal.</h2>
        <p>What each stage does matters less than what it refuses. The refusals are where a document-led system
          either keeps its provenance or quietly becomes a faster way to produce unsourced figures.</p></div>
    </div>
    <div class="stages">
      ${PIPELINE.map((s) => `<div class="stage">
        <p class="micro">${esc(s.n)}</p><strong>${esc(s.name)}</strong>
        <span class="who${s.actor === "grant-holder" || s.actor === "depositor" ? " human" : ""}">${esc(s.actor.replace("-", " "))}</span>
        <p>${esc(s.does)}</p>
        <p class="no">${esc(s.refuses)}</p>
      </div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head">
      <p class="eyebrow micro">Two lanes, and only two</p>
      <div><h2>Evidenced, or decided.</h2>
        <p>A file-borne capability is <em>evidenced</em> — a document exists saying the thing happened, and the
          system's job is to read it faithfully. A declared act is <em>decided</em>: no document precedes it,
          because the decision is the event. Asking an agent to propose one would be asking it to author the
          judgement the grant exists to place with a person.</p></div>
    </div>
    <div class="cards">
      ${DECLARED_ACTS.map((a) => {
        const cap = CAPABILITIES.find((c) => c.name === a.command);
        const who = cap ? holders(cap.requiredRight).map(roleLabel).join(", ") : "—";
        return `<div class="card">
          <h3>${esc(a.command)}</h3>
          <code>${esc(who || "unheld")}</code>
          <p>${esc(a.why)}</p>
          <p style="margin-top:10px;padding-top:10px;border-top:1px solid var(--gc-hairline-inv)">
            <span class="micro" style="color:var(--gc-copper)">Intelligence may</span><br>${esc(a.aiMay)}</p>
        </div>`;
      }).join("")}
    </div>
  </div>

  <div class="section" style="border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">${ESCALATION_TRIGGERS.length} triggers</p>
      <div><h2>When a proposal stops being a proposal.</h2>
        <p>Each is a case where proceeding on the balance of probabilities would be cheaper and wrong.
          They are listed rather than inferred, because a list is the only form you can audit for what is missing.</p></div>
    </div>
    ${ESCALATION_TRIGGERS.map((t) => `<div class="trigger">
      <p class="micro">${esc(t.id)}</p>
      <div><strong>${esc(t.when)}</strong><p>${esc(t.because)}</p></div>
    </div>`).join("")}

    <div class="section-head" style="margin-top:52px">
      <p class="eyebrow micro">Bulk disposal</p>
      <div><h2>Where this could become a rubber stamp.</h2>
        <p>Batching is the entire point — a workbook yielding forty proposals that each need a separate click has
          saved nobody anything. It is also the mechanism most likely to hollow out. The conditions are narrow,
          and stated here so they can be argued with.</p></div>
    </div>
    <div class="cards">
      ${BULK_RULES.map((b, i) => `<div class="card">
        <p class="micro" style="color:var(--gc-copper);margin-bottom:12px">Rule ${String(i + 1).padStart(2, "0")}</p>
        <h3 style="font-size:15px;line-height:1.35">${esc(b.rule)}</h3><p>${esc(b.why)}</p></div>`).join("")}
    </div>
  </div>
</div>
</section>

<!-- ═══ INTAKE ═══════════════════════════════════════════════════ -->
<section class="view" id="v-intake">
<div class="wrap">
  <div class="section" style="padding-top:0;border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">${DOCUMENT_KINDS.length} kinds</p>
      <div><h2>What may be deposited, and what it may claim.</h2>
        <p>A document kind caps how strongly anything extracted from it can be asserted. A sponsor's own workbook
          cannot yield a VERIFIED figure however cleanly it parses — cleanliness is not corroboration. Registered
          title can. The ceiling travels with the assertion, and <code>weakest()</code> does the rest, so a derived
          figure resting on one workbook cell can never present as stronger than that cell.</p></div>
    </div>

    <div class="controls">
      <input type="search" id="iq" placeholder="Filter kinds, formats or capabilities…" aria-label="Filter document kinds">
      <button class="chip" data-ifilter="verified" aria-pressed="false">Reaches verified</button>
      <button class="chip" data-ifilter="cell" aria-pressed="false">Cell-level citation</button>
      <button class="chip" id="ireset">Reset</button>
      <span class="count-live micro" id="icount"></span>
    </div>

    <div class="tscroll">
      <table id="intake">
        <thead><tr>
          <th class="lead" scope="col">Document kind</th>
          <th scope="col">Cites at</th>
          <th scope="col" style="text-align:left;min-width:280px">Confidence ceiling</th>
          <th scope="col" style="text-align:left">Proposes</th>
          <th scope="col" style="text-align:left">Reaches</th>
        </tr></thead>
        <tbody>${intakeRows()}</tbody>
      </table>
    </div>

    <div class="note" style="margin-top:26px">
      <p><strong>One kind proposes nothing at all.</strong> The bank and capital account statement is deposited for
        reconciliation only: it evidences that money moved, which is precisely the opposite of authorising it.
        Every unmatched movement it finds — in both directions — becomes an escalation rather than a proposal.</p>
    </div>
  </div>
</div>
</section>

<!-- ═══ QUEUES ═══════════════════════════════════════════════════ -->
<section class="view" id="v-queues">
<div class="wrap">
  <div class="section" style="padding-top:0;border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">${ROLES.length} queues</p>
      <div><h2>The whole operating surface.</h2>
        <p>Nobody navigates to a capability. Work arrives, already addressed. A role's queue is exactly the
          capabilities its rights carry — derived, not assigned, which means it cannot drift from the authority
          model because it <em>is</em> the authority model read from the other end. There is no routing table
          for anybody to maintain or get wrong.</p></div>
    </div>
    ${queueCards()}

    <div class="note" style="margin-top:26px">
      <p><strong>Read the colours:</strong> a plain chip is bulk-eligible once disposed clear.
        <span class="cap-chip locked" style="margin:0 2px">Amber</span> requires an internal-only right and is
        disposed one at a time, always.
        <span class="cap-chip act" style="margin:0 2px">Red</span> is a declared act — it never appears as a
        proposal at all, and reaches the queue only because a person went looking for it.</p>
    </div>
  </div>
</div>
</section>

<!-- ═══ MATRIX ═══════════════════════════════════════════════════ -->
<section class="view" id="v-matrix">
<div class="wrap">
  <div class="hero">
    <div>
      <p class="eyebrow micro">Constitutional access control · I-02</p>
      <h1>Every yes is a grant.</h1>
      <p class="lede">A role does not give anybody authority. It makes a set of rights <em>eligible</em>, and
        authority exists only where a named, scoped, expiring, reasoned grant points a real identity at one of
        these bundles. Absence of a grant is a denial, not a question to resolve later.</p>
      <p class="lede">Every tick below is read out of <code>lib/authority.ts</code> and <code>lib/commands.ts</code>
        at generation time. Nothing on this page was typed by hand.</p>
    </div>
    <div class="coverage">
      <div class="metric"><strong>${ALL_RIGHTS.length}</strong><span>rights across ${DOMAINS.length} domains</span></div>
      <div class="metric"><strong>${ROLES.length}</strong><span>roles — the only grantable bundles</span></div>
      <div class="metric"><strong>${CAPABILITIES.length}</strong><span>capabilities; the sole way state changes</span></div>
      <div class="metric"><strong>${INTERNAL_ONLY.length}</strong><span>rights no partner identity may ever hold</span></div>
      <div class="metric"><strong>${violations.length}</strong><span>roles breaching separation of powers</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-head">
      <p class="eyebrow micro">The four conditions</p>
      <div><h2>What has to be true for an action to run.</h2>
        <p>These are evaluated in order, before the handler. All four, every time — there is no
          default-allow branch anywhere in the module, so the only way to reach a yes is to find a grant.</p></div>
    </div>
    <div class="law">
      ${GATES.map(([n, t, p]) => `<div class="law-cell"><p class="num micro">${n}</p><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head">
      <p class="eyebrow micro">${ALL_RIGHTS.length} × ${ROLES.length}</p>
      <div><h2>The matrix.</h2>
        <p>A tick means the role carries the right. It does <em>not</em> mean anybody holds it —
          that requires a live grant, which the Register tab reports. Click a role heading to isolate its column.</p></div>
    </div>

    <div class="controls">
      <input type="search" id="q" placeholder="Filter rights, roles or commands…" aria-label="Filter rights">
      <button class="chip" data-filter="internal" aria-pressed="false">Internal only</button>
      <button class="chip" data-filter="triad" aria-pressed="false">In a triad</button>
      <button class="chip" data-filter="sole" aria-pressed="false">Single holder</button>
      <button class="chip" data-filter="unheld" aria-pressed="false">Held by nobody</button>
      <button class="chip" id="reset">Reset</button>
      <span class="count-live micro" id="count"></span>
    </div>

    <div class="tscroll">
      <table id="matrix">
        <thead><tr>
          <th class="lead" scope="col">Right</th>
          <th scope="col">Roles</th>
          <th scope="col">Scope</th>
          ${ROLES.map((r) => `<th class="rolecol" scope="col" data-role="${esc(r)}" title="Click to isolate"><span>${esc(roleLabel(r))}</span><b>${ROLE_RIGHTS[r].length}</b></th>`).join("")}
          <th scope="col" style="text-align:left">Invoked by</th>
        </tr></thead>
        <tbody>${matrixRows()}</tbody>
      </table>
    </div>

    <div class="legend">
      <div><span class="fl int">INT</span><p>Internal only. Refused to any partner-firm identity — the firm is capacity, never authority.</p></div>
      <div><span class="fl tri">SEP</span><p>Named in a separation triad. Held freely on its own; refused in the wrong company.</p></div>
      <div><span class="fl rsn">RSN</span><p>A written reason travels with the invocation, or it does not run.</p></div>
      <div><span class="fl cnf">CNF</span><p>Conflict-sensitive. An undisclosed conflict stops the call before the handler.</p></div>
      <div><span class="bx on"><svg viewBox="0 0 12 12"><path d="M1.5 6.4 4.4 9.2 10.5 2.8"/></svg></span><p>Role carries the right.</p></div>
      <div><span class="bx"></span><p>Role does not carry it. Nothing infers it later.</p></div>
    </div>

    ${UNHELD.length || SOLE.length || RIGHTS_WITHOUT_CAPABILITY.length ? `
    <div class="note" style="margin-top:26px">
      ${UNHELD.length ? `<p><strong>${UNHELD.length} right${UNHELD.length === 1 ? " is" : "s are"} carried by no role:</strong>
        ${UNHELD.map((r) => `<code>${esc(r)}</code>`).join(", ")}. Nobody can invoke the commands behind
        ${UNHELD.length === 1 ? "it" : "them"} until a role does.</p>` : ""}
      ${SOLE.length ? `<p style="margin-top:10px"><strong>${SOLE.length} rights sit with exactly one role.</strong>
        These are the concentration points — if that role's grants lapse, the capability stops.</p>` : ""}
      ${RIGHTS_WITHOUT_CAPABILITY.length ? `<p style="margin-top:10px"><strong>${RIGHTS_WITHOUT_CAPABILITY.length} right${RIGHTS_WITHOUT_CAPABILITY.length === 1 ? "" : "s"} no command asks for:</strong>
        ${RIGHTS_WITHOUT_CAPABILITY.map((r) => `<code>${esc(r)}</code>`).join(", ")}. Grantable, but nothing invokes
        ${RIGHTS_WITHOUT_CAPABILITY.length === 1 ? "it" : "them"} yet.</p>` : ""}
    </div>` : ""}
  </div>
</div>
</section>

<!-- ═══ CAPABILITIES ═════════════════════════════════════════════ -->
<section class="view" id="v-caps">
<div class="wrap">
  <div class="section" style="padding-top:0;border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">${CAPABILITIES.length} commands</p>
      <div><h2>What can actually be done, and by whom.</h2>
        <p>A command is the only way state changes. Each one declares — in data, not in a handler body — the right
          it needs, the scope it is evaluated in, the events it publishes, whether a reason is compulsory and
          whether a conflict must be disclosed first. Because they are data, a linter can refuse a command
          that emits nothing or names a right that does not exist.</p></div>
    </div>

    <div class="controls">
      <input type="search" id="cq" placeholder="Filter commands, rights or events…" aria-label="Filter capabilities">
      <button class="chip" data-cfilter="reason" aria-pressed="false">Reason required</button>
      <button class="chip" data-cfilter="conflict" aria-pressed="false">Conflict-sensitive</button>
      <button class="chip" id="creset">Reset</button>
      <span class="count-live micro" id="ccount"></span>
    </div>

    <div class="tscroll">
      <table id="caps">
        <thead><tr>
          <th class="lead" scope="col">Command</th>
          <th scope="col">Requires</th>
          <th scope="col">Scope</th>
          <th scope="col">Reason</th>
          <th scope="col">Conflict</th>
          ${ROLES.map((r) => `<th class="rolecol" scope="col" data-role="${esc(r)}"><span>${esc(roleLabel(r))}</span><b>${CAPABILITIES.filter((c) => ROLE_RIGHTS[r].includes(c.requiredRight)).length}</b></th>`).join("")}
          <th scope="col" style="text-align:left">Publishes</th>
        </tr></thead>
        <tbody>${capabilityRows()}</tbody>
      </table>
    </div>
  </div>
</div>
</section>

<!-- ═══ SEPARATION ═══════════════════════════════════════════════ -->
<section class="view" id="v-sep">
<div class="wrap">
  <div class="section" style="padding-top:0">
    <div class="section-head">
      <p class="eyebrow micro">GP-06 · Separation of powers</p>
      <div><h2>The combinations that are refused.</h2>
        <p>Investment approval, financial execution and governance review never sit in one pair of hands.
          This is enforced as a property of the role table rather than trusted to review, so a future edit
          that merges two roles fails the build rather than passing quietly.</p></div>
    </div>
    ${separationBlocks()}

    <div class="note" style="margin-top:26px">
      <p><strong>No single role breaches either triad</strong> — checked at generation time, and
        ${violations.length === 0 ? "the check came back empty" : `<span style="color:var(--gc-alert,#c05046)">${violations.length} breach(es) found</span>`}.
        The constraint bites when one identity accumulates several grants, so it is the <em>union</em> of
        rights that is tested, not any single grant.</p>
    </div>

    <div class="section-head" style="margin-top:52px">
      <p class="eyebrow micro">Every subset tested</p>
      <div><h2>${refusedSets.length === 0 ? "No combination is refused." : `${refusedSets.length} minimal refused combination${refusedSets.length === 1 ? "" : "s"}.`}</h2>
        <p>All ${(1 << ROLES.length) - 1} non-empty role sets were evaluated. Listed below are the smallest sets that
          complete a triad — any larger set containing one is refused for the same reason and adds nothing.</p></div>
    </div>
    <div class="cards">
      ${refusedSets.length === 0
        ? `<div class="card"><h3>None</h3><p>No combination of these roles completes a triad.</p></div>`
        : refusedSets.map((r) => `<div class="card">
            <h3>${r.set.map(roleLabel).map(esc).join(" + ")}</h3>
            <code>${r.triad.map(esc).join(" + ")}</code>
            <p>Together these grants would put investment approval, financial execution and governance review
               in one pair of hands. Refused at request time, before the grant is written.</p></div>`).join("")}
    </div>

    <div class="note" style="margin-top:26px">
      <p><strong>The largest lawful set is ${maximalLawful.length} of ${ROLES.length} roles:</strong>
        ${maximalLawful.map(roleLabel).map(esc).join(", ")}. Lawful is not the same as advisable — the audit
        question is never “who is here today”, it is “who could have done this on the day it happened”.
        Start narrow; widening later is one command, narrowing after a year of activity is an argument.</p>
    </div>

    <div class="section-head" style="margin-top:52px">
      <p class="eyebrow micro">Concentration</p>
      <div><h2>Where authority has nowhere else to go.</h2>
        <p>Rights carried by exactly one role. Not defects — several are correct — but each is a single point
          of failure for the capability behind it.</p></div>
    </div>
    <div class="cards">
      ${SOLE.map((r) => `<div class="card"><h3>${esc(roleLabel(holders(r)[0]))}</h3><code>${esc(r)}</code>
        <p>${capsFor(r).length ? esc(capsFor(r).map((c) => c.name).join(", ")) : "No command requires this yet."}</p></div>`).join("")}
    </div>
  </div>
</div>
</section>

<!-- ═══ CONTROL & MONITORING ═════════════════════════════════════ -->
<section class="view" id="v-control">
<div class="wrap">
  <div class="section" style="padding-top:0">
    <div class="section-head">
      <p class="eyebrow micro">The envelope</p>
      <div><h2>One order, always.</h2>
        <p>Authority is evaluated before the handler, so a handler never runs for somebody who may not invoke it.
          Events are published after, so no event ever claims a change that did not happen. Both orderings carry weight.</p></div>
    </div>
    <div class="envelope">
      ${[["01", "Authenticate", "Identify the actor, or stop. An unidentified actor takes no action."],
         ["02", "Authorise", "Find a live, in-scope grant whose role carries the right — or deny with the reason."],
         ["03", "Conflict gate", "Where the capability is conflict-sensitive, an undisclosed interest stops it here."],
         ["04", "Handler", "The state change itself. It runs only once the three checks above have passed."],
         ["05", "Publish", "Events emit last. A capability that emits nothing is refused by the registry."]]
        .map(([n, t, p]) => `<div class="env-step"><p class="micro">${n}</p><strong>${esc(t)}</strong><p>${esc(p)}</p></div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head">
      <p class="eyebrow micro">What a grant records</p>
      <div><h2>Eight fields, and why each is there.</h2>
        <p>A grant is not a flag on an identity. It is a record with a grantor, a start, and an end —
          which is what makes “who could do this, on that date, and who said so” answerable.</p></div>
    </div>
    <div class="cards">
      ${REGISTER_FIELDS.map(([f, why]) => `<div class="card"><code>${esc(f)}</code><p>${esc(why)}</p></div>`).join("")}
    </div>
  </div>

  <div class="section" style="border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">Monitoring</p>
      <div><h2>How this is watched, not just declared.</h2>
        <p>Access control that is only declared is decoration. These are the mechanisms that make a breach
          visible after the fact, and several of them make it visible before.</p></div>
    </div>
    <div class="cards">
      ${MONITORS.map(([t, p]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join("")}
    </div>
  </div>
</div>
</section>

<!-- ═══ REGISTER ═════════════════════════════════════════════════ -->
<section class="view" id="v-reg">
<div class="wrap">
  <div class="section" style="padding-top:0;border-bottom:0">
    <div class="section-head">
      <p class="eyebrow micro">Live register</p>
      <div><h2>Who actually holds anything.</h2>
        <p>Everything on the other four tabs describes what the system permits. This is the only tab that
          reports what is true right now — and it is read from the grant tables, not from the code.</p></div>
    </div>

    ${!register.read ? `
      <div class="empty">
        <b>The register was not read in this build.</b>
        <p>Re-run with <code>node scripts/gen-authority-matrix.js --register</code> to query the grant tables.
          ${register.why ? `<br><span class="micro">Last attempt: ${esc(register.why)}</span>` : ""}</p>
      </div>` : register.identities === 0 ? `
      <div class="empty">
        <b>No identity exists yet.</b>
        <p>Zero rows in <code>auth_user</code>, therefore zero grants. This is the correct empty state, not a fault:
          a grant points at an identity, and one is created the first time somebody signs in.<br>
          <span class="micro">Read ${esc(register.at)}</span></p>
      </div>` : `
      <div class="cards">
        <div class="card"><h3>Identities</h3><code class="mono" style="font-size:28px">${register.identities}</code>
          <p>Rows in <code>auth_user</code>. Each can be pointed at by any number of grants.</p></div>
        ${register.grants.length === 0
          ? `<div class="card"><h3>Grants</h3><code class="mono" style="font-size:28px">0</code>
              <p>Identities exist but hold no authority. Every private surface is closed.</p></div>`
          : register.grants.map((g) => `<div class="card"><h3>${esc(roleLabel(g.role))}</h3>
              <code class="mono" style="font-size:28px">${g.n}</code>
              <p>live grant${g.n === 1 ? "" : "s"} at ${esc(g.scope_kind)} scope, carrying
                 ${ROLE_RIGHTS[g.role] ? ROLE_RIGHTS[g.role].length : "?"} rights.</p></div>`).join("")}
      </div>
      <p class="micro dim" style="margin-top:18px">Read ${esc(register.at)}</p>`}

    <div class="note" style="margin-top:30px">
      <p><strong>Read it yourself at any time:</strong> <code>npm run grant list</code> reports every live grant with
        its role, scope and expiry. <code>npm run grant add &lt;email&gt; &lt;role&gt; --reason "…"</code> mints one, and
        refuses if the address has never signed in or if the resulting rights would complete a triad.</p>
    </div>
  </div>

  <p class="foot">Generated ${esc(stamp)} from <code>lib/authority.ts</code>, <code>lib/commands.ts</code> and
    <code>lib/access-admin.ts</code>. Regenerate rather than edit — this file is output.</p>
</div>
</section>

<script>
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function(t){t.addEventListener('click',function(){
    tabs.forEach(function(x){x.setAttribute('aria-selected', String(x===t));});
    document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
    document.getElementById('v-'+t.dataset.view).classList.add('active');
    window.scrollTo(0,0);
  });});

  /* Column isolation: dim every other role so one column reads cleanly.
     Dimming rather than hiding keeps the row's shape — the point of
     isolating a column is usually to compare it against the rest. */
  function wireIsolate(table){
    var heads=[].slice.call(table.querySelectorAll('th.rolecol'));
    heads.forEach(function(h){h.addEventListener('click',function(){
      var on=!h.classList.contains('iso');
      heads.forEach(function(x){x.classList.remove('iso');});
      if(on)h.classList.add('iso');
      table.querySelectorAll('td.cell').forEach(function(c){
        c.classList.toggle('dimmed', on && c.dataset.role!==h.dataset.role);
      });
    });});
  }
  ['matrix','caps'].forEach(function(id){var t=document.getElementById(id); if(t)wireIsolate(t);});

  function filterTable(table,input,chips,counter,noun){
    var rows=[].slice.call(table.querySelectorAll('tbody tr:not(.band)'));
    var bands=[].slice.call(table.querySelectorAll('tbody tr.band'));
    function run(){
      var q=(input.value||'').toLowerCase().trim();
      var active=chips.filter(function(c){return c.getAttribute('aria-pressed')==='true';})
                      .map(function(c){return c.dataset.filter||c.dataset.cfilter||c.dataset.ifilter;});
      var shown=0;
      rows.forEach(function(r){
        var ok=!q||r.textContent.toLowerCase().indexOf(q)>-1;
        active.forEach(function(f){
          if(f==='internal')ok=ok&&r.dataset.internal==='true';
          if(f==='triad')ok=ok&&r.dataset.triad==='true';
          if(f==='sole')ok=ok&&r.dataset.holders==='1';
          if(f==='unheld')ok=ok&&r.dataset.holders==='0';
          if(f==='reason')ok=ok&&r.dataset.reason==='true';
          if(f==='conflict')ok=ok&&r.dataset.conflict==='true';
          if(f==='verified')ok=ok&&r.dataset.ceiling==='VERIFIED';
          if(f==='cell')ok=ok&&r.dataset.citation==='cell';
        });
        r.style.display=ok?'':'none';
        if(ok)shown++;
      });
      /* Hide a band whose rows have all been filtered away, so the reader
         never sees a domain heading over nothing. */
      bands.forEach(function(b){
        var n=0,x=b.nextElementSibling;
        while(x&&!x.classList.contains('band')){if(x.style.display!=='none')n++;x=x.nextElementSibling;}
        b.style.display=n?'':'none';
      });
      counter.textContent=shown+' of '+rows.length+' '+noun;
    }
    input.addEventListener('input',run);
    chips.forEach(function(c){c.addEventListener('click',function(){
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed')!=='true'));run();
    });});
    return run;
  }

  var runM=filterTable(document.getElementById('matrix'),document.getElementById('q'),
    [].slice.call(document.querySelectorAll('[data-filter]')),document.getElementById('count'),'rights');
  var runC=filterTable(document.getElementById('caps'),document.getElementById('cq'),
    [].slice.call(document.querySelectorAll('[data-cfilter]')),document.getElementById('ccount'),'commands');
  var runI=filterTable(document.getElementById('intake'),document.getElementById('iq'),
    [].slice.call(document.querySelectorAll('[data-ifilter]')),document.getElementById('icount'),'kinds');
  runM();runC();runI();

  document.getElementById('ireset').addEventListener('click',function(){
    document.getElementById('iq').value='';
    document.querySelectorAll('[data-ifilter]').forEach(function(c){c.setAttribute('aria-pressed','false');});
    runI();
  });
  document.getElementById('reset').addEventListener('click',function(){
    document.getElementById('q').value='';
    document.querySelectorAll('[data-filter]').forEach(function(c){c.setAttribute('aria-pressed','false');});
    runM();
  });
  document.getElementById('creset').addEventListener('click',function(){
    document.getElementById('cq').value='';
    document.querySelectorAll('[data-cfilter]').forEach(function(c){c.setAttribute('aria-pressed','false');});
    runC();
  });
})();
</script>
</body>
</html>`;
}

(async () => {
  const register = await readRegister();
  fs.writeFileSync(OUT, page(register), "utf8");
  console.log(
    `[framework] ${ALL_RIGHTS.length} rights · ${ROLES.length} roles · ${CAPABILITIES.length} capabilities · ${totalTicksOf()} ticks\n` +
    `[framework] ${INTERNAL_ONLY.length} internal-only · ${SOLE.length} single-holder · ${UNHELD.length} unheld · ` +
    `${violations.length} separation breach(es) · ${refusedSets.length} minimal refused combination(s)\n` +
    `[framework] intake CLOSES: ${DOCUMENT_KINDS.length} document kinds · ${FILE_BORNE.length} file-borne + ` +
    `${DECLARED.length} declared = ${CAPABILITIES.length} capabilities · 0 orphans · 0 ambiguous\n` +
    `[framework] queues: ${QUEUES.map((q) => `${q.role}=${q.disposes.length}`).join(" ")}\n` +
    `[framework] register ${register.read ? `read (${register.identities} identities)` : `not read${register.why ? ` — ${register.why}` : ""}`}\n` +
    `[framework] wrote ${path.relative(ROOT, OUT)}`,
  );
})();

function totalTicksOf() {
  return ROLES.reduce((n, r) => n + ROLE_RIGHTS[r].length, 0);
}
