/**
 * The IRIS panel — reported "not good at all", 23 Sep 2026.
 *
 * It opened on two paragraphs about itself and a database count, and
 * everything a person came for sat below them. These pin the three things
 * the rewrite has to keep true: every suggested question is one IRIS can
 * actually answer, the limits are still stated before anyone asks, and
 * none of the platform's own vocabulary reaches the visitor.
 */
import { describe, it, expect } from "vitest";
import {
  IRIS_BOUNDARY, IRIS_CORPUS, IRIS_GREETING, IRIS_STARTERS, matchIris,
} from "../content/iris";

describe("every starter is a question IRIS answers", () => {
  it("matches a corpus entry, so the first tap is never a refusal", () => {
    expect(IRIS_STARTERS.length).toBeGreaterThanOrEqual(3);
    for (const q of IRIS_STARTERS) {
      expect(matchIris(q), q).not.toBeNull();
    }
  });

  it("reaches four different answers, not one answer four ways", () => {
    const hit = new Set(IRIS_STARTERS.map((q) => matchIris(q)));
    expect(hit.size).toBe(IRIS_STARTERS.length);
  });

  it("reaches the RIGHT answer for each, not merely a different one", () => {
    /* The test above passed while "What can I invest in?" returned the
       answer to "how do I invest". Distinct is not the same as correct, so
       each starter is pinned to the entry it exists to reach. */
    const entryFor = (ask: string) => IRIS_CORPUS.find((e) => e.asks.includes(ask));
    const intended: Record<string, string> = {
      "What properties are in the Collection?": "properties",
      "How does ownership work?": "how does ownership work",
      "What are the risks?": "what are the risks",
      "How do returns work?": "how do returns work",
    };
    expect(Object.keys(intended).sort()).toEqual([...IRIS_STARTERS].sort());
    for (const [question, ask] of Object.entries(intended)) {
      expect(matchIris(question), question).toBe(entryFor(ask));
    }
  });

  it("puts the question about risk in the list, not behind it", () => {
    expect(IRIS_STARTERS.some((q) => /risk/i.test(q))).toBe(true);
    const risky = IRIS_CORPUS.find((e) => e.asks.includes("what are the risks"));
    expect(IRIS_STARTERS.map((q) => matchIris(q))).toContain(risky);
  });
});

describe("the limits are still stated on open (UX-12)", () => {
  it("keeps all four things IRIS will not do", () => {
    for (const limit of ["advice", "recommend", "eligibility", "commitment"]) {
      expect(IRIS_BOUNDARY, limit).toContain(limit);
    }
    expect(IRIS_BOUNDARY).toContain("a person");
  });

  it("says where its answers come from", () => {
    expect(IRIS_BOUNDARY).toMatch(/publish/);
  });
});

describe("the visitor reads the visitor's words", () => {
  it("drops the platform's governance vocabulary", () => {
    const shown = `${IRIS_GREETING} ${IRIS_BOUNDARY} ${IRIS_STARTERS.join(" ")}`;
    for (const internal of ["named authority", "Relationship Intelligence", "approved answers", "the model"]) {
      expect(shown, internal).not.toContain(internal);
    }
  });

  it("opens in one sentence, not two paragraphs", () => {
    expect(IRIS_GREETING.split(/[.!?](\s|$)/).filter((x) => x.trim().length > 3)).toHaveLength(1);
    expect(IRIS_GREETING.length).toBeLessThan(120);
  });
});
