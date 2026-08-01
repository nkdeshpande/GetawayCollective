#!/usr/bin/env node
/**
 * APP TREE GENERATOR — app/ is written from constants/routes.ts
 *
 * Wave 7 · Workspaces
 *
 * Every page.tsx, every route-group layout, and the root layout are
 * generated. Nobody hand-writes a route: a URL exists because the route
 * table says so, and `--check` fails the gate when the tree and the table
 * disagree.
 *
 * That matters more here than anywhere else in the system. A hand-added
 * page is a URL with no declared access class, no assembly, and no entry
 * in the architecture — reachable, and invisible to every check written
 * to govern reachable things.
 *
 * Usage:
 *   node scripts/gen-app.js           write the tree
 *   node scripts/gen-app.js --check   fail if the tree has drifted
 *
 * Zero dependencies.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "app");
const CHECK = process.argv.includes("--check");

const read = (...p) =>
  fs.readFileSync(path.join(ROOT, ...p), "utf8").replace(/\r\n/g, "\n");

const src = read("constants", "routes.ts");
const asmSrc = read("constants", "assemblies.ts");

// ── Registries ───────────────────────────────────────────────────────
const asmVantage = new Map();
const asmName = new Map();
for (const m of asmSrc.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
  const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
  if (!id) continue;
  asmVantage.set(id, (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1]);
  asmName.set(id, (m[1].match(/\bname:\s*"([^"]+)"/) || [])[1]);
}

const ACCESS_FOR_VANTAGE = {
  gateway: "public", space: "public", time: "member",
  member: "member", capital: "office", admin: "office",
};
const GROUP_VANTAGE = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};

const join = (c) => [...c.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("");
const resolveConst = (n) => {
  const m = src.match(new RegExp(`export const ${n}\\s*=\\s*((?:"(?:[^"\\\\]|\\\\.)*"\\s*\\+?\\s*\\n?\\s*)+);`));
  return m ? join(m[1]) : "";
};

const STAGES = [...((src.match(/export const PASSPORT_STAGES = \[([\s\S]*?)\] as const;/) || [, ""])[1])
  .matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// ── Parse every route, expanding the generated passport stages ───────
const RE = /R\(\s*(`[^`]*`|"[^"]*")\s*,\s*(`[^`]*`|"[^"]*")\s*,\s*"(\w+)"\s*,\s*(null|"[^"]*")([\s\S]*?)\n?\s*\),?\n/g;

function parseAll() {
  const out = [];
  for (const m of src.matchAll(RE)) {
    const tail = m[5];
    const unq = (s) => s.replace(/^[`"]|[`"]$/g, "");
    const o = tail.match(
      /accessOverride:\s*\{\s*access:\s*"(\w+)"[\s\S]*?because:\s*\n?\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*\n?\s*)+|[A-Z][A-Z0-9_]*)/,
    );
    const base = {
      rawPath: unq(m[1]), rawName: unq(m[2]), group: m[3],
      assembly: m[4] === "null" ? null : unq(m[4]),
      params: [...((tail.match(/params:\s*\[([^\]]*)\]/) || [, ""])[1]).matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      rights: [...((tail.match(/rights:\s*\[([^\]]*)\]/) || [, ""])[1]).matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      override: o ? o[1] : null,
      isTemplate: /^`/.test(m[1]),
    };
    if (base.isTemplate) {
      // The sixteen passport stages are generated from PASSPORT_STAGES.
      for (const st of STAGES) {
        out.push({ ...base, isTemplate: false,
          path: base.rawPath.replace("${st}", st),
          name: `Passport · ${st.replace(/-/g, " ")}` });
      }
    } else {
      out.push({ ...base, path: base.rawPath, name: base.rawName });
    }
  }
  return out;
}

const ROUTES = parseAll();

if (ROUTES.length === 0 || asmVantage.size === 0 || STAGES.length === 0) {
  console.error("[gen-app] Parsed zero routes, assemblies or stages. Refusing to run.");
  process.exit(2);
}

const accessOf = (r) => {
  if (r.override) return r.override;
  const v = (r.assembly && asmVantage.get(r.assembly)) || GROUP_VANTAGE[r.group];
  return ACCESS_FOR_VANTAGE[v];
};

/**
 * Two paths in the route table are FRAMEWORK CONVENTIONS, not pages.
 *
 * Next.js owns /404 and /500: in the App Router they are `not-found.tsx`
 * and `error.tsx` at the root, and emitting them as ordinary pages
 * collides at build time — the export step tries to rename its own
 * 500.html over a page that already claimed the slot.
 *
 * They stay in the route table because they ARE addressable states that
 * the architecture has to describe, with an access class and an assembly
 * like anything else. Only the file they compile to differs.
 *
 * /403 is deliberately NOT here. It has no framework convention, and the
 * guard renders it inline rather than redirecting — a redirect to /403
 * puts the fact of the denial in browser history.
 */
const CONVENTIONS = {
  "/404": { file: "not-found.tsx", kind: "not-found" },
  "/500": { file: "error.tsx", kind: "error" },
};

// ── File layout ──────────────────────────────────────────────────────
// A route group becomes a Next.js (group) folder, which does NOT appear
// in the URL. So /member/position lives at app/(member)/member/position.
const fileFor = (r) => {
  const conv = CONVENTIONS[r.path];
  if (conv) return path.join(APP, conv.file);
  const segs = r.path.split("/").filter(Boolean);
  return path.join(APP, `(${r.group})`, ...segs, "page.tsx");
};

const BANNER = (extra) =>
  `/**\n * GENERATED — do not edit.\n *\n` +
  ` * Written by scripts/gen-app.js from constants/routes.ts.\n` +
  ` * Run \`npm run app\` to regenerate, \`npm run app:check\` to verify.\n` +
  (extra ? ` *\n${extra.split("\n").map((l) => ` * ${l}`).join("\n")}\n` : "") +
  ` */\n`;

const ident = (s) => "P" + s.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Page";

/**
 * Assemblies that have been PORTED to React.
 *
 * A route whose assembly appears here renders the real interface. Every
 * other route renders the registry Surface — which shows the assembly's
 * declared sections and rules, and is a scaffold rather than the product.
 *
 * The distinction is explicit and per-route rather than implied, because
 * a scaffold that looks finished is worse than one that admits what it
 * is: the first gets signed off.
 */
const PORTED = {
  "AS-01": { component: "GatewayGrid", from: "@/app/_assemblies/gateway" },
  "AS-03": { component: "PropertyMasthead", from: "@/app/_assemblies/gateway", needsProperty: true },
  "AS-04": { component: "CapitalExplainer", from: "@/app/_assemblies/gateway" },
  "AS-23": { component: "Home", from: "@/app/_assemblies/gateway" },
  "AS-24": { component: "Testimonials", from: "@/app/_assemblies/gateway" },

  /* Wave 8 — the five footer targets that rendered the scaffold. */
  "AS-07": { component: "Portfolio", from: "@/app/_assemblies/gatewaypages" },
  "AS-08": { component: "Story", from: "@/app/_assemblies/gatewaypages" },
  "AS-09": { component: "Gallery", from: "@/app/_assemblies/gatewaypages" },
  "AS-17": { component: "Answers", from: "@/app/_assemblies/gatewaypages" },
  "AS-18": { component: "Roles", from: "@/app/_assemblies/gatewaypages" },
};

/**
 * COMPOSED ROUTES — derived from the composition registry, not listed.
 *
 * content/compositions/ holds a Record keyed by route path per file;
 * the keys are read here so a new composition becomes a built page by
 * existing, with no second list to update. An enumerated list here is
 * exactly the kind that fails silently — see SCAN_DIRS, COMPOSED and
 * TEXT_PAIRS before it.
 *
 * BY_PATH and PORTED win over a composition: a hand-built page is
 * always more specific than a composed one.
 */
const COMPOSED = (() => {
  const dir = path.join(ROOT, "content", "compositions");
  const out = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".ts") || f === "index.ts" || f === "shared.ts") continue;
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of text.matchAll(/^\s*"(\/[^"]*)":/gm)) out.add(m[1]);
    /* The sixteen passport stages are keyed from their stage table
       (Object.fromEntries over ROWS), not as literals — read the same
       table the compositions are built from. */
    for (const m of text.matchAll(/^\s*\{ slug: "([a-z-]+)"/gm)) out.add(`/passport/${m[1]}`);
  }
  return out;
})();

/* Routes whose component is chosen by PATH, not by assembly. The worked
   flow declares assembly: null on purpose — see constants/routes.ts. */
const BY_PATH = {
  /* The public surface: PUB.01-PUB.11, one renderer, chosen by path. */
  "/": { component: "Root", from: "@/app/_assemblies/publicpages" },
  "/how-it-works": { component: "HowItWorks", from: "@/app/_assemblies/publicpages" },
  "/collective/partners": { component: "Partners", from: "@/app/_assemblies/publicpages" },
  "/collective/operators": { component: "Operators", from: "@/app/_assemblies/publicpages" },
  "/collective/press": { component: "Wire", from: "@/app/_assemblies/publicpages" },
  "/communique/request": { component: "Dossier", from: "@/app/_assemblies/publicpages" },
  "/signal": { component: "Signal", from: "@/app/_assemblies/publicpages" },
  "/roles/[code]": { component: "RoleDetail", from: "@/app/_assemblies/gatewaypages", param: "code" },
  /* Administration. */
  "/admin/vehicles/new": { component: "VehicleFormation", from: "@/app/_assemblies/adminpages" },
  "/admin/content": { component: "ContentAdmin", from: "@/app/_assemblies/adminpages" },
  "/admin/media": { component: "MediaAdmin", from: "@/app/_assemblies/adminpages" },

  "/space": { component: "Space", from: "@/app/_assemblies/publicpages" },
  "/time": { component: "Time", from: "@/app/_assemblies/publicpages" },
  "/collective/gallery": { component: "Evidence", from: "@/app/_assemblies/publicpages" },
  "/structure": { component: "Structure", from: "@/app/_assemblies/publicpages" },
  "/auth/sign-in": { component: "Identify", from: "@/app/_assemblies/publicpages" },

  /* The member surfaces: MEM.01, MEM.02, MEM.05-MEM.08. */
  "/member/profile": { component: "Passport", from: "@/app/_assemblies/memberpages" },
  "/member/resolutions": { component: "Boardroom", from: "@/app/_assemblies/memberpages" },
  "/member/calibration": { component: "Calibration", from: "@/app/_assemblies/memberpages" },
  "/member/signal": { component: "SignalLog", from: "@/app/_assemblies/memberpages" },
  "/member/codex": { component: "Codex", from: "@/app/_assemblies/memberpages" },
  "/member/pass": { component: "Pass", from: "@/app/_assemblies/memberpages" },

  /* The legal corpus: one renderer, seven documents, chosen by path.
     AS-29 takes the path as a prop rather than being seven components. */
  "/legal": { component: "DocumentIndex", from: "@/app/_assemblies/documents" },
  "/legal/terms": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/terms" },
  "/legal/risk-disclosure": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/risk-disclosure" },
  "/legal/privacy": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/privacy" },
  "/legal/cookies": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/cookies" },
  "/legal/disclosures": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/disclosures" },
  "/legal/complaints": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/complaints" },
  "/legal/accessibility": { component: "StandingDoc", from: "@/app/_assemblies/documents", prop: "/legal/accessibility" },

  "/journal": { component: "JournalIndex", from: "@/app/_assemblies/documents" },
  "/journal/[slug]": { component: "JournalEntry", from: "@/app/_assemblies/documents", param: "slug" },

  "/flow": { component: "Offering", from: "@/app/_assemblies/flow" },
  "/flow/accreditation": { component: "Accreditation", from: "@/app/_assemblies/flow" },
  "/flow/risk": { component: "RiskDisclosure", from: "@/app/_assemblies/flow" },
  "/flow/commit": { component: "Commit", from: "@/app/_assemblies/flow" },
  "/flow/settled": { component: "Settled", from: "@/app/_assemblies/flow" },
};

function conventionSource(r, conv) {
  const banner = BANNER(
    `Route      ${r.path}\n` +
    `Convention ${conv.file} — Next.js owns this path; it is not a page.\n` +
    (r.assembly ? `Assembly   ${r.assembly} · ${asmName.get(r.assembly)}\n` : ""),
  );

  if (conv.kind === "not-found") {
    return (
      banner +
      `\nimport { Surface } from "@/app/_system/surface";\n\n` +
      `export default function NotFound() {\n` +
      `  return <Surface path=${JSON.stringify(r.path)} assembly={${JSON.stringify(r.assembly)}} />;\n` +
      `}\n`
    );
  }

  /* error.tsx must be a Client Component and receives reset(). The error
     itself is NOT rendered: a stack trace or an exception name tells
     someone probing the site what the stack is, which is the correction
     AS-16 records against the source prototype. */
  return (
    banner +
    `\n"use client";\n\n` +
    `import { Surface } from "@/app/_system/surface";\n\n` +
    `export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {\n` +
    `  return (\n` +
    `    <>\n` +
    `      <Surface path=${JSON.stringify(r.path)} assembly={${JSON.stringify(r.assembly)}} />\n` +
    `      <div className="surface" style={{ paddingTop: 0 }}>\n` +
    `        <button className="btn primary" onClick={reset}>Try again</button>\n` +
    `      </div>\n` +
    `    </>\n` +
    `  );\n` +
    `}\n`
  );
}

function pageSource(r) {
  const access = accessOf(r);
  let port = BY_PATH[r.path] || (r.assembly ? PORTED[r.assembly] : null);
  /* A composition builds any route nothing more specific claims. */
  if (!port && COMPOSED.has(r.path)) {
    port = { component: "Composed", from: "@/app/_assemblies/compose",
             prop: r.path, param: r.params[0] };
  }
  const indexable = access === "public";
  const hasParams = r.params.length > 0;
  const title = `${r.name} · Getaway Collective`;

  const paramsType = hasParams
    ? `{ params: Promise<{ ${r.params.map((p) => `${p}: string`).join("; ")} }> }`
    : "Record<string, never>";

  /**
   * The TITLE is a disclosure.
   *
   * Static metadata resolves before the guard renders, so an anonymous
   * visitor to /admin/failure was getting "Constitutional Failure ·
   * Getaway Collective" in the browser tab while being denied the page —
   * the title said both that the surface exists and what it is, which is
   * precisely what IA_LAWS.notFoundNeverConfirms forbids.
   *
   * Public routes keep a static title and stay statically generated.
   * Everything else resolves its title against the subject, so the
   * specific name appears only to someone who can actually reach it.
   */
  const meta = indexable
    ? `export const metadata: Metadata = {\n` +
      `  title: ${JSON.stringify(title)},\n` +
      `  robots: { index: true, follow: true },\n` +
      `};\n`
    : `export async function generateMetadata(): Promise<Metadata> {\n` +
      `  const reachable = canReach(${JSON.stringify(r.path)}).ok;\n` +
      `  return {\n` +
      `    title: reachable ? ${JSON.stringify(title)} : "Getaway Collective",\n` +
      `    robots: { index: false, follow: false },\n` +
      `  };\n` +
      `}\n`;

  return (
    BANNER(
      `Route     ${r.path}\n` +
      `Access    ${access}${r.override ? "   (override — see constants/routes.ts)" : "   (derived from vantage)"}\n` +
      (r.assembly ? `Assembly  ${r.assembly} · ${asmName.get(r.assembly)}\n` : `Assembly  none — shell only\n`) +
      (r.rights.length ? `Rights    ${r.rights.join(", ")}\n` : ""),
    ) +
    `\nimport type { Metadata } from "next";\n` +
    (port
      ? `import { ${port.component} } from ${JSON.stringify(port.from)};\n` +
        (port.needsProperty
          ? `import { propertyBySlug } from "@/app/_assemblies/data";\n` +
            `import { notFound } from "next/navigation";\n`
          : "")
      : `import { Surface } from "@/app/_system/surface";\n`) +
    (indexable ? "" : `import { canReach } from "@/lib/access";\n`) +
    `\n${meta}\n` +
    `export default async function ${ident(r.path)}(${hasParams ? `props: ${paramsType}` : ""}) {\n` +
    (hasParams ? `  const params = await props.params;\n` : "") +
    (port && port.needsProperty
      ? `  const property = propertyBySlug(params.${r.params[0]});\n` +
        `  if (!property) notFound();\n` +
        `  return <${port.component} p={property} />;\n`
      : port && port.prop && port.param
        /* A composed dynamic route needs both: the path names the
           composition, the param feeds it. */
        ? `  return <${port.component} path=${JSON.stringify(port.prop)} param={params.${port.param}} />;\n`
      : port && port.prop
        /* One component serving several routes takes the path as a prop.
           Emitted as a literal, so the generated page states which
           document it is rather than resolving it at request time. */
        ? `  return <${port.component} path=${JSON.stringify(port.prop)} />;\n`
      : port && port.param
        ? `  return <${port.component} ${port.param}={params.${port.param}} />;\n`
      : port
        ? `  return <${port.component} />;\n`
        : `  return (\n` +
          `    <Surface\n` +
          `      path=${JSON.stringify(r.path)}\n` +
          `      assembly={${r.assembly ? JSON.stringify(r.assembly) : "null"}}\n` +
          (hasParams ? `      params={params}\n` : "") +
          `    />\n` +
          `  );\n`) +
    `}\n`
  );
}

function layoutSource(group) {
  const vantage = GROUP_VANTAGE[group];
  const access = ACCESS_FOR_VANTAGE[vantage];
  return (
    BANNER(
      `Route group  (${group})\n` +
      `Vantage      ${vantage}\n` +
      `Access       ${access}\n\n` +
      `The guard runs here rather than in each page, so a page added by\n` +
      `hand inside this group is still gated. It fails closed: an\n` +
      `unresolved subject is anonymous, and anonymous satisfies "public"\n` +
      `only.`,
    ) +
    `\nimport { GroupGuard } from "@/app/_system/guard";\n\n` +
    `export default function ${ident(group)}Layout({ children }: { children: React.ReactNode }) {\n` +
    `  return <GroupGuard group=${JSON.stringify(group)}>{children}</GroupGuard>;\n` +
    `}\n`
  );
}

// ── Assemble the tree ────────────────────────────────────────────────
const files = new Map();

for (const r of ROUTES) {
  const conv = CONVENTIONS[r.path];
  files.set(fileFor(r), conv ? conventionSource(r, conv) : pageSource(r));
}
for (const g of new Set(ROUTES.map((r) => r.group))) {
  files.set(path.join(APP, `(${g})`, "layout.tsx"), layoutSource(g));
}

// Only ONE route group may own "/". Next.js cannot resolve two.
{
  const roots = ROUTES.filter((r) => r.path === "/");
  if (roots.length > 1) {
    console.error(`[gen-app] ${roots.length} routes claim "/". Next.js can serve one.`);
    process.exit(2);
  }
}
// Two groups cannot own the same URL either — the (group) folder is
// invisible to the router, so a collision is silent until build time.
{
  const byPath = new Map();
  for (const r of ROUTES) {
    if (byPath.has(r.path) && byPath.get(r.path) !== r.group) {
      console.error(
        `[gen-app] ${r.path} is claimed by both (${byPath.get(r.path)}) and (${r.group}). ` +
          `A route group is invisible to the router, so this collides at build time.`,
      );
      process.exit(2);
    }
    byPath.set(r.path, r.group);
  }
}

// ── Write or check ───────────────────────────────────────────────────
function existingGenerated() {
  const out = new Map();
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e.name)) {
        const body = fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n");
        if (body.includes("GENERATED — do not edit")) out.set(full, body);
      }
    }
  };
  walk(APP);
  return out;
}

const existing = existingGenerated();
const drift = [];

for (const [f, body] of files) {
  const cur = existing.get(f);
  if (cur === undefined) drift.push(`missing  ${path.relative(ROOT, f)}`);
  else if (cur !== body) drift.push(`changed  ${path.relative(ROOT, f)}`);
}
for (const f of existing.keys()) {
  if (!files.has(f)) drift.push(`orphan   ${path.relative(ROOT, f)}`);
}

if (CHECK) {
  if (drift.length) {
    console.error(`[gen-app] DRIFT — ${drift.length} file(s) differ from constants/routes.ts\n`);
    for (const d of drift.slice(0, 25)) console.error(`  ${d}`);
    if (drift.length > 25) console.error(`  … ${drift.length - 25} more`);
    console.error(`\n  Run: npm run app\n`);
    process.exit(1);
  }
  console.log(`[gen-app] OK — app/ matches the route table (${files.size} generated files)`);
  process.exit(0);
}

for (const [f, body] of files) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, body);
}
for (const f of existing.keys()) if (!files.has(f)) fs.rmSync(f);

const pages = [...files.keys()].filter((f) => f.endsWith("page.tsx")).length;
const layouts = files.size - pages;
console.log(`[gen-app] wrote ${files.size} files — ${pages} pages, ${layouts} group layouts`);
const byAccess = {};
for (const r of ROUTES) byAccess[accessOf(r)] = (byAccess[accessOf(r)] || 0) + 1;
console.log("  " + Object.entries(byAccess).map(([k, v]) => `${k} ${v}`).join(" · "));
