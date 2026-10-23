/* J-12 · Houses that get better when it rains — long form, 23 Oct 2026.
   Figures: the entry's own (2–7 m, four months, about six years). The roof
   arithmetic is labelled an illustration where it appears. The sinking-fund
   share is read from the payment order, as content/journal.ts reads it. */
import type { Block } from "../journal";
import { WATERFALL } from "../../app/_assemblies/data";

const SINKING = (WATERFALL[4].bps / 100).toFixed(2).replace(/\.00$/, "").replace(/0$/, "") + "%";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "The Western Ghats receive two to seven metres of rain a year, mostly within four months. " +
    "Any building there is a proposition about water, whatever else its architect intended." },
  { t: "p", x:
    "Most new houses in the region seal themselves against the rain. The older ones were " +
    "designed for that season, and the difference shows in about six years." },
  { t: "p", x:
    "This entry is about that difference. It follows two houses through their first wet years. " +
    "It sets the old answers beside the new ones. And it asks what an owner should look for " +
    "while the drawings can still change." },
  { t: "facts", rows: [
    ["2–7 m", "of rain a year in the Western Ghats"],
    ["4", "months it mostly arrives in"],
    ["~6", "years before the difference shows"],
  ] },
  { t: "illus", film: ["creek", 7], caption:
    "A drawn film of the creek country at seven in the morning, under low cloud." },

  { t: "h", x: "A proposition about water" },
  { t: "p", x:
    "Start with the quantity, because everything else follows from it. Two to seven metres is " +
    "a depth, measured on open ground. Stand in a seven-metre year and the rain would close " +
    "over a two-storey house." },
  { t: "p", x:
    "Now put a roof under it. Take a roof of a hundred square metres, as an illustration. In a " +
    "two-metre year it collects about two hundred thousand litres. In a seven-metre year it " +
    "collects about seven hundred thousand." },
  { t: "p", x:
    "All of that water goes somewhere. It runs down the roof and reaches the eaves. From there " +
    "it falls clear of the wall or runs down it. It reaches the ground, soaks in, and then moves " +
    "sideways through the soil for months." },
  { t: "p", x:
    "Every building in the Ghats answers the question of where that water goes. Some answer it " +
    "on purpose, at the drawing board. The rest answer it by accident, one stain at a time, over " +
    "the first six years." },
  { t: "p", x:
    "The concentration matters as much as the total. Four months carry most of the year's rain. " +
    "So a roof meets its whole annual test in one long season, day after day, with little time " +
    "to dry between storms." },
  { t: "p", x:
    "Consider what that does to a single joint. A gap between a window frame and a wall might be " +
    "a millimetre wide. In a dry climate it barely matters. Here it meets water for hours a day, " +
    "for weeks, under wind pressure. Small gaps become paths." },
  { t: "p", x:
    "The dry months then do their own work. Sun and heat open the joints again as materials " +
    "shrink. The next monsoon finds a slightly wider gap. A building in the Ghats is tested twice " +
    "a year: once by water, once by the drying that follows." },
  { t: "story", title: "Two houses, one hill", x: [
    "A couple from Bengaluru bought a plot on a coffee slope and built the house they had pinned " +
      "for years. Glass ran floor to ceiling. The roof was flat behind a crisp parapet. White " +
      "walls met the lawn directly.",
    "It photographed beautifully in its first February. Friends drove up for a weekend and the " +
      "pictures travelled widely.",
    "Two hundred metres down the hill stood an old planter's bungalow, low and dark under a tiled " +
      "roof. Its veranda ran the full length of the front. Visitors seldom photographed it.",
    "In the first July, a fine line of damp rose along the base of every white wall. By the " +
      "second July the parapet had streaked and the glass doors had swollen in their frames. The " +
      "couple spent the third monsoon with buckets out and a contractor on call.",
    "The bungalow spent those same months as it had spent decades. Water left its roof at the " +
      "eaves and fell clear of the walls. The plinth held the wet ground at a distance. The " +
      "veranda became the busiest part of the house, because it was the one dry place outdoors.",
    "By the sixth year the couple had spent more on repairs than on the original glazing. They " +
      "had also come to admire the bungalow. Its builder had clearly watched a July happen.",
  ] },

  { t: "p", x:
    "The couple's house was well built. Its joints were neat and its glass was good. It was " +
    "simply built for a different climate, the dry one in the photograph. Every choice that made " +
    "it striking in February made it vulnerable in July." },
  { t: "p", x:
    "The bungalow's builder had made the opposite trade. He gave up brightness for shade and a " +
    "crisp edge for a deep one. In return, the house spent its wet months dry, and its dry months " +
    "looking a little older and a little better." },

  { t: "h", x: "What the traditional answer got right" },
  { t: "list", x: [
    "Deep overhangs, so water leaves the wall before it reaches the ground.",
    "Raised plinths, because the ground itself moves water sideways for months.",
    "Courtyards that collect rain deliberately rather than shedding it by accident.",
    "Roofs steep enough that water keeps moving and finds no way in.",
    "Materials that darken and remain sound, rather than materials that hold their colour and " +
      "fail.",
  ] },
  { t: "p", x:
    "This is engineering rather than nostalgia. Each answer responds to a measured quantity of " +
    "water. People worked it out by rebuilding after getting it wrong, and they lived with the " +
    "result." },
  { t: "p", x:
    "Take the overhang first. Monsoon rain arrives on the wind, at an angle. The deeper the eave, " +
    "the more of the wall sits in its shadow, and the drier that wall remains. A deep eave also " +
    "throws roof water well clear of the foundation." },
  { t: "p", x:
    "The plinth answers a quieter problem. After a few weeks of rain the soil is full, and water " +
    "moves through it sideways, downhill, for the rest of the season. A raised floor keeps the " +
    "house above that moving layer." },
  { t: "p", x:
    "The courtyard turns the problem around. Instead of rain landing everywhere, it lands in one " +
    "known place, open to the sky and built to drain. A house with a court decides where its " +
    "water goes. The court also brings light and air into the middle of a deep plan." },
  { t: "p", x:
    "The steep roof works on time. Water that moves quickly has little chance to find a joint. A " +
    "pitched roof of tile or sheet keeps the water travelling until it reaches the eave, which is " +
    "exactly where the overhang takes over." },
  { t: "p", x:
    "Each answer hands the water to the next. Roof to eave, eave to open ground, ground to drain, " +
    "plinth above it all. Read together, they form a single path for the water, designed from the " +
    "ridge to the soil." },
  { t: "p", x:
    "Every old house on these hills is the survivor of a long trial. Builders tried shallower " +
    "eaves, lower plinths and brighter finishes. The rain judged each one. The houses still " +
    "standing are the verdicts, and they agree with one another to a remarkable degree." },
  { t: "p", x:
    "That agreement is the best evidence available. No single architect could run the " +
    "experiment. Generations ran it together, one monsoon at a time, and wrote the results in " +
    "tile, timber and stone." },
  { t: "graphic", g: { kind: "compare", head: ["Built for the photograph", "Built for the monsoon"], rows: [
    ["The roof edge", "A flat parapet with a flush detail", "A deep overhang that throws water clear"],
    ["Where wall meets ground", "A white wall straight onto the lawn", "A raised plinth, dark at its base"],
    ["Openings", "Glass to the floor, open to the weather", "Openings set back under shade"],
    ["Rainwater", "Shed wherever it happens to land", "Collected into a court or a channel"],
    ["Surfaces", "One good state, kept up at rising cost", "A second appearance that lasts"],
    ["The month to judge it", "February", "July"],
  ] }, caption: "The same house, drawn two ways: each row is a choice made at the drawing board." },

  { t: "h", x: "The photograph problem" },
  { t: "p", x:
    "A deep veranda is the least photogenic thing in architecture. It is dark, it hides the " +
    "facade and it turns the interior into shadow. It also decides, more than anything, whether " +
    "a house is pleasant through the four months of rain." },
  { t: "p", x:
    "Buildings designed for one image tend to lose it. Think of glass to the floor, flat " +
    "parapets, flush details, or a white wall meeting the ground without a plinth. Each " +
    "photographs beautifully in February and explains itself by the third monsoon." },
  { t: "assert", x:
    "A house in high rainfall should be judged in July. Any assessment made in January is an " +
    "assessment of the photograph." },
  { t: "p", x:
    "Why does the photographed version keep getting built? Partly because the picture sells the " +
    "house. A buyer meets the image long before they meet the weather. The image is made in the " +
    "dry months, when the light is clear and the lawn is green." },
  { t: "p", x:
    "Compare a brochure with a house. A brochure is printed once and read for a season. A house " +
    "is lived in for decades, and it spends a third of every year in the rain. The brochure " +
    "describes the other two-thirds." },
  { t: "p", x:
    "A car is judged on a test drive as well as its paint. A house in the Ghats deserves the same " +
    "courtesy. Its test drive is a wet afternoon in July, with the doors open and the rain loud " +
    "on the roof." },
  { t: "p", x:
    "Or compare a fashion jacket with a good raincoat. The jacket is cut for the shop window and " +
    "the dry street. The raincoat is cut for the downpour, with a hood, a long hem and sealed " +
    "seams. In the Ghats, a house needs to be the raincoat." },
  { t: "p", x:
    "A raincoat can be beautiful too. The best monsoon houses are. Their beauty comes from deep " +
    "shadow, from heavy roofs and dark stone, from the rhythm of posts along a veranda. It is a " +
    "beauty that photographs less easily and lasts far longer." },
  { t: "illus", plate: "cff/monsoon", caption:
    "The hearth at Coffee Fields Forever in the monsoon, drawn with rain over the long pool." },
  { t: "p", x:
    "There is a second, subtler cost to designing for the picture. The veranda, the court and the " +
    "eave are where people gather in the rain. Remove them for a cleaner facade and the house " +
    "loses its best places for four months of the year." },
  { t: "p", x:
    "A monsoon house is often at its finest in the rain. The veranda fills with the sound of " +
    "water. The court runs like a small river. The air cools, the hills disappear and return, and " +
    "the whole house turns inward to its shaded edges." },

  { t: "h", x: "A wet day, hour by hour" },
  { t: "p", x:
    "To see what the old answers buy, follow one day in July at a house built for it. The " +
    "drawings for Streamside Creek in Coorg are a useful frame. They show clusters of keys on " +
    "either side of a stream, a lake with a sauna, and one path joining it all. Imagine it in July." },
  { t: "p", x:
    "The drawings group the twenty keys into five clusters, four keys to a roof. A shared roof " +
    "is a monsoon decision in itself. It makes fewer edges for water to find, and one large eave " +
    "can shelter a whole cluster's yard." },
  { t: "p", x:
    "The water features are the monsoon made visible. A stream runs fullest in the wet months. A " +
    "lake fills. A site planned around both treats the season as its main event. The rain becomes " +
    "something to walk beside, cross and sit near." },
  { t: "illus", plate: "creek/yard", caption:
    "A cluster's yard and pool at Streamside Creek, drawn in the shade of the keys above." },
  { t: "p", x:
    "Early morning. The rain has eased to a drizzle. Under a deep eave, the deck is dry enough " +
    "for a cup of coffee and a book. The yard below has drained overnight into its channels." },
  { t: "p", x:
    "Mid-morning. The cloud comes down and the far bank of the stream disappears. Doors remain open " +
    "under the overhang, because the rain falls beyond the threshold rather than across it." },
  { t: "illus", film: ["creek", 15], caption:
    "A drawn film of the creek country in mid-afternoon, the light flattened by cloud." },
  { t: "p", x:
    "Afternoon. The heavy rain arrives, the kind that sounds like applause on a tiled roof. The " +
    "stream rises and speaks louder. People cross between the keys and the commons under umbrellas, " +
    "and arrive laughing." },
  { t: "p", x:
    "Evening. The sauna at the lake's edge is warm, and the rain outside makes it warmer by " +
    "contrast. Lamps along the paths come on. The commons gathers everyone at one long table." },
  { t: "illus", plate: "creek/lamps", caption:
    "The commons at Streamside Creek after dark, drawn with lamps along the paths." },
  { t: "p", x:
    "Night. Rain on the roof, the stream below, and nothing else to hear. A house built for the " +
    "season turns all of this into the reason to come. A house built for February spends the " +
    "same night guarding its joints." },
  { t: "graphic", g: { kind: "timeline", steps: [
    ["Year 1, February", "The photograph is taken"],
    ["Year 1, July", "The first test: water looks for every joint"],
    ["Year 3", "Stains and swelling explain the details"],
    ["About year 6", "The difference shows, in the walls and the accounts"],
    ["The decades after", "A second appearance, or a programme of replacement"],
  ], mark: 3, markLabel: "About six years" }, caption:
    "How the gap between the two houses opens, season by season." },

  { t: "h", x: "What ageing well looks like" },
  { t: "p", x:
    "Laterite darkens. Timber silvers. Copper turns and then stops. Lime absorbs and releases, " +
    "and keeps a wall breathing. These materials have a second appearance, and the building " +
    "spends its life in the second one." },
  { t: "pull", x: "Laterite darkens. Timber silvers. Copper turns and then stops." },
  { t: "p", x:
    "The opposite is a surface with one good state, kept up against the weather at rising cost " +
    "until replacing it is easier. That building was built well, for a photograph, and the " +
    "photograph was taken." },
  { t: "graphic", g: { kind: "ladder", steps: [
    ["Laterite", "Darkens with the rain, and remains sound"],
    ["Timber", "Silvers in the weather, and keeps its strength"],
    ["Copper", "Turns, and then stops"],
    ["Lime", "Absorbs and releases, and keeps a wall breathing"],
    ["A sealed surface", "Holds one good state, at rising cost, until replacement"],
  ] }, caption: "Five surfaces, ordered by how gracefully they meet a wet season." },
  { t: "p", x:
    "Think of these materials as having two lives. The first is the day the builders leave, " +
    "crisp and new. The second begins after the first monsoon, and it lasts. A good monsoon " +
    "building is designed for its second life." },
  { t: "p", x:
    "Laterite is the red stone cut from the ground across this coast and these hills. It goes " +
    "darker and softer in colour as it weathers. Moss finds its edges. The wall looks older within " +
    "a few years and remains sound for generations." },
  { t: "p", x:
    "Timber left to the weather turns from honey to silver-grey. Copper moves through brown to a " +
    "settled green, and then holds. Lime plaster takes in moisture during the rains and gives it " +
    "back in the dry months, so the wall behind it breathes." },
  { t: "p", x:
    "A sealed surface works differently. Paint, gloss and tight coatings look perfect until water " +
    "finds a single crack. Then the water is trapped behind the seal, and the damage spreads out " +
    "of sight. Each repair restores the look and resets the clock." },
  { t: "p", x:
    "The idea is familiar from smaller things. A good leather shoe looks better after a year of " +
    "wear. A brass door handle warms to a soft shine where hands meet it. Patina is the record of " +
    "use, and the best monsoon materials collect it gracefully." },
  { t: "p", x:
    "A building that ages this way also tells the truth about itself. Its weathering shows " +
    "where water runs and where the sun falls. Anyone who knows how to read it can see the " +
    "house working, season after season." },

  { t: "h", x: "What it means for an owner" },
  { t: "p", x:
    "For someone who owns part of a place, all of this becomes a line in the accounts. Every " +
    "estate's payment order sets aside a sinking fund for replacement, " + SINKING + " of " +
    "revenue, so that worn parts are replaced before they fail." },
  { t: "p", x:
    "A building designed for the rain asks less of that fund. Its eaves protect its walls. Its " +
    "plinth protects its floors. Its materials improve with weather, so the fund can be spent on " +
    "renewal rather than rescue." },
  { t: "p", x:
    "Renewal and rescue cost different amounts. Renewal is planned: a roof re-laid in the dry " +
    "season, at a time of the estate's choosing, from money already set aside. Rescue is urgent: " +
    "a leak found in August, fixed in the rain, at whatever the day's price happens to be." },
  { t: "p", x:
    "Partners in an estate vote on its decisions, weighted by what they hold. Major works are " +
    "among those decisions. A building that ages well gives partners calmer choices: when to " +
    "renew, and how, rather than how quickly to repair." },
  { t: "graphic", g: { kind: "compare", head: ["Spending as rescue", "Spending as renewal"], rows: [
    ["When it happens", "When something fails, often mid-monsoon", "On a plan, in the dry season"],
    ["Where the money comes from", "Wherever it can be found", "The sinking fund, set aside from revenue"],
    ["Who sets the pace", "The weather", "The partners, by vote"],
    ["What the building looks like after", "Patched", "Renewed, and ageing on"],
  ] }, caption: "Two ways a building's upkeep gets paid for, and who chooses." },
  { t: "p", x:
    "A building designed for February asks more, and asks earlier. Its repairs arrive in the " +
    "wettest months, when the calendar is quietest too. An owner of that building pays twice: " +
    "once for the repair, and once in the season it disturbs." },
  { t: "p", x:
    "There is a gain on the other side of the ledger too. A house that is lovely in the rain can " +
    "draw visitors in the wet months, when most places empty. The monsoon becomes a season to " +
    "offer rather than one to endure." },
  { t: "story", title: "The July visit", x: [
    "A family in Pune was weighing a share in a hill estate. The drawings were handsome and the " +
      "February site visit had been glorious. The eldest daughter, an engineer, asked for one " +
      "more visit, in July.",
    "Her parents thought it an odd request. Nobody plans a holiday around the heaviest rain. She " +
      "explained that a dry visit had shown them the view. A wet one would show them the house.",
    "They went. They watched where the water ran off the roofs of the older buildings nearby. " +
      "They stood under eaves and measured, roughly, how far the rain fell from the wall. They " +
      "noted which verandas were full of people and which terraces were empty.",
    "Back home, they read the drawings again with new eyes. They looked for the depth of the " +
      "eaves, the height of the plinths, the path of the rainwater and the materials named for " +
      "each surface. Their questions to the architect became short and specific.",
    "Whatever they decided, they decided about a building in its real climate. That was the " +
      "point of the second visit.",
  ] },
  { t: "p", x:
    "The family's method is worth borrowing. Any drawing of a building in high rainfall can be " +
    "read for a handful of decisions. Each one is visible on paper, long before the first " +
    "monsoon tests it." },
  { t: "list", x: [
    "How deep are the eaves, and does the roof water fall clear of the walls?",
    "How high is the plinth above the ground that will carry water sideways for months?",
    "Where does the rain collect, and where does it leave the site?",
    "Which surfaces are named, and which of them have a second appearance?",
    "Where will people gather on a wet afternoon in July?",
  ] },
  { t: "illus", plate: "creek/crossing", caption:
    "The crossing over the stream at Streamside Creek, drawn in timber." },
  { t: "p", x:
    "These questions take a few minutes to ask. Their answers decide how a building looks in " +
    "its sixth year and what its owners spend to keep it. They also decide how pleasant it is " +
    "for a third of every year." },
  { t: "p", x:
    "Read illustrations with the same eye. A drawing of an unbuilt place shows decisions: the " +
    "shape of a roof, the line of a path, the edge of a yard. Look past the light and the colour " +
    "to those decisions, and ask how each one meets the water." },
  { t: "p", x:
    "None of this asks an architect to copy the old houses. The forms can be new, the plans " +
    "open, the details clean. What carries over is the order of priorities: water first, then " +
    "shade, then the picture. A modern house can honour that order as well as an old one." },
  { t: "assert", x:
    "A house in the Ghats is a proposition about water. The best of them treat the rain as the " +
    "reason they were built." },
  { t: "p", x:
    "The older houses on these hills already knew this. They were designed by people who had " +
    "spent a July there, and their buildings look better for every one since." },
];
