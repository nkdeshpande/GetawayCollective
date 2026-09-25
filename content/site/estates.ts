/**
 * THE ESTATES — one object per estate, rendered by app/_assemblies/site/render.ts
 *
 * Ported 24 Sep 2026 from the site prototype (_DESIGN/gc/GC-Site.html), which
 * stays the visual reference and is not edited from here. Hand-maintained
 * from now on: this is content, not generated output.
 *
 * Colours are FILM.ink keys, written {ink:key}. Links are routes. Every fact
 * the vehicle register owns is a {{TOKEN}} the renderer fills from
 * constants/vehicles.ts, so a figure is never typed twice.
 */

import type { SiteEstate } from "@/app/_assemblies/site/types";

export const ESTATES: Record<string, SiteEstate> = {
 "solace": {
  "key": "solace",
  "name": "Solace",
  "vehicle": "{{vehicle}}",
  "pal": "solace",
  "hour": 6.4,
  "enquireHour": 18.1,
  "heroLabel": "Drawn film: granite ridge at first light, Nandi Hills corridor",
  "eyebrow": "Getaway Collective · Nandi Hills corridor",
  "credit": "A SlowSpace estate · the reference vehicle",
  "spec": "{{KEYS}} keys · {{LAND}} · 65% of the land kept as it is · 2 h from Bengaluru",
  "intro": "Six keys on six-tenths of an acre, on a granite ridge two hours from Bengaluru. Two-thirds of the land stays exactly as it is. Solace is the first estate the collective will deliver, and the one every other estate will be measured against.",
  "place": {
   "film": [
    "solace",
    15
   ],
   "title": "Two hours from the city. <b>A ridge above the valley.</b>",
   "text": "Solace sits at Hosahudya in Chikkaballapura, on the Nandi Hills corridor north of Bengaluru. The climate is dry and high: cool mornings, long light, a monsoon that arrives as a line on the western horizon. The buildings take only a fifth of an acre; the rest of the ridge is left to itself.",
   "coords": "13°24'40.5\"N 77°49'26.9\"E · CONFIRMED 07 AUG 2026"
  },
  "concept": {
   "title": "Ground. Horizon. <span>Volume.</span>",
   "zones": [
    {
     "k": "ridge",
     "name": "Ridge",
     "sub": "Building A · ground",
     "text": "Ground-anchored, courtyard-first. Rain on stone, heard from bed.",
     "c": "{ink:moss}",
     "vols": [
      {
       "t": "box",
       "x": -180,
       "y": -40,
       "dx": 150,
       "dy": 110,
       "dz": 38
      }
     ]
    },
    {
     "k": "expanse",
     "name": "Expanse",
     "sub": "Building A · +3.8 m",
     "text": "Lifted to the horizon. A window seat the full width of the east wall.",
     "c": "{ink:slate}",
     "vols": [
      {
       "t": "box",
       "x": -200,
       "y": -60,
       "z": 38,
       "dx": 190,
       "dy": 120,
       "dz": 34
      }
     ]
    },
    {
     "k": "voyager",
     "name": "Voyager",
     "sub": "Building B · twin gables",
     "text": "A five-and-a-half-metre void over warm water. The roof is the instrument.",
     "c": "{ink:ember}",
     "vols": [
      {
       "t": "gable",
       "x": 60,
       "y": -60,
       "dx": 70,
       "dy": 140,
       "dz": 44,
       "rz": 40
      },
      {
       "t": "gable",
       "x": 150,
       "y": -60,
       "dx": 70,
       "dy": 140,
       "dz": 44,
       "rz": 40
      }
     ]
    }
   ],
   "labels": [
    [
     30,
     470,
     "BUILDING A · STACKED CHASSIS"
    ],
    [
     470,
     470,
     "BUILDING B · TWIN GABLES"
    ]
   ]
  },
  "chapters": [
   {
    "id": "ridge",
    "title": "Ridge",
    "film": [
     "solace",
     11,
     1
    ],
    "para": "Ridge sits on the ground floor of Building A and opens straight onto its own courtyard. The brief was one sentence: rain on stone, heard from bed. The low sill, the deep threshold and the stone apron all serve it. Two keys, numbers 1 and 2.",
    "meta": [
     "38 M² + COURTYARD",
     "EAST",
     "STEP-FREE",
     "2 ADULTS"
    ],
    "cards": [
     {
      "k": "Materials",
      "v": "Exposed chassis steel, local stone, lime plaster"
     },
     {
      "k": "Light",
      "v": "East courtyard light; deep eaves keep the monsoon out"
     },
     {
      "k": "Acoustics",
      "v": "The stone apron carries rainfall; inside stays at a murmur"
     },
     {
      "film": [
       "solace",
       7.2
      ],
      "b": "The courtyard",
      "s": "Slow mornings, the long table at noon"
     },
     {
      "k": "By design",
      "v": "No televisions. An offline-first key."
     }
    ]
   },
   {
    "id": "expanse",
    "title": "Expanse",
    "film": [
     "solace",
     5.9
    ],
    "para": "Expanse rides the upper deck of Building A at +3.8 metres. It is deliberately spare: the horizon does the decorating. A window seat runs the full width of the east wall, built for people who wake early on purpose. Two keys, numbers 3 and 4.",
    "meta": [
     "36 M² + DECK",
     "+3.8 M FFL",
     "EAST",
     "ONE FLIGHT OF STAIRS"
    ],
    "cards": [
     {
      "film": [
       "solace",
       21.5
      ],
      "b": "Night sky log",
      "s": "Bortle 2 on new-moon weeks"
     },
     {
      "k": "Materials",
      "v": "Steel chassis, glass, ash joinery"
     },
     {
      "k": "Light",
      "v": "Full-width east glazing. The whole space is a sundial."
     },
     {
      "k": "Acoustics",
      "v": "Lifted clear of the ground: wind, not footsteps"
     },
     {
      "k": "View",
      "v": "The Chikkaballapura ridge, uninterrupted"
     }
    ]
   },
   {
    "id": "voyager",
    "title": "Voyager",
    "film": [
     "solace",
     19.4
    ],
    "para": "The Twin Gables of Building B hold the two largest keys on the estate. Overhead the roof rises into a five-and-a-half-metre void; rain lands on it like an instrument. Below, a private onsen holds at forty degrees. Two keys, numbers 5 and 6.",
    "meta": [
     "52 M² + PORCH",
     "5.5 M VOID",
     "WEST",
     "STEP-FREE"
    ],
    "cards": [
     {
      "k": "Materials",
      "v": "Timber gable frame, dark steel, river stone"
     },
     {
      "film": [
       "solace",
       22,
       1
      ],
      "b": "Rain listening",
      "s": "The monsoon, on the roof"
     },
     {
      "k": "Warm water",
      "v": "A private onsen at 40 °C"
     },
     {
      "k": "Light",
      "v": "A high clerestory. The void glows at dusk."
     },
     {
      "k": "View",
      "v": "The valley mouth and the western rain line"
     }
    ]
   }
  ],
  "materials": [
   [
    "Structure",
    "Exposed chassis steel",
    "Left visible in Ridge and Expanse. The system is not hidden.",
    "{ink:granite}"
   ],
   [
    "Ground",
    "Local stone",
    "The courtyard apron; it carries the sound of rain.",
    "{ink:granite2}"
   ],
   [
    "Walls",
    "Lime plaster",
    "Breathes in the dry season, holds cool in the heat.",
    "{ink:granite3}"
   ],
   [
    "Joinery",
    "Ash",
    "The Expanse window seat and its full-width sill.",
    "{ink:sand}"
   ],
   [
    "Frame",
    "Timber gable frame",
    "The long span over Voyager's void.",
    "{ink:laterite}"
   ],
   [
    "Water",
    "River stone",
    "The onsen surround, held at 40 °C.",
    "{ink:granite4}"
   ],
   [
    "Fire",
    "A fireplace basket",
    "For the dry, cold nights of the hill winter.",
    "{ink:ember}"
   ],
   [
    "Quiet",
    "No televisions",
    "By design, in every key.",
    "{ink:land}"
   ],
   [
    "Access",
    "An offline-first key",
    "Entry that works without a signal.",
    "{ink:slate}"
   ]
  ],
  "day": {
   "eyebrow": "The day at Solace",
   "title": "Measured in light, <span>not in hours.</span>",
   "items": [
    [
     "05:50",
     "Dawn watch",
     "Fog lifts off the valley, seen from the Expanse window seat."
    ],
    [
     "06:40",
     "First light tea",
     "The fog clears mid-cup, in the Ridge courtyard."
    ],
    [
     "12:30",
     "The long table",
     "A harvest lunch, picked that morning."
    ],
    [
     "19:30",
     "Warm water",
     "The onsen after dark, under the Voyager void."
    ],
    [
     "22:00",
     "Night sky",
     "Bortle 2 on new-moon weeks. Field glasses on the shelf."
    ]
   ],
   "note": "The estate is run by Sensory Getaways, the operating partner. Partners use it in proportion to their position; the allocation rule is being set."
  },
  "getting": {
   "title": "Two hours <span>north.</span>",
   "sub": "Travel time from Bengaluru.",
   "cards": [
    [
     "2h",
     "BY CAR",
     "From central Bengaluru, north on the Nandi Hills corridor."
    ],
    [
     "—",
     "FROM THE AIRPORT",
     "Kempegowda International sits between the city and Solace. The drive time is not on record yet."
    ]
   ],
   "map": {
    "bounds": [
     12.9,
     77.5,
     13.45,
     77.9
    ],
    "pts": [
     [
      12.9716,
      77.5946,
      "Bengaluru"
     ],
     [
      13.1986,
      77.7066,
      "Kempegowda International"
     ],
     [
      13.41125,
      77.824139,
      "SOLACE",
      1
     ]
    ],
    "route": [
     0,
     1,
     2
    ],
    "tag": [
     0,
     2,
     "2h"
    ]
   }
  },
  "plan": {
   "title": "Two buildings, <span>six keys.</span>",
   "note": "Schematic, not to scale. Areas are those scheduled for each key.",
   "tabs": [
    {
     "tab": "Site",
     "t": "Site",
     "rows": [
      [
       "Buildable",
       "0.2 acre"
      ],
      [
       "Kept as it is",
       "≥ 65%"
      ],
      [
       "Buildings",
       "A · Stacked · B · Gables"
      ],
      [
       "Keys",
       "6"
      ]
     ],
     "svg": "<rect x=\"30\" y=\"30\" width=\"540\" height=\"360\" fill=\"{ink:ink}\" fill-opacity=\".06\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><rect x=\"120\" y=\"150\" width=\"150\" height=\"110\" fill=\"{ink:moss}\" fill-opacity=\".35\" stroke=\"{ink:ink}\"/><text x=\"130\" y=\"175\" font-family=\"Space Mono\" font-size=\"12\">A</text><rect x=\"330\" y=\"120\" width=\"70\" height=\"140\" fill=\"{ink:ember}\" fill-opacity=\".35\" stroke=\"{ink:ink}\"/><rect x=\"420\" y=\"120\" width=\"70\" height=\"140\" fill=\"{ink:ember}\" fill-opacity=\".35\" stroke=\"{ink:ink}\"/><text x=\"340\" y=\"145\" font-family=\"Space Mono\" font-size=\"12\">B</text><path d=\"M30 330C150 300 300 350 570 300\" fill=\"none\" stroke=\"{ink:ink}\" stroke-dasharray=\"4 4\"/><text x=\"40\" y=\"380\" font-family=\"Space Mono\" font-size=\"11\">KEPT AS IT IS · THE RIDGE</text><path d=\"M540 60V100M530 70L540 60L550 70\" stroke=\"{ink:ink}\" fill=\"none\"/><text x=\"534\" y=\"115\" font-family=\"Space Mono\" font-size=\"11\">N</text>"
    },
    {
     "tab": "A · Ground · Ridge",
     "t": "Ridge",
     "rows": [
      [
       "Footprint",
       "38 m² + courtyard"
      ],
      [
       "Orientation",
       "East"
      ],
      [
       "Entry",
       "Courtyard threshold"
      ],
      [
       "Access",
       "Step-free"
      ],
      [
       "Keys",
       "Key 1"
      ]
     ],
     "svg": "<rect x=\"80\" y=\"70\" width=\"300\" height=\"250\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><rect x=\"380\" y=\"70\" width=\"150\" height=\"250\" fill=\"{ink:moss}\" fill-opacity=\".18\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><text x=\"400\" y=\"200\" font-family=\"Space Mono\" font-size=\"12\">COURTYARD</text><rect x=\"110\" y=\"100\" width=\"120\" height=\"100\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"120\" y=\"160\" font-family=\"Space Mono\" font-size=\"11\">KING</text><rect x=\"250\" y=\"100\" width=\"100\" height=\"90\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"258\" y=\"150\" font-family=\"Space Mono\" font-size=\"11\">RAIN SHOWER</text><path d=\"M380 250A40 40 0 0 0 340 290\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"110\" y=\"300\" font-family=\"Space Mono\" font-size=\"11\">TEA COUNTER</text>"
    },
    {
     "tab": "A · Upper · Expanse",
     "t": "Expanse",
     "rows": [
      [
       "Footprint",
       "36 m² + deck"
      ],
      [
       "Level",
       "+3.8 m FFL"
      ],
      [
       "Orientation",
       "East"
      ],
      [
       "Entry",
       "External stair"
      ],
      [
       "Keys",
       "Key 3"
      ]
     ],
     "svg": "<rect x=\"80\" y=\"80\" width=\"330\" height=\"220\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><rect x=\"410\" y=\"80\" width=\"120\" height=\"220\" fill=\"{ink:slate}\" fill-opacity=\".2\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><text x=\"425\" y=\"195\" font-family=\"Space Mono\" font-size=\"12\">DECK</text><rect x=\"394\" y=\"100\" width=\"16\" height=\"180\" fill=\"{ink:slate}\" fill-opacity=\".5\"/><text x=\"300\" y=\"75\" font-family=\"Space Mono\" font-size=\"11\">WINDOW SEAT, FULL WIDTH</text><rect x=\"120\" y=\"120\" width=\"130\" height=\"110\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"130\" y=\"180\" font-family=\"Space Mono\" font-size=\"11\">KING</text><rect x=\"270\" y=\"210\" width=\"100\" height=\"70\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"276\" y=\"250\" font-family=\"Space Mono\" font-size=\"11\">SKYLIGHT SHOWER</text>"
    },
    {
     "tab": "B · Twin Gables · Voyager",
     "t": "Voyager",
     "rows": [
      [
       "Footprint",
       "52 m² + porch"
      ],
      [
       "Void",
       "5.5 m"
      ],
      [
       "Orientation",
       "West"
      ],
      [
       "Access",
       "Step-free"
      ],
      [
       "Keys",
       "Key 5"
      ]
     ],
     "svg": "<rect x=\"90\" y=\"60\" width=\"330\" height=\"290\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><path d=\"M255 60V350\" stroke=\"{ink:ink}\" stroke-dasharray=\"6 5\"/><text x=\"262\" y=\"80\" font-family=\"Space Mono\" font-size=\"11\">RIDGE LINE · 5.5 M VOID</text><rect x=\"120\" y=\"110\" width=\"120\" height=\"110\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"128\" y=\"170\" font-family=\"Space Mono\" font-size=\"11\">KING</text><rect x=\"290\" y=\"240\" width=\"100\" height=\"80\" fill=\"{ink:ember}\" fill-opacity=\".25\" stroke=\"{ink:ink}\"/><text x=\"298\" y=\"285\" font-family=\"Space Mono\" font-size=\"11\">ONSEN 40°</text><rect x=\"20\" y=\"140\" width=\"70\" height=\"140\" fill=\"{ink:ember}\" fill-opacity=\".12\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><text x=\"26\" y=\"215\" font-family=\"Space Mono\" font-size=\"11\">PORCH</text>"
    }
   ]
  },
  "details": [
   [
    "House brand",
    "SlowSpace"
   ],
   [
    "Place",
    "Hosahudya, Chikkaballapura, Karnataka"
   ],
   [
    "Buildable",
    "0.2 acre"
   ],
   [
    "Kept as it is",
    "At least 65%"
   ],
   [
    "Buildings",
    "A · Stacked chassis · B · Twin gables"
   ],
   [
    "Climate",
    "Arid hill"
   ],
   [
    "Stage",
    "Confirmed · in delivery"
   ],
   [
    "Operator",
    "Sensory Getaways"
   ],
   [
    "Nights per unit",
    "Allocation rule being set",
    1
   ],
   [
    "Platform fee",
    "One disclosed waterfall stage"
   ]
  ],
  "slug": "slowspace-solace",
  "vehicleKey": "solace"
 },
 "confluence": {
  "key": "confluence",
  "name": "Confluence",
  "vehicle": "{{vehicle}}",
  "pal": "coast",
  "hour": 18.5,
  "enquireHour": 18.8,
  "heroLabel": "Drawn film: the river mouth at dusk, Padubidri",
  "eyebrow": "Getaway Collective · Udupi coast",
  "credit": "Seaside Confluence · a SlowSpace estate · the first coastal estate",
  "spec": "{{KEYS}} keys · one steel building · {{LAND}}",
  "intro": "Twelve keys over the river where it meets the sea, on the Udupi coast. One building, stood on steel so the ground under it is barely touched. Every key looks at the river; the verandah is the useful space.",
  "place": {
   "film": [
    "coast",
    17.2
   ],
   "title": "Two waters meeting. <b>That is the name.</b>",
   "text": "The estate sits at Nadsal, Padubidri, in Kaup taluk of Udupi district, on the estuarine edge of the coast: the Arabian Sea to the west, a river estuary to the east. The mangrove along the water is protected and nothing is built or planted in it.",
   "coords": "13.117416°N 74.765988°E"
  },
  "concept": {
   "title": "One building. <span>Two waters.</span>",
   "lead": "Mostly steel, because of the coastal zone and the mangrove setbacks. Driven galvanised piles, no excavation, and a building that stands inside its registered parcel.",
   "ground": [
    {
     "c": "{ink:sea2}",
     "w": 3,
     "pts": [
      [
       240,
       -300,
       0
      ],
      [
       240,
       300,
       0
      ]
     ],
     "dash": ""
    }
   ],
   "zones": [
    {
     "k": "lower",
     "name": "River six",
     "sub": "L0 · +2.00",
     "text": "Six keys over an open stilt undercroft, balconies cantilevered to the river behind bronze fins.",
     "c": "{ink:sea3}",
     "vols": [
      {
       "t": "box",
       "x": -60,
       "y": -120,
       "z": 30,
       "dx": 130,
       "dy": 204,
       "dz": 38
      }
     ]
    },
    {
     "k": "upper",
     "name": "Upper six",
     "sub": "L1 · +5.80",
     "text": "Six keys above, under a single steel roof whose ridge stays below the 9.00 m coastal cap.",
     "c": "{ink:ember}",
     "vols": [
      {
       "t": "box",
       "x": -60,
       "y": -120,
       "z": 68,
       "dx": 130,
       "dy": 204,
       "dz": 36
      }
     ]
    },
    {
     "k": "plaza",
     "name": "The plaza",
     "sub": "+2.00 · 15 × 12.8 m",
     "text": "The hall, the monsoon veranda, the sage pool and the hearth, on the same steel deck.",
     "c": "{ink:sand}",
     "vols": [
      {
       "t": "box",
       "x": -60,
       "y": 100,
       "z": 30,
       "dx": 150,
       "dy": 128,
       "dz": 22
      }
     ]
    },
    {
     "k": "river",
     "name": "The river",
     "sub": "east face",
     "text": "Every balcony faces it. The river line and the coastal zone decide where the building may stand.",
     "c": "{ink:sea2}",
     "vols": [
      {
       "t": "water",
       "x": 180,
       "y": -300,
       "dx": 120,
       "dy": 600
      }
     ]
    }
   ],
   "labels": [
    [
     30,
     470,
     "THE MONOLITH · 20.4 × 13.0 M"
    ],
    [
     470,
     470,
     "THE RIVER · EAST"
    ]
   ]
  },
  "chapters": [
   {
    "id": "river",
    "title": "The river six",
    "film": [
     "coast",
     16.5
    ],
    "para": "Six keys stand at +2.00 over an open undercroft, so the ground and the tide pass underneath. Each key is one 3.4-metre bay, 13 metres deep from the spine to the balcony, and each balcony looks straight at the water. Bronze fins at 32 degrees give privacy without a wall.",
    "meta": [
     "44.2 M² · 476 SQ FT",
     "+2.00",
     "EAST TO THE RIVER",
     "13.0 M FROM SPINE TO BALCONY"
    ],
    "cards": [
     {
      "k": "The chain",
      "v": "Spine 1.4 · sleep 5.0 · wet and dress 3.2 · balcony 3.4 metres"
     },
     {
      "k": "Privacy",
      "v": "Bronze fins, 350 × 12 mm, at 600 mm centres"
     },
     {
      "film": [
       "coast",
       6.8
      ],
      "b": "The balcony",
      "s": "Behind the fins, over the water"
     },
     {
      "k": "Structure",
      "v": "A 200 UC steel frame on 28 columns"
     },
     {
      "k": "Ground",
      "v": "About 23 m² touches the ground, against 306 m² for a raft"
     }
    ]
   },
   {
    "id": "upper",
    "title": "The upper six",
    "film": [
     "coast",
     7.4
    ],
    "para": "The second level stands at +5.80, under a steel plate roof pitched at two degrees and clad in standing-seam aluminium. The ridge sits at +8.95, below the 9.00-metre coastal cap. Open galvanised stair cores on the spine face carry you up; nothing is enclosed at the stair.",
    "meta": [
     "44.2 M² · 476 SQ FT",
     "+5.80",
     "RIDGE +8.95",
     "OPEN STAIR CORES"
    ],
    "cards": [
     {
      "k": "Roof",
      "v": "2° four-way hip, steel plate, standing-seam aluminium"
     },
     {
      "k": "Protection",
      "v": "ISO 12944 C5-M duplex; CX on the river face"
     },
     {
      "film": [
       "coast",
       21
      ],
      "b": "Rain on the roof",
      "s": "July brings the wettest month"
     },
     {
      "k": "Spray zone",
      "v": "316L and duplex 2205 stainless. No corten, ever."
     },
     {
      "k": "Sound",
      "v": "Party walls on staggered studs; STC 60 is tested, not assumed"
     }
    ]
   },
   {
    "id": "plaza",
    "title": "The plaza",
    "film": [
     "coast",
     19.6
    ],
    "para": "Beside the keys, on the same steel deck, the plaza holds the estate's shared life: a hall, a monsoon veranda open on three sides, a sage pool and a hearth. Rain on three sides. Dry underfoot. On the roof above sits the Crown, the smallest enclosure on the estate and the one with the widest view.",
    "meta": [
     "15.0 × 12.8 M",
     "HALL 120 M²",
     "VERANDA 72 M²",
     "THE CROWN 7.5 × 5.0"
    ],
    "cards": [
     {
      "k": "The veranda",
      "v": "15 × 4.8 m, unenclosed on three sides"
     },
     {
      "k": "The pool",
      "v": "A sage pool, 3.5 × 8.6 m. Clean mineral, no scent added."
     },
     {
      "film": [
       "coast",
       19.2,
       1
      ],
      "b": "The monsoon veranda",
      "s": "Rain on three sides, dry underfoot"
     },
     {
      "k": "The hearth",
      "v": "4 × 2 m, lit at dusk"
     },
     {
      "k": "The Crown",
      "v": "7.5 × 5.0 m on the roof"
     }
    ]
   },
   {
    "id": "arrival",
    "title": "Arrival",
    "film": [
     "coast",
     12.4
    ],
    "para": "From Beach Road a narrow drive leads to an open court of volcanic cobble, eleven by ten metres. From there a procession 1.9 metres wide climbs two metres over twenty-two to the deck. Nothing at ground level is enclosed; the tide and the air move under the whole estate.",
    "meta": [
     "COURT 11 × 10 M",
     "PROCESSION 22 M",
     "RISES 2.0 M",
     "VOLCANIC COBBLE"
    ],
    "cards": [
     {
      "k": "The gate",
      "v": "Bronze, at the end of the neck drive"
     },
     {
      "k": "The court",
      "v": "Open to the sky, 11 × 10 m"
     },
     {
      "film": [
       "coast",
       9.5
      ],
      "b": "The procession",
      "s": "A slow climb to the deck"
     },
     {
      "k": "Undercroft",
      "v": "Kept open, so the building counts as ground plus one"
     }
    ]
   }
  ],
  "materials": [
   [
    "Structure",
    "Galvanised steel",
    "Driven 273 CHS piles and a 200 UC frame. No excavation.",
    "{ink:steelGrey}"
   ],
   [
    "Coating",
    "C5-M duplex",
    "Hot-dip galvanising under 240 µm of epoxy and polyurethane.",
    "{ink:slate}"
   ],
   [
    "Screen",
    "Bronze fins",
    "32° blades between each balcony and the river.",
    "{ink:ember}"
   ],
   [
    "Roof",
    "Standing-seam aluminium",
    "Over a 2° steel plate.",
    "{ink:steelGrey2}"
   ],
   [
    "Ground",
    "Volcanic cobble",
    "The arrival court.",
    "{ink:stone}"
   ],
   [
    "Water",
    "Sage pool",
    "Mineral, with no scent added.",
    "{ink:sea2}"
   ],
   [
    "Spray zone",
    "316L and duplex 2205",
    "Where salt reaches the steel.",
    "{ink:steelGrey3}"
   ],
   [
    "Deck",
    "Composite, 350 mm",
    "The only concrete above ground: 135 mm on the deck.",
    "{ink:stone2}"
   ],
   [
    "Never",
    "No corten",
    "Prohibited on this coast.",
    "{ink:ember2}"
   ]
  ],
  "day": {
   "eyebrow": "The day at Confluence",
   "title": "Nothing is scheduled. <span>That is the design.</span>",
   "items": [
    [
     "DAWN",
     "The river",
     "Every key's balcony, over the water, behind the fins."
    ],
    [
     "LOW TIDE",
     "The confluence walk",
     "To the river mouth on foot. Never into the mangrove."
    ],
    [
     "MONSOON",
     "The veranda",
     "Rain on three sides, dry underfoot. Come in July."
    ],
    [
     "DUSK",
     "The fire",
     "The hearth is lit, for about three-quarters of an hour."
    ],
    [
     "TIDE",
     "The tide table",
     "Dinner on the veranda, timed to the tide."
    ]
   ],
   "note": "Food and the tide table will be run by an operating partner; the appointment is out to tender. A ritual is an invitation, never programming."
  },
  "getting": {
   "title": "Thirty minutes <span>from the airport.</span>",
   "sub": "Distances from the estate.",
   "cards": [
    [
     "~31 km",
     "MANGALURU AIRPORT",
     "About 32 to 46 minutes by road, on an independent check."
    ],
    [
     "1.5 km",
     "NH-66",
     "The coast highway runs just to the east."
    ],
    [
     "~4 km",
     "KONKAN RAILWAY",
     "The nearest station."
    ],
    [
     "350 km",
     "BENGALURU",
     "By road."
    ]
   ],
   "map": {
    "bounds": [
     12.85,
     74.72,
     13.2,
     75
    ],
    "pts": [
     [
      12.9613,
      74.89,
      "Mangaluru airport"
     ],
     [
      13.117416,
      74.765988,
      "CONFLUENCE",
      1
     ]
    ],
    "route": [
     0,
     1
    ],
    "tag": [
     0,
     1,
     "~31 km"
    ]
   }
  },
  "plan": {
   "title": "One building, <span>on its parcel.</span>",
   "note": "Schematic, not to scale, and design intent only: not for construction. Every position waits on the Coastal Regulation Zone line.",
   "tabs": [
    {
     "tab": "Site",
     "t": "Site",
     "rows": [
      [
       "Building",
       "20.4 × 13.0 m"
      ],
      [
       "Plaza",
       "15.0 × 12.8 m"
      ],
      [
       "Enclosed floor",
       "817 m²"
      ]
     ],
     "svg": "<polygon points=\"80,360 520,330 470,70\" fill=\"{ink:ink}\" fill-opacity=\".05\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><text x=\"90\" y=\"385\" font-family=\"Space Mono\" font-size=\"11\">REGISTERED PARCEL · 84.09 × 28.16 × 83.69 M</text><rect x=\"330\" y=\"150\" width=\"110\" height=\"70\" fill=\"{ink:sea3}\" fill-opacity=\".35\" stroke=\"{ink:ink}\" transform=\"rotate(-6 385 185)\"/><text x=\"336\" y=\"140\" font-family=\"Space Mono\" font-size=\"11\">MONOLITH</text><rect x=\"250\" y=\"240\" width=\"80\" height=\"70\" fill=\"{ink:sand}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><text x=\"254\" y=\"232\" font-family=\"Space Mono\" font-size=\"11\">PLAZA</text><path d=\"M560 20C540 150 570 260 540 400\" fill=\"none\" stroke=\"{ink:sea}\" stroke-width=\"8\" stroke-opacity=\".5\"/><text x=\"545\" y=\"40\" font-family=\"Space Mono\" font-size=\"11\">RIVER</text>"
    },
    {
     "tab": "The key · section",
     "t": "A key",
     "rows": [
      [
       "Bay",
       "3.4 m"
      ],
      [
       "Depth",
       "13.0 m"
      ],
      [
       "Gross",
       "44.2 m² · 476 sq ft"
      ],
      [
       "Levels",
       "+2.00 · +5.80"
      ],
      [
       "Keys",
       "12"
      ]
     ],
     "svg": "<g font-family=\"Space Mono\" font-size=\"11\"><rect x=\"40\" y=\"140\" width=\"42\" height=\"120\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><text x=\"44\" y=\"280\">SPINE 1.4</text><rect x=\"82\" y=\"140\" width=\"150\" height=\"120\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><text x=\"130\" y=\"205\">SLEEP 5.0</text><rect x=\"232\" y=\"140\" width=\"96\" height=\"120\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><text x=\"236\" y=\"205\">WET 3.2</text><rect x=\"328\" y=\"140\" width=\"102\" height=\"120\" fill=\"{ink:sea3}\" fill-opacity=\".18\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><text x=\"336\" y=\"205\">BALCONY 3.4</text><line x1=\"338\" y1=\"140\" x2=\"346\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><line x1=\"354\" y1=\"140\" x2=\"362\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><line x1=\"370\" y1=\"140\" x2=\"378\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><line x1=\"386\" y1=\"140\" x2=\"394\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><line x1=\"402\" y1=\"140\" x2=\"410\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><line x1=\"418\" y1=\"140\" x2=\"426\" y2=\"260\" stroke=\"{ink:ember}\" stroke-width=\"3\"/><path d=\"M470 100C460 180 480 240 470 330\" fill=\"none\" stroke=\"{ink:sea}\" stroke-width=\"10\" stroke-opacity=\".4\"/><text x=\"452\" y=\"360\">RIVER</text><line x1=\"40\" y1=\"300\" x2=\"430\" y2=\"300\" stroke=\"{ink:ink}\"/><text x=\"200\" y=\"320\">13.0 M</text></g>"
    },
    {
     "tab": "Plaza",
     "t": "The plaza",
     "rows": [
      [
       "Hall",
       "15 × 8 m · 120 m²"
      ],
      [
       "Veranda",
       "15 × 4.8 m · 72 m²"
      ],
      [
       "Sage pool",
       "3.5 × 8.6 m"
      ],
      [
       "Hearth",
       "4 × 2 m"
      ],
      [
       "The Crown",
       "7.5 × 5.0 m, on the roof"
      ]
     ],
     "svg": "<rect x=\"60\" y=\"60\" width=\"480\" height=\"300\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><rect x=\"60\" y=\"60\" width=\"480\" height=\"190\" fill=\"{ink:sand}\" fill-opacity=\".2\" stroke=\"{ink:ink}\"/><text x=\"72\" y=\"90\" font-family=\"Space Mono\" font-size=\"12\">HALL · 120 M²</text><rect x=\"60\" y=\"250\" width=\"480\" height=\"110\" fill=\"{ink:sea2}\" fill-opacity=\".18\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><text x=\"72\" y=\"330\" font-family=\"Space Mono\" font-size=\"12\">MONSOON VERANDA · OPEN ON THREE SIDES</text><rect x=\"400\" y=\"100\" width=\"110\" height=\"60\" fill=\"{ink:sea}\" fill-opacity=\".4\" stroke=\"{ink:ink}\"/><text x=\"404\" y=\"135\" font-family=\"Space Mono\" font-size=\"10\">SAGE POOL</text><rect x=\"120\" y=\"170\" width=\"60\" height=\"30\" fill=\"{ink:ember}\" fill-opacity=\".4\" stroke=\"{ink:ink}\"/><text x=\"124\" y=\"190\" font-family=\"Space Mono\" font-size=\"10\">HEARTH</text>"
    }
   ]
  },
  "details": [
   [
    "House brand",
    "SlowSpace"
   ],
   [
    "Place",
    "Nadsal, Padubidri, Kaup taluk, Udupi"
   ],
   [
    "Key",
    "44.2 m² · 476 sq ft"
   ],
   [
    "Structure",
    "Steel on driven piles"
   ],
   [
    "Enclosed floor",
    "817 m²"
   ],
   [
    "Climate",
    "Coastal estuary"
   ],
   [
    "Stage",
    "In design; not yet issued for construction"
   ],
   [
    "Coastal zone",
    "The Coastal Regulation Zone (CRZ) line, not yet read from the survey; it decides where every building may stand",
    1
   ],
   [
    "Floor area permission",
    "Met by the assembled land"
   ],
   [
    "Operator",
    "Sensory Getaways; food partner out to tender"
   ]
  ],
  "detailsNote": "",
  "waitlist": {
   "chip": "FULLY SUBSCRIBED",
   "title": "Join the <span>waitlist.</span>",
   "text": "Every offered unit of {{vehicle}} is held. If, after the lock-in, a partner offers units for sale, the waitlist is offered them first, in the order it was joined. A place on the waitlist is not an offer and commits you to nothing.",
   "chips": [
    "1 unit",
    "2 units",
    "3 or more"
   ],
   "ok": "You are on the Confluence waitlist. Investor Relations will write if a partner offers units for sale; nothing is asked of you until then.",
   "note": "Units change hands only after the lock-in, at a price the partners agree, and a buyer from outside needs their consent. Nothing guarantees that any will be offered."
  },
  "slug": "slowspace-coastal",
  "vehicleKey": "slowspace"
 },
 "creek": {
  "key": "creek",
  "name": "Creek",
  "vehicle": "{{vehicle}}",
  "pal": "creek",
  "hour": 13,
  "heroRain": 1,
  "enquireHour": 20,
  "heroLabel": "Drawn film: rain over the river-forest, Coorg",
  "eyebrow": "Getaway Collective · Kodagu",
  "credit": "SlowSpace Creek · the riverine flagship",
  "spec": "{{KEYS}} keys · {{LAND}}",
  "intro": "A winding refuge hidden beneath the canopy, where water pulls you slowly away from the world. The water is the site, not the planting: a stream splits the estate into an escarpment and a riparian terrace, and the only way across is on foot.",
  "place": {
   "film": [
    "creek",
    9,
    1
   ],
   "title": "It rains ninety days a year. <b>We built for the ninety.</b>",
   "text": "Creek lies at Cherala, near Sunticoppa and Kushalnagara in Kodagu, in the river-forest of Coorg. Between 2,500 and 4,000 millimetres of rain fall each year. The last engine you hear is your own car, at the gate: from there you walk down, and cross the water.",
   "coords": "12.385716°N 75.836097°E"
  },
  "concept": {
   "title": "The river is <span>the operating system.</span>",
   "lead": "Four clusters on the escarpment, one over the bank, one bridge between them. Every walk holds a 1:20 gradient; the car stops at the top.",
   "ground": [
    {
     "c": "{ink:river}",
     "w": 10,
     "pts": [
      [
       -300,
       40,
       0
      ],
      [
       -120,
       60,
       0
      ],
      [
       40,
       20,
       0
      ],
      [
       180,
       70,
       0
      ],
      [
       320,
       40,
       0
      ]
     ]
    }
   ],
   "zones": [
    {
     "k": "ridge",
     "name": "Ridge clusters",
     "sub": "C1–C4 · escarpment",
     "text": "Sixteen keys in four clusters of four, on a pier field at +100 and +98.",
     "c": "{ink:canopy}",
     "vols": [
      {
       "t": "box",
       "x": -260,
       "y": -240,
       "z": 40,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": -200,
       "y": -240,
       "z": 40,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": -120,
       "y": -250,
       "z": 40,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": -60,
       "y": -250,
       "z": 40,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": 30,
       "y": -240,
       "z": 30,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": 90,
       "y": -240,
       "z": 30,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": 170,
       "y": -230,
       "z": 30,
       "dx": 50,
       "dy": 44,
       "dz": 24
      },
      {
       "t": "box",
       "x": 230,
       "y": -230,
       "z": 30,
       "dx": 50,
       "dy": 44,
       "dz": 24
      }
     ]
    },
    {
     "k": "bank",
     "name": "The bank cluster",
     "sub": "C5 · riparian",
     "text": "Four keys on a steel platform over the bank, decks facing north over the water.",
     "c": "{ink:canopy2}",
     "vols": [
      {
       "t": "box",
       "x": -60,
       "y": 100,
       "z": 10,
       "dx": 50,
       "dy": 44,
       "dz": 22
      },
      {
       "t": "box",
       "x": 0,
       "y": 100,
       "z": 10,
       "dx": 50,
       "dy": 44,
       "dz": 22
      }
     ]
    },
    {
     "k": "commons",
     "name": "Roastery and sauna",
     "sub": "the shared terrace",
     "text": "A roastery behind a mass wall, and a wood-fired sauna cantilevered over the lake.",
     "c": "{ink:ember}",
     "vols": [
      {
       "t": "box",
       "x": 120,
       "y": 120,
       "z": 0,
       "dx": 70,
       "dy": 62,
       "dz": 30
      },
      {
       "t": "box",
       "x": 220,
       "y": 190,
       "z": 0,
       "dx": 34,
       "dy": 54,
       "dz": 22
      }
     ]
    },
    {
     "k": "water",
     "name": "The water",
     "sub": "stream and lake",
     "text": "The stream splits the estate; the lake sits at +92.5 on the lower terrace.",
     "c": "{ink:river}",
     "vols": [
      {
       "t": "water",
       "x": 200,
       "y": 230,
       "dx": 130,
       "dy": 90
      }
     ]
    }
   ],
   "labels": [
    [
     30,
     470,
     "ESCARPMENT · C1–C4"
    ],
    [
     430,
     470,
     "TERRACE · C5, ROASTERY, SAUNA, LAKE"
    ]
   ]
  },
  "chapters": [
   {
    "id": "crossing",
    "title": "The crossing",
    "film": [
     "creek",
     18.7
    ],
    "para": "Arrival is a court under a single steel plate, where the car stops and never goes further. After a pause of a minute or so, you walk down the escarpment at a gradient that never exceeds one in twenty, and cross the stream on the estate's one bridge. Luggage goes through a hatch in the wall.",
    "meta": [
     "BRIDGE +95.6",
     "PARKING +102",
     "ONE IN TWENTY",
     "THE CAR NEVER ENTERS"
    ],
    "cards": [
     {
      "k": "The court",
      "v": "6.0 × 4.8 m, under a 12.0 × 8.7 m plate"
     },
     {
      "k": "The rill",
      "v": "A 300 mm channel of water beside the path"
     },
     {
      "film": [
       "creek",
       18.9,
       1
      ],
      "b": "Dusk on the bridge",
      "s": "The first ritual, on arrival"
     },
     {
      "k": "Operations",
      "v": "A separate bridge and a ford that guests never use"
     }
    ]
   },
   {
    "id": "ridge",
    "title": "Ridge",
    "film": [
     "creek",
     8.2
    ],
    "para": "Sixteen keys sit in four clusters of four on the escarpment, each on a steel pier field above the forest floor. A key is a 7.2 by 6.0 metre plate on a 1,200 millimetre grid, with a deck the same width and a shallow mirror pool on every deck. Half the keys add a loft at +3.6 metres.",
    "meta": [
     "465 SQ FT · 43.2 M²",
     "PLATE 7.2 × 6.0 M",
     "DECK 7.2 × 4.8 M",
     "LOFT TYPE UNDER REVIEW"
    ],
    "cards": [
     {
      "k": "Two types",
      "v": "TYPE-G, 3.3 m clear · TYPE-GL, with a loft at +3.6 m"
     },
     {
      "k": "Mirror pool",
      "v": "6.0 × 2.4 m, 0.3 m deep, on every deck"
     },
     {
      "film": [
       "creek",
       11,
       1
      ],
      "b": "The deck",
      "s": "A 1.8 m cantilever over the slope"
     },
     {
      "k": "Views",
      "v": "15° view cones, so no key looks at another"
     },
     {
      "k": "Chassis",
      "v": "Ridge"
     }
    ]
   },
   {
    "id": "bank",
    "title": "The bank",
    "film": [
     "creek",
     6.5
    ],
    "para": "The fifth cluster stands on a steel platform over the stream's bank, carried on forty-five tension piles, its four decks facing north over the water and its entries turned away to the south. It is the closest any key comes to the river, and the reason the estate is called what it is.",
    "meta": [
     "4 KEYS",
     "45 TENSION PILES",
     "DECKS NORTH",
     "OVER THE BANK"
    ],
    "cards": [
     {
      "k": "Platform",
      "v": "Steel, on 45 tension piles"
     },
     {
      "film": [
       "creek",
       5.8
      ],
      "b": "First light over the water",
      "s": "From the bank cluster decks"
     },
     {
      "k": "Orientation",
      "v": "Decks north to the water; entries south"
     },
     {
      "k": "Level",
      "v": "+96.5 m, provisional until the flood line is surveyed"
     }
    ]
   },
   {
    "id": "commons",
    "title": "Roastery",
    "film": [
     "creek",
     16.8
    ],
    "para": "On the lower terrace a roastery stands behind a mass wall twelve metres long: estate coffee, roasted where it grows, poured at dawn. Beyond it, a wood-fired sauna for eight cantilevers two and a half metres over the lake. The water is the plunge.",
    "meta": [
     "ROASTERY 12.0 × 10.8 M",
     "SAUNA 5.4 × 8.4 M",
     "80 °C UPPER BENCH",
     "OVER THE LAKE"
    ],
    "cards": [
     {
      "k": "The roastery",
      "v": "Behind a 300 mm mass wall, at +96.0"
     },
     {
      "film": [
       "creek",
       7.1
      ],
      "b": "The morning pour",
      "s": "Coffee roasted on the estate, at dawn"
     },
     {
      "k": "The sauna",
      "v": "Wood-fired, eight people, 80 °C at the upper bench"
     },
     {
      "k": "The lake",
      "v": "About 1,672 m², at +92.5"
     }
    ]
   }
  ],
  "materials": [
   [
    "No. 1",
    "River-cast concrete",
    "Cast with the stream's own aggregate.",
    "{ink:sage}"
   ],
   [
    "No. 2",
    "Driftwood oak",
    "Silvered, not stained.",
    "{ink:oat}"
   ],
   [
    "No. 3",
    "Corten",
    "Inland, where the air allows it.",
    "{ink:rust}"
   ],
   [
    "No. 4",
    "Laterite",
    "The red stone of the region.",
    "{ink:ember}"
   ],
   [
    "No. 5",
    "River basalt",
    "Underfoot at the water's edge.",
    "{ink:stone3}"
   ],
   [
    "No. 6",
    "Linen and wool",
    "Undyed linen, iron-grey wool, one indigo or canopy-green note.",
    "{ink:slateGrey}"
   ],
   [
    "No. 7",
    "Canopy green",
    "Grown or woven, never painted.",
    "{ink:canopy}"
   ],
   [
    "No. 8",
    "Lime plaster",
    "No gypsum.",
    "{ink:bone}"
   ],
   [
    "No. 11",
    "EPDM gaskets",
    "Joints that move with the rain. No sealant.",
    "{ink:coal}"
   ]
  ],
  "day": {
   "eyebrow": "The day at Creek",
   "title": "Four movements. <span>One river.</span>",
   "items": [
    [
     "DUSK",
     "The crossing",
     "The one bridge, on foot, on arrival."
    ],
    [
     "DAWN",
     "The morning pour",
     "Estate coffee, roasted on site."
    ],
    [
     "AFTERNOON",
     "The thermal reset",
     "The sauna at 80 °C, then the lake."
    ],
    [
     "MONSOON",
     "The rain sit",
     "Two chairs, angled at thirty degrees."
    ],
    [
     "21:00",
     "The star court",
     "The drying yard, after dark."
    ]
   ],
   "note": "Each ritual is offered once; declining counts as done. Who runs them is not yet appointed. The coracle drift waits on a water-safety review and is not offered here."
  },
  "getting": {
   "title": "A day's <span>drive west.</span>",
   "sub": "Approximate road distances.",
   "cards": [
    [
     "~250 km",
     "BENGALURU",
     "Five to six hours by road."
    ],
    [
     "110 km",
     "MYSURU",
     "The nearest airport, with few flights."
    ],
    [
     "~135 km",
     "MANGALURU",
     "Over a ghat road."
    ]
   ],
   "map": {
    "bounds": [
     12.2,
     75.6,
     12.5,
     76
    ],
    "pts": [
     [
      12.458,
      75.959,
      "Kushalnagara"
     ],
     [
      12.385716,
      75.836097,
      "CREEK",
      1
     ],
     [
      12.390446,
      75.820505,
      "Coffee Fields Forever"
     ]
    ],
    "route": [
     0,
     1
    ]
   }
  },
  "plan": {
   "title": "Five clusters, <span>one bridge.</span>",
   "note": "Schematic, not to scale. Positions follow the planning rules, not a survey, and no flood line is drawn yet.",
   "tabs": [
    {
     "tab": "Site",
     "t": "Site",
     "rows": [
      [
       "Covenant",
       "At least 65% kept as it is"
      ],
      [
       "Clusters",
       "5 × 4 keys"
      ],
      [
       "Crossing",
       "One bridge at +95.6"
      ],
      [
       "Lake",
       "~1,672 m² at +92.5"
      ]
     ],
     "svg": "<rect x=\"20\" y=\"20\" width=\"560\" height=\"380\" fill=\"{ink:ink}\" fill-opacity=\".04\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><path d=\"M20 210C140 180 220 250 320 210S480 170 580 200\" fill=\"none\" stroke=\"{ink:sea}\" stroke-width=\"12\" stroke-opacity=\".45\"/><text x=\"30\" y=\"198\" font-family=\"Space Mono\" font-size=\"11\">STREAM</text><g transform=\"translate(60,60)\"><rect x=\"0\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"0\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><text x=\"0\" y=\"68\" font-family=\"Space Mono\" font-size=\"10\">C1</text></g><g transform=\"translate(170,50)\"><rect x=\"0\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"0\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><text x=\"0\" y=\"68\" font-family=\"Space Mono\" font-size=\"10\">C2</text></g><g transform=\"translate(300,60)\"><rect x=\"0\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"0\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><text x=\"0\" y=\"68\" font-family=\"Space Mono\" font-size=\"10\">C3</text></g><g transform=\"translate(420,55)\"><rect x=\"0\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"0\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"26\" width=\"24\" height=\"20\" fill=\"{ink:canopy}\" fill-opacity=\".45\" stroke=\"{ink:ink}\"/><text x=\"0\" y=\"68\" font-family=\"Space Mono\" font-size=\"10\">C4</text></g><g transform=\"translate(160,245)\"><rect x=\"0\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy2}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><rect x=\"28\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy2}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><rect x=\"56\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy2}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><rect x=\"84\" y=\"0\" width=\"24\" height=\"20\" fill=\"{ink:canopy2}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><text x=\"0\" y=\"36\" font-family=\"Space Mono\" font-size=\"10\">C5 · BANK</text></g><line x1=\"330\" y1=\"150\" x2=\"330\" y2=\"270\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><text x=\"336\" y=\"240\" font-family=\"Space Mono\" font-size=\"10\">BRIDGE</text><rect x=\"400\" y=\"260\" width=\"60\" height=\"50\" fill=\"{ink:ember}\" fill-opacity=\".4\" stroke=\"{ink:ink}\"/><text x=\"402\" y=\"325\" font-family=\"Space Mono\" font-size=\"10\">ROASTERY</text><ellipse cx=\"510\" cy=\"330\" rx=\"55\" ry=\"40\" fill=\"{ink:sea}\" fill-opacity=\".35\" stroke=\"{ink:ink}\"/><text x=\"486\" y=\"334\" font-family=\"Space Mono\" font-size=\"10\">LAKE</text>"
    },
    {
     "tab": "Key · TYPE-G",
     "t": "TYPE-G",
     "rows": [
      [
       "Plate",
       "7.2 × 6.0 m"
      ],
      [
       "Enclosed",
       "465 sq ft · 43.2 m²"
      ],
      [
       "Clear height",
       "3.30 m"
      ],
      [
       "Deck",
       "7.2 × 4.8 m"
      ],
      [
       "Mirror pool",
       "6.0 × 2.4 × 0.3 m"
      ]
     ],
     "svg": "<rect x=\"80\" y=\"60\" width=\"440\" height=\"200\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><rect x=\"80\" y=\"260\" width=\"440\" height=\"110\" fill=\"{ink:canopy}\" fill-opacity=\".12\" stroke=\"{ink:ink}\" stroke-dasharray=\"5 4\"/><rect x=\"120\" y=\"290\" width=\"360\" height=\"50\" fill=\"{ink:sea}\" fill-opacity=\".35\" stroke=\"{ink:ink}\"/><text x=\"130\" y=\"320\" font-family=\"Space Mono\" font-size=\"11\">MIRROR POOL 6.0 × 2.4</text><rect x=\"110\" y=\"90\" width=\"150\" height=\"120\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"120\" y=\"150\" font-family=\"Space Mono\" font-size=\"11\">KING</text><rect x=\"380\" y=\"90\" width=\"110\" height=\"100\" fill=\"none\" stroke=\"{ink:ink}\"/><text x=\"388\" y=\"145\" font-family=\"Space Mono\" font-size=\"11\">BATH</text><text x=\"86\" y=\"52\" font-family=\"Space Mono\" font-size=\"11\">PLATE 7.2 × 6.0 M · 1,200 MM GRID</text>"
    },
    {
     "tab": "Key · TYPE-GL",
     "t": "TYPE-GL",
     "rows": [
      [
       "Plate",
       "7.2 × 6.0 m"
      ],
      [
       "Loft",
       "7.2 × 2.4 m at +3.60 m"
      ],
      [
       "Living",
       "6.0 m clear"
      ],
      [
       "Total",
       "651 sq ft · under review",
       1
      ],
      [
       "Deck",
       "7.2 × 4.8 m"
      ]
     ],
     "svg": "<g font-family=\"Space Mono\" font-size=\"11\"><path d=\"M80 330V110L300 60L520 110V330Z\" fill=\"none\" stroke=\"{ink:ink}\" stroke-width=\"3\"/><rect x=\"80\" y=\"200\" width=\"180\" height=\"10\" fill=\"{ink:canopy}\" fill-opacity=\".6\"/><text x=\"90\" y=\"192\">LOFT +3.60</text><line x1=\"540\" y1=\"110\" x2=\"540\" y2=\"330\" stroke=\"{ink:ink}\"/><text x=\"546\" y=\"220\">6.0 CLEAR</text><line x1=\"40\" y1=\"330\" x2=\"560\" y2=\"330\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><text x=\"90\" y=\"360\">SECTION · SCHEMATIC</text></g>"
    }
   ]
  },
  "details": [
   [
    "House brand",
    "SlowSpace"
   ],
   [
    "Place",
    "Cherala, Sunticoppa, Kushalnagara, Kodagu"
   ],
   [
    "Covenant",
    "At least 65% kept as it is; 66.1% on the deed geometry, to be confirmed by survey"
   ],
   [
    "Key",
    "465 sq ft · loft type 651 sq ft, under review"
   ],
   [
    "Rainfall",
    "2,500–4,000 mm a year · about 90 monsoon days"
   ],
   [
    "Seismic zone",
    "III"
   ],
   [
    "Stage",
    "Specification; nothing built"
   ],
   [
    "Survey",
    "No total station, flood line or bathymetry yet",
    1
   ],
   [
    "Opening",
    "Not ruled",
    1
   ],
   [
    "Operator",
    "Not yet appointed for rituals",
    1
   ],
   [
    "Neighbour",
    "Coffee Fields Forever, 1.8 km, a different estate"
   ]
  ],
  "detailsNote": "",
  "slug": "coorg-coffee-creek",
  "vehicleKey": "coorgcreek"
 },
 "cff": {
  "key": "cff",
  "name": "Coffee Fields",
  "vehicle": "the Coffee Fields Forever LLP, being formed",
  "pal": "cff",
  "hour": 16.5,
  "enquireHour": 17.5,
  "heroLabel": "Drawn film: shade-grown coffee slopes in the afternoon, Kodagu",
  "eyebrow": "Getaway Collective · Suntikoppa, Coorg",
  "credit": "Coffee Fields Forever · an ESKAPE estate · the flagship destination",
  "spec": "20 keys · 3.0 acres of working coffee · 250 km from Bengaluru",
  "intro": "Twenty keys held inside a working coffee plantation at Suntikoppa. The shade-grown canopy is the product: this is the only estate in the collection that farms what it serves.",
  "place": {
   "film": [
    "cff",
    9
   ],
   "title": "Twenty keys. <b>One working plantation.</b>",
   "text": "Coffee Fields Forever sits at Valamudi, near Suntikoppa in Kodagu, on three acres of shade-grown coffee. Two acres are buildable; at least two-thirds of the estate stays as it is. It is a different estate from SlowSpace Creek, 1.8 km away.",
   "coords": "12°23'25.6\"N 75°49'13.8\"E"
  },
  "concept": {
   "title": "Three hamlets. <span>One canopy.</span>",
   "lead": "The keys are gathered into three hamlets under the coffee, around a roastery raised over a working vault, so that the working estate never crosses the floor people live on.",
   "zones": [
    {
     "k": "blossom",
     "name": "Blossom Rise",
     "sub": "hamlet",
     "text": "The upper hamlet, where the canopy opens.",
     "c": "{ink:berry}",
     "vols": [
      {
       "t": "box",
       "x": -240,
       "y": -200,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": -170,
       "y": -200,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": -240,
       "y": -140,
       "dx": 60,
       "dy": 50,
       "dz": 22
      }
     ]
    },
    {
     "k": "mist",
     "name": "Mist Hollow",
     "sub": "hamlet",
     "text": "The low hamlet, where the fog sits longest.",
     "c": "{ink:leaf}",
     "vols": [
      {
       "t": "box",
       "x": -40,
       "y": 40,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": 30,
       "y": 40,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": -40,
       "y": 100,
       "dx": 60,
       "dy": 50,
       "dz": 22
      }
     ]
    },
    {
     "k": "harvest",
     "name": "Harvest Ridge",
     "sub": "hamlet",
     "text": "The ridge hamlet, closest to the picking.",
     "c": "{ink:gold}",
     "vols": [
      {
       "t": "box",
       "x": 140,
       "y": -220,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": 210,
       "y": -220,
       "dx": 60,
       "dy": 50,
       "dz": 22
      },
      {
       "t": "box",
       "x": 140,
       "y": -160,
       "dx": 60,
       "dy": 50,
       "dz": 22
      }
     ]
    },
    {
     "k": "roast",
     "name": "The roastery",
     "sub": "over the vault",
     "text": "A roastery café raised over a subterranean working vault.",
     "c": "{ink:cherry}",
     "vols": [
      {
       "t": "box",
       "x": 60,
       "y": -60,
       "z": 20,
       "dx": 90,
       "dy": 70,
       "dz": 30
      },
      {
       "t": "box",
       "x": 60,
       "y": -60,
       "dx": 90,
       "dy": 70,
       "dz": 20
      }
     ]
    }
   ],
   "labels": [
    [
     30,
     470,
     "HAMLETS UNDER THE CANOPY"
    ],
    [
     470,
     470,
     "ROASTERY OVER THE VAULT"
    ]
   ]
  },
  "chapters": [
   {
    "id": "canopy",
    "title": "The canopy",
    "film": [
     "cff",
     14.5
    ],
    "para": "The coffee grows under shade trees, as it always has here. The keys are placed between the rows, not in place of them, so the plantation keeps working around the people who own a share of it.",
    "meta": [
     "3.0 ACRES",
     "2.0 BUILDABLE",
     "≥ 65% KEPT AS IT IS",
     "SHADE-GROWN"
    ],
    "cards": [
     {
      "k": "The product",
      "v": "The shade-grown coffee canopy"
     },
     {
      "film": [
       "cff",
       6.9
      ],
      "b": "The fog walk",
      "s": "Through the rows at first light"
     },
     {
      "k": "Harvest",
      "v": "November to January"
     },
     {
      "k": "Colour",
      "v": "Roast, {ink:cherry}"
     }
    ]
   },
   {
    "id": "keys",
    "title": "The keys",
    "film": [
     "cff",
     17.4
    ],
    "para": "Twenty keys, each around 450 square feet, arranged in three hamlets and one tree house. Their public names are still being decided, so this page names them by the hamlet they stand in.",
    "meta": [
     "20 KEYS",
     "~450 SQ FT EACH",
     "THREE HAMLETS",
     "ONE TREE HOUSE"
    ],
    "cards": [
     {
      "k": "Blossom Rise",
      "v": "The upper hamlet"
     },
     {
      "k": "Mist Hollow",
      "v": "The low hamlet"
     },
     {
      "k": "Harvest Ridge",
      "v": "Closest to the picking"
     },
     {
      "k": "Areas",
      "v": "11,372 sq ft across the keys; the drawn unit (517 sq ft) is being reconciled"
     }
    ]
   },
   {
    "id": "roastery",
    "title": "Roastery",
    "film": [
     "cff",
     7.5
    ],
    "para": "At the centre, a roastery café stands over a working vault below ground. Coffee is roasted where it is grown, and the work of the estate happens underneath, out of sight.",
    "meta": [
     "ROASTERY CAFÉ",
     "WORKING VAULT BELOW",
     "ESTATE COFFEE"
    ],
    "cards": [
     {
      "film": [
       "cff",
       21
      ],
      "b": "The night pour",
      "s": "Estate coffee after dark"
     },
     {
      "k": "The vault",
      "v": "Operations move below; they never cross the floor above"
     },
     {
      "k": "The first fire",
      "v": "Lit on arrival"
     }
    ]
   }
  ],
  "materials": [
   [
    "Canopy",
    "Shade trees",
    "Kept; the keys stand between the rows.",
    "{ink:shade}"
   ],
   [
    "Crop",
    "Coffee",
    "Picked November to January.",
    "{ink:berry}"
   ],
   [
    "Roast",
    "Estate roast",
    "Roasted on site.",
    "{ink:cherry}"
   ],
   [
    "Ground",
    "Laterite",
    "The red earth of Kodagu.",
    "{ink:ember}"
   ],
   [
    "Light",
    "The framed opening",
    "An opening cut to catch one minute of light, at one moment of the day.",
    "{ink:husk}"
   ],
   [
    "Fire",
    "The first fire",
    "Lit on arrival.",
    "{ink:clay}"
   ]
  ],
  "day": {
   "eyebrow": "The day at Coffee Fields",
   "title": "Five memories, <span>not a schedule.</span>",
   "items": [
    [
     "ARRIVAL",
     "The first fire",
     "Lit as you arrive."
    ],
    [
     "DAWN",
     "The fog walk",
     "Through the rows while the mist is down."
    ],
    [
     "HARVEST",
     "Harvest hands",
     "Picking, November to January."
    ],
    [
     "NIGHT",
     "The night pour",
     "Estate coffee after dark."
    ],
    [
     "ONE MINUTE",
     "The minute of light",
     "Sun through the framed opening, once a day."
    ]
   ],
   "note": "Source: CFF experiences, 09 Aug 2026. No operations plan exists yet; who runs each of these is not appointed."
  },
  "getting": {
   "title": "West, <span>into Kodagu.</span>",
   "sub": "Approximate distances.",
   "cards": [
    [
     "250 km",
     "BENGALURU",
     "By road."
    ],
    [
     "110 km",
     "MYSURU",
     "By road."
    ],
    [
     "~140 km",
     "MANGALURU AIRPORT",
     "About 3.5 to 4 hours."
    ]
   ],
   "map": {
    "bounds": [
     12.2,
     75.6,
     12.5,
     76
    ],
    "pts": [
     [
      12.458,
      75.959,
      "Kushalnagara"
     ],
     [
      12.390446,
      75.820505,
      "COFFEE FIELDS",
      1
     ],
     [
      12.385716,
      75.836097,
      "SlowSpace Creek"
     ]
    ],
    "route": [
     0,
     1
    ]
   }
  },
  "plan": {
   "title": "Three hamlets, <span>one vault.</span>",
   "note": "Schematic, not to scale.",
   "tabs": [
    {
     "tab": "Site",
     "t": "Site",
     "rows": [
      [
       "Land",
       "3.0 acres in possession"
      ],
      [
       "Surveyed extent",
       "2.44 acres"
      ],
      [
       "Buildable",
       "2.0 acres"
      ],
      [
       "Kept as it is",
       "≥ 65%"
      ],
      [
       "Keys",
       "20"
      ]
     ],
     "svg": "<rect x=\"20\" y=\"20\" width=\"560\" height=\"380\" fill=\"{ink:ink}\" fill-opacity=\".04\" stroke=\"{ink:ink}\" stroke-width=\"2\"/><path d=\"M20 50C200 30 380 70 580 45\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 86C200 66 380 106 580 81\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 122C200 102 380 142 580 117\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 158C200 138 380 178 580 153\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 194C200 174 380 214 580 189\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 230C200 210 380 250 580 225\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 266C200 246 380 286 580 261\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 302C200 282 380 322 580 297\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 338C200 318 380 358 580 333\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><path d=\"M20 374C200 354 380 394 580 369\" fill=\"none\" stroke=\"{ink:shade}\" stroke-opacity=\".25\"/><rect x=\"80\" y=\"70\" width=\"90\" height=\"70\" fill=\"{ink:berry}\" fill-opacity=\".4\" stroke=\"{ink:ink}\"/><text x=\"84\" y=\"160\" font-family=\"Space Mono\" font-size=\"10\">BLOSSOM RISE</text><rect x=\"250\" y=\"250\" width=\"90\" height=\"70\" fill=\"{ink:leaf}\" fill-opacity=\".4\" stroke=\"{ink:ink}\"/><text x=\"254\" y=\"340\" font-family=\"Space Mono\" font-size=\"10\">MIST HOLLOW</text><rect x=\"420\" y=\"70\" width=\"90\" height=\"70\" fill=\"{ink:gold}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><text x=\"424\" y=\"160\" font-family=\"Space Mono\" font-size=\"10\">HARVEST RIDGE</text><rect x=\"270\" y=\"140\" width=\"70\" height=\"60\" fill=\"{ink:cherry}\" fill-opacity=\".5\" stroke=\"{ink:ink}\"/><text x=\"274\" y=\"215\" font-family=\"Space Mono\" font-size=\"10\">ROASTERY</text>"
    }
   ]
  },
  "details": [
   [
    "Vehicle",
    "No identifier yet",
    1
   ],
   [
    "House brand",
    "ESKAPE"
   ],
   [
    "Place",
    "Valamudi, Suntikoppa, Kodagu"
   ],
   [
    "Coordinates",
    "<span class=\"mono\">12.390446, 75.820505</span>"
   ],
   [
    "Land",
    "3.0 acres · 2.0 buildable"
   ],
   [
    "Keys",
    "20, about 450 sq ft each"
   ],
   [
    "Key names",
    "Being chosen; until then each key is named by its hamlet",
    1
   ],
   [
    "Stage",
    "Confirmed · in delivery · raising"
   ],
   [
    "Price per unit",
    "Set in the offering letter, once the partnership is formed",
    1
   ],
   [
    "Operations plan",
    "Not yet written; who runs each ritual is still to be appointed",
    1
   ],
   [
    "Neighbour",
    "SlowSpace Creek, 1.8 km, a different estate"
   ]
  ],
  "detailsNote": "",
  "slug": "coffee-fields-forever",
  "vehicleKey": null
 }
};

export const FAQX: Record<string, [string, string, string][]> = {
 "solace": [
  [
   "Can I still invest in Solace?",
   "Not in this offering. Every unit offered in Solace Retreats LLP, the partnership that holds Solace, has been taken, and the estate is being built. Units can change hands only after the lock-in, typically 36 months from financial close, and existing partners see them first. You can still ask Investor Relations to write to you if units are ever offered; asking commits you to nothing. SlowSpace Creek, in Kodagu, is the estate open now.",
   "constants/vehicles.ts · legal.ts G.1–G.3"
  ],
  [
   "When does Solace open?",
   "Solace is under construction. No handover date is published yet, and this page will not guess one: it will be stated once the building programme is fixed. Partners' nights begin at handover, when the estate is complete and handed to the operating partner to open. Until then there is nothing to draw on, and the number of nights shown for an unbuilt estate is zero rather than a promise.",
   "constants/vehicles.ts · legal.ts F.2"
  ]
 ],
 "confluence": [
  [
   "Can I still invest in Confluence?",
   "Not directly: every unit offered in SlowSpace Coastal LLP, the partnership that holds Seaside Confluence, has been taken. You can join the waitlist below. If, after the lock-in, a partner offers units for sale, the waitlist hears first, in the order it was joined. Joining is not an offer and commits you to nothing. Any sale is at a price the buyer and seller agree, and a buyer from outside the partnership needs the partners' consent.",
   "legal.ts G.1–G.3 · public.ts 330–333"
  ],
  [
   "Is the building already approved?",
   "Not yet. Seaside Confluence sits on the coast, where India's Coastal Regulation Zone (CRZ) rules decide how close to the water anything may be built. That line still has to be read from the survey plan, and every position on the drawings waits on it. The drawings are design intent, not yet issued for construction, and nothing is cleared or built until the line that governs it is drawn.",
   "SSC-00-CN-003 §16"
  ]
 ],
 "creek": [
  [
   "How is Creek priced?",
   "{{OFFER}}",
   "constants/vehicles.ts"
  ],
  [
   "Is Creek the same as Coffee Fields Forever?",
   "No. They are two separate estates about 1.8 km apart in Kodagu, each with its own partnership, its own offering and its own house brand: Creek is a SlowSpace estate, and Coffee Fields Forever an ESKAPE estate. Holding units in one gives you no share, no vote and no nights in the other.",
   "properties.yaml"
  ],
  [
   "When does it open?",
   "No opening date has been set, and this page will not guess one. Creek is in pre-construction: nothing is built yet, and the survey that fixes the flood line along the creek is still to come. That line decides where each building may stand. Once it is drawn and the design is fixed, a construction programme and a handover date can be stated. Partners' nights begin at handover.",
   "CN-004 sheet 02 · legal.ts F.2"
  ]
 ],
 "cff": [
  [
   "Can I invest in Coffee Fields Forever now?",
   "Not on this platform yet. Its partnership is still being formed, so there is no offering letter, unit price or holding deposit to show here, and none is estimated. Ask Investor Relations and they will write when it opens; asking commits you to nothing. SlowSpace Creek, a separate estate about 1.8 km away, is open now.",
   "properties.yaml · constants/vehicles.ts"
  ],
  [
   "Is this the same estate as Creek?",
   "No. SlowSpace Creek is a separate estate about 1.8 km away, under a different house brand and held by its own LLP. Coffee Fields Forever will have its own partnership, its own offering letter and its own partners, and a holding in one carries no share, no vote and no nights in the other.",
   "properties.yaml"
  ],
  [
   "Why are the keys not named?",
   "A key is one dwelling at the estate. The public names for Coffee Fields Forever's keys have not been chosen yet, and the working names used in design are not meant for publication. Until the names are chosen, this page refers to each key by the hamlet it sits in, so that nothing printed now has to be withdrawn later.",
   "DECISIONS.md D-07"
  ]
 ]
};
