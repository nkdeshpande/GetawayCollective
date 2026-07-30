/**
 * MONEY — exact decimal arithmetic
 *
 * Wave 2 · packages/core/logic in the target architecture
 * Serves: F-02 (Ownership Conservation) · F-03 (Capital Is Accounted)
 *         F-05 (Waterfall Determinism) · F-15 (Revenue Base Determinism)
 *
 * ── WHY NOT `number` ─────────────────────────────────────────────────
 * IEEE-754 cannot represent 0.1. This platform runs a six-stage waterfall,
 * two 2.5% reserve transfers, and a floor comparison over the same figure.
 * Error accumulates until F-02 (units held must sum to units issued) and
 * F-03 (capital sits in exactly one of five states) fail by pennies, and
 * then by more. A ledger that is nearly right is wrong.
 *
 * Money is a bigint of MINOR UNITS scaled by 10^4, matching the
 * numeric(20,4) column the schema generator emits and the decimal-string
 * contract the Zod layer enforces. One representation, three layers.
 *
 * ── THE ALLOCATION PROBLEM ───────────────────────────────────────────
 * ₹100 split three ways is ₹33.3333 each, which sums to ₹99.9999. The
 * missing unit has to go somewhere, and "wherever floating point put it"
 * is not an answer a capital account can survive.
 *
 * `allocate` uses the largest-remainder method: every part is floored, then
 * the leftover minor units are handed out one at a time to the parts with
 * the largest fractional remainder. The result ALWAYS sums to the input
 * exactly. That is what makes F-02 provable rather than approximate.
 */

export const SCALE = 4;
const FACTOR = 10n ** BigInt(SCALE);

/** Money in minor units (1/10000 of a currency unit). Opaque by convention. */
export type Money = bigint;

const DECIMAL = /^(-)?(\d+)(?:\.(\d{1,4}))?$/;

/**
 * Parse a decimal string. Rejects floats, exponent notation, and precision
 * beyond the ledger's four places — all three are silent-corruption vectors.
 */
export function money(input: string): Money {
  if (typeof input !== "string") {
    throw new TypeError(`money() takes a decimal string, received ${typeof input}. Numbers are rejected deliberately.`);
  }
  const m = DECIMAL.exec(input.trim());
  if (!m) {
    throw new RangeError(`"${input}" is not a valid money value. Expected a decimal string with at most ${SCALE} places.`);
  }
  const [, sign, whole, frac = ""] = m;
  const padded = (frac + "0".repeat(SCALE)).slice(0, SCALE);
  const value = BigInt(whole) * FACTOR + BigInt(padded);
  return sign ? -value : value;
}

export const ZERO: Money = 0n;

/** Format back to the canonical decimal string the contracts accept. */
export function format(v: Money): string {
  const neg = v < 0n;
  const abs = neg ? -v : v;
  const whole = abs / FACTOR;
  const frac = (abs % FACTOR).toString().padStart(SCALE, "0");
  return `${neg ? "-" : ""}${whole}.${frac}`;
}

export const add = (a: Money, b: Money): Money => a + b;
export const sub = (a: Money, b: Money): Money => a - b;
export const neg = (a: Money): Money => -a;
export const isZero = (a: Money): boolean => a === 0n;
export const isNegative = (a: Money): boolean => a < 0n;
export const gte = (a: Money, b: Money): boolean => a >= b;
export const lt = (a: Money, b: Money): boolean => a < b;
export const max = (a: Money, b: Money): Money => (a > b ? a : b);
export const min = (a: Money, b: Money): Money => (a < b ? a : b);
export const sum = (xs: Money[]): Money => xs.reduce((a, b) => a + b, 0n);

/**
 * Apply a rate expressed in basis points (1 bp = 0.01%).
 *
 * Rates are integers, never floats: 2.5% is `250`, not `0.025`. The two
 * constitutional reserve transfers are exactly 250 bp each, and expressing
 * them as floats would reintroduce the error this module exists to remove.
 *
 * Rounds half-up on the minor unit.
 */
export function applyRate(amount: Money, basisPoints: number): Money {
  if (!Number.isInteger(basisPoints)) {
    throw new TypeError(`basisPoints must be an integer; 2.5% is 250, not 0.025. Received ${basisPoints}.`);
  }
  const bp = BigInt(basisPoints);
  const neg = amount < 0n;
  const abs = neg ? -amount : amount;
  const scaled = abs * bp;
  const q = scaled / 10_000n;
  const r = scaled % 10_000n;
  const rounded = r * 2n >= 10_000n ? q + 1n : q;
  return neg ? -rounded : rounded;
}

/** Percentage of `amount` that `part` represents, in basis points. */
export function rateOf(part: Money, whole: Money): number {
  if (whole === 0n) return 0;
  return Number((part * 10_000n) / whole);
}

/**
 * Split `amount` across `weights` so the parts sum to `amount` EXACTLY.
 *
 * Largest-remainder method. Ties break toward the earlier index, which
 * makes the result deterministic — two runs over the same capital table
 * must produce byte-identical distributions or reconciliation is theatre.
 *
 * Returns one Money per weight, in input order.
 */
export function allocate(amount: Money, weights: bigint[]): Money[] {
  if (weights.length === 0) return [];
  if (weights.some((w) => w < 0n)) {
    throw new RangeError("allocate() weights must be non-negative.");
  }
  const total = weights.reduce((a, b) => a + b, 0n);
  if (total === 0n) {
    throw new RangeError("allocate() requires at least one positive weight; total weight is zero.");
  }

  const neg = amount < 0n;
  const abs = neg ? -amount : amount;

  const floors: Money[] = [];
  const remainders: { i: number; r: bigint }[] = [];
  let assigned = 0n;

  for (let i = 0; i < weights.length; i++) {
    const exact = abs * weights[i];
    const q = exact / total;
    floors.push(q);
    remainders.push({ i, r: exact % total });
    assigned += q;
  }

  let leftover = abs - assigned;
  // Descending remainder; earlier index wins a tie.
  remainders.sort((a, b) => (b.r === a.r ? a.i - b.i : b.r > a.r ? 1 : -1));
  for (let k = 0; leftover > 0n; k++, leftover--) {
    floors[remainders[k % remainders.length].i] += 1n;
  }

  return neg ? floors.map((f) => -f) : floors;
}

/**
 * Draw up to `requested` from `available`.
 * Returns what was taken and what remains — the primitive the waterfall
 * runs on, where each stage consumes from a shrinking pool.
 */
export function draw(available: Money, requested: Money): { taken: Money; remaining: Money } {
  if (requested < 0n) throw new RangeError("draw() cannot request a negative amount.");
  const taken = available < requested ? available : requested;
  return { taken, remaining: available - taken };
}
