// =====================================================================
// v27: FIVE NEW HEROES (parody names only — see docs/LEGAL_QUESTIONS_FOR_COUNSEL.md)
//   furie    AUNTIE FURIE        gun-fu assassin in a black suit (female "gun-fu" parody)
//   bey      UNCLE THUNDER-BEY   slow, heavy, unbreakable: every second hit bounces off
//   gada     MACE-RAJA           the Indian mace (gada): big arcs, ground smash, thrown mace, whirlwind
//   silat    AGENT SILAT         pencak-silat flurries + a submachine gun (hold K)
//   hongbao  UNCLE HONG-BAO      the nimble fat uncle: kicks, bumps, steamed buns, the rolling banquet
// Per-hero state lives in p.n5 (created lazily), so mkPlayer needs no changes.
// =====================================================================
const NEW5 = new Set(['furie', 'bey', 'gada', 'silat', 'hongbao']);
BOLLY.add('gada');                                   // the mace gets the Bollywood physics too (THAAP!, through the wall)
const n5 = p => p.n5 || (p.n5 = { atk: 0, a: 0, b: 0, c: 0, combo: 0, slide: 0, hit: new Set(), mag: 30, rel: 0, idle: 0, dive: 0, whirl: 0, whirlTick: 0, roll: 0, rollHit: new Set(), maceOut: 0, raid: 0, raidTick: 0, shrug: 0 });
function frontFoe(p, reach) {                          // nearest living enemy inside the reach box in front
  const cx = p.x + p.w / 2, box = { x: p.face > 0 ? cx : cx - reach, y: p.y - 4, w: reach, h: p.h + 4 };
  let best = null, bd = 1e9;
  for (const e of G.enemies) if (!e.dead && !e.para && overlap(box, e)) { const d = Math.abs(e.x + e.w / 2 - cx); if (d < bd) { bd = d; best = e; } }
  return best;
}
function aoeHit(p, r, dmg, o) {                        // everything within r of the hero
  o = o || {}; const cx = p.x + p.w / 2, cy = p.y + p.h / 2; let n = 0;
  for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - cx) < r && Math.abs(e.y + e.h / 2 - cy) < (o.ry || r * 0.7)) {
    damageEnemy(e, dmg, cx, !!o.launch);
    if (!e.dead) { if (o.stun) e.stun = Math.max(e.stun, o.stun); if (o.launch) { e.vx = (sign(e.x + e.w / 2 - cx) || p.face) * (o.kb || 240); e.vy = -(o.lift || 200); e.fling = o.fling || 0; } }
    n++;
  }
  const b = G.boss;
  if (b && !b.dead && b.dying <= 0 && b.state !== 'enter' && b.state !== 'roar' && Math.abs(b.x + b.w / 2 - cx) < r + b.w / 2 && Math.abs(b.y + b.h / 2 - cy) < r + 10) { damageBoss(o.bossDmg != null ? o.bossDmg : dmg, cx); n++; }
  return n;
}
function pBullet(p, dmg, spread, life, speed) {
  const tip = gunTip(p), v = speed || PC.bulletV;
  G.bullets.push({ x: tip.x, y: tip.y, vx: tip.dx * v + (tip.dy ? rnd(-spread, spread) : 0), vy: tip.dy * v + (tip.dx ? rnd(-spread, spread) : 0), life: life || 0.55, dmg });
  G.muzzles.push({ x: tip.x, y: tip.y, dx: tip.dx, dy: tip.dy, t: 0.05 }); G.stats.shots++;
  light(tip.x, tip.y, 22, 0.05, '255,220,140'); audio.play('shot');
}
function slamFx(p, big) { shake(big ? 0.5 : 0.25); hitstop(big ? 0.08 : 0.04); audio.play('slam'); dust(p.x + p.w / 2, p.y + p.h, big ? 14 : 8, big ? 30 : 16); }

// ---------------------------------------------------------------- AUNTIE FURIE
function updFurie(p, dt, ip) {
  const s = n5(p); p.fireCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt;
  if (s.slide > 0) {                                   // K: the tactical slide-throw — disarms whoever is in the way
    s.slide -= dt; p.vx = p.face * 360; p.inv = Math.max(p.inv, 0.06); p.swingT = 0.1; p.swingK = 'kick';
    for (const e of G.enemies) if (!e.dead && !e.para && !s.hit.has(e) && overlap({ x: p.x - 4, y: p.y, w: p.w + 8, h: p.h }, e)) {
      s.hit.add(e); damageEnemy(e, 3.2, p.x, true); if (!e.dead) { e.vx = p.face * 300; e.vy = -220; e.stun = 0.8; }
      popup(e.x + 4, e.y - 6, 'DISARMED', '#ff9ad0'); addUlt(p, 6); audio.play('punch'); hitstop(0.04);
    }
    const b = G.boss; if (b && !b.dead && b.dying <= 0 && !s.hit.has(b) && overlap(p, b)) { s.hit.add(b); damageBoss(4, p.x); s.slide = 0; p.vx = -p.face * 160; }
    if (Math.random() < dt * 40) dust(p.x + p.w / 2 - p.face * 6, p.y + p.h, 1, 3);
  }
  p.driveT = s.slide > 0 ? 1 : 0;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.slide > 0) return;
  if (ip.bomb && s.a <= 0) { s.a = 1.6; s.slide = 0.22; s.hit = new Set(); p.inv = Math.max(p.inv, 0.4); audio.play('whoosh'); popup(p.x + 5, p.y - 14, 'SLIDE!', '#ff9ad0'); return; }
  if ((held('shoot') || ip.shoot) && p.fireCd <= 0) {
    const foe = frontFoe(p, 24);
    if (foe && !held('down')) {                        // point blank: gun-fu — elbow, shoot, shove
      p.fireCd = 0.2; p.shootT = 0.1; p.swingT = 0.1; p.swingK = 'elbow';
      damageEnemy(foe, 2.6, p.x, false); if (!foe.dead) { foe.vx = p.face * 150; foe.stun = Math.max(foe.stun, 0.25); }
      const tip = gunTip(p); G.muzzles.push({ x: tip.x, y: tip.y, dx: p.face, dy: 0, t: 0.05 }); sparks(foe.x + foe.w / 2, foe.y + 8, 4, p.face, '#fff2b0');
      audio.play('shot'); hitstop(0.03); G.stats.shots++; G.stats.melee++; addUlt(p, 4);
      if (Math.random() < 0.25) popup(foe.x + 4, foe.y - 8, 'GUN-FU', '#ff9ad0');
    } else if (held('down') && s.b <= 0) {             // S+J: the single, careful headshot
      s.b = 0.9; p.fireCd = 0.35; p.shootT = 0.12; pBullet(p, 4.5, 0, 0.8, 860); popup(p.x + 5, p.y - 16, 'HEADSHOT', '#ffffff');
    } else if (!held('down')) {
      p.fireCd = 0.15; p.shootT = 0.08; p.hand = p.hand ? 0 : 1; pBullet(p, 1.5, 4);
    }
  }
}
function drawFurie(p) {
  const SK = '#efc4a0', SU = '#16161e', SU2 = '#2c2c3a', SH = '#f4f4f4', HR = '#0c0a0e', GUN = '#2a2a32';
  drawFighterBase(p, {
    SK, TOP: SU, TOP2: SU2, PNT: SU, SHOE: '#050505', SLEEVE: SU,
    body() { px(-4, -17, 8, 10, SU); px(-4, -17, 1, 10, SU2); px(-1, -17, 2, 7, SH); px(0, -16, 1, 6, '#c01838'); px(-3, -9, 6, 2, SU2); px(-4, -7, 8, 2, SU); },
    head() {
      px(-3, -23, 6, 6, SK); px(-4, -25, 8, 3, HR); px(-4, -24, 2, 7, HR); px(2, -24, 1, 2, HR);
      const sw = Math.round(Math.sin(G.clock * 8 + p.vx * 0.01) * 1.5 + Math.min(3, Math.abs(p.vx) / 70));
      px(-5 - sw, -22, 2, 2, HR); px(-6 - sw, -20, 2, 6, HR);                                       // ponytail
      px(1, -21, 1, 1, '#000'); px(1, -19, 2, 1, '#b02848');
    },
    arms() {
      if (p.shootT > 0 || (p.swingT > 0 && p.swingK === 'elbow')) { px(1, -15, 6, 2, SU); px(6, -16, 3, 3, SK); px(8, -16, 8, 2, GUN); px(8, -14, 2, 3, GUN); }
      else { px(-5, -16, 2, 6, SU); px(2, -14, 5, 2, SU); px(6, -14, 2, 2, SK); px(7, -16, 6, 2, GUN); px(7, -14, 2, 2, GUN); }   // low-ready
    }
  });
}

// ---------------------------------------------------------------- UNCLE THUNDER-BEY
function updBey(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt;
  if (s.dive > 0 && p.onGround) {                      // landed from the dive: a shockwave
    s.dive = 0; slamFx(p, true); const n = aoeHit(p, 38, 4, { launch: true, kb: 200, lift: 160, stun: 0.8 }); if (n) addUlt(p, 6 + n * 2);
    popup(p.x + 5, p.y - 12, 'THUNDER!', '#e8a030', true);
  }
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.dive > 0) { s.dive -= dt; p.swingT = 0.1; p.swingK = 'bigkick'; p.vx = p.face * 170; }
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (!p.onGround && s.dive <= 0) {                  // air J: the Anatolian dive kick
      s.dive = 0.8; p.vy = 520; p.atkCd = 0.4; p.swingT = 0.4; p.swingK = 'bigkick'; audio.play('whoosh');
    } else if (p.onGround && held('down') && s.b <= 0) {   // S+J: the stomp
      s.b = 1.1; p.atkCd = 0.5; p.swingT = 0.25; p.swingK = 'bigkick'; slamFx(p, false);
      const n = aoeHit(p, 34, 3, { stun: 1.0 }); if (n) addUlt(p, 5 + n * 2); popup(p.x + 5, p.y - 14, 'STOMP!', '#e8a030');
    } else if (p.onGround) {                           // J: slow, heavy fists
      p.combo = ((p.combo || 0) + 1) % 2; p.atkCd = p.combo ? 0.34 : 0.52; p.swingT = 0.2; p.swingK = 'punch';
      const big = !p.combo;
      const hit = meleeSwing(p, { dmg: big ? 5 : 3.2, reach: big ? 28 : 22, y0: -22, y1: -4, launch: big, tile: 2 });
      if (hit) { addUlt(p, big ? 8 : 5); if (big) { shake(0.2); hitstop(0.06); } }
    }
  }
  if (ip.bomb && s.a <= 0 && p.onGround) {             // K: the curved sword — wide, reflects bullets
    s.a = 0.8; p.atkCd = 0.35; p.swingT = 0.25; p.swingK = 'slash';
    const hit = meleeSwing(p, { dmg: 4.5, reach: 36, y0: -26, y1: 0, launch: true, tile: 2 });
    reflectBullets(p, 34, 1, 3); if (hit) addUlt(p, 7);
  }
}
function drawBey(p) {
  const SK = '#d29a6a', SH = '#e8dcc0', VEST = '#8a2a1a', VEST2 = '#5a1a10', TR = '#2a2220', HR = '#1a1210', MS = '#0a0808', GOLD = '#c89a30';
  drawFighterBase(p, {
    SK, TOP: SH, TOP2: VEST2, PNT: TR, SHOE: '#1a1210', SLEEVE: SK,
    body() { px(-5, -17, 10, 11, SH); px(-5, -17, 3, 11, VEST); px(2, -17, 3, 11, VEST); px(-5, -17, 1, 11, VEST2); px(-5, -8, 10, 2, GOLD); px(-1, -8, 2, 2, '#fff2a0'); px(-5, -6, 10, 2, TR); },
    head() { px(-3, -23, 6, 6, SK); px(-4, -25, 8, 3, HR); px(-4, -24, 1, 5, HR); px(0, -19, 5, 2, MS); px(-1, -18, 1, 3, MS); px(0, -22, 3, 1, MS); px(1, -21, 1, 1, '#000'); },
    arms() {
      if (p.swingT > 0 && p.swingK === 'slash') { px(1, -17, 5, 3, SK); px(5, -19, 3, 4, '#c89a30'); px(7, -19, 22, 2, '#dfe3ee'); px(26, -20, 3, 2, '#dfe3ee'); px(28, -21, 2, 2, '#ffffff'); }
      else { px(-7, -17, 3, 6, SK); px(4, -17, 3, 6, SK); px(4, -12, 3, 3, SK); px(-7, -12, 3, 3, SK); }   // arms like fence posts
    }
  });
}

// ---------------------------------------------------------------- MACE-RAJA
function updGada(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt; s.maceOut -= dt;
  if (s.whirl > 0) {                                   // L: the whirlwind — a spinning mace, he steers
    s.whirl -= dt; s.whirlTick -= dt; p.inv = Math.max(p.inv, 0.1); p.swingT = 0.1; p.swingK = 'slash'; p.face = Math.sin(s.whirl * 18) > 0 ? 1 : -1;
    if (s.whirlTick <= 0) { s.whirlTick = 0.12; const n = aoeHit(p, 36, 2.2, { launch: true, kb: 260, lift: 180, fling: 0.4 }); if (n) { audio.play('punch'); sparks(p.x + 5, p.y + 8, 4, p.face, '#ffd23f'); } }
    const L = held('left'), R = held('right'); p.vx = ((R ? 1 : 0) - (L ? 1 : 0)) * 130;
    p.driveT = 1;
  } else p.driveT = 0;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.whirl > 0) return;
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (p.onGround && held('down') && s.b <= 0) {      // S+J: the ground smash
      s.b = 1.4; p.atkCd = 0.6; p.swingT = 0.3; p.swingK = 'slash';
      later(0.12, () => { if (G.player === p && !p.dead) { slamFx(p, true); const n = aoeHit(p, 40, 4, { launch: true, kb: 240, lift: 240, stun: 0.6, fling: 0.5 }); if (n) addUlt(p, 6 + n * 2); for (let ty = Math.floor(p.y / TS); ty <= Math.floor((p.y + p.h) / TS); ty++) for (let tx = Math.floor((p.x - 20) / TS); tx <= Math.floor((p.x + p.w + 20) / TS); tx++) if (DESTRUCT[tileAt(tx, ty)]) damageTile(tx, ty, 3); } });
      popup(p.x + 5, p.y - 16, 'GADA SMASH!', '#ff9a3a', true);
    } else {                                           // J: wide mace arcs, the third one is THE swing
      p.combo = ((p.combo || 0) + 1) % 3; const big = p.combo === 2, weak = s.maceOut > 0;
      p.atkCd = big ? 0.5 : 0.36; p.swingT = 0.2; p.swingK = weak ? 'punch' : 'slash';
      const hit = meleeSwing(p, weak ? { dmg: 1.2, reach: 16, y0: -20, y1: -4 } : { dmg: big ? 5.5 : 3.2, reach: big ? 38 : 32, y0: -26, y1: 0, launch: big, tile: big ? 3 : 2 });
      if (hit) addUlt(p, big ? 8 : 4);
    }
  }
  if (ip.bomb && s.a <= 0) {                           // K: throw the mace — it comes back
    s.a = 1.8; s.maceOut = 1.5; p.swingT = 0.2; p.swingK = 'punch'; audio.play('whoosh');
    proj({ kind: 'mace', x: p.x + p.w / 2 + p.face * 6, y: p.y + 8, vx: p.face * 400, vy: -10, dmg: 3, r: 7, life: 2.6, pierce: true, boomerang: true, spin: 22 * p.face });
    popup(p.x + 5, p.y - 14, 'MACE!', '#ffd23f');
  }
}
function drawGada(p) {
  const s = n5(p), SK = '#c88a58', KU = '#ebe3bd', KU2 = '#c8c098', VEST = '#1a4a2a', TUR = '#f2f2ea', BAND = '#c02020', MS = '#0a0808';
  drawFighterBase(p, {
    SK, TOP: KU, TOP2: KU2, PNT: KU2, SHOE: '#4a2a1a', SLEEVE: KU,
    body() {
      px(-4, -17, 8, 12, KU); px(-4, -17, 1, 12, KU2); px(-4, -17, 3, 9, VEST); px(1, -17, 3, 9, VEST); px(-5, -8, 10, 3, KU);
      if (s.maceOut <= 0 && !(p.swingT > 0 && p.swingK === 'slash') && !(s.whirl > 0)) { px(3, -29, 2, 14, '#6a4a2a'); px(0, -35, 8, 7, '#d8a830'); px(1, -36, 2, 2, '#ffe28a'); px(5, -36, 2, 2, '#ffe28a'); px(-1, -33, 2, 2, '#b88a20'); px(7, -33, 2, 2, '#b88a20'); }   // mace on the shoulder
    },
    head() { px(-3, -23, 6, 6, SK); px(-4, -27, 8, 5, TUR); px(-4, -24, 8, 1, BAND); px(-5, -26, 2, 4, TUR); px(0, -19, 5, 2, MS); px(4, -19, 1, 3, MS); px(-1, -19, 1, 3, MS); px(1, -21, 1, 1, '#000'); px(0, -22, 3, 1, MS); },
    arms() {
      const k = p.swingT > 0 ? p.swingK : '';
      if (k === 'slash') { px(1, -17, 6, 3, KU); px(6, -17, 3, 3, SK); px(8, -18, 2, 12, '#6a4a2a'); px(5, -30, 8, 8, '#d8a830'); px(6, -31, 2, 2, '#ffe28a'); px(10, -31, 2, 2, '#ffe28a'); px(13, -27, 2, 2, '#b88a20'); }
      else { px(-5, -16, 2, 6, KU); px(3, -16, 2, 4, KU); px(3, -13, 3, 2, SK); px(-5, -10, 2, 2, SK); }
    }
  });
}

// ---------------------------------------------------------------- AGENT SILAT
function updSilat(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; p.fireCd -= dt; s.a -= dt;
  if (s.raid > 0) {                                    // L: the raid — a full-screen spray, then a spinning finisher
    s.raid -= dt; s.raidTick -= dt; p.inv = Math.max(p.inv, 0.1); p.vx *= 0.9; p.shootT = 0.06;
    if (s.raidTick <= 0) {
      s.raidTick = 0.04; const foes = visibleFoes(p, false), cx = p.x + p.w / 2, cy = p.y + 8;
      for (let k = 0; k < 2; k++) {
        const f = foes.length ? foes[(Math.random() * Math.min(foes.length, 6)) | 0] : null;
        const a = f ? Math.atan2(f.y + f.h * 0.45 - cy, f.x + f.w / 2 - cx) + rnd(-0.06, 0.06) : (p.face > 0 ? 0 : Math.PI) + rnd(-0.2, 0.2);
        G.bullets.push({ x: cx + p.face * 6, y: cy, vx: Math.cos(a) * 700, vy: Math.sin(a) * 700, life: 0.6, dmg: 1.7 }); G.stats.shots++;
      }
      audio.play('shot'); light(cx, cy, 30, 0.05, '255,220,140');
    }
    if (s.raid <= 0) { p.swingT = 0.3; p.swingK = 'bigkick'; slamFx(p, true); aoeHit(p, 42, 5, { launch: true, kb: 280, lift: 220, fling: 0.4 }); }
  }
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.raid > 0) return;
  let firing = false;
  if (held('bomb') && s.rel <= 0 && p.fireCd <= 0) {   // K (hold): the submachine gun
    if (s.mag > 0) {
      firing = true; s.mag--; s.idle = 0; p.fireCd = 0.07; p.shootT = 0.09; pBullet(p, 1.0, 10, 0.5, 700);
      part('shell', p.x + p.w / 2, p.y + 6, -p.face * rnd(40, 90), rnd(-160, -90), rnd(0.8, 1.2), 1, '#e8c040', { g: 900, vr: rnd(-20, 20) });
      if (s.mag <= 0) { s.rel = 1.1; popup(p.x + 5, p.y - 14, 'RELOAD', '#ffb070'); }
    }
  }
  if (s.rel > 0) { s.rel -= dt; if (s.rel <= 0) s.mag = 30; }
  else if (!firing && !held('bomb')) { s.idle += dt; if (s.idle > 0.6 && s.mag < 30) s.mag = Math.min(30, s.mag + dt * 36); }
  if (!held('bomb') && (held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (held('down')) {                                // S+J: low sweep
      p.atkCd = 0.5; p.swingT = 0.2; p.swingK = 'kick'; const hit = meleeSwing(p, { dmg: 1.8, reach: 24, y0: -8, y1: 0, launch: false });
      for (const e of G.enemies) if (!e.dead && Math.abs(e.x - p.x) < 28 && Math.abs(e.y + e.h - p.y - p.h) < 6) e.stun = Math.max(e.stun, 0.9);
      if (hit) addUlt(p, 5);
    } else {                                           // J: elbow - knee - spinning back-kick
      p.combo = ((p.combo || 0) + 1) % 3; p.atkCd = p.combo === 2 ? 0.3 : 0.13; p.swingT = 0.12; p.swingK = ['elbow', 'kick', 'bigkick'][p.combo];
      const hit = meleeSwing(p, { dmg: p.combo === 2 ? 3.2 : 1.8, reach: p.combo === 2 ? 26 : 20, y0: -22, y1: -4, launch: p.combo === 2 });
      if (hit) addUlt(p, 4);
    }
  }
}
function drawSilat(p) {
  const SK = '#c88a60', VEST = '#2c2c36', VEST2 = '#1c1c24', TEE = '#d8d8d0', HB = '#c02020', HR = '#120c0a', SASH = '#d89a30', GUN = '#202026';
  drawFighterBase(p, {
    SK, TOP: VEST, TOP2: VEST2, PNT: '#1c1c24', SHOE: '#0a0a0a', SLEEVE: SK,
    body() { px(-4, -17, 8, 10, TEE); px(-4, -17, 2, 10, VEST); px(2, -17, 2, 10, VEST); px(-4, -17, 1, 10, VEST2); px(-4, -8, 8, 2, SASH); px(-4, -6, 8, 1, '#a87820'); px(-5, -19, 10, 2, VEST); px(-1, -14, 3, 6, GUN); },
    head() { px(-3, -23, 6, 6, SK); px(-4, -26, 7, 3, HR); px(-4, -25, 3, 3, HR); px(-4, -23, 8, 1, HB); px(-5, -23, 2, 3, HB); px(1, -21, 1, 1, '#000'); px(1, -19, 2, 1, '#7a3a2a'); },
    arms() {
      if (p.shootT > 0) { px(1, -15, 6, 2, SK); px(6, -16, 2, 3, SK); px(7, -16, 11, 3, GUN); px(10, -13, 2, 4, GUN); px(15, -17, 2, 1, '#666'); }
      else { px(-5, -16, 2, 5, SK); px(3, -18, 2, 5, SK); px(3, -19, 3, 2, SK); px(-5, -11, 3, 2, SK); }   // silat guard: one hand high, one low
    }
  });
}

// ---------------------------------------------------------------- UNCLE HONG-BAO
function updHongbao(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt;
  if (s.roll > 0) {                                    // L: the all-you-can-eat roll
    s.roll -= dt; p.vx = p.face * 330; p.inv = Math.max(p.inv, 0.1); p.swingT = 0.1; p.swingK = 'fly';
    for (const e of G.enemies) if (!e.dead && !e.para && !s.rollHit.has(e) && overlap({ x: p.x - 8, y: p.y - 4, w: p.w + 16, h: p.h + 4 }, e)) {
      s.rollHit.add(e); damageEnemy(e, 4, p.x, true); if (!e.dead) { e.vx = p.face * 420; e.vy = -280; e.fling = 0.5; e.stun = 0.8; } audio.play('punch'); hitstop(0.04); popup(e.x + 4, e.y - 8, 'BOING!', '#ffd23f');
    }
    const b = G.boss; if (b && !b.dead && b.dying <= 0 && !s.rollHit.has(b) && overlap(p, b)) { s.rollHit.add(b); damageBoss(7, p.x); }
    if (ip.jump && p.onGround) { p.vy = -520; p.onGround = false; }
    if (p.hitWall) s.roll = 0;
    if (Math.random() < dt * 25) dust(p.x + p.w / 2 - p.face * 6, p.y + p.h, 1, 4);
  }
  p.driveT = s.roll > 0 ? 1 : 0;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.roll > 0) return;
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (!p.onGround) {                                 // air J: the flying drop-kick
      p.atkCd = 0.28; p.swingT = 0.22; p.swingK = 'fly'; if (p.vy < 120) p.vy += 90;
      const hit = meleeSwing(p, { dmg: 2.4, reach: 22, y0: -16, y1: 2, launch: false }); if (hit) { addUlt(p, 5); p.vy = -260; }
    } else if (held('down') && s.b <= 0) {             // S+J: the belly bump — a shove with a whole uncle behind it
      s.b = 0.7; p.atkCd = 0.4; p.swingT = 0.2; p.swingK = 'elbow'; const hit = meleeSwing(p, { dmg: 3.2, reach: 18, y0: -18, y1: -2, launch: true, tile: 2 });
      if (hit) { addUlt(p, 6); popup(p.x + 5, p.y - 14, 'BUMP!', '#ffd23f'); }
    } else {                                           // J: kick, kick, spinning back-kick
      p.combo = ((p.combo || 0) + 1) % 3; p.atkCd = p.combo === 2 ? 0.26 : 0.14; p.swingT = 0.12; p.swingK = p.combo === 2 ? 'bigkick' : 'kick';
      const hit = meleeSwing(p, { dmg: p.combo === 2 ? 3.4 : 1.9, reach: p.combo === 2 ? 28 : 24, y0: -18, y1: -2, launch: p.combo === 2 });
      if (hit) addUlt(p, 4);
    }
  }
  if (ip.bomb && s.a <= 0) {                           // K: a steamed bun, lobbed
    s.a = 0.55; p.swingT = 0.15; p.swingK = 'punch'; audio.play('whoosh');
    proj({ kind: 'bun', x: p.x + p.w / 2 + p.face * 6, y: p.y + 6, vx: p.face * 320 + p.vx * 0.3, vy: -100, g: 520, dmg: 2.6, r: 5, life: 1.4, stunHit: 0.5 });
  }
}
function drawHongbao(p) {
  const SK = '#e8b080', RED = '#c82828', RED2 = '#8a1818', GOLD = '#e8c040', WH = '#f4ecd8';
  drawFighterBase(p, {
    SK, TOP: RED, TOP2: RED2, PNT: WH, SHOE: '#111111', SLEEVE: RED,
    body() {
      px(-6, -17, 12, 10, RED); px(-7, -13, 14, 6, RED); px(-6, -17, 1, 10, RED2); px(-7, -13, 1, 6, RED2); px(6, -13, 1, 6, '#e05050');
      px(-1, -17, 2, 10, GOLD); px(-1, -15, 2, 1, RED2); px(-1, -12, 2, 1, RED2); px(-7, -8, 14, 2, '#222');
    },
    head() { px(-4, -24, 8, 7, SK); px(-5, -22, 1, 4, SK); px(4, -22, 1, 4, SK); px(-1, -27, 3, 3, '#111'); px(1, -21, 1, 1, '#000'); px(-2, -21, 1, 1, '#000'); px(-1, -19, 4, 1, '#8a2a1a'); px(2, -20, 2, 1, '#d89070'); },
    arms() {
      if (p.swingT > 0 && (p.swingK === 'punch' || p.swingK === 'elbow')) { px(1, -16, 7, 3, RED); px(7, -16, 3, 3, SK); }
      else { px(-8, -16, 3, 6, RED); px(5, -16, 3, 5, RED); px(5, -11, 3, 3, SK); px(-8, -10, 3, 2, SK); }
    }
  });
}

// ---------------------------------------------------------------- ULTIMATES
function ult5(p) {
  const s = n5(p);
  if (p.ch === 'furie') {                              // NO MERCY: a curved bullet for every face on screen
    G.banner = { t: 0, title: 'NO MERCY', sub: 'SHE DID NOT COME FOR A CONVERSATION' }; audio.play('roar'); p.inv = 2; p.swingT = 0.9; p.swingK = 'elbow'; p.shootT = 0.9;
    G.timeScale = 0.4; G.slowT = 0.5;
    const foes = visibleFoes(p, false).slice(0, 9);
    foes.forEach((f, i) => later(0.1 + i * 0.09, () => { if (G.player !== p || p.dead) return; G.bullets.push({ x: p.x + p.w / 2 + p.face * 8, y: p.y + 8, vx: sign(f.x - p.x || p.face) * 560, vy: 0, life: 1.2, dmg: f === G.boss ? 10 : 7, kind: 'curve', curve: 16, tgt: f }); audio.play('shot'); light(p.x + 5, p.y + 8, 30, 0.05, '255,220,140'); }));
  } else if (p.ch === 'bey') {                         // SAVIOR OF THE WORLD: the ground itself answers
    G.timeScale = 0.3; G.slowT = 0.7; G.banner = { t: 0, title: 'SAVIOR OF THE WORLD', sub: 'HE IS NOT HURRYING. THE WORLD IS.' }; audio.play('roar'); p.inv = 1.8; p.swingT = 0.8; p.swingK = 'bigkick'; p.hp = Math.min(PC.hp, p.hp + 1);
    later(0.5, () => {
      if (G.player !== p) return; shake(0.8); hitstop(0.1); audio.play('slam');
      for (const e of G.enemies) if (!e.dead && !e.para && onScreen(e, 0)) { damageEnemy(e, 8, p.x, true); if (!e.dead) { e.vy = -260; e.stun = 1.2; } }
      const b = G.boss; if (b && !b.dead && b.dying <= 0 && onScreen(b, 0)) damageBoss(18, p.x);
      for (let i = 0; i < 14; i++) part('smoke', G.cam.x + rnd(0, VW), p.y + p.h, rnd(-30, 30), rnd(-120, -40), rnd(0.6, 1.2), 3, '#b89a6a', { grow: 6, a: 0.7 });
    });
  } else if (p.ch === 'gada') {                        // THE WHIRLWIND ROAR
    s.whirl = 2.2; s.whirlTick = 0; G.banner = { t: 0, title: 'GADA WHIRLWIND', sub: 'THE MACE HAS NOT FINISHED' }; audio.play('roar'); p.inv = 2.4;
  } else if (p.ch === 'silat') {                       // THE RAID
    s.raid = 1.3; s.raidTick = 0; s.mag = 30; s.rel = 0; G.banner = { t: 0, title: 'THE RAID', sub: 'FIFTEEN FLOORS. ONE CORRIDOR.' }; audio.play('roar'); p.inv = 1.8;
  } else if (p.ch === 'hongbao') {                     // ALL-YOU-CAN-EAT: heal one, then roll through the buffet
    G.banner = { t: 0, title: 'ALL-YOU-CAN-EAT', sub: 'FIRST HE EATS. THEN HE ROLLS.' }; audio.play('roar'); p.hp = Math.min(PC.hp, p.hp + 1); p.inv = 2;
    popup(p.x + 5, p.y - 16, '+1 LUNCH', '#7dff8a', true); s.roll = 1.6; s.rollHit = new Set();
  }
}
const DRAW5 = { furie: drawFurie, bey: drawBey, gada: drawGada, silat: drawSilat, hongbao: drawHongbao };
const HUD5 = {
  furie: p => clamp(1 - n5(p).a / 1.6, 0, 1), bey: p => clamp(1 - n5(p).a / 0.8, 0, 1), gada: p => clamp(1 - n5(p).a / 1.8, 0, 1),
  silat: p => n5(p).rel > 0 ? 1 - n5(p).rel / 1.1 : n5(p).mag / 30, hongbao: p => clamp(1 - n5(p).a / 0.55, 0, 1)
};
