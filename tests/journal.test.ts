/**
 * THE JOURNAL — the corpus and its editorial axes
 *
 * scripts/journal-lint.js checks the same body by parsing source text.
 * This checks it by importing, and the two are not redundant: the linter
 * catches a violation before a build, and these catch the linter itself
 * going blind. A regex that stops matching reports zero findings, which
 * reads as a clean pass — so several of these assert the COUNT the linter
 * should be seeing, and would fail loudly if it were seeing nothing.
 */

import { describe, it, expect } from "vitest";
import { JOURNAL, entryBySlug } from "../content/journal";
import {
  CHANNELS, DISTANCES, DISTANCE_RANK, FRANCHISES, DEPTHS, PERSONAS,
  DISCLOSURE_TEXT, channelById, franchiseById,
  type Distance,
} from "../constants/journal-taxonomy";

const withMeta = JOURNAL.filter((e) => e.meta !== undefined);

describe("the corpus", () => {
  it("is not empty, and the outward Journal exists", () => {
    /* Guards the guard. Every count below is meaningless if these are
       zero, and zero is what a broken import looks like. */
    expect(JOURNAL.length).toBeGreaterThanOrEqual(13);
    expect(withMeta.length).toBeGreaterThanOrEqual(5);
  });

  it("has a unique slug and id per entry", () => {
    expect(new Set(JOURNAL.map((e) => e.slug)).size).toBe(JOURNAL.length);
    expect(new Set(JOURNAL.map((e) => e.id)).size).toBe(JOURNAL.length);
  });

  it("resolves every slug it publishes", () => {
    for (const e of JOURNAL) expect(entryBySlug(e.slug)?.id).toBe(e.id);
  });

  it("returns undefined for a slug nobody wrote", () => {
    expect(entryBySlug("does-not-exist")).toBeUndefined();
  });

  it("gives every entry a standfirst and a body", () => {
    for (const e of JOURNAL) {
      expect(e.standfirst.length).toBeGreaterThan(20);
      expect(e.body.length).toBeGreaterThan(0);
    }
  });
});

describe("the editorial axes", () => {
  it("names only real taxonomy values", () => {
    const channels = new Set(CHANNELS.map((c) => c.id));
    const franchises = new Set(FRANCHISES.map((f) => f.id));
    const depths = new Set(DEPTHS.map((d) => d.id));
    const personas = new Set(PERSONAS.map((p) => p.id));

    for (const e of withMeta) {
      const m = e.meta!;
      expect(channels.has(m.channel)).toBe(true);
      expect(DISTANCES).toContain(m.distance);
      expect(depths.has(m.depth)).toBe(true);
      expect(personas.has(m.persona)).toBe(true);
      if (m.franchise) expect(franchises.has(m.franchise)).toBe(true);
      for (const p of m.alsoFor ?? []) expect(personas.has(p)).toBe(true);
    }
  });

  it("carries a disclosure on every outward entry, and it resolves to text", () => {
    for (const e of withMeta) {
      expect(e.meta!.disclosure).toBeTruthy();
      expect(DISCLOSURE_TEXT[e.meta!.disclosure].length).toBeGreaterThan(20);
    }
  });

  it("never repeats a reader in alsoFor that is already the primary", () => {
    /* Small, but it is the difference between "also for" meaning
       something and it being decoration. */
    for (const e of withMeta) {
      expect(e.meta!.alsoFor ?? []).not.toContain(e.meta!.persona);
    }
  });

  it("resolves the lookups the page renders through", () => {
    for (const e of withMeta) {
      expect(channelById(e.meta!.channel)?.name).toBeTruthy();
      if (e.meta!.franchise) expect(franchiseById(e.meta!.franchise)?.name).toBeTruthy();
    }
  });
});

describe("distance from the Collection", () => {
  it("ranks the five distances contiguously, furthest first", () => {
    expect(DISTANCES.length).toBe(5);
    DISTANCES.forEach((d, i) => expect(DISTANCE_RANK[d]).toBe(i));
    expect(DISTANCE_RANK.culture).toBeLessThan(DISTANCE_RANK.collection);
  });

  it("keeps the Journal's centre of gravity away from the near end", () => {
    /* The law the linter enforces, asserted here too. If this ever fails
       the Journal has become a brochure, and the fix is to publish
       something further out — not to move the ceiling. */
    const mean =
      withMeta.reduce((s, e) => s + DISTANCE_RANK[e.meta!.distance as Distance], 0) / withMeta.length;
    expect(mean).toBeLessThanOrEqual(DISTANCE_RANK.ownership);
  });

  it("spans more than one distance", () => {
    /* A Journal entirely at one distance passes the mean check while
       serving exactly one reader. */
    expect(new Set(withMeta.map((e) => e.meta!.distance)).size).toBeGreaterThanOrEqual(3);
  });

  it("does not claim independence while linking into something GC sells", () => {
    for (const e of withMeta) {
      if (e.meta!.disclosure !== "independent") continue;
      for (const o of e.onward ?? []) {
        /* /collection is the index — a list of what exists. A path below
           it is a specific vehicle, which is the thing being sold. */
        const sells = o.path.startsWith("/collection/") && o.path.split("/").length > 3;
        expect(sells, `${e.slug} → ${o.path}`).toBe(false);
      }
    }
  });
});

describe("depth", () => {
  const BAND: Record<string, [number, number]> = {
    glimpse: [0, 1], note: [1, 3], story: [4, 9], deep: [12, 30], film: [10, 60],
  };

  it("agrees with the minutes each entry claims", () => {
    for (const e of withMeta) {
      const [lo, hi] = BAND[e.meta!.depth];
      expect(e.minutes, e.slug).toBeGreaterThanOrEqual(lo);
      expect(e.minutes, e.slug).toBeLessThanOrEqual(hi);
    }
  });

  it("covers a band for every depth the taxonomy declares", () => {
    /* Guards the table above against a new depth being added to the
       taxonomy and silently escaping the check. */
    for (const d of DEPTHS) expect(BAND[d.id], d.id).toBeDefined();
  });
});
