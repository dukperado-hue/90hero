# V29 — fixes

All checks below are scripted bot/Playwright runs (`tests/heroes5.js`, `tests/v29.js`), not human playtests.

## 1. Input lost during hit-stop (engine bug, found through the flaky test)
`heroes5` "hongbao K reacts" failed about 1 run in 4. Root cause: `step()` returns early while `G.hitstop > 0`, but the frame loop
cleared the one-shot input table `G.pin` after every step, so a button press that landed inside a 10-140 ms hit-stop freeze was dropped.
A stray hit-stop was pending at the moment of the press in 5 of the 40 per-hero K checks across 8 runs (0.01-0.06 s; source not traced, likely a hurt/hit event in the idle second before the press).
This also affects real play: pressing K or J right after landing a hit could do nothing.
* Fix (`build.py`, v29 section): `const frozen = G.hitstop > 0; step(STEP, G.pin); if (!frozen) G.pin = {};` — the press waits for the first real step (at most the length of the freeze).
* The test also now clears stray damage/hit-stop before the K press so it checks what it says it checks.
* Regression: `tests/v29.js` "K pressed inside a hit-stop freeze still throws the bun" fails on the v28 build (a stays -0.43) and passes now.
* 8 consecutive `heroes5.js` runs with the test fix alone were 24/24 each; the final build (both fixes) was also 8 of 8 at 24/24.

## 2. Control-hint bar after a stunt-double swap (HANDOFF_v26 known issue 5)
The bottom hint bar showed only while `G.time < 14`, so a hero swapped in later got no hints. Now it is keyed to `helpAge()` =
seconds since run start or the last swap (`G.helpT0`, set in `swapHero`). The text itself was already looked up by `p.ch` each frame.
`tests/v29.js` checks: visible at start, expired at 40 s, restarted by `swapHero('furie')`, and a screenshot of the bottom strip differs between fresh and expired.

## Not done
Sura/Drunk-Uncle elbow drop through one-way floors (Stage 4 notes) was investigated by reading only: one-way tiles are not destructible and
`moveBody` lands on them when falling from above, so it is probably the bot holding S (drop-through) while pressing J. Not reproduced, not changed.
