/**
 * Test configuration — one line of substance: `@/` resolves as tsconfig.json
 * says it does. 25 Sep 2026. Without it a test could not import any module
 * that uses the alias (app/_system/meta.ts, ld.ts, sitemap.ts), so those
 * modules went untested. Every other setting is Vitest's default.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
});
