// v31 ONE MORE RUN: dying should flow straight into the next attempt.
//  - J skips the death wait (instant retake); auto-retake is faster too
//  - "SO CLOSE" card shows how much of the boss was left when you fell
//  - every retake and every stage start begins with some ultimate charge, and dropping to the last heart gives a little (a near miss pays you back)
{
  const _up = updatePlayer;
  updatePlayer = function (dt, ip) {
    const p = G.player;
    if (p && p.dead && G.mode === 'play') {
      if (p.deadT > 0.35 && (ip.shoot || ip.jump || ip.start || ip.bomb)) p.deadT = 1.5;
      else if (p.deadT > 1.0) p.deadT = 1.5;
    }
    return _up(dt, ip);
  };
  const _hurt = hurtPlayer;
  hurtPlayer = function (n, srcX, contact) {
    const p = G.player, hp0 = p ? p.hp : 0, dead0 = p ? p.dead : true;
    _hurt(n, srcX, contact);
    if (!p || dead0 || G.player !== p) return;
    if (p.dead) {
      const b = G.boss; G.retry = { pct: b && !b.dead && b.dying <= 0 && b.state !== 'enter' && b.maxHp ? Math.max(0, Math.round(b.hp / b.maxHp * 100)) : -1, t: 0 };
      if (G.retry.pct >= 0 && G.retry.pct <= 35) popup(p.x + p.w / 2, p.y - 24, 'SO CLOSE! BOSS ' + G.retry.pct + '%', '#ffd23f', true);
    } else if (hp0 > 1 && p.hp === 1) { popup(p.x - 4, p.y - 26, 'LAST TAKE!', '#ff5a5a', true); addUlt(p, 25); }
  };
  const _rs = respawn;
  respawn = function () {
    const old = G.player ? G.player.ult || 0 : 0;
    _rs();
    G.player.ult = Math.max(Math.floor(old * 0.5), 35); G.retry = null;
  };
  const _ng = newGame;
  newGame = function (mode) {
    const r = _ng.apply(this, arguments);
    if (G.mode === 'play' && G.player) G.player.ult = Math.max(G.player.ult || 0, 25);
    G.retry = null; return r;
  };
  const _rd = render;
  render = function () {
    _rd();
    const p = G.player, r = G.retry;
    if (G.mode !== 'play' || !p || !p.dead || p.deadT < 0.35) return;
    r && (r.t += 0.016);
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cx = VW / 2, y = VH - 40, w = 260;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(cx - w / 2, y - 22, w, 44);
    ctx.font = 'bold 10px monospace'; ctx.fillStyle = '#000'; ctx.fillText('[J]  TAKE AGAIN', cx + 1, y - 8); ctx.fillStyle = Math.floor(G.clock * 4) % 2 ? '#ffe48a' : '#ffffff'; ctx.fillText('[J]  TAKE AGAIN', cx, y - 9);
    if (r && r.pct >= 0) {
      const bw = 160, bx = cx - bw / 2, by = y + 4;
      ctx.fillStyle = '#2a0a0a'; ctx.fillRect(bx, by, bw, 6); ctx.fillStyle = r.pct <= 35 ? '#ffd23f' : '#c02a2a'; ctx.fillRect(bx, by, Math.round(bw * r.pct / 100), 6);
      ctx.font = '7px monospace'; ctx.fillStyle = '#fff'; ctx.fillText('BOSS ' + r.pct + '%' + (r.pct <= 35 ? '  —  SO CLOSE' : ''), cx, by + 13);
    } else { ctx.font = '7px monospace'; ctx.fillStyle = '#ddd'; ctx.fillText('ULTIMATE CHARGE KEPT HALF', cx, y + 8); }
    ctx.restore();
  };
}
