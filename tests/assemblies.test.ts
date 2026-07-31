/**
 * Assemblies — whole screens, adapted from the Kyoto prototype set
 *
 * Wave 6.5
 */

import { describe, it, expect } from "vitest";
import {
  ASSEMBLIES, ASSEMBLY_LAWS, CORRECTIONS, GROUND_INVERSION,
  GATEWAY_GRID, PROPERTY_CONSOLE_SCREEN, PROPERTY_MASTHEAD,
  CAPITAL_EXPLAINER, MEMBER_CONSOLE, COMMITMENT_FLOW, STORY_PLAYBACK,
  assemblyById, assembliesFor, strategyOf,
} from "../constants/assemblies";
import { APERTURES, OPENING_RANK } from "../constants/apertures";
import { ORGANISMS } from "../constants/organisms";
import { COMPONENTS } from "../constants/components";
import { COLOUR } from "../constants/tokens";

const apertureById = (id: string) => APERTURES.find((a) => a.id === id);

describe("assemblies", () => {
  it("covers the prototype set", () => {
    expect(ASSEMBLIES).toHaveLength(8);
    expect(new Set(ASSEMBLIES.map((a) => a.id)).size).toBe(8);
  });

  it("states what each screen answers in five seconds", () => {
    // A screen that cannot state that does not have a purpose, it has
    // contents.
    for (const a of ASSEMBLIES) {
      expect(a.answers.length, a.id).toBeGreaterThan(15);
      expect(a.answers, a.id).toContain("?");
    }
  });

  it("resolves every rendered reference against its registry", () => {
    const organisms = new Set(ORGANISMS.map((o) => o.id));
    const components = new Set(COMPONENTS.map((c) => c.ref));
    for (const a of ASSEMBLIES) {
      for (const s of a.sections) {
        for (const ref of s.contains) {
          const known =
            organisms.has(ref) || components.has(ref) || apertureById(ref) !== undefined;
          expect(known, `${s.ref} → ${ref}`).toBe(true);
        }
      }
    }
  });

  it("never renders an aperture from a wider vantage than its own", () => {
    // The load-bearing rule. An assembly composes an aperture; it never
    // widens one. A gateway screen rendering the console's disclosure has
    // defeated the entire aperture tier.
    const RANK: Record<string, number> =
      { gateway: 0, space: 1, time: 1, member: 2, capital: 3, admin: 4 };
    for (const a of ASSEMBLIES) {
      for (const s of a.sections) {
        for (const ref of s.contains) {
          const ap = apertureById(ref);
          if (!ap) continue;
          expect(RANK[ap.vantage], `${s.ref} renders ${ref}`).toBeLessThanOrEqual(RANK[a.vantage]);
        }
      }
    }
  });

  it("distinguishes routing to a wider aperture from rendering one", () => {
    // A gateway that routes to the console is the narrow aperture saying
    // where the rest is kept — the opposite of a leak.
    const onward = GATEWAY_GRID.sections.find((s) => s.ref === "AS-01.c")!;
    expect(onward.contains).toEqual([]);
    expect(onward.routesTo).toContain("AP-02");
    expect(apertureById("AP-02")!.vantage).toBe("capital");
  });

  it("keeps the Trinity Lens at the space vantage", () => {
    // The prototype's Capital tab showed valuation and yield to an
    // anonymous visitor. The lens renders the SPACE aperture and routes
    // onward for the rest.
    const lens = PROPERTY_MASTHEAD.sections.find((s) => s.ref === "AS-03.b")!;
    expect(lens.contains).toEqual(["AP-03"]);
    expect(lens.routesTo).toEqual(["AP-02", "AP-04"]);
  });

  it("never both renders and routes to the same aperture", () => {
    for (const a of ASSEMBLIES) {
      for (const s of a.sections) {
        const both = (s.routesTo ?? []).filter((r) => s.contains.includes(r));
        expect(both, s.ref).toEqual([]);
      }
    }
  });

  it("prefixes every section ref with its assembly id", () => {
    for (const a of ASSEMBLIES) {
      for (const s of a.sections) expect(s.ref.startsWith(`${a.id}.`), s.ref).toBe(true);
    }
  });

  it("derives surface strategy from the route rather than declaring it", () => {
    expect(strategyOf(MEMBER_CONSOLE)).toBe("phone-parity");
    expect(strategyOf(PROPERTY_CONSOLE_SCREEN)).toBe("desktop-first");
    expect(strategyOf(GATEWAY_GRID)).toBe("phone-parity");
  });

  it("finds assemblies by id and by route", () => {
    expect(assemblyById("AS-05")).toBe(MEMBER_CONSOLE);
    expect(assembliesFor("gateway").map((a) => a.id)).toEqual(["AS-01", "AS-07", "AS-08"]);
  });
});

describe("the corrections", () => {
  it("records every disagreement rather than resolving it silently", () => {
    expect(CORRECTIONS.length).toBeGreaterThanOrEqual(40);
  });

  it("gives every correction a reason that is not a stock phrase", () => {
    // Length is not the test. "2.09:1 fails at any size." is 25 characters
    // and is a complete argument; "For consistency with the system" is 31
    // and is not one. What disqualifies a reason is that it appeals to
    // tidiness instead of to a consequence.
    for (const c of CORRECTIONS) {
      const where = `${c.assembly} · ${c.source}`;
      expect(c.because.length, where).toBeGreaterThan(15);
      expect(c.because.toLowerCase(), where).not.toMatch(
        /^(for |to be |)(consistency|consistent|uniformity|alignment|tidiness)\b|^to match the (system|design)/,
      );
    }
  });

  it("classifies every correction into one of five kinds", () => {
    const kinds = new Set(CORRECTIONS.map((c) => c.kind));
    for (const k of kinds) {
      expect(["constitutional", "accessibility", "vocabulary", "numeric", "interaction"]).toContain(k);
    }
    // All five actually occur — if one never fires, it is not a category.
    expect(kinds.size).toBe(5);
  });

  it("corrects the six-stage waterfall the capital prototype flattened to four", () => {
    const c = CAPITAL_EXPLAINER.corrections!.find((x) => x.was?.includes("Four-stage"))!;
    expect(c.now).toContain("Debt Service");
    expect(c.because).toContain("senior claim");
    expect(c.kind).toBe("constitutional");
  });

  it("corrects the accreditation window from 14 to 15 working days", () => {
    const c = COMMITMENT_FLOW.corrections!.find((x) => x.was?.includes("14 WORKING DAYS"))!;
    expect(c.now).toBe("15 working days.");
    // A day short on a regulatory window is a breach, not a rounding.
    expect(c.kind).toBe("numeric");
  });

  it("removes the camera feed from the member console", () => {
    // The asset is a place people occupy. A live feed shipped to equity
    // holders is surveillance of occupants.
    const c = MEMBER_CONSOLE.corrections!.find((x) => x.was?.includes("CCTV"))!;
    expect(c.now).toContain("Removed");
    expect(c.kind).toBe("constitutional");
  });

  it("renames the forbidden actor noun the whole prototype was built around", () => {
    const c = MEMBER_CONSOLE.corrections!.find((x) => x.kind === "vocabulary")!;
    expect(c.now).toContain("Member");
    expect(c.now).toContain("Stewardship");
  });

  it("reverses the platform-equity claim the capital prototype still carried", () => {
    const c = CAPITAL_EXPLAINER.corrections!.find((x) => x.was?.includes("100% OWNERSHIP"))!;
    expect(c.now).toContain("Governance Without Ownership");
  });

  it("counts the contrast failures it actually found", () => {
    const a11y = CORRECTIONS.filter((c) => c.kind === "accessibility");
    // Six distinct tones failed AA across the set, plus the interaction
    // failures that made figures unreachable at all.
    expect(a11y.length).toBeGreaterThanOrEqual(12);
    const ratios = a11y.filter((c) => /\d\.\d\d:1/.test(c.was ?? "") || /\d\.\d\d:1/.test(c.because));
    expect(ratios.length).toBeGreaterThanOrEqual(6);
  });

  it("names the prototype file for every correction", () => {
    for (const c of CORRECTIONS) expect(c.source).toMatch(/\.html?$/i);
  });
});

describe("the ground inversion", () => {
  it("puts financial claims on paper and narrative on void", () => {
    // The best idea in the source set: the page runs dark while it
    // explains, and flips to paper the moment it asserts. Light means
    // audited.
    expect(GROUND_INVERSION.narrative).toBe("void");
    expect(GROUND_INVERSION.assertion).toBe("paper");
    expect(COLOUR.void).toBeTruthy();
    expect(COLOUR.paper).toBeTruthy();
  });

  it("applies to real sections", () => {
    const refs = new Set(ASSEMBLIES.flatMap((a) => a.sections.map((s) => s.ref)));
    expect(GROUND_INVERSION.appliesTo.length).toBeGreaterThan(0);
    for (const r of GROUND_INVERSION.appliesTo) expect(refs.has(r), r).toBe(true);
  });

  it("cannot be overridden per screen", () => {
    // A rule that flexes is a preference.
    expect(GROUND_INVERSION.perScreenOverride).toBe(false);
  });

  it("covers the waterfall and the reserve floor", () => {
    expect(GROUND_INVERSION.appliesTo).toContain("AS-04.c");
    expect(GROUND_INVERSION.appliesTo).toContain("AS-04.d");
  });
});

describe("assembly laws", () => {
  it("keeps figures out of any surface that advances on a timer", () => {
    // A number on a card that advances in four seconds cannot be read,
    // checked, or returned to.
    expect(ASSEMBLY_LAWS.noFigureInMotion).toContain("timer");
    const player = STORY_PLAYBACK.sections.find((s) => s.ref === "AS-08.b")!;
    expect(player.contains).toEqual([]);
    expect(player.rule).toContain("NO FIGURE");
  });

  it("keeps the story player at the gateway only", () => {
    expect(STORY_PLAYBACK.vantage).toBe("gateway");
    expect(STORY_PLAYBACK.notes).toContain("cannot go back and check");
  });

  it("gives the timed player a pause control and a keyboard exit", () => {
    const cs = STORY_PLAYBACK.corrections!;
    expect(cs.some((c) => c.because.includes("2.2.2"))).toBe(true);
    expect(cs.some((c) => c.now.includes("Arrow keys"))).toBe(true);
  });

  it("states five laws", () => {
    expect(Object.keys(ASSEMBLY_LAWS)).toHaveLength(5);
    expect(ASSEMBLY_LAWS.vantageDecidesDisclosure).toContain("never widens");
  });
});

describe("the commitment flow", () => {
  it("keeps the asset anchored through every step", () => {
    // It is very hard to lose track of what you are committing to when
    // the thing never leaves the screen.
    const anchor = COMMITMENT_FLOW.sections[0];
    expect(anchor.name).toBe("Asset Anchor");
    expect(anchor.rule).toContain("Never collapses");
  });

  it("puts the piston after review, not before", () => {
    const refs = COMMITMENT_FLOW.sections.map((s) => s.name);
    expect(refs.indexOf("The Piston")).toBeGreaterThan(refs.indexOf("Review"));
  });

  it("offers no recovery strip after the capital moves", () => {
    const piston = COMMITMENT_FLOW.sections.find((s) => s.name === "The Piston")!;
    expect(piston.contains).toContain("M-04");
    expect(piston.rule).toContain("M-06 is for reversible acts");
  });

  it("does not make someone a Member before settlement", () => {
    // The Member Law fires on settlement, not acceptance.
    const settled = COMMITMENT_FLOW.sections.at(-1)!;
    expect(settled.rule).toContain("settlement");
    expect(settled.rule).toContain("may not congratulate");
  });
});

describe("the console screens", () => {
  it("shows the reserve band before it shows any asset", () => {
    // A console that shows assets before it shows whether the vehicle can
    // meet its obligations has the priority backwards.
    expect(PROPERTY_CONSOLE_SCREEN.sections[0].contains).toContain("O-04");
  });

  it("keeps valuation source beside the valuation, never in a tooltip", () => {
    const grid = PROPERTY_CONSOLE_SCREEN.sections.find((s) => s.ref === "AS-02.b")!;
    expect(grid.rule).toContain("never in a tooltip");
  });

  it("renders the widest Property aperture on the console screen", () => {
    const grid = PROPERTY_CONSOLE_SCREEN.sections.find((s) => s.ref === "AS-02.b")!;
    const ap = apertureById("AP-02")!;
    expect(grid.contains).toContain("AP-02");
    expect(OPENING_RANK[ap.opening]).toBe(2);
  });

  it("gives a blocked distribution the same weight as a paid one", () => {
    const position = MEMBER_CONSOLE.sections[0];
    expect(position.rule).toContain("same weight");
    expect(position.rule).toContain("owed the reason");
  });
});
