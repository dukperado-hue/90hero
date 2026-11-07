// =====================================================================
// v36 — STAGE 07 EXTENDED: after the Truck Baron the road goes on (a tribute to Thai Muay-Thai action cinema).
// THE ELEPHANT VILLAGE (an elephant herd tramples the poachers) -> THE SPIRAL STAIRCASE (one long climb up a restaurant tower,
// fighting on every landing) -> DOWN INTO THE CAVE under the temple: THREE BOSSES BACK TO BACK
// (THE CAPOEIRA SPINNER, THE BONE-BREAKER, THE WHEELCHAIR DON). Invented characters only.
// =====================================================================
const S7X = { from: 412, W: 640, vill: 414, tower0: 486, tower1: 536, shaft: 556, cave0: 560, gate: 580, door: 636, ceil: 18, floor: 28 };
S7.W = S7X.W;
(() => { for (const [k, v] of [['s7eleph', 'S7_ELEPHANT_SRC'], ['s7spiral', 'S7_SPIRAL_SRC'], ['s7cave', 'S7_CAVE_SRC']]) { try { loadBG(k, eval('typeof ' + v + " !== 'undefined' ? " + v + ' : null')); } catch (e) { } } })();
const s7xZone = tx => tx < S7X.vill ? null : tx < S7X.tower0 - 2 ? 'vill' : tx < S7X.tower1 + 2 ? 'tower' : tx < S7X.shaft ? 'street' : 'cave';
LOCKS7.push(
  { x0: 440, x1: 478, trig: 446, waves: [[['soldier', 474], ['knife', 444], ['gunner', 472]], [['heavy', 474], ['knife', 446], ['soldier', 470], ['bomber', 450]]] }
);
function buildStage7X(E, fill) {
  Object.assign(S7X, { open: false, herd: false, tower: 'idle', towerT: 0, trio: 0, trioState: 'idle', trioT: 0 });
  const C = S7X;
  // remove the old end wall; the street continues
  fill(408, 409, 0, 17, T.E); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  fill(C.door, C.door + 1, 0, 17, T.S);
  fill(410, 411, 0, 17, T.S);                                               // a temporary wall: opens when the Baron falls (s7xOpen)
  // ---------- ELEPHANT VILLAGE: stilt houses
  for (const x0 of [420, 436, 452, 468]) { fill(x0, x0 + 8, 13, 13, T.P); fill(x0 + 1, x0 + 7, 9, 9, T.P); addLadder(x0 + 1, 13, 18); addLadder(x0 + 6, 9, 13); }
  for (const x of [424, 440, 458, 472]) E.enemies.push(mkEnemy(x % 3 ? 'soldier' : 'gunner', x, 13));
  for (const x of [430, 448, 466, 480]) E.enemies.push(mkEnemy(x % 2 ? 'knife' : 'soldier', x, 18));
  for (const x of [428, 446, 464]) E.barrels.push(mkBarrel(x, 18));
  E.checkpoints.push({ x: 418 * TS, y: 18 * TS, on: false });
  E.hints.push({ x: 416 * TS, y: 10 * TS, s: 'THE ELEPHANT VILLAGE.  THE POACHERS CAME FOR THE HERD.  THE HERD IS ANGRY.', g: '' });
  // ---------- THE SPIRAL STAIRCASE TOWER
  fill(C.tower0, C.tower0, 1, 14, T.S); fill(C.tower1, C.tower1, 4, 17, T.S); fill(C.tower0, C.tower1, 0, 0, T.S);
  const L = [[15, 'L'], [12, 'R'], [9, 'L'], [6, 'R'], [3, 'L']];
  for (const [row, side] of L) { if (side === 'L') fill(C.tower0 + 1, C.tower0 + 34, row, row, T.P); else fill(C.tower0 + 16, C.tower1 - 1, row, row, T.P); }
  addLadder(C.tower0 + 3, 15, 18); addLadder(C.tower0 + 30, 12, 15); addLadder(C.tower0 + 19, 9, 12); addLadder(C.tower0 + 30, 6, 9); addLadder(C.tower0 + 19, 3, 6);
  addLadder(C.shaft + 1, 18, C.floor);   // down the shaft
  for (const [row, side] of L) for (let k = 0; k < 2; k++) E.enemies.push(mkEnemy(['soldier', 'knife', 'gunner'][(row + k) % 3], side === 'L' ? C.tower0 + 8 + k * 12 : C.tower1 - 6 - k * 10, row));
  E.checkpoints.push({ x: (C.tower0 - 4) * TS, y: 18 * TS, on: false });
  E.hints.push({ x: (C.tower0 - 8) * TS, y: 10 * TS, s: 'THE STAIRCASE.  ONE LONG CLIMB.  NOBODY LEAVES THIS TOWER BY THE STAIRS.', g: '' });
  // ---------- the street, then the shaft down into the cave
  for (const x of [540, 546, 552]) E.enemies.push(mkEnemy('soldier', x, 18)); E.barrels.push(mkBarrel(548, 18));
  E.checkpoints.push({ x: 540 * TS, y: 18 * TS, on: false });
  fill(C.cave0, C.door + 1, C.ceil, C.ceil, T.S);                             // the cave ceiling (the street above)
  fill(C.shaft, C.cave0 - 1, 18, C.floor - 1, T.E);                          // the shaft
  fill(C.shaft, C.door + 1, C.ceil + 1, C.floor - 1, T.E);                   // the cave
  fill(C.shaft, C.door + 1, C.floor, LH - 1, T.G);
  fill(C.door, C.door + 1, C.ceil, C.floor - 1, T.D);                        // the way out (opens after the third boss)
  for (const x of [566, 572]) E.enemies.push(mkEnemy('knife', x, C.floor));
  E.checkpoints.push({ x: (C.cave0 + 4) * TS, y: C.floor * TS, on: false });
  E.hints.push({ x: (C.shaft - 6) * TS, y: 10 * TS, s: 'THE CAVE UNDER THE TEMPLE.  THREE OF THEM ARE WAITING.  ONE AT A TIME.', g: '' });
  E.flag = { x: (C.door - 2) * TS, y: C.floor * TS };
}
function s7xOpen() {                                                        // called when the Truck Baron falls
  S7X.open = true; for (let ty = 0; ty <= 17; ty++) for (const tx of [410, 411]) setTile(tx, ty, T.E);
  shake(0.3); audio.play('clang');
}
function updStage7X(dt) {
  if (STAGE !== 7 || G.mode !== 'play') return;
  const p = G.player, tx = Math.floor((p.x + p.w / 2) / TS);
  if (!S7X.herd && tx > 432) {                                              // the stampede
    S7X.herd = true; G.banner = { t: 0, title: 'STAMPEDE!', sub: 'THE HERD REMEMBERS WHO TOOK THEIR CALF.' }; audio.play('roar'); shake(0.5);
    for (let k = 0; k < 4; k++) later(k * 0.45, () => spawnBeast('elephant', (414 + k * 2) * TS, 1, { y: 18 * TS, life: 5.5, dmg: 6 }));
  }
  if (S7X.tower === 'idle' && tx > S7X.tower0 + 2 && tx < S7X.tower1 && p.y > 12 * TS) {   // the tower: camera follows the climb, more men come down
    S7X.tower = 'climb'; S7X.towerT = 0; G.cam.lock = { x0: (S7X.tower0 - 1) * TS, x1: (S7X.tower1 + 2) * TS }; popup(p.x + 5, p.y - 26, 'CLIMB!', '#ffd23f', true);
  }
  if (S7X.tower === 'climb') {
    S7X.towerT += dt;
    if (S7X.towerT > 4 && G.enemies.filter(e => !e.dead && e.x > S7X.tower0 * TS && e.x < S7X.tower1 * TS).length < 4) { S7X.towerT = 0; const e = mkEnemy(Math.random() < 0.5 ? 'knife' : 'soldier', S7X.tower0 + 6 + ((Math.random() * 24) | 0), 3); e.alerted = true; G.enemies.push(e); }
    if (p.y < 4 * TS && tx > S7X.tower1 - 6) { S7X.tower = 'done'; G.cam.lock = null; for (let ty = 1; ty <= 3; ty++) setTile(S7X.tower1, ty, T.E); popup(p.x, p.y - 20, 'THE TOP!  JUMP!', '#7dff8a', true); }
    if (p.y < 6 * TS && tx > S7X.tower1 - 8) for (let ty = 1; ty <= 3; ty++) if (tileAt(S7X.tower1, ty) !== T.E) setTile(S7X.tower1, ty, T.E);
  }
  if (S7X.trio === 0 && tx > S7X.gate + 3 && p.y > (S7X.ceil + 1) * TS) {   // the gauntlet starts
    S7X.trio = 1; for (let ty = S7X.ceil + 1; ty < S7X.floor; ty++) setTile(S7X.gate, ty, T.S);
    G.cam.lock = { x0: S7X.gate * TS, x1: (S7X.door + 2) * TS, y0: LH * TS - VH, y1: LH * TS - VH };
    audio.play('clang'); shake(0.3); later(0.8, () => spawnTrio(1));
  }
  if (S7X.trio > 0 && S7X.trio < 4 && G.boss && G.boss.dead && G.boss.type === 'trio' && !S7X.next) {
    S7X.next = true; const n = S7X.trio + 1;
    later(1.6, () => { S7X.next = false; if (n <= 3) { S7X.trio = n; spawnTrio(n); } else { S7X.trio = 4; for (let ty = S7X.ceil; ty < S7X.floor; ty++) for (const t2 of [S7X.door, S7X.door + 1]) if (tileAt(t2, ty) === T.D) setTile(t2, ty, T.E); G.exitOpen = true; G.cam.lock = null; G.banner = { t: 0, title: 'THREE DOWN.', sub: 'THE STATUES GO BACK TO THE TEMPLE. UNCLE GOES HOME.' }; audio.play('win'); } });
  }
}
// ---------------- the three bosses (one engine, three styles)
const TRIO = {
  1: { name: 'THE CAPOEIRA SPINNER', sub: 'HE DANCES. HE KICKS. HE DOES BOTH AT ONCE.', hp: 120, w: 14, h: 30, col: '#e8c040', skin: '#8a5a3a', acts: ['spin', 'flip', 'spin', 'hop'] },
  2: { name: 'THE BONE-BREAKER', sub: 'HE COLLECTS ELBOWS. AND KNEES. AND SPINES.', hp: 170, w: 26, h: 46, col: '#3a3a3a', skin: '#e8b088', acts: ['grab', 'pound', 'walk', 'grab'] },
  3: { name: 'THE WHEELCHAIR DON', sub: '"...KILL... HIM..."  (THROUGH A VOICE BOX)', hp: 150, w: 26, h: 30, col: '#2a2a3a', skin: '#c8a088', acts: ['gun', 'rocket', 'ram', 'summon'] }
};
function spawnTrio(n) {
  const D = TRIO[n];
  G.boss = { type: 'trio', n, name: D.name, x: (S7X.door - 8) * TS, y: (S7X.floor - 6) * TS, w: D.w, h: D.h, vx: 0, vy: 0, hp: D.hp, maxHp: D.hp, face: -1,
    state: 'enter', t: 1.0, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, cd: 0, dazeT: 0 };
  G.banner = { t: 0, title: (n === 3 ? 'FINAL: ' : 'BOSS ' + n + '/3: ') + D.name, sub: D.sub }; audio.play('roar'); shake(0.3);
}
function updTrio(b, dt) {
  const p = G.player, dx = p.x + p.w / 2 - (b.x + b.w / 2), D = TRIO[b.n];
  b.flash -= dt; b.anim += dt; b.t -= dt; b.cd -= dt;
  b.vy = Math.min(b.vy + 1500 * dt, 800); const wasG = b.onGround; moveBody(b, dt);
  if (b.state === 'enter') { if (b.onGround && !wasG) { shake(0.3); audio.play('slam'); } if (b.t <= 0 && b.onGround) { b.state = 'idle'; b.t = 0.5; } return; }
  if (b.dying > 0) { b.dying -= dt; b.vx = approach(b.vx, 0, 600 * dt); if (Math.random() < dt * 8) explode(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 16, 0, { noDmg: true, quiet: true }); if (b.dying <= 0) { b.dead = true; gore(b.x + b.w / 2, b.y + 10, 20, 1.4); popup(b.x, b.y - 20, D.name + ' IS DOWN!', '#ffd23f', true); } return; }
  if (b.hp < b.maxHp * 0.5 && b.phase === 1) { b.phase = 2; audio.play('roar'); popup(b.x + b.w / 2, b.y - 12, b.n === 3 ? '"...MORE... MEN..."' : 'ENRAGED!', '#ff5a3a', true); }
  const fast = b.phase === 2 ? 0.7 : 1;
  if (b.dazeT > 0) { b.dazeT -= dt; b.vx = approach(b.vx, 0, 900 * dt); return; }
  const touch = !p.dead && overlap(b, p);
  if (b.state === 'idle') {
    b.vx = approach(b.vx, 0, 900 * dt); b.face = sign(dx) || b.face;
    if (b.t <= 0 && b.onGround) {
      const k = D.acts[b.atk++ % D.acts.length]; b.state = k;
      if (k === 'spin') { b.t = 0.35; b.st2 = 'tele'; audio.play('warn'); }
      else if (k === 'flip') { b.vy = -420; b.vx = -b.face * 200; b.t = 0.8; }
      else if (k === 'hop') { b.vy = -500; b.vx = clamp(dx * 1.4, -280, 280); b.t = 1.2; }
      else if (k === 'grab') { b.t = 0.5; b.st2 = 'tele'; popup(b.x + b.w / 2, b.y - 10, '*CRACKS KNUCKLES*', '#ffd23f'); }
      else if (k === 'pound') { b.vy = -380; b.vx = clamp(dx, -160, 160); b.t = 1.4; }
      else if (k === 'walk') { b.t = 1.4; }
      else if (k === 'gun') { b.t = 1.2; b.n2 = 0; audio.play('spin'); }
      else if (k === 'rocket') { b.t = 0.6; }
      else if (k === 'ram') { b.t = 0.6; b.st2 = 'tele'; audio.play('rev'); }
      else if (k === 'summon') { b.t = 0.6; popup(b.x + b.w / 2, b.y - 10, '"...BOYS..."', '#ffd23f', true); }
    }
    if (touch) hurtPlayer(1, b.x + b.w / 2, true);
    return;
  }
  const done = (tt) => { b.state = 'idle'; b.t = (tt || 0.8) * fast; };
  switch (b.state) {
    case 'spin':
      if (b.st2 === 'tele') { b.vx = 0; if (b.t <= 0) { b.st2 = 'go'; b.t = 0.9; b.vx = b.face * 280; audio.play('whoosh'); } }
      else { if (touch) hurtPlayer(1, b.x + b.w / 2, true); if (b.hitWall) { b.vx = -b.vx; b.face = -b.face; } if (b.t <= 0) done(0.6); }
      break;
    case 'flip': case 'hop':
      if (touch) hurtPlayer(1, b.x + b.w / 2, true);
      if (b.onGround && !wasG) { if (b.state === 'hop') { shake(0.2); slamWave(b, 50); } done(0.5); }
      break;
    case 'grab':
      if (b.st2 === 'tele') { b.vx = 0; if (b.t <= 0) { b.st2 = 'go'; b.t = 0.6; b.vx = b.face * 200; } }
      else {
        if (touch && !p.dead && p.inv <= 0) { hurtPlayer(2, b.x + b.w / 2, true); popup(p.x, p.y - 20, '*CRACK*', '#ff3a3a', true); audio.play('slam'); hitstop(0.1); shake(0.4); p.vy = -380; p.vx = -b.face * 260; done(1.0); break; }
        if (b.t <= 0 || b.hitWall) { b.dazeT = b.hitWall ? 1.0 : 0; done(0.7); }
      }
      break;
    case 'pound': if (b.onGround && !wasG) { shake(0.5); audio.play('slam'); slamWave(b, 110); dust(b.x + b.w / 2, b.y + b.h, 14, 12); b.dazeT = 0.6; done(0.6); } if (touch) hurtPlayer(1, b.x, true); break;
    case 'walk': b.vx = approach(b.vx, b.face * 50, 300 * dt); if (touch) hurtPlayer(1, b.x, true); if (b.t <= 0) done(0.3); break;
    case 'gun': b.vx = 0; b.n2 += dt; if (b.n2 > (b.phase === 2 ? 0.1 : 0.16)) { b.n2 = 0; ebullet(b.x + b.w / 2 + b.face * 12, b.y + 10, b.face * 300, rnd(-30, 30), 'mg'); audio.play('shot'); } if (b.t <= 0) done(0.7); break;
    case 'rocket': if (b.t <= 0) { const n = b.phase === 2 ? 2 : 1; for (let k = 0; k < n; k++) later(k * 0.3, () => { if (!G.boss || G.boss !== b) return; S7X.rk = S7X.rk || []; S7X.rk.push({ x: b.x + b.w / 2, y: b.y, vx: clamp(dx / 1.0, -280, 280) + rnd(-40, 40), vy: -360, t: 0 }); audio.play('whoosh'); }); done(1.0); } break;
    case 'ram':
      if (b.st2 === 'tele') { b.vx = 0; if (b.t <= 0) { b.st2 = 'go'; b.t = 1.1; b.vx = b.face * 260; } }
      else { if (touch) hurtPlayer(1, b.x + b.w / 2, true); if (b.hitWall) { shake(0.4); audio.play('slam'); b.dazeT = 1.4; popup(b.x, b.y - 10, '"...OW..."', '#ffd23f'); done(0.4); } else if (b.t <= 0) done(0.5); }
      break;
    case 'summon': b.vx = 0; if (b.t <= 0) { dropIn('knife', S7X.gate + 4); dropIn('soldier', S7X.gate + 30); done(0.9); } break;
    default: done();
  }
}
function updTrioRockets(dt) {
  if (!S7X.rk) return;
  for (const r of S7X.rk) { r.t += dt; r.vy += 600 * dt; r.x += r.vx * dt; r.y += r.vy * dt; if (Math.random() < 0.6) part('smoke', r.x, r.y, 0, 0, 0.4, 2, '#9a9a9a', { grow: 4, a: 0.5 }); if (solidPx(r.x, r.y) || r.t > 3) { r.dead = true; explode(r.x, r.y, 30, 4, {}); } }
  S7X.rk = S7X.rk.filter(r => !r.dead);
}
function drawTrio(b) {
  const D = TRIO[b.n], fx = Math.round(b.x + b.w / 2), fy = Math.round(b.y + b.h);
  ctx.save(); ctx.translate(fx, fy); ctx.scale(b.face || 1, 1);
  if (b.dying > 0) { ctx.globalAlpha = 0.4 + 0.6 * (b.dying / 2); ctx.rotate(-(1 - b.dying / 2) * 0.4); }
  FLASH = b.flash > 0 && Math.floor(b.anim * 30) % 3 === 0;
  const SK = D.skin;
  if (b.n === 1) {                                                         // capoeira: white pants, bare chest, spinning
    const spin = b.state === 'spin' && b.st2 === 'go';
    if (spin) ctx.rotate(Math.sin(b.anim * 30) * 0.3);
    px(-4, -12, 3, 12, '#f0f0f0'); px(1, -12, 3, 12, '#f0f0f0'); px(-5, -13, 10, 2, D.col);
    px(-5, -24, 10, 11, SK); px(-3, -30, 6, 6, SK); px(-4, -32, 8, 3, '#1a1414'); px(0, -28, 2, 1, '#000');
    if (spin) { px(4, -16, 12, 3, '#f0f0f0'); px(-16, -18, 12, 3, '#f0f0f0'); } else { px(5, -22, 3, 8, SK); px(-8, -22, 3, 8, SK); }
  } else if (b.n === 2) {                                                  // the bone-breaker: huge, bald, black singlet
    px(-9, -16, 7, 16, '#2a2a30'); px(2, -16, 7, 16, '#2a2a30'); px(-11, -36, 22, 21, D.col); px(-12, -36, 4, 14, SK); px(8, -36, 4, 14, SK);
    px(-6, -46, 12, 10, SK); px(-5, -47, 10, 2, '#d8a078'); px(1, -43, 3, 1, '#000'); px(-1, -39, 5, 1, '#6a2a1a');
    const reach = b.state === 'grab' ? 10 : 0; px(10, -32, 6 + reach, 5, SK); px(-16, -32, 5, 10, SK);
  } else {                                                                 // the don: a motorised wheelchair, a blanket, a voice box
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-6, -6, 6, 0, 6.283); ctx.arc(8, -4, 4, 0, 6.283); ctx.fill();
    px(-12, -16, 22, 4, '#4a4a52'); px(-12, -30, 4, 16, '#4a4a52'); px(-6, -18, 14, 6, '#6a2a2a');
    px(-6, -28, 12, 10, D.col); px(-4, -36, 9, 8, SK); px(-5, -37, 10, 2, '#e8e8e8'); px(1, -33, 2, 1, '#000');
    px(2, -26, 3, 3, '#8a8a90');                                           // the voice box
    px(8, -24, 12, 3, '#3a3a40'); if (b.state === 'gun' && Math.floor(b.anim * 20) % 2) px(20, -25, 3, 5, '#fff2a0');   // the mounted gun
  }
  if (b.dazeT > 0) for (let k = 0; k < 3; k++) { const a = G.clock * 6 + k * 2.1; px(Math.cos(a) * 9 - 1, -b.h - 6 + Math.sin(a) * 3, 2, 2, '#ffd23f'); }
  FLASH = false; ctx.restore();
  if (S7X.rk) for (const r of S7X.rk) { ctx.fillStyle = '#5a6a3a'; ctx.fillRect(r.x - 3, r.y - 1.5, 6, 3); ctx.fillStyle = '#ffb020'; ctx.fillRect(r.x - 5, r.y - 1, 2, 2); }
}
// camera: the street keeps its old framing; only the cave lets the view go down
const _camBounds7x = camBounds;
camBounds = function () {
  const B = _camBounds7x();
  if (STAGE === 7 && !(G.cam.lock && G.cam.lock.y0 != null)) { const p = G.player, tx = p ? (p.x + p.w / 2) / TS : 0; if (tx < S7X.shaft - 2 || p.y < 17 * TS) B.y1 = Math.min(B.y1, 22 * TS - VH); }
  return B;
};
function drawStage7XBG(cam) {
  const tx = (cam.x + VW / 2) / TS;
  if (tx < S7X.vill - 10) return false;
  if (G.player.y > 19 * TS && tx > S7X.shaft - 4) { paintZones(cam, [[0, 's7cave', '#0a0c14']], { hor: VH + 10, scale: 1.0 }); return true; }
  paintZones(cam, [[S7X.vill - 10, 's7eleph', '#e0a060'], [S7X.tower0 - 6, 's7spiral', '#2a0c08'], [S7X.tower1 + 6, 's7eleph', '#e0a060']]);
  return true;
}
function drawStage7XFront() {
  const p = G.player, tx = (p.x + p.w / 2) / TS;
  if (tx > S7X.shaft - 2 && p.y > 19 * TS) {                               // the cave is dark: a pool of light around the hero and the torches
    const sx = p.x + p.w / 2 - G.cam.x, sy = p.y + p.h / 2 - G.cam.y;
    const g = ctx.createRadialGradient(sx, sy, 30, sx, sy, 230); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,8,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  } else if (tx > S7X.tower0 && tx < S7X.tower1) { ctx.fillStyle = 'rgba(255,80,30,0.07)'; ctx.fillRect(0, 0, VW, VH); }
}
