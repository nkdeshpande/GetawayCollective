/**
 * IndexNow — tell Bing (which feeds ChatGPT search and Copilot) and Yandex
 * that pages changed, instead of waiting to be crawled. 16 Oct 2026.
 *
 *   node scripts/indexnow.mjs            submits every URL in the live sitemap
 *   node scripts/indexnow.mjs --dry      lists them and sends nothing
 *
 * The key is not a secret: IndexNow proves ownership by fetching it from
 * public/938365432f84bb6fd23f90c9333d781f.txt on the site. Submitting is an outward action; run it
 * after a deploy that changed public pages, not on a schedule.
 */
const SITE = "https://www.getawaycollective.co";
const KEY = "938365432f84bb6fd23f90c9333d781f";
const dry = process.argv.includes("--dry");

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (dry) { console.log(urls.join("\n")); console.log(`${urls.length} URLs, not sent`); } else {
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${r.status} ${r.statusText} for ${urls.length} URLs`);
process.exitCode = r.ok ? 0 : 1; }
