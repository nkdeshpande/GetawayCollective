/**
 * PRESS DOWNLOADS — each row on /press states its file's size, and the file exists
 *
 * The size is written into content/site/pages.ts rather than read at
 * request time, because a serverless function cannot rely on public/ being
 * on its disk. This holds the written figure to the file, so a replaced
 * asset with a stale size fails here instead of on the page.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { PAGES } from "../content/site/pages";

const rows = Object.values(PAGES).flatMap((p) => p.blocks.flatMap((b) => (b.assets ?? []).map((a) => ({ page: p.path, a }))));

describe("press downloads", () => {
  it("the press kit offers downloads, none of them off-site", () => {
    expect(rows.length).toBeGreaterThan(0);
    for (const { a } of rows) expect(a[1]).toMatch(/^\/images\/press\/[\w.-]+$/);
  });
  it.each(rows.map(({ page, a }) => [page, a[1], a[3]] as const))("%s %s is %s bytes", (_page, href, bytes) => {
    expect(String(statSync(join(process.cwd(), "public", href)).size)).toBe(bytes);
  });
  it("no page links to a private draft", () => {
    expect(JSON.stringify(PAGES)).not.toMatch(/claude\.ai/);
  });
});

describe("share cards", () => {
  /* Read as source: vitest here has no @/ alias, and meta.ts imports through it. */
  it("page metadata names a share image for Open Graph and X", () => {
    const src = readFileSync(join(process.cwd(), "app/_system/meta.ts"), "utf8");
    expect(src).toMatch(/openGraph: \{[^}]*images: \[shareFor\(path, title\)\]/);
    expect(src).toMatch(/twitter: \{[^}]*images: \[shareFor\(path, title\)\.url\]/);
  });
  it("the per-page card takes no text from its URL", () => {
    const src = readFileSync(join(process.cwd(), "app/api/og/route.tsx"), "utf8");
    expect(src).toMatch(/describePath\(p\)/);
    expect(src).not.toMatch(/searchParams\.get\("(title|t|text|kicker)"\)/);
  });
});
