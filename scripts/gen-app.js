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
const { parseRoutesSource } = require("./lib/route-source-parser");

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

// ── Parse every route ────────────────────────────────────────────────
/* Route declarations carry their stable IA identifier first:
   R(ia, path, name, group, assembly, extra).  The generator must use
   the URL field for its directory tree; treating the IA identifier as
   a URL produces invalid routes such as /GC-900. */
const ROUTES = parseRoutesSource(src);

if (ROUTES.length === 0 || asmVantage.size === 0) {
  console.error("[gen-app] Parsed zero routes or assemblies. Refusing to run.");
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
  /* AS-03 was the masthead — one card's worth of a place. The property
     page replaces it: same route, the whole wireframe, driven by
     constants/property-page.ts. It takes the SLUG rather than a Property
     row, because it reads the vehicle and the estate registries itself. */
  "AS-03": { component: "PropertySurface", from: "@/app/_assemblies/property",
             param: "vehicle", passAs: "slug",
             titleFrom: "propertyTitle", titleFromModule: "@/constants/property-page" },
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
  /* System surfaces have their own cinematic renderer, selected by the
     current canonical path rather than the retired /auth aliases. */
  /* OFF-095. Live data, so it is a component rather than a composition —
     compositions are static content read at build time. */
  "/office/contacts": { component: "ContactDesk", from: "@/app/_assemblies/contactdesk" },
  "/sign-in": { component: "SystemSurface", from: "@/app/_assemblies/systempages", prop: "/sign-in" },
  "/verify": { component: "SystemSurface", from: "@/app/_assemblies/systempages", prop: "/verify" },
  "/status": { component: "SystemSurface", from: "@/app/_assemblies/systempages", prop: "/status" },
  "/403": { component: "SystemSurface", from: "@/app/_assemblies/systempages", prop: "/403" },
  "/invest/qualify": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/qualify" },
  "/investor-workspace-preview": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/investor-workspace-preview" },
  "/member-workspace-preview": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/member-workspace-preview" },
  "/office-workspace-preview": { component: "OfficeSurface", from: "@/app/_assemblies/officepages", prop: "/office-workspace-preview" },
  "/home": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/home" },
  "/portfolio": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio" },
  "/portfolio/[vehicle]": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]", param: "vehicle" },
  "/portfolio/[vehicle]/space": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/space", param: "vehicle" },
  "/portfolio/[vehicle]/capital": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/capital", param: "vehicle" },
  "/portfolio/[vehicle]/time": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/time", param: "vehicle" },
  "/portfolio/[vehicle]/project": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/project", param: "vehicle" },
  "/portfolio/[vehicle]/partners": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/partners", param: "vehicle" },
  "/portfolio/[vehicle]/governance": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/governance", param: "vehicle" },
  "/portfolio/[vehicle]/documents": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/documents", param: "vehicle" },
  "/portfolio/[vehicle]/activity": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/portfolio/[vehicle]/activity", param: "vehicle" },
  "/activity": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/activity" },
  "/profile": { component: "MemberSurface", from: "@/app/_assemblies/memberpages", prop: "/profile" },
  "/invest/[vehicle]": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]", param: "vehicle" },
  "/invest/[vehicle]/asset": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/asset", param: "vehicle" },
  "/invest/[vehicle]/financials": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/financials", param: "vehicle" },
  "/invest/[vehicle]/structure": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/structure", param: "vehicle" },
  "/invest/[vehicle]/risks": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/risks", param: "vehicle" },
  "/invest/[vehicle]/dataroom": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/dataroom", param: "vehicle" },
  "/invest/[vehicle]/commit": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/commit", param: "vehicle" },
  "/invest/[vehicle]/speak": { component: "InvestorSurface", from: "@/app/_assemblies/investorpages", prop: "/invest/[vehicle]/speak", param: "vehicle" },

  /* The member surfaces: MEM.01, MEM.02, MEM.05-MEM.08. */
  "/member/profile": { component: "Passport", from: "@/app/_assemblies/memberpages" },
  "/member/resolutions": { component: "Boardroom", from: "@/app/_assemblies/memberpages" },
  "/member/calibration": { component: "Calibration", from: "@/app/_assemblies/memberpages" },
  "/member/signal": { component: "SignalLog", from: "@/app/_assemblies/memberpages" },
  "/member/notifications": { component: "NotificationsFeed", from: "@/app/_assemblies/notices" },
  "/member/codex": { component: "Codex", from: "@/app/_assemblies/memberpages" },
  "/member/pass": { component: "Pass", from: "@/app/_assemblies/memberpages" },

  /* The legal corpus: one renderer, seven documents, chosen by path.
     AS-29 takes the path as a prop rather than being seven components. */
  "/legal": { component: "DocumentIndex", from: "@/app/_assemblies/documents" },
  "/legal/[document]": { component: "StandingDocBySlug", from: "@/app/_assemblies/documents", param: "document" },

  "/journal": { component: "JournalIndex", from: "@/app/_assemblies/documents" },
  "/journal/[story]": { component: "JournalEntry", from: "@/app/_assemblies/documents", param: "story", passAs: "slug" },

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
  if (!port && (r.path === "/office" || r.path.startsWith("/office/"))) {
    port = { component: "OfficeSurface", from: "@/app/_assemblies/officepages",
             prop: r.path, needsParams: true };
  }
  /* A composition builds any route nothing more specific claims. */
  if (!port && COMPOSED.has(r.path)) {
    port = { component: "Composed", from: "@/app/_assemblies/compose",
             prop: r.path, param: r.params[0] };
  }
  const indexable = access === "public";
  const hasParams = r.params.length > 0;
  const usesParams = hasParams && (!port || port.needsProperty || port.needsParams || port.param);
  /* The root's name IS the brand, so the suffix would render "Getaway
     Collective · Getaway Collective" on the one page most likely to be
     shared. */
  const title = r.name === "Getaway Collective" ? r.name : `${r.name} · Getaway Collective`;

  const paramsType = usesParams
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
  /**
   * A route whose page IS one of several things needs a title per thing.
   *
   * /collection/[vehicle] shipped titled "Opportunity" for all three
   * properties — which is what the route is called in the table, and not
   * what any of the pages is about. A shared link, a browser tab and a
   * search result all read that title before anything else.
   *
   * `titleFrom` names a resolver called with the route's first param. The
   * page stays indexable: the title is public either way, so nothing is
   * disclosed that the page itself does not already show.
   */
  const meta = indexable && port && port.titleFrom
    ? `export async function generateMetadata(\n` +
      `  props: { params: Promise<{ ${r.params[0]}: string }> },\n` +
      `): Promise<Metadata> {\n` +
      `  const params = await props.params;\n` +
      `  const name = ${port.titleFrom}(params.${r.params[0]});\n` +
      `  return {\n` +
      `    title: name ?? ${JSON.stringify(title)},\n` +
      `    robots: { index: true, follow: true },\n` +
      `  };\n` +
      `}\n`
    : indexable
    ? `export const metadata: Metadata = {\n` +
      `  title: ${JSON.stringify(title)},\n` +
      `  robots: { index: true, follow: true },\n` +
      `};\n`
    : `export async function generateMetadata(): Promise<Metadata> {\n` +
      `  const reachable = canReach(${JSON.stringify(r.path)}, await currentSubject()).ok;\n` +
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
        /* `indexable &&` matters. The same assembly serves an office
           route, which resolves its title against the subject instead —
           so it must not import a resolver it never calls. */
        (indexable && port.titleFrom
          ? `import { ${port.titleFrom} } from ${JSON.stringify(port.titleFromModule)};\n`
          : "") +
        (port.needsProperty
          ? `import { propertyBySlug } from "@/app/_assemblies/data";\n` +
            `import { notFound } from "next/navigation";\n`
          : "")
      : `import { Surface } from "@/app/_system/surface";\n`) +
    (indexable
      ? ""
      : `import { canReach } from "@/lib/access";\n` +
        `import { currentSubject } from "@/lib/session";\n`) +
    `\n${meta}\n` +
    `export default async function ${ident(r.path)}(${usesParams ? `props: ${paramsType}` : ""}) {\n` +
    (usesParams ? `  const params = await props.params;\n` : "") +
    (port && port.needsProperty
      ? `  const property = propertyBySlug(params.${r.params[0]});\n` +
        `  if (!property) notFound();\n` +
        `  return <${port.component} p={property} />;\n`
      : port && port.needsParams
        ? `  return <${port.component} path=${JSON.stringify(port.prop)}${hasParams ? " params={params}" : ""} />;\n`
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
        ? `  return <${port.component} ${port.passAs || port.param}={params.${port.param}} />;\n`
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
