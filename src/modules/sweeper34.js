// v34 BOSS — 掃地僧 THE SWEEPING MONK (stage 02 finale). A parody of the legendary old sweeper-monk of the wuxia novels:
// absurdly strong, absurdly fast, and mostly just wants to sweep the temple. Three phases, telegraphed attacks, big sprite.
//   SWEEP  he ignores you and sweeps (you barely hurt him)        DUST   a broom sweep sends a low dust wave along the floor — jump it
//   DASH   a thrust across the arena                              SPIN   a whirling broom, keep away
//   CEIL   he sweeps the ROOF BEAM (untouchable) shaking tiles loose, then drops on your head      REC  worn out: this is your window
const SWP_META = /*SWP_META*/;
const SWP_IM = new Image(); SWP_IM.src = 'data:image/png;base64,/*SWP_PNG*/';
const SWP_SC = 0.5;                                   // normal human size — the power is in the moves, not the body
const swpOK = () => SWP_IM.complete && SWP_IM.naturalWidth;
function hurtP(p, n, sx) { if (p === G.player) return hurtPlayer(n, sx, true); const p1 = G.player; G.player = p; try { hurtPlayer(n, sx, true); } finally { G.player = p1; } }
function sweeperIntro() {
  if (G.sweepStarted) return; G.sweepStarted = true;
  popup(G.player.x - 10, G.player.y - 30, '...THE COURTYARD GOES QUIET.', '#ffe9b8', true); audio.play('warn');
  G.cam.lock = { x0: 140 * TS, x1: 178 * TS };
  later(1.4, spawnSweeper);
}
function spawnSweeper() {
  const x0 = 140 * TS, x1 = 178 * TS;
  G.sweeps = []; G.sweepStarted = true;
  G.cp = { x: 146 * TS, y: 18 * TS - PC.standH };
  G.boss = { type: 'sweeper', name: '掃地僧  THE SWEEPING MONK', x: x1 - 70, y: 18 * TS - 34, w: 14, h: 34, vx: 0, vy: 0, hp: 300, maxHp: 300, face: -1,
    state: 'enter', t: 3.4, flash: 0, onGround: false, dead: false, phase: 1, atk: 0, dying: 0, anim: 0, shown: 0, cd: 0, ceil: false, x0: x0 + 12, x1: x1 - 12, shk: 0 };
  G.banner = { t: 0, title: '掃地僧', sub: 'THE SWEEPING MONK  —  "DON\'T MIND ME. I\'M JUST SWEEPING."' };
  audio.play('roar'); shake(0.4);
}
const ceilY = () => Math.round(G.cam.y) + 60;
function dustWave(x, dir, spd) { G.sweeps.push({ k: 'dust', x: x - 7, y: 18 * TS - 13, w: 14, h: 13, vx: dir * spd, vy: 0, life: 2.4, a: 0 }); }
function swpHurtCheck(b, f) { const ps = [G.player]; if (G.p2 && !G.p2.dead) ps.push(G.p2); for (const p of ps) if (!p.dead && f(p)) return p; return null; }
function sweeperPick(b) {
  const P = b.phase, seq = P === 1 ? ['dust', 'dash', 'dust', 'spin'] : P === 2 ? ['dust', 'ceil', 'dash', 'spin', 'ceil'] : ['dash', 'ceil', 'spin', 'dust', 'ceil', 'dash'];
  const k = seq[b.atk++ % seq.length], sp = 1 + (P - 1) * 0.22;
  if (k === 'dust') { b.state = 'dust_tele'; b.t = 0.55 / sp; popup(b.x + 8, b.y - 10, '!', '#ffd23f', false, 'sw' + b.atk); audio.play('warn'); }
  else if (k === 'dash') { b.state = 'dash_tele'; b.t = 0.6 / sp; popup(b.x + 8, b.y - 10, '!!', '#ff5a3a', true, 'sw' + b.atk); audio.play('warn'); }
  else if (k === 'spin') { b.state = 'spin'; b.t = 1.4; b.hitT = 0; audio.play('spin'); }
  else { b.state = 'ceil_tele'; b.t = 0.45; popup(b.x + 8, b.y - 10, '...', '#ffe9b8', false, 'sw' + b.atk); audio.play('whoosh'); }
}
function updSweeper(b, dt) {
  const p = G.player, pcx = p.x + p.w / 2, bcx = b.x + b.w / 2, dx = pcx - bcx, FL = 18 * TS;
  b.flash -= dt; b.anim += dt; b.t -= dt; b.cd -= dt;
  const sp = 1 + (b.phase - 1) * 0.22;
  if (!b.ceil) { b.vy = Math.min(b.vy + 1500 * dt, 900); const wasG = b.onGround; moveBody(b, dt); b.x = clamp(b.x, b.x0, b.x1 - b.w); if (b.fell && b.onGround && !wasG) sweeperLand(b); }
  if (b.dying > 0) {
    b.dying -= dt; b.vx = 0; b.ceil = false;
    if (Math.random() < dt * 14) explode(b.x + rnd(0, b.w), b.y + rnd(0, b.h), 24, 0, { noDmg: true, quiet: true });
    if (b.dying <= 0) {
      b.dead = true; G.sweeps = []; const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      explode(cx, cy, 80, 30, { byPlayer: true, noSelf: true }); gore(cx, cy, 10, 1.2); debris(cx, cy, 24, ['#c8b89a', '#8a7a5a', '#e8d8b8', '#b09060'], 1.6);
      G.sweepBody = { x: b.x, y: b.y, face: b.face }; G.sweepDone = true; G.exitOpen = true; G.cam.lock = null; G.goT = 0;
      for (const e of G.enemies) if (!e.dead && !e.isDummy) { e.hp = 0; killEnemy(e, 1, true); }
      popup(b.x - 20, b.y - 20, 'THE TEMPLE IS CLEAN.', '#ffd23f', true); audio.play('win');
      G.banner = { t: 0, title: '掃地僧', sub: 'DEFEATED  —  "...YOU LEFT FOOTPRINTS."' };
      if (G.bride) { G.bride.x = G.flag.x + 26; G.bride.y = 18 * TS - 18; G.bride.vx = G.bride.vy = 0; G.bride.st = 'wait'; G.bride.face = -1; }
      popup(G.flag.x - 40, 11 * TS, 'THE GATE OPENS  >>', '#7dff8a', true);
    }
    return;
  }
  if (b.state === 'enter') { b.face = -1; b.vx = 0; if (b.t <= 0) { b.state = 'sweep'; b.t = 0.8; } return; }
  if (b.state === 'rage') { b.vx = 0; b.shk = 3; if (b.t <= 0) { b.shk = 0; b.state = 'sweep'; b.t = 0.6; } return; }
  // phase changes
  const r = b.hp / b.maxHp;
  if (b.phase === 1 && r < 0.66 || b.phase === 2 && r < 0.33) {
    b.phase++; b.state = 'rage'; b.t = 1.5; b.ceil = false; shake(0.5); audio.play('roar'); part('ring', bcx, b.y + b.h, 0, 0, 0.5, 140, '#ffe9b8');
    popup(bcx - 30, b.y - 14, b.phase === 2 ? '...YOU MADE A MESS.' : 'NOW I MUST CLEAN YOU UP.', '#ff5a3a', true);
    for (let i = 0; i < 2; i++) dropIn('monk', Math.floor((i ? b.x1 / TS - 6 : b.x0 / TS + 6)), 'elite');
    return;
  }
  switch (b.state) {
    case 'sweep': {                                   // he ignores you and tidies up — you mostly bounce off
      b.face = sign(dx) || b.face; const want = Math.abs(dx) > 70 ? sign(dx) * 90 * sp : -sign(dx) * 40;
      b.vx = approach(b.vx, want, 500 * dt);
      if (Math.random() < dt * 8) part('debris', bcx + b.face * 12, b.y + b.h - 3, b.face * rnd(20, 60), rnd(-50, -10), rnd(0.3, 0.6), 1, '#c8b89a', { g: 300 });
      if (b.t <= 0) { b.vx = 0; sweeperPick(b); }
      break;
    }
    case 'dust_tele': b.vx = approach(b.vx, 0, 900 * dt); b.face = sign(dx) || b.face; if (b.t <= 0) { b.state = 'dust_go'; b.t = 0.3; audio.play('whoosh'); shake(0.12); dustWave(bcx + b.face * 16, b.face, 300 * sp); if (b.phase >= 2) later(0.3, () => { if (b && !b.dead) dustWave(bcx + b.face * 16, b.face, 340 * sp); }); if (b.phase === 3) dustWave(bcx - b.face * 16, -b.face, 300); } break;
    case 'dust_go': if (b.t <= 0) { b.state = 'rec'; b.t = 0.9 / sp; } break;
    case 'dash_tele': b.vx = approach(b.vx, 0, 900 * dt); b.face = sign(dx) || b.face; if (b.t <= 0) { b.state = 'dash'; b.t = 0.7; b.hitDash = false; b.vx = b.face * 560 * sp; audio.play('whoosh'); } break;
    case 'dash':
      if (Math.random() < dt * 40) dust(bcx - b.face * 10, b.y + b.h, 1, 4);
      if (!b.hitDash) { const q = swpHurtCheck(b, q => Math.abs((q.x + q.w / 2) - (bcx + b.face * 8)) < 20 && Math.abs((q.y + q.h) - (b.y + b.h)) < 34); if (q) { b.hitDash = true; hurtP(q, 2, bcx); shake(0.2); audio.play('slam'); } }
      if (b.t <= 0 || b.x <= b.x0 + 1 || b.x >= b.x1 - b.w - 1) { if (b.t > 0) { shake(0.3); audio.play('slam'); } b.state = 'rec'; b.t = 1.0 / sp; }
      break;
    case 'spin':
      b.face = sign(dx) || b.face; b.vx = approach(b.vx, b.face * 210 * sp, 1200 * dt); b.hitT -= dt;
      if (b.hitT <= 0) { b.hitT = 0.32; const q = swpHurtCheck(b, q => Math.abs((q.x + q.w / 2) - bcx) < 34 && (q.y + q.h) > b.y + 4); if (q) { hurtP(q, 1, bcx); audio.play('punch'); } audio.play('whoosh'); }
      if (b.t <= 0) { b.state = 'rec'; b.t = 1.0 / sp; b.vx = 0; }
      break;
    case 'rec': b.vx = approach(b.vx, 0, 1200 * dt); if (b.t <= 0) { b.state = 'sweep'; b.t = rnd(0.7, 1.2) / sp; } break;
    case 'ceil_tele': b.vx = approach(b.vx, 0, 900 * dt); if (b.t <= 0) {
      b.state = 'ceil'; b.t = (b.phase === 3 ? 3.6 : 3.0); b.ceil = true; b.vy = 0; b.vx = 0; b.y = ceilY(); b.rock = 0.3;
      dust(bcx, FL, 6, 8); part('ring', bcx, b.y + b.h, 0, 0, 0.3, 50, '#ffe9b8'); audio.play('whoosh'); G.sweepVanish = 0.2;
    } break;
    case 'ceil': {
      b.y = ceilY(); const tgt = pcx + Math.sin(b.anim * 1.7) * 130; b.face = sign(tgt - bcx) || b.face;
      b.vx = approach(b.vx, clamp(tgt - bcx, -1, 1) * 330 * sp, 1600 * dt); b.x = clamp(b.x + b.vx * dt, b.x0, b.x1 - b.w);
      b.rock -= dt;
      if (b.rock <= 0) { b.rock = 0.42 / sp; G.sweeps.push({ k: 'rock', x: b.x + b.w / 2 - 5 + rnd(-6, 6), y: b.y + b.h, w: 10, h: 10, vx: 0, vy: 40, life: 4, a: rnd(0, 6) }); }
      if (b.t <= 0) { b.state = 'drop_tele'; b.t = 0.8; popup(bcx - 6, b.y + b.h + 4, '!!', '#ff5a3a', true, 'dr' + b.atk); audio.play('warn'); }
      break;
    }
    case 'drop_tele': {
      const k = b.t > 0.35 ? 1 : 0; b.vx = approach(b.vx, k * clamp(dx, -1, 1) * 300, 2200 * dt); b.x = clamp(b.x + b.vx * dt, b.x0, b.x1 - b.w); b.y = ceilY(); b.shk = 1.5;
      if (b.t <= 0) { b.shk = 0; b.ceil = false; b.vy = 1000; b.vx = 0; b.fell = true; b.state = 'drop'; b.t = 3; audio.play('whoosh'); }
      break;
    }
    case 'drop': {
      if (!b.hitDash) { const q = swpHurtCheck(b, q => overlap(q, b)); if (q) { b.hitDash = true; hurtP(q, 2, bcx); } }
      break;
    }
  }
}
function sweeperLand(b) {
  b.fell = false; b.hitDash = false; const cx = b.x + b.w / 2;
  shake(0.8); hitstop(0.05); audio.play('slam'); audio.play('clang'); dust(cx, b.y + b.h, 16, 20); part('ring', cx, b.y + b.h - 2, 0, 0, 0.4, 120, '#ffe9b8');
  dustWave(cx, 1, 320); dustWave(cx, -1, 320);
  { const q = swpHurtCheck(b, q => Math.abs((q.x + q.w / 2) - cx) < 26 && q.onGround); if (q) hurtP(q, 2, cx); }
  if (b.phase === 3) { later(0.3, () => { if (!b.dead) { dustWave(cx, 1, 340); dustWave(cx, -1, 340); } }); }
  b.state = 'rec'; b.t = 1.6; b.recLong = true;
  popup(cx - 12, b.y - 8, 'SORRY.', '#ffe9b8', false, 'sry' + b.atk);
}
// damage rules: untouchable on the roof, shrugs while sweeping, vulnerable when he is worn out
{
  const _db = damageBoss;
  damageBoss = function (d, srcX) {
    const b = G.boss;
    if (b && b.type === 'sweeper' && !b.dead && b.dying <= 0) {
      if (b.state === 'enter' || b.state === 'rage') return;
      if (b.ceil || b.state === 'ceil_tele' || b.state === 'drop_tele') { if (Math.random() < 0.15) popup(b.x + 6, b.y + b.h + 6, 'WHOOSH', '#9a9aa4', false, 'ig'); return; }
      let m = b.state === 'rec' ? 1.25 : b.state === 'drop' ? 0.8 : b.state === 'sweep' ? 0.3 : b.state === 'spin' ? 0.25 : 0.55;
      if (b.state === 'sweep' && Math.random() < 0.3) { b.vx = sign(b.x + 11 - srcX) * 260; popup(b.x + 6, b.y - 8, '*SWEEP*', '#cfd0d8', false, 'sw'); }
      d *= m;
    }
    return _db.call(this, d, srcX);
  };
  // projectiles: dust waves + falling roof tiles
  const _step = step;
  step = function (dt, ip) {
    _step.apply(this, arguments);
    const S = G.sweeps; if (!S || !S.length) return;
    const FL = 18 * TS;
    for (let i = S.length - 1; i >= 0; i--) {
      const o = S[i]; o.life -= dt; o.a += dt;
      if (o.k === 'dust') { o.x += o.vx * dt; if (Math.random() < dt * 30) part('debris', o.x + o.w / 2, FL - rnd(1, 10), -sign(o.vx) * rnd(10, 40), rnd(-40, -5), 0.4, 1, '#d8c8a8', { g: 200 }); }
      else { o.vy += 700 * dt; o.y += o.vy * dt; if (o.y + o.h >= FL) { debris(o.x + 5, FL - 3, 5, ['#6a4a2a', '#8a6a3a'], 0.8); audio.play('crate'); S.splice(i, 1); continue; } }
      const q = swpHurtCheck(null, q => overlap(q, o)); if (q) { hurtP(q, 1, o.x); if (o.k === 'rock') { S.splice(i, 1); continue; } }
      if (o.life <= 0 || o.x < 138 * TS || o.x > 180 * TS) S.splice(i, 1);
    }
  };
  const _dp = drawPlayer;
  drawPlayer = function (p) {
    _dp.apply(this, arguments);
    if (p !== G.player) return;
    for (const o of G.sweeps || []) {
      if (!onScreen(o, 10)) continue;
      if (o.k === 'dust') {
        const f = Math.sign(o.vx); ctx.save(); ctx.globalAlpha = clamp(o.life / 0.5, 0, 0.9);
        for (let j = 0; j < 5; j++) { const t = (o.a * 6 + j * 1.3); ctx.fillStyle = j % 2 ? '#e8d8b8' : '#b8a888'; const w = 12 - j * 1.5, h = 12 - j * 2 + Math.sin(t) * 1.5; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2 - f * j * 5, FL_ - h / 2, w / 2 + 2, h / 2, 0, 0, 6.283); ctx.fill(); }
        ctx.fillStyle = '#7a8a3a'; ctx.fillRect(Math.round(o.x + o.w / 2 + Math.sin(o.a * 20) * 4), FL_ - 9 - Math.round(Math.abs(Math.sin(o.a * 12)) * 4), 2, 1); ctx.restore();
      } else { ctx.save(); ctx.translate(o.x + 5, o.y + 5); ctx.rotate(o.a * 5); ctx.fillStyle = '#3a2410'; ctx.fillRect(-5, -5, 10, 10); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-4, -4, 8, 8); ctx.fillStyle = '#b07a3a'; ctx.fillRect(-4, -4, 8, 2); ctx.restore(); }
    }
    const b = G.boss;
    if (b && b.type === 'sweeper' && !b.dead && b.state === 'drop_tele') { ctx.save(); ctx.globalAlpha = 0.35 + 0.25 * Math.sin(G.clock * 40); ctx.fillStyle = '#ff3a2a'; ctx.fillRect(Math.round(b.x), 18 * TS - 4, b.w, 4); ctx.fillRect(Math.round(b.x + b.w / 2) - 1, b.y + b.h, 2, 18 * TS - b.y - b.h); ctx.restore(); }
    if (G.sweepBody) drawSweeper(G.sweepBody, true);
  };
  const _ng = newGame; newGame = function () { _ng.apply(this, arguments); G.sweeps = []; G.sweepBody = null; G.sweepDone = false; G.sweepStarted = false; };
  // dying while he lives: the fight restarts from inside the arena
  const _rs = respawn;
  respawn = function () {
    const had = G.boss && G.boss.type === 'sweeper' && !G.boss.dead;
    const r = _rs.apply(this, arguments);
    if (had && G.boss && !G.player.dead) { G.boss = null; G.sweeps = []; G.sweepStarted = true; for (const e of G.enemies) if (!e.dead && !e.isDummy && e.elite) { e.dead = true; e.gibbed = true; e.deadT = 99; } later(1.2, spawnSweeper); }
    return r;
  };
}
const FL_ = 18 * TS;
function sweeperFrame(b, dead) {
  if (dead || b.dead) return 'dead';
  if (b.dying > 0) return b.dying > 1.2 ? 'fall' : 'dead';
  if (b.state === 'enter' || b.state === 'sweep') return Math.abs(b.vx) > 90 ? 'run' + (Math.floor(b.anim * 12) % 4) : (b.state === 'enter' || Math.abs(b.vx) > 12 ? 'sw' + (Math.floor(b.anim * 5) % 3) : 'sw' + (Math.floor(b.anim * 5) % 3));
  if (b.flash > 0.03 && b.state === 'rec') return 'hit';
  switch (b.state) {
    case 'dust_tele': return 'sw0'; case 'dust_go': return 'sw2'; case 'dash_tele': return 'idle'; case 'dash': return 'dash'; case 'spin': return 'spin';
    case 'rec': return b.recLong && b.t > 0.7 ? 'bow' : (b.flash > 0.03 ? 'hit' : 'sw1');
    case 'ceil_tele': return 'jump'; case 'ceil': return 'run' + (Math.floor(b.anim * 14) % 4); case 'drop_tele': return 'run' + (Math.floor(b.anim * 18) % 4); case 'drop': return 'slam';
    case 'rage': return 'idle';
  }
  return 'idle';
}
function drawSweeper(b, corpse) {
  if (!swpOK()) return;
  const n = sweeperFrame(b, corpse), f = SWP_META[n], S = SWP_SC;
  const fx = Math.round(b.x + (b.w || 14) / 2) + (b.shk ? Math.round(Math.sin(G.clock * 90) * b.shk) : 0), fy = Math.round((b.y || 0) + (b.h || 34));
  if (!corpse && b.ceil) {                                   // the roof beam he runs along
    const cy = ceilY(); ctx.fillStyle = '#2a1608'; ctx.fillRect(140 * TS, cy - 8, 38 * TS, 6); ctx.fillStyle = '#5a3418'; ctx.fillRect(140 * TS, cy - 8, 38 * TS, 2); ctx.fillStyle = '#c83a2a'; ctx.fillRect(140 * TS, cy - 3, 38 * TS, 1);
  }
  ctx.save(); const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  if (b.ceil) { ctx.translate(fx, b.y); ctx.scale(b.face || 1, -1); } else { ctx.translate(fx, fy); ctx.scale(b.face || 1, 1); }
  if (b.dying > 0) ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(G.clock * 30));
  const dw = f.w * S, dh = f.h * S, dx = -f.ax * S;
  ctx.drawImage(SWP_IM, f.x, f.y, f.w, f.h, dx, -dh, dw, dh);
  if (b.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5; ctx.drawImage(SWP_IM, f.x, f.y, f.w, f.h, dx, -dh, dw, dh); ctx.globalCompositeOperation = 'source-over'; }
  if (b.state === 'spin' || b.state === 'dash') { ctx.globalAlpha = 0.25; ctx.drawImage(SWP_IM, f.x, f.y, f.w, f.h, dx - 10, -dh, dw, dh); }
  ctx.imageSmoothingEnabled = sm; ctx.restore();
  if (!corpse && b.state === 'rec' && b.t > 0.2) { ctx.fillStyle = '#ffd23f'; const k = (Math.floor(G.clock * 6) % 2); ctx.fillRect(Math.round(b.x + b.w / 2) - 1, Math.round(b.y) - 16 - k, 2, 6); ctx.fillRect(Math.round(b.x + b.w / 2) - 1, Math.round(b.y) - 8 - k, 2, 2); }
}
