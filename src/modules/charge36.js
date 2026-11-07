// =====================================================================
// v36 — ROCKMAN-STYLE CHARGE + COMBO COUNTER
// CHARGE (hold J, release): built for every hero, but switched on only for the few listed in CHARGE36 so nobody gets too strong.
//   Level 1 (hold ~0.6 s): a charged strike.  Level 2 (hold ~1.5 s): the full blast.  The hero glows/flashes while charging, like the Mega Buster.
//   Heroes with their own hold-to-charge move (Dagger Li's unerring knife) keep it; the system only adds the glow + a level-2 bonus.
// COMBO: every hit within 1.6 s of the last one adds to the counter. Small damage bonus (max +25 %), ult bonus, and at 10/20/30/50 hits
//   a free "COMBO BURST" shockwave. Taking a hit or letting the timer run out ends the combo.
// =====================================================================
const CHARGE36 = {
  li:     { native: true, col: '#cfe8ff', name: 'UNERRING KNIFE' },
  lady:   { kind: 'crescent', col: '#ff3a5a', col2: '#ffd0d8', name: 'VENGEANCE CRESCENT' },
  oldboy: { kind: 'quake', col: '#c8c8d0', col2: '#ffe28a', name: 'CORRIDOR QUAKE' },
  krabi:  { kind: 'laser', col: '#5aff9a', col2: '#e8fff0', name: 'LASER WAVE' }
};
const CH36 = { t1: 0.6, t2: 1.5 };
function chargeLevel(t) { return t >= CH36.t2 ? 2 : t >= CH36.t1 ? 1 : 0; }
function chargeOn(p) { return !!(p && CHARGE36[p.ch] && !p.dead); }
function fireCharge36(p, lv) {
  const C = CHARGE36[p.ch]; if (!C || C.native) return;
  const fx = p.x + p.w / 2 + p.face * 8, fy = p.y + p.h * 0.45, big = lv >= 2;
  p.swingT = 0.22; p.swingK = C.kind === 'quake' ? 'bigkick' : 'slash'; p.atkCd = Math.max(p.atkCd || 0, 0.25);
  if (C.kind === 'quake') {                    // the hammer hits the floor: a shock wave runs along the ground, launching everyone it passes
    proj({ kind: 'cwave', ck: 'quake', x: fx, y: p.y + p.h - 6, vx: p.face * (big ? 380 : 300), vy: 0, dmg: big ? 9 : 5, r: big ? 12 : 8, life: big ? 0.9 : 0.6, pierce: true, stun: 0.9, col: C.col, col2: C.col2, lv, launch: true });
    shake(big ? 0.45 : 0.25); dust(fx, p.y + p.h, big ? 14 : 8, big ? 20 : 12); audio.play('slam');
  } else {
    proj({ kind: 'cwave', ck: C.kind, x: fx, y: fy, vx: p.face * (big ? 560 : 470), vy: 0, dmg: big ? 10 : 5, r: big ? 13 : 8, life: big ? 0.8 : 0.55, pierce: true, col: C.col, col2: C.col2, lv, launch: big });
    shake(big ? 0.3 : 0.12); audio.play(big ? 'roar' : 'whoosh');
  }
  hitstop(big ? 0.06 : 0.03); light(fx, fy, big ? 70 : 40, 0.15, '255,240,200');
  popup(p.x + 5, p.y - 22, (big ? 'FULL ' : '') + C.name + '!', C.col, big);
  G.stats.charged = (G.stats.charged || 0) + 1;
}
// --- per-frame: track J hold on the active hero, fire on release
const _updatePlayer36 = updatePlayer;
updatePlayer = function (dt, ip) {
  _updatePlayer36(dt, ip);
  const p = G.player; if (!p) return;
  const c = p.ch36 || (p.ch36 = { t: 0, lv: 0 });
  if (!chargeOn(p) || G.cine || G.mode !== 'play') { c.t = 0; c.lv = 0; return; }
  const C = CHARGE36[p.ch];
  if (C.native) { c.lv = p.charge >= 1 ? (p.holdT > 2.0 ? 2 : 1) : 0; if (c.lv === 2 && !c.told) { c.told = true; popup(p.x + 5, p.y - 22, 'FULL CHARGE!', C.col); } if (!held('shoot')) c.told = false; return; }
  if (held('shoot')) {
    c.t += dt; const lv = chargeLevel(c.t);
    if (lv > c.lv) { c.lv = lv; audio.play(lv === 2 ? 'check' : 'tile'); for (let i = 0; i < 8; i++) part('spark', p.x + p.w / 2, p.y + p.h / 2, rnd(-90, 90), rnd(-90, 90), 0.3, 1, lv === 2 ? C.col : '#ffffff'); }
  } else {
    if (c.lv > 0) fireCharge36(p, c.lv);
    c.t = 0; c.lv = 0;
  }
};
// --- projectile: terrain + collision are handled by updProjs (pierce); here: tiles it passes and the launch
const _updProjs36 = updProjs;
updProjs = function (dt) {
  if (G.projs) for (const q of G.projs) if (q.kind === 'cwave') {
    if (q.ck === 'quake') { q.y = groundBelow(q.x, q.y - 10) - 6; if (Math.random() < dt * 50) dust(q.x, q.y + 6, 1, 6); }
    const tx = Math.floor(q.x / TS), ty = Math.floor(q.y / TS);
    for (let k = -1; k <= (q.lv >= 2 ? 1 : 0); k++) if (DESTRUCT[tileAt(tx, ty + k)] && tileAt(tx, ty + k) !== T.G) damageTile(tx, ty + k, q.lv >= 2 ? 3 : 1);
    if (q.launch) for (const e of G.enemies) if (!e.dead && q.hitSet.has(e) && !e.cwL) { e.cwL = true; e.vy = -300; e.vx = sign(q.vx) * 200; }
    if (q.ck !== 'quake' && solidPx(q.x, q.y)) q.t = 99;      // walls stop the blade waves
  }
  _updProjs36(dt);
};
const _drawProjs36 = drawProjs;
drawProjs = function () {
  _drawProjs36();
  if (!G.projs) return;
  for (const q of G.projs) if (q.kind === 'cwave') {
    const d = sign(q.vx), a = clamp(1 - q.t / (q.life || 1) * 0.6, 0.3, 1), R = q.r;
    ctx.save(); ctx.translate(Math.round(q.x), Math.round(q.y)); ctx.scale(d, 1); ctx.globalAlpha = a;
    if (q.ck === 'crescent') {                       // a red crescent moon of a blade
      ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(0, 0, R * 1.5, -1.2, 1.2); ctx.arc(-R * 0.7, 0, R * 1.3, 1.1, -1.1, true); ctx.fill();
      ctx.fillStyle = q.col2; ctx.beginPath(); ctx.arc(0, 0, R * 1.2, -0.9, 0.9); ctx.arc(-R * 0.6, 0, R * 1.05, 0.85, -0.85, true); ctx.fill();
    } else if (q.ck === 'laser') {                   // a green beam blade with a white core
      ctx.fillStyle = q.col; ctx.fillRect(-R * 2.2, -R * 0.55, R * 3, R * 1.1); ctx.beginPath(); ctx.arc(R * 0.8, 0, R * 0.55, -1.57, 1.57); ctx.fill();
      ctx.fillStyle = q.col2; ctx.fillRect(-R * 2, -R * 0.2, R * 2.8, R * 0.4);
      ctx.globalAlpha = a * 0.35; ctx.fillStyle = q.col; ctx.fillRect(-R * 4, -R * 0.3, R * 2, R * 0.6);
    } else {                                         // quake: a travelling burst of rubble + light
      ctx.fillStyle = q.col2; ctx.beginPath(); ctx.moveTo(-R, 6); ctx.lineTo(0, -R * 1.6); ctx.lineTo(R * 0.8, 6); ctx.fill();
      ctx.fillStyle = q.col; for (let k = 0; k < 4; k++) ctx.fillRect(-R + k * R * 0.5, -((k * 7 + q.t * 60) % (R * 1.6)), 3, 3);
    }
    ctx.restore();
  }
};
// --- the Mega-Buster glow on the hero while charging (world space, drawn after the hero)
function drawCharge36() {
  const p = G.player; if (!chargeOn(p) || !p.ch36 || !p.ch36.lv) return;
  const C = CHARGE36[p.ch], lv = p.ch36.lv, t = G.clock, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
  const on = Math.floor(t * (lv === 2 ? 24 : 12)) % 2 === 0;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = on ? 0.55 : 0.25; ctx.fillStyle = lv === 2 ? C.col : '#ffffff';
  ctx.beginPath(); ctx.ellipse(cx, cy, 14 + lv * 3, 22 + lv * 3, 0, 0, 6.283); ctx.fill();
  ctx.globalAlpha = 0.9;
  for (let i = 0; i < 6 * lv; i++) { const an = t * 7 + i * 6.283 / (6 * lv), rr = 20 - ((t * 40 + i * 5) % 16); ctx.fillRect(cx + Math.cos(an) * rr - 1, cy + Math.sin(an) * rr * 1.4 - 1, 2, 2); }
  ctx.restore();
}
// =====================================================================  COMBO
const COMBO36 = { win: 1.6, bursts: [10, 20, 30, 50, 75, 100] };
function comboWord(n) { return n >= 50 ? 'RIDICULOUS!' : n >= 30 ? 'INSANE!' : n >= 20 ? 'AWESOME!' : n >= 10 ? 'GREAT!' : n >= 5 ? 'GOOD' : ''; }
const _damageEnemy36 = damageEnemy;
damageEnemy = function (e, dmg, srcX, explosive, chain) {
  if (!e || e.dead || G.mode !== 'play') return _damageEnemy36.apply(this, arguments);
  const c = G.hc || (G.hc = { n: 0, t: 0, best: 0, pop: 0 });
  const mult = 1 + Math.min(c.n, 25) * 0.01;
  const r = _damageEnemy36.call(this, e, dmg * mult, srcX, explosive, chain);
  if (!e.isDummy || true) {
    c.n++; c.t = COMBO36.win; c.pop = 0.18; c.best = Math.max(c.best, c.n); G.stats.bestCombo = Math.max(G.stats.bestCombo || 0, c.n);
    if (c.n % 10 === 0 && G.player && !G.player.dead) addUlt(G.player, 6);
    if (COMBO36.bursts.includes(c.n)) comboBurst(c.n);
  }
  return r;
};
function comboBurst(n) {
  const p = G.player; if (!p || p.dead) return;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2, R = 60 + Math.min(n, 50);
  G.banner = G.banner && G.banner.t < 1 ? G.banner : { t: 0, title: n + ' HIT COMBO!', sub: comboWord(n) + '  —  COMBO BURST' };
  shake(0.3); hitstop(0.08); audio.play('slam'); light(cx, cy, R, 0.2, '255,230,150');
  for (let i = 0; i < 24; i++) part('spark', cx, cy, Math.cos(i / 24 * 6.283) * 260, Math.sin(i / 24 * 6.283) * 260, 0.35, 2, i % 2 ? '#ffd23f' : '#ffffff');
  for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - cx) < R && Math.abs(e.y + e.h / 2 - cy) < R * 0.7) { _damageEnemy36(e, 3, cx, true); if (!e.dead) { e.vy = -260; e.vx = sign(e.x - cx || 1) * 220; e.stun = 0.8; } }
}
const _hurtPlayer36 = hurtPlayer;
hurtPlayer = function (n, srcX, contact) {
  const p = G.player, hp0 = p ? p.hp : 0, inv0 = p ? p.inv : 0;
  const r = _hurtPlayer36.apply(this, arguments);
  if (p && G.hc && (p.hp < hp0 || p.dead) && G.hc.n > 0) { if (G.hc.n >= 5) popup(p.x + 5, p.y - 30, 'COMBO BROKEN (' + G.hc.n + ')', '#ff7a5a'); G.hc.n = 0; G.hc.t = 0; }
  if (p && p.ch36 && p.hp < hp0) { p.ch36.t = 0; p.ch36.lv = 0; }   // getting hit drops the charge, like the Blue Bomber
  return r;
};
function updCombo36(dt) {
  const c = G.hc; if (!c) return;
  c.pop = Math.max(0, c.pop - dt);
  if (c.n > 0) { c.t -= dt; if (c.t <= 0) { if (c.n >= 10) popup(G.player.x + 5, G.player.y - 30, c.n + ' HITS — ' + comboWord(c.n), '#ffd23f'); c.n = 0; } }
}
function drawCombo36() {                              // screen space, right side under the score
  const c = G.hc; if (!c || c.n < 3 || G.mode !== 'play') return;
  const x = VW - 10, y = 96, k = 1 + c.pop * 2.2, w = comboWord(c.n), hot = c.n >= 20;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 18px monospace'; ctx.fillStyle = '#000'; ctx.fillText(c.n + '', 1, 1); ctx.fillStyle = hot ? (Math.floor(G.clock * 10) % 2 ? '#ff5a3a' : '#ffd23f') : '#ffd23f'; ctx.fillText(c.n + '', 0, 0);
  ctx.font = 'bold 7px monospace'; ctx.fillStyle = '#fff'; ctx.fillText('HITS', 0, 12);
  if (w) { ctx.fillStyle = hot ? '#ff9a3a' : '#9ae8ff'; ctx.fillText(w, 0, 21); }
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - 40, y + 27, 40, 2); ctx.fillStyle = '#ffd23f'; ctx.fillRect(x - 40, y + 27, 40 * clamp(c.t / COMBO36.win, 0, 1), 2);
}
