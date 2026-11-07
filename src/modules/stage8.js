// =====================================================================
// v36 — STAGE 08: "LAST TRAIN OUT" — a tribute to Asian zombie cinema (school outbreak, the bullet train, the ROTC-uniform dead,
// the athlete zombies, the giant at the end). Original designs only: no characters, no scenes copied.
// Route (~10 min): CHAOS STREET (a plane comes down, cars pile up) -> UP THROUGH THE HIGH SCHOOL -> THE GYM (horde) -> THE STATION
// (leap the pits — the tracks are full of the dead, fall in and they tear you apart) -> THE BULLET TRAIN (4 cars, roof + inside)
// -> THE MALL (athlete zombies) -> THE RED MASS (a giant made of the crowd, half the screen tall).
// =====================================================================
const S8 = { W: 660, school: 72, gym: 172, station: 252, train: 312, mall: 470, gate: 604, boss: 636, door: 656,
  cars: [[312, 344], [348, 380], [384, 416], [420, 452]], pits: [[345, 347], [381, 383], [417, 419], [522, 530]], lib0: 101, lib1: 159, crowds: [] };
const ZTYPES = new Set(['zomb', 'zrotc', 'zath']);
Object.assign(ESPEC, { zomb: { w: 10, h: 20, hp: 3 }, zrotc: { w: 10, h: 21, hp: 6 }, zath: { w: 10, h: 20, hp: 4 } });
const LOCKS8 = [
  { x0: 76, x1: 100, trig: 82, waves: [[['zomb', 96], ['zomb', 78], ['zomb', 98], ['zomb', 80]], [['zomb', 97], ['zrotc', 79], ['zomb', 95], ['zomb', 92]]] },
  { x0: 176, x1: 248, trig: 190, waves: [
    [['zomb', 240], ['zomb', 244], ['zomb', 180], ['zomb', 184], ['zrotc', 236]],
    [['zrotc', 244], ['zrotc', 180], ['zomb', 230], ['zomb', 190], ['zomb', 238], ['zomb', 186]],
    [['zath', 244], ['zrotc', 240], ['zrotc', 182], ['zomb', 200], ['zomb', 226], ['zomb', 212], ['zomb', 218]]
  ] },
  { x0: 348, x1: 380, trig: 356, waves: [[['zomb', 376], ['zomb', 352], ['zrotc', 374]], [['zomb', 377], ['zomb', 351], ['zomb', 370], ['zrotc', 354]]] },
  { x0: 420, x1: 452, trig: 428, waves: [[['zrotc', 448], ['zomb', 424], ['zomb', 446]], [['zath', 448], ['zomb', 424], ['zrotc', 444], ['zomb', 430]]] },
  { x0: 536, x1: 592, trig: 546, waves: [
    [['zath', 588], ['zath', 540], ['zomb', 580], ['zomb', 560]],
    [['zath', 588], ['zath', 586], ['zath', 540], ['zrotc', 570], ['zomb', 550]],
    [['zath', 588], ['zath', 542], ['zath', 584], ['zath', 546], ['zrotc', 566]]
  ] }
];
// ---------- shared painted-backdrop helper (also used by stage 09 and the stage 07 extension)
const BGIMG = {};
function loadBG(key, src) { if (!src || BGIMG[key]) return; const im = new Image(); im.onload = () => { BGIMG[key] = im; }; im.src = src; }
function paintZones(cam, zones, o) {        // zones: [[tileX, imgKey, skyColour, fallbackFn]] — crossfade to the next zone over 14 tiles
  o = o || {};
  const cxT = (cam.x + VW / 2) / TS, hor = o.hor != null ? o.hor : 18 * TS - cam.y;
  const draw = (z, alpha) => {
    const [x0, key, sk, fb] = z, im = BGIMG[key]; if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    if (!im) { if (fb) fb(cam, hor); else { ctx.fillStyle = sk; ctx.fillRect(0, 0, VW, VH); } ctx.globalAlpha = 1; return; }
    const h = Math.round(Math.max(hor + 3, 60) * (o.scale || 1)), w = Math.round(im.width * h / im.height);
    const off = (o.auto ? G.clock * o.auto : 0) + (cam.x - x0 * TS + VW * 0.15) * (o.par || 0.22), i0 = Math.floor(off / w), y0 = Math.round((o.hor != null ? hor : hor + 3) - h);
    ctx.fillStyle = sk; ctx.fillRect(0, 0, VW, VH);
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, 0); ctx.scale(-1, 1); ctx.drawImage(im, 0, y0, w, h); ctx.restore(); } else ctx.drawImage(im, x, y0, w, h); }
    ctx.globalAlpha = 1;
  };
  let zi = 0; for (let k = 0; k < zones.length; k++) if (cxT >= zones[k][0]) zi = k;
  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  draw(zones[zi], 1); const nx = zones[zi + 1]; if (nx) { const k = clamp((cxT - (nx[0] - 14)) / 14, 0, 1); if (k > 0) draw(nx, k); }
  ctx.imageSmoothingEnabled = pv;
}
(() => { for (const [k, v] of [['s8chaos', 'S8_CHAOS_SRC'], ['s8school', 'S8_SCHOOL_SRC'], ['s8gym', 'S8_GYM_SRC'], ['s8station', 'S8_STATION_SRC'], ['s8ride', 'S8_RIDE_SRC'], ['s8mall', 'S8_MALL_SRC'], ['s8library', 'S8_LIBRARY_SRC'], ['s8carin', 'S8_CARIN_SRC'], ['s8platform', 'S8_PLATFORM_SRC']]) { try { loadBG(k, eval('typeof ' + v + " !== 'undefined' ? " + v + ' : null')); } catch (e) { } } })();
const s8zone = tx => (tx >= S8.lib0 && tx <= S8.lib1) ? 'library' : tx < S8.school ? 'chaos' : tx < S8.gym ? 'school' : tx < S8.station ? 'gym' : tx < S8.train ? 'station' : tx < S8.mall - 18 ? 'train' : tx < S8.gate ? 'mall' : 'arena';
const inPit8 = tx => S8.pits.some(([a, b]) => tx >= a && tx <= b);

function buildStage8(E, set, fill, en, br, cp, hint) {
  LOCKS = LOCKS8;
  Object.assign(S8, { arena: 'idle', t: 0, plane: null, carCrash: false, spawnT: 3, hands: [], ending: false });
  fill(0, LW - 1, 18, LH - 1, T.G); fill(0, 1, 0, 17, T.S); fill(LW - 2, LW - 1, 0, 17, T.S);
  for (const [a, b] of S8.pits) fill(a, b, 18, LH - 1, T.E);
  // ---------- A. CHAOS STREET
  hint(4, 12, 'A/D MOVE   W / LEFT CTRL JUMP.   SOMETHING JUST FELL OUT OF THE SKY.');
  hint(20, 10, 'THEY ARE SLOW. THERE ARE A LOT OF THEM. DO NOT GET SURROUNDED.');
  for (const [a, b, h] of [[14, 16, 1], [26, 29, 2], [40, 42, 1], [52, 56, 2], [62, 64, 1]]) fill(a, b, 18 - h, 17, T.B);   // car wrecks / rubble
  fill(30, 34, 14, 14, T.P); fill(46, 50, 13, 13, T.P);
  for (const x of [12, 22, 33, 38, 44, 58, 66]) br(x, 18);
  for (const x of [24, 36, 48, 60, 68]) en('zomb', x, 18);
  cp(36); cp(70);
  // ---------- B. THE HIGH SCHOOL: in through the 2nd-floor door, then THE LIBRARY — jump shelf to shelf over the crowd
  hint(76, 10, 'THE SCHOOL.  CLIMB TO THE 2ND-FLOOR DOOR.  (HOLD W / UP ON A LADDER)');
  fill(100, 100, 3, 17, T.B); fill(160, 160, 3, 17, T.B); fill(100, 160, 3, 3, T.B);     // walls + roof
  fill(100, 100, 9, 12, T.E); fill(160, 160, 9, 12, T.E);                                 // 2nd-floor doors in and out
  fill(101, 159, 8, 8, T.B);                                                              // the 3rd floor (library ceiling)
  fill(94, 99, 13, 13, T.P); addLadder(95, 13, 18);                                       // outside landing + ladder
  for (let k = 0; k < 3; k++) fill(97 - k * 2, 98 - k * 2, 17 - k * 1, 17 - k * 1, T.P);   // a few crates to hop up too
  fill(161, 166, 13, 13, T.P); addLadder(165, 13, 18);                                     // outside landing on the far side
  // the shelves: tops at row 13, gaps full of the dead between them
  let x = 101; S8.crowds = []; const shelfW = [5, 4, 4, 3, 4, 3, 4, 3, 5, 4], gapW = [3, 3, 4, 3, 4, 3, 4, 4, 3];
  for (let i = 0; i < shelfW.length && x < 159; i++) {
    const w = Math.min(shelfW[i], 159 - x + 1); fill(x, x + w - 1, 13, 17, T.S); x += w;
    if (i < gapW.length && x < 156) { const g = gapW[i]; S8.crowds.push([x, x + g - 1]); x += g; }
  }
  if (x <= 159) fill(x, 159, 13, 17, T.S);
  fill(102, 102, 8, 8, T.E); addLadder(102, 8, 13);                                       // ladder up to the 3rd floor (the safe-ish way)
  fill(157, 157, 8, 8, T.E); addLadder(157, 8, 13);
  for (const xx of [110, 122, 134, 146]) en('zomb', xx, 8); en('zrotc', 128, 8);
  br(140, 8); br(164, 18);
  hint(103, 10, 'THE LIBRARY.  SHELF TO SHELF.  DO NOT TOUCH THE FLOOR.');
  cp(98); cp(168);
  // ---------- C. THE GYM (ambush)
  hint(170, 10, 'THE GYM.  THE CADET CLUB IS STILL IN UNIFORM.  KHAKI ONES TAKE MORE HITS.');
  fill(174, 250, 2, 2, T.S); fill(174, 174, 2, 13, T.S); fill(250, 250, 2, 13, T.S);
  fill(176, 182, 15, 15, T.P); fill(178, 182, 12, 12, T.P); fill(242, 248, 15, 15, T.P); fill(242, 246, 12, 12, T.P);   // bleachers
  fill(208, 216, 13, 13, T.P);
  br(196, 18); br(228, 18); br(212, 13);
  cp(254);
  // ---------- D. THE STATION: leap the pits
  hint(256, 10, 'THE PLATFORM.  THE LAST TRAIN IS BOARDING.  GET ON.');
  for (const x of [266, 284, 300]) { fill(x, x + 2, 15, 15, T.P); addLadder(x + 1, 15, 18); }   // benches/kiosks to stand on
  fill(270, 280, 12, 12, T.P); addLadder(275, 12, 18);                                         // the overhead walkway
  for (const x of [262, 280, 298, 304]) en('zomb', x, 18); en('zrotc', 300, 18);
  br(260, 18); br(282, 18); br(296, 18);
  cp(298);
  // ---------- E. THE BULLET TRAIN (it is moving; the gaps between cars are deadly)
  hint(314, 9, 'ALL ABOARD.  INSIDE THE CARS OR ON THE ROOF.  MIND THE GAPS.');
  for (const [a, b] of S8.cars) { fill(a, b, 11, 11, T.P); fill(a, a, 12, 13, T.S); fill(b, b, 12, 13, T.S); addLadder(a + 2, 11, 18); addLadder(b - 2, 11, 18); }   // roof + door frames + ladders to the roof
  for (const [a, b] of S8.cars) { en('zomb', a + 8, 18); en('zomb', a + 20, 18); en('zomb', a + 14, 11); }
  en('zrotc', 400, 18); en('zath', 410, 18);
  br(330, 18); br(366, 18); br(402, 18); br(438, 18);
  cp(346); cp(418); cp(456);
  // ---------- F. THE MALL (athletes)
  hint(472, 10, 'THE MALL.  THE ONES IN SPORTSWEAR RUN.  FAST.');
  fill(480, 512, 13, 13, T.P); fill(536, 560, 13, 13, T.P); fill(566, 596, 13, 13, T.P);
  for (let k = 0; k < 5; k++) fill(474 + k, 475 + k, 17 - k, 17 - k, T.P);   // escalator
  fill(518, 534, 15, 15, T.P);                                             // a bridge over the broken floor
  addLadder(482, 13, 18); addLadder(540, 13, 18); addLadder(570, 13, 18); addLadder(594, 13, 18); addLadder(180, 12, 18); addLadder(244, 12, 18);
  for (const x of [486, 498, 508, 556, 576]) en('zomb', x, 18); for (const x of [494, 584]) en('zath', x, 13); en('zath', 514, 18);
  br(490, 18); br(512, 13); br(548, 18); br(578, 13);
  cp(470); cp(534); cp(598);
  // ---------- G. THE RED MASS
  fill(S8.door, S8.door + 1, 0, 17, T.D);
  E.start = { x: 4 * TS, y: 18 * TS - PC.standH };
  E.flag = { x: (S8.door - 2) * TS, y: 18 * TS };
  return E;
}
// ---------------- zombies
function mkZomb(type, tx, ty, rise) {
  const e = mkEnemy(type, tx, ty); e.v = (Math.random() * 3) | 0; e.alerted = true; e.state = 'hunt'; e.spd = type === 'zath' ? rnd(150, 175) : type === 'zrotc' ? rnd(30, 40) : rnd(20, 34);
  e.biteCd = 0; e.groan = rnd(2, 8); if (rise) { e.rise = 0.7; e.riseMax = 0.7; } e.face = -1; return e;
}
function spawnZomb(type, tx, rise) {
  const p = G.player, ref = p ? p.y - 24 : Math.max(0, G.cam.y) + 4;
  let gy = groundBelow(tx * TS + 8, ref); if (gy >= LH * TS || gy - (p ? p.y + p.h : 0) > 90) gy = groundBelow(tx * TS + 8, Math.max(0, G.cam.y) + 4);
  if (gy >= LH * TS) return null; if (STAGE === 8 && S8.crowds.some(([a, b]) => tx >= a - 1 && tx <= b + 1)) return null;
  const e = mkZomb(type, tx, Math.round(gy / TS), rise); G.enemies.push(e); if (rise) dust(tx * TS + 8, gy, 5, 6); return e;
}
function zInit(e) { if (e.spd != null) return; e.v = Math.abs(Math.round(e.homeX / 16)) % 3; e.spd = e.type === 'zath' ? rnd(150, 175) : e.type === 'zrotc' ? rnd(30, 40) : rnd(20, 34); e.biteCd = 0; e.groan = rnd(2, 8); e.alerted = true; }
function updZomb(e, dt) {
  zInit(e);
  const p = G.player, dx = p.x + p.w / 2 - (e.x + e.w / 2), ad = Math.abs(dx), dy = (p.y + p.h) - (e.y + e.h);
  e.biteCd -= dt; e.cd -= dt; e.groan -= dt;
  if (e.rise > 0) { e.rise -= dt; e.vx = 0; return; }
  if (e.groan <= 0) { e.groan = rnd(5, 12); if (onScreen(e, 0) && Math.random() < 0.35) popup(e.x + 5, e.y - 8, ['UUUHH...', 'GRRAAH', 'HRRRK', 'AAARGH'][(Math.random() * 4) | 0], '#9ac89a'); }
  const sees = !p.dead && ad < (e.type === 'zath' ? 300 : 240) && Math.abs(dy) < 90;
  if (sees) {
    e.face = sign(dx) || e.face;
    const sp = e.type === 'zath' ? (ad < 260 ? e.spd : 60) : e.spd * (ad < 40 ? 1.4 : 1);
    e.vx = approach(e.vx, e.face * sp, (e.type === 'zath' ? 900 : 300) * dt);
    if (e.type === 'zath' && e.onGround && ad < 70 && e.cd <= 0 && Math.abs(dy) < 30) { e.vy = -300; e.vx = e.face * 230; e.cd = rnd(1.2, 2); }   // the flying tackle
    if (e.hitWall && e.onGround) e.vy = e.type === 'zath' ? -420 : -250;
    if (dy < -40 && e.onGround && ad < 30 && e.type === 'zath') e.vy = -460;
  } else {
    if (e.onGround && Math.random() < dt * 0.5) e.patrolDir = -e.patrolDir;
    e.vx = approach(e.vx, e.patrolDir * 12, 200 * dt); e.face = e.patrolDir || e.face; if (e.hitWall) e.patrolDir *= -1;
  }
  if (!p.dead && e.biteCd <= 0 && overlap(e, p)) { e.biteCd = 1.0; hurtPlayer(1, e.x + e.w / 2, true); if (p.hp > 0) popup(p.x + 5, p.y - 14, 'BITE!', '#ff5a5a'); }
}
function drawZomb(e, ph, moving) {
  zInit(e);
  const SKZ = ['#a8b89a', '#b8b0a0', '#9aa894'][e.v], t = G.clock, bob = moving ? Math.sin(ph * 0.6) * 1 : 0;
  const pal = e.type === 'zrotc' ? { top: '#8a7a4a', top2: '#6a5a34', pnt: '#7a6a40', shoe: '#2a2216' }
    : e.type === 'zath' ? { top: ['#d83a2a', '#2a5ad8', '#f0f0f0'][e.v], top2: '#ffffff', pnt: '#1a1a22', shoe: '#e8e8e8' }
    : [{ top: '#2a3458', top2: '#e8e8e8', pnt: '#4a4a52', shoe: '#1a1a1a' }, { top: '#e8e8e0', top2: '#2a3a6a', pnt: '#2a3a6a', shoe: '#1a1a1a' }, { top: '#e8e8e0', top2: '#3a2a2a', pnt: '#22222a', shoe: '#1a1a1a' }][e.v];
  if (e.rise > 0) { const k = 1 - e.rise / (e.riseMax || 0.7); ctx.save(); ctx.beginPath(); ctx.rect(-12, -40, 24, 40); ctx.clip(); ctx.translate(0, (1 - k) * 22); }
  if (e.dead) { px(-5, -10, 10, 8, pal.top); px(-3, -14, 6, 4, SKZ); px(-2, -12, 2, 1, '#6a1010'); if (e.rise > 0) ctx.restore(); return; }
  legs(ph * (e.type === 'zath' ? 1.4 : 0.55), moving, !e.onGround, e.vy, pal.pnt, pal.shoe, 7);
  px(-4, -15 + bob, 8, 8, pal.top); px(-4, -15 + bob, 1, 8, pal.top2);
  if (e.type === 'zath') { px(-1, -13 + bob, 3, 3, pal.top2); }
  if (e.type !== 'zath' && e.type !== 'zrotc') { px(-1, -15 + bob, 2, 3, pal.top2); px(0, -14 + bob, 1, 2, '#a02020'); }
  px(-2, -11 + bob, 3, 2, '#7a1818'); px(2, -9 + bob, 2, 1, '#7a1818');            // blood
  const reach = Math.sin(t * 2 + e.x) * 1;
  px(1, -14 + bob + reach, 9, 2, pal.top); px(9, -14 + bob + reach, 2, 2, SKZ); px(0, -12 + bob - reach, 8, 2, pal.top); px(8, -12 + bob - reach, 2, 2, SKZ);   // arms out
  px(-3, -21 + bob, 6, 6, SKZ); px(-4, -22 + bob, 7, 2, e.type === 'zath' ? '#1a1414' : '#141010');
  if (e.type === 'zrotc') { px(-4, -23 + bob, 8, 2, '#6a5a34'); px(1, -23 + bob, 4, 1, '#5a4a2a'); }
  if (e.type === 'zath') px(-4, -20 + bob, 8, 1, '#ffffff');                        // headband
  px(1, -19 + bob, 1, 1, '#f0f0d0'); px(-1, -19 + bob, 1, 1, '#f0f0d0'); px(0, -17 + bob, 3, 1, '#5a0a0a');   // white eyes, open mouth
  if (e.rise > 0) { ctx.restore(); px(-7, -1, 14, 2, '#3a2a1a'); }
}
// ---------------- the stage loop
function updStage8(dt) {
  if (STAGE !== 8 || G.mode !== 'play') return;
  const p = G.player; S8.t += dt;
  // the opening: a burning airliner comes down behind the city, then a car spins out into the barrels
  if (!S8.plane && S8.t > 0.6) { S8.plane = { t: 0, done: false }; popup(p.x + 40, p.y - 50, 'WHAT WAS THAT?!', '#ffd23f', true); audio.play('warn'); }
  if (S8.plane && !S8.plane.done) { S8.plane.t += dt; if (S8.plane.t > 3.0) { S8.plane.done = true; shake(0.7); audio.play('boom'); hitstop(0.05); FXflash8 = 0.6; later(0.3, () => audio.play('boom')); } }
  if (!S8.carCrash && p.x > 18 * TS) {
    S8.carCrash = { x: G.cam.x + VW + 40, y: 18 * TS, t: 0 }; audio.play('rev');
  }
  if (S8.carCrash && S8.carCrash !== true) {
    const C = S8.carCrash; C.t += dt; C.x -= 420 * dt;
    if (C.x < 27 * TS) { explode(27 * TS, 17 * TS, 40, 6, { byPlayer: true }); debris(27 * TS, 17 * TS, 16, ['#c8c8d0', '#3a3a40', '#e83a2a', '#ffb020'], 1.4); shake(0.6); S8.carCrash = true; popup(27 * TS, 13 * TS, 'CRASH!', '#ff5a3a', true); for (let k = 0; k < 3; k++) spawnZomb('zomb', 34 + k * 3, true); }
  }
  // the horde keeps coming in the open zones
  const z = s8zone(Math.floor((p.x + p.w / 2) / TS));
  if (!G.lock && !p.dead && (z === 'chaos' || z === 'school' || z === 'station' || z === 'mall') && S8.arena === 'idle') {
    S8.spawnT -= dt;
    if (S8.spawnT <= 0) {
      S8.spawnT = z === 'mall' ? rnd(2.2, 3.2) : rnd(1.8, 2.8);
      const near = G.enemies.filter(e => !e.dead && ZTYPES.has(e.type) && Math.abs(e.x - p.x) < 360).length;
      if (near < 14) {
        const ahead = Math.random() < 0.7, tx = Math.floor((ahead ? G.cam.x + VW + 12 : G.cam.x - 12) / TS);
        if (tx > 3 && tx < S8.gate - 2 && !inPit8(tx)) spawnZomb(z === 'mall' && Math.random() < 0.4 ? 'zath' : Math.random() < 0.15 ? 'zrotc' : 'zomb', tx, Math.random() < 0.4);
      }
    }
  }
  // the pits: fall in and the hands tear you apart (and throw the pieces back up)
  if (!p.dead && p.y + p.h > 19 * TS + 4 && inPit8(Math.floor((p.x + p.w / 2) / TS))) {
    p.inv = 0; hurtPlayer(99, p.x + p.w / 2, true);
    const cx = p.x + p.w / 2, cy = 19 * TS;
    gore(cx, cy, 30, 1.8); debris(cx, cy, 18, ['#c83a3a', '#8a1a1a', heroOf(p).col, '#e8c8a8'], 1.8);
    for (let i = 0; i < 10; i++) part('debris', cx + rnd(-8, 8), cy, rnd(-120, 120), rnd(-520, -320), 1.4, 3, i % 2 ? '#a01818' : heroOf(p).col, { g: 900 });
    popup(cx, cy - 40, 'TORN APART!', '#ff3a3a', true); audio.play('die'); shake(0.4);
  }
  // the library: the floor between the shelves is a crowd of the dead — touch it and they drag you down
  if (!p.dead && p.y + p.h > 14 * TS + 6 && p.y + p.h <= 18 * TS + 2) { const tx = Math.floor((p.x + p.w / 2) / TS); if (S8.crowds.some(([a, b]) => tx >= a && tx <= b)) {
    p.inv = 0; hurtPlayer(99, p.x + p.w / 2, true); const cx = p.x + p.w / 2, cy = p.y + p.h;
    gore(cx, cy, 26, 1.6); for (let i = 0; i < 10; i++) part('debris', cx + rnd(-8, 8), cy, rnd(-140, 140), rnd(-480, -300), 1.4, 3, i % 2 ? '#a01818' : heroOf(p).col, { g: 900 });
    popup(cx, cy - 50, 'DRAGGED DOWN!', '#ff3a3a', true); audio.play('die'); shake(0.4); } }
  for (const e of G.enemies) if (!e.dead && e.y + e.h > 19 * TS + 4 && inPit8(Math.floor((e.x + e.w / 2) / TS))) { e.hp = 0; e.gibbed = true; killEnemy(e, 0, true); gore(e.x + e.w / 2, 19 * TS, 12, 1.4); }
  // the boss arena
  if (S8.arena === 'idle' && p.x > (S8.gate + 4) * TS && !p.dead) {
    S8.arena = 'fight'; for (let ty = 3; ty <= 17; ty++) setTile(S8.gate, ty, T.S);
    dust(S8.gate * TS + 8, 18 * TS, 10, 8); audio.play('clang'); shake(0.3);
    G.cam.lock = { x0: S8.gate * TS, x1: (S8.door + 2) * TS };
    for (const e of G.enemies) if (!e.dead && e.x < S8.gate * TS) { e.dead = true; e.deadT = 99; }
    later(1.0, spawnRedMass);
  }
}
let FXflash8 = 0;
// ---------------- THE RED MASS: a giant made of fused bodies, with long braided arms (boss)
function spawnRedMass() {
  const b = { type: 'redmass', name: 'THE RED MASS', x: (S8.gate + 18) * TS, y: 18 * TS - 130, w: 96, h: 130, vx: 0, vy: 0, hp: 380, maxHp: 380, face: -1,
    state: 'enter', t: 2.0, flash: 0, onGround: true, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, cd: 0, rise: 0,
    arms: [0, 1, 2, 3].map(i => ({ i, st: 'idle', t: 0, hx: 0, hy: 0, tx: 0, ty: 0, warn: null, hitDone: false })) };
  for (const A of b.arms) { const s = redShoulder(b, A.i); A.hx = s.x; A.hy = s.y + 40; }
  G.boss = b; G.banner = { t: 0, title: 'THE RED MASS', sub: 'THE CROWD BECAME ONE THING. IT IS STILL HUNGRY.' };
  audio.play('roar'); shake(0.8);
}
function redShoulder(b, i) { const cx = b.x + b.w / 2, top = b.y + 26; return { x: cx + [-30, -14, 14, 30][i] * (b.face < 0 ? 1 : -1), y: top + [10, -6, -6, 10][i] }; }
function updRedMass(b, dt) {
  const p = G.player, pcx = p.x + p.w / 2, pfy = p.y + p.h, fl = 18 * TS;
  b.flash -= dt; b.anim += dt; b.t -= dt; b.cd -= dt;
  if (b.state === 'enter') { b.rise = Math.min(1, b.rise + dt * 0.6); if (Math.random() < dt * 20) dust(b.x + rnd(0, b.w), fl, 2, 6); if (b.t <= 0) { b.state = 'idle'; b.t = 1.0; } armsIdle(b, dt); return; }
  if (b.dying > 0) {
    b.dying -= dt; if (Math.random() < dt * 14) { gore(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 6, 1.2); explode(b.x + rnd(0, b.w), b.y + rnd(20, b.h), 20, 0, { noDmg: true, quiet: true }); }
    b.rise = Math.max(0, b.dying / 2);
    if (b.dying <= 0) {
      b.dead = true; explode(b.x + b.w / 2, b.y + b.h - 20, 70, 30, { byPlayer: true }); gore(b.x + b.w / 2, b.y + b.h - 30, 60, 2.2);
      for (let ty = 0; ty <= 17; ty++) for (const tx of [S8.door, S8.door + 1]) if (tileAt(tx, ty) === T.D) setTile(tx, ty, T.E);
      G.exitOpen = true; G.cam.lock = null; popup(b.x + b.w / 2, 9 * TS, 'THE LAST TRAIN IS WAITING >>', '#7dff8a', true);
      for (const e of G.enemies) if (!e.dead) { e.hp = 0; killEnemy(e, 1, true); }
    }
    return;
  }
  if (b.hp < b.maxHp * 0.5 && b.phase === 1) { b.phase = 2; popup(b.x + b.w / 2, b.y - 10, 'IT SPLITS OPEN!', '#ff3a3a', true); audio.play('roar'); shake(0.6); }
  const fast = b.phase === 2 ? 0.7 : 1;
  b.face = pcx < b.x + b.w / 2 ? -1 : 1;
  if (!p.dead && overlap({ x: b.x + 10, y: b.y + 30, w: b.w - 20, h: b.h - 30 }, p)) hurtPlayer(1, b.x + b.w / 2, true);
  // choose an attack when idle
  if (b.state === 'idle' && b.t <= 0) {
    const k = ['slam', 'sweep', 'slam', 'shed', 'step', 'grab'][b.atk++ % 6];
    if (k === 'slam') { const n = b.phase === 2 ? 2 : 1; for (let j = 0; j < n; j++) startArm(b, 'slam', j === 0 ? pcx : pcx + rnd(-60, 60)); b.t = 1.5 * fast; }
    else if (k === 'sweep') { startArm(b, 'sweep', pcx); b.t = 1.8 * fast; }
    else if (k === 'grab') { startArm(b, 'grab', pcx); b.t = 1.3 * fast; }
    else if (k === 'shed') { b.state = 'shed'; b.t = 0.9; popup(b.x + b.w / 2, b.y - 6, '*BODIES FALL OFF IT*', '#ff9a9a'); audio.play('roar'); }
    else { b.state = 'step'; b.t = 0.8; }
  }
  if (b.state === 'shed' && b.t <= 0) { for (let k = 0; k < (b.phase === 2 ? 4 : 3); k++) { const e = spawnZomb(Math.random() < 0.3 ? 'zath' : 'zomb', Math.floor((b.x + rnd(0, b.w)) / TS), false); if (e) { e.vy = -260; e.vx = rnd(-160, -40) * (b.face < 0 ? 1 : -1); e.y = b.y + 30; } } b.state = 'idle'; b.t = 0.9 * fast; }
  if (b.state === 'step') { const L = G.cam.lock; b.x = clamp(b.x + b.face * 40 * dt, (L ? L.x0 : 0) + 30, (L ? L.x1 : LW * TS) - b.w - 30); if (Math.floor(b.anim * 3) !== Math.floor((b.anim - dt) * 3)) { shake(0.25); audio.play('slam'); dust(b.x + b.w / 2, fl, 6, 10); } if (b.t <= 0) { b.state = 'idle'; b.t = 0.5; } }
  // arms
  for (const A of b.arms) updArm(b, A, dt, fast);
}
function startArm(b, kind, x) {
  const free = b.arms.filter(A => A.st === 'idle'); if (!free.length) return;
  const A = free[(Math.random() * free.length) | 0], fl = 18 * TS, L = G.cam.lock;
  x = clamp(x, (L ? L.x0 : 0) + 12, (L ? L.x1 : LW * TS) - 12);
  A.st = kind; A.t = 0; A.hitDone = false; A.kx = x;
  if (kind === 'slam') { A.warn = { x, t: 0 }; audio.play('warn'); }
  if (kind === 'sweep') { A.warn = { x: -1, sweep: true, t: 0 }; audio.play('warn'); popup(b.x + b.w / 2, b.y + 10, 'JUMP!', '#ffd23f', true); }
  if (kind === 'grab') audio.play('whoosh');
}
function armsIdle(b, dt) { for (const A of b.arms) { const s = redShoulder(b, A.i); A.tx = s.x + Math.sin(b.anim * 1.3 + A.i) * 30 + (A.i < 2 ? -40 : 40); A.ty = s.y + 40 + Math.cos(b.anim * 1.7 + A.i * 2) * 20; A.hx += (A.tx - A.hx) * Math.min(1, dt * 3); A.hy += (A.ty - A.hy) * Math.min(1, dt * 3); } }
function updArm(b, A, dt, fast) {
  const p = G.player, fl = 18 * TS, s = redShoulder(b, A.i);
  A.t += dt; if (A.warn) A.warn.t += dt;
  const hit = (x, y, r) => { if (!p.dead && Math.abs(p.x + p.w / 2 - x) < r && p.y < y + 8 && p.y + p.h > y - r) hurtPlayer(1, x, true); };
  if (A.st === 'idle') { A.tx = s.x + Math.sin(b.anim * 1.3 + A.i) * 26 + (A.i < 2 ? -36 : 36) * (b.face < 0 ? 1 : -1); A.ty = s.y + 36 + Math.cos(b.anim * 1.7 + A.i * 2) * 18; }
  else if (A.st === 'slam') {
    const tele = 0.75 * fast;
    if (A.t < tele) { A.tx = A.kx; A.ty = fl - 150; }
    else if (A.t < tele + 0.12) { A.tx = A.kx; A.ty = fl - 4; }
    else { A.tx = A.kx; A.ty = fl - 4; if (!A.hitDone) { A.hitDone = true; A.warn = null; shake(0.45); audio.play('slam'); hitstop(0.04); dust(A.kx, fl, 12, 14); hit(A.kx, fl, 26); slamWaveAt(A.kx, fl, 70); for (let tx = Math.floor((A.kx - 16) / TS); tx <= Math.floor((A.kx + 16) / TS); tx++) if (DESTRUCT[tileAt(tx, 17)]) damageTile(tx, 17, 2); } if (A.t > tele + 0.9) A.st = 'idle'; }
  } else if (A.st === 'sweep') {
    const tele = 0.8 * fast, dur = 0.9, L = G.cam.lock, far = b.face < 0 ? (L ? L.x0 : 0) + 10 : (L ? L.x1 : LW * TS) - 10;
    if (A.t < tele) { A.tx = s.x + (b.face < 0 ? 30 : -30); A.ty = fl - 10; }
    else if (A.t < tele + dur) { const k = (A.t - tele) / dur; A.tx = s.x + (far - s.x) * Math.sin(k * Math.PI * 0.5); A.ty = fl - 8; hit(A.hx, fl - 8, 16); if (Math.random() < dt * 40) dust(A.hx, fl, 1, 6); }
    else { A.warn = null; A.st = 'idle'; }
  } else if (A.st === 'grab') {
    if (A.t < 0.35) { A.tx = s.x; A.ty = s.y - 20; }
    else if (A.t < 0.75) { A.tx = A.kx; A.ty = p.y + p.h / 2; hit(A.hx, A.hy + 8, 14); }
    else A.st = 'idle';
  }
  const sp = A.st === 'slam' && A.t > 0.75 * fast ? 30 : A.st === 'sweep' ? 18 : A.st === 'grab' ? 12 : 3;
  A.hx += (A.tx - A.hx) * Math.min(1, dt * sp); A.hy += (A.ty - A.hy) * Math.min(1, dt * sp);
}
function slamWaveAt(x, y, r) { for (const e of G.enemies) if (!e.dead && Math.abs(e.x + e.w / 2 - x) < r && Math.abs(e.y + e.h - y) < 20) { damageEnemy(e, 3, x, true); } const p = G.player; if (!p.dead && p.onGround && Math.abs(p.x + p.w / 2 - x) < r && Math.abs(p.y + p.h - y) < 6) { p.vy = -200; } }
function drawRedMass(b) {
  // drawBoss is wrapped in a 1.3x chibi scale about the feet; undo it so the hitbox and the drawing match (half the screen tall)
  const fx = b.x + b.w / 2, fy = b.y + b.h, t = G.clock, k = 1 / CHIBI.boss;
  ctx.save(); ctx.translate(fx, fy); ctx.scale(k, k); ctx.translate(-fx, -fy);
  const sink = (1 - (b.rise == null ? 1 : b.rise)) * b.h, FL = b.flash > 0 && Math.floor(t * 30) % 2 === 0;
  ctx.save(); ctx.beginPath(); ctx.rect(b.x - 200, b.y - 200, b.w + 400, b.h + 200); ctx.clip(); ctx.translate(0, sink);
  // warnings on the floor
  for (const A of b.arms) if (A.warn) { const on = Math.floor(t * 14) % 2; ctx.fillStyle = on ? 'rgba(255,40,40,0.55)' : 'rgba(255,200,60,0.4)'; if (A.warn.sweep) ctx.fillRect(G.cam.x, fy - 3 - sink, VW, 3); else { ctx.beginPath(); ctx.ellipse(A.warn.x, fy - 1 - sink, 24, 4, 0, 0, 6.283); ctx.fill(); } }
  // arms behind the body (two far ones)
  for (const A of b.arms) if (A.i === 0 || A.i === 3) drawRedArm(b, A, FL, true);
  // legs: clusters of fused bodies
  for (let i = 0; i < 4; i++) { const lx = b.x + 14 + i * 22, ph = Math.sin(t * 2 + i) * 2; redBlob(lx, fy - 14, 11, 16 + ph, FL ? '#ffffff' : '#8a1a1a'); redBlob(lx + 2, fy - 22, 9, 10, FL ? '#ffffff' : '#a82424'); }
  // the body: a huge pulsing heap of red flesh
  const pulse = Math.sin(t * 3) * 2, cx = fx, cy = b.y + 64;
  const parts = [[0, 0, 50, 46], [-28, 10, 30, 30], [28, 8, 32, 30], [-12, -26, 30, 24], [16, -24, 28, 22], [0, 30, 46, 22]];
  for (const [ox, oy, rx, ry] of parts) redBlob(cx + ox, cy + oy, rx + pulse * 0.3, ry + pulse * 0.3, FL ? '#ffffff' : '#a01c1c');
  for (const [ox, oy, rx, ry] of parts) { ctx.fillStyle = FL ? '#ffffff' : '#c8302a'; ctx.beginPath(); ctx.ellipse(cx + ox - rx * 0.25, cy + oy - ry * 0.3, rx * 0.55, ry * 0.45, 0, 0, 6.283); ctx.fill(); }
  // faces and limbs sunk into it
  const faces = [[-24, -6], [18, -14], [-6, 18], [30, 14], [-34, 22], [6, -30], [-14, -34]];
  faces.forEach(([ox, oy], i) => {
    const x = cx + ox, y = cy + oy + Math.sin(t * 2 + i) * 1.5;
    ctx.fillStyle = FL ? '#ffffff' : '#d8a088'; ctx.beginPath(); ctx.ellipse(x, y, 5, 6, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#1a0606'; ctx.fillRect(x - 3, y - 2, 2, 2); ctx.fillRect(x + 1, y - 2, 2, 2); ctx.fillRect(x - 2, y + 2, 4, 2);
  });
  for (let i = 0; i < 6; i++) { const a = i * 1.1 + t * 0.6, x = cx + Math.cos(a) * 40, y = cy + Math.sin(a) * 28; ctx.fillStyle = FL ? '#fff' : '#d8a088'; ctx.fillRect(x, y, 2, 7); ctx.fillRect(x - 1, y + 6, 4, 2); }
  // the core: a cluster of eyes that glows when it is hurt
  ctx.fillStyle = b.phase === 2 ? '#ffe84a' : '#ffd0a0'; ctx.beginPath(); ctx.ellipse(cx, cy + 4, 7, 6, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#2a0000'; ctx.fillRect(cx - 2, cy + 2, 4, 4);
  // arms in front
  for (const A of b.arms) if (A.i === 1 || A.i === 2) drawRedArm(b, A, FL, false);
  ctx.restore(); ctx.restore();
}
function redBlob(x, y, rx, ry, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, 6.283); ctx.fill(); }
function drawRedArm(b, A, FL, back) {
  const s = redShoulder(b, A.i), n = 18, t = G.clock;
  // a braided rope of bodies: a bezier from the shoulder up and over to the hand
  const mx = (s.x + A.hx) / 2 + (A.i < 2 ? -20 : 20), my = Math.min(s.y, A.hy) - 60 - (A.st === 'slam' ? 30 : 0);
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = (1 - u) * (1 - u) * s.x + 2 * (1 - u) * u * mx + u * u * A.hx, y = (1 - u) * (1 - u) * s.y + 2 * (1 - u) * u * my + u * u * A.hy;
    const r = 9 - u * 3, tw = Math.sin(u * 14 + t * 4) * 2;
    ctx.fillStyle = FL ? '#ffffff' : (back ? '#6a1010' : (i % 2 ? '#a82020' : '#8a1818')); ctx.beginPath(); ctx.ellipse(x + tw, y, r, r * 0.8, 0, 0, 6.283); ctx.fill();
    if (i % 3 === 0 && !back) { ctx.fillStyle = FL ? '#fff' : '#d8a088'; ctx.fillRect(x - tw - 1, y - 3, 3, 3); }   // an elbow or a face in the braid
  }
  // the hand: a clump of grasping hands
  for (let k = 0; k < 5; k++) { const a = -1.2 + k * 0.6, x = A.hx + Math.cos(a) * 7, y = A.hy + 6 + Math.sin(a) * 3; ctx.fillStyle = FL ? '#fff' : '#d8a088'; ctx.fillRect(x - 1, y, 3, 7); }
  redBlob(A.hx, A.hy, 8, 7, FL ? '#ffffff' : '#b82626');
}
// ---------------- playfield skin
function skin8(g, t, tx, ty, x, y, i) {
  const z = s8zone(tx);
  if (t === T.P) {
    if (z === 'train') { g.fillStyle = '#e8ecf0'; g.fillRect(x, y, TS, 5); g.fillStyle = '#2a5ad8'; g.fillRect(x, y + 3, TS, 1); return true; }
    if (z === 'school' || z === 'gym') { g.fillStyle = '#9a7a52'; g.fillRect(x, y, TS, 5); g.fillStyle = '#b89a6a'; g.fillRect(x, y, TS, 1.5); return true; }
    g.fillStyle = '#6a6a72'; g.fillRect(x, y, TS, 4); g.fillStyle = '#9a9aa4'; g.fillRect(x, y, TS, 1); return true;
  }
  if (z === 'library' && (t === T.S || t === T.B)) {
    if (t === T.S && ty >= 13) { g.fillStyle = '#5a3a1e'; g.fillRect(x, y, TS, TS); g.fillStyle = '#7a5230'; g.fillRect(x, y, TS, 2); g.fillRect(x, y + 8, TS, 1.5);
      const cs = ['#a83a2a', '#2a5a8a', '#d8b04a', '#3a7a4a', '#e8e0d0', '#6a3a7a']; for (let k = 0; k < 4; k++) { g.fillStyle = cs[(tx * 3 + ty + k) % 6]; g.fillRect(x + 1 + k * 4, y + 2 + (k % 2), 3, 6 - (k % 2)); g.fillStyle = cs[(tx + ty * 5 + k) % 6]; g.fillRect(x + 1 + k * 4, y + 10, 3, 5); }
      if (ty === 13) { g.fillStyle = '#9a6a3a'; g.fillRect(x, y, TS, 1); } return true; }
    g.fillStyle = '#c8bca4'; g.fillRect(x, y, TS, TS); g.fillStyle = '#a89c84'; g.fillRect(x, y + 14, TS, 2); return true;
  }
  if (t === T.B && (z === 'school' || z === 'gym')) { g.fillStyle = '#c8bca4'; g.fillRect(x, y, TS, TS); g.fillStyle = '#a89c84'; g.fillRect(x, y + 14, TS, 2); g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(x + 7, y, 1, TS); return true; }
  if (t === T.B && z === 'chaos') { g.fillStyle = '#5a5a62'; g.fillRect(x, y, TS, TS); g.fillStyle = ['#c8302a', '#e8c040', '#3a6ac8', '#d8d8d8'][(tx * 7 + ty) & 3]; g.fillRect(x + 1, y + 2, 14, 7); g.fillStyle = '#1a1a1e'; g.fillRect(x + 3, y + 10, 4, 4); g.fillRect(x + 10, y + 10, 4, 4); return true; }
  if (t === T.C) { g.fillStyle = '#7a5a3a'; g.fillRect(x + 1, y + 3, 14, 3); g.fillStyle = '#4a3a2a'; g.fillRect(x + 2, y + 6, 2, 10); g.fillRect(x + 12, y + 6, 2, 10); g.fillStyle = '#9a7a52'; g.fillRect(x + 1, y + 3, 14, 1); return true; }   // school desks
  if ((t === T.G || t === T.H) && ty === 18) {
    if (z === 'train') { g.fillStyle = '#3a3a44'; g.fillRect(x, y, TS, TS); g.fillStyle = '#5a5a66'; g.fillRect(x, y, TS, 2); g.fillStyle = '#2a2a30'; g.fillRect(x + (tx % 2) * 8, y + 2, 1, 14); return true; }
    if (z === 'gym') { g.fillStyle = '#a8743a'; g.fillRect(x, y, TS, TS); g.fillStyle = '#c8945a'; g.fillRect(x, y, TS, 2); g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(x + (tx % 3) * 5, y, 0.8, TS); if (tx % 12 === 0) { g.fillStyle = '#f0f0f0'; g.fillRect(x, y, 2, 2); } return true; }
    if (z === 'mall' || z === 'arena' || z === 'station') { g.fillStyle = '#6a6a70'; g.fillRect(x, y, TS, TS); g.fillStyle = '#8a8a92'; g.fillRect(x, y, TS, 1.5); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x + 15, y, 1, TS); if (z === 'station' && (tx & 3) === 0) { g.fillStyle = '#e8c040'; g.fillRect(x, y + 1, TS, 2); } return true; }
    g.fillStyle = '#3a3a40'; g.fillRect(x, y, TS, TS); g.fillStyle = '#56565e'; g.fillRect(x, y, TS, 1.5); if (tx % 5 === 0) { g.fillStyle = '#d8d8d8'; g.fillRect(x + 2, y + 7, 10, 1.5); } return true;
  }
  return false;
}
// ---------------- world space behind the tiles
function drawStage8Mid(cam) {
  const t = G.clock, L = cam.x - 60, R = cam.x + VW + 60, gy = 18 * TS;
  // the train cars, seen from inside: the painted carriage interior, with the night streaking past in the windows
  for (const [a, b] of S8.cars) {
    const x0 = a * TS, x1 = (b + 1) * TS; if (x1 < L || x0 > R) continue;
    const top = 11 * TS + 5, H = gy - top, im = BGIMG.s8carin;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, top, x1 - x0, H); ctx.clip();
    if (im) {
      const w = Math.round(im.width * H / im.height);
      for (let x = x0; x < x1; x += w) ctx.drawImage(im, x, top, w, H);
      ctx.fillStyle = 'rgba(255,255,255,0.10)'; for (let i = 0; i < 5; i++) { const yy = top + H * 0.32 + ((i * 7) % 18), xx = x0 + ((t * 900 + i * 173) % (x1 - x0)); ctx.fillRect(xx, yy, 40, 1); }
    } else { ctx.fillStyle = '#2e343e'; ctx.fillRect(x0, top, x1 - x0, H); }
    ctx.restore();
    ctx.fillStyle = '#e8ecf0'; ctx.fillRect(x0, top - 2, x1 - x0, 3); ctx.fillStyle = '#2a5ad8'; ctx.fillRect(x0, top + 1, x1 - x0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x0, gy - 3, x1 - x0, 3);
  }
  // between the cars: the tracks rushing by underneath
  for (const [a, b] of S8.pits) if (a < S8.mall - 18 && a > S8.train) {
    const x0 = a * TS, x1 = (b + 1) * TS; if (x1 < L || x0 > R) continue;
    ctx.fillStyle = '#0c0c10'; ctx.fillRect(x0, gy, x1 - x0, LH * TS - gy); ctx.fillStyle = '#5a5a62';
    for (let k = 0; k < 6; k++) { const xx = x0 + ((k * 13 - t * 1600) % (x1 - x0) + (x1 - x0)) % (x1 - x0); ctx.fillRect(xx, gy + 30, 3, 4); }
    ctx.fillStyle = '#8a8a92'; ctx.fillRect(x0, gy + 28, x1 - x0, 2); ctx.fillStyle = '#3a3a40'; ctx.fillRect(x0, gy + 2, 2, 26); ctx.fillRect(x1 - 2, gy + 2, 2, 26);
  }
  // the library crowd: heads and reaching arms packed between the shelves; they reach higher when you are above them
  const p8 = G.player;
  for (const [a, b] of S8.crowds) {
    const x0 = a * TS, x1 = (b + 1) * TS; if (x1 < L || x0 > R) continue;
    const near = p8 && p8.x + p8.w > x0 - 20 && p8.x < x1 + 20 && p8.y < 14 * TS ? 1 : 0;
    ctx.fillStyle = '#0e0808'; ctx.fillRect(x0, 13 * TS, x1 - x0, gy - 13 * TS);
    for (let r = 0; r < 3; r++) for (let x = x0 + 2 + r * 3; x < x1 - 4; x += 9) {                 // three ranks of heads
      const yy = gy - 14 - r * 9 + Math.sin(t * 4 + x + r) * 1.5, sk = ['#a8b89a', '#b8b0a0', '#9aa894'][(x + r) % 3];
      ctx.fillStyle = ['#1e3a2a', '#2a3458', '#e8e8e0'][(x * 3 + r) % 3]; ctx.fillRect(x - 1, yy + 6, 9, 8);
      ctx.fillStyle = sk; ctx.fillRect(x, yy, 7, 7); ctx.fillStyle = '#141010'; ctx.fillRect(x, yy - 1, 7, 2);
      ctx.fillStyle = '#5a0a0a'; ctx.fillRect(x + 2, yy + 4, 3, 1);
    }
    for (let x = x0 + 3; x < x1 - 3; x += 4) {                                                       // the arms
      const reach = 18 + near * 14 + Math.sin(t * (5 + near * 4) + x * 1.7) * (5 + near * 5), base = gy - 30;
      const sk = ['#a8b89a', '#b8b0a0', '#c8b8a8'][(x / 4 | 0) % 3];
      ctx.fillStyle = ['#1e3a2a', '#2a3458', '#e8e8e0'][(x / 4 | 0) % 3]; ctx.fillRect(x, base - reach * 0.5, 3, reach * 0.5 + 6);
      ctx.fillStyle = sk; ctx.fillRect(x, base - reach, 3, reach * 0.5 + 1);
      const fx = x - 1 + Math.round(Math.sin(t * 7 + x) * 1); ctx.fillRect(fx, base - reach - 3, 1, 3); ctx.fillRect(fx + 2, base - reach - 4, 1, 4); ctx.fillRect(fx + 4, base - reach - 3, 1, 3);
    }
  }
  // the pits: a sea of reaching hands
  for (const [a, b] of S8.pits) {
    const x0 = a * TS, x1 = (b + 1) * TS; if (x1 < L || x0 > R) continue;
    ctx.fillStyle = '#140808'; ctx.fillRect(x0, gy, x1 - x0, LH * TS - gy);
    if (a > S8.train && a < S8.mall - 18) continue;                                            // car gaps are drawn as tracks above
    for (let x = x0 + 1; x < x1 - 4; x += 8) { const yy = gy + 26 + Math.sin(t * 3 + x) * 2; ctx.fillStyle = '#a8b89a'; ctx.fillRect(x, yy, 7, 7); ctx.fillStyle = '#5a0a0a'; ctx.fillRect(x + 2, yy + 4, 3, 1); }
    for (let x = x0 + 2; x < x1 - 2; x += 4) {
      const h = 16 + Math.sin(t * 4 + x * 0.7) * 6 + ((x * 13) % 7), sk = ['#a8b89a', '#b8a898', '#98a890'][(x / 4 | 0) % 3];
      ctx.fillStyle = sk; ctx.fillRect(x, gy + 26 - h, 3, h);
      const fx = x - 1 + Math.round(Math.sin(t * 6 + x)); ctx.fillRect(fx, gy + 23 - h, 1, 3); ctx.fillRect(fx + 2, gy + 22 - h, 1, 4); ctx.fillRect(fx + 4, gy + 23 - h, 1, 3);
      ctx.fillStyle = '#6a1010'; if ((x * 7) % 3 === 0) ctx.fillRect(x, gy + 28 - h, 3, 2);
    }
    ctx.fillStyle = 'rgba(120,0,0,0.25)'; ctx.fillRect(x0, gy, x1 - x0, 4);
  }
  // the burning car (opening)
  const C = S8.carCrash; if (C && C !== true) { const x = C.x, y = gy; ctx.fillStyle = '#c8302a'; ctx.fillRect(x - 18, y - 12, 36, 9); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(x - 10, y - 18, 20, 7); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x - 11, y - 3, 4, 0, 6.283); ctx.arc(x + 11, y - 3, 4, 0, 6.283); ctx.fill(); if (Math.random() < 0.7) part('fire', x + 14, y - 12, rnd(20, 60), rnd(-60, -20), 0.3, 3, '#ffb020'); }
}
function drawStage8BG(cam) {
  const z = s8zone(Math.floor((cam.x + VW / 2) / TS));
  if (z === 'train') { paintZones(cam, [[0, 's8ride', '#0a1018']], { auto: 900, par: 0.05 }); return; }
  paintZones(cam, [[0, 's8chaos', '#2a1a14'], [S8.school, 's8school', '#2a1a14'], [S8.lib0 + 6, 's8library', '#141820'], [S8.lib1 + 6, 's8school', '#2a1a14'], [S8.gym, 's8gym', '#140a0a'], [S8.station, 's8platform', '#101418'], [S8.mall - 18, 's8mall', '#0c1014'], [S8.gate, 's8mall', '#200808']]);
  // the airliner coming down (opening)
  const P = S8.plane;
  if (P && !P.done) {
    const k = clamp(P.t / 3.0, 0, 1), x = VW + 40 - k * (VW * 0.9), y = 30 + k * k * 90;
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.12 + k * 0.25); ctx.fillStyle = '#d8d8e0'; ctx.fillRect(-26, -4, 52, 8); ctx.fillRect(-6, -14, 10, 28); ctx.fillRect(20, -10, 6, 10); ctx.restore();
    if (Math.random() < 0.8) part('smoke', G.cam.x + x + 20, G.cam.y + y, rnd(20, 60), rnd(-30, 0), 1.2, 4, '#3a3030', { grow: 10, a: 0.6 });
  }
  if (FXflash8 > 0) { FXflash8 -= 1 / 60; ctx.fillStyle = 'rgba(255,170,80,' + (FXflash8 * 0.8).toFixed(3) + ')'; ctx.fillRect(0, 0, VW, VH); }
}
function drawStage8Front() {
  const c = G.cam, z = s8zone(Math.floor((c.x + VW / 2) / TS));
  const tint = { chaos: 'rgba(255,120,40,0.07)', school: 'rgba(255,140,60,0.05)', gym: 'rgba(40,60,120,0.10)', station: 'rgba(255,40,40,0.06)', train: 'rgba(40,70,140,0.12)', mall: 'rgba(40,140,140,0.06)', arena: 'rgba(160,0,0,0.12)' }[z];
  ctx.fillStyle = tint; ctx.fillRect(0, 0, VW, VH);
  if (z === 'train') { ctx.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 6; i++) { const y = (i * 47 + 13) % VH, x = VW - ((G.clock * 1400 + i * 211) % (VW + 200)); ctx.fillRect(x, y, 120, 1); } }
  const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, VW * 0.7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.42)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
}
