# v26 — New character look · Stage 5 & 1 art pass · Stunt-double rescue

Date: 2026-11-05 · Build: `build_v21.py` (v26 sections) · Modules: `look.js`, `stage1x.js`, `cages.js`, `stage5.js` (art + hill skin) · Art: `/home/claude/v25art/s5_*.jpg`

## Phase 1 — big heads, long limbs, fake 2.5D (V toggles, saved)
- **Proportions:** the `px/hp/hc` rectangle calls are remapped on the fly. All 31 heroes and the regular enemies change; none were redrawn by hand.
  - Head ×1.4, pivoting at the neck.
  - Legs ×1.28.
  - Anything reaching past the shoulders ×1.35, so punches, kicks and guns read further out.
  - Rectangles are snapped to device pixels so there are no seams.
- **Volume:** a light-from-above gradient and a side shade are applied only where the sprite has pixels. The contact shadow is 1.35× larger.
- **Enemies:** they now get the same dark outline, contact shadow and volume as heroes. They don't get the heroes' warm rim glow, so heroes still stand out. The outline box is tight for performance.
- **Toggle:** V switches between BIG HEADS + 2.5D and CLASSIC (saved in localStorage). Default is BIG.
- **Known limits:** sprites that draw with raw `ctx.fillRect` (bikes, vehicles, the boss bodies) keep classic proportions.

## Phase 2 — stage art
- **Stage 5:** 3 new Gemini paintings (sunny shanty hillside over the harbour / Central at dusk with tram, neon and chapel / TST clock tower at night with the ferry). They cross-fade by zone.
  - The procedural background shacks and facades are hidden when a painting is loaded.
  - The hillside tiles were reskinned as a stone retaining wall with grass and scrub (they used to be a plain brown mass).
- **Stage 1** playfield pass to sit under the Gemini back-street painting:
  - Steel gratings are now fire-escape walkways on scaffold legs, with a railing and a neon shop sign hung under every walkway.
  - Raised steps are now concrete loading docks with a hazard-stripe lip; the street is asphalt with a kerb, manholes and puddles.
  - Foreground: overhead cables with laundry, and dark junk silhouettes along the bottom.

## Phase 3 — RESCUE THE STUNT DOUBLES (Broforce loop)
- Each stage auto-places 5 bamboo cages with a tied-up stunt double inside.
  - Placement: evenly along the stage's progress (bottom-to-top on Stage 4), never inside ambush zones or boss arenas.
- Break a cage by shooting it, hitting it, ramming it or blowing it up. Each rescue gives **+1 TAKE** (a life, max 9).
- **Swap:** by default the double is a random unlocked hero who **takes over on the spot** (banner "STUNT DOUBLE: …"). H toggles "keep my hero" mode, where a rescue only adds a take.
- **Rank** still goes to the hero you picked.
- **TAKES:** shown under the hearts. You start each stage with 5. Out of takes means "THAT'S A WRAP": you go back to the last checkpoint with 3 takes, and cages far from it are restocked.
  - A first version restarted the stage from the top. The Stage 4 bot could never finish that way, so the reset was softened.
- **Arena safety:** a hero who escapes a locked arena over the top of its wall is put back inside. This was found when a swapped-in hero got stuck on top of the Stage 5 exit door.

## Fixes from user feedback mid-round
- **Stage 4 ambush stall:** a melee hero standing below a ceiling could not reach the crew sitting above, so the hatch never reopened.
  - Fix: if any crew member stays on another storey for 4 s, the whole crew drops onto the hero's storey.
- **Uncle Tom-Yum (Muay Thai):** new **UP+J rising elbow (sok klab)**.
  - Hits straight overhead with a small hop and launches enemies.
  - Damages the boss.
  - Cracks breakable tiles above his head.
  - Help bar updated.

## Tests (automated bot, not human play)
- Regression: progression 34/34, v21.1 11/11, v23 6/6, no page errors.
  - The progression test now turns hero swaps off so its rank checks are deterministic.
- **Cages:** 5 placed on each of stages 1–6.
  - A rescue gives +1 take and swaps the hero.
  - Running out of takes leads to a wrap and a reset.
- **Bot clears:**

  | Stage | Hero | Result |
  |---|---|---|
  | 1 | Sombat | 107 s |
  | 1 | Sura | 143 s |
  | 3 | Sombat | 131 s |
  | 3 | Ma Dong | 158 s |
  | 5 | Sombat | 226 s |
  | 5 | Sura | 211 s (after the arena fix) |
  | 6 | Wah | 112 s |
  | 6 | Aamir | 229 s |
  | 4 (climb bot) | Sombat | 272 s |
  | 4 (climb bot) | Tom-Yum | 169 s |

- **Tom-Yum's rising elbow:** hits an enemy directly overhead.
- **FPS** (headless): 58–60 on stages 1, 3, 4, 5 and 6.

## Noted for later (user, 2026-11-05)
New heroes, as parodies (legal review list):
- Veronica Ngo — Furie, The Rebel; "female John Wick".
- Cüneyt Arkın — slow, strong, tough.
- Shaan Shahid — Indian mace.
- Iko Uwais — machine gun plus pencak silat.
- Sammo Hung — nimble fat uncle.
