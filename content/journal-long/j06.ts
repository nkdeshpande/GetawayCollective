/* J-06 · Two waters — the long form (Journal 5x, 23 Oct 2026).
   Seaside Confluence's place. Figures are the entry's own, or read from the
   estate record (constants/vehicles.ts through app/_assemblies/slowspace.ts).
   Pictures are the estate's own drawings (confluence/*) and the coast film. */
import type { Block } from "../journal";
import { inr } from "../../app/_assemblies/data";
import { SITE, STACK } from "../../app/_assemblies/slowspace";

const KEYS = String(SITE.keys);

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "The land lies between an open sea and a river mouth. On the western edge the water is " +
    "surf. On the eastern edge, four hundred metres away, it is still enough to hold a " +
    "reflection. Little of the Karnataka coast offers both." },
  { t: "p", x:
    "The place is Padubidri, on the coast road north of Mangaluru. The Arabian Sea runs along one " +
    "side. The Shambhavi estuary runs along the other, slowing as it meets the sea. Between them " +
    "lies a strip of sand, palms and recent river silt." },
  { t: "p", x:
    "Seaside Confluence sits on that strip. This entry describes what two waters give an estate, " +
    "what they ask of the people who build it, and where the estate stands today." },
  { t: "figure", label: "Keys", value: KEYS,
    source: "Read from the estate record." },
  { t: "illus", plate: "confluence/hero", caption:
    "The estate from above on the river side: the keys on their piles, the plaza, the walk and the dock." },

  { t: "h", x: "A day between two edges" },
  { t: "p", x:
    "Walk the strip from west to east and the land changes character in four hundred metres. The " +
    "western edge is loud. Waves break in long lines, the sand is firm and wide at low tide, and " +
    "the wind comes straight off the water." },
  { t: "p", x:
    "Halfway across, the sound drops. Palms close in. The ground softens underfoot, because this " +
    "part of the strip was river bed not long ago. A heron may stand in a shallow channel and not " +
    "bother to move." },
  { t: "p", x:
    "At the eastern edge the water is flat. Fishing boats sit at the bank. The far shore is close " +
    "enough to see people on it. The river turns with the tide twice a day, and at slack water " +
    "the surface holds the sky." },
  { t: "p", x:
    "Through the day the two edges trade places. In the morning the sea is often calmer and the " +
    "river busy with boats. By afternoon the sea wind rises and the river shelters. At dusk the " +
    "sea turns to colour and the river turns to glass." },
  { t: "illus", film: ["coast", 6], caption:
    "Early light on the coast, drawn: the hour when the sea edge is brightest and the river still." },
  { t: "p", x:
    "Most coastal land offers one of these edges. The sea edge is dramatic and restless. The river " +
    "edge is calm and intimate. A visitor who wants one in the morning and the other at dusk " +
    "usually has to drive between them. Here they are a short walk apart." },
  { t: "story", title: "One afternoon, two waters", x: [
    "Picture a family from Bengaluru on the strip one afternoon after the estate opens, as the " +
      "drawings imagine it. They arrived before lunch, an hour from the airport. The children " +
      "went straight to the sea edge and came back salted and loud.",
    "By three the wind has risen and the surf is heavy. On a beach-only estate, that would end the " +
      "day's plans. Here the family walks four hundred metres east, under the keys and past the " +
      "plaza, to the dock on the river.",
    "The river is flat. A fisherman pushes off from the far bank. The children, who were shouting " +
      "over waves an hour ago, start whispering without being asked. Someone suggests a boat at " +
      "slack water before dusk.",
    "At dinner the father tries to describe the day to his mother on the phone. He settles on " +
      "\"two holidays in one afternoon\". That phrase is the whole case for the site, said by " +
      "someone who has read none of its plans.",
  ] },
  { t: "pull", x:
    "The sea frontage sells the winter; the estuary is calm in months when the surf is too rough " +
    "to use." },

  { t: "h", x: "What two waterfronts are worth" },
  { t: "p", x:
    "They are worth demand across the year. The sea frontage sells the winter; the estuary is " +
    "calm in months when the surf is too rough to use. An estate with one waterfront has one " +
    "season." },
  { t: "p", x:
    "On this coast the year divides cleanly. The dry months bring clear skies and a calm, warm " +
    "sea. Then the monsoon arrives, and the sea becomes something to watch from a distance. A " +
    "beach estate in those months sells the view of weather." },
  { t: "p", x:
    "The estuary keeps working when the sea closes. River water is sheltered. A boat can still go " +
    "out on it. A walk along it is still a walk. Rain on flat water is its own reason to " +
    "come. That second season is what the second edge buys." },
  { t: "graphic", g: { kind: "compare", head: ["The sea edge", "The estuary edge"], rows: [
    ["Its character", "Surf, wind, a wide beach at low tide", "Still water, a near bank, boats"],
    ["Its best months", "The dry winter", "The months when the surf is too rough to use"],
    ["What it asks of the build", "Resistance to salt and wind", "Resistance to humidity and soft ground"],
    ["Its rule", "The Coastal Regulation Zone line", "The Coastal Regulation Zone line"],
  ] }, caption: "Two edges, two seasons, one set of rules applied on both sides." },
  { t: "story", title: "Two coastal sites on one desk", x: [
    "Picture an analyst at a Mumbai family office with two coastal sites on her desk. Both are " +
      "drawn well. Both have a sea view and a reasonable road. On paper they look like the same " +
      "opportunity at slightly different prices.",
    "She sets them side by side on a calendar instead of a map. The first site faces only the " +
      "sea. Its strong months are clear, and so are its quiet ones. For a third of the year, its " +
      "main attraction is a wall of rain.",
    "The second site has a sea on one side and a river mouth on the other. Its strong months " +
      "match the first site's. Its quiet months are less quiet, because the river edge stays usable " +
      "when the sea does not.",
    "Demand depends on many things, and a fuller calendar is a forecast for either site. " +
      "What she has found is a structural difference. One site has a single reason to visit. The " +
      "other has two, and they peak at different times.",
    "She writes one line in her notes. \"Same coast, different year.\" That line is the case for " +
      "two waters, and it is a case about time rather than about scenery.",
  ] },
  { t: "p", x:
    "Two seasons matter for partners in a specific way. An estate's revenue arrives unevenly across " +
    "the year. A long quiet stretch is a long stretch in which costs continue and income slows. " +
    "A second edge that works in the quiet months shortens that stretch." },
  { t: "p", x:
    "It also widens who comes. Sea people and river people are often different people. One wants " +
    "surf and sun; the other wants birds, boats and quiet. An estate that suits both draws from " +
    "a larger pool of visitors, in more months." },
  { t: "illus", plate: "confluence/walk", caption:
    "The sea and the sand at low tide, on the western edge of the strip." },
  { t: "illus", plate: "confluence/river", caption:
    "The river from a balcony, with the dock below and palms on the far bank." },

  { t: "h", x: "What it asks of the build" },
  { t: "p", x:
    "Two waters mean two edges to hold: salt from one side, humidity from the other, on ground " +
    "that was recently river silt. Each of its keys costs more to build than it would inland." },
  { t: "p", x:
    "Salt is patient. It settles on every surface the sea wind reaches and works into steel, " +
    "fixings and finishes. A detail that lasts decades inland can fail in a few seasons a short " +
    "walk from surf. So the materials and coatings are chosen for the coast from the start." },
  { t: "p", x:
    "Humidity comes from the other side. River air is heavy for much of the year, and timber, " +
    "fabric and joinery respond to it. A building here needs air moving through it and surfaces " +
    "that tolerate damp without complaint." },
  { t: "p", x:
    "Then there is the ground. Recent river silt is soft, and it holds water. The drawings answer " +
    "it directly. The twelve keys stand on two levels, raised on piles over open ground. The " +
    "walk to the river passes beneath them." },
  { t: "p", x:
    "These are known problems with known answers. Builders on this coast have dealt with salt, " +
    "damp and soft ground for generations. The answers cost more, and they take discipline on " +
    "site. The estate prices both from the start rather than discovering them later." },
  { t: "illus", plate: "confluence/key-section", caption:
    "A cross-section through the building: two levels of keys on a steel frame, over open ground." },
  { t: "list", x: [
    "Salt from the west: coastal-grade steel, fixings and coatings, chosen for the sea air.",
    "Humidity from the east: air moving through the building, and surfaces that tolerate damp.",
    "Soft ground beneath: piles carrying the keys over open ground.",
    "Heavy rain from above: water free to pass under the building and away.",
  ] },
  { t: "p", x:
    "Raising the building does several jobs at once. It keeps the keys clear of soft, wet ground. " +
    "It lets water pass under the building in heavy rain. It lets air move beneath the floor. And " +
    "it keeps the ground level open for walking between the two waters." },
  { t: "p", x:
    "The estate record lists modular assembly among its commitments. Parts made off site and " +
    "assembled on it spend less time exposed to salt and rain during construction. On a strip " +
    "between two waters, fewer wet months on site is a practical advantage." },
  { t: "graphic", g: { kind: "compare", head: ["An inland site", "This strip"], rows: [
    ["The air", "Ordinary wear on steel and finishes", "Salt on one side, humidity on the other"],
    ["The ground", "Firm, built on directly", "Recent silt, so the keys stand on piles"],
    ["The rules", "Ordinary building approvals", "Coastal Regulation Zone rules on both edges"],
    ["The cost per key", "The baseline", "Higher, for every reason above"],
  ] }, caption: "The same twelve keys, and why they cost more here than they would inland." },
  { t: "p", x:
    "Maintenance follows the same logic. Coastal buildings ask for regular care: repainting, " +
    "resealing, replacing fixings on a shorter cycle than inland. The sinking fund in the payment " +
    "order exists for exactly this, setting money aside before anything fails." },
  { t: "p", x:
    "That higher cost is part of the estate's arithmetic from the first line. A coastal build " +
    "priced like an inland one would look cheaper on paper and cost more in its fifth year. " +
    "We prefer the figure that already knows where the building stands." },

  { t: "h", x: "The line on the survey plan" },
  { t: "assert", x:
    "India's Coastal Regulation Zone (CRZ) rules apply on both edges. Building positions are " +
    "fixed once the CRZ line is read from the survey plan. Drawings are then issued for " +
    "construction." },
  { t: "p", x:
    "The CRZ rules protect India's coastline by controlling what may be built near the water, and " +
    "where. On most coastal sites they bind one edge. Here they bind two, because a tidal estuary " +
    "counts as coastal water in its own right." },
  { t: "p", x:
    "The rules carry a benefit as well as a cost. The same line that limits this estate also " +
    "limits its neighbours. The beach and the river bank in front of the estate are protected " +
    "ground, which keeps the view and the shore open for decades." },
  { t: "p", x:
    "For a partner, that turns a planning rule into part of the asset. A waterfront that nobody " +
    "can build across holds its character. The estate pays for the rules in time and design, and " +
    "receives in return a setting that the same rules preserve." },
  { t: "p", x:
    "The practical effect is an order of work. The survey plan comes first. The CRZ line is read " +
    "from it. Only then are the building positions fixed, because a key placed before the line is " +
    "known might have to move." },
  { t: "p", x:
    "Reading the line is careful work. Surveyors fix the high-tide marks on both edges and the " +
    "permitted ground between them. On a narrow strip, a few metres either way can change how " +
    "the keys sit. So the estate waits for the line before it commits to a position." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Survey plan", "The land measured, both edges drawn"],
    ["CRZ line read", "Where building may and may not go"],
    ["Positions fixed", "Each key placed inside the permitted ground"],
    ["Construction drawings", "Issued once the positions hold"],
  ], mark: 2, markLabel: "Building positions fixed here" }, caption:
    "The order of work the coastal rules impose, from survey to construction drawings." },
  { t: "story", title: "An architect who waited for a line", x: [
    "Imagine a Bengaluru architect asked to design for a strip like this one. Her instinct is to " +
      "start with the view. She sketches keys facing the river at dusk, a deck stepping down to " +
      "the water, a path to the sea.",
    "Her client asks her to wait. The survey plan is still being read, and the CRZ line is still " +
      "to be drawn on it. Until it is, any sketch is a guess about where building is permitted.",
    "She spends the weeks on everything else: the structure on piles, the materials for salt, the " +
      "way air should move. When the line arrives, it cuts a little closer than she hoped on the " +
      "river side.",
    "Because nothing was fixed, nothing has to be undone. She moves the keys back from the line " +
      "and adjusts the deck. The drawings are issued for construction on ground that is known to " +
      "be permitted. The view is a little further away. The building is entirely legal.",
  ] },
  { t: "illus", plate: "confluence/site-plan", caption:
    "The whole site seen from above, from the road to the river." },

  { t: "h", x: "Reading the drawings" },
  { t: "p", x:
    "Every picture of the estate is a drawing, and each one answers a question about the site. " +
    "Read together, they show how the plan uses the two waters rather than merely sitting " +
    "between them." },
  { t: "p", x:
    "The road arrives on the landward side. A walled arrival court receives visitors and closes " +
    "out the traffic. From the court, a ramp rises beside the plaza to its deck. The plaza holds " +
    "the pool and the hall, the shared heart of the estate." },
  { t: "illus", plate: "confluence/plaza-plan", caption:
    "The plaza seen from above: the pool, the hall and the walk to the keys." },
  { t: "p", x:
    "Beyond the plaza stand the keys, twelve of them on two levels, reached by an open stair. " +
    "Each looks out over the water. Beneath them, at ground level, the walk continues to the " +
    "dock on the river." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["The road", "From NH-66, 1.5 km away"],
    ["The arrival court", "Low walls, the traffic left behind"],
    ["The plaza", "The pool and the hall, reached by a ramp"],
    ["The keys", "Twelve, on two levels, over open ground"],
    ["The dock", "On the river, at the end of the walk"],
  ] }, caption: "The estate in order, from the road to the river, as the drawings set it out." },
  { t: "p", x:
    "The sequence matters. A visitor moves from noise to quiet, from the highway to the river, in " +
    "a few hundred steps. The sea sits to one side the whole way, heard more than seen, until the " +
    "walk to the beach opens it up." },
  { t: "illus", plate: "confluence/procession", caption:
    "The procession rising from the court towards the deck." },
  { t: "p", x:
    "These are drawings, and drawings change as a building is detailed. The CRZ line, the ground " +
    "and the structure will each refine them. What the drawings fix now is the intent: arrive " +
    "from the road, gather at the plaza, sleep over open ground, end at the river." },
  { t: "h", x: "Access" },
  { t: "p", x:
    "The site is 1.5 km from NH-66, the coast highway, and about 31 km from Mangaluru airport: " +
    "32 to 46 minutes by road. Access is the strongest fact about the estate, and the one least " +
    "likely to change." },
  { t: "facts", rows: [
    ["To NH-66, the coast highway", "1.5 km"],
    ["To Mangaluru airport", "About 31 km"],
    ["By road from the airport", "32 to 46 minutes"],
    ["Between the surf and the still water", "400 m"],
  ] },
  { t: "p", x:
    "Views can change. A neighbour builds, a shoreline shifts, a taste in landscapes moves on. A " +
    "short road from an international airport and a national highway is far more durable. Those " +
    "are public works, built once and maintained for decades." },
  { t: "p", x:
    "The highway matters in a second way. NH-66 runs the length of the coast, joining Mangaluru, " +
    "Udupi and the towns between. Supplies, staff and repairs arrive along it. An estate a few " +
    "minutes from a national highway is easier to run as well as easier to reach." },
  { t: "p", x:
    "Access also shapes who comes. A place under an hour from an airport works for a long weekend " +
    "from Bengaluru, Mumbai or the Gulf. A place four hours from one asks for a holiday. The first " +
    "can be visited many times a year; the second, a few." },
  { t: "graphic", g: { kind: "compare", head: ["Under an hour from an airport", "Four hours from one"], rows: [
    ["A typical visit", "A long weekend", "A holiday, planned ahead"],
    ["Visits a year", "Many, for those nearby", "A few"],
    ["Who can come", "Cities and the Gulf, on short notice", "Those with a week free"],
    ["How durable it is", "Public roads and an airport", "The same roads, further away"],
  ] }, caption: "Access decides how often a place can be visited, which decides how often it earns." },
  { t: "p", x:
    "For partners, frequent short visits matter twice. Each visit fills nights for the estate. " +
    "And a place people can reach easily is a place they recommend, because the advice is easy " +
    "to take. Access compounds in a way a view alone does not." },
  { t: "illus", plate: "confluence/arrival", caption:
    "The arrival court between its low walls, with two people walking in." },
  { t: "p", x:
    "The drawings carry that short arrival onto the site itself. From the road, a visitor enters a " +
    "walled court, rises past the plaza and its pool, and reaches the keys. Beyond them a walk " +
    "leads down to the dock on the river." },

  { t: "h", x: "Where it stands" },
  { t: "p", x:
    "Construction comes first. The programme runs to a handover in early 2028. The bank " +
    "facility is drawn during the build, and revenue begins when the estate opens. Until then, " +
    "every revenue figure for it is a forecast." },
  { t: "p", x:
    `The estate record states the facility plainly. It is capped at ${inr(STACK.debt)}, of which ` +
    `${inr(STACK.draw)} is the planned draw. The difference is a buffer inside the project total, ` +
    `held in case it is required.` },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Survey and the CRZ line", "Positions fixed, drawings issued"],
    ["Construction", "The bank facility drawn as the build proceeds"],
    ["Handover", "Early 2028"],
    ["Opening", "Revenue begins"],
  ], mark: 3, markLabel: "Forecasts until here" }, caption:
    "Every revenue figure for the estate is a forecast until the day it opens." },
  { t: "p", x:
    "For partners, the build years have their own rhythm. The facility is drawn in stages as " +
    "work proceeds, so borrowing grows with the building. Partners watch progress against the " +
    "programme rather than revenue, because revenue starts at opening." },
  { t: "p", x:
    "The questions worth asking in those years are practical ones. Has the CRZ line been read? " +
    "Are positions fixed? Are drawings issued? Is the build on programme for early 2028? Each " +
    "answer moves a forecast closer to a fact." },
  { t: "story", title: "A partner in the build years", x: [
    "Picture a Bengaluru architect who holds a position in the estate. In the build years there " +
      "is no revenue to read, so she reads the programme instead. Each quarter she looks for three " +
      "things: what was built, what was drawn from the facility, and what moved.",
    "In one quarter the piles go in, and she drives down on a weekend to see them. The ground " +
      "between the two waters is fenced and busy. The sea is loud to the west. The river is " +
      "still to the east, exactly as the drawings promised.",
    "In another quarter the monsoon slows the work, and the programme says so plainly. She notes " +
      "the change and the reason. The handover date is the figure she watches, and she reads it " +
      "with its class: forecast, until the keys are handed over.",
    "She has learned to read the estate in two columns. One holds what is observed: the land, the " +
      "road, the piles in the ground. The other holds what is forecast: the opening, the revenue, " +
      "the first distribution. Each quarter, a line moves from the second column to the first.",
  ] },
  { t: "graphic", g: { kind: "compare", head: ["Observed today", "Forecast today"], rows: [
    ["The place", "Padubidri, between the sea and the Shambhavi", "How visitors will use it"],
    ["The access", "1.5 km to NH-66; about 31 km to the airport", "How often they will come"],
    ["The plan", "Twelve keys, drawn", "The building, as finished"],
    ["The money", "The facility cap and planned draw", "Revenue, from opening"],
  ] }, caption: "Two columns for one estate. Each quarter of the build moves a line from right to left." },
  { t: "p", x:
    "Reading the estate honestly means holding two kinds of fact apart. The land, its two waters, " +
    "its road and its airport are observed. Its revenue is forecast. The first set is why the " +
    "estate was chosen. The second set is what its partners will watch arrive." },
  { t: "p", x:
    "That is a useful discipline for any coastal estate. The scenery is persuasive, and drawings " +
    "make it more so. The facts that carry an investment are quieter: the road, the airport, the " +
    "rules on each edge, the ground under the piles. This entry has tried to put those first." },
  { t: "illus", plate: "confluence/fire", caption:
    "The building at dusk, lit from within, as the drawings imagine it." },
  { t: "p", x:
    "Every picture in this entry is a drawing of a building still to be built. The water in them " +
    "is real. So is the road. The rest is the plan, and the plan is what the next two years are " +
    "for." },
];
