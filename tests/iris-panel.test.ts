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
import { COLLECTION } from "../content/site/home";
import { ROUTES } from "../constants/routes";
import { read, vehicleOf } from "../app/_assemblies/site/registry";

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

/* 4 Oct 2026, from the founder's own test on a phone. Asked what is in the
   Collection, IRIS described the Collection page, named no estate, and said
   it carried photography. Asked about returns, it answered in the platform's
   shorthand. Matching the right entry was tested; what the entry SAID was not. */
describe("an answer says what the site says", () => {
  const plain = (name: string) => name.replace(/<[^>]+>/g, "");
  const collection = IRIS_CORPUS.find((e) => e.asks.includes("properties"))!;
  const sentenceOf = (name: string) => collection.answer.split(/(?<=\.)\s+/).find((x) => x.includes(name)) ?? "";

  it("names every estate when asked what is in the Collection", () => {
    for (const e of COLLECTION) expect(collection.answer, e.name).toContain(plain(e.name));
    expect(collection.answer.startsWith(`${["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][COLLECTION.length]} estates.`)).toBe(true);
  });

  it("places each estate where the register places it", () => {
    /* The same reading the Collection page groups by (pages.tsx groupOf). */
    for (const e of COLLECTION) {
      const v = vehicleOf(e.vehicleKey);
      const status = v ? read(v).status : "";
      const word = e.funding === "complete" ? "funded" : status === "RAISING" ? "open now" : status === "FULLY SUBSCRIBED" ? "waitlist" : "pipeline";
      expect(sentenceOf(plain(e.name)), `${e.name}: ${word}`).toContain(word);
    }
  });

  it("promises no picture the site does not carry, and quotes no figure", () => {
    for (const e of IRIS_CORPUS) {
      expect(e.answer, e.id).not.toMatch(/photograph/i);
      expect(e.answer, e.id).not.toMatch(/₹|\d\s?%|\bCr\b|\blakh/i);
    }
  });

  it("keeps the platform's shorthand out of every answer", () => {
    for (const e of IRIS_CORPUS) {
      for (const internal of ["confidence class", "derivation", "six-stage", "enquiry surface", "constituted", "projection", "vantage"]) {
        expect(e.answer.toLowerCase(), `${e.id}: ${internal}`).not.toContain(internal);
      }
    }
  });

  it("points every answer at a page that exists", () => {
    const exists = (to: string) => ROUTES.some((r) => {
      const a = r.path.split("/"), b = to.split("/");
      return a.length === b.length && a.every((seg, i) => seg === b[i] || /^\[.+\]$/.test(seg));
    });
    for (const e of IRIS_CORPUS) expect(exists(e.source.to), `${e.id} → ${e.source.to}`).toBe(true);
  });

  it("sends nobody to one estate for an answer about all of them", () => {
    /* Four answers used to open Seaside Confluence's own pages, whatever was asked. */
    for (const e of IRIS_CORPUS) expect(e.source.to, e.id).not.toMatch(/^\/collection\/./);
  });
});
