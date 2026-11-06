// =====================================================================
// v30: AUNTIE AJUMMA (อาจุมม่า) — a Korean market auntie on a slow "inheritance-rush" mobility scooter.
// Slow but tanky (the quilted vest shrugs off ~1 in 3 hits). Costume + invented face only.
//   J   UMBRELLA 3-hit combo (whack, whack, big overhead swing)     S+J  scooter horn bump
//   K   KIMCHI TOSS: lobbed jar, splats, leaves a stinking cloud that stuns + hurts
//   L   AJUMMA RUSH: she floors the scooter, a crowd of visor-wearing aunties charges behind her
// State in p.n5: a = kimchi cd, b = bump cd, kim = live kimchi, cloud = stink clouds, rush = ult timer
// =====================================================================
NEW5.add('ajumma');
function updAjumma(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt;
  s.kim = s.kim || []; s.cloud = s.cloud || [];
  for (const k of s.kim) {                                  // thrown kimchi: arc, splat on contact / floor
    k.t += dt; k.vy += 520 * dt; k.x += k.vx * dt; k.y += k.vy * dt; let hit = k.t > 1.4 || solidPx(k.x, k.y);
    if (!hit) for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - k.x) < e.w / 2 + 5 && Math.abs(e.y + e.h / 2 - k.y) < e.h / 2 + 5) { hit = true; break; }
    const b = G.boss; if (!hit && b && !b.dead && b.dying <= 0 && b.state !== 'enter' && k.x > b.x && k.x < b.x + b.w && k.y > b.y && k.y < b.y + b.h) hit = true;
    if (hit) {
      k.dead = true; audio.play('punch'); shake(0.1); popup(k.x - 6, k.y - 14, 'KIMCHI!', '#ff4a2a');
      for (let i = 0; i < 12; i++) part('spark', k.x, k.y, rnd(-140, 140), rnd(-180, -20), rnd(0.25, 0.5), 2, i % 3 ? '#e02a1a' : '#ffb04a');
      for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - k.x) < 30 && Math.abs(e.y + e.h / 2 - k.y) < 28) { damageEnemy(e, 2.8, k.x, false); if (!e.dead) e.stun = Math.max(e.stun || 0, 1.0); }
      if (b && !b.dead && b.dying <= 0 && Math.abs(b.x + b.w / 2 - k.x) < b.w / 2 + 28) damageBoss(3, k.x);
      s.cloud.push({ x: k.x, y: Math.min(k.y, p.y + p.h), t: 2.2, tick: 0 }); addUlt(p, 5); G.stats.melee++;
    }
  }
  s.kim = s.kim.filter(k => !k.dead);
  for (const c of s.cloud) {                                // stink cloud: periodic damage + stun, green-red puffs
    c.t -= dt; c.tick -= dt; if (Math.random() < dt * 14) part('smoke', c.x + rnd(-22, 22), c.y - rnd(0, 14), rnd(-8, 8), -rnd(10, 30), 0.8, 4, Math.random() < 0.5 ? '#9ab04a' : '#c85a3a', { grow: 6, a: 0.45 });
    if (c.tick <= 0) { c.tick = 0.4; for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - c.x) < 28 && Math.abs(e.y + e.h - c.y - 6) < 30) { damageEnemy(e, 0.7, c.x, false); if (!e.dead) e.stun = Math.max(e.stun || 0, 0.5); } }
  }
  s.cloud = s.cloud.filter(c => c.t > 0);
  if (s.rush > 0) {                                         // L: floor it
    s.rush -= dt; p.vx = p.face * 290; p.inv = Math.max(p.inv, 0.1); p.swingT = 0.1; p.swingK = 'fly'; p.driveT = 1;
    for (const e of G.enemies) if (!e.dead && !e.para && !s.rushHit.has(e) && overlap({ x: p.x - 10, y: p.y - 6, w: p.w + 20, h: p.h + 8 }, e)) {
      s.rushHit.add(e); damageEnemy(e, 4.2, p.x, true); if (!e.dead) { e.vx = p.face * 400; e.vy = -260; e.fling = 0.5; e.stun = 0.9; } audio.play('punch'); hitstop(0.04); popup(e.x + 4, e.y - 8, 'AIGOO!', '#ff9ad0');
    }
    const b = G.boss; if (b && !b.dead && b.dying <= 0 && !s.rushHit.has(b) && overlap(p, b)) { s.rushHit.add(b); damageBoss(8, p.x); }
    if (ip.jump && p.onGround) { p.vy = -500; p.onGround = false; }
    if (p.hitWall) s.rush = 0;
    if (Math.random() < dt * 30) dust(p.x + p.w / 2 - p.face * 6, p.y + p.h, 1, 4);
  } else p.driveT = 0;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.rush > 0) return;
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (held('down') && s.b <= 0) {                         // S+J: horn bump
      s.b = 0.7; p.atkCd = 0.4; p.swingT = 0.2; p.swingK = 'kick';
      meleeSwing(p, { dmg: 2.2, reach: 30, y0: -16, y1: 0, launch: true }); popup(p.x + 4, p.y - 14, 'BEEP!', '#ffd23f'); audio.play('slam');
    } else {                                                // J: umbrella whack x3
      p.combo = ((p.combo || 0) + 1) % 3; p.atkCd = p.combo === 2 ? 0.34 : 0.2; p.swingT = 0.14; p.swingK = p.combo === 2 ? 'bigkick' : 'slash';
      const hit = meleeSwing(p, { dmg: p.combo === 2 ? 3.6 : 2.0, reach: p.combo === 2 ? 34 : 28, y0: -26, y1: 0, launch: p.combo === 2 });
      if (hit) { addUlt(p, 4); G.stats.melee++; }
    }
  }
  if (ip.bomb && s.a <= 0) {                                // K: kimchi toss
    s.a = 0.6; p.swingT = 0.18; p.swingK = 'punch'; audio.play('whoosh');
    s.kim.push({ x: p.x + p.w / 2 + p.face * 8, y: p.y + 4, vx: p.face * 250 + p.vx * 0.3, vy: -170, t: 0 });
  }
}
// ajumma-specific tankiness: the quilted vest shrugs off some hits
{
  const _h = hurtPlayer;
  hurtPlayer = function (n, srcX, contact) {
    const p = G.player;
    if (p && p.ch === 'ajumma' && !p.dead && p.inv <= 0 && Math.random() < 0.33) { popup(p.x + 2, p.y - 14, 'HA! 괜찮아', '#ff9ad0'); audio.play('clang'); p.inv = 0.3; return; }
    return _h(n, srcX, contact);
  };
}
function drawAjummaFx(p) {                                  // kimchi in flight, stink clouds, the rush crowd
  const s = p.n5; if (!s) return;
  if (s.cloud) for (const c of s.cloud) { ctx.save(); ctx.globalAlpha = Math.min(0.3, c.t * 0.25); ctx.fillStyle = '#9ab04a'; ctx.beginPath(); ctx.arc(c.x, c.y - 6, 26, 0, 6.283); ctx.fill(); ctx.restore(); }
  if (s.kim) for (const k of s.kim) { ctx.save(); ctx.translate(Math.round(k.x), Math.round(k.y)); ctx.rotate(k.t * 12); ctx.fillStyle = '#7a1008'; ctx.fillRect(-5, -4, 10, 8); ctx.fillStyle = '#e02a1a'; ctx.fillRect(-4, -3, 8, 6); ctx.fillStyle = '#ffd0a0'; ctx.fillRect(-3, -2, 3, 2); ctx.fillStyle = '#5ab04a'; ctx.fillRect(1, 0, 3, 2); ctx.restore(); }
  if (s.rush > 0) {                                         // a crowd of aunties in visors charging behind
    const f = p.face, cx = Math.round(p.x + p.w / 2), gy = Math.round(p.y + p.h);
    for (let i = 1; i <= 5; i++) {
      const x = cx - f * (16 + i * 13), bob = Math.round(Math.abs(Math.sin(G.clock * 16 + i)) * 2), y = gy - bob;
      ctx.fillStyle = '#000'; ctx.fillRect(x - 3, y - 15, 7, 15);
      ctx.fillStyle = ['#d8508a', '#5a8ad0', '#e8b030', '#6ab05a', '#b060c8'][i - 1]; ctx.fillRect(x - 2, y - 13, 5, 10);
      ctx.fillStyle = '#e8c8a0'; ctx.fillRect(x - 2, y - 18, 5, 5);
      ctx.fillStyle = '#ff7ab8'; ctx.fillRect(x - 4 + (f > 0 ? 0 : 1), y - 20, 9, 3);
      ctx.fillStyle = '#222'; ctx.fillRect(x - 1, y - 3, 2, 3);
    }
  }
}
function drawAjumma(p) {                                    // pixel fallback (used only if the sprite atlas is missing)
  const SK = '#e8c8a0', PK = '#ff7ab8';
  drawFighterBase(p, {
    SK, TOP: '#3a5aa0', TOP2: '#2a4078', PNT: '#222', SHOE: '#111', SLEEVE: '#3a5aa0',
    body() { px(-5, -17, 10, 9, '#3a5aa0'); px(-5, -17, 1, 9, '#2a4078'); px(-3, -9, 6, 2, '#ddd'); },
    head() { px(-3, -23, 6, 6, SK); px(-5, -25, 10, 3, PK); px(-4, -22, 2, 4, '#2a1a14'); px(1, -21, 1, 1, '#000'); px(0, -19, 3, 1, '#c02a2a'); },
    arms() { px(-6, -16, 2, 5, '#3a5aa0'); px(2, -17, 3, 2, '#3a5aa0'); px(4, -18, 2, 3, SK); }
  });
  drawAjummaFx(p);
}
