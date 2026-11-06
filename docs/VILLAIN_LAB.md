# Villain Lab (v34) — how a villain goes from idea to game

First subject: the Golden Man (金人, stage 2). Reuse this recipe for the next villains.

1. **Design the rule first** (what makes him hard AND fair). Golden Man: gold armour (5 points). Bullets glance off and wear the armour; fists/blades chip it at 70% damage; a 4+ damage explosion cracks it at once. Cracked = takes full damage for 6 s, then re-gilds to 40%. He ignores most knockback (stun capped at 0.3 s). Pob's entrail pull only works on a cracked one.
2. **Art via Gemini in Chrome**: prompt for a 4x3 sprite sheet on flat green (#00FF00), same character/scale in every cell, feet on one baseline. Screenshot the image shown full-screen, then `src/art/golden/` has the raw sheet; slice with PIL (chroma-key + despill + largest-component cleanup), pack to `atlas_gold.png` + `meta.json`. A second atlas (`atlas_flesh.png`, gold hue-shifted to skin) is faded in as the armour wears away.
3. **Code**: `src/modules/lab34.js` (frames, armour, draw hook on `drawEnemy`, Pob tether). `build.py` embeds the atlases and sets `ESPEC.monk` (12x30, hp 12).
4. **Pob entrails**: K (GUT lash) now hooks the victim, drags it in for 0.85 s, then rips the entrails out (8 dmg, 10 vs heavy), leaves a gut strand on the body. `pobPull()` in lab34.js.
5. **Tests are bot runs, not human playtests**: `tests/lab34.js`.

Not done yet: bullet-proofing numbers are a first guess; other enemy types still use the old code-drawn look.

## Lab #1b — chibi Golden Men, elites, Sweeping Monk (v34b)
- Heroes are big-head chibi, so villains are drawn big-head chibi too (`art/golden/make_atlas.py`, 16 frames incl. `kick`, `jump`, `low`, `taunt`). Crowd monks reuse the same atlas at 0.37 scale.
- Toughness: monk hp 22, armour 8 (elite: hp 34, armour 12). Bullets chip armour (x0.6), melee x0.6 while plated, super-armour while attacking, cracked for 4 s.
- Death: killEnemy wrapper → stagger (`hit`) → airborne `fall` → landing thud (dust, `land`) → `dead` frame. Applies to monk + crowd.
- Elites (`form:'elite'` via `dropIn`): lock #5 after the Hundred; crouch → flying kick (`jwind`/`jkick`).
- Training dummies (`modules/dummy34.js`): harmless `dummy` enemy type, wobble on hit, +ULT per hit, drop pickups.
- Boss 掃地僧 (`modules/sweeper34.js`, `art/sweeper/make_atlas.py`): 3 phases, dust waves, dash, spin, roof-beam run with falling tiles + drop slam. Gemini sheet prompt: describe him generically ("elderly bald temple groundskeeper with a bamboo broom") — naming the novel got the request refused.
