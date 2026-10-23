/**
 * J-09 · The four thousand weekends problem — long form (Journal 5x, 23 Oct 2026).
 *
 * Expands the entry in content/journal.ts. Every figure here is the entry's
 * own: ~4,000 Saturdays in eighty years, ~2,500 in the working middle, a few
 * hundred truly placed, 30 visits a year at ninety minutes against 4 at four
 * hours, 3 summers' visits at a full day against 12 at two hours. Sums that
 * divide those figures further say so where they appear.
 */
import type { Block } from "../journal";

export const MINUTES = 12;

export const BODY: readonly Block[] = [
  { t: "p", x:
    "Someone who lives to eighty gets a little over four thousand Saturdays. The number is " +
    "small enough to picture, which is why it is worth stating. People change decisions over " +
    "figures they can picture." },
  { t: "p", x:
    "Most of the large numbers in a life arrive as abstractions. Thirty thousand days. Seven " +
    "hundred thousand hours. They pass straight through the mind and leave nothing behind. Four " +
    "thousand is different. It is a number of things you could lay out on a long table and count." },
  { t: "p", x:
    "This entry is about what happens to those Saturdays. It is also about the single variable " +
    "that decides how many are spent somewhere other than home. That variable is distance. It " +
    "matters more than money, more than taste and more than the place itself." },
  { t: "p", x:
    "That is a strong claim, so it is worth saying how it was reached. It comes from watching " +
    "how people actually use the places they love, rather than how they describe them. The " +
    "description is about the view. The use is about the drive." },
  { t: "illus", film: ["wild", 7], caption:
    "A Saturday morning, drawn at seven, before the week has had a chance to reach it." },

  { t: "h", x: "Counting the Saturdays" },
  { t: "p", x:
    "The arithmetic that follows is less comfortable. Give the first twenty years to childhood " +
    "and the last ten to a slower kind of time. That leaves about two and a half thousand in " +
    "the middle, where the work is." },
  { t: "graphic", g: { kind: "timeline", steps: [
      ["Years 0–20", "Childhood. Twenty years of fifty-two Saturdays, placed mostly by others."],
      ["Years 20–70", "The working middle. About two and a half thousand Saturdays."],
      ["Years 70–80", "A slower kind of time. Ten years of fifty-two, kept for a gentler pace."],
    ], mark: 1, markLabel: "The Saturdays you place yourself" },
    caption: "An eighty-year life, read as Saturdays. The middle band is the one this entry is about." },
  { t: "p", x:
    "The middle band is the one that matters, because it is the one you choose. A child's " +
    "Saturday belongs to parents and schools. A Saturday at seventy-five belongs to a pace that " +
    "has earned its slowness. The working middle belongs to whoever holds the calendar." },
  { t: "p", x:
    "Now take out the ones already spoken for. Obligation takes some: weddings, duties, the " +
    "family calendar. Travel takes others, the weekends spent reaching somewhere for someone " +
    "else's reason. Recovery takes the rest, the Saturday that exists only to repair the week." },
  { t: "graphic", g: { kind: "ladder", steps: [
      ["About 2,500", "Saturdays in the working middle of an eighty-year life"],
      ["Obligation", "Weddings, duties and the family calendar take their share"],
      ["Travel", "Weekends spent getting somewhere for someone else's reason"],
      ["Recovery", "The Saturday that exists to repair the week"],
      ["A few hundred", "The Saturdays truly yours to place"],
    ] },
    caption: "How the working middle narrows, step by step, to the Saturdays that are actually free." },
  { t: "p", x:
    "A few hundred remain that are truly yours to place. Spread across fifty working years, that " +
    "is a handful a year. Each one is worth more than its share of the calendar suggests, because " +
    "each one is a choice." },
  { t: "p", x:
    "Seen this way, a free Saturday is the scarcest thing in a working life. Money can be earned " +
    "back. A promotion can come later. A Saturday spent in traffic, or in recovering from one, is " +
    "simply gone from the few hundred." },
  { t: "p", x:
    "Most people sense this without counting it. They feel the year slipping and plan to go away " +
    "more. The plan rarely survives contact with the calendar, and the reason is usually the " +
    "same. The place they have in mind is too far to reach on an ordinary weekend." },
  { t: "facts", rows: [
      ["~4,000", "Saturdays in an eighty-year life"],
      ["~2,500", "of them in the working middle"],
      ["A few hundred", "truly yours to place"],
    ] },

  { t: "h", x: "Distance is what spends them" },
  { t: "p", x:
    "The usual assumption is that people go away less because they are busy. Distance predicts " +
    "it better." },
  { t: "p", x:
    "A place ninety minutes from home is a Friday-evening decision. A place four hours away is " +
    "a plan, and a plan needs a reason and a long weekend. The first gets used thirty times a " +
    "year without anyone deciding to. The second gets used four times, and twice because " +
    "someone else was coming." },
  { t: "graphic", g: { kind: "compare", head: ["Ninety minutes away", "Four hours away"], rows: [
      ["What it takes to go", "A Friday-evening decision", "A plan, a reason and a long weekend"],
      ["Who decides", "Whoever is free that evening", "Everyone whose calendar must agree"],
      ["When you arrive", "In time for dinner", "In time to sleep"],
      ["Visits in a year", "About thirty, without anyone deciding to", "About four, two of them for someone else"],
      ["What a single visit costs you", "An evening of driving", "A day each way"],
    ] },
    caption: "The same weekend, two distances. The place is identical; the arithmetic is different." },
  { t: "p", x:
    "Notice the last row of that drawing. The four-hour place costs a day each way, which on a " +
    "two-night visit is half the time away. The ninety-minute place costs an evening. Over a " +
    "year, a large share of the far place's weekends is spent on the road to it." },
  { t: "p", x:
    "The difference is in the decision, more than in the drive. A ninety-minute place asks for " +
    "nothing except the evening. It can absorb a mood, a free Friday, a sudden wish for quiet. " +
    "A four-hour place asks for agreement. Agreement is expensive, and families spend it carefully." },
  { t: "story", title: "The architect's two Fridays", x: [
    "Picture an architect in Bengaluru, mid-career, with two children and a practice that eats " +
    "her weekdays. For years the family kept a vague plan to visit a hill house four hours " +
    "north. It belonged to her husband's side. Everyone agreed it was beautiful.",
    "They went in October and again in May. Each trip needed a long weekend, a week of " +
    "messages and a car loaded the night before. By the time they arrived on Saturday, half the " +
    "weekend had gone to the road and the other half to the thought of driving back.",
    "Then a friend began renting a small place by a lake, about ninety minutes out. The " +
    "architect went once, on a whim, on a Friday evening. She was eating dinner on a veranda " +
    "before the traffic at home had cleared.",
    "That year she went back eleven times. Nobody planned any of those trips. Each began as a " +
    "Friday afternoon with nothing on it and a car with petrol in it.",
    "The hill house was the finer place by every measure she could name. The lake was the " +
    "place her children talked about. She noticed, with some surprise, that she had chosen it " +
    "without once comparing the two.",
  ] },
  { t: "p", x:
    "This is why proximity behaves like a luxury rather than a convenience. A convenience saves " +
    "an hour you already had. Proximity creates hours that would otherwise have been lost to a " +
    "decision nobody got round to making." },
  { t: "pull", x:
    "Proximity creates hours that would otherwise have been lost to a decision nobody got round to making." },

  { t: "h", x: "Why ninety minutes behaves like a different place" },
  { t: "p", x:
    "There is a threshold somewhere around the evening. Below it, a place fits after work. Above " +
    "it, a place needs a day. The threshold is psychological as much as practical, and it is " +
    "sharp. Half an hour either side of it changes how a place is used." },
  { t: "p", x:
    "Consider what a Friday evening holds. Work ends somewhere between five and seven. Dinner is " +
    "a fixed point a few hours later. A place you can reach between those two points belongs to " +
    "the weekend you already have. A place beyond them takes a day from it." },
  { t: "p", x:
    "Families feel this as the difference between going and planning to go. The first is a verb " +
    "in the present tense. The second is a project, with a lead time, a list and a fallback. " +
    "Projects get postponed. Evenings simply happen." },
  { t: "list", x: [
    "Inside the evening: a place joins the weekend you already have.",
    "Beyond the evening: a place takes a day of the weekend to reach.",
    "Beyond a day: a place becomes a holiday, and holidays come a few times a year.",
  ] },
  { t: "p", x:
    "Each step outward changes the kind of decision a place requires. Each kind of decision has " +
    "its own frequency. That is the whole mechanism, and it is simpler than most explanations of " +
    "why people go away less than they intended." },
  { t: "illus", plate: "creek/path", caption:
    "A path through trees, drawn as the first minutes after arrival on a Friday evening." },
  { t: "p", x:
    "There is a quieter effect too. A place you reach often becomes familiar, and familiarity " +
    "makes arrival easier. You know where the light falls at six. You know which chair takes the " +
    "breeze. The tenth visit begins faster than the first, because nothing needs learning." },
  { t: "p", x:
    "A far place resets that clock every time. Each visit spends its first evening relearning " +
    "the house. By the time it feels like yours, the weekend is closing." },

  { t: "p", x:
    "A place visited thirty times a year becomes a habit. A place visited four times remains an " +
    "occasion. Both have value, but they are different kinds of value, and a habit compounds in " +
    "a way an occasion cannot." },
  { t: "p", x:
    "Habits are built from repetition at short intervals. The interval matters more than the " +
    "intensity. A short walk taken daily shapes a life more than a long trek taken yearly. The " +
    "same is true of a place." },
  { t: "p", x:
    "Think of what accumulates when a family returns to one place most months. The children " +
    "know the path to the water. The adults know the person who sells fish on Saturdays. The " +
    "seasons become legible: the month the mangoes come, the week the first rain arrives." },
  { t: "p", x:
    "None of that can be bought on a single visit, however long. It is earned by returning. " +
    "Distance sets the rate of return, so distance sets the rate at which a place becomes yours." },
  { t: "story", title: "The Saturday that came home", x: [
    "Picture an NRI in Singapore whose parents live in Mysuru. He flies home twice a year and " +
    "spends most of each visit in the city, in relatives' homes.",
    "For years he told himself the family would take a trip together. A coast, perhaps, or the " +
    "hills. It never fitted. The coast was a day away. The hills needed a plan his father found " +
    "tiring.",
    "One December his sister found a place by a river, under two hours from their parents' " +
    "house. They went on a Saturday morning and were back the next evening. Nobody needed to " +
    "pack much.",
    "His father, who rarely travelled now, walked to the water three times that day. His mother " +
    "talked about it for weeks. They went again in June, when he was next home.",
    "The trip he had imagined for a decade was far grander. The one that happened was close " +
    "enough to say yes to. He noticed that his parents had stopped asking when they would go, " +
    "and started asking when they would go back.",
  ] },

  { t: "h", x: "The summers version" },
  { t: "p", x:
    "Parents recognise a harder form of the same arithmetic. A child is eight for one year. If " +
    "a place takes a full day to reach, you might be there together three times that year. If " +
    "it takes two hours, perhaps twelve." },
  { t: "graphic", g: { kind: "compare", head: ["A full day away", "Two hours away"], rows: [
      ["Visits in the year a child is eight", "About three", "Perhaps twelve"],
      ["Who chooses the dates", "The school holiday calendar", "Any free weekend"],
      ["What the child remembers", "A trip", "A place"],
    ] },
    caption: "One year of childhood, two distances. Only the number of visits changes." },
  { t: "p", x:
    "The place is unchanged. What changes is how often a family gathers in it, and that is what " +
    "a family remembers." },
  { t: "story", title: "Twelve summers, counted twice", x: [
    "Imagine a family in Pune with a daughter who has just turned eight. They have a choice of " +
    "two places for the years ahead, and they are serious about it.",
    "The first is a coastal house a full day's drive away. It is lovely. The family would reach " +
    "it in the summer holidays, at Diwali, perhaps once more if a long weekend fell well.",
    "The second is a plainer place in the hills, two hours out. Nobody would call it a " +
    "destination. It would be there most months, on any weekend the family had free.",
    "Now count forward to the year she turns eighteen and leaves for college. The coastal house " +
    "gives about thirty visits across those ten years. The hill place gives over a hundred.",
    "Ask her at twenty-five which one she remembers. She will likely describe the far house " +
    "vividly, in a few bright scenes. She will describe the near one as somewhere she grew up.",
    "Neither answer is wrong. They are two different things for a place to be in a childhood. " +
    "The family is choosing between them, whether or not they see it that way.",
  ] },
  { t: "p", x:
    "The sums in that story are illustrations, built only from the entry's own three and twelve " +
    "visits a year. The shape holds whatever the exact figures. A short distance multiplies; a " +
    "long one divides." },
  { t: "p", x:
    "Grandparents feel the same arithmetic from the other side. They have fewer Saturdays left " +
    "and more reason to spend them with family. A place close to everyone becomes the place " +
    "where three generations meet without anyone having to organise it." },
  { t: "p", x:
    "There is a hard edge to this for parents. The years when children want to come are " +
    "limited. Somewhere in the teens, friends and exams take the weekends. A place that was easy " +
    "to reach in those earlier years has already done its work by then." },
  { t: "p", x:
    "A place that was hard to reach may have had only a few dozen visits in that window. The " +
    "window closes on its own schedule, whatever the family intended. Distance decided how much " +
    "of it was used." },
  { t: "assert", x:
    "Frequency is a function of distance. Size, finish and view change how good one visit is. " +
    "Distance changes how many visits there are." },

  { t: "h", x: "Three ways to hold a nearby place" },
  { t: "p", x:
    "Once distance is accepted as the variable, the question becomes how to hold a place close " +
    "enough to use. There are three common answers, and each has a different shape. They differ " +
    "in who decides, who pays when nobody comes, and how easily you can leave." },
  { t: "graphic", g: { kind: "compare", head: ["Renting nearby", "Owning far away"], rows: [
      ["How often you go", "As often as the distance allows", "As often as a plan allows"],
      ["Who pays when nobody comes", "Nobody", "You, every month"],
      ["Who decides on upkeep", "The owner", "You, alone or with family"],
      ["How you leave", "You simply stop going", "A sale, with all its delay"],
      ["What you build", "Habit", "An asset, and a set of chores"],
    ] },
    caption: "Two common answers, compared by structure rather than by price." },
  { t: "p", x:
    "Renting nearby has the great virtue of ending cleanly. It costs nothing in the weeks you " +
    "are away. Its limit is that the place is someone else's. You arrive as a visitor each time, " +
    "and the dates are available only when the owner says so." },
  { t: "p", x:
    "Owning far away has the virtue of permanence and the vice of distance. The house is yours, " +
    "and the four hours are yours too, every visit. The standing costs run on the calendar while " +
    "the visits run on the distance." },
  { t: "p", x:
    "A third answer is to own part of a place close to home, with others, through a structure " +
    "that sets the rules in advance. Getaway Collective builds that kind of structure. Each " +
    "estate is a single asset in its own limited liability partnership, owned exclusively by its " +
    "partners." },
  { t: "graphic", g: { kind: "compare", head: ["Owning far away", "A partnership in a nearby estate"], rows: [
      ["Who runs the place", "You, or someone you hire and supervise", "Sensory Getaways, under a contract"],
      ["Who decides", "You, or your family by agreement", "Partners, by a vote weighted by holding"],
      ["Your nights", "Any night you can reach it", "One night a year for each 1% held, from handover"],
      ["The empty weeks", "Cost you money", "Are let, and the revenue enters the payment order"],
      ["Your liability", "Without limit", "Limited to what you contributed"],
    ] },
    caption: "The third answer, set beside the second. The comparison is of terms, and holds no forecast." },
  { t: "p", x:
    "Two details of that structure matter for the argument about distance. First, nights are " +
    "shared by a simple rule. Where more partners want the same dates than the estate can hold, " +
    "whoever has used the fewest nights that year goes first." },
  { t: "p", x:
    "Second, a night released rather than taken is let, and its revenue enters the payment " +
    "order like any other. The weeks a partner cannot reach the estate earn revenue for it, " +
    "rather than standing empty at the partner's cost." },
  { t: "p", x:
    "Neither detail changes the distance. A partnership four hours away has the same four hours " +
    "in it. That is why the radius belongs on the same page as the view whenever an estate is " +
    "weighed." },
  { t: "p", x:
    "Each answer suits a different person. The point of setting them side by side is to make the " +
    "distance visible in each. People weigh the house, the view and the price. They rarely put " +
    "the drive on the same page." },

  { t: "h", x: "What the far place is for" },
  { t: "p", x:
    "Far places keep their own value. A long trip to a remarkable place is one of the " +
    "great pleasures of a life. The point is that it belongs in a different category from the " +
    "place you return to." },
  { t: "p", x:
    "Far places are for occasions. They are where a family goes for a milestone, a reunion or " +
    "a winter that deserves marking. Their rarity is part of their value. Nobody needs thirty " +
    "visits a year to the edge of a glacier." },
  { t: "p", x:
    "Near places are for life. They are where the ordinary Saturdays go, the free and unplanned " +
    "ones. Without them, those Saturdays are spent at home in front of the same wall. Their " +
    "value lies in repetition." },
  { t: "p", x:
    "A good life probably holds both. A handful of far places, reached for occasions, and one " +
    "near place, reached most months. The arithmetic of four thousand Saturdays suggests the " +
    "near place does more of the work." },
  { t: "graphic", g: { kind: "compare", head: ["The far place", "The near place"], rows: [
      ["What it is for", "Occasions and milestones", "Ordinary Saturdays"],
      ["How it is remembered", "A few bright scenes", "A place you grew up in"],
      ["What makes it valuable", "Its rarity", "Its repetition"],
      ["What it needs from you", "A plan", "An evening"],
    ] },
    caption: "Two kinds of place, each good at a different thing. The mistake is to buy one expecting the other." },
  { t: "p", x:
    "The trouble begins when the two are confused. A family buys a far place expecting it to " +
    "behave like a near one, with thirty visits a year. It behaves like a far one, with four. " +
    "The gap is paid for, every month, in standing costs and in guilt." },

  { t: "h", x: "The narrower point" },
  { t: "p", x:
    "This is an argument about distance, and it holds for renting too. A rented house ninety " +
    "minutes away beats an owned one four hours away on this measure. We say so plainly, " +
    "because the opposite conclusion would suit us." },
  { t: "p", x:
    "The point is narrower. When people choose somewhere to go regularly, they weigh the place " +
    "and rarely the distance. Distance decides how much of the place they actually get." },
  { t: "illus", plate: "creek/lamps", caption:
    "Lamps along a path at dusk, drawn for the Friday arrival this entry argues for." },
  { t: "p", x:
    "A practical test follows. Before choosing a place to return to, write down the number of " +
    "times you expect to go in a year. Then write down the drive, door to door, on a Friday at " +
    "six. Look at the two numbers together." },
  { t: "p", x:
    "If the drive fits inside the evening, the first number is probably honest. If it takes a " +
    "day, divide the first number by something. Most people who have owned a far house know " +
    "roughly what to divide by." },
  { t: "p", x:
    "It helps to be honest about who is doing the dividing. Optimism lives in the first number. " +
    "Hindsight lives in the second. Ten years of owning a far house gives a " +
    "precise sense of how often you went. It is usually lower than you hoped." },
  { t: "p", x:
    "The same test works for a holiday, a rental, a club membership or a share of an estate. It " +
    "asks one thing: how often will this actually be used, given where it is? Every other " +
    "question about a place depends on that answer." },
  { t: "list", x: [
    "Count the Saturdays you expect to spend there in a year.",
    "Time the drive from your door on a Friday at six.",
    "If the drive fits before dinner, trust the count.",
    "If it takes a day, divide the count, and choose with the smaller number.",
  ] },
  { t: "p", x:
    "Four thousand Saturdays is a fixed budget. A few hundred of them are truly free. The places " +
    "that earn a share of those few hundred are, almost always, the ones close enough to reach " +
    "before dinner." },
];
