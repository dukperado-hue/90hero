// v34 KUNG-FU TRAINING DUMMIES (木人樁) — wooden practice posts dotted around the Shaolin courtyard. They wobble when hit, charge your ULT a little per hit, and split open (sometimes dropping a pickup).
// Implemented as a harmless 'dummy' enemy type: no AI, no score, doesn't count as a kill.
function mkDummy(tx) {
  const e = mkEnemy('dummy', tx, 18); e.alerted = false; e.wob = 0; e.wobV = 0; e.face = 1; e.isDummy = true; return e;
}
function breakDummy(e) {
  if (e.dead) return;
  e.dead = true; e.gibbed = true; e.deadT = 99; e.hp = 0;
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  debris(cx, cy, 14, ['#8a5a2a', '#6a4018', '#b07a3a', '#4a2a10'], 1.2); dust(cx, e.y + e.h, 6, 6, '#a08a6a');
  audio.play('crate'); shake(0.1);
  popup(cx - 10, e.y - 8, 'TRAINING DONE', '#ffe9b8', false, 'dum' + ((cx | 0) % 997));
  if (Math.random() < 0.5) G.pickups.push({ x: cx - 4, y: e.y + 6, w: 8, h: 8, vx: 0, vy: -140, type: (G.player && G.player.hp <= 2) ? 'hp' : 'bomb', t: 0, onGround: false });
}
{
  const _dmg = damageEnemy;
  damageEnemy = function (e, dmg, srcX) {
    if (e && e.type === 'dummy') {
      if (e.dead) return;
      e.hp -= Math.min(dmg, 3); e.flash = 0.08; e.wobV += sign(e.x + 7 - (srcX == null ? e.x : srcX)) * 9;
      const p = G.player; if (p && !p.dead) addUlt(p, 1.5);
      audio.play('punch'); debris(e.x + 7, e.y + 10, 3, ['#8a5a2a', '#b07a3a'], 0.6);
      if (e.hp <= 0) breakDummy(e);
      return;
    }
    return _dmg.apply(this, arguments);
  };
  const _ue = updEnemy;
  updEnemy = function (e, dt) {
    if (e.type !== 'dummy') return _ue.apply(this, arguments);
    if (e.dead) return;
    e.flash -= dt; e.anim += dt;
    e.wobV += -e.wob * 90 * dt; e.wobV *= Math.pow(0.04, dt); e.wob += e.wobV * dt;
    e.vy = Math.min(e.vy + GRAV_E * dt, 700); e.vx = approach(e.vx, 0, 600 * dt); moveBody(e, dt);
    if (e.y > LH * TS + 30) breakDummy(e);
  };
  const _de = drawEnemy;
  drawEnemy = function (e) {
    if (e.type !== 'dummy') return _de.apply(this, arguments);
    if (e.dead) return;
    const fx = Math.round(e.x + e.w / 2), fy = Math.round(e.y + e.h);
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(clamp(e.wob, -0.5, 0.5) * 0.12 * 1);
    const hit = e.flash > 0, c1 = hit ? '#ffe9b8' : '#8a5a2a', c2 = hit ? '#fff' : '#b07a3a', c3 = hit ? '#e0c090' : '#5a3a18';
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(-9, -3, 18, 3);                       // base
    ctx.fillStyle = '#4a2c12'; ctx.fillRect(-8, -3, 16, 2);
    ctx.fillStyle = c3; ctx.fillRect(-4, -26, 8, 24);                              // trunk (outline)
    ctx.fillStyle = c1; ctx.fillRect(-3, -26, 6, 24); ctx.fillStyle = c2; ctx.fillRect(-3, -26, 2, 24);
    ctx.fillStyle = '#3a2008'; for (let i = 0; i < 5; i++) ctx.fillRect(-3, -24 + i * 5, 6, 1);   // bark rings
    for (const [y, l, r] of [[-20, 9, 8], [-14, 8, 0]]) {                          // wooden arms
      ctx.fillStyle = c3; ctx.fillRect(-4 - l, y - 1, l + 1, 4); ctx.fillStyle = c1; ctx.fillRect(-3 - l, y, l, 2);
      if (r) { ctx.fillStyle = c3; ctx.fillRect(3, y - 1, r + 1, 4); ctx.fillStyle = c1; ctx.fillRect(3, y, r, 2); }
    }
    ctx.fillStyle = c3; ctx.fillRect(-2, -10, 4, 12); ctx.fillStyle = '#c83a2a'; ctx.fillRect(-4, -28, 8, 2);   // leg stub + red headband
    ctx.restore();
  };
}
// the courtyard's training dummies (stage 2 only, placed outside the ambush zones)
{
  const _ng = newGame;
  newGame = function () { const r = _ng.apply(this, arguments); if (STAGE === 2) for (const tx of [8, 15, 56, 96, 184, 189]) G.enemies.push(mkDummy(tx)); return r; };
}
