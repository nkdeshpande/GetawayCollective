/**
 * J-11 · What the sea does to time — long form (Journal 5x, 23 Oct 2026).
 *
 * Expands the entry in content/journal.ts. Its own figures: the sea every
 * few seconds; two nights twelve times a year against two weeks once; the
 * fifth monsoon. The Padubidri site facts (Arabian Sea west, Shambhavi
 * estuary east, four hundred metres between, CRZ on both edges) are J-06's,
 * already in content/journal.ts. Seaside Confluence's stage and land are
 * left unstated, as the brief requires.
 */
import type { Block } from "../journal";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "A coast keeps time out loud. Mountains are older and say nothing about it. Forests move on " +
    "a scale nobody watches. The sea arrives every few seconds, all day, and has done so for " +
    "longer than there have been people to hear it." },
  { t: "p", x:
    "So it is hard to be efficient beside one. Efficiency asks you to believe the next hour " +
    "matters more than this one. A tide is a standing argument against that." },
  { t: "p", x:
    "People call the coast relaxing. The word is too soft for what happens. The sea is loud " +
    "enough to crowd out thinking, and slow enough that you start to notice things again. This " +
    "entry is about that double effect, and about what it asks of the buildings that sit beside it." },
  { t: "p", x:
    "Both halves matter to anyone thinking of owning part of a coastal place. The first explains " +
    "why people return to the sea. The second explains which coastal buildings are still worth " +
    "returning to after a decade of salt." },

  { t: "h", x: "The last hour of the road" },
  { t: "p", x:
    "The change begins before the sea is visible. On the Karnataka coast the road runs inland " +
    "for long stretches, through paddy, coconut and small towns. Then a turn reveals a strip of " +
    "grey or blue, and the air in the car changes." },
  { t: "p", x:
    "Most people know the moment. Windows go down. Someone stops talking mid-sentence. A child " +
    "who has been asleep for an hour sits up and asks whether that is the sea. It is the first " +
    "clock of the coast making itself heard." },
  { t: "p", x:
    "The last hour of the road is a threshold. Behind it is the time of the week, measured in " +
    "meetings and messages. Ahead of it is the time of the place, measured in light and water. " +
    "A good arrival lets that crossing happen slowly." },
  { t: "p", x:
    "This is one reason coastal estates are best reached by road, in the late afternoon. The " +
    "light lowers as you arrive. The heat has gone out of the day. The first evening begins at " +
    "the right speed, with the sound arriving before the view." },
  { t: "illus", plate: "confluence/arrival", caption:
    "The arrival, drawn at the point where the road gives way to the sound of the sea." },
  { t: "illus", plate: "confluence/hero", caption:
    "The coast at Padubidri, drawn with the sea on one side and still water on the other." },

  { t: "h", x: "A clock that never needs winding" },
  { t: "p", x:
    "Most of the time we keep is silent. A phone shows it. A calendar holds it. Nothing in the " +
    "house announces that a minute has passed. The sea announces it constantly, in a rhythm a " +
    "body falls into within an hour." },
  { t: "p", x:
    "Each wave is a small event: a build, a break, a long withdrawal over sand. The pattern " +
    "repeats closely enough to be predictable and loosely enough to hold attention. It is the " +
    "kind of sound a mind can rest on without falling asleep." },
  { t: "p", x:
    "Above that rhythm sits a slower one. Twice a day the water climbs the beach and leaves it " +
    "again. Tide tables print the times in advance. Fishermen plan around them. Visitors learn " +
    "them by the second evening, without trying, from where the shoes were left." },
  { t: "graphic", g: { kind: "ladder", steps: [
      ["Seconds", "A wave builds, breaks and draws back over the sand"],
      ["Hours", "The tide climbs the beach and leaves it, twice a day"],
      ["Seasons", "The monsoon closes the sea; the winter opens it again"],
      ["Years", "Salt and wind work on every building along the shore"],
    ] },
    caption: "Four clocks the coast keeps at once, from the fastest to the slowest." },
  { t: "p", x:
    "Every one of those clocks runs on its own, indifferent to a work calendar. That is the " +
    "quiet discipline of the place. You can ignore a phone. It is much harder to ignore a tide " +
    "that has moved your chair." },
  { t: "p", x:
    "There is a reason the effect is so reliable. A mind used to deadlines is constantly " +
    "looking ahead. The sea offers nothing ahead to look at, only the next wave, which is the " +
    "same as the last. Attention settles into the present because the present is all there is." },
  { t: "p", x:
    "Inland places can do this too, more quietly. A forest at dawn, a river in spate, a long " +
    "view from a ridge. The coast is simply the most insistent version. It keeps reminding you, " +
    "every few seconds, which hour you are actually in." },
  { t: "story", title: "The phone on the windowsill", x: [
    "Picture a product lead from Bengaluru, used to days cut into thirty-minute blocks. She " +
    "arrives at the coast on a Friday evening, still answering messages in the car.",
    "Her window faces the sea. She puts her phone face down on the windowsill to charge and goes " +
    "out to the sand, meaning to come back in ten minutes.",
    "She comes back after dark. She has no idea how long she was out. She remembers the colour " +
    "of the water changing, a dog running the tideline, and two boats coming in.",
    "On Saturday she checks the time twice. On Sunday she checks it only to leave. Nothing about " +
    "her work changed that weekend. What changed was which clock she was keeping.",
    "Back home, she describes it to a colleague as a long weekend. It was two nights. The " +
    "difference between those two descriptions is the subject of the next section.",
  ] },

  { t: "h", x: "Why the first evening is always long" },
  { t: "p", x:
    "Almost everyone reports the same thing. The first evening by the sea feels long, and the " +
    "last morning disappears." },
  { t: "p", x:
    "The likeliest explanation is plain. Time feels long when there is much to notice and " +
    "nothing to anticipate. On arrival everything is new and nothing is scheduled. By the last " +
    "morning the light and the sound are background, and the drive home has already begun." },
  { t: "graphic", g: { kind: "timeline", steps: [
      ["Arrival evening", "Everything is new; nothing is scheduled"],
      ["The full day", "The sound settles into rhythm; the light becomes familiar"],
      ["The last evening", "Packing begins in the mind before it begins in the bags"],
      ["The last morning", "The light is background; the drive home has already begun"],
    ], mark: 0, markLabel: "Where time feels longest" },
    caption: "A short visit to the coast, drawn as it feels rather than as the clock counts it." },
  { t: "p", x:
    "Two ingredients make an hour feel long: novelty and the absence of a deadline. The first " +
    "evening has both in full. The sea is new, the light is new, and nothing is expected of you " +
    "until breakfast." },
  { t: "p", x:
    "The last morning has neither. You have seen the view a dozen times. The checkout hour sits " +
    "at the edge of every thought. A morning built of the familiar and the expected passes in " +
    "what feels like minutes." },
  { t: "p", x:
    "That is the case for going more often rather than for longer. Two nights taken twelve " +
    "times a year contain twelve first evenings. Two weeks taken once contains one." },
  { t: "graphic", g: { kind: "compare", head: ["Two weeks, once a year", "Two nights, twelve times a year"], rows: [
      ["First evenings", "One", "Twelve"],
      ["Last mornings", "One, after a long run-up", "Twelve, each light"],
      ["Seasons seen", "One", "Every season the coast has"],
      ["What it asks of the calendar", "A fortnight cleared well ahead", "A Friday, now and then"],
      ["What the coast becomes", "A holiday", "A place you know"],
    ] },
    caption: "The same coast, held two ways. The count of first evenings is the entry's own." },
  { t: "pull", x:
    "Two nights taken twelve times a year contain twelve first evenings. Two weeks taken once contains one." },
  { t: "p", x:
    "The comparison changes the question people ask about a coastal place. They usually ask how " +
    "long they could spend there. The better question is how often they could reach it. A " +
    "coast close enough for a Friday gives first evenings in quantity." },
  { t: "story", title: "Twelve first evenings", x: [
    "Imagine a couple in Pune, both doctors, with rotas that rarely line up for more than a few " +
    "days. For years they saved their leave for one long trip to the coast each winter.",
    "The trip was always lovely and always too short. They spent the first two days unwinding " +
    "and the last two dreading the return. The middle week blurred into one long afternoon.",
    "One year the rotas made the long trip impossible. Instead they took short visits whenever " +
    "two free nights appeared. By December they had gone to the sea eleven times.",
    "When they compared the years, the short visits felt longer in memory. Each began with a " +
    "first evening: new light, a new sky, the sound arriving before the view. Each had its own " +
    "weather and its own story.",
    "The long trip had given them one first evening and a fortnight of background. The short " +
    "visits had given them eleven beginnings. They kept the habit, and the long trip became the " +
    "exception.",
  ] },
  { t: "p", x:
    "The couple's eleven visits are an illustration, built on the entry's own comparison. The " +
    "shape is general. Arrival is where the coast gives most, so a pattern with many arrivals " +
    "gets more of what the coast gives." },
  { t: "illus", film: ["coast", 18], caption:
    "The sea at six in the evening, drawn for the first hour after arrival." },

  { t: "h", x: "Two waters, two clocks" },
  { t: "p", x:
    "Some coasts keep two times at once. At Padubidri, on the Karnataka coast, a strip of land " +
    "lies between the Arabian Sea and the Shambhavi estuary. The two waters are four hundred " +
    "metres apart." },
  { t: "p", x:
    "On the western edge the water is surf, loud and seasonal. On the eastern edge it is still " +
    "enough to hold a reflection. One side keeps the fast clock of waves. The other keeps the " +
    "slow clock of a river meeting the sea." },
  { t: "p", x:
    "A confluence is a place where two kinds of water meet and neither wins. The river pushes " +
    "out; the tide pushes in. Twice a day the balance shifts, and the estuary rises and falls " +
    "with the sea a few hundred metres away." },
  { t: "graphic", g: { kind: "compare", head: ["The sea, to the west", "The estuary, to the east"], rows: [
      ["Its sound", "Surf, all day and all night", "Almost silent; birds and oars"],
      ["Its clock", "Seconds, and the twice-daily tide", "The slow turn of the tide up the river"],
      ["Its best months", "The winter, when the sea is calm", "The months when the surf is too rough to use"],
      ["What it asks of a building", "Resistance to salt and wind", "Resistance to humidity, on old river silt"],
    ] },
    caption: "The two edges of one strip of land, compared as places with their own time." },
  { t: "p", x:
    "For time, this is a gift. A morning can begin with the sea and end on still water. The two " +
    "edges give a visitor a choice of tempo within a short walk. Most coasts offer only one." },
  { t: "p", x:
    "Picture a day there. Dawn on the estuary, when the water is flat and the herons are " +
    "working. Mid-morning on the sand, as the tide turns. The afternoon in shade. The evening " +
    "back at the sea, watching the light go down behind the surf." },
  { t: "p", x:
    "The two waters also divide the year. The sea frontage sells the winter; the estuary is calm " +
    "in months when the surf is too rough to use. An estate with one waterfront has one season. " +
    "An estate with two has a reason to return in each." },
  { t: "p", x:
    "That matters for time in a second sense. A place worth reaching in several seasons is a " +
    "place you see change. You learn the coast in its monsoon grey as well as its winter blue. " +
    "Each season gives its own first evening." },
  { t: "illus", plate: "confluence/river", caption:
    "The estuary edge, drawn at its calmest, with the sea audible beyond the trees." },

  { t: "h", x: "The coast through a year" },
  { t: "p", x:
    "The slowest of the coast's clocks is the season. On the Karnataka coast it is unusually " +
    "loud. The year swings from a calm, bright winter to a monsoon that closes the sea to " +
    "boats and swimmers for months." },
  { t: "graphic", g: { kind: "timeline", steps: [
      ["Winter", "The sea is calm and blue; the beach is at its widest"],
      ["Summer", "Heat builds; mornings and evenings carry the day"],
      ["Monsoon", "The surf closes the sea; the estuary and the rain take over"],
      ["After the rain", "Everything is green; the sea reopens slowly"],
    ], mark: 2, markLabel: "When the estuary carries the place" },
    caption: "A year on this coast, drawn as four seasons. A building must be designed for all four." },
  { t: "p", x:
    "Each season changes what the place is for. Winter is for the sea itself. Summer is for " +
    "early mornings and long, shaded afternoons. The monsoon is for watching weather from under " +
    "a deep roof. The months after the rain are for walking." },
  { t: "p", x:
    "Visitors who know only the winter coast know a fraction of it. The monsoon coast is " +
    "another place entirely: grey, loud, cool and theatrical. Seen once, it can make the " +
    "January coast feel like half the place." },
  { t: "p", x:
    "For time, the seasons matter in the same way the first evening does. A new season is a new " +
    "first evening. A place visited across the year offers four kinds of arrival, each with its " +
    "own light and its own sound." },
  { t: "p", x:
    "For a building, the seasons are the brief. A design that works only in winter is a winter " +
    "pavilion. A design that works in all four is a coastal building, and the difference is " +
    "visible from the first July onward." },

  { t: "h", x: "What it asks of a building" },
  { t: "p", x:
    "Coastal architecture is mostly an argument with salt, and the buildings that last are the " +
    "ones that stopped resisting. Salt finds fixings. Wind finds anything cantilevered for a " +
    "photograph. The monsoon tests every surface." },
  { t: "p", x:
    "Salt is patient. It rides the air inland, settles on every ledge and waits for moisture. " +
    "Then it works on steel, on concrete cover, on the screw that holds a hinge. A fixing chosen " +
    "for an inland house can fail quietly within a few seasons by the sea." },
  { t: "p", x:
    "Wind is less patient and more dramatic. It loads anything that projects: a deep cantilever, " +
    "a thin canopy, a roof edge designed to look weightless. The shapes that photograph best are " +
    "often the shapes the wind finds first." },
  { t: "p", x:
    "The monsoon is the final examiner. Months of driven rain find every joint, every flat " +
    "surface and every detail that assumed water would fall straight down. On this coast it " +
    "often arrives sideways." },
  { t: "graphic", g: { kind: "compare", head: ["Built for the photograph", "Built for July"], rows: [
      ["Its height", "Tall, for the view", "Low, under the wind"],
      ["Its shade", "Thin, for the clean line", "Deep, for sun and driven rain"],
      ["Its materials", "Chosen from a catalogue", "Local things that know the climate"],
      ["Its fixings", "Hidden, wherever they look best", "Chosen for salt, and reachable for renewal"],
      ["Who designed it", "Someone who visited in January", "Someone who was there in July as well"],
    ] },
    caption: "Two ways of building on the coast. The difference shows over years, rather than at opening." },
  { t: "p", x:
    "The houses that age well on this coast tend to be low, deeply shaded and built of local " +
    "things. They were designed by someone who had been there in July as well as in January." },
  { t: "p", x:
    "Local things carry knowledge that a catalogue lacks. Laterite has stood in this climate for " +
    "centuries, and it darkens rather than failing. Clay tiles shed water fast and are replaced " +
    "one at a time. Timber chosen for the coast silvers and holds." },
  { t: "p", x:
    "Deep shade does two jobs at once. It keeps the sun off walls in April and the rain off them " +
    "in July. The veranda that results becomes the most used place in the house, because it is " +
    "comfortable in every season." },
  { t: "p", x:
    "Low buildings sit under the wind rather than in it. They read as part of the landscape " +
    "rather than set against it. And they keep every part of the building within reach of a " +
    "ladder, which is where maintenance begins." },
  { t: "p", x:
    "That last point is less romantic and more important than it sounds. On a coast, a building " +
    "is maintained continuously. A fixing that can be reached is a fixing that gets renewed. A " +
    "fixing hidden for the photograph is renewed only after it fails." },
  { t: "story", title: "Two houses on one beach", x: [
    "Imagine two houses built the same year on the same stretch of the Karnataka coast. One " +
    "belongs to a family from Mumbai, the other to a retired teacher from Udupi.",
    "The Mumbai house is striking. It has a glass front, a cantilevered deck and a slim steel " +
    "railing. Its photographs travel widely in the first year.",
    "The teacher's house is low and plain. It has a deep tiled roof, thick laterite walls and a " +
    "veranda that is dark at noon. Visitors call it modest.",
    "By the third monsoon the steel railing on the first house has bloomed with rust. The deck " +
    "needs new fixings. The glass needs cleaning of salt every week.",
    "By the fifth monsoon the teacher's laterite has darkened and her roof has settled into the " +
    "landscape. Her veranda is where both families sit when the rain comes in.",
    "Neither owner was careless. One simply designed for the day the house was finished. The " +
    "other designed for all the days after it.",
  ] },
  { t: "assert", x:
    "A coastal building is judged by how it looks after its fifth monsoon. The first year " +
    "predicts little." },

  { t: "h", x: "The fifth monsoon" },
  { t: "p", x:
    "Every new building looks good in its first year. Paint is fresh, timber is pale, fixings " +
    "are bright. The first year tells you how the building was finished. It tells you very " +
    "little about how it was conceived." },
  { t: "graphic", g: { kind: "timeline", steps: [
      ["Opening", "Fresh paint, pale timber, bright fixings"],
      ["First monsoon", "Water finds its routes; the obvious details are corrected"],
      ["Third monsoon", "Salt reaches the fixings that were chosen for looks"],
      ["Fifth monsoon", "The building shows what it was designed for"],
    ], mark: 3, markLabel: "The honest photograph" },
    caption: "A coastal building across five monsoons. The entry asks to be judged at the last step." },
  { t: "p", x:
    "This is why opening photographs are a weak guide to a coastal building. They show the " +
    "building at the one moment it looks most like its drawings. The photograph worth asking for " +
    "is the one taken five monsoons later, in July, from the same spot." },
  { t: "p", x:
    "Few projects can show that photograph before they are built. What they can show is the " +
    "thinking that predicts it. That means the materials, the depth of the roof and the height. " +
    "It also means the fixings, and the money set aside to renew them." },
  { t: "p", x:
    "By the fifth monsoon the building has met every season several times. Salt has reached " +
    "every fixing it can reach. Water has tried every joint. What remains is the building as " +
    "designed, rather than as delivered." },
  { t: "p", x:
    "On a coast with two waters the test is doubled. Salt arrives from one side and humidity " +
    "from the other, on ground that was recently river silt. India's Coastal Regulation Zone " +
    "rules apply on both edges, and building positions are fixed once the line is read." },
  { t: "illus", plate: "confluence/veranda-rain", caption:
    "A veranda in the monsoon, drawn as the space a coastal building is really designed around." },
  { t: "p", x:
    "For an owner, the fifth-monsoon test is a practical way to read any coastal project. Ask " +
    "who designed it and whether they knew the coast in July. Ask how the fixings were chosen " +
    "and how they will be reached. Ask what is set aside to renew them." },
  { t: "list", x: [
    "Was the building designed by someone who knew the coast in July as well as January?",
    "Is it low and deeply shaded, or tall and thin for the view?",
    "Are its materials local, and do they age into the climate?",
    "Can every fixing be reached and renewed without taking the building apart?",
    "Is there a line of revenue set aside to renew things before they fail?",
  ] },
  { t: "p", x:
    "The last question links the building to the structure that owns it. In each estate Getaway " +
    "Collective governs, a sinking fund takes a fixed share of revenue to replace things before " +
    "they fail. On a coast, that fund meets salt on its own schedule." },
  { t: "p", x:
    "This connects back to time. A coast keeps time in seconds, in tides and in seasons. A " +
    "building on a coast must keep time in monsoons. The good ones are designed by people " +
    "willing to wait five years for the verdict." },
  { t: "p", x:
    "Owners can wait in the same way. A share of a coastal estate is held across many " +
    "monsoons. Its worth is measured over the same span as the building's. The patient view of " +
    "time that the sea teaches is also the right view of a coastal asset." },
  { t: "p", x:
    "For those who come to the sea, the lesson is the one the first evening teaches. Time by " +
    "the coast is long when it is new and unhurried. Go often, go lightly, and arrive in time " +
    "for the light to change." },
];
