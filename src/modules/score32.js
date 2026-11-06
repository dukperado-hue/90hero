// v32: score (kills x combo, explosive/barrel kills, chain reactions, boss) + end-of-stage tally + a mid-stage PACE card at checkpoints
{
  const PTS = { soldier: 100, gunner: 120, knife: 120, shield: 150, bomber: 150, heavy: 300, monk: 60, crowd: 40 };
  let ENV = false;
  const addScore = (n) => { if (G && G.mode === 'play') G.score = (G.score || 0) + Math.round(n); };
  const bestKey = () => 'omr_best_score_s0' + STAGE + '_' + (G.player ? G.player.ch : CHOSEN);
  const _ng = newGame;
  newGame = function (mode) { _ng.apply(this, arguments); G.score = 0; G.scoreShow = 0; G.scoreBonus = null; G.pace = null; G.cpSeen = 0; };
  const _kill = killEnemy;
  killEnemy = function (e, dir, explosive, chain) {
    const was = e.dead; _kill.apply(this, arguments);
    if (was || !e.dead) return;
    const c = G.combo, mult = 1 + Math.min(Math.max(c.n - 1, 0), 9) * 0.25;
    let pts = (PTS[e.type] || 100) * mult;
    if (explosive) pts += 50;
    if (ENV) { pts += 100; if (G.player && Math.abs(e.x - G.player.x) < 120 && !G.envSaid) { G.envSaid = 1.2; popup(e.x + 4, e.y - 18, 'BARREL KILL +100', '#ff9a3a', false, 'envk'); } }
    addScore(pts);
  };
  const _expl = explode;
  explode = function (x, y, r, dmg, o) {
    o = o || {}; const prev = ENV; ENV = !!(o.barrel || (!o.byPlayer && !o.shell && !o.quiet && o.chain));
    let res; try { res = _expl.apply(this, arguments); } finally { ENV = prev; }
    const id = o.chain || G.chainSeq, n = G.chains && G.chains[id];
    if (n >= 3 && !o.quiet) addScore(80 * (n - 2));
    return res;
  };
  const _step = step;
  step = function (dt, ip) {
    _step.apply(this, arguments);
    if (G.mode !== 'play' || G.cine) return;
    if (G.envSaid > 0) G.envSaid -= dt;
    const b = G.boss; if (b && b.dead && !b._sc) { b._sc = true; addScore(1500); popup(b.x + 6, b.y - 14, 'BOSS DOWN +1500', '#ffd23f', true); }
    const n = G.checkpoints ? G.checkpoints.filter(c => c.on).length : 0;
    if (n > (G.cpSeen || 0)) {
      G.cpSeen = n;
      try {
        const fx = G.flag && G.flag.x, p = G.player;
        if (STAGE !== 4 && fx && p) {
          const prog = clamp(p.x / fx, 0, 1);
          if (prog > 0.12 && prog < 0.97) { const proj = G.time / prog; G.pace = { t: 0, rank: rankFor(STAGE, proj, G.stats.deaths), proj, pct: Math.round(prog * 100) }; }
        }
      } catch (e) { }
    }
    if (G.pace) { G.pace.t += dt; if (G.pace.t > 3.4) G.pace = null; }
  };
  const _win = win;
  win = function () {
    const t0 = G.finalTime != null ? G.finalTime : G.time;
    _win.apply(this, arguments);
    const R = RANK_RULES[STAGE] || RANK_RULES[1];
    const timeB = Math.max(0, Math.round((R.A[0] - t0) * 10)), liveB = G.stats.deaths === 0 ? 500 : 0, rankB = { S: 1000, A: 600, B: 300, C: 0 }[G.rank] || 0;
    G.scoreBonus = { time: timeB, live: liveB, rank: rankB, base: G.score || 0 };
    G.scoreFinal = (G.score || 0) + timeB + liveB + rankB;
    let prev = null; try { const v = parseInt(localStorage.getItem(bestKey())); prev = isNaN(v) ? null : v; } catch (e) { }
    G.scoreNew = prev == null || G.scoreFinal > prev; G.scorePrev = prev;
    if (G.scoreNew) try { localStorage.setItem(bestKey(), String(G.scoreFinal)); } catch (e) { }
  };
  const fmt = n => String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const _hud = drawHUD;
  drawHUD = function () {
    _hud.apply(this, arguments);
    if (G.mode !== 'play') return;
    G.scoreShow += ((G.score || 0) - G.scoreShow) * 0.15; if (Math.abs((G.score || 0) - G.scoreShow) < 1) G.scoreShow = G.score || 0;
    ctx.textAlign = 'right'; ctx.font = 'bold 9px monospace'; ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(VW - 94, 27, 90, 11);
    ctx.fillStyle = '#ffd23f'; ctx.fillText('SCORE ' + fmt(G.scoreShow), VW - 8, 36); ctx.textAlign = 'left';
    if (G.pace) {
      const a = Math.min(1, G.pace.t * 3, (3.4 - G.pace.t) * 2), y = 42 + (1 - Math.min(1, G.pace.t * 4)) * -8;
      ctx.globalAlpha = a; ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(VW / 2 - 78, y, 156, 24);
      const rc = { S: '#ffd23f', A: '#7dff8a', B: '#9ad0ff', C: '#ff9a3a' }[G.pace.rank];
      ctx.fillStyle = rc; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.fillText(G.pace.rank, VW / 2 - 56, y + 18);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 8px monospace'; ctx.fillText('ON PACE FOR RANK ' + G.pace.rank, VW / 2 + 12, y + 10);
      ctx.fillStyle = '#bbb'; ctx.fillText(G.pace.pct + '% DONE  ·  ~' + fmtTime(G.pace.proj), VW / 2 + 12, y + 20);
      ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    }
  };
  const _dw = drawWin;
  drawWin = function () {
    _dw.apply(this, arguments);
    const t = G.winT, B = G.scoreBonus; if (!B || t < 1.3) return;
    const X = VW / 2 + 200;
    txt('SCORE', X, 168, '#ffb070', 8, 'center');
    txt(fmt(G.scoreFinal), X, 180, '#ffd23f', 12, 'center');
    if (t > 1.7) txt(G.scoreNew ? (G.scorePrev == null ? 'FIRST SCORE!' : 'NEW BEST!') : 'BEST ' + fmt(G.scorePrev), X, 190, G.scoreNew ? '#7dff8a' : '#a89888', 7, 'center');
    if (t > 1.9) { txt('KILLS +' + fmt(B.base), X, 201, '#a89888', 6, 'center'); txt('TIME +' + B.time, X, 209, '#a89888', 6, 'center'); txt('RANK +' + B.rank, X, 217, '#a89888', 6, 'center'); if (B.live) txt('NO-DEATH +' + B.live, X, 225, '#a89888', 6, 'center'); }
  };
}
