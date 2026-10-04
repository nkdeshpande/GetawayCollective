#!/usr/bin/env node
/**
 * SITE MEDIA — an estate's illustrations, cut to what a page serves
 *
 * 1 Oct 2026. SlowSpace Creek is the first estate with pictures of its own:
 * the isometric illustrations in its location-brand media register
 * (C:\SENSORYGETAWAYS\4.0 SlowSpace Creek_CRK\LOCATION BRAND\media, rebuilt
 * 1 Oct 2026 from the approved scene; 3840 and 3000 px masters, no text on
 * any of them). Those masters are 1 to 9 MB each and are not ours to move:
 * that folder is a synced working set. This script reads them and writes
 * web copies, two widths each, into public/images/site/<estate>/.
 *
 *   node scripts/gen-site-media.js "<source folder>" [estate]     (estate: creek by default, or confluence)
 *
 * The frames and their words live in content/site/media.ts, which is the
 * one place a picture is named; this file only says which master each name
 * is cut from. tests/site-media.test.ts holds the two to each other and to
 * the files on disk. Run it again only when a master changes.
 *
 * Every one of these is an illustration of something unbuilt, and the page
 * says so on each picture (render.ts plate()).
 */

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");

/** name → [master file, kind]. wide = 16:9, tall = 2:3, square = 1:1. */
const CREEK = {
  "hero": ["crk_hero_fullbleed_01.jpg", "wide"],
  "hero-tall": ["crk_hero_fullbleed_portrait_01.jpg", "tall"],
  "place": ["crk_ridge_outlook_wide_01.jpg", "wide"],
  "arrival": ["crk_ch1_fullbleed_01.jpg", "wide"],
  "commons": ["crk_ch2_fullbleed_01.jpg", "wide"],
  "cluster": ["crk_ch3_fullbleed_01.jpg", "wide"],
  "water": ["crk_ch4_fullbleed_01.jpg", "wide"],
  "sauna": ["crk_exp01_card_01.jpg", "wide"],
  "night": ["crk_exp02_card_01.jpg", "wide"],
  "clusters": ["crk_exp03_card_01.jpg", "wide"],
  "yard": ["crk_ridge_deck_wide_01.jpg", "wide"],
  "keys-plan": ["crk_ridge_interior_wide_01.jpg", "wide"],
  "cluster-plan": ["crk_journal_04_wide_01.png", "wide"],
  "lake-plan": ["crk_journal_05_wide_01.png", "wide"],
  "lake": ["crk_journal_11_wide_01.png", "wide"],
  "masterplan": ["press_crk_masterplan_zones_01.png", "wide"],
  "stream-walk": ["crk_sanctum_exterior_three_quarter_01.jpg", "wide"],
  "court": ["crk_ch1a_square_01.jpg", "square"],
  "table": ["crk_ch2a_square_01.jpg", "square"],
  "lamps": ["crk_ch2c_square_01.jpg", "square"],
  "cluster-west": ["crk_ch3a_square_01.png", "square"],
  "keys": ["crk_ch3b_square_01.jpg", "square"],
  "path": ["crk_ch3c_square_01.jpg", "square"],
  "crossing": ["crk_ch4a_square_01.png", "square"],
  "sauna-lake": ["crk_ch4c_square_01.jpg", "square"],
  "stream": ["crk_stream_square_01.png", "square"],
};

/* 4 Oct 2026. Seaside Confluence, from its own media register (C:\SENSORYGETAWAYS\
   3.0 SEASIDE CONFLUENCE_SSC\LOCATION BRAND\media, GX-14-RG-002, rebuilt 1 Oct 2026 from
   the road-to-river model SSC-01-DR-008). The register names the slot each picture was made
   for, and the page follows it: the chapters, the five moments of the day, the plans. Two
   choices are ours. The hero is the register's estate aerial and not its eye-level "hero",
   which is a close view of one wall; and a portrait cut of the same aerial serves a phone.
   The three site photographs in the register are marked interim, to be re-shot, and are
   not used. */
const CONFLUENCE = {
  "hero": ["press_ssc_estate_aerial_01.jpg", "wide"],
  "hero-tall": ["press_ssc_estate_aerial_01.jpg", "tall"],
  "place": ["ssc_site_wide_01.jpg", "wide"],
  "keys": ["ssc_ch3_fullbleed_01.jpg", "wide"],
  "stair": ["ssc_sky_deck_wide_01.jpg", "wide"],
  "plaza": ["ssc_ch2_fullbleed_01.jpg", "wide"],
  "arrival": ["ssc_ch1_fullbleed_01.jpg", "wide"],
  "river": ["ssc_exp01_card_01.jpg", "wide"],
  "walk": ["ssc_exp06_card_01.jpg", "wide"],
  "veranda": ["ssc_exp02_card_01.jpg", "wide"],
  "fire": ["ssc_exp03_card_01.jpg", "wide"],
  "tide-table": ["ssc_exp04_card_01.jpg", "wide"],
  "dock": ["ssc_ch4_fullbleed_01.jpg", "wide"],
  "zones": ["press_ssc_masterplan_zones_01.png", "wide"],
  "site-plan": ["ssc_journal_10_wide_01.png", "wide"],
  "key-section": ["ssc_journal_04_wide_01.png", "wide"],
  "plaza-plan": ["ssc_journal_09_wide_01.png", "wide"],
  "balcony": ["ssc01_outlook_wide_01.jpg", "square"],
  "veranda-rain": ["ssc_exp02_card_01.jpg", "square"],
  "procession": ["ssc_ch1b_square_01.jpg", "square"],
};

const FRAMES = { creek: CREEK, confluence: CONFLUENCE };

/** [large, small] widths in px. The large is the intrinsic size the manifest states. */
const WIDTHS = { wide: [1800, 900], tall: [1000, 600], square: [1200, 600] };
const RATIO = { wide: 9 / 16, tall: 3 / 2, square: 1 };

async function build(estate, frames, src) {
  const out = path.join(ROOT, "public", "images", "site", estate);
  fs.mkdirSync(out, { recursive: true });
  let bytes = 0;
  for (const [name, [file, kind]] of Object.entries(frames)) {
    const master = path.join(src, file);
    if (!fs.existsSync(master)) throw new Error(`[site-media] missing master: ${master}`);
    for (const w of WIDTHS[kind]) {
      const h = Math.round(w * RATIO[kind]);
      const to = path.join(out, `${name}-${w}.webp`);
      await sharp(master).resize(w, h, { fit: "cover", position: "centre" }).webp({ quality: 76, effort: 6 }).toFile(to);
      bytes += fs.statSync(to).size;
    }
  }
  console.log(`[site-media] ${estate}: ${Object.keys(frames).length} frames, ${(bytes / 1048576).toFixed(1)} MB in public/images/site/${estate}`);
}

if (require.main === module) {
  const src = process.argv[2], estate = process.argv[3] || "creek";
  if (!src || !FRAMES[estate]) {
    console.error(`usage: node scripts/gen-site-media.js "<source folder holding the masters>" [${Object.keys(FRAMES).join(" | ")}]`);
    process.exit(1);
  }
  build(estate, FRAMES[estate], src).catch((e) => { console.error(e.message); process.exit(1); });
}

module.exports = { CREEK, CONFLUENCE, FRAMES, WIDTHS, RATIO };
