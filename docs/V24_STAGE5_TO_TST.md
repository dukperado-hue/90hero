# v24 — Stage 5 extended to Tsim Sha Tsui · boss fix · concept art in use

Date: 2026-11-05 · Build: `/home/claude/v21/build_v21.py` (v24 section at the end) · Module: `stage5.js`

## What the user asked (playtest feedback on v23)
1. Stage 5 finishes in about 2 minutes. The car intro is great, but the shacks look like boxes. They should be solid houses.
2. The boss is bugged: it never appears, then its HP drops and it dies.
3. The concept art is beautiful but doesn't show up in the game.
4. Extend the stage out through a Central street and on to Tsim Sha Tsui. Background extras should pay tribute to *The Killer* (1989). Before the exit, the same car comes back and drives through explosions again.
   - The user confirmed this extends **Stage 5**, not Stage 4.
5. The two HK-horror reference files are kept for **Stage 6, next round** (user's choice). Notes are below.

## Changes

### Boss bug (Stage 5)
- **Cause:** `spawnBoss()` drops the boss at column 213 from y = −70. In v23 the department-store arena sat under the mall's steel roof slab (rows 0–2). The Tycoon landed **on the roof**, outside the arena and off screen.
- **Fix 1:** the arena moved to an open-air plaza at the end of the stage (cols 436–466, no roof).
- **Fix 2:** boss spawn and door are now driven by `ARENA.door`.
- **Safety net:** a boss still in `enter` after 3.5 s, or standing far above the arena floor, is re-dropped into the arena.
- **Test:** the boss lands at the arena floor (row 18), plays its banner and attacks. The exit opens after death; the outro runs and ends in `win`.

### Shanty houses
- Each shack is now a **solid 5×3 block** of brick tiles that steps down with the slope. A per-tile painted skin is drawn over intact tiles only: corrugated tin, stepped roof sheets, a lit window, a door, a laundry line and a TV antenna. Shacks therefore break apart tile by tile, by the car or by bullets.
- Smashed shack tiles leave **no black "ruin" tiles**.
- The car's smash box is now tall enough to take a whole shack.
- Enemies stand on the shack roofs.
- A dense, non-solid village of shacks is drawn behind the hill so it reads as a hillside slum rather than a few boxes.

### Stage 5 layout: 232 → 480 columns
| Cols | Zone | Content |
|---|---|---|
| 0–56 | Shanty hill | Car intro through solid shacks; 2 climbable poles |
| 56–100 | Road | Ambush 1, parked taxis, pole |
| 102–190 | Golden Mall | ~70 glass panes, the big light pole slide, ambush 2; glass doors at both ends |
| 192–302 | **Central 1989** | Tram (roof = platform), hanging neon signs as platforms, ambush 3, chapel, *Killer* extras |
| 302–356 | **Harbour ferry** | Pier planks, green-and-white ferry hull, upper deck + wheelhouse, ambush 4 (3 waves) |
| 356–436 | **Tsim Sha Tsui** | Nathan-Road neon stacks, platforms on signs, heavies, shields |
| 436–466 | Clock-tower plaza | THE TYCOON: "I OWN THIS HARBOUR. AND THE POLICE." |
| 466+ | Exit | Outro car |

- Sky goes from **day (hill) → dusk (Central) → night (harbour/TST)** as the camera moves. The skyline grows taller, windows light up, and harbour reflections appear.
- Rank times for Stage 5 are now S ≤ 330 s, A ≤ 430 s, B ≤ 580 s. The target is about 5–6 minutes of human play.

### Background extras — tribute to *The Killer* (all original names/faces)
These are drawn in world space behind the tiles and are not interactive.
1. **Café standoff:** a man in white and a cop in a tie hold guns to each other's heads across a café table. Every so often a `". . ."` appears.
2. **Balcony hitman:** a white long coat and two pistols, firing at someone we never see (muzzle flashes).
3. **Nightclub singer:** a red dress, bandaged eyes, a microphone, floating ♪.
4. **The chapel:** "ST. TERESA (OF THE DOVES)" with a rose window, an open doorway, a statue with open arms and dozens of flickering candles.
   - The first time the hero passes, **16 doves burst out in slow motion** ("DOVES. OF COURSE.").

### Outro: the same car
- When the hero reaches the exit, the **same car** comes back from the left (`HONK HONK!`). It has a different-coloured door, tape and a cracked windscreen, and it smokes.
- Quips: "SAME CAR. MORE TAPE." / "GET IN. DON'T ASK." / "IT STILL WORKS. MOSTLY."
- The hero jumps in, and the car accelerates right through ~2 s of explosions, with doves and slow motion ("DON'T LOOK BACK."). Then fade → stage clear.
- This applies to every hero on Stage 5. The hero-specific outros (Wah's bride etc.) don't play here.

### Concept art now visible
- **Stage 1:** the Gemini "Kwun Tong back street at sunset" painting is now the main backdrop, with parallax and mirrored tiling. It replaces the procedural factory skyline and machinery layers. The burning set piece and the boss alarm wash still draw over it.
- **Stage 4:** the room back walls are now 50 % transparent and the darkening overlay went from 0.38 to 0.16. The Gemini Walled City facade (neon, the tooth sign, laundry) now shows behind every storey. Before, it was completely hidden by opaque walls.
- **Stage 3:** already used the Mumbai painting (unchanged).
- **Stage 5:** still procedural. The connected Chrome is signed out of Gemini, so no new painting could be made. Prompts for 3 panels (hill / Central / TST night harbour) would match the zones above.

## Tests (automated bot, not human play)
- progression 34/34 · v21.1 11/11 · v23 Bollywood 6/6 · no page errors
- Stage 5 checks:
  - Car intro smashes shacks; no ruin tiles left.
  - Boss lands in the arena and fights; the exit opens.
  - Outro car runs and ends in `win`.
- Stage 5 full bot clears (one run each, game seconds):
  - Gunners: Sombat 163 s, Siu Ma 152 s.
  - Melee: Drunken Uncle 299 s, Aamir 374 s, Wah 618 s, Pai Mei 815 s, Shaolin 902 s.
  - All won, no page errors.
- Bot-found fixes:
  - Platforms that were 5–6 tiles up had no steps; the max jump is ~4 tiles. Added a bus-shelter roof, shop awnings and ferry gangway stairs.
  - Ambush anti-stall now drops stuck enemies onto the hero's own floor instead of the storey above. In the mall this used to loop forever.
- FPS (headless software renderer): Stage 5 zones 52–57, Stage 1 53, Stage 4 53. v23 Stage 4 in the same run was 55.

## Stage 6 — HK horror (kept for next round, from the user's two reference files)
Notes only, nothing built:
- **Setting:** an abandoned temple / roadside inn at night, fog, moonlight, a coffin in the corner, "do not open that room".
- **Enemies:**
  - Hopping Qing-official jiangshi that hunt by **breath**: they find you by your breath, not by sight.
  - A floating white-robed ghost woman with long hair.
  - A corpse-walking procession led by a priest with a bell.
- **Mechanic — hold your breath:** hold a key to stop breathing while a jiangshi sniffs at your face. A breath meter runs out; a gasp means it grabs you. This is the comedy-horror set piece.
- **Tools:** yellow talismans written in red stop a jiangshi when slapped on its forehead. Also sticky rice / blessed rice thrown as a spread shot, a bagua mirror that reflects projectiles, chicken blood and a peach-wood sword.
- **Signature moments:**
  - A ghost with no reflection in the wash basin.
  - A heroine whose hair turns white overnight as a rage mode.
  - A long-tongue / long-silk-sash attack.
  - The bell-and-sign procession "the living step aside".
- **Legal:** use generic folklore elements only; no film character names, likenesses or music.
