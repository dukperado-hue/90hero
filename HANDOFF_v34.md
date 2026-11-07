# HANDOFF v34 — NEIGHBORHOOD OF CHAOS — YOUR COOL UNCLE & AUNT
Single-file Canvas 2D browser game. Repo: https://github.com/dukperado-hue/90hero · Live: https://dukperado-hue.github.io/90hero/play/ (GitHub Pages lags a few minutes; hard-refresh). Owner speaks Thai — **always reply in Thai**.

## Standing rules from the owner
- Parody names only; no real names/faces (known leftover: the `was:` field of several heroes still holds real names — owner has a "legal list" backlog item). Wah is male. Jump keys: Left Ctrl and W.
- Be honest that all tests are bot runs, never human playtests. Don't claim art was generated if it wasn't. Never type credentials. Ask before downloading files. Don't touch unrelated files.
- Commit + push everything (stop hook). Trailers: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01XC3gM7N3xq2dYs9AeGZvfe`.

## Build
`cd src && python3 build.py` → writes `play/index.html` (~9.7 MB). It patches the frozen `src/base/index_v20_before_v21.html` with counted `rep()` calls (asserts exact match counts) and inlines `src/modules/*.js` before `\nfunction spawnDovesUI(x, y) {` in order. New reps go before the line `open(OUT, 'w').write(s)`. Art atlases are embedded as base64 via placeholders (`/*GOLD_PNG*/`, `/*SWP_PNG*/`…). Reassignable function declarations are wrapped (`step`, `drawEnemy`, `updEnemy`, `damageEnemy`, `killEnemy`, `newGame`, `respawn`…): grep for name collisions first.
Test hooks: `ONE.setChar/startGame/step/teleport/render/G`, `(0,eval)('STAGE=2')`.

## Tests (all bot runs; `node tests/<name>.js play/index.html`)
heroes5 (24/24), v29 (6/6), coop, score, physics, death34, lab34, sweep34 (stage-2 state-machine run), stage7, ajumma, pob, progression.test.js (needs ~5 min; the generic bot cannot beat the stage-2 boss so the test caps boss hp; 2 checks fail because a naive bot dies >3 times in stage 2 and gets rank C — known, bot-limit).
Screenshots/Gemini pipeline need a browser; sandbox has Playwright Chromium.

## What was done this session (v31→v34e)
Secret stashes/popup throttle/diggers; Broforce-style explosions + auto step-up; 2-player local co-op (F2 toggle); score system + end-of-stage tally + PACE card; physics pass (blast launch, structural collapse); merged v34 death animation (death34.js); Villain Lab (docs/VILLAIN_LAB.md): chibi Golden Man (art/golden, 16-frame atlas via Gemini), crackable armour, Pob entrail pull; elites with jump-kick after the Hundred; kung-fu training dummies (modules/dummy34.js, props not enemies); boss 掃地僧 THE SWEEPING MONK (modules/sweeper34.js, art/sweeper, normal human size, 150 hp, 3 phases, roof-beam run, drop slam, 1-heart hits); pyramid stays stacked until every supporting man is down; Singham renamed LION BHAI (+ UP+J upper slap, quote replaced); Tom-Yum (kham) air flying knee (J in the air); sound ON again (the `?sound=1` mute was removed).

## Known issues / unverified
- Nothing here was human-playtested. Boss balance (hp 150, recovery windows, damage 1 heart) is a guess — owner said earlier it was "too strong" then "can't hit it"; now softened.
- Owner reported stage-2 bugs repeatedly (sluggish golden men, pyramid, dummies "counted as enemies, must destroy to pass"). The dummy cause was never reproduced; locks/auto-aim now ignore them. If it recurs ask for hero + position.
- Pace card / rank times for stage 2 retuned to S 180 / A 240 / B 330 s.
- Gemini refuses prompts naming the novel character; describe generically ("elderly bald temple groundskeeper with a bamboo broom"). Pipeline: Chrome tab → gemini.google.com/app → type prompt → blob `<img>` → green overlay → screenshot → PIL slice (`art/*/make_atlas.py`).

## Backlog (owner's asks not yet done)
1. Rescuing a hostage gives a random new hero (H "swapm/cycleSwap" mode).
2. More villains in the lab (soldier, Foreman…); stage-7 sequence parts; A4 Meteor Fist.
3. Infernax-style bigger bosses (owner showed references: big multi-phase spectacle bosses) — currently told "normal size, lots of power".
4. Scene proportions; compress the ~9.7 MB file; slow-hero balance; name unification; legal list of real names; human playtests; Wah-on-bike sprite; art for other enemies.
