# V27 — five new heroes, Hero Select 3.0, look presets

## New heroes (parody names only; the real-person inspirations live ONLY in this doc / the legal list, never in the game)
| key | in-game name | inspiration (legal review list) | kit |
|---|---|---|---|
| `furie` | AUNTIE FURIE | female "gun-fu" assassin (Vietnamese action star) | J pistol (point blank = elbow+shot), S+J headshot, K tactical slide-throw, L NO MERCY (curving bullets) |
| `bey` | UNCLE THUNDER-BEY | Turkish 70s action star | slow (run 150), every 2nd hit bounces off, J heavy fists, K curved sword (reflects bullets), S+J stomp, air J dive, L SAVIOR OF THE WORLD |
| `gada` | MACE-RAJA | Lollywood/Bollywood mace hero | in `BOLLY` set; J mace arcs, S+J ground smash, K boomerang mace, L whirlwind |
| `silat` | AGENT SILAT | Indonesian pencak-silat action star | J elbow-knee-kick, S+J sweep, K (HOLD) SMG 30 rounds, L THE RAID |
| `hongbao` | UNCLE HONG-BAO | HK nimble fat-uncle kung-fu star | fast (run 222), J kick combo, air J drop-kick, S+J belly bump, K steamed bun, L all-you-can-eat roll (+1 heart) |

Code: `src/modules/heroes5.js` (state in `p.n5`, lazily created). Wiring: the `v27` section at the end of `build.py`.
All five need LEGAL_QUESTIONS_FOR_COUNSEL.md entries (living people): names/likeness cues, "(แนวล้อ)" Thai labels.

## Hero Select 3.0 — three-poster select (`src/modules/select3.js`, replaces the earlier select2)
Three side-by-side posters: previous / **selected** / next hero. Each poster is drawn by the game with a country motif behind the hero
(TH prang + lanterns, HK neon + rain, CN moon + mountains + pagoda, IN holi dust + dome + bunting, KR skyline + hanok + petals, JP sun + torii + sakura,
VN lanterns + rice terraces, TR domes + minarets + balloons, ID stepped stupa), the name, Thai name, role, 4 stat bars, and a 4-slot move strip
(J / K / S+J / L, small animated icons, the active slot pulses). Slot labels are parsed from each hero's own move text, with generic fallbacks
(ATTACK / SPECIAL / SKILL / ULTIMATE) in dimmer text; the "bottom moves" are meant to be edited per hero later.
A one-row mini roster across the top, 10 country filter chips (F), R random, V look, TAB stage, mouse click on poster or mini roster.
Old versions remain as `drawSelectOld/cardRectOld/cardAtOld`. New origins: VN, TR, ID (`select.js`).
No AI-generated art is used; all poster art is drawn in code. A Gemini triptych with real names/likenesses must not be used as is.

## Look presets (`look.js`)
V cycles HEROIC (default; head x1.2, legs x1.42, reach x1.42) -> BIG HEADS (v26) -> CLASSIC. Saved in `localStorage.omr_look2`.

## Tests
`tests/heroes5.js` (24 checks: registration, J/K/L per hero, Bey shrug, look cycle, no page errors), `tests/select_sheet.js` (contact sheet of the select panel for every hero).
Regression at this version: progression 34/34, v211 11/11, v23a 6/6, heroes5 24/24.

## Honest balance note
Bot-only. Stage-1 bot clears with the new heroes died 2–3x more often than shaolin/aamir (silat worst), but the bot never holds K (silat's gun),
and rescued stunt doubles randomly swap the hero mid-run, so the numbers are noisy. HERO_POW was nudged up (furie 1.05, bey 1.1, gada 1.0, silat 1.12, hongbao 1.08).
Needs real human playtests before any balance decision.

## v28 — names, hidden Thai labels, Indic scripts
- Every hero name now contains UNCLE or AUNTIE plus a local word people of that country recognise (-JI Hindi, -MAAMA Tamil, MAMA/-GARU Telugu, AJEOSSI Korean, OJISAN Japanese, DAYI Turkish, OM Indonesian, CO-BA Vietnamese). Table: `src/modules/names28.js`. Not yet checked by native speakers or against real names.
- Thai labels are kept as data (`thHidden`) but never drawn. The parody tag after each Thai label is removed everywhere (`build.py` strips it from the output).
- The 8 Indian heroes show their full name in native script on the select poster plus a big ghost word behind the hero: Hindi (Devanagari) for singham/srk/aamir/gada, Tamil for vijay/rajini, Telugu for chiru/ram. Strings: `src/tools/native_names.py`; fonts: Noto Sans Bold subsets in `src/assets/noc-*.woff` (regenerate with `src/tools/make_indic_fonts.py`), embedded as base64.
- Known flaky test: heroes5 "hongbao K reacts" failed 1 of 4 runs (enemy positions vary); progression 34/34, v211 11/11, v23a 6/6.

## v28b — Gemini key art on the select posters
Eight heroes now show Gemini-painted key art (3:4, no text, original characters; prompts in the session, each asks for an empty dark bottom for the UI): vijay, zhang, ram (festival gunner, tai chi master, beast commander) and furie, silat, hongbao, bey, gada. Files: `src/art/poster_<key>.jpg` (616x824, base64-embedded by `build.py` into `names28.js`). Other heroes keep the code-drawn sprite posters until art is generated for them. The art was assembled from full-size screenshots of the Gemini image (not the original download). The Hong-Bao image has garbled pseudo-Chinese neon signs in the background; review before release. Faces and costumes need a legal/visual review for likeness to real people (none noticed by me). Slot labels for the five v27 heroes are hand-written in `SLOT_OVR` in select3.js.

### v28c — Thai heroes (eagle, sombat, sorapong, siang, phiphop, kham, juk)
Gemini key art for the seven Thai heroes. These are homages to the era/archetype only (1970s Thai action-poster look, mask + cape, cowboy gunslinger, one-eyed swordsman, bang fai festival, Uzi + RPG rooftop, muay thai + elephant, comic firecracker uncle) with invented faces. The brief to make them look like specific real people was NOT followed on purpose (likeness/publicity-right risk and the "no real faces" rule); recognition comes from costume, props and setting. 15 of 36 heroes now have painted posters.
