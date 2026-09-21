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
  CHAPTERS, NUMBERED, chapterById, chapterHref, nextChapter,
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

  it("numbers the argument 00 to 08, and leaves Progress out of it", () => {
    expect(NUMBERED.map((c) => c.n)).toEqual(["00", "01", "02", "03", "04", "05", "06", "07", "08"]);
    expect(chapterById("progress").n).toBeNull();
  });

  it("puts Risk before Enquire, which is the whole point of the order", () => {
    const ids = CHAPTERS.map((c) => c.id);
    expect(ids.indexOf("risk")).toBeLessThan(ids.indexOf("enquire"));
    expect(ids.indexOf("place")).toBeLessThan(ids.indexOf("idea"));
    expect(ids.indexOf("idea")).toBeLessThan(ids.indexOf("investment"));
  });

  it("builds one href per property, and stops at the end rather than wrapping", () => {
    expect(chapterHref("wildwood", chapterById("risk"))).toBe("/collection/wildwood/risk");
    expect(chapterHref("wildwood", chapterById("opportunity"))).toBe("/collection/wildwood");
    expect(nextChapter("enquire")).toBeNull();
    expect(nextChapter("opportunity")!.id).toBe("place");
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

  it("differs between properties — it is not one page at nine URLs", () => {
    const creek = chapterContent(vehicleByKey("coorgcreek")!, "place");
    const wld = chapterContent(vehicleByKey("wildwood")!, "place");
    expect(creek.lead).not.toBe(wld.lead);

    const v = vehicleByKey("coorgcreek")!;
    expect(chapterContent(v, "place").lead).not.toBe(chapterContent(v, "asset").lead);
    expect(chapterContent(v, "risk").title).not.toBe(chapterContent(v, "idea").title);
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

  it("still gives a gated vehicle its Place, Life and Asset", () => {
    const wld = vehicleByKey("wildwood")!;
    for (const id of ["place", "life", "asset"] as const) {
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
