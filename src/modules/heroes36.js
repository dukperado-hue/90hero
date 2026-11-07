// =====================================================================
// v36: TWO NEW HEROES (parody names, invented looks — no actor likeness)
//   krabi     UNCLE LASER-KRABI   (TH)  a Thai swordsman whose krabi blade is a cheap glowing laser. Tribute to Thai zombie-comedy cinema.
//             J laser slash x3 (bats bullets back) · S+J rising cut · AIR J plunge · K throw the blade (it boomerangs) · HOLD J = charge (Rockman, see charge36.js)
//             L LASER OVERDRIVE: the blade grows 5x for a few seconds. Meme: the battery sometimes flickers ("BATTERY LOW!").
//   zhanzhao  UNCLE ROYAL-CAT     (CN)  the red-robed imperial swordsman of the old court-case novels (public-domain folk character).
//             J sword thrust-slash-rise · S+J low sweep · AIR J swallow dive · K pulls a bronze HOUND-HEAD GUILLOTINE out of his sleeve and drops it
//             L THREE GUILLOTINES: dragon, tiger and hound heads fall on everyone on screen ("開鍘!").
// State lives in p.h36.
// =====================================================================
const H36 = {};
const h36 = p => p.h36 || (p.h36 = { a: 0, b: 0, c: 0, combo: 0, od: 0, odTick: 0, flick: 0, blade: null, guil: [], ultQ: [] });
function blade36Hit(p, o) { KILL_CAUSE = 'blade'; const r = meleeSwing(p, o); KILL_CAUSE = null; return r; }

// ---------------------------------------------------------------- UNCLE LASER-KRABI
function updKrabi(p, dt, ip) {
  const s = h36(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt; s.flick -= dt;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  const od = s.od > 0; if (od) { s.od -= dt; if (s.od <= 0) { s.flick = 0.8; popup(p.x + 5, p.y - 18, 'BATTERY LOW!', '#ffd23f'); audio.play('tile'); } }
  if (s.blade) {                                                   // the thrown blade: out, then back to the hilt
    const B = s.blade; if (!G.projs || !G.projs.includes(B)) { s.blade = null; }
  }
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0 && s.flick <= 0 && !s.blade) {
    if (!p.onGround && held('down')) {                             // AIR S+J / AIR J while falling fast: the plunge
      p.atkCd = 0.35; p.swingT = 0.25; p.swingK = 'fly'; p.vy = 520;
      const hit = blade36Hit(p, { dmg: 3.0, reach: 18, y0: -10, y1: 10, launch: false, tile: 2 }); if (hit) { addUlt(p, 5); p.vy = -280; }
    } else if (held('down') && p.onGround && s.b <= 0) {           // S+J rising laser cut
      s.b = 0.6; p.atkCd = 0.32; p.swingT = 0.2; p.swingK = 'slash';
      const hit = blade36Hit(p, { dmg: od ? 6 : 3.2, reach: od ? 70 : 26, y0: -40, y1: 0, launch: true, tile: 2 });
      if (hit) { addUlt(p, 6); popup(p.x + 5, p.y - 16, 'RISING LASER!', '#5aff9a'); }
      for (const e of G.enemies) if (!e.dead && Math.abs(e.x - p.x) < (od ? 70 : 28) && Math.abs(e.y - p.y) < 30) { e.vy = -380; }
    } else {                                                       // J: slash, slash, spin
      s.combo = (s.combo + 1) % 3; const fin = s.combo === 2;
      p.atkCd = fin ? 0.26 : 0.15; p.swingT = 0.14; p.swingK = 'slash';
      const hit = blade36Hit(p, { dmg: (fin ? 3.2 : 1.9) * (od ? 1.6 : 1), reach: od ? 80 : (fin ? 30 : 26), y0: od ? -34 : -22, y1: 2, launch: fin, tile: od ? 2 : 1 });
      if (hit) addUlt(p, 4);
      audio.play('whoosh'); if (Math.random() < 0.025 && !od) { s.flick = 0.45; popup(p.x + 5, p.y - 18, '*BZZT* BATTERY LOW!', '#ffd23f'); }
    }
  }
  if (ip.bomb && s.a <= 0 && !s.blade && s.flick <= 0) {           // K: throw the laser blade — it pierces, then flies back
    s.a = 1.0; p.swingT = 0.15; p.swingK = 'slash'; audio.play('whoosh');
    proj({ kind: 'krabi', x: p.x + p.w / 2 + p.face * 8, y: p.y + 8, vx: p.face * 420, vy: 0, dmg: 3, r: 8, life: 1.6, pierce: true, boomerang: true, spin: 22 });
    s.blade = G.projs[G.projs.length - 1];
  }
  if (s.blade && s.blade.t > 0.4 && Math.abs(s.blade.x - (p.x + p.w / 2)) < 12 && Math.abs(s.blade.y - (p.y + 8)) < 16) { G.projs.splice(G.projs.indexOf(s.blade), 1); s.blade = null; s.a = Math.min(s.a, 0.25); audio.play('tile'); }
}
function ultKrabi(p) {
  const s = h36(p); s.od = 4.5; s.flick = 0; p.inv = 1.2;
  G.banner = { t: 0, title: 'LASER OVERDRIVE', sub: 'THE BLADE RUNS ON CHEAP BATTERIES. FOR NOW.' }; audio.play('roar'); shake(0.4);
  for (let i = 0; i < 20; i++) part('spark', p.x + p.w / 2, p.y + 8, rnd(-200, 200), rnd(-200, 60), 0.4, 2, '#5aff9a');
}
function drawKrabi(p) {
  const s = h36(p), SK = '#c88a5a', BLK = '#1e1e24', RED = '#c8302a', GOLD = '#e8c040';
  scaledAbout(p.x + p.w / 2, p.y + p.h, 1.45, () => drawFighterBase(p, {
    SK, TOP: BLK, TOP2: '#2e2e36', PNT: '#3a3040', SHOE: '#141010', SLEEVE: BLK,
    body() { px(-4, -17, 8, 9, BLK); px(-4, -17, 1, 9, '#34343c'); px(-5, -10, 10, 2, RED); px(3, -10, 2, 5, RED); px(-1, -16, 2, 2, GOLD); },
    head() { px(-3, -23, 6, 6, SK); px(-4, -25, 8, 3, '#141014'); px(-4, -22, 8, 1, RED); px(-5, -22, 2, 3, RED); px(1, -21, 1, 1, '#000'); px(1, -19, 2, 1, '#8a5a3a'); },
    arms() { px(-5, -16, 2, 5, BLK); px(1, -15, 4, 2, BLK); px(4, -15, 2, 2, SK); }
  }));
  drawKrabiBlade(p);
}
function drawKrabiBlade(p) {
  const s = h36(p), GOLD = '#e8c040';
  if (p.dead || s.blade) return;
  const len = s.od > 0 ? 70 : 20, on = s.flick <= 0 || Math.floor(G.clock * 30) % 3 === 0;
  const swing = p.swingT > 0, hx = p.x + p.w / 2 + p.face * 8, hy = p.y + p.h - 20;
  const ang = swing ? (-1.2 + (1 - p.swingT / 0.14) * 1.9) : (p.onGround ? -0.5 : -0.9);
  ctx.save(); ctx.translate(hx, hy); ctx.scale(p.face, 1); ctx.rotate(ang);
  ctx.fillStyle = '#8a8a90'; ctx.fillRect(-4, -1.5, 5, 3); ctx.fillStyle = GOLD; ctx.fillRect(0, -2.5, 1.5, 5);
  if (on) {
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.45; ctx.fillStyle = '#5aff9a'; ctx.fillRect(1, -3, len, 6);
    ctx.globalAlpha = 1; ctx.fillStyle = '#9affc0'; ctx.fillRect(1, -1.5, len, 3); ctx.fillStyle = '#ffffff'; ctx.fillRect(1, -0.6, len - 2, 1.2);
    ctx.beginPath(); ctx.fillStyle = '#9affc0'; ctx.moveTo(len + 1, -1.5); ctx.lineTo(len + 5, 0); ctx.lineTo(len + 1, 1.5); ctx.fill();   // the krabi tip curve
  }
  ctx.restore();
  if (swing && on) { ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = '#9affc0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(hx, hy, len * 0.9, p.face > 0 ? -1.3 : Math.PI - 0.6, p.face > 0 ? 0.6 : Math.PI + 1.3); ctx.stroke(); ctx.restore(); }
  if (on) light(hx + p.face * len / 2, hy - 6, s.od > 0 ? 60 : 26, 0.04, '120,255,170');
}
H36.krabi = { upd: updKrabi, ult: ultKrabi, draw: drawKrabi, hud: p => clamp(1 - h36(p).a / 1.0, 0, 1), hudName: 'BLADE' };

// ---------------------------------------------------------------- UNCLE ROYAL-CAT (the red imperial swordsman)
function dropGuillotine(x, y, head, big) {
  (G.guil36 = G.guil36 || []).push({ x, y, head, big, t: 0, done: false, hitSet: new Set() });
  audio.play('clang');
}
function updGuillotines(dt) {
  const L = G.guil36; if (!L || !L.length) return;
  for (const g of L) {
    g.t += dt;
    if (!g.done && g.t > 0.45) {                                   // the blade drops
      g.done = true; shake(g.big ? 0.4 : 0.25); hitstop(0.06); audio.play('slam');
      popup(g.x, g.y - 46, g.big ? '開鍘!' : '開鍘', '#ffd23f', true);
      const W = g.big ? 30 : 22;
      for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - g.x) < W && Math.abs(e.y + e.h - g.y) < 40) {
        const exec = e.hp <= (g.big ? 30 : 12) && e.type !== 'heavy';
        KILL_CAUSE = 'blade'; damageEnemy(e, exec ? 999 : (g.big ? 14 : 8), g.x, false); KILL_CAUSE = null;
        if (exec) { gore(e.x + e.w / 2, e.y + 6, 8, 1.2); }
      }
      const b = G.boss; if (b && !b.dead && b.dying <= 0 && b.state !== 'enter' && Math.abs(b.x + b.w / 2 - g.x) < W + b.w / 2 && Math.abs(b.y + b.h - g.y) < 60) damageBoss(g.big ? 16 : 10, g.x);
      for (let i = 0; i < 10; i++) part('spark', g.x + rnd(-W, W), g.y - 2, rnd(-120, 120), rnd(-160, -30), 0.3, 2, '#ffd23f');
    }
  }
  G.guil36 = L.filter(g => g.t < 1.3);
}
function drawGuillotines() {
  const L = G.guil36; if (!L) return;
  for (const g of L) {
    const k = g.big ? 1.4 : 1, a = g.t > 1.0 ? 1 - (g.t - 1.0) / 0.3 : Math.min(1, g.t * 6);
    const drop = g.t < 0.45 ? 0 : Math.min(1, (g.t - 0.45) / 0.06);
    ctx.save(); ctx.translate(Math.round(g.x), Math.round(g.y)); ctx.scale(k, k); ctx.globalAlpha = a;
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-16, -4, 32, 4);                         // the bench
    ctx.fillStyle = '#7a4a1a'; ctx.fillRect(-15, -40, 3, 36); ctx.fillRect(12, -40, 3, 36);   // posts
    ctx.fillStyle = '#b08a3a'; ctx.fillRect(-16, -44, 32, 5);                         // the beam
    const col = { dragon: '#e8c040', tiger: '#e88a2a', hound: '#c89a5a' }[g.head];
    ctx.fillStyle = col; ctx.fillRect(-7, -54, 14, 10); ctx.fillStyle = '#2a1a0a';       // the beast head on top
    if (g.head === 'dragon') { ctx.fillRect(-5, -52, 2, 2); ctx.fillRect(3, -52, 2, 2); ctx.fillStyle = col; ctx.fillRect(-10, -58, 3, 6); ctx.fillRect(7, -58, 3, 6); }
    else if (g.head === 'tiger') { ctx.fillRect(-5, -52, 2, 2); ctx.fillRect(3, -52, 2, 2); ctx.fillRect(-4, -48, 8, 1); ctx.fillStyle = col; ctx.fillRect(-8, -57, 3, 4); ctx.fillRect(5, -57, 3, 4); }
    else { ctx.fillRect(-5, -52, 2, 2); ctx.fillRect(3, -52, 2, 2); ctx.fillStyle = '#e8a080'; ctx.fillRect(-2, -47, 4, 2); ctx.fillStyle = col; ctx.fillRect(-9, -55, 3, 7); ctx.fillRect(6, -55, 3, 7); }
    const by = -38 + drop * 30;                                                         // the blade
    ctx.fillStyle = '#d8dce8'; ctx.beginPath(); ctx.moveTo(-12, by); ctx.lineTo(12, by); ctx.lineTo(12, by + 6); ctx.lineTo(-12, by + 9); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-12, by + 7, 24, 1);
    ctx.restore();
  }
}
function updZhan(p, dt, ip) {
  const s = h36(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt; s.c -= dt;
  if (s.dive > 0) { s.dive -= dt; p.vx = p.face * 360; p.vy = Math.max(p.vy, 260); blade36Hit(p, { dmg: 2.4, reach: 20, y0: -18, y1: 4, launch: true, quiet: s.dive % 0.1 > 0.05 }); if (p.onGround) s.dive = 0; }
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0 && !(s.dive > 0)) {
    if (!p.onGround && s.c <= 0) {                                  // AIR J: the swallow dive
      s.c = 0.9; s.dive = 0.32; p.atkCd = 0.3; p.swingT = 0.3; p.swingK = 'fly'; popup(p.x + 5, p.y - 16, 'SWALLOW DIVE!', '#ff5a4a'); audio.play('whoosh');
    } else if (held('down') && p.onGround) {                        // S+J low sweep
      p.atkCd = 0.3; p.swingT = 0.18; p.swingK = 'kick';
      const hit = blade36Hit(p, { dmg: 2.6, reach: 30, y0: -8, y1: 2, launch: true }); if (hit) { addUlt(p, 5); for (const e of G.enemies) if (!e.dead && Math.abs(e.x - p.x) < 32 && Math.abs(e.y + e.h - (p.y + p.h)) < 10) e.stun = Math.max(e.stun, 0.6); }
    } else {                                                        // J: thrust, slash, rising slash
      s.combo = (s.combo + 1) % 3; const k = s.combo;
      p.atkCd = k === 2 ? 0.24 : 0.13; p.swingT = 0.13; p.swingK = k === 0 ? 'thrust' : 'slash';
      const hit = blade36Hit(p, { dmg: k === 2 ? 3.0 : 2.0, reach: k === 0 ? 32 : 26, y0: k === 2 ? -32 : -20, y1: 0, launch: k === 2 });
      if (hit) addUlt(p, 4); audio.play('whoosh');
    }
  }
  if (ip.bomb && s.a <= 0 && p.onGround) {                          // K: the hound-head guillotine, pulled from his sleeve
    s.a = 2.4; p.swingT = 0.4; p.swingK = 'slash'; p.vx = 0;
    const gx = p.x + p.w / 2 + p.face * 26, gy = groundBelow(gx, p.y + 4);
    dropGuillotine(gx, gy, 'hound', false); popup(p.x + 5, p.y - 20, '"BRING THE HOUND-HEAD!"', '#ff5a4a');
    for (let i = 0; i < 6; i++) part('smoke', gx, gy - 20, rnd(-40, 40), rnd(-40, 0), 0.4, 3, '#e8e0d0', { grow: 5, a: 0.6 });
  }
}
function ultZhan(p) {
  G.banner = { t: 0, title: 'THREE GUILLOTINES', sub: 'DRAGON · TIGER · HOUND — THE COURT IS IN SESSION' }; audio.play('roar'); p.inv = 2;
  G.timeScale = 0.5; G.slowT = 0.6;
  const foes = visibleFoes(p, false).slice(0, 9), heads = ['dragon', 'tiger', 'hound'];
  if (!foes.length) foes.push({ x: p.x + p.face * 40, w: 0, y: p.y, h: p.h });
  foes.forEach((f, i) => later(0.15 + i * 0.12, () => { if (G.player !== p) return; const gx = f.x + f.w / 2; dropGuillotine(gx, groundBelow(gx, f.y + 2), heads[i % 3], true); }));
}
function drawZhan(p) {
  const SK = '#e2a878', RED = '#c82028', RED2 = '#8a1018', BLK = '#141418', GOLD = '#e8c040';
  scaledAbout(p.x + p.w / 2, p.y + p.h, 1.45, () => drawFighterBase(p, {
    SK, TOP: RED, TOP2: RED2, PNT: BLK, SHOE: BLK, SLEEVE: RED,
    body() { px(-5, -17, 10, 11, RED); px(-5, -17, 1, 11, RED2); px(-5, -10, 10, 2, BLK); px(-1, -10, 2, 2, GOLD); px(-4, -6, 3, 3, RED); px(1, -6, 3, 3, RED); px(-2, -16, 4, 3, GOLD); px(-1, -15, 2, 1, RED2); },
    head() {
      px(-3, -23, 6, 6, SK); px(-4, -25, 8, 2, BLK); px(-3, -27, 6, 2, BLK);       // scholar-official cap
      px(-6, -25, 2, 1, BLK); px(4, -25, 2, 1, BLK);                                 // the cap's wings
      px(1, -21, 1, 1, '#000'); px(-1, -21, 1, 1, '#000'); px(-1, -18, 3, 1, '#a06848');
    },
    arms() { px(-5, -16, 2, 6, RED); px(1, -15, 5, 3, RED); px(5, -15, 2, 2, SK); }
  }));
  if (p.dead) return;
  const swing = p.swingT > 0, hx = p.x + p.w / 2 + p.face * 9, hy = p.y + p.h - 21;
  const ang = swing ? (p.swingK === 'thrust' ? 0 : -1.0 + (1 - p.swingT / 0.13) * 1.7) : 0.9;
  ctx.save(); ctx.translate(hx, hy); ctx.scale(p.face, 1); ctx.rotate(ang);
  ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-4, -1, 5, 2); ctx.fillStyle = GOLD; ctx.fillRect(0, -2.5, 1.5, 5);
  ctx.fillStyle = '#e8ecf4'; ctx.fillRect(1.5, -1, 22, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(1.5, -1, 22, 0.7);
  ctx.fillStyle = '#c82028'; ctx.fillRect(-6, 1, 2, 4);                              // the red tassel
  ctx.restore();
  if (swing && p.swingK !== 'thrust') { ctx.save(); ctx.globalAlpha = 0.3; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx, hy, 22, p.face > 0 ? -1.1 : Math.PI - 0.7, p.face > 0 ? 0.7 : Math.PI + 1.1); ctx.stroke(); ctx.restore(); }
}
H36.zhanzhao = { upd: updZhan, ult: ultZhan, draw: drawZhan, hud: p => clamp(1 - h36(p).a / 2.4, 0, 1), hudName: 'GUILLOTINE' };

// ---------------------------------------------------------------- registration (runtime; the build adds the dispatch reps)
CHARS.krabi = { name: 'UNCLE LASER-KRABI', card: 'U.LASER', was: 'THE LASER SWORDSMAN', cn: '雷射劍叔', th: 'ลุงกระบี่เลเซอร์', tag: 'THE LASER KRABI', col: '#5aff9a', role: 'MELEE / BLADE', diff: 2,
  lines: ['ROLE: MELEE / BLADE   ·   DIFFICULTY ★★☆', 'J  LASER SLASH x3 (BATS BULLETS BACK)  ·  S+J  RISING LASER  ·  AIR S+J  PLUNGE', 'K  THROW THE BLADE: IT CUTS THROUGH AND COMES BACK', 'HOLD J  CHARGE: LASER WAVE (2 LEVELS)', 'L  LASER OVERDRIVE: THE BLADE GROWS FIVE TIMES LONGER'],
  stats: [['SPEED', 4], ['POWER', 3], ['RANGE', 3], ['SAFETY', 3]] };
CHARS.zhanzhao = { name: 'UNCLE ROYAL-CAT', card: 'U.R-CAT', was: 'THE RED IMPERIAL SWORDSMAN', cn: '御貓叔', th: 'ลุงแมวหลวงชุดแดง', tag: 'THE RED IMPERIAL SWORDSMAN', col: '#ff4a4a', role: 'MELEE / EXECUTIONER', diff: 2,
  lines: ['ROLE: MELEE / EXECUTIONER   ·   DIFFICULTY ★★☆', 'J  THRUST - SLASH - RISING SLASH  ·  S+J  LOW SWEEP  ·  AIR J  SWALLOW DIVE', 'K  HOUND-HEAD GUILLOTINE: PULLED FROM HIS SLEEVE, EXECUTES THE WEAK', 'L  THREE GUILLOTINES: DRAGON, TIGER, HOUND FALL ON EVERY FOE'],
  stats: [['SPEED', 4], ['POWER', 4], ['RANGE', 2], ['SAFETY', 3]] };
for (const k of ['krabi', 'zhanzhao']) { if (!CHAR_KEYS.includes(k)) CHAR_KEYS.push(k); NEW5.add(k); BLADE_HEROES.add(k); }
Object.assign(ORIGIN, { krabi: 'TH', zhanzhao: 'CN' });
Object.assign(UNLOCKS, { krabi: { stage: 8, rank: 'B' }, zhanzhao: { stage: 1, rank: 'A' } });
UNLOCK_ORDER.push('krabi', 'zhanzhao');
Object.assign(RUNCFG, { krabi: { run: 210, jump: 470 }, zhanzhao: { run: 214, jump: 478 } });
Object.assign(QUIPS, { krabi: ['BATTERIES INCLUDED.', 'THE KRABI OF THE FUTURE!', 'ZOMBIES? I BROUGHT A LASER.'], zhanzhao: ['開鍘!', 'THE COURT IS IN SESSION.', 'THE HOUND-HEAD IS HUNGRY.'] });
Object.assign(HERO_POW, { krabi: 1.1, zhanzhao: 1.1 });
SEL_SWING.add('krabi'); SEL_SWING.add('zhanzhao'); SEL_NEW.add('krabi'); SEL_NEW.add('zhanzhao');
Object.assign(SLOT_OVR, { krabi: ['LASER x3', 'THROW', 'RISING', 'OVERDRIVE'], zhanzhao: ['SWORD x3', 'GUILLOTINE', 'SWEEP', '3 BLADES'] });
for (const k in H36) { DRAW5[k] = H36[k].draw; HUD5[k] = H36[k].hud; }
const _ult5_36 = ult5; ult5 = function (p) { if (H36[p.ch]) return H36[p.ch].ult(p); return _ult5_36(p); };
const _drawProjs36h = drawProjs;
drawProjs = function () {
  _drawProjs36h();
  if (G.projs) for (const q of G.projs) if (q.kind === 'krabi') {
    ctx.save(); ctx.translate(Math.round(q.x), Math.round(q.y)); ctx.rotate(q.rot || 0); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#5aff9a'; ctx.fillRect(-11, -3, 22, 6); ctx.globalAlpha = 1; ctx.fillStyle = '#e8fff0'; ctx.fillRect(-10, -1, 20, 2); ctx.fillStyle = '#8a8a90'; ctx.fillRect(-3, -2, 5, 4);
    ctx.restore();
  }
  drawGuillotines();
};

// ---------------------------------------------------------------- UNCLE OTA (JP) — the fat shotgun uncle
// Parody, invented look: big belly in a stretched white undershirt + orange fishing vest, glasses, flip-flops, a pump shotgun.
// Meme: stand still and he cracks a beer, chugs it, crushes the can and tosses it over his shoulder.
//   J  shotgun blast (7 pellets, big knockback, pump between shots)   ·   S+J point-blank double blast (launches)   ·   AIR S+J blast straight down = shotgun jump
//   K  shaken beer can: lobbed, fizzes, bursts in a foam blast that stuns          ·   L  LAST CALL: slow-mo, explosive slugs, no pumping
function otaPellets(p, n, spread, dmg, life, dirY) {
  const tip = gunTip(p);
  for (let i = 0; i < n; i++) {
    const a = (i / (n - 1) - 0.5) * spread + rnd(-0.04, 0.04), v = rnd(520, 640);
    const dx = dirY ? Math.sin(a) : p.face * Math.cos(a), dy = dirY ? dirY * Math.cos(a) : Math.sin(a);
    G.bullets.push({ x: tip.x, y: tip.y, vx: dx * v, vy: dy * v, life: life, dmg, pellet: true });
  }
  G.muzzles.push({ x: tip.x, y: tip.y, dx: dirY ? 0 : p.face, dy: dirY || 0, t: 0.08 }); G.stats.shots++;
  light(tip.x, tip.y, 40, 0.07, '255,210,120'); audio.play('boom'); shake(0.16);
  for (let i = 0; i < 4; i++) part('smoke', tip.x, tip.y, (dirY ? 0 : p.face) * rnd(20, 80), rnd(-30, 10) + (dirY || 0) * 40, rnd(0.3, 0.6), 3, '#d8d0c0', { grow: 6, a: 0.5 });
}
function updOta(p, dt, ip) {
  const s = h36(p); p.fireCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt; s.pump = (s.pump || 0) - dt; s.lc = (s.lc || 0) - dt;
  // the beer meme: idle 2.5 s -> crack, chug, crush, toss
  const idle = p.onGround && Math.abs(p.vx) < 10 && !held('shoot') && !ip.bomb && p.fireCd < -0.5;
  s.idle = idle ? (s.idle || 0) + dt : 0;
  if (s.idle > 2.5 && !s.beer) { s.beer = 0.01; audio.play('tile'); popup(p.x + 5, p.y - 22, '*KSSHH*', '#e8e0c8'); }
  if (s.beer) { s.beer += dt; if (!idle) s.beer = 0;
    if (s.beer > 1.9) { s.beer = 0; s.idle = -1.5; G.cans36 = G.cans36 || []; G.cans36.push({ x: p.x + p.w / 2, y: p.y + 6, vx: -p.face * rnd(60, 110), vy: -220, t: 0, r: 0 }); popup(p.x + 5, p.y - 22, ['*CRUNCH*', 'AAAH.', '*BURP*'][(Math.random() * 3) | 0], '#ffd23f'); audio.play('tile'); p.ult = Math.min(100, p.ult + 3); } }
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  const last = s.lc > 0;
  if ((held('shoot') || ip.shoot) && p.fireCd <= 0) {
    s.beer = 0; s.idle = 0;
    if (!p.onGround && held('down')) {                              // shotgun jump
      p.fireCd = 0.7; p.shootT = 0.2; otaPellets(p, 7, 0.7, 1.6, 0.18, 1); p.vy = -460; popup(p.x + 5, p.y - 14, 'SHOTGUN JUMP!', '#ffd23f');
    } else if (held('down') && p.onGround && s.b <= 0) {           // point-blank double blast
      s.b = 1.4; p.fireCd = 0.9; p.shootT = 0.25; otaPellets(p, 12, 0.5, 2.0, 0.16); p.vx = -p.face * 160;
      for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - (p.x + p.w / 2 + p.face * 20)) < 26 && Math.abs(e.y - p.y) < 24) { damageEnemy(e, 4, p.x, true); if (!e.dead) { e.vx = p.face * 360; e.vy = -260; e.stun = 1; } }
      popup(p.x + 5, p.y - 16, 'BOTH BARRELS!', '#ff9a3a', true);
    } else {
      p.fireCd = last ? 0.18 : 0.62; p.shootT = 0.18; s.pump = last ? 0 : 0.3;
      otaPellets(p, last ? 5 : 7, 0.42, last ? 2.6 : 1.5, 0.22);
      if (last) { const tip = gunTip(p); proj({ kind: 'shot', x: tip.x, y: tip.y, vx: p.face * 640, vy: 0, dmg: 4, r: 4, life: 0.5, boom: 26, noSelf: true }); }
      p.vx -= p.face * 60;                                        // the recoil shoves the belly back
    }
  }
  if (s.pump > 0 && s.pump < 0.12 && !s.pumped) { s.pumped = true; audio.play('clang'); } if (s.pump <= 0) s.pumped = false;
  if (ip.bomb && s.a <= 0) {                                        // K: shaken beer can
    s.a = 1.3; s.beer = 0; p.swingT = 0.15; p.swingK = 'punch'; audio.play('whoosh');
    proj({ kind: 'beer', x: p.x + p.w / 2 + p.face * 6, y: p.y + 4, vx: p.face * 300 + p.vx * 0.3, vy: -200, g: 600, dmg: 3, r: 5, life: 1.2, boom: 30, noSelf: true, spin: 14 });
  }
  if (G.cans36) for (const c of G.cans36) { c.t += dt; c.vy += 700 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += c.vx * dt * 0.2; const gy = groundBelow(c.x, c.y - 4); if (c.y > gy - 2) { c.y = gy - 2; c.vy *= -0.35; c.vx *= 0.6; } }
  if (G.cans36) G.cans36 = G.cans36.filter(c => c.t < 6).slice(-12);
}
function ultOta(p) {
  const s = h36(p); s.lc = 4; p.inv = 1.5; G.timeScale = 0.5; G.slowT = 0.8;
  G.banner = { t: 0, title: 'LAST CALL', sub: 'ONE MORE BEER. THEN EVERYBODY GOES HOME.' }; audio.play('roar');
  popup(p.x + 5, p.y - 24, '*GLUG GLUG GLUG*', '#ffd23f', true); p.hp = Math.min(PC.hp, p.hp + 1);
}
function drawOta(p) {
  const s = h36(p), SK = '#e8b088', WH = '#f0ece0', VEST = '#e8822a', VEST2 = '#b85a14', PNT = '#5a6a4a';
  const chug = s.beer > 0 && s.beer < 1.9;
  scaledAbout(p.x + p.w / 2, p.y + p.h, 1.5, () => drawFighterBase(p, {
    SK, TOP: WH, TOP2: '#d8d0c0', PNT, SHOE: '#3a6ac8', SLEEVE: SK,
    body() {
      px(-6, -17, 12, 11, WH); px(-7, -13, 14, 7, WH); px(-7, -9, 14, 3, SK); px(-1, -8, 2, 1, '#c88a6a');   // the belly peeks out
      px(-6, -17, 3, 10, VEST); px(3, -17, 3, 10, VEST); px(-6, -14, 3, 2, VEST2); px(3, -14, 3, 2, VEST2); px(-5, -6, 10, 1, '#3a2a1a');
    },
    head() {
      px(-4, -24, 8, 7, SK); px(-5, -26, 9, 3, '#141014'); px(-5, -24, 2, 4, '#141014');                  // messy hair
      px(-2, -22, 3, 2, '#202020'); px(2, -22, 3, 2, '#202020'); px(-2, -22, 7, 1, '#202020');             // glasses
      px(-3, -18, 7, 2, SK); px(1, -18, 2, 1, '#a06848');                                                   // double chin
    },
    arms() {
      if (chug) { px(1, -20, 3, 6, SK); px(2, -24, 3, 5, '#c8c8d0'); px(2, -24, 3, 1, '#e83a2a'); }       // can tipped up to the mouth
      else { px(-7, -16, 3, 6, SK); px(4, -15, 4, 3, SK); }
    }
  }));
  if (p.dead) return;
  // the shotgun (world space so it recoils)
  const fx = p.x + p.w / 2, fy = p.y + p.h - 19, kick = p.shootT > 0 ? -3 : 0, pumpOff = s.pump > 0 ? -3 : 0;
  if (!chug) {
    ctx.save(); ctx.translate(fx + p.face * (4 + kick), fy); ctx.scale(p.face, 1); if (p.aimUp) ctx.rotate(-1.1); if (held && p.onGround === false && p.shootT > 0 && p.vy < 0) ctx.rotate(1.3);
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-8, -1, 8, 4); ctx.fillStyle = '#2a2a30'; ctx.fillRect(0, -1, 22, 2); ctx.fillRect(4 + pumpOff, 1, 8, 2);
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(4 + pumpOff, 1, 8, 2); ctx.fillStyle = '#8a8a90'; ctx.fillRect(0, -1, 22, 0.6);
    ctx.restore();
  }
}
function drawOtaCans() {
  if (!G.cans36) return;
  for (const c of G.cans36) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r); ctx.globalAlpha = clamp(6 - c.t, 0, 1); ctx.fillStyle = '#c8c8d0'; ctx.fillRect(-2, -3, 4, 5); ctx.fillStyle = '#e83a2a'; ctx.fillRect(-2, -2, 4, 2); ctx.restore(); }
}
H36.ota = { upd: updOta, ult: ultOta, draw: drawOta, hud: p => clamp(1 - h36(p).a / 1.3, 0, 1), hudName: 'BEER' };
CHARS.ota = { name: 'UNCLE OTA', card: 'U.OTA', was: 'THE BEER-BELLY SHOTGUNNER', cn: '太田叔', th: 'ลุงโอตะ', tag: 'SHOTGUN + BEER BELLY', col: '#e8822a', role: 'GUNNER / CROWD CONTROL', diff: 1,
  lines: ['ROLE: GUNNER / CROWD CONTROL   ·   DIFFICULTY ★☆☆', 'J  SHOTGUN (PUMP BETWEEN SHOTS)  ·  S+J  BOTH BARRELS  ·  AIR S+J  SHOTGUN JUMP', 'K  SHAKEN BEER CAN: FOAM BLAST', 'STAND STILL: HE CRACKS A BEER (+ULT)', 'L  LAST CALL: SLOW-MO EXPLOSIVE SLUGS, NO PUMPING, +1 HEART'],
  stats: [['SPEED', 2], ['POWER', 4], ['RANGE', 2], ['SAFETY', 3]] };
if (!CHAR_KEYS.includes('ota')) CHAR_KEYS.push('ota'); NEW5.add('ota');
ORIGIN.ota = 'JP'; UNLOCKS.ota = { stage: 8, rank: 'A' }; UNLOCK_ORDER.push('ota'); RUNCFG.ota = { run: 168, jump: 430 };
QUIPS.ota = ['ONE MORE BEER.', 'I AM... ON MY BREAK.', 'PUMP. BANG. BURP.']; HERO_POW.ota = 1.05; SEL_NEW.add('ota'); SLOT_OVR.ota = ['SHOTGUN', 'BEER CAN', 'BOTH BARRELS', 'LAST CALL'];
DRAW5.ota = drawOta; HUD5.ota = H36.ota.hud;
const _drawProjs36o = drawProjs;
drawProjs = function () {
  _drawProjs36o(); drawOtaCans();
  if (G.projs) for (const q of G.projs) if (q.kind === 'beer') { ctx.save(); ctx.translate(Math.round(q.x), Math.round(q.y)); ctx.rotate(q.rot || 0); ctx.fillStyle = '#c8c8d0'; ctx.fillRect(-2.5, -3.5, 5, 7); ctx.fillStyle = '#e8c040'; ctx.fillRect(-2.5, -1.5, 5, 3); ctx.fillStyle = '#ffffff'; if (Math.random() < 0.5) ctx.fillRect(2, -4, 2, 2); ctx.restore(); }
};

// ---------------------------------------------------------------- Gemini art for the v36 heroes: chibi sprite atlases + select posters
const SPR36_META = /*SPR36_META*/, SPR36_PNG = /*SPR36_PNG*/, POSTER36 = /*POSTER36*/;
for (const k in SPR36_PNG) { const im = new Image(); im.src = 'data:image/png;base64,' + SPR36_PNG[k]; SPR[k] = { im, f: SPR36_META[k] }; }
for (const k in POSTER36) { const im = new Image(); im.src = 'data:image/webp;base64,' + POSTER36[k]; ART[k] = im; }
function sprFrame36(p, n) {                                  // draw one named atlas frame at the hero's feet (used for the beer chug)
  const S = SPR[p.ch]; if (!S || !S.im.complete || !S.im.naturalWidth) return false; const fr = S.f[n]; if (!fr) return false;
  ctx.save(); ctx.translate(Math.round(p.x + p.w / 2), Math.round(p.y + p.h)); ctx.scale(p.face, 1);
  const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false; ctx.drawImage(S.im, fr.x, fr.y, fr.w, fr.h, -fr.ax, -fr.h, fr.w, fr.h); ctx.imageSmoothingEnabled = sm; ctx.restore(); return true;
}
{
  const proc = { krabi: drawKrabi, zhanzhao: drawZhan, ota: drawOta };
  for (const k in proc) DRAW5[k] = p => {
    const S = SPR[k]; if (!S || !S.im.complete || !S.im.naturalWidth) return proc[k](p);
    if (p.inv > 0 && !p.dead && Math.floor(p.inv * 22) % 2 === 0) return;
    const s = h36(p);
    if (k === 'ota' && s.beer > 0 && s.beer < 1.9 && sprFrame36(p, 'win')) return;
    drawSpriteHero(p);
    if (k === 'krabi') drawKrabiBlade(p);
  };
}
