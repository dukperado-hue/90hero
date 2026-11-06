// v32 feel pass (Broforce-style): chunky explosions that throw real terrain chunks, bigger craters, auto step-up over one-tile ledges
{
  // ---- explosions: chunks of the actual tiles fly out, a smoke column rises, craters are wider
  const _expl = explode;
  explode = function (x, y, r, dmg, o) {
    o = o || {};
    const seen = [];
    if (!o.noDmg && r >= 20) {
      const x0 = Math.floor((x - r) / TS), x1 = Math.floor((x + r) / TS), y0 = Math.floor((y - r) / TS), y1 = Math.floor((y + r) / TS);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) { const t = tileAt(tx, ty); if (DESTRUCT[t] && Math.hypot(tx * TS + 8 - x, ty * TS + 8 - y) < r * 1.1) seen.push([tx, ty, t]); }
    }
    const res = _expl.call(this, x, y, r, dmg, o);
    if (!o.noDmg && r >= 20 && !o.quiet) {
      // a second, softer pass so the hole is round and deep rather than a few lonely bricks
      for (const [tx, ty] of seen) { const d = Math.hypot(tx * TS + 8 - x, ty * TS + 8 - y); if (d < r * 0.8) damageTile(tx, ty, 1.5); }
      let n = 0;
      for (const [tx, ty, t] of seen) {
        if (tileAt(tx, ty) !== 0 || n > 26) continue; n++;
        const cx = tx * TS + 8, cy = ty * TS + 8, a = Math.atan2(cy - y, cx - x), s = rnd(120, 300) * (r / 46);
        const cols = TILE_DEBRIS[t] || ['#7a6656', '#5e4c40'];
        part('debris', cx, cy, Math.cos(a) * s, Math.sin(a) * s - rnd(120, 260), rnd(1.6, 2.8), 4 + (Math.random() * 3 | 0), cols[(Math.random() * cols.length) | 0], { g: 900, vr: rnd(-12, 12) });
        if (Math.random() < 0.4) part('debris', cx, cy, Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6 - 180, rnd(1.2, 2), 2, '#2a2420', { g: 800, vr: rnd(-12, 12) });
      }
      // rising dust/smoke column + embers
      for (let i = 0; i < 7; i++) part('smoke', x + rnd(-r * 0.3, r * 0.3), y + rnd(-4, 8), rnd(-14, 14), rnd(-90, -40), rnd(1.4, 2.4), rnd(6, 11), i % 2 ? '#4a4038' : '#6a5a4a', { grow: 12, a: 0.6 });
      for (let i = 0; i < 8; i++) part('fire', x + rnd(-r * 0.4, r * 0.4), y, rnd(-60, 60), rnd(-200, -80), rnd(0.5, 1.1), 2, '#ffb030', { g: 300 });
    }
    return res;
  };
  // ---- movement: walk straight up a one-tile ledge instead of stopping dead (players only)
  const _mv = moveBody;
  moveBody = function (b, dt) {
    const wasG = b.onGround, vx0 = b.vx, y0 = b.y;
    _mv.call(this, b, dt);
    if (b.ch && b.hitWall && (wasG || b.onGround) && b.vy >= 0 && !b.dead && vx0 !== 0 && !(b.crouch)) {
      const dir = b.hitWall, tx = Math.floor((dir > 0 ? b.x + b.w + 0.5 : b.x - 0.5) / TS);
      const ty = Math.floor((b.y + b.h - 0.001) / TS);                 // the row the wall hit our feet in
      if (solidAt(tx, ty) && !solidAt(tx, ty - 1) && !solidAt(tx, ty - 2) && !solidAt(Math.floor(b.x / TS), ty - 2) && !solidAt(Math.floor((b.x + b.w - 0.001) / TS), ty - 2)) {
        const ny = ty * TS - b.h;
        if (b.y - ny <= TS + 1 && ny < b.y + 1) {
          let clear = true;
          for (let cx = Math.floor((b.x + dir * 2) / TS); cx <= Math.floor((b.x + b.w - 0.001 + dir * 2) / TS); cx++) for (let cy = Math.floor(ny / TS); cy <= Math.floor((ny + b.h - 0.001) / TS); cy++) if (cy < ty && solidAt(cx, cy)) clear = false;
          if (clear) { b.y = ny - 0.01; b.vx = vx0 * 0.92; b.hitWall = 0; b.onGround = true; b.vy = 0; }
        }
      }
    }
  };
}
