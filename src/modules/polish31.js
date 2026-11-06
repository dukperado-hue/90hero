// v31 polish (from the Broforce comparison): 2) less on-screen text   3) secret brick stashes + diggers who hit walls hard
// ---- 2. less text: at most 3 small call-outs and 2 big ones alive at once; hints wrapped + clamped inside the screen; a soft strip keeps the HUD readable over sprites
{
  const _pop = popup;
  popup = function (x, y, s, col, big, key) {
    let small = 0, large = 0; for (const q of G.popups) { if (q.t >= q.max) continue; if (q.big) large++; else small++; }
    if (!key && (big ? large >= 2 : small >= 3)) { if (!big) return; const old = G.popups.find(q => q.big && !q.key); if (old) old.t = old.max; }
    return _pop(x, y, s, col, big, key);
  };
  const _hud = drawHUD;
  drawHUD = function () {
    if (G.mode === 'play') { const g = ctx.createLinearGradient(0, 0, 0, 40); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, 40); }
    return _hud();
  };
  drawHints = function (cam) {
    ctx.font = '8px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    const footWah = G.player && G.player.ch === 'wah' && G.player.foot, pcx = G.player.x + G.player.w / 2;
    for (const h0 of G.hints) {
      const s0 = footWah ? (h0.g || h0.s) : h0.s; if (h0.x > cam.x + VW || h0.x + 260 < cam.x) continue;
      const hd = Math.abs(h0.x + 60 - pcx); ctx.globalAlpha = G.mode === 'play' ? clamp(1 - (hd - 140) / 160, 0.12, 1) * (G.cam.lock ? 0.45 : 1) : 1;
      const words = s0.split(' '), lines = []; let cur = '';                                  // wrap to the visible width (max ~46 chars)
      for (const w of words) { if ((cur + ' ' + w).trim().length > 46) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } lines.push(cur);
      let wmax = 0; for (const l of lines) wmax = Math.max(wmax, ctx.measureText(l).width);
      const x = clamp(h0.x, cam.x + 6, cam.x + VW - wmax - 8);
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x - 3, h0.y - 2, wmax + 6, 11 * lines.length);
      ctx.fillStyle = '#ffe9b8'; lines.forEach((l, i) => ctx.fillText(l, x, h0.y + i * 10));
    }
    ctx.globalAlpha = 1;
  };
}
// ---- 3. diggers: heavy hitters break tiles faster, so walls and floors are real shortcuts for them
const DIGGERS = new Set(['juk', 'gada', 'madong', 'singham']);
{
  const _ms = meleeSwing;
  meleeSwing = function (p, o) {
    if (p && DIGGERS.has(p.ch) && o && o.dmg > 0) o = Object.assign({}, o, { tile: Math.max(o.tile || 1, 3) });
    return _ms(p, o);
  };
}
// ---- 3. secret stashes: a small brick-walled room hiding a heart and ammo. Crack the bricks open (any hit works, diggers are fast).
const STASH = { tiles: new Set() };
function carveStashes() {
  STASH.tiles = new Set(); STASH.said = false; const found = [];
  const topOf = tx => { for (let ty = 0; ty < LH; ty++) { const t = tileAt(tx, ty); if (t === T.G || t === T.H) return ty; if (t === T.S || t === T.P || t === T.D || t === T.B || t === T.C) return -1; } return -1; };
  const busy = (tx0, tx1) => {
    for (const e of G.enemies) if (e.x / TS > tx0 - 1 && e.x / TS < tx1 + 1) return true;
    for (const b of G.barrels) if (b.x / TS > tx0 - 2 && b.x / TS < tx1 + 2) return true;
    for (const c of G.checkpoints) if (c.x / TS > tx0 - 1 && c.x / TS < tx1 + 1) return true;
    for (const L of (LOCKS || [])) if ((L.x1 > tx0 - 3 && L.x1 < tx1 + 3) || (L.x0 > tx0 - 3 && L.x0 < tx1 + 3)) return true;
    if (typeof ARENA !== 'undefined' && ARENA && ARENA.x1 > tx0 - 3 && ARENA.x0 < tx1 + 3 && STAGE !== 3) return true;
    if (G.flag && Math.abs(G.flag.x / TS - tx0) < 10) return true;
    return Math.abs(G.player.x / TS - tx0) < 12;
  };
  for (let tx = 30; tx < LW - 40 && found.length < 3; tx += 1) {
    if (found.length && tx - found[found.length - 1] < 55) continue;
    const y0 = topOf(tx); if (y0 < 0) continue;
    let ok = true; for (let k = 0; k < 6 && ok; k++) { if (topOf(tx + k) !== y0) ok = false; for (let r = 1; r <= 5 && ok; r++) if (tileAt(tx + k, y0 - r) !== T.E) ok = false; }
    if (!ok || busy(tx, tx + 6)) continue;
    for (let k = 0; k < 6; k++) setTile(tx + k, y0 - 4, T.B);                                   // roof
    for (const k of [0, 5]) for (let r = 1; r <= 3; r++) setTile(tx + k, y0 - r, T.B);           // side walls
    for (let k = 0; k < 6; k++) for (let r = 4; r >= 1; r--) if (tileAt(tx + k, y0 - r) === T.B) STASH.tiles.add((y0 - r) * LW + tx + k);
    const gx = (tx + 2) * TS, gy = y0 * TS;
    G.pickups.push({ x: gx + 2, y: gy - 10, w: 8, h: 8, vx: 0, vy: 0, type: 'hp', t: 0, onGround: false });
    G.pickups.push({ x: gx + 20, y: gy - 10, w: 8, h: 8, vx: 0, vy: 0, type: 'bomb', t: 0, onGround: false });
    G.hints.push({ x: tx * TS - 4, y: (y0 - 6) * TS, s: 'CRACKED BRICKS...  SOMETHING SMELLS GOOD.', g: 'CRACKED BRICKS...  SOMETHING SMELLS GOOD.' });
    found.push(tx);
  }
  return found.length;
}
{
  const _ng = newGame;
  newGame = function (mode) {
    const r = _ng.apply(this, arguments);
    try { if (G.mode === 'play') carveStashes(); else STASH.tiles = new Set(); } catch (e) { console.warn('stash', e); }
    return r;
  };
  const _dt = destroyTile;
  destroyTile = function (tx, ty) {
    const hit = STASH.tiles.has(ty * LW + tx);
    _dt(tx, ty);
    if (hit && !STASH.said && G.mode === 'play') { STASH.said = true; popup(tx * TS, ty * TS - 10, 'SECRET STASH!', '#ffd23f', true); audio.play('clang'); }
  };
}
