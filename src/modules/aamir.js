// =====================================================================
// v23: CHACHA PERFECT — young-Aamir parody (street boxer · racing bicycle · the train dare)
// and BOLLYWOOD PHYSICS for every Indian hero: THAAP!, long hang-time kicks, one punch = through the wall, slow-mo.
// =====================================================================
const BOLLY = new Set(['chiru', 'vijay', 'ram', 'singham', 'srk', 'rajini', 'aamir']);
function bollyHit(p, e, o, killed) {           // every melee connect from an Indian hero
  const big = o.launch || killed;
  popup(e.x + e.w / 2 + rnd(-6, 6), e.y - 4, big ? ['THAAP!', 'DHISHOOM!', 'ตั๊บ!!', 'DHAN!'][(Math.random() * 4) | 0] : (Math.random() < 0.5 ? 'TAK!' : 'ตั๊บ!'), big ? '#ffd23f' : '#ffffff', big);
  audio.play('punch'); if (big) { audio.play('slam'); shake(0.18); hitstop(0.07); } else hitstop(0.03);
  for (let i = 0; i < (big ? 10 : 4); i++) part('smoke', e.x + e.w / 2, e.y + 8, rnd(-80, 80), rnd(-90, 10), rnd(0.4, 0.8), 2, HOLI[(Math.random() * 5) | 0], { grow: 5, a: 0.7 });   // colour dust, not fire
  if (big) {                                    // one punch: he leaves through the wall
    e.vx = p.face * (e.type === 'heavy' ? 520 : 760); e.vy = -rnd(160, 260); e.vr = p.face * 18; e.fling = 0.9; e.missile = 0.6; e.missileDir = p.face;
    if (!(G.bollySlowT > G.time)) { G.bollySlowT = G.time + 5; G.timeScale = 0.35; G.slowT = 0.35; }   // the slow-motion beat (not every hit)
  }
}
function flingSmash(e, dt) {                    // a flung body smashes anything breakable in its way
  if (!(e.fling > 0)) return;
  e.fling -= dt;
  if (Math.abs(e.vx) < 150) { e.fling = 0; return; }
  const fx = e.vx > 0 ? e.x + e.w + e.vx * dt : e.x + e.vx * dt, tx = Math.floor(fx / TS);
  let smashed = false;
  for (let ty = Math.floor(e.y / TS); ty <= Math.floor((e.y + e.h - 1) / TS); ty++) if (DESTRUCT[tileAt(tx, ty)]) { damageTile(tx, ty, 99); smashed = true; }
  if (smashed) { e.vx *= 0.92; e.hitWall = 0; shake(0.12); if (!e.thruWall) { e.thruWall = true; popup(e.x + e.w / 2, e.y - 8, 'THROUGH THE WALL!', '#ffd23f'); audio.play('crate'); } }
}
function bollyHang(p, dt) {                     // flying kicks hang in the air like the film is paused
  if (p.onGround) { p.hangUsed = 0; return; }
  const k = p.swingT > 0 ? p.swingK : '';
  if ((k === 'kick' || k === 'bigkick' || k === 'fly' || k === 'spin') && (p.hangUsed || 0) < 0.5) {
    p.hangUsed = (p.hangUsed || 0) + dt; if (p.vy > -20) p.vy = Math.min(p.vy, 25);
    if (Math.random() < dt * 30) part('smoke', p.x + p.w / 2, p.y + p.h, rnd(-10, 10), 10, 0.3, 1, '#ffffff', { grow: 3, a: 0.4 });
  }
}
// ---------------- the hero ----------------
function updAamir(p, dt, ip) {
  p.atkCd = (p.atkCd || 0) - dt; p.swingT -= dt; p.bikeCd = (p.bikeCd || 0) - dt; p.hayCd = (p.hayCd || 0) - dt;
  if (p.bikeT > 0) {                            // K: the racing bicycle (Jo Jeeta Wohi Sikandar)
    p.bikeT -= dt; p.vx = p.face * 400;
    for (const e of G.enemies) if (!e.dead && !e.para && !p.bikeHit.has(e) && overlap({ x: p.x - 6, y: p.y, w: p.w + 12, h: p.h }, e)) {
      p.bikeHit.add(e); damageEnemy(e, 3, p.x, true); if (!e.dead) { e.vx = p.face * 420; e.vy = -280; e.fling = 0.5; e.stun = 0.8; }
      addUlt(p, 5); bollyHit(p, e, { launch: true }, e.dead);
    }
    const b = G.boss; if (b && !b.dead && b.dying <= 0 && !p.bikeHit.has(b) && overlap(p, b)) { p.bikeHit.add(b); damageBoss(5, p.x); p.bikeT = 0; p.vx = -p.face * 200; }
    if (ip.jump && p.onGround) { p.vy = -560; p.onGround = false; popup(p.x + 5, p.y - 14, 'BUNNY HOP!', '#7ae8ff'); }
    if (p.hitWall) { p.bikeT = 0; shake(0.15); }
    if (Math.random() < dt * 20) dust(p.x + p.w / 2 - p.face * 6, p.y + p.h, 1, 4);
  }
  if (p.trainRunT > 0) {                        // the dare: run straight at the train, jump at the last moment
    p.trainRunT -= dt; p.vx = p.face * 260;
    const T = G.train; if (T && !p.dared && Math.abs(T.x - (p.x + p.w / 2)) < 70) { p.dared = true; p.vy = -620; p.onGround = false; p.swingT = 0.6; p.swingK = 'fly'; G.timeScale = 0.25; G.slowT = 0.6; popup(p.x + 5, p.y - 24, 'NOW!', '#ffffff', true); }
  }
  p.driveT = (p.bikeT > 0 || p.trainRunT > 0) ? 1 : 0;
  moveRunner(p, dt, ip);
  if (ip.ult) tryUltimate(p);
  if (p.bikeT > 0 || p.trainRunT > 0) return;
  if ((held('shoot') || ip.shoot) && p.atkCd <= 0) {
    if (held('down') && p.hayCd <= 0) {          // S+J: the haymaker — one punch, through the wall
      p.hayCd = 1.2; p.atkCd = 0.45; p.swingT = 0.3; p.swingK = 'punch';
      later(0.12, () => { if (!p.dead) { const hit = meleeSwing(p, { dmg: 6, reach: 26, y0: -22, y1: -2, launch: true, tile: 3 }); if (hit) addUlt(p, 8); } });
      popup(p.x + 5, p.y - 16, 'HAYMAKER!', '#4aa0ff');
    } else {                                      // J: jab, jab, hook
      p.atkCd = 0.17; p.combo = ((p.combo || 0) + 1) % 3; p.swingT = 0.12; p.swingK = p.combo === 2 ? 'hook' : 'punch';
      const hit = meleeSwing(p, { dmg: p.combo === 2 ? 2.6 : 1.4, reach: p.combo === 2 ? 22 : 20, y0: -20, y1: -6, launch: p.combo === 2 });
      if (hit) addUlt(p, 4);
    }
  }
  if (ip.bomb && p.bikeCd <= 0) { p.bikeCd = 3.2; p.bikeT = 0.75; p.bikeHit = new Set(); audio.play('whoosh'); popup(p.x + 5, p.y - 16, 'RACE!', '#7ae8ff'); }
  else if (ip.bomb) popup(p.x + 5, p.y - 14, 'CHAIN SLIPPED…', '#8a8a8a');
}
function startTrain(p) {                         // L: THE TRAIN DARE (Ghulam)
  const dir = p.face, sx = dir > 0 ? G.cam.x + VW + 120 : G.cam.x - 120, gy = groundBelow(p.x + p.w / 2, p.y) ;
  G.train = { x: sx, y: gy, dir: -dir, t: 0, hit: new Set(), cars: 4 };
  p.trainRunT = 1.6; p.dared = false; p.inv = 2.6;
  G.banner = { t: 0, title: 'THE TRAIN DARE', sub: 'HE RUNS AT THE 6:15 EXPRESS. IT BLINKS FIRST.' };
  audio.play('roar'); later(0.1, () => audio.play('rev'));
}
function updTrain(dt) {
  const T = G.train; if (!T) return;
  T.t += dt; T.x += T.dir * 720 * dt;
  const len = 60 + T.cars * 52, x0 = T.dir < 0 ? T.x : T.x - len, x1 = T.dir < 0 ? T.x + len : T.x, box = { x: x0, y: T.y - 30, w: x1 - x0, h: 30 };
  for (const e of G.enemies) if (!e.dead && !T.hit.has(e) && overlap(box, e)) { T.hit.add(e); damageEnemy(e, 14, T.x, true); e.vx = T.dir * 700; e.vy = -300; e.fling = 0.6; }
  const b = G.boss; if (b && !b.dead && b.dying <= 0 && !T.hit.has(b) && overlap(box, b)) { T.hit.add(b); damageBoss(25, T.x); }
  for (const br of G.barrels) if (!br.dead && overlap(box, br) && br.lit < 0) { br.lit = 0.05; br.chain = ++G.chainSeq; }
  const ftx = Math.floor((T.dir < 0 ? x0 : x1) / TS), gr = Math.round(T.y / TS);
  for (let ty = gr - 2; ty < gr; ty++) if (DESTRUCT[tileAt(ftx, ty)]) damageTile(ftx, ty, 99);
  if (Math.random() < dt * 30) dust(T.x, T.y, 2, 8);
  shake(dt * 1.2);
  if ((T.dir < 0 && x1 < G.cam.x - 40) || (T.dir > 0 && x0 > G.cam.x + VW + 40)) G.train = null;
}
function drawTrain() {
  const T = G.train; if (!T) return;
  ctx.save(); ctx.translate(Math.round(T.x), Math.round(T.y)); ctx.scale(-T.dir, 1);          // drawn facing +x, then mirrored to its heading
  const f = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // locomotive (nose at x=0, body behind it)
  f(-60, -28, 56, 22, '#2a4a8a'); f(-60, -28, 56, 3, '#5a7ac8'); f(-8, -24, 8, 18, '#2a4a8a'); f(-4, -22, 4, 6, '#ffe08a');
  f(-56, -24, 10, 7, '#9ad0ff'); f(-60, -14, 56, 3, '#e8c040'); f(-62, -6, 62, 4, '#1a1a20');
  for (let i = 0; i < 4; i++) f(-56 + i * 14, -4, 8, 4, '#3a3a40');
  f(-50, -34, 6, 6, '#3a3a40'); if (Math.floor(G.clock * 10) % 2) { ctx.fillStyle = 'rgba(255,240,180,0.35)'; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(60, -34); ctx.lineTo(60, -6); ctx.fill(); }
  for (let c = 0; c < T.cars; c++) { const cx = -64 - (c + 1) * 52; f(cx, -26, 48, 20, c % 2 ? '#8a2a2a' : '#2a6a4a'); f(cx, -26, 48, 2, '#d8d0b0'); for (let w = 0; w < 4; w++) f(cx + 4 + w * 11, -22, 7, 6, '#ffe8a8'); f(cx, -6, 48, 4, '#1a1a20'); f(cx + 6, -4, 8, 4, '#3a3a40'); f(cx + 34, -4, 8, 4, '#3a3a40'); }
  ctx.restore();
}
function drawAamir(p) {
  const SK = '#c8865a', DJ = '#3a6ab0', DJ2 = '#4a80c8', TEE = '#f0f0ea', JN = '#2a3a5a', HR = '#120c0a';
  if (p.bikeT > 0 && !p.dead) {                 // the racing bike under him
    const fx = Math.round(p.x + p.w / 2), fy = Math.round(p.y + p.h), sp = G.clock * 30;
    ctx.save(); ctx.translate(fx, fy); ctx.scale(p.face, 1);
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1;
    for (const wx of [-8, 8]) { ctx.beginPath(); ctx.arc(wx, -5, 5, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(wx + Math.cos(sp) * 5, -5 + Math.sin(sp) * 5); ctx.lineTo(wx - Math.cos(sp) * 5, -5 - Math.sin(sp) * 5); ctx.stroke(); }
    ctx.fillStyle = '#e83a3a'; ctx.fillRect(-8, -6, 16, 1); ctx.fillRect(-2, -12, 1, 7); ctx.fillRect(6, -12, 1, 7); ctx.fillRect(-4, -13, 5, 1); ctx.fillRect(5, -13, 4, 1);
    ctx.restore();
  }
  drawFighterBase(p, {
    SK, TOP: DJ, TOP2: DJ2, PNT: JN, SHOE: '#e8e8e8', SLEEVE: DJ,
    body() { px(-4, -17, 8, 12, DJ); px(-1, -17, 3, 10, TEE); px(-4, -17, 1, 12, DJ2); px(3, -17, 1, 12, DJ2); },   // denim jacket, white tee
    head() { px(-3, -23, 6, 6, SK); px(-4, -26, 7, 3, HR); px(-4, -25, 3, 3, HR); px(2, -25, 2, 1, HR); px(1, -21, 1, 1, '#000'); px(0, -19, 3, 1, '#7a3a2a'); },  // side parting, boyish grin
    arms() {
      const k = p.swingT > 0 ? p.swingK : '';
      if (k === 'hook') { px(-1, -17, 7, 2, DJ); px(5, -19, 3, 3, SK); }
      else if (p.bikeT > 0) { px(1, -14, 7, 2, DJ); px(7, -14, 2, 2, SK); }
      else { px(-5, -16, 2, 6, DJ); px(3, -16, 2, 4, DJ); px(3, -13, 3, 2, SK); px(-5, -10, 2, 2, SK); }   // guard up: a boxer
    }
  });
}
