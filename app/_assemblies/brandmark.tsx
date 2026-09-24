/**
 * THE MARK — GC-MARK-01 / 02 / 03, rendered
 *
 * One renderer for the brand. Every surface that shows the mark imports it
 * from here; brand-lint fails a wordmark typed by hand anywhere else.
 *
 * Since 24 Sep 2026 (L1-01 §29-0b) the mark is drawn: R5 · One angle, the
 * chamfered box with a copper skylight cut through it. The geometry is
 * constants/brand-system.ts; this file only places it. The exports keep
 * their names — Wordmark, Monogram, Device — so every caller that asked
 * for the old type mark now receives the drawn one without being edited.
 */

import {
  CAP_RATIO, MARK_CUT, MARK_PATH, MIN_FONT_PX, clearspacePx, devicePx,
} from "@/constants/brand-system";

type Ground = "void" | "paper" | "inherit";

interface MarkProps {
  readonly size?: number;
  readonly ground?: Ground;
  readonly withClearspace?: boolean;
  readonly className?: string;
}

const groundClass = (g: Ground) =>
  g === "void" ? "gc-mark-on-void" : g === "paper" ? "gc-mark-on-paper" : "";

/** GC-MARK-02 geometry as an inline SVG: ink box, copper cut. */
export function Mark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={`gc-mark${className ? ` ${className}` : ""}`}
      viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false"
    >
      <path className="gc-mark-ink" fillRule="evenodd" d={MARK_PATH} />
      <path className="gc-device" d={MARK_CUT} />
    </svg>
  );
}

/** GC-MARK-03 · the copper skylight alone. */
export function Device({ size = 8, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={`gc-device-solo${className ? ` ${className}` : ""}`}
      viewBox="20 10 60 80" width={size} height={size} aria-hidden="true" focusable="false"
    >
      <path className="gc-device" d={MARK_CUT} />
    </svg>
  );
}

/** GC-MARK-01 · the drawn mark beside GETAWAY 800 / COLLECTIVE 100. */
export function Wordmark({
  size = MIN_FONT_PX, ground = "inherit", withClearspace = false, className,
}: MarkProps) {
  const px = Math.max(size, MIN_FONT_PX);
  const pad = withClearspace ? clearspacePx(px) : 0;
  return (
    <span
      className={`gc-wordmark ${groundClass(ground)}${className ? ` ${className}` : ""}`}
      style={{ fontSize: px, padding: pad, gap: Math.round(px * CAP_RATIO * 0.5) }}
    >
      <Mark size={devicePx(px)} />
      <span className="gc-wordmark-type"><b>Getaway</b> Collective</span>
    </span>
  );
}

/** 02C · the two-line lockup, for covers and the site's own foot. */
export function Lockup({ size = 40, ground = "inherit", className }: MarkProps) {
  return (
    <span
      className={`gc-lockup ${groundClass(ground)}${className ? ` ${className}` : ""}`}
      style={{ fontSize: size, gap: Math.round(size * CAP_RATIO * 0.6) }}
    >
      <Mark size={Math.round(size * 2.1)} />
      <span className="gc-lockup-type"><b>Getaway</b><span>Collective</span></span>
    </span>
  );
}

/** GC-MARK-02 · the monogram: the drawn mark alone, framed by nothing. */
export function Monogram({ size = 40, ground = "inherit", className }: MarkProps) {
  return (
    <span
      className={`gc-monogram ${groundClass(ground)}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    >
      <Mark size={size} />
    </span>
  );
}
