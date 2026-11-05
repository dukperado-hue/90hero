// =====================================================================
// v26 — RESCUE THE STUNT DOUBLES (the Broforce loop, film-set flavour).
// Every stage hides ~5 cages with a tied-up stunt double inside. Break a cage (shoot, hit, blow it up) and:
//   +1 TAKE (a life)  ·  the double is a random unlocked hero and TAKES OVER the role on the spot (H keeps your hero).
// You start each stage with 5 takes. Lose them all and it's "THAT'S A WRAP": back to the last checkpoint with 3 takes.
// =====================================================================
const CG = { g: null, list: [] };
const TAKES0 = 5, TAKESMAX = 9;
let SWAPMODE = (() => { try { return localStorage.getItem('omr_swap') !== 'keep'; } catch (e) { return true; } })();
function cagesInit() {
  if (CG.g === G) return; CG.g = G; CG.list = [];
  if (G.takes === undefined) G.takes = TAKES0;
  if (G.mode !== 'play') return;
  const cells = [], arena = (STAGE === 1 || STAGE === 2 || STAGE === 5) ? ARENA.x0 - 6 : 1e9;
  for (let tx = 6; tx < LW - 6; tx++) for (let ty = 2; ty < LH - 1; ty++) {
    const below = tileAt(tx, ty + 1);
    if (tileAt(tx, ty) !== T.E || tileAt(tx, ty - 1) !== T.E || tileAt(tx + 1, ty) !== T.E || tileAt(tx + 1, ty - 1) !== T.E) continue;
    if (!(SOLID[below] || below === T.P) || !(SOLID[tileAt(tx + 1, ty + 1)] || tileAt(tx + 1, ty + 1) === T.P)) continue;
    if (STAGE !== 4 && tx > arena) continue;
    if (STAGE === 3 && tx > DOCK.gate - 4) continue;
    if (STAGE === 6 && tx > S6.gate - 4) continue;
    if (STAGE === 5 && (tx > 432 || tx < S5.hillEnd + 8)) continue;
    if ((LOCKS || []).some(L => tx >= L.x0 - 1 && tx <= L.x1 + 1)) continue;
    cells.push({ tx, ty, prog: STAGE === 4 ? (LH - ty) * 40 + tx * 0.01 : tx });
  }
  if (!cells.length) return;
  cells.sort((a, b) => a.prog - b.prog);
  const lo = cells[0].prog, hi = cells[cells.length - 1].prog, N = 5;
  for (let k = 0; k < N; k++) {
    const want = lo + (hi - lo) * (k + 0.6) / (N + 0.2);
    let best = null; for (const c of cells) if (c.prog > lo + 18 && (!best || Math.abs(c.prog - want) < Math.abs(best.prog - want))) best = c;
    if (best && !CG.list.some(q => Math.abs(q.tx - best.tx) < 6 && Math.abs(q.ty - best.ty) < 3)) CG.list.push({ tx: best.tx, ty: best.ty, x: best.tx * TS, y: (best.ty + 1) * TS - 26, w: 26, h: 26, hp: 3, open: false, t: 0, ph: Math.random() * 6 });
  }
}
function pickDouble() {
  const pool = CHAR_KEYS.filter(k => isUnlocked(k) && k !== G.player.ch && k !== 'zhang');
  return pool.length ? pool[(Math.random() * pool.length) | 0] : G.player.ch;
}
function hitCage(c, dmg, dir) {
  if (c.open) return; c.hp -= dmg; c.flash = 0.08; audio.play('tile');
  debris(c.x + 13, c.y + 10, 3, ['#7a5a32', '#a88050', '#3a3a3a'], 0.8);
  if (c.hp <= 0) freeCage(c, dir || 1);
}
function freeCage(c, dir) {
  c.open = true; c.t = 0; G.stats.rescued = (G.stats.rescued || 0) + 1;
  debris(c.x + 13, c.y + 12, 14, ['#7a5a32', '#a88050', '#3a3a3a', '#c8c8c8'], 1.3); audio.play('crate'); shake(0.15);
  G.takes = Math.min(TAKESMAX, (G.takes || 0) + 1);
  const p = G.player;
  popup(c.x + 13, c.y - 14, '+1 TAKE!', '#7dff8a', true);
  if (p.dead || !SWAPMODE) { popup(c.x + 13, c.y - 26, '"THANKS, BOSS!"', '#ffffff'); return; }
  const k = pickDouble(); c.who = k;
  later(0.35, () => swapHero(k, c));
}
function swapHero(k, c) {
  const p = G.player; if (!p || p.dead || G.mode !== 'play' || G.cine) return;
  G.actor = k;
  const np = mkPlayer(p.x + p.w / 2 - (k === 'wah' ? 10 : PC.w / 2), p.y + p.h - PC.standH, k);
  np.inv = 1.0; np.face = p.face; np.vx = p.vx * 0.5; np.bombs = Math.max(p.bombs, 3);
  G.player = np; G.wbike = null; if (k === 'wah' && typeof wahDismount === 'function') { /* starts on the bike */ }
  for (let i = 0; i < 14; i++) part('smoke', np.x + np.w / 2 + rnd(-10, 10), np.y + rnd(0, np.h), rnd(-80, 80), rnd(-80, 0), rnd(0.5, 0.9), 4, '#e8e0d0', { grow: 8, a: 0.6 });
  G.banner = { t: 0, title: 'STUNT DOUBLE: ' + CHARS[k].name, sub: '"I\'LL TAKE IT FROM HERE."' };
  audio.play('roar'); later(0.6, heroQuip);
}
function updCages(dt) {
  cagesInit();
  const p = G.player;
  if (G.cam.lock && !p.dead && G.mode === 'play' && !G.cine && STAGE !== 4) {     // safety: nobody leaves a locked arena over the top of its wall
    const L = G.cam.lock;
    if (p.x < L.x0 - 6 || p.x + p.w > L.x1 + 6 || p.y + p.h < 0) { p.x = clamp(p.x, L.x0 + 24, L.x1 - 48); p.y = groundBelow(p.x + p.w / 2, Math.max(0, G.cam.y) + 8) - p.h; p.vx = p.vy = 0; p.inv = Math.max(p.inv, 0.6); }
  }
  for (const c of CG.list) {
    c.ph += dt; c.flash = (c.flash || 0) - dt; if (c.open) { c.t += dt; continue; }
    if (c.x + c.w < G.cam.x - 40 || c.x > G.cam.x + VW + 40) continue;
    for (let i = G.bullets.length - 1; i >= 0; i--) { const b = G.bullets[i]; if (b.x > c.x && b.x < c.x + c.w && b.y > c.y && b.y < c.y + c.h) { hitCage(c, 1, sign(b.vx)); G.bullets.splice(i, 1); if (c.open) break; } }
    if (c.open) continue;
    for (const q of G.projs || []) if (!q.dead && q.x > c.x && q.x < c.x + c.w && q.y > c.y && q.y < c.y + c.h) { hitCage(c, 3, sign(q.vx)); break; }
    if (!c.open && !p.dead && (p.swingT > 0 || Math.abs(p.vx) > 300 || p.ramT > 0) && overlap({ x: p.x - 10, y: p.y, w: p.w + 20, h: p.h }, c) && !(c.meleeCd > 0)) { c.meleeCd = 0.18; hitCage(c, 1, p.face); }
    c.meleeCd = (c.meleeCd || 0) - dt;
    if (!c.told && !p.dead && Math.abs(p.x - c.x) < 120 && Math.abs(p.y - c.y) < 80) { c.told = true; popup(c.x + 13, c.y - 12, ['"HELP! I\'M THE STUNT DOUBLE!"', '"GET ME OUTTA HERE!"', '"I KNOW THE MOVES! LET ME OUT!"'][(Math.random() * 3) | 0], '#ffffff'); }
  }
}
function cageBlast(x, y, r) { for (const c of CG.list) if (!c.open && Math.abs(c.x + 13 - x) < r + 13 && Math.abs(c.y + 13 - y) < r + 13) hitCage(c, 3, sign(c.x + 13 - x)); }
function drawCages(cam) {
  if (CG.g !== G) return;
  const t = G.clock;
  for (const c of CG.list) {
    if (c.x + c.w < cam.x - 20 || c.x > cam.x + VW + 20) continue;
    const x = c.x, y = c.y, F = c.flash > 0;
    if (c.open) {                                     // broken bars on the floor + a little smoke for a moment
      ctx.fillStyle = '#5a4228'; ctx.fillRect(x + 2, y + 24, 22, 2); ctx.fillRect(x + 4, y + 21, 2, 4); ctx.fillRect(x + 19, y + 22, 2, 3);
      continue;
    }
    // the stunt double inside: tied to a chair, wriggling, a speech dot
    const wig = Math.sin(c.ph * 6) * 1;
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x + 8, y + 16, 10, 8); ctx.fillStyle = '#5a3a20'; ctx.fillRect(x + 7, y + 22, 2, 4); ctx.fillRect(x + 17, y + 22, 2, 4);
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x + 9 + wig, y + 9, 8, 9); ctx.fillStyle = '#c84a3a'; ctx.fillRect(x + 9 + wig, y + 13, 8, 1.5);
    ctx.fillStyle = '#d8a878'; ctx.fillRect(x + 10 + wig, y + 3, 6, 6); ctx.fillStyle = '#1a1414'; ctx.fillRect(x + 10 + wig, y + 2, 6, 2);
    ctx.fillStyle = '#f0f0f0'; ctx.fillRect(x + 10 + wig, y + 6, 6, 1.5);   // gag
    ctx.fillStyle = '#b89a5a'; ctx.fillRect(x + 8 + wig, y + 11, 10, 1); ctx.fillRect(x + 8 + wig, y + 15, 10, 1);   // rope
    // the cage: bamboo bars, lashed corners, a padlock
    ctx.fillStyle = F ? '#ffffff' : '#8a6a3a'; ctx.fillRect(x, y, 26, 2); ctx.fillRect(x, y + 24, 26, 2);
    for (let k = 0; k < 6; k++) { ctx.fillStyle = F ? '#ffffff' : (k % 2 ? '#a8844a' : '#94743e'); ctx.fillRect(x + 1 + k * 4.8, y + 2, 2, 22); ctx.fillStyle = '#5a4228'; ctx.fillRect(x + 1 + k * 4.8, y + 8, 2, 0.8); ctx.fillRect(x + 1 + k * 4.8, y + 16, 2, 0.8); }
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(x + 22, y + 12, 4, 4); ctx.fillStyle = '#8a6a1a'; ctx.fillRect(x + 23, y + 10, 2, 2);
    if (c.hp < 3) { ctx.fillStyle = '#2a1a0a'; ctx.fillRect(x + 6, y + 6, 1, 6); ctx.fillRect(x + 15, y + 14, 1, 5); }
    // a bobbing marker so it reads at a glance
    const by = y - 10 + Math.sin(t * 4 + c.ph) * 2;
    ctx.fillStyle = '#7dff8a'; ctx.beginPath(); ctx.moveTo(x + 9, by); ctx.lineTo(x + 17, by); ctx.lineTo(x + 13, by + 5); ctx.fill();
  }
}
function drawTakesHUD() {                            // under the hearts: how many takes are left
  if (G.mode !== 'play' || G.takes === undefined) return;
  const x = 8, y = 36;
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x, y, 66, 11);
  ctx.fillStyle = '#e8e0d0'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('TAKES', x + 3, y + 6);
  for (let k = 0; k < Math.min(G.takes, TAKESMAX); k++) { const cx = x + 30 + k * 4; ctx.fillStyle = G.takes <= 1 ? '#ff5a3a' : '#ffd23f'; ctx.fillRect(cx, y + 2, 3, 7); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(cx, y + 4, 3, 1); }
}
function takesOnDeath() {                         // called once per death, as the player respawns
  G.takes = (G.takes === undefined ? TAKES0 : G.takes) - 1;
  if (G.takes > 0) return false;
  // out of takes: "THAT'S A WRAP" — the director resets the scene to the last checkpoint with 3 takes and the cages restocked
  G.takes = 3; G.stats.wraps = (G.stats.wraps || 0) + 1;
  G.banner = { t: 0, title: "THAT'S A WRAP.", sub: 'OUT OF TAKES — RESET TO THE LAST MARK. 3 TAKES.' }; audio.play('die');
  for (const c of CG.list) if (c.open && Math.abs(c.x - G.cp.x) > 200) { c.open = false; c.hp = 3; c.told = false; }
  return false;
}
function cycleSwap() { SWAPMODE = !SWAPMODE; try { localStorage.setItem('omr_swap', SWAPMODE ? 'swap' : 'keep'); } catch (e) {} return SWAPMODE ? 'RESCUED DOUBLES TAKE OVER (BROFORCE STYLE)' : 'KEEP MY HERO (RESCUE = +1 TAKE ONLY)'; }
