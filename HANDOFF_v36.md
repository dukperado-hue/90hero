# HANDOFF v36 — NEIGHBORHOOD OF CHAOS — YOUR COOL UNCLE & AUNT
Read `HANDOFF_v35.md` → `HANDOFF_v34.md` first (build system, test hooks, standing rules). Owner speaks Thai — always reply in Thai.
**Not pushed** (no push access in this session) — delivered as a zip.

## Build
`cd src && python3 build.py` → build.py ends with `exec(build35.py)` then `exec(build36.py)`. All v36 work: `src/build36.py` + modules `charge36.js`, `heroes36.js`, `stage8.js`, `stage9.js`, `stage7x.js`, `stages36.js`. Needs Pillow with WebP. Output ~6.9 MB.

## What changed (v35 → v36)
1. **Rockman charge (`charge36.js`).** Hold J → level 1 (0.6 s) / level 2 (1.5 s) with flashing Mega-Buster glow; release fires. Built for every hero but **switched on only for the heroes in `CHARGE36`**: `li` (keeps his own unerring-knife charge; adds glow + "FULL CHARGE"), `lady` (red VENGEANCE CRESCENT), `oldboy` (CORRIDOR QUAKE ground wave), `krabi` (LASER WAVE). Getting hit drops the charge. Add/remove heroes in that table only.
2. **Hit combo counter (`charge36.js`, state `G.hc` — `G.combo` was already the kill-chain used by score).** Hits within 1.6 s chain; up to +25 % damage, +6 ult every 10 hits, free COMBO BURST shockwave at 10/20/30/50/75/100; GOOD / GREAT / AWESOME / INSANE / RIDICULOUS label under the score; taking a hit breaks it.
3. **Three new heroes (`heroes36.js`), parody names, invented looks, Gemini posters + chibi sprite atlases:**
   - `krabi` UNCLE LASER-KRABI (TH): laser krabi slash x3, rising cut, plunge, thrown boomerang blade, charge; L LASER OVERDRIVE (blade x5). Meme: "BATTERY LOW!" flicker. Unlock: stage 8 rank B.
   - `zhanzhao` UNCLE ROYAL-CAT (CN, the red imperial swordsman of the old court-case novels): sword combo, sweep, swallow dive; K pulls a bronze HOUND-HEAD GUILLOTINE from his sleeve (executes weak foes, "開鍘!"); L THREE GUILLOTINES (dragon/tiger/hound on every foe). Unlock: stage 1 rank A.
   - `ota` UNCLE OTA (JP): fat beer-belly shotgunner (own outfit — no maroon jacket). Shotgun with pump, both barrels, shotgun jump, beer-can grenade; stand still → cracks a beer, chugs, crushes and tosses the can (+ult). L LAST CALL. Unlock: stage 8 rank A.
4. **Stage 08 "LAST TRAIN OUT" (`stage8.js`, ~660 tiles, rank S 9 min).** Opening chaos (airliner falls, a car spins into the barrels) → high school (ground floor barricaded, go up the stairs) → gym ambush (khaki ROTC-uniform zombies) → station with **pits full of reaching hands (fall = torn apart, pieces fly up)** → 4-car bullet train (inside or on the roof, gaps are deadly) → mall (fast athlete zombies) → **THE RED MASS**: a giant made of fused bodies, ~half the screen tall, braided body-rope arms (slam with floor warning, low sweep = jump, grab), sheds zombies, steps forward; 380 hp. Zombies: `zomb`/`zrotc`/`zath`, rise out of the ground, horde spawner in the open zones.
5. **Stage 09 "TAIWAN" (`stage9.js`, 440×40 tiles, vertical camera).** The Broforce stage: `GROUND_BREAKS[9] = true` — all dirt and brick breaks. Ximending brick blocks with floors → cat village terraces (touch a cat: +8 ult) → rock cape with mushroom rocks over the sea (falling in = SPLASH) → mountain railway trestles / cypress trunks → **THE GAS KING** on the summit (throws/rolls gas cylinders that blow the terrain apart; shoot them in the air).
6. **Stage 07 extended (`stage7x.js`, now 640 wide, LH 30).** The Truck Baron no longer ends the stage: the wall opens → ELEPHANT VILLAGE (stampede of ally elephants) → SPIRAL STAIRCASE TOWER (one climb, landings full of men) → shaft down into the CAVE → **three bosses back to back**: THE CAPOEIRA SPINNER, THE BONE-BREAKER (grab = 2 hearts), THE WHEELCHAIR DON (mounted gun, rockets, ram, summons). Camera keeps the old framing above ground; only the cave lets it go down.
7. Stage list / map / ranks / saves extended to 9 stages; Tab cycles 1–9.

## Art (all Gemini, captured via Chrome overlay screenshot → `crop.py`)
`src/art/s8_{chaos,school,gym,station,ride,mall}.jpg`, `s9_{ximen,cats,yehliu,alishan}.jpg`, `s7_{elephant,spiral,cave}.jpg`, `poster_{krabi,zhanzhao,ota}.jpg`; sprite atlases `src/assets/{krabi,zhanzhao,ota}_sprites.png/json` (make_sprite_atlas.py; krabi's green blade was keyed out on purpose — the game draws the laser). Prompts used generic descriptions only (no film/character names).

## Tests (bot runs only — nobody has human-playtested v36)
New: `tests/v36.js` 13/13 (heroes, charge only for the listed heroes, combo), `tests/stages36.js` 15/15 (teleport smoke run: zones render, pits kill, bosses spawn/die, exits open, three-boss sequence). Regression clean: heroes5 24/24, v29 6/6, guest35 7/7, coop, score, death34, sweep34, physics, stage7, pob, ajumma — no page errors.
**Not verified:** difficulty/balance of the new stages and bosses (numbers are guesses), whether the 10-minute pacing of stage 8 feels right, cave camera feel, Taiwan digging exploits (steel slabs every 9 columns deep down keep the island from falling away).

## Backlog
Human playtest of 7X/8/9 + new bosses; Taiwan needs more Broforce props (watch-towers, falling chunks of buildings); the Red Mass could get a weak-point; per-hero charge visuals for more heroes if the owner wants to widen `CHARGE36`; earlier backlog from v35 still open.

## v36b (same day, owner feedback round 1) — play link: https://claude.ai/artifact/D98Wmz6rfKymPiDUoCKDmy (artifact slug 62503e8e-61dc-417f-9e4b-4ef411cb2ce0; republish with publish_files + base_version)
- **Ajumma bug fixed:** her L rush sets 0.1 s i-frames every frame; the sprite path read that as hit-flicker and skipped drawing her (and her kimchi). Flicker now needs inv > 0.12, and her FX always draw.
- **Ladders (`ladders36.js`)** for every hero: hold W / UP to climb, S to climb down from the top, CTRL/SPACE jumps off, attacks still work. `addLadder(tx, topRow, bottomRow)`; placed in stage 8 (school, platform, every train car, mall, gym), stage 9 (through every Ximending block to the roof, cat terraces, trestles), stage 7X (stilt houses, tower landings, cave shaft). Stage 5 keeps its poles.
- **Lock stall-breaker (all stages):** if ≤4 enemies are left in a lock and none are on the hero's level for 8 s, they "give up". Zombies now spawn at the hero's floor level (they used to appear on the school wall/roof where you couldn't reach them).
- **Library (tribute to the school-library scene):** the school is now in through the 2nd-floor door → a long run of bookshelves (tops at row 13) with 8 gaps packed with the dead; touch the floor = DRAGGED DOWN. Arms reach higher when you're above them. Ladders up to the 3rd floor as the slower route. New Gemini painting `s8_library.jpg`.
- **Station + train redone:** platform painting (`s8_platform.jpg`, side view with the bullet train), no more stepping-stone pits on the platform; benches/walkway + ladders. Inside the cars: painted carriage interior (`s8_carin.jpg`) with streaks in the windows; gaps between cars show the tracks rushing past.
- No stash rooms on stage 8 (the random brick huts looked out of place).
- Owner is still deciding Metal-Slug-detail vs Broforce-simple art direction — **don't act on it until told.**
