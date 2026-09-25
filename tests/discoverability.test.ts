/**
 * Search and security, asserted. 25 Sep 2026.
 *
 * Pins what the site now tells search engines (a title that names the
 * place, structured data only on the page that shows it, no system pages in
 * the sitemap), the content security policy, and the error alerts' rule
 * that nothing personal leaves in a report.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { pageGraph, geoOf } from "../app/_system/ld";
import { pageMeta, placeOf } from "../app/_system/meta";
import sitemap from "../app/sitemap";
import { contentSecurityPolicy } from "../lib/csp";
import { redact, shouldEmail, fingerprint } from "../lib/alerts";

const types = (path: string) => (pageGraph(path)["@graph"] as { "@type": string }[]).map((n) => n["@type"]);

describe("structured data describes the page it is on", () => {
  it("puts the answers only on /answers", () => {
    expect(types("/answers")).toContain("FAQPage");
    for (const p of ["/", "/contact", "/collection/coorg-coffee-creek", "/journal/two-waters"]) expect(types(p), p).not.toContain("FAQPage");
  });
  it("puts the glossary only on /glossary", () => {
    expect(types("/glossary")).toContain("DefinedTermSet");
    expect(types("/about")).not.toContain("DefinedTermSet");
  });
  it("gives an estate its own place, located, with a breadcrumb", () => {
    const g = pageGraph("/collection/coorg-coffee-creek")["@graph"] as Record<string, unknown>[];
    const place = g.find((n) => n["@type"] === "Place") as { name: string; geo?: { latitude: number } };
    expect(place.name).toBe("Creek");
    expect(place.geo?.latitude).toBeCloseTo(12.39, 1);
    expect(types("/collection/coorg-coffee-creek")).toContain("BreadcrumbList");
    expect(types("/collection/coorg-coffee-creek/risk")).toContain("Place");
  });
  it("gives a Journal entry its article, and the Journal its list", () => {
    expect(types("/journal/two-waters")).toContain("BlogPosting");
    expect(types("/journal")).toContain("Blog");
  });
  it("names the organisation everywhere and nothing else on an ordinary page", () => {
    expect(types("/contact")).toEqual(["Organization", "WebSite"]);
    expect(types("/no-such-page")).toEqual(["Organization", "WebSite"]);
  });
  it("reads decimal and degree-minute-second coordinates, and refuses anything else", () => {
    expect(geoOf("12.385716°N 75.836097°E")).toEqual({ latitude: 12.385716, longitude: 75.836097 });
    expect(geoOf(`13°24'40.5"N 77°49'26.9"E`)?.latitude).toBeCloseTo(13.4113, 3);
    expect(geoOf("somewhere near the river")).toBeNull();
  });
});

describe("titles name the place", () => {
  it("leads the home page with the brand and what it is", () =>
    expect(pageMeta("/", {}, "x").title).toBe("Getaway Collective · Collective ownership of retreats in India"));
  it("says where an estate is, in the names people search", () => {
    expect(pageMeta("/collection/[vehicle]", { vehicle: "coorg-coffee-creek" }, "x").title).toBe("Creek · Kodagu (Coorg), Karnataka · Getaway Collective");
    expect(pageMeta("/collection/[vehicle]", { vehicle: "slowspace-coastal" }, "x").title).toBe("Confluence · Udupi coast, Karnataka · Getaway Collective");
  });
  it("does not double a name already given", () => expect(placeOf("Getaway Collective · Suntikoppa, Coorg", undefined)).toBe("Suntikoppa, Coorg"));
  it("keeps a noindex page out of search but gives it a canonical", () => {
    const m = pageMeta("/sign-in", {}, "Sign In · Getaway Collective", false);
    expect(m.robots).toEqual({ index: false, follow: true });
    expect(m.alternates?.canonical).toBe("/sign-in");
  });
});

describe("the sitemap lists pages worth arriving at", () => {
  const urls = sitemap().map((e) => new URL(e.url).pathname || "/");
  it("leaves out sign-in, status and the error states", () => {
    for (const p of ["/sign-in", "/verify", "/status", "/403", "/404", "/500"]) expect(urls, p).not.toContain(p);
  });
  it("keeps the estates and the Journal", () => {
    expect(urls).toContain("/collection/coorg-coffee-creek");
    expect(urls).toContain("/journal/two-waters");
  });
});

describe("the content security policy", () => {
  const prod = contentSecurityPolicy({ dev: false, preview: false });
  it("refuses framing, plugins and foreign base URLs", () => {
    for (const d of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "default-src 'self'"]) expect(prod).toContain(d);
  });
  it("allows scripts only from this site and Razorpay's checkout", () => {
    const script = prod.split("; ").find((d) => d.startsWith("script-src"))!;
    expect(script).toBe("script-src 'self' 'unsafe-inline' https://checkout.razorpay.com");
  });
  it("allows eval only in development", () => {
    expect(prod).not.toContain("unsafe-eval");
    expect(contentSecurityPolicy({ dev: true, preview: false })).toContain("'unsafe-eval'");
  });
});

describe("error alerts carry nothing personal", () => {
  beforeEach(() => { (globalThis as { __gcAlerts?: unknown }).__gcAlerts = undefined; });
  it("removes addresses, PANs, long numbers and tokens", () => {
    const r = redact("failed for anika@example.com PAN ABCDE1234F acct 501001234567 at /verify?token=abc123");
    expect(r).not.toMatch(/anika|ABCDE1234F|501001234567|abc123/);
  });
  it("emails a failure once per half hour, and a different failure separately", () => {
    const a = { kind: "server" as const, where: "GET /collection", message: "boom" };
    expect(shouldEmail(a, 0)).toBe(true);
    expect(shouldEmail(a, 60_000)).toBe(false);
    expect(shouldEmail({ ...a, where: "GET /journal" }, 60_000)).toBe(true);
    expect(shouldEmail(a, 31 * 60_000)).toBe(true);
  });
  it("treats the same failure with different numbers as one", () =>
    expect(fingerprint({ kind: "client", where: "/x", message: "row 12 failed" })).toBe(fingerprint({ kind: "client", where: "/x", message: "row 99 failed" })));
  it("caps a flood at twelve an hour", () => {
    let sent = 0;
    for (let i = 0; i < 40; i++) if (shouldEmail({ kind: "server", where: `GET /p${i}x`, message: `distinct ${String.fromCharCode(65 + i)}` }, 1000 + i)) sent++;
    expect(sent).toBe(12);
  });
});
