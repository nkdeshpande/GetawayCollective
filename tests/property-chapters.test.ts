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
  PARTS, MAX_TABS, partOf, partHead, partSpan,
} from "../constants/property-chapters";
import { SPINE, SPINE_TABS } from "../constants/property-page";
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
describe("the tabs are five parts, and the argument did not move", () => {
  it("shows no more than five tabs, in either row", () => {
    expect(MAX_TABS).toBe(5);
    expect(PARTS.length).toBeLessThanOrEqual(MAX_TABS);
    expect(SPINE_TABS.length).toBeLessThanOrEqual(MAX_TABS);
  });

  it("holds every chapter exactly once, as contiguous runs in chapter order", () => {
    expect(PARTS.flatMap((p) => p.chapters)).toEqual(CHAPTERS.map((c) => c.id));
  });

  it("names a part by its first chapter, and invents no label", () => {
    const labels = new Set(CHAPTERS.map((c) => c.label));
    for (const p of PARTS) {
      expect(partHead(p).id).toBe(p.chapters[0]);
      expect(labels.has(partHead(p).label)).toBe(true);
    }
    expect(partSpan(partOf("life"))).toBe("00–02");
    expect(partSpan(partOf("investment"))).toBe("06");
  });

  it("keeps Risk a tab of its own, before Enquire", () => {
    expect(partHead(partOf("risk")).id).toBe("risk");
    const heads = PARTS.map((p) => partHead(p).id);
    expect(heads.indexOf("risk")).toBeLessThan(heads.indexOf("enquire"));
  });

  it("still reaches all ten chapters by walking onward from the first", () => {
    const seen: string[] = ["opportunity"];
    let next = nextChapter("opportunity");
    while (next) { seen.push(next.id); next = nextChapter(next.id); }
    expect(seen).toEqual(CHAPTERS.map((c) => c.id));
  });

  it("offers spine tabs that are real sections, in page order", () => {
    const order = SPINE.map((s) => s.id);
    for (const id of SPINE_TABS) expect(order).toContain(id);
    const positions = SPINE_TABS.map((id) => order.indexOf(id));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });
});
