# HANDOFF v35 — NEIGHBORHOOD OF CHAOS — YOUR COOL UNCLE & AUNT
Read `HANDOFF_v34.md` first (build system, test hooks, standing rules). This file only lists what changed. Owner speaks Thai — always reply in Thai.

**Not pushed:** this session had no push access to `dukperado-hue/90hero`; v35 was delivered as a zip. Commit it from the owner's machine.

## Build
`cd src && python3 build.py` — build.py now ends with `exec(open(ROOT + '/build35.py').read())`. Put new v35+ steps in `build35.py` (same globals: `s`, `rep`, `ROOT`, `_json`). Needs Pillow with WebP (`python3 -c "from PIL import features; print(features.check('webp'))"`).

## What changed (v34e → v35)
1. **Size 9.76 MB → 5.73 MB.** At build time every embedded JPEG (15 stage paintings) is re-encoded as WebP q80 at the same resolution; the 38 select posters are downscaled to 462 px wide + WebP q80 (the poster loader prefix changed to `data:image/webp`). Source JPGs in `src/art/` are untouched.
2. **GUEST STARS (backlog #1, `modules/guest35.js`).** `pickDouble` now uses a per-stage deck: heroes not yet played this stage come first, never the same hero twice in a row. About 35% of rescues give a *locked* hero as a GUEST STAR (forced by the 4th rescue if none yet). Banner + "★ GUEST STAR" HUD tag + spotlight entrance. A guest never unlocks permanently: on death `respawn` puts you back on the last owned hero ("GUEST STAR WRAPPED"). `G.stats.guests` counts them.
   - **Important:** the default build has `UNLOCK_ALL = true` (playtest mode, every hero unlocked), so guests only appear with `?locks=1` or once the unlock system is switched back on. With everything unlocked, the deck still makes each rescue a fresh hero.
3. **Legal pass.** Real actors' names/nicknames removed from the hero `was`/`cn`/`th` fields (10 heroes); full inventory of what is left in `docs/LEGAL_LIST_V35.md` (UNCLE SOMBAT / UNCLE SORAPONG display names are the owner's own choice — left for them to decide).

## Tests (bot runs only, no human playtest)
New: `tests/guest35.js` 7/7. Regression on the v35 build: heroes5 24/24, v29 6/6, coop / score / death34 / sweep34 / physics / stage7 / pob / ajumma ran clean with no page errors. progression.test.js not re-run (5 min, known bot-limit fails).

## Backlog (unchanged except #1 done)
2. More villains in the lab; stage-7 parts; A4 Meteor Fist. 3. Infernax-style big bosses. 4. Scene proportions; slow-hero balance; name unification; id renames need a save migration (see legal list); human playtests; Wah-on-bike sprite; art for other enemies. Optional next size win: the 38 sprite atlases (PNG) and the HD-tile code.
