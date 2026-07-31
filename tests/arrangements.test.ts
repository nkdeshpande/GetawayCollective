/**
 * THE FOUR PANE ARRANGEMENTS
 *
 * Wave 8 · adapted from the signed-off references
 *
 * Each of the four was taken from a reference file that did something
 * with it that must not survive. These hold the part that must not come
 * back — not the layout, which is free to change, but the claim each
 * arrangement was making.
 */

import { describe, it, expect } from "vitest";
import { PUBLIC_PAGES, pageByPath, type Plate } from "../content/public";
import { ALLOCATION, MIN_UNIT, DEPOSIT } from "../app/_assemblies/slowspace";
import { inr } from "../app/_assemblies/data";

const panes = PUBLIC_PAGES.flatMap((p) => p.panes.map((pane) => ({ page: p.id, pane })));
const allPlates: Plate[] = panes.flatMap((x) => [...(x.pane.plates ?? [])]);
const allRows = panes.flatMap((x) => [...(x.pane.ledger ?? [])]);
const allQs = panes.flatMap((x) => [...(x.pane.faq ?? [])]);

describe("the ledger — the_syndicate.html", () => {
  it("carries no holder for a vacant function", () => {
    // The source named Khaitan & Co, Khosla Associates and CBRE India
    // against roles with no evidenced engagement. A name beside a role
    // IS the claim; the role alone is not.
    for (const r of allRows) {
      if (r.state !== "Vacant") continue;
      expect(r.holder, r.ref).toBeUndefined();
      expect(r.since, r.ref).toBeUndefined();
    }
  });

  it("dates every engagement it does claim", () => {
    for (const r of allRows) {
      if (r.state === "Vacant") continue;
      expect(r.holder, r.ref).toBeTruthy();
      expect(r.since, r.ref).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("gives every row a unique, quotable reference", () => {
    const refs = allRows.map((r) => r.ref);
    expect(new Set(refs).size).toBe(refs.length);
    for (const ref of refs) expect(ref).toMatch(/^[A-Z0-9]+-[A-Z0-9]+-?[A-Z0-9]*$/);
  });

  it("states no engagement anywhere as verified by an act on the page", () => {
    // The source printed "VERIFIED // 0x…" from Math.random() after a
    // 1.2-second delay. There is no state in the vocabulary that can be
    // reached by pressing anything, and this is what stops one appearing.
    const LEGAL = new Set(["Vacant", "Recorded", "In appointment", "Under contract"]);
    for (const r of allRows) expect(LEGAL.has(r.state), `${r.ref}: ${r.state}`).toBe(true);
  });
});

describe("the plates — MediaKit.html", () => {
  it("claims no photograph while nothing is built", () => {
    /*
     * The source rendered three stock images as DRIFT_EXTERIOR_01.RAW at
     * 45MB and 8K, which asserts a photographic record of a property. The
     * asset is at pre-construction. When the first real photograph is
     * taken this test is what has to be revisited — deliberately, by
     * someone who knows the file exists.
     */
    for (const pl of allPlates) {
      expect(pl.kind, `${pl.id} claims to be a photograph`).not.toBe("Photograph");
      expect(pl.kind, `${pl.id} claims to be a render`).not.toBe("Render");
    }
  });

  it("gives every plate a specification, not just a name", () => {
    for (const pl of allPlates) {
      expect(pl.spec, pl.id).toBeTruthy();
      expect(pl.what, pl.id).toBeTruthy();
      expect(pl.id).toMatch(/\//);           // namespaced, so two pages cannot collide
    }
  });

  it("says what an absent plate is waiting for", () => {
    for (const pl of allPlates) {
      if (pl.kind !== "Not yet made") continue;
      // A missing asset with no stated reason reads as an oversight.
      expect(pl.spec.length, pl.id).toBeGreaterThan(20);
    }
  });
});

describe("the questions — how_it_works.html", () => {
  it("gives every question its own answer", () => {
    // The source generated ten questions and gave all ten the SAME
    // paragraph: the specifics are in the prospectus. Ten questions
    // resolving to "it is written down elsewhere" is a page that looks
    // like it answers things.
    expect(allQs.length).toBeGreaterThan(0);
    const answers = allQs.map((q) => q.a);
    expect(new Set(answers).size).toBe(answers.length);
  });

  it("answers at length, and asks each question once", () => {
    const qs = allQs.map((q) => q.q);
    expect(new Set(qs).size).toBe(qs.length);
    for (const q of allQs) {
      expect(q.q.endsWith("?"), q.q).toBe(true);
      expect(q.a.length, q.q).toBeGreaterThan(80);
      expect(q.a, q.q).not.toMatch(/prospectus/i);
    }
  });
});

describe("the sequence — how_it_works.html", () => {
  it("numbers every step uniquely and in order", () => {
    for (const { page, pane } of panes) {
      if (!pane.sequence) continue;
      const ns = pane.sequence.map((s) => s.n);
      expect(new Set(ns).size, page).toBe(ns.length);
      expect(ns, page).toEqual([...ns].sort());
      for (const n of ns) expect(n).toMatch(/^\d{2}$/);
    }
  });

  it("ends where the Member Law fires, not on a mood", () => {
    /*
     * The source's five steps were Discover / Understand / Become a
     * Member / Reserve / Live. The moment a person actually becomes a
     * partner was buried third of five, and the last step was not an
     * event at all. The last step here is settlement, because settlement
     * is the last thing that happens and it is irreversible.
     */
    const hiw = pageByPath("/how-it-works")!;
    const seq = hiw.panes.find((p) => p.sequence)?.sequence;
    expect(seq).toBeDefined();
    const last = seq![seq!.length - 1];
    expect(last.t).toBe("Settlement");
    expect(last.d).toContain("irreversible");
    expect(last.d).toContain("not on the commitment");
  });
});

describe("the public copy against the instrument", () => {
  /*
   * These pages state figures in prose because prose is what they are.
   * That means the prose can drift from slowspace.ts silently, and the
   * first symptom would be a public page quoting a minimum that is no
   * longer the minimum. Checked here rather than trusted.
   */
  const publicProse = PUBLIC_PAGES
    .flatMap((p) => p.panes)
    .flatMap((p) => [
      p.title, p.lede ?? "", ...(p.body ?? []), p.note ?? "",
      ...(p.list ?? []).map((l) => `${l.k} ${l.v}`),
      ...(p.faq ?? []).map((q) => `${q.q} ${q.a}`),
      ...(p.sequence ?? []).map((s) => `${s.t} ${s.d}`),
    ])
    .join(" · ");

  it("quotes the minimum unit as the instrument defines it", () => {
    const minPct = (ALLOCATION.minBps / 100).toFixed(0) + "%";
    expect(publicProse).toContain(`${minPct} is the minimum`);
    expect(publicProse).toContain(inr(MIN_UNIT));
  });

  it("quotes the ceiling and the reason for it", () => {
    expect(publicProse).toContain((ALLOCATION.maxBps / 100).toFixed(0) + "%");
    expect(publicProse).toMatch(/carry every one of them alone|carries every ordinary/i);
  });

  it("quotes the deposit as flat, at the amount actually taken", () => {
    expect(publicProse).toContain(inr(DEPOSIT.amount));
    expect(publicProse).toMatch(/flat .{0,3}50,000|It is a flat/);
  });

  it("no longer says ten units are the equity layer", () => {
    // It said exactly that, and it was true until the minimum unit
    // became 5%. Twenty is the number now, and a page still saying ten
    // would be quoting a superseded instrument.
    expect(publicProse).not.toMatch(/[Tt]en units are the whole equity layer/);
    expect(publicProse).toMatch(/[Tt]wenty units are the whole equity layer/);
  });
});
