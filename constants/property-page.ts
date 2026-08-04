/**
 * THE PROPERTY PAGE — one place, told in order
 *
 * Authority: the GC property page wireframe, 4 Aug 2026.
 * Data: constants/vehicles.ts (the LLP) · constants/spatial.ts (the ground)
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────
 * The wireframe's twelve sections as a registry, so the three pages are
 * one component reading three rows rather than three hand-built pages
 * that drift apart by the second edit.
 *
 * Almost nothing here is prose typed by hand. Each section names WHERE
 * its content comes from, and the ones that need words a registry cannot
 * supply — an opening note, an architectural intent — carry them per
 * estate below, checked by the same linters as everything else in
 * content/.
 *
 * ── THE PAGE IS ORDERED, AND THE ORDER IS THE ARGUMENT ───────────────
 * Desire first, then inspection. The wireframe puts the hero and the
 * opening note before a single figure, and the vehicle and the evidence
 * after the architecture. That is deliberate: somebody who does not want
 * the place should not be reading a waterfall, and somebody who does
 * should not have to leave to find one.
 *
 * ── MEDIA IS DECLARED BEFORE IT EXISTS ───────────────────────────────
 * There are two image files in this repository. Every frame the wireframe
 * asks for is declared here as a SLOT with its subject, its kind and its
 * aspect, and renders as a labelled placeholder until a real asset is
 * registered against it.
 *
 * That is the honest way round. A page built to fit whatever photographs
 * happen to exist cannot say what is missing; a page built to a declared
 * shot list can, and the gap is then a commission brief rather than a
 * vague intention. `mediaGap()` counts it.
 */

import { VEHICLES, type VehicleKey } from "./vehicles";

/** What a frame IS. Never inferred from the file — always declared. */
export type MediaKind =
  | "photograph"
  | "render"
  | "drawing"
  | "site-image"
  | "portrait";

export type Aspect = "full-bleed" | "wide" | "square" | "portrait";

/**
 * One declared frame.
 *
 * `asset` is null until something real is registered. The wireframe's own
 * instruction — "image type and date remain attached to every frame" — is
 * why `kind` is required and why a slot with an asset must also carry the
 * date it was taken.
 */
export interface MediaSlot {
  readonly id: string;
  readonly subject: string;
  readonly kind: MediaKind;
  readonly aspect: Aspect;
  /** Path under /public once one exists. Null means: not yet shot. */
  readonly asset: string | null;
  /** When it was taken or produced. Required whenever `asset` is set. */
  readonly taken?: string;
}

const slot = (
  id: string, subject: string, kind: MediaKind, aspect: Aspect,
): MediaSlot => ({ id, subject, kind, aspect, asset: null });

/* ── The twelve sections ─────────────────────────────────────────── */

export type SectionId =
  | "hero" | "spine" | "opening" | "authors" | "site" | "architecture"
  | "spaces" | "materials" | "vehicle" | "evidence" | "invitation" | "footer";

export const SPINE: readonly { id: SectionId; label: string }[] = [
  { id: "opening", label: "Overview" },
  { id: "site", label: "Place" },
  { id: "architecture", label: "Architecture" },
  { id: "spaces", label: "Spaces" },
  { id: "materials", label: "Materials" },
  { id: "vehicle", label: "Vehicle" },
  { id: "evidence", label: "Evidence" },
];

/** One visual chapter under THE SPACES. */
export interface Chapter {
  readonly name: string;
  /** One short architectural statement. Not a description of the image. */
  readonly statement: string;
  readonly dominant: MediaSlot;
  readonly supporting: readonly MediaSlot[];
}

/**
 * What a reader may open at each vantage.
 *
 * Wired to the platform's real access ladder rather than invented: public
 * needs nothing, private needs qualification (INV-090), and the holder
 * view needs a settled position. The wireframe's three tiers and the
 * route table's five vantages line up on exactly these three.
 */
export interface EvidenceTier {
  readonly tier: "public" | "private" | "holder";
  readonly holds: string;
  readonly action: string;
  readonly to: string;
}

export const EVIDENCE_TIERS: readonly EvidenceTier[] = [
  { tier: "public", holds: "Property overview, architectural intent, the ownership basis",
    action: "Open", to: "" },
  { tier: "private",
    holds: "Vehicle materials, diligence, risk disclosure, the projected programme",
    action: "Request", to: "/invest/qualify" },
  { tier: "holder",
    holds: "Progress reporting, resolutions, the capital record, the time basis",
    action: "Private view", to: "/portfolio" },
];

export interface PropertyPage {
  readonly vehicle: VehicleKey;
  /** Above the hero. Brand over place, as the wireframe sets it. */
  readonly eyebrow: string;
  /** The one line over the hero image. Six words or fewer. */
  readonly headline: string;
  readonly hero: MediaSlot;

  /** THE OPENING NOTE — two lines, then one paragraph. */
  readonly openingTitle: readonly [string, string];
  readonly opening: string;

  /** THE SITE — what the landscape decides. */
  readonly siteImage: MediaSlot;
  readonly siteNote: string;
  readonly access: string;
  readonly protection: string;

  /** ARCHITECTURAL INTENT — mass and light, then two frames. */
  readonly mass: string;
  readonly light: string;
  readonly exterior: MediaSlot;
  readonly architectureFrames: readonly MediaSlot[];

  readonly chapters: readonly Chapter[];

  /** MATERIAL PALETTE — four, each one word and one clause. */
  readonly palette: readonly { material: string; role: string; slot: MediaSlot }[];
}

/* ═══════════════════════════════════════════════════════════════════
   SOLACE · Chikkaballapur
   ═══════════════════════════════════════════════════════════════════ */

const SOLACE: PropertyPage = {
  vehicle: "solace",
  eyebrow: "SlowSpace / Chikkaballapur",
  headline: "A house on a rock, in the dry light.",
  hero: slot("solace.hero", "Rocky plateau at low sun, warm interior light", "render", "full-bleed"),

  openingTitle: [
    "Not a destination to consume.",
    "A place to return to.",
  ],
  opening:
    "Solace sits on a rocky plateau outside Chikkaballapur, in a dry landscape that gives back " +
    "silence and a very long horizon. Six keys, on ground held partly freehold and partly on a " +
    "lease, in one vehicle with a defined number of ownership interests. It is the smallest of the " +
    "three and the one the whole system is proved on.",

  siteImage: slot("solace.site", "Plateau, scrub, granite, distance", "site-image", "wide"),
  siteNote:
    "An arid hill site behaves nothing like the other two. Water has to be caught rather than " +
    "shed, shade is structural rather than decorative, and the horizon is the asset — which is " +
    "why the buildings are low, heavy and turned outward only where there is something to turn to.",
  access: "By road from Bengaluru. The nearest airport is Kempegowda.",
  protection:
    "8 guntas owned freehold and 1 acre 14 guntas held on lease. The owned parcel and the leased " +
    "land are different tenures and the vehicle holds both differently.",

  mass:
    "Heavy, shaded, cell-like enclosures. The walls do the work that shading devices would do on " +
    "a lighter building, and the interior stays cool without asking a machine to make it so.",
  light:
    "Daylight is shaped rather than admitted. Courtyards bring it in sideways, at an angle the " +
    "plateau's own sun never manages on its own.",
  exterior: slot("solace.exterior", "Approach across the plateau, gabled voids against sky", "render", "wide"),
  architectureFrames: [
    slot("solace.arrival", "Arrival court, hand-set aggregate underfoot", "render", "square"),
    slot("solace.edge", "Courtyard edge where the enclosure opens", "render", "square"),
  ],

  chapters: [
    {
      name: "Arrival",
      statement:
        "Arrival is slowed deliberately. Heavy hand-set aggregate forces a walking pace, and the " +
        "vestibule is an airlock rather than a desk.",
      dominant: slot("solace.ch1", "Arrival court and entry vestibule", "render", "full-bleed"),
      supporting: [
        slot("solace.ch1a", "Gravel and stone underfoot", "photograph", "square"),
        slot("solace.ch1b", "Threshold detail", "render", "square"),
        slot("solace.ch1c", "First view through", "render", "square"),
      ],
    },
    {
      name: "The Pavilion",
      statement:
        "Three levels: the working vault below, the social floor at grade with a monolithic brew " +
        "bar and open hearth, and a timber loft under an asymmetric pitched canopy.",
      dominant: slot("solace.ch2", "Pavilion hub, social floor, mirror pool basin", "render", "full-bleed"),
      supporting: [
        slot("solace.ch2a", "Brew bar in granite", "render", "square"),
        slot("solace.ch2b", "Open hearth", "render", "square"),
        slot("solace.ch2c", "Timber loft under the canopy", "render", "square"),
      ],
    },
    {
      name: "Earth and Sky",
      statement:
        "Two grounded courtyard keys, two elevated ones under a horizon visor, and two gabled " +
        "twins with private onsens under five-and-a-half-metre voids.",
      dominant: slot("solace.ch3", "Sky canopy interior looking to the horizon", "render", "full-bleed"),
      supporting: [
        slot("solace.ch3a", "Earth key courtyard", "render", "square"),
        slot("solace.ch3b", "Visor canopy from below", "render", "square"),
        slot("solace.ch3c", "Backyard onsen", "render", "square"),
      ],
    },
    {
      name: "The Aether Void",
      statement:
        "A mid-site reset with no building on it at all. Unpaved meandering paths that narrow " +
        "walking speed, and nothing to look at but the plateau.",
      dominant: slot("solace.ch4", "Unpaved trail across the sensory reset field", "site-image", "full-bleed"),
      supporting: [
        slot("solace.ch4a", "Path underfoot", "photograph", "square"),
        slot("solace.ch4b", "Scrub and rock", "photograph", "square"),
        slot("solace.ch4c", "Long view", "photograph", "square"),
      ],
    },
  ],

  palette: [
    { material: "Granite", role: "Local mass, and the brew bar cut from one piece",
      slot: slot("solace.mat1", "Granite", "photograph", "square") },
    { material: "Fair-faced concrete", role: "Cast once, left as struck",
      slot: slot("solace.mat2", "Concrete", "photograph", "square") },
    { material: "Timber", role: "The loft canopy, and warmth against the stone",
      slot: slot("solace.mat3", "Timber", "photograph", "square") },
    { material: "Charred cladding", role: "Shou sugi ban on the working block, to disappear it",
      slot: slot("solace.mat4", "Charred timber", "photograph", "square") },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   CONFLUENCE · Mangaluru–Udupi
   ═══════════════════════════════════════════════════════════════════ */

const CONFLUENCE: PropertyPage = {
  vehicle: "slowspace",
  eyebrow: "SlowSpace / Coastal",
  headline: "Where the river gives up and the sea takes over.",
  hero: slot("confluence.hero", "Estuary at dusk, sandbar, warm interior light", "render", "full-bleed"),

  openingTitle: [
    "Not a destination to consume.",
    "A place to return to.",
  ],
  opening:
    "Confluence sits on a sandbar at Padubidri with the Arabian Sea on one side and the Shambhavi " +
    "estuary on the other. Twelve keys, half grounded and half elevated, in a vehicle that is " +
    "already most of the way subscribed. It is the coastal prototype, and it is the one being " +
    "used to prove the LLP ownership structure itself.",

  siteImage: slot("confluence.site", "Sandbar between sea and estuary, from the air", "site-image", "wide"),
  siteNote:
    "Two waters, and they behave differently. The sea sets the salt load and the wind; the estuary " +
    "sets the tide, the acoustics and what can be built near the edge. Dual frontage is the reason " +
    "this site is worth having and the reason it is difficult.",
  access: "Coastal road between Mangaluru and Udupi. Mangaluru airport is the nearest.",
  protection:
    "CRZ compliant, Blue Flag adjacent. Coastal regulation governs what may be built and how close " +
    "to the water, and that constraint is a protection rather than an obstacle.",

  mass:
    "A floating horizontal canopy over monolithic chassis. Deep overhangs take the rain off the " +
    "wall before it reaches the ground, which is what survives a fifth monsoon.",
  light:
    "Framed rather than flooded. The compression corridor at the entrance lowers the light before " +
    "the horizon reveal, so the estuary arrives all at once.",
  exterior: slot("confluence.exterior", "West coast pavilion from the water", "render", "wide"),
  architectureFrames: [
    slot("confluence.arrival", "Board-formed concrete arrival portal", "render", "square"),
    slot("confluence.terrace", "Terrace at the estuary edge", "render", "square"),
  ],

  chapters: [
    {
      name: "The Portal",
      statement:
        "A monolithic board-formed compression corridor. It reduces what you are attending to, on " +
        "purpose, immediately before the main horizon reveal.",
      dominant: slot("confluence.ch1", "Airlock and arrival portal", "render", "full-bleed"),
      supporting: [
        slot("confluence.ch1a", "Board-formed concrete detail", "photograph", "square"),
        slot("confluence.ch1b", "Cobblestone vehicle loop", "photograph", "square"),
        slot("confluence.ch1c", "The reveal", "render", "square"),
      ],
    },
    {
      name: "West Coast Pavilion",
      statement:
        "Tri-level social core. The vault below holds the heavy plant and the pool surge tanks so " +
        "that nothing above it has to be about machinery.",
      dominant: slot("confluence.ch2", "Social deck, timber and glass, facing west", "render", "full-bleed"),
      supporting: [
        slot("confluence.ch2a", "Deck at golden hour", "render", "square"),
        slot("confluence.ch2b", "Interior at night", "render", "square"),
        slot("confluence.ch2c", "Timber and concrete junction", "photograph", "square"),
      ],
    },
    {
      name: "Earth and Sky Keys",
      statement:
        "Six grounded keys opening to private courtyards, and six elevated ones on post-tensioned " +
        "cantilevered view-visor decks.",
      dominant: slot("confluence.ch3", "Sky key deck over the estuary", "render", "full-bleed"),
      supporting: [
        slot("confluence.ch3a", "Earth key courtyard", "render", "square"),
        slot("confluence.ch3b", "Cantilever from below", "render", "square"),
        slot("confluence.ch3c", "Interior, morning", "render", "square"),
      ],
    },
    {
      name: "The Dock",
      statement:
        "A floating timber pontoon on tension-anchored piles. One centralised water body doing " +
        "acoustic masking and thermal cooling at the same time.",
      dominant: slot("confluence.ch4", "Estuarine riparian dock at slack tide", "render", "full-bleed"),
      supporting: [
        slot("confluence.ch4a", "Pontoon detail", "render", "square"),
        slot("confluence.ch4b", "Water at the edge", "photograph", "square"),
        slot("confluence.ch4c", "Estuary, evening", "photograph", "square"),
      ],
    },
  ],

  palette: [
    { material: "Laterite", role: "Local mass that darkens and stays sound",
      slot: slot("confluence.mat1", "Laterite", "photograph", "square") },
    { material: "Board-formed concrete", role: "The portal, and the grain of its formwork",
      slot: slot("confluence.mat2", "Concrete", "photograph", "square") },
    { material: "Timber", role: "Deck, pontoon, and everything touched by hand",
      slot: slot("confluence.mat3", "Timber", "photograph", "square") },
    { material: "Marine-grade steel", role: "Because salt finds every fixing",
      slot: slot("confluence.mat4", "Steel", "photograph", "square") },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   THE CREEK · Coorg
   ═══════════════════════════════════════════════════════════════════ */

const CREEK: PropertyPage = {
  vehicle: "coorgcreek",
  eyebrow: "SlowSpace / Coorg",
  headline: "Twenty houses that never touch each other.",
  hero: slot("creek.hero", "Stream through riparian forest, canopy above", "render", "full-bleed"),

  openingTitle: [
    "Not a destination to consume.",
    "A place to return to.",
  ],
  opening:
    "The Creek runs along a stream in riparian forest in Coorg, on ten acres — the largest of the " +
    "three by a wide margin. Twenty keys, divided into two quite different propositions: sixteen " +
    "on the upper escarpment among the trees, and four on tension piles over the water.",

  siteImage: slot("creek.site", "Stream, escarpment, forest canopy", "site-image", "wide"),
  siteNote:
    "The architecture is subservient to the terrain here — the ground is not cut to fit the " +
    "building. Sixteen keys are broken into four clusters of four precisely so the structures " +
    "disappear into the tree line rather than reading as a row.",
  access: "By road from Bengaluru or Mangaluru. Coorg has no airport of its own.",
  protection:
    "Land held under possession. Title, Land Reforms Act position and conversion status are not " +
    "yet verified, and that is stated here rather than discovered later.",

  mass:
    "Two chassis, one system. A ridge type at 465 sqft among the trees, and a larger sanctum at " +
    "550 sqft over the stream, both from the same formwork set.",
  light:
    "View cones angled outward at fifteen degrees, toward the canopy. The forest does the shading " +
    "and the building only has to frame it.",
  exterior: slot("creek.exterior", "Cluster among the trees, seen from below", "render", "wide"),
  architectureFrames: [
    slot("creek.pier", "Micro-piers hand-set into the forest floor", "drawing", "square"),
    slot("creek.stream", "Tension piles above the flood band", "drawing", "square"),
  ],

  chapters: [
    {
      name: "The Descent",
      statement:
        "A compression corridor winding down the escarpment. It briefly increases what you are " +
        "attending to rather than reducing it — the opposite of the coastal move, for the " +
        "opposite terrain.",
      dominant: slot("creek.ch1", "Airlock passage down the escarpment", "render", "full-bleed"),
      supporting: [
        slot("creek.ch1a", "Steps in the slope", "render", "square"),
        slot("creek.ch1b", "Canopy overhead", "photograph", "square"),
        slot("creek.ch1c", "Welcome pavilion", "render", "square"),
      ],
    },
    {
      name: "Explorer's Lounge",
      statement:
        "An open-air social deck projecting toward the stream, over a hydrostatically sealed vault " +
        "that holds everything nobody should have to see.",
      dominant: slot("creek.ch2", "Lounge deck projecting toward the water", "render", "full-bleed"),
      supporting: [
        slot("creek.ch2a", "Brew bar", "render", "square"),
        slot("creek.ch2b", "Deck edge", "render", "square"),
        slot("creek.ch2c", "Evening, lit", "render", "square"),
      ],
    },
    {
      name: "The Upper Escarpment",
      statement:
        "Sixteen keys in four clusters of four, on a pier field. The ground stays unsealed so root " +
        "networks survive and monsoon runoff moves as it always did.",
      dominant: slot("creek.ch3", "Ridge key among the trees", "render", "full-bleed"),
      supporting: [
        slot("creek.ch3a", "Pier field detail", "drawing", "square"),
        slot("creek.ch3b", "Interior toward the canopy", "render", "square"),
        slot("creek.ch3c", "Cluster from the path", "render", "square"),
      ],
    },
    {
      name: "The Riparian Edge",
      statement:
        "Four keys on a single linear cluster following the stream. Slender driven piles hold them " +
        "above the hundred-year flood band, and no wet concrete is permitted near the water.",
      dominant: slot("creek.ch4", "Stream-side key hovering over the water", "render", "full-bleed"),
      supporting: [
        slot("creek.ch4a", "Tension pile detail", "drawing", "square"),
        slot("creek.ch4b", "Water below the deck", "photograph", "square"),
        slot("creek.ch4c", "Cold plunge and thermal reset", "render", "square"),
      ],
    },
  ],

  palette: [
    { material: "Cast concrete", role: "The chassis, from one repeatable formwork set",
      slot: slot("creek.mat1", "Concrete", "photograph", "square") },
    { material: "Teak", role: "The floating platform, and everything underfoot at the water",
      slot: slot("creek.mat2", "Teak", "photograph", "square") },
    { material: "Steel", role: "Piles and suspension, where the ground cannot be trusted",
      slot: slot("creek.mat3", "Steel", "drawing", "square") },
    { material: "Forest floor", role: "Left unsealed, which is a material decision",
      slot: slot("creek.mat4", "Leaf litter and root", "photograph", "square") },
  ],
};

export const PROPERTY_PAGES: readonly PropertyPage[] = [CONFLUENCE, SOLACE, CREEK];

export const pageFor = (v: VehicleKey): PropertyPage | undefined =>
  PROPERTY_PAGES.find((p) => p.vehicle === v);

/** Every declared frame on one page, in the order it appears. */
export function slotsOf(p: PropertyPage): MediaSlot[] {
  return [
    p.hero, p.siteImage, p.exterior,
    ...p.architectureFrames,
    ...p.chapters.flatMap((c) => [c.dominant, ...c.supporting]),
    ...p.palette.map((m) => m.slot),
  ];
}

/**
 * The commission brief, computed.
 *
 * Two image files exist in this repository. Rather than let that sit as a
 * known-but-unmeasured gap, every page states how many frames it declares
 * and how many are filled — which turns "we need photography" into a
 * numbered shot list somebody can price.
 */
export function mediaGap(p: PropertyPage): {
  declared: number; filled: number; missing: MediaSlot[];
} {
  const all = slotsOf(p);
  const missing = all.filter((m) => m.asset === null);
  return { declared: all.length, filled: all.length - missing.length, missing };
}

export const PROPERTY_PAGE_LAWS = {
  desireBeforeInspection:
    "The hero and the opening note come before a single figure. Somebody who does not want the " +
    "place should not be reading a waterfall, and somebody who does should not have to leave to " +
    "find one.",
  everyFrameDeclaresItself:
    "A slot names its subject, its kind and its aspect before any asset exists. A page built to " +
    "fit whatever photographs happen to exist cannot say what is missing; one built to a declared " +
    "shot list can.",
  oneComponentThreePages:
    "Three properties, one renderer, three rows. Hand-built pages drift apart by the second edit.",
  figuresComeFromTheRegistry:
    "Nothing on this page types a number. Every figure is read from constants/vehicles.ts when the " +
    "page renders, so a page cannot describe a vehicle that does not exist.",
} as const;

/**
 * The browser-tab title for one property.
 *
 * Called by the generated page's generateMetadata. Returns null for a
 * slug that names no property, so the route table's own name is used
 * rather than a fabricated one — a title is a disclosure, and inventing
 * one for a URL nobody has built is how a 404 starts confirming things.
 */
export function propertyTitle(slug: string): string | null {
  const v = VEHICLES.find((x) => x.slug === slug);
  if (!v || !PROPERTY_PAGES.some((p) => p.vehicle === v.key)) return null;
  return `${v.propertyName} · Getaway Collective`;
}
