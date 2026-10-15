/**
 * CANON CHECK — gc-app agrees with the shared fact layer (C:\\DIGITAL\\_CANON)
 *
 * 15 Oct 2026. The canon is the one place a property fact is stated; the
 * PMO already checks itself against it (hsg-pmo, npm run canon:check).
 * This is gc-app's half. For every vehicle the canon names by key, the
 * register must carry that key, the same number of keys, and the canon's
 * property name as the estate's public name.
 *
 *   npm run canon:check
 *
 * It is not part of `npm run verify`: the canon lives on this machine, not
 * in the repository, so CI cannot read it. Missing canon is a failure, not
 * a pass, for the same reason the PMO's check gives.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { VEHICLES } from "../constants/vehicles";
import { publicName } from "../app/_assemblies/site/registry";

const CANON = join(process.env.CANON_DIR ?? "C:\\DIGITAL\\_CANON", "dist", "canon.json");
if (!existsSync(CANON)) {
  console.error(`[canon-check] ${CANON} not found. Run: python C:\\DIGITAL\\_CANON\\build.py`);
  process.exit(1);
}
interface CanonVehicle { key: string | null; property: string | null; formation?: string | null }
interface CanonProperty { code: string | null; name: string | null; keys: number | null }
const canon = JSON.parse(readFileSync(CANON, "utf8")) as { vehicles: { vehicles: CanonVehicle[] }; properties: { properties: CanonProperty[] } };

const fail: string[] = [];
const note: string[] = [];
let compared = 0;
for (const cv of canon.vehicles.vehicles) {
  if (!cv.key) continue;                                   // an open decision in the canon, not a mismatch
  const v = VEHICLES.find((x) => x.key === cv.key);
  const p = canon.properties.properties.find((x) => x.code === cv.property);
  /* 15 Oct 2026: a key set before its LLP is formed (Coffee Fields, "coffeefields")
     is a decision recorded, not a vehicle the register should carry yet. Only a
     formed vehicle, or one with its formation letter drafted, must be in it. */
  if (!v && cv.formation === "registered_key_pending") { note.push(`${cv.key}: key set, LLP not yet formed; not expected in the register`); continue; }
  if (!v) { fail.push(`canon vehicle "${cv.key}" is not in the register`); continue; }
  if (!p) continue;
  compared++;
  if (p.keys !== null && p.keys !== v.keys) fail.push(`${cv.key}: ${v.keys} keys in the register, ${p.keys} in the canon`);
  if (p.name && p.name !== publicName(v)) fail.push(`${cv.key}: the site calls it "${publicName(v)}", the canon "${p.name}"`);
}
if (compared === 0) { console.error("[canon-check] Compared nothing. A check that reads nothing is a failure."); process.exit(1); }
if (fail.length) { console.error(`[canon-check] FAIL — ${fail.length}`); for (const f of fail) console.error("  " + f); process.exit(1); }
for (const n of note) console.log("  · " + n);
console.log(`[canon-check] PASS — ${compared} estates agree with the canon on key, keys and name.`);
