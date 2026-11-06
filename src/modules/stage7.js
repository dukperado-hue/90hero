// =====================================================================
// v32 — STAGE 07: BANGKOK, "UNCLE CAN'T GET HOME". One long run from the floating market, past Wat Arun's pier and the
// Thammasat quad (a schoolkid rides an elephant to class), up Ratchadamnoen Avenue to the Truck Baron.
// Everything breakable is a weapon: fruit crates, gas tanks, stall roofs. No real people; landmarks only.
// =====================================================================
const S7 = { W: 332, arun: 82, tu: 168, ave: 252, gate: 292, trig: 297, boss: 322, door: 328 };
const LOCKS7 = [
  { x0: 34, x1: 74, trig: 42, waves: [                       // THE FLOATING MARKET: everybody rushes you
    [['soldier', 70], ['knife', 38], ['soldier', 72]],
    [['knife', 40], ['gunner', 72], ['soldier', 68], ['knife', 70]],
    [['bomber', 70], ['soldier', 38], ['knife', 72], ['gunner', 66]]
  ] },
  { x0: 118, x1: 160, trig: 126, waves: [                    // THE PIER: the giant with the gas tank
    [['soldier', 156], ['knife', 122], ['gunner', 154]],
    [['heavy', 156], ['knife', 124], ['soldier', 150]],
    [['shield', 156], ['bomber', 152], ['knife', 122], ['gunner', 140]]
  ] },
  { x0: 204, x1: 246, trig: 212, waves: [                    // THE QUAD: a lot of students' uncles
    [['soldier', 242], ['gunner', 208], ['knife', 240]],
    [['shield', 242], ['shield', 210], ['bomber', 238]],
    [['heavy', 242], ['knife', 208], ['soldier', 236], ['gunner', 230]]
  ] }
];
const S7IMG = {};
(() => { for (const [k, src] of [['market', typeof S7_MARKET_SRC !== 'undefined' && S7_MARKET_SRC], ['arun', typeof S7_ARUN_SRC !== 'undefined' && S7_ARUN_SRC], ['tu', typeof S7_TU_SRC !== 'undefined' && S7_TU_SRC], ['ratch', typeof S7_RATCH_SRC !== 'undefined' && S7_RATCH_SRC]]) if (src) { const im = new Image(); im.onload = () => { S7IMG[k] = im; }; im.src = src; } })();
const s7zone = tx => tx < S7.arun ? 'market' : tx < S7.tu ? 'arun' : tx < S7.ave ? 'tu' : 'ave';
function buildStage7(E, set, fill, en, br, cp, hint) {
  LOCKS = LOCKS7; S7.arena = 'idle'; S7.eleph = null; S7.elephDone = false; S7.boats = []; S7.tuk = [];
  fill(0, LW - 1, 18, LH - 1, T.G);
  fill(0, 1, 0, 17, T.S); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  // ---------- A. THE FLOATING MARKET ----------
  hint(4, 12, 'A/D MOVE   W / LEFT CTRL JUMP.   YOUR BOAT HIT A FRUIT STALL.');
  hint(14, 10, 'EVERYTHING IS A WEAPON: BREAK THE FRUIT CRATES, KICK THE GAS TANKS.');
  fill(10, 14, 15, 15, T.P); fill(18, 20, 17, 17, T.C); fill(22, 26, 14, 14, T.P); fill(28, 29, 17, 17, T.C); fill(30, 33, 16, 16, T.C);
  br(24, 18); br(31, 15); br(46, 18); br(60, 18);
  fill(48, 54, 15, 15, T.P); fill(58, 63, 13, 13, T.P); fill(66, 70, 15, 15, T.P); fill(56, 57, 16, 17, T.C); fill(75, 77, 17, 17, T.C);
  en('soldier', 16, 18); en('knife', 25, 13); en('soldier', 33, 15); en('gunner', 50, 14); en('soldier', 62, 12);
  cp(36);
  cp(78);
  // ---------- B. WAT ARUN'S PIER ----------
  hint(86, 10, 'THE PIER.  WAT ARUN AT SUNSET.  SOMEONE WANTS YOU TO MISS THE LAST BOAT.');
  fill(92, 97, 15, 15, T.P); fill(102, 108, 13, 13, T.P); fill(112, 116, 15, 15, T.P); fill(98, 100, 17, 17, T.C); fill(128, 132, 15, 15, T.P); fill(136, 141, 13, 13, T.P); fill(144, 148, 15, 15, T.P);
  br(100, 18); br(110, 18); br(134, 18); br(150, 18);
  en('soldier', 94, 14); en('gunner', 105, 12); en('knife', 114, 14); en('soldier', 130, 14); en('bomber', 138, 12);
  cp(120);
  cp(160);
  // ---------- C. THAMMASAT QUAD ----------
  hint(172, 10, 'THE QUAD.  MIND THE ELEPHANT.  HE IS LATE FOR SCHOOL.');
  fill(176, 181, 15, 15, T.P); fill(186, 192, 13, 13, T.P); fill(196, 200, 15, 15, T.P); fill(182, 184, 17, 17, T.C); fill(226, 232, 15, 15, T.P); fill(236, 241, 13, 13, T.P);
  br(190, 18); br(222, 18); br(244, 18);
  en('soldier', 178, 14); en('shield', 188, 12); en('gunner', 198, 14); en('knife', 224, 18); en('bomber', 234, 14);
  cp(204);
  cp(248);
  // ---------- D. RATCHADAMNOEN AVENUE (boss) ----------
  hint(254, 10, 'THE AVENUE.  A LONG BLACK TRUCK IS PARKED SIDEWAYS.  THE OWNER IS EATING LUNCH.');
  fill(262, 267, 15, 15, T.P); fill(272, 276, 13, 13, T.P); fill(280, 285, 15, 15, T.P); fill(268, 270, 17, 17, T.C);
  br(264, 18); br(282, 18);
  en('soldier', 266, 14); en('gunner', 275, 12); en('knife', 283, 14);
  fill(S7.door, S7.door + 1, 0, 17, T.D);
  E.start = { x: 4 * TS, y: 18 * TS - PC.standH };
  E.flag = { x: 326 * TS, y: 18 * TS };
  return E;
}
function updStage7(dt) {
  if (STAGE !== 7) return;
  const p = G.player;
  // the elephant crosses the quad once
  if (!S7.eleph && !S7.elephDone && p.x > 176 * TS) { S7.eleph = { x: 172 * TS, y: 18 * TS, t: 0, hit: new Set() }; popup(p.x + 20, p.y - 30, 'จะสายแล้ว!  (LATE FOR SCHOOL)', '#ffd23f', true); }
  if (S7.eleph) {
    const el = S7.eleph; el.t += dt; el.x += 44 * dt;
    if (Math.floor(el.t * 1.6) !== Math.floor((el.t - dt) * 1.6)) { shake(0.06); dust(el.x + 14, el.y, 2, 4); }
    for (const e of G.enemies) if (!e.dead && !e.para && !el.hit.has(e) && Math.abs(e.x + e.w / 2 - (el.x + 14)) < 30 && Math.abs(e.y + e.h - el.y) < 20) {
      el.hit.add(e); damageEnemy(e, 4, el.x + 14, true); if (!e.dead) { e.vx = 300; e.vy = -280; e.stun = 1.0; } popup(e.x + 4, e.y - 10, 'TRUNK!', '#c8c8d0'); audio.play('slam'); hitstop(0.05);
    }
    if (el.x > 248 * TS) { S7.eleph = null; S7.elephDone = true; }
  }
  // the avenue: gate closes, the Baron arrives
  if (S7.arena === 'idle' && p.x > S7.trig * TS && !p.dead) {
    S7.arena = 'fight'; for (let ty = 8; ty <= 17; ty++) setTile(S7.gate, ty, T.S);
    dust(S7.gate * TS + 8, 18 * TS, 10, 8); audio.play('clang'); shake(0.3);
    G.cam.lock = { x0: S7.gate * TS, x1: (S7.door + 2) * TS };
    later(0.8, spawnBaron);
  }
}
// ---------------- THE TRUCK BARON ----------------
function spawnBaron() {
  G.boss = { type: 'baron', name: 'THE TRUCK BARON', x: S7.boss * TS, y: 10 * TS, w: 24, h: 38, vx: 0, vy: 0, hp: 190, maxHp: 190, face: -1,
    state: 'enter', t: 1.2, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, shown: 0, cd: 0, dazeT: 0 };
  G.banner = { t: 0, title: 'THE TRUCK BARON', sub: 'เจ้าพ่อรถบรรทุก  —  "YOU PARKED IN MY AVENUE."' };
  audio.play('roar'); shake(0.4);
}
function updBaron(b, dt) {
  const p = G.player, dx = p.x + p.w / 2 - (b.x + b.w / 2);
  b.flash -= dt; b.anim += dt; b.t -= dt; b.cd -= dt;
  b.vy = Math.min(b.vy + 1500 * dt, 800);
  const wasG = b.onGround; moveBody(b, dt);
  if (b.state === 'enter') { if (b.onGround && !wasG) { shake(0.5); audio.play('slam'); dust(b.x + 12, b.y + b.h, 14, 10); } if (b.t <= 0 && b.onGround) { b.state = 'idle'; b.t = 0.7; } return; }
  if (b.dying > 0) {
    b.dying -= dt; b.vx = 0;
    if (Math.random() < dt * 10) explode(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 22, 0, { noDmg: true, quiet: true });
    if (b.dying <= 0) {
      b.dead = true; explode(b.x + b.w / 2, b.y + b.h / 2, 64, 30, { byPlayer: true });
      explode((S7.boss + 7) * TS, 17 * TS, 50, 0, { noDmg: true });               // and the truck goes with him
      for (let ty = 0; ty <= 17; ty++) for (const tx of [S7.door, S7.door + 1]) if (tileAt(tx, ty) === T.D) setTile(tx, ty, T.E);
      G.exitOpen = true; G.cam.lock = null; popup(b.x, 9 * TS, 'TUK-TUK HOME. ...MAYBE.', '#ffd23f', true);
      for (const e of G.enemies) if (!e.dead) { e.hp = 0; killEnemy(e, 1, true); }
    }
    return;
  }
  if (b.hp < b.maxHp * 0.5 && b.phase === 1) { b.phase = 2; popup(b.x + 12, b.y - 12, '"OKAY, NOW I\'M ANGRY!"', '#ff5a3a', true); audio.play('roar'); }
  const fast = b.phase === 2 ? 0.72 : 1;
  if (b.dazeT > 0) { b.dazeT -= dt; b.vx = approach(b.vx, 0, 900 * dt); return; }
  if (!p.dead && overlap(b, p)) hurtPlayer(1, b.x + b.w / 2, true);
  switch (b.state) {
    case 'idle':
      b.vx = approach(b.vx, 0, 900 * dt);
      if (b.t <= 0 && b.onGround) {
        b.face = sign(dx) || b.face;
        const k = ['punch', 'rush', 'stomp', 'summon'][b.atk++ % 4];
        if (k === 'punch') { b.state = 'punch'; b.t = 0.45 * fast; b.vx = b.face * 90; }
        else if (k === 'rush') { b.state = 'rush_tele'; b.t = 0.8 * fast; audio.play('warn'); }
        else if (k === 'stomp') { b.state = 'leap'; b.vy = -600; b.vx = clamp(dx * 1.3, -300, 300); b.landSlam = true; audio.play('whoosh'); }
        else { b.state = 'summon'; b.t = 0.9; popup(b.x + 12, b.y - 12, '"BOYS!  GET HIM!"', '#ffd23f', true); }
      }
      break;
    case 'punch':
      if (b.t <= 0) { if (!p.dead && Math.abs(dx) < 38 && Math.abs((p.y + p.h) - (b.y + b.h)) < 22) { hurtPlayer(1, b.x + b.w / 2, true); } shake(0.12); audio.play('punch'); b.vx = 0; b.state = 'idle'; b.t = 0.7 * fast; }
      break;
    case 'rush_tele': b.vx = 0; if (b.t <= 0) { b.state = 'rush'; b.t = 1.1; b.vx = b.face * 280; audio.play('whoosh'); } break;
    case 'rush':
      if (Math.random() < dt * 40) dust(b.x + b.w / 2 - b.face * 10, b.y + b.h, 1, 4);
      if (b.hitWall || b.t <= 0) { if (b.hitWall) { shake(0.45); audio.play('slam'); b.dazeT = 1.4; popup(b.x + 12, b.y - 12, 'OW!', '#ffd23f'); for (let k = 0; k < 3; k++) later(k * 0.12, () => part('debris', b.x + 12, b.y + 8, rnd(-80, 80), rnd(-200, -80), 0.7, 2, '#8a8a8a', { g: 900 })); } b.vx = 0; b.state = 'idle'; b.t = 0.8 * fast; }
      break;
    case 'leap':
      if (b.onGround && b.landSlam && !wasG) { b.landSlam = false; shake(0.55); audio.play('slam'); dust(b.x + 12, b.y + b.h, 18, 12); slamWave(b, 100); b.dazeT = 0.9; b.state = 'idle'; b.t = 0.6 * fast; b.vx = 0; }
      break;
    case 'summon':
      b.vx = 0;
      if (b.t <= 0) { for (const off of [-6, 6]) { const tx = clamp(Math.floor((b.x + b.w / 2) / TS) + off, S7.gate + 2, 326); dropIn(Math.random() < 0.5 ? 'knife' : 'soldier', tx); } if (b.phase === 2) dropIn('gunner', S7.gate + 8); b.state = 'idle'; b.t = 0.9 * fast; }
      break;
  }
}
function drawBaron(b) {
  const fx = Math.round(b.x + b.w / 2), fy = Math.round(b.y + b.h);
  ctx.save(); ctx.translate(fx, fy);
  if (b.dying > 0) { ctx.globalAlpha = 0.4 + 0.6 * (b.dying / 2); ctx.rotate(-(1 - b.dying / 2) * 0.3); }
  ctx.scale(b.face || 1, 1);
  FLASH = b.flash > 0 && Math.floor(b.anim * 30) % 3 === 0;
  const skin = '#c8905a', vest = '#d8d0c0', shorts = '#2a3a58', gold = '#e8c040';
  px(-9, -7, 8, 7, '#1a1410'); px(2, -7, 8, 7, '#1a1410'); px(-9, -14, 8, 8, shorts); px(2, -14, 8, 8, shorts);
  px(-12, -32, 24, 20, vest); px(-12, -32, 24, 2, '#b8b0a0'); px(-8, -24, 16, 3, '#e8e0d0');                     // an undershirt over a big belly
  for (let k = 0; k < 5; k++) px(-7 + k * 3, -27 + (k % 2), 2, 2, gold);                                          // gold chain
  const lunge = b.state === 'punch' ? 6 : 0, up = b.state === 'summon' ? -14 : 0;
  px(6 + lunge, -30 + up, 14, 6, skin); px(19 + lunge, -31 + up, 5, 7, skin); px(-18, -30, 8, 6, skin);
  px(-7, -42, 14, 11, skin); px(-5, -38, 2, 2, b.dazeT > 0 ? '#ffd23f' : '#201814'); px(2, -38, 2, 2, b.dazeT > 0 ? '#ffd23f' : '#201814'); px(-3, -34, 8, 2, '#4a2a1a');
  px(-9, -45, 18, 4, '#1a1a1a'); px(-7, -48, 14, 3, '#d02a2a');                                                     // a red headband
  if (b.dazeT > 0) for (let k = 0; k < 3; k++) { const a = G.clock * 6 + k * 2.1; px(Math.cos(a) * 10 - 1, -52 + Math.sin(a) * 3, 2, 2, '#ffd23f'); }
  if (b.state === 'rush_tele') px(-14, -2, 28, 2, Math.floor(G.clock * 16) % 2 ? '#ff3a2a' : '#ffd23f');
  FLASH = false; ctx.restore();
}
// ---------------- playfield skin ----------------
function skin7(g, t, tx, ty, x, y, i) {
  const z = s7zone(tx);
  if (t === T.C) {                                                  // a fruit crate
    g.fillStyle = '#6a4a22'; g.fillRect(x, y + 3, TS, 13); g.fillStyle = '#8a6430'; g.fillRect(x, y + 3, TS, 1.5); g.fillStyle = '#4a3216'; g.fillRect(x, y + 9, TS, 1);
    g.fillStyle = ['#ffb020', '#e84a2a', '#8ac83a', '#f0d040'][(tx + ty) & 3]; g.fillRect(x + 2, y + 1, 4, 4); g.fillRect(x + 7, y, 4, 4); g.fillRect(x + 11, y + 2, 4, 3);
    return true;
  }
  if (t === T.P) {                                                  // a stall roof / boat canopy / low wall
    const c = ['#d8483a', '#3a78c8', '#e8b030', '#38a868'][((tx / 3) | 0) & 3];
    if (z === 'ave' || z === 'tu') { g.fillStyle = '#b8a888'; g.fillRect(x, y, TS, 5); g.fillStyle = '#d8c8a8'; g.fillRect(x, y, TS, 1.5); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 4.5, TS, 0.6); return true; }
    g.fillStyle = c; g.fillRect(x, y, TS, 5); g.fillStyle = '#ffffff'; if ((tx & 1) === 0) g.fillRect(x, y, TS, 5); g.fillStyle = c; g.fillRect(x + 4, y, 4, 5); g.fillRect(x + 12, y, 4, 5);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 4.5, TS, 0.7); return true;
  }
  if ((t === T.G || t === T.H) && ty === 18 && tileAt(tx, ty - 1) !== T.G) {
    const dmg = thp[i] < HPS[t];
    if (z === 'market' || z === 'arun') { g.fillStyle = '#5a3a20'; g.fillRect(x, y, TS, TS); g.fillStyle = '#8a5e34'; g.fillRect(x, y, TS, 2); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(x + ((tx % 2) * 8), y + 2, 0.8, 14); g.fillRect(x, y + 8, TS, 0.6); }
    else if (z === 'tu') { g.fillStyle = '#8a7a62'; g.fillRect(x, y, TS, TS); g.fillStyle = '#b8a888'; g.fillRect(x, y, TS, 2); g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(x + 8, y, 0.8, TS); g.fillRect(x, y + 8, TS, 0.6); g.fillStyle = '#5a9a40'; g.fillRect(x + ((tx * 5) % 11), y - 0.5, 5, 1.5); }
    else { g.fillStyle = '#4a4a50'; g.fillRect(x, y, TS, TS); g.fillStyle = '#6a6a72'; g.fillRect(x, y, TS, 1.5); g.fillStyle = '#e8d070'; if (tx % 4 === 0) g.fillRect(x + 2, y + 6, 12, 1.5); }
    if (dmg) { g.fillStyle = 'rgba(10,10,6,0.7)'; g.fillRect(x + 3, y + 4, 5, 1); g.fillRect(x + 7, y + 5, 1, 4); }
    return true;
  }
  if (t === T.B) { g.fillStyle = '#b89a6a'; g.fillRect(x, y, TS, TS); g.fillStyle = '#d8ba88'; g.fillRect(x + 1, y + 1, 6, 6); g.fillRect(x + 9, y + 1, 6, 6); g.fillRect(x + 4, y + 9, 8, 6); return true; }
  return false;
}
// ---------------- world space behind the tiles ----------------
function drawStage7Mid(cam) {
  const t = G.clock, L = cam.x - 40, R = cam.x + VW + 40, gy = 18 * TS;
  for (let c = 6; c < S7.arun - 2; c += 7) {                                         // market: lantern strings + stall awnings
    const x = c * TS; if (x < L || x > R) continue;
    ctx.fillStyle = '#4a3420'; ctx.fillRect(x, gy - 50, 3, 50);
    for (let k = 0; k < 3; k++) { const lx = x + 10 + k * 14, ly = gy - 44 + Math.sin(t * 1.5 + k + c) * 1.2; ctx.fillStyle = ['#e83a2a', '#ffd23f', '#e83a2a'][k]; ctx.beginPath(); ctx.ellipse(lx, ly, 4, 5, 0, 0, 6.283); ctx.fill(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.12; ctx.fillStyle = '#ffa040'; ctx.beginPath(); ctx.arc(x + 24, gy - 44, 28, 0, 6.283); ctx.fill(); ctx.restore();
  }
  for (let c = S7.arun + 4; c < S7.tu - 2; c += 9) {                                 // pier posts with tied long-tail boats' ropes
    const x = c * TS; if (x < L || x > R) continue;
    ctx.fillStyle = '#4a3216'; ctx.fillRect(x, gy - 18, 5, 18); ctx.fillStyle = '#6a4a28'; ctx.fillRect(x, gy - 18, 5, 2);
  }
  for (let c = S7.tu + 6; c < S7.ave - 2; c += 11) {                                 // quad: rain trees + lamp posts
    const x = c * TS; if (x < L || x > R) continue;
    if ((c / 11 | 0) & 1) { ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x - 3, gy - 34, 6, 34); ctx.fillStyle = '#2f6a34'; ctx.beginPath(); ctx.ellipse(x, gy - 44, 26, 16, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#3f8a44'; ctx.beginPath(); ctx.ellipse(x - 6, gy - 48, 14, 8, 0, 0, 6.283); ctx.fill(); }
    else { ctx.fillStyle = '#3a3a40'; ctx.fillRect(x, gy - 40, 3, 40); ctx.fillStyle = '#ffe8a0'; ctx.fillRect(x - 3, gy - 46, 9, 6); }
  }
  for (let c = S7.ave + 4; c < S7.W - 6; c += 9) {                                   // avenue: flags and lamp posts
    const x = c * TS; if (x < L || x > R) continue;
    ctx.fillStyle = '#3a3a40'; ctx.fillRect(x, gy - 56, 3, 56);
    const w = Math.sin(t * 3 + c) * 2; ctx.fillStyle = '#d83a3a'; ctx.fillRect(x + 3, gy - 56, 18 + w, 3); ctx.fillStyle = '#f4f4f4'; ctx.fillRect(x + 3, gy - 53, 18 + w, 3); ctx.fillStyle = '#2a3a90'; ctx.fillRect(x + 3, gy - 50, 18 + w, 4); ctx.fillStyle = '#f4f4f4'; ctx.fillRect(x + 3, gy - 46, 18 + w, 3); ctx.fillStyle = '#d83a3a'; ctx.fillRect(x + 3, gy - 43, 18 + w, 3);
  }
  if (S7.ave * TS < R + 200 && S7.W * TS > L) {                                      // the Baron's black truck, parked sideways behind the arena
    const x = (S7.boss + 5) * TS, y = gy;
    ctx.fillStyle = '#16161c'; ctx.fillRect(x, y - 38, 70, 34); ctx.fillStyle = '#2a2a34'; ctx.fillRect(x, y - 38, 70, 3); ctx.fillStyle = '#3a3a48'; ctx.fillRect(x + 48, y - 34, 20, 14);
    ctx.fillStyle = '#9ac8e8'; ctx.fillRect(x + 52, y - 32, 14, 9); ctx.fillStyle = '#e8c040'; ctx.fillRect(x + 4, y - 20, 40, 3);
    ctx.fillStyle = '#0a0a0e'; ctx.beginPath(); ctx.arc(x + 14, y - 3, 7, 0, 6.283); ctx.arc(x + 56, y - 3, 7, 0, 6.283); ctx.fill(); ctx.fillStyle = '#6a6a72'; ctx.beginPath(); ctx.arc(x + 14, y - 3, 3, 0, 6.283); ctx.arc(x + 56, y - 3, 3, 0, 6.283); ctx.fill();
  }
  if (S7.eleph) {                                                                    // the schoolkid on the elephant
    const el = S7.eleph, x = Math.round(el.x), y = el.y, b = Math.round(Math.abs(Math.sin(el.t * 5)) * 1.5), g = '#8a8a90', g2 = '#6a6a72';
    ctx.fillStyle = g2; ctx.fillRect(x + 4, y - 8, 7, 8); ctx.fillRect(x + 22, y - 8, 7, 8); ctx.fillStyle = g; ctx.fillRect(x + 12, y - 8 + (b > 0 ? 1 : 0), 7, 8); ctx.fillRect(x + 28, y - 8, 7, 8);
    ctx.fillStyle = g; ctx.fillRect(x + 2, y - 28 - b, 32, 22); ctx.fillStyle = g2; ctx.fillRect(x + 2, y - 10 - b, 32, 3);
    ctx.fillStyle = g; ctx.fillRect(x + 32, y - 34 - b, 14, 16); ctx.fillStyle = g2; ctx.fillRect(x + 30, y - 32 - b, 6, 12);
    ctx.fillStyle = g; ctx.fillRect(x + 44, y - 20 - b, 4, 16 + Math.round(Math.sin(el.t * 3) * 2)); ctx.fillStyle = '#f4f0e0'; ctx.fillRect(x + 42, y - 22 - b, 2, 5);
    ctx.fillStyle = '#141414'; ctx.fillRect(x + 40, y - 30 - b, 2, 2);
    ctx.fillStyle = '#c83a4a'; ctx.fillRect(x + 8, y - 30 - b, 20, 4); ctx.fillStyle = '#e8c040'; ctx.fillRect(x + 8, y - 30 - b, 20, 1);
    ctx.fillStyle = '#f4f4f4'; ctx.fillRect(x + 22, y - 42 - b, 7, 8); ctx.fillStyle = '#e8a878'; ctx.fillRect(x + 23, y - 48 - b, 5, 5); ctx.fillStyle = '#141414'; ctx.fillRect(x + 22, y - 50 - b, 7, 3);   // school shirt, face, hair
    ctx.fillStyle = '#2a4a98'; ctx.fillRect(x + 22, y - 34 - b, 7, 3); ctx.fillStyle = '#e8b030'; ctx.fillRect(x + 20, y - 41 - b, 3, 7);                                                                     // shorts, backpack
  }
}
function drawStage7Front() {
  const c = G.cam, z = s7zone(Math.floor((c.x + VW / 2) / TS));
  const tint = { market: 'rgba(255,200,90,0.05)', arun: 'rgba(255,120,60,0.10)', tu: 'rgba(120,180,255,0.04)', ave: 'rgba(255,200,120,0.07)' }[z];
  ctx.fillStyle = tint; ctx.fillRect(0, 0, VW, VH);
  const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.4, VW / 2, VH / 2, VW * 0.7); vg.addColorStop(0, 'rgba(20,10,0,0)'); vg.addColorStop(1, 'rgba(20,10,0,0.32)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
}
function drawStage7BG(cam) {
  const sky = ctx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, '#6a8ac8'); sky.addColorStop(1, '#e8c890'); ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
  const hor = 18 * TS - cam.y, cxT = (cam.x + VW / 2) / TS;
  const zones = [[0, S7IMG.market, '#78b8e8'], [S7.arun, S7IMG.arun, '#7a4a98'], [S7.tu, S7IMG.tu, '#78b0e4'], [S7.ave, S7IMG.ratch, '#e0b880']];
  const draw = (z, alpha) => {
    const [x0, im, sk] = z; if (!im || alpha <= 0) return;
    const h = Math.round(hor + 3), w = Math.round(im.width * h / im.height), off = (cam.x - x0 * TS + VW * 0.15) * 0.22, i0 = Math.floor(off / w);
    ctx.globalAlpha = alpha; ctx.fillStyle = sk; ctx.fillRect(0, 0, VW, h);
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, 0); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(im, x, 0, w, h); }
    ctx.globalAlpha = 1;
  };
  let zi = 0; for (let k = 0; k < zones.length; k++) if (cxT >= zones[k][0]) zi = k;
  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  draw(zones[zi], 1); const nx = zones[zi + 1]; if (nx) { const k = clamp((cxT - (nx[0] - 14)) / 14, 0, 1); if (k > 0) draw(nx, k); }
  ctx.imageSmoothingEnabled = pv;
}
