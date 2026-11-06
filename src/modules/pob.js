// =====================================================================
// v30: AUNTIE POB (ปอบ) — the ghost auntie who pulls her own insides out and uses them as a whip.
// Cartoon-style only: the "guts" are a pink-red sausage-link rope, the liver a maroon blob, the heart a pulsing red heart. No gore detail.
//   J      claw swipes (3-hit)           S+J  GRAB (หยิบ) and slam
//   K      ORGAN WHIP, rotating: GUT (pulls the foe to her) -> LIVER (slaps far) -> HEART (lobbed, beats, bursts)
//   L      ORGAN FEAST: a spinning ring of entrails around her
// State in p.n5 (shared with the other new heroes): a = whip cd, b = grab cd, c = organ rotation, whip = visual, hearts = live hearts, feast = ult timer
// =====================================================================
NEW5.add('pob');
function pobFoe(p, reach) {                              // nearest foe in front inside `reach`, any height near her
  const cx = p.x + p.w / 2; let best = null, bd = 1e9;
  for (const e of G.enemies) { if (e.dead || e.para) continue; const dx = (e.x + e.w / 2 - cx) * p.face; if (dx > -4 && dx < reach && Math.abs(e.y + e.h - (p.y + p.h)) < 30 && dx < bd) { bd = dx; best = e; } }
  return best;
}
function updPob(p, dt, ip) {
  const s = n5(p); p.atkCd -= dt; p.swingT -= dt; s.a -= dt; s.b -= dt;
  if (s.whip) { s.whip.t -= dt; if (s.whip.t <= 0) s.whip = null; }
  if (s.hearts) for (const h of s.hearts) {              // thrown hearts: fly, land, beat three times, burst
    h.t += dt; if (h.t < 0.35) { h.x += h.vx * dt; h.y += h.vy * dt; h.vy += 500 * dt; if (h.y > h.gy) { h.y = h.gy; h.vy = 0; h.vx *= 0.3; } } else h.vx = 0;
    if (!h.boom && h.t > 0.35 + 0.66) {
      h.boom = true; const q = { x: h.x - 3, y: h.y - 3, w: 6, h: 6 };
      for (const e of G.enemies) if (!e.dead && !e.para && Math.abs(e.x + e.w / 2 - h.x) < 46 && Math.abs(e.y + e.h / 2 - h.y) < 36) { damageEnemy(e, 4.2, h.x, true); if (!e.dead) { e.vx = (sign(e.x + e.w / 2 - h.x) || 1) * 260; e.vy = -220; e.stun = 0.7; } }
      const b = G.boss; if (b && !b.dead && b.dying <= 0 && b.state !== 'enter' && Math.abs(b.x + b.w / 2 - h.x) < 46 + b.w / 2) damageBoss(5, h.x);
      shake(0.25); hitstop(0.05); audio.play('slam'); popup(h.x - 8, h.y - 14, 'BA-DUMP!', '#ff4a6a'); for (let i = 0; i < 12; i++) part('spark', h.x, h.y, rnd(-160, 160), rnd(-200, -20), rnd(0.3, 0.6), 2, i % 2 ? '#ff4a6a' : '#ffb0c0'); G.stats.melee++;
    }
  }
  if (s.hearts) s.hearts = s.hearts.filter(h => !h.boom);
  if (s.feast > 0) {                                     // L: the feast ring
    s.feast -= dt; s.tick = (s.tick || 0) - dt; p.inv = Math.max(p.inv, 0.1); p.swingT = 0.1; p.swingK = 'arms';
    if (s.tick <= 0) { s.tick = 0.25; aoeHit(p, 66, 2.4, { launch: true, kb: 200, lift: 170, stun: 0.5, bossDmg: 2.2 }); audio.play('whoosh'); shake(0.12); }
  }
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (s.feast > 0) return;
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (held('down') && s.b <= 0) {                      // S+J: GRAB (หยิบ) — pick one up and slam it down
      s.b = 0.8; p.atkCd = 0.42; p.swingT = 0.22; p.swingK = 'slash';
      const f = pobFoe(p, 26);
      if (f) { damageEnemy(f, 3.4, p.x, true); if (!f.dead) { f.vx = p.face * 80; f.vy = -330; f.stun = 0.9; f.fling = 0.3; } popup(p.x + 4, p.y - 14, 'GRAB!', '#9ad0a0'); addUlt(p, 7); audio.play('slam'); hitstop(0.05); shake(0.15); G.stats.melee++; }
    } else {                                             // J: claw, claw, big claw
      p.combo = ((p.combo || 0) + 1) % 3; p.atkCd = p.combo === 2 ? 0.28 : 0.15; p.swingT = 0.12; p.swingK = p.combo === 2 ? 'bigkick' : 'slash';
      const hit = meleeSwing(p, { dmg: p.combo === 2 ? 3.0 : 1.9, reach: p.combo === 2 ? 28 : 24, y0: -20, y1: 0, launch: p.combo === 2 });
      if (hit) { addUlt(p, 4); G.stats.melee++; }
    }
  }
  if (ip.bomb && s.a <= 0) {                             // K: the organ whip, rotating
    const k = (s.c = ((s.c || 0) + 1)) % 3, cx = p.x + p.w / 2, cy = p.y + 10; audio.play('whoosh'); p.swingT = 0.2; p.swingK = 'punch'; s.a = 0.7;
    if (k === 1) {                                       // GUT: long lash, drags the foe to her feet
      const f = pobFoe(p, 120); s.whip = { t: 0.28, kind: 'gut', len: f ? Math.abs(f.x + f.w / 2 - cx) : 90 };
      if (f) { damageEnemy(f, 2.4, p.x, false); if (!f.dead) { if (pobPull(p, f)) { f.stun = 1.0; } else { f.vx = -p.face * 400; f.stun = 0.7; } } popup(p.x + 4, p.y - 14, 'PULL!', '#ff9aa8'); addUlt(p, 6); audio.play('punch'); G.stats.melee++; }
    } else if (k === 2) {                                // LIVER: a wet slap with long reach
      s.whip = { t: 0.3, kind: 'liver', len: 70 };
      let hit = 0; for (const e of G.enemies) if (!e.dead && !e.para) { const dx = (e.x + e.w / 2 - cx) * p.face; if (dx > -2 && dx < 76 && Math.abs(e.y + e.h - (p.y + p.h)) < 30) { damageEnemy(e, 3.0, p.x, true); if (!e.dead) { e.vx = p.face * 300; e.vy = -140; e.stun = 0.5; } hit++; } }
      const b = G.boss; if (b && !b.dead && b.dying <= 0 && b.state !== 'enter' && (b.x + b.w / 2 - cx) * p.face > -2 && (b.x + b.w / 2 - cx) * p.face < 76 + b.w / 2) { damageBoss(3, p.x); hit++; }
      if (hit) { popup(p.x + 4, p.y - 14, 'SPLAT!', '#c0405a'); addUlt(p, 6); audio.play('punch'); hitstop(0.04); G.stats.melee++; }
    } else {                                             // HEART: lobbed, lands, beats, bursts
      (s.hearts = s.hearts || []).push({ x: cx + p.face * 8, y: p.y + 6, vx: p.face * 210, vy: -190, gy: p.y + p.h - 4, t: 0 }); s.whip = { t: 0.18, kind: 'heart', len: 14 }; popup(p.x + 4, p.y - 14, 'HEART!', '#ff4a6a');
    }
  }
}
function drawPobFx(p) {                                  // the whip / organs / hearts, drawn in world space (call after the hero sprite)
  const s = p.n5; if (!s) return; const cx = Math.round(p.x + p.w / 2), cy = Math.round(p.y + 12);
  if (s.whip) {
    const w = s.whip, L = Math.round(w.len * Math.min(1, (0.32 - w.t) / 0.1 + 0.2)), f = p.face;
    if (w.kind === 'gut') {                              // a rope of pink sausage links
      for (let i = 0; i < L; i += 5) { const y = cy + Math.round(Math.sin(i * 0.35 + G.clock * 30) * 2); ctx.fillStyle = '#5a1020'; ctx.fillRect(cx + f * (8 + i) - 3 * (f < 0 ? 1 : 0) - 1, y - 2, 6, 5); ctx.fillStyle = i % 10 ? '#ff7a96' : '#ffa0b4'; ctx.fillRect(cx + f * (8 + i) - 3 * (f < 0 ? 1 : 0), y - 1, 4, 3); }
    } else if (w.kind === 'liver') {                     // maroon blob swung out on a strand
      const x = cx + f * (10 + L * 0.9); ctx.fillStyle = '#4a1020'; ctx.fillRect(cx + f * 8 - (f < 0 ? 62 * 0 : 0), cy, 1, 1);
      for (let i = 0; i < L * 0.9; i += 6) { ctx.fillStyle = '#ff7a96'; ctx.fillRect(cx + f * (8 + i), cy - 1, 4, 3); }
      ctx.fillStyle = '#2a0810'; ctx.fillRect(x - 7, cy - 6, 15, 12); ctx.fillStyle = '#a02848'; ctx.fillRect(x - 6, cy - 5, 13, 10); ctx.fillStyle = '#d04a6a'; ctx.fillRect(x - 4, cy - 4, 5, 3);
    }
  }
  if (s.hearts) for (const h of s.hearts) {
    const beat = h.t > 0.35 ? 1 + 0.35 * Math.abs(Math.sin((h.t - 0.35) * 14)) : 1, x = Math.round(h.x), y = Math.round(h.y), r = Math.round(5 * beat);
    ctx.fillStyle = '#2a0810'; ctx.fillRect(x - r - 1, y - r, r * 2 + 2, r + 2); ctx.fillRect(x - r + 1, y + 1, r * 2 - 2, r - 1); ctx.fillRect(x - 1, y + r, 3, 2);
    ctx.fillStyle = '#ff2a4a'; ctx.fillRect(x - r, y - r + 1, r - 1, r); ctx.fillRect(x + 2, y - r + 1, r - 1, r); ctx.fillRect(x - r + 1, y + 1, r * 2 - 2, r - 2); ctx.fillRect(x - 1, y + r - 2, 3, 2); ctx.fillStyle = '#ffc0cc'; ctx.fillRect(x - r + 1, y - r + 2, 2, 2);
    if (h.t > 0.35) { ctx.globalAlpha = 0.5 * Math.abs(Math.sin((h.t - 0.35) * 14)); ctx.strokeStyle = '#ff4a6a'; ctx.beginPath(); ctx.arc(x, y, 10 + (h.t - 0.35) * 30, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  if (s.feast > 0) {                                     // the ring of entrails
    const a0 = G.clock * 9; for (let k = 0; k < 14; k++) { const a = a0 + k * 0.45, r = 26 + Math.sin(a0 + k) * 5; ctx.fillStyle = k % 2 ? '#ff7a96' : '#c0405a'; ctx.fillRect(Math.round(cx + Math.cos(a) * r) - 2, Math.round(p.y + p.h / 2 + Math.sin(a) * r * 0.55) - 2, 5, 5); }
  }
}
function drawPob(p) {                                    // pixel fallback (used only if the Gemini sprite atlas is missing)
  const SK = '#d8a878', SH = '#7a9a86', SH2 = '#587264';
  drawFighterBase(p, {
    SK, TOP: SH, TOP2: SH2, PNT: '#3a3a30', SHOE: '#1a1a1a', SLEEVE: SH,
    body() { px(-5, -17, 10, 9, SH); px(-5, -17, 1, 9, SH2); px(-1, -16, 2, 7, '#6a5a2a'); },
    head() { px(-3, -23, 6, 6, SK); px(-4, -24, 8, 3, '#1a1410'); px(-4, -21, 2, 4, '#1a1410'); px(2, -21, 2, 4, '#1a1410'); px(1, -21, 1, 1, '#000'); px(0, -19, 3, 1, '#a02a2a'); },
    arms() { px(-6, -16, 2, 5, SH); px(2, -17, 3, 2, SH); px(4, -18, 2, 3, SK); }
  });
  drawPobFx(p);
}
