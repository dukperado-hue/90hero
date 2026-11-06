// v30 tweaks: Tai-Chi Uncle gets his qi effects back + palm shockwave + blade deflect; Auntie Arsenal's weapons become big and readable.
// (the chibi sprite replaced the old pixel draw functions, which is where the qi circle / weapon sprites lived)
{
  const _upd = updZhang;
  updZhang = function (p, dt, ip) {
    _upd(p, dt, ip);
    p._fx = (p._fx || 0) - dt; p.bladeFx = (p.bladeFx || 0) - dt;
    if (p.atkCd > 0.40 && p._fx <= 0 && p.swingK === 'palm' && !p.absorbing) {        // a J palm was just thrown: shockwave ahead of the hand
      p._fx = 0.3; const cx = p.x + p.w / 2, hx = cx + p.face * 18, hy = p.y + p.h - 18;
      meleeSwing(p, { dmg: 2.4, reach: 54, y0: -26, y1: 0, tile: 1 });
      for (let i = 0; i < 3; i++) later(i * 0.05, () => part('ring', hx + p.face * i * 10, hy, 0, 0, 0.28, 7 + i * 5, i ? '#bfe0ff' : '#ffffff'));
      for (let i = 0; i < 8; i++) part('spark', hx, hy, p.face * rnd(40, 160), rnd(-70, 70), rnd(0.15, 0.3), 1, '#e8f4ff');
      reflectBullets(p, 60, 1.4, 2);
    }
    if (p.absorbing && Math.random() < dt * 40) part('spark', p.x + p.w / 2 + rnd(-24, 24), p.y + p.h - rnd(2, 36), 0, -rnd(20, 60), 0.4, 1, '#bfe0ff');
  };
  const _hurt = hurtPlayer;
  hurtPlayer = function (n, srcX, contact) {
    const p = G.player;
    if (contact && p && p.ch === 'zhang' && !p.dead && (p.parryT > 0 || p.absorbing) && srcX != null) {       // blades are pushed aside, the wielder is spun away
      let foe = null, bd = 1e9;
      for (const e of G.enemies) if (!e.dead) { const d = Math.abs(e.x + e.w / 2 - srcX); if (d < bd) { bd = d; foe = e; } }
      if (foe && bd < 40) {
        foe.vx = Math.sign(foe.x - p.x || 1) * 260; foe.vy = -140; foe.stun = Math.max(foe.stun || 0, 0.9); foe.state = 'recover'; foe.t = 0.8;
        damageEnemy(foe, 1.5, p.x + p.w / 2, true);
        popup(p.x + 4, p.y - 14, '撥! DEFLECT', '#e8f4ff', true); audio.play('clang'); hitstop(0.06); shake(0.1); G.stats.deflect = (G.stats.deflect || 0) + 1;
        part('ring', srcX, p.y + p.h - 18, 0, 0, 0.25, 14, '#ffffff'); addUlt(p, 6);
        return;
      }
    }
    return _hurt(n, srcX, contact);
  };
}
function drawZhangFx(p) {
  if (p.dead || (p.inv > 0 && Math.floor(p.inv * 22) % 2 === 0)) return;
  const cx = p.x + p.w / 2, cy = p.y + p.h - 18, t = G.clock;
  if (p.absorbing || p.stormT > 0) {                          // the turning yin-yang circle
    const r = p.stormT > 0 ? ZH.stormR : ZH.absorbR - 6;
    ctx.save(); ctx.globalAlpha = p.stormT > 0 ? 0.6 : 0.5; ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.arc(cx, cy, r, t * 4, t * 4 + Math.PI); ctx.stroke();
    ctx.strokeStyle = '#20202a'; ctx.beginPath(); ctx.arc(cx, cy, r, t * 4 + Math.PI, t * 4 + 6.283); ctx.stroke();
    ctx.globalAlpha *= 0.7; ctx.lineWidth = 1; ctx.strokeStyle = '#bfe0ff'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, -t * 6, -t * 6 + 4); ctx.stroke();
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#bfe0ff'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
    ctx.restore();
  }
  if (p.parryT > 0) {                                         // palm flash: the open hand glows and a wide arc sweeps in front
    const q = p.parryT / ZH.parry, hx = cx + p.face * 16;
    ctx.save(); ctx.globalAlpha = 0.8 * q; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx + p.face * 6, cy, 22 + (1 - q) * 14, p.face > 0 ? -1.2 : Math.PI - 1.2 + 0.0, p.face > 0 ? 1.2 : Math.PI + 1.2); ctx.stroke();
    ctx.globalAlpha = 0.35 * q; ctx.fillStyle = '#bfe0ff'; ctx.beginPath(); ctx.arc(hx, cy, 11, 0, 6.283); ctx.fill(); ctx.restore();
  }
  for (let i = 0; i < (p.stored | 0); i++) {                  // stored bullets orbit his arms
    const a = t * 7 + i * 6.283 / Math.max(1, p.stored), r = 12 + (i % 3) * 4;
    ctx.fillStyle = '#ff7a3a'; ctx.fillRect(Math.round(cx + Math.cos(a) * r) - 1, Math.round(cy + Math.sin(a) * r * 0.6) - 1, 3, 3);
  }
}
// ---- Auntie Arsenal: the weapon in her hand is drawn big, swings with a trail, and shows its name + durability above her head
function drawMichelleFx(p) {
  if (p.dead || (p.inv > 0 && Math.floor(p.inv * 22) % 2 === 0)) return;
  const W = MW[p.weapon || 'sword'], k = p.weapon || 'sword', f = p.face;
  const hx = p.x + p.w / 2 + f * 9, hy = p.y + p.h - 17;
  const swing = p.swingT > 0, q = swing ? 1 - Math.max(0, p.swingT) / 0.15 : 0;
  const ang = swing ? -1.9 + 2.5 * Math.min(1, q) : -1.15 + Math.sin(G.clock * 3) * 0.05;
  ctx.save(); ctx.translate(Math.round(hx), Math.round(hy)); ctx.scale(f, 1);
  if (swing) {                                                // swing trail
    ctx.save(); ctx.globalAlpha = 0.5 * (1 - q * 0.6); ctx.strokeStyle = k === 'fan' ? '#ff9ad0' : '#ffffff'; ctx.lineWidth = 3;
    const R = 16 + (W.len || 12) * 1.2; ctx.beginPath(); ctx.arc(-2, 0, R, -1.9, ang); ctx.stroke(); ctx.restore();
  }
  ctx.rotate(ang);
  const S = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const blade = (len, wid, col) => { S('#3a2a1a', -2, -1, 5, 3); S('#c8a040', 3, -3, 2, 7); S(col, 5, -wid / 2, len, wid); S('#ffffff', 5, -wid / 2, len, 1); };
  if (k === 'sword') blade(26, 3, '#dfe8f4');
  else if (k === 'blade') { blade(22, 6, '#cfd4de'); S('#cfd4de', 26, -3, 4, 5); }
  else if (k === 'spear') { S('#8a5a2a', -10, -1, 44, 2); S('#e8eef8', 34, -3, 10, 6); S('#e8eef8', 44, -1, 3, 2); S('#d02a2a', 31, -2, 3, 4); }
  else if (k === 'guandao') { S('#8a5a2a', -8, -1, 40, 2); S('#dfe8f4', 30, -7, 14, 9); S('#ffffff', 30, -7, 14, 1); S('#2a8a4a', 28, -2, 3, 3); }
  else if (k === 'twin') { blade(13, 2, '#ffffff'); ctx.rotate(-0.9); blade(13, 2, '#e8f0ff'); }
  else if (k === 'hammer') { S('#6a5a4a', -2, -1, 22, 2); const bx = 24 + Math.cos(G.clock * 9) * 2; S('#7a7a86', bx, -6, 11, 12); S('#b8b8c4', bx, -6, 11, 2); }
  else if (k === 'nunchaku') { S('#c8a060', 0, -2, 11, 3); const a2 = Math.sin(G.clock * 18) * 0.8; ctx.save(); ctx.translate(11, 0); ctx.rotate(a2); S('#888', 0, 0, 5, 1); ctx.translate(5, 0); S('#c8a060', 0, -2, 11, 3); ctx.restore(); }
  else if (k === 'chain') { for (let i = 0; i < 9; i++) S('#c8c8d0', 3 + i * 4, Math.round(Math.sin(G.clock * 10 + i) * 2) - 1, 3, 2); S('#9a9aa4', 40, -3, 6, 6); }
  else if (k === 'fan') { ctx.fillStyle = '#ff9ad0'; ctx.beginPath(); ctx.moveTo(2, 0); ctx.arc(2, 0, 17, -0.9, 0.9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#b8407a'; ctx.lineWidth = 1; for (let a = -0.7; a <= 0.71; a += 0.35) { ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(2 + Math.cos(a) * 17, Math.sin(a) * 17); ctx.stroke(); } }
  ctx.restore();
  // name + durability pips above her head
  const nx = Math.round(p.x + p.w / 2), ny = Math.round(p.y + p.h - 52);
  ctx.save(); ctx.font = '6px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#000'; ctx.fillText(W.name, nx + 1, ny + 1); ctx.fillStyle = '#ff9ad0'; ctx.fillText(W.name, nx, ny);
  const n = W.dur, on = Math.max(0, p.wDur | 0), x0 = nx - n * 1.5;
  for (let i = 0; i < n; i++) { ctx.fillStyle = i < on ? (on <= 3 ? '#ff5a5a' : '#ffe08a') : '#3a2a3a'; ctx.fillRect(Math.round(x0 + i * 3), ny + 3, 2, 2); }
  ctx.restore();
}
