/**
 * THE FILM — an estate drawn as ridgelines in square dots, relit by the hour
 *
 * L1-01 §29-0b · 24 Sep 2026. Ported from the prototype. The site has no
 * photography yet, and the ruling of 21 Sep says no gradient and no words on
 * a picture; this draws the land instead, and every colour it draws with is
 * FILM in constants/tokens.ts.
 *
 * It sleeps off-screen (IntersectionObserver), redraws at about 22 fps, and
 * under prefers-reduced-motion draws exactly one still frame.
 */

import { FILM } from "@/constants/tokens";

type Pal = {
  readonly bg: string; readonly sky: string; readonly sun: string | null; readonly r: readonly string[];
  readonly water?: string; readonly wet?: number; readonly boulders?: number; readonly mist?: number;
};
const PAL = FILM as unknown as Readonly<Record<string, Pal>>;
const LIGHT = FILM.light;

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function mix(a: string, b: string, k: number) {
  const A = hex(a), B = hex(b);
  return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",") + ")";
}
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FilmOpts { pal: string; hour: number; rain: boolean; bp: boolean; seed: number; still: boolean }

export function Film(cv: HTMLCanvasElement, o: FilmOpts): () => void {
  const p = PAL[o.pal] ?? PAL.coast;
  const ctx = cv.getContext("2d");
  if (!ctx) return () => undefined;
  const R = rng(o.seed);
  let w = 1, h = 1, t = 0, run = false, last = 0, raf = 0;
  const ridges = [0, 1, 2].map((i) => ({
    base: 0.44 + i * 0.13, amp: 0.1 - i * 0.02,
    f: [R() * 2 + 1.2, R() * 4 + 3, R() * 9 + 7], ph: [R() * 6, R() * 6, R() * 6], sp: (i + 1) * 0.00003,
  }));
  const drops = Array.from({ length: 110 }, () => [R(), R(), 0.6 + R() * 0.8]);
  const stars = Array.from({ length: 150 }, () => [R(), R() * 0.42, R()]);

  const ry = (r: (typeof ridges)[number], x: number) => {
    let v = 0;
    for (let k = 0; k < 3; k++) v += Math.sin(x * r.f[k] + r.ph[k] + t * r.sp * (k + 1) * 60) / (k + 1.4);
    return h * (r.base + r.amp * v);
  };
  const L = () => {
    const H = o.hour;
    return {
      night: H < 6.2 || H > 19 ? Math.min(1, Math.max(0, Math.cos((H / 24) * 2 * Math.PI)) + 0.35) : 0,
      day: H > 6 && H < 18 ? Math.sin(((H - 6) / 12) * Math.PI) : 0,
      warm: Math.min(1, Math.max(0, 1 - Math.abs(H - 18.4) / 2.2) + Math.max(0, 1 - Math.abs(H - 6.3) / 1.8) * 0.8),
    };
  };
  const col = (c: string, l: ReturnType<typeof L>) => {
    let k = c;
    if (l.night) k = mix(c, LIGHT.night, Math.min(0.62, l.night * 0.62));
    else if (l.day) k = mix(c, LIGHT.day, l.day * 0.14);
    if (o.rain) k = mix(c, LIGHT.rain, 0.3 + (l.night ? 0.3 : 0));
    return k;
  };

  function draw() {
    if (!ctx) return;
    const l = L(), s = w < 520 ? 6 : 8;
    if (o.bp) {
      ctx.fillStyle = LIGHT.blueprint; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = LIGHT.grid; ctx.lineWidth = 1; ctx.beginPath();
      for (let gx = 0; gx < w; gx += 36) { ctx.moveTo(gx, 0); ctx.lineTo(gx, h); }
      for (let gy = 0; gy < h; gy += 36) { ctx.moveTo(0, gy); ctx.lineTo(w, gy); }
      ctx.stroke();
      ridges.forEach((r, i) => {
        ctx.strokeStyle = `rgba(${LIGHT.line},${0.45 + i * 0.2})`; ctx.lineWidth = 1 + i * 0.4; ctx.beginPath();
        for (let x = 0; x <= w; x += 4) { const y = ry(r, x / w); if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
      });
      return;
    }
    ctx.fillStyle = col(p.bg, l); ctx.fillRect(0, 0, w, h);
    const hz = ridges[0].base * h, H = o.hour, sunOn = !!p.sun && H > 5.5 && H < 19 && !o.rain;
    const sx = w * ((H - 6) / 12), sy = hz - Math.sin(Math.max(0, Math.min(1, (H - 6) / 12)) * Math.PI) * h * 0.34 + 10, sr = Math.min(w, h) * 0.1;
    const sk = col(p.sky, l), sc = p.sun ? (l.warm > 0.4 ? mix(p.sun, LIGHT.warm, l.warm * 0.5) : p.sun) : "";
    for (let x = s / 2; x < w; x += s) {
      const nx = x / w, ys = ridges.map((r) => ry(r, nx));
      for (let y = s / 2; y < h; y += s) {
        let idx = -1;
        for (let i = 2; i >= 0; i--) { if (y >= ys[i]) { idx = i; break; } }
        let z: number;
        if (idx < 0) {
          z = s * 0.16 * Math.pow(Math.min(1, y / hz), 2.2) * (1 - (l.night ? 0.6 : 0));
          if (sunOn) {
            const dd = Math.hypot(x - sx, y - sy);
            if (dd < sr) { ctx.fillStyle = sc; z = s * (0.9 - (0.5 * dd) / sr); ctx.fillRect(x - z / 2, y - z / 2, z, z); continue; }
            else if (dd < sr * 2.4) z += s * 0.2 * (1 - (dd - sr) / (sr * 1.4));
          }
          if (p.mist) z += s * 0.12 * (Math.sin(nx * 9 + y * 0.03 + t * 0.0006) * 0.5 + 0.5) * Math.min(1, y / hz);
          if (z < 0.4) continue;
          ctx.fillStyle = sk; ctx.fillRect(x - z / 2, y - z / 2, z, z); continue;
        }
        if (p.water && p.wet && y > h * p.wet) {
          const wv = Math.sin(nx * 40 + y * 0.2 + t * 0.002) * 0.5 + 0.5;
          ctx.fillStyle = col(p.water, l); ctx.globalAlpha = 0.3 + 0.5 * wv;
          const lw = s * (0.4 + wv * 0.9); ctx.fillRect(x - lw / 2, y - 0.6, lw, 1.4); ctx.globalAlpha = 1; continue;
        }
        const dep = (y - ys[idx]) / (h * 0.28);
        z = s * Math.max(0.18, 0.86 - dep * 0.55);
        if (p.boulders && idx === 2 && Math.sin(nx * 60) * Math.sin(y * 0.09) > 0.55) z = s * 0.95;
        ctx.fillStyle = col(p.r[idx], l); ctx.fillRect(x - z / 2, y - z / 2, z, z);
      }
    }
    if (l.night && !o.rain) {
      ctx.fillStyle = LIGHT.star;
      stars.forEach((st) => {
        if (st[1] * h < hz - 16) { const q = 1.1 + st[2] * 1.5 * (0.6 + 0.4 * Math.sin(t * 0.003 + st[2] * 20)); ctx.fillRect(st[0] * w, st[1] * h, q, q); }
      });
    }
    if (o.rain) {
      ctx.strokeStyle = LIGHT.drop; ctx.lineWidth = 1; ctx.beginPath();
      drops.forEach((d) => {
        let X = (d[0] * w - t * 0.12 * d[2]) % w; if (X < 0) X += w;
        const Y = (d[1] * h + t * 0.24 * d[2]) % h;
        ctx.moveTo(X, Y); ctx.lineTo(X - 6, Y + 12);
      });
      ctx.stroke();
    }
  }

  function size() {
    const b = cv.getBoundingClientRect();
    if (b.width < 2 || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = b.width; h = b.height; cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  function loop(ts: number) {
    if (!run) return;
    if (ts - last > 45) { t = ts; draw(); last = ts; }
    raf = requestAnimationFrame(loop);
  }

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(size) : null;
  ro?.observe(cv);
  size();
  const io = !o.still && typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting && !run) { run = true; raf = requestAnimationFrame(loop); }
        else if (!en.isIntersecting) run = false;
      }))
    : null;
  io?.observe(cv);
  return () => { run = false; cancelAnimationFrame(raf); ro?.disconnect(); io?.disconnect(); };
}
