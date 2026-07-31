/**
 * THE APERTURE SYSTEM — one object, many vantages
 *
 * Wave 6.5 · from GC_CardAperture (signed off)
 * Authority: L1-01 §29 · GC.SYSTEM Tier 04/06
 *
 * ── THE IDEA ─────────────────────────────────────────────────────────
 * The same Business Object is rendered differently depending on where the
 * viewer is standing. Kyoto House on the gateway is a photograph, a name
 * and one yield figure. The same Kyoto House in the capital console is an
 * identifier, a valuation to four decimal places, live telemetry and a
 * ledger.
 *
 * Nothing about the object changed. The aperture did.
 *
 * ── WHY THE METAPHOR IS EXACT ────────────────────────────────────────
 * An aperture controls how much light reaches the film. It does not alter
 * what is in front of the lens. That is the constraint this system has to
 * honour: an aperture may show LESS, never DIFFERENT. A gateway aperture
 * that rounded a valuation, or omitted its provenance while still showing
 * the number, would not be a narrower aperture — it would be a different
 * photograph.
 *
 * ── WHY "VANTAGE" ────────────────────────────────────────────────────
 * The source prototype named these after a word §25 forbids — it belongs
 * to the Operating Company, and the Member Law replaced it. A vantage is
 * where you are standing when you look at something, which is what these
 * actually are, so the canonical term is also the more accurate one.
 */

import { BusinessObjectType as BO } from "./business-objects";
import type { ILLevel } from "./organisms";
import type { RouteGroup } from "./layout";

export type Vantage = "gateway" | "space" | "capital" | "time" | "member" | "admin";

/**
 * How much the aperture is open. Not a size — a disclosure level.
 */
export type Opening =
  /** Photograph and a name. One or two figures, revealed on intent. */
  | "narrow"
  /** The object's own story: its fields, its state, its history. */
  | "standard"
  /** Everything, plus telemetry, provenance and the actions that change it. */
  | "wide";

export interface ApertureField {
  /** UFR id or derived name. Must exist — organism-lint checks it. */
  source: string;
  il: ILLevel;
  /**
   * Hidden until the viewer signals intent (hover, focus, tap).
   *
   * Progressive disclosure, not concealment: a deferred field is still
   * present in the DOM and reachable by keyboard. Hiding a figure from a
   * screen reader because it looked busy is not a narrow aperture, it is a
   * broken one.
   */
  deferred?: boolean;
}

export interface Aperture {
  id: string;
  object: BO;
  vantage: Vantage;
  opening: Opening;
  /** What this vantage is for. One sentence. */
  intent: string;
  /**
   * Additional objects this aperture draws from.
   *
   * A member's property card is genuinely a composition — "this property,
   * and my position in it". Declaring it keeps the linter from reading
   * OwnershipPosition fields as Property fields that the console forgot.
   */
  composes?: readonly BO[];
  fields: readonly ApertureField[];
  /** Deliberately absent here, and why. */
  withholds: string;
  /** Actions offered. Empty where the vantage is read-only. */
  actions: readonly string[];
}

const F = (source: string, il: ILLevel, deferred = false): ApertureField =>
  deferred ? { source, il, deferred } : { source, il };

// ─────────────────────────────────────────────────────────────────────
// PROPERTY — the worked example from the prototype
// ─────────────────────────────────────────────────────────────────────

export const PROPERTY_GATEWAY: Aperture = {
  id: "AP-01",
  object: BO.Property,
  vantage: "gateway",
  opening: "narrow",
  intent: "Make someone want to know more, without telling them anything untrue.",
  fields: [
    F("UFR-0060", 1),           // property_name — the titan header
    F("UFR-0063", 5),           // jurisdiction
    F("derived.yield", 2, true), // revealed on intent
    F("derived.availability", 3, true),
  ],
  withholds:
    "Valuation, valuation source, vehicle, lifecycle state, reserve position. Not because they " +
    "are secret — every one is one click away in the console — but because a figure shown " +
    "without its provenance invites a decision it cannot support.",
  actions: ["Open console"],
};

export const PROPERTY_CONSOLE: Aperture = {
  id: "AP-02",
  object: BO.Property,
  vantage: "capital",
  opening: "wide",
  intent: "Let someone who is accountable for this asset see everything that bears on it.",
  fields: [
    F("UFR-0060", 1),   // property_name
    F("derived.assetId", 5),
    F("UFR-0102", 1),   // latest valuation
    F("UFR-0103", 4),   // valuation source — directly beneath the figure
    F("UFR-0101", 5),   // valued on
    F("derived.yield", 1),
    F("UFR-0066", 3),   // lifecycle state
    F("UFR-0061", 4),   // vehicle
    F("UFR-0063", 5),   // jurisdiction
    F("UFR-0065", 5),   // land area — added: the wide aperture omitted what AP-03 showed
    F("UFR-0068", 5),   // environmental commitments — same
    F("UFR-0067", 5),   // stabilised on
    F("derived.coordinates", 6),
    F("derived.telemetryStatus", 4),
  ],
  withholds:
    "Nothing. This is the widest aperture on a Property, and the linter enforces that literally: " +
    "it may not omit a field any narrower vantage shows.",
  actions: ["Sync telemetry", "View ledger", "Record valuation"],
};

export const PROPERTY_SPACE: Aperture = {
  id: "AP-03",
  object: BO.Property,
  vantage: "space",
  opening: "standard",
  intent: "Show the asset as an asset: what it is, where it is, how it is held.",
  fields: [
    F("UFR-0060", 1), F("UFR-0066", 2), F("UFR-0102", 2), F("UFR-0103", 4),
    F("UFR-0065", 4), F("UFR-0063", 4), F("UFR-0068", 5),
  ],
  withholds: "Live telemetry and ledger actions — those belong to the capital vantage.",
  actions: ["Open", "View thesis"],
};

export const PROPERTY_MEMBER: Aperture = {
  id: "AP-04",
  object: BO.Property,
  vantage: "member",
  opening: "standard",
  intent: "Show a holder what they own, and what it has done for them.",
  composes: [BO.OwnershipPosition],
  fields: [
    F("UFR-0060", 1), F("UFR-0063", 5),
    F("UFR-0242", 2), F("UFR-0243", 3),   // OwnershipPosition — see `composes`
    F("UFR-0102", 2), F("UFR-0103", 4), F("derived.distributionsToDate", 2),
  ],
  withholds:
    "Operator telemetry and acquisition terms. A holder is owed what their capital did, not " +
    "the operating detail beneath it.",
  actions: ["View reports", "View documents"],
};

// ─────────────────────────────────────────────────────────────────────
// OTHER OBJECTS — the pattern generalises
// ─────────────────────────────────────────────────────────────────────

export const DISTRIBUTION_MEMBER: Aperture = {
  id: "AP-10",
  object: BO.Distribution,
  vantage: "member",
  opening: "standard",
  intent: "Answer 'was I paid, how much, and if not why not'.",
  fields: [
    F("derived.myAllocation", 1), F("UFR-0263", 3),
    F("derived.blockedReason", 1), F("UFR-0261", 4),
  ],
  withholds:
    "Other holders' allocations. A member sees their own line and the aggregate, never another " +
    "member's position.",
  actions: [],
};

export const DISTRIBUTION_CONSOLE: Aperture = {
  id: "AP-11",
  object: BO.Distribution,
  vantage: "capital",
  opening: "wide",
  intent: "Show the full waterfall, including what did not get paid.",
  fields: [
    F("UFR-0264", 1), F("UFR-0261", 2), F("UFR-0262", 1),
    F("derived.shortfall", 2), F("UFR-0263", 5), F("derived.reserveBand", 2),
  ],
  withholds:
    "Nothing. An operator who cannot see a shortfall cannot act on one.",
  actions: ["Execute distribution", "Reconcile", "Export"],
};

export const RESOLUTION_MEMBER: Aperture = {
  id: "AP-20",
  object: BO.Resolution,
  vantage: "member",
  opening: "standard",
  intent: "Show what was decided and on what basis.",
  fields: [
    F("UFR-0300", 1), F("UFR-0305", 1), F("UFR-0301", 3),
    F("UFR-0302", 2), F("UFR-0303", 2), F("UFR-0306", 3),
  ],
  withholds:
    "How any named holder voted. The ballot is sealed (I-05) and there is no aperture — at any " +
    "vantage, including admin — that opens onto it.",
  actions: ["Cast vote"],
};

export const APERTURES: readonly Aperture[] = [
  PROPERTY_GATEWAY, PROPERTY_CONSOLE, PROPERTY_SPACE, PROPERTY_MEMBER,
  DISTRIBUTION_MEMBER, DISTRIBUTION_CONSOLE, RESOLUTION_MEMBER,
];

// ─────────────────────────────────────────────────────────────────────
// THE LAWS
// ─────────────────────────────────────────────────────────────────────

/**
 * An aperture may show LESS. It may never show DIFFERENT.
 *
 * This is the whole constraint, and it is enforceable: the same UFR id
 * rendered at two vantages must resolve to the same value, formatted by
 * the same metric grammar, carrying the same provenance.
 *
 * A gateway that rounded ₹12,48,92,110 to "₹12.5Cr" would be fine — that
 * is the compact form of the same figure. A gateway that showed a
 * management estimate where the console shows an independent valuation
 * would not be, however much better it looked.
 */
export const APERTURE_LAWS = {
  lessNotDifferent:
    "An aperture may show less. It may never show different. Same id, same value, same " +
    "provenance, at every vantage.",
  provenanceTravels:
    "A figure never appears without its confidence class being reachable. Narrow apertures may " +
    "defer it behind intent; they may not drop it.",
  deferredIsNotHidden:
    "A deferred field stays in the DOM and reachable by keyboard. Hiding a figure from a screen " +
    "reader because the layout looked busy is a broken aperture, not a narrow one.",
  sealedStaysSealed:
    "No aperture at any vantage opens onto a sealed ballot (I-05). Withholding here is not a " +
    "presentation choice — it is the invariant.",
  widerNeedsAuthority:
    "A wider aperture is gated by the same rights as the commands it offers. Seeing the ledger " +
    "and posting to it are different rights, but neither is granted by navigation.",
} as const;

/** Vantage maps one-to-one onto the route groups. */
export const VANTAGE_ROUTE: Record<Vantage, RouteGroup> = {
  gateway: "gateway", space: "space", capital: "capital",
  time: "time", member: "member", admin: "admin",
};

export const aperturesFor = (o: BO): Aperture[] => APERTURES.filter((a) => a.object === o);
export const apertureAt = (o: BO, v: Vantage): Aperture | undefined =>
  APERTURES.find((a) => a.object === o && a.vantage === v);

/** Fields common to two apertures on the same object — these must agree exactly. */
export function sharedFields(a: Aperture, b: Aperture): string[] {
  const bs = new Set(b.fields.map((f) => f.source));
  return a.fields.map((f) => f.source).filter((s) => bs.has(s));
}

/**
 * Opening should widen as the vantage becomes more accountable.
 *
 * A member sees more than a visitor; an operator sees more than a member.
 * An aperture that inverts this is usually a mistake — it means a
 * marketing surface is showing something the console does not.
 */
export const OPENING_RANK: Record<Opening, number> = { narrow: 0, standard: 1, wide: 2 };

// ─────────────────────────────────────────────────────────────────────
// APERTURE ATOMS
// ─────────────────────────────────────────────────────────────────────

/**
 * The ring cursor. 24px idle, 64px over an aperture.
 *
 * One of only three places a circle is permitted (with status LEDs and the
 * health ring). It is a lens, which is the point.
 *
 * NOTE ON TOKENS: the prototype used forest → gold. Forest on void is
 * 1.38:1 and effectively invisible, so the idle ring uses `forestLight`,
 * the ground variant added for exactly this case.
 */
export const APERTURE_RING = {
  idle: { size: 24, border: "1px", tone: "forestLight" },
  overAperture: { size: 64, border: "1px", tone: "copper", fill: "rgba(199,159,107,0.05)" },
  transition: { duration: "320ms", curve: "ease-settle" },
  reducedMotion: "No size transition. The ring changes tone only.",
  pointerFallback: "Native cursor on touch and where a pointer is coarse.",
} as const;

/**
 * Value transitions. The prototype scrambled digits before locking.
 *
 * ⚠️ SCRAMBLE IS BARRED ON MONEY. A scramble briefly renders random digits
 * in a currency field — for ~400ms the interface displays a figure that is
 * not the value, was never the value, and is indistinguishable from one
 * that is. On an identifier that is a flourish; on a valuation it is a
 * false statement rendered in the currency tone.
 *
 * Money counts up from the previous value instead. It reads as change,
 * which is what happened, and every intermediate frame is a real number
 * between two real numbers.
 */
export const VALUE_TRANSITION = {
  identifier: { effect: "scramble", duration: "400ms", note: "Fine here. An id has no magnitude to misread." },
  label: { effect: "scramble", duration: "400ms" },
  money: {
    effect: "count",
    from: "previous value",
    duration: "400ms",
    scramblePermitted: false,
    why: "A scramble renders digits that were never the value, in the currency tone.",
  },
  percentage: { effect: "count", duration: "400ms", scramblePermitted: false },
  /** 120ms flash on settle. Confirms the value moved without animating it. */
  settle: { effect: "flash", duration: "120ms", curve: "step-end" },
} as const;

/**
 * The ticker. A transmission line, not a toast.
 *
 * It reports what the SYSTEM did — sync complete, telemetry stable. Toasts
 * (NT-01) report what the MEMBER did. Keeping them apart matters: a system
 * line that auto-dismisses is fine, because nothing was asked of anyone.
 */
export const SIGNAL_APERTURE = {
  position: "top right",
  type: "micro",
  autoDismiss: "4200ms",
  tones: { info: "steel", success: "confirm", critical: "critical" },
  distinctFrom: "NT-01 Toast, which reports member actions and lands in the Alert Center.",
  entersAlertCenter: false,
} as const;
