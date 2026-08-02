#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "INFORMATION-ARCHITECTURE.html"), "utf8");
const declared = [...html.matchAll(/<span class="pth">([\s\S]*?)<\/span>/g)]
  .map((match) => match[1].replace(/<[^>]+>/g, ""));
const paths = [...new Set(declared)].map((value) => value
  .replaceAll("[vehicle]", "slowspace-coastal")
  .replaceAll("[story]", "origins")
  .replaceAll("[document]", "agreement")
  .replaceAll("[event]", "event-001")
  .replaceAll("[partner]", "partner-001")
  .replaceAll("[year]", "2026"));

async function run() {
  const origin = process.env.GC_SMOKE_ORIGIN || "http://localhost:3000";
  const failures = [];
  for (let index = 0; index < paths.length; index += 8) {
    await Promise.all(paths.slice(index, index + 8).map(async (routePath) => {
      try {
        const response = await fetch(`${origin}${routePath}`, {
          redirect: "manual",
          signal: AbortSignal.timeout(30_000),
        });
        if (response.status >= 500) failures.push([routePath, response.status]);
      } catch (error) {
        failures.push([routePath, error instanceof Error ? error.name : "request-error"]);
      }
    }));
    process.stdout.write(`[smoke-ia] ${Math.min(index + 8, paths.length)}/${paths.length}\r`);
  }

  process.stdout.write("\n");
  if (paths.length !== 107) failures.push(["route-count", paths.length]);
  if (failures.length) {
    for (const failure of failures) console.error(`[smoke-ia] FAIL ${failure[0]} ${failure[1]}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[smoke-ia] PASS — ${paths.length} canonical routes responded without a server error`);
}

run();
