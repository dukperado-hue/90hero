// =====================================================================
// GORE (v21.1): limbs come off. B cycles  18+ GORE -> BLOOD -> OFF.
//   18+ : explosions turn men into pieces, blades cut them in half / take heads, acid leaves a skeleton
//   BLOOD: more blood, the odd arm comes off. OFF: nothing.
// =====================================================================
let GORE = (() => { try { return localStorage.getItem('omr_gore') || '18'; } catch (e) { return '18'; } })();
BLOOD = GORE !== 'off';
const GORE18 = () => BLOOD && GORE === '18';
function cycleGore() {
  GORE = GORE === '18' ? 'on' : GORE === 'on' ? 'off' : '18'; BLOOD = GORE !== 'off';
  try { localStorage.setItem('omr_gore', GORE); } catch (e) { }
  return GORE === '18' ? 'GORE: 18+ (LIMBS, SKELETONS)' : GORE === 'on' ? 'GORE: BLOOD ONLY' : 'GORE: OFF';
}
const BLADE_HEROES = new Set(['sorapong', 'ximen', 'dong', 'ichi', 'ogami', 'michelle', 'li', 'lady']);
const GORE_COL = { soldier: ['#c8302a', '#1e1e26', '#0e0e12'], gunner: ['#26283a', '#1c1d2a', '#c02020'], knife: ['#2a6a8a', '#1a1a22', '#0a0a0a'], bomber: ['#e8e2d0', '#24242c', '#d02020'],
  shield: ['#2a3448', '#1a2030', '#1a2030'], heavy: ['#5a6068', '#3e4248', '#2a2a2a'], monk: ['#e0b030', '#c89020', '#3a2a1a'], crowd: ['#c84a8a', '#3a2a4a', '#1a1010'] };
let KILL_CAUSE = null;                      // set around damage calls that have a special cause (acid)
function killCause(e, explosive) {
  if (KILL_CAUSE) return KILL_CAUSE;
  if (explosive) return 'boom';
  const p = G.player;
  if (p && !p.dead && BLADE_HEROES.has(p.ch) && Math.abs(p.x - e.x) < 80 && Math.abs(p.y - e.y) < 50) return 'blade';
  return 'shot';
}
function gib(kind, x, y, vx, vy, e, extra) {
  const L = G.gibs = G.gibs || []; if (L.length > 160) L.splice(0, L.length - 160);
  const c = GORE_COL[e.type] || GORE_COL.soldier;
  L.push(Object.assign({ kind, x: x - 1.5, y: y - 1.5, w: 3, h: 3, vx, vy, rot: rnd(-0.4, 0.4), vr: rnd(-16, 16), t: 0, life: 14, shirt: c[0], pants: c[1], hair: c[2], bleed: 0.9, bt: 0, face: e.face || 1 }, extra || {}));
}
function fountain(x, y, dur, dir) { (G.fountains = G.fountains || []).push({ x, y, t: 0, dur, dir: dir || 0 }); }
function dismember(e, dir, cause) {
  if (!BLOOD || e.type === 'crowd' && !GORE18()) return;
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2, top = e.y + 2, k = e.type === 'heavy' ? 1.3 : 1, hard = GORE18();
  if (cause === 'acid') {
    if (hard) { e.skel = true; e.skelT = 0; popup(cx, e.y - 8, 'ACID BATH', '#7dff5a'); }
    for (let i = 0; i < 10; i++) part('smoke', cx + rnd(-5, 5), cy + rnd(-8, 8), rnd(-20, 20), rnd(-60, -20), rnd(0.5, 1), 3, i % 2 ? '#7dff5a' : '#c8ffa0', { grow: 6, a: 0.6 });
    return;
  }
  if (cause === 'boom') {
    if (!hard) { if (Math.random() < 0.5) gib('arm', cx, top + 6, dir * rnd(80, 200), -rnd(200, 320), e); return; }
    e.gibbed = true;                                                      // nothing left to lie down
    gib('head', cx, top, dir * rnd(40, 160) + rnd(-40, 40), -rnd(300, 460) * k, e);
    for (let i = 0; i < 2; i++) gib('arm', cx, top + 6, rnd(-220, 220), -rnd(220, 400), e);
    for (let i = 0; i < 2; i++) gib('leg', cx, top + 12, rnd(-180, 180), -rnd(160, 320), e);
    gib('torso', cx, cy, dir * rnd(60, 140), -rnd(160, 260), e);
    for (let i = 0; i < 8 * k; i++) gib('chunk', cx + rnd(-4, 4), cy + rnd(-6, 6), rnd(-260, 260), -rnd(120, 420), e, { life: 9 });
    for (let i = 0; i < 3; i++) gib('bone', cx, cy, rnd(-200, 200), -rnd(200, 380), e, { life: 9 });
    gore(cx, cy, 34, 1.9); bloodScreen(Math.abs(cx - G.player.x) < 70 ? 0.6 : 0.15);
    if (Math.random() < 0.3) popup(cx, e.y - 8, ['SPLAT!', 'CHUNKY!', 'MOP, PLEASE'][(Math.random() * 3) | 0], '#ff5a5a');
    return;
  }
  if (cause === 'blade') {
    if (!hard) { if (Math.random() < 0.4) { gib('arm', cx, top + 6, dir * rnd(80, 180), -rnd(220, 320), e); fountain(cx, top + 6, 0.6, dir); } return; }
    const r = Math.random();
    if (r < 0.4) {                                                         // cut clean in half at the waist
      e.gibbed = true;
      gib('upper', cx, e.y + 6, dir * rnd(80, 160), -rnd(260, 360), e, { w: 6, h: 6, vr: dir * rnd(6, 12) });
      gib('lower', cx, e.y + e.h - 6, dir * rnd(10, 40), -rnd(40, 90), e, { w: 6, h: 6, vr: rnd(-2, 2), stand: 0.7 });
      fountain(cx, e.y + e.h - 9, 1.2, 0); popup(cx, e.y - 8, 'IN HALF!', '#ff3a3a');
    } else if (r < 0.75) {                                                 // off with his head
      e.gibbed = true;
      gib('head', cx, top, dir * rnd(60, 140), -rnd(320, 440), e);
      gib('body', cx, cy, dir * rnd(20, 60), -rnd(60, 120), e, { w: 6, h: 8, vr: dir * rnd(1, 3), stand: 0.9 });
      fountain(cx, top + 4, 1.4, 0); popup(cx, e.y - 8, 'HEADS UP!', '#ff3a3a');
    } else {                                                               // an arm and a leg
      gib('arm', cx, top + 6, dir * rnd(100, 200), -rnd(240, 340), e); gib('leg', cx, top + 12, dir * rnd(60, 140), -rnd(160, 260), e);
      fountain(cx, top + 6, 0.8, dir);
    }
    gore(cx, cy, 18, 1.3);
    return;
  }
  // gunfire: a head shot now and then
  if (hard && Math.random() < 0.12) { for (let i = 0; i < 6; i++) gib('chunk', cx, top, dir * rnd(60, 220), -rnd(80, 260), e, { life: 8 }); gore(cx, top, 10, 1); }
}
function updGibs(dt) {
  if (G.fountains) for (let i = G.fountains.length - 1; i >= 0; i--) {
    const f = G.fountains[i]; f.t += dt; if (f.t > f.dur) { G.fountains.splice(i, 1); continue; }
    if (BLOOD && Math.random() < dt * 60) part('blood', f.x, f.y, f.dir * rnd(20, 90) + rnd(-30, 30), -rnd(120, 260) * (1 - f.t / f.dur * 0.6), rnd(0.5, 1.0), rnd(1, 2) | 0, Math.random() < 0.5 ? '#b01818' : '#7a0c0c', { g: 900 });
  }
  if (!G.gibs) return;
  for (let i = G.gibs.length - 1; i >= 0; i--) {
    const g = G.gibs[i]; g.t += dt;
    if (g.t > g.life) { G.gibs.splice(i, 1); continue; }
    g.vy = Math.min(g.vy + GRAV_E * dt, 700);
    const vx0 = g.vx, vy0 = g.vy; moveBody(g, dt);
    if (g.hitWall) { g.vx = -vx0 * 0.4; if (BLOOD) addDecal(g.hitWall > 0 ? g.x + g.w : g.x, g.y + 1, true); }
    if (g.onGround) {
      if (vy0 > 160) { g.vy = -vy0 * 0.28; if (BLOOD) addDecal(g.x + 1, g.y + g.h, false); if (vy0 > 300 && g.kind !== 'chunk') audio.play('bounce'); }
      g.vx = approach(g.vx, 0, 600 * dt); g.vr = approach(g.vr, 0, 50 * dt);
      if (g.stand) g.rot = approach(g.rot, 0, 6 * dt); else if (Math.abs(g.vr) < 0.5) g.rot = Math.round(g.rot / (Math.PI / 2)) * (Math.PI / 2);
    }
    g.rot += g.vr * dt;
    if (BLOOD && g.kind !== 'bone' && g.t < g.bleed && (Math.abs(g.vx) + Math.abs(g.vy) > 40)) { g.bt -= dt; if (g.bt <= 0) { g.bt = 0.035; part('blood', g.x + 1.5, g.y + 1.5, rnd(-20, 20), rnd(-20, 10), rnd(0.3, 0.6), 1, '#8a1414', { g: 900 }); } }
  }
}
function drawGibs() {
  if (!G.gibs || !BLOOD) return;
  const SK = '#d99a6a', R = '#9a1010', RD = '#5e0a0a';
  for (const g of G.gibs) {
    if (g.x < G.cam.x - 20 || g.x > G.cam.x + VW + 20 || g.y < G.cam.y - 30 || g.y > G.cam.y + VH + 30) continue;
    const a = g.t > g.life - 1.5 ? Math.max(0, (g.life - g.t) / 1.5) : 1;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(Math.round(g.x + g.w / 2), Math.round(g.y + g.h / 2)); ctx.rotate(g.rot); ctx.scale(g.face, 1);
    const f = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    switch (g.kind) {
      case 'head': f(-2.5, -2.5, 5, 5, SK); f(-2.5, -3.5, 5, 2, g.hair); f(0.5, -1, 2, 1, '#050505'); f(-2, 2.5, 4, 1, R); break;
      case 'arm': f(-1, -3, 2, 4, g.shirt); f(-1, 1, 2, 2, SK); f(-1, -4, 2, 1, R); break;
      case 'leg': f(-1, -3, 2, 6, g.pants); f(-1, 3, 3, 1, '#0a0a0a'); f(-1, -4, 2, 1, R); break;
      case 'torso': f(-4, -4, 8, 8, g.shirt); f(-4, -5, 8, 1, R); f(-4, 4, 8, 1, R); f(-5, -3, 1, 2, R); f(4, -3, 1, 2, R); break;
      case 'upper': f(-4, -3, 8, 6, g.shirt); f(-3, -9, 6, 6, SK); f(-4, -10, 7, 2, g.hair); f(0, -7, 3, 1, '#050505'); f(-5, -2, 2, 4, g.shirt); f(-4, 3, 8, 2, R); f(-3, 4, 6, 1, RD); break;
      case 'lower': f(-4, -2, 8, 2, g.pants); f(-4, 0, 3, 6, g.pants); f(1, 0, 3, 6, g.pants); f(-5, 5, 4, 1, '#0a0a0a'); f(1, 5, 4, 1, '#0a0a0a'); f(-4, -3, 8, 1, R); f(-3, -4, 6, 1, RD); break;
      case 'body': f(-4, -8, 8, 8, g.shirt); f(-5, -7, 2, 5, g.shirt); f(-4, 0, 8, 8, g.pants); f(-2, -9, 4, 1, R); f(-1, -10, 2, 1, RD); break;
      case 'chunk': f(-1, -1, 3, 2, g.t % 0.6 < 0.3 ? R : RD); break;
      case 'bone': f(-2, 0, 4, 1, '#e8e4d0'); f(-2, -0.5, 1, 2, '#e8e4d0'); f(1, -0.5, 1, 2, '#e8e4d0'); break;
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
function drawSkeleton(e) {                    // what the acid leaves behind
  const fx = Math.round(e.x + e.w / 2), fy = Math.round(e.y + e.h), B = '#e8e4d0', D = '#a8a490';
  ctx.save(); ctx.translate(fx, fy);
  if (e.deadT > 4.5) ctx.globalAlpha = clamp(1 - (e.deadT - 4.5) / 1.5, 0, 1);
  const lie = Math.min(1, (e.skelT || 0) / 0.6); ctx.rotate(-e.face * lie * 1.5); ctx.scale(e.face || 1, 1);
  const f = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  f(-2, -8, 1, 8, B); f(1, -8, 1, 8, B); f(-3, -1, 2, 1, B); f(1, -1, 2, 1, B);            // legs
  f(-3, -10, 6, 2, B);                                                                        // pelvis
  f(-0.5, -17, 1, 7, D);                                                                      // spine
  for (let i = 0; i < 3; i++) f(-3, -16 + i * 2, 6, 1, B);                                    // ribs
  f(-4, -16, 1, 5, B); f(3, -16, 1, 5, B);                                                     // arms
  f(-3, -23, 6, 5, B); f(-2, -21, 1, 1, '#000'); f(1, -21, 1, 1, '#000'); f(-1, -19, 3, 1, D);   // skull
  ctx.restore(); ctx.globalAlpha = 1;
  e.skelT = (e.skelT || 0) + 1 / 60;
  if (e.skelT < 1.5 && Math.random() < 0.5) part('smoke', fx + rnd(-4, 4), fy - rnd(2, 20), rnd(-10, 10), rnd(-40, -10), rnd(0.4, 0.8), 2, Math.random() < 0.5 ? '#7dff5a' : '#d0ffb0', { grow: 4, a: 0.6 });
}
