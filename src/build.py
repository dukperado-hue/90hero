import os as _os
ROOT = _os.path.dirname(_os.path.abspath(__file__))   # package root = src/
"""v21 = v20 + STAGE 04 (Kowloon Walled City vertical climb + THE LANDLORD boss).
Every edit is an exact, counted replacement so nothing lands in the wrong place."""
import base64
SRC = ROOT + '/base/index_v20_before_v21.html'
OUT = ROOT + '/../play/index.html'
s = open(SRC).read()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, f'{c} matches (want {n}) for: {a[:90]}'
    s = s.replace(a, b)

# --- level dimensions become per-stage
rep('const LW = 232, LH = 22;', 'let LW = 232, LH = 22;                     // STAGE 04 is a tall, narrow tower (see S4)')
rep("function buildLevel() {\n  tiles = new Uint8Array(LW * LH);",
    "function buildLevel() {\n"
    "  if (STAGE === 4) { LW = S4.W; LH = S4.H; Object.assign(ARENA, { x0: 2, x1: S4.W - 2, trigger: 1e9, sum: [6, 23], row: S4.roof }); }\n"
    "  else { LW = 232; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 192, sum: null, row: 18 }); }\n"
    "  tiles = new Uint8Array(LW * LH);")
rep("  if (STAGE === 3) { LOCKS = LOCKS3; return buildStage3(E, set, fill, en, br, cp, hint); }",
    "  if (STAGE === 3) { LOCKS = LOCKS3; return buildStage3(E, set, fill, en, br, cp, hint); }\n"
    "  if (STAGE === 4) { LOCKS = []; stage4LoadArt(); return buildStage4(E, set, fill, en, br, cp, hint); }")
rep("if (!LEVELCV) { LEVELCV = mkCanvas(LW * TS, LH * TS);", "if (!LEVELCV || LEVELCV.width !== LW * TS || LEVELCV.height !== LH * TS) { LEVELCV = mkCanvas(LW * TS, LH * TS);")
# --- stage list, map, ranks, saves
rep("3: 'MUMBAI MARKET STREET' };", "3: 'MUMBAI MARKET STREET', 4: 'KOWLOON WALLED CITY: THE CLIMB' };\nconst FLOORY = () => STAGE === 4 ? S4.G0 * TS : 18 * TS;   // street level of the current stage")
rep("blurb: 'DANCING CROWDS. A GUNBOAT. HOLI DUST.', col: '#ff7ad8' }\n];",
    "blurb: 'DANCING CROWDS. A GUNBOAT. HOLI DUST.', col: '#ff7ad8' },\n"
    "  { s: 4, x: 410, y: 200, city: 'KOWLOON', sub: '九龍城寨 · 1987', blurb: '8 FLOORS, STREET TO ROOF. MIND THE 747.', col: '#9ae8ff' }\n];")
rep("  3: { S: [75, 0], A: [110, 1], B: [180, 4] }    // MUMBAI STREET    (gunboat shelling + boss)",
    "  3: { S: [75, 0], A: [110, 1], B: [180, 4] },   // MUMBAI STREET    (gunboat shelling + boss)\n"
    "  4: { S: [330, 0], A: [420, 1], B: [540, 4] }   // WALLED CITY      (8 storeys, 4 ambushes, the Landlord)")
rep("ranks: { 1: {}, 2: {}, 3: {} }, clears: { 1: 0, 2: 0, 3: 0 }", "ranks: { 1: {}, 2: {}, 3: {}, 4: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0 }")
rep("  for (const s of [1, 2, 3]) {\n    const r = o.ranks", "  for (const s of [1, 2, 3, 4]) {\n    const r = o.ranks")
rep("  for (const s of [1, 2, 3]) {\n    for (const k in b.ranks[s])", "  for (const s of [1, 2, 3, 4]) {\n    for (const k in b.ranks[s])")
rep("if (fresh) for (const k of CHAR_KEYS) for (const s of [1, 2, 3]) {", "if (fresh) for (const k of CHAR_KEYS) for (const s of [1, 2, 3, 4]) {")
rep("if (u.hero) return [1, 2, 3].some(s =>", "if (u.hero) return [1, 2, 3, 4].some(s =>")
rep("[1, 2, 3].forEach((s, i) => { const r = stageBestRank(s); txt('0' + s", "[1, 2, 3, 4].forEach((s, i) => { const r = stageBestRank(s); txt('0' + s")
rep("u.hero ? [1, 2, 3].map(s => PROG.ranks[s][u.hero])", "u.hero ? [1, 2, 3, 4].map(s => PROG.ranks[s][u.hero])")
rep("STAGE = STAGE % 3 + 1;", "STAGE = STAGE % 4 + 1;")
# --- camera: vertical locks + never lose the climber
rep("return { x0: L ? L.x0 : 0, x1: (L ? L.x1 : LW * TS) - VW, y0: 0, y1: LH * TS - VH };",
    "return { x0: L ? L.x0 : 0, x1: (L ? L.x1 : LW * TS) - VW, y0: L && L.y0 != null ? L.y0 : 0, y1: L && L.y1 != null ? L.y1 : LH * TS - VH };")
rep("  if (px < c.x + 40) c.x = Math.max(0, px - 40);",
    "  if (STAGE === 4 && !c.lock) { const py = p.y + p.h / 2; if (py < c.y + 46) c.y = Math.max(0, py - 46); if (py > c.y + VH - 30) c.y = Math.min(LH * TS - VH, py - VH + 30); }\n"
    "  if (px < c.x + 40) c.x = Math.max(0, px - 40);")
# --- triggers: vertical checkpoints, roof exit, stage-4 update
rep("for (const c of G.checkpoints) if (!c.on && p.x > c.x - 4) {", "for (const c of G.checkpoints) if (!c.on && (c.v ? p.onGround && p.y + p.h <= c.y + 1 : p.x > c.x - 4)) {")
rep("for (const o of G.checkpoints) if (o.x < c.x) o.on = true;", "for (const o of G.checkpoints) if (c.v ? o.y > c.y : o.x < c.x) o.on = true;")
rep("updLocks(dt); updGong(dt); updStage3(dt);", "updLocks(dt); updGong(dt); updStage3(dt); updStage4(dt);")
rep("if (G.exitOpen && !G.cine && p.x > G.flag.x - 6) startOutro();", "if (G.exitOpen && !G.cine && p.x > G.flag.x - 6 && (STAGE !== 4 || p.y + p.h <= G.flag.y + 2)) startOutro();")
# --- the boss: Foreman AI, Landlord skin
rep("G.banner = { t: 0, title: 'THE FOREMAN', sub: '工頭  —  \"NOBODY CLOCKS OUT EARLY.\"' };",
    "G.banner = b.title ? { t: 0, title: b.title, sub: b.sub } : { t: 0, title: 'THE FOREMAN', sub: '工頭  —  \"NOBODY CLOCKS OUT EARLY.\"' };")
rep("for (const sx of [191, 214]) { const s = mkEnemy('soldier', sx, 18); s.y = -40;",
    "for (const sx of (ARENA.sum || [191, 214])) { const s = mkEnemy('soldier', sx, ARENA.row || 18); s.y = (ARENA.row || 18) * TS - 18 * TS - 40;")
rep("  G.corpseBoss = { x: b.x, y: b.y, vx: 60, vy: -380, rot: 0, vr: 9, t: 0 };\n  // blow the exit door open",
    "  G.corpseBoss = { x: b.x, y: b.y, vx: 60, vy: -380, rot: 0, vr: 9, t: 0 };\n  if (STAGE === 4) return stage4BossFinal();\n  // blow the exit door open")
rep("  if (S1HD()) drawForemanHD(b, corpse);\n  else {", "  if (STAGE === 4) drawLandlordBody(b, corpse);\n  else if (S1HD()) drawForemanHD(b, corpse);\n  else {")
# --- drawing hooks
rep("function drawBackground(cam) {\n", "function drawBackground(cam) {\n  if (STAGE === 4) return drawWalledBG(cam);\n")
rep("  if (G.mode !== 'title' && G.mode !== 'select') drawHints(cam);\n  drawTiles(cam);",
    "  if (STAGE === 4) drawWalledRooms(cam);\n  if (G.mode !== 'title' && G.mode !== 'select') drawHints(cam);\n  drawTiles(cam);")
rep("if (STAGE === 3) drawStage3Overlay(); if (G.closeups.length)", "if (STAGE === 3) drawStage3Overlay(); if (STAGE === 4) drawJet(); if (G.closeups.length)")
rep("function fxForeground(cam) {\n  if (STAGE === 2) return fxForeground2(cam);", "function fxForeground(cam) {\n  if (STAGE === 2) return fxForeground2(cam);\n  if (STAGE === 4) return;")
rep("    if (h.x > cam.x + VW || h.x + 260 < cam.x) continue;\n    const hd = Math.abs(h.x + 60 - (G.player.x + G.player.w / 2));",
    "    if (h.x > cam.x + VW || h.x + 260 < cam.x) continue;\n    if (STAGE === 4 && (h.y > cam.y + VH || h.y < cam.y - 12)) continue;\n"
    "    const hd = STAGE === 4 ? Math.abs(h.y - G.player.y) * 1.4 : Math.abs(h.x + 60 - (G.player.x + G.player.w / 2));")
# --- hero intros / title camera that assumed the street is row 18
rep("G.introRocket = { x: 1.5 * TS, y: 9 * TS, vx: 140, vy: 40 };", "G.introRocket = { x: 1.5 * TS, y: FLOORY() - 9 * TS, vx: 140, vy: 40 };")
rep("G.jeep = { x: G.cam.x - 70, y: 18 * TS, vx: 420 };", "G.jeep = { x: G.cam.x - 70, y: FLOORY(), vx: 420 };")
rep("G.truck = { x: 9 * TS, y: 18 * TS }; G.horse = { x: 2.5 * TS, y: 18 * TS };", "G.truck = { x: 9 * TS, y: FLOORY() }; G.horse = { x: 2.5 * TS, y: FLOORY() };")
rep("G.sofa = { x: p.x - 110, y: 18 * TS };", "G.sofa = { x: p.x - 110, y: FLOORY() };")
rep("G.cam.x = (G.cam.x + dt * 20) % (40 * TS); G.cam.y = 18 * TS - VH * 0.75;", "G.cam.x = (G.cam.x + dt * 20) % Math.max(1, Math.min(40 * TS, LW * TS - VW)); G.cam.y = FLOORY() - VH * 0.75;")
rep("\nG.cam.y = 18 * TS - VH * 0.75;", "\nG.cam.y = FLOORY() - VH * 0.75;")
# (v21.1) Eagle's intro is left alone on purpose: in stage 04 the helicopter drops him on the roof. The user liked it.
rep("const np = mkPlayer(rx, groundBelow(rx + 5, 0) - PC.standH, CHOSEN);", "const np = mkPlayer(rx, groundBelow(rx + 5, STAGE >= 4 ? G.cp.y - 4 : 0) - PC.standH, CHOSEN);   // stage 04: respawn on the checkpoint's storey, not on the roof")

# ======================= v21.1 =======================
rep("  if (G.cam.lock) rx = clamp(rx, G.cam.lock.x0 + 24, G.cam.lock.x1 - 40);\n", "  if (G.cam.lock) rx = clamp(rx, G.cam.lock.x0 + 24, G.cam.lock.x1 - 40);\n  if (STAGE === 4) { const fr = Math.round((G.cp.y + PC.standH) / TS), c0 = Math.floor(rx / TS); for (let tx = c0 - 1; tx <= c0 + 2; tx++) if (tx > 1 && tx < LW - 2 && !solidAt(tx, fr) && tileAt(tx, fr) !== T.P) setTile(tx, fr, T.P); }   // the floor under the checkpoint got blown away: patch it\n")
rep("if (c.y > 18 * TS - 30) { c.y = 18 * TS - 30;", "if (c.y > (ARENA.row || 18) * TS - 30) { c.y = (ARENA.row || 18) * TS - 30;")
# --- GORE
gore_js = open(ROOT + '/modules/gore.js').read()
rep("function bloodScreen(strength) {", gore_js + "\nfunction bloodScreen(strength) {")
rep("  n = Math.round(n * (BLOOD ? 2 : 0.4));", "  n = Math.round(n * (BLOOD ? (GORE === '18' ? 3 : 2.4) : 0.4));")
rep("  gore(e.x + e.w / 2, e.y + e.h / 2, explosive ? 14 : 6, explosive ? 1.4 : 0.8);\n  hitstop(0.025);",
    "  gore(e.x + e.w / 2, e.y + e.h / 2, explosive ? 14 : 6, explosive ? 1.4 : 0.8);\n  dismember(e, dir, killCause(e, explosive));\n  hitstop(0.025);")
rep("{ damageEnemy(e, 1.5, g.x, false); if (Math.random() < 0.3) popup(e.x + 5, e.y - 6, '*COUGH*', '#7dff5a'); }",
    "{ KILL_CAUSE = 'acid'; damageEnemy(e, 1.5, g.x, false); KILL_CAUSE = null; if (!e.dead && Math.random() < 0.3) popup(e.x + 5, e.y - 6, '*COUGH*', '#7dff5a'); }")
rep("    damageEnemy(e, o.dmg, fx, !!o.launch);\n", "    KILL_CAUSE = BLADE_HEROES.has(p.ch) ? 'blade' : 'melee'; damageEnemy(e, o.dmg, fx, !!o.launch); KILL_CAUSE = null;\n")
rep("function drawEnemy(e) {\n", "function drawEnemy(e) {\n  if (e.gibbed) return;\n  if (e.skel) return drawSkeleton(e);\n")
rep("  if (G.boss && !G.boss.dead) updBoss(G.boss, dt);\n", "  if (G.boss && !G.boss.dead) updBoss(G.boss, dt);\n  updGibs(dt);\n")
rep("  for (const e of G.enemies) if (e.dead && onScreen(e, 30)) drawEnemy(e);", "  for (const e of G.enemies) if (e.dead && onScreen(e, 30)) drawEnemy(e);\n  drawGibs();")
rep("if (ip.blood) { BLOOD = !BLOOD; if (G.player) popup(G.player.x + 5, G.player.y - 20, BLOOD ? 'BLOOD: ON' : 'BLOOD: OFF', '#ff5a5a'); }",
    "if (ip.blood) { const gs = cycleGore(); if (G.player) popup(G.player.x + 5, G.player.y - 20, gs, '#ff5a5a', true); }")
rep("FIVE-POINT PALM L  · B = BLOOD ON/OFF'", "4TH PALM = FIVE-POINT MARK · HOLD J = RISING CRANE  · B = GORE 18+/BLOOD/OFF'")
# --- U.BROW (Pai Mei): hold J = rising crane; the beard flick plants the five-point palm (3 s); bosses under 25% die from it
rep("""      if (hit) { addUlt(p, 4); if (p.combo === 3) popup(cx + p.face * 14, p.y - 6, '*STROKES BEARD*', '#e8e8f0'); }""",
    """      if (hit) { addUlt(p, 4); if (p.combo === 3) popup(cx + p.face * 14, p.y - 6, '*STROKES BEARD*', '#e8e8f0'); }
      if (p.combo === 3) fivePointMark(p);""")
rep("""  if (ip.bomb) {
    if (p.stanceCd <= 0) { p.stanceCd = 2.5; p.stanceT = 0.8;""",
    """  paimeiRise(p, dt);
  if (ip.bomb) {
    if (p.stanceCd <= 0) { p.stanceCd = 2.5; p.stanceT = 0.8;""")
rep("""  const step = Math.floor((2 - e.fpT) / 0.4), prev = Math.floor((2 - was) / 0.4);""",
    """  const step = Math.floor((3 - e.fpT) / 0.6), prev = Math.floor((3 - was) / 0.6);""")
rep("""if (!e.dead) { e.fpT = 2; sparks(""", """if (!e.dead) { e.fpT = 3; sparks(""")
rep("""if (b && !b.dead && b.dying <= 0 && Math.abs(b.x - cx) < 200) b.fpT = 2;""", """if (b && !b.dead && b.dying <= 0 && Math.abs(b.x - cx) < 200) { b.fpT = 3; popup(b.x + b.w / 2, b.y - 20, b.hp <= b.maxHp * 0.25 ? 'FIVE STEPS. THEN NOTHING.' : 'THE HEART IS MARKED', '#ffffff', true); }""")
rep("""damageBoss(22, b.x); bloodScreen(0.6); } }""", """damageBoss(b.hp <= b.maxHp * 0.25 ? b.hp + 999 : 22, b.x); bloodScreen(0.6); } }""")
rep("function fivePointTick(e, dt) {", r"""function fivePointMark(p) {      // the 4th palm: a light touch. three seconds later, the heart.
  const cx = p.x + p.w / 2;
  const e = G.enemies.filter(e => !e.dead && !e.para && !(e.fpT > 0) && Math.sign(e.x + e.w / 2 - cx) === p.face && Math.abs(e.x + e.w / 2 - cx) < 30 && Math.abs(e.y + e.h - (p.y + p.h)) < 24)[0];
  if (e) { e.fpT = 3; sparks(e.x + 5, e.y + 8, 6, 1, '#ffffff'); popup(e.x + 5, e.y - 12, 'FIVE-POINT PALM', '#ffffff'); }
  const b = G.boss;
  if (b && !b.dead && b.dying <= 0 && !(b.fpT > 0) && b.state !== 'enter' && Math.abs(b.x + b.w / 2 - cx) < 40 && Math.abs(b.y + b.h - (p.y + p.h)) < 40) {
    if (b.hp <= b.maxHp * 0.25) { b.fpT = 3; sparks(b.x + b.w / 2, b.y + 10, 10, 1, '#ffffff'); popup(b.x + b.w / 2, b.y - 20, 'FIVE STEPS. THEN NOTHING.', '#ffffff', true); audio.play('ghost'); }
    else if (!(G.fpWarnT > G.time)) { G.fpWarnT = G.time + 2.5; popup(b.x + b.w / 2, b.y - 16, 'HIS HEART IS TOO STRONG — WEAKEN HIM (25%)', '#c8c8d0'); }
  }
}
function paimeiRise(p, dt) {      // hold J: he launches straight up, palms out, taking anyone above with him
  p.riseCd = (p.riseCd || 0) - dt;
  if (held('shoot') && !held('down')) p.holdT = (p.holdT || 0) + dt; else p.holdT = 0;
  if (p.holdT > 0.32 && p.riseCd <= 0 && !p.dead) {
    p.holdT = -99; p.riseCd = 1.1; p.riseT = 0.32; p.vy = -640; p.onGround = false; p.swingT = 0.32; p.swingK = 'palm'; p.riseHit = new Set();
    popup(p.x + 5, p.y - 16, 'RISING CRANE!', '#ffffff'); audio.play('whoosh'); dust(p.x + p.w / 2, p.y + p.h, 6, 6);
  }
  if (p.riseT > 0) {
    p.riseT -= dt; if (p.vy > -380) p.vy = -380;
    const box = { x: p.x - 6, y: p.y - 18, w: p.w + 12, h: p.h + 18 };
    for (const e of G.enemies) if (!e.dead && !p.riseHit.has(e) && overlap(box, e)) { p.riseHit.add(e); damageEnemy(e, 3, p.x + p.w / 2, true); if (!e.dead) { e.vy = -360; e.stun = 0.6; } addUlt(p, 4); sparks(e.x + 5, e.y + 8, 4, 1, '#ffffff'); }
    const b = G.boss; if (b && !b.dead && b.dying <= 0 && !p.riseHit.has(b) && overlap(box, b)) { p.riseHit.add(b); damageBoss(4, p.x); }
    if (Math.random() < dt * 40) part('smoke', p.x + p.w / 2 + rnd(-3, 3), p.y + p.h, 0, 30, 0.3, 2, '#ffffff', { grow: 4, a: 0.5 });
  }
}
function fivePointTick(e, dt) {""")
# --- MAGNUM GOR (Siu Ma): one gun ahead, the other hand finds anyone above or below
rep("""  const tip = gunTip(p);
  const spread = rnd(-12, 12);""", """  const tip = gunTip(p);
  if (p.ch === 'ma' && p.hand === 1 && tip.dy === 0 && maOffhand(p, tip)) return;
  const spread = rnd(-12, 12);""")
rep("function fireTwin(p) {", r"""function maOffhand(p, tip) {
  let best = null, bd = 1e9;
  const cand = G.enemies.filter(e => !e.dead && !e.para && onScreen(e, 0)).map(e => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 }));
  if (G.boss && !G.boss.dead && G.boss.dying <= 0 && onScreen(G.boss, 0)) cand.push({ x: G.boss.x + G.boss.w / 2, y: G.boss.y + G.boss.h / 2 });
  for (const c of cand) { const dx = c.x - tip.x, dy = c.y - tip.y; if (Math.abs(dy) < 22 || Math.abs(dy) < Math.abs(dx) * 0.25) continue; const d = Math.hypot(dx, dy); if (d < 260 && d < bd) { bd = d; best = { dx: dx / d, dy: dy / d }; } }
  if (!best) return false;
  const ox = p.x + p.w / 2 - p.face * 2, oy = tip.y - 2;
  G.bullets.push({ x: ox, y: oy, vx: best.dx * PC.bulletV, vy: best.dy * PC.bulletV, life: 0.55 });
  G.muzzles.push({ x: ox + best.dx * 6, y: oy + best.dy * 6, dx: Math.round(best.dx), dy: Math.round(best.dy), t: 0.05 });
  light(ox, oy, 24, 0.05, '255,220,140'); p.offAim = { dx: best.dx, dy: best.dy, t: 0.12 };
  return true;
}
function fireTwin(p) {""")
rep("'HOLD J = DUAL FIRE  ·  ↑ AIM UP', 'IN THE AIR HE SHOOTS BOTH WAYS'", "'HOLD J = DUAL FIRE: ONE GUN AHEAD, THE OTHER AUTO-AIMS UP/DOWN', 'IN THE AIR HE SHOOTS BOTH WAYS'")


# ======================= v22: graphics for stages 3-4 =======================
rep("const S1 = () => STAGE === 1 || STAGE === 2;            // stages that use the HD presentation layer",
    "const S1 = () => true;                                   // v22: every stage uses the HD presentation layer (2x canvas, HD tiles, lighting, embers)")
rep("if (!LCHUNKS) { LCHUNKS = [];", "if (!LCHUNKS || LCHUNKS.lh !== LH || LCHUNKS.length !== Math.ceil(LW / LCW)) { LCHUNKS = []; LCHUNKS.lh = LH;")
rep("function fxForeground(cam) {\n  if (STAGE === 2) return fxForeground2(cam);\n  if (STAGE === 4) return;", "function fxForeground(cam) {\n  if (STAGE === 2) return fxForeground2(cam);\n  if (STAGE >= 3) return;")
rep("leaf: true, c: ['#d84a1e', '#e8802a', '#c8301a', '#f0b040'][(FXR() * 4) | 0] }); }",
    "leaf: true, c: ['#d84a1e', '#e8802a', '#c8301a', '#f0b040'][(FXR() * 4) | 0] }); }\n  else if (STAGE === 3) { if (A.length < 30 && FXR() < dt * 10) A.push({ x: fr(-20, VW), y: -4, vx: fr(-10, 18), vy: fr(8, 20), ph: fr(0, 6), t: fr(8, 14), leaf: true, c: HOLI[(FXR() * 5) | 0] }); }\n  else if (STAGE === 4) { if (A.length < 22 && FXR() < dt * 7) A.push({ x: fr(0, VW), y: -4, vx: fr(-3, 3), vy: fr(40, 70), ph: fr(0, 6), t: fr(4, 7), leaf: true, c: FXR() < 0.7 ? '#8ab0c8' : '#c8d8e0' }); }")


# --- v22: Gemini backdrops at HD resolution (stage 03 Mumbai street, stage 04 full-res Walled City)
s3bg = 'data:image/jpeg;base64,' + base64.b64encode(open(ROOT + '/art/stage3_mumbai.jpg', 'rb').read()).decode()
rep("function drawMumbaiBG(cam) {", "const S3_BG_SRC = '" + s3bg + "';\nlet S3BG = null; (() => { const im = new Image(); im.onload = () => { S3BG = im; }; im.src = S3_BG_SRC; })();\nfunction drawMumbaiBG(cam) {")
rep("""  const hor = 18 * TS - cam.y;
  ctx.fillStyle = 'rgba(255,230,160,0.9)'; ctx.beginPath(); ctx.arc(VW * 0.3, hor - 120, 26, 0, 6.283); ctx.fill();""",
"""  const hor = 18 * TS - cam.y;
  if (S3BG) {                     // v22: the Gemini-painted market street (mirrored tiles so the seam never shows)
    const h = VH + 12, w = Math.round(S3BG.width * h / S3BG.height), y = Math.round(hor - 14 - 0.847 * h), off = cam.x * 0.22, i0 = Math.floor(off / w);
    const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(S3BG, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(S3BG, x, y, w, h); }
    ctx.imageSmoothingEnabled = pv; ctx.fillStyle = 'rgba(30,8,30,0.18)'; ctx.fillRect(0, 0, VW, VH);
  } else {
  ctx.fillStyle = 'rgba(255,230,160,0.9)'; ctx.beginPath(); ctx.arc(VW * 0.3, hor - 120, 26, 0, 6.283); ctx.fill();""")
rep("""    for (let f = 0; f < 6; f++) { ctx.fillStyle = HOLI[(f + idx) % 5 < 0 ? 0 : (f + idx) % 5]; ctx.fillRect(x + f * 13, b - 92, 8, 5); }   // bunting
  }
""", """    for (let f = 0; f < 6; f++) { ctx.fillStyle = HOLI[(f + idx) % 5 < 0 ? 0 : (f + idx) % 5]; ctx.fillRect(x + f * 13, b - 92, 8, 5); }   // bunting
  }
  }
""")


# ======================= v22: hero select =======================
sel_js = open(ROOT + '/modules/select.js').read()
rep("function spawnDovesUI(x, y) {", sel_js + "\nfunction spawnDovesUI(x, y) {")
rep("Tab: 'stage', KeyB: 'blood',", "Tab: 'stage', KeyB: 'blood', KeyF: 'filter',")
rep("""      const n = CHAR_KEYS.length;
      if (ip.left) { G.sel = (G.sel + n - 1) % n; audio.play('bounce'); }
      if (ip.right) { G.sel = (G.sel + 1) % n; audio.play('bounce'); }
      if (ip.down) { G.sel = G.sel + CARD.cols < n ? G.sel + CARD.cols : G.sel % CARD.cols; audio.play('bounce'); }
      if (ip.up) { if (G.sel - CARD.cols >= 0) G.sel -= CARD.cols; else { let j = G.sel; while (j + CARD.cols < n) j += CARD.cols; G.sel = j; } audio.play('bounce'); }""",
"""      const n = CHAR_KEYS.length, sr = selInput(ip, dt);
      if (sr === true) { startGame(); }
      else if (sr === null) {
      if (ip.left) { selStep(-1, 1); audio.play('bounce'); }
      if (ip.right) { selStep(1, 1); audio.play('bounce'); }
      if (ip.down) { selStep(1, CARD.cols); audio.play('bounce'); }
      if (ip.up) { selStep(-1, CARD.cols); audio.play('bounce'); }""")
rep("""      if (go) { CHOSEN = CHAR_KEYS[G.sel]; PROG.fresh = PROG.fresh.filter(c => c !== CHOSEN); saveProg(); audio.play('check'); startGame(); }
    }""", """      if (go) { CHOSEN = CHAR_KEYS[G.sel]; PROG.fresh = PROG.fresh.filter(c => c !== CHOSEN); saveProg(); audio.play('check'); G.slate = { t: 0 }; }
      }
    }""")
rep("if (G.winT > 0.9 && (ip.start || ip.jump)) { if (ip.start && STAGE < 3) STAGE++; startGame(); }", "if (G.winT > 0.9 && (ip.start || ip.jump)) { if (ip.start && STAGE < 4) STAGE++; startGame(); }")
rep("txt('เลือกตัวละคร   ←→↑↓ / 1-9, 0, -, =, BKSP   ·   ENTER / W / CTRL / CLICK = GO', VW / 2, 23, '#ffe9b8', 8, 'center');",
    "txt('เลือกตัวละคร  ←→↑↓ / MOUSE  ·  F = FILTER BY COUNTRY  ·  R = RANDOM  ·  ENTER / CLICK = ACTION!', VW / 2, 23, '#ffe9b8', 8, 'center');")
rep("""    if (!locked && PROG.fresh.includes(k) && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = '#ff2a4a'; ctx.fillRect(x + CARD.w - 23, y + 2, 21, 9); txt('NEW', x + CARD.w - 12, y + 3, '#fff', 7, 'center', false); }
  });""", """    if (!locked && PROG.fresh.includes(k) && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = '#ff2a4a'; ctx.fillRect(x + CARD.w - 23, y + 2, 21, 9); txt('NEW', x + CARD.w - 12, y + 3, '#fff', 7, 'center', false); }
    drawOriginTag(k, x + 2, y + 2);
    if (!selMatch(k)) { ctx.fillStyle = 'rgba(4,0,8,0.78)'; ctx.fillRect(x, y, CARD.w, CARD.h); }
    if (on && G.randPick > 0) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.strokeRect(x - 2 + 0.5, y - 2 + 0.5, CARD.w + 3, CARD.h + 3); }
  });""")
# panel: swap the old block for drawSelectPanel
a = s.index("  const k = CHAR_KEYS[G.sel], C = CHARS[k], y = CARD.y + CARD_ROWS() * (CARD.h + 4) + 1;")
b = s.index("  if (G.uiDoves) for (const d of G.uiDoves)", a)
s = s[:a] + "  const k = CHAR_KEYS[G.sel], C = CHARS[k], y = CARD.y + CARD_ROWS() * (CARD.h + 4) + 1;\n  drawSelectPanel(k, y);\n" + s[b:]
rep("""  txt('STAGE 0' + STAGE + ': ' + STAGE_NAMES[STAGE] + '  (TAB · ESC = MAP)', 10, VH - 11, '#ffd23f', 8, 'left');""",
    """  txt('STAGE 0' + STAGE + ': ' + STAGE_NAMES[STAGE] + '  (TAB · ESC = MAP)' + (G.selF && G.selF !== 'ALL' ? '   ·   FILTER: ' + ORIGIN_NAME[G.selF] : ''), 10, VH - 11, '#ffd23f', 8, 'left');""")

rep("""(sbt != null && sbt !== bt ? '  (STAGE ' + fmtTime(sbt) + ')' : ''), VW - 10, VH - 11, '#7dff8a', 8, 'right');\n}""", """(sbt != null && sbt !== bt ? '  (STAGE ' + fmtTime(sbt) + ')' : ''), VW - 10, VH - 11, '#7dff8a', 8, 'right');\n  drawSlate();\n}""")
rep("[1, 2, 3, 4].forEach((s, i) => { const r = stageBestRank(s); txt('0' + s + ':' + (r || '-'), 8 + i * 34, 9, s === STAGE ? '#ffffff' : '#a89888', 8, 'left'); });",
    "[1, 2, 3, 4].forEach((s, i) => { const r = stageBestRank(s); txt('0' + s + ':' + (r || '-'), 8 + i * 25, 10, s === STAGE ? '#ffffff' : '#a89888', 7, 'left'); });")

# ======================= v23: CHACHA PERFECT (young-Aamir parody) + Bollywood physics =======================
aamir_js = open(ROOT + '/modules/aamir.js').read()
rep("function slapLaunch(e, dir, power) {", aamir_js + "\nfunction slapLaunch(e, dir, power) {")
rep("  madong: { name: 'FIST HYUNG',", """  aamir: { name: 'PERFECT BHAI', was: 'AAMIR (YOUNG)', cn: 'MR. PERFECTIONIST', th: 'อาเมียร์ (แนวล้อ)', tag: 'THE STREET BOXER', col: '#4aa0ff',
    lines: ['ROLE: BRAWLER / MOBILITY   ·   DIFFICULTY ★★☆', 'J  JAB-JAB-HOOK (THE HOOK SENDS THEM THROUGH THE WALL)', 'K  RACING BICYCLE: RAM THROUGH THEM (JUMP = BUNNY HOP)  ·  S+J  HAYMAKER', 'L  THE TRAIN DARE: RUN AT THE EXPRESS, JUMP AT THE LAST SECOND'],
    stats: [['SPEED', 5], ['POWER', 3], ['RANGE', 2], ['SAFETY', 3]] },
  madong: { name: 'FIST HYUNG',""")
rep("'ichi', 'ogami', 'juk'];", "'ichi', 'ogami', 'juk', 'aamir'];")
rep("srk: ['CHACHA KING', 'C.KING'],", "srk: ['CHACHA KING', 'C.KING'], aamir: ['CHACHA PERFECT', 'C.PERFECT'],")
rep("  srk: { stage: 2, rank: 'A' },", "  srk: { stage: 2, rank: 'A' },\n  aamir: { stage: 4, rank: 'B' },")
rep("const UNLOCK_ORDER = ['ma',", "const UNLOCK_ORDER = ['aamir', 'ma',")
rep("const RUNCFG = { juk: { run: 188, jump: 430 },", "const RUNCFG = { aamir: { run: 218, jump: 470 }, juk: { run: 188, jump: 430 },")
rep("  else if (p.ch === 'srk') updSRK(p, dt, ip);", "  else if (p.ch === 'srk') updSRK(p, dt, ip);\n  else if (p.ch === 'aamir') updAamir(p, dt, ip);")
rep("function drawPlayerRaw(p) { if (p.ch === 'juk') return drawJuk(p);", "function drawPlayerRaw(p) { if (p.ch === 'aamir') return drawAamir(p); if (p.ch === 'juk') return drawJuk(p);")
rep("  } else if (p.ch === 'srk') {\n    p.numberT = 4;", "  } else if (p.ch === 'aamir') {\n    startTrain(p);\n  } else if (p.ch === 'srk') {\n    p.numberT = 4;")
rep("  srk: ['ARMS WIDE OPEN!', 'DANCE WITH ME.', 'ROMANCE KILLS.'],", "  srk: ['ARMS WIDE OPEN!', 'DANCE WITH ME.', 'ROMANCE KILLS.'], aamir: ['JO JEETA WOHI SIKANDAR!', 'ONE MORE ROUND, SIR.', 'PERFECT.'],")
rep("const HERO_POW = { ", "const HERO_POW = { aamir: 0.95, ")
rep("srk: 'introSRK',", "srk: 'introSRK', aamir: 'introAamir',")
rep("    case 'introSingham':", """    case 'introAamir':
      p.vx = 0;
      if (c.t < 0.05) { p.bikeT = 0.9; p.bikeHit = new Set(); }
      if (c.t < 0.7) { p.bikeT = 0.9; p.x = G.cp.x - 90 + c.t * 130; if (Math.random() < 0.4) dust(p.x + p.w / 2 - 6, p.y + p.h, 1, 4); }
      if (at(0.7)) { audio.play('skid'); dust(p.x + p.w / 2, p.y + p.h, 8, 8); }
      if (at(0.9)) { p.bikeT = 0; p.swingT = 0.4; p.swingK = 'hook'; popup(p.x + 5, p.y - 16, '"JO JEETA WOHI SIKANDAR!"', '#4aa0ff', true); }
      if (c.t > 1.6) { p.bikeT = 0; G.cine = null; }
      break;
    case 'introSingham':""")
rep("else if (['srk', 'rajini', 'madong', 'oldboy', 'kham', 'paimei', 'lady', 'ichi', 'ogami'].includes(p.ch)) {\n    const r = ", "else if (['srk', 'rajini', 'madong', 'oldboy', 'kham', 'paimei', 'lady', 'ichi', 'ogami', 'aamir'].includes(p.ch)) {\n    const r = p.ch === 'aamir' ? clamp(1 - (p.bikeCd || 0) / 3.2, 0, 1) : ")
rep("srk: 'ARMS', rajini: 'SHADES',", "srk: 'ARMS', aamir: 'BIKE', rajini: 'SHADES',")
rep("    srk: 'MOVE A/D  JUMP W/CTRL  DANCE J  ARMS WIDE OPEN K  ROSE S+J  DANCE NUMBER L',", "    srk: 'MOVE A/D  JUMP W/CTRL  DANCE J  ARMS WIDE OPEN K  ROSE S+J  DANCE NUMBER L',\n    aamir: 'MOVE A/D  JUMP W/CTRL  JAB-JAB-HOOK J  BICYCLE K  HAYMAKER S+J  TRAIN DARE L',")
rep("    srk: [['HITS LANDED', String(s.melee)], ['DANCE NUMBERS', String(s.ults)]],", "    srk: [['HITS LANDED', String(s.melee)], ['DANCE NUMBERS', String(s.ults)]],\n    aamir: [['HITS LANDED', String(s.melee)], ['TRAINS DARED', String(s.ults)]],")
rep("q.swingT = act && ['fei',", "q.swingT = act && ['aamir', 'fei',")
rep("srk: 'IN', rajini: 'IN',", "srk: 'IN', aamir: 'IN', rajini: 'IN',")
rep("const CARD = { x0: 3, w: 44, gap: 3, y: 34, h: 44, cols: 10 };", "const CARD = { x0: 3, w: 40, gap: 3, y: 34, h: 44, cols: 11 };   // v23: 31 heroes -> 11 columns")
# Bollywood physics hooks
rep("    hit = true; gore(e.x + e.w / 2, e.y + 8, 2, 0.4);\n", "    hit = true; gore(e.x + e.w / 2, e.y + 8, 2, 0.4);\n    if (BOLLY.has(p.ch) && !o.quiet) bollyHit(p, e, o, e.dead);\n")
rep("function updEnemy(e, dt) {\n", "function updEnemy(e, dt) {\n  flingSmash(e, dt);\n")
rep("function moveRunner(p, dt, ip) {\n", "function moveRunner(p, dt, ip) {\n  if (BOLLY.has(p.ch)) bollyHang(p, dt);\n")
rep("  if (p.superT > 0) { /* shadowless kick drives the body itself */ }", "  if (p.superT > 0 || p.driveT > 0) { /* shadowless kick / bicycle / train run drive the body itself */ }")
rep("  e.vx = dir * 520 * power; e.vy = -260 * power; e.vr = dir * 20; e.missile = 0.7; e.missileDir = dir;", "  e.vx = dir * 520 * power; e.vy = -260 * power; e.vr = dir * 20; e.missile = 0.7; e.missileDir = dir; if (BOLLY.has(G.player.ch)) e.fling = 0.8;")
rep("  updGibs(dt);\n", "  updGibs(dt); updTrain(dt);\n")
rep("  drawGibs();", "  drawGibs(); drawTrain();")


# ======================= v23: STAGE 05 — cop-story hill, mall, light pole =======================
st5 = open(ROOT + '/modules/stage5.js').read()
rep("function stage3Init() {", st5 + "\nfunction stage3Init() {")
rep("4: 'KOWLOON WALLED CITY: THE CLIMB' };", "4: 'KOWLOON WALLED CITY: THE CLIMB', 5: 'SHANTY HILL & THE GLASS MALL' };")
rep("blurb: '8 FLOORS, STREET TO ROOF. MIND THE 747.', col: '#9ae8ff' }\n];", "blurb: '8 FLOORS, STREET TO ROOF. MIND THE 747.', col: '#9ae8ff' },\n  { s: 5, x: 366, y: 214, city: 'HONG KONG HILLS', sub: '1985 · 警察故事 (ALMOST)', blurb: 'A CAR DOWN THE HILL. A MALL MADE OF GLASS. ONE POLE.', col: '#ffe08a' }\n];")
rep("  4: { S: [330, 0], A: [420, 1], B: [540, 4] }   // WALLED CITY      (8 storeys, 4 ambushes, the Landlord)", "  4: { S: [330, 0], A: [420, 1], B: [540, 4] },  // WALLED CITY      (8 storeys, 4 ambushes, the Landlord)\n  5: { S: [140, 0], A: [200, 1], B: [290, 4] }   // GLASS MALL       (hill, road lock, mall lock, the Tycoon)")
rep("ranks: { 1: {}, 2: {}, 3: {}, 4: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0 }", "ranks: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }")
rep("[1, 2, 3, 4]", "[1, 2, 3, 4, 5]", 6)
rep("8 + i * 25, 10, s === STAGE", "8 + i * 21, 10, s === STAGE")
rep("rx += 30; });\n  if (!lockedSel)", "rx += 27; });\n  if (!lockedSel)")
rep("STAGE = STAGE % 4 + 1;", "STAGE = STAGE % 5 + 1;")
rep("if (ip.start && STAGE < 4) STAGE++;", "if (ip.start && STAGE < 5) STAGE++;")
rep("  if (STAGE === 4) { LOCKS = []; stage4LoadArt(); return buildStage4(E, set, fill, en, br, cp, hint); }", "  if (STAGE === 4) { LOCKS = []; stage4LoadArt(); return buildStage4(E, set, fill, en, br, cp, hint); }\n  if (STAGE === 5) { LOCKS = LOCKS5; return buildStage5(E, set, fill, en, br, cp, hint); }")
rep("function drawBackground(cam) {\n  if (STAGE === 4) return drawWalledBG(cam);\n", "function drawBackground(cam) {\n  if (STAGE === 4) return drawWalledBG(cam);\n  if (STAGE === 5) return drawStage5BG(cam);\n")
rep("  if (STAGE === 4) drawWalledRooms(cam);\n  if (G.mode !== 'title' && G.mode !== 'select') drawHints(cam);\n  drawTiles(cam);", "  if (STAGE === 4) drawWalledRooms(cam);\n  if (STAGE === 5) drawMallInterior(cam);\n  if (G.mode !== 'title' && G.mode !== 'select') drawHints(cam);\n  drawTiles(cam);\n  if (STAGE === 5) { drawGlass(cam); drawPoles(cam); }")
rep("function startIntro() {\n  const p = G.player;\n", "function startIntro() {\n  const p = G.player;\n  if (STAGE === 5) return startCar5();          // stage 05: everybody arrives the same way — down the hill, through the shacks, in a car\n")
rep("    case 'introAamir':", "    case 'introCar5': cineCar5(c, p, dt); break;\n    case 'introAamir':")
rep("function drawPlayer(p) {\n", "function drawPlayer(p) {\n  if (p.carHide) return;\n")
rep("function moveRunner(p, dt, ip) {\n  if (BOLLY.has(p.ch)) bollyHang(p, dt);\n", "function moveRunner(p, dt, ip) {\n  if (BOLLY.has(p.ch)) bollyHang(p, dt);\n  if (poleTick(p, dt, ip)) return;\n")
rep("updStage3(dt); updStage4(dt);", "updStage3(dt); updStage4(dt); updStage5(dt);")
rep("function explode(x, y, r, dmg, o) {\n", "function explode(x, y, r, dmg, o) {\n  if (STAGE === 5) shatterNear(x, y, r);\n")
rep("if (STAGE === 1 && G.arena === 'idle' && p.x > ARENA.trigger * TS) {", "if ((STAGE === 1 || STAGE === 5) && G.arena === 'idle' && p.x > ARENA.trigger * TS) {")
rep("    fireT: 0, mgCd: 0, second: false, dying: 0, dropT: 99, anim: 0, shown: 0\n  };\n}\nfunction damageBoss", "    fireT: 0, mgCd: 0, second: false, dying: 0, dropT: 99, anim: 0, shown: 0\n  };\n  if (STAGE === 5) Object.assign(G.boss, { skin: 'tycoon', name: 'THE TYCOON', title: 'THE TYCOON', sub: '毒梟  —  \"I OWN THIS MALL. AND THE POLICE.\"', hp: 185, maxHp: 185 });\n}\nfunction damageBoss")
rep("  if (STAGE === 4) drawLandlordBody(b, corpse);\n", "  if (STAGE === 4) drawLandlordBody(b, corpse);\n  else if (STAGE === 5) drawTycoonBody(b, corpse);\n")
rep("...(STAGE === 2 ? [['GOLDEN MEN', s.monks + '/18']] : []),", "...(STAGE === 2 ? [['GOLDEN MEN', s.monks + '/18']] : []), ...(STAGE === 5 ? [['GLASS BROKEN', String(s.glass || 0)]] : []),")

# --- the stage itself + its Gemini backdrop, inserted before the HUD code
st4 = open(ROOT + '/modules/stage4.js').read()
bg = 'data:image/jpeg;base64,' + base64.b64encode(open(ROOT + '/art/stage4_walled_hd.jpg', 'rb').read()).decode()
st4 = "const S4_BG_SRC = '" + bg + "';   // Gemini-painted Walled City facade (style-locked to the stage-01 test art)\n" + st4
rep("function stage3Init() {", st4 + "\nfunction stage3Init() {")

# ======================= v24: STAGE 05 goes all the way to Tsim Sha Tsui; boss fix; concept art on stage 1 & 4 =======================
rep("  else { LW = 232; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 192, sum: null, row: 18 }); }",
    "  else if (STAGE === 5) { LW = S5.W; LH = 22; Object.assign(ARENA, { x0: 436, x1: 466, trigger: 440, sum: [439, 462], row: 18, door: 464 }); }\n"
    "  else { LW = 232; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 192, sum: null, row: 18, door: 216 }); }")
rep("type: 'boss', x: 213 * TS, y: -70,", "type: 'boss', x: ((ARENA.door || 216) - 3) * TS, y: -70,")
rep("for (const tx of [216, 217]) if (tileAt(tx, yy) === T.D)", "for (const tx of [ARENA.door || 216, (ARENA.door || 216) + 1]) if (tileAt(tx, yy) === T.D)")
rep("explode(216.5 * TS + 8, yy * TS + 8, 22, 0, { noDmg: true, quiet: true });", "explode(((ARENA.door || 216) + 0.5) * TS + 8, yy * TS + 8, 22, 0, { noDmg: true, quiet: true });")
rep("popup(216 * TS, 11 * TS, 'EXIT OPEN  >>'", "popup((ARENA.door || 216) * TS, 11 * TS, 'EXIT OPEN  >>'")
rep("  if (b.state === 'enter') {\n    if (b.onGround && !wasG) {",
    "  if (b.state === 'enter') {\n"
    "    b.enterT = (b.enterT || 0) + dt;                                  // v24 safety: a boss that never lands in the arena gets put there\n"
    "    if (b.enterT > 3.5 && (!b.onGround || b.y + b.h < (ARENA.row || 18) * TS - 40)) { b.x = ((ARENA.door || 216) - 4) * TS; b.y = (ARENA.row || 18) * TS - b.h - 90; b.vy = 0; b.onGround = false; b.enterT = 0; }\n"
    "    if (b.onGround && !wasG) {")
rep("function startOutro() {\n", "function startOutro() {\n  if (STAGE === 5) return startCar5Outro();       // stage 05: the same car comes back for you\n")
rep("    case 'introCar5': cineCar5(c, p, dt); break;\n", "    case 'introCar5': cineCar5(c, p, dt); break;\n    case 'outroCar5': cineCar5Out(c, p, dt); break;\n")
rep("  5: { S: [140, 0], A: [200, 1], B: [290, 4] }   // GLASS MALL       (hill, road lock, mall lock, the Tycoon)",
    "  5: { S: [330, 0], A: [430, 1], B: [580, 4] }   // HILL → TSIM SHA TSUI (hill, mall, Central, the ferry, the Tycoon)")
rep("5: 'SHANTY HILL & THE GLASS MALL' };", "5: 'SHANTY HILL TO TSIM SHA TSUI' };")
rep("blurb: 'A CAR DOWN THE HILL. A MALL MADE OF GLASS. ONE POLE.'", "blurb: 'HILL, GLASS MALL, CENTRAL, THE FERRY, TST. SAME CAR.'")
rep('sub: \'毒梟  —  "I OWN THIS MALL. AND THE POLICE."\'', 'sub: \'毒梟  —  "I OWN THIS HARBOUR. AND THE POLICE."\'')
# stage 01: the Gemini back-street painting becomes the backdrop
s1bg = 'data:image/jpeg;base64,' + base64.b64encode(open(ROOT + '/art/stage1_alley.jpg', 'rb').read()).decode()
rep("function drawFactoryBG(cam) {\n",
    "const S1_BG_SRC = '" + s1bg + "';\n"
    "let S1BG = null; (() => { const im = new Image(); im.onload = () => { S1BG = im; }; im.src = S1_BG_SRC; })();\n"
    "function drawS1Art(cam, burn) {            // v24: the Gemini Kwun Tong back street, mirrored tiles so the seam never shows\n"
    "  const t = G.clock, hor = 18 * TS - cam.y, h = VH + 16, w = Math.round(S1BG.width * h / S1BG.height), y = Math.round(hor - 10 - 0.83 * h), off = cam.x * 0.22, i0 = Math.floor(off / w);\n"
    "  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;\n"
    "  for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(S1BG, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(S1BG, x, y, w, h); }\n"
    "  ctx.imageSmoothingEnabled = pv;\n"
    "  if (y > 0) { ctx.fillStyle = '#2a1238'; ctx.fillRect(0, 0, VW, y + 1); }\n"
    "  if (burn) { ctx.fillStyle = 'rgba(255,90,30,' + (0.3 * burn) + ')'; ctx.fillRect(0, 0, VW, VH); }\n"
    "  if (FX.set && FX.set.bursts) drawSetPiece();\n"
    "  ctx.fillStyle = 'rgba(30,10,30,0.12)'; ctx.fillRect(0, 0, VW, VH);\n"
    "  if (G.arena === 'fight' && G.boss && !G.boss.dead) { ctx.fillStyle = 'rgba(255,30,30,' + (0.08 + 0.06 * Math.sin(t * 6)) + ')'; ctx.fillRect(0, 0, VW, VH); }\n"
    "}\n"
    "function drawFactoryBG(cam) {\n")
rep("  // banded cloud strips\n", "  if (S1BG) return drawS1Art(cam, burn);\n  // banded cloud strips\n")

rep("e.y = G.cam.y - 30; e.vy = 0; e.vx = 0; e.para = true;",
    "e.y = Math.max(G.cam.y - 30, p.y + p.h - e.h - 40); e.vy = 0; e.vx = 0; e.para = true;   /* v24: drop onto the hero's own floor */")

# ======================= v25: STAGE 03 extended (terminus, studio lot, night docks), layered playfield, new gunboat =======================
import os
def b64jpg(path): return 'data:image/jpeg;base64,' + base64.b64encode(open(path, 'rb').read()).decode()
s3x = open(ROOT + '/modules/stage3x.js').read()
arts = ''
for k, f in [('S3_STATION_SRC', 's3_station.jpg'), ('S3_STUDIO_SRC', 's3_studio.jpg'), ('S3_DOCKS_SRC', 's3_docks.jpg')]:
    fp = ROOT + '/art/' + f
    if os.path.exists(fp): arts += "const " + k + " = '" + b64jpg(fp) + "';\n"
rep("function drawGunboatAt(x, y, s, alpha, flash, deck) {", "function drawGunboatAtV20(x, y, s, alpha, flash, deck) {")
rep("const S3_BG_SRC = ", arts + s3x + "\nconst S3_BG_SRC = ")
rep("const DOCK = { gate: 148, trig: 153, pier: 168, deck1: 177, cab: 171 };", "const DOCK = { gate: 348, trig: 353, pier: 368, deck1: 377, cab: 371 };   // v25: the docks moved to the end of a longer stage")
rep("{ LOCKS = LOCKS3; return buildStage3(E, set, fill, en, br, cp, hint); }", "{ return buildStage3X(E, set, fill, en, br, cp, hint); }")
rep("  else if (STAGE === 5) { LW = S5.W;", "  else if (STAGE === 3) { LW = S3X.W; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 192, sum: null, row: 18, door: 216 }); }\n  else if (STAGE === 5) { LW = S5.W;")
rep("  if (S3BG) {                     // v22:", "  if (S3BG) { drawMumbaiArt(cam); } else if (false) {                     // v22:")
rep("drawGunboatAt(Math.round(b.x - 40), Math.round(18 * TS + b.bob), 1, 1, b.flash > 0, true);", "drawGunboatAt(Math.round(b.x - 40), Math.round(18 * TS + b.bob), 1, 1, b.flash > 0, true, b);")
rep("  if (b.type === 'gunboat') return updGunboat(b, dt);", "  if (b.type === 'gunboat') { gunboatExtra(b, dt); return updGunboat(b, dt); }")
rep("function updStage3(dt) {\n  if (STAGE !== 3) return;\n", "function updStage3(dt) {\n  if (STAGE !== 3) return;\n  updStage3X(dt);\n")
rep("    if (t === T.E) { if (ruin[i]) LCTX.drawImage(TSPR.ruin, x, y, TS, TS); return; }\n", "    if (t === T.E) { if (ruin[i]) LCTX.drawImage(TSPR.ruin, x, y, TS, TS); return; }\n    if (STAGE === 3 && skin3(LCTX, t, tx, ty, x, y, i)) return;\n")
rep("  if (STAGE === 5) drawMallInterior(cam);\n", "  if (STAGE === 5) drawMallInterior(cam);\n  if (STAGE === 3) drawStage3Mid(cam);\n")
rep("    if (STAGE === 3) drawStage3Overlay();", "    if (STAGE === 3) { drawStage3Overlay(); drawStage3Front(); }")
rep("  3: { S: [75, 0], A: [110, 1], B: [180, 4] },   // MUMBAI STREET    (gunboat shelling + boss)", "  3: { S: [210, 0], A: [290, 1], B: [400, 4] },   // MUMBAI: street, terminus, studio lot, night docks + gunboat")
rep("blurb: 'DANCING CROWDS. A GUNBOAT. HOLI DUST.'", "blurb: 'BAZAAR, THE 6:15 FAST, A SONG BREAK, A GUNBOAT.'")

# ======================= v25: STAGE 06 — HAUNTED HILLS (jiangshi, hold your breath, coffins, the General) =======================
s6 = open(ROOT + '/modules/stage6.js').read()
arts6 = ''
for k, f in [('S6_FOREST_SRC', 's6_forest.jpg'), ('S6_INN_SRC', 's6_inn.jpg')]:
    fp = ROOT + '/art/' + f
    if os.path.exists(fp): arts6 += "const " + k + " = '" + b64jpg(fp) + "';\n"
rep("const S3_BG_SRC = ", arts6 + s6 + "\nconst S3_BG_SRC = ")
rep("shield: { w: 12, h: 21, hp: 9 }", "shield: { w: 12, h: 21, hp: 9 }, jiangshi: { w: 10, h: 22, hp: 6 }, ghost: { w: 12, h: 22, hp: 4 }")
rep("  else if (e.type === 'shield') updShield(e, dt);\n", "  else if (e.type === 'shield') updShield(e, dt);\n  else if (e.type === 'jiangshi') updJiangshi(e, dt);\n  else if (e.type === 'ghost') { updGhost(e, dt); return; }\n")
rep("  else if (e.type === 'bomber' || e.type === 'knife' || e.type === 'shield') drawNewEnemy(e, ph, moving);", "  else if (e.type === 'jiangshi') drawJiangshi(e);\n  else if (e.type === 'ghost') drawGhost(e);\n  else if (e.type === 'bomber' || e.type === 'knife' || e.type === 'shield') drawNewEnemy(e, ph, moving);")
rep("function damageEnemy(e, dmg, srcX, explosive, chain) {\n  if (e.dead) return;\n", "function damageEnemy(e, dmg, srcX, explosive, chain) {\n  if (e.dead) return;\n  if (e.type === 'jiangshi') jiangshiHit(e);\n")
rep("function dropIn(type, tx, form) {\n", "function dropIn(type, tx, form) {\n  if (type === 'jiangshi' || type === 'ghost') { const e = mkEnemy(type, tx, 18); e.alerted = true; e.state = 'hunt'; if (type === 'jiangshi') { e.rise = 0.5; e.vy = -300; } else { e.y = 8 * TS; e.hx = e.x; e.hy = e.y; } G.enemies.push(e); fogPuff(tx * TS + 8, 17 * TS, 8); return; }\n")
rep("  if (b.type === 'gunboat') { gunboatExtra(b, dt); return updGunboat(b, dt); }", "  if (b.type === 'gunboat') { gunboatExtra(b, dt); return updGunboat(b, dt); }\n  if (b.type === 'general') return updGeneral(b, dt);")
rep("  if (b.type === 'gunboat') return drawGunboat(b);", "  if (b.type === 'gunboat') return drawGunboat(b);\n  if (b.type === 'general') return drawGeneral(b);")
rep("    if (STAGE === 3 && skin3(LCTX, t, tx, ty, x, y, i)) return;\n", "    if (STAGE === 3 && skin3(LCTX, t, tx, ty, x, y, i)) return;\n    if (STAGE === 6 && skin6(LCTX, t, tx, ty, x, y, i)) return;\n")
rep("  if (STAGE === 3) drawStage3Mid(cam);\n", "  if (STAGE === 3) drawStage3Mid(cam);\n  if (STAGE === 6) drawStage6Mid(cam);\n")
rep("    if (STAGE === 3) { drawStage3Overlay(); drawStage3Front(); }", "    if (STAGE === 3) { drawStage3Overlay(); drawStage3Front(); } if (STAGE === 6) drawStage6Front();")
rep("updStage5(dt);", "updStage5(dt); updStage6(dt);")
rep("  if (STAGE === 5) return drawStage5BG(cam);\n", "  if (STAGE === 5) return drawStage5BG(cam);\n  if (STAGE === 6) return drawStage6BG(cam);\n")
rep("  if (STAGE === 5) { LOCKS = LOCKS5; return buildStage5(E, set, fill, en, br, cp, hint); }", "  if (STAGE === 5) { LOCKS = LOCKS5; return buildStage5(E, set, fill, en, br, cp, hint); }\n  if (STAGE === 6) { return buildStage6(E, set, fill, en, br, cp, hint); }")
rep("  else if (STAGE === 5) { LW = S5.W;", "  else if (STAGE === 6) { LW = S6.W; LH = 22; Object.assign(ARENA, { x0: 188, x1: 218, trigger: 192, sum: null, row: 18, door: 216 }); }\n  else if (STAGE === 5) { LW = S5.W;")
rep("5: 'SHANTY HILL TO TSIM SHA TSUI' };", "5: 'SHANTY HILL TO TSIM SHA TSUI', 6: 'HAUNTED HILLS: HOLD YOUR BREATH' };")
rep("SAME CAR.', col: '#ffe08a' }", "SAME CAR.', col: '#ffe08a' },\n  { s: 6, x: 326, y: 150, city: 'NEW TERRITORIES', sub: '1985 · 殭屍 (ALMOST)', blurb: 'FOG. COFFINS. A GENERAL. HOLD YOUR BREATH.', col: '#7dffd0' }")
rep("  5: { S: [330, 0], A: [430, 1], B: [580, 4] }", "  6: { S: [240, 0], A: [330, 1], B: [450, 4] },  // HAUNTED HILLS (forest, procession, the inn, the General)\n  5: { S: [330, 0], A: [430, 1], B: [580, 4] }")
rep("ranks: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }", "ranks: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} }, clears: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }")
rep("[1, 2, 3, 4, 5]", "[1, 2, 3, 4, 5, 6]", 6)
rep("8 + i * 21, 10, s === STAGE", "8 + i * 18, 10, s === STAGE")
rep("rx += 27; });", "rx += 23; });")
rep("STAGE = STAGE % 5 + 1;", "STAGE = STAGE % 6 + 1;")
rep("STAGE < 5) STAGE++", "STAGE < 6) STAGE++")

# ======================= v26: THE NEW LOOK — big heads, long limbs, 2.5D volume (V toggles) =======================
look = open(ROOT + '/modules/look.js').read()
rep("function px(x, y, w, h, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); ctx.fillRect(x, y, w, h); }",
    look + "\nfunction px(x, y, w, h, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); if (WARP) { const r = lkRect(x, y, w, h); ctx.fillRect(r[0], r[1], r[2], r[3]); return; } ctx.fillRect(x, y, w, h); }")
rep("function hp(x, y, w, h, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); ctx.fillRect(x, y, w, h); }",
    "function hp(x, y, w, h, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); if (WARP) { const r = lkRect(x, y, w, h); ctx.fillRect(r[0], r[1], r[2], r[3]); return; } ctx.fillRect(x, y, w, h); }")
rep("function hc(x, y, r, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }",
    "function hc(x, y, r, c) { ctx.fillStyle = OUTL || (FLASH ? '#ffffff' : c); ctx.beginPath(); if (WARP) { const hd = y < LK.neck - 0.5; ctx.arc(lkX(x, hd), lkY(y), r * (hd ? LK.H : 1.15), 0, 6.283); } else ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }")
rep("function drawOutlined(bx, by, bw, bh, fn, shadow) {", "function drawOutlined(bx, by, bw, bh, fn, shadow, vol) {")
rep("  ctx = OUTCTX; try { fn(); } finally { ctx = main; }\n", "  ctx = OUTCTX; try { fn(); } finally { ctx = main; }\n  if (vol && lookOn()) lkShade(OUTCTX, W, H, vol.top * T.d + T.f - dy + 2, vol.bot * T.d + T.f - dy + 2);\n  if (shadow && lookOn()) shadow = { x: shadow.x, y: shadow.y + 0.5, r: shadow.r * 1.35 };\n")
rep("  if (G && G.mode === 'select' && p !== G.previews[G.sel]) return drawPlayerRaw(p);",
    "  if (G && G.mode === 'select' && p !== G.previews[G.sel]) { WARP = lookOn() ? 1 : 0; try { return drawPlayerRaw(p); } finally { WARP = 0; } }")
rep("  drawOutlined(p.x - pad, p.y - up, p.w + pad * 2, p.h + up + 12, () => drawPlayerRaw(p), ground ? { x: p.x + p.w / 2, y: feetY, r: p.ch === 'wah' ? 14 : 7 } : null);",
    "  WARP = lookOn() ? 1 : 0;\n  try { drawOutlined(p.x - pad, p.y - up, p.w + pad * 2, p.h + up + 12, () => drawPlayerRaw(p), ground ? { x: p.x + p.w / 2, y: feetY, r: p.ch === 'wah' ? 14 : 7 } : null, { top: feetY - 36, bot: feetY }); } finally { WARP = 0; }")
rep("  for (const e of G.enemies) if (e.dead && onScreen(e, 30)) drawEnemy(e);", "  for (const e of G.enemies) if (e.dead && onScreen(e, 30)) drawEnemyLook(e);")
rep("  for (const e of G.enemies) if (!e.dead && onScreen(e, 30)) drawEnemy(e);", "  for (const e of G.enemies) if (!e.dead && onScreen(e, 30)) drawEnemyLook(e);")
rep("KeyL: 'ult',", "KeyL: 'ult', KeyV: 'look',")
rep("  if (ip.blood) { const gs = cycleGore();", "  if (ip.look) { const ls = cycleLook(); if (G.player) popup(G.player.x + 5, G.player.y - 30, ls, '#9ae8ff', true); }\n  if (ip.blood) { const gs = cycleGore();")
rep("  if (G.mode === 'play') { SILCTX.globalCompositeOperation = 'source-in'; SILCTX.fillStyle = '#ffd08a';", "  if (G.mode === 'play' && !(vol && vol.noGlow)) { SILCTX.globalCompositeOperation = 'source-in'; SILCTX.fillStyle = '#ffd08a';")

# ======================= v26: STAGE 05 Gemini art + STAGE 01 playfield pass =======================
arts5 = ''
for k, f in [('S5_HILL_SRC', 's5_hill.jpg'), ('S5_CENTRAL_SRC', 's5_central.jpg'), ('S5_TST_SRC', 's5_tst.jpg')]:
    fp = ROOT + '/art/' + f
    if os.path.exists(fp): arts5 += "const " + k + " = '" + b64jpg(fp) + "';\n"
rep("const S3_BG_SRC = ", arts5 + open(ROOT + '/modules/stage1x.js').read() + "\nconst S3_BG_SRC = ")
rep("    if (STAGE === 3 && skin3(LCTX, t, tx, ty, x, y, i)) return;\n", "    if (STAGE === 3 && skin3(LCTX, t, tx, ty, x, y, i)) return;\n    if (STAGE === 1 && skin1(LCTX, t, tx, ty, x, y, i)) return;\n")
rep("  if (STAGE === 3) drawStage3Mid(cam);\n", "  if (STAGE === 3) drawStage3Mid(cam);\n  if (STAGE === 1) drawStage1Mid(cam);\n")
rep("if (STAGE === 6) drawStage6Front();", "if (STAGE === 6) drawStage6Front(); if (STAGE === 1 && G.mode === 'play') drawStage1Front();")
rep("    if (STAGE === 1 && skin1(LCTX, t, tx, ty, x, y, i)) return;\n", "    if (STAGE === 1 && skin1(LCTX, t, tx, ty, x, y, i)) return;\n    if (STAGE === 5 && skin5(LCTX, t, tx, ty, x, y, i)) return;\n")

# ======================= v26: RESCUE THE STUNT DOUBLES (cages, takes, hero swap) =======================
rep("const S3_BG_SRC = ", open(ROOT + '/modules/cages.js').read() + "\nconst S3_BG_SRC = ")
rep("function respawn() {\n  let rx = G.cp.x;", "function respawn() {\n  if (G.wrapping) return;\n  if (takesOnDeath()) { G.wrapping = true; return; }\n  let rx = G.cp.x;")
rep("const np = mkPlayer(rx, groundBelow(rx + 5, STAGE >= 4 ? G.cp.y - 4 : 0) - PC.standH, CHOSEN);", "const np = mkPlayer(rx, groundBelow(rx + 5, STAGE >= 4 ? G.cp.y - 4 : 0) - PC.standH, G.actor || CHOSEN);")
rep("function explode(x, y, r, dmg, o) {\n  if (STAGE === 5) shatterNear(x, y, r);\n", "function explode(x, y, r, dmg, o) {\n  if (STAGE === 5) shatterNear(x, y, r);\n  if (CG.g === G) cageBlast(x, y, r);\n")
rep("updStage5(dt); updStage6(dt);", "updStage5(dt); updStage6(dt); updCages(dt);")
rep("  drawTiles(cam);\n  if (STAGE === 5) { drawGlass(cam); drawPoles(cam); }", "  drawTiles(cam);\n  drawCages(cam);\n  if (STAGE === 5) { drawGlass(cam); drawPoles(cam); }")
rep("drawHUD(); if (G.banner)", "drawHUD(); drawTakesHUD(); if (G.banner)")
rep("KeyV: 'look',", "KeyV: 'look', KeyH: 'swapm',")
rep("  if (ip.look) {", "  if (ip.swapm) { const ss = cycleSwap(); if (G.player) popup(G.player.x + 5, G.player.y - 30, ss, '#7dff8a', true); }\n  if (ip.look) {")
rep("  G.prog = recordResult(STAGE, G.player.ch, G.rank);", "  G.prog = recordResult(STAGE, CHOSEN, G.rank);   // v26: the rank goes to the hero you picked, even if a rescued double finished the job")

# ======================= v26: Uncle Tom-Yum gets an upward strike; stage-04 ambush stragglers come to YOUR storey =======================
rep("    if (held('down') && p.kneeCd <= 0) { p.kneeCd = 1.4; p.kneeT = 0.45; p.vy = -300; p.passed = new Set(); audio.play('whoosh'); }\n    else {                                                     // PRIMARY: elbow - knee - elbow",
    "    if (held('down') && p.kneeCd <= 0) { p.kneeCd = 1.4; p.kneeT = 0.45; p.vy = -300; p.passed = new Set(); audio.play('whoosh'); }\n"
    "    else if (held('up')) {                                      // UP+J: SOK KLAB — the rising elbow straight up (hits what's overhead, cracks the ceiling)\n"
    "      p.atkCd = 0.26; p.swingT = 0.18; p.swingK = 'upper'; if (p.onGround) p.vy = -240; audio.play('whoosh');\n"
    "      const box = { x: p.x - 8, y: p.y - 46, w: p.w + 16, h: 50 }; let hit = false;\n"
    "      for (const e of G.enemies) if (!e.dead && overlap(box, e)) { damageEnemy(e, 3.2, p.x + p.w / 2, false); e.vy = -360; e.stun = 0.4; hit = true; }\n"
    "      const b = G.boss; if (b && !b.dead && b.dying <= 0 && overlap(box, b)) { damageBoss(2.4, p.x); hit = true; }\n"
    "      const cx = Math.floor((p.x + p.w / 2) / TS), hy = Math.floor((p.y - 4) / TS);\n"
    "      for (const tx of [cx - 1, cx, cx + 1]) for (const ty of [hy, hy - 1]) if (damageTile(tx, ty, 1)) hit = true;\n"
    "      if (hit) { audio.play('punch'); hitstop(0.04); shake(0.12); popup(p.x + 5, p.y - 30, ['SOK!', 'ศอก!', 'KLAB!'][(Math.random() * 3) | 0], '#ffd23f'); addUlt(p, 4); }\n"
    "    }\n"
    "    else {                                                     // PRIMARY: elbow - knee - elbow")
rep("      if (k === 'punch') { px(1, -16, 5, 2, SK); px(5, -18, 2, 4, SK); }           // elbow strike", "      if (k === 'upper') { px(0, -26, 3, 10, SK); px(-1, -29, 4, 4, SK); px(-5, -17, 2, 5, SK); }   // rising elbow, straight up\n      else if (k === 'punch') { px(1, -16, 5, 2, SK); px(5, -18, 2, 4, SK); }           // elbow strike")
rep("ELBOW-KNEE J  BONE BREAKER K  FLYING KNEE S+J", "ELBOW-KNEE J  UP+J RISING ELBOW  BREAKER K  KNEE S+J")

# ======================= v27: FIVE NEW HEROES + HERO SELECT 2.0 + LOOK PRESETS =======================
heroes5_js = open(ROOT + '/modules/heroes5.js').read()
sel2_js = open(ROOT + '/modules/select3.js').read()
rep("\nfunction slapLaunch(e, dir, power) {", "\n" + heroes5_js + "\nfunction slapLaunch(e, dir, power) {")
rep("  madong: { name: 'FIST HYUNG',", """  furie: { name: 'AUNTIE FURIE', card: 'A.FURIE', cn: '怒姨', th: 'ป้าฟิวรี่ (แนวล้อ)', tag: 'GUN-FU ASSASSIN', col: '#e04aff', role: 'GUN-FU / PRECISION', diff: 2,
    lines: ['ROLE: GUN-FU / PRECISION   ·   DIFFICULTY ★★☆', 'J  PISTOL (POINT BLANK = ELBOW + SHOT)  ·  S+J  THE ONE HEADSHOT', 'K  TACTICAL SLIDE: DISARMS AND THROWS WHOEVER IS IN THE WAY', 'L  NO MERCY: A CURVING BULLET FOR EVERY FACE ON SCREEN'],
    stats: [['SPEED', 4], ['POWER', 3], ['RANGE', 4], ['SAFETY', 2]] },
  bey: { name: 'UNCLE THUNDER-BEY', card: 'T-BEY', cn: '雷伯', th: 'ลุงสายฟ้าหนวดเฟิ้ม (แนวล้อ)', tag: 'SLOW · HEAVY · UNBREAKABLE', col: '#e8a030', role: 'BRAWLER / TANK', diff: 1,
    lines: ['ROLE: BRAWLER / TANK   ·   DIFFICULTY ★☆☆', 'J  HEAVY FISTS (EVERY 2ND KNOCKS OUT)  ·  S+J  STOMP  ·  AIR J  DIVE', 'K  CURVED SWORD: WIDE SLASH THAT BATS BULLETS BACK', 'EVERY 2ND HIT BOUNCES OFF HIM. HE RUNS SLOWLY. HE DOES NOT CARE.', 'L  SAVIOR OF THE WORLD: THE GROUND ANSWERS (+1 HEART)'],
    stats: [['SPEED', 1], ['POWER', 5], ['RANGE', 2], ['SAFETY', 5]] },
  gada: { name: 'MACE-RAJA', card: 'MACE-RAJA', cn: '棍王', th: 'ราชากระบอง (แนวล้อ)', tag: 'THE GADA SMASH', col: '#ff9a3a', role: 'BRAWLER / AREA', diff: 2,
    lines: ['ROLE: BRAWLER / AREA   ·   DIFFICULTY ★★☆', 'J  MACE ARCS: THE THIRD ONE SENDS THEM THROUGH THE WALL', 'S+J  GROUND SMASH (CRACKS WALLS)  ·  K  THROW THE MACE: IT COMES BACK', 'L  GADA WHIRLWIND: SPIN, STEER, LAUNCH EVERYTHING AROUND HIM'],
    stats: [['SPEED', 2], ['POWER', 5], ['RANGE', 3], ['SAFETY', 3]] },
  silat: { name: 'AGENT SILAT', card: 'SILAT', cn: '拳影', th: 'เอเจนต์ซิลัต (แนวล้อ)', tag: 'SILAT + SMG', col: '#4ae8a0', role: 'MELEE / GUN HYBRID', diff: 3,
    lines: ['ROLE: MELEE / GUN HYBRID   ·   DIFFICULTY ★★★', 'J  ELBOW - KNEE - SPINNING KICK  ·  S+J  LOW SWEEP', 'K (HOLD)  SUBMACHINE GUN: 30 ROUNDS, REFILLS WHILE NOT FIRING', 'L  THE RAID: SPRAY EVERY FOE ON SCREEN, THEN A SPINNING FINISHER'],
    stats: [['SPEED', 5], ['POWER', 3], ['RANGE', 3], ['SAFETY', 2]] },
  hongbao: { name: 'UNCLE HONG-BAO', card: 'HONG-BAO', cn: '洪包叔', th: 'ลุงอั่งเปา (แนวล้อ)', tag: 'THE NIMBLE FAT UNCLE', col: '#ff5a4a', role: 'ACROBAT / BRAWLER', diff: 2,
    lines: ['ROLE: ACROBAT / BRAWLER   ·   DIFFICULTY ★★☆', 'J  KICK - KICK - SPINNING KICK  ·  AIR J  FLYING DROP-KICK', 'S+J  BELLY BUMP (BIG SHOVE)  ·  K  LOB A STEAMED BUN (STUNS)', 'L  ALL-YOU-CAN-EAT: +1 HEART, THEN ROLL THROUGH EVERYONE'],
    stats: [['SPEED', 5], ['POWER', 3], ['RANGE', 2], ['SAFETY', 3]] },
  madong: { name: 'FIST HYUNG',""")
rep("'ichi', 'ogami', 'juk', 'aamir'];", "'ichi', 'ogami', 'juk', 'aamir', 'furie', 'bey', 'gada', 'silat', 'hongbao'];")
rep("aamir: ['CHACHA PERFECT', 'C.PERFECT'],", "aamir: ['CHACHA PERFECT', 'C.PERFECT'], furie: ['AUNTIE FURIE', 'A.FURIE'], bey: ['UNCLE THUNDER-BEY', 'T-BEY'], gada: ['MACE-RAJA', 'MACE-RAJA'], silat: ['AGENT SILAT', 'SILAT'], hongbao: ['UNCLE HONG-BAO', 'HONG-BAO'],")
rep("  aamir: { stage: 4, rank: 'B' },", "  aamir: { stage: 4, rank: 'B' },\n  furie: { stage: 3, rank: 'B' }, bey: { stage: 1, rank: 'A' }, gada: { stage: 2, rank: 'A' }, silat: { stage: 3, rank: 'A' }, hongbao: { stage: 2, rank: 'B' },")
rep("'ogami', 'ram'];", "'ogami', 'ram', 'furie', 'bey', 'gada', 'silat', 'hongbao'];")
rep("const RUNCFG = { aamir: {", "const RUNCFG = { furie: { run: 205, jump: 455 }, bey: { run: 150, jump: 420 }, gada: { run: 176, jump: 440 }, silat: { run: 215, jump: 470 }, hongbao: { run: 222, jump: 480 }, aamir: {")
rep("  else if (p.ch === 'aamir') updAamir(p, dt, ip);", "  else if (p.ch === 'aamir') updAamir(p, dt, ip);\n  else if (p.ch === 'furie') updFurie(p, dt, ip);\n  else if (p.ch === 'bey') updBey(p, dt, ip);\n  else if (p.ch === 'gada') updGada(p, dt, ip);\n  else if (p.ch === 'silat') updSilat(p, dt, ip);\n  else if (p.ch === 'hongbao') updHongbao(p, dt, ip);")
rep("function drawPlayerRaw(p) { if (p.ch === 'aamir') return drawAamir(p);", "function drawPlayerRaw(p) { if (DRAW5[p.ch]) return DRAW5[p.ch](p); if (p.ch === 'aamir') return drawAamir(p);")
rep("  } else if (p.ch === 'aamir') {\n    startTrain(p);", "  } else if (NEW5.has(p.ch)) {\n    ult5(p);\n  } else if (p.ch === 'aamir') {\n    startTrain(p);")
rep("aamir: ['JO JEETA WOHI SIKANDAR!', 'ONE MORE ROUND, SIR.', 'PERFECT.'],", """aamir: ['JO JEETA WOHI SIKANDAR!', 'ONE MORE ROUND, SIR.', 'PERFECT.'],
  furie: ['NO MERCY.', 'REVENGE, SENSIBLY DRESSED.', 'RELOAD? NO. FINISH.'], bey: ['I AM THE SAVIOR OF THE WORLD.', 'MOUSTACHE FIRST.', 'SLOWLY. THEN ALL AT ONCE.'],
  gada: ['MACE OF JUSTICE!', 'ONE SWING. ONE VILLAGE.', 'THAAP!'], silat: ['FIFTEEN FLOORS. NO LIFT.', 'SILAT. THEN BULLETS.', 'THE CORRIDOR IS MINE.'],
  hongbao: ['LIGHT ON MY FEET. HEAVY ON YOUR FACE.', 'DUMPLINGS FIRST.', 'A GOOD LUNCH IS A WEAPON.'],""")
rep("const HERO_POW = { aamir: 0.95, ", "const HERO_POW = { furie: 1.2, bey: 1.0, gada: 1.2, silat: 1.25, hongbao: 1.25, aamir: 0.95, ")
rep("srk: 'introSRK', aamir: 'introAamir',", "srk: 'introSRK', aamir: 'introAamir', furie: 'introNew5', bey: 'introNew5', gada: 'introNew5', silat: 'introNew5', hongbao: 'introNew5',")
rep("    case 'introSingham':", """    case 'introNew5':
      p.vx = 0;
      if (at(0.2)) { audio.play('whoosh'); dust(p.x + p.w / 2, p.y + p.h, 6, 8); }
      if (at(0.55)) { p.swingT = 0.4; p.swingK = (p.ch === 'gada' || p.ch === 'bey') ? 'slash' : 'punch'; if (p.ch === 'furie' || p.ch === 'silat') p.shootT = 0.4; audio.play('whoosh'); popup(p.x + 5, p.y - 16, '"' + (QUIPS[p.ch] || ['ACTION!'])[0] + '"', heroOf(p).col, true); }
      if (c.t > 1.5) G.cine = null;
      break;
    case 'introSingham':""")
rep("const r = p.ch === 'aamir' ? clamp(1 - (p.bikeCd || 0) / 3.2, 0, 1) : ", "const r = HUD5[p.ch] ? HUD5[p.ch](p) : p.ch === 'aamir' ? clamp(1 - (p.bikeCd || 0) / 3.2, 0, 1) : ")
rep("'ichi', 'ogami', 'aamir'].includes(p.ch)) {", "'ichi', 'ogami', 'aamir', 'furie', 'bey', 'gada', 'silat', 'hongbao'].includes(p.ch)) {")
rep("srk: 'ARMS', aamir: 'BIKE',", "srk: 'ARMS', aamir: 'BIKE', furie: 'SLIDE', bey: 'BLADE', gada: 'MACE', silat: 'MAG', hongbao: 'BUN',")
rep("TRAIN DARE L',", """TRAIN DARE L',
    furie: 'MOVE A/D  JUMP W/CTRL  PISTOL J  SLIDE K  HEADSHOT S+J  NO MERCY L',
    bey: 'MOVE A/D  JUMP W/CTRL  HEAVY FISTS J  SWORD K  STOMP S+J  DIVE AIR+J  SAVIOR L',
    gada: 'MOVE A/D  JUMP W/CTRL  MACE J  THROW K  GROUND SMASH S+J  WHIRLWIND L',
    silat: 'MOVE A/D  JUMP W/CTRL  SILAT J  SMG HOLD K  SWEEP S+J  THE RAID L',
    hongbao: 'MOVE A/D  JUMP W/CTRL  KICKS J  BUN K  BELLY BUMP S+J  AIR+J DROP-KICK  BUFFET L',""")
rep("['TRAINS DARED', String(s.ults)]],", """['TRAINS DARED', String(s.ults)]],
    furie: [['SHOTS FIRED', String(s.shots)], ['NO MERCY', String(s.ults)]], bey: [['BLOWS LANDED', String(s.melee)], ['WORLDS SAVED', String(s.ults)]],
    gada: [['SWINGS LANDED', String(s.melee)], ['WHIRLWINDS', String(s.ults)]], silat: [['ROUNDS FIRED', String(s.shots)], ['RAIDS', String(s.ults)]],
    hongbao: [['HITS LANDED', String(s.melee)], ['BUFFETS', String(s.ults)]],""")
rep("  if (p.ch === 'paimei' && p.stanceT > 0) {", "  if (p.ch === 'bey') { const s5 = n5(p); s5.shrug++; if (s5.shrug % 2 === 1) { p.inv = 0.6; popup(p.x + 5, p.y - 12, 'NOT EVEN A SCRATCH.', '#e8a030'); audio.play('clang'); sparks(p.x + 5, p.y + 8, 5, p.face, '#ffffff'); return; } }\n  if (p.ch === 'paimei' && p.stanceT > 0) {")
rep("(P.ch === 'siang' || P.ch === 'sura' || P.ch === 'juk')", "(P.ch === 'siang' || P.ch === 'sura' || P.ch === 'juk' || NEW5.has(P.ch))")
rep("    else if (q.kind === 'shot') { ctx.fillStyle = '#fff2b0'; ctx.fillRect(-3, -1, 6, 2); }", """    else if (q.kind === 'bun') { ctx.rotate(q.t * 10); ctx.fillStyle = '#f8f0e0'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 6.283); ctx.fill(); ctx.fillStyle = '#d8c8a8'; ctx.fillRect(-1, -4, 2, 2); ctx.fillStyle = '#fff'; ctx.fillRect(-2, -2, 2, 1); }
    else if (q.kind === 'mace') { ctx.rotate(q.rot || 0); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-1, -3, 2, 12); ctx.fillStyle = '#d8a830'; ctx.beginPath(); ctx.arc(0, -6, 5, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffe28a'; ctx.fillRect(-1, -12, 2, 3); ctx.fillRect(-9, -7, 3, 2); ctx.fillRect(6, -7, 3, 2); }
    else if (q.kind === 'shot') { ctx.fillStyle = '#fff2b0'; ctx.fillRect(-3, -1, 6, 2); }""")
# hero select 2.0
rep("\nfunction spawnDovesUI(x, y) {", "\n" + sel2_js + "\nfunction spawnDovesUI(x, y) {")
rep("function drawSelect() {\n  ctx.fillStyle = 'rgba(8,2,12,0.76)'", "function drawSelectOld() {\n  ctx.fillStyle = 'rgba(8,2,12,0.76)'")
rep("function cardRect(i) { const c = i % CARD.cols,", "function cardRectOld(i) { const c = i % CARD.cols,")
rep("function cardAt(mx, my) { for (let i = 0; i < CHAR_KEYS.length; i++) { const R = cardRect(i);", "function cardAtOld(mx, my) { for (let i = 0; i < CHAR_KEYS.length; i++) { const R = cardRectOld(i);")
rep("  G.mode = 'select'; G.sel = CHAR_KEYS.indexOf(CHOSEN); G.selT = 0;", "  G.mode = 'select'; G.sel = CHAR_KEYS.indexOf(CHOSEN); G.selT = 0; G.selOff = 0;")

# ======================= v28: Uncle/Auntie names, hidden Thai labels, Indic-script lines =======================
import json as _json, base64 as _b64, sys as _sys
_sys.path.insert(0, ROOT + '/tools'); from native_names import NATIVE as _NAT
_nat_js = _json.dumps({k: [{'deva': 'deva', 'taml': 'taml', 'telu': 'telu'}[v[0]], v[1], v[2]] for k, v in _NAT.items()}, ensure_ascii=False)
_art = {k: _b64.b64encode(open(ROOT + '/art/poster_%s.jpg' % k, 'rb').read()).decode() for k in ('vijay', 'zhang', 'ram', 'furie', 'silat', 'hongbao', 'bey', 'gada', 'eagle', 'sombat', 'sorapong', 'siang', 'phiphop', 'kham', 'juk', 'singham', 'srk', 'aamir')}
names28_js = open(ROOT + '/modules/names28.js').read().replace('/*NATIVE_JSON*/', _nat_js).replace('/*ART_JSON*/', _json.dumps(_art))
rep("\nfunction spawnDovesUI(x, y) {", "\n" + names28_js + "\nfunction spawnDovesUI(x, y) {")
_css = ''.join('@font-face{font-family:"NOC-%s";font-weight:700;src:url(data:font/woff;base64,%s) format("woff");}' % (sc, _b64.b64encode(open(ROOT + '/assets/noc-%s.woff' % sc, 'rb').read()).decode()) for sc in ('deva', 'taml', 'telu'))
rep("</head>", "<style>" + _css + "</style>\n</head>")
s = s.replace(' (แนวล้อ)', '')            # the parody tag is gone everywhere (Thai labels are hidden in-game anyway)

# ======================= v29: input pressed during hit-stop is no longer swallowed =======================
# step() returns early while G.hitstop > 0, but the frame loop cleared the one-shot input table (G.pin) after every step, so a K/J/jump press that
# landed inside a 10-140 ms freeze was silently dropped (root cause of the flaky "hongbao K reacts" test; real for players too). Keep it until a real step ran.
rep("while (acc >= STEP && n < 24) { step(STEP, G.pin); G.pin = {}; acc -= STEP; n++; }",
    "while (acc >= STEP && n < 24) { const frozen = G.hitstop > 0; step(STEP, G.pin); if (!frozen) G.pin = {}; acc -= STEP; n++; }")

# ======================= v29: help bar re-appears after a stunt-double swap (known issue from HANDOFF_v26 s9.5) =======================
# The control-hint bar was shown while G.time < 14 only, so a hero swap later in the run left the new hero with no hint.
rep("  if (G.time < 14 && G.mode === 'play' && !G.cine) { ctx.globalAlpha = clamp((14 - G.time) / 3, 0, 1);",
    "  if (helpAge() < 14 && G.mode === 'play' && !G.cine) { ctx.globalAlpha = clamp((14 - helpAge()) / 3, 0, 1);")
rep("function swapHero(k, c) {\n  const p = G.player; if (!p || p.dead || G.mode !== 'play' || G.cine) return;\n  G.actor = k;",
    "const helpAge = () => G.time - (G.helpT0 || 0);        // seconds since the control hints were last (re)started: run start or a stunt-double swap\nfunction swapHero(k, c) {\n  const p = G.player; if (!p || p.dead || G.mode !== 'play' || G.cine) return;\n  G.actor = k; G.helpT0 = G.time;")

open(OUT, 'w').write(s)
print('v21 written', len(s))
