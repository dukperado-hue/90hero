// v32: two players on one machine. P1 = WASD (+LCtrl/W jump, J/K/L, Q aim up). P2 = arrows (Up or RCtrl jump, RShift aim up, . shoot, / bomb, , ult) or a 2nd gamepad.
// F2 toggles 2P (title / map / select), ` picks P2's hero. P2 is a second player object swapped in as G.player while it is being updated.
let COOP = false, P2CH = null, CTX = 1, DRAW2 = false;
const keys2 = {}, pressed2 = {}; let pad2 = {}, pad2Prev = {};
const K2 = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down', ArrowUp: 'jump', ControlRight: 'jump', ShiftRight: 'up', Period: 'shoot', Slash: 'bomb', Comma: 'ult' };
const KM_ARROWS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down', ArrowUp: 'up' };
{
  const unlockedKeys = () => CHAR_KEYS.filter(k => { try { return isUnlocked(k); } catch (e) { return true; } });
  function setCoop(on) {
    COOP = !!on;
    if (COOP) { for (const c in KM_ARROWS) delete KEYMAP[c]; KEYMAP.KeyQ = 'up'; if (!P2CH) { const u = unlockedKeys(); P2CH = u[(Math.random() * u.length) | 0] || 'shaolin'; } }
    else { Object.assign(KEYMAP, KM_ARROWS); delete KEYMAP.KeyQ; }
    for (const k in keys) keys[k] = false; for (const k in keys2) keys2[k] = false;
  }
  function nextP2() { const u = unlockedKeys(); const i = u.indexOf(P2CH); P2CH = u[(i + 1) % u.length]; }
  addEventListener('keydown', e => {
    if (e.code === 'F2' && !e.repeat && (G.mode === 'title' || G.mode === 'map' || G.mode === 'select')) { e.preventDefault(); setCoop(!COOP); audio.play('check'); return; }
    if (e.code === 'Backquote' && !e.repeat && COOP && (G.mode === 'select' || G.mode === 'map' || G.mode === 'title')) { e.preventDefault(); nextP2(); audio.play('bounce'); return; }
    if (!COOP) return;
    const a = K2[e.code]; if (!a) return;
    if (!keys2[a]) pressed2[a] = true; keys2[a] = true; e.preventDefault();
  });
  addEventListener('keyup', e => { const a = K2[e.code]; if (a) { keys2[a] = false; if (COOP) e.preventDefault(); } });
  addEventListener('blur', () => { for (const k in keys2) keys2[k] = false; });
  window.__coop = { set: setCoop, p2: c => { P2CH = c; }, keys2, get on() { return COOP; } };

  const _poll = pollPad;
  pollPad = function () {
    _poll();
    pad2 = {};
    if (COOP) {
      const gps = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : [];
      const g = gps[1];
      if (g) {
        const ax = g.axes[0] || 0, ay = g.axes[1] || 0, b = i => g.buttons[i] && g.buttons[i].pressed;
        pad2.left = ax < -0.4 || b(14); pad2.right = ax > 0.4 || b(15); pad2.up = ay < -0.55 || b(12); pad2.down = ay > 0.55 || b(13);
        pad2.jump = b(0); pad2.shoot = b(2) || b(7); pad2.bomb = b(1) || b(6); pad2.ult = b(3);
        for (const k in pad2) if (pad2[k] && !pad2Prev[k]) pressed2[k] = true;
      }
    }
    pad2Prev = pad2;
  };
  const _held = held;
  held = function (a) { if (CTX === 2) return !NOINPUT && !!(keys2[a] || pad2[a]); return _held(a); };

  // delayed callbacks keep the player they were scheduled by
  const _later = later;
  later = function (t, fn) {
    const who = G.player;
    return _later(t, () => {
      if (!COOP || !G.p2 || who === G.player || who !== G.p2) return fn();
      const sv = G.player, c = CTX; G.player = who; CTX = 2;
      try { return fn(); } finally { G.player = sv; CTX = c; }
    });
  };

  const _upd = updatePlayer, _projs = updProjs, _bike = updWahBike, _heli = updHeli;
  updWahBike = function () { if (CTX === 2) return; return _bike.apply(this, arguments); };
  updHeli = function () { if (CTX === 2) return; return _heli.apply(this, arguments); };
  updatePlayer = function (dt, ip) {
    _upd.call(this, dt, ip);
    if (!COOP || !G.p2 || G.mode !== 'play') return;
    const p1 = G.player, p2 = G.p2;
    if (G.cine) { p2.x = p1.x - 6; p2.y = p1.y; p2.vx = p2.vy = 0; p2.dead = false; return; }
    const ip2 = Object.assign({}, pressed2); for (const k in pressed2) delete pressed2[k];
    const jeep = G.jeep; G.jeep = null; updProjs = () => { };
    CTX = 2; G.player = p2;
    try { _upd.call(this, dt, ip2); }
    finally { G.p2 = G.player; G.player = p1; CTX = 1; updProjs = _projs; G.jeep = jeep; }
  };
  const _resp = respawn;
  respawn = function () {
    if (CTX !== 2) return _resp.apply(this, arguments);
    const ch = CHOSEN; CHOSEN = P2CH;
    try { return _resp.apply(this, arguments); } finally { CHOSEN = ch; }
  };
  const _ng = newGame;
  newGame = function (mode) {
    _ng.apply(this, arguments);
    G.p2 = null;
    if (COOP && mode === 'play') { const p = G.player; G.p2 = mkPlayer(p.x + 14, p.y, P2CH || 'shaolin'); G.p2.bombs = 3; }
  };
  // enemies and bosses go for whichever player is closest
  function nearest(e) { const a = G.player, b = G.p2; if (!b || b.dead) return a; if (a.dead) return b; return Math.abs(b.x - e.x) + Math.abs(b.y - e.y) * 0.5 < Math.abs(a.x - e.x) + Math.abs(a.y - e.y) * 0.5 ? b : a; }
  const _ue = updEnemy, _ub = updBoss;
  const swapRun = (f, e, dt) => { const t = (COOP && G.p2 && CTX !== 2 && G.mode === 'play') ? nearest(e) : G.player; if (t === G.player) return f(e, dt); const p1 = G.player; G.player = t; try { return f(e, dt); } finally { G.player = p1; } };
  updEnemy = function (e, dt) { return swapRun(_ue, e, dt); };
  updBoss = function (b, dt) { return swapRun(_ub, b, dt); };
  // damage that only checks the first player
  const _hurt = hurtPlayer;
  const _expl2 = explode;
  explode = function (x, y, r, dmg, o) {
    const res = _expl2.apply(this, arguments); o = o || {};
    if (COOP && G.p2 && !G.p2.dead && !o.noDmg && !o.noSelf && CTX !== 2) {
      const p = G.p2, d = Math.hypot(p.x + p.w / 2 - x, p.y + p.h / 2 - y), pr = o.byPlayer ? r * 0.42 : (o.barrel ? r * 0.6 : r * 0.75);
      const p1 = G.player;
      if (d < pr) { G.player = p; try { _hurt(1, x); } finally { G.player = p1; } } else if (d < r * 1.3) p.vx += sign(p.x + p.w / 2 - x) * 90;
    }
    return res;
  };
  const _step = step;
  step = function (dt, ip) {
    _step.call(this, dt, ip);
    if (!COOP || !G.p2 || G.mode !== 'play' || G.cine) return;
    const p1 = G.player, p2 = G.p2;
    if (!p2.dead) for (let i = G.ebullets.length - 1; i >= 0; i--) {
      const b = G.ebullets[i];
      if (b.x > p2.x - 1.5 && b.x < p2.x + p2.w + 1.5 && b.y > p2.y - 1.5 && b.y < p2.y + p2.h + 1.5) { G.ebullets.splice(i, 1); G.player = p2; try { _hurt(1, b.x - b.vx); } finally { G.player = p1; } }
    }
    // keep both inside the camera / arena; if one is left far behind, bring them up
    const L = G.cam.lock;
    for (const q of [p1, p2]) {
      if (q.dead) continue;
      if (L) q.x = clamp(q.x, L.x0 + 2, L.x1 - q.w - 2);
      if (q.x < G.cam.x + 4) { q.x = G.cam.x + 4; if (q.vx < 0) q.vx = 0; }
      if (q.x + q.w > G.cam.x + VW - 4) { q.x = G.cam.x + VW - 4 - q.w; if (q.vx > 0) q.vx = 0; }
    }
    if (!p1.dead && !p2.dead && Math.abs(p1.x - p2.x) > VW * 0.7) {
      const lead = p1.x > p2.x ? p1 : p2, trail = lead === p1 ? p2 : p1;
      trail.x = lead.x - 12 * lead.face; trail.y = lead.y; trail.vx = trail.vy = 0; trail.inv = Math.max(trail.inv, 0.8);
      popup(trail.x + 5, trail.y - 14, 'KEEP UP!', '#ffe48a');
    }
  };
  const _cam = updateCamera;
  updateCamera = function (dt) {
    if (!COOP || !G.p2 || G.cine || G.mode !== 'play') return _cam.call(this, dt);
    const a = G.player, b = G.p2; let t = a;
    if (a.dead && !b.dead) t = b; else if (!a.dead && !b.dead) { t = Object.create(a); t.x = (a.x + b.x) / 2; t.y = (a.y + b.y) / 2; }
    G.player = t; try { return _cam.call(this, dt); } finally { G.player = a; }
  };
  // draw P2 right after P1, with floating P1/P2 tags
  function tag(p, s, col) {
    const x = Math.round(p.x + p.w / 2), y = Math.round(p.y - (p.ch === 'wah' ? 24 : 26) - Math.sin(G.clock * 4) * 1.2);
    ctx.fillStyle = col; ctx.fillRect(x - 8, y - 9, 16, 9); ctx.fillRect(x - 1, y, 3, 2); ctx.fillRect(x, y + 2, 1, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText(s, x, y - 2); ctx.textAlign = 'left';
  }
  const _dp = drawPlayer;
  drawPlayer = function (p) {
    _dp.call(this, p);
    if (!COOP || !G.p2 || DRAW2 || p !== G.player || G.mode === 'select' || G.mode === 'title' || G.cine) return;
    tag(p, 'P1', '#2a7ad8');
    DRAW2 = true; const sv = G.player; G.player = G.p2;
    try { _dp.call(this, G.p2); tag(G.p2, 'P2', '#d83a2a'); } finally { G.player = sv; DRAW2 = false; }
  };
  const _hud = drawHUD;
  drawHUD = function () {
    _hud.apply(this, arguments);
    if (!COOP || !G.p2) return;
    const p = G.p2; ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(VW - 118, 36, 114, 20);
    ctx.fillStyle = '#d83a2a'; ctx.fillRect(VW - 116, 38, 14, 8); ctx.fillStyle = '#fff'; ctx.font = 'bold 7px monospace'; ctx.fillText('P2', VW - 114, 45);
    for (let i = 0; i < PC.hp; i++) { ctx.fillStyle = i < p.hp ? '#e02a2a' : '#3a2a2a'; ctx.fillRect(VW - 98 + i * 9, 39, 7, 6); }
    ctx.fillStyle = '#ddd'; ctx.fillText((heroOf(p).name || '').slice(0, 18), VW - 114, 53);
  };
  const _rend = render;
  render = function () {
    _rend.apply(this, arguments);
    if (G.mode === 'select' || G.mode === 'title' || G.mode === 'map') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(VW / 2 - 130, VH - 22, 260, 14);
      ctx.fillStyle = COOP ? '#7dff9a' : '#bbb'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center';
      ctx.fillText('F2: 2 PLAYERS ' + (COOP ? 'ON  P2=' + ((CHARS[P2CH] && CHARS[P2CH].name) || P2CH) + '  ( ` change )' : 'OFF'), VW / 2, VH - 12); ctx.textAlign = 'left';
    }
  };
}
