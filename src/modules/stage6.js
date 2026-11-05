// =====================================================================
// v25 — STAGE 06: HAUNTED HILLS, 1985 — a Hong Kong ghost-comedy night.
// Bamboo forest in fog → the corpse procession on the road → the roadside inn full of coffins → the temple courtyard.
// Jiangshi hop and hunt by BREATH: crouch (hold S) to hold your breath and they lose you. Hit one enough and a
// talisman sticks to its forehead. Folklore elements only — no film names, characters or likenesses.
// =====================================================================
const S6 = { W: 300, road: 100, inn0: 150, inn1: 250, gate: 252, trig: 257, boss: 284 };
const LOCKS6 = [
  { x0: 58, x1: 92, trig: 66, waves: [
    [['jiangshi', 88], ['jiangshi', 62], ['ghost', 80]],
    [['jiangshi', 90], ['jiangshi', 60], ['jiangshi', 76], ['knife', 84]]
  ] },
  { x0: 186, x1: 226, trig: 194, waves: [                     // THE INN: the coffins were not empty
    [['jiangshi', 222], ['jiangshi', 190], ['ghost', 206]],
    [['jiangshi', 224], ['jiangshi', 188], ['jiangshi', 214], ['ghost', 200]],
    [['jiangshi', 220], ['jiangshi', 192], ['knife', 206], ['ghost', 218]]
  ] }
];
const S6IMG = {};
(() => { for (const [k, src] of [['forest', typeof S6_FOREST_SRC !== 'undefined' && S6_FOREST_SRC], ['inn', typeof S6_INN_SRC !== 'undefined' && S6_INN_SRC]]) if (src) { const im = new Image(); im.onload = () => { S6IMG[k] = im; }; im.src = src; } })();
function buildStage6(E, set, fill, en, br, cp, hint) {
  LOCKS = LOCKS6; S6.coffins = []; S6.proc = null; S6.procDone = false; S6.arena = 'idle'; S6.wisps = []; S6.lanterns = [];
  fill(0, LW - 1, 18, LH - 1, T.G);
  fill(0, 1, 0, 17, T.S); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  // ---------- A. THE BAMBOO FOREST ----------
  hint(4, 11, 'THE NEW TERRITORIES, 1985.  MIDNIGHT.  DO NOT BREATHE.');
  hint(14, 8, 'HOLD S (CROUCH) = HOLD YOUR BREATH.  JIANGSHI FIND YOU BY YOUR BREATH.');
  fill(20, 24, 15, 15, T.P); fill(30, 35, 14, 14, T.P); fill(40, 43, 16, 17, T.B); fill(46, 51, 13, 13, T.P);
  en('jiangshi', 18, 18); en('jiangshi', 27, 18); en('ghost', 34, 12); en('jiangshi', 38, 18); en('knife', 49, 13);
  cp(36);
  hint(44, 6, 'HIT A JIANGSHI ENOUGH AND A TALISMAN STICKS TO ITS FOREHEAD.');
  fill(62, 67, 14, 14, T.P); fill(72, 77, 12, 12, T.P); fill(82, 87, 14, 14, T.P); fill(69, 70, 17, 17, T.B);
  br(64, 18); br(80, 18);
  cp(96);
  // ---------- B. THE ROAD: the corpse procession ----------
  hint(102, 9, '人行避讓 — THE LIVING STEP ASIDE.  (OR HOLD YOUR BREATH AND LET THEM PASS.)');
  fill(110, 114, 15, 15, T.P); fill(124, 128, 15, 15, T.P); fill(136, 141, 13, 13, T.P);
  en('ghost', 132, 10); en('jiangshi', 146, 18);
  // ---------- C. THE INN ----------
  cp(150);
  hint(152, 9, 'THE INN.  "WHATEVER YOU HEAR TONIGHT — DO NOT OPEN THE COFFINS."');
  fill(S6.inn0, S6.inn1, 0, 3, T.S);                                                   // the inn's roof beams
  fill(S6.inn0, S6.inn0, 4, 11, T.B);
  fill(156, 158, 15, 15, T.P); fill(160, 184, 13, 13, T.P); fill(188, 190, 15, 15, T.P); fill(194, 220, 12, 12, T.P); fill(224, 226, 15, 15, T.P); fill(230, 246, 13, 13, T.P);
  for (const c of [164, 172, 198, 210, 234, 240]) { fill(c, c + 2, 17, 17, T.C); S6.coffins.push({ x: c, y: 17, open: false }); }
  en('jiangshi', 168, 13); en('ghost', 180, 9); en('jiangshi', 236, 13); en('knife', 244, 18); en('ghost', 214, 8);
  br(186, 18); br(228, 18);
  cp(248);
  // ---------- D. THE TEMPLE COURTYARD (boss) ----------
  fill(266, 270, 15, 15, T.P); fill(276, 280, 15, 15, T.P);
  fill(296, 297, 0, 17, T.D);
  hint(254, 7, 'THE TEMPLE.  SOMETHING BIG IS STILL WEARING ITS HAT.');
  E.start = { x: 4 * TS, y: 18 * TS - PC.standH };
  E.flag = { x: 292 * TS, y: 18 * TS };
  for (let i = 0; i < 26; i++) S6.wisps.push({ x: rnd(0, LW * TS), y: rnd(4 * TS, 16 * TS), ph: rnd(0, 6) });
  return E;
}
const s6zone = tx => tx < S6.road ? 'forest' : tx < S6.inn0 ? 'road' : tx <= S6.inn1 ? 'inn' : 'temple';
// ---------------- breath ----------------
function holdingBreath(p) { return !p.dead && p.onGround && held('down') && Math.abs(p.vx) < 40; }
function updStage6(dt) {
  if (STAGE !== 6) return;
  const p = G.player;
  if (p.breath === undefined) p.breath = 1;
  const hold = holdingBreath(p);
  if (hold) {
    if (!p.holding) { p.holding = true; if (!S6.toldHold) { S6.toldHold = true; popup(p.x + 5, p.y - 20, '*HOLDS BREATH*', '#9ae8ff'); } }
    p.breath -= dt / 4.0;
    if (p.breath <= 0) {                                                                   // you can't hold it forever
      p.breath = 0; p.gaspT = 1.2; p.holding = false;
      popup(p.x + 5, p.y - 22, 'GASP!!', '#ff5a3a', true); audio.play('warn'); shake(0.15);
      for (const e of G.enemies) if (!e.dead && (e.type === 'jiangshi') && Math.abs(e.x - p.x) < 220) { e.state = 'hunt'; e.alertT = 0.5; e.alertK = '!!'; e.cd = 0; }
    }
  } else { p.holding = false; p.breath = Math.min(1, p.breath + dt / 2.2); }
  if (p.gaspT > 0) p.gaspT -= dt;
  // coffins that get broken open let their tenant out
  for (const c of S6.coffins) if (!c.open && tileAt(c.x + 1, c.y) !== T.C) {
    c.open = true; for (let k = 0; k < 3; k++) if (tileAt(c.x + k, c.y) === T.C) setTile(c.x + k, c.y, T.E);
    const e = mkEnemy('jiangshi', c.x + 1, c.y + 1); e.vy = -380; e.state = 'hunt'; e.rise = 0.6; G.enemies.push(e);
    popup((c.x + 1.5) * TS, c.y * TS - 10, ['IT WAS NOT EMPTY.', 'OCCUPIED.', 'GOOD EVENING.'][(Math.random() * 3) | 0], '#9affc8', true); audio.play('crate'); fogPuff((c.x + 1.5) * TS, c.y * TS + 8, 10);
  }
  // the corpse procession: a priest with a bell leads six hopping corpses across the road
  if (!S6.proc && !S6.procDone && p.x > 104 * TS) startProcession();
  if (S6.proc) updProcession(dt);
  // the temple: the General
  if (S6.arena === 'idle' && p.x > S6.trig * TS && !p.dead) {
    S6.arena = 'fight'; for (let ty = 8; ty <= 17; ty++) setTile(S6.gate, ty, T.S);
    dust(S6.gate * TS + 8, 18 * TS, 10, 8); audio.play('clang'); shake(0.3);
    G.cam.lock = { x0: S6.gate * TS, x1: 298 * TS };
    later(0.8, spawnGeneral);
  }
  for (const w of S6.wisps) { w.ph += dt; w.x += Math.sin(w.ph * 0.7) * 8 * dt; w.y += Math.cos(w.ph) * 6 * dt; }
}
function fogPuff(x, y, n) { for (let k = 0; k < n; k++) part('smoke', x + rnd(-14, 14), y + rnd(-6, 6), rnd(-50, 50), rnd(-40, -5), rnd(0.8, 1.4), 5, '#b8e8d8', { grow: 10, a: 0.35 }); }
function startProcession() {
  const x0 = (S6.road + 40) * TS;
  S6.proc = { priest: { x: x0, y: 18 * TS }, t: 0, bellT: 0, woke: false, corpses: [] };
  for (let k = 0; k < 6; k++) { const e = mkEnemy('jiangshi', S6.road + 43 + k * 2.2, 18); e.proc = true; e.state = 'proc'; e.face = -1; e.hopT = k * 0.12; G.enemies.push(e); S6.proc.corpses.push(e); }
  popup(G.player.x + 20, G.player.y - 30, 'A BELL IN THE FOG...', '#9affc8', true);
}
function updProcession(dt) {
  const P = S6.proc, p = G.player; P.t += dt; P.bellT -= dt;
  if (!P.woke) {
    P.priest.x -= 62 * dt;
    if (P.bellT <= 0) { P.bellT = 0.8; audio.play('clang'); popup(P.priest.x + 4, P.priest.y - 34, '叮', '#ffd23f'); }
    const near = P.corpses.some(e => !e.dead && Math.abs(e.x - p.x) < 34 && Math.abs(e.y - p.y) < 30);
    const hit = P.corpses.some(e => e.dead || e.hp < e.maxHp);
    if (hit || (near && !holdingBreath(p))) {                                          // you breathed on them. or hit them.
      P.woke = true; popup(P.priest.x + 4, P.priest.y - 40, '"YOU BREATHED!  RUN!"', '#ffffff', true); audio.play('warn');
      for (const e of P.corpses) if (!e.dead) { e.proc = false; e.state = 'hunt'; e.alertT = 0.5; e.alertK = '!!'; }
    } else if (near && !P.toldPass) { P.toldPass = true; popup(p.x + 5, p.y - 24, '*THEY HOP RIGHT PAST*', '#9ae8ff', true); }
    if (P.priest.x < (S6.road - 6) * TS) { for (const e of P.corpses) if (!e.dead) { e.dead = true; e.deadT = 99; } S6.proc = null; S6.procDone = true; G.stats.passed = 1; }
  } else { P.priest.x += 140 * dt; if (P.priest.x > G.cam.x + VW + 60) { S6.proc = null; S6.procDone = true; } }
}
// ---------------- JIANGSHI: hops with arms out, hunts by breath, gets talismans stuck on it ----------------
function updJiangshi(e, dt) {
  const p = G.player, dx = p.x + p.w / 2 - (e.x + e.w / 2), ad = Math.abs(dx), dy = Math.abs((p.y + p.h) - (e.y + e.h));
  e.t -= dt; e.cd -= dt; e.hopT = (e.hopT || 0) - dt;
  if (e.tali > 0) { e.tali -= dt; e.vx = approach(e.vx, 0, 900 * dt); if (e.tali <= 0) popup(e.x + 5, e.y - 8, 'IT PEELS OFF...', '#ffd23f'); return; }
  if (e.rise > 0) { e.rise -= dt; return; }
  if (e.state === 'proc') {                                                           // in the procession: hop left in line, eyes shut
    e.face = -1; if (e.onGround && e.hopT <= 0) { e.vy = -170; e.vx = -64; e.hopT = 0.5; } else if (e.onGround) e.vx = 0; return;
  }
  const breathing = !holdingBreath(p) || p.gaspT > 0, smell = !p.dead && breathing && ad < 190 && dy < 90;
  if (smell) { if (e.state !== 'hunt') { e.state = 'hunt'; e.alertT = 0.5; e.alertK = '!'; } e.lost = 0; }
  else if (e.state === 'hunt' && !breathing && ad < 220) {                            // you're holding your breath: it loses you
    e.lost = (e.lost || 0) + dt; if (!e.sniffed && ad < 40) { e.sniffed = true; popup(e.x + 5, e.y - 12, '*SNIFF SNIFF*', '#9affc8'); }
    if (e.lost > 0.35) { e.state = 'lost'; e.alertT = 0.6; e.alertK = '?'; e.patrolDir = Math.random() < 0.5 ? -1 : 1; }
  }
  if (e.state === 'hunt') {
    e.face = sign(dx) || e.face;
    if (e.onGround && e.hopT <= 0) { const big = ad < 70 && e.cd <= 0; e.vy = big ? -360 : -260; e.vx = e.face * (big ? 170 : 95); e.hopT = big ? 0.9 : 0.42; if (big) { e.cd = rnd(1.4, 2.2); audio.play('whoosh'); } }
    else if (e.onGround) e.vx = approach(e.vx, 0, 900 * dt);
    if (!p.dead && overlap(e, p)) hurtPlayer(1, e.x + e.w / 2, true);
  } else {
    if (e.onGround && e.hopT <= 0) { e.vy = -150; e.vx = e.patrolDir * 30; e.hopT = rnd(0.7, 1.2); e.face = e.patrolDir; if (Math.random() < 0.25) e.patrolDir *= -1; }
    else if (e.onGround) e.vx = 0;
    if (e.hitWall) e.patrolDir *= -1;
  }
}
function jiangshiHit(e) {                     // every third hit sticks a talisman on its forehead: frozen for a while
  if (STAGE !== 6 || e.type !== 'jiangshi' || e.dead) return;
  e.hits = (e.hits || 0) + 1;
  if (e.hits % 3 === 0 && !(e.tali > 0)) { e.tali = 3.2; e.vx = 0; popup(e.x + 5, e.y - 14, 'TALISMAN!', '#ffd23f'); audio.play('tile'); }
}
// ---------------- GHOST: a floating lady in white; drifts through walls, lunges with her hair ----------------
function updGhost(e, dt) {
  const p = G.player, cx = e.x + e.w / 2, cy = e.y + e.h / 2, tx = p.x + p.w / 2, ty = p.y + 4;
  e.t -= dt; e.cd -= dt; e.anim += dt; e.flash -= dt;
  if (!e.hx) { e.hx = e.x; e.hy = e.y; }
  const seen = !p.dead && Math.abs(tx - cx) < 230 && Math.abs(ty - cy) < 150;
  if (e.state === 'lunge') {
    e.x += e.vx * dt; e.y += e.vy * dt; if (!p.dead && overlap(e, p)) { hurtPlayer(1, cx, true); e.state = 'drift'; e.cd = 1.6; }
    if (e.t <= 0) { e.state = 'drift'; e.cd = rnd(1.4, 2.4); }
  } else if (seen) {
    e.face = sign(tx - cx) || e.face;
    const gx = tx - e.face * 60, gy = ty - 30 + Math.sin(e.anim * 1.7) * 14;
    e.x += clamp(gx - cx, -60, 60) * dt * 1.2; e.y += clamp(gy - cy, -50, 50) * dt * 1.2;
    if (e.cd <= 0 && Math.abs(tx - cx) < 110) { e.state = 'lunge'; e.t = 0.45; const d = Math.hypot(tx - cx, ty - cy) || 1; e.vx = (tx - cx) / d * 260; e.vy = (ty - cy) / d * 260; e.alertT = 0.3; e.alertK = '!'; audio.play('whoosh'); popup(cx, e.y - 8, '"WHY... DID YOU... COME..."', '#e8f0ff'); }
  } else { e.x = e.hx + Math.sin(e.anim * 0.6) * 30; e.y = e.hy + Math.sin(e.anim * 1.3) * 8; }
  e.vy = 0; e.onGround = false;
}
function drawJiangshi(e) {
  const hop = !e.onGround, F = (a) => a, t = G.clock;
  const robe = '#3a50a8', trim = '#e8c050', skin = '#cde8d4';
  if (e.dead) { px(-4, -18, 8, 14, robe); px(-3, -22, 6, 4, skin); return; }
  px(-4, -3, 3, 3, '#141018'); px(1, -3, 3, 3, '#141018');                       // feet together (they hop)
  px(-5, -16, 10, 13, robe); px(-5, -16, 10, 1, trim); px(-5, -5, 10, 2, trim); px(-1, -15, 2, 10, '#1a2448');
  px(-2, -14, 4, 4, trim); px(-1, -13, 2, 2, '#c83a3a');                           // the mandarin square
  px(2, -15, 9, 3, robe); px(10, -15, 3, 3, skin); px(11, -12, 1, 1, '#2a3a2a');   // arms stretched straight out
  px(-3, -22, 6, 6, skin); px(-2, -20, 1, 1, '#141414'); px(1, -20, 1, 1, '#141414'); px(-2, -17, 4, 1, '#5a6a5a');
  px(-5, -25, 10, 3, '#1a1a1a'); px(-3, -28, 6, 3, '#1a1a1a'); px(-1, -29, 2, 1, '#c83a3a'); px(-6, -23, 12, 1, '#1a1a1a');   // Qing official's hat
  if (e.tali > 0) { px(-2, -27, 5, 9, '#f0d040'); px(-1, -25, 3, 1, '#c82a2a'); px(0, -24, 1, 4, '#c82a2a'); px(-1, -21, 3, 1, '#c82a2a'); }
  else if (e.state === 'lost') { px(-1, -33, 2, 1, '#9ae8ff'); }
  if (hop && !e.proc) px(-6, -2, 12, 1, 'rgba(0,0,0,0.25)');
}
function drawGhost(e) {
  const t = G.clock + e.x * 0.01, sway = Math.sin(t * 2) * 1.5;
  ctx.globalAlpha *= e.dead ? 0.5 : 0.82 + Math.sin(t * 7) * 0.08;
  for (let k = 0; k < 4; k++) px(-6 + k * 3 + sway, -4 + (k % 2) * 2, 3, 4, '#e8f0f4');                 // trailing hem, no feet
  px(-6, -18, 12, 15, '#e8f0f4'); px(-6, -18, 2, 15, '#c8d8e0'); px(-1, -16, 2, 10, '#d8e4ea');
  px(-4, -24, 8, 7, '#f4f8fa'); px(-1, -21, 2, 1, '#2a2a3a');
  px(-6, -26, 12, 3, '#0a0a10'); px(-6, -24, 3, 16, '#0a0a10'); px(3 + sway * 0.5, -24, 3, 18, '#0a0a10'); px(-2, -24, 4, 2, '#0a0a10');   // long black hair over the face
  if (e.state === 'lunge') { px(5, -22, 14, 2, '#0a0a10'); px(16, -24, 4, 6, '#0a0a10'); }
  ctx.globalAlpha = 1;
}
// ---------------- THE GENERAL: a giant jiangshi in a general's robes ----------------
function spawnGeneral() {
  G.boss = { type: 'general', name: 'THE GENERAL', x: S6.boss * TS, y: 10 * TS, w: 22, h: 40, vx: 0, vy: 0, hp: 170, maxHp: 170, face: -1,
    state: 'enter', t: 1.4, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, shown: 0, cd: 0, dazeT: 0 };
  G.banner = { t: 0, title: 'THE GENERAL', sub: '殭屍將軍  —  "...HNNNGH."' };
  audio.play('roar'); fogPuff(S6.boss * TS + 10, 17 * TS, 20); shake(0.4);
}
function updGeneral(b, dt) {
  const p = G.player, dx = p.x + p.w / 2 - (b.x + b.w / 2), ad = Math.abs(dx);
  b.flash -= dt; b.anim += dt; b.t -= dt; b.cd -= dt;
  b.vy = Math.min(b.vy + 1500 * dt, 800);
  const wasG = b.onGround; moveBody(b, dt);
  if (b.state === 'enter') { if (b.onGround && !wasG) { shake(0.5); audio.play('slam'); dust(b.x + 11, b.y + b.h, 14, 10); } if (b.t <= 0 && b.onGround) { b.state = 'idle'; b.t = 0.8; } return; }
  if (b.dying > 0) {
    b.dying -= dt; b.vx = 0;
    if (Math.random() < dt * 14) fogPuff(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 2);
    if (Math.random() < dt * 8) explode(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 20, 0, { noDmg: true, quiet: true });
    if (b.dying <= 0) {
      b.dead = true; explode(b.x + b.w / 2, b.y + b.h / 2, 60, 30, { byPlayer: true }); fogPuff(b.x + 11, b.y + 20, 30);
      for (let ty = 0; ty <= 17; ty++) for (const tx of [296, 297]) if (tileAt(tx, ty) === T.D) setTile(tx, ty, T.E);
      G.exitOpen = true; G.cam.lock = null; popup(b.x, 9 * TS, 'THE GENERAL RESTS IN PEACE. FINALLY.', '#ffd23f', true);
      for (const e of G.enemies) if (!e.dead && (e.type === 'jiangshi' || e.type === 'ghost')) { e.hp = 0; killEnemy(e, 1, true); }
    }
    return;
  }
  if (b.hp < b.maxHp * 0.5 && b.phase === 1) { b.phase = 2; popup(b.x + 11, b.y - 12, '"...HNNNNNGH!!"', '#9affc8', true); audio.play('roar'); }
  const fast = b.phase === 2 ? 0.7 : 1, breathing = !holdingBreath(p) || p.gaspT > 0;
  if (b.dazeT > 0) { b.dazeT -= dt; b.vx = approach(b.vx, 0, 900 * dt); return; }
  if (!p.dead && overlap(b, p)) hurtPlayer(1, b.x + b.w / 2, true);
  switch (b.state) {
    case 'idle':
      b.vx = approach(b.vx, 0, 900 * dt);
      if (b.t <= 0 && b.onGround) {
        if (!breathing) { b.state = 'sniff'; b.t = 1.3; popup(b.x + 11, b.y - 10, '*SNIFF... SNIFF...*', '#9affc8'); break; }
        const k = ['hop', 'hop', 'leap', 'summon'][b.atk++ % 4];
        b.face = sign(dx) || b.face;
        if (k === 'hop') { b.state = 'hops'; b.n = b.phase === 2 ? 4 : 3; b.t = 0; }
        else if (k === 'leap') { b.state = 'leap_tele'; b.t = 0.7 * fast; b.tx = p.x + p.w / 2; audio.play('warn'); }
        else { b.state = 'summon'; b.t = 0.9; popup(b.x + 11, b.y - 12, '"RISE..."', '#9affc8', true); }
      }
      break;
    case 'sniff':                                                   // you held your breath: he hops to the wrong place
      b.vx = approach(b.vx, 0, 900 * dt);
      if (b.t <= 0) { b.state = 'hops'; b.n = 1; b.t = 0; b.face = Math.random() < 0.5 ? -1 : 1; b.lostHop = true; }
      break;
    case 'hops':
      if (b.onGround && b.t <= 0) {
        if (b.n-- <= 0) { b.state = 'idle'; b.t = 1.0 * fast; b.lostHop = false; break; }
        if (!b.lostHop) b.face = sign(dx) || b.face;
        b.vy = -420; b.vx = b.face * 130; b.t = 0.15; b.landSlam = true;
      }
      if (b.onGround && b.landSlam && b.vy >= 0 && !wasG) { b.landSlam = false; shake(0.25); audio.play('slam'); dust(b.x + 11, b.y + b.h, 10, 8); slamWave(b, 60); b.t = 0.28 * fast; }
      break;
    case 'leap_tele': b.vx = 0; if (b.t <= 0) { b.state = 'leap'; b.vy = -620; b.vx = clamp((b.tx - (b.x + b.w / 2)) * 1.25, -320, 320); b.landSlam = true; audio.play('whoosh'); } break;
    case 'leap':
      if (b.onGround && b.landSlam && !wasG) { b.landSlam = false; shake(0.6); audio.play('slam'); dust(b.x + 11, b.y + b.h, 20, 12); slamWave(b, 110); b.dazeT = 1.3 * (b.phase === 2 ? 0.8 : 1); b.state = 'idle'; b.t = 0.6; popup(b.x + 11, b.y - 10, 'DAZED — HIT HIM!', '#ffd23f'); }
      break;
    case 'summon':
      b.vx = 0;
      if (b.t <= 0) { for (const off of [-5, 5]) { const tx = clamp(Math.floor((b.x + b.w / 2) / TS) + off, S6.gate + 2, 294); dropIn('jiangshi', tx); } if (b.phase === 2) dropIn('ghost', S6.gate + 6); b.state = 'idle'; b.t = 1.2 * fast; }
      break;
  }
}
function slamWave(b, r) {
  const p = G.player, cx = b.x + b.w / 2;
  if (!p.dead && p.onGround && Math.abs(p.x + p.w / 2 - cx) < r && Math.abs((p.y + p.h) - (b.y + b.h)) < 20) hurtPlayer(1, cx, true);
  for (let k = 0; k < 10; k++) part('debris', cx + rnd(-r, r), b.y + b.h - 2, rnd(-60, 60), rnd(-160, -60), 0.6, 2, '#5a5a4a', { g: 900 });
}
function drawGeneral(b) {
  const fx = Math.round(b.x + b.w / 2), fy = Math.round(b.y + b.h);
  ctx.save(); ctx.translate(fx, fy);
  if (b.dying > 0) { ctx.globalAlpha = 0.4 + 0.6 * (b.dying / 2); ctx.rotate(-(1 - b.dying / 2) * 0.3); }
  ctx.scale(b.face || 1, 1);
  FLASH = b.flash > 0 && Math.floor(b.anim * 30) % 3 === 0;
  const robe = '#5a1a2a', gold = '#d8b040', skin = '#a8c8b0', armor = '#3a3a4a';
  px(-9, -6, 7, 6, '#141018'); px(2, -6, 7, 6, '#141018');
  px(-11, -30, 22, 25, robe); px(-11, -30, 22, 2, gold); px(-11, -8, 22, 3, gold);
  for (let k = 0; k < 4; k++) px(-10 + k * 5, -26, 4, 16, armor); px(-10, -26, 20, 1, gold);         // lamellar armour plates
  px(-4, -22, 8, 8, gold); px(-2, -20, 4, 4, '#c82a2a');
  const arm = b.state === 'summon' ? -12 : 0;
  px(4, -28 + arm, 18, 5, robe); px(21, -28 + arm, 5, 5, skin); px(23, -23 + arm, 1, 2, '#2a3a2a'); px(25, -24 + arm, 1, 2, '#2a3a2a');
  px(-6, -40, 12, 10, skin); px(-4, -36, 2, 2, b.dazeT > 0 ? '#ffd23f' : '#c82a2a'); px(2, -36, 2, 2, b.dazeT > 0 ? '#ffd23f' : '#c82a2a'); px(-3, -32, 6, 1, '#3a4a3a'); px(-2, -31, 1, 2, '#f0f0f0'); px(2, -31, 1, 2, '#f0f0f0');
  px(-9, -44, 18, 4, '#1a1a1a'); px(-6, -50, 12, 6, '#1a1a1a'); px(-1, -54, 2, 4, gold); px(-1, -56, 2, 2, '#c82a2a');   // the hat
  px(-2, -50, 5, 12, '#f0d040'); px(-1, -48, 3, 1, '#c82a2a'); px(0, -47, 1, 6, '#c82a2a');                              // an old talisman, mostly peeled
  if (b.dazeT > 0) for (let k = 0; k < 3; k++) { const a = G.clock * 6 + k * 2.1; px(Math.cos(a) * 10 - 1, -58 + Math.sin(a) * 3, 2, 2, '#ffd23f'); }
  if (b.state === 'leap_tele') px(-12, -2, 24, 2, Math.floor(G.clock * 16) % 2 ? '#ff3a2a' : '#ffd23f');
  FLASH = false; ctx.restore();
  if (b.state === 'leap_tele' && b.tx) { ctx.strokeStyle = Math.floor(G.clock * 14) % 2 ? '#ff3a2a' : '#ffd23f'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(b.tx, 18 * TS - 1, 22, 4, 0, 0, 6.283); ctx.stroke(); }
}
// ---------------- the playfield skin: mossy stone in the forest, floorboards in the inn, coffins ----------------
function skin6(g, t, tx, ty, x, y, i) {
  const z = s6zone(tx);
  if (t === T.C) {                                                // a lacquered coffin, three tiles long, talisman on the lid
    const c = (S6.coffins || []).find(c => ty === c.y && tx >= c.x && tx <= c.x + 2); if (!c) return false;
    const k = tx - c.x;
    g.fillStyle = '#3a0e12'; g.fillRect(x, y + 3, TS, 13); g.fillStyle = '#6a1a20'; g.fillRect(x, y + 3, TS, 4); g.fillStyle = '#8a2a2a'; g.fillRect(x, y + 3, TS, 1);
    g.fillStyle = '#c8a040'; g.fillRect(x, y + 7, TS, 0.8);
    if (k === 0) { g.fillStyle = '#4a1218'; g.fillRect(x, y + 1, 4, 15); g.fillStyle = '#c8a040'; g.fillRect(x + 1, y + 8, 2, 2); }
    if (k === 2) { g.fillStyle = '#4a1218'; g.fillRect(x + 12, y + 2, 4, 14); }
    if (k === 1) { g.fillStyle = '#f0d040'; g.fillRect(x + 5, y + 1, 6, 10); g.fillStyle = '#c82a2a'; g.fillRect(x + 6, y + 3, 4, 0.8); g.fillRect(x + 7.5, y + 4, 0.8, 5); g.fillRect(x + 6, y + 8, 4, 0.8); }
    g.fillStyle = '#2a1a10'; if (k !== 1) g.fillRect(x + 6, y + 14, 2, 2);
    return true;
  }
  if (t === T.P) {
    if (z === 'inn') { g.fillStyle = '#5a3420'; g.fillRect(x, y, TS, 4); g.fillStyle = '#8a5a34'; g.fillRect(x, y, TS, 1); g.fillStyle = '#3a2214'; for (let k = 2; k < TS; k += 5) g.fillRect(x + k, y + 4, 1.5, 6); g.fillRect(x, y + 9, TS, 1); return true; }
    g.fillStyle = '#5a6a5a'; g.fillRect(x, y, TS, 5); g.fillStyle = '#7a8a72'; g.fillRect(x, y, TS, 1.5); g.fillStyle = '#3a6a3a'; g.fillRect(x + ((tx * 5) % 10), y - 1, 4, 1.5);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(x + ((tx * 7) % 13), y + 1.5, 0.7, 3.5); g.fillRect(x, y + 4.5, TS, 0.6); return true;
  }
  if ((t === T.G || t === T.H) && ty === 18 && tileAt(tx, ty - 1) !== T.G) {
    const dmg = thp[i] < HPS[t];
    if (z === 'inn') { g.fillStyle = '#4a2c1c'; g.fillRect(x, y, TS, TS); g.fillStyle = '#6a4228'; g.fillRect(x, y, TS, 1.5); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(x + ((tx % 3) * 5), y + 1.5, 0.7, 14); g.fillRect(x, y + 8, TS, 0.6); }
    else {
      g.fillStyle = '#3a4038'; g.fillRect(x, y, TS, TS); g.fillStyle = '#5a6458'; g.fillRect(x + 1, y + 1, 7, 5); g.fillRect(x + 9, y + 2, 6, 4); g.fillStyle = '#4a5448'; g.fillRect(x + 2, y + 7, 12, 4);
      g.fillStyle = '#3a6a34'; g.fillRect(x + ((tx * 3) % 11), y - 0.5, 5, 1.5); g.fillRect(x + ((tx * 7) % 13), y, 2, 1);
    }
    if (dmg) { g.fillStyle = 'rgba(10,10,6,0.75)'; g.fillRect(x + 3, y + 4, 5, 1); g.fillRect(x + 7, y + 5, 1, 4); }
    return true;
  }
  if (t === T.B) { g.fillStyle = '#4a4a50'; g.fillRect(x, y, TS, TS); g.fillStyle = '#5a5a62'; g.fillRect(x + 1, y + 1, 6, 6); g.fillRect(x + 9, y + 1, 6, 6); g.fillRect(x + 4, y + 9, 8, 6); g.fillStyle = '#3a6a3a'; g.fillRect(x + ((tx * 5) % 9), y, 4, 1.5); return true; }
  return false;
}
// ---------------- world space behind the tiles: bamboo, stone lanterns, graves, the inn's pillars, the procession ----------------
function drawStage6Mid(cam) {
  const t = G.clock, L = cam.x - 40, R = cam.x + VW + 40, gy = 18 * TS;
  for (let c = 2; c < S6.inn0 - 2; c += 3) {                                        // bamboo stalks in front of the painting
    const x = c * TS + ((c * 37) % 20); if (x < L || x > R) continue;
    const h = 120 + ((c * 53) % 90), sw = Math.sin(t * 0.8 + c) * 2;
    ctx.fillStyle = c % 2 ? '#1e3a2a' : '#26442e'; ctx.fillRect(x + sw * 0.5, gy - h, 4, h);
    ctx.fillStyle = '#12261a'; for (let y = gy - h + 14; y < gy; y += 18) ctx.fillRect(x + sw * 0.5 - 0.5, y, 5, 1.5);
    ctx.fillStyle = '#2e5a36'; for (let k = 0; k < 3; k++) { const ly = gy - h + 6 + k * 22; ctx.beginPath(); ctx.moveTo(x + 2 + sw, ly); ctx.lineTo(x + 16 + sw, ly + 4); ctx.lineTo(x + 2 + sw, ly + 3); ctx.fill(); }
  }
  for (const c of [12, 33, 57, 88, 118, 142, 262, 288]) {                         // stone lanterns with a flame
    const x = c * TS; if (x < L || x > R) continue;
    ctx.fillStyle = '#5a6058'; ctx.fillRect(x - 3, gy - 22, 6, 22); ctx.fillRect(x - 7, gy - 30, 14, 9); ctx.fillRect(x - 9, gy - 33, 18, 3); ctx.fillRect(x - 2, gy - 37, 4, 4);
    ctx.fillStyle = '#ffb040'; ctx.fillRect(x - 2, gy - 28 + Math.sin(t * 9 + c) * 0.5, 4, 4);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.18 + Math.sin(t * 7 + c) * 0.04; ctx.fillStyle = '#ff9a3a'; ctx.beginPath(); ctx.arc(x, gy - 26, 18, 0, 6.283); ctx.fill(); ctx.restore();
  }
  for (const c of [22, 26, 47, 79, 84, 130]) { const x = c * TS; if (x < L || x > R) continue;   // grave mounds with tablets
    ctx.fillStyle = '#3a3e34'; ctx.beginPath(); ctx.arc(x, gy, 14, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#6a6e64'; ctx.fillRect(x - 4, gy - 22, 8, 12); ctx.fillStyle = '#c82a2a'; ctx.fillRect(x - 1, gy - 20, 2, 7); }
  if (S6.road * TS < R && S6.inn0 * TS > L) {                                       // the road sign
    const x = (S6.road + 3) * TS; ctx.fillStyle = '#4a3420'; ctx.fillRect(x, gy - 40, 3, 40); ctx.fillStyle = '#d8c8a0'; ctx.fillRect(x - 14, gy - 42, 32, 12);
    ctx.fillStyle = '#2a1a10'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('人行避讓', x + 2, gy - 36);
  }
  if (S6.inn0 * TS < R && S6.inn1 * TS > L) {                                       // the inn: pillars, a lattice wall, lanterns, a balcony rail
    ctx.fillStyle = 'rgba(30,14,10,0.12)'; ctx.fillRect(S6.inn0 * TS, 4 * TS, (S6.inn1 - S6.inn0) * TS, 14 * TS);
    for (let c = S6.inn0 + 2; c < S6.inn1; c += 10) { const x = c * TS; if (x < L || x > R) continue;
      ctx.fillStyle = '#5a1a14'; ctx.fillRect(x, 4 * TS, 6, 14 * TS); ctx.fillStyle = '#7a2a1e'; ctx.fillRect(x, 4 * TS, 2, 14 * TS);
      ctx.fillStyle = '#3a1a10'; ctx.fillRect(x - 4, 4 * TS, 14, 4);
      const ly = 6 * TS + 4 + Math.sin(t + c) * 1.5; ctx.fillStyle = '#2a1a10'; ctx.fillRect(x + 2, 4 * TS + 4, 1, ly - 4 * TS - 4);
      ctx.fillStyle = '#c82a2a'; ctx.beginPath(); ctx.ellipse(x + 2.5, ly + 6, 6, 7, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.fillRect(x - 0.5, ly + 4, 6, 1);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.16; ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.arc(x + 2.5, ly + 6, 22, 0, 6.283); ctx.fill(); ctx.restore();
    }
    for (const c of S6.coffins || []) { const x = c.x * TS; if (x < L || x > R || c.open) continue; ctx.fillStyle = '#2a1a10'; ctx.fillRect(x + 4, gy - 4, 3, 4); ctx.fillRect(x + 41, gy - 4, 3, 4); }   // trestles
  }
  if (S6.proc) {                                                                      // the priest with the bell and the sign
    const P = S6.proc.priest, x = P.x, y = P.y, w = Math.sin(G.clock * 6) * 2;
    ctx.fillStyle = '#d8c060'; ctx.fillRect(x - 5, y - 18, 10, 14); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x - 3, y - 4, 2, 4); ctx.fillRect(x + 1, y - 4, 2, 4);
    ctx.fillStyle = '#d8a878'; ctx.fillRect(x - 3, y - 23, 6, 5); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x - 4, y - 25, 8, 2);
    ctx.fillStyle = '#4a3420'; ctx.fillRect(x - 9, y - 40, 2, 26); ctx.fillStyle = '#f0e8d0'; ctx.fillRect(x - 15, y - 44, 14, 8); ctx.fillStyle = '#c82a2a'; ctx.fillRect(x - 13, y - 42, 10, 1);
    ctx.fillStyle = '#c8a040'; ctx.fillRect(x + 5 + w, y - 14, 4, 4);
  }
}
function drawStage6Front() {             // screen space: ground fog that rolls in front, ghost lights, a cold vignette
  const c = G.cam, t = G.clock, hor = 18 * TS - c.y;
  for (const w of S6.wisps || []) { const sx = w.x - c.x * 1.1, sy = w.y - c.y; if (sx < -10 || sx > VW + 10) continue; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 + Math.sin(w.ph * 3) * 0.2; ctx.fillStyle = '#7adcff'; ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, 6.283); ctx.fill(); ctx.globalAlpha *= 0.3; ctx.beginPath(); ctx.arc(sx, sy, 7, 0, 6.283); ctx.fill(); ctx.restore(); }
  for (let k = 0; k < 3; k++) {
    const off = (c.x * (1.15 + k * 0.15) + t * (8 + k * 5)) % 320;
    ctx.fillStyle = 'rgba(190,230,220,' + (0.08 + k * 0.03) + ')';
    for (let i = -1; i < VW / 320 + 2; i++) { const x = i * 320 - off; ctx.beginPath(); ctx.ellipse(x + 160, hor - 4 + k * 6, 190, 14 + k * 3, 0, 0, 6.283); ctx.fill(); }
  }
  const p = G.player;
  if (p && !p.dead && p.breath !== undefined && (p.holding || p.breath < 1)) {      // the breath meter, over the hero's head
    const x = p.x + p.w / 2 - c.x, y = p.y - c.y - 14;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x - 13, y, 26, 4); ctx.fillStyle = p.breath > 0.3 ? '#7adcff' : '#ff5a3a'; ctx.fillRect(x - 12, y + 1, 24 * p.breath, 2);
    if (p.holding) { ctx.fillStyle = '#e8f8ff'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText('HOLDING BREATH', x, y - 1); }
  }
  const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, VW * 0.65); vg.addColorStop(0, 'rgba(0,10,20,0)'); vg.addColorStop(1, 'rgba(0,10,20,0.45)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
}
function drawStage6BG(cam) {
  const sky = ctx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, '#06121c'); sky.addColorStop(1, '#1a3a3a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
  const hor = 18 * TS - cam.y, cxT = (cam.x + VW / 2) / TS;
  const zones = [[0, S6IMG.forest], [S6.inn0, S6IMG.inn || S6IMG.forest], [S6.inn1 + 2, S6IMG.forest]];
  const draw = (z, alpha) => {
    const [x0, im] = z; if (!im || alpha <= 0) return;
    const h = VH + 12, w = Math.round(im.width * h / im.height), y = Math.round(hor + 3 - 0.808 * h), off = (cam.x - x0 * TS + VW * 0.15) * 0.22, i0 = Math.floor(off / w);
    ctx.globalAlpha = alpha;
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(im, x, y, w, h); }
    if (y > 0) { ctx.fillStyle = '#06121c'; ctx.fillRect(0, 0, VW, y + 1); }
    ctx.globalAlpha = 1;
  };
  let zi = 0; for (let k = 0; k < zones.length; k++) if (cxT >= zones[k][0]) zi = k;
  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  draw(zones[zi], 1); const nx = zones[zi + 1]; if (nx) { const k = clamp((cxT - (nx[0] - 14)) / 14, 0, 1); if (k > 0 && nx[1] !== zones[zi][1]) draw(nx, k); }
  ctx.imageSmoothingEnabled = pv;
  ctx.fillStyle = 'rgba(0,20,30,0.18)'; ctx.fillRect(0, 0, VW, VH);
}
