// Test helper for ONE MORE RUN: window.__T = { S(ms), tap(key), bot(ms, opt) }.
// tap() sends real keydown/keyup events through the game's own input path.
// bot() plays for `ms` of GAME time by holding keys (synthetic keyboard input) and stepping the
// fixed-step simulation directly, so a 2-minute stage takes seconds of real time. It uses the same small
// "cheats" as the earlier bot runs: an ambush not cleared after 25 s is cleared for it, and on stage 01 it
// is teleported over the steel wall if it gets stuck there (the bot can't climb).
(function () {
  const CODES = { c: 'KeyC', w: 'KeyW', j: 'KeyJ', k: 'KeyK', s: 'KeyS', d: 'KeyD', a: 'KeyA', l: 'KeyL', r: 'KeyR', ' ': 'Space' };
  const code = k => CODES[k] || k;
  const kd = c => window.dispatchEvent(new KeyboardEvent('keydown', { code: c }));
  const ku = c => window.dispatchEvent(new KeyboardEvent('keyup', { code: c }));
  const S = ms => new Promise(r => setTimeout(r, ms));
  async function tap(k) { kd(code(k)); await S(60); ku(code(k)); await S(40); }
  async function bot(ms, opt) {
    opt = opt || {};
    const G = ONE.G; if (G.mode !== 'play') return { mode: G.mode, x: G.player.x };
    const wasPaused = G.paused; G.paused = true;
    const held = new Set(); const hold = (c, on) => { if (on && !held.has(c)) { kd(c); held.add(c); } if (!on && held.has(c)) { ku(c); held.delete(c); } };
    const st = G.__bot || (G.__bot = { lastX: 0, stuck: 0, jt: 0, lockT: 0, t: 0 });
    const range = opt.range || 60, spEvery = Math.max(1, Math.round((opt.special || 15) * 120 / 10));
    let steps = Math.round(ms / 1000 * 120);
    hold('KeyJ', true);
    while (steps-- > 0) {
      if (opt.stop && G.mode !== 'play') break;
      const p = G.player, ip = {};
      let threat = false;                                    // chest-high bullet coming at us: crouch
      for (const b of G.ebullets) if (Math.abs(b.x - (p.x + 5)) < 70 && Math.sign(p.x - b.x) === Math.sign(b.vx) && b.y > p.y + p.h - 19 && b.y < p.y + p.h - 10 && Math.abs(b.vy) < 20) threat = true;
      const lowMG = G.boss && G.boss.state === 'mg_tele' && G.boss.aimLow;
      hold('KeyS', threat && p.onGround);
      const b = G.boss; let go = !threat;                     // walk right, but keep `range` from a boss in front
      if (b && !b.dead && b.state !== 'enter' && b.x > p.x && b.x - (p.x + p.w) < range * 0.4) go = false;
      hold('KeyD', go);
      if (Math.abs(p.x - st.lastX) < 0.5 && go) st.stuck += 1 / 120; else st.stuck = Math.max(0, st.stuck - 1 / 60);
      st.lastX = p.x; st.jt -= 1 / 120;
      if ((st.stuck > 0.15 || p.hitWall || lowMG) && st.jt <= 0 && !threat) { ip.jump = true; hold('Space', true); st.jt = 0.5; }
      if (st.jt < 0.2) hold('Space', false);
      if (!opt.noCheat && ONE.STAGE === 1 && st.stuck > 3 && p.x / 16 > 90 && p.x / 16 < 126) { ONE.teleport(127, 10); st.stuck = 0; }
      if (G.lock) { st.lockT += 1 / 120; if (st.lockT > 25 && !opt.noCheat) { for (const e of G.enemies) if (!e.dead) { e.hp = 0; e.dead = true; e.deadT = 0; } st.lockT = 0; } } else st.lockT = 0;
      if (st.stuck > 6 && !G.lock) { p.x += 24; st.stuck = 0; }
      const above = G.enemies.find(e => !e.dead && !e.para && e.y + e.h < p.y - 20 && Math.abs(e.x - p.x) < 50);
      hold('ArrowUp', !!above && !threat);
      st.t++;
      if (p.ch === 'wah' && st.t % 84 === 0) ip.shoot = true;
      if (p.ch === 'li') { hold('KeyJ', false); if (st.t % 36 === 0) ip.shoot = true; }
      if (st.t % spEvery === 0 && p.ch !== 'zhang') ip.bomb = true;
      if (p.ch === 'zhang') { const cx = p.x + p.w / 2; const th = G.ebullets.some(e => Math.abs(e.x - cx) < 120 && Math.abs(e.y - p.y) < 40 && Math.sign(cx - e.x) === Math.sign(e.vx)); hold('KeyK', th && p.qi > 15); }
      if (opt.holdK && p.ch === 'silat') {                   // scripted K-hold pattern (v29): the SMG is a held weapon, so spray whenever a foe/boss is ahead
        const f = G.enemies.some(e => !e.dead && !e.para && (e.x - p.x) * (p.face || 1) > 0 && Math.abs(e.x - p.x) < 190 && Math.abs(e.y + e.h - p.y - p.h) < 30) || (b && !b.dead && b.state !== 'enter' && Math.abs(b.x - p.x) < 220);
        hold('KeyK', f);
      }
      if (p.ult >= 100) ip.ult = true;
      ONE.step(1 / 120, ip);
    }
    for (const c of [...held]) hold(c, false);
    if (G.mode === 'play') G.paused = wasPaused;
    await S(0);
    return { mode: G.mode, x: G.player.x, deaths: G.stats.deaths, time: G.time };
  }
  window.__T = { S, tap, bot };
})();
