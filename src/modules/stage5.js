// =====================================================================
// STAGE 05 — COP STORY 1985 → 1989: down the shanty hill in a car, the glass mall, out into Central,
// across the harbour on the ferry, a showdown in Tsim Sha Tsui — and the same car comes back for you.
// (homages to Hong Kong cop / heroic-bloodshed set pieces; all names and art original)
// =====================================================================
const S5 = { W: 480, hillEnd: 56, mall0: 102, mall1: 190, pole: 150, central0: 192, pier0: 302, ferry0: 310, ferry1: 348, tst0: 356, chapel: 266 };
const s5surf = c => Math.min(18, 6 + Math.floor(Math.max(0, c - 2) / 4.4));     // the hill's top row at column c
const GUNNERS_NO_CLIMB = new Set(['sombat', 'ma', 'phiphop', 'rajini', 'vijay', 'lady', 'ogami', 'michelle']);
let S5BG = null;
function stage5LoadArt() { if (S5BG || typeof S5_BG_SRC === 'undefined') return; const im = new Image(); im.onload = () => { S5BG = im; }; im.src = S5_BG_SRC; }
const LOCKS5 = [
  { x0: 62, x1: 94, trig: 70, waves: [
    [['knife', 90], ['soldier', 88], ['soldier', 64]],
    [['heavy', 91], ['gunner', 66], ['bomber', 80]]
  ] },
  { x0: 140, x1: 170, trig: 146, waves: [
    [['knife', 166], ['knife', 142], ['gunner', 160]],
    [['shield', 167], ['soldier', 143], ['bomber', 155], ['soldier', 163]]
  ] },
  { x0: 228, x1: 262, trig: 236, waves: [                       // CENTRAL: the neon-sign street
    [['soldier', 260], ['knife', 230], ['gunner', 258]],
    [['shield', 259], ['bomber', 232], ['soldier', 250], ['heavy', 261]]
  ] },
  { x0: 310, x1: 348, trig: 318, waves: [                       // THE FERRY: nowhere to run, it's a boat
    [['soldier', 346], ['soldier', 312], ['bomber', 330]],
    [['heavy', 345], ['knife', 313], ['gunner', 328], ['shield', 340]],
    [['knife', 346], ['knife', 312], ['soldier', 330], ['bomber', 344]]
  ] }
];
function buildStage5(E, set, fill, en, br, cp, hint) {
  stage5LoadArt(); s5LoadImgs();
  S5.poles = []; S5.glass = []; S5.cars = []; S5.huts = []; S5.doves = false;
  fill(0, LW - 1, 18, LH - 1, T.G);
  fill(0, 1, 0, 17, T.S); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  // ---------- A. THE SHANTY HILL (the car comes down through all of this) ----------
  for (let c = 2; c < S5.hillEnd; c++) fill(c, c, s5surf(c), 17, T.H);
  [9, 15, 21, 28, 35, 42, 49].forEach((c, i) => {
    for (let cc = c; cc < c + 5; cc++) fill(cc, cc, s5surf(cc) - 3, s5surf(cc) - 1, T.B);      // a solid tin-and-brick shack that steps down the slope
    S5.huts.push({ x0: c, w: 5, seed: i, cv: null });
    en(i % 3 === 0 ? 'knife' : 'soldier', c + 2, s5surf(c + 2) - 3);                              // standing on its roof
  });
  S5.poles.push({ x: 25.5 * TS, y0: (s5surf(25) - 8) * TS, y1: s5surf(25) * TS, bulbs: 0 }, { x: 46.5 * TS, y0: (s5surf(46) - 7) * TS, y1: s5surf(46) * TS, bulbs: 0 });
  fill(23, 27, s5surf(25) - 8, s5surf(25) - 8, T.P); fill(44, 49, s5surf(46) - 7, s5surf(46) - 7, T.P);
  en('gunner', 25, s5surf(25) - 8); en('gunner', 46, s5surf(46) - 7);
  hint(4, 3, 'HONG KONG, 1985.  THE BRAKES WERE OPTIONAL.');
  // ---------- B. THE ROAD & THE BUS STOP ----------
  cp(58);
  hint(58, 11, 'ARROW UP AT A POLE: BRAWLERS CLIMB IT  ·  DOWN = SLIDE');
  fill(66, 72, 14, 14, T.P); fill(80, 86, 13, 13, T.P);
  br(68, 18); br(69, 18); br(84, 18); fill(76, 77, 17, 17, T.C);
  S5.cars.push({ x: 73 * TS, y: 18 * TS, col: '#c82a2a' }, { x: 89 * TS, y: 18 * TS, col: '#e8e0c8' });
  br(74, 18); br(90, 18);
  en('soldier', 67, 14); en('soldier', 83, 13); en('knife', 79, 18);
  S5.poles.push({ x: 78.5 * TS, y0: 8 * TS, y1: 18 * TS, bulbs: 0 });
  fill(76, 81, 8, 8, T.P); en('gunner', 79, 8);
  cp(96);
  // ---------- C. THE GOLDEN MALL ----------
  fill(S5.mall0, S5.mall1, 0, 2, T.S);
  fill(S5.mall0, S5.mall0, 3, 9, T.B); fill(S5.mall1, S5.mall1, 3, 9, T.B);
  S5.glass.push({ x: S5.mall0 * TS, y: 10 * TS, w: 14, h: 8 * TS, door: true }, { x: S5.mall1 * TS + 1, y: 10 * TS, w: 14, h: 8 * TS, door: true });
  fill(104, 142, 13, 13, T.P); fill(158, 188, 13, 13, T.P);
  fill(104, 140, 8, 8, T.P); fill(160, 188, 8, 8, T.P);
  fill(108, 111, 16, 16, T.P); fill(126, 129, 11, 11, T.P); fill(170, 173, 16, 16, T.P); fill(176, 179, 11, 11, T.P);
  for (const [x0, x1, row] of [[105, 140, 18], [159, 188, 18], [105, 140, 13], [159, 188, 13], [105, 138, 8], [161, 188, 8]])
    for (let x = x0; x + 6 <= x1; x += 8) S5.glass.push({ x: x * TS, y: (row - 4) * TS + 2, w: 6 * TS, h: 4 * TS - 4 });
  S5.poles.push({ x: S5.pole * TS + 8, y0: 3 * TS, y1: 18 * TS, bulbs: 0, big: true }, { x: 121.5 * TS, y0: 8 * TS, y1: 13 * TS, bulbs: 0 }, { x: 182.5 * TS, y0: 8 * TS, y1: 13 * TS, bulbs: 0 });
  en('soldier', 112, 18); en('gunner', 118, 13); en('soldier', 132, 13); en('knife', 124, 18); en('soldier', 112, 8); en('gunner', 134, 8);
  en('shield', 162, 18); en('soldier', 175, 13); en('gunner', 168, 8); en('knife', 180, 18); en('bomber', 172, 13); en('soldier', 184, 8);
  br(116, 18); br(117, 18); br(136, 13); br(164, 18); br(178, 13);
  hint(104, 5, 'THE GOLDEN MALL.  EVERYTHING IS GLASS.  EVERYTHING.');
  hint(146, 5, 'THE BIG POLE: CLIMB TO THE TOP, THEN SLIDE ALL THE WAY DOWN');
  cp(134);
  // ---------- D. CENTRAL, 1989 — trams, hanging neon, and a chapel full of candles ----------
  cp(196);
  hint(196, 6, 'CENTRAL, 1989.  BANKERS BY DAY.  HITMEN BY NIGHT.');
  fill(204, 215, 13, 13, T.P);                                                  // the tram's roof
  fill(200, 202, 15, 15, T.P);                                                  // bus-shelter roof: the step up to it
  en('soldier', 206, 13); en('gunner', 213, 13); en('knife', 200, 18);
  for (const [a, b] of [[222, 227], [240, 245], [258, 263]]) fill(a, b, 12, 12, T.P);   // hanging neon signs you can stand on
  for (const a of [219, 237, 255]) fill(a, a + 2, 15, 15, T.P);                 // shop awnings: the steps up to the signs
  fill(232, 236, 9, 9, T.P); fill(250, 254, 9, 9, T.P);
  en('soldier', 224, 12); en('gunner', 243, 12); en('soldier', 261, 12); en('gunner', 234, 9);
  br(218, 18); br(219, 18); br(248, 18);
  S5.cars.push({ x: 252 * TS, y: 18 * TS, col: '#c82a2a' }); br(253, 18);
  cp(266);
  hint(268, 6, 'IN THE CHAPEL, SOMEBODY IS LIGHTING CANDLES.  THERE WILL BE DOVES.');
  en('bomber', 276, 18); en('soldier', 284, 18); en('gunner', 296, 18); en('knife', 290, 18);
  fill(286, 291, 11, 11, T.P); en('soldier', 288, 11); fill(294, 296, 14, 14, T.P);
  S5.poles.push({ x: 292.5 * TS, y0: 11 * TS, y1: 18 * TS, bulbs: 0 });
  br(280, 18); br(298, 18);
  S5.cars.push({ x: 299 * TS, y: 18 * TS, col: '#e8e0c8' });
  // ---------- E. THE HARBOUR FERRY ----------
  cp(304);
  hint(304, 6, 'THE HARBOUR FERRY.  EIGHT MINUTES TO KOWLOON.  NO REFUNDS.');
  fill(312, 346, 13, 13, T.P); fill(324, 332, 9, 9, T.P);                        // upper deck, the wheelhouse roof
  fill(313, 315, 16, 16, T.P); fill(343, 345, 16, 16, T.P); fill(319, 321, 11, 11, T.P);   // gangway stairs
  en('gunner', 328, 9); en('soldier', 316, 13); en('soldier', 342, 13);
  br(320, 18); br(338, 18);
  // ---------- F. TSIM SHA TSUI — Nathan Road neon and the clock tower ----------
  cp(360);
  hint(360, 6, 'TSIM SHA TSUI.  THE NEON NEVER SLEEPS.  NEITHER DOES THE TYCOON.');
  for (const [a, b] of [[366, 371], [384, 389], [404, 409]]) fill(a, b, 12, 12, T.P);
  for (const [a, b] of [[376, 380], [394, 398]]) fill(a, b, 9, 9, T.P);
  for (const a of [363, 381, 401]) fill(a, a + 2, 15, 15, T.P);
  en('soldier', 364, 18); en('gunner', 368, 12); en('knife', 375, 18); en('soldier', 378, 9); en('gunner', 387, 12); en('bomber', 392, 18);
  en('soldier', 396, 9); en('heavy', 400, 18); en('gunner', 407, 12); en('knife', 414, 18); en('shield', 420, 18);
  br(372, 18); br(373, 18); br(402, 18); br(418, 18);
  S5.cars.push({ x: 381 * TS, y: 18 * TS, col: '#c82a2a' }, { x: 411 * TS, y: 18 * TS, col: '#c82a2a' }); br(382, 18); br(412, 18);
  S5.poles.push({ x: 390.5 * TS, y0: 8 * TS, y1: 18 * TS, bulbs: 0 });
  cp(428);
  // ---------- G. THE CLOCK-TOWER PLAZA (boss) — the stage-01 arena footprint, moved to the end ----------
  fill(445, 445, 15, 17, T.B); fill(459, 459, 15, 17, T.B);
  fill(448, 456, 15, 15, T.P);
  br(450, 18); br(454, 18);
  fill(464, 465, 0, 17, T.D);
  hint(470, 12, 'EXIT  >>');
  E.start = { x: 3 * TS, y: s5surf(3) * TS - PC.standH };
  E.flag = { x: 470 * TS, y: 18 * TS };
  return E;
}
// ---------------- the car down the hill (every hero's intro on this stage) ----------------
function startCar5() {
  const p = G.player;
  G.car5 = { x: 2 * TS, y: s5surf(3) * TS, rot: 0, t: 0, wreck: false, smoke: 0 };
  p.carHide = true; p.inv = 4;
  G.cine = { kind: 'introCar5', t: 0, ghost: true };
  audio.play('rev');
}
function cineCar5(c, p, dt) {
  const C = G.car5; if (!C) { G.cine = null; return; }
  if (!C.wreck) {
    C.x += 300 * dt;
    const col = Math.floor((C.x + 18) / TS), ty = s5surf(col) * TS, ahead = s5surf(col + 2) * TS;
    C.y = approach(C.y, ty, 400 * dt); C.rot = Math.atan2(ahead - ty, 2 * TS) * 0.8;
    const box = { x: C.x, y: C.y - 52, w: 40, h: 50 };                                  // tall enough to take a whole shack with it
    for (let tx = Math.floor(box.x / TS); tx <= Math.floor((box.x + box.w) / TS); tx++)
      for (let yy = Math.floor(box.y / TS); yy <= Math.floor((box.y + box.h - 1) / TS); yy++) { const t = tileAt(tx, yy); if (t === T.C || t === T.B) { damageTile(tx, yy, 99); shake(0.06); if (Math.random() < 0.5) audio.play('crate'); if (Math.random() < 0.4) debris(tx * TS + 8, yy * TS + 8, 4, ['#8a6a4a', '#a8a8b0', '#5a7a9a', '#c84a3a'], 1); } }
    for (const e of G.enemies) if (!e.dead && overlap(box, e)) { damageEnemy(e, 99, C.x, true); e.vx = 420; e.vy = -320; e.fling = 0.5; popup(e.x + 5, e.y - 8, ['BONK!', 'HONK!', 'WHAM!'][(Math.random() * 3) | 0], '#ffd23f'); }
    if (Math.random() < dt * 30) dust(C.x + 4, C.y, 1, 6);
    p.x = C.x + 14; p.y = C.y - p.h - 2; p.vx = p.vy = 0; p.face = 1;
    if (C.x > (S5.hillEnd - 3) * TS) {
      C.wreck = true; C.t = 0; shake(0.5); audio.play('boom'); explode(C.x + 34, C.y - 8, 26, 0, { noDmg: true });
      debris(C.x + 30, C.y - 10, 14, ['#8a8a8a', '#c82a2a', '#222'], 1.2);
      p.carHide = false; p.x = C.x + 40; p.y = s5surf(Math.floor((C.x + 40) / TS)) * TS - p.h - 2; p.vy = -320; p.vx = 120; p.onGround = false;
      popup(p.x + 5, p.y - 20, ['"I\'M FINE."', '"WHO NEEDS BRAKES."', '"PARKED."'][(Math.random() * 3) | 0], heroOf(p).col, true);
      later(0.5, heroQuip);
    }
  } else { C.t += dt; if (C.t > 1.0) { G.cine = null; p.inv = 1; } }
}
// ---------------- the outro: the SAME car (more tape now) comes back and drives you out through the fireworks ----------------
function startCar5Outro() {
  const p = G.player;
  G.finalTime = G.time;
  G.car5 = { x: p.x - 260, y: 18 * TS, rot: 0, t: 0, wreck: false, taped: true, mode: 'arrive' };
  G.cine = { kind: 'outroCar5', t: 0 };
  audio.play('rev'); popup(p.x + 5, p.y - 18, 'HONK HONK!', '#ffd23f', true);
}
function cineCar5Out(c, p, dt) {
  const C = G.car5, at = s => c.t - dt < s && c.t >= s;
  p.vx = approach(p.vx, 0, 900 * dt);
  if (C.mode === 'arrive') {
    C.x = approach(C.x, p.x - 14, 420 * dt); C.rot = 0;
    if (Math.random() < dt * 20) dust(C.x + 4, C.y, 1, 6);
    if (Math.abs(C.x - (p.x - 14)) < 2) {
      C.mode = 'board'; C.t = 0; audio.play('skid'); dust(C.x + 30, C.y, 8, 10);
      popup(C.x + 20, C.y - 34, ['"SAME CAR. MORE TAPE."', '"GET IN. DON\'T ASK."', '"IT STILL WORKS. MOSTLY."'][(Math.random() * 3) | 0], '#ffffff', true);
    }
  } else if (C.mode === 'board') {
    C.t += dt;
    if (C.t > 0.35 && !p.carHide) { p.carHide = true; audio.play('jump'); }
    if (C.t > 0.8) { C.mode = 'go'; C.t = 0; audio.play('rev'); }
  } else {
    C.t += dt; C.x += (240 + C.t * 160) * dt; C.rot = Math.sin(C.t * 20) * 0.03;
    p.x = C.x + 14; p.y = C.y - p.h - 2; p.vx = 0;
    C.boomT = (C.boomT || 0) - dt;
    if (C.boomT <= 0 && C.t < 2.2) {                     // drive straight through it, again
      C.boomT = 0.16;
      const bx = C.x + rnd(-30, 150), by = 18 * TS - rnd(4, 60);
      explode(bx, by, rnd(20, 34), 0, { noDmg: true, quiet: Math.random() < 0.5 }); shake(0.25);
      debris(bx, by, 6, ['#d86a1c', '#f2c230', '#555'], 1.2);
      if (Math.random() < 0.3) spawnDoves(bx, by, 3, false);
    }
    if (at(0.5)) { G.timeScale = 0.45; G.slowT = 0.5; popup(C.x + 20, C.y - 40, 'DON\'T LOOK BACK.', '#ffd23f', true); }
    if (C.x > (LW - 6) * TS) C.x = (LW - 6) * TS;
    if (C.t > 2.0) G.fade = Math.min(1, (C.t - 2.0) / 0.6);
    if (C.t > 2.7) { G.cine = null; win(); }
  }
}
function drawCar5(C, wreck) {
  ctx.save(); ctx.translate(Math.round(C.x), Math.round(C.y)); ctx.rotate(C.rot || 0);
  const f = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const body = C.col || '#e8e0c8';
  f(0, -14, 38, 9, wreck ? '#6a6460' : body); f(8, -21, 20, 7, wreck ? '#5a5450' : body); f(10, -20, 7, 5, '#3a5a7a'); f(19, -20, 7, 5, '#3a5a7a');
  f(0, -10, 38, 1, '#c82a2a'); f(35, -12, 3, 3, '#ffe08a'); f(0, -12, 2, 3, '#e83a3a'); f(0, -6, 38, 2, '#2a2a2a');
  for (const wx of [8, 30]) { f(wx - 4, -6, 8, 6, '#141414'); f(wx - 2, -4, 4, 2, '#8a8a8a'); }
  if (C.taped) {                                           // the comeback: dented, one door a different colour, held together with tape
    f(4, -14, 9, 8, '#7a8a9a'); f(14, -13, 2, 8, '#d8d0b0'); f(22, -19, 6, 1, '#d8d0b0'); f(24, -21, 1, 5, '#d8d0b0'); f(28, -14, 6, 2, '#5a5450');
    f(9, -20, 8, 5, '#2a3a4a'); ctx.strokeStyle = '#d0e8ff'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(10, -19); ctx.lineTo(16, -16); ctx.moveTo(15, -20); ctx.lineTo(11, -15); ctx.stroke();
    if (Math.random() < 0.25) part('smoke', C.x + rnd(-2, 2), C.y - 8, rnd(-30, -10), rnd(-30, -10), 0.8, 2, '#5a5a5a', { grow: 5, a: 0.4 });
  }
  if (wreck) { f(30, -24, 2, 4, '#141414'); if (Math.random() < 0.3) part('smoke', C.x + 30, C.y - 18, rnd(-10, 10), rnd(-50, -20), 1.2, 3, '#4a4a4a', { grow: 8, a: 0.5 }); }
  ctx.restore();
}
// ---------------- glass: everything in the mall shatters ----------------
function shatterGlass(g, dir) {
  if (g.broken) return; g.broken = true; G.stats.glass = (G.stats.glass || 0) + 1;
  for (let i = 0; i < (g.door ? 30 : 18); i++) part('debris', g.x + rnd(0, g.w), g.y + rnd(0, g.h), (dir || rnd(-1, 1)) * rnd(40, 220), rnd(-200, 20), rnd(0.5, 1.1), rnd(1, 2) | 0, Math.random() < 0.5 ? '#bfe8ff' : '#ffffff', { g: 900 });
  audio.play('ric'); audio.play('tile');
  if (Math.random() < 0.35 || g.door) popup(g.x + g.w / 2, g.y - 4, ['CRASH!', 'SMASH!', 'TINKLE!', 'GLASS!'][(Math.random() * 4) | 0], '#bfe8ff');
}
function shatterNear(x, y, r) { if (STAGE !== 5 || !S5.glass) return; for (const g of S5.glass) if (!g.broken && x > g.x - r && x < g.x + g.w + r && y > g.y - r && y < g.y + g.h + r) shatterGlass(g, Math.sign(g.x + g.w / 2 - x)); }
function updStage5(dt) {
  if (STAGE !== 5 || !S5.glass) return;
  const p = G.player;
  for (const g of S5.glass) {
    if (g.broken) continue;
    if (g.x + g.w < G.cam.x - 60 || g.x > G.cam.x + VW + 60) continue;
    for (const b of G.bullets) if (b.x > g.x && b.x < g.x + g.w && b.y > g.y && b.y < g.y + g.h) { shatterGlass(g, Math.sign(b.vx)); break; }
    if (g.broken) continue;
    for (const b of G.ebullets) if (b.x > g.x && b.x < g.x + g.w && b.y > g.y && b.y < g.y + g.h) { shatterGlass(g, Math.sign(b.vx)); break; }
    if (g.broken) continue;
    for (const e of G.enemies) if (Math.abs(e.vx) > 160 && overlap(e, g)) { shatterGlass(g, Math.sign(e.vx)); break; }
    if (!g.broken && !p.dead && (Math.abs(p.vx) > 260 || p.swingT > 0) && overlap({ x: p.x - 8, y: p.y, w: p.w + 16, h: p.h }, g)) shatterGlass(g, p.face);
  }
  for (const h of S5.huts) {                                       // a smashed shack is gone, not a black box: no scorched 'ruin' tiles left behind
    if ((h.x0 + h.w) * TS < G.cam.x - 40 || h.x0 * TS > G.cam.x + VW + 40) continue;
    for (let tx = h.x0; tx < h.x0 + h.w; tx++) for (let ty = s5surf(tx) - 3; ty < s5surf(tx); ty++) { const i = ty * LW + tx; if (tiles[i] === T.E && ruin[i]) { ruin[i] = 0; redrawTile(tx, ty); } }
  }
  if (!S5.doves && !p.dead && p.x > (S5.chapel + 4) * TS) {          // the chapel: of course there are doves
    S5.doves = true; spawnDoves((S5.chapel + 8) * TS, 9 * TS, 16, true);
    popup(p.x + 5, p.y - 26, 'DOVES.  OF COURSE.', '#ffffff', true);
  }
}
function drawGlass(cam) {
  if (STAGE !== 5 || !S5.glass) return;
  for (const g of S5.glass) {
    if (g.x + g.w < cam.x || g.x > cam.x + VW) continue;
    ctx.fillStyle = '#5a5a64'; ctx.fillRect(g.x, g.y, g.w, 1); ctx.fillRect(g.x, g.y + g.h - 1, g.w, 1); ctx.fillRect(g.x, g.y, 1, g.h); ctx.fillRect(g.x + g.w - 1, g.y, 1, g.h);
    if (g.broken) { ctx.fillStyle = 'rgba(190,232,255,0.5)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); const sx = g.x + 1 + i * g.w / 4; ctx.moveTo(sx, g.y + 1); ctx.lineTo(sx + 4, g.y + 1); ctx.lineTo(sx + 1, g.y + 5 + (i % 2) * 4); ctx.fill(); } continue; }
    ctx.fillStyle = 'rgba(160,215,255,0.22)'; ctx.fillRect(g.x + 1, g.y + 1, g.w - 2, g.h - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(g.x + 4, g.y + 3, 2, g.h * 0.6); ctx.fillRect(g.x + 8, g.y + 3, 1, g.h * 0.4);
  }
}
// ---------------- poles: brawlers climb, everyone slides ----------------
function canClimb(p) { return !GUNNERS_NO_CLIMB.has(p.ch) && (p.ch !== 'wah' || p.foot); }
function poleTick(p, dt, ip) {
  if (STAGE !== 5 || !S5.poles || p.dead) { p.pole = null; return false; }
  if (!p.pole) {
    if (!held('up') || !canClimb(p) || p.poleCd > G.time) return false;
    const cx = p.x + p.w / 2;
    const q = S5.poles.find(q => Math.abs(q.x - cx) < 9 && p.y + p.h > q.y0 && p.y < q.y1);
    if (!q) return false;
    p.pole = q; p.vx = 0; p.vy = 0; audio.play('clang');
    if (!q.told) { q.told = true; popup(p.x + 5, p.y - 16, q.big ? 'UP TO THE TOP — THEN SLIDE!' : 'CLIMB!', '#ffd23f'); }
  }
  const q = p.pole; p.x = q.x - p.w / 2; p.vx = 0; p.onGround = false; p.vy = 0;
  if (held('up')) p.y -= 80 * dt;
  else if (held('down')) {
    p.y += 300 * dt;
    if (Math.random() < dt * 40) { part('spark', q.x + rnd(-3, 3), p.y + rnd(0, p.h), rnd(-80, 80), rnd(-60, 20), 0.4, 1, Math.random() < 0.5 ? '#ffe08a' : '#ffffff', { g: 400 }); }
    q.popped = Math.max(q.popped || 0, p.y + p.h);
    if (Math.random() < dt * 6) { audio.play('ric'); light(q.x, p.y + p.h / 2, 30, 0.08, '255,230,150'); }
    if (q.big && !q.slideTold && p.y + p.h > q.y0 + 80) { q.slideTold = true; popup(p.x + 5, p.y - 14, 'THE SLIDE!', '#ffd23f', true); G.timeScale = 0.5; G.slowT = 0.5; }
  }
  if (p.y < q.y0 + 2) p.y = q.y0 + 2;
  if (ip.jump) { p.pole = null; p.poleCd = G.time + 0.35; p.vy = -380; p.vx = p.face * 170; audio.play('jump'); return true; }
  if (p.y + p.h >= q.y1) { p.y = q.y1 - p.h; p.pole = null; p.poleCd = G.time + 0.4; p.onGround = true; }
  return true;
}
// ---------------- the shacks: solid tin-and-brick houses, drawn tile by tile so they break apart for real ----------------
function shackCanvas(h) {
  const top = s5surf(h.x0) - 3, bot = s5surf(h.x0 + h.w - 1) - 1, cv = mkCanvas(h.w * TS, (bot - top + 1) * TS), g = cv.getContext('2d');
  const R = (x, y, w, hh, c) => { g.fillStyle = c; g.fillRect(x, y, w, hh); };
  const walls = [['#8a6a52', '#6e5442'], ['#5a7a8a', '#46606e'], ['#a8a090', '#888072'], ['#9a5a44', '#7a4636']][h.seed % 4];
  for (let i = 0; i < h.w; i++) {
    const y0 = (s5surf(h.x0 + i) - 3 - top) * TS, x = i * TS;
    R(x, y0, TS, 3 * TS, walls[0]);
    for (let k = 0; k < TS; k += 3) R(x + k, y0 + 4, 1, 3 * TS - 4, walls[1]);                        // corrugated tin
    R(x - 1, y0, TS + 2, 4, ['#7a7a82', '#5a6a8a', '#8a4a3a', '#6a6a52'][(h.seed + i) % 4]); R(x - 1, y0 + 4, TS + 2, 1, '#2a2420');   // roof sheet, stepped with the slope
    if (i === 1) { R(x + 3, y0 + 12, 10, 9, '#2a2430'); R(x + 3, y0 + 12, 10, 9, 'rgba(255,210,120,0.35)'); R(x + 8, y0 + 12, 1, 9, '#5a4a3a'); R(x + 3, y0 + 16, 10, 1, '#5a4a3a'); }
    if (i === 3) { R(x + 4, y0 + 22, 8, 26, '#3a2a20'); R(x + 10, y0 + 34, 1, 2, '#d8b040'); }
    if (i === 0 || i === h.w - 1) R(x + (i ? TS - 2 : 0), y0, 2, 3 * TS, 'rgba(0,0,0,0.25)');
    R(x, y0 + 3 * TS - 3, TS, 3, 'rgba(0,0,0,0.3)');
  }
  const ly = (s5surf(h.x0 + 2) - 3 - top) * TS + 8;                                                    // laundry line across the front
  R(2, ly, h.w * TS - 4, 1, '#3a3a3a');
  for (let k = 0; k < 5; k++) R(6 + k * 14, ly + 1, 6, 7 + (k % 2) * 3, ['#e8e0d0', '#c84a4a', '#4a8ac8', '#e8c040', '#7ac87a'][(k + h.seed) % 5]);
  R(h.w * TS - 14, 0, 1, 10, '#2a2a2a'); R(h.w * TS - 18, 2, 9, 1, '#2a2a2a'); R(h.w * TS - 17, 5, 7, 1, '#2a2a2a');   // TV antenna
  h.top = top; return cv;
}
function drawShacks(cam) {
  for (const h of S5.huts || []) {
    if ((h.x0 + h.w) * TS < cam.x || h.x0 * TS > cam.x + VW) continue;
    if (!h.cv) h.cv = shackCanvas(h);
    for (let i = 0; i < h.w; i++) { const tx = h.x0 + i; for (let ty = s5surf(tx) - 3; ty < s5surf(tx); ty++) if (tileAt(tx, ty) === T.B) ctx.drawImage(h.cv, i * TS, (ty - h.top) * TS, TS, TS, tx * TS, ty * TS, TS, TS); }
  }
}
function drawPoles(cam) {
  if (STAGE !== 5 || !S5.poles) return;
  drawShacks(cam); drawFerryHull(cam);
  for (const q of S5.poles) {
    if (q.x < cam.x - 20 || q.x > cam.x + VW + 20) continue;
    ctx.fillStyle = '#2a2a30'; ctx.fillRect(q.x - 1.5, q.y0, 3, q.y1 - q.y0); ctx.fillStyle = '#5a5a64'; ctx.fillRect(q.x - 1.5, q.y0, 1, q.y1 - q.y0);
    if (!q.big) { ctx.fillStyle = '#2a2a30'; ctx.fillRect(q.x - 8, q.y0 + 3, 16, 2); }
    const step = q.big ? 6 : 9;
    for (let y = q.y0 + 4; y < q.y1 - 2; y += step) {
      const dead = q.popped && y < q.popped;
      const on = !dead && Math.sin(G.clock * 6 + y * 0.3) > -0.7;
      ctx.fillStyle = dead ? '#4a4a40' : on ? '#ffe08a' : '#a89050';
      ctx.fillRect(q.x - (y % 12 < 6 ? 4 : -2), y, 2, 2);
      if (on && q.big) { ctx.fillStyle = 'rgba(255,224,138,0.18)'; ctx.fillRect(q.x - 6, y - 2, 12, 6); }
    }
  }
  for (const C of S5.cars || []) if (C.x > cam.x - 60 && C.x < cam.x + VW + 20) drawCar5(C, false);
  if (G.car5) drawCar5(G.car5, G.car5.wreck);
}
function drawFerryHull(cam) {          // in front of the ground tiles: the deck is a boat, the pier is planks, the rest is harbour
  const X0 = S5.pier0 * TS, X1 = S5.tst0 * TS; if (X1 < cam.x || X0 > cam.x + VW) return;
  const y = 18 * TS, t = G.clock, F0 = S5.ferry0 * TS, F1 = S5.ferry1 * TS;
  ctx.fillStyle = '#1a3a5a'; ctx.fillRect(X0, y, X1 - X0, 4 * TS);
  ctx.fillStyle = 'rgba(120,180,220,0.35)'; for (let x = X0; x < X1; x += 12) ctx.fillRect(x + Math.sin(t * 2 + x) * 3, y + 10 + (x % 24) / 3, 7, 1);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(X0, y, F0 - X0, 5); ctx.fillRect(F1, y, X1 - F1, 5);                                  // pier planks
  ctx.fillStyle = '#4a3420'; for (let x = X0; x < X1; x += 6) if (x < F0 || x >= F1) ctx.fillRect(x, y, 1, 5);
  for (const px0 of [X0 + 8, F0 - 24, F1 + 16, X1 - 24]) { ctx.fillStyle = '#3a2a1a'; ctx.fillRect(px0, y + 5, 5, 3 * TS); }
  const bob = Math.sin(t * 1.6) * 1;
  ctx.fillStyle = '#2a6a3a'; ctx.fillRect(F0 - 4, y + bob, F1 - F0 + 8, 16);                                                   // green-and-white ferry hull
  ctx.fillStyle = '#e8e4d8'; ctx.fillRect(F0 - 4, y + bob, F1 - F0 + 8, 4); ctx.fillStyle = '#1a4a2a'; ctx.fillRect(F0, y + 16 + bob, F1 - F0, 6);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('渡海小輪  HARBOUR FERRY', (F0 + F1) / 2, y + 10 + bob);
  for (let x = F0 + 10; x < F1 - 10; x += 60) { ctx.fillStyle = '#e83a2a'; ctx.beginPath(); ctx.arc(x, y + 9 + bob, 3, 0, 6.283); ctx.fill(); ctx.fillStyle = '#2a6a3a'; ctx.beginPath(); ctx.arc(x, y + 9 + bob, 1.5, 0, 6.283); ctx.fill(); }   // lifebuoys
}
// ---------------- world-space scenery behind the tiles ----------------
function s5sign(cn, en, x, y, w, col, on) {
  ctx.fillStyle = '#140a10'; ctx.fillRect(x, y, w, 26);
  ctx.globalAlpha = on ? 1 : 0.35; ctx.fillStyle = col; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(cn, x + w / 2, y + 10);
  ctx.font = 'bold 5px monospace'; ctx.fillText(en, x + w / 2, y + 21); ctx.globalAlpha = 1;
  if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.14; ctx.fillStyle = col; ctx.fillRect(x - 8, y - 8, w + 16, 42); ctx.restore(); }
}
function drawFigure(x, y, f, s) {      // a background extra: tiny silhouette, feet at (x, y). s = 1 faces right
  const R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + a * s - (s < 0 ? w : 0), y + b, w, h); };
  R(-3, -6, 2, 6, f.leg || '#1a1a20'); R(1, -6, 2, 6, f.leg || '#1a1a20');
  R(-4, -16, 8, 10, f.body); if (f.coat) R(-5, -16, 10, 13, f.body);
  if (f.tie) R(0, -16, 1, 5, f.tie);
  R(-2, -21, 5, 5, f.skin || '#d8a878'); R(-3, -23, 6, 3, f.hair || '#141014');
  if (f.gun) { R(3, -15 + (f.up || 0), 6, 2, f.body); R(8, -16 + (f.up || 0), 4, 2, '#1a1a1a'); }
  if (f.gun2) { R(3, -12, 6, 2, f.body); R(8, -13, 4, 2, '#1a1a1a'); }
  if (f.dress) R(-5, -10, 10, 8, f.body);
}
function drawMallInterior(cam) {          // world space, behind the tiles
  if (STAGE !== 5) return;
  const t = G.clock, inView = (a, b) => b * TS >= cam.x - 40 && a * TS <= cam.x + VW + 40;
  // --- the shanty village climbing the hill behind the road (not solid: it's the view)
  if (inView(0, S5.hillEnd + 4) && !S5IMG.hill) for (let i = 0; i < 26; i++) {
    const c = 2 + i * 2.1, sx = c * TS, base = s5surf(Math.floor(c)) * TS - 2, rows = 1 + (i * 7) % 3;
    for (let r = 0; r < rows; r++) {
      const w = 26 + (i * 13 % 14), hh = 18 + (i * 5 % 8), y = base - 30 - r * hh - (i % 2) * 8;
      ctx.fillStyle = ['#6e5a4a', '#5a6a72', '#7a6e60', '#6a4e44'][(i + r) % 4]; ctx.fillRect(sx, y, w, hh);
      ctx.fillStyle = ['#8a8a92', '#4a6a9a', '#9a5a44'][(i + r) % 3]; ctx.fillRect(sx - 2, y - 3, w + 4, 3);
      ctx.fillStyle = (i + r) % 3 ? '#2a2228' : 'rgba(255,210,120,0.55)'; ctx.fillRect(sx + 5, y + 6, 6, 5);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(sx, y + hh - 3, w, 3);
    }
  }
  // --- the mall
  const X0 = S5.mall0 * TS + 2, X1 = S5.mall1 * TS;
  if (X1 >= cam.x && X0 <= cam.x + VW) {
    ctx.fillStyle = '#2a2430'; ctx.fillRect(X0, 3 * TS, X1 - X0, 15 * TS);
    ctx.fillStyle = '#342c3c'; for (let y = 3 * TS; y < 18 * TS; y += 10) ctx.fillRect(X0, y, X1 - X0, 1);
    const shops = ['百貨', '時裝', '鐘錶', '電器', '金行', '玩具', '唱片', '眼鏡', '餅家', '茶餐廳', '鞋', '相機'];
    let i = 0;
    for (const row of [18, 13, 8]) for (let x = 105; x + 6 <= S5.mall1 - 1; x += 8) {
      if (x > 140 && x < 158) continue;
      const sx = x * TS, sy = (row - 5) * TS + 4, nm = shops[(i++ * 7 + row) % shops.length], on = Math.sin(t * 3 + i) > -0.85;
      if (sx + 96 < cam.x || sx > cam.x + VW) continue;
      ctx.fillStyle = ['#c84a8a', '#3ad0ff', '#ffd23f', '#7dff5a', '#ff7a3a'][i % 5]; ctx.globalAlpha = on ? 0.9 : 0.35;
      ctx.fillRect(sx + 6, sy, 6 * TS - 12, 10); ctx.globalAlpha = 1;
      ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1a1018'; ctx.fillText(nm, sx + 3 * TS, sy + 5.5);
      ctx.fillStyle = '#3a3248'; ctx.fillRect(sx + 4, sy + 13, 6 * TS - 8, 3 * TS);
      ctx.fillStyle = 'rgba(255,230,180,0.08)'; ctx.fillRect(sx + 4, sy + 13, 6 * TS - 8, 3 * TS);
      for (let k = 0; k < 4; k++) { ctx.fillStyle = ['#e8e0d0', '#c84a4a', '#4a8ac8', '#d8b040'][(k + i) % 4]; ctx.fillRect(sx + 10 + k * 20, sy + 26 + (k % 2) * 6, 10, 14); }
    }
    for (let k = 0; k < 6; k++) { const ax = 143 * TS + k * 40; for (let y = 3 * TS; y < 10 * TS; y += 8) { ctx.fillStyle = Math.sin(t * 4 + y + k) > 0 ? '#ffe08a' : '#8a7040'; ctx.fillRect(ax + Math.sin(y * 0.05 + k) * 6, y, 2, 2); } }
  }
  // --- CENTRAL: shopfront facades, the tram, hanging neon, and the background extras
  if (inView(S5.central0, S5.pier0)) {
    if (!S5IMG.central) for (let c = S5.central0; c < S5.pier0; c += 9) {
      const sx = c * TS, k = (c * 7) % 5, top = (2 + (k % 3)) * TS;
      ctx.fillStyle = ['#3a3440', '#443a36', '#363c48', '#40363e', '#3c3a32'][k]; ctx.fillRect(sx, top, 9 * TS, 18 * TS - top);
      for (let wy = top + 10; wy < 15 * TS; wy += 22) for (let wx = 8; wx < 9 * TS - 14; wx += 24) { const lit = ((c + wy + wx) % 7) < 3; ctx.fillStyle = lit ? 'rgba(255,214,140,0.55)' : '#1e1a24'; ctx.fillRect(sx + wx, wy, 12, 12); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(sx + wx, wy + 12, 12, 2); }
      ctx.fillStyle = '#1a1418'; ctx.fillRect(sx + 4, 16 * TS, 9 * TS - 8, 2 * TS);   // shutters at street level
      ctx.fillStyle = '#2a2428'; for (let y = 16 * TS; y < 18 * TS; y += 3) ctx.fillRect(sx + 4, y, 9 * TS - 8, 1);
    }
    // the tram (its roof is the platform at row 13)
    const TX = 204 * TS, TY = 13 * TS;
    ctx.fillStyle = '#1a6a3a'; ctx.fillRect(TX, TY + 2, 12 * TS, 5 * TS - 4); ctx.fillStyle = '#e8e0c8'; ctx.fillRect(TX, TY + 2, 12 * TS, 6); ctx.fillRect(TX, TY + 2.5 * TS, 12 * TS, 3);
    for (let x = TX + 8; x < TX + 12 * TS - 12; x += 16) { ctx.fillStyle = '#2a3a4a'; ctx.fillRect(x, TY + 12, 10, 12); ctx.fillRect(x, TY + 2.5 * TS + 8, 10, 14); ctx.fillStyle = 'rgba(255,220,150,0.35)'; ctx.fillRect(x, TY + 12, 10, 12); }
    ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.fillText('電車  TRAMWAYS  · 跑馬地', TX + 6 * TS, TY + 2 * TS + 8);
    ctx.fillStyle = '#141414'; for (const wx of [TX + 20, TX + 12 * TS - 20]) { ctx.beginPath(); ctx.arc(wx, 18 * TS - 3, 4, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(TX + 6 * TS, 3 * TS, 1, TY - 3 * TS); ctx.fillRect(S5.central0 * TS, 3 * TS, (S5.pier0 - S5.central0) * TS, 1);   // trolley pole + overhead wire
    // hanging neon (under the sign platforms)
    const signs = [[222, '大富豪', 'GRAND EMPEROR NITECLUB', '#ff5ab0'], [240, '金記茶餐廳', 'KAM KEE CAFE', '#3ad0ff'], [258, '鴻運押', 'PAWN 當', '#ffd23f']];
    for (const [c, cn, en, col] of signs) s5sign(cn, en, c * TS, 12 * TS + 2, 6 * TS, col, Math.sin(t * 17 + c) > -0.85);
    // BACKGROUND EXTRAS (tribute to the 1989 heroic-bloodshed classic — names, faces, likenesses all original)
    //  1) in the café window: the cop and the hitman, guns at each other's heads — a standoff that never ends
    const cx0 = 238 * TS, cy = 16 * TS;
    ctx.fillStyle = '#2a2a34'; ctx.fillRect(cx0, cy - 30, 70, 30); ctx.fillStyle = 'rgba(255,220,160,0.25)'; ctx.fillRect(cx0, cy - 30, 70, 30);
    const sway = Math.sin(t * 1.3) > 0.9 ? 1 : 0;
    drawFigure(cx0 + 22, cy, { body: '#e8e4dc', gun: 1, up: -4, hair: '#141014' }, 1);
    drawFigure(cx0 + 46 + sway, cy, { body: '#5a4a3a', tie: '#c82a2a', gun: 1, up: -4 }, -1);
    ctx.fillStyle = '#1a1418'; ctx.fillRect(cx0 + 28, cy - 6, 14, 2); ctx.fillRect(cx0 + 33, cy - 6, 2, 6);    // the café table between them
    if (Math.sin(t * 0.7) > 0.95) { ctx.fillStyle = '#fff'; ctx.font = 'bold 5px monospace'; ctx.textAlign = 'center'; ctx.fillText('". . ."', cx0 + 35, cy - 34); }
    //  2) up on a balcony: a hitman in a white suit, two pistols, firing at someone we never see
    const bx = 247 * TS, by = 7 * TS;
    ctx.fillStyle = '#2a2228'; ctx.fillRect(bx - 20, by, 60, 3); for (let k = 0; k < 7; k++) ctx.fillRect(bx - 18 + k * 9, by + 3, 1, 10);
    drawFigure(bx + 6, by, { body: '#ece8e0', gun: 1, gun2: 1, coat: 1, hair: '#141014' }, 1);
    if ((t % 0.5) < 0.06) { ctx.fillStyle = '#fff2a0'; ctx.fillRect(bx + 18, by - 17, 4, 3); ctx.fillRect(bx + 18, by - 14, 4, 3); }
    else if ((t % 0.5) > 0.25 && (t % 0.5) < 0.3) { ctx.fillStyle = '#ffd060'; ctx.fillRect(bx + 18, by - 14, 3, 3); }
    //  3) the nightclub window: a singer at the microphone, eyes bandaged
    const nx = 226 * TS, ny = 16 * TS;
    ctx.fillStyle = '#3a1a2a'; ctx.fillRect(nx, ny - 32, 46, 32); ctx.fillStyle = 'rgba(255,90,170,0.22)'; ctx.fillRect(nx, ny - 32, 46, 32);
    drawFigure(nx + 20, ny, { body: '#c83a5a', dress: 1, hair: '#141014' }, 1); ctx.fillStyle = '#f0f0f0'; ctx.fillRect(nx + 18, ny - 20, 6, 1.5);
    ctx.fillStyle = '#888'; ctx.fillRect(nx + 28, ny - 18, 1, 18); ctx.fillStyle = '#222'; ctx.fillRect(nx + 27, ny - 20, 3, 3);
    if (Math.sin(t * 2) > 0) { ctx.fillStyle = '#ffb0d8'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪', nx + 34 + Math.sin(t * 3) * 3, ny - 26 - (t * 8 % 8)); }
    //  4) THE CHAPEL: arched window, a statue, a hundred candles, doves on the roof
    const chx = S5.chapel * TS, chW = 18 * TS, chT = 4 * TS;
    ctx.fillStyle = '#d8d0c0'; ctx.fillRect(chx, chT, chW, 18 * TS - chT); ctx.fillStyle = '#b8b0a0'; ctx.fillRect(chx, chT, chW, 4);
    ctx.fillStyle = '#c8c0b0'; ctx.beginPath(); ctx.moveTo(chx - 6, chT); ctx.lineTo(chx + chW / 2, chT - 46); ctx.lineTo(chx + chW + 6, chT); ctx.fill();
    ctx.fillStyle = '#5a4a3a'; ctx.fillRect(chx + chW / 2 - 1, chT - 70, 3, 26); ctx.fillRect(chx + chW / 2 - 9, chT - 62, 19, 3);
    const mid = chx + chW / 2;
    s5sign('教堂', 'ST. TERESA (OF THE DOVES)', mid - 50, chT + 8, 100, '#ffe8b8', true);
    const glass = ['#c83a3a', '#3a6ac8', '#e8c040', '#3a9a5a'];
    ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.arc(mid, chT + 66, 20, 0, 6.283); ctx.fill();                        // rose window
    for (let k = 0; k < 8; k++) { ctx.fillStyle = glass[k % 4]; ctx.beginPath(); ctx.moveTo(mid, chT + 66); ctx.arc(mid, chT + 66, 17, k * 0.785, k * 0.785 + 0.7); ctx.fill(); }
    ctx.fillStyle = '#ffe8b8'; ctx.beginPath(); ctx.arc(mid, chT + 66, 4, 0, 6.283); ctx.fill();
    const dw = 9 * TS, dx = mid - dw / 2, dT = 18 * TS - 100;                                                                // the great doorway, open: we see inside
    ctx.fillStyle = '#9a8e7a'; ctx.beginPath(); ctx.moveTo(dx - 6, 18 * TS); ctx.lineTo(dx - 6, dT + dw / 2); ctx.arc(mid, dT + dw / 2, dw / 2 + 6, Math.PI, 0); ctx.lineTo(dx + dw + 6, 18 * TS); ctx.fill();
    ctx.fillStyle = '#1a1220'; ctx.beginPath(); ctx.moveTo(dx, 18 * TS); ctx.lineTo(dx, dT + dw / 2); ctx.arc(mid, dT + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw, 18 * TS); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.22 + Math.sin(t * 9) * 0.04; ctx.fillStyle = '#ff9a3a'; ctx.fillRect(dx + 4, 18 * TS - 54, dw - 8, 54); ctx.restore();
    ctx.fillStyle = '#e8e4dc'; ctx.fillRect(mid - 5, 18 * TS - 74, 10, 40); ctx.fillRect(mid - 4, 18 * TS - 84, 8, 10); ctx.fillRect(mid - 9, 18 * TS - 66, 18, 3);   // the statue, arms open
    ctx.fillStyle = '#c8c0b0'; ctx.fillRect(mid - 5, 18 * TS - 74, 2, 40);
    ctx.fillStyle = '#4a3020'; ctx.fillRect(dx + 14, 18 * TS - 30, dw - 28, 30); ctx.fillStyle = '#6a4a30'; ctx.fillRect(dx + 14, 18 * TS - 30, dw - 28, 3);                // the altar
    for (let k = 0; k < 34; k++) {                                                                                                          // candles: a hundred of them, give or take
      const kx = dx + 10 + (k * 37) % (dw - 20), ky = 18 * TS - 30 - (k % 3) * 7 + ((k % 5) === 0 ? 20 : 0);
      ctx.fillStyle = '#f0e8d0'; ctx.fillRect(kx, ky, 2, 6);
      const fl = Math.sin(t * 13 + k * 2.1) * 0.6; ctx.fillStyle = (k % 4) ? '#ffd060' : '#fff2b0'; ctx.fillRect(kx + fl, ky - 3, 2, 3);
    }
    if (!S5.doves) for (let k = 0; k < 9; k++) { ctx.fillStyle = '#ffffff'; ctx.fillRect(chx + 8 + k * 32, chT - 4 + ((k % 2) ? -12 : 0) + k * 0, 5, 3); ctx.fillRect(mid - 30 + k * 7, dT - 4, 4, 3); }
  }
  // --- the pier and the ferry's upper works (the deck itself is drawn in front, see drawFerryHull)
  if (inView(S5.pier0, S5.tst0)) {
    const F0 = S5.ferry0 * TS, F1 = S5.ferry1 * TS, bob = Math.sin(t * 1.6);
    ctx.fillStyle = '#e8e4d8'; ctx.fillRect(F0 + 16, 13 * TS + bob, F1 - F0 - 32, 5 * TS);
    ctx.fillStyle = '#2a6a3a'; ctx.fillRect(F0 + 16, 13 * TS + bob, F1 - F0 - 32, 4);
    for (let x = F0 + 26; x < F1 - 30; x += 18) { ctx.fillStyle = '#2a3a4a'; ctx.fillRect(x, 13 * TS + 14 + bob, 10, 14); ctx.fillStyle = 'rgba(255,220,150,0.3)'; ctx.fillRect(x, 13 * TS + 14 + bob, 10, 14); }
    ctx.fillStyle = '#e8e4d8'; ctx.fillRect(323 * TS, 9 * TS + bob, 10 * TS, 4 * TS); ctx.fillStyle = '#2a3a4a'; ctx.fillRect(324 * TS + 4, 9 * TS + 16 + bob, 8 * TS, 10);
    ctx.fillStyle = '#2a6a3a'; ctx.fillRect(327 * TS + 4, 5 * TS + bob, 10, 4 * TS);                                                     // funnel
    ctx.fillStyle = '#3a3a3a'; ctx.fillRect(S5.pier0 * TS, 10 * TS, 3, 8 * TS); ctx.fillRect(S5.tst0 * TS - 3, 10 * TS, 3, 8 * TS);
  }
  // --- TSIM SHA TSUI: Nathan Road neon stacks and the clock tower
  if (inView(S5.tst0, LW)) {
    if (!S5IMG.tst) for (let c = S5.tst0; c < 436; c += 10) {
      const sx = c * TS, top = (1 + (c % 3)) * TS;
      ctx.fillStyle = ['#2a2632', '#322a30', '#262c36'][c % 3]; ctx.fillRect(sx, top, 10 * TS, 18 * TS - top);
      for (let wy = top + 8; wy < 16 * TS; wy += 18) for (let wx = 6; wx < 10 * TS - 10; wx += 14) { ctx.fillStyle = ((c + wy * 3 + wx) % 5) < 2 ? 'rgba(255,214,140,0.5)' : '#18141c'; ctx.fillRect(sx + wx, wy, 8, 9); }
    }
    const neon = [[362, '彌敦道', 'NATHAN RD', '#ff5ab0'], [372, '金至尊', 'GOLD SUPREME', '#ffd23f'], [380, '大押', 'PAWN', '#3ad0ff'], [392, '海景酒樓', 'SEAVIEW SEAFOOD', '#7dff5a'], [400, '夜總會', 'CLUB BOSSA NOVA', '#ff7a3a'], [416, '錶行', 'WATCHES', '#3ad0ff'], [424, '找換', 'MONEY CHANGER', '#ffd23f']];
    neon.forEach(([c, cn, en, col], k) => s5sign(cn, en, c * TS, (3 + (k % 3) * 2) * TS, 5 * TS, col, Math.sin(t * 19 + k * 3) > -0.8));
    for (const [c] of [[366], [384], [404]]) s5sign(['旺角', '油麻地', '尖沙咀'][(c / 18 | 0) % 3], 'KOWLOON', c * TS, 12 * TS + 2, 6 * TS, '#ff9ae0', Math.sin(t * 11 + c) > -0.8);
    const ctX = 438 * TS, ctT = -2 * TS;                                                                         // the clock tower, behind the arena
    ctx.fillStyle = '#c87a5a'; ctx.fillRect(ctX, ctT + 40, 5 * TS, 18 * TS - ctT - 40); ctx.fillStyle = '#e8d8c0'; for (let y = ctT + 52; y < 18 * TS; y += 20) ctx.fillRect(ctX, y, 5 * TS, 3);
    ctx.fillStyle = '#e8d8c0'; ctx.fillRect(ctX - 4, ctT + 34, 5 * TS + 8, 8); ctx.fillStyle = '#5a4a40'; ctx.fillRect(ctX + 2 * TS + 4, ctT, 8, 34);
    const ccx = ctX + 2.5 * TS, ccy = ctT + 64; ctx.fillStyle = '#f4ecd8'; ctx.beginPath(); ctx.arc(ccx, ccy, 14, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#2a2020'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(t * 0.3 - 1.57) * 10, ccy + Math.sin(t * 0.3 - 1.57) * 10); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(t * 0.03) * 6, ccy + Math.sin(t * 0.03) * 6); ctx.stroke();
    for (let y = ctT + 100; y < 15 * TS; y += 40) { ctx.fillStyle = '#2a1a1a'; ctx.beginPath(); ctx.moveTo(ctX + 26, y + 20); ctx.lineTo(ctX + 26, y + 8); ctx.arc(ctX + 40, y + 8, 14, Math.PI, 0); ctx.lineTo(ctX + 54, y + 20); ctx.fill(); }
  }
}
// ---------------- the sky: day on the hill, dusk in Central, night by the harbour ----------------
const S5IMG = {};
function s5LoadImgs() { if (S5IMG.tried) return; S5IMG.tried = true; for (const [k, v] of [['hill', 'S5_HILL_SRC'], ['central', 'S5_CENTRAL_SRC'], ['tst', 'S5_TST_SRC']]) { let src; try { src = eval(v); } catch (e) {} if (src) { const im = new Image(); im.onload = () => { S5IMG[k] = im; }; im.src = src; } } }
function drawStage5Art(cam) {
  s5LoadImgs();          // v26: three Gemini paintings, cross-faded by zone (hill/mall → Central → harbour & TST)
  const hor = 18 * TS - cam.y, cxT = (cam.x + VW / 2) / TS;
  const zones = [[0, S5IMG.hill], [S5.central0, S5IMG.central], [S5.pier0, S5IMG.tst]];
  if (!zones.some(z => z[1])) return false;
  const draw = (z, alpha) => {
    const [x0, im] = z; if (!im || alpha <= 0) return;
    const h = VH + 12, w = Math.round(im.width * h / im.height), y = Math.round(hor + 3 - 0.83 * h), off = (cam.x - x0 * TS + VW * 0.15) * 0.22, i0 = Math.floor(off / w);
    ctx.globalAlpha = alpha;
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(im, x, y, w, h); }
    if (y > 0) { ctx.fillStyle = '#1a1830'; ctx.fillRect(0, 0, VW, y + 1); }
    ctx.globalAlpha = 1;
  };
  let zi = 0; for (let k = 0; k < zones.length; k++) if (cxT >= zones[k][0]) zi = k;
  let cur = zi; while (cur > 0 && !zones[cur][1]) cur--;
  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  ctx.fillStyle = '#1a1830'; ctx.fillRect(0, 0, VW, VH);
  draw(zones[cur], 1);
  const nx = zones[zi + 1]; if (nx && nx[1]) { const k = clamp((cxT - (nx[0] - 16)) / 16, 0, 1); if (k > 0) draw(nx, k); }
  ctx.imageSmoothingEnabled = pv;
  ctx.fillStyle = 'rgba(20,10,30,0.12)'; ctx.fillRect(0, 0, VW, VH);
  return true;
}
function drawStage5BG(cam) {
  if (drawStage5Art(cam)) return;
  const mx = (cam.x + VW / 2) / TS, dusk = clamp((mx - 170) / 120, 0, 1), night = clamp((mx - 290) / 90, 0, 1);
  const lerpC = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), ch = s => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k); return 'rgb(' + ch(16) + ',' + ch(8) + ',' + ch(0) + ')'; };
  const top = night > 0 ? lerpC('#4a2a5a', '#0a0c22', night) : lerpC('#6aa0d8', '#4a2a5a', dusk), bot = night > 0 ? lerpC('#f08a4a', '#2a2050', night) : lerpC('#e8d0a0', '#f08a4a', dusk);
  const sky = ctx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, top); sky.addColorStop(1, bot); ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
  const hor = 18 * TS - cam.y;
  if (night > 0.2) { ctx.fillStyle = 'rgba(255,255,255,' + (0.6 * night) + ')'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 97 - cam.x * 0.01) % VW, (i * 53) % (hor * 0.5), 1, 1); }
  if (dusk > 0 && night < 1) { const sy = hor - 60 + dusk * 30; ctx.fillStyle = 'rgba(255,200,110,' + (0.9 - night) + ')'; ctx.beginPath(); ctx.arc(VW * 0.7 - cam.x * 0.02 % 60, sy, 26, 0, 6.283); ctx.fill(); }
  if (dusk < 1) { ctx.globalAlpha = 1 - dusk; ctx.fillStyle = '#7a9a8a'; for (let i = -1; i < 8; i++) { const x = i * 90 - (cam.x * 0.05) % 90; ctx.beginPath(); ctx.moveTo(x - 60, hor - 40); ctx.lineTo(x + 20, hor - 150 - (i % 3) * 20); ctx.lineTo(x + 110, hor - 40); ctx.fill(); } ctx.globalAlpha = 1; }
  // skyline: the towers grow taller and the windows light up as the day goes
  for (let i = -1; i < 26; i++) {
    const x = i * 22 - (cam.x * 0.12) % 22, gi = i + Math.floor(cam.x * 0.12 / 22), h = 40 + ((gi * 37) % 60) + dusk * ((gi * 53) % 90);
    ctx.fillStyle = lerpC(gi % 2 ? '#8a8aa0' : '#9a96a8', gi % 2 ? '#1a1830' : '#22203a', Math.max(dusk * 0.6, night));
    ctx.fillRect(x, hor - 40 - h, 18, h);
    if (dusk > 0.4 && gi % 7 === 3) { ctx.beginPath(); ctx.moveTo(x - 2, hor - 40 - h); ctx.lineTo(x + 9, hor - 70 - h); ctx.lineTo(x + 20, hor - 40 - h); ctx.fill(); }      // a faceted, pointy bank tower
    ctx.fillStyle = 'rgba(255,230,170,' + (0.25 + 0.5 * Math.max(dusk * 0.5, night)) + ')';
    for (let y = hor - 36 - h; y < hor - 44; y += 6) for (let k = 0; k < 3; k++) if ((gi + y + k) % 3) ctx.fillRect(x + 2 + k * 5, y, 3, 2);
  }
  if (night > 0) {                     // the harbour: water and the reflected skyline
    ctx.fillStyle = 'rgba(10,20,50,' + night + ')'; ctx.fillRect(0, hor - 40, VW, 40);
    for (let i = 0; i < 30; i++) { ctx.fillStyle = ['rgba(255,90,170,', 'rgba(60,200,255,', 'rgba(255,210,60,'][i % 3] + (0.4 * night) + ')'; ctx.fillRect((i * 41 - cam.x * 0.12) % (VW + 40), hor - 36 + (i % 4) * 8, 10 + (i % 3) * 4, 1); }
  }
  if (dusk < 1) { ctx.globalAlpha = 1 - dusk; for (let i = -1; i < 20; i++) { const x = i * 30 - (cam.x * 0.3) % 30, yb = hor - 18 - ((i * 13) % 20); ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x, yb, 24, 14); ctx.fillStyle = '#8a8a90'; ctx.fillRect(x - 2, yb - 3, 28, 3); ctx.fillStyle = '#3a3028'; ctx.fillRect(x + 6, yb + 5, 5, 6); } ctx.globalAlpha = 1; }
  ctx.fillStyle = lerpC('#3a3a44', '#14121c', night); ctx.fillRect(0, hor - 6, VW, VH);
}
function drawTycoonBody(b, corpse) {           // stage 05 boss: cream suit, slicked hair, gold watch, a pistol and a briefcase
  const moving = !corpse && Math.abs(b.vx) > 10 && b.onGround, s = moving ? Math.round(Math.sin(b.anim * 8) * 3) : 0;
  const SK = '#d8a878', SU = '#e8dcc0', SU2 = '#c8b898';
  px(-8 + s, -12, 7, 12, SU2); px(2 - s, -12, 7, 12, SU2); px(-9 + s, -1, 8, 1, '#2a1a10'); px(2 - s, -1, 8, 1, '#2a1a10');
  px(-11, -30, 22, 19, SU); px(-11, -30, 2, 19, SU2); px(-2, -30, 4, 12, '#c82a2a'); px(-1, -30, 2, 8, '#8a1a1a');
  px(-6, -40, 12, 10, SK); px(-7, -42, 14, 4, '#0e0c10'); px(-7, -40, 2, 3, '#0e0c10'); px(1, -36, 2, 1, '#000'); px(-1, -32, 5, 1, '#7a3a2a');
  const gy = b.aimLow ? -12 : -22;
  px(4, gy - 1, 7, 3, SU); px(10, gy - 2, 3, 3, SK); px(12, gy - 3, 8, 3, '#1a1a1a'); px(5, gy + 1, 3, 1, '#ffd23f');
  if (!corpse && b.fireT > 0) { px(20, gy - 5, 5, 6, '#fff2a0'); }
  px(-16, -16, 7, 10, '#5a3a1a'); px(-14, -17, 3, 1, '#2a1a0a');
}
function skin5(g, t, tx, ty, x, y, i) {          // v26: the hillside reads as a retaining wall + scrub, not a brown block
  if (t !== T.H || tx >= S5.hillEnd) return false;
  const top = tileAt(tx, ty - 1) !== T.H;
  g.fillStyle = '#5a5a52'; g.fillRect(x, y, TS, TS);
  g.fillStyle = '#6a6a60'; const o = (ty % 2) * 6; for (let k = -6 + o; k < TS; k += 12) g.fillRect(x + Math.max(0, k), y + 1, Math.min(10, TS - Math.max(0, k)), 6), g.fillRect(x + Math.max(0, k + 6), y + 9, Math.min(10, TS - Math.max(0, k + 6)), 6);
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 7.5, TS, 1); g.fillRect(x, y + 15.5, TS, 0.6);
  if ((tx * 7 + ty * 3) % 11 === 0) { g.fillStyle = '#2a6a3a'; g.fillRect(x + 3, y + 4, 5, 3); g.fillRect(x + 5, y + 2, 2, 2); }
  if ((tx * 5 + ty) % 13 === 0) { g.fillStyle = 'rgba(40,30,20,0.35)'; g.fillRect(x + 8, y, 1.5, TS); }
  if (top) { g.fillStyle = '#4a7a3a'; g.fillRect(x, y, TS, 2.5); g.fillStyle = '#6a9a4a'; g.fillRect(x + ((tx * 3) % 10), y - 1, 4, 1.5); g.fillStyle = '#8a8478'; g.fillRect(x, y + 2.5, TS, 1); }
  if (thp[i] < HPS[t]) { g.fillStyle = 'rgba(20,10,4,0.75)'; g.fillRect(x + 3, y + 4, 5, 1); g.fillRect(x + 7, y + 5, 1, 4); }
  return true;
}
