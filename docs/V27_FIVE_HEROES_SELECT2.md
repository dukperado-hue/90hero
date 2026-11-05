# V27 — five new heroes, Hero Select 2.0, look presets

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

## Hero Select 2.0 (`src/modules/select2.js`)
Poster stage (4× hero, move loop, sunburst in hero colour), info panel (stats, move list with pulsing active move, ranks, best time),
18-per-row portrait roster that scrolls by row, origin stripe, NEW badges, 10 country filter chips (F). Overrides `drawSelect/cardRect/cardAt`;
`selInput` (select.js) still does F / R / mouse. Old versions are kept as `drawSelectOld/cardRectOld/cardAtOld`.
New origins: VN, TR, ID (`select.js`).

## Look presets (`look.js`)
V cycles HEROIC (default; head x1.2, legs x1.42, reach x1.42) -> BIG HEADS (v26) -> CLASSIC. Saved in `localStorage.omr_look2`.

## Tests
`tests/heroes5.js` (24 checks: registration, J/K/L per hero, Bey shrug, look cycle, no page errors), `tests/select_sheet.js` (contact sheet of the select panel for every hero).
Regression at this version: progression 34/34, v211 11/11, v23a 6/6, heroes5 24/24.

## Honest balance note
Bot-only. Stage-1 bot clears with the new heroes died 2–3x more often than shaolin/aamir (silat worst), but the bot never holds K (silat's gun),
and rescued stunt doubles randomly swap the hero mid-run, so the numbers are noisy. HERO_POW was nudged up (furie 1.05, bey 1.1, gada 1.0, silat 1.12, hongbao 1.08).
Needs real human playtests before any balance decision.
