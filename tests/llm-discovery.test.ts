/**
 * LLM DISCOVERY — 16 Oct 2026
 *
 * What answer engines read: /llms.txt, /llms-full.txt, robots and the
 * Organization node. Pinned so a later change cannot quietly send them an
 * old address, a missing risk section or a closed door.
 */
import { describe, it, expect } from "vitest";
import { llmsFullTxt, llmsTxt, pageGraph } from "../app/_system/ld";
import robots, { ANSWER_ENGINES } from "../app/robots";
import { toPublic } from "../constants/estate-urls";

describe("what answer engines read", () => {
  it("llms.txt and llms-full.txt give only the estates' own addresses", () => {
    for (const t of [llmsTxt(), llmsFullTxt()]) {
      expect(t).toContain("/collection/streamside-creek");
      expect(t).not.toMatch(/\/collection\/(coorg-coffee-creek|slowspace-)/);
    }
  });
  it("a Markdown link is swapped too", () =>
    expect(toPublic("[Creek](https://www.getawaycollective.co/collection/coorg-coffee-creek): x")).toBe("[Creek](https://www.getawaycollective.co/collection/streamside-creek): x"));
  it("llms-full.txt carries the explanatory pages, every estate and the Risk Factors as published", () => {
    const t = llmsFullTxt();
    expect(t).toContain("# The full text");
    expect(t).toContain("### Chapter 1: What you own");
    for (const n of ["Solace by SLOWSPACE", "Seaside Confluence", "Streamside Creek", "Coffee Fields Forever"]) expect(t).toContain(`### ${n}`);
    expect(t).toMatch(/## Hospitality Asset Disclosure \(version/);
  });
  it("robots names the answer engines and keeps them out of the same private paths", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const ai = rules.find((x) => Array.isArray(x.userAgent) && x.userAgent.includes("GPTBot"))!;
    expect(ai.userAgent).toEqual([...ANSWER_ENGINES]);
    expect(ai.disallow).toEqual(rules[0].disallow);
    expect(ai.disallow).toContain("/office");
  });
  it("the Organization says which Getaway it is", () => {
    const org = (pageGraph("/")["@graph"] as Record<string, unknown>[]).find((n) => n["@type"] === "Organization")!;
    expect(String(org.disambiguatingDescription)).toContain("Not affiliated with Getaway (getaway.house)");
  });
});
