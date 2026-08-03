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
