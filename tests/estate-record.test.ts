/**
 * ONE ESTATE, ONE NAME, ONE STATE — 28 Sep 2026
 *
 * The site called one estate Creek, SlowSpace Creek and Coorg Coffee Creek,
 * and another Confluence, Seaside Confluence and SlowSpace Coastal; a card
 * could read "IN DELIVERY · IN DELIVERY"; and every estate's unit was
 * described with one estate's ladder. The collection's names are the canon's
 * (_CANON/facts/properties.yaml), and every surface is held to them here.
 */

import { describe, expect, it } from "vitest";
import { VEHICLES, publishable, stanceFor } from "../constants/vehicles";
import { COLLECTION, HOME_STACK, NEXT_ESTATES } from "../content/site/home";
import { ESTATES } from "../content/site/estates";
import { PAGES } from "../content/site/pages";
import { heldBy, publicName, read, unitsByEstate } from "../app/_assemblies/site/registry";

const plain = (s: string) => s.replace(/<[^>]+>/g, "").trim();
const NAMES = COLLECTION.map((c) => plain(c.name));
const slugOf = (href: string) => href.replace("/collection/", "");

describe("one name for each estate", () => {
  it("names every estate page as the collection does", () => {
    for (const e of Object.values(ESTATES)) {
      const c = COLLECTION.find((x) => slugOf(x.href) === e.slug);
      expect(c, e.slug).toBeDefined();
      expect(plain(e.name), e.slug).toBe(plain(c!.name));
    }
  });
  it("uses the collection's names on the home page and for the estates still to come", () => {
    for (const s of HOME_STACK) expect(NAMES, s.name).toContain(s.name);
    for (const n of NEXT_ESTATES) expect(NAMES, n.name).toContain(n.name);
  });
  it("gives every vehicle its public name, never the intake's label", () => {
    for (const v of VEHICLES) expect(NAMES, v.key).toContain(publicName(v));
  });
  it("offers every estate by that name on the enquiry desk", () => {
    const form = PAGES.enquire.blocks.find((b) => b.form)?.form;
    const select = form?.fields.find((f) => f[1] === "select")?.[2] as readonly string[];
    for (const n of NAMES) expect(select, n).toContain(n);
  });
});

describe("where an estate stands, said once and without contradiction", () => {
  it("answers availability and delivery as two different questions", () => {
    for (const v of VEHICLES) {
      const R = read(v);
      expect(R.availability, v.key).not.toBe(R.delivery);
      expect(`${R.availability} · ${R.delivery}`.toUpperCase(), v.key).not.toMatch(/(.+) · \1/);
    }
  });
  it("offers the next step the brief assigns to each state", () => {
    for (const v of VEHICLES) {
      const R = read(v), o = v.offering;
      const want = v.lifecycle === "forming" ? "Explore the concept"
        : publishable(v).ok && o.available > 0 && v.lifecycle === "raising" ? "Explore the offering"
        : o.available <= 0 && o.subscribed > 0 && stanceFor(v).kind === "waitlist" ? "Join the waitlist"
        : "View estate progress";
      expect(R.action[0], v.key).toBe(want);
      expect(R.action[1].startsWith(`/collection/${v.slug}`), v.key).toBe(true);
    }
  });
  it("does not say a partnership holds an estate before it exists", () => {
    for (const v of VEHICLES) {
      const h = heldBy(v);
      if (v.llpin) expect(h.label, v.key).toBe("Held by");
      else expect(`${h.label} ${h.value}`, v.key).toMatch(/^To be held by .*not yet incorporated$/);
    }
  });
});

describe("a unit, estate by estate", () => {
  it("reads each estate's own unit, and the units make the whole", () => {
    const U = unitsByEstate();
    expect(U.length).toBeGreaterThan(0);
    for (const u of U) {
      expect(NAMES, u.name).toContain(u.name);
      expect(parseFloat(u.share) * u.units, u.name).toBeCloseTo(100, 0);
    }
  });
  it("no longer states one estate's ladder as every estate's", () => {
    const how = JSON.stringify(PAGES.how.blocks);
    expect(how).not.toMatch(/"5%",\s*"one unit/);
    expect(how).not.toMatch(/units make the whole equity layer/);
    expect(how).toContain('"units":true');
  });
});

describe("figures that are not settled are not stated as settled", () => {
  it("keeps the contested Solace site area out of the prose (conflict C-01)", () => {
    const solace = Object.values(ESTATES).find((e) => e.slug === "slowspace-solace")!;
    expect(solace.intro).not.toMatch(/six-tenths|0\.6 acre/);
    expect(COLLECTION.find((c) => c.vehicleKey === "solace")!.spec).not.toMatch(/acre/);
  });
  it("calls nights per unit an illustration wherever the site shows one", () => {
    const how = JSON.stringify(PAGES.how.blocks);
    expect(how).toMatch(/illustration/);
  });
});
