/**
 * ESTATE ADDRESSES — constants/estate-urls.ts, 16 Oct 2026
 *
 * The public address changes; the record key does not. These pin both
 * directions and that only the public surfaces move.
 */
import { describe, it, expect } from "vitest";
import { ESTATE_REDIRECTS, ESTATE_REWRITES, PUBLIC_SLUG, toInternal, toPublic } from "../constants/estate-urls";
import { VEHICLES } from "../constants/vehicles";

describe("estate addresses", () => {
  it("rename only keys that are real vehicles", () => {
    for (const key of Object.keys(PUBLIC_SLUG)) expect(VEHICLES.some((v) => v.slug === key), key).toBe(true);
  });
  it("turn a key into the address in paths and in HTML, and back", () => {
    expect(toPublic('<a href="/collection/coorg-coffee-creek/investment">')).toBe('<a href="/collection/streamside-creek/investment">');
    expect(toPublic("/reserve/slowspace-coastal")).toBe("/reserve/seaside-confluence");
    expect(toInternal("/collection/solace/risk")).toBe("/collection/slowspace-solace/risk");
  });
  it("leave a partner's pages, the Office and partial matches alone", () => {
    expect(toPublic("/portfolio/coorg-coffee-creek")).toBe("/portfolio/coorg-coffee-creek");
    expect(toPublic("/office/collection/slowspace-coastal")).toBe("/office/collection/slowspace-coastal");
    expect(toPublic("/collection/slowspace-coastal-two")).toBe("/collection/slowspace-coastal-two");
  });
  it("redirect every old address permanently and serve every new one", () => {
    expect(ESTATE_REDIRECTS).toContainEqual({ source: "/collection/coorg-coffee-creek/:rest*", destination: "/collection/streamside-creek/:rest*", permanent: true });
    expect(ESTATE_REWRITES).toContainEqual({ source: "/reserve/seaside-confluence", destination: "/reserve/slowspace-coastal" });
    expect(ESTATE_REDIRECTS).toHaveLength(Object.keys(PUBLIC_SLUG).length * 4);
  });
});
