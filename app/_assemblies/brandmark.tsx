/**
 * THE MARK, RENDERED — GC-MARK-01 / 02 / 03
 *
 * The three marks of constants/brand-system.ts, as the only components
 * permitted to draw them. Before this, every surface drew its own: the
 * sysbar set the wordmark at weight 500 with no square, and the favicon,
 * the iOS icon and the share card each set "GC" in Georgia.
 *
 * ── WHY IT IS TYPE AND NOT AN SVG ────────────────────────────────────
 * BR-01 specifies the mark as Outfit 200 uppercase with a copper trailing
 * period. That IS the mark — there is no drawn logotype, and tracing one
 * from the type would be inventing a logo and calling it ratified. So the
 * wordmark is set type with the square as real geometry beside it, and
 * BRAND_LAWS.derivedNotDrawn says so out loud.
 *
 * Every size here is computed from the registry, so BR-02's clearspace and
 * floor cannot drift from the thing that renders.
 */
import {
  CAP_RATIO, DEVICE_RATIO, MIN_FONT_PX, clearspacePx, devicePx,
} from "@/constants/brand-system";

type Ground = "void" | "paper" | "inherit";

interface MarkProps {
  /** font-size in px. Defaults to the BR-02 floor. */
  readonly size?: number;
  /** Which ground it stands on. `inherit` takes the surrounding colour. */
  readonly ground?: Ground;
  /** Render the BR-02 clearspace as real padding. Off inside existing chrome. */
  readonly withClearspace?: boolean;
  readonly className?: string;
}

const groundClass = (g: Ground) =>
  g === "void" ? "gc-mark-on-void" : g === "paper" ? "gc-mark-on-paper" : "";

/**
 * GC-MARK-03 · THE DEVICE — the copper square alone.
 *
 * Square because RADIUS.none is invariant. A round dot here would be the
 * only curve in the system, on the one element that appears on every page.
 */
export function Device({ size = 8, className }: { size?: number; className?: string }) {
  return (
    <i
      aria-hidden="true"
      className={`gc-device${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * GC-MARK-01 · THE WORDMARK.
 *
 * `size` is a font-size, and the floor is enforced here rather than trusted:
 * a caller asking for 12px gets the floor, because BR-02 bars the wordmark
 * below 20px cap-height and silently honouring the request would ship an
 * illegible mark.
 */
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
      <span className="gc-wordmark-type">Getaway Collective</span>
      <Device size={devicePx(px)} />
    </span>
  );
}

/**
 * GC-MARK-02 · THE MONOGRAM — framed GC, for where the wordmark cannot fit.
 *
 * The frame is BR-03's icon geometry, not a badge: 1px stroke, square, no
 * fill, no second colour.
 */
export function Monogram({ size = 40, ground = "inherit", className }: MarkProps) {
  return (
    <span
      className={`gc-monogram ${groundClass(ground)}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
    >
      <span className="gc-monogram-type" style={{ fontSize: Math.round(size * 0.42) }}>
        GC
      </span>
      <Device size={Math.max(2, Math.round(size * 0.42 * CAP_RATIO * DEVICE_RATIO))} />
    </span>
  );
}
