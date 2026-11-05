// =====================================================================
// STAGE 04 — KOWLOON WALLED CITY 1987: a vertical climb, street to rooftop
// =====================================================================
const S4 = { W: 30, roof: 26, storey: 24, n: 8 };
S4.G0 = S4.roof + S4.storey * S4.n;  // street level row (218)
S4.H = S4.G0 + 4;
// eight storeys, bottom to top. gap = the stairwell hole in this storey's ceiling.
const S4_ROOMS = [
  { key: 'resto',    name: 'NOODLE HOUSE',       cn: '粉麵館', wall: '#5a2a22', wall2: '#6e3428', trim: '#c8a040' },
  { key: 'dentist',  name: 'UNLICENSED DENTIST', cn: '牙科',   wall: '#4a6a5e', wall2: '#5a7c6e', trim: '#e8f0e0' },
  { key: 'homes',    name: 'CAGE HOMES',         cn: '籠屋',   wall: '#4a4038', wall2: '#5a4e44', trim: '#b05a3a' },
  { key: 'factory',  name: 'FISHBALL FACTORY',   cn: '魚丸廠', wall: '#3e4a52', wall2: '#4c5a64', trim: '#d8d0b0' },
  { key: 'mahjong',  name: 'MAHJONG PARLOUR',    cn: '麻雀館', wall: '#2a4a32', wall2: '#345a3c', trim: '#e8c040' },
  { key: 'sweat',    name: 'SWEATSHOP',          cn: '製衣廠', wall: '#4a3a52', wall2: '#5a4864', trim: '#c8a0d8' },
  { key: 'shrine',   name: 'BACK-ROOM SHRINE',   cn: '神壇',   wall: '#5a1a1a', wall2: '#6e2424', trim: '#ffd23f' },
  { key: 'stairs',   name: 'THE LAST STAIRWELL', cn: '天台',   wall: '#3a3440', wall2: '#463e4e', trim: '#8a7aa0' }
];
S4_ROOMS.forEach((r, i) => { r.floor = S4.G0 - S4.storey * i; r.slab = r.floor - S4.storey; r.gap = i % 2 ? [5, 8] : [21, 24]; });
let S4BG = null;
function stage4LoadArt() {
  if (S4BG || typeof S4_BG_SRC === 'undefined') return;
  const im = new Image(); im.onload = () => { S4BG = im; }; im.src = S4_BG_SRC;
}
function buildStage4(E, set, fill, en, br, cp, hint) {
  const R = S4.roof, G0 = S4.G0;
  fill(0, LW - 1, G0, LH - 1, T.G);                              // the alley
  fill(0, 1, 0, G0 - 1, T.S); fill(LW - 2, LW - 1, 0, G0 - 1, T.S); // party walls, all the way up
  const cp4 = (tx, row) => E.checkpoints.push({ x: tx * TS, y: row * TS, on: false, v: true });
  E.route = []; S4.plats = [];
  S4_ROOMS.forEach((r, i) => {
    fill(2, LW - 3, r.slab, r.slab, r.key === 'stairs' ? T.S : T.B);          // ceiling slab: brick, blow through it if you like
    fill(r.gap[0], r.gap[1], r.slab, r.slab, T.P);                             // stairwell hole: jump up through it
    // v22: a "ladder" of wide one-way floors that overlap, so the climb is straight up — no blind leaps across gaps
    const R1 = [[3, 13], [12, 22], [3, 13], [12, 22], [3, 13], [12, 26], [18, 26]];
    const seq = r.gap[0] > 14 ? R1 : R1.map(([a, b]) => [29 - b, 29 - a]);
    const P = seq.map((s, k) => ({ x0: s[0], x1: s[1], row: r.floor - 3 * (k + 1) }));
    P.forEach(q => fill(q.x0, q.x1, q.row, q.row, T.P));
    S4.plats[i] = P;
    P.forEach((q, k) => { const nx = k < P.length - 1 ? P[k + 1] : { x0: r.gap[0], x1: r.gap[1] }; const o0 = Math.max(q.x0, nx.x0), o1 = Math.min(q.x1, nx.x1); E.route.push({ x: ((o0 + o1) / 2 + 0.5) * TS, y: q.row * TS }); });
    E.route.push({ x: ((r.gap[0] + r.gap[1]) / 2 + 0.5) * TS, y: r.slab * TS });
    if (i > 0) cp4(r.gap[0] > 14 ? 6 : 22, r.floor);
  });
  // enemies: [type, platform index (-1 = the floor), column offset inside the platform 0..1]
  const crew = {
    resto:   [['knife', -1, 0.3], ['soldier', -1, 0.8], ['soldier', 0, 0.5], ['knife', 1, 0.7], ['bomber', 2, 0.4], ['gunner', 3, 0.6], ['soldier', 5, 0.8]],
    dentist: [['shield', -1, 0.6], ['gunner', 0, 0.3], ['soldier', 1, 0.6], ['soldier', 2, 0.5], ['knife', 3, 0.4], ['gunner', 5, 0.5]],
    homes:   [['soldier', -1, 0.7], ['knife', -1, 0.2], ['bomber', 0, 0.6], ['soldier', 1, 0.4], ['gunner', 2, 0.3], ['knife', 3, 0.6], ['soldier', 4, 0.5], ['bomber', 6, 0.5]],
    factory: [['heavy', -1, 0.6], ['gunner', 0, 0.5], ['shield', 1, 0.3], ['soldier', 2, 0.6], ['gunner', 4, 0.5], ['knife', 5, 0.7]],
    mahjong: [['soldier', -1, 0.3], ['soldier', -1, 0.8], ['knife', 0, 0.5], ['gunner', 1, 0.6], ['bomber', 2, 0.4], ['soldier', 3, 0.5], ['knife', 4, 0.3], ['gunner', 5, 0.7]],
    sweat:   [['shield', -1, 0.5], ['knife', 0, 0.4], ['soldier', 1, 0.6], ['gunner', 2, 0.5], ['bomber', 3, 0.4], ['soldier', 4, 0.6], ['heavy', 5, 0.6]],
    shrine:  [['knife', -1, 0.2], ['knife', -1, 0.8], ['gunner', 0, 0.5], ['soldier', 1, 0.5], ['shield', 3, 0.5], ['gunner', 4, 0.4], ['soldier', 6, 0.5]],
    stairs:  [['soldier', -1, 0.6], ['knife', -1, 0.2], ['gunner', 1, 0.5], ['bomber', 2, 0.5], ['soldier', 4, 0.5], ['gunner', 5, 0.6]]
  };
  S4_ROOMS.forEach((r, i) => {
    for (const [type, k, f] of crew[r.key]) {
      if (k < 0) { en(type, Math.round(3 + f * 22), r.floor); continue; }
      const q = S4.plats[i][k]; en(type, Math.round(q.x0 + 1 + f * (q.x1 - q.x0 - 2)), q.row);
    }
  });
  // props on the floors
  const F = i => S4_ROOMS[i].floor;
  fill(4, 5, F(0) - 1, F(0) - 1, T.C); fill(8, 9, F(0) - 1, F(0) - 1, T.C); br(14, F(0)); br(15, F(0)); br(25, F(0));
  fill(12, 13, F(1) - 1, F(1) - 1, T.C); br(25, F(1));
  fill(10, 13, F(2) - 1, F(2) - 1, T.C); br(16, F(2)); br(17, F(2));
  br(10, F(3)); br(11, F(3)); br(12, F(3)); fill(25, 26, F(3) - 1, F(3) - 1, T.C);
  fill(10, 11, F(4) - 1, F(4) - 1, T.C); fill(15, 16, F(4) - 1, F(4) - 1, T.C); fill(22, 23, F(4) - 1, F(4) - 1, T.C);   // mahjong tables
  br(9, F(5)); br(20, F(5)); fill(12, 15, F(5) - 1, F(5) - 1, T.C);                                                     // bolts of cloth
  br(4, F(6)); br(25, F(6)); fill(14, 15, F(6) - 1, F(6) - 2, T.B);                                                       // the altar
  br(12, F(7)); br(18, F(7));
  // hints
  hint(3, F(0) - 6, 'KOWLOON WALLED CITY, 1987.  THE ONLY WAY OUT IS UP.  (8 FLOORS)');
  hint(3, F(0) - 13, 'THE FLOORS OVERLAP: STAND UNDER THE NEXT ONE AND JUMP STRAIGHT UP');
  hint(10, F(1) - 5, 'THE DENTIST IS IN.  THE DENTIST IS ARMED.');
  hint(10, F(2) - 5, 'MIND THE MAHJONG... NO, THAT\'S TWO FLOORS UP.');
  hint(10, F(3) - 5, 'FISHBALL FACTORY.  THE VATS ARE BOILING.  SO ARE THE BARRELS.');
  hint(10, F(4) - 5, 'MAHJONG PARLOUR.  THE HOUSE ALWAYS WINS.  NOT TONIGHT.');
  hint(10, F(5) - 5, 'SWEATSHOP.  EVERYONE HERE IS ON OVERTIME.');
  hint(10, F(6) - 5, 'A SHRINE.  LIGHT SOME INCENSE.  OR SOME DYNAMITE.');
  hint(10, F(7) - 5, 'LAST FLOOR.  HEAR THAT?  THE 747 FROM KAI TAK.');
  // ---------- ROOFTOP ARENA ----------
  fill(4, 8, R - 5, R - 5, T.P); fill(21, 25, R - 5, R - 5, T.P);            // water-tank tops
  E.route.push({ x: 12 * TS, y: R * TS });
  S4.route = E.route;                                                        // waypoints for the test bot (and nothing else)
  E.start = { x: 3 * TS, y: G0 * TS - PC.standH };
  E.flag = { x: 25 * TS, y: R * TS };
  return E;
}
// Two storeys spring an ambush: the stairwell hatch above slams shut and the crew drops through the ceiling.
const S4_AMBUSH = [
  { room: 1, waves: [[['soldier', 6], ['knife', 22]], [['gunner', 14], ['bomber', 8], ['soldier', 21]]] },
  { room: 3, waves: [[['shield', 8], ['soldier', 20], ['knife', 13]], [['heavy', 14], ['gunner', 6], ['soldier', 22]]] },
  { room: 4, title: 'THE HOUSE ALWAYS WINS', waves: [[['knife', 6], ['knife', 22], ['soldier', 14]], [['heavy', 8], ['heavy', 21]], [['gunner', 5], ['gunner', 24], ['bomber', 14]]] },
  { room: 6, waves: [[['knife', 6], ['knife', 22], ['knife', 14]], [['shield', 9], ['gunner', 20], ['soldier', 14], ['bomber', 24]]] }
]
function stage4Init() { G.arena4 = 'idle'; G.jet = null; G.jetT = 4; G.gust = 0; G.amb4 = null; G.ambDone4 = []; }
function setGap4(r, t) { for (let tx = r.gap[0]; tx <= r.gap[1]; tx++) setTile(tx, r.slab, t); }
function updAmbush4(dt) {
  const p = G.player, feet = p.y + p.h;
  if (!G.amb4) {
    S4_AMBUSH.forEach((A, i) => {
      const r = S4_ROOMS[A.room];
      if (G.ambDone4[i] || p.dead || !p.onGround) return;
      if (feet <= (r.floor - 7) * TS + 1 && feet > (r.slab + 2) * TS) {
        G.amb4 = { i, wave: 0, t: 0.8, crew: [], kills: G.stats.kills, idle: 0 };
        setGap4(r, T.S); dust((r.gap[0] + r.gap[1] + 1) / 2 * TS, (r.slab + 1) * TS, 10, 10); audio.play('clang'); shake(0.25);
        popup(p.x + 5, p.y - 26, A.title || 'AMBUSH! THE HATCH IS SHUT', '#ff5a3a', true); audio.play('warn'); if (A.title) G.banner = { t: 0, title: A.title, sub: '麻雀館  —  TWO HEAVIES AND THE HOUSE CREW' };
      }
    });
    return;
  }
  const A = S4_AMBUSH[G.amb4.i], r = S4_ROOMS[A.room], M = G.amb4;
  const alive = M.crew.filter(e => !e.dead).length;
  if (M.kills !== G.stats.kills) { M.kills = G.stats.kills; M.idle = 0; } else M.idle += dt;
  const away = M.crew.some(e => !e.dead && Math.abs((e.y + e.h) - feet) > 40);           // v26: someone stuck on another storey (e.g. above a melee hero's ceiling)
  if (away) M.away = (M.away || 0) + dt; else M.away = 0;
  if ((M.idle > 12 || M.away > 4) && alive > 0 && !p.dead) {         // anti-stall: stragglers come to YOUR storey
    M.idle = 0; M.away = 0; let n = 0;
    for (const e of M.crew) if (!e.dead) { e.x = clamp(p.x + (n++ % 2 ? 1 : -1) * rnd(40, 80), 2 * TS + 4, (LW - 3) * TS); e.y = feet - e.h - 26; e.vx = e.vy = 0; e.para = true; e.onGround = false; e.alerted = true; e.state = 'react'; e.t = 0.2; }
    popup(p.x + 5, p.y - 26, 'REINFORCEMENTS!', '#ff9a3a', true);
  }
  if (alive <= (M.wave < A.waves.length ? 1 : 0)) M.t -= dt;
  if (M.t > 0) return;
  if (M.wave < A.waves.length) {
    for (const [type, tx] of A.waves[M.wave]) {
      const e = mkEnemy(type, tx, r.slab + 3); e.y = (r.slab + 1) * TS + 2; e.para = true; e.alerted = true; e.state = 'react'; e.t = 0.2;
      G.enemies.push(e); M.crew.push(e); dust(tx * TS + 8, (r.slab + 1) * TS, 4, 6);
    }
    M.wave++; M.t = 1.0; audio.play('warn'); popup(p.x + 5, p.y - 30, 'THROUGH THE CEILING!', '#ffd23f');
  } else if (alive === 0) {
    setGap4(r, T.P); G.ambDone4[M.i] = true; G.amb4 = null; G.goT = 3; audio.play('check');
    popup((r.gap[0] + r.gap[1]) / 2 * TS, (r.slab + 3) * TS, 'HATCH OPEN  ^  GO UP!', '#7dff8a', true);
  }
}
function updStage4(dt) {
  if (STAGE !== 4) return;
  if (G.arena4 === undefined) stage4Init();
  const p = G.player, R = S4.roof;
  if (G.mode === 'play') updAmbush4(dt);
  if (G.arena4 === 'idle' && !p.dead && p.onGround && p.y + p.h <= R * TS + 1) {
    G.arena4 = 'fight';
    for (let tx = S4_ROOMS[7].gap[0]; tx <= S4_ROOMS[7].gap[1]; tx++) setTile(tx, R, T.S);      // the hatch slams shut
    dust(22.5 * TS, R * TS, 12, 10); audio.play('clang'); shake(0.3);
    const cy = R * TS - VH + 36;
    G.cam.lock = { x0: 0, x1: LW * TS, y0: cy, y1: cy };
    G.jetT = 0.4;
    G.cp = { x: 12 * TS, y: R * TS - PC.standH };                 // a retake starts on the roof, not under the sealed hatch
    later(2.6, spawnLandlord);
  }
  // Kai Tak: a jumbo jet skims the roofs. The wake shoves everyone sideways.
  if (G.arena4 === 'fight' && G.mode === 'play') {
    G.jetT -= dt;
    if (G.jetT <= 0 && !G.jet) {
      G.jet = { t: 0, dir: Math.random() < 0.5 ? 1 : -1 };
      G.jetT = rnd(11, 14); audio.play('roar'); popup(p.x + 5, p.y - 30, 'KAI TAK!  HOLD ON!', '#9ae8ff', true);
    }
  }
  if (G.jet) {
    const J = G.jet; J.t += dt;
    if (J.t > 0.7 && J.t < 2.1) {
      const k = Math.sin((J.t - 0.7) / 1.4 * Math.PI), push = J.dir * 520 * k;
      shake(dt * 1.6);
      if (!p.dead && !G.cine) p.vx += push * dt * (p.onGround ? 1.4 : 2.2);
      for (const e of G.enemies) if (!e.dead) e.vx += push * dt * 1.6;
      if (Math.random() < dt * 8) dust(G.cam.x + rnd(0, VW), R * TS, 1, 6);
    }
    if (J.t > 3.2) G.jet = null;
  }
}
function spawnLandlord() {
  const R = S4.roof;
  G.boss = {
    type: 'boss', skin: 'landlord', name: 'THE LANDLORD', title: 'THE LANDLORD', sub: '城寨大佬  —  "RENT IS DUE. EVERYBODY PAYS."',
    x: 15 * TS, y: R * TS - 240, w: 24, h: 34, vx: 0, vy: 0, hp: 175, maxHp: 175, face: -1,
    state: 'enter', t: 0, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, aimLow: false,
    fireT: 0, mgCd: 0, second: false, dying: 0, dropT: 99, anim: 0, shown: 0
  };
}
function stage4BossFinal() {
  later(1.2, () => {
    G.exitOpen = true; G.cam.lock = null;
    if (G.bride) { G.bride.x = G.flag.x - 30; G.bride.y = G.flag.y - 18; G.bride.vx = G.bride.vy = 0; G.bride.st = 'wait'; G.bride.face = 1; }
    popup(G.flag.x - 30, G.flag.y - 50, 'THE ROOF IS YOURS  >>', '#7dff8a', true); audio.play('check');
  });
}
// ---------- drawing ----------
function drawWalledBG(cam) {
  const sky = ctx.createLinearGradient(0, 0, 0, VH);
  sky.addColorStop(0, '#2a3048'); sky.addColorStop(0.6, '#5a5a70'); sky.addColorStop(1, '#a88070');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
  if (S4BG) {
    const h = Math.round(S4BG.height * VW / S4BG.width), span = LH * TS - VH, k = span > 0 ? clamp(cam.y / span, 0, 1) : 0;
    const y = Math.round(-(h - VH) * k);
    const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
    ctx.drawImage(S4BG, 0, y, VW, h); ctx.imageSmoothingEnabled = prev;
  } else {
    ctx.fillStyle = '#3a3a44'; for (let i = 0; i < 12; i++) ctx.fillRect(i * 42 - 6, 30 + (i * 37 % 60), 38, VH);
  }
  ctx.fillStyle = 'rgba(16,10,22,0.16)'; ctx.fillRect(0, 0, VW, VH);       // push it back so the fight reads
}
function drawJet() {
  const J = G.jet; if (!J) return;
  const u = J.t / 3.2, x = J.dir > 0 ? -260 + u * (VW + 520) : VW + 260 - u * (VW + 520), y = 18 + Math.sin(u * 3.1) * 6;
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(J.dir, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-120, 70, 240, 6);
  ctx.fillStyle = '#c8ccd4'; ctx.fillRect(-110, -6, 210, 22); ctx.fillRect(-120, -2, 12, 16);
  ctx.fillStyle = '#e8ecf2'; ctx.fillRect(-110, -6, 210, 6); ctx.fillRect(88, -4, 20, 14);
  ctx.fillStyle = '#2a3a6a'; ctx.fillRect(-110, 8, 210, 3);
  ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); ctx.moveTo(-20, 8); ctx.lineTo(30, 8); ctx.lineTo(-30, 40); ctx.lineTo(-56, 40); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-100, -6); ctx.lineTo(-82, -6); ctx.lineTo(-108, -34); ctx.lineTo(-120, -34); ctx.fill();
  ctx.fillStyle = '#6a7080'; ctx.fillRect(-28, 26, 16, 7); ctx.fillRect(-4, 20, 16, 7);
  ctx.fillStyle = '#1a2030'; for (let i = 0; i < 16; i++) ctx.fillRect(-80 + i * 10, 1, 4, 3); ctx.fillRect(92, -1, 8, 3);
  if (Math.floor(G.clock * 8) % 2) { ctx.fillStyle = '#ff3a3a'; ctx.fillRect(-118, -34, 3, 3); ctx.fillStyle = '#fff'; ctx.fillRect(-30, 38, 3, 2); }
  ctx.fillStyle = '#6a7080'; ctx.fillRect(-24, 30, 2, 10); ctx.fillRect(0, 26, 2, 12); ctx.fillStyle = '#111'; ctx.fillRect(-26, 40, 6, 4); ctx.fillRect(-2, 38, 6, 4);   // gear down: it's landing
  ctx.restore();
}
function s4txt(s, x, y, col, size) { ctx.font = 'bold ' + size + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, x, y); }
function drawWalledRooms(cam) {               // world space, behind the tiles: each storey is a doll's-house cutaway
  const t = G.clock, X0 = 2 * TS, X1 = (LW - 2) * TS, W = X1 - X0;
  for (const r of S4_ROOMS) {
    const top = r.slab * TS + TS, bot = r.floor * TS, H = bot - top;
    if (bot < cam.y - 10 || top > cam.y + VH + 10) continue;
    // back wall with three bands of barred windows (the Gemini city shows through them)
    const winH = 34, bands = [top + 22, top + 132, top + 242].filter(y => y + winH < bot - 36), winY = bands[0];
    ctx.globalAlpha = 0.5;                      // v24: the back walls are thin enough that the painted Walled City shows through
    ctx.fillStyle = r.wall;
    let y0 = top;
    for (const by of bands) {
      ctx.fillRect(X0, y0, W, by - y0);
      let px0 = X0; for (let i = 0; i < 6; i++) { const wx = X0 + 24 + i * 70 + ((by / 110) & 1) * 14; ctx.fillRect(px0, by, wx - px0, winH); px0 = wx + 36; }
      ctx.fillRect(px0, by, X1 - px0, winH); y0 = by + winH;
    }
    ctx.fillRect(X0, y0, W, bot - y0);
    ctx.globalAlpha = 1;
    for (const by of bands) for (let i = 0; i < 6; i++) {
      const wx = X0 + 24 + i * 70 + ((by / 110) & 1) * 14, lit = ((i * 7 + by) % 5) === 0;
      if (lit) { ctx.fillStyle = 'rgba(255,200,110,0.35)'; ctx.fillRect(wx, by, 36, winH); }
      ctx.fillStyle = '#1a1418'; for (let g = 0; g < 5; g++) ctx.fillRect(wx + g * 8, by, 1, winH); ctx.fillRect(wx, by + winH / 2, 36, 1);   // grilles
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(wx - 2, by + winH, 40, 3);
    }
    ctx.fillStyle = r.wall2; for (let y = top + 6; y < bot; y += 12) ctx.fillRect(X0, y, W, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 9; i++) ctx.fillRect(X0 + ((i * 97) % W), top, 3 + (i % 3), 6 + (i * 13) % 30);   // damp streaks
    ctx.fillStyle = r.trim; ctx.fillRect(X0, top, W, 2);
    // shop sign by the stairwell
    const sx = r.gap[0] > 14 ? X0 + 40 : X1 - 40, sy = bot - 44, on = Math.sin(t * 19 + r.floor) > -0.8;
    ctx.fillStyle = '#140a10'; ctx.fillRect(sx - 22, sy - 26, 44, 52);
    s4txt(r.cn, sx, sy - 6, on ? (r.key === 'dentist' ? '#9ae8ff' : '#ff6ab0') : '#4a2438', 13);
    ctx.font = 'bold 6px monospace'; ctx.fillStyle = on ? '#ffe0a0' : '#5a4030'; ctx.textAlign = 'center'; ctx.fillText(r.name, sx, sy + 18);
    if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.12; ctx.fillStyle = r.key === 'dentist' ? '#3ad0ff' : '#ff3a9a'; ctx.fillRect(sx - 34, sy - 36, 68, 72); ctx.restore(); }
    // props
    if (r.key === 'resto') {
      for (let i = 0; i < 6; i++) { const dx = X0 + 150 + i * 14, dy = top + 8 + Math.sin(t * 1.2 + i) * 1; ctx.fillStyle = '#3a2a1a'; ctx.fillRect(dx, top + 2, 1, dy - top); ctx.fillStyle = '#b8541c'; ctx.fillRect(dx - 3, dy, 7, 10); ctx.fillStyle = '#e08a3a'; ctx.fillRect(dx - 2, dy + 1, 2, 7); }   // roast ducks
      for (let i = 0; i < 3; i++) { const lx = X0 + 270 + i * 40; ctx.fillStyle = '#d02020'; ctx.fillRect(lx - 5, top + 12, 10, 12); ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx - 5, top + 17, 10, 1); }   // lanterns
      ctx.fillStyle = '#e8dcc0'; ctx.fillRect(X0 + 330, bot - 120, 60, 40); ctx.fillStyle = '#2a1a10'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'left'; ['魚蛋麵 $8', '叉燒飯 $12', '奶茶   $3'].forEach((s, i) => ctx.fillText(s, X0 + 334, bot - 110 + i * 12));
      for (let i = 0; i < 2; i++) { const kx = X0 + 200 + i * 26; ctx.fillStyle = '#222'; ctx.fillRect(kx, bot - 14, 20, 14); ctx.fillStyle = '#555'; ctx.fillRect(kx - 2, bot - 16, 24, 3); for (let s = 0; s < 3; s++) { const ph = (t * 0.6 + s / 3 + i * 0.3) % 1; ctx.fillStyle = 'rgba(230,230,230,' + (0.35 * (1 - ph)) + ')'; ctx.fillRect(kx + 4 + Math.sin(ph * 6 + s) * 4, bot - 20 - ph * 40, 8 + ph * 8, 6); } }   // stock pots
    } else if (r.key === 'dentist') {
      ctx.fillStyle = '#dfe8e0'; for (let y = top + 70; y < bot; y += 8) for (let x = X0; x < X1; x += 8) if (((x + y) / 8) % 2 === 0) ctx.fillRect(x, y, 8, 8);
      const cx = X0 + 230; ctx.fillStyle = '#2a6a8a'; ctx.fillRect(cx, bot - 18, 34, 8); ctx.fillRect(cx + 26, bot - 34, 8, 18); ctx.fillStyle = '#888'; ctx.fillRect(cx + 14, bot - 10, 4, 10);   // the chair
      ctx.fillStyle = '#c8c8c8'; ctx.fillRect(cx - 6, bot - 60, 2, 44); ctx.fillRect(cx - 6, bot - 60, 20, 2); ctx.fillStyle = '#fff6c0'; ctx.fillRect(cx + 12, bot - 62, 8, 5);   // the lamp
      ctx.fillStyle = '#f4f4f0'; ctx.fillRect(X0 + 120, top + 8, 26, 30); ctx.fillRect(X0 + 120, top + 38, 9, 12); ctx.fillRect(X0 + 137, top + 38, 9, 12);   // giant tooth
      ctx.fillStyle = '#c03030'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText('NO LICENCE · NO PAIN?', X0 + 133, top + 58);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = '#8ab8c8'; ctx.fillRect(X0 + 300 + i * 9, bot - 70, 6, 10); ctx.fillStyle = '#f0f0e0'; ctx.fillRect(X0 + 301 + i * 9, bot - 66, 4, 4); }   // jars of teeth
    } else if (r.key === 'homes') {
      for (let i = 0; i < 3; i++) { const bx = X0 + 120 + i * 60; ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 1; for (let k = 0; k < 2; k++) { ctx.strokeRect(bx + 0.5, bot - 40 - k * 40 + 0.5, 46, 36); for (let g = 0; g < 46; g += 5) { ctx.fillStyle = '#6a6a70'; ctx.fillRect(bx + g, bot - 40 - k * 40, 1, 36); } ctx.fillStyle = '#7a3a3a'; ctx.fillRect(bx + 2, bot - 10 - k * 40, 42, 5); } }   // cage beds
      const tvx = X0 + 330, fl = Math.random() * 0.3 + 0.7; ctx.fillStyle = '#2a2a2a'; ctx.fillRect(tvx, bot - 34, 30, 24); ctx.fillStyle = 'rgba(140,200,255,' + fl + ')'; ctx.fillRect(tvx + 3, bot - 31, 22, 17);   // TV
      ctx.fillStyle = '#a01818'; ctx.fillRect(X0 + 40, top + 30, 24, 30); ctx.fillStyle = Math.sin(t * 3) > 0 ? '#ff4a4a' : '#c02a2a'; ctx.fillRect(X0 + 44, top + 34, 4, 4); ctx.fillRect(X0 + 56, top + 34, 4, 4);   // altar
      ctx.fillStyle = '#2a6a3a'; ctx.fillRect(X0 + 380, bot - 22, 30, 4); ctx.fillStyle = '#e8e8d8'; for (let i = 0; i < 6; i++) ctx.fillRect(X0 + 382 + i * 5, bot - 25, 3, 3);   // mahjong
    } else if (r.key === 'factory') {
      for (let i = 0; i < 3; i++) { const vx = X0 + 60 + i * 120; ctx.fillStyle = '#6a7078'; ctx.fillRect(vx, bot - 40, 50, 40); ctx.fillStyle = '#8a9098'; ctx.fillRect(vx - 3, bot - 42, 56, 4); ctx.fillStyle = '#e8e0c8'; for (let k = 0; k < 6; k++) ctx.fillRect(vx + 4 + k * 8, bot - 46 - Math.abs(Math.sin(t * 5 + k + i)) * 4, 5, 5);
        for (let s = 0; s < 3; s++) { const ph = (t * 0.5 + s / 3 + i * 0.2) % 1; ctx.fillStyle = 'rgba(230,230,230,' + (0.3 * (1 - ph)) + ')'; ctx.fillRect(vx + 10 + s * 12, bot - 50 - ph * 50, 10 + ph * 10, 8); } }   // boiling vats of fishballs
      ctx.fillStyle = '#2a2a30'; ctx.fillRect(X0, top + 50, W, 6); const off = (t * 30) % 12; ctx.fillStyle = '#4a4a54'; for (let x = -12; x < W; x += 12) ctx.fillRect(X0 + x + off, top + 51, 6, 4);   // conveyor
    } else if (r.key === 'mahjong') {
      for (const tx of [11, 16, 23]) { const x = tx * TS, y = bot - 16; ctx.fillStyle = '#1e6a3a'; ctx.fillRect(x - 14, y - 2, 28, 3); ctx.fillStyle = '#e8e4d0'; for (let k = 0; k < 8; k++) ctx.fillRect(x - 12 + k * 3, y - 4, 2, 2); }   // tiles on the tables
      for (let i = 0; i < 4; i++) { const lx = X0 + 60 + i * 100; ctx.fillStyle = '#2a2a20'; ctx.fillRect(lx, top + 2, 1, 16); ctx.fillStyle = Math.sin(t * 2 + i) > -0.6 ? '#ffe08a' : '#a08040'; ctx.fillRect(lx - 6, top + 18, 13, 4); }   // hanging lamps
      for (let s2 = 0; s2 < 5; s2++) { const ph = (t * 0.15 + s2 / 5) % 1; ctx.fillStyle = 'rgba(200,200,190,' + (0.12 * (1 - ph)) + ')'; ctx.fillRect(X0 + 40 + s2 * 80 + Math.sin(ph * 6) * 10, bot - 40 - ph * 120, 40, 14); }   // cigarette smoke
      ctx.fillStyle = '#c02020'; ctx.fillRect(X0 + 300, top + 30, 50, 22); ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('發  中', X0 + 325, top + 45);
    } else if (r.key === 'sweat') {
      for (let i = 0; i < 5; i++) { const sx2 = X0 + 40 + i * 80, y = bot - 20; ctx.fillStyle = '#3a3a40'; ctx.fillRect(sx2, y, 30, 4); ctx.fillStyle = '#222'; ctx.fillRect(sx2 + 18, y - 10, 4, 10); ctx.fillRect(sx2 + 8, y - 12, 14, 3); ctx.fillStyle = '#c8c8c8'; ctx.fillRect(sx2 + 10, y - 9 + (Math.floor(t * 20 + i) % 2), 1, 5); }   // sewing machines
      for (let i = 0; i < 8; i++) { ctx.fillStyle = ['#c84a8a', '#4a8ac8', '#e8c040', '#5aa85a'][i % 4]; ctx.fillRect(X0 + 20 + i * 52, top + 4, 22, 30 + (i % 3) * 8); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(X0 + 20 + i * 52, top + 4, 4, 30 + (i % 3) * 8); }   // hanging bolts of cloth
    } else if (r.key === 'shrine') {
      for (const px2 of [X0 + 170, X0 + 250]) { ctx.fillStyle = '#a01818'; ctx.fillRect(px2, top, 8, H); ctx.fillStyle = '#c83030'; ctx.fillRect(px2 + 1, top, 2, H); }   // red pillars
      ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('關帝', X0 + 214, top + 40);
      for (let i = 0; i < 3; i++) { const cx2 = X0 + 196 + i * 18; ctx.fillStyle = '#5a2a10'; ctx.fillRect(cx2, bot - 44, 1, 10); ctx.fillStyle = Math.sin(t * 9 + i) > 0 ? '#ff6a2a' : '#ffb04a'; ctx.fillRect(cx2, bot - 45, 1, 1);
        for (let s2 = 0; s2 < 4; s2++) { const ph = (t * 0.4 + s2 / 4 + i * 0.3) % 1; ctx.fillStyle = 'rgba(220,220,210,' + (0.3 * (1 - ph)) + ')'; ctx.fillRect(cx2 + Math.sin(ph * 9 + i) * 3, bot - 46 - ph * 50, 2, 3); } }   // incense
      for (let i = 0; i < 6; i++) { const lx = X0 + 40 + i * 70; ctx.fillStyle = '#d02020'; ctx.fillRect(lx, top + 6, 10, 13); ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx + 2, top + 11, 6, 2); }   // lanterns
    } else {
      ctx.fillStyle = '#5a5060'; for (let i = 0; i < 12; i++) ctx.fillRect(X0 + 20 + i * 34, bot - 8 - (i % 4) * 3, 18, 8 + (i % 4) * 3);   // junk
      ctx.strokeStyle = '#1a1418'; ctx.lineWidth = 1; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(X0, top + 20 + i * 18); ctx.quadraticCurveTo(X0 + W / 2, top + 50 + i * 18, X1, top + 16 + i * 18); ctx.stroke(); }   // cables
    }
    // laundry poles out of the windows
    for (const by of bands) for (let i = 0; i < 5; i++) { const lx = X0 + 30 + i * 80 + ((by / 110) & 1) * 40, ly = by + winH + 4; ctx.fillStyle = '#6a6060'; ctx.fillRect(lx, ly, 40, 1); const c = ['#d84a4a', '#4a8ad8', '#e8e8d8', '#e8c040', '#5aa85a'][(i + r.floor) % 5]; ctx.fillStyle = c; ctx.fillRect(lx + 4, ly + 1, 8, 10 + Math.sin(t * 2 + i) * 1); ctx.fillRect(lx + 20, ly + 1, 10, 7); }
  }
  // the roof: antennas and water tanks against the sky
  const R = S4.roof * TS;
  if (R + 10 > cam.y && R - 200 < cam.y + VH) {
    ctx.strokeStyle = '#141018'; ctx.fillStyle = '#141018'; ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) { const ax = X0 + 20 + i * 62, h = 40 + (i * 23) % 40; ctx.fillRect(ax, R - h, 2, h); for (let k = 0; k < 3; k++) ctx.fillRect(ax - 8 + k * 2, R - h + 4 + k * 6, 18 - k * 4, 1); }
    for (const tx of [6, 23]) {                                                     // water tanks on stilts (their tops are the one-way platforms)
      const x = tx * TS - 22, y0 = R - 5 * TS - 26;
      ctx.fillStyle = '#2a2420'; ctx.fillRect(x + 4, R - 5 * TS, 3, 5 * TS); ctx.fillRect(x + 37, R - 5 * TS, 3, 5 * TS); ctx.fillRect(x + 4, R - 3 * TS, 36, 2);
      ctx.fillStyle = '#6a5448'; ctx.fillRect(x, y0 + 6, 44, 26); ctx.fillStyle = '#7e6656'; ctx.fillRect(x + 4, y0 + 6, 8, 26);
      ctx.fillStyle = '#4a3a32'; for (let k = 0; k < 3; k++) ctx.fillRect(x, y0 + 12 + k * 8, 44, 1);
      ctx.fillStyle = '#5a463c'; ctx.beginPath(); ctx.moveTo(x - 2, y0 + 6); ctx.lineTo(x + 22, y0 - 4); ctx.lineTo(x + 46, y0 + 6); ctx.fill();
      ctx.fillStyle = 'rgba(120,60,30,0.5)'; ctx.fillRect(x + 30, y0 + 14, 3, 14);
    }
  }
}
function drawLandlordBody(b, corpse) {        // the rooftop boss: singlet, gold chain, flares, shades, Tommy gun
  const moving = !corpse && Math.abs(b.vx) > 10 && b.onGround;
  const s = moving ? Math.round(Math.sin(b.anim * 8) * 3) : 0, SK = '#d8a070', SKD = '#a87048';
  px(-9 + s, -12, 8, 12, '#2a2230'); px(2 - s, -12, 8, 12, '#2a2230'); px(-11 + s, -3, 10, 3, '#2a2230'); px(1 - s, -3, 10, 3, '#2a2230');   // flares
  px(-10 + s, -1, 8, 1, '#0a0a0a'); px(2 - s, -1, 8, 1, '#0a0a0a');
  px(-12, -28, 24, 17, '#f0ece0'); px(-12, -28, 24, 2, '#ffffff'); px(-12, -14, 24, 3, '#3a2a1a'); px(-2, -14, 4, 3, '#e8c040');   // singlet, belt
  px(-13, -24, 4, 10, SK); px(-12, -18, 26, 6, SKD); px(-12, -18, 26, 1, SK);                            // belly over the belt
  px(-6, -27, 12, 2, '#e8c040'); px(-1, -26, 2, 3, '#ffd23f');                                            // chain
  px(-6, -38, 12, 11, SK); px(-6, -29, 12, 2, SKD);
  px(-7, -40, 14, 4, '#0e0c10'); px(-8, -38, 3, 4, '#0e0c10');                                            // slicked back
  px(-2, -35, 9, 3, '#050505'); px(-1, -35, 3, 1, '#5a7aa0');                                             // shades
  px(1, -31, 5, 1, '#5a2a1a'); px(5, -32, 4, 1, '#e8e0d0'); if (!corpse && Math.floor(G.clock * 3) % 3 === 0) { px(9, -35, 1, 1, '#c8c8c8'); px(10, -37, 1, 1, '#a8a8a8'); }   // cigar
  const gy = b.aimLow ? -10 : -20;
  px(2, gy - 2, 6, 5, SK); px(6, gy - 3, 8, 6, '#5a3a1a'); px(12, gy - 3, 14, 4, '#2a2a30'); px(12, gy - 3, 14, 1, '#6a6a74');
  px(14, gy + 1, 5, 6, '#2a2a30'); px(15, gy + 2, 3, 4, '#5a5a62');                                       // drum mag
  if (!corpse && b.fireT > 0) { px(26, gy - 5, 6, 7, '#fff2a0'); px(29, gy - 3, 4, 3, '#fff'); }
  if (!corpse && b.state === 'lob_tele') { px(-16, -46, 4, 6, '#3a5a2a'); px(-15, -48, 2, 2, '#888'); }
}
