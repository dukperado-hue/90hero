# v25 — Mumbai extended (3 new Gemini paintings) · new gunboat · Stage 6 Haunted Hills

Date: 2026-11-05 · Build: `build_v21.py` (v25 sections) · Modules: `stage3x.js`, `stage6.js` · Art: `/home/claude/v25art/`

## User feedback that drove this round
- "The Mumbai stage got stunningly prettier."
- Make 3–4 more images and stretch the stage, and fix the boss.
- The background is great, so fix the midground and foreground objects too.
- Next step: build Stage 6.

## Gemini art (generated in the user's signed-in Chrome, captured at 1456×813, stored as 1280-wide JPEGs)
| File | Use |
|---|---|
| `s3_station.jpg` | Stage 3 — railway terminus at sunset (Gothic arches, local train, station clock, Holi dust) |
| `s3_studio.jpg` | Stage 3 — film studio lot at golden hour (painted flats, gel spotlights, camera crane) |
| `s3_docks.jpg` | Stage 3 — harbour docks at night (cranes, containers, gateway arch, moon) — boss backdrop |
| `s6_forest.jpg` | Stage 6 — moonlit bamboo forest + abandoned temple, fog, ghost lights |
| `s6_inn.jpg` | Stage 6 — haunted inn interior: gallery, coffins with talismans, lanterns, bagua mirror |

**Notes on Gemini:**
- One studio prompt errored twice and was rephrased.
- Twice Gemini answered with text instead of an image. Asking "generate it, don't describe it", or opening a new chat, fixed it.

## Stage 3 — MUMBAI (232 → 432 columns)
- **Zones:** market street (0–148) → **railway terminus** (150–262) → **Studio Lot 7** (262–340) → **night docks** (340+, gunboat).
- **Backdrop:** each zone has its own painting; the next one cross-fades in over 14 columns.
- **Ground fix:** the painting's street is now aligned 3 px under the tile surface. This removes the dark gap band that showed in v22.

### Midground (the playfield got architecture)
- **Market awnings:**
  - Striped cloth with scalloped edges (colour per run), painted straight into the level canvas.
  - Wooden posts down to the street; lamp-lit stall counters with goods and marigold strings.
- **Terminus:**
  - A parked red-and-cream local train whose carriage roofs are the platforms.
  - A footbridge with stairs and a chai-stall roof as a step.
  - An express rushes past behind every 9–14 s ("HOOOONK!", light screen shake).
- **Studio:**
  - Scaffolds with cross-braces carrying painted scenery flats (mountain backdrops).
  - Swinging spotlights with coloured beams.
- **Street skin:**
  - Cobbles with Holi stains in the market.
  - Platform paving with a yellow safety line at the station.
  - Floorboards at the docks.

### Foreground (screen space, in front of everything)
- Bunting strings overhead at 1.35× parallax.
- A dark crowd silhouette along the bottom edge at 1.5×; at the docks it becomes a bollard-and-rope rail.

### Gags
- **SONG BREAK:** entering the studio, everyone on screen dances for 4.5 s in slow motion with Holi bursts, then "CUT! BACK TO THE FIGHT."
  - Uses the existing SRK `makeDance` system.

### Ambushes
- Now 4: market ×2, **terminus** (enemies come off the train), **studio** (3 waves).

### Boss — THE GUNBOAT, redrawn and given a voice
- **Hull:** dark steel with rivets, rust streaks, lit portholes, tyre fenders and a painted name.
- **Superstructure:**
  - A mast with a blinking light.
  - A funnel that smokes.
  - A turret and a **searchlight beam sweeping the pier**.
- **The Don:** in the wheelhouse window (white safari suit, dark glasses, gold chain, pointing).
- **Phase 2:**
  - He calls deck-hands every 10 s ("BOYS! GET HIM!").
  - At 50 % he shouts "YOU KNOW WHO I AM?!"
- **Death:** the boat tilts and sinks ("MERA... BOAT!").
- The foreground shelling boat during the stage uses the same new art.
- **Was it bugged?** The bot found no functional bug (it docks, fights, sinks and the exit opens). The fix is the quality pass.

### Ranks
- Stage 3: S ≤ 210 s, A ≤ 290 s, B ≤ 400 s.

## Stage 6 — HAUNTED HILLS (new, 300 columns)
Folklore elements only; no film names, characters or likenesses.

### Zones
- **Bamboo forest** (fog, stone lanterns, grave mounds, swaying bamboo in front of the painting).
- **The road:** the corpse procession.
- **The inn:** gallery floor, red pillars with lanterns, 6 lacquered coffins.
- **The temple courtyard:** boss.

### Breath mechanic
- **Hold S while standing still to hold your breath.**
- **Effect on jiangshi:** they hunt by breath. While you hold it they lose you ("*SNIFF SNIFF*", then "?").
- **Breath meter:** shown over the hero's head; holding lasts 4 s and refills in 2.2 s. When it runs out: "GASP!!" and every jiangshi nearby charges.

### Enemies
- **Jiangshi:**
  - Hops with arms out; big pounce when close.
  - **Talisman:** every 3rd hit sticks a talisman on its forehead, freezing it for 3.2 s.
- **Ghost lady:**
  - Floats through walls with long hair over her face.
  - Lunges ("WHY... DID YOU... COME...").

### Set pieces
- **Corpse procession:**
  - A priest with a bell and a sign leads six jiangshi across the road.
  - Hold your breath and they hop right past you; breathe near them, or hit one, and they wake ("YOU BREATHED! RUN!").
- **Coffins:**
  - Breaking one releases its tenant ("IT WAS NOT EMPTY." / "OCCUPIED.").
  - The inn ambush has 3 waves.

### Boss — THE GENERAL
- A giant jiangshi in a general's robes, armour and hat.
- **Attacks:**
  - Hop chains with landing shockwaves.
  - A **leap** onto your position (ground marker telegraph). The landing leaves him **dazed** — the window to hit him.
  - "RISE..." summons jiangshi; in phase 2 also a ghost.
- **Breath counter-play:** if you hold your breath while he picks an attack, he sniffs and hops the wrong way.

### Presentation
- Rolling ground fog in front of everything.
- Ghost lights (will-o-wisps).
- A cold vignette.
- Tiles reskinned: mossy stone path, inn floorboards, temple stone, coffin tiles.

### Registration
- Added as a 6th stage: name, world-map node, ranks (S ≤ 240 s, A ≤ 330 s, B ≤ 450 s), save slots, stage cycling and next-stage flow.

## Tests (automated bot, not human play)
- Regression: progression 34/34 · v21.1 11/11 · v23 6/6 · no page errors.
- **Stage 3 bot clears:**

  | Hero | Time |
  |---|---|
  | Sombat | 168 s |
  | Wah | 255 s |
  | Drunken Uncle | 319 s |
  | Pai Mei | 429 s |

  All won. v24 Sombat was 80 s.
- **Stage 6 bot clears:**

  | Hero | Time |
  |---|---|
  | Sombat | 102 s |
  | Drunken Uncle | 223 s |
  | Aamir | 242 s |
  | Shaolin | 364 s |

  All won.
- **Stage 6 mechanic checks (all pass):**
  - The jiangshi loses you while you hold your breath, and hunts again after the gasp.
  - A talisman sticks after 3 hits.
  - A broken coffin releases a jiangshi.
  - The General lands, fights, dies; the exit opens; the stage ends in `win`.
- **FPS** (headless): Stage 3 59.7, Stage 6 60.2, Stage 1 60.1.

## Next (user request received during this round — not built yet)
Character look overhaul:
- **Proportions:** bigger heads (~1.4×) for readability and charm; longer arms and legs so punches read.
- **Fake 2.5D depth:** contact shadows, dark outlines, top light, a ground plane with depth.
- **Process:** prototype on the Ma Dong parody first, with a toggle to compare old vs new before rolling out to all 31 heroes.
- **References the user sent:** Metal Slug, plus two mobile shooters with chunky big-head characters.
