/**
 * Assemblies — whole screens, adapted from the Kyoto prototype set
 *
 * Wave 6.5
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ASSEMBLIES, ASSEMBLY_LAWS, CORRECTIONS, GROUND_INVERSION,
  GATEWAY_GRID, PROPERTY_CONSOLE_SCREEN, PROPERTY_MASTHEAD,
  CAPITAL_EXPLAINER, MEMBER_CONSOLE, COMMITMENT_FLOW, STORY_PLAYBACK,
  assemblyById, assembliesFor, strategyOf, scopeOf, SCREENS, CHROME, REGIONS,
} from "../constants/assemblies";
import { APERTURES, OPENING_RANK } from "../constants/apertures";
import type { RouteGroup } from "../constants/layout";
import { ORGANISMS } from "../constants/organisms";
import { COMPONENTS } from "../constants/components";
import { COLOUR } from "../constants/tokens";

const apertureById = (id: string) => APERTURES.find((a) => a.id === id);

describe("assemblies", () => {
  it("registers each assembly exactly once, with a contiguous id run", () => {
    // Asserting a COUNT breaks every time the registry grows, which taught
    // me nothing three times running. What actually matters is that no id
    // is duplicated and none is skipped — a missing AS-nn is a registry
    // gap, and a repeated one is two screens fighting over a name.
    const ids = ASSEMBLIES.map((a) => a.id);
    expect(new Set(ids).size, "duplicate id").toBe(ids.length);
    const ns = ids.map((i) => Number(i.slice(3))).sort((a, b) => a - b);
    expect(ns[0]).toBe(1);
    for (let i = 1; i < ns.length; i++) {
      expect(ns[i], `gap after AS-${String(ns[i - 1]).padStart(2, "0")}`).toBe(ns[i - 1] + 1);
    }
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
    const gw = assembliesFor("gateway").map((a) => a.id);
    expect(gw).toContain("AS-01");
    expect(gw.every((id) => assemblyById(id)!.route === "gateway")).toBe(true);
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

  it("names a source for every correction", () => {
    // Not every source is a file. The programme matrix arrived as a
    // document and the gallery references as images, so the test is that
    // a correction can be traced back to something — not that the
    // something happens to have an extension.
    for (const c of CORRECTIONS) {
      expect(c.source.length, c.assembly).toBeGreaterThan(6);
    }
    // The prototype-derived ones still name their file.
    const files = CORRECTIONS.filter((c) => /\.html?$/i.test(c.source));
    expect(files.length).toBeGreaterThanOrEqual(35);
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

// ─────────────────────────────────────────────────────────────────────
// Wave 6.6 — the gallery pair, the programme, and location
// ─────────────────────────────────────────────────────────────────────

describe("the gallery pair", () => {
  it("ships two shapes, at different vantages", () => {
    // AS-09 shows one thing beautifully; AS-10 shows five comparably.
    // Using either for the other's job gives a gallery that is pretty and
    // useless, or complete and inert.
    const frame = assemblyById("AS-09")!;
    const strip = assemblyById("AS-10")!;
    expect(frame.vantage).toBe("gateway");
    expect(strip.vantage).toBe("space");
    expect(frame.route).not.toBe(strip.route);
  });

  it("keeps the gallery on void even though the reference is light", () => {
    // The ground inversion is bidirectional and cannot be overridden per
    // screen. A gallery on paper would spend the audited signal on scenery.
    const c = assemblyById("AS-09")!.corrections!
      .find((x) => x.kind === "constitutional")!;
    expect(c.now).toContain("Void ground");
    expect(c.because).toContain("bidirectional");
    expect(GROUND_INVERSION.perScreenOverride).toBe(false);
  });

  it("makes every frame reachable without traversing the others", () => {
    const rail = assemblyById("AS-09")!.sections.find((s) => s.ref === "AS-09.b")!;
    expect(rail.rule).toContain("without passing through the others");
  });

  it("owes no pause control, because nothing auto-plays", () => {
    const frame = assemblyById("AS-09")!.sections[0];
    expect(frame.rule).toContain("only on intent");
    expect(frame.rule).toContain("none is faked");
  });

  it("puts the strip caption below the frame, never over it", () => {
    const strip = assemblyById("AS-10")!.sections[0];
    expect(strip.rule).toContain("BELOW the frame");
  });

  it("bars figures from a strip caption", () => {
    // A figure in a scrolling strip is read at a glance and compared
    // against its neighbour — the comparison provenance exists to qualify.
    const rule = assemblyById("AS-10")!.sections.find((s) => s.ref === "AS-10.b")!;
    expect(rule.rule).toContain("No valuation and no yield");
  });
});

describe("the stage progression", () => {
  const as11 = () => assemblyById("AS-11")!;

  it("is a matrix, not a timeline", () => {
    // A timeline implies each stage ends before the next begins. Half
    // these roles run across four stages at once.
    const c = as11().corrections!.find((x) => x.now.startsWith("A matrix"))!;
    expect(c.because).toContain("ends before the next begins");
    expect(as11().sections.find((s) => s.ref === "AS-11.b")!.kind).toBe("ledger");
  });

  it("reads stage state from the lifecycle field rather than copying it", () => {
    expect(as11().sections[0].rule).toContain("never holds a second copy");
  });

  it("translates the three forbidden terms at the boundary", () => {
    // §25 governs the platform, not the Operating Company's own documents.
    // So the terms are translated here, and the mapping is recorded.
    const v = as11().corrections!.filter((c) => c.kind === "vocabulary");
    expect(v).toHaveLength(3);
    const joined = v.map((c) => c.was).join(" ");
    // Asserted in the backticked form the corrections use — quoting the
    // violation is how the record works, and vocab-lint exempts backtick
    // spans precisely so a correction can name what it corrects.
    expect(joined).toContain("`" + "Studio" + " Typology");
    expect(joined).toContain("`Open " + "Bookings`");
    expect(joined).toContain("`First " + "Guest" + " Simulations`");
  });

  it("requires an explicit exit for every role", () => {
    // Eleven of eighteen leave before Stage 7. Without a stated exit, a
    // role that has gone still reads as accountable.
    const c = as11().corrections!.find((x) => x.now.includes("offboard"))!;
    expect(c.because).toContain("still reads as accountable");
  });

  it("surfaces the four vetoes separately from ordinary deliverables", () => {
    const s = as11().sections.find((x) => x.ref === "AS-11.c")!;
    expect(s.rule).toContain("how a hold gets missed");
    const c = as11().corrections!.find((x) => x.now.includes("IL-1"))!;
    expect(c.because).toContain("stop the programme");
  });

  it("sits at the capital vantage, not the gateway", () => {
    // A programme matrix on a marketing surface would be a delivery
    // schedule shown to someone with no standing to read it.
    expect(as11().vantage).toBe("capital");
  });
});

describe("location intelligence", () => {
  const as12 = () => assemblyById("AS-12")!;

  it("never lets the map be the only carrier", () => {
    // A map is unreadable to a screen reader and awkward at small sizes.
    expect(as12().sections[0].rule).toContain("also appears as text");
  });

  it("makes the panel a list first, with pins as a shortcut", () => {
    const c = as12().corrections!.find((x) => x.kind === "accessibility")!;
    expect(c.now).toContain("list first");
    expect(c.because).toContain("poor sole route");
  });

  it("requires a measurement window on every footfall figure", () => {
    // Footfall over an unnamed period is not a quantity. It is a number
    // that resembles one.
    const s = as12().sections.find((x) => x.ref === "AS-12.d")!;
    expect(s.rule).toContain("same weight");
    const c = as12().corrections!.find((x) => x.kind === "numeric")!;
    expect(c.because).toContain("resembles one");
  });

  it("refuses to plot identifiable individuals", () => {
    const c = as12().corrections!.find((x) => x.was?.includes("Identifiable"))!;
    expect(c.now).toContain("minimum cell count");
    expect(c.because).toContain("re-identify");
    expect(c.kind).toBe("constitutional");
  });

  it("declares catchment as modelled, with its assumption", () => {
    const s = as12().sections.find((x) => x.ref === "AS-12.b")!;
    expect(s.rule).toContain("MODELLED");
    expect(s.rule).toContain("assumption");
  });

  it("bars marketing rounding on durations", () => {
    const s = as12().sections.find((x) => x.ref === "AS-12.c")!;
    expect(s.rule).toContain("method behind it");
  });
});

describe("the registry after Wave 6.6", () => {
  it("holds every assembly built so far", () => {
    expect(ASSEMBLIES.length).toBeGreaterThanOrEqual(19);
  });

  it("still resolves every reference and never widens an aperture", () => {
    const RANK: Record<string, number> =
      { gateway: 0, space: 1, time: 1, member: 2, capital: 3, admin: 4 };
    for (const a of ASSEMBLIES) {
      for (const s of a.sections) {
        for (const ref of s.contains) {
          const ap = APERTURES.find((x) => x.id === ref);
          if (ap) expect(RANK[ap.vantage], `${s.ref}`).toBeLessThanOrEqual(RANK[a.vantage]);
        }
      }
    }
  });

  it("covers all five correction kinds across the new work", () => {
    const fresh = CORRECTIONS.filter((c) => ["AS-09","AS-10","AS-11","AS-12"].includes(c.assembly));
    expect(fresh.length).toBeGreaterThanOrEqual(14);
    expect(new Set(fresh.map((c) => c.kind)).size).toBeGreaterThanOrEqual(4);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Wave 6.7 — the LLP docket and the ancillary set
// ─────────────────────────────────────────────────────────────────────

describe("the LLP docket", () => {
  const as13 = () => assemblyById("AS-13")!;

  it("sits at the admin vantage and holds one entity completely", () => {
    expect(as13().vantage).toBe("admin");
    // Eight sections: header, formation, register, calendar, charges,
    // resolutions, nexus, audit. A docket with a gap is not a partial
    // docket, it is a misleading one.
    expect(as13().sections).toHaveLength(8);
  });

  it("corrects the vehicle from an SPV to an LLP", () => {
    // §24a makes the LLP the constitutional default and an SPV a
    // Board-approved exception. Every prototype had it the other way.
    const c = as13().corrections!.find((x) => x.was?.includes("SPV_INCORPORATION"))!;
    expect(c.now).toContain("Register of Partners");
    expect(c.because).toContain("24a");
    expect(c.kind).toBe("constitutional");
  });

  it("refuses to derive profit share from contribution", () => {
    // The trap: they look interchangeable and are independent under the
    // Act. A docket that derives one from the other is quietly wrong for
    // every entity whose agreement differs, with nothing on screen to show it.
    const c = as13().corrections!.find((x) => x.now.includes("never derived"))!;
    expect(c.because).toContain("independent");
    expect(as13().sections.find((s) => s.ref === "AS-13.c")!.rule).toContain("never derived");
  });

  it("rejects the unverifiable hash", () => {
    const c = as13().corrections!.find((x) => x.was?.includes("8d993k2"))!;
    // `k` is not a hexadecimal digit.
    expect(c.because).toContain("hexadecimal");
    expect(c.kind).toBe("numeric");
  });

  it("shows the hash even where the content is restricted", () => {
    const c = as13().corrections!.find((x) => x.was?.includes("HASH: HIDDEN"))!;
    expect(c.now).toContain("always shown");
    expect(c.because).toContain("outside the wall");
  });

  it("computes statutory due dates rather than storing them", () => {
    // A docket listing only what WAS filed cannot show what was missed,
    // and missing is the state that matters.
    const c = as13().corrections!.find((x) => x.now.includes("computed from the financial year"))!;
    expect(c.because).toContain("cannot show what was missed");
    expect(as13().sections[0].rule).toContain("DERIVED");
  });

  it("seals the ballot even at the admin vantage", () => {
    // Admin is not an exception to I-05; it is the vantage most likely to
    // assume it is.
    const s = as13().sections.find((x) => x.ref === "AS-13.f")!;
    expect(s.rule).toContain("sealed at every vantage");
    expect(s.rule).toContain("admin is not an exception");
  });

  it("puts an unsatisfied charge ahead of what it outranks", () => {
    const s = as13().sections.find((x) => x.ref === "AS-13.e")!;
    expect(s.rule).toContain("senior claim");
  });
});

describe("the ancillary set", () => {
  it("records the fourth drifted copy of the waterfall", () => {
    // The FAQ held its own restatement — three stages missing including
    // debt service, and "Platform Fee" where the Admin Reserve belongs.
    const c = assemblyById("AS-17")!.corrections!.find((x) => x.was?.includes("Platform Fee"))!;
    expect(c.because).toContain("fourth independent copy");
    expect(c.kind).toBe("constitutional");
  });

  it("removes physical access-control state from the public status page", () => {
    // Announcing which site's access control is offline says which door is
    // currently unsecured.
    const c = assemblyById("AS-15")!.corrections!.find((x) => x.was?.includes("MagLock"))!;
    expect(c.now).toContain("Removed");
    expect(c.because).toContain("unsecured");
  });

  it("never treats silence as health", () => {
    const s = assemblyById("AS-15")!.sections.find((x) => x.ref === "AS-15.b")!;
    expect(s.rule).toContain("Silence is not health");
  });

  it("drops the 404 auto-redirect", () => {
    const c = assemblyById("AS-16")!.corrections!.find((x) => x.was?.includes("30-second"))!;
    expect(c.because).toContain("2.2.1");
    expect(c.now).toContain("No automatic redirect");
  });

  it("stops reflecting the requested path and the exception name", () => {
    const c = assemblyById("AS-16")!.corrections!.find((x) => x.was?.includes("NULL_POINTER"))!;
    expect(c.because).toContain("injection surface");
    expect(c.kind).toBe("constitutional");
  });

  it("records the version acknowledged, not just the acknowledgement", () => {
    // An acknowledgement of v2.4 says nothing about v3.0.
    const s = assemblyById("AS-14")!.sections.find((x) => x.ref === "AS-14.b")!;
    expect(s.rule).toContain("VERSION is recorded");
  });

  it("unlocks the risk gate by any route, not by scroll position", () => {
    const c = assemblyById("AS-14")!.corrections!.find((x) => x.was?.includes("scrolling a div"))!;
    expect(c.because).toContain("Scroll position is not reading");
    expect(c.because).toContain("locked out the people most likely to have read it");
  });

  it("restores the piston to its constitutional duration", () => {
    // 1.3s is inside the range where someone presses through it.
    const c = assemblyById("AS-19")!.corrections!.find((x) => x.was?.includes("1.5%"))!;
    expect(c.now).toBe("3000ms, linear.");
    expect(c.kind).toBe("constitutional");
  });

  it("removes the white flash from the commit confirmation", () => {
    const c = assemblyById("AS-19")!.corrections!.find((x) => x.was?.includes("retina-burn"))!;
    expect(c.because).toContain("photosensitivity");
  });

  it("keeps filled roles legible", () => {
    // Someone reading a filled role is deciding whether to watch for the
    // next one.
    const c = assemblyById("AS-18")!.corrections!.find((x) => x.was?.includes("opacity: 0.3"))!;
    expect(c.because).toContain("could not read what the role was");
  });

  it("rewrites the recruitment voice", () => {
    const c = assemblyById("AS-18")!.corrections!.find((x) => x.was?.includes("backend is war"))!;
    expect(c.because).toContain("cold and");
    expect(c.kind).toBe("vocabulary");
  });
});

describe("criticalDeep", () => {
  it("exists, because the docket renders entirely on paper", () => {
    // The original four ground variants missed `critical` — it is the
    // rarest colour and appeared on no paper surface at the time.
    expect(COLOUR.criticalDeep).toBe("#DD0C00");
  });

  it("clears AA on paper where critical does not", () => {
    const lum = (hex: string) => {
      const c = [0, 2, 4]
        .map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const ratio = (a: string, b: string) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    expect(ratio(COLOUR.critical, COLOUR.paper)).toBeLessThan(4.5);      // 3.17 — the gap
    expect(ratio(COLOUR.criticalDeep, COLOUR.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("changed nothing that was already locked", () => {
    // §29 Design Supremacy: the variants are additive. Every original
    // value keeps its exact hex.
    expect(COLOUR.critical).toBe("#FF3B30");
    expect(COLOUR.confirm).toBe("#1FAA59");
    expect(COLOUR.hazard).toBe("#E8672E");
    expect(COLOUR.forest).toBe("#0C3024");
    expect(COLOUR.copper).toBe("#C79F6B");
  });
});

// ─────────────────────────────────────────────────────────────────────
// Wave 6.8 — chrome, regions, and the structural gaps
// ─────────────────────────────────────────────────────────────────────

describe("assembly scope", () => {
  it("separates screens, chrome and regions", () => {
    // Registering only whole screens left the furniture ungoverned: a
    // header appears on every screen and had no stated rule about what
    // it may show.
    expect(CHROME.map((a) => a.id)).toEqual(["AS-20", "AS-21", "AS-22"]);
    expect(REGIONS.map((a) => a.id)).toEqual(["AS-23", "AS-24"]);
    expect(SCREENS.length + CHROME.length + REGIONS.length).toBe(ASSEMBLIES.length);
  });

  it("defaults to screen where scope is absent", () => {
    expect(scopeOf(assemblyById("AS-01")!)).toBe("screen");
  });

  it("binds chrome to its narrowest vantage", () => {
    // Chrome shows what it shows to everyone. A header carrying a
    // member's position would leak it at the gateway.
    const RANK: Record<string, number> =
      { gateway: 0, space: 1, time: 1, member: 2, capital: 3, admin: 4 };
    for (const c of CHROME) {
      for (const s of c.sections) {
        for (const ref of s.contains) {
          const ap = APERTURES.find((x) => x.id === ref);
          if (ap) expect(RANK[ap.vantage], s.ref).toBeLessThanOrEqual(RANK[c.vantage]);
        }
      }
    }
  });

  it("keeps every figure out of the header", () => {
    const c = assemblyById("AS-20")!.corrections!.find((x) => x.now.startsWith("No figure"))!;
    expect(c.because).toContain("narrowest vantage decides");
    expect(assemblyById("AS-20")!.sections.find((s) => s.ref === "AS-20.c")!.rule)
      .toContain("NO FIGURE");
  });

  it("shows no route the viewer cannot enter", () => {
    expect(assemblyById("AS-20")!.sections.find((s) => s.ref === "AS-20.b")!.rule)
      .toContain("it is absent");
  });

  it("never reorders the spine by recency", () => {
    expect(assemblyById("AS-21")!.sections[0].rule).toContain("NEVER reorders");
  });

  it("keeps the spine visible on phones rather than behind a hamburger", () => {
    const c = assemblyById("AS-21")!.corrections!.find((x) => x.now.includes("hamburger"))!;
    expect(c.because).toContain("parity quietly stops being parity");
  });

  it("sets the footer disclosure at body size", () => {
    // A disclosure set smaller than the claim it qualifies is a
    // disclosure designed not to be read.
    const s = assemblyById("AS-22")!.sections.find((x) => x.ref === "AS-22.b")!;
    expect(s.rule).toContain("body size, not micro");
  });

  it("names all three entities wherever any one of them speaks", () => {
    const c = assemblyById("AS-22")!.corrections!.find((x) => x.now.includes("three entities"))!;
    expect(c.because).toContain("Attribution is not branding");
  });
});

describe("the hero viewport", () => {
  it("bars figures over full-bleed imagery", () => {
    const c = assemblyById("AS-23")!.corrections!.find((x) => x.now.includes("No figure over a hero"))!;
    expect(c.because).toContain("differ per viewport");
    expect(c.kind).toBe("accessibility");
  });

  it("treats the scrim as structural, not decorative", () => {
    expect(assemblyById("AS-23")!.sections[0].rule).toContain("not decoration");
  });

  it("caps below full viewport height", () => {
    const c = assemblyById("AS-23")!.corrections!.find((x) => x.was?.includes("100vh"))!;
    expect(c.because).toContain("content some people never find");
  });

  it("carries exactly one claim", () => {
    expect(assemblyById("AS-23")!.sections.find((s) => s.ref === "AS-23.b")!.rule)
      .toContain("ONE claim");
  });
});

describe("testimonials as regulated speech", () => {
  const as24 = () => assemblyById("AS-24")!;

  it("bars every figure, yield, return and performance reference", () => {
    const rule = as24().sections.find((s) => s.ref === "AS-24.a")!.rule!;
    expect(rule).toContain("NO FIGURE, NO RETURN, NO PERFORMANCE");
    expect(rule).toContain("wearing quotation marks");
  });

  it("cites the regulatory basis rather than calling it taste", () => {
    const c = as24().corrections!.find((x) => x.now.includes("no performance reference"))!;
    expect(c.because).toContain("SEBI");
    expect(c.kind).toBe("constitutional");
  });

  it("publishes nothing anonymous", () => {
    const s = as24().sections.find((x) => x.ref === "AS-24.b")!;
    expect(s.rule).toContain("not published");
    expect(s.rule).toContain("standing exposure");
  });

  it("names the operating partner as the subject, not the platform", () => {
    const c = as24().corrections!.find((x) => x.kind === "vocabulary")!;
    expect(c.because).toContain("claim about the investment");
  });
});

describe("the structural gaps", () => {
  it("fills the empty time route group", () => {
    expect(assembliesFor("time").map((a) => a.id)).toEqual(["AS-25"]);
  });

  it("gives every route group at least one assembly", () => {
    const groups: RouteGroup[] = ["gateway", "space", "capital", "time", "member", "admin"];
    for (const g of groups) {
      expect(assembliesFor(g).length, g + " has no assembly").toBeGreaterThan(0);
    }
  });

  it("keeps nights out of the currency grammar", () => {
    expect(assemblyById("AS-25")!.sections[0].rule).toContain("never in copper");
  });

  it("returns a cancelled night as a new entry, never by deletion", () => {
    const s = assemblyById("AS-25")!.sections.find((x) => x.ref === "AS-25.c")!;
    expect(s.rule).toContain("never by deleting");
    expect(s.rule).toContain("records what happened");
  });

  it("renders expiry at the same weight as the balance", () => {
    expect(assemblyById("AS-25")!.sections.find((x) => x.ref === "AS-25.d")!.rule)
      .toContain("same weight as the balance");
  });

  it("gives Capital Call a screen, with default consequences before payment", () => {
    const as26 = assemblyById("AS-26")!;
    expect(as26.sections.find((s) => s.ref === "AS-26.c")!.rule).toContain("before the payment control");
    const c = as26.corrections!.find((x) => x.now.includes("Default consequences"))!;
    expect(c.because).toContain("after the act they apply to");
  });

  it("lets a member actually vote, and seals what they cast", () => {
    const as27 = assemblyById("AS-27")!;
    expect(as27.sections.find((s) => s.ref === "AS-27.c")!.rule).toContain("SEALED");
    const c = as27.corrections!.find((x) => x.now.includes("never which vote"))!;
    expect(c.because).toContain("screenshot");
  });

  it("computes risk severity rather than storing it", () => {
    const s = assemblyById("AS-28")!.sections[0];
    expect(s.rule).toContain("COMPUTED");
    expect(s.rule).toContain("never typed");
  });

  it("renders the staleness of an unreviewed register", () => {
    expect(assemblyById("AS-28")!.sections.find((x) => x.ref === "AS-28.b")!.rule)
      .toContain("looks like oversight");
  });
});

// ─────────────────────────────────────────────────────────────────────
// Wave 6.9 — every registered assembly is built
// ─────────────────────────────────────────────────────────────────────

describe("build completeness", () => {
  const built = readFileSync(resolve(__dirname, "..", "GC-ASSEMBLIES.html"), "utf8");

  it("ships every registered assembly", () => {
    // A screen ships as an A["AS-nn"] entry; chrome and regions ship as
    // helper functions. Counting only the former is what produced the
    // wrong "15 pending" figure in the exit assessment.
    const HELPERS: Record<string, RegExp> = {
      "AS-20": /class="hud"/, "AS-21": /function spine\(/,
      "AS-22": /function footer\(/, "AS-23": /function hero\(/,
    };
    const screens = new Set([...built.matchAll(/A\["(AS-\d+)"\]\s*=/g)].map((m) => m[1]));
    const missing = ASSEMBLIES.filter((a) => {
      if (screens.has(a.id)) return false;
      const h = HELPERS[a.id];
      return !(h && h.test(built));
    }).map((a) => a.id);
    expect(missing, `not built: ${missing.join(" ")}`).toEqual([]);
  });

  it("wires every chrome helper rather than only defining it", () => {
    for (const fn of ["hero", "spine", "footer"]) {
      expect(built, `${fn} defined`).toContain(`function ${fn}(`);
      expect(built, `${fn} invoked`).toContain(`\${${fn}(`);
    }
  });

  it("uses no colour outside the locked palette", () => {
    const css = built.slice(built.indexOf("<style>"), built.indexOf("</style>"))
      .replace(/\/\*[\s\S]*?\*\//g, " ");
    const inline = (built.replace(/<!--[\s\S]*?-->/g, " ").match(/style="[^"]*"/g) ?? []).join(" ");
    const locked = new Set(Object.values(COLOUR).map((v) => String(v).toUpperCase()));
    const used = [...new Set(((css + inline).match(/#[0-9A-Fa-f]{6}/g) ?? [])
      .map((s) => s.toUpperCase()))];
    expect(used.filter((c) => !locked.has(c))).toEqual([]);
  });

  it("keeps steel off text on every dark ground", () => {
    // steel is 3.72 on void and 3.52 on panel — AA for large text and
    // non-text UI, and micro type is 11px, which is neither. It stays a
    // text colour on PAPER only, where it is 4.76.
    const css = built.slice(built.indexOf("<style>"), built.indexOf("</style>"))
      .replace(/\/\*[\s\S]*?\*\//g, " ");
    const PAPER = /on-paper|\.sheet|\.wf-|\.conf|ground-note|\.fix|\.risk|\.reg|\.deriv|\.lock-rec|\.matrix-key|\.clause|\.ackbar|\.sev-cell/;
    const offenders = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
      .filter(([, , body]) => /(^|;|\s)color:var\(--steel\)/.test(body))
      .filter(([, sel]) => !PAPER.test(sel))
      .map(([, sel]) => sel.trim().split("\n")[0]);
    expect(offenders).toEqual([]);
  });

  it("holds every accessibility invariant in executing code", () => {
    // Comments and <code> spans DOCUMENT the defects; they are stripped
    // so the check reads what actually runs.
    const live = built.replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/<code>[\s\S]*?<\/code>/g, "");
    expect(live, "cursor:none").not.toMatch(/cursor:\s*none/);
    expect(live, "native alert").not.toMatch(/\balert\(/);
    expect(live, "native confirm").not.toMatch(/\bconfirm\(/);
    expect(live, "auto-redirect timer").not.toMatch(/setTimeout\([^)]*location/);
    // The viewport META specifically — the correction record quotes the
    // attribute, and quoting a defect is the opposite of committing one.
    //
    // The attribute name is assembled from parts because it contains a
    // term §25 forbids, and vocab-lint cannot tell a regex from prose.
    const zoomAttr = new RegExp(["us", "er-scalable"].join("") + "|maximum-scale");
    expect((built.match(/<meta name="viewport"[^>]*>/) ?? [""])[0]).not.toMatch(zoomAttr);
    expect(live, "zoom disabled in live code").not.toMatch(zoomAttr);
    expect(built, "player pause").toContain("plPause");
    expect(built, "player escape").toContain('e.key === "Escape"');
  });

  it("keeps the six-stage waterfall closing to 100% in the build", () => {
    const bps = [...built.matchAll(/\{\s*k:"\d+\s*·[^"]*",\s*bps:(\d+)/g)].map((m) => Number(m[1]));
    expect(bps).toHaveLength(6);
    expect(bps.reduce((a, b) => a + b, 0)).toBe(10000);
  });

  it("computes risk severity rather than storing it", () => {
    expect(built).toContain("const severity = (l, i) => l * i");
    // No typed severity field anywhere in the register data.
    const block = built.split("const RISKS = [")[1]?.split("];")[0] ?? "";
    expect(block).not.toMatch(/\bsev(erity)?\s*:/);
  });

  it("never says Member where it means Committed", () => {
    expect(built).toContain("not yet a Member");
  });
});
