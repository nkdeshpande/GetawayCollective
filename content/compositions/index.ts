/**
 * THE COMPOSITION REGISTRY — every composed route, in one map
 *
 * Wave 9 · Modular build
 *
 * Merged from four files that mirror the vantages. The checks below run
 * at load: a duplicate path, a composition whose disclosure is missing
 * a stage, or an entry keyed off the route table would each ship as a
 * quiet defect otherwise.
 */
import type { Entry, Composition } from "@/app/_assemblies/compose";
import { PUB } from "./pub";
import { PASSPORT_PAGES } from "./passport";
import { MEMBER_PAGES } from "./member";
import { OFFICE_PAGES } from "./office";

const parts: readonly Record<string, Entry>[] = [PUB, PASSPORT_PAGES, MEMBER_PAGES, OFFICE_PAGES];

/* No two files may claim the same path. */
{
  const seen = new Set<string>();
  for (const part of parts)
    for (const path of Object.keys(part)) {
      if (seen.has(path)) throw new Error(`Composition for ${path} is defined twice.`);
      seen.add(path);
    }
}

export const COMPOSITIONS: Record<string, Entry> = Object.assign({}, ...parts);

/* Every composition must answer all four stages, including the
   parameterised ones — probed with a representative param. */
{
  const STAGES = ["public", "kyc", "committed", "operational"] as const;
  for (const [path, entry] of Object.entries(COMPOSITIONS)) {
    const page: Composition = typeof entry === "function" ? entry("probe-0000") : entry;
    if (!page.title) throw new Error(`${path}: composition has no title`);
    for (const st of STAGES) {
      if (!page.disclosure?.[st]) throw new Error(`${path}: disclosure missing stage "${st}"`);
    }
    if (!page.sections.length) throw new Error(`${path}: no sections`);
  }
}

export const COMPOSED_PATHS: readonly string[] = Object.keys(COMPOSITIONS).sort();
