// =====================================================================
// v36 — STAGE 09: TAIWAN, "UP AND DOWN THE ISLAND" — the Broforce stage. Everything is dirt and brick and it all breaks:
// shoot the ground out from under them, blow the hill apart, drop the house on their heads. Up and down, not flat.
// XIMENDING (neon blocks, rooftops) -> THE CAT VILLAGE (a steep hill of terraces; pet the cats) -> THE ROCK CAPE (mushroom rocks,
// the sea below: fall in and you're gone) -> THE MOUNTAIN RAILWAY (climb through the giant cypress forest) -> THE GAS KING on the summit.
// Landmarks only, no real people.
// =====================================================================
const S9 = { W: 440, H: 40, cats: 110, cape: 210, rail: 310, gate: 402, boss: 426, door: 436 };
const s9zone = tx => tx < S9.cats ? 'xmd' : tx < S9.cape ? 'cats' : tx < S9.rail ? 'cape' : 'rail';
function s9surface(tx) {                                  // the surface row of the land, column by column
  if (tx < S9.cats) return 34;
  if (tx < S9.cape) { const k = tx - S9.cats; return Math.max(16, 34 - Math.floor(k / 5) * 2 + (k > 80 ? 0 : 0)); }        // terraces up the hill
  if (tx < S9.cape + 20) return 16 + Math.floor((tx - S9.cape) * 0.7);                                               // down to the cape
  if (tx < S9.rail) return 30;
  if (tx < S9.gate - 4) { const k = tx - S9.rail; return Math.max(10, 30 - Math.floor(k / 4)); }                      // up the mountain
  return 10;
}
const S9SEA = [[S9.cape + 34, S9.cape + 39], [S9.cape + 58, S9.cape + 63], [S9.cape + 80, S9.cape + 86]];
const LOCKS9 = [
  { x0: 52, x1: 84, trig: 60, waves: [[['soldier', 80], ['gunner', 56], ['bomber', 78]], [['heavy', 80], ['soldier', 56], ['gunner', 76], ['knife', 58]]] },
  { x0: 170, x1: 200, trig: 176, waves: [[['soldier', 196], ['knife', 174], ['gunner', 194]], [['shield', 196], ['bomber', 174], ['gunner', 192], ['soldier', 180]]] },
  { x0: 262, x1: 296, trig: 268, waves: [[['gunner', 292], ['bomber', 266], ['soldier', 290]], [['heavy', 292], ['bomber', 266], ['bomber', 290], ['gunner', 270]]] }
];
(() => { for (const [k, v] of [['s9xmd', 'S9_XIMEN_SRC'], ['s9cats', 'S9_CATS_SRC'], ['s9cape', 'S9_YEHLIU_SRC'], ['s9rail', 'S9_ALISHAN_SRC']]) { try { loadBG(k, eval('typeof ' + v + " !== 'undefined' ? " + v + ' : null')); } catch (e) { } } })();
function buildStage9(E, set, fill, en, br, cp0, hint0) {
  LOCKS = LOCKS9;
  Object.assign(S9, { arena: 'idle', gas: [], cats9: [], t: 0 });
  const sf = s9surface;
  const cp = tx => E.checkpoints.push({ x: tx * TS, y: sf(tx) * TS, on: false });
  const hint = (tx, s) => hint0(tx, sf(tx) - 6, s);
  const enS = (t, tx, up) => en(t, tx, sf(tx) - (up || 0));
  const brS = (tx, up) => br(tx, sf(tx) - (up || 0));
  for (let tx = 0; tx < LW; tx++) fill(tx, tx, sf(tx), LH - 1, T.G);
  fill(0, 1, 0, LH - 1, T.S); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  for (const [a, b] of S9SEA) fill(a, b, 0, LH - 1, T.E);                    // the sea: no bottom
  // a few steel slabs deep down so the whole island doesn't fall into the sea when you dig
  for (let tx = 4; tx < LW - 4; tx += 9) if (!S9SEA.some(([a, b]) => tx >= a - 1 && tx <= b + 1)) fill(tx, tx + 1, LH - 3, LH - 2, T.S);
  // ---------- A. XIMENDING: brick blocks with floors inside, rooftops to fight on
  hint(4, 'TAIPEI.  EVERYTHING HERE BREAKS: SHOOT THE GROUND, BLOW UP THE BUILDINGS.');
  hint(30, 'DIG UNDER THEM.  DROP THE HOUSE ON THEIR HEADS.  BROFORCE RULES.');
  for (const [x0, w, h] of [[12, 6, 8], [24, 5, 11], [36, 7, 7], [50, 4, 12], [64, 6, 9], [88, 8, 10], [100, 5, 7]]) {
    const top = 34 - h; fill(x0, x0 + w - 1, top, 33, T.B); fill(x0 + 1, x0 + w - 2, top + 1, 33, T.E);
    for (let fy = 33 - 4; fy > top; fy -= 4) fill(x0 + 1, x0 + w - 2, fy, fy, T.P);
    addLadder(x0 + w - 2, top + 1, 34); fill(x0 + w - 2, x0 + w - 2, top, top, T.E);        // a ladder up through every floor to the roof
    fill(x0, x0, 31, 33, T.E);                                                // door
    enS('gunner', x0 + 2, h); if (h > 9) enS('soldier', x0 + w - 2, h);
    brS(x0 + w - 2, 0);
  }
  for (const x of [8, 20, 33, 46, 58, 72, 82, 96]) enS(x % 3 ? 'soldier' : 'knife', x); for (const x of [10, 44, 76, 98]) brS(x);
  cp(40); cp(106);
  // ---------- B. THE CAT VILLAGE: terraces up the hill
  hint(S9.cats + 2, 'THE CAT VILLAGE.  UP THE STEPS.  TOUCH A CAT FOR LUCK (+ULT).');
  for (let k = 0; k < 18; k++) {
    const tx = S9.cats + 6 + k * 5, s = sf(tx); if (k % 3 === 1) { fill(tx, tx + 3, s - 4, s - 1, T.B); fill(tx + 1, tx + 2, s - 3, s - 1, T.E); fill(tx, tx + 3, s - 5, s - 5, T.P); }
    if (k % 3 === 1) addLadder(tx + 3, s - 5, s);
    if (k % 2 === 0) S9.cats9.push({ x: (tx + 1) * TS, y: s * TS, home: (tx + 1) * TS, t: rnd(0, 5), pet: false, run: 0 });
    if (k % 3 === 2) enS(k % 2 ? 'gunner' : 'soldier', tx + 2); if (k % 4 === 0) brS(tx + 3);
  }
  cp(S9.cats + 30); cp(S9.cats + 70); cp(S9.cape - 4);
  // ---------- C. THE ROCK CAPE: mushroom rocks on a shelf over the sea
  hint(S9.cape + 6, 'THE ROCK CAPE.  THE MUSHROOM ROCKS BREAK.  THE SEA DOES NOT GIVE YOU BACK.');
  for (const tx of [S9.cape + 26, S9.cape + 44, S9.cape + 50, S9.cape + 70, S9.cape + 76, S9.cape + 92]) { const s = sf(tx); fill(tx, tx, s - 4, s - 1, T.G); fill(tx - 1, tx + 1, s - 6, s - 5, T.G); }
  fill(S9.cape + 52, S9.cape + 54, 22, 22, T.G);                               // the queen's head (a tall one)
  fill(S9.cape + 53, S9.cape + 53, 23, 29, T.G);
  for (const [a, b] of S9SEA) { fill(a - 1, b + 1, 26, 26, T.P); }            // rope bridges over the sea gaps
  for (const x of [S9.cape + 28, S9.cape + 46, S9.cape + 66, S9.cape + 74, S9.cape + 94]) enS(x % 2 ? 'bomber' : 'soldier', x); for (const x of [S9.cape + 30, S9.cape + 48, S9.cape + 72, S9.cape + 96]) brS(x);
  cp(S9.cape + 42); cp(S9.rail - 4);
  // ---------- D. THE MOUNTAIN RAILWAY: up through the giant cypress forest
  hint(S9.rail + 2, 'THE MOUNTAIN RAILWAY.  CLIMB.  THE GAS KING LIVES ON TOP.');
  for (let k = 0; k < 6; k++) { const a = S9.rail + 8 + k * 14, s = sf(a); fill(a, a + 9, s - 5, s - 5, T.P); addLadder(a, s - 5, s); }   // trestle sections + ladders
  for (const tx of [S9.rail + 16, S9.rail + 40, S9.rail + 64]) { const s = sf(tx); fill(tx, tx + 2, s - 10, s - 1, T.B); }   // giant trunks (they fall)
  for (let k = 0; k < 9; k++) { const tx = S9.rail + 6 + k * 9; enS(['soldier', 'gunner', 'bomber', 'heavy', 'shield'][k % 5], tx); if (k % 2) brS(tx + 3); }
  cp(S9.rail + 40); cp(S9.gate - 6);
  // ---------- E. THE SUMMIT
  fill(S9.gate - 2, S9.door + 1, 10, LH - 1, T.S); fill(S9.gate - 2, S9.door + 1, 10, 13, T.G);   // the summit is solid rock under a skin of dirt
  fill(S9.door, S9.door + 1, 0, 9, T.D);
  E.start = { x: 4 * TS, y: sf(4) * TS - PC.standH };
  E.flag = { x: (S9.door - 2) * TS, y: 10 * TS };
  return E;
}
// ---------------- the cats
function updCats9(dt) {
  if (!S9.cats9) return;
  const p = G.player;
  for (const c of S9.cats9) {
    c.t += dt; c.run -= dt;
    const gy = groundBelow(c.x, c.y - TS * 2); c.y = Math.min(gy, c.y + 300 * dt); if (gy - c.y < 2) c.y = gy;
    if (c.run > 0) c.x += c.dir * 90 * dt; else c.x += (c.home - c.x) * dt * 0.5;
    if (!p.dead && !c.pet && Math.abs(p.x + p.w / 2 - c.x) < 10 && Math.abs(p.y + p.h - c.y) < 12) { c.pet = true; addUlt(p, 8); popup(c.x, c.y - 16, ['PURRR...', 'MEOW ♥', '*HEADBUTT*'][(Math.random() * 3) | 0], '#ffc8e8'); audio.play('check'); }
    for (const b of G.bullets) if (Math.abs(b.x - c.x) < 18 && Math.abs(b.y - c.y + 4) < 14 && c.run <= 0) { c.run = 1.0; c.dir = sign(c.x - b.x) || 1; popup(c.x, c.y - 14, 'MRRAOW!', '#ffd23f'); }
  }
}
function drawCats9() {
  if (!S9.cats9) return;
  for (const c of S9.cats9) {
    if (c.x < G.cam.x - 20 || c.x > G.cam.x + VW + 20) continue;
    const x = Math.round(c.x), y = Math.round(c.y), col = ['#e8a040', '#f0f0f0', '#3a3a3a', '#c8c0b0'][Math.abs(Math.round(c.home / 16)) % 4], tail = Math.sin(c.t * 4) * 2;
    ctx.fillStyle = col; ctx.fillRect(x - 4, y - 4, 8, 4); ctx.fillRect(x + 3, y - 7, 4, 4); ctx.fillRect(x + 3, y - 8, 1, 1); ctx.fillRect(x + 6, y - 8, 1, 1); ctx.fillRect(x - 6, y - 7 + tail * 0.5, 2, 4);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 5, y - 6, 1, 1);
    if (c.pet) { ctx.fillStyle = '#ff7ab8'; ctx.fillRect(x - 1, y - 12 - (c.t % 1) * 4, 2, 2); }
  }
}
// ---------------- THE GAS KING (boss): throws gas cylinders that blow the summit apart
function spawnGasKing() {
  G.boss = { type: 'gasking', name: 'THE GAS KING', x: S9.boss * TS, y: 2 * TS, w: 22, h: 34, vx: 0, vy: 0, hp: 230, maxHp: 230, face: -1,
    state: 'enter', t: 1.2, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, cd: 0, dazeT: 0 };
  G.banner = { t: 0, title: 'THE GAS KING', sub: 'ภูเขาก๊าซ  —  "EVERY HOUSE ON THIS MOUNTAIN BUYS MY GAS."' }; audio.play('roar'); shake(0.4);
}
function throwGas9(b, big, roll) {
  const p = G.player, dx = p.x + p.w / 2 - (b.x + b.w / 2), t = 0.9;
  S9.gas.push({ x: b.x + b.w / 2, y: b.y + 6, vx: roll ? b.face * 150 : clamp(dx / t, -320, 320) + rnd(-30, 30), vy: roll ? 0 : -330, t: 0, big, roll, r: 0 });
  audio.play('whoosh');
}
function updGas9(dt) {
  const p = G.player;
  for (const q of S9.gas) {
    q.t += dt; q.r += (q.roll ? q.vx * 0.08 : 8) * dt;
    if (q.roll) { q.vy = Math.min(q.vy + 900 * dt, 500); q.x += q.vx * dt; q.y += q.vy * dt; const gy = groundBelow(q.x, q.y - 8); if (q.y > gy - 5) { q.y = gy - 5; q.vy = 0; } if (solidPx(q.x + sign(q.vx) * 6, q.y - 2)) q.boom = true; }
    else { q.vy += 600 * dt; q.x += q.vx * dt; q.y += q.vy * dt; if (solidPx(q.x, q.y)) q.boom = true; }
    if (!p.dead && Math.abs(p.x + p.w / 2 - q.x) < 9 && Math.abs(p.y + p.h / 2 - q.y) < 12) q.boom = true;
    for (const bl of G.bullets) if (Math.abs(bl.x - q.x) < 6 && Math.abs(bl.y - q.y) < 6) { q.boom = true; q.shot = true; }
    if (q.t > (q.roll ? 3.2 : 2.5)) q.boom = true;
    if (q.boom && !q.done) { q.done = true; explode(q.x, q.y, q.big ? 46 : 32, q.big ? 8 : 5, q.shot ? { byPlayer: true } : {}); if (q.shot) popup(q.x, q.y - 16, 'SHOT IT!', '#7dff8a'); }
  }
  S9.gas = S9.gas.filter(q => !q.done);
}
function drawGas9() {
  if (!S9.gas) return;
  for (const q of S9.gas) { ctx.save(); ctx.translate(Math.round(q.x), Math.round(q.y)); ctx.rotate(q.r); const k = q.big ? 1.4 : 1; ctx.scale(k, k); ctx.fillStyle = '#d83a2a'; ctx.fillRect(-4, -6, 8, 11); ctx.fillStyle = '#f0f0f0'; ctx.fillRect(-4, -2, 8, 2); ctx.fillStyle = '#8a8a90'; ctx.fillRect(-2, -8, 4, 2); ctx.restore(); }
}
function updGasKing(b, dt) {
  const p = G.player, dx = p.x + p.w / 2 - (b.x + b.w / 2);
  b.flash -= dt; b.anim += dt; b.t -= dt;
  b.vy = Math.min(b.vy + 1500 * dt, 800); const wasG = b.onGround; moveBody(b, dt);
  if (b.y > LH * TS) { b.hp = 0; damageBoss(1, b.x); }
  if (b.state === 'enter') { if (b.onGround && !wasG) { shake(0.5); audio.play('slam'); dust(b.x + 11, b.y + b.h, 14, 10); } if (b.t <= 0 && b.onGround) { b.state = 'idle'; b.t = 0.6; } return; }
  if (b.dying > 0) {
    b.dying -= dt; b.vx = 0; if (Math.random() < dt * 12) explode(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 26, 0, { noDmg: true, quiet: true });
    if (b.dying <= 0) {
      b.dead = true; explode(b.x + b.w / 2, b.y + b.h / 2, 80, 30, { byPlayer: true }); S9.gas = [];
      for (let ty = 0; ty <= 9; ty++) for (const tx of [S9.door, S9.door + 1]) if (tileAt(tx, ty) === T.D) setTile(tx, ty, T.E);
      G.exitOpen = true; G.cam.lock = null; popup(b.x, b.y - 30, 'SUNRISE ON THE SUMMIT >>', '#7dff8a', true);
      for (const e of G.enemies) if (!e.dead) { e.hp = 0; killEnemy(e, 1, true); }
    }
    return;
  }
  if (b.hp < b.maxHp * 0.5 && b.phase === 1) { b.phase = 2; popup(b.x + 11, b.y - 12, '"THE BIG ONES, THEN!"', '#ff5a3a', true); audio.play('roar'); }
  const fast = b.phase === 2 ? 0.7 : 1;
  if (!p.dead && overlap(b, p)) hurtPlayer(1, b.x + b.w / 2, true);
  if (b.dazeT > 0) { b.dazeT -= dt; b.vx = approach(b.vx, 0, 900 * dt); return; }
  switch (b.state) {
    case 'idle':
      b.vx = approach(b.vx, 0, 900 * dt);
      if (b.t <= 0 && b.onGround) {
        b.face = sign(dx) || b.face;
        const k = ['throw', 'throw', 'roll', 'leap', 'summon'][b.atk++ % 5];
        if (k === 'throw') { b.state = 'throw'; b.n = b.phase === 2 ? 3 : 2; b.t = 0.35; }
        else if (k === 'roll') { b.state = 'roll'; b.t = 0.6; popup(b.x + 11, b.y - 12, '"ROLL OUT!"', '#ffd23f'); }
        else if (k === 'leap') { b.state = 'leap'; b.vy = -620; b.vx = clamp(dx * 1.2, -300, 300); audio.play('whoosh'); }
        else { b.state = 'summon'; b.t = 0.8; popup(b.x + 11, b.y - 12, '"DELIVERY BOYS!"', '#ffd23f', true); }
      }
      break;
    case 'throw': if (b.t <= 0) { throwGas9(b, b.phase === 2 && b.n === 1, false); b.n--; b.t = 0.4; if (b.n <= 0) { b.state = 'idle'; b.t = 1.0 * fast; } } break;
    case 'roll': if (b.t <= 0) { throwGas9(b, true, true); b.state = 'idle'; b.t = 1.2 * fast; } break;
    case 'leap': if (b.onGround && !wasG) { shake(0.5); audio.play('slam'); dust(b.x + 11, b.y + b.h, 16, 12); slamWave(b, 90); for (let tx = Math.floor(b.x / TS) - 2; tx <= Math.floor((b.x + b.w) / TS) + 2; tx++) { const ty = Math.floor((b.y + b.h + 2) / TS); if (DESTRUCT[tileAt(tx, ty)]) damageTile(tx, ty, 2); } b.dazeT = 0.8; b.state = 'idle'; b.t = 0.6 * fast; } break;
    case 'summon': b.vx = 0; if (b.t <= 0) { dropIn('bomber', S9.gate + 4); dropIn('soldier', S9.gate + 14); if (b.phase === 2) dropIn('gunner', S9.gate + 20); b.state = 'idle'; b.t = 1.0 * fast; } break;
  }
}
function drawGasKing(b) {
  const fx = Math.round(b.x + b.w / 2), fy = Math.round(b.y + b.h);
  ctx.save(); ctx.translate(fx, fy); ctx.scale(b.face || 1, 1);
  if (b.dying > 0) { ctx.globalAlpha = 0.4 + 0.6 * (b.dying / 2); ctx.rotate(-(1 - b.dying / 2) * 0.3); }
  FLASH = b.flash > 0 && Math.floor(b.anim * 30) % 3 === 0;
  const SK = '#c8905a', SH = '#2a6a3a', PN = '#2a2a32';
  px(-7, -10, 5, 10, PN); px(2, -10, 5, 10, PN); px(-8, -1, 6, 1, '#e8e8e8'); px(2, -1, 6, 1, '#e8e8e8');      // blue-white slippers
  px(-9, -26, 18, 16, SH); px(-9, -26, 2, 16, '#1a4a2a'); px(-6, -20, 12, 8, '#e8e0c8');                          // green work shirt open over a vest
  px(-10, -12, 20, 4, SK);                                                                                        // belly
  px(-5, -34, 10, 8, SK); px(-6, -36, 12, 3, '#141414'); px(0, -31, 4, 1, '#000'); px(1, -28, 3, 1, '#8a2020');  // red betel-nut mouth
  const up = b.state === 'throw' || b.state === 'roll' ? -10 : 0;
  px(8, -26 + up, 4, 10, SH); px(8, -16 + up, 4, 3, SK); if (up) { px(6, -38, 8, 11, '#d83a2a'); px(6, -34, 8, 2, '#f0f0f0'); }   // holding a cylinder up
  px(-12, -24, 4, 9, SH); px(-12, -15, 4, 3, SK);
  if (b.dazeT > 0) for (let k = 0; k < 3; k++) { const a = G.clock * 6 + k * 2.1; px(Math.cos(a) * 9 - 1, -42 + Math.sin(a) * 3, 2, 2, '#ffd23f'); }
  FLASH = false; ctx.restore();
}
// ---------------- the loop
function updStage9(dt) {
  if (STAGE !== 9 || G.mode !== 'play') return;
  const p = G.player; S9.t += dt;
  updCats9(dt); updGas9(dt);
  if (S9.arena === 'idle' && p.x > (S9.gate + 2) * TS && !p.dead) {
    S9.arena = 'fight'; for (let ty = 0; ty <= 9; ty++) setTile(S9.gate - 2, ty, T.S);
    audio.play('clang'); shake(0.3); G.cam.lock = { x0: (S9.gate - 2) * TS, x1: (S9.door + 2) * TS };
    later(0.8, spawnGasKing);
  }
  // falling into the sea
  if (!p.dead && p.y > 31 * TS && S9SEA.some(([a, b]) => p.x + p.w / 2 > a * TS && p.x + p.w / 2 < (b + 1) * TS)) { hurtPlayer(99, p.x, true); popup(p.x, 30 * TS, 'SPLASH!', '#9ae8ff', true); for (let i = 0; i < 16; i++) part('spark', p.x + 5, 31 * TS, rnd(-120, 120), rnd(-300, -100), 0.6, 2, '#bfefff'); }
}
// ---------------- skin + backdrops
function skin9(g, t, tx, ty, x, y, i) {
  const z = s9zone(tx), top = tileAt(tx, ty - 1) === T.E || tileAt(tx, ty - 1) === T.P;
  if (t === T.G || t === T.H) {
    const deep = ty > s9surface(tx) + 3;
    const base = z === 'cape' ? (deep ? '#7a5a3a' : '#b8884a') : z === 'xmd' ? (deep ? '#5a4632' : '#6a5a4a') : (deep ? '#5a3e26' : '#7a5232');
    g.fillStyle = base; g.fillRect(x, y, TS, TS);
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x + ((tx * 7 + ty * 3) % 11), y + ((tx * 5 + ty * 11) % 12), 3, 2); g.fillRect(x + ((tx * 3 + ty * 7) % 13), y + ((tx + ty * 5) % 13), 2, 2);
    if (z === 'cape') { g.fillStyle = 'rgba(255,230,180,0.2)'; g.fillRect(x + ((tx * 5) % 12), y + 6, 4, 1); }
    if (top) {
      if (z === 'xmd') { g.fillStyle = '#3a3a42'; g.fillRect(x, y, TS, 4); g.fillStyle = '#5a5a64'; g.fillRect(x, y, TS, 1); }
      else if (z === 'cape') { g.fillStyle = '#d8a860'; g.fillRect(x, y, TS, 3); g.fillStyle = 'rgba(80,50,20,0.35)'; g.fillRect(x + (tx % 4) * 4, y + 1, 2, 2); }
      else { g.fillStyle = '#3a8a3a'; g.fillRect(x, y, TS, 4); g.fillStyle = '#5ab048'; g.fillRect(x, y, TS, 1.5); g.fillStyle = '#2a6a2a'; g.fillRect(x + (tx * 3) % 14, y + 3, 2, 2); }
    }
    if (thp[i] < HPS[t]) { g.fillStyle = 'rgba(10,6,0,0.6)'; g.fillRect(x + 3, y + 4, 6, 1); g.fillRect(x + 8, y + 5, 1, 6); }
    return true;
  }
  if (t === T.B) {
    if (z === 'xmd') { g.fillStyle = '#9a3a2a'; g.fillRect(x, y, TS, TS); g.fillStyle = '#7a2a1a'; for (let r = 0; r < 4; r++) g.fillRect(x, y + r * 4 + 3, TS, 1); g.fillRect(x + ((ty & 1) ? 4 : 12), y, 1, TS); if ((tx + ty) % 5 === 0) { g.fillStyle = ['#ff4ab8', '#4ae8ff', '#ffd23f'][tx % 3]; g.fillRect(x + 3, y + 4, 10, 4); } return true; }
    if (z === 'rail') { g.fillStyle = '#6a3a22'; g.fillRect(x, y, TS, TS); g.fillStyle = '#8a5232'; g.fillRect(x + 2, y, 3, TS); g.fillRect(x + 10, y, 2, TS); return true; }   // cypress trunk
    g.fillStyle = '#8a7a6a'; g.fillRect(x, y, TS, TS); g.fillStyle = '#6a6a72'; g.fillRect(x, y, TS, 3); g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(x + 7, y + 3, 1, 13); return true;   // tin-roofed walls
  }
  if (t === T.P) { if (z === 'rail' || z === 'cape') { g.fillStyle = '#6a4a2a'; g.fillRect(x, y, TS, 4); g.fillStyle = '#8a6a3a'; g.fillRect(x, y, TS, 1); g.fillStyle = '#4a3218'; g.fillRect(x + 7, y + 4, 2, 6); return true; } g.fillStyle = '#5a5a62'; g.fillRect(x, y, TS, 3); g.fillStyle = '#8a8a92'; g.fillRect(x, y, TS, 1); return true; }
  return false;
}
function drawStage9BG(cam) {
  const hor = VH + 30 - (cam.y - 20 * TS) * 0.05;
  paintZones(cam, [[0, 's9xmd', '#0a0a18'], [S9.cats, 's9cats', '#8a9aa0'], [S9.cape, 's9cape', '#e89a6a'], [S9.rail, 's9rail', '#e8c890']], { hor, scale: 1.08 });
}
function drawStage9Mid(cam) {
  const L = cam.x - 40, R = cam.x + VW + 40;
  for (const [a, b] of S9SEA) {                                               // the sea in the gaps
    const x0 = a * TS, x1 = (b + 1) * TS; if (x1 < L || x0 > R) continue;
    ctx.fillStyle = '#1a5a8a'; ctx.fillRect(x0, 31 * TS, x1 - x0, LH * TS); ctx.fillStyle = '#3a8ac8'; for (let x = x0; x < x1; x += 6) ctx.fillRect(x, 31 * TS + Math.sin(G.clock * 3 + x) * 2, 4, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(x0 + ((G.clock * 30) % (x1 - x0)), 31 * TS - 1, 6, 1);
  }
  drawCats9(); drawGas9();
}
function drawStage9Front() {
  const z = s9zone(Math.floor((G.cam.x + VW / 2) / TS));
  ctx.fillStyle = { xmd: 'rgba(255,60,180,0.05)', cats: 'rgba(120,160,180,0.06)', cape: 'rgba(255,140,60,0.06)', rail: 'rgba(255,220,140,0.06)' }[z]; ctx.fillRect(0, 0, VW, VH);
  if (z === 'cats') { ctx.fillStyle = 'rgba(200,220,255,0.25)'; for (let i = 0; i < 30; i++) { const x = (i * 67 + G.clock * 40) % VW, y = (i * 41 + G.clock * 260) % VH; ctx.fillRect(x, y, 1, 4); } }   // drizzle
}
