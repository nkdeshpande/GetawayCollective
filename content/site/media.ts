/**
 * SITE MEDIA — the pictures an estate has, named once
 *
 * 1 Oct 2026. Until now every picture on the site was a drawn film (a
 * canvas of ridgelines), because no estate had pictures of its own.
 * SlowSpace Creek now has: the isometric illustrations of its location-brand
 * media register, rebuilt on 1 Oct 2026 from the approved scene. They are
 * illustrations of something unbuilt, every one, and render.ts plate()
 * says so on each.
 *
 * A picture is referred to as "<estate>/<name>" (for example "creek/hero").
 * The files are public/images/site/<estate>/<name>-<width>.webp, cut by
 * scripts/gen-site-media.js; tests/site-media.test.ts holds this list, that
 * script and the files on disk to one another.
 *
 * `alt` describes what is drawn. plate() prefixes it with "Illustration,
 * unbuilt:" so no reader of any kind takes a drawing for a photograph.
 */

export interface Plate {
  /** Intrinsic width and height of the larger file. */
  readonly w: number;
  readonly h: number;
  /** The smaller file's width. */
  readonly small: number;
  readonly alt: string;
}

const wide = (alt: string): Plate => ({ w: 1800, h: 1013, small: 900, alt });
const tall = (alt: string): Plate => ({ w: 1000, h: 1500, small: 600, alt });
const square = (alt: string): Plate => ({ w: 1200, h: 1200, small: 600, alt });

export const MEDIA: Readonly<Record<string, Readonly<Record<string, Plate>>>> = {
  creek: {
    "hero": wide("the estate from above, with the gate at the corner of the land, the commons, five clusters of keys, the stream and the lake"),
    "hero-tall": tall("the estate from above, with the commons, clusters of keys and the stream"),
    "place": wide("the stream crossing the estate, with the timber crossing, the lake and the sauna beyond"),
    "arrival": wide("the gate at the corner of the land, the drive, the solar array and the plant yard"),
    "commons": wide("the commons and its pavilion beside the arrival court"),
    "cluster": wide("one cluster: four keys under one roof, with the yard and the pool below them"),
    "water": wide("the stream between two clusters, with a crossing over it"),
    "sauna": wide("the sauna at the edge of the lake"),
    "night": wide("the commons at night, lit by lamps along the paths"),
    "clusters": wide("two clusters above the stream, each with its own yard and pool"),
    "yard": wide("a cluster's yard and pool, in the shade of the keys above"),
    "keys-plan": wide("four keys seen from above with their roof removed, each opening to a deck"),
    "cluster-plan": wide("a cluster seen from above: the roof, the yard and the pool"),
    "lake-plan": wide("the lake and the sauna seen from above"),
    "lake": wide("the lake among the trees, with the sauna on its edge"),
    "masterplan": wide("the whole estate seen from above: five clusters, the commons, the stream and the lake"),
    "stream-walk": wide("the walk beside the stream, with a crossing"),
    "court": square("the arrival court and the roof of the commons"),
    "table": square("the commons seen from above: one long table and a fire"),
    "lamps": square("the commons after dark, with lamps along the paths"),
    "cluster-west": square("a cluster seen from the west, with its yard and pool"),
    "keys": square("four keys seen from above, each with its deck over the yard"),
    "path": square("three clusters and the commons, joined by one path"),
    "crossing": square("the crossing over the stream"),
    "sauna-lake": square("the sauna on the lake"),
    "stream": square("the stream between the clusters"),
  },
  /* 4 Oct 2026. Seaside Confluence, from its own media register (rebuilt 1 Oct
     2026 from the road-to-river model). Under construction, and still drawn:
     nothing here is a photograph of the building. */
  confluence: {
    "hero": wide("the estate from above, on the river side: the building of twelve keys on its piles, the plaza and its pool, the walk between them and the dock on the river"),
    "hero-tall": tall("the estate from above: the plaza and its pool, and the building of twelve keys beside the river"),
    "place": wide("the estate from the air, from the road to the river: the arrival court, the plaza and its pool, the keys and the dock"),
    "keys": wide("the twelve keys on two levels, stood on piles over open ground, with the walk to the river below"),
    "stair": wide("the open stair that climbs from the ground to the upper level"),
    "plaza": wide("the ramp rising beside the plaza to its deck"),
    "arrival": wide("the arrival court between its low walls, with two people walking in"),
    "river": wide("the river from a balcony, with the dock below and palms on the far bank"),
    "walk": wide("the sea and the sand at low tide"),
    "veranda": wide("the deck beside the plaza, in the rain"),
    "fire": wide("the building at dusk, lit from within"),
    "tide-table": wide("the deck beside the plaza in evening light"),
    "dock": wide("the walk to the dock on the river, at slack tide"),
    "zones": wide("the estate seen from above: the arrival court, the plaza and its pool, the keys and the dock on the river"),
    "site-plan": wide("the whole site seen from above, from the road to the river"),
    "key-section": wide("a cross-section through the building: two levels of keys on a steel frame, over open ground"),
    "plaza-plan": wide("the plaza seen from above: the pool, the hall and the walk to the keys"),
    "balcony": square("the river and the far bank, seen from a balcony"),
    "veranda-rain": square("rain falling beside the plaza's deck"),
    "procession": square("the procession rising from the court towards the deck"),
  },
};

export const plateOf = (ref: string): (Plate & { readonly base: string }) | undefined => {
  const [estate, name] = ref.split("/");
  const p = MEDIA[estate]?.[name];
  return p ? { ...p, base: `/images/site/${estate}/${name}` } : undefined;
};
