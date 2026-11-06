# Villain Lab (v34) — how a villain goes from idea to game

First subject: the Golden Man (金人, stage 2). Reuse this recipe for the next villains.

1. **Design the rule first** (what makes him hard AND fair). Golden Man: gold armour (5 points). Bullets glance off and wear the armour; fists/blades chip it at 70% damage; a 4+ damage explosion cracks it at once. Cracked = takes full damage for 6 s, then re-gilds to 40%. He ignores most knockback (stun capped at 0.3 s). Pob's entrail pull only works on a cracked one.
2. **Art via Gemini in Chrome**: prompt for a 4x3 sprite sheet on flat green (#00FF00), same character/scale in every cell, feet on one baseline. Screenshot the image shown full-screen, then `src/art/golden/` has the raw sheet; slice with PIL (chroma-key + despill + largest-component cleanup), pack to `atlas_gold.png` + `meta.json`. A second atlas (`atlas_flesh.png`, gold hue-shifted to skin) is faded in as the armour wears away.
3. **Code**: `src/modules/lab34.js` (frames, armour, draw hook on `drawEnemy`, Pob tether). `build.py` embeds the atlases and sets `ESPEC.monk` (12x30, hp 12).
4. **Pob entrails**: K (GUT lash) now hooks the victim, drags it in for 0.85 s, then rips the entrails out (8 dmg, 10 vs heavy), leaves a gut strand on the body. `pobPull()` in lab34.js.
5. **Tests are bot runs, not human playtests**: `tests/lab34.js`.

Not done yet: bullet-proofing numbers are a first guess; other enemy types still use the old code-drawn look.
