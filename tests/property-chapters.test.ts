/**
 * The eight chapters, and the navigation between them.
 *
 * Written 21 Sep 2026. Ten per-property routes existed and led nowhere:
 * /idea, /asset and /ownership each rendered the whole property page, so
 * three URLs showed one page, and /place, /life and /progress rendered the
 * registry scaffold. These assert that the declared IA and the thing a
 * reader can walk are the same IA.
 */
import { describe, it, expect } from "vitest";
import {
  CHAPTERS, MAX_TABS, chapterById, chapterHref, nextChapter,
} from "../constants/property-chapters";
import { ROUTES } from "../constants/routes";
import { VEHICLES, publishable, vehicleByKey } from "../constants/vehicles";
import { chapterContent } from "../app/_assemblies/propertychapter";

describe("the chapters are the route table", () => {
  it("names a route that exists, for every chapter", () => {
    const byIa = new Map(ROUTES.map((r) => [r.ia, r]));
    for (const c of CHAPTERS) {
      const route = byIa.get(c.ia);
      expect(route, `${c.id} names ${c.ia}`).toBeDefined();
      expect(route!.path).toBe(`/collection/[vehicle]${c.suffix}`);
    }
  });

  it("is four chapters, under the five-tab ceiling", () => {
    // Ten until 21 Sep 2026. Six repeated /collection/[vehicle] under other
    // names and were retired; what is left is the property and the three
    // surfaces that are NOT on it.
    expect(CHAPTERS).toHaveLength(4);
    expect(CHAPTERS.length).toBeLessThanOrEqual(MAX_TABS);
    expect(CHAPTERS.map((c) => c.n)).toEqual(["00", "01", "02", "03"]);
  });

  it("puts Risk before Enquire, which is the whole point of the order", () => {
    const ids = CHAPTERS.map((c) => c.id);
    expect(ids.indexOf("risk")).toBeLessThan(ids.indexOf("enquire"));
    expect(ids.indexOf("opportunity")).toBeLessThan(ids.indexOf("investment"));
    expect(ids.indexOf("investment")).toBeLessThan(ids.indexOf("risk"));
  });

  it("builds one href per property, and stops at the end rather than wrapping", () => {
    expect(chapterHref("wildwood", chapterById("risk"))).toBe("/collection/wildwood/risk");
    expect(chapterHref("wildwood", chapterById("opportunity"))).toBe("/collection/wildwood");
    expect(nextChapter("enquire")).toBeNull();
    expect(nextChapter("opportunity")!.id).toBe("investment");
  });
});

describe("every chapter says something real about every property", () => {
  it("renders content for all four vehicles, with no empty rows", () => {
    for (const v of VEHICLES) {
      for (const c of CHAPTERS) {
        const content = chapterContent(v, c.id);
        expect(content.title.length, `${v.key}/${c.id}`).toBeGreaterThan(0);
        expect(content.lead.length).toBeGreaterThan(0);
        expect(content.rows.length).toBeGreaterThan(0);
        for (const r of content.rows) {
          expect(r.value.length, `${v.key}/${c.id}/${r.label}`).toBeGreaterThan(0);
          expect(r.basis.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("differs between properties, and between chapters", () => {
    const creek = vehicleByKey("coorgcreek")!;
    const wld = vehicleByKey("wildwood")!;
    expect(chapterContent(creek, "opportunity").lead)
      .not.toBe(chapterContent(wld, "opportunity").lead);
    expect(chapterContent(creek, "risk").title)
      .not.toBe(chapterContent(creek, "investment").title);
  });
});

describe("the public gate still governs the figures", () => {
  it("withholds the economics from a vehicle whose record is unsettled", () => {
    for (const key of ["solace", "wildwood"] as const) {
      const v = vehicleByKey(key)!;
      expect(publishable(v).ok).toBe(false);
      const investment = chapterContent(v, "investment");
      expect(investment.withheld.length).toBeGreaterThan(0);
      expect(investment.title).toContain("not published");
    }
  });

  it("shows them for a vehicle that passes, and names the basis of the yield", () => {
    const creek = vehicleByKey("coorgcreek")!;
    const investment = chapterContent(creek, "investment");
    expect(investment.withheld).toHaveLength(0);
    expect(investment.lead).toContain("forecast");
    expect(JSON.stringify(investment)).toContain("FORECAST");
  });

  it("still gives a gated vehicle its property page and its way in", () => {
    const wld = vehicleByKey("wildwood")!;
    for (const id of ["opportunity", "enquire"] as const) {
      expect(chapterContent(wld, id).withheld).toHaveLength(0);
      expect(chapterContent(wld, id).rows.length).toBeGreaterThan(2);
    }
  });
});

describe("no property in the register is a 404, and none publishes a figure the gate refuses", () => {
  it("serves an opening chapter for every vehicle, authored page or not", async () => {
    const { PROPERTY_PAGES } = await import("../constants/property-page");
    const authored = new Set(PROPERTY_PAGES.map((p) => p.vehicle));
    // Wildwood joined the register without authored copy. That is not a 404:
    // /collection/wildwood used to 404 while /collection/wildwood/place rendered,
    // and the chapter nav pointed every Wildwood chapter at the dead one.
    expect(authored.has("wildwood" as never)).toBe(false);
    for (const v of VEHICLES) {
      expect(chapterContent(v, "opportunity").rows.length).toBeGreaterThan(0);
    }
  });

  it("publishes no yield for a vehicle that fails publishable()", async () => {
    const { PROPERTIES } = await import("../app/_assemblies/data");
    for (const p of PROPERTIES) {
      const v = VEHICLES.find((x) => x.assetCode === p.assetId)!;
      if (publishable(v).ok) continue;
      // The card was about to read "PARTNER YIELD ~46.3%" for Wildwood,
      // whose own financial model says "Do not close equity".
      expect(p.yield.conf, `${v.key} yield confidence`).toBe("UNKNOWN");
      expect(p.availability, `${v.key} availability`).not.toContain("available");
    }
  });

  it("never offers units on a vehicle that is not open", async () => {
    const { PROPERTIES } = await import("../app/_assemblies/data");
    const { stanceFor } = await import("../constants/vehicles");
    for (const p of PROPERTIES) {
      const v = VEHICLES.find((x) => x.assetCode === p.assetId)!;
      if (stanceFor(v).kind === "open") continue;
      expect(p.availability).not.toMatch(/\d+ of \d+ units available/);
    }
  });
});

/**
 * No more than five tabs — founder instruction, 21 Sep 2026.
 *
 * Ten chapter tabs and seven spine anchors sat in two rows at the top of
 * every property page. Compressing them is easy to do wrongly: drop a
 * chapter from the bar and it is orphaned; group them out of order and the
 * argument is quietly rearranged; fold Risk into "The Investment" and a
 * reader is asked for something before they have met how it loses money.
 * These pin the three things that must survive the compression.
 */
describe("the ceiling is met by there being less, not by grouping", () => {
  it("shows four tabs, under the five the instruction allows", () => {
    /* It was met once by grouping ten chapters into five parts, each
       showing the span it covered — "00–02 Opportunity". That worked and
       solved the wrong problem: the tabs were crowded because six chapters
       repeated the property page, and grouping hid that instead of
       removing it. */
    expect(CHAPTERS.length).toBeLessThanOrEqual(MAX_TABS);
    expect(CHAPTERS.map((c) => c.label)).toEqual([
      "The Property", "The Investment", "Risk", "Enquire",
    ]);
  });

  it("keeps Risk its own tab, before Enquire", () => {
    const ids = CHAPTERS.map((c) => c.id);
    expect(ids).toContain("risk");
    expect(ids.indexOf("risk")).toBeLessThan(ids.indexOf("enquire"));
  });

  it("gives every tab a destination a reader cannot already be on", () => {
    // The whole reason six went: they were a second telling of the first.
    const suffixes = CHAPTERS.map((c) => c.suffix);
    expect(new Set(suffixes).size).toBe(suffixes.length);
    expect(suffixes).toEqual(["", "/investment", "/risk", "/enquire"]);
  });
});
