# HANDOFF — NEIGHBORHOOD OF CHAOS (ONE MORE RUN) · v26

**For the next agent picking up this project.** Written 2026-11-05. The owner speaks Thai: **always reply to the user in Thai.**

## 1. What this is
"NEIGHBORHOOD OF CHAOS — YOUR COOL UNCLE & AUNT" is a Broforce-style 2D action platformer that parodies Asian action-movie heroes (Thai, Hong Kong, Chinese, Bollywood, Japanese, Korean). It is a **single-file Canvas 2D browser game**. Everything is inlined into one `index.html` of about 3 MB: code plus base64 JPEG art.

- **Live build (artifact):** https://claude.ai/artifact/VXShsUmw1s3g2oUnKi3U2M
  - Slug `e7000961-38e3-4553-a409-d4af0cccdcfa`.
  - Latest version `1793882474-9ddb2`. Re-read it with `get_artifact` before publishing; republishing needs `base_version`.
- **Project docs:** claude.ai Project "90 Action movie game", folder `ONE_MORE_RUN_RESEARCH/10_Neighborhood_of_Chaos/`. Version notes are V23 → V26 (copies are in `docs/`).

## 2. Package layout
```
play/index.html          ← the built game (open in a browser; this is what is published)
src/build.py             ← the build: patches the v20 base with counted string replacements + inlines modules & art
src/base/index_v20_before_v21.html   ← the frozen base the build starts from (do NOT edit; edit via build.py)
src/modules/*.js         ← feature modules inlined by build.py
src/art/*.jpg            ← Gemini-painted backgrounds (1280 wide), inlined as base64
tests/                   ← Playwright bot tests (Node + playwright + chromium)
docs/                    ← version notes V23–V26 + Stage 4 notes
screens/                 ← contact sheets of recent rounds
```

**Rebuild:** `cd src && python3 build.py` regenerates `play/index.html`. It was verified to reproduce the shipped file byte for byte.

**Build rules:**
- Every `rep(a, b, n=1)` asserts the exact match count. If an anchor string changes, the build fails loudly. That is intentional.
- New work goes in a new `# ===== vNN =====` section at the end of `build.py`, just before `open(OUT…`, or in a new module that one `rep()` inlines.
- Anchor gotcha: a `rep` must target text as it exists *after* the earlier reps in the file.

## 3. Engine essentials
- **Timing and space:** 120 Hz fixed step; logical 480×270; tile `TS = 16`; HD 2× presentation (`S1()`).
- **Level size:** `LW/LH` vary per stage. Stage 4 is vertical (30×222); the others are horizontal, with LW from 232 to 480.
- **`G` is recreated on every newGame/buildLevel.** Per-stage data that must survive lives on module objects (`S4`, `S5`, `S6`, `S3X`, `CG`), not on `G`.
- **Tiles:** `T.E/G/H/S/B/C/P/D/W/R`.
  - Helpers: `tileAt`, `setTile`, `damageTile`, `groundBelow`.
  - Per-stage tile skins hook into `paintTile` through `skin1/skin3/skin5/skin6(...)`.
- **Drawing order (world):**
  1. Stage mid layers: `drawStage1Mid/3Mid/6Mid`, `drawMallInterior`, `drawWalledRooms`.
  2. Tiles.
  3. `drawCages`.
  4. Glass and poles.
  5. Actors.
  6. Screen-space front layers: `drawStage1Front/3Front/6Front`.
  7. HUD and `drawTakesHUD`.
- **Sprites** are drawn from `px()/hp()/hc()` rectangles in a feet-origin local space.
  - The v26 "LOOK" warps these rectangles (`look.js`: head ×1.4, legs ×1.28, reach ×1.35) when `WARP` is set.
  - V toggles the look; it is saved in `localStorage.omr_look`.
- **Hero pattern** (adding a hero touches all of these):
  - Tables: CHARS, CHAR_KEYS, UNCLE_NAMES, UNLOCKS/UNLOCK_ORDER, RUNCFG, QUIPS, HERO_POW, ORIGIN, help line, stats line.
  - Dispatch: update dispatch, drawPlayerRaw dispatch, ult switch, intro mapping + cine case, HUD meter, preview swing list.
  - See `aamir.js` and its `rep`s in `build.py` (the v23 section) as a worked example.
- **Bosses:**
  - Foreman AI, skinned per stage: Landlord on Stage 4, Tycoon on Stage 5.
  - Separate types: `gunboat` (Stage 3) and `general` (Stage 6).
  - Arena geometry is in `ARENA`, which is reassigned per stage in the LW/LH block.

## 4. Stages (6)
| # | Name | Module | Notes |
|---|---|---|---|
| 1 | Kwun Tong back streets | `stage1x.js` (skin/mid/front) | Gemini alley backdrop; Foreman boss |
| 2 | Shaolin 18 Golden Men | base | Flat; no Gemini art yet |
| 3 | Mumbai (432 cols) | `stage3x.js` | Market → terminus → studio (song break) → docks; 4 paintings cross-fade; Gunboat boss with the Don |
| 4 | Kowloon Walled City | `stage4.js` | Vertical, 8 storeys, 4 hatch ambushes, Landlord + Kai Tak jet; needs `tests/s4run.js` (climb bot) |
| 5 | Shanty hill → TST (480 cols) | `stage5.js` | Car intro, glass mall, Central + Killer tribute, ferry, Tycoon, same-car outro; 3 paintings |
| 6 | Haunted Hills | `stage6.js` | Jiangshi (hold S = hold breath), talismans, procession, coffins, the General |

## 5. Systems added recently
- **Gore** (`gore.js`, B cycles 18+/BLOOD/OFF).
- **Hero select** (`select.js`): F filter, R random, slate.
- **Bollywood physics** (`aamir.js`).
- **Rescue the stunt doubles** (`cages.js`):
  - Each stage gets 5 cages; a rescue gives +1 TAKE.
  - By default the rescued double is a random unlocked hero who takes over; H toggles "keep my hero".
  - Rank is recorded to `CHOSEN`, not the swapped hero.
  - Out of takes gives "THAT'S A WRAP": back to the checkpoint with 3 takes.
- **Uncle Tom-Yum (`kham`):** UP+J rising elbow.
- **Stage 4 ambush:** stragglers on another storey drop to the hero after 4 s.

## 6. Testing (bots, not humans — say so honestly to the user)
Setup: `npm i playwright && npx playwright install chromium`. Run from `tests/`, passing the path of `play/index.html`.

| Command | Expectation |
|---|---|
| `node progression.test.js <html>` | 34/34 (save/unlock/rank) |
| `node v211.js <html> /tmp/o` | 11/11 |
| `node v23a.js <html> /tmp/o` | 6/6 |
| `node stage_clear.js <html> <stage> hero1,hero2` | generic bot full clear (stages 1, 2, 3, 5, 6) |
| `node s4run.js <html> <outdir> hero` | Stage 4 climb bot |
| `node perf4.js <html> <stage>` | FPS; about 58–60 headless is normal |

Notes:
- `stc.js` / `look.js` / `cage.js` / `s6t.js` / `s3boss.js` / `kham.js` are screenshot and mechanic checks; read their argv.
- `bot.js` exposes `__T.S(ms)`, `__T.tap(key)` and `__T.bot(ms, opt)`.
- Inside a test, hold a key with `keys.down = true`.

## 7. Art pipeline (Gemini)
- Backgrounds are generated in the user's **signed-in Chrome** (Claude in Chrome), at gemini.google.com.
  - You must never type credentials. If Gemini is signed out, ask the user to sign in.
  - Always ask which connected browser to use (`list_connected_browsers` → AskUserQuestion).
- **Prompt recipe:** "wide 16:9 side-scrolling video game background, detailed 16-bit pixel art, painterly 1990s arcade style … Bottom 15% is a plain dark empty band for the game floor. No people, no readable text."
  - If Gemini answers in text, send "generate it, don't describe it" or open a new chat.
- **Capture:**
  1. Inject a fixed overlay of the newest `<img>` with `naturalWidth > 400` at natural size.
  2. Run the `computer zoom` action with `save_to_disk` on region 0,0,1024,572.
  3. Copy the file from `/tmp/claude-tool-results/...`.
  4. Resize to 1280 wide with PIL and save as JPEG q86 into `src/art/`.
- **Use in code:** add a `const NAME_SRC = data URI` via `b64jpg()` in `build.py`, then draw it like `drawMumbaiArt` / `drawStage5Art`: mirrored tiling, ground line at about 0.81 of the image height, `y = hor + 3 - gf*h`, cross-fade between zones.

## 8. Constraints (from the owner — keep them)
- **Parody names only.** No real names or faces in game. Living-person parodies go on the legal review list (`LEGAL_QUESTIONS_FOR_COUNSEL.md`).
- **Wah Dee** (Andy Lau, *A Moment of Romance*) is a man, a motorcycle hero who can dismount. Never turn him into a female biker.
- **Jump keys:** Left Ctrl and W.
- **Balance goal:** any single hero can beat the game, fairly hard; no hero too strong or too weak.
- **Honesty:**
  - Be honest that tests are bot runs.
  - Don't claim art was generated if it wasn't.
  - Don't modify unrelated files.
- **Memory writes** only under `/projects/01a19601-26e9-7474-b5a5-546ab6d6f377/`.

## 9. Open items / backlog (prioritised)
1. **User feedback on the v26 look:** they may want head size or limb length tuned. The knobs are the `LK.H`, `LK.L` and `LK.A` constants in `look.js`. Bikes, vehicles and bosses still use classic proportions.
2. **New heroes requested (parodies):**
   - Veronica Ngo — *Furie* / *The Rebel*; "female John Wick".
   - Cüneyt Arkın — slow, strong, tough.
   - Shaan Shahid — Indian mace (gada).
   - Iko Uwais — machine gun + pencak silat.
   - Sammo Hung — nimble fat uncle.
3. **Plan phases not yet done:**
   - Stage 2 Gemini art plus a mid/foreground pass.
   - Stage 4 foreground pillars and signs.
   - Per-stage music: HK 80s synth, Bollywood drums, ghost-stage gongs.
   - Heavier punch SFX and short hero voice barks.
4. **Broforce extras proposed:** armoured-vehicle mini-boss, a "?" alert state, a 6-stage run mode with a leaderboard.
5. **Known issues:**
   - Aamir's bike runs off platform edges on Stage 4.
   - Stage 6 is short for gunner heroes (about 100 s).
   - Map nodes 04/05 sit in the sea.
   - The help bar doesn't refresh after a stunt-double swap.
   - Hero swaps make bot clear times random.
6. **Real human playtest** with `08_Playtesting/PLAYTEST_SHEET.md`. Nothing has been human-tested yet.
7. The owner wants to publish on coolunclelab.com under a "90's hero" URL.

## 10. Bot results at handoff (v26)
- Regression: 34/34, 11/11, 6/6.
- **Clears:**

  | Stage | Clear time |
  |---|---|
  | 1 | 107–143 s |
  | 3 | 131–158 s |
  | 4 (climb bot) | 169–272 s |
  | 5 | 211–226 s |
  | 6 | 112–229 s |

- No page errors.
- 58–60 FPS headless.
