// =====================================================================
// v36b — LADDERS (Broforce-style): every hero can climb. Stand at a ladder and hold UP (W or the up arrow) to climb,
// hold S at the top to climb down. Jump off with CTRL / SPACE (W keeps climbing). You can still attack while on a ladder.
// Builders push { x: centre px, y0: top px (the floor you step off onto), y1: bottom px } into LADDERS.
// =====================================================================
let LADDERS = [];
let W36 = false, JUMPKEY36 = false;
addEventListener('keydown', e => { if (e.code === 'KeyW') W36 = true; if (e.code === 'ControlLeft' || e.code === 'Space') JUMPKEY36 = true; });
addEventListener('keyup', e => { if (e.code === 'KeyW') W36 = false; if (e.code === 'ControlLeft' || e.code === 'Space') JUMPKEY36 = false; });
addEventListener('blur', () => { W36 = false; JUMPKEY36 = false; });
function addLadder(tx, ty0, ty1) { LADDERS.push({ x: tx * TS + TS / 2, y0: ty0 * TS, y1: ty1 * TS }); }
function ladderUp() { return held('up') || W36; }
function ladderTick(p, dt, ip) {
  if (p.dead || !LADDERS.length || (p.ch === 'wah' && !p.foot)) { p.lad = null; return false; }
  const cx = p.x + p.w / 2;
  if (!p.lad) {
    if ((p.ladCd || 0) > G.time) return false;
    let q = null;
    if (ladderUp()) q = LADDERS.find(q => Math.abs(q.x - cx) < 9 && p.y + p.h > q.y0 + 2 && p.y < q.y1);
    if (!q && held('down')) q = LADDERS.find(q => Math.abs(q.x - cx) < 9 && Math.abs(p.y + p.h - q.y0) < 6);   // climb down from the top
    if (!q) return false;
    p.lad = q; p.vx = 0; p.vy = 0; if (held('down') && Math.abs(p.y + p.h - q.y0) < 6) p.y += 4;
    if (!q.told) { q.told = true; popup(p.x + 5, p.y - 16, 'CLIMB!', '#ffd23f'); }
  }
  const q = p.lad; p.x += (q.x - p.w / 2 - p.x) * Math.min(1, dt * 20); p.vx = 0; p.vy = 0; p.onGround = false;
  const up = ladderUp(), dn = held('down');
  if (up) p.y -= 120 * dt; else if (dn) p.y += 150 * dt;
  p.ladT = (p.ladT || 0) + (up || dn ? dt : 0);
  if (JUMPKEY36 && ip.jump) { p.lad = null; p.ladCd = G.time + 0.3; p.vy = -360; p.vx = (held('left') ? -1 : held('right') ? 1 : p.face) * 160; audio.play('jump'); return true; }
  if (p.y + p.h <= q.y0) { p.y = q.y0 - p.h; p.lad = null; p.ladCd = G.time + 0.25; p.onGround = true; return true; }   // stepped off at the top
  if (p.y + p.h >= q.y1) { p.y = q.y1 - p.h; p.lad = null; p.ladCd = G.time + 0.25; p.onGround = true; return true; }
  return true;
}
const _poleTick36 = poleTick;
poleTick = function (p, dt, ip) { if (STAGE === 5) return _poleTick36(p, dt, ip); return ladderTick(p, dt, ip); };
function drawLadders36(cam) {
  if (!LADDERS.length) return;
  for (const q of LADDERS) {
    if (q.x < cam.x - 20 || q.x > cam.x + VW + 20) continue;
    const x = Math.round(q.x - 6);
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x, q.y0 - 6, 2, q.y1 - q.y0 + 6); ctx.fillRect(x + 10, q.y0 - 6, 2, q.y1 - q.y0 + 6);
    ctx.fillStyle = '#9a7040'; for (let y = q.y0 - 2; y < q.y1; y += 6) ctx.fillRect(x, y, 12, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(x, q.y0 - 6, 1, q.y1 - q.y0 + 6);
  }
}
// the hero's climbing pose: arms up, legs alternate (drawn over the normal pose as a hint; sprites keep their jump frame)
const _drawPlayer36l = drawPlayer;
drawPlayer = function (p) {
  if (p && p.lad && !p.dead) { const sw = p.vx; p.vx = 0; p.onGround = false; p.vy = Math.sin((p.ladT || 0) * 12) * 50; const r = _drawPlayer36l.apply(this, arguments); p.vx = sw; p.vy = 0; return r; }
  return _drawPlayer36l.apply(this, arguments);
};
// lock stall-breaker (all stages): if a lock is down to a few enemies the hero can't reach for a long time, they give up and fall apart
function updLockStall36(dt) {
  if (!G.lock || G.mode !== 'play') { G.lockStall = 0; return; }
  const L = LOCKS[G.lock.i], p = G.player; if (!L) return; const alive = G.enemies.filter(e => !e.dead && e.x + e.w > L.x0 * TS && e.x < L.x1 * TS);
  const far = alive.filter(e => Math.abs(e.y + e.h - (p.y + p.h)) > 50 || !onScreen(e, 0));
  G.lockStall = alive.length <= 4 && far.length === alive.length ? (G.lockStall || 0) + dt : 0;
  if (G.lockStall > 8) { for (const e of alive) { e.hp = 0; killEnemy(e, 1, true); } G.lockStall = 0; popup(p.x + 5, p.y - 24, 'THE REST GAVE UP!', '#7dff8a', true); }
}

const _buildLevel36 = buildLevel;
buildLevel = function () { LADDERS = []; return _buildLevel36.apply(this, arguments); };
