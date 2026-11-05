// Stage-04 climbing bot: follows the stairwell waypoints (S4.route), fights with J, special every ~15 s.
// Injected after bot.js. __T.climb(ms) returns progress info. No teleports, no cheats.
(function () {
  const kd = c => window.dispatchEvent(new KeyboardEvent('keydown', { code: c })), ku = c => window.dispatchEvent(new KeyboardEvent('keyup', { code: c }));
  async function climb(ms) {
    const G = ONE.G; if (G.mode !== 'play') return { mode: G.mode };
    const wasPaused = G.paused; G.paused = true;
    const held = new Set(); const hold = (c, on) => { if (on && !held.has(c)) { kd(c); held.add(c); } if (!on && held.has(c)) { ku(c); held.delete(c); } };
    const st = G.__c || (G.__c = { i: 0, jt: 0, t: 0, stuck: 0, lastY: 0, best: 1e9 });
    const R = S4.route; let steps = Math.round(ms / 1000 * 120);
    while (steps-- > 0 && G.mode === 'play') {
      const p = G.player, ip = {}, feet = p.y + p.h, cx = p.x + p.w / 2;
      while (st.i < R.length - 1 && feet <= R[st.i].y + 2 && p.onGround) st.i++;
      // if we fell below the previous waypoint, step back
      while (st.i > 0 && feet > R[st.i - 1].y + 40) st.i--;
      const w = R[st.i], dx = w.x - cx, boss = G.boss && !G.boss.dead && G.boss.dying <= 0;
      let go = 0;
      if (boss) { const bx = G.boss.x + G.boss.w / 2; go = Math.abs(bx - cx) > 70 ? Math.sign(bx - cx) : (Math.abs(bx - cx) < 30 ? -Math.sign(bx - cx) : 0); if (go === 0) p.face = Math.sign(bx - cx) || 1; }
      else if (G.amb4 && G.amb4.crew.some(e => !e.dead)) {           // ambush: go and fight the crew
        const tg = G.amb4.crew.filter(e => !e.dead).sort((a, b) => Math.hypot(a.x - cx, a.y - p.y) - Math.hypot(b.x - cx, b.y - p.y))[0];
        const ex = tg.x + tg.w / 2; go = Math.abs(ex - cx) > 26 ? Math.sign(ex - cx) : 0; if (!go) p.face = Math.sign(ex - cx) || p.face;
        if (tg.y + tg.h < feet - 20 && p.onGround && st.jt <= 0) { ip.jump = true; hold('Space', true); st.jt = 0.45; }
      }
      else if (G.exitOpen) go = Math.sign(G.flag.x + 4 - cx) || 1;
      else if (Math.abs(dx) > 18) go = Math.sign(dx);
      hold('KeyD', go > 0); hold('KeyA', go < 0);
      st.jt -= 1 / 120;
      const below = feet > w.y + 2;
      const col = Math.floor(cx / 16), frow = Math.round(feet / 16), roofAbove = [3, 4].some(k => ONE.tile(col, frow - k) === 6);
      if (!boss && below && p.onGround && (Math.abs(dx) < 40 || roofAbove) && st.jt <= 0) { ip.jump = true; hold('Space', true); st.jt = 0.45; }
      if (boss && p.onGround && st.jt <= 0 && Math.random() < 0.01) { ip.jump = true; hold('Space', true); st.jt = 0.4; }
      if (st.jt < 0.05) hold('Space', false);
      if (Math.abs(p.y - st.lastY) < 1 && go) st.stuck += 1 / 120; else st.stuck = 0;
      st.lastY = p.y;
      if (st.stuck > 1.2 && p.onGround && st.jt <= 0) { ip.jump = true; hold('Space', true); st.jt = 0.45; st.stuck = 0; }
      const near = G.enemies.some(e => !e.dead && Math.abs(e.x + e.w / 2 - cx) < 90 && Math.abs(e.y + e.h - feet) < 30) || boss;
      hold('KeyJ', near && (st.t % 40) < 30);
      st.t++; if (st.t % 1800 === 0 && p.ch !== 'zhang') ip.bomb = true;
      if (p.ult >= 100) ip.ult = true;
      ONE.step(1 / 120, ip);
      st.best = Math.min(st.best, p.y);
    }
    for (const c of [...held]) hold(c, false);
    if (G.mode === 'play') G.paused = wasPaused;
    await new Promise(r => setTimeout(r, 0));
    const p = G.player; return { mode: G.mode, i: st.i, n: R.length, row: +(p.y / 16).toFixed(1), best: +(st.best / 16).toFixed(1), deaths: G.stats.deaths, kills: G.stats.kills, time: +G.time.toFixed(1), boss: G.boss ? Math.round(G.boss.hp) + G.boss.state : '-', arena: G.arena4 };
  }
  window.__T.climb = climb;
})();
