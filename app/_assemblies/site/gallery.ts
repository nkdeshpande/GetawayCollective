/**
 * THE GALLERY — a fan of frames that opens into a full-screen viewer
 *
 * 25 Sep 2026, from the founder's signed-off reference
 * (Digital Visuals/SIGNED OFF/GallerySection+GalleryFrame.html): a fan of
 * cards on the page; one tap opens a dark viewer, one frame at a time,
 * swiped, dragged, wheeled or stepped with the arrow keys, with its index
 * and a progress line.
 *
 * What is kept from the reference, and what is not:
 *   - kept: the fan, the viewer, the settle on each frame, the HUD;
 *   - not kept: the stock photographs and video (none of it is ours), the
 *     scrim laid over each picture and the words on it (ruling of 21 Sep:
 *     no gradient, not much text on the picture; captions sit below), and
 *     the custom cursor, which hides the real one.
 * No photography is commissioned yet, so every frame is one of the site's
 * own drawn films and says so: a drawing shown as a photograph is the
 * commonest misrepresentation in this industry (content/public.ts, Plate).
 *
 * Every frame is in the page, so it works without script as a plain list.
 */

import { film } from "./render";

export interface Frame {
  readonly pal: string;
  readonly hour: number;
  readonly rain?: boolean | number;
  readonly bp?: boolean | number;
  readonly t: string;
  readonly line: string;
  readonly href?: string;
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const two = (n: number) => String(n).padStart(2, "0");

export function GALLERY(id: string, title: string, frames: readonly Frame[]): string {
  if (!frames.length) return "";
  const fan = frames.slice(0, 5);
  return `<div class="gal" data-gal>` +
    `<button type="button" class="gal-fan" data-gal-open aria-haspopup="dialog" aria-controls="${id}-ov" aria-label="Open ${esc(title)}: ${frames.length} drawn frames">` +
    fan.map((f, i) => { const d = i - (fan.length - 1) / 2;
      return `<span class="gal-card" style="--i:${d};--a:${Math.abs(d)};z-index:${10 - Math.abs(d) * 2}">${film(f.pal, f.hour, { rain: f.rain, bp: f.bp })}</span>`; }).join("") +
    `</button>` +
    `<p class="mono gal-hint">${two(frames.length)} frames · drawn films, illustration · tap to open</p>` +
    `<div class="gal-ov" id="${id}-ov" role="dialog" aria-modal="true" aria-label="${esc(title)}" hidden>` +
    `<header class="gal-hud"><span class="eb">${esc(title)}</span><span class="mono gal-idx" aria-live="polite">01 / ${two(frames.length)}</span>` +
    `<button type="button" class="gal-x" data-gal-close>Close <span class="mono">Esc</span></button></header>` +
    `<div class="gal-vp" data-gal-vp tabindex="0" aria-roledescription="carousel" aria-label="${esc(title)}, use the arrow keys">` +
    frames.map((f, i) => `<figure class="gal-f${i === 0 ? " on" : ""}" aria-roledescription="slide" aria-label="${i + 1} of ${frames.length}: ${esc(f.t)}">` +
      `<div class="gal-m">${film(f.pal, f.hour, { rain: f.rain, bp: f.bp, label: `Drawn film, illustration: ${f.t}` })}</div>` +
      `<figcaption><span class="mono">${two(i + 1)} · drawn film, illustration</span><b>${esc(f.t)}</b><em>${esc(f.line)}</em>` +
      (f.href ? `<a class="btn btn-s" href="${f.href}">Open the estate</a>` : "") + `</figcaption></figure>`).join("") +
    `</div>` +
    `<footer class="gal-foot"><button type="button" class="gal-step" data-gal-prev aria-label="Previous frame">←</button>` +
    `<span class="gal-bar" aria-hidden="true"><i></i></span>` +
    `<button type="button" class="gal-step" data-gal-next aria-label="Next frame">→</button></footer>` +
    `</div></div>`;
}

/* ── THE PROJECTOR — one estate, centred, a frame at a time ─────────────
   From the Mag-Lock Projector (GC CG Assemblies · GC.SPC.03): a centred
   plate on a dark screen, the figure number and title stamped below it,
   PREV · 01 / 05 · NEXT, a hard shutter cut between frames rather than a
   fade, and no auto-advance: the reader moves it. Its frames are an
   estate's own day, each moment drawn in the estate's film at that hour. */
export interface Moment extends Frame { readonly label: string }

export function PROJECTOR(id: string, title: string, frames: readonly Moment[]): string {
  if (!frames.length) return "";
  return `<div class="proj" data-proj>` +
    `<div class="proj-screen" id="${id}-screen" aria-roledescription="carousel" aria-label="${esc(title)}">` +
    frames.map((f, i) => `<figure class="proj-f" aria-roledescription="slide" aria-label="${i + 1} of ${frames.length}: ${esc(f.t)}"${i ? " hidden" : ""}>` +
      `<div class="proj-plate">${film(f.pal, f.hour, { rain: f.rain, bp: f.bp, label: `Drawn film, illustration: ${f.label.toLowerCase()} at the estate` })}</div>` +
      `<figcaption><span class="mono">FIG. ${two(i + 1)} — ${esc(f.label)}</span><b>${esc(f.t)}</b><em>${esc(f.line)}</em></figcaption></figure>`).join("") +
    `</div>` +
    `<div class="proj-console"><button type="button" class="proj-btn" data-proj-prev aria-controls="${id}-screen">Prev</button>` +
    `<span class="mono proj-idx" aria-live="polite">${two(1)} / ${two(frames.length)}</span>` +
    `<button type="button" class="proj-btn" data-proj-next aria-controls="${id}-screen">Next</button></div>` +
    `<p class="mono proj-note">Drawn films, illustration: the estate's own drawing, relit for each moment. No photograph is shown until one is taken.</p>` +
    `</div>`;
}

/** The hour a moment of the day is drawn at: a clock time where one is given, else the word's usual hour. */
export function momentHour(label: string, i: number): { hour: number; rain: boolean } {
  const t = label.match(/^(\d{1,2}):(\d{2})$/);
  if (t) return { hour: Number(t[1]) + Number(t[2]) / 60, rain: false };
  const W: Readonly<Record<string, number>> = {
    DAWN: 6.3, SUNRISE: 6.5, MORNING: 9, "LOW TIDE": 10, HARVEST: 10.5, NOON: 12.5, AFTERNOON: 15.5,
    MONSOON: 14, TIDE: 17, ARRIVAL: 17.4, DUSK: 18.4, SUNSET: 18.6, "ONE MINUTE": 18.8, EVENING: 19.6, NIGHT: 21.5,
  };
  const k = label.trim().toUpperCase();
  return { hour: W[k] ?? [7, 11, 15, 18.5, 21][i % 5], rain: k === "MONSOON" };
}
