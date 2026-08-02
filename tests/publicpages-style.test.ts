import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("app/_assemblies/publicpages.tsx", "utf8");
const css = readFileSync("app/_assemblies/publicpages.css", "utf8");
const globals = readFileSync("app/globals.css", "utf8");

describe("public cinematic styling", () => {
  it("imports the dedicated public stylesheet", () => {
    expect(globals).toContain('@import url("./_assemblies/publicpages.css")');
  });

  it("defines every static homepage and investment selector", () => {
    const names = [...source.matchAll(/className="([^"]+)"/g)]
      .flatMap((match) => match[1].split(/\s+/))
      .filter((name) => name.startsWith("gc-home-") || name.startsWith("gc-place") || name.startsWith("investment-") || name.startsWith("invest-"));
    for (const name of new Set(names)) expect(css, name).toContain(`.${name}`);
  });

  it("keeps the approved public image directory outside the surface guard", () => {
    const middleware = readFileSync("middleware.ts", "utf8");
    expect(middleware).toContain("_next/image|images|favicon.ico");
  });
});
