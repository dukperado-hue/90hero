# v36 build steps — exec'd at the end of build.py after build35.py (shares its globals: s, rep, ROOT, _json, b64jpg...).
import os as _os36

def _mod36(name):
    return open(ROOT + '/modules/' + name, encoding='utf-8').read()

# ===== v36-1: charge (Rockman) + combo, new heroes =====
rep("\nfunction spawnDovesUI(x, y) {", "\n" + _mod36('charge36.js') + "\n" + _mod36('heroes36.js') + "\nfunction spawnDovesUI(x, y) {")
rep("  else if (p.ch === 'ajumma') updAjumma(p, dt, ip);", "  else if (p.ch === 'ajumma') updAjumma(p, dt, ip);\n  else if (H36[p.ch]) H36[p.ch].upd(p, dt, ip);")
rep("'hongbao', 'pob', 'ajumma'].includes(p.ch)) {\n    const r = HUD5[p.ch]", "'hongbao', 'pob', 'ajumma', 'krabi', 'zhanzhao', 'ota'].includes(p.ch)) {\n    const r = HUD5[p.ch]")
rep("srk: 'ARMS', aamir: 'BIKE', furie: 'SLIDE',", "srk: 'ARMS', aamir: 'BIKE', krabi: 'BLADE', zhanzhao: 'GUILLOTINE', ota: 'BEER', furie: 'SLIDE',")
rep("srk: 'introSRK', aamir: 'introAamir', furie: 'introNew5',", "srk: 'introSRK', aamir: 'introAamir', krabi: 'introNew5', zhanzhao: 'introNew5', ota: 'introNew5', furie: 'introNew5',")
rep("    ajumma: 'MOVE A/D  JUMP W/CTRL  UMBRELLA J  KIMCHI K  HORN S+J  AJUMMA RUSH L',",
    "    ajumma: 'MOVE A/D  JUMP W/CTRL  UMBRELLA J  KIMCHI K  HORN S+J  AJUMMA RUSH L',\n"
    "    krabi: 'MOVE A/D  JUMP W/CTRL  LASER J (HOLD = CHARGE)  THROW K  RISING S+J  OVERDRIVE L',\n"
    "    zhanzhao: 'MOVE A/D  JUMP W/CTRL  SWORD J  GUILLOTINE K  SWEEP S+J  AIR J DIVE  3 GUILLOTINES L',\n"
    "    ota: 'MOVE A/D  JUMP W/CTRL  SHOTGUN J  BEER CAN K  BOTH BARRELS S+J  AIR S+J SHOTGUN JUMP  LAST CALL L',")
rep("drawShaolinBall(G.player); drawProjs(); }", "drawShaolinBall(G.player); drawProjs(); drawCharge36(); }")
rep("drawTakesHUD(); drawGuestHUD(); if (G.banner)", "drawTakesHUD(); drawGuestHUD(); drawCombo36(); if (G.banner)")
rep("updCages(dt); updStage7(dt);", "updCages(dt); updStage7(dt); updCombo36(dt); updGuillotines(dt);")
print('v36 heroes + charge/combo wired')

# ===== v36-2: hero art (sprites + posters) =====
import base64 as _b6436, io as _io36
from PIL import Image as _Img36
def _webp36(path, w=None, q=80):
    im = _Img36.open(path).convert('RGB')
    if w and im.width > w: im = im.resize((w, round(im.height * w / im.width)), _Img36.LANCZOS)
    b = _io36.BytesIO(); im.save(b, 'WEBP', quality=q, method=6); return _b6436.b64encode(b.getvalue()).decode()
_k36 = ('krabi', 'zhanzhao', 'ota')
_sm = {k: _json.loads(open(ROOT + '/assets/%s_sprites.json' % k).read()) for k in _k36 if _os36.path.exists(ROOT + '/assets/%s_sprites.png' % k)}
_sp = {k: _b6436.b64encode(open(ROOT + '/assets/%s_sprites.png' % k, 'rb').read()).decode() for k in _sm}
_po = {k: _webp36(ROOT + '/art/poster_%s.jpg' % k, 462) for k in _k36 if _os36.path.exists(ROOT + '/art/poster_%s.jpg' % k)}
for _a, _b in (('/*SPR36_META*/', _json.dumps(_sm)), ('/*SPR36_PNG*/', _json.dumps(_sp)), ('/*POSTER36*/', _json.dumps(_po))):
    assert s.count(_a) == 1, _a; s = s.replace(_a, _b)
print('v36 hero art: sprites', list(_sm), 'posters', list(_po))

# ===== v36-3: new stages 08 (zombie train) + 09 (Taiwan, destructible) + stage 07 extension =====
_arts36 = ''
for _k, _f in [('S8_CHAOS_SRC', 's8_chaos'), ('S8_SCHOOL_SRC', 's8_school'), ('S8_GYM_SRC', 's8_gym'), ('S8_STATION_SRC', 's8_station'), ('S8_RIDE_SRC', 's8_ride'), ('S8_MALL_SRC', 's8_mall'), ('S8_LIBRARY_SRC', 's8_library'), ('S8_CARIN_SRC', 's8_carin'), ('S8_PLATFORM_SRC', 's8_platform'),
               ('S9_XIMEN_SRC', 's9_ximen'), ('S9_CATS_SRC', 's9_cats'), ('S9_YEHLIU_SRC', 's9_yehliu'), ('S9_ALISHAN_SRC', 's9_alishan'),
               ('S7_ELEPHANT_SRC', 's7_elephant'), ('S7_SPIRAL_SRC', 's7_spiral'), ('S7_CAVE_SRC', 's7_cave')]:
    _fp = ROOT + '/art/' + _f + '.jpg'
    if _os36.path.exists(_fp): _arts36 += "const " + _k + " = 'data:image/webp;base64," + _webp36(_fp, 1020, 78) + "';\n"
rep("\nfunction spawnDovesUI(x, y) {", "\n" + _arts36 + _mod36('ladders36.js') + "\n" + _mod36('stage8.js') + "\n" + _mod36('stage9.js') + "\n" + _mod36('stage7x.js') + "\n" + _mod36('stages36.js') + "\nfunction spawnDovesUI(x, y) {")
rep("  else if (STAGE === 7) { LW = S7.W; LH = 22;", "  else if (STAGE === 8) { LW = S8.W; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 1e9, sum: null, row: 18, door: S8.door }); }\n"
    "  else if (STAGE === 9) { LW = S9.W; LH = S9.H; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 1e9, sum: null, row: 18, door: S9.door }); }\n  else if (STAGE === 7) { LW = S7.W; LH = 30;")
rep("  if (STAGE === 7) { return buildStage7(E, set, fill, en, br, cp, hint); }", "  if (STAGE === 7) { return buildStage7(E, set, fill, en, br, cp, hint); }\n  if (STAGE === 8) { return buildStage8(E, set, fill, en, br, cp, hint); }\n  if (STAGE === 9) { return buildStage9(E, set, fill, en, br, cp, hint); }")
rep("  E.flag = { x: (326 + O) * TS, y: 18 * TS };\n  return E;", "  E.flag = { x: (326 + O) * TS, y: 18 * TS };\n  buildStage7X(E, fill0);\n  return E;")
rep("      G.exitOpen = true; G.cam.lock = null; popup(b.x, 9 * TS, 'TUK-TUK HOME. ...MAYBE.', '#ffd23f', true);\n      for (const e of G.enemies) if (!e.dead) { e.hp = 0; killEnemy(e, 1, true); }",
    "      s7xOpen(); G.cam.lock = null; popup(b.x, 9 * TS, 'NOT HOME YET.  THE ELEPHANTS ARE CALLING  >>', '#ffd23f', true);\n      for (const e of G.enemies) if (!e.dead && e.x < 410 * TS) { e.hp = 0; killEnemy(e, 1, true); }")
rep("    if (STAGE === 7 && skin7(LCTX, t, tx, ty, x, y, i)) return;\n", "    if (STAGE === 7 && skin7(LCTX, t, tx, ty, x, y, i)) return;\n    if (STAGE === 8 && skin8(LCTX, t, tx, ty, x, y, i)) return;\n    if (STAGE === 9 && skin9(LCTX, t, tx, ty, x, y, i)) return;\n")
rep("  if (STAGE === 7) drawStage7Mid(cam);\n", "  if (STAGE === 7) drawStage7Mid(cam);\n  if (STAGE === 8) drawStage8Mid(cam);\n  if (STAGE === 9) drawStage9Mid(cam);\n  drawLadders36(cam);\n")
rep("if (STAGE === 7) drawStage7Front();", "if (STAGE === 7) { drawStage7Front(); drawStage7XFront(); } if (STAGE === 8) drawStage8Front(); if (STAGE === 9) drawStage9Front();")
rep("  if (STAGE === 7) return drawStage7BG(cam);\n", "  if (STAGE === 7) { if (drawStage7XBG(cam)) return; return drawStage7BG(cam); }\n  if (STAGE === 8) return drawStage8BG(cam);\n  if (STAGE === 9) return drawStage9BG(cam);\n")
rep("updCages(dt); updStage7(dt); updCombo36(dt); updGuillotines(dt);", "updCages(dt); updStage7(dt); updStage7X(dt); updTrioRockets(dt); updStage8(dt); updStage9(dt); updLockStall36(dt); updCombo36(dt); updGuillotines(dt);")
rep("  if (b.type === 'sweeper') return updSweeper(b, dt);", "  if (b.type === 'sweeper') return updSweeper(b, dt);\n  if (b.type === 'redmass') return updRedMass(b, dt);\n  if (b.type === 'gasking') return updGasKing(b, dt);\n  if (b.type === 'trio') return updTrio(b, dt);")
rep("  if (b.type === 'sweeper') return drawSweeper(b);", "  if (b.type === 'sweeper') return drawSweeper(b);\n  if (b.type === 'redmass') return drawRedMass(b);\n  if (b.type === 'gasking') return drawGasKing(b);\n  if (b.type === 'trio') return drawTrio(b);")
rep("  else if (e.type === 'jiangshi') updJiangshi(e, dt);\n  else if (e.type === 'ghost') { updGhost(e, dt); return; }", "  else if (e.type === 'jiangshi') updJiangshi(e, dt);\n  else if (ZTYPES.has(e.type)) updZomb(e, dt);\n  else if (e.type === 'ghost') { updGhost(e, dt); return; }")
rep("  else if (e.type === 'jiangshi') drawJiangshi(e);\n  else if (e.type === 'ghost') drawGhost(e);", "  else if (e.type === 'jiangshi') drawJiangshi(e);\n  else if (ZTYPES.has(e.type)) drawZomb(e, ph, moving);\n  else if (e.type === 'ghost') drawGhost(e);")
rep("7: 'BANGKOK: UNCLE CAN\\'T GET HOME' };", "7: 'BANGKOK: UNCLE CAN\\'T GET HOME', 8: 'LAST TRAIN OUT: THE DEAD RIDE FREE', 9: 'TAIWAN: UP AND DOWN THE ISLAND' };")
rep("A FLOATING MARKET, WAT ARUN, A SCHOOL ELEPHANT, A TRUCK BARON.', col: '#ffb040' }",
    "A FLOATING MARKET, WAT ARUN, A SCHOOL ELEPHANT, A TRUCK BARON — THEN THE HERD, THE STAIRS AND THE CAVE.', col: '#ffb040' },\n"
    "  { s: 8, x: 396, y: 96, city: 'THE BULLET TRAIN', sub: '부산행? · ZOMBIE EXPRESS', blurb: 'A PLANE FALLS. A SCHOOL. A GYM. A TRAIN. A MALL. THE RED MASS.', col: '#ff3a3a' },\n"
    "  { s: 9, x: 388, y: 150, city: 'TAIWAN', sub: '台灣 · 西門町 → 阿里山', blurb: 'NEON, CATS, MUSHROOM ROCKS, A MOUNTAIN RAILWAY. EVERYTHING BREAKS.', col: '#5affc0' }")
rep("  7: { S: [260, 0], A: [350, 1], B: [480, 4] },", "  7: { S: [420, 0], A: [560, 1], B: [760, 4] },\n  8: { S: [540, 0], A: [720, 1], B: [960, 4] },  // LAST TRAIN OUT (~10 min)\n  9: { S: [360, 0], A: [480, 1], B: [640, 4] },  // TAIWAN")
rep("5: {}, 6: {}, 7: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }", "5: {}, 6: {}, 7: {}, 8: {}, 9: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }")
rep("[1, 2, 3, 4, 5, 6, 7]", "[1, 2, 3, 4, 5, 6, 7, 8, 9]", 6)
rep("8 + i * 15, 10, s === STAGE", "8 + i * 12, 10, s === STAGE")
rep("rx += 20; });", "rx += 16; });")
rep("STAGE = STAGE % 7 + 1;", "STAGE = STAGE % 9 + 1;")
rep("STAGE < 7) STAGE++", "STAGE < 9) STAGE++")
rep("const GROUND_BREAKS = { 1: false, 2: false, 3: false };", "const GROUND_BREAKS = { 1: false, 2: false, 3: false, 9: true };")
print('v36 stages 7X/8/9 wired')

# ===== v36b: Ajumma's rush no longer hides her (the sprite flicker read the rush's tiny i-frames as hit-flicker); her kimchi always draws =====
rep("  if (p.inv > 0 && !p.dead && Math.floor(p.inv * 22) % 2 === 0) return true;",
    "  if (p.inv > 0.12 && !p.dead && Math.floor(p.inv * 22) % 2 === 0) { if (p.ch === 'ajumma' && typeof drawAjummaFx === 'function') drawAjummaFx(p); return true; }")
