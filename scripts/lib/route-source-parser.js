"use strict";

/**
 * Parse the route registry without executing TypeScript.
 *
 * Scripts in this repository deliberately remain dependency-free.  A regular
 * expression cannot safely delimit R(...) once the extra object contains
 * nested calls or conditional text, so this scanner balances delimiters and
 * respects strings and comments before splitting the six top-level arguments.
 */

function scanCalls(source, callee) {
  const calls = [];
  const needle = `${callee}(`;
  for (let start = 0; start < source.length;) {
    const found = source.indexOf(needle, start);
    if (found < 0) break;
    start = found + needle.length;
    const before = source[found - 1] || "";
    if (/[A-Za-z0-9_$]/.test(before)) continue;

    let depth = 1;
    let quote = "";
    let escaped = false;
    let lineComment = false;
    let blockComment = false;
    let i = start;
    for (; i < source.length && depth > 0; i++) {
      const ch = source[i];
      const next = source[i + 1];
      if (lineComment) {
        if (ch === "\n") lineComment = false;
        continue;
      }
      if (blockComment) {
        if (ch === "*" && next === "/") { blockComment = false; i++; }
        continue;
      }
      if (quote) {
        if (escaped) { escaped = false; continue; }
        if (ch === "\\") { escaped = true; continue; }
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === "/" && next === "/") { lineComment = true; i++; continue; }
      if (ch === "/" && next === "*") { blockComment = true; i++; continue; }
      if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
    }
    if (depth === 0) calls.push(source.slice(start, i - 1));
  }
  return calls;
}

function splitTopLevel(source) {
  const parts = [];
  let start = 0;
  let round = 0;
  let square = 0;
  let curly = 0;
  let quote = "";
  let escaped = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "(") round++;
    else if (ch === ")") round--;
    else if (ch === "[") square++;
    else if (ch === "]") square--;
    else if (ch === "{") curly++;
    else if (ch === "}") curly--;
    else if (ch === "," && round === 0 && square === 0 && curly === 0) {
      parts.push(source.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(source.slice(start).trim());
  return parts;
}

const decode = (value) => value
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\n/g, "\n")
  .replace(/\\(["'\\])/g, "$1");

function stringConstants(source) {
  const constants = new Map();
  for (const match of source.matchAll(/(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*=\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+);/g)) {
    const value = [...match[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
      .map((part) => decode(part[1])).join("");
    constants.set(match[1], value);
  }
  return constants;
}

function literal(expression, constants) {
  const value = expression.trim();
  if (constants.has(value)) return constants.get(value);
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return decode(value.slice(1, -1));
  }
  if (value.startsWith("`") && value.endsWith("`")) {
    return decode(value.slice(1, -1)).replace(/\$\{([A-Z][A-Z0-9_]*)\}/g, (_, name) => {
      if (!constants.has(name)) throw new Error(`Unresolved route template constant ${name}`);
      return constants.get(name);
    });
  }
  return null;
}

function list(objectSource, key) {
  const body = (objectSource.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`)) || [, ""])[1];
  return [...body.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map((x) => decode(x[1]));
}

function parseRoutesSource(source) {
  const constants = stringConstants(source);
  const routes = [];
  for (const call of scanCalls(source, "R")) {
    const args = splitTopLevel(call);
    if (args.length < 5) continue;
    const ia = literal(args[0], constants);
    const routePath = literal(args[1], constants);
    const name = literal(args[2], constants);
    const group = literal(args[3], constants);
    const assembly = args[4].trim() === "null" ? null : literal(args[4], constants);
    if (!ia || !routePath || !name || !group || (assembly === null && args[4].trim() !== "null")) continue;
    const extra = args[5] || "";
    const overrideMatch = extra.match(/accessOverride:\s*\{\s*access:\s*"(\w+)"[\s\S]*?because:\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+|[A-Z][A-Z0-9_]*)/);
    const reasonExpression = overrideMatch?.[2]?.trim();
    const because = reasonExpression
      ? (constants.get(reasonExpression) || [...reasonExpression.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => decode(x[1])).join(""))
      : "";
    const notesMatch = extra.match(/notes:\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+)/);
    routes.push({
      ia,
      path: routePath,
      name,
      group,
      assembly,
      params: list(extra, "params"),
      coLocatedIa: list(extra, "coLocatedIa"),
      rights: list(extra, "rights"),
      override: overrideMatch ? overrideMatch[1] : null,
      overrideBecause: because,
      hasOverrideKey: /accessOverride:/.test(extra),
      indexable: (extra.match(/indexable:\s*(true|false)/) || [])[1] || null,
      notes: notesMatch ? [...notesMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => decode(x[1])).join("") : "",
      raw: extra,
    });
  }
  return routes;
}

module.exports = { parseRoutesSource, scanCalls, splitTopLevel };

/* ── Access derivation, shared ─────────────────────────────────────────
 *
 * Added 21 Sep 2026 for REM-009. The vantage → access derivation was
 * written out longhand in gen-app.js, gen-ia-map.js, public-law-lint.js
 * and route-lint.js — four copies of a rule this repo keeps saying should
 * live in one place. This is a fifth implementation only until those four
 * adopt it; it is deliberately identical to route-lint.js, which is the
 * one that checks the derivation against lib/access.ts.
 */

const ACCESS_FOR_VANTAGE = {
  gateway: "public", space: "public", time: "member",
  member: "member", capital: "office", admin: "office",
};
const GROUP_VANTAGE = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};
const ACCESS_RANK = { public: 0, identified: 1, accredited: 2, member: 3, office: 4 };

/** Assembly id → vantage, read from constants/assemblies.ts source. */
function assemblyVantages(assembliesSource) {
  const out = new Map();
  for (const m of assembliesSource.matchAll(/export const \w+: Assembly = \{([\s\S]*?)\n\};/g)) {
    const id = (m[1].match(/\bid:\s*"([^"]+)"/) || [])[1];
    const v = (m[1].match(/\bvantage:\s*"([^"]+)"/) || [])[1];
    if (id && v) out.set(id, v);
  }
  return out;
}

/** The access one route requires. Mirrors requiredAccess() in lib/access.ts. */
function accessOf(route, vantages) {
  if (route.override) return route.override;
  const v = (route.assembly && vantages.get(route.assembly)) || GROUP_VANTAGE[route.group];
  return ACCESS_FOR_VANTAGE[v];
}

/**
 * path → access, with dynamic segments matched.
 *
 * `/collection/slowspace-coastal/enquire` has to resolve to the route
 * `/collection/[vehicle]/enquire`, or every link carrying a real slug
 * reads as an unknown path — which would render a gated link as an open
 * one, silently, which is the exact defect REM-009 is about.
 */
function accessResolver(routesSource, assembliesSource) {
  const vantages = assemblyVantages(assembliesSource);
  const table = parseRoutesSource(routesSource).map((r) => ({
    path: r.path,
    access: accessOf(r, vantages),
    re: new RegExp(`^${r.path.replace(/\[[^\]]+\]/g, "[^/]+").replace(/\//g, "\/")}$`),
    segments: r.path.split("/").length,
    literal: !r.path.includes("["),
  }));
  return (pathname) => {
    const clean = pathname.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
    const exact = table.find((t) => t.literal && t.path === clean);
    if (exact) return exact.access;
    /* A literal route always beats a dynamic one, and among dynamic ones
       the longest wins — otherwise /collection/[vehicle] would swallow
       /collection/[vehicle]/risk. */
    const hit = table
      .filter((t) => t.segments === clean.split("/").length && t.re.test(clean))
      .sort((a, b) => Number(a.literal) - Number(b.literal))
      .pop();
    return hit ? hit.access : null;
  };
}

module.exports.ACCESS_FOR_VANTAGE = ACCESS_FOR_VANTAGE;
module.exports.GROUP_VANTAGE = GROUP_VANTAGE;
module.exports.ACCESS_RANK = ACCESS_RANK;
module.exports.assemblyVantages = assemblyVantages;
module.exports.accessOf = accessOf;
module.exports.accessResolver = accessResolver;
