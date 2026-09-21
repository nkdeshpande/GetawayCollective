/**
 * THE UNIT PLATE — what one key is, drawn to scale
 *
 * ── WHY A DRAWING AND NOT A PHOTOGRAPH ───────────────────────────────
 * Nothing is built on any of the four properties. No appraiser has seen
 * them and no photographer has stood on them, and this platform's rule is
 * that every frame is a labelled drawing until a photograph exists.
 *
 * That constraint is usually treated as a loss. It is not. A scaled plan
 * with a real dimension on it tells a reader considering a capital
 * commitment more than a rendered interior does, and it cannot flatter:
 * 465 sq ft draws smaller than 565, visibly, because the geometry is
 * computed from the number rather than chosen to look good.
 *
 * ── WHAT IS TRUE OF THE GEOMETRY ─────────────────────────────────────
 * The plate's side is the square root of the area, so plates compare by
 * AREA and not by edge. Drawing side ∝ area would make a 550 look nearly
 * twice a 465, which is the kind of chart that is technically a drawing
 * and practically a lie.
 *
 * Multiplicity is drawn, not written: six keys are six marks. A reader
 * sees "how many" before reading the count, which is the order they
 * actually want it in.
 */
import type { KeyType } from "@/constants/spatial";

/** The largest area in the set, so plates in one row share a scale. */
export function scaleFor(units: readonly KeyType[]): number {
  return Math.max(...units.map((u) => u.area), 1);
}

/**
 * One key type, drawn.
 *
 * `max` is the set's largest area, passed in rather than computed here —
 * a plate that normalised against itself would draw every unit the same
 * size and quietly destroy the only comparison this figure exists to make.
 */
export function UnitPlate({ unit, max }: { unit: KeyType; max: number }) {
  /* 88, not 100, and the two bugs that taught me the difference:
     the largest key drew exactly on top of its own reference field, so on
     a set where every key is the same area — Solace, three types at 565 —
     the figure collapsed into one square and said nothing; and the
     dimension line, placed below the key, fell outside a 0–100 viewBox and
     was clipped on precisely the largest plate. The field is the frame
     now, and the key sits inside it, always. */
  const side = Math.sqrt(unit.area / max) * 88;
  const inset = (100 - side) / 2;
  const dim = inset + side + 5;

  return (
    <figure className="unit-plate">
      <svg viewBox="0 0 100 108" role="img"
           aria-label={`${unit.name}, ${unit.area} square feet, drawn to scale`}>
        {/* The envelope the set is measured against — the largest key. */}
        <rect x="0.5" y="0.5" width="99" height="99"
              className="up-field" vectorEffect="non-scaling-stroke" />
        {/* This key, at true relative area. */}
        <rect x={inset} y={inset} width={side} height={side}
              className="up-key" vectorEffect="non-scaling-stroke" />
        {/* A dimension line along the foot of the key, because a plan
            without one is a shape rather than a measurement. */}
        <line x1={inset} y1={dim} x2={inset + side} y2={dim}
              className="up-dim" vectorEffect="non-scaling-stroke" />
        {/* Serifs. Without them it reads as a rule under the drawing
            rather than as a measurement of it. */}
        <line x1={inset} y1={dim - 2} x2={inset} y2={dim + 2}
              className="up-dim" vectorEffect="non-scaling-stroke" />
        <line x1={inset + side} y1={dim - 2} x2={inset + side} y2={dim + 2}
              className="up-dim" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption>
        <span className="up-area">{unit.area.toLocaleString("en-IN")}</span>
        <span className="up-unit t-micro">sq ft</span>
      </figcaption>
    </figure>
  );
}

/** The count, drawn before it is read. One mark per key. */
export function UnitCount({ count }: { count: number }) {
  return (
    <span className="unit-count" aria-label={`${count} keys of this type`}>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} aria-hidden="true" />
      ))}
      <span className="t-micro">{count}</span>
    </span>
  );
}

export function UnitCard({ unit, max }: { unit: KeyType; max: number }) {
  return (
    <article className="unit-card">
      <UnitPlate unit={unit} max={max} />
      <div className="unit-body">
        <h3 className="unit-name">{unit.name}</h3>
        <UnitCount count={unit.count} />
        <p className="unit-note t-body-s">{unit.note}</p>
      </div>
    </article>
  );
}

export function UnitSet({ units }: { units: readonly KeyType[] }) {
  if (units.length === 0) return null;
  const max = scaleFor(units);
  const keys = units.reduce((n, u) => n + u.count, 0);
  const areas = units.map((u) => u.area);

  return (
    <section className="unit-set" aria-label="The keys">
      <header className="unit-set-head">
        <p className="t-micro">THE KEYS</p>
        <p className="unit-set-sum t-body-s">
          {keys} keys in {units.length} type{units.length === 1 ? "" : "s"}
          {" · "}
          {Math.min(...areas) === Math.max(...areas)
            ? `${areas[0].toLocaleString("en-IN")} sq ft each`
            : `${Math.min(...areas).toLocaleString("en-IN")}–${Math.max(...areas).toLocaleString("en-IN")} sq ft`}
          {" · drawn to scale, not photographed"}
        </p>
      </header>
      <div className="unit-grid">
        {units.map((u) => <UnitCard key={u.name} unit={u} max={max} />)}
      </div>
    </section>
  );
}
