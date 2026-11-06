// v34 VILLAIN LAB #1 — the GOLDEN MAN (金人): Metal-Slug-style sprite frames, armour that bullets crack, tough body. Plus Pob pulling enemies' entrails out.
const GOLD_META = /*GOLD_META*/;
const GOLD_IM = { g: new Image(), f: new Image() };
GOLD_IM.g.src = 'data:image/png;base64,/*GOLD_PNG*/'; GOLD_IM.f.src = 'data:image/png;base64,/*GOLD_FLESH*/';
const GOLD_ARM = 5;                                   // armour points: bullets chip them, then the gold cracks and he takes full damage for a few seconds
const goldOK = () => GOLD_IM.g.complete && GOLD_IM.g.naturalWidth && GOLD_IM.f.complete && GOLD_IM.f.naturalWidth;
function goldCrack(e, why) {
  e.armor = 0; e.crackT = 6; e.flexT = 0; popup(e.x + 2, e.y - 16, 'GOLD CRACKED!', '#ffd23f', true, 'gcrack' + (G.stats.kills | 0));
  audio.play('clang'); shake(0.12);
  for (let i = 0; i < 14; i++) part('debris', e.x + e.w / 2 + rnd(-5, 5), e.y + rnd(2, e.h - 4), rnd(-120, 120), rnd(-200, -40), rnd(0.8, 1.4), 2 + (Math.random() * 2 | 0), i % 2 ? '#ffd23f' : '#c89a1a', { g: 800, vr: rnd(-12, 12) });
}
{
  // bullets glance off the armour but wear it down; once cracked they hurt (85%)
  const _mbh = monkBulletHit;
  monkBulletHit = function (e, b) {
    const base = _mbh.call(this, e, b);
    if (e.armor === undefined) e.armor = GOLD_ARM;
    const d = b.dmg || 1;
    if (e.crackT > 0) return d * 0.85;
    if (base === 0) return 0;                                  // a wall of monks / a spinning staff still blocks outright
    e.armor -= d * 0.8; e.flexT = 0.28; e.glint = 0.22;
    sparks(b.x, b.y, 3, -sign(b.vx), '#ffe070'); audio.play('ric');
    if (e.armor <= 0) goldCrack(e, 'bullet');
    return 0;
  };
  // fists / blades chip it too (70% damage while plated); explosions crack it at once; he shrugs off knockback
  const _dmg = damageEnemy;
  damageEnemy = function (e, dmg, srcX, explosive, chain) {
    if (e && e.type === 'monk' && !e.dead) {
      if (e.armor === undefined) e.armor = GOLD_ARM;
      if (!(e.crackT > 0) && e.armor > 0) {
        if (explosive) { if (dmg >= 4) goldCrack(e, 'boom'); else e.armor -= dmg * 0.6; }
        else { e.armor -= dmg * 0.35; dmg *= 0.7; e.glint = 0.15; }
        if (e.armor <= 0 && !(e.crackT > 0)) goldCrack(e, 'melee');
      }
      const vx0 = e.vx; _dmg.call(this, e, dmg, srcX, explosive, chain);
      if (!e.dead) { e.vx = vx0 + (e.vx - vx0) * 0.45; e.stun = Math.min(e.stun || 0, 0.3); }
      return;
    }
    return _dmg.call(this, e, dmg, srcX, explosive, chain);
  };
  // draw
  const GF = GOLD_META;
  function goldFrame(e) {
    if (e.dead) return e.deadT < 0.32 ? 'fall' : 'dead';
    if (e.flexT > 0) return 'guard';
    if (e.state === 'wind') return 'wind';
    if (e.state === 'strike') return 'strike';
    if (e.flash > 0.02 || e.stun > 0) return 'hit';
    if (Math.abs(e.vx) > 12 && e.onGround) return 'walk' + (Math.floor(e.anim * 9) % 4);
    if (!e.onGround) return 'walk1';
    return (Math.floor(e.anim * 2.2) % 2) ? 'idle1' : 'idle0';
  }
  function drawGolden(e) {
    const fx = Math.round(e.x + e.w / 2), fy = Math.round(e.y + e.h), n = goldFrame(e), f = GF[n];
    ctx.save(); ctx.translate(fx, fy);
    if (e.dead) ctx.globalAlpha = clamp(1 - (e.deadT - 4.5) / 1.5, 0, 1);
    ctx.scale(e.face, 1);
    const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    const dw = f.w / 2, dh = f.h / 2, dx = -f.ax / 2, dy = -dh + (n.startsWith('walk') && Math.abs(Math.sin(e.anim * 9 * 1.57)) > 0.8 ? -1 : 0);
    ctx.drawImage(GOLD_IM.g, f.x, f.y, f.w, f.h, dx, dy, dw, dh);
    const wear = e.crackT > 0 ? 0.95 : (e.armor !== undefined ? clamp(1 - e.armor / GOLD_ARM, 0, 1) * 0.55 : 0);
    if (wear > 0.02) { ctx.globalAlpha *= wear; ctx.drawImage(GOLD_IM.f, f.x, f.y, f.w, f.h, dx, dy, dw, dh); ctx.globalAlpha = e.dead ? clamp(1 - (e.deadT - 4.5) / 1.5, 0, 1) : 1; }
    if (e.flash > 0 || e.glint > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (e.flash > 0 ? 0.55 : 0.35 * Math.min(1, e.glint / 0.2)); ctx.drawImage(GOLD_IM.g, f.x, f.y, f.w, f.h, dx, dy, dw, dh); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    if (e.form === 'staff' && !e.dead) {                       // staff monks keep their pole
      ctx.save(); ctx.translate(7, -15); ctx.rotate(e.spin ? e.anim * 14 : -1.45); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-14, -1, 28, 2); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-15, -1.5, 3, 3); ctx.fillRect(12, -1.5, 3, 3); ctx.restore();
    }
    ctx.imageSmoothingEnabled = sm; ctx.restore();
  }
  const _de = drawEnemy;
  drawEnemy = function (e) { if (e.type === 'monk' && goldOK() && !e.gibbed) return drawGolden(e); return _de.call(this, e); };
  const _step = step;
  step = function (dt, ip) {
    _step.apply(this, arguments);
    for (const e of G.enemies) {
      if (e.type !== 'monk') continue;
      if (e.flexT > 0) e.flexT -= dt; if (e.glint > 0) e.glint -= dt;
      if (e.crackT > 0 && !e.dead) { e.crackT -= dt; if (Math.random() < dt * 5) part('debris', e.x + e.w / 2 + rnd(-4, 4), e.y + rnd(4, 18), rnd(-30, 30), rnd(-60, 0), rnd(0.5, 0.9), 2, '#ffd23f', { g: 500 }); if (e.crackT <= 0) { e.armor = GOLD_ARM * 0.4; popup(e.x + 2, e.y - 12, 'RE-GILDED', '#ffe9b8', false, 'regild'); } }
    }
    // Pob's entrail tethers
    const T = G.tethers; if (T && T.length) for (let i = T.length - 1; i >= 0; i--) {
      const t = T[i], e = t.e, p = t.p;
      if (e.dead || p.dead || G.player !== p && G.p2 !== p) { T.splice(i, 1); continue; }
      t.t += dt; const dxp = (p.x + p.w / 2) - (e.x + e.w / 2);
      e.stun = Math.max(e.stun || 0, 0.2); e.vx = approach(e.vx, Math.abs(dxp) > 18 ? sign(dxp) * 230 : 0, 1400 * dt);
      if (t.t >= 0.85) {
        T.splice(i, 1);
        const mx = e.x + e.w / 2, my = e.y + e.h * 0.55;
        debris(mx, my, 18, ['#ff9aa8', '#e0607a', '#c0405a', '#8a2a3a'], 1.1); gore(mx, my, 10, 1.1);
        shake(0.22); hitstop(0.07); audio.play('slam'); popup(mx - 14, e.y - 14, 'ENTRAILS!', '#ff7a98', true, 'guts');
        e.gutted = true; damageEnemy(e, e.type === 'heavy' ? 10 : 8, p.x, true); addUlt(p, 12); G.stats.melee++;
      }
    }
  };
  // draw the tethers + the strand left on gutted bodies (world space, drawn with the players)
  function strand(x0, y0, x1, y1, amp, ph) {
    const n = 9; ctx.lineCap = 'round';
    const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x0 + (x1 - x0) * u + Math.sin(u * 9 + ph) * amp * 0.4, y0 + (y1 - y0) * u + Math.sin(u * 7 + ph) * amp * Math.sin(u * 3.14)]); }
    for (const [w, c] of [[4.2, '#6a1a2a'], [2.8, '#d0506a']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); }
    ctx.fillStyle = '#ff9aa8'; for (let i = 1; i < n; i += 2) ctx.fillRect(Math.round(pts[i][0]) - 1, Math.round(pts[i][1]) - 1, 2, 2);
  }
  const _dp = drawPlayer;
  drawPlayer = function (p) {
    _dp.apply(this, arguments);
    if (p !== G.player) return;
    const T = G.tethers; if (T) for (const t of T) { const e = t.e, q = t.p; strand(e.x + e.w / 2, e.y + e.h * 0.55, q.x + q.w / 2 + q.face * 8, q.y + 10, 6 * (1 - Math.min(1, t.t / 0.85)) + 1, G.clock * 14); }
    for (const e of G.enemies) if (e.gutted && e.dead && e.deadT < 6 && onScreen(e, 20)) strand(e.x + e.w / 2, e.y + e.h - 3, e.x + e.w / 2 - (e.face || 1) * 22, e.y + e.h - 1, 2, e.x);
  };
  const _ng = newGame; newGame = function () { _ng.apply(this, arguments); G.tethers = []; };
}
// Pob: the gut lash now hooks the entrails of what it hits and rips them out after a short tug (armoured Golden Men must be cracked first)
function pobPull(p, f) {
  if (f.type === 'monk' && !(f.crackT > 0)) { popup(f.x + 2, f.y - 14, 'ARMOUR!', '#ffd23f', false, 'armr'); audio.play('clang'); return false; }
  if ((G.tethers || []).some(t => t.e === f)) return true;
  (G.tethers = G.tethers || []).push({ e: f, p, t: 0 }); f.stun = Math.max(f.stun || 0, 1.0); return true;
}
