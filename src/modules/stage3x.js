// =====================================================================
// v25 — STAGE 03 EXTENDED: market street → the railway terminus → studio lot 7 → the docks at night.
// Four Gemini paintings blend into one another as you walk; the playfield gets real architecture
// (awnings on posts, stall counters, a parked local train, studio scaffolding) and a foreground layer.
// =====================================================================
const S3X = { W: 432, station: 150, studio: 262, docks: 340, train: [[170, 185], [188, 203], [206, 221], [224, 239]] };
const LOCKS3X = [
  { x0: 40, x1: 70, trig: 47, waves: [
    [['soldier', 66], ['soldier', 63], ['gunner', 44]],
    [['heavy', 65], ['soldier', 45], ['soldier', 56]]
  ] },
  { x0: 100, x1: 130, trig: 107, waves: [
    [['soldier', 126], ['gunner', 104], ['soldier', 120]],
    [['heavy', 103], ['soldier', 127], ['gunner', 118], ['soldier', 110]]
  ] },
  { x0: 200, x1: 236, trig: 208, waves: [                         // THE TERMINUS: they come off the train
    [['knife', 234], ['soldier', 202], ['gunner', 228]],
    [['shield', 233], ['knife', 203], ['bomber', 220], ['soldier', 212]]
  ] },
  { x0: 296, x1: 332, trig: 304, waves: [                         // STUDIO LOT 7: the stuntmen are not acting
    [['soldier', 330], ['soldier', 298], ['heavy', 318]],
    [['knife', 331], ['knife', 297], ['gunner', 310], ['bomber', 326]],
    [['shield', 330], ['heavy', 299], ['soldier', 315]]
  ] }
];
const S3IMG = {};
(() => { for (const [k, src] of [['station', typeof S3_STATION_SRC !== 'undefined' && S3_STATION_SRC], ['studio', typeof S3_STUDIO_SRC !== 'undefined' && S3_STUDIO_SRC], ['docks', typeof S3_DOCKS_SRC !== 'undefined' && S3_DOCKS_SRC]]) if (src) { const im = new Image(); im.onload = () => { S3IMG[k] = im; }; im.src = src; } })();
function buildStage3X(E, set, fill, en, br, cp, hint) {
  LOCKS = LOCKS3X; S3X.runs = []; S3X.danced = false; S3X.exT = 6; S3X.ex = null; G.danceT = 0;
  fill(0, DOCK.pier - 1, 18, LH - 1, T.G);
  fill(0, 1, 0, 17, T.S); fill(DOCK.deck1 + 1, LW - 1, 0, LH - 1, T.E); fill(LW - 2, LW - 1, 0, LH - 1, T.S);
  // ---------- A. THE MARKET STREET (the original v22 street) ----------
  hint(4, 12, 'MUMBAI.  SOMEONE PARKED A GUNBOAT IN THE FOREGROUND.');
  hint(10, 9, 'RED CIRCLE ON THE GROUND = SHELL INCOMING. MOVE!');
  fill(8, 13, 14, 14, T.P); fill(18, 24, 14, 14, T.P); fill(28, 33, 14, 14, T.P);
  fill(14, 15, 17, 17, T.C); br(21, 18); br(22, 18); br(23, 18); fill(26, 26, 16, 17, T.B);
  en('soldier', 11, 14); en('soldier', 20, 14); en('gunner', 31, 14); en('soldier', 25, 18); en('soldier', 35, 18);
  cp(37);
  fill(48, 54, 14, 14, T.P); fill(58, 64, 14, 14, T.P); fill(60, 63, 11, 11, T.P); br(51, 18); br(52, 18); br(60, 18); fill(56, 56, 16, 17, T.C);
  fill(74, 80, 14, 14, T.P); fill(84, 90, 14, 14, T.P); fill(82, 83, 16, 17, T.B); br(76, 18); br(77, 18); br(78, 18); br(79, 18);
  en('heavy', 88, 18); en('soldier', 75, 14); en('gunner', 87, 14); en('shield', 93, 18);
  hint(72, 9, 'THE TUK-TUK RANK IS FULL OF GAS. YOU KNOW WHAT TO DO.');
  cp(96);
  fill(108, 114, 14, 14, T.P); fill(118, 124, 14, 14, T.P); fill(120, 123, 11, 11, T.P); br(112, 18); br(116, 18); br(117, 18);
  cp(134);
  fill(138, 144, 14, 14, T.P); br(140, 18); br(141, 18); en('soldier', 139, 14); en('bomber', 143, 18);
  // ---------- B. THE RAILWAY TERMINUS ----------
  cp(152);
  hint(152, 9, 'THE TERMINUS, 1985.  THE 6:15 FAST IS NEVER ON TIME.');
  fill(164, 167, 15, 15, T.P);                                                      // the chai stall roof: the step up
  for (const [a, b] of S3X.train) fill(a, b, 14, 14, T.P);                          // carriage roofs
  fill(192, 194, 12, 12, T.P); fill(196, 214, 10, 10, T.P); fill(216, 218, 12, 12, T.P);   // the footbridge and its stairs
  en('soldier', 175, 14); en('gunner', 182, 14); en('knife', 178, 18); en('soldier', 196, 18); en('gunner', 205, 10);
  en('soldier', 228, 14); en('knife', 238, 18); en('gunner', 236, 14);
  br(168, 18); br(186, 18); br(187, 18); br(244, 18); br(245, 18); fill(250, 251, 17, 17, T.C);
  en('bomber', 248, 18); en('soldier', 256, 18);
  // ---------- C. STUDIO LOT 7 ----------
  cp(262);
  hint(264, 9, 'STUDIO LOT 7.  QUIET ON SET!  (NOBODY IS QUIET.)');
  fill(270, 276, 14, 14, T.P); fill(280, 282, 15, 15, T.P); fill(284, 290, 12, 12, T.P);   // scenery flats on scaffolds
  fill(296, 302, 14, 14, T.P); fill(305, 311, 11, 11, T.P); fill(316, 322, 14, 14, T.P); fill(325, 327, 15, 15, T.P);
  en('soldier', 273, 14); en('gunner', 287, 12); en('heavy', 292, 18); en('soldier', 308, 11);
  br(278, 18); br(279, 18); br(294, 18); br(313, 18); br(314, 18); br(334, 18);
  // ---------- D. THE DOCKS (the gunboat comes in at night) ----------
  cp(340);
  fill(342, 343, 16, 17, T.C); fill(344, 344, 17, 17, T.C); br(346, 18);
  hint(350, 9, 'THE DOCKS  >>');
  E.start = { x: 4 * TS, y: 18 * TS - PC.standH };
  E.flag = { x: (DOCK.gate + 12) * TS, y: 18 * TS };
  // remember every platform run so the playfield can draw real structures under them
  for (let ty = 0; ty < 18; ty++) { let a = -1; for (let tx = 0; tx <= LW; tx++) { const on = tx < LW && tiles[ty * LW + tx] === T.P; if (on && a < 0) a = tx; if (!on && a >= 0) { S3X.runs.push({ a, b: tx - 1, ty }); a = -1; } } }
  return E;
}
const s3zone = tx => tx < S3X.station ? 'market' : tx < S3X.studio ? 'station' : tx < S3X.docks ? 'studio' : 'docks';
// ---------------- the playfield skin (painted straight into the level canvas) ----------------
const S3AWN = { market: [['#e8406a', '#fff0d0'], ['#ffb020', '#c8401a'], ['#2ab0c8', '#f0f0e0'], ['#7ac83a', '#fff0d0'], ['#b04ad0', '#ffd23f']], studio: [['#5a4a3a', '#7a6a52']] };
function skin3(g, t, tx, ty, x, y, i) {
  if (t === T.P) {
    const z = s3zone(tx);
    if (z === 'station') {                       // carriage roofs and the footbridge: curved grey steel
      const roof = S3X.train.some(([a, b]) => tx >= a && tx <= b) && ty === 14;
      g.fillStyle = roof ? '#7a7e86' : '#5a4a42'; g.fillRect(x, y, TS, 5);
      g.fillStyle = roof ? '#a8acb4' : '#8a6a52'; g.fillRect(x, y, TS, 1.5);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, y + 4, TS, 1);
      if (roof) { g.fillStyle = '#4a4e56'; g.fillRect(x + (tx % 2) * 8 + 3, y + 1.5, 2, 1); }
      else { g.fillStyle = '#3a2a22'; for (let k = 0; k < TS; k += 4) g.fillRect(x + k, y + 5, 1, 4); g.fillRect(x, y + 8, TS, 1); }
      return true;
    }
    if (z === 'studio') {                         // scaffold planks
      g.fillStyle = '#8a6a42'; g.fillRect(x, y, TS, 4); g.fillStyle = '#b08a5a'; g.fillRect(x, y, TS, 1);
      g.fillStyle = '#5a4228'; g.fillRect(x + ((tx * 5) % 12), y + 1, 1, 3); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, y + 4, TS, 1);
      return true;
    }
    if (z === 'docks') return false;
    // market: a striped cloth awning with a scalloped edge (colour set per run)
    const run = (tx * 0 + ty * 3 + Math.floor(tx / 9)) % S3AWN.market.length, [c1, c2] = S3AWN.market[run];
    for (let k = 0; k < TS; k += 4) { g.fillStyle = ((k / 4 + tx * 4) % 2) ? c2 : c1; g.fillRect(x + k, y, 4, 5); }
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(x, y, TS, 1);
    for (let k = 0; k < TS; k += 4) { g.fillStyle = ((k / 4 + tx * 4) % 2) ? c2 : c1; g.beginPath(); g.arc(x + k + 2, y + 5, 2, 0, Math.PI); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 4, TS, 1);
    return true;
  }
  if ((t === T.G || t === T.H) && ty === 18 && tileAt(tx, ty - 1) !== T.G) {          // the street surface
    const z = s3zone(tx), dmg = thp[i] < HPS[t];
    const base = z === 'station' ? '#6a5a50' : z === 'studio' ? '#7a6248' : z === 'docks' ? '#4a4038' : '#8a6448';
    g.fillStyle = base; g.fillRect(x, y, TS, TS);
    g.fillStyle = 'rgba(255,230,190,0.18)'; g.fillRect(x, y, TS, 2);
    if (z === 'station') { g.fillStyle = '#d8c070'; g.fillRect(x, y + 2, TS, 1.5); g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(x + ((tx * 7) % 16), y + 6, 1, 10); g.fillRect(x, y + 9, TS, 0.6); }
    else if (z === 'docks') { g.fillStyle = '#5a4a3a'; for (let k = 0; k < TS; k += 4) g.fillRect(x + k, y + 2, 1, 14); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 2, TS, 0.6); }
    else {
      const off = (tx % 2) * 4;                                                   // cobbles
      g.fillStyle = 'rgba(0,0,0,0.22)';
      for (let r = 0; r < 3; r++) { const yy = y + 3 + r * 4.5; g.fillRect(x, yy, TS, 0.6); for (let k = (r % 2 ? off : 8 - off); k < TS; k += 8) g.fillRect(x + k, yy, 0.6, 4.5); }
      if (((tx * 13) % 7) === 0) { g.fillStyle = HOLI[(tx * 3) % 5]; g.globalAlpha = 0.35; g.fillRect(x + 3, y + 1, 7, 2); g.globalAlpha = 1; }
    }
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, y + TS - 1, TS, 1);
    if (dmg) { g.fillStyle = 'rgba(20,10,4,0.75)'; g.fillRect(x + 3, y + 4, 5, 1); g.fillRect(x + 7, y + 5, 1, 4); g.fillRect(x + 8, y + 9, 4, 1); }
    return true;
  }
  return false;
}
// ---------------- world space, behind the tiles: the structures holding the platforms up ----------------
function drawStage3Mid(cam) {
  if (STAGE !== 3 || !S3X.runs) return;
  const t = G.clock, L = cam.x - 40, R = cam.x + VW + 40;
  // the parked local train (its roofs are the platforms)
  for (const [a, b] of S3X.train) {
    const X0 = a * TS, X1 = (b + 1) * TS; if (X1 < L || X0 > R) continue;
    const y0 = 14 * TS + 4, y1 = 18 * TS - 3, W = X1 - X0;
    ctx.fillStyle = '#b8282a'; ctx.fillRect(X0, y0, W, y1 - y0); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(X0, y0, W, 9); ctx.fillRect(X0, y1 - 12, W, 4);
    ctx.fillStyle = '#7a1a1a'; ctx.fillRect(X0, y0 + 9, W, 1);
    for (let x = X0 + 6; x < X1 - 10; x += 14) {
      const door = ((x - X0) / 14 | 0) % 4 === 1;
      ctx.fillStyle = '#1a1a24'; ctx.fillRect(x, y0 + 12, door ? 10 : 9, door ? y1 - y0 - 16 : 12);
      ctx.fillStyle = 'rgba(255,214,140,0.35)'; ctx.fillRect(x, y0 + 12, door ? 10 : 9, door ? y1 - y0 - 16 : 12);
      if (!door) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x + 1, y0 + 14, 7, 1); ctx.fillRect(x + 1, y0 + 17, 7, 1); }
      else { ctx.fillStyle = 'rgba(30,20,30,0.85)'; ctx.fillRect(x + 2, y0 + 16 + Math.sin(t + x) * 1, 3, 12); ctx.fillRect(x + 2, y0 + 13, 3, 3); }
    }
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(X0 + 10, y1, 12, 3); ctx.fillRect(X1 - 22, y1, 12, 3);
    ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CHURCHGATE  FAST  6:15', X0 + W / 2, y0 + 5);
  }
  for (const r of S3X.runs) {
    const X0 = r.a * TS, X1 = (r.b + 1) * TS; if (X1 < L || X0 > R) continue;
    const z = s3zone(r.a), y = r.ty * TS + 5, gy = groundBelow(X0 + 8, (r.ty + 1) * TS);
    if (z === 'station' && r.ty === 14 && S3X.train.some(([a, b]) => r.a >= a && r.b <= b)) continue;
    if (z === 'docks') continue;
    if (z === 'studio') {                                                     // scaffolding + a painted scenery flat
      ctx.fillStyle = '#5a4630'; for (let x = X0 + 2; x < X1; x += 24) ctx.fillRect(x, y, 2, gy - y); ctx.fillRect(X1 - 4, y, 2, gy - y);
      ctx.strokeStyle = 'rgba(90,70,48,0.9)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = X0 + 2; x + 24 <= X1; x += 24) { ctx.moveTo(x, y); ctx.lineTo(x + 24, gy); ctx.moveTo(x + 24, y); ctx.lineTo(x, gy); } ctx.stroke();
      if (r.ty <= 14) {
        const fy = y - 2 - 42, fw = X1 - X0; ctx.fillStyle = '#d8c8a0'; ctx.fillRect(X0, fy, fw, 42);
        const sky = ctx.createLinearGradient(0, fy, 0, fy + 42); sky.addColorStop(0, '#6ab0e8'); sky.addColorStop(1, '#f0d8a0'); ctx.fillStyle = sky; ctx.fillRect(X0 + 2, fy + 2, fw - 4, 38);
        ctx.fillStyle = '#8a9ab8'; ctx.beginPath(); ctx.moveTo(X0 + 2, fy + 40); ctx.lineTo(X0 + fw * 0.35, fy + 10); ctx.lineTo(X0 + fw * 0.6, fy + 30); ctx.lineTo(X0 + fw * 0.8, fy + 14); ctx.lineTo(X1 - 2, fy + 40); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(X0 + fw * 0.3, fy + 15); ctx.lineTo(X0 + fw * 0.35, fy + 10); ctx.lineTo(X0 + fw * 0.4, fy + 15); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(X0, fy + 40, fw, 2);
      }
      continue;
    }
    // market / station: two wooden posts and, on the street, a stall counter full of goods
    ctx.fillStyle = '#4a3020'; ctx.fillRect(X0 + 1, y, 2, gy - y); ctx.fillRect(X1 - 3, y, 2, gy - y);
    ctx.fillStyle = '#6a4a30'; ctx.fillRect(X0 + 1, y, 1, gy - y); ctx.fillRect(X1 - 3, y, 1, gy - y);
    if (gy === 18 * TS && gy - y > 30 && X1 - X0 >= 48) {
      const cy = gy - 16; ctx.fillStyle = '#5a3a24'; ctx.fillRect(X0 + 4, cy, X1 - X0 - 8, 16); ctx.fillStyle = '#7a5234'; ctx.fillRect(X0 + 4, cy, X1 - X0 - 8, 2);
      const goods = ['#ff7a2a', '#ffd23f', '#e83a3a', '#7ac83a', '#f0f0e0', '#b04ad0'];
      for (let x = X0 + 7, k = r.a; x < X1 - 12; x += 7, k++) { ctx.fillStyle = goods[k % goods.length]; ctx.beginPath(); ctx.arc(x + 3, cy - 2, 3, Math.PI, 0); ctx.fill(); ctx.fillRect(x, cy - 2, 6, 2); }
      ctx.fillStyle = 'rgba(255,214,140,0.25)'; ctx.fillRect(X0 + 4, y, X1 - X0 - 8, cy - y);              // lamp-lit back of the stall
      ctx.fillStyle = '#ffe08a'; ctx.fillRect(X0 + (X1 - X0) / 2 - 1, y + 1, 2, 4 + Math.sin(t * 2 + r.a));
      for (let k = 0; k < 5; k++) { ctx.fillStyle = ['#ff8a1a', '#ffd23f'][k % 2]; ctx.fillRect(X0 + 6 + k * (X1 - X0 - 12) / 4, y + 1, 2, 7 + (k % 2) * 3); }   // marigold strings
    }
  }
  // studio: spotlights on stands throwing coloured beams
  if (S3X.studio * TS < R && S3X.docks * TS > L) for (const [c, col] of [[268, '255,90,170'], [292, '60,200,255'], [314, '255,190,60'], [334, '255,90,170']]) {
    const x = c * TS, gy = 18 * TS, sw = Math.sin(t * 0.7 + c) * 0.4;
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x - 1, gy - 46, 2, 46); ctx.fillRect(x - 8, gy - 2, 16, 2);
    ctx.save(); ctx.translate(x, gy - 50); ctx.rotate(-0.9 + sw);
    ctx.fillStyle = '#3a3a3a'; ctx.fillRect(-6, -5, 14, 10); ctx.fillStyle = '#fff6c0'; ctx.fillRect(8, -4, 2, 8);
    ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createLinearGradient(10, 0, 180, 0); gr.addColorStop(0, 'rgba(' + col + ',0.35)'); gr.addColorStop(1, 'rgba(' + col + ',0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(10, -4); ctx.lineTo(180, -40); ctx.lineTo(180, 40); ctx.lineTo(10, 4); ctx.fill(); ctx.restore();
  }
  // the passing express on the far track (station zone): purely for the view, horn included
  if (S3X.ex) {
    const e = S3X.ex, y1 = 18 * TS - 2;
    for (let k = 0; k < 6; k++) { const x = e.x - k * 92; if (x < L - 100 || x > R) continue; ctx.globalAlpha = 0.55; ctx.fillStyle = k ? '#3a6a9a' : '#e8c040'; ctx.fillRect(x, y1 - 40, 88, 36); ctx.fillStyle = '#ffe8b0'; for (let w = 6; w < 82; w += 12) ctx.fillRect(x + w, y1 - 32, 7, 7); ctx.globalAlpha = 1; }
  }
}
// ---------------- screen space, in front of everything: bunting overhead, a dark crowd along the bottom ----------------
function drawStage3Front() {
  const c = G.cam, cx = c.x + VW / 2, z = s3zone(Math.floor(cx / TS)), t = G.clock;
  if (z === 'market' || z === 'station' || z === 'studio') {
    const off = (c.x * 1.35) % 220;
    for (let k = -1; k < 4; k++) {
      const x0 = k * 220 - off, sag = 18;
      ctx.strokeStyle = 'rgba(30,20,20,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, -2); ctx.quadraticCurveTo(x0 + 110, sag * 2, x0 + 220, -2); ctx.stroke();
      for (let f = 1; f < 14; f++) { const u = f / 14, fx = x0 + 220 * u, fy = -2 + 4 * sag * u * (1 - u) * 2 / 2; ctx.fillStyle = z === 'studio' ? ['#ff5ab0', '#3ad0ff', '#ffd23f'][f % 3] : HOLI[(f + k + 5) % 5]; ctx.beginPath(); ctx.moveTo(fx - 3, fy); ctx.lineTo(fx + 3, fy); ctx.lineTo(fx + Math.sin(t * 3 + f) * 0.8, fy + 7); ctx.fill(); }
    }
  }
  const hor = 18 * TS - c.y + 6; if (hor > VH - 4) return;
  const off2 = (c.x * 1.5) % 40;
  ctx.fillStyle = z === 'docks' ? '#06060c' : '#140810';
  for (let k = -1; k < VW / 40 + 2; k++) {
    const x = k * 40 - off2, h = 8 + ((k * 7 + Math.floor(c.x * 1.5 / 40)) % 3) * 3;
    if (z === 'docks') { ctx.fillRect(x, hor + 10, 40, VH); ctx.fillRect(x + 4, hor + 4, 3, 8); continue; }   // a bollard-and-rope rail
    ctx.beginPath(); ctx.arc(x + 12, VH - h - 2, 6, 0, 6.283); ctx.arc(x + 30, VH - h + 3, 6, 0, 6.283); ctx.fill();
    ctx.fillRect(x + 4, VH - h + 2, 34, h + 4);
  }
}
// ---------------- the stage's running gags ----------------
function updStage3X(dt) {
  const p = G.player;
  if (G.danceT > 0) { G.danceT -= dt; if (G.danceT <= 0) { popup(p.x + 5, p.y - 26, 'CUT!  BACK TO THE FIGHT.', '#ffffff', true); audio.play('clang'); } }
  if (!S3X.danced && !p.dead && p.x > 284 * TS && G.mode === 'play') {          // SONG BREAK: everyone on screen dances for a few seconds
    S3X.danced = true; G.danceT = 4.5; for (const e of G.enemies) if (!e.dead && !e.para && onScreen(e, 40)) makeDance(e, 4.5); popup(p.x + 5, p.y - 30, '♪  SONG BREAK!  ♪', '#ff5ab0', true); audio.play('roar');
    for (let k = 0; k < 20; k++) part('smoke', p.x + rnd(-160, 160), p.y + rnd(-60, 10), rnd(-40, 40), rnd(-60, -10), 1.4, 5, HOLI[k % 5], { grow: 12, a: 0.6 });
    G.timeScale = 0.6; G.slowT = 0.6;
  }
  const cxT = (G.cam.x + VW / 2) / TS;                                              // an express rushes past behind the platform
  if (cxT > S3X.station && cxT < S3X.studio) {
    if (!S3X.ex) { S3X.exT -= dt; if (S3X.exT <= 0) { S3X.ex = { x: G.cam.x - 40 }; audio.play('warn'); popup(G.cam.x + VW * 0.7, 9 * TS, 'HOOOONK!', '#ffd23f'); } }
    else { S3X.ex.x += 520 * dt; if (S3X.ex.x > G.cam.x + VW + 600) { S3X.ex = null; S3X.exT = rnd(9, 14); } else if (Math.random() < dt * 3) shake(0.05); }
  }
}
// ---------------- the stage-03 backdrop: four paintings blend into one another as you walk ----------------
function drawMumbaiArt(cam) {
  const hor = 18 * TS - cam.y, cxT = (cam.x + VW / 2) / TS;
  const zones = [[0, S3BG, 0.847], [S3X.station, S3IMG.station, 0.808], [S3X.studio, S3IMG.studio, 0.808], [S3X.docks, S3IMG.docks, 0.808]];
  const draw = (z, alpha) => {
    const [x0, im, gf] = z; if (!im || alpha <= 0) return false;
    const h = VH + 12, w = Math.round(im.width * h / im.height), y = Math.round(hor + 3 - gf * h), off = (cam.x - x0 * TS + VW * 0.15) * 0.22, i0 = Math.floor(off / w);
    ctx.globalAlpha = alpha;
    for (let i = i0; i <= i0 + Math.ceil(VW / w) + 1; i++) { const x = Math.round(i * w - off); if (i & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(im, x, y, w, h); }
    if (y > 0) { ctx.fillStyle = '#1a0a1a'; ctx.fillRect(0, 0, VW, y + 1); }
    ctx.globalAlpha = 1; return true;
  };
  let zi = 0; for (let k = 0; k < zones.length; k++) if (cxT >= zones[k][0]) zi = k;
  const pv = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  let cur = zi; while (cur > 0 && !zones[cur][1]) cur--;                         // fall back to the previous painting if one is missing
  draw(zones[cur], 1);
  const nx = zones[zi + 1]; if (nx && nx[1]) { const k = clamp((cxT - (nx[0] - 14)) / 14, 0, 1); if (k > 0) draw(nx, k); }
  ctx.imageSmoothingEnabled = pv;
  ctx.fillStyle = 'rgba(30,8,30,0.14)'; ctx.fillRect(0, 0, VW, VH);
}
// ---------------- THE GUNBOAT, redrawn: rust, rivets, portholes, a searchlight, and the Don in the wheelhouse ----------------
function drawGunboatAt(x, y, s, alpha, flash, deck, b) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = alpha;
  if (b && b.dying > 0) { ctx.translate(70, 0); ctx.rotate(-(1 - b.dying / 2.2) * 0.25); ctx.translate(-70, (1 - b.dying / 2.2) * 26); }
  const F = flash, c = (a) => F ? '#ffffff' : a, t = G.clock;
  // hull: dark steel with a rusty waterline, rivets and a painted name
  ctx.fillStyle = c('#3a4650'); ctx.beginPath(); ctx.moveTo(-14, -4); ctx.lineTo(146, -4); ctx.lineTo(132, 28); ctx.lineTo(4, 28); ctx.fill();
  ctx.fillStyle = c('#2a333c'); ctx.beginPath(); ctx.moveTo(-6, 14); ctx.lineTo(140, 14); ctx.lineTo(132, 28); ctx.lineTo(4, 28); ctx.fill();
  ctx.fillStyle = c('#8a3a1a'); ctx.fillRect(-4, 10, 140, 3); ctx.fillStyle = c('#c84a1a'); for (let k = 0; k < 9; k++) ctx.fillRect(4 + k * 15, 13, 4 + (k % 3), 4 + (k % 2) * 3);   // rust streaks
  ctx.fillStyle = c('#5a6672'); for (let k = 0; k < 18; k++) ctx.fillRect(-6 + k * 8, -2, 1, 1);
  ctx.fillStyle = c('#1a1a1a'); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(14 + k * 24, 4, 2.5, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = F ? '#fff' : '#ffd060'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(14 + k * 24, 4, 1.5, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = c('#e8dcc0'); ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('राजा  RAJA-1', 70, 21);
  ctx.fillStyle = c('#1a1a1a'); for (const fx of [20, 60, 100]) { ctx.beginPath(); ctx.arc(fx, 2, 4, 0, 6.283); ctx.fill(); ctx.fillStyle = c('#3a3a3a'); ctx.beginPath(); ctx.arc(fx, 2, 2, 0, 6.283); ctx.fill(); ctx.fillStyle = c('#1a1a1a'); }   // tyre fenders
  // deck rail
  ctx.fillStyle = c('#8a929a'); ctx.fillRect(-8, -12, 152, 1.5); for (let k = 0; k < 20; k++) ctx.fillRect(-8 + k * 8, -12, 1, 8);
  // wheelhouse
  ctx.fillStyle = c('#4a5662'); ctx.fillRect(40, -64, 64, 60); ctx.fillStyle = c('#5a6672'); ctx.fillRect(40, -64, 64, 4); ctx.fillStyle = c('#2a333c'); ctx.fillRect(40, -8, 64, 4);
  ctx.fillStyle = c('#c84a1a'); ctx.fillRect(40, -40, 64, 2);
  for (let k = 0; k < 4; k++) { ctx.fillStyle = c('#1a2028'); ctx.fillRect(45 + k * 15, -56, 11, 12); ctx.fillStyle = F ? '#fff' : 'rgba(255,214,120,0.75)'; ctx.fillRect(45 + k * 15, -56, 11, 12); }
  if (deck && !F) {                                   // the Don: white safari suit, dark glasses, gold chain, pointing
    const dx = 62 + Math.sin(t * 0.8) * 6, ang = b && b.state === 'idle' ? Math.sin(t * 3) * 2 : 0;
    ctx.fillStyle = '#141014'; ctx.fillRect(dx - 3, -58, 7, 3); ctx.fillStyle = '#c8905a'; ctx.fillRect(dx - 2, -55, 5, 5); ctx.fillStyle = '#0a0a0a'; ctx.fillRect(dx - 2, -54, 5, 1.5);
    ctx.fillStyle = '#f0ece0'; ctx.fillRect(dx - 4, -50, 9, 6); ctx.fillStyle = '#ffd23f'; ctx.fillRect(dx - 1, -50, 3, 1);
    ctx.fillStyle = '#f0ece0'; ctx.fillRect(dx - 10, -50 + ang, 7, 2); ctx.fillStyle = '#c8905a'; ctx.fillRect(dx - 12, -51 + ang, 2, 2);
  }
  ctx.fillStyle = c('#2a2a2a'); ctx.fillRect(98, -78, 2, 16); ctx.fillRect(86, -80, 30, 1.5);                     // mast + yard
  ctx.fillStyle = Math.sin(t * 4) > 0 ? '#ff3a2a' : '#5a1a1a'; ctx.fillRect(97, -82, 4, 3);
  ctx.fillStyle = c('#3a4650'); ctx.fillRect(72, -90, 14, 28); ctx.fillStyle = c('#c84a1a'); ctx.fillRect(72, -84, 14, 4); ctx.fillStyle = c('#141414'); ctx.fillRect(71, -92, 16, 3);   // funnel
  if (!F && Math.random() < 0.3) part('smoke', x + 79 * s, y - 92 * s, rnd(-20, 10), rnd(-50, -20), 1.4, 4, '#3a3a3a', { grow: 10, a: 0.4 });
  // bow gun turret
  ctx.fillStyle = c('#5a6672'); ctx.beginPath(); ctx.arc(26, -10, 9, Math.PI, 0); ctx.fill(); ctx.fillStyle = c('#3a4650'); ctx.fillRect(2, -16, 22, 5); ctx.fillRect(0, -17, 4, 7);
  // searchlight on the wheelhouse roof
  ctx.fillStyle = c('#2a2a2a'); ctx.fillRect(48, -70, 8, 6); ctx.fillStyle = '#fff6c0'; ctx.fillRect(46, -69, 2, 4);
  ctx.fillStyle = c('#ff8a1a'); ctx.fillRect(110, -74, 18, 10); ctx.fillStyle = c('#ffffff'); ctx.fillRect(110, -71, 18, 3); ctx.fillStyle = c('#2a8a3a'); ctx.fillRect(110, -68, 18, 4);
  ctx.restore();
  if (deck && !flash && b && !(b.dying > 0)) {                     // the searchlight beam sweeps the pier
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x + 47 * s, y - 67 * s); ctx.rotate(Math.PI + 0.35 + Math.sin(G.clock * 0.9) * 0.3);
    const gr = ctx.createLinearGradient(0, 0, 220, 0); gr.addColorStop(0, 'rgba(255,246,190,0.35)'); gr.addColorStop(1, 'rgba(255,246,190,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(220, -34); ctx.lineTo(220, 34); ctx.lineTo(0, 2); ctx.fill(); ctx.restore();
  }
}
function gunboatExtra(b, dt) {                // phase 2 adds deck-hands; the Don has things to say
  if (b.state === 'enter' || b.dead) return;
  if (b.dying > 0) { if (!b.sayDie) { b.sayDie = true; popup(b.x + 30, b.y - 50, '"MERA... BOAT!"', '#ffffff', true); } return; }
  b.callT = (b.callT || 9) - dt;
  if (b.phase === 2 && b.callT <= 0) {
    b.callT = 10;
    popup(b.x + 30, b.y - 50, ['"BOYS! GET HIM!"', '"WHAT AM I PAYING YOU FOR?!"', '"KILL HIM — SLOWLY!"'][(Math.random() * 3) | 0], '#ffffff', true);
    dropIn('soldier', DOCK.gate + 4); dropIn(Math.random() < 0.5 ? 'knife' : 'soldier', DOCK.gate + 9);
  }
  if (!b.said50 && b.hp < b.maxHp * 0.5) { b.said50 = true; popup(b.x + 30, b.y - 62, '"YOU KNOW WHO I AM?!"', '#ffd23f', true); }
}
