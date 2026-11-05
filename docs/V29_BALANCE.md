# V29 — balance pass for the five v27 heroes (BOT DATA, not human playtests)

**Read this first.** Every number below comes from a scripted bot (`tests/bot.js`) playing Stage 1 from start to the clear screen with
`SWAPMODE = false` (rescued stunt doubles never swap the hero). The bot holds J, taps K every 1.5 s, crouches under bullets, and
nothing else. It is not a person. Death counts are dominated by how the bot stands in front of gunners, not by how a hero feels.
Nobody has playtested these heroes. Do not treat this as a balance decision, only as a sanity check that no hero is wildly off.

## Method
* Harness: `tests/balance.js <html> <runs> <heroes> [holdK=0|1]`, table: `tests/balance_table.py`.
* 20 runs per new hero, 10 per reference hero. Each run is a fresh page load. Runs where the select screen was not reached
  (harness glitch under CPU load, hero stays the default) are redone and never counted (`startRetries` in the harness output).
* New: scripted hold-K pattern for silat (`holdK` option in `bot.js`). The SMG is a held weapon and the old bot never held K, so silat's
  gun was unused. With the pattern the bot holds K whenever a foe stands within 190 px ahead at about the same height (or a boss within 220 px).
* All 20 runs of every hero cleared the stage. "±" is the population standard deviation across runs; with n = 20 the standard error of a
  mean is about sd/4.5 (roughly 0.5 deaths, 6-9 s), so differences below about 1 death or 15 s are noise.

## Before (v28 numbers: HERO_POW furie 1.05, bey 1.1, gada 1.0, silat 1.12, hongbao 1.08)
| hero | deaths (mean ± sd) | median | clear time s (mean ± sd) |
|---|---|---|---|
| furie | 9.70 ± 3.62 | 10.0 | 149.2 ± 35.7 |
| bey | 2.40 ± 0.86 | 2.0 | 102.1 ± 10.8 |
| gada | 11.85 ± 2.15 | 12.0 | 189.6 ± 29.3 |
| silat (bot holds K) | 9.70 ± 2.85 | 10.5 | 144.7 ± 29.1 |
| silat (old bot, never holds K) | 13.45 ± 4.94 | 12.5 | 197.6 ± 54.9 |
| hongbao | 10.05 ± 2.42 | 10.0 | 164.2 ± 27.5 |

## After
HERO_POW (damage multiplier): furie 1.2, bey 1.0, gada 1.2, silat 1.25, hongbao 1.25. Move numbers in `src/modules/heroes5.js`:
gada J 2.8/5 -> 3.2/5.5 damage; silat SMG bullet 0.9 -> 1.0, silat elbow/knee/kick 1.5/2.8 -> 1.8/3.2 and reach +2;
hongbao kick combo 1.6/3 -> 1.9/3.4 and reach +2; furie slide-throw now gives 0.4 s of invulnerability (was about 0.06 s).
| hero | deaths (mean ± sd) | median | clear time s (mean ± sd) |
|---|---|---|---|
| furie | 9.80 ± 2.58 | 10.0 | 152.3 ± 27.0 |
| bey | 2.90 ± 1.34 | 3.0 | 113.0 ± 18.0 |
| gada | 9.50 ± 2.71 | 9.5 | 157.3 ± 33.7 |
| silat (bot holds K) | 7.55 ± 2.04 | 7.5 | 126.3 ± 22.6 |
| silat (old bot, never holds K) | 12.90 ± 3.77 | 12.0 | 192.8 ± 43.5 |
| hongbao | 8.50 ± 2.29 | 9.0 | 141.7 ± 22.2 |

## Reference heroes (same bot, v29 build, 10 runs each)
shaolin 6.40 ± 1.43 deaths / 118.9 s (20 runs), aamir 13.15 ± 3.41 / 182.8 s (20 runs), wah 6.70 / 112.6 s, ma 3.60 / 87.5 s, fei 4.90 / 145.1 s,
sura 7.80 / 161.2 s, siang 8.00 / 129.1 s, singham 11.60 / 175.5 s.
The old heroes already spread from 3.6 to 13 deaths, so "parity" means landing inside that band, not matching shaolin.

## Reading
* gada, silat, hongbao moved by about 1.5-2.5 deaths and 20-30 s toward the middle of the band; silat moved most but a third of its
  change came from the bot now holding K, not from the numbers (compare the two silat rows).
* furie did not move (9.7 -> 9.8, inside noise). The extra damage and slide invulnerability did not matter to the bot, which suggests
  furie's deaths are positional (a pistol hero at medium range that the bot does not kite). No further tuning was attempted on bot data alone.
* bey is the easy outlier (about 3 deaths, similar to ma). Its HERO_POW went 1.1 -> 1.0 with no measurable effect, because the 50% shrug is
  what carries it. Left alone; it needs a human opinion on whether "unbreakable" should be this easy.
* Clear times at or below about 110 s mean the hero kills fast; above 180 s the hero is slow to kill, and gada and hongbao were the slowest before.

## Not verified
Human feel of any change; boss fights beyond what Stage 1 contains; stages 2-6 (not run); stunt-double swaps (SWAPMODE was off for every run).
