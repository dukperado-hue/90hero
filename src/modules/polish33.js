// v33 physics pass: blasts launch bodies, walls that lose their support collapse as real falling chunks (they crush enemies, then shatter), head-bump corner correction
const STRUCT33 = new Set([T.B, T.W, T.C]);
function collapseCheck33(seeds) {
  if (STAGE === 4) return 0;                       // the tower's floors are the route: never collapse them
  const seen = new Set(); let freed = 0;
  for (const [sx, sy] of seeds) {
    const sk = sy * LW + sx; if (seen.has(sk) || !STRUCT33.has(tileAt(sx, sy))) continue;
    const comp = [], q = [[sx, sy]]; seen.add(sk); let anchored = false;
    while (q.length && !anchored) {
      const [x, y] = q.pop(); comp.push([x, y]);
      if (comp.length > 140) { anchored = true; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || nx >= LW || ny >= LH) { anchored = true; break; } if (ny < 0) continue;
        const t = tileAt(nx, ny);
        if (STRUCT33.has(t)) { const k = ny * LW + nx; if (!seen.has(k)) { seen.add(k); q.push([nx, ny]); } }
        else if (SOLID[t]) { anchored = true; break; }
      }
    }
    if (anchored) continue;
    for (const [x, y] of comp) {
      const t = tileAt(x, y);
      (G.chunks = G.chunks || []).push({ x: x * TS, y: y * TS, vx: rnd(-18, 18), vy: rnd(-30, 0), t, rot: 0, vr: rnd(-3, 3), hp: 1 });
      setTile(x, y, T.E); freed++;
    }
  }
  if (freed) { shake(0.2 + Math.min(0.3, freed / 60)); audio.play('tile', 0.8); if (freed > 3) popup((seeds[0][0]) * TS, (seeds[0][1]) * TS - 16, 'IT\'S COMING DOWN!', '#ffb84a', false, 'collapse'); }
  return freed;
}
{
  const _expl = explode;
  explode = function (x, y, r, dmg, o) {
    o = o || {};
    const before = [];
    if (!o.noDmg && r >= 20) {
      const x0 = Math.floor((x - r) / TS), x1 = Math.floor((x + r) / TS), y0 = Math.floor((y - r) / TS), y1 = Math.floor((y + r) / TS);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (STRUCT33.has(tileAt(tx, ty)) || DESTRUCT[tileAt(tx, ty)]) before.push([tx, ty]);
    }
    const res = _expl.apply(this, arguments);
    if (o.noDmg || r < 20) return res;
    // radial launch: everything alive near the blast gets thrown, harder when closer
    const clamp1 = v => Math.max(0, Math.min(1, v));
    for (const e of G.enemies) {
      if (e.dead || e.para || e.type === 'heavy' && r < 40) continue;
      const dx = e.x + e.w / 2 - x, dy = e.y + e.h / 2 - y, d = Math.hypot(dx, dy), k = clamp1(1 - d / (r * 1.05));
      if (k <= 0) continue;
      e.vx += sign(dx || 1) * 210 * k; e.vy = Math.min(e.vy, -(120 + 240 * k)); e.stun = Math.max(e.stun || 0, 0.25 + 0.5 * k);
    }
    const p = G.player;
    if (p && !p.dead && !o.noSelf) {
      const dx = p.x + p.w / 2 - x, dy = p.y + p.h / 2 - y, d = Math.hypot(dx, dy), k = clamp1(1 - d / (r * 1.3));
      if (k > 0 && p.inv <= 0.01 || (k > 0 && o.byPlayer)) { p.vx += sign(dx || 1) * 70 * k; if (p.onGround && dy < 6) p.vy = Math.min(p.vy, -130 * k); }
    }
    const seeds = []; for (const [tx, ty] of before) if (tileAt(tx, ty) === 0) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) seeds.push([tx + dx, ty + dy]);
    if (seeds.length) collapseCheck33(seeds);
    return res;
  };
  const _step = step;
  step = function (dt, ip) {
    _step.apply(this, arguments);
    const C = G.chunks; if (!C || !C.length || G.mode === 'title') return;
    for (let i = C.length - 1; i >= 0; i--) {
      const c = C[i]; c.vy = Math.min(c.vy + 1200 * dt, 640); c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      const box = { x: c.x + 1, y: c.y, w: 14, h: 16 };
      if (c.vy > 120) for (const e of G.enemies) if (!e.dead && overlap(box, e)) { damageEnemy(e, 3, c.x + 8, true); c.vy *= 0.6; }
      const ty = Math.floor((c.y + 16) / TS), tx = Math.floor((c.x + 8) / TS), t = tileAt(tx, ty);
      if (SOLID[t] || t === T.P || ty >= LH + 2 || c.y > LH * TS + 40) {
        C.splice(i, 1);
        if (ty < LH + 2) { debris(c.x + 8, c.y + 12, 6, TILE_DEBRIS[c.t] || ['#7a6656', '#5e4c40'], 0.8); dust(c.x + 8, c.y + 16, 3, 6); if (Math.random() < 0.5) audio.play('tile', 0.4); }
      }
    }
  };
  const _dp = drawPlayer;
  drawPlayer = function (p) {
    _dp.apply(this, arguments);
    const C = G.chunks; if (!C || !C.length || p !== G.player) return;
    for (const c of C) {
      const cols = TILE_DEBRIS[c.t] || ['#7a6656', '#5e4c40', '#988070'];
      ctx.save(); ctx.translate(Math.round(c.x + 8), Math.round(c.y + 8)); ctx.rotate(c.rot);
      ctx.fillStyle = cols[0]; ctx.fillRect(-8, -8, 16, 16); ctx.fillStyle = cols[1] || cols[0]; ctx.fillRect(-8, -8, 16, 3); ctx.fillStyle = cols[2] || '#2a2420'; ctx.fillRect(-8, 5, 16, 3); ctx.fillRect(-1, -8, 2, 16);
      ctx.restore();
    }
  };
  const _nm = newGame;
  newGame = function () { _nm.apply(this, arguments); G.chunks = []; };
  // head-bump forgiveness: clip a ledge corner by a few pixels while jumping and you slide round it
  const _mv = moveBody;
  moveBody = function (b, dt) {
    const vy0 = b.vy;
    _mv.call(this, b, dt);
    if (b.ch && b.hitCeil && vy0 < -120 && !b.dead) {
      for (const d of [1, 2, 3, 4]) for (const s of [-1, 1]) {
        if (!solidRect(b.x + s * d, b.y - 1, b.w, b.h)) { b.x += s * d; b.y -= 1; b.vy = vy0 * 0.9; b.hitCeil = false; return; }
      }
    }
  };
}
