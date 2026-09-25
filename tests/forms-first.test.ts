/**
 * A page whose job is a form shows the form without a scroll. 25 Sep 2026.
 * (app/_assemblies/site/render.ts TXT.) The order is the contract: the
 * heading, then the form, then the facts, so that on a narrow screen,
 * where the grid stacks in source order, the form comes straight after the
 * heading.
 */
import { describe, it, expect } from "vitest";
import { TXT } from "../app/_assemblies/site/render";
import { PAGES } from "../content/site/pages";
import type { SitePage } from "../app/_assemblies/site/types";

const at = (h: string, s: string) => h.indexOf(s);

describe("a form page", () => {
  const contact = TXT(Object.values(PAGES).find((p) => p.path === "/contact") as SitePage);
  it("puts the heading, the form and the facts in one section, in that order", () => {
    expect(contact.startsWith('<section class="tx-split lt">')).toBe(true);
    expect(at(contact, "tx-split-head")).toBeLessThan(at(contact, "tx-formcard"));
    expect(at(contact, "tx-formcard")).toBeLessThan(at(contact, "tx-split-facts"));
  });
  it("keeps the facts; nothing is dropped to fit the form", () => expect(contact).toContain("It does not create"));
  it("leaves a page with no form as it was", () => {
    const plain: SitePage = { key: "x", path: "/x", eyebrow: "E", title: "T", blocks: [{ p: "Words." }] };
    const h = TXT(plain);
    expect(h.startsWith('<section class="tx-hero">')).toBe(true);
    expect(h).not.toContain("tx-split");
  });
  it("carries a heading that introduces a form into the card with it", () => {
    const withHead: SitePage = { key: "y", path: "/y", eyebrow: "E", title: "T", blocks: [{ rows: [["a", "b"]] }, { h: "Hold a unit" }, { form: { id: "f", addr: "a@b.co", fields: [["Email", "email"]], submit: "Send", ok: "ok", note: "n" } as never }] };
    const h = TXT(withHead);
    expect(at(h, "Hold a unit")).toBeGreaterThan(at(h, "tx-formcard"));
    expect(at(h, "Hold a unit")).toBeLessThan(at(h, "tx-split-facts"));
  });
});
